import { defaultDatabase } from "./environment"
import { checkQuest } from "./quest";
import { toFixed2 } from "./utils";
import { storageUpgrade } from "./resources";
/*
data = {
    user : userId,
    ore: oreName,
    amount: sold amount
}
*/
/**
 * 
 * @param {user: userId,} data - 
 */
export function sellOre(data) {
    defaultDatabase.ref("users/" + data.user).once('value').then((user) => {
        const currentOreAmount = user.val().ore[data.ore];
        if (currentOreAmount > 0) {
            defaultDatabase.ref("trading/" + data.ore + "/lastMinute").once('value').then((oreValue) => {
                var keys = Object.keys(oreValue.val());
                const currentValue = oreValue.val()[keys[keys.length - 1]];

                if (currentOreAmount < data.amount) {
                    data.amount = currentOreAmount;
                }
                defaultDatabase.ref("users/" + data.user + "/credit").set(toFixed2(user.val().credit + currentValue * data.amount));
                defaultDatabase.ref("users/" + data.user + "/ore/" + data.ore).set(toFixed2(currentOreAmount - data.amount));
                checkQuest('sell' + data.ore, data.amount, user.val(), data.user);
                checkQuest('credit', currentValue * data.amount, user.val(), data.user);
            });
            updateTrend(data.amount, data.ore);
        }
    });
}

/*
data = {
    user : userId,
    ore: oreName,
    amount: bought amount
}
*/
export function buyOre(data) {
    defaultDatabase.ref("users/" + data.user).once('value').then((user) => {
        const currentCredit = user.val().credit;
        if (currentCredit > 0 && user.val().ore[data.ore] < storageUpgrade[user.val().upgrade.storage.lvl].capacity) {

            defaultDatabase.ref("trading/" + data.ore + "/lastMinute").once('value').then((oreValue) => {
                var keys = Object.keys(oreValue.val());
                const currentValue = oreValue.val()[keys[keys.length - 1]] * 1.025;
                const cost = data.amount * currentValue;

                let newCredit: number = toFixed2(user.val().credit - cost);
                let newAmount: number = user.val().ore[data.ore] + data.amount;

                if (currentCredit < cost && currentCredit > 0) {
                    newAmount = user.val().ore[data.ore] + toFixed2(currentCredit / currentValue);
                    newCredit = 0;
                }
                if (newAmount > storageUpgrade[user.val().upgrade.storage.lvl].capacity) {
                    newAmount = storageUpgrade[user.val().upgrade.storage.lvl].capacity;
                    newCredit = currentCredit - (currentValue * (storageUpgrade[user.val().upgrade.storage.lvl].capacity - user.val().ore[data.ore]));
                }

                checkQuest('buy' + data.ore, newAmount - user.val().ore[data.ore], user.val(), data.user);
                defaultDatabase.ref("users/" + data.user + "/credit").set(newCredit);
                defaultDatabase.ref("users/" + data.user + "/ore/" + data.ore).set(toFixed2(newAmount));


            });
        }
        updateTrend(-data.amount, data.ore);
    });
}

function updateTrend(amount: number, oreName: string) {
    defaultDatabase.ref("trend/" + oreName).once('value').then((trend) => {
        let newTrend = trend.val() + amount;
        /* if (newTrend < 0) {
             newTrend = 0;
         }*/
        defaultDatabase.ref("trend/" + oreName).set(newTrend);
    });
}

export function updateCostsMarket() {
    defaultDatabase.ref('trend').once('value').then(function (trendSnapshot) {
        defaultDatabase.ref('trading').once('value').then(function (tradSnapshot) {
            defaultDatabase.ref('oreInfo').once('value').then(function (oreSnapshot) {

                let trendSum = 0;
                let trendTab = trendSnapshot.val();
                const oreKeys = Object.keys(oreSnapshot.val());

                for (let i = 0; i < oreKeys.length; i++) {
                    computeNewRate(oreKeys[i], tradSnapshot.val()[oreKeys[i]]
                        , trendTab[oreKeys[i]], oreSnapshot.val()[oreKeys[i]], trendSum, oreKeys.length);
                }
            });
        });
    });
}


