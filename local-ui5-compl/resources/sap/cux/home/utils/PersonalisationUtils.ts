/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import ManagedObject from "sap/ui/base/ManagedObject";
import BaseObject from "sap/ui/base/Object";
import Component from "sap/ui/core/Component";
import UIComponent from "sap/ui/core/UIComponent";

const defaultContainerId = "sap.cux";

/**
 *
 * Provides the util methods used for UshellPersonalizer.
 *
 * @extends sap.ui.BaseObject
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.122.0
 *
 * @private
 * @experimental Since 1.122
 * @hidden
 *
 * @alias sap.cux.home.utils.PersonalisationUtils
 */

class PersonalisationUtils extends BaseObject {
	public getPersContainerId(oManagedObject: ManagedObject) {
		return `${Component.getOwnerIdFor(oManagedObject)}--${defaultContainerId}`;
	}
	public getOwnerComponent(oManagedObject: ManagedObject) {
		return Component.getOwnerComponentFor(oManagedObject) as UIComponent | undefined;
	}
}

export default new PersonalisationUtils();
