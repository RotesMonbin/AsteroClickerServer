import { defaultDatabase } from "./environment"
import { getUpgradeFromString, oreInfo } from "./resources";
import { checkQuest } from "./quest";
import { calculScore } from "./ranking";
import { toFixed2 } from "./utils";

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
export function upgradeShipOre(data) {
    defaultDatabase.ref("users/" + data.user).once('value').then((user) => {
        if (user.val().upgrade[data.upgrade].start == 0) {
            const currentLvl = user.val().upgrade[data.upgrade].lvl;
            const cost = costOreUpgrade(getUpgradeFromString(data.upgrade)[currentLvl + 1].cost * 0.9, data.upgrade);
            const nameOre_0 = valuesOreForUpgrade(data.upgrade)[0];
            const nameOre_1 = valuesOreForUpgrade(data.upgrade)[1];
            if (user.val().ore[nameOre_0] >= cost[0] && user.val().ore[nameOre_1] >= cost[1]) {
                defaultDatabase.ref("users/" + data.user + "/ore/" + nameOre_0).set(toFixed2(user.val().ore[nameOre_0] - cost[0]));
                defaultDatabase.ref("users/" + data.user + "/ore/" + nameOre_1).set(toFixed2(user.val().ore[nameOre_1] - cost[1]));
                defaultDatabase.ref("users/" + data.user + "/upgrade/" + data.upgrade + "/start").set(Date.now());
                checkQuest('upgrade' + data.upgrade, 1, user.val(), data.user);
                calculScore(getUpgradeFromString(data.upgrade)[currentLvl + 1].cost, user.val(), data.user);
            }
        }
    });
}

function costOreUpgrade(costCredit: number, nameUpgrade: string) {
    return [costOreForCredit(valuesOreForUpgrade(nameUpgrade)[0], costCredit / 2), costOreForCredit(valuesOreForUpgrade(nameUpgrade)[1], costCredit / 2)];
}

function costOreForCredit(nameOre: string, costCredit: number) {
    return costCredit / oreInfo[nameOre].meanValue;
}

function valuesOreForUpgrade(nameUpgrade: string) {
    switch (nameUpgrade) {
        case 'engine':
            return ['gold', 'titanium'];
        case 'storage':
            return ['carbon', 'hyperium'];
        case 'research':
            return ['carbon', 'iron'];
        case 'mineRate':
            return ['iron', 'titanium'];
        default:
            return 0;
    }
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