/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * Helper to connect to the OData V4 test server and wrap some of its functionality
 *
 * @private
 * @experimental This module is only for internal/experimental use!
 */
sap.ui.define("util/V4ServerHelper", ["sap/ui/thirdparty/jquery"], function(jQuery) { // require jQuery?
	"use strict";

	var serverBaseUrl;
	var expectedServerUrl = "/";
	var expectedServerUrl2 = "https://odatav4server.internal.cfapps.sap.hana.ondemand.com/";

	// Resolves with the server base URL or undefined (if the server is not available)
	var __requestBaseUrl = new Promise(function(resolve) {
		jQuery.ajax({
			method: "GET",
			url: expectedServerUrl + "is_odatav4server",
			beforeSend: function(xhr) {
				xhr.setRequestHeader('X-V4Server-Referrer', document.location.href);
			},
			success: function() {
				serverBaseUrl = expectedServerUrl;
				resolve(serverBaseUrl);
			},
			error: function() {
				resolve(); // unsuccessfully initialized, but initialized -> resolve with no URL
			}
		});
	});

	var __requestAnyBaseUrl = new Promise(function(resolve) {
		jQuery.ajax({
			method: "GET",
			url: expectedServerUrl + "is_odatav4server",
			beforeSend: function(xhr) {
				xhr.setRequestHeader('X-V4Server-Referrer', document.location.href);
			},
			success: function() {
				serverBaseUrl = expectedServerUrl;
				resolve(serverBaseUrl);
			},
			error: function() {
				if (document.location.href.includes("//localhost:") || document.location.href.includes("mayUseCentralServer")) { // this is a local dev scenario, so we can safely use the cloud server instead, for convenience; or when it is explicitly allowed
					jQuery.ajax({
						method: "GET",
						url: expectedServerUrl2 + "is_odatav4server",
						beforeSend: function(xhr) {
							xhr.setRequestHeader('X-V4Server-Referrer', document.location.href);
						},
						success: function() {
							serverBaseUrl = expectedServerUrl2;
							resolve(serverBaseUrl);
						},
						error: function() {
							resolve(); // unsuccessfully initialized, but initialized -> resolve with no URL
						}
					});
				} else {
					resolve(); // unsuccessfully initialized, but initialized -> resolve with no URL
				}
			}
		});
	});


	// Resolves with a boolean indicating whether the V4 server is available AT THE DEFAULT location (same host+port)
	// Exception: when "mayUseCentralServer" is contained in the URL (e.g. as parameter), also access to the central cloud server is checked
	var _serverAvailable = function() {
		return new Promise(function(resolve, reject) {
			var __requestFunction = document.location.href.includes("mayUseCentralServer") ? __requestAnyBaseUrl : __requestBaseUrl;
			__requestFunction.then(function(serverBaseUrl) {
				if (serverBaseUrl) {
					resolve(true);
				} else {
					resolve(false);
				}
			});
		});
	};


	// Resolves with the base URL of a newly created tenant with random tenant ID.
	// bAnyServerIsGood determines whether it is ok to fall back to the CloudFoundry server.
	var _createRandomTenant = function(bAnyServerIsGood) {
		// generate a random tenant ID
		var tenantId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		return _createSpecificTenant(tenantId, bAnyServerIsGood);
	};


	// Resolves with the base URL of a (potentially newly created) tenant with the given tenant ID.
	// bAnyServerIsGood determines whether it is ok to fall back to the CloudFoundry server.
	var _createSpecificTenant = function(tenantId, bAnyServerIsGood) {
		return new Promise(function(resolve, reject) {
			var requestor = bAnyServerIsGood ? __requestAnyBaseUrl : __requestBaseUrl;
			requestor.then(function(serverBaseUrl) {
				if (serverBaseUrl) {
					// create a new tenant with random ID
					var tenantBaseUrl = serverBaseUrl + "tenant(" + tenantId + ")/";
					jQuery.ajax({
						url: tenantBaseUrl + "catalog/",
						success: function() {
							resolve(tenantBaseUrl);
						},
						error: function() {
							reject("Error when trying to create tenant by requesting " + tenantBaseUrl + "catalog/");
						}
					});
				} else {
					reject("V4 Server could not be found");
				}
			});
		});
	};


	// Resets the data in the tenant with the given serverUrl and resolves once the server is ready again
	var _requestDataReset = function(serverUrl) {
		return new Promise(function(resolve, reject) {
			if (!serverUrl) {
				reject("no serverUrl given");
			}

			jQuery.ajax({
				method: "GET",
				url: serverUrl + "resetData",
				beforeSend: function(xhr) {
					xhr.setRequestHeader('X-V4Server-Referrer', document.location.href);
				},
				success: resolve,
				error: reject
			});
		});
	};



	return { // the API
		checkWhetherServerExists: _serverAvailable,
		requestFreshServerURL: _createRandomTenant,
		requestServerURLForTenant: _createSpecificTenant,
		requestReset: _requestDataReset // input parameter: serverUrl (as given by requestFreshServerURL(), or as written statically in manifest.json, like "/tenant(xyz)/")
	};

}, /* bExport= */false);
