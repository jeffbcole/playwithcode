var HeartsPlayer = function() {

    this.name = "";
    this.isHuman = false;
    this.skillLevel = "";
    this.playerPosition = "";
    this.playerPositionInt = 0;
    this.cards = [];
    this.passingCards = [];
    this.receivedCards = [];
    this.currentRoundPoints = 0;
    this.gameScore = 0;
    this.isShownVoidInSuit = [false, false, false, false];

    this.Initialize = function(aName, aIsHuman, aSkill, aPosition) {
        this.name = aName;
        this.isHuman = aIsHuman;
        this.skillLevel = aSkill;
        this.currentRoundPoints = 0;
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

    this.SelectPassingCards = function() {
        if (!this.isHuman) {
            var bestCards = this.FindBestPassingCards(this.skillLevel);
            for (var i=0; i<bestCards.length; i++) {
                this.passingCards.push(bestCards[i]);
                var indexOfBestCard = this.cards.indexOf(bestCards[i]);
                this.cards.splice(indexOfBestCard, 1);
            }
        }
    }

    this.FindBestPassingCards = function(aSkillLevel) {
        switch (aSkillLevel) {
            case "Easy":
                return [this.cards[0], this.cards[1], this.cards[2]];
            case "Standard":
            case "Pro":
                var bestCards = [];
                bestCards = bestCards.concat(this.cards);
                bestCards = bestCards.concat(this.passingCards);
                bestCards.sort(function(a,b) { 
                    if (a.value === b.value) {
                        if (a.value >= 12) {
                            if (a.suit === "S") {
                                return -1;
                            } else if (b.suit == "S") {
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

                return [bestCards[0], bestCards[1], bestCards[2]];

            case 'Custom':
                try {
                    var customMethod = this.GetDecisionMethod(0);
                    // Remove the first and last line of the code
                    customMethod = customMethod.substring(customMethod.indexOf("{") + 1);
                    customMethod = customMethod.substring(customMethod.lastIndexOf("}"), -1);
                    var f = new Function('cards', 'game', customMethod);
                    var allCards = this.cards.concat(this.passingCards);
                    var bestCards = f(allCards, game);
                    if (bestCards == undefined) {
                        throw "Custom decision failed.";
                    }
                    return bestCards;
                } catch (err) {
                    throw err;
                }
        }
    }

    this.ChoosePlayCard = function() {
        if (this.isHuman) {
            game.PromptPlayerToPlayCard();
        } else {
            var card = this.FindBestPlayingCard(game, this.skillLevel, false);
            game.OnPlayerChosePlayCard(card);
        }
    }

    this.FindBestPlayingCard = function(aGame, aSkillLevel, isForHint) {
        var possiblePlays = aGame.GetLegalCardsForCurrentPlayerTurn();
        switch (aSkillLevel) {
            case 'Easy':
                return possiblePlays[0];
            case 'Standard':
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

                        var currentPlayer = aGame.players[aGame.turnIndex%4];
                        if (currentPlayer.cards.length === 13) {
                            // First play of the round so there is no chance of taking a point
                            // Play the highest card possible
                            return possiblePlays[possiblePlays.length-1];

                        } else if (aGame.trickCards.length<3) {
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
            case 'Pro':
                var optimalPlayResult = HeartsFindOptimalPlayForCurrentPlayer(aGame, isForHint);
                return optimalPlayResult.optimalCard;

            case 'Custom':
                try {
                    var customMethod = this.GetDecisionMethod(1);
                    // Remove the first and last line of the code
                    customMethod = customMethod.substring(customMethod.indexOf("{") + 1);
                    customMethod = customMethod.substring(customMethod.lastIndexOf("}"), -1);
                    var f = new Function('cards', 'game', customMethod);
                    var bestCard = f(this.cards, game);
                    if (bestCard == undefined) {
                        throw "Custom decision failed.";
                    }
                    return bestCard;
                } catch (err) {
                    throw err;
                }
        }
    }

    this.GetDecisionMethod = function(decisionIndex) {

        var decisionMethodName = "hearts_decision_method_Custom_" + decisionIndex;
        var decisionMethod = window.localStorage.getItem(decisionMethodName);
        if (decisionMethod == null) {
            // Load a default method
            switch (decisionIndex) {
                case 0:
                {
                    decisionMethod = "var ChoosePassingCards = function(cards, game) {\n\n\
\tvar passingCards = [];\n\
\n\
\tvar bestCards = [];\n\
\tbestCards = bestCards.concat(cards);\n\
\tbestCards.sort(function(a,b) {\n\
\t\tif (a.value === b.value) {\n\
\t\t\tif (a.value >= 12) {\n\
\t\t\t\tif (a.suit === 'S') {\n\
\t\t\t\t\treturn -1;\n\
\t\t\t\t} else if (b.suit == 'S') {\n\
\t\t\t\t\treturn 1;\n\
\t\t\t\t} else {\n\
\t\t\t\t\treturn b.suitInt - a.suitInt;\n\
\t\t\t\t}\n\
\t\t\t} else {\n\
\t\t\t\treturn b.suitInt - a.suitInt;\n\
\t\t\t}\n\
\t\t} else {\n\
\t\t\treturn b.value - a.value;\n\
\t\t}\n\
\t});\n\
\n\
\tfor (var i=0; i<3; i++) {\n\
\t\tpassingCards.push(bestCards[i]);\n\
\t}\n\
\n\
\treturn passingCards;\n\
};";
                }
                break;

                case 1:
                {
                    decisionMethod = "var ChooseTrickCard = function(cards, game) {\n\n\
\tvar possiblePlays = game.GetLegalCardsForCurrentPlayerTurn();\n\
\n\
\tif (game.trickCards.length === 0) {\n\
\t\t// Lead with the lowest card value possible\n\
\t\tvar play = possiblePlays[0];\n\
\t\tfor (var i=1; i<possiblePlays.length; i++) {\n\
\t\t\tvar possiblePlay = possiblePlays[i];\n\
\t\t\tif (possiblePlay.value < play.value) {\n\
\t\t\t\tplay = possiblePlay;\n\
\t\t\t}\n\
\t\t}\n\
\t\treturn play;\n\
\t} else {\n\
\t\tvar leadCard = game.trickCards[0];\n\
\t\tvar play = possiblePlays[0];\n\
\t\tif (play.suit === leadCard.suit) {\n\
\t\t\t// Must play the same suit\n\
\t\t\tpossiblePlays.sort(function(a,b) {\n\
\t\t\t\treturn a.value - b.value;\n\
\t\t\t});\n\
\n\
\t\t\tvar highestCardInTrick = leadCard;\n\
\t\t\tfor (var i=1; i<game.trickCards.length; i++) {\n\
\t\t\t\tvar playedCard = game.trickCards[i];\n\
\t\t\t\tif (playedCard.suit === leadCard.suit && playedCard.value > highestCardInTrick.value) {\n\
\t\t\t\t\thighestCardInTrick = playedCard;\n\
\t\t\t\t}\n\
\t\t\t}\n\
\n\
\t\t\tvar currentPlayer = game.players[game.turnIndex%4];\n\
\t\t\tif (currentPlayer.cards.length === 13) {\n\
\t\t\t\t// First play of the round so there is no chance of taking a point\n\
\t\t\t\t// Play the highest card possible\n\
\t\t\t\treturn possiblePlays[possiblePlays.length-1];\n\
\t\t\t} else if (game.trickCards.length<3) {\n\
\t\t\t\t// Play the highest card that will not take the hand\n\
\t\t\t\tvar curPlay = possiblePlays[0];\n\
\t\t\t\tif (curPlay.value > highestCardInTrick) {\n\
\t\t\t\t\t// We have to play our lowest card and hope the next person is higher\n\
\t\t\t\t\treturn curPlay;\n\
\t\t\t\t} else {\n\
\t\t\t\t\t// Play the highest value that is less than the current highest card in the trick\n\
\t\t\t\t\tfor (var i=1; i<possiblePlays.length; i++) {\n\
\t\t\t\t\t\tvar possibleCard = possiblePlays[i];\n\
\t\t\t\t\t\tif (possibleCard.value < highestCardInTrick.value) {\n\
\t\t\t\t\t\t\tcurPlay = possibleCard;\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t}\n\
\t\t\t\t\treturn curPlay;\n\
\t\t\t\t}\n\
\t\t\t} else {\n\
\t\t\t\tvar curTrickPoints = 0;\n\
\t\t\t\tfor (var i=0; i<game.trickCards.length; i++) {\n\
\t\t\t\t\tvar card = game.trickCards[i];\n\
\t\t\t\t\tif (card.suit === 'H') {\n\
\t\t\t\t\t\tcurTrickPoints = curTrickPoints + 1;\n\
\t\t\t\t\t} else if (card.id === 'QS') {\n\
\t\t\t\t\t\tcurTrickPoints = curTrickPoints + 13;\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\n\
\t\t\t\tif (curTrickPoints === 0) {\n\
\t\t\t\t\t// No points so we can play the highest card of suit\n\
\t\t\t\t\tvar highestCard = possiblePlays[possiblePlays.length-1];\n\
\t\t\t\t\tif (highestCard.id === 'QS' && possiblePlays.length > 1) {\n\
\t\t\t\t\t\thighestCard = possiblePlays[possiblePlays.length-2];\n\
\t\t\t\t\t}\n\
\t\t\t\t\treturn highestCard;\n\
\t\t\t\t} else {\n\
\t\t\t\t\t// Try to not take the trick but if we must, then play the highest card\n\
\t\t\t\t\tvar curPlay = possiblePlays[0];\n\
\t\t\t\t\tif (curPlay.value > highestCardInTrick.value) {\n\
\t\t\t\t\t\t// play our highest card\n\
\t\t\t\t\t\tvar highestCard = possiblePlays[possiblePlays.length-1];\n\
\t\t\t\t\t\tif (highestCard.id === 'QS' && possiblePlays.length > 1) {\n\
\t\t\t\t\t\t\thighestCard = possiblePlays[possiblePlays.length-2];\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t\treturn highestCard;\n\
\t\t\t\t\t} else {\n\
\t\t\t\t\t\t// Play the highest value that is less than the current highest card in the trick\n\
\t\t\t\t\t\tfor (var i=1; i<possiblePlays.length; i++) {\n\
\t\t\t\t\t\t\tvar possibleCard = possiblePlays[i];\n\
\t\t\t\t\t\t\tif (possibleCard.value < highestCardInTrick.value) {\n\
\t\t\t\t\t\t\t\tcurPlay = possibleCard;\n\
\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t\treturn curPlay;\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t} else {\n\
\t\t\t// Play the highest valued card we have\n\
\t\t\tpossiblePlays.sort(function(a,b) {\n\
\t\t\t\t// Queen of spades is highest\n\
\t\t\t\tif (a.id === 'QS') {\n\
\t\t\t\t\treturn -1;\n\
\t\t\t\t} else if (b.id === 'QS') {\n\
\t\t\t\t\treturn 1;\n\
\t\t\t\t}\n\
\t\t\t\t// Otherwise prefer AS and KS over hearts\n\
\t\t\t\tif (a.value === b.value) {\n\
\t\t\t\t\tif (a.value >= 12) {\n\
\t\t\t\t\t\tif (a.suit === 'S') {\n\
\t\t\t\t\t\t\treturn -1;\n\
\t\t\t\t\t\t} else if (b.suit === 'S') {\n\
\t\t\t\t\t\t\treturn 1;\n\
\t\t\t\t\t\t} else {\n\
\t\t\t\t\t\t\treturn b.suitInt - a.suitInt;\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t} else {\n\
\t\t\t\t\t\treturn b.suitInt - a.suitInt;\n\
\t\t\t\t\t}\n\
\t\t\t\t} else {\n\
\t\t\t\t\treturn b.value - a.value;\n\
\t\t\t\t}\n\
\t\t\t});\n\
\t\t\treturn possiblePlays[0];\n\
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