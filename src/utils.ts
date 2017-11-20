
// tri a json 
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