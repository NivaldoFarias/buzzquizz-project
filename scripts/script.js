const QUIZZ_API = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";
let myQuizzes = JSON.parse(localStorage.getItem("quizzes"));
if (!myQuizzes) {
  myQuizzes = [];
}
let myQuizzesId = myQuizzes.map((quizz) => quizz.id);
let apiQuizzes = [];
let quizzImgExists = [];
let quizzTitleExists = [];

let nQuestions = null;
let containerHeight = 800;
let createQuizzValids = [];
let createQuestionsInvalids = [];
let btnIsEnabled = false;
let heightToAdd = 0;
let numberOfQuestions = 0;
let moves = 0;
let hits = 0;

let currentQuizz = null;

let quizz = {};

let teste = 0;

let editingMode = false;
let ID_edit = 0;

console.log("Page loaded");
getAllQuizzes();
toggleLoadingScreen();

/* First Screen Functions */
function getMyQuizzesOnLocalStorage() {
  myQuizzes = JSON.parse(localStorage.getItem("quizzes"));
  if (!myQuizzes) {
    myQuizzes = [];
  }
  return myQuizzes;
}
function addQuizzOnLocalStorage(ID, key) {
  myQuizzes.push({ id: ID, key: key });
  localStorage.setItem("quizzes", JSON.stringify(myQuizzes));
}
function getAllQuizzes() {
  myQuizzes = JSON.parse(localStorage.getItem("quizzes"));
  if (!myQuizzes) {
    myQuizzes = [];
  }
  myQuizzesId = myQuizzes.map((quizz) => quizz.id);

  const promise = axios.get(QUIZZ_API);
  promise.then((response) => {
    apiQuizzes = response.data;
    console.log(response);
    loadQuizzes(apiQuizzes);
  });
  promise.catch((error) => {
    console.log(error.reponse.status);
  });
}
function loadQuizzes(quizzes) {
  document
    .querySelector("button#create-quizz-btn")
    .addEventListener("click", openCreateQuizzWindow);
  myQuizzesId = myQuizzes.map((quizz) => quizz.id);
  if (checkMyQuizzesOnAPI(myQuizzesId)) {
    renderUserQuizzes();
  }
  renderAllQuizzes(quizzes);
}
function checkMyQuizzesOnAPI(myQuizzesId) {
  let quizzesId = apiQuizzes.map((quizz) => quizz.id);
  for (id of quizzesId) {
    if (myQuizzesId.includes(id)) {
      return true;
    }
  }
  localStorage.clear();
  return false;
}
function renderAllQuizzes(quizzes) {
  const all_Quizzes = document.querySelector(".all-quizzes");

  all_Quizzes.innerHTML = "<p>Todos os Quizzes</p>";
  quizzes.forEach((quizz, index) => {
    checkQuizz(quizz, index, all_Quizzes);
  });
  const all_QuizzesRenderedes = [
    ...document.querySelectorAll(".all-quizzes article"),
  ];
  all_QuizzesRenderedes.forEach((quizz) => {
    quizz.addEventListener("click", selectQuizz);
  });
}
function checkQuizz(quizz, index, all_Quizzes) {
  if (
    (validURL(quizz.image) &&
      (index === 0 || !quizzImgExists.includes(quizz.image))) ||
    (quizzImgExists.includes(quizz.image) &&
      !quizzTitleExists.includes(quizz.title))
  ) {
    quizzImgExists.push(quizz.image);
    quizzTitleExists.push(quizz.title);
    printQuizz(all_Quizzes, quizz, "all");
  }
}
function printQuizz(quizzesArray, quizz, typeOfQuizz) {
  if (typeOfQuizz === "user") {
    quizzesArray.innerHTML += `
    <article id="${quizz.id}">
      <div class="edit-delete-widget">
        <ion-icon name="create-outline" id="edit-btn"></ion-icon>
        <ion-icon name="trash-outline" id="delete-btn"></ion-icon>
      </div>
      <img 
        src="${quizz.image}" 
        class="cover" 
        alt="imagem do quizz" 
        onerror="javascript:this.src='dist/img/default-image.png'"
      />
      <div class="gradient"></div>
      <p>${quizz.title}</p>
    </article>`;
  } else if (typeOfQuizz === "all" && !myQuizzesId.includes(quizz.id)) {
    quizzesArray.innerHTML += `
    <article id="${quizz.id}">
      <img 
        src="${quizz.image}" 
        class="cover" 
        alt="imagem do quizz" 
        onerror="javascript:this.src='dist/img/default-image.png'"
      />
      <div class="gradient"></div>
      <p>${quizz.title}</p>
    </article>`;
  }
}
function renderUserQuizzes() {
  const user_Quizzes = document.querySelector(".user-quizzes");
  const no_Quizzes = document.querySelector(".no-quizz-available");
  no_Quizzes.classList.add("hidden");
  user_Quizzes.classList.remove("hidden");
  user_Quizzes.innerHTML = `
    <p>Seus Quizzes</p>
    <ion-icon name="add-circle" id="create-quizz-btn"></ion-icon>`;

  apiQuizzes.forEach((quizz) => {
    if (myQuizzesId.includes(quizz.id)) {
      printQuizz(user_Quizzes, quizz, "user");
    }
  });

  document
    .querySelector("ion-icon#create-quizz-btn")
    .addEventListener("click", openCreateQuizzWindow);
  const user_QuizzesRenderedes = [
    ...document.querySelectorAll(".user-quizzes article"),
  ];
  user_QuizzesRenderedes.forEach((quizz) => {
    quizz.addEventListener("click", selectQuizz);
  });

  let trashBtns = [...document.querySelectorAll("#delete-btn")];
  trashBtns.forEach((trashBtn) =>
    trashBtn.addEventListener("click", deleteQuizz)
  );

  let editBtns = [...document.querySelectorAll("#edit-btn")];
  editBtns.forEach((editBtn) => editBtn.addEventListener("click", editQuizz));
}
function getQuizz(ID) {
  const promise = axios.get(`${QUIZZ_API}/${ID}`);
  promise.then((response) => console.log(response));
  promise.catch((error) => {
    console.log(error.reponse.status);
  });
}
function selectCreatedQuizz() {
  let secondScreen = document.getElementById("second-screen");

  toggleLoadingScreen(3.4, 2);

  secondScreen.innerHTML = "";
  let id = document.querySelector("#create-quizz-4 article").id;
  const promise = axios.get(`${QUIZZ_API}/${id}`);
  promise.then((response) => {
    quizz = response.data;
    currentQuizz = quizz;
    renderQuizz(response.data);
  });
  promise.catch((error) => {
    console.log(error.reponse.status);
  });
}
function deleteQuizz(event) {
  event.stopPropagation();
  let confirmation = confirm("Deseja mesmo apagar este Quizz?");
  if (confirmation) {
    let key = myQuizzes.filter(
      (quizz) => quizz.id == this.parentNode.parentNode.id
    )[0].key;
    const promise = axios.delete(
      `${QUIZZ_API}/${this.parentNode.parentNode.id}`,
      {
        headers: { "Secret-Key": key },
      }
    );
    promise.then((response) => {
      console.log(response);
      location.reload();
    });
    promise.catch((error) => {
      console.log(error.reponse.status);
    });
  }
}
function editQuizz(event) {
  event.stopPropagation();
  editingMode = true;
  console.log("edit quizz");
  const promise = axios.get(`${QUIZZ_API}/${this.parentNode.parentNode.id}`);
  promise.then((response) => {
    quizz = response.data;
    ID_edit = quizz.id;
    delete quizz.id;
    console.log(quizz);
    openCreateQuizzWindow();
  });
  promise.catch((error) => {
    console.log(error.reponse.status);
  });
}
function selectQuizz() {
  let secondScreen = document.getElementById("second-screen");
  toggleLoadingScreen(1, 2);

  secondScreen.innerHTML = "";
  const promise = axios.get(`${QUIZZ_API}/${this.id}`);
  promise.then((response) => {
    currentQuizz = response.data;
    renderQuizz(currentQuizz);
  });
  promise.catch((error) => {
    console.log(error.reponse.status);
  });
}

