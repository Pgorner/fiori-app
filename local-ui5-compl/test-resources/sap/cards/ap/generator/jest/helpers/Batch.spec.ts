/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import { ApplicationInfo } from "sap/cards/ap/generator/helpers/ApplicationInfo";
import {
	createUrlParameters,
	updateManifestWithExpandQueryParams,
	updateManifestWithSelectQueryParams
} from "sap/cards/ap/generator/helpers/Batch";
import UIComponent from "sap/ui/core/UIComponent";
import { CardManifest } from "sap/ui/integration/widgets/Card";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import { default as ODataModelV4 } from "sap/ui/model/odata/v4/ODataModel";

declare namespace sap {
	export namespace jest {
		function resolvePath(path: string): string;
	}
}

jest.mock(sap.jest.resolvePath("sap/cards/ap/generator/odata/ODataUtils"), () => {
	return {
		getMetaModelObjectForEntitySet: jest.fn().mockReturnValue({
			properties: [
				{
					label: "Opportunity ID",
					name: "op_id_fc",
					$Type: "Edm.Byte"
				},
				{
					label: "Currency Code",
					name: "currency_code",
					$Type: "Edm.String"
				},
				{
					label: "Created At",
					name: "created_at",
					$type: "Edm.DateTimeOffset"
				},
				{
					label: "Business Partner ID",
					name: "bp_id",
					$Type: "Edm.String"
				},
				{
					label: "Active UUID",
					name: "ActiveUUID",
					$Type: "Edm.Guid"
				},
				{
					label: "Draft Entity Creation Date Time",
					name: "DraftEntityCreationDateTime",
					$Type: "Edm.DateTimeOffset"
				},
				{
					label: "Draft Entity Last Change Date Time",
					name: "DraftEntityLastChangeDateTime",
					$Type: "Edm.DateTimeOffset"
				},
				{
					label: "Net Amount",
					name: "net_amount",
					$Type: "Edm.Decimal"
				}
			],
			navigationProperties: [
				{
					name: "to_Currency",
					properties: [
						{
							name: "Currency_Code",
							label: "Currency Code",
							$Type: "Edm.String"
						},
						{
							name: "Decimals",
							label: "Decimals",
							$Type: "Edm.Byte"
						},
						{
							name: "Currency_Code_Text",
							label: "Currency Code Text",
							$Type: "Edm.String"
						}
					]
				},
				{
					name: "to_BillingStatus",
					properties: [
						{
							name: "Status_Text",
							label: "Status Text",
							$Type: "Edm.String"
						}
					]
				},
				{
					name: "to_LifecycleStatus",
					properties: [
						{
							name: "Status",
							label: "Status",
							$Type: "Edm.String"
						}
					]
				}
			],
			complexProperties: [
				{
					name: "__OperationControl",
					properties: [
						{
							label: "Set Billing Block",
							name: "SetBillingBlock",
							$Type: "Edm.Boolean"
						},
						{
							label: "Set Delivery Block",
							name: "SetDeliveryBlock",
							$Type: "Edm.Boolean"
						}
					]
				}
			]
		})
	};
});

