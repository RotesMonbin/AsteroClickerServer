
import {defaultDatabase} from "./environment"
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
        const maxMinerate = mineRateUpgrade[user.val().upgrade.mineRateLvl].maxRate *
            oreInfo[user.val().asteroid.ore].miningSpeed;   
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
            }
        }
    });
}