var server = "https://zeeslagavans.herokuapp.com/";
var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.InN0YW52YW5oZXVtZW5AZ21haWwuY29tIg.d0LLC8edhGMBz4SFfLiVVmIpuSerVLpJc9aqUZ97BlU";

$(function () {
	var app = new App(server, token);

	app.switchView('list');
});