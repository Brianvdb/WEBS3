var server = /*"https://zeeslagavans.herokuapp.com/"*/"http://zeeslagavans2.herokuapp.com/";
var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImNqZ2hldW1lQGF2YW5zLm5sIg.DNq6H0fKb5NofVyq3kQPdWZLEiPdwFLSmCw0EXDZ_CE";

$(function () {
	var app = new App(server, token);

	app.switchView('list');
});