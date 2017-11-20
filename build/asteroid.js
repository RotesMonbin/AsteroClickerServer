"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("./environment");
const resources_1 = require("./resources");
function searchAster(data) {
    const asteNum = getNewAsteroidType();
    const seed = generateRandomNumber(4) + generateRandomNumber(4);
    environment_1.defaultDatabase.ref("users/" + data.user + "/asteroid/numAsteroid").set(asteNum);
    environment_1.defaultDatabase.ref("users/" + data.user + "/asteroid/seed").set(seed);
}
exports.searchAster = searchAster;
function getNewAsteroidType() {
    return Math.floor(Math.random() * resources_1.asteroidTypes.length);
}
function generateRandomNumber(range) {
    let seed = "";
    let nums = [];
    for (let i = 0; i < range; i++) {
        nums[i] = i;
    }
    let i = nums.length;
    let j = 0;
    while (i--) {
        j = Math.floor(Math.random() * (i + 1));
        seed = seed + "" + nums[j];
        nums.splice(j, 1);
    }
    return seed;
}
//# sourceMappingURL=asteroid.js.map