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
            defaultDatabase.ref("trading/" + data.ore + "/recent").once('value').then((oreValue) => {
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
        defaultDatabase.ref("trading/" + data.ore + "/recent").once('value').then((oreValue) => {
            var keys = Object.keys(oreValue.val());
            const currentValue = oreValue.val()[keys[keys.length - 1]] * 1.025;
            const cost = data.amount * currentValue;
            if (currentCredit >= cost && toFixed2(user.val().ore[data.ore] + data.amount) <= storageUpgrade[user.val().upgrade.storage.lvl].capacity) {
                defaultDatabase.ref("users/" + data.user + "/credit").set(toFixed2(user.val().credit - cost));
                defaultDatabase.ref("users/" + data.user + "/ore/" + data.ore).set(toFixed2(user.val().ore[data.ore] + data.amount));
                checkQuest('buy' + data.ore, data.amount, user.val(), data.user);
            }
        });
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

                /*for (let i = 0; i < oreKeys.length; i++) {
                    if (trendTab[oreKeys[i]] == 0) {
                        trendTab[oreKeys[i]] = Math.random() * 100;
                    }
                    else {
                        trendTab[oreKeys[i]] / oreSnapshot.val()[oreKeys[i]].miningSpeed;
                    }
                    trendSum += trendTab[oreKeys[i]];
                }*/

                for (let i = 0; i < oreKeys.length; i++) {
                    computeNewRate(oreKeys[i], tradSnapshot.val()[oreKeys[i]]
                        , trendTab[oreKeys[i]], oreSnapshot.val()[oreKeys[i]], trendSum, oreKeys.length);
                }
            });
        });
    });
}

export function updateMeanCosts() {
    defaultDatabase.ref('trading').once('value').then(function (tradSnapshot) {
        const oreKeys = Object.keys(tradSnapshot.val());

        for (let i = 0; i < oreKeys.length; i++) {
            computeMean(oreKeys[i], tradSnapshot.val()[oreKeys[i]]);
        }

    });
}


function computeNewRate(oreName, oreCosts, oreTrend, oreInfos, trendSum, numberOfOre) {
    let recentCostsJson = oreCosts.recent;
    let nextValuesJson = oreCosts.nextValues;
    let newVal;

    numberOfOre = numberOfOre;
    trendSum = trendSum;

    if (nextValuesJson == null) {

        const currentVal = recentCostsJson[Object.keys(recentCostsJson)[Object.keys(recentCostsJson).length - 1]];

        //Rapprochement de la moyenne
        let meanDist = 0;
        if (currentVal != oreInfos.meanValue) {
            meanDist = currentVal < oreInfos.meanValue ?
                (oreInfos.meanValue - currentVal) / (oreInfos.meanValue - oreInfos.minValue) :
                (oreInfos.meanValue - currentVal) / (oreInfos.meanValue - oreInfos.maxValue);
        }

        const meanDelta = 0.20 * oreInfos.meanValue * meanDist;

        let delta = 0;
        if (oreTrend == 0) {
            delta = (Math.random() * 10) + 5;
            delta = (Math.random()*100 >= 50) ? delta : -delta
            delta = currentVal < oreInfos.meanValue ? -delta : delta;
        }
        else {
            delta = (Math.random() * 30) + 10;
            delta = oreTrend > 0 ? -delta : delta;
        }
        //console.log(oreName + " " + meanDelta + toFixed2((delta/100)*oreInfos.meanValue));
        newVal = currentVal + meanDelta + toFixed2((delta/100)*oreInfos.meanValue);

        /*let oreWeight = oreTrend / trendSum;

        let deltaInd;
        if (oreWeight <= (1 / numberOfOre)) { //      f = (-r) * x + 1
            deltaInd = -numberOfOre * oreWeight + 1;
        }
        else {//   f = (r/(r-1)) * x - (r/((r^2) - r ))
            deltaInd = ((numberOfOre / (numberOfOre - 1)) * oreWeight)
                - (numberOfOre / (Math.pow(numberOfOre, 2) - numberOfOre));
        }

        //easing g = f^1.8 /( f^1.8 + (1-f)^1.8) [easing]
        deltaInd = Math.pow(deltaInd, 1.8) / (Math.pow(deltaInd, 1.8) + Math.pow(1 - deltaInd, 1.8));

        if (oreWeight <= (1 / numberOfOre)) {
            deltaInd = -deltaInd;
        }


        newVal = currentVal + (oreInfos.meanValue * deltaInd * oreInfos.variationRate);

        if (newVal < oreInfos.minValue) {
            newVal = oreInfos.minValue;
        }
        if (newVal > oreInfos.maxValue) {
            newVal = oreInfos.maxValue;
        }*/


        newVal = toFixed2(newVal);

        nextValuesJson = computeRange(currentVal, newVal);
    }

    if (Object.keys(recentCostsJson).length >= 360) {
        delete recentCostsJson[Object.keys(recentCostsJson)[0]];
    }

    recentCostsJson[Date.now()] = nextValuesJson[Object.keys(nextValuesJson)[0]];
    delete nextValuesJson[Object.keys(nextValuesJson)[0]];
    defaultDatabase.ref('trading/' + oreName + "/recent").set(recentCostsJson);
    defaultDatabase.ref('trading/' + oreName + "/nextValues").set(nextValuesJson);
    defaultDatabase.ref('trend/' + oreName).set(0);
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

function computeMean(oreName, oreCosts) {
    let history = oreCosts.history;
    const keys = Object.keys(oreCosts.recent);
    let mean = 0;

    for (let i = 0; i < keys.length; i++) {
        mean += oreCosts.recent[keys[i]];
    }
    mean = toFixed2(mean / keys.length);

    if (Object.keys(history).length >= 24) {
        delete history[Object.keys(history)[0]];
    }

    history[Date.now()] = mean;

    defaultDatabase.ref('trading/' + oreName + "/history").set(history);
}
