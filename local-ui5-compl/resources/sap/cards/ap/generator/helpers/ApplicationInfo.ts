/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import Component from "sap/ui/core/Component";
import V2ODataModel from "sap/ui/model/odata/v2/ODataModel";
import V4ODataModel from "sap/ui/model/odata/v4/ODataModel";

type Model = V2ODataModel | V4ODataModel;

type ObjectPageApplicationInfo = {
	rootComponent: Component;
	floorPlan: string;
	odataModel: string;
	entitySet: string;
	serviceUrl: string;
	entitySetWithObjectContext: string;
	componentName: string;
	semanticObject: string;
	action: string;
};

export enum ODataModelVersion {
	V2 = "V2",
	V4 = "V4"
}

export type LibVersionInfo = {
	buildTimestamp: string;
	name: string;
	scmRevision: string;
	version: string;
};

export class ApplicationInfo {
	static instance: ApplicationInfo | null;
	_oDataModelVersion: ODataModelVersion;
	_rootComponent: Component;

	private constructor(rootComponent: Component) {
		this._rootComponent = rootComponent;
		const model = rootComponent.getModel() as Model;
		this._oDataModelVersion = model.isA<V4ODataModel>("sap.ui.model.odata.v4.ODataModel") ? ODataModelVersion.V4 : ODataModelVersion.V2;
	}

	public static createInstance(rootComponent: Component) {
		if (!ApplicationInfo.instance) {
			ApplicationInfo.instance = new ApplicationInfo(rootComponent);
		}
		return ApplicationInfo.instance;
	}

	public static getInstance() {
		if (ApplicationInfo.instance) {
			return ApplicationInfo.instance;
		}
		throw new Error("ApplicationInfo instance not found");
	}

	getRootComponent() {
		return this._rootComponent;
	}

	fetchDetails(): ObjectPageApplicationInfo {
		const model = this._rootComponent.getModel() as Model;
		const bODataV4 = this._oDataModelVersion === ODataModelVersion.V4;
		const serviceUrl = bODataV4 ? (model as V4ODataModel).getServiceUrl() : (model as V2ODataModel).sServiceUrl;
		const hash = window.hasher.getHash();
		const componentName = this._rootComponent.getManifest()["sap.app"].id;
		const [hashPartial] = hash.split("&/");
		const [semanticObject, action] = hashPartial.includes("?") ? hashPartial.split("?")[0].split("-") : hashPartial.split("-");

		let path = hash.split("&/")[1] || "";
		path = path.includes("/") ? path.split("/")[0] : path;

		if (path.startsWith("/")) {
			path = path.replace("/", "");
		}

		const index = path.indexOf("(");
		const entitySet = path.substring(0, index);

		return {
			rootComponent: this._rootComponent,
			floorPlan: "ObjectPage",
			odataModel: bODataV4 ? ODataModelVersion.V4 : ODataModelVersion.V2,
			entitySet,
			serviceUrl,
			entitySetWithObjectContext: path,
			componentName,
			semanticObject,
			action
		};
	}

	async validateCardGeneration() {
		if (!this._rootComponent || !(this._rootComponent instanceof Component)) {
			return false;
		}

		const mApplicationInfo = this.fetchDetails();
		if (!mApplicationInfo.serviceUrl || !mApplicationInfo.entitySet) {
			return false;
		}

		const entitySetWithContext = mApplicationInfo.entitySetWithObjectContext;
		if (!entitySetWithContext) {
			return false;
		}

		if (entitySetWithContext.indexOf("(") > -1) {
			const paranStart = entitySetWithContext.indexOf("(");
			const paranEnd = entitySetWithContext.indexOf(")");
			const sContext = entitySetWithContext.substring(paranStart + 1, paranEnd);
			if (!sContext) {
				return false;
			}
		} else {
			return false;
		}

		return true;
	}

	/**
	 * For testing purposes only
	 */
	_resetInstance() {
		ApplicationInfo.instance = null;
	}
}
