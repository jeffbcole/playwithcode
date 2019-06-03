var visibleMenuCards = [];
			
function MenuCardAppear(elementID) {
	var el = document.getElementById(elementID);
	visibleMenuCards.push(elementID);
	with(el.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "0.8s cubic-bezier(0.175, 0.885, 0.320, 1.275)";
		top = "50%";
		opacity = 1;
		pointerEvents = "auto";
	}
}

function MenuCardPressDown(elementID) {
	var el = document.getElementById(elementID);
	with(el.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "0.5s ease-out";
		boxShadow = "0px 0px 0px rgba(0,0,0,0.5)";
		transform = "scale(0.93) translate(-54%,-54%)";
		pointerEvents = "none";
	}
}

function MenuCardPopUp(elementID) {
	var el = document.getElementById(elementID);
	with(el.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "0.5s ease-in-out";
		boxShadow = "30px 30px 0px rgba(0,0,0,0.5)";
		transform = "scale(1) translate(-50%,-50%)";
		pointerEvents = "auto";
	}
}

function MenuCardDisappear(elementID) {
	var el = document.getElementById(elementID);
	with(el.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "0.4s ease-in";
		top = "100%";
		opacity = 0;
		pointerEvents = "none";
	}
}

function HideMenuButton() {
	var el = document.getElementById('menu_button');
	with(el.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "0.4s linear";
		opacity = 0;
		pointerEvents = "none";
	}
}

function ShowMenuButton() {
var el = document.getElementById('menu_button');
	with(el.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "0.4s linear";
		opacity = 1;
		pointerEvents = "auto";
	}
}

function MenuButtonPressed() {
	if (visibleMenuCards.length == 0)
	{
		// Show the close button
		var el = document.getElementById('menu_main_close_button');
		with(el.style) {
			display = 'block';
		}
		
		ShowMainMenu(true);
	}
}

function ShowMainMenu(showCloseButton) {
	if (showCloseButton) {
		var el = document.getElementById('menu_main_close_button');
		with(el.style) {
			display = 'block';
		}
	} else {
		var el = document.getElementById('menu_main_close_button');
		with(el.style) {
			display = 'none';
		}
	}
	MenuCardAppear('menu_main');
	HideMenuButton();
}

function menu_main_close_click() {
	visibleMenuCards = [];
	MenuCardDisappear('menu_main');
	ShowMenuButton();
}

function menu_card_close_click() {
	var topMenu = visibleMenuCards.pop();
	MenuCardDisappear(topMenu);
	var menuName = visibleMenuCards[visibleMenuCards.length-1];
	MenuCardPopUp(menuName);
}

function BoardSelectorClick(radio) {
	SetSetting('setting_board_color', radio.value);
	UpdateBackgroundImageFromSettings();
}

function UpdateBackgroundImageFromSettings() {
	var boardColor = GetSetting('setting_board_color');
	switch (boardColor){
		case 'wood_light':
			document.documentElement.style.backgroundImage = "url(shared/images/woodlightboard.jpg)";
			break;
		case 'wood':
			document.documentElement.style.backgroundImage = "url(shared/images/woodboard.jpg)";
			break;
		case 'wood_dark':
			document.documentElement.style.backgroundImage = "url(shared/images/wooddarkboard.jpg)";
			break;
		case 'wood_gray':
			document.documentElement.style.backgroundImage = "url(shared/images/woodgreyboard.jpg)";
			break;
		case 'green':
			document.documentElement.style.backgroundImage = "none";
			document.documentElement.style.backgroundColor = "#354216";
			break;
		case 'red':
			document.documentElement.style.backgroundImage = "none";
			document.documentElement.style.backgroundColor = "#C20A00";
			break;
		case 'blue':
			document.documentElement.style.backgroundImage = "none";
			document.documentElement.style.backgroundColor = "#071A5F";
			break;
	}
}

function CardSelectorClick(radio) {
	SetSetting('setting_card_color', radio.value);

	var cardBackURI = "url('shared/images/card_back_" + radio.value + ".jpg')";
	var elements = document.getElementsByClassName('cardBack');
	for (var i=0; i<elements.length; i++)
	{
		elements[i].style.backgroundImage = cardBackURI;
	}
}