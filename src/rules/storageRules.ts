import { toFixed2 } from '../utils';

/****************************************************************************************************
 * 
 *                                          Storage
 * 
 ****************************************************************************************************/

export function storageOreNeedFromLvl(iLvl: number) {
    if (iLvl <= 10) {
        return ['carbon'];
    } else if (iLvl <= 30) {
        return ['carbon', 'iron'];
    } else if (iLvl <= 50) {
        return ['carbon', 'iron', 'titanium'];
    } else if (iLvl <= 90) {
        return ['carbon', 'iron', 'titanium', 'gold'];
    } else {
        return ['carbon', 'iron', 'titanium', 'gold'];
    }
}

/**
 * 
 * Cost in credit depending on the lvl = x (trunc to the thousand)
 * f(x)=(3000 * x^1.7) 
 */
export function getStorageCreditCost(lvl: number): number {
    return Math.floor(3000 * Math.pow(lvl, 1.07) / 1000) * 1000;
}

/**
 * 
 * Capacity depending on the lvl = x (trunc to the thousand)
 * f(x)=(3000 * x^1.7) 
 */
export function getCapacity(lvl: number): number {
    return Math.floor(5000 * Math.pow(lvl + 1, 1.5) / 1000) * 1000
}

/**
 * 
 * Time to complete the upgrade depending on lvl = x
 * f(x) = (x * (x + 1) / 10)) + 10
 */
export function getStorageUpgradeTime(lvl: number): number {
    return toFixed2((lvl * (lvl + 1) / 10) + 10);
}







