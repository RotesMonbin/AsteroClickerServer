import { defaultDatabase } from "./environment";
import { quest } from "./resources";
import { toFixed2, getOreAmountFromString } from "./utils";


export function checkQuest(missionName: string, values: number, currentUser, userID) {
    if (currentUser.quest.values === 0) {
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

/*
numberOfChest: numberOfChest,
userID: userID
*/
export function giveGainUser(message){
    defaultDatabase.ref("users/" + message.user + "/chest/numberOfChest").set(message.numberOfChest);
    const stringTempChest = 'chest' + message.numberOfChest;
    defaultDatabase.ref("users/" + message.user + "/chest/" + stringTempChest).once('value').then((chest) => {
        const chestTemp =  chest.val();
        defaultDatabase.ref("users/" + message.user).once('value').then((currentUser) => {
            let json = {};    
            json['carbon'] = currentUser.val().ore.carbon;  
            json['iron'] = currentUser.val().ore.iron;            
            json['titanium'] = currentUser.val().ore.titanium;

            let creditTemp = currentUser.val().credit; 
            for (let i = 0 ; i < 3; i++) {
                if (Object.keys(chestTemp[i])[0] === 'credit') {
                    creditTemp += chestTemp[i][Object.keys(chestTemp[i])[0]];
                } else {
                    regroupGainChest(Object.keys(chestTemp[i])[0], chestTemp[i][Object.keys(chestTemp[i])[0]], json);
                }
            }           
            addChestToBase(json, message.user, creditTemp);
        });
    }).then(() => {
        defaultDatabase.ref("users/" + message.user + "/chest/chest" + message.numberOfChest).remove();
    });
    
}

function regroupGainChest(type, number, json) {
    json[type] = toFixed2(json[type] + number);
}


function addChestToBase(json, userID, creditTemp) {
    defaultDatabase.ref("users/" + userID + "/ore" ).set(json);     
    defaultDatabase.ref("users/" + userID + "/credit").set(toFixed2(creditTemp));         
}

export function openChest(userID, currentUser) {
    defaultDatabase.ref("users/" + userID + "/chest/").remove('chest' + currentUser.chest.numberOfChest);               
    defaultDatabase.ref("users/" + userID + "/chest/numberOfChest").set(currentUser.chest.numberOfChest - 1);              
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
            if (currentUser.quest.gain != -1) {  
                continue;
            }
            const randomQuest = Math.floor((Math.random() * quest.length));
            initQuestUser(randomQuest, userUis[i], currentUser);
        }
    });
}


export function checkQuestForAddChest() {
    defaultDatabase.ref("mineRate/").once('value').then((mineRate) => {
        defaultDatabase.ref("oreInfo/").once('value').then((oreInfo) => {
            defaultDatabase.ref("users/").once('value').then((user) => {
                const userUis = Object.keys(user.val());
                for (let i = 0; i < userUis.length; i++) {
                    const currentUser = user.val()[userUis[i]]  
                    if (currentUser.quest.gain === 0) {
                        initChestRandom(userUis[i], currentUser, 0.01, 0.03, 3000, mineRate, oreInfo); 
                        defaultDatabase.ref("users/" + userUis[i] + "/quest/gain").set(-1);
                    }                  
                }
            });

        });
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

/*
userID, currentUser
*/
export function newChest(message) {
    defaultDatabase.ref("mineRate/").once('value').then((mineRate) => {
        defaultDatabase.ref("oreInfo/").once('value').then((oreInfo) => {            
            const gainMin = 0.01;
            const gainMax = 0.02;
            const gain = 1000;
            initChestRandom(message.userID, message.currentUser, gainMin, gainMax, gain, mineRate, oreInfo);
        });
    });
}
function initChestRandom(userID, currentUser, gainMin, gainMax, gain, mineRate, oreInfo) {
    let json = {};
    const chest1 = stringRandomChest(currentUser, mineRate, oreInfo, gainMin, gainMax, gain);
    const stringChest = 'chest' + (currentUser.chest.numberOfChest);
    
    json = {};
    json["0"] = {};
    json["0"][chest1.type]=toFixed2(chest1.number);

    const chest2 = stringRandomChest(currentUser, mineRate, oreInfo, gainMin, gainMax, gain);    
    json["1"] = {};
    json["1"][chest2.type]=toFixed2(chest2.number);

    const chest3 = stringRandomChest(currentUser, mineRate, oreInfo, gainMin, gainMax, gain);      
    json["2"] = {};  
    json["2"][chest3.type]=toFixed2(chest3.number);

    defaultDatabase.ref("users/"+ userID + '/chest/' + stringChest).set(json);
    defaultDatabase.ref("users/"+ userID + '/chest/numberOfChest').set(currentUser.chest.numberOfChest + 1);
    
}

function stringRandomChest(currentUser, mineRate, oreInfo, gainMin, gainMax, gain) {
    let tab = {
        'carbon': 23,
        'titanium': 46,
        'iron': 69,
        'credit': 100
    };

    const rand = Math.floor((Math.random() * 100) + 1);
    if (rand < tab.carbon) {
        const mineRateCurrent = mineRate.val()[currentUser.upgrade.mineRate.lvl].maxRate * oreInfo.val()['carbon'].miningSpeed;
        const valuesCarbon =  mineRateCurrent * 60 * Math.floor((Math.random() * 10) + 5); 
        return {type: 'carbon',number: valuesCarbon};
    }
    if (rand < tab.titanium) {
        const mineRateCurrent = mineRate.val()[currentUser.upgrade.mineRate.lvl].maxRate * oreInfo.val()['titanium'].miningSpeed;
        const valuesTitanium =  mineRateCurrent * 60 * Math.floor((Math.random() * 10) + 5);
        return {type: 'titanium',number: valuesTitanium};
    }
    if (rand < tab.iron) {
        const mineRateCurrent = mineRate.val()[currentUser.upgrade.mineRate.lvl].maxRate * oreInfo.val()['iron'].miningSpeed;
        const valuesIron =  mineRateCurrent * 60 * Math.floor((Math.random() * 10) +5); 
        return {type: 'iron',number: valuesIron};
    }
    if (rand <= tab.credit) {
        const gainCredit = currentUser.upgrade.score * 
        toFixed2((Math.random() * gainMax) + gainMin) 
        + gain;
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
        return 'iron';
    }
    return 'carbon';
}


