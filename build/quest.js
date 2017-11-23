"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("./environment");
const resources_1 = require("./resources");
const utils_1 = require("./utils");
function checkQuest(missionName, values, currentUser, userID) {
    if (currentUser.quest.gain === 0) {
        return;
    }
    if (missionName === currentUser.quest.type) {
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
            const randomQuest = Math.floor((Math.random() * resources_1.quest.length));
            initQuestUser(randomQuest, userUis[i], currentUser);
        }
    });
}
exports.updateQuestUser = updateQuestUser;
function initQuestUser(i, userID, currentUser) {
    if (i === 1) {
        i = 4;
    }
    const questCurrent = resources_1.quest[i];
    const gainCredit = currentUser.upgrade.score *
        utils_1.toFixed2((Math.random() * questCurrent.gainMax) + questCurrent.gainMin)
        + questCurrent.gain;
    environment_1.defaultDatabase.ref("mineRate/").once('value').then((mineRate) => {
        environment_1.defaultDatabase.ref("oreInfo/").once('value').then((oreInfo) => {
            let type = (Math.floor(Math.random() * 10)) % 2 === 0 ? "carbon" : "titanium";
            let values;
            const mineRateCurrent = mineRate.val()[currentUser.upgrade.mineRateLvl].maxRate * oreInfo.val()[type].miningSpeed;
            let typeFinal;
            switch (questCurrent.type) {
                case 'Buy':
                    values = utils_1.getOreAmountFromString(type, currentUser);
                    typeFinal = 'buy' + type;
                    break;
                case 'Sell':
                    values = mineRateCurrent * 60 * 10;
                    typeFinal = 'sell' + type;
                    break;
                case 'Retrieve':
                    values = mineRateCurrent * 60 * 20;
                    typeFinal = type;
                    break;
                case 'Upgrade':
                    values = 3;
                    const temp = (Math.floor(Math.random() * 10)) % 2 === 0 ? "storage" : "mineRate";
                    typeFinal = 'upgrade' + temp;
                    type = temp;
                    break;
                case 'Win':
                    values = mineRateCurrent * 60 * 20 * oreInfo.val()[type].meanValue;
                    type = 'Credit';
                    typeFinal = 'credit';
                    break;
                case 'Click':
                    break;
            }
            const text = questCurrent.type + ' ' + utils_1.toFixed2(values) + ' ' + type;
            environment_1.defaultDatabase.ref("users/" + userID + "/quest/gain").set(utils_1.toFixed2(gainCredit));
            environment_1.defaultDatabase.ref("users/" + userID + "/quest/values").set(utils_1.toFixed2(values));
            environment_1.defaultDatabase.ref("users/" + userID + "/quest/valuesFinal").set(utils_1.toFixed2(values));
            environment_1.defaultDatabase.ref("users/" + userID + "/quest/name").set(text);
            environment_1.defaultDatabase.ref("users/" + userID + "/quest/text").set(questCurrent.text);
            environment_1.defaultDatabase.ref("users/" + userID + "/quest/type").set(typeFinal);
            environment_1.defaultDatabase.ref("users/" + userID + "/quest/num").set(i);
        });
    });
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