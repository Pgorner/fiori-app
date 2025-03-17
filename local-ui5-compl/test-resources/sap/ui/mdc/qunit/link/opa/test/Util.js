/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * @namespace Provides utility functions for OPA tests
 * @name sap.ui.mdc.qunit.link.opa.test.Util
 * @author SAP SE
 * @version 1.132.1
 * @private
 * @since 1.30.0
 */
sap.ui.define([
	'sap/ui/base/Object', 'sap/m/library', 'sap/ui/core/Lib'
], function(BaseObject, MLibrary, Library) {
	"use strict";

	const Util = BaseObject.extend("sap.ui.mdc.qunit.link.opa.test.Util", /** @lends sap.ui.mdc.qunit.link.opa.test.Util.prototype */
	{});

	Util.getTextFromResourceBundle = function(sLibraryName, sTextKey) {
		return Library.getResourceBundleFor(sLibraryName).getText(sTextKey);
	};

	return Util;
});
