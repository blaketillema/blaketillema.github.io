const BASE_URL = "https://opentdb.com";

var selectedCategory = localStorage.getItem("category");
var questions = [];
var categoryChanged = false;
var answer = "";

async function getCategories() {
    let request = await fetch(BASE_URL + "/api_category.php").then(r => r.json());
    let categorySelect = document.getElementById("category-select");
    categorySelect.innerHTML = "";
    for(let cat of request.trivia_categories){
        if(selectedCategory === null){
            selectedCategory = cat.id;
        }
        let option = document.createElement("option");
        option.setAttribute("value", cat.id);
        option.innerText = cat.name;
        if(selectedCategory == cat.id){
            option.selected = true;
        }
        categorySelect.appendChild(option);
    }
    categorySelect.disabled = false;
}

function updateCategory() {
    let category = document.getElementById("category-select");
    localStorage.setItem("category", category.value);
    categoryChanged = true;
}

async function getQuestion() {
    if(questions.length > 0 && categoryChanged === false){
        return questions.pop();
    }
    let category = localStorage.getItem("category");
    let request = await fetch(BASE_URL + "/api.php?amount=10&category=" + category).then(r => r.json());
    questions = request.results;
    return questions.pop();
}

async function getQuestions() {
    let question = await getQuestion();
    console.log(question);
    document.getElementById("question").innerHTML = question.question;
    document.getElementById("difficulty").innerHTML = question.difficulty;
    let options = question.incorrect_answers;
    options.push(question.correct_answer);
    options.sort();
    if(question.type === "boolean"){
        options.reverse();
    }
    let ul = document.getElementById("options");
    ul.innerHTML = "";
    for(let opt of options){
        let li = document.createElement("li");
        li.innerHTML = opt;
        ul.appendChild(li);
    }
    document.getElementById("answer").innerHTML = "";
    answer = question.correct_answer;
}

function addEventHandlers() {
    document.getElementById("category-select").onchange = updateCategory;
    document.getElementById("next-question").onclick = getQuestions;
    document.getElementById("reveal-answer").onclick = () => {document.getElementById("answer").innerHTML = answer;};
}

window.onload = async () => {
    await getCategories();
    addEventHandlers();
    await getQuestions();
}
