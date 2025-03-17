/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import {
	getNavigationPropertyInfoFromEntity,
	getPropertyInfoFromEntity,
	getPropertyReferenceKey
} from "sap/cards/ap/generator/odata/v4/MetadataAnalyzer";

describe("Card CardGenerator", () => {
	let mockMetaData: any;

	beforeEach(() => {
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
		mockMetaData = {
			getMetaModel: () => {
				return {
					getObject: (sParam: string) => {
						if (sParam === "/") {
							return entityContainer;
						}
						sParam = sParam.replace("/", "");
						return entityContainer[sParam];
					}
				};
			}
		};
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test("validate function getPropertyReferenceKey", () => {
		const keyReferenceProperties = getPropertyReferenceKey(mockMetaData, "CashBank");
		expect(keyReferenceProperties).toMatchSnapshot();
	});

	test("validate function getPropertyInfoFromEntity", () => {
		const mockAnnotations: Record<string, any> = {
			// Mock annotations for properties
			property1: { $kind: "Property", "@Org.OData.Measures.V1.Unit": "kg", $Type: "Edm.String" },
			property2: {
				"@com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive": false,
				$kind: "Property",
				"@Org.OData.Measures.V1.ISOCurrency": "INR",
				$Type: "Edm.String"
			},
			property3: { "@com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive": true, $kind: "Property" },
			SAP__Messages: {
				$Type: "Edm.String",
				$kind: "Property"
			}
		};

		// Mock getObject to return properties with annotations
		mockMetaData.getMetaModel = jest.fn(() => ({
			getObject: jest.fn((sParam: string) => {
				if (sParam.includes("@")) {
					const path = sParam.split("@")[0];
					const propertyName = path.split("/")[2];
					return mockAnnotations[propertyName];
				} else if (sParam.includes("/")) {
					return mockAnnotations;
				}
			})
		}));

		const properties = getPropertyInfoFromEntity(mockMetaData, "CashBank", false);
		expect(properties).toMatchSnapshot();
	});

	test("validate function getPropertyInfoFromEntity with navigation", () => {
		const mockAnnotations: Record<string, any> = {
			property1: { $kind: "Property", "@Org.OData.Measures.V1.Unit": "kg", $Type: "Edm.String" },
			property2: {
				$kind: "NavigationProperty",
				$Type: "com.sap.gateway.srvd.ui_cashbank_manage.v0001.property2"
			},
			property3: { "@com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive": true, $kind: "Property" },
			SAP__Messages: {
				$Type: "Edm.String",
				$kind: "Property"
			}
		};
		const resourceBundle = {
			getText: jest.fn().mockImplementation((key) => {
				if (key === "GENERATOR_CARD_SELECT_NAV_PROP") return "Select a Navigational Property:";
				if (key === "CRITICALITY_CONTROL_SELECT_PROP") return "Select a Property:";
			})
		};

		mockMetaData.getMetaModel = jest.fn(() => ({
			getObject: jest.fn((sParam: string) => {
				if (sParam.includes("@")) {
					const path = sParam.split("@")[0];
					const propertyName = path.split("/")[2];
					return mockAnnotations[propertyName];
				} else if (sParam.includes("/")) {
					return mockAnnotations;
				}
			})
		}));

		const properties = getPropertyInfoFromEntity(mockMetaData, "CashBank", true, resourceBundle);
		expect(properties).toMatchSnapshot();
	});

	test("validate function getNavigationPropertyInfoFromEntity", () => {
		const mockAnnotations: Record<string, any> = {
			$NavigationPropertyBinding: {
				referencedTestEntities: "RootElement",
				_RootPaymentTerms: "RootPaymentTerms",
				DraftAdministrativeData: "RootPaymentTerms",
				SiblingEntity: "RootElement"
			},
			_RootPaymentTerms: {
				$kind: "NavigationProperty",
				$Type: "com.sap.gateway.srvd.ui_cashbank_manage.v0001.CashBankType",
				$ReferentialConstraint: {
					RootPaymentTerms: "RootPaymentTerms"
				}
			}
		};

		mockMetaData.getMetaModel = jest.fn(() => ({
			getObject: jest.fn((sParam: string) => {
				if (sParam.includes("/")) {
					return mockAnnotations;
				}
			})
		}));

		const properties = getNavigationPropertyInfoFromEntity(mockMetaData, "CashBank");
		expect(properties).toMatchSnapshot();
	});
});
