var CribbagePlayer = function() {

    this.skillLevel = 'Standard';

    this.SelectTwoCardsToDiscardInCrib = function(aSkillLevel, isComputersCrib, computersHand) {
        switch (aSkillLevel) {
            case "Easy":
                return [computersHand[0], computersHand[1]];
            case "Standard":
                return this.FindStandardCribDiscards(computersHand, isComputersCrib);
            case "Pro":
                return this.FindOptimalCribDiscards(computersHand, isComputersCrib)[0];
            case "Custom":
            try {
                var customMethod = this.GetDecisionMethod(0);
                // Remove the method signature and paramters from the code
                customMethod = customMethod.substring(customMethod.indexOf("{") + 1);
                customMethod = customMethod.substring(customMethod.lastIndexOf("}"), -1);
                var f = new Function('cards', 'isYourCrib', customMethod);
                var discards = f(computersHand, isComputersCrib);
                if (discards == undefined) {
                    throw "Custom decision failed.";
                }
                return discards;
            } catch (err) {
                throw err;
            }
        }
    }

    this.FindStandardCribDiscards = function(cards, isCribScorePositive) {
        var trialCards = [];
        var bestCards = [];
        var cribCards = [];
        var currentBestScore = 0;

        bestCards.push(cards[0]);
        bestCards.push(cards[1]);
        for (var i=0; i<cards.length; i++) {
            for (var j=i+1; j<cards.length; j++) {
                trialCards = [];
                cribCards = [];
                for (var n=0; n<cards.length; n++) {
                    if (n!=i && n!=j) {
                        trialCards.push(cards[n]);
                    } else {
                        cribCards.push(cards[n]);
                    }
                }

                // Ignore the top card and just look at these cards
                var trialScore = this.GetScoreForCards(trialCards, null, false);
                var cribScore = GetPairsAndFifteensPointsForSubset(cribCards);
                if (isCribScorePositive) {
                    trialScore = trialScore + cribScore;
                } else {
                    trialScore = trialScore - cribScore;
                }

                if (trialScore > currentBestScore) {
                    bestCards = [];
                    bestCards.push(cards[i]);
                    bestCards.push(cards[j]);
                    currentBestScore = trialScore;
                }
            }
        }

        return bestCards;
    }

    this.FindOptimalCribDiscards = function(cards, isCribScorePositive) {
        var bestCards = [];
        var trialCards = [];
        var cribCards = [];
        var currentBestMinScore = 0;
        var currentBestAvgScore = 0;
        var currentBestMaxScore = 0;

        bestCards.push(cards[0]);
        bestCards.push(cards[1]);
        for (var i=0; i<cards.length; i++) {
            for (var j=i+1; j<cards.length; j++) {
                trialCards = [];
                cribCards = [];
                for (var n=0; n<cards.length; n++) {
                    if (n!=i && n!=j) {
                        trialCards.push(cards[n]);
                    } else {
                        cribCards.push(cards[n]);
                    }
                }

                var scoreStats = this.GetScoreStatsForPossibleDiscards(trialCards, cribCards, isCribScorePositive);
                var minScore = scoreStats[0];
                var avgScore = scoreStats[1];
                var maxScore = scoreStats[2];
                if (avgScore > currentBestAvgScore) {
                    bestCards = [];
                    bestCards.push(cards[i]);
                    bestCards.push(cards[j]);
                    currentBestMinScore = minScore;
                    currentBestAvgScore = avgScore;
                    currentBestMaxScore = maxScore;
                }
            }
        }

        return [bestCards, currentBestAvgScore];
    }

    this.GetScoreStatsForPossibleDiscards = function(trialCards, cribCards, isCribScorePositive) {
        var minScore = 1000;
        var maxScore = -1000;
        // Sum up the scores for all possible flip cards
        var topCard = {suit: "H", rank: 1, value: 1};
        trialCards.push(topCard);
        cribCards.push(topCard);
        var avgTrialScore = 0;
        var avgCribScore = 0;
        var count = 0;
        for (var k=1; k<=13; k++) {
            topCard.rank = k;
            topCard.value = k>10 ? 10 : k;
            for (var m=0; m<4; m++) {
                switch (m) {
                    case 0:
                    topCard.suit = "C";
                    break;
                    case 1:
                    topCard.suit = "D";
                    break;
                    case 2:
                    topCard.suit = "H";
                    break;
                    default:
                    topCard.suit = "S";
                    break;
                }

                var invalidCard = false;
                for (var i=0; i<trialCards.length; i++) {
                    var card = trialCards[i];
                    if (card !== topCard && card.rank == topCard.rank && card.suit == topCard.suit) {
                        invalidCard = true;
                        break;
                    }
                }
                if (invalidCard) {
                    continue;
                }
                for (var i=0; i<cribCards.length; i++) {
                    var card = cribCards[i];
                    if (card !== topCard && card.rank == topCard.rank && card.suit == topCard.suit) {
                        invalidCard = true;
                        break;
                    }
                }
                if (invalidCard) {
                    continue;
                }

                count = count + 1;
                var trialScore = this.GetScoreForCards(trialCards, topCard, false);
                avgTrialScore = avgTrialScore + trialScore;
                var cribScore = this.GetScoreForCards(cribCards, topCard, true);
                avgCribScore = avgCribScore + cribScore;

                if (isCribScorePositive) {
                    if (trialScore + cribScore > maxScore) {
                        maxScore = trialScore + cribScore;
                    }
                    if (trialScore + cribScore < minScore) {
                        minScore = trialScore + cribScore;
                    }
                } else {
                    if (trialScore - cribScore > maxScore) {
                        maxScore = trialScore - cribScore;
                    }
                    if (trialScore - cribScore < minScore) {
                        minScore = trialScore - cribScore;
                    }
                }
            }
        }
        avgTrialScore = avgTrialScore / count;
        avgCribScore = avgCribScore / count;

        if (isCribScorePositive) {
            avgTrialScore = avgTrialScore + avgCribScore;
        } else {
            avgTrialScore = avgTrialScore - avgCribScore;
        }

        // Remove the trial top cards
        var indexOfTrialTopCard = cribCards.indexOf(topCard);
        cribCards.splice(indexOfTrialTopCard, 1);
        indexOfTrialTopCard = trialCards.indexOf(topCard);
        trialCards.splice(indexOfTrialTopCard, 1);

        return [minScore, avgTrialScore, maxScore];
    }

    this.SelectNextCardForPegging = function(skillLevel, computersHand, currentPeggingCount, currentPeggingCards, deadPeggingCards, topCard) {
        var curBestScore = 0;
        var cardsUnder31 = [];
        for (var i=0; i<computersHand.length; i++) {
            if (computersHand[i] == null) {
                continue;
            }
            if (computersHand[i].value + currentPeggingCount <= 31) {
                cardsUnder31.push(computersHand[i]);
            }
        }
        if (cardsUnder31.length == 0) {
            return undefined;
        }
        
        switch (skillLevel) {
            case 'Easy':
            case 'Standard':
                var bestCard = cardsUnder31[0];
                for (var i=0; i<cardsUnder31.length; i++) {
                    var trialCard = cardsUnder31[i];
                    currentPeggingCards.push(trialCard);
                    var points = CribbageGame.GetPeggingPointsForCards(currentPeggingCards);
                    currentPeggingCards.pop();
                    var possibleScore = 0;
                    for (var j=0; j<points.length; j++) {
                        possibleScore = possibleScore + points[j].points;
                    }
                    if (possibleScore > curBestScore) {
                        curBestScore = possibleScore;
                        bestCard = trialCard;
                    }
                }
                return bestCard;
                break;
            case 'Pro':
                // Calculate the score for each possible play and do the highest score
                // Penalize the idea of leading with a 5
                curBestScore = -10;
                var bestCard = cardsUnder31[0];
                for (var i=0; i<cardsUnder31.length; i++) {
                    var trialCard = cardsUnder31[i];
                    currentPeggingCards.push(trialCard);
                    var points = CribbageGame.GetPeggingPointsForCards(currentPeggingCards);
                    currentPeggingCards.pop();
                    var possibleScore = 0;
                    for (var j=0; j<points.length; j++) {
                        possibleScore = possibleScore + points[j].points;
                    }

                    // Penalize for a count  of 5
                    if (currentPeggingCount + trialCard.value == 5) {
                        possibleScore = possibleScore -2;
                    }

                    // Penalize for a count of 21
                    if (currentPeggingCount + trialCard.value == 21) {
                        possibleScore = possibleScore -2;
                    }

                    if (possibleScore > curBestScore) {
                        bestCard = trialCard;
                        curBestScore = possibleScore;
                    }
                }     
                return bestCard;   
                break;
            case 'Custom':
                try {
                    var customMethod = this.GetDecisionMethod(1);
                    // Remove the method signature and paramters from the code
                    customMethod = customMethod.substring(customMethod.indexOf("{") + 1);
                    customMethod = customMethod.substring(customMethod.lastIndexOf("}"), -1);
                    var f = new Function('handCards', 'cardsUnder31', 'currentPeggingCount', 'currentPeggingCards', 'deadPeggingCards', 'topCard', customMethod);
                    var handCards = [];
                    for (var i=0; i<computersHand.length; i++) {
                        if (computersHand[i] != null) {
                            handCards.push(computersHand[i]);
                        }
                    }
                    var peggingCard = f(handCards, cardsUnder31, currentPeggingCount, currentPeggingCards, deadPeggingCards, topCard);
                    if (peggingCard == undefined) {
                        throw "Custom decision failed.";
                    }
                    return peggingCard;
                } catch (err) {
                    throw err;
                }
                break;
        }
        return undefined;
    }

    this.FindOptimalPeggingCard = function(computersHand, currentPeggingCount, currentPeggingCards, deadPeggingCards, topCard) {
        var curBestScore = 0;
        var cardsUnder31 = [];
        for (var i=0; i<computersHand.length; i++) {
            if (computersHand[i] == null) {
                continue;
            }
            if (computersHand[i].value + currentPeggingCount <= 31) {
                cardsUnder31.push(computersHand[i]);
            }
        }
        if (cardsUnder31.length == 0) {
            return [undefined, 0];
        }

        if (cardsUnder31.length === 1) {
            return [cardsUnder31[0], -1];
        }

        curBestScore = -10;
        var bestCard = cardsUnder31[0];
        for (var i=0; i<cardsUnder31.length; i++) {
            var trialCard = cardsUnder31[i];
            currentPeggingCards.push(trialCard);
            var points = CribbageGame.GetPeggingPointsForCards(currentPeggingCards);
            currentPeggingCards.pop();
            var possibleScore = 0;
            for (var j=0; j<points.length; j++) {
                possibleScore = possibleScore + points[j].points;
            }

            // Penalize for a count  of 5
            if (currentPeggingCount + trialCard.value == 5) {
                possibleScore = possibleScore-1;
            }

            // Penalize for a count of 21
            if (currentPeggingCount + trialCard.value == 21) {
                possibleScore = possibleScore-1;
            }

            if (possibleScore > curBestScore) {
                bestCard = trialCard;
                curBestScore = possibleScore;
            }
        }     
        return [bestCard, curBestScore]; 
    }

    this.GetScoreForCards = function(cards, topCard, isCrib) {
        var subsets = [];
        subsets.push([cards[0], cards[1]]);
        subsets.push([cards[0], cards[2]]);
        subsets.push([cards[1], cards[2]]);
        subsets.push([cards[0], cards[1], cards[2]]);
        
        if (cards.length > 3) {
            subsets.push([cards[0], cards[3]]);
            subsets.push([cards[1], cards[3]]);
            subsets.push([cards[2], cards[3]]);
            subsets.push([cards[0], cards[1], cards[3]]);
            subsets.push([cards[0], cards[2], cards[3]]);
            subsets.push([cards[1], cards[2], cards[3]]);
            subsets.push([cards[0], cards[1], cards[2], cards[3]]);    
        }

        if (cards.length > 4) {
            subsets.push([cards[0], cards[4]]);
            subsets.push([cards[1], cards[4]]);
            subsets.push([cards[2], cards[4]]);
            subsets.push([cards[3], cards[4]]);
            subsets.push([cards[0], cards[1], cards[4]]);
            subsets.push([cards[0], cards[2], cards[4]]);
            subsets.push([cards[0], cards[3], cards[4]]);
            subsets.push([cards[1], cards[2], cards[4]]);
            subsets.push([cards[1], cards[3], cards[4]]);
            subsets.push([cards[2], cards[3], cards[4]]);
            subsets.push([cards[0], cards[1], cards[2], cards[4]]);
            subsets.push([cards[0], cards[1], cards[3], cards[4]]);
            subsets.push([cards[0], cards[2], cards[3], cards[4]]);
            subsets.push([cards[1], cards[2], cards[3], cards[4]]);
            subsets.push([cards[0], cards[1], cards[2], cards[3], cards[4]]);        
        }

        var totalPoints = 0;
        for (var i=0; i<subsets.length; i++) {
            totalPoints = totalPoints + GetPairsAndFifteensPointsForSubset(subsets[i]);
        }

        // Look for any runs and double the score for each pair in the run
        cards.sort(function(a,b) { return a.rank - b.rank;});
        var runLength = 1;
        var multiplier = 1;
        var lastWasAPair = false;
        for (var i=1; i<cards.length; i++) {
            if (cards[i].rank === cards[i-1].rank) {
                if (lastWasAPair) {
                    multiplier = multiplier + 1;
                } else {
                    multiplier = multiplier * 2;
                    lastWasAPair = true;
                }
            }
            else if (cards[i].rank === cards[i-1].rank + 1) {
                runLength = runLength + 1;
                lastWasAPair = false;
            } else {
                if (runLength > 2) {
                    totalPoints = totalPoints + runLength*multiplier;
                }
                lastWasAPair = false;
                multiplier = 1;
                runLength = 1;
            }
        }
        if (runLength > 2) {
            totalPoints = totalPoints + runLength*multiplier;
        }

        if (topCard === null) {
            // Dont look for flush or nobs
            return totalPoints;
        }

        if (cards.length > 3) {
            // Look for a flush
            if (isCrib) {
                // All cards must be the same suit
                var curSuit = cards[0].suit;
                var flushFound = true;
                for (var i=1; i<cards.length; i++) {
                    if (cards[i].suit !== curSuit) {
                        flushFound = false;
                        break;
                    }
                }
                if (flushFound) {
                    totalPoints = totalPoints + 5;
                }
            } else {
                // All cards but the top card must be the same suit
                var curSuit = cards[0].suit;
                if (cards[0] === topCard) {
                    curSuit = cards[1].suit;
                }
                var suitSet = false;
                var flushFound = true;
                for (var i=0; i<cards.length; i++) {
                    if (cards[i] === topCard) {
                        continue;
                    }
                    if (!suitSet) {
                        suitSet = true;
                        curSuit = cards[i].suit;
                    } else {
                        if (cards[i].suit != curSuit) {
                            flushFound = false;
                            break;
                        }
                    }
                }
                if (flushFound) {
                    totalPoints = totalPoints + 4;
                    if (topCard.suit === curSuit) {
                        totalPoints = totalPoints + 1;
                    }
                }
            }
        }

        // Look for nobs
        for (var i=0; i<cards.length; i++) {
            if (cards[i].rank != 11) {
                continue;
            }
            if (cards[i] === topCard) {
                continue;
            }
            if (cards[i].suit === topCard.suit) {
                // Nobs found
                totalPoints = totalPoints + 1;
                break;
            }
        }

        return totalPoints;
    }

    function GetPairsAndFifteensPointsForSubset(cards) {
        var points = 0;

        // look for sum of 15
        var sum = 0;
        for (var i=0; i<cards.length; i++) {
            sum = sum + cards[i].value;
        }
        if (sum === 15) {
            points = points + 2;
        }

        // look for pairs
        if (cards.length == 2) {
            if (cards[0].rank == cards[1].rank) {
                points = points + 2;
            }
        }

        return points;
    }

    this.GetDecisionMethod = function(decisionIndex) {
        var decisionMethodName = "cribbage_decision_method_Custom_" + decisionIndex;
        var decisionMethod = window.localStorage.getItem(decisionMethodName);
        if (decisionMethod == null) {
            // Load a default method
            switch (decisionIndex) {
                case 0:
                {
                    decisionMethod = "var ChooseDiscards = function(\n\
        cards,\n\
        isYourCrib\n\
        ) {\n\
\n\
    // Helper function that counts points for a set of 3 or more cards\n\
    var GetScoreForPossibleCards = function(cards, topCard, isCrib) {\n\
        var subsets = [];\n\
        subsets.push([cards[0], cards[1]]);\n\
        subsets.push([cards[0], cards[2]]);\n\
        subsets.push([cards[1], cards[2]]);\n\
        subsets.push([cards[0], cards[1], cards[2]]);\n\
        \n\
        if (cards.length > 3) {\n\
            subsets.push([cards[0], cards[3]]);\n\
            subsets.push([cards[1], cards[3]]);\n\
            subsets.push([cards[2], cards[3]]);\n\
            subsets.push([cards[0], cards[1], cards[3]]);\n\
            subsets.push([cards[0], cards[2], cards[3]]);\n\
            subsets.push([cards[1], cards[2], cards[3]]);\n\
            subsets.push([cards[0], cards[1], cards[2], cards[3]]);\n\
        }\n\
        \n\
        if (cards.length > 4) {\n\
            subsets.push([cards[0], cards[4]]);\n\
            subsets.push([cards[1], cards[4]]);\n\
            subsets.push([cards[2], cards[4]]);\n\
            subsets.push([cards[3], cards[4]]);\n\
            subsets.push([cards[0], cards[1], cards[4]]);\n\
            subsets.push([cards[0], cards[2], cards[4]]);\n\
            subsets.push([cards[0], cards[3], cards[4]]);\n\
            subsets.push([cards[1], cards[2], cards[4]]);\n\
            subsets.push([cards[1], cards[3], cards[4]]);\n\
            subsets.push([cards[2], cards[3], cards[4]]);\n\
            subsets.push([cards[0], cards[1], cards[2], cards[4]]);\n\
            subsets.push([cards[0], cards[1], cards[3], cards[4]]);\n\
            subsets.push([cards[0], cards[2], cards[3], cards[4]]);\n\
            subsets.push([cards[1], cards[2], cards[3], cards[4]]);\n\
            subsets.push([cards[0], cards[1], cards[2], cards[3], cards[4]]);\n\
        }\n\
        \n\
        var totalPoints = 0;\n\
        for (var i=0; i<subsets.length; i++) {\n\
            totalPoints = totalPoints + GetPairsAndFifteensPointsForCards(subsets[i]);\n\
        }\n\
        \n\
        // Look for any runs and double the score for each pair in the run\n\
        cards.sort(function(a,b) { return a.rank - b.rank;});\n\
        var runLength = 1;\n\
        var multiplier = 1;\n\
        var lastWasAPair = false;\n\
        for (var i=1; i<cards.length; i++) {\n\
            if (cards[i].rank === cards[i-1].rank) {\n\
                if (lastWasAPair) {\n\
                    multiplier = multiplier + 1;\n\
                } else {\n\
                    multiplier = multiplier * 2;\n\
                    lastWasAPair = true;\n\
                }\n\
            }\n\
            else if (cards[i].rank === cards[i-1].rank + 1) {\n\
                runLength = runLength + 1;\n\
                lastWasAPair = false;\n\
            } else {\n\
                if (runLength > 2) {\n\
                    totalPoints = totalPoints + runLength*multiplier;\n\
                }\n\
                lastWasAPair = false;\n\
                multiplier = 1;\n\
                runLength = 1;\n\
            }\n\
        }\n\
        if (runLength > 2) {\n\
            totalPoints = totalPoints + runLength*multiplier;\n\
        }\n\
        \n\
        if (topCard === null) {\n\
            // Dont look for flush or nobs\n\
            return totalPoints;\n\
        }\n\
        \n\
        if (cards.length > 3) {\n\
            // Look for a flush\n\
            if (isCrib) {\n\
                // All cards must be the same suit\n\
                var curSuit = cards[0].suit;\n\
                var flushFound = true;\n\
                for (var i=1; i<cards.length; i++) {\n\
                    if (cards[i].suit !== curSuit) {\n\
                        flushFound = false;\n\
                        break;\n\
                    }\n\
                }\n\
                if (flushFound) {\n\
                    totalPoints = totalPoints + 5;\n\
                }\n\
            } else {\n\
                // All cards but the top card must be the same suit\n\
                var curSuit = cards[0].suit;\n\
                if (cards[0] === topCard) {\n\
                    curSuit = cards[1].suit;\n\
                }\n\
                var suitSet = false;\n\
                var flushFound = true;\n\
                for (var i=0; i<cards.length; i++) {\n\
                    if (cards[i] === topCard) {\n\
                        continue;\n\
                    }\n\
                    if (!suitSet) {\n\
                        suitSet = true;\n\
                        curSuit = cards[i].suit;\n\
                    } else {\n\
                        if (cards[i].suit != curSuit) {\n\
                            flushFound = false;\n\
                            break;\n\
                        }\n\
                    }\n\
                }\n\
                if (flushFound) {\n\
                    totalPoints = totalPoints + 4;\n\
                    if (topCard.suit === curSuit) {\n\
                        totalPoints = totalPoints + 1;\n\
                    }\n\
                }\n\
            }\n\
        }\n\
        \n\
        // Look for nobs\n\
        for (var i=0; i<cards.length; i++) {\n\
            if (cards[i].rank != 11) {\n\
                continue;\n\
            }\n\
            if (cards[i] === topCard) {\n\
                continue;\n\
            }\n\
            if (cards[i].suit === topCard.suit) {\n\
                // Nobs found\n\
                totalPoints = totalPoints + 1;\n\
                break;\n\
            }\n\
        }\n\
        \n\
        return totalPoints;\n\
    };\n\
    \n\
    // Helper function\n\
    var GetPairsAndFifteensPointsForCards = function(cards) {\n\
        var points = 0;\n\
\n\
        // look for sum of 15\n\
        var sum = 0;\n\
        for (var i=0; i<cards.length; i++) {\n\
            sum = sum + cards[i].value;\n\
        }\n\
        if (sum === 15) {\n\
            points = points + 2;\n\
        }\n\
        \n\
        // look for pairs\n\
        if (cards.length == 2) {\n\
            if (cards[0].rank == cards[1].rank) {\n\
                points = points + 2;\n\
            }\n\
        }\n\
        \n\
        return points;\n\
    }\n\
    \n\
    var bestCards = [];\n\
    var trialCards = [];\n\
    var cribCards = [];\n\
    var currentBestMinScore = 0;\n\
    var currentBestAvgScore = 0;\n\
    var currentBestMaxScore = 0;\n\
    \n\
    bestCards.push(cards[0]);\n\
    bestCards.push(cards[1]);\n\
    for (var i=0; i<cards.length; i++) {\n\
        for (var j=i+1; j<cards.length; j++) {\n\
            trialCards = [];\n\
            cribCards = [];\n\
            for (var n=0; n<cards.length; n++) {\n\
                if (n!=i && n!=j) {\n\
                    trialCards.push(cards[n]);\n\
                } else {\n\
                    cribCards.push(cards[n]);\n\
                }\n\
            }\n\
            \n\
            // Get Score Statistics for these trial cards\n\
            // Sum up the scores for all possible flip cards\n\
            var minScore = 1000;\n\
            var maxScore = -1000;\n\
            var topCard = {suit: 'H', rank: 1, value: 1};\n\
            trialCards.push(topCard);\n\
            cribCards.push(topCard);\n\
            var avgTrialScore = 0;\n\
            var avgCribScore = 0;\n\
            var count = 0;\n\
            for (var k=1; k<=13; k++) {\n\
                topCard.rank = k;\n\
                topCard.value = k>10 ? 10 : k;\n\
                for (var m=0; m<4; m++) {\n\
                    switch (m) {\n\
                        case 0:\n\
                        topCard.suit = 'C';\n\
                        break;\n\
                        case 1:\n\
                        topCard.suit = 'D';\n\
                        break;\n\
                        case 2:\n\
                        topCard.suit = 'H';\n\
                        break;\n\
                        default:\n\
                        topCard.suit = 'S';\n\
                        break;\n\
                    }\n\
                    \n\
                    var invalidCard = false;\n\
                    for (var n=0; n<trialCards.length; n++) {\n\
                        var card = trialCards[n];\n\
                        if (card !== topCard && card.rank == topCard.rank && card.suit == topCard.suit) {\n\
                            invalidCard = true;\n\
                            break;\n\
                        }\n\
                    }\n\
                    if (invalidCard) {\n\
                        continue;\n\
                    }\n\
                    for (var n=0; n<cribCards.length; n++) {\n\
                        var card = cribCards[n];\n\
                        if (card !== topCard && card.rank == topCard.rank && card.suit == topCard.suit) {\n\
                            invalidCard = true;\n\
                            break;\n\
                        }\n\
                    }\n\
                    if (invalidCard) {\n\
                        continue;\n\
                    }\n\
                    \n\
                    count = count + 1;\n\
                    var trialScore = GetScoreForPossibleCards(trialCards, topCard, false);\n\
                    avgTrialScore = avgTrialScore + trialScore;\n\
                    var cribScore = GetScoreForPossibleCards(cribCards, topCard, true);\n\
                    avgCribScore = avgCribScore + cribScore;\n\
                    \n\
                    if (isYourCrib) {\n\
                        if (trialScore + cribScore > maxScore) {\n\
                            maxScore = trialScore + cribScore;\n\
                        }\n\
                        if (trialScore + cribScore < minScore) {\n\
                            minScore = trialScore + cribScore;\n\
                        }\n\
                    } else {\n\
                        if (trialScore - cribScore > maxScore) {\n\
                            maxScore = trialScore - cribScore;\n\
                        }\n\
                        if (trialScore - cribScore < minScore) {\n\
                            minScore = trialScore - cribScore;\n\
                        }\n\
                    }\n\
                }\n\
            }\n\
            avgTrialScore = avgTrialScore / count;\n\
            avgCribScore = avgCribScore / count;\n\
            \n\
            if (isYourCrib) {\n\
                avgTrialScore = avgTrialScore + avgCribScore;\n\
            } else {\n\
                avgTrialScore = avgTrialScore - avgCribScore;\n\
            }\n\
            \n\
            // Remove the trial top cards\n\
            var indexOfTrialTopCard = cribCards.indexOf(topCard);\n\
            cribCards.splice(indexOfTrialTopCard, 1);\n\
            indexOfTrialTopCard = trialCards.indexOf(topCard);\n\
            trialCards.splice(indexOfTrialTopCard, 1);\n\
            \n\
            var scoreStats = [minScore, avgTrialScore, maxScore];\n\
            \n\
            var minScore = scoreStats[0];\n\
            var avgScore = scoreStats[1];\n\
            var maxScore = scoreStats[2];\n\
            if (avgScore > currentBestAvgScore) {\n\
                bestCards = [];\n\
                bestCards.push(cards[i]);\n\
                bestCards.push(cards[j]);\n\
                currentBestMinScore = minScore;\n\
                currentBestAvgScore = avgScore;\n\
                currentBestMaxScore = maxScore;\n\
            }\n\
        }\n\
    }\n\
    \n\
    return bestCards;\n\
};";
                }
                break;

                case 1:
                {
                    decisionMethod = "var ChoosePeggingCard = function(\n\
            handCards,\n\
            cardsUnder31,\n\
            currentPeggingCount,\n\
            currentPeggingCards,\n\
            deadPeggingCards,\n\
            topCard\n\
        ) {\n\
    var curBestScore = -10;\n\
    var bestCard = cardsUnder31[0];\n\
    for (var i=0; i<cardsUnder31.length; i++) {\n\
        var trialCard = cardsUnder31[i];\n\
        currentPeggingCards.push(trialCard);\n\
        var points = CribbageGame.GetPeggingPointsForCards(currentPeggingCards);\n\
        currentPeggingCards.pop();\n\
        var possibleScore = 0;\n\
        for (var j=0; j<points.length; j++) {\n\
            possibleScore = possibleScore + points[j].points;\n\
        }\n\
\n\
        // Penalize for a count  of 5\n\
        if (currentPeggingCount + trialCard.value == 5) {\n\
            possibleScore = possibleScore -2;\n\
        }\n\
\n\
        // Penalize for a count of 21\n\
        if (currentPeggingCount + trialCard.value == 21) {\n\
            possibleScore = possibleScore -2;\n\
        }\n\
\n\
        if (possibleScore > curBestScore) {\n\
            bestCard = trialCard;\n\
            curBestScore = possibleScore;\n\
        }\n\
    }\n\
    return bestCard;\n\
};";
                }
                break;
            }
        }

        return decisionMethod;
    }
}