describe("Check the select query parameters generated for card manifest", () => {
	let windowSpy: jest.SpyInstance;
	const sId = "testComponent";
	const oManifest = {
		"sap.app": {
			id: sId,
			type: "application"
		}
	};
	const Component = UIComponent.extend("component", {
		metadata: {
			manifest: oManifest
		},
		createContent() {
			return null;
		}
	});

	const rootComponent = new Component(sId);
	jest.spyOn(rootComponent, "getModel").mockImplementation(() => {
		return {
			sServiceUrl: "/sap/opu/odata",
			isA: () => false,
			getMetaModel: function () {
				return {
					getODataEntitySet: function () {
						return {
							entityType: "SD_SALESPLAN.C_SalesPlanTPType"
						};
					},
					getODataEntityType: function () {
						return {
							key: {
								propertyRef: [
									{
										name: "node_key"
									},
									{
										name: "IsActiveEntity"
									}
								]
							}
						};
					}
				};
			},
			getContext: () => {
				return {
					getObject: () => {
						return {
							node_key: "12345",
							IsActiveEntity: true
						};
					}
				};
			}
		};
	});

	beforeEach(() => {
		windowSpy = jest.spyOn(window, "window", "get");
		windowSpy.mockImplementation(() => ({
			hasher: {
				getHash: () => "test-intent&/testEntity(12345)"
			}
		}));
		ApplicationInfo.createInstance(rootComponent);
	});

	afterEach(() => {
		windowSpy.mockRestore();
		ApplicationInfo.getInstance()._resetInstance();
	});

	test("updateManifestWithSelectQueryParams: Validate updated CardManifest after it has been updated with header and context's select and expand queries", () => {
		const cardManifest = {
			_version: "1.15.0",
			"sap.card": {
				extension: "module:sap/cards/ap/common/extensions/BaseIntegrationCardExtension",
				type: "Object",
				configuration: {
					parameters: {
						contextParameters: {
							type: "string",
							value: "node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true"
						},
						_contentSelectQuery: {
							value: ""
						},
						_headerSelectQuery: {
							value: ""
						}
					}
				},
				data: {
					request: {
						url: "{{destinations.service}}/sap/opu/odata/sap/salesorder/$batch",
						method: "POST",
						headers: {
							"X-CSRF-Token": "{{csrfTokens.token1}}"
						},
						batch: {
							header: {
								method: "GET",
								url: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})?{{parameters._headerSelectQuery}}",
								headers: {
									Accept: "application/json",
									"Accept-Language": "{{parameters.LOCALE}}"
								},
								retryAfter: 30
							},
							content: {
								method: "GET",
								url: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})?{{parameters._contentSelectQuery}}",
								headers: {
									Accept: "application/json",
									"Accept-Language": "{{parameters.LOCALE}}"
								}
							}
						}
					}
				},
				header: {
					data: {
						path: "/content/d/"
					},
					type: "Numeric",
					title: "{{CardGeneratorHeaderTitle}}",
					subTitle: "{{CardGeneratorHeaderSubTitle}}",
					unitOfMeasurement: "",
					mainIndicator: {
						number: '{bp_id} {= format.dateTime(${created_at}, {"relative":true,"UTC":true})} {currency_code}',
						unit: "",
						trend: "None",
						state: "{= extension.formatters.formatCriticality(${op_id_fc}, 'color') }"
					},
					sideIndicators: [
						{
							title: "",
							number: "",
							unit: ""
						},
						{
							title: "",
							number: "",
							unit: ""
						}
					]
				},
				footer: {
					actionsStrip: [
						{
							type: "Button",
							visible: false,
							text: "Set Billing Block",
							buttonType: "Reject",
							actions: [
								{
									type: "custom",
									enabled: "${SetBillingBlock}",
									parameters:
										"{{parameters.footerActionParameters.com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetBillingBlock(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)}}"
								}
							]
						},
						{
							type: "Button",
							visible: false,
							text: "Set Delivery Block",
							buttonType: "Reject",
							actions: [
								{
									type: "custom",
									enabled: "${SetDeliveryBlock}",
									parameters:
										"{{parameters.footerActionParameters.com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetDeliveryBlock(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)}}"
								}
							]
						}
					]
				},
				content: {
					data: {
						path: "/content/d/"
					},
					groups: [
						{
							title: "{{CardGeneratorGroupHeader_Groups_0}}",
							items: [
								{
									label: "{{CardGeneratorGroupPropertyLabel_Groups_0_Items_0}}",
									value: "{bp_id}",
									name: "bp_id"
								},
								{
									label: "{{CardGeneratorGroupPropertyLabel_Groups_0_Items_1}}",
									value: "{ActiveUUID}",
									name: "ActiveUUID"
								},
								{
									label: "{{CardGeneratorGroupPropertyLabel_Groups_0_Items_2}}",
									value: "{currency_code}",
									name: "currency_code"
								}
							]
						},
						{
							title: "{{CardGeneratorGroupHeader_Groups_1}}",
							items: [
								{
									label: "{{CardGeneratorGroupPropertyLabel_Groups_1_Items_0}}",
									value: '{= format.dateTime(${DraftEntityCreationDateTime}, {"relative":false,"UTC":true})} {currency_code}',
									name: "DraftEntityCreationDateTime"
								},
								{
									label: "{{CardGeneratorGroupPropertyLabel_Groups_1_Items_1}}",
									value: '{= format.dateTime(${DraftEntityLastChangeDateTime}, {"relative":true,"UTC":true})}',
									name: "DraftEntityLastChangeDateTime"
								},
								{
									label: "{{CardGeneratorGroupPropertyLabel_Groups_1_Items_2}}",
									value: '{= format.float(${net_amount}, {"decimals":2,"style":"short"})} {currency_code}',
									name: "net_amount"
								}
							]
						}
					]
				}
			}
		} as unknown as CardManifest;

		updateManifestWithSelectQueryParams(cardManifest);
		expect(cardManifest).toMatchSnapshot();
	});
});

