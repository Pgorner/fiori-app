/* global sinon */
(function () {
	"use strict";

	sap.ui.require(["sap/ui/core/Core", "sap/m/MessageBox"], function(Core, MessageBox) {

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
						"sap/base/util/Deferred",
						"sap/ui/comp/state/UIState",
						"sap/m/MessageBox"
					], function (
						Controller,
						Fragment,
						Deferred,
						UIState,
						MessageBox
					) {
						return Controller.extend("myTest.MyTestApplication.controller.MyApplication", {
							onInit: function () {
								this.oSmartFilterBar = this.byId("smartFilterBar");
								this.oSmartFilterBar.suspendSelection();
								this.oSmartFilterBar.getSuppressValueListsAssociation = function () {
									return true;
								};
								this.oSFBInitialised = new Deferred();

								new Promise(function (fnResolve) {
									// We simulate navigation handler delay
									setTimeout(fnResolve, 100);
								})
									.then(function () {
										return this.oSFBInitialised.promise;
									}.bind(this))
									.then(function () {
										return this.oSmartFilterBar.getInitializedPromise();
									}.bind(this))
									.then(function () {
										performance.mark("SFBInitialized");
										this.oSmartFilterBar.setCurrentVariantId("");
										this.oSmartFilterBar.clear();
										this.oSmartFilterBar.setUiState(new UIState({
											selectionVariant: {
												"SelectOptions": [{
													"PropertyName": "Name",
													"Ranges": [{"Sign": "I", "Option": "EQ", "Low": "2", "High": null}]
												},
													{
														"PropertyName": "Combo",
														"Ranges": [{
															"Sign": "I",
															"Option": "EQ",
															"Low": "1",
															"High": null
														}]
													}]
											}
										}));
										this.oSmartFilterBar.getVariantManagement().currentVariantSetModified(false);
										performance.mark("SFBApplicationModifyStateEnd");
										this.oSmartFilterBar.resumeSelection();
										setTimeout(function () {
											this.oSmartFilterBar.associateValueLists();
										}.bind(this), 1000);
									}.bind(this));
							},
							onInitialised: function () {
								this.oSFBInitialised.resolve();
							},
							onSearch: function () {
								performance.mark("SFBSearchStart");
								var oFilterData = this.oSmartFilterBar.getFilterData().Name;
								if (oFilterData) {
									this.byId("SFBFilterResult").setText(JSON.stringify(oFilterData.ranges[0], null, " "));
								} else {
									this.byId("SFBFilterResult").setText("{}");
								}
								MessageBox.confirm("This message should appear in the confirmation", {
									title: "Confirm",
									id: "myModal",
									emphasizedAction: MessageBox.Action.OK
								});
							}
						});
					});
				}
			});
		});
	});
})();
