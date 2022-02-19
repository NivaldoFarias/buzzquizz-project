const QUIZZ_API = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";
let myQuizzes = JSON.parse(localStorage.getItem("quizzes"));
if (!myQuizzes) {
  myQuizzes = [];
}
let myQuizzesId = myQuizzes.map((quizz) => quizz.id);
let apiQuizzes = [];
let quizzImgExists = [];
let quizzTitleExists = [];

let numberOfQuestions = 0;
let moves = 0;
let hits = 0;

let currentQuizz = null;

let quizz = {}

let teste;

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
  document.querySelector("button#create-quizz-btn").addEventListener("click",openCreateQuizzWindow)
  myQuizzesId = myQuizzes.map((quizz) => quizz.id);
  if (checkMyQuizzesOnAPI(myQuizzesId)) {
    renderUserQuizzes();
  }
  renderAllQuizzes(quizzes);
}

function checkMyQuizzesOnAPI(myQuizzesId) {
  // retorna verdadeiro caso exista algum quizz na API salvo no LocalStorage
  // e falso caso contrario
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
    // console.log(quizz);
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
    printQuizz(all_Quizzes, quizz);
  }
}

function printQuizz(quizzesArray, quizz) {
  quizzesArray.innerHTML += `
    <article id="${quizz.id}">
    <img src="${quizz.image}" class="cover" alt="imagem do quizz" />
    <div class="gradient"></div>
    <p>${quizz.title}</p>
    </article>`;
}

function renderUserQuizzes() {
  const user_Quizzes = document.querySelector(".user-quizzes");
  const no_Quizzes = document.querySelector(".no-quizz-available");
  no_Quizzes.classList.add("hidden");
  user_Quizzes.classList.remove("hidden");
  user_Quizzes.innerHTML = `<p>Seus Quizzes</p>
    <ion-icon name="add-circle" id="create-quizz-btn"></ion-icon>`;

  apiQuizzes.forEach((quizz) => {
    if (myQuizzesId.includes(quizz.id)) {
      printQuizz(user_Quizzes, quizz);
    }
  });

  document.querySelector("ion-icon#create-quizz-btn").addEventListener("click",openCreateQuizzWindow)
  const user_QuizzesRenderedes = [
    ...document.querySelectorAll(".user-quizzes article"),
  ];
  user_QuizzesRenderedes.forEach((quizz) => {
    // console.log(quizz);
    quizz.addEventListener("click", selectQuizz);
  });
}

function getQuizz(ID) {
  const promise = axios.get(`${QUIZZ_API}/${ID}`);
  promise.then((response) => console.log(response));
  promise.catch((error) => {
    console.log(error.reponse.status);
  });
}

function postQuizz(quizz) {
  const promise = axios.post(QUIZZ_API, quizz);
  promise.then((response) => {
    console.log(response);

    // guarda o ID e a chave dos Quizzes criados
    // a chave precisa pro bônus
    myQuizzes.push({ id: response.data.id, key: response.data.key });
    localStorage.setItem("quizzes", JSON.stringify(myQuizzes));
    getAllQuizzes();
  });
}

function deleteQuizz(ID) {
  let key = myQuizzes.filter((quizz) => quizz.id == ID)[0].key;
  const promise = axios.delete(`${QUIZZ_API}/${ID}`, {
    headers: { "Secret-Key": key },
  });
  promise.then((response) => console.log(response));
  promise.catch((error) => {
    console.log(error.reponse.status);
  });
}

function selectQuizz() {
  // body
  let firstScreen = document.getElementById("first-screen");
  let secondScreen = document.getElementById("second-screen");
  firstScreen.classList.add("hidden");
  secondScreen.classList.remove("hidden");
  // console.log(this.id);
  // console.log(this);
  secondScreen.innerHTML = "";
  const promise = axios.get(`${QUIZZ_API}/${this.id}`);
  promise.then((response) => {
    renderQuizz(response.data);
    currentQuizz = response.data;
  });
  promise.catch((error) => {
    console.log(error.reponse.status);
  });
}

