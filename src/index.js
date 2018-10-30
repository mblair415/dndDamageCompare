import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

const attacker = {
  toHit : 5,
  advantage : false,
  disadvantage : false,
  hitPercentage : undefined,
  critPercentage : 5,
  halfling  : false, // not accounted for. damage per swing changes.
  halfOrc : true,
  luckyFeat : false, // not accounted for. damage per swing changes.
  damage : [{
    diceNum : 2,
    dieSize : 6,
    modifier : 3,
    damageType : 'mundane',
    sharpshooter : false, // not accounted for. hit and crit changes.
    greatWeapon : false // not accounted for.  hit and crit changes.
  }, {
    diceNum : 1,
    dieSize : 8,
    modifier : 3,
    damageType : 'radiant',
    sharpshooter : false, // not accounted for. hit and crit changes.
    greatWeapon : false // not accounted for.  hit and crit changes.
  }]
};

const defender = {
  ac : 14,
  save : undefined, // not accounted for.  damage per swing changes
  saveStat : {
    advantage : false, // not accounted for.  hit and crit changes.
    disadvantage : false // not accounted for.  hit and crit changes.
    // strSave : 4
  },
  resistances : new Set(),
  vulnerabilities : new Set(),
  immunities : new Set(),
};

const advantageDieRoll = {
  /*
Values taken from online.  Value represents cumulitive statistical        chance of rolling the key with advantage.
  */
  1 : 100, 2 : 99.8, 3 : 99, 4 : 97.8, 5 : 96,
  6 : 93.8, 7 : 91, 8 : 87.7, 9 : 84, 10 : 79.8,
  11 : 75.1, 12 : 69.8, 13 : 63.9, 14 : 57.6, 15 : 51,
  16 : 43.7, 17 : 35.9, 18 : 27.8, 19 : 19.1, 20 : 9.8
};

const disadvantageDieRoll = {
  /*
Values taken from online.  Value represents cumulitive statistical        chance of rolling the key with disadvantage.
  */
  1 : 100, 2 : 90.3, 3 : 81.1, 4 : 72.3, 5 : 64,
  6 : 56.4, 7 : 49.2, 8 : 42.4, 9 : 36.1, 10 : 30.3,
  11 : 24.9, 12 : 20.2, 13 : 16, 14 : 12.3, 15 : 8.9,
  16 : 6.2, 17 : 3.9, 18 : 2.2, 19 : 1, 20 : .2
};

function halfOrcCrit(attacker, defender) {
  /*
If target is immune to damage type of all attacks this returns 0.
Loops through attacks, if target not immune to current attack's
  damage type then it will check to see if it should add damage
Adding damage will take resistance and vulnerabilities into account.
Vulnerable to 1D4 is better than resistant to 1D6
  */
  let total = 0;

  attacker.damage.forEach( atk => {
    if (!defender.immunities.has(atk.damageType)) {
      if (defender.resistances.has(atk.damageType)) {
        total = Math.max(total, ((atk.dieSize + 1) / 2) / 2);
      } else if (defender.vulnerabilities.has(atk.damageType)) {
        total = Math.max(total, ((atk.dieSize + 1) / 2) * 2);
      } else {
        total = Math.max(total, (atk.dieSize + 1) / 2);
      }
    }
  });
  return total;
}

// console.log(halfOrcCrit(attacker, defender))

function attackDamage(attacker, defender, hitOrCrit) {
  /*
Same function will spit out damage for a regular hit or a crit.
halfOrc only triggered on a critical hit.
Returns object with a key for totalHit damage and a key for an
  array of all of the damage types that were used in the attack.
  This array isn't currently used for anything but reference.
Basic damage math:
Average roll on a die is the number of sides plus 1.  Then divide by two.

number of dice * ((number of sides on that die + 1) / 2) + modifier
  */
  let resistance;
  let vulnerable;
  let immune;
  let rawDamage;
  const hit = hitOrCrit === 'hit';
  const crit = hitOrCrit === 'crit';
  const hitSummary = {
    hitTotal : 0,
    damageTypes : []
  };

  attacker.damage.forEach( atk => {
    resistance = defender.resistances.has(atk.damageType);
    vulnerable = defender.vulnerabilities.has(atk.damageType);
    immune = defender.immunities.has(atk.damageType);
    rawDamage = atk.diceNum * (hit ? 1 : 2) * ((atk.dieSize + 1)/2) + atk.modifier;

    if (resistance) {
      hitSummary.hitTotal += rawDamage / 2;
    } else if (vulnerable) {
      hitSummary.hitTotal += rawDamage * 2;
    } else if (immune){
      hitSummary.hitTotal += 0;
    } else {
      hitSummary.hitTotal += rawDamage;
    }
    hitSummary.damageTypes.push(atk.damageType);
  });

  if (attacker.halfOrc && crit) {
    hitSummary.hitTotal += halfOrcCrit(attacker, defender);
  }

  return hitSummary;
}

function accuracy(attacker, defender) {
  /*
Sets the accuracy for the character based on the target.
Also adjusts the crit percentage if advantage or disadvantage

Basic math is:
(21 - (defender armor class - attacker toHit modifer)) * 5
5% chance of rolling each side on the die.
21 - 20 = 1
1 * 5 = 5
5% chance of rolling a 20
advantageDieRoll and disadvantageDieRoll taken from a statistical site online.
  */
  if (attacker.advantage) {
    attacker.critPercentage = advantageDieRoll[21 - attacker.critPercentage / 5];
    attacker.hitPercentage = advantageDieRoll[defender.ac - attacker.toHit] - attacker.critPercentage;
  } else if (attacker.disadvantage) {
    attacker.critPercentage = disadvantageDieRoll[21 - attacker.critPercentage / 5];
    attacker.hitPercentage = disadvantageDieRoll[defender.ac - attacker.toHit] - attacker.critPercentage;
  } else {
    attacker.hitPercentage = (21 - (defender.ac - attacker.toHit)) * 5 - attacker.critPercentage;
  }

  attacker.hitPercentage = Math.max(attacker.hitPercentage, 0);
}

function damagePerSwing(attacker, defender) {
  /*
Averages determined by looking at 100 swings.

Average number of hits in 100 swings * average damage per hit
Average number of crits in 100 swings * average damage per crit

Sum the above numbers then divide by 100 to get damage per swing
  which represents misses, hits and critical hits
  */
  accuracy(attacker, defender);
  const hitTotal = attackDamage(attacker, defender, 'hit').hitTotal * attacker.hitPercentage;
  const critTotal = attackDamage(attacker, defender, 'crit').hitTotal * attacker.critPercentage;

  return (hitTotal + critTotal) / 100;
}



console.log(damagePerSwing(attacker, defender));

// console.log(attackDamage(attacker, defender, 'crit'));
