/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap*/
sap.ui.define([
	"sap/apf/modeler/ui/controller/cornerTexts",
	"sap/apf/modeler/ui/utils/nullObjectChecker",
	"sap/apf/modeler/ui/utils/textPoolHelper"
], function(BaseController, nullObjectChecker, textPoolHelper) {
	"use strict";
	function _getCornerText(oController, sCornerTextKey) {
		var oCornerText = sCornerTextKey && oController.oTextPool.get(sCornerTextKey);
		return oCornerText && oCornerText.TextElementDescription;
	}

	var representationCornerTexts = BaseController.extend("sap.apf.modeler.ui.controller.representationCornerTexts", {
		addStyleClasses : function() {
			var oController = this;
			oController.byId("idLeftUpper").addStyleClass("repLeftCornerText");
			oController.byId("idRightUpper").addStyleClass("repRightCornerText");
			oController.byId("idLeftLower").addStyleClass("repLeftCornerText");
			oController.byId("idRightLower").addStyleClass("repRightCornerText");
		},
		setChartIcon : function() {
			var oController = this;
			var sRepresentationType = oController.getView().getViewData().oParentObject.getRepresentationType();
			var oPicture = oController.getView().getViewData().oRepresentationTypeHandler.getPictureOfRepresentationType(sRepresentationType);
			oController.byId("idChartIcon").setSrc(oPicture);
			oController.byId("idChartIcon").addStyleClass("repChartIcon");
		},
		getTranslationFormatMap : function() {
			return textPoolHelper.TranslationFormatMap.REPRESENTATION_CORNER_TEXT;
		},
		getLeftUpperCornerText : function(sMethodName) {
			var oController = this;
			var sStepLeftUpperCornerTextKey = oController.getView().getViewData().oParentStep[sMethodName]();
			var sStepLeftUpperCornerText = _getCornerText(oController, sStepLeftUpperCornerTextKey);
			var sRepLeftUpperCornerTextKey = oController.getView().getViewData().oParentObject[sMethodName]();
			var sRepLeftUpperCornerText = _getCornerText(oController, sRepLeftUpperCornerTextKey);
			var sCornerText = nullObjectChecker.checkIsNotUndefined(sRepLeftUpperCornerText) ? sRepLeftUpperCornerText : sStepLeftUpperCornerText;
			return sCornerText;
		},
		getRightUpperCornerText : function(sMethodName) {
			var oController = this;
			var sStepRightUpperCornerTextKey = oController.getView().getViewData().oParentStep[sMethodName]();
			var sStepRightUpperCornerText = _getCornerText(oController, sStepRightUpperCornerTextKey);
			var sRepRightUpperCornerTextKey = oController.getView().getViewData().oParentObject[sMethodName]();
			var sRepRightUpperCornerText = _getCornerText(oController, sRepRightUpperCornerTextKey);
			var sCornerText = nullObjectChecker.checkIsNotUndefined(sRepRightUpperCornerText) ? sRepRightUpperCornerText : sStepRightUpperCornerText;
			return sCornerText;
		},
		getLeftLowerCornerText : function(sMethodName) {
			var oController = this;
			var sStepLeftLowerCornerTextKey = oController.getView().getViewData().oParentStep[sMethodName]();
			var sStepLeftLowerCornerText = _getCornerText(oController, sStepLeftLowerCornerTextKey);
			var sRepLeftLowerCornerTextKey = oController.getView().getViewData().oParentObject[sMethodName]();
			var sRepLeftLowerCornerText = _getCornerText(oController, sRepLeftLowerCornerTextKey);
			var sCornerText = nullObjectChecker.checkIsNotUndefined(sRepLeftLowerCornerText) ? sRepLeftLowerCornerText : sStepLeftLowerCornerText;
			return sCornerText;
		},
		getRightLowerCornerText : function(sMethodName) {
			var oController = this;
			var sStepRightLowerCornerTextKey = oController.getView().getViewData().oParentStep[sMethodName]();
			var sStepRightLowerCornerText = _getCornerText(oController, sStepRightLowerCornerTextKey);
			var sRepRightLowerCornerTextKey = oController.getView().getViewData().oParentObject[sMethodName]();
			var sRepRightLowerCornerText = _getCornerText(oController, sRepRightLowerCornerTextKey);
			var sCornerText = nullObjectChecker.checkIsNotUndefined(sRepRightLowerCornerText) ? sRepRightLowerCornerText : sStepRightLowerCornerText;
			return sCornerText;
		}
	});

	return representationCornerTexts;
}, true);