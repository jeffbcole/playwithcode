var HeartsGameSimulator = function (aSettings, aDecisionMethods) {
    
    // Global Game Settings
    this.settings = aSettings;
    this.decisionMethods = aDecisionMethods;
    
    // Members
    this.currentMoveStage = "";
    this.currentDecisionIndex = 0;
    this.skillLevel = "";
    this.losingScore = this.settings.losing_score;
    this.players = [];
    this.trickCards = [];
    this.roundNumber = 0;
    this.leadIndex = 0;
    this.turnIndex = 0;
    this.isHeartsBroken = false;
    this.cardsPlayedThisRound = [];
    this.roundScores = [];

    this.gamesSimulated = 0;
    this.opponentSkillLevels = ['Easy', 'Standard', 'Pro'];
    this.stats = {
        'gamesPlayed': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
        'moonsShot': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
        'wins': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
        'seconds': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
        'thirds': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
        'fourths': { 'Easy': 0, 'Standard': 0, 'Pro': 0}
    }
    
    
    var deckTopIndex = 0;
    var cards = [
        { id: 'AS', rank: 1, value: 14, suit: 'S', suitInt: 2},
        { id: '2S', rank: 2, value: 2, suit: 'S', suitInt: 2},
        { id: '3S', rank: 3, value: 3, suit: 'S', suitInt: 2},
        { id: '4S', rank: 4, value: 4, suit: 'S', suitInt: 2},
        { id: '5S', rank: 5, value: 5, suit: 'S', suitInt: 2},
        { id: '6S', rank: 6, value: 6, suit: 'S', suitInt: 2},
        { id: '7S', rank: 7, value: 7, suit: 'S', suitInt: 2},
        { id: '8S', rank: 8, value: 8, suit: 'S', suitInt: 2},
        { id: '9S', rank: 9, value: 9, suit: 'S', suitInt: 2},
        { id: 'TS', rank: 10, value: 10, suit: 'S', suitInt: 2},
        { id: 'JS', rank: 11, value: 11, suit: 'S', suitInt: 2},
        { id: 'QS', rank: 12, value: 12, suit: 'S', suitInt: 2},
        { id: 'KS', rank: 13, value: 13, suit: 'S', suitInt: 2},
        { id: 'AD', rank: 1, value: 14, suit: 'D', suitInt: 1},
        { id: '2D', rank: 2, value: 2, suit: 'D', suitInt: 1},
        { id: '3D', rank: 3, value: 3, suit: 'D', suitInt: 1},
        { id: '4D', rank: 4, value: 4, suit: 'D', suitInt: 1},
        { id: '5D', rank: 5, value: 5, suit: 'D', suitInt: 1},
        { id: '6D', rank: 6, value: 6, suit: 'D', suitInt: 1},
        { id: '7D', rank: 7, value: 7, suit: 'D', suitInt: 1},
        { id: '8D', rank: 8, value: 8, suit: 'D', suitInt: 1},
        { id: '9D', rank: 9, value: 9, suit: 'D', suitInt: 1},
        { id: 'TD', rank: 10, value: 10, suit: 'D', suitInt: 1},
        { id: 'JD', rank: 11, value: 11, suit: 'D', suitInt: 1},
        { id: 'QD', rank: 12, value: 12, suit: 'D', suitInt: 1},
        { id: 'KD', rank: 13, value: 13, suit: 'D', suitInt: 1},
        { id: 'AC', rank: 1, value: 14, suit: 'C', suitInt: 0},
        { id: '2C', rank: 2, value: 2, suit: 'C', suitInt: 0},
        { id: '3C', rank: 3, value: 3, suit: 'C', suitInt: 0},
        { id: '4C', rank: 4, value: 4, suit: 'C', suitInt: 0},
        { id: '5C', rank: 5, value: 5, suit: 'C', suitInt: 0},
        { id: '6C', rank: 6, value: 6, suit: 'C', suitInt: 0},
        { id: '7C', rank: 7, value: 7, suit: 'C', suitInt: 0},
        { id: '8C', rank: 8, value: 8, suit: 'C', suitInt: 0},
        { id: '9C', rank: 9, value: 9, suit: 'C', suitInt: 0},
        { id: 'TC', rank: 10, value: 10, suit: 'C', suitInt: 0},
        { id: 'JC', rank: 11, value: 11, suit: 'C', suitInt: 0},
        { id: 'QC', rank: 12, value: 12, suit: 'C', suitInt: 0},
        { id: 'KC', rank: 13, value: 13, suit: 'C', suitInt: 0},
        { id: 'AH', rank: 1, value: 14, suit: 'H', suitInt: 3},
        { id: '2H', rank: 2, value: 2, suit: 'H', suitInt: 3},
        { id: '3H', rank: 3, value: 3, suit: 'H', suitInt: 3},
        { id: '4H', rank: 4, value: 4, suit: 'H', suitInt: 3},
        { id: '5H', rank: 5, value: 5, suit: 'H', suitInt: 3},
        { id: '6H', rank: 6, value: 6, suit: 'H', suitInt: 3},
        { id: '7H', rank: 7, value: 7, suit: 'H', suitInt: 3},
        { id: '8H', rank: 8, value: 8, suit: 'H', suitInt: 3},
        { id: '9H', rank: 9, value: 9, suit: 'H', suitInt: 3},
        { id: 'TH', rank: 10, value: 10, suit: 'H', suitInt: 3},
        { id: 'JH', rank: 11, value: 11, suit: 'H', suitInt: 3},
        { id: 'QH', rank: 12, value: 12, suit: 'H', suitInt: 3},
        { id: 'KH', rank: 13, value: 13, suit: 'H', suitInt: 3}
    ];

    this.GetCards = function () {
        return cards;
    }

    this.GetCardFromString = function (cardString) {
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].id == cardString) {
                return cards[i];
            }
        }
        return null;
    }

    this.GetGameState = function() {
        var gameStateString = "";
        gameStateString += this.skillLevel;
        gameStateString += "," + this.currentDecisionIndex;
        gameStateString += "," + this.losingScore;
        gameStateString += "," + this.currentMoveStage;
        gameStateString += "," + this.roundNumber;
        gameStateString += "," + this.leadIndex;
        gameStateString += "," + this.turnIndex;
        gameStateString += "," + this.isHeartsBroken;
        gameStateString += "\n";
        
        for (var i=0; i<this.cardsPlayedThisRound.length; i++) {
            gameStateString += this.cardsPlayedThisRound[i].id + ".";
        }
        gameStateString += "\n";

        for (var i=0; i<this.trickCards.length; i++) {
            gameStateString += this.trickCards[i].id + ".";
        }
        gameStateString += "\n";

        for (var i=0; i<4; i++) {
            var player = this.players[i];
            gameStateString += player.name + "," + player.isHuman + "," + player.skillLevel + "," + player.playerPosition + "," + player.playerPositionInt + "," + player.currentRoundPoints + "," + player.gameScore + ",";
            for (var j=0; j<player.cards.length; j++) {
                var card = player.cards[j];
                gameStateString += card.id + ".";
            }
            gameStateString += ",";
            for (var j=0; j<player.passingCards.length; j++) {
                var card = player.passingCards[j];
                gameStateString += card.id + ".";
            }
            gameStateString += ",";
            for (var j=0; j<player.receivedCards.length; j++) {
                var card = player.receivedCards[j];
                gameStateString += card.id + ".";
            }
            gameStateString += ",";
            for (var j=0; j<player.isShownVoidInSuit.length; j++) {
                gameStateString += player.isShownVoidInSuit[j] + ".";
            }
            gameStateString += "\n";
        }

        for (var i=0; i<this.roundScores.length; i++) {
            gameStateString += this.roundScores[i][0] + "." + this.roundScores[i][1] + "." + this.roundScores[i][2] + "." + this.roundScores[i][3] + ",";
        }
        gameStateString += "\n";

        return gameStateString;
    }

    this.InitializeSimulations = function() {
        this.gamesSimulated = 0;
        this.players = [];
        for (var i=0; i<4; i++) {
            this.players.push(new HeartsPlayer());
        }
        this.InitializeGame(this.opponentSkillLevels[this.gamesSimulated%this.opponentSkillLevels.length]);
    }

    this.InitializeGame = function(difficulty) {
        // Game properties
        this.skillLevel = difficulty;
        this.cardsPlayedThisRound = [];
        this.trickCards = [];
        this.roundNumber = 0;
        this.currentMoveStage = 'Initial';
        this.roundScores = [];

        this.players[0].Initialize('You', true, 'Custom', 'South');
        switch(difficulty)
        {
            case 'Easy':
            {
                this.players[1].Initialize('Conrad', false, difficulty, 'West');
                this.players[2].Initialize('Louisa', false, difficulty, 'North');
                this.players[3].Initialize('Davina', false, difficulty, 'East');
            }
            break;
            case 'Standard':
            {
                this.players[1].Initialize('Catalina', false, difficulty, 'West');
                this.players[2].Initialize('Amelia', false, difficulty, 'North');
                this.players[3].Initialize('Seward', false, difficulty, 'East');
            }
            break;
            default:
            {
                this.players[1].Initialize('Charlotte', false, difficulty, 'West');
                this.players[2].Initialize('Dixon', false, difficulty, 'North');
                this.players[3].Initialize('Isabella', false, difficulty, 'East');
            }
            break;
        }
    }

    function shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
    }

    this.PlayCard = function(card) {
        var player = this.players[this.turnIndex%4];
        if (card.suit === 'H') {
            this.isHeartsBroken = true;
        }

        this.cardsPlayedThisRound.push(card);
        if (this.trickCards.length !== 0) {
            var leadCard = this.trickCards[0];
            if (card.suit !== leadCard.suit) {
                player.isShownVoidInSuit[leadCard.suitInt] = true;
            }
        }

        player.cards.splice(player.cards.indexOf(card), 1);
        this.trickCards.push(card);
        this.turnIndex = this.turnIndex + 1;
    }

    this.GetLegalCardsForCurrentPlayerTurn = function() {
        var legalCards = [];
        var player = this.players[this.turnIndex%4];
        if (this.trickCards.length === 0 && player.cards.length === 13) {
            for (var i=0; i<player.cards.length; i++) {
                var card = player.cards[i];
                if (card.id === '2C') {
                    legalCards.push(card);
                    return legalCards;
                }
            }
        } else {
            if (this.trickCards.length === 0) {
                for (var i=0; i<player.cards.length; i++) {
                    var card = player.cards[i];
                    if (this.isHeartsBroken || card.suit != 'H') {
                        legalCards.push(card);
                    }
                }
            } else {
                var leadCard = this.trickCards[0];
                for (var i=0; i<player.cards.length; i++) {
                    var card = player.cards[i];
                    if (card.suit === leadCard.suit) {
                        legalCards.push(card);
                    }
                }
            }

            if (legalCards.length === 0) {
                for (var i=0; i<player.cards.length; i++) {
                    var card = player.cards[i];
                    if (player.cards.length === 13) {
                        if (card.suit === 'H' || card.id === 'QS') {
                            continue;
                        }
                    }
                    legalCards.push(card);
                }
            }
        }

        return legalCards;
    }

    this.GetTrickResult = function() {
        var trickResult = {};
        trickResult.highestCard = this.trickCards[0];
        trickResult.trickTaker = this.players[this.leadIndex];
        trickResult.points = 0;
        if (trickResult.highestCard.id === 'QS') {
            trickResult.points = 13;
        } else if (trickResult.highestCard.suit === 'H') {
            trickResult.points = 1;
        }
        for (var i=1; i<this.trickCards.length; i++) {
            var card = this.trickCards[i];
            if (card.id === 'QS') {
                trickResult.points = trickResult.points + 13;
            } else if (card.suit === 'H') {
                trickResult.points = trickResult.points + 1;
            }
            if (card.suit === trickResult.highestCard.suit && card.value > trickResult.highestCard.value) {
                trickResult.highestCard = card;
                trickResult.trickTaker = this.players[(this.leadIndex + i)%4];
            }
        }
        return trickResult;
    }

    this.FinishRound = function() {
        var moonShootPlayer = null;
        var aRoundScores = [];
        for (var i=0; i<4; i++) {
            if (this.players[i].currentRoundPoints === 26) {
                moonShootPlayer = this.players[i];
                for (var j=0; j<4; j++) {
                    if (j === i) {
                        aRoundScores.push(0);
                        continue;
                    }
                    this.players[j].gameScore += 26;
                    aRoundScores.push(26);
                }
                break;
            }
        }

        if (moonShootPlayer === null) {
            for (var i=0; i<4; i++) {
                this.players[i].gameScore += this.players[i].currentRoundPoints;
                aRoundScores.push(this.players[i].currentRoundPoints);
            }
        }

        this.roundScores.push(aRoundScores);

        for (var i=0; i<4; i++) {
            this.players[i].currentRoundPoints = 0;
        }

        if (moonShootPlayer !== null) {
            if (moonShootPlayer.isHuman) {
                // Update the moons shot statistic
                this.stats.moonsShot[this.skillLevel] += 1;
            }
        }

        var winner = this.TryToGetWinningPlayer();
        if (winner !== null) {
            this.OnGameOver(winner);
        } else {
            this.StepFromInitial();
        }
    }

    this.TryToGetWinningPlayer = function() {
        for (var i=0; i<4; i++) {
            if (this.players[i].gameScore >= this.losingScore) {
                // Check to be sure that someone is the winner
                var p = [];
                for (var j=0; j<4; j++) {
                    p.push(this.players[j]);
                }
                p.sort(function(a,b) { 
                    return a.gameScore - b.gameScore;
                });
                var winner = p[0];
                if (winner.gameScore < p[1].gameScore) {
                    return winner;
                }
                return null;
            }
        }
        return null;
    }

    this.OnGameOver = function(winner) {
        this.gamesSimulated += 1;
        this.stats.gamesPlayed[this.skillLevel] += 1;
        var humanPlayerPlace = this.GetTheHumanPlayersPlace();
        switch (humanPlayerPlace) {
            case 1:
                this.stats.wins[this.skillLevel] += 1;
                break;
            case 2:
                this.stats.seconds[this.skillLevel] += 1;
                break;
            case 3:
                this.stats.thirds[this.skillLevel] += 1;
                break;
            case 4:
                this.stats.fourths[this.skillLevel] += 1;
                break;
        }

        postSimulationStats(this.stats);
        this.InitializeGame(this.opponentSkillLevels[this.gamesSimulated%this.opponentSkillLevels.length]);
        this.StepFromInitial();
    }

    this.GetTheHumanPlayersPlace = function() {
        var p = [];
        for (var j=0; j<4; j++) {
            p.push(this.players[j]);
        }
        p.sort(function(a,b) { 
            return a.gameScore - b.gameScore;
        });
        for (var i=0; i<4; i++) {
            if (p[i].isHuman) {
                return i+1;
            }
        }
        return 0;
    }

    this.StepToNextDecision = function() {
        console.log('Stepping to next decision');
        switch (this.currentMoveStage) {
            case 'Initial':
                this.StepFromInitial();
                break;
            case 'ChoosingPassCards':
                this.StepFromChoosePassingCards();
                break;
            case 'ChoosingTrickCard':
                this.StepFromChoosingTrickCard();
                break;
        }
    }

    this.StepFromInitial = function() {
        // Game was just created
        this.roundNumber = this.roundNumber + 1;
        this.trickCards = [];
        for (var i=0; i<this.players.length; i++) {
            var player = this.players[i];
            player.cards = [];
            player.passingCards = [];
            player.receivedCards = [];
            player.currentRoundPoints = 0;
            player.isShownVoidInSuit = [false,false,false,false];
        }

        // Deal cards for round
        this.isHeartsBroken = false;
        this.cardsPlayedThisRound = [];
        shuffle(cards);
        deckTopIndex = cards.length-1;
        for (var i=0; i<13; i++) {
            for (var j=0; j<4; j++) {
                this.players[j].cards.push(cards[deckTopIndex]);
                deckTopIndex = deckTopIndex-1;
            }
        }

        // Sort the players hand
        this.players[0].cards.sort(function(a,b) {
            if (a.suit != b.suit) {
                return a.suitInt - b.suitInt;
            } else {
                return a.value - b.value;
            }
        });

        var passingIndex = this.roundNumber % 4;
        if (passingIndex == 0) {
            // Start trick taking
            // Determine the lead index player
            for (var i=0; i<this.players.length; i++) {
                var leadFound = false;
                var player = this.players[i];
                for (var j=0; j<player.cards.length; j++) {
                    var card = player.cards[j];
                    if (card.id === '2C') {
                        leadFound = true;
                        this.leadIndex = i;
                        break;
                    }
                }
                if (leadFound) {
                    break;
                }
            }

            this.turnIndex = this.leadIndex;
            this.trickCards = [];
            var nextPlayer = this.players[this.turnIndex%4];
            while (!nextPlayer.isHuman) {
                var card = nextPlayer.FindBestPlayingCard(this, nextPlayer.skillLevel, false);
                this.PlayCard(card);
                nextPlayer = this.players[this.turnIndex%4];
            }

            this.currentDecisionIndex = 1;
            this.currentMoveStage = "ChoosingTrickCard";
        } else {
            this.currentDecisionIndex = 0;
            this.currentMoveStage = 'ChoosingPassCards';
        }
    }

    this.StepFromChoosePassingCards = function() {
        // Use custom decision
        try {
            var player = this.players[0];
            var customMethod = this.decisionMethods[this.currentDecisionIndex];
            // Remove the first and last line of the code
            customMethod = customMethod.substring(customMethod.indexOf("{") + 1);
            customMethod = customMethod.substring(customMethod.lastIndexOf("}"), -1);
            var f = new Function('cards', 'game', customMethod);
            var allCards = player.cards.concat(player.passingCards);
            var bestCards = f(allCards, this);
            if (bestCards == undefined) {
                throw "Custom decision failed.";
            }
            for (var i=0; i<bestCards.length; i++) {
                player.passingCards.push(bestCards[i]);
                var indexOfBestCard = player.cards.indexOf(bestCards[i]);
                player.cards.splice(indexOfBestCard, 1);
            }
        } catch (err) {
            throw err;
        }

        // Get passing cards for the rest of the players
        for (var i=1; i<4; i++) {
            var player = this.players[i];
            player.SelectPassingCards();
        }
        
        // Pass cards
        var passingIndex = this.roundNumber % 4;
        switch (passingIndex) {
            case 1: {
                // Pass left
                for (var i=0; i<4; i++) {
                    var player = this.players[i];
                    var passPlayer = this.players[(i+1)%4];
                    for (var j=0; j<player.passingCards.length; j++) {
                        var idx = Math.floor(Math.random() * Math.floor(passPlayer.cards.length));
                        passPlayer.cards.splice(idx, 0, player.passingCards[j]);
                    }
                    passPlayer.receivedCards = [];
                    for (var j=0; j<player.passingCards.length; j++) {
                        passPlayer.receivedCards.push(player.passingCards[j]);
                    }
                    player.passingCards = [];
                }
            } break;
            case 2: {
                // Pass right
                for (var i=0; i<4; i++) {
                    var player = this.players[i];
                    var passPlayer = this.players[(i-1+4)%4];
                    for (var j=0; j<player.passingCards.length; j++) {
                        var idx = Math.floor(Math.random() * Math.floor(passPlayer.cards.length));
                        passPlayer.cards.splice(idx, 0, player.passingCards[j]);
                    }
                    passPlayer.receivedCards = [];
                    for (var j=0; j<player.passingCards.length; j++) {
                        passPlayer.receivedCards.push(player.passingCards[j]);
                    }
                    player.passingCards = [];
                }
            } break;
            case 3: {
                // Pass across
                for (var i=0; i<4; i++) {
                    var player = this.players[i];
                    var passPlayer = this.players[(i+2)%4];
                    for (var j=0; j<player.passingCards.length; j++) {
                        var idx = Math.floor(Math.random() * Math.floor(passPlayer.cards.length));
                        passPlayer.cards.splice(idx, 0, player.passingCards[j]);
                    }
                    passPlayer.receivedCards = [];
                    for (var j=0; j<player.passingCards.length; j++) {
                        passPlayer.receivedCards.push(player.passingCards[j]);
                    }
                    player.passingCards = [];
                }
            } break;
            default:
                break;
        }

        // Start trick taking
        // Determine the lead index player
        for (var i=0; i<this.players.length; i++) {
            var leadFound = false;
            var player = this.players[i];
            for (var j=0; j<player.cards.length; j++) {
                var card = player.cards[j];
                if (card.id === '2C') {
                    leadFound = true;
                    this.leadIndex = i;
                    break;
                }
            }
            if (leadFound) {
                break;
            }
        }

        this.turnIndex = this.leadIndex;
        this.trickCards = [];
        var nextPlayer = this.players[this.turnIndex%4];
        while (!nextPlayer.isHuman) {
            var card = nextPlayer.FindBestPlayingCard(this, nextPlayer.skillLevel, false);
            this.PlayCard(card);
            nextPlayer = this.players[this.turnIndex%4];
        }

        this.currentDecisionIndex = 1;
        this.currentMoveStage = "ChoosingTrickCard";
    }

    this.StepFromChoosingTrickCard = function() {
        // Use custom decision
        try {
            var player = this.players[0];
            var customMethod = this.decisionMethods[this.currentDecisionIndex];
            // Remove the first and last line of the code
            customMethod = customMethod.substring(customMethod.indexOf("{") + 1);
            customMethod = customMethod.substring(customMethod.lastIndexOf("}"), -1);
            var f = new Function('cards', 'game', customMethod);
            var bestCard = f(this.cards, this);
            if (bestCard == undefined) {
                throw "Custom decision failed.";
            }
            this.PlayCard(bestCard);

        } catch (err) {
            throw err;
        }

        // Finish the trick
        while (this.trickCards.length < 4) {
            var nextPlayer = this.players[this.turnIndex%4];
            var card = nextPlayer.FindBestPlayingCard(this, nextPlayer.skillLevel, false);
            this.PlayCard(card);
        }

        // Process the trick result
        var trickResult = this.GetTrickResult();
        trickResult.trickTaker.currentRoundPoints += trickResult.points;
        this.leadIndex = trickResult.trickTaker.playerPositionInt;
        this.turnIndex = this.leadIndex;

        if (this.players[0].cards.length !== 0) {
            this.trickCards = [];
            this.turnIndex = this.leadIndex;
            this.trickCards = [];
            var nextPlayer = this.players[this.turnIndex%4];
            while (!nextPlayer.isHuman) {
                var card = nextPlayer.FindBestPlayingCard(this, nextPlayer.skillLevel, false);
                this.PlayCard(card);
                nextPlayer = this.players[this.turnIndex%4];
            }
    
            this.currentDecisionIndex = 1;
            this.currentMoveStage = "ChoosingTrickCard";
        } else {
            this.FinishRound();
        }

    }
}

