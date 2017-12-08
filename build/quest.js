"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("./environment");
const resources_1 = require("./resources");
const utils_1 = require("./utils");
function checkQuest(missionName, values, currentUser, userID) {
    if (currentUser.quest.values === 0) {
        return;
    }
    if (missionName === currentUser.quest.type) {
        const finalValues = currentUser.quest.values - values;
        if (finalValues <= 0) {
            environment_1.defaultDatabase.ref("users/" + userID + "/credit").set(currentUser.quest.gain + currentUser.credit);
            environment_1.defaultDatabase.ref("users/" + userID + "/quest/values").set(0);
            environment_1.defaultDatabase.ref("users/" + userID + "/quest/gain").set(0);
        }
        else {
            environment_1.defaultDatabase.ref("users/" + userID + "/quest/values").set(utils_1.toFixed2(finalValues));
        }
    }
}
exports.checkQuest = checkQuest;
function giveGainUser(message) {
    environment_1.defaultDatabase.ref("users/" + message.user + "/chest/numberOfChest").set(message.numberOfChest);
    const stringTempChest = 'chest' + message.numberOfChest;
    environment_1.defaultDatabase.ref("users/" + message.user + "/chest/" + stringTempChest).once('value').then((chest) => {
        const chestTemp = chest.val();
        environment_1.defaultDatabase.ref("users/" + message.user).once('value').then((currentUser) => {
            let json = {};
            json['carbon'] = currentUser.val().ore.carbon;
            json['fer'] = currentUser.val().ore.fer;
            json['titanium'] = currentUser.val().ore.titanium;
            let creditTemp = currentUser.val().credit;
            for (let i = 0; i < 3; i++) {
                if (Object.keys(chestTemp[i])[0] === 'credit') {
                    creditTemp += chestTemp[i][Object.keys(chestTemp[i])[0]];
                }
                else {
                    regroupGainChest(Object.keys(chestTemp[i])[0], chestTemp[i][Object.keys(chestTemp[i])[0]], json);
                }
            }
            addChestToBase(json, message.user, creditTemp);
        });
    }).then(() => {
        environment_1.defaultDatabase.ref("users/" + message.user + "/chest/chest" + message.numberOfChest).remove();
    });
}
exports.giveGainUser = giveGainUser;
function regroupGainChest(type, number, json) {
    json[type] = utils_1.toFixed2(json[type] + number);
}
function addChestToBase(json, userID, creditTemp) {
    environment_1.defaultDatabase.ref("users/" + userID + "/ore").set(json);
    environment_1.defaultDatabase.ref("users/" + userID + "/credit").set(utils_1.toFixed2(creditTemp));
}
function openChest(userID, currentUser) {
    environment_1.defaultDatabase.ref("users/" + userID + "/chest/").remove('chest' + currentUser.chest.numberOfChest);
    environment_1.defaultDatabase.ref("users/" + userID + "/chest/numberOfChest").set(currentUser.chest.numberOfChest - 1);
}
exports.openChest = openChest;
function checkQuestGroup(oreName, values, currentUser, userID) {
    if (oreName === 'carbon') {
        environment_1.defaultDatabase.ref("questGroup/").once('value').then((questGroup) => {
            const finalValues = questGroup.val().values - values;
            if (finalValues <= 0) {
                environment_1.defaultDatabase.ref("users/" + userID + "/credit").set(currentUser.credit + questGroup.val().gain + currentUser.score * 0.2);
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
    environment_1.defaultDatabase.ref("mineRate/").once('value').then((mineRate) => {
        environment_1.defaultDatabase.ref("oreInfo/").once('value').then((oreInfo) => {
            let type = randomOre();
            let values;
            const mineRateCurrent = mineRate.val()[currentUser.upgrade.mineRate.lvl].maxRate * oreInfo.val()[type].miningSpeed;
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
            initChestRandom(userID, currentUser, questCurrent.gainMin, questCurrent.gainMax, questCurrent.gain, mineRate, oreInfo);
            environment_1.defaultDatabase.ref("users/" + userID + "/quest/gain").set(1);
            environment_1.defaultDatabase.ref("users/" + userID + "/quest/values").set(utils_1.toFixed2(values));
            environment_1.defaultDatabase.ref("users/" + userID + "/quest/valuesFinal").set(utils_1.toFixed2(values));
            environment_1.defaultDatabase.ref("users/" + userID + "/quest/name").set(text);
            environment_1.defaultDatabase.ref("users/" + userID + "/quest/text").set(questCurrent.text);
            environment_1.defaultDatabase.ref("users/" + userID + "/quest/type").set(typeFinal);
            environment_1.defaultDatabase.ref("users/" + userID + "/quest/num").set(i);
        });
    });
}
function newChest(message) {
    environment_1.defaultDatabase.ref("mineRate/").once('value').then((mineRate) => {
        environment_1.defaultDatabase.ref("oreInfo/").once('value').then((oreInfo) => {
            const gainMin = 0.01;
            const gainMax = 0.02;
            const gain = 1000;
            initChestRandom(message.userID, message.currentUser, gainMin, gainMax, gain, mineRate, oreInfo);
        });
    });
}
exports.newChest = newChest;
function initChestRandom(userID, currentUser, gainMin, gainMax, gain, mineRate, oreInfo) {
    let json = {};
    const chest1 = stringRandomChest(currentUser, mineRate, oreInfo, gainMin, gainMax, gain);
    const stringChest = 'chest' + (currentUser.chest.numberOfChest);
    json = {};
    json["0"] = {};
    json["0"][chest1.type] = utils_1.toFixed2(chest1.number);
    const chest2 = stringRandomChest(currentUser, mineRate, oreInfo, gainMin, gainMax, gain);
    json["1"] = {};
    json["1"][chest2.type] = utils_1.toFixed2(chest2.number);
    const chest3 = stringRandomChest(currentUser, mineRate, oreInfo, gainMin, gainMax, gain);
    json["2"] = {};
    json["2"][chest3.type] = utils_1.toFixed2(chest3.number);
    environment_1.defaultDatabase.ref("users/" + userID + '/chest/' + stringChest).set(json);
    environment_1.defaultDatabase.ref("users/" + userID + '/chest/numberOfChest').set(currentUser.chest.numberOfChest + 1);
}
function stringRandomChest(currentUser, mineRate, oreInfo, gainMin, gainMax, gain) {
    let tab = {
        'carbon': 23,
        'titanium': 46,
        'fer': 69,
        'credit': 100
    };
    const rand = Math.floor((Math.random() * 100) + 1);
    if (rand < tab.carbon) {
        const mineRateCurrent = mineRate.val()[currentUser.upgrade.mineRate.lvl].maxRate * oreInfo.val()['carbon'].miningSpeed;
        const valuesCarbon = mineRateCurrent * 60;
        return { type: 'carbon', number: valuesCarbon };
    }
    if (rand < tab.titanium) {
        const mineRateCurrent = mineRate.val()[currentUser.upgrade.mineRate.lvl].maxRate * oreInfo.val()['titanium'].miningSpeed;
        const valuesTitanium = mineRateCurrent * 60;
        return { type: 'titanium', number: valuesTitanium };
    }
    if (rand < tab.fer) {
        const mineRateCurrent = mineRate.val()[currentUser.upgrade.mineRate.lvl].maxRate * oreInfo.val()['fer'].miningSpeed;
        const valuesFer = mineRateCurrent * 60;
        return { type: 'fer', number: valuesFer };
    }
    if (rand <= tab.credit) {
        const gainCredit = currentUser.upgrade.score *
            utils_1.toFixed2((Math.random() * gainMax) + gainMin)
            + gain;
        return { type: 'credit', number: gainCredit / 3 };
    }
    return undefined;
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
function randomOre() {
    const type = (Math.floor(Math.random() * 3));
    if (type === 0) {
        return 'carbon';
    }
    else if (type === 1) {
        return 'titanium';
    }
    else if (type === 2) {
        return 'fer';
    }
    return 'carbon';
}
//# sourceMappingURL=quest.js.map