var SpadesPlayer = function() {

    this.name = "";
    this.isHuman = false;
    this.skillLevel = "";
    this.playerPosition = "";
    this.playerPositionInt = 0;
    this.cards = [];
    this.currentRoundBid = -1;
    this.currentRoundTricksTaken = -1;
    this.gameScore = 0;
    this.isShownVoidInSuit = [false, false, false, false];

    this.Initialize = function(aName, aIsHuman, aSkill, aPosition) {
        this.name = aName;
        this.isHuman = aIsHuman;
        this.skillLevel = aSkill;
        this.currentRoundBid = -1;
        this.currentRoundTricksTaken = -1;
        this.gameScore = 0;
        this.playerPosition = aPosition;
        switch (this.playerPosition) {
            case 'South':
                this.playerPositionInt = 0;
                break;
            case 'West':
                this.playerPositionInt = 1;
                break;
            case 'North':
                this.playerPositionInt = 2;
                break;
            default:
                this.playerPositionInt = 3;
                break;
        }
    }

    this.ChooseBid = function()  {
        if (this.isHuman) {
            game.PromptPlayerToChooseBid();
        } else {
            var bid = this.FindBestBid(game, this.skillLevel);
            this.currentRoundBid = bid;
            setTimeout(function(player) {
                game.OnPlayerFinishedChoosingBid(player);
            }, 500, this);
            
        }
    }

    this.FindBestBid = function(aGame, aSkillLevel) {
        switch (aSkillLevel) {
            case 'Easy':
                return Math.floor(Math.random() * 4) + 1;
            case 'Standard':
            case 'Pro':
                return this.FindProBid(aGame, this);
            case 'Custom':
                try {
                    var customMethod = this.GetDecisionMethod(0);
                    // Remove the method signature and paramters from the code
                    customMethod = customMethod.substring(customMethod.indexOf("{") + 1);
                    customMethod = customMethod.substring(customMethod.lastIndexOf("}"), -1);
                    var f = new Function('game', customMethod);
                    var bid = f(game);
                    if (bid == undefined) {
                        throw "Custom decision failed.";
                    }
                    return bid;
                } catch (err) {
                    throw err;
                }
        }
    }

    this.FindProBid = function(aGame, currentPlayer) {
        
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
    
        var currentSimPlayer = simGame.players[currentPlayer.playerPositionInt];
        
        // Create the list of cards remaining in the deck
        var gameCards = aGame.GetCards();
        var cardsRemaining = [];
        for (var i=0; i<gameCards.length; i++) {
            var isAlreadyPlayed = false;
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
    
        var recommendedBid = 1;
        // Loop through possible bids to see how the player fares
        for (var trialBid = 1; trialBid<14; trialBid++) {
            
            var totalTricksTaken = 0;
            var simsCount = 250;
            for (var simIndex = 0; simIndex < simsCount; simIndex++) {
                
                // Reset the sim game state
                for (var k=0; k<4; k++) {
                    var player = aGame.players[k];
                    var simPlayer = simGame.players[k];
                    simPlayer.skillLevel = 'Standard';
                    simPlayer.currentRoundBid = player.currentRoundBid;
                    simPlayer.currentRoundTricksTaken = 0;
                    simPlayer.cards = [];
                    simPlayer.isShownVoidInSuit = [false, false, false, false];
                }
                simGame.cardsPlayedThisRound = [];
                simGame.trickCards = [];
                simGame.roundNumber = aGame.roundNumber;
                simGame.dealerIndex = aGame.dealerIndex;
                simGame.leadIndex = aGame.leadIndex;
                simGame.turnIndex = aGame.turnIndex;
                simGame.isSpadesBroken = false;
    
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
    
                // Guess the bids for the unbid players
                currentSimPlayer.currentRoundBid = trialBid;
                var bidsSoFarSum = 0;
                var unBidCount = 0;
                for (var i=0; i<4; i++) {
                    var p = simGame.players[i];
                    if (p.currentRoundBid >= 0) {
                        bidsSoFarSum += p.currentRoundBid;
                    } else {
                        unBidCount++;
                    }
                }
                if (unBidCount > 0) {
                    var remainder = 13 - bidsSoFarSum;
                    var guessBid = Math.ceil(remainder / unBidCount);
                    if (guessBid < 2) {
                        guessBid = 2;
                    }
                    if (guessBid > 5) {
                        guessBid = 5;
                    }
                    for (var i=0; i<4; i++) {
                        var p = simGame.players[i];
                        if (p.currentRoundBid == -1) {
                            p.currentRoundBid = guessBid;
                        }
                    }
                }
    
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
    
                // Simulate out the whole round with the player being a pro and the rest being standard
                while (currentSimPlayer.cards.length > 0) {
                    
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
                    trickResult.trickTaker.currentRoundTricksTaken++;
                    simGame.leadIndex = trickResult.trickTaker.playerPositionInt;
                    simGame.turnIndex = simGame.leadIndex;
                    simGame.trickCards = [];
                }
                
                totalTricksTaken += currentSimPlayer.currentRoundTricksTaken;
            }
    
            var avgTricksTaken = totalTricksTaken/simsCount;
            //console.log("Bid: " + currentSimPlayer.currentRoundBid + "   Taken: " + avgTricksTaken);
            
            if (avgTricksTaken < trialBid) {
                recommendedBid = trialBid-1;
                break;
            }
            recommendedBid++;
        }
        return recommendedBid;
    }

    this.ChoosePlayCard = function() {
        if (this.isHuman) {
            game.PromptPlayerToPlayCard();
        } else {
            var card = this.FindBestPlayingCard(game, this.skillLevel, false);
            game.OnPlayerChosePlayCard(card);
        }
    }

    this.FindBestPlayingCard = function(aGame, aSkillLevel) {
        var possiblePlays = aGame.GetLegalCardsForCurrentPlayerTurn();
        switch (aSkillLevel) {
            case 'Easy':
                return possiblePlays[0];
            case 'Standard':
                return this.FindStandardPlayingCard(aGame, possiblePlays);
            case 'Pro':
                return SpadesFindOptimalPlayForCurrentPlayer(aGame);
            case 'Custom':
                try {
                    var customMethod = this.GetDecisionMethod(1);
                    // Remove the method signature and paramters from the code
                    customMethod = customMethod.substring(customMethod.indexOf("{") + 1);
                    customMethod = customMethod.substring(customMethod.lastIndexOf("}"), -1);
                    var f = new Function('possiblePlays', 'trickCards', 'currentRoundBid', 'currentRoundTricksTaken', 'currentPlayerPosition', customMethod);
                    var bestCard = f( 
                        possiblePlays, 
                        game.trickCards, 
                        game.players[this.playerPositionInt].currentRoundBid,
                        game.players[this.playerPositionInt].currentRoundTricksTaken,
                        0);
                    if (bestCard == undefined) {
                        throw "Custom decision failed.";
                    }
                    return bestCard;
                } catch (err) {
                    throw err;
                }
        }
    }

    this.FindStandardPlayingCard = function(aGame, possiblePlays) {
        if (this.currentRoundTricksTaken < this.currentRoundBid) {
            // Try to take the trick
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
                        if ((playedCard.suit === leadCard.suit && playedCard.value > highestCardInTrick.value) ||
                            (playedCard.suit == 'S' && highestCardInTrick.suit != 'S')) {
                            highestCardInTrick = playedCard;
                        }
                    }

                    // Check if we already cant take the trick
                    var alreadyCantTakeTrick = true;
                    for (var i=0; i<possiblePlays.length; i++) {
                        var card = possiblePlays[i];
                        if (card.value > highestCardInTrick.value) {
                            alreadyCantTakeTrick = false;
                            break;
                        }
                    }
                    if (alreadyCantTakeTrick) {
                        // play the lowest card possible
                        return possiblePlays[0];
                    }

                    if (aGame.trickCards.length < 3) {
                        // play our highest card
                        var highestCard = possiblePlays[possiblePlays.length - 1];
                        return highestCard;
                    } else {
                        if (this.currentRoundBid - this.currentRoundTricksTaken == 1) {
                            // play our highest card
                            var highestCard = possiblePlays[possiblePlays.length - 1];
                            return highestCard;
                        } else {
                            // Play the lowest card that will take the trick
                            for (var i=0; i<possiblePlays.length; i++) {
                                var card = possiblePlays[i];
                                if (card.value > highestCardInTrick.value) {
                                    return card;
                                }
                            }
                            // Safety - this should not happen
                            return possiblePlays[0];
                        }
                    }
                } else {
                    // If we have a trump card, play it, otherwise play a low card
                    possiblePlays.sort(function(a,b) { 
                        if (a.suit == 'S' && b.suit != 'S') {
                            return -1;
                        } else if (b.suit == 'S' && a.suit != 'S') {
                            return 1;
                        } else {
                            return a.value - b.value;
                        }
                    });
                    return possiblePlays[0];
                }
            }
        } else {
            // Try not to take the trick
            if (aGame.trickCards.length == 0) {
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
                        if ((playedCard.suit === leadCard.suit && playedCard.value > highestCardInTrick.value) ||
                            (playedCard.suit == 'S' && highestCardInTrick.suit != 'S')) {
                            highestCardInTrick = playedCard;
                        }
                    }

                    if (aGame.trickCards.length < 3) {
                    // Play the highest card that will not take the hand
                    var curPlay = possiblePlays[0];
                    if (curPlay.value > highestCardInTrick.value) {
                        // We will have to play our lowest card and hope the next person has higher
                        return curPlay;
                    } else {
                        // Play the highest value that is less than the current highest card in the trick
                        for (var i = 1; i < possiblePlays.length; i++) {
                            var possibleCard = possiblePlays[i];
                            if (possibleCard.value < highestCardInTrick.value) {
                                curPlay = possibleCard;
                            }
                        }
                        return curPlay;
                    }
                    } else {
                        // Try to not take the trick but if we must, then play the highest card
                        var curPlay = possiblePlays[0];
                        if (curPlay.value > highestCardInTrick.value) {
                            // play our highest card
                            var highestCard = possiblePlays[possiblePlays.length - 1];
                            return highestCard;
                        } else {
                            // Play the highest value that is less than the current highest card in the trick
                            for (var i = 1; i < possiblePlays.length; i++) {
                                var possibleCard = possiblePlays[i];
                                if (possibleCard.value < highestCardInTrick.value) {
                                    curPlay = possibleCard;
                                }
                            }
                            return curPlay;
                        }
                    }
                } else {
                    // Play the highest valued card we have that is not a trump spade
                    possiblePlays.sort(function(a,b) { 
                        if (a.suit == 'S' && b.suit != 'S') {
                            return 1;
                        } else if (b.suit == 'S' && a.suit != 'S') {
                            return -1;
                        } else {
                            return b.value - a.value;
                        }
                    });
                    return possiblePlays[0];
                }
            }
        }
    }

    this.GetDecisionMethod = function(decisionIndex) {
        var decisionMethodName = "spades_decision_method_Custom_" + decisionIndex;
        var decisionMethod = window.localStorage.getItem(decisionMethodName);
        if (decisionMethod == null) {
            // Load a default method
            switch (decisionIndex) {
                case 0:
                {
                    decisionMethod = "var ChooseBid = function(game) {\n\
\t// Create a game state copy that can be manipulated and restored to simulate outcomes\n\
\tvar simGame = {};\n\
\tsimGame.skillLevel = 'Standard';\n\
\tsimGame.isSpadesBroken = game.isSpadesBroken;\n\
\tsimGame.winningScore = game.winningScore;\n\
\tsimGame.cardsPlayedThisRound = [];\n\
\tsimGame.trickCards = [];\n\
\tsimGame.leadIndex = game.leadIndex;\n\
\tsimGame.dealerIndex = game.dealerIndex;\n\
\tsimGame.turnIndex = game.turnIndex;\n\
\tsimGame.players = [];\n\
\tvar player = new SpadesPlayer();\n\
\tplayer.Initialize('You', true, 'Standard', 'South');\n\
\tsimGame.players.push(player);\n\
\tplayer = new SpadesPlayer();\n\
\tplayer.Initialize('Catalina', false, 'Standard', 'West');\n\
\tsimGame.players.push(player);\n\
\tplayer = new SpadesPlayer();\n\
\tplayer.Initialize('Amelia', false, 'Standard', 'North');\n\
\tsimGame.players.push(player);\n\
\tplayer = new SpadesPlayer();\n\
\tplayer.Initialize('Seward', false, 'Standard', 'East');\n\
\tsimGame.players.push(player);\n\
\n\
\tvar currentPlayer = game.players[0];\n\
\tvar currentSimPlayer = simGame.players[0];\n\
\n\
\t// Create the list of cards remaining in the deck\n\
\tvar gameCards = game.GetCards();\n\
\tvar cardsRemaining = [];\n\
\tfor (var i=0; i<gameCards.length; i++) {\n\
\t\tvar isAlreadyPlayed = false;\n\
\t\tfor (var j=0; j<currentPlayer.cards.length; j++) {\n\
\t\t\tif (currentPlayer.cards[j].id === gameCards[i].id) {\n\
\t\t\t\tisAlreadyPlayed = true;\n\
\t\t\t\tbreak;\n\
\t\t\t}\n\
\t\t}\n\
\t\tif (isAlreadyPlayed) {\n\
\t\t\tcontinue;\n\
\t\t}\n\
\n\
\t\tcardsRemaining.push(gameCards[i]);\n\
\t}\n\
\n\
\tvar recommendedBid = 1;\n\
// Loop through possible bids to see how the player fares\n\
for (var trialBid = 1; trialBid<14; trialBid++) {\n\
\tvar totalTricksTaken = 0;\n\
\tvar simsCount = 250;\n\
\tfor (var simIndex = 0; simIndex < simsCount; simIndex++) {\n\
\t\t// Reset the sim game state\n\
\t\tfor (var k=0; k<4; k++) {\n\
\t\t\tvar player = game.players[k];\n\
\t\t\tvar simPlayer = simGame.players[k];\n\
\t\t\tsimPlayer.skillLevel = 'Standard';\n\
\t\t\tsimPlayer.currentRoundBid = player.currentRoundBid;\n\
\t\t\tsimPlayer.currentRoundTricksTaken = 0;\n\
\t\t\tsimPlayer.cards = [];\n\
\t\t\tsimPlayer.isShownVoidInSuit = [false, false, false, false];\n\
\t\t}\n\
\t\tsimGame.cardsPlayedThisRound = [];\n\
\t\tsimGame.trickCards = [];\n\
\t\tsimGame.roundNumber = game.roundNumber;\n\
\t\tsimGame.dealerIndex = game.dealerIndex;\n\
\t\tsimGame.leadIndex = game.leadIndex;\n\
\t\tsimGame.turnIndex = game.turnIndex;\n\
\t\tsimGame.isSpadesBroken = false;\n\
\t\t\n\
\t\t// Shuffle the deck\n\
\t\tvar deckIdx = 0;\n\
\t\tfor (var k = cardsRemaining.length - 1; k > 0; k--) {\n\
\t\t\tvar randIdx = Math.floor(Math.random() * (k + 1));\n\
\t\t\tx = cardsRemaining[k];\n\
\t\t\tcardsRemaining[k] = cardsRemaining[randIdx];\n\
\t\t\tcardsRemaining[randIdx] = x;\n\
\t\t}\n\
\n\
\t\tfor (var n=0; n<currentPlayer.cards.length; n++) {\n\
\t\t\tcurrentSimPlayer.cards.push(currentPlayer.cards[n]);\n\
\t\t}\n\
\n\
\t\t// Guess the bids for the unbid players\n\
\t\tcurrentSimPlayer.currentRoundBid = trialBid;\n\
\t\tvar bidsSoFarSum = 0;\n\
\t\tvar unBidCount = 0;\n\
\t\tfor (var i=0; i<4; i++) {\n\
\t\t\tvar p = simGame.players[i];\n\
\t\t\tif (p.currentRoundBid >= 0) {\n\
\t\t\t\tbidsSoFarSum += p.currentRoundBid;\n\
\t\t\t} else {\n\
\t\t\t\tunBidCount++;\n\
\t\t\t}\n\
\t\t}\n\
\t\tif (unBidCount > 0) {\n\
\t\t\tvar remainder = 13 - bidsSoFarSum;\n\
\t\t\tvar guessBid = Math.ceil(remainder / unBidCount);\n\
\t\t\tif (guessBid < 2) {\n\
\t\t\t\tguessBid = 2;\n\
\t\t\t}\n\
\t\t\tif (guessBid > 5) {\n\
\t\t\t\tguessBid = 5;\n\
\t\t\t}\n\
\t\t\tfor (var i=0; i<4; i++) {\n\
\t\t\t\tvar p = simGame.players[i];\n\
\t\t\t\tif (p.currentRoundBid == -1) {\n\
\t\t\t\t\tp.currentRoundBid = guessBid;\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\t// Deal the remaining cards to the rest of the players\n\
\t\tvar idx = game.turnIndex;\n\
\t\tfor (var deckIdx = 0; deckIdx<cardsRemaining.length; deckIdx++) {\n\
\t\t\tidx++;\n\
\t\t\tvar simPlayer = simGame.players[idx%4];\n\
\t\t\tif (simPlayer === currentSimPlayer) {\n\
\t\t\t\tdeckIdx--;\n\
\t\t\t\tcontinue;\n\
\t\t\t}\n\
\t\t\tsimPlayer.cards.push(cardsRemaining[deckIdx]);\n\
\t\t}\n\
\n\
\t\t// Simulate out the whole round with the player being a pro and the rest being standard\n\
\t\twhile (currentSimPlayer.cards.length > 0) {\n\
\t\t\t// Finish the trick\n\
\t\t\twhile (simGame.trickCards.length < 4) {\n\
\t\t\t\tvar nextPlayer = simGame.players[simGame.turnIndex%4];\n\
\t\t\t\tvar legalPlays = SpadesGetLegalCardsForCurrentPlayerTurnInSimulator(simGame);\n\
\t\t\t\tvar nextCard = nextPlayer.FindStandardPlayingCard(simGame, legalPlays);\n\
\t\t\t\t// Play the Card\n\
\t\t\t\tif (nextCard.suit === 'S') {\n\
\t\t\t\t\tsimGame.isSpadesBroken = true;\n\
\t\t\t\t}\n\
\t\t\t\tif (simGame.trickCards.length !== 0) {\n\
\t\t\t\t\tvar leadCard = simGame.trickCards[0];\n\
\t\t\t\t\tif (nextCard.suit !== leadCard.suit) {\n\
\t\t\t\t\t\tnextPlayer.isShownVoidInSuit[leadCard.suitInt] = true;\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\n\
\t\t\t\tnextPlayer.cards.splice(nextPlayer.cards.indexOf(nextCard), 1);\n\
\t\t\t\tsimGame.trickCards.push(nextCard);\n\
\t\t\t\tsimGame.turnIndex = simGame.turnIndex + 1;\n\
\t\t\t}\n\
\t\t\t\n\
\t\t\t// Get the trick result\n\
\t\t\tvar trickResult = {};\n\
\t\t\ttrickResult.highestCard = simGame.trickCards[0];\n\
\t\t\ttrickResult.trickTaker = simGame.players[simGame.leadIndex];\n\
\t\t\tfor (var n=1; n<simGame.trickCards.length; n++) {\n\
\t\t\t\tvar card = simGame.trickCards[n];\n\
\t\t\t\tif ((card.suit === trickResult.highestCard.suit && card.value > trickResult.highestCard.value) ||\n\
\t\t\t\t\t(card.suit === 'S' && trickResult.highestCard.suit !== 'S')) {\n\
\t\t\t\t\ttrickResult.highestCard = card;\n\
\t\t\t\t\ttrickResult.trickTaker = simGame.players[(simGame.leadIndex + n)%4];\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t\ttrickResult.trickTaker.currentRoundTricksTaken++;\n\
\t\t\tsimGame.leadIndex = trickResult.trickTaker.playerPositionInt;\n\
\t\t\tsimGame.turnIndex = simGame.leadIndex;\n\
\t\t\tsimGame.trickCards = [];\n\
\t\t}\n\
\n\
\t\ttotalTricksTaken += currentSimPlayer.currentRoundTricksTaken;\n\
\t}\n\
\n\
\tvar avgTricksTaken = totalTricksTaken/simsCount;\n\
\t//console.log('Bid: ' + currentSimPlayer.currentRoundBid + '   Taken: ' + avgTricksTaken);\n\
\n\
\tif (avgTricksTaken < trialBid) {\n\
\t\trecommendedBid = trialBid-1;\n\
\t\tbreak;\n\
\t}\n\
\trecommendedBid++;\n\
\t}\n\
\treturn recommendedBid;\n\
};";
                }
                break;

                case 1:
                {
                    decisionMethod = "var ChooseTrickCard = function(\n\
\t\t\tpossiblePlays,\t\t\t// Array of valid cards in your hand\n\
\t\t\ttrickCards,\t\t\t\t// Array of cards in the trick pile\n\
\t\t\tcurrentRoundBid,\t\t// Your current bid for the round\n\
\t\t\tcurrentRoundTricksTaken,// The number of tricks you have already taken\n\
\t\t\tcurrentPlayerPosition\n\
\t\t\t){\n\
\n\
\tif (currentRoundTricksTaken < currentRoundBid) {\n\
\t\t// Try to take the trick\n\
\t\tif (trickCards.length === 0) {\n\
\t\t\t// Lead with the lowest card value possible\n\
\t\t\tvar play = possiblePlays[0];\n\
\t\t\tfor (var i=1; i<possiblePlays.length; i++) {\n\
\t\t\t\tvar possiblePlay = possiblePlays[i];\n\
\t\t\t\tif (possiblePlay.value < play.value) {\n\
\t\t\t\t\tplay = possiblePlay;\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t\treturn play;\n\
\t\t} else {\n\
\t\t\tvar leadCard = trickCards[0];\n\
\t\t\tvar play = possiblePlays[0];\n\
\t\t\tif (play.suit === leadCard.suit) {\n\
\t\t\t\t// Must play the same suit\n\
\t\t\t\tpossiblePlays.sort(function(a,b) {\n\
\t\t\t\t\treturn a.value - b.value;\n\
\t\t\t\t});\n\
\n\
\t\t\t\tvar highestCardInTrick = leadCard;\n\
\t\t\t\tfor (var i=1; i<trickCards.length; i++) {\n\
\t\t\t\t\tvar playedCard = trickCards[i];\n\
\t\t\t\t\tif ((playedCard.suit === leadCard.suit && playedCard.value > highestCardInTrick.value) ||\n\
\t\t\t\t\t\t(playedCard.suit == 'S' && highestCardInTrick.suit != 'S')) {\n\
\t\t\t\t\t\thighestCardInTrick = playedCard;\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\n\
\t\t\t\t// Check if we already cant take the trick\n\
\t\t\t\tvar alreadyCantTakeTrick = true;\n\
\t\t\t\tfor (var i=0; i<possiblePlays.length; i++) {\n\
\t\t\t\t\tvar card = possiblePlays[i];\n\
\t\t\t\t\tif (card.value > highestCardInTrick.value) {\n\
\t\t\t\t\t\talreadyCantTakeTrick = false;\n\
\t\t\t\t\t\tbreak;\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t\tif (alreadyCantTakeTrick) {\n\
\t\t\t\t\t// play the lowest card possible\n\
\t\t\t\t\treturn possiblePlays[0];\n\
\t\t\t\t}\n\
\n\
\t\t\t\tif (trickCards.length < 3) {\n\
\t\t\t\t\t// play our highest card\n\
\t\t\t\t\tvar highestCard = possiblePlays[possiblePlays.length - 1];\n\
\t\t\t\t\treturn highestCard;\n\
\t\t\t\t} else {\n\
\t\t\t\t\tif (currentRoundBid - currentRoundTricksTaken == 1) {\n\
\t\t\t\t\t\t// play our highest card\n\
\t\t\t\t\t\tvar highestCard = possiblePlays[possiblePlays.length - 1];\n\
\t\t\t\t\t\treturn highestCard;\n\
\t\t\t\t\t} else {\n\
\t\t\t\t\t\t// Play the lowest card that will take the trick\n\
\t\t\t\t\t\tfor (var i=0; i<possiblePlays.length; i++) {\n\
\t\t\t\t\t\t\tvar card = possiblePlays[i];\n\
\t\t\t\t\t\t\tif (card.value > highestCardInTrick.value) {\n\
\t\t\t\t\t\t\t\treturn card;\n\
\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t\t// Safety - this should not happen\n\
\t\t\t\t\t\treturn possiblePlays[0];\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t} else {\n\
\t\t\t\t// If we have a trump card, play it, otherwise play a low card\n\
\t\t\t\tpossiblePlays.sort(function(a,b) {\n\
\t\t\t\t\tif (a.suit == 'S' && b.suit != 'S') {\n\
\t\t\t\t\t\treturn -1;\n\
\t\t\t\t\t} else if (b.suit == 'S' && a.suit != 'S') {\n\
\t\t\t\t\t\treturn 1;\n\
\t\t\t\t\t} else {\n\
\t\t\t\t\t\treturn a.value - b.value;\n\
\t\t\t\t\t}\n\
\t\t\t\t\});\n\
\t\t\t\treturn possiblePlays[0];\n\
\t\t\t}\n\
\t\t}\n\
\t} else {\n\
\t\t// Try not to take the trick\n\
\t\tif (trickCards.length == 0) {\n\
\t\t\t// Lead with the lowest card value possible\n\
\t\t\tvar play = possiblePlays[0];\n\
\t\t\tfor (var i=1; i<possiblePlays.length; i++) {\n\
\t\t\t\tvar possiblePlay = possiblePlays[i];\n\
\t\t\t\tif (possiblePlay.value < play.value) {\n\
\t\t\t\t\tplay = possiblePlay;\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t\treturn play;\n\
\t\t} else {\n\
\t\t\tvar leadCard = trickCards[0];\n\
\t\t\tvar play = possiblePlays[0];\n\
\t\t\tif (play.suit === leadCard.suit) {\n\
\t\t\t\t// Must play the same suit\n\
\t\t\t\tpossiblePlays.sort(function(a,b) {\n\
\t\t\t\t\treturn a.value - b.value;\n\
\t\t\t\t});\n\
\n\
\t\t\t\tvar highestCardInTrick = leadCard;\n\
\t\t\t\tfor (var i=1; i<trickCards.length; i++) {\n\
\t\t\t\t\tvar playedCard = trickCards[i];\n\
\t\t\t\t\tif ((playedCard.suit === leadCard.suit && playedCard.value > highestCardInTrick.value) ||\n\
\t\t\t\t\t\t(playedCard.suit == 'S' && highestCardInTrick.suit != 'S')) {\n\
\t\t\t\t\t\thighestCardInTrick = playedCard;\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\n\
\t\t\t\tif (trickCards.length < 3) {\n\
\t\t\t\t\t// Play the highest card that will not take the hand\n\
\t\t\t\t\tvar curPlay = possiblePlays[0];\n\
\t\t\t\t\tif (curPlay.value > highestCardInTrick.value) {\n\
\t\t\t\t\t\t// We will have to play our lowest card and hope the next person has higher\n\
\t\t\t\t\t\treturn curPlay;\n\
\t\t\t\t\t} else {\n\
\t\t\t\t\t\t// Play the highest value that is less than the current highest card in the trick\n\
\t\t\t\t\t\tfor (var i = 1; i < possiblePlays.length; i++) {\n\
\t\t\t\t\t\t\tvar possibleCard = possiblePlays[i];\n\
\t\t\t\t\t\t\tif (possibleCard.value < highestCardInTrick.value) {\n\
\t\t\t\t\t\t\t\tcurPlay = possibleCard;\n\
\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t\treturn curPlay;\n\
\t\t\t\t\t}\n\
\t\t\t\t} else {\n\
\t\t\t\t\t// Try to not take the trick but if we must, then play the highest card\n\
\t\t\t\t\tvar curPlay = possiblePlays[0];\n\
\t\t\t\t\tif (curPlay.value > highestCardInTrick.value) {\n\
\t\t\t\t\t\t// play our highest card\n\
\t\t\t\t\t\tvar highestCard = possiblePlays[possiblePlays.length - 1];\n\
\t\t\t\t\t\treturn highestCard;\n\
\t\t\t\t\t} else {\n\
\t\t\t\t\t\t// Play the highest value that is less than the current highest card in the trick\n\
\t\t\t\t\t\tfor (var i = 1; i < possiblePlays.length; i++) {\n\
\t\t\t\t\t\t\tvar possibleCard = possiblePlays[i];\n\
\t\t\t\t\t\t\tif (possibleCard.value < highestCardInTrick.value) {\n\
\t\t\t\t\t\t\t\tcurPlay = possibleCard;\n\
\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t\treturn curPlay;\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t} else {\n\
\t\t\t\t// Play the highest valued card we have that is not a trump spade\n\
\t\t\t\tpossiblePlays.sort(function(a,b) {\n\
\t\t\t\t\tif (a.suit == 'S' && b.suit != 'S') {\n\
\t\t\t\t\t\treturn 1;\n\
\t\t\t\t\t} else if (b.suit == 'S' && a.suit != 'S') {\n\
\t\t\t\t\t\treturn -1;\n\
\t\t\t\t\t} else {\n\
\t\t\t\t\t\treturn b.value - a.value;\n\
\t\t\t\t\t}\n\
\t\t\t\t});\n\
\t\t\t\treturn possiblePlays[0];\n\
\t\t\t}\n\
\t\t}\n\
\t}\n\
};";
                }
                break;
            }
        }

        return decisionMethod;
    }
}