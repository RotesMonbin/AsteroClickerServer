import { toFixed2 } from '../utils';

/****************************************************************************************************
 * 
 *                                          HeadQuarter
 * 
 ****************************************************************************************************/

export function QGOreNeedFromLvl(iLvl: number) {
    if (iLvl <= 3) {
        return ['credit', 'carbon', 'iron'];
    } else if (iLvl <= 5) {
        return ['credit', 'carbon', 'iron', 'titanium'];
    } else if (iLvl <= 7) {
        return ['credit', 'carbon', 'iron', 'titanium', 'hyperium'];
    } else if (iLvl <= 10) {
        return ['credit', 'carbon', 'iron', 'titanium', 'hyperium', 'gold'];
    } else {
        return ['credit', 'carbon', 'iron', 'titanium', 'hyperium', 'gold'];
    }
}

 /**
 * 
 * Cost in credit depending on the lvl = x (trunc to thousand)
 * f(x)= 5000 * x^1.09
 */
export function getHQCreditCost(lvl: number): number {
    return Math.floor(5000 / 1000 * Math.pow(lvl, 1.09)) * 1000;
}

 /**
 * 
 * Maximum lvl other upgrade can reach depending on QG lvl=x
 * f(x)= 10 * x
 */
export function getMaxUpgradeLvl(lvl: number): number {
    return 10 * lvl;
}

/**
 * 
 * Time to complete the upgrade depending on lvl = x
 * f(x) = (x * 5 * (x + 1) / 10)) + 10
 */
export function getHQUpgradeTime(lvl: number): number {
    return toFixed2((lvl * 5 * (lvl + 1) / 10) + 10);
}

/**
 * 
 * NOT USED
 * Number of concurrent cargo depending on lvl
 * f(x) = (x * 5 * (x + 1) / 10)) + 10
 */
export function getCargoNumber(lvl: number): number {
    return 1 + Math.round(lvl / 4)
}