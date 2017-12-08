"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("./environment");
const resources_1 = require("./resources");
const quest_1 = require("./quest");
const ranking_1 = require("./ranking");
const utils_1 = require("./utils");
function upgradeShip(data) {
    environment_1.defaultDatabase.ref("users/" + data.user).once('value').then((user) => {
        if (user.val().upgrade[data.upgrade].start == 0) {
            const currentLvl = user.val().upgrade[data.upgrade].lvl;
            const cost = resources_1.getUpgradeFromString(data.upgrade)[currentLvl + 1].cost;
            if (user.val().credit >= cost) {
                environment_1.defaultDatabase.ref("users/" + data.user + "/credit").set(utils_1.toFixed2(user.val().credit - cost));
                environment_1.defaultDatabase.ref("users/" + data.user + "/upgrade/" + data.upgrade + "/start").set(Date.now());
                quest_1.checkQuest('upgrade' + data.upgrade, 1, user.val(), data.user);
                ranking_1.calculScore(cost, user.val(), data.user);
            }
        }
    });
}
exports.upgradeShip = upgradeShip;
function updateUpgradeTimer(data) {
    environment_1.defaultDatabase.ref("users/" + data.user + "/upgrade/" + data.upgrade).once('value').then((upgrade) => {
        if (upgrade.val().start != 0) {
            const currentLvl = upgrade.val().lvl;
            let timer = (resources_1.getUpgradeFromString(data.upgrade)[currentLvl].time * 1000) -
                (Date.now() - upgrade.val().start);
            if (timer <= 0) {
                timer = 0;
                environment_1.defaultDatabase.ref("users/" + data.user + "/upgrade/" + data.upgrade + "/lvl").set(currentLvl + 1);
                environment_1.defaultDatabase.ref("users/" + data.user + "/upgrade/" + data.upgrade + "/start").set(0);
            }
            environment_1.defaultDatabase.ref("users/" + data.user + "/upgrade/" + data.upgrade + "/timer").set(timer);
        }
    });
}
exports.updateUpgradeTimer = updateUpgradeTimer;
//# sourceMappingURL=upgrade.js.map