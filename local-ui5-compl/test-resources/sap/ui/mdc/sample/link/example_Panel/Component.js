/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * @fileOverview Application component to display information on entities from the TEA_BUSI OData service.
 * @version
 * @version@
 */
sap.ui.define([
	'sap/ui/core/UIComponent', 'sap/ui/fl/FakeLrepConnectorLocalStorage'
], function(UIComponent, FakeLrepConnectorLocalStorage) {
	"use strict";

	return UIComponent.extend("sap.ui.mdc.sample.link.example_Panel.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {
			FakeLrepConnectorLocalStorage.enableFakeConnector();
			UIComponent.prototype.init.apply(this, arguments);
		},
		exit: function() {
			FakeLrepConnectorLocalStorage.disableFakeConnector();
		}
	});
});