/* Second Screen Functions */
function renderQuizz(quizz) {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  numberOfQuestions = quizz.questions.length;
  let secondScreen = document.getElementById("second-screen");
  secondScreen.innerHTML = "";

  secondScreen.innerHTML += `
  <article>
    <img
      src="${quizz.image}"
      class="cover"
      alt="quizz image"
      onerror="javascript:this.src='dist/img/default-image.png'"
    />
    <div class="gradient"></div>
    <p>${quizz.title}</p>
  </article>`;

  quizz.questions.forEach(renderQuestion);

  secondScreen.innerHTML += `<section class="quizz-end hidden"></section>`;

  secondScreen.innerHTML += `
  <button class="quizz-btn">Reiniciar Quizz</button>
  <button class="home-btn">Voltar para home</button>`;

  hits = 0;
  moves = 0;

  let home_btn = document.querySelector("#second-screen .home-btn");
  home_btn.addEventListener("click", () => {
    location.reload();
  });

  let restartQuizzBtn = document.querySelector(
    "#second-screen > button.quizz-btn"
  );
  restartQuizzBtn.addEventListener("click", () => {
    restartQuizzBtn.classList.add("clicked");
    setTimeout(function () {
      renderQuizz(currentQuizz);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 350);
  });

  const all_AnswersRenderedes = [...document.querySelectorAll("figure")];
  all_AnswersRenderedes.forEach((answer) => {
    answer.addEventListener("click", selectAnswer);
  });
}
function renderQuestion(question, index) {
  let currentAnswers = question.answers;
  currentAnswers.sort(() => Math.random() - 0.5);

  let secondScreen = document.getElementById("second-screen");
  secondScreen.innerHTML += `
  <section class="quizz-question">
    <div class="question" id="Q${index + 1}">
      ${question.title}
    </div>
    <div class="answers">
      ${renderAnswers(currentAnswers)}
    </div>
  </section>`;

  if (
    !["#fff", "#ffffff", "white"].includes(`${question.color}`.toLowerCase())
  ) {
    document.querySelector(
      `#Q${index + 1}`
    ).style.backgroundColor = `${question.color}`;
  } else {
    document.querySelector(`#Q${index + 1}`).style.backgroundColor = "#EC362D";
  }
}
function renderAnswers(answers) {
  let content = "";
  for (answer of answers) {
    content += `
    <figure class="${answer.isCorrectAnswer}">
      <img 
        src="${answer.image}" 
        class='cover' 
        alt="Answer Image"
        onerror="javascript:this.src='dist/img/default-image-small.png'"
      />
      <figcaption>${answer.text}</figcaption>
      <div class="whitish hidden"></div>
    </figure>`;
  }
  return content;
}
function selectAnswer() {
  let answers = this.parentNode;
  if (!answers.classList.contains("lock")) {
    moves++;
    if (this.classList.contains("true")) {
      hits++;
    }
    answers.classList.add("lock");
    [...answers.children].forEach((answer) => {
      if (answer != this) {
        answer.querySelector(".whitish").classList.remove("hidden");
      }
    });
    let rightAnswer = answers.querySelector(".true");
    rightAnswer.querySelector("figcaption").style.color = "green";
    let wrongAnswers = [...answers.querySelectorAll(".false")];
    wrongAnswers.forEach(
      (answer) => (answer.querySelector("figcaption").style.color = "red")
    );

    if (numberOfQuestions == moves) {
      let value = Math.round((hits / numberOfQuestions) * 100);
      let levels = currentQuizz.levels;
      levels.sort();
      let quizzEnd = document.querySelector(".quizz-end");
      levels.forEach((level) => {
        if (value >= level.minValue) {
          quizzEnd.innerHTML = `
          <div class="level-title">
            ${value}% de acerto: ${level.title}
          </div>
          <img
            src="${level.image}"
            class="cover"
            alt="level image"
            onerror="javascript:this.src='dist/img/default-image-small.png'"
          />
          <p>
            ${level.text}
          </p>`;
        }
      });
      quizzEnd.classList.remove("hidden");
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 200);
    } else {
      setTimeout(() => {
        window.scrollBy({
          top: this.parentElement.parentElement.offsetHeight + 24,
          behavior: "smooth",
        });
      }, 200);
    }
  }
}

