/*
This file is purely informational.
This is how the accuracy was determined.

Not all of the simulations can be  done at once or it will timeout.
*/

const dieRoll = () => {
  return Math.floor((20 * Math.random()) + 1)
}

const advantageLuckyHalflingD20 = {};
const disadvantageLuckyHalflingD20 = {};
const advantageLuckyD20 = {};
const elvenAccuracyD20 = {};
const advantageHalflingD20 = {};
const disadvantageLuckyD20 = {};
const disadvantageHalflingD20 = {};
const luckyHalflingD20 = {};
const advantageD20 = {};
const disadvantageD20 = {};
const halflingD20 = {};
const luckyD20 = {};
const regularD20 = {};

const regularResult = times => {
  let sum = 0;
  let count = 1;
  let d20AsArray = new Array(21).fill(0);

  while (count < times + 1) {
    d20AsArray[dieRoll()]++;
    count++;
  }

  for (let i = 20; i > 0; i--) {
    sum+= d20AsArray[i];
    regularD20[i] = (Math.round(sum/times * 1000) / 10);
  }
}

const advantageResult = times => {
  let sum = 0;
  let count = 1;
  let d20AsArray = new Array(21).fill(0);

  while (count < times + 1) {
    d20AsArray[Math.max(dieRoll(), dieRoll())]++;
    count++;
  }

  for (let i = 20; i > 0; i--) {
    sum+= d20AsArray[i];
    advantageD20[i] = (Math.round(sum/times * 1000) / 10);
  }
}

const disadvantageResult = times => {
  let sum = 0;
  let count = 1;
  let d20AsArray = new Array(21).fill(0);

  while (count < times + 1) {
    d20AsArray[Math.min(dieRoll(), dieRoll())]++;
    count++;
  }

  for (let i = 20; i > 0; i--) {
    sum+= d20AsArray[i];
    disadvantageD20[i] = (Math.round(sum/times * 1000) / 10);
  }
}

const halflingResult = times => {
  let sum = 0;
  let count = 1;
  let d20AsArray = new Array(21).fill(0);
  let current;

  while (count < times + 1) {
    current = dieRoll()
    current = current == 1 ? dieRoll() : current;
    d20AsArray[current]++;
    count++;
  }

  for (let i = 20; i > 0; i--) {
    sum+= d20AsArray[i];
    halflingD20[i] = (Math.round(sum/times * 1000) / 10);
  }
}

const luckyResult = times => {
  let sum = 0;
  let count = 1;
  let d20AsArray = new Array(21).fill(0);
  let current;

  while (count < times + 1) {
    current = dieRoll();
    if (current < 8) {
      current = Math.max(current, dieRoll());
    }
    d20AsArray[current]++;
    count++;
  }

  for (let i = 20; i > 0; i--) {
    sum+= d20AsArray[i];
    luckyD20[i] = (Math.round(sum/times * 1000) / 10);
  }
}

const advantageLuckyHalflingResult = times => {
  let sum = 0;
  let count = 1;
  let d20AsArray = new Array(21).fill(0);
  let first;
  let second;
  let lucky;

  while (count < times + 1) {
    first = dieRoll();
    first = first == 1 ? dieRoll() : first;
    second = dieRoll();
    second = second == 1 ? dieRoll() : second;

    if (first < 8) {
      lucky = dieRoll();
      lucky == 1 ? dieRoll() : lucky;
      first = Math.max(first, lucky);
    }
    if (second < 8) {
      lucky = dieRoll();
      lucky == 1 ? dieRoll() : lucky;
      first = Math.max(second, lucky);
    }
    d20AsArray[Math.max(first, second)]++;
    count++;
  }

  for (let i = 20; i > 0; i--) {
    sum+= d20AsArray[i];
    advantageLuckyHalflingD20[i] = (Math.round(sum/times * 1000) / 10);
  }
}

const advantageHalflingResult = times => {
  let sum = 0;
  let count = 1;
  let d20AsArray = new Array(21).fill(0);
  let first;
  let second;

  while (count < times + 1) {
    first = dieRoll();
    first = first == 1 ? dieRoll() : first;
    second = dieRoll();
    second = second == 1 ? dieRoll() : second;
    d20AsArray[Math.max(first, second)]++;
    count++;
  }

  for (let i = 20; i > 0; i--) {
    sum+= d20AsArray[i];
    advantageHalflingD20[i] = (Math.round(sum/times * 1000) / 10);
  }
}

const advantageLuckyResult = times => {
  let sum = 0;
  let count = 1;
  let d20AsArray = new Array(21).fill(0);
  let first;
  let second;
  let lucky;

  while (count < times + 1) {
    first = dieRoll();
    second = dieRoll();

    if (first < 8) {
      lucky = dieRoll();
      first = Math.max(first, lucky);
    }
    if (second < 8) {
      lucky = dieRoll();
      first = Math.max(second, lucky);
    }
    d20AsArray[Math.max(first, second)]++;
    count++;
  }

  for (let i = 20; i > 0; i--) {
    sum+= d20AsArray[i];
    advantageLuckyD20[i] = (Math.round(sum/times * 1000) / 10);
  }
}

