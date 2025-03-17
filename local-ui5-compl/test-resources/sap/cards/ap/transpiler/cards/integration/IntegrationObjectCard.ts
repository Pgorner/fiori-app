/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
export default {
	manifest: {
		_version: "1.15.0",
		"sap.app": {
			id: "objectCard",
			type: "card",
			title: "Sales Order",
			subTitle: "A Fiori application.",
			description: "Description of an Object Card",
			applicationVersion: {
				version: "1.0.0"
			}
		},
		"sap.ui": {
			technology: "UI5",
			icons: {
				icon: "sap-icon://switch-classes"
			}
		},
		"sap.card": {
			type: "Object",
			configuration: {
				destinations: {
					service: {
						name: "(default)",
						defaultUrl: "/"
					}
				},
				csrfTokens: {
					token1: {
						data: {
							request: {
								url: "{{destinations.service}}/sap/opu/odata/sap/salesorder",
								method: "HEAD",
								headers: {
									"X-CSRF-Token": "Fetch"
								}
							}
						}
					}
				},
				parameters: {
					_adaptiveFooterActionParameters: {
						"com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.SetBillingBlock(com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestManageType)":
							{
								actionParameters: [
									{
										id: "HeaderBillingBlockReason",
										label: "HeaderBillingBlockReason",
										isRequired: true,
										configuration: {
											entitySet: "I_BillingBlockReason",
											serviceUrl:
												"/sap/opu/odata4/sap/c_salesordermanage_srv/srvd_f4/sap/i_billingblockreason/0001;ps=%27srvd-c_salesordermanage_sd-0001%27;va=%27com.sap.gateway.srvd.c_salesordermanage_sd.v0001.ae-c_salesordermanage.setbillingblock.headerbillingblockreason.SalesOrderManageType%27/I_BillingBlockReason?$select=BillingBlockReason,BillingBlockReason_Text",
											title: "${BillingBlockReason}",
											value: "${BillingBlockReason_Text} (${BillingBlockReason})"
										},
										errorMessage: "This is a required input",
										placeholder: "Please choose"
									}
								],
								data: {
									isConfirmationRequired: false
								},
								enablePath: "__OperationControl/SetBillingBlock",
								label: "Set Billing Block",
								style: "default",
								verb: "com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.SetBillingBlock",
								triggerActionText: "OK"
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
						"com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.SetBillingBlock(com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestManageType)":
							{},
						C_SalesPlanTPRelease: {
							IsActiveEntity: true,
							SalesPlanUUID: "00000000-0000-0000-0000-000000000000"
						}
					},
					_entitySet: {
						value: "SalesOrderManage",
						type: "string"
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
							url: "C_STTA_SalesOrder_WD_20(node_key='fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity='true')",
							headers: {
								Accept: "application/json",
								"Accept-Language": "{{parameters.LOCALE}}"
							},
							retryAfter: 30
						},
						content: {
							method: "GET",
							url: "C_STTA_SalesOrder_WD_20(node_key='fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity='true')",
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
				title: "{{salesOrderHeaderTitle}}",
				subTitle: "{so_id}",
				unitOfMeasurement: "{currency_code}",
				mainIndicator: {
					color: "Good",
					number: "{overall_status}"
				}
			},
			content: {
				data: {
					path: "/content/d/"
				},
				groups: [
					{
						title: "General Information",
						items: [
							{
								label: "{{netAmountLabel}}",
								value: "{net_amount}",
								name: "net_amount"
							},
							{
								label: "Tax Amount",
								value: "{tax_amount}",
								name: "tax_amount"
							},
							{
								label: "Gross Amount",
								value: "{gross_amount}",
								name: "gross_amount"
							}
						]
					},
					{
						title: "Additional Information",
						items: [
							{
								label: "{{productLabel}}",
								value: "{Product}",
								name: "Product"
							},
							{
								label: "Language",
								value: "{Language}",
								name: "Language"
							}
						]
					}
				]
			},
			footer: {
				actionsStrip: [
					{
						actions: [
							{
								enabled: "${HeaderBillingBlockReason}",
								parameters:
									"{{parameters.footerActionParameters.com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.SetBillingBlock(com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestManageType)}}",
								type: "custom"
							}
						],
						buttonType: "Default",
						text: "Set Billing Block",
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
		},
		"sap.insights": {
			templateName: "ObjectPage",
			parentAppId: "cus.sd.salesorderv2.manage",
			cardType: "LEAN_DT",
			versions: {
				ui5: "1.120.1-202405021611"
			}
		}
	},
	manifestWithExpressions: {
		_version: "1.15.0",
		"sap.app": {
			id: "objectCard",
			type: "card",
			title: "Sales Order",
			subTitle: "A Fiori application.",
			description: "Description of an Object Card",
			applicationVersion: {
				version: "1.0.0"
			}
		},
		"sap.ui": {
			technology: "UI5",
			icons: {
				icon: "sap-icon://switch-classes"
			}
		},
		"sap.card": {
			type: "Object",
			configuration: {
				parameters: {
					_entitySet: {
						value: "SalesOrderManage",
						type: "string"
					}
				},
				destinations: {
					service: {
						name: "(default)",
						defaultUrl: "/"
					}
				},
				csrfTokens: {
					token1: {
						data: {
							request: {
								url: "{{destinations.service}}/sap/opu/odata/sap/salesorder",
								method: "HEAD",
								headers: {
									"X-CSRF-Token": "Fetch"
								}
							}
						}
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
							url: "C_STTA_SalesOrder_WD_20(node_key='fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity='true')",
							headers: {
								Accept: "application/json",
								"Accept-Language": "{{parameters.LOCALE}}"
							},
							retryAfter: 30
						},
						content: {
							method: "GET",
							url: "C_STTA_SalesOrder_WD_20(node_key='fa163ee4-7bdd-1ee8-b1ff-d3c5a4e5236a',IsActiveEntity='true')",
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
				title: "{{salesOrderHeaderTitle}}",
				subTitle: "{so_id}",
				unitOfMeasurement: "{currency_code}",
				mainIndicator: {
					state: "{= extension.formatters.formatCriticality(${net_amount}, 'color') }",
					number: "{gross_amount}",
					trend: "None",
					unit: "{currency_code}"
				}
			},
			content: {
				data: {
					path: "/content/d/"
				},
				groups: [
					{
						title: "General Information",
						items: [
							{
								label: "{{netAmountLabel}}",
								value: "{net_amount}",
								name: "net_amount"
							},
							{
								label: "Created on",
								value: "{= format.dateTime(${CreationDateTime}, {'relative':false,'UTC':true})}",
								name: "CreationDateTime"
							}
						]
					}
				]
			}
		},
		"sap.insights": {
			templateName: "ObjectPage",
			parentAppId: "sales.order.wd20",
			cardType: "LEAN_DT",
			versions: {
				ui5: "1.120.1-202405021611"
			}
		}
	},
	manifestWithOrWithoutGroupItemValues: {
		_version: "1.15.0",
		"sap.card": {
			type: "Object",
			configuration: {
				parameters: {
					_entitySet: {
						value: "SalesOrderManage",
						type: "string"
					}
				}
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
								label: "Gross Amount",
								value: "{gross_amount} {currency_code}",
								name: "gross_amount"
							}
						]
					},
					{
						title: "Group 2",
						items: [
							{
								label: "Net Amount",
								value: "{net_amount} {currency_code}",
								name: "net_amount"
							}
						]
					},
					{
						title: "Group 3",
						items: [
							{
								label: null,
								value: "{/items/0}"
							}
						]
					}
				]
			}
		}
	}
};
