(function () { 
	
	// self-calling anonymous function, voorkomt variabelenaam conflicten
	var widget = new Applesauce( "widgetOne" );
	
	widget.setVersion("1.11.1", "2.1.0");

	var $onefield = null;

	var start = function (callback) {
		
		widget.loadJQuery(
			launch,
			"http://hkl.nl/js/jquery/" + widget.jqVersion + "/jquery.min.js");
		
		function launch() {
			widget.jQuery.ajaxSetup({cache: true});
			widget.log("Rocket launcher!");
			callback();
		}
		
	};

	start(function () {
		
		widget.log( widget.widgetReference + ": " + widget.jQuery.fn.jquery);
		
		$onefield = widget.getElement("oneselector");

 		if ($onefield === null) {
 		    return;
 		}
		
		$onefield.each(function(){
			$(this).find('li').each(function(){
		           widget.log($(this).html());
			});
		});
		
    });
	
	
})();