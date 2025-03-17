/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	'sap/m/Page',
	'sap/m/Toolbar',
	'sap/m/Button',
	'sap/ui/layout/VerticalLayout'],
	function(Page, Toolbar, Button, VerticalLayout) {
	"use strict";

	return {
		create : function() {
			return new Page({
				headerContent : [new Button({text:"test"})],
				subHeader : new Toolbar(),
				footer : new Toolbar()
			});
		}
	};

});
