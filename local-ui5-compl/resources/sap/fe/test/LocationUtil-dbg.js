/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/test/OpaBuilder", "sap/ui/test/Opa5", "sap/fe/test/Utils"], function (OpaBuilder, Opa5, Utils) {
	"use strict";

	// Match with V4Freestyle and SO Apps
	var getHash = function (oRootView, bGetHashFromWindow) {
		if (bGetHashFromWindow || !(typeof oRootView.getController().getRouter === "function")) {
			var oWindow = Opa5.getWindow();
			return oWindow.window.location.hash;
		}
		return oRootView.getController().getRouter().getHashChanger().getHash();
	};
	var getRootViewId = function (sFlpAppName) {
		return new RegExp(Utils.formatMessage("^application-{0}-component---app(RootView)?$", sFlpAppName));
	};

	return {
		create: function (sFlpAppName) {
			return {
				actions: {},
				assertions: {
					iCheckCurrentHashStartsWith: function (sHash, bGetHashFromWindow) {
						return OpaBuilder.create(this)
							.hasId(getRootViewId(sFlpAppName))
							.check(function (aRootViews) {
								var sCurrentHash = getHash(aRootViews[0], bGetHashFromWindow);
								return sCurrentHash.indexOf(sHash) === 0;
							})
							.description("Checking hash starts with " + sHash)
							.execute();
					},
					iCheckCurrentHashDoesNotContain: function (sPart, bGetHashFromWindow) {
						return OpaBuilder.create(this)
							.hasId(getRootViewId(sFlpAppName))
							.check(function (aRootViews) {
								var sCurrentHash = getHash(aRootViews[0], bGetHashFromWindow);
								return sCurrentHash.indexOf(sPart) === -1;
							})
							.description("Checking hash doesn't contain " + sPart)
							.execute();
					}
				}
			};
		}
	};
});
