//GLOBAL section

// let animals = ['cat', 'duck', 'frog', 'pig', 'bunny', 'horse', 'goat', 'turkey', 'dog', 'cow', 'rat', 'rooster'];
let animals = ['krocan', 'myš', 'kohoutek', 'kráva','kůň', 'prasátko', 'králík', 'kačka', 'kozel', 'kočka', 'pes', 'žába'];
let IMG_PATH = "png/SoundClickGameAssets/";
let SOUND_PATH = "sounds/";

let MAX_ANIMALS = localStorage.getItem('MAX_ANIMALS');
let MAX_ROUNDS = localStorage.getItem('MAX_ROUNDS');
let INFINITY_GAME = JSON.parse(localStorage.getItem('INFINITY_GAME'));
//pokrok obtiznosti/win streak complexity [true/false]
let COMPLEXITY_INC = JSON.parse(localStorage.getItem('COMPLEXITY_INC'));

const overlay = document.getElementById('myModal');
const closeButton = document.createElement('span');
const contentDiv = document.createElement('div');

// const overlayEnd = document.getElementById('overlayEnd');
const overlayEnd = document.getElementById('modalEndGame');
const buttonContainer = document.createElement('div');
const restartButton = document.createElement('button');
const menuButtonOv = document.createElement('button');
// const contentDivEnd = document.createElement('div');
const contentDivEnd = document.getElementById('modalEndGameContent');
const textPEndGameModal = document.getElementById('modalText123');



function createOverlay(){
    contentDiv.classList.add('message');
    overlay.appendChild(contentDiv);
    // closeButton.addEventListener('click', hideOverlay);
}

function createEndGameOverlay(){
    buttonContainer.classList.add('button-container');
    buttonContainer.classList.add('button-container-modal');

    menuButtonOv.textContent = 'Zpět do menu';
    restartButton.textContent = 'Hrát znovu';

    // menuButtonOv.classList.add('end_button');
    // restartButton.classList.add('end_button');
    menuButtonOv.classList.add('modal-button'); // Добавляем класс для стилизации
    restartButton.classList.add('modal-button'); // Добавляем класс для стилизации

    buttonContainer.appendChild(menuButtonOv);
    buttonContainer.appendChild(restartButton);

    // contentDivEnd.classList.add('message');
    // overlayEnd.appendChild(contentDivEnd)
    contentDivEnd.appendChild(buttonContainer);

    // overlayEnd.appendChild(buttonContainer);

    //listeners
    menuButtonOv.addEventListener('click', returnMenu);
    restartButton.addEventListener("click", restartGame)
}
function endGame(){
    overlayEnd.style.display = 'block';
}
function closeEndGame(){
    overlayEnd.style.display = 'none';
}
function returnMenu(){
    location.reload();
}
function showOverlay(text) {
    // overlay.style.display = 'block';
    // contentDiv.innerHTML = text;
    // setTimeout(hideOverlay,2000)
    var modalText = document.getElementById("modalText");
    let parent;
    modalText.textContent = text; // Устанавливаем текст модального окно

    overlay.style.display = "block";
    var closeElement = document.querySelector('.close');
    parent = closeElement.parentNode;
    if (closeElement) {
        parent.removeChild(closeElement);
        // parent.style.display = 'none'
    }
    setTimeout(hideOverlay,2000);
    setTimeout(() => {parent.insertBefore(closeElement, modalText)}, 2000);
}

function hideOverlay() {
    overlay.style.display = 'none';
}

//class representing animal cell
class cellClass{
    constructor(name, image, sound){
        this.name = name;
        this.displayed = false;
        this.image = image;
        this.sound = sound;
    }

    setDisplayed(flag){
        this.displayed = flag;
    }
    getName(){
        return this.name;
    }
    getImage(){
        return this.image;
    }
    getSound(){
        return this.sound;
    }

    playSound() {
        const sound = new Audio(this.getSound());
        sound.play();
    }
}

//LOCAL section
let ROUNDS_PLAYED = 0;
let WIN_STREAK = 0;
let LOOSE_STREAK = 0;
let play_animals = animals.slice(0,MAX_ANIMALS);
let total_attempts = 0;
let success_attempts= 0;
let cell_selection =[]; //select
let cell_highlight; // main

