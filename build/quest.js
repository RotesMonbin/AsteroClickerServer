"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("./environment");
const ranking_1 = require("./ranking");
const resources_1 = require("./resources");
const utils_1 = require("./utils");
function checkQuest(oreName, values, currentUser, userID) {
    if (currentUser.quest.gain === 0) {
        return;
    }
    if (oreName === currentUser.quest.type) {
        const finalValues = currentUser.quest.values - values;
        if (finalValues <= 0) {
            environment_1.defaultDatabase.ref("users/" + userID + "/credit").set(currentUser.quest.gain + currentUser.credit);
            ranking_1.calculScore(currentUser.quest.gain, currentUser, userID);
            environment_1.defaultDatabase.ref("users/" + userID + "/quest/gain").set(0);
            environment_1.defaultDatabase.ref("users/" + userID + "/quest/values").set(0);
        }
        else {
            environment_1.defaultDatabase.ref("users/" + userID + "/quest/values").set(utils_1.toFixed2(finalValues));
        }
    }
}
exports.checkQuest = checkQuest;
function updateQuestUser() {
    environment_1.defaultDatabase.ref("users/").once('value').then((user) => {
        const userUis = Object.keys(user.val());
        for (let i = 0; i < userUis.length; i++) {
            const currentUser = user.val()[userUis[i]];
            if (currentUser.quest.gain != 0) {
                continue;
            }
            const randomQuest = Math.floor((Math.random() * resources_1.quest.length));
            initQuestUser(randomQuest, userUis[i]);
        }
    });
}
exports.updateQuestUser = updateQuestUser;
function initQuestUser(i, userID) {
    environment_1.defaultDatabase.ref("users/" + userID + "/quest/values").set(resources_1.quest[i].values);
    environment_1.defaultDatabase.ref("users/" + userID + "/quest/gain").set(resources_1.quest[i].gain);
    environment_1.defaultDatabase.ref("users/" + userID + "/quest/name").set(resources_1.quest[i].name);
    environment_1.defaultDatabase.ref("users/" + userID + "/quest/type").set(resources_1.quest[i].type);
    environment_1.defaultDatabase.ref("users/" + userID + "/quest/num").set(i);
}
//# sourceMappingURL=quest.js.map