describe("Check the expand query parameters generated for card manifest", () => {
	let windowSpy: jest.SpyInstance;
	const sId = "testComponent1";
	const oManifest = {
		"sap.app": {
			id: sId,
			type: "application"
		}
	};
	const Component = UIComponent.extend("component", {
		metadata: {
			manifest: oManifest
		},
		createContent() {
			return null;
		}
	});

	const rootComponent = new Component(sId);
	jest.spyOn(rootComponent, "getModel").mockImplementation(() => {
		return {
			sServiceUrl: "/sap/opu/odata",
			isA: () => false,
			getMetaModel: function () {
				return {
					getODataEntitySet: function () {
						return {
							entityType: "SD_SALESPLAN.C_SalesPlanTPType"
						};
					},
					getODataEntityType: function () {
						return {
							key: {
								propertyRef: [
									{
										name: "node_key"
									},
									{
										name: "IsActiveEntity"
									}
								]
							}
						};
					}
				};
			},
			getContext: () => {
				return {
					getObject: () => {
						return {
							node_key: "12345",
							IsActiveEntity: true
						};
					}
				};
			}
		};
	});

	beforeEach(() => {
		windowSpy = jest.spyOn(window, "window", "get");
		windowSpy.mockImplementation(() => ({
			hasher: {
				getHash: () => "test-intent&/testEntity(12345)"
			}
		}));
		ApplicationInfo.createInstance(rootComponent);
	});

	afterEach(() => {
		windowSpy.mockRestore();
		ApplicationInfo.getInstance()._resetInstance();
	});

	test("updateManifestWithExpandQueryParams: Check generated expand query for card header and card content when configuration parameter exists", () => {
		const cardManifest = {
			_version: "1.15.0",
			"sap.card": {
				extension: "module:sap/cards/ap/common/extensions/BaseIntegrationCardExtension",
				type: "Object",
				configuration: {
					parameters: {
						contextParameters: {
							type: "string",
							value: "node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true"
						},
						_contentSelectQuery: {
							value: ""
						},
						_headerSelectQuery: {
							value: ""
						},
						_headerExpandQuery: {
							value: ""
						},
						_contentExpandQuery: {
							value: ""
						}
					}
				},
				data: {
					request: {
						url: "{{destinations.service}}/sap/opu/odata/sap/salesorder/$batch",
						method: "POST",
						headers: {
							"X-CSRF-Token": "{{csrfTokens.token1}}"
						},
						batch: {
							header: {
								method: "GET",
								url: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})?{{parameters._headerSelectQuery}}{{parameters._headerExpandQuery}}",
								headers: {
									Accept: "application/json",
									"Accept-Language": "{{parameters.LOCALE}}"
								},
								retryAfter: 30
							},
							content: {
								method: "GET",
								url: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})?{{parameters._contentSelectQuery}}{{parameters._contentExpandQuery}}",
								headers: {
									Accept: "application/json",
									"Accept-Language": "{{parameters.LOCALE}}"
								}
							}
						}
					}
				},
				header: {
					data: {
						path: "/content/d/"
					},
					type: "Numeric",
					title: "{{CardGeneratorHeaderTitle}}",
					subTitle: "{{CardGeneratorHeaderSubTitle}}",
					unitOfMeasurement: "",
					mainIndicator: {
						number: "{to_Currency/Currency_Code_Text}",
						unit: "",
						trend: "None",
						state: "{= extension.formatters.formatCriticality(${op_id_fc}, 'color') }"
					},
					sideIndicators: [
						{
							title: "",
							number: "",
							unit: ""
						},
						{
							title: "",
							number: "",
							unit: ""
						}
					]
				},
				content: {
					data: {
						path: "/content/d/"
					},
					groups: [
						{
							title: "Group 1",
							items: [
								{
									label: "Confirmation",
									value: "{to_BillingStatus/Status_Text}",
									name: "to_BillingStatus"
								},
								{
									label: "Lower Value",
									value: "{to_LifecycleStatus/Status}",
									name: "to_LifecycleStatus"
								},
								{
									label: "Long Text",
									value: "{to_Currency/Currency_Code_Text}",
									name: "to_Currency"
								},
								{
									label: "Net Amount",
									value: "{net_amount} {currency_code}",
									name: "net_amount"
								}
							]
						}
					]
				}
			}
		} as unknown as CardManifest;

		updateManifestWithExpandQueryParams(cardManifest);
		expect(cardManifest).toMatchSnapshot();
	});

	test("updateManifestWithExpandQueryParams: Check generated expand query for card header and card content when configuration parameter does not exist", () => {
		const cardManifest = {
			_version: "1.15.0",
			"sap.card": {
				extension: "module:sap/cards/ap/common/extensions/BaseIntegrationCardExtension",
				type: "Object",
				configuration: {
					destinations: {}
				},
				data: {
					request: {
						url: "{{destinations.service}}/sap/opu/odata/sap/salesorder/$batch",
						method: "POST",
						headers: {
							"X-CSRF-Token": "{{csrfTokens.token1}}"
						},
						batch: {
							header: {
								method: "GET",
								url: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})?{{parameters._headerSelectQuery}}{{parameters._headerExpandQuery}}",
								headers: {
									Accept: "application/json",
									"Accept-Language": "{{parameters.LOCALE}}"
								},
								retryAfter: 30
							},
							content: {
								method: "GET",
								url: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})?{{parameters._contentSelectQuery}}{{parameters._contentExpandQuery}}",
								headers: {
									Accept: "application/json",
									"Accept-Language": "{{parameters.LOCALE}}"
								}
							}
						}
					}
				},
				header: {
					data: {
						path: "/content/d/"
					},
					type: "Numeric",
					title: "{{CardGeneratorHeaderTitle}}",
					subTitle: "{{CardGeneratorHeaderSubTitle}}",
					unitOfMeasurement: "",
					mainIndicator: {
						number: "{to_Currency/Currency_Code_Text}",
						unit: "",
						trend: "None",
						state: ""
					},
					sideIndicators: [
						{
							title: "",
							number: "",
							unit: ""
						},
						{
							title: "",
							number: "",
							unit: ""
						}
					]
				},
				content: {
					data: {
						path: "/content/d/"
					},
					groups: [
						{
							title: "Group 1",
							items: [
								{
									label: "Confirmation",
									value: "{to_BillingStatus/Status_Text}",
									name: "to_BillingStatus"
								},
								{
									label: "Lower Value",
									value: "{to_LifecycleStatus/Status}",
									name: "to_LifecycleStatus"
								},
								{
									label: "Long Text",
									value: "{to_Currency/Currency_Code_Text}",
									name: "to_Currency"
								},
								{
									label: "Net Amount",
									value: "{net_amount} {currency_code}",
									name: "net_amount"
								}
							]
						}
					]
				}
			}
		} as unknown as CardManifest;

		updateManifestWithExpandQueryParams(cardManifest);
		expect(cardManifest).toMatchSnapshot();
	});
});

