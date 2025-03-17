sap.ui.define([
	"sap/base/Log",
	"sap/ui/core/util/MockServer",
	"sap/ui/util/XMLHelper"
], function(
	Log,
	MockServer,
	XMLHelper
) {
	/**
	 * ATTENTION: The Mockserver is currently not able to handle navigation properties without Referential Constraints! If the data being displayed
	 * is always the first entry from the mockdata file, try adding Referential Constraint to the Metadata.xml for the corresponding relationships.
	 */

	"use strict";
	var _sAppModulePath = "sap/ui/demoapps/rta/fe/";
	var oUriParameters = new URLSearchParams(window.location.search);

	// This is to ensure that the path is correctly set in every platform (e.g. also on ABAP systems)
	var getAbsolutePath = (function() {
		var a = null;
		return function(url) {
			a = a || document.createElement('a');
			a.href = url;
			return a.href.replace(/^.*\/\/[^\/]+/, '');
		};
	})();

	function getImagePath(sFileName){
		return sFileName
			? getAbsolutePath(sap.ui.require.toUrl(_sAppModulePath) + 'localService/img/' + sFileName)
			: sFileName;
	}

	return {

		/**
		 * Initializes the mock server.
		 * You can configure the delay with the URL parameter "serverDelay".
		 * The local mock data in this folder is returned instead of the real data for testing.
		 * @public
		 */

		init: function() {
			var sManifestUrl = sap.ui.require.toUrl(_sAppModulePath + "manifest.json");
			var oXhr = new XMLHttpRequest();
			oXhr.open("GET", sManifestUrl, false);
			oXhr.send();
			var oManifest = JSON.parse(oXhr.response);

			this.createMockServer(oManifest, oUriParameters);
		},

		createMockServer: function(oManifest, oUriParameters) {

			var iAutoRespond = (oUriParameters.get("serverDelay") || 1000),
				oMockServer, dataSource, sMockServerPath, sMetadataUrl,
				oDataSources = oManifest["sap.app"]["dataSources"];

			MockServer.config({
				autoRespond: true,
				autoRespondAfter: iAutoRespond
			});

			for (var property in oDataSources) {
				if (Object.hasOwn(oDataSources, property)) {
					dataSource = oDataSources[property];

					//do we have a mock url in the app descriptor
					if (dataSource.settings && dataSource.settings.localUri) {
						if (typeof dataSource.type === "undefined" || dataSource.type === "OData") {
							oMockServer = new MockServer({
								rootUri: dataSource.uri
							});
							sMetadataUrl = sap.ui.require.toUrl(_sAppModulePath + dataSource.settings.localUri);
							sMockServerPath = sMetadataUrl.slice(0, sMetadataUrl.lastIndexOf("/") + 1);
							oMockServer.simulate(sMetadataUrl , {
								sMockdataBaseUrl: sMockServerPath,
								bGenerateMissingMockData: true
							});
							if (property === "mainService"){
								oMockServer.attachAfter(MockServer.HTTPMETHOD.GET, function (oEvent) {
									var oParameters = oEvent.getParameters();

									if (oParameters.oFilteredData && Array.isArray(oParameters.oFilteredData.results)){
										oParameters.oFilteredData.results.forEach(function (oProduct) {
											oProduct.ProductPictureURL = getImagePath(oProduct.ProductPictureURL);
										});
									} else if (oParameters.oEntry && typeof oParameters.oEntry.ProductPictureURL === "string") {
										oParameters.oEntry.ProductPictureURL = getImagePath(oParameters.oEntry.ProductPictureURL);
									}
								}, "SEPMRA_C_PD_Product");
							}
						} else {
							if (oUriParameters.get("sap-client")) {
								dataSource.uri = dataSource.uri.concat("&sap-client=" + oUriParameters.get("sap-client"));
							}
							var rRegEx = dataSource.uri;
							if (dataSource.type !== "MockRegEx") {
								rRegEx = new RegExp(MockServer.prototype._escapeStringForRegExp(dataSource.uri) + "([?#].*)?");
							}
							sMetadataUrl =  sap.ui.require.toUrl(_sAppModulePath + dataSource.settings.localUri);

							oMockServer = new MockServer({
								requests: [{
									method: "GET",
									path: rRegEx,
									response: function(sMetadataUrl, oXhr) {
										var oAnnotationsXhr = new XMLHttpRequest();
										oAnnotationsXhr.open("GET", sMetadataUrl, false);
										oAnnotationsXhr.send();
										var oAnnotations = oAnnotationsXhr.responseXML;
										oXhr.respondXML(200, {}, XMLHelper.serialize(oAnnotations));
										return true;
									}.bind(null, sMetadataUrl)
								}]
							});
						}
						oMockServer.start();
						Log.info("Running the app with mock data for " + property);
					}
				}
			}
		}
	};

});
