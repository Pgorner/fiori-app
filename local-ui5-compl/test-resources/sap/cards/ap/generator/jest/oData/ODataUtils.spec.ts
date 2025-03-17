/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import { createPathWithEntityContext, fetchDataAsyncV4 } from "sap/cards/ap/generator/odata/ODataUtils";

describe("fetchDataAsyncV4", () => {
	let originalFetch: any;
	let sUrl = "https://url/test/";
	const sPath = "Products";
	const expectedValue = {
		value: "Testing!",
		Response: "Success",
		Status: 200,
		StatusText: "OK",
		Headers: "Content-Type: application/json"
	};
	beforeEach(() => {
		originalFetch = global.fetch;
		global.fetch = jest.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve(expectedValue)
			})
		) as jest.Mock;
	});

	afterEach(() => {
		global.fetch = originalFetch;
	});

	test("fetchDataAsyncV4 - service URL ending with /", async () => {
		const result = await fetchDataAsyncV4(sUrl, sPath, {});
		expect(global.fetch).toHaveBeenCalledWith("https://url/test/Products?format=json");
		expect(result).toBe(expectedValue);
	});

	test("fetchDataAsyncV4 service URL ending without /", async () => {
		sUrl = "https://url/test";
		const result = await fetchDataAsyncV4(sUrl, sPath, {});
		expect(global.fetch).toHaveBeenCalledWith("https://url/test/Products?format=json");
		expect(result).toBe(expectedValue);
	});
});

