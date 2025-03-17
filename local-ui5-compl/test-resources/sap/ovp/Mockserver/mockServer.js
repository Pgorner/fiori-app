sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/ui/thirdparty/jquery",
	"sap/ui/thirdparty/sinon",
], function (
	ManagedObject,
	jQuery,
	sinon
) {
	"use strict";

	return ManagedObject.extend("sap.ovp.Mockserver.mockServer", {
		started: null,
		init: function () {
			var mockData, metadata;
			this.started = jQuery
				.get("./test-resources/sap/ovp/Mockserver/Bookshop.json")
				.then(function (data, status, jqXHR) {
					mockData = data;
					return jQuery.get("./test-resources/sap/ovp/Mockserver/metadata.xml");
				})
				.then(function (data, status, jqXHR) {
					metadata = jqXHR.responseText;
					var fServer = sinon.fakeServer.create();
					fServer.autoRespond = true;
					fServer.xhr.useFilters = true;
					fServer.xhr.addFilter(function (method, url) {
						// whenever the this returns true the request will not faked
						return !url.match(/\/sap\/opu\/odata4\//);
					});
					generateResponse(fServer);
				});
			function generateResponse(fServer) {
				fServer.respondWith(
					"GET",
					/\/sap\/opu\/odata4\/IWBEP\/V4_SAMPLE\/default\/IWBEP\/V4_GW_SAMPLE_BASIC\/0001\//,
					function (xhr, id) {
						if (xhr.url.indexOf("metadata") > -1) {
							return xhr.respond(
								200,
								{
									"Content-Type": "application/xml",
									"OData-Version": "4.0",
								},
								metadata
							);
						}
					}
				);
			}
		},
	});
}, true);
