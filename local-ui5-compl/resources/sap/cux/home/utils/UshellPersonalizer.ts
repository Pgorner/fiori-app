/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import BaseObject from "sap/ui/base/Object";
import Container from "sap/ushell/Container";
import { IAppPersonalization } from "../interface/AppsInterface";
import { IPage } from "../interface/PageSpaceInterface";

interface IPersonalizer {
	getPersData: () => Promise<IPersonalizationData>;
	setPersData: (oData: object) => Promise<void>;
}

export interface IPersonalizationData {
	oAdaptationData?: { showCustomNewsFeed: boolean; customNewsFeedKey: string };
	favNewsFeed?: { items: string[]; showAllPreparationRequired: boolean };
	favouritePages?: IPage[] | [];
	favoriteApps?: IAppPersonalization[];
	showRecommendation?: boolean;
}

/**
 *
 * Provides the UshellPersonalizer Class used for fetch and update end user (Ushell) personalisation.
 *
 * @extends sap.ui.BaseObject
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.121.0
 *
 * @private
 * @experimental Since 1.121
 * @hidden
 *
 * @alias sap.cux.home.utils.UshellPersonalizer
 */
export default class UShellPersonalizer extends BaseObject {
	private persContainerId: string;
	private oOwnerComponent: object;
	private oPersonalizer!: IPersonalizer;
	static oCacheInstances: { [key: string]: UShellPersonalizer } = {};

	private constructor(persContainerId: string, oOwnerComponent: object) {
		super();
		this.persContainerId = persContainerId;
		this.oOwnerComponent = oOwnerComponent;
	}

	static async getInstance(persContainerId: string, oOwnerComponent: object) {
		if (UShellPersonalizer.oCacheInstances[persContainerId]) {
			return Promise.resolve(UShellPersonalizer.oCacheInstances[persContainerId]);
		}
		const UShellPersonalizerInstance = new UShellPersonalizer(persContainerId, oOwnerComponent);
		await UShellPersonalizerInstance.init();
		UShellPersonalizer.oCacheInstances[persContainerId] = UShellPersonalizerInstance;
		return UShellPersonalizer.oCacheInstances[persContainerId];
	}

	public async init() {
		const oPersonalizationService: {
				constants: {
					keyCategory: { FIXED_KEY: string };
					writeFrequency: { LOW: string };
				};
				getPersonalizer: (id: { container: string; item: string }, oScope: object, oOwnerComponent: object) => IPersonalizer;
			} = await Container.getServiceAsync("Personalization"),
			oScope = {
				keyCategory: oPersonalizationService?.constants?.keyCategory?.FIXED_KEY,
				writeFrequency: oPersonalizationService?.constants?.writeFrequency?.LOW,
				clientStorageAllowed: true
			},
			oPersId = {
				container: this.persContainerId,
				item: "settings"
			};
		this.oPersonalizer = oPersonalizationService?.getPersonalizer(oPersId, oScope, this.oOwnerComponent);
	}

	public async write(oData: IPersonalizationData) {
		await this.oPersonalizer?.setPersData(oData);
		return "success";
	}
	public async read(): Promise<IPersonalizationData> {
		const oData = await this.oPersonalizer.getPersData();
		return oData;
	}
}
