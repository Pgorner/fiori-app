/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./DialogAPI"], function (DialogAPI) {
	"use strict";

	return {
		/**
		 * A helper function that ensures that a draft is available and confirmed.
		 * @param {object} When The Opa5 When chain
		 * @param {object} Then The Opa5 Then chain
		 * @param {object} oParams The general object describing the parameters for this function
		 * @param {boolean} oParams.secondPage Optional boolean to describe whether the test is executed on the second or detailpage
		 * @param {string} oParams.formSection The form section on which the change shall be applied
		 * @param {string} oParams.fieldGroup The optional field group on which the change shall be applied, defaulted to "OrderData"
		 * @param {boolean} oParams.noFieldGroup The optional boolean parameter to remove the default fieldgroup again
		 * @param {object} oParams.changeField The field to be changed in a key value relationship
		 * @param {string} oParams.draftOption The draftOption that should be used in this helper, default "draftDataLossOptionKeep"
		 */
		iProcessDraftDataLossDialog: function (When, Then, oParams) {
			var loParams = oParams || {};
			var pageKey = loParams.secondPage ? "onTheSecondDetailPage" : "onTheDetailPage";
			var formSection = loParams.formSection ? loParams.formSection : "GeneralInfo";
			var changeField = loParams.changeField
				? loParams.changeField
				: {
						PurchaseOrderByCustomer: "CHANGED" //default field with "changed value"
				  };

			var draftOption = loParams.draftOption ? loParams.draftOption : "draftDataLossOptionKeep";
			var sGoToSection = loParams.goToSection ? loParams.goToSection : false;

			var aFields = Object.keys(changeField);
			var sFieldProperty;
			var sValue;
			if (aFields.length === 1) {
				var lsKey = aFields[0];
				sFieldProperty = lsKey;
				sValue = changeField[sFieldProperty];
			} // TODO: potentially prepare more use cases with multi changing fields

			var oFormSettings = { section: formSection };

			oFormSettings.fieldGroup = loParams.fieldGroup ? oFormSettings.fieldGroup : "OrderData";
			if (loParams.noFieldGroup) {
				delete oFormSettings["fieldGroup"];
			}

			if (sGoToSection) {
				When[pageKey].iGoToSection(sGoToSection);
			}

			When[pageKey].onForm(oFormSettings).iChangeField({ property: sFieldProperty }, sValue);
			Then[pageKey].onFooter().iCheckDraftStateSaved();
			When.onTheShell.iNavigateBack();
			When[pageKey].onMessageDialog().iSelectDraftDataLossOption(draftOption);
			When[pageKey].onMessageDialog().iConfirm();
		}
	};
});
