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
        const currentOreAmount = user.val()[data.ore];
        if (currentOreAmount >= data.amount) {
            defaultDatabase.ref("trading/" + data.ore).once('value').then((oreValue) => {
                var keys = Object.keys(oreValue.val());
                const currentValue = oreValue.val()[keys[29]];
                defaultDatabase.ref("users/" + data.user + "/credit").set(toFixed2(user.val().credit + currentValue * data.amount));
                defaultDatabase.ref("users/" + data.user + "/" + data.ore).set(toFixed2(currentOreAmount - data.amount));
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
            if (currentCredit >= cost && toFixed2(user.val()[data.ore] + data.amount) <= storageUpgrade[user.val().storageLvl].capacity) {
                defaultDatabase.ref("users/" + data.user + "/credit").set(toFixed2(user.val().credit - cost));
                defaultDatabase.ref("users/" + data.user + "/" + data.ore).set(toFixed2(user.val()[data.ore] + data.amount));
                checkQuest('buy' + data.ore, data.amount, user.val(), data.user);
            }
        });

        defaultDatabase.ref("trend/" + data.ore).once('value').then((trend) => {
            defaultDatabase.ref("trend/" + data.ore).set(trend.val()+data.amount);
        });

    });
}
