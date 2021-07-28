// Percentage of rolling each side of the die with the feat which is essentially like advantage
const d4 = {
        '1': 100, 
        '2': 93.8, 
        '3': 75, 
        '4': 43.8 
    },
    d6 = {
        '1': 100, 
        '2': 97.2, 
        '3': 88.9, 
        '4': 75, 
        '5': 55.6, 
        '6': 30.6 
    },
    d8 = {
        '1': 100,
        '2': 98.5,
        '3': 93.8,
        '4': 86,
        '5': 75,
        '6': 60.9,
        '7': 43.7,
        '8': 23.4
    },
    d10 = {
        '1': 100,
        '2': 99,
        '3': 96,
        '4': 91,
        '5': 84,
        '6': 75.1,
        '7': 64,
        '8': 51.1,
        '9': 36,
        '10': 19
    },
    d12 = {  
        '1': 100,
        '2': 99.3,
        '3': 97.2,
        '4': 93.7,
        '5': 88.9,
        '6': 82.7,
        '7': 75,
        '8': 66,
        '9': 55.6,
        '10': 43.8,
        '11': 30.6,
        '12': 16
    };

// Average die result with each size die with the feat by itself
const savageAttackerFeatAdjusted = {
    4 : 3.13,
    6 : 4.47,
    8 : 5.81,
    10 : 7.16,
    12 : 8.48
};

// Average die result with each die size with the feat and also great weapon fighting style
const savageAttackerFeatGreatWeapAdjusted = {
    4 : 3.53,
    6 : 4.959,
    8 : 6.34,
    10 : 7.698,
    12 : 9.055
};


const dieRoll = size => {
    return Math.floor((size * Math.random()) + 1);
};

const findAverage = (dieAsArray, size) => {
    let sum = 0;

    for (side in dieAsArray) {
        sum += side * dieAsArray[side]
    }

    return sum / 900000;
};

const percentageIncrease = (modifiedDieRoll, size) => {
    const avgDieRoll = { 4:2.5, 6:3.5, 8:4.5, 10:5.5, 12:6.5 };
    const extra = modifiedDieRoll - avgDieRoll[size];

    return extra / avgDieRoll[size];
};

const modifiedResult = (size, die, times) => {
    let sum = 0,
        count = 1,
        first,
        second,
        finalDamageBoost;
    const dieAsArray = new Array(size + 1).fill(0);

    while (count < times + 1) {
        first = dieRoll(size);
        second = dieRoll(size);

        if (first < 3) {
            first = dieRoll(size);
        }
        if (second < 3) {
            second = dieRoll(size);
        }
        dieAsArray[Math.max(first, second)]++;
        count++;
    }
    
    console.log(dieAsArray)
    
    for (let i = size; i > 0; i--) {
        sum += dieAsArray[i];
        die[i] = (Math.round(sum/times * 1000) / 10);
    }

    console.log(findAverage(dieAsArray, size));

    finalDamageBoost = percentageIncrease(findAverage(dieAsArray, size), size);

    console.log({finalDamageBoost});
    return die;
};

console.log(modifiedResult(12, d12, 900000))