function renderQuizz(quizz) {
  // console.log(quizz.data);
  numberOfQuestions = quizz.questions.length;
  let secondScreen = document.getElementById("second-screen");
  secondScreen.innerHTML = "";

  secondScreen.innerHTML += `<article>
  <img
  src="${quizz.image}"
  class="cover"
  alt="quizz image"
  />
  <div class="gradient"></div>
  <p>${quizz.title}</p>
  </article>`;
  quizz.questions.forEach(renderQuestion);

  secondScreen.innerHTML += `<section class="quizz-end hidden">
  </section>`;

  secondScreen.innerHTML += `<button class="restart-quizz-btn">Reiniciar Quizz</button>
  <button class="home-btn">Voltar para home</button>`;

  hits = 0;
  moves = 0;

  let home_btn = document.querySelector(".home-btn");
  home_btn.addEventListener("click", () => {
    let firstScreen = document.getElementById("first-screen");
    let secondScreen = document.getElementById("second-screen");
    firstScreen.classList.remove("hidden");
    secondScreen.classList.add("hidden");
  });

  let restartQuizzBtn = document.querySelector(".restart-quizz-btn");
  restartQuizzBtn.addEventListener("click", () => {
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
        ${getAnswers(currentAnswers)}
      </div>
    </section>`;
    if(!["#fff","#ffffff","white"].includes(`${question.color}`.toLowerCase())){
      document.querySelector(`#Q${index + 1}`).style.backgroundColor = `${question.color}`
    } else {
      document.querySelector(`#Q${index + 1}`).style.backgroundColor = "#EC362D"
    }
  // currentAnswers.forEach(renderAnswer);

  // secondScreen.innerHTML += `</div>
  // </section>`;
}

function getAnswers(answers) {
  let content = "";
  for (answer of answers) {
    content += `<figure class="${answer.isCorrectAnswer}">
    <img src="${answer.image}" class='cover' alt="Answer Image" />
    <figcaption>${answer.text}</figcaption>
    <div class="whitish hidden"></div>
    </figure>`;
  }
  return content;
}

function selectAnswer() {
  // body
  // answerFigure.classList
  // console.log(this.parentNode.children);
  let answers = this.parentNode;
  if (!answers.classList.contains("lock")) {
    moves++;
    if (this.classList.contains("true")) {
      hits++;
    }
    answers.classList.add("lock");
    [...answers.children].forEach(answer => {
      if (answer != this) {
        answer.querySelector(".whitish").classList.remove("hidden")
      }
    })
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
          quizzEnd.innerHTML = `<div class="level-title">
          ${value}% de acerto: ${level.title}
          </div>
          <img
          src="${level.image}"
          class="cover"
          alt="level image"
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
      }, 2000);
    } else {
      setTimeout(() => {
        window.scrollBy({
          top: this.parentElement.parentElement.offsetHeight + 24,
          behavior: "smooth",
        });
      }, 2000);
    }
  }
}
// function renderAnswer(answer) {
//   let secondScreen = document.getElementById("second-screen");
//   secondScreen.innerHTML += `<figure>
//   <img src="${answer.image}" alt="Answer Image" />
//   <figcaption>${answer.text}</figcaption>
// </figure>`;
// }

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
function collapseElement() {
  const createQuestions = document.getElementById("create-quizz-2");
  // createQuestions.classList.contains("hidden")
  if (true) {
    toggleCollapsibleElement("create-quizz-3", 430);
    toggleCollapsibleElement("create-quizz-2", 800);
  } else {
  }
}
function toggleCollapsibleElement(elementID, elementHeight) {
  const collapseButtons = Array.from(
    document.querySelectorAll(`#${elementID} .question-btn`)
  );
  const altBtns = Array.from(
    document.querySelectorAll(".input-container ion-icon")
  );

  collapseButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      console.log("eventlistener");
      this.classList.toggle("active");
      const content = this.nextElementSibling;
      if (content.style.height) {
        this.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.1)";
        content.style.height = null;
        content.style.overflow = "hidden";
      } else {
        this.style.boxShadow = "0px -3px 10px rgba(0, 0, 0, 0.1)";
        content.style.height = `${elementHeight}px`;
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

// if (!document.getElementById("third-screen").classList.contains("hidden")) {
  collapseElement();
// }


function openCreateQuizzWindow(){
  let firstScreen = document.getElementById("first-screen");
  let createQuizz1 = document.getElementById("create-quizz-1");
  firstScreen.classList.add("hidden");
  createQuizz1.classList.remove("hidden");
}

let createQuestionsBtn = document.querySelector("#create-quizz-1 button")
createQuestionsBtn.addEventListener("click",openCreateQuestionsWindow)

function openCreateQuestionsWindow () {
  collapseElement()
  teste = parseInt(prompt("teste"))
  let createQuizz1 = document.getElementById("create-quizz-1");
  let createQuizz2 = document.getElementById("create-quizz-2");

  let title = document.querySelector("#create-quizz-1 #title").value;
  let image = document.querySelector("#create-quizz-1 #image").value;
  let numOfQuestions = document.querySelector("#create-quizz-1 #numOfQuestions").value;
  let numOfLevels = document.querySelector("#create-quizz-1 #numOfLevels").value;

  if(title.length<20 || title.length>65){
    alert("Título do quizz: deve ter no mínimo 20 e no máximo 65 caracteres")
  } else if(!validURL(image)){
    alert("URL da Imagem: deve ter formato de URL e ser uma imagem")
  } else if (numOfQuestions < 3){
    alert("Quantidade de perguntas: no mínimo 3 perguntas")
  } else if (numOfLevels < 2){
    alert("Quantidade de níveis: no mínimo 2 níveis")
  } else {
    let questions = [];
    questions.length = numOfQuestions;
    let levels = [];
    levels.length = numOfLevels;
  
    quizz = {title:title,
    image:image,
    questions:questions,
    levels:levels,
    }
  
    createQuizz2.innerHTML = `<p>Crie suas perguntas</p>`
  
    for (let i=0; i<quizz.questions.length; i++){
      createQuizz2.innerHTML += 
      `<article id="QUESTION-${i+1}">
        <div class="question-btn">
          <p>Pergunta ${i+1}</p>
          <ion-icon name="create-outline"></ion-icon>
        </div>
        <div class="input-container">
          <input id="question-title" type="text" placeholder="Texto da pergunta" />
          <input id="question-color" type="text" placeholder="Cor de fundo da pergunta" />
          <p>Resposta correta</p>
          <input id="right-answer-text" type="text" placeholder="Resposta correta" />
          <input id="right-answer-image" type="text" placeholder="URL da imagem" />
          <p>Respostas incorretas</p>
          <div class="incorrect-answer">
            <input id="wrong-answer-text-1" type="text" placeholder="Resposta incorreta 1" />
            <input id="wrong-answer-image-1" type="text" placeholder="URL da imagem 1" />
          </div>
          <div class="incorrect-answer">
            <input id="wrong-answer-text-2" type="text" placeholder="Resposta incorreta 2" />
            <input id="wrong-answer-image-2" type="text" placeholder="URL da imagem 2" />
          </div>
          <div class="incorrect-answer">
            <input id="wrong-answer-text-3"  type="text" placeholder="Resposta incorreta 3" />
            <input id="wrong-answer-image-3" type="text" placeholder="URL da imagem 3" />
          </div>
          <ion-icon name="chevron-up"></ion-icon>
        </div>
      </article>`
    }
  
    createQuizz2.innerHTML += `<button class="restart-quizz-btn">Prosseguir pra criar níveis</button>
    </section>`
  
    if (!document.getElementById("third-screen").classList.contains("hidden")) {
      collapseElement();
    }
    
    let createLevelsBtn = document.querySelector("#create-quizz-2 button")
    createLevelsBtn.addEventListener("click",openCreateLevelsWindow)
    
    setTimeout(() => {
    createQuizz1.classList.add("hidden");
    createQuizz2.classList.remove("hidden");
    console.log(quizz)
    },300)
  }
}

function createQuestionsValidation () {
  // body
  if(teste){
    return true
  }
  for (let i=0; i<quizz.questions.length;i++){
    if(document.querySelector(`#QUESTION-${i+1} #question-title`).value<20){
      alert(`Texto da pergunta ${i+1}: no mínimo 20 caracteres`)
      return false
    } else if (!document.querySelector(`#QUESTION-${i+1} #right-answer-text`).value){
      alert("Texto as resposta correta: não pode estar vazio")
      return false
    } else if (!validURL(document.querySelector(`#QUESTION-${i+1} #right-answer-image`).value)){
      alert("URL da imagem de resposta correta: deve ter formato de URL")
      return false
    } else if (!document.querySelector(`#QUESTION-${i+1} #wrong-answer-text-1`).value){
      alert("Texto da resposta incorreta 1: não pode estar vazio")
      return false
    } else if (!validURL(document.querySelector(`#QUESTION-${i+1} #wrong-answer-image-1`).value)){
      alert("URL das imagem de resposta incorreta 1: deve ter formato de URL")
      return false
    } else if (document.querySelector(`#QUESTION-${i+1} #wrong-answer-text-2`).value && !validURL(document.querySelector(`#QUESTION-${i+1} #wrong-answer-image-2`).value)){
      alert("URL das imagem de resposta incorreta 2: deve ter formato de URL")
      return false
    } else if (document.querySelector(`#QUESTION-${i+1} #wrong-answer-text-3`).value && !validURL(document.querySelector(`#QUESTION-${i+1} #wrong-answer-image-3`).value)){
      alert("URL das imagem de resposta incorreta 3: deve ter formato de URL")
      return false
    } 
  }
  return true
}


function openCreateLevelsWindow () {
  collapseElement()
  if(createQuestionsValidation()){
    console.log("if");
    for (let i=0; i<quizz.questions.length;i++){
      let answers = []
      let rightAnswer = {
        text: document.querySelector(`#QUESTION-${i+1} #right-answer-text`).value,
        image: document.querySelector(`#QUESTION-${i+1} #right-answer-image`).value,
        isCorrectAnswer: true
      }
      answers.push(rightAnswer)
      for (let j=1;j<4;j++){
        let wrongAnswerText = document.querySelector(`#QUESTION-${i+1} #wrong-answer-text-${j}`).value;
        let wrongAnswerImage = document.querySelector(`#QUESTION-${i+1} #wrong-answer-image-${j}`).value
        if(wrongAnswerImage && wrongAnswerImage){
          answers.push({
            text: wrongAnswerText,
            image: wrongAnswerImage,
            isCorrectAnswer: false
          })
        }
      }
      let questionTitle = document.querySelector(`#QUESTION-${i+1} #question-title`).value;
      let questionColor = document.querySelector(`#QUESTION-${i+1} #question-color`).value;
      quizz.questions[i] = {
        title:questionTitle,
        color:questionColor,
        answers:answers
      } 
      }
    console.log(quizz);
    setTimeout(() => {
    let createQuizz2 = document.getElementById("create-quizz-2");
    let createQuizz3 = document.getElementById("create-quizz-3");
    createQuizz2.classList.add("hidden");
    createQuizz3.classList.remove("hidden");
    collapseElement()
    },300)
  } else {
    collapseElement()
  }
}





// postQuizz(quizz);
getAllQuizzes();

//         testes:

// const promise = axios.post(QUIZZ_API, quizz);
// promise.then(getAllQuizzes)
//AllQuizzes;
