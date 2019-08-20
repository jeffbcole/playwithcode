var CribbageGameSimulator = function (aSettings, aDecisionMethods) {

    // Global Game Settings
    this.settings = aSettings;
    this.decisionMethods = aDecisionMethods;

    // private variables
    this.skillLevel = "";
    this.currentDecisionIndex = 0;
    this.currentMoveStage = "";
    this.playerScore = 0;
    this.computerScore = 0;
    this.isPlayersCrib = false;
    this.playersHand = [];
    this.computersHand = [];
    this.crib = [];

    this.currentPeggingCards = [];
    this.deadPeggingCards = [];
    this.computerPlayedPeggingCards = [];
    this.playerPlayedPeggingCards = [];
    this.isPlayersTurnToPeg = false;
    this.playerSaysGo = false;
    this.computerSaysGo = false;

    this.humanPlayer = new CribbagePlayer();
    this.computerPlayer = new CribbagePlayer();

    this.recordPlayerPeggingStartingScore = 0;
    this.recordComputerPeggingStartingScore = 0;
    this.topCard = null;

    this.currentPeggingCount = 0;

    this.gamesSimulated = 0;
    this.opponentSkillLevels =  ['Easy', 'Standard', 'Pro'];
    this.stats = {
        'gamesPlayed': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
        'wins': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
        'skunkWins': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
        'skunkLosses': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
        'peggingScoreTotal': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
        'peggingScoreCount': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
        'handScoreTotal': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
        'handScoreCount': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
        'cribScoreTotal': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
        'cribScoreCount': { 'Easy': 0, 'Standard': 0, 'Pro': 0}
    }

    this.deckTopIndex = 0;
    var cards = [
        { id: 'AS', rank: 1, value: 1, suit: 'S'},
        { id: '2S', rank: 2, value: 2, suit: 'S'},
        { id: '3S', rank: 3, value: 3, suit: 'S'},
        { id: '4S', rank: 4, value: 4, suit: 'S'},
        { id: '5S', rank: 5, value: 5, suit: 'S'},
        { id: '6S', rank: 6, value: 6, suit: 'S'},
        { id: '7S', rank: 7, value: 7, suit: 'S'},
        { id: '8S', rank: 8, value: 8, suit: 'S'},
        { id: '9S', rank: 9, value: 9, suit: 'S'},
        { id: 'TS', rank: 10, value: 10, suit: 'S'},
        { id: 'JS', rank: 11, value: 10, suit: 'S'},
        { id: 'QS', rank: 12, value: 10, suit: 'S'},
        { id: 'KS', rank: 13, value: 10, suit: 'S'},
        { id: 'AD', rank: 1, value: 1, suit: 'D'},
        { id: '2D', rank: 2, value: 2, suit: 'D'},
        { id: '3D', rank: 3, value: 3, suit: 'D'},
        { id: '4D', rank: 4, value: 4, suit: 'D'},
        { id: '5D', rank: 5, value: 5, suit: 'D'},
        { id: '6D', rank: 6, value: 6, suit: 'D'},
        { id: '7D', rank: 7, value: 7, suit: 'D'},
        { id: '8D', rank: 8, value: 8, suit: 'D'},
        { id: '9D', rank: 9, value: 9, suit: 'D'},
        { id: 'TD', rank: 10, value: 10, suit: 'D'},
        { id: 'JD', rank: 11, value: 10, suit: 'D'},
        { id: 'QD', rank: 12, value: 10, suit: 'D'},
        { id: 'KD', rank: 13, value: 10, suit: 'D'},
        { id: 'AC', rank: 1, value: 1, suit: 'C'},
        { id: '2C', rank: 2, value: 2, suit: 'C'},
        { id: '3C', rank: 3, value: 3, suit: 'C'},
        { id: '4C', rank: 4, value: 4, suit: 'C'},
        { id: '5C', rank: 5, value: 5, suit: 'C'},
        { id: '6C', rank: 6, value: 6, suit: 'C'},
        { id: '7C', rank: 7, value: 7, suit: 'C'},
        { id: '8C', rank: 8, value: 8, suit: 'C'},
        { id: '9C', rank: 9, value: 9, suit: 'C'},
        { id: 'TC', rank: 10, value: 10, suit: 'C'},
        { id: 'JC', rank: 11, value: 10, suit: 'C'},
        { id: 'QC', rank: 12, value: 10, suit: 'C'},
        { id: 'KC', rank: 13, value: 10, suit: 'C'},
        { id: 'AH', rank: 1, value: 1, suit: 'H'},
        { id: '2H', rank: 2, value: 2, suit: 'H'},
        { id: '3H', rank: 3, value: 3, suit: 'H'},
        { id: '4H', rank: 4, value: 4, suit: 'H'},
        { id: '5H', rank: 5, value: 5, suit: 'H'},
        { id: '6H', rank: 6, value: 6, suit: 'H'},
        { id: '7H', rank: 7, value: 7, suit: 'H'},
        { id: '8H', rank: 8, value: 8, suit: 'H'},
        { id: '9H', rank: 9, value: 9, suit: 'H'},
        { id: 'TH', rank: 10, value: 10, suit: 'H'},
        { id: 'JH', rank: 11, value: 10, suit: 'H'},
        { id: 'QH', rank: 12, value: 10, suit: 'H'},
        { id: 'KH', rank: 13, value: 10, suit: 'H'}
    ];

    function shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
    }

    this.isGameOver = function() {
        return this.playerScore > 120 || this.computerScore > 120;
    }

    this.isPlayerWon = function() {
        return this.playerScore > 120;
    }

    this.isSkunkGame = function() {
        if (this.isPlayerWon()) {
            return this.computerScore < 91;
        } else {
            return this.playerScore < 91;
        }
    }

    this.GetPeggingPointsForCards = function (peggingCards) {
        var peggingPoints = [];
        if (peggingCards.length <= 1) {
            return peggingPoints;
        }

        // Look for pairs, three of a kind, four of a kind
        var curIdx = peggingCards.length - 1;
        if (curIdx > 0 && peggingCards[curIdx].rank === peggingCards[curIdx - 1].rank) {
            if (curIdx > 1 && peggingCards[curIdx].rank === peggingCards[curIdx - 2].rank) {
                if (curIdx > 2 && peggingCards[curIdx].rank === peggingCards[curIdx - 3].rank) {
                    var scoringPoints = {};
                    scoringPoints.points = 12;
                    scoringPoints.description = "4 of a kind";
                    peggingPoints.push(scoringPoints);
                } else {
                    var scoringPoints = {};
                    scoringPoints.points = 6;
                    scoringPoints.description = "3 of a kind";
                    peggingPoints.push(scoringPoints);
                }
            } else {
                var scoringPoints = {};
                scoringPoints.points = 2;
                scoringPoints.description = "Pair";
                peggingPoints.push(scoringPoints);

            }
        }

        // Look for sums to 15 (use it later to check for 31)
        var curSum = 0;
        for (var i = 0; i < peggingCards.length; i++) {
            curSum = curSum + peggingCards[i].value;
        }
        if (curSum == 15) {
            var scoringPoints = {};
            scoringPoints.points = 2;
            scoringPoints.description = "Fifteen";
            peggingPoints.push(scoringPoints);
        }

        // Look for runs of 3 or more
        for (var runLength = peggingCards.length; runLength >= 3; runLength--) {
            var trailingCards = peggingCards.slice(peggingCards.length - runLength, peggingCards.length);
            trailingCards.sort(function (a, b) {
                return a.rank - b.rank;
            });
            var runFound = true;
            for (var i = 0; i < trailingCards.length - 1; i++) {
                if (trailingCards[i].rank != trailingCards[i + 1].rank - 1) {
                    runFound = false;
                    break;
                }
            }
            if (runFound) {
                var scoringPoints = {};
                scoringPoints.points = runLength;
                scoringPoints.description = "Run of " + runLength;
                peggingPoints.push(scoringPoints);
                break;
            }
        }

        // Check for sum of 31
        if (curSum == 31) {
            var scoringPoints = {};
            scoringPoints.points = 2;
            scoringPoints.description = "Thirty One";
            peggingPoints.push(scoringPoints);
        }

        return peggingPoints;
    }

    this.GetPointsForHand = function (handCards, topCard, isCrib) {
        var points = [];
        var allCards = handCards.concat(topCard);
        var subsets = [];
        subsets.push([allCards[0], allCards[1]]);
        subsets.push([allCards[0], allCards[2]]);
        subsets.push([allCards[0], allCards[3]]);
        subsets.push([allCards[0], allCards[4]]);
        subsets.push([allCards[1], allCards[2]]);
        subsets.push([allCards[1], allCards[3]]);
        subsets.push([allCards[1], allCards[4]]);
        subsets.push([allCards[2], allCards[3]]);
        subsets.push([allCards[2], allCards[4]]);
        subsets.push([allCards[3], allCards[4]]);
        subsets.push([allCards[0], allCards[1], allCards[2]]);
        subsets.push([allCards[0], allCards[1], allCards[3]]);
        subsets.push([allCards[0], allCards[1], allCards[4]]);
        subsets.push([allCards[0], allCards[2], allCards[3]]);
        subsets.push([allCards[0], allCards[2], allCards[4]]);
        subsets.push([allCards[0], allCards[3], allCards[4]]);
        subsets.push([allCards[1], allCards[2], allCards[3]]);
        subsets.push([allCards[1], allCards[2], allCards[4]]);
        subsets.push([allCards[1], allCards[3], allCards[4]]);
        subsets.push([allCards[2], allCards[3], allCards[4]]);
        subsets.push([allCards[0], allCards[1], allCards[2], allCards[3]]);
        subsets.push([allCards[0], allCards[1], allCards[2], allCards[4]]);
        subsets.push([allCards[0], allCards[1], allCards[3], allCards[4]]);
        subsets.push([allCards[0], allCards[2], allCards[3], allCards[4]]);
        subsets.push([allCards[1], allCards[2], allCards[3], allCards[4]]);
        subsets.push([allCards[0], allCards[1], allCards[2], allCards[3], allCards[4]]);

        for (var i = 0; i < subsets.length; i++) {
            var subsetPoints = GetSubsetPoints(subsets[i]);
            points = points.concat(subsetPoints);
        }

        // Combine points that are subsets into their parent points
        var pointsToRemove = [];
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            if (point.description === "4 of a kind") {
                for (var j = 0; j < points.length; j++) {
                    if (points[j].description === "Pair") {
                        if (point.cards.indexOf(points[j].cards[0]) !== -1 &&
                            point.cards.indexOf(points[j].cards[1]) !== -1) {
                            pointsToRemove.push(points[j]);
                        }
                    } else if (points[j].description === "3 of a kind") {
                        if (point.cards.indexOf(points[j].cards[0]) !== -1 &&
                            point.cards.indexOf(points[j].cards[1]) !== -1 &&
                            point.cards.indexOf(points[j].cards[2]) !== -1) {
                            pointsToRemove.push(points[j]);
                        }
                    }
                }
            }
        }
        for (var i = 0; i < pointsToRemove.length; i++) {
            var index = points.indexOf(pointsToRemove[i]);
            if (index > -1) {
                points.splice(index, 1);
            }
        }
        
        pointsToRemove = [];
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            if (point.description === "3 of a kind") {
                for (var j = 0; j < points.length; j++) {
                    if (points[j].description === "Pair") {
                        if (point.cards.indexOf(points[j].cards[0]) !== -1 &&
                            point.cards.indexOf(points[j].cards[1]) !== -1) {
                            pointsToRemove.push(points[j]);
                        }
                    }
                }
            }
        }
        for (var i = 0; i < pointsToRemove.length; i++) {
            var index = points.indexOf(pointsToRemove[i]);
            if (index > -1) {
                points.splice(index, 1);
            }
        }

        // Remove redundant runs
        pointsToRemove = [];
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            if (point.descriptionID === 4) {
                for (var j = 0; j < points.length; j++) {
                    if (points[j].descriptionID === 4) {
                        if (points[j].points < point.points) {
                            // All cards in points[j] must be found in point
                            var allIncluded = true;
                            for (var k = 0; k < points[j].cards.length; k++) {
                                if (point.cards.indexOf(points[j].cards[k]) === -1) {
                                    allIncluded = false;
                                    break;
                                }
                            }
                            if (allIncluded) {
                                pointsToRemove.push(points[j]);
                            }
                        }
                    }
                }
            }
        }
        for (var i = 0; i < pointsToRemove.length; i++) {
            var index = points.indexOf(pointsToRemove[i]);
            if (index > -1) {
                points.splice(index, 1);
            }
        }

        // Look for a flush
        var flushDetected = true;
        for (var i = 0; i < handCards.length - 1; i++) {
            if (handCards[i].suit !== handCards[i + 1].suit) {
                flushDetected = false;
                break;
            }
        }
        if (flushDetected) {
            if (isCrib) {
                if (topCard.suit === handCards[0].suit) {
                    var point = {};
                    point.points = 5;
                    point.description = "Flush";
                    point.descriptionID = 5;
                    point.cards = allCards;
                    points.push(point);
                }
            } else {
                if (topCard.suit === handCards[0].suit) {
                    var point = {};
                    point.points = 5;
                    point.description = "Flush";
                    point.descriptionID = 5;
                    point.cards = allCards;
                    points.push(point);
                } else {
                    var point = {};
                    point.points = 4;
                    point.description = "Flush";
                    point.descriptionID = 5;
                    point.cards = handCards;
                    points.push(point);
                }
            }
        }

        // Look for nobs
        for (var i = 0; i < handCards.length; i++) {
            if (handCards[i].rank === 11 && handCards[i].suit === topCard.suit) {
                var point = {};
                point.points = 1;
                point.description = "Nobs";
                point.descriptionID = 6;
                point.cards = [handCards[i]];
                points.push(point);
                break;
            }
        }

        // Sort the points in proper order based on description
        points.sort(function (a, b) { return a.descriptionID - b.descriptionID; });

        return points;
    }

    this.GetSubsetPoints = function (subset) {
        var allPoints = [];

        // look for sum of 15
        var sum = 0;
        for (var i = 0; i < subset.length; i++) {
            sum = sum + subset[i].value;
        }
        if (sum === 15) {
            var point = {};
            point.points = 2;
            point.description = "Fifteen"
            point.descriptionID = 0;
            point.cards = subset;
            allPoints.push(point);
        }

        // Look for pairs, 3 of a kind, and 4 of a kind
        var allSame = true;
        var curNumber = subset[0].rank;
        for (var i = 1; i < subset.length; i++) {
            if (subset[i].rank != curNumber) {
                allSame = false;
                break;
            }
        }
        if (allSame) {
            var point = {};
            point.cards = subset;
            if (subset.length === 2) {
                point.points = 2;
                point.description = "Pair";
                point.descriptionID = 1;
            } else if (subset.length === 3) {
                point.points = 6;
                point.description = "3 of a kind";
                point.descriptionID = 2;
            } else if (subset.length === 4) {
                point.points = 12;
                point.description = "4 of a kind";
                point.descriptionID = 3;
            }
            allPoints.push(point);
        }

        // Look for runs
        if (subset.length > 2) {
            subset.sort(function (a, b) { return a.rank - b.rank; });
            var runFound = true;
            for (var i = 0; i < subset.length - 1; i++) {
                if (subset[i].rank + 1 !== subset[i + 1].rank) {
                    runFound = false;
                    break;
                }
            }
            if (runFound) {
                var point = {};
                point.cards = subset;
                point.points = subset.length;
                point.description = "Run of " + subset.length;
                point.descriptionID = 4;
                allPoints.push(point);
            }
        }
        return allPoints;
    }

    this.InitializeSimulations = function() {
        this.gamesSimulated = 0;
        this.InitializeGame(this.opponentSkillLevels[this.gamesSimulated%this.opponentSkillLevels.length]);
    }

    this.InitializeGame = function(difficulty) {
        // Game properties
        this.humanPlayer.skillLevel = "Custom";
        this.computerPlayer.skillLevel = difficulty;
        this.skillLevel = difficulty;
        this.playerScore = 0;
        this.computerScore = 0;
        this.isPlayersCrib = false;
        this.playersHand = [];
        this.computersHand = [];
        this.crib = [];
        this.currentMoveStage = "Initial";
    }

    this.GetGameState = function() {
        var gameStateString = "";
        gameStateString += this.skillLevel;
        gameStateString += "," + this.currentDecisionIndex;
        gameStateString += "," + this.currentMoveStage;
        gameStateString += "," + this.playerScore;
        gameStateString += "," + this.computerScore;
        gameStateString += "," + this.isPlayersCrib;
        gameStateString += "," + this.isPlayersTurnToPeg;
        gameStateString += "," + this.playerSaysGo;
        gameStateString += "," + this.computerSaysGo;
        gameStateString += "," + this.currentPeggingCount;
        gameStateString += "\n";

        for (var i=0; i<this.playersHand.length; i++) {
            if (this.playersHand[i] != null) {
                gameStateString += this.playersHand[i].id + ".";
            }
        }
        gameStateString += "\n";

        for (var i=0; i<this.computersHand.length; i++) {
            if (this.computersHand[i] != null) {
                gameStateString += this.computersHand[i].id + ".";
            }
        }
        gameStateString += "\n";

        for (var i=0; i<this.crib.length; i++) {
            gameStateString += this.crib[i].id + ".";
        }
        gameStateString += "\n";

        for (var i=0; i<this.currentPeggingCards.length; i++) {
            gameStateString += this.currentPeggingCards[i].id + ".";
        }
        gameStateString += "\n";
        
        for (var i=0; i<this.deadPeggingCards.length; i++) {
            gameStateString += this.deadPeggingCards[i].id + ".";
        }
        gameStateString += "\n";
        
        for (var i=0; i<this.computerPlayedPeggingCards.length; i++) {
            gameStateString += this.computerPlayedPeggingCards[i].id + ".";
        }
        gameStateString += "\n";
        
        for (var i=0; i<this.playerPlayedPeggingCards.length; i++) {
            gameStateString += this.playerPlayedPeggingCards[i].id + ".";
        }
        gameStateString += "\n";
        
        if (this.topCard != null) {
            gameStateString += this.topCard.id;
        }
        gameStateString += "\n";
        
        return gameStateString;
    }

    this.StepToNextDecision = function() {
        console.log('Stepping to next decision');
        switch (this.currentMoveStage) {
            case 'Initial':
                this.StepFromInitial();
                break;
            case 'WaitingForUserToDiscardToCrib':
                this.StepFromChoosingDiscard();
                break;
            case 'WaitingForUserToPlayPeggingCard':
                this.StepFromPlayingPeggingCard();
                break;
        }
    }

    this.StepFromInitial = function() {
        
        shuffle(cards);
        this.isPlayersCrib = Math.random() >= 0.5;
        this.deckTopIndex = cards.length - 1;
        this.playersHand = [];
        this.computersHand = [];
        this.crib = [];
        for (var i = 0; i < 6; i++) {
            this.playersHand.push(cards[this.deckTopIndex]);
            this.deckTopIndex = this.deckTopIndex - 1;
            this.computersHand.push(cards[this.deckTopIndex]);
            this.deckTopIndex = this.deckTopIndex - 1;
        }

        this.currentDecisionIndex = 0;
        this.currentMoveStage = 'WaitingForUserToDiscardToCrib';
    }

    this.StepFromChoosingDiscard = function() {

        // Choose discards for computer
        var computerDiscards = this.computerPlayer.SelectTwoCardsToDiscardInCrib(this.computerPlayer.skillLevel, !this.isPlayersCrib, this.computersHand);
        var index = this.computersHand.indexOf(computerDiscards[0]);
        this.computersHand.splice(index, 1);
        index = this.computersHand.indexOf(computerDiscards[1]);
        this.computersHand.splice(index, 1);
        for (var i = 0; i < computerDiscards.length; i++) {
            this.crib.push(computerDiscards[i]);
        }

        // Choose dicards for player
        try {
            var customMethod = this.decisionMethods[0];
            // Remove the method signature and paramters from the code
            customMethod = customMethod.substring(customMethod.indexOf("{") + 1);
            customMethod = customMethod.substring(customMethod.lastIndexOf("}"), -1);
            var f = new Function('cards', 'isYourCrib', customMethod);
            var discards = f(this.playersHand, this.isPlayersCrib);
            if (discards == undefined) {
                throw "Custom decision failed.";
            }
            index = this.playersHand.indexOf(discards[0]);
            this.playersHand.splice(index, 1);
            index = this.playersHand.indexOf(discards[1]);
            this.playersHand.splice(index, 1);
            for (var i = 0; i < discards.length; i++) {
                this.crib.push(discards[i]);
            }
        } catch (err) {
            throw err;
        }
        
        this.currentPeggingCards = [];
        this.deadPeggingCards = [];
        this.computerPlayedPeggingCards = [];
        this.playerPlayedPeggingCards = [];
        this.isPlayersTurnToPeg = this.isPlayersCrib;
        this.playerSaysGo = false;
        this.computerSaysGo = false;
        this.currentPeggingCount = 0;
        this.recordPlayerPeggingStartingScore = this.playerScore;
        this.recordComputerPeggingStartingScore = this.computerScore;

        // Flip the top card on the deck
        this.topCard = cards[this.deckTopIndex];
        if (this.topCard.rank == 11) {
            // This is a jack, reward the dealer 2 points
            if (this.isPlayersCrib) {
                this.playerScore = this.playerScore + 2;
            } else {
                this.computerScore = this.computerScore + 2;
            }
        }

        if (!this.isPlayersTurnToPeg) {
            var computerPlay = this.computerPlayer.SelectNextCardForPegging(this.computerPlayer.skillLevel, this.computersHand, this.currentPeggingCount, this.currentPeggingCards, this.deadPeggingCards, this.topCard);
            this.computersHand[this.computersHand.indexOf(computerPlay)] = null;
            this.currentPeggingCards.push(computerPlay);
            this.computerPlayedPeggingCards.push(computerPlay);
            
            var peggingPoints = this.GetPeggingPointsForCards(this.currentPeggingCards);
            var totalPoints = 0;
            for (var i = 0; i < peggingPoints.length; i++) {
                var scoringPoints = peggingPoints[i];
                totalPoints = totalPoints + scoringPoints.points;
            }
            
            this.currentPeggingCount += computerPlay.value;

            // Update the score
            if (totalPoints > 0) {
                this.computerScore = this.computerScore + totalPoints;
            }
        }

        this.currentDecisionIndex = 1;
        this.currentMoveStage = 'WaitingForUserToPlayPeggingCard';
    }

    this.StepFromPlayingPeggingCard = function() {
        var isPlayersTurn = true;
        var playerAlreadyPlayed = false;
        while (true) {

            if (this.isGameOver()) {
                this.OnGameOver();
                return;
            }

            if (this.currentPeggingCards.length + this.deadPeggingCards.length == 8) {
                // Pegging Finished
                if (this.currentPeggingCount != 31) {
                    // Award point for last card
                    if (isPlayersTurn) {
                        this.computerScore = this.computerScore + 1;
                    } else {
                        this.playerScore = this.playerScore + 1;
                    }
                    
                    if (this.isGameOver()) {
                        this.OnGameOver();
                        return;
                    }
                }

                this.OnPeggingFinished();
                return;
            }

            if (isPlayersTurn) {
                var play = null;
                try {
                    var customMethod = this.decisionMethods[1];
                    // Remove the method signature and paramters from the code
                    customMethod = customMethod.substring(customMethod.indexOf("{") + 1);
                    customMethod = customMethod.substring(customMethod.lastIndexOf("}"), -1);
                    var f = new Function('handCards', 'cardsUnder31', 'currentPeggingCount', 'currentPeggingCards', 'deadPeggingCards', 'topCard', customMethod);
                    var curBestScore = 0;
                    var cardsUnder31 = [];
                    for (var i=0; i<this.playersHand.length; i++) {
                        if (this.playersHand[i] == null) {
                            continue;
                        }
                        if (this.playersHand[i].value + this.currentPeggingCount <= 31) {
                            cardsUnder31.push(this.playersHand[i]);
                        }
                    }
                    play = f(this.playersHand, cardsUnder31, this.currentPeggingCount, this.currentPeggingCards, this.deadPeggingCards, this.topCard);
                } catch (err) {
                    throw err;
                }

                if (play === undefined) {
                    // This is a go
                    this.playerSaysGo = true;
                    if (this.computerSaysGo) {
                        // Give the player a point for last card
                        this.playerScore = this.playerScore + 1;
                        
                        //OnResetPeggingCount
                        for (var i = 0; i < this.currentPeggingCards.length; i++) {
                            this.deadPeggingCards.push(this.currentPeggingCards[i]);
                        }
                        this.currentPeggingCards = [];
                        this.currentPeggingCount = 0;
                        this.playerSaysGo = false;
                        this.computerSaysGo = false;       
                    }
                } else {
                    if (playerAlreadyPlayed) {
                        this.currentDecisionIndex = 1;
                        this.currentMoveStage = 'WaitingForUserToPlayPeggingCard';
                        return;
                    }
                    playerAlreadyPlayed = true;

                    // Drop card into peg pile
                    this.playersHand[this.playersHand.indexOf(play)] = null;
                    this.currentPeggingCards.push(play);
                    this.playerPlayedPeggingCards.push(play);
                    
                    var peggingPoints = GetPeggingPointsForCards(this.currentPeggingCards);
                    var totalPoints = 0;
                    for (var i = 0; i < peggingPoints.length; i++) {
                        var scoringPoints = peggingPoints[i];
                        totalPoints = totalPoints + scoringPoints.points;
                    }

                    this.currentPeggingCount += play.value;

                    // Update the score
                    if (totalPoints > 0) {
                        this.playerScore = this.playerScore + totalPoints;
                    }

                    if (this.currentPeggingCount == 31) {
                        //OnResetPeggingCount
                        // Move all the cards to the dead pile
                        for (var i = 0; i < this.currentPeggingCards.length; i++) {
                            this.deadPeggingCards.push(this.currentPeggingCards[i]);
                        }
                        this.currentPeggingCards = [];
                        this.currentPeggingCount = 0;
                        this.playerSaysGo = false;
                        this.computerSaysGo = false;
                    }
                }
            } else {
                var computerPlay = this.computerPlayer.SelectNextCardForPegging(this.computerPlayer.skillLevel, this.computersHand, this.currentPeggingCount, this.currentPeggingCards, this.deadPeggingCards, this.topCard);
                if (computerPlay === undefined) {
                    // This is a go
                    this.computerSaysGo = true;
                    if (this.playerSaysGo) {
                        if (this.currentPeggingCount != 31) {
                            // Give the computer a point for last card
                            this.computerScore = this.computerScore + 1;
                        }

                        //OnResetPeggingCount
                        // Move all the cards to the dead pile
                        for (var i = 0; i < this.currentPeggingCards.length; i++) {
                            this.deadPeggingCards.push(this.currentPeggingCards[i]);
                        }
                        this.currentPeggingCards = [];
                        this.currentPeggingCount = 0;
                        this.playerSaysGo = false;
                        this.computerSaysGo = false;
                    }
                } else {
                    this.computersHand[this.computersHand.indexOf(computerPlay)] = null;
                    this.currentPeggingCards.push(computerPlay);
                    this.computerPlayedPeggingCards.push(computerPlay);
                    
                    var peggingPoints = GetPeggingPointsForCards(this.currentPeggingCards);
                    var totalPoints = 0;
                    for (var i = 0; i < peggingPoints.length; i++) {
                        var scoringPoints = peggingPoints[i];
                        totalPoints = totalPoints + scoringPoints.points;
                    }
                    
                    this.currentPeggingCount += computerPlay.value;
                    
                    // Update the score
                    if (totalPoints > 0) {
                        this.computerScore = this.computerScore + totalPoints;
                    }
                
                    if (this.currentPeggingCount == 31) {
                        //OnResetPeggingCount
                        // Move all the cards to the dead pile
                        for (var i = 0; i < this.currentPeggingCards.length; i++) {
                            this.deadPeggingCards.push(this.currentPeggingCards[i]);
                        }
                        this.currentPeggingCards = [];
                        this.currentPeggingCount = 0;
                        this.playerSaysGo = false;
                        this.computerSaysGo = false;
                    }
        
                }
            }
            isPlayersTurn = !isPlayersTurn;
        }
    }

    this.OnPeggingFinished = function() {

        // Update the pegging score stats
        var peggingPoints = this.playerScore - this.recordPlayerPeggingStartingScore;
        this.stats.peggingScoreTotal[this.skillLevel] += peggingPoints;
        this.stats.peggingScoreCount[this.skillLevel] += 1;

        // Count hand points and crib points
        var scoringPoints = GetPointsForHand(this.computerPlayedPeggingCards, this.topCard, false);
        var recordHandScore = 0;
        for (var i = 0; i < scoringPoints.length; i++) {
            recordHandScore = recordHandScore + scoringPoints[i].points;
        }
        this.computerScore += recordHandScore;

        scoringPoints = GetPointsForHand(this.playerPlayedPeggingCards, this.topCard, false);
        recordHandScore = 0;
        for (var i = 0; i < scoringPoints.length; i++) {
            recordHandScore = recordHandScore + scoringPoints[i].points;
        }
        this.playerScore += recordHandScore;

        // Update hand score stats
        this.stats.handScoreTotal[this.skillLevel] += recordHandScore;
        this.stats.handScoreCount[this.skillLevel] += 1;

        scoringPoints = GetPointsForHand(this.crib, this.topCard, true);
        var recordCribScore = 0;
        for (var i = 0; i < scoringPoints.length; i++) {
            recordCribScore = recordCribScore + scoringPoints[i].points;
        }
        if (this.isPlayersCrib) {
            this.playerScore += recordCribScore;   
            // Update crib score stats
            this.stats.cribScoreTotal[this.skillLevel] += recordCribScore;
            this.stats.cribScoreCount[this.skillLevel] += 1;
        } else {
            this.computerScore += recordCribScore;
        }

        postSimulationStats(this.stats);

        if (this.isGameOver()) {
            this.OnGameOver();
            return;
        }

        // Reset for next round
        shuffle(cards);
        this.isPlayersCrib = !this.isPlayersCrib;
        this.deckTopIndex = cards.length - 1;
        this.playersHand = [];
        this.computersHand = [];
        this.crib = [];
        for (var i = 0; i < 6; i++) {
            this.playersHand.push(cards[this.deckTopIndex]);
            this.deckTopIndex = this.deckTopIndex - 1;
            this.computersHand.push(cards[this.deckTopIndex]);
            this.deckTopIndex = this.deckTopIndex - 1;
        }

        this.currentDecisionIndex = 0;
        this.currentMoveStage = 'WaitingForUserToDiscardToCrib';

    }

    this.OnGameOver = function() {
        this.gamesSimulated += 1;
        this.stats.gamesPlayed[this.skillLevel] += 1;
        if (this.isPlayerWon()) {
            this.stats.wins[this.skillLevel] += 1;
            if (this.isSkunkGame()) {
                this.stats.skunkWins[this.skillLevel] += 1;
            }
        } else {
            if (this.isSkunkGame()) {
                this.stats.skunkLosses[this.skillLevel] += 1;
            }
        }
        
        postSimulationStats(this.stats);
        this.InitializeGame(this.opponentSkillLevels[this.gamesSimulated%this.opponentSkillLevels.length]);
        this.StepFromInitial();
    }
}

