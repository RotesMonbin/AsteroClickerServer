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
            environment_1.defaultDatabase.ref("trading/" + data.ore + "/recent").once('value').then((oreValue) => {
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
        environment_1.defaultDatabase.ref("trading/" + data.ore + "/recent").once('value').then((oreValue) => {
            var keys = Object.keys(oreValue.val());
            const currentValue = oreValue.val()[keys[29]];
            const cost = data.amount * currentValue;
            if (currentCredit >= cost && utils_1.toFixed2(user.val().ore[data.ore] + data.amount) <= resources_1.storageUpgrade[user.val().upgrade.storage.lvl].capacity) {
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
                const oreKeys = Object.keys(oreSnapshot.val());
                for (let i = 0; i < oreKeys.length; i++) {
                    computeNewRate(oreKeys[i], tradSnapshot.val()[oreKeys[i]], trendSnapshot.val()[oreKeys[i]], oreSnapshot.val()[oreKeys[i]]);
                }
            });
        });
    });
}
exports.updateCostsMarket = updateCostsMarket;
function updateMeanCosts() {
    environment_1.defaultDatabase.ref('trading').once('value').then(function (tradSnapshot) {
        const oreKeys = Object.keys(tradSnapshot.val());
        for (let i = 0; i < oreKeys.length; i++) {
            computeMean(oreKeys[i], tradSnapshot.val()[oreKeys[i]]);
        }
    });
}
exports.updateMeanCosts = updateMeanCosts;
function computeNewRate(oreName, oreCosts, oreTrend, oreInfos) {
    var jsonStr = oreCosts.recent;
    var val = jsonStr[Object.keys(jsonStr)[Object.keys(jsonStr).length - 1]];
    var delta = (((Math.random() * ((oreInfos.meanValue / 2) - (oreInfos.meanValue / 10))) + (oreInfos.meanValue / 10)) / 100);
    if (oreTrend < 0) {
        delta = -delta;
    }
    else if (oreTrend == 0) {
        delta = (((Math.random() * ((oreInfos.meanValue / 2) - (oreInfos.meanValue / 10))) - (oreInfos.meanValue / 5)) / 100);
        if (val + delta <= oreInfos.minValue || val + delta > oreInfos.maxValue) {
            delta = -delta;
        }
    }
    if (val + delta > oreInfos.minValue && val + delta <= oreInfos.maxValue) {
        val += delta;
    }
    val = parseFloat(parseFloat(val).toFixed(2));
    if (Object.keys(jsonStr).length >= 40) {
        delete jsonStr[Object.keys(jsonStr)[0]];
    }
    jsonStr[Date.now()] = val;
    environment_1.defaultDatabase.ref('trading/' + oreName + "/recent").set(jsonStr);
    environment_1.defaultDatabase.ref('trend/' + oreName).set(0);
}
function computeMean(oreName, oreCosts) {
    let history = oreCosts.history;
    const keys = Object.keys(oreCosts.recent);
    let mean = 0;
    for (let i = 0; i < keys.length; i++) {
        mean += oreCosts.recent[keys[i]];
    }
    mean = utils_1.toFixed2(mean / keys.length);
    if (Object.keys(history).length >= 40) {
        delete history[Object.keys(history)[0]];
    }
    history[Date.now()] = mean;
    environment_1.defaultDatabase.ref('trading/' + oreName + "/history").set(history);
}
//# sourceMappingURL=market.js.map