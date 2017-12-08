"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("./environment");
const resources_1 = require("./resources");
function searchAster(data) {
    environment_1.defaultDatabase.ref("users/" + data.user).once('value').then((user) => {
        if (user.val().search.start == 0) {
            environment_1.defaultDatabase.ref("users/" + data.user + "/search/start").set(Date.now());
        }
    });
}
exports.searchAster = searchAster;
function chooseAsteroid(message) {
    environment_1.defaultDatabase.ref("users/" + message.user).once('value').then((user) => {
        if (user.val().search.result != 0 && Object.keys(user.val().search.result).length == 3
            && message.ind >= 0 && message.ind < 3) {
            let json = {};
            json[0] = user.val().search.result[message.ind];
            environment_1.defaultDatabase.ref("users/" + message.user + "/search/result")
                .set(json);
            environment_1.defaultDatabase.ref("users/" + message.user + "/search/start").set(Date.now());
            environment_1.defaultDatabase.ref("users/" + message.user + "/asteroid/currentCapacity").set(0);
        }
    });
}
exports.chooseAsteroid = chooseAsteroid;
function updateAsteroidTimer(message) {
    environment_1.defaultDatabase.ref("users/" + message.user).once('value').then((user) => {
        if (user.val().search.start != 0) {
            if (user.val().search.result == 0) {
                let timer = (resources_1.researchUpgrade[user.val().upgrade.research.lvl].searchTime * 1000) -
                    (Date.now() - user.val().search.start);
                if (timer <= 0) {
                    timer = 0;
                    fillSearchResult(message.user, user);
                }
                environment_1.defaultDatabase.ref("users/" + message.user + "/search/timer").set(timer);
            }
            else if (user.val().search.result.length == 1) {
                let timer = (user.val().search.result[0].timeToGo * 1000) -
                    (Date.now() - user.val().search.start);
                if (timer <= 0) {
                    timer = 0;
                    changeAsteroid(message.user, user.val().search.result[0]);
                }
                environment_1.defaultDatabase.ref("users/" + message.user + "/search/timer").set(timer);
            }
        }
    });
}
exports.updateAsteroidTimer = updateAsteroidTimer;
function rejectResults(message) {
    environment_1.defaultDatabase.ref("users/" + message.user + "/search/result").set(0);
    environment_1.defaultDatabase.ref("users/" + message.user + "/search/start").set(0);
}
exports.rejectResults = rejectResults;
function changeAsteroid(userId, newAsteroid) {
    delete newAsteroid.timeToGo;
    newAsteroid.currentCapacity = newAsteroid.capacity;
    environment_1.defaultDatabase.ref("users/" + userId + "/asteroid").set(newAsteroid);
    environment_1.defaultDatabase.ref("users/" + userId + "/search/result").set(0);
    environment_1.defaultDatabase.ref("users/" + userId + "/search/start").set(0);
}
function fillSearchResult(userId, user) {
    const oreNames = Object.keys(resources_1.oreInfo);
    const researchLvl = user.val().upgrade.research.lvl;
    const miningRate = resources_1.mineRateUpgrade[user.val().upgrade.mineRate.lvl].baseRate;
    for (let i = 0; i < 3; i++) {
        let json = {};
        json["ore"] = oreNames[Math.floor(Math.random() * oreNames.length)];
        json["capacity"] = 1000 * (1 + (0.01 * researchLvl)) * miningRate * resources_1.oreInfo[json["ore"]].miningSpeed;
        json["seed"] = generateRandomNumber(4) + generateRandomNumber(4);
        const purityRand = Math.random();
        json["purity"] = 80 + Math.floor(purityRand * 40);
        json["timeToGo"] = Math.floor((purityRand * 20) + 10);
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