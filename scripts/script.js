const QUIZZ_API = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";
let myQuizzes = JSON.parse(localStorage.getItem("quizzes"));
if (!myQuizzes){
    myQuizzes=[]
}
let quizz = {
	title: "Título do quizz",
	image: "https://http.cat/411.jpg",
	questions: [
		{
			title: "Título da pergunta 1",
			color: "#123456",
			answers: [
				{
					text: "Texto da resposta 1",
					image: "https://http.cat/411.jpg",
					isCorrectAnswer: true
				},
				{
					text: "Texto da resposta 2",
					image: "https://http.cat/412.jpg",
					isCorrectAnswer: false
				}
			]
		},
		{
			title: "Título da pergunta 2",
			color: "#123456",
			answers: [
				{
					text: "Texto da resposta 1",
					image: "https://http.cat/411.jpg",
					isCorrectAnswer: true
				},
				{
					text: "Texto da resposta 2",
					image: "https://http.cat/412.jpg",
					isCorrectAnswer: false
				}
			]
		},
		{
			title: "Título da pergunta 3",
			color: "#123456",
			answers: [
				{
					text: "Texto da resposta 1",
					image: "https://http.cat/411.jpg",
					isCorrectAnswer: true
				},
				{
					text: "Texto da resposta 2",
					image: "https://http.cat/412.jpg",
					isCorrectAnswer: false
				}
			]
		}
	],
	levels: [
		{
			title: "Título do nível 1",
			image: "https://http.cat/411.jpg",
			text: "Descrição do nível 1",
			minValue: 0
		},
		{
			title: "Título do nível 2",
			image: "https://http.cat/412.jpg",
			text: "Descrição do nível 2",
			minValue: 50
		}
	]
}


function getAllQuizzes () {
    const promise = axios.get(QUIZZ_API);
    promise.then(response => console.log(response));
}

function getQuizz (ID){
    const promise = axios.get(`${QUIZZ_API}/${ID}`);
    promise.then(response => console.log(response));
}

function createQuizz (quizz) {
    const promise = axios.post(QUIZZ_API,quizz)
    promise.then(response => {
        console.log(response)

        // guarda o ID e a chave dos Quizzes criados
        // a chave precisa pro bônus
        myQuizzes.push({id: response.data.id,
        key: response.data.key})
        localStorage.setItem("quizzes",JSON.stringify(myQuizzes))
    });
}

function deleteQuizz (ID) {
    let key=myQuizzes.filter(quizz => quizz.id==ID)[0].key;
    const promise = axios.delete(`${QUIZZ_API}/${ID}`,
    {headers: {'Secret-Key' : key}});
    promise.then(response => console.log(response))
}

// createQuizz(quizz)
getAllQuizzes();
getQuizz(2182);