/*!
* OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/

sap.ui.define([
	'sap/base/util/deepExtend',
	'sap/ui/Device',
	'sap/ui/core/mvc/View',
	'sap/ui/model/json/JSONModel'
], function (deepExtend, Device, View, JSONModel) {
	"use strict";
	function create(oViewSettings, oModel, oComp) {
		var oMetaModel = oModel.getMetaModel(),
		oDeviceModel = new JSONModel(Device);
		oDeviceModel.setDefaultBindingMode("OneWay");

		return oMetaModel.requestObject("/").then(function() {
			oViewSettings.preprocessors = deepExtend({
				xml: {
					bindingContexts: {
					},
					models: {
						'sap.ui.mdc.metaModel': oMetaModel,
						'sap.ui.mdc.deviceModel': oDeviceModel
					}
				}
			}, oViewSettings.preprocessors);
			oViewSettings.type = "XML";
			var oViewPromise;
			oComp.runAsOwner(function(){
				oViewPromise = View.create(oViewSettings);
				oViewPromise.then(function(oView){
					oComp._addContent(oView);
					return oView;
				});

			});
			return oViewPromise;
		});
	}
	var viewFactory = {
		create: create
	};
	return viewFactory;
});