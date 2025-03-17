/*global QUnit, sinon */
sap.ui.define([
	"sap/m/Input",
	"sap/apf/modeler/ui/utils/textPoolHelper"
], function(
	Input,
	TextPoolHelper
) {
	"use strict";
	var aTextObjects = [ {
		TextElement : "12345678",
		TextElementDescription : "TIME"
	}, {
		TextElement : "87654321",
		TextElementDescription : "CUSTOMER"
	} ];
	var oTextPoolStub = {
		getTextsByTypeAndLength : sinon.stub().returns(aTextObjects)
	};
	QUnit.module("Text Pool Helper - Unit Test", {
		beforeEach : function() {
			this.oTextPoolStub = oTextPoolStub;
			// the following line does not work as TextPoolHelper is not a function/constructor
			// The test just doesn't fail because the only test in this module is a QUnit.skip 
			this.oTextPoolHelper = new TextPoolHelper(this.oTextPoolStub);
		},
		afterEach : function() {
			return;
		}
	});
	QUnit.skip("setAutoCompleteOn st", function(assert) {
		var oInputControl = new Input();
		var oTranslationFormat = {
			xtElementType : "XTIT",
			ximumLength : 60
		};
		var oDependenciesForText = {
			oTranslationFormat : oTranslationFormat,
			type : "text"
		};
		this.oTextPoolHelper.setAutoCompleteOn(oInputControl, oDependenciesForText);
		assert.ok(oInputControl.getShowSuggestion(), "showSuggestion property on input control is set to true.");
		var aExpectedArgs = [ "XTIT", 60 ];
		var aActualArgs = this.oTextPoolStub.getTextsByTypeAndLength.args[0];
		assert.equal(JSON.stringify(aExpectedArgs), JSON.stringify(aActualArgs), "TextPool API invoked with correct arguments.");
		var aExpectedData = aTextObjects;
		var aActualData = oInputControl.getModel().getData().suggestions;
		assert.equal(aExpectedData[0].TextElementDescription, aActualData[0].suggetionText, "Input control is bound with appropriate data.");
		assert.equal(aExpectedData[1].TextElementDescription, aActualData[1].suggetionText, "Input control is bound with appropriate data.");
	});
});