const elvenAccuracyResult = times => {
  let sum = 0;
  let count = 1;
  let d20AsArray = new Array(21).fill(0);
  let first;
  let second;
  let third;

  while (count < times + 1) {
    first = dieRoll();
    second = dieRoll();
    third = dieRoll();

    d20AsArray[Math.max(first, second, third)]++;
    count++;
  }

  for (let i = 20; i > 0; i--) {
    sum+= d20AsArray[i];
    elvenAccuracyD20[i] = (Math.round(sum/times * 1000) / 10);
    // elvenAccuracyD20[i] = sum/times * 1000 / 10;

  }

}

const luckyHalflingResult = times => {
  let sum = 0;
  let count = 1;
  let d20AsArray = new Array(21).fill(0);
  let current;
  let lucky;

  while (count < times + 1) {
    current = dieRoll();
    current = current == 1 ? dieRoll() : current;

    if (current < 8) {
      lucky = dieRoll();
      lucky == 1 ? dieRoll() : lucky;
      current = Math.max(current, lucky);
    }
    d20AsArray[current]++;
    count++;
  }

  for (let i = 20; i > 0; i--) {
    sum+= d20AsArray[i];
    luckyHalflingD20[i] = (Math.round(sum/times * 1000) / 10);
  }
}

const disadvantageLuckyHalflingResult = times => {
  let sum = 0;
  let count = 1;
  let d20AsArray = new Array(21).fill(0);
  let first;
  let second;
  let lucky;

  while (count < times + 1) {
    first = dieRoll();
    first = first == 1 ? dieRoll() : first;
    second = dieRoll();
    second = second == 1 ? dieRoll() : second;
    lucky = dieRoll();
    lucky = lucky == 1 ? dieRoll() : lucky;

    d20AsArray[Math.max(Math.min(first, second), lucky)]++;
    count++;
  }

  for (let i = 20; i > 0; i--) {
    sum+= d20AsArray[i];
    disadvantageLuckyHalflingD20[i] = (Math.round(sum/times * 1000) / 10);
  }
}

const disadvantageLuckyResult = times => {
  let sum = 0;
  let count = 1;
  let d20AsArray = new Array(21).fill(0);

  while (count < times + 1) {
    d20AsArray[Math.max(Math.min(dieRoll(), dieRoll()), dieRoll())]++;
    count++;
  }

  for (let i = 20; i > 0; i--) {
    sum+= d20AsArray[i];
    disadvantageLuckyD20[i] = (Math.round(sum/times * 1000) / 10);
  }
}

const disadvantageHalflingResult = times => {
  let sum = 0;
  let count = 1;
  let d20AsArray = new Array(21).fill(0);
  let first;
  let second;

  while (count < times + 1) {
    first = dieRoll();
    first = first == 1 ? dieRoll() : first;
    second = dieRoll();
    second = second == 1 ? dieRoll() : second;

    d20AsArray[Math.min(first, second)]++;
    count++;
  }

  for (let i = 20; i > 0; i--) {
    sum+= d20AsArray[i];
    disadvantageHalflingD20[i] = (Math.round(sum/times * 1000) / 10);
  }
}


// ** Cannot do all at once **

// regularResult(800000);
// advantageResult(800000);
elvenAccuracyResult(800000);

// disadvantageResult(800000);
// halflingResult(800000);
// luckyResult(800000);
// advantageLuckyHalflingResult(450000);
// advantageHalflingResult(800000);
// advantageLuckyResult(700000);
// luckyHalflingResult(800000);
// disadvantageLuckyHalflingResult(700000); // d20[2] == 99.9999 which is rounding to 100
// disadvantageLuckyResult(650000);
// disadvantageHalflingResult(800000);




// console.log('regular ', regularD20);
// console.log('advantage ', advantageD20);
// console.log('disadvantage ', disadvantageD20);
// console.log('halfling ', halflingD20);
// console.log('lucky ', luckyD20);
// console.log('advantageLuckyHalfling ', advantageLuckyHalflingD20);
// console.log('advantageHalfling ', advantageHalflingD20);
// console.log('advantageLucky ', advantageLuckyD20)
// console.log('luckyHalfling ', luckyHalflingD20);
// console.log('disadvantageLuckyHalfling ', disadvantageLuckyHalflingD20);
// console.log('disadvantageLucky ', disadvantageLuckyD20);
// console.log('disadvantageHalfling ', disadvantageHalflingD20);
console.log('elvenAccuracy ', elvenAccuracyD20);