let highlightCell = document.createElement('div');
let select_section = document.getElementById('select_section');
let main_section = document.getElementById('main_section');


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
function createHighlight(){
    cell_highlight = null;
    shuffleArray(animals);
    let randomIndex = Math.floor(Math.random() * play_animals.length);
    // const image = addImage(play_animals[randomIndex]);
    const image = addImage("unknown");
    cell_highlight = new cellClass(play_animals[randomIndex],  image, SOUND_PATH + play_animals[randomIndex] + ".mp3");
}
function createSelection(){
    cell_selection = play_animals.map((cellName) => {
        const image = addImage(cellName);
        image.classList.add('anim_img')
        return new cellClass(cellName, image);
    });

    shuffleArray(cell_selection);
}
function createCells() {
    createHighlight();
    createSelection();
}
function addImage(name){
    let img = document.createElement("img");
    img.src = IMG_PATH + name + ".png";
    return img;
}
function playSoundGame() {
    highlightCell = document.createElement('div');
    highlightCell.classList.add('cell');

    const image = cell_highlight.getImage(); //creating a black view of guessing animal
    image.classList.toggle('blackout');
    image.classList.add('anim_img');

    highlightCell.appendChild(image); // getting an image of guessing animal
    main_section.appendChild(highlightCell);
    cell_highlight.setDisplayed(true);

    //click = sound
    highlightCell.addEventListener('click', function() {
        cell_highlight.playSound();
    });

    // Placing select animals
    for(let i = 0; i < MAX_ANIMALS; i++){
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.classList.add('select_img');
        cell.setAttribute("data-animal",cell_selection[i].getName());
        // cell.textContent = cell_selection[i].getName();
        cell.appendChild(cell_selection[i].getImage());
        select_section.appendChild(cell);
        cell_selection[i].setDisplayed(true);
        cell_selection[i].selected = false;
        cell_selection[i].element = cell;

        // choose listener then true/false logic, reset only for correct answer
        cell.addEventListener('click', function() {
            total_attempts++;
            if(cell_selection[i].getName() === cell_highlight.getName()){
                success_attempts++;
                LOOSE_STREAK = 0;
                WIN_STREAK++
                showOverlay("Ano! Je to " + cell_selection[i].getName() + "!");
                endGameValidator();
            } else {
                WIN_STREAK = 0;
                LOOSE_STREAK++;


                if(LOOSE_STREAK % 3 == 0 && LOOSE_STREAK != 0){
                    MAX_ANIMALS--;
                }
                showOverlay("Ne, zkus' ještě jednou.");
            }
        });
    }
}
function winStreakValidator(){
    if (WIN_STREAK % 3 == 0 && COMPLEXITY_INC && MAX_ANIMALS < 5){
        MAX_ANIMALS++;
    }
    // if (LOOSE_STREAK % 3 == 0 && COMPLEXITY_INC && MAX_ANIMALS < 5){
    //     MAX_ANIMALS--;
    // }
    play_animals = animals.slice(0,MAX_ANIMALS);
}

function getCellElements() {
    const selectSection = document.getElementById('select_section');
    const cellElements = selectSection.querySelectorAll('.cell');
    return Array.from(cellElements);
}
function activateCheatClass(el) {
    el.classList.toggle('cheats');
}
function guessHelper(){
    let cells = getCellElements();
    cells.forEach(el => {
        if (el.getAttribute("data-animal") === cell_highlight.getName()){
            setTimeout(function() {
                activateCheatClass(el);
            }, 4000)
            activateCheatClass(el);
        }
    });
}
function endGameValidator(){
    ROUNDS_PLAYED++;
    if(ROUNDS_PLAYED == MAX_ROUNDS && !INFINITY_GAME ){
        hideOverlay();
        // contentDivEnd.innerHTML = 'Skvělá hra, drahá!\n' + "Vaše skóre je: " + success_attempts + "/" + total_attempts;
        textPEndGameModal.textContent = 'Skvělá hra, drahá!\n' + "Vaše skóre je: " + success_attempts + "/" + total_attempts;
        endGame();
        ROUNDS_PLAYED = 0;
        WIN_STREAK = 0;
        LOOSE_STREAK = 0;
    }else{
        continueGame();
    }
}
function restartGame(){
    //close end overlay
    closeEndGame();

    //returning styles of guessing animal
    const image = cell_highlight.getImage();
    image.classList.toggle('blackout');

    //local game stats to zero
    total_attempts = 0;
    success_attempts = 0;
    WIN_STREAK = 0;
    LOOSE_STREAK = 0;
    ROUNDS_PLAYED = 0;
    MAX_ANIMALS = localStorage.getItem('MAX_ANIMALS');
    play_animals = animals.slice(0,MAX_ANIMALS);
    cell_selection = [];
    cell_highlight = null;

    // clearing sections
    main_section.innerHTML = '';
    select_section.innerHTML = '';

    createCells();

    // new round representing
    playSoundGame();
}


function continueGame(){
    //returning styles of guessing animal
    // const image = cell_highlight.getImage();
    // image.classList.toggle('blackout');

    const image = addImage("unknown");
    image.classList.toggle('blackout');

    // clearing sections
    main_section.innerHTML = '';
    select_section.innerHTML = '';

    //check player's win streak
    winStreakValidator();


    // shuffle arr cells
    shuffleArray(cell_selection);
    createCells();

    // new round representing
    playSoundGame();
}


//starting game
createEndGameOverlay();
createOverlay();
createCells();
playSoundGame();


