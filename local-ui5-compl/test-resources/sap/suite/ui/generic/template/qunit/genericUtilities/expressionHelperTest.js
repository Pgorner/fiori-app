sap.ui.define([
	"sap/suite/ui/generic/template/genericUtilities/expressionHelper",
	"testUtils/sinonEnhanced",
	"sap/m/Text",
	"sap/ui/model/odata/AnnotationHelper",
],function(expressionHelper, sinon, Text, AnnotationHelperModel) {
	"use strict";
	QUnit.module("genericUtilities.expressionHelper", {
		beforeEach: function() {
		},
		afterEach: function() {
		}
	});
	QUnit.test("Dummy", function (assert) {
		assert.ok(true, "Dummy");
	});
	QUnit.test("", function (assert) {
		//Arrange
		var sandbox = sinon.sandbox.create();
		sandbox.stub(AnnotationHelperModel, "format", function(oMetaModelContext){
			return "Sales Order";
		});
		var oControl = sinon.createStubInstance(Text);
		oControl.prototype = {};
		sandbox.stub(oControl.prototype, "setBindingContext", function(oContext){
			return;
		});
		var oModel = {
			getMetaModel: function() {
				return {
					getMetaContext: function(sAnnotation) {
						return {
							getPath: function() {
								return "path";
							}
						}
					},
					getContext: function(sPath) {
						return {};
					}
				}
			}
		};
		var sEntitySet = "entitySet";
		var sAnnotation = "/com.sap.vocabularies.UI.v1.HeaderInfo/Title/Value";
		var oRb = {
			getText: function(key) {
				return "text";
			}
		};
		var oContext = {};
		var sExpectedResult = "";
		//Invoke
		var oAnnotationFormatter = expressionHelper.getAnnotationFormatter(oModel, sEntitySet, sAnnotation, oRb);
		//var sResult = oAnnotationFormatter.format(oContext);
		oAnnotationFormatter.done();
		//Assert
		//assert.equal(sResult, sExpectedResult, "Correct text is returned");
		assert.ok(true, "TODO: Unable to stub Text control and its methods")
		//Clean
	});
});
