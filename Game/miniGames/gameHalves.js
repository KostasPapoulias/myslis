let dragNdrop = (localStorage.getItem('GAME_ID') == 'button2');
let animals = ['krocan', 'myš', 'kohoutek', 'kráva', 'kůň', 'prasátko', 'králík', 'kačka', 'kozel', 'kočka', 'pes', 'žába'];
let IMG_PATH = "png/animalHalfs/";
let MAX_ANIMALS = localStorage.getItem('MAX_ANIMALS');
let MAX_ROUNDS = localStorage.getItem('MAX_ROUNDS');
let INFINITY_GAME = JSON.parse(localStorage.getItem('INFINITY_GAME'));
let COMPLEXITY_INC = JSON.parse(localStorage.getItem('COMPLEXITY_INC'));

//show result on screen
const contentDiv = document.createElement('div');

const overlayEnd = document.getElementById('modalEndGame');
const buttonContainer = document.createElement('div');
const restartButton = document.createElement('button');
const menuButtonOv = document.createElement('button');
const contentDivEnd = document.getElementById('modalEndGameContent');
const textPEndGameModal = document.getElementById('modalText123');

let overlay = document.getElementById("myModal");

function createOverlay(){
    contentDiv.classList.add('message');
    overlay.appendChild(contentDiv);
}
function createEndGameOverlay(){
    buttonContainer.classList.add('button-container-modal');
    menuButtonOv.textContent = 'Return to Menu';
    restartButton.textContent = 'Play Again!';

    menuButtonOv.classList.add('modal-button');
    restartButton.classList.add('modal-button');

    buttonContainer.appendChild(menuButtonOv);
    buttonContainer.appendChild(restartButton);

    contentDivEnd.appendChild(buttonContainer);


    //listeners
    menuButtonOv.addEventListener('click', returnMenu);
    restartButton.addEventListener("click", reset)
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
    let modalText = document.getElementById("modalText");
    let parent;

    modalText.textContent = text; // Устанавливаем текст модального окно

    overlay.style.display = "block";
    let closeElement = document.querySelector('.close');
    parent = closeElement.parentNode;
    if (closeElement) {
        parent.removeChild(closeElement);
    }
    setTimeout(hideOverlay,2000);
    setTimeout(() => {parent.insertBefore(closeElement, modalText)}, 2000);
}
function hideOverlay() {
    overlay.style.display = 'none';
}

class cellClass{
    constructor(name, side, image){
        this.name = name;
        this.side = side;
        this.displayed = false;
        this.image = image;
    }

    // displayed variable for
    // cell_highlight is used to declare if the cell is displayed at least once
    // cell_selection is used to declare if the cell should be displayed on the screen
    setDisplayed(flag){
        this.displayed = flag;
    }
    getDisplayed(){
        return this.displayed;
    }
    getName(){
        return this.name;
    }
    getSide(){
        return this.side;
    }
    getImage(){
        return this.image;
    }
}

//      LOCAL
let total_attempts = 0;
let success_attempts= 0;
let ROUNDS_PLAYED = 0;
let WIN_STREAK = 0;
let guessedAnimals = 0;

let cell_selection =[]; //animals that exists in the select section
let cell_highlight =[]; //animals that exists in the highlight section
shuffleArray(animals);
let cell1 = animals.slice(0, MAX_ANIMALS); //cell_selection
let cell2 = animals.slice(0, MAX_ANIMALS); //cell_highlight

let highlightCell = document.createElement('div'); //this variable is used to display the highlight image and as a parent
let rightInnerDiv; //displays the image from the dragged cell
let leftInnerDiv; //displays the highlight
let newDiv; //child of highlightCell and parent of rightInnerDiv and leftInnerDiv
let tempName; //stores the name of the highlightCell

let selectedCellName; //stores the name of selected cell
let select_section = document.getElementById('select_section');
let main_section = document.getElementById('main_section');
leftInnerDiv = document.createElement('div'); // leftInnerDiv contains the image of the highlightCell
leftInnerDiv.classList.add('cell');

leftInnerDiv.addEventListener('dragover', dragOver);
leftInnerDiv.addEventListener('dragenter', dragEnter);
leftInnerDiv.addEventListener('drop', drop);

rightInnerDiv = document.createElement('div'); // rightInnerDiv contains the image of the dragged cell from the select section
rightInnerDiv.classList.add('cell');

rightInnerDiv.addEventListener('dragover', dragOver);
rightInnerDiv.addEventListener('dragenter', dragEnter);
rightInnerDiv.addEventListener('drop', drop);

newDiv = document.createElement('div'); // newDiv contains the leftInnerDiv and the RightInnerDiv

rightInnerDiv.style.margin = "0px" ;
leftInnerDiv.style.margin = "0px" ;
rightInnerDiv.style.marginBottom = "10px" ;
leftInnerDiv.style.marginBottom = "10px" ;



function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * creates an instance of cellClass for each cell and stores it in cell_highlight or cell_selection
 */
