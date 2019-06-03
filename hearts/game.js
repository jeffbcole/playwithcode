var HeartsGame = function () {

    // Global Game Settings
    this.settings = new HeartsSettings();

    // Constants
    var cardLoweredWidth = 115;
    var cardLoweredHeight = 162;
    
    // Local variables
    var scoreboard = new HeartsScoreboard();
    var currentDraggedCardView;
    var currentPlayerHandCardSpacing = 0;
    var autoPlayBoundaryY = 0;

    // Members
    this.currentMoveStage = "";
    this.skillLevel = "";
    this.losingScore = 0;
    this.players = [];
    this.trickCards = [];
    this.roundNumber = 0;
    this.leadIndex = 0;
    this.turnIndex = 0;
    this.isHeartsBroken = false;
    this.cardsPlayedThisRound = [];
    this.roundScores = [];

    // Inject all the html elements
    gameContainer.innerHTML = 
        '<div id="below_cards_messages_region">\
        <div class="hearts_player_name" id="player_name_South"></div>\
        <div class="hearts_player_name" id="player_name_West"></div>\
        <div class="hearts_player_name" id="player_name_North"></div>\
        <div class="hearts_player_name" id="player_name_East"></div>\
        \
        <div class="hearts_player_score" id="player_score_South"></div>\
        <div class="hearts_player_score" id="player_score_West"></div>\
        <div class="hearts_player_score" id="player_score_North"></div>\
        <div class="hearts_player_score" id="player_score_East"></div>\
        \
        <div id="hearts_select_passing_cards_message">Select 3 cards to pass left:</div>\
        <div id="select_passing_cards_region_0" class="hearts_select_passing_card_region"></div>\
        <div id="select_passing_cards_region_1" class="hearts_select_passing_card_region"></div>\
        <div id="select_passing_cards_region_2" class="hearts_select_passing_card_region"></div>\
        \
        <div id="hearts_confirm_passing_cards_region">\
            <div id="hearts_confirm_passing_cards_shadow"></div>\
            <button id="hearts_confirm_passing_cards_button" onclick="game.passingCardsConfirmed()">Pass Cards</button>\
        </div>\
        \
        <div id="hearts_player_play_prompt">Drop a card here</div>\
        \
        <div id="hearts_moon_shoot_text"></div>\
        \
        <button id="hearts_hint_button" onclick="game.OnHintButtonClick()">Hint</button>\
        \
        <div id="hearts_scoreboard">\
            <div id="hearts_scoreboardBackground" onclick="game.OnScoreboardClick()">\
                <div id="hearts_scoreboardPlayerRegionSouth" class="hearts_scoreboardPlayerRegion">\
                    <div id="scoreboardPlayerNameSouth" class="hearts_scoreboardPlayerName">South</div>\
                    <div id="scoreboardPlayerBarSouth" class="hearts_scoreboardPlayerBar">\
                        <div id="scoreboardPlayerBarFillSouth" class="hearts_scoreboardPlayerBarFill"></div>\
                    </div>\
                    <div id="scoreboardPlayerScoreSouth" class="hearts_scoreboardPlayerScore">10</div>\
                </div>\
                <div id="hearts_scoreboardPlayerRegionWest" class="hearts_scoreboardPlayerRegion">\
                    <div id="scoreboardPlayerNameWest" class="hearts_scoreboardPlayerName">West</div>\
                    <div id="scoreboardPlayerBarWest" class="hearts_scoreboardPlayerBar">\
                        <div id="scoreboardPlayerBarFillWest" class="hearts_scoreboardPlayerBarFill"></div>\
                    </div>\
                    <div id="scoreboardPlayerScoreWest" class="hearts_scoreboardPlayerScore">10</div>\
                </div>\
                <div id="hearts_scoreboardPlayerRegionNorth" class="hearts_scoreboardPlayerRegion">\
                    <div id="scoreboardPlayerNameNorth" class="hearts_scoreboardPlayerName">North</div>\
                    <div id="scoreboardPlayerBarNorth" class="hearts_scoreboardPlayerBar">\
                        <div id="scoreboardPlayerBarFillNorth" class="hearts_scoreboardPlayerBarFill"></div>\
                    </div>\
                    <div id="scoreboardPlayerScoreNorth" class="hearts_scoreboardPlayerScore">10</div>\
                </div>\
                <div id="hearts_scoreboardPlayerRegionEast" class="hearts_scoreboardPlayerRegion">\
                    <div id="scoreboardPlayerNameEast" class="hearts_scoreboardPlayerName">East</div>\
                    <div id="scoreboardPlayerBarEast" class="hearts_scoreboardPlayerBar">\
                        <div id="scoreboardPlayerBarFillEast" class="hearts_scoreboardPlayerBarFill"></div>\
                    </div>\
                    <div id="scoreboardPlayerScoreEast" class="hearts_scoreboardPlayerScore">10</div>\
                </div>\
                \
                <div id="hearts_scoreboardRoundScoresRegion"></div>\
                \
            </div>\
            <div id="hearts_scoreboardDifficulty"></div>\
        </div>\
    </div>\
    \
    <div id="cards_region"></div>\
    \
    <div id="adView" align="center">\
        \
    </div>\
    \
    <div id="HeartsGameOverView">\
        <div id="HeartsGameOverResultText">You won!</div>\
        <div id="HeartsGameOverResultText2">vs the easy players</div>\
    </div>\
    \
    <div id="BubbleScoreHeartTemplate" class="BubbleScoreHeart">\
        <table style="width: 95px; margin-top: 15px;">\
            <tr>\
                <td class="BubbleScoreHeartsPoints">+1</td>\
            </tr>\
        </table>\
    </div>\
    \
    <div id="BubbleScoreSpadeTemplate" class="BubbleScoreSpade">\
        <table style="width: 75px; margin-top: 15px;">\
            <tr>\
                <td class="BubbleScoreSpadesPoints">+13</td>\
            </tr>\
        </table>\
    </div>\
    \
    <button id="menu_button" onclick="MenuButtonPressed()">\
        <img src="shared/images/MenuButton.png" ondragstart="return false;" />\
    </button>\
    \
    <div id="menu_main" class="menu_view">\
        <button id="menu_main_close_button" class="close_button" onclick="menu_main_close_click()">X</button>\
        <button id="start_game_button" class="menu_button" onclick="game.ShowStartAGameMenu()">Start A Game</button>\
        <button id="statistics_button" class="menu_button" onclick="game.ShowStatisticsMenu()">Statistics</button>\
        <button id="settings_button" class="menu_button" onclick="game.ShowSettingsMenu()">Settings</button>\
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
            For all three difficulty levels the cards are dealt completely at random to both you and to the computer players. Computer players are not given any special advantage and they do not know what cards are in your hand or in any other players\' hands. The difference between the easy, standard, and pro players is the strategy used to choose their plays.  If you are finding that the computer is beating you, you will likely benefit from understanding how the computer chooses its next move.\
            <br>\
            <br>\
            <center>\
                <div style="font-size:16pt">\
                    <u>Easy Computer Strategy</u>\
                </div>\
            </center>\
            <table style="width:100%; text-align:left; font-size:12pt;">\
                <tr>\
                    <td valign="top" width="80pt">Passing:</td>\
                    <td>Chooses a random set of cards.</td>\
                </tr>\
                <tr>\
                    <td valign="top" width="80pt">Playing:</td>\
                    <td>Chooses a random valid card.</td>\
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
                    <td valign="top" width="80pt">Passing:</td>\
                    <td>Chooses the three highest valued cards where value is determined by the card number (Ace, King, Queen, etc...) and suit (Spades, Hearts, Diamonds, Clubs).</td>\
                </tr>\
                <tr>\
                    <td valign="top" width="80pt">Playing:</td>\
                <td>When playing first, chooses the lowest card in hand.  When playing 2nd or 3rd, plays the highest card that will not take the trick, otherwise, plays the lowest card of suit.  When playing last, if there are points in the trick, plays the highest card that will not take the trick or if it must take the trick, plays the highest card of suit (avoiding the Queen of Spades).  If playing last and there are no points in the trick, plays the highest card in hand.  When the player is void in the lead suit, it will play its highest valued cards starting with QS, AS, AH, AD, AC, KS, KH, KD, KC, QH, QD, QC, etc...</td>\
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
                    <td valign="top" width="80pt">Passing:</td>\
                    <td>Chooses the three highest valued cards where value is determined by the card number (Ace, King, Queen, etc...) and suit (Spades, Hearts, Diamonds, Clubs).</td>\
                </tr>\
                <tr>\
                    <td valign="top" width="80pt">Playing:</td>\
                    <td>The pro computer evaluates each valid play by simulating random card distributions of the unseen cards taking into account which players are known to be void in particular suits.  When simulating a game, each player plays the rest of the round using the Standard Playing algorithm (see above).  At the end of each simulated round, the final score is recorded and the average round score is determined for each valid play.  The play that results in the lowest average simulated round score is used.</td>\
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
                <td>Losing score:</td>\
                <td>\
                    <select id="losing_score_dropdown" name="losing_score_dropdown" onchange="game.SettingLosingScoreChanged(this)">\
                        <option value="50">50</option>\
                        <option value="100">100</option>\
                        <option value="200">200</option>\
                        <option value="500">500</option>\
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
                <td class="menu_statistics_table_category">Moons Shot</td>\
                <td class="menu_statistics_table_stat" id="menu_stat_moons_shot_Easy"></td>\
                <td class="menu_statistics_table_stat" id="menu_stat_moons_shot_Standard"></td>\
                <td class="menu_statistics_table_stat" id="menu_stat_moons_shot_Pro"></td>\
                <td class="menu_statistics_table_stat_total" id="menu_stat_moons_shot_Total">0</td>\
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
                        <button id="menu_statistics_reset_button" onclick="game.ResetStatisticsButtonClick()">Reset<br>Statistics</button>\
                    </center>\
                </td>\
            </tr>\
        </table>\
    </div>';

    var deckTopIndex = 0;
    var cards = [
        { id: 'AS', rank: 1, value: 14, suit: 'S', suitInt: 2, image: "url('shared/images/Card_Spade_Ace.jpg')" },
        { id: '2S', rank: 2, value: 2, suit: 'S', suitInt: 2, image: "url('shared/images/Card_Spade_2.jpg')" },
        { id: '3S', rank: 3, value: 3, suit: 'S', suitInt: 2, image: "url('shared/images/Card_Spade_3.jpg')" },
        { id: '4S', rank: 4, value: 4, suit: 'S', suitInt: 2, image: "url('shared/images/Card_Spade_4.jpg')" },
        { id: '5S', rank: 5, value: 5, suit: 'S', suitInt: 2, image: "url('shared/images/Card_Spade_5.jpg')" },
        { id: '6S', rank: 6, value: 6, suit: 'S', suitInt: 2, image: "url('shared/images/Card_Spade_6.jpg')" },
        { id: '7S', rank: 7, value: 7, suit: 'S', suitInt: 2, image: "url('shared/images/Card_Spade_7.jpg')" },
        { id: '8S', rank: 8, value: 8, suit: 'S', suitInt: 2, image: "url('shared/images/Card_Spade_8.jpg')" },
        { id: '9S', rank: 9, value: 9, suit: 'S', suitInt: 2, image: "url('shared/images/Card_Spade_9.jpg')" },
        { id: 'TS', rank: 10, value: 10, suit: 'S', suitInt: 2, image: "url('shared/images/Card_Spade_10.jpg')" },
        { id: 'JS', rank: 11, value: 11, suit: 'S', suitInt: 2, image: "url('shared/images/Card_Spade_Jack.jpg')" },
        { id: 'QS', rank: 12, value: 12, suit: 'S', suitInt: 2, image: "url('shared/images/Card_Spade_Queen.jpg')" },
        { id: 'KS', rank: 13, value: 13, suit: 'S', suitInt: 2, image: "url('shared/images/Card_Spade_King.jpg')" },
        { id: 'AD', rank: 1, value: 14, suit: 'D', suitInt: 1, image: "url('shared/images/Card_Diamond_Ace.jpg')" },
        { id: '2D', rank: 2, value: 2, suit: 'D', suitInt: 1, image: "url('shared/images/Card_Diamond_2.jpg')" },
        { id: '3D', rank: 3, value: 3, suit: 'D', suitInt: 1, image: "url('shared/images/Card_Diamond_3.jpg')" },
        { id: '4D', rank: 4, value: 4, suit: 'D', suitInt: 1, image: "url('shared/images/Card_Diamond_4.jpg')" },
        { id: '5D', rank: 5, value: 5, suit: 'D', suitInt: 1, image: "url('shared/images/Card_Diamond_5.jpg')" },
        { id: '6D', rank: 6, value: 6, suit: 'D', suitInt: 1, image: "url('shared/images/Card_Diamond_6.jpg')" },
        { id: '7D', rank: 7, value: 7, suit: 'D', suitInt: 1, image: "url('shared/images/Card_Diamond_7.jpg')" },
        { id: '8D', rank: 8, value: 8, suit: 'D', suitInt: 1, image: "url('shared/images/Card_Diamond_8.jpg')" },
        { id: '9D', rank: 9, value: 9, suit: 'D', suitInt: 1, image: "url('shared/images/Card_Diamond_9.jpg')" },
        { id: 'TD', rank: 10, value: 10, suit: 'D', suitInt: 1, image: "url('shared/images/Card_Diamond_10.jpg')" },
        { id: 'JD', rank: 11, value: 11, suit: 'D', suitInt: 1, image: "url('shared/images/Card_Diamond_Jack.jpg')" },
        { id: 'QD', rank: 12, value: 12, suit: 'D', suitInt: 1, image: "url('shared/images/Card_Diamond_Queen.jpg')" },
        { id: 'KD', rank: 13, value: 13, suit: 'D', suitInt: 1, image: "url('shared/images/Card_Diamond_King.jpg')" },
        { id: 'AC', rank: 1, value: 14, suit: 'C', suitInt: 0, image: "url('shared/images/Card_Club_Ace.jpg')" },
        { id: '2C', rank: 2, value: 2, suit: 'C', suitInt: 0, image: "url('shared/images/Card_Club_2.jpg')" },
        { id: '3C', rank: 3, value: 3, suit: 'C', suitInt: 0, image: "url('shared/images/Card_Club_3.jpg')" },
        { id: '4C', rank: 4, value: 4, suit: 'C', suitInt: 0, image: "url('shared/images/Card_Club_4.jpg')" },
        { id: '5C', rank: 5, value: 5, suit: 'C', suitInt: 0, image: "url('shared/images/Card_Club_5.jpg')" },
        { id: '6C', rank: 6, value: 6, suit: 'C', suitInt: 0, image: "url('shared/images/Card_Club_6.jpg')" },
        { id: '7C', rank: 7, value: 7, suit: 'C', suitInt: 0, image: "url('shared/images/Card_Club_7.jpg')" },
        { id: '8C', rank: 8, value: 8, suit: 'C', suitInt: 0, image: "url('shared/images/Card_Club_8.jpg')" },
        { id: '9C', rank: 9, value: 9, suit: 'C', suitInt: 0, image: "url('shared/images/Card_Club_9.jpg')" },
        { id: 'TC', rank: 10, value: 10, suit: 'C', suitInt: 0, image: "url('shared/images/Card_Club_10.jpg')" },
        { id: 'JC', rank: 11, value: 11, suit: 'C', suitInt: 0, image: "url('shared/images/Card_Club_Jack.jpg')" },
        { id: 'QC', rank: 12, value: 12, suit: 'C', suitInt: 0, image: "url('shared/images/Card_Club_Queen.jpg')" },
        { id: 'KC', rank: 13, value: 13, suit: 'C', suitInt: 0, image: "url('shared/images/Card_Club_King.jpg')" },
        { id: 'AH', rank: 1, value: 14, suit: 'H', suitInt: 3, image: "url('shared/images/Card_Heart_Ace.jpg')" },
        { id: '2H', rank: 2, value: 2, suit: 'H', suitInt: 3, image: "url('shared/images/Card_Heart_2.jpg')" },
        { id: '3H', rank: 3, value: 3, suit: 'H', suitInt: 3, image: "url('shared/images/Card_Heart_3.jpg')" },
        { id: '4H', rank: 4, value: 4, suit: 'H', suitInt: 3, image: "url('shared/images/Card_Heart_4.jpg')" },
        { id: '5H', rank: 5, value: 5, suit: 'H', suitInt: 3, image: "url('shared/images/Card_Heart_5.jpg')" },
        { id: '6H', rank: 6, value: 6, suit: 'H', suitInt: 3, image: "url('shared/images/Card_Heart_6.jpg')" },
        { id: '7H', rank: 7, value: 7, suit: 'H', suitInt: 3, image: "url('shared/images/Card_Heart_7.jpg')" },
        { id: '8H', rank: 8, value: 8, suit: 'H', suitInt: 3, image: "url('shared/images/Card_Heart_8.jpg')" },
        { id: '9H', rank: 9, value: 9, suit: 'H', suitInt: 3, image: "url('shared/images/Card_Heart_9.jpg')" },
        { id: 'TH', rank: 10, value: 10, suit: 'H', suitInt: 3, image: "url('shared/images/Card_Heart_10.jpg')" },
        { id: 'JH', rank: 11, value: 11, suit: 'H', suitInt: 3, image: "url('shared/images/Card_Heart_Jack.jpg')" },
        { id: 'QH', rank: 12, value: 12, suit: 'H', suitInt: 3, image: "url('shared/images/Card_Heart_Queen.jpg')" },
        { id: 'KH', rank: 13, value: 13, suit: 'H', suitInt: 3, image: "url('shared/images/Card_Heart_King.jpg')" }
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

        if (game.currentMoveStage === 'ChoosingPassCards') {
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
                passingCardsPointerPressed();
            }
        } else if (game.currentMoveStage === 'ChoosingTrickCard') {
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
        this.losingScore = Number(this.settings.GetSetting('setting_losing_score'));
        this.cardsPlayedThisRound = [];
        this.trickCards = [];
        this.roundNumber = 0;
        this.currentMoveStage = 'None';
        this.roundScores = [];

        this.players = [];
        var player = new HeartsPlayer();
        player.Initialize('You', true, 'Pro', 'South');
        this.players.push(player);
        switch(difficulty)
        {
            case 'Easy':
            {
                player = new HeartsPlayer();
                player.Initialize('Conrad', false, difficulty, 'West');
                this.players.push(player);
                player = new HeartsPlayer();
                player.Initialize('Louisa', false, difficulty, 'North');
                this.players.push(player);
                player = new HeartsPlayer();
                player.Initialize('Davina', false, difficulty, 'East');
                this.players.push(player);
            }
            break;
            case 'Standard':
            {
                player = new HeartsPlayer();
                player.Initialize('Catalina', false, difficulty, 'West');
                this.players.push(player);
                player = new HeartsPlayer();
                player.Initialize('Amelia', false, difficulty, 'North');
                this.players.push(player);
                player = new HeartsPlayer();
                player.Initialize('Seward', false, difficulty, 'East');
                this.players.push(player);
            }
            break;
            default:
            {
                player = new HeartsPlayer();
                player.Initialize('Charlotte', false, difficulty, 'West');
                this.players.push(player);
                player = new HeartsPlayer();
                player.Initialize('Dixon', false, difficulty, 'North');
                this.players.push(player);
                player = new HeartsPlayer();
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
            var score = this.players[i].currentRoundPoints > 0 ? this.players[i].currentRoundPoints : "";
            playerScore.innerText = score;
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
            var score = this.players[i].currentRoundPoints > 0 ? this.players[i].currentRoundPoints : "";
            playerScore.innerText = score;
        
            if (i===0) {
                var playerName = document.getElementById('player_name_' + this.players[i].playerPosition);
                playerName.style.transition = "0.5s linear";
                var pos = eval(playerName.positionFunction);
                playerName.style.left = pos[0] + 'px';
                playerName.style.top = pos[1] + 'px';
            }
        }
    }

    function GetPlayerNamePosition(playerPosition) {
        switch (playerPosition) {
            case 'South':
                if (game.players[0].currentRoundPoints > 0) {
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
                return [40,270];
            case 'North':
                return [gameContainer.innerWidth*0.5 + 160,50];
            default:
                return [gameContainer.innerWidth-140,270];
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

    this.AnimateDealCardsForRound = function() {
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

        this.ResetPlayerRoundScores();

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
            game.currentMoveStage = "ChoosingPassCards";
        }, 50);
        
        setTimeout(function() {
            var passingIndex = game.roundNumber % 4;
            switch (passingIndex) {
            case 0:
                game.StartTrickTaking();
                break;
            default:
                game.GetPassingCardsFromAllPlayers(passingIndex);
                break;
        }
        }, 500);
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

    this.GetPassingCardsFromAllPlayers = function(passingIndex) {
        for (var i=1; i<4; i++) {
            var player = this.players[i];
            player.ChoosePassingCards();
        }

        currentPassingCardView_0 = null;
        currentPassingCardView_1 = null;
        currentPassingCardView_2 = null;

        var selectPassingCardsMessage = document.getElementById('hearts_select_passing_cards_message');
        switch (passingIndex) {
            case 0:
                selectPassingCardsMessage.innerText = "Select 3 cards to pass left:";
                break;
            case 1:
                selectPassingCardsMessage.innerText = "Select 3 cards to pass right:";
                break;
            default:
                selectPassingCardsMessage.innerText = "Select 3 cards to pass across:";
                break;
        }
        selectPassingCardsMessage.positionFunction = "GetPassingCardsMessageLocation()";
        var loc = eval(selectPassingCardsMessage.positionFunction);
        selectPassingCardsMessage.style.transition = "none";
        selectPassingCardsMessage.style.left = loc[0] + "px";
        selectPassingCardsMessage.style.top = loc[1] + "px";
        with (selectPassingCardsMessage.style) {
            visibility = "visible";
            transition = "0.5s linear";
            transitionDelay = "1s";
            opacity = 1;
        }

        for (var i=0; i<3; i++) {
            var selectPassingCardsRegion = document.getElementById('select_passing_cards_region_' + i);
            selectPassingCardsRegion.positionFunction = "GetPassingCardsLocation(" + i + ")";
            var loc = eval(selectPassingCardsRegion.positionFunction);
            selectPassingCardsRegion.style.transition = "none";
            selectPassingCardsRegion.style.left = loc[0] + "px";
            selectPassingCardsRegion.style.top = loc[1] + "px";
            with (selectPassingCardsRegion.style) {
                visibility = "visible";
                transition = "0.5s linear";
                transitionDelay = "1s";
                opacity = 1;
            }
        }

        this.currentMoveStage = "ChoosingPassCards";
        
        if (this.skillLevel === 'Easy' || this.settings.GetSetting('setting_hints')) {
          ShowHintButton(1000);
        }
    }

    function GetPassingCardsMessageLocation() {
        return [0, 100];
    }

    function GetPassingCardsLocation(index)
    {
        var left = 0;
        switch (index) {
            case 0:
                left = gameContainer.innerWidth*0.5 - 130;
                break;
            case 1:
                left = gameContainer.innerWidth*0.5;
                break;
            default:
                left = gameContainer.innerWidth*0.5 + 130;
                break;
        }

        return [left- cardLoweredWidth*0.5, 140];
    }

    var currentPassingCardView_0 = null;
    var currentPassingCardView_1 = null;
    var currentPassingCardView_2 = null;
    var currentDraggedCardWasLastInHand;

    function passingCardsPointerPressed() {

        // Find the autoplay line for dropped cards
        if (currentDraggedCardView === currentPassingCardView_0) {
            currentDraggedCardView.style.zIndex = 200;
            autoPlayBoundaryY = GetPassingCardsLocation(0)[1] + 70;
            currentPassingCardView_0 = null;
            currentDraggedCardWasLastInHand = false;
            HidePassCardsButton();
            game.players[0].passingCards.splice(game.players[0].passingCards.indexOf(currentDraggedCardView.card),1);
            game.players[0].cards.push(currentDraggedCardView.card);
            // Sort the players hand
            game.players[0].cards.sort(function(a,b) {
                if (a.suit != b.suit) {
                    return a.suitInt - b.suitInt;
                } else {
                    return a.value - b.value;
                }
            });
        } else if (currentDraggedCardView === currentPassingCardView_1) {
            currentDraggedCardView.style.zIndex = 200;
            autoPlayBoundaryY = GetPassingCardsLocation(0)[1] + 70;
            currentPassingCardView_1 = null;
            currentDraggedCardWasLastInHand = false;
            HidePassCardsButton();
            game.players[0].passingCards.splice(game.players[0].passingCards.indexOf(currentDraggedCardView.card),1);
            game.players[0].cards.push(currentDraggedCardView.card);
            // Sort the players hand
            game.players[0].cards.sort(function(a,b) {
                if (a.suit != b.suit) {
                    return a.suitInt - b.suitInt;
                } else {
                    return a.value - b.value;
                }
            });
        } else if (currentDraggedCardView === currentPassingCardView_2) {
            currentDraggedCardView.style.zIndex = 200;
            autoPlayBoundaryY = GetPassingCardsLocation(0)[1] + 70;
            currentPassingCardView_2 = null;
            currentDraggedCardWasLastInHand = false;
            HidePassCardsButton();
            game.players[0].passingCards.splice(game.players[0].passingCards.indexOf(currentDraggedCardView.card),1);
            game.players[0].cards.push(currentDraggedCardView.card);
            // Sort the players hand
            game.players[0].cards.sort(function(a,b) {
                if (a.suit != b.suit) {
                    return a.suitInt - b.suitInt;
                } else {
                    return a.value - b.value;
                }
            });
        } else {
            autoPlayBoundaryY = GetHandCardLocation('South', 0, 13)[1] - 50;
            currentDraggedCardWasLastInHand = true;
        }
        raiseCard(currentDraggedCardView);
    }

    function cardTouchFinished() {
        
        // Check for tap
        var distX = pos3 - currentDraggedCardView.startPosition[0];
        var distY = pos4 - currentDraggedCardView.startPosition[1];
        var distance = Math.sqrt(distX * distX + distY * distY);
        var elapsed = Date.now() - currentDraggedCardView.startTime;
        var tapped = elapsed < 500 && distance < 10;

        if (game.currentMoveStage === 'ChoosingPassCards') {
            if (currentDraggedCardWasLastInHand) {
                if (tapped || (currentDraggedCardView.offsetTop < autoPlayBoundaryY)) {
                    DropCurrentDraggedCardViewIntoPassingSlot();
                } else {
                    AnimatePlayerHandCardsIntoPosition('South', "0.3s");
                }
            } else {
                if (tapped || currentDraggedCardView.offsetTop > autoPlayBoundaryY) {
                    AnimatePlayerHandCardsIntoPosition('South', "0.3s");
                } else {
                    DropCurrentDraggedCardViewIntoPassingSlot();
                }
            }
        } else if (game.currentMoveStage === 'ChoosingTrickCard') {
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

    function DropCurrentDraggedCardViewIntoPassingSlot()
    {
        var player = game.players[0];
        if (player.passingCards.length < 3) {
            var indexOfCard = player.cards.indexOf(currentDraggedCardView.card);
            var card = player.cards[indexOfCard];
            player.cards.splice(indexOfCard, 1);
            player.passingCards.push(card);
            
            // Pick the closest passing spot
            var closestOpenPassingIndex = -1;
            var closestDistance = 10000000;
            for (var i=0; i<3; i++) {
                switch (i) {
                    case 0:
                        if (currentPassingCardView_0 !== null) {
                            continue;
                        }
                        break;
                    case 1:
                        if (currentPassingCardView_1 !== null) {
                            continue;
                        }
                        break;
                    case 2:
                        if (currentPassingCardView_2 !== null) {
                            continue;
                        }
                        break;
                }
                var spotLoc = GetPassingCardsLocation(i);
                var distX = currentDraggedCardView.offsetLeft - spotLoc[0];
                var distY = currentDraggedCardView.offsetTop - spotLoc[1];
                var dist = Math.sqrt(distX*distX + distY*distY);
                if (dist < closestDistance) {
                    closestDistance = dist;
                    closestOpenPassingIndex = i;
                }
            }
            
            switch (closestOpenPassingIndex) {
                case 0:
                    currentPassingCardView_0 = currentDraggedCardView;
                    break;
                case 1:
                    currentPassingCardView_1 = currentDraggedCardView;
                    break;
                case 2:
                    currentPassingCardView_2 = currentDraggedCardView;
                    break;
                default:
                    AnimatePlayerHandCardsIntoPosition('South', "0.3s");
                    return;

            }
            currentDraggedCardView.positionFunction = 'GetPassingCardsLocation(' + closestOpenPassingIndex + ')';
            var pos = eval(currentDraggedCardView.positionFunction);
            with (currentDraggedCardView.style) {
                transition =  "0.3s ease-out";
                transitionDelay = '0ms';
                left = pos[0] + "px";
                top = pos[1] + "px";
                transform = 'rotate(0deg)';
                zIndex = 0;
            }

            if (player.passingCards.length === 3) {
                ShowPassCardsButton();
            }
        }
        
        AnimatePlayerHandCardsIntoPosition('South', "0.3s");
    }

    function ShowPassCardsButton() {
        var passCardsRegion = document.getElementById('hearts_confirm_passing_cards_region');
        passCardsRegion.positionFunction = 'GetPassingCardsConfirmLocation()';
        var loc = eval(passCardsRegion.positionFunction);
        passCardsRegion.style.transition = 'none';
        passCardsRegion.style.left = loc[0] + 'px';
        passCardsRegion.style.top = loc[1] + 'px';
        passCardsRegion.style.visibility = "visible";
        with (passCardsRegion.style) {
            transition = "0.3s linear";
            opacity = 1;
            pointerEvents = "auto";
        }
    }

    function GetPassingCardsConfirmLocation() {
        var loc = GetPassingCardsLocation(0);
        return [gameContainer.innerWidth*0.5, loc[1] + 185];
    }

    function HidePassCardsButton() {
        var confirmCribRegion = document.getElementById('hearts_confirm_passing_cards_region');
        with (confirmCribRegion.style) {
            transition = "0.2s linear";
            opacity = 0;
            pointerEvents = "none";
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
        var hintButton = document.getElementById('hearts_hint_button');
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
        var hintButton = document.getElementById('hearts_hint_button');
        hintButton.style.opacity = 0;
        hintButton.style.pointerEvents = "none";
    }

    this.OnHintButtonClick = function () {
        this.BumpHintCards();
    }

    this.OnTestButtonClick = function() {
        var player = this.players[0];
        var bestResult = HeartsFindOptimalPlayForCurrentPlayer(game, true, true);
        BumpCard(bestResult.optimalCard.cardView);
    }

    this.BumpHintCards = function() {
        var optimalCards = [];
        if (this.currentMoveStage === 'ChoosingPassCards') {
            var player = this.players[0];
            var bestCards = player.FindBestPassingCards();
            for (var i=0; i<bestCards.length; i++) {
                optimalCards.push(bestCards[i]);
            }
            
        } else if (this.currentMoveStage === 'ChoosingTrickCard') {
            var player = this.players[0];
            var bestCard = player.FindBestPlayingCard(game, true);
            optimalCards.push(bestCard);
        }

        BumpCards(optimalCards, 0);
    }

    this.passingCardsConfirmed = function() {
        // PerformCardPassingBetweenPlayers
        this.currentMoveStage = 'None';
        HidePassCardsButton();
        HideHintButton();

        var player = this.players[1];
        for (var i=0; i<player.passingCards.length; i++) {
            var card =  player.passingCards[i];
            var cardView = card.cardView;
            with (cardView.style) {
                transition = "0.3s ease-in-out";
                left = (cardView.offsetLeft + 30) + "px";
            }
        }

        player = this.players[2];
        for (var i=0; i<player.passingCards.length; i++) {
            var card =  player.passingCards[i];
            var cardView = card.cardView;
            with (cardView.style) {
                transition = "0.3s ease-in-out";
                top = (cardView.offsetTop + 30) + "px";
            }
        }

        player = this.players[3];
        for (var i=0; i<player.passingCards.length; i++) {
            var card =  player.passingCards[i];
            var cardView = card.cardView;
            with (cardView.style) {
                transition = "0.3s ease-in-out";
                left = (cardView.offsetLeft - 30) + "px";
            }
        }

        for (var i=0; i<3; i++) {
            var selectPassingCardsRegion = document.getElementById('select_passing_cards_region_' + i);
            with (selectPassingCardsRegion.style) {
                transition = "0.3s linear";
                transitionDelay = "0s";
                opacity = 0;
            }
        }

        var passingCardsMessage = document.getElementById('hearts_select_passing_cards_message');
        with (passingCardsMessage.style) {
            transition = "0.3s linear";
            transitionDelay = "0s";
            opacity = 0;
        }

        setTimeout(() => {
            var passingIndex = game.roundNumber % 4;
            switch (passingIndex) {
                case 1: {
                    // Pass left
                    for (var i=0; i<4; i++) {
                        var player = game.players[i];
                        var passPlayer = game.players[(i+1)%4];
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
                        var player = game.players[i];
                        var passPlayer = game.players[(i-1+4)%4];
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
                        var player = game.players[i];
                        var passPlayer = game.players[(i+2)%4];
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

            AnimatePassingCardsIntoHands();
        }, 350);
    }

    function AnimatePassingCardsIntoHands() {
        AnimatePlayerHandCardsIntoPosition('West', "1s");
        AnimatePlayerHandCardsIntoPosition('North', "1s");
        AnimatePlayerHandCardsIntoPosition('East', "1s");

        var player = game.players[0];
        player.receivedCards.sort(function(a,b) {
            if (a.suit != b.suit) {
                return a.suitInt - b.suitInt;
            } else {
                return a.value - b.value;
            }
        });

        for (var i=0; i<3; i++) {
            var card = player.receivedCards[i];
            var cardView = card.cardView;
            flipUpCard(cardView);
            var loc = GetPassingCardsLocation(i);
            with (cardView.style) {
                transition = "0.8s ease-in-out";
                left = loc[0] + 'px';
                top = loc[1] + 50 + 'px';
                transform = 'rotate(0deg)';
            }
        }

        player.cards.sort(function(a,b) {
            if (a.suit != b.suit) {
                return a.suitInt - b.suitInt;
            } else {
                return a.value - b.value;
            }
        });

        for (var i=0; i<player.cards.length; i++) {
            var cardView = player.cards[i].cardView;
            cardView.style.zIndex = 100 + i;
        }

        setTimeout(function() {
            AnimatePlayerHandCardsIntoPosition('South', '1s');
            setTimeout(function() {
                game.StartTrickTaking();
            }, 1500);
        }, 2000);
    }

    this.StartTrickTaking = function() {
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
        var nextPlayer = this.players[this.turnIndex];
        nextPlayer.ChoosePlayCard();
    }

    this.PromptPlayerToPlayCard = function() {
        var playerPrompt = document.getElementById('hearts_player_play_prompt');
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

    this.OnPlayerChosePlayCard = function(card) {
        this.currentMoveStage = 'None';
        var playerPrompt = document.getElementById('hearts_player_play_prompt');
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
            trickResult.trickTaker.currentRoundPoints += trickResult.points;
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

    this.AnimateTrickResult = function(trickResult) {
        var cardView = trickResult.highestCard.cardView;
        FlashHighlightCardView(cardView);

        var delay = 1400;
        if (trickResult.points === 13) {
            AnimateScoreBubble(trickResult.trickTaker.playerPosition, 0, 13, 500);
            delay += 500;
        } else if (trickResult.points > 13) {
            AnimateScoreBubble(trickResult.trickTaker.playerPosition, trickResult.points-13, 13, 500);
            delay += 500;
        } else if (trickResult.points > 0) {
            AnimateScoreBubble(trickResult.trickTaker.playerPosition, trickResult.points, 0, 500);
            delay += 500;
        }

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

        if (trickResult.points > 0) {
            // UpdatePlayerRoundScore
            var scoreView = document.getElementById('player_score_' + trickResult.trickTaker.playerPosition);
            if (trickResult.trickTaker.playerPosition === 'South') {
                var southName = document.getElementById('player_name_South');
                var loc = eval(southName.positionFunction);
                with (southName.style) {
                    transition = "0.3s linear";
                    transitionDelay = "1.5s";
                    top = loc[1] + 'px';
                }
            }
            setTimeout(function() {
                scoreView.innerHTML = trickResult.trickTaker.currentRoundPoints;
            }, 2000);
        }

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

    function AnimateScoreBubble(playerPosition, heartsPoints, spadesPoints, delay) {

        setTimeout(function () {
            
            var posLeftHeart = 0;
            var posLeftSpade = 0;
            var posTop = 250 - 50;
            var slideDistance = 200;
            
            if (heartsPoints > 0 && spadesPoints > 0) {
                var heartTemplate = document.getElementById('BubbleScoreHeartTemplate');
                var heartScoreBubble = heartTemplate.cloneNode(true);
                heartScoreBubble.getElementsByClassName('BubbleScoreHeartsPoints')[0].innerText = "+" + heartsPoints;
                posLeftHeart = gameContainer.innerWidth*0.5 - 50 - 25;
                var spadeTemplate = document.getElementById('BubbleScoreSpadeTemplate');
                var spadeScoreBubble = spadeTemplate.cloneNode(true);
                spadeScoreBubble.getElementsByClassName('BubbleScoreSpadesPoints')[0].innerText = "+" + spadesPoints;
                posLeftSpade = gameContainer.innerWidth*0.5 + 25;
            } else if (spadesPoints > 0) {
                var spadeTemplate = document.getElementById('BubbleScoreSpadeTemplate');
                var spadeScoreBubble = spadeTemplate.cloneNode(true);
                spadeScoreBubble.getElementsByClassName('BubbleScoreSpadesPoints')[0].innerText = "+" + spadesPoints;
                posLeftSpade = gameContainer.innerWidth*0.5 - 42
            } else if (heartsPoints > 0) {
                var heartTemplate = document.getElementById('BubbleScoreHeartTemplate');
                var heartScoreBubble = heartTemplate.cloneNode(true);
                heartScoreBubble.getElementsByClassName('BubbleScoreHeartsPoints')[0].innerText = "+" + heartsPoints;
                posLeftHeart = gameContainer.innerWidth*0.5 - 50
            }
            
            switch (playerPosition) {
                case 'South':
                    slideDistance = gameContainer.innerHeight*0.5;
                    var posLeftHeartEnd = posLeftHeart;
                    var posLeftSpadeEnd = posLeftSpade;
                    var posTopHeartEnd = posTop + slideDistance;
                    var posTopSpadeEnd = posTop + slideDistance;
                break;
                case 'West':
                    slideDistance = gameContainer.innerWidth*0.5;
                    var posLeftHeartEnd = posLeftHeart - slideDistance;
                    var posLeftSpadeEnd = posLeftSpade - slideDistance;
                    var posTopHeartEnd = posTop;
                    var posTopSpadeEnd = posTop;
                break;
                case 'North':
                    slideDistance = gameContainer.innerHeight*0.5;
                    var posLeftHeartEnd = posLeftHeart;
                    var posLeftSpadeEnd = posLeftSpade;
                    var posTopHeartEnd = posTop - slideDistance;
                    var posTopSpadeEnd = posTop - slideDistance;
                break;
                case 'East':
                    slideDistance = gameContainer.innerWidth*0.5;
                    var posLeftHeartEnd = posLeftHeart + slideDistance;
                    var posLeftSpadeEnd = posLeftSpade + slideDistance;
                    var posTopHeartEnd = posTop;
                    var posTopSpadeEnd = posTop;
                    break;
            }

            if (heartsPoints > 0) {
                heartScoreBubble.style.opacity = 1;
                heartScoreBubble.style.transition = "none";
                heartScoreBubble.style.transform = 'scale(0)';
                heartScoreBubble.style.left = posLeftHeart + "px";
                heartScoreBubble.style.top = posTop + "px";
                heartScoreBubble.style.zIndex = 500;
                heartScoreBubble.style.visibility = 'visible';

                var cards_region = document.getElementById('cards_region');
                cards_region.appendChild(heartScoreBubble);
                setTimeout(function () {
                    heartScoreBubble.style.transition = "0.3s ease-in";
                    heartScoreBubble.style.transform = 'scale(1)';
                    setTimeout(function () {
                        heartScoreBubble.style.transition = "1s ease-in";
                        heartScoreBubble.style.left = posLeftHeartEnd + 'px';
                        heartScoreBubble.style.top = posTopHeartEnd + 'px';
                        heartScoreBubble.style.opacity = 0;
                        setTimeout(function () {
                            cards_region.removeChild(heartScoreBubble);
                        }, 1000);
                    }, 1200);
                }, 50);
            }
            if (spadesPoints > 0) {
                spadeScoreBubble.style.opacity = 1;
                spadeScoreBubble.style.transition = "none";
                spadeScoreBubble.style.transform = 'scale(0)';
                spadeScoreBubble.style.left = posLeftSpade + "px";
                spadeScoreBubble.style.top = posTop + "px";
                spadeScoreBubble.style.zIndex = 500;
                spadeScoreBubble.style.visibility = 'visible';

                var cards_region = document.getElementById('cards_region');
                cards_region.appendChild(spadeScoreBubble);
                setTimeout(function () {
                    spadeScoreBubble.style.transition = "0.3s ease-in";
                    spadeScoreBubble.style.transform = 'scale(1)';
                    setTimeout(function () {
                        spadeScoreBubble.style.transition = "1s ease-in";
                        spadeScoreBubble.style.left = posLeftSpadeEnd + 'px';
                        spadeScoreBubble.style.top = posTopSpadeEnd + 'px';
                        spadeScoreBubble.style.opacity = 0;
                        setTimeout(function () {
                            cards_region.removeChild(spadeScoreBubble);
                        }, 1000);
                    }, 1200);
                }, 50);
            }

        }, delay);
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
            this.AnimateShootTheMoonForPlayer(moonShootPlayer);
            if (moonShootPlayer.isHuman) {
                var setting = 'stat_moons_shot_' + this.skillLevel;
                var settingVal = this.settings.GetStatistic(setting);
                this.settings.SetStatistic(setting, settingVal + 1);
            }
        } else {
            this.ContinueAfterRoundResultAnimations();
        }
    }

    this.AnimateShootTheMoonForPlayer = function(player) {
        var heartsCardViews = [];
        for (var i=0; i<cards.length; i++) {
            if (cards[i].suit === 'H') {
                heartsCardViews.push(cards[i].cardView);
            }
        }
        heartsCardViews.sort(function(a,b){
            return a.card.value - b.card.value;
        });
        heartsCardViews.push(this.GetCardFromString('QS').cardView);

        var labelText = "";
        var handReturnLeft = 0;
        var handReturnTop = 0;
        switch (player.playerPosition) {
            case 'South':
                labelText = "You shot the moon!";
                handReturnLeft = gameContainer.innerWidth*0.5;
                handReturnTop = gameContainer.innerHeight + 180;
                break;
            case 'West':
                labelText = player.name + " shot the moon.";
                handReturnLeft = -180;
                handReturnTop = gameContainer.innerHeight*0.5;
                break;
            case 'North':
                labelText = player.name + " shot the moon.";
                handReturnLeft = gameContainer.innerWidth*0.5;
                handReturnTop = -220;
                break;
            default:
                labelText = player.name + " shot the moon.";
                handReturnLeft = gameContainer.innerWidth + 220;
                handReturnTop = gameContainer.innerHeight*0.5;
                break;
        }

        var moonShootText = document.getElementById('hearts_moon_shoot_text');
        moonShootText.innerHTML = labelText;
        with (moonShootText.style) {
            transition = '1s linear';
            transitionDelay = '1s';
            visibility = 'visible';
            opacity = 1;
        }

        var curDelay = 0;
        var delayIncrement = 0.1;
        for (var i=0; i<heartsCardViews.length; i++) {
            var cardView = heartsCardViews[i];
            
            var firstLeft = gameContainer.innerWidth*0.5 - 200;
            var lastLeft = gameContainer.innerWidth*0.5  + 200;
            var firstTop = gameContainer.innerHeight*0.4;
            var lastTop = gameContainer.innerHeight*0.4;
            var handWidth = lastLeft-firstLeft;
            var cardSpacing = handWidth/(heartsCardViews.length-1);
            var curLeft = firstLeft + i*cardSpacing;
            var percent = (curLeft - firstLeft)/handWidth;
            var radius = 400;
            var distanceFromCenter = handWidth*(0.5 - percent);
            var curveHeight = Math.sqrt(radius*radius-distanceFromCenter*distanceFromCenter) - Math.sqrt(radius*radius - handWidth*0.5*handWidth*0.5); 
            var curveRotation = Math.asin(-distanceFromCenter/radius)*180/Math.PI;
            var curTop = firstTop - curveHeight;
            var endLeft = curLeft-cardLoweredWidth*0.5;
            var endTop = curTop-cardLoweredHeight*0.5;
            
            flipDownCard(cardView, false);
            setTimeout(flipUpCard, 100 + curDelay*1000, cardView);
            with (cardView.style) {
                transition = "0.3s ease-out";
                transitionDelay = curDelay + "s";
                left = endLeft + 'px';
                top = endTop + 'px';
                transform = 'rotate(' + curveRotation + 'deg)';
                zIndex = i;
                visibility = 'visible';
            }
            curDelay = curDelay + delayIncrement;
        }

        setTimeout(function(desLeft, desTop) {
            for (var i=0; i<heartsCardViews.length; i++) {
                var cardView = heartsCardViews[i];
                with (cardView.style) {
                    left = desLeft + 'px';
                    top = desTop + 'px';
                    transform = 'rotate(180deg)';
                }
            }
            var moonShootText = document.getElementById('hearts_moon_shoot_text');
            with (moonShootText.style) {
                transition = '1s linear';
                opacity = 0;
            }
            setTimeout(game.ContinueAfterRoundResultAnimations, 1000);
        }, 4000, handReturnLeft, handReturnTop);

    }

    this.ContinueAfterRoundResultAnimations = function() {
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

        var gameOverView = document.getElementById('HeartsGameOverView');
        var gameOverLine1Elem = document.getElementById('HeartsGameOverResultText');
        gameOverLine1Elem.innerText = gameOverLine1;
        var gameOverLine2Elem = document.getElementById('HeartsGameOverResultText2');
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
            return a.gameScore - b.gameScore;
        });
        for (var i=0; i<4; i++) {
            if (p[i].isHuman) {
                return i+1;
            }
        }
        return 0;
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
            'hearts_select_passing_cards_message',
            'select_passing_cards_region_0',
            'select_passing_cards_region_1',
            'select_passing_cards_region_2',
            'hearts_hint_button',
            'hearts_confirm_passing_cards_region',
            'hearts_player_play_prompt'
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
            'hearts_select_passing_cards_message',
            'select_passing_cards_region_0',
            'select_passing_cards_region_1',
            'select_passing_cards_region_2',
            'hearts_hint_button',
            'hearts_confirm_passing_cards_region',
            'hearts_player_play_prompt'
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
    // MENUS
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

    this.ShowDifficultiesExplainedMenu = function() {
        var menuName = visibleMenuCards[visibleMenuCards.length-1];
        MenuCardPressDown(menuName);
        MenuCardAppear("menu_difficulties_explained");
    }

    this.ShowStatisticsMenu = function() {
        var menuName = visibleMenuCards[visibleMenuCards.length-1];
        MenuCardPressDown(menuName);
        this.InitializeStatisticsView();
        MenuCardAppear("menu_statistics");
    }

    this.ShowSettingsMenu = function() {
        this.InitializeSettingsView();
        var menuName = visibleMenuCards[visibleMenuCards.length-1];
        MenuCardPressDown(menuName);
        MenuCardAppear("menu_settings");
    }

    this.InitializeSettingsView = function() {
		document.getElementById("setting_hints_checkbox").checked = this.settings.GetSetting('setting_hints');
		document.getElementById("losing_score_dropdown").value = this.settings.GetSetting('setting_losing_score');
	
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
    
    this.SettingLosingScoreChanged = function(losingScoreSelect) {
        this.settings.SetSetting('setting_losing_score', losingScoreSelect.value);
    }
    
    this.InitializeStatisticsView = function() {
        
        var difficulties = ["Easy", "Standard", "Pro"];
        var totalGamesPlayed = 0;
        var totalWins = 0;
        var total2nds = 0;
        var total3rds = 0;
        var total4ths = 0;
        var totalMoonsShot = 0;
        for (var i=0; i<difficulties.length; i++) {
            var curDifficulty = difficulties[i];
            var wins = this.settings.GetStatistic('stat_wins_' + curDifficulty);
            var stat2nds = this.settings.GetStatistic('stat_2nd_' + curDifficulty);
            var stat3rds = this.settings.GetStatistic('stat_3rd_' + curDifficulty);
            var stat4ths = this.settings.GetStatistic('stat_4th_' + curDifficulty);
            var moonsShot = this.settings.GetStatistic('stat_moons_shot_' + curDifficulty);
            var gamesPlayed = wins + stat2nds + stat3rds + stat4ths;
            var gamesPlayedElement = document.getElementById('menu_stat_games_played_' + curDifficulty);
            var winsElement = document.getElementById('menu_stat_wins_' + curDifficulty);
            var stat2ndsElement = document.getElementById('menu_stat_2nd_' + curDifficulty);
            var stat3rdsElement = document.getElementById('menu_stat_3rd_' + curDifficulty);
            var stat4thsElement = document.getElementById('menu_stat_4th_' + curDifficulty);
            var moonsShotElement = document.getElementById('menu_stat_moons_shot_' + curDifficulty);
            var winPercentElement = document.getElementById('menu_stat_win_percent_' + curDifficulty);
            if (gamesPlayed > 0) {
                gamesPlayedElement.innerText = gamesPlayed;
                winsElement.innerText = wins;
                stat2ndsElement.innerText = stat2nds;
                stat3rdsElement.innerText = stat3rds;
                stat4thsElement.innerText = stat4ths;
                moonsShotElement.innerText = moonsShot;
                winPercentElement.innerText = parseFloat(100*wins / gamesPlayed).toFixed(0) + "%";
            } else {
                gamesPlayedElement.innerText = "";
                winsElement.innerText = "";
                stat2ndsElement.innerText = "";
                stat3rdsElement.innerText = "";
                stat4thsElement.innerText = "";
                moonsShotElement.innerText = "";
                winPercentElement.innerText = "";
            }
            totalGamesPlayed = totalGamesPlayed + gamesPlayed;
            totalWins = totalWins + wins;
            total2nds = total2nds + stat2nds;
            total3rds = total2nds + stat3rds;
            total4ths = total2nds + stat4ths;
            totalMoonsShot = totalMoonsShot + moonsShot;
        }
        var gamesPlayedElement = document.getElementById('menu_stat_games_played_Total');
        var winsElement = document.getElementById('menu_stat_wins_Total');
        var stat2ndsElement = document.getElementById('menu_stat_2nd_Total');
        var stat3rdsElement = document.getElementById('menu_stat_3rd_Total');
        var stat4thsElement = document.getElementById('menu_stat_4th_Total');
        var moonsShotElement = document.getElementById('menu_stat_moons_shot_Total');
        var winPercentElement = document.getElementById('menu_stat_win_percent_Total');
        if (totalGamesPlayed > 0) {
            gamesPlayedElement.innerText = totalGamesPlayed;
            winsElement.innerText = totalWins;
            stat2ndsElement.innerText = total2nds;
            stat3rdsElement.innerText = total3rds;
            stat4thsElement.innerText = total4ths;
            moonsShotElement.innerText = totalMoonsShot;
            winPercentElement.innerText = parseFloat(100*totalWins / totalGamesPlayed).toFixed(0) + "%";
        } else {
            gamesPlayedElement.innerText = "0";
            winsElement.innerText = "0";
            stat2ndsElement.innerText = "0";
            stat3rdsElement.innerText = "0";
            stat4thsElement.innerText = "0";
            moonsShotElement.innerText = "0";
            winPercentElement.innerText = "";
        }
    }

    this.ResetStatisticsButtonClick = function() {
        var r = confirm("Are you sure you want to reset your statistics?");
        if (r != true) {
            return;
        }
    
        this.settings.ResetStatistics();
        this.InitializeStatisticsView();
    }

}

/*
*
*  Game Simulator
*
*/
var HeartsFindOptimalPlayForCurrentPlayer = function(aGame, isForHint) {
    
    var maxSimulations = 5000;
    var simsPerPossiblePlay = 1000;
    
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

    console.log(optimalPlayResult.possibleCardsScores);
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
