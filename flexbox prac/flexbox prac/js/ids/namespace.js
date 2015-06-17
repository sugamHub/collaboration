/**
 * @fileoverview Global "namspace" variable. 
 * @author brent_knop@uhc.com (Brent Knop)
 * @preserve Copyright 2012 United HealthCare. All Rights Reserved.
 */



/**
 * Global namespace object. To change namespace name, change this var.
 */
var ids = {};

/**
 * Assigns properties to global namespace object
 */
(function (namespace) {
	'use strict';		
	
	/**
	 * Property to hold global objects.
	 * @type {object}
	 */
	namespace.global = {};
	
	/**
	 * Property to hold page-specific objects.
	 * @type {object}
	 */
	namespace.page = {};
	
	/**
	 * Property to hold utility/helper methods.
	 * @type {object}
	 */
	namespace.utils = {};
	
	/**
	 * Property to hold validation methods.
	 * @type {object}
	 */
	namespace.validation = {
		date: {
			isValid: function(date) {
				return date instanceof Date && !isNaN(date.getTime());				
			}			
		}
	};
}(ids));