function computeNewRate(oreName, oreCosts, oreTrend, oreInfos, trendSum, numberOfOre) {
    let lastMinuteCostsJson = oreCosts.lastMinute;
    let nextValuesJson = oreCosts.nextValues;
    let newVal;

    numberOfOre = numberOfOre;
    trendSum = trendSum;

    if (nextValuesJson == null) {

        const currentVal = lastMinuteCostsJson[Object.keys(lastMinuteCostsJson)[Object.keys(lastMinuteCostsJson).length - 1]];

        //Rapprochement de la moyenne
        let meanDist = 0;
        if (currentVal != oreInfos.meanValue) {
            meanDist = currentVal < oreInfos.meanValue ?
                (oreInfos.meanValue - currentVal) / (oreInfos.meanValue - oreInfos.minValue) :
                (oreInfos.meanValue - currentVal) / (oreInfos.maxValue - oreInfos.meanValue);
                meanDist=Math.abs(meanDist);
        }

        let delta = 0;
        if (oreTrend == 0) {
            delta = (Math.random() * 0.05) - 0.025;
            delta = currentVal < oreInfos.meanValue ? -delta : delta;
            newVal = currentVal + toFixed2((delta) * oreInfos.meanValue);
        }
        else {
            delta = (Math.random() * (oreInfos.variationRate - (oreInfos.variationRate / 4))) + (oreInfos.variationRate / 4);
            delta = oreTrend > 0 ? -delta : delta;
            if (meanDist > 0.5) {
                const meanCoef = Math.sign(oreTrend) == Math.sign(currentVal - oreInfos.meanValue) ? (meanDist +0.5) : 1 / (meanDist * 2);
                //console.log(oreName+" "+meanCoef);
                newVal = currentVal + (toFixed2((delta) * oreInfos.meanValue) *meanCoef);
            }
            else {
                newVal = currentVal + toFixed2((delta) * oreInfos.meanValue);
            }

        }

        newVal = toFixed2(newVal);
        if (newVal < 0) {
            newVal = 0.01;
        }

        nextValuesJson = computeRange(currentVal, newVal);
        defaultDatabase.ref('trend/' + oreName).set(oreTrend >= 0 ? Math.floor(oreTrend * 0.5) : Math.floor(oreTrend * 0.5) + 1);
    }

    if (Object.keys(lastMinuteCostsJson).length >= 500) {
        delete lastMinuteCostsJson[Object.keys(lastMinuteCostsJson)[0]];
    }

    lastMinuteCostsJson[Date.now()] = nextValuesJson[Object.keys(nextValuesJson)[0]];
    delete nextValuesJson[Object.keys(nextValuesJson)[0]];
    defaultDatabase.ref('trading/' + oreName + "/lastMinute").set(lastMinuteCostsJson);
    defaultDatabase.ref('trading/' + oreName + "/nextValues").set(nextValuesJson);
}

export function updateLastHourCosts() {
    defaultDatabase.ref('trading').once('value').then(function (tradSnapshot) {
        const oreKeys = Object.keys(tradSnapshot.val());

        for (let i = 0; i < oreKeys.length; i++) {
            const mean = computeMeanForLastPeriod("lastMinute", 30, tradSnapshot.val()[oreKeys[i]]);
            let currentValue = tradSnapshot.val()[oreKeys[i]]["lastHour"];
            if (Object.keys(currentValue).length >= 60) {
                delete currentValue[Object.keys(currentValue)[0]];
            }
            currentValue[Date.now()] = mean;

            defaultDatabase.ref('trading/' + oreKeys[i] + "/lastHour").set(currentValue);
        }
    });
}

export function updateLastDayCosts() {
    defaultDatabase.ref('trading').once('value').then(function (tradSnapshot) {
        const oreKeys = Object.keys(tradSnapshot.val());

        for (let i = 0; i < oreKeys.length; i++) {
            const mean = computeMeanForLastPeriod("lastHour", 60, tradSnapshot.val()[oreKeys[i]]);
            let currentValue = tradSnapshot.val()[oreKeys[i]]["lastDay"];
            if (Object.keys(currentValue).length >= 24) {
                delete currentValue[Object.keys(currentValue)[0]];
            }
            currentValue[Date.now()] = mean;

            defaultDatabase.ref('trading/' + oreKeys[i] + "/lastDay").set(currentValue);
        }
    });
}

function computeMeanForLastPeriod(periodName: string, numberOfValue: number, oreCosts): number {
    const keys = Object.keys(oreCosts[periodName]);
    let mean = 0;

    for (let i = keys.length - numberOfValue - 1; i < keys.length; i++) {
        mean += oreCosts[periodName][keys[i]];
    }
    mean = toFixed2(mean / keys.length);

    return mean;
}

function computeRange(start: number, end: number): number[] {

    let coefBase: number[] = [0.05, 0.1, 0.1, 0.1, 0.15, 0.15, 0.2, 0.3, -0.1, -0.05];
    let coef: number[] = new Array();
    let range: number[] = new Array();
    const dist: number = end - start;

    let i = coefBase.length;
    let j = 0;

    while (i--) {
        j = Math.floor(Math.random() * (i + 1));
        coef.push(coefBase[j]);
        coefBase.splice(j, 1);
    }

    range[0] = toFixed2(start + dist * coef[0]);
    for (i = 1; i < 10; i++) {
        range[i] = toFixed2(range[i - 1] + dist * coef[i]);
    }

    return range;
}