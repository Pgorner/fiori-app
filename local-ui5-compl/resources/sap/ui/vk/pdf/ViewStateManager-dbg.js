/*!
* SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
*/

sap.ui.define([
	"../svg/ViewStateManager"
], function(
	SvgViewStateManager
) {
	"use strict";

	const ViewStateManager = SvgViewStateManager.extend("sap.ui.vk.pdf.ViewStateManager", /** @lends sap.ui.vk.pdf.ViewStateManager.prototype */ {
		metadata: {
			library: "sap.ui.vk"
		}
	});

	const basePrototype = ViewStateManager.getMetadata().getParent().getClass().prototype;

	////////////////////////////////////////////////////////////////////////
	// Content connector handling begins.

	// Overridden sap.ui.vk.svg.ViewStateManager#_setContent.
	ViewStateManager.prototype._setContent = function(content) {
		// NOTE: `content` is expected to be an instance of `sap.ui.vk.pdf.Document`. The companion
		// sap.ui.vk.svg.Scene is accessible via property `content.scene`.
		return basePrototype._setContent.call(this, content?.scene);
	};

	// Content connector handling ends.
	////////////////////////////////////////////////////////////////////////

	return ViewStateManager;
});
