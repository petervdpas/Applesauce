function Applesauce( widgetReference, existing ) {

	this.jqVersion = null;
	this.jqExisting = existing;
	this.jQuery = null; // The widget's own jQuery reference
	
	this.widgetReference = widgetReference;
	
	this.widget = null;
	this.path = null;
	
	if ((window.jQuery || null) === null && this.jqExisting) {
		
		this.log("Error - No jQuery found!");
		
	} else {

		if ( this.jQuery === null ) {
			this.jQuery = this.setJqueryByVersion(
				window.jQuery.fn.jquery,
				window.jQuery
			);
		}
		
		var widgetConf = document.getElementById(this.widgetReference);
		if ( (widgetConf || null) != null ) {
			existing = widgetConf.getAttribute('data-use-existing-jquery') || null;
			if ( existing != null ) {
				this.jqExisting = (existing.toLowerCase() === 'true') ? true : false;
			}
		} 
	}

	if (this.jqExisting) {
		this.log("Using existing jQuery!");
	} else {
		this.log("Using injected jQuery!");
	}
};

Applesauce.prototype.log = function (msg) {
	if ( (typeof console !== 'undefined') && 
			(typeof console.log !== 'undefined') ) {
		console.log("Applesauce: " + msg);
	}
};

Applesauce.prototype.init = function () {
	
	var _this = this;
	
	if (_this.path === null && _this.configElementId !== null) {
		_this.widget = _this.jQuery("#" + _this.widgetReference);
		_this.path = _this.widget.data("src");
		_this.jqExisting = _this.widget.data("existing");
	}
};

Applesauce.prototype.ver2num = function (version) {
	
	var version_parts = version.split('.').reverse(); //major to minor
	var c = (version_parts.length < 3) ? version_parts.length + 1 : 4;
	
	var n = 0;
	
	for (var i=1; i < c; i++) {
		n = n + (parseInt(version_parts[i-1]) * Math.pow(10, (i-1)*2));
	}
	
	return n;
};

Applesauce.prototype.setVersion = function (jqMin, jqMax) {
	
	var _this = this;
	
	var initial_version = window.jQuery.fn.jquery;
	
	if ( _this.jqExisting && (_this.ver2num(initial_version) >= _this.ver2num("1.6.1")) ) {
		_this.jqVersion = initial_version;
	} else {
		if ( document.attachEvent && !document.addEventListener ) {
			_this.jqVersion = jqMin;
		} else {
			_this.jqVersion = jqMax;
		}	
	}
	
	_this.log('loaded jQuery: ' + _this.jqVersion);
};

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

Applesauce.prototype.jarOpener = function (obj, idName, url) {
	
	var _this = this;
	
	var jar = document.createElement("iframe");
	jar.setAttribute("src", url);
	jar.setAttribute("scrolling", "no");
	jar.setAttribute("frameborder", "none");
	jar.setAttribute("position", "absolute");
	jar.setAttribute("left", "0");
	jar.setAttribute("top", "0");
	jar.setAttribute("width", "100%");
	jar.setAttribute("height", "0px");
	jar.setAttribute("scrolling", "no");
	
	jar.setAttribute("id", idName);
	
	obj.replaceWith(jar);
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
};

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

