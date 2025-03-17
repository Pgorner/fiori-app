/* global QUnit */
sap.ui.define([
	"sap/ui/core/Control",
	"sap/ui/comp/smartvariants/PersonalizableInfo",
	"sap/ui/core/Element"
],
	function(
		Control,
		PersonalizableInfo,
		Element
	) {
	"use strict";

	QUnit.module("sap.ui.comp.smartvariants.PersonalizableInfo", {
		beforeEach: function() {
			this.oPersControler = new PersonalizableInfo();
		},
		afterEach: function() {
			this.oPersControler.destroy();
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oPersControler);
	});

	QUnit.test("test properties", function(assert) {
		this.oPersControler.setType("TYPE");
		assert.equal(this.oPersControler.getType(), "TYPE");

		var oControl = new Control();
		this.oPersControler.setControl(oControl);
		assert.ok(Element.getElementById(this.oPersControler.getControl()) === oControl);

		this.oPersControler.setDataSource("DATASOURCE");
		assert.equal(this.oPersControler.getDataSource(), "DATASOURCE");

		this.oPersControler.setKeyName("persistencyKey");
		assert.equal(this.oPersControler.getKeyName(), "persistencyKey");
	});
});