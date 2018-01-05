import { defaultDatabase } from "./environment";
import { toFixed2 } from "./utils";

export function generateMineRateUpgrade(range: number) {
    let json = [];

    json[0] = {
        baseRate: 1,
        maxRate: 1.5,
        frenzyTime: 10,
        cost: 1000, //Prix = (500 * x^1.7) + 1500
        time: 10 //(level*(level+1)/10)+10
    }

    for (let i = 1; i < range; i++) {
        const rate = toFixed2(json[i - 1].baseRate + (0.2 * (Math.floor((i - 1) / 10) + 1)));
        json[i] = {
            baseRate: rate,
            maxRate: toFixed2(Math.round(rate * 1.5 * 10) / 10),
            frenzyTime: 10+((i*10)/200),
            cost: Math.floor(((500 * Math.pow(i, 1.7)) + 1500) / 1000) * 1000, //Prix = (500 * x^1.7) + 1500
            time: (i * (i + 1) / 10) + 10 //(level*(level+1)/10)+10
        }
    }

    defaultDatabase.ref("mineRate/").set(json);
}

export function generateStorageUpgrade(range: number) {
    let json = [];
    for (let i = 0; i < range; i++) {
        json[i] = {
            capacity: Math.floor(5000 / 1000 * Math.pow(i + 1, 1.5)) * 1000,
            cost: Math.floor(3000 / 1000 * Math.pow(i, 1.07)) * 1000,
            time: (i * (i + 1) / 10) + 10
        }
    }

    defaultDatabase.ref("storage/").set(json);
}

export function generateEngineUpgrade(range: number) {
    let json = [];
    for (let i = 0; i < range; i++) {
        json[i] = {
            speed: 10 + i,
            cost: Math.floor(3000 / 1000 * Math.pow(i, 1.07)) * 1000,
            time: (i * (i + 1) / 10) + 10
        }
    }

    defaultDatabase.ref("engine/").set(json);
}

export function generateResearchUpgrade(range: number) {
    let json = [];
    for (let i = 0; i < range; i++) {
        json[i] = {
            searchTime: i == 0 ? 120 : toFixed2(json[i - 1].searchTime * 0.92),
            minDist: 100,
            maxDist: 10000 + 1000 * i,
            cost: Math.floor(5000 / 1000 * Math.pow(i, 1.09)) * 1000,
            time: (i * (i + 1) / 10) + 10,
        }
    }

    defaultDatabase.ref("research/").set(json);
}

/**
 * 
 * @param message [user] : userId 
 * @param message [email]: userEmail
 * 
 */
export function initializeUser(message) {

    let json = {};

    json["asteroid"] = {};
    json["asteroid"]["capacity"] = 1000;
    json["asteroid"]["currentCapacity"] = 1000;
    json["asteroid"]["ore"] = "carbon";
    json["asteroid"]["purity"] = 100;
    json["asteroid"]["seed"] = "01230123";

    json["ore"] = {};
    json["ore"]["carbon"] = 0;
    json["ore"]["titanium"] = 0;
    json["ore"]["iron"] = 0;
    json["ore"]["hyperium"] = 0;
    json["ore"]["gold"] = 0;


    json["chest"] = {};
    json["chest"]["numberOfChest"] = 0;

    json["profile"] = {};

    json["event"] = 0;

    json["quest"] = {};
    json["quest"]["gain"] = -1;

    json["upgrade"] = {};
    json["upgrade"]["mineRate"] = {};
    json["upgrade"]["mineRate"]["timer"] = 0;
    json["upgrade"]["mineRate"]["start"] = 0;

    json["upgrade"]["storage"] = {};
    json["upgrade"]["storage"]["timer"] = 0;
    json["upgrade"]["storage"]["start"] = 0;

    json["upgrade"]["research"] = {};
    json["upgrade"]["research"]["timer"] = 0;
    json["upgrade"]["research"]["start"] = 0;

    json["upgrade"]["engine"] = {};
    json["upgrade"]["engine"]["timer"] = 0;
    json["upgrade"]["engine"]["start"] = 0;

    json["upgrade"]["score"] = 0;

    json["search"] = {};
    json["search"]["result"] = 0;
    json["search"]["timer"] = 0;
    json["search"]["start"] = 0;


    json["profile"]["email"] = message.email;
    json["profile"]["name"] = message.email;

    json["upgrade"]["mineRate"]["lvl"] = 1;
    json["upgrade"]["storage"]["lvl"] = 1;
    json["upgrade"]["research"]["lvl"] = 1;
    json["upgrade"]["engine"]["lvl"] = 1;

    json["credit"] = 0;

    defaultDatabase.ref("users/" + message.user).set(json);
}

export function resetUsers() {
    defaultDatabase.ref("users/").once('value').then((user) => {

        let allUsers = user.val();
        let usersId = Object.keys(allUsers);

        let json = {};

        json["asteroid"] = {};
        json["asteroid"]["capacity"] = 1000;
        json["asteroid"]["currentCapacity"] = 1000;
        json["asteroid"]["ore"] = "carbon";
        json["asteroid"]["purity"] = 100;
        json["asteroid"]["seed"] = "01230123";

        json["ore"] = {};


        json["chest"] = {};
        json["chest"]["numberOfChest"] = 0;

        json["profile"] = {};

        json["event"] = 0;

        json["quest"] = {};
        json["quest"]["gain"] = -1;

        json["upgrade"] = {};
        json["upgrade"]["mineRate"] = {};
        json["upgrade"]["mineRate"]["timer"] = 0;
        json["upgrade"]["mineRate"]["start"] = 0;

        json["upgrade"]["storage"] = {};
        json["upgrade"]["storage"]["timer"] = 0;
        json["upgrade"]["storage"]["start"] = 0;

        json["upgrade"]["research"] = {};
        json["upgrade"]["research"]["timer"] = 0;
        json["upgrade"]["research"]["start"] = 0;

        json["upgrade"]["engine"] = {};
        json["upgrade"]["engine"]["timer"] = 0;
        json["upgrade"]["engine"]["start"] = 0;

        json["upgrade"]["score"] = 0;

        json["search"] = {};
        json["search"]["result"] = 0;
        json["search"]["timer"] = 0;
        json["search"]["start"] = 0;

        for (let i = 0; i < usersId.length; i++) {
            json["profile"]["email"] = allUsers[usersId[i]].profile.email;
            json["profile"]["name"] = allUsers[usersId[i]].profile.name;

            json["upgrade"]["mineRate"]["lvl"] = allUsers[usersId[i]].upgrade.mineRate.lvl;
            json["upgrade"]["storage"]["lvl"] = allUsers[usersId[i]].upgrade.storage.lvl;
            json["upgrade"]["research"]["lvl"] = allUsers[usersId[i]].upgrade.research.lvl;
            json["upgrade"]["engine"]["lvl"] = allUsers[usersId[i]].upgrade.engine.lvl;

            json["ore"]["carbon"] = allUsers[usersId[i]]["ore"]["carbon"];
            json["ore"]["titanium"] = allUsers[usersId[i]]["ore"]["titanium"];
            json["ore"]["iron"] = allUsers[usersId[i]]["ore"]["iron"];
            json["ore"]["hyperium"] = 0;
            json["ore"]["gold"] = 0;

            json["credit"] = allUsers[usersId[i]].credit;

            defaultDatabase.ref("users/" + usersId[i]).set(json);
        }
    });
}