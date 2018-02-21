import { toFixed2 } from '../utils';
import { researchUpgrade } from '../resources';

/****************************************************************************************************
 * 
 *                                          Research
 * 
 ****************************************************************************************************/

export function researchOreNeedFromLvl(iLvl: number) {
    if (iLvl <= 10) {
        return ['credit'];
    } else if (iLvl <= 30) {
        return ['credit', 'iron'];
    } else if (iLvl <= 50) {
        return ['credit', 'iron', 'titanium'];
    } else if (iLvl <= 90) {
        return ['credit', 'iron', 'titanium', 'gold'];
    } else {
        return ['credit', 'iron', 'titanium', 'gold'];
    }
}

/**
 * 
 * Cost in credit depending on the lvl = x (trunc to thousand)
 * f(x)= 5000 * x^1.09
 */
export function getResearchCreditCost(lvl: number): number {
    return Math.floor(5000 / 1000 * Math.pow(lvl, 1.09)) * 1000;
}


/**
 * 
 * Research base duration depending on previous base duration=u(i-1) 
 * u(i) = u(i-1) * 0.92
 * u(0) = 120
 */
export const lvl0ResearchTime = 120;
export function getResearchBaseTime(previousTime): number {
    return toFixed2(previousTime * 0.92);
}

/**
 * 
 * Minimum distance is constant
 */
 export const researchMinDistance=100;

/**
 * 
 * Maximum distance depending on lvl=x
 * f(x)= 10000 + (1000 * i)
 */
export function getResearchMaxDistance(lvl: number): number {
    return 10000 + (1000 * lvl);
}

/**
 * 
 * Time to complete the upgrade depending on lvl = x
 * f(x) = (x * (x + 1) / 10)) + 10
 */
export function getResearchUpgradeTime(lvl: number): number {
    return toFixed2((lvl * (lvl + 1) / 10) + 10);
}

/**
 * 
 * Time to complete the research depending on 
 * chosen distance = d
 * minimum distance = minD (depending on the lvl = x)
 * maximum distance = maxD (depending on the lvl = x)
 * reserach base time = rtime (depending on the lvl = x)
 * f(x) = rtime(x) * ((((d - minD(x)) / (maxD(x) - minD(x))) * 5) + 1) * 1000 
 */
export function getResearchTotalTime(lvl : number, distance : number): number {
    const maxDist = researchUpgrade[lvl].maxDist;
    const minDist = researchUpgrade[lvl].minDist;
    const baseTime = researchUpgrade[lvl].searchTime
    const coefDist = (((distance - minDist) / (maxDist - minDist)) * 5) + 1;

    return baseTime * coefDist * 1000;
}