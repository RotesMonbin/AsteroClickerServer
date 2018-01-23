import { defaultDatabase } from "./environment";
import { toFixed2 } from "./utils";
import { oreInfo } from './resources';

// Mine Rate - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
function mineRateOreNeedFromLvl(iLvl: number) {
    if (iLvl <= 10) {
        return ['credit', 'carbon'];
    } else if (iLvl <= 30) {
        return ['credit', 'carbon', 'iron'];
    } else if (iLvl <= 50) {
        return ['credit', 'carbon', 'iron', 'titanium'];
    } else if (iLvl <= 90) {
        return ['credit', 'carbon', 'iron', 'titanium', 'hyperium'];
    } else {
        return ['credit', 'carbon', 'iron', 'titanium', 'hyperium'];
    }
}

export function generateMineRateUpgrade(range: number) {
    let json = [];
    let costCredit;
    let cost;

    json[0] = {
        baseRate: 1,
        maxRate: 1.5,
        frenzyTime: 10,
        time: 10 //(level*(level+1)/10)+10
    }

    json[0]['cost'] = {};
    let tabOre = mineRateOreNeedFromLvl(0);
    for (let j = 0; j < tabOre.length; j++) {
        cost = 1000;
        if (tabOre[j] !== 'credit') {
            cost = 1000 / oreInfo[tabOre[j].toString()].meanValue;
        }
        json[0]['cost'][tabOre[j]] = toFixed2(cost / tabOre.length);
    }

    for (let i = 1; i < range; i++) {
        costCredit = Math.floor(((500 * Math.pow(i, 1.7)) + 1500) / 1000) * 1000; //Prix = (500 * x^1.7) + 1500z
        const rate = toFixed2(json[i - 1].baseRate + (0.2 * (Math.floor((i - 1) / 10) + 1)));
        json[i] = {
            baseRate: rate,
            maxRate: toFixed2(Math.round(rate * 1.5 * 10) / 10),
            frenzyTime: 10 + ((i * 10) / 200),
            time: (i * (i + 1) / 10) + 10 //(level*(level+1)/10)+10
        }

        json[i]['cost'] = {};
        let tabOre = mineRateOreNeedFromLvl(i);
        for (let j = 0; j < tabOre.length; j++) {
            cost = costCredit;
            if (tabOre[j] !== 'credit') {
                cost = costCredit / oreInfo[tabOre[j].toString()].meanValue;
            }
            json[i]['cost'][tabOre[j]] = Math.round(cost / tabOre.length);
        }
    }

    defaultDatabase.ref("mineRate/").set(json);
}

// Storage - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
function storageOreNeedFromLvl(iLvl: number) {
    if (iLvl <= 10) {
        return ['carbon'];
    } else if (iLvl <= 30) {
        return ['carbon', 'iron'];
    } else if (iLvl <= 50) {
        return ['carbon', 'iron', 'titanium'];
    } else if (iLvl <= 90) {
        return ['carbon', 'iron', 'titanium', 'gold'];
    } else {
        return ['carbon', 'iron', 'titanium', 'gold'];
    }
}

export function generateStorageUpgrade(range: number) {
    let json = [];
    let costCredit;
    let cost;

    for (let i = 0; i < range; i++) {
        costCredit = Math.floor(3000 / 1000 * Math.pow(i, 1.07)) * 1000;

        json[i] = {
            capacity: Math.floor(5000 / 1000 * Math.pow(i + 1, 1.5)) * 1000,
            time: (i * (i + 1) / 10) + 10
        }

        json[i]['cost'] = {};
        let tabOre = storageOreNeedFromLvl(i);
        for (let j = 0; j < tabOre.length; j++) {
            cost = costCredit;
            if (tabOre[j] !== 'credit') {
                cost = costCredit / oreInfo[tabOre[j].toString()].meanValue;
            }
            json[i]['cost'][tabOre[j]] = Math.round(cost / tabOre.length);
        }
    }
    defaultDatabase.ref("storage/").set(json);
}

