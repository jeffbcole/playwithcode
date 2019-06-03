var setting_board_color_default = 'wood';
var setting_card_color_default = 'blue';

function GetSetting(setting) {
	switch (setting) {
		case "setting_board_color":
			var settingVal = window.localStorage.getItem(setting);
			return settingVal == null ? setting_board_color_default : settingVal;
			break;
		case "setting_card_color":
			var settingVal = window.localStorage.getItem(setting);
			return settingVal == null ? setting_card_color_default : settingVal;
			break;
	}
}

function SetSetting(setting, val) {
	window.localStorage.setItem(setting, val);
}