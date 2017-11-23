"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("./environment");
const resources_1 = require("./resources");
const quest_1 = require("./quest");
const ranking_1 = require("./ranking");
const utils_1 = require("./utils");
function upgradeShip(data) {
    environment_1.defaultDatabase.ref("users/" + data.user).once('value').then((user) => {
        const currentLvl = user.val().upgrade[data.upgrade + "Lvl"];
        const cost = resources_1.getUpgradeFromString(data.upgrade)[currentLvl + 1].cost;
        if (user.val().credit >= cost) {
            environment_1.defaultDatabase.ref("users/" + data.user + "/credit").set(utils_1.toFixed2(user.val().credit - cost));
            environment_1.defaultDatabase.ref("users/" + data.user + "/upgrade/" + data.upgrade + "Lvl").set(currentLvl + 1);
            quest_1.checkQuest('upgrade' + data.upgrade, 1, user.val(), data.user);
            ranking_1.calculScore(cost, user.val(), data.user);
        }
    });
}
exports.upgradeShip = upgradeShip;
//# sourceMappingURL=upgrade.js.map