/* globals QUnit */

sap.ui.define([
	"sap/ui/core/Control",
	"sap/ui/core/Element",
	"sap/ui/layout/HorizontalLayout",
	"sap/ui/comp/filterbar/FilterItem",
	"sap/ui/comp/filterbar/FilterBar",
	"sap/m/Input",
	"sap/m/Label"
], function(Control, Element, HorizontalLayout, FilterItem, FilterBar, Input, Label) {
	"use strict";

	QUnit.module("sap.ui.comp.filterbar.FilterItem", {
		beforeEach: function() {
			this.oFilterItem = new FilterItem();
		},
		afterEach: function() {
			this.oFilterItem.destroy();
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oFilterItem);
	});

	/**
	 * @deprecated partOfCurrentVariant Since version 1.87. Will be internally treated as if always set to <code>true<code>
	 */
	QUnit.test("Checking the properties", function(assert) {
		var oCtrl = new Control();
		this.oFilterItem.setControl(oCtrl);
		this.oFilterItem.setName("NAME");
		this.oFilterItem.setLabel("LABEL");
		this.oFilterItem.setLabelTooltip("Tooltip");
		this.oFilterItem.setControlTooltip("Control Tooltip");
		this.oFilterItem.setVisibleInFilterBar(true);
		this.oFilterItem.setPartOfCurrentVariant(true);

		this.oFilterItem.setMandatory(true);
		this.oFilterItem.setVisible(false);

		assert.equal(this.oFilterItem.getControl(), oCtrl, "not the expected oCtrl instance");
		assert.strictEqual(this.oFilterItem.getName(), "NAME", "not the expected name");
		assert.strictEqual(this.oFilterItem.getLabel(), "LABEL", "not the expected label");
		assert.strictEqual(this.oFilterItem.getLabelTooltip(), "Tooltip", "not the expected label tooltip");
		assert.strictEqual(this.oFilterItem.getControlTooltip(), "Control Tooltip", "not the expected control tooltip");
		assert.strictEqual(this.oFilterItem.getMandatory(), true, "not the expected mandatory flag");
		assert.strictEqual(this.oFilterItem.getVisible(), false, "not the expected visibility flag");

		assert.strictEqual(this.oFilterItem.getVisibleInFilterBar(), true, "not the expected 'visibleInFilterBar' flag");
		assert.strictEqual(this.oFilterItem.getPartOfCurrentVariant(), true, "not the expected 'partOfCurrentVariant' flag");

		var oLabel = this.oFilterItem.getLabelControl();
		assert.ok(oLabel, "label control expected");
		assert.strictEqual(oLabel.getText(), "LABEL", "not the expected label on control");
		assert.strictEqual(oLabel.getTooltip(), "Tooltip", "not the expected tooltip on control");

	});

	QUnit.test("Shall fire an event when the visible property has changed", function(assert) {
		var fEventHandler, sPropertyName;
		fEventHandler = function(oEvent) {
			sPropertyName = oEvent.getParameter("propertyName");
		};
		this.oFilterItem.attachChange(fEventHandler);

		// Call CUT
		this.oFilterItem.setVisible(false);

		assert.equal(sPropertyName, "visible");
	});

	QUnit.test("Shall fire an event when the visibleInFilterBar property has changed", function(assert) {
		var fEventHandler, sPropertyName;
		fEventHandler = function(oEvent) {
			sPropertyName = oEvent.getParameter("propertyName");
		};
		this.oFilterItem.attachChange(fEventHandler);

		// Call CUT
		this.oFilterItem.setVisibleInFilterBar(false);

		assert.equal(sPropertyName, "visibleInFilterBar");
	});

	QUnit.test("Shall return label control", function(assert) {
		assert.ok(this.oFilterItem.getLabelControl());
	});

	QUnit.test("Test setLabel", function(assert) {
		// Arrange
		var _oLabel = new Label(),
			oFireChangeSpy = this.spy(this.oFilterItem, "fireChange");

		this.oFilterItem._oLabel = _oLabel;

		// Assert
		assert.strictEqual(this.oFilterItem.getLabel(), "", "label property is empty string");
		assert.strictEqual(this.oFilterItem._oLabel.getText(), "", "_oLabel text property is empty string");

		// Act
		this.oFilterItem.setLabel("");

		// Assert
		assert.strictEqual(this.oFilterItem.getLabel(), "", "label property is empty string");
		assert.strictEqual(this.oFilterItem._oLabel.getText(), "", "_oLabel text property is empty string");
		assert.strictEqual(this.oFilterItem._oLabel.getTooltip(), null, "no default tooltip for label");

		// Act
		this.oFilterItem.setLabel("aaa");

		// Assert
		assert.strictEqual(this.oFilterItem.getLabel(), "aaa", "label property is aaa");
		assert.strictEqual(this.oFilterItem._oLabel.getText(), "aaa", "_oLabel text property is aaa");
		assert.strictEqual(this.oFilterItem._oLabel.getTooltip(), null, "no default tooltip for label");
		assert.strictEqual(oFireChangeSpy.callCount, 2, '"change" event is fired twice');

		// Clean up
		oFireChangeSpy.reset();
	});

	QUnit.test("Test setLabelTooltip", function(assert) {
		// Arrange
		var _oLabel = new Label(),
			oFireChangeSpy = this.spy(this.oFilterItem, "fireChange");

		this.oFilterItem._oLabel = _oLabel;

		// Assert
		assert.strictEqual(this.oFilterItem.getLabelTooltip(), "", "labelTooltip property is empty string");
		assert.strictEqual(this.oFilterItem._oLabel.getTooltip(), null, "_oLabel tooltip property is empty string");

		// Act
		this.oFilterItem.setLabelTooltip("");

		// Assert
		assert.strictEqual(this.oFilterItem.getLabelTooltip(), "", "labelTooltip property is empty string");
		assert.strictEqual(this.oFilterItem._oLabel.getTooltip(), null, "_oLabel tooltip property is empty string");

		// Act
		this.oFilterItem.setLabelTooltip("bbb");

		// Assert
		assert.strictEqual(this.oFilterItem.getLabelTooltip(), "bbb", "labelTooltip property is bbb");
		assert.strictEqual(this.oFilterItem._oLabel.getTooltip(), "bbb", "_oLabel tooltip property is bbb");
		assert.strictEqual(oFireChangeSpy.callCount, 2, '"change" event is fired twice');

		// Clean up
		oFireChangeSpy.reset();
	});

	QUnit.test("Checking hiddenFilter property", function(assert) {
		assert.ok(!this.oFilterItem.getHiddenFilter());

		this.oFilterItem.setHiddenFilter(true);
		assert.ok(this.oFilterItem.getHiddenFilter());
	});

	/**
	 * @deprecated partOfCurrentVariant Since version 1.87. Will be internally treated as if always set to <code>true<code>
	 */
	QUnit.test("Shall fire an event when the partOfCurrentVariant property has changed to true", function(assert) {
		var fEventHandler, sPropertyName;
		fEventHandler = function(oEvent) {
			sPropertyName = oEvent.getParameter("propertyName");
		};
		this.oFilterItem.attachChange(fEventHandler);

		// Call CUT
		this.oFilterItem.setPartOfCurrentVariant(true);

		assert.equal(sPropertyName, "partOfCurrentVariant");
	});

	QUnit.test("Check set/get symmetry for control aggregation", function(assert) {
		var oCtrl = new Control();
		this.oFilterItem.setControl(oCtrl);

		assert.equal(oCtrl, this.oFilterItem.getControl());
		assert.equal(oCtrl, this.oFilterItem.getAggregation("control"));

		var oHL = new HorizontalLayout();
		oHL.addContent(oCtrl);

		assert.equal(oCtrl, this.oFilterItem.getControl());
		assert.equal(null, this.oFilterItem.getAggregation("control"));
	});

	QUnit.test("Method _createLabelControl does not throw an exception if text or tooltip is not escaped", function(assert) {
		this.oFilterItem.setLabel("#$$^*^&amp;(^&amp;(^&amp;(:&apos;&quot;|&quot;|&quot;S|A&quot;S|}W{E+@_#aaaaaaaas");

		this.oFilterItem._createLabelControl(this.oFilterItem.getId());

		assert.ok(true, "No exception is thrown");
	});

	/**
	 * @deprecated As of version 1.48.0. Use aggregation <code>filterGroupItems</code> instead.
	 */
	QUnit.test("destroy method should destroy the label and control of the filterItem", function (assert) {

		// Arrange
		var oFilterBar = new FilterBar();
		var oControl = new Input(),
			oFilterItem = new FilterItem("filterItem-id", {
				control: oControl,
				name: "A",
				label: "B"
			});
		oFilterBar.addFilterItem(oFilterItem);
		var oFilterGroupItem = Element.getElementById("filterItem-id__filterGroupItem");

		// Act
		oFilterItem.destroy();

		// Assert
		assert.notOk(oFilterItem.getControl());
		assert.notOk(oFilterItem._oLabel);
		assert.notOk(oFilterGroupItem.getControl());
		assert.notOk(oFilterGroupItem._oLabel);

	});
});
