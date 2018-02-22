import { defaultDatabase } from "./environment";
import { researchUpgrade, oreInfos, engineUpgrade } from "./resources";
import { toFixed2 } from './utils';
import { updateBoostTimer, BoostType } from './boost';
import { getResearchTotalTime } from './rules/researchRules';
import { getAsteroidCapacity, getAsteroidPurity, getTimeToGoToAsteroid } from './rules/asteroidRules';
//import { asteroidTypes } from "./resources";

enum searchState {
    launchSearch,
    searching,
    chooseAsteroid,
    traveling
}
/**
 * 
 * @param data [user] : userId, [distance] : distance
 */
export function searchAster(data) {
    defaultDatabase.ref("users/" + data.user + "/search/start").once('value').then((searchStart) => {
        if (searchStart.val() == 0) {
            defaultDatabase.ref("users/" + data.user + "/upgrade/research/lvl").once('value').then((researchLvl) => {

                defaultDatabase.ref("users/" + data.user + "/search/time").set(getResearchTotalTime(researchLvl.val(), data.distance));
                defaultDatabase.ref("users/" + data.user + "/search/start").set(Date.now());
                defaultDatabase.ref("users/" + data.user + "/search/state").set(searchState.searching);
                defaultDatabase.ref("users/" + data.user + "/search/distance").set(data.distance);
            });
        }
    });
}

/**
 * 
 * @param message [user] : userId, [ind]: asteroidIndex
 */
export function chooseAsteroid(message) {

    defaultDatabase.ref("users/" + message.user + "/search/result").once('value').then((result) => {
        if (result.val() != 0 && Object.keys(result.val()).length == 3
            && message.ind >= 0 && message.ind < 3) {
            let json = {};
            json[0] = result.val()[message.ind];
            defaultDatabase.ref("users/" + message.user + "/search/result")
                .set(json);
            defaultDatabase.ref("users/" + message.user + "/search/state").set(3);
            defaultDatabase.ref("users/" + message.user + "/search/start").set(Date.now());
            defaultDatabase.ref("users/" + message.user + "/asteroid/currentCapacity").set(0);
            defaultDatabase.ref("users/" + message.user + "/search/state").set(searchState.traveling);
        }
    });
}

/**
 * 
 * @param message [user] : userId
 */
export function updateAsteroidTimer(message) {
    defaultDatabase.ref("users/" + message.user + "/search").once('value').then((search) => {
        if (search.val().start != 0) {
            defaultDatabase.ref("users/" + message.user + "/boosts").once('value').then((boosts) => {
                //Searching
                let boostCoef = 1;
                if (boosts.val()[0].active == 1) {
                    updateBoostTimer(BoostType.fasterResearchAndTraveling, message.user);
                    boostCoef = 0.25;
                }

                if (search.val().state == searchState.searching) {

                    let timer = Math.floor((search.val().time * boostCoef) - (Date.now() - search.val().start));
                    if (timer <= 0) {
                        timer = 0;
                        fillSearchResult(message.user, search.val().distance);
                    }
                    defaultDatabase.ref("users/" + message.user + "/search/timer").set(timer);
                }
                //Traveling
                else if (search.val().state == searchState.traveling) {
                    let timer = Math.floor(((search.val().result[0].timeToGo) * boostCoef) -
                        (Date.now() - search.val().start));
                    if (timer <= 0) {
                        timer = 0;
                        changeAsteroid(message.user, search.val().result[0]);
                    }
                    defaultDatabase.ref("users/" + message.user + "/search/timer").set(timer);
                }
            });
        }
    });
}

/**
 * 
 * @param message [user] : userId
 */
export function rejectResults(message) {
    defaultDatabase.ref("users/" + message.user + "/search/result").set(0);
    defaultDatabase.ref("users/" + message.user + "/search/start").set(0);
    defaultDatabase.ref("users/" + message.user + "/search/state").set(searchState.launchSearch);
}

function changeAsteroid(userId, newAsteroid) {
    newAsteroid.currentCapacity = newAsteroid.capacity;
    defaultDatabase.ref("users/" + userId + "/asteroid").set(newAsteroid);
    defaultDatabase.ref("users/" + userId + "/search/result").set(0);
    defaultDatabase.ref("users/" + userId + "/search/start").set(0);
    defaultDatabase.ref("users/" + userId + "/search/state").set(searchState.launchSearch);
}

function fillSearchResult(userId, distance) {
    defaultDatabase.ref("users/" + userId + "/upgrade").once('value').then((upgrades) => {
        const oreNames = Object.keys(oreInfos);
        const researchLvl = upgrades.val().research.lvl;
        const engineLvl = upgrades.val().engine.lvl;
        for (let i = 0; i < 3; i++) {
            let json = {};
            json["ore"] = oreNameRandomWithDistance(oreNames, researchLvl);
            json["capacity"] = getAsteroidCapacity(researchLvl, distance, json["ore"]);
            json["seed"] = generateRandomNumber(4) + generateRandomNumber(4);
            let purity = getAsteroidPurity(researchLvl, distance);
            json["purity"] = purity;
            json["collectible"] = 0;
            // json["timeToGo"] = Math.floor((purity) + 10 + distance / 100) * engineUpgrade[user.val().upgrade.engine.lvl].speed;
            // TO CHANGE
            json['timeToGo'] = getTimeToGoToAsteroid(distance, engineLvl);
            defaultDatabase.ref("users/" + userId + "/search/result/" + i).set(json);
            defaultDatabase.ref("users/" + userId + "/search/state").set(searchState.chooseAsteroid);
        }
    });

}

function oreNameRandomWithDistance(oreNames, researchLvl) {
    const tabName = new Array<string>();

    for (let i = 0; i < oreNames.length; i++) {
        if (researchLvl >= oreInfos[oreNames[i]].searchNewOre) {
            tabName.push(oreNames[i]);
        }
    }
    return tabName[Math.floor(Math.random() * (tabName.length))];
}


function generateRandomNumber(range: number) {

    let seed = "";
    let nums = [];

    for (let i = 0; i < range; i++) {
        nums[i] = i;
    }

    let i = nums.length;
    let j = 0;

    while (i--) {
        j = Math.floor(Math.random() * (i + 1));
        seed = seed + "" + nums[j];
        nums.splice(j, 1);
    }

    return seed;
}
