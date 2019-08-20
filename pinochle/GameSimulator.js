var PinochleGameSimulator = function (aSettings, aDecisionMethods) {
    
        // Global Game Settings
        this.settings = aSettings;
        this.decisionMethods = aDecisionMethods;
        
        // Members
        this.currentMoveStage = "";
        this.currentDecisionIndex = 0;
        this.skillLevel = "";
        this.winningScore = this.settings.winningScore;
        this.isDoubleDeck = this.settings.isDoubleDeck;
        this.players = [];
        this.trickCards = [];
        this.roundNumber = 0;
        this.dealerIndex = 0;
        this.leadIndex = 0;
        this.turnIndex = 0;
        this.bidWinner = 0;
        this.currentHighestBidder = null;
        this.trumpSuit = 'S';
        this.cardsPlayedThisRound = [];
        this.roundContracts = [];
        this.roundMelds = [];
        this.roundCountersTaken = [];
        this.roundScores = [];
    
        this.gamesSimulated = 0;
        this.opponentSkillLevels =  ['Easy', 'Standard', 'Pro'];
        this.stats = {
            'gamesPlayed': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
            'wins': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
            'losses': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
            'contractTotal': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
            'contractCount': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
            'contractMadeCount': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
            'contractMadeAttemptsCount': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
            'meldWithBidTotal': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
            'meldWithBidCount': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
            'meldWithoutBidTotal': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
            'meldWithoutBidCount': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
            'countersWithBidTotal': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
            'countersWithBidCount': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
            'countersWithoutBidTotal': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
            'countersWithoutBidCount': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
            'roundScoresWithBidTotal': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
            'roundScoresWithBidCount': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
            'roundScoresWithoutBidTotal': { 'Easy': 0, 'Standard': 0, 'Pro': 0},
            'roundScoresWithoutBidCount': { 'Easy': 0, 'Standard': 0, 'Pro': 0}
        }

        var deckTopIndex = 0;
        var allCards = [
            { id: 'AS0', hash: 'AS', deckID:0, rank: 1, value: 5, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Spade_Ace.jpg')" },
            { id: 'TS0', hash: 'TS', deckID:0, rank: 10, value: 4, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Spade_10.jpg')" },
            { id: 'KS0', hash: 'KS', deckID:0, rank: 13, value: 3, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Spade_King.jpg')" },
            { id: 'QS0', hash: 'QS', deckID:0, rank: 12, value: 2, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Spade_Queen.jpg')" },
            { id: 'JS0', hash: 'JS', deckID:0, rank: 11, value: 1, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Spade_Jack.jpg')" },
            { id: '9S0', hash: '9S', deckID:0, rank: 9, value: 0, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Spade_9.jpg')" },
            { id: 'AS1', hash: 'AS', deckID:1, rank: 1, value: 5, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Spade_Ace.jpg')" },
            { id: 'TS1', hash: 'TS', deckID:1, rank: 10, value: 4, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Spade_10.jpg')" },
            { id: 'KS1', hash: 'KS', deckID:1, rank: 13, value: 3, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Spade_King.jpg')" },
            { id: 'QS1', hash: 'QS', deckID:1, rank: 12, value: 2, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Spade_Queen.jpg')" },
            { id: 'JS1', hash: 'JS', deckID:1, rank: 11, value: 1, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Spade_Jack.jpg')" },
            { id: '9S1', hash: '9S', deckID:1, rank: 9, value: 0, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Spade_9.jpg')" },
            { id: 'AS2', hash: 'AS', deckID:2, rank: 1, value: 5, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Spade_Ace.jpg')" },
            { id: 'TS2', hash: 'TS', deckID:2, rank: 10, value: 4, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Spade_10.jpg')" },
            { id: 'KS2', hash: 'KS', deckID:2, rank: 13, value: 3, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Spade_King.jpg')" },
            { id: 'QS2', hash: 'QS', deckID:2, rank: 12, value: 2, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Spade_Queen.jpg')" },
            { id: 'JS2', hash: 'JS', deckID:2, rank: 11, value: 1, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Spade_Jack.jpg')" },
            { id: 'AS3', hash: 'AS', deckID:3, rank: 1, value: 5, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Spade_Ace.jpg')" },
            { id: 'TS3', hash: 'TS', deckID:3, rank: 10, value: 4, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Spade_10.jpg')" },
            { id: 'KS3', hash: 'KS', deckID:3, rank: 13, value: 3, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Spade_King.jpg')" },
            { id: 'QS3', hash: 'QS', deckID:3, rank: 12, value: 2, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Spade_Queen.jpg')" },
            { id: 'JS3', hash: 'JS', deckID:3, rank: 11, value: 1, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Spade_Jack.jpg')" },
            
            { id: 'AH0', hash: 'AH', deckID:0, rank: 1, value: 5, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Heart_Ace.jpg')" },
            { id: 'TH0', hash: 'TH', deckID:0, rank: 10, value: 4, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Heart_10.jpg')" },
            { id: 'KH0', hash: 'KH', deckID:0, rank: 13, value: 3, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Heart_King.jpg')" },
            { id: 'QH0', hash: 'QH', deckID:0, rank: 12, value: 2, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Heart_Queen.jpg')" },
            { id: 'JH0', hash: 'JH', deckID:0, rank: 11, value: 1, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Heart_Jack.jpg')" },
            { id: '9H0', hash: '9H', deckID:0, rank: 9, value: 0, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Heart_9.jpg')" },
            { id: 'AH1', hash: 'AH', deckID:1, rank: 1, value: 5, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Heart_Ace.jpg')" },
            { id: 'TH1', hash: 'TH', deckID:1, rank: 10, value: 4, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Heart_10.jpg')" },
            { id: 'KH1', hash: 'KH', deckID:1, rank: 13, value: 3, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Heart_King.jpg')" },
            { id: 'QH1', hash: 'QH', deckID:1, rank: 12, value: 2, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Heart_Queen.jpg')" },
            { id: 'JH1', hash: 'JH', deckID:1, rank: 11, value: 1, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Heart_Jack.jpg')" },
            { id: '9H1', hash: '9H', deckID:1, rank: 9, value: 0, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Heart_9.jpg')" },
            { id: 'AH2', hash: 'AH', deckID:2, rank: 1, value: 5, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Heart_Ace.jpg')" },
            { id: 'TH2', hash: 'TH', deckID:2, rank: 10, value: 4, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Heart_10.jpg')" },
            { id: 'KH2', hash: 'KH', deckID:2, rank: 13, value: 3, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Heart_King.jpg')" },
            { id: 'QH2', hash: 'QH', deckID:2, rank: 12, value: 2, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Heart_Queen.jpg')" },
            { id: 'JH2', hash: 'JH', deckID:2, rank: 11, value: 1, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Heart_Jack.jpg')" },
            { id: 'AH3', hash: 'AH', deckID:3, rank: 1, value: 5, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Heart_Ace.jpg')" },
            { id: 'TH3', hash: 'TH', deckID:3, rank: 10, value: 4, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Heart_10.jpg')" },
            { id: 'KH3', hash: 'KH', deckID:3, rank: 13, value: 3, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Heart_King.jpg')" },
            { id: 'QH3', hash: 'QH', deckID:3, rank: 12, value: 2, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Heart_Queen.jpg')" },
            { id: 'JH3', hash: 'JH', deckID:3, rank: 11, value: 1, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Heart_Jack.jpg')" },
            
            { id: 'AC0', hash: 'AC', deckID:0, rank: 1, value: 5, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Club_Ace.jpg')" },
            { id: 'TC0', hash: 'TC', deckID:0, rank: 10, value: 4, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Club_10.jpg')" },
            { id: 'KC0', hash: 'KC', deckID:0, rank: 13, value: 3, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Club_King.jpg')" },
            { id: 'QC0', hash: 'QC', deckID:0, rank: 12, value: 2, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Club_Queen.jpg')" },
            { id: 'JC0', hash: 'JC', deckID:0, rank: 11, value: 1, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Club_Jack.jpg')" },
            { id: '9C0', hash: '9C', deckID:0, rank: 9, value: 0, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Club_9.jpg')" },
            { id: 'AC1', hash: 'AC', deckID:1, rank: 1, value: 5, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Club_Ace.jpg')" },
            { id: 'TC1', hash: 'TC', deckID:1, rank: 10, value: 4, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Club_10.jpg')" },
            { id: 'KC1', hash: 'KC', deckID:1, rank: 13, value: 3, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Club_King.jpg')" },
            { id: 'QC1', hash: 'QC', deckID:1, rank: 12, value: 2, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Club_Queen.jpg')" },
            { id: 'JC1', hash: 'JC', deckID:1, rank: 11, value: 1, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Club_Jack.jpg')" },
            { id: '9C1', hash: '9C', deckID:1, rank: 9, value: 0, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Club_9.jpg')" },
            { id: 'AC2', hash: 'AC', deckID:2, rank: 1, value: 5, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Club_Ace.jpg')" },
            { id: 'TC2', hash: 'TC', deckID:2, rank: 10, value: 4, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Club_10.jpg')" },
            { id: 'KC2', hash: 'KC', deckID:2, rank: 13, value: 3, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Club_King.jpg')" },
            { id: 'QC2', hash: 'QC', deckID:2, rank: 12, value: 2, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Club_Queen.jpg')" },
            { id: 'JC2', hash: 'JC', deckID:2, rank: 11, value: 1, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Club_Jack.jpg')" },
            { id: 'AC3', hash: 'AC', deckID:3, rank: 1, value: 5, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Club_Ace.jpg')" },
            { id: 'TC3', hash: 'TC', deckID:3, rank: 10, value: 4, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Club_10.jpg')" },
            { id: 'KC3', hash: 'KC', deckID:3, rank: 13, value: 3, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Club_King.jpg')" },
            { id: 'QC3', hash: 'QC', deckID:3, rank: 12, value: 2, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Club_Queen.jpg')" },
            { id: 'JC3', hash: 'JC', deckID:3, rank: 11, value: 1, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Club_Jack.jpg')" },
            
            { id: 'AD0', hash: 'AD', deckID:0, rank: 1, value: 5, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Diamond_Ace.jpg')" },
            { id: 'TD0', hash: 'TD', deckID:0, rank: 10, value: 4, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Diamond_10.jpg')" },
            { id: 'KD0', hash: 'KD', deckID:0, rank: 13, value: 3, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Diamond_King.jpg')" },
            { id: 'QD0', hash: 'QD', deckID:0, rank: 12, value: 2, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Diamond_Queen.jpg')" },
            { id: 'JD0', hash: 'JD', deckID:0, rank: 11, value: 1, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Diamond_Jack.jpg')" },
            { id: '9D0', hash: '9D', deckID:0, rank: 9, value: 0, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Diamond_9.jpg')" },
            { id: 'AD1', hash: 'AD', deckID:1, rank: 1, value: 5, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Diamond_Ace.jpg')" },
            { id: 'TD1', hash: 'TD', deckID:1, rank: 10, value: 4, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Diamond_10.jpg')" },
            { id: 'KD1', hash: 'KD', deckID:1, rank: 13, value: 3, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Diamond_King.jpg')" },
            { id: 'QD1', hash: 'QD', deckID:1, rank: 12, value: 2, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Diamond_Queen.jpg')" },
            { id: 'JD1', hash: 'JD', deckID:1, rank: 11, value: 1, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Diamond_Jack.jpg')" },
            { id: '9D1', hash: '9D', deckID:1, rank: 9, value: 0, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Diamond_9.jpg')" },
            { id: 'AD2', hash: 'AD', deckID:2, rank: 1, value: 5, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Diamond_Ace.jpg')" },
            { id: 'TD2', hash: 'TD', deckID:2, rank: 10, value: 4, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Diamond_10.jpg')" },
            { id: 'KD2', hash: 'KD', deckID:2, rank: 13, value: 3, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Diamond_King.jpg')" },
            { id: 'QD2', hash: 'QD', deckID:2, rank: 12, value: 2, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Diamond_Queen.jpg')" },
            { id: 'JD2', hash: 'JD', deckID:2, rank: 11, value: 1, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Diamond_Jack.jpg')" },
            { id: 'AD3', hash: 'AD', deckID:3, rank: 1, value: 5, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Diamond_Ace.jpg')" },
            { id: 'TD3', hash: 'TD', deckID:3, rank: 10, value: 4, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Diamond_10.jpg')" },
            { id: 'KD3', hash: 'KD', deckID:3, rank: 13, value: 3, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Diamond_King.jpg')" },
            { id: 'QD3', hash: 'QD', deckID:3, rank: 12, value: 2, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Diamond_Queen.jpg')" },
            { id: 'JD3', hash: 'JD', deckID:3, rank: 11, value: 1, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('shared/images/Card_Diamond_Jack.jpg')" },
        ];
    
        this.ConvertSuitIntToSuit = function(suitInt) {
            switch (suitInt) {
                case 0:
                    return 'S';
                case 1:
                    return 'H';
                case 2:
                    return 'C';
                default:
                    return 'D';
            }
        }
        var cards = [];
    
        this.GetCards = function () {
            return cards;
        }
    
        this.GetAllCards = function(isDoubleDeck) {
            gameCards=[];
            for (i=0; i<allCards.length; i++) {
                var card = allCards[i];
                if (isDoubleDeck && card.rank != 9) {
                    gameCards.push(card);
                } else if (!isDoubleDeck && card.deckID<2) {
                    gameCards.push(card);
                }
            }
            return gameCards;
        }
    
        this.GetCardFromString = function (cardString) {
            for (var i = 0; i < allCards.length; i++) {
                if (allCards[i].id == cardString) {
                    return allCards[i];
                }
            }
            return null;
        }
    
        this.InitializeSimulations = function() {
            this.gamesSimulated = 0;
            this.players = [];
            for (var i=0; i<4; i++) {
                this.players.push(new PinochlePlayer());
            }
            this.InitializeGame(this.opponentSkillLevels[this.gamesSimulated%this.opponentSkillLevels.length]);
        }

        this.InitializeGame = function(difficulty) {
            // Game properties
            this.skillLevel = difficulty;
            this.winningScore = this.settings.winningScore;
            this.isDoubleDeck = this.settings.isDoubleDeck;
            this.cardsPlayedThisRound = [];
            this.trickCards = [];
            this.roundNumber = 0;
            this.dealerIndex = 0;
            this.leadIndex = 0;
            this.turnIndex = 0;
            this.currentMoveStage = 'Initial';
            this.roundContracts = [];
            this.roundMelds = [];
            this.roundCountersTaken = [];
            this.roundScores = [];
    
            this.players[0].Initialize('You', true, 'Custom', 'South');
            switch(difficulty)
            {
                case 'Easy':
                {
                    this.players[1].Initialize('Conrad', false, difficulty, 'West');
                    this.players[2].Initialize('Louisa', false, 'Pro', 'North'); // TODO: make this also be the custom algorithm?
                    this.players[3].Initialize('Davina', false, difficulty, 'East');
                }
                break;
                case 'Standard':
                {
                    this.players[1].Initialize('Catalina', false, difficulty, 'West');
                    this.players[2].Initialize('Amelia', false, 'Pro', 'North'); // TODO: make this also custom algorithm
                    this.players[3].Initialize('Seward', false, difficulty, 'East');
                }
                break;
                default:
                {
                    this.players[1].Initialize('Charlotte', false, difficulty, 'West');
                    this.players[2].Initialize('Dixon', false, 'Pro', 'North'); // TODO: make this custom algorithm
                    this.players[3].Initialize('Isabella', false, difficulty, 'East');
                }
                break;
            }
        }
    
        this.GetGameState = function() {
            var gameStateString = "";
            gameStateString += this.skillLevel;
            gameStateString += "," + this.winningScore;
            gameStateString += "," + this.currentMoveStage;
            gameStateString += "," + this.roundNumber;
            gameStateString += "," + this.dealerIndex;
            gameStateString += "," + this.leadIndex;
            gameStateString += "," + this.turnIndex;
            gameStateString += "," + this.trumpSuit;
            gameStateString += "," + this.bidWinner;
            gameStateString += "," + this.isDoubleDeck;
            gameStateString += "," + this.currentDecisionIndex;
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
                gameStateString += player.name + "," + player.isHuman + "," + player.skillLevel + "," + player.playerPosition + "," + player.currentRoundBid + "," + player.currentRoundMaximumBid + "," + player.currentRoundWinningBidTrump + "," + player.currentRoundBidIsPass + "," + player.currentRoundMeldScore + "," + player.currentRoundCountersTaken + "," + player.gameScore + ",";
                for (var j=0; j<player.cards.length; j++) {
                    var card = player.cards[j];
                    gameStateString += card.id + ":" + card.wasShown + ":" + card.wasPassed + ".";
                }
                gameStateString += ",";
                for (var j=0; j<player.isShownVoidInSuit.length; j++) {
                    gameStateString += player.isShownVoidInSuit[j] + ".";
                }
                gameStateString += "\n";
            }
    
            for (var i=0; i<this.roundContracts.length; i++) {
                gameStateString += this.roundContracts[i][0] + "." + this.roundContracts[i][1] + ",";
            }
            gameStateString += "\n";
    
            for (var i=0; i<this.roundMelds.length; i++) {
                gameStateString += this.roundMelds[i][0] + "." + this.roundMelds[i][1] + ",";
            }
            gameStateString += "\n";
    
            for (var i=0; i<this.roundCountersTaken.length; i++) {
                gameStateString += this.roundCountersTaken[i][0] + "." + this.roundCountersTaken[i][1] + ",";
            }
            gameStateString += "\n";
    
            for (var i=0; i<this.roundScores.length; i++) {
                gameStateString += this.roundScores[i][0] + "." + this.roundScores[i][1] + ",";
            }
            gameStateString += "\n";
    
            return gameStateString;
        }
    
        function InitializeCardDeck(isDoubleDeck) {
            cards=[];
            var j, x, i;
            for (i=0; i<allCards.length; i++) {
                var card = allCards[i];
                if (isDoubleDeck && card.rank != 9) {
                    cards.push(card);
                } else if (!isDoubleDeck && card.deckID<2) {
                    cards.push(card);
                }
            }
            for (i = cards.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = cards[i];
                cards[i] = cards[j];
                cards[j] = x;
            }
            deckTopIndex = cards.length-1;
        }

        this.PlayCard = function(card) {
            var player = this.players[this.turnIndex%4];
            this.cardsPlayedThisRound.push(card);
            if (this.trickCards.length !== 0) {
                var leadCard = this.trickCards[0];
                if (card.suit !== leadCard.suit) {
                    player.isShownVoidInSuit[leadCard.suitInt] = true;
                    if (card.suit != this.trumpSuit) {
                        var suits = ['S','H','C','D'];
                        var trumpSuitIndex = suits.indexOf(this.trumpSuit);
                        player.isShownVoidInSuit[trumpSuitIndex] = true;
                    }
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
            trickResult.countersTaken = 0;
            for (var i=1; i<this.trickCards.length; i++) {
                var card = this.trickCards[i];
                if ((card.suit == trickResult.highestCard.suit && card.value > trickResult.highestCard.value) ||
                    (card.suit == this.trumpSuit && trickResult.highestCard.suit != this.trumpSuit)) {
                    trickResult.highestCard = card;
                    trickResult.trickTaker = this.players[(this.leadIndex + i)%4];
                }
            }
        
            for (var i=0; i<this.trickCards.length; i++) {
                var card = this.trickCards[i];
                if (card.rank == 1 || card.rank == 10 || card.rank == 13) {
                    trickResult.countersTaken += 1;
                }
            }
        
            if (this.players[0].cards.length == 0) {
                // Last trick
                trickResult.countersTaken += 1;
            }
        
            return trickResult;
        }
    
        this.FinishRound = function() {
            
            var aRoundContracts = [];
            var northSouthContract = -1;
            var eastWestContract = -1;
            if (this.bidWinner == 0 || this.bidWinner == 2) {
                northSouthContract = this.players[this.bidWinner].currentRoundBid;
            } else {
                eastWestContract = this.players[this.bidWinner].currentRoundBid;
            }
            aRoundContracts.push(northSouthContract);
            aRoundContracts.push(eastWestContract);
    
            var aRoundMelds = [];
            aRoundMelds.push(this.players[0].currentRoundMeldScore + this.players[2].currentRoundMeldScore);
            aRoundMelds.push(this.players[1].currentRoundMeldScore + this.players[3].currentRoundMeldScore)
    
            var aRoundCountersTaken = [];
            aRoundCountersTaken.push(this.players[0].currentRoundCountersTaken + this.players[2].currentRoundCountersTaken);
            aRoundCountersTaken.push(this.players[1].currentRoundCountersTaken + this.players[3].currentRoundCountersTaken);
    
            var aRoundScores = [];
            var totalPoints = aRoundMelds[0] + aRoundCountersTaken[0];
            if (this.bidWinner == 0 || this.bidWinner == 2) {
                if (this.players[0].countersTaken == -1) {
                    // Throw in
                    aRoundScores.push(-aRoundContracts[0]);
                } else {
                    if (totalPoints >= aRoundContracts[0]) {
                        aRoundScores.push(totalPoints);
                    } else {
                        aRoundScores.push(-aRoundContracts[0]);
                    }
                }
            } else {
                if (this.players[1].countersTaken == -1) {
                    // Opponent threw in
                    aRoundScores.push(aRoundMelds[0]);
                } else {
                    if (aRoundCountersTaken[0] == 0) {
                        aRoundScores.push(0);
                    } else {
                        aRoundScores.push(totalPoints);
                    }
                }
            }
            totalPoints = aRoundMelds[1] + aRoundCountersTaken[1];
            if (this.bidWinner == 1 || this.bidWinner == 3) {
                if (this.players[1].countersTaken == -1) {
                    // Throw in
                    aRoundScores.push(-aRoundContracts[1]);
                } else {
                    if (totalPoints >= aRoundContracts[1]) {
                        aRoundScores.push(totalPoints);
                    } else {
                        aRoundScores.push(-aRoundContracts[1]);
                    }
                }
            } else {
                if (this.players[0].countersTaken == -1) {
                    // Opponent threw in
                    aRoundScores.push(aRoundMelds[1]);
                } else {
                    if (aRoundCountersTaken[1] == 0) {
                        aRoundScores.push(0);
                    } else {
                        aRoundScores.push(totalPoints);
                    }
                }
            }
    
            this.players[0].gameScore += aRoundScores[0];
            this.players[1].gameScore += aRoundScores[1];
    
            this.roundContracts.push(aRoundContracts);
            this.roundMelds.push(aRoundMelds);
            this.roundCountersTaken.push(aRoundCountersTaken);
            this.roundScores.push(aRoundScores);
            this.dealerIndex += 1;
    
            // Count stats
            if (this.bidWinner == 0 || this.bidWinner == 2) {
                this.stats.countersWithBidTotal[this.skillLevel] += this.players[0].currentRoundCountersTaken + this.players[2].currentRoundCountersTaken;
                this.stats.countersWithBidCount[this.skillLevel] += 1;
                if (aRoundScores[0] > -1) {
                    this.stats.roundScoresWithBidTotal[this.skillLevel] += aRoundScores[0];
                    this.stats.roundScoresWithBidCount[this.skillLevel] += 1;
                    this.stats.contractMadeCount[this.skillLevel] += 1; 
                }
                this.stats.contractMadeAttemptsCount[this.skillLevel] += 1;
            } else {
                this.stats.countersWithoutBidTotal[this.skillLevel] += this.players[0].currentRoundCountersTaken + this.players[2].currentRoundCountersTaken;
                this.stats.countersWithoutBidCount[this.skillLevel] += 1;
                this.stats.roundScoresWithoutBidTotal[this.skillLevel] += aRoundScores[0];
                this.stats.roundScoresWithoutBidCount[this.skillLevel] += 1;
            }

            
            postSimulationStats(this.stats);

            var winner = this.TryToGetWinningPlayer();
            if (winner !== null) {
                this.OnGameOver(winner);
            } else {
                this.StepFromInitial();
            }
        }
    
        this.TryToGetWinningPlayer = function() {
            var southPlayer = this.players[0];
            var westPlayer = this.players[1];
            if (southPlayer.gameScore >= this.winningScore && westPlayer.gameScore >= this.winningScore) {
                // If both sides reach winning score on the same hand, the bidding side wins.
                if (this.currentHighestBidder.playerPosition == 'South' || this.currentHighestBidder.playerPosition == 'North') {
                    return southPlayer;
                } else {
                    return westPlayer;
                }
            } else if (southPlayer.gameScore >= this.winningScore) {
                return southPlayer;
            } else if (westPlayer.gameScore >= this.winningScore) {
                return westPlayer;
            }
            return null;
        }
    
        this.OnGameOver = function(winner) {
            this.gamesSimulated += 1;
            this.stats.gamesPlayed[this.skillLevel] += 1;
            
            if (winner.playerPosition == 'South') {
                this.stats.wins[this.skillLevel] += 1;
            } else {
                this.stats.losses[this.skillLevel] += 1;
            }
    
            postSimulationStats(this.stats);
            this.InitializeGame(this.opponentSkillLevels[this.gamesSimulated%this.opponentSkillLevels.length]);
            this.StepFromInitial();
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
                case 'ChoosingPassCards':
                    this.StepFromChoosingPassCards();
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
                player.currentRoundMeldScore = 0;
                player.currentRoundCountersTaken = 0;
                player.currentRoundBid = -1;
                player.currentRoundMaximumBid = -1;
                player.currentRoundBidIsPass = false;
                player.isShownVoidInSuit = [false,false,false,false];
            }

            // Deal cards for round
            this.cardsPlayedThisRound = [];
            InitializeCardDeck(this.settings.isDoubleDeck);
            var cardsPerHand = this.settings.isDoubleDeck ? 20 : 12;
            for (var i=0; i<cardsPerHand; i++) {
                for (var j=0; j<4; j++) {
                    this.players[j].cards.push(cards[deckTopIndex]);
                    deckTopIndex = deckTopIndex-1;
                }
            }

            // Get the max bid for each player
            for (var i=1; i<4; i++) {
                var player = this.players[i];
                var bid = player.FindBestBid(this, player.skillLevel, this.settings.passingCardsCount);
                player.currentRoundMaximumBid = bid[0];
                player.currentRoundWinningBidTrump = bid[1];
                player.currentRoundBidIsPass = false;
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
                var f = new Function('aGame', 'passingCardsCount', 'currentPlayerIndex', 'currentPlayerCards', customMethod);
                var bid = f(this,
                            this.settings.passingCardsCount,
                            player.playerPositionInt,
                            player.cards);
                if (bid == undefined) {
                    throw "Custom decision failed.";
                }
                player.currentRoundMaximumBid = bid[0];
                player.currentRoundWinningBidTrump = bid[1];
            } catch (err) {
                throw err;
            }

            // Find the bid winner
            for (var i=0; i<4; i++) {
                this.players[i].currentRoundBid = 0;
            }
            var currentBiddingPlayerIndex = (this.dealerIndex + 1)%4;
            this.leadIndex = currentBiddingPlayerIndex;
            var player = this.players[currentBiddingPlayerIndex];
            player.currentRoundBid = this.settings.minimumBid;
            this.bidWinner = player.playerPositionInt;
            currentBiddingPlayerIndex += 1;
            var bidPassCount = 0;
            while (bidPassCount<3) {
                player = this.players[currentBiddingPlayerIndex%4];
                if (!player.currentRoundBidIsPass) {
                    if (player.currentRoundMaximumBid > this.players[this.bidWinner].currentRoundBid) {
                        if (bidPassCount == 2 && 
                            this.players[this.bidWinner].playerPositionInt == (player.playerPositionInt+2)%4 &&
                            player.currentRoundMaximumBid < this.players[this.bidWinner].currentRoundBid + 10) {
                            // Don't get into a bidding war
                            player.currentRoundBidIsPass = true;
                            bidPassCount += 1;
                        } else {
                            player.currentRoundBid = this.players[this.bidWinner].currentRoundBid + 1;
                            this.bidWinner = player.playerPositionInt;
                        }
                    } else {
                        player.currentRoundBidIsPass = true;
                        bidPassCount+=1;
                    }
                }
                currentBiddingPlayerIndex += 1;
            }
            this.currentHighestBidder = this.players[this.bidWinner];
            this.trumpSuit = this.currentHighestBidder.currentRoundWinningBidTrump;

            // Count stats
            if (this.bidWinner == 0 || this.bidWinner == 2) {
                this.stats.contractTotal[this.skillLevel] += this.currentHighestBidder.currentRoundBid;
                this.stats.contractCount[this.skillLevel] += 1;
                postSimulationStats(this.stats);
            }

            if (this.settings.passingCardsCount>0) {
                if (this.bidWinner == 0) {
                    // Get the pass cards from partner
                    var player = this.players[2];
                    var bestCards = player.FindBestPassingCards(this.settings.passingCardsCount, player.skillLevel, this);
                    player.passingCards = bestCards;
                    player.cards = player.cards.filter((el) => !bestCards.includes(el));
                    var receivingPlayer = this.players[(player.playerPositionInt+2)%4];
                    receivingPlayer.receivedCards = [];
                    for (var i=0; i<player.passingCards.length; i++) {
                        player.passingCards[i].wasPassed = true;
                        receivingPlayer.receivedCards.push(player.passingCards[i]);
                        receivingPlayer.cards.push(player.passingCards[i]);
                    }

                    this.currentMoveStage = 'ChoosingPassCards';
                    this.currentDecisionIndex = 2;
                } else if (this.bidWinner == 2) {
                    this.currentMoveStage = 'ChoosingPassCards';
                    this.currentDecisionIndex = 1;
                } else {
                    // Get the pass cards from partner
                    var player = this.players[(this.bidWinner + 2)%4];
                    var bestCards = player.FindBestPassingCards(this.settings.passingCardsCount, player.skillLevel, this);
                    player.passingCards = bestCards;
                    player.cards = player.cards.filter((el) => !bestCards.includes(el));
                    var receivingPlayer = this.players[(player.playerPositionInt+2)%4];
                    receivingPlayer.receivedCards = [];
                    for (var i=0; i<player.passingCards.length; i++) {
                        player.passingCards[i].wasPassed = true;
                        receivingPlayer.receivedCards.push(player.passingCards[i]);
                        receivingPlayer.cards.push(player.passingCards[i]);
                    }
                    player = this.players[this.bidWinner];
                    bestCards = player.FindBestPassingCards(this.settings.passingCardsCount, player.skillLevel, this);
                    player.passingCards = bestCards;
                    player.cards = player.cards.filter((el) => !bestCards.includes(el));
                    receivingPlayer = this.players[(player.playerPositionInt+2)%4];
                    receivingPlayer.receivedCards = [];
                    for (var i=0; i<player.passingCards.length; i++) {
                        player.passingCards[i].wasPassed = true;
                        receivingPlayer.receivedCards.push(player.passingCards[i]);
                        receivingPlayer.cards.push(player.passingCards[i]);
                    }
                    
                    this.CountMelds();
                }
            } else {
                this.CountMelds();
            }
        }

        this.StepFromChoosingPassCards = function() {
            if (this.bidWinner == 0) {
                // Pass back
                var player = this.players[0];
                customMethod = this.decisionMethods[this.currentDecisionIndex];
                customMethod = customMethod.substring(customMethod.indexOf("{") + 1);
                customMethod = customMethod.substring(customMethod.lastIndexOf("}"), -1);
                player.CalculateMelds(player.cards, this.trumpSuit, this.isDoubleDeck, false);
                var f = new Function('handCards', 'receivedCards', 'melds', 'trumpSuit', 'isDoubleDeck', 'passingCardsCount', customMethod);
                var bestCards = f(player.cards, player.receivedCards, player.melds, this.trumpSuit, this.isDoubleDeck, this.settings.passingCardsCount);
                if (bestCards == undefined) {
                    throw "Custom decision failed.";
                }
                
                player.passingCards = bestCards;
                player.cards = player.cards.filter((el) => !bestCards.includes(el));
                var receivingPlayer = this.players[(player.playerPositionInt+2)%4];
                receivingPlayer.receivedCards = [];
                for (var i=0; i<player.passingCards.length; i++) {
                    player.passingCards[i].wasPassed = true;
                    receivingPlayer.receivedCards.push(player.passingCards[i]);
                    receivingPlayer.cards.push(player.passingCards[i]);
                }

                this.CountMelds();

            } else {
                // Pass to bid winner
                var player = this.players[0];
                customMethod = this.decisionMethods[this.currentDecisionIndex];
                customMethod = customMethod.substring(customMethod.indexOf("{") + 1);
                customMethod = customMethod.substring(customMethod.lastIndexOf("}"), -1);
                player.CalculateMelds(player.cards, this.trumpSuit, this.isDoubleDeck, false);
                var f = new Function('handCards', 'melds', 'trumpSuit', 'isDoubleDeck', 'passingCardsCount', customMethod);
                var bestCards = f(player.cards, player.melds, this.trumpSuit, this.isDoubleDeck, this.settings.passingCardsCount);
                if (bestCards == undefined) {
                    throw "Custom decision failed.";
                }
                player.passingCards = bestCards;
                player.cards = player.cards.filter((el) => !bestCards.includes(el));
                var receivingPlayer = this.players[(player.playerPositionInt+2)%4];
                receivingPlayer.receivedCards = [];
                for (var i=0; i<player.passingCards.length; i++) {
                    player.passingCards[i].wasPassed = true;
                    receivingPlayer.receivedCards.push(player.passingCards[i]);
                    receivingPlayer.cards.push(player.passingCards[i]);
                }

                player = this.players[2];
                bestCards = player.FindBestPassingCards(this.settings.passingCardsCount, player.skillLevel, this);
                player.passingCards = bestCards;
                player.cards = player.cards.filter((el) => !bestCards.includes(el));
                receivingPlayer = this.players[(player.playerPositionInt+2)%4];
                receivingPlayer.receivedCards = [];
                for (var i=0; i<player.passingCards.length; i++) {
                    player.passingCards[i].wasPassed = true;
                    receivingPlayer.receivedCards.push(player.passingCards[i]);
                    receivingPlayer.cards.push(player.passingCards[i]);
                }

                this.CountMelds();
            }
        }

        this.CountMelds = function() {
            for (var i=0; i<4; i++) {
                var player = this.players[i];
                player.passingCards = [];
                player.CalculateMelds(player.cards, this.trumpSuit, this.isDoubleDeck, false);
                for (var j=0; j<player.melds.length; j++) {
                    var meld = player.melds[j];
                    for (var k=0; k<meld.cards.length; k++) {
                        var card = meld.cards[k];
                        card.wasShown = true;
                    }
                }
            }

            
            // Count stats
            if (this.bidWinner == 0 || this.bidWinner == 2) {
                this.stats.meldWithBidTotal[this.skillLevel] += this.players[0].currentRoundMeldScore + this.players[2].currentRoundMeldScore;
                this.stats.meldWithBidCount[this.skillLevel] += 1;
            } else {
                this.stats.meldWithoutBidTotal[this.skillLevel] += this.players[0].currentRoundMeldScore + this.players[2].currentRoundMeldScore;
                this.stats.meldWithoutBidCount[this.skillLevel] += 1;
            }
            postSimulationStats(this.stats);

            this.StartTrickTaking();
        }

        this.StartTrickTaking = function() {
            this.trickCards = [];
            this.turnIndex = this.bidWinner;
            this.leadIndex = this.bidWinner;
            var nextPlayer = this.players[this.turnIndex%4];
            while (!nextPlayer.isHuman) {
                var card = nextPlayer.FindBestPlayingCard(this, nextPlayer.skillLevel);
                this.PlayCard(card);
                nextPlayer = this.players[this.turnIndex%4];
            }
            
            this.currentMoveStage = 'ChoosingTrickCard';
            this.currentDecisionIndex = 3;
        }

        this.GetLegalCardsForCurrentPlayerTurn = function() {
            var legalCards = [];
            var player = this.players[this.turnIndex%4];
            if (this.trickCards.length === 0) {
                for (var i=0; i<player.cards.length; i++) {
                    var card = player.cards[i];
                    legalCards.push(card);
                }
            } else {
                var leadCard = this.trickCards[0];
                var currentWinningCard = leadCard;
                for (var i=1; i<this.trickCards.length; i++) {
                    var card = this.trickCards[i];
                    if ((card.suit == currentWinningCard.suit && card.value > currentWinningCard.value) ||
                        (card.suit == this.trumpSuit && currentWinningCard.suit != this.trumpSuit)) {
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
                    if (card.suit == this.trumpSuit) {
                        playerHasCardInTrumpSuit = true;
                        if (playerHighestCardInTrumpSuit == null || card.value > playerHighestCardInTrumpSuit.value) {
                            playerHighestCardInTrumpSuit = card;
                        }
                    }
                }
                
                if (playerHasCardInLeadSuit) {
                    if (leadCard.suit != this.trumpSuit && currentWinningCard.suit == this.trumpSuit) {
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
                    if (currentWinningCard.suit == this.trumpSuit && playerHighestCardInTrumpSuit.value > currentWinningCard.value) {
                        // Play any trump that beats the current highest trump
                        for (var i=0; i<player.cards.length; i++) {
                            var card = player.cards[i];
                            if (card.suit == this.trumpSuit && card.value > currentWinningCard.value) {
                                legalCards.push(card);
                            }
                        }
                    } else {
                        // Play any trump
                        for (var i=0; i<player.cards.length; i++) {
                            var card = player.cards[i];
                            if (card.suit == this.trumpSuit) {
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

        this.StepFromChoosingTrickCard = function() {
            var player = this.players[0];
            var possiblePlays = this.GetLegalCardsForCurrentPlayerTurn();
            var unPlayedCards = [];
            for (var j=0; j<4; j++) {
                if (j == player.playerPositionInt) {
                    continue;
                }
                for (var k=0; k<this.players[j].cards.length; k++) {
                    unPlayedCards.push(this.players[j].cards[k]);
                }
            }
            // Use custom decision
            try {
                var customMethod = this.decisionMethods[this.currentDecisionIndex];
                // Remove the first and last line of the code
                customMethod = customMethod.substring(customMethod.indexOf("{") + 1);
                customMethod = customMethod.substring(customMethod.lastIndexOf("}"), -1);
                var f = new Function('aGame', 'handCards', 'possiblePlays', 'trickCards', 'trumpSuit', 'unPlayedCards', 'currentPlayerPosition', customMethod);
                var bestCard = f( 
                    this, 
                    player.cards, 
                    possiblePlays,
                    this.trickCards,
                    this.trumpSuit,
                    unPlayedCards,
                    player.playerPositionInt);
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
            trickResult.trickTaker.currentRoundCountersTaken += trickResult.countersTaken;
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
        
                this.currentDecisionIndex = 3;
                this.currentMoveStage = "ChoosingTrickCard";
            } else {
                this.FinishRound();
            }
    
        }
    }