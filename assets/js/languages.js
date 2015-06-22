function Languages(app) {
	this.app = app;
	this.language = null;
	this.init();
}

Languages.prototype = {
	init: function() {
		this.language = this.importLanguage();
	},

	importLanguage: function() {
		var result = undefined;
		if (this.getLanguageCookie() == null) {
			this.setLanguageCookie('english');
		}
		$.ajax({
		    type: 'GET',
		    url: 'assets/js/json/' + this.getLanguageCookie() + '_lang.json',
		    dataType: 'json',
		    success: function(value) {
		    	result = value;
		    },
		    data: {},
		    async: false
		});
		return result;
	},

	getLanguageCookie: function() {
		var dc = document.cookie;
		var prefix = "language=";
		var begin = dc.indexOf("; " + prefix);
		if (begin == -1) {
			begin = dc.indexOf(prefix);
			if (begin != 0) return null;
		}
		else
		{
			begin += 2;
			var end = document.cookie.indexOf(";", begin);
			if (end == -1) {
			end = dc.length;
			}
		}
		return unescape(dc.substring(begin + prefix.length, end));
	},

	setLanguageCookie: function(language) {
		var date = new Date();
		date.setFullYear(2025);
		document.cookie = "language=" + language + "; expires=" + date.toUTCString() + ";";
	},

	translate: function() {
		$.each(this.language, function(k, v) {
			var element = $("[data-language='" + k + "']");
			if (element.length) {
				element.text(v);
			}
		});
	},

	getTranslation: function(string) {
		return this.language[string];
	}
}