/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/Device",
	"sap/ui/core/syncStyleClass",
	"sap/ui/core/Lib"
], function (jQuery, Device, syncStyleClass, coreLib) {
	"use strict";

	/**
	 * AstExpression renderer.
	 * @namespace
	 */
	var AstExpressionBasicRenderer = {
			apiVersion: 2
	};

	/**
	 * Renders the HTML for the given control, using the provided
	 * {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm
	 *            the RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl
	 *            the control to be rendered
	 */
	AstExpressionBasicRenderer.render = function (oRm, oControl) {

		//oRm.addClass("sapUiSizeCozy");
		if (oControl.getParent() instanceof jQuery){
			syncStyleClass("sapUiSizeCozy", oControl.getParent(), this.oControl);
		}
		var oBundle = coreLib.getResourceBundleFor("sap.rules.ui.i18n");
		var placeHolderText = oBundle.getText("ctrlSpaceCue");
		if(Device.os.name == "mac"){
			placeHolderText = oBundle.getText("optionSpaceCue");
		}
		if(placeHolderText.length>50 && oControl.getParent().getId() ===  "popover") {
			placeHolderText = placeHolderText.substring(0,50) + " ...";
		}

		var sEditable = "contenteditable=\"true\"";
		var sPlaceHolder = "data-placeholder=\"" + placeHolderText + "\"";
		var aAriaPlaceholder = "aria-placeholder=\"" + placeHolderText + "\"";
		oRm.openStart("div", oControl);
		oRm.class("sapAstExpressionInputWrapper");
		oRm.openEnd();
		oRm.openStart("pre");
		oRm.class("sapAstExpressionPreSpaceMargin");
		oRm.openEnd();
		
		oRm.openStart("div");
		oRm.accessibilityState(oControl, {
			role: "textbox",
			labelledBy:"",
			placeholder:placeHolderText
			
		});
		oRm.attr("id", oControl.getId() + "-input");
		oRm.attr("data-placeholder", placeHolderText);
		oRm.attr("contenteditable", "true");
		oRm.attr("spellcheck", "false");
		oRm.class("sapAstExpressionInput");
		oRm.openEnd();
		oRm.close("div");
		oRm.close("pre");
		oRm.close("div");

	};

	return AstExpressionBasicRenderer;

}, /* bExport= */ true);
