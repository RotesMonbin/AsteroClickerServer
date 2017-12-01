"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sort_by = function (field, reverse, primer) {
    var key = function (x) { return primer ? primer(x[field]) : x[field]; };
    return function (b, a) {
        var A = key(a), B = key(b);
        return ((A < B) ? -1 : (A > B) ? +1 : 0) * [-1, 1][+!!reverse];
    };
};
function toFixed2(number) {
    return parseFloat(number.toFixed(2));
}
exports.toFixed2 = toFixed2;
function getOreAmountFromString(oreName, currentUser) {
    switch (oreName) {
        case 'carbon':
            return currentUser.ore.carbon;
        case 'titanium':
            return currentUser.ore.titanium;
        default:
            console.log('unknown material (user)' + oreName);
            break;
    }
}
exports.getOreAmountFromString = getOreAmountFromString;
//# sourceMappingURL=utils.js.map