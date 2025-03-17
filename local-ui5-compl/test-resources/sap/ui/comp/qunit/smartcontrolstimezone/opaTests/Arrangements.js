sap.ui.define([
	"sap/ui/test/Opa5"
], function (Opa5) {
	"use strict";
	return {
		iStartMyApp: function (sUrl, sTimezone) {
			var sTimezoneURL = sTimezone ? "?sap-timezone=" + sTimezone : "";
			return this.iStartMyAppInAFrame({
				source: sap.ui.require.toUrl(sUrl + sTimezoneURL),
				width: "1000px",
				height: "500px"
			});
		},
		iEnsureMyAppIsRunning: function (sUrl, sTimezone) {
			if (!this._myApplicationIsRunning) {
				this.iStartMyApp(sUrl, sTimezone);
				this._myApplicationIsRunning = true;
			}
		},
		iStopMyApp: function () {
			this._myApplicationIsRunning = false;
			return this.iTeardownMyAppFrame();
		},
		iSelectAFieldForTest: function (sFieldName) {
			return this.waitFor({
				properties: {
					placeholder: "Change Visible Field"
				},
				controlType: "sap.m.ComboBox",
				errorMessage: "'Change Visible Field' field not found!",
				success: function (aComboBoxes) {
					var oComboBox = aComboBoxes[0],
						oItem = oComboBox.getItems().find(function (oItem) {
							return oItem.getText() === sFieldName;
						}),
						sKey = oItem && oItem.getKey();
					oComboBox.setSelectedKey(sKey);
					oComboBox.fireChange();
					Opa5.assert.ok(!!sKey, "'" + sFieldName + "' was shown");
				}
			});
		}
	};
});
