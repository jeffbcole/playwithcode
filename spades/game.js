var SpadesGame = function () {

    // Global Game Settings
    this.settings = new SpadesSettings();
    
    // Constants
    var cardLoweredWidth = 115;
    var cardLoweredHeight = 162;
    
    // Local variables
    var scoreboard = new SpadesScoreboard();
    var currentDraggedCardView;
    var currentPlayerHandCardSpacing = 0;
    var autoPlayBoundaryY = 0;

    // Members
    this.currentMoveStage = "";
    this.skillLevel = "";
    this.winningScore = 0;
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

    // Inject all the html elements
    gameContainer.innerHTML = 
        '<div id="below_cards_messages_region">\
        <div class="spades_player_name" id="player_name_South"></div>\
        <div class="spades_player_name" id="player_name_West"></div>\
        <div class="spades_player_name" id="player_name_North"></div>\
        <div class="spades_player_name" id="player_name_East"></div>\
        \
        <div class="spades_player_score" id="player_score_South"></div>\
        <div class="spades_player_score" id="player_score_West"></div>\
        <div class="spades_player_score" id="player_score_North"></div>\
        <div class="spades_player_score" id="player_score_East"></div>\
        \
        <div id="spades_player_play_prompt">Drop a card here</div>\
        \
        <button id="spades_hint_button" onclick="game.OnHintButtonClick()">Hint</button>\
        \
        <div id="spades_scoreboard">\
            <div id="spades_scoreboardBackground" onclick="game.OnScoreboardClick()">\
                <div id="spades_scoreboardPlayerRegionSouth" class="spades_scoreboardPlayerRegion">\
                    <div id="scoreboardPlayerNameSouth" class="spades_scoreboardPlayerName">South</div>\
                    <div id="scoreboardPlayerBarSouth" class="spades_scoreboardPlayerBar">\
                        <div id="scoreboardPlayerBarFillSouth" class="spades_scoreboardPlayerBarFill"></div>\
                    </div>\
                    <div id="scoreboardPlayerScoreSouth" class="spades_scoreboardPlayerScore">10</div>\
                </div>\
                <div id="spades_scoreboardPlayerRegionWest" class="spades_scoreboardPlayerRegion">\
                    <div id="scoreboardPlayerNameWest" class="spades_scoreboardPlayerName">West</div>\
                    <div id="scoreboardPlayerBarWest" class="spades_scoreboardPlayerBar">\
                        <div id="scoreboardPlayerBarFillWest" class="spades_scoreboardPlayerBarFill"></div>\
                    </div>\
                    <div id="scoreboardPlayerScoreWest" class="spades_scoreboardPlayerScore">10</div>\
                </div>\
                <div id="spades_scoreboardPlayerRegionNorth" class="spades_scoreboardPlayerRegion">\
                    <div id="scoreboardPlayerNameNorth" class="spades_scoreboardPlayerName">North</div>\
                    <div id="scoreboardPlayerBarNorth" class="spades_scoreboardPlayerBar">\
                        <div id="scoreboardPlayerBarFillNorth" class="spdaes_scoreboardPlayerBarFill"></div>\
                    </div>\
                    <div id="scoreboardPlayerScoreNorth" class="spades_scoreboardPlayerScore">10</div>\
                </div>\
                <div id="spades_scoreboardPlayerRegionEast" class="spades_scoreboardPlayerRegion">\
                    <div id="scoreboardPlayerNameEast" class="spades_scoreboardPlayerName">East</div>\
                    <div id="scoreboardPlayerBarEast" class="spades_scoreboardPlayerBar">\
                        <div id="scoreboardPlayerBarFillEast" class="spades_scoreboardPlayerBarFill"></div>\
                    </div>\
                    <div id="scoreboardPlayerScoreEast" class="spades_scoreboardPlayerScore">10</div>\
                </div>\
                \
                <div id="spadesScoreboardRoundScoresRegion"></div>\
            </div>\
            <div id="spades_scoreboardDifficulty"></div>\
        </div>\
    </div>\
    \
    <div id="cards_region"></div>\
    \
    <div id="adView" align="center">\
    \
    </div>\
    \
    <div id="choose_bid_view">\
        <div id="choose_bid_title">Choose a bid:</div>\
        <div id="choose_bid_row_1">\
            <button class="choose_bid_button" id="choose_bid_button_0" onclick="game.OnChooseBidButtonPressed(0)">0</button>\
            <button class="choose_bid_button" id="choose_bid_button_1" onclick="game.OnChooseBidButtonPressed(1)">1</button>\
            <button class="choose_bid_button" id="choose_bid_button_2" onclick="game.OnChooseBidButtonPressed(2)">2</button>\
            <button class="choose_bid_button" id="choose_bid_button_3" onclick="game.OnChooseBidButtonPressed(3)">3</button>\
            <button class="choose_bid_button" id="choose_bid_button_4" onclick="game.OnChooseBidButtonPressed(4)">4</button>\
        </div>\
        <div id="choose_bid_row_2">\
            <button class="choose_bid_button" id="choose_bid_button_5" onclick="game.OnChooseBidButtonPressed(5)">5</button>\
            <button class="choose_bid_button" id="choose_bid_button_6" onclick="game.OnChooseBidButtonPressed(6)">6</button>\
            <button class="choose_bid_button" id="choose_bid_button_7" onclick="game.OnChooseBidButtonPressed(7)">7</button>\
            <button class="choose_bid_button" id="choose_bid_button_8" onclick="game.OnChooseBidButtonPressed(8)">8</button>\
        </div>\
        <div id="choose_bid_row_3">\
            <button class="choose_bid_button" id="choose_bid_button_9" onclick="game.OnChooseBidButtonPressed(9)">9</button>\
            <button class="choose_bid_button" id="choose_bid_button_10" onclick="game.OnChooseBidButtonPressed(10)">10</button>\
            <button class="choose_bid_button" id="choose_bid_button_11" onclick="game.OnChooseBidButtonPressed(11)">11</button>\
            <button class="choose_bid_button" id="choose_bid_button_12" onclick="game.OnChooseBidButtonPressed(12)">12</button>\
            <button class="choose_bid_button" id="choose_bid_button_13" onclick="game.OnChooseBidButtonPressed(13)">13</button>\
        </div>\
    </div>\
    \
    <div id="SpadesGameOverView">\
        <div id="SpadesGameOverResultText">You won!</div>\
        <div id="SpadesGameOverResultText2">vs the easy players</div>\
    </div>\
    \
    <button id="menu_button" onclick="MenuButtonPressed()">\
        <img src="shared/images/MenuButton.png" ondragstart="return false;" />\
    </button>\
    \
    <div id="menu_main" class="menu_view">\
        <button id="menu_main_close_button" class="close_button" onclick="menu_main_close_click()">X</button>\
        <button id="start_game_button" class="menu_button" onclick="game.ShowStartAGameMenu()">Start A Game</button>\
        <button id="settings_button" class="menu_button" onclick="game.ShowSettingsMenu()">Settings</button>\
        <button id="statistics_button" class="menu_button" onclick="game.ShowStatisticsMenu()">Statistics</button>\
        <button id="tutorial_button" class="menu_button" onclick="game.ShowTutorialMenu()">Tutorial</button>\
    </div>\
    \
    <div id="menu_start_a_game" class="menu_view">\
        <div id="menu_start_a_game_title" class="menu_card_title">Choose a difficulty level:</div>\
        <button id="menu_start_a_game_close_button" class="close_button" onclick="menu_card_close_click()">X</button>\
        <button id="easy_game_button" class="menu_button" onclick="game.menu_start_game_click(\'Easy\')">Easy</button>\
        <button id="standard_game_button" class="menu_button" onclick="game.menu_start_game_click(\'Standard\')">Standard</button>\
        <button id="pro_game_button" class="menu_button" onclick="game.menu_start_game_click(\'Pro\')">Pro</button>\
        <div style="text-align:center;font-size:12pt; pointer-events: none;">Cards are dealt randomly for all difficulty levels.</div>\
        <a id="menu_start_a_game_difficulties_link" onclick="game.ShowDifficultiesExplainedMenu()" href="#">Click here to learn how difficulties work</a>\
    </div>\
    \
    <div id="menu_difficulties_explained" class="menu_view">\
        <div id="menu_difficulties_explained_title" class="menu_card_title">Computer Difficulty Levels Explained</div>\
        <button id="menu_difficulties_explained_close_button" class="close_button" onclick="menu_card_close_click()">X</button>\
        <div id="menu_difficulties_explained_body">\
                For all three difficulty levels the cards are dealt completely at random to you and to the computer players.  Computer players are not given any special advantage and they do not know what cards are in your hand or in any other of the players\' hands.  The difference between the easy, standard, and pro players is the strategy used to choose their plays.  If you are finding that the computer is beating you, you will likely benefit from understanding how the computer chooses its next move.\
            <br>\
            <br>\
            <center>\
                <div style="font-size:16pt">\
                    <u>Easy Computer Strategy</u>\
                </div>\
            </center>\
            <table style="width:100%; text-align:left; font-size:12pt;">\
                <tr>\
                    <td valign="top" width="80pt">Bidding:</td>\
                    <td>Chooses a random bid between 1 and 4</td>\
                </tr>\
                <tr>\
                    <td valign="top" width="80pt">Playing:</td>\
                    <td>Chooses a random valid card</td>\
                </tr>\
            </table>\
            <br>\
            <center>\
                <div style="font-size:16pt">\
                    <u>Standard Computer Strategy</u>\
                </div>\
            </center>\
            <table style="width:100%; text-align:left; font-size:12pt;">\
                <tr>\
                    <td valign="top" width="80pt">Bidding:</td>\
                    <td>The computer determines a bid by simulating, for each possible bid (0 to 13), the outcome of one hundred random deals of the remaining unseen cards.  When running the simulations, each player is assumed to use the \'Standard\' playing strategy.  It then chooses the highest bid that resulted in an average number of tricks taken above the bid.</td>\
                </tr>\
                <tr>\
                    <td valign="top" width="80pt">Playing:</td>\
                <td>When the player has not yet achieved their bid, then they attempt to take the trick by leading with their highest card of the lead suit.  When they have no chance to take the trick, they play their lowest valid card.  When the player has already achieved their bid, they attempt to not take the trick by playing their lowest card.  If they must take the trick, they use their highest card.</td>\
                </tr>\
            </table>\
            <br>\
            <center>\
                <div style="font-size:16pt">\
                    <u>Pro Computer Strategy</u>\
                </div>\
            </center>\
            <table style="width:100%; text-align:left; font-size:12pt;">\
                <tr>\
                    <td valign="top" width="80pt">Bidding:</td>\
                    <td>The computer determines a bid by simulating, for each possible bid (0 to 13), the outcome of one hundred random deals of the remaining unseen cards.  When running the simulations, each player is assumed to use the \'Standard\' playing strategy.  It then chooses the highest bid that resulted in an average number of tricks taken above the bid.</td>\
                </tr>\
                <tr>\
                    <td valign="top" width="80pt">Playing:</td>\
                    <td>The computer determines the probability of taking the trick for each valid play in their hand.  Probabilities are determined by simulating 100 possible distributions of the unseen cards and assuming each player will choose their play using the \'Standard\' strategy.  If the player has already achieved their bid then they will play the least likely card to take the trick.  And if they have not yet achieved their bid then they will play the card that is most likely to take the trick.  If no card has more than a 50% chance of taking the trick, then the lowest probability card is played.</td>\
                </tr>\
            </table>\
        </div>\
    </div>\
    \
    <div id="menu_settings" class="menu_view">\
        <div id="menu_settings_title" class="menu_card_title">Settings</div>\
        <button id="menu_settings_close_button" class="close_button" onclick="menu_card_close_click()">X</button>\
        <table style="margin-left:5%; width:95%; margin-top:55pt; margin-bottom: 10px; text-align:left; font-size:16pt;">\
            <tr>\
                <td>Hint button on all levels:</td>\
                <td>\
                    <label class="switch">\
                        <input id="setting_hints_checkbox" type="checkbox" onclick="game.SettingHintsClicked(this)">\
                        <span class="slider round"></span>\
                    </label>\
                </td>\
            </tr>\
            <tr>\
                <td>Sand bagging penalty:</td>\
                <td>\
                    <label class="switch">\
                        <input id="setting_sandbaggingpenalty_checkbox" type="checkbox" onclick="game.SettingSandBaggingPenaltyClicked(this)">\
                        <span class="slider round"></span>\
                    </label>\
                </td>\
            </tr>\
            <tr>\
                <td>Winning score:</td>\
                <td>\
                    <select id="winning_score_dropdown" name="winning_score_dropdown" onchange="game.SettingWinningScoreChanged(this)">\
                        <option value="250">250</option>\
                        <option value="500">500</option>\
                        <option value="750">750</option>\
                        <option value="1000">1000</option>\
                    </select>\
                </td>\
            </tr>\
        </table>\
        <div style="margin-left:5%; width:95%; text-align:left; font-size:16pt;">Board Background:</div>\
        <div class="image-selector">\
            <input id="wood_light" type="radio" name="settings_boardbackground_selector" value="wood_light" onclick="BoardSelectorClick(this)"/>\
            <label class="board-selector-item background_wood_light" for="wood_light"></label>\
            <input id="wood" type="radio" name="settings_boardbackground_selector" value="wood" onclick="BoardSelectorClick(this)" />\
            <label class="board-selector-item background_wood" for="wood"></label>\
            <input id="wood_dark" type="radio" name="settings_boardbackground_selector" value="wood_dark" onclick="BoardSelectorClick(this)"/>\
            <label class="board-selector-item background_wood_dark" for="wood_dark"></label>\
            <input id="wood_gray" type="radio" name="settings_boardbackground_selector" value="wood_gray" onclick="BoardSelectorClick(this)"/>\
            <label class="board-selector-item background_wood_gray" for="wood_gray"></label>\
            <input id="green" type="radio" name="settings_boardbackground_selector" value="green" onclick="BoardSelectorClick(this)"/>\
            <label class="board-selector-item background_green" for="green"></label>\
            <input id="red" type="radio" name="settings_boardbackground_selector" value="red" onclick="BoardSelectorClick(this)" />\
            <label class="board-selector-item background_red" for="red"></label>\
            <input id="blue" type="radio" name="settings_boardbackground_selector" value="blue" onclick="BoardSelectorClick(this)" />\
            <label class="board-selector-item background_blue" for="blue"></label>\
        </div>\
        \
        <div style="margin-left:5%; width:95%; text-align:left; font-size:16pt;">Card Color:</div>\
        <div class="image-selector">\
            <input id="card_blue" type="radio" name="settings_card_color_selector" value="blue" onclick="CardSelectorClick(this)" />\
            <label class="card-selector-item card_back_blue" for="card_blue"></label>\
            <input id="card_red" type="radio" name="settings_card_color_selector" value="red" onclick="CardSelectorClick(this)" />\
            <label class="card-selector-item card_back_red" for="card_red"></label>\
            <input id="card_green" type="radio" name="settings_card_color_selector" value="green" onclick="CardSelectorClick(this)" />\
            <label class="card-selector-item card_back_green" for="card_green"></label>\
        </div>\
    </div>\
    \
    <div id="menu_statistics" class="menu_view">\
        <div id="menu_statistics_title" class="menu_card_title">Statistics</div>\
        <button id="menu_statistics_close_button" class="close_button" onclick="menu_card_close_click()">X</button>\
        \
        <table id="menu_statistics_table">\
            <tr>\
                <td></td>\
                <td class="menu_statistics_table_stat">Easy</td>\
                <td class="menu_statistics_table_stat">Standard</td>\
                <td class="menu_statistics_table_stat">Pro</td>\
                <td class="menu_statistics_table_stat_total">Total</td>\
            </tr>\
            <tr>\
                <td class="menu_statistics_table_category">Games Played</td>\
                <td class="menu_statistics_table_stat" id="menu_stat_games_played_Easy"></td>\
                <td class="menu_statistics_table_stat" id="menu_stat_games_played_Standard"></td>\
                <td class="menu_statistics_table_stat" id="menu_stat_games_played_Pro"></td>\
                <td class="menu_statistics_table_stat_total" id="menu_stat_games_played_Total">0</td>\
            </tr>\
            <tr>\
                <td class="menu_statistics_table_category">Wins</td>\
                <td class="menu_statistics_table_stat" id="menu_stat_wins_Easy"></td>\
                <td class="menu_statistics_table_stat" id="menu_stat_wins_Standard"></td>\
                <td class="menu_statistics_table_stat" id="menu_stat_wins_Pro"></td>\
                <td class="menu_statistics_table_stat_total" id="menu_stat_wins_Total">0</td>\
            </tr>\
            <tr>\
                <td class="menu_statistics_table_category">2nd Places</td>\
                <td class="menu_statistics_table_stat" id="menu_stat_2nd_Easy"></td>\
                <td class="menu_statistics_table_stat" id="menu_stat_2nd_Standard"></td>\
                <td class="menu_statistics_table_stat" id="menu_stat_2nd_Pro"></td>\
                <td class="menu_statistics_table_stat_total" id="menu_stat_2nd_Total">0</td>\
            </tr>\
            <tr>\
                <td class="menu_statistics_table_category">3rd Places</td>\
                <td class="menu_statistics_table_stat" id="menu_stat_3rd_Easy"></td>\
                <td class="menu_statistics_table_stat" id="menu_stat_3rd_Standard"></td>\
                <td class="menu_statistics_table_stat" id="menu_stat_3rd_Pro"></td>\
                <td class="menu_statistics_table_stat_total" id="menu_stat_3rd_Total">0</td>\
            </tr>\
            <tr>\
                <td class="menu_statistics_table_category">4th Places</td>\
                <td class="menu_statistics_table_stat" id="menu_stat_4th_Easy"></td>\
                <td class="menu_statistics_table_stat" id="menu_stat_4th_Standard"></td>\
                <td class="menu_statistics_table_stat" id="menu_stat_4th_Pro"></td>\
                <td class="menu_statistics_table_stat_total" id="menu_stat_4th_Total">0</td>\
            </tr>\
            <tr>\
                <td class="menu_statistics_table_category">Win Percentage</td>\
                <td class="menu_statistics_table_stat" id="menu_stat_win_percent_Easy"></td>\
                <td class="menu_statistics_table_stat" id="menu_stat_win_percent_Standard"></td>\
                <td class="menu_statistics_table_stat" id="menu_stat_win_percent_Pro"></td>\
                <td class="menu_statistics_table_stat_total" id="menu_stat_win_percent_Total"></td>\
            </tr>\
        </table>\
        <table id="menu_statistics_buttons_table">\
            <tr>\
                <td>\
                    <center>\
                        <button id="menu_statistics_reset_button" onclick="game.ResetStatisticsButtonClick()">Reset\
                            <br>Statistics</button>\
                    </center>\
                </td>\
            </tr>\
        </table>\
    </div>\
    \
    <div id="menu_tutorial" class="menu_view">\
        <div id="menu_tutorial_title" class="menu_card_title">Tutorial</div>\
        <button id="menu_tutorial_close_button" class="close_button" onclick="menu_card_close_click()">X</button>\
        <div id="menu_tutorial_body">\
            Spades is a trick taking card game.  The object of each round is to take at least the number of tricks that you bid before the round begins.  The first player to reach the winning score (default 500) wins the game.  The spade suit is always trump.\
            <br>\
            <br>\
            <center>\
                <div style="font-size:16pt">\
                    <u>Gameplay</u>\
                </div>\
            </center>\
            Each game is played in rounds and each round consists of a dealing stage, a bidding stage, a trick taking stage, and a scoring stage.\
            <br>\
            <br>\
            <center>\
                <div style="font-size:16pt">\
                    <u>Dealing</u>\
                </div>\
            </center>\
            When the game starts, each player is randomly dealt 13 cards.  All cards are dealt to all players completely at random.  No special dealing is used to handicap or improve the hands for the computer players.  You are the first dealer and then the deal moves to the left after each round.\
            <br>\
            <br>\
            <center>\
                <div style="font-size:16pt">\
                    <u>Bidding</u>\
                </div>\
            </center>\
            Starting with the player to the left of the dealer, each player bids on the minimum number of tricks that they expect to take for the round.  A bid of zero is called a \'nil bid\' and results in a score of 100 if succesful and a score of -100 if any tricks are taken.\
            <br>\
            <br>\
            <center>\
                <div style="font-size:16pt">\
                    <u>Trick Taking</u>\
                </div>\
            </center>\
            The player on the dealer\'s left makes the opening lead by playing a single card of their choice.  Players in clockwise fashion then play a card of their choice; they must follow suit if they can, otherwise they may play any card including a trump spade.  A player may not lead spades until a spade has been played to trump another trick.\
            <br>\
            <br>\
            The trick is won or taken by the player who played the highest card of the led suit, or if trumps were played, the highest trump card wins.  The player who wins any given trick leads next.  Play continues until all players have exhausted their hands.\
            <br>\
            <br>\
            <center>\
                <div style="font-size:16pt">\
                    <u>Scoring</u>\
                </div>\
            </center>\
            Once a round is completed, each player is assigned a score based on whether they achieved their bid.  If the player took at least the number of tricks that they bid then they are awarded 10 points for each trick that they bid and 1 point for each trick over their bid.  Tricks taken that are more than the bid are called \'bags\'.  If a player does not take at least the number of tricks that they bid then they score zero points.  In the case where a user bid nil, if they take no tricks then they are assigned 100 points, but if they take at least one trick then they lose 100 points.\
            <br>\
            <br>\
            An optional \'bagging\' rule is designed to penalize players for underestimating the number of tricks they will take.  When this setting is turned on, players are assigned a 100 point penalty when they accumulate 10 bags.\
            <br>\
        </div>\
    </div>'

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

    var cardsRegion = document.getElementById('cards_region');
    cardsRegion.onmousedown = dragMouseDown;

    // template for card
    var cardElement = document.createElement("div");
    cardElement.className = "card";
    var raiseContainer = document.createElement("div");
    raiseContainer.className = "raiseContainer";
    cardElement.appendChild(raiseContainer);
    var flipContainer = document.createElement("div");
    flipContainer.className = "cardFlipContainer";
    raiseContainer.appendChild(flipContainer);
    var shadow = document.createElement("div");
    shadow.className = "cardShadow";
    flipContainer.appendChild(shadow);
    var back = document.createElement("div");
    back.className = "cardBack";
    flipContainer.appendChild(back);
    var front = document.createElement("div");
    front.className = "cardFront";
    flipContainer.appendChild(front);
    var frontShade = document.createElement("div");
    frontShade.className = "cardFrontShade";
    front.appendChild(frontShade);
    var cardHighlight = document.createElement("div");
    cardHighlight.className = "cardFrontHighlight";
    front.appendChild(cardHighlight);

    var cardBackURI = "url('shared/images/card_back_" + GetSetting('setting_card_color') + ".jpg')";

    for (var i = 0; i < cards.length; i++) {
        var newCard = cardElement.cloneNode(true);
        var card = cards[i];
        card.cardView = newCard;
        card.cardView.isSlidUp = false;
        card.cardView.isFlippedUp = false;
        newCard.id = card.id;
        newCard.card = card;
        newCard.positionIndex = i;
        newCard.getElementsByClassName('cardBack')[0].style.backgroundImage = cardBackURI;
        newCard.getElementsByClassName('cardFront')[0].style.backgroundImage = card.image;
        newCard.style.visibility = "hidden";
        cards_region.appendChild(newCard);
    }

    this.GetCardFromString = function (cardString) {
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].id == cardString) {
                return cards[i];
            }
        }
        return null;
    }

    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    function dragMouseDown(e) {
        e = e || window.event;

        if (!e.target.classList.contains('card')) {
            return;
        }

        scoreboard.Contract();

        if (game.currentMoveStage === 'ChoosingTrickCard') {
            autoPlayBoundaryY = GetHandCardLocation(0,6,13)[1] - cardLoweredHeight * 0.4;
            
            var tappedCardView = e.target;
            if (tappedCardView.isClickable) {
                currentDraggedCardView = tappedCardView;
                currentDraggedCardView.style.transition = "none";
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
                currentDraggedCardView.startTime = Date.now();
                currentDraggedCardView.startPosition = [e.clientX, e.clientY];
                raiseCard(currentDraggedCardView);
            }
        } else {
            return;
        }
    }

    function elementDrag(e) {
        e = e || window.event;
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        currentDraggedCardView.style.top = (currentDraggedCardView.offsetTop - pos2) + "px";
        currentDraggedCardView.style.left = (currentDraggedCardView.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse released
        cardTouchFinished();
        document.onmouseup = null;
        document.onmousemove = null;
    }

    function cardTouchFinished() {    
        // Check for tap
        var distX = pos3 - currentDraggedCardView.startPosition[0];
        var distY = pos4 - currentDraggedCardView.startPosition[1];
        var distance = Math.sqrt(distX * distX + distY * distY);
        var elapsed = Date.now() - currentDraggedCardView.startTime;
        var tapped = elapsed < 500 && distance < 10;

        if (game.currentMoveStage === 'ChoosingTrickCard') {
            if (tapped) {
                game.DropCardInTrickPile();
            } else {
                if (currentDraggedCardView.offsetTop < autoPlayBoundaryY) {
                    game.DropCardInTrickPile();
                } else {
                    AnimatePlayerHandCardsIntoPosition('South', "0.3s");
                }
            }
        }
         
        lowerCard(currentDraggedCardView);
    }

    /**
    * detect IE
    * returns version of IE or false, if browser is not Internet Explorer
    */
    function detectIE() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            //return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
            return true;
        }
    
        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            //return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
            return true;
        }
    
        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            //return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
            return true;
        }
    
        // other browser
        return false;
    }

    var isIE = detectIE();

    function flipUpCard(cardView) {
        if (cardView.isFlippedUp) {
            return;
        }

        cardView.isFlippedUp = true;
        var raiseContainer = cardView.firstChild;
        var flipContainer = raiseContainer.firstChild;
        var cardShadow = flipContainer.children[0];
        var cardBack = flipContainer.children[1];
        var cardFront = flipContainer.children[2];
        var ease = "0.7s ease-out";
        flipContainer.style.transition = ease;
        cardShadow.style.transition = ease;
        cardBack.style.transition = ease;
        cardFront.style.transition = ease;
        raiseContainer.style.transition = ease;
        raiseContainer.style.transform = "scale(1.15)";
        
        if (isIE) {
            cardFront.style.transform = "translate3d(0px,0px,1px) perspective(500px) rotateY(0deg)";
            cardBack.style.transform = "translate3d(0px,0px,1px) perspective(500px) rotateY(-180deg)";
            cardShadow.style.transform = "translate3d(20px,20px,0px) perspective(500px) rotateY(0deg)";
            setTimeout(function () {
                raiseContainer.style.transform = "scale(1)";
                cardShadow.style.transform = "translate3d(0px,0px,0px) perspective(500px) rotateY(0deg)";
            }, 400);
        } else {
            flipContainer.style.transform = "perspective(500px) rotateY(180deg)";
            cardShadow.style.transform = "translate3d(-20px,20px,0px)";
            setTimeout(function () {
                raiseContainer.style.transform = "scale(1)";
                cardShadow.style.transform = "translate3d(0px,0px,0px)";
            }, 400);
        }
    }

    function flipDownCard(cardView, animate) {
        if (!cardView.isFlippedUp) {
            return;
        }

        cardView.isFlippedUp = false;
        var raiseContainer = cardView.firstChild;
        var flipContainer = raiseContainer.firstChild;
        var cardShadow = flipContainer.children[0];
        var cardBack = flipContainer.children[1];
        var cardFront = flipContainer.children[2];
        var ease = animate ? "0.7s ease-out" : "none";
        flipContainer.style.transition = ease;
        cardShadow.style.transition = ease;
        cardBack.style.transition = ease;
        cardFront.style.transition = ease;
        raiseContainer.style.transition = ease;
        raiseContainer.style.transform = "scale(1.15)";
        
        if (animate) {
            if (isIE) {
                cardFront.style.transform = "translate3d(0px,0px,1px) perspective(500px) rotateY(180deg)";
                cardBack.style.transform = "translate3d(0px,0px,1px) perspective(500px) rotateY(0deg)";
                cardShadow.style.transform = "translate3d(20px,20px,0px) perspective(500px) rotateY(180deg)";
                setTimeout(function () {
                    raiseContainer.style.transform = "scale(1)";
                    cardShadow.style.transform = "translate3d(0px,0px,0px) perspective(500px) rotateY(180deg)";
                }, 400);
            } else {
                flipContainer.style.transform = "perspective(500px) rotateY(0deg)";
                cardShadow.style.transform = "translate3d(-20px,20px,0px)";
                setTimeout(function () {
                    raiseContainer.style.transform = "scale(1)";
                    cardShadow.style.transform = "translate3d(0px,0px,0px)";
                }, 400);
            }
        } else {
            if (isIE) {
                cardFront.style.transform = "translate3d(0px,0px,1px) perspective(500px) rotateY(180deg)";
                cardBack.style.transform = "translate3d(0px,0px,1px) perspective(500px) rotateY(0deg)";
                cardShadow.style.transform = "translate3d(20px,20px,0px) perspective(500px) rotateY(180deg)";
                raiseContainer.style.transform = "scale(1)";
                cardShadow.style.transform = "translate3d(0px,0px,0px) perspective(500px) rotateY(180deg)";
            } else {
                flipContainer.style.transform = "perspective(500px) rotateY(0deg)";
                cardShadow.style.transform = "translate3d(-20px,20px,0px)";
                raiseContainer.style.transform = "scale(1)";
                cardShadow.style.transform = "translate3d(0px,0px,0px)";
            }         
        }
    }

    function raiseCard(cardView) {
        var raiseContainer = cardView.firstChild;
        var flipContainer = raiseContainer.firstChild;
        var cardShadow = flipContainer.children[0];
        var cardBack = flipContainer.children[1];
        var cardFront = flipContainer.children[2];
        var ease = "0.1s linear";
        raiseContainer.style.transition = ease;
        raiseContainer.style.transform = "scale(1.15)";
        cardShadow.style.transition = ease;
        if (isIE) {
            cardShadow.style.transform = "translate3d(20px,20px,0px) perspective(500px) rotateY(0deg)";
        } else {
            cardShadow.style.transform = "translate3d(-20px,20px,0px)";
        }
    }

    function lowerCard(cardView) {
        var raiseContainer = cardView.firstChild;
        var flipContainer = raiseContainer.firstChild;
        var cardShadow = flipContainer.children[0];
        var cardBack = flipContainer.children[1];
        var cardFront = flipContainer.children[2];
        var ease = "0.1s linear";
        raiseContainer.style.transition = ease;
        raiseContainer.style.transform = "scale(1)";
        cardShadow.style.transition = ease;
        if (isIE) {
            cardShadow.style.transform = "translate3d(0px,0px,0px) perspective(500px) rotateY(0deg)";
        } else {
            cardShadow.style.transform = "translate3d(0px,0px,0px)";
        }
    }

    function ShadeCard(cardView) {
        var raiseContainer = cardView.firstChild;
        var flipContainer = raiseContainer.firstChild;
        var cardFront = flipContainer.children[2];
        var shade = cardFront.firstChild;
        with (shade.style) {
            transition = "0.3s linear";
            opacity = 0.3;
        }
    }

    function UnshadeCard(cardView) {
        var raiseContainer = cardView.firstChild;
        var flipContainer = raiseContainer.firstChild;
        var cardFront = flipContainer.children[2];
        var shade = cardFront.firstChild;
        with (shade.style) {
            transition = "0.3s linear";
            opacity = 0;
        }
    }

    function BumpCards(cards, delay) {
        setTimeout(function() {
            for (var i=0; i<cards.length; i++) {
                BumpCard(cards[i].cardView);
            }    
        }, delay);
    }

    function BumpCard(cardView) {
        var raiseContainer = cardView.firstChild;
        raiseContainer.addEventListener("animationend", function() {
            raiseContainer.classList.remove('bump');
        });
        raiseContainer.classList.add('bump');
    }

    function FlashHighlightCardView(cardView) {
        var raiseContainer = cardView.firstChild;
        var flipContainer = raiseContainer.firstChild;
        var cardFront = flipContainer.children[2];
        var flashHighlight = cardFront.children[1];
        flashHighlight.addEventListener("animationend", function() {
            flashHighlight.classList.remove('flashHighlight');
        });
        flashHighlight.classList.add('flashHighlight');
    }

    function TwistCard(cardView) {
        cardView.addEventListener("animationend", function() {
            cardView.classList.remove('twist');
        });
        cardView.classList.add('twist');
    }

    function ShakeCard(cardView) {
        cardView.addEventListener("animationend", function() {
            cardView.classList.remove('shake');
        });
        cardView.classList.add('shake');
    }

    function GetHandCardLocation(position, index, cardCount) {
        var cardWidthHalf = 115*0.5;
        var cardHeightHalf = 162*0.5;
        switch (position)
        {
            case 'West':
                var firstLeft = -40;
                var lastLeft = -40;
                var firstTop = 250;
                var lastTop = gameContainer.innerHeight-300;
                var handWidth = lastTop - firstTop;
                var cardSpacing = handWidth/cardCount;
                var curTop = firstTop;
                var maxSpacing = 30;
                if (cardSpacing > maxSpacing) {
                    cardSpacing = maxSpacing;
                    curTop = firstTop + (handWidth - cardSpacing*cardCount)*0.5;
                }
                curTop = curTop + index*cardSpacing;
                curLeft = (firstLeft + lastLeft)*0.5;
                return [curLeft-cardWidthHalf, curTop-cardHeightHalf, 90];
            case 'North':
                var firstLeft = gameContainer.innerWidth*0.5 - 120;
                var lastLeft = gameContainer.innerWidth*0.5 + 120;
                var firstTop = -40;
                var lastTop = -40;
                var handWidth = lastLeft - firstLeft;
                var cardSpacing = handWidth/(cardCount-1);
                var curLeft = firstLeft;
                var maxSpacing = 30;
                if (cardSpacing > maxSpacing) {
                    cardSpacing = maxSpacing;
                    curLeft = firstLeft + (handWidth - cardSpacing*(cardCount-1))*0.5;
                }
                var curTop = firstTop;
                curLeft = curLeft + index*cardSpacing;
                return [curLeft-cardWidthHalf, curTop-cardHeightHalf, 0];
            case 'East':
                var firstLeft = gameContainer.innerWidth+40;
                var lastLeft = gameContainer.innerWidth+40;
                var firstTop = 250;
                var lastTop = gameContainer.innerHeight - 300;
                var handWidth = lastTop - firstTop;
                var cardSpacing = handWidth/cardCount;
                var curTop = firstTop;
                var maxSpacing = 30;
                if (cardSpacing > maxSpacing) {
                    cardSpacing = maxSpacing;
                    curTop = firstTop + (handWidth - cardSpacing*cardCount)*0.5;
                }
                curTop = curTop + index*cardSpacing;
                curLeft = firstLeft;
                return [curLeft-cardWidthHalf, curTop-cardHeightHalf, -90];
            default:
                var firstLeft = 150;
                var lastLeft = gameContainer.innerWidth-150;
                var firstTop = gameContainer.innerHeight-180;
                var lastTop = gameContainer.innerHeight-180;
                var handWidth = lastLeft-firstLeft;
                var cardSpacing = handWidth/(cardCount-1);
                var maxSpacing = cardWidthHalf;
                if (cardSpacing > maxSpacing) {
                    cardSpacing = maxSpacing;
                    handWidth = cardSpacing*(cardCount-1);
                    firstLeft = (gameContainer.innerWidth - handWidth)*0.5;
                    lastLeft = (gameContainer.innerWidth + handWidth)*0.5;
                }
                var curLeft = firstLeft + index*cardSpacing;
                var percent = handWidth > 0 ? (curLeft - firstLeft)/handWidth : 0.5;
                var radius = 2000;
                var distanceFromCenter = handWidth*(0.5 - percent);
                var curveHeight = Math.sqrt(radius*radius-distanceFromCenter*distanceFromCenter) - Math.sqrt(radius*radius - handWidth*0.5*handWidth*0.5); 
                var curveRotation = Math.asin(-distanceFromCenter/radius)*180/Math.PI;
                var curTop = firstTop - curveHeight;
                return [curLeft-cardWidthHalf, curTop-cardHeightHalf, curveRotation];
        }
    }

    this.InitializeGame = function(difficulty) {
        // Game properties
        this.skillLevel = difficulty;
        this.winningScore = Number(this.settings.GetSetting('setting_winning_score'));
        this.cardsPlayedThisRound = [];
        this.trickCards = [];
        this.roundNumber = 0;
        this.dealerIndex = 0;
        this.leadIndex = 0;
        this.turnIndex = 0;
        this.isSpadesBroken = false;
        this.currentMoveStage = 'None';
        this.roundScores = [];

        this.players = [];
        var player = new SpadesPlayer();
        player.Initialize('You', true, 'Pro', 'South');
        this.players.push(player);
        switch(difficulty)
        {
            case 'Easy':
            {
                player = new SpadesPlayer();
                player.Initialize('Conrad', false, difficulty, 'West');
                this.players.push(player);
                player = new SpadesPlayer();
                player.Initialize('Louisa', false, difficulty, 'North');
                this.players.push(player);
                player = new SpadesPlayer();
                player.Initialize('Davina', false, difficulty, 'East');
                this.players.push(player);
            }
            break;
            case 'Standard':
            {
                player = new SpadesPlayer();
                player.Initialize('Catalina', false, difficulty, 'West');
                this.players.push(player);
                player = new SpadesPlayer();
                player.Initialize('Amelia', false, difficulty, 'North');
                this.players.push(player);
                player = new SpadesPlayer();
                player.Initialize('Seward', false, difficulty, 'East');
                this.players.push(player);
            }
            break;
            default:
            {
                player = new SpadesPlayer();
                player.Initialize('Charlotte', false, difficulty, 'West');
                this.players.push(player);
                player = new SpadesPlayer();
                player.Initialize('Dixon', false, difficulty, 'North');
                this.players.push(player);
                player = new SpadesPlayer();
                player.Initialize('Isabella', false, difficulty, 'East');
                this.players.push(player);
            }
            break;
        }
    }

    this.StartAGame = function (difficulty) {

        this.InitializeGame(difficulty);        

        // Clean up all cards and messages
        for (var i = 0; i < cards.length; i++) {
            var el = cards[i].cardView;
            flipDownCard(el, false);
            UnshadeCard(el);
            with (el.style) {
                transition = "none";
                transform = "none";
            }
        }
        HideAllMessages();

        scoreboard.Initialize();

        this.CreatePlayerInfoViews();
        
        this.AnimateDealCardsForRound();
    }

    this.CreatePlayerInfoViews = function() {
        for (var i=0; i<4; i++) {
            var playerName = document.getElementById('player_name_' + this.players[i].playerPosition);
            playerName.positionFunction = "GetPlayerNamePosition('" + this.players[i].playerPosition + "')";
            playerName.style.transition = "none";
            var position = eval(playerName.positionFunction);
            playerName.style.left = position[0] + 'px';
            playerName.style.top = position[1] + 'px';
            playerName.innerText = this.players[i].name;

            var playerScore = document.getElementById('player_score_' + this.players[i].playerPosition);
            playerScore.positionFunction = "GetPlayerScorePosition('" + this.players[i].playerPosition + "')";
            position = eval(playerScore.positionFunction);
            playerScore.style.left = position[0] + 'px';
            playerScore.style.top = position[1] + 'px';
            playerScore.innerText = "";
        }
        setTimeout(function () {
            for (var i=0; i<4; i++) {
                var playerName = document.getElementById('player_name_' + game.players[i].playerPosition);
                playerName.style.transition = "1s linear";
                playerName.style.visibility = "visible";
                playerName.style.opacity = 1;
                var playerScore = document.getElementById('player_score_' + game.players[i].playerPosition);
                playerScore.style.transition = "1s linear";
                playerScore.style.visibility = "visible";
                playerScore.style.opacity = 1;
            }
        }, 1000);
    }

    this.ResetPlayerRoundScores = function() {
        for (var i=0; i<4; i++) {
            var playerScore = document.getElementById('player_score_' + this.players[i].playerPosition);
            playerScore.positionFunction = "GetPlayerScorePosition('" + this.players[i].playerPosition + "')";
            position = eval(playerScore.positionFunction);
            playerScore.style.left = position[0] + 'px';
            playerScore.style.top = position[1] + 'px';
            playerScore.innerText = "";
        
            if (i===0) {
                var playerName = document.getElementById('player_name_' + this.players[i].playerPosition);
                playerName.style.transition = "0.2s linear";
                var pos = eval(playerName.positionFunction);
                playerName.style.left = pos[0] + 'px';
                playerName.style.top = pos[1] + 'px';
            }
        }
    }

    function GetPlayerNamePosition(playerPosition) {
        switch (playerPosition) {
            case 'South':
                if (game.players[0].currentRoundBid >= 0) {
                    return [gameContainer.innerWidth*0.5-220,gameContainer.innerHeight-350];
                } else {
                    return [gameContainer.innerWidth*0.5-220,gameContainer.innerHeight-330];
                }
            case 'West':
                return [40,250];
            case 'North':
                return [gameContainer.innerWidth*0.5 + 160,30];
            default:
                return [gameContainer.innerWidth-140,250];
        }
    }

    function GetPlayerScorePosition(playerPosition) {
        switch (playerPosition) {
            case 'South':
                return [gameContainer.innerWidth*0.5-220,gameContainer.innerHeight-330];
            case 'West':
                return [50,270];
            case 'North':
                return [gameContainer.innerWidth*0.5 + 160,50];
            default:
                return [gameContainer.innerWidth-150,270];
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

    function AnimatePlayerHandCardsIntoPosition(playerPosition, duration) {
        var player;
        var flipUp = false;
        switch (playerPosition) {
            case 'South':
                player = game.players[0];
                flipUp = true;
                break;
            case 'West':
                player = game.players[1];
                break;
            case 'North':
                player = game.players[2];
                break;
            default:
                player = game.players[3];
                break;
        }
        
        for (var i=0; i<player.cards.length; i++) {
            var cardView = player.cards[i].cardView;
            if (flipUp) {
                flipUpCard(cardView);
            } else {
                flipDownCard(cardView, true);
            }
            cardView.positionIndex = i;
            cardView.positionFunction = "GetHandCardLocation('" + playerPosition + "', " + i + ", " + player.cards.length + ")";
            cardView.style.zIndex = i + 100;
            with (cardView.style) {
                var aposition = eval(cardView.positionFunction);
                transition =  duration + " ease-out";
                transitionDelay = '0ms';
                left = aposition[0] + "px";
                top = aposition[1] + "px";
                transform = 'rotate(' + aposition[2] + 'deg)';
            }
        }
    }

    this.AnimateDealCardsForRound = function() {
        this.roundNumber = this.roundNumber + 1;
        this.trickCards = [];
        for (var i=0; i<this.players.length; i++) {
            var player = this.players[i];
            player.cards = [];
            player.currentRoundBid = -1;
            player.currentRoundTricksTaken = -1;
            player.isShownVoidInSuit = [false,false,false,false];
        }

        this.ResetPlayerRoundScores();

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

        // Animate the cards dealt to each player
        // WEST
        var player = this.players[1];
        for (var i=0; i<player.cards.length; i++) {
            var cardLocation = GetHandCardLocation('West', i, player.cards.length);
            var startLeft = -300;
            var endLeft = cardLocation[0];
            var startTop = cardLocation[1];
            var endtop = cardLocation[1];
            var cardView = player.cards[i].cardView;
            flipDownCard(cardView, false);
            lowerCard(cardView);
            cardView.positionIndex = i;
            cardView.isClickable = false;
            with (cardView.style) {
                transition = "none";
                animationDelay = "";
                left = startLeft + "px";
                top = startTop + "px";
                zIndex = i + 1;
                visibility = "visible";
            }
            cardView.positionFunction = "GetHandCardLocation('West', " + i + ", " + player.cards.length + ")";
            cardView.style.zIndex = i + 100;
        }
        setTimeout(function () {
            var player = game.players[1];
            for (var i=0; i<player.cards.length; i++) {
                var cardView = player.cards[i].cardView;
                var position = eval(cardView.positionFunction);
                cardView.style.transition =  "0.3s ease-out";
                cardView.style.transitionDelay = i * 80 + 'ms';
                cardView.style.left = position[0] + "px";
                cardView.style.top = position[1] + "px";
                cardView.style.transform = 'rotate(' + position[2] + 'deg)';
            }
        }, 50);

        // North
        var player = this.players[2];
        for (var i=0; i<player.cards.length; i++) {
            var cardLocation = GetHandCardLocation('North', i, player.cards.length);
            var startLeft = cardLocation[0];
            var endLeft = cardLocation[0];
            var startTop = -300;
            var endtop = cardLocation[1];
            var cardView = player.cards[i].cardView;
            flipDownCard(cardView, false);
            lowerCard(cardView);
            cardView.positionIndex = i;
            cardView.isClickable = false;
            with (cardView.style) {
                transition = "none";
                animationDelay = "";
                left = startLeft + "px";
                top = startTop + "px";
                zIndex = i + 1;
                visibility = "visible";
            }
            cardView.positionFunction = "GetHandCardLocation('North', " + i + ", " + player.cards.length + ")";
            cardView.style.zIndex = i + 100;
        }
        setTimeout(function () {
            var player = game.players[2];
            for (var i=0; i<player.cards.length; i++) {
                var cardView = player.cards[i].cardView;
                var position = eval(cardView.positionFunction);
                cardView.style.transition =  "0.3s ease-out";
                cardView.style.transitionDelay = i * 80 + 'ms';
                cardView.style.left = position[0] + "px";
                cardView.style.top = position[1] + "px";
                cardView.style.transform = 'rotate(' + position[2] + 'deg)';
            }
        }, 50);

        // East
        var player = this.players[3];
        for (var i=0; i<player.cards.length; i++) {
            var cardLocation = GetHandCardLocation('East', i, player.cards.length);
            var startLeft = gameContainer.innerWidth + 300;
            var endLeft = cardLocation[0];
            var startTop = cardLocation[1];
            var endtop = cardLocation[1];
            var cardView = player.cards[i].cardView;
            flipDownCard(cardView, false);
            lowerCard(cardView);
            cardView.positionIndex = i;
            cardView.isClickable = false;
            with (cardView.style) {
                transition = "none";
                animationDelay = "";
                left = startLeft + "px";
                top = startTop + "px";
                zIndex = i + 1;
                visibility = "visible";
            }
            cardView.positionFunction = "GetHandCardLocation('East', " + i + ", " + player.cards.length + ")";
            cardView.style.zIndex = i + 100;
        }
        setTimeout(function () {
            var player = game.players[3];
            for (var i=0; i<player.cards.length; i++) {
                var cardView = player.cards[i].cardView;
                var position = eval(cardView.positionFunction);
                cardView.style.transition =  "0.3s ease-out";
                cardView.style.transitionDelay = i * 80 + 'ms';
                cardView.style.left = position[0] + "px";
                cardView.style.top = position[1] + "px";
                cardView.style.transform = 'rotate(' + position[2] + 'deg)';
            }
        }, 50);

        // South
        var player = this.players[0];
        for (var i=0; i<player.cards.length; i++) {
            var cardLocation = GetHandCardLocation('South', i, player.cards.length);
            var startLeft = gameContainer.innerWidth*0.5;
            var endLeft = cardLocation[0];
            var startTop = gameContainer.innerHeight + 100;
            var endtop = cardLocation[1];
            var cardView = player.cards[i].cardView;
            flipDownCard(cardView, false);
            lowerCard(cardView);
            cardView.positionIndex = i;
            cardView.isClickable = true;
            with (cardView.style) {
                transition = "none";
                animationDelay = "";
                left = startLeft + "px";
                top = startTop + "px";
                zIndex = i + 1;
                visibility = "visible";
            }
            cardView.positionFunction = "GetHandCardLocation('South', " + i + ", " + player.cards.length + ")";
            cardView.style.zIndex = i + 100;
        }
        setTimeout(function () {
            var player = game.players[0];
            for (var i=0; i<player.cards.length; i++) {
                var cardView = player.cards[i].cardView;
                var position = eval(cardView.positionFunction);
                cardView.style.transition =  "0.3s ease-out";
                cardView.style.transitionDelay = i * 80 + 'ms';
                cardView.style.left = position[0] + "px";
                cardView.style.top = position[1] + "px";
                cardView.style.transform = 'rotate(' + position[2] + 'deg)';
                setTimeout(flipUpCard, i * 80, cardView);
            }
            game.currentMoveStage = "ChoosingBids";
        }, 50);
        
        setTimeout(function() {
            bidsReceived = 0;
            currentBiddingPlayerIndex = (game.dealerIndex + 1)%4;
            game.leadIndex = currentBiddingPlayerIndex;
            var player = game.players[currentBiddingPlayerIndex];
            player.ChooseBid();
        
        }, 500);
    }

    var bidsReceived = 0;
    var currentBiddingPlayerIndex = 0;
    
    this.PromptPlayerToChooseBid = function() {

        if (this.skillLevel === 'Easy' || this.settings.GetSetting('setting_hints')) {
            ShowHintButton(0);
        }

        var el = document.getElementById('choose_bid_view');
        with(el.style) {
            WebkitTransition = MozTransition = OTransition = msTransition = "0.5s linear";
            opacity = 1;
            visibility = "visible";
            pointerEvents = "auto";
        }
    }

    this.OnChooseBidButtonPressed = function(bid) {
        var player = game.players[0];
        player.currentRoundBid = bid;
        this.OnPlayerFinishedChoosingBid(player);
    }

    this.OnPlayerFinishedChoosingBid = function(player) {
        if (player.isHuman) {
            var el = document.getElementById('choose_bid_view');
            with(el.style) {
                WebkitTransition = MozTransition = OTransition = msTransition = "0.4s ease-in";
                opacity = 0;
                pointerEvents = "none";
            }
        }

        bidsReceived = bidsReceived + 1;
        if (bidsReceived == 4) {
            for (var i=0; i<4; i++) {
                var player = game.players[i];
                player.currentRoundTricksTaken = 0;
                UpdatePlayerRoundScore(player);
            }

            setTimeout(function(aGame) {
                aGame.StartTrickTaking();
            }, 1000, this);

        } else {
            UpdatePlayerRoundScore(player);
            currentBiddingPlayerIndex = currentBiddingPlayerIndex + 1;
            var player = game.players[currentBiddingPlayerIndex%4];
            player.ChooseBid();
        }
    }

    function UpdatePlayerRoundScore(player) {
        var playerScore = document.getElementById('player_score_' + player.playerPosition);
        playerScore.positionFunction = "GetPlayerScorePosition('" + player.playerPosition + "')";
        position = eval(playerScore.positionFunction);
        playerScore.style.left = position[0] + 'px';
        playerScore.style.top = position[1] + 'px';
        if (player.currentRoundTricksTaken < 0) {
            playerScore.innerText = "Bid: " + player.currentRoundBid;        
        } else {
            playerScore.innerText = player.currentRoundTricksTaken + "/" + player.currentRoundBid;        
        }
        
        if (player.isHuman) {
            var playerName = document.getElementById('player_name_South');
            playerName.style.transition = "0.2s linear";
            var pos = eval(playerName.positionFunction);
            playerName.style.left = pos[0] + 'px';
            playerName.style.top = pos[1] + 'px';
        }
    }
    
    function GetHintButtonPosition() {
        var left = gameContainer.innerWidth*0.5 + 250;
        if (left > gameContainer.innerWidth - 130) {
            left = gameContainer.innerWidth - 130;
        }
        return [left, gameContainer.innerHeight-340];
    }

    function ShowHintButton(delay) {
        var hintButton = document.getElementById('spades_hint_button');
        hintButton.positionFunction = "GetHintButtonPosition()";
        hintButton.style.transition = "none";
        var loc = eval(hintButton.positionFunction);
        hintButton.style.left = loc[0] + 'px';
        hintButton.style.top = loc[1] + 'px';
        hintButton.style.visibility = 'visible';
        hintButton.style.pointerEvents = "auto";
        setTimeout(function () {
            hintButton.style.transition = "0.5s linear";
            hintButton.style.opacity = 1;
            setTimeout(function() {
                hintButton.style.transition = "none";
            }, 600);
        }, delay);
    }

    function HideHintButton() {
        var hintButton = document.getElementById('spades_hint_button');
        hintButton.style.opacity = 0;
        hintButton.style.pointerEvents = "none";
    }

    this.OnHintButtonClick = function () {
        this.BumpHintCards();
    }

    this.BumpHintCards = function() {
        var optimalCards = [];
        if (this.currentMoveStage === 'ChoosingBids') {
            var player = this.players[0];
            var bid = player.FindBestBid(game);
            var button = document.getElementById('choose_bid_button_' + bid);
            
            with (button.style) {
                transition = 'none';
                transform = 'scale(0)';
            }   
            setTimeout(function() {
                with (button.style) {
                    transition = "0.5s cubic-bezier(0.175, 0.885, 0.320, 1.275)";
                    transform = 'scale(1)';
                }
            }, 100); 
            
        } else if (this.currentMoveStage === 'ChoosingTrickCard') {
            var player = this.players[0];
            var bestCard = player.FindBestPlayingCard(game, true);
            optimalCards.push(bestCard);
        }

        BumpCards(optimalCards, 0);
    }

    this.StartTrickTaking = function() {
        
        this.turnIndex = this.dealerIndex + 1;
        var nextPlayer = this.players[this.turnIndex%4];
        nextPlayer.ChoosePlayCard();
    }

    this.PromptPlayerToPlayCard = function() {
        var playerPrompt = document.getElementById('spades_player_play_prompt');
        playerPrompt.positionFunction = "GetTrickPlayPromptLocation()";
        playerPrompt.style.transition = 'none';
        var loc = eval(playerPrompt.positionFunction);
        playerPrompt.style.left = loc[0] + 'px';
        playerPrompt.style.top = loc[1] + 'px';
        playerPrompt.style.visibility = 'visible';
        with (playerPrompt.style) {
            transition = "0.5s linear";
            transitionDelay = "1s";
            opacity = 1;
        }

        var player = this.players[0];
        var legalPlayCards = this.GetLegalCardsForCurrentPlayerTurn();
        for (var i=0; i<player.cards.length; i++) {
            var card = player.cards[i];
            var cardView = card.cardView;
            var isLegal = false;
            for (var j=0; j<legalPlayCards.length; j++) {
                var legalCard = legalPlayCards[j];
                if (card.id === legalCard.id) {
                    isLegal = true;
                    break;
                }
            }
            if (isLegal) {
                UnshadeCard(cardView);
                cardView.isClickable = true;
            } else {
                ShadeCard(cardView);
                cardView.isClickable = false;
            }
        }
        
        if (this.skillLevel === 'Easy' || this.settings.GetSetting('setting_hints')) {
            ShowHintButton(0);
        }

        this.currentMoveStage = "ChoosingTrickCard";
    }

    function GetTrickPlayPromptLocation() {
        return [gameContainer.innerWidth*0.5, 350]; 
    }

    function GetTrickDiscardLocation(playerPostion) {
        switch (playerPostion) {
            case 'South':
                return [gameContainer.innerWidth*0.5 - cardLoweredWidth*0.5, 330 - cardLoweredHeight*0.5];
            case 'West':
                return [gameContainer.innerWidth*0.5 - cardLoweredWidth*1.5 - 20, 250 - cardLoweredHeight*0.5];
            case 'North':
                return [gameContainer.innerWidth*0.5 - cardLoweredWidth*0.5, 150 - cardLoweredHeight*0.5];
            default:
                return [gameContainer.innerWidth*0.5 + cardLoweredWidth*0.5 + 20, 250 - cardLoweredHeight*0.5];
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

    this.OnPlayerChosePlayCard = function(card) {
        this.currentMoveStage = 'None';
        var playerPrompt = document.getElementById('spades_player_play_prompt');
        with (playerPrompt.style) {
            transition = "0.1s linear";
            opacity = 0;
        }

        var player = this.players[this.turnIndex%4];
        this.PlayCard(card);
        
        var cardView = card.cardView;
        cardView.positionFunction = "GetTrickDiscardLocation('" + player.playerPosition + "')";
        var loc = eval(cardView.positionFunction);
        flipUpCard(cardView);
        with (cardView.style) {
            transition = "0.3s ease-out";
            transitionDelay = "0s";
            left = loc[0] + 'px';
            top = loc[1] + 'px';
            transform = 'none';
            zIndex = 0;
        }
        if (player.playerPosition === 'South') {
            for (var i=0; i<player.cards.length; i++) {
                var card = player.cards[i];
                var cardView = card.cardView;
                UnshadeCard(cardView);
                cardView.isClickable = false;
            }
        }
        AnimatePlayerHandCardsIntoPosition(player.playerPosition, "0.3s");

        if (this.trickCards.length !== 4) {
            var nextPlayer = this.players[this.turnIndex%4];
            setTimeout(function() {
                nextPlayer.ChoosePlayCard();
            }, 500);
        } else {
            var trickResult = this.GetTrickResult();
            trickResult.trickTaker.currentRoundTricksTaken += 1;
            this.leadIndex = trickResult.trickTaker.playerPositionInt;
            this.AnimateTrickResult(trickResult);
        }
    }

    this.DropCardInTrickPile = function() {
        var playedCard = currentDraggedCardView.card;
        HideHintButton();
        this.OnPlayerChosePlayCard(playedCard);
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

    this.AnimateTrickResult = function(trickResult) {
        var cardView = trickResult.highestCard.cardView;
        FlashHighlightCardView(cardView);

        var delay = 1400;
        setTimeout(function() {
            for (var i=0; i<game.trickCards.length; i++) {
                var cardView = game.trickCards[i].cardView;
                cardView.positionFunction = "GetWonTrickCardsPilePostion('" + trickResult.trickTaker.playerPosition + "')";
                var loc = eval(cardView.positionFunction);
                with (cardView.style) {
                    transition = "1s ease-out";
                    left = loc[0] + 'px';
                    top = loc[1] + 'px';
                    visibility = 'hidden';
                }
            }    
        }, delay);

        setTimeout(function(player) {
            UpdatePlayerRoundScore(player);
        }, 2000, trickResult.trickTaker);
    
        setTimeout(function() {
            if (game.players[0].cards.length !== 0) {
                game.trickCards = [];
                game.turnIndex = game.leadIndex;
                var nextPlayer = game.players[game.turnIndex];
                nextPlayer.ChoosePlayCard();
            } else {
                game.FinishRound();
            }
        }, delay + 1000);
    }

    function GetWonTrickCardsPilePostion(playerPosition) {
        var loc = GetHandCardLocation(playerPosition, 6, 12);
        switch (playerPosition) {
            case 'South':
                return [loc[0], gameContainer.innerHeight + 150];
            case 'West':
                return [-150, loc[1]];
            case 'North':
                return [loc[0], -150];
            default:
                return [gameContainer.innerWidth + 150, loc[1]];
        }
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
            
            if(this.settings.GetSetting('setting_sandbaggingpenalty')) {
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

        scoreboard.UpdateScores(this.roundNumber !== 1);
    }

    this.OnFinishedAnimatingUpdateGameScoreboard = function() {
        scoreboard.SlideDown();
        var winner = this.TryToGetWinningPlayer();
        if (winner !== null) {
            this.OnGameOver(winner);
        } else {
            this.AnimateDealCardsForRound();
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
        var humanPlayerPlace = this.GetTheHumanPlayersPlace();
        var gameOverLine1 = "";
        var gameOverLine2 = "";
        switch (humanPlayerPlace) {
            case 1:
                gameOverLine1 = "You won!";
                gameOverLine2 = "vs the " + this.skillLevel.toLowerCase() + " players";
                var setting = 'stat_wins_' + this.skillLevel;
                var settingVal = this.settings.GetStatistic(setting);
                this.settings.SetStatistic(setting, settingVal + 1);
                break;
            case 2:
                gameOverLine1 = winner.name + " won.";
                switch (humanPlayerPlace) { case 2: gameOverLine2 = "You finished in 2nd place."; break; case 3: gameOverLine2 = "You finished in 3rd place."; break; case 4: gameOverLine2 = "You finished in 4th place."; break;};
                var setting = 'stat_2nd_' + this.skillLevel;
                var settingVal = this.settings.GetStatistic(setting);
                this.settings.SetStatistic(setting, settingVal + 1);
                break;
            case 3:
                gameOverLine1 = winner.name + " won.";
                switch (humanPlayerPlace) { case 2: gameOverLine2 = "You finished in 2nd place."; break; case 3: gameOverLine2 = "You finished in 3rd place."; break; case 4: gameOverLine2 = "You finished in 4th place."; break;};
                var setting = 'stat_3rd_' + this.skillLevel;
                var settingVal = this.settings.GetStatistic(setting);
                this.settings.SetStatistic(setting, settingVal + 1);
                break;
            case 4:
                gameOverLine1 = winner.name + " won.";
                switch (humanPlayerPlace) { case 2: gameOverLine2 = "You finished in 2nd place."; break; case 3: gameOverLine2 = "You finished in 3rd place."; break; case 4: gameOverLine2 = "You finished in 4th place."; break;};
                var setting = 'stat_4th_' + this.skillLevel;
                var settingVal = this.settings.GetStatistic(setting);
                this.settings.SetStatistic(setting, settingVal + 1);
                break;
        }

        HideHintButton();
        HideMenuButton();
        HideAllMessages();

        var gameOverView = document.getElementById('SpadesGameOverView');
        var gameOverLine1Elem = document.getElementById('SpadesGameOverResultText');
        gameOverLine1Elem.innerText = gameOverLine1;
        var gameOverLine2Elem = document.getElementById('SpadesGameOverResultText2');
        gameOverLine2Elem.innerText = gameOverLine2;
        with (gameOverView.style) {
            transition = 'none';
            transform = 'translate(-50%,-50%) scale(0)';
            top = "50%";
            opacity = 1;
            visibility = 'visible';
        }   
        setTimeout(function() {
            with (gameOverView.style) {
                transition = "0.5s ease-out";
                transform = 'translate(-50%,-50%) scale(1)';
            }
        }, 300); 
        setTimeout(function() {
            with (gameOverView.style) {
                transition = "0.5s ease-in";
                transform = 'translate(-50%,-50%) scale(1)';
                top = "-200px";
            }
            scoreboard.SlideUp();

            ShowMainMenu(false);
            ShowTitle();
            
        }, 7000);

        this.AnimateGameOverCardAnimations();
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

    this.AnimateGameOverCardAnimations = function() {
        var curAnimationId = this.GetTotalGamesPlayed();
        var totalAnimationsAvailable = 4;
        var cardAnimStartDelay = 1000;
        switch (curAnimationId%totalAnimationsAvailable) {
            case 0:
            {
                // Gravity Bouncing
                
                var startLeft = 200;
                var startTop = -cardLoweredHeight - 30;
                for (var i=0; i<cards.length; i++) {
                    var cardView = cards[i].cardView;
                    flipDownCard(cardView, false);
                    raiseCard(cardView);
                    with (cardView.style) {
                        transition = 'none';
                        transform = 'none';
                        visibility = 'visible';
                        zIndex = i;
                        left = startLeft + 'px';
                        top = startTop + 'px';
                    }
                }

                for (var i=0; i<cards.length; i++) {
                    var cardView = cards[i].cardView;
                    var sheet = document.createElement('style');
                    var keyframesText = "@keyframes gameOverAnim" + i + " {";
                
                    var totalTime = 9;
                    var curTime = 0;
                    var deltaTime = 0.1;
                    var gravity = [0, 200];
                    var curVelocity = [200*deltaTime, 0];
                    var curPositionX = startLeft;
                    var curPositionY = startTop;
                    var isFallingOutOfView = false;
                    var bottomBounceY = gameContainer.innerHeight - cardLoweredHeight;
                    while (curTime < totalTime) {
                        var percentComplete = 100 * curTime / totalTime;
                        keyframesText = keyframesText + percentComplete + '% {opacity: 1; left: ' + curPositionX + 'px; top: ' + curPositionY + 'px;}';
                        
                        curPositionX = curPositionX + curVelocity[0];
                        curPositionY = curPositionY + curVelocity[1];
                        curVelocity[0] = curVelocity[0] + gravity[0]*deltaTime;
                        curVelocity[1] = curVelocity[1] + gravity[1]*deltaTime;
                        
                        isFallingOutOfView = totalTime - curTime < 1;

                        // Bounce
                        var bounceDampen = 0.75;
                        if (!isFallingOutOfView) {
                            if (curPositionY > bottomBounceY) {
                                var overshoot = curPositionY - bottomBounceY;
                                curPositionY = bottomBounceY;
                                curVelocity[1] = curVelocity[1] - gravity[1]*deltaTime;
                                curVelocity[1] = -curVelocity[1]*bounceDampen;
                            }
                        }
                        if (curPositionX < 0 || curPositionX > gameContainer.innerWidth-cardLoweredWidth) {
                            curPositionX = curPositionX - curVelocity[0];
                            curVelocity[0] = curVelocity[0] - gravity[0]*deltaTime;
                            curVelocity[0] = -curVelocity[0];
                        }
                                
                        curTime += deltaTime;
                    }
                    
                    keyframesText = keyframesText + '100% { opacity: 0; left: ' + (spinCenterX - cardLoweredWidth*0.5) + 'px; top: ' + (spinCenterY - cardLoweredHeight*0.5) + 'px;}';
                    keyframesText += '}';
                    sheet.textContent = keyframesText;
                    cardView.appendChild(sheet);
                    cardView.addEventListener('animationend', 
                    function(event) { 
                        event.target.style.animation = '';
                        if (event.target.children.length > 1) {
                            event.target.removeChild(event.target.children[1]);
                        }
                    }, false);
                    cardView.style.animation = 'gameOverAnim' + i + ' ' + totalTime + 's linear ' + (i*100 + cardAnimStartDelay) + 'ms 1';
                }

            }
            break;

            case 1:
            {
                // Gravity Bouncing off game over view
                                
                var startLeft = gameContainer.innerWidth*0.5 - 200;
                var startTop = -cardLoweredHeight - 30;
                for (var i=0; i<cards.length; i++) {
                    var cardView = cards[i].cardView;
                    flipDownCard(cardView, false);
                    raiseCard(cardView);
                    with (cardView.style) {
                        transition = 'none';
                        transform = 'none';
                        visibility = 'visible';
                        zIndex = i;
                        left = startLeft + 'px';
                        top = startTop + 'px';
                    }
                }

                for (var i=0; i<cards.length; i++) {
                    var cardView = cards[i].cardView;
                    var sheet = document.createElement('style');
                    var keyframesText = "@keyframes gameOverAnim" + i + " {";

                    var totalTime = 9;
                    var curTime = 0;
                    var deltaTime = 0.1;
                    var gravity = [0, 200];
                    var curVelocity = [200*deltaTime, 0];
                    var curPositionX = startLeft;
                    var curPositionY = startTop;
                    var isFallingOutOfView = false;
                    var bottomBounceY = gameContainer.innerHeight - cardLoweredHeight;
                    var gameOverViewWidth = 340;
                    var gameOverViewHeight = 100;
                    var gameOverViewLeft = (gameContainer.innerWidth - gameOverViewWidth)*0.5 - cardLoweredWidth*0.5;
                    var gameOverViewRight = gameOverViewLeft + gameOverViewWidth + cardLoweredWidth*0.5;
                    var gameOverViewTop = (gameContainer.innerHeight - gameOverViewHeight)*0.5 - cardLoweredHeight*1.1;

                    while (curTime < totalTime) {
                        var percentComplete = 100 * curTime / totalTime;
                        keyframesText = keyframesText + percentComplete + '% {opacity: 1; left: ' + curPositionX + 'px; top: ' + curPositionY + 'px;}';
                        
                        var prevPositionY = curPositionY;
                        curPositionX = curPositionX + curVelocity[0];
                        curPositionY = curPositionY + curVelocity[1];
                        curVelocity[0] = curVelocity[0] + gravity[0]*deltaTime;
                        curVelocity[1] = curVelocity[1] + gravity[1]*deltaTime;
                        
                        isFallingOutOfView = totalTime - curTime < 1;

                        // Bounce
                        var bounceDampen = 0.75;
                        if (!isFallingOutOfView) {
                            if (curPositionY > bottomBounceY) {
                                curPositionY = bottomBounceY;
                                curVelocity[1] = curVelocity[1] - gravity[1]*deltaTime;
                                curVelocity[1] = -curVelocity[1]*bounceDampen;
                            } else {
                                // Bounce off game over view
                                if (curPositionX > gameOverViewLeft &&
                                    curPositionX < gameOverViewRight &&
                                    prevPositionY <= gameOverViewTop &&
                                    curPositionY > gameOverViewTop
                                    ) 
                                {
                                    curPositionY = gameOverViewTop;
                                    curVelocity[1] = curVelocity[1] - gravity[1]*deltaTime;
                                    curVelocity[1] = -curVelocity[1]*bounceDampen;    
                                }
                            }
                        }
                        if (curPositionX < 0 || curPositionX > gameContainer.innerWidth-cardLoweredWidth) {
                            curPositionX = curPositionX - curVelocity[0];
                            curVelocity[0] = curVelocity[0] - gravity[0]*deltaTime;
                            curVelocity[0] = -curVelocity[0];
                        }
                                
                        curTime += deltaTime;
                    }
                    
                    keyframesText = keyframesText + '100% { opacity: 0; left: ' + (spinCenterX - cardLoweredWidth*0.5) + 'px; top: ' + (spinCenterY - cardLoweredHeight*0.5) + 'px;}';
                    keyframesText += '}';
                    sheet.textContent = keyframesText;
                    cardView.appendChild(sheet);
                    cardView.addEventListener('animationend', 
                    function(event) { 
                        event.target.style.animation = '';
                        if (event.target.children.length > 1) {
                            event.target.removeChild(event.target.children[1]);
                        }
                    }, false);
                    cardView.style.animation = 'gameOverAnim' + i + ' ' + totalTime + 's linear ' + (i*100 + cardAnimStartDelay) + 'ms 1';
                }
            }
            break;

            case 2:
            {
                // Spiral into center
                var totalTime = 7;       
                var startLeft = gameContainer.innerWidth*0.5 - 200;
                var startTop = -cardLoweredHeight - 30;
                for (var i=0; i<cards.length; i++) {
                    var cardView = cards[i].cardView;
                    flipDownCard(cardView, false);
                    raiseCard(cardView);
                    with (cardView.style) {
                        transition = 'none';
                        transform = 'none';
                        visibility = 'visible';
                        zIndex = i;
                        left = startLeft + 'px';
                        top = startTop + 'px';
                    }
                }

                for (var i=0; i<cards.length; i++) {
                    var cardView = cards[i].cardView;
                    var sheet = document.createElement('style');
                    var keyframesText = "@keyframes gameOverAnim" + i + " {";

                    var fullAngle = Math.PI * 2 * 4.25;
                    var spinCenterX = gameContainer.innerWidth*0.5;
                    var spinCenterY = gameContainer.innerHeight*0.5;
                    var radius = Math.sqrt((spinCenterY - startTop)*(spinCenterY - startTop) + (spinCenterX - startLeft)*(spinCenterX - startLeft));
                    for (var angle = fullAngle; angle >= 0; angle-=0.15) {
                        var percentComplete = 100 * (1 - (angle / fullAngle));
                        
                        var curPositionX = radius*Math.cos(-angle) + spinCenterX - cardLoweredWidth*0.5;
                        var curPositionY = radius*Math.sin(-angle) + spinCenterY - cardLoweredHeight*0.5;
                        keyframesText = keyframesText + percentComplete + '% { opacity: 1; left: ' + curPositionX + 'px; top: ' + curPositionY + 'px;}';
                        radius*=0.985;
                    }
                    
                    keyframesText = keyframesText + '100% { opacity: 0; left: ' + (spinCenterX - cardLoweredWidth*0.5) + 'px; top: ' + (spinCenterY - cardLoweredHeight*0.5) + 'px;}';
                    keyframesText += '}';
                    sheet.textContent = keyframesText;
                    cardView.appendChild(sheet);
                    cardView.addEventListener('animationend', 
                    function(event) { 
                        event.target.style.animation = '';
                        if (event.target.children.length > 1) {
                            event.target.removeChild(event.target.children[1]);
                        }
                    }, false);
                    cardView.style.animation = 'gameOverAnim' + i + ' ' + totalTime + 's linear ' + (i*100 + cardAnimStartDelay) + 'ms 1';
                }
            }
            break;

            case 3:
            {
                // Spiral out from center
                var slideInTime = 0.5;
                var totalTime = 7;       
                var startLeft = gameContainer.innerWidth*0.5 - cardLoweredWidth*0.5;
                var startTop = -cardLoweredHeight - 30;
                for (var i=0; i<cards.length; i++) {
                    var cardView = cards[i].cardView;
                    flipDownCard(cardView, false);
                    raiseCard(cardView);
                    with (cardView.style) {
                        transition = 'none';
                        transform = 'none';
                        visibility = 'visible';
                        zIndex = i;
                        left = startLeft + 'px';
                        top = startTop + 'px';
                    }
                }

                for (var i=0; i<cards.length; i++) {
                    var cardView = cards[i].cardView;
                    var sheet = document.createElement('style');
                    var keyframesText = "@keyframes gameOverAnim" + i + " {";

                    var slideInPercent = slideInTime / (slideInTime + totalTime);
                    keyframesText = keyframesText + (slideInPercent*100) + '% { opacity: 1; left: ' + (spinCenterX - cardLoweredWidth*0.5) + 'px; top: ' + (spinCenterY - cardLoweredHeight*0.5) + 'px;}';
                    
                    var fullAngle = Math.PI * 2 * 4.25;
                    var spinCenterX = gameContainer.innerWidth*0.5;
                    var spinCenterY = gameContainer.innerHeight*0.5;
                    var fullRadius = Math.sqrt((spinCenterY - startTop)*(spinCenterY - startTop) + (spinCenterX - startLeft)*(spinCenterX - startLeft));
                    for (var angle = 0.01; angle < fullAngle; angle+=0.15) {
                        var percentComplete = (angle / fullAngle) * (1-slideInPercent);
                    
                        var radius = (angle/fullAngle)*fullRadius;
                        var curPositionX = radius*Math.cos(-angle) + spinCenterX - cardLoweredWidth*0.5;
                        var curPositionY = radius*Math.sin(-angle) + spinCenterY - cardLoweredHeight*0.5;
                        keyframesText = keyframesText + ((slideInPercent + percentComplete)*100) + '% { opacity: 1; left: ' + curPositionX + 'px; top: ' + curPositionY + 'px;}';
                    }
                    
                    keyframesText = keyframesText + '100% { opacity: 0; left: ' + startLeft + 'px; top: ' + startTop + 'px;}';
                    keyframesText += '}';
                    sheet.textContent = keyframesText;
                    cardView.appendChild(sheet);
                    cardView.addEventListener('animationend', 
                    function(event) { 
                        event.target.style.animation = '';
                        if (event.target.children.length > 1) {
                            event.target.removeChild(event.target.children[1]);
                        }
                    }, false);
                    cardView.style.animation = 'gameOverAnim' + i + ' ' + totalTime + 's linear ' + (i*100 + cardAnimStartDelay) + 'ms 1';
                }
            }
            break;
        }
    }

    this.OnScoreboardClick = function() {
        scoreboard.OnClick();
    }

    function HideAllMessages() {
        var viewsToHide = [
            'player_name_South',
            'player_name_West',
            'player_name_North',
            'player_name_East',
            'player_score_South',
            'player_score_West',
            'player_score_North',
            'player_score_East',
            'spades_hint_button',
            'spades_player_play_prompt',
            'choose_bid_view'
            ];
        for (var i = 0; i < viewsToHide.length; i++) {
            var view = document.getElementById(viewsToHide[i]);
            view.style.transition = "none";
            view.style.opacity = 0;
            view.style.visibility = 'hidden';
        }
    }

    this.OnResizeWindow = function OnResizeWindow() {

        gameContainer.innerWidth = window.innerWidth - codeContainerGutterRightPosition - 20;
        gameContainer.style.width = gameContainer.innerWidth + 'px';
        
        var ease = "0.4s ease-out";

        // Reposition all the cards
        for (var i = 0; i < cards.length; i++) {
            var cardView = cards[i].cardView;
            if (cardView.positionFunction !== undefined) {
                var position = eval(cardView.positionFunction);
                cardView.style.left = position[0] + "px";
                cardView.style.top = position[1] + "px";
                cardView.style.transform = 'rotate(' + position[2] + "deg)";
                cardView.style.transition = ease;
            }
        }

        // Reposition everything else
        var viewsToPosition = [
            'player_name_South',
            'player_name_West',
            'player_name_North',
            'player_name_East',
            'player_score_South',
            'player_score_West',
            'player_score_North',
            'player_score_East',
            'spades_hint_button',
            'spades_player_play_prompt',
            'choose_bid_view'
        ];
        for (var i = 0; i < viewsToPosition.length; i++) {
            var view = document.getElementById(viewsToPosition[i]);
            if (view.positionFunction !== undefined) {
                view.style.transition = ease;
                var position = eval(view.positionFunction);
                view.style.left = position[0] + "px";
                view.style.top = position[1] + "px";
            }
        }
    }

    this.OnTerminateGame = function() {}

    //
    //  MENUS
    //
    this.ShowStartAGameMenu = function() {
        var menuName = visibleMenuCards[visibleMenuCards.length-1];
        MenuCardPressDown(menuName);
        MenuCardAppear("menu_start_a_game");
    }

    this.menu_start_game_click = function(difficulty) {
        game.StartAGame(difficulty);
        while (visibleMenuCards.length > 0) {
            var topMenu = visibleMenuCards.pop();
            MenuCardPopUp(topMenu);
            MenuCardDisappear(topMenu);
        }
        ShowMenuButton();
    }
    
    this.ShowDifficultiesExplainedMenu = function()
    {
        var menuName = visibleMenuCards[visibleMenuCards.length-1];
        MenuCardPressDown(menuName);
        MenuCardAppear("menu_difficulties_explained");
    }
    
    this.ShowSettingsMenu = function() {
        this.InitializeSettingsView();
        var menuName = visibleMenuCards[visibleMenuCards.length-1];
        MenuCardPressDown(menuName);
        MenuCardAppear("menu_settings");
    }
    
    this.InitializeSettingsView = function() {
        document.getElementById("setting_hints_checkbox").checked = this.settings.GetSetting('setting_hints');
        document.getElementById("setting_sandbaggingpenalty_checkbox").checked = this.settings.GetSetting('setting_sandbaggingpenalty');
        document.getElementById("winning_score_dropdown").value = this.settings.GetSetting('setting_winning_score');
    
        var board_color = GetSetting('setting_board_color');
        var allElems = document.getElementsByName('settings_boardbackground_selector');
        for (i = 0; i < allElems.length; i++) {
            if (allElems[i].type == 'radio' && allElems[i].value == board_color) {
                allElems[i].checked = true;
            }
        }
        
        var card_color = GetSetting('setting_card_color');
        var allElems = document.getElementsByName('settings_card_color_selector');
        for (i = 0; i < allElems.length; i++) {
            if (allElems[i].type == 'radio' && allElems[i].value == card_color) {
                allElems[i].checked = true;
            }
        }
    }
    
    this.SettingHintsClicked = function(cb) {
        this.settings.SetSetting('setting_hints', cb.checked);
    }
    
    this.SettingSandBaggingPenaltyClicked = function(cb) {
        this.settings.SetSetting('setting_sandbaggingpenalty', cb.checked);
    }
    
    this.SettingWinningScoreChanged = function(winningScoreSelect) {
        this.settings.SetSetting('setting_winning_score', winningScoreSelect.value);
    }

    this.ShowStatisticsMenu = function() {
        var menuName = visibleMenuCards[visibleMenuCards.length-1];
        MenuCardPressDown(menuName);
        this.InitializeStatisticsView();
        MenuCardAppear("menu_statistics");
    }
    
    this.InitializeStatisticsView = function() {
    
        var difficulties = ["Easy", "Standard", "Pro"];
        var totalGamesPlayed = 0;
        var totalWins = 0;
        var total2nds = 0;
        var total3rds = 0;
        var total4ths = 0;
        for (var i=0; i<difficulties.length; i++) {
            var curDifficulty = difficulties[i];
            var wins = this.settings.GetStatistic('stat_wins_' + curDifficulty);
            var stat2nds = this.settings.GetStatistic('stat_2nd_' + curDifficulty);
            var stat3rds = this.settings.GetStatistic('stat_3rd_' + curDifficulty);
            var stat4ths = this.settings.GetStatistic('stat_4th_' + curDifficulty);
            var gamesPlayed = wins + stat2nds + stat3rds + stat4ths;
            var gamesPlayedElement = document.getElementById('menu_stat_games_played_' + curDifficulty);
            var winsElement = document.getElementById('menu_stat_wins_' + curDifficulty);
            var stat2ndsElement = document.getElementById('menu_stat_2nd_' + curDifficulty);
            var stat3rdsElement = document.getElementById('menu_stat_3rd_' + curDifficulty);
            var stat4thsElement = document.getElementById('menu_stat_4th_' + curDifficulty);
            var winPercentElement = document.getElementById('menu_stat_win_percent_' + curDifficulty);
            if (gamesPlayed > 0) {
                gamesPlayedElement.innerText = gamesPlayed;
                winsElement.innerText = wins;
                stat2ndsElement.innerText = stat2nds;
                stat3rdsElement.innerText = stat3rds;
                stat4thsElement.innerText = stat4ths;
                winPercentElement.innerText = parseFloat(100*wins / gamesPlayed).toFixed(0) + "%";
            } else {
                gamesPlayedElement.innerText = "";
                winsElement.innerText = "";
                stat2ndsElement.innerText = "";
                stat3rdsElement.innerText = "";
                stat4thsElement.innerText = "";
                winPercentElement.innerText = "";
            }
            totalGamesPlayed = totalGamesPlayed + gamesPlayed;
            totalWins = totalWins + wins;
            total2nds = total2nds + stat2nds;
            total3rds = total2nds + stat3rds;
            total4ths = total2nds + stat4ths;
        }
        var gamesPlayedElement = document.getElementById('menu_stat_games_played_Total');
        var winsElement = document.getElementById('menu_stat_wins_Total');
        var stat2ndsElement = document.getElementById('menu_stat_2nd_Total');
        var stat3rdsElement = document.getElementById('menu_stat_3rd_Total');
        var stat4thsElement = document.getElementById('menu_stat_4th_Total');
        var winPercentElement = document.getElementById('menu_stat_win_percent_Total');
        if (totalGamesPlayed > 0) {
            gamesPlayedElement.innerText = totalGamesPlayed;
            winsElement.innerText = totalWins;
            stat2ndsElement.innerText = total2nds;
            stat3rdsElement.innerText = total3rds;
            stat4thsElement.innerText = total4ths;
            winPercentElement.innerText = parseFloat(100*totalWins / totalGamesPlayed).toFixed(0) + "%";
        } else {
            gamesPlayedElement.innerText = "0";
            winsElement.innerText = "0";
            stat2ndsElement.innerText = "0";
            stat3rdsElement.innerText = "0";
            stat4thsElement.innerText = "0";
            winPercentElement.innerText = "";
        }
    }
    
    this.GetTotalGamesPlayed = function() {
        var difficulties = ["Easy", "Standard", "Pro"];
        var totalGamesPlayed = 0;
        for (var i=0; i<difficulties.length; i++) {
            var curDifficulty = difficulties[i];
            var wins = this.settings.GetStatistic('stat_wins_' + curDifficulty);
            var stat2nds = this.settings.GetStatistic('stat_2nd_' + curDifficulty);
            var stat3rds = this.settings.GetStatistic('stat_3rd_' + curDifficulty);
            var stat4ths = this.settings.GetStatistic('stat_4th_' + curDifficulty);
            totalGamesPlayed += (wins + stat2nds + stat3rds + stat4ths);
        }
        return totalGamesPlayed;
    }
    
    this.ResetStatisticsButtonClick = function() {
        var r = confirm("Are you sure you want to reset your statistics?");
        if (r != true) {
            return;
        }
    
        this.settings.ResetStatistics();
        
        this.InitializeStatisticsView();
    }
    
    this.ShowTutorialMenu = function() {
        var menuName = visibleMenuCards[visibleMenuCards.length-1];
        MenuCardPressDown(menuName);
        MenuCardAppear("menu_tutorial");
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

var SpadesFindBidForPlayer = function(aGame, currentPlayer) {
    
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

var SpadesFindOptimalPlayForCurrentPlayer = function(aGame) {
    
    var currentPlayer = aGame.players[aGame.turnIndex%4];
    var possiblePlays = SpadesGetLegalCardsForCurrentPlayerTurnInSimulator(aGame);
    var playProbabilities = SpadesFindPossiblePlayProbabilities(aGame);
    console.log("PROBABILITIES:");
    for (var i=0; i<possiblePlays.length; i++) {
        possiblePlays[i].trickTakingProbability = playProbabilities[i];
        console.log(possiblePlays[i].id + " - " + possiblePlays[i].trickTakingProbability);
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