/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Log from "sap/base/Log";
import BaseObject from "sap/ui/base/Object";
import CustomData from "sap/ui/core/CustomData";
import Lib from "sap/ui/core/Lib";
import HashChanger from "sap/ui/core/routing/HashChanger";
import UIComponent from "sap/ui/core/UIComponent";
import FeaturesAPI from "sap/ui/fl/write/api/FeaturesAPI";
import startKeyUserAdaptation from "sap/ui/rta/api/startKeyUserAdaptation";
import Container from "sap/ushell/Container";
import EventHub from "sap/ushell/EventHub";
import URLParsing from "sap/ushell/services/URLParsing";
import { UserActionProperties } from "../Layout";

export default class KeyUserPersonalization extends BaseObject {
	private component!: UIComponent | undefined;
	private i18nBundle!: ResourceBundle;
	private adaptationData!: object | string;

	constructor(component: UIComponent | undefined, i18nBundle: ResourceBundle) {
		super();

		this.component = component;
		this.i18nBundle = i18nBundle;

		EventHub.on("keyUserAdaptationDataChange").do(() => {
			const adaptationCustomData = this.component?.byId("sectionWrapper")?.getAggregation("adaptationData") as CustomData;
			if (adaptationCustomData) {
				this.adaptationData = adaptationCustomData.getValue() as object | string;

				// parse adaptation data if string
				if (typeof this.adaptationData === "string") {
					this.adaptationData = JSON.parse(this.adaptationData) as object;
					adaptationCustomData.setValue(this.adaptationData);
				}
			}
		});
	}

	public async getRTAUserAction(): Promise<UserActionProperties | undefined> {
		try {
			await Lib.load({ name: "sap.ui.fl" });
			const isKeyUser = await FeaturesAPI.isKeyUser();
			let rtaUserActionProperties: UserActionProperties | undefined;

			if (isKeyUser) {
				rtaUserActionProperties = {
					id: `${this.component?.getId()}-s4MyHomeAdaptUIBtn`,
					icon: "sap-icon://wrench",
					text: this.i18nBundle.getText("adaptUIBtn") as string,
					tooltip: this.i18nBundle.getText("adaptUIBtn") as string,
					press: () => this.triggerRTA()
				};
			}

			return Promise.resolve(rtaUserActionProperties);
		} catch (error: unknown) {
			Log.error(error instanceof Error ? error.message : (error as string));
			return;
		}
	}

	private async triggerRTA() {
		try {
			await Lib.load({ name: "sap.ui.fl" });
			if (this.component) {
				startKeyUserAdaptation({ rootControl: this.component }).catch(async () => {
					const URLParsingService = await Container.getServiceAsync<URLParsing>("URLParsing");
					const hashChangerInstance = HashChanger.getInstance();
					//Trigger Manual Reload of Application in case of failure
					const shellHash = URLParsingService.parseShellHash(hashChangerInstance.getHash());
					const hashParams = (shellHash?.params || {}) as Record<string, unknown>;
					const rtaKey = "sap-ui-fl-max-layer";
					const value = "CUSTOMER";

					if (!Object.prototype.hasOwnProperty.call(hashParams, rtaKey)) {
						hashParams[rtaKey] = value;
						hashChangerInstance.replaceHash(URLParsingService.constructShellHash(shellHash), "Unknown");
					}

					window.location.reload();
				});
			}
		} catch (error: unknown) {
			Log.error(error instanceof Error ? error.message : (error as string));
			return;
		}
	}
}
