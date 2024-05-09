let gameId = 0;

/**
 * Executes when the DOM content is loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
    parseSettings();

    // Event listener for input range element ir1
    document.getElementById('ir1').addEventListener('input', function(event) {
        let maxAnimals = event.target.value;
        // If switch1 is checked, set maxAnimals to 3
        if (document.getElementById("switch1").checked){
            maxAnimals = 3;
        }
        // Store maxAnimals value in localStorage
        localStorage.setItem('MAX_ANIMALS', maxAnimals);
    });

    // Event listener for input range element ir2
    document.getElementById('ir2').addEventListener('input', function(event) {
        const maxRounds = event.target.value;
        // Store maxRounds value in localStorage
        localStorage.setItem('MAX_ROUNDS', maxRounds);
    });

    // Event listener for change in settings-group horizontal
    document.querySelector('.settings-group.horizontal').addEventListener('change', function(event) {
        if (event.target.matches('input[type="checkbox"]')) {
            const switchId = event.target.id;
            const switchValue = event.target.checked;
            if (switchId === 'switch1' || switchId === 'switch2') {
                // Store switch state in localStorage
                localStorage.setItem(switchId.toUpperCase(), switchValue);
                const slider = event.target.parentNode.querySelector('.slider');
                // Toggle checked class based on switch state
                slider.classList.toggle('checked', switchValue);
                // Update MAX_ANIMALS in localStorage based on switch1 state
                if (document.getElementById("switch1").checked){
                    localStorage.setItem('MAX_ANIMALS', '3');
                } else {
                    localStorage.setItem('MAX_ANIMALS', document.getElementById("ir1").value);
                }
            }
        }
    });

    // Event listener for click on img elements
    document.querySelectorAll('img').forEach(button => {
        button.addEventListener('click', () => {
            gameId = button.id;
            localStorage.setItem('GAME_ID', gameId);
            startGame(gameId);
        });
    });

    /**
     * Starts the game based on gameId.
     * @param {string} gameId - The ID of the game to start.
     */
    function startGame(gameId) {
        overrideMenu();
        let gamePath = "miniGames/";
        // Determine gamePath based on gameId
        if (gameId === 'button3') {
            gamePath += "gameSounds.js";
        } else if (gameId === 'button2' || gameId === 'button1') {
            gamePath += "gameHalves.js";
        } else {
            // Exit function if gameId is unknown
            return;
        }
        // Load the game script if gamePath exists
        if (gamePath) {
            loadGameScript(gamePath);
        }
    }

    /**
     * Overrides the menu HTML content.
     */
    function overrideMenu() {
        document.querySelector('.menu').innerHTML = `
            <div id="icons">
                <img src="MainMenu/pictures/icons/home.png" name="home" onclick="goToStart()" alt="">
                <img src="MainMenu/pictures/icons/tip.png" name="tip" onclick="guessHelper()" alt="">
                <img src="MainMenu/pictures/icons/info.png" name="warn" onclick="showModal()" alt="">
            </div>
                <div class="main_section" id="main_section"></div>
                <div class="select_section" id="select_section"></div>
                <div class="overlay" id="overlay"></div>
                <div class="overlay" id="overlayEnd"></div>
                <div class="modal" id="myModal">
                    <div class="modal-content">
                        <span class="close" onclick="closeModal()">&times;</span>
                        <p id="modalText"></p>
                    </div>
                </div>
                <div class="modal" id="modalEndGame">
                    <div class="modal-content" id="modalEndGameContent">
                        <p id="modalText123"></p>
                    </div>
                </div>
                
                <style>
                    body{background-image: url('MainMenu/pictures/backdround/bgFullHD.png');}
                </style>
            </div>`;
    }

    /**
     * Loads a script dynamically.
     * @param {string} path - The path to the script to be loaded.
     */
    function loadGameScript(path) {
        let scriptElement = document.createElement('script');
        scriptElement.src = path;
        document.body.appendChild(scriptElement);
    }

    // Function to restore slider state from localStorage
    function restoreSliderState() {
        // Retrieve maxAnimals and maxRounds from localStorage
        const maxAnimals = localStorage.getItem('MAX_ANIMALS');
        const maxRounds = localStorage.getItem('MAX_ROUNDS');
        // If maxAnimals and maxRounds are found in localStorage
        if (maxAnimals && maxRounds) {
            // Set the values of ir1 and ir2 input range elements to maxAnimals and maxRounds respectively
            document.getElementById('ir1').value = maxAnimals;
            document.getElementById('ir2').value = maxRounds;
        }
    }

    // Call restoreSliderState function
    restoreSliderState();
});

// Event listener for change event on document
document.addEventListener("change", function(event) {
    // Check if the changed element is an input checkbox
    if (event.target.matches("input[type='checkbox']")) {
        // Check the ID of the changed checkbox and call saveCheckboxState accordingly
        if (event.target.id === "switch1") {
            saveCheckboxState("switch1", "COMPLEXITY_INC");
        } else if (event.target.id === "switch2") {
            saveCheckboxState("switch2", "INFINITY_GAME");
        }
    }
});

// Event listener for DOMContentLoaded event
document.addEventListener("DOMContentLoaded", function() {
    // Set the checkbox state based on the values stored in localStorage
    setCheckboxStateFromLocalStorage("switch1", "COMPLEXITY_INC");
    setCheckboxStateFromLocalStorage("switch2", "INFINITY_GAME");

    // Set the slider state based on the values stored in localStorage
    setSliderStateFromLocalStorage("slider1", "COMPLEXITY_INC");
    setSliderStateFromLocalStorage("slider2", "INFINITY_GAME");
});

