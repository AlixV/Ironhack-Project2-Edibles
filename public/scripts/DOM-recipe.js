const inputIngredientElement = document.querySelector("#otherIngredients");
const addIngredientBtnElement = document.querySelector("#add-new-ingredient");
const newIngredientsListElement = document.querySelector(
  "#new-ingredients-list"
);
const submitBtnElement = document.querySelector("#submit-create-form");
const nameInput = document.querySelector("#name");
const prepTimeInput = document.querySelector("#prepTime");
const plantInput = document.querySelector("#plant");
const instructionsInput = document.querySelector("#instructions");
const imageFile = document.querySelector("#image");
const otherIngredientsInput = [];

// DOM MANIPULATION
function addIngredientToDom(input) {
  const liElement = document.createElement("li");
  liElement.className = "other-ingredients";
  liElement.innerHTML = `
  <li>${input}</li>
  `;
  newIngredientsListElement.appendChild(liElement);
  inputIngredientElement.value = "";

  // add possibility to edit/delet the inputs ?
}

// AJAX
// const updateOtherIngredients = (payload) => axios.post("/addRecipe", payload);
const headers = {
  "Content-Type": "application/json",
  Authorization: "JWT fefege...",
};

function uploadData() {
  const data = new FormData();
  data.append("image", imageFile.files[0]);
  data.append("name", "nameInput");
  data.append("durationMinutes", "prepTimeInput");
  data.append("plant", "plantInput");
  data.append("instructions", "instructionsInput");
  data.append("otherIngredients", "otherIngredientsInput");

  console.log(data);
  axios
    .post("/addRecipe", data, {
      headers: headers,
    })
    .then((response) => {
      alert(JSON.stringify(response));
    })
    .catch(function (error) {
      console.log(error);
    });
}

// HANDLE CLICK EVENT
const handleSubmit = (e) => {
  e.preventDefault();
  // recupère toutes les inputs value
  console.log(otherIngredients);
  uploadData();
};

// récupérer tous les input fields
// handleSubmit => créer un objet dont les keys correspond au modèle
// updateOtherIngredients(objet)

const handleAddIngredient = (e) => {
  e.preventDefault();
  console.log("event target is :>> ", e.target);
  console.log(inputIngredientElement.value);

  // Store the input value in an Array
  otherIngredientsInput.push(inputIngredientElement.value);
  console.log("otherIngredients :>> ", otherIngredients);

  // ajouter input dans le DOM + clear the input + add possibility to edit / delit input
  addIngredientToDom(inputIngredientElement.value);

  // check if doublons in otherIngredients
  return otherIngredientsInput;
};

addIngredientBtnElement.addEventListener("click", handleAddIngredient);
submitBtnElement.addEventListener("click", handleSubmit);
