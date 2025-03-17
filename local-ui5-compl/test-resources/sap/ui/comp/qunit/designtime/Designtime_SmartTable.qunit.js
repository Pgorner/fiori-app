/* global QUnit */
sap.ui.define([
	"sap/ui/comp/smarttable/SmartTable",
	"sap/m/Table",
	"sap/m/Column",
	"sap/ui/table/Table",
	"sap/ui/table/Column",
	"sap/m/VBox"
], function(SmartTable, ResponsiveTable, ResponsiveTableColumn, GridTable, GridTableColumn, VBox){
	"use strict";

	QUnit.module("SmartTable - Designtime", {
		beforeEach: function() {
			this.oResponsiveColumn = new ResponsiveTableColumn();
			this.oResponsiveTable = new ResponsiveTable({
				columns: [this.oResponsiveColumn]
			});
			this.oSmartTable_Responsive = new SmartTable({
				entitySet: "foo",
				tableType: "ResponsiveTable",
				items: this.oResponsiveTable
			});

			this.oMetadata = this.oSmartTable_Responsive.getMetadata();

			this.oGridColumn = new GridTableColumn();
			this.oGridTable = new GridTable({
				columns: [this.oGridColumn]
			});
			this.oSmartTable_Grid = new SmartTable({
				entitySet: "foo",
				tableType: "Table",
				items: this.oGridTable
			});

			this.fExecuteWhenDesigntimeIsLoaded = function(assert, fDoIt) {
				var fDone = assert.async();
				this.oMetadata.loadDesignTime().then(function(mDesignTimeMetadata) {
					fDoIt.apply(this, [mDesignTimeMetadata, fDone]);
				}.bind(this));
			}.bind(this);

			this.testAllowedProperties = function(assert, oElement, aAllowedProperties, mPropertySettings) {
				var mAllProperties = oElement.getMetadata().getAllProperties();
				for (var key in mAllProperties) {
					var oPropInfo = mPropertySettings[mAllProperties[key].name];
					if (aAllowedProperties.indexOf(mAllProperties[key].name) >= 0) {
						assert.ok(!oPropInfo || oPropInfo.ignore === false, "Property '" + mAllProperties[key].name + "' is allowed.");
					} else {
						assert.ok(oPropInfo && oPropInfo.ignore === true, "Property '" + mAllProperties[key].name + "' is not allowed.");
					}
				}
			};
		},
		teardown: function() {
			this.oSmartTable_Responsive.destroy();
			this.oSmartTable_Responsive = null;
			this.oSmartTable_Grid.destroy();
			this.oSmartTable_Grid = null;

			this.oMetadata = null;

			this.oResponsiveColumn = null;
			this.oResponsiveTable = null;
			this.oGridColumn = null;
			this.oGridTable = null;
		}
	});

	QUnit.test("Designtime annotations for SmartTable defined", function(assert) {
		this.fExecuteWhenDesigntimeIsLoaded(assert, function(mDesignTimeMetadata, fDone) {
			assert.ok(!!mDesignTimeMetadata.annotations);
			fDone();
		});
	});

	QUnit.test("Test allowed properties for adaptation (e.g. Visual Editor) - SmartTable", function(assert) {
		this.fExecuteWhenDesigntimeIsLoaded(assert, function(mDesignTimeMetadata, fDone) {
			// Currently all properties from VBox are enabled. Does this make sense?
			var mAllVBoxProperties = VBox.getMetadata().getAllProperties();
			var aVBoxPropertyNames = [];
			for (var key in mAllVBoxProperties) {
				aVBoxPropertyNames.push(mAllVBoxProperties[key].name);
			}

			this.testAllowedProperties(assert, this.oSmartTable_Responsive, [
				"ignoredFields", "initiallyVisibleFields", "customizeConfig", "ignoreFromPersonalisation", "showVariantManagement", "useExportToExcel",
				"enableExport","exportType", "enableCopy", "showTablePersonalisation", "showRowCount", "header", "placeToolbarInTable", "editable", "enableAutoBinding",
				"tableBindingPath", "demandPopin", "useInfoToolbar", "showDetailsButton", "enableAutoColumnWidth", "showPasteButton",
				"detailsButtonSetting", "headerLevel", "useColumnLabelsAsTooltips"
			].concat(aVBoxPropertyNames), mDesignTimeMetadata.properties);
			fDone();
		});
	});

	QUnit.test("Test allowed properties for adaptation (e.g. Visual Editor) - inner ResponsiveTable", function(assert) {
		this.fExecuteWhenDesigntimeIsLoaded(assert, function(mDesignTimeMetadata, fDone) {
			this.testAllowedProperties(assert, this.oResponsiveTable, [
				"alternateRowColors", "backgroundDesign", "footerText", "growing", "growingDirection", "growingScrollToLoad",
				"growingThreshold", "growingTriggerText", "includeItemInSelection", "mode", "noDataText", "popinLayout",
				"showSeparators", "sticky"
			], mDesignTimeMetadata.aggregations.items.propagateMetadata(this.oResponsiveTable).properties);
			fDone();
		});
	});

	QUnit.test("Test allowed properties for adaptation (e.g. Visual Editor) - inner GridTable", function(assert) {
		this.fExecuteWhenDesigntimeIsLoaded(assert, function(mDesignTimeMetadata, fDone) {
			this.testAllowedProperties(assert, this.oGridTable, [
				"rowHeight", "columnHeaderHeight", "visibleRowCount", "selectionMode", "selectionBehavior", "threshold",
				"visibleRowCountMode", "minAutoRowCount", "enableColumnFreeze", "alternateRowColors", "scrollThreshold"
			], mDesignTimeMetadata.aggregations.items.propagateMetadata(this.oGridTable).properties);
			fDone();
		});
	});

	QUnit.test("Test allowed properties for adaptation (e.g. Visual Editor) - inner ResponsiveTable Column", function(assert) {
		this.fExecuteWhenDesigntimeIsLoaded(assert, function(mDesignTimeMetadata, fDone) {
			this.testAllowedProperties(assert, this.oResponsiveColumn, [
				"hAlign", "width", "autoPopinWidth"
			], mDesignTimeMetadata.aggregations.items.propagateMetadata(this.oResponsiveColumn).properties);
			fDone();
		});
	});

	QUnit.test("Test allowed properties for adaptation (e.g. Visual Editor) - inner GridTable Column", function(assert) {
		this.fExecuteWhenDesigntimeIsLoaded(assert, function(mDesignTimeMetadata, fDone) {
			this.testAllowedProperties(assert, this.oGridColumn, [
				"hAlign", "width", "minWidth"
			], mDesignTimeMetadata.aggregations.items.propagateMetadata(this.oGridColumn).properties);
			fDone();
		});
	});
});
