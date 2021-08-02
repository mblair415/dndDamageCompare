console.log('index.js running');

/*
  Sharpshooter and great weapon master do the following:
    Automatically adjust accuracy for the -5 to hit
    Include the damage as a damage modifier to the first portion of the attack for damage type
  hitPercentage will be set by the accuracy function based on the target, and takes critPercentage into account.
  accuracy function will adjust the critPercentage based on any accuracy modifier (ie: advantage, halfling ....).
*/
const attacker = {
  toHit : 7,
  advantage : false,
  disadvantage : false,
  hitPercentage : undefined,
  critPercentage : 5,
  race : {
    halfling : false,
    halfOrc : false
  },
  feat : {
    elvenAccuracy : true,
    greatWeapon : false,
    lucky : false,
    savageAttacker : false,
    sharpshooter : false,
  },
  fightingStyle : {
    gwFightStyle : false
  },
  damage : [{
    diceNum : 2,
    dieSize : 8,
    modifier : 4,
    damageType : 'slashing'
  }]
};

/*
  A later update will cover spell feats, class abilities, saves, and advantage/disadvantage on spell saving throws
*/
const defender = {
  ac : 15,
  // save : undefined, // not accounted for.  damage per swing changes
  // saveStat : {
  //   advantage : false, // not accounted for.  hit and crit changes.
  //   disadvantage : false, // not accounted for.  hit and crit changes.
  //   strSave : 4
  // },
  resistances : new Set(),
  vulnerabilities : new Set(),
  immunities : new Set()
};

/*
  these were determined by running a simulation with 450k - 800k die rolls to determine percentages
  in the case of lucky the assumption is burning max possible lucky charges to get the best possible single attack roll.
*/
const advantageDieRoll = {
  1 : 100, 2 : 99.8, 3 : 99, 4 : 97.8, 5 : 96,
  6 : 93.8, 7 : 91, 8 : 87.7, 9 : 84, 10 : 79.8,
  11 : 75.1, 12 : 69.8, 13 : 63.9, 14 : 57.6, 15 : 51,
  16 : 43.7, 17 : 35.9, 18 : 27.8, 19 : 19.1, 20 : 9.8
};

const disadvantageDieRoll = {
  1: 100, 2: 90.3, 3: 81, 4: 72.2,5: 63.8,
  6: 56.1, 7: 48.9, 8: 42.1, 9: 35.9, 10: 30.2,
  11: 24.9, 12: 20.2, 13: 16, 14: 12.2, 15: 9,
  16: 6.2, 17: 4, 18: 2.3, 19: 1, 20: 0.3
};

const halflingDieRoll = {
  1: 100, 2: 99.8, 3: 94.5, 4: 89.2, 5: 83.9,
  6: 78.7, 7: 73.5, 8: 68.2, 9: 63, 10: 57.7,
  11: 52.4, 12: 47.2, 13: 42, 14: 36.7, 15: 31.5,
  16: 26.3, 17: 21.1, 18: 15.8, 19: 10.5, 20: 5.3
};

const luckyDieRoll = {
  1: 100, 2: 99.8, 3: 99, 4: 97.8, 5: 96,
  6: 93.8, 7: 91, 8: 87.7, 9: 81, 10: 74.3,
  11: 67.5, 12: 60.7, 13: 54, 14: 47.3, 15: 40.6,
  16: 33.8, 17: 27.1, 18: 20.3, 19: 13.5, 20: 6.8
};

const advantageLuckyHalflingDieRoll = {
  1: 100, 2: 100, 3: 99.4,  4: 98.4, 5: 96.8,
  6: 94.7, 7: 92.1, 8: 88.9, 9: 86.3, 10: 83.1,
  11: 79.1, 12: 74.5, 13: 69, 14: 62.9, 15: 56.1,
  16: 48.6, 17: 40.3, 18: 31.3, 19: 21.6, 20: 11.1
};

