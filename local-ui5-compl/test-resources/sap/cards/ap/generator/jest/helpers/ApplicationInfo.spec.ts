/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import { ApplicationInfo, ODataModelVersion } from "sap/cards/ap/generator/helpers/ApplicationInfo";
import UIComponent from "sap/ui/core/UIComponent";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";

describe("ApplicationInfo", () => {
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
	rootComponent.setModel(new ODataModel("sap/opu/odata"));

	beforeEach(() => {
		windowSpy = jest.spyOn(window, "window", "get");
		windowSpy.mockImplementation(() => ({
			hasher: {
				getHash: () => "test-intent?salesOrder='1234'&/testEntity(12345)"
			}
		}));
	});

	afterEach(() => {
		ApplicationInfo.getInstance()._resetInstance();
		windowSpy.mockRestore();
	});

	it("should create a new instance if one does not exist", () => {
		const instance = ApplicationInfo.createInstance(rootComponent);
		expect(instance).toBeInstanceOf(ApplicationInfo);
	});

	it("should return the same instance if one already exists", () => {
		const firstInstance = ApplicationInfo.createInstance(rootComponent);
		const secondInstance = ApplicationInfo.createInstance(rootComponent);
		expect(firstInstance).toBe(secondInstance);
	});

	it("should return the root component", () => {
		const instance = ApplicationInfo.createInstance(rootComponent);
		expect(instance.getRootComponent()).toBe(rootComponent);
	});

	it("should set the correct ODataModelVersion", () => {
		const instance = ApplicationInfo.createInstance(rootComponent);
		expect(instance._oDataModelVersion).toBe(ODataModelVersion.V2);
	});

	it("should fetch the correct details", () => {
		const instance = ApplicationInfo.createInstance(rootComponent);
		const details = instance.fetchDetails();
		expect(details.rootComponent).toBe(rootComponent);
		expect(details.floorPlan).toBe("ObjectPage");
		expect(details.odataModel).toBe(ODataModelVersion.V2);
		expect(details.entitySet).toBe("testEntity");
		expect(details.serviceUrl).toBe("sap/opu/odata");
		expect(details.entitySetWithObjectContext).toBe("testEntity(12345)");
		expect(details.componentName).toBe(sId);
		expect(details.semanticObject).toBe("test");
		expect(details.action).toBe("intent");
	});

	it("should validate card generation", async () => {
		const instance = ApplicationInfo.createInstance(rootComponent);
		expect(await instance.validateCardGeneration()).toBe(true);
	});
});

describe("Invalidate Card Generation", () => {
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
	rootComponent.setModel(new ODataModel("sap/opu/odata"));

	afterEach(() => {
		ApplicationInfo.getInstance()._resetInstance();
		windowSpy.mockRestore();
	});

	it("should invalidate the card generation for non-object page", async () => {
		windowSpy = jest.spyOn(window, "window", "get");
		windowSpy.mockImplementation(() => ({
			hasher: {
				getHash: () => "test-intent&/testEntity"
			}
		}));

		const instance = ApplicationInfo.createInstance(rootComponent);
		expect(await instance.validateCardGeneration()).toBe(false);
	});

	it("should invalidate the card generation for unavailable object context", async () => {
		windowSpy = jest.spyOn(window, "window", "get");
		windowSpy.mockImplementation(() => ({
			hasher: {
				getHash: () => "test-intent&/testEntity()"
			}
		}));

		const instance = ApplicationInfo.createInstance(rootComponent);
		expect(await instance.validateCardGeneration()).toBe(false);
	});

	it("should invalidate the card generation when no entitySet is provided", async () => {
		windowSpy = jest.spyOn(window, "window", "get");
		windowSpy.mockImplementation(() => ({
			hasher: {
				getHash: () => "test-intent"
			}
		}));

		const instance = ApplicationInfo.createInstance(rootComponent);
		expect(await instance.validateCardGeneration()).toBe(false);
	});
});
