/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import { fetchApplicationInfo } from "sap/cards/ap/common/helpers/ApplicationInfo";
import UIComponent from "sap/ui/core/UIComponent";

const i18nMap: {
	[key: string]: string;
} = {
	appTitle: "Sales Order",
	appDescription: "A Fiori application.",
	CardGeneratorHeaderTitle: "Sales Order",
	CardGeneratorHeaderSubTitle: "A Fiori application.",
	CardGeneratorGroupPropertyLabel_Groups_0_Items_0: "Net Amount",
	CardGeneratorGroupPropertyLabel_Groups_0_Items_1: "Gross Amount",
	CardGeneratorGroupPropertyLabel_Groups_0_Items_2: "Tax Amount",
	CardGeneratorGroupHeader_Groups_0: "Amount",
	CardGeneratorGroupPropertyLabel_Groups_1_Items_0: "Business Partner ID",
	CardGeneratorGroupPropertyLabel_Groups_1_Items_1: "Created At",
	CardGeneratorGroupPropertyLabel_Groups_1_Items_2: "Sales Order ID",
	CardGeneratorGroupHeader_Groups_1: "Additional Info"
};

describe("fetchApplicationInfo", () => {
	let windowSpy: jest.SpyInstance;
	let getModelSpy: jest.SpyInstance;
	let resourceBundleCreateSpy: jest.SpyInstance;
	const sapAppId = "testComponent";
	const Component = UIComponent.extend("rootComponent", {
		metadata: {
			manifest: {
				"sap.app": {
					id: sapAppId,
					type: "application"
				},
				"sap.ui5": {},
				"sap.platform.abap": {
					uri: ""
				}
			}
		},
		createContent() {
			return null;
		}
	});
	const rootComponent = new Component(sapAppId);

	beforeEach(() => {
		resourceBundleCreateSpy = jest.spyOn(ResourceBundle, "create");
	});

	afterEach(() => {
		resourceBundleCreateSpy.mockRestore();
	});

	beforeAll(() => {
		windowSpy = jest.spyOn(window, "window", "get");
		getModelSpy = jest.spyOn(rootComponent, "getModel").mockImplementation(() => {
			return {
				isA: () => true,
				getResourceBundle: jest.fn().mockImplementation(() => {
					return {
						oUrlInfo: {
							url: "i18n.properties"
						}
					};
				})
			};
		});
	});

	afterAll(() => {
		windowSpy.mockRestore();
		getModelSpy.mockRestore();
	});

	test("returns the application info, object page", async () => {
		windowSpy.mockImplementation(() => ({
			hasher: {
				getHash: () => "test-intent&/testEntity('12345')"
			}
		}));
		resourceBundleCreateSpy.mockImplementation(() => {
			return {
				getText: (key: string) => {
					return i18nMap[key] || key;
				}
			};
		});

		const applicationInfo = await fetchApplicationInfo(rootComponent);
		expect(applicationInfo).toMatchObject({
			componentName: sapAppId,
			entitySet: "testEntity",
			context: "'12345'"
		});
	});

	test("returns the application info, other than object page", async () => {
		windowSpy.mockImplementation(() => ({
			hasher: {
				getHash: () => "test-intent"
			}
		}));

		resourceBundleCreateSpy.mockImplementation(() => {
			return {
				getText: (key: string) => {
					return i18nMap[key] || key;
				}
			};
		});

		const applicationInfo = await fetchApplicationInfo(rootComponent);
		expect(applicationInfo).toMatchObject({
			componentName: sapAppId,
			entitySet: "",
			context: ""
		});
	});

	test("ResourceBundle create method should be called, when isDesignMode option is true", async () => {
		windowSpy.mockImplementation(() => ({
			hasher: {
				getHash: () => "test-intent&/testEntity('12345')"
			}
		}));

		await fetchApplicationInfo(rootComponent, { isDesignMode: true });
		expect(resourceBundleCreateSpy).toHaveBeenCalled();
	});

	test("ResourceBundle create method should not be called, when isDesignMode option is false", async () => {
		windowSpy.mockImplementation(() => ({
			hasher: {
				getHash: () => "test-intent&/testEntity('12345')"
			}
		}));

		await fetchApplicationInfo(rootComponent, { isDesignMode: false });
		expect(resourceBundleCreateSpy).not.toHaveBeenCalled();
	});
});
