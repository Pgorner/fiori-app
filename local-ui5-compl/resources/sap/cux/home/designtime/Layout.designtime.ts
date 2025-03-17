/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Control from "sap/ui/core/Control";
import Lib from "sap/ui/core/Lib";
import LayoutHandler from "../changeHandler/LayoutHandler";

const designtime = {
	actions: {
		remove: null,
		settings: {
			icon: "sap-icon://edit",
			name: (Lib.getResourceBundleFor("sap.cux.home.i18n") as ResourceBundle).getText("editCurrentPage"),
			isEnabled: true,
			handler: (oWrapperControl: Control, mPropertyBag: Record<string, unknown>) => {
				return LayoutHandler.loadPersonalizationDialog(oWrapperControl, mPropertyBag).then((aChanges) => {
					return aChanges;
				});
			}
		}
	}
};

export default designtime;
