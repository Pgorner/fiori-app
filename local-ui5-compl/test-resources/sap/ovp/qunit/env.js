/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */

/**
 * Helper to determine qunit test execution ability
 */
sap.ui.define(["sap/ui/thirdparty/jquery"], function(jQuery) {
	"use strict";

	let isV4EnvSupported = false;

	jQuery.ajax({
		type: "HEAD",
		url: "/ovp/catalog/",
		async: false,
		success: function() {
			isV4EnvSupported = true;
		},
        error: function () {
            isV4EnvSupported = false;
        }
	});

	return {
		isV4EnvSupported: isV4EnvSupported
	};

});
