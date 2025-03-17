/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */
sap.ui.define([
	'sap/apf/modeler/ui/utils/constants',
	'sap/apf/utils/exportToGlobal',
	'sap/ui/core/mvc/Controller',
	'sap/ui/core/mvc/View',
	'sap/ui/core/mvc/ViewType'
], function(ModelerConstant, exportToGlobal, Controller, View, ViewType) {
	'use strict';

	/**
	 * Creates a view of PropertyType of one of its subclasses.
	 *
	 * @param {object} oViewData
	 * @param {string} oViewData.sPropertyType
	 * @param {string} sViewId
	 * @returns {Promise<sap.ui.core.mvc.View>}
	 * @alias sap.apf.modeler.ui.utils.PropertyTypeFactory
	 * @private
	 * @ui5-restricted sap.apf.modeler.ui.controller.propertyTypeHandler
	 */
	async function createPropertyTypeView(oViewData, sViewId) {
		var sViewName = "sap.apf.modeler.ui.view.propertyType",
			sControllerName;

		switch (oViewData.sPropertyType) {
			case ModelerConstant.propertyTypes.DIMENSION:
				sControllerName = "sap.apf.modeler.ui.controller.representationDimension";
				break;
			case ModelerConstant.propertyTypes.MEASURE:
				sControllerName = "sap.apf.modeler.ui.controller.representationMeasure";
				break;
			case ModelerConstant.propertyTypes.LEGEND:
				sControllerName = "sap.apf.modeler.ui.controller.representationLegend";
				break;
			case ModelerConstant.propertyTypes.PROPERTY:
				sControllerName = "sap.apf.modeler.ui.controller.representationProperty";
				break;
			case ModelerConstant.propertyTypes.HIERARCHIALCOLUMN:
				sControllerName = "sap.apf.modeler.ui.controller.representationHierarchyProperty";
				break;
			case ModelerConstant.propertyTypes.REPRESENTATIONSORT:
				sViewName = "sap.apf.modeler.ui.view.sortPropertyType";
				sControllerName = "sap.apf.modeler.ui.controller.representationSortPropertyType";
				break;
			case ModelerConstant.propertyTypes.STEPSORT:
				sViewName = "sap.apf.modeler.ui.view.sortPropertyType";
				sControllerName = "sap.apf.modeler.ui.controller.stepSortPropertyType";
				break;
			default:
				return Promise.resolve(undefined);
		}
		return View.create({
			viewName : sViewName,
			type : ViewType.XML,
			id : sViewId,
			viewData : oViewData,
			controller : await Controller.create({
				name: sControllerName
			})
		});
	}

	// compatiblity export to global, differs from module export
	exportToGlobal("sap.apf.modeler.ui.utils.PropertyTypeFactory", createPropertyTypeView);

	return { // expose as static method
		createPropertyTypeView: createPropertyTypeView
	};
}, true /*GLOBAL_EXPORT*/);