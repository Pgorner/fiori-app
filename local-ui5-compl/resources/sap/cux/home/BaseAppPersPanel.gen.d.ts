declare module "sap/cux/home/BaseAppPersPanel" {
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $BaseAppPanelSettings } from "./BaseAppPanel";
	/**
	 * Interface defining the settings object used in constructor calls
	 */
	interface $BaseAppPersPanelSettings extends $BaseAppPanelSettings {
		persContainerId?: string | PropertyBindingInfo;
	}

	export default interface BaseAppPersPanel {
		// property: persContainerId

		/**
		 * Gets current value of property "persContainerId".
		 *
		 * Default value is: ""
		 * @returns Value of property "persContainerId"
		 */
		getPersContainerId(): string;

		/**
		 * Sets a new value for property "persContainerId".
		 *
		 * When called with a value of "null" or "undefined", the default value of the property will be restored.
		 *
		 * Default value is: ""
		 * @param [persContainerId=""] New value for property "persContainerId"
		 * @returns Reference to "this" in order to allow method chaining
		 */
		setPersContainerId(persContainerId: string): this;
	}
}
