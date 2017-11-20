"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("./environment");
function getUpgradeFromString(name) {
    switch (name) {
        case "mineRate":
            return exports.mineRateUpgrade;
        case "storage":
            return exports.storageUpgrade;
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
function loadAsteroidTypes() {
    return new Promise(function (resolve) {
        environment_1.defaultDatabase.ref("typeAste").once('value').then((snapshot) => {
            exports.asteroidTypes = snapshot.val();
            resolve(1);
        });
    });
}
exports.loadAsteroidTypes = loadAsteroidTypes;
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