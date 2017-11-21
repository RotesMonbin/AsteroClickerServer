"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("./environment");
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
            environment_1.defaultDatabase.ref("users/" + userID + "/quest/gain").set(0);
            environment_1.defaultDatabase.ref("users/" + userID + "/quest/values").set(0);
        }
        else {
            environment_1.defaultDatabase.ref("users/" + userID + "/quest/values").set(utils_1.toFixed2(finalValues));
        }
    }
}
exports.checkQuest = checkQuest;
function checkQuestGroup(oreName, values, currentUser, userID) {
    if (oreName === 'carbon') {
        environment_1.defaultDatabase.ref("questGroup/").once('value').then((questGroup) => {
            const finalValues = questGroup.val().values - values;
            if (finalValues <= 0) {
                environment_1.defaultDatabase.ref("users/" + userID + "/credit").set(currentUser.credit + questGroup.val().gain + currentUser.score * 0.05);
            }
            else {
                environment_1.defaultDatabase.ref("questGroup/values").set(utils_1.toFixed2(finalValues));
            }
        });
    }
}
exports.checkQuestGroup = checkQuestGroup;
function updateQuestUser() {
    environment_1.defaultDatabase.ref("users/").once('value').then((user) => {
        const userUis = Object.keys(user.val());
        for (let i = 0; i < userUis.length; i++) {
            const currentUser = user.val()[userUis[i]];
            if (currentUser.quest.gain != 0) {
                continue;
            }
            const questCurrent = resources_1.quest[i];
            const randomQuest = Math.floor((Math.random() * resources_1.quest.length));
            const gainCredit = currentUser.score *
                utils_1.toFixed2((Math.random() * questCurrent.gainMax) + questCurrent.gainMin)
                + questCurrent.gain;
            initQuestUser(randomQuest, userUis[i], gainCredit);
        }
    });
}
exports.updateQuestUser = updateQuestUser;
function initQuestUser(i, userID, newGain) {
    environment_1.defaultDatabase.ref("users/" + userID + "/quest/values").set(resources_1.quest[i].values);
    environment_1.defaultDatabase.ref("users/" + userID + "/quest/gain").set(newGain);
    environment_1.defaultDatabase.ref("users/" + userID + "/quest/name").set(resources_1.quest[i].name);
    environment_1.defaultDatabase.ref("users/" + userID + "/quest/type").set(resources_1.quest[i].type);
    environment_1.defaultDatabase.ref("users/" + userID + "/quest/num").set(i);
}
function initQuestGroup() {
    environment_1.defaultDatabase.ref("users/").once('value').then((user) => {
        const values = Object.keys(user.val()).length * 100000;
        environment_1.defaultDatabase.ref("questGroup/values").set(values);
        environment_1.defaultDatabase.ref("questGroup/gain").set(10000);
        environment_1.defaultDatabase.ref("questGroup/type").set('carbon');
        environment_1.defaultDatabase.ref("questGroup/valuesFinal").set(values);
        environment_1.defaultDatabase.ref("questGroup/name").set('Retrieve ' + values + ' carbon with other Captains !');
    });
}
exports.initQuestGroup = initQuestGroup;
//# sourceMappingURL=quest.js.map