(function() {

	// self-calling anonymous function, voorkomt variabelenaam conflicten
	var widget = new Applesauce("widgetTwo");

	widget.setVersion("1.11.1", "2.1.0");

	var $onefield = null;

	var start = function(callback) {

		widget.loadJQuery(
			launch,
			"https://ajax.googleapis.com/ajax/libs/jquery/" + widget.jqVersion + "/jquery.min.js");

		function launch() {
			widget.jQuery.ajaxSetup({
				cache: true
			});
			widget.injectCss("simple.css");

			widget.log("Rocket launcher!");

			callback();
		}

	};

	start(function() {

		var $$ = widget.jQuery;

		widget.log(widget.widgetReference + ": " + $$.fn.jquery);

		$otherfield = widget.getElement("otherselector");

		if ($otherfield === null) {
			return;
		}

		// jQuery's .on() function is for jQuery >= 1.7
		$otherfield.on("click", "li", function() {
			//widget.log( widget.jQuery(this).html() );
			//colorMe( widget.jQuery(this) );

			widget.log($$(this).html());
			colorMe($$(this));
		});

	});

	colorMe = function(elem) {

		var className = elem.html().toLowerCase();

		if (elem.hasClass(className)) {
			elem.removeClass(className);
		} else {
			elem.addClass(className);
		}
	};

})();
