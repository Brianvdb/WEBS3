$(function() {
	var board = new Board(10);
	var game = new Game(board);
	
	game.getBoard().render();
});