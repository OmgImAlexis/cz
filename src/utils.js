const flattenObject = ob => {
    const toReturn = {};
    let flatObject;
    for (const i in ob) {
        if (!{}.hasOwnProperty.call(ob, i)) {
            continue;
        }
        // Exclude arrays from the final result
        // Check this http://stackoverflow.com/questions/4775722/check-if-object-is-array
        if (ob[i] && Array === ob[i].constructor) {
            continue;
        }
        if ((typeof ob[i]) === 'object') {
            flatObject = flattenObject(ob[i]);
            for (const x in flatObject) {
                if (!{}.hasOwnProperty.call(flatObject, x)) {
                    continue;
                }
                // Exclude arrays from the final result
                if (flatObject[x] && Array === flatObject.constructor) {
                    continue;
                }
                toReturn[i + (isNaN(x) ? ':' + x : '')] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
};

const weakToJSON = obj => {
    return JSON.parse(JSON.stringify(obj));
};

export {
    flattenObject,
    weakToJSON
};
