/* globals QUnit, sinon */
sap.ui.define([
	"sap/ui/comp/smartfilterbar/SFBMultiInput",
	"sap/m/MultiInput",
	"sap/ui/comp/smartfilterbar/FilterProvider",
	"sap/m/Token",
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/comp/smartfilterbar/SFBTokenizer",
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/events/KeyCodes"
], function(
	SFBMultiInput,
	MultiInput,
	FilterProvider,
	Token,
	nextUIUpdate,
	SFBTokenizer,
	qutils,
	KeyCodes
) {
	"use strict";

	QUnit.module("Generic", {
		beforeEach: function() {
			this.oControl = new SFBMultiInput();
		},
		afterEach: function() {
			this.oControl.destroy();
			this.oControl = null;
		}
	});

	QUnit.test("Override onBeforeRendering method calls parent method", async function(assert) {
		// Arrange
		var oSpy = sinon.spy(MultiInput.prototype, "onBeforeRendering");

		// Act
		this.oControl.placeAt("qunit-fixture");
		await nextUIUpdate();

		// Assert
		assert.strictEqual(oSpy.callCount, 1, "Overridden method called once");

		// Cleanup
		oSpy.restore();
	});

	QUnit.module("Token creation from initial value", {
		beforeEach: function() {
			this.oControl = new SFBMultiInput();
		},
		afterEach: function() {
			this.oControl.destroy();
		}
	});

	QUnit.test("With value", async function(assert) {
		// Arrange
		var oSpy = sinon.spy(this.oControl, "_validateCurrentText");

		// Act
		this.oControl.setValue("test");
		this.oControl.placeAt("qunit-fixture");
		await nextUIUpdate();

		// Assert
		assert.strictEqual(oSpy.callCount, 1, "_validateCurrentText called once");
		assert.ok(oSpy.calledWith(true), "Method called with bExactMatch=true");

		// Cleanup
		oSpy.restore();
	});

	QUnit.test("Without value", async function(assert) {
		// Arrange
		var oSpy = sinon.spy(this.oControl, "_validateCurrentText");

		// Act
		this.oControl.placeAt("qunit-fixture");
		await nextUIUpdate();

		// Assert
		assert.strictEqual(oSpy.callCount, 0, "_validateCurrentText not called");

		// Cleanup
		oSpy.restore();
	});

	QUnit.test("_validateCurrentText with value called only on first rendering", async function(assert) {
		// Arrange
		var oSpy = sinon.spy(this.oControl, "_validateCurrentText");

		// Act
		this.oControl.setValue("test");
		this.oControl.placeAt("qunit-fixture");
		await nextUIUpdate();

		// Assert
		assert.strictEqual(oSpy.callCount, 1, "_validateCurrentText called once");

		// Arrange
		oSpy.reset();

		// Act
		this.oControl.invalidate();
		await nextUIUpdate();

		// Assert
		assert.strictEqual(oSpy.callCount, 1, "_validateCurrentText is called after rerendering");

		// Arrange
		oSpy.reset();

		// Simulating keystroke
		this.oControl._isOninputTriggered = true;

		// Act
		this.oControl.onBeforeRendering();

		// Assert
		assert.strictEqual(oSpy.callCount, 0, "_validateCurrentText not called anymore");

		// Cleanup
		oSpy.restore();
	});

	QUnit.test("Flag _pendingAutoTokenGeneration lifecycle", function (assert) {
		// Arrange
		assert.expect(3);

		// Mock method so we can validate if the property is set before
		this.oControl._validateCurrentText = function () {
			assert.strictEqual(this.oControl._pendingAutoTokenGeneration, true,
				"Property set to true prior to calling _validateCurrentText method onBeforeRendering phase");
		}.bind(this);

		// Assert
		assert.strictEqual(this.oControl._pendingAutoTokenGeneration, undefined, "By default the property is undefined");

		// Act
		this.oControl.setValue("test");
		this.oControl.onBeforeRendering();

		// Assert
		assert.strictEqual(this.oControl._pendingAutoTokenGeneration, false,
			"Property set to false after calling _validateCurrentText method onBeforeRendering phase");
	});

	QUnit.test("setTokens should update the filter model", function (assert) {
		// Arrange
		var oFilterProvider = sinon.createStubInstance(FilterProvider),
			sFieldName = "fieldName",
			oItemToken = new Token({
				key: "1",
				text: "Key 1 (1)"
			}),
			oRangeToken = new Token({
				key: "2",
				text: "Key 2 (2)"
			}).data("range", {});

		sinon.stub(this.oControl, "_getFilterProvider").returns(oFilterProvider);
		sinon.stub(this.oControl, "_getFieldViewMetadata").returns({fieldName: sFieldName});

		// Act
		this.oControl.setTokens([oItemToken, oRangeToken]);

		// Assert
		assert.ok(oFilterProvider._tokenUpdate.calledOnce);
	});

	QUnit.test("setTokens rises the _pendingAutoTokenGeneration flag", function (assert) {
		// Arrange
		var oFPMock = {
			_tokenUpdate: function (oSettings) {
				// Assert
				assert.strictEqual(oSettings.control._pendingAutoTokenGeneration, true,
					"flag set to true prior to calling _tokenUpdate");
			}
		};

		this.oControl._setFilterProvider(oFPMock);

		// Act
		this.oControl.setTokens([new Token()]);

		// Assert
		assert.strictEqual(this.oControl._pendingAutoTokenGeneration, false,
			"flag set to false after to calling _tokenUpdate");
	});

	QUnit.test("Override tokenizer aggregation", async function(assert) {
		// Act
		this.oControl.placeAt("qunit-fixture");
		await nextUIUpdate();

		// Assert
		assert.strictEqual(this.oControl.getAggregation("tokenizer").getMetadata().getName(), "sap.ui.comp.smartfilterbar.SFBTokenizer", "Tokenizer aggregation is correct.");
	});

	QUnit.test("Triggering copy execute correct methods", async function(assert) {
		// Arrange
		var oSpy = this.spy(SFBTokenizer.prototype, "_copy"),
			oSpyFillClipboard = this.spy(SFBTokenizer.prototype, "_fillClipboard");
		this.oControl.placeAt("qunit-fixture");
		await nextUIUpdate();

		this.oControl.addToken(new Token({text: "Token1"}));
		this.oControl.addToken(new Token({text: "Token2"}));

		this.oControl.focus();

		await nextUIUpdate();

		qutils.triggerEvent("keydown", this.oControl.getAggregation("tokenizer").getFocusDomRef(), {
			which: KeyCodes.A,
			ctrlKey: true
		});

		qutils.triggerEvent("keydown", this.oControl.getAggregation("tokenizer").getFocusDomRef(), {
			which: KeyCodes.C,
			ctrlKey: true
		});

		// assert
		assert.ok(oSpy.called, "SFBTokenizer's _copy method is called");
		assert.ok(oSpyFillClipboard.called, "SFBTokenizer's _fillClipboard method is called");

		// cleanup
		oSpy.restore();
	});

	QUnit.test("Triggering copy execute correct methods and provides correct clipboard content", async function(assert) {

		// Arrange
		var oFilterProvider = sinon.createStubInstance(FilterProvider),
			sFieldName = "fieldName",
			oSpyFillClipboard = this.spy(SFBTokenizer.prototype, "_fillClipboard"),
			oSpyTextForCopy = this.spy(SFBMultiInput.prototype, "_getTextForCopy"),
			oItemToken = new Token({
				key: "1",
				text: "Key 1 (1)"
			}),
			oClipboardStub, sClipboardText;

		oClipboardStub = sinon.stub(window, "navigator").value({
			clipboard: {
				writeText: function(sText) {
					sClipboardText = sText;
					return Promise.resolve(sClipboardText);
				}
			}
		});

		oFilterProvider._aValueListProvider = [{
			"sFieldName": sFieldName,
			"sTokenDisplayBehaviour": "descriptionAndId"
		}];

		sinon.stub(this.oControl, "_getFilterProvider").returns(oFilterProvider);
		sinon.stub(this.oControl, "_getFieldViewMetadata").returns({fieldName: sFieldName});

		this.oControl.oFieldViewMetadata = {
			name: sFieldName
		};

		// Act
		this.oControl.setTokens([oItemToken]);

		this.oControl.placeAt("qunit-fixture");
		await nextUIUpdate();

		qutils.triggerEvent("keydown", this.oControl.getAggregation("tokenizer").getFocusDomRef(), {
			which: KeyCodes.A,
			ctrlKey: true
		});

		qutils.triggerEvent("keydown", this.oControl.getAggregation("tokenizer").getFocusDomRef(), {
			which: KeyCodes.C,
			ctrlKey: true
		});

		// Assert
		assert.ok(oSpyFillClipboard.called, "SFBTokenizer's _fillClipboard method is called");
		assert.ok(oSpyTextForCopy.called, "SFBTokenizer's _getTextForCopy method is called");
		assert.equal(oSpyTextForCopy.returnValues[0], "1\tKey 1 ", "SFBTokenizer's _getTextForCopy returns correct value");

		// Cleanup
		oSpyFillClipboard.restore();
		oSpyTextForCopy.restore();
		oClipboardStub.restore();
	});

	QUnit.test("Triggering copy execute correct methods and provides correct clipboard content - descriptionOnly", async function(assert) {

		// Arrange
		var oFilterProvider = sinon.createStubInstance(FilterProvider),
			sFieldName = "fieldName",
			oSpyFillClipboard = this.spy(SFBTokenizer.prototype, "_fillClipboard"),
			oSpyTextForCopy = this.spy(SFBMultiInput.prototype, "_getTextForCopy"),
			oItemToken = new Token({
				key: "1",
				text: "Key 1"
			}),
			oClipboardStub, sClipboardText;

		oClipboardStub = sinon.stub(window, "navigator").value({
			clipboard: {
				writeText: function(sText) {
					sClipboardText = sText;
					return Promise.resolve(sClipboardText);
				}
			}
		});

		oFilterProvider._aValueListProvider = [{
			"sFieldName": sFieldName,
			"sTokenDisplayBehaviour": "descriptionOnly"
		}];

		sinon.stub(this.oControl, "_getFilterProvider").returns(oFilterProvider);
		sinon.stub(this.oControl, "_getFieldViewMetadata").returns({fieldName: sFieldName});

		this.oControl.oFieldViewMetadata = {
			name: sFieldName
		};

		// Act
		this.oControl.setTokens([oItemToken]);

		this.oControl.placeAt("qunit-fixture");
		await nextUIUpdate();

		qutils.triggerEvent("keydown", this.oControl.getAggregation("tokenizer").getFocusDomRef(), {
			which: KeyCodes.A,
			ctrlKey: true
		});

		qutils.triggerEvent("keydown", this.oControl.getAggregation("tokenizer").getFocusDomRef(), {
			which: KeyCodes.C,
			ctrlKey: true
		});

		// Assert
		assert.ok(oSpyFillClipboard.called, "SFBTokenizer's _fillClipboard method is called");
		assert.ok(oSpyTextForCopy.called, "SFBTokenizer's _getTextForCopy method is called");
		assert.equal(oSpyTextForCopy.returnValues[0], "1\tKey 1", "SFBTokenizer's _getTextForCopy returns correct value");

		// Cleanup
		oSpyFillClipboard.restore();
		oSpyTextForCopy.restore();
		oClipboardStub.restore();
	});

	QUnit.test("Triggering copy of condition tokens executes correct methods and provides correct clipboard content", async function (assert) {
		// Arrange
		var oFilterProvider = sinon.createStubInstance(FilterProvider),
			sFieldName = "fieldName",
			oClipboardStub,
			sClipboardText,
			oSpyFillClipboard = this.spy(SFBTokenizer.prototype, "_fillClipboard"),
			oSpyTextForCopy = this.spy(SFBMultiInput.prototype, "_getTextForCopy"),
			oRangeData = {range: {
				"exclude": false,
				"operation": "EQ",
				"value1": "*test*",
				"keyField": "fieldName"
			}},
			oRangeToken = new Token({
				text: "*test*"
			}).data("range", oRangeData);

		sinon.stub(this.oControl, "_getFilterProvider").returns(oFilterProvider);
		sinon.stub(this.oControl, "_getFieldViewMetadata").returns({fieldName: sFieldName});
		sinon.stub(this.oControl, "_getCondition").returns(oRangeData);

		oClipboardStub = sinon.stub(window, "navigator").value({
			clipboard: {
				writeText: function(sText) {
					sClipboardText = sText;
					return Promise.resolve(sClipboardText);
				}
			}
		});

		oFilterProvider._aValueListProvider = [{
			"sFieldName": sFieldName,
			"sTokenDisplayBehaviour": "descriptionOnly"
		}];

		this.oControl.oFieldViewMetadata = {
			name: sFieldName
		};

		// Act
		this.oControl.setTokens([oRangeToken]);

		this.oControl.placeAt("qunit-fixture");
		await nextUIUpdate();

		qutils.triggerEvent("keydown", this.oControl.getAggregation("tokenizer").getFocusDomRef(), {
			which: KeyCodes.A,
			ctrlKey: true
		});

		qutils.triggerEvent("keydown", this.oControl.getAggregation("tokenizer").getFocusDomRef(), {
			which: KeyCodes.C,
			ctrlKey: true
		});

		// Assert
		assert.ok(oSpyFillClipboard.called, "SFBTokenizer's _fillClipboard method is called");
		assert.ok(oSpyTextForCopy.called, "SFBTokenizer's _getTextForCopy method is called");
		assert.equal(oSpyTextForCopy.returnValues[0], "*test*", "SFBTokenizer's _getTextForCopy returns correct value");

		// Cleanup
		oSpyFillClipboard.restore();
		oSpyTextForCopy.restore();
		oClipboardStub.restore();
	});
});
