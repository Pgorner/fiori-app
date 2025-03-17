/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./DialogAPI"],function(e){"use strict";return{iProcessDraftDataLossDialog:function(e,o,a){var i=a||{};var r=i.secondPage?"onTheSecondDetailPage":"onTheDetailPage";var t=i.formSection?i.formSection:"GeneralInfo";var n=i.changeField?i.changeField:{PurchaseOrderByCustomer:"CHANGED"};var f=i.draftOption?i.draftOption:"draftDataLossOptionKeep";var l=i.goToSection?i.goToSection:false;var s=Object.keys(n);var c;var d;if(s.length===1){var g=s[0];c=g;d=n[c]}var D={section:t};D.fieldGroup=i.fieldGroup?D.fieldGroup:"OrderData";if(i.noFieldGroup){delete D["fieldGroup"]}if(l){e[r].iGoToSection(l)}e[r].onForm(D).iChangeField({property:c},d);o[r].onFooter().iCheckDraftStateSaved();e.onTheShell.iNavigateBack();e[r].onMessageDialog().iSelectDraftDataLossOption(f);e[r].onMessageDialog().iConfirm()}}});
//# sourceMappingURL=DialogHelper.js.map