/* Third Screen Functions */
function openCreateQuizzWindow() {
  let createQuizz1 = document.getElementById("create-quizz-1");

  createQuizz1.innerHTML = `<p>Comece pelo Começo</p>
  <div class="input-container">
    <input 
      id="title" 
      type="text" 
      placeholder="Título do seu quizz" 
    />
    <div class="alert-text">O título deve conter entre 20 e 60 caracteres</div>
    <input
      id="image"
      type="url"
      placeholder="URL da imagem do seu quizz"
    />
    <div class="alert-text">O valor informado não é uma URL válida</div>
    <input
      id="numOfQuestions"
      type="text"
      placeholder="Quantidade de perguntas do quizz"
    />
    <div class="alert-text">O quizz deve ter no mínimo 3 perguntas</div>
    <input
      id="numOfLevels"
      type="text"
      placeholder="Quantidade de níveis do quizz"
    />
    <div class="alert-text">O quizz deve ter no mínimo 2 níveis</div>
  </div>
  <button class="quizz-btn" disabled>
    Prosseguir pra criar perguntas
  </button>`;

  if (editingMode) {
    document.querySelector("#create-quizz-1 #title").value = quizz.title;
    document.querySelector("#create-quizz-1 #image").value = quizz.image;
    document.querySelector("#create-quizz-1 #numOfQuestions").value =
      quizz.questions.length;
    document.querySelector("#create-quizz-1 #numOfLevels").value =
      quizz.levels.length;
  }

  let quizzBtn = document.querySelector("#create-quizz-1 > button");
  quizzBtn.addEventListener("click", () => {
    quizzBtn.classList.add("clicked");
    openCreateQuestionsWindow();
  });

  toggleLoadingScreen(1, 3);
}
function openCreateQuestionsWindow() {
  if (btnIsEnabled) {
    createQuizzValids = [];

    let createQuizz2 = document.getElementById("create-quizz-2");

    let title = document.querySelector("#create-quizz-1 #title").value;
    let image = document.querySelector("#create-quizz-1 #image").value;
    let numOfQuestions = document.querySelector(
      "#create-quizz-1 #numOfQuestions"
    ).value;
    let numOfLevels = document.querySelector(
      "#create-quizz-1 #numOfLevels"
    ).value;

    if (editingMode) {
      quizz.title = title;
      quizz.image = image;
      quizz.questions.length = numOfQuestions;
      quizz.levels.length = numOfLevels;
    } else {
      let questions = [];
      questions.length = numOfQuestions;
      let levels = [];
      levels.length = numOfLevels;

      quizz = {
        title: title,
        image: image,
        questions: questions,
        levels: levels,
      };
    }
    createQuizz2.innerHTML = `<p>Crie suas perguntas</p>`;

    nQuestions = numOfQuestions;
    for (let i = 0; i < numOfQuestions; i++) {
      createQuizz2.innerHTML += `
      <article id="question-${i + 1}">
        <div class="question-btn">
          <p>Pergunta ${i + 1}</p>
          <ion-icon name="create-outline"></ion-icon>
        </div>
        <div class="input-container">
          <input 
            id="question-title" 
            type="text" 
            placeholder="Texto da pergunta" 
          />
          <div class="alert-text">O título deve conter entre 20 e 60 caracteres</div>
          <input 
            id="question-color" 
            type="text" 
            placeholder="Cor de fundo da pergunta" 
          />
          <div class="alert-text">O valor informado não é uma cor válida</div>
          <p>Resposta correta</p>
          <input 
            id="right-answer-text" 
            type="text" 
            placeholder="Resposta correta"
          />
          <div class="alert-text">O texto deve conter entre 5 e 60 caracteres</div>
          <input 
            id="right-answer-image"
            type="url" 
            placeholder="URL da imagem" 
          />
          <div class="alert-text">O valor informado não é uma URL válida</div>
          <p>Respostas incorretas</p>
          <div class="incorrect-answer">
            <input 
              id="wrong-answer-text-1" 
              type="text" 
              placeholder="Resposta incorreta 1" 
            />
            <div class="alert-text">O texto deve conter entre 5 e 60 caracteres</div>
            <input 
              id="wrong-answer-image-1" 
              type="text" 
              placeholder="URL da imagem 1" 
            />
            <div class="alert-text">O valor informado não é uma URL válida</div>
          </div>
          <div class="incorrect-answer">
            <input 
              id="wrong-answer-text-2" 
              type="text" 
              placeholder="Resposta incorreta 2" 
            />
            <div class="alert-text">O texto deve conter entre 5 e 60 caracteres</div>
            <input 
              id="wrong-answer-image-2" 
              type="text" 
              placeholder="URL da imagem 2" 
            />
            <div class="alert-text">O valor informado não é uma URL válida</div>
          </div>
          <div class="incorrect-answer">
            <input 
              id="wrong-answer-text-3"  
              type="text" 
              placeholder="Resposta incorreta 3" 
            />
            <div class="alert-text">O texto deve conter entre 5 e 60 caracteres</div>
            <input 
              id="wrong-answer-image-3" 
              type="text" 
              placeholder="URL da imagem 3" 
            />
            <div class="alert-text">O valor informado não é uma URL válida</div>
          </div>
        <ion-icon name="chevron-up"></ion-icon>
        </div>
      </article>`;
    }

    createQuizz2.innerHTML += `<button class="quizz-btn">Prosseguir pra criar níveis</button>`;

    let quizzBtn = document.querySelector("#create-quizz-2 button");
    quizzBtn.addEventListener("click", () => {
      quizzBtn.classList.add("clicked");
      openCreateLevelssWindow();
    });

    setTimeout(() => {
      if (editingMode) {
        for (let i = 0; i < numOfQuestions; i++) {
          if (quizz.questions[i]) {
            document.querySelector(`#question-${i + 1} #question-title`).value =
              quizz.questions[i].title;
            document.querySelector(`#question-${i + 1} #question-color`).value =
              quizz.questions[i].color;
            let rightAnswers = quizz.questions[i].answers.filter(
              (answer) => answer.isCorrectAnswer == true
            );
            let wrongAnswers = quizz.questions[i].answers.filter(
              (answer) => answer.isCorrectAnswer == false
            );
            document.querySelector(
              `#question-${i + 1} #right-answer-text`
            ).value = rightAnswers[0].text;
            document.querySelector(
              `#question-${i + 1} #right-answer-image`
            ).value = rightAnswers[0].image;
            for (let j = 0; j < wrongAnswers.length; j++) {
              document.querySelector(
                `#question-${i + 1} #wrong-answer-text-${j + 1}`
              ).value = wrongAnswers[j].text;
              document.querySelector(
                `#question-${i + 1} #wrong-answer-image-${j + 1}`
              ).value = wrongAnswers[j].image;
            }
          }
        }
      }
      toggleLoadingScreen(3.1, 3.2);
      collapseElement();
    }, 400);
  }
}
function openCreateLevelsWindow() {
  if (btnIsEnabled) {
    for (let i = 0; i < quizz.questions.length; i++) {
      let answers = [];
      let rightAnswer = {
        text: document.querySelector(`#question-${i + 1} #right-answer-text`)
          .value,
        image: document.querySelector(`#question-${i + 1} #right-answer-image`)
          .value,
        isCorrectAnswer: true,
      };
      answers.push(rightAnswer);
      for (let j = 1; j < 4; j++) {
        let wrongAnswerText = document.querySelector(
          `#question-${i + 1} #wrong-answer-text-${j}`
        ).value;
        let wrongAnswerImage = document.querySelector(
          `#question-${i + 1} #wrong-answer-image-${j}`
        ).value;
        if (wrongAnswerImage && wrongAnswerImage) {
          answers.push({
            text: wrongAnswerText,
            image: wrongAnswerImage,
            isCorrectAnswer: false,
          });
        }
      }
      let questionTitle = document.querySelector(
        `#question-${i + 1} #question-title`
      ).value;
      let questionColor = document.querySelector(
        `#question-${i + 1} #question-color`
      ).value;

      quizz.questions[i] = {
        title: questionTitle,
        color: questionColor,
        answers: answers,
      };
    }

    let createQuizz3 = document.getElementById("create-quizz-3");

    createQuizz3.innerHTML = `<p>Agora, decida os níveis!</p>`;

    for (let i = 0; i < quizz.levels.length; i++) {
      createQuizz3.innerHTML += `<article id="LEVEL-${i + 1}">
        <div class="question-btn">
          <p>Nível ${i + 1}</p>
          <ion-icon name="create-outline"></ion-icon>
        </div>
        <div class="input-container">
          <input id="level-title" type="text" placeholder="Título do nível" />
          <input id="level-minValue" type="text" placeholder="% de acerto mínima" />
          <input id="level-image" type="text" placeholder="URL da imagem do nível" />
          <textarea id="level-text" placeholder="Descrição do nível" rows="7"></textarea>
          <ion-icon name="chevron-up"></ion-icon>
        </div>
      </article>`;
    }

    createQuizz3.innerHTML += `<button class="quizz-btn">Finalizar Quizz</button>`;

    let finishBtn = document.querySelector("#create-quizz-3 button");
    finishBtn.addEventListener("click", () => {
      finishBtn.classList.add("clicked");
      finishQuizz();
    });

    setTimeout(() => {
      if (editingMode) {
        for (let i = 0; i < quizz.levels.length; i++) {
          if (quizz.levels[i]) {
            document.querySelector(`#LEVEL-${i + 1} #level-title`).value =
              quizz.levels[i].title;
            document.querySelector(`#LEVEL-${i + 1} #level-minValue`).value =
              quizz.levels[i].minValue;
            document.querySelector(`#LEVEL-${i + 1} #level-image`).value =
              quizz.levels[i].image;
            document.querySelector(`#LEVEL-${i + 1} #level-text`).value =
              quizz.levels[i].text;
          }
        }
      }
      toggleLoadingScreen(3.2, 3.3);
      collapseElement();
    }, 300);
  }
}
function collapseElement() {
  toggleCollapsibleElement("create-quizz-2");
  toggleCollapsibleElement("create-quizz-3");
}
function toggleCollapsibleElement(elementID) {
  const collapseButtons = Array.from(
    document.querySelectorAll(`#${elementID} .question-btn`)
  );
  const altBtns = Array.from(
    document.querySelectorAll(".input-container ion-icon")
  );

  collapseButtons.forEach((btn, index) => {
    checkUserInput("questions", index + 1);
    btn.addEventListener("click", function () {
      this.classList.toggle("active");
      const content = this.nextElementSibling;
      if (content.style.height) {
        this.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.1)";
        content.style.height = null;
        content.style.overflow = "hidden";
      } else {
        this.style.boxShadow = "0px -3px 10px rgba(0, 0, 0, 0.1)";
        content.style.height = `${containerHeight}px`;
        content.style.overflow = "initial";
      }
    });
  });
  altBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      collapseButtons.forEach((btnClicked) => {
        if (
          btnClicked.classList.contains("active") &&
          btnClicked.nextElementSibling === btn.parentElement
        ) {
          btnClicked.classList.remove("active");
          const content = btnClicked.nextElementSibling;
          if (content.style.height) {
            btnClicked.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.1)";
            content.style.height = null;
            content.style.overflow = "hidden";
          }
        }
      });
    });
  });
}
function updateContainerHeight(value, questionNumber) {
  let container = document.querySelector(
    `#question-${questionNumber} .input-container`
  );

  container.style.height = `${parseInt(container.style.height) + value}px`;
  containerHeight = parseInt(container.style.height);
}
function finishQuizz() {
  if (createLevelsValidation()) {
    for (let i = 0; i < quizz.levels.length; i++) {
      let levelTitle = document.querySelector(
        `#LEVEL-${i + 1} #level-title`
      ).value;
      let levelMinValue = parseInt(
        Number(document.querySelector(`#LEVEL-${i + 1} #level-minValue`).value)
      );
      let levelImage = document.querySelector(
        `#LEVEL-${i + 1} #level-image`
      ).value;
      let levelText = document.querySelector(
        `#LEVEL-${i + 1} #level-text`
      ).value;
      quizz.levels[i] = {
        title: levelTitle,
        image: levelImage,
        text: levelText,
        minValue: levelMinValue,
      };
    }

    setTimeout(() => {
      if (editingMode) {
        postQuizzEdited(quizz, ID_edit);
      } else {
        postQuizz(quizz);
      }
    }, 300);
  }
}
function postQuizz(quizz) {
  const promise = axios.post(QUIZZ_API, quizz);
  promise.then((response) => {
    console.log(response);

    // guarda o ID e a chave dos Quizzes criados
    // a chave precisa pro bônus
    myQuizzes.push({ id: response.data.id, key: response.data.key });
    localStorage.setItem("quizzes", JSON.stringify(myQuizzes));

    let createQuizz4 = document.getElementById("create-quizz-4");

    createQuizz4.innerHTML = `<p>Seu quizz está pronto!</p>
    <article id="${response.data.id}">
      <img src="${quizz.image}" class="cover" alt="imagem do quizz">
      <div class="gradient"></div>
      <p>${quizz.title}</p>
    </article>
    <button class="quizz-btn">Acessar Quizz</button>
    <button class="home-btn">Voltar para home</button>`;

    let createdQuizz = document.querySelector("#create-quizz-4 article");
    createdQuizz.addEventListener("click", () => {
      selectCreatedQuizz();
    });
    let playQuizz = document.querySelector("#create-quizz-4 .quizz-btn");
    playQuizz.addEventListener("click", () => {
      selectCreatedQuizz();
    });
    let home_btn = document.querySelector("#create-quizz-4 .home-btn");
    home_btn.addEventListener("click", () => {
      location.reload();
    });

    setTimeout(() => {
      toggleLoadingScreen(3.3, 3.4);
      quizz = {};
    }, 300);
  });
}
function postQuizzEdited(quizz, ID_edit) {
  let key = myQuizzes.filter((quizz) => quizz.id == ID_edit)[0].key;
  const promise = axios.put(`${QUIZZ_API}/${ID_edit}`, quizz, {
    headers: { "Secret-Key": key },
  });
  promise.then((response) => {
    console.log(response);

    let createQuizz4 = document.getElementById("create-quizz-4");

    createQuizz4.innerHTML = `<p>Seu quizz está pronto!</p>
    <article id="${response.data.id}">
      <img src="${quizz.image}" class="cover" alt="imagem do quizz">
      <div class="gradient"></div>
      <p>${quizz.title}</p>
    </article>
    <button class="quizz-btn">Acessar Quizz</button>
    <button class="home-btn">Voltar para home</button>`;

    let createdQuizz = document.querySelector("#create-quizz-4 article");
    createdQuizz.addEventListener("click", () => {
      selectCreatedQuizz();
    });
    let playQuizz = document.querySelector("#create-quizz-4 .quizz-btn");
    playQuizz.addEventListener("click", () => {
      selectCreatedQuizz();
    });
    let home_btn = document.querySelector("#create-quizz-4 .home-btn");
    home_btn.addEventListener("click", () => {
      location.reload();
    });

    setTimeout(() => {
      toggleLoadingScreen(3.3, 3.4);
      quizz = {};
    }, 300);
  });
}

