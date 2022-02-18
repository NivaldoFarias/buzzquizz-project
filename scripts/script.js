const QUIZZ_API = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";
let myQuizzes = JSON.parse(localStorage.getItem("quizzes"));
if (!myQuizzes) {
  myQuizzes = [];
}
let myQuizzesId = myQuizzes.map((quizz) => quizz.id);
let apiQuizzes = [];
let quizzImgExists = [];
let quizzTitleExists = [];

let numberOfQuestions = 0
let moves = 0
let hits = 0

let currentQuizz = null

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
      title: "Sabe de nada!",
      image: "https://referencianerd.com/wp-content/uploads/2020/06/IronManSnapFunkoFeature.jpg",
      text: "Você precisa maratonar os filmes da Marvel.",
      minValue: 0,
    },
    {
      title: "Quase lá!",
      image: "https://observatoriodocinema.uol.com.br/wp-content/uploads/2021/02/homem-de-ferro-tony-divulgacao.jpg",
      text: "Você sabe bastante, mas precisa relembrar algo.",
      minValue: 32,
    },
    {
      title: "Sabe tudo!",
      image: "https://static1.cbrimages.com/wordpress/wp-content/uploads/2021/11/Iron-Man-God-Armor-Infinity-Gauntlet.jpg",
      text: "Você sabe de tudo da Marvel, já pode substituir o Vigia!",
      minValue: 66,
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
  localStorage.clear()
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
  let firstScreen = document.getElementById("first-screen");
  let secondScreen = document.getElementById("second-screen");
  firstScreen.classList.add("hidden");
  secondScreen.classList.remove("hidden");
  // console.log(this.id);
  // console.log(this);
  secondScreen.innerHTML = ""
  const promise = axios.get(`${QUIZZ_API}/${this.id}`);
  promise.then(response => {
                renderQuizz(response.data);
                currentQuizz = response.data
              });
  promise.catch((error) => {
    console.log(error.reponse.status);
  });
}

function renderQuizz(quizz) {
  // console.log(quizz.data);
  numberOfQuestions = quizz.questions.length
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
  </article>`
  quizz.questions.forEach(renderQuestion);
  
  secondScreen.innerHTML += `<section class="quizz-end hidden">
  </section>`
  
  secondScreen.innerHTML += `<button class="restart-quizz-btn">Reiniciar Quizz</button>
  <button class="home-btn">Voltar para home</button>`;

  hits = 0
  moves = 0
  
  let home_btn = document.querySelector(".home-btn");
  home_btn.addEventListener("click", () => {
    let firstScreen = document.getElementById("first-screen");
    let secondScreen = document.getElementById("second-screen");
    firstScreen.classList.remove("hidden");
    secondScreen.classList.add("hidden");
  });

  let restartQuizzBtn = document.querySelector(".restart-quizz-btn");
  restartQuizzBtn.addEventListener("click",() => {
                                    renderQuizz(currentQuizz)
                                    window.scrollTo({
                                      top:0,
                                      behavior: 'smooth',
                                    })
                                  })


  const all_AnswersRenderedes = [
    ...document.querySelectorAll("figure"),
  ];
  all_AnswersRenderedes.forEach((answer) => {
    answer.addEventListener("click", selectAnswer);
  });
}



function renderQuestion(question,index) {
  let currentAnswers = question.answers;
  currentAnswers.sort(() => Math.random() - 0.5);
  
  let secondScreen = document.getElementById("second-screen");
  secondScreen.innerHTML += `<section class="quizz-question">
  <div class="question" id="Q${index+1}">
  ${question.title}
  </div>
  <div class="answers">
  ${getAnswers(currentAnswers)}
  </div>
  </section>`;
  
  // currentAnswers.forEach(renderAnswer);
  
  // secondScreen.innerHTML += `</div>
  // </section>`;
}

function getAnswers (answers) {
  let content=''
  for (answer of answers ){
    content+=`<figure class="${answer.isCorrectAnswer}">
    <img src="${answer.image}" alt="Answer Image" />
    <figcaption>${answer.text}</figcaption>
    </figure>`;
  }
  return content
}

function selectAnswer () {
  // body
  // answerFigure.classList
  // console.log(this);
  let answers = this.parentNode
  if (!answers.classList.contains("lock")){
    moves++
    if (this.classList.contains("true")){
      hits++
    }
    answers.classList.add("lock")
    this.style.border = "thick solid #000000";
    let rightAnswer = answers.querySelector(".true")
    rightAnswer.querySelector("figcaption").style.color = "green"
    let wrongAnswers = [...answers.querySelectorAll(".false")]
    wrongAnswers.forEach(answer => answer.querySelector("figcaption").style.color = "red");

    if(numberOfQuestions==moves){
      console.log("acabou");
      let value = Math.round((hits/numberOfQuestions)*100);
      let levels = currentQuizz.levels
      levels.sort()
      let quizzEnd = document.querySelector(".quizz-end");
      levels.forEach(level => {
        if (value >= level.minValue){
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
          </p>`
        }
      })
      quizzEnd.classList.remove("hidden")
      setTimeout(()=> {
        console.log("acabou");
        window.scrollTo(
          {
            top:document.body.scrollHeight,
            behavior:"smooth",
          }
        )
      },2000)
    }else{
      setTimeout(() => {
      window.scrollBy({
      top:460,
      behavior:"smooth"}
      )
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

// createQuizz(quizz);
getAllQuizzes();

//         testes:

// const promise = axios.post(QUIZZ_API, quizz);
// promise.then(getAllQuizzes)
//AllQuizzes;