describe("Check the expand query parameters generated for card manifest with arrangemants", () => {
	let windowSpy: jest.SpyInstance;
	const sId = "testComponent2";
	const oManifest = {
		"sap.app": {
			id: sId,
			type: "application"
		}
	};
	const Component = UIComponent.extend("component", {
		metadata: {
			manifest: oManifest
		},
		createContent() {
			return null;
		}
	});

	const rootComponent = new Component(sId);
	jest.spyOn(rootComponent, "getModel").mockImplementation(() => {
		return {
			sServiceUrl: "/sap/opu/odata",
			isA: () => false,
			getMetaModel: function () {
				return {
					getODataEntitySet: function () {
						return {
							entityType: "SD_SALESPLAN.C_SalesPlanTPType"
						};
					},
					getODataEntityType: function () {
						return {
							key: {
								propertyRef: [
									{
										name: "node_key"
									},
									{
										name: "IsActiveEntity"
									}
								]
							}
						};
					}
				};
			},
			getContext: () => {
				return {
					getObject: () => {
						return {
							node_key: "12345",
							IsActiveEntity: true
						};
					}
				};
			}
		};
	});

	beforeEach(() => {
		windowSpy = jest.spyOn(window, "window", "get");
		windowSpy.mockImplementation(() => ({
			hasher: {
				getHash: () => "test-intent&/testEntity(12345)"
			}
		}));
		ApplicationInfo.createInstance(rootComponent);
	});

	afterEach(() => {
		windowSpy.mockRestore();
		ApplicationInfo.getInstance()._resetInstance();
	});

	test("updateManifestWithExpandQueryParams: Check generated expand query for card header and card content when configuration parameter and text arrangemensts exists", () => {
		const cardManifest = {
			_version: "1.15.0",
			"sap.card": {
				extension: "module:sap/cards/ap/common/extensions/BaseIntegrationCardExtension",
				type: "Object",
				configuration: {
					parameters: {
						contextParameters: {
							type: "string",
							value: "node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true"
						},
						_contentSelectQuery: {
							value: ""
						},
						_headerSelectQuery: {
							value: ""
						},
						_headerExpandQuery: {
							value: ""
						},
						_contentExpandQuery: {
							value: ""
						}
					}
				},
				data: {
					request: {
						url: "{{destinations.service}}/sap/opu/odata/sap/salesorder/$batch",
						method: "POST",
						headers: {
							"X-CSRF-Token": "{{csrfTokens.token1}}"
						},
						batch: {
							header: {
								method: "GET",
								url: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})?{{parameters._headerSelectQuery}}{{parameters._headerExpandQuery}}",
								headers: {
									Accept: "application/json",
									"Accept-Language": "{{parameters.LOCALE}}"
								},
								retryAfter: 30
							},
							content: {
								method: "GET",
								url: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})?{{parameters._contentSelectQuery}}{{parameters._contentExpandQuery}}",
								headers: {
									Accept: "application/json",
									"Accept-Language": "{{parameters.LOCALE}}"
								}
							}
						}
					}
				},
				header: {
					data: {
						path: "/content/d/"
					},
					type: "Numeric",
					title: "{{CardGeneratorHeaderTitle}}",
					subTitle: "{{CardGeneratorHeaderSubTitle}}",
					unitOfMeasurement: "",
					mainIndicator: {
						number: "{to_Currency/Currency_Code_Text}",
						unit: "",
						trend: "None",
						state: "{= extension.formatters.formatCriticality(${op_id_fc}, 'color') }"
					},
					sideIndicators: [
						{
							title: "",
							number: "",
							unit: ""
						},
						{
							title: "",
							number: "",
							unit: ""
						}
					]
				},
				content: {
					data: {
						path: "/content/d/"
					},
					groups: [
						{
							title: "Group 1",
							items: [
								{
									label: "Confirmation",
									value: "{to_BillingStatus/Status_Text}",
									name: "to_BillingStatus"
								},
								{
									label: "Lower Value",
									value: "{to_LifecycleStatus/Status}",
									name: "to_LifecycleStatus"
								},
								{
									label: "Long Text",
									value: "{to_Currency/Currency_Code_Text}",
									name: "to_Currency"
								},
								{
									label: "Net Amount",
									value: "{net_amount} {currency_code}",
									name: "net_amount"
								}
							]
						}
					]
				}
			}
		} as unknown as CardManifest;

		updateManifestWithExpandQueryParams(cardManifest);
		expect(cardManifest).toMatchSnapshot();
	});

	test("updateManifestWithExpandQueryParams: Check generated expand query for card header and card content when text arrangemensts exists and configuration parameter does not exist", () => {
		const cardManifest = {
			_version: "1.15.0",
			"sap.card": {
				extension: "module:sap/cards/ap/common/extensions/BaseIntegrationCardExtension",
				type: "Object",
				configuration: {
					destinations: {}
				},
				data: {
					request: {
						url: "{{destinations.service}}/sap/opu/odata/sap/salesorder/$batch",
						method: "POST",
						headers: {
							"X-CSRF-Token": "{{csrfTokens.token1}}"
						},
						batch: {
							header: {
								method: "GET",
								url: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})?{{parameters._headerSelectQuery}}{{parameters._headerExpandQuery}}",
								headers: {
									Accept: "application/json",
									"Accept-Language": "{{parameters.LOCALE}}"
								},
								retryAfter: 30
							},
							content: {
								method: "GET",
								url: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})?{{parameters._contentSelectQuery}}{{parameters._contentExpandQuery}}",
								headers: {
									Accept: "application/json",
									"Accept-Language": "{{parameters.LOCALE}}"
								}
							}
						}
					}
				},
				header: {
					data: {
						path: "/content/d/"
					},
					type: "Numeric",
					title: "{{CardGeneratorHeaderTitle}}",
					subTitle: "{{CardGeneratorHeaderSubTitle}}",
					unitOfMeasurement: "",
					mainIndicator: {
						number: "{to_Currency/Currency_Code_Text}",
						unit: "",
						trend: "None",
						state: ""
					},
					sideIndicators: [
						{
							title: "",
							number: "",
							unit: ""
						},
						{
							title: "",
							number: "",
							unit: ""
						}
					]
				},
				content: {
					data: {
						path: "/content/d/"
					},
					groups: [
						{
							title: "Group 1",
							items: [
								{
									label: "Confirmation",
									value: "{to_BillingStatus/Status_Text}",
									name: "to_BillingStatus"
								},
								{
									label: "Lower Value",
									value: "{to_LifecycleStatus/Status}",
									name: "to_LifecycleStatus"
								},
								{
									label: "Long Text",
									value: "{to_Currency/Currency_Code_Text}",
									name: "to_Currency"
								},
								{
									label: "Net Amount",
									value: "{net_amount} {currency_code}",
									name: "net_amount"
								}
							]
						}
					]
				}
			}
		} as unknown as CardManifest;

		updateManifestWithExpandQueryParams(cardManifest);
		expect(cardManifest).toMatchSnapshot();
	});

	test("updateManifestWithExpandQueryParams: Check generated expand query for card header and card content for V2 when configuration parameter and text arrangemensts exists", () => {
		const cardManifest = {
			_version: "1.15.0",
			"sap.card": {
				extension: "module:sap/cards/ap/common/extensions/BaseIntegrationCardExtension",
				type: "Object",
				configuration: {
					parameters: {
						contextParameters: {
							type: "string",
							value: "node_key=guid'fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity=true"
						},
						_contentSelectQuery: {
							value: ""
						},
						_headerSelectQuery: {
							value: ""
						},
						_headerExpandQuery: {
							value: ""
						},
						_contentExpandQuery: {
							value: ""
						}
					}
				},
				data: {
					request: {
						url: "{{destinations.service}}/sap/opu/odata/sap/salesorder/$batch",
						method: "POST",
						headers: {
							"X-CSRF-Token": "{{csrfTokens.token1}}"
						},
						batch: {
							header: {
								method: "GET",
								url: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})?{{parameters._headerSelectQuery}}{{parameters._headerExpandQuery}}",
								headers: {
									Accept: "application/json",
									"Accept-Language": "{{parameters.LOCALE}}"
								},
								retryAfter: 30
							},
							content: {
								method: "GET",
								url: "C_STTA_SalesOrder_WD_20({{parameters.contextParameters}})?{{parameters._contentSelectQuery}}{{parameters._contentExpandQuery}}",
								headers: {
									Accept: "application/json",
									"Accept-Language": "{{parameters.LOCALE}}"
								}
							}
						}
					}
				},
				header: {
					data: {
						path: "/content/d/"
					},
					type: "Numeric",
					title: "{{CardGeneratorHeaderTitle}}",
					subTitle: "{{CardGeneratorHeaderSubTitle}}",
					unitOfMeasurement: "",
					mainIndicator: {
						number: "{to_Currency/Currency_Code_Text}",
						unit: "",
						trend: "None",
						state: "{= extension.formatters.formatCriticality(${op_id_fc}, 'color') }"
					},
					sideIndicators: [
						{
							title: "",
							number: "",
							unit: ""
						},
						{
							title: "",
							number: "",
							unit: ""
						}
					]
				},
				content: {
					data: {
						path: "/content/d/"
					},
					groups: [
						{
							title: "Group 1",
							items: [
								{
									label: "Confirmation",
									value: "{to_BillingStatus/Status_Text}",
									name: "to_BillingStatus"
								},
								{
									label: "Lower Value",
									value: "{to_LifecycleStatus/Status}",
									name: "to_LifecycleStatus"
								},
								{
									label: "Long Text",
									value: "{to_Currency/Currency_Code_Text}",
									name: "to_Currency"
								},
								{
									label: "Net Amount",
									value: "{net_amount} {currency_code}",
									name: "net_amount"
								}
							]
						}
					]
				}
			}
		} as unknown as CardManifest;

		updateManifestWithExpandQueryParams(cardManifest);
		expect(cardManifest).toMatchSnapshot();
	});
});

