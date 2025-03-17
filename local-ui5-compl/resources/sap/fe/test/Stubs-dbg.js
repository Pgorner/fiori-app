/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
/**
 * Actions and assertions to be used with a page hosted in an FCL
 */
sap.ui.define([], function () {
	"use strict";
	var Stubs = {
		prepareStubs: function (oWindow) {
			if (!oWindow.sapFEStubs) {
				oWindow.sapFEStubs = {};
			}
		},

		stubAll: function (oWindow) {
			this.stubConfirm(oWindow);
			this.stubMessageToast(oWindow);
			this.stubMisc(oWindow);
		},

		restoreAll: function (oWindow) {
			this.restoreConfirm(oWindow);
			this.restoreMessageToast(oWindow);
			this.restoreMisc(oWindow);
		},

		stubConfirm: function (oWindow) {
			Stubs.prepareStubs(oWindow);

			oWindow.sapFEStubs._confirmOriginal = oWindow.confirm;
			oWindow.confirm = function (sMessage) {
				throw "Unexpected confirm dialog - " + sMessage;
			};
		},

		restoreConfirm: function (oWindow) {
			if (!oWindow.sapFEStubs || !oWindow.sapFEStubs._confirmOriginal) {
				return;
			}
			oWindow.confirm = oWindow.sapFEStubs._confirmOriginal;
			delete oWindow.sapFEStubs._confirmOriginal;
		},

		stubMessageToast: function (oWindow) {
			Stubs.prepareStubs(oWindow);
			oWindow.sap.ui.require(["sap/m/MessageToast"], (oMessageToast) => {
				oWindow.sapFEStubs._sapMMessageToastShowOriginal = oMessageToast.show;
				oWindow.sapFEStubs.setLastToastMessage = function (sMessage) {
					oWindow.sapFEStubs._sapMMessageToastLastMessage = sMessage;
				};
				oWindow.sapFEStubs.getLastToastMessage = function () {
					return oWindow.sapFEStubs._sapMMessageToastLastMessage;
				};
				oMessageToast.show = function (sMessage) {
					oWindow.sapFEStubs.setLastToastMessage(sMessage);
					return oWindow.sapFEStubs._sapMMessageToastShowOriginal.apply(this, arguments);
				};
			});
		},
		restoreMessageToast: function (oWindow) {
			if (!oWindow.sapFEStubs || !oWindow.sapFEStubs._sapMMessageToastShowOriginal) {
				return;
			}
			oWindow.sap.ui.require(["sap/m/MessageToast"], (oMessageToast) => {
				oMessageToast.show = oWindow.sapFEStubs._sapMMessageToastShowOriginal;
				delete oWindow.sapFEStubs._sapMMessageToastShowOriginal;
				delete oWindow.sapFEStubs._sapMMessageToastLastMessage;
				delete oWindow.sapFEStubs.setLastToastMessage;
				delete oWindow.sapFEStubs.getLastToastMessage;
			});
		},

		stubMisc: function (oWindow) {
			Stubs.prepareStubs(oWindow);

			// TODO workaround
			// pressing Enter in the creation row triggers creation of a new row, but we need Enter key for value validation
			oWindow.sap.ui.require(["sap/ui/table/CreationRow"], function (oCreationRow) {
				oWindow.sapFEStubs._sapUiTableCreationRowOnSapEnter = oCreationRow.prototype.onsapenter;
				delete oCreationRow.prototype.onsapenter;
			});
		},

		restoreMisc: function (oWindow) {
			if (!oWindow.sapFEStubs || !oWindow.sapFEStubs._sapUiTableCreationRowOnSapEnter) {
				return;
			}

			var oCreationRow = oWindow.sap.ui.require("sap/ui/table/CreationRow");
			oCreationRow.prototype.onsapenter = oWindow.sapFEStubs._sapUiTableCreationRowOnSapEnter;
			delete oWindow.sapFEStubs._sapUiTableCreationRowOnSapEnter;
		}
	};

	return Stubs;
});
