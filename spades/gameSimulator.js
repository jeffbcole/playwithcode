var SpadesGameSimulator = function (aSettings, aDecisionMethods) {
    
        // Global Game Settings
        this.settings = aSettings;
        this.decisionMethods = aDecisionMethods;
        
        // Members
        this.currentMoveStage = "";
        this.currentDecisionIndex = 0;
        this.skillLevel = "";
        this.winningScore = this.settings.winningScore;
        this.isSpadesBroken = false;
        this.players = [];
        this.trickCards = [];
        this.roundNumber = 0;
        this.dealerIndex = 0;
        this.leadIndex = 0;
        this.turnIndex = 0;
        this.cardsPlayedThisRound = [];
        this.roundScores = [];
        this.roundBids = [];
        this.roundTricksTaken = [];
    
        this.gamesSimulated = 0;
        this.opponentSkillLevels =  ['Standard']; // TODO: ['Easy', 'Standard', 'Pro'];
        this.stats = {
            'gamesPlayed': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
            'wins': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
            'seconds': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
            'thirds': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
            'fourths': { 'Easy': 0, 'Standard': 0, 'Pro': 0}
        }
    
        var deckTopIndex = 0;
        var cards = [
            { id: 'AS', rank: 1, value: 14, suit: 'S', suitInt: 3, image: "url('shared/images/Card_Spade_Ace.jpg')" },
            { id: '2S', rank: 2, value: 2, suit: 'S', suitInt: 3, image: "url('shared/images/Card_Spade_2.jpg')" },
            { id: '3S', rank: 3, value: 3, suit: 'S', suitInt: 3, image: "url('shared/images/Card_Spade_3.jpg')" },
            { id: '4S', rank: 4, value: 4, suit: 'S', suitInt: 3, image: "url('shared/images/Card_Spade_4.jpg')" },
            { id: '5S', rank: 5, value: 5, suit: 'S', suitInt: 3, image: "url('shared/images/Card_Spade_5.jpg')" },
            { id: '6S', rank: 6, value: 6, suit: 'S', suitInt: 3, image: "url('shared/images/Card_Spade_6.jpg')" },
            { id: '7S', rank: 7, value: 7, suit: 'S', suitInt: 3, image: "url('shared/images/Card_Spade_7.jpg')" },
            { id: '8S', rank: 8, value: 8, suit: 'S', suitInt: 3, image: "url('shared/images/Card_Spade_8.jpg')" },
            { id: '9S', rank: 9, value: 9, suit: 'S', suitInt: 3, image: "url('shared/images/Card_Spade_9.jpg')" },
            { id: 'TS', rank: 10, value: 10, suit: 'S', suitInt: 3, image: "url('shared/images/Card_Spade_10.jpg')" },
            { id: 'JS', rank: 11, value: 11, suit: 'S', suitInt: 3, image: "url('shared/images/Card_Spade_Jack.jpg')" },
            { id: 'QS', rank: 12, value: 12, suit: 'S', suitInt: 3, image: "url('shared/images/Card_Spade_Queen.jpg')" },
            { id: 'KS', rank: 13, value: 13, suit: 'S', suitInt: 3, image: "url('shared/images/Card_Spade_King.jpg')" },
            { id: 'AD', rank: 1, value: 14, suit: 'D', suitInt: 0, image: "url('shared/images/Card_Diamond_Ace.jpg')" },
            { id: '2D', rank: 2, value: 2, suit: 'D', suitInt: 0, image: "url('shared/images/Card_Diamond_2.jpg')" },
            { id: '3D', rank: 3, value: 3, suit: 'D', suitInt: 0, image: "url('shared/images/Card_Diamond_3.jpg')" },
            { id: '4D', rank: 4, value: 4, suit: 'D', suitInt: 0, image: "url('shared/images/Card_Diamond_4.jpg')" },
            { id: '5D', rank: 5, value: 5, suit: 'D', suitInt: 0, image: "url('shared/images/Card_Diamond_5.jpg')" },
            { id: '6D', rank: 6, value: 6, suit: 'D', suitInt: 0, image: "url('shared/images/Card_Diamond_6.jpg')" },
            { id: '7D', rank: 7, value: 7, suit: 'D', suitInt: 0, image: "url('shared/images/Card_Diamond_7.jpg')" },
            { id: '8D', rank: 8, value: 8, suit: 'D', suitInt: 0, image: "url('shared/images/Card_Diamond_8.jpg')" },
            { id: '9D', rank: 9, value: 9, suit: 'D', suitInt: 0, image: "url('shared/images/Card_Diamond_9.jpg')" },
            { id: 'TD', rank: 10, value: 10, suit: 'D', suitInt: 0, image: "url('shared/images/Card_Diamond_10.jpg')" },
            { id: 'JD', rank: 11, value: 11, suit: 'D', suitInt: 0, image: "url('shared/images/Card_Diamond_Jack.jpg')" },
            { id: 'QD', rank: 12, value: 12, suit: 'D', suitInt: 0, image: "url('shared/images/Card_Diamond_Queen.jpg')" },
            { id: 'KD', rank: 13, value: 13, suit: 'D', suitInt: 0, image: "url('shared/images/Card_Diamond_King.jpg')" },
            { id: 'AC', rank: 1, value: 14, suit: 'C', suitInt: 1, image: "url('shared/images/Card_Club_Ace.jpg')" },
            { id: '2C', rank: 2, value: 2, suit: 'C', suitInt: 1, image: "url('shared/images/Card_Club_2.jpg')" },
            { id: '3C', rank: 3, value: 3, suit: 'C', suitInt: 1, image: "url('shared/images/Card_Club_3.jpg')" },
            { id: '4C', rank: 4, value: 4, suit: 'C', suitInt: 1, image: "url('shared/images/Card_Club_4.jpg')" },
            { id: '5C', rank: 5, value: 5, suit: 'C', suitInt: 1, image: "url('shared/images/Card_Club_5.jpg')" },
            { id: '6C', rank: 6, value: 6, suit: 'C', suitInt: 1, image: "url('shared/images/Card_Club_6.jpg')" },
            { id: '7C', rank: 7, value: 7, suit: 'C', suitInt: 1, image: "url('shared/images/Card_Club_7.jpg')" },
            { id: '8C', rank: 8, value: 8, suit: 'C', suitInt: 1, image: "url('shared/images/Card_Club_8.jpg')" },
            { id: '9C', rank: 9, value: 9, suit: 'C', suitInt: 1, image: "url('shared/images/Card_Club_9.jpg')" },
            { id: 'TC', rank: 10, value: 10, suit: 'C', suitInt: 1, image: "url('shared/images/Card_Club_10.jpg')" },
            { id: 'JC', rank: 11, value: 11, suit: 'C', suitInt: 1, image: "url('shared/images/Card_Club_Jack.jpg')" },
            { id: 'QC', rank: 12, value: 12, suit: 'C', suitInt: 1, image: "url('shared/images/Card_Club_Queen.jpg')" },
            { id: 'KC', rank: 13, value: 13, suit: 'C', suitInt: 1, image: "url('shared/images/Card_Club_King.jpg')" },
            { id: 'AH', rank: 1, value: 14, suit: 'H', suitInt: 2, image: "url('shared/images/Card_Heart_Ace.jpg')" },
            { id: '2H', rank: 2, value: 2, suit: 'H', suitInt: 2, image: "url('shared/images/Card_Heart_2.jpg')" },
            { id: '3H', rank: 3, value: 3, suit: 'H', suitInt: 2, image: "url('shared/images/Card_Heart_3.jpg')" },
            { id: '4H', rank: 4, value: 4, suit: 'H', suitInt: 2, image: "url('shared/images/Card_Heart_4.jpg')" },
            { id: '5H', rank: 5, value: 5, suit: 'H', suitInt: 2, image: "url('shared/images/Card_Heart_5.jpg')" },
            { id: '6H', rank: 6, value: 6, suit: 'H', suitInt: 2, image: "url('shared/images/Card_Heart_6.jpg')" },
            { id: '7H', rank: 7, value: 7, suit: 'H', suitInt: 2, image: "url('shared/images/Card_Heart_7.jpg')" },
            { id: '8H', rank: 8, value: 8, suit: 'H', suitInt: 2, image: "url('shared/images/Card_Heart_8.jpg')" },
            { id: '9H', rank: 9, value: 9, suit: 'H', suitInt: 2, image: "url('shared/images/Card_Heart_9.jpg')" },
            { id: 'TH', rank: 10, value: 10, suit: 'H', suitInt: 2, image: "url('shared/images/Card_Heart_10.jpg')" },
            { id: 'JH', rank: 11, value: 11, suit: 'H', suitInt: 2, image: "url('shared/images/Card_Heart_Jack.jpg')" },
            { id: 'QH', rank: 12, value: 12, suit: 'H', suitInt: 2, image: "url('shared/images/Card_Heart_Queen.jpg')" },
            { id: 'KH', rank: 13, value: 13, suit: 'H', suitInt: 2, image: "url('shared/images/Card_Heart_King.jpg')" }
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
            gameStateString += "," + this.winningScore;
            gameStateString += "," + this.currentMoveStage;
            gameStateString += "," + this.roundNumber;
            gameStateString += "," + this.dealerIndex;
            gameStateString += "," + this.leadIndex;
            gameStateString += "," + this.turnIndex;
            gameStateString += "," + this.isSpadesBroken;
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
                gameStateString += player.name + "," + player.isHuman + "," + player.skillLevel + "," + player.playerPosition + "," + player.playerPositionInt + "," + player.currentRoundBid + "," + player.currentRoundTricksTaken + "," + player.gameScore + ",";
                for (var j=0; j<player.cards.length; j++) {
                    var card = player.cards[j];
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
    
            for (var i=0; i<this.roundBids.length; i++) {
                gameStateString += this.roundBids[i][0] + "." + this.roundBids[i][1] + "." + this.roundBids[i][2] + "." + this.roundBids[i][3] + ",";
            }
            gameStateString += "\n";

            for (var i=0; i<this.roundTricksTaken.length; i++) {
                gameStateString += this.roundTricksTaken[i][0] + "." + this.roundTricksTaken[i][1] + "." + this.roundTricksTaken[i][2] + "." + this.roundTricksTaken[i][3] + ",";
            }
            gameStateString += "\n";

            return gameStateString;
        }
    
        this.InitializeSimulations = function() {
            this.gamesSimulated = 0;
            this.players = [];
            for (var i=0; i<4; i++) {
                this.players.push(new SpadesPlayer());
            }
            this.InitializeGame(this.opponentSkillLevels[this.gamesSimulated%this.opponentSkillLevels.length]);
        }

        this.InitializeGame = function(difficulty) {
            // Game properties
            this.skillLevel = difficulty;
            this.winningScore = this.settings.winningScore;
            this.cardsPlayedThisRound = [];
            this.trickCards = [];
            this.roundNumber = 0;
            this.dealerIndex = 0;
            this.leadIndex = 0;
            this.turnIndex = 0;
            this.isSpadesBroken = false;
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
    
        this.GetLegalCardsForCurrentPlayerTurn = function() {
            var legalCards = [];
            var player = this.players[this.turnIndex%4];
            if (this.trickCards.length === 0) {
                for (var i=0; i<player.cards.length; i++) {
                    var card = player.cards[i];
                    if (this.isSpadesBroken || card.suit != 'S') {
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
                        if (card.suit === 'S') {
                            continue;
                        }
                    }
                    legalCards.push(card);
                }
            }
        
    
            return legalCards;
        }
    
        this.PlayCard = function(card) {
            var player = this.players[this.turnIndex%4];
            if (card.suit === 'S') {
                this.isSpadesBroken = true;
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
    
        this.GetTrickResult = function() {
            var trickResult = {};
            trickResult.highestCard = this.trickCards[0];
            trickResult.trickTaker = this.players[this.leadIndex];
            for (var i=1; i<this.trickCards.length; i++) {
                var card = this.trickCards[i];
                if ((card.suit === trickResult.highestCard.suit && card.value > trickResult.highestCard.value) ||
                    (card.suit === 'S' && trickResult.highestCard.suit !== 'S')) {
                    trickResult.highestCard = card;
                    trickResult.trickTaker = this.players[(this.leadIndex + i)%4];
                }
            }
            return trickResult;
        }
    
        this.FinishRound = function() {
            var aRoundScores = [];
            var aRoundBids = [];
            var aRoundTricksTaken = [];
            for (var i=0; i<4; i++) {
                var player = this.players[i];
                aRoundBids.push(player.currentRoundBid);
                aRoundTricksTaken.push(player.currentRoundTricksTaken);
    
                var bagsTaken = 0;
                if (player.currentRoundBid == 0) {
                    if (player.currentRoundTricksTaken == 0) {
                        aRoundScores.push(100);
                    } else {
                        aRoundScores.push(-100);
                    }
                } else if (player.currentRoundTricksTaken < player.currentRoundBid) {
                    aRoundScores.push(0);
                } else {
                    bagsTaken = player.currentRoundTricksTaken - player.currentRoundBid;
                    aRoundScores.push(player.currentRoundBid*10 + bagsTaken);
                }
                
                if(this.settings.sandbaggingPenalty) {
                    if (bagsTaken > 0) {
                        // Penalize for overbags
                        var previousBags = player.gameScore % 10;
                        if (previousBags + bagsTaken > 10) {
                            var score = aRoundScores[i] - 100;
                            aRoundScores[i] = score;
                        }
                    }
                }
    
                player.gameScore += aRoundScores[i];
            }
    
            this.roundScores.push(aRoundScores);
            this.roundBids.push(aRoundBids);
            this.roundTricksTaken.push(aRoundTricksTaken);
            this.dealerIndex += 1;
    
            var winner = this.TryToGetWinningPlayer();
            if (winner !== null) {
                this.OnGameOver(winner);
            } else {
                this.StepFromInitial();
            }
        }
    
        this.TryToGetWinningPlayer = function() {
            for (var i=0; i<4; i++) {
                if (this.players[i].gameScore >= this.winningScore) {
                    // Check to be sure that someone is the winner
                    var p = [];
                    for (var j=0; j<4; j++) {
                        p.push(this.players[j]);
                    }
                    p.sort(function(a,b) { 
                        return b.gameScore - a.gameScore;
                    });
                    var winner = p[0];
                    if (winner.gameScore > p[1].gameScore) {
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
                return b.gameScore - a.gameScore;
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
                case 'ChoosingBids':
                    this.StepFromChoosingBids();
                    break;
                case 'ChoosingTrickCard':
                    this.StepFromChoosingTrickCard();
                    break;
            }
        }

        this.StepFromInitial = function() {
            this.roundNumber = this.roundNumber + 1;
            this.trickCards = [];
            for (var i=0; i<this.players.length; i++) {
                var player = this.players[i];
                player.cards = [];
                player.currentRoundBid = -1;
                player.currentRoundTricksTaken = -1;
                player.isShownVoidInSuit = [false,false,false,false];
            }
    
            // Deal cards for round
            this.isSpadesBroken = false;
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

            // Get the bidding decisions from each player
            this.leadIndex = (this.dealerIndex + 1)%4;
            var currentBiddingPlayer = this.leadIndex;
            var player = this.players[currentBiddingPlayer];
            while (!player.isHuman) {
                var bid = player.FindBestBid(this, player.skillLevel);
                player.currentRoundBid = bid;
                currentBiddingPlayer += 1;
                player = this.players[currentBiddingPlayer%4];
            }

            this.currentDecisionIndex = 0;
            this.currentMoveStage = "ChoosingBids";
        }

        this.StepFromChoosingBids = function() {
            // Use custom decision
            try {
                var player = this.players[0];
                var customMethod = this.decisionMethods[this.currentDecisionIndex];
                // Remove the method signature and paramters from the code
                customMethod = customMethod.substring(customMethod.indexOf("{") + 1);
                customMethod = customMethod.substring(customMethod.lastIndexOf("}"), -1);
                var f = new Function('game', customMethod);
                var bid = f(this);
                if (bid == undefined) {
                    throw "Custom decision failed.";
                }
                player.currentRoundBid = bid;
            } catch (err) {
                throw err;
            }

            // Get the rest of the player bids
            for (var i=1; i<4; i++) {
                var player = this.players[i];
                if (player.currentRoundBid < 0) {
                    var bid = player.FindBestBid(this, player.skillLevel);
                    player.currentRoundBid = bid;
                }
            }
            
            for (var i=0; i<4; i++) {
                this.players[i].currentRoundTricksTaken = 0;
            }

            // Start the round
            this.turnIndex = this.dealerIndex+1;
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
                var f = new Function('possiblePlays', 'trickCards', 'currentRoundBid', 'currentRoundTricksTaken', 'currentPlayerPosition', customMethod);
                var possiblePlays = this.GetLegalCardsForCurrentPlayerTurn();
                var bestCard = f( 
                    possiblePlays, 
                    this.trickCards, 
                    this.players[0].currentRoundBid,
                    this.players[0].currentRoundTricksTaken,
                    0);
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
            trickResult.trickTaker.currentRoundTricksTaken += 1;
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
    
    var SpadesFindPossiblePlayProbabilities = function(aGame) {
        
        // Create a game state copy that can be manipulated and restored to simulate outcomes
        var simGame = {};
        simGame.skillLevel = 'Standard';
        simGame.isSpadesBroken = aGame.isSpadesBroken;
        simGame.winningScore = aGame.winningScore;
        simGame.cardsPlayedThisRound = [];
        simGame.trickCards = [];
        simGame.leadIndex = aGame.leadIndex;
        simGame.dealerIndex = aGame.dealerIndex;
        simGame.turnIndex = aGame.turnIndex;
        simGame.players = [];
        var player = new SpadesPlayer();
        player.Initialize('You', true, 'Standard', 'South');
        simGame.players.push(player);
        player = new SpadesPlayer();
        player.Initialize('Catalina', false, 'Standard', 'West');
        simGame.players.push(player);
        player = new SpadesPlayer();
        player.Initialize('Amelia', false, 'Standard', 'North');
        simGame.players.push(player);
        player = new SpadesPlayer();
        player.Initialize('Seward', false, 'Standard', 'East');
        simGame.players.push(player);
        
        var currentPlayer = aGame.players[aGame.turnIndex%4];
        var currentSimPlayer = simGame.players[aGame.turnIndex%4];
        var possiblePlays = SpadesGetLegalCardsForCurrentPlayerTurnInSimulator(aGame);
        var probabilities = [];
    
        if (aGame.trickCards.length == 3) {
            // Probabilities are known exactly
            for (var i=0; i<possiblePlays.length; i++) {
                simGame.trickCards = [].concat(aGame.trickCards);
                simGame.trickCards.push(possiblePlays[i]);
    
                var trickResult = {};
                trickResult.highestCard = simGame.trickCards[0];
                trickResult.trickTaker = simGame.players[simGame.leadIndex];
                for (var n=1; n<simGame.trickCards.length; n++) {
                    var card = simGame.trickCards[n];
                    if ((card.suit === trickResult.highestCard.suit && card.value > trickResult.highestCard.value) ||
                        (card.suit === 'S' && trickResult.highestCard.suit !== 'S')) {
                        trickResult.highestCard = card;
                        trickResult.trickTaker = simGame.players[(simGame.leadIndex + n)%4];
                    }
                }
                
                probabilities.push(trickResult.trickTaker == currentSimPlayer ? 1 :0);
            }
        } else {
            // We will simulate a number of card distributions and see how often the player takes the trick
            
            // Create the list of cards remaining in the deck
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
    
            var simsPerPossiblePlay = 1000;
            for (var i=0; i<possiblePlays.length; i++) {
                var tricksTakenCount = 0;
                for (var simCount = 0; simCount < simsPerPossiblePlay; simCount++) {
                    // Reset the sim game state
                    for (var k=0; k<4; k++) {
                        var player = aGame.players[k];
                        var simPlayer = simGame.players[k];
                        simPlayer.skillLevel = 'Standard';
                        simPlayer.currentRoundBid = player.currentRoundBid;
                        simPlayer.currentRoundTricksTaken = player.currentRoundTricksTaken;
                        simPlayer.cards = [];
                        simPlayer.isShownVoidInSuit = [player.isShownVoidInSuit[0], player.isShownVoidInSuit[1], player.isShownVoidInSuit[2], player.isShownVoidInSuit[3]];
                    }
                    simGame.trickCards = [].concat(aGame.trickCards);
                    simGame.roundNumber = aGame.roundNumber;
                    simGame.leadIndex = aGame.leadIndex;
                    simGame.turnIndex = aGame.turnIndex;
                    simGame.isSpadesBroken = aGame.isSpadesBroken;
    
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
                    if (card.suit === 'S') {
                        simGame.isSpadesBroken = true;
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
    
                    // Finish the trick
                    while (simGame.trickCards.length < 4) {
                        var nextPlayer = simGame.players[simGame.turnIndex%4];
                        var legalPlays = SpadesGetLegalCardsForCurrentPlayerTurnInSimulator(simGame);
                        var nextCard = nextPlayer.FindStandardPlayingCard(simGame, legalPlays);
                        // Play the Card
                        if (nextCard.suit === 'S') {
                            simGame.isSpadesBroken = true;
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
    
                    // Get the trick result
                    var trickResult = {};
                    trickResult.highestCard = simGame.trickCards[0];
                    trickResult.trickTaker = simGame.players[simGame.leadIndex];
                    for (var n=1; n<simGame.trickCards.length; n++) {
                        var card = simGame.trickCards[n];
                        if ((card.suit === trickResult.highestCard.suit && card.value > trickResult.highestCard.value) ||
                            (card.suit === 'S' && trickResult.highestCard.suit !== 'S')) {
                            trickResult.highestCard = card;
                            trickResult.trickTaker = simGame.players[(simGame.leadIndex + n)%4];
                        }
                    }
    
                    if (trickResult.trickTaker.playerPosition == currentSimPlayer.playerPosition) {
                        tricksTakenCount++;
                    }
                }
    
                probabilities.push(tricksTakenCount/simsPerPossiblePlay);
            }
        }
    
        return probabilities;
    }
    
    var SpadesFindOptimalPlayForCurrentPlayer = function(aGame) {
        
        var currentPlayer = aGame.players[aGame.turnIndex%4];
        var possiblePlays = SpadesGetLegalCardsForCurrentPlayerTurnInSimulator(aGame);
        var playProbabilities = SpadesFindPossiblePlayProbabilities(aGame);
        for (var i=0; i<possiblePlays.length; i++) {
            possiblePlays[i].trickTakingProbability = playProbabilities[i];
        }
    
        // Sort the possible plays by their probability of taking the trick
        possiblePlays.sort(function(a,b){
            return a.trickTakingProbability - b.trickTakingProbability;
        });
    
        if (currentPlayer.currentRoundTricksTaken < currentPlayer.currentRoundBid) {
            //
            // Player wants to take a trick
            //
            var highestProbabilityCard = possiblePlays[playProbabilities.length-1];
            
            if (highestProbabilityCard.trickTakingProbability > 0.99 && playProbabilities.length > 1) {
                //
                // If there are multiple cards that are gauranteed then use a different criteria for picking
                //
                var gauranteedPlays = [];
                for (var i=0; i<playProbabilities.length; i++) {
                    var card = possiblePlays[i];
                    if (card.trickTakingProbability > 0.99) {
                        gauranteedPlays.push(card);
                    }
                }
                if (gauranteedPlays.length == 1) {
                    return gauranteedPlays[0];
                } else {
                    
                    gauranteedPlays.sort(function(a,b){
                        return a.value - b.value;
                    });
                    
                    if (currentPlayer.currentRoundBid - currentPlayer.currentRoundTricksTaken > 1) {
                        // Play the lowest gauranteed card
                        return gauranteedPlays[0];
                    } else {
                        // Play the highest gauranteed card
                        return gauranteedPlays[gauranteedPlays.length-1];
                    }
                }
            } else {
                
                var threshold = 0.5;
                if (highestProbabilityCard.trickTakingProbability < threshold) {
                    // Assume we cant take this trick and play the lowest valued card instead
                    possiblePlays.sort(function(a,b){
                        a.value - b.value;
                    });
                    return possiblePlays[0];
                } else {
                    return highestProbabilityCard;
                }
            }
        } else {
            // Player does not want to take a trick
            
            var lowestProbabilityCard = possiblePlays[0];
            
            if (lowestProbabilityCard.trickTakingProbability == 0.0 && playProbabilities.length > 1) {
                //
                // If there are multiple cards that are gauranteed then use a different criteria for picking
                //
                var gauranteedPlays = [];
                for (var i=0; i<playProbabilities.length; i++) {
                    var card = possiblePlays[i];
                    if (card.trickTakingProbability == 0.0) {
                        gauranteedPlays.push(card);
                    }
                }
                if (gauranteedPlays.length == 1) {
                    return gauranteedPlays[0];
                } else {
                    gauranteedPlays.sort(function(a,b){
                        return a.value - b.value;
                    });
                    
                    if (currentPlayer.currentRoundBid - currentPlayer.currentRoundTricksTaken > 1) {
                        // Play the lowest gauranteed card
                        return gauranteedPlays[0];
                    } else {
                        // Play the highest gauranteed card
                        return gauranteedPlays[gauranteedPlays.length - 1];
                    }
                }
            } else if (lowestProbabilityCard.trickTakingProbability > 0.99 && playProbabilities.length > 1) {
                // All options are gauranteed to take the trick
                // so we might as well waste our highest valued card
                possiblePlays.sort(function(a,b){
                    return b.value - a.value;
                });
                
                return possiblePlays[0];
                
            } else {
                return lowestProbabilityCard;
            }
        }
    }
    
    var SpadesGetLegalCardsForCurrentPlayerTurnInSimulator = function(aGame) {
        var legalCards = [];
        var player = aGame.players[aGame.turnIndex%4];
        if (aGame.trickCards.length === 0) {
            for (var i=0; i<player.cards.length; i++) {
                var card = player.cards[i];
                if (aGame.isSpadesBroken || card.suit != 'S') {
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
                    if (card.suit === 'S') {
                        continue;
                    }
                }
                legalCards.push(card);
            }
        }
        return legalCards;
    }