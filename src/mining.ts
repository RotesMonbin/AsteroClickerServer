
import { defaultDatabase } from "./environment"
import { mineRateUpgrade, storageUpgrade, oreInfos } from "./resources";
import { toFixed2 } from "./utils";
import { checkQuest, checkQuestGroup, newChest } from "./quest";

/*
data = {
    user : userId,
    ore: oreName,
    amount: oreIncreasing
}
*/
export function incrementOre(data) {
    defaultDatabase.ref("users/" + data.user).once('value').then((user) => {
        const maxMinerate = (mineRateUpgrade[user.val().upgrade.mineRate.lvl].maxRate *
            oreInfos[user.val().asteroid.ore].miningSpeed * (user.val().asteroid.purity / 100)) + 0.1; // +0.1 to avoid false comparison

        if (user.val().frenzy.info.state == 1) {
            updateFrenzyTimer(data.user);
        }
        else {
            if (data.amount <= maxMinerate) {

                controlAndAddOreAmount(data.user, data.amount, data.ore)
                const eventOrNot = Math.floor((Math.random() * 100000) + 1);
                if (eventOrNot < 3) {
                    defaultDatabase.ref("users/" + data.user + "/event").set(1);
                }

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

            checkQuest(oreName, amount, user.val(), userId);
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