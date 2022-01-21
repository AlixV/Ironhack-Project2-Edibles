// display the avatar based on pseudo live during sign up
const pseudoInputElement = document.querySelector("#pseudo");
const avatarViewElement = document.querySelector("#avatar-view");
// Listen to DOM Input, call the API, send the answer
// const avatar = `https://avatars.dicebear.com/api/pixel-art/${newPlayer.pseudo}.svg`;
// newPlayer.avatar = avatar;

function printPseudo(pseudo) {
  avatarViewElement.innerHTML = pseudo;
}

function handleInputEvt(e) {
  const input = e.target.value;
  console.log("input is: ", e.target.value);
  axios
    .get(`https://avatars.dicebear.com/api/pixel-art/${input}.svg`)
    .then(({ data }) => {
      console.log(data);
      printPseudo(data);
    })
    .catch((err) => console.log(err));
}

pseudoInputElement.addEventListener("input", handleInputEvt);
