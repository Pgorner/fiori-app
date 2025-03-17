/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	'sap/m/CustomListItem',
	'sap/m/Button'],
	function(CustomListItem, Button) {
	"use strict";

	return {
		create : function() {
			return new CustomListItem({
				content : [new Button({text:"test"})]
			});
		}
	};

});