function createCells() {
    cell_highlight = []
    let i = 0;
    cell1.forEach((cellName) => {
        const image = addImage(cellName, 1);
        cell_highlight[i] = new cellClass(cellName, 1, image);
        i++;
    });
    cell_selection = []
    i = 0;
    cell2.forEach((cellName) => {
        const image = addImage(cellName, 2);
        cell_selection[i] = new cellClass(cellName, 2, image);
        i++;
    });

    shuffleArray(cell_selection);
    shuffleArray(cell_highlight);
}

/**
 * @param name of the cell
 * @param side of the cell 1(front) or 2(back).
 * @returns the path of the image
 */
function addImage(name, side){
    let img = document.createElement("img");
    img.src = IMG_PATH + name + side + ".png" ;
    img.classList.add('anim_img1')

    // img = imageResize(name, side, img);
    return img;
}

/**
 * when the drag starts the selectCellName gets the textContext of the div in the select section
 * @param event
 */
function dragStart(event) {

    const cellDiv = event.target.closest('.cell');
    if (cellDiv) {
        event.dataTransfer.setData('text/plain', cellDiv.textContent.trim());
        
        selectedCellName = cellDiv.textContent.trim();

    }
}

function dragOver(event) {
    event.preventDefault();
}

added = false;

/**
 * when the dragged cell from select section enters the highlightCell, the highlightCell hides and the newDiv appears
 * @param event
 */
function dragEnter(event) {
    event.preventDefault();

    if(selectedCellName == null || selectedCellName=="") return;

     if (!added) {
        tempName = highlightCell.textContent;
        leftInnerDiv.textContent = tempName;
        leftInnerDiv.appendChild(addImage(tempName, 1));

        rightInnerDiv.textContent = tempName;
        rightInnerDiv.appendChild(addImage(selectedCellName, 2));

        newDiv.appendChild(leftInnerDiv);
        newDiv.appendChild(rightInnerDiv);

        main_section.removeChild(highlightCell);
        main_section.appendChild(newDiv);
        added = true;
     }
}

/**
 * when the dragged cell leaves the highlight section the highlightCell returns and the newDiv is removed
 */
newDiv.addEventListener('dragleave', (event) => {
    if (event.target !== newDiv) return;
        
        main_section.removeChild(newDiv);
        highlightCell.textContent = tempName;
        highlightCell.appendChild(addImage(tempName, 1));
        highlightCell.addEventListener('drop', drop);
        main_section.appendChild(highlightCell);
        added = false;

});

/**
 * after drop newDiv is removed
 * highlightCell is replaced in the main section
 * calls the control
 * @param event
 */
function drop(event) {
    event.preventDefault();

        main_section.removeChild(newDiv);
        highlightCell.textContent = tempName;
        highlightCell.appendChild(addImage(tempName, 1));
        highlightCell.addEventListener('drop', drop);
        main_section.appendChild(highlightCell);
        added = false;

    const dropTarget = tempName;
    if(selectedCellName =="")   return;

    if (!dropTarget) return;
    control(dropTarget === selectedCellName);
    selectedCellName=""; // !!!


}
function getCellElements() {
    const selectSection = document.getElementById('select_section');
    const cellElements = selectSection.querySelectorAll('.cell');
    return Array.from(cellElements);
}

function activateCheatClass(el) {
    el.classList.toggle('cheat');
}

function click(name) {
    control(name === highlightCell.textContent.trim());
    // control(name === highlightCell.getAttribute("data-animal").trim());
}

function guessHelper(){
    let cells = getCellElements();
    cells.forEach(el => {
        if (el.textContent === cell_highlight[findHighlightIndex(cell_highlight)].getName()){
            console.log("Guess helper found")
            setTimeout(function() {
                activateCheatClass(el);
            }, 4000)
            activateCheatClass(el);
        }
    });
}

function findHighlightIndex(array) {
    for (let i = 0; i < array.length; i++) {
        if (!array[i].displayed) {
            if (i >= 1) {
                return i - 1;

            } else
                return 0;
        }
        if (i == array.length - 1) {
            return i;
        }
    }
}

/**
 * decides if there will be a new highlight cell or the end of the round
 * @param result is the compare of the highlighted and the selected after the drop
 */
function control(result){
    ROUNDS_PLAYED++;
    total_attempts++;
    let index;
    if (result) {
        console.log("Clicked right")
        success_attempts++;
        guessedAnimals++;
        WIN_STREAK = WIN_STREAK + 1;
        index = getValidIndex(cell_highlight);
        showOverlay("Ano! Je to " + cell_highlight[findHighlightIndex(cell_highlight)].getName() + "!");

        setHighlight(index);
        updateSelectSection();
        selectedCellName=""; // !!!

    } else {
        if (COMPLEXITY_INC && ROUNDS_PLAYED > 3) {
            MAX_ANIMALS = parseInt(localStorage.getItem('MAX_ANIMALS'))
            reset()
            WIN_STREAK = 0;
            showOverlay("Ne, zkus' ještě jednou.");
            return
        }
        WIN_STREAK = 0;
        showOverlay("Ne, zkus' ještě jednou.");
    }
    if (MAX_ROUNDS > 3) {
        winStreakValidator();

    }

    endGameValidator()
}
function winStreakValidator(){
    console.log("Win streak: " + WIN_STREAK)
    if (WIN_STREAK > 0 && (guessedAnimals > 0 && guessedAnimals % MAX_ANIMALS == 0) && COMPLEXITY_INC){
        if (MAX_ANIMALS  == 7) {
            reset()
        } else {
            MAX_ANIMALS++;
            console.log("Increasing max animals. Currently: " + MAX_ANIMALS)
            reset()
        }
    }
}

