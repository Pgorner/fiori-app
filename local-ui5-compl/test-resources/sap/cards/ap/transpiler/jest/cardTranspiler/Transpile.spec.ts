/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import { convertIntegrationCardToAdaptive } from "sap/cards/ap/transpiler/cardTranspiler/Transpile";
import type { CardManifest } from "sap/ui/integration/widgets/Card";
import integrationObjectCard from "../../cards/integration/IntegrationObjectCard";

describe("Transpile: generateAdaptiveCard", () => {
	let windowSpy: jest.SpyInstance;

	beforeEach(() => {
		windowSpy = jest.spyOn(window, "window", "get");
		windowSpy.mockImplementation(() => ({
			hasher: {
				getHash: () => "SalesOrder-manageV2?SalesOrderDate=2024-03-01&/SalesOrderManage('400')"
			},
			location: {
				href: "https://my313815.s4hana.ondemand.com/ui#SalesOrder-manageV2?SalesOrderDate=2024-03-01&/SalesOrderManage('400')",
				origin: "https://my313815.s4hana.ondemand.com"
			}
		}));
	});

	afterEach(() => {
		windowSpy.mockRestore();
		jest.clearAllMocks();
	});

	test("Call with empty integration card", () => {
		const integrationCardManifest = {
			"sap.card": {
				configuration: {
					parameters: {}
				}
			}
		};
		expect(convertIntegrationCardToAdaptive(integrationCardManifest, "SalesOrder-manageV2")).toMatchSnapshot();
	});
	test("Generate adaptive Object card", () => {
		// Integration card is transpiled into adaptive card
		expect(
			convertIntegrationCardToAdaptive(integrationObjectCard.manifest as unknown as CardManifest, "SalesOrder-manageV2")
		).toMatchSnapshot();
	});

	test("Generate adaptive Object card with formatter Expressions in manifest value", () => {
		// Integration card is transpiled into adaptive card
		expect(
			convertIntegrationCardToAdaptive(
				integrationObjectCard.manifestWithExpressions as unknown as CardManifest,
				"SalesOrder-manageV2"
			)
		).toMatchSnapshot();
	});

	test("Generate adaptive Object card when manifest may or may not have values for group items", () => {
		// Integration card is transpiled into adaptive card correctly
		const keyParameters = [
			{
				key: "SalesOrderDate",
				formattedValue: "2024-03-01"
			},
			{
				key: "SalesOrder",
				formattedValue: "1234"
			}
		];
		expect(
			convertIntegrationCardToAdaptive(
				integrationObjectCard.manifestWithOrWithoutGroupItemValues as unknown as CardManifest,
				"SalesOrder-manageV2",
				keyParameters
			)
		).toMatchSnapshot();
	});
});