/* Validation Functions */
function createQuestionsValidation() {
  // body
  teste = parseInt(prompt("teste"));
  if (teste) {
    return true;
  }
  for (let i = 0; i < quizz.questions.length; i++) {
    if (
      document.querySelector(`#question-${i + 1} #question-title`).value
        .length < 20
    ) {
      alert(`Texto da pergunta ${i + 1}: no mínimo 20 caracteres`);
      return false;
    } else if (
      !isColor(
        document.querySelector(`#question-${i + 1} #question-color`).value
      )
    ) {
      alert(
        `Cor da pergunta ${
          i + 1
        }: deve ser uma cor em hexadecimal (começar em "#", seguida de 6 caracteres hexadecimais, ou seja, números ou letras de A a F)`
      );
      return false;
    } else if (
      !document.querySelector(`#question-${i + 1} #right-answer-text`).value
    ) {
      alert("Texto as resposta correta: não pode estar vazio");
      return false;
    } else if (
      !validURL(
        document.querySelector(`#question-${i + 1} #right-answer-image`).value
      )
    ) {
      alert("URL da imagem de resposta correta: deve ter formato de URL");
      return false;
    } else if (
      !document.querySelector(`#question-${i + 1} #wrong-answer-text-1`).value
    ) {
      alert("Texto da resposta incorreta 1: não pode estar vazio");
      return false;
    } else if (
      !validURL(
        document.querySelector(`#question-${i + 1} #wrong-answer-image-1`).value
      )
    ) {
      alert("URL das imagem de resposta incorreta 1: deve ter formato de URL");
      return false;
    } else if (
      document.querySelector(`#question-${i + 1} #wrong-answer-text-2`).value &&
      !validURL(
        document.querySelector(`#question-${i + 1} #wrong-answer-image-2`).value
      )
    ) {
      alert("URL das imagem de resposta incorreta 2: deve ter formato de URL");
      return false;
    } else if (
      document.querySelector(`#question-${i + 1} #wrong-answer-text-3`).value &&
      !validURL(
        document.querySelector(`#question-${i + 1} #wrong-answer-image-3`).value
      )
    ) {
      alert("URL das imagem de resposta incorreta 3: deve ter formato de URL");
      return false;
    }
  }
  return true;
}
function createLevelsValidation() {
  teste = parseInt(prompt("teste"));
  if (teste) {
    return true;
  }
  for (let i = 0; i < quizz.levels.length; i++) {
    if (
      document.querySelector(`#LEVEL-${i + 1} #level-title`).value.length < 10
    ) {
      alert(`Título do nível ${i + 1}: mínimo de 10 caracteres`);
      return false;
    } else if (
      !isNumber(document.querySelector(`#LEVEL-${i + 1} #level-minValue`).value)
    ) {
      alert(`% de acerto mínima do nivel ${i + 1}: deve ser um numero inteiro`);
      return false;
    } else if (
      Number(document.querySelector(`#LEVEL-${i + 1} #level-minValue`).value) <
        0 ||
      Number(document.querySelector(`#LEVEL-${i + 1} #level-minValue`).value) >
        100
    ) {
      alert(`% de acerto mínima do nivel ${i + 1}: um número entre 0 e 100`);
      return false;
    } else if (
      !validURL(document.querySelector(`#LEVEL-${i + 1} #level-image`).value)
    ) {
      alert(`URL da imagem do nível ${i + 1}: deve ter formato de URL`);
      return false;
    } else if (
      document.querySelector(`#LEVEL-${i + 1} #level-text`).value.length < 30
    ) {
      alert(`Descrição do nível ${i + 1}: mínimo de 30 caracteres`);
      return false;
    }
  }
  if (
    ![...document.querySelectorAll("#level-minValue")]
      .map((input) => input.value)
      .includes("0")
  ) {
    alert(
      "É obrigatório existir pelo menos 1 nível cuja % de acerto mínima seja 0%"
    );
    return false;
  }
  return true;
}
function checkUserInput(screen, questionNumber) {
  switch (screen) {
    case "quizz":
      let title = document.querySelector("#create-quizz-1 #title");
      let image = document.querySelector("#create-quizz-1 #image");
      let numOfQuestions = document.querySelector(
        "#create-quizz-1 #numOfQuestions"
      );
      let numOfLevels = document.querySelector("#create-quizz-1 #numOfLevels");

      title.addEventListener("focusout", () => {
        const content = title.nextElementSibling;
        if (title.value.length < 20 || title.value.length > 60) {
          showAlertInput(title, content, 1);
        } else {
          hideAlertInput(title, content, 1);
          updateBtn(1);
        }
      });
      image.addEventListener("input", () => {
        const content = image.nextElementSibling;
        if (!validURL(image.value)) {
          showAlertInput(image, content, 1);
        } else {
          hideAlertInput(image, content, 1);
          updateBtn(1);
        }
      });
      numOfQuestions.addEventListener("input", () => {
        const content = numOfQuestions.nextElementSibling;
        if (
          !isNumber(numOfQuestions.value) ||
          numOfQuestions.value < 3 ||
          numOfQuestions.value > 4
        ) {
          showAlertInput(numOfQuestions, content, 1);
        } else {
          hideAlertInput(numOfQuestions, content, 1);
          updateBtn(1);
        }
      });
      numOfLevels.addEventListener("input", () => {
        const content = numOfLevels.nextElementSibling;
        if (numOfLevels.value < 2 || numOfLevels.value > 10) {
          showAlertInput(numOfLevels, content, 1);
        } else {
          hideAlertInput(numOfLevels, content, 1);
          updateBtn(1);
        }
      });

      break;
    case "questions":
      let question = {
        title: document.querySelector(
          `#question-${questionNumber} #question-title`
        ),
        color: document.querySelector(
          `#question-${questionNumber} #question-color`
        ),
      };
      let rightAnswer = {
        text: document.querySelector(
          `#question-${questionNumber} #right-answer-text`
        ),
        imageUrl: document.querySelector(
          `#question-${questionNumber} #right-answer-image`
        ),
      };
      let wrongAnswer_1 = {
        text: document.querySelector(
          `#question-${questionNumber} #wrong-answer-text-1`
        ),
        imageUrl: document.querySelector(
          `#question-${questionNumber} #wrong-answer-image-1`
        ),
      };
      let wrongAnswer_2 = {
        text: document.querySelector(
          `#question-${questionNumber} #wrong-answer-text-2`
        ),
        imageUrl: document.querySelector(
          `#question-${questionNumber} #wrong-answer-image-2`
        ),
      };
      let wrongAnswer_3 = {
        text: document.querySelector(
          `#question-${questionNumber} #wrong-answer-text-3`
        ),
        imageUrl: document.querySelector(
          `#question-${questionNumber} #wrong-answer-image-3`
        ),
      };

      question.title.addEventListener("focusout", () => {
        const content = question.title.nextElementSibling;
        if (
          question.title.value.length < 20 ||
          question.title.value.length > 60
        ) {
          showAlertInput(question.title, content, 2, questionNumber);
        } else {
          hideAlertInput(question.title, content, 2, questionNumber);
          updateBtn(2);
        }
      });
      question.color.addEventListener("focusout", () => {
        const content = question.color.nextElementSibling;
        if (!isColor(question.color.value)) {
          showAlertInput(question.color, content, 2, questionNumber);
        } else {
          hideAlertInput(question.color, content, 2, questionNumber);
          updateBtn(2);
        }
      });
      rightAnswer.text.addEventListener("focusout", () => {
        const content = rightAnswer.text.nextElementSibling;
        if (
          rightAnswer.text.value.length < 20 ||
          rightAnswer.text.value.length > 60
        ) {
          showAlertInput(rightAnswer.text, content, 2, questionNumber);
        } else {
          hideAlertInput(rightAnswer.text, content, 2, questionNumber);
          updateBtn(2);
        }
      });
      rightAnswer.imageUrl.addEventListener("focusout", () => {
        const content = rightAnswer.imageUrl.nextElementSibling;
        if (!validURL(rightAnswer.imageUrl.value)) {
          showAlertInput(rightAnswer.imageUrl, content, 2, questionNumber);
        } else {
          hideAlertInput(rightAnswer.imageUrl, content, 2, questionNumber);
          updateBtn(2);
        }
      });
      wrongAnswer_1.text.addEventListener("focusout", () => {
        const content = wrongAnswer_1.text.nextElementSibling;
        if (
          wrongAnswer_1.text.value.length < 20 ||
          wrongAnswer_1.text.value.length > 60
        ) {
          showAlertInput(wrongAnswer_1.text, content, 2, questionNumber);
        } else {
          hideAlertInput(wrongAnswer_1.text, content, 2, questionNumber);
          updateBtn(2);
        }
      });
      wrongAnswer_1.imageUrl.addEventListener("focusout", () => {
        const content = wrongAnswer_1.imageUrl.nextElementSibling;
        if (!validURL(wrongAnswer_1.imageUrl.value)) {
          showAlertInput(wrongAnswer_1.imageUrl, content, 2, questionNumber);
        } else {
          hideAlertInput(wrongAnswer_1.imageUrl, content, 2, questionNumber);
          updateBtn(2);
        }
      });
      wrongAnswer_2.text.addEventListener("focusout", () => {
        const content = wrongAnswer_2.text.nextElementSibling;
        if (
          wrongAnswer_2.text.value.length < 20 ||
          wrongAnswer_2.text.value.length > 60
        ) {
          showAlertInput(wrongAnswer_2.text, content, 2, questionNumber);
        } else {
          hideAlertInput(wrongAnswer_2.text, content, 2, questionNumber);
          updateBtn(2);
        }
      });
      wrongAnswer_2.imageUrl.addEventListener("focusout", () => {
        const content = wrongAnswer_2.imageUrl.nextElementSibling;
        if (!validURL(wrongAnswer_2.imageUrl.value)) {
          showAlertInput(wrongAnswer_2.imageUrl, content, 2, questionNumber);
        } else {
          hideAlertInput(wrongAnswer_2.imageUrl, content, 2, questionNumber);
          updateBtn(2);
        }
      });
      wrongAnswer_3.text.addEventListener("focusout", () => {
        const content = wrongAnswer_3.text.nextElementSibling;
        if (
          wrongAnswer_3.text.value.length < 20 ||
          wrongAnswer_3.text.value.length > 60
        ) {
          showAlertInput(wrongAnswer_3.text, content, 2, questionNumber);
        } else {
          hideAlertInput(wrongAnswer_3.text, content, 2, questionNumber);
          updateBtn(2);
        }
      });
      wrongAnswer_3.imageUrl.addEventListener("focusout", () => {
        const content = wrongAnswer_3.imageUrl.nextElementSibling;
        if (!validURL(wrongAnswer_3.imageUrl.value)) {
          showAlertInput(wrongAnswer_3.imageUrl, content, 2, questionNumber);
        } else {
          hideAlertInput(wrongAnswer_3.imageUrl, content, 2, questionNumber);
          updateBtn(2);
        }
      });

      break;
    case "levels":
      /* let title = document.querySelector("#create-quizz-1 #title");
      let image = document.querySelector("#create-quizz-1 #image");
      let numOfQuestions = document.querySelector(
        "#create-quizz-1 #numOfQuestions"
      );
      let numOfLevels = document.querySelector("#create-quizz-1 #numOfLevels");

      title.addEventListener("focusout", () => {
        const content = title.nextElementSibling;
        if (title.value.length < 20 || title.value.length > 60) {
          showAlertInput(title, content);
        } else {
          hideAlertInput(title, content);
          updateBtn(3);
        }
      });
      image.addEventListener("input", () => {
        const content = image.nextElementSibling;
        if (!validURL(image.value)) {
          showAlertInput(image, content);
        } else {
          hideAlertInput(image, content);
          updateBtn(3);
        }
      });
      numOfQuestions.addEventListener("input", () => {
        const content = numOfQuestions.nextElementSibling;
        if (
          !isNumber(numOfQuestions.value) ||
          numOfQuestions.value < 3 ||
          numOfQuestions.value > 4
        ) {
          showAlertInput(numOfQuestions, content);
        } else {
          hideAlertInput(numOfQuestions, content);
          updateBtn(3);
        }
      });
      numOfLevels.addEventListener("input", () => {
        const content = numOfLevels.nextElementSibling;
        if (numOfLevels.value < 2 || numOfLevels.value > 10) {
          showAlertInput(numOfLevels, content);
        } else {
          hideAlertInput(numOfLevels, content);
          updateBtn(3);
        }
      }); */

      break;
    default:
      console.log(`Erro ao checar inputs do usuario!`);
      window.reload();
  }
}
function showAlertInput(element, alertText, screen, questionNumber) {
  if (screen === 2 && !createQuestionsInvalids.includes(element)) {
    createQuestionsInvalids.push(element);
    updateContainerHeight(+19, questionNumber);
  }
  if (createQuizzValids.length > 0 && createQuizzValids.includes(element)) {
    let index = createQuizzValids.indexOf(element);
    createQuizzValids.splice(index, 1);
  }

  element.style.backgroundColor = "rgba(255, 233, 233, 1)";
  alertText.style.height = `19px`;
  alertText.style.overflow = "initial";
}
function hideAlertInput(element, alertText, screen, questionNumber) {
  if (screen === 2 && createQuestionsInvalids.includes(element)) {
    let index = createQuestionsInvalids.indexOf(element);
    createQuestionsInvalids.splice(index, 1);

    updateContainerHeight(-19, questionNumber);
  }
  if (!createQuizzValids.includes(element)) {
    createQuizzValids.push(element);
  }

  element.style.backgroundColor = "initial";
  alertText.style.height = null;
  alertText.style.overflow = "hidden";
}
function updateBtn(screen) {
  let btn = document.querySelector(`#create-quizz-${screen} .quizz-btn`);

  switch (screen) {
    case 1:
      if (createQuizzValids.length === 4) {
        btn.disabled = false;
        btn.style.opacity = "1";
        btnIsEnabled = true;
      } else if (!btn.disabled) {
        btn.disabled = true;
        btn.style.opacity = "0.5";
        btnIsEnabled = false;
      }

      break;
    case 2:
      if (createQuizzValids.length >= nQuestions * 6) {
        btn.disabled = false;
        btn.style.opacity = "1";
        btnIsEnabled = true;
      } else if (!btn.disabled) {
        btn.disabled = true;
        btn.style.opacity = "0.5";
        btnIsEnabled = false;
      }

      break;
    case 3:
      if (createQuizzValids.length === 12) {
        btn.disabled = false;
        btn.style.opacity = "1";
        btnIsEnabled = true;
      } else if (!btn.disabled) {
        btn.disabled = true;
        btn.style.opacity = "0.5";
        btnIsEnabled = false;
      }

      break;
    default:
      console.log("erro ao atuializar botao");
      window.reload();
  }
}
function validURL(str) {
  let pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return pattern.test(str) && checkImage(str);
}
function checkImage(url) {
  if (typeof url !== "string") {
    return false;
  }
  return (
    url.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim) !== null
  );
}
function isColor(str) {
  if (str.length !== 7 || str[0] !== "#") {
    return false;
  } else {
    let validChar = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
    ];
    for (let i = 1; i < str.length; i++) {
      if (!validChar.includes(str[i].toLowerCase())) {
        return false;
      }
    }
  }
  return true;
}
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
let mailme = function () {
  console.log("Caught!");
};
window.addEventListener(
  "error",
  function (e) {
    var ie = window.event || {};
    var errMsg =
      e.message || ie.errorMessage || "404 error on " + window.location;
    var errSrc =
      (e.filename || ie.errorUrl) + ": " + (e.lineno || ie.errorLine);
    mailme([errMsg, errSrc]);
  },
  true
);

