var PinochlePlayer = function() {

    this.name = "";
    this.isHuman = false;
    this.skillLevel = "";
    this.playerPosition = "";
    this.playerPositionInt = 0;
    this.cards = [];
    this.currentRoundBid = -1;
    this.currentRoundMaximumBid = 0;
    this.currentRoundWinningBidTrump = 'S';
    this.currentRoundBidIsPass = false;
    this.currentRoundMeldScore = 0;
    this.currentRoundCountersTaken = 0;
    this.gameScore = 0;
    this.isShownVoidInSuit = [false, false, false, false];
    this.passingCards = [];
    this.receivedCards = [];
    this.melds = [];
    
    this.Initialize = function(aName, aIsHuman, aSkill, aPosition) {
        this.name = aName;
        this.isHuman = aIsHuman;
        this.skillLevel = aSkill;
        this.currentRoundBid = -1;
        this.currentRoundMaximumBid = 0;
        this.currentRoundMeldScore = 0;
        this.currentRoundCountersTaken = 0;
        this.gameScore = 0;
        this.isShownVoidInSuit = [false, false, false, false];
        this.passingCards = [];
        this.receivedCards = [];
        this.melds = [];
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

    this.ChooseBid = function(biddingSpeed)  {
        var minimumWaitTime = biddingSpeed == 1 ? 0 : 300;

        if (this.isHuman) {
            if (game.currentHighestBidder == null) {
                // Player must bid minimum
                this.currentRoundBid = Number(game.settings.GetSetting('setting_minimum_bid'));
                game.currentHighestBidder = this;
                game.OnPlayerFinishedChoosingBid(this);
            } else {
                if (this.currentRoundBidIsPass) {
                    game.OnPlayerFinishedChoosingBid(this);
                } else {
                    setTimeout(function() {            
                        game.PromptPlayerToChooseBid();
                    }, minimumWaitTime);
                }
            }
        } else {
            var startTime = performance.now();
            
            if (this.currentRoundMaximumBid == -1) {
                game.IndicatePlayerIsThinking(this.playerPosition);
                game.worker.postMessage({
                    'cmd': 'FindBestBid', 
                    'gameState': game.CreateClonableGameState(game),
                    'passingCardsCount': game.settings.GetSetting('setting_passing_cards_count'),
                    'playerSkill': this.skillLevel,
                    'playerIndex': this.playerPositionInt,
                    'playerCards': game.CreateClonableCards(this.cards),
                    'simulationsPerSuit': 1000,
                    'isForSimulationView': false,
                    'minimumEndTime': startTime + minimumWaitTime
                });
                return;                
            }

            if (this.currentRoundBidIsPass) {
                game.OnPlayerFinishedChoosingBid(this);
                return;
            } else {
                if (game.currentHighestBidder == null) {
                    this.currentRoundBid = Number(game.settings.GetSetting('setting_minimum_bid'));
                    game.currentHighestBidder = this;
                } else {
                    // Don't get into a bidding war with your partner
                    var passCount = 0;
                    for (var i=0; i<4; i++) {
                        if (game.players[i].currentRoundBidIsPass) {
                            passCount++;
                        }
                    }
                    if (passCount == 2 && game.currentHighestBidder.playerPositionInt == (this.playerPositionInt+2)%4) {
                        this.currentRoundBidIsPass = true;
                    } else if (this.currentRoundMaximumBid > game.currentHighestBidder.currentRoundBid) {
                        this.currentRoundBid = game.currentHighestBidder.currentRoundBid + 1;
                        game.currentHighestBidder = this;
                    } else {
                        this.currentRoundBidIsPass = true;
                    }
                }
            }

            var endTime = performance.now();
            var elapsedTime = endTime - startTime;
            var waitTime = 0;
            if (elapsedTime < minimumWaitTime) {
                waitTime = minimumWaitTime - elapsedTime;
            }
            setTimeout(function(player) {
                game.OnPlayerFinishedChoosingBid(player);
            }, waitTime, this);
            
        }
    }

    this.FindBestBid = function(aGame, aSkillLevel, passingCardsCount) {
        switch (aSkillLevel) {
            case "Easy":
                var bidAndSuit = [0, ''];
                if (aGame.isDoubleDeck) {
                    bidAndSuit[0] = Math.floor(Math.random() * 25) + 50
                } else {
                    bidAndSuit[0] = Math.floor(Math.random() * 10) + 20
                }
                var suitStrength = [];
                for (var i=0; i<4; i++) {
                    suitStrength[i] = 0;
                }
                for (var i=0; i<this.cards.length; i++) {
                    suitStrength[this.cards[i].suitInt] += this.cards[i].value;
                }
                var bestStrength = 0;
                var suits = ['S','H','C','D'];
                for (var i=0; i<4; i++) {
                    if (suitStrength[i] >= bestStrength) {
                        bestStrength = suitStrength[i];
                        bidAndSuit[1] = suits[i];
                    }
                }
                return bidAndSuit;
            break;

            case "Standard":
                return this.FindBidSynchronous(aGame, passingCardsCount, aSkillLevel, this.playerPositionInt, this.cards);
            break;

            case "Pro":
                return this.FindBidSynchronous(aGame, passingCardsCount, aSkillLevel, this.playerPositionInt, this.cards);
            break;

            case "Custom":
                try {
                    var customMethod = this.GetDecisionMethod(0);
                    // Remove the method signature and paramters from the code
                    customMethod = customMethod.substring(customMethod.indexOf("{") + 1);
                    customMethod = customMethod.substring(customMethod.lastIndexOf("}"), -1);
                    var f = new Function('aGame', 'passingCardsCount', 'currentPlayerIndex', 'currentPlayerCards', customMethod);
                    var bid = f(game,
                                passingCardsCount,
                                this.playerPositionInt,
                                this.cards);
                    if (bid == undefined) {
                        throw "Custom decision failed.";
                    }
                    return bid;
                } catch (err) {
                    throw err;
                }
            break;
        }
    }

    this.FindBidSynchronous = function(aGame, passingCardsCount, currentPlayerSkill, currentPlayerIndex, currentPlayerCards) {
        
        // Create a game state copy that can be manipulated and restored to simulate outcomes
        var simGame = {};
        simGame.isDoubleDeck = aGame.isDoubleDeck;
        simGame.cardsPlayedThisRound = [];
        simGame.trickCards = [];
        simGame.leadIndex = aGame.leadIndex;
        simGame.dealerIndex = aGame.dealerIndex;
        simGame.turnIndex = aGame.turnIndex;
        simGame.players = [];
        var player = new PinochlePlayer();
        player.Initialize('You', true, 'Standard', 'South');
        simGame.players.push(player);
        player = new PinochlePlayer();
        player.Initialize('Catalina', false, 'Standard', 'West');
        simGame.players.push(player);
        player = new PinochlePlayer();
        player.Initialize('Amelia', false, 'Standard', 'North');
        simGame.players.push(player);
        player = new PinochlePlayer();
        player.Initialize('Seward', false, 'Standard', 'East');
        simGame.players.push(player);
    
        var currentSimPlayer = simGame.players[currentPlayerIndex];
        simGame.bidWinner = currentPlayerIndex;
        simGame.currentHighestBidder = currentSimPlayer;
    
        // Create the list of cards remaining in the deck
        var gameCards=aGame.GetAllCards(aGame.isDoubleDeck);
        var cardsRemaining = [];
        for (var i=0; i<gameCards.length; i++) {
            var isAlreadyPlayed = false;
            for (var j=0; j<currentPlayerCards.length; j++) {
                if (currentPlayerCards[j].id === gameCards[i].id) {
                    isAlreadyPlayed = true;
                    break;
                }
            }
            if (isAlreadyPlayed) {
                continue;
            }
            
            cardsRemaining.push(gameCards[i]);
        }
    
        // Create a round bid analysis result
        var roundBidAnalysis = {};
        roundBidAnalysis.safeBids = [];
        roundBidAnalysis.standardBids = [];
        roundBidAnalysis.suggestedBids = [];
        var suits = ['S','H','C','D'];
        roundBidAnalysis.histogramsBySuit = [];
        for (var i=0; i<suits.length; i++) {
            roundBidAnalysis.histogramsBySuit[suits[i]] = [];
        }
    
        var simulationsPerSuit = 500;
        var totalSimulations = simulationsPerSuit*4;
        for (var simIndex = 0; simIndex < totalSimulations; simIndex++) {
            // Try each suit
            simGame.trumpSuit = suits[simIndex%4];
    
            // Reset the sim game state
            for (var k=0; k<4; k++) {
                var simPlayer = simGame.players[k];
                simPlayer.currentRoundMeldScore = 0;
                simPlayer.currentRoundCountersTaken = 0;
                simPlayer.melds = [];
                simPlayer.cards = [];
                simPlayer.isShownVoidInSuit = [false, false, false, false];
            }
            simGame.cardsPlayedThisRound = [];
            simGame.trickCards = [];
            simGame.dealerIndex = aGame.dealerIndex;
            simGame.leadIndex = currentSimPlayer.playerPositionInt;
            simGame.turnIndex = currentSimPlayer.playerPositionInt;
    
            // Shuffle the deck
            var deckIdx = 0;
            for (var k = cardsRemaining.length - 1; k > 0; k--) {
                var randIdx = Math.floor(Math.random() * (k + 1));
                x = cardsRemaining[k];
                cardsRemaining[k] = cardsRemaining[randIdx];
                cardsRemaining[randIdx] = x;
            }
    
            // Deal the cards to each player
            for (var n=0; n<currentPlayerCards.length; n++) {
                var card = currentPlayerCards[n];
                card.wasPassed = false;
                card.wasShown = false;
                currentSimPlayer.cards.push(card);
            }
            var deckIdx = 0;
            for (var n=0; n<4; n++) {
                var player = simGame.players[n];
                while (player.cards.length != currentSimPlayer.cards.length) {
                    player.cards.push(cardsRemaining[deckIdx]);
                    deckIdx++;
                }
            }
    
            // Pass cards
            if (passingCardsCount > 0) {
                var passingPlayer = simGame.players[(currentSimPlayer.playerPositionInt+2)%4];
                var receivingPlayer = currentSimPlayer;
                receivingPlayer.receivedCards = [];
                var passingCards = passingPlayer.FindBestPassingCards(passingCardsCount, passingPlayer.skillLevel, simGame);
                for (var n=0; n<passingCards.length; n++) {
                    var card = passingCards[n];
                    card.wasPassed = true;
                    passingPlayer.cards.splice(passingPlayer.cards.indexOf(card),1);
                    receivingPlayer.cards.push(card);
                    receivingPlayer.receivedCards.push(card);
                }
    
                passingPlayer = currentSimPlayer;
                receivingPlayer = simGame.players[(currentSimPlayer.playerPositionInt+2)%4];
                receivingPlayer.receivedCards = [];
                var passingCards = passingPlayer.FindBestPassingCards(passingCardsCount, passingPlayer.skillLevel, simGame);
                for (var n=0; n<passingCards.length; n++) {
                    var card = passingCards[n];
                    card.wasPassed = true;
                    passingPlayer.cards.splice(passingPlayer.cards.indexOf(card),1);
                    receivingPlayer.cards.push(card);
                    receivingPlayer.receivedCards.push(card);
                }
            }
    
            // Count Melds
            for (var i=0; i<4; i++) {
                var player = simGame.players[i];
                player.passingCards = [];
                player.CalculateMelds(player.cards, simGame.trumpSuit, simGame.isDoubleDeck, false);
                for (var n=0; n<player.melds.length; n++) {
                    var meld = player.melds[n];
                    for (var k=0; k<meld.cards.length; k++) {
                        var card = meld.cards[k];
                        card.wasShown = true;
                    }
                }
            }
    
            // Play out trick taking
            while (currentSimPlayer.cards.length>0) {
                simGame.trickCards = [];
                while (simGame.trickCards.length < 4) {
                    var nextPlayer = simGame.players[simGame.turnIndex%4];
                    var nextCard = nextPlayer.FindBestPlayingCard(simGame, nextPlayer.skillLevel);
                    PlayCard(simGame,nextCard);
                }
    
                var trickResult = GetTrickResult(simGame);
                trickResult.trickTaker.currentRoundCountersTaken += trickResult.countersTaken;
                simGame.leadIndex = trickResult.trickTaker.playerPositionInt;
                simGame.turnIndex = simGame.leadIndex;
            }
    
            // Count round score
            var teamMeldScore = simGame.players[(currentSimPlayer.playerPositionInt+2)%4].currentRoundMeldScore + currentSimPlayer.currentRoundMeldScore;
            var teamCountersScore = simGame.players[(currentSimPlayer.playerPositionInt+2)%4].currentRoundCountersTaken + currentSimPlayer.currentRoundCountersTaken;
            var teamRoundScore = teamMeldScore + teamCountersScore;
            var curSuitHistograms = roundBidAnalysis.histogramsBySuit[simGame.trumpSuit];
            if (curSuitHistograms[teamRoundScore] == null) {
                curSuitHistograms[teamRoundScore] = 1;
            } else {
                curSuitHistograms[teamRoundScore] += 1;
            }
        }
    
        roundBidAnalysis.simulationsCount = simulationsPerSuit;
        roundBidAnalysis.suggestedSuit = suits[0];
        roundBidAnalysis.standardBid = 0;
        roundBidAnalysis.suggestedBid = 0;
        for (var i=0; i<4; i++) {
            var scoresAchievedCount = 0;
            var safeScoresAchievedThresh = roundBidAnalysis.simulationsCount * 0.1;
            var standardScoresAchievedThresh = roundBidAnalysis.simulationsCount * 0.18;
            var suggestedScoresAchievedThresh = roundBidAnalysis.simulationsCount * 0.25;
            var safeScoresThreshFound = false;
            var suggestedThreshFound = false;
            var standardScoresThreshFound = false;
            var roundScoresHistogram = roundBidAnalysis.histogramsBySuit[suits[i]];
            for (var j=0; j<roundScoresHistogram.length; j++) {
                if (roundScoresHistogram[j] == null) {
                    continue;
                }
                scoresAchievedCount += roundScoresHistogram[j];
                if (!safeScoresThreshFound && scoresAchievedCount >= safeScoresAchievedThresh) {
                    safeScoresThreshFound = true;
                    roundBidAnalysis.safeBids[i] = j;
                }
                if (!standardScoresThreshFound && scoresAchievedCount >= standardScoresAchievedThresh) {
                    standardScoresThreshFound = true;
                    roundBidAnalysis.standardBids[i] = j;
                    if (j > roundBidAnalysis.standardBid) {
                        roundBidAnalysis.standardBid = j;
                    }
                    continue;
                }
                if (!suggestedThreshFound && scoresAchievedCount >= suggestedScoresAchievedThresh) {
                    suggestedThreshFound = true;
                    roundBidAnalysis.suggestedBids[i] = j;
                    if (j > roundBidAnalysis.suggestedBid) {
                        roundBidAnalysis.suggestedBid = j;
                        roundBidAnalysis.suggestedSuit = suits[i];
                    }
                }
            }
        }
    
        var bid;
        if (currentPlayerSkill == 'Standard') {
            bid = [roundBidAnalysis.standardBid, roundBidAnalysis.suggestedSuit];
        } else { // Pro
            bid = [roundBidAnalysis.suggestedBid, roundBidAnalysis.suggestedSuit];
        }
        return bid;
    }

    this.OnFinishedAnalyzingBestBid = function(bestBid, minimumEndTime) {
        this.currentRoundMaximumBid = bestBid[0];
        this.currentRoundWinningBidTrump = bestBid[1];
        
        if (game.currentHighestBidder == null) {
            this.currentRoundBid = Number(game.settings.GetSetting('setting_minimum_bid'));
            game.currentHighestBidder = this;
        } else {
            // Don't get into a bidding war with your partner
            var passCount = 0;
            for (var i=0; i<4; i++) {
                if (game.players[i].currentRoundBidIsPass) {
                    passCount++;
                }
            }
            if (passCount == 2 && game.currentHighestBidder.playerPositionInt == (this.playerPositionInt+2)%4) {
                this.currentRoundBidIsPass = true;
            } else if (this.currentRoundMaximumBid > game.currentHighestBidder.currentRoundBid) {
                this.currentRoundBid = game.currentHighestBidder.currentRoundBid + 1;
                game.currentHighestBidder = this;
            } else {
                this.currentRoundBidIsPass = true;
            }
        }
    

        var endTime = performance.now();
        var waitTime = 0;
        if (endTime < minimumEndTime) {
            waitTime = minimumEndTime - endTime;
        }
        setTimeout(function(player) {
            game.OnPlayerFinishedChoosingBid(player);
        }, waitTime, this);
    }

    this.ChoosePassingCards = function(passingCardsCount) {
        this.passingCards = [];
        if (this.isHuman) {
            game.PromptPlayerToChoosePassingCards();
        } else {
            var bestCards = this.FindBestPassingCards(passingCardsCount, this.skillLevel, game);
            this.passingCards = bestCards;
            this.cards = this.cards.filter((el) => !bestCards.includes(el));
            game.PlayerChosePassingCards(this);
        }
    }

    this.FindBestPassingCards = function(passingCardsCount, aSkillLevel, aGame) {
        switch (aSkillLevel) {
            case 'Easy':
            {
                var cardsToPass = [];
                for (var i=0; i<passingCardsCount; i++) {
                    cardsToPass.push(this.cards[i]);
                }
                return cardsToPass;
            }
            case 'Standard':
            {
                var cardsToPass = [];
                var availableCards = [].concat(this.cards);
                this.CalculateMelds(availableCards, aGame.trumpSuit, aGame.isDoubleDeck, true);

                var fullHandCardCount = aGame.isDoubleDeck ? 20 : 12;
                if (availableCards.length > fullHandCardCount) {
                    
                    //
                    // Passing back to partner
                    //

                    // Remove melding cards
                    var nonMeldCards = [].concat(availableCards);
                    for (var i=0; i<this.melds.length; i++) {
                        for (var j=0; j<this.melds[i].cards.length; j++) {
                            var index = nonMeldCards.indexOf(this.melds[i].cards[j]);
                            if (index != -1) {
                                nonMeldCards.splice(index, 1);
                            }
                        }
                    }

                    // Reason: Potential marriage
                    // add nontrump kings (but not if they were received because they are thus not a potential marriage)
                    for (var i=0; i<nonMeldCards.length; i++) {
                        var card = nonMeldCards[i];
                        if (this.receivedCards.includes(card)) {
                            continue;
                        }
                        if (card.rank == 13 && card.suit != aGame.trumpSuit) {
                            cardsToPass.push(card);
                            nonMeldCards.splice(nonMeldCards.indexOf(card),1);
                            i--;

                            // Stop if we have enough
                            if (cardsToPass.length == passingCardsCount) {
                                return cardsToPass;
                            }
                        }
                    }

                    // Reason: Potential marriage
                    // add nontrump queens (but not if they were received because they are thus not a potential marriage)
                    for (var i=0; i<nonMeldCards.length; i++) {
                        var card = nonMeldCards[i];
                        if (this.receivedCards.includes(card)) {
                            continue;
                        }
                        if (card.rank == 12 && card.suit != aGame.trumpSuit) {
                            cardsToPass.push(card);
                            nonMeldCards.splice(nonMeldCards.indexOf(card),1);
                            i--;

                            // Stop if we have enough
                            if (cardsToPass.length == passingCardsCount) {
                                return cardsToPass;
                            }
                        }
                    }

                    // Reason: Potential marriage
                    // Jack of Diamonds (but not if they were received because they are thus not a potential marriage)
                    for (var i=0; i<nonMeldCards.length; i++) {
                        var card = nonMeldCards[i];
                        if (this.receivedCards.includes(card)) {
                            continue;
                        }
                        if (card.rank == 11 && card.suit == 'D') {
                            cardsToPass.push(card);
                            nonMeldCards.splice(nonMeldCards.indexOf(card),1);
                            i--;

                            // Stop if we have enough
                            if (cardsToPass.length == passingCardsCount) {
                                return cardsToPass;
                            }
                        }
                    }

                    // Add the rest of the non trump cards (prefer low non trumps)
                    nonMeldCards.sort(function(a,b){
                        if (a.suit == aGame.trumpSuit && b.suit == aGame.trumpSuit) {
                            return a.value - b.value;
                        } else if (a.suit == aGame.trumpSuit) {
                            return 1;
                        } else if (b.suit == aGame.trumpSuit) {
                            return -1;
                        } else {
                            return a.value - b.value;
                        }
                    });
                    for (var i=0; i<nonMeldCards.length; i++) {
                        var card = nonMeldCards[i];
                        cardsToPass.push(card);
                        // Stop if we have enough
                        if (cardsToPass.length == passingCardsCount) {
                            return cardsToPass;
                        }
                    }

                    // We will have to break up meld scores so find the amount of meld score that each card is responsible for
                    var meldCards = [];
                    for (var i=0; i<this.melds.length; i++) {
                        for (var j=0; j<this.melds[i].cards.length; j++) {
                            var card = this.melds[i].cards[j];
                            if (!meldCards.includes(card)) {
                                card.meldScoreIncrease = 0;
                                meldCards.push(card);
                            }
                        }
                    }
                    for (var i=0; i<this.melds.length; i++) {
                        for (var j=0; j<this.melds[i].cards.length; j++) {
                            this.melds[i].cards[j].meldScoreIncrease += this.melds[i].score;
                        }
                    }
                    meldCards.sort(function(a,b){
                        return a.meldScoreIncrease - b.meldScoreIncrease;
                    });
                    for (var i=0; i<meldCards.length; i++) {
                        var card = meldCards[i];
                        cardsToPass.push(card);
                        // Stop if we have enough
                        if (cardsToPass.length == passingCardsCount) {
                            return cardsToPass;
                        }
                    }

                } else {
                    //
                    // Passing to the bid winner
                    //

                    // Remove the melding cards
                    for (var i=0; i<this.melds.length; i++) {
                        var meld = this.melds[i];
                        if (availableCards.length - meld.cards.length >= passingCardsCount) {
                            for (var j=0; j<meld.cards.length; j++) {
                                var index = availableCards.indexOf(meld.cards[j]);
                                if (index != -1) {
                                    availableCards.splice(index, 1);
                                }
                            }
                        }
                    }

                    // Prefer high trumps and then high non-trumps
                    availableCards.sort(function(a,b){
                        if (a.suit == aGame.trumpSuit && b.suit == aGame.trumpSuit) {
                            // Prefer high trumps
                            return b.value - a.value;
                        } else if (a.suit == aGame.trumpSuit) {
                            // Prefer trumps
                            return -1;
                        } else if (b.suit == aGame.trumpSuit) {
                            // Prefer trumps
                            return 1;
                        } else {
                            return b.value - a.value;
                        }
                    });
                    while (availableCards.length > passingCardsCount) {
                        availableCards.pop();
                    }
                    return availableCards;
                }

                return cardsToPass;
            }
            break;

            case 'Pro':
            {
                var cardsToPass = [];
                var availableCards = [].concat(this.cards);

                // Include cards that have already been selected for passing
                if (this.passingCards.length > 0) {
                    availableCards = availableCards.concat(this.passingCards);
                    if (game.settings.GetSetting('setting_sort_left_to_right')) {
                        availableCards.sort(function(a,b) {
                            if (a.suit != b.suit) {
                                return a.suitInt - b.suitInt;
                            } else if (a.value == b.value) {
                                return a.deckID - b.deckID;
                            } else {
                                return b.value - a.value;
                            }
                        });
                    } else {
                        availableCards.sort(function(a,b) {
                            if (a.suit != b.suit) {
                                return a.suitInt - b.suitInt;
                            } else if (a.value == b.value) {
                                return a.deckID - b.deckID;
                            } else {
                                return a.value - b.value;
                            }
                        });
                    }
                }

                this.CalculateMelds(availableCards, aGame.trumpSuit, aGame.isDoubleDeck, true);

                var fullHandCardCount = aGame.isDoubleDeck ? 20 : 12;
                if (availableCards.length > fullHandCardCount) {
                    
                    //
                    // Passing back to partner
                    //

                    // Remove melding cards
                    var nonMeldCards = [].concat(availableCards);
                    for (var i=0; i<this.melds.length; i++) {
                        for (var j=0; j<this.melds[i].cards.length; j++) {
                            var index = nonMeldCards.indexOf(this.melds[i].cards[j]);
                            if (index != -1) {
                                nonMeldCards.splice(index, 1);
                            }
                        }
                    }

                    // Reason: Potential marriage
                    // add nontrump kings (but not if they were received because they are thus not a potential marriage)
                    for (var i=0; i<nonMeldCards.length; i++) {
                        var card = nonMeldCards[i];
                        if (this.receivedCards.includes(card)) {
                            continue;
                        }
                        if (card.rank == 13 && card.suit != aGame.trumpSuit) {
                            cardsToPass.push(card);
                            nonMeldCards.splice(nonMeldCards.indexOf(card),1);
                            i--;

                            // Stop if we have enough
                            if (cardsToPass.length == passingCardsCount) {
                                return cardsToPass;
                            }
                        }
                    }

                    // Reason: Potential marriage
                    // add nontrump queens (but not if they were received because they are thus not a potential marriage)
                    for (var i=0; i<nonMeldCards.length; i++) {
                        var card = nonMeldCards[i];
                        if (this.receivedCards.includes(card)) {
                            continue;
                        }
                        if (card.rank == 12 && card.suit != aGame.trumpSuit) {
                            cardsToPass.push(card);
                            nonMeldCards.splice(nonMeldCards.indexOf(card),1);

                            // Stop if we have enough
                            if (cardsToPass.length == passingCardsCount) {
                                return cardsToPass;
                            }
                        }
                    }

                    // Reason: Potential marriage
                    // Jack of Diamonds (but not if they were received because they are thus not a potential marriage and not if trump is Diamonds)
                    if (aGame.trumpSuit != 'D') {
                        for (var i=0; i<nonMeldCards.length; i++) {
                            var card = nonMeldCards[i];
                            if (this.receivedCards.includes(card)) {
                                continue;
                            }
                            if (card.rank == 11 && card.suit == 'D') {
                                cardsToPass.push(card);
                                nonMeldCards.splice(nonMeldCards.indexOf(card),1);
                                i--;

                                // Stop if we have enough
                                if (cardsToPass.length == passingCardsCount) {
                                    return cardsToPass;
                                }
                            }
                        }
                    }

                    // Add the rest of the non trump cards (prefer low non trumps)
                    nonMeldCards.sort(function(a,b){
                        if (a.suit == aGame.trumpSuit && b.suit == aGame.trumpSuit) {
                            return a.value - b.value;
                        } else if (a.suit == aGame.trumpSuit) {
                            return 1;
                        } else if (b.suit == aGame.trumpSuit) {
                            return -1;
                        } else {
                            return a.value - b.value;
                        }
                    });
                    for (var i=0; i<nonMeldCards.length; i++) {
                        var card = nonMeldCards[i];
                        cardsToPass.push(card);
                        // Stop if we have enough
                        if (cardsToPass.length == passingCardsCount) {
                            return cardsToPass;
                        }
                    }

                    // We will have to break up meld scores so find the amount of meld score that each card is responsible for
                    var meldCards = [];
                    for (var i=0; i<this.melds.length; i++) {
                        for (var j=0; j<this.melds[i].cards.length; j++) {
                            var card = this.melds[i].cards[j];
                            if (!meldCards.includes(card)) {
                                card.meldScoreIncrease = 0;
                                meldCards.push(card);
                            }
                        }
                    }
                    for (var i=0; i<this.melds.length; i++) {
                        for (var j=0; j<this.melds[i].cards.length; j++) {
                            this.melds[i].cards[j].meldScoreIncrease += this.melds[i].score;
                        }
                    }
                    meldCards.sort(function(a,b){
                        return a.meldScoreIncrease - b.meldScoreIncrease;
                    });
                    for (var i=0; i<meldCards.length; i++) {
                        var card = meldCards[i];
                        cardsToPass.push(card);
                        // Stop if we have enough
                        if (cardsToPass.length == passingCardsCount) {
                            return cardsToPass;
                        }
                    }

                } else {

                    //
                    // Passing to the bid winner
                    //
                    
                    // Find the first set of cards in this order:
                    // ATrump, 10Trump, KTrump, QTrump, JTrump
                    // AH, AS, AD, AC
                    // ATrump, 10Trump, KTrump, QTrump, JTrump
                    // AH, AS, AD, AC
                    // 9Trump
                    // QS, JD
                    // Js
                    // 9s
                    // lowest contributing meld cards
                    // Ks
                    // 10s

                    // Remove melding cards
                    var nonMeldCards = [].concat(availableCards);
                    for (var i=0; i<this.melds.length; i++) {
                        if (this.melds[i].meldType == 'RoyalMarriage') {
                            continue;
                        }
                        for (var j=0; j<this.melds[i].cards.length; j++) {
                            var index = nonMeldCards.indexOf(this.melds[i].cards[j]);
                            if (index != -1) {
                                nonMeldCards.splice(index, 1);
                            }
                        }
                    }

                    // Helper function
                    var TryToGetCard = function(rank, suit, aCards, aPassingCards) {
                        for (var i=0; i<aCards.length; i++) {
                            var card = aCards[i];
                            if (card.suit == suit && card.rank == rank) {
                                aPassingCards.push(card);
                                aCards.splice(aCards.indexOf(card),1);
                                return;
                            }
                        }
                    }

                    var timesToLoop = aGame.isDoubleDeck ? 4 : 2;
                    for (var ctr=0; ctr<timesToLoop; ctr++) {
                        // ATrump, 10Trump, KTrump, QTrump, JTrump
                        TryToGetCard(1,aGame.trumpSuit,nonMeldCards,cardsToPass);
                        if (cardsToPass.length == passingCardsCount) { return cardsToPass; }
                        TryToGetCard(10,aGame.trumpSuit,nonMeldCards,cardsToPass);
                        if (cardsToPass.length == passingCardsCount) { return cardsToPass; }
                        TryToGetCard(13,aGame.trumpSuit,nonMeldCards,cardsToPass);
                        if (cardsToPass.length == passingCardsCount) { return cardsToPass; }
                        TryToGetCard(12,aGame.trumpSuit,nonMeldCards,cardsToPass);
                        if (cardsToPass.length == passingCardsCount) { return cardsToPass; }
                        TryToGetCard(11,aGame.trumpSuit,nonMeldCards,cardsToPass);
                        if (cardsToPass.length == passingCardsCount) { return cardsToPass; }
                        
                        // AH, AS, AD, AC
                        var suits = ['S','H','C','D'];
                        for (var i=0; i<suits.length; i++) {
                            if (aGame.trumpSuit != suits[i]) {
                                TryToGetCard(1,suits[i],nonMeldCards,cardsToPass);
                                if (cardsToPass.length == passingCardsCount) { return cardsToPass; }
                            }
                        }
                    }
                    
                    // Any trump left
                    for (var i=0; i<nonMeldCards.length; i++) {
                        var card = nonMeldCards[i];
                        if (card.suit == aGame.trumpSuit) {
                            cardsToPass.push(card);
                            if (cardsToPass.length == passingCardsCount) { return cardsToPass; }
                            nonMeldCards.splice(nonMeldCards.indexOf(card),1);
                            i--;
                        }
                    }

                    // QS, JD
                    TryToGetCard(12,'S',nonMeldCards,cardsToPass);
                    if (cardsToPass.length == passingCardsCount) { return cardsToPass; }
                    TryToGetCard(11,'D',nonMeldCards,cardsToPass);
                    if (cardsToPass.length == passingCardsCount) { return cardsToPass; }
                    
                    // Jacks
                    for (var i=0; i<nonMeldCards.length; i++) {
                        var card = nonMeldCards[i];
                        if (card.rank == 11) {
                            cardsToPass.push(card);
                            if (cardsToPass.length == passingCardsCount) { return cardsToPass; }
                            nonMeldCards.splice(nonMeldCards.indexOf(card),1);
                            i--;
                        }
                    }

                    // 9s
                    for (var i=0; i<nonMeldCards.length; i++) {
                        var card = nonMeldCards[i];
                        if (card.rank == 9) {
                            cardsToPass.push(card);
                            if (cardsToPass.length == passingCardsCount) { return cardsToPass; }
                            nonMeldCards.splice(nonMeldCards.indexOf(card),1);
                            i--;
                        }
                    }

                    // Lowest meld cards
                    // We will have to break up meld scores so find the amount of meld score that each card is responsible for
                    var meldCards = [];
                    for (var i=0; i<this.melds.length; i++) {
                        for (var j=0; j<this.melds[i].cards.length; j++) {
                            var card = this.melds[i].cards[j];
                            if (!meldCards.includes(card)) {
                                card.meldScoreIncrease = 0;
                                meldCards.push(card);
                            }
                        }
                    }
                    for (var i=0; i<this.melds.length; i++) {
                        for (var j=0; j<this.melds[i].cards.length; j++) {
                            this.melds[i].cards[j].meldScoreIncrease += this.melds[i].score;
                        }
                    }
                    meldCards.sort(function(a,b){
                        return a.meldScoreIncrease - b.meldScoreIncrease;
                    });
                    for (var i=0; i<meldCards.length; i++) {
                        var card = meldCards[i];
                        cardsToPass.push(card);
                        // Stop if we have enough
                        if (cardsToPass.length == passingCardsCount) {
                            return cardsToPass;
                        }
                    }

                    // Kings
                    for (var i=0; i<nonMeldCards.length; i++) {
                        var card = nonMeldCards[i];
                        if (card.rank == 13) {
                            cardsToPass.push(card);
                            if (cardsToPass.length == passingCardsCount) { return cardsToPass; }
                            nonMeldCards.splice(nonMeldCards.indexOf(card),1);
                            i--;
                        }
                    }

                    // 10s
                    for (var i=0; i<nonMeldCards.length; i++) {
                        var card = nonMeldCards[i];
                        if (card.rank == 10) {
                            cardsToPass.push(card);
                            if (cardsToPass.length == passingCardsCount) { return cardsToPass; }
                            nonMeldCards.splice(nonMeldCards.indexOf(card),1);
                            i--;
                        }
                    }
                }

                // Safety
                cardsToPass = [];
                for (var i=0; i<passingCardsCount; i++) {
                    cardsToPass.push(this.cards[i]);
                }
                return cardsToPass;
            }

            case 'Custom':
            {
                try {
                    // Include any cards that might already be in the passing spots
                    var handCards = this.cards.concat(this.passingCards);
                    if (game.settings.GetSetting('setting_sort_left_to_right')) {
                        handCards.sort(function(a,b) {
                            if (a.suit != b.suit) {
                                return a.suitInt - b.suitInt;
                            } else if (a.value == b.value) {
                                return a.deckID - b.deckID;
                            } else {
                                return b.value - a.value;
                            }
                        });
                    } else {
                        handCards.sort(function(a,b) {
                            if (a.suit != b.suit) {
                                return a.suitInt - b.suitInt;
                            } else if (a.value == b.value) {
                                return a.deckID - b.deckID;
                            } else {
                                return a.value - b.value;
                            }
                        });
                    }

                    var fullHandCardCount = aGame.isDoubleDeck ? 20 : 12;
                    var customMethod = "";
                    if (handCards.length > fullHandCardCount) {
                        // Pass back
                        customMethod = this.GetDecisionMethod(2);
                        // Remove the first and last line of the code
                        customMethod = customMethod.substring(customMethod.indexOf("{") + 1);
                        customMethod = customMethod.substring(customMethod.lastIndexOf("}"), -1);

                        this.CalculateMelds(handCards, game.trumpSuit, game.isDoubleDeck, true);
                        
                        var f = new Function('handCards', 'receivedCards', 'melds', 'trumpSuit', 'isDoubleDeck', 'passingCardsCount', customMethod);
                        var bestCards = f(handCards, this.receivedCards, this.melds, game.trumpSuit, game.isDoubleDeck, passingCardsCount);
                        if (bestCards == undefined) {
                            throw "Custom decision failed.";
                        }
                        return bestCards;
                    } else {
                        // Pass to bid winner
                        customMethod = this.GetDecisionMethod(1);
                        // Remove the first and last line of the code
                        customMethod = customMethod.substring(customMethod.indexOf("{") + 1);
                        customMethod = customMethod.substring(customMethod.lastIndexOf("}"), -1);

                        this.CalculateMelds(handCards, game.trumpSuit, game.isDoubleDeck, true);
                        
                        var f = new Function('handCards', 'melds', 'trumpSuit', 'isDoubleDeck', 'passingCardsCount', customMethod);
                        var bestCards = f(handCards, this.melds, game.trumpSuit, game.isDoubleDeck, passingCardsCount);
                        if (bestCards == undefined) {
                            throw "Custom decision failed.";
                        }
                        return bestCards;
                    }
                    
                } catch (err) {
                    throw err;
                }
            }
            break;
        }
    }

    this.ChoosePlayCard = function() {
        if (this.isHuman) {
            game.PromptPlayerToPlayCard();
        } else {
            var card = this.FindBestPlayingCard(game, this.skillLevel);
            game.OnPlayerChosePlayCard(card);
        }
    }

    this.FindBestPlayingCard = function(aGame, aSkillLevel) {
        var possiblePlays = GetLegalCardsForCurrentPlayerTurn(aGame);
        switch (aSkillLevel) {
            case 'Easy':
                return possiblePlays[0];
            case 'Standard':
                return this.FindStandardPlayingCard(aGame, possiblePlays);
            case 'Pro':
                return this.FindProPlayingCard(aGame, possiblePlays);
            case 'Custom':
                var unPlayedCards = [];
                for (var j=0; j<4; j++) {
                    if (j == this.playerPositionInt) {
                        continue;
                    }
                    for (var k=0; k<aGame.players[j].cards.length; k++) {
                        unPlayedCards.push(aGame.players[j].cards[k]);
                    }
                }
                try {
                    var customMethod = this.GetDecisionMethod(3);
                    // Remove the method signature and paramters from the code
                    customMethod = customMethod.substring(customMethod.indexOf("{") + 1);
                    customMethod = customMethod.substring(customMethod.lastIndexOf("}"), -1);
                    var f = new Function('aGame', 'handCards', 'possiblePlays', 'trickCards', 'trumpSuit', 'unPlayedCards', 'currentPlayerPosition', customMethod);
                    var bestCard = f( 
                        aGame, 
                        this.cards, 
                        possiblePlays,
                        aGame.trickCards,
                        aGame.trumpSuit,
                        unPlayedCards,
                        this.playerPositionInt);
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

        if (aGame.trickCards.length == 0) {
            //
            // Choose a lead card
            //
            
            // Sort all cards with trumps first and then by highest value
            possiblePlays.sort(function(a,b){
                if (a.suit == aGame.trumpSuit && b.suit != aGame.trumpSuit) {
                    return -1;
                } else if (a.suit != aGame.trumpSuit && b.suit == aGame.trumpSuit) {
                    return 1;
                } else {
                    return b.value - a.value;
                }
            });

            // Play highest trump that is gauranteed to take the trick
            // Otherwise play the highest non trump card
            for (var i=0; i<possiblePlays.length; i++) {
                var card = possiblePlays[i];
                if (card.suit == aGame.trumpSuit) {
                    var higherTrumpCardExists = false;
                    for (var j=0; j<4; j++) {
                        if (j==this.playerPositionInt) {
                            continue;
                        }
                        var unPlayedCards = aGame.players[j].cards;
                        for (var k=0; k<unPlayedCards.length; k++) {
                            if (unPlayedCards[k].suit == card.suit && unPlayedCards[k].value > card.value) {
                                higherTrumpCardExists = true;
                                break;
                            }
                        }
                        if (higherTrumpCardExists) {
                            break;
                        }
                    }
                    if (!higherTrumpCardExists) {
                        // This trump card is gauranteed to take the trick
                        // If this is our last trump card and everyone else is void in trump then we will save it
                        if (possiblePlays.length > 1 && possiblePlays[1].suit != aGame.trumpSuit) {
                            // This is the last trump card in our hand and no one can beat it
                            continue;
                        }
                        // Play this guaranteed trump
                        return card;
                    }
                } else {
                    // Highest non trump card
                    return card;
                }
            }
        
            // We only have trumps and none will take the trick so play our lowest
            return possiblePlays[possiblePlays.length-1];
        
        } else {
            var leadCard = aGame.trickCards[0];
            var play = possiblePlays[0];
            if (play.suit == leadCard.suit) {
                //
                // Must play of same suit
                //
                possiblePlays.sort(function(a,b){
                    return a.value - b.value;
                });

                var highestCardInTrickPosition = aGame.leadIndex;
                var highestCardInTrick = leadCard;
                for (var i=1; i<aGame.trickCards.length; i++) {
                    var playedCard = aGame.trickCards[i];
                    if ((playedCard.suit == highestCardInTrick.suit && playedCard.value > highestCardInTrick.value) ||
                        (playedCard.suit == aGame.trumpSuit && highestCardInTrick.suit != aGame.trumpSuit)) {
                            highestCardInTrick = playedCard;
                            highestCardInTrickPosition = (aGame.leadIndex+i)%4;
                        }
                }
                // Check if we already cant take the trick
                var cantTakeTrick = true;
                for (var i=0; i<possiblePlays.length; i++) {
                    var card = possiblePlays[i];
                    if ((card.suit == highestCardInTrick.suit && card.value > highestCardInTrick.value) ||
                        (card.suit == aGame.trumpSuit && highestCardInTrick.suit != aGame.trumpSuit)){
                        cantTakeTrick = false;
                        break;
                    }
                }
                if (cantTakeTrick) {
                    var highestTakerIsPartner = highestCardInTrickPosition == (this.playerPositionInt+2)%4;
                    if (highestTakerIsPartner) {
                        // Play our lowest counter
                        for (var i=0; i<possiblePlays.length; i++) {
                            var card = possiblePlays[i];
                            if (card.rank == 13 || card.rank == 10 || card.rank == 1) {
                                return card;
                            }
                        }
                        // No counter found so play the lowest card possible
                        return possiblePlays[0];
                    } else {
                        // No counter found so play the lowest card possible
                        return possiblePlays[0];
                    } 
                }

                if (aGame.trickCards.length < 3) {
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
            } else if (play.suit == aGame.trumpSuit) {
                //
                // Must play a trump card
                //
                var highestCardInTrickPosition = aGame.leadIndex;
                var highestCardInTrick = leadCard;
                for (var i=1; i<aGame.trickCards.length; i++) {
                    var playedCard = aGame.trickCards[i];
                    if ((playedCard.suit == highestCardInTrick.suit && playedCard.value > highestCardInTrick.value) ||
                        (playedCard.suit == aGame.trumpSuit && highestCardInTrick.suit != aGame.trumpSuit)) {
                            highestCardInTrick = playedCard;
                            highestCardInTrickPosition = (aGame.leadIndex+i)%4;
                        }
                }
                
                possiblePlays.sort(function(a,b){
                    return a.value - b.value;
                });

                // Check if we already cant take the trick
                var cantTakeTrick = true;
                for (var i=0; i<possiblePlays.length; i++) {
                    var card = possiblePlays[i];
                    if ((card.suit == highestCardInTrick.suit && card.value > highestCardInTrick.value) ||
                        (card.suit == aGame.trumpSuit && highestCardInTrick.suit != aGame.trumpSuit)){
                        cantTakeTrick = false;
                        break;
                    }
                }
                if (cantTakeTrick) {
                    var highestTakerIsPartner = highestCardInTrickPosition == (this.playerPositionInt+2)%4;
                    if (highestTakerIsPartner) {
                        // Play our lowest counter
                        for (var i=0; i<possiblePlays.length; i++) {
                            var card = possiblePlays[i];
                            if (card.rank == 13 || card.rank == 10 || card.rank == 1) {
                                return card;
                            }
                        }
                        // No counter found so play the lowest card possible
                        return possiblePlays[0];
                    } else {
                        // No counter found so play the lowest card possible
                        return possiblePlays[0];
                    }
                } else {
                    if (aGame.trickCards.length < 3) {
                        // Play highest card
                        return possiblePlays[possiblePlays.length-1];
                    } else {
                        // Play lowest card
                        return possiblePlays[0];
                    }
                }
            } else {
                //
                // Must play a non trump, off suit card
                //

                var highestCardInTrickPosition = aGame.leadIndex;
                var highestCardInTrick = leadCard;
                for (var i=1; i<aGame.trickCards.length; i++) {
                    var playedCard = aGame.trickCards[i];
                    if ((playedCard.suit == highestCardInTrick.suit && playedCard.value > highestCardInTrick.value) ||
                        (playedCard.suit == aGame.trumpSuit && highestCardInTrick.suit != aGame.trumpSuit)) {
                            highestCardInTrick = playedCard;
                            highestCardInTrickPosition = (aGame.leadIndex+i)%4;
                        }
                }

                possiblePlays.sort(function(a,b){
                    return a.value - b.value;
                });

                var highestTakerIsPartner = highestCardInTrickPosition == (this.playerPositionInt+2)%4;
                if (highestTakerIsPartner) {
                    // Play our lowest counter
                    for (var i=0; i<possiblePlays.length; i++) {
                        var card = possiblePlays[i];
                        if (card.rank == 13 || card.rank == 10 || card.rank == 1) {
                            return card;
                        }
                    }
                    // No counter found so play the lowest card possible
                    return possiblePlays[0];
                } else {
                    // Play lowest card
                    return possiblePlays[0];
                }
            }
        }
    }

    this.FindProPlayingCard = function(aGame, possiblePlays) {
        
        if (aGame.trickCards.length == 0) {
            //
            // Choose a lead card
            //
            
            // Sort all cards with trumps first and then by highest value
            possiblePlays.sort(function(a,b){
                if (a.suit == aGame.trumpSuit && b.suit != aGame.trumpSuit) {
                    return -1;
                } else if (a.suit != aGame.trumpSuit && b.suit == aGame.trumpSuit) {
                    return 1;
                } else {
                    return b.value - a.value;
                }
            });

            var firstCard = possiblePlays[0];
            if (firstCard.suit == aGame.trumpSuit) {
                var higherTrumpCardExists = false;
                var anyTrumpSuitExists = false;
                for (var j=0; j<4; j++) {
                    if (j == this.playerPositionInt) {
                        continue;
                    }
                    var unPlayedCards = aGame.players[j].cards;
                    for (var k=0; k<unPlayedCards.length; k++) {
                        if (unPlayedCards[k].suit == aGame.trumpSuit) {
                            anyTrumpSuitExists = true;
                        }
                        if (unPlayedCards[k].suit == aGame.trumpSuit && unPlayedCards[k].value > firstCard.value) {
                            higherTrumpCardExists = true;
                            break;
                        }
                    }
                    if (higherTrumpCardExists) {
                        break;
                    }
                }
                if (!higherTrumpCardExists) {
                    if (anyTrumpSuitExists) {
                        // Play this gauranteed trump
                        return firstCard;
                    }
                }
            }

            // Check for any non-trump gauranteed trick takers
            var suits = ['S', 'H', 'C', 'D'];
            var trumpSuitIndex = 0;
            for (var i=0; i<suits.length; i++) {
                if (suits[i] == aGame.trumpSuit) {
                    trumpSuitIndex = i;
                    break;
                }
            }
            for (var k=0; k<suits.length; k++) {
                var checkSuit = suits[k];
                if (checkSuit == aGame.trumpSuit) {
                    continue;
                }

                var highestCardOfSuit = null;
                for (var j=possiblePlays.length-1; j>=0; j--) {
                    var possibleCard = possiblePlays[j];
                    if (possibleCard.suit == checkSuit &&
                        (highestCardOfSuit == null || highestCardOfSuit.value < possibleCard.value)) {
                        highestCardOfSuit = possibleCard;
                    }
                }
                if (highestCardOfSuit != null) {
                    // Check if it is gauranteed
                    var higherCardExists = false;
                    for (var j=0; j<4; j++) {
                        if (j == this.playerPositionInt) {
                            continue;
                        }

                        var otherPlayer = aGame.players[j];
                        // If the other player is void in this suit
                        //and they are not void in trumps then consider that higher card exists
                        if (otherPlayer.playerPositionInt == (this.playerPositionInt+1)%4 || otherPlayer.playerPositionInt == (this.playerPositionInt+3)%4) {
                            if (otherPlayer.isShownVoidInSuit[k] && !otherPlayer.isShownVoidInSuit[trumpSuitIndex]) {
                                higherCardExists = true;
                                break;
                            }
                        }
                        
                        var otherCards = otherPlayer.cards;
                        for (var m=0; m<otherCards.length; m++) {
                            var otherCard = otherCards[m];
                            if (otherCard.suit == checkSuit && otherCard.value > highestCardOfSuit.value)
                            {
                                higherCardExists = true;
                                break;
                            }
                        }
                        if (higherCardExists)
                        {
                            break;
                        }
                    }
                    if (!higherCardExists) {
                        return highestCardOfSuit;
                    }
                }
            }

            // If the only cards left are trump then play the highest trump
            if (possiblePlays[possiblePlays.length-1].suit == aGame.trumpSuit) {
                // We only have trumps
                // Don't play a counter if our opponent still has a higher trump
                var otherPlayer1 = aGame.players[(this.playerPositionInt+1)%4];
                var otherPlayer2 = aGame.players[(this.playerPositionInt+3)%4];
                var highestTrump = possiblePlays[0];
                for (var m=0; m<otherPlayer1.cards.length; m++) {
                    var otherCard = otherPlayer1.cards[m];
                    if (otherCard.suit == highestTrump.suit && otherCard.value > highestTrump.value) {
                        // Opponents have a higher trump so we will play our lowest to hopefully not give away a pointer
                        return possiblePlays[possiblePlays.length-1];
                    }
                }
                for (var m=0; m<otherPlayer2.cards.length; m++) {
                    var otherCard = otherPlayer2.cards[m];
                    if (otherCard.suit == highestTrump.suit && otherCard.value > highestTrump.value) {
                        // Opponents have a higher trump so we will play our lowest to hopefully not give away a pointer
                        return possiblePlays[possiblePlays.length-1];
                    }
                }
                
                // Play our highest trump
                return possiblePlays[0];
            } else {
                // Otherwise we are not going to take the trick so we might be able to save our higher counters
                return possiblePlays[possiblePlays.length-1];
            }
        
        } else {
            
            var leadCard = aGame.trickCards[0];
            var play = possiblePlays[0];
            if (play.suit == leadCard.suit) {
                //
                // Must play of same suit
                //
                possiblePlays.sort(function(a,b){
                    return a.value - b.value;
                });

                var highestCardInTrickPosition = aGame.leadIndex;
                var highestCardInTrick = leadCard;
                for (var i=1; i<aGame.trickCards.length; i++) {
                    var playedCard = aGame.trickCards[i];
                    if ((playedCard.suit == highestCardInTrick.suit && playedCard.value > highestCardInTrick.value) ||
                        (playedCard.suit == aGame.trumpSuit && highestCardInTrick.suit != aGame.trumpSuit)) {
                            highestCardInTrick = playedCard;
                            highestCardInTrickPosition = (aGame.leadIndex+i)%4;
                        }
                }
                // Check if we already cant take the trick
                var cantTakeTrick = true;
                for (var i=0; i<possiblePlays.length; i++) {
                    var card = possiblePlays[i];
                    if ((card.suit == highestCardInTrick.suit && card.value > highestCardInTrick.value) ||
                        (card.suit == aGame.trumpSuit && highestCardInTrick.suit != aGame.trumpSuit)){
                        cantTakeTrick = false;
                        break;
                    }
                }
                if (cantTakeTrick) {
                    var highestTakerIsPartner = highestCardInTrickPosition == (this.playerPositionInt+2)%4;
                    if (highestTakerIsPartner) {
                        // Play our lowest counter
                        for (var i=0; i<possiblePlays.length; i++) {
                            var card = possiblePlays[i];
                            if (card.rank == 13 || card.rank == 10 || card.rank == 1) {
                                return card;
                            }
                        }
                        // No counter found so play the lowest card possible
                        return possiblePlays[0];
                    } else {
                        // No counter found so play the lowest card possible
                        return possiblePlays[0];
                    } 
                }

                if (aGame.trickCards.length < 3) {
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
            } else if (play.suit == aGame.trumpSuit) {
                //
                // Must play a trump card
                //
                var highestCardInTrickPosition = aGame.leadIndex;
                var highestCardInTrick = leadCard;
                for (var i=1; i<aGame.trickCards.length; i++) {
                    var playedCard = aGame.trickCards[i];
                    if ((playedCard.suit == highestCardInTrick.suit && playedCard.value > highestCardInTrick.value) ||
                        (playedCard.suit == aGame.trumpSuit && highestCardInTrick.suit != aGame.trumpSuit)) {
                            highestCardInTrick = playedCard;
                            highestCardInTrickPosition = (aGame.leadIndex+i)%4;
                        }
                }
                
                possiblePlays.sort(function(a,b){
                    return a.value - b.value;
                });

                // Check if we already cant take the trick
                var cantTakeTrick = true;
                for (var i=0; i<possiblePlays.length; i++) {
                    var card = possiblePlays[i];
                    if ((card.suit == highestCardInTrick.suit && card.value > highestCardInTrick.value) ||
                        (card.suit == aGame.trumpSuit && highestCardInTrick.suit != aGame.trumpSuit)){
                        cantTakeTrick = false;
                        break;
                    }
                }
                if (cantTakeTrick) {
                    var highestTakerIsPartner = highestCardInTrickPosition == (this.playerPositionInt+2)%4;
                    if (highestTakerIsPartner) {
                        // Play our lowest counter
                        for (var i=0; i<possiblePlays.length; i++) {
                            var card = possiblePlays[i];
                            if (card.rank == 13 || card.rank == 10 || card.rank == 1) {
                                return card;
                            }
                        }
                        // No counter found so play the lowest card possible
                        return possiblePlays[0];
                    } else {
                        // No counter found so play the lowest card possible
                        return possiblePlays[0];
                    }
                } else {
                    if (aGame.trickCards.length < 3) {
                        // Play highest card
                        return possiblePlays[possiblePlays.length-1];
                    } else {
                        // Play lowest card
                        return possiblePlays[0];
                    }
                }
            } else {
                //
                // Must play a non trump, off suit card
                //

                var highestCardInTrickPosition = aGame.leadIndex;
                var highestCardInTrick = leadCard;
                for (var i=1; i<aGame.trickCards.length; i++) {
                    var playedCard = aGame.trickCards[i];
                    if ((playedCard.suit == highestCardInTrick.suit && playedCard.value > highestCardInTrick.value) ||
                        (playedCard.suit == aGame.trumpSuit && highestCardInTrick.suit != aGame.trumpSuit)) {
                            highestCardInTrick = playedCard;
                            highestCardInTrickPosition = (aGame.leadIndex+i)%4;
                        }
                }

                possiblePlays.sort(function(a,b){
                    return a.value - b.value;
                });

                var highestTakerIsPartner = highestCardInTrickPosition == (this.playerPositionInt+2)%4;
                if (highestTakerIsPartner) {
                    // Play our lowest counter
                    for (var i=0; i<possiblePlays.length; i++) {
                        var card = possiblePlays[i];
                        if (card.rank == 13 || card.rank == 10 || card.rank == 1) {
                            return card;
                        }
                    }
                    // No counter found so play the lowest card possible
                    return possiblePlays[0];
                } else {
                    // Play lowest card
                    return possiblePlays[0];
                }
            }
        }
    }

    var AcesQuadrupleArrayHashes = [['AS',4],['AC',4],['AD',4],['AH',4]];
    var AcesTripleArrayHashes = [['AS',3],['AC',3],['AD',3],['AH',3]];
    var AcesDoubleArrayHashes = [['AS',2],['AC',2],['AD',2],['AH',2]];
    var AcesArrayHashes = [['AS',1],['AC',1],['AD',1],['AH',1]];
    var KingsQuadrupleArrayHashes = [['KS',4],['KC',4],['KD',4],['KH',4]];
    var KingsTripleArrayHashes = [['KS',3],['KC',3],['KD',3],['KH',3]];
    var KingsDoubleArrayHashes = [['KS',2],['KC',2],['KD',2],['KH',2]];
    var KingsArrayHashes = [['KS',1],['KC',1],['KD',1],['KH',1]];
    var QueensQuadrupleArrayHashes = [['QS',4],['QC',4],['QD',4],['QH',4]];
    var QueensTripleArrayHashes = [['QS',3],['QC',3],['QD',3],['QH',3]];
    var QueensDoubleArrayHashes = [['QS',2],['QC',2],['QD',2],['QH',2]];
    var QueensArrayHashes = [['QS',1],['QC',1],['QD',1],['QH',1]];
    var JacksQuadrupleArrayHashes = [['JS',4],['JC',4],['JD',4],['JH',4]];
    var JacksTripleArrayHashes = [['JS',3],['JC',3],['JD',3],['JH',3]];
    var JacksDoubleArrayHashes = [['JS',2],['JC',2],['JD',2],['JH',2]];
    var JacksArrayHashes = [['JS',1],['JC',1],['JD',1],['JH',1]];
    var RunSpadesQuadrupleArrayHashes = [['AS',4],['TS',4],['KS',4],['QS',4],['JS',4]];
    var RunSpadesTripleArrayHashes = [['AS',3],['TS',3],['KS',3],['QS',3],['JS',3]];
    var RunSpadesDoubleArrayHashes = [['AS',2],['TS',2],['KS',2],['QS',2],['JS',2]];
    var RunSpadesArrayHashes = [['AS',1],['TS',1],['KS',1],['QS',1],['JS',1]];
    var RunHeartsQuadrupleArrayHashes = [['AH',4],['TH',4],['KH',4],['QH',4],['JH',4]];
    var RunHeartsTripleArrayHashes = [['AH',3],['TH',3],['KH',3],['QH',3],['JH',3]];
    var RunHeartsDoubleArrayHashes = [['AH',2],['TH',2],['KH',2],['QH',2],['JH',2]];
    var RunHeartsArrayHashes = [['AH',1],['TH',1],['KH',1],['QH',1],['JH',1]];
    var RunClubsQuadrupleArrayHashes = [['AC',4],['TC',4],['KC',4],['QC',4],['JC',4]];
    var RunClubsTripleArrayHashes = [['AC',3],['TC',3],['KC',3],['QC',3],['JC',3]];
    var RunClubsDoubleArrayHashes = [['AC',2],['TC',2],['KC',2],['QC',2],['JC',2]];
    var RunClubsArrayHashes = [['AC',1],['TC',1],['KC',1],['QC',1],['JC',1]];
    var RunDiamondsQuadrupleArrayHashes = [['AD',4],['TD',4],['KD',4],['QD',4],['JD',4]];
    var RunDiamondsTripleArrayHashes = [['AD',3],['TD',3],['KD',3],['QD',3],['JD',3]];
    var RunDiamondsDoubleArrayHashes = [['AD',2],['TD',2],['KD',2],['QD',2],['JD',2]];
    var RunDiamondsArrayHashes = [['AD',1],['TD',1],['KD',1],['QD',1],['JD',1]];

    var MarriageSpadesQuadrupleArrayHashes = [['KS',4],['QS',4]];
    var MarriageSpadesTripleArrayHashes = [['KS',3],['QS',3]];
    var MarriageSpadesDoubleArrayHashes = [['KS',2],['QS',2]];
    var MarriageSpadesArrayHashes = [['KS',1],['QS',1]];
    
    var MarriageHeartsQuadrupleArrayHashes = [['KH',4],['QH',4]];
    var MarriageHeartsTripleArrayHashes = [['KH',3],['QH',3]];
    var MarriageHeartsDoubleArrayHashes = [['KH',2],['QH',2]];
    var MarriageHeartsArrayHashes = [['KH',1],['QH',1]];
    
    var MarriageClubsQuadrupleArrayHashes = [['KC',4],['QC',4]];
    var MarriageClubsTripleArrayHashes = [['KC',3],['QC',3]];
    var MarriageClubsDoubleArrayHashes = [['KC',2],['QC',2]];
    var MarriageClubsArrayHashes = [['KC',1],['QC',1]];

    var MarriageDiamondsQuadrupleArrayHashes = [['KD',4],['QD',4]];
    var MarriageDiamondsTripleArrayHashes = [['KD',3],['QD',3]];
    var MarriageDiamondsDoubleArrayHashes = [['KD',2],['QD',2]];
    var MarriageDiamondsArrayHashes = [['KD',1],['QD',1]];

    var PinochleQuadrupleArrayHashes = [['QS',4],['JD',4]];
    var PinochleTripleArrayHashes = [['QS',3],['JD',3]];
    var PinochleDoubleArrayHashes = [['QS',2],['JD',2]];
    var PinochleArrayHashes = [['QS',1],['JD',1]];

    var DixSpadesDoubleArrayHashes = [['9S',2]];
    var DixHeartsDoubleArrayHashes = [['9H',2]];
    var DixClubsDoubleArrayHashes = [['9C',2]];
    var DixDiamondsDoubleArrayHashes = [['9D',2]];
    
    var DixSpadesArrayHashes = [['9S',1]];
    var DixHeartsArrayHashes = [['9H',1]];
    var DixClubsArrayHashes = [['9C',1]];
    var DixDiamondsArrayHashes = [['9D',1]];
    
    this.CalculateMelds = function(availableCards, trumpSuit, isDoubleDeck, ignoreDix) {
        this.melds = [];
        
        var cardsDictionary = {};
        for (var i=0; i<availableCards.length; i++) {
            if (cardsDictionary[availableCards[i].hash]) {
                cardsDictionary[availableCards[i].hash] += 1;
            } else {
                cardsDictionary[availableCards[i].hash] = 1;
            }
        }

        // Arounds
        if (isDoubleDeck) {
            this.TryToCountMeld(cardsDictionary, AcesQuadrupleArrayHashes, 'AllAces', 200);
            this.TryToCountMeld(cardsDictionary, AcesTripleArrayHashes, 'TripleAces', 150);
            this.TryToCountMeld(cardsDictionary, KingsQuadrupleArrayHashes, 'AllKings', 160);
            this.TryToCountMeld(cardsDictionary, KingsTripleArrayHashes, 'TripleKings', 120);
            this.TryToCountMeld(cardsDictionary, QueensQuadrupleArrayHashes, 'AllQueens', 120);
            this.TryToCountMeld(cardsDictionary, QueensTripleArrayHashes, 'TripleQueens', 90);
            this.TryToCountMeld(cardsDictionary, JacksQuadrupleArrayHashes, 'AllJacks', 80);
            this.TryToCountMeld(cardsDictionary, JacksTripleArrayHashes, 'TripleJacks', 60);
        }
        this.TryToCountMeld(cardsDictionary, AcesDoubleArrayHashes, 'AcesAbound', 100);
        this.TryToCountMeld(cardsDictionary, AcesArrayHashes, 'AcesAround', 10);
        this.TryToCountMeld(cardsDictionary, KingsDoubleArrayHashes, 'KingsAbound', 80);
        this.TryToCountMeld(cardsDictionary, KingsArrayHashes, 'KingsAround', 8);
        this.TryToCountMeld(cardsDictionary, QueensDoubleArrayHashes, 'QueensAbound', 60);
        this.TryToCountMeld(cardsDictionary, QueensArrayHashes, 'QueensAround', 6);
        this.TryToCountMeld(cardsDictionary, JacksDoubleArrayHashes, 'JacksAbound', 40);
        this.TryToCountMeld(cardsDictionary, JacksArrayHashes, 'JacksAround', 4);

        // Reset the cards available
        var keys = Object.keys(cardsDictionary);
        for (var i=0; i<keys.length; i++) {
            cardsDictionary[keys[i]] = 0;
        }
        for (var i=0; i<availableCards.length; i++) {
            cardsDictionary[availableCards[i].hash] += 1;
        }
        
        // Runs and Marriages
        var quadrupleRunsScore = 300;
        var tripleRunsScore = 225;
        var doubleRunScore = 150;
        var runScore = 15;
        switch (trumpSuit) {
            case 'S':
                if (isDoubleDeck) {
                    this.TryToCountMeld(cardsDictionary, RunSpadesQuadrupleArrayHashes, 'QuadrupleRun', quadrupleRunsScore);
                    this.TryToCountMeld(cardsDictionary, RunSpadesTripleArrayHashes, 'TripleRun', tripleRunsScore);
                }
                this.TryToCountMeld(cardsDictionary, RunSpadesDoubleArrayHashes, 'DoubleRun', doubleRunScore);
                this.TryToCountMeld(cardsDictionary, RunSpadesArrayHashes, 'Run', runScore);
            break;
            case 'H':
                if (isDoubleDeck) {
                    this.TryToCountMeld(cardsDictionary, RunHeartsQuadrupleArrayHashes, 'QuadrupleRun', quadrupleRunsScore);
                    this.TryToCountMeld(cardsDictionary, RunHeartsTripleArrayHashes, 'TripleRun', tripleRunsScore);
                }
                this.TryToCountMeld(cardsDictionary, RunHeartsDoubleArrayHashes, 'DoubleRun', doubleRunScore);
                this.TryToCountMeld(cardsDictionary, RunHeartsArrayHashes, 'Run', runScore);
            break;
            case 'C':
                if (isDoubleDeck) {
                    this.TryToCountMeld(cardsDictionary, RunClubsQuadrupleArrayHashes, 'QuadrupleRun', quadrupleRunsScore);
                    this.TryToCountMeld(cardsDictionary, RunClubsTripleArrayHashes, 'TripleRun', tripleRunsScore);
                }
                this.TryToCountMeld(cardsDictionary, RunClubsDoubleArrayHashes, 'DoubleRun', doubleRunScore);
                this.TryToCountMeld(cardsDictionary, RunClubsArrayHashes, 'Run', runScore);
            break;
            case 'D':
                if (isDoubleDeck) {
                    this.TryToCountMeld(cardsDictionary, RunDiamondsQuadrupleArrayHashes, 'QuadrupleRun', quadrupleRunsScore);
                    this.TryToCountMeld(cardsDictionary, RunDiamondsTripleArrayHashes, 'TripleRun', tripleRunsScore);
                }
                this.TryToCountMeld(cardsDictionary, RunDiamondsDoubleArrayHashes, 'DoubleRun', doubleRunScore);
                this.TryToCountMeld(cardsDictionary, RunDiamondsArrayHashes, 'Run', runScore);
            break;
        }

        var marriageScore = 2;
        var royalMarriageScore = 4;
        var doubleMarriageScore = 4;
        var doubleRoyalMarriageScore = 8;
        if (isDoubleDeck) {
            var tripleMarriageScore = 6;
            var tripleRoyalMarriageScore = 12;
            var quadrupleMarriageScore = 8;
            var quadrupleRoyalMarriageScore = 16;
            this.TryToCountMeld(cardsDictionary, MarriageHeartsQuadrupleArrayHashes, trumpSuit=='H' ? 'QuadRoyalMarriage':'QuadMarriage', trumpSuit=='H'?quadrupleRoyalMarriageScore:quadrupleMarriageScore);
            this.TryToCountMeld(cardsDictionary, MarriageHeartsTripleArrayHashes, trumpSuit=='H' ? 'TripleRoyalMarriage':'TripleMarriage', trumpSuit=='H'?tripleRoyalMarriageScore:tripleMarriageScore);
            this.TryToCountMeld(cardsDictionary, MarriageSpadesQuadrupleArrayHashes, trumpSuit=='S' ? 'QuadRoyalMarriage':'QuadMarriage', trumpSuit=='S'?quadrupleRoyalMarriageScore:quadrupleMarriageScore);
            this.TryToCountMeld(cardsDictionary, MarriageSpadesTripleArrayHashes, trumpSuit=='S' ? 'TripleRoyalMarriage':'TripleMarriage', trumpSuit=='S'?tripleRoyalMarriageScore:tripleMarriageScore);
            this.TryToCountMeld(cardsDictionary, MarriageClubsQuadrupleArrayHashes, trumpSuit=='C' ? 'QuadRoyalMarriage':'QuadMarriage', trumpSuit=='C'?quadrupleRoyalMarriageScore:quadrupleMarriageScore);
            this.TryToCountMeld(cardsDictionary, MarriageClubsTripleArrayHashes, trumpSuit=='C' ? 'TripleRoyalMarriage':'TripleMarriage', trumpSuit=='C'?tripleRoyalMarriageScore:tripleMarriageScore);
            this.TryToCountMeld(cardsDictionary, MarriageDiamondsQuadrupleArrayHashes, trumpSuit=='D' ? 'QuadRoyalMarriage':'QuadMarriage', trumpSuit=='D'?quadrupleRoyalMarriageScore:quadrupleMarriageScore);
            this.TryToCountMeld(cardsDictionary, MarriageDiamondsTripleArrayHashes, trumpSuit=='D' ? 'TripleRoyalMarriage':'TripleMarriage', trumpSuit=='D'?tripleRoyalMarriageScore:tripleMarriageScore);
        }
        this.TryToCountMeld(cardsDictionary, MarriageHeartsDoubleArrayHashes, trumpSuit=='H'?'DoubleRoyalMarriage':'DoubleMarriage', trumpSuit=='H'?doubleRoyalMarriageScore:doubleMarriageScore);
        this.TryToCountMeld(cardsDictionary, MarriageSpadesDoubleArrayHashes, trumpSuit=='S'?'DoubleRoyalMarriage':'DoubleMarriage', trumpSuit=='S'?doubleRoyalMarriageScore:doubleMarriageScore);
        this.TryToCountMeld(cardsDictionary, MarriageDiamondsDoubleArrayHashes, trumpSuit=='D'?'DoubleRoyalMarriage':'DoubleMarriage', trumpSuit=='D'?doubleRoyalMarriageScore:doubleMarriageScore);
        this.TryToCountMeld(cardsDictionary, MarriageClubsDoubleArrayHashes, trumpSuit=='C'?'DoubleRoyalMarriage':'DoubleMarriage', trumpSuit=='C'?doubleRoyalMarriageScore:doubleMarriageScore);
        this.TryToCountMeld(cardsDictionary, MarriageHeartsArrayHashes, trumpSuit=='H'?'RoyalMarriage':'Marriage', trumpSuit=='H'?royalMarriageScore:marriageScore);
        this.TryToCountMeld(cardsDictionary, MarriageSpadesArrayHashes, trumpSuit=='S'?'RoyalMarriage':'Marriage', trumpSuit=='S'?royalMarriageScore:marriageScore);
        this.TryToCountMeld(cardsDictionary, MarriageDiamondsArrayHashes, trumpSuit=='D'?'RoyalMarriage':'Marriage', trumpSuit=='D'?royalMarriageScore:marriageScore);
        this.TryToCountMeld(cardsDictionary, MarriageClubsArrayHashes, trumpSuit=='C'?'RoyalMarriage':'Marriage', trumpSuit=='C'?royalMarriageScore:marriageScore);
    
        // Reset the cards available
        var keys = Object.keys(cardsDictionary);
        for (var i=0; i<keys.length; i++) {
            cardsDictionary[keys[i]] = 0;
        }
        for (var i=0; i<availableCards.length; i++) {
            cardsDictionary[availableCards[i].hash] += 1;
        }
        
        // Pinochles
        if (isDoubleDeck) {
            this.TryToCountMeld(cardsDictionary, PinochleQuadrupleArrayHashes, 'QuadPinochle', 90);
            this.TryToCountMeld(cardsDictionary, PinochleTripleArrayHashes, 'TriplePinochle', 60);
        }
        this.TryToCountMeld(cardsDictionary, PinochleDoubleArrayHashes, 'DoublePinochle', 30);
        this.TryToCountMeld(cardsDictionary, PinochleArrayHashes, 'Pinochle', 4);

        // Dix
        if (!ignoreDix) {
            switch (trumpSuit) {
                case 'H':
                    this.TryToCountMeld(cardsDictionary, DixHeartsDoubleArrayHashes, 'DoubleDix', 2);
                    this.TryToCountMeld(cardsDictionary, DixHeartsArrayHashes, 'Dix', 1);
                break;
                case 'S':
                    this.TryToCountMeld(cardsDictionary, DixSpadesDoubleArrayHashes, 'DoubleDix', 2);
                    this.TryToCountMeld(cardsDictionary, DixSpadesArrayHashes, 'Dix', 1);
                break;
                case 'D':
                    this.TryToCountMeld(cardsDictionary, DixDiamondsDoubleArrayHashes, 'DoubleDix', 2);
                    this.TryToCountMeld(cardsDictionary, DixDiamondsArrayHashes, 'Dix', 1);
                break;
                case 'C':
                    this.TryToCountMeld(cardsDictionary, DixClubsDoubleArrayHashes, 'DoubleDix', 2);
                    this.TryToCountMeld(cardsDictionary, DixClubsArrayHashes, 'Dix', 1);
                break;
            }
        }

        this.currentRoundMeldScore = 0;
        for (var i=0; i<this.melds.length; i++) {
            this.currentRoundMeldScore += this.melds[i].score;
        }
    }

    this.TryToCountMeld = function(cardsDictionary, arrayHashes, meldName, meldScore) {
        for (var i=0; i<arrayHashes.length; i++) {
            var curCount = cardsDictionary[arrayHashes[i][0]];
            if (curCount == null || curCount < arrayHashes[i][1]) {
                return;
            }
        }

        // Meld was found
        var meld = {};
        meld.meldType = meldName;
        meld.cards = [];
        meld.score = meldScore;
        for (var i=0; i<arrayHashes.length; i++) {
            var cardHash = arrayHashes[i][0];
            var cardCount = arrayHashes[i][1];
            cardsDictionary[cardHash] -= cardCount;
            for (var j=0; j<this.cards.length && cardCount>0; j++) {
                if (this.cards[j].hash == cardHash) {
                    meld.cards.push(this.cards[j]);
                    cardCount--;
                }
            }
        }
        this.melds.push(meld);
    }

    this.GetDecisionMethod = function(decisionIndex) {
        var decisionMethodName = "pinochle_decision_method_Custom_" + decisionIndex;
        var decisionMethod = window.localStorage.getItem(decisionMethodName);
        if (decisionMethod == null) {
            // Load a default method
            switch (decisionIndex) {
                case 0:
                {
                    decisionMethod = "var ChooseBid = function(aGame,\n\
            passingCardsCount,\n\
            currentPlayerIndex,\n\
            currentPlayerCards\n\
            ) {\n\
                \n\
    // Create a game state copy that can be manipulated and restored to simulate outcomes\n\
    var simGame = {};\n\
    simGame.isDoubleDeck = aGame.isDoubleDeck;\n\
    simGame.cardsPlayedThisRound = [];\n\
    simGame.trickCards = [];\n\
    simGame.leadIndex = aGame.leadIndex;\n\
    simGame.dealerIndex = aGame.dealerIndex;\n\
    simGame.turnIndex = aGame.turnIndex;\n\
    simGame.players = [];\n\
    var player = new PinochlePlayer();\n\
    player.Initialize('You', true, 'Standard', 'South');\n\
    simGame.players.push(player);\n\
    player = new PinochlePlayer();\n\
    player.Initialize('Catalina', false, 'Standard', 'West');\n\
    simGame.players.push(player);\n\
    player = new PinochlePlayer();\n\
    player.Initialize('Amelia', false, 'Standard', 'North');\n\
    simGame.players.push(player);\n\
    player = new PinochlePlayer();\n\
    player.Initialize('Seward', false, 'Standard', 'East');\n\
    simGame.players.push(player);\n\
\n\
    var currentSimPlayer = simGame.players[currentPlayerIndex];\n\
    simGame.bidWinner = currentPlayerIndex;\n\
    simGame.currentHighestBidder = currentSimPlayer;\n\
\n\
    // Create the list of cards remaining in the deck\n\
    var gameCards=aGame.GetAllCards(aGame.isDoubleDeck);\n\
    var cardsRemaining = [];\n\
    for (var i=0; i<gameCards.length; i++) {\n\
        var isAlreadyPlayed = false;\n\
        for (var j=0; j<currentPlayerCards.length; j++) {\n\
            if (currentPlayerCards[j].id === gameCards[i].id) {\n\
                isAlreadyPlayed = true;\n\
                break;\n\
            }\n\
        }\n\
        if (isAlreadyPlayed) {\n\
            continue;\n\
        }\n\
        \n\
        cardsRemaining.push(gameCards[i]);\n\
    }\n\
\n\
    // Create a round bid analysis result\n\
    var roundBidAnalysis = {};\n\
    roundBidAnalysis.safeBids = [];\n\
    roundBidAnalysis.standardBids = [];\n\
    roundBidAnalysis.suggestedBids = [];\n\
    var suits = ['S','H','C','D'];\n\
    roundBidAnalysis.histogramsBySuit = [];\n\
    for (var i=0; i<suits.length; i++) {\n\
        roundBidAnalysis.histogramsBySuit[suits[i]] = [];\n\
    }\n\
\n\
    var simulationsPerSuit = 500;\n\
    var totalSimulations = simulationsPerSuit*4;\n\
    for (var simIndex = 0; simIndex < totalSimulations; simIndex++) {\n\
        // Try each suit\n\
        simGame.trumpSuit = suits[simIndex%4];\n\
\n\
        // Reset the sim game state\n\
        for (var k=0; k<4; k++) {\n\
            var simPlayer = simGame.players[k];\n\
            simPlayer.currentRoundMeldScore = 0;\n\
            simPlayer.currentRoundCountersTaken = 0;\n\
            simPlayer.melds = [];\n\
            simPlayer.cards = [];\n\
            simPlayer.isShownVoidInSuit = [false, false, false, false];\n\
        }\n\
        simGame.cardsPlayedThisRound = [];\n\
        simGame.trickCards = [];\n\
        simGame.dealerIndex = aGame.dealerIndex;\n\
        simGame.leadIndex = currentSimPlayer.playerPositionInt;\n\
        simGame.turnIndex = currentSimPlayer.playerPositionInt;\n\
\n\
        // Shuffle the deck\n\
        var deckIdx = 0;\n\
        for (var k = cardsRemaining.length - 1; k > 0; k--) {\n\
            var randIdx = Math.floor(Math.random() * (k + 1));\n\
            x = cardsRemaining[k];\n\
            cardsRemaining[k] = cardsRemaining[randIdx];\n\
            cardsRemaining[randIdx] = x;\n\
        }\n\
\n\
        // Deal the cards to each player\n\
        for (var n=0; n<currentPlayerCards.length; n++) {\n\
            var card = currentPlayerCards[n];\n\
            card.wasPassed = false;\n\
            card.wasShown = false;\n\
            currentSimPlayer.cards.push(card);\n\
        }\n\
        var deckIdx = 0;\n\
        for (var n=0; n<4; n++) {\n\
            var player = simGame.players[n];\n\
            while (player.cards.length != currentSimPlayer.cards.length) {\n\
                player.cards.push(cardsRemaining[deckIdx]);\n\
                deckIdx++;\n\
            }\n\
        }\n\
\n\
        // Pass cards\n\
        if (passingCardsCount > 0) {\n\
            var passingPlayer = simGame.players[(currentSimPlayer.playerPositionInt+2)%4];\n\
            var receivingPlayer = currentSimPlayer;\n\
            receivingPlayer.receivedCards = [];\n\
            var passingCards = passingPlayer.FindBestPassingCards(passingCardsCount, passingPlayer.skillLevel, simGame);\n\
            for (var n=0; n<passingCards.length; n++) {\n\
                var card = passingCards[n];\n\
                card.wasPassed = true;\n\
                passingPlayer.cards.splice(passingPlayer.cards.indexOf(card),1);\n\
                receivingPlayer.cards.push(card);\n\
                receivingPlayer.receivedCards.push(card);\n\
            }\n\
\n\
            passingPlayer = currentSimPlayer;\n\
            receivingPlayer = simGame.players[(currentSimPlayer.playerPositionInt+2)%4];\n\
            receivingPlayer.receivedCards = [];\n\
            var passingCards = passingPlayer.FindBestPassingCards(passingCardsCount, passingPlayer.skillLevel, simGame);\n\
            for (var n=0; n<passingCards.length; n++) {\n\
                var card = passingCards[n];\n\
                card.wasPassed = true;\n\
                passingPlayer.cards.splice(passingPlayer.cards.indexOf(card),1);\n\
                receivingPlayer.cards.push(card);\n\
                receivingPlayer.receivedCards.push(card);\n\
            }\n\
        }\n\
\n\
        // Count Melds\n\
        for (var i=0; i<4; i++) {\n\
            var player = simGame.players[i];\n\
            player.passingCards = [];\n\
            player.CalculateMelds(player.cards, simGame.trumpSuit, simGame.isDoubleDeck, false);\n\
            for (var n=0; n<player.melds.length; n++) {\n\
                var meld = player.melds[n];\n\
                for (var k=0; k<meld.cards.length; k++) {\n\
                    var card = meld.cards[k];\n\
                    card.wasShown = true;\n\
                }\n\
            }\n\
        }\n\
\n\
        // Play out trick taking\n\
        while (currentSimPlayer.cards.length>0) {\n\
            simGame.trickCards = [];\n\
            while (simGame.trickCards.length < 4) {\n\
                var nextPlayer = simGame.players[simGame.turnIndex%4];\n\
                var nextCard = nextPlayer.FindBestPlayingCard(simGame, nextPlayer.skillLevel);\n\
                PlayCard(simGame,nextCard);\n\
            }\n\
\n\
            var trickResult = GetTrickResult(simGame);\n\
            trickResult.trickTaker.currentRoundCountersTaken += trickResult.countersTaken;\n\
            simGame.leadIndex = trickResult.trickTaker.playerPositionInt;\n\
            simGame.turnIndex = simGame.leadIndex;\n\
        }\n\
\n\
        // Count round score\n\
        var teamMeldScore = simGame.players[(currentSimPlayer.playerPositionInt+2)%4].currentRoundMeldScore + currentSimPlayer.currentRoundMeldScore;\n\
        var teamCountersScore = simGame.players[(currentSimPlayer.playerPositionInt+2)%4].currentRoundCountersTaken + currentSimPlayer.currentRoundCountersTaken;\n\
        var teamRoundScore = teamMeldScore + teamCountersScore;\n\
        var curSuitHistograms = roundBidAnalysis.histogramsBySuit[simGame.trumpSuit];\n\
        if (curSuitHistograms[teamRoundScore] == null) {\n\
            curSuitHistograms[teamRoundScore] = 1;\n\
        } else {\n\
            curSuitHistograms[teamRoundScore] += 1;\n\
        }\n\
    }\n\
\n\
    roundBidAnalysis.simulationsCount = simulationsPerSuit;\n\
    roundBidAnalysis.suggestedSuit = suits[0];\n\
    roundBidAnalysis.standardBid = 0;\n\
    roundBidAnalysis.suggestedBid = 0;\n\
    for (var i=0; i<4; i++) {\n\
        var scoresAchievedCount = 0;\n\
        var safeScoresAchievedThresh = roundBidAnalysis.simulationsCount * 0.1;\n\
        var standardScoresAchievedThresh = roundBidAnalysis.simulationsCount * 0.18;\n\
        var suggestedScoresAchievedThresh = roundBidAnalysis.simulationsCount * 0.25;\n\
        var safeScoresThreshFound = false;\n\
        var suggestedThreshFound = false;\n\
        var standardScoresThreshFound = false;\n\
        var roundScoresHistogram = roundBidAnalysis.histogramsBySuit[suits[i]];\n\
        for (var j=0; j<roundScoresHistogram.length; j++) {\n\
            if (roundScoresHistogram[j] == null) {\n\
                continue;\n\
            }\n\
            scoresAchievedCount += roundScoresHistogram[j];\n\
            if (!safeScoresThreshFound && scoresAchievedCount >= safeScoresAchievedThresh) {\n\
                safeScoresThreshFound = true;\n\
                roundBidAnalysis.safeBids[i] = j;\n\
            }\n\
            if (!standardScoresThreshFound && scoresAchievedCount >= standardScoresAchievedThresh) {\n\
                standardScoresThreshFound = true;\n\
                roundBidAnalysis.standardBids[i] = j;\n\
                if (j > roundBidAnalysis.standardBid) {\n\
                    roundBidAnalysis.standardBid = j;\n\
                }\n\
                continue;\n\
            }\n\
            if (!suggestedThreshFound && scoresAchievedCount >= suggestedScoresAchievedThresh) {\n\
                suggestedThreshFound = true;\n\
                roundBidAnalysis.suggestedBids[i] = j;\n\
                if (j > roundBidAnalysis.suggestedBid) {\n\
                    roundBidAnalysis.suggestedBid = j;\n\
                    roundBidAnalysis.suggestedSuit = suits[i];\n\
                }\n\
            }\n\
        }\n\
    }\n\
\n\
    var bid = [roundBidAnalysis.suggestedBid, roundBidAnalysis.suggestedSuit];\n\
    return bid;\n\
};";
                }
                break;

                case 1:
                {
                    decisionMethod = "var ChoosePassCardsToBidWinner = function(\n\
            handCards,      // Array of cards in your hand\n\
            melds,          // Array of meld points for the cards in your hand\n\
            trumpSuit,      // The trump suit\n\
            isDoubleDeck,   // Boolean indicating if a double deck is used\n\
            passingCardsCount   // Number of passing cards\n\
            ) {\n\
\n\
    // Find the first set of cards in this order:\n\
    // ATrump, 10Trump, KTrump, QTrump, JTrump\n\
    // AH, AS, AD, AC\n\
    // ATrump, 10Trump, KTrump, QTrump, JTrump\n\
    // AH, AS, AD, AC\n\
    // 9Trump\n\
    // QS, JD\n\
    // Js\n\
    // 9s\n\
    // lowest contributing meld cards\n\
    // Ks\n\
    // 10s\n\
\n\
    var cardsToPass = [];\n\
\n\
    // Remove melding cards\n\
    var nonMeldCards = [].concat(handCards);\n\
    for (var i=0; i<melds.length; i++) {\n\
        if (melds[i].meldType == 'RoyalMarriage') {\n\
            continue;\n\
        }\n\
        for (var j=0; j<melds[i].cards.length; j++) {\n\
            var index = nonMeldCards.indexOf(melds[i].cards[j]);\n\
            if (index != -1) {\n\
                nonMeldCards.splice(index, 1);\n\
            }\n\
        }\n\
    }\n\
\n\
    // Helper function\n\
    var TryToGetCard = function(rank, suit, aCards, aPassingCards) {\n\
        for (var i=0; i<aCards.length; i++) {\n\
            var card = aCards[i];\n\
            if (card.suit == suit && card.rank == rank) {\n\
                aPassingCards.push(card);\n\
                aCards.splice(aCards.indexOf(card),1);\n\
                return;\n\
            }\n\
        }\n\
    }\n\
\n\
    var timesToLoop = isDoubleDeck ? 4 : 2;\n\
    for (var ctr=0; ctr<timesToLoop; ctr++) {\n\
        // ATrump, 10Trump, KTrump, QTrump, JTrump\n\
        TryToGetCard(1,trumpSuit,nonMeldCards,cardsToPass);\n\
        if (cardsToPass.length == passingCardsCount) { return cardsToPass; }\n\
        TryToGetCard(10,trumpSuit,nonMeldCards,cardsToPass);\n\
        if (cardsToPass.length == passingCardsCount) { return cardsToPass; }\n\
        TryToGetCard(13,trumpSuit,nonMeldCards,cardsToPass);\n\
        if (cardsToPass.length == passingCardsCount) { return cardsToPass; }\n\
        TryToGetCard(12,trumpSuit,nonMeldCards,cardsToPass);\n\
        if (cardsToPass.length == passingCardsCount) { return cardsToPass; }\n\
        TryToGetCard(11,trumpSuit,nonMeldCards,cardsToPass);\n\
        if (cardsToPass.length == passingCardsCount) { return cardsToPass; }\n\
\n\
        // AH, AS, AD, AC\n\
        var suits = ['S','H','C','D'];\n\
        for (var i=0; i<suits.length; i++) {\n\
            if (trumpSuit != suits[i]) {\n\
                TryToGetCard(1,suits[i],nonMeldCards,cardsToPass);\n\
                if (cardsToPass.length == passingCardsCount) { return cardsToPass; }\n\
            }\n\
        }\n\
    }\n\
\n\
    // Any trump left\n\
    for (var i=0; i<nonMeldCards.length; i++) {\n\
        var card = nonMeldCards[i];\n\
        if (card.suit == trumpSuit) {\n\
            cardsToPass.push(card);\n\
            if (cardsToPass.length == passingCardsCount) { return cardsToPass; }\n\
            nonMeldCards.splice(nonMeldCards.indexOf(card),1);\n\
            i--;\n\
        }\n\
    }\n\
    \n\
    // QS, JD\n\
    TryToGetCard(12,'S',nonMeldCards,cardsToPass);\n\
    if (cardsToPass.length == passingCardsCount) { return cardsToPass; }\n\
    TryToGetCard(11,'D',nonMeldCards,cardsToPass);\n\
    if (cardsToPass.length == passingCardsCount) { return cardsToPass; }\n\
    \n\
    // Jacks\n\
    for (var i=0; i<nonMeldCards.length; i++) {\n\
        var card = nonMeldCards[i];\n\
        if (card.rank == 11) {\n\
            cardsToPass.push(card);\n\
            if (cardsToPass.length == passingCardsCount) { return cardsToPass; }\n\
            nonMeldCards.splice(nonMeldCards.indexOf(card),1);\n\
            i--;\n\
        }\n\
    }\n\
\n\
    // 9s\n\
    for (var i=0; i<nonMeldCards.length; i++) {\n\
        var card = nonMeldCards[i];\n\
        if (card.rank == 9) {\n\
            cardsToPass.push(card);\n\
            if (cardsToPass.length == passingCardsCount) { return cardsToPass; }\n\
            nonMeldCards.splice(nonMeldCards.indexOf(card),1);\n\
            i--;\n\
        }\n\
    }\n\
\n\
    // Lowest meld cards\n\
    // We will have to break up meld scores so find the amount of meld score that each card is responsible for\n\
    var meldCards = [];\n\
    for (var i=0; i<melds.length; i++) {\n\
        for (var j=0; j<melds[i].cards.length; j++) {\n\
            var card = melds[i].cards[j];\n\
            if (!meldCards.includes(card)) {\n\
                card.meldScoreIncrease = 0;\n\
                meldCards.push(card);\n\
            }\n\
        }\n\
    }\n\
    for (var i=0; i<melds.length; i++) {\n\
        for (var j=0; j<melds[i].cards.length; j++) {\n\
            melds[i].cards[j].meldScoreIncrease += melds[i].score;\n\
        }\n\
    }\n\
    meldCards.sort(function(a,b){\n\
        return a.meldScoreIncrease - b.meldScoreIncrease;\n\
    });\n\
    for (var i=0; i<meldCards.length; i++) {\n\
        var card = meldCards[i];\n\
        cardsToPass.push(card);\n\
        // Stop if we have enough\n\
        if (cardsToPass.length == passingCardsCount) {\n\
            return cardsToPass;\n\
        }\n\
    }\n\
    \n\
    // Kings\n\
    for (var i=0; i<nonMeldCards.length; i++) {\n\
        var card = nonMeldCards[i];\n\
        if (card.rank == 13) {\n\
            cardsToPass.push(card);\n\
            if (cardsToPass.length == passingCardsCount) { return cardsToPass; }\n\
            nonMeldCards.splice(nonMeldCards.indexOf(card),1);\n\
            i--;\n\
        }\n\
    }\n\
    \n\
    // 10s\n\
    for (var i=0; i<nonMeldCards.length; i++) {\n\
        var card = nonMeldCards[i];\n\
        if (card.rank == 10) {\n\
            cardsToPass.push(card);\n\
            if (cardsToPass.length == passingCardsCount) { return cardsToPass; }\n\
            nonMeldCards.splice(nonMeldCards.indexOf(card),1);\n\
            i--;\n\
        }\n\
    }\n\
    \n\
    // Safety\n\
    cardsToPass = [];\n\
    for (var i=0; i<passingCardsCount; i++) {\n\
        cardsToPass.push(handCards[i]);\n\
    }\n\
    return cardsToPass;\n\
};";
                }
                break;

                case 2:
                {
                    decisionMethod = "var ChoosePassCardsAsBidWinner = function(\n\
            handCards,      // Array of cards in your hand\n\
            receivedCards,  // Array of cards passed to you by your partner\n\
            melds,          // Array of meld points for your current hand\n\
            trumpSuit,      // The trump suit\n\
            passingCardsCount   // Number of cards to pass\n\
            ) {\n\
\n\
    var cardsToPass = [];\n\
\n\
    // Remove melding cards\n\
    var nonMeldCards = [].concat(handCards);\n\
    for (var i=0; i<melds.length; i++) {\n\
        for (var j=0; j<melds[i].cards.length; j++) {\n\
            var index = nonMeldCards.indexOf(melds[i].cards[j]);\n\
            if (index != -1) {\n\
                nonMeldCards.splice(index, 1);\n\
            }\n\
        }\n\
    }\n\
    \n\
    // Reason: Potential marriage\n\
    // add nontrump kings (but not if they were received because they are thus not a potential marriage)\n\
    for (var i=0; i<nonMeldCards.length; i++) {\n\
        var card = nonMeldCards[i];\n\
        if (receivedCards.includes(card)) {\n\
            continue;\n\
        }\n\
        if (card.rank == 13 && card.suit != trumpSuit) {\n\
            cardsToPass.push(card);\n\
            nonMeldCards.splice(nonMeldCards.indexOf(card),1);\n\
            i--;\n\
            \n\
            // Stop if we have enough\n\
            if (cardsToPass.length == passingCardsCount) {\n\
                return cardsToPass;\n\
            }\n\
        }\n\
    }\n\
    \n\
    // Reason: Potential marriage\n\
    // add nontrump queens (but not if they were received because they are thus not a potential marriage)\n\
    for (var i=0; i<nonMeldCards.length; i++) {\n\
        var card = nonMeldCards[i];\n\
        if (receivedCards.includes(card)) {\n\
            continue;\n\
        }\n\
        if (card.rank == 12 && card.suit != trumpSuit) {\n\
            cardsToPass.push(card);\n\
            nonMeldCards.splice(nonMeldCards.indexOf(card),1);\n\
            \n\
            // Stop if we have enough\n\
            if (cardsToPass.length == passingCardsCount) {\n\
                return cardsToPass;\n\
            }\n\
        }\n\
    }\n\
    \n\
    // Reason: Potential marriage\n\
    // Jack of Diamonds (but not if they were received because they are thus not a potential marriage and not if trump is Diamonds)\n\
    if (trumpSuit != 'D') {\n\
        for (var i=0; i<nonMeldCards.length; i++) {\n\
            var card = nonMeldCards[i];\n\
            if (receivedCards.includes(card)) {\n\
                continue;\n\
            }\n\
            if (card.rank == 11 && card.suit == 'D') {\n\
                cardsToPass.push(card);\n\
                nonMeldCards.splice(nonMeldCards.indexOf(card),1);\n\
                i--;\n\
                \n\
                // Stop if we have enough\n\
                if (cardsToPass.length == passingCardsCount) {\n\
                    return cardsToPass;\n\
                }\n\
            }\n\
        }\n\
    }\n\
    \n\
    // Add the rest of the non trump cards (prefer low non trumps)\n\
    nonMeldCards.sort(function(a,b){\n\
        if (a.suit == trumpSuit && b.suit == trumpSuit) {\n\
            return a.value - b.value;\n\
        } else if (a.suit == trumpSuit) {\n\
            return 1;\n\
        } else if (b.suit == trumpSuit) {\n\
            return -1;\n\
        } else {\n\
            return a.value - b.value;\n\
        }\n\
    });\n\
    for (var i=0; i<nonMeldCards.length; i++) {\n\
        var card = nonMeldCards[i];\n\
        cardsToPass.push(card);\n\
        // Stop if we have enough\n\
        if (cardsToPass.length == passingCardsCount) {\n\
            return cardsToPass;\n\
        }\n\
    }\n\
    \n\
    // We will have to break up meld scores so find the amount of meld score that each card is responsible for\n\
    var meldCards = [];\n\
    for (var i=0; i<melds.length; i++) {\n\
        for (var j=0; j<melds[i].cards.length; j++) {\n\
            var card = melds[i].cards[j];\n\
            if (!meldCards.includes(card)) {\n\
                card.meldScoreIncrease = 0;\n\
                meldCards.push(card);\n\
            }\n\
        }\n\
    }\n\
    for (var i=0; i<melds.length; i++) {\n\
        for (var j=0; j<melds[i].cards.length; j++) {\n\
            melds[i].cards[j].meldScoreIncrease += melds[i].score;\n\
        }\n\
    }\n\
    meldCards.sort(function(a,b){\n\
        return a.meldScoreIncrease - b.meldScoreIncrease;\n\
    });\n\
    for (var i=0; i<meldCards.length; i++) {\n\
        var card = meldCards[i];\n\
        cardsToPass.push(card);\n\
        // Stop if we have enough\n\
        if (cardsToPass.length == passingCardsCount) {\n\
            return cardsToPass;\n\
        }\n\
    }\n\
    \n\
    // Safety\n\
    cardsToPass = [];\n\
    for (var i=0; i<passingCardsCount; i++) {\n\
        cardsToPass.push(handCards[i]);\n\
    }\n\
    return cardsToPass;\n\
};";
                }
                break;

                case 3:
                {
                    decisionMethod = "var ChooseTrickCard = function(\n\
            aGame,          // Game state\n\
            handCards,      // Array of cards in your hand\n\
            possiblePlays,  // Array of cards you can play\n\
            trickCards,     // Array of cards already in the trick pile\n\
            trumpSuit,      // The trump suit\n\
            unPlayedCards,  // Arrya of cards yet to be played by opponents\n\
            currentPlayerPosition   // The position index of the player\n\
        ) {\n\
\n\
    if (trickCards.length === 0) {\n\
        //\n\
        // Choose a lead card\n\
        //\n\
        \n\
        // Sort all cards with trumps first and then by highest value\n\
        possiblePlays.sort(function(a,b){\n\
            if (a.suit == trumpSuit && b.suit != trumpSuit) {\n\
                return -1;\n\
            } else if (a.suit != trumpSuit && b.suit == trumpSuit) {\n\
                return 1;\n\
            } else {\n\
                return b.value - a.value;\n\
            }\n\
        });\n\
        \n\
        var firstCard = possiblePlays[0];\n\
        if (firstCard.suit == trumpSuit) {\n\
            var higherTrumpCardExists = false;\n\
            var anyTrumpSuitExists = false;\n\
            for (var j=0; j<unPlayedCards.length; j++) {\n\
                if (unPlayedCards[j].suit == trumpSuit) {\n\
                    anyTrumpSuitExists = true;\n\
                }\n\
                if (unPlayedCards[j].suit == trumpSuit && unPlayedCards[j].value > firstCard.value) {\n\
                    higherTrumpCardExists = true;\n\
                    break;\n\
                }\n\
            }\n\
            if (!higherTrumpCardExists) {\n\
                if (anyTrumpSuitExists) {\n\
                    // Play this gauranteed trump\n\
                    return firstCard;\n\
                }\n\
            }\n\
        }\n\
        \n\
        // Check for any non-trump gauranteed trick takers\n\
        var suits = ['S', 'H', 'C', 'D'];\n\
        var trumpSuitIndex = 0;\n\
        for (var i=0; i<suits.length; i++) {\n\
            if (suits[i] == trumpSuit) {\n\
                trumpSuitIndex = i;\n\
                break;\n\
            }\n\
        }\n\
        for (var k=0; k<suits.length; k++) {\n\
            var checkSuit = suits[k];\n\
            if (checkSuit == trumpSuit) {\n\
                continue;\n\
            }\n\
            \n\
            var highestCardOfSuit = null;\n\
            for (var j=possiblePlays.length-1; j>=0; j--) {\n\
                var possibleCard = possiblePlays[j];\n\
                if (possibleCard.suit == checkSuit &&\n\
                    (highestCardOfSuit == null || highestCardOfSuit.value < possibleCard.value)) {\n\
                    highestCardOfSuit = possibleCard;\n\
                }\n\
            }\n\
            if (highestCardOfSuit != null) {\n\
                // Check if it is gauranteed\n\
                var higherCardExists = false;\n\
                for (var j=0; j<4; j++) {\n\
                    if (j == currentPlayerPosition) {\n\
                        continue;\n\
                    }\n\
                    \n\
                    var otherPlayer = aGame.players[j];\n\
                    // If the other player is void in this suit\n\
                    //and they are not void in trumps then consider that higher card exists\n\
                    if (otherPlayer.playerPositionInt == (currentPlayerPosition+1)%4 || otherPlayer.playerPositionInt == (currentPlayerPosition+3)%4) {\n\
                        if (otherPlayer.isShownVoidInSuit[k] && !otherPlayer.isShownVoidInSuit[trumpSuitIndex]) {\n\
                            higherCardExists = true;\n\
                            break;\n\
                        }\n\
                    }\n\
                    \n\
                    var otherCards = otherPlayer.cards;\n\
                    for (var m=0; m<otherCards.length; m++) {\n\
                        var otherCard = otherCards[m];\n\
                        if (otherCard.suit == checkSuit && otherCard.value > highestCardOfSuit.value)\n\
                        {\n\
                            higherCardExists = true;\n\
                            break;\n\
                        }\n\
                    }\n\
                    if (higherCardExists)\n\
                    {\n\
                        break;\n\
                    }\n\
                }\n\
                if (!higherCardExists) {\n\
                    return highestCardOfSuit;\n\
                }\n\
            }\n\
        }\n\
        \n\
        // If the only cards left are trump then play the highest trump\n\
        if (possiblePlays[possiblePlays.length-1].suit == trumpSuit) {\n\
            // We only have trumps\n\
            // Don't play a counter if our opponent still has a higher trump\n\
            var otherPlayer1 = aGame.players[(currentPlayerPosition+1)%4];\n\
            var otherPlayer2 = aGame.players[(currentPlayerPosition+3)%4];\n\
            var highestTrump = possiblePlays[0];\n\
            for (var m=0; m<otherPlayer1.cards.length; m++) {\n\
                var otherCard = otherPlayer1.cards[m];\n\
                if (otherCard.suit == highestTrump.suit && otherCard.value > highestTrump.value) {\n\
                    // Opponents have a higher trump so we will play our lowest to hopefully not give away a pointer\n\
                    return possiblePlays[possiblePlays.length-1];\n\
                }\n\
            }\n\
            for (var m=0; m<otherPlayer2.cards.length; m++) {\n\
                var otherCard = otherPlayer2.cards[m];\n\
                if (otherCard.suit == highestTrump.suit && otherCard.value > highestTrump.value) {\n\
                    // Opponents have a higher trump so we will play our lowest to hopefully not give away a pointer\n\
                    return possiblePlays[possiblePlays.length-1];\n\
                }\n\
            }\n\
            \n\
            // Play our highest trump\n\
            return possiblePlays[0];\n\
        } else {\n\
            // Otherwise we are not going to take the trick so we might be able to save our higher counters\n\
            return possiblePlays[possiblePlays.length-1];\n\
        }\n\
        \n\
    } else {\n\
        \n\
        var leadCard = trickCards[0];\n\
        var play = possiblePlays[0];\n\
        if (play.suit == leadCard.suit) {\n\
            //\n\
            // Must play of same suit\n\
            //\n\
            possiblePlays.sort(function(a,b){\n\
                return a.value - b.value;\n\
            });\n\
            \n\
            var highestCardInTrickPosition = aGame.leadIndex;\n\
            var highestCardInTrick = leadCard;\n\
            for (var i=1; i<trickCards.length; i++) {\n\
                var playedCard = trickCards[i];\n\
                if ((playedCard.suit == highestCardInTrick.suit && playedCard.value > highestCardInTrick.value) ||\n\
                    (playedCard.suit == trumpSuit && highestCardInTrick.suit != trumpSuit)) {\n\
                        highestCardInTrick = playedCard;\n\
                        highestCardInTrickPosition = (aGame.leadIndex+i)%4;\n\
                    }\n\
            }\n\
            // Check if we already cant take the trick\n\
            var cantTakeTrick = true;\n\
            for (var i=0; i<possiblePlays.length; i++) {\n\
                var card = possiblePlays[i];\n\
                if ((card.suit == highestCardInTrick.suit && card.value > highestCardInTrick.value) ||\n\
                    (card.suit == trumpSuit && highestCardInTrick.suit != trumpSuit)){\n\
                    cantTakeTrick = false;\n\
                    break;\n\
                }\n\
            }\n\
            if (cantTakeTrick) {\n\
                var highestTakerIsPartner = highestCardInTrickPosition == (currentPlayerPosition+2)%4;\n\
                if (highestTakerIsPartner) {\n\
                    // Play our lowest counter\n\
                    for (var i=0; i<possiblePlays.length; i++) {\n\
                        var card = possiblePlays[i];\n\
                        if (card.rank == 13 || card.rank == 10 || card.rank == 1) {\n\
                            return card;\n\
                        }\n\
                    }\n\
                    // No counter found so play the lowest card possible\n\
                    return possiblePlays[0];\n\
                } else {\n\
                    // No counter found so play the lowest card possible\n\
                    return possiblePlays[0];\n\
                }\n\
            }\n\
            \n\
            if (trickCards.length < 3) {\n\
                // play our highest card\n\
                var highestCard = possiblePlays[possiblePlays.length - 1];\n\
                return highestCard;\n\
            } else {\n\
                // Play the lowest card that will take the trick\n\
                for (var i=0; i<possiblePlays.length; i++) {\n\
                    var card = possiblePlays[i];\n\
                    if (card.value > highestCardInTrick.value) {\n\
                        return card;\n\
                    }\n\
                }\n\
                // Safety - this should not happen\n\
                return possiblePlays[0];\n\
            }\n\
        } else if (play.suit == trumpSuit) {\n\
            //\n\
            // Must play a trump card\n\
            //\n\
            var highestCardInTrickPosition = aGame.leadIndex;\n\
            var highestCardInTrick = leadCard;\n\
            for (var i=1; i<trickCards.length; i++) {\n\
                var playedCard = trickCards[i];\n\
                if ((playedCard.suit == highestCardInTrick.suit && playedCard.value > highestCardInTrick.value) ||\n\
                    (playedCard.suit == trumpSuit && highestCardInTrick.suit != trumpSuit)) {\n\
                        highestCardInTrick = playedCard;\n\
                        highestCardInTrickPosition = (aGame.leadIndex+i)%4;\n\
                    }\n\
            }\n\
            \n\
            possiblePlays.sort(function(a,b){\n\
                return a.value - b.value;\n\
            });\n\
            \n\
            // Check if we already cant take the trick\n\
            var cantTakeTrick = true;\n\
            for (var i=0; i<possiblePlays.length; i++) {\n\
                var card = possiblePlays[i];\n\
                if ((card.suit == highestCardInTrick.suit && card.value > highestCardInTrick.value) ||\n\
                    (card.suit == trumpSuit && highestCardInTrick.suit != trumpSuit)){\n\
                    cantTakeTrick = false;\n\
                    break;\n\
                }\n\
            }\n\
            if (cantTakeTrick) {\n\
                var highestTakerIsPartner = highestCardInTrickPosition == (currentPlayerPosition+2)%4;\n\
                if (highestTakerIsPartner) {\n\
                    // Play our lowest counter\n\
                    for (var i=0; i<possiblePlays.length; i++) {\n\
                        var card = possiblePlays[i];\n\
                        if (card.rank == 13 || card.rank == 10 || card.rank == 1) {\n\
                            return card;\n\
                        }\n\
                    }\n\
                    // No counter found so play the lowest card possible\n\
                    return possiblePlays[0];\n\
                } else {\n\
                    // No counter found so play the lowest card possible\n\
                    return possiblePlays[0];\n\
                }\n\
            } else {\n\
                if (trickCards.length < 3) {\n\
                    // Play highest card\n\
                    return possiblePlays[possiblePlays.length-1];\n\
                } else {\n\
                    // Play lowest card\n\
                    return possiblePlays[0];\n\
                }\n\
            }\n\
        } else {\n\
            //\n\
            // Must play a non trump, off suit card\n\
            //\n\
            \n\
            var highestCardInTrickPosition = aGame.leadIndex;\n\
            var highestCardInTrick = leadCard;\n\
            for (var i=1; i<trickCards.length; i++) {\n\
                var playedCard = trickCards[i];\n\
                if ((playedCard.suit == highestCardInTrick.suit && playedCard.value > highestCardInTrick.value) ||\n\
                    (playedCard.suit == trumpSuit && highestCardInTrick.suit != trumpSuit)) {\n\
                        highestCardInTrick = playedCard;\n\
                        highestCardInTrickPosition = (aGame.leadIndex+i)%4;\n\
                    }\n\
            }\n\
            \n\
            possiblePlays.sort(function(a,b){\n\
                return a.value - b.value;\n\
            });\n\
            \n\
            var highestTakerIsPartner = highestCardInTrickPosition == (currentPlayerPosition+2)%4;\n\
            if (highestTakerIsPartner) {\n\
                // Play our lowest counter\n\
                for (var i=0; i<possiblePlays.length; i++) {\n\
                    var card = possiblePlays[i];\n\
                    if (card.rank == 13 || card.rank == 10 || card.rank == 1) {\n\
                        return card;\n\
                    }\n\
                }\n\
                // No counter found so play the lowest card possible\n\
                return possiblePlays[0];\n\
            } else {\n\
                // Play lowest card\n\
                return possiblePlays[0];\n\
            }\n\
        }\n\
    }\n\
};";
                }
                break;
            }
        }
        return decisionMethod;
    }
}

function GetLegalCardsForCurrentPlayerTurn(aGame) {
    var legalCards = [];
    var player = aGame.players[aGame.turnIndex%4];
    if (aGame.trickCards.length === 0) {
        for (var i=0; i<player.cards.length; i++) {
            var card = player.cards[i];
            legalCards.push(card);
        }
    } else {
        var leadCard = aGame.trickCards[0];
        var currentWinningCard = leadCard;
        for (var i=1; i<aGame.trickCards.length; i++) {
            var card = aGame.trickCards[i];
            if ((card.suit == currentWinningCard.suit && card.value > currentWinningCard.value) ||
                (card.suit == aGame.trumpSuit && currentWinningCard.suit != aGame.trumpSuit)) {
                    currentWinningCard = card;
            }
        }

        var playerHasCardInLeadSuit = false;
        var playerHighestCardInLeadSuit = null;
        var playerHasCardInTrumpSuit = false;
        var playerHighestCardInTrumpSuit = null;
        for (var i=0; i<player.cards.length; i++) {
            var card = player.cards[i];
            if (card.suit == leadCard.suit) {
                playerHasCardInLeadSuit = true;
                if (playerHighestCardInLeadSuit == null || card.value > playerHighestCardInLeadSuit.value) {
                    playerHighestCardInLeadSuit = card;
                }
            }
            if (card.suit == aGame.trumpSuit) {
                playerHasCardInTrumpSuit = true;
                if (playerHighestCardInTrumpSuit == null || card.value > playerHighestCardInTrumpSuit.value) {
                    playerHighestCardInTrumpSuit = card;
                }
            }
        }
        
        if (playerHasCardInLeadSuit) {
            if (leadCard.suit != aGame.trumpSuit && currentWinningCard.suit == aGame.trumpSuit) {
                // Play any card of the lead suit because it has already been trumped
                for (var i=0; i<player.cards.length; i++) {
                    var card = player.cards[i];
                    if (card.suit == leadCard.suit) {
                        legalCards.push(card);
                    }
                }
            } else if (playerHighestCardInLeadSuit.value > currentWinningCard.value) {
                // Play a winning card of the lead suit
                for (var i=0; i<player.cards.length; i++) {
                    var card = player.cards[i];
                    if (card.suit == currentWinningCard.suit && card.value > currentWinningCard.value) {
                        legalCards.push(card);
                    }
                }
            } else {
                // Play any card of the lead suit
                for (var i=0; i<player.cards.length; i++) {
                    var card = player.cards[i];
                    if (card.suit == leadCard.suit) {
                        legalCards.push(card);
                    }
                }
            }
        } else if (playerHasCardInTrumpSuit) {
            if (currentWinningCard.suit == aGame.trumpSuit && playerHighestCardInTrumpSuit.value > currentWinningCard.value) {
                // Play any trump that beats the current highest trump
                for (var i=0; i<player.cards.length; i++) {
                    var card = player.cards[i];
                    if (card.suit == aGame.trumpSuit && card.value > currentWinningCard.value) {
                        legalCards.push(card);
                    }
                }
            } else {
                // Play any trump
                for (var i=0; i<player.cards.length; i++) {
                    var card = player.cards[i];
                    if (card.suit == aGame.trumpSuit) {
                        legalCards.push(card);
                    }
                }
            }
        } else {
            // Play any card
            for (var i=0; i<player.cards.length; i++) {
                var card = player.cards[i];
                legalCards.push(card);
            }
        }
    }

    return legalCards;
}

function PlayCard(aGame, card) {
    var player = aGame.players[aGame.turnIndex%4];
    aGame.cardsPlayedThisRound.push(card);
    if (aGame.trickCards.length !== 0) {
        var leadCard = aGame.trickCards[0];
        if (card.suit !== leadCard.suit) {
            player.isShownVoidInSuit[leadCard.suitInt] = true;
            if (card.suit != aGame.trumpSuit) {
                var suits = ['S','H','C','D'];
                var trumpSuitIndex = suits.indexOf(aGame.trumpSuit);
                player.isShownVoidInSuit[trumpSuitIndex] = true;
            }
        }
    }

    player.cards.splice(player.cards.indexOf(card), 1);
    aGame.trickCards.push(card);
    aGame.turnIndex = aGame.turnIndex + 1;
}

function GetTrickResult(aGame) {
    var trickResult = {};
    trickResult.highestCard = aGame.trickCards[0];
    trickResult.trickTaker = aGame.players[aGame.leadIndex];
    trickResult.countersTaken = 0;
    for (var i=1; i<aGame.trickCards.length; i++) {
        var card = aGame.trickCards[i];
        if ((card.suit == trickResult.highestCard.suit && card.value > trickResult.highestCard.value) ||
            (card.suit == aGame.trumpSuit && trickResult.highestCard.suit != aGame.trumpSuit)) {
            trickResult.highestCard = card;
            trickResult.trickTaker = aGame.players[(aGame.leadIndex + i)%4];
        }
    }

    for (var i=0; i<aGame.trickCards.length; i++) {
        var card = aGame.trickCards[i];
        if (card.rank == 1 || card.rank == 10 || card.rank == 13) {
            trickResult.countersTaken += 1;
        }
    }

    if (aGame.players[0].cards.length == 0) {
        // Last trick
        trickResult.countersTaken += 1;
    }

    return trickResult;
}