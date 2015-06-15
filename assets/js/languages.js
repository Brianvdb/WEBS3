var dutch = {
	"games" : "Spellen",
	"new game player" : "Nieuw spel vs speler",
	"new game computer" : "Nieuw spel vs computer",
	"delete games" : "Verwijder alle spellen",
	"started games" : "Spellen die gestart zijn",
	"setup games" : "Spellen die ingesteld moeten worden",
	"que games" : "Spellen in de wachtrij",
	"done games" : "Spellen die klaar zijn",
	"creators" : "Gemaakt door Brian van den Broek en Stan van Heumen",
	"undefined" : "Onbekend",
	"drag ships" : "Plaats de schepen op het bord",
	"send board" : "Stuur bord",
	"go back" : "Ga terug",
	"your turn" : "Jouw beurt",
	"enemy turn" : "Tegenstanders beurt",
	"your board" : "Jouw bord",
	"enemy board" : "Tegenstanders bord"
};

var english = {
	"games" : "Games",
	"new game player" : "New game vs player",
	"new game computer" : "New game vs computer",
	"delete games" : "Delete all your games",
	"started games" : "Started games",
	"setup games" : "Setup games",
	"que games" : "Que games",
	"done games" : "Done games",
	"creators" : "Created by Brian van den Broek and Stan van Heumen",
	"undefined" : "Undefined",
	"drag ships" : "Drag the ships on the board",
	"send board" : "Send board",
	"go back" : "Go back",
	"your turn" : "Your turn",
	"enemy turn" : "Enemy turn",
	"your board" : "Your board",
	"enemy board" : "Enemys board"
};

var language = english;

function setLanguage(lang) {
	if (lang == 'dutch') {
		language = dutch;
	} else {
		language = english;
	}
}

function translate() {
	$.each(language, function(k, v) {
		if ($("[data-language='" + k + "']").length) {
			$("[data-language='" + k + "']").text(v);
		}
	});
}

function getWord(string) {
	return language[string];
}

function setLanguageCookie(language) {
	var date = new Date();
	date.setFullYear(2020);
	document.cookie = "language=" + language + "; expires=" + date.toUTCString() + ";";
}