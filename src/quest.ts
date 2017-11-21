import { defaultDatabase } from "./environment";
import { quest } from "./resources";
import { toFixed2 } from "./utils";


export function checkQuest(oreName: string, values: number, currentUser, userID) {
    if (currentUser.quest.gain === 0) {
        return;
    }
    if (oreName === currentUser.quest.type) {
        const finalValues = currentUser.quest.values - values;
        if (finalValues <= 0) {
            defaultDatabase.ref("users/" + userID + "/credit").set(currentUser.quest.gain + currentUser.credit);
            defaultDatabase.ref("users/" + userID + "/quest/gain").set(0);
            defaultDatabase.ref("users/" + userID + "/quest/values").set(0);
        } else {
            defaultDatabase.ref("users/" + userID + "/quest/values").set(toFixed2(finalValues));
        }
    }
}

export function checkQuestGroup(oreName: string, values: number, currentUser, userID) {
    if (oreName === 'carbon') {
        defaultDatabase.ref("questGroup/").once('value').then((questGroup) => {
            const finalValues = questGroup.val().values - values;
            if (finalValues <= 0) {
                defaultDatabase.ref("users/" + userID + "/credit").set(currentUser.credit + questGroup.val().gain + currentUser.score * 0.05);
            } else {
                defaultDatabase.ref("questGroup/values").set(toFixed2(finalValues));
            }
        });

    }
}

export function updateQuestUser() {
    defaultDatabase.ref("users/").once('value').then((user) => {
        const userUis = Object.keys(user.val());

        for (let i = 0; i < userUis.length; i++) {
            const currentUser = user.val()[userUis[i]]
            if (currentUser.quest.gain != 0) {
                continue;
            }
            const questCurrent = quest[i];
            const randomQuest = Math.floor((Math.random() * quest.length));
            const gainCredit = currentUser.score * 
            toFixed2((Math.random() * questCurrent.gainMax) + questCurrent.gainMin) 
            + questCurrent.gain;

            initQuestUser(randomQuest, userUis[i], gainCredit);
        }
    });
}

function initQuestUser(i, userID, newGain: number) {
    defaultDatabase.ref("users/" + userID + "/quest/values").set(quest[i].values);
    defaultDatabase.ref("users/" + userID + "/quest/gain").set(newGain);
    defaultDatabase.ref("users/" + userID + "/quest/name").set(quest[i].name);
    defaultDatabase.ref("users/" + userID + "/quest/type").set(quest[i].type);
    defaultDatabase.ref("users/" + userID + "/quest/num").set(i);
}
/*
function initQuestUser2(i, userID, currentUser) {
    const questCurrent = quest[i];
    const gainCredit = currentUser.score * 
    toFixed2((Math.random() * questCurrent.gainMax) + questCurrent.gainMin) 
    + questCurrent.gain;
    defaultDatabase.ref("mineRate/").once('value').then((mineRate) => {
        const mineRateCurrent = Object.keys(mineRate.val())[currentUser.minRateLvl];
        console.log(mineRateCurrent);
        // const values = mineRateCurrent.baseRate * 60* 20;

        const type = currentUser.score % 2 === 0 ? "carbon" : "titanium";
        defaultDatabase.ref("users/" + userID + "/quest/values").set(2);
        defaultDatabase.ref("users/" + userID + "/quest/gain").set(gainCredit);
        defaultDatabase.ref("users/" + userID + "/quest/name").set(questCurrent.text);
        defaultDatabase.ref("users/" + userID + "/quest/type").set(type);
        defaultDatabase.ref("users/" + userID + "/quest/num").set(i);

    });
   
}*/


export function initQuestGroup() {
    defaultDatabase.ref("users/").once('value').then((user) => {
        const values = Object.keys(user.val()).length * 100000;
        defaultDatabase.ref("questGroup/values").set(values);
        defaultDatabase.ref("questGroup/gain").set(10000);
        defaultDatabase.ref("questGroup/type").set('carbon');
        defaultDatabase.ref("questGroup/valuesFinal").set(values);
        defaultDatabase.ref("questGroup/name").set('Retrieve ' + values + ' carbon with other Captains !');
    });
}


