import { defaultDatabase } from "./environment";
import { quest } from "./resources";
import { toFixed2, getOreAmountFromString } from "./utils";


export function checkQuest(missionName: string, values: number, currentUser, userID) {
    if (currentUser.quest.gain === 0) {
        return;
    }
    if (missionName === currentUser.quest.type) {
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
            const currentUser = user.val()[userUis[i]] // same
            if (currentUser.quest.gain != 0) { // A enlever 
                continue;
            }
            const randomQuest = Math.floor((Math.random() * quest.length));
            initQuestUser(randomQuest, userUis[i], currentUser);
        }
    });
}

function initQuestUser(i, userID, currentUser) {
    if(i === 1) {
        i = 4;
    }
    const questCurrent = quest[i];
    const gainCredit = currentUser.upgrade.score * 
    toFixed2((Math.random() * questCurrent.gainMax) + questCurrent.gainMin) 
    + questCurrent.gain;
    defaultDatabase.ref("mineRate/").once('value').then((mineRate) => {
        defaultDatabase.ref("oreInfo/").once('value').then((oreInfo) => {
            let type = (Math.floor(Math.random()* 10)) % 2 === 0 ? "carbon" : "titanium";
            let values;
            const mineRateCurrent = mineRate.val()[currentUser.upgrade.mineRateLvl].maxRate * oreInfo.val()[type].miningSpeed;
            let typeFinal; 
            switch (questCurrent.type) {
                case 'Buy':
                    values = getOreAmountFromString(type, currentUser); // * oreInfo.val()[type].meanValue;
                    typeFinal = 'buy' + type; 
                break;

                case 'Sell':
                    values = mineRateCurrent * 60 * 10;  // * oreInfo.val()[type].meanValue;
                    typeFinal = 'sell' + type; 
                break;

                case 'Retrieve':
                    values = mineRateCurrent * 60 * 20; 
                    typeFinal = type;
                break;

                case 'Upgrade':
                    values = 3; 
                    const temp = (Math.floor(Math.random()* 10)) % 2 === 0 ? "storage" : "mineRate";
                    typeFinal = 'upgrade' + temp;
                    type = temp;
                break;

                case 'Win': // credit
                    values = mineRateCurrent * 60 * 20 * oreInfo.val()[type].meanValue; 
                    type = 'Credit';
                    typeFinal = 'credit';
                break;
                
                case 'Click':
                break;
            }
            const text = questCurrent.type + ' ' + toFixed2(values)  + ' ' + type; 

            defaultDatabase.ref("users/" + userID + "/quest/gain").set(toFixed2(gainCredit));
            defaultDatabase.ref("users/" + userID + "/quest/values").set(toFixed2(values));   
            defaultDatabase.ref("users/" + userID + "/quest/valuesFinal").set(toFixed2(values));            
            defaultDatabase.ref("users/" + userID + "/quest/name").set(text);
            defaultDatabase.ref("users/" + userID + "/quest/text").set(questCurrent.text);
            defaultDatabase.ref("users/" + userID + "/quest/type").set(typeFinal);
            defaultDatabase.ref("users/" + userID + "/quest/num").set(i);
        });
    });
   
}

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


