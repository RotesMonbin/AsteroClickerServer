import {defaultDatabase} from "./environment"
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
            defaultDatabase.ref("trading/" + data.ore).once('value').then((oreValue) => {
                var keys = Object.keys(oreValue.val());
                const currentValue = oreValue.val()[keys[29]];

                if (currentOreAmount < data.amount) {
                    data.amount=currentOreAmount;
                }
                defaultDatabase.ref("users/" + data.user + "/credit").set(toFixed2(user.val().credit + currentValue * data.amount));
                defaultDatabase.ref("users/" + data.user + "/ore/" + data.ore).set(toFixed2(currentOreAmount - data.amount));
                checkQuest('sell' + data.ore, data.amount, user.val(), data.user);
                checkQuest('credit', currentValue * data.amount, user.val(), data.user);
            });
            defaultDatabase.ref("trend/" + data.ore).once('value').then((trend) => {
                defaultDatabase.ref("trend/" + data.ore).set(trend.val()-data.amount);
            });
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
        defaultDatabase.ref("trading/" + data.ore).once('value').then((oreValue) => {
            var keys = Object.keys(oreValue.val());
            const currentValue = oreValue.val()[keys[29]];
            const cost = data.amount * currentValue;
            if (currentCredit >= cost && toFixed2(user.val().ore[data.ore] + data.amount) <= storageUpgrade[user.val().upgrade.storageLvl].capacity) {
                defaultDatabase.ref("users/" + data.user + "/credit").set(toFixed2(user.val().credit - cost));
                defaultDatabase.ref("users/" + data.user + "/ore/" + data.ore).set(toFixed2(user.val().ore[data.ore] + data.amount));
                checkQuest('buy' + data.ore, data.amount, user.val(), data.user);
            }
        });

        defaultDatabase.ref("trend/" + data.ore).once('value').then((trend) => {
            defaultDatabase.ref("trend/" + data.ore).set(trend.val()+data.amount);
        });

    });
}


export function updateCostsMarket() {
    defaultDatabase.ref('trend').once('value').then(function (trendSnapshot) {
        defaultDatabase.ref('trading').once('value').then(function (tradSnapshot) {
            defaultDatabase.ref('oreInfo').once('value').then(function (oreSnapshot) {

                computeNewRate('carbon', tradSnapshot.val().carbon
                    , trendSnapshot.val().carbon, oreSnapshot.val().carbon.maxValue,
                    oreSnapshot.val().carbon.minValue, oreSnapshot.val().carbon.meanValue);

                computeNewRate('titanium', tradSnapshot.val().titanium
                    , trendSnapshot.val().titanium, oreSnapshot.val().titanium.maxValue,
                    oreSnapshot.val().titanium.minValue, oreSnapshot.val().titanium.meanValue);

                computeNewRate('fer', tradSnapshot.val().fer
                    , trendSnapshot.val().fer, oreSnapshot.val().fer.maxValue,
                    oreSnapshot.val().fer.minValue, oreSnapshot.val().fer.meanValue);

            });
        });
    });
}


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
    defaultDatabase.ref('trading/' + oreName).set(jsonStr);
    defaultDatabase.ref('trend/' + oreName).set(0);
}