/**
 * Parses settings from localStorage and updates them.
 */
function parseSettings(){
    // Parse and update settings from localStorage
    let max_animals = Number(JSON.parse(localStorage.getItem('MAX_ANIMALS'))) ? localStorage.getItem('MAX_ANIMALS') : 3;
    let max_rounds = Number(JSON.parse(localStorage.getItem('MAX_ROUNDS'))) ? localStorage.getItem('MAX_ROUNDS') : 6;
    let infinity_game = Boolean(JSON.parse(localStorage.getItem('INFINITY_GAME'))) ? localStorage.getItem('INFINITY_GAME') : false;
    let complexity_game = Boolean(JSON.parse(localStorage.getItem('COMPLEXITY_INC'))) ? localStorage.getItem('COMPLEXITY_INC') : false;

    localStorage.setItem('MAX_ANIMALS',max_animals);
    localStorage.setItem('MAX_ROUNDS',max_rounds);
    localStorage.setItem('INFINITY_GAME',infinity_game);
    localStorage.setItem('COMPLEXITY_INC',complexity_game);
}

/**
 * Saves checkbox state to localStorage.
 * @param {string} checkboxId - The ID of the checkbox element.
 * @param {string} localStorageKey - The key to use for storing the checkbox state in localStorage.
 */
function saveCheckboxState(checkboxId, localStorageKey) {
    const checkbox = document.getElementById(checkboxId);
    if (checkbox) {
        localStorage.setItem(localStorageKey, checkbox.checked);
    }
}

/**
 * Sets checkbox state from localStorage.
 * @param {string} checkboxId - The ID of the checkbox element.
 * @param {string} localStorageKey - The key to use for retrieving the checkbox state from localStorage.
 */
function setCheckboxStateFromLocalStorage(checkboxId, localStorageKey) {
    const checkbox = document.getElementById(checkboxId);
    if (checkbox) {
        const value = localStorage.getItem(localStorageKey);
        if (value !== null) {
            checkbox.checked = JSON.parse(value);
        }
    }
}

/**
 * Sets slider state from localStorage.
 * @param {string} sliderId - The ID of the slider element.
 * @param {string} localStorageKey - The key to use for retrieving the slider state from localStorage.
 */
function setSliderStateFromLocalStorage(sliderId, localStorageKey) {
    const slider = document.getElementById(sliderId);
    if (slider) {
        const value = localStorage.getItem(localStorageKey);
        if (value !== null) {
            if (JSON.parse(value)) {
                slider.classList.add('checked');
            } else {
                slider.classList.remove('checked');
            }
        }
    }
}

function goToStart(){
    location.reload();
    window.speechSynthesis.cancel();
}

/**
 * Shows a modal based on the current gameId.
 */
function showModal() {
    // Default text if gameId is not recognized
    let text = "Text not found";
    // Set text based on gameId
    if (gameId === 'button3') {
        text = " Klikni na otazník a uslyšíš zvuk zvířete. Poznáš, o jaké zvíře se jedná? Vyber zvíře z výběru dole.";
    } else if (gameId === 'button2') {
        text = "Uhádneš, která polovina zvířete patří zvířátku nahoře? Vyber z možností dole a potáhni danou polovinu zespodu nahoru. Spoj tak dvě poloviny a vytvoř zvířátko.";
    } else if (gameId === 'button1') {
        text = "Hádej, která polovina zvířátku chybí. Vyber si z možností dole a klikni na správnou odpověď.";
    } else {
        return;
    }
    // Show modal with the generated text
    showModaltext(text);
}

/**
 * Closes the modal.
 */
function closeModal() {
    window.speechSynthesis.cancel();
    let modal = document.getElementById("myModal");
    modal.style.display = "none";
}

/**
 * Shows a modal with the specified text.
 * @param {string} text - The text to be displayed in the modal.
 */
function showModaltext(text){
    let modalText = document.getElementById("modalText");
    modalText.textContent = text;
    let modal = document.getElementById("myModal");
    modal.style.display = "block";
    var speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.lang = 'cs-CZ';
    window.speechSynthesis.speak(speech);
}

/**
 * Event listener for the change event on switch1.
 */
document.getElementById("switch1").addEventListener("change", function() {
    checkSwitchStateAndToggleSlider("switch1", "ir1");
});

/**
 * Event listener for the change event on switch2.
 */
document.getElementById("switch2").addEventListener("change", function() {
    checkSwitchStateAndToggleSlider("switch2", "ir2");
});

/**
 * Event listener for the window load event.
 */
window.addEventListener("load", function() {
    // Check switch state and toggle slider on page load
    checkSwitchStateAndToggleSlider("switch1", "ir1");
    checkSwitchStateAndToggleSlider("switch2", "ir2");
});

/**
 * Checks the state of a switch and toggles a slider accordingly.
 * @param {string} switchId - The ID of the switch element.
 * @param {string} sliderId - The ID of the slider element.
 */
function checkSwitchStateAndToggleSlider(switchId, sliderId) {
    let switchElement = document.getElementById(switchId);
    let sliderElement = document.getElementById(sliderId);
    // Disable slider if switch is checked, otherwise enable it
    sliderElement.disabled = switchElement.checked;
}
