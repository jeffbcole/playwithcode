var PinochleGame = function () {

    // Global Game Settings
    this.settings = new PinochleSettings();
    
    // Constants
    var cardLoweredWidth = 115;
    var cardLoweredHeight = 162;
    
    // Local variables
    var scoreboard = new PinochleScoreboard();
    var currentDraggedCardView;
    var currentPlayerHandCardSpacing = 0;
    var autoPlayBoundaryY = 0;

    // Members
    this.currentMoveStage = "";
    this.skillLevel = "";
    this.winningScore = 0;
    this.isDoubleDeck = false;
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

    // Inject all the html elements
    gameContainer.innerHTML = 
        '<div id="below_cards_messages_region">\
            <div class="pinochle_player_name" id="player_name_South"></div>\
            <div class="pinochle_player_name" id="player_name_West" style="text-align: left; margin-left:10px"></div>\
            <div class="pinochle_player_name" id="player_name_North"></div>\
            <div class="pinochle_player_name" id="player_name_East" style="text-align: right;"></div>\
            \
            <div class="pinochle_player_score" id="player_score_South"></div>\
            <div class="pinochle_player_score" id="player_score_West" style="text-align:left; margin-left:10px"></div>\
            <div class="pinochle_player_score" id="player_score_North"></div>\
            <div class="pinochle_player_score" id="player_score_East" style="text-align:right; margin-right:10px"></div>\
            \
            <div id="pinochle_player_play_prompt">Drop a card here</div>\
            \
            <div id="pinochle_select_passing_cards_message">Select 3 cards to pass left:</div>\
            <div id="select_passing_cards_region_0" class="pinochle_select_passing_card_region"></div>\
            <div id="select_passing_cards_region_1" class="pinochle_select_passing_card_region"></div>\
            <div id="select_passing_cards_region_2" class="pinochle_select_passing_card_region"></div>\
            <div id="select_passing_cards_region_3" class="pinochle_select_passing_card_region"></div>\
            <button id="pinochle_confirm_passing_cards_button" onclick="game.passingCardsConfirmed()">Pass Cards</button>\
            \
            <button id="pinochle_hint_button" onclick="game.OnHintButtonClick()">Hint</button>\
            <button id="pinochle_undo_button" onclick="game.OnUndoButtonClick()">Undo</button>\
            <button id="pinochle_redo_button" onclick="game.OnRedoButtonClick()">Redo</button>\
            \
            <div id="pinochle_trump_suit_indicator">\
                <center>\
                    <div id="trump_suit_text">Trump</div>\
                    <div id="pinochle_trump_suit_image"></div>\
                </center>\
            </div>\
            \
            <div id="pinochle_scoreboard">\
                <div id="pinochle_scoreboardBackground" onclick="game.OnScoreboardClick()">\
                    <div id="PinochleScoreboardNorthSouth">\
                        <div class="pinochle_scoreboard_name" id="scoreboardNameNorthSouth">You & Dixon</div>\
                        <div id="PinochleScoreboardScoreBackgroundNorthSouth"></div>\
                        <div id="PinochleScoreboardScoreFillNorthSouth"></div>\
                        <div class="pinochle_scoreboard_score" id="scoreboardScoreNorthSouth"></div>\
                    </div>\
                    <div id="PinochleScoreboardEastWest">\
                        <div class="pinochle_scoreboard_name" id="scoreboardNameEastWest">Charlotte & Isabella</div>\
                        <div id="PinochleScoreboardScoreBackgroundEastWest"></div>\
                        <div id="PinochleScoreboardScoreFillEastWest"></div>\
                        <div class="pinochle_scoreboard_score" id="scoreboardScoreEastWest"></div>\
                    </div>\
                    \
                    <div id="PinochleScoreboardRowBid">\
                        <div class="pinochle_scoreboard_row_title">Bid</div>\
                        <div class="pinochle_scoreboard_row_label_north_south" id="scoreboardRowBidNorthSouth"></div>\
                        <div class="pinochle_scoreboard_row_label_east_west" id="scoreboardRowBidEastWest"></div>\
                    </div>\
                    \
                    <div id="PinochleScoreboardRowMeld">\
                        <div class="pinochle_scoreboard_row_title">Meld</div>\
                        <div class="pinochle_scoreboard_row_label_north_south" id="scoreboardRowMeldNorthSouth"></div>\
                        <div class="pinochle_scoreboard_row_label_east_west" id="scoreboardRowMeldEastWest"></div>\
                    </div>\
                    \
                    <div id="PinochleScoreboardRowCounters">\
                        <div class="pinochle_scoreboard_row_title">Counters</div>\
                        <div class="pinochle_scoreboard_row_label_north_south" id="scoreboardRowCountersNorthSouth"></div>\
                        <div class="pinochle_scoreboard_row_label_east_west" id="scoreboardRowCountersEastWest"></div>\
                    </div>\
                    \
                    <div id="PinochleScoreboardRoundScoresRegion"></div>\
                </div>\
                <div id="PinochleScoreboardDifficulty"></div>\
            </div>\
        </div>\
        \
        <div id="cards_region"></div>\
        \
        <div id="pinochle_choose_bid_view">\
            <table>\
                <tr>\
                    <td><button class="choose_bid_button" onclick="game.OnDecrementBidButtonPressed();" style="width:50px;height:50px">-</button></td>\
                    <td><button id="submit_bid_button" class="choose_bid_button" onclick="game.OnSubmitBidButtonPressed();" style="width:200px;height:60px">Bid: 23</button></td>\
                    <td><button class="choose_bid_button" onclick="game.OnIncrementBidButtonPressed();" style="width:50px;height:50px">+</button></td>\
                </tr>\
                <tr>\
                    <td colspan="3"><div style="text-shadow: 2pt 2pt rgba(0, 0, 0, 0.5);font-size: 16pt;text-align:center;height:25px;">or</div></td>\
                </tr>\
                <tr>\
                    <td colspan="3"><center><button class="choose_bid_button" onclick="game.OnPassBidButtonPressed();" style="width:200px;height:60px">Pass</button></center></td>\
                </tr>\
            </table>\
        </div>\
        \
        <div id="pinochle_choose_trump_suit_view">\
            <table>\
                <tr>\
                    <td colspan="4"><div id="pinochle_choose_trump_prompt">Select the trump suit:</div></td>\
                </tr>\
                <tr>\
                    <td><button class="pinochle_choose_trump_button" onclick="game.OnTrumpSuitButtonPressed(\'S\')"><img class="pinochle_choose_trump_image" src="shared/images/score_spade.png" ondragstart="return false;" /></button></td>\
                    <td><button class="pinochle_choose_trump_button" onclick="game.OnTrumpSuitButtonPressed(\'H\')"><img class="pinochle_choose_trump_image" src="shared/images/score_heart.png" ondragstart="return false;" /></button></td>\
                    <td><button class="pinochle_choose_trump_button" onclick="game.OnTrumpSuitButtonPressed(\'C\')"><img class="pinochle_choose_trump_image" src="shared/images/score_club.png" ondragstart="return false;" /></button></td>\
                    <td><button class="pinochle_choose_trump_button" onclick="game.OnTrumpSuitButtonPressed(\'D\')"><img class="pinochle_choose_trump_image" src="shared/images/score_diamond.png" ondragstart="return false;" /></button></td>\
                </tr>\
            </table>\
        </div>\
        \
        <div id="player_thinking_West" class="pinochle_player_thinking">\
            <svg class="pinochle_circular">\
                <circle class="pinochle_player_thinking_path" cx="25" cy="25" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle>\
            </svg>\
        </div>\
        \
        <div id="player_thinking_North" class="pinochle_player_thinking">\
            <svg class="pinochle_circular">\
                <circle class="pinochle_player_thinking_path" cx="25" cy="25" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle>\
            </svg>\
        </div>\
        \
        <div id="player_thinking_East" class="pinochle_player_thinking">\
            <svg class="pinochle_circular">\
                <circle class="pinochle_player_thinking_path" cx="25" cy="25" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle>\
            </svg>\
        </div>\
        \
        <div class="bid_view" id="bid_view_West">\
            <div class="bid_view_title" id="bid_view_title_West">Bid:</div>\
            <div class="bid_view_value" id="bid_view_value_West" >20</div>\
        </div>\
        \
        <div class="bid_view" id="bid_view_North">\
            <div class="bid_view_title" id="bid_view_title_North">Bid:</div>\
            <div class="bid_view_value" id="bid_view_value_North">20</div>\
        </div>\
        \
        <div class="bid_view" id="bid_view_East">\
            <div class="bid_view_title" id="bid_view_title_East">Bid:</div>\
            <div class="bid_view_value" id="bid_view_value_East">20</div>\
        </div>\
        \
        <div class="bid_view" id="bid_view_South" >\
            <div class="bid_view_title" id="bid_view_title_South">Bid:</div>\
            <div class="bid_view_value" id="bid_view_value_South">20</div>\
        </div>\
        \
        <div class="pinochle_meld_view_north_south" id="meld_view_South">\
                <div class="pinochle_meld_view_title" id="meld_view_title_South">Meld</div>\
                <div class="pinochle_meld_view_value" id="meld_view_value_South">0</div>\
        </div>\
        \
        <div class="pinochle_meld_view_north_south" id="meld_view_North">\
            <div class="pinochle_meld_view_title" id="meld_view_title_North">Meld</div>\
            <div class="pinochle_meld_view_value" id="meld_view_value_North">0</div>\
        </div>\
        \
        <div class="pinochle_meld_view_east_west" id="meld_view_West">\
                <div class="pinochle_meld_view_title" id="meld_view_title_West">Meld</div>\
                <div class="pinochle_meld_view_value" id="meld_view_value_West">0</div>\
        </div>\
        \
        <div class="pinochle_meld_view_east_west" id="meld_view_East">\
            <div class="pinochle_meld_view_title" id="meld_view_title_East">Meld</div>\
            <div class="pinochle_meld_view_value" id="meld_view_value_East">0</div>\
        </div>\
        \
        <div id="accept_meld_view">\
            <div id="accept_meld_view_prompt">Contract is unreachable.<br>You must throw in.</div>\
            <button id="accept_meld_view_button" onclick="game.OnAcceptMeldButtonPressed();" style="width:200px;height:60px">Continue</button>\
            <button id="thow_in_button" onclick="game.OnThrowInButtonPressed();" style="width:200px;height:60px">Throw In</button>\
        </div>\
        \
        <div id="pinochle_trick_score_bubble">\
            <div id="pinochle_trick_score_points">+40</div>\
            <div id="pinochle_trick_score_label">Counters</div>\
        </div>\
        \
        <button id="pinochle_accept_trick_result" onclick="game.OnAcceptTrickButtonPressed();">Continue</button>\
        \
        <div id="pinochle_round_result_view">\
            <div id="pinochle_round_result_title">Round 1</div>\
            <div id="pinochle_round_result_names_row">\
                <div id="pinochle_round_result_names_north_south">You &<br>Amelia</div>\
                <div id="pinochle_round_result_names_east_west">Catalina<br>& Seward</div>\
            </div>\
            <div class="pinochle_round_result_row">\
                <div id="round_result_bid_label" class="pinochle_round_result_row_label">Bid</div>\
                <div id="round_result_bid_north_south" class="pinochle_round_result_row_value_north_south">(22)</div>\
                <div id="round_result_bid_east_west" class="pinochle_round_result_row_value_east_west">(22)</div>\
            </div>\
            <div class="pinochle_round_result_row">\
                <div id="round_result_melds_label" class="pinochle_round_result_row_label">Meld</div>\
                <div id="round_result_melds_north_south" class="pinochle_round_result_row_value_north_south">(22)</div>\
                <div id="round_result_melds_east_west" class="pinochle_round_result_row_value_east_west">(22)</div>\
            </div>\
            <div class="pinochle_round_result_row">\
                <div id="round_result_counters_label" class="pinochle_round_result_row_label">Counters</div>\
                <div id="round_result_counters_north_south" class="pinochle_round_result_row_value_north_south">(22)</div>\
                <div id="round_result_counters_east_west" class="pinochle_round_result_row_value_east_west">(22)</div>\
            </div>\
            <center>\
                <div id="pinochle_round_result_line"></div>\
            </center>\
            <div id="pinochle_round_result_totals_row">\
                <div id="pinochle_round_result_totals_label">Round<br>Score</div>\
                <div id="pinochle_round_result_totals_north_south">+30</div>\
                <div id="pinochle_round_result_totals_east_west">+30</div>\
            </div>\
            <button id="pinochle_accept_round_result_button" onclick="game.OnAcceptRoundResultButtonPressed();">OK</button>\
        </div>\
        \
        <div id="pinochle_round_simulations_view">\
            <button id="round_simulations_close_button" class="close_button" onclick="game.HideRoundSimulationsView()">X</button>\
            <div id="pinochle_round_simulations_title">Bid Analysis</div>\
            <div id="pinochle_round_simulations_subtitle">This is the range of scores for your hand after 1000 round simulations*</div>\
            <div id="pinochle_round_simulations_graphs_container">\
                <div id="round_simulations_histogram_0" class="pinochle_round_simulations_histogram"></div>\
                <div id="round_simulations_histogram_1" class="pinochle_round_simulations_histogram"></div>\
                <div id="round_simulations_histogram_2" class="pinochle_round_simulations_histogram"></div>\
                <div id="round_simulations_histogram_3" class="pinochle_round_simulations_histogram"></div>\
                <div id="pinochle_round_simulations_explanation">* These graphs show the results of simulations of rounds where a player starts with your cards, wins the bid, and then declares the trump suit.  When running each round simulation, the remaining cards are randomly dealt to the rest of the players and all players (including you) are assumed to play the rest of the round using the \'Standard\' skill level.<br><br>The Safe Bid indicator is shown at the score that 90% of the simulations achieved.  The Recommended Bid indicator is shown at the score that 75% of the simulations achieved.</div>\
            </div>\
        </div>\
        \
        <div id="PinochleGameOverView">\
            <div id="PinochleGameOverResultText">You won!</div>\
            <div id="PinochleGameOverResultText2">vs the easy players</div>\
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
            <button id="rules_button" class="menu_button" onclick="game.ShowRulesMenu()">Rules</button>\
        </div>\
        \
        <div id="menu_start_a_game" class="menu_view">\
            <div id="menu_start_a_game_title" class="menu_card_title">Choose opponent skill:</div>\
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
                    For all three difficulty levels the cards are dealt completely at random to you and to the computer players.  Computer players are not given any special advantage and they do not know what cards are in your hand or in any of the other players\' hands.  The difference between the easy, standard, and pro players is their memory of what cards have been played and their strategies used to choose their plays.  If you are finding that the computer is beating you, you will likely benefit from understanding how the computer chooses its next move.\
                <br>\
                <br>\
                <center>\
                    <div style="font-size:16pt">\
                        <u>Easy Computer Strategy</u>\
                    </div>\
                </center>\
                <table class="menu_table_bordered" style="width:100%; text-align:left; font-size:12pt; margin-top:10pt">\
                    <tr>\
                        <td valign="top" width="80pt">Bidding:</td>\
                        <td>Generate a maximum willing bid by picking a random number.  Increment the bid until it is above the maximum willing bid, then pass.</td>\
                    </tr>\
                    <tr>\
                        <td valign="top" width="80pt">Declaring Trump:</td>\
                        <td>Declare trump suit with whichever suit has the highest sum of card values.</td>\
                    </tr>\
                    <tr>\
                        <td valign="top" width="80pt">Passing Cards To Declarer:</td>\
                        <td>Pass a random set of cards.</td>\
                    </tr>\
                    <tr>\
                        <td valign="top" width="80pt">Passing Cards As The Declarer:</td>\
                        <td>Pass a random set of cards.</td>\
                    </tr>\
                    <tr>\
                        <td valign="top" width="80pt">Trick-Taking:</td>\
                        <td>Play a random legal card.</td>\
                    </tr>\
                </table>\
                <br>\
                <center>\
                    <div style="font-size:16pt">\
                        <u>Standard Computer Strategy</u>\
                    </div>\
                </center>\
                <table class="menu_table_bordered" style="width:100%; text-align:left; font-size:12pt; margin-top:10pt">\
                    <tr>\
                        <td valign="top" width="80pt">Bidding:</td>\
                        <td>Simulate many rounds with cards randomly dealt to standard strategy players.  Set the maximum willing bid at the round score achieved in more than 83% of the simulations.</td>\
                    </tr>\
                    <tr>\
                        <td valign="top" width="80pt">Declaring Trump:</td>\
                        <td>Simulate many rounds with cards randomly dealt to standard strategy players.  Pick the trump suit that resulted in the highest willing bid.</td>\
                    </tr>\
                    <tr>\
                        <td valign="top" width="80pt">Passing Cards To Declarer:</td>\
                        <td>First prefer not to pass any cards that result in a meld score for your hand.  Then, prefer to first pass highest trump cards.  Then prefer highest non-trump cards.</td>\
                    </tr>\
                    <tr>\
                        <td valign="top" width="80pt">Passing Cards As The Declarer:</td>\
                        <td>First prefer not to pass any cards that result in a meld score for our hand.  Then, prefer to first pass non-ace cards that would make us void in a suit, then prefer non-trump kings, then non-trump queens, then jack of diamonds (except if just received from partner), then lowest non-trump cards, then lowest trump cards.  Finally, if necessary, we would choose to pass the cards that contribute the least amount of points to our meld score.</td>\
                    </tr>\
                    <tr>\
                        <td valign="top" width="80pt">Trick-Taking When Leading:</td>\
                        <td>Remembering what has been played and what was shown during passing and melding, play the highest trump card that is guaranteed to take the trick.  Otherwise, play the highest non trump card.</td>\
                    </tr>\
                    <tr>\
                        <td valign="top" width="80pt">Trick-Taking When Following Lead:</td>\
                        <td>If we don\'t have a play that can beat what is currently in the trick pile, then if our partner played the current highest trick card then we play our lowest counter.  Otherwise we play our lowest card.  If we do have play options that could beat what is currently in the trick pile, then we play our highest winning card unless we are playing last.  If we are playing last and we can take the trick then we play our lowest card that can take the trick.</td>\
                    </tr>\
                </table>\
                <br>\
                <center>\
                    <div style="font-size:16pt">\
                        <u>Pro Computer Strategy</u>\
                    </div>\
                </center>\
                <table class="menu_table_bordered" style="width:100%; text-align:left; font-size:12pt; margin-top:10pt">\
                    <tr>\
                        <td valign="top" width="80pt">Bidding:</td>\
                        <td>Simulate many rounds with cards randomly dealt to standard strategy players.  Set the maximum willing bid at the round score achieved in more than 75% of the simulations.</td>\
                    </tr>\
                    <tr>\
                        <td valign="top" width="80pt">Declaring Trump:</td>\
                        <td>Simulate many rounds with cards randomly dealt to standard strategy players.  Pick the trump suit that resulted in the highest willing bid.</td>\
                    </tr>\
                    <tr>\
                        <td valign="top" width="80pt">Passing Cards To Declarer:</td>\
                        <td>First prefer not to pass any cards that result in a meld score for your hand.  Then, prefer to pass highest trump cards (except 9\'s of trump).  Then prefer aces.  Then prefer 9s of trump.  Then prefer queen of spades or jack of diamonds.  Then prefer jacks.  Then prefer nines.  Then pass the cards that contribute the least amount of points to our meld score.</td>\
                    </tr>\
                    <tr>\
                        <td valign="top" width="80pt">Passing Cards As The Declarer:</td>\
                        <td>First prefer not to pass any cards that result in a meld score for our hand.  Then prefer non-trump kings, then non-trump queens, then jack of diamonds (except if just received from partner), then lowest non-trump cards, then lowest trump cards.  Finally, if necessary, we would choose to pass the cards that contribute the least amount of points to our meld score.</td>\
                    </tr>\
                    <tr>\
                        <td valign="top" width="80pt">Trick-Taking When Leading:</td>\
                        <td>First remove bad options:  For each legal play, simulate the rest of the round 200 times with random deals of the unseen cards.  If any play results in an average round score that is more than half a point lower than the highest average play, then remove it from the options considered.<br><br>Remembering what has been played and what was shown during passing and melding, play the highest trump card that is guaranteed to take the trick.  Otherwise, play the highest non trump card that is guaranteed to take the trick.  Otherwise, play the lowest card.</td>\
                    </tr>\
                    <tr>\
                        <td valign="top" width="80pt">Trick-Taking When Following Lead:</td>\
                        <td>First remove bad options:  For each legal play, simulate the rest of the round 200 times with random deals of the unseen cards.  If any play results in an average round score that is more than half a point lower than the highest average play, then remove it from the options considered.<br><br>If we don\'t have a play that can beat what is currently in the trick pile, then if our partner played the current highest trick card then we play our lowest counter.  Otherwise we play our lowest card.  If we do have play options that could beat what is currently in the trick pile, then we play our highest winning card unless we are playing the last trick card.  If we are playing last and we can take the trick then we play our lowest card that can take the trick.</td>\
                    </tr>\
                </table>\
            </div>\
        </div>\
        \
        <div id="menu_settings" class="menu_view">\
            <div id="menu_settings_title" class="menu_card_title">Settings</div>\
            <button id="menu_settings_close_button" class="close_button" onclick="menu_card_close_click()">X</button>\
            <div id="menu_settings_body">\
                <table style="width:100%; text-align:left; font-size:14pt;">\
                    <tr>\
                        <td>Hint/Analyze button on all levels:</td>\
                        <td style="text-align:right;padding-bottom:7pt">\
                            <label class="switch">\
                                <input id="setting_hints_checkbox" type="checkbox" onclick="game.SettingHintsClicked(this)">\
                                <span class="slider round"></span>\
                            </label>\
                        </td>\
                    </tr>\
                    <tr>\
                        <td>Undo button on all levels:</td>\
                        <td style="text-align:right;padding-bottom:7pt">\
                            <label class="switch">\
                                <input id="setting_undo_checkbox" type="checkbox" onclick="game.SettingUndoClicked(this)">\
                                <span class="slider round"></span>\
                            </label>\
                        </td>\
                    </tr>\
                    <tr>\
                        <td>Sort cards left to right:</td>\
                        <td style="text-align:right;padding-bottom:7pt">\
                            <label class="switch">\
                                <input id="setting_sort_left_to_right_checkbox" type="checkbox" onclick="game.SettingSortLeftToRightClicked(this)">\
                                <span class="slider round"></span>\
                            </label>\
                        </td>\
                    </tr>\
                    <tr>\
                        <td>Score in multiples of ten:</td>\
                        <td style="text-align:right;padding-bottom:7pt">\
                            <label class="switch">\
                                <input id="setting_score_multiplier_checkbox" type="checkbox" onclick="game.SettingScoreMultiplierClicked(this)">\
                                <span class="slider round"></span>\
                            </label>\
                        </td>\
                    </tr>\
                    <tr>\
                        <td>Card deck count:</td>\
                        <td style="text-align:right;padding-bottom:7pt">\
                            <select id="deck_count_dropdown" class="setting_dropdown" onchange="game.SettingDeckCountChanged(this)">\
                                <option value="0">Single</option>\
                                <option value="1">Double</option>\
                            </select>\
                        </td>\
                    </tr>\
                    <tr>\
                        <td>Winning score:</td>\
                        <td style="text-align:right;padding-bottom:7pt">\
                            <select id="winning_score_dropdown" class="setting_dropdown" onchange="game.SettingWinningScoreChanged(this)">\
                                <option class="setting" value="100">100</option>\
                                <option value="150">150</option>\
                                <option value="200">200</option>\
                                <option value="250">250</option>\
                                <option value="300">300</option>\
                                <option value="500">500</option>\
                                <option value="1000">1000</option>\
                            </select>\
                        </td>\
                    </tr>\
                    <tr>\
                        <td>Bidding speed:</td>\
                        <td style="text-align:right;padding-bottom:7pt">\
                            <select id="bidding_speed_dropdown" class="setting_dropdown" onchange="game.SettingBiddingSpeedChanged(this)">\
                                <option value="0">Normal</option>\
                                <option value="1">Fast</option>\
                            </select>\
                        </td>\
                    </tr>\
                    <tr>\
                        <td>Minimum bid:</td>\
                        <td style="text-align:right;padding-bottom:7pt">\
                            <select id="minimum_bid_dropdown" class="setting_dropdown" onchange="game.SettingMinimumBidChanged(this)">\
                                <option value="1">1</option>\
                                <option value="2">2</option>\
                                <option value="3">3</option>\
                                <option value="4">4</option>\
                                <option value="5">5</option>\
                                <option value="6">6</option>\
                                <option value="7">7</option>\
                                <option value="8">8</option>\
                                <option value="9">9</option>\
                                <option value="10">10</option>\
                                <option value="11">11</option>\
                                <option value="12">12</option>\
                                <option value="13">13</option>\
                                <option value="14">14</option>\
                                <option value="15">15</option>\
                                <option value="16">16</option>\
                                <option value="17">17</option>\
                                <option value="18">18</option>\
                                <option value="19">19</option>\
                                <option value="20">20</option>\
                                <option value="21">21</option>\
                                <option value="22">22</option>\
                                <option value="23">23</option>\
                                <option value="24">24</option>\
                                <option value="25">25</option>\
                                <option value="26">26</option>\
                                <option value="27">27</option>\
                                <option value="28">28</option>\
                                <option value="29">29</option>\
                                <option value="30">30</option>\
                                <option value="31">31</option>\
                                <option value="32">32</option>\
                                <option value="33">33</option>\
                                <option value="34">34</option>\
                                <option value="35">35</option>\
                                <option value="36">36</option>\
                                <option value="37">37</option>\
                                <option value="38">38</option>\
                                <option value="39">39</option>\
                                <option value="40">40</option>\
                                <option value="41">41</option>\
                                <option value="42">42</option>\
                                <option value="43">43</option>\
                                <option value="44">44</option>\
                                <option value="45">45</option>\
                                <option value="46">46</option>\
                                <option value="47">47</option>\
                                <option value="48">48</option>\
                                <option value="49">49</option>\
                                <option value="50">50</option>\
                                <option value="51">51</option>\
                                <option value="52">52</option>\
                                <option value="53">53</option>\
                                <option value="54">54</option>\
                                <option value="55">55</option>\
                            </select>\
                        </td>\
                    </tr>\
                    <tr>\
                        <td>Passing cards count:</td>\
                        <td style="text-align:right;padding-bottom:7pt">\
                            <select id="passing_cards_count_dropdown" class="setting_dropdown" onchange="game.SettingPassingCardsCountChanged(this)">\
                                <option value="0">0</option>\
                                <option value="1">1</option>\
                                <option value="2">2</option>\
                                <option value="3">3</option>\
                                <option value="4">4</option>\
                            </select>\
                        </td>\
                    </tr>\
                    <tr>\
                        <td>Trick-taking speed:</td>\
                        <td style="text-align:right;padding-bottom:7pt">\
                            <select id="trick_taking_speed_dropdown" class="setting_dropdown" onchange="game.SettingTrickTakingSpeedChanged(this)">\
                                <option value="0">Slow</option>\
                                <option value="1">Normal</option>\
                                <option value="2">Fast</option>\
                            </select>\
                        </td>\
                    </tr>\
                    <tr>\
                        <td>Trick-taking display:</td>\
                        <td style="text-align:right;padding-bottom:7pt">\
                            <select id="trick_taking_display_dropdown" class="setting_dropdown" onchange="game.SettingTrickTakingDisplayChanged(this)">\
                                <option value="0">None</option>\
                                <option value="1">Round Totals</option>\
                                <option value="2">Counters</option>\
                            </select>\
                        </td>\
                    </tr>\
                    <tr>\
                        <td>Preferred difficulty:</td>\
                        <td style="text-align:right;padding-bottom:7pt">\
                            <select id="preferred_difficulty_dropdown" class="setting_dropdown" onchange="game.SettingPreferredDifficultyDisplayChanged(this)">\
                                <option value="0">Prompt</option>\
                                <option value="1">Easy</option>\
                                <option value="2">Standard</option>\
                                <option value="3">Pro</option>\
                            </select>\
                        </td>\
                    </tr>\
                </table>\
                <div style="text-align:left; font-size:14pt; padding-top:5pt">Board Background:</div>\
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
                <div style="text-align:left; font-size:14pt; padding-top:5pt">Card Color:</div>\
                <div class="image-selector">\
                    <input id="card_blue" type="radio" name="settings_card_color_selector" value="blue" onclick="CardSelectorClick(this)" />\
                    <label class="card-selector-item card_back_blue" for="card_blue"></label>\
                    <input id="card_red" type="radio" name="settings_card_color_selector" value="red" onclick="CardSelectorClick(this)" />\
                    <label class="card-selector-item card_back_red" for="card_red"></label>\
                    <input id="card_green" type="radio" name="settings_card_color_selector" value="green" onclick="CardSelectorClick(this)" />\
                    <label class="card-selector-item card_back_green" for="card_green"></label>\
                </div>\
            </div>\
        </div>\
        \
        <div id="menu_statistics" class="menu_view">\
            <div id="menu_statistics_title" class="menu_card_title">Statistics</div>\
            <button id="menu_statistics_close_button" class="close_button" onclick="menu_card_close_click()">X</button>\
            <center>\
                <table style="width: calc(100% - 20px); font-size: 12pt;">\
                    <tr>\
                        <td class="menu_statistics_table_category"></td>\
                        <td class="menu_statistics_table_stat">Easy</td>\
                        <td class="menu_statistics_table_stat">Standard</td>\
                        <td class="menu_statistics_table_stat">Pro</td>\
                        <td class="menu_statistics_table_stat_total">Total</td>\
                    </tr>\
                </table>\
            </center>\
            <div id="menu_statistics_body">\
                <center>\
                    <table class="menu_table_outline">\
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
                            <td class="menu_statistics_table_category">Win Percentage</td>\
                            <td class="menu_statistics_table_stat" id="menu_stat_win_percent_Easy"></td>\
                            <td class="menu_statistics_table_stat" id="menu_stat_win_percent_Standard"></td>\
                            <td class="menu_statistics_table_stat" id="menu_stat_win_percent_Pro"></td>\
                            <td class="menu_statistics_table_stat_total" id="menu_stat_win_percent_Total"></td>\
                        </tr>\
                    </table>\
                    \
                    <div style="margin-top:10pt; font-size:12pt;">Averages when you declare trump:</div>\
                    <table class="menu_table_outline">\
                        <tr>\
                            <td class="menu_statistics_table_category">Avg Bid Contract</td>\
                            <td class="menu_statistics_table_stat" id="menu_stat_avg_bid_contract_with_bid_Easy"></td>\
                            <td class="menu_statistics_table_stat" id="menu_stat_avg_bid_contract_with_bid_Standard"></td>\
                            <td class="menu_statistics_table_stat" id="menu_stat_avg_bid_contract_with_bid_Pro"></td>\
                            <td class="menu_statistics_table_stat_total" id="menu_stat_avg_bid_contract_with_bid_Total">0</td>\
                        </tr>\
                        <tr>\
                            <td class="menu_statistics_table_category">Avg Meld</td>\
                            <td class="menu_statistics_table_stat" id="menu_stat_avg_meld_with_bid_Easy"></td>\
                            <td class="menu_statistics_table_stat" id="menu_stat_avg_meld_with_bid_Standard"></td>\
                            <td class="menu_statistics_table_stat" id="menu_stat_avg_meld_with_bid_Pro"></td>\
                            <td class="menu_statistics_table_stat_total" id="menu_stat_avg_meld_with_bid_Total">0</td>\
                        </tr>\
                        <tr>\
                            <td class="menu_statistics_table_category">Avg Counters</td>\
                            <td class="menu_statistics_table_stat" id="menu_stat_avg_counters_with_bid_Easy"></td>\
                            <td class="menu_statistics_table_stat" id="menu_stat_avg_counters_with_bid_Standard"></td>\
                            <td class="menu_statistics_table_stat" id="menu_stat_avg_counters_with_bid_Pro"></td>\
                            <td class="menu_statistics_table_stat_total" id="menu_stat_avg_counters_with_bid_Total"></td>\
                        </tr>\
                        <tr>\
                            <td class="menu_statistics_table_category" style="font-size:10pt">Avg Positive Round Score</td>\
                            <td class="menu_statistics_table_stat" id="menu_stat_avg_round_score_with_bid_Easy"></td>\
                            <td class="menu_statistics_table_stat" id="menu_stat_avg_round_score_with_bid_Standard"></td>\
                            <td class="menu_statistics_table_stat" id="menu_stat_avg_round_score_with_bid_Pro"></td>\
                            <td class="menu_statistics_table_stat_total" id="menu_stat_avg_round_score_with_bid_Total"></td>\
                        </tr>\
                        <tr>\
                            <td class="menu_statistics_table_category">Make Contract %</td>\
                            <td class="menu_statistics_table_stat" id="menu_stat_make_contract_percent_Easy"></td>\
                            <td class="menu_statistics_table_stat" id="menu_stat_make_contract_percent_Standard"></td>\
                            <td class="menu_statistics_table_stat" id="menu_stat_make_contract_percent_Pro"></td>\
                            <td class="menu_statistics_table_stat_total" id="menu_stat_make_contract_percent_Total"></td>\
                        </tr>\
                    </table>\
                    \
                    <div style="margin-top:10pt; font-size:12pt;">Averages when opponent declares trump:</div>\
                    <table class="menu_table_outline">\
                        <tr>\
                            <td class="menu_statistics_table_category">Avg Meld</td>\
                            <td class="menu_statistics_table_stat" id="menu_stat_avg_meld_without_bid_Easy"></td>\
                            <td class="menu_statistics_table_stat" id="menu_stat_avg_meld_without_bid_Standard"></td>\
                            <td class="menu_statistics_table_stat" id="menu_stat_avg_meld_without_bid_Pro"></td>\
                            <td class="menu_statistics_table_stat_total" id="menu_stat_avg_meld_without_bid_Total">0</td>\
                        </tr>\
                        <tr>\
                            <td class="menu_statistics_table_category">Avg Counters</td>\
                            <td class="menu_statistics_table_stat" id="menu_stat_avg_counters_without_bid_Easy"></td>\
                            <td class="menu_statistics_table_stat" id="menu_stat_avg_counters_without_bid_Standard"></td>\
                            <td class="menu_statistics_table_stat" id="menu_stat_avg_counters_without_bid_Pro"></td>\
                            <td class="menu_statistics_table_stat_total" id="menu_stat_avg_counters_without_bid_Total"></td>\
                        </tr>\
                        <tr>\
                            <td class="menu_statistics_table_category">Avg Round Score</td>\
                            <td class="menu_statistics_table_stat" id="menu_stat_avg_round_score_without_bid_Easy"></td>\
                            <td class="menu_statistics_table_stat" id="menu_stat_avg_round_score_without_bid_Standard"></td>\
                            <td class="menu_statistics_table_stat" id="menu_stat_avg_round_score_without_bid_Pro"></td>\
                            <td class="menu_statistics_table_stat_total" id="menu_stat_avg_round_score_without_bid_Total"></td>\
                        </tr>\
                    </table>\
                    \
                    <table id="menu_statistics_buttons_table">\
                        <tr>\
                            <td>\
                                <center>\
                                    <button id="menu_statistics_reset_button" onclick="game.ResetStatisticsButtonClick()">Reset<br>Statistics</button>\
                                </center>\
                            </td>\
                        </tr>\
                    </table>\
                </center>\
            </div>\
        </div>\
        \
        <div id="menu_rules" class="menu_view">\
            <div id="menu_rules_title" class="menu_card_title">Pinochle Rules</div>\
            <button id="menu_rules_close_button" class="close_button" onclick="menu_card_close_click()">X</button>\
            <div id="menu_rules_body">\
                Pinochle is a team card game played in rounds.<br><br>\
                <center><div style="font-size:15pt">Card Deck</div></center>\
                <div id="menu_rules_card_deck"></div><br>\
                <center><div style="font-size:15pt">Round Stages</div></center>\
                A game of pinochle is played in rounds.  Each round has 3 stages:  Bidding, Melding, and Trick-Taking.  At the start of each round, all cards are dealt to all four players.<br><br>\
                <center><div style="font-size:15pt">Bidding</div></center>\
                The first stage of a round is the bidding stage.  Players bid on the minimum points their team will be able to score in the round.<br><br>The first person to bid is required to start the bidding at a minimum bid (editable in app settings).  In clockwise order, each player either increases the bid by at least one or passes.  The bidding is complete when all but one player has passed.<br><br>When a player wins the bidding stage the contract is set for their team.  Their team will need to score at least as many points as they bid or their overall score will be reduced by their contract.<br><br>The player that wins the bid then declares what the trump (highest) suit will be for the rest of the round.<br><br>\
                <center><div style="font-size:15pt">Passing Cards</div></center>\
                <div id="menu_rules_passing_cards"></div>\
                <br>\
                <center><div style="font-size:15pt">Melding</div></center>\
                All players evaluate their hands and lay down specific combinations of cards worth different points.  The following table shows all of the meld combinations and their point values:<br><br>\
                <center>\
                    <table class="menu_rules_bordered" style="text-align:center; font-size:10pt;">\
                        <tr>\
                            <td rowspan="2">Type</td>\
                            <td rowspan="2">Combination</td>\
                            <td id="menu_rules_cell_points" rowspan="1" colspan="4">Points</td>\
                        </tr>\
                        <tr>\
                            <td>Single</td>\
                            <td>Double</td>\
                            <td id="menu_rules_cell_points_3x">x3</td>\
                            <td id="menu_rules_cell_points_4x">x4</td>\
                        </tr>\
                        <tr>\
                            <td>Runs</td>\
                            <td>A,10,K,Q,J Trump</td>\
                            <td>15</td>\
                            <td>150</td>\
                            <td id="menu_rules_cell_run_3x">225</td>\
                            <td id="menu_rules_cell_run_4x">300</td>\
                        </tr>\
                        <tr>\
                            <td rowspan="2">Marriages</td>\
                            <td>K,Q, Trump</td>\
                            <td>4</td>\
                            <td>8</td>\
                            <td id="menu_rules_cell_royalmarriage_3x">12</td>\
                            <td id="menu_rules_cell_royalmarriage_4x">16</td>\
                        </tr>\
                        <tr>\
                            <td>K,Q</td>\
                            <td>2</td>\
                            <td>4</td>\
                            <td id="menu_rules_cell_marriage_3x">6</td>\
                            <td id="menu_rules_cell_marriage_4x">8</td>\
                        </tr>\
                        <tr>\
                            <td rowspan="5">Arounds</td>\
                        </tr>\
                        <tr>\
                            <td>A each suit</td>\
                            <td>10</td>\
                            <td>100</td>\
                            <td id="menu_rules_cell_acesaround_3x">150</td>\
                            <td id="menu_rules_cell_acesaround_4x">200</td>\
                        </tr>\
                        <tr>\
                            <td>K each suit</td>\
                            <td>8</td>\
                            <td>80</td>\
                            <td id="menu_rules_cell_kingsaround_3x">120</td>\
                            <td id="menu_rules_cell_kingsaround_4x">160</td>\
                        </tr>\
                        <tr>\
                            <td>Q each suit</td>\
                            <td>6</td>\
                            <td>60</td>\
                            <td id="menu_rules_cell_queensaround_3x">90</td>\
                            <td id="menu_rules_cell_queensaround_4x">120</td>\
                        </tr>\
                        <tr>\
                            <td>J each suit</td>\
                            <td>4</td>\
                            <td>40</td>\
                            <td id="menu_rules_cell_jacksaround_3x">60</td>\
                            <td id="menu_rules_cell_jacksaround_4x">90</td>\
                        </tr>\
                        <tr>\
                            <td>Pinochle</td>\
                            <td>Q♤,J♢</td>\
                            <td>4</td>\
                            <td>30</td>\
                            <td id="menu_rules_cell_pinochle_3x">60</td>\
                            <td id="menu_rules_cell_pinochle_4x">90</td>\
                        </tr>\
                        <tr id="menu_rules_row_dix">\
                            <td>Dix</td>\
                            <td>9 Trump</td>\
                            <td>1</td>\
                            <td>2</td>\
                        </tr>\
                    </table>\
                </center>\
                <br>\
                Melds may share cards between them except that the marriage contained in a run is not counted.<br><br>After meld points are counted, all cards are returned to players\' hands to begin the final stage of the round.\
                <br>\
                <br>\
                <center>\
                    <div style="font-size:15pt">\
                        Trick-Taking\
                    </div>\
                </center>\
                <div id="menu_rules_tricktaking"></div>\
                <br>\
                <center>\
                    <div style="font-size:15pt">\
                        Round Scosring\
                    </div>\
                </center>\
                Following trick play, the meld and counters are added.<br><br>If the declaring team scores enough points to meet or exceed their bid, all the earned points are added to their previous score. Otherwise, their previous score is reduced by the amount bid.<br><br>If the non-declaring team fails to earn a single point while taking tricks they do not receive credit for the points that they melded.\
                <br>\
                <br>\
                <center>\
                    <div style="font-size:15pt">\
                        Game Over\
                    </div>\
                </center>\
                Rounds are played until one team reaches the winning score.  If both sides reach the winning score on the same hand, the bidding side wins.  The winning score can be set in the app settings.\
                <br>\
                <br>\
            </div>\
        </div>';
    
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

    for (var i = 0; i < allCards.length; i++) {
        var newCard = cardElement.cloneNode(true);
        var card = allCards[i];
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
        for (var i = 0; i < allCards.length; i++) {
            if (allCards[i].id == cardString) {
                return allCards[i];
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

        if(game.currentMoveStage == 'ChoosingPassCards') {
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
                passingCardsPointerPressed();
            }
        } else if (game.currentMoveStage === 'ChoosingTrickCard') {
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

    var currentPassingCardViews = [];
    var currentDraggedCardWasLastInHand;

    function passingCardsPointerPressed() {
        
        // Find the autoplay line for dropped cards
        var cardWasInSlot = false;
        for (var i=0; i<currentPassingCardViews.length; i++) {
            if (currentDraggedCardView === currentPassingCardViews[i]) {
                currentDraggedCardView.style.zIndex = 200;
                autoPlayBoundaryY = GetPassingCardsLocation(i)[1] + 70;
                currentPassingCardViews[i] = null;
                currentDraggedCardWasLastInHand = false;
                HidePassCardsButton();
                game.players[0].passingCards.splice(game.players[0].passingCards.indexOf(currentDraggedCardView.card),1);
                game.players[0].cards.push(currentDraggedCardView.card);
                if (this.settings.GetSetting('setting_sort_left_to_right')) {
                    game.players[0].cards.sort(function(a,b) {
                        if (a.suit != b.suit) {
                            return a.suitInt - b.suitInt;
                        } else {
                            return b.value - a.value;
                        }
                    });
                } else {
                    game.players[0].cards.sort(function(a,b) {
                        if (a.suit != b.suit) {
                            return a.suitInt - b.suitInt;
                        } else {
                            return a.value - b.value;
                        }
                    });
                }
                cardWasInSlot = true;
                break;
            }
        }
        if (!cardWasInSlot) {
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
                    AnimatePlayerHandCardsIntoPosition('South', "0.3s", true);
                }
            } else {
                if (tapped || currentDraggedCardView.offsetTop > autoPlayBoundaryY) {
                    AnimatePlayerHandCardsIntoPosition('South', "0.3s", true);
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
                    AnimatePlayerHandCardsIntoPosition('South', "0.3s", true);
                }
            }
        }
         
        lowerCard(currentDraggedCardView);
    }

    function DropCurrentDraggedCardViewIntoPassingSlot()
    {
        var player = game.players[0];
        if (player.passingCards.length < currentPassingCardViews.length) {
            var indexOfCard = player.cards.indexOf(currentDraggedCardView.card);
            var card = player.cards[indexOfCard];
            player.cards.splice(indexOfCard, 1);
            player.passingCards.push(card);
            
            // Pick the closest passing spot
            var closestOpenPassingIndex = -1;
            var closestDistance = 10000000;
            var cardHeightHalf = 162*0.5;
            for (var i=0; i<currentPassingCardViews.length; i++) {
                if (currentPassingCardViews[i] !== null) {
                    continue;
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
            
            if (closestOpenPassingIndex < 0) {
                AnimatePlayerHandCardsIntoPosition('South', "0.3s", true);
                return;
            } else {
                currentPassingCardViews[closestOpenPassingIndex] = currentDraggedCardView;
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

            if (player.passingCards.length === currentPassingCardViews.length) {
                ShowPassCardsButton();
            }
        }
        
        AnimatePlayerHandCardsIntoPosition('South', "0.3s", true);
    }

    function ShowPassCardsButton() {
        var passCardsButton = document.getElementById('pinochle_confirm_passing_cards_button');
        passCardsButton.positionFunction = 'GetPassingCardsConfirmLocation()';
        var loc = eval(passCardsButton.positionFunction);
        passCardsButton.style.transition = 'none';
        passCardsButton.style.left = loc[0] + 'px';
        passCardsButton.style.top = loc[1] + 'px';
        passCardsButton.style.visibility = "visible";
        with (passCardsButton.style) {
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
        var confirmCribRegion = document.getElementById('pinochle_confirm_passing_cards_button');
        with (confirmCribRegion.style) {
            transition = "0.2s linear";
            opacity = 0;
            pointerEvents = "none";
        }
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

    function flipUpCard(cardView, animate) {
        if (cardView.isFlippedUp) {
            return;
        }

        cardView.isFlippedUp = true;
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
        } else {
            if (isIE) {
                cardFront.style.transform = "translate3d(0px,0px,1px) perspective(500px) rotateY(0deg)";
                cardBack.style.transform = "translate3d(0px,0px,1px) perspective(500px) rotateY(-180deg)";
                cardShadow.style.transform = "translate3d(20px,20px,0px) perspective(500px) rotateY(0deg)";
                raiseContainer.style.transform = "scale(1)";
                cardShadow.style.transform = "translate3d(0px,0px,0px) perspective(500px) rotateY(0deg)";
            } else {
                flipContainer.style.transform = "perspective(500px) rotateY(180deg)";
                cardShadow.style.transform = "translate3d(-20px,20px,0px)";
                raiseContainer.style.transform = "scale(1)";
                cardShadow.style.transform = "translate3d(0px,0px,0px)";
            }
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

    function IndicateCustomDecisionCard(cardView) {
        var raiseContainer = cardView.firstChild;
        var flipContainer = raiseContainer.firstChild;
        var cardFront = flipContainer.children[2];
        var flashHighlight = cardFront.children[1];
        flashHighlight.classList.add('highlightCard');
        cardView.classList.add('slideUp');
    }

    function RemoveCustomDecisionIndicator(cardView) {
        var raiseContainer = cardView.firstChild;
        var flipContainer = raiseContainer.firstChild;
        var cardFront = flipContainer.children[2];
        var flashHighlight = cardFront.children[1];
        flashHighlight.classList.remove('highlightCard');
        cardView.classList.remove('slideUp');
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
                var firstLeft = gameContainer.innerWidth*0.5 - 50;
                var lastLeft = gameContainer.innerWidth*0.5 + 70;
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
        this.isDoubleDeck = this.settings.GetSetting('setting_deck_count')==1;
        this.cardsPlayedThisRound = [];
        this.trickCards = [];
        this.roundNumber = 0;
        this.dealerIndex = 0;
        this.leadIndex = 0;
        this.turnIndex = 0;
        this.isSpadesBroken = false;
        this.currentMoveStage = 'None';
        this.roundContracts = [];
        this.roundMelds = [];
        this.roundCountersTaken = [];
        this.roundScores = [];

        this.players = [];
        var player = new PinochlePlayer();
        player.Initialize('You', true, 'Custom', 'South');
        this.players.push(player);
        switch(difficulty)
        {
            case 'Easy':
            {
                player = new PinochlePlayer();
                player.Initialize('Conrad', false, difficulty, 'West');
                this.players.push(player);
                player = new PinochlePlayer();
                player.Initialize('Louisa', false, 'Pro', 'North');
                this.players.push(player);
                player = new PinochlePlayer();
                player.Initialize('Davina', false, difficulty, 'East');
                this.players.push(player);
            }
            break;
            case 'Standard':
            {
                player = new PinochlePlayer();
                player.Initialize('Catalina', false, difficulty, 'West');
                this.players.push(player);
                player = new PinochlePlayer();
                player.Initialize('Amelia', false, 'Pro', 'North');
                this.players.push(player);
                player = new PinochlePlayer();
                player.Initialize('Seward', false, difficulty, 'East');
                this.players.push(player);
            }
            break;
            default:
            {
                player = new PinochlePlayer();
                player.Initialize('Charlotte', false, difficulty, 'West');
                this.players.push(player);
                player = new PinochlePlayer();
                player.Initialize('Dixon', false, 'Pro', 'North');
                this.players.push(player);
                player = new PinochlePlayer();
                player.Initialize('Isabella', false, difficulty, 'East');
                this.players.push(player);
            }
            break;
        }

        undoGameStates = [];
        redoGameStates = [];
    }

    this.CreateGameStateString = function() {
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

    this.LoadSimulationGameState = function(gameState) {
        this.LoadGameState(gameState);
    }

    this.LoadGameState = function(gameState) {
        var lines = gameState.split("\n");
        var gameStateComps = lines[0].split(",");
        game.skillLevel = gameStateComps[0];
        game.winningScore = Number(gameStateComps[1]);
        game.currentMoveStage = gameStateComps[2];
        game.roundNumber = Number(gameStateComps[3]);
        game.dealerIndex = Number(gameStateComps[4]);
        game.leadIndex = Number(gameStateComps[5]);
        game.turnIndex = Number(gameStateComps[6]);
        game.trumpSuit = gameStateComps[7];
        game.bidWinner = Number(gameStateComps[8]);
        game.isDoubleDeck = gameStateComps[9]=='true';
        if (gameStateComps.length>10) {
            game.currentDecisionIndex = Number(gameStateComps[10]);
        }

        var alreadyCards = [];
        game.cardsPlayedThisRound = [];
        if (lines[1].length > 0) {
            var cardsThisRoundStrings = lines[1].split('.');
            for (var i=0; i<cardsThisRoundStrings.length; i++) {
                var cardID = cardsThisRoundStrings[i];
                if (cardID.length>0) {
                    var card = game.GetCardFromString(cardID);
                    game.cardsPlayedThisRound.push(card);
                    alreadyCards.push(card);
                }
            }
        }

        game.trickCards = [];
        if (lines[2].length > 0) {
            var cardsThisRoundStrings = lines[2].split('.');
            for (var i=0; i<cardsThisRoundStrings.length; i++) {
                var cardID = cardsThisRoundStrings[i];
                if (cardID.length>0) {
                    var card = game.GetCardFromString(cardID);
                    game.trickCards.push(card);
                    alreadyCards.push(card);
                }
            }
        }

        InitializeCardDeckWithPlayedCards(alreadyCards, game.isDoubleDeck);

        game.players = [];
        for (var i=0; i<4; i++) {
            var playerInfo = lines[3+i].split(",");
            var playerName = playerInfo[0];
            var player = new PinochlePlayer();
            var playerIsHuman = playerInfo[1]=='true';
            var playerSkill = playerInfo[2];
            var playerPosition = playerInfo[3];
            player.Initialize(playerName, playerIsHuman, playerSkill, playerPosition);
            player.currentRoundBid = Number(playerInfo[4]);
            player.currentRoundMaximumBid = Number(playerInfo[5]);
            player.currentRoundWinningBidTrump = playerInfo[6];
            player.currentRoundBidIsPass = playerInfo[7]=='true';
            player.currentRoundMeldScore = Number(playerInfo[8]);
            player.currentRoundCountersTaken = Number(playerInfo[9]);
            player.gameScore = Number(playerInfo[10]);
            
            player.cards = [];
            var playerCardsData = playerInfo[11].split(".");
            for (var j=0; j<playerCardsData.length; j++) {
                var cardData = playerCardsData[j];
                if (cardData.length>0) {
                    var cardInfo = cardData.split(":");
                    var card = game.GetCardFromString(cardInfo[0]);
                    card.wasShown = cardInfo[1]=='true';
                    card.wasPassed = cardInfo[2]=='true';
                    player.cards.push(card);
                }
            }

            player.isShownVoidInSuit = [];
            var playerVoidData = playerInfo[12].split(".");
            for (var j=0; j<4; j++) {
                player.isShownVoidInSuit[j] = playerVoidData[j]=='true';
            }

            game.players.push(player);
        }

        game.currentHighestBidder = game.players[game.bidWinner];

        game.roundContracts = [];
        var roundBidsText = lines[7];
        if (roundBidsText.length>0) {
            var roundBidsRounds = roundBidsText.split(",");
            for (var i=0; i<roundBidsRounds.length; i++) {
                var bids = roundBidsRounds[i].split(".");
                if (bids.length == 2) {
                    var bidsArray = [];
                    bidsArray.push(Number(bids[0]));
                    bidsArray.push(Number(bids[1]));
                    game.roundContracts.push(bidsArray);
                }
            }
        }
        
        game.roundMelds = [];
        var roundMeldsText = lines[8];
        if (roundMeldsText.length>0) {
            var roundMeldsRounds = roundMeldsText.split(",");
            for (var i=0; i<roundMeldsRounds.length; i++) {
                var melds = roundMeldsRounds[i].split(".");
                if (melds.length == 2) {
                    var meldsArray = [];
                    meldsArray.push(Number(melds[0]));
                    meldsArray.push(Number(melds[1]));
                    game.roundMelds.push(meldsArray);
                }
            }
        }

        game.roundCountersTaken = [];
        var roundCountersText = lines[9];
        if (roundCountersText.length>0) {
            var roundCountersRounds = roundCountersText.split(",");
            for (var i=0; i<roundCountersRounds.length; i++) {
                var counters = roundCountersRounds[i].split(".");
                if (counters.length == 2) {
                    var countersArray = [];
                    countersArray.push(Number(counters[0]));
                    countersArray.push(Number(counters[1]));
                    game.roundCountersTaken.push(countersArray);
                }
            }
        }

        game.roundScores = [];
        var roundScoresText = lines[10];
        if (roundScoresText.length>0) {
            var roundScoresRounds = roundScoresText.split(",");
            for (var i=0; i<roundScoresRounds.length; i++) {
                var roundScores = roundScoresRounds[i].split(".");
                if (roundScores.length == 2) {
                    var roundScoresArray = [];
                    roundScoresArray.push(Number(roundScores[0]));
                    roundScoresArray.push(Number(roundScores[1]));
                    game.roundScores.push(roundScoresArray);
                }
            }
        }

        scoreboard.Initialize();
        scoreboard.SlideDown();
        game.CreatePlayerInfoViews(0);

        if (game.currentMoveStage == 'ChoosingBids') {
            HidePlayerPrompt();
            HideTrumpIndicator();
            HideSelectTrumpView();
            HidePassCardsViews();
            HideAcceptMeldView();
            HideRoundResultView();
            RepositionUndoButtons();

            for (var i=0; i<4; i++) {
                AnimatePlayerHandCardsIntoPosition(game.players[i].playerPosition, '0.2s', false);
            }

            // Bidding
            for (var i=1; i<4; i++) {
                var p = game.players[i];
                if (p.currentRoundBid > 0) {
                    if (game.currentHighestBidder == null || game.currentHighestBidder.currentRoundBid < p.currentRoundBid) {
                        game.currentHighestBidder = p;
                    }
                }
            }

            // Bid Views
            for (var i=1; i<4; i++) {
                var p = game.players[i];
                var bidView = document.getElementById('bid_view_' + p.playerPosition);
                bidView.style.background = '#000000';
                if (p.currentRoundMaximumBid > 0) {
                    UpdateBidViewBid(p.playerPosition, p.currentRoundBid, p.currentRoundBidIsPass);
                    UpdateBidviewBrightness(p.playerPosition, game.currentHighestBidder == p);
                    with (bidView.style) {
                        WebkitTransition = MozTransition = OTransition = msTransition = "0.2s linear";
                        visibility = 'visible';
                        opacity = 1;
                    }
                } else {
                    with (bidView.style) {
                        WebkitTransition = MozTransition = OTransition = msTransition = "0.2s linear";
                        visibility = 'hidden';
                        opacity = 0;
                    }
                }
            }

            var bidView = document.getElementById('bid_view_South');
            with (bidView.style) {
                WebkitTransition = MozTransition = OTransition = msTransition = "0.2s linear";
                visibility = 'hidden';
                opacity = 0;
            }

            var player = game.players[0];
            player.currentRoundBidIsPass = false;
            currentBiddingPlayerIndex = 0;
            game.PromptPlayerToChooseBid();

        } else if (game.currentMoveStage == 'ChoosingTrumpSuit') {
            HidePlayerPrompt();
            HideTrumpIndicator();
            HideChoooseBidView();
            HidePassCardsViews();
            HideAcceptMeldView();
            RepositionUndoButtons();
            game.UpdateShowHintButton();

            for (var i=0; i<4; i++) {
                AnimatePlayerHandCardsIntoPosition(game.players[i].playerPosition, '0.5s', true);
            }

            game.currentHighestBidder = game.players[game.bidWinner];
            HideBidView('West');
            HideBidView('North');
            HideBidView('East');
            UpdateBidViewBid('South', game.players[0].currentRoundBid, false);
            UpdateBidviewBrightness('South', true);
            UpdateBidViewIsContract('South');
            var bidView = document.getElementById('bid_view_South');
            bidView.style.opacity = 1;
            bidView.style.visibility = 'visible';
            BumpSouthBidView();
            PromptPlayerToChooseTrumpSuit();

        } else if (game.currentMoveStage == 'ChoosingPassCards') {
            HidePlayerPrompt();
            HideSelectTrumpView();
            HideChoooseBidView();
            RepositionUndoButtons();
            HideAcceptMeldView();
            IndicateTrumpSuit(null);
            HideAcceptTrickButton();
            document.getElementById('pinochle_trick_score_bubble').style.visibility = 'hidden';

            for (var i=0; i<4; i++) {
                AnimatePlayerHandCardsIntoPosition(game.players[i].playerPosition, '0.2s', false);
            }

            if (game.currentHighestBidder.playerPositionInt == 0) {
                HideBidView('West');
                HideBidView('North');
                HideBidView('East');
                UpdateBidViewBid('South', game.players[0].currentRoundBid, false);
                UpdateBidviewBrightness('South', true);
                UpdateBidViewIsContract('South');
                var bidView = document.getElementById('bid_view_South');
                bidView.style.opacity = 1;
                bidView.style.visibility = 'visible';

            } else {  
                // North must have won the bid
                HideBidView('West');
                HideBidView('East');
                HideBidView('South');
                UpdateBidViewBid('North', game.players[2].currentRoundBid, false);
                UpdateBidviewBrightness('North', true);
                var bidView = document.getElementById('bid_view_North');
                bidView.style.opacity = 1;
                bidView.style.visibility = 'visible';
                UpdateBidViewIsContract(game.currentHighestBidder.playerPosition);
            }
    
            scoreboard.UpdateScores(true, false, false);
            game.PromptPlayerToChoosePassingCards();
            
        } else if (game.currentMoveStage == 'AcceptingMelds') {
            HidePlayerPrompt();
            HideChoooseBidView();
            HidePassCardsViews();
            HideRoundResultView();
            HideHintButton();
            RepositionUndoButtons();
            HideAcceptTrickButton();
            document.getElementById('pinochle_trick_score_bubble').style.visibility = 'hidden';
            HideSelectTrumpView();
            IndicateTrumpSuit(null);
            HidePlayerPrompt();
            CountMeldsForRound(false);

        } else if (game.currentMoveStage == 'ChoosingTrickCard') {
            HidePlayerPrompt();
            IndicateTrumpSuit(null);
            RepositionUndoButtons();
            HideAcceptMeldView();
            HideAcceptTrickButton();
            HideChoooseBidView();
            HidePassCardsViews();
            HideBidView('West');
            HideBidView('East');
            HideBidView('South');
            HideBidView('North');
            document.getElementById('pinochle_trick_score_bubble').style.visibility = 'hidden';
            UpdatePlayerRoundScore(true);
            UpdatePlayerRoundScore(false);

            for (var i = 0; i < allCards.length; i++) {
                var cardView = allCards[i].cardView;
                UnshadeCard(cardView);
                cardView.needsToBeHidden = true;
            }

            for (var i=0; i<4; i++) {
                AnimatePlayerHandCardsIntoPosition(game.players[i].playerPosition, '0.2s', false);
            }

            var ctr = 0;
            for (var i=game.trickCards.length-1; i>=0; i--) {
                var player = game.players[3-ctr];
                var cardView = game.trickCards[i].cardView;
                cardView.needsToBeHidden = false;
                cardView.positionFunction = "GetTrickDiscardLocation('" + player.playerPosition + "')";
                var loc = eval(cardView.positionFunction);
                flipUpCard(cardView, false);
                with (cardView.style) {
                    transition = '0.3s ease-out';
                    transitionDelay = "0s";
                    left = loc[0] + 'px';
                    top = loc[1] + 'px';
                    transform = 'none';
                    visibility = 'visible';
                    opacity = 1;
                    zIndex = 0;
                }

                ctr++;
            }

            for (var i = 0; i < allCards.length; i++) {
                var cardView = allCards[i].cardView;
                if (cardView.needsToBeHidden) {
                    with (cardView.style) {
                        transition = '0.01s';
                        transitionDelay = 'none';
                        visibility = 'hidden';
                        opacity = 0;
                    }
                }
            }

            HideRoundResultView();

            game.PromptPlayerToPlayCard();

        } else if (game.currentMoveStage == 'AcceptingRoundScores') {
            HidePlayerPrompt();
            HideChoooseBidView();
            HideAcceptMeldView();
            HideAcceptTrickButton();
            HideBidView('West');
            HideBidView('North');
            HideBidView('East');
            HideBidView('South');
            HidePlayerPrompt();

            for (var i = 0; i < allCards.length; i++) {
                var cardView = allCards[i].cardView;
                with (cardView.style) {
                    transition = '0.01s';
                    transitionDelay = 'none';
                    visibility = 'hidden';
                    opacity = 0;
                }
            }
        
            game.ShowRoundResultWithDelay(0);
        }
    }

    this.StartAGame = function (difficulty) {

        this.InitializeGame(difficulty);        

        // Clean up all cards and messages
        for (var i = 0; i < allCards.length; i++) {
            var el = allCards[i].cardView;
            flipDownCard(el, false);
            UnshadeCard(el);
            with (el.style) {
                transition = "none";
                transform = "none";
                visibility = "hidden";
            }
        }
        HideAllMessages();
        HideTrumpIndicator();
        HideSelectTrumpView();

        scoreboard.Initialize();
        scoreboard.SlideDown();

        this.CreatePlayerInfoViews(1000);
        
        this.AnimateDealCardsForRound();
    }

    this.CreatePlayerInfoViews = function(delay) {
        for (var i=0; i<4; i++) {
            var playerName = document.getElementById('player_name_' + this.players[i].playerPosition);
            playerName.positionFunction = "GetPlayerNamePosition('" + this.players[i].playerPosition + "')";
            playerName.style.transition = "none";
            var position = eval(playerName.positionFunction);
            playerName.style.left = position[0] + 'px';
            playerName.style.top = position[1] + 'px';
            playerName.innerText = this.players[i].name;

            if (i!=0) {
                var playerThinking = document.getElementById('player_thinking_' + this.players[i].playerPosition);
                playerThinking.positionFunction = "GetPlayerBidPosition('" + this.players[i].playerPosition + "')";
                position = eval(playerThinking.positionFunction);
                playerThinking.style.left = position[0] + 'px';
                playerThinking.style.top = position[1] + 'px';
            }

            var bidView = document.getElementById('bid_view_' + this.players[i].playerPosition);
            bidView.positionFunction = "GetPlayerBidPosition('" + this.players[i].playerPosition + "')";
            position = eval(bidView.positionFunction);
            bidView.style.left = position[0] + 'px';
            bidView.style.top = position[1] + 'px';

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
                playerName.style.visibility = "visible";
                playerName.style.opacity = 1;
                var playerScore = document.getElementById('player_score_' + game.players[i].playerPosition);
                playerScore.style.transition = "1s linear";
                playerScore.style.visibility = "visible";
                playerScore.style.opacity = 1;
            }
        }, delay);
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

    var playerWestNameTopForAcceptingMelds = 0;
    var playerEastNameTopForAcceptingMelds = 0;
    var playerSouthNameTopForAcceptingMelds = 0;

    function GetPlayerNamePosition(playerPosition) {
        switch (playerPosition) {
            case 'South':
            {
                if (game.currentMoveStage == 'AcceptingMelds') {
                    return [gameContainer.innerWidth*0.5-115*0.5 + 7, playerSouthNameTopForAcceptingMelds];
                } else {
                    var leftPos = GetHandCardLocation(playerPosition, 0, 14);
                    return [(gameContainer.innerWidth*0.5 + leftPos[0])*0.5 - 115*0.5, leftPos[1]-50];
                }
            }
            case 'West':
            {
                if (game.currentMoveStage == 'AcceptingMelds') {
                    return [50, playerWestNameTopForAcceptingMelds];
                } else {
                    return [50,250];
                }
            }
            case 'North':
                return [gameContainer.innerWidth*0.5 + 110,30];
            default:
            {
                if (game.currentMoveStage == 'AcceptingMelds') {
                    return [gameContainer.innerWidth-170, playerEastNameTopForAcceptingMelds];
                } else {
                    return [gameContainer.innerWidth-170,250];
                }
            }
        }
    }

    function GetPlayerBidPosition(playerPosition) {
        switch (playerPosition) {
            case 'South':
            {
                var pos = GetPlayerNamePosition(playerPosition);
                return [pos[0] + 7, pos[1] - 80];
            }
            case 'West':
                return [40+12,280];
            case 'North':
                return [gameContainer.innerWidth*0.5 + 110+12,60];
            default:
                return [gameContainer.innerWidth-140+12,280];
        }
    }

    function GetPlayerScorePosition(playerPosition) {
        var pos = GetPlayerNamePosition(playerPosition);
        switch (playerPosition) {
            case 'South':
                return [pos[0] - 50, pos[1] - 45];
            case 'West':
                return [pos[0], pos[1] + 30];
            case 'North':
                return [pos[0] - 50, pos[1] + 30];
            default:
                return [pos[0] - 100, pos[1] + 30];
        }
    }

    function GetTrumpSuitIndicatorPosition() {
        return [gameContainer.innerWidth-100, 40];
    }

    function GetTrumpSuitSelectorPosition() {
        return [gameContainer.innerWidth*0.5, gameContainer.innerHeight*0.3];
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

    function InitializeCardDeckWithPlayedCards(alreadyPlayedCards, isDoubleDeck) {
        // Create a shuffled deck of cards without already played cards
        cards=[];
        var j, x, i;
        for (i=0; i<allCards.length; i++) {
            var card = allCards[i];
            UnshadeCard(card.cardView);
            if (alreadyPlayedCards.includes(card)) {
                continue;
            }
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

    this.UpdateScoreMultiplier = function() {
        var isUsingScoreMultiplier = this.settings.GetSetting('setting_score_multiplier');

        scoreboard.UpdateForScoreMultiplier();

        if (game != null && game.players.length!=0) {
            for (var i=0 ; i<4; i++) {
                UpdateBidViewBid(game.players[i].playerPosition, game.players[i].currentRoundBid, game.players[i].currentRoundBidIsPass);
                UpdateMeldViewValue(game.players[i].playerPosition, game.players[i].currentRoundMeldScore, isUsingScoreMultiplier);
            }

            var bidButton = document.getElementById('submit_bid_button');
            var isUsingScoreMultiplier = this.settings.GetSetting('setting_score_multiplier');
            if (isUsingScoreMultiplier) {
                bidButton.innerText = "Bid: " + currentBidButtonValue*10;
            } else {
                bidButton.innerText = "Bid: " + currentBidButtonValue;
            }

            if (game != null && game.currentMoveStage == 'ChoosingTrickCard') {
                UpdatePlayerRoundScore(true);
                UpdatePlayerRoundScore(false);
            }

            if (game != null && game.currentMoveStage == 'AcceptingRoundScores') {
                UpdateRoundScoresViewText();
            }
        }
    }

    this.UpdateTrickTakingDisplay = function() {
        if (game != null && game.currentMoveStage == 'ChoosingTrickCard') {
            UpdatePlayerRoundScore(true);
            UpdatePlayerRoundScore(false);
        }
    }

    function UpdateMeldViewValue(playerPosition, meldScore, isUsingScoreMultiplier) {
        var textView = document.getElementById('meld_view_value_' + playerPosition);
        if (isUsingScoreMultiplier) {
            textView.innerText = meldScore*10;
        } else {
            textView.innerText = meldScore;
        }
    }

    this.UpdateSortLeftToRight = function() {
        AnimatePlayerHandCardsIntoPosition('South', "0.3s", true);
    }

    function AnimatePlayerHandCardsIntoPosition(playerPosition, duration, animateCardFlip) {
        var player;
        var flipUp = false;
        switch (playerPosition) {
            case 'South':
                player = game.players[0];
                flipUp = true;
                if (game.settings.GetSetting('setting_sort_left_to_right')) {
                    game.players[0].cards.sort(function(a,b) {
                        if (a.suit != b.suit) {
                            return a.suitInt - b.suitInt;
                        } else {
                            return b.value - a.value;
                        }
                    });
                } else {
                    game.players[0].cards.sort(function(a,b) {
                        if (a.suit != b.suit) {
                            return a.suitInt - b.suitInt;
                        } else {
                            return a.value - b.value;
                        }
                    });
                }
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
            cardView.needsToBeHidden = false;
            if (flipUp) {
                flipUpCard(cardView, animateCardFlip);
            } else {
                flipDownCard(cardView, animateCardFlip);
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
                visibility = 'visible';
                opacity = 1;
            }
        }
    }

    this.AnimateDealCardsForRound = function() {
        this.roundNumber = this.roundNumber + 1;
        this.currentHighestBidder = null;
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

        this.ResetPlayerRoundScores();
        var bidView = document.getElementById('bid_view_South');
        with (bidView.style) {
            WebkitTransition = MozTransition = OTransition = msTransition = "none";
            background = '#000000';
        }
        bidView = document.getElementById('bid_view_West');
        with (bidView.style) {
            WebkitTransition = MozTransition = OTransition = msTransition = "none";
            background = '#000000';
        }
        bidView = document.getElementById('bid_view_North');
        with (bidView.style) {
            WebkitTransition = MozTransition = OTransition = msTransition = "none";
            background = '#000000';
        }
        bidView = document.getElementById('bid_view_East');
        with (bidView.style) {
            WebkitTransition = MozTransition = OTransition = msTransition = "none";
            background = '#000000';
        }

        // Deal cards for round
        this.cardsPlayedThisRound = [];
        var isDoubleDeck = this.settings.GetSetting('setting_deck_count')==1;
        InitializeCardDeck(isDoubleDeck);
        var cardsPerHand = isDoubleDeck ? 20 : 12;
        for (var i=0; i<cardsPerHand; i++) {
            for (var j=0; j<4; j++) {
                this.players[j].cards.push(cards[deckTopIndex]);
                deckTopIndex = deckTopIndex-1;
            }
        }

        // Sort the players hand
        if (this.settings.GetSetting('setting_sort_left_to_right')) {
            this.players[0].cards.sort(function(a,b) {
                if (a.suit != b.suit) {
                    return a.suitInt - b.suitInt;
                } else {
                    return b.value - a.value;
                }
            });
        } else {
            this.players[0].cards.sort(function(a,b) {
                if (a.suit != b.suit) {
                    return a.suitInt - b.suitInt;
                } else {
                    return a.value - b.value;
                }
            });
        }

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
                opacity = 1;
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
                opacity = 1;
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
                opacity = 1;
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
                opacity = 1;
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
                setTimeout(flipUpCard, i * 80, cardView, true);
            }
            game.currentMoveStage = "ChoosingBids";
        }, 50);
        
        setTimeout(function() {
            currentBiddingPlayerIndex = (game.dealerIndex + 1)%4;
            game.leadIndex = currentBiddingPlayerIndex;
            var player = game.players[currentBiddingPlayerIndex];
            player.ChooseBid(game.settings.GetSetting('setting_bidding_speed'));
            if (player.isHuman) {
                var minimumBid = game.settings.GetSetting('setting_minimum_bid');
                if (player.currentRoundBid != minimumBid) {
                    RememberLatestGameState();
                }
            }
        
        }, 500);
    }

    this.IndicatePlayerIsThinking = function(position) {
        var playerThinking = document.getElementById('player_thinking_' + position);
        playerThinking.style.opacity = 0;
        with (playerThinking.style) {
            WebkitTransition = MozTransition = OTransition = msTransition = "0.5s linear";
            transitionDelay = '0.3s';
            opacity = 1;
            visibility = "visible";
        }
    }

    var currentBidButtonValue = 0;

    this.PromptPlayerToChooseBid = function() {

        if (game.players[0].currentRoundBidIsPass) {
            OnPlayerFinishedChoosingBid(game.players[0]);
            return;
        }

        if (this.skillLevel === 'Easy' || this.settings.GetSetting('setting_hints')) {
            ShowHintButton(0);
        }

        var bidButton = document.getElementById('submit_bid_button');
        var isUsingScoreMultiplier = this.settings.GetSetting('setting_score_multiplier');
        currentBidButtonValue = game.currentHighestBidder.currentRoundBid + 1;
        if (isUsingScoreMultiplier) {
            bidButton.innerText = "Bid: " + currentBidButtonValue*10;
        } else {
            bidButton.innerText = "Bid: " + currentBidButtonValue;
        }
        var el = document.getElementById('pinochle_choose_bid_view');
        with(el.style) {
            WebkitTransition = MozTransition = OTransition = msTransition = "0.3s linear";
            opacity = 1;
            visibility = "visible";
            pointerEvents = "auto";
        }
    }

    this.OnDecrementBidButtonPressed = function() {

        if (currentBidButtonValue > game.currentHighestBidder.currentRoundBid + 1) {
            IndicateDecrementBidView();
            currentBidButtonValue--;
            var isUsingScoreMultiplier = this.settings.GetSetting('setting_score_multiplier');
            var bidButton = document.getElementById('submit_bid_button');
            if (isUsingScoreMultiplier) {
                bidButton.innerText = "Bid: " + currentBidButtonValue*10;
            } else {
                bidButton.innerText = "Bid: " + currentBidButtonValue;
            }
        } else {
            IndicateCantDecrementBidView();
        }
    }

    function IndicateDecrementBidView() {
        var el = document.getElementById('submit_bid_button');
        el.addEventListener("animationend", function() {
            el.classList.remove('decrementSubmitBidView');
        });
        el.classList.add('decrementSubmitBidView');
    }

    function IndicateCantDecrementBidView() {
        var el = document.getElementById('submit_bid_button');
        el.addEventListener("animationend", function() {
            el.classList.remove('shakeSubmitBidView');
        });
        el.classList.add('shakeSubmitBidView');
    }

    this.OnIncrementBidButtonPressed = function() {
        IndicateIncrementBidView();
        currentBidButtonValue++;
        var isUsingScoreMultiplier = this.settings.GetSetting('setting_score_multiplier');
        var bidButton = document.getElementById('submit_bid_button');
        if (isUsingScoreMultiplier) {
            bidButton.innerText = "Bid: " + currentBidButtonValue*10;
        } else {
            bidButton.innerText = "Bid: " + currentBidButtonValue;
        }
    }

    function IndicateIncrementBidView() {
        var el = document.getElementById('submit_bid_button');
        el.addEventListener("animationend", function() {
            el.classList.remove('incrementSubmitBidView');
        });
        el.classList.add('incrementSubmitBidView');
    }

    this.OnPassBidButtonPressed = function() {
        var player = game.players[0];
        player.currentRoundBidIsPass = true;
        this.OnPlayerFinishedChoosingBid(player);
    }

    this.OnSubmitBidButtonPressed = function() {
        var player = game.players[0];
        player.currentRoundBid = currentBidButtonValue;
        game.currentHighestBidder = player;
        this.OnPlayerFinishedChoosingBid(player);
    }

    function HideChoooseBidView() {
        var el = document.getElementById('pinochle_choose_bid_view');
        with(el.style) {
            WebkitTransition = MozTransition = OTransition = msTransition = "0.1s linear";
            opacity = 0;
            pointerEvents = "none";
        }
    }

    var currentBiddingPlayerIndex = 0;
    
    this.OnPlayerFinishedChoosingBid = function(player) {
        if (player.isHuman) {
            HideChoooseBidView();
            HideHintButton();
            HideUndoButton();
            HideRedoButton();
        } else {
            var bidView = document.getElementById('bid_view_' + player.playerPosition);
            UpdateBidviewBrightness('West', game.currentHighestBidder.playerPositionInt==1);
            UpdateBidviewBrightness('North', game.currentHighestBidder.playerPositionInt==2);
            UpdateBidviewBrightness('East', game.currentHighestBidder.playerPositionInt==3);

            UpdateBidViewBid(player.playerPosition, player.currentRoundBid, player.currentRoundBidIsPass);
            with (bidView.style) {
                WebkitTransition = MozTransition = OTransition = msTransition = "0.2s linear";
                visibility = 'visible';
                opacity = 1;
            }
            if (!player.currentRoundBidIsPass) {
                BumpBidView(player.playerPosition);
            }
        }

        var playersPassedCount = 0;
        for (var i=0; i<4; i++) {
            if (game.players[i].currentRoundBidIsPass) {
                playersPassedCount++;
            }
        }
        
        if (playersPassedCount >= 3) {
            game.trumpSuit = game.currentHighestBidder.currentRoundWinningBidTrump;
            game.bidWinner = game.currentHighestBidder.playerPositionInt;
            OnContractWon();
        } else {
            currentBiddingPlayerIndex++;
            var player = game.players[currentBiddingPlayerIndex%4];
            player.ChooseBid(this.settings.GetSetting('setting_bidding_speed'));
            if (player.isHuman) {
                var minimumBid = this.settings.GetSetting('setting_minimum_bid');
                if (player.currentRoundBid != minimumBid) {
                    RememberLatestGameState();
                }
            }
        }
    }

    function UpdateBidviewBrightness(playerPosition, isBright) {
        var title = document.getElementById('bid_view_title_' + playerPosition);
        var valueLabel = document.getElementById('bid_view_value_' + playerPosition);
        if (isBright) {
            title.style.color = "#FFFFFF";
            valueLabel.style.color = "#FFFFFF";
        } else {
            title.style.color = "#666666";
            valueLabel.style.color = "#666666";
        }
    }

    function UpdateBidViewBid(playerPosition, bid, isPassed) {
        var isUsingScoreMultiplier = game.settings.GetSetting('setting_score_multiplier');
        if (playerPosition != 'South') {
            var thinkingView = document.getElementById('player_thinking_' + playerPosition);
            thinkingView.style.visibility = 'hidden';
        }
        var bidView = document.getElementById('bid_view_' + playerPosition);
        var bidViewTitle = document.getElementById('bid_view_title_' + playerPosition);
        var bidViewValue = document.getElementById('bid_view_value_' + playerPosition);
        if (isPassed) {
            bidViewTitle.innerText = "";
            bidViewValue.innerText = "Pass";
            bidViewValue.style.fontSize = '20pt';
        } else if (bid==-1) {
            bidViewTitle.innerText = "";
            bidViewValue.innerText = "";
        } else {
            bidViewTitle.innerText = "Bid:";
            bidViewValue.style.fontSize = '26pt'
            bidViewValue.innerText = isUsingScoreMultiplier ? 10*bid : bid;
        }
    }

    function UpdateBidViewIsContract(playerPosition) {
        var bidView = document.getElementById('bid_view_' + playerPosition);
        bidView.style.background = (playerPosition=='South' || playerPosition=='North') ? '#0000BB' : '#FF0000';
    }

    function HideBidView(playerPosition) {
        if (playerPosition != 'South') {
            var thinkingView = document.getElementById('player_thinking_' + playerPosition);
            thinkingView.style.visibility = 'hidden';
        }
        var bidView = document.getElementById('bid_view_' + playerPosition);
        with (bidView.style) {
            WebkitTransition = MozTransition = OTransition = msTransition = "0.3s linear";
            opacity = 0;
        }
    }

    function BumpBidView(playerPosition) {
        var raiseContainer = document.getElementById('bid_view_' + playerPosition);
        raiseContainer.addEventListener("animationend", function() {
            raiseContainer.classList.remove('bumpBidView');
        });
        raiseContainer.classList.add('bumpBidView');
    }

    function BumpSouthBidView() {
        var raiseContainer = document.getElementById('bid_view_South');
        raiseContainer.addEventListener("animationend", function() {
            raiseContainer.classList.remove('bumpSouthBidView');
        });
        raiseContainer.classList.add('bumpSouthBidView');
    }

    function ShowContractOnBidView(position) {
        var raiseContainer = document.getElementById('bid_view_' + position);
        raiseContainer.addEventListener("animationend", function() {
            raiseContainer.classList.remove('showContractBidView' + position);
        });
        raiseContainer.classList.add('showContractBidView' + position);
    }

    function OnContractWon() {
        if (game.currentHighestBidder.playerPositionInt == 0) {
            HideBidView('West');
            HideBidView('North');
            HideBidView('East');
            UpdateBidViewBid('South', game.players[0].currentRoundBid, false);
            UpdateBidviewBrightness('South', true);
            UpdateBidViewIsContract('South');
            var bidView = document.getElementById('bid_view_South');
            bidView.style.opacity = 1;
            bidView.style.visibility = 'visible';
            BumpSouthBidView();

            game.currentMoveStage = 'ChoosingTrumpSuit';
            RememberLatestGameState();
            PromptPlayerToChooseTrumpSuit();

        } else {
            switch (game.currentHighestBidder.playerPositionInt) {
                case 1:
                    HideBidView('North');
                    HideBidView('East');
                    break;
                case 2:
                    HideBidView('West');
                    HideBidView('East');
                    break;
                case 3:
                    HideBidView('West');
                    HideBidView('North');
                    break;
            }
            UpdateBidViewIsContract(game.currentHighestBidder.playerPosition);
            ShowContractOnBidView(game.currentHighestBidder.playerPosition);
            IndicateTrumpSuit(game.currentHighestBidder.playerPosition);
            
            var passingCardsCount = Number(game.settings.GetSetting('setting_passing_cards_count'));
            if (passingCardsCount > 0) {
                if (game.currentHighestBidder.playerPosition == 'North') {
                    setTimeout(function(){
                        game.currentMoveStage = 'ChoosingPassCards';
                        RememberLatestGameState();
                        game.players[0].ChoosePassingCards(passingCardsCount);    
                    }, 2000);
                } else if (game.currentHighestBidder.playerPosition == 'West') {
                    game.players[3].ChoosePassingCards(passingCardsCount);
                } else {
                    game.players[1].ChoosePassingCards(passingCardsCount);
                }
            } else {
                setTimeout(function() {
                    game.currentMoveStage = 'AcceptingMelds';
                    RememberLatestGameState();
                    CountMeldsForRound(true);
                }, 2000);
            }
        }

        scoreboard.UpdateScores(true, false, false);
    }

    var trumpIndicatorIsVisible = false;

    function IndicateTrumpSuit(playerPosition) {
        switch (game.trumpSuit) {
            case 'S':
                document.getElementById('pinochle_trump_suit_image').style.backgroundImage = "url(shared/images/score_spade.png)";
                break;
            case 'H':
                document.getElementById('pinochle_trump_suit_image').style.backgroundImage = "url(shared/images/score_heart.png)";
                break;
            case 'C':
                document.getElementById('pinochle_trump_suit_image').style.backgroundImage = "url(shared/images/score_club.png)";
                break;
            case 'D':
                document.getElementById('pinochle_trump_suit_image').style.backgroundImage = "url(shared/images/score_diamond.png)";
                break;
        }

        var trumpIndicator = document.getElementById('pinochle_trump_suit_indicator');
        trumpIndicator.positionFunction = "GetTrumpSuitIndicatorPosition()";
        var endPosition = eval(trumpIndicator.positionFunction);

        if (playerPosition == null) {
            if (!trumpIndicatorIsVisible) {
                with (trumpIndicator.style) {
                    WebkitTransition = MozTransition = OTransition = msTransition = transition = "none";
                    transform = 'translate(-50%,-200%)';
                    visibility = 'visible';
                    opacity = 1;
                    left = endPosition[0] + 'px';
                    top = endPosition[1] + 'px';
                }
                setTimeout(function() {
                    with (trumpIndicator.style) {
                        WebkitTransition = MozTransition = OTransition = msTransition = transition = "0.3s ease-in-out";
                        transform = 'translate(-50%,-50%)';
                    }
                }, 100);
            }
        } else {
            var startPosition = [0,0];
            var pauseTop = gameContainer.innerHeight*0.25;
            switch (playerPosition) {
                case 'West':
                    startPosition[0] = -45;
                    startPosition[1] = gameContainer.innerHeight*0.5;
                    break;
                case 'North':
                    startPosition[0] = gameContainer.innerWidth*0.5;
                    startPosition[1] = -80;
                    pauseTop = 100;
                    break;
                default:
                    startPosition[0] = gameContainer.innerWidth + 45;
                    startPosition[1] = gameContainer.innerHeight*0.5;
                    break;
            }
            with (trumpIndicator.style) {
                WebkitTransition = MozTransition = OTransition = msTransition = transition = "none";
                left = startPosition[0] + 'px';
                top = startPosition[1] + 'px';
                visibility = 'visible';
                opacity = 1;
            }

            setTimeout(function() {
                var middlePosition = [gameContainer.innerWidth*0.5, pauseTop];
                with (trumpIndicator.style) {
                    WebkitTransition = MozTransition = OTransition = msTransition = transition = "1.0s ease-out";
                    left = middlePosition[0] + 'px';
                    top = middlePosition[1] + 'px';
                    transform = 'translate(-50%,-50%) scale(1.5)';
                }
                setTimeout(function() {
                    with (trumpIndicator.style) {
                        WebkitTransition = MozTransition = OTransition = msTransition = transition = "1s ease-in-out";
                        left = endPosition[0] + 'px';
                        top = endPosition[1] + 'px';
                        transform = 'translate(-50%,-50%) scale(1)';
                    }
                }, 3000);
            }, 100);
        }

        trumpIndicatorIsVisible = true;
    }

    function HideTrumpIndicator() {
        var trumpIndicator = document.getElementById('pinochle_trump_suit_indicator');
        with (trumpIndicator.style) {
            WebkitTransition = MozTransition = OTransition = msTransition = transition = "0.3s ease-in-out";
            transform = 'translate(-50%,-200%)';
        }
        trumpIndicatorIsVisible = false;
    }

    var selectTrumpViewIsVisible = false;

    PromptPlayerToChooseTrumpSuit = function() {
        if (selectTrumpViewIsVisible) {
            return;
        }

        var selectTrumpView = document.getElementById('pinochle_choose_trump_suit_view');
        selectTrumpView.positionFunction = "GetTrumpSuitSelectorPosition()";
        var position = eval(selectTrumpView.positionFunction);
        selectTrumpView.style.transition = 'none';
        selectTrumpView.style.left = position[0] + 'px';
        selectTrumpView.style.top = gameContainer.innerHeight - 130 + 'px';
        selectTrumpView.style.transform = "translate(-50%,-50%) scale(0.01) ";
        selectTrumpView.style.opacity = 1;
        selectTrumpView.style.visibility = 'visible';
        setTimeout(function() {
            with (selectTrumpView.style) {
                transition = '0.4s ease-out';
                transform = 'translate(-50%,-50%) scale(1) ';
                top = gameContainer.innerHeight*0.3 + 'px';
            }
        } ,500);

        selectTrumpViewIsVisible = true;

        if (this.skillLevel === 'Easy' || game.settings.GetSetting('setting_hints')) {
            ShowHintButton(0);
        }

        scoreboard.UpdateScores(true, false, false);
    }

    HideSelectTrumpView = function() {
        if (!selectTrumpViewIsVisible) {
            return;
        }

        var selectTrumpView = document.getElementById('pinochle_choose_trump_suit_view');
        with (selectTrumpView.style) {
            transition = '0.3s ease-in';
            transform = 'translate(-50%,-50%) scale(0.1) ';
            top = gameContainer.innerHeight + 100 + 'px';
            opacity = 0;
        }

        selectTrumpViewIsVisible = false;
    }

    this.OnTrumpSuitButtonPressed = function(suit) {
        game.trumpSuit = suit;
        HideHintButton();
        HideRedoButton();
        HideUndoButton();

        HideSelectTrumpView();
        IndicateTrumpSuit(null);

        var passingCardsCount = Number(this.settings.GetSetting('setting_passing_cards_count'));
        if (passingCardsCount > 0) {
            game.players[2].ChoosePassingCards(passingCardsCount);
        } else {
            setTimeout(function() {
                game.currentMoveStage = 'AcceptingMelds';
                RememberLatestGameState();
                CountMeldsForRound(true);
            }, 1000);
        }
    }

    this.PromptPlayerToChoosePassingCards = function() {
      
        var selectPassingCardsMessage = document.getElementById('pinochle_select_passing_cards_message');
        var passingCardsCount = Number(this.settings.GetSetting('setting_passing_cards_count'));
        selectPassingCardsMessage.innerText = passingCardsCount>1 ? "Select " + passingCardsCount + " cards to pass:" : "Select 1 card to pass:";
        
        currentPassingCardViews = [];
        for (var i=0; i<passingCardsCount; i++) {
            currentPassingCardViews.push(null);
        }

        selectPassingCardsMessage.positionFunction = "GetPassingCardsMessageLocation()";
        var loc = eval(selectPassingCardsMessage.positionFunction);
        selectPassingCardsMessage.style.transition = "none";
        selectPassingCardsMessage.style.left = loc[0] + "px";
        selectPassingCardsMessage.style.top = loc[1] + "px";
        with (selectPassingCardsMessage.style) {
            visibility = "visible";
            transition = "0.5s linear";
            transitionDelay = "0s";
            opacity = 1;
        }

        for (var i=0; i<passingCardsCount; i++) {
            var selectPassingCardsRegion = document.getElementById('select_passing_cards_region_' + i);
            selectPassingCardsRegion.positionFunction = "GetPassingCardsLocation(" + i + ")";
            var loc = eval(selectPassingCardsRegion.positionFunction);
            selectPassingCardsRegion.style.transition = "none";
            selectPassingCardsRegion.style.left = loc[0] + "px";
            selectPassingCardsRegion.style.top = loc[1] + "px";
            with (selectPassingCardsRegion.style) {
                visibility = "visible";
                transition = "0.5s linear";
                transitionDelay = "0s";
                opacity = 1;
            }
        }

        for (var i=0; i<4; i++) {
            var player = game.players[i];
            for (var j=0; j<player.cards.length; j++) {
                player.cards[j].cardView.isClickable = i==0;
            }
        }
        this.currentMoveStage = "ChoosingPassCards";
        
        if (this.skillLevel === 'Easy' || this.settings.GetSetting('setting_hints')) {
          ShowHintButton(0);
        }

        scoreboard.UpdateScores(true, false, false);
    }

    function GetPassingCardsMessageLocation() {
        return [0, gameContainer.innerHeight*0.5 - 220];
    }

    function GetPassingCardsLocation(index)
    {
        var spotWidth = 110;
        var spotPadding = 15;
        var totalWidth = spotWidth*currentPassingCardViews.length + spotPadding*(currentPassingCardViews.length-1);
        var left = (gameContainer.innerWidth - totalWidth)*0.5 + (spotWidth+spotPadding)*index;
        
        return [left, gameContainer.innerHeight*0.5 - 180];
    }

    this.passingCardsConfirmed= function() {
        HideHintButton();
        HideUndoButton();
        HideRedoButton();
        HidePassCardsViews();

        game.PlayerChosePassingCards(game.players[0]);
    }

    function HidePassCardsViews() {
        var viewsToHide = [
            'pinochle_confirm_passing_cards_button',
            'pinochle_select_passing_cards_message',
            'select_passing_cards_region_0',
            'select_passing_cards_region_1',
            'select_passing_cards_region_2',
            'select_passing_cards_region_3'
            ];
        for (var i = 0; i < viewsToHide.length; i++) {
            var view = document.getElementById(viewsToHide[i]);
            view.style.transition = "0.2s linear";
            view.style.opacity = 0;
            view.style.visibility = 'hidden';
        }
    }

    this.PlayerChosePassingCards = function(player) {
        var receivingPlayer = game.players[(player.playerPositionInt+2)%4];
        receivingPlayer.receivedCards = [];
        for (var i=0; i<player.passingCards.length; i++) {
            player.passingCards[i].wasPassed = true;
            receivingPlayer.receivedCards.push(player.passingCards[i]);
            receivingPlayer.cards.push(player.passingCards[i]);
        }
        
        var fullHandCardsCount = game.isDoubleDeck?20:12;
        if (player.cards.length < fullHandCardsCount) {
            var delay = 1000;
            if (receivingPlayer.playerPosition == 'South') {
                delay = 300;
            } else if (receivingPlayer.playerPosition == 'North') {
                delay = 0;
            }
            setTimeout(function() {
                AnimatePlayerHandCardsIntoPosition(player.playerPosition, '1s', true);
                AnimatePlayerHandCardsIntoPosition(receivingPlayer.playerPosition, '1s', true);
                
                if (receivingPlayer.playerPosition == 'South') {
                    setTimeout(function() {
                        var passingCardsCount = Number(game.settings.GetSetting('setting_passing_cards_count'));
                        if (passingCardsCount > 0) {
                            if (receivingPlayer.isHuman) {
                                game.currentMoveStage = 'ChoosingPassCards';
                                RememberLatestGameState();
                            }
                            receivingPlayer.ChoosePassingCards(passingCardsCount);
                        } else {
                            setTimeout(function(){
                                game.currentMoveStage = 'AcceptingMelds';
                                RememberLatestGameState();
                                CountMeldsForRound(true);
                            }, 2000);
                        }
                    },1400);
                } else {
                    var passingCardsCount = Number(game.settings.GetSetting('setting_passing_cards_count'));
                    if (passingCardsCount > 0) {
                        if (receivingPlayer.isHuman) {
                            game.currentMoveStage = 'ChoosingPassCards';
                            RememberLatestGameState();
                        }
                        receivingPlayer.ChoosePassingCards(passingCardsCount);
                    } else {
                        setTimeout(function() {
                            game.currentMoveStage = 'AcceptingMelds';
                            RememberLatestGameState();
                            CountMeldsForRound(true);
                        }, 1400);
                    }
                }

            }, delay);

        } else {
            var delay = 1300;
            if (receivingPlayer.playerPosition == 'North') {
                delay = 0;
            }

            if (receivingPlayer.playerPosition == 'South') {
                // Sort the players cards
                if (this.settings.GetSetting('setting_sort_left_to_right')) {
                    receivingPlayer.cards.sort(function(a,b) {
                        if (a.suit != b.suit) {
                            return a.suitInt - b.suitInt;
                        } else {
                            return b.value - a.value;
                        }
                    });
                    player.passingCards.sort(function(a,b) {
                        if (a.suit != b.suit) {
                            return a.suitInt - b.suitInt;
                        } else {
                            return b.value - a.value;
                        }
                    });
                } else {
                    receivingPlayer.cards.sort(function(a,b) {
                        if (a.suit != b.suit) {
                            return a.suitInt - b.suitInt;
                        } else {
                            return a.value - b.value;
                        }
                    });
                    player.passingCards.sort(function(a,b) {
                        if (a.suit != b.suit) {
                            return a.suitInt - b.suitInt;
                        } else {
                            return a.value - b.value;
                        }
                    });
                }

                // Pause the cards so the user can see them before then go into the player's hand
                setTimeout(function() {
                    var spotWidth = 110;
                    var spotPadding = 15;
                    var totalWidth = spotWidth*currentPassingCardViews.length + spotPadding*(currentPassingCardViews.length-1);

                    var leftOffset = (gameContainer.innerWidth - totalWidth)*0.5;
                    var curTop = gameContainer.innerHeight*0.3;
                    for (var i=0; i<player.passingCards.length; i++) {
                        var cardView = player.passingCards[i].cardView;
                        flipUpCard(cardView, true);
                        var curLeft = leftOffset + (spotWidth+spotPadding)*i;
                        var z = receivingPlayer.cards.indexOf(player.passingCards[i]) + 100;
                        with (cardView.style) {
                            transition = "1s ease-out";
                            transitionDelay = "0s";
                            left = curLeft + 'px';
                            top = curTop + 'px';
                            transform = 'none';
                            zIndex = z;
                        }
                    }
                    setTimeout(function() {
                        AnimatePlayerHandCardsIntoPosition(player.playerPosition, '1s', true);
                        AnimatePlayerHandCardsIntoPosition(receivingPlayer.playerPosition, '1s', true);
                        setTimeout(function() {
                            game.currentMoveStage = 'AcceptingMelds';
                            RememberLatestGameState();
                            CountMeldsForRound(true);
                        }, 1300);
                    }, 1800);
                }, delay);

            } else {
                setTimeout(function() {
                    AnimatePlayerHandCardsIntoPosition(player.playerPosition, '1s', true);
                    AnimatePlayerHandCardsIntoPosition(receivingPlayer.playerPosition, '1s', true);
                    setTimeout(function() {
                        game.currentMoveStage = 'AcceptingMelds';
                        RememberLatestGameState();
                        CountMeldsForRound(true);
                    }, 1600);
                }, delay);
            }
        }
    }

    function CountMeldsForRound(updateStats) {
        HideBidView('South');
        HideBidView('West');
        HideBidView('East');
        HideBidView('North');

        for (var i=0; i<4; i++) {
            var player = game.players[i];
            player.passingCards = [];
            player.CalculateMelds(player.cards, game.trumpSuit, game.isDoubleDeck, false);
            for (var j=0; j<player.melds.length; j++) {
                var meld = player.melds[j];
                for (var k=0; k<meld.cards.length; k++) {
                    var card = meld.cards[k];
                    card.wasShown = true;
                }
            }
        }

        // Position for each player
        var isUsingScoreMultiplier = game.settings.GetSetting('setting_score_multiplier');
        playerWestNameTopForAcceptingMelds = 250;
        playerEastNameTopForAcceptingMelds = 250;
        playerSouthNameTopForAcceptingMelds = gameContainer.innerHeight-315;
        for (var playerIndex=0; playerIndex<4; playerIndex++) {
            var player = game.players[playerIndex];
            var meldCards = [];
            for (var i=0; i<player.melds.length; i++) {
                for (var j=0; j<player.melds[i].cards.length; j++) {
                    var card = player.melds[i].cards[j];
                    if (!meldCards.includes(card)) {
                        meldCards.push(card);
                    }
                }
            }
            
            if (playerIndex==0 && meldCards.length==0) {
                playerSouthNameTopForAcceptingMelds = gameContainer.innerHeight-240;
            }

            var curDelay = 0;
            for (var i=0; i<meldCards.length; i++) {
                var cardView = meldCards[i].cardView;
                UnshadeCard(cardView);
                cardView.positionFunction = 'GetMeldCardLocation("' + player.playerPosition + '", ' + i + ', ' + meldCards.length + ', false)';
                if (i==0 && playerIndex==1) {
                    var p = eval(cardView.positionFunction);
                    playerWestNameTopForAcceptingMelds = p[1]-40;
                } else if (i==0 && playerIndex==3) {
                    var p = eval(cardView.positionFunction);
                    playerEastNameTopForAcceptingMelds = p[1]-40;
                }
                setTimeout(function(aCardView, aIndex) {
                    var pos = eval(aCardView.positionFunction);
                    flipUpCard(aCardView, true);
                    with (aCardView.style) {
                        transition = '0.3s ease-out';
                        left = pos[0] + 'px';
                        top = pos[1] + 'px';
                        transform = 'rotate(0deg)';
                        zIndex = 900 + aIndex;
                    }
                }, curDelay, cardView, i);
                if (playerIndex != 0) {
                    curDelay += 100;
                }
            }
            for (var i=0; i<player.cards.length; i++) {
                if (!meldCards.includes(player.cards[i])) {
                    var cardView = player.cards[i].cardView;
                    UnshadeCard(cardView);
                    cardView.positionFunction = 'GetMeldCardLocation("' + player.playerPosition + '", ' + i + ', ' + player.cards.length + ', true)';
                    var pos = eval(cardView.positionFunction);
                    if (playerIndex==0) {
                        with (cardView.style) {
                            transition = '0.6s ease-out';
                            left = pos[0] + 'px';
                            top = pos[1] + 'px';
                            transform = 'rotate(0deg)';
                        }
                    } else {
                        with (cardView.style) {
                            transition = '0.6s ease-out';
                            left = pos[0] + 'px';
                            top = pos[1] + 'px';
                        }
                    }
                }
            }

            var meldView = document.getElementById('meld_view_' + player.playerPosition);
            var meldTitle = document.getElementById('meld_view_title_' + player.playerPosition);
            var meldValue = document.getElementById('meld_view_value_' + player.playerPosition);
            meldValue.innerHTML = isUsingScoreMultiplier ? player.currentRoundMeldScore*10 : player.currentRoundMeldScore;
            if (player.melds.length == 0) {
                meldTitle.innerHTML = "Meld";
            } else {
                var meldTitleText = "";
                for (var i=0; i<player.melds.length; i++) {
                    if (i!=0) {
                        meldTitleText += ", ";
                    }
                    meldTitleText += player.melds[i].meldType;
                }
                meldTitle.innerText = meldTitleText;
            }
            meldView.positionFunction = "GetMeldViewPosition('" + player.playerPosition + "', " + meldCards.length + ")";
            var pos = eval(meldView.positionFunction);
            meldView.style.transition = "none";
            meldView.style.left = pos[0] + "px";
            meldView.style.top = pos[1] + "px";
            setTimeout(function(playerPos) {
                var meldView = document.getElementById('meld_view_' + playerPos);
                meldView.style.transition = "0.3s linear";
                meldView.style.opacity = 1;
                meldView.style.visibility = "visible";
            }, curDelay, player.playerPosition);

            var playerName = document.getElementById('player_name_' + player.playerPosition);
            playerName.style.transition = '0.3s ease-in-out';
            var pos = eval(playerName.positionFunction);
            playerName.style.left = pos[0] + "px";
            playerName.style.top = pos[1] + "px";
        }

        if (updateStats) {
            var bidString = "withoutbid";
            if (game.bidWinner == 0 || game.bidWinner == 2) {
                bidString = "withbid";
            }
            var doubleDeckString = "";
            if (game.isDoubleDeck) {
                doubleDeckString = "_DoubleDeck";
            }

            var totalKey = 'stat_meld_' + bidString + "_total_" + game.skillLevel + doubleDeckString;
            var curTotal = game.settings.GetStatistic(totalKey);
            curTotal += game.players[0].currentRoundMeldScore + game.players[2].currentRoundMeldScore;
            game.settings.SetStatistic(totalKey, curTotal);

            var countKey = 'stat_meld_' + bidString + "_count_" + game.skillLevel + doubleDeckString;
            var curCount = Number(game.settings.GetStatistic(countKey));
            curCount += 1;
            game.settings.SetStatistic(countKey, curCount);
        }

        var acceptMeldPrompt = document.getElementById('accept_meld_view_prompt');
        var acceptMeldButton = document.getElementById('accept_meld_view_button');
        var throwInButton = document.getElementById('thow_in_button');
        var maxPossibleCounters = game.isDoubleDeck ? 49 : 25;
        if (game.bidWinner == 0 || game.bidWinner == 2) {
            var contract = game.players[game.bidWinner].currentRoundBid;
            var meldScore = game.players[0].currentRoundMeldScore + game.players[2].currentRoundMeldScore;
            if (contract - meldScore > maxPossibleCounters) {
                acceptMeldPrompt.innerHTML = 'Contract is unreachable.<br>You must throw in.';
                acceptMeldPrompt.style.display = "block";
                acceptMeldButton.style.display = 'none';
                throwInButton.innerText = "Throw In";
                throwInButton.style.display = 'block';
            } else {
                acceptMeldPrompt.style.display = 'none';
                acceptMeldButton.style.display = 'block';
                throwInButton.style.display = 'none';
            }
        } else {
            var contract = game.players[game.bidWinner].currentRoundBid;
            var meldScore = game.players[1].currentRoundMeldScore + game.players[3].currentRoundMeldScore;
            if (contract - meldScore > maxPossibleCounters) {
                acceptMeldPrompt.innerHTML = 'Contract is unreachable.<br>Opponents throw in.';
                acceptMeldPrompt.style.display = "block";
                acceptMeldButton.style.display = 'none';
                throwInButton.innerText = "Accept";
                throwInButton.style.display = 'block';
            } else {
                acceptMeldPrompt.style.display = 'none';
                acceptMeldButton.style.display = 'block';
                throwInButton.style.display = 'none';
            }
        }

        var acceptMeldView = document.getElementById('accept_meld_view');
        with (acceptMeldView.style) {
            transition = '0.3s linear';
            transitionDelay = '1s';
            opacity = 1;
            visibility = 'visible';
        }

        setTimeout(function(){
            scoreboard.UpdateScores(true, true, false);
        }, 1000);
    }

    function HideAcceptMeldView() {
        var acceptMeldView = document.getElementById('accept_meld_view');
        with (acceptMeldView.style) {
            transition = '0.3s linear';
            transitionDelay = 'none';
            opacity = 0;
            visibility = 'hidden';
        }

        for (var i=0; i<4; i++) {
            var meldView = document.getElementById('meld_view_' + game.players[i].playerPosition);
            with (meldView.style) {
                transition = "0.5s linear";
                opacity = 0;
            }
            var playerName = document.getElementById('player_name_' + game.players[i].playerPosition);
            var pos = eval(playerName.positionFunction)
            with (playerName.style) {
                transition = "0.5s ease-in-out";
                left = pos[0] + 'px';
                top = pos[1] + 'px';
            }
        }
    }

    function GetMeldCardLocation(position, index, cardCount, isNonMeld) {

        var cardWidthHalf = 115*0.5;
        var meldCardSpacing = 50;
        var meldCardStackSpacing = 45;
        var meldCardMaxPerLine = 4;
        var meldLeftOffset = 90;
        var meldTopOffset = 70;
        var meldRightOffset = 90;

        switch (position) {
            case 'West':
            {
                var handLocationFirst = GetHandCardLocation(position, 0, 13);
                var handLocationLast = GetHandCardLocation(position, 12, 13);

                if (isNonMeld) {
                    return [(handLocationFirst[0] + handLocationLast[0])*0.5, (handLocationFirst[1] + handLocationLast[1])*0.5];
                } else {
                    var sideMeldCardStackSpacing = meldCardStackSpacing;
                    var curLeft = meldLeftOffset;
                    var curTop = (handLocationFirst[1] + handLocationLast[1])*0.5 - 10;
                    if (cardCount > meldCardMaxPerLine) {
                        var lines = Math.ceil(cardCount / meldCardMaxPerLine);
                        curTop -= (lines-1)*sideMeldCardStackSpacing*0.5;
                    }
                    var cardsOnLineCount = 0;
                    var remainingMeldCardsCount = cardCount;
                    for (var i=0; i<cardCount; i++) {
                        if (cardsOnLineCount >= meldCardMaxPerLine) {
                            cardsOnLineCount = 0;
                            curTop += sideMeldCardStackSpacing;
                            if (remainingMeldCardsCount < meldCardMaxPerLine) {
                                curLeft = meldLeftOffset + (meldCardMaxPerLine-remainingMeldCardsCount)*meldCardSpacing*0.5;
                            } else {
                                curLeft = meldLeftOffset;
                            }
                        }
                        if (i==index) {
                            return [curLeft - cardWidthHalf, curTop];
                        }
                        
                        curLeft += meldCardSpacing;
                        cardsOnLineCount++;
                        remainingMeldCardsCount--;
                    }
                }
            }
            break;
            case 'North':
            {
                var handLocationFirst = GetHandCardLocation(position, 0, 13);
                var handLocationLast = GetHandCardLocation(position, 12, 13);

                if (isNonMeld) {
                    return [(handLocationFirst[0] + handLocationLast[0])*0.5, (handLocationFirst[1] + handLocationLast[1])*0.5];
                } else {
                    var flatMeldCardSpacing = meldCardSpacing;
                    curLeft = (gameContainer.innerWidth - (cardCount-1)*flatMeldCardSpacing)*0.5;
                    if (curLeft < 50) {
                        curLeft = 50;
                        flatMeldCardSpacing = cardCount>1?((gameContainer.innerWidth-100)/(cardCount-1)):meldCardSpacing;
                    }
                    curTop = meldTopOffset;
                    for (var i=0; i<cardCount; i++) {
                        if (i==index) {
                            return [curLeft - cardWidthHalf, curTop];
                        }
                        curLeft += flatMeldCardSpacing;
                    }
                }
            }
            break;
            case 'East':
            {
                var handLocationFirst = GetHandCardLocation(position, 0, 13);
                var handLocationLast = GetHandCardLocation(position, 12, 13);

                if (isNonMeld) {
                    return [(handLocationFirst[0] + handLocationLast[0])*0.5, (handLocationFirst[1] + handLocationLast[1])*0.5];
                } else {
                    var sideMeldCardStackSpacing = meldCardStackSpacing;
                    var curLeft = (gameContainer.innerWidth - (cardCount-1)*meldCardSpacing) - meldRightOffset;
                    var curTop = (handLocationFirst[1] + handLocationLast[1])*0.5 - 10;
                    if (cardCount > meldCardMaxPerLine) {
                        var lines = Math.ceil(cardCount / meldCardMaxPerLine);
                        curTop -= (lines-1)*sideMeldCardStackSpacing*0.5;
                        curLeft = (gameContainer.innerWidth - (meldCardMaxPerLine-1)*meldCardSpacing) - meldRightOffset;
                    }

                    var cardsOnLineCount = 0;
                    var remainingMeldCardsCount = cardCount;
                    for (var i=0; i<cardCount; i++) {
                        if (cardsOnLineCount >= meldCardMaxPerLine) {
                            cardsOnLineCount = 0;
                            curTop += sideMeldCardStackSpacing;
                            if (remainingMeldCardsCount < meldCardMaxPerLine) {
                                curLeft = (gameContainer.innerWidth - (meldCardMaxPerLine-1)*meldCardSpacing) - meldRightOffset + (meldCardMaxPerLine-remainingMeldCardsCount)*meldCardSpacing*0.5;
                            } else {
                                curLeft = gameContainer.innerWidth - meldRightOffset - (meldCardMaxPerLine-1)*meldCardSpacing;
                            }
                        }
                        if (i==index) {
                            return [curLeft-cardWidthHalf, curTop];
                        }
                        
                        curLeft += meldCardSpacing;
                        cardsOnLineCount++;
                        remainingMeldCardsCount--;
                    }
                }
            }
            break;
            case 'South':
            {
                if (isNonMeld) {
                    return [gameContainer.innerWidth*0.5 - cardWidthHalf, gameContainer.innerHeight-50];

                    //var handCardLocation = GetHandCardLocation(position, index, cardCount);
                    //return [handCardLocation[0], gameContainer.innerHeight - 130];
                } else {
                    var flatMeldCardSpacing = meldCardSpacing;
                    curLeft = (gameContainer.innerWidth - (cardCount-1)*flatMeldCardSpacing)*0.5;
                    if (curLeft < 50) {
                        curLeft = 50;
                        flatMeldCardSpacing = cardCount>1?((gameContainer.innerWidth-100)/(cardCount-1)):meldCardSpacing;
                    }
                    curTop = gameContainer.innerHeight - 270;
                    for (var i=0; i<cardCount; i++) {
                        if (i==index) {
                            return [curLeft - cardWidthHalf, curTop];
                        }
                        curLeft += flatMeldCardSpacing;
                    }
                }
            }
            break;
        }

    }

    function GetMeldViewPosition(position, cardsCount) {
        switch (position) {
            case 'West':
            case 'East':
            {
                var cardWidthHalf = 115*0.25;
                if (cardsCount == 0) {
                    var pos = GetPlayerBidPosition(position);
                    return [pos[0]+cardWidthHalf, pos[1]];
                } else {
                    var meldCardMaxPerLine = 4;
                    if (cardsCount <= meldCardMaxPerLine) {
                        var leftPos = GetMeldCardLocation(position, 0, cardsCount, false);
                        var rightPos = GetMeldCardLocation(position, cardsCount-1, cardsCount, false);
                        return [(leftPos[0]+rightPos[0])*0.5 + 2*cardWidthHalf, leftPos[1]+50];
                    } else {
                        var midPos = GetMeldCardLocation(position, meldCardMaxPerLine*0.5, cardsCount, false);
                        var lastPos = GetMeldCardLocation(position, cardsCount-1, cardsCount, false);
                        return [midPos[0]+cardWidthHalf, lastPos[1]+50];
                    }   
                }
            }
            break;
            case 'North':
            {
                return [gameContainer.innerWidth*0.5, 130];
            }
            break;
            case 'South':
            {
                return [gameContainer.innerWidth*0.5, gameContainer.innerHeight-200];
            }
            break;
        }
    }

    this.OnThrowInButtonPressed = function() {
        game.currentMoveStage = 'none';
        var acceptMeldView = document.getElementById('accept_meld_view');
        acceptMeldView.style.transitionDelay = 'none';
        acceptMeldView.style.transition = 'none';
        acceptMeldView.style.opacity = 0;
        acceptMeldView.style.visibility = 'hidden';

        for (var i=0; i<4; i++) {
            var meldView = document.getElementById('meld_view_' + game.players[i].playerPosition);
            with (meldView.style) {
                transition = "0.5s linear";
                opacity = 0;
            }
            var playerName = document.getElementById('player_name_' + game.players[i].playerPosition);
            var pos = eval(playerName.positionFunction)
            with (playerName.style) {
                transition = "0.5s ease-in-out";
                left = pos[0] + 'px';
                top = pos[1] + 'px';
            }
        }

        AnimatePlayerHandCardsIntoPosition('West', '1s', true);
        AnimatePlayerHandCardsIntoPosition('North', '1s', true);
        AnimatePlayerHandCardsIntoPosition('East', '1s', true);
        AnimatePlayerHandCardsIntoPosition('South','1s', true);

        if (game.bidWinner == 0 || game.bidWinner == 2) {
            game.players[0].currentRoundCountersTaken = -1;
        } else {
            game.players[1].currentRoundCountersTaken = -1;
        }

        this.FinishRound();
    }

    this.OnAcceptMeldButtonPressed = function() {
        game.currentMoveStage = 'none';
        var acceptMeldView = document.getElementById('accept_meld_view');
        acceptMeldView.style.transitionDelay = 'none';
        acceptMeldView.style.transition = 'none';
        acceptMeldView.style.opacity = 0;
        acceptMeldView.style.visibility = 'hidden';

        for (var i=0; i<4; i++) {
            var meldView = document.getElementById('meld_view_' + game.players[i].playerPosition);
            with (meldView.style) {
                transition = "0.5s linear";
                opacity = 0;
            }
            var playerName = document.getElementById('player_name_' + game.players[i].playerPosition);
            var pos = eval(playerName.positionFunction)
            with (playerName.style) {
                transition = "0.5s ease-in-out";
                left = pos[0] + 'px';
                top = pos[1] + 'px';
            }
            
            var cardsLeftPos = GetHandCardLocation(game.players[i].playerPosition, 0, 12);
            var cardsRightPos = GetHandCardLocation(game.players[i].playerPosition, 11, 12);
            var x = (cardsLeftPos[0] + cardsRightPos[0])*0.5;
            var y = (cardsLeftPos[1] + cardsRightPos[1])*0.5;
            var rotation = i==0 ? "rotate(0deg)" : "rotate(" + cardsLeftPos[2] + "deg)";
            for (var j=0; j<game.players[i].cards.length; j++) {
                var cardView = game.players[i].cards[j].cardView;
                if (i!=0) {
                    flipDownCard(cardView, true);
                }
                with (cardView.style) {
                    transition = "0.8s ease-in-out";
                    transitionDelay = "none";
                    left = x + 'px';
                    top = y + 'px';
                    transform = rotation;
                    //if (i==0) {
                        zIndex = 100 + j;  
                    //}
                }
            }
        }
        
        
        setTimeout(function() {
            AnimatePlayerHandCardsIntoPosition('West', '1s', true);
            AnimatePlayerHandCardsIntoPosition('North', '1s', true);
            AnimatePlayerHandCardsIntoPosition('East', '1s', true);
            AnimatePlayerHandCardsIntoPosition('South','1s', true);   

            setTimeout(function() {
                scoreboard.UpdateScores(true, true, true);
                UpdatePlayerRoundScore(false);
                UpdatePlayerRoundScore(true);   
                game.StartTrickTaking();             
            }, 800);
            
        }, 1000);
        
        
        
    }

    function UpdatePlayerRoundScore(isNorthSouth) {
        
        var countersDisplay = Number(game.settings.GetSetting('setting_counters_display'));
        var isUsingScoreMultiplier = game.settings.GetSetting('setting_score_multiplier');
        var isShowingContract = false;
        var contractValue = game.players[game.bidWinner].currentRoundBid;
        var countersScore = 0;
        var currentRoundScoreValue = 0;
        var playerPositionToUpdate = 'South';
        if (isNorthSouth) {
            isShowingContract = game.bidWinner == 2 || game.bidWinner == 0;
            playerPositionToUpdate = isShowingContract ? game.players[game.bidWinner].playerPosition : 'South';
            var meldScore = game.players[0].currentRoundMeldScore + game.players[2].currentRoundMeldScore;
            countersScore = game.players[0].currentRoundCountersTaken + game.players[2].currentRoundCountersTaken;
            currentRoundScoreValue = meldScore + countersScore;
        } else {
            isShowingContract = game.bidWinner == 1 || game.bidWinner == 3;
            playerPositionToUpdate = isShowingContract ? game.players[game.bidWinner].playerPosition : 'West';
            var meldScore = game.players[1].currentRoundMeldScore + game.players[3].currentRoundMeldScore;
            countersScore = game.players[1].currentRoundCountersTaken + game.players[3].currentRoundCountersTaken;
            currentRoundScoreValue = meldScore + countersScore;
        }

        var playerScore = document.getElementById('player_score_' + playerPositionToUpdate);
        playerScore.positionFunction = "GetPlayerScorePosition('" + playerPositionToUpdate + "')";
        position = eval(playerScore.positionFunction);
        playerScore.style.left = position[0] + 'px';
        playerScore.style.top = position[1] + 'px';
        if (countersDisplay==0) {
            playerScore.innerText = "";
        } else if (countersDisplay==2) {
            playerScore.innerText = isUsingScoreMultiplier ? countersScore*10 : countersScore;
        } else if (isShowingContract) {
            if (isUsingScoreMultiplier) {
                playerScore.innerText = currentRoundScoreValue*10 + "/" + contractValue*10;
            } else {
                playerScore.innerText = currentRoundScoreValue + "/" + contractValue;
            }
        } else {
            playerScore.innerText = isUsingScoreMultiplier ? currentRoundScoreValue*10 : currentRoundScoreValue;
        }

        return;
    }
    
    function GetHintButtonPosition() {
        var leftPos = GetHandCardLocation('South', 13, 14);
        return [leftPos[0] + 35, leftPos[1]-90];
    }

    this.UpdateShowHintButton = function() {
        if (game == null || game.players.length == 0) {
            return;
        }

        var hintsOn = this.settings.GetSetting('setting_hints');
        if (game.skillLevel == 'Easy' || hintsOn) {
            switch (game.currentMoveStage) {
                case 'ChoosingBids':
                case 'ChoosingTrumpSuit':
                case 'ChoosingTrickCard':
                    ShowHintButton(0);
                    break;
                default:
                    HideHintButton();
                    break;
            }
        } else {
            HideHintButton();
        }
    }

    function ShowHintButton(delay) {
        var hintButton = document.getElementById('pinochle_hint_button');
        switch (game.currentMoveStage) {
            case 'ChoosingBids':
            case 'ChoosingTrumpSuit':
                hintButton.innerText = "Analyze";
                break;
            default:
                hintButton.innerText = "Hint";
        }
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
        var hintButton = document.getElementById('pinochle_hint_button');
        hintButton.style.opacity = 0;
        hintButton.style.pointerEvents = "none";
    }

    this.OnHintButtonClick = function () {
        switch (game.currentMoveStage) {
            case 'ChoosingBids':
            case 'ChoosingTrumpSuit':
                this.ShowRoundSimulationsView();
                break;
            case 'ChoosingPassCards':
            {
                var player = this.players[0];
                var passingCardsCount = this.settings.GetSetting('setting_passing_cards_count');
                var optimalCards = player.FindBestPassingCards(passingCardsCount, 'Pro', game);
                BumpCards(optimalCards, 0);
            }
            break;
            case 'ChoosingTrickCard':
            {
                var player = this.players[0];
                var bestCard = player.FindBestPlayingCard(game, 'Pro');
                BumpCard(bestCard.cardView);
            }
            break;
        }
    }

    this.StartTrickTaking = function() {
        
        game.currentMoveStage = 'ChoosingTrickCard';
        game.trickCards = [];
        this.turnIndex = this.bidWinner;
        this.leadIndex = this.bidWinner;
        var nextPlayer = this.players[this.turnIndex%4];
        nextPlayer.ChoosePlayCard();
        if (nextPlayer.isHuman) {
            RememberLatestGameState();
        }
    }

    this.PromptPlayerToPlayCard = function() {
        var playerPrompt = document.getElementById('pinochle_player_play_prompt');
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
        var legalPlayCards = GetLegalCardsForCurrentPlayerTurn(this);
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

    var HidePlayerPrompt = function() {
        var playerPrompt = document.getElementById('pinochle_player_play_prompt');
        with (playerPrompt.style) {
            transition = "0.1s linear";
            opacity = 0;
        }
    }

    function GetTrickPlayPromptLocation() {
        var pos = GetTrickDiscardLocation('South');
        return [pos[0] + cardLoweredWidth*0.5, [pos[1] + cardLoweredHeight*0.5 + 80]]; 
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

    this.OnPlayerChosePlayCard = function(card) {
        this.currentMoveStage = 'None';
        HidePlayerPrompt();

        var player = this.players[this.turnIndex%4];
        PlayCard(this,card);
        
        var trickSpeed = this.settings.GetSetting('setting_trick_speed');
        var cardTransition = "0.3s ease-out";
        if (trickSpeed == 2) {
            cardTransition = "0.1s ease-out";
        }

        var cardView = card.cardView;
        cardView.positionFunction = "GetTrickDiscardLocation('" + player.playerPosition + "')";
        var loc = eval(cardView.positionFunction);
        flipUpCard(cardView, trickSpeed != 2);
        with (cardView.style) {
            transition = cardTransition;
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
        AnimatePlayerHandCardsIntoPosition(player.playerPosition, "0.3s", true);

        if (this.trickCards.length !== 4) {
            var nextPlayer = this.players[this.turnIndex%4];
            if (nextPlayer.isHuman) {
                nextPlayer.ChoosePlayCard();
                RememberLatestGameState();
            } else {
                setTimeout(function() {
                    nextPlayer.ChoosePlayCard();
                }, 500);
            }
        } else {
            var trickResult = GetTrickResult(this);
            trickResult.trickTaker.currentRoundCountersTaken += trickResult.countersTaken;
            this.leadIndex = trickResult.trickTaker.playerPositionInt;
            this.AnimateTrickResult(trickResult);
        }
    }

    this.DropCardInTrickPile = function() {
        var playedCard = currentDraggedCardView.card;
        HideHintButton();
        this.OnPlayerChosePlayCard(playedCard);
    }

    var currentTrickResult;

    this.AnimateTrickResult = function(trickResult) {
        currentTrickResult = trickResult;
        var cardView = trickResult.highestCard.cardView;
        FlashHighlightCardView(cardView);

        var trickSpeed = this.settings.GetSetting('setting_trick_speed');
        var isUsingScoreMultiplier = this.settings.GetSetting('setting_score_multiplier');

        if (trickResult.countersTaken > 0) {
            var displayPoints = isUsingScoreMultiplier ? trickResult.countersTaken*10 : trickResult.countersTaken;
            document.getElementById('pinochle_trick_score_points').innerText = '+' + displayPoints;
            var scoreBubble = document.getElementById('pinochle_trick_score_bubble');
            scoreBubble.style.background = trickResult.trickTaker.playerPositionInt==0||trickResult.trickTaker.playerPositionInt==2 ? '#0000BB' : '#FF0000';
            scoreBubble.positionFunction = 'GetScoreBubblePosition()';
            var scoreBubblePosition = eval(scoreBubble.positionFunction);
            with (scoreBubble.style) {
                transition = 'none';
                transitionDelay = 'none';
                left = scoreBubblePosition[0] + 'px';
                top = scoreBubblePosition[1] + 'px';
                transform = 'translate(-50%,-50%) scale(0)';
                visibility = 'visible';
                opacity = 1;
            }
            setTimeout(function(){
                with (scoreBubble.style) {
                    transition = '0.3s linear';
                    transform = 'translate(-50%,-50%) scale(1)';
                }
            },400);
        }

        if (trickSpeed == 0) {
            var acceptButton = document.getElementById('pinochle_accept_trick_result');
            acceptButton.positionFunction = 'GetAcceptTrickButtonPosition()';
            var acceptButtonPosition = eval(acceptButton.positionFunction);
            with (acceptButton.style) {
                transition = 'none';
                left = acceptButtonPosition[0] + 'px';
                top = acceptButtonPosition[1] + 'px';
                opacity = 0;
                visibility = 'visible';
            }
            setTimeout(function(){
                with (acceptButton.style) {
                    transition = '0.3s linear';
                    opacity = 1;
                }
            }, 300);
        } else {
            this.ContinueAnimatingTrickResult(trickResult);
        }
    }

    this.OnAcceptTrickButtonPressed = function() {
        HideAcceptTrickButton();
        this.ContinueAnimatingTrickResult(currentTrickResult);
    }

    function HideAcceptTrickButton() {
        var acceptButton = document.getElementById('pinochle_accept_trick_result');
        with (acceptButton.style) {
            transition = '0.3s linear';
            opacity = 0;
            visibility = 'hidden';
        }
    }

    this.ContinueAnimatingTrickResult = function(trickResult) {

        var trickSpeed = this.settings.GetSetting('setting_trick_speed');
        
        var delay = 1700;
        var cardAnimationDuration = 1000;
        var animationTransition = '1s ease-in';
        if (trickSpeed == 0) {
            delay = 100;
        } else if (trickSpeed == 2) {
            delay = 1500;
            cardAnimationDuration = 200;
            animationTransition = '0.2s linear';
        }

        setTimeout(function() {
            for (var i=0; i<game.trickCards.length; i++) {
                var cardView = game.trickCards[i].cardView;
                cardView.positionFunction = "GetWonTrickCardsPilePostion('" + trickResult.trickTaker.playerPosition + "')";
                var loc = eval(cardView.positionFunction);
                with (cardView.style) {
                    transition = animationTransition;
                    left = loc[0] + 'px';
                    top = loc[1] + 'px';
                    visibility = 'hidden';
                }
            }   
            var pos = GetWonTrickCardsPilePostion(trickResult.trickTaker.playerPosition);
            var scoreBubble = document.getElementById('pinochle_trick_score_bubble');
            with (scoreBubble.style) {
                transition = animationTransition;
                left = pos[0] + 115*0.5 + 'px';
                top = pos[1] + 162*0.5 + 'px';
                visibility = 'hidden';
            }    
        }, delay);

        setTimeout(function(player) {
            UpdatePlayerRoundScore(player.playerPositionInt==0 || player.playerPositionInt==2);
            scoreboard.UpdateScores(true, true, true);
        }, delay + cardAnimationDuration, trickResult.trickTaker);
    
        setTimeout(function() {
            if (game.players[0].cards.length !== 0) {
                game.trickCards = [];
                game.turnIndex = game.leadIndex;
                var nextPlayer = game.players[game.turnIndex];
                nextPlayer.ChoosePlayCard();
                if (nextPlayer.isHuman) {
                    RememberLatestGameState();
                }
            } else {
                game.FinishRound();
            }
        }, delay + cardAnimationDuration);
    }

    function GetScoreBubblePosition() {
        return [gameContainer.innerWidth*0.5, 180];
    }

    function GetAcceptTrickButtonPosition() {
        return [gameContainer.innerWidth*0.5 + 100, 400];
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
        
        var aRoundContracts = [];
        var northSouthContract = -1;
        var eastWestContract = -1;
        if (game.bidWinner == 0 || game.bidWinner == 2) {
            northSouthContract = game.players[game.bidWinner].currentRoundBid;
        } else {
            eastWestContract = game.players[game.bidWinner].currentRoundBid;
        }
        aRoundContracts.push(northSouthContract);
        aRoundContracts.push(eastWestContract);

        var aRoundMelds = [];
        aRoundMelds.push(game.players[0].currentRoundMeldScore + game.players[2].currentRoundMeldScore);
        aRoundMelds.push(game.players[1].currentRoundMeldScore + game.players[3].currentRoundMeldScore)

        var aRoundCountersTaken = [];
        aRoundCountersTaken.push(game.players[0].currentRoundCountersTaken + game.players[2].currentRoundCountersTaken);
        aRoundCountersTaken.push(game.players[1].currentRoundCountersTaken + game.players[3].currentRoundCountersTaken);

        var aRoundScores = [];
        var totalPoints = aRoundMelds[0] + aRoundCountersTaken[0];
        if (game.bidWinner == 0 || game.bidWinner == 2) {
            if (game.players[0].countersTaken == -1) {
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
            if (game.players[1].countersTaken == -1) {
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
        if (game.bidWinner == 1 || game.bidWinner == 3) {
            if (game.players[1].countersTaken == -1) {
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
            if (game.players[0].countersTaken == -1) {
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

        game.players[0].gameScore += aRoundScores[0];
        game.players[1].gameScore += aRoundScores[1];

        game.roundContracts.push(aRoundContracts);
        game.roundMelds.push(aRoundMelds);
        game.roundCountersTaken.push(aRoundCountersTaken);
        game.roundScores.push(aRoundScores);
        game.dealerIndex += 1;

        // Update stats
        var curDifficulty = game.skillLevel;
        var doubleDeckString = "";
        if (game.isDoubleDeck) {
            doubleDeckString = "_DoubleDeck";
        }
        var bidString = "withoutbid";
        if (game.bidWinner == 0 || game.bidWinner == 2) {
            bidString = "withbid";
            var statKey = 'stat_winningbid_total_' + curDifficulty + doubleDeckString;
            var winningBidTotal = this.settings.GetStatistic(statKey);
            winningBidTotal += aRoundContracts[0];
            this.settings.SetStatistic(statKey, winningBidTotal);
            if (aRoundScores[0] > 0) {
                statKey = 'stat_winningbid_count_' + curDifficulty + doubleDeckString;
            } else {
                statKey = 'stat_notwinningbid_count_' + curDifficulty + doubleDeckString;
            }
            var curTotal = this.settings.GetStatistic(statKey);
            curTotal += 1;
            this.settings.SetStatistic(statKey, curTotal);
        }
        if (aRoundCountersTaken[0] > -1) {
            var statKey = 'stat_counters_' + bidString + '_total_' + curDifficulty + doubleDeckString;
            var curTotal = this.settings.GetStatistic(statKey);
            curTotal += aRoundCountersTaken[0];
            this.settings.SetStatistic(statKey, curTotal);
            statKey = 'stat_counters_' + bidString + '_count_' + curDifficulty + doubleDeckString;
            curTotal = this.settings.GetStatistic(statKey);
            curTotal += 1;
            this.settings.SetStatistic(statKey, curTotal);
        }
        if (aRoundScores[0] >= 0) {
            var statKey = 'stat_roundscores_' + bidString + '_total_' + curDifficulty + doubleDeckString;
            var curTotal = this.settings.GetStatistic(statKey);
            curTotal += aRoundScores[0];
            this.settings.SetStatistic(statKey, curTotal);
            statKey = 'stat_roundscores_' + bidString + '_count_' + curDifficulty + doubleDeckString;
            curTotal = this.settings.GetStatistic(statKey);
            curTotal += 1;
            this.settings.SetStatistic(statKey, curTotal);
        }

        this.currentMoveStage = 'AcceptingRoundScores';
        RememberLatestGameState();
        this.ShowRoundResultWithDelay(500);
    }

    this.ShowRoundResultWithDelay = function(delay) {
        setTimeout(function(){
            HideTrumpIndicator();
            for (var i=0; i<4; i++) {
                document.getElementById('player_score_' + game.players[i].playerPosition).innerText = "";
            }
            
            UpdateRoundScoresViewText();
            
            var roundResultView = document.getElementById('pinochle_round_result_view');
            with (roundResultView.style) {
                transition = "none";
                transitionDelay = "none";
                opacity = 1;
                visibility = 'visible';
                transform = 'translate(-50%,-50%) scale(0)';
            }
            setTimeout(function(){
                with (roundResultView.style) {
                    transition = "0.3s linear";
                    transform = 'translate(-50%,-50%) scale(1)';
                }    
            },150);
        }, delay);
    }

    function HideRoundResultView() {
        var roundResultView = document.getElementById('pinochle_round_result_view');
        with (roundResultView.style) {
            transition = "0.3s linear";
            transitionDelay = "none";
            opacity = 0;
            visibility = 'hidden';
        }
    }

    function UpdateRoundScoresViewText() {
        var isUsingScoreMultiplier = game.settings.GetSetting('setting_score_multiplier');
        
        document.getElementById('pinochle_round_result_title').innerText = "Round " + game.roundScores.length;  
        document.getElementById('pinochle_round_result_names_north_south').innerHTML = "You &<br>" + game.players[2].name;
        document.getElementById('pinochle_round_result_names_east_west').innerHTML = game.players[1].name + " & " + game.players[3].name;

        var roundContract = game.roundContracts[game.roundContracts.length-1];
        var bid = isUsingScoreMultiplier ? roundContract[0]*10 : roundContract[0];
        document.getElementById('round_result_bid_north_south').innerText = bid > 0 ? "(" + bid + ")" : "";
        bid = isUsingScoreMultiplier ? roundContract[1]*10 : roundContract[1];
        document.getElementById('round_result_bid_east_west').innerText = bid > 0 ? "(" + bid + ")" : "";

        var roundMelds = game.roundMelds[game.roundMelds.length-1];
        var meld = isUsingScoreMultiplier ? roundMelds[0]*10 : roundMelds[0];
        document.getElementById('round_result_melds_north_south').innerText = meld;
        meld = isUsingScoreMultiplier ? roundMelds[1]*10 : roundMelds[1];
        document.getElementById('round_result_melds_east_west').innerText = meld;

        var roundCounters = game.roundCountersTaken[game.roundCountersTaken.length-1];
        if (roundCounters[0] == -1) {
            document.getElementById('round_result_counters_north_south').style.fontSize = "12px";
            document.getElementById('round_result_counters_north_south').innerText = "throw in";
        } else {
            document.getElementById('round_result_counters_north_south').style.fontSize = "20px";
            document.getElementById('round_result_counters_north_south').innerText = isUsingScoreMultiplier ? roundCounters[0]*10 : roundCounters[0];
        }
        if (roundCounters[1] == -1) {
            document.getElementById('round_result_counters_east_west').style.fontSize = "12px";
            document.getElementById('round_result_counters_east_west').innerText = "throw in";
        } else {
            document.getElementById('round_result_counters_east_west').style.fontSize = "20px";
            document.getElementById('round_result_counters_east_west').innerText = isUsingScoreMultiplier ? roundCounters[1]*10 : roundCounters[1];
        }

        var roundScores = game.roundScores[game.roundScores.length-1];
        if (roundScores[0] >= 0) {
            document.getElementById('pinochle_round_result_totals_north_south').innerText = isUsingScoreMultiplier ? "+" + roundScores[0]*10 : "+" + roundScores[0];
        } else {
            document.getElementById('pinochle_round_result_totals_north_south').innerText = isUsingScoreMultiplier ? roundScores[0]*10 : roundScores[0];
        }
        if (roundScores[1] >= 0) {
            document.getElementById('pinochle_round_result_totals_east_west').innerText = isUsingScoreMultiplier ? "+" + roundScores[1]*10 : "+" + roundScores[1];
        } else {
            document.getElementById('pinochle_round_result_totals_east_west').innerText = isUsingScoreMultiplier ? roundScores[1]*10 : roundScores[1];
        }
    }

    this.OnAcceptRoundResultButtonPressed = function() {
        var roundResultView = document.getElementById('pinochle_round_result_view');
        with (roundResultView.style) {
            transition = "0.3s linear";
            transitionDelay = "none";
            opacity = 0;
            visibility = 'hidden';
        }

        scoreboard.UpdateScoresAfterRound();
    }

    this.OnFinishedAnimatingUpdateGameScoreboard = function() {
        
        var winner = this.TryToGetWinningPlayer();
        if (winner !== null) {
            this.OnGameOver(winner);
        } else {
            this.AnimateDealCardsForRound();
        }
    }

    this.TryToGetWinningPlayer = function() {
        var southPlayer = game.players[0];
        var westPlayer = game.players[1];
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
        var gameOverLine1 = "";
        var gameOverLine2 = "";
        var doubleDeckString = "";
        if (game.isDoubleDeck) {
            doubleDeckString = "_DoubleDeck";
        }
        if (winner.playerPosition == 'South') {
            var statKey = 'stat_wins_' + game.skillLevel + doubleDeckString;
            var curTotal = this.settings.GetStatistic(statKey);
            curTotal +=1 ;
            SetStatistic(statKey, curTotal);
            gameOverLine1 = "You won!";
            gameOverLine2 = "vs the " + this.skillLevel.toLowerCase() + " players";
            
        } else {
            var statKey = 'stat_losses_' + game.skillLevel + doubleDeckString;
            var curTotal = this.settings.GetStatistic(statKey);
            curTotal +=1 ;
            SetStatistic(statKey, curTotal);
            gameOverLine1 = "You lost";
            gameOverLine2 = "vs the " + this.skillLevel.toLowerCase() + " players";
        }

        HideHintButton();
        HideMenuButton();
        HideUndoButton();
        HideRedoButton();
        HideAllMessages();

        var gameOverView = document.getElementById('PinochleGameOverView');
        var gameOverLine1Elem = document.getElementById('PinochleGameOverResultText');
        gameOverLine1Elem.innerText = gameOverLine1;
        var gameOverLine2Elem = document.getElementById('PinochleGameOverResultText2');
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

    var undoGameStates = [];
    var redoGameStates = [];

    var RememberLatestGameState = function() {
        var gameState = game.CreateGameStateString();
        undoGameStates.push(gameState);
        var delay = 0;
        if (game.gameState == 'AcceptingRoundScores') {
            delay = 700;
        }
        if (undoGameStates.length > 1) {
            var undoOn = game.settings.GetSetting('setting_undo');
            if (game.skillLevel == 'Easy' || undoOn) {
                ShowUndoButton(delay);
            }
        }
        redoGameStates = [];
        HideRedoButton();
    }

    function GetUndoButtonPosition() {
        var leftPos = GetHandCardLocation('South', 0, 14);
        if (game.currentMoveStage == 'AcceptingMelds') {
            return [leftPos[0], leftPos[1]-60];
        } else {
            return [leftPos[0], leftPos[1]-90];
        }
    }

    function GetRedoButtonPosition() {
        var leftPos = GetHandCardLocation('South', 0, 14);
        if (game.currentMoveStage == 'AcceptingMelds') {
            return [leftPos[0] + 90, leftPos[1]-60];
        } else {
            return [leftPos[0] + 90, leftPos[1]-90];
        }
    }

    function RepositionUndoButtons() {
        var button = document.getElementById('pinochle_undo_button');
        button.positionFunction = "GetUndoButtonPosition()";
        button.style.transition = '0.3s ease-out';
        var loc = eval(button.positionFunction);
        button.style.left = loc[0] + 'px';
        button.style.top = loc[1] + 'px';

        button = document.getElementById('pinochle_redo_button');
        button.positionFunction = "GetRedoButtonPosition()";
        button.style.transition = '0.3s ease-out';
        var loc = eval(button.positionFunction);
        button.style.left = loc[0] + 'px';
        button.style.top = loc[1] + 'px';
    }

    function ShowUndoButton(delay) {
        var button = document.getElementById('pinochle_undo_button');
        button.positionFunction = "GetUndoButtonPosition()";
        button.style.transition = "none";
        var loc = eval(button.positionFunction);
        button.style.left = loc[0] + 'px';
        button.style.top = loc[1] + 'px';
        button.style.visibility = 'visible';
        button.style.pointerEvents = "auto";
        setTimeout(function () {
            button.style.transition = "0.5s linear";
            button.style.opacity = 1;
            setTimeout(function() {
                button.style.transition = "none";
            }, 600);
        }, delay);
    }

    this.UpdateShowUndoButton = function() {
        if (game == null || game.players.length == 0) {
            return;
        }

        var undoOn = this.settings.GetSetting('setting_undo');
        if (game.skillLevel == 'Easy' || undoOn) {
            if (undoGameStates.length > 1) {
                ShowUndoButton(0);
            } else {
                HideUndoButton();
            }
            if (redoGameStates.length > 0) {
                ShowRedoButton(0);
            } else {
                HideRedoButton();
            }
        } else {
            HideUndoButton();
            HideRedoButton();
        }
    }

    function HideUndoButton() {
        var button = document.getElementById('pinochle_undo_button');
        button.style.opacity = 0;
        button.style.pointerEvents = "none";
    }

    this.OnUndoButtonClick = function () {
        if (undoGameStates.length > 1) {
            var undoState = undoGameStates.pop();            
            redoGameStates.push(undoState);
            var curState = undoGameStates[undoGameStates.length-1];
            this.LoadGameState(curState);
            ShowRedoButton();
            if (undoGameStates.length == 1) {
                HideUndoButton();
            }
        }
    }

    function ShowRedoButton(delay) {
        var button = document.getElementById('pinochle_redo_button');
        button.positionFunction = "GetRedoButtonPosition()";
        button.style.transition = "none";
        var loc = eval(button.positionFunction);
        button.style.left = loc[0] + 'px';
        button.style.top = loc[1] + 'px';
        button.style.visibility = 'visible';
        button.style.pointerEvents = "auto";
        setTimeout(function () {
            button.style.transition = "0.5s linear";
            button.style.opacity = 1;
            setTimeout(function() {
                button.style.transition = "none";
            }, 600);
        }, delay);
    }

    function HideRedoButton() {
        var button = document.getElementById('pinochle_redo_button');
        button.style.opacity = 0;
        button.style.pointerEvents = "none";
    }

    this.OnRedoButtonClick = function () {
        if (redoGameStates.length>0) {
            var redoState = redoGameStates.pop();
            undoGameStates.push(redoState);
            this.LoadGameState(redoState);
            if (redoGameStates.length == 0) {
                HideRedoButton();
            }
            ShowUndoButton(0);
        }
    }

    function HideAllMessages() {
        var viewsToHide = [
            'player_name_South',
            'player_name_West',
            'player_name_North',
            'player_name_East',
            'player_thinking_West',
            'player_thinking_North',
            'player_thinking_East',
            'bid_view_West',
            'bid_view_North',
            'bid_view_East',
            'bid_view_South',
            'player_score_South',
            'player_score_West',
            'player_score_North',
            'player_score_East',
            'pinochle_hint_button',
            'pinochle_undo_button',
            'pinochle_redo_button',
            'pinochle_player_play_prompt',
            'pinochle_round_simulations_view',
            'pinochle_choose_bid_view',
            'pinochle_confirm_passing_cards_button',
            'pinochle_select_passing_cards_message',
            'select_passing_cards_region_0',
            'select_passing_cards_region_1',
            'select_passing_cards_region_2',
            'select_passing_cards_region_3',
            'meld_view_West',
            'meld_view_North',
            'meld_view_East',
            'meld_view_South',
            'accept_meld_view',
            'pinochle_trick_score_bubble',
            'pinochle_accept_trick_result'
            ];
        for (var i = 0; i < viewsToHide.length; i++) {
            var view = document.getElementById(viewsToHide[i]);
            view.style.transition = "none";
            view.style.opacity = 0;
            view.style.visibility = 'hidden';
        }
    }

    this.OnResizeWindow = function() {
        
        var ease = "0.4s ease-out";

        // Reposition all the cards
        for (var i = 0; i < allCards.length; i++) {
            var cardView = allCards[i].cardView;
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
            'player_thinking_West',
            'player_thinking_North',
            'player_thinking_East',
            'bid_view_West',
            'bid_view_North',
            'bid_view_East',
            'bid_view_South',
            'player_score_South',
            'player_score_West',
            'player_score_North',
            'player_score_East',
            'pinochle_hint_button',
            'pinochle_undo_button',
            'pinochle_redo_button',
            'pinochle_player_play_prompt',
            'pinochle_choose_bid_view',
            'pinochle_trump_suit_indicator',
            'pinochle_choose_trump_suit_view',
            'pinochle_confirm_passing_cards_button',
            'pinochle_select_passing_cards_message',
            'select_passing_cards_region_0',
            'select_passing_cards_region_1',
            'select_passing_cards_region_2',
            'select_passing_cards_region_3',
            'meld_view_West',
            'meld_view_North',
            'meld_view_East',
            'meld_view_South',
            'pinochle_trick_score_bubble',
            'pinochle_accept_trick_result'
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

    this.OnTerminateGame = function() {
    }

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
        var scrollDiv = document.getElementById('menu_settings_body');
        scrollDiv.scrollTop = 0;
        document.getElementById("setting_hints_checkbox").checked = this.settings.GetSetting('setting_hints');
        document.getElementById("setting_undo_checkbox").checked = this.settings.GetSetting('setting_undo');
        document.getElementById("setting_sort_left_to_right_checkbox").checked = this.settings.GetSetting('setting_sort_left_to_right');
        document.getElementById("setting_score_multiplier_checkbox").checked = this.settings.GetSetting('setting_score_multiplier');
    
        document.getElementById("deck_count_dropdown").value = this.settings.GetSetting('setting_deck_count');
        document.getElementById("winning_score_dropdown").value = this.settings.GetSetting('setting_winning_score');
        document.getElementById("bidding_speed_dropdown").value = this.settings.GetSetting('setting_bidding_speed');
        document.getElementById("minimum_bid_dropdown").value = this.settings.GetSetting('setting_minimum_bid');
        document.getElementById("passing_cards_count_dropdown").value = this.settings.GetSetting('setting_passing_cards_count');
        document.getElementById("trick_taking_speed_dropdown").value = this.settings.GetSetting('setting_trick_speed');
        document.getElementById("trick_taking_display_dropdown").value = this.settings.GetSetting('setting_counters_display');
        
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
    
        this.GenerateWinningScoreOptions();
        this.GenerateMinimumBidOptions();
    }
    
    var WinningScoreOptions = [100, 150, 200, 250, 300, 500, 1000];
    
    this.GenerateWinningScoreOptions = function() {
        var winningScoreDropDown = document.getElementById("winning_score_dropdown");
        var isUsingScoreMultiplier = this.settings.GetSetting('setting_score_multiplier');
        for (var i=0; i<winningScoreDropDown.children.length; i++) {
            winningScoreDropDown.children[i].textContent = isUsingScoreMultiplier ? WinningScoreOptions[i]*10 : WinningScoreOptions[i];
        }
    }
    
    this.GenerateMinimumBidOptions = function() {
        var miniumBidDropDown = document.getElementById("minimum_bid_dropdown");
        var isUsingScoreMultiplier = this.settings.GetSetting('setting_score_multiplier');
        for (var i=0; i<miniumBidDropDown.children.length; i++) {
            miniumBidDropDown.children[i].textContent = isUsingScoreMultiplier ? (i+1)*10 : (i+1);
        }
    }
    
    this.SettingHintsClicked = function(cb) {
        this.settings.SetSetting('setting_hints', cb.checked);
        this.UpdateShowHintButton();
    }
    
    this.SettingUndoClicked = function(cb) {
        this.settings.SetSetting('setting_undo', cb.checked);
        this.UpdateShowUndoButton();
    }
    
    this.SettingSortLeftToRightClicked = function(cb) {
        this.settings.SetSetting('setting_sort_left_to_right', cb.checked);
        this.UpdateSortLeftToRight();
    }
    
    this.SettingScoreMultiplierClicked = function(cb) {
        this.settings.SetSetting('setting_score_multiplier', cb.checked);
    
        this.GenerateWinningScoreOptions();
        this.GenerateMinimumBidOptions();
        this.UpdateScoreMultiplier();
    }
    
    this.SettingDeckCountChanged = function(selector) {
        this.settings.SetSetting('setting_deck_count', selector.value);
    
        var passingCardsCount = 3;
        var minimumBid = 20;
        var deckCount = this.settings.GetSetting('setting_deck_count');
        if (deckCount == 1) {
            passingCardsCount = 4;
            minimumBid = 50;
        }
    
        var passingCardsDropDown = document.getElementById("passing_cards_count_dropdown");
        passingCardsDropDown.value = passingCardsCount;
        this.settings.SetSetting('setting_passing_cards_count', passingCardsCount);
        var minimumBidDropDown = document.getElementById("minimum_bid_dropdown");
        minimumBidDropDown.value = minimumBid;
        this.settings.SetSetting('setting_minimum_bid', minimumBid);
    }
    
    this.SettingWinningScoreChanged = function(winningScoreSelect) {
        this.settings.SetSetting('setting_winning_score', winningScoreSelect.value);
    }
    
    this.SettingBiddingSpeedChanged = function(selector) {
        this.settings.SetSetting('setting_bidding_speed', selector.value);
    }
    
    this.SettingMinimumBidChanged = function(selector) {
        this.settings.SetSetting('setting_minimum_bid', selector.value);
    }
    
    this.SettingPassingCardsCountChanged = function(selector) {
        this.settings.SetSetting('setting_passing_cards_count', selector.value);
    }
    
    this.SettingTrickTakingSpeedChanged = function(selector) {
        this.settings.SetSetting('setting_trick_speed', selector.value);
    }
    
    this.SettingTrickTakingDisplayChanged = function(selector) {
        this.settings.SetSetting('setting_counters_display', selector.value);
        this.UpdateTrickTakingDisplay();
    }
    
    this.SettingPreferredDifficultyDisplayChanged = function(selector) {
        this.settings.SetSetting('setting_preferred_skill', selector.value);
    }
    
    this.ShowStatisticsMenu = function() {
        var menuName = visibleMenuCards[visibleMenuCards.length-1];
        MenuCardPressDown(menuName);
        this.InitializeStatisticsView();
        MenuCardAppear("menu_statistics");
    }
    
    this.InitializeStatisticsView = function() {
    
        var scrollDiv = document.getElementById('menu_statistics_body');
        scrollDiv.scrollTop = 0;
        
        var isUsingScoreMultiplier = this.settings.GetSetting('setting_score_multiplier');
        var deckCount = this.settings.GetSetting('setting_deck_count');
        var doubleDeckString = "";
        if (deckCount == 1) {
            doubleDeckString = "_DoubleDeck";
        }
        
        var difficulties = ["Easy", "Standard", "Pro"];
        var totalGamesPlayed = 0;
        var totalWins = 0;
        for (var i=0; i<difficulties.length; i++) {
            var curDifficulty = difficulties[i];
            var wins = this.settings.GetStatistic('stat_wins_' + curDifficulty + doubleDeckString);
            var losses = this.settings.GetStatistic('stat_losses_' + curDifficulty + doubleDeckString);
            var gamesPlayed = wins + losses;
            var gamesPlayedElement = document.getElementById('menu_stat_games_played_' + curDifficulty);
            var winsElement = document.getElementById('menu_stat_wins_' + curDifficulty);
            var winPercentElement = document.getElementById('menu_stat_win_percent_' + curDifficulty);
            if (gamesPlayed > 0) {
                gamesPlayedElement.innerText = gamesPlayed;
                winsElement.innerText = wins;
                winPercentElement.innerText = parseFloat(100*wins / gamesPlayed).toFixed(0) + "%";
            } else {
                gamesPlayedElement.innerText = "";
                winsElement.innerText = "";
                winPercentElement.innerText = "";
            }
            totalGamesPlayed = totalGamesPlayed + gamesPlayed;
            totalWins = totalWins + wins;
        }
        var gamesPlayedElement = document.getElementById('menu_stat_games_played_Total');
        var winsElement = document.getElementById('menu_stat_wins_Total');
        var winPercentElement = document.getElementById('menu_stat_win_percent_Total');
        if (totalGamesPlayed > 0) {
            gamesPlayedElement.innerText = totalGamesPlayed;
            winsElement.innerText = totalWins;
            winPercentElement.innerText = parseFloat(100*totalWins / totalGamesPlayed).toFixed(0) + "%";
        } else {
            gamesPlayedElement.innerText = "0";
            winsElement.innerText = "0";
            winPercentElement.innerText = "";
        }
    
        // Stats with bid
        var totalWinningBidTotal = 0;
        var totalWinningBidCount = 0;
        var totalMakeContract = 0;
        var totalMeldWithBidTotal = 0;
        var totalMeldWithBidCount = 0;
        var totalCountersWithBidTotal = 0;
        var totalCountersWithBidCount = 0;
        var totalRoundScoresWithBidTotal = 0;
        var totalRoundScoresWithBidCount = 0;
        var totalMeldWithoutBidTotal = 0;
        var totalMeldWithoutBidCount = 0;
        var totalCountersWithoutBidTotal = 0;
        var totalCountersWithoutBidCount = 0;
        var totalRoundScoresWithoutBidTotal = 0;
        var totalRoundScoresWithoutBidCount = 0;
        for (var i=0; i<difficulties.length; i++) {
            var curDifficulty = difficulties[i];
            
            // Avg Contract
            var winningBidTotal = this.settings.GetStatistic('stat_winningbid_total_' + curDifficulty + doubleDeckString);
            var winningBidCount = GetStatistic('stat_winningbid_count_' + curDifficulty + doubleDeckString);
            var notWinningBidCount = this.settings.GetStatistic('stat_notwinningbid_count_' + curDifficulty + doubleDeckString);
            var bidsWonAndNotWon = winningBidCount + notWinningBidCount;
            var curElement = document.getElementById('menu_stat_avg_bid_contract_with_bid_' + curDifficulty);
            if (bidsWonAndNotWon > 0) {
                var avg = isUsingScoreMultiplier ? parseFloat(10*winningBidTotal/bidsWonAndNotWon).toFixed(1) : parseFloat(winningBidTotal/bidsWonAndNotWon).toFixed(1);
                curElement.innerText = avg;
            } else {
                curElement.innerText = "";
            }
            totalWinningBidTotal += winningBidTotal;
            totalWinningBidCount += bidsWonAndNotWon;
    
            // Make Contract
            curElement = document.getElementById('menu_stat_make_contract_percent_' + curDifficulty);
            if (bidsWonAndNotWon > 0) {
                var contractMakePercent = bidsWonAndNotWon > 0 ? winningBidCount/bidsWonAndNotWon : 0;
                curElement.innerText = parseFloat(100*contractMakePercent).toFixed(0) + "%";	
            } else {
                curElement.innerText = "";
            }
            totalMakeContract += winningBidCount;
    
            // Avg meld
            var meldWithBidTotal = this.settings.GetStatistic('stat_meld_withbid_total_' + curDifficulty + doubleDeckString);
            var meldWithBidCount = this.settings.GetStatistic('stat_meld_withbid_count_' + curDifficulty + doubleDeckString);
            var meldWithBidAverage = meldWithBidCount > 0 ? meldWithBidTotal/meldWithBidCount : 0;
            if (isUsingScoreMultiplier) {
                meldWithBidAverage = meldWithBidAverage*10;
            }
            curElement = document.getElementById('menu_stat_avg_meld_with_bid_' + curDifficulty);
            curElement.innerText = meldWithBidCount > 0 ? parseFloat(meldWithBidAverage).toFixed(1) : "";
            totalMeldWithBidTotal += meldWithBidTotal;
            totalMeldWithBidCount += meldWithBidCount;
    
            // Avg counters
            var countersWithBidTotal = this.settings.GetStatistic('stat_counters_withbid_total_' + curDifficulty + doubleDeckString);
            var countersWithBidCount = this.settings.GetStatistic('stat_counters_withbid_count_' + curDifficulty + doubleDeckString);
            var countersWithBidAverage = countersWithBidCount > 0 ? countersWithBidTotal/countersWithBidCount : 0;
            if (isUsingScoreMultiplier) {
                countersWithBidAverage = countersWithBidAverage*10;
            }
            curElement = document.getElementById('menu_stat_avg_counters_with_bid_' + curDifficulty);
            curElement.innerText = countersWithBidCount > 0 ? parseFloat(countersWithBidAverage).toFixed(1) : "";
            totalCountersWithBidTotal += countersWithBidTotal;
            totalCountersWithBidCount += countersWithBidCount;
    
            // Avg positive round score
            var roundScoresWithBidTotal = this.settings.GetStatistic('stat_roundscores_withbid_total_' + curDifficulty + doubleDeckString);
            var roundScoresWithBidCount = this.settings.GetStatistic('stat_roundscores_withbid_count_' + curDifficulty + doubleDeckString);
            var roundScoresWithBidAverage = roundScoresWithBidCount > 0 ? roundScoresWithBidTotal/roundScoresWithBidCount : 0;
            if (isUsingScoreMultiplier) {
                roundScoresWithBidAverage = roundScoresWithBidAverage*10;
            }
            curElement = document.getElementById('menu_stat_avg_round_score_with_bid_' + curDifficulty);
            curElement.innerText = roundScoresWithBidCount > 0 ? parseFloat(roundScoresWithBidAverage).toFixed(1) : "";
            totalRoundScoresWithBidTotal += roundScoresWithBidTotal;
            totalRoundScoresWithBidCount += roundScoresWithBidCount;
    
            // Avg meld
            var meldWithOutBidTotal = this.settings.GetStatistic('stat_meld_withoutbid_total_' + curDifficulty + doubleDeckString);
            var meldWithOutBidCount = this.settings.GetStatistic('stat_meld_withoutbid_count_' + curDifficulty + doubleDeckString);
            var meldWithOutBidAverage = meldWithOutBidCount > 0 ? meldWithOutBidTotal/meldWithOutBidCount : 0;
            if (isUsingScoreMultiplier) {
                meldWithOutBidAverage = meldWithOutBidAverage*10;
            }
            curElement = document.getElementById('menu_stat_avg_meld_without_bid_' + curDifficulty);
            curElement.innerText = meldWithOutBidCount > 0 ? parseFloat(meldWithOutBidAverage).toFixed(1) : "";
            totalMeldWithoutBidTotal += meldWithOutBidTotal;
            totalMeldWithoutBidCount += meldWithOutBidCount;
    
            // Avg counters
            var countersWithoutBidTotal = this.settings.GetStatistic('stat_counters_withoutbid_total_' + curDifficulty + doubleDeckString);
            var countersWithoutBidCount = this.settings.GetStatistic('stat_counters_withoutbid_count_' + curDifficulty + doubleDeckString);
            var countersWithoutBidAverage = countersWithoutBidCount > 0 ? countersWithoutBidTotal/countersWithoutBidCount : 0;
            if (isUsingScoreMultiplier) {
                countersWithoutBidAverage = countersWithoutBidAverage*10;
            }
            curElement = document.getElementById('menu_stat_avg_counters_without_bid_' + curDifficulty);
            curElement.innerText = countersWithoutBidCount > 0 ? parseFloat(countersWithoutBidAverage).toFixed(1) : "";
            totalCountersWithoutBidTotal += countersWithoutBidTotal;
            totalCountersWithoutBidCount += countersWithoutBidCount;
    
            // Avg round score
            var roundScoresWithoutBidTotal = this.settings.GetStatistic('stat_roundscores_withoutbid_total_' + curDifficulty + doubleDeckString);
            var roundScoresWithoutBidCount = this.settings.GetStatistic('stat_roundscores_withoutbid_count_' + curDifficulty + doubleDeckString);
            var roundScoresWithoutBidAverage = roundScoresWithoutBidCount > 0 ? roundScoresWithoutBidTotal/roundScoresWithoutBidCount : 0;
            if (isUsingScoreMultiplier) {
                roundScoresWithoutBidAverage = roundScoresWithoutBidAverage*10;
            }
            curElement = document.getElementById('menu_stat_avg_round_score_without_bid_' + curDifficulty);
            curElement.innerText = roundScoresWithoutBidCount > 0 ? parseFloat(roundScoresWithoutBidAverage).toFixed(1) : "";
            totalRoundScoresWithoutBidTotal += roundScoresWithoutBidTotal;
            totalRoundScoresWithoutBidCount += roundScoresWithoutBidCount;
        }
    
        // Totals
        curElement = document.getElementById('menu_stat_avg_bid_contract_with_bid_Total');	
        if (totalWinningBidCount > 0) {
            var avg = totalWinningBidTotal/totalWinningBidCount;
            if (isUsingScoreMultiplier) {
                avg = avg*10;
            }
            curElement.innerText = parseFloat(avg).toFixed(1);
        } else {
            curElement.innerText = "";
        }
        
        curElement = document.getElementById('menu_stat_avg_meld_with_bid_Total');
        if (totalMeldWithBidCount > 0) {
            avg = totalMeldWithBidTotal/totalMeldWithBidCount;
            if (isUsingScoreMultiplier) {
                avg = avg*10;
            }
            curElement.innerText = parseFloat(avg).toFixed(1);
        } else {
            curElement.innerText = "";
        }
    
        curElement = document.getElementById('menu_stat_avg_counters_with_bid_Total');
        if (totalCountersWithBidCount > 0) {
            avg = totalCountersWithBidTotal/totalCountersWithBidCount;
            if (isUsingScoreMultiplier) {
                avg = avg*10;
            }
            curElement.innerText = parseFloat(avg).toFixed(1);
        } else {
            curElement.innerText = "";
        }
    
        curElement = document.getElementById('menu_stat_avg_round_score_with_bid_Total');
        if (totalRoundScoresWithBidCount > 0) {
            avg = totalRoundScoresWithBidTotal/totalRoundScoresWithBidCount;
            if (isUsingScoreMultiplier) {
                avg = avg*10;
            }
            curElement.innerText = parseFloat(avg).toFixed(1);
        } else {
            curElement.innerText = "";
        }
    
        curElement = document.getElementById('menu_stat_make_contract_percent_Total');
        if (totalWinningBidCount > 0) {
            avg = totalMakeContract/totalWinningBidCount;
            curElement.innerText = parseFloat(avg).toFixed(0) + "%";
        } else {
            curElement.innerText = "";
        }
        
        curElement = document.getElementById('menu_stat_avg_meld_without_bid_Total');
        if (totalMeldWithoutBidCount > 0) {
            avg = totalMeldWithoutBidTotal/totalMeldWithoutBidCount;
            if (isUsingScoreMultiplier) {
                avg = avg*10;
            }
            curElement.innerText = parseFloat(avg).toFixed(1);
        } else {
            curElement.innerText = "";
        }
    
        curElement = document.getElementById('menu_stat_avg_counters_without_bid_Total');
        if (totalCountersWithoutBidCount > 0) {
            avg = totalCountersWithoutBidTotal/totalCountersWithoutBidCount;
            if (isUsingScoreMultiplier) {
                avg = avg*10;
            }
            curElement.innerText = parseFloat(avg).toFixed(1);
        } else {
            curElement.innerText = "";
        }
    
        curElement = document.getElementById('menu_stat_avg_round_score_without_bid_Total');
        if (totalRoundScoresWithoutBidCount > 0) {
            avg = totalRoundScoresWithoutBidTotal/totalRoundScoresWithoutBidCount;
            if (isUsingScoreMultiplier) {
                avg = avg*10;
            }
            curElement.innerText = parseFloat(avg).toFixed(1);
        } else {
            curElement.innerText = "";
        }
    }
    
    this.GetTotalGamesPlayed = function() {
        var difficulties = ["Easy", "Standard", "Pro"];
        var totalGamesPlayed = 0;
        for (var i=0; i<difficulties.length; i++) {
            var curDifficulty = difficulties[i];
            var wins = this.settings.GetStatistic('stat_wins_' + curDifficulty);
            var losses = this.settings.GetStatistic('stat_losses_' + curDifficulty);
            totalGamesPlayed += (wins + losses);
        }
        return totalGamesPlayed;
    }
    
    this.ResetStatisticsButtonClick = function() {
        var r = confirm("Are you sure you want to reset your statistics?");
        if (r != true) {
            return;
        }
    
        var doubleDeckString = "";
        if (this.settings.GetSetting('setting_deck_count')==1) {
            doubleDeckString = "_DoubleDeck";
        }
        var difficulties = ['Easy', 'Standard', 'Pro'];
        var statsToReset = [
            'stat_wins_',
            'stat_losses_',
            'stat_winningbid_total_',
            'stat_winningbid_count_',
            'stat_notwinningbid_count_',
            'stat_meld_withbid_total_',
            'stat_meld_withbid_count_',
            'stat_counters_withbid_total_',
            'stat_counters_withbid_count_',
            'stat_roundscores_withbid_total_',
            'stat_roundscores_withbid_count_',
            'stat_meld_withoutbid_total_',
            'stat_meld_withoutbid_count_',
            'stat_counters_withoutbid_total_',
            'stat_counters_withoutbid_count_',
            'stat_roundscores_withoutbid_total_',
            'stat_roundscores_withoutbid_count_'
        ];
        for (var i=0; i<statsToReset.length; i++) {
            for (var j=0; j<difficulties.length; j++) {
                var statName = statsToReset[i] + difficulties[j] + doubleDeckString;
                window.localStorage.removeItem(statName);
            }
        }
        
        this.InitializeStatisticsView();
    }
    
    this.ShowRulesMenu = function() {
        var menuName = visibleMenuCards[visibleMenuCards.length-1];
        MenuCardPressDown(menuName);
        this.InitializeRulesView();
        MenuCardAppear("menu_rules");
    }
    
    this.InitializeRulesView = function() {
        var scrollDiv = document.getElementById('menu_rules_body');
        scrollDiv.scrollTop = 0;
    
        var isUsingDoubleDeck = this.settings.GetSetting('setting_deck_count') == 1;
        var isUsingScoreMultiplier = this.settings.GetSetting('setting_score_multiplier');
    
        var curElement = document.getElementById('menu_rules_card_deck');
        if (isUsingDoubleDeck) {
            curElement.innerText = "The deck has 80 cards consisting of the 10s through Aces.  There are four of every card. The cards are ranked from highest to lowest: A,10,K,Q,J. Notice that the 10s are ranked higher than the Kings!";
        } else {
            curElement.innerText = "The deck has 48 cards consisting of the 9s through Aces.  There are two of every card. The cards are ranked from highest to lowest: A,10,K,Q,J,9. Notice that the 10s are ranked higher than the Kings!";
        }
        
        curElement = document.getElementById('menu_rules_passing_cards');
        if (isUsingDoubleDeck) {
            curElement.innerText = "The team that declares trump then gets to pass cards to each other.  The default number of cards passed is 4 but this setting can be changed in the app settings.  First the non-declaring partner passes to the declarer and then the declarer passes cards back.";
        } else {
            curElement.innerText = "The team that declares trump then gets to pass cards to each other.  The default number of cards passed is 3 but this setting can be changed in the app settings.  First the non-declaring partner passes to the declarer and then the declarer passes cards back.";
        }
    
        curElement = document.getElementById('menu_rules_tricktaking');
        if (isUsingScoreMultiplier) {
            curElement.innerHTML = "The last stage of a round is trick-taking.  A trick is four cards (one from each player).<br><br>The player who won the bid starts by playing a lead card.  Then, in a clockwise order, each other player also plays a card.<br><br>When trick-taking there are rules that limit which cards you can play.  Pinochle Classic will only let you make legal moves, but you should understand the rules:  You must play the lead suit if possible.  If you don't have a card in lead suit you must play a trump suited card if possible.  You must beat the winning card in the trick if you can.<br><br>Once all four players have played a card, the highest card of the lead suit or the highest trump card wins the trick.  If two identical cards are played, the first wins.<br><br>The trick winner receives ten points for each Ace, 10, or King in the trick pile.  These cards are called 'Counters'.  The final trick of the round is worth an extra ten points.<br><br>The trick winner then gets to play the next lead card and play continues until all players are out of cards.";
        } else {
            curElement.innerHTML = "The last stage of a round is trick-taking.  A trick is four cards (one from each player).<br><br>The player who won the bid starts by playing a lead card.  Then, in a clockwise order, each other player also plays a card.<br><br>When trick-taking there are rules that limit which cards you can play.  Pinochle Classic will only let you make legal moves, but you should understand the rules:  You must play the lead suit if possible.  If you don't have a card in lead suit you must play a trump suited card if possible.  You must beat the winning card in the trick if you can.<br><br>Once all four players have played a card, the highest card of the lead suit or the highest trump card wins the trick.  If two identical cards are played, the first wins.<br><br>The trick winner receives a point for each Ace, 10, or King in the trick pile.  These cards are called 'Counters'.  The final trick of the round is worth an extra point.<br><br>The trick winner then gets to play the next lead card and play continues until all players are out of cards.";	
        }
    
        var doubleDeckCells = [
            'menu_rules_cell_pinochle_3x',
            'menu_rules_cell_pinochle_4x',
            'menu_rules_cell_jacksaround_3x',
            'menu_rules_cell_jacksaround_4x',
            'menu_rules_cell_queensaround_3x',
            'menu_rules_cell_queensaround_4x',
            'menu_rules_cell_kingsaround_3x',
            'menu_rules_cell_kingsaround_4x',
            'menu_rules_cell_acesaround_3x',
            'menu_rules_cell_acesaround_4x',
            'menu_rules_cell_marriage_3x',
            'menu_rules_cell_marriage_4x',
            'menu_rules_cell_royalmarriage_3x',
            'menu_rules_cell_royalmarriage_4x',
            'menu_rules_cell_run_3x',
            'menu_rules_cell_run_4x',
            'menu_rules_cell_points_3x',
            'menu_rules_cell_points_4x'
        ]
        if (isUsingDoubleDeck) {
            curElement = document.getElementById('menu_rules_row_dix');
            curElement.style = "visibility:collapse;";
            curElement = document.getElementById('menu_rules_cell_points');
            curElement.setAttribute('colspan', '4');
            for (var i=0; i<doubleDeckCells.length; i++) {
                curElement = document.getElementById(doubleDeckCells[i]);
                curElement.style = "display:;"
            }
            
        } else {
            curElement = document.getElementById('menu_rules_row_dix');
            curElement.style = "visibility:visible;";	
            curElement = document.getElementById('menu_rules_cell_points');
            curElement.setAttribute('colspan', '2');
            for (var i=0; i<doubleDeckCells.length; i++) {
                curElement = document.getElementById(doubleDeckCells[i]);
                curElement.style = "display:none;"
            }
        }
    }

    // 
    // Round Bid Analysis Simulations View
    //
    this.histogramVisuals = [];
    this.histogramMinScore = 0;
    this.histogramMaxVisibleScore = 0;
    this.histogramBarWidth = 0;
    this.histogramBarsLeftOffset = 80;
    this.histogramRegionWidth = 450;

    this.CreateSimulationHistogramVisuals = function() {

        this.histogramVisuals = [];
        if (game.isDoubleDeck) {
            this.histogramMinScore = 40;
            this.histogramMaxVisibleScore = 105;
        } else {
            this.histogramMinScore = 10;
            this.histogramMaxVisibleScore = 55;
        }
        document.getElementById('pinochle_round_simulations_subtitle').innerText = "This is the range of scores for your hand after many round simulations*";
        for (var i=0; i<4; i++) {
            var visuals = {};
            this.histogramVisuals.push(visuals);
            var histogramContainer = document.getElementById('round_simulations_histogram_' + i);
            while (histogramContainer.firstChild) {
                histogramContainer.removeChild(histogramContainer.firstChild);
            }

            var elem = document.createElement('div');
            elem.className = 'pinochle_round_simulations_horizontal_axis';
            histogramContainer.appendChild(elem);

            for (var j=this.histogramMinScore+10; j<this.histogramMaxVisibleScore; j+=10) {
                elem = document.createElement('div');
                elem.className = 'pinochle_round_simulations_horizontal_axis_label';
                elem.innerText = j;
                var leftOffset = this.histogramBarsLeftOffset + (this.histogramRegionWidth-this.histogramBarsLeftOffset)*(j-this.histogramMinScore)/(this.histogramMaxVisibleScore-this.histogramMinScore);
                elem.style = "left: " + leftOffset + "px";
                histogramContainer.appendChild(elem);
            }

            this.histogramBarWidth = Math.floor((this.histogramRegionWidth-this.histogramBarsLeftOffset)/(this.histogramMaxVisibleScore-this.histogramMinScore)-1);
            visuals.bars = [];
            for (var j=this.histogramMinScore; j<this.histogramMaxVisibleScore; j++) {
                elem = document.createElement('div');
                elem.className = 'pinochle_round_simulations_bar';
                var leftOffset = this.histogramBarsLeftOffset + (this.histogramRegionWidth-this.histogramBarsLeftOffset)*(j-this.histogramMinScore)/(this.histogramMaxVisibleScore-this.histogramMinScore);
                elem.style = "left: " + leftOffset + "px; width: " + this.histogramBarWidth + "px; transform: scaleY(0);";
                histogramContainer.appendChild(elem);
                visuals.bars[j] = elem;
            }

            visuals.safeBidLine = document.createElement('div');
            visuals.safeBidLine.className = 'pinochle_round_simulations_vertical_line';
            visuals.safeBidLine.style.left = '0px';
            visuals.safeBidLine.style.opacity = 0;
            histogramContainer.appendChild(visuals.safeBidLine);
            visuals.safeBidValue = document.createElement('div');
            visuals.safeBidValue.className = 'pinochle_round_simulations_safe_bid_value';
            visuals.safeBidValue.style.left = '0px';
            visuals.safeBidValue.style.opacity = 0;
            visuals.safeBidValue.innerText = '21';
            histogramContainer.appendChild(visuals.safeBidValue);
            visuals.safeBidLabel = document.createElement('div');
            visuals.safeBidLabel.className = 'pinochle_round_simulations_safe_bid_label';
            visuals.safeBidLabel.style.left = '0px';
            visuals.safeBidLabel.style.opacity = 0;
            visuals.safeBidLabel.innerText = 'Safe bid';
            histogramContainer.appendChild(visuals.safeBidLabel);

            visuals.suggestedBidLine = document.createElement('div');
            visuals.suggestedBidLine.className = 'pinochle_round_simulations_vertical_line';
            visuals.suggestedBidLine.style.left = '450px;';
            visuals.suggestedBidLine.style.opacity = 0;
            histogramContainer.appendChild(visuals.suggestedBidLine);
            visuals.suggestedBidValue = document.createElement('div');
            visuals.suggestedBidValue.className = 'pinochle_round_simulations_suggested_bid_value';
            visuals.suggestedBidValue.style.left = '450px';
            visuals.suggestedBidValue.style.opacity = 0;
            visuals.suggestedBidValue.innerText = '21';
            histogramContainer.appendChild(visuals.suggestedBidValue);
            visuals.suggestedBidLabel = document.createElement('div');
            visuals.suggestedBidLabel.className = 'pinochle_round_simulations_suggested_bid_label';
            visuals.suggestedBidLabel.style.left = '450px';
            visuals.suggestedBidLabel.style.opacity = 0;
            visuals.suggestedBidLabel.innerText = 'Suggested bid';
            histogramContainer.appendChild(visuals.suggestedBidLabel);

            visuals.suitImage = document.createElement('img');
            visuals.suitImage.className = 'pinochle_round_simulations_suit_image';
            histogramContainer.appendChild(visuals.suitImage);
        }
    }

    this.UpdateRoundSimulationsView = function(roundBidAnalysis) {
        var isUsingScoreMultiplier = this.settings.GetSetting('setting_score_multiplier');
        document.getElementById('pinochle_round_simulations_subtitle').innerText = "This is the range of scores for your hand after " + roundBidAnalysis.simulationsCount + " round simulations*";
        
        // Sort to find the descending indices
        var suits = ['S','H','C','D'];
        var indices = [0,0,0,0];
        var suggestedBids = [0,0,0,0];
        for (var i=0; i<4; i++){
            indices[i] = i;
            suggestedBids[i] = roundBidAnalysis.suggestedBids[i];
        }
        for (var i=0; i<4; i++) {
            for (var j=0; j<4; j++) {
                if (suggestedBids[j] < suggestedBids[i]) {
                    var tmp1 = suggestedBids[i];
                    var tmp2 = indices[i];
                    suggestedBids[i] = suggestedBids[j];
                    indices[i] = indices[j];
                    suggestedBids[j] = tmp1;
                    indices[j] = tmp2;
                }
            }
        }

        for (var idx=0; idx<4; idx++) {
            var curSuit = suits[indices[idx]];
            var visuals = this.histogramVisuals[idx];
            switch (curSuit) {
                case 'S':
                    visuals.suitImage.src = 'shared/images/score_spade.png';
                    break;
                case 'H':
                    visuals.suitImage.src = 'shared/images/score_heart.png';
                    break;
                case 'D':
                    visuals.suitImage.src = 'shared/images/score_diamond.png';
                    break;
                case 'C':
                    visuals.suitImage.src = 'shared/images/score_club.png';
                    break;
            }

            var roundScoresHistogram = roundBidAnalysis.histogramsBySuit[curSuit];
            
            // Find the max count
            var maxHistogramCount = 10;
            for (var i=0; i<=this.histogramMaxVisibleScore; i++) {
                if (roundScoresHistogram[i] == null) {
                    continue;
                }
                var histogramCountForScore = roundScoresHistogram[i];
                if (histogramCountForScore > maxHistogramCount) {
                    maxHistogramCount = histogramCountForScore;
                }
            }

            // Draw all the histogram bars
            for (var i=0; i<this.histogramMaxVisibleScore; i++) {
                if (visuals.bars[i] == null) {
                    continue;
                }
                var bar = visuals.bars[i];
                if (roundScoresHistogram[i] == null) {
                    bar.style.transform = 'scaleY(0)';
                } else {
                    var score = roundScoresHistogram[i];
                    var percent = score/maxHistogramCount;
                    bar.style.transform = 'scaleY(' + percent + ')';
                }
            }

            var safeBid = roundBidAnalysis.safeBids[indices[idx]];
            var leftOffset = this.histogramBarsLeftOffset + (this.histogramRegionWidth-this.histogramBarsLeftOffset)*(safeBid-this.histogramMinScore)/(this.histogramMaxVisibleScore-this.histogramMinScore) + this.histogramBarWidth/2;
            visuals.safeBidLine.style.left = leftOffset + 'px';
            visuals.safeBidLine.style.opacity = 1;
            visuals.safeBidValue.innerText = safeBid;
            visuals.safeBidValue.style.left = leftOffset + 'px';
            visuals.safeBidValue.style.opacity = 1;
            visuals.safeBidLabel.style.left = leftOffset + 'px';
            visuals.safeBidLabel.style.opacity = 1;

            var suggestedBid = roundBidAnalysis.suggestedBids[indices[idx]];
            leftOffset = this.histogramBarsLeftOffset + (this.histogramRegionWidth-this.histogramBarsLeftOffset)*(suggestedBid-this.histogramMinScore)/(this.histogramMaxVisibleScore-this.histogramMinScore) + this.histogramBarWidth/2;
            visuals.suggestedBidLine.style.left = leftOffset + 'px';
            visuals.suggestedBidLine.style.opacity = 1;
            visuals.suggestedBidValue.innerText = suggestedBid;
            visuals.suggestedBidValue.style.left = leftOffset + 'px';
            visuals.suggestedBidValue.style.opacity = 1;
            visuals.suggestedBidLabel.style.left = leftOffset + 'px';
            visuals.suggestedBidLabel.style.opacity = 1;
        }
    }

    this.ShowRoundSimulationsView = function() {
        
        this.CreateSimulationHistogramVisuals();

        this.worker.postMessage({
            'cmd': 'FindRoundBidAnalysis', 
            'gameState': game.CreateClonableGameState(game),
            'passingCardsCount': this.settings.GetSetting('setting_passing_cards_count'),
            'playerSkill': 'Pro',
            'playerIndex': 0,
            'playerCards': game.CreateClonableCards(game.players[0].cards),
            'simulationsPerSuit': 1000,
            'isForSimulationView': true
        });
        
        var elem = document.getElementById('pinochle_round_simulations_view');
        with (elem.style) {
            transition = 'none';
            transform = 'translate(-50%, -50%) scale(0)';
            opacity = 1;
            visibility = 'visible';
        }
        setTimeout(function(){
            with (elem.style) {
                transition = '0.3s linear';
                transform = 'translate(-50%, -50%) scale(1)';
            }
        }, 100);
    }

    this.HideRoundSimulationsView = function() {
        var elem = document.getElementById('pinochle_round_simulations_view');
        with (elem.style) {
            transition = '0.3s linear';
            transform = 'translate(-50%, -' + gameContainer.innerHeight + 'px) scale(1)';
            visibility = 'hidden';
        }
    }

    this.GetCurrentComputerPlayerDecisionNames = function() {
        var selectedIndex = 0;
        switch (game.currentMoveStage) {
            case 'ChoosingBids':
                selectedIndex = 0;
                break;
            case 'ChoosingPassCards':
                if (game.currentHighestBidder = game.players[2]) {
                    selectedIndex = 1;
                } else {
                    selectedIndex = 2;
                }
                break;
            case 'ChoosingTrickCard':
                selectedIndex = 3;
                break;
            default:
                selectedIndex = 2;
                this.LoadDecisionScenario(selectedIndex);
                break;
        }
        return {
            displayNames: ["Choose Bid/Trump", "Pass To Bid Winner", "Pass<br>Back", "Choose Trick Card"],
            selectedIndex: selectedIndex
        }
    }

    this.LoadDecisionScenario = function(decisionIndex) {
        
        // Create a random game scenario for the current decisionIndex
        game.InitializeGame('Standard');
        game.roundNumber = this.roundNumber + 1;
        game.currentHighestBidder = null;
        game.trickCards = [];
        game.dealerIndex = 0;
        for (var i=0; i<game.players.length; i++) {
            var player = game.players[i];
            player.cards = [];
            player.currentRoundMeldScore = 0;
            player.currentRoundCountersTaken = 0;
            player.currentRoundBid = -1;
            player.currentRoundMaximumBid = -1;
            player.currentRoundBidIsPass = false;
            player.isShownVoidInSuit = [false,false,false,false];
        }

        // Deal cards for round
        game.cardsPlayedThisRound = [];
        var isDoubleDeck = this.settings.GetSetting('setting_deck_count')==1;
        InitializeCardDeck(isDoubleDeck);
        var cardsPerHand = isDoubleDeck ? 20 : 12;
        for (var i=0; i<cardsPerHand; i++) {
            for (var j=0; j<4; j++) {
                var card = cards[deckTopIndex];
                card.wasShown = false;
                game.players[j].cards.push(card);
                deckTopIndex = deckTopIndex-1;
            }
        }

        switch (decisionIndex) {
            case 0:
                // ChoosingBids
                game.currentMoveStage = 'ChoosingBids';
                var currentBid = Number(game.settings.GetSetting('setting_minimum_bid'));
                for (var i=1; i<4; i++) {
                    game.players[i].currentRoundMaximumBid = 10000; // Just assign a large value so that we dont run costly analysis
                    game.players[i].currentRoundBid = currentBid;
                    currentBid++;
                }
                game.currentHighestBidder = game.players[3];   
            break; 
            case 1:
                // Pass to bid winner
                game.currentMoveStage = 'ChoosingPassCards';
                game.bidWinner = 2;
                game.currentHighestBidder = game.players[game.bidWinner];

                // Choose a random bid and a reasonable trump suit
                var bidAndSuit = [0, ''];
                if (game.isDoubleDeck) {
                    bidAndSuit[0] = Math.floor(Math.random() * 25) + 50
                } else {
                    bidAndSuit[0] = Math.floor(Math.random() * 10) + 20
                }
                var suitStrength = [];
                for (var i=0; i<4; i++) {
                    suitStrength[i] = 0;
                }
                for (var i=0; i<game.currentHighestBidder.cards.length; i++) {
                    suitStrength[game.currentHighestBidder.cards[i].suitInt] += game.currentHighestBidder.cards[i].value;
                }
                var bestStrength = 0;
                var suits = ['S','H','C','D'];
                for (var i=0; i<4; i++) {
                    if (suitStrength[i] >= bestStrength) {
                        bestStrength = suitStrength[i];
                        bidAndSuit[1] = suits[i];
                    }
                }
                game.currentHighestBidder.currentRoundBid = bidAndSuit[0];
                game.currentHighestBidder.currentRoundMaximumBid = game.currentHighestBidder.currentRoundBid;
                game.trumpSuit = bidAndSuit[1];
                break;
            case 2:
                // Pass as bid winner
                game.currentMoveStage = 'ChoosingPassCards';
                game.bidWinner = 0;
                game.currentHighestBidder = game.players[game.bidWinner];

                // Choose a random bid and a reasonable trump suit
                var bidAndSuit = [0, ''];
                if (game.isDoubleDeck) {
                    bidAndSuit[0] = Math.floor(Math.random() * 25) + 50
                } else {
                    bidAndSuit[0] = Math.floor(Math.random() * 10) + 20
                }
                var suitStrength = [];
                for (var i=0; i<4; i++) {
                    suitStrength[i] = 0;
                }
                for (var i=0; i<game.currentHighestBidder.cards.length; i++) {
                    suitStrength[game.currentHighestBidder.cards[i].suitInt] += game.currentHighestBidder.cards[i].value;
                }
                var bestStrength = 0;
                var suits = ['S','H','C','D'];
                for (var i=0; i<4; i++) {
                    if (suitStrength[i] >= bestStrength) {
                        bestStrength = suitStrength[i];
                        bidAndSuit[1] = suits[i];
                    }
                }
                game.currentHighestBidder.currentRoundBid = bidAndSuit[0];
                game.trumpSuit = bidAndSuit[1];

                // Pass cards to bid winner
                var passingCardsCount = Number(game.settings.GetSetting('setting_passing_cards_count'));
                var passingPlayer = game.players[2];
                var bestCards = passingPlayer.FindBestPassingCards(passingCardsCount, passingPlayer.skillLevel, game);
                passingPlayer.passingCards = bestCards;
                passingPlayer.cards = game.players[2].cards.filter((el) => !bestCards.includes(el));
                var receivingPlayer = game.players[0];
                receivingPlayer.receivedCards = [];
                for (var i=0; i<passingPlayer.passingCards.length; i++) {
                    passingPlayer.passingCards[i].wasPassed = true;
                    receivingPlayer.receivedCards.push(passingPlayer.passingCards[i]);
                    receivingPlayer.cards.push(passingPlayer.passingCards[i]);
                }

                break;
            case 3:
                // Trick Taking
                game.currentMoveStage = 'ChoosingTrickCard';
                game.bidWinner = Math.floor(Math.random()*4);
                game.currentHighestBidder = game.players[game.bidWinner];
                
                // Choose a random bid and a reasonable trump suit
                var bidAndSuit = [0, ''];
                if (game.isDoubleDeck) {
                    bidAndSuit[0] = Math.floor(Math.random() * 25) + 50
                } else {
                    bidAndSuit[0] = Math.floor(Math.random() * 10) + 20
                }
                var suitStrength = [];
                for (var i=0; i<4; i++) {
                    suitStrength[i] = 0;
                }
                for (var i=0; i<game.currentHighestBidder.cards.length; i++) {
                    suitStrength[game.currentHighestBidder.cards[i].suitInt] += game.currentHighestBidder.cards[i].value;
                }
                var bestStrength = 0;
                var suits = ['S','H','C','D'];
                for (var i=0; i<4; i++) {
                    if (suitStrength[i] >= bestStrength) {
                        bestStrength = suitStrength[i];
                        bidAndSuit[1] = suits[i];
                    }
                }
                game.currentHighestBidder.currentRoundBid = bidAndSuit[0];
                game.trumpSuit = bidAndSuit[1];

                // Pass cards to bid winner
                var passingCardsCount = Number(game.settings.GetSetting('setting_passing_cards_count'));
                var passingPlayer = game.players[(game.currentHighestBidder.playerPositionInt+2)%4];
                var bestCards = passingPlayer.FindBestPassingCards(passingCardsCount, 'Standard', game);
                passingPlayer.passingCards = bestCards;
                passingPlayer.cards = passingPlayer.cards.filter((el) => !bestCards.includes(el));
                var receivingPlayer = game.players[game.currentHighestBidder.playerPositionInt];
                receivingPlayer.receivedCards = [];
                for (var i=0; i<passingPlayer.passingCards.length; i++) {
                    passingPlayer.passingCards[i].wasPassed = true;
                    receivingPlayer.receivedCards.push(passingPlayer.passingCards[i]);
                    receivingPlayer.cards.push(passingPlayer.passingCards[i]);
                }

                // Pass cards back
                receivingPlayer = passingPlayer;
                passingPlayer = game.currentHighestBidder;
                bestCards = passingPlayer.FindBestPassingCards(passingCardsCount, 'Standard', game);
                passingPlayer.passingCards = bestCards;
                passingPlayer.cards = passingPlayer.cards.filter((el) => !bestCards.includes(el));
                receivingPlayer.receivedCards = [];
                for (var i=0; i<passingPlayer.passingCards.length; i++) {
                    passingPlayer.passingCards[i].wasPassed = true;
                    receivingPlayer.receivedCards.push(passingPlayer.passingCards[i]);
                    receivingPlayer.cards.push(passingPlayer.passingCards[i]);
                }

                // Count Melds
                for (var i=0; i<4; i++) {
                    var player = game.players[i];
                    player.passingCards = [];
                    player.CalculateMelds(player.cards, game.trumpSuit, game.isDoubleDeck, false);
                    for (var n=0; n<player.melds.length; n++) {
                        var meld = player.melds[n];
                        for (var k=0; k<meld.cards.length; k++) {
                            var card = meld.cards[k];
                            card.wasShown = true;
                        }
                    }
                }

                game.leadIndex = game.currentHighestBidder.playerPositionInt;
                game.turnIndex = game.leadIndex;

                // Play out trick taking for a random number of tricks
                var randomTricksPlayed = Math.floor(Math.random()*game.currentHighestBidder.cards.length-2);
                while (randomTricksPlayed>0) {
                    game.trickCards = [];
                    while (game.trickCards.length < 4) {
                        var nextPlayer = game.players[game.turnIndex%4];
                        var nextCard = nextPlayer.FindBestPlayingCard(game, 'Standard');
                        PlayCard(game,nextCard);
                    }

                    var trickResult = GetTrickResult(game);
                    trickResult.trickTaker.currentRoundCountersTaken += trickResult.countersTaken;
                    game.leadIndex = trickResult.trickTaker.playerPositionInt;
                    game.turnIndex = game.leadIndex;

                    randomTricksPlayed = randomTricksPlayed-1;
                }
                
                // Play out the trick until it is the player's turn
                game.trickCards = [];
                while (game.turnIndex%4 != 0) {
                    var nextPlayer = game.players[game.turnIndex%4];
                    var nextCard = nextPlayer.FindBestPlayingCard(game, 'Standard');
                    PlayCard(game,nextCard);
                }

                break;
        }

        game.LoadGameState(game.CreateGameStateString());

    }

    this.GetAllDecisionMethods = function() {
        var decisionMethods = [];
        for (var i=0; i<4; i++) {
            decisionMethods[i] = game.players[0].GetDecisionMethod(i);
        }
        return decisionMethods;
    }

    this.GetCustomPlayerMethod = function(decisionIndex) {
        return game.players[0].GetDecisionMethod(decisionIndex);
    }

    this.SaveCurrentDecisionMethod = function(decisionIndex, code) {
        var decisionMethodName = "pinochle_decision_method_Custom_" + decisionIndex;
        window.localStorage.setItem(decisionMethodName, code);
    }

    this.TryCurrentDecisionMethod = function(decisionIndex) {
        try {
            var optimalCards = [];
            switch (decisionIndex) {
                case 0: // Choose Bid
                {
                    var passingCardsCount = Number(this.settings.GetSetting('setting_passing_cards_count'));
                    var player = this.players[0];
                    var bid = player.FindBestBid(game, player.skillLevel, passingCardsCount);
                    // TODO: indicate the current custom decision bid output
                    console.log("Custom Bid: " + bid);
                }
                break;

                case 1: // Pass to bid winner
                {
                    var player = this.players[0];
                    var passingCardsCount = Number(this.settings.GetSetting('setting_passing_cards_count'));
                    //player.CalculateMelds(player.cards, game.trumpSuit, game.isDoubleDeck, true);
                    //var bestCards = player.ChoosePassCardsToBidWinner(player.cards, player.melds, game.trumpSuit, game.isDoubleDeck, passingCardsCount);
                    var bestCards = player.FindBestPassingCards(passingCardsCount, player.skillLevel, game);
                    for (var i=0; i<bestCards.length; i++) {
                        optimalCards.push(bestCards[i]);
                    }
                }
                break;

                case 2: // Pass as bid winner
                {
                    var player = this.players[0];
                    var passingCardsCount = Number(this.settings.GetSetting('setting_passing_cards_count'));
                    //player.CalculateMelds(player.cards, game.trumpSuit, game.isDoubleDeck, true);
                    //var bestCards = player.ChoosePassCardsAsBidWinner(player.cards, player.receivedCards, player.melds, game.trumpSuit, passingCardsCount);
                    var bestCards = player.FindBestPassingCards(passingCardsCount, player.skillLevel, game);
                    for (var i=0; i<bestCards.length; i++) {
                        optimalCards.push(bestCards[i]);
                    }
                }
                break;

                case 3: // Choose trick card
                {
                    var player = this.players[0];
                    var bestCard = player.FindBestPlayingCard(game, player.skillLevel);
                    optimalCards.push(bestCard);
                }
                break;
            }

            for (var i=0; i<optimalCards.length; i++) {
                var cardView = optimalCards[i].cardView;
                IndicateCustomDecisionCard(cardView);
            }

            IndicateCodeError("");
        }
        catch (err) {
            IndicateCodeError(err);
        }
    }

    this.ClearAllCustomDecisionIndicators = function() {
        for (var i=0; i<cards.length; i++) {
            RemoveCustomDecisionIndicator(cards[i].cardView);
        }
    }

    this.LoadStatsView = function() {
        var statsView = document.getElementById('simulator_stats');
        statsView.innerHTML = "<div id='pinochle_simulator_stats'><center>\
                <table style='width: calc(100% - 20px); font-size: 12pt;'>\
                    <tr>\
                        <td class='pinochle_simulator_table_category'></td>\
                        <td class='pinochle_simulator_table_stat'>Easy</td>\
                        <td class='pinochle_simulator_table_stat'>Standard</td>\
                        <td class='pinochle_simulator_table_stat'>Pro</td>\
                        <td class='pinochle_simulator_table_stat_total'>Total</td>\
                    </tr>\
                </table>\
            </center>\
            <div id='pinochle_simulator_statistics_body'>\
                <center>\
                    <table class='pinochle_simulator_table_outline'>\
                        <tr>\
                            <td class='pinochle_simulator_table_category'>Games Played</td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_games_played_Easy'></td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_games_played_Standard'></td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_games_played_Pro'></td>\
                            <td class='pinochle_simulator_table_stat_total' id='pinochle_simulator_games_played_Total'>0</td>\
                        </tr>\
                        <tr>\
                            <td class='pinochle_simulator_table_category'>Wins</td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_wins_Easy'></td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_wins_Standard'></td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_wins_Pro'></td>\
                            <td class='pinochle_simulator_table_stat_total' id='pinochle_simulator_wins_Total'>0</td>\
                        </tr>\
                        <tr>\
                            <td class='pinochle_simulator_table_category'>Win Percentage</td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_win_percent_Easy'></td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_win_percent_Standard'></td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_win_percent_Pro'></td>\
                            <td class='pinochle_simulator_table_stat_total' id='pinochle_simulator_win_percent_Total'></td>\
                        </tr>\
                    </table>\
                    \
                    <div style='margin-top:10pt; font-size:12pt;'>Averages when you declare trump:</div>\
                    <table class='pinochle_simulator_table_outline'>\
                        <tr>\
                            <td class='pinochle_simulator_table_category'>Avg Bid Contract</td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_avg_bid_contract_with_bid_Easy'></td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_avg_bid_contract_with_bid_Standard'></td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_avg_bid_contract_with_bid_Pro'></td>\
                            <td class='pinochle_simulator_table_stat_total' id='pinochle_simulator_avg_bid_contract_with_bid_Total'>0</td>\
                        </tr>\
                        <tr>\
                            <td class='pinochle_simulator_table_category'>Avg Meld</td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_avg_meld_with_bid_Easy'></td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_avg_meld_with_bid_Standard'></td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_avg_meld_with_bid_Pro'></td>\
                            <td class='pinochle_simulator_table_stat_total' id='pinochle_simulator_avg_meld_with_bid_Total'>0</td>\
                        </tr>\
                        <tr>\
                            <td class='pinochle_simulator_table_category'>Avg Counters</td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_avg_counters_with_bid_Easy'></td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_avg_counters_with_bid_Standard'></td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_avg_counters_with_bid_Pro'></td>\
                            <td class='pinochle_simulator_table_stat_total' id='pinochle_simulator_avg_counters_with_bid_Total'></td>\
                        </tr>\
                        <tr>\
                            <td class='pinochle_simulator_table_category' style='font-size:10pt'>Avg Positive Round Score</td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_avg_round_score_with_bid_Easy'></td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_avg_round_score_with_bid_Standard'></td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_avg_round_score_with_bid_Pro'></td>\
                            <td class='pinochle_simulator_table_stat_total' id='pinochle_simulator_avg_round_score_with_bid_Total'></td>\
                        </tr>\
                        <tr>\
                            <td class='pinochle_simulator_table_category'>Make Contract %</td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_make_contract_percent_Easy'></td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_make_contract_percent_Standard'></td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_make_contract_percent_Pro'></td>\
                            <td class='pinochle_simulator_table_stat_total' id='pinochle_simulator_make_contract_percent_Total'></td>\
                        </tr>\
                    </table>\
                    \
                    <div style='margin-top:10pt; font-size:12pt;'>Averages when opponent declares trump:</div>\
                    <table class='pinochle_simulator_table_outline'>\
                        <tr>\
                            <td class='pinochle_simulator_table_category'>Avg Meld</td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_avg_meld_without_bid_Easy'></td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_avg_meld_without_bid_Standard'></td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_avg_meld_without_bid_Pro'></td>\
                            <td class='pinochle_simulator_table_stat_total' id='pinochle_simulator_avg_meld_without_bid_Total'>0</td>\
                        </tr>\
                        <tr>\
                            <td class='pinochle_simulator_table_category'>Avg Counters</td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_avg_counters_without_bid_Easy'></td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_avg_counters_without_bid_Standard'></td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_avg_counters_without_bid_Pro'></td>\
                            <td class='pinochle_simulator_table_stat_total' id='pinochle_simulator_avg_counters_without_bid_Total'></td>\
                        </tr>\
                        <tr>\
                            <td class='pinochle_simulator_table_category'>Avg Round Score</td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_avg_round_score_without_bid_Easy'></td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_avg_round_score_without_bid_Standard'></td>\
                            <td class='pinochle_simulator_table_stat' id='pinochle_simulator_avg_round_score_without_bid_Pro'></td>\
                            <td class='pinochle_simulator_table_stat_total' id='pinochle_simulator_avg_round_score_without_bid_Total'></td>\
                        </tr>\
                    </table>\
                </center>\
            </div>\
            </div>";
    }

    this.UpdateSimulationStats = function(stats) {
        var opponentSkillLevels = ['Easy', 'Standard', 'Pro'];
        var total = 0;
        for (var i=0; i<opponentSkillLevels.length; i++) {
            var elem = document.getElementById('pinochle_simulator_games_played_' + opponentSkillLevels[i]);
            total += stats.gamesPlayed[opponentSkillLevels[i]];
            elem.innerText = stats.gamesPlayed[opponentSkillLevels[i]];
        }
        document.getElementById('pinochle_simulator_games_played_Total').innerText = total;
        
        total = 0;
        for (var i=0; i<opponentSkillLevels.length; i++) {
            var elem = document.getElementById('pinochle_simulator_wins_' + opponentSkillLevels[i]);
            total += stats.wins[opponentSkillLevels[i]];
            elem.innerText = stats.wins[opponentSkillLevels[i]];
        }
        document.getElementById('pinochle_simulator_wins_Total').innerText = total;

        var totalWins = 0;
        var totalGamesPlayed = 0;
        for (var i=0; i<opponentSkillLevels.length; i++) {
            var elem = document.getElementById('pinochle_simulator_win_percent_' + opponentSkillLevels[i]);
            var gamesPlayedCount = stats.gamesPlayed[opponentSkillLevels[i]];
            var wins = stats.wins[opponentSkillLevels[i]];
            totalGamesPlayed += gamesPlayedCount;
            totalWins += wins;
            if (gamesPlayedCount > 0) {
                var winPercent = 100 * ( wins / gamesPlayedCount);
                elem.innerText = winPercent.toFixed(0) + "%";
            } else {
                elem.innerText = "";
            }
        }
        if (totalGamesPlayed > 0) {
            var winPercent = 100 * (totalWins / totalGamesPlayed);
            document.getElementById('pinochle_simulator_win_percent_Total').innerText = winPercent.toFixed(0) + "%";
        } else {
            document.getElementById('pinochle_simulator_win_percent_Total').innerText = "";
        }

        total = 0;
        var totalCount = 0;
        for (var i=0; i<opponentSkillLevels.length; i++) {
            var elem = document.getElementById('pinochle_simulator_avg_bid_contract_with_bid_' + opponentSkillLevels[i]);
            var contract = stats.contractTotal[opponentSkillLevels[i]];
            var count = stats.contractCount[opponentSkillLevels[i]];
            if (count > 0) {
                var avg = contract/count;
                elem.innerText = avg.toFixed(0);
            }
            total += contract;
            totalCount += count;
        }
        if (totalCount > 0) {
            var totalAvg = total/totalCount;
            document.getElementById('pinochle_simulator_avg_bid_contract_with_bid_Total').innerText = totalAvg.toFixed(0);
        } else {
            document.getElementById('pinochle_simulator_avg_bid_contract_with_bid_Total').innerText = "";    
        }

        total = 0;
        totalCount = 0;
        for (var i=0; i<opponentSkillLevels.length; i++) {
            var elem = document.getElementById('pinochle_simulator_avg_meld_with_bid_' + opponentSkillLevels[i]);
            var meld = stats.meldWithBidTotal[opponentSkillLevels[i]];
            var count = stats.meldWithBidCount[opponentSkillLevels[i]];
            if (count > 0) {
                var avg = meld/count;
                elem.innerText = avg.toFixed(0);
            }
            total += meld;
            totalCount += count;
        }
        if (totalCount > 0) {
            var totalAvg = total/totalCount;
            document.getElementById('pinochle_simulator_avg_meld_with_bid_Total').innerText = totalAvg.toFixed(0);
        } else {
            document.getElementById('pinochle_simulator_avg_meld_with_bid_Total').innerText = "";    
        }
        
        total = 0;
        totalCount = 0;
        for (var i=0; i<opponentSkillLevels.length; i++) {
            var elem = document.getElementById('pinochle_simulator_avg_counters_with_bid_' + opponentSkillLevels[i]);
            var counters = stats.countersWithBidTotal[opponentSkillLevels[i]];
            var count = stats.countersWithBidCount[opponentSkillLevels[i]];
            if (count > 0) {
                var avg = counters/count;
                elem.innerText = avg.toFixed(0);
            }
            total += counters;
            totalCount += count;
        }
        if (totalCount > 0) {
            var totalAvg = total/totalCount;
            document.getElementById('pinochle_simulator_avg_counters_with_bid_Total').innerText = totalAvg.toFixed(0);
        } else {
            document.getElementById('pinochle_simulator_avg_counters_with_bid_Total').innerText = "";    
        }

        total = 0;
        totalCount = 0;
        for (var i=0; i<opponentSkillLevels.length; i++) {
            var elem = document.getElementById('pinochle_simulator_avg_round_score_with_bid_' + opponentSkillLevels[i]);
            var score = stats.roundScoresWithBidTotal[opponentSkillLevels[i]];
            var count = stats.roundScoresWithBidCount[opponentSkillLevels[i]];
            if (count > 0) {
                var avg = score/count;
                elem.innerText = avg.toFixed(0);
            }
            total += score;
            totalCount += count;
        }
        if (totalCount > 0) {
            var totalAvg = total/totalCount;
            document.getElementById('pinochle_simulator_avg_round_score_with_bid_Total').innerText = totalAvg.toFixed(0);
        } else {
            document.getElementById('pinochle_simulator_avg_round_score_with_bid_Total').innerText = "";    
        }

        var totalContractsMade = 0;
        var totalContractsAttempted = 0;
        for (var i=0; i<opponentSkillLevels.length; i++) {
            var elem = document.getElementById('pinochle_simulator_make_contract_percent_' + opponentSkillLevels[i]);
            var contractsMadeCount = stats.contractMadeCount[opponentSkillLevels[i]];
            var contractsWonCount = stats.contractMadeAttemptsCount[opponentSkillLevels[i]];
            totalContractsMade += contractsMadeCount;
            totalContractsAttempted += contractsWonCount;
            if (contractsWonCount > 0) {
                var makeContractPercent = 100 * ( contractsMadeCount / contractsWonCount);
                elem.innerText = makeContractPercent.toFixed(0) + "%";
            } else {
                elem.innerText = "";
            }
        }
        if (totalContractsAttempted > 0) {
            var winPercent = 100 * (totalContractsMade / totalContractsAttempted);
            document.getElementById('pinochle_simulator_make_contract_percent_Total').innerText = winPercent.toFixed(0) + "%";
        } else {
            document.getElementById('pinochle_simulator_make_contract_percent_Total').innerText = "";
        }

        //
        // Without Bid
        // 

        total = 0;
        totalCount = 0;
        for (var i=0; i<opponentSkillLevels.length; i++) {
            var elem = document.getElementById('pinochle_simulator_avg_meld_without_bid_' + opponentSkillLevels[i]);
            var meld = stats.meldWithoutBidTotal[opponentSkillLevels[i]];
            var count = stats.meldWithoutBidCount[opponentSkillLevels[i]];
            if (count > 0) {
                var avg = meld/count;
                elem.innerText = avg.toFixed(0);
            }
            total += meld;
            totalCount += count;
        }
        if (totalCount > 0) {
            var totalAvg = total/totalCount;
            document.getElementById('pinochle_simulator_avg_meld_without_bid_Total').innerText = totalAvg.toFixed(0);
        } else {
            document.getElementById('pinochle_simulator_avg_meld_without_bid_Total').innerText = "";    
        }
        
        total = 0;
        totalCount = 0;
        for (var i=0; i<opponentSkillLevels.length; i++) {
            var elem = document.getElementById('pinochle_simulator_avg_counters_without_bid_' + opponentSkillLevels[i]);
            var counters = stats.countersWithoutBidTotal[opponentSkillLevels[i]];
            var count = stats.countersWithoutBidCount[opponentSkillLevels[i]];
            if (count > 0) {
                var avg = counters/count;
                elem.innerText = avg.toFixed(0);
            }
            total += counters;
            totalCount += count;
        }
        if (totalCount > 0) {
            var totalAvg = total/totalCount;
            document.getElementById('pinochle_simulator_avg_counters_without_bid_Total').innerText = totalAvg.toFixed(0);
        } else {
            document.getElementById('pinochle_simulator_avg_counters_without_bid_Total').innerText = "";    
        }

        total = 0;
        totalCount = 0;
        for (var i=0; i<opponentSkillLevels.length; i++) {
            var elem = document.getElementById('pinochle_simulator_avg_round_score_without_bid_' + opponentSkillLevels[i]);
            var score = stats.roundScoresWithoutBidTotal[opponentSkillLevels[i]];
            var count = stats.roundScoresWithoutBidCount[opponentSkillLevels[i]];
            if (count > 0) {
                var avg = score/count;
                elem.innerText = avg.toFixed(0);
            }
            total += score;
            totalCount += count;
        }
        if (totalCount > 0) {
            var totalAvg = total/totalCount;
            document.getElementById('pinochle_simulator_avg_round_score_without_bid_Total').innerText = totalAvg.toFixed(0);
        } else {
            document.getElementById('pinochle_simulator_avg_round_score_without_bid_Total').innerText = "";    
        }

    }
}