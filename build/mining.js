"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("./environment");
const resources_1 = require("./resources");
const utils_1 = require("./utils");
const quest_1 = require("./quest");
function incrementOre(data) {
    environment_1.defaultDatabase.ref("users/" + data.user).once('value').then((user) => {
        const asteroidCapacity = user.val().asteroid.currentCapacity;
        const maxMinerate = (resources_1.mineRateUpgrade[user.val().upgrade.mineRate.lvl].maxRate *
            resources_1.oreInfo[user.val().asteroid.ore].miningSpeed * (user.val().asteroid.purity / 100)) + 0.1;
        const maxAmount = resources_1.storageUpgrade[user.val().upgrade.storage.lvl].capacity;
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
                const message = {
                    'userID': data.user,
                    'currentUser': user.val()
                };
                const chestOrNotRandom = Math.floor((Math.random() * 2) + 1);
                if (chestOrNotRandom === 2) {
                    quest_1.newChest(message);
                }
                newAmount = currentAmount + asteroidCapacity;
                newCapacity = 0;
            }
            quest_1.checkQuest(data.ore, data.amount, user.val(), data.user);
            quest_1.checkQuestGroup(data.ore, data.amount);
            environment_1.defaultDatabase.ref("users/" + data.user + "/asteroid/currentCapacity").set(utils_1.toFixed2(newCapacity));
            environment_1.defaultDatabase.ref("users/" + data.user + "/ore/" + data.ore).set(utils_1.toFixed2(newAmount));
            const eventOrNot = Math.floor((Math.random() * 100) + 1);
            if (eventOrNot < 3) {
                environment_1.defaultDatabase.ref("users/" + data.user + "/event").set(1);
            }
        }
    });
}
exports.incrementOre = incrementOre;
//# sourceMappingURL=mining.js.map