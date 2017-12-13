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
            const currentValue = oreValue.val()[keys[29]] * 1.025;
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
        if (newTrend < 0) {
            newTrend = 0;
        }
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
                    if (trendTab[oreKeys[i]] == 0) {
                        trendTab[oreKeys[i]] = Math.random() * 100;
                    }
                    else {
                        trendTab[oreKeys[i]] / oreSnapshot.val()[oreKeys[i]].miningSpeed;
                    }
                    trendSum += trendTab[oreKeys[i]];
                }
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
    const jsonStr = oreCosts.recent;
    const currentVal = jsonStr[Object.keys(jsonStr)[Object.keys(jsonStr).length - 1]];
    let oreWeight = oreTrend / trendSum;
    let deltaInd;
    if (oreWeight <= (1 / numberOfOre)) {
        deltaInd = -numberOfOre * oreWeight + 1;
    }
    else {
        deltaInd = ((numberOfOre / (numberOfOre - 1)) * oreWeight)
            - (numberOfOre / (Math.pow(numberOfOre, 2) - numberOfOre));
    }
    deltaInd = Math.pow(deltaInd, 1.8) / (Math.pow(deltaInd, 1.8) + Math.pow(1 - deltaInd, 1.8));
    if (oreWeight <= (1 / numberOfOre)) {
        deltaInd = -deltaInd;
    }
    let newVal = currentVal + (oreInfos.meanValue * deltaInd * oreInfos.variationRate);
    if (newVal < oreInfos.minValue) {
        newVal = oreInfos.minValue;
    }
    if (newVal > oreInfos.maxValue) {
        newVal = oreInfos.maxValue;
    }
    newVal = utils_1.toFixed2(newVal);
    if (Object.keys(jsonStr).length >= 60) {
        delete jsonStr[Object.keys(jsonStr)[0]];
    }
    jsonStr[Date.now()] = newVal;
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
    if (Object.keys(history).length >= 24) {
        delete history[Object.keys(history)[0]];
    }
    history[Date.now()] = mean;
    environment_1.defaultDatabase.ref('trading/' + oreName + "/history").set(history);
}
//# sourceMappingURL=market.js.map