/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Component from "sap/ui/core/Component";
import { default as V2ODataModel } from "sap/ui/model/odata/v2/ODataModel";
import { default as V4ODataModel } from "sap/ui/model/odata/v4/ODataModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

export enum ODataModelVersion {
	V2 = "V2",
	V4 = "V4"
}

type ODataModel = V2ODataModel | V4ODataModel;

export type ApplicationInfo = {
	appModel: ODataModel;
	odataModel: ODataModelVersion;
	entitySet: string;
	context: string;
	entitySetWithObjectContext: string;
	componentName: string;
	resourceBundle: ResourceBundle;
	semanticObject: string;
	action: string;
};

type ResourceBundleWithURL = ResourceBundle & { oUrlInfo: { url: string } };
type FetchApplicationInfoOptions = {
	isDesignMode?: boolean;
};

type ManifestContentSapCardsAP = {
	embeds: {
		ObjectPage?: {
			default: string;
			manifests: {
				[key: string]: Array<{
					localUri: string;
					hideActions: boolean;
				}>;
			};
		};
	};
};

export type AppManifest = {
	"sap.app": {
		id: string;
	};
	"sap.ui5": {};
	"sap.ui": {};
	"sap.fe"?: {};
	"sap.platform.abap"?: {
		uri: string;
	};
	"sap.cards.ap"?: ManifestContentSapCardsAP;
};

/**
 * Fetches the details of the application
 *
 * @param {Component} rootComponent - The root component of the application
 * @param {FetchApplicationInfoOptions} fetchOptions
 * @returns {Promise<ApplicationInfo>} The application info
 */
export const fetchApplicationInfo = async function (
	rootComponent: Component,
	fetchOptions?: FetchApplicationInfoOptions
): Promise<ApplicationInfo> {
	const isDesignMode = fetchOptions?.isDesignMode || false;
	const componentName = (rootComponent.getManifest() as AppManifest)["sap.app"].id;
	const model = rootComponent.getModel() as ODataModel;
	const hash = window.hasher.getHash();
	const [hashPartial] = hash.split("&/");
	const [semanticObject, action] = hashPartial.includes("?") ? hashPartial.split("?")[0].split("-") : hashPartial.split("-");

	let path = hash.split("&/")[1] || "";
	path = path.includes("/") ? path.split("/")[0] : path;
	path = path.startsWith("/") ? path.slice(1) : path;

	const index = path.indexOf("(");
	const entitySet = index > -1 ? path.substring(0, index) : path;
	const context = index > -1 ? path.substring(index + 1, path.indexOf(")")) : "";
	const odataModel = model.isA<V4ODataModel>("sap.ui.model.odata.v4.ODataModel") ? ODataModelVersion.V4 : ODataModelVersion.V2;
	const i18nModel = (rootComponent.getModel("i18n") || rootComponent.getModel("@i18n")) as ResourceModel;
	let resourceBundle = await i18nModel.getResourceBundle();

	if (isDesignMode) {
		/* Refreshing or destroying the i18nModel does not fetch the latest values because of caching.
		For cache busting, we are appending a unique identifier to the i18nBundleUrl to fetch the latest i18n values everytime dialog is opened. */
		const i18nBundleUrl = (resourceBundle as ResourceBundleWithURL)?.oUrlInfo?.url;
		const timeStamp = Date.now();

		resourceBundle = await ResourceBundle.create({
			url: `${i18nBundleUrl}?v=${timeStamp}`,
			async: true
		});
	}

	return {
		odataModel,
		appModel: model,
		entitySet,
		entitySetWithObjectContext: path,
		context,
		componentName,
		resourceBundle,
		semanticObject,
		action
	} as ApplicationInfo;
};
