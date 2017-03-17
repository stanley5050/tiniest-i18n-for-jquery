/*jslint nomen : true */
/*jslint evil: true */
/*global alert, $, alert, _cookie, jQuery */

(function ($) {
	'use strict';
	
	var _i18n_map = {},
		defaults = {
			lang : 'en',
			path : 'i18n',
			name : 'i18n',
            defaultLang : 'en',
            attrName : '_i18n'
		};
	
	$._i18n = function (options) {
		var clientLang = _cookie('_lang'),
            idx,
            lang;
        
		if (typeof clientLang !== 'undefined' && clientLang.length > 1) {
			lang = clientLang;
		}
        
        if (typeof options.lang !== 'undefined' && options.lang.length > 1) {
            lang = options.lang;
        }
        
        if (lang.length < 1) {
            lang = defaults.defaultLang;
        }
        
        for (idx in options) {
			if (options.hasOwnProperty(idx)) {
				defaults[idx] = options[idx];
			}
		}
        defaults.lang = lang;
		
		$.ajax({
			url : defaults.path + defaults.defaultLang + '.json',
			async : false,
			dataType : 'json',
			success : function (response) {
				_i18n_map[defaults.name] = response;
				if (defaults.lang !== defaults.defaultLang) {
					$.ajax({
						url : defaults.path + defaults.lang + '.json',
						async : false,
						dataType : 'json',
						success : function (response) {
							var idx;
							for (idx in response) {
								if (response.hasOwnProperty(idx)) {
									_i18n_map[defaults.name][idx] = response[idx];
								}
							}
						}
					});
				}
			}
		});
		return this;
	};
	
	$._i18n.parse = function (context) {
		var self = this,
            expression = '[' + defaults.attrName + ']';
		if (typeof context === 'undefined' || context.length < 1) {
			$(expression).each(function () {
				$(this).text(
					self.get($(this).attr(defaults.attrName))
				);
			});
		} else {
			$(context + ' ' + expression).each(function () {
				$(this).text(
					self.get($(this).attr(defaults.attrName))
				);
			});
		}
	};
	
	$._i18n.get = function (key) {
		var	keyPair, idx, swap, started = false;
		if (typeof key === 'undefined' || key.length < 1) {
			return '[Unknown]';
		}
		keyPair = key.split('.');
		for (idx = 0; idx < keyPair.length; idx = idx + 1) {
			if (idx === 0) {
				if (typeof _i18n_map[keyPair[idx]] !== 'undefined') {
					swap = _i18n_map[keyPair[idx]];
				} else {
                    swap = '[' + key + ']';
				    break;
                }
			} else if (typeof swap[keyPair[idx]] !== 'undefined') {
				swap = swap[keyPair[idx]];
			} else {
				swap = '[' + key + ']';
				break;
			}
		}
		return swap;
	};
	

}(jQuery));