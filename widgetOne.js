(function() {

	// self-calling anonymous function, voorkomt variabelenaam conflicten
	var widget = new Applesauce("widgetOne");

	widget.setVersion("1.11.1", "2.1.0");

	var $onefield = null;

	var start = function(callback) {

		widget.loadJQuery(
			launch,
			"https://ajax.googleapis.com/ajax/libs/jquery/" + widget.jqVersion + "/jquery.min.js");

		widget.injectScriptTag("/iframeResizer.min.js");
		
		/*
		widget.injectScriptTag("sammy/sammy-0.7.6.min.js");
		widget.injectScriptTag("sammy/plugins/sammy.template-0.7.6.min.js");
		*/
		
		function launch() {
			widget.jQuery.ajaxSetup({
				cache: true
			});
			
			/*
			widget.getFunctionScript(
				function() {
					//do stuff resulting in true or false
					return true;
				},
				"~/jquery-ui.1.10.4.custom.min.js",
				function() {
					//do stuff
					callback();
				}
			);
			*/
			
			widget.injectCss("simple.css");

			widget.log("Rocket launcher!");

			callback();
		}

	};

	start(function() {

		var $$ = widget.jQuery;

		/*
		var app = $$.sammy(function() {

			this.use('Template');

			this.element_selector = '#applesauce';

			this.get('#/', function(context) {

				this.load('data/items.json')
					.then(function(items) {

						$$.each(items, function(i, item) {

							widget.log("item: " + item.title + '-' + item.artist);

							context.render(
								'templates/item.template', {
									item: item
								}
							).appendTo(context.$element());
						});

					});

			});

			this.get('#/test', function() {
				$$('#applesauce').text('Hello World');
			});

		}).run('#/');
		*/
		
		widget.log(widget.widgetReference + ": " + $$.fn.jquery);

		$onefield = widget.getElement("oneselector");

		if ($onefield === null) {
			return;
		}

		$jarHead = widget.getElement("jarselecttor");

		if ($jarHead === null) {
			return;
		}
		
		// jQuery's .on() function is for jQuery >= 1.7
		$onefield.on("click", "li", function() {
			//widget.log( widget.jQuery(this).html() );
			//colorMe( widget.jQuery(this) );

			widget.log($$(this).html());
			colorMe($$(this));
		});
		
		//widget.injectScriptTag("/iframeResizer.min.js");
		
		widget.jarOpener($jarHead, "wokyboky", "//localhost:9393", "/iframeResizer.min.js");
		
		$('#wokyboky').iFrameResize({
			checkOrigin: false
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
