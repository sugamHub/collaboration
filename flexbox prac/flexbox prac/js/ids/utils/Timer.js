/**
 * @fileoverview Timer class. Provides interface to fire user-defined events
 * at a specified interval.
 * @author brent_knop@uhc.com (Brent Knop)
 * @preserve Copyright 2012 United HealthCare. All Rights Reserved.
 */



(function () {
	'use strict';
	
	/**
	 * Timer class.
	 * Fires a user-defined function at a specified interval.
	 * @param {Object} args Arguments to apply to instance of Timer class.
	 * @constructor
	 */	
	ids.utils.Timer = function(args) {
		this.isRunning = false;
		
		if (args !== null && typeof args === 'object') {
			if (args.hasOwnProperty('interval')) {
				if (isNaN(args.interval)) {
					throw new Error('Invalid interval.');
				}
				
				this.interval = args.interval;
			}
			
			if (args.hasOwnProperty('maxTicks')) {
				if (isNaN(args.maxTicks)) {
					throw new Error('Invalid maxTicks.');
				}
				
				this.maxTicks = args.maxTicks;
			}			
			
			if (args.hasOwnProperty('onBeforeTick') && typeof args.onBeforeTick === 'function') {
				this.onBeforeTick = args.onBeforeTick;
			}
			
			if (args.hasOwnProperty('onAfterTick') && typeof args.onAfterTick === 'function') {
				this.onAfterTick = args.onAfterTick;
			}
			
			if (args.hasOwnProperty('onExpire') && typeof args.onExpire === 'function') {
				this.onExpire = args.onExpire;
			}								
		}		
	};
	
	ids.utils.Timer.prototype = {
		
		/**
		 * Default (1 minute) interval (in milliseconds)
		 * @type {number}
		 */			
		interval: 60000,
		
		/**
		 * Default number of times the timer should tick before expiring
		 * @type {number}
		 */				
		maxTicks: 20,
		
		/**
		 * Tracks Timer state (running or not)
		 * @type {boolean}
		 */
		isRunning: false,
		
		/**
		 * Method to execute immediately before timer ticks
		 * @type {function}
		 */		
		onBeforeTick: null,
		
		/**
		 * Method to execute immediately after timer ticks
		 * @type {function}
		 */		
		onAfterTick: null,
		
		/**
		 * Method to execute immediately before Timer expires. 
		 * @type {function}
		 */		
		onBeforeExpire: null,
		
		/**
		 * Method to execute immediately after Timer expires. 
		 * @type {function}
		 */		
		onAfterExpire: null,		
		
		/**
		 * Current timer's ID (returned by setInterval) 
		 * @type {number}
		 * @private
		 */
		_id: null,
		
		/**
		 * Current tick of the timer
		 * @type {number}
		 * @private
		 */
		_ticks: 0,
		
		/**
		 * Starts timer
		 */
		start: function() {
			var self = this;
			this._id = setInterval(function() { self.tick(); }, this.interval);
			this.isRunning = true;
		},
		
		/**
		 * Stops timer and resets _ticks
		 */		
		stop: function() {
			clearInterval(this._id);
			this._id = null;
			this.isRunning = false;
		},	
		
		/**
		 * Resets _ticks to 0, does not stop timer
		 */				
		reset: function() {
			this._ticks = 0;	
		},
		
		/**
		 * Stops timer, does not reset _ticks
		 */				
		pause: function() {
			clearInterval(this._id);
			this._id = null;
			this.isRunning = false;
		},
		
		expire: function() {
			if (typeof this.onBeforeExpire === 'function') {
				this.onBeforeExpire(this._ticks);
			}		
			
			this._ticks = 0;
			clearInterval(this._id);
			this._id = null;
			this.isRunning = false;
			
			if (typeof this.onAfterExpire === 'function') {
				this.onAfterExpire(this._ticks);
			}			
		},
		
		/**
		 * Runs on each tick of the timer.
		 */				
		tick: function() {			
			if (typeof this.onBeforeTick === 'function') {
				this.onBeforeTick(this._ticks);
			} 
						
			this._ticks++;
			
			if (this._ticks === this.maxTicks) {
				this.expire();
			}
			
			if (typeof this.onAfterTick === 'function') {
				this.onAfterTick(this._ticks);
			}			
		}			
	};			
	
}());