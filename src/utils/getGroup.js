function getGroup(num) {
    if (num < 1 || num > 100) {
        throw new Error("Number must be between 1 and 100");
    }

    return Math.ceil(num / 20);
}

module.exports = getGroup;