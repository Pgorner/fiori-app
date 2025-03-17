/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	'sap/m/Bar',
	'sap/m/Button'],
	function(Bar, Button) {
	"use strict";

	return {
		timeout : 1000,
		create : function() {
			return new Bar({
				contentLeft : [new Button({text:"test"})],
				contentMiddle : [new Button({text:"test"})],
				contentRight : [new Button({text:"test"})]
			});
		}
	};

});
