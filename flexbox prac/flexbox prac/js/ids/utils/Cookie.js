/**
 * @fileoverview Cookie handler class. Provides cookie management via objects.
 * @author brent_knop@uhc.com (Brent Knop)
 * @preserve Copyright 2012 United HealthCare. All Rights Reserved.
 * @dependency IE6, IE7 will require https://github.com/douglascrockford/JSON-js/blob/master/json2.js
 */


(function () {
	'use strict';

	/**
	 * Class for handling Cookie objects
	 * @param args {Object} cookie attributes
	 * @constructor
	 */
	ids.utils.Cookie = function(args) {		
		if (args !== null && typeof args === 'object') {
			
			if (args.hasOwnProperty('expires')) {
				if (!ids.validation.date.isValid(args.expires)) {
					throw new Error('Invalid expiration date.');
				} else {
					this.expires = new Date(args.expires);
				}							
			}			
			
			if (args.hasOwnProperty('name')) {
				this.name = args.name;
			}
			
			if (args.hasOwnProperty('value')) {
				this.value = args.value;
			}
			
			if (args.hasOwnProperty('domain')) {
				this.domain = args.domain;
			}
			
			if (args.hasOwnProperty('path')) {
				this.path = args.path;
			}								
		}				
	};
	
	ids.utils.Cookie.prototype = {
		/**
		 * Cookie name
		 * @type {string} 
		 */
		name: null,

		/**
		 * Cookie value
		 * @type {string} 
		 */
		value: null,
		
		/**
		 * Cookie domain
		 * @type {string} 
		 */	
		domain: null,
		
		/**
		 * Cookie path
		 * @type {string} 
		 */	
		path: null,
		
		/**
		 * Cookie expiration date
		 * @type {Date} 
		 */	
		expires: null,	

		/**
		 * Reads a cookie by name. If cookie exists, sets value property. Otherwise,
		 * throws Exception. 
		 */
		read: function() {
			if (this.name === null) {
				throw new Error('Attempted read without specifying cookie name.');
			}
			
			var cookie = ids.utils.Cookie.getCookieByName(this.name);
			if (cookie !== null) {
				this.value = cookie.value;
			}
		},

		/**
		 * Writes a cookie
		 */
		write: function() {
			var value = encodeURI(JSON.stringify(this.value)) + ';';		
			
			if (this.domain !== null) {
				value += encodeURI(this.domain) + ';';
			}
			
			if (this.path !== null) {
				value += encodeURI(this.path) + ';';
			}
			
			if (this.expires !== null) {
				value += 'expires=' + this.expires.toUTCString() + ';';
			}	
			
			document.cookie = encodeURI(this.name) + '=' + value;
		},

		/**
		 * Sets a cookie's value
		 * @param values{string} Value to assign to cookie
		 */
		setValue: function(value) {
			this.value = value;
			this.write();
		},

		/**
		 * Deletes an existing cookie. Throws Exception if name is not set.
		 */
		remove: function() {
			if (this.name === null) {
				throw new Error('Attempted read without specifying cookie name.');
			}
			
			if (this.exists()) {			
				this.value = null;
				// cookie expires when Skynet attacks
				this.expires = new Date('Fri, 29-Aug-1997 02:14:00');
				this.write();			
			}
		},
		
		/**
		 * Checks for existence of cookie in browser
		 * @returns {Boolean} True if cookie exists in browser, otherwise false
		 */
		exists: function() {
			return ids.utils.Cookie.getCookieByName(this.name) !== null;
		}		
	};			
	
	/**
	 * Retrieves a cookie by name
	 * @param name {string} Cookie name to retrieve
	 * @static
	 * @returns {Cookie}, or {null} if not found
	 */
	ids.utils.Cookie.getCookieByName = function(name) {
		var i, pieces;
		var cookie = null;
		var cookies = document.cookie.split(';');
		var len = cookies.length;
		for (i = 0; i < len; i++) {
			pieces = ids.utils.String.trim(cookies[i]).split('=');
			if (pieces.length === 2 && decodeURI(pieces[0]) === name) {
				cookie = new ids.utils.Cookie({
							name: name, 
							value: decodeURI(pieces[1])
					});
				break;
			}
		}
		
		return cookie;	
	};
	
	/**
	 * Deletes a cookie by name
	 * @static
	 * @param name {string} Cookie name to delete
	 */
	ids.utils.Cookie.removeCookieByName = function(name) {
		new ids.utils.Cookie({name: name}).remove();
	};		
	
}());