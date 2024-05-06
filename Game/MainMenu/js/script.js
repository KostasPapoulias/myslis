let gameId = 0;
document.addEventListener("DOMContentLoaded", () => {
    parseSettings();

    // Измененный обработчик изменений для первого слайдера
    document.getElementById('ir1').addEventListener('input', function(event) {
        let maxAnimals = event.target.value;
        if(document.getElementById("switch1").checked){
            maxAnimals = 2;
        }

        localStorage.setItem('MAX_ANIMALS', maxAnimals);


    });

    // Измененный обработчик изменений для второго слайдера
    document.getElementById('ir2').addEventListener('input', function(event) {
        const maxRounds = event.target.value;
        localStorage.setItem('MAX_ROUNDS', maxRounds);

    });

    document.querySelector('.settings-group.horizontal').addEventListener('change', function(event) {
        if (event.target.matches('input[type="checkbox"]')) {
            const switchId = event.target.id;
            const switchValue = event.target.checked;
            if (switchId === 'switch1' || switchId === 'switch2') {
                localStorage.setItem(switchId.toUpperCase(), switchValue);
                const slider = event.target.parentNode.querySelector('.slider');
                slider.classList.toggle('checked', switchValue);

                if (document.getElementById("switch1").checked){
                    localStorage.setItem('MAX_ANIMALS', '2');
                }else if(!document.getElementById("switch1").checked){
                    localStorage.setItem('MAX_ANIMALS',document.getElementById("ir1").value);
                }
            }
        }
    });

    document.querySelectorAll('img').forEach(button => {
        button.addEventListener('click', () => {
             gameId = button.id;
             localStorage.setItem('GAME_ID',gameId);
            startGame(gameId);
        });
    });

    function startGame(gameId) {
        overrideMenu();
        let gamePath = "miniGames/";
        if (gameId === 'button3') {
            gamePath += "gameSounds.js";
        } else if (gameId === 'button2' || gameId === 'button1') {
            gamePath += "gameHalves.js";
        } else {
            // Обработка неизвестного ID кнопки
            console.error("Unknown game ID: ", gameId);
            return;
        }

        // Загрузка скрипта игры, если путь определен
        if (gamePath) {
            loadGameScript(gamePath);
        }
    }

    function overrideMenu() {
        document.querySelector('.menu').innerHTML = `
            <div id="icons">
                <img src="MainMenu/pictures/icons/home.png" name="home" onclick="location.reload();" alt="">
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

    function loadGameScript(path) {
        let scriptElement = document.createElement('script');
        scriptElement.src = path;
        document.body.appendChild(scriptElement);
    }

    function restoreSliderState() {
        const maxAnimals = localStorage.getItem('MAX_ANIMALS');
        const maxRounds = localStorage.getItem('MAX_ROUNDS');
        if (maxAnimals && maxRounds) {
            document.getElementById('ir1').value = maxAnimals;
            document.getElementById('ir2').value = maxRounds;
        }
    }

    restoreSliderState();

});

document.addEventListener("change", function(event) {
    if (event.target.matches("input[type='checkbox']")) {
        if (event.target.id === "switch1") {
            saveCheckboxState("switch1", "COMPLEXITY_INC");
        } else if (event.target.id === "switch2") {
            saveCheckboxState("switch2", "INFINITY_GAME");
        }
    }
});

document.addEventListener("DOMContentLoaded", function() {
    setCheckboxStateFromLocalStorage("switch1", "COMPLEXITY_INC");
    setCheckboxStateFromLocalStorage("switch2", "INFINITY_GAME");

    setSliderStateFromLocalStorage("slider1", "COMPLEXITY_INC");
    setSliderStateFromLocalStorage("slider2", "INFINITY_GAME");
});

function parseSettings(){
    let max_animals = Number(JSON.parse(localStorage.getItem('MAX_ANIMALS'))) ? localStorage.getItem('MAX_ANIMALS') : 2;
    let max_rounds = Number(JSON.parse(localStorage.getItem('MAX_ROUNDS'))) ? localStorage.getItem('MAX_ROUNDS') : 3;
    let infinity_game = Boolean(JSON.parse(localStorage.getItem('INFINITY_GAME'))) ? localStorage.getItem('INFINITY_GAME') : false;
    let complexity_game = Boolean(JSON.parse(localStorage.getItem('COMPLEXITY_INC'))) ? localStorage.getItem('COMPLEXITY_INC') : false;

    localStorage.setItem('MAX_ANIMALS',max_animals);
    localStorage.setItem('MAX_ROUNDS',max_rounds);
    localStorage.setItem('INFINITY_GAME',infinity_game);
    localStorage.setItem('COMPLEXITY_INC',complexity_game);
}

function saveCheckboxState(checkboxId, localStorageKey) {
    const checkbox = document.getElementById(checkboxId);
    if (checkbox) {
        localStorage.setItem(localStorageKey, checkbox.checked);

    }
}

function setCheckboxStateFromLocalStorage(checkboxId, localStorageKey) {
    const checkbox = document.getElementById(checkboxId);
    if (checkbox) {
        const value = localStorage.getItem(localStorageKey);
        if (value !== null) {
            checkbox.checked = JSON.parse(value);
        }
    }
}

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

function showModal() {
    let text = "text not found";
    if (gameId === 'button3') {
        text = " Klikni na otazník a uslyšíš zvuk zvířete. Poznáš, o jaké zvíře se jedná? Vyber zvíře z výběru dole.";
    } else if (gameId === 'button2') {
        text = "Uhádneš, která polovina zvířete patří zvířátku nahoře? Vyber z možností dole a potáhni danou polovinu zespodu nahoru. Spoj tak dvě poloviny a vytvoř zvířátko.";
    } else if (gameId === 'button1') {
        text = "Hádej, která polovina zvířátku chybí. Vyber si z možností dole a klikni na správnou odpověď.";
    } else {
        // Обработка неизвестного ID кнопки
        console.error("Unknown game ID: ", gameId);
        return;
    }
    showModaltext(text);
}

// Функция для закрытия модального окна
function closeModal() {
    let modal = document.getElementById("myModal");
    modal.style.display = "none";
}

function showModaltext(text){
    let modalText = document.getElementById("modalText");
    modalText.textContent = text; // Устанавливаем текст модального окн
    let modal = document.getElementById("myModal");
    modal.style.display = "block";
}

document.getElementById("switch1").addEventListener("change", function() {
    checkSwitchStateAndToggleSlider("switch1", "ir1");
});

document.getElementById("switch2").addEventListener("change", function() {
    checkSwitchStateAndToggleSlider("switch2", "ir2");
});

window.addEventListener("load", function() {
    checkSwitchStateAndToggleSlider("switch1", "ir1");
    checkSwitchStateAndToggleSlider("switch2", "ir2");
});

function checkSwitchStateAndToggleSlider(switchId, sliderId) {
    let switchElement = document.getElementById(switchId);
    let sliderElement = document.getElementById(sliderId);
    sliderElement.disabled = switchElement.checked;
}