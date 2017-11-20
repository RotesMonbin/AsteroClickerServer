"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("./environment");
const utils_1 = require("./utils");
function generateMineRateUpgrade(range) {
    let json = [];
    for (let i = 0; i < range; i++) {
        const rate = utils_1.toFixed2(Math.round(Math.pow(i + 1, 1.05) * 10) / 10);
        json[i] = {
            baseRate: rate,
            cost: Math.floor(20000 / 1000 * Math.pow(i, 1.04)) * 1000,
            maxRate: utils_1.toFixed2(Math.round(rate * 3 * 10) / 10)
        };
    }
    environment_1.defaultDatabase.ref("mineRate/").set(json);
}
exports.generateMineRateUpgrade = generateMineRateUpgrade;
function generateStorageUpgrade(range) {
    let json = [];
    for (let i = 0; i < range; i++) {
        json[i] = {
            capacity: Math.floor(5000 / 1000 * Math.pow(i + 1, 1.5)) * 1000,
            cost: Math.floor(30000 / 1000 * Math.pow(i, 1.07)) * 1000
        };
    }
    environment_1.defaultDatabase.ref("storage/").set(json);
}
exports.generateStorageUpgrade = generateStorageUpgrade;
//# sourceMappingURL=databaseSetUp.js.map