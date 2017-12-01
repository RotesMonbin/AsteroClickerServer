"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("./environment");
const quest_1 = require("./quest");
const utils_1 = require("./utils");
const resources_1 = require("./resources");
function sellOre(data) {
    environment_1.defaultDatabase.ref("users/" + data.user).once('value').then((user) => {
        const currentOreAmount = user.val().ore[data.ore];
        if (currentOreAmount > 0) {
            environment_1.defaultDatabase.ref("trading/" + data.ore).once('value').then((oreValue) => {
                var keys = Object.keys(oreValue.val());
                const currentValue = oreValue.val()[keys[29]];
                if (currentOreAmount < data.amount) {
                    data.amount = currentOreAmount;
                }
                environment_1.defaultDatabase.ref("users/" + data.user + "/credit").set(utils_1.toFixed2(user.val().credit + currentValue * data.amount));
                environment_1.defaultDatabase.ref("users/" + data.user + "/ore/" + data.ore).set(utils_1.toFixed2(currentOreAmount - data.amount));
                quest_1.checkQuest('sell' + data.ore, data.amount, user.val(), data.user);
                quest_1.checkQuest('credit', currentValue * data.amount, user.val(), data.user);
            });
            environment_1.defaultDatabase.ref("trend/" + data.ore).once('value').then((trend) => {
                environment_1.defaultDatabase.ref("trend/" + data.ore).set(trend.val() - data.amount);
            });
        }
    });
}
exports.sellOre = sellOre;
function buyOre(data) {
    environment_1.defaultDatabase.ref("users/" + data.user).once('value').then((user) => {
        const currentCredit = user.val().credit;
        environment_1.defaultDatabase.ref("trading/" + data.ore).once('value').then((oreValue) => {
            var keys = Object.keys(oreValue.val());
            const currentValue = oreValue.val()[keys[29]];
            const cost = data.amount * currentValue;
            if (currentCredit >= cost && utils_1.toFixed2(user.val().ore[data.ore] + data.amount) <= resources_1.storageUpgrade[user.val().upgrade.storageLvl].capacity) {
                environment_1.defaultDatabase.ref("users/" + data.user + "/credit").set(utils_1.toFixed2(user.val().credit - cost));
                environment_1.defaultDatabase.ref("users/" + data.user + "/ore/" + data.ore).set(utils_1.toFixed2(user.val().ore[data.ore] + data.amount));
                quest_1.checkQuest('buy' + data.ore, data.amount, user.val(), data.user);
            }
        });
        environment_1.defaultDatabase.ref("trend/" + data.ore).once('value').then((trend) => {
            environment_1.defaultDatabase.ref("trend/" + data.ore).set(trend.val() + data.amount);
        });
    });
}
exports.buyOre = buyOre;
//# sourceMappingURL=market.js.map