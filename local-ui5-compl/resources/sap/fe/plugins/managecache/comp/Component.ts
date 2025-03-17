import type ResourceBundle from "sap/base/i18n/ResourceBundle";
import UIComponent from "sap/ui/core/UIComponent";
import CacheManager from "sap/ui/core/cache/CacheManager";
import View from "sap/ui/core/mvc/View";
import ViewType from "sap/ui/core/mvc/ViewType";
import JSONModel from "sap/ui/model/json/JSONModel";
import i18nModel from "sap/ui/model/resource/ResourceModel";
import type RequestSettingsController from "./controller/settings.controller";

export type Scope = {
	validity: string;
	keyCategory: string;
	writeFrequency: string;
	clientStorageAllowed: boolean;
};
export type PersonalizationId = {
	container: string;
	item: string;
};
export type CustomScopeConstants = {
	constants: {
		keyCategory: {
			FIXED_KEY: string;
			GENERATED_KEY: string;
		};
		writeFrequency: {
			HIGH: string;
			LOW: string;
		};
	};
	getPersonalizer: (
		personalizationId: PersonalizationId,
		scope: Scope
	) => Promise<{
		getPersData: () => Promise<{ period: number } | undefined>;
		setPersData: (arg: object) => Promise<object>;
	}>;
};

export type PersonalizationConstants = {
	keyCategory: {
		FIXED_KEY: string;
		GENERATED_KEY: string;
	};
	writeFrequency: {
		HIGH: string;
		LOW: string;
	};
};

export type ShellContainer = {
	getServiceAsync(arg: string): Promise<CustomScopeConstants>;
	getRenderer(): {
		addUserPreferencesGroupedEntry(arg: {
			onSave: () => Promise<void>;
			groupingId: string;
			onCancel: () => void;
			icon: string;
			groupingTabHelpId: string;
			title: string;
			entryHelpId: string;
			groupingTabTitle: string;
			value: () => Promise<Awaited<string>>;
			content: () => Promise<View>;
		}): Promise<void>;
	};
};

class RequestSettingsComponent extends UIComponent {
	viewInstance!: View;

	personalizationService!: CustomScopeConstants;

	model!: JSONModel;

	personalizationId!: PersonalizationId;

	scope!: Scope;

	private waitInit!: Promise<void>;

	public async getWaitInit(): Promise<void> {
		return this.waitInit;
	}

	public async init(): Promise<void> {
		let resolveFunction!: () => void;
		super.init();
		this.waitInit = new Promise<void>((resolve) => {
			resolveFunction = resolve;
		});
		const container = sap.ui.require("sap/ushell/Container") as ShellContainer;
		const personalizationService = (await container.getServiceAsync("PersonalizationV2")) as unknown as CustomScopeConstants;
		this.model = new JSONModel({});
		this.personalizationService = personalizationService;
		this.scope = {
			clientStorageAllowed: false,
			keyCategory: (personalizationService.constants as PersonalizationConstants).keyCategory.FIXED_KEY,
			validity: "Infinity",
			writeFrequency: (personalizationService.constants as PersonalizationConstants).writeFrequency.LOW
		};
		this.personalizationId = {
			container: "sap.ushell.optimisticreq.personalization",
			item: "data"
		};
		const period = await this._getPersonalizedPeriod(personalizationService);
		// Remove old managecache entries via cache manager
		const timeStamp = new Date(Date.now() - period * 86400000);
		const filters: { olderThan: Date; prefix: string } = {
			olderThan: timeStamp,
			prefix: "sap.ui.model.odata.v4.managecache"
		};
		CacheManager.delWithFilters(filters);
		// Enhance user activities section with optimistic batch settings
		await this._createActivitiesSection();
		resolveFunction();
	}

	async _getPersonalizedPeriod(personalizationService: CustomScopeConstants): Promise<number> {
		const personalizer = await personalizationService.getPersonalizer(this.personalizationId, this.scope);
		const personalizationContainer = await personalizer.getPersData();
		// Use personalization service to get/set period
		let period = personalizationContainer?.period;
		period ??= 30;
		this.model.setProperty("/period", period);
		this.model.setProperty("/oldperiod", period);
		return period;
	}

	async _setPersonalizedPeriod(personalizationService: CustomScopeConstants, period: { period: number }): Promise<object> {
		const personalizer = await personalizationService.getPersonalizer(this.personalizationId, this.scope);
		return personalizer.setPersData(period);
	}

	async _createActivitiesSection(): Promise<void> {
		const i18n = new i18nModel({ bundleName: "sap.fe.plugins.managecache.comp.i18n.messagebundle" });
		const viewType = ViewType.XML;
		const viewSettings = {
			type: viewType,
			id: "requestCacheView",
			viewName: "sap.fe.plugins.managecache.comp.view.settings"
		};
		const container = sap.ui.require("sap/ushell/Container") as ShellContainer;
		const frameBoundExtension = (await container.getServiceAsync("FrameBoundExtension")) as unknown as {
			addGroupedUserSettingsEntry: (settings: unknown) => Promise<void>;
		};
		await frameBoundExtension.addGroupedUserSettingsEntry({
			title: (i18n.getResourceBundle() as ResourceBundle).getText("T_GROUP"),
			icon: "sap-icon://laptop",
			entryHelpId: "userActivitiesEntry",
			groupingId: "userActivities",
			groupingTabTitle: (i18n.getResourceBundle() as ResourceBundle).getText("title"),
			groupingTabHelpId: "requestCacheUserActivities-helpId",
			value: async function () {
				return Promise.resolve("Request Cache"); //check
			},
			content: async () => {
				return View.create(viewSettings).then((view: View) => {
					view.setModel(this.model);
					view.setModel(i18n, "i18n");
					this.viewInstance = view;
					return this.viewInstance;
				});
			},
			onSave: async () => {
				const period = this.model.getProperty("/period") as unknown as number;
				await this._setPersonalizedPeriod(this.personalizationService, { period: period });
				return (this.viewInstance.getController() as RequestSettingsController).onSave(period);
			},
			onCancel: () => {
				return (this.viewInstance.getController() as RequestSettingsController).onCancel();
			}
		});
	}
}
export default RequestSettingsComponent;
