import { defaultDatabase } from "./environment";
import { quest } from "./resources";
import { toFixed2, getOreAmountFromString } from "./utils";


export function checkQuest(missionName: string, values: number, currentUser, userID) {
    if (currentUser.quest.values === 0) {
        if (currentUser.quest.gain === 0) {
            giveGainUser(userID);
        }
        return;
    }
    if (missionName === currentUser.quest.type) {
        const finalValues = currentUser.quest.values - values;
        if (finalValues <= 0) {
            defaultDatabase.ref("users/" + userID + "/credit").set(currentUser.quest.gain + currentUser.credit);
            defaultDatabase.ref("users/" + userID + "/quest/values").set(0);  
            defaultDatabase.ref("users/" + userID + "/quest/gain").set(0);            
        } else {
            defaultDatabase.ref("users/" + userID + "/quest/values").set(toFixed2(finalValues));
        }
    }
}


function giveGainUser(userID){
    defaultDatabase.ref("user/" + userID + "/quest/chest").once('value').then((chest) => {
        const chestID = Object.keys(chest.val());
        console.log(chestID);
        /*
        for (let i = 0; i < chestID.length; i++) {
            const currentChest = chest.val()[chestID[i]];
            console.log(currentChest);
        }*/
    });

}

export function openChest(userID, currentUser) {
    defaultDatabase.ref("users/" + userID + "/chest/").remove('chest' + currentUser.chest.number);               
    defaultDatabase.ref("users/" + userID + "/chest/number").set(currentUser.chest.number - 1);              
}

export function checkQuestGroup(oreName: string, values: number, currentUser, userID) {
    if (oreName === 'carbon') {
        defaultDatabase.ref("questGroup/").once('value').then((questGroup) => {
            const finalValues = questGroup.val().values - values;
            if (finalValues <= 0) {
                defaultDatabase.ref("users/" + userID + "/credit").set(currentUser.credit + questGroup.val().gain + currentUser.score * 0.2);
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

    defaultDatabase.ref("mineRate/").once('value').then((mineRate) => {
        defaultDatabase.ref("oreInfo/").once('value').then((oreInfo) => {
            let type = randomOre();
            let values;
            const mineRateCurrent = mineRate.val()[currentUser.upgrade.mineRate.lvl].maxRate * oreInfo.val()[type].miningSpeed;
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
            initChestRandom(userID, currentUser, questCurrent, mineRate, oreInfo);
            defaultDatabase.ref("users/" + userID + "/quest/gain").set(1);
            defaultDatabase.ref("users/" + userID + "/quest/values").set(toFixed2(values));   
            defaultDatabase.ref("users/" + userID + "/quest/valuesFinal").set(toFixed2(values));            
            defaultDatabase.ref("users/" + userID + "/quest/name").set(text);
            defaultDatabase.ref("users/" + userID + "/quest/text").set(questCurrent.text);
            defaultDatabase.ref("users/" + userID + "/quest/type").set(typeFinal);
            defaultDatabase.ref("users/" + userID + "/quest/num").set(i);
        });
    });  
}

function initChestRandom(userID, currentUser, questCurrent, mineRate, oreInfo) {
    let json = {};
    console.log(currentUser);
    const chest1 = stringRandomChest(currentUser, questCurrent, mineRate, oreInfo);
    const stringChest = 'chest' + (currentUser.chest.numberOfChest + 1);
    defaultDatabase.ref("users/"+ userID + '/chest/numberOfChest').set(currentUser.chest.numberOfChest + 1);
    
    json = {};
    json["0"] = {};
    json["0"][chest1.type]=toFixed2(chest1.number);

    const chest2 = stringRandomChest(currentUser, questCurrent, mineRate, oreInfo);    
    json["1"] = {};
    json["1"][chest2.type]=toFixed2(chest2.number);

    const chest3 = stringRandomChest(currentUser, questCurrent, mineRate, oreInfo);      
    json["2"] = {};  
    json["2"][chest3.type]=toFixed2(chest3.number);

    defaultDatabase.ref("users/"+ userID + '/chest/' + stringChest).set(json);
}

function stringRandomChest(currentUser, questCurrent, mineRate, oreInfo) {
    let tab = {
        'carbon': 30,
        'titanium': 60,
        'credit': 100
    };

    const rand = Math.floor((Math.random() * 100) + 1);
    if (rand < tab.carbon) {
        const mineRateCurrent = mineRate.val()[currentUser.upgrade.mineRateLvl].maxRate * oreInfo.val()['carbon'].miningSpeed;
        const valuesCarbon =  mineRateCurrent * 60; 
        return {type: 'carbon',number: valuesCarbon};
    }
    if (rand < tab.titanium) {
        const mineRateCurrent = mineRate.val()[currentUser.upgrade.mineRateLvl].maxRate * oreInfo.val()['titanium'].miningSpeed;
        const valuesTitanium =  mineRateCurrent * 60; 
        return {type: 'titanium',number: valuesTitanium};
    }
    if (rand <= tab.credit) {
        const gainCredit = currentUser.upgrade.score * 
        toFixed2((Math.random() * questCurrent.gainMax) + questCurrent.gainMin) 
        + questCurrent.gain;
        return {type: 'credit',number: gainCredit/3};
    }
    return undefined;
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

function randomOre() {
    const type = (Math.floor(Math.random()* 3));
    if (type === 0) {
        return 'carbon';
    }
    else if (type ===1) {
        return 'titanium';
    } 
    else if (type === 2) {
        return 'fer';
    }
    return 'carbon';
}


