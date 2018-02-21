import { defaultDatabase } from "./environment"
import { toFixed2 } from './utils';
import { getMineRateCreditCost, getMineRateBaseRate, lvl0MineRate, getMineRateOreCost, getMineRateMaxRate, getFrenzyDuration, getMineRateUpgradeTime } from './rules/mineRateRules';
import { storageOreNeedFromLvl, getStorageCreditCost, getCapacity, getStorageUpgradeTime } from './rules/storageRules';
import { getEngineSpeed, getEngineUpgradeTime, engineOreNeedFromLvl } from './rules/engineRules';
import { researchOreNeedFromLvl, getResearchCreditCost, lvl0ResearchTime, getResearchBaseTime, researchMinDistance, getResearchMaxDistance, getResearchUpgradeTime } from './rules/researchRules';
import { QGOreNeedFromLvl, getHQCreditCost, getMaxUpgradeLvl, getHQUpgradeTime, getCargoNumber } from './rules/headQuarterRules';

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

export function generateResources() {
    this.mineRateUpgrade = generateMineRateUpgrade(200);
    this.storageUpgrade = generateStorageUpgrade(200);
    this.researchUpgrade = generateResearchUpgrade(200);
    this.engineUpgrade = generateEngineUpgrade(200);
    this.QGUpgrade = generateQGUpgrade(200);

    this.resources = {};
    this.resources["mineRate"] = this.mineRateUpgrade;
    this.resources["storage"] = this.storageUpgrade;
    this.resources["research"] = this.researchUpgrade;
    this.resources["engine"] = this.engineUpgrade;
    this.resources["QG"] = this.QGUpgrade;
    this.resources["oreInfos"] = this.oreInfos;
}

// Mine Rate - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

export function generateMineRateUpgrade(range: number) {
    let json = [];
    let costCredit;
    let cost;
    let rate

    json[0] = lvl0MineRate;

    for (let i = 1; i < range; i++) {
        costCredit = getMineRateCreditCost(i);
        rate = getMineRateBaseRate(i, json[i - 1].baseRate);
        json[i] = {
            baseRate: rate,
            maxRate: getMineRateMaxRate(rate),
            frenzyTime: getFrenzyDuration(i),
            time: getMineRateUpgradeTime(i),
        }

        json[i]['cost'] = {};
        let tabOre = getMineRateOreCost(i);
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

export function generateStorageUpgrade(range: number) {
    let json = [];
    let costCredit;
    let cost;

    for (let i = 0; i < range; i++) {
        costCredit = getStorageCreditCost(i);

        json[i] = {
            capacity: getCapacity(i),
            time: getStorageUpgradeTime(i)
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

export function generateEngineUpgrade(range: number) {
    let json = [];
    let costCredit;
    let cost;

    for (let i = 0; i < range; i++) {
        costCredit = getMineRateCreditCost(i);

        json[i] = {
            speed: getEngineSpeed(i),
            time: getEngineUpgradeTime(i)
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

export function generateResearchUpgrade(range: number) {
    let json = [];
    let costCredit;
    let cost;

    for (let i = 0; i < range; i++) {
        costCredit = getResearchCreditCost(i);

        json[i] = {
            searchTime: i == 0 ? lvl0ResearchTime : getResearchBaseTime(json[i - 1].searchTime),
            minDist: researchMinDistance,
            maxDist: getResearchMaxDistance(i),
            time: getResearchUpgradeTime(i)
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
        let json = {};
        for (let i = 0; i < oreInfoKey.length; i++) {
            for (let j = 0; j < 500; j++) {
                json[j] = info[oreInfoKey[i]].meanValue;
            }
            defaultDatabase.ref("trading/" + oreInfoKey[i] + "/lastMinute").set(json);
        }

    });
}

// QG - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 


export function generateQGUpgrade(range: number) {
    let json = [];
    let costCredit;
    let cost;

    for (let i = 0; i < range; i++) {
        costCredit = getHQCreditCost(i);

        json[i] = {
            lvlMax: getMaxUpgradeLvl(i),
            time: getHQUpgradeTime(i),
            numberOfCargo: getCargoNumber(i),
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