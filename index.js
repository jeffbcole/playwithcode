function Initialize() {
    document.documentElement.style.backgroundImage = "url(shared/images/woodboard.jpg)";
    setTimeout(function () {
        ShowMainMenu();
        ShowTitle();
    }, 500);
}

function ShowMainMenu() {
    var el = document.getElementById('menu_main');
	with(el.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "0.8s cubic-bezier(0.175, 0.885, 0.320, 1.275)";
		top = "50%";
		opacity = 1;
		pointerEvents = "auto";
    }
}

function ShowTitle() {
	var el = document.getElementById("playwithcode_title");
	with(el.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "0.8s cubic-bezier(0.175, 0.885, 0.320, 1.275)";
		top = "150px";
		opacity = 1;
	}
}

function PlayWithCardsGameClick(gameName) {
    switch (gameName) {
        case 'hearts':
        window.location.href = './hearts/index.html';
        break;
        case 'spades':
        window.location.href = './spades/index.html';
        break;
        case 'pinochle':
        window.location.href = './pinochle/index.html';
        break;
        case 'cribbage':
        window.location.href = './cribbage/index.html';
        break;
    }
}