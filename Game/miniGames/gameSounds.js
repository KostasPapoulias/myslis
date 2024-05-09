//GLOBAL section
let animals = ['krocan', 'myš', 'kohout', 'kráva','kůň', 'prase', 'králík', 'kachna', 'koza', 'kočka', 'pes', 'žába'];
let IMG_PATH = "png/SoundClickGameAssets/";
let SOUND_PATH = "sounds/";

let MAX_ANIMALS = localStorage.getItem('MAX_ANIMALS');
let MAX_ROUNDS = localStorage.getItem('MAX_ROUNDS');
let INFINITY_GAME = JSON.parse(localStorage.getItem('INFINITY_GAME'));

//win streak complexity [true/false]
let COMPLEXITY_INC = JSON.parse(localStorage.getItem('COMPLEXITY_INC'));

const overlay = document.getElementById('myModal');
const closeButton = document.createElement('span');
const contentDiv = document.createElement('div');

const overlayEnd = document.getElementById('modalEndGame');
const buttonContainer = document.createElement('div');
const restartButton = document.createElement('button');
const menuButtonOv = document.createElement('button');
const contentDivEnd = document.getElementById('modalEndGameContent');
const textPEndGameModal = document.getElementById('modalText123');


/**
 * creates contentDiv and appends it to overlay
 */
function createOverlay(){
    contentDiv.classList.add('message');
    overlay.appendChild(contentDiv);
}
/**
 * displays on the screen options for reset or return to menu
 * creates buttonContainer, menuButtonOv, restartButton
 * handles menuButtonOv, restartButton, contentDivEnd
 */
function createEndGameOverlay(){
    buttonContainer.classList.add('button-container');
    buttonContainer.classList.add('button-container-modal');

    menuButtonOv.textContent = 'Zpět do menu';
    restartButton.textContent = 'Hrát znovu';

    menuButtonOv.classList.add('modal-button');
    restartButton.classList.add('modal-button');

    buttonContainer.appendChild(menuButtonOv);
    buttonContainer.appendChild(restartButton);

    contentDivEnd.appendChild(buttonContainer);

    //listeners
    menuButtonOv.addEventListener('click', returnMenu);
    restartButton.addEventListener("click", restartGame)
}
/**
 * appears the overlayEnd div
 */
function endGame(){
    overlayEnd.style.display = 'block';
}
/**
 * hides the overlayEnd div
 */
function closeEndGame(){
    overlayEnd.style.display = 'none';
}
/**
 * reloads the page and returns to main manu
 */
function returnMenu(){
    location.reload();
}
/**
 * displays the message after each play on the screen
 * creates overlay for 2000ms and then removes it
 * @param text is the given text to be displayed on the screen
 */
function showOverlay(text) {
    var modalText = document.getElementById("modalText");
    let parent;
    modalText.textContent = text; // Устанавливаем текст модального окно

    document.body.style.overflow = 'hidden';

    overlay.style.display = "block";
    var closeElement = document.querySelector('.close');
    parent = closeElement.parentNode;
    if (closeElement) {
        parent.removeChild(closeElement);
    }
    setTimeout(hideOverlay,2000);
    setTimeout(() => {parent.insertBefore(closeElement, modalText)}, 2000);
    var speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.lang = 'cs-CZ';
    window.speechSynthesis.speak(speech);
}
/**
 * hides the overlay
 */
function hideOverlay() {
    overlay.style.display = 'none';
}
/**
 * Class that contains the name, side, image, displayed for each animal and half animal
 * and methods setDisplayed, getName, getImage, getSound, playSound
 * class representing animal cell
 */
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

/**
 * shuffles the given array
 * @param array
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * annihilate cell_highlight
 * calls shuffleArray
 * initialize image with unknown
 * fills the cell_highlight array with cellClass elements randomly with image and sound
 */
