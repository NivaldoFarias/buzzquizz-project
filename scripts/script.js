const QUIZZ_API = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";
let myQuizzes = JSON.parse(localStorage.getItem("quizzes"));
if (!myQuizzes) {
  myQuizzes = [];
}
let myQuizzesId = myQuizzes.map((quizz) => quizz.id);
let apiQuizzes = [];
let quizzImgExists = [];
let quizzTitleExists = [];

const quizz = {
  title:
    "Só uma pessoa que assistiu todos os filmes da Marvel vai gabaritar esse teste",
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1200px-Marvel_Logo.svg.png",
  questions: [
    {
      title: "Que ator é conhecido pelo seu papel como O Hulk?",
      color: "#123456",
      answers: [
        {
          text: "Mark Ruffalo",
          image:
            "https://ogimg.infoglobo.com.br/in/25320231-3fa-ec0/FT1086A/33973739_Marvels-AvengersAge-Of-UltronHulk-Bruce-Banner-Mark-RuffaloPhFilm-FrameMarvel.jpg",
          isCorrectAnswer: true,
        },
        {
          text: "Vincent D'Onofrio",
          image:
            "https://nerdhits.com.br/wp-content/uploads/2021/11/hulk-1.jpg",
          isCorrectAnswer: false,
        },
      ],
    },
    {
      title: "Qual é o nome do martelo encantado do Thor?",
      color: "#123456",
      answers: [
        {
          text: "Mjölnir",
          image:
            "https://exame.com/wp-content/uploads/2018/10/thor-ragnarok-filme-cultura-vip.jpg",
          isCorrectAnswer: true,
        },
        {
          text: "Mnajas",
          image: "https://mega.ibxk.com.br/2013/11/04/04135704362.jpg",
          isCorrectAnswer: false,
        },
      ],
    },
    {
      title: "Em que ano foi lançado o primeiro filme do Homem de Ferro?",
      color: "#123456",
      answers: [
        {
          text: "2008",
          image:
            "https://sm.ign.com/ign_br/news/m/marvels-ir/marvels-iron-man-vr-release-date-now-set-for-july-2020_8h12.jpg",
          isCorrectAnswer: true,
        },
        {
          text: "2010",
          image:
            "https://conteudo.imguol.com.br/c/entretenimento/96/2020/08/07/iron-man-1596813808466_v2_615x300.jpg",
          isCorrectAnswer: false,
        },
      ],
    },
  ],
  levels: [
    {
      title: "Título do nível 1",
      image: "https://http.cat/411.jpg",
      text: "Descrição do nível 1",
      minValue: 0,
    },
    {
      title: "Título do nível 2",
      image: "https://http.cat/412.jpg",
      text: "Descrição do nível 2",
      minValue: 50,
    },
  ],
};

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

// function updateLocalStorage(quizzes){
//   let myQuizzesId = myQuizzes.map(quizz => quizz.id)
//   myQuizzes =[]
//   const promise = axios.get(QUIZZ_API);
//   promise.then(response => {
//     response.data.forEach(quizz => {
//       if ()
//     })
//   })

// }

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
  myQuizzesId = myQuizzes.map((quizz) => quizz.id);
  if (checkMyQuizzesOnAPI(myQuizzesId)) {
    renderUserQuizzes();
  }
  // if (myQuizzes.length >= 1) {
  //   renderUserQuizzes();
  // }

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

function createQuizz(quizz) {
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
  let firstScreen = document.querySelector(".first-screen");
  let secondScreen = document.querySelector(".second-screen");
  firstScreen.classList.add("hidden");
  secondScreen.classList.remove("hidden");
  console.log(this.id);
  const promise = axios.get(`${QUIZZ_API}/${this.id}`);
  promise.then(renderQuizz);
  promise.catch((error) => {
    console.log(error.reponse.status);
  });
}

function renderQuizz(quizz) {
  console.log(quizz.data);
  let secondScreen = document.querySelector(".second-screen");
  secondScreen.innerHTML = "";
  secondScreen.innerHTML += `<figure class="second-screen">
  <img
    src="${quizz.data.image}"
    class="cover"
    alt="image displaying landscape view of hogwarts"
  />
  <div class="gradient"></div>
  <p>${quizz.data.title}</p>
</figure>`;

  quizz.data.questions.forEach(renderQuestion);

  secondScreen.innerHTML += `<button class="restart-quizz-btn second-screen">Reiniciar Quizz</button>
  <button class="home-btn second-screen">Voltar para home</button>`;

  let home_btn = document.querySelector(".home-btn.second-screen");
  home_btn.addEventListener("click", () => {
    let firstScreen = document.querySelector("");
    let secondScreen = document.querySelector(".second-screen");
    firstScreen.classList.remove("hidden");
    secondScreen.classList.add("hidden");
  });
}

function renderQuestion(question) {
  // body
  let secondScreen = document.querySelector(".second-screen");
  secondScreen.innerHTML += `<section class="quizz-question second-screen">
  <div class="question" id="Q1">
    ${question.title}
  </div>
  <div class="answers">`;

  let currentAnswers = question.answers;
  currentAnswers.sort(() => Math.random() - 0.5);

  currentAnswers.forEach(renderAnswer);

  secondScreen.innerHTML += `</div>
  </section>`;
}

function renderAnswer(answer) {
  let secondScreen = document.querySelector(".second-screen");
  secondScreen.innerHTML += `<figure>
  <img src="${answer.image}" alt="Answer Image" />
  <figcaption>${answer.text}</figcaption>
</figure>`;
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

//createQuizz(quizz);
getAllQuizzes();

//         testes:

// const promise = axios.post(QUIZZ_API, quizz);
// promise.then(getAllQuizzes)

// setTimeout(() => {
//   const all_Quizzes = [...document.querySelectorAll(".all-quizzes article")];
//   all_Quizzes.forEach(quizz => {
//     // console.log(quizz);
//     quizz.addEventListener("click",selectQuizz)
//   })
// },3000)
//AllQuizzes;
