/* global sinon */
(function () {
	"use strict";

	sap.ui.require(["sap/ui/core/Core"], function(Core) {

		Core.ready(function () {

			window.localStorage["sap.ui.fl.id_1632425023244_25_updateVariant"] = JSON.stringify({
				"fileName": "id_1632425023244_25_updateVariant",
				"fileType": "change",
				"changeType": "updateVariant",
				"moduleName": "",
				"reference": "myTest.MyTestApplication.Component",
				"packageName": "",
				"content": {"executeOnSelection": true},
				"selector": {"persistencyKey": "UniqueAndStablePersistenceKey1", "variantId": "*standard*"},
				"layer": "USER",
				"texts": {},
				"namespace": "apps/myTest.MyTestApplication/changes/",
				"projectId": "myTest.MyTestApplication",
				"creation": "2021-09-23T19:23:43.249Z",
				"originalLanguage": "EN",
				"support": {
					"generator": "Change.createInitialFileContent",
					"service": "",
					"user": "",
					"sapui5Version": "1.94.0-SNAPSHOT",
					"sourceChangeFileName": "",
					"compositeCommand": "",
					"command": ""
				},
				"oDataInformation": {},
				"dependentSelector": {},
				"jsOnly": false,
				"variantReference": "",
				"appDescriptorChange": false
			});

			var oServer = sinon.fakeServer.create();
			oServer.autoRespond = true;
			oServer.autoRespondAfter = 500;
			sinon.fakeServer.xhr.useFilters = true;
			sinon.fakeServer.xhr.addFilter(function (method, url) {
				// the namespace on which the fakeServer should be restricted
				return url.indexOf("webapp") === -1;
			});

			oServer.respondWith("GET", /\.\/webapp\/manifest\.json\?sap-language=.*/, [200, {"Content-Type": "application/json"},
				document.getElementById("manifest").innerText
			]);

			oServer.respondWith("GET", "./webapp/view/MyApplication.view.xml", [200, {"Content-Type": "application/xml"},
				document.getElementById("view").innerText
			]);

			oServer.respondWith("GET", /\.\/webapp\/i18n\/i18n/, [200, {"Content-Type": "text/plain"},
				document.getElementById("i18n").innerText
			]);

			// OData services
			oServer.respondWith("GET", /\$metadata/, function (oXhr) {
				oXhr.respond(200, {"Content-Type": "application/xml"}, document.getElementById("metadata").innerText);
			});

			oServer.respondWith("GET", /webapp\/My\/ODataService\/Employees.*/, function (oXhr) {
				oXhr.respond(200, {"Content-Type": "application/json"}, document.getElementById("employees").innerText);
			});
			oServer.respondWith("GET", /webapp\/My\/ODataService\/StringVH.*/, function (oXhr) {
				oXhr.respond(200, {"Content-Type": "application/json"}, document.getElementById("stringVH").innerText);
			});

			sap.ui.require.preload({
				"myTest/MyTestApplication/model/models.js": function () {
					sap.ui.define("myTest/MyTestApplication/model/models.js", [
						"sap/ui/model/json/JSONModel",
						"sap/ui/Device"
					], function (JSONModel, Device) {
						return {

							createDeviceModel: function () {
								var oModel = new JSONModel(Device);
								oModel.setDefaultBindingMode("OneWay");
								return oModel;
							}

						};
					});
				},
				"myTest/MyTestApplication/Component.js": function () {
					sap.ui.define("myTest/MyTestApplication/Component.js", [
						"sap/ui/core/UIComponent",
						"sap/ui/Device",
						"myTest/MyTestApplication/model/models"
					], function (UIComponent, Device, models) {
						return UIComponent.extend("myTest.MyTestApplication.Component", {

							metadata: {
								manifest: "json"
							},

							/**
							 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
							 * @public
							 * @override
							 */
							init: function () {
								// call the base component's init function
								UIComponent.prototype.init.apply(this, arguments);

								// enable routing
								this.getRouter().initialize();

								// set the device model
								this.setModel(models.createDeviceModel(), "device");
							}
						});
					});
				},
				"myTest/MyTestApplication/controller/MyApplication.controller.js": function () {
					sap.ui.define("myTest/MyTestApplication/controller/MyApplication.controller.js", [
						"sap/ui/core/mvc/Controller",
						"sap/ui/core/Fragment",
						"sap/base/util/Deferred"
					], function (
						Controller,
						Fragment,
						Deferred
					) {
						return Controller.extend("myTest.MyTestApplication.controller.MyApplication", {
							onInit: function () {
								/**
								 * Scenario:
								 * SmartFilterBar with mandatory combobox
								 * 1) SFB.suppressValueListAssociation overwrite -> not the same as app but used to simulate the problem
								 * 2) SFB.suspendSelection();
								 * 3) SFB initialised event
								 * 4) SFB.setFilterData with value for combobox field
								 * 5) SFB.search() called from VariantManagement -> cached call
								 * 6) SFB.resumeSelection();
								 * 7) SFB.search call executed after SFB.resumeSelection call
								 * 8) combobox items loaded async - oServer.autoRespondAfter = 500;
								 * 9) SFB.associateValueLists() - to associate the value lists
								 *
								 * In the problematic scenario the combobox is marked in red (error) as
								 * the items are not yet loaded from backend. Logic to wait for them
								 * relies on the fact that aggregations is bound but that is not the case
								 * in this scenario.
								 */
								this.oSmartFilterBar = this.byId("smartFilterBar");
								this.oSmartFilterBar.getSuppressValueListsAssociation = function () {
									return true;
								};
								this.oSmartFilterBar.suspendSelection();

								this.oSFBInitialised = new Deferred();

								this.oSFBInitialised.promise.then(function () {
									this.oSmartFilterBar.setFilterData({
										Combo: "1"
									});
									// Search is triggered by Variant mock
									this.oSmartFilterBar.getVariantManagement().currentVariantSetModified(false);
									this.oSmartFilterBar.resumeSelection();

									setTimeout(function () {
										this.oSmartFilterBar.associateValueLists();
									}.bind(this), 100);

								}.bind(this));
							},
							onInitialised: function () {
								this.oSFBInitialised.resolve();
							},
							onSearch: function () {
								var oFilterData = this.oSmartFilterBar.getFilterData();
								if (oFilterData) {
									this.byId("SFBFilterResult").setText(JSON.stringify(oFilterData, null, " "));
								} else {
									this.byId("SFBFilterResult").setText("{}");
								}
							}
						});
					});
				}
			});
		});
	});
})();
