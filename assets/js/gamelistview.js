function GameListView(app) {
    this.app = app;
}

GameListView.prototype = {
    init: function() {
        $('#gamelist').hide();

        this.app.requestGameList();

        this.bindListeners();
        this.listen();
    },

    destruct: function() {
        clearInterval(this.listener);
        $(window).off();
    },

    listen: function() {
        var self = this;
        this.listener = setInterval(function(){ self.app.requestGameList() }, 2000);
    },

    bindListeners: function() {
        $('#newgame').click( $.proxy(this.onNewGameClick, this) );
        $('#newgameai').click( $.proxy(this.onNewGameAIClick, this) );
        $('#removegames').click( $.proxy(this.onRemoveGamesClick, this) );
    },

    onNewGameClick: function(event) {
        this.app.requestNewGame();
    },

    onNewGameAIClick: function(event) {
        this.app.requestNewGame(true);
    },

    onRemoveGamesClick: function(event) {
        this.app.removeGames();
    },

    onGamesRemoved: function() {
        alert("De gamelijst is leeggemaakt");
        this.app.requestGameList();
    },

    onGameCreated: function(game) {
        if(game.msg && game.msg.indexOf('Error') == 0) {
            alert("Er is al een game aangemaakt.");
            return;
        }

        this.app.requestGameList();
    },

    onNavigateClick: function(event) {
        var elem = $(event.delegateTarget);
        var id = elem.data('id');
        var self = this;

        // request status of game
        this.app.requestGame(id, function(game) {
            if(game) {
                switch(game.getStatus()) {
                    case "setup":
                        self.app.switchView('setupboard', id);
                        break;
                    case "done":
                    case "started":
                        self.app.switchView('game', id);
                        break;
                }
            }
        });
    },

    onGameListReceived: function(gameList) {
        console.log('gamelist received');

        var table = $('#gamelist');
        table.empty();
        table.append('<tr><th>Id</th><th>Status</th><th>Enemy Name</th><th></th></tr>');

        for(var i = 0; i < gameList.getGames().length; i++) {
            var row = $('<tr></tr>');
            var game = gameList.getGames()[i];
            if(game.getStatus() == 'que') {
                row.append('<td>' + game.getId() + '</td>');
                row.append('<td>' + game.getStatus() + '</td>');
                table.append(row);
            } else if(game.getStatus() == 'setup' || game.getStatus() == 'started' || game.getStatus() == 'done') {
                row.append('<td>' + game.getId() + '</td>');
                row.append('<td>' + game.getStatus() + '</td>');
                row.append('<td>' + game.getEnemyName() + '</td>');
                row.append('<td><button class="navigate-game" data-id=' + game.getId() + ' data-state="' + game.getStatus() + '">Go</button></td>');
                table.append(row);
            }
        }

        $('.navigate-game').click($.proxy(this.onNavigateClick, this));

        table.show();
    }
}