/*
*
*  Game Simulator
*
*/
var HeartsFindOptimalPlayForCurrentPlayer = function(aGame, isForHint) {
    
    var maxSimulations = 1000;
    var simsPerPossiblePlay = 200;
    
    if (isForHint) {
        maxSimulations = 5000*3;
        simsPerPossiblePlay = 1000*3;
    }

    // Create a game state copy that can be manipulated and restored to simulate outcomes
    var simGame = {};
    simGame.skillLevel = 'Standard';
    simGame.isHeartsBroken = aGame.isHeartsBroken;
    simGame.losingScore = aGame.losingScore;
    simGame.cardsPlayedThisRound = [];
    simGame.trickCards = [];
    simGame.players = [];
    var player = new HeartsPlayer();
    player.Initialize('You', true, 'Standard', 'South');
    simGame.players.push(player);
    player = new HeartsPlayer();
    player.Initialize('Catalina', false, 'Standard', 'West');
    simGame.players.push(player);
    player = new HeartsPlayer();
    player.Initialize('Amelia', false, 'Standard', 'North');
    simGame.players.push(player);
    player = new HeartsPlayer();
    player.Initialize('Seward', false, 'Standard', 'East');
    simGame.players.push(player);
    
    var currentPlayer = aGame.players[aGame.turnIndex%4];
    var currentSimPlayer = simGame.players[aGame.turnIndex%4];

    // Set the game deck of cards to only have the cards remaining
    var gameCards = aGame.GetCards();
    var cardsRemaining = [];
    for (var i=0; i<gameCards.length; i++) {
        var isAlreadyPlayed = false;
        for (var j=0; j<aGame.cardsPlayedThisRound.length; j++) {
            if (aGame.cardsPlayedThisRound[j].id === gameCards[i].id) {
                isAlreadyPlayed = true;
                break;
            }
        }
        if (isAlreadyPlayed) {
            continue;
        }
        for (var j=0; j<currentPlayer.cards.length; j++) {
            if (currentPlayer.cards[j].id === gameCards[i].id) {
                isAlreadyPlayed = true;
                break;
            }
        }
        if (isAlreadyPlayed) {
            continue;
        }
        
        cardsRemaining.push(gameCards[i]);
    }
  
    var possiblePlays = aGame.GetLegalCardsForCurrentPlayerTurn();
    var possiblePlaysCumulativePoints = [];
    for (var i=0; i<possiblePlays.length; i++) {
        possiblePlaysCumulativePoints.push(0);
    }

    if (possiblePlays.length*simsPerPossiblePlay > maxSimulations) {
        simsPerPossiblePlay = Math.floor(maxSimulations / possiblePlays.length);
    }

    for (var i=0; i<possiblePlays.length; i++) {
        // For each possible play,
        // make the play and then simulate out to the end of the round
        // with each player using the Standard skill level decision making
        // Then Restore the game state
        for (var simCount = 0; simCount < simsPerPossiblePlay; simCount++) {
            // Reset the sim game state
            for (var k=0; k<4; k++) {
                var player = aGame.players[k];
                var simPlayer = simGame.players[k];
                simPlayer.skillLevel = 'Standard';
                simPlayer.currentRoundPoints = player.currentRoundPoints;
                simPlayer.cards = [];
                simPlayer.isShownVoidInSuit = [player.isShownVoidInSuit[0], player.isShownVoidInSuit[1], player.isShownVoidInSuit[2], player.isShownVoidInSuit[3]];
            }
            simGame.trickCards = [].concat(aGame.trickCards);
            simGame.roundNumber = aGame.roundNumber;
            simGame.leadIndex = aGame.leadIndex;
            simGame.turnIndex = aGame.turnIndex;
            simGame.isHeartsBroken = aGame.isHeartsBroken;

            // Shuffle the deck
            var deckIdx = 0;
            for (var k = cardsRemaining.length - 1; k > 0; k--) {
                var randIdx = Math.floor(Math.random() * (k + 1));
                x = cardsRemaining[k];
                cardsRemaining[k] = cardsRemaining[randIdx];
                cardsRemaining[randIdx] = x;
            }

            for (var n=0; n<currentPlayer.cards.length; n++) {
                currentSimPlayer.cards.push(currentPlayer.cards[n]);
            }

            // Play the next possible play card
            var card = possiblePlays[i];
            if (card.suit === 'H') {
                simGame.isHeartsBroken = true;
            }
            if (simGame.trickCards.length !== 0) {
                var leadCard = simGame.trickCards[0];
                if (card.suit !== leadCard.suit) {
                    currentSimPlayer.isShownVoidInSuit[leadCard.suitInt] = true;
                }
            }
            currentSimPlayer.cards.splice(currentSimPlayer.cards.indexOf(card), 1);
            simGame.trickCards.push(card);
            simGame.turnIndex = simGame.turnIndex + 1;

            // Deal the remaining cards to the rest of the players
            var idx = aGame.turnIndex;
            for (var deckIdx = 0; deckIdx<cardsRemaining.length; deckIdx++) {
                idx++;
                var simPlayer = simGame.players[idx%4];
                if (simPlayer === currentSimPlayer) {
                    deckIdx--;
                    continue;
                }
                simPlayer.cards.push(cardsRemaining[deckIdx]);
            }

            // Assure that no player has a card they are supposed to be void
            for (var j=0; j<4; j++) {
                var simPlayer = simGame.players[j];
                if (simPlayer.playerPosition === currentSimPlayer.playerPosition) {
                    continue;
                }
                for (var k=0; k<simPlayer.cards.length; k++) {
                    var aCard = simPlayer.cards[k];
                    if (simPlayer.isShownVoidInSuit[aCard.suitInt]) {
                        // Swap the card with the first possible neighbor
                        var swapCardFound = false;
                        for (var n=1; n<4; n++) {
                            var neighborPlayer = simGame.players[(j+n)%4];
                            if (neighborPlayer.playerPosition === currentSimPlayer.playerPosition) {
                                continue;
                            }
                            if (!neighborPlayer.isShownVoidInSuit[aCard.suitInt]) {
                                for (var m=0; m<neighborPlayer.cards.length; m++) {
                                    var cardToSwap = neighborPlayer.cards[m];
                                    if (!simPlayer.isShownVoidInSuit[cardToSwap.suitInt]) {
                                        swapCardFound = true;
                                        simPlayer.cards.splice(k,1);
                                        simPlayer.cards.push(cardToSwap);
                                        neighborPlayer.cards.splice(m, 1);
                                        neighborPlayer.cards.push(aCard);
                                        break;
                                    }
                                }
                            }
                            if (swapCardFound) {
                                break;
                            }
                        }
                    }
                }
            }

            // Finish the round
            var firstPass = true;
            while (firstPass || currentSimPlayer.cards.length > 0) {
                firstPass = false;
                // Finish the trick
                while (simGame.trickCards.length < 4) {
                    var nextPlayer = simGame.players[simGame.turnIndex%4];
                    var nextCard = HeartsFindStandardPlayForGameSimulator(simGame);
                    // Play the Card
                    if (nextCard.suit === 'H') {
                        simGame.isHeartsBroken = true;
                    }
                    if (simGame.trickCards.length !== 0) {
                        var leadCard = simGame.trickCards[0];
                        if (nextCard.suit !== leadCard.suit) {
                            nextPlayer.isShownVoidInSuit[leadCard.suitInt] = true;
                        }
                    }

                    nextPlayer.cards.splice(nextPlayer.cards.indexOf(nextCard), 1);
                    simGame.trickCards.push(nextCard);
                    simGame.turnIndex = simGame.turnIndex + 1;
                }

                // GetTrickResult
                var trickResult = {};
                trickResult.highestCard = simGame.trickCards[0];
                trickResult.trickTaker = simGame.players[simGame.leadIndex];
                trickResult.points = 0;
                if (trickResult.highestCard.id === 'QS') {
                    trickResult.points = 13;
                } else if (trickResult.highestCard.suit === 'H') {
                    trickResult.points = 1;
                }
                for (var n=1; n<simGame.trickCards.length; n++) {
                    var card = simGame.trickCards[n];
                    if (card.id === 'QS') {
                        trickResult.points =  trickResult.points + 13;
                    } else if (card.suit === 'H') {
                        trickResult.points = trickResult.points + 1;
                    }
                    if (card.suit === trickResult.highestCard.suit && card.value > trickResult.highestCard.value) {
                        trickResult.highestCard = card;
                        trickResult.trickTaker = simGame.players[(simGame.leadIndex + n)%4];
                    }
                }
                trickResult.trickTaker.currentRoundPoints += trickResult.points;
                simGame.leadIndex = trickResult.trickTaker.playerPositionInt;
                simGame.turnIndex = simGame.leadIndex;
                simGame.trickCards = [];
            }

            // Correct for moon shots
            if (currentSimPlayer.currentRoundPoints == 26) {
                currentSimPlayer.currentRoundPoints = 0;
            } else {
                for (var k=0; k<4; k++) {
                    var aPlayer = simGame.players[k];
                    if (aPlayer != currentSimPlayer) {
                        if (aPlayer.currentRoundPoints == 26) {
                            currentSimPlayer.currentRoundPoints = 26;
                        }
                    }
                }
            }
            possiblePlaysCumulativePoints[i] += currentSimPlayer.currentRoundPoints;
        }
    }

    var optimalPlayResult = [];
    optimalPlayResult.possibleCards = possiblePlays;
    optimalPlayResult.possibleCardsScores = [];
    var curBestPoints = Number.MAX_SAFE_INTEGER;
    var curBestScore = 0;
    var curWorstScore = -1;
    var curBestPlayIndex = 0;
    for (var i=0; i<possiblePlays.length; i++) {
        var mean = possiblePlaysCumulativePoints[i]/simsPerPossiblePlay;
        if (possiblePlaysCumulativePoints[i] < curBestPoints) {
            curBestPoints = possiblePlaysCumulativePoints[i];
            curBestPlayIndex = i;
            curBestScore = mean;
        }
        optimalPlayResult.possibleCardsScores.push(mean);
        if (curWorstScore < mean) {
            curWorstScore = mean;
        }
    }
    optimalPlayResult.optimalCard = possiblePlays[curBestPlayIndex];
    optimalPlayResult.optimalScore = curBestScore;
    optimalPlayResult.worstScore = curWorstScore;

    return optimalPlayResult;
}

