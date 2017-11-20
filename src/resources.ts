import {defaultDatabase} from "./environment"

export let  mineRateUpgrade;
export let storageUpgrade;
export let asteroidTypes;
export let quest;

export function getUpgradeFromString(name) {
    switch (name) {
        case "mineRate":
            return mineRateUpgrade;
        case "storage":
            return storageUpgrade;
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

export function loadAsteroidTypes() {
    return new Promise(function (resolve) {
        defaultDatabase.ref("typeAste").once('value').then((snapshot) => {
            asteroidTypes = snapshot.val();
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