import { toFixed2 } from '../utils';



/****************************************************************************************************
 * 
 *                                          Mining Rate
 * 
 ****************************************************************************************************/

/**
 * return which ore is necessary to upgrade minerate for this lvl
 */
export function getMineRateOreCost(lvl: number) {
    if (lvl <= 10) {
        return ['credit', 'carbon'];
    } else if (lvl <= 30) {
        return ['credit', 'carbon', 'iron'];
    } else if (lvl <= 50) {
        return ['credit', 'carbon', 'iron', 'titanium'];
    } else if (lvl <= 90) {
        return ['credit', 'carbon', 'iron', 'titanium', 'hyperium'];
    } else {
        return ['credit', 'carbon', 'iron', 'titanium', 'hyperium'];
    }
}

export const lvl0MineRate = {
    baseRate: 1,
    maxRate: 1.5,
    frenzyTime: 10,
    time: 10,
    cost: { // 100 * 5 + 500 = 1000 credit
        carbon: 100,
        credit: 500
    }
}

/**
 * 
 * Cost in credit depending on the lvl = x (trunc to thousand)
 * f(x)=(500 * x^1.7) + 1500
 */
export function getMineRateCreditCost(lvl: number): number {
    return Math.floor(((500 * Math.pow(lvl, 1.7)) + 1500) / 1000) * 1000;
}

/**
 * 
 * BaseRate depending on previous baseRate = u(i-1) and lvl = i
 * u(i)= u(i - 1) + +(0.2 * (floor((i - 1) / 10)) + 1)
 * u(0)= 1
 */
export function getMineRateBaseRate(lvl: number, previousBaseRate: number): number {
    return toFixed2(previousBaseRate + (0.2 * (Math.floor((lvl - 1) / 10) + 1)));
}

/**
 * 
 * MaxRate depending on baseRate = x (rounded to first decimal)
 * f(x) = x * 1.5
 */
export function getMineRateMaxRate(baseRate: number): number {
    return toFixed2(Math.round(baseRate * 1.5 * 10) / 10);
}

/**
 * 
 * Frenzy duration in second depending on lvl = x
 * f(x) = 10 + ((x * 10) /200)
 */
export function getFrenzyDuration(lvl: number): number {
    return toFixed2(10 + ((lvl * 10) / 200));
}

/**
 * 
 * Time to complete the upgrade depending on lvl = x
 * f(x) = (x * (x + 1) / 10)) + 10
 */
export function getMineRateUpgradeTime(lvl: number): number {
    return toFixed2((lvl * (lvl + 1) / 10) + 10)
}

