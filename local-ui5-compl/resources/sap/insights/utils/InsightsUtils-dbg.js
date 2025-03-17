/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
    "sap/ui/core/Lib"
], function (CoreLib) {
    "use strict";
    return {
        getResourceBundle:  function () {
            if (!this.i18nBundle) {
                this.i18nBundle = CoreLib.getResourceBundleFor("sap.insights");
            }
            return this.i18nBundle;
        }
    };
});