/* Global Functions */
function toggleLoadingScreen(from, to) {
  const loadingScreen = document.querySelector(".loading-spinner");
  const firstScreen = document.getElementById("first-screen");
  const secondScreen = document.getElementById("second-screen");
  const thirdScreen = document.getElementById("third-screen");

  if (!from && !to) {
    setTimeout(() => {
      toggleHidden(loadingScreen);
      toggleHidden(firstScreen);
    }, randomTimeOut());
  } else if (from === 1) {
    toggleHidden(firstScreen);
    toggleHidden(loadingScreen);

    setTimeout(() => {
      toggleHidden(loadingScreen);
      if (to === 2) {
        toggleHidden(secondScreen);
      } else if (to >= 3) {
        toggleHidden(thirdScreen);
        checkUserInput("quizz", null);
      }
    }, randomTimeOut());
  } else if (from === 2) {
    toggleHidden(secondScreen);
    toggleHidden(loadingScreen);

    setTimeout(() => {
      toggleHidden(loadingScreen);

      if (to === 1) {
        toggleHidden(firstScreen);
      } else if (to === 3) {
        toggleHidden(thirdScreen);
      }
    }, randomTimeOut());
  } else if (from >= 3) {
    if (from === 3) {
      toggleHidden(thirdScreen);
      toggleHidden(loadingScreen);

      setTimeout(() => {
        toggleHidden(loadingScreen);
        toggleHidden(firstScreen);
      }, 1000);
    } else if (from === 3.1) {
      const firstSection = document.getElementById("create-quizz-1");
      const secondSection = document.getElementById("create-quizz-2");

      toggleHidden(firstSection);
      toggleHidden(thirdScreen);
      toggleHidden(loadingScreen);

      setTimeout(() => {
        toggleHidden(loadingScreen);
        toggleHidden(thirdScreen);
        toggleHidden(secondSection);
      }, randomTimeOut());
    } else if (from === 3.2) {
      const secondSection = document.getElementById("create-quizz-2");
      const thirdSection = document.getElementById("create-quizz-3");

      toggleHidden(secondSection);
      toggleHidden(thirdScreen);
      toggleHidden(loadingScreen);

      setTimeout(() => {
        toggleHidden(loadingScreen);
        toggleHidden(thirdScreen);
        toggleHidden(thirdSection);
      }, randomTimeOut());
    } else if (from === 3.3) {
      const thirdSection = document.getElementById("create-quizz-3");
      const fourthSection = document.getElementById("create-quizz-4");

      toggleHidden(thirdSection);
      toggleHidden(thirdScreen);
      toggleHidden(loadingScreen);

      setTimeout(() => {
        toggleHidden(loadingScreen);
        toggleHidden(thirdScreen);
        toggleHidden(fourthSection);
      }, randomTimeOut());
    } else if (from === 3.4) {
      const fourthSection = document.getElementById("create-quizz-4");

      toggleHidden(fourthSection);
      toggleHidden(thirdScreen);
      toggleHidden(loadingScreen);

      setTimeout(() => {
        if (to === 1) {
          toggleHidden(loadingScreen);
          toggleHidden(thirdScreen);
          toggleHidden(firstScreen);
        } else if (to === 2) {
          toggleHidden(loadingScreen);
          toggleHidden(thirdScreen);
          toggleHidden(secondScreen);
        }
      }, randomTimeOut());
    }
  }
}
function toggleHidden(screen) {
  screen.classList.toggle("hidden");
}
function randomTimeOut() {
  let time = Math.floor(Math.random() * 2000);

  console.log(`load time: ${time}ms`);
  if (time < 400) {
    time += 300;
  }
  return time;
}

