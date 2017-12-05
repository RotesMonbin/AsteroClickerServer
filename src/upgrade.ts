import { defaultDatabase } from "./environment"
import { getUpgradeFromString } from "./resources";
import { checkQuest } from "./quest";
import { calculScore } from "./ranking";
import { toFixed2 } from "./utils";

/**
 * 
 * @param message [user] : userId, [upgrade]: upgradeName
 * 
 */

export function upgradeShip(data) {
    defaultDatabase.ref("users/" + data.user).once('value').then((user) => {
        if (user.val().upgrade[data.upgrade].start == 0) {
            const currentLvl = user.val().upgrade[data.upgrade].lvl;
            const cost = getUpgradeFromString(data.upgrade)[currentLvl + 1].cost;
            if (user.val().credit >= cost) {
                defaultDatabase.ref("users/" + data.user + "/credit").set(toFixed2(user.val().credit - cost));
                defaultDatabase.ref("users/" + data.user + "/upgrade/" + data.upgrade + "/start").set(Date.now());
                checkQuest('upgrade' + data.upgrade, 1, user.val(), data.user);
                calculScore(cost, user.val(), data.user);
            }
        }
    });
}

/**
 * 
 * @param message [user] : userId, [upgrade]: upgradeName
 * 
 */
export function updateUpgradeTimer(data) {

    defaultDatabase.ref("users/" + data.user + "/upgrade/" + data.upgrade).once('value').then((upgrade) => {
        if (upgrade.val().start != 0) {
            const currentLvl = upgrade.val().lvl;
            let timer = (getUpgradeFromString(data.upgrade)[currentLvl].time * 1000) -
                (Date.now() - upgrade.val().start);
            if (timer <= 0) {
                timer = 0;
                defaultDatabase.ref("users/" + data.user + "/upgrade/" + data.upgrade + "/lvl").set(currentLvl + 1);
                defaultDatabase.ref("users/" + data.user + "/upgrade/" + data.upgrade + "/start").set(0);
            }
            defaultDatabase.ref("users/" + data.user + "/upgrade/" + data.upgrade + "/timer").set(timer);
        }

    });
}