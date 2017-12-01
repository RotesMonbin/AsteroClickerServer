
// sort a json 
export const sort_by = function (field, reverse, primer) {
    var key = function (x) { return primer ? primer(x[field]) : x[field] };

    return function (b, a) {
        var A = key(a), B = key(b);
        return ((A < B) ? -1 : (A > B) ? +1 : 0) * [-1, 1][+!!reverse];
    }
}

export function toFixed2(number) {
    return parseFloat(number.toFixed(2));
}


export function getOreAmountFromString(oreName: string, currentUser) {
    switch (oreName) {
        case 'carbon':
            return currentUser.ore.carbon;
        case 'titanium':
             return currentUser.ore.titanium;
        case 'fer':
            return currentUser.ore.fer;
        default:
            console.log('unknown material (user)' + oreName);
            break;
    }
}