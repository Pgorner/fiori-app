(function () {
	"use strict";

	sap.ui.require(["sap/ui/core/Core"], function(Core) {

		Core.ready(function () {

			sap.ui.require([
				"sap/ui/core/CustomData",
				"sap/ui/core/mvc/XMLView",
				"sap/ui/core/mvc/Controller",
				"sap/ui/model/odata/v2/ODataModel",
				"sap/ui/core/util/MockServer"
			], function (
				CustomData,
				XMLView,
				Controller,
				ODataModel,
				MockServer
			) {
				var MyController = Controller.extend("mainView.controller", {
					onInit: function () {
						var oModel, oView;
						var sServiceName = "testService";

						this.setupMockServer(sServiceName);

						oModel = new ODataModel(sServiceName + "/", {
							useBatch: false,
							defaultBindingMode: "TwoWay"
						});

						oView = this.getView();
						oView.setModel(oModel);

						oModel.getMetaModel().loaded().then(function () {
							this.byId("smartForm").bindElement("/Employees('0001')");
						}.bind(this));

						this._oModel = oModel;
						// -----------------------------------------------------
						// Default
						var oCustomDataTimestampOnly = new CustomData({
							key: "dateFormatSettings"
						});
						oCustomDataTimestampOnly.setValue('\{\}');
						this.byId("TimestampOnly").addCustomData(oCustomDataTimestampOnly);

						// -----------------------------------------------------
						// Short
						var oCustomDataShortTimestampOnly = new CustomData({
							key: "dateFormatSettings"
						});
						oCustomDataShortTimestampOnly.setValue('\{"UTC": true, "style": "short"\}');
						this.byId("shortTimestampOnly").addCustomData(oCustomDataShortTimestampOnly);

						// -----------------------------------------------------
						// Medium
						var oCustomDataMediumTimestampOnly = new CustomData({
							key: "dateFormatSettings"
						});
						oCustomDataMediumTimestampOnly.setValue('\{"UTC": true, "style": "medium"\}');
						this.byId("mediumTimestampOnly").addCustomData(oCustomDataMediumTimestampOnly);

						// -----------------------------------------------------
						// Long
						var oCustomDataLongTimestampOnly = new CustomData({
							key: "dateFormatSettings"
						});
						oCustomDataLongTimestampOnly.setValue('\{"UTC": true, "style": "long"\}');
						this.byId("longTimestampOnly").addCustomData(oCustomDataLongTimestampOnly);

						// -----------------------------------------------------
						// Full
						var oCustomDataFullTimestampOnly = new CustomData({
							key: "dateFormatSettings"
						});
						oCustomDataFullTimestampOnly.setValue('\{"UTC": true, "style": "full"\}');
						this.byId("fullTimestampOnly").addCustomData(oCustomDataFullTimestampOnly);
						// -----------------------------------------------------
						// Default
						var oCustomDataTimezone = new CustomData({
							key: "dateFormatSettings"
						});

						oCustomDataTimezone.setValue('\{\}');
						this.byId("timezone").addCustomData(oCustomDataTimezone);

						// -----------------------------------------------------
						// Short
						var oCustomDataShortTimezone = new CustomData({
							key: "dateFormatSettings"
						});

						oCustomDataShortTimezone.setValue('\{"UTC": true, "style": "short"\}');
						this.byId("shortTimezone").addCustomData(oCustomDataShortTimezone);

						// -----------------------------------------------------
						// Medium
						var oCustomDataMediumTimezone = new CustomData({
							key: "dateFormatSettings"
						});
						oCustomDataMediumTimezone.setValue('\{"UTC": true, "style": "medium"\}');
						this.byId("mediumTimezone").addCustomData(oCustomDataMediumTimezone);

						// -----------------------------------------------------
						// Long
						var oCustomDataLongTimezone = new CustomData({
							key: "dateFormatSettings"
						});
						oCustomDataLongTimezone.setValue('\{"UTC": true, "style": "long"\}');
						this.byId("longTimezone").addCustomData(oCustomDataLongTimezone);

						// -----------------------------------------------------
						// Full
						var oCustomDataFullTimezone = new CustomData({
							key: "dateFormatSettings"
						});
						oCustomDataFullTimezone.setValue('\{"UTC": true, "style": "full"\}');
						this.byId("fullTimezone").addCustomData(oCustomDataFullTimezone);

						// -----------------------------------------------------
						// Default
						var oCustomDataTimezoneHide = new CustomData({
							key: "dateFormatSettings"
						});
						oCustomDataTimezoneHide.setValue('\{"showDate": true, "showTime": true, "showTimezone": false\}');
						this.byId("timezoneHide").addCustomData(oCustomDataTimezoneHide);

						// -----------------------------------------------------
						// Short
						var oCustomDataShortTimezoneHide = new CustomData({
							key: "dateFormatSettings"
						});
						oCustomDataShortTimezoneHide.setValue('\{"UTC": true, "style": "short", "showDate": true, "showTime": true, "showTimezone": false\}');
						this.byId("shortTimezoneHide").addCustomData(oCustomDataShortTimezoneHide);

						// -----------------------------------------------------
						// Medium
						var oCustomDataMediumTimezoneHide = new CustomData({
							key: "dateFormatSettings"
						});
						oCustomDataMediumTimezoneHide.setValue('\{"UTC": true, "style": "medium", "showDate": true, "showTime": true, "showTimezone": false\}');
						this.byId("mediumTimezoneHide").addCustomData(oCustomDataMediumTimezoneHide);

						// -----------------------------------------------------
						// Long
						var oCustomDataLongTimezoneHide = new CustomData({
							key: "dateFormatSettings"
						});
						oCustomDataLongTimezoneHide.setValue('\{"UTC": true, "style": "long", "showDate": true, "showTime": true, "showTimezone": false\}');
						this.byId("longTimezoneHide").addCustomData(oCustomDataLongTimezoneHide);

						// -----------------------------------------------------
						// Full
						var oCustomDataFullTimezoneHide = new CustomData({
							key: "dateFormatSettings"
						});
						oCustomDataFullTimezoneHide.setValue('\{"UTC": true, "style": "full", "showDate": true, "showTime": true, "showTimezone": false\}');
						this.byId("fullTimezoneHide").addCustomData(oCustomDataFullTimezoneHide);

						// -----------------------------------------------------
						// Default
						var oCustomDataТimezoneOnly = new CustomData({
							key: "dateFormatSettings"
						});
						oCustomDataТimezoneOnly.setValue('\{"showDate": false, "showTime": false, "showTimezone": true\}');
						this.byId("timezoneOnly").addCustomData(oCustomDataТimezoneOnly);

						// -----------------------------------------------------
						// Short
						var oCustomDataShortТimezoneOnly = new CustomData({
							key: "dateFormatSettings"
						});
						oCustomDataShortТimezoneOnly.setValue('\{"UTC": true, "style": "short", "showDate": false, "showTime": false, "showTimezone": true\}');
						this.byId("shortTimezoneOnly").addCustomData(oCustomDataShortТimezoneOnly);

						// -----------------------------------------------------
						// Medium
						var oCustomDataMediumТimezoneOnly = new CustomData({
							key: "dateFormatSettings"
						});
						oCustomDataMediumТimezoneOnly.setValue('\{"UTC": true, "style": "medium", "showDate": false, "showTime": false, "showTimezone": true\}');
						this.byId("mediumTimezoneOnly").addCustomData(oCustomDataMediumТimezoneOnly);

						// -----------------------------------------------------
						// Long
						var oCustomDataLongТimezoneOnly = new CustomData({
							key: "dateFormatSettings"
						});
						oCustomDataLongТimezoneOnly.setValue('\{"UTC": true, "style": "long", "showDate": false, "showTime": false, "showTimezone": true\}');
						this.byId("longTimezoneOnly").addCustomData(oCustomDataLongТimezoneOnly);

						// -----------------------------------------------------
						// Full
						var oCustomDataFullТimezoneOnly = new CustomData({
							key: "dateFormatSettings"
						});
						oCustomDataFullТimezoneOnly.setValue('\{"UTC": true, "style": "full", "showDate": false, "showTime": false, "showTimezone": true\}');
						this.byId("fullTimezoneOnly").addCustomData(oCustomDataFullТimezoneOnly);

						// -----------------------------------------------------
						// Short
						var oCustomDataТimezoneShowTime = new CustomData({
							key: "dateFormatSettings"
						});
						oCustomDataТimezoneShowTime.setValue('\{"showDate": false, "showTime": true, "showTimezone": false\}');
						this.byId("timezoneShowTime").addCustomData(oCustomDataТimezoneShowTime);

						// -----------------------------------------------------
						// Short
						var oCustomDataShortТimezoneShowTime = new CustomData({
							key: "dateFormatSettings"
						});
						oCustomDataShortТimezoneShowTime.setValue('\{"UTC": true, "style": "short", "showDate": false, "showTime": true, "showTimezone": false\}');
						this.byId("shortTimezoneShowTime").addCustomData(oCustomDataShortТimezoneShowTime);

						// -----------------------------------------------------
						// Medium
						var oCustomDataMediumТimezoneShowTime = new CustomData({
							key: "dateFormatSettings"
						});
						oCustomDataMediumТimezoneShowTime.setValue('\{"UTC": true, "style": "medium", "showDate": false, "showTime": true, "showTimezone": false\}');
						this.byId("mediumTimezoneShowTime").addCustomData(oCustomDataMediumТimezoneShowTime);

						// -----------------------------------------------------
						// Long
						var oCustomDataLongТimezoneShowTime = new CustomData({
							key: "dateFormatSettings"
						});
						oCustomDataLongТimezoneShowTime.setValue('\{"UTC": true, "style": "long", "showDate": false, "showTime": true, "showTimezone": false\}');
						this.byId("longTimezoneShowTime").addCustomData(oCustomDataLongТimezoneShowTime);

						// -----------------------------------------------------
						// Full
						var oCustomDataFullТimezoneShowTime = new CustomData({
							key: "dateFormatSettings"
						});
						oCustomDataFullТimezoneShowTime.setValue('\{"UTC": true, "style": "full", "showDate": false, "showTime": true, "showTimezone": false\}');
						this.byId("fullTimezoneShowTime").addCustomData(oCustomDataFullТimezoneShowTime);
					},
					submitPending: function () {
						this._oModel.submitChanges();
					},
					onExit: function () {
						this._oMockServer.stop();
					},
					setupMockServer: function (service) {
						var basePath = service;

						var mockServer = new MockServer({
							rootUri: basePath
						});

						var reqList = mockServer.getRequests();

						// $metadata
						reqList.push({
							method: 'GET',
							path: '/\\$metadata(.*)',
							response: function (req, resp) {
								var aParameterMatch = decodeURIComponent(window.location.search).match(/TextArrangement=(\S+?)[&$#]/),
									data = document.getElementById("metadata").textContent;

								// Replace the text arrangement with one coming as a GET parameter
								if (aParameterMatch && aParameterMatch[1]) {
									data = data.replace(
										'<Annotation Term="com.sap.vocabularies.UI.v1.TextArrangement" EnumMember="com.sap.vocabularies.UI.v1.TextArrangementType/TextLast" />',
										'<Annotation Term="com.sap.vocabularies.UI.v1.TextArrangement" EnumMember="com.sap.vocabularies.UI.v1.TextArrangementType/' + aParameterMatch[1] + '" />'
									);
								}

								req.respondXML(200, {}, data);
							}
						});

						// Data
						reqList.push({
							method: 'GET',
							path: '/\\Employees(.*)',
							response: function (req, resp) {
								var data = document.getElementById("dataSection").textContent;
								req.respondJSON(200, {}, data);
							}
						});

						mockServer.setRequests(reqList);
						mockServer.simulate(basePath + '/$metadata',
							{
								sMockdataBaseUrl: basePath + '/Employees',
								bGenerateMissingMockData: true
							});
						mockServer.start();
					}
				});

				XMLView.create({
					id: "idView",
					definition: document.getElementById("mainView").textContent,
					controller: new MyController()
				}).then(function (oView) {
					oView.placeAt("content");
				});

			});

		});
	});
})();