const elvenAccuracyDieRoll = {
  1: 100, 2: 100, 3: 99.9, 4: 99.7, 5: 99.2,
  6: 98.4, 7: 97.3, 8: 95.7, 9: 93.6, 10: 90.9,
  11: 87.5, 12: 83.4, 13: 78.4, 14: 72.5, 15: 65.7,
  16: 57.9, 17: 48.8, 18: 38.6, 19: 27.1, 20: 14.3
}

const advantageHalflingDieRoll = {
  1: 100, 2: 100, 3: 99.7, 4: 98.8, 5: 97.5,
  6: 95.5, 7: 93, 8: 90, 9: 86.4, 10: 82.2,
  11: 77.5, 12: 72.2, 13: 66.4, 14: 60, 15: 53.1,
  16: 45.7, 17: 37.6, 18: 29, 19: 19.9, 20: 10.2
};

const advantageLuckyDieRoll = {
  1: 100, 2: 99.8, 3: 99, 4: 97.8, 5: 96,
  6: 93.8, 7: 91, 8: 87.8, 9: 85.1, 10: 81.7,
  11: 77.7, 12: 72.9, 13: 67.5, 14: 61.5, 15: 54.6,
  16: 47.2, 17: 39.1, 18: 30.3, 19: 21, 20: 10.8
};

const luckyHalflingDieRoll = {
  1: 100, 2: 100, 3: 99.5, 4: 98.4, 5: 96.8,
  6: 94.7, 7: 92, 8: 88.8, 9: 82, 10: 75.2,
  11: 68.3, 12: 61.5, 13: 54.6, 14: 47.8, 15: 41,
  16: 34.2, 17: 27.3, 18: 20.4, 19: 13.6, 20: 6.8
};

const disadvantageLuckyHalflingDieRoll = {
  1: 100, 2: 100, 3: 99.4, 4: 97.8, 5: 95.3,
  6: 92, 7: 87.8, 8: 83.1, 9: 77.7, 10: 71.8,
  11: 65.5, 12: 59, 13: 52.2, 14: 45.3, 15: 38.3,
  16: 31.3, 17: 24.5, 18: 17.8, 19: 11.5, 20: 5.5
};

const disadvantageLuckyDieRoll = {
  1: 100, 2: 99.5, 3: 98.1, 4: 95.8, 5: 92.8,
  6: 89.1, 7: 84.7, 8: 79.9, 9: 74.5, 10: 68.7,
  11: 62.6, 12: 56.2, 13: 49.7, 14: 43, 15: 36.4,
  16: 29.8, 17: 23.3, 18: 17, 19: 10.9, 20: 5.3
};

const disadvantageHalflingDieRoll = {
  1: 100, 2: 99.5, 3: 89.3, 4: 79.7, 5: 70.6,
  6: 62, 7: 54, 8: 46.5, 9: 39.7, 10: 33.3,
  11: 27.5, 12: 22.3, 13: 17.6, 14: 13.5, 15: 9.9,
  16: 6.9, 17: 4.4, 18: 2.5, 19: 1.1, 20: 0.3
};


/*
  This was determined with 900,000 die rolls through savageAttackerFeat.js
  Should include each thing that modifies damage die results (ie: reroll one one or two, advantage on damage thorugh savage)
*/
const averageDieDamage = {
  unmodified : {
    4 : 2.5,
    6 : 3.5,
    8 : 4.5,
    10 : 5.5,
    12 : 6.5 
  },
  gwFeat : {
    4 : 3,
    6 : 4.16,
    8 : 5.24,
    10 : 6.3,
    12 : 7.33
  },
  savageAttackerFeat : {
    4 : 3.12,
    6 : 4.47,
    8 : 5.81,
    10 : 7.15,
    12 : 8.49,
  },
  gwAndSavageAttacker : {
    4 : 3.53,
    6 : 4.96,
    8 : 6.34,
    10 : 7.7,
    12 : 9.05
  }
};

