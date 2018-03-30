import { defaultDatabase } from "./environment"
import { getUpgradeFromString, QGUpgrade } from "./resources";
import { checkQuest } from "./quest";
import { calculScore } from "./ranking";
import { toFixed2 } from "./utils";
import { unlockNewCargo } from './cargo';
import { nextStep } from './tutorial';

/**
 * 
 * @param message [user] : userId, [upgrade]: upgradeName
 * 
 */

export function upgradeShipCredit(data) {
    defaultDatabase.ref("users/" + data.user).once('value').then((user) => {
        if (user.val().upgrade[data.upgrade].start == 0) {
            const currentLvl = user.val().upgrade[data.upgrade].lvl;
            const cost = getUpgradeFromString(data.upgrade)[currentLvl + 1].cost;
            if (user.val().credit >= cost) {
                defaultDatabase.ref("users/" + data.user + "/credit").set(toFixed2(user.val().credit - cost));
                defaultDatabase.ref("users/" + data.user + "/upgrade/" + data.upgrade + "/start").set(Date.now());
                checkQuest('upgrade' + data.upgrade, 1, data.user);
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
export function upgradeShipOre(data) {
    defaultDatabase.ref("users/" + data.user).once('value').then((user) => {
        if (user.val().upgrade[data.upgrade].start == 0) {
            const currentLvl = user.val().upgrade[data.upgrade].lvl;
            if (valuesCostOreOk(getUpgradeFromString(data.upgrade)[currentLvl + 1].cost, user.val()) && QGLvlOk(user.val(), data.upgrade)) {
                databaseOreSet(getUpgradeFromString(data.upgrade)[currentLvl + 1].cost, data.user, user.val());
                defaultDatabase.ref("users/" + data.user + "/upgrade/" + data.upgrade + "/start").set(Date.now());
                checkQuest('upgrade' + data.upgrade, 1, data.user);
            }
        }
    });
}

function databaseOreSet(updateJson, uid, currentUser) {
    const keys = Object.keys(updateJson);
    for (let i = 0; i < keys.length; i++) {
        if (keys[i] === 'credit') {
            defaultDatabase.ref("users/" + uid + "/credit").set(toFixed2(currentUser.credit - updateJson[keys[i]]));
        } else {
            defaultDatabase.ref("users/" + uid + "/ore/" + keys[i]).set(toFixed2(currentUser.ore[keys[i]] - updateJson[keys[i]]));
        }
        calculScore(updateJson[keys[i]], currentUser, uid);
    }
}

function valuesCostOreOk(updateJson, currentUser) {
    const keys = Object.keys(updateJson);
    for (let i = 0; i < keys.length; i++) {
        if (keys[i] === 'credit') {
            if (updateJson[keys[i]] > currentUser.credit) {
                return false;
            }
        } else {
            if (updateJson[keys[i]] > currentUser.ore[keys[i]]) {
                return false;
            }
        }
    }
    return true;
}

function QGLvlOk(currentUser, updateName) {
    const lvlMax = getUpgradeFromString('QG')[currentUser.upgrade['QG'].lvl].lvlMax;
    return lvlMax >= currentUser.upgrade[updateName].lvl;
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

                if (data.upgrade === 'QG' && currentLvl === 0) {
                    nextStep({ user: data.user, step: 4 });
                }

                if (data.upgradeName === 'QG' && QGUpgrade[currentLvl].numberOfCargo != QGUpgrade[currentLvl + 1].numberOfCargo) {
                    unlockNewCargo(data.user);
                }

                defaultDatabase.ref("users/" + data.user + "/upgrade/" + data.upgrade + "/lvl").set(currentLvl + 1);
                defaultDatabase.ref("users/" + data.user + "/upgrade/" + data.upgrade + "/start").set(0);

            }
            defaultDatabase.ref("users/" + data.user + "/upgrade/" + data.upgrade + "/timer").set(timer);
        }

    });
}
