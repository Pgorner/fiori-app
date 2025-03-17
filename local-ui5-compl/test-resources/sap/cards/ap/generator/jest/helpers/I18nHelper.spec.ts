/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import { createAndStoreGeneratedi18nKeys, resolveI18nTextFromResourceModel } from "sap/cards/ap/generator/helpers/I18nHelper";
import { CardManifest } from "sap/ui/integration/widgets/Card";

describe("I18nHelper, resolveI18nTextFromResourceModel", () => {
	test("should resolve i18n text from resource model", () => {
		const key = "{{key}}";
		const resourceModel = {
			getObject: jest.fn().mockReturnValue("value")
		};
		const result = resolveI18nTextFromResourceModel(key, resourceModel);
		expect(result).toBe("value");
		expect(resourceModel.getObject).toHaveBeenCalledWith("key");
	});

	test("should return key if it does not start with '{{' and end with '}}'", () => {
		const key = "key";
		const resourceModel = {
			getObject: jest.fn().mockReturnValue("value")
		};
		const result = resolveI18nTextFromResourceModel(key, resourceModel);
		expect(result).toBe(key);
		expect(resourceModel.getObject).not.toHaveBeenCalled();
	});
});

describe("I18nHelper, createAndStoreGeneratedi18nKeys", () => {
	test("Manifest is generated with I18N properties, with bindings", () => {
		const cardManifest: CardManifest = {
			_version: "1.15.0",
			"sap.app": {
				id: "objectCard",
				type: "card",
				title: "{card_title}",
				subTitle: "{card_subtitle}",
				description: "{card_description}",
				applicationVersion: {
					version: "1.0.0"
				}
			},
			"sap.card": {
				type: "Object",
				configuration: {
					parameters: {
						footerActionParameters: {
							"com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetBillingBlock(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)":
								{},
							"com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetDeliveryBlock(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)":
								{}
						},
						_adaptiveFooterActionParameters: {
							"com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetBillingBlock(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)":
								{
									style: "default",
									verb: "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetBillingBlock",
									label: "Set Billing Block",
									actionParameters: [
										{
											isRequired: true,
											id: "HeaderBillingBlockReason",
											label: "Billing Block",
											errorMessage: "This is a required input",
											placeholder: "Please choose",
											configuration: {
												entitySet: "I_BillingBlockReason",
												serviceUrl:
													"/sap/opu/odata4/sap/c_salesordermanage_srv/srvd_f4/sap/i_billingblockreason/0001;ps=%27srvd-c_salesordermanage_sd-0001%27;va=%27com.sap.gateway.srvd.c_salesordermanage_sd.v0001.ae-c_salesordermanage.setbillingblock.headerbillingblockreason.SalesOrderManageType%27/I_BillingBlockReason?$select=BillingBlockReason,BillingBlockReason_Text&skip=0&$top=20",
												value: "${BillingBlockReason_Text} (${BillingBlockReason})",
												title: "${BillingBlockReason}"
											}
										}
									],
									data: {
										isConfirmationRequired: false
									},
									enablePath: "__OperationControl/SetBillingBlock",
									complimentaryActionKey: "",
									isComplimentaryAction: false,
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
											label: "Delivery Block",
											errorMessage: "This is a required input",
											placeholder: "Please choose",
											configuration: {
												entitySet: "I_DeliveryBlockReason",
												serviceUrl:
													"/sap/opu/odata4/sap/c_salesordermanage_srv/srvd_f4/sap/i_deliveryblockreason/0001;ps=%27srvd-c_salesordermanage_sd-0001%27;va=%27com.sap.gateway.srvd.c_salesordermanage_sd.v0001.ae-c_salesordermanage.setdeliveryblock.deliveryblockreason.SalesOrderManageType%27/I_DeliveryBlockReason?$select=DeliveryBlockReason,DeliveryBlockReason_Text&skip=0&$top=20",
												value: "${DeliveryBlockReason_Text} (${DeliveryBlockReason})",
												title: "${DeliveryBlockReason}"
											}
										}
									],
									data: {
										isConfirmationRequired: false
									},
									enablePath: "__OperationControl/SetDeliveryBlock",
									complimentaryActionKey: "",
									isComplimentaryAction: false,
									triggerActionText: "OK"
								}
						}
					}
				},
				header: {
					title: "{sales_order_id}",
					data: {}
				},
				data: {},
				content: {
					data: {
						path: ""
					},
					groups: [
						{
							title: "Group Title",
							items: [
								{
									label: "Sales Order ID",
									value: "{sales_order_id}"
								}
							]
						}
					]
				},
				footer: {
					actionsStrip: [
						{
							type: "Button",
							visible: false,
							text: "Set Billing Block",
							buttonType: "Default",
							actions: [
								{
									type: "custom",
									enabled: "${__OperationControl/SetBillingBlock}",
									parameters:
										"{{parameters.footerActionParameters.com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetBillingBlock(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)}}"
								}
							]
						},
						{
							type: "Button",
							visible: false,
							text: "Set Delivery Block",
							buttonType: "Default",
							actions: [
								{
									type: "custom",
									enabled: "${__OperationControl/SetDeliveryBlock}",
									parameters:
										"{{parameters.footerActionParameters.com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SetDeliveryBlock(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)}}"
								}
							]
						}
					]
				}
			}
		};

		createAndStoreGeneratedi18nKeys(cardManifest);
		expect(cardManifest).toMatchSnapshot();
	});

	test("Manifest is generated with I18N properties, with values", () => {
		const cardManifest: CardManifest = {
			_version: "1.15.0",
			"sap.app": {
				id: "objectCard",
				type: "card",
				title: "Card Title",
				subTitle: "Card Subtitle",
				description: "Card Description",
				applicationVersion: {
					version: "1.0.0"
				}
			},
			"sap.card": {
				type: "Object",
				header: {
					title: "Sales Order ID",
					data: {}
				},
				data: {},
				content: {
					data: {
						path: ""
					},
					groups: [
						{
							title: "Group Title",
							items: [
								{
									label: "Sales Order ID",
									value: "{sales_order_id}"
								},
								{
									label: "Sales Order ID",
									value: "{sales_order_id_2}"
								}
							]
						},
						{
							title: "",
							items: [
								{
									label: "",
									value: "{sales_order_id}"
								}
							]
						}
					]
				}
			}
		};

		createAndStoreGeneratedi18nKeys(cardManifest);
		expect(cardManifest).toMatchSnapshot();
	});
});
