export function getObjValues(obj) {
    return Object.keys(obj).map(function(key) {
        return obj[key];
    });
}
