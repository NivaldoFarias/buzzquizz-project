const QUIZZ_API = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";
let myQuizzes = JSON.parse(localStorage.getItem("quizzes"));
if (!myQuizzes) {
  myQuizzes = [];
}
let myQuizzesId = myQuizzes.map(quizz => quizz.id);
let apiQuizzes =[]

const quizz = {
  title: "teste 6?",
  image: "https://miro.medium.com/max/1400/1*CT3u9Zejnbzdg36CI5zxDg.jpeg",
  questions: [
    {
      title: "Título da pergunta 1",
      color: "#123456",
      answers: [
        {
          text: "Texto da resposta 1",
          image: "https://http.cat/411.jpg",
          isCorrectAnswer: true,
        },
        {
          text: "Texto da resposta 2",
          image: "https://http.cat/412.jpg",
          isCorrectAnswer: false,
        },
      ],
    },
    {
      title: "Título da pergunta 2",
      color: "#123456",
      answers: [
        {
          text: "Texto da resposta 1",
          image: "https://http.cat/411.jpg",
          isCorrectAnswer: true,
        },
        {
          text: "Texto da resposta 2",
          image: "https://http.cat/412.jpg",
          isCorrectAnswer: false,
        },
      ],
    },
    {
      title: "Título da pergunta 3",
      color: "#123456",
      answers: [
        {
          text: "Texto da resposta 1",
          image: "https://http.cat/411.jpg",
          isCorrectAnswer: true,
        },
        {
          text: "Texto da resposta 2",
          image: "https://http.cat/412.jpg",
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

function getMyQuizzesOnLocalStorage(){
  myQuizzes = JSON.parse(localStorage.getItem("quizzes"));
  if (!myQuizzes) {
    myQuizzes = [];
  }
  return myQuizzes
}

function addQuizzOnLocalStorage(ID,key){
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
    apiQuizzes = response.data
    console.log(response);
    loadQuizzes(apiQuizzes);
  });
}

function loadQuizzes(quizzes) {
  myQuizzesId = myQuizzes.map(quizz => quizz.id);
  if (checkMyQuizzesOnAPI (myQuizzesId)){
    renderUserQuizzes();
  }
  // if (myQuizzes.length >= 1) {
  //   renderUserQuizzes();
  // }
  
  renderAllQuizzes(quizzes);
}

function checkMyQuizzesOnAPI (myQuizzesId) {
  // retorna verdadeiro caso exista algum quizz na API salvo no LocalStorage
  // e falso caso contrario
  let quizzesId = apiQuizzes.map(quizz => quizz.id)
  for (id of quizzesId){
    if ( myQuizzesId.includes(id)){
      return true
    }
  }
  return false
}

function renderAllQuizzes(quizzes) {
  const all_Quizzes = document.querySelector(".all-quizzes");

  all_Quizzes.innerHTML = "<p>Todos os Quizzes</p>";
  quizzes.forEach((quizz, index) => {
    // if (index > 0 && quizz.image !== quizzes[index - 1].image) {
      all_Quizzes.innerHTML += `
      <article>
        <img src="${quizz.image}" alt="imagem do quizz" />
        <div class="gradient"></div>
        <p>${quizz.title}</p>
      </article>`;
    // }
  });
}

function renderUserQuizzes() {
  const user_Quizzes = document.querySelector(".user-quizzes");
  const no_Quizzes = document.querySelector(".no-quizz-available");
  no_Quizzes.classList.add("hidden");
  user_Quizzes.classList.remove("hidden");
  user_Quizzes.innerHTML=`<p>Seus Quizzes</p>
        <ion-icon name="add-circle" id="create-quizz-btn"></ion-icon>`

  apiQuizzes.forEach((quizz) => {
    if(myQuizzesId.includes(quizz.id)){
      user_Quizzes.innerHTML += `
      <article>
        <img src="${quizz.image}" alt="imagem do quizz" />
        <div class="gradient"></div>
        <p>${quizz.title}</p>
      </article>`;
    }
  });
}

function getQuizz(ID) {
  const promise = axios.get(`${QUIZZ_API}/${ID}`);
  promise.then((response) => console.log(response));
}

function createQuizz(quizz) {
  const promise = axios.post(QUIZZ_API, quizz);
  promise.then((response) => {
    console.log(response);

    // guarda o ID e a chave dos Quizzes criados
    // a chave precisa pro bônus
    myQuizzes.push({ id: response.data.id, key: response.data.key });
    localStorage.setItem("quizzes", JSON.stringify(myQuizzes));
    getAllQuizzes()
  });
}

function deleteQuizz(ID) {
  let key = myQuizzes.filter((quizz) => quizz.id == ID)[0].key;
  const promise = axios.delete(`${QUIZZ_API}/${ID}`, {
    headers: { "Secret-Key": key },
  });
  promise.then((response) => console.log(response));
}

// createQuizz(quizz)
// getQuizz(2182);
  // const promise = axios.post(QUIZZ_API, quizz);
  // promise.then(getAllQuizzes())
// getAllQuizzes();