var GetPeggingPointsForCards = function (peggingCards) {
    var peggingPoints = [];
    if (peggingCards.length <= 1) {
        return peggingPoints;
    }

    // Look for pairs, three of a kind, four of a kind
    var curIdx = peggingCards.length - 1;
    if (curIdx > 0 && peggingCards[curIdx].rank === peggingCards[curIdx - 1].rank) {
        if (curIdx > 1 && peggingCards[curIdx].rank === peggingCards[curIdx - 2].rank) {
            if (curIdx > 2 && peggingCards[curIdx].rank === peggingCards[curIdx - 3].rank) {
                var scoringPoints = {};
                scoringPoints.points = 12;
                scoringPoints.description = "4 of a kind";
                peggingPoints.push(scoringPoints);
            } else {
                var scoringPoints = {};
                scoringPoints.points = 6;
                scoringPoints.description = "3 of a kind";
                peggingPoints.push(scoringPoints);
            }
        } else {
            var scoringPoints = {};
            scoringPoints.points = 2;
            scoringPoints.description = "Pair";
            peggingPoints.push(scoringPoints);

        }
    }

    // Look for sums to 15 (use it later to check for 31)
    var curSum = 0;
    for (var i = 0; i < peggingCards.length; i++) {
        curSum = curSum + peggingCards[i].value;
    }
    if (curSum == 15) {
        var scoringPoints = {};
        scoringPoints.points = 2;
        scoringPoints.description = "Fifteen";
        peggingPoints.push(scoringPoints);
    }

    // Look for runs of 3 or more
    for (var runLength = peggingCards.length; runLength >= 3; runLength--) {
        var trailingCards = peggingCards.slice(peggingCards.length - runLength, peggingCards.length);
        trailingCards.sort(function (a, b) {
            return a.rank - b.rank;
        });
        var runFound = true;
        for (var i = 0; i < trailingCards.length - 1; i++) {
            if (trailingCards[i].rank != trailingCards[i + 1].rank - 1) {
                runFound = false;
                break;
            }
        }
        if (runFound) {
            var scoringPoints = {};
            scoringPoints.points = runLength;
            scoringPoints.description = "Run of " + runLength;
            peggingPoints.push(scoringPoints);
            break;
        }
    }

    // Check for sum of 31
    if (curSum == 31) {
        var scoringPoints = {};
        scoringPoints.points = 2;
        scoringPoints.description = "Thirty One";
        peggingPoints.push(scoringPoints);
    }

    return peggingPoints;
}