describe("createUrlParameters - for OData V2 service", () => {
	const sId = "testComponent3";
	const Component = UIComponent.extend("component", {
		metadata: {
			manifest: {
				"sap.app": {
					id: sId,
					type: "application"
				}
			}
		},
		createContent() {
			return null;
		}
	});

	const rootComponent = new Component(sId);
	rootComponent.setModel(new ODataModel("sap/opu/odata"));
	let windowSpy: jest.SpyInstance;

	beforeEach(() => {
		windowSpy = jest.spyOn(window, "window", "get");
		windowSpy.mockImplementation(() => ({
			hasher: {
				getHash: () => "test-intent&/testEntity(12345)"
			}
		}));
		ApplicationInfo.createInstance(rootComponent);
	});

	afterEach(() => {
		windowSpy.mockRestore();
		ApplicationInfo.getInstance()._resetInstance();
	});

	it("should return empty $select and $expand for no parameters", () => {
		const params = {
			properties: [],
			navigationProperties: []
		};

		const result = createUrlParameters(params);
		expect(result).toMatchSnapshot();
	});

	it("should return $select query for properties", () => {
		const params = {
			properties: ["gross_amount", "net_amount", "tax_amount"],
			navigationProperties: []
		};

		const result = createUrlParameters(params);
		expect(result).toMatchSnapshot();
	});

	it("should return $select and $expand query for navigation property", () => {
		const params = {
			properties: [],
			navigationProperties: [
				{
					name: "to_BillingStatus",
					properties: []
				}
			]
		};

		const result = createUrlParameters(params);
		expect(result).toMatchSnapshot();
	});

	it("should return $select and $expand query for navigation property with selected property", () => {
		const params = {
			properties: [],
			navigationProperties: [
				{
					name: "to_BillingStatus",
					properties: ["Status_Text"]
				}
			]
		};

		const result = createUrlParameters(params);
		expect(result).toMatchSnapshot();
	});

	it("should return $select and $expand query for properties with navigation property with selected property", () => {
		const params = {
			properties: ["gross_amount", "net_amount", "tax_amount"],
			navigationProperties: [
				{
					name: "to_BillingStatus",
					properties: ["Status_Text"]
				}
			]
		};

		const result = createUrlParameters(params);
		expect(result).toMatchSnapshot();
	});
});

