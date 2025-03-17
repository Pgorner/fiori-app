/*global QUnit*/

sap.ui.define("test.sap.ui.comp.qunit.smartmultiinput.SmartFormCustomData", [
	"sap/ui/comp/smartmultiinput/SmartMultiInput",
	"sap/ui/comp/smartform/SmartForm",
	"sap/ui/comp/smartform/Group",
	"sap/ui/comp/smartform/GroupElement",
	"sap/ui/core/CustomData",
	"test-resources/sap/ui/comp/qunit/smartmultiinput/TestUtils",
	"sap/ui/core/format/DateFormat",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/core/message/Message",
	"sap/ui/core/message/MessageType",
	"sap/ui/core/Messaging",
	"sap/ui/qunit/utils/nextUIUpdate"
], function (SmartMultiInput, SmartForm, Group, GroupElement, CustomData, TestUtils, DateFormat, createAndAppendDiv, Message, MessageType, Messaging, nextUIUpdate) {
	"use strict";

	createAndAppendDiv("content");

	async function createSmartForm(sPropertyPath, sBindingPath, oCustomData) {
		var that = this;

		this.oSmartMultiInput = new SmartMultiInput({
			value: {
				path: sPropertyPath
			}
		});

		this.oSmartForm = new SmartForm({
			editable: true,
			groups: [
				new Group({
					groupElements: [
						new GroupElement({
							elements: [this.oSmartMultiInput]
						})
					]
				})
			]
		});

		if (oCustomData) {
			this.oSmartForm.addCustomData(oCustomData);
		}

		//Register SmartForm object under MessageManager
		Messaging.registerMessageProcessor(this.oModel);
		Messaging.registerObject(this.oSmartForm, false);

		this.oSmartForm.setModel(this.oModel);
		this.oSmartForm.bindElement({
			path: sBindingPath
		});

		this.oSmartForm.placeAt("content");
		await nextUIUpdate();

		return new Promise(function(resolve, reject) {
			that.oModel.attachRequestCompleted(function(oEvent) {
				if (oEvent.getParameter("url") === "/smartmultiinput.SmartMultiInput/Products('1')/Categories?$skip=0&$top=100") {
					resolve();
				}
			});
		});
	}

	function addMessage(sMessage, sType, sTarget, sFullTarget, oProcessor) {
		Messaging.addMessages([
			new Message({
				message: sMessage,
				type: sType,
				target: sTarget,
				fullTarget: sFullTarget,
				processor: oProcessor
			})
		]);
	}

	QUnit.module("smart form with custom data formatting", {
		before: function () {

		},
		after: function () {

		},
		beforeEach: function (assert) {
			var that = this;
			var fnDone = assert.async();

			this.oMockServer = TestUtils.createMockServer();

			TestUtils.createDataModel().then(function (oModel) {
				that.oModel = oModel;
				fnDone();
			});
		},

		afterEach: function () {
			this.oMockServer.destroy();
			this.oModel.destroy();
			delete this.oModel;
			this.oSmartForm.destroy();
		}
	});


	QUnit.test("string without custom display behaviour", async function (assert) {
		var that = this;
		var fnDone = assert.async();
		var sPropertyPath = "Categories/CategoryId";
		var sBindingPath = "/Products('1')";

		await createSmartForm.call(this, sPropertyPath, sBindingPath).then(function() {
			assert.equal(that.oSmartMultiInput.getTokens()[0].getText(), "Projector (PR)", "text should be in default formatting");

			fnDone();
		});
	});

	QUnit.test("string with custom display behaviour", async function (assert) {
		var that = this;
		var fnDone = assert.async();
		var sPropertyPath = "Categories/CategoryId";
		var sBindingPath = "/Products('1')";

		var oCustomData = new CustomData({
			key: "defaultInputFieldDisplayBehaviour",
			value: "descriptionOnly"
		});

		await createSmartForm.call(this, sPropertyPath, sBindingPath, oCustomData).then(function() {
			assert.equal(that.oSmartMultiInput.getTokens()[0].getText(), "Projector", "text should be without id");

			fnDone();
		});
	});

	QUnit.test("DateTime without custom display behaviour", async function (assert) {
		var that = this;
		var fnDone = assert.async();
		var sPropertyPath = "Categories/DateTime";
		var sBindingPath = "/Products('1')";

		await createSmartForm.call(this, sPropertyPath, sBindingPath).then(function() {
			var sText = that.oSmartMultiInput.getTokens()[0].getText();
			var oDateFormat = DateFormat.getDateInstance();
			var sExpected = oDateFormat.format(that.oSmartMultiInput.getRangeData()[0].value1);
			assert.equal(sText, sExpected, "date should be in long format");

			fnDone();
		});
	});

	QUnit.test("DateTime without long type", async function (assert) {
		var that = this;
		var fnDone = assert.async();
		var sPropertyPath = "Categories/DateTime";
		var sBindingPath = "/Products('1')";

		var oCustomData = new CustomData({
			key: "dateFormatSettings",
			value: {"UTC":true,"style":"long"}
		});

		await createSmartForm.call(this, sPropertyPath, sBindingPath, oCustomData).then(function() {
			var sText = that.oSmartMultiInput.getTokens()[0].getText();
			var oDateFormat = DateFormat.getDateInstance({style: "long"});
			var sExpected = oDateFormat.format(that.oSmartMultiInput.getRangeData()[0].value1);
			assert.equal(sText, sExpected, "date should be in long format");

			fnDone();
		});
	});

	QUnit.module("Message Handling in SmartMultiInput", {
		before: function () {

		},
		after: function () {

		},
		beforeEach: function (assert) {
			var fnDone = assert.async();

			this.oMockServer = TestUtils.createMockServer();

			TestUtils.createDataModel().then(function (oModel) {
				this.oModel = oModel;
				fnDone();
			}.bind(this));
		},

		afterEach: function () {
			this.oMockServer.destroy();
			this.oModel.destroy();
			delete this.oModel;
			this.oSmartForm.destroy();
		}
	});

	QUnit.test("Generic SmartMultiInput Error", async function (assert) {
		var fnDone = assert.async(),
			sBindingPath = "/Products('1')",
			sPropertyPath = "Categories/Description";

		await createSmartForm.call(this, sPropertyPath, sBindingPath).then(function() {

			var sErrorText = "Error Message",
				sType = MessageType.Error,
				sTarget = "/Categories",
				sFullTarget = "/Products('1')/Categories";

			addMessage.call(this, sErrorText, sType, sTarget, sFullTarget, this.oModel);

			setTimeout(function() {
				assert.equal(this.oSmartMultiInput.getValueState(), sType, "Correct Type is returned");
				assert.equal(this.oSmartMultiInput.getValueStateText(), sErrorText, "Correct Error Message is returned");

				fnDone();
			}.bind(this), 200);
		}.bind(this));
	});

	QUnit.test("Individual Token Error", async function (assert) {
		var fnDone = assert.async(),
			sBindingPath = "/Products('1')",
			sPropertyPath = "Categories/Price";

		await createSmartForm.call(this, sPropertyPath, sBindingPath).then(function() {

			var sErrorText = "Error Message",
				sType = MessageType.Error,
				sTarget = "/Categories(CategoryId='PR',ProductId='1')/Price",
				sFullTarget = "/Products('1')/Categories(CategoryId='PR',ProductId='1')/Price";

			addMessage.call(this, sErrorText, sType, sTarget, sFullTarget, this.oModel);

			setTimeout(function() {
				assert.equal(this.oSmartMultiInput.getValueState(), sType, "Correct Type is returned");
				assert.equal(this.oSmartMultiInput.getValueStateText(), sErrorText, "Correct Error Message is returned");

				fnDone();
			}.bind(this), 200);
		}.bind(this));
	});
});