var GetPointsForHand = function (handCards, topCard, isCrib) {
    var points = [];
    var allCards = handCards.concat(topCard);
    var subsets = [];
    subsets.push([allCards[0], allCards[1]]);
    subsets.push([allCards[0], allCards[2]]);
    subsets.push([allCards[0], allCards[3]]);
    subsets.push([allCards[0], allCards[4]]);
    subsets.push([allCards[1], allCards[2]]);
    subsets.push([allCards[1], allCards[3]]);
    subsets.push([allCards[1], allCards[4]]);
    subsets.push([allCards[2], allCards[3]]);
    subsets.push([allCards[2], allCards[4]]);
    subsets.push([allCards[3], allCards[4]]);
    subsets.push([allCards[0], allCards[1], allCards[2]]);
    subsets.push([allCards[0], allCards[1], allCards[3]]);
    subsets.push([allCards[0], allCards[1], allCards[4]]);
    subsets.push([allCards[0], allCards[2], allCards[3]]);
    subsets.push([allCards[0], allCards[2], allCards[4]]);
    subsets.push([allCards[0], allCards[3], allCards[4]]);
    subsets.push([allCards[1], allCards[2], allCards[3]]);
    subsets.push([allCards[1], allCards[2], allCards[4]]);
    subsets.push([allCards[1], allCards[3], allCards[4]]);
    subsets.push([allCards[2], allCards[3], allCards[4]]);
    subsets.push([allCards[0], allCards[1], allCards[2], allCards[3]]);
    subsets.push([allCards[0], allCards[1], allCards[2], allCards[4]]);
    subsets.push([allCards[0], allCards[1], allCards[3], allCards[4]]);
    subsets.push([allCards[0], allCards[2], allCards[3], allCards[4]]);
    subsets.push([allCards[1], allCards[2], allCards[3], allCards[4]]);
    subsets.push([allCards[0], allCards[1], allCards[2], allCards[3], allCards[4]]);

    for (var i = 0; i < subsets.length; i++) {
        var subsetPoints = GetSubsetPoints(subsets[i]);
        points = points.concat(subsetPoints);
    }

    // Combine points that are subsets into their parent points
    var pointsToRemove = [];
    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        if (point.description === "4 of a kind") {
            for (var j = 0; j < points.length; j++) {
                if (points[j].description === "Pair") {
                    if (point.cards.indexOf(points[j].cards[0]) !== -1 &&
                        point.cards.indexOf(points[j].cards[1]) !== -1) {
                        pointsToRemove.push(points[j]);
                    }
                } else if (points[j].description === "3 of a kind") {
                    if (point.cards.indexOf(points[j].cards[0]) !== -1 &&
                        point.cards.indexOf(points[j].cards[1]) !== -1 &&
                        point.cards.indexOf(points[j].cards[2]) !== -1) {
                        pointsToRemove.push(points[j]);
                    }
                }
            }
        }
    }
    for (var i = 0; i < pointsToRemove.length; i++) {
        var index = points.indexOf(pointsToRemove[i]);
        if (index > -1) {
            points.splice(index, 1);
        }
    }
    
    pointsToRemove = [];
    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        if (point.description === "3 of a kind") {
            for (var j = 0; j < points.length; j++) {
                if (points[j].description === "Pair") {
                    if (point.cards.indexOf(points[j].cards[0]) !== -1 &&
                        point.cards.indexOf(points[j].cards[1]) !== -1) {
                        pointsToRemove.push(points[j]);
                    }
                }
            }
        }
    }
    for (var i = 0; i < pointsToRemove.length; i++) {
        var index = points.indexOf(pointsToRemove[i]);
        if (index > -1) {
            points.splice(index, 1);
        }
    }

    // Remove redundant runs
    pointsToRemove = [];
    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        if (point.descriptionID === 4) {
            for (var j = 0; j < points.length; j++) {
                if (points[j].descriptionID === 4) {
                    if (points[j].points < point.points) {
                        // All cards in points[j] must be found in point
                        var allIncluded = true;
                        for (var k = 0; k < points[j].cards.length; k++) {
                            if (point.cards.indexOf(points[j].cards[k]) === -1) {
                                allIncluded = false;
                                break;
                            }
                        }
                        if (allIncluded) {
                            pointsToRemove.push(points[j]);
                        }
                    }
                }
            }
        }
    }
    for (var i = 0; i < pointsToRemove.length; i++) {
        var index = points.indexOf(pointsToRemove[i]);
        if (index > -1) {
            points.splice(index, 1);
        }
    }

    // Look for a flush
    var flushDetected = true;
    for (var i = 0; i < handCards.length - 1; i++) {
        if (handCards[i].suit !== handCards[i + 1].suit) {
            flushDetected = false;
            break;
        }
    }
    if (flushDetected) {
        if (isCrib) {
            if (topCard.suit === handCards[0].suit) {
                var point = {};
                point.points = 5;
                point.description = "Flush";
                point.descriptionID = 5;
                point.cards = allCards;
                points.push(point);
            }
        } else {
            if (topCard.suit === handCards[0].suit) {
                var point = {};
                point.points = 5;
                point.description = "Flush";
                point.descriptionID = 5;
                point.cards = allCards;
                points.push(point);
            } else {
                var point = {};
                point.points = 4;
                point.description = "Flush";
                point.descriptionID = 5;
                point.cards = handCards;
                points.push(point);
            }
        }
    }

    // Look for nobs
    for (var i = 0; i < handCards.length; i++) {
        if (handCards[i].rank === 11 && handCards[i].suit === topCard.suit) {
            var point = {};
            point.points = 1;
            point.description = "Nobs";
            point.descriptionID = 6;
            point.cards = [handCards[i]];
            points.push(point);
            break;
        }
    }

    // Sort the points in proper order based on description
    points.sort(function (a, b) { return a.descriptionID - b.descriptionID; });

    return points;
}

