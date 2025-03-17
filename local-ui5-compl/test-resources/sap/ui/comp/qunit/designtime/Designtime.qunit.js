/* global QUnit */
sap.ui.define([
	"sap/ui/comp/smarttable/SmartTable",
	"sap/ui/comp/filterbar/FilterBar",
	"sap/ui/comp/smartfilterbar/SmartFilterBar",
	"sap/ui/comp/smartfield/SmartField",
	"sap/ui/comp/smartfield/SmartLabel",
	"sap/ui/comp/smartchart/SmartChart",
	"sap/ui/comp/navpopover/SmartLink",
	"sap/ui/comp/smartvariants/SmartVariantManagement",
	"sap/ui/comp/smartvariants/SmartVariantManagementBase",
	"sap/ui/comp/smartvariants/SmartVariantManagementMediator",
	"sap/ui/comp/smartform/SmartForm",
	"sap/ui/comp/smartform/Group",
	"sap/ui/comp/smartform/GroupElement",
	"sap/ui/core/Element"
], function(SmartTable, FilterBar, SmartFilterBar, SmartField, SmartLabel, SmartChart, SmartLink, SmartVariantManagement, SmartVariantManagementBase, SmartVariantManagementMediator, SmartForm, Group, GroupElement, Element) {
	"use strict";

	QUnit.module("sap.ui.comp.smarttable.SmartTable", {
		beforeEach: function() {
			this.oSmartTable = new SmartTable({
				id: "__xmlview3--LineItemsSmartTable"
			});
		},
		teardown: function() {
			this.oSmartTable.destroy();
		}
	});

	QUnit.test("Read desingtime annotations for SmartTable", function(assert) {
		var oControlMetadata = Element.getElementById("__xmlview3--LineItemsSmartTable").getMetadata();
		assert.ok(oControlMetadata.loadDesignTime().then(function(mDesignTimeMetadata) {
			return mDesignTimeMetadata.annotations;
		}));
	});

	QUnit.module("sap.ui.comp.smartfilterbar.SmartFilterBar", {
		beforeEach: function() {
			this.oSmartFilterBar = new SmartFilterBar({
				id: "__xmlview3--LineItemsSmartFilterBar"
			});
		},
		teardown: function() {
			this.oSmartFilterBar.destroy();
		}
	});

	QUnit.test("Read designtime annotations for SmartFilterBar", function(assert) {
		var oControlMetadata = Element.getElementById("__xmlview3--LineItemsSmartFilterBar").getMetadata();
		assert.ok(oControlMetadata.loadDesignTime().then(function(mDesignTimeMetadata) {
			return mDesignTimeMetadata.annotations;
		}));
	});

	QUnit.module("sap.ui.comp.smartfield.SmartField", {
		beforeEach: function() {
			this.oSmartField = new SmartField({
				id: "__xmlview3--LineItemsSmartField"
			});
		},
		teardown: function() {
			this.oSmartField.destroy();
		}
	});

	QUnit.test("Read designtime annotations for SmartField", function(assert) {
		var oControlMetadata = Element.getElementById("__xmlview3--LineItemsSmartField").getMetadata();
		assert.ok(oControlMetadata.loadDesignTime().then(function(mDesignTimeMetadata) {
			return mDesignTimeMetadata.annotations;
		}));
	});

	QUnit.module("sap.ui.comp.smartfield.SmartLabel", {
		beforeEach: function() {
			this.oSmartLabel = new SmartLabel();
		},
		teardown: function() {
			this.oSmartLabel.destroy();
		}
	});

	QUnit.test("Designtime tool for SmartLabel", function(assert) {
		// Arrange
		var fnDone = assert.async();
		assert.expect(3);

		// Act
		this.oSmartLabel.getMetadata().loadDesignTime().then(function(oDTMetadata) {
			// Assert
			assert.ok(oDTMetadata.hasOwnProperty("tool"));
			assert.ok(oDTMetadata.tool.hasOwnProperty("start"));
			assert.strictEqual(typeof oDTMetadata.tool.start, "function");
			fnDone();
		});
	});

	QUnit.test("BCP: 2180306023 tool.start method internally calls method which is linking SmartLabel to SmartField", function (assert) {
		// Arrange
		var fnDone = assert.async(),
			oSpy = this.spy(this.oSmartLabel, "getLabelInfo");

		assert.expect(1);

		// Act
		this.oSmartLabel.getMetadata().loadDesignTime().then(function(oDTMetadata) {
			// Act -> call tool method
			oDTMetadata.tool.start(this.oSmartLabel);

			// Assert
			assert.strictEqual(oSpy.callCount, 1, "SmartLabel method is called once");
			fnDone();
		}.bind(this));
	});

	QUnit.module("sap.ui.comp.smartchart.SmartChart", {
		beforeEach: function() {
			this.oSmartChart = new SmartChart({
				id: "__xmlview3--LineItemsSmartChart"
			});
		},
		teardown: function() {
			this.oSmartChart.destroy();
		}
	});

	QUnit.test("Read designtime annotations for SmartChart", function(assert) {
		var oControlMetadata = Element.getElementById("__xmlview3--LineItemsSmartChart").getMetadata();
		assert.ok(oControlMetadata.loadDesignTime().then(function(mDesignTimeMetadata) {
			return mDesignTimeMetadata.annotations;
		}));
	});

	QUnit.module("sap.ui.comp.navpopover.SmartLink", {
		beforeEach: function() {
			this.oSmartLink = new SmartLink({
				id: "__xmlview3--LineItemsSmartLink"
			});
		},
		teardown: function() {
			this.oSmartLink.destroy();
		}
	});

	QUnit.test("Read designtime annotations for SmartLink", function(assert) {
		var oControlMetadata = Element.getElementById("__xmlview3--LineItemsSmartLink").getMetadata();
		assert.ok(oControlMetadata.loadDesignTime().then(function(mDesignTimeMetadata) {
			return mDesignTimeMetadata.annotations;
		}));
	});


	QUnit.module("sap.ui.comp.smart.controls", {

		beforeEach: function() {
		   this.aControls = [
				new SmartField(),
				new SmartChart(),
				new SmartLink(),
				new SmartForm(),
				new Group(),
				new GroupElement(),
				new FilterBar(),
				new SmartFilterBar(),
				new SmartVariantManagement(),
				new SmartVariantManagementBase(),
				new SmartVariantManagementMediator(),
				new SmartTable()];
		},
		afterEach: function() {

			this.aControls.forEach(function(oSmartControl) {
				oSmartControl.destroy();
			});
		}
	});
	QUnit.test("XCheck if all properties are declared in design time file", function(assert) {

		var iIndex = 0;
		var fnDone = assert.async();

		this.aControls.forEach(function(oSmartControl) {

			var mProperties = oSmartControl.getMetadata()._mProperties;
			assert.ok(mProperties, "Properties loaded for " + oSmartControl.getMetadata().getName());

			var aProperties = Object.keys(mProperties);

			oSmartControl.getMetadata().loadDesignTime().then(function(oDesignTimeMetadata) {
				assert.ok(oDesignTimeMetadata, "Metadatafile present for " + oSmartControl.getMetadata().getName());
				assert.ok(oDesignTimeMetadata.properties, "Properties present for " + oSmartControl.getMetadata().getName());

				//all properties defined in the class of the control are defined in designtime metadata (there are also inherited properties)
				aProperties.forEach(function(element) {
					assert.ok(oDesignTimeMetadata.properties[element], oSmartControl.getMetadata().getName() + " property \"" + element + "\"");
				});

				iIndex++;

				if (iIndex == this.aControls.length) {
					fnDone();
				}
			}.bind(this));

		}.bind(this));

	});
});
