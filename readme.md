# Project Edibles

**Description**
<br/>

_**Do we add plants that aren't either toxic nor edible ? If so, what ratio per game ?**_

Game app in which the players have to decide whether to eat or not wild plants.

1. Home page ⇒ description of the game + possibility to sign-up / sign-in (_and maybe to try a demo ?_)

- Sign-up ⇒ each user creates its account (default avatar picture thanks to an API, username, geographical area, a ‘spirit-plant’ (or totem plant) (t*hat can acts as a “bonus” when he looses ?*)

- sign-in

2. new game

- The user decides whether he goes for a short walk (5 plants), a day’s hike (15 plants) or a trek (30 plants)

- The game starts. Background (style pixel art) that evocates nature (+sounds). One flashcard pops up with a picture of a plant and two options buttons : eat or discard.

  - If the user eats the plant, if the plant is indeed edible, he gains “life” points + in the Database, in the user’s document, a new plant object is pushed in the array “plants-found” : user : {username, avatar, area, plants-found: [{plant1: {Schema.Types.ObjectID, count +=1}}]}.

  - If the user eats the plant but it was toxic, he either looses “life” points or ends up dead straight ahead

  - If the user never eats any plants, as time passes, he looses “life” points ⇒ he has to at least successfully eats one plant in the game (if it’s the short walk, two plants in the hike, three plants in the trek).

  - _Bonus why not ad some medicinal plants that the user can store and uses later in the games if needs be ?_

3. end of game

- The correctly identified edibles get stored in the user’s profile, he can access more infos about them (areas, more tips on how to correctly identify them). He can ad some recipes to the plant, and if other users have done the same, he can see their recipes.

- _If he died of hunger or poison, what happens ?_

4. _Bonus if we have time : a collaborative map like google maps where players can indicate areas where they found edibles ?_

---

## Routes

**Routers:**

- /
- player
- game
- auth

| Routes                                                     | HTTP | Action/View                                                                                                          | Client-side scripts                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | CSS                                                         |
| ---------------------------------------------------------- | ---- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `/`                                                        | GET  | **home.hbs** : Nav (burger menu) + intro message (+btn play?)                                                        |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | grid qui permet d'afficher/faire disparaître le burger menu |
| `/signup `                                                 | GET  | **signup.hbs** : sign-up form                                                                                        |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |                                                             |
| `/signup `                                                 | POST | res.redirect('/:userId')                                                                                             | api call for avatar picture ?                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |                                                             |
| `/signin`                                                  | GET  | **signin.hbs** : sign-in form                                                                                        |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `/signin`                                                  | POST | res.redirect('/game' ou player/:id ??)                                                                               |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `/signout` (protectedRoute)                                | GET  | destroy session + res.redirect "/"                                                                                   |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `/player/:id` (protectedRoute)                             | GET  | **playerprofile.hbs** : User profile page (username, avatar, identified plants, map)=> possibility to edit           | API request to display map                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `/player/:id/edit` (protectedRoute)                        | GET  | **playerprofile.hbs** : User profile page with fields prefilled to update (username, avatar, identified plants, map) | API request to display map                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `/player/:id/edit` (protectedRoute)                        | POST | Update user profile + res.redirect('player/:id')                                                                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `/game/start` (protectedRoute)                             | GET  | **startGame.hbs** : 3 btns to choose "ballade", "rando", "trek" => res.redirect (`/game`)                            |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `/game` (protectedRoute)                                   | GET  | **game.hbs** : display flash card + 2 btns (discard/Eat)                                                             | Depending on the mode (rando, ballade ou trek), create an array CardsToPlay, randomly push X cards inside. Pop the first item on the list ==> currentCard . Use Axios to check in the DB if plant is edible/toxic. Variable "points" that changes based on that. Variable hasEaten increment by one each time the player eat an edible plant. If points === 0 OR currentCard.length === 0 => end of game. If points === 0 OR hasEaten too low => loose. Else win. Use Axios.post to increment the correctly identified plants in the DB. Redirect player towards profile page |
| `/plants/:plantId` (protectedRoute)                        | GET  | **onePlant.hbs** : display more info about one plant + links towards recipes                                         |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `/plants/:plantId/recipes` (protectedRoute)                | GET  | **recipes.hbs** : list of recipes added by players (name/description/picture ) + link to ad a new recipe             |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `/plants/:plantId/recipes/:recipeId` (protectedRoute)      | GET  | **oneRecipe.hbs** : detail of one recipe (possibility to edit if the author = currentPlayer)                         |
| `/plants/:plantId/recipes/new-recipe` (protectedRoute)     | GET  | **addRecipe.hbs** : form to add a new recipe                                                                         |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `/plants/:plantId/recipes/` (protectedRoute)               | POST | add new recipe in DB                                                                                                 |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `/plants/:plantId/recipes/:recipeId/edit` (protectedRoute) | GET  | form to update recipe if author === currentUser                                                                      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `/plants/:plantId/recipes/:recipeId/` (protectedRoute)     | POST | Update recipe in DB + res.redirect towards recipe's page                                                             |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

---

### Models

1. Player:

- username : String, required
- email : String, required, unique, validation with regex
- password : String, required
- avatar : String, default: API call
- plantsIdentified: {
  \_id: Schema.Types.ObjectId,
  ref: "plants",
  count: Number
  }
- recipes: {
  \_id: Schema.Types.ObjectId,
  ref: "recipes",
  }
- level: String, default: "Naive traveler"(=> comment faire pour que ca soit pas une info que le joueur ne puisse pas éditer lui même ?)

2. Plant:

- commonName: String, required
- scientificName: String,
- family: String,
- geographicalAreas: String,
- description: String,
- isEdible: boolean, required
- isToxic: boolean, required
- isLethal: boolean, required
- edible_parts: [String],
- imageUrl: String, required
- otherUses: [String]

3. Recipe:

- name: String, required,
- duration: String, default: 00:00,
- plants: {
  \_id: Schema.Types.ObjectId,
  ref: "plants",
  }, required
- otherIngredients: [String]
- instructions: String, required
- likes: Number, default:0,
- images: String

---

### TO DO

https://trello.com/b/zmfuoL0p/to-do
