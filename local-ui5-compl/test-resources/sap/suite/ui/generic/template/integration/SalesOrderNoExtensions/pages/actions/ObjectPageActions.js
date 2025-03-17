/*** Object Page Report actions ***/
sap.ui.define(["sap/ui/test/Opa5"],
	function (Opa5) {
	'use strict';

		return function (prefix, viewName, viewNamespace) {

			return {

				iApplyFiltersOnOPTable: function (tableNavProp) {
					tableNavProp = tableNavProp || 'to_Item';
					var dummyFilter = {
						"filter": {
							"filterItems": [{
								"columnKey": "to_Categories/CategoryId",
								"operation": "Contains",
								"exclude": false,
								"value1": "1223",
								"value2": null
							}]
						}
					};
					if (tableNavProp === 'to_BPAContact') {
						dummyFilter = {
							"filter": {
								"filterItems": [{
									"columnKey": "BusinessPartnerID",
									"operation": "EQ",
									"exclude": false,
									"value1": "Q",
									"value2": null
								}]
							}
						};

					}
					return this.waitFor({
						id: prefix + tableNavProp + "::com.sap.vocabularies.UI.v1.LineItem::Table",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (oSmartTable) {
							oSmartTable.applyVariant(dummyFilter);
							Opa5.assert.ok(true, 'Variant with some random filters is applied on smartTable in op');
						},
						errorMessage: "Table in object page is not loaded correctly"
					});
				}

			};
		};
	});