function createHighlight(){
    cell_highlight = null;
    shuffleArray(animals);
    let randomIndex = Math.floor(Math.random() * play_animals.length);
    const image = addImage("unknown");
    cell_highlight = new cellClass(play_animals[randomIndex],  image, SOUND_PATH + play_animals[randomIndex] + ".mp3");
}

/**
 * fills the cell_selection array with cellClass elements initialized with images
 * calls shuffleArray
 */
function createSelection(){
    cell_selection = play_animals.map((cellName) => {
        const image = addImage(cellName);
        image.classList.add('anim_img')
        return new cellClass(cellName, image);
    });

    shuffleArray(cell_selection);
}

/**
 * calls createHighlight and createSelection
 */
function createCells() {
    createHighlight();
    createSelection();
}

/**
 * @param name of the cell
 * @returns the path of the image
 */
function addImage(name){
    let img = document.createElement("img");
    img.src = IMG_PATH + name + ".png";
    return img;
}

/**
 * creates highlightCell
 * initializes the image
 * displays the image on main_selection
 * initializes each element of highlightCell with the click function
 * initializes the cell_selection array
 * adds to each cell_selection element the click function
 *
 * click called:
 * total_attempts increased, success_attempts increased, LOOSE_STREAK initialized, WIN_STREAK increased
 * showOverlay called with message
 * endGameValidator called
 * else
 * WIN_STREAK initialized, LOOSE_STREAK increased, MAX_ANIMALS decreased under circumstances
 * showOverlay called with message
 */
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
                showOverlay("Ano! Tohle je " + cell_selection[i].getName() + "!");
                endGameValidator();
            } else {
                WIN_STREAK = 0;
                LOOSE_STREAK++;


                if(LOOSE_STREAK % 3 === 0 && LOOSE_STREAK !== 0){
                    MAX_ANIMALS--;
                }
                showOverlay("Ne, zkus' ještě jednou.");
            }
        });
    }
}

/**
 * checks if COMPLEXITY_INC is activated and increases MAX_ANIMALS
 * updates the play_animals array
 */
function winStreakValidator(){
    if (WIN_STREAK % 3 === 0 && COMPLEXITY_INC && MAX_ANIMALS < 6){
        MAX_ANIMALS++;
    }
    play_animals = animals.slice(0,MAX_ANIMALS);
}

/**
 * finds and returns the elements that exists in the select section
 * @returns {Element[]}
 */
function getCellElements() {
    const selectSection = document.getElementById('select_section');
    const cellElements = selectSection.querySelectorAll('.cell');
    return Array.from(cellElements);
}
function activateCheatClass(el) {
    el.classList.toggle('cheats');
}
/**
 * Toggles the correct answer div for 4000ms
 */
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
/**
 * calls hideOverlay
 * check if game should be terminated
 * displays message to the screen by overriding textPEndGameModal or resets it if INFINITY_GAME is selected
 * initialized ROUND_PLAYED, WIN_STREAK and LOOSE_STREAK
 * or calls continueGame to continue the game
 */
function endGameValidator(){
    ROUNDS_PLAYED++;
    if(ROUNDS_PLAYED === MAX_ROUNDS && !INFINITY_GAME ){
        hideOverlay();
        textPEndGameModal.textContent = 'Skvělá hra, drahá!\n' + "Vaše skóre je: " + success_attempts + "/" + total_attempts;
        endGame();
        ROUNDS_PLAYED = 0;
        WIN_STREAK = 0;
        LOOSE_STREAK = 0;
    }else{
        continueGame();
    }
}

/**
 * calls closeEndGame
 * initializes the image to the cell_highlight
 * this function resets the game and all the variables
 * initializes the main_section and select_section with no text
 * calls createCells
 * calls playSoundGame
 */
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

/**
 * this function resets only the necessary variables
 * initializes the image to unknown
 * initializes the main_section and select_section with no text
 * calls winStreakValidator
 * calls shuffleArray
 * calls createCells
 * calls playSoundGame
 */
function continueGame(){
    //returning styles of guessing animal

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