//  quizz = {
//   title:
//     // "Só quem assistiu todos os filmes da Marvel vai gabaritar",
//     "juro que esse e o ultimo teste, nao aguento mais! misericordia!",
//   image:
//     "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1200px-Marvel_Logo.svg.png",
//   questions: [
//     {
//       title: "Que ator é conhecido pelo seu papel como O Hulk?",
//       color: "#15E818",
//       answers: [
//         {
//           text: "Mark Ruffalo",
//           image:
//             "https://ogimg.infoglobo.com.br/in/25320231-3fa-ec0/FT1086A/33973739_Marvels-AvengersAge-Of-UltronHulk-Bruce-Banner-Mark-RuffaloPhFilm-FrameMarvel.jpg",
//           isCorrectAnswer: true,
//         },
//         {
//           text: "Vincent D'Onofrio",
//           image:
//             "https://nerdhits.com.br/wp-content/uploads/2021/11/hulk-1.jpg",
//           isCorrectAnswer: false,
//         },
//       ],
//     },
//     {
//       title: "Qual é o nome do martelo encantado do Thor?",
//       color: "#1565E8",
//       answers: [
//         {
//           text: "Mjölnir",
//           image:
//             "https://exame.com/wp-content/uploads/2018/10/thor-ragnarok-filme-cultura-vip.jpg",
//           isCorrectAnswer: true,
//         },
//         {
//           text: "Mnajas",
//           image: "https://mega.ibxk.com.br/2013/11/04/04135704362.jpg",
//           isCorrectAnswer: false,
//         },
//       ],
//     },
//     {
//       title: "Em que ano foi lançado o primeiro filme do Homem de Ferro?",
//       color: "#E81515",
//       answers: [
//         {
//           text: "2008",
//           image:
//             "https://sm.ign.com/ign_br/news/m/marvels-ir/marvels-iron-man-vr-release-date-now-set-for-july-2020_8h12.jpg",
//           isCorrectAnswer: true,
//         },
//         {
//           text: "2010",
//           image:
//             "https://conteudo.imguol.com.br/c/entretenimento/96/2020/08/07/iron-man-1596813808466_v2_615x300.jpg",
//           isCorrectAnswer: false,
//         },
//       ],
//     },
//   ],
//   levels: [
//     {
//       title: "Sabe de nada!",
//       image:
//         "https://referencianerd.com/wp-content/uploads/2020/06/IronManSnapFunkoFeature.jpg",
//       text: "Você precisa maratonar os filmes da Marvel.",
//       minValue: 0,
//     },
//     {
//       title: "Foi por pouco!",
//       image:
//         "https://observatoriodocinema.uol.com.br/wp-content/uploads/2021/02/homem-de-ferro-tony-divulgacao.jpg",
//       text: "Você sabe bastante, mas precisa relembrar algo.",
//       minValue: 32,
//     },
//     {
//       title: "Sabe tudo!",
//       image:
//         "https://static1.cbrimages.com/wordpress/wp-content/uploads/2021/11/Iron-Man-God-Armor-Infinity-Gauntlet.jpg",
//       text: "Você sabe de tudo da Marvel, já pode substituir o Vigia!",
//       minValue: 66,
//     },
//   ],
// };
/* postQuizz(quizz) */
