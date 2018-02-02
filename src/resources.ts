import { defaultDatabase } from "./environment"
import { toFixed2 } from './utils';

export let resources;
export let mineRateUpgrade;
export let storageUpgrade;
export let researchUpgrade;
export let engineUpgrade;
export let QGUpgrade;
export let oreInfos;

export let quest;

export function getUpgradeFromString(name) {
    switch (name) {
        case "mineRate":
            return mineRateUpgrade;
        case "storage":
            return storageUpgrade;
        case "research":
            return researchUpgrade;
        case "engine":
            return engineUpgrade;
        case "QG":
            return QGUpgrade;
        default:
            console.log("Upgrade unknown");
            return null;
    }
}

export function generateResources(){
    this.mineRateUpgrade=generateMineRateUpgrade(200);
    this.storageUpgrade=generateStorageUpgrade(200);
    this.researchUpgrade=generateResearchUpgrade(200);
    this.engineUpgrade=generateEngineUpgrade(200);
    this.QGUpgrade=generateQGUpgrade(200);

    this.resources={};
    this.resources["mineRate"]=this.mineRateUpgrade;
    this.resources["storage"]=this.storageUpgrade;
    this.resources["research"]=this.researchUpgrade;
    this.resources["engine"]=this.engineUpgrade;
    this.resources["QG"]=this.QGUpgrade;
    this.resources["oreInfos"]=this.oreInfos;
}

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
            cost = 1000 / oreInfos[tabOre[j].toString()].meanValue;
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
                cost = costCredit / oreInfos[tabOre[j].toString()].meanValue;
            }
            json[i]['cost'][tabOre[j]] = Math.round(cost / tabOre.length);
        }
    }

    return json;
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
                cost = costCredit / oreInfos[tabOre[j].toString()].meanValue;
            }
            json[i]['cost'][tabOre[j]] = Math.round(cost / tabOre.length);
        }
    }
    return json;
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
                cost = costCredit / oreInfos[tabOre[j].toString()].meanValue;
            }
            json[i]['cost'][tabOre[j]] = Math.round(cost / tabOre.length);
        }
    }
    return json;
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
                cost = costCredit / oreInfos[tabOre[j].toString()].meanValue;
            }
            json[i]['cost'][tabOre[j]] = Math.round(cost / tabOre.length);
        }
    }

    return json;
}

export function initializeTrading() {
    defaultDatabase.ref("oreInfo/").once('value').then((oreInfo) => {
        const info = oreInfo.val();
        const oreInfoKey = Object.keys(info);
        let json ={};
        for (let i = 0; i < oreInfoKey.length; i++) {
            for (let j = 0; j < 500; j++) {
                json[j] = info[oreInfoKey[i]].meanValue;
            }
            defaultDatabase.ref("trading/" + oreInfoKey[i] +"/lastMinute").set(json);
        }

    });
}

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
                cost = costCredit / oreInfos[tabOre[j].toString()].meanValue;
            }
            json[i]['cost'][tabOre[j]] = Math.round(cost / tabOre.length);
        }
    }

    return json;
}


export function loadOreInfo() {
    return new Promise(function (resolve) {
        defaultDatabase.ref("oreInfo").once('value').then((snapshot) => {
            oreInfos = snapshot.val();
            resolve(1);
        });
    });
}

export function loadQuest() {
    return new Promise(function (resolve) {
        defaultDatabase.ref("quest").once('value').then((snapshot) => {
            quest = snapshot.val();
            resolve(1);
        });
    });
}