// Engine  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
function engineOreNeedFromLvl(iLvl: number) {
    if (iLvl <= 10) {
        return ['iron'];
    } else if (iLvl <= 30) {
        return ['iron', 'titanium'];
    } else if (iLvl <= 50) {
        return ['iron', 'titanium', 'credit'];
    } else if (iLvl <= 90) {
        return ['iron', 'titanium', 'credit', 'hyperium'];
    } else {
        return ['iron', 'titanium', 'credit', 'hyperium'];
    }
}

export function generateEngineUpgrade(range: number) {
    let json = [];
    let costCredit;
    let cost;

    for (let i = 0; i < range; i++) {
        costCredit = Math.floor(3000 / 1000 * Math.pow(i, 1.07)) * 1000;
        
        json[i] = {
            speed: 10 + i,
            time: (i * (i + 1) / 10) + 10
        }
        json[i]['cost'] = {};
        let tabOre = engineOreNeedFromLvl(i);
        for (let j = 0; j < tabOre.length; j++) {
            cost = costCredit;
            if (tabOre[j] !== 'credit') {
                cost = costCredit / oreInfo[tabOre[j].toString()].meanValue;
            }
            json[i]['cost'][tabOre[j]] = Math.round(cost / tabOre.length);
        }
    }

    defaultDatabase.ref("engine/").set(json);
}

// Research - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
function researchOreNeedFromLvl(iLvl: number) {
    if (iLvl <= 10) {
        return ['credit'];
    } else if (iLvl <= 30) {
        return ['credit', 'iron'];
    } else if (iLvl <= 50) {
        return ['credit', 'iron', 'titanium'];
    } else if (iLvl <= 90) {
        return ['credit', 'iron', 'titanium', 'gold'];
    } else {
        return ['credit', 'iron', 'titanium', 'gold'];
    }
}
export function generateResearchUpgrade(range: number) {
    let json = [];
    let costCredit;
    let cost;

    for (let i = 0; i < range; i++) {
        costCredit = Math.floor(5000 / 1000 * Math.pow(i, 1.09)) * 1000;
        
        json[i] = {
            searchTime: i == 0 ? 120 : toFixed2(json[i - 1].searchTime * 0.92),
            minDist: 100,
            maxDist: 10000 + 1000 * i,
            time: (i * (i + 1) / 10) + 10,
        }

        json[i]['cost'] = {};
        let tabOre = researchOreNeedFromLvl(i);
        for (let j = 0; j < tabOre.length; j++) {
            cost = costCredit;
            if (tabOre[j] !== 'credit') {
                cost = costCredit / oreInfo[tabOre[j].toString()].meanValue;
            }
            json[i]['cost'][tabOre[j]] = Math.round(cost / tabOre.length);
        }
    }

    defaultDatabase.ref("research/").set(json);
}

<<<<<<< HEAD
export function initializeTrading() {
    defaultDatabase.ref("oreInfo/").once('value').then((oreInfo) => {
        const info = oreInfo.val();
        const oreInfoKey = Object.keys(info);
        let json ={};
        for (let i = 0; i < oreInfoKey.length; i++) {
            for (let j = 0; j < 500; j++) {
                json[j] = info[oreInfoKey[i]].meanValue;
            }
            console.log(json);
            defaultDatabase.ref("trading/" + oreInfoKey[i] +"/lastMinute").set(json);
        }

    });
}

=======
// QG - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
function QGOreNeedFromLvl(iLvl: number) {
    if (iLvl <= 3) {
        return ['credit', 'carbon', 'iron'];
    } else if (iLvl <= 5) {
        return ['credit', 'carbon', 'iron', 'titanium'];
    } else if (iLvl <= 7) {
        return ['credit', 'carbon', 'iron', 'titanium', 'hyperium'];
    } else if (iLvl <= 10) {
        return ['credit', 'carbon', 'iron', 'titanium', 'hyperium', 'gold'];
    } else {
        return ['credit', 'carbon', 'iron', 'titanium', 'hyperium', 'gold'];
    }
}
export function generateQGUpgrade(range: number) {
    let json = [];
    let costCredit;
    let cost;

    for (let i = 0; i < range; i++) {
        costCredit = Math.floor(5000 / 1000 * Math.pow(i, 1.09)) * 2000;
        
        json[i] = {
            lvlMax: 10 * i,
            time: (i * 5 *(i + 1) / 10) + 10,
            numberOfCargo: 1 + Math.round(i / 4),
        }

        json[i]['cost'] = {};
        let tabOre = QGOreNeedFromLvl(i);
        for (let j = 0; j < tabOre.length; j++) {
            cost = costCredit;
            if (tabOre[j] !== 'credit') {
                cost = costCredit / oreInfo[tabOre[j].toString()].meanValue;
            }
            json[i]['cost'][tabOre[j]] = Math.round(cost / tabOre.length);
        }
    }

    defaultDatabase.ref("QG/").set(json);
}


