/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import { ApplicationInfo } from "sap/cards/ap/generator/helpers/ApplicationInfo";
import {
	addActionToCardManifest,
	getActionParameterConfigurationV2,
	getActionParameterValue,
	getActionStyles,
	getCardActions,
	getDefaultAction,
	removeActionFromManifest,
	resetCardActions,
	updateCardManifestAction,
	updateModelData
} from "sap/cards/ap/generator/helpers/FooterActions";
import type UIComponent from "sap/ui/core/Component";
import type { CardManifest } from "sap/ui/integration/widgets/Card";
import JSONModel from "sap/ui/model/json/JSONModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

describe("Card Actions", () => {
	test("getCardActions: returns the correct action formatted value for Cards with model OData V2", () => {
		const component = {
			getModel: function () {
				return {
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
												name: "SalesPlanUUID"
											},
											{
												name: "IsActiveEntity"
											}
										]
									},
									"com.sap.vocabularies.UI.v1.Identification": [
										{
											Label: {
												String: "Copy to New Version"
											},
											Action: {
												String: "SD_SALESPLAN.SD_SALESPLAN_Entities/C_SalesPlanTPCopy"
											},
											InvocationGrouping: {
												EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
											},
											RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
											Criticality: {
												EnumMember: {
													Path: "CriticalityPath"
												}
											}
										},
										{
											Label: {
												String: "Release"
											},
											Action: {
												String: "SD_SALESPLAN.SD_SALESPLAN_Entities/C_SalesPlanTPRelease"
											},
											InvocationGrouping: {
												EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
											},
											RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction"
										},
										{
											Label: {
												String: "Reopen"
											},
											Action: {
												String: "SD_SALESPLAN.SD_SALESPLAN_Entities/C_SalesPlanTPReopen"
											},
											InvocationGrouping: {
												EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
											},
											RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction"
										},
										{
											Label: {
												String: "Reopen with Hidden Path"
											},
											Action: {
												String: "SD_SALESPLAN.SD_SALESPLAN_Entities/C_SalesPlanTPReopen"
											},
											InvocationGrouping: {
												EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
											},
											RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
											"com.sap.vocabularies.UI.v1.Hidden": {}
										},
										{
											Label: {
												String: "Reopen with Hidden Path Bool true"
											},
											Action: {
												String: "SD_SALESPLAN.SD_SALESPLAN_Entities/C_SalesPlanTPReopen"
											},
											InvocationGrouping: {
												EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
											},
											RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
											"com.sap.vocabularies.UI.v1.Hidden": {
												Bool: "true"
											}
										},
										{
											Label: {
												String: "Reopen with Determining annotation value Bool true"
											},
											Action: {
												String: "SD_SALESPLAN.SD_SALESPLAN_Entities/C_SalesPlanTPReopen"
											},
											InvocationGrouping: {
												EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
											},
											RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
											Determining: {
												Bool: "true"
											}
										},
										{
											Label: {
												String: "Reopen with IsCopyAction annotation value Bool true"
											},
											Action: {
												String: "SD_SALESPLAN.SD_SALESPLAN_Entities/C_SalesPlanTPReopen"
											},
											InvocationGrouping: {
												EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
											},
											RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
											"com.sap.vocabularies.UI.v1.IsCopyAction": {
												Bool: "true"
											},
											Criticality: {
												Path: "CriticalityPath"
											}
										}
									]
								};
							},
							getODataFunctionImport: jest.fn().mockReturnValue({
								name: "C_SalesPlanTPCopy",
								returnType: "SD_SALESPLAN.C_SalesPlanTPType",
								entitySet: "C_SalesPlanTP",
								httpMethod: "POST",
								parameter: [
									{
										name: "SalesPlanUUID",
										type: "Edm.Guid",
										mode: "In",
										extensions: [
											{
												name: "label",
												value: "Sales Plan UUID",
												namespace: "http://www.sap.com/Protocols/SAPData"
											}
										],
										"sap:label": "Sales Plan UUID",
										"com.sap.vocabularies.Common.v1.Label": {
											String: "Sales Plan UUID"
										}
									},
									{
										name: "IsActiveEntity",
										type: "Edm.Boolean",
										mode: "In",
										extensions: [
											{
												name: "label",
												value: "Is active",
												namespace: "http://www.sap.com/Protocols/SAPData"
											}
										],
										"sap:label": "Is active",
										"com.sap.vocabularies.Common.v1.Label": {
											String: "Is active"
										}
									}
								],
								extensions: [
									{
										name: "action-for",
										value: "SD_SALESPLAN.C_SalesPlanTPType",
										namespace: "http://www.sap.com/Protocols/SAPData"
									},
									{
										name: "applicable-path",
										value: "Copy_ac",
										namespace: "http://www.sap.com/Protocols/SAPData"
									}
								],
								"sap:action-for": "SD_SALESPLAN.C_SalesPlanTPType",
								"sap:applicable-path": "Copy_ac"
							})
						};
					}
				};
			}
		} as unknown as UIComponent;

		const entitySetName = "C_SalesPlanTP";
		const cardActions = getCardActions(component, entitySetName, false);
		expect(cardActions).toMatchSnapshot();
	});

	test("getCardActions: returns the correct action formatted value for Cards with model OData V4, app - Manage Credit Memo Requests", () => {
		const oMetaModel = {
			"/CreditMemoRequestManage": {
				$kind: "EntitySet",
				$Type: "com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestManageType"
			},
			"/com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestManageType": {
				$kind: "EntityType",
				$Key: ["CreditMemoRequest"]
			},
			"/com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestManageType@": {
				"@com.sap.vocabularies.UI.v1.Identification": [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataField",
						Value: {
							$Path: "CreditMemoRequestType"
						}
					},
					{
						"@com.sap.vocabularies.UI.v1.Importance": {
							$EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
						},
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Label: "Incompleteness Info",
						Action: "com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.ActivateIncompletenessInfo(com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestManageType)",
						InvocationGrouping: {
							$EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
						}
					},
					{
						"@com.sap.vocabularies.UI.v1.Importance": {
							$EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
						},
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Label: "Set Billing Block",
						Action: "com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.SetBillingBlock(com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestManageType)",
						InvocationGrouping: {
							$EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
						}
					},
					{
						"@com.sap.vocabularies.UI.v1.Importance": {
							$EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
						},
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Label: "Remove Billing Block",
						Action: "com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.RemoveBillingBlock(com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestManageType)",
						InvocationGrouping: {
							$EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
						}
					},
					{
						"@com.sap.vocabularies.UI.v1.Hidden": {
							$Path: "UICT_WithdrawFromApproval"
						},
						"@com.sap.vocabularies.UI.v1.Importance": {
							$EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
						},
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Label: "Withdraw Approval Request",
						Action: "com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.WithdrawFromApproval(com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestManageType)",
						InvocationGrouping: {
							$EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
						}
					}
				]
			},
			"/com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.ActivateIncompletenessInfo": [
				{
					$kind: "Action",
					$IsBound: true,
					$Parameter: [
						{
							$Type: "com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestManageType",
							$Name: "_it",
							$Nullable: false
						}
					]
				}
			],
			"/com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.SetBillingBlock": [
				{
					$kind: "Action",
					$IsBound: true,
					$Parameter: [
						{
							$Type: "com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestManageType",
							$Name: "_it",
							$Nullable: false
						},
						{
							$Type: "Edm.String",
							$Name: "HeaderBillingBlockReason",
							$Nullable: false,
							$MaxLength: 2
						}
					]
				},
				{
					$kind: "Action",
					$IsBound: true,
					$Parameter: [
						{
							$Type: "com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestItemManageType",
							$Name: "_it",
							$Nullable: false
						},
						{
							$Type: "Edm.String",
							$Name: "ItemBillingBlockReason",
							$Nullable: false,
							$MaxLength: 2
						}
					]
				}
			],
			"/com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.RemoveBillingBlock": [
				{
					$kind: "Action",
					$IsBound: true,
					$Parameter: [
						{
							$Type: "com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestManageType",
							$Name: "_it",
							$Nullable: false
						}
					]
				},
				{
					$kind: "Action",
					$IsBound: true,
					$Parameter: [
						{
							$Type: "com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestItemManageType",
							$Name: "_it",
							$Nullable: false
						}
					]
				}
			],
			"/com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.WithdrawFromApproval": [
				{
					$kind: "Action",
					$IsBound: true,
					$Parameter: [
						{
							$Type: "com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestManageType",
							$Name: "_it",
							$Nullable: false
						}
					]
				}
			],
			"/com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.ActivateIncompletenessInfo@": {},
			"/com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.SetBillingBlock@": {},
			"/com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.RemoveBillingBlock@": {},
			"/com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.WithdrawFromApproval@": {}
		};

		const component = {
			getModel: jest.fn().mockReturnValue({
				getMetaModel: jest.fn().mockReturnValue({
					getObject: jest.fn().mockImplementation((sPath) => {
						return oMetaModel[sPath];
					})
				})
			}),
			getRootControl: jest.fn().mockReturnValue({})
		} as unknown as UIComponent;

		const entitySetName = "CreditMemoRequestManage";
		const cardActions = getCardActions(component, entitySetName, true);

		expect(cardActions).toMatchSnapshot();
	});

	test("getCardActions: returns the correct action formatted value for Cards with model OData V4, app - Manage Sales Order Path Based Scenario to get the metadata info for oData V4", () => {
		const oMetaModel = {
			"/SalesOrderManage": {
				$kind: "EntitySet",
				$Type: "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType"
			},
			"/com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType": {
				$kind: "EntityType",
				$Key: ["SalesOrder"]
			},
			"/com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType@": {
				"@com.sap.vocabularies.UI.v1.Identification": [
					{
						"@com.sap.vocabularies.UI.v1.Importance": {
							$EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
						},
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Label: "Set Billing Block",
						Action: "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetBillingBlock(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)",
						InvocationGrouping: {
							$EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
						}
					}
				]
			},
			"/SalesOrderManage/com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetBillingBlock@": {
				"@Org.OData.Core.V1.OperationAvailable": {
					$Path: "_it/__OperationControl/SetBillingBlock"
				},
				"@com.sap.vocabularies.UI.v1.Critical": {
					$Path: "CriticalityPath"
				}
			}
		};

		const component = {
			getModel: jest.fn().mockReturnValue({
				getMetaModel: jest.fn().mockReturnValue({
					getObject: jest.fn().mockImplementation((sPath) => {
						return oMetaModel[sPath];
					})
				})
			}),
			getRootControl: jest.fn().mockReturnValue({})
		} as unknown as UIComponent;

		const entitySetName = "SalesOrderManage";
		const cardActions = getCardActions(component, entitySetName, true);

		expect(cardActions).toMatchSnapshot();
	});

	test("getCardActions: returns the correct action formatted value for Cards with model OData V4, app - Manage Sales Order Boolean value Scenario to get the metadata info for oData V4", () => {
		const oMetaModel = {
			"/SalesOrderManage": {
				$kind: "EntitySet",
				$Type: "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType"
			},
			"/com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType": {
				$kind: "EntityType",
				$Key: ["SalesOrder"]
			},
			"/com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType@": {
				"@com.sap.vocabularies.UI.v1.Identification": [
					{
						"@com.sap.vocabularies.UI.v1.Importance": {
							$EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
						},
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Label: "Set Billing Block",
						Action: "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetBillingBlock(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)",
						InvocationGrouping: {
							$EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
						}
					}
				]
			},
			"/SalesOrderManage/com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetBillingBlock@": {
				"@Org.OData.Core.V1.OperationAvailable": {
					Bool: "false"
				},
				"@com.sap.vocabularies.UI.v1.Critical": {
					Bool: "true"
				}
			}
		};

		const component = {
			getModel: jest.fn().mockReturnValue({
				getMetaModel: jest.fn().mockReturnValue({
					getObject: jest.fn().mockImplementation((sPath) => {
						return oMetaModel[sPath];
					})
				})
			}),
			getRootControl: jest.fn().mockReturnValue({})
		} as unknown as UIComponent;

		const entitySetName = "SalesOrderManage";
		const cardActions = getCardActions(component, entitySetName, true);

		expect(cardActions).toMatchSnapshot();
	});

	test("getActionStyles : get the Action styles for the card action", () => {
		const actionStyles = getActionStyles();
		expect(actionStyles).toMatchSnapshot();
	});

	test("addActionToCardManifest : Add the actions to card manifest for OData V2 Card", async () => {
		let cardManifest = {
			"sap.card": {}
		} as unknown as CardManifest;

		const controlProperties = {
			title: "Release",
			titleKey: "C_SalesPlanTPRelease",
			isAddActionEnabled: true,
			style: "Default",
			enablePathKey: "Copy_ac",
			isEnablePropertyControlVisible: true
		};

		const context = {
			dialog: {
				getModel: jest.fn().mockReturnValue({
					getProperty: jest.fn((param: any) => {
						if (param === "/configuration/actions/bODataV4") {
							return false;
						}
						if (param === "/configuration/$data") {
							return {
								SalesPlanUUID: "00000000-0000-0000-0000-000000000000",
								IsActiveEntity: true
							};
						}
					})
				})
			},
			appModel: {
				getMetaModel: jest.fn().mockReturnValue({
					getODataEntitySet: jest.fn().mockReturnValue({
						entityType: "SD_SALESPLAN.C_SalesPlanTPType"
					}),
					getODataEntityType: jest.fn().mockReturnValue({
						key: {
							propertyRef: [
								{
									name: "SalesPlanUUID"
								},
								{
									name: "IsActiveEntity"
								}
							]
						},
						"com.sap.vocabularies.UI.v1.Identification": [
							{
								Label: {
									String: "Release"
								},
								Action: {
									String: "SD_SALESPLAN.SD_SALESPLAN_Entities/C_SalesPlanTPRelease"
								},
								InvocationGrouping: {
									EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
								},
								RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction"
							},
							{
								Label: {
									String: "Reopen"
								},
								Action: {
									String: "SD_SALESPLAN.SD_SALESPLAN_Entities/C_SalesPlanTPReopen"
								},
								InvocationGrouping: {
									EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
								},
								RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction"
							}
						]
					}),
					getODataFunctionImport: jest.fn().mockReturnValue({
						name: "C_SalesPlanTPCopy",
						returnType: "SD_SALESPLAN.C_SalesPlanTPType",
						entitySet: "C_SalesPlanTP",
						httpMethod: "POST",
						parameter: [
							{
								name: "SalesPlanUUID",
								type: "Edm.Guid",
								mode: "In",
								extensions: [
									{
										name: "label",
										value: "Sales Plan UUID",
										namespace: "http://www.sap.com/Protocols/SAPData"
									}
								],
								"sap:label": "Sales Plan UUID",
								"com.sap.vocabularies.Common.v1.Label": {
									String: "Sales Plan UUID"
								}
							},
							{
								name: "IsActiveEntity",
								type: "Edm.Boolean",
								mode: "In",
								extensions: [
									{
										name: "label",
										value: "Is active",
										namespace: "http://www.sap.com/Protocols/SAPData"
									}
								],
								"sap:label": "Is active",
								"com.sap.vocabularies.Common.v1.Label": {
									String: "Is active"
								}
							}
						],
						extensions: [
							{
								name: "action-for",
								value: "SD_SALESPLAN.C_SalesPlanTPType",
								namespace: "http://www.sap.com/Protocols/SAPData"
							},
							{
								name: "applicable-path",
								value: "Copy_ac",
								namespace: "http://www.sap.com/Protocols/SAPData"
							}
						],
						"sap:action-for": "SD_SALESPLAN.C_SalesPlanTPType",
						"sap:applicable-path": "Copy_ac"
					})
				})
			}
		};

		await addActionToCardManifest(cardManifest, controlProperties, context);
		expect(cardManifest).toMatchSnapshot();
	});

	test("addActionToCardManifest : Add the actions to card manifest for OData V4 Card with bound action with action parameters", async () => {
		const component = {
			getModel: function () {
				return {
					isA: function () {
						return true;
					},
					getServiceUrl: jest
						.fn()
						.mockReturnValue(
							"/sap/opu/odata4/sap/c_salesordermanage_srv/srvd_f4/sap/i_billingblockreason/0001;ps=%27srvd-c_salesordermanage_sd-0001%27;va=%27com.sap.gateway.srvd.c_salesordermanage_sd.v0001.ae-c_salesordermanage.setbillingblock.headerbillingblockreason.SalesOrderManageType%27"
						)
				};
			},
			getManifest: function () {
				return {
					"sap.app": {
						id: "testId"
					}
				};
			}
		} as unknown as UIComponent;

		let windowSpy1: jest.SpyInstance;
		windowSpy1 = jest.spyOn(window, "window", "get");
		windowSpy1.mockImplementation(() => ({
			hasher: {
				getHash: () => "test-intent&/I_BillingBlockReason(12345)"
			}
		}));

		ApplicationInfo.createInstance(component);

		let cardManifest = {
			"sap.card": {
				configuration: {}
			}
		} as unknown as CardManifest;

		const controlProperties = {
			title: "Set Billing Block",
			titleKey:
				"com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.SetBillingBlock(com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestManageType)",
			isAddActionEnabled: true,
			style: "Default",
			enablePathKey: "__OperationControl/SetBillingBlock",
			isEnablePropertyControlVisible: false
		};

		const context = {
			dialog: {
				getModel: jest.fn().mockReturnValue({
					getProperty: jest.fn((param: any) => {
						if (param === "/configuration/actions/bODataV4") {
							return true;
						}
					}),
					setProperty: jest.fn()
				})
			},
			appModel: {
				getMetaModel: jest.fn().mockReturnValue({
					getObject: jest.fn((sPath: string) => {
						if (sPath === "/CreditMemoRequestManage") {
							return {
								$kind: "EntitySet",
								$Type: "com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestManageType"
							};
						} else if (sPath === "/com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestManageType") {
							return {
								$kind: "EntityType",
								$Key: ["CreditMemoRequest"]
							};
						} else if (
							sPath === "/CreditMemoRequestManage/com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.SetBillingBlock"
						) {
							return [
								{
									$kind: "Action",
									$IsBound: true,
									$Parameter: [
										{
											$Type: "com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestManageType",
											$Name: "_it",
											$Nullable: false
										},
										{
											$Type: "Edm.String",
											$Name: "HeaderBillingBlockReason",
											$Nullable: false,
											$MaxLength: 2
										}
									]
								},
								{
									$kind: "Action",
									$IsBound: true,
									$Parameter: [
										{
											$Type: "com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestItemManageType",
											$Name: "_it",
											$Nullable: false
										},
										{
											$Type: "Edm.String",
											$Name: "ItemBillingBlockReason",
											$Nullable: false,
											$MaxLength: 2
										}
									]
								}
							];
						} else if (
							sPath === "/CreditMemoRequestManage/com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.SetBillingBlock@"
						) {
							return {};
						} else if (
							sPath ===
							"/com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestManageType/HeaderBillingBlockReason@"
						) {
							return {
								"@com.sap.vocabularies.Common.v1.Label": "Billing Block"
							};
						} else if (sPath === "/com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestManageType@") {
							return {
								"@com.sap.vocabularies.UI.v1.Identification": [
									{
										"@com.sap.vocabularies.UI.v1.Importance": {
											$EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
										},
										$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
										Label: "Set Billing Block",
										Action: "com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.SetBillingBlock(com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestManageType)",
										InvocationGrouping: {
											$EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
										}
									}
								]
							};
						} else if (
							sPath ===
							"/CreditMemoRequestManage/com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.SetBillingBlock/HeaderBillingBlockReason@"
						) {
							return {
								"@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement": {
									$EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst"
								},
								"@com.sap.vocabularies.Common.v1.ValueListWithFixedValues": true
							};
						}
					}),
					requestValueListInfo: jest.fn().mockReturnValue(
						Promise.resolve({
							"": {
								Label: "Billing Block Reason",
								CollectionPath: "I_BillingBlockReason",
								Parameters: [
									{
										$Type: "com.sap.vocabularies.Common.v1.ValueListParameterInOut",
										LocalDataProperty: {
											$PropertyPath: "HeaderBillingBlockReason"
										},
										ValueListProperty: "BillingBlockReason"
									},
									{
										$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
										ValueListProperty: "BillingBlockReason_Text"
									}
								],
								$model: {
									getMetaModel: jest.fn().mockReturnValue({
										getObject: jest.fn().mockReturnValue({
											"@com.sap.vocabularies.Common.v1.Text": {
												$Path: "BillingBlockReason_Text"
											},
											"@com.sap.vocabularies.Common.v1.IsUpperCase": true,
											"@com.sap.vocabularies.Common.v1.Label": "Billing Block",
											"@com.sap.vocabularies.Common.v1.Heading": "Block"
										})
									}),
									getServiceUrl: jest
										.fn()
										.mockReturnValue(
											"/sap/opu/odata4/sap/c_salesordermanage_srv/srvd_f4/sap/i_billingblockreason/0001;ps=%27srvd-c_salesordermanage_sd-0001%27;va=%27com.sap.gateway.srvd.c_salesordermanage_sd.v0001.ae-c_salesordermanage.setbillingblock.headerbillingblockreason.SalesOrderManageType%27/"
										)
								}
							}
						})
					)
				})
			},
			entitySet: "CreditMemoRequestManage"
		};

		await addActionToCardManifest(cardManifest, controlProperties, context);
		expect(cardManifest).toMatchSnapshot();
		ApplicationInfo.getInstance()._resetInstance();
		windowSpy1.mockRestore();
	});

	test("addActionToCardManifest : Add the actions to card manifest for OData V4 Card with bound action with Multiple action parameters", async () => {
		let cardManifest = {
			"sap.card": {
				configuration: {
					parameters: {
						footerActionParameters: {},
						_adaptiveFooterActionParameters: {}
					}
				}
			}
		} as unknown as CardManifest;

		const controlProperties = {
			title: "Add Date to New Worklist",
			titleKey:
				"com.sap.gateway.srvd.ui_lo_setman_cc_setdates.v0001.AddToNewWorklist(com.sap.gateway.srvd.ui_lo_setman_cc_setdates.v0001.CndnContrSettlementCalendarType)",
			isAddActionEnabled: true,
			style: "Negative",
			enablePathKey: "__OperationControl/SettlmtMgmtSchedgWlRunCat",
			isEnablePropertyControlVisible: true
		};

		const context = {
			dialog: {
				getModel: jest.fn().mockReturnValue({
					getProperty: jest.fn((param: any) => {
						if (param === "/configuration/actions/bODataV4") {
							return true;
						}
					})
				})
			},
			appModel: {
				getMetaModel: jest.fn().mockReturnValue({
					getObject: jest.fn((sPath: string) => {
						if (sPath === "/CndnContrSettlementCalendar") {
							return {
								$kind: "EntitySet",
								$Type: "com.sap.gateway.srvd.ui_lo_setman_cc_setdates.v0001.CndnContrSettlementCalendarType"
							};
						} else if (sPath === "/com.sap.gateway.srvd.ui_lo_setman_cc_setdates.v0001.CndnContrSettlementCalendarType") {
							return {
								$kind: "EntityType",
								$Key: ["ConditionContract", "SettlmtDate", "SettlmtDateCat"]
							};
						} else if (
							sPath === "/CndnContrSettlementCalendar/com.sap.gateway.srvd.ui_lo_setman_cc_setdates.v0001.AddToNewWorklist"
						) {
							return [
								{
									$kind: "Action",
									$IsBound: true,
									$Parameter: [
										{
											$Type: "com.sap.gateway.srvd.ui_lo_setman_cc_setdates.v0001.CndnContrSettlementCalendarType",
											$Name: "_it",
											$Nullable: false
										},
										{
											$Type: "Edm.String",
											$Name: "SettlmtMgmtSchedgWlRunCat",
											$Nullable: false,
											$MaxLength: 1
										},
										{
											$Type: "Edm.Boolean",
											$Name: "StlMnScdWlIsSchedldImmediately",
											$Nullable: false
										},
										{
											$Type: "Edm.DateTimeOffset",
											$Name: "ApplJobPlannedStartDateTime"
										}
									],
									$ReturnType: {
										$Type: "com.sap.gateway.srvd.ui_lo_setman_cc_setdates.v0001.SchedulingWorklistType",
										$Nullable: false
									}
								}
							];
						} else if (sPath === "/com.sap.gateway.srvd.ui_lo_setman_cc_setdates.v0001.AddToNewWorklist@") {
							return {};
						} else if (
							sPath ===
							"/com.sap.gateway.srvd.ui_lo_setman_cc_setdates.v0001.CndnContrSettlementCalendarType/SettlmtMgmtSchedgWlRunCat@"
						) {
							return {
								"@com.sap.vocabularies.Common.v1.Label": "Set Management Schedule Time"
							};
						} else if (
							sPath ===
							"/com.sap.gateway.srvd.ui_lo_setman_cc_setdates.v0001.CndnContrSettlementCalendarType/StlMnScdWlIsSchedldImmediately@"
						) {
							return {};
						} else if (
							sPath ===
							"/com.sap.gateway.srvd.ui_lo_setman_cc_setdates.v0001.CndnContrSettlementCalendarType/ApplJobPlannedStartDateTime@"
						) {
							return {
								"@com.sap.vocabularies.Common.v1.Label": "Job Execution Date and Time"
							};
						} else if (sPath === "/com.sap.gateway.srvd.ui_lo_setman_cc_setdates.v0001.CndnContrSettlementCalendarType@") {
							return {
								"@com.sap.vocabularies.UI.v1.Identification": [
									{
										$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
										Label: "Add Date to New Worklist",
										Action: "com.sap.gateway.srvd.ui_lo_setman_cc_setdates.v0001.AddToNewWorklist(com.sap.gateway.srvd.ui_lo_setman_cc_setdates.v0001.CndnContrSettlementCalendarType)",
										InvocationGrouping: {
											$EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/ChangeSet"
										}
									}
								]
							};
						}
					}),
					requestValueListInfo: jest.fn().mockReturnValue(Promise.resolve({}))
				})
			},
			entitySet: "CndnContrSettlementCalendar"
		};

		await addActionToCardManifest(cardManifest, controlProperties, context);
		expect(cardManifest).toMatchSnapshot();
	});

	test("addActionToCardManifest : Add the actions to card manifest for OData V4 Card with bound action without action parameters", async () => {
		let cardManifest = {
			"sap.card": {}
		} as unknown as CardManifest;

		const controlProperties = {
			title: "Withdraw Approval Request",
			titleKey:
				"com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.WithdrawFromApproval(com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestManageType)",
			isAddActionEnabled: true,
			style: "Default",
			enablePathKey: "",
			isEnablePropertyControlVisible: true
		};

		const context = {
			dialog: {
				getModel: jest.fn().mockReturnValue({
					getProperty: jest.fn((param: any) => {
						if (param === "/configuration/actions/bODataV4") {
							return true;
						}
					})
				})
			},
			appModel: {
				getMetaModel: jest.fn().mockReturnValue({
					getObject: jest.fn((sPath: string) => {
						if (sPath === "/CreditMemoRequestManage") {
							return {
								$kind: "EntitySet",
								$Type: "com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestManageType"
							};
						} else if (sPath === "/com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestManageType") {
							return {
								$kind: "EntityType",
								$Key: ["CreditMemoRequest"]
							};
						} else if (sPath === "/com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.WithdrawFromApproval") {
							return [
								{
									$kind: "Action",
									$IsBound: true,
									$Parameter: [
										{
											$Type: "com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestManageType",
											$Name: "_it",
											$Nullable: false
										}
									]
								}
							];
						} else if (sPath === "/com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.WithdrawFromApproval@") {
							return {};
						} else if (sPath === "/com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestManageType@") {
							return {
								"@com.sap.vocabularies.UI.v1.Identification": [
									{
										"@com.sap.vocabularies.UI.v1.Importance": {
											$EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
										},
										$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
										Label: "Withdraw Approval Request",
										Action: "com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.WithdrawFromApproval(com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestManageType)",
										InvocationGrouping: {
											$EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
										}
									}
								]
							};
						}
					})
				})
			},
			entitySet: "CreditMemoRequestManage"
		};

		await addActionToCardManifest(cardManifest, controlProperties, context);
		expect(cardManifest).toMatchSnapshot();
	});

	test("addActionToCardManifest : Add the actions to card manifest for OData V4 Card with unbound action without parameters", async () => {
		let cardManifest = {
			"sap.card": {}
		} as unknown as CardManifest;

		const controlProperties = {
			title: "Overloaded Action - Unbound",
			titleKey: "com.c_salesordermanage_sd.EntityContainer/OverloadedAction",
			isAddActionEnabled: true,
			style: "Default",
			enablePathKey: "",
			isEnablePropertyControlVisible: true
		};

		const context = {
			dialog: {
				getModel: jest.fn().mockReturnValue({
					getProperty: jest.fn((param: any) => {
						if (param === "/configuration/actions/bODataV4") {
							return true;
						}
					})
				})
			},
			appModel: {
				getMetaModel: jest.fn().mockReturnValue({
					getObject: jest.fn((sPath: string) => {
						if (sPath === "/SalesOrderManage") {
							return {
								$kind: "EntitySet",
								$Type: "com.c_salesordermanage_sd.SalesOrderManage"
							};
						} else if (sPath === "/com.c_salesordermanage_sd.SalesOrderManage") {
							return {
								$kind: "EntityType",
								$Key: ["ID", "IsActiveEntity"]
							};
						} else if (sPath === "/com.c_salesordermanage_sd.EntityContainer/OverloadedAction") {
							return {
								$kind: "ActionImport",
								$Action: "com.c_salesordermanage_sd.OverloadedAction",
								$EntitySet: "SalesOrderManage"
							};
						} else if (sPath === "/com.c_salesordermanage_sd.OverloadedAction") {
							return [
								{
									$kind: "Action",
									$IsBound: true,
									$EntitySetPath: "_it",
									$Parameter: [
										{
											$Type: "com.c_salesordermanage_sd.SalesOrderItem",
											$Name: "_it"
										}
									],
									$ReturnType: {
										$Type: "com.c_salesordermanage_sd.SalesOrderItem"
									}
								},
								{
									$kind: "Action",
									$IsBound: true,
									$EntitySetPath: "_it",
									$Parameter: [
										{
											$Type: "com.c_salesordermanage_sd.SalesOrderManage",
											$Name: "_it"
										}
									],
									$ReturnType: {
										$Type: "com.c_salesordermanage_sd.SalesOrderManage"
									}
								},
								{
									$kind: "Action",
									$ReturnType: {
										$Type: "com.c_salesordermanage_sd.SalesOrderManage"
									}
								}
							];
						} else if (sPath === "/com.c_salesordermanage_sd.SalesOrderManage@") {
							return {
								"@com.sap.vocabularies.UI.v1.Identification": [
									{
										$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
										Label: "Overloaded Action - Unbound",
										Action: "com.c_salesordermanage_sd.EntityContainer/OverloadedAction"
									}
								]
							};
						}
					})
				})
			},
			entitySet: "SalesOrderManage"
		};

		await addActionToCardManifest(cardManifest, controlProperties, context);
		expect(cardManifest).toMatchSnapshot();
	});

	test("addActionToCardManifest : Add the actions to card manifest for OData V4 Card with unbound action with parameters", async () => {
		let cardManifest = {
			"sap.card": {}
		} as unknown as CardManifest;

		const controlProperties = {
			title: "Negative (Dummy)",
			titleKey: "com.c_salesordermanage_sd.EntityContainer/UnboundAction",
			isAddActionEnabled: true,
			style: "Negative",
			enablePathKey: "",
			isEnablePropertyControlVisible: true
		};

		const context = {
			dialog: {
				getModel: jest.fn().mockReturnValue({
					getProperty: jest.fn((param: any) => {
						if (param === "/configuration/actions/bODataV4") {
							return true;
						}
					})
				})
			},
			appModel: {
				getMetaModel: jest.fn().mockReturnValue({
					getObject: jest.fn((sPath: string) => {
						if (sPath === "/SalesOrderManage") {
							return {
								$kind: "EntitySet",
								$Type: "com.c_salesordermanage_sd.SalesOrderManage"
							};
						} else if (sPath === "/com.c_salesordermanage_sd.SalesOrderManage") {
							return {
								$kind: "EntityType",
								$Key: ["ID", "IsActiveEntity"]
							};
						} else if (sPath === "/com.c_salesordermanage_sd.SalesOrderManage/MessageText@") {
							return {
								"@com.sap.vocabularies.Common.v1.Label": "Enter Message Text"
							};
						} else if (sPath === "/SalesOrderManage/com.c_salesordermanage_sd.EntityContainer/UnboundAction") {
							return {
								$kind: "ActionImport",
								$Action: "com.c_salesordermanage_sd.UnboundAction",
								$EntitySet: "SalesOrderManage"
							};
						} else if (sPath === "/com.c_salesordermanage_sd.UnboundAction") {
							return [
								{
									$kind: "Action",
									$Parameter: [
										{
											$Type: "Edm.String",
											$Name: "MessageText",
											$MaxLength: 4
										}
									],
									$ReturnType: {
										$Type: "com.c_salesordermanage_sd.SalesOrderManage"
									}
								}
							];
						} else if (sPath === "/com.c_salesordermanage_sd.SalesOrderManage@") {
							return {
								"@com.sap.vocabularies.UI.v1.Identification": [
									{
										$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
										Label: "Negative (Dummy)",
										Action: "com.c_salesordermanage_sd.EntityContainer/UnboundAction"
									}
								]
							};
						}
					}),
					requestValueListInfo: jest.fn().mockReturnValue(Promise.resolve({}))
				})
			},
			entitySet: "SalesOrderManage"
		};

		await addActionToCardManifest(cardManifest, controlProperties, context);
		expect(cardManifest).toMatchSnapshot();
	});

	test("addActionToCardManifest : Add the actions to card manifest for OData V2 Card to generate correct action parameters", async () => {
		const component = {
			getModel: function () {
				return {
					isA: function () {
						return false;
					}
				};
			},
			getManifest: function () {
				return {
					"sap.app": {
						id: "testId"
					}
				};
			}
		} as unknown as UIComponent;

		let windowSpy1: jest.SpyInstance;
		windowSpy1 = jest.spyOn(window, "window", "get");
		windowSpy1.mockImplementation(() => ({
			hasher: {
				getHash: () => "test-intent&/ContractTermRenewalDecision(12345)"
			}
		}));
		ApplicationInfo.createInstance(component);

		let cardManifest = {
			"sap.card": {}
		} as unknown as CardManifest;

		const controlProperties = {
			title: "Perform Renewal",
			titleKey: "PerformRenewal",
			style: "Default",
			enablePathKey: "PerformRenewal_ac",
			isStyleControlEnabled: true,
			isConfirmationRequired: false
		};

		const context = {
			dialog: {
				getModel: jest.fn().mockReturnValue({
					getProperty: jest.fn((param: any) => {
						if (param === "/configuration/actions/bODataV4") {
							return false;
						}
						if (param === "/configuration/$data") {
							return {
								PerformRenewal_ac: true,
								ReverseRenewal_ac: true,
								InternalRealEstateNumber: "IS00100RAPCC6",
								RERenewalSequenceNumber: "1",
								RERenewalNotificationDate: "2023-11-01T00:00:00.000Z",
								REContractOldEndDate: "2024-12-31T00:00:00.000Z",
								REContractNewEndDate: "2026-02-01T00:00:00.000Z",
								REContractRenewalIsActive: true,
								REContractRenewalDecision: "A",
								REContractRenewalDecisionDate: "2023-04-10T00:00:00.000Z",
								IsDraftEntity: false,
								NoteUUID: "abbe5e00-dcc8-1eef-91b6-ec6d0c206b91",
								REContractRenewalDecisionDesc: "Approved",
								REContrRenewalDecisionCritlty: 3,
								HasDraftEntity: false,
								DraftUUID: "00000000-0000-0000-0000-000000000000",
								ParentDraftUUID: "00000000-0000-0000-0000-000000000000",
								HasActiveEntity: false,
								IsActiveEntity: true
							};
						}
					}),
					setProperty: jest.fn()
				})
			},
			appModel: {
				getMetaModel: jest.fn().mockReturnValue({
					getODataEntitySet: jest.fn().mockReturnValue({
						entityType: "cds_ui_recontractterm.ContractTermRenewalsType"
					}),
					getODataEntityType: jest.fn().mockReturnValue({
						key: {
							propertyRef: [
								{
									name: "InternalRealEstateNumber"
								},
								{
									name: "RERenewalSequenceNumber"
								},
								{
									name: "DraftUUID"
								},
								{
									name: "IsActiveEntity"
								}
							]
						},
						"com.sap.vocabularies.UI.v1.Identification": [
							{
								"com.sap.vocabularies.UI.v1.Hidden": {
									Path: "IsDraftEntity"
								},
								"com.sap.vocabularies.UI.v1.Emphasized": {},
								"com.sap.vocabularies.UI.v1.Importance": {
									EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
								},
								Label: {
									String: "Perform Renewal"
								},
								Action: {
									String: "cds_ui_recontractterm.cds_ui_recontractterm_Entities/PerformRenewal"
								},
								InvocationGrouping: {
									EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
								},
								RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction"
							},
							{
								"com.sap.vocabularies.UI.v1.Hidden": {
									Path: "IsDraftEntity"
								},
								"com.sap.vocabularies.UI.v1.Importance": {
									EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
								},
								Label: {
									String: "Reverse Renewal"
								},
								Action: {
									String: "cds_ui_recontractterm.cds_ui_recontractterm_Entities/ReverseRenewal"
								},
								InvocationGrouping: {
									EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
								},
								RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction"
							}
						]
					}),
					getODataFunctionImport: jest.fn().mockReturnValue({
						name: "PerformRenewal",
						returnType: "cds_ui_recontractterm.DummyFunctionImportResult",
						httpMethod: "POST",
						parameter: [
							{
								name: "InternalRealEstateNumber",
								type: "Edm.String",
								mode: "In",
								maxLength: "13",
								extensions: [
									{
										name: "label",
										value: "RE Key"
									}
								],
								"sap:label": "RE Key",
								"com.sap.vocabularies.Common.v1.Label": {
									String: "RE Key"
								}
							},
							{
								name: "RERenewalSequenceNumber",
								type: "Edm.String",
								mode: "In",
								maxLength: "4",
								extensions: [
									{
										name: "label",
										value: "Sequence No."
									}
								],
								"sap:label": "Sequence No.",
								"com.sap.vocabularies.Common.v1.Label": {
									String: "Sequence No."
								}
							},
							{
								name: "DraftUUID",
								type: "Edm.Guid",
								mode: "In",
								extensions: [
									{
										name: "label",
										value: "Key"
									}
								],
								"sap:label": "Key",
								"com.sap.vocabularies.Common.v1.Label": {
									String: "Key"
								}
							},
							{
								name: "IsActiveEntity",
								type: "Edm.Boolean",
								mode: "In",
								extensions: [
									{
										name: "label",
										value: "Is active"
									}
								],
								"sap:label": "Is active",
								"com.sap.vocabularies.Common.v1.Label": {
									String: "Is active"
								}
							},
							{
								name: "REContractRenewalDecision",
								type: "Edm.String",
								mode: "In",
								maxLength: "1",
								extensions: [
									{
										name: "value-list",
										value: "fixed-values"
									},
									{
										name: "label",
										value: "Approved/Rejected"
									},
									{
										name: "quickinfo",
										value: "Renewal Approved or Rejected"
									}
								],
								"sap:value-list": "fixed-values",
								"sap:label": "Approved/Rejected",
								"com.sap.vocabularies.Common.v1.Label": {
									String: "Approved/Rejected"
								},
								"sap:quickinfo": "Renewal Approved or Rejected",
								"com.sap.vocabularies.Common.v1.QuickInfo": {
									String: "Renewal Approved or Rejected"
								},
								"com.sap.vocabularies.Common.v1.ValueList": {
									Label: {
										String: "Approved/Rejected"
									},
									CollectionPath: {
										String: "ContractTermRenewalDecision"
									},
									SearchSupported: {
										Bool: "true"
									},
									Parameters: [
										{
											LocalDataProperty: {
												PropertyPath: "REContractRenewalDecision"
											},
											ValueListProperty: {
												String: "REContractRenewalDecision"
											},
											RecordType: "com.sap.vocabularies.Common.v1.ValueListParameterInOut"
										},
										{
											ValueListProperty: {
												String: "REContractRenewalDecision_Text"
											},
											RecordType: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
										}
									]
								},
								"com.sap.vocabularies.Common.v1.FieldControl": {
									EnumMember: "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory"
								}
							},
							{
								name: "REContractRenewalDecisionDate",
								type: "Edm.DateTime",
								mode: "In",
								precision: "0",
								extensions: [
									{
										name: "label",
										value: "Decided On"
									},
									{
										name: "quickinfo",
										value: "Decided On"
									},
									{
										name: "display-format",
										value: "Date"
									}
								],
								"sap:label": "Decided On",
								"com.sap.vocabularies.Common.v1.Label": {
									String: "Decided On"
								},
								"sap:quickinfo": "Decided On",
								"com.sap.vocabularies.Common.v1.QuickInfo": {
									String: "Decided On"
								},
								"sap:display-format": "Date",
								"com.sap.vocabularies.Common.v1.FieldControl": {
									EnumMember: "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory"
								}
							},
							{
								name: "REContractRenewalIsActive",
								type: "Edm.Boolean",
								mode: "In",
								nullable: "true",
								extensions: [
									{
										name: "label",
										value: "Renewal Active",
										namespace: "http://www.sap.com/Protocols/SAPData"
									},
									{
										name: "quickinfo",
										value: "Renewal Active",
										namespace: "http://www.sap.com/Protocols/SAPData"
									}
								],
								"sap:label": "Renewal Active",
								"com.sap.vocabularies.Common.v1.Label": {
									String: "Renewal Active"
								},
								"sap:quickinfo": "Renewal Active",
								"com.sap.vocabularies.Common.v1.QuickInfo": {
									String: "Renewal Active"
								}
							}
						],
						"sap:action-for": "cds_ui_recontractterm.ContractTermRenewalsType",
						"sap:applicable-path": "PerformRenewal_ac"
					})
				}),
				sServiceUrl: "/sap/opu/odata/sap/UI_RECONTRACTTERM"
			}
		};

		await addActionToCardManifest(cardManifest, controlProperties, context);
		expect(cardManifest).toMatchSnapshot();
		ApplicationInfo.getInstance()._resetInstance();
		windowSpy1.mockRestore();
	});

	test("removeActionFromManifest : Remove the action from card manifest when there exists 1 action in card manifest remove the action which does not exists in manifest", () => {
		const cardManifest = {
			"sap.card": {
				configuration: {
					parameters: {
						_adaptiveFooterActionParameters: {
							C_SalesPlanTPRelease: {
								actionParameters: [],
								data: {
									actionParams: {
										keys: ["SalesPlanUUID", "IsActiveEntity"]
									},
									isConfirmationRequired: false
								},
								enablePath: "salesorderID",
								label: "Release",
								parameters: {
									IsActiveEntity: true,
									SalesPlanUUID: "00000000-0000-0000-0000-000000000000"
								},
								style: "default",
								verb: "C_SalesPlanTPRelease"
							}
						},
						footerActionParameters: {
							C_SalesPlanTPRelease: {
								IsActiveEntity: true,
								SalesPlanUUID: "00000000-0000-0000-0000-000000000000"
							}
						}
					}
				},
				footer: {
					actionsStrip: [
						{
							actions: [
								{
									enabled: "${salesorderID}",
									parameters: "{{parameters.footerActionParameters.C_SalesPlanTPRelease}}",
									type: "custom"
								}
							],
							buttonType: "Default",
							text: "Release",
							type: "Button",
							visible: false
						}
					]
				}
			}
		} as unknown as CardManifest;

		const controlProperties = {
			title: "Copy to New Version",
			titleKey: "C_SalesPlanTPCopy",
			style: "Default",
			enablePathKey: "Copy_ac",
			isEnablePropertyControlVisible: true
		};

		removeActionFromManifest(cardManifest, controlProperties);

		expect(cardManifest).toMatchSnapshot();
	});

	test("removeActionFromManifest : Remove the action from card manifest when there exists 1 action in card manifest", () => {
		const cardManifest = {
			"sap.card": {
				configuration: {
					parameters: {
						_adaptiveFooterActionParameters: {
							C_SalesPlanTPCopy: {
								actionParameters: [],
								data: {
									actionParams: {
										keys: ["SalesPlanUUID", "IsActiveEntity"]
									},
									isConfirmationRequired: false
								},
								enablePath: "salesorderID",
								label: "Release",
								parameters: {
									IsActiveEntity: true,
									SalesPlanUUID: "00000000-0000-0000-0000-000000000000"
								},
								style: "default",
								verb: "C_SalesPlanTPCopy"
							}
						},
						footerActionParameters: {
							C_SalesPlanTPCopy: {
								IsActiveEntity: true,
								SalesPlanUUID: "00000000-0000-0000-0000-000000000000"
							}
						}
					}
				},
				footer: {
					actionsStrip: [
						{
							actions: [
								{
									enabled: "${salesorderID}",
									parameters: "{{parameters.footerActionParameters.C_SalesPlanTPCopy}}",
									type: "custom"
								}
							],
							buttonType: "Default",
							text: "Release",
							type: "Button",
							visible: false
						}
					]
				}
			}
		} as unknown as CardManifest;

		const controlProperties = {
			title: "Copy to New Version",
			titleKey: "C_SalesPlanTPCopy",
			style: "Default",
			enablePathKey: "Copy_ac",
			isEnablePropertyControlVisible: true
		};

		expect(cardManifest).toMatchSnapshot();
		removeActionFromManifest(cardManifest, controlProperties);
		expect(cardManifest).toMatchSnapshot();
	});

	test("removeActionFromManifest : Remove the action from card manifest when there exists 2 actions in card manifest", () => {
		const cardManifest = {
			"sap.card": {
				configuration: {
					parameters: {
						_adaptiveFooterActionParameters: {
							C_SalesPlanTPCopy: {
								actionParameters: [],
								data: {
									actionParams: {
										keys: ["SalesPlanUUID", "IsActiveEntity"]
									},
									isConfirmationRequired: false
								},
								enablePath: "salesorderID",
								label: "Release",
								parameters: {
									IsActiveEntity: true,
									SalesPlanUUID: "00000000-0000-0000-0000-000000000000"
								},
								style: "default",
								verb: "C_SalesPlanTPCopy"
							},
							C_SalesPlanTPRelease: {
								actionParameters: [],
								data: {
									actionParams: {
										keys: ["SalesPlanUUID", "IsActiveEntity"]
									},
									isConfirmationRequired: false
								},
								enablePath: "salesorderID",
								label: "Release",
								parameters: {
									IsActiveEntity: true,
									SalesPlanUUID: "00000000-0000-0000-0000-000000000000"
								},
								style: "default",
								verb: "C_SalesPlanTPRelease"
							}
						},
						footerActionParameters: {
							C_SalesPlanTPCopy: {
								IsActiveEntity: true,
								SalesPlanUUID: "00000000-0000-0000-0000-000000000000"
							},
							C_SalesPlanTPRelease: {
								IsActiveEntity: true,
								SalesPlanUUID: "00000000-0000-0000-0000-000000000000"
							}
						}
					}
				},
				footer: {
					actionsStrip: [
						{
							actions: [
								{
									enabled: "${salesorderID}",
									parameters: "{{parameters.footerActionParameters.C_SalesPlanTPCopy}}",
									type: "custom"
								}
							],
							buttonType: "Default",
							text: "Copy version",
							type: "Button",
							visible: false
						},
						{
							actions: [
								{
									enabled: "${salesorderID}",
									parameters: "{{parameters.footerActionParameters.C_SalesPlanTPRelease}}",
									type: "custom"
								}
							],
							buttonType: "Default",
							text: "Release",
							type: "Button",
							visible: false
						}
					]
				}
			}
		} as unknown as CardManifest;

		const controlProperties = {
			title: "Copy to New Version",
			titleKey: "C_SalesPlanTPCopy",
			style: "Default",
			enablePathKey: "Copy_ac",
			isEnablePropertyControlVisible: true
		};

		expect(cardManifest).toMatchSnapshot();
		removeActionFromManifest(cardManifest, controlProperties);
		expect(cardManifest).toMatchSnapshot();

		const controlProperties1 = {
			title: "Release",
			titleKey: "C_SalesPlanTPRelease",
			style: "Default",
			enablePathKey: "Edit_ac"
		};
		removeActionFromManifest(cardManifest, controlProperties1);
		expect(cardManifest).toMatchSnapshot();
	});

	test("updateCardManifestAction : Update the style of action from Default to Destructive for Adaptive card and Integration Card Manifest along with enable path", () => {
		const cardManifest = {
			"sap.card": {
				configuration: {
					parameters: {
						_adaptiveFooterActionParameters: {
							C_SalesPlanTPRelease: {
								actionParameters: [],
								data: {
									actionParams: {
										keys: ["SalesPlanUUID", "IsActiveEntity"]
									},
									isConfirmationRequired: false
								},
								enablePath: "salesorderID",
								label: "Release",
								parameters: {
									IsActiveEntity: true,
									SalesPlanUUID: "00000000-0000-0000-0000-000000000000"
								},
								style: "default",
								verb: "C_SalesPlanTPRelease"
							}
						},
						footerActionParameters: {
							C_SalesPlanTPRelease: {
								IsActiveEntity: true,
								SalesPlanUUID: "00000000-0000-0000-0000-000000000000"
							}
						}
					}
				},
				footer: {
					actionsStrip: [
						{
							actions: [
								{
									enabled: "${salesorderID}",
									parameters: "{{parameters.footerActionParameters.C_SalesPlanTPRelease}}",
									type: "custom"
								}
							],
							buttonType: "Default",
							text: "Release",
							type: "Button",
							visible: false
						}
					]
				}
			}
		} as unknown as CardManifest;

		const controlProperties = {
			title: "Release",
			titleKey: "C_SalesPlanTPRelease",
			style: "Negative",
			enablePathKey: "copy_ac",
			isEnablePropertyControlVisible: true
		};

		expect(cardManifest).toMatchSnapshot();
		updateCardManifestAction(cardManifest, controlProperties);
		expect(cardManifest).toMatchSnapshot();
	});

	test("getDefaultAction : Get the default action added", async () => {
		const addedActions = await getDefaultAction();
		expect(addedActions).toMatchSnapshot();
	});

	test("getDefaultAction : Get the default action added when there are saved action in manifest", async () => {
		const manifest = {
			"sap.card": {
				extension: "module:sap/cards/ap/common/extensions/BaseIntegrationCardExtension",
				type: "Object",
				configuration: {
					parameters: {
						_adaptiveFooterActionParameters: {
							"com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetBillingBlock(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)":
								{
									style: "positive",
									verb: "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetBillingBlock",
									label: "Set Billing Block",
									actionParameters: [
										{
											isRequired: true,
											id: "HeaderBillingBlockReason",
											label: "Billing Block"
										}
									],
									data: {
										isConfirmationRequired: false
									},
									enablePath: "__OperationControl/SetBillingBlock",
									isEnablePropertyControlVisible: false,
									triggerActionText: "OK"
								},
							"com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetDeliveryBlock(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)":
								{
									style: "default",
									verb: "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetDeliveryBlock",
									label: "Set Delivery Block",
									actionParameters: [
										{
											isRequired: true,
											id: "DeliveryBlockReason",
											label: "Delivery Block"
										}
									],
									data: {
										isConfirmationRequired: false
									},
									enablePath: "__OperationControl/SetDeliveryBlock",
									isEnablePropertyControlVisible: false,
									triggerActionText: "OK"
								},
							"com.sap.gateway.srvd.c_salesordermanage_sd.v0001.RemoveBillingBlock(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)":
								{
									style: "destructive",
									verb: "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.RemoveBillingBlock",
									label: "Remove Billing Block",
									actionParameters: [],
									data: {
										isConfirmationRequired: false
									},
									enablePath: "__OperationControl/RemoveBillingBlock",
									isEnablePropertyControlVisible: false,
									triggerActionText: "OK"
								},
							"com.sap.gateway.srvd.c_salesordermanage_sd.v0001.RemoveDeliveryBlock(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)":
								{
									style: "destructive",
									verb: "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.RemoveDeliveryBlock",
									label: "Remove Delivery Block",
									actionParameters: [],
									data: {
										isConfirmationRequired: false
									},
									enablePath: "__OperationControl/RemoveDeliveryBlock",
									isEnablePropertyControlVisible: false,
									triggerActionText: "OK"
								}
						}
					}
				}
			}
		};

		expect(
			await getDefaultAction(new ResourceModel({ bundleUrl: "./i18n/i18n.properties" }), {}, manifest as unknown as CardManifest)
		).toMatchSnapshot();
	});

	test("resetCardActions : Get the action after the action added to manifest have been reset using resetCardActions", async () => {
		const manifest = {
			"sap.card": {
				extension: "module:sap/cards/ap/common/extensions/BaseIntegrationCardExtension",
				type: "Object",
				configuration: {
					parameters: {
						_adaptiveFooterActionParameters: {
							"com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetBillingBlock(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)":
								{
									style: "positive",
									verb: "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetBillingBlock",
									label: "Set Billing Block",
									actionParameters: [
										{
											isRequired: true,
											id: "HeaderBillingBlockReason",
											label: "Billing Block"
										}
									],
									data: {
										isConfirmationRequired: false
									},
									enablePath: "__OperationControl/SetBillingBlock",
									isEnablePropertyControlVisible: false,
									triggerActionText: "OK"
								},
							"com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetDeliveryBlock(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)":
								{
									style: "default",
									verb: "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetDeliveryBlock",
									label: "Set Delivery Block",
									actionParameters: [
										{
											isRequired: true,
											id: "DeliveryBlockReason",
											label: "Delivery Block"
										}
									],
									data: {
										isConfirmationRequired: false
									},
									enablePath: "__OperationControl/SetDeliveryBlock",
									isEnablePropertyControlVisible: false,
									triggerActionText: "OK"
								},
							"com.sap.gateway.srvd.c_salesordermanage_sd.v0001.RemoveBillingBlock(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)":
								{
									style: "destructive",
									verb: "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.RemoveBillingBlock",
									label: "Remove Billing Block",
									actionParameters: [],
									data: {
										isConfirmationRequired: false
									},
									enablePath: "__OperationControl/RemoveBillingBlock",
									isEnablePropertyControlVisible: false,
									triggerActionText: "OK"
								},
							"com.sap.gateway.srvd.c_salesordermanage_sd.v0001.RemoveDeliveryBlock(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)":
								{
									style: "destructive",
									verb: "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.RemoveDeliveryBlock",
									label: "Remove Delivery Block",
									actionParameters: [],
									data: {
										isConfirmationRequired: false
									},
									enablePath: "__OperationControl/RemoveDeliveryBlock",
									isEnablePropertyControlVisible: false,
									triggerActionText: "OK"
								}
						}
					}
				},
				footer: {
					actionsStrip: [
						{
							actions: [
								{
									enabled: "${__OperationControl/SetBillingBlock}",
									parameters:
										"{{parameters._adaptiveFooterActionParameters.com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetBillingBlock(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)}}",
									type: "custom"
								},
								{
									enabled: "${__OperationControl/SetDeliveryBlock}",
									parameters:
										"{{parameters._adaptiveFooterActionParameters.com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetDeliveryBlock(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)}}",
									type: "custom"
								},
								{
									enabled: "${__OperationControl/RemoveBillingBlock}",
									parameters:
										"{{parameters._adaptiveFooterActionParameters.com.sap.gateway.srvd.c_salesordermanage_sd.v0001.RemoveBillingBlock(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)}}",
									type: "custom"
								},
								{
									enabled: "${__OperationControl/RemoveDeliveryBlock}",
									parameters:
										"{{parameters._adaptiveFooterActionParameters.com.sap.gateway.srvd.c_salesordermanage_sd.v0001.RemoveDeliveryBlock(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)}}",
									type: "custom"
								}
							],
							buttonType: "Default",
							text: "Actions",
							type: "Button",
							visible: false
						}
					]
				}
			}
		};

		expect(manifest).toMatchSnapshot();
		resetCardActions(manifest as unknown as CardManifest);
		expect(manifest).toMatchSnapshot();
	});

	test("getActionParameterValue : should format parameter value with description first when TextArrangement value is TextFirst", () => {
		const result = getActionParameterValue("propertyPath", "descriptionPath", "TextFirst");
		expect(result).toBe("${descriptionPath} (${propertyPath})");
	});

	test("getActionParameterValue : should format parameter value with property first when TextArrangement value is TextLast", () => {
		const result = getActionParameterValue("propertyPath", "descriptionPath", "TextLast");
		expect(result).toBe("${propertyPath} (${descriptionPath})");
	});

	test("getActionParameterValue : should format parameter value with property first when TextArrangement value is TextSeparate", () => {
		const result = getActionParameterValue("propertyPath", "descriptionPath", "TextSeparate");
		expect(result).toBe("${propertyPath}");
	});

	test("getActionParameterValue : getActionParameterValue : should default to property only when TextArrangement value is not recognized", () => {
		const result = getActionParameterValue("propertyPath", "descriptionPath", "TextOnly");
		expect(result).toBe("${descriptionPath}");
	});

	test("getActionParameterValue : should handle empty or undefined TextArrangement values", () => {
		const result = getActionParameterValue("propertyPath", "descriptionPath", "");
		expect(result).toBe("${descriptionPath} (${propertyPath})");
	});

	test("updateModelData : should update the model with value help data", async () => {
		const component = {
			getModel: function () {
				return {
					isA: function () {
						return true;
					},
					getServiceUrl: jest
						.fn()
						.mockReturnValue(
							"/sap/opu/odata4/sap/c_salesordermanage_srv/srvd_f4/sap/i_billingblockreason/0001;ps=%27srvd-c_salesordermanage_sd-0001%27;va=%27com.sap.gateway.srvd.c_salesordermanage_sd.v0001.ae-c_salesordermanage.setbillingblock.headerbillingblockreason.SalesOrderManageType%27"
						)
				};
			},
			getManifest: function () {
				return {
					"sap.app": {
						id: "testId"
					}
				};
			}
		} as unknown as UIComponent;

		let windowSpy1: jest.SpyInstance;
		windowSpy1 = jest.spyOn(window, "window", "get");
		windowSpy1.mockImplementation(() => ({
			hasher: {
				getHash: () => "test-intent&/I_BillingBlockReason(12345)"
			}
		}));

		ApplicationInfo.createInstance(component);
		global.fetch = jest.fn(() =>
			Promise.resolve({
				json: () =>
					Promise.resolve({
						value: [
							{
								BillingBlockReason: "00",
								BillingBlockReason_Text: "Check Day Rate"
							},
							{
								BillingBlockReason: "01",
								BillingBlockReason_Text: "Calculation Missing"
							},
							{
								BillingBlockReason: "02",
								BillingBlockReason_Text: "Compl Confirm Missng"
							}
						]
					})
			})
		) as jest.Mock;

		const oDialogModel = new JSONModel({
			configuration: { $data: {} }
		});
		const serviceUrl =
			"/sap/opu/odata4/sap/c_salesordermanage_srv/srvd_f4/sap/i_billingblockreason/0001;ps=%27srvd-c_salesordermanage_sd-0001%27;va=%27com.sap.gateway.srvd.c_salesordermanage_sd.v0001.ae-c_salesordermanage.setbillingblock.headerbillingblockreason.SalesOrderManageType%27/I_BillingBlockReason?$select=BillingBlockReason,BillingBlockReason_Text";
		const valueHelpEntitySet = "I_BillingBlockReason";
		const mData = oDialogModel.getProperty("/configuration/$data");

		await updateModelData(mData, serviceUrl, valueHelpEntitySet);

		expect(fetch).toHaveBeenCalledTimes(1);
		expect(fetch).toHaveBeenCalledWith(serviceUrl);
		expect(mData).toMatchSnapshot();
		ApplicationInfo.getInstance()._resetInstance();
		windowSpy1.mockRestore();
	});
});

