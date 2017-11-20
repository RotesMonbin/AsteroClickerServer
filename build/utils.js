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
//# sourceMappingURL=utils.js.map