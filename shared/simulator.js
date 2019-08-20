importScripts('../hearts/gameSimulator.js', 
'../hearts/player.js',
'../hearts/settings.js',
'../hearts/scoreboard.js',
'../spades/gameSimulator.js',
'../spades/player.js',
'../spades/settings.js',
'../spades/scoreboard.js', 
'../pinochle/gameSimulator.js',
'../pinochle/player.js',
'../pinochle/settings.js',
'../pinochle/scoreboard.js',  
'../cribbage/gameSimulator.js',
'../cribbage/player.js',
'../cribbage/settings.js',
'../cribbage/scoreboard.js');

var isStepping = false;
var isSimulating = false;
var gameSimulator;

self.addEventListener('message', function(e){
    var data = e.data;
    switch (data.cmd) {
        case 'startSimulation':
            startSimulation(data.gameName, data.settings, data.decisionMethods);
            break;
        case 'stopSimulation':
            stopSimulation();
            break;
        case 'setIsStepping':
            isStepping = data.isStepping;
            if (isSimulating && !isStepping) {
                stepForward();
            }
            break;
        case 'stepForward':
            stepForward();
            break;
    }
}, false);

function startSimulation(aGameName, settings, decisionMethods) {
    if (isSimulating) {
        console.log("Is restarting...");
        // TODO
    }

    isSimulating = true;
    
    switch (aGameName) {
        case 'Hearts':
            gameSimulator = new HeartsGameSimulator(settings, decisionMethods);
            break;
        case 'Spades':
            gameSimulator = new SpadesGameSimulator(settings, decisionMethods);
            break;
        case 'Pinochle':
            gameSimulator = new PinochleGameSimulator(settings, decisionMethods);
            break;
        case 'Cribbage':
            gameSimulator = new CribbageGameSimulator(settings, decisionMethods);
            break;
    }

    console.log("Starting simulation...");

    gameSimulator.InitializeSimulations();

    setTimeout(stepForward, 0);
}

function stopSimulation() {
    isSimulating = false;
}

function stepForward() {
    gameSimulator.StepToNextDecision();
    if (isStepping) {
        self.postMessage(
            {
                'cmd': 'stepped', 
                'gameState': gameSimulator.GetGameState()
            });
        return;
    } else if (isSimulating) {
        setTimeout(stepForward, 1);
        return;
    } else {
        console.log("Simulation stopped");
    }
}

function postSimulationStats(stats) {
    self.postMessage({
        'cmd': 'statsUpdate',
        'stats': stats
    });
}

