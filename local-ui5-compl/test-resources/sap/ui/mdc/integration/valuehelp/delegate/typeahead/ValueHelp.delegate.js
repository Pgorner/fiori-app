/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"../ValueHelp.delegate"
], function(
	BaseValueHelpDelegate
) {
	"use strict";

	const ValueHelpDelegate = Object.assign({}, BaseValueHelpDelegate);

	ValueHelpDelegate.showTypeahead = function (oPayload, oContent, oConfig) {
		const sShowTypeahead = oContent.getModel("settings").getData().showTypeahead;

		/*eslint-disable-next-line no-new-func*/
		const fnShowTypeahead = new Function('oValueHelp', 'oContent',`return (${sShowTypeahead})(oValueHelp, oContent)`);

		return fnShowTypeahead ? fnShowTypeahead.apply(this, arguments) : BaseValueHelpDelegate.showTypeahead.apply(this, arguments);
	};

	return ValueHelpDelegate;
});
