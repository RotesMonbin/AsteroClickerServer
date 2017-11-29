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
function updateCostsMarket() {
    environment_1.defaultDatabase.ref('trend').once('value').then(function (trendSnapshot) {
        environment_1.defaultDatabase.ref('trading').once('value').then(function (tradSnapshot) {
            environment_1.defaultDatabase.ref('oreInfo').once('value').then(function (oreSnapshot) {
                computeNewRate('carbon', tradSnapshot.val().carbon, trendSnapshot.val().carbon, oreSnapshot.val().carbon.maxValue, oreSnapshot.val().carbon.minValue, oreSnapshot.val().carbon.meanValue);
                computeNewRate('titanium', tradSnapshot.val().titanium, trendSnapshot.val().titanium, oreSnapshot.val().titanium.maxValue, oreSnapshot.val().titanium.minValue, oreSnapshot.val().titanium.meanValue);
<<<<<<< HEAD
                computeNewRate('fer', tradSnapshot.val().fer, trendSnapshot.val().fer, oreSnapshot.val().fer.maxValue, oreSnapshot.val().fer.minValue, oreSnapshot.val().fer.meanValue);
=======
>>>>>>> questNew
            });
        });
    });
}
exports.updateCostsMarket = updateCostsMarket;
function computeNewRate(oreName, oreCosts, oreTrend, maxValue, minValue, meanValue) {
    var jsonStr = oreCosts;
    var val = jsonStr[Object.keys(jsonStr)[Object.keys(jsonStr).length - 1]];
    var delta = (((Math.random() * ((meanValue / 2) - (meanValue / 10))) + (meanValue / 10)) / 100);
    if (oreTrend < 0) {
        delta = -delta;
    }
    else if (oreTrend == 0) {
        delta = (((Math.random() * ((meanValue / 2) - (meanValue / 10))) - (meanValue / 5)) / 100);
        if (val + delta <= minValue || val + delta > maxValue) {
            delta = -delta;
        }
    }
    if (val + delta > minValue && val + delta <= maxValue) {
        val += delta;
    }
    val = parseFloat(parseFloat(val).toFixed(2));
    if (Object.keys(jsonStr).length >= 40) {
        delete jsonStr[Object.keys(jsonStr)[0]];
    }
    jsonStr[Date.now()] = val;
    environment_1.defaultDatabase.ref('trading/' + oreName).set(jsonStr);
    environment_1.defaultDatabase.ref('trend/' + oreName).set(0);
}
//# sourceMappingURL=market.js.map