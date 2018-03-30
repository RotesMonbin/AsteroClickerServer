import { defaultDatabase } from "./environment"
import { mineRateUpgrade, storageUpgrade, oreInfos } from "./resources";
import { toFixed2 } from "./utils";
import { checkQuest, checkQuestGroup, newChest } from "./quest";
import { error } from 'util';
import { validationTutorial } from './tutorial';

/*
data = {
    user : userId,
    amount: amountBroke
}
*/
export function breakIntoCollectible(data) {
    defaultDatabase.ref("users/" + data.user + "/miningInfo/lastTick").once('value').then((lastTick) => {
        const timeElapsedSinceLastTick = Date.now() - lastTick.val();
        if (timeElapsedSinceLastTick > 900) {
            controlAndBreakAsteroid(data.user, data.amount, false);
            defaultDatabase.ref("users/" + data.user + "/miningInfo/lastTick").set(Date.now());
        }
    });
}

function controlAndBreakAsteroid(userId: string, amount: number, fromClick: boolean) {
    defaultDatabase.ref("users/" + userId + "/asteroid").once('value').then((asteroid) => {
        defaultDatabase.ref("users/" + userId + "/upgrade/mineRate/lvl").once('value').then((mineRateLvl) => {
            defaultDatabase.ref("users/" + userId + "/profile").once('value').then((profile) => {
                const mineRate = (mineRateUpgrade[mineRateLvl.val()].baseRate *
                    oreInfos[asteroid.val().ore].miningSpeed * (asteroid.val().purity / 100)) + 0.1; // +0.1 to avoid false comparison

                if (fromClick) {
                    amount = mineRate * 10;
                }

                /* if (user.val().frenzy.info.state == 1) {
                     updateFrenzyTimer(userId);
                 }
                 else {*/

                if (profile.val().step < 10) {
                    defaultDatabase.ref("users/" + userId + "/ore/carbon").once('value').then((carbonAmount) => {
                        validationTutorial(userId, carbonAmount.val());
                    });
                }
                if (fromClick || amount <= mineRate) {
                    let newCollectibleQuantity;
                    if (asteroid.val().collectible < asteroid.val().currentCapacity) {

                        defaultDatabase.ref("users/" + userId + "/asteroid/collectible").transaction((quantity) => {
                            if (quantity + amount > asteroid.val().currentCapacity) {
                                return toFixed2(asteroid.val().currentCapacity);
                            }

                            return toFixed2(quantity + amount);
                        });
                    }
                    const eventOrNot = Math.floor((Math.random() * 100000) + 1);
                    if (eventOrNot < 3) {
                        defaultDatabase.ref("users/" + userId + "/event").set(1);
                    }
                }
                //}
            });
        });
    });
}

/**
 * @param data [user] : userId, [amount] : click to add
 */
export function updateClickGauge(data) {

    defaultDatabase.ref("users/" + data.user + "/miningInfo").once('value').then((miningInfo) => {
        let newValue = 0;
        if (data.amount == 0) {
            newValue = (miningInfo.val().clickGauge - 5) < 0 ? 0 : miningInfo.val().clickGauge - 5;
        }
        else {
            if ((miningInfo.val().clickGauge + data.amount) >= 50) {
                const timeElapsedSinceLastTick = Date.now() - miningInfo.val().lastClickExplosion;
                if (timeElapsedSinceLastTick >= 2500) {
                    controlAndBreakAsteroid(data.user, 0, true);
                    defaultDatabase.ref("users/" + data.user + "/miningInfo/lastClickExplosion").set(Date.now());
                }
            }
            newValue = (miningInfo.val().clickGauge + data.amount) % 50;
        }
        defaultDatabase.ref("users/" + data.user + "/miningInfo/clickGauge").set(newValue);
    });

}

/*
data = {
    user : userId,
    ore: oreName,
    amount: amountBroke
}
*/
export function pickUpCollectible(data) {
    data.amount = parseFloat(data.amount);    
    defaultDatabase.ref("users/" + data.user).once('value').then((user) => {
        const maxMinerate = (mineRateUpgrade[user.val().upgrade.mineRate.lvl].maxRate *
            oreInfos[user.val().asteroid.ore].miningSpeed * (user.val().asteroid.purity / 100)) + 0.1; // +0.1 to avoid false comparison

        const maxQuantity = storageUpgrade[user.val().upgrade.storage.lvl].capacity;
        if (data.amount <= maxMinerate && data.ore == user.val().asteroid.ore && user.val().ore[data.ore] < maxQuantity) {

            if (user.val().asteroid.collectible > 0 && user.val().asteroid.currentCapacity > 0) {
                defaultDatabase.ref("users/" + data.user + "/asteroid/collectible").transaction((quantity) => {
                    if (quantity - data.amount < 0) {
                        return 0;
                    }
                    return toFixed2(quantity - data.amount);
                });

                defaultDatabase.ref("users/" + data.user + "/asteroid/currentCapacity").transaction((currentCapacity) => {
                    if ((currentCapacity - data.amount) > 0) {
                        return toFixed2(currentCapacity - data.amount);
                    }
                    else {
                        return 0;
                    }
                });

                defaultDatabase.ref("users/" + data.user + "/ore/" + data.ore).transaction((oreQuantity) => {
                    return toFixed2(oreQuantity + data.amount);
                });
            }
        }
    });
}

