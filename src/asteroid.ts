import { defaultDatabase } from "./environment";
import { researchUpgrade, oreInfo, engineUpgrade } from "./resources";
import { toFixed2 } from './utils';
//import { asteroidTypes } from "./resources";

enum searchState {
    launchSearch,
    searching,
    chooseAsteroid,
    traveling
}
/**
 * 
 * @param message [user] : userId
 */
export function searchAster(data) {
    defaultDatabase.ref("users/" + data.user).once('value').then((user) => {
        if (user.val().search.start == 0) {
            defaultDatabase.ref("users/" + data.user + "/search/start").set(Date.now());
            defaultDatabase.ref("users/" + data.user + "/search/state").set(searchState.searching);
        }
    });
}

/**
 * 
 * @param message [user] : userId, [ind]: asteroidIndex
 */
export function chooseAsteroid(message) {

    defaultDatabase.ref("users/" + message.user).once('value').then((user) => {
        if (user.val().search.result != 0 && Object.keys(user.val().search.result).length == 3
            && message.ind >= 0 && message.ind < 3) {
            let json = {};
            json[0] = user.val().search.result[message.ind];
            defaultDatabase.ref("users/" + message.user + "/search/result")
                .set(json);
            defaultDatabase.ref("users/" + message.user + "/search/start").set(Date.now());
            defaultDatabase.ref("users/" + message.user + "/asteroid/currentCapacity").set(0);
            defaultDatabase.ref("users/" + message.user + "/search/state").set(searchState.traveling);
        }
    });
}

/**
 * 
 * @param message [user] : userId
 * @param message [distance]: distance
 */
export function updateAsteroidTimer(message) {
    defaultDatabase.ref("users/" + message.user).once('value').then((user) => {
        if (user.val().search.start != 0) {
            //Searching
            if (user.val().search.result == 0) {
                const researchLvl = user.val().upgrade.research.lvl;
                const maxDist = researchUpgrade[researchLvl].maxDist;
                const minDist = researchUpgrade[researchLvl].minDist;

                const coefDist = (((message.distance - minDist) / (maxDist - minDist)) * 5) + 1;
                let timer = ((researchUpgrade[user.val().upgrade.research.lvl].searchTime) * coefDist * 1000) -
                    (Date.now() - user.val().search.start);
                if (timer <= 0) {
                    timer = 0;
                    fillSearchResult(message.user, user, message.distance);
                }
                defaultDatabase.ref("users/" + message.user + "/search/timer").set(timer);
            }
            //Traveling
            else if (user.val().search.result.length == 1) {
                let timer = (user.val().search.result[0].timeToGo * 1000) -
                    (Date.now() - user.val().search.start);
                if (timer <= 0) {
                    timer = 0;
                    changeAsteroid(message.user, user.val().search.result[0]);
                }
                defaultDatabase.ref("users/" + message.user + "/search/timer").set(timer);
            }
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
    delete newAsteroid.timeToGo;
    newAsteroid.currentCapacity = newAsteroid.capacity;
    defaultDatabase.ref("users/" + userId + "/asteroid").set(newAsteroid);
    defaultDatabase.ref("users/" + userId + "/search/result").set(0);
    defaultDatabase.ref("users/" + userId + "/search/start").set(0);
    defaultDatabase.ref("users/" + userId + "/search/state").set(searchState.launchSearch);
    
}

function fillSearchResult(userId, user, distance) {
    const oreNames = Object.keys(oreInfo);
    const researchLvl = user.val().upgrade.research.lvl;
    for (let i = 0; i < 3; i++) {
        const maxDist = researchUpgrade[researchLvl].maxDist;
        const minDist = researchUpgrade[researchLvl].minDist;
        let json = {};
        json["ore"] = oreNameRandomWithDistance(oreNames, researchLvl);
        const distCapacityCoef = (((distance - minDist) * 0.8) / (maxDist - minDist)) + 0.8;
        //1000×(1+(0.10×ScanLevel))×ResourceMiningRate
        json["capacity"] = Math.floor((1000 * (1 + (0.1 * researchLvl)) * oreInfo[json["ore"]].miningSpeed) * distCapacityCoef);
        json["seed"] = generateRandomNumber(4) + generateRandomNumber(4);
        let purity = generatePurity(researchLvl, distance, maxDist, minDist);
        json["purity"] = purity;
        // json["timeToGo"] = Math.floor((purity) + 10 + distance / 100) * engineUpgrade[user.val().upgrade.engine.lvl].speed;
        // TO CHANGE
        json['timeToGo'] = Math.floor(distance / engineUpgrade[user.val().upgrade.engine.lvl].speed) + Math.floor(Math.random() * 50);
        defaultDatabase.ref("users/" + userId + "/search/result/" + i).set(json);
        defaultDatabase.ref("users/" + userId + "/search/state").set(searchState.chooseAsteroid);
    }
}

function oreNameRandomWithDistance(oreNames, researchLvl) {
    const tabName = new Array<string>();

    for (let i = 0; i < oreNames.length; i++) {
        if (researchLvl >= oreInfo[oreNames[i]].searchNewOre) {
            tabName.push(oreNames[i]);
        }
    }
    return tabName[Math.floor(Math.random() * (tabName.length))];
}

function generatePurity(researchLvl: number, distance: number, maxDistance: number, minDistance: number): number {
    const f = Math.pow(1 / researchLvl, 0.4) * 2;

    const v = Math.random();
    const w = Math.random();
    const x = Math.random();
    const y = Math.random();
    const z = Math.random();

    const g = Math.pow((v + w + x + y + z) / 5, f) + 0.5;
    const deltaD = (distance - minDistance);
    const d = ((deltaD * 0.3) / (maxDistance - minDistance)) - 0.15;

    return toFixed2((g + d) * 100);
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
