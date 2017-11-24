
import { defaultDatabase } from "./environment"
import { mineRateUpgrade, storageUpgrade, oreInfo } from "./resources";
import { toFixed2 } from "./utils";
import { checkQuest, checkQuestGroup } from "./quest";

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
        const maxMinerate = (mineRateUpgrade[user.val().upgrade.mineRateLvl].maxRate *
            oreInfo[user.val().asteroid.ore].miningSpeed * (user.val().asteroid.purity / 100)) + 0.1; // +0.1 to avoid false comparison

        const maxAmount = storageUpgrade[user.val().upgrade.storageLvl].capacity;
        const currentAmount = user.val().ore[data.ore];

        if (data.amount <= maxMinerate && asteroidCapacity > 0 && currentAmount < maxAmount) {

            let newAmount = currentAmount + data.amount;
            let newCapacity = asteroidCapacity - data.amount;

            if (currentAmount + data.amount > maxAmount) {
                data.amount = maxAmount - currentAmount;
                newAmount = maxAmount;
                newCapacity = asteroidCapacity - data.amount;
            }
            if (asteroidCapacity - data.amount < 0) {
                newAmount = currentAmount + data.amount;
                newCapacity = 0;
            }

            checkQuest(data.ore, data.amount, user.val(), data.user);
            checkQuestGroup(data.ore, data.amount, user.val(), data.user);
            defaultDatabase.ref("users/" + data.user + "/asteroid/currentCapacity").set(toFixed2(newCapacity));
            defaultDatabase.ref("users/" + data.user + "/ore/" + data.ore).set(toFixed2(newAmount));
        }

    });
}