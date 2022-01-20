const filterForm = document.getElementById("filter-form");

filterForm.onclick = handleChange;

function handleChange(e) {
  console.log(e);

  // initialize array of plants selectionned
  const plants = [];

  // get the checkbox input
  const inputs = filterForm.querySelectorAll("[name='plants']");

  console.log(inputs);

  // if checkbox is checked, ad its value to the plants array
  inputs.forEach((input) => {
    if (input.checked) {
      plants.push(input.value);
    }
  });

  console.log(plants);

  getPlants(plants);
}

// send the info via axios
function getPlants(plants) {
  return axios
    .get("/recipes/filter", {
      params: {
        plants: plants,
      },
    })
    .then((response) => displayRecipesFiltered(response.data))
    .catch((error) => console.error(error));
}

// display each recipe
function recipeCard(recipe) {
  let card = `<div class="recipe-list-card">
  <a href="/recipes/one/${recipe._id}/recipes">
  <h4>${recipe.name}</h4>
  <p>Durée: ${recipe.durationMinutes} minutes</p>
  <img src="${recipe.image}" class="recipe-list-icon" alt="${recipe.name}">
  <p>Auteur: ${recipe.creator.pseudo}</p>
  </a>
  </div>`;

  let recipesList = `<div id="recipes-list">`;
  card += recipesList + `</div>`;
  return card;
}

// display the updated list
function displayRecipesFiltered(recipes) {
  const mainContainer = document.getElementById("recipes-list");
  console.log(mainContainer);
  mainContainer.innerHTML = "";
  recipes.forEach((recipe) => {
    mainContainer.innerHTML += recipeCard(recipe);
  });
}