describe("createUrlParameters - for OData V4 service", () => {
	const sId = "testComponent4";
	const Component = UIComponent.extend("component", {
		metadata: {
			manifest: {
				"sap.app": {
					id: sId,
					type: "application"
				}
			}
		},
		createContent() {
			return null;
		}
	});

	const rootComponent = new Component(sId);
	rootComponent.setModel(new ODataModelV4({ autoExpandSelect: false, serviceUrl: "sap/opu/odatav4/" }));

	let windowSpy: jest.SpyInstance;

	beforeEach(() => {
		windowSpy = jest.spyOn(window, "window", "get");
		windowSpy.mockImplementation(() => ({
			hasher: {
				getHash: () => "test-intent&/testEntity(12345)"
			}
		}));
		ApplicationInfo.createInstance(rootComponent);
	});

	afterEach(() => {
		windowSpy.mockRestore();
		ApplicationInfo.getInstance()._resetInstance();
	});

	it("should return empty $select and $expand for no parameters", () => {
		const params = {
			properties: [],
			navigationProperties: []
		};

		const result = createUrlParameters(params);
		expect(result).toMatchSnapshot();
	});

	it("should return $select query for properties", () => {
		const params = {
			properties: ["gross_amount", "net_amount", "tax_amount"],
			navigationProperties: []
		};

		const result = createUrlParameters(params);
		expect(result).toMatchSnapshot();
	});

	it("should return $select and $expand query for navigation property", () => {
		const params = {
			properties: [],
			navigationProperties: [
				{
					name: "to_BillingStatus",
					properties: []
				}
			]
		};

		const result = createUrlParameters(params);
		expect(result).toMatchSnapshot();
	});

	it("should return $select and $expand query for navigation property with selected property", () => {
		const params = {
			properties: [],
			navigationProperties: [
				{
					name: "to_BillingStatus",
					properties: ["Status_Text"]
				}
			]
		};

		const result = createUrlParameters(params);
		expect(result).toMatchSnapshot();
	});

	it("should return $select and $expand query for properties with navigation property with selected property", () => {
		const params = {
			properties: ["gross_amount", "net_amount", "tax_amount"],
			navigationProperties: [
				{
					name: "to_BillingStatus",
					properties: ["Status_Text"]
				}
			]
		};

		const result = createUrlParameters(params);
		expect(result).toMatchSnapshot();
	});
});
