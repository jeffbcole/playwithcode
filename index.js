var game;
var gameContainer;
var codeContainer;
var codeEditor;
var codeContainerGutter;
var codeContainerGutterRightPosition = 0;
var menuBarHeight = 50;
var gameContainerZoom = 0.75;
var isDraggingGutter = false;
var editor;
var currentDecisionIndex;
var simulationWorker;
var isSimulatorRunning = false;
var isStepping = false;

function Initialize() {
    UpdateBackgroundImageFromSettings();

    codeContainerGutter = document.getElementById('code_container_gutter');
    codeContainerGutter.addEventListener("mousedown", CodeContainerGutterMouseDown, false);
    codeContainer = document.getElementById('code_container');
    codeEditor = document.getElementById('code_editor');
    gameContainer = document.getElementById('game_main_container');
    gameContainer.innerWidth = window.innerWidth;
    gameContainer.innerHeight = window.innerHeight - 50;

    editor = ace.edit("code_editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/javascript");
    editor.setOptions({
        showPrintMargin: false,
        autoScrollEditorIntoView: false,
    });

    // Don't allow the user to do anything with the first and last lines of code
    /*
    editor.commands.on("exec", function(e) { 
        var rowCol = editor.selection.getCursor();
        if ((rowCol.row == 0) || (rowCol.row >= (editor.session.getLength()-1))) {
            if (e.command.name == 'insertstring' || 
                e.command.name == 'backspace' ||
                e.command.name == 'indent' ||
                e.command.name.startsWith('select')) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    });
    */

    // Allow users to set break points
    // this just visualizes the break point but it does nothing else
    /*
    editor.on("guttermousedown", function(e) {
        var target = e.domEvent.target; 
        if (target.className.indexOf("ace_gutter-cell") == -1)
            return; 
        if (!editor.isFocused()) 
            return; 
        if (e.clientX > 25 + target.getBoundingClientRect().left) 
            return; 
    
        var breakpoints = e.editor.session.getBreakpoints(row, 0);
        var row = e.getDocumentPosition().row;
        if(typeof breakpoints[row] === typeof undefined)
            e.editor.session.setBreakpoint(row);
        else
            e.editor.session.clearBreakpoint(row);
        
        e.stop();
    })
    */

    editor.on("change", function(e) {
        var curCode = editor.getSession().getValue();
        if (e.action == 'remove' && curCode == "") {
            // When changing the tab, we don't want to save the edit
            return;
        }
        
        game.SaveCurrentDecisionMethod(currentDecisionIndex, curCode);
        game.ClearAllCustomDecisionIndicators();
        game.TryCurrentDecisionMethod(currentDecisionIndex);
    });

    var stepCheckbox = document.getElementById('code_simulator_step_checkbox');
    stepCheckbox.checked = isStepping;

    simulationWorker = new Worker('shared/simulator.js');
    simulationWorker.addEventListener('message', onSimulatorMessage, false);
    simulationWorker.addEventListener('error', onSimulatorError, true);

    window.onresize = AdjustCodeContainerWidths;
    var preferredGame = window.localStorage.getItem("preferredGame");
    if (preferredGame == null) {
        var selectElement = document.getElementById('select_game_large');
        selectElement.selectedIndex = 0;
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
}

function CodeContainerGutterMouseDown(e) {
    isDraggingGutter = true;
    document.addEventListener("mousemove", CodeContainerGutterMouseMove, false);
    document.addEventListener("mouseup", CodeContainerGutterMouseUp, false);
}

function CodeContainerGutterMouseMove(e) {
    codeContainerGutterRightPosition = window.innerWidth - e.x;
    AdjustCodeContainerWidths();
}

function CodeContainerGutterMouseUp(e) {
    isDraggingGutter = false;
    document.removeEventListener("mousemove", CodeContainerGutterMouseMove, false);
    document.removeEventListener("mouseup", CodeContainerGutterMouseUp, false);
}

function AdjustCodeContainerWidths() {
    gameContainer.innerWidth = (window.innerWidth - codeContainerGutterRightPosition - 2)/gameContainerZoom;
    gameContainer.innerHeight = (window.innerHeight/gameContainerZoom - 50);
    if (isDraggingGutter) {
        gameContainer.style.transition = 'none';
        codeContainerGutter.style.transition = 'none';
        codeContainer.style.transition = 'none';
    } else {
        gameContainer.style.transition = '0.5s ease-out';
        codeContainerGutter.style.transition = '0.5s ease-out';
        codeContainer.style.transition = '0.5s ease-out';
    }
    gameContainer.style.width = gameContainer.innerWidth + 'px';
    codeContainerGutter.style.right = codeContainerGutterRightPosition + 'px';
    codeContainer.style.width = codeContainerGutterRightPosition + 'px';
    codeEditor.style.width = codeContainerGutterRightPosition + 'px';
    editor.resize();
    if (game != null) {
        game.OnResizeWindow();
    }
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
    
    if (game != null) {
        game.OnTerminateGame();
    }
    game = null;
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
}

function playAsComputerButtonPressed() {
    window.localStorage.setItem('isPlayingAsComputer', 'true');
    ShowMenuBar();
    HideHumanVsComputerChoice('right');
    HideGameSelector('right');
    StartPlayingAsComputer();
}

function switchToPlayAsHumanButtonPressed() {
    window.localStorage.setItem('isPlayingAsComputer', 'false');
    ShowMenuBar();
    StartGameAsHuman();
}

function switchToPlayAsComputerButtonPressed() {
    window.localStorage.setItem('isPlayingAsComputer', 'true');
    ShowMenuBar();
    StartPlayingAsComputer();
}

function StartGameAsHuman() {
    codeContainerGutterRightPosition = 0;
    AdjustCodeContainerWidths();

    if (game == null) {
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
    } else {
        game.ClearAllCustomDecisionIndicators();
    }
    ShowMenuButton();
}

var currentDecisionButtons = [];

function LoadComputerPlayerDecisions() {
    var decisionsBar = document.getElementById('code_decisions_bar');
    decisionsBar.innerHTML = "";
    
    currentDecisionButtons = [];
    var computerPlayerDecisions = game.GetCurrentComputerPlayerDecisionNames();
    for (var i=0; i<computerPlayerDecisions.displayNames.length; i++) {
        var decisionButton = document.createElement('button');
        decisionButton.className = "decision_bar_button";
        decisionButton.innerHTML = "<div class='decision_bar_button_text'>" + computerPlayerDecisions.displayNames[i] + "</div>";
        decisionButton.setAttribute('onClick', 'ComputerPlayerDecisionButtonClick(' + i + ');');
        currentDecisionButtons.push(decisionButton);
        decisionsBar.appendChild(decisionButton);

        var refreshImage = document.createElement('div');
        refreshImage.className = "decision_bar_button_refresh";
        refreshImage.id = "decision_bar_button_" + i;
        decisionButton.appendChild(refreshImage);
    }

    currentDecisionIndex = computerPlayerDecisions.selectedIndex;

    var selectedDecisionButton = currentDecisionButtons[computerPlayerDecisions.selectedIndex];
    selectedDecisionButton.classList.add('decision_bar_button_selected');

    LoadEditorCodeForDecisionIndex(computerPlayerDecisions.selectedIndex);
}

function ComputerPlayerDecisionButtonClick(decisionIndex) {
    for (var i=0; i<currentDecisionButtons.length; i++) {
        var decisionButton = currentDecisionButtons[i];
        if (i==decisionIndex) {
            decisionButton.className = "decision_bar_button decision_bar_button_selected";
        } else {
            decisionButton.className = "decision_bar_button";
        }
    }

    currentDecisionIndex = decisionIndex;

    SpinRefreshIcon(decisionIndex);
    game.ClearAllCustomDecisionIndicators();
    game.LoadDecisionScenario(decisionIndex);
    LoadEditorCodeForDecisionIndex(decisionIndex);
}

function SpinRefreshIcon(decisionIndex) {
    var refreshIcon = document.getElementById("decision_bar_button_" + decisionIndex);
    refreshIcon.addEventListener("animationend", function() {
        refreshIcon.classList.remove('refresh_spin');
    });
    refreshIcon.classList.add('refresh_spin');
}

function LoadEditorCodeForDecisionIndex(decisionIndex) {
    var method = game.GetCustomPlayerMethod(decisionIndex);
    editor.session.setValue(method);
}

function StartPlayingAsComputer() {

    gameContainer.style.transform = "scale(" + gameContainerZoom + ")";
    gameContainer.style.transformOrigin = "0% 0% 0px";
    gameContainer.innerWidth = (window.innerWidth - codeContainerGutterRightPosition - 2)/gameContainerZoom;
    gameContainer.innerHeight = (window.innerHeight/gameContainerZoom - 50);

    // Create an active game if there is not one
    if (game == null) {
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
        
        game.InitializeGame('Standard');
        ShowMenuButton();
    } else {
        game.ClearAllCustomDecisionIndicators();
    }

    LoadComputerPlayerDecisions();
    codeContainerGutterRightPosition = window.innerWidth*0.5;
    AdjustCodeContainerWidths();
}

function IndicateCodeError(codeError) {
    var codeConsole = document.getElementById('code_console');
    codeConsole.innerText = codeError;
}

function onStepCheckboxClick(cb) {
    isStepping = cb.checked;
    simulationWorker.postMessage({
        'cmd': 'setIsStepping', 
        'isStepping': isStepping
    });

    var playButtonIcon = document.getElementById('code_simulator_play_button_icon');
    if (isStepping) {
        playButtonIcon.className = 'fa fa-step-forward';
    } else {
        if (isSimulatorRunning) {
            playButtonIcon.className = 'fa fa-stop';
        } else {
            playButtonIcon.className = 'fa fa-play';
        }
    }
}

var onSimulatorMessage = function(e){
    var data = e.data;
    switch (data.cmd) {
        case 'stepped':
            var playButtonIcon = document.getElementById('code_simulator_play_button_icon');
            playButtonIcon.className = 'fa fa-step-forward';
            LoadSimulationGameState(data.gameState);
        break;
        case 'statsUpdate':
            game.UpdateSimulationStats(data.stats);
        break;
    }
}

var onSimulatorError = function(e) {
    console.log("Error: " + e);
}

function onSimulatorPlayClick() {
    
    var playButtonIcon = document.getElementById('code_simulator_play_button_icon');

    if (isSimulatorRunning) {
        if (isStepping) {
            simulationWorker.postMessage({
                'cmd': 'stepForward'
            });
            playButtonIcon.className = 'fa fa-step-forward';
        } else {
            simulationWorker.postMessage({
                'cmd': 'stopSimulation'
            });
            isSimulatorRunning = false;
            playButtonIcon.className = 'fa fa-play';
        }
    } else {
        var preferredGame = window.localStorage.getItem('preferredGame');
        var settings = {};
        switch (preferredGame) {
            case 'Hearts':
                settings.losing_score = Number(game.settings.GetSetting('setting_losing_score'));
                break;
            case 'Spades':
                settings.winningScore = Number(game.settings.GetSetting('setting_winning_score'));
                settings.sandbaggingPenalty = game.settings.GetSetting('setting_sandbaggingpenalty');
                break;
            case 'Pinochle':
                settings.winningScore = Number(game.settings.GetSetting('setting_winning_score'));
                settings.isDoubleDeck = game.settings.GetSetting('setting_deck_count')==1;
                settings.passingCardsCount = Number(game.settings.GetSetting('setting_passing_cards_count'));
                settings.minimumBid = Number(game.settings.GetSetting('setting_minimum_bid'));
                break;
            case 'Cribbage':
                //TODO
                break;
        }
        game.LoadStatsView();
        var decisionMethods = game.GetAllDecisionMethods();
        simulationWorker.postMessage({
            'cmd': 'startSimulation', 
            'gameName': preferredGame,
            'settings': settings,
            'decisionMethods': decisionMethods
        });

        isSimulatorRunning = true;
        if (isStepping) {
            playButtonIcon.className = 'fa fa-step-forward';
        } else {
            playButtonIcon.className = 'fa fa-stop';
        }
    }
}

function LoadSimulationGameState(gameState) {
    game.LoadSimulationGameState(gameState);
    game.ClearAllCustomDecisionIndicators();
    currentDecisionIndex = game.currentDecisionIndex;
    
    for (var i=0; i<currentDecisionButtons.length; i++) {
        var decisionButton = currentDecisionButtons[i];
        if (i==currentDecisionIndex) {
            decisionButton.className = "decision_bar_button decision_bar_button_selected";
        } else {
            decisionButton.className = "decision_bar_button";
        }
    }
    
    LoadEditorCodeForDecisionIndex(currentDecisionIndex);
}