"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("./environment");
const utils_1 = require("./utils");
const resources_1 = require("./resources");
function searchAster(data) {
    environment_1.defaultDatabase.ref("users/" + data.user).once('value').then((user) => {
        if (user.val().search.timer == 0) {
            environment_1.defaultDatabase.ref("users/" + data.user + "/search/timer").set(Date.now());
        }
    });
}
exports.searchAster = searchAster;
function researchFinished(message) {
    environment_1.defaultDatabase.ref("users/" + message.user).once('value').then((user) => {
        if (user.val().search.result == 0 &&
            user.val().search.timer != 0 &&
            utils_1.isTimerFinished(user.val().search.timer, resources_1.researchUpgrade[user.val().researchLvl].time * 60 * 1000)) {
            fillSearchResult(message.user);
        }
    });
}
exports.researchFinished = researchFinished;
function fillSearchResult(userId) {
    const oreNames = Object.keys(resources_1.oreInfo);
    for (let i = 0; i < 3; i++) {
        let json = {};
        json["capacity"] = 1000;
        json["seed"] = generateRandomNumber(4) + generateRandomNumber(4);
        json["ore"] = oreNames[Math.floor(Math.random() * oreNames.length)];
        json["purity"] = 80 + Math.floor(Math.random() * 40);
        json["timeToGo"] = 15;
        environment_1.defaultDatabase.ref("users/" + userId + "/search/result/" + i).set(json);
    }
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