sap.ui.define([
	"sap/ui/core/Control",
	"sap/ui/comp/smartvariants/SmartVariantManagement",
	"sap/ui/comp/smartvariants/PersonalizableInfo",
	"sap/base/Log"
], function (Control, SmartVariantManagement, PersonalizableInfo, Log) {
	"use strict";
	var oVariantManagement = Control.extend("gantt.demo.GanttCustomVariantManagement.GanttVariantControl", {

		standardVariantKey: "*standard*",

		metadata: {
			properties: {
				persistencyKey: {
					type: "string",
					defaultValue: "GanttPersistencyKey"
				}
			}
		},
		fnAddPersonalizableControl: function (oController) {
			this.oSmartVariant = oController.oSmartVariant;
			this.oController = oController;
			var oPersonalizableInfo = new PersonalizableInfo({
				type: "GanttControls",
				keyName: "persistencyKey",
				control: this
			});
			this.oSmartVariant.addPersonalizableControl(oPersonalizableInfo);
			this.oSmartVariant.attachInitialise(this.fnInitialiseVariants.bind(this));
			this.oSmartVariant.attachSelect(this.fnOnSelectVariant.bind(this));
			this.oSmartVariant.initialise(function () {
				this._bJustInitialized = true;
			}, this);
		},
		fnInitialiseVariants: function () {
			return;
		},
		fetchVariant: function () {
			var oVariant;
			if (this._bJustInitialized === true) {
				this._bJustInitialized = false; // Fetch callback is triggered on initial app load to handle standard variant. For non-standard variants, the apply function is called by SVM framework
			} else {
				oVariant = this.fnFetchGanttVariant();
			}
			return oVariant;
		},
		applyVariant: function (oVariants) {
			this.fnApplyGanttVariant(oVariants);
		},
		fnOnSelectVariant: function (oVariant) {
			if (oVariant.getParameter("key") === oVariant.getSource().getStandardVariantKey()) {
				delete this.oController.oCustomVariantData.printConfig;
				delete this.oController.oCustomVariantData.printConfigSinglePage;
			}
		},
		fnFetchGanttVariant: function () {
			var oVariant = {};
			var oController = this.oController;
			var iZoomLevel = oController.oGanttContainer.getGanttCharts()[0].getAxisTimeStrategy().getZoomLevel();
			this.printConfigSinglePage = oController.oCustomVariantData.printConfigSinglePage;
			this.printConfig = oController.oCustomVariantData.printConfig;
			oVariant = {
				zoomLevel: iZoomLevel,
				printConfig: this.printConfig,
				printConfigSinglePage: this.printConfigSinglePage
			};
			return oVariant;
		},
		fnApplyGanttVariant: function (oVariant) {
			if (oVariant) {
				this.oController.oGanttContainer.getGanttCharts()[0].getAxisTimeStrategy().setZoomLevel(oVariant.zoomLevel);
				delete this.oController.oCustomVariantData.printConfig;
				delete this.oController.oCustomVariantData.printConfigSinglePage;
				this.oController.oCustomVariantData.printConfig = oVariant.printConfig;
				this.oController.oCustomVariantData.printConfigSinglePage = oVariant.printConfigSinglePage;
			}
		}
	});

	return oVariantManagement;

});