function endGameValidator(){
    console.log("Rounds played: " + ROUNDS_PLAYED)
    console.log("Max rounds: " + MAX_ROUNDS)
    if(MAX_ANIMALS >= MAX_ROUNDS && ROUNDS_PLAYED == MAX_ROUNDS  && !INFINITY_GAME ){
        console.log("Game is ended")
        hideOverlay();
        textPEndGameModal.textContent = 'Skvělá hra, drahá!\n' + "Vaše skóre je: " + success_attempts + "/" + total_attempts;
        endGame();
        ROUNDS_PLAYED = 0;
        WIN_STREAK = 0;
    } else if (MAX_ANIMALS < MAX_ROUNDS  && !INFINITY_GAME ) {
        if (guessedAnimals == MAX_ANIMALS) {
            reset()
        }
        if (ROUNDS_PLAYED == MAX_ROUNDS) {
            console.log("Game is ended")
            hideOverlay();
            textPEndGameModal.textContent = 'Skvělá hra, drahá!\n' + "Vaše skóre je: " + success_attempts + "/" + total_attempts;
            endGame();
            ROUNDS_PLAYED = 0;
            WIN_STREAK = 0;
        }
    } else if (MAX_ANIMALS >= MAX_ROUNDS && ROUNDS_PLAYED == MAX_ROUNDS  && INFINITY_GAME ) {
        console.log("Game is ended")
        reset()
    } else if (MAX_ANIMALS < MAX_ROUNDS  && INFINITY_GAME ) {
        if (guessedAnimals == MAX_ANIMALS) {
            reset()
        }
    }
    else if(ROUNDS_PLAYED % MAX_ROUNDS == 0){
        reset();
    }
}

/**
 * checks to find the cell from select section with same name as the cell which as been dragged and dropped
 * removes it from the display
 * calls removeAt to remove it from the list
 * calls getMaxOfAvailable to see if there are available images to displayed in places of the removed
 */
function updateSelectSection() {
    for (let i = 0; i < MAX_ANIMALS; i++) {
        if(cell_selection[i].getName() === selectedCellName) {
            cell_selection[i].selected = true;
        }
        if (cell_selection[i].selected) {
            cell_selection[i].element.style.display = "none";
        } else {
            cell_selection[i].element.style.display = "inline-block";
        }
    }

}

/**
 * this function searches for a cell that is not displayed and return the index
 * @param array
 * @returns {number} i is the valid index
 */
function getValidIndex(array) {
    for (let i = 0; i < array.length; i++) {
      if (!array[i].displayed) {
        return i;
      }
    }
}

/**
 * @param index indicates which cell from cell_highlight array will be displayed on the screen
 * new cell for highlightCell
 */
function setHighlight(index){
    if (index >= 0 && index < cell_highlight.length) {
        highlightCell.textContent = cell_highlight[index].getName();
        highlightCell.appendChild(cell_highlight[index].getImage());
        cell_highlight[index].setDisplayed(true);
        cell_highlight[index].displayed = true;
    }
}

/**
 * used to set the round
 * initializes highlightCell
 * initializes select section
 */
function setFirstRound(){

    highlightCell.classList.add('cell');
    highlightCell.textContent = cell_highlight[0].getName();
    highlightCell.appendChild(cell_highlight[0].getImage());
    main_section.appendChild(highlightCell);
    cell_highlight[0].setDisplayed(true);

    if(dragNdrop){
        highlightCell.addEventListener('dragenter', dragEnter);
    }


    for(let i = 0; i < MAX_ANIMALS; i++){

        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.textContent = cell_selection[i].getName();
        cell.appendChild(cell_selection[i].getImage());
        if(dragNdrop){
            cell.addEventListener('dragstart', dragStart);
        }else{
            cell.addEventListener('click', () => {
                click(cell.textContent);
            });
        }

        select_section.appendChild(cell);
        cell_selection[i].selected = false;
        cell_selection[i].element = cell;
    }
}



/**
 * reset is used after each round
 */
function reset() {
    guessedAnimals = 0;
    closeEndGame();
    main_section.innerHTML = '';
    select_section.innerHTML = '';
    console.log("MAX_ANIMALS = " + MAX_ANIMALS)
    console.log("local storage max animals = " + localStorage.getItem('MAX_ANIMALS'))
    shuffleArray(animals);
    cell1 = animals.slice(0, MAX_ANIMALS);
    console.log(cell1)
    cell2 = animals.slice(0, MAX_ANIMALS);
    createCells();
    setFirstRound();
    console.log("cell_highlight")
    for (let i = 0; i < cell_highlight.length; i++) {
        console.log(cell_highlight[i])
    }
}
createEndGameOverlay();
createOverlay();
createCells();
setFirstRound();
