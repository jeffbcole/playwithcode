var game;
var gameContainer;
var codeContainer;
var codeContainerGutter;
var codeContainerGutterRightPosition = 10;
var menuBarHeight = 50;

function CodeContainerGutterMouseDown(e) {
    document.addEventListener("mousemove", CodeContainerGutterMouseMove, false);
    document.addEventListener("mouseup", CodeContainerGutterMouseUp, false);
}

function CodeContainerGutterMouseMove(e) {
    codeContainerGutterRightPosition = window.innerWidth - e.x;
    AdjustCodeContainerWidths();
}

function CodeContainerGutterMouseUp(e) {
    document.removeEventListener("mousemove", CodeContainerGutterMouseMove, false);
    document.removeEventListener("mouseup", CodeContainerGutterMouseUp, false);
}

function AdjustCodeContainerWidths() {
    codeContainerGutter.style.right = codeContainerGutterRightPosition + 'px';
    codeContainer.style.width = codeContainerGutterRightPosition + 'px';
    if (game != null) {
        game.OnResizeWindow();
    }
}

function OnResizeWindow() {
    if (game != null) {
        game.OnResizeWindow();
    }
}

function Initialize() {
    UpdateBackgroundImageFromSettings();

    codeContainerGutter = document.getElementById('code_container_gutter');
    codeContainerGutter.addEventListener("mousedown", CodeContainerGutterMouseDown, false);
    codeContainer = document.getElementById('code_container');
    gameContainer = document.getElementById('game_main_container');
    gameContainer.innerWidth = window.innerWidth;
    gameContainer.innerHeight = window.innerHeight - 50;

    window.onresize = OnResizeWindow;
    setTimeout(function () {
        var preferredGame = window.localStorage.getItem("preferredGame");
        if (preferredGame == null) {
            ShowGameSelector();
        } else {
            var gameSelector = document.getElementById('select_game_large');
            for (var i=0; i<gameSelector.options.length; i++) {
                var option = gameSelector.options[i];
                if (option.text == preferredGame) {
                    gameSelector.value = option.value;
                    break;
                }
            }
            ShowGameSelector();
            ShowHumanVsComputerChoice();
        }
    }, 100);
}

function ShowGameSelector() {
    setFontSizeForSelectGameLarge();
	var el = document.getElementById("humansvscomputers_title");
	with(el.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "0.6s cubic-bezier(0.175, 0.885, 0.320, 1.275)";
		top = "calc(40% - 100px)";
		opacity = 1;
	}
}

function HideGameSelector(dir) {
    var el = document.getElementById("humansvscomputers_title");
	with(el.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "1.0s cubic-bezier(0.175, 0.885, 0.320, 1.275)";
		left = dir == 'left' ? '-50%' : '150%';
		opacity = 0;
	}
}

function ShowHumanVsComputerChoice() {
    var el = document.getElementById('select_human_or_computer');
	with(el.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "0.6s cubic-bezier(0.175, 0.885, 0.320, 1.275)";
		top = "40%";
		opacity = 1;
		pointerEvents = "auto";
    }
}

function HideHumanVsComputerChoice(dir) {
    var el = document.getElementById('select_human_or_computer');
    with(el.style) {
        WebkitTransition = MozTransition = OTransition = msTransition = "1.0s cubic-bezier(0.175, 0.885, 0.320, 1.275)";
        left = dir == 'left' ? "-50%" : "150%";
        opacity = 0;
        pointerEvents = "none";
    }
}

function selectGameLargeChanged() {
    var selectElement = document.getElementById('select_game_large');
    var preferredGameIndex = selectElement.options[selectElement.selectedIndex].value;
    if (preferredGameIndex == 0) {
        window.localStorage.removeItem('preferredGame');
        HideHumanVsComputerChoice();
    } else {
        var preferredGame = selectElement.options[selectElement.selectedIndex].text;
        window.localStorage.setItem('preferredGame', preferredGame);
        ShowHumanVsComputerChoice();
    }
    setFontSizeForSelectGameLarge();
}

function setFontSizeForSelectGameLarge() {
    var selectElement = document.getElementById('select_game_large');
    var preferredGameIndex = selectElement.options[selectElement.selectedIndex].value;
    if (preferredGameIndex == 0) {
        selectElement.style.fontSize = '40px';
    } else {
        selectElement.style.fontSize = '60px';
    }
    selectElement.blur();
}

function selectGameMenuChanged() {
    var selectElement = document.getElementById('menu_bar_select_game');
    selectElement.blur();
    var preferredGame = selectElement.options[selectElement.selectedIndex].text;
    window.localStorage.setItem('preferredGame', preferredGame);
    
    visibleMenuCards = [];
    
    var playingAsComputer = window.localStorage.getItem('isPlayingAsComputer') == 'true';
    if (playingAsComputer) {
        StartPlayingAsComputer();
    } else {
        StartGameAsHuman();
    }
}

function ShowMenuBar() {
    var gameSelector = document.getElementById('menu_bar_select_game');
    var preferredGame = window.localStorage.getItem('preferredGame');
    for (var i=0; i<gameSelector.options.length; i++) {
        var option = gameSelector.options[i];
        if (option.text == preferredGame) {
            gameSelector.value = option.value;
            break;
        }
    }

    var playingAsComputer = window.localStorage.getItem('isPlayingAsComputer') == 'true';
    if (playingAsComputer) {
        document.getElementById('menu_bar_play_as_human_container').style.visibility = 'visible';
        document.getElementById('menu_bar_play_as_computer_container').style.visibility = 'hidden';
    } else {
        document.getElementById('menu_bar_play_as_human_container').style.visibility = 'hidden';
        document.getElementById('menu_bar_play_as_computer_container').style.visibility = 'visible';
    }

    var menuBar = document.getElementById('menu_bar');
    menuBar.style.transform = "none";
}

function playAsHumanButtonPressed() {
    window.localStorage.setItem('isPlayingAsComputer', 'false');
    ShowMenuBar();
    HideHumanVsComputerChoice('left');
    HideGameSelector('left');
    StartGameAsHuman();
    // TODO
}

function playAsComputerButtonPressed() {
    window.localStorage.setItem('isPlayingAsComputer', 'true');
    ShowMenuBar();
    HideHumanVsComputerChoice('right');
    HideGameSelector('right');
    // TODO
}

function StartGameAsHuman() {
    if (game != null) {
        game.OnTerminateGame();
    }
    
    var preferredGame = window.localStorage.getItem('preferredGame');
    switch (preferredGame) {
        case 'Hearts':
            game = new HeartsGame();
            break;
        case 'Spades':
            game = new SpadesGame();
            break;
        case 'Pinochle':
            game = new PinochleGame();
            break;
        case 'Cribbage':
            game = new CribbageGame();
            break;

    }
    game.StartAGame('Standard');
    ShowMenuButton();
}

function StartPlayingAsComputer() {
    // TODO
}