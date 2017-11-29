import { defaultDatabase } from "./environment";
import { toFixed2 } from "./utils";

export function generateMineRateUpgrade( range: number) {
    let json = [];
    for (let i = 0; i < range; i++) {
        const rate = toFixed2(Math.round(Math.pow(i+1, 1.05) * 10) / 10);
        json[i] = {
            baseRate: rate,
            cost: Math.floor(2500/1000 *Math.pow(i , 1.04))*1000,
            maxRate: toFixed2(Math.round(rate * 3 * 10) / 10)
        }
    }

    defaultDatabase.ref("mineRate/").set(json);
}

export function generateStorageUpgrade( range: number) {
    let json = [];
    for (let i = 0; i < range; i++) {
        json[i] = {
            capacity:Math.floor(5000/1000 *Math.pow(i+1 , 1.5))*1000,
            cost: Math.floor(3000/1000 *Math.pow(i , 1.07))*1000
        }
    }

    defaultDatabase.ref("storage/").set(json);
}

export function resetUsers() {
    defaultDatabase.ref("users/").once('value').then((user) => {

        let allUsers=user.val();
        let usersId=Object.keys(allUsers);

        let json = {};

        json["asteroid"]={};
        json["asteroid"]["capacity"]=1000;
        json["asteroid"]["currentCapacity"]=1000;
        json["asteroid"]["ore"]="carbon";
        json["asteroid"]["purity"]=100;
        json["asteroid"]["seed"]="01230123";

        json["ore"]={};
        json["ore"]["carbon"]=0;
        json["ore"]["titanium"]=0;

        json["profile"]={};

        json["quest"]={};
        json["quest"]["gain"]=0;

        json["upgrade"]={};
        json["upgrade"]["mineRateLvl"]=0;
        json["upgrade"]["storageLvl"]=0;
        json["upgrade"]["researchLvl"]=0;
        json["upgrade"]["timerStock"]=0;
        json["upgrade"]["timerRate"]=0;
        json["upgrade"]["score"]=0;

        json["search"]={};
        json["search"]["result"]=0;
        json["search"]["timer"]=0;
        json["search"]["start"]=0;

        json["credit"]=0;

        for (let i = 0; i < usersId.length; i++) {
            json["profile"]["email"]=allUsers[usersId[i]].profile.email;
            json["profile"]["name"]=allUsers[usersId[i]].profile.name;
            defaultDatabase.ref("users/"+usersId[i]).set(json);
        }

    });
}