>>>>>>> 322e44d65757ba8080830387817df29762a64bc0
/**
 * 
 * @param message [user] : userId 
 * @param message [email]: userEmail
 * 
 */
export function initializeUser(message) {

    let json = {};

    json["frenzy"] = {};

    json["frenzy"]["info"] = {};
    json["frenzy"]["info"]["nextCombos"] = 0;
    json["frenzy"]["info"]["state"] = 0;

    json["frenzy"]["time"] = {};
    json["frenzy"]["time"]["start"] = 0;
    json["frenzy"]["time"]["timer"] = 0;

    json["asteroid"] = {};
    json["asteroid"]["capacity"] = 1000;
    json["asteroid"]["currentCapacity"] = 1000;
    json["asteroid"]["ore"] = "carbon";
    json["asteroid"]["purity"] = 100;
    json["asteroid"]["seed"] = "01230123";

    json["ore"] = {};
    json["ore"]["carbon"] = 0;
    json["ore"]["titanium"] = 0;
    json["ore"]["iron"] = 0;
    json["ore"]["hyperium"] = 0;
    json["ore"]["gold"] = 0;


    json["chest"] = {};
    json["chest"]["numberOfChest"] = 0;

    json["profile"] = {};

    json["event"] = 0;

    json["quest"] = {};
    json["quest"]["gain"] = -1;

    json["upgrade"] = {};
    json["upgrade"]["mineRate"] = {};
    json["upgrade"]["mineRate"]["timer"] = 0;
    json["upgrade"]["mineRate"]["start"] = 0;

    json["upgrade"]["storage"] = {};
    json["upgrade"]["storage"]["timer"] = 0;
    json["upgrade"]["storage"]["start"] = 0;

    json["upgrade"]["research"] = {};
    json["upgrade"]["research"]["timer"] = 0;
    json["upgrade"]["research"]["start"] = 0;

    json["upgrade"]["engine"] = {};
    json["upgrade"]["engine"]["timer"] = 0;
    json["upgrade"]["engine"]["start"] = 0;

    json["upgrade"]["QG"] = {};
    json["upgrade"]["QG"]["timer"] = 0;
    json["upgrade"]["QG"]["start"] = 0;

    json["upgrade"]["score"] = 0;

    json["cargo"] = {};
    json["cargo"]["availableCargo"] = 1;

    json["cargo"]["cargo1"] = {};
    json["cargo"]["cargo1"]["start"] = 0;
    json["cargo"]["cargo1"]["timer"] = 0;

    json["cargo"]["cargo1"]["ore"] = {};
    json["cargo"]["cargo1"]["ore"]["value"] = 0;
    json["cargo"]["cargo1"]["ore"]["type"] = '';
    
    json["search"] = {};
    json["search"]["result"] = 0;
    json["search"]["timer"] = 0;
    json["search"]["start"] = 0;


    json["profile"]["email"] = message.email;
    json["profile"]["name"] = message.pseudo;
    json["profile"]["badConfig"] = 1;

    json["upgrade"]["mineRate"]["lvl"] = 1;
    json["upgrade"]["storage"]["lvl"] = 1;
    json["upgrade"]["research"]["lvl"] = 1;
    json["upgrade"]["engine"]["lvl"] = 1;
    json["upgrade"]["QG"]["lvl"] = 0;

    json["credit"] = 0;

    defaultDatabase.ref("users/" + message.user).set(json);
}

