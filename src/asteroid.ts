import { defaultDatabase } from "./environment";
import { asteroidTypes } from "./resources";


/*
data = {
    user : userId
}
*/

export function searchAster(data) {
    //defaultDatabase.ref("users/" + data.user).once('value').then((user) => {
    const asteNum = getNewAsteroidType();
    const seed = generateRandomNumber(4) + generateRandomNumber(4);
    defaultDatabase.ref("users/" + data.user + "/asteroid/numAsteroid").set(asteNum);
    defaultDatabase.ref("users/" + data.user + "/asteroid/seed").set(seed);

    // });
}

function getNewAsteroidType() {
    return Math.floor(Math.random() * asteroidTypes.length);
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
