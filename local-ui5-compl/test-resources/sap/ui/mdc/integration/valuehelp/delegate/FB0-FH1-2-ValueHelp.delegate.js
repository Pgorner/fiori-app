/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"./ValueHelp.delegate",
	"sap/ui/mdc/valuehelp/content/Conditions"
], function(
	ODataV4ValueHelpDelegate,
	Conditions
) {
	"use strict";

	const ValueHelpDelegate = Object.assign({}, ODataV4ValueHelpDelegate);
	ValueHelpDelegate.apiVersion = 2;//CLEANUPD_DELEGATE

	ValueHelpDelegate.retrieveContent = function (oValueHelp, oContainer) {

		const aCurrentContent = oContainer && oContainer.getContent();
		let oCurrentContent = aCurrentContent && aCurrentContent[0];

		if (oContainer.isA("sap.ui.mdc.valuehelp.Dialog")) {

			if (!oCurrentContent) {

				oCurrentContent = new Conditions({
					title: "Define Conditions",
					shortTitle: "Conditions",
					label: "Label of Field"
				});

				oContainer.addContent(oCurrentContent);
			}
		}

		return Promise.resolve();
	};

	return ValueHelpDelegate;
});
