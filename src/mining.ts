
import { defaultDatabase } from "./environment"
import { mineRateUpgrade, storageUpgrade, oreInfo } from "./resources";
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

        const asteroidCapacity = user.val().asteroid.currentCapacity;
        const maxMinerate = (mineRateUpgrade[user.val().upgrade.mineRate.lvl].maxRate *
            oreInfo[user.val().asteroid.ore].miningSpeed * (user.val().asteroid.purity / 100)) + 0.1; // +0.1 to avoid false comparison

        const maxAmount = storageUpgrade[user.val().upgrade.storage.lvl].capacity;
        const currentAmount = user.val().ore[data.ore];

        if (user.val().frenzy.state == 1) {
            updateFrenzyTimer(data.user);
        }
        else {
            if (data.amount <= maxMinerate && asteroidCapacity > 0 && currentAmount < maxAmount) {

                let newAmount = currentAmount + data.amount;
                let newCapacity = asteroidCapacity - data.amount;

                if (currentAmount + data.amount > maxAmount) {
                    data.amount = maxAmount - currentAmount;
                    newAmount = maxAmount;
                    newCapacity = asteroidCapacity - data.amount;
                }
                if (asteroidCapacity - data.amount < 0) {
                    const message = {
                        'userID': data.user,
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

                checkQuest(data.ore, data.amount, user.val(), data.user);
                checkQuestGroup(data.ore, data.amount);
                defaultDatabase.ref("users/" + data.user + "/asteroid/currentCapacity").set(toFixed2(newCapacity));
                defaultDatabase.ref("users/" + data.user + "/ore/" + data.ore).set(toFixed2(newAmount));

                const eventOrNot = Math.floor((Math.random() * 100000) + 1);
                if (eventOrNot < 3) {
                    defaultDatabase.ref("users/" + data.user + "/event").set(1);
                }

            }
        }
    });
}

export function reachFrenzy(data) {
    defaultDatabase.ref("users/" + data.user ).once('value').then((user) => {
        if (user.val().frenzy.state == 0) {
            defaultDatabase.ref("users/" + data.user + "/frenzy/state").set(1);
            defaultDatabase.ref("users/" + data.user + "/frenzy/start").set(Date.now());
            defaultDatabase.ref("users/" + data.user + "/frenzy/nextCombo").set(Math.floor(Math.random()*4));
            defaultDatabase.ref("users/" + data.user + "/frenzy/timer").set
            (mineRateUpgrade[user.val().upgrade.mineRate.lvl].frenzyTime * 1000);
        }
    });
}

function updateFrenzyTimer(userId) {
    defaultDatabase.ref("users/" + userId).once('value').then((user) => {
        const mineRateLvl = user.val().upgrade.mineRate.lvl;
        let timer = (mineRateUpgrade[mineRateLvl].frenzyTime * 1000) -
            (Date.now() - user.val().frenzy.start);
        if (timer <= 0) {
            timer = 0;
            defaultDatabase.ref("users/" + userId + "/frenzy/state").set(0);
        }
        defaultDatabase.ref("users/" + userId + "/frenzy/timer").set(timer);
    });
}