"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("./environment");
const resources_1 = require("./resources");
const utils_1 = require("./utils");
const quest_1 = require("./quest");
function incrementOre(data) {
    environment_1.defaultDatabase.ref("users/" + data.user).once('value').then((user) => {
        const maxMinerate = resources_1.mineRateUpgrade[user.val().mineRateLvl].maxRate *
            resources_1.oreInfo[user.val().asteroid.ore].miningSpeed;
        if (data.amount <= maxMinerate) {
            const currentAmount = user.val()[data.ore];
            const maxAmount = resources_1.storageUpgrade[user.val().storageLvl].capacity;
            if (currentAmount < maxAmount) {
                if (currentAmount + data.amount <= maxAmount) {
                    environment_1.defaultDatabase.ref("users/" + data.user + "/" + data.ore).set(utils_1.toFixed2(currentAmount + data.amount));
                    quest_1.checkQuest(data.ore, data.amount, user.val(), data.user);
                }
                else {
                    environment_1.defaultDatabase.ref("users/" + data.user + "/" + data.ore).set(maxAmount);
                }
            }
        }
    });
}
exports.incrementOre = incrementOre;
//# sourceMappingURL=mining.js.map