function Applesauce( widgetReference ) {

	this.jqVersion = null;
	this.jQuery = null; // The widget's own jQuery reference
	
	this.widgetReference = widgetReference;
	this.widget = null;
	this.path = null;
	
	if ( this.jQuery === null ) {
				
		this.jQuery = this.setJqueryByVersion(
			window.jQuery.fn.jquery,
			window.jQuery
		);
	}
}

Applesauce.prototype.log = function (msg) {
	if ( console && 
			(typeof console !== 'undefined') && 
			(typeof console.log !== 'undefined') ) {
				
		console.log("Applesauce: " + msg);
	}
}

Applesauce.prototype.init = function () {
	
	var _this = this;
	
	if (_this.path === null && _this.configElementId !== null) {
		_this.widget = _this.jQuery("#" + _this.widgetReference);
		_this.path = _this.widget.data("src");
	}
};

Applesauce.prototype.setVersion = function (jqMin, jqMax) {
	
	var _this = this;
	
	if ( document.attachEvent && !document.addEventListener ) {
		_this.jqVersion = jqMin;
	} else {
		_this.jqVersion = jqMax;
	}
}

Applesauce.prototype.injectScriptTag = function (url) {
	
	var _this = this;
	
	if ( !_this.checkInjectedUrls(url) ) {
		var script = document.createElement("script");
		script.type = 'text/javascript';
		script.src = url;
		document.getElementsByTagName("head")[0].appendChild(script);
	}
	
	//this.log(window.applesauce_injected_urls);
};

Applesauce.prototype.injectCss = function (url) {
	
	var _this = this;
	
	var url = _this.resolveUrl(url);
	
	if ( !this.checkInjectedUrls(url) ) {
		if ( document.createStyleSheet ) {
			document.createStyleSheet(url, 0);
		} else {
			_this.jQuery('<link rel="stylesheet" type="text/css" href="' + 
				url + '" />').appendTo('head');
		}
	}
};

Applesauce.prototype.resolveUrl = function (url) {
	
    var _this = this;

	_this.init();

	if ( url && (url.length >= 2) && (url.substr(0, 1) == "~") ) {
	   return _this.path + url.substr(1);
	} else {
	   return url;
	}
};

Applesauce.prototype.UrlExists = function (url) {

    var _this = this;

    _this.jQuery.ajax({
        url: url,
        type: 'HEAD',
        error: function () {
            return false;
        },
        success: function () {
            return true;
        }
    });
}

/* Might rename to checkInjectedSource */
Applesauce.prototype.checkInjectedUrls = function (url) {
	
	if (typeof window.applesauce_injected_urls === 'undefined') {
		window.applesauce_injected_urls = [];
	}

	for (var i = 0; i < window.applesauce_injected_urls.length; i++ ) {
		if ( window.applesauce_injected_urls[i] === url ) {
			return true;
		} 
	}
	
	window.applesauce_injected_urls.push(url);
	
	return false;
};

Applesauce.prototype.setJqueryByVersion = function (version, jqObject) {
	
	var jqr = this.getJqueryByVersion(version);
	
	if ( jqr === null ) {
		
		window.applesauce_jquery_objects.push({
			version: version,
			jquery: jqObject
		});
		
		return jqObject;
		
	} else {
		
		return jqr;
	}
};

Applesauce.prototype.getJqueryByVersion = function (version) {
	
	if (typeof window.applesauce_jquery_objects === 'undefined') {
		window.applesauce_jquery_objects = [];
	}
	
	for (var i = 0; i < window.applesauce_jquery_objects.length; i++ ) {
		if ( window.applesauce_jquery_objects[i].version === version ) {
			return window.applesauce_jquery_objects[i].jquery;
		} 
	}
	
	return null;
};

Applesauce.prototype.loadJQuery = function (callback, jqUrl) {
	
	var _this = this;
	
	if (_this.jQuery && _this.jQuery.fn.jquery === _this.jqVersion) {
		_this.jQuery(callback);
		//callback();
	}
	else {
		
		// Required version of jQuery is not loaded
		if ( !(window.jQuery && (window.jQuery.fn.jquery === _this.jqVersion)) ) {
			
			//Only if not yet in global array: applesauce_injected_urls!! 
			_this.injectScriptTag(jqUrl); 

			// Wait until jQuery exists
			var checkReady = function () {

				if ( window.jQuery && window.jQuery.fn.jquery === _this.jqVersion ) {
					
					_this.jQuery = _this.getJqueryByVersion(_this.jqVersion);
					
					if ( _this.jQuery === null ) {
						_this.jQuery = _this.setJqueryByVersion(
							_this.jqVersion, 
							window.jQuery.noConflict());
					}
					
					_this.jQuery(callback);
					//callback();
					
				} else {
					window.setTimeout(function () { checkReady(); }, 10);
				}
			};
			
			checkReady();
			
		} else {
			
			_this.jQuery = _this.getJqueryByVersion(_this.jqVersion);
			
			if ( _this.jQuery === null ) {
				_this.jQuery = _this.setJqueryByVersion(
					_this.jqVersion, 
					window.jQuery);
			}

			_this.jQuery(callback);
			//callback();
		}
	}

};

Applesauce.prototype.getScript = function (src, callback) {
	
    var _this = this;

    if (!_this.checkInjectedUrls(src)) {
        _this.jQuery.getScript(_this.resolveUrl(src), callback);
    } else {
        window.setTimeout(callback, 0);
    }
};

Applesauce.prototype.getFunctionScript = function (func, src, callback) {

    var _this = this;

    if ( func() ) {
        window.setTimeout(callback, 0);
    } else {
        if (!_this.checkInjectedUrls(src)) {
            _this.jQuery.getScript(_this.resolveUrl(src), callback);
        } else {
            window.setTimeout(function () { 
				_this.getFunctionScript(func, src, callback) 
			}, 1000);
        }
    }
};

Applesauce.prototype.getWidgetData = function (name) {
	var _this = this;
	_this.init();
	return _this.widget.data(name);
};

Applesauce.prototype.getElement = function (elementName) {

	var _this = this;
	
    _this.init();

	/*
	for (var i = 0; i < window.applesauce_jquery_objects.length; i++ ) {
		_this.log(window.applesauce_jquery_objects[i].version);
	}
	*/
	
	//Do I have jQuery ????
	
    var elem = _this.widget.data(elementName);

    if (elem === null) {
        this.log("Widget does not contain attribute '" + elementName + "'!");
        return null;
    }

    var $elemento = _this.jQuery(elem);

    if ($elemento === null || $elemento.length === 0) {
        this.log("Field for attribute '" + elementName + "' was not found on the page!");
        return null;
    }

    return $elemento;
};

