const inputIngredientElement = document.querySelector("#otherIngredients");
const addIngredientBtnElement = document.querySelector("#add-new-ingredient");
const newIngredientsListElement = document.querySelector(
  "#new-ingredients-list"
);

// DOM MANIPULATION

// AJAX

// HANDLE CLICK EVENT
const handleAddIngredient = (e) => {
  console.log("event target is :>> ", e.target);

  // use Ajax to send each new input to the server side to fill the otherIngredients array

  // append the new ingredient to the list and clear the input field
};

addIngredientBtnElement.addEventListener("click", handleAddIngredient);
