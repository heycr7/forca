const words = [
  { word: "abacaxi", hint: "Uma fruta tropical de casca espinhosa." },
  { word: "avião", hint: "Meio de transporte que voa entre cidades e países." },
  { word: "astronauta", hint: "Pessoa que viaja pelo espaço." },
  { word: "biblioteca", hint: "Lugar cheio de livros para ler ou emprestar." },
  { word: "borboleta", hint: "Inseto colorido que começa a vida como lagarta." },
  { word: "cachoeira", hint: "Queda natural de água em um rio." },
  { word: "chocolate", hint: "Doce feito a partir do cacau." },
  { word: "dinossauro", hint: "Réptil pré-histórico que não existe mais." },
  { word: "elefante", hint: "Grande mamífero conhecido pela tromba." },
  { word: "girassol", hint: "Flor que costuma acompanhar a direção do sol." },
  { word: "helicóptero", hint: "Aeronave que decola e pousa na vertical." },
  { word: "independência", hint: "Condição de quem é livre e não depende de outro." },
  { word: "janela", hint: "Abertura na parede que deixa entrar luz e ar." },
  { word: "montanha", hint: "Grande elevação natural do terreno." },
  { word: "óculos", hint: "Acessório usado para ajudar a enxergar." },
  { word: "paralelepipedo", hint: "Bloco de pedra usado para calçar ruas." },
  { word: "queijo", hint: "Alimento feito a partir do leite." },
  { word: "relâmpago", hint: "Clarão que aparece no céu durante uma tempestade." },
  { word: "tartaruga", hint: "Réptil de casco que se movimenta devagar." },
  { word: "universo", hint: "Tudo o que existe: espaço, estrelas e planetas." },
  { word: "violino", hint: "Instrumento de cordas tocado com um arco." },
];

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const maxMistakes = 6;

const hintElement = document.querySelector("#hint");
const wordElement = document.querySelector("#word");
const keyboardElement = document.querySelector("#keyboard");
const mistakesElement = document.querySelector("#mistakes");
const messageElement = document.querySelector("#game-message");
const newGameButton = document.querySelector("#new-game");
const drawingParts = [...document.querySelectorAll("[data-part]")];

let currentWord;
let guessedLetters;
let mistakes;
let gameOver;

function normalizeLetter(letter) {
  return letter.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}

function startGame() {
  const choices = words.filter((entry) => entry !== currentWord);
  currentWord = choices[Math.floor(Math.random() * choices.length)];
  guessedLetters = new Set();
  mistakes = 0;
  gameOver = false;
  hintElement.textContent = currentWord.hint;
  messageElement.textContent = "Boa sorte! A dica pode ajudar.";
  messageElement.className = "";
  render();
}

function isWordComplete() {
  return [...currentWord.word].every((letter) => guessedLetters.has(normalizeLetter(letter)));
}

function guess(letter) {
  if (gameOver || guessedLetters.has(letter)) {
    return;
  }

  guessedLetters.add(letter);
  const isCorrect = [...currentWord.word].some((character) => normalizeLetter(character) === letter);

  if (!isCorrect) {
    mistakes += 1;
  }

  if (isWordComplete()) {
    gameOver = true;
    messageElement.textContent = "Você acertou! Mandou muito bem.";
    messageElement.className = "is-win";
  } else if (mistakes >= maxMistakes) {
    gameOver = true;
    messageElement.textContent = `Fim de jogo! A palavra era ${currentWord.word.toLocaleUpperCase("pt-BR")}.`;
    messageElement.className = "is-loss";
  } else {
    messageElement.textContent = isCorrect
      ? "Boa! Essa letra está na palavra."
      : "Essa letra não apareceu. Tente outra!";
  }

  render();
}

function render() {
  const revealWord = gameOver && mistakes >= maxMistakes;
  wordElement.replaceChildren();

  for (const letter of currentWord.word) {
    const character = document.createElement("span");
    const isRevealed = guessedLetters.has(normalizeLetter(letter)) || revealWord;
    character.className = `word-letter${isRevealed ? " is-revealed" : ""}`;
    character.textContent = isRevealed ? letter : "";
    character.setAttribute("aria-hidden", "true");
    wordElement.append(character);
  }

  wordElement.setAttribute(
    "aria-label",
    revealWord
      ? `Palavra: ${currentWord.word}`
      : `Palavra secreta com ${currentWord.word.length} letras`,
  );
  mistakesElement.textContent = String(mistakes);

  for (const part of drawingParts) {
    part.classList.toggle("is-visible", Number(part.dataset.part) <= mistakes);
  }

  keyboardElement.replaceChildren();
  for (const letter of alphabet) {
    const key = document.createElement("button");
    key.className = "key";
    key.type = "button";
    key.textContent = letter;
    key.disabled = guessedLetters.has(letter) || gameOver;
    key.setAttribute("aria-label", `Letra ${letter}`);

    if (guessedLetters.has(letter)) {
      const isCorrect = [...currentWord.word].some(
        (character) => normalizeLetter(character) === letter,
      );
      key.classList.add(isCorrect ? "is-correct" : "is-wrong");
    }

    keyboardElement.append(key);
  }
}

keyboardElement.addEventListener("click", (event) => {
  if (!(event.target instanceof HTMLButtonElement)) {
    return;
  }

  guess(event.target.textContent);
});

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1) {
    return;
  }

  const letter = normalizeLetter(event.key);
  if (alphabet.includes(letter)) {
    guess(letter);
  }
});

newGameButton.addEventListener("click", startGame);

startGame();
