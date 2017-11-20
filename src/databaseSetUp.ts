import { defaultDatabase } from "./environment";
import { toFixed2 } from "./utils";

export function generateMineRateUpgrade( range: number) {
    let json = [];
    for (let i = 0; i < range; i++) {
        const rate = toFixed2(Math.round(Math.pow(i+1, 1.05) * 10) / 10);
        json[i] = {
            baseRate: rate,
            cost: Math.floor(20000/1000 *Math.pow(i , 1.04))*1000,
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
            cost: Math.floor(30000/1000 *Math.pow(i , 1.07))*1000
        }
    }

    defaultDatabase.ref("storage/").set(json);
}