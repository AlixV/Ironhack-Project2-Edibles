function shuffleCards(arr) {
  // console.log('--- shuffleCards');
  // ensuring a deck of cards exists
  if (!arr) return;

  // getting a new independent copy of the deck of cards
  let currentDeck = [...arr];
  // initializing the future shuffled deck of cards
  const shuffledDeck = [];

  // looping through the copy deck of cards
  while (currentDeck.length > 0) {
    // getting a random index depending on the size of the currentDeck
    const randomIdx = Math.floor(Math.random() * currentDeck.length);
    // pushing the item to the shuffledDeck array
    shuffledDeck.push(currentDeck[randomIdx]);
    // splicing this item from the currentDeck --> length decreases
    currentDeck.splice(randomIdx, 1);
  }

  // updating this.cards with the shuffledDeck
  const shuffled = [...shuffledDeck];
  return shuffled;
}

function getRandomPickArray(finalLength, inputArr) {
  console.log(`---- getRandomPickArray: inputArr.length`, inputArr.length);
  // getting a new independent copy of the deck of cards
  let currentArr = [...inputArr];
  // initializing the future shuffled Arr of cards
  const newArr = [];

  // looping through the copy Arr of cards
  while (newArr.length < finalLength) {
    // getting a random index depending on the size of the currentArr
    const randomIdx = Math.floor(Math.random() * currentArr.length);
    // pushing the item to the newArr array
    newArr.push(currentArr[randomIdx]);
    // splicing this item from the currentArr --> length decreases
    currentArr.splice(randomIdx, 1);
  }

  // return the expected array
  console.log(`newArr`, newArr);
  return newArr;
}

// returns array of objects : [ {plantId, isChoiceOk: false} ]
module.exports = function getShuffledCardsArray(distribution, arrE, arrT, arrL) {
    // console.log('--- getShuffledCardsArray');
    // getting right distribution for each input array
    let finalArrE = getRandomPickArray(distribution.edible, arrE);
    console.log(`---- getShuffledCardsArray: finalArrE.length`, finalArrE.length);
    let finalArrT = getRandomPickArray(distribution.toxic, arrT);
    console.log(`---- getShuffledCardsArray: finalArrT.length`, finalArrT.length);
    let finalArrL = getRandomPickArray(distribution.lethal, arrL);
    console.log(`---- getShuffledCardsArray: finalArrL.length`, finalArrL.length);

    // getting a new independent copy of the deck of cards
    let currentDeck = finalArrE.concat(finalArrT, finalArrL);
    // initializing the future shuffled deck of cards
    const shuffledDeck = shuffleCards(currentDeck);

    // updating this.cards with the shuffledDeck
    return shuffledDeck;
}