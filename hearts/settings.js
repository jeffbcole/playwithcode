var HeartsSettings = function() {

	this.game_suffix = '_Hearts';
	this.setting_hints_default = false;
	this.setting_losing_score_default = 100;

	this.GetSetting = function(setting) {
		switch (setting) {
			case "setting_hints":
				var settingVal = window.localStorage.getItem(setting + this.game_suffix);
				return settingVal == null ? this.setting_hints_default : (settingVal == 'true');
				break;
			case "setting_losing_score":
				var settingVal = window.localStorage.getItem(setting + this.game_suffix);
				return settingVal == null ? this.setting_losing_score_default : settingVal;
				break;
		}
	}

	this.SetSetting = function(setting, val) {
		window.localStorage.setItem(setting + this.game_suffix, val);
	}

	this.GetStatistic = function(statistic) {
		var val = window.localStorage.getItem(statistic + this.game_suffix);
		return val == null ? Number(0) : Number(val);
	}

	this.SetStatistic = function(statistic, value) {
		window.localStorage.setItem(statistic + this.game_suffix, value);
	}

	this.ResetStatistics = function() {
		var difficulties = ['Easy', 'Standard', 'Pro'];
        var statsToReset = [
            'stat_wins_',
            'stat_2nd_',
            'stat_3rd_',
            'stat_4th_',
            'stat_moons_shot_'
        ];
        for (var i=0; i<statsToReset.length; i++) {
            for (var j=0; j<difficulties.length; j++) {
                var statName = statsToReset[i] + difficulties[j];
                window.localStorage.removeItem(statName + this.game_suffix);
            }
        }
	}
}