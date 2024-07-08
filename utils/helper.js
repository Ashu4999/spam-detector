function getRandomNumberFromRange(min, max) {
    if (min > max) {
        throw new Error('The min value should be less than or equal to the max value');
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = { getRandomNumberFromRange };