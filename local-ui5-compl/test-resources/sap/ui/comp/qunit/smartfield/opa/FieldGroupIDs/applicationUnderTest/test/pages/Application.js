sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press"
], function (
	Opa5,
	Press
) {
	"use strict";

	Opa5.createPageObjects({
		onTheApplicationPage: {
			actions: {
				iApplyFieldGroupIDs: function () {
					return this.waitFor({
						id: "applyFieldGroupIDs",
						controlType: "sap.m.Button",
						actions: new Press()
					});
				},
				iSetFieldGroupIDs: function (sID, aIDs) {
					return this.waitFor({
						id: sID,
						controlType: "sap.ui.comp.smartfield.SmartField",
						success: function (oSmartField) {
							oSmartField._setInternalFieldGroupIds(aIDs);
						}
					});
				}
			},
			assertions: {
				iShouldSeeSmartFieldWithSpecificFieldGroupIDs: function (sId, aExpectedFieldGroupIDs) {
					return this.waitFor({
						id: sId,
						controlType: "sap.ui.comp.smartfield.SmartField",
						success: function (oSmartField) {
							var aFieldGroupIDs = oSmartField.getFirstInnerControl().getFieldGroupIds();
							Opa5.assert.strictEqual(
								aFieldGroupIDs.toString(),
								aExpectedFieldGroupIDs.toString()
							);
						}
					});
				},
				iShouldSeeSmartFieldWithFieldGroupIDs: function (sId) {
					return this.waitFor({
						id: sId,
						controlType: "sap.ui.comp.smartfield.SmartField",
						success: function (oSmartField) {
							var aFieldGroupIDs = oSmartField.getFirstInnerControl().getFieldGroupIds();
							Opa5.assert.ok(!!aFieldGroupIDs.length);
						}
					});
				}
			}
		}
	});
});
