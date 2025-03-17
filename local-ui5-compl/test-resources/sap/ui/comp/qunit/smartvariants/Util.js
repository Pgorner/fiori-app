/* global sinon */
sap.ui.define([], function() {
	"use strict";

	return {
		fnCapitalizeFirstLetter: (sString) => {
			return sString[0].toUpperCase() + sString.slice(1);
		},
		fnCheckIfMethodCallIsForwarded: (assert, { sourceInstance, forwardedInstance, methodName, forwardedMethodName, parameters, expectedParameters, preventExecution }) => {
			if (!forwardedMethodName) {
				forwardedMethodName = methodName;
			}
			if (expectedParameters === undefined) {
				expectedParameters = parameters;
			}
			let fnForwardedMethodSpy;
			if (preventExecution) {
				fnForwardedMethodSpy = sinon.stub(forwardedInstance, forwardedMethodName);
			} else {
				fnForwardedMethodSpy = sinon.spy(forwardedInstance, forwardedMethodName);
			}

			assert.ok(fnForwardedMethodSpy.notCalled, `should have not called ${forwardedMethodName} initially`);

			sourceInstance[methodName](...parameters);
			assert.ok(fnForwardedMethodSpy.calledOnce, `should have called ${forwardedMethodName} once`);
			assert.ok(fnForwardedMethodSpy.calledWith(...expectedParameters), `should have called ${forwardedMethodName} with correct parameters`);
			fnForwardedMethodSpy.restore();
		},
		mPropertiesToModelMapping: {
			"defaultVariantKey": "defaultVariant",
			"editable": "variantsEditable",
			"headerLevel": "headerLevel",
			"selectionKey": "currentVariant",
			"showExecuteOnSelection": "showExecuteOnSelection",
			"showSetAsDefault": "supportDefault",
			"showShare": "supportPublic",
			"standardItemText": "standardItemText",
			"titleStyle": "titleStyle",
			"useFavorites": "showFavorites",
			"variantCreationByUserAllowed": "creationAllowed"
		},
		mModelToVariantManagementMapping: {
			"creationAllowed": "creationAllowed",
			"supportDefault": "supportDefault",
			"headerLevel": "level",
			"titleStyle": "titleStyle",
			"variantsEditable": "showFooter",
			"showExecuteOnSelection": "supportApplyAutomatically",
			"supportPublic": "supportPublic",
			"showFavorites": "supportFavorites",
			"modified": "modified",
			"defaultVariant": "defaultKey",
			"currentVariant": "selectedKey"
		}
	};

});