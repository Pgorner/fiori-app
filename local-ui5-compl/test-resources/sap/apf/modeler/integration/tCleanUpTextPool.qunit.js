/**
 * Clean up of text elements, that are no longer used in a configuration
 */
sap.ui.define([
	'sap/apf/testhelper/modelerHelper',
	'sap/ui/thirdparty/jquery',
	'sap/apf/testhelper/authTestHelper',
	'sap/apf/testhelper/mockServer/wrapper',
	'sap/apf/testhelper/helper',
	'sap/apf/testhelper/doubles/messageHandler',
	'sap/apf/modeler/core/instance'
], function(
	modelerHelper,
	jQuery
) {
	"use strict";

	QUnit.module("M: Clean up of text pool", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			var isMockServerActive = true;
			if (new URLSearchParams(location.search).get("responderOff") === "true") {
				isMockServerActive = false;
			}
			function callbackForSetup() {
				var deferred = jQuery.Deferred();
				var textPool = that.configurationHandler.getTextPool();
				that.unusedTextKeys = [];
				textPool.setTextAsPromise("Do not do it", {
					TextElementType : "YMSG",
					MaximumLength : 21,
					TranslationHint : "Just translate"
				}).done(function(textKey){
					that.configurationEditor.setCategory({
						labelKey : textKey
					});
					textPool.setTextAsPromise("Do it", {
						TextElementType : "YMSG",
						MaximumLength : 21,
						TranslationHint : "No slang!"
					}).done(function(textKey){
						that.unusedTextKeys.push(textKey);
						textPool.setTextAsPromise("Do it again", {
							TextElementType : "YMSG",
							MaximumLength : 21,
							TranslationHint : "No slang!"
						}).done(function(textKey){
							that.unusedTextKeys.push(textKey);
							deferred.resolve();
						});
						
					});
				});
				return deferred.promise();
			}
			function callbackAfterSave() {
				done();
			}
			modelerHelper.createConfigurationEditorWithSave(isMockServerActive, that, that.appA, callbackForSetup, callbackAfterSave, assert, done);
		},
		appA : {
			ApplicationName : "testCleanUp",
			SemanticObject : "semObjA"
		},
		afterEach : function(assert) {
			modelerHelper.removeApplication(this.applicationCreatedForTest, function() { });
		}
	});
	QUnit.test("Cleanup", function(assert) {
		var that = this;
		var done1 = assert.async();
		var applicationId = this.applicationCreatedForTest;
		assert.ok(applicationId);
		var textPool = this.configurationHandler.getTextPool();
		var text;
		var i;
		for(i = 0; i < this.unusedTextKeys.length; i++) {
			text = textPool.get(this.unusedTextKeys[i]);
			assert.ok(text.TextElement, "text is available");
		}
		function assertTextsAreDeleted(messageObject) {
			var i;
			assert.equal(messageObject, undefined, "No errors expected");
			for(i = 0; i < that.unusedTextKeys.length; i++) {
				text = textPool.get(that.unusedTextKeys[i]);
				assert.equal(text.TextElementDescription, that.unusedTextKeys[i], "text is no longer available - only dummy returned");
			}
			done1();
		}
		textPool.removeTexts(this.unusedTextKeys, applicationId, assertTextsAreDeleted);
	});

});
