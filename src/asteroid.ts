import { defaultDatabase } from "./environment";
import { researchUpgrade, oreInfo, mineRateUpgrade } from "./resources";
//import { asteroidTypes } from "./resources";


/**
 * 
 * @param message [user] : userId
 */
export function searchAster(data) {
    defaultDatabase.ref("users/" + data.user).once('value').then((user) => {
        if (user.val().search.start == 0) {
            defaultDatabase.ref("users/" + data.user + "/search/start").set(Date.now());
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
                let timer = (researchUpgrade[user.val().upgrade.research.lvl].searchTime * 1000) -
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
}

function changeAsteroid(userId, newAsteroid) {
    delete newAsteroid.timeToGo;
    newAsteroid.currentCapacity = newAsteroid.capacity;
    defaultDatabase.ref("users/" + userId + "/asteroid").set(newAsteroid);
    defaultDatabase.ref("users/" + userId + "/search/result").set(0);
    defaultDatabase.ref("users/" + userId + "/search/start").set(0);
}

function fillSearchResult(userId, user, distance) {
    const oreNames = Object.keys(oreInfo);
    const researchLvl = user.val().upgrade.research.lvl;
    const miningRate = mineRateUpgrade[user.val().upgrade.mineRate.lvl].baseRate;
    for (let i = 0; i < 3; i++) {
        let json = {};
        json["ore"] = oreNames[Math.floor(Math.random() * oreNames.length)];
        json["capacity"] = Math.floor(1000 * (1 + (0.01 * researchLvl)) * miningRate * oreInfo[json["ore"]].miningSpeed);
        json["seed"] = generateRandomNumber(4) + generateRandomNumber(4);
        const purityRand = Math.random();
        json["purity"] = 80 + Math.floor(purityRand * 40);
        json["timeToGo"] = Math.floor((purityRand * 20) + 10 + distance / 100);

        defaultDatabase.ref("users/" + userId + "/search/result/" + i).set(json);
    }
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
