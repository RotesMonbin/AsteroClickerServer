import { defaultDatabase } from "./environment"

export let mineRateUpgrade;
export let storageUpgrade;
export let researchUpgrade;
export let asteroidTypes;
export let oreInfo;

export let quest;

export function getUpgradeFromString(name) {
    switch (name) {
        case "mineRate":
            return mineRateUpgrade;
        case "storage":
            return storageUpgrade;
        case "research":
            return researchUpgrade;
        default:
            console.log("Upgrade unknown");
            return null;
    }
}

export function loadMineRate() {
    return new Promise(function (resolve) {
        defaultDatabase.ref("mineRate").once('value').then((snapshot) => {
            mineRateUpgrade = snapshot.val();
            resolve(1);
        });
    });
}

export function loadStorage() {
    return new Promise(function (resolve) {
        defaultDatabase.ref("storage").once('value').then((snapshot) => {
            storageUpgrade = snapshot.val();
            resolve(1);
        });
    });
}

export function loadResearch() {
    return new Promise(function (resolve) {
        defaultDatabase.ref("research").once('value').then((snapshot) => {
            researchUpgrade = snapshot.val();
            resolve(1);
        });
    });
}

export function loadAsteroidTypes() {
    return new Promise(function (resolve) {
        defaultDatabase.ref("typeAste").once('value').then((snapshot) => {
            asteroidTypes = snapshot.val();
            resolve(1);
        });
    });
}

export function loadOreInfo() {
    return new Promise(function (resolve) {
        defaultDatabase.ref("oreInfo").once('value').then((snapshot) => {
            oreInfo = snapshot.val();
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