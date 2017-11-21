import { defaultDatabase } from "./environment";
import { isTimerFinished } from "./utils";
import { researchUpgrade, oreInfo } from "./resources";
//import { asteroidTypes } from "./resources";


/*
data = {
    user : userId
}
*/

export function searchAster(data) {
    defaultDatabase.ref("users/" + data.user).once('value').then((user) => {
        if (user.val().search.timer == 0) {
            defaultDatabase.ref("users/" + data.user + "/search/timer").set(Date.now());
        }
    });
}

/**
 * 
 * @param message [user] : userId
 */
export function researchFinished(message) {
    defaultDatabase.ref("users/" + message.user).once('value').then((user) => {
        if (user.val().search.result == 0 &&
        user.val().search.timer!=0 &&
            isTimerFinished(user.val().search.timer, researchUpgrade[user.val().researchLvl].time * 60 * 1000)) {
            fillSearchResult(message.user);
        }
    });
}

function fillSearchResult(userId) {
    const oreNames=Object.keys(oreInfo);
    for(let i=0;i<3;i++){
        let json={};
        json["capacity"]=1000;
        json["seed"]=generateRandomNumber(4) + generateRandomNumber(4);
        json["ore"]=oreNames[Math.floor(Math.random() * oreNames.length)];
        json["purity"]=80+Math.floor(Math.random() * 40);
        json["timeToGo"]=15;

        defaultDatabase.ref("users/" + userId + "/search/result/"+i).set(json);
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
