var CribbageScoreboard = function () {

    this.startPegGroupHolePositionOffsetBlue = [[21,21], [21,5]];
    this.startPegGroupHolePositionOffsetRed = [[37,21], [37,5]];

    this.verticalPegGroupHolePositionOffsetsBlue = [ [21,53], [21, 37], [21, 21], [21,5], [21,-11]];
    this.verticalPegGroupHolePositionOffsetsRed = [ [37,53], [37, 37], [37, 21], [37,5], [37,-11]];
    
    this.leftTurnPegGroupHolePositionOffsetsBlue = [ [21, 39], [23, 21], [30, 0], [50, -10], [67,-12]];
    this.leftTurnPegGroupHolePositionOffsetsRed = [ [37, 40], [38, 25], [42, 12], [54, 6], [70, 5]];

    this.horizontalPegGroupHolePositionOffsetsBlue = [ [21, -12], [37, -12], [53, -12], [69, -12], [85, -12]];
    this.horizontalPegGroupHolePositionOffsetsRed = [ [21, 5], [37, 5], [53, 5], [69, 5], [85, 5]];
    
    this.rightTurnPegGroupHolePositionOffsetsBlue = [ [122, -14], [104, -12], [83, -4], [73, 16], [71, 32] ];
    this.rightTurnPegGroupHolePositionOffsetsRed = [ [122, 5], [108, 5], [95, 8], [88, 20], [87, 35] ];

    this.verticalRightPegGroupHolePositionOffsetsBlue = [ [71, -11], [71, 5], [71, 21], [71, 37], [71, 52]];
    this.verticalRightPegGroupHolePositionOffsetsRed = [ [87, -11], [87, 5], [87, 21], [87, 37], [87, 52]];

    this.finishPegGroupHolePositionOffset = [76,8];

    this.pegHolePositionsBlue = [];
    this.pegHolePositionsRed = [];
    this.frontPegBlue;
    this.backPegBlue;
    this.frontPegRed;
    this.backPegRed;

    this.leftTurnStartPegHoleIndex = 0;
    this.rightTurnStartPegHoleIndex = 0;

    this.compactPegImageStartLeft = 48;

    this.curScorePlayer = 0;
    this.curScoreComputer = 0;

    this.isCompact = false;
    
    this.SetOpponentName = function(gameDifficulty) {
        var oppText = document.getElementById('scoreboard_pegs_score_opp_text');
        var compactOppText = document.getElementById('scoreboard_compact_opp_text');
        switch (gameDifficulty) {
            case 'Easy':
                oppText.innerText = "EASY";
                compactOppText.innerText = "EASY";
                break;
            case 'Standard':
                oppText.innerText = "STND";
                compactOppText.innerText = "STND";
                break;
            default:
                oppText.innerText = "PRO";
                compactOppText.innerText = "PRO";
                break;
        }
    }

    this.SetCribIndicator = function(isPlayersCrib) {
        var cribIndicator = document.getElementById('scoreboard_pegs_crib_indicator_group');
        var compactCribIndicator = document.getElementById('scoreboard_compact_crib_indicator_group');
        if (isPlayersCrib) {
            cribIndicator.style.transform = "translate(0px,-18px)";
            compactCribIndicator.style.transform = "translate(0px, 0px)";
        } else {
            cribIndicator.style.transform = "translate(0px,21px)";
            compactCribIndicator.style.transform = "translate(-50px, 0px)";
        }
    }

    this.InitializeScore = function() {

        this.curScoreComputer = 0;
        this.curScorePlayer = 0;

        var pegsScoreBoard = document.getElementById('scoreboard_pegs_score_view');
        pegsScoreBoard.style.opacity = 0;
        var compactScoreBoard = document.getElementById('scoreboard_compact');
        compactScoreBoard.style.opacity = 0;
        
        // Compact scoreboard
        var compactScoreTextYou = document.getElementById('scoreboard_compact_you_score');
        compactScoreTextYou.innerText = "0";
        var compactScoreTextOpp = document.getElementById('scoreboard_compact_opp_score');
        compactScoreTextOpp.innerText = "0";
        var compactScoreFillYou = document.getElementById('scoreboard_compact_you_fill_bar');
        compactScoreFillYou.style.width = "0px";
        var compactScoreFillOpp = document.getElementById('scoreboard_compact_opp_fill_bar');
        compactScoreFillOpp.style.width = "0px";
        var compactScoreYouPeg = document.getElementById('scoreboard_compact_you_peg');
        compactScoreYouPeg.style.left = this.compactPegImageStartLeft + "px";
        var compactScoreOppPeg = document.getElementById('scoreboard_compact_opp_peg');
        compactScoreOppPeg.style.left = this.compactPegImageStartLeft + "px";

        var scoreText = document.getElementById('scoreboard_pegs_score_you_points');
        scoreText.innerText = "0";
        var oppScoreText = document.getElementById('scoreboard_pegs_score_opp_points');
        oppScoreText.innerText = "0";
    
        var redPeg1 = document.getElementById('scoreboard_pegs_redpeg_1');
        var redPeg2 = document.getElementById('scoreboard_pegs_redpeg_2');
        var bluePeg1 = document.getElementById('scoreboard_pegs_bluepeg_1');
        var bluePeg2 = document.getElementById('scoreboard_pegs_bluepeg_2');
        
        this.frontPegRed = redPeg1;
        this.backPegRed = redPeg2;
        this.frontPegRed.style.transition = "0s";
        this.backPegRed.style.transition = "0s";
        this.frontPegRed.holeIndex = 1;
        this.backPegRed.holeIndex = 0;
        this.frontPegRed.style.zIndex = 0;
        this.backPegRed.style.zIndex = 1;
        if (this.pegHolePositionsRed.length > 0) {
            this.frontPegRed.style.transform = "translate(" + this.pegHolePositionsRed[1][0] + "px," + this.pegHolePositionsRed[1][1] + "px)";
            this.backPegRed.style.transform = "translate(" + this.pegHolePositionsRed[0][0] + "px," + this.pegHolePositionsRed[0][1] + "px)";
        }

        this.frontPegBlue = bluePeg1;
        this.backPegBlue = bluePeg2;
        this.frontPegBlue.style.transition = "0s";
        this.backPegBlue.style.transition = "0s";
        this.frontPegBlue.holeIndex = 1;
        this.backPegBlue.holeIndex = 0;
        this.frontPegBlue.style.zIndex = 2;
        this.backPegBlue.style.zIndex = 3;
        if (this.pegHolePositionsBlue.length > 0) {
            this.frontPegBlue.style.transform = "translate(" + this.pegHolePositionsBlue[1][0] + "px," + this.pegHolePositionsBlue[1][1] + "px)";
            this.backPegBlue.style.transform = "translate(" + this.pegHolePositionsBlue[0][0] + "px," + this.pegHolePositionsBlue[0][1] + "px)";
        }


    }

    this.SetScorePlayer = function(playerScore) {
        if (this.curScorePlayer === playerScore) {
            return;
        }
        this.curScorePlayer = playerScore;

        var scorePegIndex = playerScore;
        if (scorePegIndex > 121) {
            scorePegIndex = 121;
        }

        var scoreText = document.getElementById('scoreboard_pegs_score_you_points');
        scoreText.style.transition = "0.2s linear";
        scoreText.style.transform = "translate(0px,25px)";
        setTimeout(function() {
            scoreText.innerText = playerScore;
            scoreText.style.transform = "translate(0px,0px)";            
        }, 205);
    
        this.backPegBlue.holeIndex = scorePegIndex + 1;
        if (this.pegHolePositionsBlue.length > scorePegIndex + 1) {
            this.backPegBlue.style.transition = "0.5s ease-in-out";
            this.backPegBlue.style.transform = "translate(" + this.pegHolePositionsBlue[scorePegIndex+1][0] + "px," + this.pegHolePositionsBlue[scorePegIndex+1][1] + "px)";
        }
        var temp = this.frontPegBlue;
        this.frontPegBlue = this.backPegBlue;
        this.backPegBlue = temp;
        SetCorrectPegZIndexForPlayer();
    
        var compactPlayerScoreText = document.getElementById('scoreboard_compact_you_score');
        compactPlayerScoreText.style.transition = "0.2s linear";
        compactPlayerScoreText.style.transform = "translate(0px,30px)";
        setTimeout(function() {
            compactPlayerScoreText.innerHTML = playerScore;
            compactPlayerScoreText.style.transform = "translate(0px, 0px)"; 
        }, 250);
        var compactPlayerScoreFill = document.getElementById('scoreboard_compact_you_fill_bar');
        var fillPercent = playerScore / 121.0;
        if (fillPercent > 1) {
            fillPercent = 1;
        }
        compactPlayerScoreFill.style.width = 100.0*fillPercent + "px";
        var peg = document.getElementById('scoreboard_compact_you_peg');
        peg.style.left = this.compactPegImageStartLeft + fillPercent*100.0 + "px";
    }

    this.SetScoreOpp = function(score) {
        if (this.curScoreComputer === score) {
            return;
        }
        this.curScoreComputer = score;

        var scorePegIndex = score;
        if (scorePegIndex > 121) {
            scorePegIndex = 121;
        }

        var scoreText = document.getElementById('scoreboard_pegs_score_opp_points');
        scoreText.style.transition = "0.2s linear";
        scoreText.style.transform = "translate(0px,25px)";
        setTimeout(function() {
            scoreText.innerText = score;
            scoreText.style.transform = "translate(0px,0px)";            
        }, 250);

        this.backPegRed.holeIndex = scorePegIndex+1;
        if (this.pegHolePositionsRed.length > scorePegIndex + 1) {
            this.backPegRed.style.transition = "0.5s ease-in-out";
            this.backPegRed.style.transform = "translate(" + this.pegHolePositionsRed[scorePegIndex+1][0] + "px," + this.pegHolePositionsRed[scorePegIndex+1][1] + "px)";
        }
        var temp = this.frontPegRed;
        this.frontPegRed = this.backPegRed;
        this.backPegRed = temp;
        SetCorrectPegZIndexForComputer();
   
        var compactOppcoreText = document.getElementById('scoreboard_compact_opp_score');
        compactOppcoreText.style.transition = "0.2s linear";
        compactOppcoreText.style.transform = "translate(0px,30px)";
        setTimeout(function() {
            compactOppcoreText.innerHTML = score;
            compactOppcoreText.style.transform = "translate(0px, 0px)"; 
        }, 250);

        var compactOppScoreFill = document.getElementById('scoreboard_compact_opp_fill_bar');
        var fillPercent = score / 121.0;
        if (fillPercent > 1) {
            fillPercent = 1;
        }
        compactOppScoreFill.style.width = 100.0*fillPercent + "px";
        var peg = document.getElementById('scoreboard_compact_opp_peg');
        peg.style.left = this.compactPegImageStartLeft + fillPercent*100.0 + "px";
    }

    function SetCorrectPegZIndexForPlayer() {
        if (this.frontPegBlue != null && this.backPegBlue != null) {
            if (this.frontPegBlue.holeIndex > this.rightTurnStartPegHoleIndex) {
                this.frontPegBlue.style.zIndex = 3;
                this.backPegBlue.style.zIndex = 2;    
            } else {
                this.frontPegBlue.style.zIndex = 2;
                this.backPegBlue.style.zIndex = 3;
            }
        }
    }

    function SetCorrectPegZIndexForComputer() {
        if (this.frontPegRed != null && this.backPegRed != null) {
            if (this.frontPegRed.holeIndex < this.leftTurnStartPegHoleIndex) {
                this.frontPegRed.style.zIndex = 0;
                this.backPegRed.style.zIndex = 1;
            } else {
                if (this.frontPegRed.holeIndex > this.rightTurnStartPegHoleIndex) {
                    this.frontPegRed.style.zIndex = 5;
                    this.backPegRed.style.zIndex = 4;
                } else {
                    this.frontPegRed.style.zIndex = 4;
                    this.backPegRed.style.zIndex = 5;
                }
            }
        }
    }

    this.Show = function() {
        var scoreboardDiv = document.getElementById('scoreboard_pegs_score_view');
        scoreboardDiv.style.opacity = 1;

        var compactScoreboard = document.getElementById('scoreboard_compact');
        compactScoreboard.style.opacity = 1;
        
        if (this.frontPegRed != null && this.backPegRed != null && this.frontPegBlue != null && this.backPegBlue != null) {
            this.frontPegBlue.style.transition = "0.5s ease-in-out";
            this.backPegBlue.style.transition = "0.5s ease-in-out";
            this.frontPegRed.style.transition = "0.5s ease-in-out";
            this.backPegRed.style.transition = "0.5s ease-in-out";
            this.frontPegRed.style.opacity = 1;
            this.backPegRed.style.opacity = 1;
            this.frontPegBlue.style.opacity = 1;
            this.backPegBlue.style.opacity = 1;
        }
    }

    this.Hide = function() {
        var scoreboardDiv = document.getElementById('scoreboard_pegs_score_view');
        scoreboardDiv.style.opacity = 0;
        var compactScoreboard = document.getElementById('scoreboard_compact');
        compactScoreboard.style.opacity = 0;
    }

    this.RedrawView = function() {
        var width = gameContainer.innerWidth;
        var height = gameContainer.innerHeight;
        
        var leftColumn = document.getElementById('scoreboard_leftColumn');
        var topRow = document.getElementById('scoreboard_topRow');
        var rightColumn = document.getElementById('scoreboard_rightColumn');
        var pegsScoreView = document.getElementById('scoreboard_pegs_score_view');

        leftColumn.innerHTML = [];
        topRow.innerHTML = [];
        rightColumn.innerHTML = [];
        this.pegHolePositionsBlue = [];
        this.pegHolePositionsRed = [];

        var topRowMargin = 40;
        var sideMargin = 58;
        var topMargin = 57;
        var bottomMarginRightSide = 32 + 80;
        var bottomMarginLeftSide = 45;
        var pegHoleSegmentLength = 76;
        var pegHoleSegmentSpacing = 10;

        var topPegGroupCount = Math.floor((width - 2*topRowMargin - sideMargin*2 - pegHoleSegmentSpacing)/(pegHoleSegmentLength + pegHoleSegmentSpacing));
        if (topPegGroupCount > 22) {
            topPegGroupCount = 22;
        }
        topPegHoleSegmentSpacing = (width - 2*topRowMargin - sideMargin*2 - topPegGroupCount*pegHoleSegmentLength)/(topPegGroupCount + 1);
        
        var rightPegGroupCount = Math.floor((rightColumn.clientHeight - topMargin - bottomMarginRightSide - pegHoleSegmentSpacing)/(pegHoleSegmentLength + pegHoleSegmentSpacing));
        var leftPegGroupCount = Math.floor((rightColumn.clientHeight - topMargin - bottomMarginLeftSide - pegHoleSegmentSpacing)/(pegHoleSegmentLength + pegHoleSegmentSpacing));

        if (topPegGroupCount + rightPegGroupCount + leftPegGroupCount + 2 < 24) {
            // The peg board holes do not fit on the screen so we will not show them
            this.isCompact = true;
            var compactScoreboard = document.getElementById('scoreboard_compact');
            compactScoreboard.style.visibility = "visible";
            var pegsScoreboard = document.getElementById('scoreboard_pegs');
            pegsScoreboard.style.visibility = "hidden";

            if (this.frontPegRed != null && this.backPegRed != null && this.frontPegBlue != null && this.backPegBlue != null) {
                this.frontPegRed.style.transition = "none";
                this.backPegRed.style.transition = "none";
                this.frontPegBlue.style.transition = "none";
                this.backPegBlue.style.transition = "none";
                this.frontPegRed.style.opacity = 0;
                this.backPegRed.style.opacity = 0;
                this.frontPegBlue.style.opacity = 0;
                this.backPegBlue.style.opacity = 0; 
            }

        } else {
            
            this.isCompact = false;
            var compactScoreboard = document.getElementById('scoreboard_compact');
            compactScoreboard.style.visibility = "hidden";

            var pegsScoreboard = document.getElementById('scoreboard_pegs');
            pegsScoreboard.style.visibility = "visible";

            var remainingSidePegHoleGroups = 22 - topPegGroupCount;
            var rightPegGroupCount = Math.floor(remainingSidePegHoleGroups/2);
            var leftPegGroupCount = remainingSidePegHoleGroups - rightPegGroupCount;

            var curTop = topMargin + pegHoleSegmentSpacing + (pegHoleSegmentLength + pegHoleSegmentSpacing)*leftPegGroupCount;
            
            var startHoles = document.createElement('img');
            startHoles.className = "scoreboard_pegholes_start";
            startHoles.src = "shared/images/scoreboard_pegholes_start.png";
            startHoles.style.top = curTop + 'px';
            leftColumn.appendChild(startHoles);

            var leftOffset = 8;
            var topOffset = 8;

            this.pegHolePositionsBlue.push([this.startPegGroupHolePositionOffsetBlue[0][0] + leftOffset, this.startPegGroupHolePositionOffsetBlue[0][1] + topOffset + curTop]);
            this.pegHolePositionsBlue.push([this.startPegGroupHolePositionOffsetBlue[1][0] + leftOffset, this.startPegGroupHolePositionOffsetBlue[1][1] + topOffset + curTop])
            this.pegHolePositionsRed.push([this.startPegGroupHolePositionOffsetRed[0][0] + leftOffset, this.startPegGroupHolePositionOffsetRed[0][1] + topOffset + curTop]);
            this.pegHolePositionsRed.push([this.startPegGroupHolePositionOffsetRed[1][0] + leftOffset, this.startPegGroupHolePositionOffsetRed[1][1] + topOffset + curTop]);
            
            for (var i=0; i<leftPegGroupCount; i++) {
                curTop -= pegHoleSegmentLength + pegHoleSegmentSpacing;
                var leftPegHoles = document.createElement('img');
                leftPegHoles.className = 'scoreboard_pegholes_left_side_vertical';
                leftPegHoles.src = 'shared/images/scoreboard_pegholes_horizontal.png';
                leftPegHoles.style.top = curTop + "px";
                leftColumn.appendChild(leftPegHoles);

                for (var j=0; j<5; j++) {
                    this.pegHolePositionsBlue.push([this.verticalPegGroupHolePositionOffsetsBlue[j][0] + leftOffset, this.verticalPegGroupHolePositionOffsetsBlue[j][1] + topOffset + curTop]);    
                    this.pegHolePositionsRed.push([this.verticalPegGroupHolePositionOffsetsRed[j][0] + leftOffset, this.verticalPegGroupHolePositionOffsetsRed[j][1] + topOffset + curTop]);
                }
            }
            
            var leftCornerPegHoles = document.createElement('img');
            leftCornerPegHoles.className = 'scoreboard_pegholes_turn_left';
            leftCornerPegHoles.src = 'shared/images/scoreboard_pegholes_turn_left.png';
            topRow.appendChild(leftCornerPegHoles);
            this.leftTurnStartPegHoleIndex = this.pegHolePositionsBlue.length;

            for (var j=0; j<5; j++) {
                this.pegHolePositionsBlue.push([this.leftTurnPegGroupHolePositionOffsetsBlue[j][0] + leftOffset, this.leftTurnPegGroupHolePositionOffsetsBlue[j][1] + topOffset]);    
                this.pegHolePositionsRed.push([this.leftTurnPegGroupHolePositionOffsetsRed[j][0] + leftOffset, this.leftTurnPegGroupHolePositionOffsetsRed[j][1] + topOffset]);
            }

            var curLeft = sideMargin + topPegHoleSegmentSpacing;
            for (var i=0; i<topPegGroupCount; i++) {
                var topPegHoles = document.createElement('img');
                topPegHoles.className = 'scoreboard_pegholes_horizontal';
                topPegHoles.src = 'shared/images/scoreboard_pegholes_horizontal.png';
                topPegHoles.style.left = curLeft + "px";
                leftColumn.appendChild(topPegHoles);

                for (var j=0; j<5; j++) {
                    this.pegHolePositionsBlue.push([this.horizontalPegGroupHolePositionOffsetsBlue[j][0] + leftOffset + curLeft, this.horizontalPegGroupHolePositionOffsetsBlue[j][1] + topOffset]);    
                    this.pegHolePositionsRed.push([this.horizontalPegGroupHolePositionOffsetsRed[j][0] + leftOffset + curLeft, this.horizontalPegGroupHolePositionOffsetsRed[j][1] + topOffset]);
                }

                curLeft += pegHoleSegmentLength + topPegHoleSegmentSpacing;
            }

            var rightCornerPegHoles = document.createElement('img');
            rightCornerPegHoles.className = 'scoreboard_pegholes_turn_right';
            rightCornerPegHoles.src = 'shared/images/scoreboard_pegholes_turn_left.png';
            topRow.appendChild(rightCornerPegHoles);
            this.rightTurnStartPegHoleIndex = this.pegHolePositionsBlue.length + 1;

            for (var j=0; j<5; j++) {
                this.pegHolePositionsBlue.push([width - this.rightTurnPegGroupHolePositionOffsetsBlue[j][0] + leftOffset, this.rightTurnPegGroupHolePositionOffsetsBlue[j][1] + topOffset]);    
                this.pegHolePositionsRed.push([width - this.rightTurnPegGroupHolePositionOffsetsRed[j][0] + leftOffset, this.rightTurnPegGroupHolePositionOffsetsRed[j][1] + topOffset]);
            }

            var curTop = topMargin + pegHoleSegmentSpacing;
            for (var i=0; i<rightPegGroupCount; i++) {
                var rightPegHoles = document.createElement('img');
                rightPegHoles.className = 'scoreboard_pegholes_right_side_vertical';
                rightPegHoles.src = 'shared/images/scoreboard_pegholes_horizontal.png';
                rightPegHoles.style.top = curTop + "px";
                rightColumn.appendChild(rightPegHoles);

                for (var j=0; j<5; j++) {
                    this.pegHolePositionsBlue.push([width - this.verticalRightPegGroupHolePositionOffsetsBlue[j][0] + leftOffset, this.verticalRightPegGroupHolePositionOffsetsBlue[j][1] + topOffset + curTop]);    
                    this.pegHolePositionsRed.push([width - this.verticalRightPegGroupHolePositionOffsetsRed[j][0] + leftOffset, this.verticalRightPegGroupHolePositionOffsetsRed[j][1] + topOffset + curTop]);
                }

                curTop += pegHoleSegmentLength + pegHoleSegmentSpacing;
            }

            var finishHoles = document.createElement('img');
            finishHoles.className = 'scoreboard_pegholes_finish';
            finishHoles.src = 'shared/images/scoreboard_pegholes_finish.png';
            finishHoles.style.top = curTop + 'px';
            rightColumn.appendChild(finishHoles);
            
            this.pegHolePositionsBlue.push([width - this.finishPegGroupHolePositionOffset[0] + leftOffset, this.finishPegGroupHolePositionOffset[1] + topOffset + curTop]);
            this.pegHolePositionsRed.push([width - this.finishPegGroupHolePositionOffset[0] + leftOffset, this.finishPegGroupHolePositionOffset[1] + topOffset + curTop]);
            
            if (this.frontPegRed != null && this.backPegRed != null && this.frontPegBlue != null && this.backPegBlue != null) {
                this.frontPegRed.style.transform = "translate(" + this.pegHolePositionsRed[this.frontPegRed.holeIndex][0] + "px," + this.pegHolePositionsRed[this.frontPegRed.holeIndex][1] + "px)";
                this.backPegRed.style.transform = "translate(" + this.pegHolePositionsRed[this.backPegRed.holeIndex][0] + "px," + this.pegHolePositionsRed[this.backPegRed.holeIndex][1] + "px)";
                this.frontPegBlue.style.transform = "translate(" + this.pegHolePositionsBlue[this.frontPegBlue.holeIndex][0] + "px," + this.pegHolePositionsBlue[this.frontPegBlue.holeIndex][1] + "px)";
                this.backPegBlue.style.transform = "translate(" + this.pegHolePositionsBlue[this.backPegBlue.holeIndex][0] + "px," + this.pegHolePositionsBlue[this.backPegBlue.holeIndex][1] + "px)";
            
                SetCorrectPegZIndexForPlayer();
                SetCorrectPegZIndexForComputer();

                this.frontPegRed.style.opacity = 1;
                this.backPegRed.style.opacity = 1;
                this.frontPegBlue.style.opacity = 1;
                this.backPegBlue.style.opacity = 1;
                
                pegsScoreView.style.opacity = 1; 
            }

            // Place the skunk line indicator
            var horizontalSkunkLine = document.getElementById('skunk_line_horizontal');
            var verticalSkunkLine = document.getElementById('skunk_line_vertical');
            if (rightPegGroupCount >= 6) {
                verticalSkunkLine.style.opacity = 0;
                horizontalSkunkLine.style.left = this.pegHolePositionsBlue[91][0] - 69 + 'px';
                horizontalSkunkLine.style.top = this.pegHolePositionsBlue[91][1] - 14 + menuBarHeight + 'px';
                horizontalSkunkLine.style.opacity = 1;
            } else {
                horizontalSkunkLine.style.opacity = 0;
                verticalSkunkLine.style.left = this.pegHolePositionsBlue[91][0] - 2 + 'px';
                verticalSkunkLine.style.top = this.pegHolePositionsBlue[91][1] - 25 + menuBarHeight + 'px';
                verticalSkunkLine.style.opacity = 1;
            }
        }
    }

    this.RedrawView();
}