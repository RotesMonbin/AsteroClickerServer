
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
<<<<<<< HEAD
        const maxMinerate = (mineRateUpgrade[user.val().mineRateLvl].maxRate *
            oreInfo[user.val().asteroid.ore].miningSpeed * (user.val().asteroid.purity / 100)) + 0.1; // +0.1 to avoid false comparison
=======
        const maxMinerate = mineRateUpgrade[user.val().upgrade.mineRateLvl].maxRate *
            oreInfo[user.val().asteroid.ore].miningSpeed;   
>>>>>>> 676c2bcff5d6c804451f1b944693ddac9cfe02cc
        if (data.amount <= maxMinerate) {
            const currentAmount = user.val().ore[data.ore];
            const maxAmount = storageUpgrade[user.val().upgrade.storageLvl].capacity;
            if (currentAmount < maxAmount) {
                if (currentAmount + data.amount <= maxAmount) {
                    defaultDatabase.ref("users/" + data.user + "/ore/" + data.ore).set(
                        toFixed2(currentAmount + data.amount));
                    checkQuest(data.ore, data.amount, user.val(), data.user);
                    checkQuestGroup(data.ore, data.amount, user.val(), data.user);
                }
                else {
                    defaultDatabase.ref("users/" + data.user + "/ore/" + data.ore).set(maxAmount);
                }
                defaultDatabase.ref("users/" + data.user + "/asteroid/currentCapacity").set(toFixed2(user.val().asteroid.currentCapacity - data.amount));
            }
        }
    });
}