export function addField() {
    defaultDatabase.ref("users/").once('value').then((user) => {

        let allUsers = user.val();
        let usersId = Object.keys(allUsers);

        let json = {};

        for (let i = 0; i < usersId.length; i++) {

            json["frenzy"] = {};

            json["frenzy"]["info"] = {};
            json["frenzy"]["info"]["nextCombos"] = 0;
            json["frenzy"]["info"]["state"] = 0;

            json["frenzy"]["time"] = {};
            json["frenzy"]["time"]["start"] = 0;
            json["frenzy"]["time"]["timer"] = 0;

            json["cargo"] = allUsers[usersId[i]].cargo;
            
            json["asteroid"] = {};
            json["asteroid"]["capacity"] = allUsers[usersId[i]].asteroid.capacity;
            json["asteroid"]["currentCapacity"] = allUsers[usersId[i]].asteroid.currentCapacity;
            json["asteroid"]["ore"] = allUsers[usersId[i]].asteroid.ore;
            json["asteroid"]["purity"] = allUsers[usersId[i]].asteroid.purity;
            json["asteroid"]["seed"] = allUsers[usersId[i]].asteroid.seed;

            json["ore"] = {};


            json["chest"] = allUsers[usersId[i]].chest;

            json["profile"] = {};

            json["event"] = allUsers[usersId[i]].event;

            json["quest"] = allUsers[usersId[i]].quest;

            json["upgrade"] = {};
            json["upgrade"]["mineRate"] = {};
            json["upgrade"]["mineRate"]["timer"] = allUsers[usersId[i]].upgrade.mineRate.timer;
            json["upgrade"]["mineRate"]["start"] = allUsers[usersId[i]].upgrade.mineRate.start;

            json["upgrade"]["storage"] = {};
            json["upgrade"]["storage"]["timer"] = allUsers[usersId[i]].upgrade.storage.start;
            json["upgrade"]["storage"]["start"] = allUsers[usersId[i]].upgrade.storage.start;

            json["upgrade"]["research"] = {};
            json["upgrade"]["research"]["timer"] = allUsers[usersId[i]].upgrade.research.start;
            json["upgrade"]["research"]["start"] = allUsers[usersId[i]].upgrade.research.start;

            json["upgrade"]["engine"] = {};
            json["upgrade"]["engine"]["timer"] = allUsers[usersId[i]].upgrade.engine.start;
            json["upgrade"]["engine"]["start"] = allUsers[usersId[i]].upgrade.engine.start;

            json["upgrade"]["QG"] = {};
            json["upgrade"]["QG"]["timer"] = allUsers[usersId[i]].upgrade.QG.start;
            json["upgrade"]["QG"]["start"] = allUsers[usersId[i]].upgrade.QG.start;

            json["upgrade"]["score"] = allUsers[usersId[i]].upgrade.score;

            json["search"] = {};
            json["search"]["result"] = allUsers[usersId[i]].search.result;
            json["search"]["timer"] = allUsers[usersId[i]].search.timer;
            json["search"]["start"] = allUsers[usersId[i]].search.start;

            json["profile"]["email"] = allUsers[usersId[i]].profile.email;
            json["profile"]["name"] = allUsers[usersId[i]].profile.name;
            json["profile"]["badConfig"] = 0;

            json["upgrade"]["mineRate"]["lvl"] = allUsers[usersId[i]].upgrade.mineRate.lvl;
            json["upgrade"]["storage"]["lvl"] = allUsers[usersId[i]].upgrade.storage.lvl;
            json["upgrade"]["research"]["lvl"] = allUsers[usersId[i]].upgrade.research.lvl;
            json["upgrade"]["engine"]["lvl"] = allUsers[usersId[i]].upgrade.engine.lvl;
            json["upgrade"]["QG"]["lvl"] = allUsers[usersId[i]].upgrade.QG.lvl;

            json["ore"]["carbon"] = allUsers[usersId[i]]["ore"]["carbon"];
            json["ore"]["titanium"] = allUsers[usersId[i]]["ore"]["titanium"];
            json["ore"]["iron"] = allUsers[usersId[i]]["ore"]["iron"];
            json["ore"]["hyperium"] = allUsers[usersId[i]]["ore"]["hyperium"];
            json["ore"]["gold"] = allUsers[usersId[i]]["ore"]["gold"];

            json["credit"] = allUsers[usersId[i]].credit;

            defaultDatabase.ref("users/" + usersId[i]).set(json);
        }
    });
}