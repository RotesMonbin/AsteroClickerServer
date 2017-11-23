"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("./environment");
function getUpgradeFromString(name) {
    switch (name) {
        case "mineRate":
            return exports.mineRateUpgrade;
        case "storage":
            return exports.storageUpgrade;
        case "research":
            return exports.researchUpgrade;
        default:
            console.log("Upgrade unknown");
            return null;
    }
}
exports.getUpgradeFromString = getUpgradeFromString;
function loadMineRate() {
    return new Promise(function (resolve) {
        environment_1.defaultDatabase.ref("mineRate").once('value').then((snapshot) => {
            exports.mineRateUpgrade = snapshot.val();
            resolve(1);
        });
    });
}
exports.loadMineRate = loadMineRate;
function loadStorage() {
    return new Promise(function (resolve) {
        environment_1.defaultDatabase.ref("storage").once('value').then((snapshot) => {
            exports.storageUpgrade = snapshot.val();
            resolve(1);
        });
    });
}
exports.loadStorage = loadStorage;
function loadResearch() {
    return new Promise(function (resolve) {
        environment_1.defaultDatabase.ref("research").once('value').then((snapshot) => {
            exports.researchUpgrade = snapshot.val();
            resolve(1);
        });
    });
}
exports.loadResearch = loadResearch;
function loadOreInfo() {
    return new Promise(function (resolve) {
        environment_1.defaultDatabase.ref("oreInfo").once('value').then((snapshot) => {
            exports.oreInfo = snapshot.val();
            resolve(1);
        });
    });
}
exports.loadOreInfo = loadOreInfo;
function loadQuest() {
    return new Promise(function (resolve) {
        environment_1.defaultDatabase.ref("quest").once('value').then((snapshot) => {
            exports.quest = snapshot.val();
            resolve(1);
        });
    });
}
exports.loadQuest = loadQuest;
//# sourceMappingURL=resources.js.map