const determineAverageDamPerDie = (attacker, dieSize) => {
  if (attacker.feat.savageAttacker && attacker.fightingStyle.gwFightStyle) {
    return averageDieDamage.gwAndSavageAttacker[dieSize];
  } else if (attacker.feat.savageAttacker) {
    return averageDieDamage.savageAttackerFeat[dieSize];
  } else if (attacker.fightingStyle.gwFightStyle) {
    return averageDieDamage.gwFeat[dieSize];
  } else {
    return averageDieDamage.unmodified[dieSize];
  }
};

/*
  If target is immune to damage type of all attacks this returns 0.
  Loops through damage soures to check to see which combination of a single die size and damage type is highest.
  Adding damage will take resistance and vulnerabilities into account.
  Ensures great weapon fighting style and/or savage attacker feat is taken into account on a rolled damage die.
*/
const halfOrcCrit = (attacker, defender) => {
  let highestOption = 0,
    avgDie;

  attacker.damage.forEach( atk => {
    if (!defender.immunities.has(atk.damageType)) {
      avgDie = determineAverageDamPerDie(attacker, atk.dieSize);

      if (defender.resistances.has(atk.damageType)) {
        highestOption = Math.max(highestOption, avgDie / 2);
      } else if (defender.vulnerabilities.has(atk.damageType)) {
        highestOption = Math.max(higestOption, avgDie * 2);
      } else {
        highestOption = Math.max(highestOption, avgDie);
      }
    }
  });

  return highestOption;
}

/*
  Same function will spit out damage for a regular hit or a crit.
  halfOrc only triggered on a critical hit and when the halfOrc flag is true.
  If sharpshooterFeat or greatWeaponFeat are true it applies the damage as a modifer to the first "damage".
  Takes immunity, vulnerability, and resistance into account on each damage type.
  Basic damage math:
    Average roll on a die is the number of sides plus 1.  Then divide by two.
    
    number of dice * average result on the die rolled + modifier
*/
const attackDamage = (attacker, defender, hitOrCrit) => {
  let swingTotal = 0,
    avgDie,
    rawDamage;
  const hit = hitOrCrit === 'hit',
    crit = hitOrCrit === 'crit';

  if (hit && (attacker.feat.greatWeapon || attacker.feat.sharpshooter)) {
    attacker.damage[0].modifier += 10;
  }

  attacker.damage.forEach( atk => {

    if (!defender.immunities.has(atk.damageType)) {
      avgDie = determineAverageDamPerDie(attacker, atk.dieSize);
      rawDamage = atk.diceNum * avgDie * (hit ? 1 : 2) + atk.modifier;

      if (defender.resistances.has(atk.damageType)) {
        swingTotal += rawDamage / 2;
      } else if (defender.vulnerabilities.has(atk.damageType)) {
        swingTotal += rawDamage * 2;
      } else {
        swingTotal += rawDamage;
      }
    }
  });

  if (attacker.race.halfOrc && crit) {
    swingTotal += halfOrcCrit(attacker, defender);
  }

  return swingTotal;
}

