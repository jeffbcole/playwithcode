var CribbageGame = function () {

    // Global Game Settings
    this.settings = new CribbageSettings();

    // Constants
    var cardLoweredWidth = 115;
    var cardLoweredHeight = 162;
    var handCardsMaxSpacing = 3;
    var computerCardsMaxSpacing = -50;
    var cribDiscardSpacing = 13;
    var peggingCardsOverlap = 21;
    var peggingCardsVerticalOffset = 10;
    var peggingDeadCardsOverlap = 12;
    var bubbleScoreVisibleDuration = 1200;
    var computerCountSpacingMin = 20;
    var currentComputerCardSpacing;

    // private variables
    var cardsAreVisible = false;
    var skillLevel = "";
    var currentMoveStage = "";
    var playerScore = 0;
    var computerScore = 0;
    var isPlayersCrib = false;
    var playersHand = [];
    var computersHand = [];
    var crib = [];

    var currentPeggingCards = [];
    var deadPeggingCards = [];
    var computerPlayedPeggingCards = [];
    var playerPlayedPeggingCards = [];
    var isPlayersTurnToPeg = false;
    var playerSaysGo = false;
    var computerSaysGo = false;

    var visibleLowCardOptionsCount = 0;
    var playerSelectedLowCardView;
    var computerSelectedLowCardView;
    var currentDraggedCardView;
    var currentPreCribDraggedCardWasLastInTheCrib = false;
    var currentPlayerHandCardSpacing = 0;
    var autoPlayBoundaryY = 0;

    var humanPlayer = new CribbagePlayer();
    var computerPlayer = new CribbagePlayer();

    var computerPeggingPointsTotal = 0;
    var playerPeggingPointsTotal = 0;

    var recordPlayerPeggingStartingScore = 0;
    var recordComputerPeggingStartingScore = 0;
    var topCard;

    var peggingCountText;
    var currentPeggingCount = 0;

    var computerHandPointsTotal = 0;
    var playerHandPointsTotal = 0;
    var computerCribPointsTotal = 0;
    var playerCribPointsTotal = 0;

    var suboptimalPlays = [];

    var mostRecentHandCards = [];
    var mostRecentIsPlayersCrib = false;

    gameContainer.innerHTML = 
    '<div id="below_cards_messages_region">\
        <div id="select_low_card_message">Click on a card. Lowest card gets the first crib.</div>\
        <div id="low_card_you_text" class="low_card_text">You</div>\
        <div id="low_card_computer_text" class="low_card_text">Opponent</div>\
        \
        <div id="pegging_prompt">Drop a<br>card here</div>\
        \
        <div id="manual_prompt">Click on cards to start counting your points</div>\
        \
        <button id="hint_button" onclick="game.OnHintButtonClick()">Hint</button>\
        \
        <div id="crib_region">\
            <div id="crib_region_top_left_side" class="crib_region_border"></div>\
            <div id="crib_region_top_left_top" class="crib_region_border"></div>\
            <div id="crib_region_top_right_top" class="crib_region_border"></div>\
            <div id="crib_region_top_right_side" class="crib_region_border"></div>\
            <div id="crib_region_bottom_right_side" class="crib_region_border"></div>\
            <div id="crib_region_bottom_right_bottom" class="crib_region_border"></div>\
            <div id="crib_region_bottom_left_bottom" class="crib_region_border"></div>\
            <div id="crib_region_bottom_left_side" class="crib_region_border"></div>\
            <div id="crib_region_center_text">Opponent\'s Crib</div>\
            <div id="crib_region_prompt">Drop 2 cards here</div>\
        </div>\
        \
        <div id="confirm_crib_region">\
            <div id="confirm_crib_region_shadow"></div>\
            <button id="confirm_crib_button" onclick="game.cribCardsConfirmed()">Confirm Crib Cards</button>\
        </div>\
    </div>\
    \
    <div id="scoreboard">\
        <div id="scoreboard_pegs">\
            <div id="skunk_line_vertical"></div>\
            <div id="skunk_line_horizontal"></div>\
            <div id="scoreboard_leftColumn">\
            </div>\
            <div id="scoreboard_topRow">\
            </div>\
            <div id="scoreboard_rightColumn">\
            </div>\
            <div id="scoreboard_pegs_score_view">\
                <table>\
                    <tr>\
                        <td id="scoreboard_pegs_crib_indicator_group" rowspan="2">\
                            <div id="scoreboard_pegs_score_crib_indicator">CRIB</div>\
                            <div id="scoreboard_pegs_score_crib_arrow">\
                                <div class="arrow-right-shadow"></div>\
                                <div class="arrow-right"></div>\
                            </div>\
                        </td>\
                        <td>\
                            <div id="scoreboard_pegs_score_you_text">YOU</div>\
                        </td>\
                        <td>\
                            <div>\
                                <img src="shared/images/PegBlue.png" ondragstart="return false;" />\
                            </div>\
                        </td>\
                        <td>\
                            <div id="scoreboard_pegs_score_you_points_container">\
                                <div id="scoreboard_pegs_score_you_points">0</div>\
                            </div>\
                        </td>\
                    </tr>\
                    <tr>\
                        <td>\
                            <div id="scoreboard_pegs_score_opp_text">OPP</div>\
                        </td>\
                        <td>\
                            <div style="overflow: visible; height:0px;">\
                                <img src="shared/images/PegRed.png" style="transform: translate(0px,-25px);" ondragstart="return false;" />\
                            </div>\
                        </td>\
                        <td>\
                            <div id="scoreboard_pegs_score_opp_points_container">\
                                <div id="scoreboard_pegs_score_opp_points">0</div>\
                            </div>\
                        </td>\
                    </tr>\
                </table>\
            </div>\
            \
            <img id="scoreboard_pegs_redpeg_1" class="scoreboard_pegs_peg" src="shared/images/PegRed.png" ondragstart="return false;" />\
            <img id="scoreboard_pegs_redpeg_2" class="scoreboard_pegs_peg" src="shared/images/PegRed.png" ondragstart="return false;" />\
            <img id="scoreboard_pegs_bluepeg_1" class="scoreboard_pegs_peg" src="shared/images/PegBlue.png" ondragstart="return false;" />\
            <img id="scoreboard_pegs_bluepeg_2" class="scoreboard_pegs_peg" src="shared/images/PegBlue.png" ondragstart="return false;" />\
        </div>\
        <div id="scoreboard_compact">\
            <div id="scoreboard_compact_crib_indicator">\
                <div id="scoreboard_compact_crib_indicator_group">\
                    <div id="scoreboard_compact_score_crib_indicator">CRIB</div>\
                    <div id="scoreboard_compact_score_crib_arrow">\
                        <div class="arrow-down-shadow"></div>\
                        <div class="arrow-down"></div>\
                    </div>\
                </div>\
            </div>\
            \
            <div id="scoreboard_compact_you_text">YOU</div>\
            <div id="scoreboard_compact_you_left_nib_shadow"></div>\
            <div id="scoreboard_compact_you_back_bar_shadow"></div>\
            <div id="scoreboard_compact_you_right_nib_shadow"></div>\
            <div id="scoreboard_compact_you_left_nib"></div>\
            <div id="scoreboard_compact_you_back_bar"></div>\
            <div id="scoreboard_compact_you_right_nib"></div>\
            <div id="scoreboard_compact_you_fill_bar"></div>\
            <img id="scoreboard_compact_you_peg" src="shared/images/PegBlue.png" ondragstart="return false;" />\
            <div id="scoreboard_compact_you_score_container">\
                <div id="scoreboard_compact_you_score">0</div>\
            </div>\
            \
            <div id="scoreboard_compact_opp_text">STND</div>\
            <div id="scoreboard_compact_opp_left_nib_shadow"></div>\
            <div id="scoreboard_compact_opp_back_bar_shadow"></div>\
            <div id="scoreboard_compact_opp_right_nib_shadow"></div>\
            <div id="scoreboard_compact_opp_left_nib"></div>\
            <div id="scoreboard_compact_opp_back_bar"></div>\
            <div id="scoreboard_compact_opp_right_nib"></div>\
            <div id="scoreboard_compact_opp_fill_bar"></div>\
            <img id="scoreboard_compact_opp_peg" src="shared/images/PegRed.png" ondragstart="return false;" />\
            <div id="scoreboard_compact_opp_score_container">\
                <div id="scoreboard_compact_opp_score">0</div>\
            </div>\
        </div>\
    </div>\
    \
    <div id="cards_region">\
        <div id="crib_indicator_card_overlap">\
            <table style="width: 114px; margin-top: 5px;">\
                <tr>\
                    <td id="crib_indicator_card_overlap_text">Your</td>\
                </tr>\
                <tr>\
                    <td>Crib</td>\
                </tr>\
            </table>\
        </div>\
        <div id="PeggingCountIndicator">\
            <div id="PeggingCountCardShadow"></div>\
            <div id="PeggingCountCard">\
                <table style="width: 114px; margin-top: 5px;">\
                    <tr>\
                        <td>\
                            <div>Pegging Count:</div>\
                        </td>\
                    </tr>\
                    <tr>\
                        <td>\
                            <div id="PeggingCountIndicatorScore">14</div>\
                        </td>\
                    </tr>\
                </table>\
            </div>\
        </div>\
    </div>\
    \
    <div id="adView" align="center"></div>\
    \
    <div id="low_card_result_message">\
        <div id="low_card_result_text">You drew the lower card!\
            <br>You get the first crib.</div>\
        <center>\
            <button id="low_card_selected_accept_button" onclick="game.lowCardAcceptClick()">OK</button>\
        </center>\
    </div>\
    \
    <div id="no_hint_view">\
        <div id="no_hint_view_shadow"></div>\
        <div id="no_hint_view_card">\
            <table style="width: 200px;">\
                <tr>\
                    <td>\
                        <div>No optimal play detected.</div>\
                    </td>\
                </tr>\
                <tr>\
                    <td>\
                        <div>Go with your gut!</div>\
                    </td>\
                </tr>\
                <tr>\
                    <td>\
                        <button id="no_hint_view_button" onclick="game.OnNoHintAcceptedClick()">OK</button>\
                    </td>\
                </tr>\
            </table>\
        </div>\
    </div>\
    \
    <div id="computer_says_go">\
        <div id="computer_says_go_shadow"></div>\
        <div id="computer_says_go_card">\
            <table style="width: 114px;">\
                <tr>\
                    <td>\
                        <div>Computer says</div>\
                    </td>\
                </tr>\
                <tr>\
                    <td>\
                        <div id="computer_says_go_text">\'GO\'</div>\
                    </td>\
                </tr>\
            </table>\
        </div>\
    </div>\
    <div id="player_says_go">\
        <div id="player_says_go_shadow"></div>\
        <div id="player_says_go_card">\
            <table style="width: 114px;">\
                <tr>\
                    <td>\
                        <div>You must say</div>\
                    </td>\
                </tr>\
                <tr>\
                    <td>\
                        <button id="player_says_go_button" onclick="game.OnUserSaysGoClick()">GO</button>\
                    </td>\
                </tr>\
            </table>\
        </div>\
    </div>\
    \
    <div id="allcounted">\
        <table style="width: 114px;">\
            <tr>\
                <td>\
                    <div>All points are already counted.</div>\
                </td>\
            </tr>\
            <tr>\
                <td>\
                    <button id="allcountedOKButton" onclick="game.OnAllCountedOKClick()">OK</button>\
                </td>\
            </tr>\
        </table>\
    </div>\
    \
    <div id="HandScoreView">\
        <div id="HandScoreTitle">Opponent hand:</div>\
        <div id="HandScoreBubble">\
            <div id="HandScoreBubbleGlare"></div>\
            <div id="HandScoreBubbleBottomGlare"></div>\
            <div id="HandScoreBubblePoints">1</div>\
            <div id="HandScoreBubblePointsLabel">points</div>\
        </div>\
        <div id="HandScorePointsDescription">Run of 3 for 3</div>\
        <button id="HandScoreAcceptButton" onclick="game.OnAcceptHandScoreClick()">OK</button>\
    </div>\
    \
    <div id="RecountHandsView">\
        <button id="RecountHandsButton" onclick="game.OnRecountButtonClick()">\
            <img id="RecountHandsButtonImage" src="shared/images/RefreshButton.png" ondragstart="return false;" />\
        </button>\
        <div id="RecountHandsText">Reshow<br>count</div>\
    </div>\
    \
    <div id="ManualCount">\
        <div id="HandScoreBubble">\
            <div id="HandScoreBubbleGlare"></div>\
            <div id="HandScoreBubbleBottomGlare"></div>\
            <div id="ManualScoreBubblePoints">0</div>\
            <div id="HandScoreBubblePointsLabel">points</div>\
        </div>\
        <button id="ManualCountAcceptButton" onclick="game.OnManualCountAcceptClick()">Click here when<br>finished counting</button>\
        <div id="ManualPointsDesc"></div>\
        <button id="ManualPointConfirmButton" onclick="game.OnManualPointConfirmClick()">Click here to add:<br>15 for 2</button>\
    </div>\
    \
    <div id="SuboptimalWarning">\
        <div id="SuboptimalWarningTitle">That is not the<br>optimal discard</div>\
        <div id="SuboptimalWarningTextRegion">\
            <div id="SuboptimalWarningText">Your discards will result in an average round score of 0.0\
                <br>\
                <br>A better play exists that would result in an average score of 0.0</div>\
        </div>\
        <button class="SuboptimalWarningButton" onclick="game.SuboptimalWarningTryAgainClick()">OK, let me try again</button>\
        <button class="SuboptimalWarningButton" onclick="game.SuboptimalWarningShowAllScoresClick()" id="SuboptimalWarningShowAllScoresButton">Show scores for all plays</button>\
        <button class="SuboptimalWarningButton" onclick="game.SuboptimalWarningHintClick()">Give me a hint</button>\
        <button class="SuboptimalWarningButton" onclick="game.SuboptimalWarningPlayAnywaysClick()" id="SuboptimalWarningPlayAnywaysButton">Play these cards anyways</button>\
    </div>\
    \
    <div id="GameOverView">\
        <div id="GameOverResultText">You win!</div>\
        <div id="GameOverSkunkText">Skunk!</div>\
        <button id="game_over_close_button" class="close_button" onclick="game.GameOverClosedClick()">X</button>\
        \
        <table id="GameOverResultsTable">\
            <tr>\
                <td></td>\
                <td style="width:100px">You</td>\
                <td style="width:100px">Opponent</td>\
            </tr>\
            <tr>\
                <td>Total score:</td>\
                <td colspan="2" style="position: absolute; width:200px; height:25px;">\
                    <div class="GameOverViewTableResultBackgroundFill"></div>\
                    <div id="GameOverTotalFill" class="GameoverViewTableResultComputerFill"></div>\
                    <div id="GameOverTotalScoreYou" class="GameOverViewTableResultYouScore" style="font-weight:bold; font-size:16pt;">107</div>\
                    <div id="GameOverTotalScoreOpp" class="GameOverViewTableResultOppScore" style="font-weight:bold; font-size:16pt;">128</div>\
                </td>\
            </tr>\
            <tr>\
                <td>Pegging:</td>\
                <td colspan="2" style="position: absolute; width:200px; height:25px;">\
                    <div class="GameOverViewTableResultBackgroundFill"></div>\
                    <div id="GameOverPeggingFill" class="GameoverViewTableResultComputerFill"></div>\
                    <div id="GameOverPeggingYou" class="GameOverViewTableResultYouScore">107</div>\
                    <div id="GameOverPeggingOpp" class="GameOverViewTableResultOppScore">128</div>\
                </td>\
            </tr>\
            <tr>\
                <td>Hands:</td>\
                <td colspan="2" style="position: absolute; width:200px; height:25px;">\
                    <div class="GameOverViewTableResultBackgroundFill"></div>\
                    <div id="GameOverHandsFill" class="GameoverViewTableResultComputerFill"></div>\
                    <div id="GameOverHandsYou" class="GameOverViewTableResultYouScore">107</div>\
                    <div id="GameOverHandsOpp" class="GameOverViewTableResultOppScore">128</div>\
                </td>\
            </tr>\
            <tr>\
                <td>Cribs:</td>\
                <td colspan="2" style="position: absolute; width:200px; height:25px;">\
                    <div class="GameOverViewTableResultBackgroundFill"></div>\
                    <div id="GameOverCribsFill" class="GameoverViewTableResultComputerFill"></div>\
                    <div id="GameOverCribsYou" class="GameOverViewTableResultYouScore">107</div>\
                    <div id="GameOverCribsOpp" class="GameOverViewTableResultOppScore">128</div>\
                </td>\
            </tr>\
        </table>\
        \
        <button id="GameOverSuboptimalButton" onclick="game.ShowSuboptimalHistoryButtonClick()">You made 6 suboptimal plays this game for a cummultaive error of 10.1 points.</button>\
        \
        <div id="GameOverSuboptimalPlaysView"></div>\
    </div>\
    \
    <div id="GameOverSuboptimalHeaderTemplate" class="GameOverSuboptimalHeader">Sub-Optimal Discard Plays</div>\
    <div id="GameOverSuboptimalDiscardTemplate" class="GameOverSuboptimalDiscard" onclick="game.ShowAllPlaysForSuboptimalPlayView(this)">\
        <div class="suboptimalSituation">Hand dealt - Opp. crib</div>\
        <div class="tinycard" id="subTiny1" style="left:0px; margin-top:18px;"></div>\
        <div class="tinycard" id="subTiny2" style="left:22px; margin-top:18px;"></div>\
        <div class="tinycard" id="subTiny3" style="left:44px; margin-top:18px;"></div>\
        <div class="tinycard" id="subTiny4" style="left:66px; margin-top:18px;"></div>\
        <div class="tinycard" id="subTiny5" style="left:88px; margin-top:18px;"></div>\
        <div class="tinycard" id="subTiny6" style="left:110px; margin-top:18px;"></div>\
        <div class="suboptimalYouPlayed">You played</div>\
        <div class="tinycard" id="subTiny7" style="left:145px; margin-top:18px;"></div>\
        <div class="tinycard" id="subTiny8" style="left:167px; margin-top:18px;"></div>\
        <div class="suboptimalPlayedLine1">avg</div>\
        <div class="suboptimalPlayedLine2">1.9</div>\
        <div class="suboptimalPlayedLine3">points</div>\
        <div class="suboptimalOptimalPlay">Optimal play</div>\
        <div class="tinycard" id="subTiny9" style="left:240px; margin-top:18px;"></div>\
        <div class="tinycard" id="subTiny10" style="left:262px; margin-top:18px;"></div>\
        <div class="suboptimalOptimalLine1">avg</div>\
        <div class="suboptimalOptimalLine2">1.9</div>\
        <div class="suboptimalOptimalLine3">points</div>\
        <div class="suboptimalDivider"></div>\
    </div>\
    \
    <div id="BubbleScorePlayerTemplate" class="BubbleScorePlayer">\
        <div class="BubbleScoreGlare"></div>\
        <div class="BubbleScoreBottomGlare"></div>\
        <table style="width: 100px; margin-top: 5px;">\
            <tr>\
                <td class="BubbleScoreDescription">Run of 4 for</td>\
            </tr>\
            <tr>\
                <td class="BubbleScorePoints">29</td>\
            </tr>\
            <tr>\
                <td class="BubbleScorePointsLabel">points</td>\
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
        <button id="settings_button" class="menu_button" onclick="game.ShowSettingsMenu()">Settings</button>\
        <button id="statistics_button" class="menu_button" onclick="game.ShowStatisticsMenu()">Statistics</button>\
        <button id="discard_analyzer_button" class="menu_button" onclick="game.ShowDiscardAnalyzer()">Discard Analyzer</button>\
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
            For all three difficulty levels the cards are dealt completely at random to both you and to the computer. The difference\
            between the easy, standard and pro levels is the strategy used to choose the computer\'s discards and pegging plays. If\
            you are finding that your computer opponent is beating you, you will likely benefit from understanding how the computer\
            chooses its next move.\
            <br>\
            <br>\
            <center>\
                <div style="font-size:16pt">\
                    <u>Easy Computer Strategy</u>\
                </div>\
            </center>\
            <table style="width:100%; text-align:left; font-size:12pt;">\
                <tr>\
                    <td valign="top" width="80pt">Discarding:</td>\
                    <td>Chooses a random pair of cards.</td>\
                </tr>\
                <tr>\
                    <td valign="top" width="80pt">Pegging:</td>\
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
                    <td valign="top" width="80pt">Discarding:</td>\
                    <td>Chooses the pair of cards that will result in the best hand score ignoring the possible flip card. If the discards are\
                        a pair or sum to 15, it adjusts the analyzed hand value by 2 (plus or minus depending on the crib owner.) Notice that\
                        this strategy does not account for flushes or possible runs that could result from the flip card.</td>\
                </tr>\
                <tr>\
                    <td valign="top" width="80pt">Pegging:</td>\
                    <td>Chooses the next card that will result in the highest score for itself. If all plays are of equal value then it chooses\
                        at random.</td>\
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
                    <td valign="top" width="80pt">Discarding:</td>\
                    <td>Evaluates the score for each pair of discards for all possible flip cards still left in the deck. Then takes the play\
                        that averages the highest outcome. For the cards in the crib, evaluates their value as well with each possible flip\
                        card and adds or subtracts depending on who will count the crib. Note that the potential from the two additional crib\
                        cards are not included in the crib analysis.</td>\
                </tr>\
                <tr>\
                    <td valign="top" width="80pt">Pegging:</td>\
                    <td>Chooses the next card that will result in the highest score for itself. It also prefers not to leave the pegging count\
                        at 5 or 21. If all plays are of equal value then it chooses at random.</td>\
                </tr>\
            </table>\
        </div>\
    </div>\
    \
    <div id="menu_settings" class="menu_view">\
        <div id="menu_settings_title" class="menu_card_title">Settings</div>\
        <button id="menu_settings_close_button" class="close_button" onclick="menu_card_close_click()">X</button>\
        <div id="menu_settings_body">\
            <table style="margin-left:5%; width:95%; margin-bottom: 10px; text-align:left; font-size:16pt;">\
                <tr>\
                    <td>Manually count scores:</td>\
                    <td>\
                        <label class="switch">\
                            <input id="setting_manually_count_scores_checkbox" type="checkbox" onclick="game.SettingManuallyCountScoresClicked(this)">\
                            <span class="slider round"></span>\
                        </label>\
                    </td>\
                </tr>\
                <tr>\
                    <td>Muggins:</td>\
                    <td>\
                        <label class="switch">\
                            <input id="setting_muggins_checkbox" type="checkbox" onclick="game.SettingMugginsClicked(this)">\
                            <span class="slider round"></span>\
                        </label>\
                    </td>\
                </tr>\
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
                    <td>Warn of suboptimal plays:</td>\
                    <td>\
                        <label class="switch">\
                            <input id="setting_warn_suboptimal_checkbox" type="checkbox" onclick="game.SettingWarnSuboptimalClicked(this)">\
                            <span class="slider round"></span>\
                        </label>\
                    </td>\
                </tr>\
                <tr>\
                    <td>Fast counting:</td>\
                    <td>\
                        <label class="switch">\
                            <input id="setting_fast_count_checkbox" type="checkbox" onclick="game.SettingFastCountClicked(this)">\
                            <span class="slider round"></span>\
                        </label>\
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
                <td class="menu_statistics_table_category">Losses</td>\
                <td class="menu_statistics_table_stat" id="menu_stat_losses_Easy"></td>\
                <td class="menu_statistics_table_stat" id="menu_stat_losses_Standard"></td>\
                <td class="menu_statistics_table_stat" id="menu_stat_losses_Pro"></td>\
                <td class="menu_statistics_table_stat_total" id="menu_stat_losses_Total">0</td>\
            </tr>\
            <tr>\
                <td class="menu_statistics_table_category">Skunk Wins</td>\
                <td class="menu_statistics_table_stat" id="menu_stat_skunks_Easy"></td>\
                <td class="menu_statistics_table_stat" id="menu_stat_skunks_Standard"></td>\
                <td class="menu_statistics_table_stat" id="menu_stat_skunks_Pro"></td>\
                <td class="menu_statistics_table_stat_total" id="menu_stat_skunks_Total">0</td>\
            </tr>\
            <tr>\
                <td class="menu_statistics_table_category">Win Percentage</td>\
                <td class="menu_statistics_table_stat" id="menu_stat_win_percent_Easy"></td>\
                <td class="menu_statistics_table_stat" id="menu_stat_win_percent_Standard"></td>\
                <td class="menu_statistics_table_stat" id="menu_stat_win_percent_Pro"></td>\
                <td class="menu_statistics_table_stat_total" id="menu_stat_win_percent_Total"></td>\
            </tr>\
            <tr>\
                <td class="menu_statistics_table_category">Avg Pegging Score</td>\
                <td class="menu_statistics_table_stat" id="menu_stat_pegging_Easy"></td>\
                <td class="menu_statistics_table_stat" id="menu_stat_pegging_Standard"></td>\
                <td class="menu_statistics_table_stat" id="menu_stat_pegging_Pro"></td>\
                <td class="menu_statistics_table_stat_total" id="menu_stat_pegging_Total">0</td>\
            </tr>\
            <tr>\
                <td class="menu_statistics_table_category">Avg Hand Score</td>\
                <td class="menu_statistics_table_stat" id="menu_stat_hands_Easy"></td>\
                <td class="menu_statistics_table_stat" id="menu_stat_hands_Standard"></td>\
                <td class="menu_statistics_table_stat" id="menu_stat_hands_Pro"></td>\
                <td class="menu_statistics_table_stat_total" id="menu_stat_hands_Total">0</td>\
            </tr>\
            <tr>\
                <td class="menu_statistics_table_category">Avg Crib Score</td>\
                <td class="menu_statistics_table_stat" id="menu_stat_cribs_Easy"></td>\
                <td class="menu_statistics_table_stat" id="menu_stat_cribs_Standard"></td>\
                <td class="menu_statistics_table_stat" id="menu_stat_cribs_Pro"></td>\
                <td class="menu_statistics_table_stat_total" id="menu_stat_cribs_Total">0</td>\
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
                <td>\
                    <center>\
                        <button id="menu_statistics_suboptimal_history_button" onclick="game.ShowSuboptimalHistoryButtonClick()">Suboptimal<br>Play History</button>\
                    </center>\
                </td>\
            </tr>\
        </table>\
    </div>\
    \
    <div id="menu_tutorial" class="menu_view">\
        <div id="menu_tutorial_title" class="menu_card_title">Tutorial</div>\
        <button id="menu_tutorial_close_button" class="close_button" onclick="menu_card_close_click()">X</button>\
        \
        <div id="mtContainer">\
            <div id="mtPager">\
                    <div class="mtp" id="mt0">\
                        <center>\
                            <div>Page 1 of 7</div>\
                            <div style="margin-top:30px">Cribbage is a simple two person card game.</div>\
                            <img src="shared/images/Card_Club_Jack.jpg" style="width:57px; border-radius:3.5px; margin-top:10px;"/>\
                            <img src="shared/images/Card_Heart_Jack.jpg" style="width:57px; border-radius:3.5px;"/>\
                            <img src="shared/images/Card_Spade_Jack.jpg" style="width:57px; border-radius:3.5px;"/>\
                            <img src="shared/images/Card_Diamond_Jack.jpg" style="width:57px; border-radius:3.5px;"/>\
                            <div style="margin-left:30px; margin-right:30px; margin-top:20px; text-align:left;">The game involves scoring points by playing and grouping cards into pairs, runs, and combinations of cards that sum to fifteen.<br><br>To use this tutorial, click on the arrows on the side of this panel.</div>\
                        </center>\
                    </div>\
                    <div class="mtp" id="mt1">\
                        <center>\
                            <div>Page 2 of 7</div>\
                            <div style="margin-top:10px; margin-left:40px; margin-right:40px; margin-bottom:20px; text-align:left;">The winner of a game is the first person to score 121 points.<br><br>We keep track of the score using pegs.  Your peg is blue and the computer is red.</div>\
                            <div style="background: url(shared/images/woodboard.jpg); width: 200px; height: 50px; position:absolute; left: 100px;	">\
                                <img style="position:absolute; left: 10px; top: 13px;" src="shared/images/scoreboard_pegholes_horizontal.png"/>\
                                <img style="position:absolute; left: 100px; top: 13px;" src="shared/images/scoreboard_pegholes_horizontal.png"/>\
                                <img style="position:absolute; left: 0px; top: -10px;" src="shared/images/PegBlue.png"/>\
                                <img style="position:absolute; left: 48px; top: -10px;" src="shared/images/PegBlue.png"/>\
                                <img style="position:absolute; left: 0px; top: 5px;" src="shared/images/PegRed.png"/>\
                                <img style="position:absolute; left: 90px; top: 5px;" src="shared/images/PegRed.png"/>\
                            </div>\
                            <div style="margin-top:90px; margin-left:40px; margin-right:40px; margin-bottom:20px; text-align:left;">Each time you score points, your back peg will move ahead of your front peg.  There are 120 peg holes for each player so the first to get to the end of the path wins.</div>\
                        </center>\
                    </div>\
                    <div class="mtp" id="mt2">\
                        <center>\
                            <div>Page 3 of 7</div>\
                            <div style="margin-top:30px; margin-left:40px; margin-right:40px; margin-bottom:20px; text-align:left;">\
                                Cribbage is played in rounds and each round consists of four stages:\
                                <ol>\
                                    <li>Discarding into the crib</li>\
                                    <li>Pegging</li>\
                                    <li>Counting points in hand</li>\
                                    <li>Counting points in the crib</li>\
                                </ol>\
                            </div>\
                        </center>\
                    </div>\
                    <div class="mtp" id="mt3">\
                        <center>\
                            <div>Page 4 of 7</div>\
                            <div>Discarding</div>\
                            <div style="font-size:11pt; margin-top:3px; margin-left:40px; margin-right:40px; margin-bottom:3px; text-align:left;">\
                                At the beginning of the round, each player is dealt six cards and must choose two cards to discard into the crib.\
                            </div>\
                            <div style="background: url(shared/images/woodboard.jpg); width: 280px; height: 150px; position:absolute; left: 60px;	">\
                                <img style="position:absolute; left: 10px; top: 3px; width:45px; border-radius:3px;" src="shared/images/card_back_blue.jpg"/>\
                                <img style="position:absolute; left: 50px; top: 80px; width:45px; border-radius:3px;" src="shared/images/Card_Spade_2.jpg"/>\
                                <img style="position:absolute; left: 80px; top: 80px; width:45px; border-radius:3px;" src="shared/images/Card_Diamond_3.jpg"/>\
                                <img style="position:absolute; left: 120px; top: 80px; width:45px; border-radius:3px;" src="shared/images/Card_Heart_Jack.jpg"/>\
                                <img style="position:absolute; left: 150px; top: 80px; width:45px; border-radius:3px;" src="shared/images/Card_Club_Queen.jpg"/>\
                                <img style="position:absolute; left: 180px; top: 80px; width:45px; border-radius:3px;" src="shared/images/Card_Heart_King.jpg"/>\
                                <img style="position:absolute; left: 210px; top: 80px; width:45px; border-radius:3px;" src="shared/images/Card_Club_King.jpg"/>\
                                \
                                <div id="mtcr">\
                                    <div id="crib_region_top_left_side" class="mtcrb"></div>\
                                    <div id="crib_region_top_left_top" class="mtcrb"></div>\
                                    <div id="crib_region_top_right_top" class="mtcrb"></div>\
                                    <div id="crib_region_top_right_side" class="mtcrb"></div>\
                                    <div id="crib_region_bottom_right_side" class="mtcrb"></div>\
                                    <div id="crib_region_bottom_right_bottom" class="mtcrb"></div>\
                                    <div id="crib_region_bottom_left_bottom" class="mtcrb"></div>\
                                    <div id="crib_region_bottom_left_side" class="mtcrb"></div>\
                                </div>\
                            </div>\
                            <div style="font-size:11pt; margin-top:160px; margin-left:40px; margin-right:40px; margin-bottom:3px; text-align:left;">\
                                To discard, click on two cards or drag them to the center of the board.  Then click on the button that appears to confirm your discards.  The crib cards are then put aside to be counted later<br><br>Strategy: Keep in your hand cards that are pairs, runs, and groups that sum to 15.  All face cards are worth 10 and aces are worth 1.\
                            </div>\
                        </center>\
                    </div>\
                    <div class="mtp" id="mt4">\
                        <center>\
                            <div>Page 5 of 7</div>\
                            <div>Pegging</div>\
                            <div style="font-size:10pt; margin-top:3px; margin-left:20px; margin-right:20px; margin-bottom:10px; text-align:left;">\
                                Starting with whomever is not the dealer, each player lays one card face up in the center of the board.  The cumulative sum of the cards is tracked and play continues until neither player can play without putting the sum over 31.  At that point the cumulative sum is reset to zero and the same process is continued until both players have played all four of their cards.\
                            </div>\
                            <div style="font-size:10pt">During pegging points are awarded for:</div>\
                            <table style="font-size:10pt; text-align:center;">\
                                <tr>\
                                    <td>Cumulative sum of 15</td>\
                                    <td style="width:100px">2 points</td>\
                                </tr>\
                                <tr>\
                                    <td>Cumulative sum of 31</td>\
                                    <td>2 points</td>\
                                </tr>\
                                <tr>\
                                    <td>Last card below 31</td>\
                                    <td>1 point</td>\
                                </tr>\
                                <tr>\
                                    <td>Run of N Cards</td>\
                                    <td>N points</td>\
                                </tr>\
                                <tr>\
                                    <td>Pair</td>\
                                    <td>2 points</td>\
                                </tr>\
                                <tr>\
                                    <td>3 of a kind</td>\
                                    <td>6 points</td>\
                                </tr>\
                                <tr>\
                                    <td>4 of a kind</td>\
                                    <td>12 points</td>\
                                </tr>\
                            </table>\
                            <div style="font-size:10pt; margin-top:3px; margin-left:20px; margin-right:20px; margin-bottom:3px; text-align:left;">\
                                To get credit for a run the most recent played cards do not need to be played in order.  For example, if the last cards played were 2, 4, 3 then the person who played the 3 would get 3 points for a run.\
                            </div>\
                        </center>\
                    </div>\
                    <div class="mtp" id="mt5">\
                        <center>\
                            <div>Page 6 of 7</div>\
                            <div>Counting Hands</div>\
                            <div style="font-size:10pt; margin-top:3px; margin-left:20px; margin-right:20px; margin-bottom:10px; text-align:left;">\
                                Starting with whoever is not the dealer, each player counts the points that can be made using the cards in their hand and the one shared card that was flipped over on the top of the deck.	\
                            </div>\
                            <div style="font-size:10pt">When counting, points are awarded for:</div>\
                            <table style="font-size:10pt; text-align:center;">\
                                <tr>\
                                    <td>Set of cards sum to 15</td>\
                                    <td style="width:100px">2 points</td>\
                                </tr>\
                                <tr>\
                                    <td>Run of N Cards</td>\
                                    <td>N points</td>\
                                </tr>\
                                <tr>\
                                    <td>Pair</td>\
                                    <td>2 points</td>\
                                </tr>\
                                <tr>\
                                    <td>3 of a kind</td>\
                                    <td>6 points</td>\
                                </tr>\
                                <tr>\
                                    <td>4 of a kind</td>\
                                    <td>12 points</td>\
                                </tr>\
                                <tr>\
                                    <td>Flush (not including top card)</td>\
                                    <td>4 points</td>\
                                </tr>\
                                <tr>\
                                    <td>Flush (including top card)</td>\
                                    <td>5 points</td>\
                                </tr>\
                                <tr>\
                                    <td>Jack of top suit (Nobs)</td>\
                                    <td>1 point</td>\
                                </tr>\
                            </table>\
                            <div style="font-size:10pt; margin-top:3px; margin-left:20px; margin-right:20px; margin-bottom:3px; text-align:left;">\
                                By default, the game will count your hand for you.  However, you can change the settings to count manually.  Counting is done by clicking on each subset of cards that form points and then clicking on the submit button that appears.  Once all points have been counted tap the \'Finished Counting\' button to move on.  If \'Muggins\' is enabled, the computer player will get credit for any points that you miss.	\
                            </div>\
                        </center>\
                    </div>\
                    <div class="mtp" id="mt6">\
                        <center>\
                            <div>Page 7 of 7</div>\
                            <div>Counting the Crib</div>\
                            <div style="font-size:10pt; margin-top:3px; margin-left:20px; margin-right:20px; margin-bottom:10px; text-align:left;">\
                                After both players have counted the points in their hand, the dealer is given the crib cards (which were discarded at the start of the round.)  The points in the crib are counted using the same rules as for counting cards in hand.*	\
                            </div>\
                            <div style="font-size:10pt">When counting, points are awarded for:</div>\
                            <table style="font-size:10pt; text-align:center;">\
                                <tr>\
                                    <td>Set of cards sum to 15</td>\
                                    <td style="width:100px">2 points</td>\
                                </tr>\
                                <tr>\
                                    <td>Run of N Cards</td>\
                                    <td>N points</td>\
                                </tr>\
                                <tr>\
                                    <td>Pair</td>\
                                    <td>2 points</td>\
                                </tr>\
                                <tr>\
                                    <td>3 of a kind</td>\
                                    <td>6 points</td>\
                                </tr>\
                                <tr>\
                                    <td>4 of a kind</td>\
                                    <td>12 points</td>\
                                </tr>\
                                <tr>\
                                    <td>Flush (including top card)</td>\
                                    <td>5 points</td>\
                                </tr>\
                                <tr>\
                                    <td>Jack of top suit (Nobs)</td>\
                                    <td>1 point</td>\
                                </tr>\
                            </table>\
                            <div style="font-size:10pt; margin-top:23px; margin-left:20px; margin-right:20px; margin-bottom:3px; text-align:left;">\
                                *The only difference between hand scoring and crib scoring is that in order to get a flush in the crib, the top card on the deck must also match the suit of the flush.	\
                            </div>\
                        </center>\
                    </div>\
            </div>\
        </div>\
        <button id="mtIncButton" onclick="game.IncrementTutorial()">\
            <svg class="mtBSVG"><polygon points="0,0 20,20 0,40" style="fill:white;" /></sgv>\
        </button>\
        <button id="mtDecButton" onclick="game.DecrementTutorial()">	\
            <svg class="mtBSVG"><polygon points="20,0 20,40 0,20" style="fill:white;" /></sgv>\
        </button>\
    </div>\
    \
    <div id="menu_suboptimal_history" class="menu_view">\
        <div id="menu_suboptimal_title" class="menu_card_title">Suboptimal Play History</div>\
        <button id="menu_suboptimal_close_button" class="close_button" onclick="menu_card_close_click()">X</button>\
        <div id="msoDesc">When you are playing cribbage you will sometimes play suboptimal crib discards or suboptimal pegging cards.  This graph shows your cummulative suboptimal error count in average points for each game over time.</div>\
        <div id="msoNoHistory">After you finish your first game your history will appear here.</div>\
        <svg id="msoHistory"></svg>\
    </div>\
    \
    <div id="menu_discard_analyzer" class="menu_view">\
        <div id="discard_analyzer_title" class="menu_card_title">Discard Analyzer</div>\
        <button id="da_close_button" class="close_button" onclick="menu_card_close_click()">X</button>\
        <div id="daPrompt">Select 6 cards to analyze the optimal discard:</div>\
        <label class="daSwitch">\
            <input id="da_crib_checkbox" type="checkbox" onclick="game.daCribSwitched(this)">\
            <span class="slider round"></span>\
        </label>\
        <div id="daCribIndicatorText">Your Crib</div>\
        <div style="width:100%; height:1px; background:white;"></div>\
        <table>\
            <tr>\
                <td class="daCardCell" id="daCardCell_AD" onclick="game.daCardCellClick(this, \'AD\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Diamond_Ace.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_2D" onclick="game.daCardCellClick(this, \'2D\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Diamond_2.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_3D" onclick="game.daCardCellClick(this, \'3D\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Diamond_3.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_4D" onclick="game.daCardCellClick(this, \'4D\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Diamond_4.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_5D" onclick="game.daCardCellClick(this, \'5D\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Diamond_5.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_6D" onclick="game.daCardCellClick(this, \'6D\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Diamond_6.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_7D" onclick="game.daCardCellClick(this, \'7D\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Diamond_7.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_8D" onclick="game.daCardCellClick(this, \'8D\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Diamond_8.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_9D" onclick="game.daCardCellClick(this, \'9D\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Diamond_9.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_TD" onclick="game.daCardCellClick(this, \'TD\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Diamond_10.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_JD" onclick="game.daCardCellClick(this, \'JD\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Diamond_Jack.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_QD" onclick="game.daCardCellClick(this, \'QD\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Diamond_Queen.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_KD" onclick="game.daCardCellClick(this, \'KD\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Diamond_King.jpg);"></div>\
                </td>\
            </tr>\
            <tr>\
                <td class="daCardCell" id="daCardCell_AC" onclick="game.daCardCellClick(this, \'AC\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Club_Ace.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_2C" onclick="game.daCardCellClick(this, \'2C\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Club_2.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_3C" onclick="game.daCardCellClick(this, \'3C\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Club_3.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_4C" onclick="game.daCardCellClick(this, \'4C\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Club_4.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_5C" onclick="game.daCardCellClick(this, \'5C\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Club_5.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_6C" onclick="game.daCardCellClick(this, \'6C\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Club_6.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_7C" onclick="game.daCardCellClick(this, \'7C\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Club_7.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_8C" onclick="game.daCardCellClick(this, \'8C\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Club_8.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_9C" onclick="game.daCardCellClick(this, \'9C\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Club_9.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_TC" onclick="game.daCardCellClick(this, \'TC\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Club_10.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_JC" onclick="game.daCardCellClick(this, \'JC\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Club_Jack.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_QC" onclick="game.daCardCellClick(this, \'QC\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Club_Queen.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_KC" onclick="game.daCardCellClick(this, \'KC\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Club_King.jpg);"></div>\
                </td>\
            </tr>\
            <tr>\
                <td class="daCardCell" id="daCardCell_AH" onclick="game.daCardCellClick(this, \'AH\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Heart_Ace.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_2H" onclick="game.daCardCellClick(this, \'2H\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Heart_2.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_3H" onclick="game.daCardCellClick(this, \'3H\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Heart_3.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_4H" onclick="game.daCardCellClick(this, \'4H\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Heart_4.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_5H" onclick="game.daCardCellClick(this, \'5H\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Heart_5.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_6H" onclick="game.daCardCellClick(this, \'6H\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Heart_6.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_7H" onclick="game.daCardCellClick(this, \'7H\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Heart_7.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_8H" onclick="game.daCardCellClick(this, \'8H\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Heart_8.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_9H" onclick="game.daCardCellClick(this, \'9H\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Heart_9.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_TH" onclick="game.daCardCellClick(this, \'TH\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Heart_10.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_JH" onclick="game.daCardCellClick(this, \'JH\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Heart_Jack.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_QH" onclick="game.daCardCellClick(this, \'QH\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Heart_Queen.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_KH" onclick="game.daCardCellClick(this, \'KH\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Heart_King.jpg);"></div>\
                </td>\
            </tr>\
            <tr>\
                <td class="daCardCell" id="daCardCell_AS" onclick="game.daCardCellClick(this, \'AS\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Spade_Ace.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_2S" onclick="game.daCardCellClick(this, \'2S\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Spade_2.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_3S" onclick="game.daCardCellClick(this, \'3S\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Spade_3.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_4S" onclick="game.daCardCellClick(this, \'4S\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Spade_4.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_5S" onclick="game.daCardCellClick(this, \'5S\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Spade_5.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_6S" onclick="game.daCardCellClick(this, \'6S\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Spade_6.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_7S" onclick="game.daCardCellClick(this, \'7S\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Spade_7.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_8S" onclick="game.daCardCellClick(this, \'8S\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Spade_8.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_9S" onclick="game.daCardCellClick(this, \'9S\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Spade_9.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_TS" onclick="game.daCardCellClick(this, \'TS\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Spade_10.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_JS" onclick="game.daCardCellClick(this, \'JS\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Spade_Jack.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_QS" onclick="game.daCardCellClick(this, \'QS\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Spade_Queen.jpg);"></div>\
                </td>\
                <td class="daCardCell" id="daCardCell_KS" onclick="game.daCardCellClick(this, \'KS\')">\
                    <div class="daTinyCard" style="background:url(shared/images/Card_Spade_King.jpg);"></div>\
                </td>\
            </tr>\
        </table>\
        <div style="width:100%; height:1px; background:white; float:left;"></div>\
        <div style="width:100%; background:#BB0000; float:left">\
            <center>\
                <div id="daHandCardsLabel">Hand Cards:</div>\
            </center>\
            <table id="daHandTable" cellpadding="0">\
                <tr>\
                    <td class="daCardHandCell">\
                        <div class="daTinyHandCard" id="daHandCard0"></div>\
                    </td>\
                    <td class="daCardHandCell">\
                        <div class="daTinyHandCard" id="daHandCard1"></div>\
                    </td>\
                    <td class="daCardHandCell">\
                        <div class="daTinyHandCard" id="daHandCard2"></div>\
                    </td>\
                    <td class="daCardHandCell">\
                        <div class="daTinyHandCard" id="daHandCard3"></div>\
                    </td>\
                    <td class="daCardHandCell">\
                        <div class="daTinyHandCard" id="daHandCard4"></div>\
                    </td>\
                    <td class="daCardHandCell">\
                        <div class="daTinyHandCard" id="daHandCard5"></div>\
                    </td>\
                </tr>\
            </table>\
        </div>\
        <div style="width:100%; height:1px; background:white; float:left;"></div>\
        <table>\
            <tr>\
                <td id="daOptimalCell">\
                    <button class="daButton" id="daOptimalButton" onclick="game.daOptimalButtonClick()">\
                        <div id="daOptimalScoreTextTop">Optimal Discard</div>\
                        <center>\
                            <table>\
                                <tr>\
                                    <td>\
                                        <div class="daTinyCard" id="daOptimalCardView1" style="background:url(shared/images/Card_Spade_Queen.jpg);"></div>\
                                    </td>\
                                    <td>\
                                        <div class="daTinyCard" id="daOptimalCardView2" style="background:url(shared/images/Card_Spade_Queen.jpg);"></div>\
                                    </td>\
                                </tr>\
                            </table>\
                        </center>\
                        <div id="daOptimalScoreText">avg score: 0.0 pts</div>\
                    </button>\
                </td>\
                <td id="daAllPlaysCell">\
                    <button class="daButton" id="daAllPlaysButton" onclick="game.daAllPlaysButtonClick()">Analyze all possible discard plays</button>\
                </td>\
            </tr>\
        </table>\
    </div>\
    \
    <div id="menu_allplays" class="menu_view">\
        <div id="menu_allplays_title" class="menu_card_title">All Plays</div>\
        <button id="mallpcb" class="close_button" onclick="menu_card_close_click()">X</button>	\
        <div id="mallpd">By analyzing all possible flipped top cards we can find the min, max, and average amount of points that each set of discards will yield.  Click on any row to see a more in depth analysis.</div>\
        <div id="mallplist"></div>\
    </div>\
    \
    <div id="mallpcelltemplate" class="mallpcell" onclick="game.mallcellClick(this)">\
        <div class="mallpcribtitle">Crib</div>\
        <div class="tinycard" style="left:22px; margin-top:20px;"></div>\
        <div class="tinycard" style="left:42px; margin-top:20px;"></div>\
        \
        <div class="mallphandtitle">Hand</div>\
        <div class="tinycard" style="left:75px; margin-top:20px;"></div>\
        <div class="tinycard" style="left:97px; margin-top:20px;"></div>\
        <div class="tinycard" style="left:119px; margin-top:20px;"></div>\
        <div class="tinycard" style="left:141px; margin-top:20px;"></div>\
        \
        <div class="mallpmintitle">Min.</div>\
        <div class="mallpminpts">-2</div>\
        \
        <div class="mallpmaxtitle">Max.</div>\
        <div class="mallpmaxpts">24</div>\
        \
        <div class="mallpbubble">\
            <div class="mallpGlare"></div>\
            <div class="mallpBottomGlare"></div>\
            <div class="mallpavgtitle">Avg.</div>\
            <div class="mallpBubblePoints">12.34</div>\
            <div class="mallpBubblePointsLabel">points</div>\
        </div>\
        \
        <div class="mallpPlayed">You made this play</div>\
        \
        <div class="mallpDivider"></div>\
    </div>\
    \
    <div id="menu_handAnalysis" class="menu_view">\
        <div class="menu_card_title">Discard Analysis</div>\
        <button id="mhaclosebutton" class="close_button" onclick="menu_card_close_click()">X</button>	\
        \
        <div id="mhahandtitle">Your hand</div>\
        <div class="tinycard" id="mhacard0" style="left:166px; margin-top:65px;"></div>\
        <div class="tinycard" id="mhacard1" style="left:188px; margin-top:65px;"></div>\
        <div class="tinycard" id="mhacard2" style="left:210px; margin-top:65px;"></div>\
        <div class="tinycard" id="mhacard3" style="left:232px; margin-top:65px;"></div>\
        \
        <div id="mhacribtitle">Your crib</div>\
        <div class="tinycard" id="mhacard4" style="right:48px; margin-top:63px; transform: scale(0.7);"></div>\
        <div class="tinycard" id="mhacard5" style="right:32px; margin-top:63px; transform: scale(0.7);"></div>\
        <div id="mhacribpoints">+2 pts</div>\
        \
        <div id="mhaplus">+</div>\
        <div id="mhainstructions">(Scroll to see the score for each possible flip card.)</div>\
        \
        <div id="mhaarrow" class="arrow-down"></div>\
        <div id="mhatopcards" onscroll="game.OnTopCardScroll()">\
            <div id="mhatopcardsContainer"></div>\
        </div>\
        <div id="mhatopcardsOverlayLeft"></div>\
        <div id="mhatopcardsOverlayRight"></div>\
        <div id="mhatotalScore">= 8 points</div>\
        <div id="mhaHistorgram"></div>\
        <div id="mhaMin">0</div>\
        <div id="mhaAvg">10</div>\
        <div id="mhaMax">24</div>\
        <div id="mhaMinLabel">Minimum<br>points</div>\
        <div id="mhaAvgLabel">Average<br>points</div>\
        <div id="mhaMaxLabel">Maximum<br>points</div>\
    </div>';

    var scoreboard = new CribbageScoreboard();
    
    var deckTopIndex = 0;
    var cards = [
        { id: 'AS', rank: 1, value: 1, suit: 'S', image: "url('shared/images/Card_Spade_Ace.jpg')" },
        { id: '2S', rank: 2, value: 2, suit: 'S', image: "url('shared/images/Card_Spade_2.jpg')" },
        { id: '3S', rank: 3, value: 3, suit: 'S', image: "url('shared/images/Card_Spade_3.jpg')" },
        { id: '4S', rank: 4, value: 4, suit: 'S', image: "url('shared/images/Card_Spade_4.jpg')" },
        { id: '5S', rank: 5, value: 5, suit: 'S', image: "url('shared/images/Card_Spade_5.jpg')" },
        { id: '6S', rank: 6, value: 6, suit: 'S', image: "url('shared/images/Card_Spade_6.jpg')" },
        { id: '7S', rank: 7, value: 7, suit: 'S', image: "url('shared/images/Card_Spade_7.jpg')" },
        { id: '8S', rank: 8, value: 8, suit: 'S', image: "url('shared/images/Card_Spade_8.jpg')" },
        { id: '9S', rank: 9, value: 9, suit: 'S', image: "url('shared/images/Card_Spade_9.jpg')" },
        { id: 'TS', rank: 10, value: 10, suit: 'S', image: "url('shared/images/Card_Spade_10.jpg')" },
        { id: 'JS', rank: 11, value: 10, suit: 'S', image: "url('shared/images/Card_Spade_Jack.jpg')" },
        { id: 'QS', rank: 12, value: 10, suit: 'S', image: "url('shared/images/Card_Spade_Queen.jpg')" },
        { id: 'KS', rank: 13, value: 10, suit: 'S', image: "url('shared/images/Card_Spade_King.jpg')" },
        { id: 'AD', rank: 1, value: 1, suit: 'D', image: "url('shared/images/Card_Diamond_Ace.jpg')" },
        { id: '2D', rank: 2, value: 2, suit: 'D', image: "url('shared/images/Card_Diamond_2.jpg')" },
        { id: '3D', rank: 3, value: 3, suit: 'D', image: "url('shared/images/Card_Diamond_3.jpg')" },
        { id: '4D', rank: 4, value: 4, suit: 'D', image: "url('shared/images/Card_Diamond_4.jpg')" },
        { id: '5D', rank: 5, value: 5, suit: 'D', image: "url('shared/images/Card_Diamond_5.jpg')" },
        { id: '6D', rank: 6, value: 6, suit: 'D', image: "url('shared/images/Card_Diamond_6.jpg')" },
        { id: '7D', rank: 7, value: 7, suit: 'D', image: "url('shared/images/Card_Diamond_7.jpg')" },
        { id: '8D', rank: 8, value: 8, suit: 'D', image: "url('shared/images/Card_Diamond_8.jpg')" },
        { id: '9D', rank: 9, value: 9, suit: 'D', image: "url('shared/images/Card_Diamond_9.jpg')" },
        { id: 'TD', rank: 10, value: 10, suit: 'D', image: "url('shared/images/Card_Diamond_10.jpg')" },
        { id: 'JD', rank: 11, value: 10, suit: 'D', image: "url('shared/images/Card_Diamond_Jack.jpg')" },
        { id: 'QD', rank: 12, value: 10, suit: 'D', image: "url('shared/images/Card_Diamond_Queen.jpg')" },
        { id: 'KD', rank: 13, value: 10, suit: 'D', image: "url('shared/images/Card_Diamond_King.jpg')" },
        { id: 'AC', rank: 1, value: 1, suit: 'C', image: "url('shared/images/Card_Club_Ace.jpg')" },
        { id: '2C', rank: 2, value: 2, suit: 'C', image: "url('shared/images/Card_Club_2.jpg')" },
        { id: '3C', rank: 3, value: 3, suit: 'C', image: "url('shared/images/Card_Club_3.jpg')" },
        { id: '4C', rank: 4, value: 4, suit: 'C', image: "url('shared/images/Card_Club_4.jpg')" },
        { id: '5C', rank: 5, value: 5, suit: 'C', image: "url('shared/images/Card_Club_5.jpg')" },
        { id: '6C', rank: 6, value: 6, suit: 'C', image: "url('shared/images/Card_Club_6.jpg')" },
        { id: '7C', rank: 7, value: 7, suit: 'C', image: "url('shared/images/Card_Club_7.jpg')" },
        { id: '8C', rank: 8, value: 8, suit: 'C', image: "url('shared/images/Card_Club_8.jpg')" },
        { id: '9C', rank: 9, value: 9, suit: 'C', image: "url('shared/images/Card_Club_9.jpg')" },
        { id: 'TC', rank: 10, value: 10, suit: 'C', image: "url('shared/images/Card_Club_10.jpg')" },
        { id: 'JC', rank: 11, value: 10, suit: 'C', image: "url('shared/images/Card_Club_Jack.jpg')" },
        { id: 'QC', rank: 12, value: 10, suit: 'C', image: "url('shared/images/Card_Club_Queen.jpg')" },
        { id: 'KC', rank: 13, value: 10, suit: 'C', image: "url('shared/images/Card_Club_King.jpg')" },
        { id: 'AH', rank: 1, value: 1, suit: 'H', image: "url('shared/images/Card_Heart_Ace.jpg')" },
        { id: '2H', rank: 2, value: 2, suit: 'H', image: "url('shared/images/Card_Heart_2.jpg')" },
        { id: '3H', rank: 3, value: 3, suit: 'H', image: "url('shared/images/Card_Heart_3.jpg')" },
        { id: '4H', rank: 4, value: 4, suit: 'H', image: "url('shared/images/Card_Heart_4.jpg')" },
        { id: '5H', rank: 5, value: 5, suit: 'H', image: "url('shared/images/Card_Heart_5.jpg')" },
        { id: '6H', rank: 6, value: 6, suit: 'H', image: "url('shared/images/Card_Heart_6.jpg')" },
        { id: '7H', rank: 7, value: 7, suit: 'H', image: "url('shared/images/Card_Heart_7.jpg')" },
        { id: '8H', rank: 8, value: 8, suit: 'H', image: "url('shared/images/Card_Heart_8.jpg')" },
        { id: '9H', rank: 9, value: 9, suit: 'H', image: "url('shared/images/Card_Heart_9.jpg')" },
        { id: 'TH', rank: 10, value: 10, suit: 'H', image: "url('shared/images/Card_Heart_10.jpg')" },
        { id: 'JH', rank: 11, value: 10, suit: 'H', image: "url('shared/images/Card_Heart_Jack.jpg')" },
        { id: 'QH', rank: 12, value: 10, suit: 'H', image: "url('shared/images/Card_Heart_Queen.jpg')" },
        { id: 'KH', rank: 13, value: 10, suit: 'H', image: "url('shared/images/Card_Heart_King.jpg')" }
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
    var cardHighlight = document.createElement("div");
    cardHighlight.className = "cardFrontHighlight";
    front.appendChild(cardHighlight);

    var cardBackURI = "url('shared/images/card_back_" + GetSetting('setting_card_color') + ".jpg')";

    for (var i = 0; i < cards.length; i++) {
        var newCard = cardElement.cloneNode(true);
        var card = cards[i];
        card.cardView = newCard;
        card.cardView.isSlidUp = false;
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

    this.FindOptimalCribDiscards = function (cards, isCribPositive) {
        return computerPlayer.FindOptimalCribDiscards(cards, isCribPositive);
    }

    this.GetScoreStatsForPossibleDiscards = function (trialCards, cribCards, isCribScorePositive) {
        return computerPlayer.GetScoreStatsForPossibleDiscards(trialCards, cribCards, isCribScorePositive);
    }

    this.GetScoreForCards = function (cards, topCard, isCrib) {
        return computerPlayer.GetScoreForCards(cards, topCard, isCrib);
    }

    function isGameOver() {
        return playerScore > 120 || computerScore > 120;
    }

    function isPlayerWon() {
        return playerScore > 120;
    }

    function isSkunkGame() {
        if (isPlayerWon()) {
            return computerScore < 91;
        } else {
            return playerScore < 91;
        }
    }

    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    function dragMouseDown(e) {
        e = e || window.event;

        if (!e.target.classList.contains('card')) {
            return;
        }

        if (currentMoveStage === 'WaitingForUserToSelectLowestCard') {
            var tappedCard = e.target.card;
            playerSelectedLowCardView = e.target;
            animateLowCardSelected(tappedCard.cardView);
            return;
        } else if (currentMoveStage === 'WaitingForUserToDiscardToCrib') {
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
                preCribCardPointerPressed(currentDraggedCardView);
            }
        } else if (currentMoveStage === 'WaitingForUserToPlayPeggingCard') {
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
                peggingCardPointerPressed(currentDraggedCardView);
            }
        } else if (currentMoveStage === 'WaitingForUserToManuallyCount') {
            var tappedCardView = e.target;
            if (tappedCardView.isClickable) {
                if (tappedCardView.isSlidUp) {
                    slideDownCard(tappedCardView);
                } else {
                    slideUpCard(tappedCardView);
                }
                AnalyzeSelectedCardsForManualCounting();
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

        if (currentMoveStage === 'WaitingForUserToDiscardToCrib') {
            preCribCardPointerMoved();
        } else if (currentMoveStage === 'WaitingForUserToPlayPeggingCard') {
            peggingCardPointerMoved();
        }
    }

    function closeDragElement() {
        // stop moving when mouse released
        if (currentMoveStage === 'WaitingForUserToDiscardToCrib') {
            preCribCardPointerFinished();
        } else if (currentMoveStage === 'WaitingForUserToPlayPeggingCard') {
            peggingCardPointerFinished();
        }
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
    
    function slideRaiseAndFlipUpCard(cardView) {
        var raiseContainer = cardView.firstChild;
        var flipContainer = raiseContainer.firstChild;
        var cardShadow = flipContainer.children[0];
        var cardBack = flipContainer.children[1];
        var cardFront = flipContainer.children[2];
        cardView.style.transition = "0.2s ease-in-out";
        cardView.style.transform = "translate(-155px, -81px)";
        setTimeout(function () {
            cardView.style.transform = "translate(-57px,-81px)";
            cardView.style.zIndex = 100;
        }, 250);
        setTimeout(function () {
            var ease = "0.7s ease-out";
            raiseContainer.style.transition = ease;
            flipContainer.style.transition = ease;
            cardBack.style.transition = ease;
            cardFront.style.transition = ease;
            cardShadow.style.transition = ease;
            raiseContainer.style.transform = "scale(1.15)";
            
            if (isIE) {
                cardFront.style.transform = "translate3d(0px,0px,1px) perspective(500px) rotateY(0deg)";
                cardBack.style.transform = "translate3d(0px,0px,-1px) perspective(500px) rotateY(-180deg)";
                cardShadow.style.transform = "translate3d(20px,20px,0px) perspective(500px) rotateY(0deg)";
            } else {
                flipContainer.style.transform = "perspective(500px) rotateY(180deg)";
                cardShadow.style.transform = "translate3d(-20px,20px,0px)";
            }
        }, 310);
    }

    function flipUpCard(cardView, animate) {
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

    function flipDownAndLowerCard(cardView, lowerDelay) {
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

        if (isIE) {
            cardFront.style.transform = "translate3d(0px,0px,1px) perspective(500px) rotateY(180deg)";
            cardBack.style.transform = "translate3d(0px,0px,1px) perspective(500px) rotateY(0deg)";
            cardShadow.style.transform = "translate3d(0px,0px,0px) perspective(500px) rotateY(180deg)";
            setTimeout(function () {
                raiseContainer.style.transform = "scale(1)";
                cardShadow.style.transform = "translate3d(0px,0px,0px) perspective(500px) rotateY(180deg)";
            }, lowerDelay);
        } else {
            flipContainer.style.transform = "perspective(500px) rotateY(0deg)";    
            setTimeout(function () {
                raiseContainer.style.transform = "scale(1)";
                cardShadow.style.transform = "translate3d(0px,0px,0px)";
            }, lowerDelay);
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

    function slideUpCard(cardView) {
        cardView.isSlidUp = true;
        cardView.style.transition = "0.2s ease-out";
        cardView.style.transform = "translate(-50%, -70%)";
    }

    function slideDownCard(cardView) {
        cardView.isSlidUp = false;
        cardView.style.transition = "0.2s ease-out";
        cardView.style.transform = "translate(-50%, -50%)";
    }

    function BumpCards(cards, delay) {
        setTimeout(function() {
            for (var i=0; i<cards.length; i++) {
                BumpCard(cards[i].cardView);
            }    
        }, delay);
    }

    function BumpCard(cardView) {
        cardView.addEventListener("animationend", function() {
            cardView.classList.remove('cribbage_bump');
        });
        cardView.classList.add('cribbage_bump');
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

    function ShakeMugginsView(mugginsView) {
        mugginsView.addEventListener("animationend", function() {
            mugginsView.classList.remove('mugshake');
        });
        mugginsView.classList.add('mugshake');    
    }

    function IndicateCustomDecisionCard(cardView) {
        var raiseContainer = cardView.firstChild;
        var flipContainer = raiseContainer.firstChild;
        var cardFront = flipContainer.children[2];
        var flashHighlight = cardFront.children[0];
        flashHighlight.classList.add('highlightCard');
        slideUpCard(cardView);
    }

    function RemoveCustomDecisionIndicator(cardView) {
        var raiseContainer = cardView.firstChild;
        var flipContainer = raiseContainer.firstChild;
        var cardFront = flipContainer.children[2];
        var flashHighlight = cardFront.children[0];
        flashHighlight.classList.remove('highlightCard');
        slideDownCard(cardView);
    }

    function AnimateScoreBubble(position, points, description, isPlayersPoints, delay) {

        setTimeout(function () {
            var bubbleTemplate = document.getElementById('BubbleScorePlayerTemplate');
            var scoreBubble = bubbleTemplate.cloneNode(true);
            if (isPlayersPoints) {
                scoreBubble.style.background = "rgb(0, 0, 190)";
            } else {
                scoreBubble.style.background = "rgb(190, 0, 0)";
            }
            scoreBubble.getElementsByClassName('BubbleScoreDescription')[0].innerText = description + " for";
            scoreBubble.getElementsByClassName('BubbleScorePoints')[0].innerText = points;
            var pointsLabel = scoreBubble.getElementsByClassName('BubbleScorePointsLabel')[0];
            if (points == 1) {
                pointsLabel.innerText = 'point';
            } else {
                pointsLabel.innerText = 'points';
            }
            var posLeft = position[0] - 50;
            var posTop = position[1] - 50;
            scoreBubble.style.opacity = 1;
            scoreBubble.style.transition = "none";
            scoreBubble.style.transform = 'scale(0)';
            scoreBubble.style.left = posLeft + "px";
            scoreBubble.style.top = posTop + "px";
            scoreBubble.style.zIndex = 500;
            scoreBubble.style.visibility = 'visible';

            var cards_region = document.getElementById('cards_region');
            cards_region.appendChild(scoreBubble);
            setTimeout(function () {
                scoreBubble.style.transition = "0.3s ease-in";
                scoreBubble.style.transform = 'scale(1)';
                setTimeout(function () {
                    scoreBubble.style.transition = "1s ease-in";
                    scoreBubble.style.top = posTop - 30 + 'px';
                    scoreBubble.style.opacity = 0;
                    setTimeout(function () {
                        cards_region.removeChild(scoreBubble);
                    }, 1000);
                }, 800);
            }, 50);
        }, delay);
    }

    function GetDeckCardPosition() {
        if (scoreboard.isCompact) {
            return [gameContainer.innerWidth * 0.15, 200];
        } else {
            return [gameContainer.innerWidth * 0.15, 315];
        }
    }

    function GetLeftLowCardPosition() {
        return [gameContainer.innerWidth * 0.5 - 110, GetDeckCardPosition()[1]];
    }

    function GetRightLowCardPosition() {
        return [gameContainer.innerWidth * 0.5 + 110, GetDeckCardPosition()[1]];
    }

    function GetDiscardRegionPosition() {
        return [gameContainer.innerWidth * 0.5, GetDeckCardPosition()[1]];
    }

    function GetCribWaitingPosition() {
        if (isPlayersCrib) {
            var handPos = GetHandCardPosition(true, false, 3);
            return [handPos[0] + cardLoweredWidth * 2, handPos[1]];
        } else {
            var handPos = GetHandCardPosition(false, false, 3);
            return [handPos[0] + cardLoweredWidth * 2, handPos[1]];
        }
    }

    function GetCribConfirmRegionPosition() {
        var position = GetDiscardRegionPosition();
        if (scoreboard.isCompact) {
            return [position[0], position[1] + cardLoweredHeight * 0.5 + 10];
        } else {
            return [position[0] + cardLoweredWidth + 80, position[1]];
        }
    }

    function GetPeggingFirstCardPosition() {
        var deckPosition = GetDeckCardPosition();
        var left = gameContainer.innerWidth * 0.4;
        if (left < deckPosition[0] + 130) {
            left = deckPosition[0] + 130;
        }
        return [left, deckPosition[1]];
    }

    function GetPeggingPromptPosition() {
        var nextCardPosition = GetPeggingFirstCardPosition();
        var left = nextCardPosition[0] + currentPeggingCards.length * peggingCardsOverlap;
        if (currentPeggingCards.length > 0) {
            left = left + 120;
        }
        if (left + 100 > gameContainer.innerWidth) {
            return [nextCardPosition[0] + currentPeggingCards.length * peggingCardsOverlap + 40, nextCardPosition[1] + cardLoweredHeight * 0.5 + 35];
        } else {
            return [left, nextCardPosition[1]];
        }
    }

    function GetManualPromptPosition() {
        var pos1 = GetHandCardPosition(true, false, 0);
        var pos2 = GetHandCardPosition(true, false, 3);
        var middle = (pos1[0] + pos2[0])/2;
        return [middle, pos1[1] - cardLoweredHeight*0.5 - 20];
    }

    function GetPeggingDeadPileFirstCardLeftPosition() {
        var left = gameContainer.innerWidth * 0.75;
        var peggingSpaceLeft = GetPeggingFirstCardPosition()[0] + 8 * peggingCardsOverlap + cardLoweredWidth * 0.5;
        if (left < peggingSpaceLeft) {
            left = gameContainer.innerWidth - cardLoweredWidth * 0.22;
        }
        return left;
    }

    function GetHandCardPosition(isPlayersCard, isPreCrib, cardIndex) {
        if (isPlayersCard) {
            var cardCount = 4;
            if (isPreCrib) {
                cardCount = 6;
            }
            var left = (gameContainer.innerWidth - cardLoweredWidth * cardCount - handCardsMaxSpacing * (cardCount - 1)) * 0.5;
            if (left < 0) {
                // We will have to overlap
                var overlapSpacing = gameContainer.innerWidth / cardCount - cardLoweredWidth;
                left = cardIndex * (cardLoweredWidth + overlapSpacing);
                currentPlayerHandCardSpacing = overlapSpacing;
            } else {
                left = left + cardIndex * (cardLoweredWidth + handCardsMaxSpacing)
                currentPlayerHandCardSpacing = handCardsMaxSpacing;
            }
            return [left + cardLoweredWidth * 0.5, GetDeckCardPosition()[1] + cardLoweredHeight + 60];
        } else {
            var cardCount = 4;
            if (isPreCrib) {
                cardCount = 6;
            }
            var left = (gameContainer.innerWidth - cardLoweredWidth * cardCount - computerCardsMaxSpacing * (cardCount - 1)) * 0.5;
            var leftMin = 200;
            var rightMin = cardLoweredWidth + 50;
            if (left < leftMin) {
                // We will have to overlap
                var overlapSpacing = (gameContainer.innerWidth - leftMin - rightMin) / cardCount - cardLoweredWidth;
                if (overlapSpacing < -100) {
                    overlapSpacing = -100;
                }
                currentComputerCardSpacing = overlapSpacing;
                left = leftMin;
            } else {
                currentComputerCardSpacing = computerCardsMaxSpacing;
            }
            left = left + cardIndex * (cardLoweredWidth + currentComputerCardSpacing);
            return [left + cardLoweredWidth * 0.5, GetDeckCardPosition()[1] - cardLoweredHeight - 20];
        }
    }

    function GetComputerHandCountingPosition(index) {
        if (scoreboard.isCompact) {
            var pos = GetHandCardPosition(false, false, index);
            return [pos[0], cardLoweredHeight * 0.75];
        } else {
            return GetHandCardPosition(false, false, index);
        }
    }

    function GetCardIndexFromPosition(isPreCrib, cardView) {
        var handLeft = GetHandCardPosition(true, isPreCrib, 0)[0];
        var index = Math.round((cardView.offsetLeft - handLeft) / (cardLoweredWidth + currentPlayerHandCardSpacing));
        if (isPreCrib) {
            if (index < 0) index = 0;
            if (index > 5) index = 5;
        } else {
            if (index < 0) index = 0;
            if (index > 3) index = 3;
        }

        return index;
    }

    function GetHandScoreViewPosition(isPlayersPoints) {
        if (isPlayersPoints) {
            if (scoreboard.isCompact) {
                return [gameContainer.innerWidth * 0.5 - 100, 50];
            } else {
                return [gameContainer.innerWidth * 0.5 - 100, gameContainer.innerHeight * 0.2];
            }
        } else {
            return [gameContainer.innerWidth * 0.5 - 100, gameContainer.innerHeight * 0.3];
        }
    }

    function GetManualCountViewPosition() {
        if (scoreboard.isCompact) {
            return [gameContainer.innerWidth * 0.5 - 100, 10];
        } else {
            return [gameContainer.innerWidth * 0.5 - 100, 100];
        }
    }

    function GetRecountButtonPosition(isPlayersPoints) {
        var deckPos = GetDeckCardPosition();
        if (isPlayersPoints) {
            if (scoreboard.isCompact) {
                return [gameContainer.innerWidth * 0.5 + 120, deckPos[1] + 70];
            } else {
                return [gameContainer.innerWidth * 0.5 + 120, deckPos[1]];
            }
        } else {
            return [gameContainer.innerWidth * 0.5 + 120, deckPos[1] + 70];
        }
    }

    function GetHintButtonPosition() {
        var checkPos = GetHandCardPosition(true, false, 0);
        var checkTop = checkPos[1] + cardLoweredHeight * 0.5 + 10;
        if (checkTop + 25 > gameContainer.innerHeight - 90) {
            var pos = GetDeckCardPosition();
            return [pos[0] - 35, pos[1] + cardLoweredHeight * 0.5 + 10];
        } else {
            return [gameContainer.innerWidth * 0.5 - 35, checkTop];
        }
    }

    CribbageGame.GetPeggingPointsForCards = function (peggingCards) {
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

    CribbageGame.GetPointsForHand = function (handCards, topCard, isCrib) {
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
            var subsetPoints = CribbageGame.GetSubsetPoints(subsets[i]);
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

    CribbageGame.GetSubsetPoints = function (subset) {
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

    this.ReturnAllCardsToDeck = function() {
        // Clean up all cards and messages
        for (var i = 0; i < cards.length; i++) {
            var el = cards[i].cardView;
            flipDownAndLowerCard(el, 0);
        }
        HideAllMessages();
        setTimeout(function() {
            for (var i = cards.length-1; i >= 0; i--) {
                var pos = GetDeckCardPosition();
                var cardView = cards[i].cardView;
                cardView.positionIndex = i;
                cardView.style.transition = "0.9s ease-in-out";
                cardView.style.transitionDelay = i*20 + "ms";
                with (cardView.style) {
                    left = pos[0] + "px";
                    top = pos[1] + "px";
                }
            }
        }, 200);
        
    }

    this.StartAGame = function (difficulty) {

        // Game properties
        skillLevel = difficulty;
        playerScore = 0;
        computerScore = 0;
        isPlayersCrib = false;
        playersHand = [];
        computersHand = [];
        crib = [];

        // Game stats
        computerPeggingPointsTotal = 0;
        playerPeggingPointsTotal = 0;
        computerHandPointsTotal = 0;
        playerHandPointsTotal = 0;
        computerCribPointsTotal = 0;
        playerCribPointsTotal = 0;
        suboptimalPlays = [];

        // Clean up all cards and messages
        for (var i = 0; i < cards.length; i++) {
            var el = cards[i].cardView;
            flipDownAndLowerCard(el, 0);
            slideDownCard(el);
        }
        HideAllMessages();

        scoreboard.Hide();
        scoreboard.SetOpponentName(difficulty);
        scoreboard.InitializeScore();

        AnimateSelectLowestCard();
    }

    function AnimateSelectLowestCard() {
        this.currentMoveStage = 'AnimatingSelectLowestCard';

        shuffle(cards);
        for (var i = 0; i < cards.length; i++) {
            var pos = GetDeckCardPosition();
            var cardView = cards[i].cardView;
            cardView.positionIndex = i;
            if (cardsAreVisible) {
                cardView.style.transition = "0.5s ease-in-out";
            }
            with (cardView.style) {
                left = cardsAreVisible ? pos[0] + "px" : "-150px";
                top = pos[1] + "px";
                zIndex = i + 1;
                visibility = "visible";
            }
        }

        cardsAreVisible = true;

        setTimeout(function () {
            currentMoveStage = 'WaitingForUserToSelectLowestCard';

            var cardSpacing = 25.0;
            var pos = GetDeckCardPosition();
            visibleLowCardOptionsCount = Math.floor((gameContainer.innerWidth - pos[0] - 144) / cardSpacing);
            if (visibleLowCardOptionsCount > 52) {
                visibleLowCardOptionsCount = 52;
            }
            if (visibleLowCardOptionsCount < 15) {
                visibleLowCardOptionsCount = 15;
            }
            var cnt = 0;
            for (var i = 0; i < cards.length; i++) {
                var cardView = cards[i].cardView;
                cardView.style.transition = "1s ease-out";
                cardView.positionLeftFunction = "GetDeckCardPosition()[0] + " + cnt + "*25 + 'px'";
                cardView.positionTopFunction = "GetDeckCardPosition()[1] + 'px'";
                cardView.style.left = eval(cardView.positionLeftFunction);
                cardView.style.top = eval(cardView.positionTopFunction);
                if (i >= (52 - visibleLowCardOptionsCount)) {
                    cnt = cnt + 1;
                }
            }

            setTimeout(function () {
                var selectCardMessage = document.getElementById('select_low_card_message');
                selectCardMessage.positionTopFunction = "GetDeckCardPosition()[1] + 140 + 'px'";
                selectCardMessage.positionLeftFunction = "'0px'";
                selectCardMessage.style.top = eval(selectCardMessage.positionTopFunction);
                selectCardMessage.style.left = eval(selectCardMessage.positionLeftFunction);
                selectCardMessage.style.visibility = "visible";
                selectCardMessage.style.transition = "1s ease-in";
                selectCardMessage.style.opacity = 1;
            }, 800);

        }, 700);
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

    function animateLowCardSelected(cardView) {
        currentMoveStage = 'AnimatingComputerSelectingLowestCard';
        slideRaiseAndFlipUpCard(cardView);
        setTimeout(animateComputerSelectingLowCard, 1000);
    }

    function animateComputerSelectingLowCard() {

        var selectCardMessage = document.getElementById('select_low_card_message');
        selectCardMessage.style.opacity = 0;
        setTimeout(function () { selectCardMessage.style.visibility = 'hidden'; }, 600);

        var base = 52 - visibleLowCardOptionsCount;
        var playerSelectedOffset = playerSelectedLowCardView.positionIndex - base;
        var min = base + 1;
        var max = playerSelectedLowCardView.positionIndex - 3;
        if (playerSelectedOffset / visibleLowCardOptionsCount < 0.5) {
            min = playerSelectedLowCardView.positionIndex + 4;
            max = 51;
        }
        var suitableCardFound = false;
        while (!suitableCardFound) {
            var computerSelectedIndex = Math.floor(Math.random() * (max - min + 1)) + min;
            var computerSelectedCard = cards[computerSelectedIndex];
            if (computerSelectedCard.rank != playerSelectedLowCardView.card.rank) {
                suitableCardFound = true;
                isPlayersCrib = playerSelectedLowCardView.card.rank < computerSelectedCard.rank;
                computerSelectedLowCardView = computerSelectedCard.cardView;
                slideRaiseAndFlipUpCard(computerSelectedLowCardView);
                setTimeout(ShowLowCardResult, 500);
            }
        }
    }

    function ShowLowCardResult() {
        if (playerSelectedLowCardView.positionIndex < computerSelectedLowCardView.positionIndex) {
            playerSelectedLowCardView.positionLeftFunction = "GetLeftLowCardPosition()[0] + 'px'";
            playerSelectedLowCardView.style.transition = "1s ease-in-out";
            playerSelectedLowCardView.style.left = eval(playerSelectedLowCardView.positionLeftFunction);

            computerSelectedLowCardView.positionLeftFunction = "GetRightLowCardPosition()[0] + 'px'";
            computerSelectedLowCardView.style.transition = "1s ease-in-out";
            computerSelectedLowCardView.style.left = eval(computerSelectedLowCardView.positionLeftFunction);

        } else {
            computerSelectedLowCardView.positionLeftFunction = "GetLeftLowCardPosition()[0] + 'px'";
            computerSelectedLowCardView.style.transition = "1s ease-in-out";
            computerSelectedLowCardView.style.left = eval(computerSelectedLowCardView.positionLeftFunction);

            playerSelectedLowCardView.positionLeftFunction = "GetRightLowCardPosition()[0] + 'px'";
            playerSelectedLowCardView.style.transition = "1s ease-in-out";
            playerSelectedLowCardView.style.left = eval(playerSelectedLowCardView.positionLeftFunction);
        }

        var playerCardIsOnLeft = playerSelectedLowCardView.positionIndex < computerSelectedLowCardView.positionIndex;
        var youText = document.getElementById('low_card_you_text');
        youText.positionLeftFunction = playerCardIsOnLeft ? "GetLeftLowCardPosition()[0] + 'px'" : "GetRightLowCardPosition()[0] + 'px'";
        youText.positionTopFunction = "GetLeftLowCardPosition()[1] - 140 + 'px'";
        youText.style.transition = "none";
        youText.style.top = eval(youText.positionTopFunction);
        youText.style.left = eval(youText.positionLeftFunction);

        var oppText = document.getElementById('low_card_computer_text');
        oppText.positionLeftFunction = playerCardIsOnLeft ? "GetRightLowCardPosition()[0] + 'px'" : "GetLeftLowCardPosition()[0] + 'px'";
        oppText.positionTopFunction = "GetLeftLowCardPosition()[1] - 140 + 'px'";
        oppText.style.transition = "none";
        oppText.style.top = eval(oppText.positionTopFunction);
        oppText.style.left = eval(oppText.positionLeftFunction);

        setTimeout(function () {
            var resultText = document.getElementById('low_card_result_text');
            if (isPlayersCrib) {
                resultText.innerHTML = "You drew the lower card!<br>You get the first crib.";
            } else {
                resultText.innerHTML = "Opponent drew the lower card.<br>They get the first crib.";
            }
            var resultMessage = document.getElementById('low_card_result_message');
            resultMessage.positionTopFunction = "GetDeckCardPosition()[1] + 110 + 'px'";
            resultMessage.positionLeftFunction = "'0px'";
            resultMessage.style.top = eval(resultMessage.positionTopFunction);
            resultMessage.style.left = eval(resultMessage.positionLeftFunction);
            resultMessage.style.transition = "0.6s ease-in";
            resultMessage.style.visibility = "visible";
            resultMessage.style.opacity = 1;

            var playerCardIsOnLeft = playerSelectedLowCardView.positionIndex < computerSelectedLowCardView.positionIndex;
            var youText = document.getElementById('low_card_you_text');
            youText.positionLeftFunction = playerCardIsOnLeft ? "GetLeftLowCardPosition()[0] + 'px'" : "GetRightLowCardPosition()[0] + 'px'";
            youText.positionTopFunction = "GetLeftLowCardPosition()[1] - 140 + 'px'";
            youText.style.transition = "none";
            youText.style.top = eval(youText.positionTopFunction);
            youText.style.left = eval(youText.positionLeftFunction);
            youText.style.visibility = "visible";
            youText.style.transition = "1s ease-in-out";
            youText.style.opacity = 1;

            var oppText = document.getElementById('low_card_computer_text');
            oppText.positionLeftFunction = playerCardIsOnLeft ? "GetRightLowCardPosition()[0] + 'px'" : "GetLeftLowCardPosition()[0] + 'px'";
            oppText.positionTopFunction = "GetLeftLowCardPosition()[1] - 140 + 'px'";
            oppText.style.transition = "none";
            oppText.style.top = eval(oppText.positionTopFunction);
            oppText.style.left = eval(oppText.positionLeftFunction);
            oppText.style.visibility = "visible";
            oppText.style.transition = "1s ease-in-out";
            oppText.style.opacity = 1;

        }, 800);

        setTimeout(function () {
            var pos = GetDeckCardPosition();
            for (var i = 0; i < cards.length; i++) {
                if (cards[i].id == computerSelectedLowCardView.card.id || cards[i].id == playerSelectedLowCardView.card.id) {
                    continue;
                }
                var cardView = cards[i].cardView;
                cardView.style.transition = "0.4s ease-out";
                cardView.positionLeftFunction = "GetDeckCardPosition()[0] + 'px'";
                cardView.positionTopFunction = "GetDeckCardPosition()[1] + 'px'";
                cardView.style.left = eval(cardView.positionLeftFunction);
                cardView.style.top = eval(cardView.positionTopFunction);
            }
        }, 100);
    }

    this.lowCardAcceptClick = function lowCardAcceptClick() {

        // Hide all messages 
        var viewsToHide = [
            'low_card_result_message',
            'low_card_you_text',
            'low_card_computer_text'];
        for (var i = 0; i < viewsToHide.length; i++) {
            var view = document.getElementById(viewsToHide[i]);
            view.style.transition = "0.4s ease-out";
            view.style.opacity = 0;
            view.style.visibility = 'hidden';
        }

        flipDownAndLowerCard(playerSelectedLowCardView, 500);
        playerSelectedLowCardView.positionLeftFunction = "GetDeckCardPosition()[0] + 'px'";
        playerSelectedLowCardView.positionTopFunction = "GetDeckCardPosition()[1] + 'px'";
        with (playerSelectedLowCardView.style) {
            transition = "1s ease-in-out";
            left = eval(playerSelectedLowCardView.positionLeftFunction);
            top = eval(playerSelectedLowCardView.positionTopFunction);
        }

        flipDownAndLowerCard(computerSelectedLowCardView, 500);
        computerSelectedLowCardView.positionLeftFunction = "GetDeckCardPosition()[0] + 'px'";
        computerSelectedLowCardView.positionTopFunction = "GetDeckCardPosition()[1] + 'px'";
        with (computerSelectedLowCardView.style) {
            transition = "1s ease-in-out";
            left = eval(computerSelectedLowCardView.positionLeftFunction);
            top = eval(computerSelectedLowCardView.positionTopFunction);
        }

        scoreboard.SetCribIndicator(isPlayersCrib);
        scoreboard.Show();

        setTimeout(AnimateDealingHands, 1000);
    }

    function AnimateDealingHands() {
        currentMoveStage = 'AnimatingDealingHands';

        shuffle(cards);
        for (var i = 0; i < cards.length; i++) {
            var pos = GetDeckCardPosition();
            var cardView = cards[i].cardView;
            cardView.positionIndex = i;
            cardView.isClickable = false;
            with (cardView.style) {
                left = pos[0] + "px";
                top = pos[1] + "px";
                zIndex = i + 1;
                visibility = "visible";
            }
        }

        deckTopIndex = cards.length - 1;
        playersHand = [];
        computersHand = [];
        crib = [];
        for (var i = 0; i < 6; i++) {
            playersHand.push(cards[deckTopIndex]);
            deckTopIndex = deckTopIndex - 1;
            computersHand.push(cards[deckTopIndex]);
            deckTopIndex = deckTopIndex - 1;
        }

        // Sort the players hand
        playersHand.sort(function (a, b) { return a.rank - b.rank; });

        // Deal the player cards
        mostRecentHandCards = [];
        mostRecentIsPlayersCrib = isPlayersCrib;
        for (var i = 0; i < 6; i++) {
            var cardView = playersHand[i].cardView;
            cardView.style.zIndex = i + 100;
            mostRecentHandCards.push(playersHand[i]);
        }
        
        setTimeout(function () {
            for (var i = 0; i < 6; i++) {
                var cardView = playersHand[i].cardView;
                cardView.positionLeftFunction = "GetHandCardPosition(true, true, " + i + ")[0] + 'px'";
                cardView.positionTopFunction = "GetHandCardPosition(true, true, " + i + ")[1] + 'px'";
                cardView.positionIndex = i;
                cardView.isClickable = true;
                cardView.style.zIndex = i + 100;
                with (cardView.style) {
                    transition = "0.5s ease-out";
                    transitionDelay = i * 150 + 'ms';
                    left = eval(cardView.positionLeftFunction);
                    top = eval(cardView.positionTopFunction);
                };
                setTimeout(flipUpCard, i * 60 + 800, cardView, true);
            }
        }, 50)

        // Deal the computer cards
        for (var i = 0; i < 6; i++) {
            var cardView = computersHand[i].cardView;
            cardView.positionLeftFunction = "GetHandCardPosition(false, true, " + i + ")[0] + 'px'";
            cardView.positionTopFunction = "GetHandCardPosition(false, true, " + i + ")[1] + 'px'";
            cardView.positionIndex = i;
            with (cardView.style) {
                transition = "0.5s ease-out";
                transitionDelay = i * 150 + 'ms';
                left = eval(cardView.positionLeftFunction);
                top = eval(cardView.positionTopFunction);
                zIndex = i;
            };
        }

        // Show the crib discard region
        var discardRegion = document.getElementById('crib_region');
        discardRegion.style.transition = "none";
        discardRegion.positionLeftFunction = "GetDiscardRegionPosition()[0] + 'px'";
        discardRegion.positionTopFunction = "GetDiscardRegionPosition()[1] + 'px'";
        discardRegion.style.left = eval(discardRegion.positionLeftFunction);
        discardRegion.style.top = eval(discardRegion.positionTopFunction);
        var discardText = document.getElementById('crib_region_center_text');
        discardText.innerText = isPlayersCrib ? "Your Crib" : "Opponent's Crib";
        setTimeout(function () {
            var discardRegion = document.getElementById('crib_region');
            discardRegion.style.transition = "1s linear";
            discardRegion.style.visibility = "visible";
            discardRegion.style.opacity = 1;
        }, 1400);

        if (skillLevel === 'Easy' || game.settings.GetSetting('setting_hints')) {
            setTimeout(function () {
                ShowHintButton();
            }, 1400);
        }

        currentMoveStage = 'WaitingForUserToDiscardToCrib';
    }

    this.hideCribConfirmationButton = function() {
        var confirmCribRegion = document.getElementById('confirm_crib_region');
        with (confirmCribRegion.style) {
            transition = "0.5s linear";
            opacity = 0;
            pointerEvents = "none";
        }
    }

    function preCribCardPointerPressed(cardView) {

        // Find the autoplay line for dropped cards
        autoPlayBoundaryY = GetHandCardPosition(true, true, currentDraggedCardView.positionIndex)[1] - cardLoweredHeight * 0.4;

        var cribPositionIndex = crib.indexOf(cardView.card);
        if (cribPositionIndex > -1) {
            currentPreCribDraggedCardWasLastInTheCrib = true;

            cardView.style.zIndex = 200;

            if (playersHand[cardView.positionIndex] != null) {
                var newIndex = 0;
                while (playersHand[newIndex] != null) {
                    newIndex++;
                }
                cardView.positionIndex = newIndex;
            }
            crib.splice(cribPositionIndex, 1);
            playersHand[cardView.positionIndex] = cardView.card;

            if (crib.length == 1) {
                var remainingCardView = crib[0].cardView;
                remainingCardView.positionLeftFunction = "GetDiscardRegionPosition()[0] - " + cribDiscardSpacing + " + 'px'";
                remainingCardView.positionTopFunction = "GetDiscardRegionPosition()[1] + 'px'";
                with (remainingCardView.style) {
                    transition = "0.1s ease-out";
                    left = eval(remainingCardView.positionLeftFunction);
                    top = eval(remainingCardView.positionTopFunction);
                    zIndex = crib.length;
                }
            }

            if (crib.length != 2) {
                game.hideCribConfirmationButton();
            }

        } else {
            currentPreCribDraggedCardWasLastInTheCrib = false;

            if (currentPlayerHandCardSpacing >= 0) {
                cardView.style.zIndex = 200;
            }
        }

        raiseCard(currentDraggedCardView);
    }

    function preCribCardPointerMoved() {
        // Check if we need to reorder the cards
        if (currentDraggedCardView.offsetTop > autoPlayBoundaryY) {
            var curIndex = GetCardIndexFromPosition(true, currentDraggedCardView);
            if (curIndex != currentDraggedCardView.positionIndex) {
                var incrementing = curIndex < currentDraggedCardView.positionIndex;
                var displacedCard = playersHand[curIndex];
                playersHand[currentDraggedCardView.positionIndex] = null;
                currentDraggedCardView.positionIndex = curIndex;
                playersHand[curIndex] = currentDraggedCardView.card;
                var firstDisplacement = true;
                while (displacedCard != null) {
                    if (incrementing) {
                        var tempCard = playersHand[displacedCard.cardView.positionIndex + 1];
                        displacedCard.cardView.positionIndex = displacedCard.cardView.positionIndex + 1;
                        playersHand[displacedCard.cardView.positionIndex] = displacedCard;
                        if (currentPlayerHandCardSpacing < 0) {
                            if (firstDisplacement) {
                                slideCardToHandPositionWithOverlap(true, incrementing, displacedCard.cardView, curIndex);
                            } else {
                                returnCardViewToHandPosition(true, displacedCard.cardView);
                            }
                        } else {
                            returnCardViewToHandPosition(true, displacedCard.cardView);
                        }
                        displacedCard = tempCard;
                    } else {
                        var tempCard = playersHand[displacedCard.cardView.positionIndex - 1];
                        displacedCard.cardView.positionIndex = displacedCard.cardView.positionIndex - 1;
                        playersHand[displacedCard.cardView.positionIndex] = displacedCard;
                        if (currentPlayerHandCardSpacing < 0) {
                            if (firstDisplacement) {
                                slideCardToHandPositionWithOverlap(true, incrementing, displacedCard.cardView, curIndex);
                            } else {
                                returnCardViewToHandPosition(true, displacedCard.cardView);
                            }
                        } else {
                            returnCardViewToHandPosition(true, displacedCard.cardView);
                        }
                        displacedCard = tempCard;
                    }
                    firstDisplacement = false;
                }
            }
        }
    }

    function preCribCardPointerFinished() {
        // Check for tap
        var distX = pos3 - currentDraggedCardView.startPosition[0];
        var distY = pos4 - currentDraggedCardView.startPosition[1];
        var distance = Math.sqrt(distX * distX + distY * distY);
        var elapsed = Date.now() - currentDraggedCardView.startTime;
        var tapped = elapsed < 500 && distance < 10;
        if (currentPreCribDraggedCardWasLastInTheCrib) {
            if (tapped || (currentDraggedCardView.offsetTop > GetDeckCardPosition()[1] + cardLoweredHeight * 0.4)) {
                returnCardViewToHandPosition(true, currentDraggedCardView);
            } else {
                dropCardViewInCrib(currentDraggedCardView);
            }
        } else {
            if (tapped || currentDraggedCardView.offsetTop < autoPlayBoundaryY) {
                dropCardViewInCrib(currentDraggedCardView);
            } else {
                returnCardViewToHandPosition(true, currentDraggedCardView);
            }
        }

        lowerCard(currentDraggedCardView);
    }

    function returnCardViewToHandPosition(isPreCrib, cardView) {
        cardView.positionLeftFunction = "GetHandCardPosition(true, " + isPreCrib + ", " + cardView.positionIndex + ")[0] + 'px'";
        cardView.positionTopFunction = "GetHandCardPosition(true, " + isPreCrib + ", " + cardView.positionIndex + ")[1] + 'px'";
        with (cardView.style) {
            transition = "0.25s ease-out";
            left = eval(cardView.positionLeftFunction);
            top = eval(cardView.positionTopFunction);
            zIndex = cardView.positionIndex + 100;
        };
    }

    function slideCardToHandPositionWithOverlap(isPreCrib, isIncrementing, cardView, curIndex) {
        cardView.positionLeftFunction = "GetHandCardPosition(true, " + isPreCrib + ", " + cardView.positionIndex + ")[0] + 'px'";
        cardView.positionTopFunction = "GetHandCardPosition(true, " + isPreCrib + ", " + cardView.positionIndex + ")[1] + 'px'";
        with (cardView.style) {
            transition = "0.07s ease-out";
            left = isIncrementing ? cardView.offsetLeft + cardLoweredWidth * 1.5 + "px" : cardView.offsetLeft + cardLoweredWidth * 1.0 + "px";
            zIndex = isIncrementing ? cardView.positionIndex + 100 - 1 : cardView.positionIndex + 100 - 1;
        };
        setTimeout(function () {
            currentDraggedCardView.style.zIndex = 100 + curIndex;
            with (cardView.style) {
                transition = "0.09s ease-out";
                left = eval(cardView.positionLeftFunction);
                top = eval(cardView.positionTopFunction);
                zIndex = cardView.positionIndex + 100;
            };
        }, 70);
    }

    function dropCardViewInCrib(cardView) {

        var position = GetDiscardRegionPosition();
        var leftOffset = -cribDiscardSpacing;
        if (crib.length == 1) {
            leftOffset = cribDiscardSpacing;
        } else if (crib.length == 2) {
            returnCardViewToHandPosition(true, cardView);
            return;
        }

        crib.push(cardView.card);
        playersHand[cardView.positionIndex] = null;
        cardView.positionLeftFunction = "GetDiscardRegionPosition()[0] + " + leftOffset + " + 'px'";
        cardView.positionTopFunction = "GetDiscardRegionPosition()[1] + 'px'";
        with (cardView.style) {
            transition = "0.25s ease-out";
            left = eval(cardView.positionLeftFunction);
            top = eval(cardView.positionTopFunction);
            zIndex = crib.length;
        }

        if (crib.length == 2) {
            // Show the submit button
            var confirmCribRegion = document.getElementById('confirm_crib_region');
            confirmCribRegion.positionLeftFunction = "GetCribConfirmRegionPosition()[0] + 'px'";
            confirmCribRegion.positionTopFunction = "GetCribConfirmRegionPosition()[1] + 'px'";
            confirmCribRegion.style.transition = "none";
            confirmCribRegion.style.left = eval(confirmCribRegion.positionLeftFunction);
            confirmCribRegion.style.top = eval(confirmCribRegion.positionTopFunction);
            confirmCribRegion.style.visibility = "visible";
            with (confirmCribRegion.style) {
                transition = "0.5s linear";
                opacity = 1;
                pointerEvents = "auto";
            }
        }
    }

    this.cribCardsConfirmed = function () {
        if (currentMoveStage == 'WaitingForUserToDiscardToCrib' && crib.length == 2) {
            // Check if this is the optimal discards
            var trialCards = [];
            var allCards = [];
            for (var i = 0; i < playersHand.length; i++) {
                if (playersHand[i] !== null) {
                    trialCards.push(playersHand[i]);
                    allCards.push(playersHand[i]);
                }
            }
            for (var i = 0; i < crib.length; i++) {
                allCards.push(crib[i]);
            }
            var scoreStats = computerPlayer.GetScoreStatsForPossibleDiscards(trialCards, crib, isPlayersCrib);
            var optimalStats = computerPlayer.FindOptimalCribDiscards(allCards, isPlayersCrib);
            if (scoreStats[1] < optimalStats[1]) {
                var suboptimalPlay = {};
                suboptimalPlay.isDiscard = true;
                suboptimalPlay.isPlayersCrib = isPlayersCrib;
                suboptimalPlay.playedScore = scoreStats[1];
                suboptimalPlay.optimalScore = optimalStats[1];
                suboptimalPlay.playedCards = [];
                suboptimalPlay.playedCards.push(crib[0]);
                suboptimalPlay.playedCards.push(crib[1]);
                suboptimalPlay.situationCards = [];
                suboptimalPlay.situationCards.push(crib[0]);
                suboptimalPlay.situationCards.push(crib[1]);
                for (var i = 0; i < playersHand.length; i++) {
                    if (playersHand[i] !== null) {
                        suboptimalPlay.situationCards.push(playersHand[i]);
                    }
                }
                suboptimalPlay.optimalCards = [];
                suboptimalPlay.optimalCards.push(optimalStats[0][0]);
                suboptimalPlay.optimalCards.push(optimalStats[0][1]);


                if (this.settings.GetSetting('setting_warn_suboptimal')) {
                    ShowSuboptimalWarning(suboptimalPlay);
                    return;
                } else {
                    suboptimalPlays.push(suboptimalPlay);
                }
            }
            this.finishCribConfirmation();
        }
    }

    var currentSuboptimalPlay;

    function ShowSuboptimalWarning(suboptimalPlay) {
        currentSuboptimalPlay = suboptimalPlay;

        if (currentSuboptimalPlay.isDiscard) {
            currentMoveStage = "ShowingDiscardWarning";
        } else {
            currentMoveStage = "ShowingPeggingWarning";
        }

        var suboptimalWarningTitle = document.getElementById('SuboptimalWarningTitle');
        var suboptimalWarningText = document.getElementById('SuboptimalWarningText');
        var suboptimalShowAllButton = document.getElementById('SuboptimalWarningShowAllScoresButton');
        var suboptimalPlayAnywaysButton = document.getElementById('SuboptimalWarningPlayAnywaysButton');
        if (suboptimalPlay.isDiscard) {
            suboptimalShowAllButton.style.display = 'inline';
            suboptimalPlayAnywaysButton.innerText = "Play these cards anyways";
            suboptimalWarningTitle.innerHTML = "That is not the<br>optimal discard";
            suboptimalWarningText.innerHTML = "Your discards will result in an average round score of " + parseFloat(suboptimalPlay.playedScore).toFixed(1) + "<br><br>A better play exists that would result in an average score of " + parseFloat(suboptimalPlay.optimalScore).toFixed(1);
        } else {
            suboptimalShowAllButton.style.display = 'none';
            suboptimalPlayAnywaysButton.innerText = "Play this card anyway";
            suboptimalWarningTitle.innerHTML = "That is not the<br>optimal play";
            suboptimalWarningText.innerHTML = "Your card will result in a score of " + suboptimalPlay.playedScore + "<br><br>A better play exists that would result in a score of " + suboptimalPlay.optimalScore;
        }
        var suboptimalWarning = document.getElementById('SuboptimalWarning');
        suboptimalWarning.style.opacity = 0;
        suboptimalWarning.style.visibility = 'visible';
        suboptimalWarning.style.transition = "0.2s linear";
        suboptimalWarning.style.opacity = 1;
        visibleMenuCards.push('SuboptimalWarning');
    }

    this.HideSuboptimalWarning = function() {
        if (currentSuboptimalPlay.isDiscard) {
            currentMoveStage = "WaitingForUserToDiscardToCrib";
        } else {
            currentMoveStage = "WaitingForUserToPlayPeggingCard";
        }

        visibleMenuCards = [];
        var suboptimalWarning = document.getElementById('SuboptimalWarning');
        suboptimalWarning.style.transition = "0.15s linear";
        suboptimalWarning.style.opacity = 0;
        setTimeout(function () {
            suboptimalWarning.style.visibility = 'hidden';
        }, 200);
    }

    this.SuboptimalWarningTryAgainClick = function () {
        this.HideSuboptimalWarning();
        if (!currentSuboptimalPlay.isDiscard) {
            returnCardViewToHandPosition(false, currentSuboptimalPlay.playedCards[0].cardView);
        }
    }

    this.SuboptimalWarningShowAllScoresClick = function () {
        this.ShowAllPlaysForSuboptimalPlay(currentSuboptimalPlay);
    }

    this.SuboptimalWarningHintClick = function () {
        this.HideSuboptimalWarning();
        if (!currentSuboptimalPlay.isDiscard) {
            returnCardViewToHandPosition(false, currentSuboptimalPlay.playedCards[0].cardView);
        }
        setTimeout(function () {
            BumpHintCards();
        }, 300);
    }

    this.SuboptimalWarningPlayAnywaysClick = function () {
        this.HideSuboptimalWarning();
        suboptimalPlays.push(currentSuboptimalPlay);
        if (currentSuboptimalPlay.isDiscard) {
            setTimeout(function () {
                game.finishCribConfirmation();
            }, 200);
        } else {
            setTimeout(function () {
                FinishPeggingPlay(currentDraggedCardView);
            }, 200);
        }
    }

    this.finishCribConfirmation = function() {
        currentMoveStage = 'AnimatingComputerDiscardingToCrib';
        this.hideCribConfirmationButton();
        HideHintButton();

        // Remove the null cards from the player hand
        for (var i = 0; i < playersHand.length; i++) {
            if (playersHand[i] == undefined) {
                playersHand.splice(i, 1);
                i--;
            }
        }

        AnimateComputerDiscardingToCrib();
    }

    function AnimateComputerDiscardingToCrib() {
        // Hide the crib region
        var view = document.getElementById('crib_region');
        view.style.transition = "0.4s linear";
        view.style.transitionDelay = "0.5s";
        view.style.opacity = 0;

        // Flip over the cards
        crib[0].cardView.isClickable = false;
        crib[1].cardView.isClickable = false;
        flipDownCard(crib[0].cardView, true);
        flipDownCard(crib[1].cardView, true);

        // Play the computer cards
        var computerDiscards = computerPlayer.SelectTwoCardsToDiscardInCrib(skillLevel, !isPlayersCrib, computersHand);
        var index = computersHand.indexOf(computerDiscards[0]);
        computersHand.splice(index, 1);
        index = computersHand.indexOf(computerDiscards[1]);
        computersHand.splice(index, 1);
        for (var i = 0; i < computerDiscards.length; i++) {
            crib.push(computerDiscards[i]);
            computerDiscards[i].cardView.positionLeftFunction = "GetDiscardRegionPosition()[0] + 'px'";
            computerDiscards[i].cardView.positionTopFunction = "GetDiscardRegionPosition()[1] + 'px'";
            with (computerDiscards[i].cardView.style) {
                transition = "0.25s ease-out";
                transitionDelay = 600 + i * 200 + "ms";
                left = eval(computerDiscards[i].cardView.positionLeftFunction);
                top = eval(computerDiscards[i].cardView.positionTopFunction);
            }
        }

        // Slide the crib cards to the side
        setTimeout(function () {
            var waitingPosition = GetCribWaitingPosition();
            for (var i = 0; i < crib.length; i++) {
                crib[i].cardView.positionLeftFunction = "GetCribWaitingPosition()[0] + 'px'";
                crib[i].cardView.positionTopFunction = "GetCribWaitingPosition()[1] + 'px'";
                with (crib[i].cardView.style) {
                    transition = "0.5s ease-out";
                    left = waitingPosition[0] + "px";
                }
            }
            setTimeout(function () {
                for (var i = 0; i < crib.length; i++) {
                    with (crib[i].cardView.style) {
                        top = waitingPosition[1] + "px";
                    }
                }
            }, 550);
        }, 1200);

        // Reposition the players hand cards
        for (var i = 0; i < playersHand.length; i++) {
            var cardView = playersHand[i].cardView;
            cardView.positionLeftFunction = "GetHandCardPosition(true, false, " + i + ")[0] + 'px'";
            cardView.positionTopFunction = "GetHandCardPosition(true, false, " + i + ")[1] + 'px'";
            cardView.positionIndex = i;
            with (cardView.style) {
                transition = "0.5s ease-out";
                transitionDelay = "0.8s";
                left = eval(cardView.positionLeftFunction);
                top = eval(cardView.positionTopFunction);
                zIndex = i + 100;
            };
        }

        // Reposition the computers hand cards
        for (var i = 0; i < computersHand.length; i++) {
            var cardView = computersHand[i].cardView;
            cardView.positionLeftFunction = "GetHandCardPosition(false, false, " + i + ")[0] + 'px'";
            cardView.positionTopFunction = "GetHandCardPosition(false, false, " + i + ")[1] + 'px'";
            cardView.positionIndex = i;
            with (cardView.style) {
                transition = "0.5s ease-out";
                transitionDelay = "0.8s";
                left = eval(cardView.positionLeftFunction);
                top = eval(cardView.positionTopFunction);
                zIndex = i + 100;
            };
        }

        // Put the crib region indicator overlay on the crib cards
        var cribOverlayText = document.getElementById('crib_indicator_card_overlap_text');
        cribOverlayText.innerHTML = isPlayersCrib ? "Your" : "Opponent's";
        var cribOverlay = document.getElementById('crib_indicator_card_overlap');
        cribOverlay.style.zIndex = 6;
        cribOverlay.positionLeftFunction = "GetCribWaitingPosition()[0] + 'px'";
        cribOverlay.positionTopFunction = "GetCribWaitingPosition()[1] + 'px'";
        cribOverlay.style.visibility = "visible";
        cribOverlay.style.transition = "none";
        cribOverlay.style.left = eval(cribOverlay.positionLeftFunction);
        cribOverlay.style.top = eval(cribOverlay.positionTopFunction);
        setTimeout(function () {
            with (cribOverlay.style) {
                transition = "0.5s linear";
                opacity = 1;
            }
        }, 2400);

        setTimeout(InitializePeggingRound, 1800);
    }

    function InitializePeggingRound() {
        recordPlayerPeggingStartingScore = playerScore;
        recordComputerPeggingStartingScore = computerScore;
        currentPeggingCards = [];
        deadPeggingCards = [];
        computerPlayedPeggingCards = [];
        playerPlayedPeggingCards = [];
        isPlayersTurnToPeg = false;
        playerSaysGo = false;
        computerSaysGo = false;
        currentPeggingCount = 0;

        // Flip the top card on the deck
        topCard = cards[deckTopIndex];
        topCard.cardView.style.zIndex = 60;
        flipUpCard(topCard.cardView, true);
        topCard.cardView.positionLeftFunction = "GetDeckCardPosition()[0] + 10 + 'px'";
        topCard.cardView.positionTopFunction = "GetDeckCardPosition()[1] + 'px'";
        with (topCard.cardView.style) {
            transition = "0.3s ease-in-out"
            left = eval(topCard.cardView.positionLeftFunction);
            top = eval(topCard.cardView.positionTopFunction);
        }

        var pointsShowDelay = 0;
        if (topCard.rank == 11) {
            // This is a jack, reward the dealer 2 points
            if (isPlayersCrib) {
                playerScore = playerScore + 2;
                setTimeout(function () {
                    scoreboard.SetScorePlayer(playerScore);
                }, bubbleScoreVisibleDuration);
            } else {
                computerScore = computerScore + 2;
                setTimeout(function () {
                    scoreboard.SetScoreOpp(computerScore);
                }, bubbleScoreVisibleDuration);
            }
            var bubblePosition = GetDeckCardPosition();
            AnimateScoreBubble([bubblePosition[0] + 10, bubblePosition[1]], 2, 'Nibs for', isPlayersCrib, 800);
            pointsShowDelay = bubbleScoreVisibleDuration;

            if (isGameOver()) {
                AnimateGameFinished();
                return;
            }
        }

        // Show pegging count indicator
        peggingCountText = document.getElementById('PeggingCountIndicatorScore');
        peggingCountText.innerText = 0;
        peggingCountIndicator = document.getElementById('PeggingCountIndicator');
        peggingCountIndicator.style.transition = "none";
        peggingCountIndicator.style.zIndex = 100;
        peggingCountIndicator.positionLeftFunction = "GetDeckCardPosition()[0] - 115*0.5 + 10 + 'px'";
        peggingCountIndicator.positionTopFunction = "GetDeckCardPosition()[1] - 75*0.5 + 'px'";
        peggingCountIndicator.style.top = eval(peggingCountIndicator.positionTopFunction);
        peggingCountIndicator.style.left = eval(peggingCountIndicator.positionLeftFunction);
        peggingCountIndicator.style.opacity = 0;
        peggingCountIndicator.style.visibility = "visible";
        setTimeout(function () {
            peggingCountIndicator.style.transition = "0.3s linear";
            peggingCountIndicator.style.opacity = 1;
        }, 900 + pointsShowDelay);

        if (isPlayersCrib) {
            setTimeout(function () {
                PlayNextPeggingCardForComputer();
                setTimeout(function () {
                    if (skillLevel === 'Easy' || game.settings.GetSetting('setting_hints')) {
                        ShowHintButton();
                    }
                    ShowPeggingPrompt("2s", true);
                    currentMoveStage = 'WaitingForUserToPlayPeggingCard';
                }, 500);
            }, pointsShowDelay + 700);
        } else {
            if (skillLevel === 'Easy' || game.settings.GetSetting('setting_hints')) {
                ShowHintButton();
            }
            ShowPeggingPrompt("1.7s", true);
            currentMoveStage = 'WaitingForUserToPlayPeggingCard';
        }
    }

    function SetPeggingCountAnimated(count, delay) {
        setTimeout(function () {
            peggingCountText.style.transition = "0.15s linear";
            peggingCountText.style.opacity = 0;
            setTimeout(function () {
                peggingCountText.style.transition = "0.25s linear";
                peggingCountText.innerText = count;
                peggingCountText.style.opacity = 1;
            }, 100);
        }, delay);
    }

    function ShowPeggingPrompt(delay, animate) {
        isPlayersTurnToPeg = true;
        var peggingPrompt = document.getElementById('pegging_prompt');
        peggingPrompt.style.transition = "none";
        peggingPrompt.positionLeftFunction = "GetPeggingPromptPosition()[0] + 'px'";
        peggingPrompt.positionTopFunction = "GetPeggingPromptPosition()[1] + 'px'";
        peggingPrompt.style.left = eval(peggingPrompt.positionLeftFunction);
        peggingPrompt.style.top = eval(peggingPrompt.positionTopFunction);
        if (animate) {
            setTimeout(function () {
                peggingPrompt.style.visibility = "visible";
                peggingPrompt.style.transition = "0.3s";
                peggingPrompt.style.transitionDelay = delay;
                peggingPrompt.style.opacity = 1;
            }, 50);
        } else {
            peggingPrompt.style.transition = "none";
            peggingPrompt.style.visibility = "visible";
            peggingPrompt.style.transitionDelay = "none";
            peggingPrompt.style.opacity = 1;
        }
    }

    function HidePeggingPrompt() {
        HideHintButton();
        isPlayersTurnToPeg = false;
        var peggingPrompt = document.getElementById('pegging_prompt');
        peggingPrompt.style.transition = "0.3s";
        peggingPrompt.style.opacity = 0;
    }

    function peggingCardPointerPressed(cardView) {

        // Find the autoplay line for dropped cards
        autoPlayBoundaryY = GetHandCardPosition(true, false, currentDraggedCardView.positionIndex)[1] - cardLoweredHeight * 0.4;

        if (currentPlayerHandCardSpacing >= 0) {
            cardView.style.zIndex = 200;
        }

        raiseCard(currentDraggedCardView);
    }

    function peggingCardPointerMoved() {
        // Check if we need to reorder the cards
        if (currentDraggedCardView.offsetTop > autoPlayBoundaryY) {
            var curIndex = GetCardIndexFromPosition(false, currentDraggedCardView);
            if (curIndex != currentDraggedCardView.positionIndex) {
                var incrementing = curIndex < currentDraggedCardView.positionIndex;
                var displacedCard = playersHand[curIndex];
                playersHand[currentDraggedCardView.positionIndex] = null;
                currentDraggedCardView.positionIndex = curIndex;
                playersHand[curIndex] = currentDraggedCardView.card;
                var firstDisplacement = true;
                while (displacedCard != null) {
                    if (incrementing) {
                        var tempCard = playersHand[displacedCard.cardView.positionIndex + 1];
                        displacedCard.cardView.positionIndex = displacedCard.cardView.positionIndex + 1;
                        playersHand[displacedCard.cardView.positionIndex] = displacedCard;
                        if (currentPlayerHandCardSpacing < 0) {
                            if (firstDisplacement) {
                                slideCardToHandPositionWithOverlap(false, incrementing, displacedCard.cardView, curIndex);
                            } else {
                                returnCardViewToHandPosition(false, displacedCard.cardView);
                            }
                        } else {
                            returnCardViewToHandPosition(false, displacedCard.cardView);
                        }
                        displacedCard = tempCard;
                    } else {
                        var tempCard = playersHand[displacedCard.cardView.positionIndex - 1];
                        displacedCard.cardView.positionIndex = displacedCard.cardView.positionIndex - 1;
                        playersHand[displacedCard.cardView.positionIndex] = displacedCard;
                        if (currentPlayerHandCardSpacing < 0) {
                            if (firstDisplacement) {
                                slideCardToHandPositionWithOverlap(false, incrementing, displacedCard.cardView, curIndex);
                            } else {
                                returnCardViewToHandPosition(false, displacedCard.cardView);
                            }
                        } else {
                            returnCardViewToHandPosition(false, displacedCard.cardView);
                        }
                        displacedCard = tempCard;
                    }
                    firstDisplacement = false;
                }
            }
        }
    }

    function peggingCardPointerFinished() {
        // Check for tap
        var distX = pos3 - currentDraggedCardView.startPosition[0];
        var distY = pos4 - currentDraggedCardView.startPosition[1];
        var distance = Math.sqrt(distX * distX + distY * distY);
        var elapsed = Date.now() - currentDraggedCardView.startTime;
        var tapped = elapsed < 500 && distance < 10;

        lowerCard(currentDraggedCardView);

        if (tapped || currentDraggedCardView.offsetTop < autoPlayBoundaryY) {
            if (isPlayersTurnToPeg) {
                // Check if this play is allowed
                if (currentDraggedCardView.card.value + currentPeggingCount <= 31) {

                    // Check if this play is suboptimal and pause if warning is on
                    var optimalStats = computerPlayer.FindOptimalPeggingCard(playersHand, currentPeggingCount, currentPeggingCards, deadPeggingCards, topCard);
                    var testPeggingCards = [];
                    testPeggingCards = testPeggingCards.concat(currentPeggingCards);
                    testPeggingCards.push(currentDraggedCardView.card);
                    var testPoints = CribbageGame.GetPeggingPointsForCards(testPeggingCards);
                    var curPlayScore = 0;
                    for (var i = 0; i < testPoints.length; i++) {
                        curPlayScore = curPlayScore + testPoints[i].points;
                    }

                    if (curPlayScore < optimalStats[1]) {
                        var suboptimalPlay = {};
                        suboptimalPlay.isDiscard = false;
                        suboptimalPlay.isPlayersCrib = isPlayersCrib;
                        suboptimalPlay.playedScore = curPlayScore;
                        suboptimalPlay.optimalScore = optimalStats[1];
                        suboptimalPlay.playedCards = [];
                        suboptimalPlay.playedCards.push(currentDraggedCardView.card);
                        suboptimalPlay.situationCards = [];
                        for (var i = 0; i < currentPeggingCards.length; i++) {
                            suboptimalPlay.situationCards.push(currentPeggingCards[i]);
                        }
                        suboptimalPlay.optimalCards = [];
                        suboptimalPlay.optimalCards.push(optimalStats[0]);

                        if (game.settings.GetSetting('setting_warn_suboptimal')) {
                            ShowSuboptimalWarning(suboptimalPlay);
                            return;
                        } else {
                            suboptimalPlays.push(suboptimalPlay);
                        }
                    }

                    FinishPeggingPlay(currentDraggedCardView);
                    return;
                }
            }
        }

        returnCardViewToHandPosition(false, currentDraggedCardView);
    }

    function FinishPeggingPlay(cardView) {
        HidePeggingPrompt();
        cardView.isClickable = false;

        // Drop card into peg pile
        playersHand[playersHand.indexOf(cardView.card)] = null;
        currentPeggingCards.push(cardView.card);
        playerPlayedPeggingCards.push(cardView.card);
        AnimateCardViewToPeggingPile(cardView, true, true);

        var cardAnimationDelay = 500;
        var peggingPoints = GetPeggingPointsLastPlay();
        var totalPoints = 0;
        for (var i = 0; i < peggingPoints.length; i++) {
            var position = GetPeggingFirstCardPosition();
            var left = position[0] + currentPeggingCards.length * peggingCardsOverlap;
            var top = position[1];
            var scoringPoints = peggingPoints[i];
            totalPoints = totalPoints + scoringPoints.points;
            AnimateScoreBubble([left, top], scoringPoints.points, scoringPoints.description, true, i * bubbleScoreVisibleDuration + cardAnimationDelay);
        }

        setTimeout(function () {
            // Update the score
            if (totalPoints > 0) {
                playerScore = playerScore + totalPoints;
                scoreboard.SetScorePlayer(playerScore);
            }
        }, peggingPoints.length * bubbleScoreVisibleDuration + cardAnimationDelay);

        setTimeout(function () {

            // Continue after scores registered
            if (isGameOver()) {
                UpdatePeggingAverageRecord();
                AnimateGameFinished();
                return;
            }

            if (currentPeggingCards.length + deadPeggingCards.length == 8) {
                // Pegging Finished
                var finalCardPointDelay = 500;
                if (currentPeggingCount != 31) {
                    // Award point for last card
                    finalCardPointDelay = finalCardPointDelay + bubbleScoreVisibleDuration;
                    var position = GetPeggingFirstCardPosition();
                    var left = position[0] + currentPeggingCards.length * peggingCardsOverlap;
                    var top = position[1];
                    AnimateScoreBubble([left, top], 1, "Last card", true, 0);
                    playerScore = playerScore + 1;
                    setTimeout(function () {
                        scoreboard.SetScorePlayer(playerScore);
                    }, bubbleScoreVisibleDuration);

                    if (isGameOver()) {
                        UpdatePeggingAverageRecord();
                        AnimateGameFinished();
                        return;
                    }
                }

                setTimeout(function () {
                    OnPeggingFinished();
                }, finalCardPointDelay);
                return;
            }

            if (currentPeggingCount == 31) {
                OnResetPeggingCount();
            }

            var delay = 500;
            if (computerSaysGo) {
                delay = 0;
            }
            setTimeout(function () {
                MakeMoveForComputer();
            }, delay);

        }, peggingPoints.length * bubbleScoreVisibleDuration + cardAnimationDelay);
    }

    function MakeMoveForComputer() {
        var computerPlay = PlayNextPeggingCardForComputer();
        if (computerPlay === undefined) {
            // This is a go
            if (playerSaysGo) {
                if (currentPeggingCount != 31) {
                    // Give the computer a point for last card
                    var position = GetPeggingFirstCardPosition();
                    var left = position[0] + currentPeggingCards.length * peggingCardsOverlap;
                    var top = position[1];
                    AnimateScoreBubble([left, top], 1, "Last card", false, 0);
                    computerScore = computerScore + 1;
                    setTimeout(function () {
                        scoreboard.SetScoreOpp(computerScore);
                        if (isGameOver()) {
                            UpdatePeggingAverageRecord();
                            AnimateGameFinished();
                            return;
                        }
                        OnResetPeggingCount();
                        ShowTheUserToPlayOrSayGo();
                    }, bubbleScoreVisibleDuration);
                    return;
                }
                OnResetPeggingCount();
            } else {
                ShowMessageThatComputerSaysGo();
            }

            setTimeout(ShowTheUserToPlayOrSayGo, 300);

        } else {
            var peggingPoints = GetPeggingPointsLastPlay();
            var totalPoints = 0;
            var cardAnimationDelay = 500;
            for (var i = 0; i < peggingPoints.length; i++) {
                var position = GetPeggingFirstCardPosition();
                var left = position[0] + currentPeggingCards.length * peggingCardsOverlap;
                var top = position[1];
                var scoringPoints = peggingPoints[i];
                totalPoints = totalPoints + scoringPoints.points;
                AnimateScoreBubble([left, top], scoringPoints.points, scoringPoints.description, false, i * bubbleScoreVisibleDuration + cardAnimationDelay);
            }
            
            var pointsDelay = peggingPoints.length*bubbleScoreVisibleDuration;
            setTimeout(function () {
                // Update the score
                if (totalPoints > 0) {
                    computerScore = computerScore + totalPoints;
                    scoreboard.SetScoreOpp(computerScore);
                }
            
                // Continue after scores registered
                if (isGameOver()) {
                    UpdatePeggingAverageRecord();
                    AnimateGameFinished();
                    return;
                }

                if (currentPeggingCards.length + deadPeggingCards.length == 8) {
                    // Pegging Finished
                    var finalCardPointDelay = 500;
                    if (currentPeggingCount != 31) {
                        // Award point for last card
                        finalCardPointDelay = finalCardPointDelay + bubbleScoreVisibleDuration;
                        var position = GetPeggingFirstCardPosition();
                        var left = position[0] + currentPeggingCards.length * peggingCardsOverlap;
                        var top = position[1];
                        AnimateScoreBubble([left, top], 1, "Last card", false, 0);
                        computerScore = computerScore + 1;
                        setTimeout(function () {
                            scoreboard.SetScoreOpp(computerScore);
                        }, bubbleScoreVisibleDuration);

                        if (isGameOver()) {
                            UpdatePeggingAverageRecord();
                            AnimateGameFinished();
                            return;
                        }
                    }

                    setTimeout(function () {
                        OnPeggingFinished();
                    }, finalCardPointDelay);
                    return;
                }

                if (currentPeggingCount == 31) {
                    OnResetPeggingCount();
                }

                ShowTheUserToPlayOrSayGo();

            }, pointsDelay + cardAnimationDelay);
        }
    }

    function ShowTheUserToPlayOrSayGo() {
        for (var i = 0; i < playersHand.length; i++) {
            if (playersHand[i] !== null && playersHand[i].value + currentPeggingCount <= 31) {
                // There is at least one valid play
                if (skillLevel === 'Easy' || game.settings.GetSetting('setting_hints')) {
                    ShowHintButton();
                }
                ShowPeggingPrompt("2s", true);
                return;
            }
        }

        HidePeggingPrompt();
        ShowMessageUserMustSayGo();
    }

    function ShowMessageUserMustSayGo() {
        var playerSaysGoMessage = document.getElementById('player_says_go');
        playerSaysGoMessage.style.transition = "none";
        playerSaysGoMessage.style.opacity = 0;
        playerSaysGoMessage.positionLeftFunction = "gameContainer.innerWidth*0.5 - 115*0.5 + 'px'";
        playerSaysGoMessage.positionTopFunction = "GetHandCardPosition(true, false, 2)[1] - 65*0.5 + 'px'";
        playerSaysGoMessage.style.left = eval(playerSaysGoMessage.positionLeftFunction);
        playerSaysGoMessage.style.top = eval(playerSaysGoMessage.positionTopFunction);
        playerSaysGoMessage.style.visibility = "visible";

        playerSaysGoMessage.style.transition = "0.2s linear";
        playerSaysGoMessage.style.opacity = 1;
    }

    function HideMessageUserMustSayGo() {
        var playerSaysGoMessage = document.getElementById('player_says_go');
        playerSaysGoMessage.style.transition = "0.1s linear";
        playerSaysGoMessage.style.opacity = 0;
        playerSaysGoMessage.style.visibility = "hidden";
    }

    this.OnUserSaysGoClick = function () {
        HideMessageUserMustSayGo();
        HideMessageComputerSaysGo();
        playerSaysGo = true;
        if (computerSaysGo) {
            // Give the player a point for last card
            var position = GetPeggingFirstCardPosition();
            var left = position[0] + currentPeggingCards.length * peggingCardsOverlap;
            var top = position[1];
            AnimateScoreBubble([left, top], 1, "Last card", true, 300);
            playerScore = playerScore + 1;
            setTimeout(function () {
                scoreboard.SetScorePlayer(playerScore);
                if (isGameOver()) {
                    UpdatePeggingAverageRecord();
                    AnimateGameFinished();
                    return;
                }
                OnResetPeggingCount();
                setTimeout(function () {
                    MakeMoveForComputer();
                }, 500);
            }, 200 + bubbleScoreVisibleDuration);
            return;
        }

        setTimeout(function () {
            MakeMoveForComputer();
        }, 50);
    }

    function ShowMessageThatComputerSaysGo() {
        computerSaysGo = true;
        var computerSaysGoMessage = document.getElementById('computer_says_go');
        computerSaysGoMessage.style.transition = "none";
        computerSaysGoMessage.style.opacity = 0;
        computerSaysGoMessage.positionLeftFunction = "gameContainer.innerWidth*0.5 - 115*0.5 + 'px'";
        computerSaysGoMessage.positionTopFunction = "GetHandCardPosition(false, false, 2)[1] + 15 + 'px'";
        computerSaysGoMessage.style.left = eval(computerSaysGoMessage.positionLeftFunction);
        computerSaysGoMessage.style.top = eval(computerSaysGoMessage.positionTopFunction);
        computerSaysGoMessage.style.visibility = "visible";

        computerSaysGoMessage.style.transition = "0.2s linear";
        computerSaysGoMessage.style.opacity = 1;
    }

    function HideMessageComputerSaysGo() {
        var computerSaysGoMessage = document.getElementById('computer_says_go');
        computerSaysGoMessage.style.transition = "0.1s linear";
        computerSaysGoMessage.style.opacity = 0;
        setTimeout(function () {
            computerSaysGoMessage.style.visibility = 'hidden';
        }, 100);
    }

    function GetPeggingPointsLastPlay() {
        return CribbageGame.GetPeggingPointsForCards(currentPeggingCards);
    }

    function PlayNextPeggingCardForComputer() {
        var computerPlay = computerPlayer.SelectNextCardForPegging(skillLevel, computersHand, currentPeggingCount, currentPeggingCards, deadPeggingCards, topCard)
        if (computerPlay === undefined) {
            // This is a go
            return undefined;
        } else {
            computersHand[computersHand.indexOf(computerPlay)] = null;
            currentPeggingCards.push(computerPlay);
            computerPlayedPeggingCards.push(computerPlay);
            AnimateCardViewToPeggingPile(computerPlay.cardView, false, true);
            return computerPlay;
        }
    }

    function AnimateCardViewToPeggingPile(cardView, isPlayersCard, animate) {
        cardView.style.transition = animate ? "0.3s ease-out" : "none";
        cardView.positionLeftFunction = "GetPeggingFirstCardPosition()[0] + (" + currentPeggingCards.length + ")*peggingCardsOverlap + 'px'";
        if (isPlayersCard) {
            cardView.positionTopFunction = "GetPeggingFirstCardPosition()[1] + " + peggingCardsVerticalOffset + " + 'px'";
        } else {
            cardView.positionTopFunction = "GetPeggingFirstCardPosition()[1] - " + peggingCardsVerticalOffset + " + 'px'";
        }
        cardView.style.left = eval(cardView.positionLeftFunction);
        cardView.style.top = eval(cardView.positionTopFunction);
        if (animate) {
            setTimeout(function () {
                cardView.style.zIndex = currentPeggingCards.length;
                if (!isPlayersCard) {
                    flipUpCard(cardView, true);
                }
            }, 30);
        } else {
            cardView.style.zIndex = currentPeggingCards.length;
            if (!isPlayersCard) {
                flipUpCard(cardView, false);
            }
        }

        // Update the pegging count
        currentPeggingCount += cardView.card.value;
        var pCount = currentPeggingCount;
        if (animate) {
            if (isPlayersCard) {
                SetPeggingCountAnimated(pCount, 300);
            } else {
                SetPeggingCountAnimated(pCount, 600);
            }
        }
    }

    function OnResetPeggingCount() {
        HideMessageUserMustSayGo();
        HideMessageComputerSaysGo();

        // Move all the cards to the dead pile
        for (var i = 0; i < currentPeggingCards.length; i++) {
            deadPeggingCards.push(currentPeggingCards[i]);
        }
        currentPeggingCards = [];

        for (var i = 0; i < deadPeggingCards.length; i++) {
            var deadCard = deadPeggingCards[i];
            deadCard.cardView.positionLeftFunction = "GetPeggingDeadPileFirstCardLeftPosition() + " + i + "*peggingDeadCardsOverlap + 'px'";
            deadCard.cardView.style.transition = "0.4s ease-out";
            deadCard.cardView.style.left = eval(deadCard.cardView.positionLeftFunction);
            deadCard.cardView.style.zIndex = i;
        }

        peggingCountText.innerHTML = "0";
        currentPeggingCount = 0;
        playerSaysGo = false;
        computerSaysGo = false;
    }

    function UpdatePeggingAverageRecord() {
        var computerPeggingPointsThisRound = computerScore - recordComputerPeggingStartingScore;
        var playerPeggingPointsThisRound = playerScore - recordPlayerPeggingStartingScore;
        computerPeggingPointsTotal = computerPeggingPointsTotal + computerPeggingPointsThisRound;
        playerPeggingPointsTotal = playerPeggingPointsTotal + playerPeggingPointsThisRound;

        var setting = 'stat_pegging_count_' + skillLevel;
        var settingVal = game.settings.GetStatistic(setting);
        game.settings.SetStatistic(setting, settingVal + 1);
        setting = 'stat_pegging_points_' + skillLevel;
        settingVal = game.settings.GetStatistic(setting);
        game.settings.SetStatistic(setting, settingVal + playerPeggingPointsThisRound);
    }

    function OnPeggingFinished() {
        UpdatePeggingAverageRecord();
        HidePeggingPrompt();
        HideMessageComputerSaysGo();
        HideMessageUserMustSayGo();
        peggingCountIndicator = document.getElementById('PeggingCountIndicator');
        peggingCountIndicator.style.transition = "0.2s linear";
        peggingCountIndicator.style.opacity = 0;
        setTimeout(function () {
            peggingCountIndicator.style.visibility = "hidden";
        }, 300);

        AnimateCardsBackForCounting();
    }

    function AnimateCardsBackForCounting() {
        currentMoveStage = 'AnimatingScoresForHands';

        playerPlayedPeggingCards.sort(function (a, b) { return a.rank - b.rank; });
        computerPlayedPeggingCards.sort(function (a, b) { return a.rank - b.rank; });
        playersHand = playerPlayedPeggingCards;
        computersHand = computerPlayedPeggingCards;
        setTimeout(function () {
            for (var i = 0; i < playerPlayedPeggingCards.length; i++) {
                var cardView = playerPlayedPeggingCards[i].cardView;
                cardView.positionLeftFunction = "GetHandCardPosition(true, false, " + i + ")[0] + 'px'";
                cardView.positionTopFunction = "GetHandCardPosition(true, false, " + i + ")[1] + 'px'";
                cardView.positionIndex = i;
                cardView.isClickable = true;
                cardView.style.zIndex = i + 100;
                with (cardView.style) {
                    transition = "0.5s ease-out";
                    left = eval(cardView.positionLeftFunction);
                    top = eval(cardView.positionTopFunction);
                };
            }
            for (var i = 0; i < computerPlayedPeggingCards.length; i++) {
                var cardView = computerPlayedPeggingCards[i].cardView;
                cardView.positionLeftFunction = "GetHandCardPosition(false, false, " + i + ")[0] + 'px'";
                cardView.positionTopFunction = "GetHandCardPosition(false, false, " + i + ")[1] + 'px'";
                cardView.positionIndex = i;
                cardView.isClickable = true;
                cardView.style.zIndex = i + 100;
                with (cardView.style) {
                    transition = "0.5s ease-out";
                    left = eval(cardView.positionLeftFunction);
                    top = eval(cardView.positionTopFunction);
                };
            }
        }, 50)

        setTimeout(function () {
            if (isPlayersCrib) {
                CountPointsForComputer();
            } else {
                CountPointsForPlayer();
            }
        }, 1000);
    }

    function CountPointsForPlayer() {
        if (game.settings.GetSetting('setting_manual_count_scores')) {
            ManualCountHandForPlayer();
        } else {
            AutoCountHandForPlayer();
        }
    }

    var isManuallyCountingTheCrib = false;
    var currentSetOfManualCountCards = [];
    var manualScoringPointsAvailable = [];
    var currentManualSelectedScoringPoints = null;
    var currentCountedManualPoints = [];

    function ManualCountHandForPlayer() {
        isManuallyCountingTheCrib = false;
        InitializeManualCountingOfCards(playersHand, false);
    }

    function InitializeManualCountingOfCards(cards, isCrib) {

        if (skillLevel === 'Easy' || game.settings.GetSetting('setting_hints')) {
            setTimeout(function () {
                ShowHintButton();
            }, 1000);
        }
        
        currentManualSelectedScoringPoints = null;
        currentCountedManualPoints = [];

        var acceptButton = document.getElementById('ManualCountAcceptButton');
        var mugginsEnabled = game.settings.GetSetting('setting_muggins');
        acceptButton.disabled = !mugginsEnabled;
        acceptButton.style.visibility = 'visible';
        document.getElementById('ManualPointConfirmButton').style.visibility = 'hidden';
        document.getElementById('ManualScoreBubblePoints').innerHTML = "0";
        document.getElementById('ManualPointsDesc').innerHTML = "";
        
        manualScoringPointsAvailable = CribbageGame.GetPointsForHand(cards, topCard, isCrib);
        for (var i=0; i<manualScoringPointsAvailable.length; i++) {
            manualScoringPointsAvailable[i].pointsCounted = false;
        }
        UpdateEnabledStateOfManualCountingFinishedButton();

        var manualCountView = document.getElementById('ManualCount');
        manualCountView.style.zIndex = 700;
        manualCountView.positionLeftFunction = "GetManualCountViewPosition()[0] + 'px'";
        manualCountView.positionTopFunction = "GetManualCountViewPosition()[1] + 'px'";
        manualCountView.style.transition = "none all";
        manualCountView.style.opacity = 0;
        manualCountView.style.visibility = 'visible';
        manualCountView.style.left = eval(manualCountView.positionLeftFunction);
        manualCountView.style.top = eval(manualCountView.positionTopFunction);
        setTimeout(function() {
            manualCountView.style.transition = "0.3s linear";
            manualCountView.style.opacity = 1;
        },200);

        ShowManualCountingPrompt(300);

        currentSetOfManualCountCards = cards;
        for (var i=0; i<cards.length; i++) {
            cards[i].cardView.isClickable = true;
        }
        topCard.cardView.isClickable = true;
        for (var i=0; i<computersHand.length; i++) {
            computersHand[i].cardView.isClickable = false;
        }

        currentMoveStage = 'WaitingForUserToManuallyCount';
    }

    function UpdateEnabledStateOfManualCountingFinishedButton() {
        var mugginsEnabled = game.settings.GetSetting('setting_muggins');
        var acceptButton = document.getElementById('ManualCountAcceptButton');
        if (mugginsEnabled) {
            acceptButton.disabled = false;
        } else {
            var pointsAvailable = false;
            for (var i=0; i<manualScoringPointsAvailable.length; i++) {
                if (!manualScoringPointsAvailable[i].pointsCounted) {
                    pointsAvailable = true;
                    break;
                }
            }
            acceptButton.disabled = pointsAvailable;
        }
    }

    function ShowManualCountingPrompt(delay) {
        var manualPrompt = document.getElementById('manual_prompt');
        manualPrompt.style.transition = "none";
        manualPrompt.positionLeftFunction = "GetManualPromptPosition()[0] + 'px'";
        manualPrompt.positionTopFunction = "GetManualPromptPosition()[1] + 'px'";
        manualPrompt.style.left = eval(manualPrompt.positionLeftFunction);
        manualPrompt.style.top = eval(manualPrompt.positionTopFunction);
        setTimeout(function () {
            manualPrompt.style.visibility = "visible";
            manualPrompt.style.transition = "0.3s";
            manualPrompt.style.opacity = 1;
        }, delay);
    }

    function HideManualCountingPrompt() {
        var manualPrompt = document.getElementById('manual_prompt');
        manualPrompt.style.transition = "0.3s";
        manualPrompt.style.opacity = 0;
    }

    this.OnAllCountedOKClick = function() {
        var allCounted = document.getElementById('allcounted');
        allCounted.style.opacity = 0;
        allCounted.style.visibility = 'hidden';

        // Just move on because the user is finished counting
        this.OnManualCountAcceptClick();
    }

    function AnalyzeSelectedCardsForManualCounting() {
        var selectedCards = [];
        for (var i=0; i<currentSetOfManualCountCards.length; i++) {
            if (currentSetOfManualCountCards[i].cardView.isSlidUp) {
                selectedCards.push(currentSetOfManualCountCards[i]);
            }
        }
        if (topCard.cardView.isSlidUp) {
            selectedCards.push(topCard);
        }

        for (var i=0; i<manualScoringPointsAvailable.length; i++) {
            if (manualScoringPointsAvailable[i].cards.length === selectedCards.length && !manualScoringPointsAvailable[i].pointsCounted) {
                var matchCount = 0;
                for (var j=0; j<manualScoringPointsAvailable[i].cards.length; j++) {
                    if (selectedCards.indexOf(manualScoringPointsAvailable[i].cards[j]) !== -1) {
                        matchCount = matchCount + 1;
                    }
                }

                if (matchCount === selectedCards.length) {
                    ShowManualCountSubsetSubmitButton(manualScoringPointsAvailable[i]);
                    return;
                }
            }
        }

        HideConfirmPointsButton();
    }

    function ShowManualCountSubsetSubmitButton(availablePoints) {
        currentManualSelectedScoringPoints = availablePoints;
        var button = document.getElementById('ManualPointConfirmButton');
        button.innerHTML = "Click here to add:<br>" + availablePoints.description + " for " + availablePoints.points;
        button.style.visibility = 'visible';
        button.style.opacity = 1;
    }

    function HideConfirmPointsButton() {
        var button = document.getElementById('ManualPointConfirmButton');
        button.style.visibility = 'hidden';
        button.style.opacity = 0;
    }

    this.OnManualPointConfirmClick = function() {
        if (currentManualSelectedScoringPoints !== null) {
            
            currentManualSelectedScoringPoints.pointsCounted = true;
            currentCountedManualPoints.push(currentManualSelectedScoringPoints);
            
            var scoreInfo = GenerateScoreDescriptions(currentCountedManualPoints);
            var scoreDescriptionHTML = scoreInfo[0];
            var totalScore = scoreInfo[1];
            var desc = document.getElementById('ManualPointsDesc');
            desc.innerHTML = scoreDescriptionHTML;
            var pointBubble = document.getElementById('ManualScoreBubblePoints');
            pointBubble.innerHTML = totalScore;

            // Show points animation without incrementing the score
            AnimateManualPoint(currentManualSelectedScoringPoints, topCard);
            
            for (var i=0; i<currentSetOfManualCountCards.length; i++) {
                slideDownCard(currentSetOfManualCountCards[i].cardView);
            }
            slideDownCard(topCard.cardView);

            HideConfirmPointsButton();
            UpdateEnabledStateOfManualCountingFinishedButton();
        }
    }

    var mugginsPoints = [];

    this.OnManualCountAcceptClick = function() {
        if (currentMoveStage !== 'WaitingForUserToManuallyCount') {
            return;
        }

        currentMoveStage = "";
        var allCounted = document.getElementById('allcounted');
        allCounted.style.opacity = 0;
        allCounted.style.visibility = 'hidden';
        HideHintButton();
        HideManualCountingPrompt();
        
        var recordedScore = 0;
        for (var i=0; i<currentCountedManualPoints.length; i++) {
            recordedScore = recordedScore + currentCountedManualPoints[i].points;
        }
        playerScore = playerScore + recordedScore;
        scoreboard.SetScorePlayer(playerScore);

        // Update stats
        if (isManuallyCountingTheCrib) {
            playerCribPointsTotal = playerCribPointsTotal + recordedScore;
            var setting = 'stat_cribs_count_' + skillLevel;
            var settingVal = this.settings.GetStatistic(setting);
            this.settings.SetStatistic(setting, settingVal + 1);
            setting = 'stat_cribs_points_' + skillLevel;
            settingVal = this.settings.GetStatistic(setting);
            this.settings.SetStatistic(setting, settingVal + recordedScore);
        } else {
            playerHandPointsTotal = playerHandPointsTotal + recordedScore;
            var setting = 'stat_hands_count_' + skillLevel;
            var settingVal = this.settings.GetStatistic(setting);
            this.settings.SetStatistic(setting, settingVal + 1);
            setting = 'stat_hands_points_' + skillLevel;
            settingVal = this.settings.GetStatistic(setting);
            this.settings.SetStatistic(setting, settingVal + recordedScore);
        }

        if (this.settings.GetSetting('setting_muggins') && !isGameOver()) {
            mugginsPoints = [];
            var mugginsScore = 0;
            for (var i=0; i<manualScoringPointsAvailable.length; i++) {
                if (!manualScoringPointsAvailable[i].pointsCounted) {
                    mugginsPoints.push(manualScoringPointsAvailable[i]);
                    mugginsScore = mugginsScore + manualScoringPointsAvailable[i].points;
                }
            }

            if (mugginsPoints.length > 0) {
                if (isManuallyCountingTheCrib) {
                    computerCribPointsTotal = computerCribPointsTotal + mugginsScore;
                } else {
                    computerHandPointsTotal = computerHandPointsTotal + mugginsScore;
                }

                var manualCountView = document.getElementById('ManualCount');
                ShakeMugginsView(manualCountView);

                setTimeout(function() {
                    var delay = RegisterAndAnimateHandScores(mugginsPoints, false, isManuallyCountingTheCrib, topCard);
                    setTimeout(function () {
                        ShowMugginsScoreView(mugginsPoints);
                        ShowRecountButton();
                    }, delay);
                }, 1200);
            }
        } else {

            var manualCountView = document.getElementById('ManualCount');
            manualCountView.style.opacity = 0;
            manualCountView.style.visibility = 'hidden';

            if (isGameOver()) {
                AnimateGameFinished();
                return;
            }

            MoveOnAfterCountingHand();
        }
    }

    function ShowMugginsScoreView(scoringPoints, isPlayersPoints) {
        var HandScoreView = document.getElementById('HandScoreView');
        var HandScoreTitle = document.getElementById('HandScoreTitle');
        var HandScoreBubble = document.getElementById('HandScoreBubble');
        var HandScoreBubblePoints = document.getElementById('HandScoreBubblePoints');
        var HandScoreBubblePointsLabel = document.getElementById('HandScoreBubblePointsLabel');
        var HandScorePointsDescription = document.getElementById('HandScorePointsDescription');
        var HandScoreAcceptButton = document.getElementById('HandScoreAcceptButton');

        HandScoreView.style.zIndex = 701;
        HandScoreView.positionLeftFunction = "GetHandScoreViewPosition(false)[0] + 'px'";
        HandScoreView.positionTopFunction = "GetHandScoreViewPosition(false)[1] + 'px'";
        HandScoreView.style.transition = "none all";
        HandScoreView.style.opacity = 0;
        HandScoreView.style.left = eval(HandScoreView.positionLeftFunction);
        HandScoreView.style.top = eval(HandScoreView.positionTopFunction);

        HandScoreAcceptButton.onclick = game.OnAcceptMugginsScore;
        
        var scoreStats = GenerateScoreDescriptions(scoringPoints);
        var scoreDescriptionHTML = scoreStats[0];
        var totalScore = scoreStats[1];
        HandScorePointsDescription.innerHTML = scoreDescriptionHTML;

        HandScoreBubblePoints.innerText = totalScore;
        HandScoreBubblePointsLabel.innerText = scoringPoints == 1 ? "point" : "points";
        HandScoreBubble.style.background = "rgb(190, 0, 0)";
        HandScoreTitle.innerText = "Muggins:";
        
        setTimeout(function () {
            HandScoreView.style.visibility = "visible";
            HandScoreView.style.transition = "0.3s linear";
            HandScoreView.style.opacity = 1;
        }, 100);
    }

    this.OnAcceptMugginsScore = function() {
        var manualCountView = document.getElementById('ManualCount');
        manualCountView.style.opacity = 0;
        manualCountView.style.visibility = 'hidden';
        HideHandScoreView();
        HideRecountButton();
        if (isGameOver()) {
            AnimateGameFinished();
            return;
        }
        
        MoveOnAfterCountingHand();
    }

    function MoveOnAfterCountingHand() {
        if (isManuallyCountingTheCrib) {
            AnimateCompletionOfCribCounting();
        } else {
            if (isPlayersCrib) {
                CollectHandCardsToPrepareCribCount();
            } else {
                setTimeout(function () {
                    CountPointsForComputer();
                }, 300);
            }
        }
    }

    function AutoCountHandForPlayer() {
        var scoringPoints = CribbageGame.GetPointsForHand(playersHand, topCard, false);

        var recordHandScore = 0;
        for (var i = 0; i < scoringPoints.length; i++) {
            recordHandScore = recordHandScore + scoringPoints[i].points;
        }

        playerHandPointsTotal = playerHandPointsTotal + recordHandScore;
        var setting = 'stat_hands_count_' + skillLevel;
        var settingVal = game.settings.GetStatistic(setting);
        game.settings.SetStatistic(setting, settingVal + 1);
        setting = 'stat_hands_points_' + skillLevel;
        settingVal = game.settings.GetStatistic(setting);
        game.settings.SetStatistic(setting, settingVal + recordHandScore);

        var delay = RegisterAndAnimateHandScores(scoringPoints, true, false, topCard);
        setTimeout(function () {
            ShowTotalHandScoreView(scoringPoints, true, false);
            ShowRecountButton();
        }, delay);
    }

    function ShowTotalHandScoreView(scoringPoints, isPlayersPoints, isCrib) {
        var HandScoreView = document.getElementById('HandScoreView');
        var HandScoreTitle = document.getElementById('HandScoreTitle');
        var HandScoreBubble = document.getElementById('HandScoreBubble');
        var HandScoreBubblePoints = document.getElementById('HandScoreBubblePoints');
        var HandScoreBubblePointsLabel = document.getElementById('HandScoreBubblePointsLabel');
        var HandScorePointsDescription = document.getElementById('HandScorePointsDescription');
        var HandScoreAcceptButton = document.getElementById('HandScoreAcceptButton');

        HandScoreView.style.zIndex = 700;
        HandScoreView.positionLeftFunction = "GetHandScoreViewPosition(" + isPlayersPoints + ")[0] + 'px'";
        HandScoreView.positionTopFunction = "GetHandScoreViewPosition(" + isPlayersPoints + ")[1] + 'px'";
        HandScoreView.style.transition = "none all";
        HandScoreView.style.opacity = 0;
        HandScoreView.style.left = eval(HandScoreView.positionLeftFunction);
        HandScoreView.style.top = eval(HandScoreView.positionTopFunction);

        if (isCrib) {
            HandScoreAcceptButton.onclick = game.OnAcceptCribScoreClick;
        } else if (isPlayersPoints) {
            HandScoreAcceptButton.onclick = game.OnAcceptPlayerHandScoreClick;
        } else {
            HandScoreAcceptButton.onclick = game.OnAcceptComputerHandScoreClick;
        }

        var scoreStats = GenerateScoreDescriptions(scoringPoints);
        var scoreDescriptionHTML = scoreStats[0];
        var totalScore = scoreStats[1];
        HandScorePointsDescription.innerHTML = scoreDescriptionHTML;

        HandScoreBubblePoints.innerText = totalScore;
        HandScoreBubblePointsLabel.innerText = scoringPoints == 1 ? "point" : "points";
        if (isPlayersPoints) {
            HandScoreBubble.style.background = "rgb(0, 0, 190)";
            if (isCrib) {
                HandScoreTitle.innerText = "Your crib:";
            } else {
                HandScoreTitle.innerText = "Your hand:";
            }
        } else {
            HandScoreBubble.style.background = "rgb(190, 0, 0)";
            if (isCrib) {
                HandScoreTitle.innerText = "Opponent crib:";
            } else {
                HandScoreTitle.innerText = "Opponent hand:";
            }
        }

        setTimeout(function () {
            HandScoreView.style.visibility = "visible";
            HandScoreView.style.transition = "0.3s linear";
            HandScoreView.style.opacity = 1;
        }, 100);
    }

    function GenerateScoreDescriptions(scoringPoints) {
        var scoreDescriptionHTML = "";
        var totalScore = 0;
        // First combine and count 15s and pairs and runs of three
        var fifteensCount = 0;
        var pairsCount = 0;
        var runsOf3Count = 0;
        var runsOf4Count = 0;
        var runsOf5Count = 0;
        for (var i = 0; i < scoringPoints.length; i++) {
            if (scoringPoints[i].descriptionID == 0) {
                fifteensCount = fifteensCount + 1;
            } else if (scoringPoints[i].descriptionID == 1) {
                pairsCount = pairsCount + 1;
            } else if (scoringPoints[i].descriptionID == 4) {
                if (scoringPoints[i].points == 3) {
                    runsOf3Count = runsOf3Count + 1;
                } else if (scoringPoints[i].points == 4) {
                    runsOf4Count = runsOf4Count + 1;
                } else if (scoringPoints[i].points == 5) {
                    runsOf5Count = runsOf5Count + 1;
                }
            }
        }
        if (fifteensCount > 0) {
            if (fifteensCount == 1) {
                scoreDescriptionHTML = scoreDescriptionHTML + "Fifteen for 2<br>";
            } else {
                scoreDescriptionHTML = scoreDescriptionHTML + fifteensCount + " Fifteens for " + 2 * fifteensCount + "<br>";
            }
        }
        if (pairsCount > 0) {
            if (pairsCount == 1) {
                scoreDescriptionHTML = scoreDescriptionHTML + "Pair for 2<br>";
            } else {
                scoreDescriptionHTML = scoreDescriptionHTML + pairsCount + " Pair for " + 2 * pairsCount + "<br>";
            }
        }
        if (runsOf3Count > 0) {
            if (runsOf3Count == 1) {
                scoreDescriptionHTML = scoreDescriptionHTML + "Run of 3 for 3<br>";
            } else {
                scoreDescriptionHTML = scoreDescriptionHTML + runsOf3Count + " Runs of 3 for " + 3 * runsOf3Count + "<br>";
            }
        }
        if (runsOf4Count > 0) {
            if (runsOf4Count == 1) {
                scoreDescriptionHTML = scoreDescriptionHTML + "Run of 4 for 4<br>";
            } else {
                scoreDescriptionHTML = scoreDescriptionHTML + runsOf4Count + " Runs of 4 for " + 4 * runsOf4Count + "<br>";
            }
        }
        if (runsOf5Count > 0) {
            if (runsOf5Count == 1) {
                scoreDescriptionHTML = scoreDescriptionHTML + "Run of 5 for 5<br>";
            } else {
                scoreDescriptionHTML = scoreDescriptionHTML + runsOf5Count + " Runs of 5 for " + 5 * runsOf5Count + "<br>";
            }
        }

        // Then count the rest of the points
        for (var i = 0; i < scoringPoints.length; i++) {
            totalScore = totalScore + scoringPoints[i].points;
            if (scoringPoints[i].descriptionID == 0 || scoringPoints[i].descriptionID == 1 || scoringPoints[i].descriptionID == 4) {
                continue;
            }
            scoreDescriptionHTML = scoreDescriptionHTML + scoringPoints[i].description + " for " + scoringPoints[i].points + "<br>";
        }

        return [scoreDescriptionHTML, totalScore];
    }

    function HideHandScoreView() {
        var HandScoreView = document.getElementById('HandScoreView');
        HandScoreView.style.transition = "0.1s linear";
        HandScoreView.style.opacity = 0;
        HandScoreView.style.visibility = 'hidden';
    }

    var currentRecountScoringPoints;
    var currentRecountScoringIsPlayersPoints;
    var currentRecountScoringIsCrib;
    var currentRecountScoringTopCard;

    function RegisterAndAnimateHandScores(points, isPlayersPoints, isCrib, topCard) {

        currentRecountScoringPoints = points;
        currentRecountScoringIsPlayersPoints = isPlayersPoints;
        currentRecountScoringIsCrib = isCrib;
        currentRecountScoringTopCard = topCard;

        var delay = 0;
        var totalScore = 0;
        for (var i = 0; i < points.length; i++) {
            totalScore = totalScore + points[i].points;
        }

        if (game.settings.GetSetting('setting_fast_count')) {
            if (isPlayersPoints) {
                playerScore = playerScore + totalScore;
                setTimeout(function () {
                    scoreboard.SetScorePlayer(playerScore);
                }, 400);
            } else {
                computerScore = computerScore + totalScore;
                setTimeout(function () {
                    scoreboard.SetScoreOpp(computerScore);
                }, 400);
            }
        } else {
            delay = AnimateHandScores(points, isPlayersPoints, isCrib, topCard);
            setTimeout(function () {
                if (isPlayersPoints) {
                    playerScore = playerScore + totalScore;
                    scoreboard.SetScorePlayer(playerScore);
                } else {
                    computerScore = computerScore + totalScore;
                    scoreboard.SetScoreOpp(computerScore);
                }
            }, delay);
        }

        return delay;
    }

    function AnimateManualPoint(point, topCard) {
        var includesTopCard = false;
        var position = [0, 0];
        for (var j = 0; j < point.cards.length; j++) {
            // Skip the top card location
            if (point.cards[j] === topCard) {
                includesTopCard = true;
                continue;
            }
            var xString = eval(point.cards[j].cardView.positionLeftFunction);
            var yString = eval(point.cards[j].cardView.positionTopFunction);
            position[0] = position[0] + Number(xString.substring(0, xString.length - 2));
            position[1] = position[1] + Number(yString.substring(0, yString.length - 2));
        }
        if (includesTopCard) {
            position[0] = position[0] / (point.cards.length - 1);
            position[1] = position[1] / (point.cards.length - 1);
        } else {
            position[0] = position[0] / point.cards.length;
            position[1] = position[1] / point.cards.length;
        }
        AnimateScoreBubble(position, point.points, point.description, true, 0);
    }

    function AnimateHandScores(points, isPlayersPoints, isCrib, topCard) {

        var bubblePositions = [];
        for (var i = 0; i < points.length; i++) {
            var includesTopCard = false;
            var position = [0, 0];
            for (var j = 0; j < points[i].cards.length; j++) {
                // Skip the top card location
                if (points[i].cards[j] === topCard) {
                    includesTopCard = true;
                    continue;
                }
                var xString = eval(points[i].cards[j].cardView.positionLeftFunction);
                var yString = eval(points[i].cards[j].cardView.positionTopFunction);
                position[0] = position[0] + Number(xString.substring(0, xString.length - 2));
                position[1] = position[1] + Number(yString.substring(0, yString.length - 2));
            }
            if (includesTopCard) {
                position[0] = position[0] / (points[i].cards.length - 1);
                position[1] = position[1] / (points[i].cards.length - 1);
            } else {
                position[0] = position[0] / points[i].cards.length;
                position[1] = position[1] / points[i].cards.length;
            }
            bubblePositions.push(position);
        }

        var delay = 100;
        for (var i = 0; i < points.length; i++) {
            AnimateScoreBubble(bubblePositions[i], points[i].points, points[i].description, isPlayersPoints, delay + 200);
            BumpCards(points[i].cards, delay);
            delay = delay + bubbleScoreVisibleDuration;
        }

        return delay;
    }

    function CountPointsForComputer() {
        var scoringPoints = CribbageGame.GetPointsForHand(computersHand, topCard, false);
        var recordHandScore = 0;
        for (var i = 0; i < scoringPoints.length; i++) {
            recordHandScore = recordHandScore + scoringPoints[i].points;
        }
        computerHandPointsTotal = computerHandPointsTotal + recordHandScore;

        var moveCardsDelay = 200;
        if (scoreboard.isCompact) {
            moveCardsDelay = 600;
        }
        // Slide all of the cards to their counting position
        for (var i = 0; i < computersHand.length; i++) {
            var cardView = computersHand[i].cardView;
            cardView.transition = "0.3s ease-out";
            cardView.positionLeftFunction = "GetComputerHandCountingPosition(" + i + ")[0] + 'px'";
            cardView.positionTopFunction = "GetComputerHandCountingPosition(" + i + ")[1] + 'px'";
            cardView.style.left = eval(cardView.positionLeftFunction);
            cardView.style.top = eval(cardView.positionTopFunction);
        }

        setTimeout(function () {
            var delay = RegisterAndAnimateHandScores(scoringPoints, false, false, topCard);
            setTimeout(function () {
                ShowTotalHandScoreView(scoringPoints, false, false);
                ShowRecountButton();
            }, delay);
        }, moveCardsDelay);
    }

    function ShowRecountButton() {
        var recountButton = document.getElementById('RecountHandsView');
        recountButton.style.transition = "none";
        recountButton.positionLeftFunction = "GetRecountButtonPosition(" + currentRecountScoringIsPlayersPoints + ")[0] + 'px'";
        recountButton.positionTopFunction = "GetRecountButtonPosition(" + currentRecountScoringIsPlayersPoints + ")[1] + 'px'";
        recountButton.style.left = eval(recountButton.positionLeftFunction);
        recountButton.style.top = eval(recountButton.positionTopFunction);
        recountButton.style.opacity = 0;
        recountButton.style.visibility = "visible";
        setTimeout(function () {
            recountButton.style.transition = "0.2s linear";
            recountButton.style.opacity = 1;
        }, 50);
    }

    function HideRecountButton() {
        var recountButton = document.getElementById('RecountHandsView');
        recountButton.style.transition = "0.2s linear";
        recountButton.style.opacity = 0;
        setTimeout(function () {
            recountButton.style.visibility = "hidden";
        }, 200);
    }

    this.OnRecountButtonClick = function () {
        var handScoreView = document.getElementById('HandScoreView');
        handScoreView.style.transition = "0.2s linear";
        handScoreView.style.opacity = 0;
        var recountButton = document.getElementById('RecountHandsView');
        recountButton.style.pointerEvents = "none";
        recountButton.style.opacity = 0;
        var handScoreAcceptButton = document.getElementById('HandScoreAcceptButton');
        handScoreAcceptButton.style.pointerEvents = "none";
        setTimeout(function () {
            var delay = AnimateHandScores(currentRecountScoringPoints, currentRecountScoringIsPlayersPoints, currentRecountScoringIsCrib, currentRecountScoringTopCard);
            setTimeout(function () {
                handScoreView.style.opacity = 1;
                handScoreAcceptButton.style.pointerEvents = "auto";
                recountButton.style.pointerEvents = "auto";
                recountButton.style.opacity = 1;
            }, delay);
        }, 300);
    }

    this.OnAcceptPlayerHandScoreClick = function () {
        HideRecountButton();
        HideHandScoreView();

        if (isGameOver()) {
            AnimateGameFinished();
            return;
        }

        if (isPlayersCrib) {
            CollectHandCardsToPrepareCribCount();
        } else {
            setTimeout(function () {
                CountPointsForComputer();
            }, 300);
        }
    }

    this.OnAcceptComputerHandScoreClick = function () {
        HideRecountButton();
        HideHandScoreView();

        if (isGameOver()) {
            AnimateGameFinished();
            return;
        }

        if (!isPlayersCrib) {
            CollectHandCardsToPrepareCribCount();
        } else {
            setTimeout(function () {
                CountPointsForPlayer();
            }, 300);
        }
    }

    function CollectHandCardsToPrepareCribCount() {
        topCard.cardView.style.zIndex = 100;
        for (var i = 0; i < playersHand.length; i++) {
            flipDownCard(playersHand[i].cardView, true);
            flipDownCard(computersHand[i].cardView, true);
            playersHand[i].cardView.style.zIndex = i;
            computersHand[i].cardView.style.zIndex = i;

        }

        setTimeout(function () {
            for (var i = 0; i < playersHand.length; i++) {
                var cardView = playersHand[i].cardView;
                cardView.positionLeftFunction = "GetDeckCardPosition()[0] + 'px'";
                cardView.positionTopFunction = "GetDeckCardPosition()[1] + 'px'";
                cardView.style.transition = "0.5s ease-out";
                cardView.style.transitionDelay = i * 200 + "ms";
                cardView.style.left = eval(cardView.positionLeftFunction);
                cardView.style.top = eval(cardView.positionTopFunction);
                cardView = computersHand[i].cardView;
                cardView.positionLeftFunction = "GetDeckCardPosition()[0] + 'px'";
                cardView.positionTopFunction = "GetDeckCardPosition()[1] + 'px'";
                cardView.style.transition = "0.5s ease-out";
                cardView.style.transitionDelay = i * 200 + "ms";
                cardView.style.left = eval(cardView.positionLeftFunction);
                cardView.style.top = eval(cardView.positionTopFunction);
            }

            var cribOverlap = document.getElementById('crib_indicator_card_overlap');
            cribOverlap.style.transition = "0.5s linear";
            cribOverlap.style.opacity = 0;

            crib.sort(function (a, b) { return a.rank - b.rank; });

            setTimeout(function () {
                cribOverlap.style.visibility = 'hidden';

                for (var i = 0; i < crib.length; i++) {
                    var cribCardView = crib[i].cardView;
                    cribCardView.style.transition = "0.5s ease-out";
                    if (isPlayersCrib) {
                        cribCardView.positionLeftFunction = "GetHandCardPosition(true, false, " + i + ")[0] + 'px'";
                        cribCardView.positionTopFunction = "GetHandCardPosition(true, false, " + i + ")[1] + 'px'";
                    } else {
                        cribCardView.positionLeftFunction = "GetComputerHandCountingPosition(" + i + ")[0] + 'px'";
                        cribCardView.positionTopFunction = "GetComputerHandCountingPosition(" + i + ")[1] + 'px'";
                    }
                    cribCardView.style.zIndex = i;
                    cribCardView.style.left = eval(cribCardView.positionLeftFunction);
                    cribCardView.style.top = eval(cribCardView.positionTopFunction);
                }

                setTimeout(function () {
                    for (var i = 0; i < crib.length; i++) {
                        var cribCardView = crib[i].cardView;
                        flipUpCard(cribCardView, true);
                    }

                    setTimeout(function () {
                        if (isPlayersCrib) {
                            CountCribPointsForPlayer();
                        } else {
                            CountCribPointsForComputer();
                        }
                    }, 400);

                }, 600);
            }, 600);
        }, 500);
    }

    function CountCribPointsForPlayer() {
        if (game.settings.GetSetting('setting_manual_count_scores')) {
            ManualCountCribForPlayer();
        } else {
            AutoCountCribForPlayer();
        }
    }

    function ManualCountCribForPlayer() {
        isManuallyCountingTheCrib = true;
        InitializeManualCountingOfCards(crib, true);
    }

    function AutoCountCribForPlayer() {
        var scoringPoints = CribbageGame.GetPointsForHand(crib, topCard, true);

        var recordCribScore = 0;
        for (var i = 0; i < scoringPoints.length; i++) {
            recordCribScore = recordCribScore + scoringPoints[i].points;
        }

        playerCribPointsTotal = playerCribPointsTotal + recordCribScore;
        var setting = 'stat_cribs_count_' + skillLevel;
        var settingVal = game.settings.GetStatistic(setting);
        game.settings.SetStatistic(setting, settingVal + 1);
        setting = 'stat_cribs_points_' + skillLevel;
        settingVal = game.settings.GetStatistic(setting);
        game.settings.SetStatistic(setting, settingVal + recordCribScore);

        var delay = RegisterAndAnimateHandScores(scoringPoints, true, true, topCard);
        setTimeout(function () {
            ShowTotalHandScoreView(scoringPoints, true, true);
            ShowRecountButton();
        }, delay);
    }

    function CountCribPointsForComputer() {
        var scoringPoints = CribbageGame.GetPointsForHand(crib, topCard, true);

        var recordCribScore = 0;
        for (var i = 0; i < scoringPoints.length; i++) {
            recordCribScore = recordCribScore + scoringPoints[i].points;
        }

        computerCribPointsTotal = computerCribPointsTotal + recordCribScore;

        var delay = RegisterAndAnimateHandScores(scoringPoints, false, true, topCard);
        setTimeout(function () {
            ShowTotalHandScoreView(scoringPoints, false, true);
            ShowRecountButton();
        }, delay);
    }

    this.OnAcceptCribScoreClick = function () {
        HideRecountButton();
        HideHandScoreView();

        if (isGameOver()) {
            AnimateGameFinished();
            return;
        }

        AnimateCompletionOfCribCounting();
    }

    function AnimateCompletionOfCribCounting() {
        flipDownCard(topCard.cardView, true);
        topCard.cardView.style.transition = "0.3s ease-out";
        topCard.cardView.positionLeftFunction = "GetDeckCardPosition()[0] + 'px'";
        topCard.cardView.positionTopFunction = "GetDeckCardPosition()[1] + 'px'";
        topCard.cardView.style.left = eval(topCard.cardView.positionLeftFunction);
        topCard.cardView.style.top = eval(topCard.cardView.positionTopFunction);

        for (var i = 0; i < crib.length; i++) {
            var cardView = crib[i].cardView;
            flipDownCard(cardView, true);
            cardView.style.transition = "0.5s ease-out";
            cardView.style.transitionDelay = 300 + i * 100 + "ms";
            cardView.positionLeftFunction = "GetDeckCardPosition()[0] + 'px'";
            cardView.positionTopFunction = "GetDeckCardPosition()[1] + 'px'";
            cardView.style.left = eval(cardView.positionLeftFunction);
            cardView.style.top = eval(cardView.positionTopFunction);
        }

        setTimeout(function () {
            isPlayersCrib = !isPlayersCrib;
            scoreboard.SetCribIndicator(isPlayersCrib);
            AnimateDealingHands();
        }, 1300);
    }

    function ShowHintButton() {
        var hintButton = document.getElementById('hint_button');
        hintButton.positionLeftFunction = "GetHintButtonPosition()[0] + 'px'";
        hintButton.positionTopFunction = "GetHintButtonPosition()[1] + 'px'";
        hintButton.style.transition = "none";
        hintButton.style.left = eval(hintButton.positionLeftFunction);
        hintButton.style.top = eval(hintButton.positionTopFunction);
        hintButton.style.visibility = 'visible';
        hintButton.style.pointerEvents = "auto";
        setTimeout(function () {
            hintButton.style.opacity = 1;
        }, 20);
    }

    function HideHintButton() {
        var hintButton = document.getElementById('hint_button');
        hintButton.style.opacity = 0;
        hintButton.style.pointerEvents = "none";
    }

    this.OnHintButtonClick = function () {
        BumpHintCards();
    }

    function ShowNoOptimalPlay() {
        var message = document.getElementById('no_hint_view');
        message.style.transition = "none";
        message.style.opacity = 0;
        message.positionLeftFunction = "gameContainer.innerWidth*0.5 - 200*0.5 + 'px'";
        message.positionTopFunction = "GetHandCardPosition(true, false, 2)[1] - 100*0.5 + 'px'";
        message.style.left = eval(message.positionLeftFunction);
        message.style.top = eval(message.positionTopFunction);
        message.style.visibility = "visible";

        message.style.transition = "0.2s linear";
        message.style.opacity = 1;
    }

    this.OnNoHintAcceptedClick = function () {
        var message = document.getElementById('no_hint_view');
        message.style.transition = "0.1s linear";
        message.style.opacity = 0;
        setTimeout(function () {
            message.style.visibility = "hidden";
        }, 100);
    }

    function BumpHintCards() {
        var optimalCards = [];
        if (currentMoveStage === 'WaitingForUserToPlayPeggingCard') {
            var bestMoveInfo = computerPlayer.FindOptimalPeggingCard(playersHand, currentPeggingCount, currentPeggingCards, deadPeggingCards, topCard);
            if (bestMoveInfo[0] === undefined || bestMoveInfo[1] === 0) {
                ShowNoOptimalPlay();
                return;
            } else {
                optimalCards.push(bestMoveInfo[0]);
            }
        } else if (currentMoveStage === 'WaitingForUserToDiscardToCrib') {
            var cards = [];
            for (var i = 0; i < playersHand.length; i++) {
                if (playersHand[i] !== null) {
                    cards.push(playersHand[i]);
                }
            }
            for (var i = 0; i < crib.length; i++) {
                if (crib[i] != null) {
                    cards.push(crib[i]);
                }
            }
            optimalCards = computerPlayer.FindOptimalCribDiscards(cards, isPlayersCrib)[0];
        } else if (currentMoveStage === 'WaitingForUserToManuallyCount') {
            for (var i=0; i<manualScoringPointsAvailable.length; i++) {
                if (!manualScoringPointsAvailable[i].pointsCounted) {
                    BumpCards(manualScoringPointsAvailable[i].cards, 0);
                    return;
                }
            }

            // Show that all points are counted
            var allCounted = document.getElementById('allcounted');
            allCounted.positionLeftFunction = "gameContainer.innerWidth*0.5 - 115*0.5 + 'px'";
            allCounted.positionTopFunction = "GetHandCardPosition(true, false, 2)[1] - 65*0.5 + 'px'";
            allCounted.style.left = eval(allCounted.positionLeftFunction);
            allCounted.style.top = eval(allCounted.positionTopFunction);
            allCounted.style.transition = "none";
            allCounted.style.opacity = 1;
            allCounted.style.visibility = 'visible';
            return;
        }

        BumpCards(optimalCards, 0);
    }

    this.GetMostRecentHandCards = function () {
        return [mostRecentHandCards, mostRecentIsPlayersCrib];
    }

    function AnimateGameFinished() {
        currentMoveStage = "AnimatingGameOver";
        HideMenuButton();
        HideAllMessages();

        // Shake or twist cards
        if (isPlayerWon()) {
            for (var i=0; i<cards.length; i++) {
                TwistCard(cards[i].cardView);
            }
        } else {
            for (var i=0; i<cards.length; i++) {
                ShakeCard(cards[i].cardView);
            }
        }

        // Increment the win statistics
        if (isPlayerWon()) {
            var setting = 'stat_wins_' + skillLevel;
            var settingVal = game.settings.GetStatistic(setting);
            game.settings.SetStatistic(setting, settingVal + 1);
            if (isSkunkGame()) {
                setting = 'stat_skunks_' + skillLevel;
                settingsVal = game.settings.GetStatistic(setting);
                game.settings.SetStatistic(setting, settingsVal + 1);
            }
        } else {
            var setting = 'stat_losses_' + skillLevel;
            var settingVal = game.settings.GetStatistic(setting);
            game.settings.SetStatistic(setting, settingVal + 1);
        }

        // Keep track of suboptimal plays history
        var suboptimalErrorTotal = 0;
        for (var i = 0; i < suboptimalPlays.length; i++) {
            suboptimalErrorTotal = suboptimalErrorTotal + suboptimalPlays[i].optimalScore - suboptimalPlays[i].playedScore;
        }
        var setting = 'stat_suboptimal_history';
        var settingVal = game.settings.GetStatisticString(setting);
        settingVal = settingVal + parseFloat(suboptimalErrorTotal).toFixed(1) + ",";
        game.settings.SetStatistic(setting, settingVal);

        ShowGameOver();

        setTimeout(function () {
            scoreboard.Hide();
        }, 2000);
    }

    function ShowGameOver() {
        var closeButton = document.getElementById('game_over_close_button');
        closeButton.style.transition = "none";
        closeButton.style.opacity = 0;
        closeButton.style.pointerEvents = 'none';

        document.getElementById('GameOverResultText').innerHTML = isPlayerWon() ? "You won!" : "You lost";
        document.getElementById('GameOverSkunkText').style.display = isSkunkGame() ? "block" : "none";

        document.getElementById('GameOverTotalScoreYou').innerText = playerScore;
        document.getElementById('GameOverTotalScoreOpp').innerText = computerScore;
        var percent = 0.5;
        if (playerScore + computerScore > 0) {
            percent = computerScore / (playerScore + computerScore);
        }
        document.getElementById('GameOverTotalFill').style.width = 200 * percent + 'px';

        document.getElementById('GameOverPeggingYou').innerText = playerPeggingPointsTotal;
        document.getElementById('GameOverPeggingOpp').innerText = computerPeggingPointsTotal;
        percent = 0.5;
        if (playerPeggingPointsTotal + computerPeggingPointsTotal > 0) {
            percent = computerPeggingPointsTotal / (playerPeggingPointsTotal + computerPeggingPointsTotal);
        }
        document.getElementById('GameOverPeggingFill').style.width = 200 * percent + 'px';

        document.getElementById('GameOverHandsYou').innerText = playerHandPointsTotal;
        document.getElementById('GameOverHandsOpp').innerText = computerHandPointsTotal;
        percent = 0.5;
        if (playerHandPointsTotal + computerHandPointsTotal > 0) {
            percent = computerHandPointsTotal / (playerHandPointsTotal + computerHandPointsTotal);
        }
        document.getElementById('GameOverHandsFill').style.width = 200 * percent + 'px';

        document.getElementById('GameOverCribsYou').innerText = playerCribPointsTotal;
        document.getElementById('GameOverCribsOpp').innerText = computerCribPointsTotal;
        percent = 0.5;
        if (playerCribPointsTotal + computerCribPointsTotal > 0) {
            percent = computerCribPointsTotal / (playerCribPointsTotal + computerCribPointsTotal);
        }
        document.getElementById('GameOverCribsFill').style.width = 200 * percent + 'px';

        var suboptimalError = 0;
        for (var i = 0; i < suboptimalPlays.length; i++) {
            suboptimalError = suboptimalError + suboptimalPlays[i].optimalScore - suboptimalPlays[i].playedScore;
        }
        document.getElementById('GameOverSuboptimalButton').innerHTML = "You made " + suboptimalPlays.length + " suboptimal plays this game for a cummulative error of " + parseFloat(suboptimalError).toFixed(1) + " points.";

        var suboptimalListView = document.getElementById('GameOverSuboptimalPlaysView');
        suboptimalListView.innerHTML = "";
        var discardsCount = 0;
        var peggingSuboptimalCount = 0;
        for (var i = 0; i < suboptimalPlays.length; i++) {
            if (suboptimalPlays[i].isDiscard) {
                discardsCount = discardsCount + 1;
            } else {
                peggingSuboptimalCount = peggingSuboptimalCount + 1;
            }
        }
        if (discardsCount > 0) {
            var header = document.getElementById('GameOverSuboptimalHeaderTemplate').cloneNode(true);
            header.innerText = "Sub-Optimal Discards";
            header.style.display = "block";
            suboptimalListView.appendChild(header);
            for (var i = 0; i < suboptimalPlays.length; i++) {
                if (suboptimalPlays[i].isDiscard) {
                    var subOptimalView = document.getElementById('GameOverSuboptimalDiscardTemplate').cloneNode(true);
                    subOptimalView.style.display = "block";
                    subOptimalView.suboptimalPlay = suboptimalPlays[i];
                    subOptimalView.children[0].innerHTML = suboptimalPlays[i].isPlayersCrib ? "Hand dealt - Your crib" : "Hand dealt - Opp. crib";
                    suboptimalPlays[i].situationCards.sort(function (a, b) { return a.rank - b.rank; });
                    for (var j = 0; j < 6; j++) {
                        var elem = subOptimalView.children[j + 1];
                        if (j < suboptimalPlays[i].situationCards.length) {
                            var back = suboptimalPlays[i].situationCards[j].image;
                            elem.style.background = back;
                        } else {
                            elem.style.display = "none";
                        }
                    }
                    for (var j = 0; j < suboptimalPlays[i].playedCards.length; j++) {
                        subOptimalView.children[j + 8].style.background = suboptimalPlays[i].playedCards[j].image;
                    }
                    subOptimalView.children[11].innerText = parseFloat(suboptimalPlays[i].playedScore).toFixed(1);
                    for (var j = 0; j < suboptimalPlays[i].optimalCards.length; j++) {
                        subOptimalView.children[j + 14].style.background = suboptimalPlays[i].optimalCards[j].image;
                    }
                    subOptimalView.children[17].innerText = parseFloat(suboptimalPlays[i].optimalScore).toFixed(1);
                    suboptimalListView.appendChild(subOptimalView);
                }
            }
        }
        if (peggingSuboptimalCount > 0) {
            var header = document.getElementById('GameOverSuboptimalHeaderTemplate').cloneNode(true);
            header.innerText = "Sub-Optimal Pegging Plays";
            header.style.display = "block";
            suboptimalListView.appendChild(header);
            for (var i = 0; i < suboptimalPlays.length; i++) {
                if (!suboptimalPlays[i].isDiscard) {
                    var subOptimalView = document.getElementById('GameOverSuboptimalDiscardTemplate').cloneNode(true);
                    subOptimalView.style.display = "block";
                    subOptimalView.className = "GameOverSuboptimalPegging";
                    subOptimalView.children[0].innerHTML = "Pegging pile"
                    for (var j = 0; j < 6; j++) {
                        var elem = subOptimalView.children[j + 1];
                        if (j < suboptimalPlays[i].situationCards.length) {
                            var back = suboptimalPlays[i].situationCards[j].image;
                            elem.style.background = back;
                        } else {
                            elem.style.display = "none";
                        }
                    }

                    subOptimalView.children[8].style.background = suboptimalPlays[i].playedCards[0].image;
                    subOptimalView.children[9].style.display = 'none';
                    subOptimalView.children[10].innerText = "for";
                    subOptimalView.children[11].innerText = parseFloat(suboptimalPlays[i].playedScore).toFixed(1);

                    subOptimalView.children[14].style.background = suboptimalPlays[i].optimalCards[0].image;
                    subOptimalView.children[15].style.display = "none";
                    subOptimalView.children[16].innerText = "for";
                    subOptimalView.children[17].innerText = parseFloat(suboptimalPlays[i].optimalScore).toFixed(1);
                    suboptimalListView.appendChild(subOptimalView);
                }
            }
        }

        var gameOverView = document.getElementById('GameOverView');
        visibleMenuCards.push('GameOverView');
        gameOverView.style.height = isSkunkGame() ? "90px" : "55px";
        gameOverView.style.transition = "none";
        gameOverView.style.transform = "translate(-50%,-50%) scale(0)";
        gameOverView.style.top = "50%";
        gameOverView.style.opacity = 1;
        gameOverView.style.visibility = 'visible';
        setTimeout(function () {
            gameOverView.style.transition = "1s cubic-bezier(0.175, 0.885, 0.320, 1.275)";
            gameOverView.style.transform = "translate(-50%,-50%) scale(1)";
            setTimeout(function () {
                gameOverView.style.transition = "1s linear";
                if (suboptimalPlays.length > 0) {
                    gameOverView.style.height = isSkunkGame() ? '500px' : '457px';
                } else {
                    gameOverView.style.height = isSkunkGame() ? '320px' : '277px';
                }
                closeButton.style.transition = "1s linear";
                closeButton.style.opacity = 1;
                closeButton.style.pointerEvents = 'auto';

            }, 3000);
        }, 1000);
    }

    function HideAllMessages() {
        var viewsToHide = [
            'select_low_card_message',
            'low_card_result_message',
            'low_card_you_text',
            'low_card_computer_text',
            'crib_region',
            'confirm_crib_region',
            'crib_indicator_card_overlap',
            'PeggingCountIndicator',
            'pegging_prompt',
            'computer_says_go',
            'player_says_go',
            'HandScoreView',
            'RecountHandsView',
            'hint_button',
            'SuboptimalWarning',
            'no_hint_view',
            'ManualCount',
            'manual_prompt',
            'allcounted'];
        for (var i = 0; i < viewsToHide.length; i++) {
            var view = document.getElementById(viewsToHide[i]);
            view.style.transition = "none";
            view.style.opacity = 0;
            view.style.visibility = 'hidden';
        }
    }

    this.OnResizeWindow = function OnResizeWindow() {
        
        var ease = "0.6s ease-out";

        // Redraw the scoreboard
        scoreboard.RedrawView();

        // Reposition all the cards
        for (var i = 0; i < cards.length; i++) {
            var cardView = cards[i].cardView;
            cardView.style.left = eval(cardView.positionLeftFunction);
            cardView.style.top = eval(cardView.positionTopFunction);
            cardView.style.transition = ease;
        }

        // Reposition everything else
        var viewsToPosition = [
            'select_low_card_message',
            'low_card_result_message',
            'low_card_you_text',
            'low_card_computer_text',
            'crib_region',
            'confirm_crib_region',
            'crib_indicator_card_overlap',
            'PeggingCountIndicator',
            'pegging_prompt',
            'computer_says_go',
            'player_says_go',
            'HandScoreView',
            'RecountHandsView',
            'hint_button',
            'no_hint_view',
            'ManualCount',
            'manual_prompt',
            'allcounted'];
        for (var i = 0; i < viewsToPosition.length; i++) {
            var view = document.getElementById(viewsToPosition[i]);
            view.style.transition = ease;
            view.style.left = eval(view.positionLeftFunction);
            view.style.top = eval(view.positionTopFunction);
        }
    }

    this.OnTerminateGame = function() {}
    
    //
    // Menus
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
        document.getElementById("setting_manually_count_scores_checkbox").checked = this.settings.GetSetting('setting_manual_count_scores');
        document.getElementById("setting_muggins_checkbox").checked = this.settings.GetSetting('setting_muggins');
        document.getElementById("setting_hints_checkbox").checked = this.settings.GetSetting('setting_hints');
        document.getElementById("setting_warn_suboptimal_checkbox").checked = this.settings.GetSetting('setting_warn_suboptimal');
        document.getElementById("setting_fast_count_checkbox").checked = this.settings.GetSetting('setting_fast_count');
        
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
    
    this.SettingManuallyCountScoresClicked = function(cb) {
        this.settings.SetSetting('setting_manual_count_scores', cb.checked);
    }
    
    this.SettingMugginsClicked = function(cb) {
        this.settings.SetSetting('setting_muggins', cb.checked);
    }
    
    this.SettingHintsClicked = function(cb) {
        this.settings.SetSetting('setting_hints', cb.checked);
    }
    
    this.SettingWarnSuboptimalClicked = function(cb) {
        this.settings.SetSetting('setting_warn_suboptimal', cb.checked);
    }
    
    this.SettingFastCountClicked = function(cb) {
        this.settings.SetSetting('setting_fast_count', cb.checked);
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
        var totalLosses = 0;
        var totalSkunks = 0;
        for (var i=0; i<difficulties.length; i++) {
            var curDifficulty = difficulties[i];
            var wins = this.settings.GetStatistic('stat_wins_' + curDifficulty);
            var losses = this.settings.GetStatistic('stat_losses_' + curDifficulty);
            var skunks = this.settings.GetStatistic('stat_skunks_' + curDifficulty);
            var gamesPlayed = wins + losses;
            var gamesPlayedElement = document.getElementById('menu_stat_games_played_' + curDifficulty);
            var winsElement = document.getElementById('menu_stat_wins_' + curDifficulty);
            var lossesElement = document.getElementById('menu_stat_losses_' + curDifficulty);
            var skunksElement = document.getElementById('menu_stat_skunks_' + curDifficulty);
            var winPercentElement = document.getElementById('menu_stat_win_percent_' + curDifficulty);
            if (gamesPlayed > 0) {
                gamesPlayedElement.innerText = gamesPlayed;
                winsElement.innerText = wins;
                lossesElement.innerText = losses;
                skunksElement.innerText = skunks;
                winPercentElement.innerText = parseFloat(100*wins / gamesPlayed).toFixed(0) + "%";
            } else {
                gamesPlayedElement.innerText = "";
                winsElement.innerText = "";
                lossesElement.innerText = "";
                skunksElement.innerText = "";
                winPercentElement.innerText = "";
            }
            totalGamesPlayed = totalGamesPlayed + gamesPlayed;
            totalWins = totalWins + wins;
            totalLosses = totalLosses + losses;
            totalSkunks = totalSkunks + skunks;
        }
        var gamesPlayedElement = document.getElementById('menu_stat_games_played_Total');
        var winsElement = document.getElementById('menu_stat_wins_Total');
        var lossesElement = document.getElementById('menu_stat_losses_Total');
        var skunksElement = document.getElementById('menu_stat_skunks_Total');
        var winPercentElement = document.getElementById('menu_stat_win_percent_Total');
        if (totalGamesPlayed > 0) {
            gamesPlayedElement.innerText = totalGamesPlayed;
            winsElement.innerText = totalWins;
            lossesElement.innerText = totalLosses;
            skunksElement.innerText = totalSkunks;
            winPercentElement.innerText = parseFloat(100*totalWins / totalGamesPlayed).toFixed(0) + "%";
        } else {
            gamesPlayedElement.innerText = "0";
            winsElement.innerText = "0";
            lossesElement.innerText = "0";
            skunksElement.innerText = "0";
            winPercentElement.innerText = "";
        }
    
        var avgCategories = ['stat_pegging', 'stat_hands', 'stat_cribs'];
        for (var i=0; i<avgCategories.length; i++) {
            var curCategory = avgCategories[i];
            var totalCount = 0;
            var totalPoints = 0;
            for (var j=0; j<difficulties.length; j++) {
                var difficulty = difficulties[j];
                var statName = curCategory + '_count_' + difficulty;
                var peggingRoundsCount = this.settings.GetStatistic(statName);
                totalCount = totalCount + peggingRoundsCount;
                statName = curCategory + '_points_' + difficulty;
                var peggingRoundsTotal = this.settings.GetStatistic(statName);
                totalPoints = totalPoints + peggingRoundsTotal;
                var element = document.getElementById('menu_' + curCategory + '_' + difficulty);
                if (peggingRoundsCount == 0) {
                    element.innerText = "";	
                } else {
                    element.innerText = parseFloat(peggingRoundsTotal / peggingRoundsCount).toFixed(1);
                }	
            }
            var element = document.getElementById('menu_' + curCategory + '_' + 'Total');
            if (totalCount == 0) {
                element.innerText = "";
            } else {
                element.innerText = parseFloat(totalPoints / totalCount).toFixed(1);
            }
        }
    }
    
    this.ResetStatisticsButtonClick = function() {
        var r = confirm("Are you sure you want to reset your statistics?");
        if (r != true) {
            return;
        }
    
        var difficulties = ['Easy', 'Standard', 'Pro'];
        var statsToReset = [
            'stat_pegging_count_',
            'stat_pegging_points_',
            'stat_hands_count_',
            'stat_hands_points_',
            'stat_cribs_count_',
            'stat_cribs_points_',
            'stat_wins_',
            'stat_skunks_',
            'stat_losses_',
        ];
        for (var i=0; i<statsToReset.length; i++) {
            for (var j=0; j<difficulties.length; j++) {
                var statName = statsToReset[i] + difficulties[j];
                window.localStorage.removeItem(statName);
            }
        }
        window.localStorage.removeItem('stat_suboptimal_history');
        this.InitializeStatisticsView();
    }
    
    this.ShowSuboptimalHistoryButtonClick = function() {
        this.InitializeSubOptimalHistoryView();
        var menuName = visibleMenuCards[visibleMenuCards.length-1];
        MenuCardPressDown(menuName);
        MenuCardAppear("menu_suboptimal_history");
    }
    
    this.InitializeSubOptimalHistoryView = function() {
        var historyString = this.settings.GetStatisticString('stat_suboptimal_history');
        var historyItems = historyString.split(",");
        var history = [];
        for (var i=0; i<historyItems.length; i++) {
            if (historyItems[i] !== "") {
                history.push(parseFloat(historyItems[i]));
            }
        }
        
        var historyCanvas = document.getElementById('msoHistory');
        historyCanvas.innerHTML = "";
        var firstGameMessage = document.getElementById('msoNoHistory');
        if (history.length == 0) {
            firstGameMessage.style.visibility = 'visible';
            return;
        } else {
            firstGameMessage.style.visibility = 'hidden';
        }
    
        var maxError = 5;
        for (var i=0; i<history.length; i++) {
            if (history[i] > maxError) {
                maxError = history[i];
            }
        }
        maxError = Math.ceil(maxError*1.1);
    
        var graphWidth = 350;
        var graphHeight = 270;
        var graphPadding = [55,10,50,50]; // left, top right bottom
        var plotRegionHeight = graphHeight - graphPadding[1] - graphPadding[3];
        var plotRegionWidth = graphWidth - graphPadding[0] - graphPadding[2];
        var linesCount =  maxError > 10 ? 10 : 5;
        var linesErrorSpacing = Math.round(maxError / linesCount);
        for (var curError=0; curError<=maxError; curError = curError + linesErrorSpacing) {
            var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.classList.add('msoHLine');
            var curY = graphHeight - graphPadding[3] - (curError/maxError)*plotRegionHeight;
            line.setAttribute('x1', graphPadding[0] - 15);
            line.setAttribute('y1', curY);
            line.setAttribute('x2', graphPadding[0] + plotRegionWidth + 30);
            line.setAttribute('y2', curY);
            historyCanvas.appendChild(line);
    
            var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.classList.add('msoAxisText');
            text.setAttribute('x', graphPadding[0] - 25);
            text.setAttribute('y', curY);
            text.innerHTML = curError;
            historyCanvas.appendChild(text);
        }
    
        var xAxisLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        xAxisLabel.classList.add('msoAxisText');
        xAxisLabel.setAttribute('x', graphPadding[0] + plotRegionWidth/2);
        xAxisLabel.setAttribute('y', graphHeight - 15);
        xAxisLabel.innerHTML = "Games Played";
        historyCanvas.appendChild(xAxisLabel);
    
        var yAxisLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        yAxisLabel.classList.add('msoAxisText');
        yAxisLabel.setAttribute('x', -110);
        yAxisLabel.setAttribute('y', 15);
        yAxisLabel.style.transform = 'rotate(-90deg)';
        yAxisLabel.innerHTML = "Suboptimal Plays (average missed points)";
        historyCanvas.appendChild(yAxisLabel);
    
        if (history.length == 1) {
            var curLeft = graphPadding[0] + plotRegionWidth/2;
            var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.classList.add('msoHLine');
            line.setAttribute('x1', curLeft);
            line.setAttribute('y1', graphHeight - graphPadding[3]);
            line.setAttribute('x2', curLeft);
            line.setAttribute('y2', graphHeight - graphPadding[3] + 3);
            historyCanvas.appendChild(line);
    
            var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.classList.add('msoAxisText');
            text.setAttribute('x', curLeft);
            text.setAttribute('y', graphHeight - graphPadding[3] + 15);
            text.innerHTML = 1;
            historyCanvas.appendChild(text);
    
            var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            dot.setAttribute('cx', curLeft);
            dot.setAttribute('cy', (graphHeight - graphPadding[3] - (history[0]/maxError)*plotRegionHeight));
            dot.setAttribute('r', 3);
            dot.setAttribute('fill', '#2196F3');
            historyCanvas.appendChild(dot);
    
            var lastScore = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            lastScore.classList.add('msoLast');
            lastScore.setAttribute('x', curLeft + 3);
            lastScore.setAttribute('y', (graphHeight - graphPadding[3] - (history[0]/maxError)*plotRegionHeight));
            lastScore.innerHTML = history[0];
            historyCanvas.appendChild(lastScore);
    
        } else {
            var data = "";
            var curLeft = graphPadding[0];
            var xSpacing = plotRegionWidth / (history.length - 1);
            var skip = Math.round(history.length / 5);
            if (skip < 1) {
                skip = 1;
            }
            for (var i=0; i<history.length; i = i + skip) {
                var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.classList.add('msoHLine');
                line.setAttribute('x1', curLeft);
                line.setAttribute('y1', graphHeight - graphPadding[3]);
                line.setAttribute('x2', curLeft);
                line.setAttribute('y2', graphHeight - graphPadding[3] + 3);
                historyCanvas.appendChild(line);
            
                var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.classList.add('msoAxisText');
                text.setAttribute('x', curLeft);
                text.setAttribute('y', graphHeight - graphPadding[3] + 15);
                text.innerHTML = i+1;
                historyCanvas.appendChild(text);
            
                curLeft = curLeft + xSpacing*skip;
            }
        
            curLeft = graphPadding[0];
            for (var i=0; i<history.length; i++) {
                data = data + curLeft + "," + (graphHeight - graphPadding[3] - (history[i]/maxError)*plotRegionHeight) + " ";
                curLeft = curLeft + xSpacing;
            }
            var historyLine = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            historyLine.classList.add('msoStroke');
            historyLine.setAttribute('points', data);
            historyCanvas.appendChild(historyLine);
        
            var lastValue = history[history.length-1];
            var lastScore = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            lastScore.classList.add('msoLast');
            lastScore.setAttribute('x', graphPadding[0] + xSpacing*(history.length-1) + 2);
            lastScore.setAttribute('y', (graphHeight - graphPadding[3] - (history[history.length-1]/maxError)*plotRegionHeight));
            lastScore.innerHTML = history[history.length-1];
            historyCanvas.appendChild(lastScore);
        }
    }
    
    this.ShowDiscardAnalyzer = function() {
        var menuName = visibleMenuCards[visibleMenuCards.length-1];
        MenuCardPressDown(menuName);
        this.InitializeDiscardAnalyzer();
        MenuCardAppear("menu_discard_analyzer");	
    }
    
    this.InitializeDiscardAnalyzer = function() {
        
        // Load up cards from the game or use a default starting hand
        var mostRecent = game.GetMostRecentHandCards();
        var mostRecentCards = mostRecent[0];
        var mostRecentIsPlayersCrib = mostRecent[1];
        if (mostRecentCards.length == 6) {
            while (this.daSelectedCells.length > 0) {
                var cellToRemove = this.daSelectedCells.shift();
                cellToRemove.style.background = "black";
            }
            this.daSelectedCells = [];
            this.discardAnalyzerIsPlayersCrib = mostRecentIsPlayersCrib;
            for (var i=0; i<mostRecentCards.length; i++) {
                var cell = document.getElementById('daCardCell_' + mostRecentCards[i].id);
                cell.style.background = "#BB0000";
                cell.card = mostRecentCards[i];
                this.daSelectedCells.push(cell);
            }	
        }
    
        var cribCheckbox = document.getElementById('da_crib_checkbox');
        var cribText = document.getElementById('daCribIndicatorText');
        cribCheckbox.checked = !this.discardAnalyzerIsPlayersCrib;	
        cribText.innerText = this.discardAnalyzerIsPlayersCrib ? "Your Crib" : "Opponent's Crib";	
        
        this.PrepareDiscardAnalyzerButtons();
    }
    
    this.discardAnalyzerIsPlayersCrib = true;
    this.daCribSwitched = function(cb) {
        var el = document.getElementById('daCribIndicatorText');
        if (cb.checked) {
            this.discardAnalyzerIsPlayersCrib = false;
            el.innerText = "Opponent's Crib";
        } else {
            this.discardAnalyzerIsPlayersCrib = true;
            el.innerText = "Your Crib";
        }
        this.PrepareDiscardAnalyzerButtons();
    }
    
    this.daSelectedCells = [];
    
    this.daCardCellClick = function(cell, cardString) {
        if (this.daSelectedCells.indexOf(cell) != -1) {
            cell.style.background = "black";
            this.daSelectedCells.splice(this.daSelectedCells.indexOf(cell), 1);	
        } else {
            cell.style.background = "#BB0000";
            cell.card = game.GetCardFromString(cardString);
            this.daSelectedCells.push(cell);
            while (this.daSelectedCells.length > 6) {
                var cellToRemove = this.daSelectedCells.shift();
                cellToRemove.style.background = "black";
            }
        }
        this.PrepareDiscardAnalyzerButtons();
    }
    
    this.currentOptimalDAHandCards = [];
    this.currentOptimalDACribCards =[];
    
    this.PrepareDiscardAnalyzerButtons = function() {
        var cards = [];
        for (var i=0; i<this.daSelectedCells.length; i++) {
            cards.push(this.daSelectedCells[i].card);
        }
        
        cards.sort(function(a,b) { return a.rank - b.rank });
        for (var i=0; i<cards.length; i++) {
            var element = document.getElementById('daHandCard' + i);
            element.style.background = cards[i].image;
        }
        for (var i=cards.length; i<6; i++) {
            var element = document.getElementById('daHandCard' + i);
            element.style.background = "black";
        }
        
        var optimalButton = document.getElementById('daOptimalCell');
        var allPlaysButton = document.getElementById('daAllPlaysCell');
        var prompt = document.getElementById('daPrompt');
        if (this.daSelectedCells.length == 6) {
            var optimalStats = game.FindOptimalCribDiscards(cards, this.discardAnalyzerIsPlayersCrib);
            this.currentOptimalDAHandCards = [];
            for (var i=0; i<cards.length; i++) {
                if (cards[i] !== optimalStats[0][0] && cards[i] !== optimalStats[0][1]) {
                    this.currentOptimalDAHandCards.push(cards[i]);
                }
            }
            this.currentOptimalDACribCards = optimalStats[0];
            var optimalCardImage1 = document.getElementById('daOptimalCardView1');
            var optimalCardImage2 = document.getElementById('daOptimalCardView2');
            optimalCardImage1.style.background = optimalStats[0][0].image;
            optimalCardImage2.style.background = optimalStats[0][1].image;
            var optimalScoreText = document.getElementById('daOptimalScoreText');
            optimalScoreText.innerHTML = "avg score: " + parseFloat(optimalStats[1]).toFixed(1) + " pts"
    
            optimalButton.style.transition = "0.3s ease-out";
            optimalButton.style.transform = "";
            optimalButton.style.opacity = 1;
    
            allPlaysButton.style.transition = "0.3s ease-out";
            allPlaysButton.style.transform = "";
            allPlaysButton.style.opacity = 1;
    
            prompt.innerHTML = "Find the optimal discards for a hand:";
        } else {
            optimalButton.style.transition = "0.3s ease-out";
            optimalButton.style.transform = "translate(-100%,0%)";
            optimalButton.style.opacity = 0;
    
            allPlaysButton.style.transition = "0.3s ease-out";
            allPlaysButton.style.transform = "translate(100%,0%)";
            allPlaysButton.style.opacity = 0;
    
            var cardsLeftToClick = 6 - this.daSelectedCells.length;
            if (cardsLeftToClick == 1) {
                prompt.innerHTML = "Click on 1 more card to find the optimal discards:";	
            } else if (cardsLeftToClick == 6) {
                prompt.innerHTML = "Click on 6 cards to find the optimal discards:";	
            } else {
                prompt.innerHTML = "Click on " + cardsLeftToClick + " cards to find the optimal discards:";
            }
        }
    }
    
    this.daAllPlaysButtonClick = function() {
        var cards = [];
        for (var i=0; i<this.daSelectedCells.length; i++) {
            cards.push(this.daSelectedCells[i].card);
        }
        this.InitializeAllPlays(cards, null, this.discardAnalyzerIsPlayersCrib);
        var menuName = visibleMenuCards[visibleMenuCards.length-1];
        MenuCardPressDown(menuName);
        MenuCardAppear("menu_allplays");
    }
    
    this.ShowAllPlaysForSuboptimalPlayView = function(suboptimalPlayView) {
        if (suboptimalPlayView.suboptimalPlay == null) {
            return;
        }
        this.ShowAllPlaysForSuboptimalPlay(suboptimalPlayView.suboptimalPlay);
    }
    
    this.ShowAllPlaysForSuboptimalPlay = function(suboptimalPlay) {
        this.InitializeAllPlays(suboptimalPlay.situationCards, suboptimalPlay.playedCards, suboptimalPlay.isPlayersCrib);
        var menuName = visibleMenuCards[visibleMenuCards.length-1];
        MenuCardPressDown(menuName);
        MenuCardAppear("menu_allplays");
    }
    
    this.InitializeAllPlays = function(cards, playedCards, isCribScorePositive) {
        var allPlaysListView = document.getElementById('mallplist');
        allPlaysListView.innerHTML = "";
    
        var allPlays = [];
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
    
                var scoreStats = game.GetScoreStatsForPossibleDiscards(trialCards, cribCards, isCribScorePositive);
                var minScore = scoreStats[0];
                var avgScore = scoreStats[1];
                var maxScore = scoreStats[2];
    
                var play = {};
                play.isPlayersCrib = isCribScorePositive;
                play.cribCards = cribCards;
                play.handCards = trialCards;
                play.minScore = minScore;
                play.maxScore = maxScore;
                play.avgScore = avgScore;
                allPlays.push(play);
            }
        }
    
        allPlays.sort(function(a,b) { return b.avgScore - a.avgScore;});
        for (var i=0; i<allPlays.length; i++) {
            var playView = document.getElementById('mallpcelltemplate').cloneNode(true);
            playView.style.display = "block";
            playView.play = allPlays[i];
            playView.children[1].style.background = allPlays[i].cribCards[0].image;
            playView.children[2].style.background = allPlays[i].cribCards[1].image;
            playView.children[4].style.background = allPlays[i].handCards[0].image;
            playView.children[5].style.background = allPlays[i].handCards[1].image;
            playView.children[6].style.background = allPlays[i].handCards[2].image;
            playView.children[7].style.background = allPlays[i].handCards[3].image;
            playView.children[9].innerText = allPlays[i].minScore;
            playView.children[11].innerText = allPlays[i].maxScore;
            playView.children[12].children[3].innerText = parseFloat(allPlays[i].avgScore).toFixed(2);
            
            if (playedCards !== null && 
                ((playView.play.cribCards[0] === playedCards[0] && playView.play.cribCards[1] === playedCards[1]) || 
                (playView.play.cribCards[0] === playedCards[0] && playView.play.cribCards[1] === playedCards[1]))) {
                    playView.style.background = "red";
                    playView.children[13].style.display = "block";
            }
            allPlaysListView.appendChild(playView);
        }
        allPlaysListView.scrollTop = 0;
    }
    
    this.mallcellClick = function(playView) {
        this.InitializeHandAnalysis(playView.play.handCards, playView.play.cribCards, playView.play.isPlayersCrib);
        var menuName = visibleMenuCards[visibleMenuCards.length-1];
        MenuCardPressDown(menuName);
        MenuCardAppear("menu_handAnalysis");
    }
    
    this.daOptimalButtonClick = function() {
        this.InitializeHandAnalysis(this.currentOptimalDAHandCards, this.currentOptimalDACribCards, this.discardAnalyzerIsPlayersCrib);
        var menuName = visibleMenuCards[visibleMenuCards.length-1];
        MenuCardPressDown(menuName);
        MenuCardAppear("menu_handAnalysis");
    }
    
    this.topCardsScrollView = null;
    this.topCards = [];
    this.histogramBars = [];
    this.currentHighlightedBar = null;
    
    this.InitializeHandAnalysis = function(handCards, cribCards, isCribScorePositive) {
        handCards.sort(function(a,b) { return a.rank -b.rank;});
        for (var i=0; i<handCards.length; i++) {
            document.getElementById('mhacard' + i).style.background = handCards[i].image;
        }
        cribCards.sort(function(a,b) {return a.rank - b.rank;});
        document.getElementById('mhacard4').style.background = cribCards[0].image;
        document.getElementById('mhacard5').style.background = cribCards[1].image;
    
        this.currentHighlightedBar = null;
    
        var scoreStats = game.GetScoreStatsForPossibleDiscards(handCards, cribCards, isCribScorePositive);
        var minScore = scoreStats[0];
        var maxScore = scoreStats[2];
        document.getElementById('mhaMin').innerHTML = scoreStats[0];
        document.getElementById('mhaAvg').innerHTML = parseFloat(scoreStats[1]).toFixed(2);
        document.getElementById('mhaMax').innerHTML = scoreStats[2];
    
        document.getElementById('mhacribtitle').innerHTML = isCribScorePositive ? "Your crib" : "Opp. crib";
    
        this.topCards = [];
        var deck = game.GetCards();
        for (var i=0; i<deck.length; i++) {
            var topCard = deck[i];
            if (handCards.indexOf(topCard) === -1 && cribCards.indexOf(topCard) === -1) {
                var allHandCards = handCards.concat(topCard);
                var allCribCards = cribCards.concat(topCard);
                var handPoints = game.GetScoreForCards(allHandCards, topCard, false);
                var cribPoints = game.GetScoreForCards(allCribCards, topCard, false);
                topCard.handPoints = handPoints;
                topCard.cribPoints = isCribScorePositive ? cribPoints : -cribPoints;
                topCard.totalPoints = handPoints + topCard.cribPoints;
                this.topCards.push(topCard);
            }
        }
        this.topCards.sort(function(a,b) {
            if (a.totalPoints == b.totalPoints) {
                return a.rank - b.rank;
            }  else {
                return a.totalPoints - b.totalPoints; 
            }
        });
        var topCardsContainer = document.getElementById('mhatopcardsContainer');
        topCardsContainer.innerHTML = "";
        var edgeWidth = 220 - 21;
        var fullWidth = 966 + edgeWidth + edgeWidth;
        topCardsContainer.style.width = fullWidth + "px";
        var curLeftIndex = 0;
        var curScore = this.topCards[0].totalPoints;
        var skip = false;
        var histogramCounts = [];
        var curHistogramCount = 0;
        var maxHistogramCount = 0;
        for (var i=0; i<this.topCards.length; i++) {
            curHistogramCount = curHistogramCount + 1;
            if (this.topCards[i].totalPoints != curScore) {
                if (!skip) {
                    var backgroundDiv = document.createElement("div");
                    backgroundDiv.style.position = "absolute";
                    backgroundDiv.style.top = "0px";
                    backgroundDiv.style.left = edgeWidth + curLeftIndex*21 + "px";
                    backgroundDiv.style.height = "80px";
                    backgroundDiv.style.background = "blue";
                    backgroundDiv.style.width = (i-curLeftIndex)*21 + "px";
                    topCardsContainer.appendChild(backgroundDiv);
                }
    
                histogramCounts[curScore] = curHistogramCount;
                if (curHistogramCount > maxHistogramCount) {
                    maxHistogramCount = curHistogramCount;
                }
                curHistogramCount = 0;
                curLeftIndex = i;
                curScore = this.topCards[i].totalPoints;
                skip = !skip;
            }
        }
        if (!skip) {
            var backgroundDiv = document.createElement("div");
            backgroundDiv.style.position = "absolute";
            backgroundDiv.style.top = "0px";
            backgroundDiv.style.left = edgeWidth + curLeftIndex*21 + "px";
            backgroundDiv.style.height = "80px";
            backgroundDiv.style.background = "blue";
            backgroundDiv.style.width = (this.topCards.length-curLeftIndex)*21 + "px";
            topCardsContainer.appendChild(backgroundDiv);
        }
        histogramCounts[curScore] = curHistogramCount;		
    
        // Draw the historgram bars
        var histogramView = document.getElementById('mhaHistorgram');
        histogramView.innerHTML = "";
        var histWidth = 400;
        var histHeight = 127;
        var histPadding = [30, 3, 5, 30]; //left, top, right, bottom
        var histBarWidth = (histWidth - histPadding[0] - histPadding[2])/(maxScore - minScore + 1);
        
        var xAxisLabel = document.createElement("div");
        xAxisLabel.className = "histLabel";
        xAxisLabel.innerHTML = "Score";
        xAxisLabel.style.fontSize = "10pt";
        xAxisLabel.style.width = histWidth + "px";
        xAxisLabel.style.left = "0px";
        xAxisLabel.style.top = histHeight - 17 + "px";
        histogramView.appendChild(xAxisLabel);
    
        var yAxisLabel = document.createElement("div");
        yAxisLabel.className = "histLabel";
        yAxisLabel.innerHTML = "Probability";
        yAxisLabel.style.fontSize = "10pt";
        yAxisLabel.style.width = histHeight + "px";
        yAxisLabel.style.left = "-50px";
        yAxisLabel.style.top = "50px";
        yAxisLabel.style.transform = "rotate(-90deg)";
        histogramView.appendChild(yAxisLabel);
    
        this.histogramBars = [];
        var curLeft = histPadding[0];
        for (var i=minScore; i<=maxScore; i++) {
            if (histogramCounts[i] === undefined) {
                var barDiv = document.createElement("div");
                barDiv.className = "histBar";
                barDiv.style.left = curLeft + "px";
                barDiv.style.width = histBarWidth - 1 + "px";
                barDiv.style.height = "0px";
                barDiv.style.top = histHeight - histPadding[3] + "px";
                histogramView.appendChild(barDiv);
            } else {
                var barDiv = document.createElement("div");
                barDiv.className = "histBar";
                barDiv.style.left = curLeft + "px";
                barDiv.style.width = histBarWidth - 1 + "px";
                var curHeightPercent = histogramCounts[i]/maxHistogramCount;
                var curHeight = curHeightPercent*(histHeight - histPadding[1] - histPadding[3]);
                if (curHeight < 1) {
                    barDiv.style.height = "1px";
                    barDiv.style.top = histPadding[1] + (histHeight - histPadding[1] - histPadding[3]) - 1 + "px";
                } else {
                    barDiv.style.height = curHeight + "px";
                    barDiv.style.top = histPadding[1] + (1-curHeightPercent)*(histHeight - histPadding[1] - histPadding[3]) + "px";	
                }
                this.histogramBars[i] = barDiv;
                histogramView.appendChild(barDiv);
            }
            var xLabel = document.createElement("div");
            xLabel.className = "histLabel";
            xLabel.innerHTML = i;
            xLabel.style.width = histBarWidth + "px";
            xLabel.style.left = curLeft + "px";
            xLabel.style.top = histHeight - histPadding[3] + "px";
            histogramView.appendChild(xLabel);
    
            curLeft = curLeft + histBarWidth;
        }
    
        var curLeft = edgeWidth;
        for (var i=0; i<this.topCards.length; i++) {
            var topCardView = document.createElement("div");
            topCardView.className = "tinytopcard";
            topCardView.style.background = this.topCards[i].image;
            topCardView.style.left = curLeft + "px";
            topCardsContainer.appendChild(topCardView);
            curLeft = curLeft + 21;
        }
        this.topCardsScrollView = document.getElementById('mhatopcards');
        this.topCardsScrollView.scrollLeft = 23*21;
        this.OnTopCardScroll();
    }
    
    this.OnTopCardScroll = function() {
        if (this.topCardsScrollView != null) {
            var cardIndex = Math.round(this.topCardsScrollView.scrollLeft/21);
            var topCard = this.topCards[cardIndex];
            var totalPoints = topCard.totalPoints;
            document.getElementById('mhatotalScore').innerHTML = "= " + totalPoints + " points";
            if (topCard.cribPoints == 0) {
                document.getElementById('mhacribpoints').innerHTML = "";
            } else if (topCard.cribPoints > 0) {
                document.getElementById('mhacribpoints').innerHTML = "+" + topCard.cribPoints + " pts";
            } else {
                document.getElementById('mhacribpoints').innerHTML = topCard.cribPoints + " pts";
            }
    
            if (this.currentHighlightedBar !== null) {
                this.currentHighlightedBar.style.background = "#2196F3";
            }
            this.currentHighlightedBar = this.histogramBars[totalPoints]
            this.currentHighlightedBar.style.background = "white";
        }
    }
    
    this.curTutorialIndex = 0;
    
    this.ShowTutorialMenu = function() {
        var scrollView = document.getElementById('mtContainer');
        scrollView.scrollLeft = 0;
        this.curTutorialIndex = 0;
        document.getElementById('mtDecButton').style.visibility = 'hidden';
        var menuName = visibleMenuCards[visibleMenuCards.length-1];
        MenuCardPressDown(menuName);
        MenuCardAppear("menu_tutorial");
    }
    
    this.IncrementTutorial = function() {
        if (this.curTutorialIndex < 6) {
            this.curTutorialIndex++;
            var scrollView = document.getElementById('mtContainer');
            scrollView.scrollLeft = this.curTutorialIndex*400;
            document.getElementById('mtDecButton').style.visibility = 'visible';
            if (this.curTutorialIndex === 6) {
                document.getElementById('mtIncButton').style.visibility = 'hidden';
            }
        }
    }
    
    this.DecrementTutorial = function() {
        if (this.curTutorialIndex > 0) {
            this.curTutorialIndex--;
            var scrollView = document.getElementById('mtContainer');
            scrollView.scrollLeft = this.curTutorialIndex*400;
            document.getElementById('mtIncButton').style.visibility = 'visible';
            if (this.curTutorialIndex === 0) {
                document.getElementById('mtDecButton').style.visibility = 'hidden';
            }
        }
    }
    
    this.GameOverClosedClick = function() {
        game.ReturnAllCardsToDeck();
        visibleMenuCards.pop();
        var elem = document.getElementById('GameOverView');
        with(elem.style) {
            WebkitTransition = MozTransition = OTransition = msTransition = "0.4s ease-in";
            top = "0%";
            opacity = 0;
        }
        setTimeout(function() {
            elem.style.visibility = 'hidden';
    
            // Show the close button
            var el = document.getElementById('menu_main_close_button');
            with(el.style) {
                display = 'none';
            }
            ShowMainMenu();
        }, 500);
    }

    this.InitializeGame = function(difficulty) {
        // Game properties
        humanPlayer.skillLevel = "Custom";
        skillLevel = difficulty;
        playerScore = 0;
        computerScore = 0;
        isPlayersCrib = false;
        playersHand = [];
        computersHand = [];
        crib = [];

        // Game stats
        computerPeggingPointsTotal = 0;
        playerPeggingPointsTotal = 0;
        computerHandPointsTotal = 0;
        playerHandPointsTotal = 0;
        computerCribPointsTotal = 0;
        playerCribPointsTotal = 0;
        suboptimalPlays = [];
    }

    this.GetCurrentComputerPlayerDecisions = function() {
        var selectedIndex = 0;
        switch (currentMoveStage) {
            case 'WaitingForUserToDiscardToCrib':
                selectedIndex = 0;
                break;
            case 'WaitingForUserToPlayPeggingCard':
                selectedIndex = 1;
                break;
            default:
                selectedIndex = 0;
                this.LoadDecisionScenario(selectedIndex);
                break;
        }
        return {
            displayNames: ["Choose Crib Discards", "Choose Pegging Card"],
            selectedIndex: selectedIndex
        }
    }

    this.LoadDecisionScenario = function(decisionIndex) {
        
        game.InitializeGame("Standard");

        HidePeggingPrompt();
        peggingCountIndicator = document.getElementById('PeggingCountIndicator');
        peggingCountIndicator.style.transition = "none";
        peggingCountIndicator.style.opacity = 0;
        peggingCountIndicator.style.visibility = "hidden";
        
        scoreboard.SetOpponentName(game.difficulty);
        scoreboard.InitializeScore();

        // Choose a random first dealer
        isPlayersCrib = Math.random() >= 0.5;

        scoreboard.SetCribIndicator(isPlayersCrib);
        scoreboard.Show();

        // Deal cards
        shuffle(cards);
        deckTopIndex = cards.length - 1;
        playersHand = [];
        computersHand = [];
        crib = [];
        for (var i = 0; i < 6; i++) {
            playersHand.push(cards[deckTopIndex]);
            deckTopIndex = deckTopIndex - 1;
            computersHand.push(cards[deckTopIndex]);
            deckTopIndex = deckTopIndex - 1;
        }

        // Make all cards visible
        for (var i = 0; i < cards.length; i++) {
            var pos = GetDeckCardPosition();
            var cardView = cards[i].cardView;
            cardView.positionLeftFunction = "GetDeckCardPosition()[0] + 'px'";
            cardView.positionTopFunction = "GetDeckCardPosition()[1] + 'px'";
            cardView.style.transition = "none";
            cardView.style.left = eval(cardView.positionLeftFunction);
            cardView.style.top = eval(cardView.positionTopFunction);
            cardView.positionIndex = i;
            cardView.isClickable = false;
            with (cardView.style) {
                zIndex = i + 1;
                visibility = "visible";
            }
            flipDownCard(cardView, false);
        }

        cardsAreVisible = true;

        // Sort the players hand
        playersHand.sort(function (a, b) { return a.rank - b.rank; });

        // Deal the player cards
        mostRecentHandCards = [];
        mostRecentIsPlayersCrib = isPlayersCrib;
        for (var i = 0; i < 6; i++) {
            var cardView = playersHand[i].cardView;
            cardView.style.zIndex = i + 100;
            mostRecentHandCards.push(playersHand[i]);
        }
        
        for (var i = 0; i < 6; i++) {
            var cardView = playersHand[i].cardView;
            cardView.positionLeftFunction = "GetHandCardPosition(true, true, " + i + ")[0] + 'px'";
            cardView.positionTopFunction = "GetHandCardPosition(true, true, " + i + ")[1] + 'px'";
            cardView.positionIndex = i;
            cardView.isClickable = true;
            cardView.style.zIndex = i + 100;
            with (cardView.style) {
                transition = "none";
                transitionDelay = 'none';
                left = eval(cardView.positionLeftFunction);
                top = eval(cardView.positionTopFunction);
            };
            flipUpCard(cardView, false);
        }

        // Deal the computer cards
        for (var i = 0; i < 6; i++) {
            var cardView = computersHand[i].cardView;
            cardView.positionLeftFunction = "GetHandCardPosition(false, true, " + i + ")[0] + 'px'";
            cardView.positionTopFunction = "GetHandCardPosition(false, true, " + i + ")[1] + 'px'";
            cardView.positionIndex = i;
            with (cardView.style) {
                transition = "none";
                transitionDelay = "none";
                left = eval(cardView.positionLeftFunction);
                top = eval(cardView.positionTopFunction);
                zIndex = i;
            };
            flipDownCard(cardView, false);
        }

        switch (decisionIndex) {
            case 0:
                // Discarding

                // Hide crib region overlay
                var cribOverlay = document.getElementById('crib_indicator_card_overlap');
                cribOverlay.style.transition = 'none';
                cribOverlay.style.transitionDelay = 'none';
                cribOverlay.style.visibility = 'hidden';
                
                // Show the crib discard region
                var discardRegion = document.getElementById('crib_region');
                discardRegion.style.transition = "none";
                discardRegion.positionLeftFunction = "GetDiscardRegionPosition()[0] + 'px'";
                discardRegion.positionTopFunction = "GetDiscardRegionPosition()[1] + 'px'";
                discardRegion.style.left = eval(discardRegion.positionLeftFunction);
                discardRegion.style.top = eval(discardRegion.positionTopFunction);
                var discardText = document.getElementById('crib_region_center_text');
                discardText.innerText = isPlayersCrib ? "Your Crib" : "Opponent's Crib";
                var discardRegion = document.getElementById('crib_region');
                discardRegion.style.transition = "none";
                discardRegion.style.visibility = "visible";
                discardRegion.style.opacity = 1;
            
                if (skillLevel === 'Easy' || game.settings.GetSetting('setting_hints')) {
                    setTimeout(function () {
                        ShowHintButton();
                    }, 10);
                }

                currentMoveStage = 'WaitingForUserToDiscardToCrib';
            break;
            case 1:
                // Pegging

                // Hide the crib region
                var view = document.getElementById('crib_region');
                view.style.transition = "none";
                view.style.transitionDelay = "none";
                view.style.opacity = 0;
                
                // Choose discards
                var computerDiscards = computerPlayer.SelectTwoCardsToDiscardInCrib('Pro', !isPlayersCrib, computersHand);
                var index = computersHand.indexOf(computerDiscards[0]);
                computersHand.splice(index, 1);
                index = computersHand.indexOf(computerDiscards[1]);
                computersHand.splice(index, 1);
                for (var i = 0; i < computerDiscards.length; i++) {
                    crib.push(computerDiscards[i]);
                }
                var playerDiscards = computerPlayer.SelectTwoCardsToDiscardInCrib('Pro', isPlayersCrib, playersHand);
                index = playersHand.indexOf(playerDiscards[0]);
                playersHand.splice(index, 1);
                index = playersHand.indexOf(playerDiscards[1]);
                playersHand.splice(index, 1);
                for (var i = 0; i < playerDiscards.length; i++) {
                    crib.push(playerDiscards[i]);
                }

                var waitingPosition = GetCribWaitingPosition();
                for (var i = 0; i < crib.length; i++) {
                    crib[i].cardView.positionLeftFunction = "GetCribWaitingPosition()[0] + 'px'";
                    crib[i].cardView.positionTopFunction = "GetCribWaitingPosition()[1] + 'px'";
                    with (crib[i].cardView.style) {
                        transition = "none";
                        transitionDelay = "none";
                        left = waitingPosition[0] + "px";
                        top = waitingPosition[1] + "px";
                    }
                    flipDownCard(crib[i].cardView, false);
                }
                
                // Reposition the players hand cards
                for (var i = 0; i < playersHand.length; i++) {
                    var cardView = playersHand[i].cardView;
                    cardView.positionLeftFunction = "GetHandCardPosition(true, false, " + i + ")[0] + 'px'";
                    cardView.positionTopFunction = "GetHandCardPosition(true, false, " + i + ")[1] + 'px'";
                    cardView.positionIndex = i;
                    with (cardView.style) {
                        transition = "none";
                        transitionDelay = "none";
                        left = eval(cardView.positionLeftFunction);
                        top = eval(cardView.positionTopFunction);
                        zIndex = i + 100;
                    };
                }

                // Reposition the computers hand cards
                for (var i = 0; i < computersHand.length; i++) {
                    var cardView = computersHand[i].cardView;
                    cardView.positionLeftFunction = "GetHandCardPosition(false, false, " + i + ")[0] + 'px'";
                    cardView.positionTopFunction = "GetHandCardPosition(false, false, " + i + ")[1] + 'px'";
                    cardView.positionIndex = i;
                    with (cardView.style) {
                        transition = "none";
                        transitionDelay = "none";
                        left = eval(cardView.positionLeftFunction);
                        top = eval(cardView.positionTopFunction);
                        zIndex = i + 100;
                    };
                }

                // Put the crib region indicator overlay on the crib cards
                var cribOverlayText = document.getElementById('crib_indicator_card_overlap_text');
                cribOverlayText.innerHTML = isPlayersCrib ? "Your" : "Opponent's";
                var cribOverlay = document.getElementById('crib_indicator_card_overlap');
                cribOverlay.style.zIndex = 107;
                cribOverlay.positionLeftFunction = "GetCribWaitingPosition()[0] + 'px'";
                cribOverlay.positionTopFunction = "GetCribWaitingPosition()[1] + 'px'";
                cribOverlay.style.visibility = "visible";
                cribOverlay.style.transition = "none";
                cribOverlay.style.left = eval(cribOverlay.positionLeftFunction);
                cribOverlay.style.top = eval(cribOverlay.positionTopFunction);
                with (cribOverlay.style) {
                    transition = "none";
                    opacity = 1;
                }
                
                currentPeggingCards = [];
                deadPeggingCards = [];
                computerPlayedPeggingCards = [];
                playerPlayedPeggingCards = [];
                isPlayersTurnToPeg = false;
                playerSaysGo = false;
                computerSaysGo = false;
                currentPeggingCount = 0;
        
                // Flip the top card on the deck
                topCard = cards[deckTopIndex];
                topCard.cardView.style.zIndex = 60;
                flipUpCard(topCard.cardView, false);
                topCard.cardView.positionLeftFunction = "GetDeckCardPosition()[0] + 10 + 'px'";
                topCard.cardView.positionTopFunction = "GetDeckCardPosition()[1] + 'px'";
                with (topCard.cardView.style) {
                    transition = "none";
                    left = eval(topCard.cardView.positionLeftFunction);
                    top = eval(topCard.cardView.positionTopFunction);
                }
        
                var pointsShowDelay = 0;
                if (topCard.rank == 11) {
                    // This is a jack, reward the dealer 2 points
                    if (isPlayersCrib) {
                        playerScore = playerScore + 2;
                        scoreboard.SetScorePlayer(playerScore);
                    } else {
                        computerScore = computerScore + 2;
                        scoreboard.SetScoreOpp(computerScore);
                    }
                }
        
                // Show pegging count indicator
                peggingCountText = document.getElementById('PeggingCountIndicatorScore');
                peggingCountText.innerText = 0;
                peggingCountIndicator = document.getElementById('PeggingCountIndicator');
                peggingCountIndicator.style.transition = "none";
                peggingCountIndicator.style.zIndex = 100;
                peggingCountIndicator.positionLeftFunction = "GetDeckCardPosition()[0] - 115*0.5 + 10 + 'px'";
                peggingCountIndicator.positionTopFunction = "GetDeckCardPosition()[1] - 75*0.5 + 'px'";
                peggingCountIndicator.style.top = eval(peggingCountIndicator.positionTopFunction);
                peggingCountIndicator.style.left = eval(peggingCountIndicator.positionLeftFunction);
                peggingCountIndicator.style.opacity = 0;
                peggingCountIndicator.style.visibility = "visible";
                peggingCountIndicator.style.transition = "none";
                peggingCountIndicator.style.opacity = 1;
                
                // Step through until it is the player's turn and there are N cards left in their hand
                var randomCardsCount = Math.floor(Math.random()*3);
                var isPlayersTurn = !isPlayersCrib;
                var playsMadeByPlayer = 0;
                while (true) {
                    if (isPlayersTurn) {
                        var play = humanPlayer.SelectNextCardForPegging('Pro', playersHand, currentPeggingCount, currentPeggingCards, deadPeggingCards, topCard);
                        if (play === undefined) {
                            // This is a go
                            playerSaysGo = true;
                            if (computerSaysGo) {
                                // Give the player a point for last card
                                playerScore = playerScore + 1;
                                scoreboard.SetScorePlayer(playerScore);
                                //OnResetPeggingCount
                                // Move all the cards to the dead pile
                                for (var i = 0; i < currentPeggingCards.length; i++) {
                                    deadPeggingCards.push(currentPeggingCards[i]);
                                }
                                currentPeggingCards = [];

                                for (var i = 0; i < deadPeggingCards.length; i++) {
                                    var deadCard = deadPeggingCards[i];
                                    deadCard.cardView.positionLeftFunction = "GetPeggingDeadPileFirstCardLeftPosition() + " + i + "*peggingDeadCardsOverlap + 'px'";
                                    deadCard.cardView.style.transition = "none";
                                    deadCard.cardView.style.left = eval(deadCard.cardView.positionLeftFunction);
                                    deadCard.cardView.style.zIndex = i;
                                }

                                peggingCountText.innerHTML = "0";
                                currentPeggingCount = 0;
                                playerSaysGo = false;
                                computerSaysGo = false;       
                            }
                    
                        } else {
                            
                            if (playsMadeByPlayer == randomCardsCount) {
                                break;
                            }

                            // Drop card into peg pile
                            playersHand[playersHand.indexOf(play)] = null;
                            currentPeggingCards.push(play);
                            playerPlayedPeggingCards.push(play);
                            AnimateCardViewToPeggingPile(play.cardView, true, false);
                            peggingCountText.innerHTML = currentPeggingCount;

                            playsMadeByPlayer = playsMadeByPlayer + 1;

                            var peggingPoints = GetPeggingPointsLastPlay();
                            var totalPoints = 0;
                            for (var i = 0; i < peggingPoints.length; i++) {
                                var scoringPoints = peggingPoints[i];
                                totalPoints = totalPoints + scoringPoints.points;
                            }

                            // Update the score
                            if (totalPoints > 0) {
                                playerScore = playerScore + totalPoints;
                                scoreboard.SetScorePlayer(playerScore);
                            }

                            if (currentPeggingCount == 31) {
                                //OnResetPeggingCount
                                // Move all the cards to the dead pile
                                for (var i = 0; i < currentPeggingCards.length; i++) {
                                    deadPeggingCards.push(currentPeggingCards[i]);
                                }
                                currentPeggingCards = [];

                                for (var i = 0; i < deadPeggingCards.length; i++) {
                                    var deadCard = deadPeggingCards[i];
                                    deadCard.cardView.positionLeftFunction = "GetPeggingDeadPileFirstCardLeftPosition() + " + i + "*peggingDeadCardsOverlap + 'px'";
                                    deadCard.cardView.style.transition = "none";
                                    deadCard.cardView.style.left = eval(deadCard.cardView.positionLeftFunction);
                                    deadCard.cardView.style.zIndex = i;
                                }

                                peggingCountText.innerHTML = "0";
                                currentPeggingCount = 0;
                                playerSaysGo = false;
                                computerSaysGo = false;
                            }
                        }
                    } else {
                        var computerPlay = computerPlayer.SelectNextCardForPegging('Pro', computersHand, currentPeggingCount, currentPeggingCards, deadPeggingCards, topCard);
                        if (computerPlay === undefined) {
                            // This is a go
                            computerSaysGo = true;
                            if (playerSaysGo) {
                                if (currentPeggingCount != 31) {
                                    // Give the computer a point for last card
                                    var position = GetPeggingFirstCardPosition();
                                    var left = position[0] + currentPeggingCards.length * peggingCardsOverlap;
                                    var top = position[1];
                                    computerScore = computerScore + 1;
                                    scoreboard.SetScoreOpp(computerScore);
                                }

                                //OnResetPeggingCount
                                // Move all the cards to the dead pile
                                for (var i = 0; i < currentPeggingCards.length; i++) {
                                    deadPeggingCards.push(currentPeggingCards[i]);
                                }
                                currentPeggingCards = [];

                                for (var i = 0; i < deadPeggingCards.length; i++) {
                                    var deadCard = deadPeggingCards[i];
                                    deadCard.cardView.positionLeftFunction = "GetPeggingDeadPileFirstCardLeftPosition() + " + i + "*peggingDeadCardsOverlap + 'px'";
                                    deadCard.cardView.style.transition = "none";
                                    deadCard.cardView.style.left = eval(deadCard.cardView.positionLeftFunction);
                                    deadCard.cardView.style.zIndex = i;
                                }

                                peggingCountText.innerHTML = "0";
                                currentPeggingCount = 0;
                                playerSaysGo = false;
                                computerSaysGo = false;
                            }
                
                        } else {
                            computersHand[computersHand.indexOf(computerPlay)] = null;
                            currentPeggingCards.push(computerPlay);
                            computerPlayedPeggingCards.push(computerPlay);
                            AnimateCardViewToPeggingPile(computerPlay.cardView, false, false);
                            peggingCountText.innerHTML = currentPeggingCount;

                            var peggingPoints = GetPeggingPointsLastPlay();
                            var totalPoints = 0;
                            for (var i = 0; i < peggingPoints.length; i++) {
                                var scoringPoints = peggingPoints[i];
                                totalPoints = totalPoints + scoringPoints.points;
                            }
                            
                            // Update the score
                            if (totalPoints > 0) {
                                computerScore = computerScore + totalPoints;
                                scoreboard.SetScoreOpp(computerScore);
                            }
                        
                            if (currentPeggingCount == 31) {
                                //OnResetPeggingCount
                                // Move all the cards to the dead pile
                                for (var i = 0; i < currentPeggingCards.length; i++) {
                                    deadPeggingCards.push(currentPeggingCards[i]);
                                }
                                currentPeggingCards = [];

                                for (var i = 0; i < deadPeggingCards.length; i++) {
                                    var deadCard = deadPeggingCards[i];
                                    deadCard.cardView.positionLeftFunction = "GetPeggingDeadPileFirstCardLeftPosition() + " + i + "*peggingDeadCardsOverlap + 'px'";
                                    deadCard.cardView.style.transition = "none";
                                    deadCard.cardView.style.left = eval(deadCard.cardView.positionLeftFunction);
                                    deadCard.cardView.style.zIndex = i;
                                }

                                peggingCountText.innerHTML = "0";
                                currentPeggingCount = 0;
                                playerSaysGo = false;
                                computerSaysGo = false;
                            }
                
                        }
                        
                    }
                    isPlayersTurn = !isPlayersTurn;
                }

                
                if (skillLevel === 'Easy' || game.settings.GetSetting('setting_hints')) {
                    ShowHintButton();
                }
                ShowPeggingPrompt("0s", false);
                currentMoveStage = 'WaitingForUserToPlayPeggingCard';
            break;
        }
    }

    this.GetCustomPlayerMethod = function(decisionIndex) {
        return humanPlayer.GetDecisionMethod(decisionIndex);
    }

    this.SaveCurrentDecisionMethod = function(decisionIndex, code) {
        var decisionMethodName = "cribbage_decision_method_Custom_" + decisionIndex;
        window.localStorage.setItem(decisionMethodName, code);
    }

    this.TryCurrentDecisionMethod = function(decisionIndex) {
        try {
            var optimalCards = [];
            switch (decisionIndex) {
                case 0: // Discarding
                    optimalCards = humanPlayer.SelectTwoCardsToDiscardInCrib(humanPlayer.skillLevel, this.isPlayersCrib, playersHand);
                break;
                case 1: // Pegging
                    var play = humanPlayer.SelectNextCardForPegging(humanPlayer.skillLevel, playersHand, currentPeggingCount, currentPeggingCards, deadPeggingCards, topCard);
                    optimalCards.push(play);
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
}
