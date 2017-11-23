import {defaultDatabase} from "./environment"
import { getUpgradeFromString } from "./resources";
import { checkQuest } from "./quest";
import { calculScore } from "./ranking";
import { toFixed2 } from "./utils";

/*
data = {
    user : userId,
    upgrade: upgradeName
}
*/
export function upgradeShip(data) {
    defaultDatabase.ref("users/" + data.user).once('value').then((user) => {
        const currentLvl = user.val().upgrade[data.upgrade + "Lvl"];
        const cost = getUpgradeFromString(data.upgrade)[currentLvl + 1].cost
        if (user.val().credit >= cost) {
            defaultDatabase.ref("users/" + data.user + "/credit").set(toFixed2(user.val().credit - cost));
            defaultDatabase.ref("users/" + data.user + "/upgrade/" + data.upgrade + "Lvl").set(currentLvl + 1);
            checkQuest('upgrade' + data.upgrade, 1, user.val(), data.user);
            calculScore(cost, user.val(), data.user);
        }
    });
}