describe("createPathWithEntityContext", () => {
	let windowSpy: jest.SpyInstance;
	let originalFetch: any;
	const expectedValue = {
		value: [
			{
				BankCountry: "AD",
				IsActiveEntity: true
			}
		]
	};
	beforeAll(() => {
		windowSpy = jest.spyOn(window, "window", "get");
		windowSpy.mockImplementation(() => ({
			hasher: {
				getHash: () => "test-intent&/I_BillingBlockReason(12345)"
			}
		}));
		originalFetch = global.fetch;
		global.fetch = jest.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve(expectedValue)
			})
		) as jest.Mock;
	});
	afterAll(() => {
		jest.restoreAllMocks();
		global.fetch = originalFetch;
	});

	test("validate method createPathWithEntityContext for V4 data - with multiple context parameters", async () => {
		const mockMetaData = {
			getMetaModel: () => {
				return {
					getObject: (sParam: string) => {
						const entityContainer = {
							$kind: "EntityContainer",
							CashBank: {
								$kind: "EntitySet",
								$Type: "com.sap.gateway.srvd.ui_cashbank_manage.v0001.CashBankType"
							},
							"com.sap.gateway.srvd.ui_cashbank_manage.v0001.CashBankType": {
								$kind: "EntityType",
								$Key: ["BankCountry", "BankInternalID", "IsActiveEntity"],
								BankCountry: {
									$kind: "Property",
									$Type: "Edm.String",
									"@com.sap.vocabularies.Common.v1.Label": "Bank Country"
								},
								BankInternalID: {
									$kind: "Property",
									$Type: "Edm.String",
									"@com.sap.vocabularies.Common.v1.Label": "Bank Internal ID"
								},
								IsActiveEntity: {
									$kind: "Property",
									$Type: "Edm.Boolean",
									"@com.sap.vocabularies.Common.v1.Label": "Is Active Entity"
								}
							}
						};
						if (sParam === "/") {
							return entityContainer;
						}
						sParam = sParam.replace("/", "");
						return entityContainer[sParam];
					},
					getODataEntitySet: (path: string) => {
						return {
							name: "CashBank",
							entityType: "com.sap.gateway.srvd.ui_cashbank_manage.v0001.CashBankType"
						};
					}
				};
			},
			getContext: (path: string) => {
				return {
					getObject: () => {
						return {
							BankInternalID: "0000000002",
							IsActiveEntity: true,
							BankCountry: "AD"
						};
					}
				};
			}
		};
		const path = "CashBank(BankCountry='AD',BankInternalID='0000000002')";
		const expectedPath = "CashBank(BankCountry='AD',BankInternalID='0000000002',IsActiveEntity=true)";

		const updatedPath = await createPathWithEntityContext(path, mockMetaData, true);
		expect(updatedPath).toEqual(expectedPath);
	});

	test("validate method createPathWithEntityContext for V4 data - with single context guid parameters", async () => {
		const mockMetaData = {
			getMetaModel: () => {
				return {
					getObject: (sParam: string) => {
						const entityContainer = {
							$kind: "EntityContainer",
							CashBank: {
								$kind: "EntitySet",
								$Type: "com.sap.gateway.srvd.ui_cashbank_manage.v0001.CashBankType"
							},
							"com.sap.gateway.srvd.ui_cashbank_manage.v0001.CashBankType": {
								$kind: "EntityType",
								$Key: ["BankCountry", "IsActiveEntity"],
								BankCountry: {
									$kind: "Property",
									$Type: "Edm.Guid",
									"@com.sap.vocabularies.Common.v1.Label": "Bank Country"
								},
								IsActiveEntity: {
									$kind: "Property",
									$Type: "Edm.Boolean",
									"@com.sap.vocabularies.Common.v1.Label": "Is Active Entity"
								}
							}
						};
						if (sParam === "/") {
							return entityContainer;
						}
						sParam = sParam.replace("/", "");
						return entityContainer[sParam];
					},
					getODataEntitySet: (path: string) => {
						return {
							name: "CashBank",
							entityType: "com.sap.gateway.srvd.ui_cashbank_manage.v0001.CashBankType"
						};
					}
				};
			},
			getContext: (path: string) => {
				return {
					getObject: () => {
						return {
							IsActiveEntity: true,
							BankCountry: "'AD'"
						};
					}
				};
			}
		};
		const path = "CashBank(BankCountry='AD')";
		const expectedPath = "CashBank(BankCountry='AD',IsActiveEntity=true)";

		const updatedPath = await createPathWithEntityContext(path, mockMetaData, true);
		expect(updatedPath).toEqual(expectedPath);
	});

	test("validate method createPathWithEntityContext for V4 data - with semantic key annotation", async () => {
		const mockMetamodel = {
			getObject: (sParam: string) => {
				const entityContainer = {
					$kind: "EntityContainer",
					CashBank: {
						$kind: "EntitySet",
						$Type: "com.sap.gateway.srvd.ui_cashbank_manage.v0001.CashBankType"
					},
					"com.sap.gateway.srvd.ui_cashbank_manage.v0001.CashBankType": {
						$kind: "EntityType",
						$Key: ["BankCountry", "IsActiveEntity"],
						BankCountry: {
							$kind: "Property",
							$Type: "Edm.String",
							"@com.sap.vocabularies.Common.v1.Label": "Bank Country"
						},
						IsActiveEntity: {
							$kind: "Property",
							$Type: "Edm.Boolean",
							"@com.sap.vocabularies.Common.v1.Label": "Is Active Entity"
						}
					}
				};
				if (sParam === "/") {
					return entityContainer;
				}
				if (sParam === "/CashBank/@com.sap.vocabularies.Common.v1.SemanticKey") {
					return [
						{
							$PropertyPath: "BankCountry"
						}
					];
				}
				sParam = sParam.replace("/", "");
				return entityContainer[sParam];
			},
			getODataEntitySet: (path: string) => {
				return {
					name: "CashBank",
					entityType: "com.sap.gateway.srvd.ui_cashbank_manage.v0001.CashBankType"
				};
			}
		};
		const mockMetaData = {
			getMetaModel: () => {
				return mockMetamodel;
			},
			getContext: (path: string) => {
				return {
					getObject: () => {
						return {
							IsActiveEntity: true,
							BankCountry: "AD"
						};
					}
				};
			},
			getServiceUrl: () => "/sap/opu/odata",
			isA: () => true
		};

		const path = "CashBank('AD')";
		const expectedPath = "CashBank(BankCountry='AD',IsActiveEntity=true)";
		const updatedPath = await createPathWithEntityContext(path, mockMetaData, true);

		expect(updatedPath).toEqual(expectedPath);
	});

	test("validate method createPathWithEntityContext for V2 data - with multiple context parameters", async () => {
		const mockMetaData = {
			getMetaModel: () => {
				return {
					getODataEntityType: (path: string) => {
						return {
							key: {
								propertyRef: [
									{
										name: "BankCountry"
									},
									{
										name: "BankInternalID"
									},
									{
										name: "IsActiveEntity"
									}
								]
							},
							property: [
								{
									name: "BankCountry",
									type: "Edm.String",
									nullable: "false",
									"sap:label": "Bank Country",
									kind: "Property"
								},
								{
									name: "BankInternalID",
									type: "Edm.Guid",
									nullable: "false",
									"sap:label": "Bank Internal ID",
									kind: "Property"
								},
								{
									name: "IsActiveEntity",
									type: "Edm.Boolean",
									nullable: "false",
									"sap:label": "Is Active Entity",
									kind: "Property"
								}
							]
						};
					},
					getODataAssociationEnd: () => {},
					getODataEntitySet: (path: string) => {
						return {
							name: "CashBank",
							entityType: "com.sap.gateway.srvd.ui_cashbank_manage.v0001.CashBankType"
						};
					}
				};
			},
			getObject: () => {
				return {
					BankInternalID: "0000000002",
					IsActiveEntity: true,
					BankCountry: "AD"
				};
			}
		};
		const path = "CashBank(BankInternalID=guid'0000000002',BankCountry='AD',IsActiveEntity=true)";
		const expectedPath = "CashBank(BankCountry='AD',BankInternalID=guid'0000000002',IsActiveEntity=true)";

		const updatedPath = await createPathWithEntityContext(path, mockMetaData, false);
		expect(updatedPath).toEqual(expectedPath);
	});

	test("validate method createPathWithEntityContext for V2 data - with single context guid parameter", async () => {
		const mockMetaData = {
			getMetaModel: () => {
				return {
					getODataEntityContainer: () => {
						return {
							entitySet: [{ name: "CashBank", entityType: "com.sap.gateway.srvd.ui_cashbank_manage.v0001.CashBankType" }]
						};
					},
					getODataEntityType: (path: string) => {
						return {
							key: {
								propertyRef: [
									{
										name: "BankCountry"
									},
									{
										name: "BankInternalID"
									},
									{
										name: "IsActiveEntity"
									}
								]
							},
							property: [
								{
									name: "BankCountry",
									type: "Edm.String",
									nullable: "false",
									"sap:label": "Bank Country",
									kind: "Property"
								},
								{
									name: "BankInternalID",
									type: "Edm.Guid",
									nullable: "false",
									"sap:label": "Bank Internal ID",
									kind: "Property"
								},
								{
									name: "IsActiveEntity",
									type: "Edm.Boolean",
									nullable: "false",
									"sap:label": "Is Active Entity",
									kind: "Property"
								}
							]
						};
					},
					getODataAssociationEnd: () => {},
					getODataEntitySet: (path: string) => {
						return {
							name: "CashBank",
							entityType: "com.sap.gateway.srvd.ui_cashbank_manage.v0001.CashBankType"
						};
					}
				};
			},
			getObject: () => {
				return {
					BankInternalID: "0000000002",
					IsActiveEntity: true,
					BankCountry: "AD"
				};
			}
		};
		const path = "CashBank(BankInternalID=guid'005056a7-004e-1ed8-b2e0-081387831f0d',IsActiveEntity=true)";
		const expectedPath = "CashBank(BankCountry='AD',BankInternalID=guid'0000000002',IsActiveEntity=true)";

		const updatedPath = await createPathWithEntityContext(path, mockMetaData, false);
		expect(updatedPath).toEqual(expectedPath);
	});

	test("validate method createPathWithEntityContext for V2 data - with guid as context parameter", async () => {
		const mockMetaData = {
			getMetaModel: () => {
				return {
					getODataEntityContainer: () => {
						return {
							entitySet: [{ name: "CashBank", entityType: "com.sap.gateway.srvd.ui_cashbank_manage.v0001.CashBankType" }]
						};
					},
					getODataEntityType: (path: string) => {
						return {
							key: {
								propertyRef: [
									{
										name: "BankCountry"
									},
									{
										name: "BankInternalID"
									},
									{
										name: "IsActiveEntity"
									}
								]
							},
							property: [
								{
									name: "BankCountry",
									type: "Edm.String",
									nullable: "false",
									"sap:label": "Bank Country",
									kind: "Property"
								},
								{
									name: "BankInternalID",
									type: "Edm.Guid",
									nullable: "false",
									"sap:label": "Bank Internal ID",
									kind: "Property"
								},
								{
									name: "IsActiveEntity",
									type: "Edm.Boolean",
									nullable: "false",
									"sap:label": "Is Active Entity",
									kind: "Property"
								}
							]
						};
					},
					getODataAssociationEnd: () => {},
					getODataEntitySet: (path: string) => {
						return {
							name: "CashBank",
							entityType: "com.sap.gateway.srvd.ui_cashbank_manage.v0001.CashBankType"
						};
					}
				};
			},
			getObject: () => {
				return {
					BankInternalID: "0000000002",
					IsActiveEntity: true,
					BankCountry: "AD"
				};
			}
		};
		const path = "CashBank('0000000002')";
		const expectedPath = "CashBank(BankCountry='AD',BankInternalID=guid'0000000002',IsActiveEntity=true)";

		const updatedPath = await createPathWithEntityContext(path, mockMetaData, false);
		expect(updatedPath).toEqual(expectedPath);
	});
});
