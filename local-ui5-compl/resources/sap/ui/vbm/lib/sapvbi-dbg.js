/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

// VBI namespace
// Author: Ulrich Roegelein

sap.ui.define( function() {
	"use strict";

/* global VBI */// declare unusual global vars for JSLint/SAPUI5 validation
(function() {
	// .......................................................................//
	// check if there is already a VBI object................................//
	// .......................................................................//

	var bInitialized = (typeof VBI == "object") || window.VBI;

	// return immediately when vbi is already initialized....................//
	if (bInitialized) {
		return;
	}
	// ........................................................................//
	// create the vbi object..................................................//

	window.VBI = {
		// Mobile devices .....................................................//
		m_bIsMyChromeTest: (/chrome/gi).test(navigator.appVersion),
		m_bIsIDevice: sap.ui.Device.os.ios,
		m_bIsAndroid: sap.ui.Device.os.android,
		// mobile device is phone or tablet but not combi device like Microsoft Surface,
		// combi devices should be treated as normal desktop devices for better UEx
		m_bIsMobile: sap.ui.Device.system.phone || (sap.ui.Device.system.tablet && !sap.ui.Device.system.combi),
		m_bIsPhone: jQuery.device.is.phone,
		m_bIsRtl: (document.dir == "rtl") ? true : false,

		// global key state....................................................//
		m_ctrlKey: false,
		m_shiftKey: false,
		m_dwRefKeyboardHook: 0,

		// Map used for storing RichTooltips
		RttMap : {},

		// .....................................................................//
		// get the location service............................................//

		GetGeoLocationService: function() {
			if (this.GeoLocationService) {
				return this.GeoLocationService;
			}
			this.GeoLocationService = new VBI.GeoLocation();
			return this.GeoLocationService;
		},

		// .....................................................................//
		// publish subscribe container.........................................//

		Events: function() {
			var oCon = {};

			var hOP = oCon.hasOwnProperty;
			return {
				subscribe: function(itm, cb) {
					// add the item to the event container.......................//
					if (!hOP.call(oCon, itm)) {
						oCon[itm] = new Set();
					}
					// add subscription
					oCon[itm].add(cb);
					return {
						unsubscribe: function() {
							oCon[itm].delete(cb); // remove proper element based on callback as key
						}
					};
				},
				fire: function(itm, dat) {
					// when item is not there return immediately..................//
					if (!hOP.call(oCon, itm)) {
						return;
					}
					oCon[itm].forEach(function(itm) {
						itm(dat || {});
					});
				}
			};
		},

		// drag and drop event target
		m_DndTarget: null,
		// .....................................................................//
		// logging and tracing.................................................//

		m_Log: "",
		m_bTrace: (function() {
			// trace is active when VBITrace div is available................//
			var el = document.getElementById('VBITrace');
			return (el != null) ? true : false;
		})(),

		Trace: function(text) {
			// do a log on the console, a crlf is appended......................//
			if (typeof console != "undefined") {
				jQuery.sap.log.info(text + "\r\n");
			}
			// add the text to a trace element, the <br> linebreak tag is added.//
			var trace = document.getElementById('VBITrace');
			if (trace == null) {
				return;
			}
			VBI.m_Log = VBI.m_Log + jQuery.sap.encodeHTML(text) + "<br>";
			trace.innerHTML = VBI.m_Log;
		},

		// global register for key events.........................................//
		// for windows 8 surface like devices to get shift and ctrl key state at..//
		// any time...............................................................//

		RegisterKeyboardHook: function() {
			// add reference count.................................................//
			++window.VBI.m_dwRefKeyboardHook;

			// hook already registered.............................................//
			if (window.VBI.m_dwRefKeyboardHook > 1) {
				return;
			}

			window.VBI.onkeydown = function(e) {
				if (e.keyCode == 16) {
					VBI.m_shiftKey = true;
				} else if (e.keyCode == 17) {
					VBI.m_ctrlKey = true;
				}
			};
			window.VBI.onkeyup = function(e) {
				if (e.keyCode == 16) {
					VBI.m_shiftKey = false;
				} else if (e.keyCode == 17) {
					VBI.m_ctrlKey = false;
				}
			};

			document.addEventListener('keydown', window.VBI.onkeydown);
			document.addEventListener('keyup', window.VBI.onkeyup);

		},

		UnRegisterKeyboardHook: function() {
			--window.VBI.m_dwRefKeyboardHook;

			if (window.VBI.m_dwRefKeyboardHook > 0) {
				return;
			}

			// when to unregster the
			document.removeEventListener('keydown', window.VBI.onkeydown);
			document.removeEventListener('keyup', window.VBI.onkeyup);
			window.VBI.onkeydown = null;
			window.VBI.onkeyup = null;
		}

	};
})();

});