var HeartsFindStandardPlayForGameSimulator = function(aGame) {
    var possiblePlays = HeartsGetLegalCardsForCurrentPlayerTurnInGameSimulator(aGame);
    
    if (aGame.trickCards.length === 0) {
        // Lead with the lowest card value possible
        var play = possiblePlays[0];
        for (var i=1; i<possiblePlays.length; i++) {
            var possiblePlay = possiblePlays[i];
            if (possiblePlay.value < play.value) {
                play = possiblePlay;
            }
        }
        return play;
    } else {
        var leadCard = aGame.trickCards[0];
        var play = possiblePlays[0];
        if (play.suit === leadCard.suit) {
            // Must play the same suit
            possiblePlays.sort(function(a,b) { 
                return a.value - b.value;
            });

            var highestCardInTrick = leadCard;
            for (var i=1; i<aGame.trickCards.length; i++) {
                var playedCard = aGame.trickCards[i];
                if (playedCard.suit === leadCard.suit && playedCard.value > highestCardInTrick.value) {
                    highestCardInTrick = playedCard;
                }
            }

            if (aGame.trickCards.length<3) {
                // Play the highest card that will not take the hand
                var curPlay = possiblePlays[0];
                if (curPlay.value > highestCardInTrick) {
                    // We have to play our lowest card and hope the next person is higher
                    return curPlay;
                } else {
                    // Play the highest value that is less than the current highest card in the trick
                    for (var i=1; i<possiblePlays.length; i++) {
                        var possibleCard = possiblePlays[i];
                        if (possibleCard.value < highestCardInTrick.value) {
                            curPlay = possibleCard;
                        }
                    }
                    return curPlay;
                }
            } else {
                var curTrickPoints = 0;
                for (var i=0; i<aGame.trickCards.length; i++) {
                    var card = aGame.trickCards[i];
                    if (card.suit === 'H') {
                        curTrickPoints = curTrickPoints + 1;
                    } else if (card.id === 'QS') {
                        curTrickPoints = curTrickPoints + 13;
                    }
                }

                if (curTrickPoints === 0) {
                    // No points so we can play the highest card of suit
                    var highestCard = possiblePlays[possiblePlays.length-1];
                    if (highestCard.id === 'QS' && possiblePlays.length > 1) {
                        highestCard = possiblePlays[possiblePlays.length-2];
                    }
                    return highestCard;
                } else {
                    // Try to not take the trick but if we must, then play the highest card
                    var curPlay = possiblePlays[0];
                    if (curPlay.value > highestCardInTrick.value) {
                        // play our highest card
                        var highestCard = possiblePlays[possiblePlays.length-1];
                        if (highestCard.id === 'QS' && possiblePlays.length > 1) {
                            highestCard = possiblePlays[possiblePlays.length-2];
                        }
                        return highestCard;
                    } else {
                        // Play the highest value that is less than the current highest card in the trick
                        for (var i=1; i<possiblePlays.length; i++) {
                            var possibleCard = possiblePlays[i];
                            if (possibleCard.value < highestCardInTrick.value) {
                                curPlay = possibleCard;
                            }
                        }
                        return curPlay;
                    }
                }
            }
        } else {
            // Play the highest valued card we have
            possiblePlays.sort(function(a,b) { 
                // Queen of spades is highest
                if (a.id === 'QS') {
                    return -1;
                } else if (b.id === 'QS') {
                    return 1;
                }
                // Otherwise prefer AS and KS over hearts
                if (a.value === b.value) {
                    if (a.value >= 12) {
                        if (a.suit === 'S') {
                            return -1;
                        } else if (b.suit === 'S') {
                            return 1;
                        } else {
                            return b.suitInt - a.suitInt;
                        }
                    } else {
                        return b.suitInt - a.suitInt;
                    }
                } else {
                    return b.value - a.value;
                }
            });
            return possiblePlays[0];
        }
    }
}

var HeartsGetLegalCardsForCurrentPlayerTurnInGameSimulator = function(aGame) {
    var legalCards = [];
    var player = aGame.players[aGame.turnIndex%4];
    if (aGame.trickCards.length === 0 && player.cards.length === 13) {
        for (var i=0; i<player.cards.length; i++) {
            var card = player.cards[i];
            if (card.id === '2C') {
                legalCards.push(card);
                return legalCards;
            }
        }
    } else {
        if (aGame.trickCards.length === 0) {
            for (var i=0; i<player.cards.length; i++) {
                var card = player.cards[i];
                if (aGame.isHeartsBroken || card.suit != 'H') {
                    legalCards.push(card);
                }
            }
        } else {
            var leadCard = aGame.trickCards[0];
            for (var i=0; i<player.cards.length; i++) {
                var card = player.cards[i];
                if (card.suit === leadCard.suit) {
                    legalCards.push(card);
                }
            }
        }

        if (legalCards.length === 0) {
            for (var i=0; i<player.cards.length; i++) {
                var card = player.cards[i];
                if (player.cards.length === 13) {
                    if (card.suit === 'H' || card.id === 'QS') {
                        continue;
                    }
                }
                legalCards.push(card);
            }
        }
    }

    return legalCards;
}