function controlAndAddOreAmount(userId: string, amount: number, oreName: string) {
    defaultDatabase.ref("users/" + userId).once('value').then((user) => {

        const asteroidCapacity = user.val().asteroid.currentCapacity;
        const maxAmount = storageUpgrade[user.val().upgrade.storage.lvl].capacity;
        const currentAmount = user.val().ore[oreName];

        if (asteroidCapacity > 0 && currentAmount < maxAmount) {

            let newAmount = currentAmount + amount;
            let newCapacity = asteroidCapacity - amount;

            if (currentAmount + amount > maxAmount) {
                amount = maxAmount - currentAmount;
                newAmount = maxAmount;
                newCapacity = asteroidCapacity - amount;
            }
            if (asteroidCapacity - amount < 0) {
                const message = {
                    'userID': userId,
                    'currentUser': user.val()
                };

                // new chest when you destroy the asteroid
                const chestOrNotRandom = Math.floor((Math.random() * 2) + 1);
                if (chestOrNotRandom === 2) {
                    newChest(message);
                }

                newAmount = currentAmount + asteroidCapacity;
                newCapacity = 0;
            }

            checkQuest(oreName, amount, userId);
            checkQuestGroup(oreName, amount);
            defaultDatabase.ref("users/" + userId + "/asteroid/currentCapacity").set(toFixed2(newCapacity));
            defaultDatabase.ref("users/" + userId + "/ore/" + oreName).set(toFixed2(newAmount));

        }
    });
}

export function reachFrenzy(data) {
    defaultDatabase.ref("users/" + data.user).once('value').then((user) => {
        if (user.val().frenzy.info.state == 0) {
            defaultDatabase.ref("users/" + data.user + "/frenzy/time/start").set(Date.now());
            let nextCombos = {};

            for (let i = 0; i < 100; i++) {
                nextCombos[i] = Math.floor(Math.random() * 4);
            }

            defaultDatabase.ref("users/" + data.user + "/frenzy/info/nextCombos").set(nextCombos);
            defaultDatabase.ref("users/" + data.user + "/frenzy/time/timer").set
                (mineRateUpgrade[user.val().upgrade.mineRate.lvl].frenzyTime * 1000);
            defaultDatabase.ref("users/" + data.user + "/frenzy/info/state").set(1);
        }
    });
}

function updateFrenzyTimer(userId) {
    defaultDatabase.ref("users/" + userId).once('value').then((user) => {
        const mineRateLvl = user.val().upgrade.mineRate.lvl;
        let timer = (mineRateUpgrade[mineRateLvl].frenzyTime * 1000) -
            (Date.now() - user.val().frenzy.time.start);
        if (timer <= 0) {
            timer = 0;
            defaultDatabase.ref("users/" + userId + "/frenzy/info/state").set(0);
        }
        defaultDatabase.ref("users/" + userId + "/frenzy/time/timer").set(timer);
    });
}

/*
    json['user'] = userId;
    json['keyCode'] = keyCode;
    json['keyInd'] = keyInd;
*/
export function validArrow(message) {
    defaultDatabase.ref("users/" + message.user).once('value').then((user) => {
        if (user.val().frenzy.info.state === 1) {
            if (message.keyCode === user.val().frenzy.info.nextCombos[message.keyInd]) {
                const maxMinerate = (mineRateUpgrade[user.val().upgrade.mineRate.lvl].maxRate *
                    oreInfos[user.val().asteroid.ore].miningSpeed * (user.val().asteroid.purity / 100)) + 0.1;

                controlAndAddOreAmount(message.user, maxMinerate * 5, user.val().asteroid.ore);
                if (user.val().asteroid.currentCapacity <= 0) {
                    defaultDatabase.ref("users/" + message.user + "/frenzy/info/state").set(0);
                }
            } else {
                defaultDatabase.ref("users/" + message.user + "/frenzy/time/start").set(0);
            }
        }
    });
}