var GetSubsetPoints = function (subset) {
    var allPoints = [];

    // look for sum of 15
    var sum = 0;
    for (var i = 0; i < subset.length; i++) {
        sum = sum + subset[i].value;
    }
    if (sum === 15) {
        var point = {};
        point.points = 2;
        point.description = "Fifteen"
        point.descriptionID = 0;
        point.cards = subset;
        allPoints.push(point);
    }

    // Look for pairs, 3 of a kind, and 4 of a kind
    var allSame = true;
    var curNumber = subset[0].rank;
    for (var i = 1; i < subset.length; i++) {
        if (subset[i].rank != curNumber) {
            allSame = false;
            break;
        }
    }
    if (allSame) {
        var point = {};
        point.cards = subset;
        if (subset.length === 2) {
            point.points = 2;
            point.description = "Pair";
            point.descriptionID = 1;
        } else if (subset.length === 3) {
            point.points = 6;
            point.description = "3 of a kind";
            point.descriptionID = 2;
        } else if (subset.length === 4) {
            point.points = 12;
            point.description = "4 of a kind";
            point.descriptionID = 3;
        }
        allPoints.push(point);
    }

    // Look for runs
    if (subset.length > 2) {
        subset.sort(function (a, b) { return a.rank - b.rank; });
        var runFound = true;
        for (var i = 0; i < subset.length - 1; i++) {
            if (subset[i].rank + 1 !== subset[i + 1].rank) {
                runFound = false;
                break;
            }
        }
        if (runFound) {
            var point = {};
            point.cards = subset;
            point.points = subset.length;
            point.description = "Run of " + subset.length;
            point.descriptionID = 4;
            allPoints.push(point);
        }
    }
    return allPoints;
}
    