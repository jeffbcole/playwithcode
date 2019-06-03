var CribbageSettings = function() {

	this.game_suffix = '_Cribbage';
	this.setting_manual_count_scores_default = false;
	this.setting_muggins_default = false;
	this.setting_hints_default = false;
	this.setting_warn_suboptimal_default = false;
	this.setting_fast_count_default = false;

	this.GetSetting = function(setting) {
		switch (setting) {
			case "setting_manual_count_scores":
				var settingVal = window.localStorage.getItem(setting + this.game_suffix);
				return settingVal == null ? this.setting_manual_count_scores_default : (settingVal == 'true');
				break;
			case "setting_muggins":
				var settingVal = window.localStorage.getItem(setting + this.game_suffix);
				return settingVal == null ? this.setting_muggins_default : (settingVal == 'true');
				break;
			case "setting_hints":
				var settingVal = window.localStorage.getItem(setting + this.game_suffix);
				return settingVal == null ? this.setting_hints_default : (settingVal == 'true');
				break;
			case "setting_warn_suboptimal":
				var settingVal = window.localStorage.getItem(setting + this.game_suffix);
				return settingVal == null ? this.setting_warn_suboptimal_default : (settingVal == 'true');
				break;
			case "setting_fast_count":
				var settingVal = window.localStorage.getItem(setting + this.game_suffix);
				return settingVal == null ? this.setting_fast_count_default : (settingVal == 'true');
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

	this.GetStatisticString = function(statistic) {
		var val = window.localStorage.getItem(statistic + this.game_suffix);
		return val == null ? "" : val;
	}

	this.SetStatistic = function(statistic, value) {
		window.localStorage.setItem(statistic + this.game_suffix, value);
	}
}