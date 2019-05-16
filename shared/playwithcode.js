
function InitializePlayWithCode() {
    // Add the play with code button to the main menu
    var mainMenu = document.getElementById('menu_main');
    var playWithCodeButton = document.createElement('button');
    playWithCodeButton.className = 'menu_button';
    playWithCodeButton.innerText = 'Play With Code';
    playWithCodeButton.onclick = ShowPlayAsAComputerMenu;
    mainMenu.prepend(playWithCodeButton);
}

function ShowPlayAsAComputerMenu() {
	var menuName = visibleMenuCards[visibleMenuCards.length-1];
	MenuCardPressDown(menuName);
	MenuCardAppear("menu_start_a_game");
}


