sap.ui.define(
	[
		"sap/base/i18n/Formatting",
		"sap/ui/core/UIComponent",
		"sap/ui/core/util/MockServer",
		"sap/ui/model/odata/v2/ODataModel",
		"sap/ui/model/BindingMode",
		"./Utils"
	],
	function (Formatting, UIComponent, MockServer, ODataModel, BindingMode, Utils) {
		"use strict";

		return UIComponent.extend(
			"sap.ui.comp.sample.smartfield.CurrencyValidation.Component",
			{
				metadata: {
					manifest: "json"
				},
				init: function () {
					var sMockdataUrl = sap.ui.require.toUrl("mockserver");
					// Preserve price in an internal property because when we change only the currency code the price is not sent in the request data to the backend
					this.Price = "";

					// Configure Mock server
					this.oMockServer = new MockServer({
						rootUri: "smartfield.CurrencyValidation.Main/"
					});
					this.oMockServer.simulate(sMockdataUrl + "/metadata.xml", {
						sMockdataBaseUrl: sMockdataUrl,
						aEntitySetsNames: [
							"Currencies", "Products"
						]
					});

					var aRequestList = this.oMockServer.getRequests();


					// Add custom logic when handling the POST and MERGE requests to Products entity to simulate backend validation
					// The only purpose of this part of the sample is to mock backend service and should not be used in productive application
					aRequestList.forEach(function (oRequest) {
						if ( Utils.isPostOrMerge(oRequest.method) &&
							/(Products)\(([^/\?#]+)\)\/?(.*)?/.toString() === oRequest.path.toString()
						) {
							var fnOrginalResponse = oRequest.response;
							oRequest.response = function (oXhr) {
								var fnOrignalXHRRespond = oXhr.respond;
								var oEntity = JSON.parse(oXhr.requestBody);

								// Update this.Price field on each frontend request that contains a price
								if (oEntity.Price) {
									this.Price = oEntity.Price;
								}
								var sPrice = this.Price;
								var sCurrencyCode = oEntity.CurrencyCode;
								oXhr.respond = function (status, headers, content) {
									var aMessages = null;
									var aArguments = arguments || [];
									if (!Utils.backendCurrencyCodeValidation(sCurrencyCode)) {
										aMessages = {
											code: "MESSAGE/CODE",
											message: "Validation failed. Invalid currency code " + sCurrencyCode,
											severity: "error",
											target: "/Products('123')/CurrencyCode"
										};
									} else if (!Utils.backendCurrencyAmountValidation(sPrice, sCurrencyCode)) {
										aMessages = {
											code: "MESSAGE/CODE",
											message: "Validation failed. Invalid amount for the selected currency!",
											severity: "error",
											target: "/Products('123')/Price"
										};
									}
									// Set error message in the headers in order to show the user there was a backend error for a particular field
									// [Optional]: Change the response status code and content in case of backend error
									if (aMessages) {
										//aArguments[0] = 500; // [Optional]: Change the status of a response to 500 - Server error
										aArguments[1]["sap-message"] = JSON.stringify(aMessages);
										aArguments[2] = JSON.stringify({error: {error: "Invalid currency code"}});
									}

									fnOrignalXHRRespond.apply(this, aArguments);
								};
								fnOrginalResponse.apply(this, arguments);
							}.bind(this);
						}
					}.bind(this));

					// Add custom currencies to the example in order to support more types of currency scales
					Formatting.setCustomCurrencies({
						"USDN": {"digits": 5},
						"MY": {"digits": 7}
					});

					this.oMockServer.start();

					// Define the model for the data, using the mockserver
					this.oModel = new ODataModel("smartfield.CurrencyValidation.Main");

					// We emulate draft scenario
					this.oModel.setRefreshAfterChange(false);

					// Default Binding Mode set to TwoWay
					this.oModel.setDefaultBindingMode(BindingMode.TwoWay);
					// Send changes as part of a batch request with MERGE to the backend
					this.oModel.setUseBatch(true);

					this.setModel(this.oModel);

					// Call the init function of the parent
					UIComponent.prototype.init.apply(this, arguments);
				},
				exit: function () {
					if (this.oMockServer) {
						this.oMockServer.stop();
					}
					if (this.oModel) {
						this.oModel.destroy();
					}
					this.oMockServer = null;
					this.oModel = null;
				}
			}
		);
	}
);
