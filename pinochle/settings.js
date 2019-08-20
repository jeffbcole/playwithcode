var PinochleSettings = function() {
	this.game_suffix = '_Pinochle';
	this.setting_hints_default = false;
	this.setting_undo_default = false;
	this.setting_winning_score_default = 200;
	this.setting_minimum_bid_default = 20;
	this.setting_sort_left_to_right_default = true;
	this.setting_score_multiplier_default = false;
	this.setting_counters_display_default = 1;
	this.setting_passing_cards_count_default = 3;
	this.setting_preferred_skill_default = 0;
	this.setting_deck_count_default = 0;
	this.setting_bidding_speed_default = 0;
	this.setting_trick_speed_default = 1;

	this.GetSetting = function(setting) {
		switch (setting) {
			case "setting_hints":
				var settingVal = window.localStorage.getItem(setting + this.game_suffix);
				return settingVal == null ? this.setting_hints_default : (settingVal == 'true');
				break;
			case "setting_undo":
				var settingVal = window.localStorage.getItem(setting + this.game_suffix);
				return settingVal == null ? this.setting_undo_default : (settingVal == 'true');
				break;
			case "setting_winning_score":
				var settingVal = window.localStorage.getItem(setting + this.game_suffix);
				return settingVal == null ? this.setting_winning_score_default : settingVal;
				break;
			case "setting_minimum_bid":
				var settingVal = window.localStorage.getItem(setting + this.game_suffix);
				return settingVal == null ? this.setting_minimum_bid_default : settingVal;
				break;
			case "setting_sort_left_to_right":
				var settingVal = window.localStorage.getItem(setting + this.game_suffix);
				return settingVal == null ? this.setting_sort_left_to_right_default : (settingVal == 'true');
				break;
			case "setting_score_multiplier":
				var settingVal = window.localStorage.getItem(setting + this.game_suffix);
				return settingVal == null ? this.setting_score_multiplier_default : (settingVal == 'true');
				break;
			case "setting_counters_display":
				var settingVal = window.localStorage.getItem(setting + this.game_suffix);
				return settingVal == null ? this.setting_counters_display_default : settingVal;
				break;
				case "setting_passing_cards_count":
				var settingVal = window.localStorage.getItem(setting + this.game_suffix);
				return settingVal == null ? this.setting_passing_cards_count_default : settingVal;
				break;
			case "setting_preferred_skill":
				var settingVal = window.localStorage.getItem(setting + this.game_suffix);
				return settingVal == null ? this.setting_preferred_skill_default : settingVal;
				break;
			case "setting_deck_count":
				var settingVal = window.localStorage.getItem(setting + this.game_suffix);
				return settingVal == null ? this.setting_deck_count_default : settingVal;
				break;
			case "setting_bidding_speed":
				var settingVal = window.localStorage.getItem(setting + this.game_suffix);
				return settingVal == null ? this.setting_bidding_speed_default : settingVal;
				break;
			case "setting_trick_speed":
				var settingVal = window.localStorage.getItem(setting + this.game_suffix);
				return settingVal == null ? this.setting_trick_speed_default : settingVal;
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
}