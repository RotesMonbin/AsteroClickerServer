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
                const currentValue = oreValue.val()[keys[keys.length - 1]];
                if (currentOreAmount < data.amount) {
                    data.amount = currentOreAmount;
                }
                environment_1.defaultDatabase.ref("users/" + data.user + "/credit").set(utils_1.toFixed2(user.val().credit + currentValue * data.amount));
                environment_1.defaultDatabase.ref("users/" + data.user + "/ore/" + data.ore).set(utils_1.toFixed2(currentOreAmount - data.amount));
                quest_1.checkQuest('sell' + data.ore, data.amount, user.val(), data.user);
                quest_1.checkQuest('credit', currentValue * data.amount, user.val(), data.user);
            });
            updateTrend(data.amount, data.ore);
        }
    });
}
exports.sellOre = sellOre;
function buyOre(data) {
    environment_1.defaultDatabase.ref("users/" + data.user).once('value').then((user) => {
        const currentCredit = user.val().credit;
        environment_1.defaultDatabase.ref("trading/" + data.ore + "/recent").once('value').then((oreValue) => {
            var keys = Object.keys(oreValue.val());
            const currentValue = oreValue.val()[keys[keys.length - 1]] * 1.025;
            const cost = data.amount * currentValue;
            if (currentCredit >= cost && utils_1.toFixed2(user.val().ore[data.ore] + data.amount) <= resources_1.storageUpgrade[user.val().upgrade.storage.lvl].capacity) {
                environment_1.defaultDatabase.ref("users/" + data.user + "/credit").set(utils_1.toFixed2(user.val().credit - cost));
                environment_1.defaultDatabase.ref("users/" + data.user + "/ore/" + data.ore).set(utils_1.toFixed2(user.val().ore[data.ore] + data.amount));
                quest_1.checkQuest('buy' + data.ore, data.amount, user.val(), data.user);
            }
        });
        updateTrend(-data.amount, data.ore);
    });
}
exports.buyOre = buyOre;
function updateTrend(amount, oreName) {
    environment_1.defaultDatabase.ref("trend/" + oreName).once('value').then((trend) => {
        let newTrend = trend.val() + amount;
        environment_1.defaultDatabase.ref("trend/" + oreName).set(newTrend);
    });
}
function updateCostsMarket() {
    environment_1.defaultDatabase.ref('trend').once('value').then(function (trendSnapshot) {
        environment_1.defaultDatabase.ref('trading').once('value').then(function (tradSnapshot) {
            environment_1.defaultDatabase.ref('oreInfo').once('value').then(function (oreSnapshot) {
                let trendSum = 0;
                let trendTab = trendSnapshot.val();
                const oreKeys = Object.keys(oreSnapshot.val());
                for (let i = 0; i < oreKeys.length; i++) {
                    computeNewRate(oreKeys[i], tradSnapshot.val()[oreKeys[i]], trendTab[oreKeys[i]], oreSnapshot.val()[oreKeys[i]], trendSum, oreKeys.length);
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
function computeNewRate(oreName, oreCosts, oreTrend, oreInfos, trendSum, numberOfOre) {
    let recentCostsJson = oreCosts.recent;
    let nextValuesJson = oreCosts.nextValues;
    let newVal;
    numberOfOre = numberOfOre;
    trendSum = trendSum;
    if (nextValuesJson == null) {
        const currentVal = recentCostsJson[Object.keys(recentCostsJson)[Object.keys(recentCostsJson).length - 1]];
        let meanDist = 0;
        if (currentVal != oreInfos.meanValue) {
            meanDist = currentVal < oreInfos.meanValue ?
                (oreInfos.meanValue - currentVal) / (oreInfos.meanValue - oreInfos.minValue) :
                (oreInfos.meanValue - currentVal) / (oreInfos.maxValue - oreInfos.meanValue);
        }
        const meanDelta = 0.20 * oreInfos.meanValue * meanDist;
        let delta = 0;
        if (oreTrend == 0) {
            delta = (Math.random() * 10) + 5;
            delta = (Math.random() * 100 >= 50) ? delta : -delta;
            delta = currentVal < oreInfos.meanValue ? -delta : delta;
        }
        else {
            delta = (Math.random() * 30) + 10;
            delta = oreTrend > 0 ? -delta : delta;
        }
        newVal = currentVal + meanDelta + utils_1.toFixed2((delta / 100) * oreInfos.meanValue);
        newVal = utils_1.toFixed2(newVal);
        nextValuesJson = computeRange(currentVal, newVal);
    }
    if (Object.keys(recentCostsJson).length >= 360) {
        delete recentCostsJson[Object.keys(recentCostsJson)[0]];
    }
    recentCostsJson[Date.now()] = nextValuesJson[Object.keys(nextValuesJson)[0]];
    delete nextValuesJson[Object.keys(nextValuesJson)[0]];
    environment_1.defaultDatabase.ref('trading/' + oreName + "/recent").set(recentCostsJson);
    environment_1.defaultDatabase.ref('trading/' + oreName + "/nextValues").set(nextValuesJson);
    environment_1.defaultDatabase.ref('trend/' + oreName).set(0);
}
function computeRange(start, end) {
    let coefBase = [0.05, 0.1, 0.1, 0.1, 0.15, 0.15, 0.2, 0.3, -0.1, -0.05];
    let coef = new Array();
    let range = new Array();
    const dist = end - start;
    let i = coefBase.length;
    let j = 0;
    while (i--) {
        j = Math.floor(Math.random() * (i + 1));
        coef.push(coefBase[j]);
        coefBase.splice(j, 1);
    }
    range[0] = utils_1.toFixed2(start + dist * coef[0]);
    for (i = 1; i < 10; i++) {
        range[i] = utils_1.toFixed2(range[i - 1] + dist * coef[i]);
    }
    return range;
}
function computeMean(oreName, oreCosts) {
    let history = oreCosts.history;
    const keys = Object.keys(oreCosts.recent);
    let mean = 0;
    for (let i = 0; i < keys.length; i++) {
        mean += oreCosts.recent[keys[i]];
    }
    mean = utils_1.toFixed2(mean / keys.length);
    if (Object.keys(history).length >= 24) {
        delete history[Object.keys(history)[0]];
    }
    history[Date.now()] = mean;
    environment_1.defaultDatabase.ref('trading/' + oreName + "/history").set(history);
}
//# sourceMappingURL=market.js.map