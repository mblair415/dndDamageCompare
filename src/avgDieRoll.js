const dice = [4,6,8,10,12];

const percentBonusDamage = (sides, times) => {
  let naturalSum = 0;
  let rerollSum = 0;
  let count = 1;
  let naturalResult;
  let rerollResult;
  let variance;
  const naturalDieAsArray = new Array(sides + 1).fill(0);
  const rerollDieAsArray = new Array(sides + 1).fill(0);

  const randomVal = (sides) => {
    return Math.floor(Math.random() * sides) + 1;
  };
  const reRollOneAndTwo = (sides) => {
    const current = randomVal(sides);
    return current <= 2 ? randomVal(sides) : current;
  };

  while (count <= times) {
    const natural = randomVal(sides);
    const reroll = reRollOneAndTwo(sides);
    naturalDieAsArray[natural]++;
    rerollDieAsArray[reroll]++;
    count++
  }

  for (let i = sides; i > 0; i--) {
    naturalSum += i * naturalDieAsArray[i];
    rerollSum += i * rerollDieAsArray[i];
  }
  naturalResult = naturalSum / times;
  rerollResult = rerollSum / times;
  variance = rerollResult - naturalResult;

  return variance / naturalResult;
};

dice.forEach( die => {
  console.log(`D${die} bonus percentage is `, percentBonusDamage(die, 90000000) * 100);
})

// console.log(percentBonusDamage(6, 90000000));