/*
  Sets the accuracy for the character based on the target.
  Handles the -5 to hit from great weapon feat or sharpshooter feat.
  Also adjusts the crit percentage if advantage or disadvantage

  Basic math is:
  (21 - (defender armor class - attacker toHit modifer)) * 5
  5% chance of rolling each side on the die.
  More complex accuracy determined by a simulator
*/
const accuracy = (attacker, defender) => {
  if (attacker.feat.sharpshooter || attacker.feat.greatWeapon) {
    attacker.toHit -= 5;
  }

  if (attacker.advantage && attacker.race.halfling && attacker.feat.lucky) {
    attacker.critPercentage = advantageLuckyHalflingDieRoll[21 - attacker.critPercentage / 5];
    attacker.hitPercentage = advantageLuckyHalflingDieRoll[defender.ac - attacker.toHit] - attacker.critPercentage;
  } else if (attacker.disadvantage && attacker.race.halfling && attacker.feat.lucky) {
    attacker.critPercentage = disadvantageLuckyHalflingDieRoll[21 - attacker.critPercentage / 5];
    attacker.hitPercentage = disadvantageLuckyHalflingDieRoll[defender.ac - attacker.toHit] - attacker.critPercentage;
  } else if (attacker.advantage && attacker.race.halfling) {
    attacker.critPercentage = advantageHalflingDieRoll[21 - attacker.critPercentage / 5];
    attacker.hitPercentage = advantageHalflingDieRoll[defender.ac - attacker.toHit] - attacker.critPercentage;
  } else if (attacker.disadvantage && attacker.race.halfling) {
    attacker.critPercentage = disadvantageHalflingDieRoll[21 - attacker.critPercentage / 5];
    attacker.hitPercentage = disadvantageHalflingDieRoll[defender.ac - attacker.toHit] - attacker.critPercentage;
  } else if (attacker.advantage && attacker.feat.lucky) {
    attacker.critPercentage = advantageLuckyDieRoll[21 - attacker.critPercentage / 5];
    attacker.hitPercentage = advantageLuckyDieRoll[defender.ac - attacker.toHit] - attacker.critPercentage;
  } else if (attacker.disadvantage && attacker.feat.lucky) {
    attacker.critPercentage = disadvantageLuckyDieRoll[21 - attacker.critPercentage / 5];
    attacker.hitPercentage = disadvantageLuckyDieRoll[defender.ac - attacker.toHit] - attacker.critPercentage;
  } else if (attacker.race.halfling && attacker.feat.lucky) {
    attacker.critPercentage = luckyHalflingDieRoll[21 - attacker.critPercentage / 5];
    attacker.hitPercentage = luckyHalflingDieRoll[defender.ac - attacker.toHit] - attacker.critPercentage;
  } else if (attacker.feat.elvenAccuracy) { 
    attacker.critPercentage = elvenAccuracyDieRoll[21 - attacker.critPercentage / 5];
    attacker.hitPercentage = elvenAccuracyDieRoll[defender.ac - attacker.toHit] - attacker.critPercentage;
  } else if (attacker.advantage) {
    attacker.critPercentage = advantageDieRoll[21 - attacker.critPercentage / 5];
    attacker.hitPercentage = advantageDieRoll[defender.ac - attacker.toHit] - attacker.critPercentage;
  } else if (attacker.disadvantage) {
    attacker.critPercentage = disadvantageDieRoll[21 - attacker.critPercentage / 5];
    attacker.hitPercentage = disadvantageDieRoll[defender.ac - attacker.toHit] - attacker.critPercentage;
  } else if (attacker.feat.lucky) {
    attacker.critPercentage = luckyDieRoll[21 - attacker.critPercentage / 5];
    attacker.hitPercentage = luckyDieRoll[defender.ac - attacker.toHit] - attacker.critPercentage;
  } else if (attacker.race.halfling) {
    attacker.critPercentage = halflingDieRoll[21 - attacker.critPercentage / 5];
    attacker.hitPercentage = halflingDieRoll[defender.ac - attacker.toHit] - attacker.critPercentage;
  } else {
    attacker.hitPercentage = (21 - (defender.ac - attacker.toHit)) * 5 - attacker.critPercentage;
  }

  attacker.hitPercentage = Math.max(attacker.hitPercentage, 0);
}

/*
  Averages determined by looking at 100 swings.

  Average number of hits in 100 swings * average damage per hit
  Average number of crits in 100 swings * average damage per crit

  Sum the above numbers then divide by 100 to get damage per swing
    which represents misses, hits and critical hits
*/
const damagePerSwing = (attacker, defender) => {
  accuracy(attacker, defender);

  const hitTotal = attackDamage(attacker, defender, 'hit') * attacker.hitPercentage;
  const critTotal = attackDamage(attacker, defender, 'crit') * attacker.critPercentage;

  return (hitTotal + critTotal) / 100;
}


console.log(`Damage per swing ${damagePerSwing(attacker, defender)}`);


module.exports.attacker
