/*globals QUnit*/

sap.ui.define([
	"sap/ui/comp/designtime/smartform/GroupElement.designtime"
], function(
	GroupElementDesignTimeMetadata
) {
	"use strict";

	QUnit.module("Given the GroupElement DesignTime Metadata", {}, function() {
		QUnit.test("Action checks", function(assert) {
			var GEMetadata = GroupElementDesignTimeMetadata;
			assert.ok(GEMetadata.actions.remove && GEMetadata.actions.remove.changeType, "GroupElement designtime metadata include remove action");
			assert.ok(GEMetadata.actions.reveal && GEMetadata.actions.reveal.changeType, "GroupElement designtime metadata include reveal action");
			assert.ok(GEMetadata.actions.rename && GEMetadata.actions.rename.changeType, "GroupElement designtime metadata include rename action");
			assert.ok(GEMetadata.actions.combine && GEMetadata.actions.combine.changeType, "GroupElement designtime metadata include combine action");
			assert.ok(GEMetadata.actions.split && GEMetadata.actions.split.changeType, "GroupElement designtime metadata include split action");
		});

		QUnit.test('when checking if actions should be propagated for a button element', function(assert) {
			var oElement = {
				getMetadata: function() {
					return {
						getName: function() {
							return "sap.m.Button";
						}

					};
				}
			};

			assert.equal(
				GroupElementDesignTimeMetadata.aggregations.elements.propagateMetadata(oElement).actions,
				null,
				'then no actions are available'
			);
		});

		QUnit.test('when checking if actions should be propagated for a SmartLink element (outside of a SmartField)', function(assert) {
			var oElement = {
				getMetadata: function() {
					return {
						getName: function() {
							return "sap.ui.comp.navpopover.SmartLink";
						}

					};
				}
			};

			assert.equal(
				GroupElementDesignTimeMetadata.aggregations.elements.propagateMetadata(oElement),
				undefined,
				'then the actions will be propagated (no restriction is returned)'
			);
		});

		QUnit.test('when checking if actions should be propagated for a SmartLink element inside a SmartField', function(assert) {
			var oElement = {
				getMetadata: function() {
					return {
						getName: function() {
							return "sap.ui.comp.smartfield.SmartField";
						}

					};
				},
				getSemanticObjectController: function() {
					return true;
				}
			};

			assert.equal(
				GroupElementDesignTimeMetadata.aggregations.elements.propagateMetadata(oElement),
				undefined,
				'then the actions will be propagated (no restriction is returned)'
			);
		});
	});
});