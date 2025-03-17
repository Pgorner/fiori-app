/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	'sap/ui/base/ManagedObject'
], function (ManagedObject) {
    "use strict";
    /**
	 * Creates and initializes a new print dialog template class.
	 *
	 * @param {string} [sId] ID of the new control, it is generated automatically if no ID is provided.
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Enables the user to define print dialog footer buttons.
     * Print dialog template offers an option to provide custom buttons for the print dialog footer.
	 * @extends sap.ui.base.ManagedObject
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 *
	 * @constructor
	 * @public
     * @since 1.127
	 * @alias sap.gantt.simple.PrintDialogTemplate
     */
    var PrintDialogTemplate = ManagedObject.extend("sap.gantt.simple.PrintDialogTemplate", {
        metadata: {
            aggregations: {
                footerButtons: { type: "sap.m.Button", multiple: true }
            }
        }
    });
    return PrintDialogTemplate;
}, true);