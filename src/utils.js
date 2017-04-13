const weakToJSON = obj => {
    return JSON.parse(JSON.stringify(obj));
};

export {
    weakToJSON // eslint-disable-line import/prefer-default-export
};