describe("getActionParameterConfigurationV2", () => {
	it("returns default config when additionalParameter is not provided", async () => {
		const result = await getActionParameterConfigurationV2(null, {});
		expect(result).toEqual({
			serviceUrl: "",
			value: "",
			entitySet: "",
			title: ""
		});
	});

	const mockContext = {
		appModel: {
			sServiceUrl: "/sap/opu/odata4/sap/service"
		},
		dialog: {
			getModel: () => ({
				getProperty: jest.fn().mockReturnValue({}),
				setProperty: jest.fn()
			})
		}
	};

	const mockAdditionalParameter = {
		"com.sap.vocabularies.Common.v1.ValueList": {
			CollectionPath: { String: "ContractTermRenewalDecision" },
			Parameters: [
				{
					RecordType: "com.sap.vocabularies.Common.v1.ValueListParameterInOut",
					ValueListProperty: { String: "REContractRenewalDecision" }
				},
				{
					RecordType: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
					ValueListProperty: { String: "REContractRenewalDecision_Text" }
				}
			]
		}
	};

	it("returns configured action parameters", async () => {
		const component = {
			getModel: function () {
				return {
					isA: function () {
						return false;
					}
				};
			},
			getManifest: function () {
				return {
					"sap.app": {
						id: "testId"
					}
				};
			}
		} as unknown as UIComponent;

		let windowSpy1: jest.SpyInstance;
		windowSpy1 = jest.spyOn(window, "window", "get");
		windowSpy1.mockImplementation(() => ({
			hasher: {
				getHash: () => "test-intent&/ContractTermRenewalDecision(12345)"
			}
		}));

		ApplicationInfo.createInstance(component);
		const result = await getActionParameterConfigurationV2(mockAdditionalParameter, mockContext);
		expect(result.serviceUrl).toBe(
			"/sap/opu/odata4/sap/service/ContractTermRenewalDecision?$select=REContractRenewalDecision,REContractRenewalDecision_Text"
		);
		expect(result.entitySet).toBe("ContractTermRenewalDecision");
		expect(result.value).toBe("${REContractRenewalDecision_Text}");
		expect(result.title).toBe("${REContractRenewalDecision}");
		ApplicationInfo.getInstance()._resetInstance();
		windowSpy1.mockRestore();
	});
});
