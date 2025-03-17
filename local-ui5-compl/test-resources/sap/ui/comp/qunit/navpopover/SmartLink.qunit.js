/* global  QUnit, sinon */

sap.ui.define([
	"sap/ui/core/Element",
	"sap/ui/core/Lib",
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/comp/navpopover/FakeFlpConnector",
	"sap/ui/comp/navpopover/SmartLink",
	"sap/ui/comp/navpopover/SmartLinkDelegate",
	"sap/ui/core/Control",
	"sap/ui/comp/navpopover/SemanticObjectController",
	"sap/m/Text",
	"sap/ui/comp/navpopover/Util",
	"sap/ui/base/Event",
	"sap/base/strings/whitespaceReplacer",
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/thirdparty/jquery",
	"sap/ui/comp/navpopover/LinkData",
	"sap/ui/comp/navpopover/NavigationPopoverHandler",
	"sap/ui/core/UIComponent",
	"sap/ui/core/ComponentContainer",
	"sap/ui/events/KeyCodes",
	"sap/m/Link",
	"sap/m/library",
	"sap/ui/model/Context",
	"sap/ui/model/Model",
	'sap/ui/mdc/enums/LinkType',
	"sap/ui/core/Core",
	"sap/ui/mdc/link/Panel"
], function (
	Element,
	Library,
	qutils,
	FakeFlpConnector,
	SmartLink,
	SmartLinkDelegate,
	Control,
	SemanticObjectController,
	Text,
	Util,
	Event,
	whitespaceReplacer,
	nextUIUpdate,
	jQuery,
	LinkData,
	NavigationPopoverHandler,
	UIComponent,
	ComponentContainer,
	KeyCodes,
	Link,
	mobileLibrary,
	ModelContext,
	Model,
	LinkType,
	oCore,
	Panel
) {
	"use strict";

	// shortcut for sap.m resource bundle
	var oRb = Library.getResourceBundleFor("sap.m");

	// shortcut for sap.m.EmptyIndicator
	var EmptyIndicatorMode = mobileLibrary.EmptyIndicatorMode;

	var sBaseUrl = window.location.href;

	QUnit.module("sap.ui.comp.navpopover.SmartLink", {
		beforeEach: function () {
			FakeFlpConnector.enableFakeConnector({
				TestObject: {
					links: [
						{
							action: "displayFactSheet",
							intent: sBaseUrl + "#/dummyLink1",
							text: "Fact Sheet"
						}, {
							action: "anyAction",
							intent: sBaseUrl + "#/dummyLink2",
							text: "List"
						}
					]
				}
			});
		},
		afterEach: function () {
			FakeFlpConnector.disableFakeConnector();
			SemanticObjectController.destroyDistinctSemanticObjects();
		}
	});

	QUnit.test("Whitespace rendering", async function (assert) {
		const done = assert.async();
		const sText = "Text with     5 whitespaces";
		const oSmartLink = new SmartLink({
			text: sText,
			navigationTargetsObtained: function (oEvent) {
				const sMainNavigationId = sText;
				const oMainNavigation = new LinkData({
					description: sText,
					text: sText,
					visible: true,
					href: sBaseUrl + "#/dummyLink1"
				});
				const aAvailableActions = [new LinkData({
					text: sText,
					visible: true,
					href: sBaseUrl + "#/dummyLink1"
				})];

				oEvent.getParameter("show")(sMainNavigationId, oMainNavigation, aAvailableActions, undefined);
			}
		});

		oSmartLink.placeAt("qunit-fixture");
		await nextUIUpdate();
		setTimeout(async () => {
			assert.equal(oSmartLink._getTextOfDom(), whitespaceReplacer(sText), "Whitespaces replaced");

			const oFieldInfo = oSmartLink.getFieldInfo();
			await oFieldInfo.open(undefined, { getSource: () => oSmartLink });
			const oPopover = oFieldInfo.getDependents()[0];
			assert.ok(oPopover, "Popover exists");
			assert.ok(oPopover.getContent()[0], "Panel exists");
			assert.equal(oPopover.getContent()[0].getMetadata().getName(), "sap.ui.comp.navpopover.Panel", "Panel exists");

			const oPanel = await oFieldInfo.getContent();
			const oPanelItem = oPanel.getItems()[0];
			const oVBox = oPanel._getAdditionalContentArea().getItems()[0].getItems()[0];
			const oTitle = oVBox.getItems()[0];
			const oDescription = oVBox.getItems()[1];

			assert.equal(oTitle.getContent().getText(), whitespaceReplacer(sText), "Whitespaces replaced in header link of popover");
			assert.equal(oDescription.getText(), whitespaceReplacer(sText), "Whitespaces replaced in header description of popover");
			assert.equal(oPanelItem.getText(), whitespaceReplacer(sText), "Whitespaces replaced in action link of popover");

			oSmartLink.destroy();
			done();
		}, 50);
	});

	QUnit.test("Shall be instantiable", function (assert) {
		assert.ok(new SmartLink());
	});

	QUnit.test("Undefined contactAnnotationPath", function (assert) {
		const oSmartLink = new SmartLink();

		assert.equal(oSmartLink.getContactAnnotationPath(), undefined);
	});

	QUnit.test("Constructor - defaultValue", function (assert) {
		const oSmartLink = new SmartLink();

		// assert
		assert.equal(oSmartLink.getSemanticObject(), "");
		assert.deepEqual(oSmartLink.getAdditionalSemanticObjects(), []);
		assert.equal(oSmartLink.getSemanticObjectController(), null);
		assert.equal(oSmartLink.getFieldName(), "");
		assert.equal(oSmartLink.getCreateControlCallback(), null);
		assert.equal(oSmartLink.getMapFieldToSemanticObject(), true);
		assert.equal(oSmartLink.getContactAnnotationPath(), undefined);
		assert.equal(oSmartLink.getIgnoreLinkRendering(), false);
		assert.equal(oSmartLink.getEnableAvailableActionsPersonalization(), true);
		assert.equal(oSmartLink.getUom(), undefined);

		// cleanup
		oSmartLink.destroy();
	});

	QUnit.test("Constructor", function (assert) {
		const oSmartLink = new SmartLink({
			semanticObject: "TestObject",
			additionalSemanticObjects: [
				"TestObjectAdditional"
			],
			semanticObjectController: new SemanticObjectController(),
			fieldName: "FieldName",
			createControlCallback: function () {
				return new Text({
					text: "Link"
				});
			},
			mapFieldToSemanticObject: true,
			contactAnnotationPath: "",
			ignoreLinkRendering: true
		});

		// assert
		assert.equal(oSmartLink.getContactAnnotationPath(), "");

		// cleanup
		oSmartLink.destroy();
	});

	QUnit.test("Empty Constructor", function (assert) {
		const oSmartLink = new SmartLink();

		oSmartLink.setSemanticObject("TestObject");
		oSmartLink.setAdditionalSemanticObjects([
			"TestObjectAdditional"
		]);
		oSmartLink.setSemanticObjectController(new SemanticObjectController());
		oSmartLink.setFieldName("FieldName");
		oSmartLink.setCreateControlCallback(function () {
			return new Text({
				text: "Link"
			});
		});
		oSmartLink.setMapFieldToSemanticObject(true);
		oSmartLink.setContactAnnotationPath("");
		oSmartLink.setIgnoreLinkRendering(true);

		// assert
		assert.equal(oSmartLink.getContactAnnotationPath(), "");

		// cleanup
		oSmartLink.destroy();
	});

	QUnit.test("setSemanticObjectController - via constructor", function (assert) {
		// system under test
		let oSemanticObjectController;
		const oSmartLink = new SmartLink({
			semanticObjectController: oSemanticObjectController = new SemanticObjectController(),
			fieldName: "Test Field",
			text: "Test Text"
		});

		// arrange
		assert.ok(oSemanticObjectController._aRegisteredControls.indexOf(oSmartLink) > -1);

		// cleanup
		oSmartLink.destroy();
	});

	QUnit.test("setSemanticObjectController - via setter method", function (assert) {
		// system under test
		var oSmartLink = new SmartLink({
			fieldName: "Test Field",
			text: "Test Text"
		});

		// arrange
		var oSemanticObjectController1 = new SemanticObjectController();
		var oSemanticObjectController2 = new SemanticObjectController();

		// act
		oSmartLink.setSemanticObjectController(oSemanticObjectController1);
		// assert
		assert.ok(oSemanticObjectController1._aRegisteredControls.indexOf(oSmartLink) > -1);

		// act
		oSmartLink.setSemanticObjectController(oSemanticObjectController2);
		// assert
		assert.ok(oSemanticObjectController1._aRegisteredControls.indexOf(oSmartLink) === -1);
		assert.ok(oSemanticObjectController2._aRegisteredControls.indexOf(oSmartLink) > -1);

		// cleanup
		oSmartLink.destroy();
	});

	// QUnit.test("Check setFieldName", function(assert) {
	// 	// system under test
	// 	var oSemanticObjectController;
	// 	var oSmartLink = new SmartLink({
	// 		semanticObjectController: oSemanticObjectController = new SemanticObjectController(),
	// 		fieldName: "Test Field",
	// 		text: "Test Text"
	// 	});

	// 	// arrange
	// 	var fnGetIgnoredFieldsSpy = sinon.spy(oSemanticObjectController, "getIgnoredFields");

	// 	// act
	// 	oSmartLink.setFieldName("dummy");

	// 	// assert
	// 	var done = assert.async();
	// 	SemanticObjectController.getDistinctSemanticObjects().then(function() {

	// 		assert.ok(fnGetIgnoredFieldsSpy.called);
	// 		done();

	// 		// cleanup
	// 		oSmartLink.destroy();
	// 	});
	// });

	QUnit.test("getSemanticObjectController", function (assert) {
		// system under test
		let oSemanticObjectController;
		const oSmartLink = new SmartLink({
			text: "Link",
			innerControl: new Text({
				text: "No Link"
			}),
			semanticObjectController: oSemanticObjectController = new SemanticObjectController()
		});

		// 1. arrange, act and assert
		assert.equal(oSmartLink.getSemanticObjectController(), oSemanticObjectController);

		// 2. arrange
		oSmartLink.setSemanticObjectController(null);
		// act and assert
		assert.equal(oSmartLink.getSemanticObjectController(), null);

		/*// 3. arrange
		var oParentStub = sinon.stub();
		oParentStub.getSemanticObjectController = sinon.stub().returns(oSemanticObjectController);
		oParentStub._removeChild = sinon.stub();
		oSmartLink.getParent = sinon.stub().returns(oParentStub);

		oSmartLink.placeAt("qunit-fixture");
		await nextUIUpdate();
		// act and assert
		assert.equal(oSmartLink.getSemanticObjectController(), oSemanticObjectController, "getter should find parent semanticObjectController");*/

		// cleanup
		oSmartLink.destroy();
		oSemanticObjectController.destroy();
	});

	QUnit.test("Check _getInnerControl", function (assert) {
		// system under test
		var oSmartLink = new SmartLink({
			fieldName: "Test Field",
			text: "Test Text"
		});

		// assert
		assert.ok(!oSmartLink._getInnerControl());

		var oSetInnerControl = new Control();
		var iCallbackCount = 0;
		oSmartLink.setCreateControlCallback(function () {
			iCallbackCount++;
			return oSetInnerControl;
		});

		var oInnerControl = oSmartLink._getInnerControl();
		assert.ok(oInnerControl === oSetInnerControl, "correct innercontrol should have been returned");
		assert.equal(iCallbackCount, 1, "callback should have been called once");

		oInnerControl = oSmartLink._getInnerControl();
		assert.ok(oInnerControl === oSetInnerControl, "correct innercontrol should have been returned");
		assert.equal(iCallbackCount, 1, "callback should have been called once only");

		// cleanup
		oSmartLink.destroy();
	});

	QUnit.test("innerControl", async function (assert) {
		// system under test
		const oSmartLink = new SmartLink({
			text: "Link",
			ignoreLinkRendering: true,
			innerControl: new Text({
				text: "No Link"
			})
		});

		// arrange
		const done = assert.async();

		// act
		oSmartLink.placeAt("qunit-fixture");
		await nextUIUpdate();

		SemanticObjectController.getDistinctSemanticObjects().then(function () {
			// assert
			assert.equal(oSmartLink.getInnerControl().getText(), "No Link");

			done();

			// cleanup
			oSmartLink.destroy();
		});
	});

	QUnit.test("test getInnerControlValue function", function (assert) {
		// system under test
		var oSmartLink = new SmartLink({
			fieldName: "Test Field",
			text: "Test Text"
		});
		var oInnerValue = oSmartLink.getInnerControlValue();
		assert.equal(oInnerValue, "Test Text", "no inner control, return SmartLink text");

		oSmartLink._getInnerControl = function () {
			return {
				getText: function () {
					return "Test Text";
				}
			};
		};

		oSmartLink.setIgnoreLinkRendering(true);
		oInnerValue = oSmartLink.getInnerControlValue();
		assert.equal(oInnerValue, "Test Text", "inner control provided text");

		oSmartLink._getInnerControl = function () {
			return {
				getValue: function () {
					return "Test Value";
				}
			};
		};

		oInnerValue = oSmartLink.getInnerControlValue();
		assert.equal(oInnerValue, "Test Value", "inner control provided value");

		// cleanup
		oSmartLink.destroy();
	});

	QUnit.test("onBeforeRendering", async function (assert) {
		// system under test
		const oSmartLink = new SmartLink({
			semanticObject: "TestObject",
			text: "Test Text",
			innerControl: new Text({
				text: "No Link"
			})
		});

		// arrange
		const done = assert.async();
		oSmartLink.placeAt("qunit-fixture");
		await nextUIUpdate();

		// act
		oSmartLink.setIgnoreLinkRendering(true);

		await SemanticObjectController.getDistinctSemanticObjects();
		const oFieldInfo = oSmartLink.getFieldInfo();
		const oLinkTypeWrapper = await SmartLinkDelegate.fetchLinkType(oFieldInfo);
		const runtimeType = await oLinkTypeWrapper.runtimeType;
		const bIsLink = runtimeType.type !== LinkType.Text;
		// assert
		assert.equal(bIsLink, false);
		done();

		// cleanup
		oSmartLink.destroy();
	});

	QUnit.test("onBeforeRendering", async function (assert) {
		// system under test
		var oSmartLink = new SmartLink({
			semanticObject: "TestObject",
			fieldName: "Test Field",
			text: "Test Text"
		});

		// arrange
		var done = assert.async();
		oSmartLink.placeAt("qunit-fixture");
		await nextUIUpdate();

		// act
		oSmartLink.setIgnoreLinkRendering(false);

		await SemanticObjectController.getDistinctSemanticObjects();
		const oFieldInfo = oSmartLink.getFieldInfo();
		const oLinkTypeWrapper = await SmartLinkDelegate.fetchLinkType(oFieldInfo);
		const runtimeType = await oLinkTypeWrapper.runtimeType;
		const bIsLink = runtimeType.type !== LinkType.Text;

		assert.equal(bIsLink, true);
		done();
		oSmartLink.destroy();
	});

	QUnit.test("test exit function", function (assert) {
		// system under test
		var oSmartLink = new SmartLink({
			fieldName: "Test Field",
			text: "Test Text"
		});

		var oSemanticObjectController = new SemanticObjectController();

		oSmartLink.setSemanticObjectController(oSemanticObjectController);
		assert.equal(oSemanticObjectController._aRegisteredControls.length, 1, "1 control should be registered at the SemanticObjectController");

		oSmartLink.exit();
		assert.equal(oSemanticObjectController._aRegisteredControls.length, 0, "0 controls should be registered at the SemanticObjectController after exit");

		// cleanup
		oSmartLink.destroy();
	});

	QUnit.test("BCP 1670108744 - order of constructor's attributes", function (assert) {
		// arrange
		var oSemanticObjectController = new SemanticObjectController();

		var oSmartLink = new SmartLink({
			// first create and set semanticObjectController
			semanticObjectController: oSemanticObjectController,
			// and then set semanticObject
			semanticObject: "TestObject",
			fieldName: "DataField",
			text: "Test Text"
		});

		assert.equal(oSmartLink.getIgnoreLinkRendering(), false);
	});

	QUnit.test("BCP 1670197747 - render of sap.m.Link", async function (assert) {
		// system under test
		var oSmartLink = new SmartLink({
			text: "Link",
			ignoreLinkRendering: true,
			innerControl: new Text({
				text: "No Link"
			})
		});

		// arrange
		oSmartLink.placeAt("qunit-fixture");
		await nextUIUpdate();

		// assert
		assert.equal(jQuery("#qunit-fixture").find("a").length, 0);

		// cleanup
		oSmartLink.destroy();
	});

	QUnit.test("BCP 1670197747 - render of sap.m.Link", async function (assert) {
		// system under test
		var oSmartLink = new SmartLink({
			text: "Link",
			ignoreLinkRendering: false
		});

		// arrange
		oSmartLink.placeAt("qunit-fixture");
		await nextUIUpdate();

		// assert
		assert.equal(jQuery("#qunit-fixture").find("a").length, 1);

		// cleanup
		oSmartLink.destroy();
	});

	QUnit.test("Disabled link should not be clickable", async function (assert) {
		// system under test
		var oSmartLink = new SmartLink({
			text: "Link",
			ignoreLinkRendering: true,
			innerControl: new Text({
				text: "No Link"
			})
		});

		// arrange
		var done = assert.async();

		// act
		oSmartLink.placeAt("qunit-fixture");
		await nextUIUpdate();

		// assert
		await SemanticObjectController.getDistinctSemanticObjects();
		const oFieldInfo = oSmartLink.getFieldInfo();
		const oLinkTypeWrapper = await SmartLinkDelegate.fetchLinkType(oFieldInfo);
		const runtimeType = await oLinkTypeWrapper.runtimeType;
		const bIsText = runtimeType.type === LinkType.Text;

		assert.equal(bIsText, true);
		done();
		oSmartLink.destroy();
	});

	QUnit.module("sap.ui.comp.navpopover.SmartLink", {
		beforeEach: function () {
			FakeFlpConnector.enableFakeConnector({
				TestObject: {
					links: [
						{
							action: "displayFactSheet",
							intent: sBaseUrl + "#/dummyLink1",
							text: "Fact Sheet"
						}, {
							action: "anyAction",
							intent: sBaseUrl + "#/dummyLink2",
							text: "List"
						}
					]
				}
			});
			this.oSmartLink = new SmartLink({
				semanticObject: "TestObject"
			});
		},
		afterEach: function () {
			this.oSmartLink.destroy();
			FakeFlpConnector.disableFakeConnector();
			SemanticObjectController.destroyDistinctSemanticObjects();
		}
	});

	QUnit.test("setIgnoreLinkRendering", async function (assert) {
		// act
		this.oSmartLink.setIgnoreLinkRendering(undefined);

		// assertions
		const done = assert.async();
		await SemanticObjectController.getDistinctSemanticObjects();
		const oFieldInfo = this.oSmartLink.getFieldInfo();
		const oLinkTypeWrapper = await SmartLinkDelegate.fetchLinkType(oFieldInfo);
		const runtimeType = await oLinkTypeWrapper.runtimeType;
		const bIsLink = runtimeType.type !== LinkType.Text;

		assert.equal(bIsLink, true);
		done();
	});

	QUnit.test("setIgnoreLinkRendering", async function (assert) {
		// act
		this.oSmartLink.setIgnoreLinkRendering(false);

		// assert
		const done = assert.async();
		await SemanticObjectController.getDistinctSemanticObjects();
		const oFieldInfo = this.oSmartLink.getFieldInfo();
		const oLinkTypeWrapper = await SmartLinkDelegate.fetchLinkType(oFieldInfo);
		const runtimeType = await oLinkTypeWrapper.runtimeType;
		const bIsLink = runtimeType.type !== LinkType.Text;

		assert.equal(bIsLink, true);
		done();
	});

	QUnit.test("setIgnoreLinkRendering", async function (assert) {
		// act
		this.oSmartLink.setIgnoreLinkRendering(true);

		// assert
		const done = assert.async();
		await SemanticObjectController.getDistinctSemanticObjects();
		const oFieldInfo = this.oSmartLink.getFieldInfo();
		const oLinkTypeWrapper = await SmartLinkDelegate.fetchLinkType(oFieldInfo);
		const runtimeType = await oLinkTypeWrapper.runtimeType;
		const bIsText = runtimeType.type === LinkType.Text;

		assert.equal(bIsText, true);
		done();
	});

	QUnit.module("sap.ui.comp.navpopover.SmartLink", {
		beforeEach: function () {
			FakeFlpConnector.enableFakeConnector({
				TestObject: {
					links: [
						{
							action: "displayFactSheet",
							intent: sBaseUrl + "#/dummyLink1",
							text: "Fact Sheet"
						}, {
							action: "anyAction",
							intent: sBaseUrl + "#/dummyLink2",
							text: "List"
						}
					]
				},
				TestObject2: {
					links: [
						{
							action: "displayFactSheet",
							intent: sBaseUrl + "#/dummyLink1",
							text: "Fact Sheet"
						}, {
							action: "anyAction",
							intent: sBaseUrl + "#/dummyLink2",
							text: "{List}"
						}
					]
				}
			});
		},
		afterEach: function () {
			this.oSmartLink.destroy();
			FakeFlpConnector.disableFakeConnector();
			SemanticObjectController.destroyDistinctSemanticObjects();
		}
	});

	QUnit.test("setSemanticObject - default", async function (assert) {
		// act
		this.oSmartLink = new SmartLink();

		// assert
		const done = assert.async();
		await SemanticObjectController.getDistinctSemanticObjects();
		const oFieldInfo = this.oSmartLink.getFieldInfo();
		const oLinkTypeWrapper = await SmartLinkDelegate.fetchLinkType(oFieldInfo);
		const runtimeType = await oLinkTypeWrapper.runtimeType;
		const bIsText = runtimeType.type === LinkType.Text;

		assert.equal(bIsText, true);
		done();
	});

	QUnit.test("setSemanticObject - invalid semanticObject", async function (assert) {
		// act
		this.oSmartLink = new SmartLink({
			semanticObject: "dummy"
		});

		// assert
		const done = assert.async();
		await SemanticObjectController.getDistinctSemanticObjects();
		const oFieldInfo = this.oSmartLink.getFieldInfo();
		const oLinkTypeWrapper = await SmartLinkDelegate.fetchLinkType(oFieldInfo);
		const runtimeType = await oLinkTypeWrapper.runtimeType;
		const bIsText = runtimeType.type === LinkType.Text;

		assert.equal(bIsText, true);
		done();
	});

	QUnit.test("setSemanticObject - valid semanticObject", async function (assert) {
		// act
		this.oSmartLink = new SmartLink({
			semanticObject: "TestObject"
		});

		// assert
		const done = assert.async();
		await SemanticObjectController.getDistinctSemanticObjects();
		const oFieldInfo = this.oSmartLink.getFieldInfo();
		const oLinkTypeWrapper = await SmartLinkDelegate.fetchLinkType(oFieldInfo);
		const runtimeType = await oLinkTypeWrapper.runtimeType;
		const bIsLink = runtimeType.type !== LinkType.Text;

		assert.equal(bIsLink, true);
		done();
	});

	QUnit.test("setSemanticObject - async", async function (assert) {
		// act
		this.oSmartLink = new SmartLink({
			semanticObject: "TestObject"
		});
		this.oSmartLink.setSemanticObject(null);

		// assert
		const done = assert.async();
		await SemanticObjectController.getDistinctSemanticObjects();
		const oFieldInfo = this.oSmartLink.getFieldInfo();
		const oLinkTypeWrapper = await SmartLinkDelegate.fetchLinkType(oFieldInfo);
		const runtimeType = await oLinkTypeWrapper.runtimeType;
		const bIsText = runtimeType.type == LinkType.Text;

		assert.equal(bIsText, true);
		done();
	});

	QUnit.test("enabled - with contactAnnotationPath", async function (assert) {

		// act
		this.oSmartLink = new SmartLink({
			semanticObject: "Dummy",
			contactAnnotationPath: "to_Supplier"
		});

		// assert
		const done = assert.async();
		await SemanticObjectController.getDistinctSemanticObjects();
		const oFieldInfo = this.oSmartLink.getFieldInfo();
		const oLinkTypeWrapper = await SmartLinkDelegate.fetchLinkType(oFieldInfo);
		const runtimeType = await oLinkTypeWrapper.runtimeType;
		const bIsLink = runtimeType.type !== LinkType.Text;

		assert.equal(bIsLink, true);
		done();
	});

	QUnit.module("sap.ui.comp.navpopover.SmartLink - rendering", {
		beforeEach: function () {
			FakeFlpConnector.enableFakeConnector({
				TestObject: {
					links: [
						{
							action: "displayFactSheet",
							intent: sBaseUrl + "#/dummyLink1",
							text: "Fact Sheet"
						}, {
							action: "anyAction",
							intent: sBaseUrl + "#/dummyLink2",
							text: "List"
						}
					]
				}
			});
		},
		afterEach: function () {
			FakeFlpConnector.disableFakeConnector();
			SemanticObjectController.destroyDistinctSemanticObjects();
		}
	});

	QUnit.test("SmartLink with UoM", async function (assert) {
		const oSmartLink = new SmartLink({
			semanticObject: "TestObject",
			text: "123"
		});
		oSmartLink.placeAt("qunit-fixture");

		// act
		await nextUIUpdate();
		// assert
		assert.equal(oSmartLink.$().find("span").length, 1, "SmartLink without UoM has one span element");

		// act
		oSmartLink.setUom("JPY");
		await nextUIUpdate();
		// assert
		assert.equal(oSmartLink.$().find("span").length, 3, "SmartLink with UoM includes 3 span elements");
		assert.equal(oSmartLink.$().find("span")[2].textContent.length, 6, "UoM span element has a text of length 6");
		assert.ok(oSmartLink.$().find("span")[2].textContent.startsWith("\u2007"), "UoM span element has a text starting with a spacer");
	});

	QUnit.test("SmartLink w/o text", async function (assert) {
		const oSmartLink = new SmartLink({
			semanticObject: "TestObject",
			text: ""
		});
		oSmartLink.placeAt("qunit-fixture");
		await nextUIUpdate();

		assert.equal(oSmartLink.getDomRef().getAttribute("aria-hidden"), "true", "aria-hidden set to true when no text given.");

		oSmartLink.setText("test");
		await nextUIUpdate();
		assert.equal(oSmartLink.getDomRef().getAttribute("aria-hidden"), null, "aria-hidden not set when text given.");
	});

	QUnit.test("Rendering empty indicator", async function (assert) {
		const oSmartLink = new SmartLink({
			semanticObject: "TestObject",
			text: "",
			emptyIndicatorMode: EmptyIndicatorMode.On
		});
		oSmartLink.placeAt("qunit-fixture");
		await nextUIUpdate();

		// assert
		assert.equal(oSmartLink.getDomRef().getAttribute("aria-hidden"), null, "aria-hidden not set when no text given and empty indicator enabled.");
		assert.equal(oSmartLink.$().find("span").length, 4, "SmartLink with empty indicator includes 4 span elements");
		assert.equal(oSmartLink.$().find("span")[2].textContent, oRb.getText("EMPTY_INDICATOR"), "Empty indicator span element is present");
		assert.equal(oSmartLink.$().find("span")[3].textContent, oRb.getText("EMPTY_INDICATOR_TEXT"), "Invisible text 'EMPTY_INDICATOR_TEXT' for acc is present");
	});

	QUnit.test("Rendering emptyIndicator with UoM", async function (assert) {
		const oSmartLink = new SmartLink({
			semanticObject: "TestObject",
			text: "",
			emptyIndicatorMode: EmptyIndicatorMode.On,
			uom: "JPY"
		});
		oSmartLink.placeAt("qunit-fixture");
		await nextUIUpdate();

		// assert
		assert.equal(oSmartLink.getDomRef().getAttribute("aria-hidden"), null, "aria-hidden not set when no text given and empty indicator enabled.");
		assert.equal(oSmartLink.$().find("span").length, 6, "SmartLink with empty indicator includes 6 span elements");
		assert.equal(oSmartLink.$().find("span")[3].textContent, oRb.getText("EMPTY_INDICATOR"), "Empty indicator span element is present");
		assert.equal(oSmartLink.$().find("span")[4].textContent, oRb.getText("EMPTY_INDICATOR_TEXT"), "Invisible text 'EMPTY_INDICATOR_TEXT' for acc is present");
		assert.ok(oSmartLink.$().find("span")[5].textContent.startsWith("\u2007"), "UoM span starts with a spacer");
		assert.ok(oSmartLink.$().find("span")[5].textContent.endsWith("JPY"), "UoM span ends with correct UoM value");
	});

	QUnit.module("sap.ui.comp.navpopover.SmartLink - navigation", {
		beforeEach: function (oTestData) {
			const sTestId = oTestData.test.testId;
			const oSettings = {};
			oSettings[`TestObject-${sTestId}`] = {
				links: [
					{
						action: "displayFactSheet",
						intent: sBaseUrl + "#/dummyLink1",
						text: "Fact Sheet"
					}, {
						action: "anyAction",
						intent: sBaseUrl + "#/dummyLink2",
						text: "List"
					}
				]
			};
			oSettings[`TestObject2-${sTestId}`] = {
				links: [
					{
						action: "displayFactSheet",
						intent: sBaseUrl + "#/dummyLink1",
						text: "Fact Sheet"
					}, {
						action: "anyAction",
						intent: sBaseUrl + "#/dummyLink2",
						text: "{List}"
					}
				]
			};
			FakeFlpConnector.enableFakeConnector(oSettings);
		},
		afterEach: function () {
			this.oSmartLink.destroy();
			FakeFlpConnector.disableFakeConnector();
			SemanticObjectController.destroyDistinctSemanticObjects();
		}
	});

	QUnit.test("direct navigation handling with empty href in MainNavigation and 1 available action", async function (assert) {
		var done = assert.async(2);
		this.oSmartLink = new SmartLink({
			semanticObject: "TestObject",
			navigationTargetsObtained: function (oEvent) {
				var sMainNavigationId = "MainNavigation";
				var oMainNavigation = new LinkData({
					description: "",
					text: "MainNavigation",
					visible: true
				});
				var aAvailableActions = [new LinkData({
					text: "DummyLink1",
					href: sBaseUrl + "#/dummyLink1"
				})];

				oEvent.getParameter("show")(sMainNavigationId, oMainNavigation, aAvailableActions, undefined);
			}
		});

		const fnCheckWindowUrl = function () {
			window.removeEventListener('hashchange', fnCheckWindowUrl);
			var oResultUrl = window.location.href;
			assert.equal(oResultUrl, sBaseUrl + "#/dummyLink1", "Navigation happened");

			done();
		};
		window.addEventListener('hashchange', fnCheckWindowUrl);

		this.oSmartLink.placeAt("qunit-fixture");
		await nextUIUpdate();

		const oFieldInfo = this.oSmartLink.getFieldInfo();
		await oFieldInfo.open(undefined, { getSource: () => this.oSmartLink });
		done();
	});

	QUnit.test("appStateKey is set correctly", function (assert) {
		// arrange
		const done = assert.async();
		const sSemanticObject = "TestObject-" + assert.test.testId;
		this.oSmartLink = new SmartLink({
			semanticObject: sSemanticObject
		});

		const fnSetAppStateKey = sinon.spy(this.oSmartLink, "_setAppStateKey");
		const oFieldInfo = this.oSmartLink.getFieldInfo();

		assert.ok(fnSetAppStateKey.notCalled, "_setAppStateKey of SmartLink was not called yet.");

		// act
		return oFieldInfo.getContent().then(function (oPanel) {
			oPanel.placeAt("qunit-fixture");
			oCore.applyChanges();

			assert.ok(oPanel, "Panel exists");

			// assert
			assert.ok(fnSetAppStateKey.called, "_setAppStateKey of SmartLink was called.");
			done();
		});
	});

	QUnit.test("beforeNavigationCallback of SemanticObjectController", function (assert) {
		const done = assert.async();
		const sSemanticObject = "TestObject-" + assert.test.testId;
		const fnBeforeNavigationCallback = function () {
			return new Promise(function (resolve) {
				setTimeout(function () {
					resolve(true);
				}, 2000);
			});
		};
		this.oSmartLink = new SmartLink({
			semanticObject: sSemanticObject,
			semanticObjectController: new SemanticObjectController({
				beforeNavigationCallback: fnBeforeNavigationCallback
			})
		});

		const oSemanticObjectController = this.oSmartLink.getSemanticObjectController();

		const fnFireInnerNavigateSpySmartLink = sinon.spy(this.oSmartLink, "fireInnerNavigate");
		const fnFireNavigateSpySemanticObjectController = sinon.spy(oSemanticObjectController, "fireNavigate");

		const oFieldInfo = this.oSmartLink.getFieldInfo();

		// check if SmartLink, SemanticObjectController and NavigationPopoverHandler have the same beforeNavigationCallback function
		assert.equal(this.oSmartLink.getBeforeNavigationCallback(), oSemanticObjectController.getBeforeNavigationCallback(), "beforeNavigationCallback of SmartLink and SemanticObjectController is equal");

		return oFieldInfo.getContent().then(function (oPanel) {
			oPanel.placeAt("qunit-fixture");
			oCore.applyChanges();

			assert.ok(oPanel, "Panel exists");

			assert.ok(fnFireInnerNavigateSpySmartLink.notCalled, "fireInnerNavigate of SmartLink not called yet.");
			assert.ok(fnFireNavigateSpySemanticObjectController.notCalled, "fireNavigate of SemanticObjectController not called yet.");

			const oLink = oPanel._getAdditionalContentArea().getItems()[0].getItems()[0].getItems()[0].getContent();
			assert.ok(oLink, "sap.m.Link on Panel exists.");

			oLink.firePress({
				getSource: () => oLink
			});

			setTimeout(function () {
				assert.ok(fnFireInnerNavigateSpySmartLink.calledOnce, "fireInnerNavigate of SmartLink called once.");
				assert.ok(fnFireNavigateSpySemanticObjectController.calledOnce, "fireNavigate of SemanticObjectController called once.");
				assert.ok(window.location.href.includes("#/dummyLink1"), "URL changed correctly.");

				fnFireInnerNavigateSpySmartLink.restore();
				fnFireNavigateSpySemanticObjectController.restore();
				done();
			}, 2000);
		});
	});

	const fnCheckBeforeNavigationCallbackNavigationInformation = async function (assert, oSmartLink, oExpectedNavigationInfo) {
		const done = assert.async(2);
		const fnBeforeNavigationCallback = function (oNavigationInfo) {
			//	Unset beforeNavigationCallback of SmartLink (and NavigationPopoverHandler) as we otherwise won't get into SemanticObjectControllers beforeNavigationCallback call
			oSmartLink.setBeforeNavigationCallback(undefined);
			assert.deepEqual(oNavigationInfo, oExpectedNavigationInfo, "Correct navigation information forwarded.");
			done();
			return new Promise(function (resolve) {
				resolve(true);
			});
		};

		oSmartLink.setSemanticObjectController(new SemanticObjectController({
			beforeNavigationCallback: fnBeforeNavigationCallback
		}));

		const oSemanticObjectController = oSmartLink.getSemanticObjectController();
		const oLink = oSmartLink.getFieldInfo();
		const oBindingContext = oLink._getControlBindingContext();
		const sBindingPath = oBindingContext?.getPath() ?? null;
		const oODataModel = oSmartLink.getModel();
		const oSemanticObjects = await Util.retrieveSemanticObjectMapping(oSmartLink.getFieldName(), oODataModel, sBindingPath);
		const oSemanticAttributes = SmartLinkDelegate._calculateSemanticAttributes(oSemanticObjects, oLink, oBindingContext);

		oExpectedNavigationInfo.semanticAttributes = oSemanticAttributes ? oSemanticAttributes[oExpectedNavigationInfo.semanticObject] : oSemanticAttributes;
		oExpectedNavigationInfo.originalId = oSmartLink?.getId();

		// check if SmartLink, SemanticObjectController and NavigationPopoverHandler have the same beforeNavigationCallback function
		assert.equal(oSmartLink.getBeforeNavigationCallback(), oSemanticObjectController.getBeforeNavigationCallback(), "beforeNavigationCallback of SmartLink and SemanticObjectController is equal");

		const oFieldInfo = oSmartLink.getFieldInfo();
		await oFieldInfo.open(undefined, { getSource: () => oSmartLink });
		const oPopover = oFieldInfo.getDependents()[0];

		assert.ok(oPopover, "Popover exists");

		const oMockEvent = {
			getSource: () => {
				return {
					getText: () => oExpectedNavigationInfo.text,
					getHref: () => oExpectedNavigationInfo.href,
					data: () => oExpectedNavigationInfo.href,
					isA: () => false
				};
			}
		};

		await oFieldInfo.getControlDelegate().beforeNavigationCallback(oFieldInfo, oMockEvent);
		await oFieldInfo.getControlDelegate().beforeNavigationCallback(oFieldInfo, oMockEvent);
	};

	QUnit.test("beforeNavigationCallback returns correct navigation information", function (assert) {
		const sSemanticObject = "TestObject-" + assert.test.testId;
		this.oSmartLink = new SmartLink({
			semanticObject: sSemanticObject
		});

		const oExpectedNavigationInfo = {
			text: "Fact Sheet",
			href: sBaseUrl + "#/dummyLink1",
			semanticObject: sSemanticObject,
			semanticAttributes: {}
		};

		fnCheckBeforeNavigationCallbackNavigationInformation(assert, this.oSmartLink, oExpectedNavigationInfo);
	});

	QUnit.test("beforeNavigationCallback returns correct navigation information for additionalSemanticObjects", function (assert) {
		const sSemanticObject = "TestObject-" + assert.test.testId;
		this.oSmartLink = new SmartLink({
			semanticObject: sSemanticObject,
			additionalSemanticObjects: ["SemanticObject"]
		});

		const oExpectedNavigationInfo = {
			text: "Action 1",
			href: sBaseUrl + "#SemanticObject-action1",
			semanticObject: "SemanticObject",
			semanticAttributes: {}
		};

		fnCheckBeforeNavigationCallbackNavigationInformation(assert, this.oSmartLink, oExpectedNavigationInfo);
	});

	QUnit.test("prevent binding propagation from FLP", async function (assert) {
		const done = assert.async();
		const sSemanticObject = "TestObject2-" + assert.test.testId;
		this.oSmartLink = new SmartLink({
			semanticObject: sSemanticObject
		});
		this.oSmartLink.placeAt("qunit-fixture");

		// act
		await nextUIUpdate();

		const oFieldInfo = this.oSmartLink.getFieldInfo();
		const oPanel = await oFieldInfo.getContent();
		const aAvailableActions = oPanel._getLinkControls();
		assert.equal(aAvailableActions[0].getText(), "{List}");
		done();
	});

	QUnit.test("overwrite navigationTargetsObtained event handling when SemanticObjectController is set", function (assert) {
		const done = assert.async();
		const fnNavigationTargetsObtainedSmartLink = function (oEvent) {
			assert.equal(oEvent.getParameters().show, "SmartLink", "SmartLink: navigationTargetsObtained event handled in SmartLink.");
		};
		const fnNavigationTargetsObtainedSemanticObjectController = function (oEvent) {
			assert.equal(oEvent.getParameters().show, "SemanticObjectController", "SemanticObjectController: navigationTargetsObtained event handled in SemanticObjectController.");
			done();
		};
		const sSemanticObject = "TestObject2-" + assert.test.testId;
		this.oSmartLink = new SmartLink({
			semanticObject: sSemanticObject
		});
		var oSemanticObjectController = new SemanticObjectController({});
		this.oSmartLink.placeAt("qunit-fixture");

		assert.ok(!this.oSmartLink.hasListeners("navigationTargetsObtained"), "SmartLink: no event listener set.");

		this.oSmartLink.attachNavigationTargetsObtained(fnNavigationTargetsObtainedSmartLink);

		assert.ok(this.oSmartLink.hasListeners("navigationTargetsObtained"), "SmartLink: has event listener.");
		assert.equal(this.oSmartLink.mEventRegistry.navigationTargetsObtained.length, 1, "SmartLink: correct amount of event listeners.");
		assert.equal(this.oSmartLink.mEventRegistry.navigationTargetsObtained[0].fFunction, fnNavigationTargetsObtainedSmartLink, "SmartLink: correct event listener function.");

		this.oSmartLink.fireNavigationTargetsObtained({
			show: "SmartLink"
		});

		this.oSmartLink.setSemanticObjectController(oSemanticObjectController);

		assert.equal(this.oSmartLink.mEventRegistry.navigationTargetsObtained[0].fFunction, fnNavigationTargetsObtainedSmartLink, "SmartLink: event handling didn't change after SemanticObjectController was set without event handling.");

		oSemanticObjectController.attachNavigationTargetsObtained(fnNavigationTargetsObtainedSemanticObjectController);
		this.oSmartLink.setSemanticObjectController(undefined);
		this.oSmartLink.setSemanticObjectController(oSemanticObjectController);

		assert.equal(this.oSmartLink.mEventRegistry.navigationTargetsObtained[0].fFunction, fnNavigationTargetsObtainedSmartLink, "SmartLink: event handling didn't change after SemanticObjectController was set with replaceSmartLinkNavigationTargetsObtained = false.");

		oSemanticObjectController.setReplaceSmartLinkNavigationTargetsObtained(true);
		this.oSmartLink.setSemanticObjectController(undefined);
		this.oSmartLink.setSemanticObjectController(oSemanticObjectController);

		assert.ok(oSemanticObjectController.hasListeners("navigationTargetsObtained"), "SemanticObjectController: has event listener.");
		assert.equal(oSemanticObjectController.mEventRegistry.navigationTargetsObtained.length, 1, "SemanticObjectController: correct amount of event listeners.");
		assert.equal(oSemanticObjectController.mEventRegistry.navigationTargetsObtained[0].fFunction, fnNavigationTargetsObtainedSemanticObjectController, "SemanticObjectController: correct event listener function.");

		assert.ok(this.oSmartLink.hasListeners("navigationTargetsObtained"), "SmartLink: has event listener.");
		assert.equal(this.oSmartLink.mEventRegistry.navigationTargetsObtained.length, 1, "SmartLink: correct amount of event listeners.");
		assert.notEqual(this.oSmartLink.mEventRegistry.navigationTargetsObtained[0].fFunction, fnNavigationTargetsObtainedSmartLink, "SmartLink: event listener function changed.");

		this.oSmartLink.fireNavigationTargetsObtained({
			show: "SemanticObjectController"
		});
	});

	QUnit.test("Panel navigation handling with SemanticObjectController", async function (assert) {
		const done = assert.async(2);
		const sSemanticObject = "TestObject-" + assert.test.testId;
		this.oSmartLink = new SmartLink({
			semanticObject: sSemanticObject,
			semanticObjectController: new SemanticObjectController()
		});

		const oFieldInfo = this.oSmartLink.getFieldInfo();
		const oPanel = await oFieldInfo.getContent();
		oPanel.placeAt("qunit-fixture");
		await nextUIUpdate();

		assert.ok(oPanel, "Panel exists");
		assert.equal(oPanel.getMetadata().getName(), "sap.ui.comp.navpopover.Panel", "Panel exists");

		const fnCheckWindowUrl = function () {
			window.removeEventListener('hashchange', fnCheckWindowUrl);
			var oResultUrl = window.location.href;
			assert.equal(oResultUrl, sBaseUrl + "#/dummyLink2", "Navigation happened");
			done();
		};

		window.addEventListener('hashchange', fnCheckWindowUrl);
		const fnPanelNavigateSpy = sinon.spy(Panel, "navigate");
		const fnEventPreventDefaultSpy = sinon.spy(Event.prototype, "preventDefault");

		assert.ok(fnPanelNavigateSpy.notCalled, "Panel 'navigate' function not called");
		assert.ok(fnEventPreventDefaultSpy.notCalled, "Event 'preventDefault' function not called");
		// Act
		// Press Link on Panel
		const oLink = oPanel._getLinkArea().getItems()[0].getContent()[0].getItems()[1].getItems()[0];
		oLink.firePress({
			getSource: function () {
				return oLink;
			}
		});

		setTimeout(() => {
			// assertions
			assert.ok(fnPanelNavigateSpy.calledOnce, "Panel 'navigate' function called once");
			assert.ok(fnEventPreventDefaultSpy.calledOnce, "Event 'preventDefault' function called once");

			fnPanelNavigateSpy.restore();
			fnEventPreventDefaultSpy.restore();
			done();
		}, 50);
	});

	QUnit.test("Panel navigation handling without SemanticObjectController", async function (assert) {
		const done = assert.async();
		const sSemanticObject = "TestObject-" + assert.test.testId;
		this.oSmartLink = new SmartLink({
			semanticObject: sSemanticObject
		});
		this.oSmartLink.placeAt("qunit-fixture");
		await nextUIUpdate();

		const oFieldInfo = this.oSmartLink.getFieldInfo();

		const oPanel = await oFieldInfo.getContent();
		assert.ok(oPanel, "Panel exists");
		assert.equal(oPanel.getMetadata().getName(), "sap.ui.comp.navpopover.Panel", "Panel exists");

		const fnPanelNavigateSpy = sinon.spy(Panel, "navigate");
		const fnEventPreventDefaultSpy = sinon.spy(Event.prototype, "preventDefault");

		const fnFireInnerNavigateSpySmartLink = sinon.spy(this.oSmartLink, "fireInnerNavigate");

		// Can't check if URL changes as we can't simulate the real press event; checking for Util.navigate call instead.

		// Act
		// Press Link on Popover
		const oLink = oPanel._getAdditionalContentArea().getItems()[0].getItems()[0].getItems()[0].getContent();
		oLink.firePress({
			getSource: function () {
				return oLink;
			}
		});

		// assertions
		assert.ok(fnPanelNavigateSpy.calledOnce, "Panel 'navigate' function called once");
		assert.ok(fnEventPreventDefaultSpy.calledOnce, "Event 'preventDefault' function called once");

		fnPanelNavigateSpy.restore();
		fnEventPreventDefaultSpy.restore();

		setTimeout(function () {
			assert.ok(fnFireInnerNavigateSpySmartLink.notCalled, "fireInnerNavigate of SmartLink not called.");
			fnFireInnerNavigateSpySmartLink.restore();
			done();
		}, 50);
	});

	// Skip as this is tested in sap.ui.mdc.link.Panel already
	QUnit.skip("SelectionController navigation handling", async function (assert) {
		const done = assert.async(2);
		const sSemanticObject = "TestObject-" + assert.test.testId;
		const TestComponent = UIComponent.extend("test", {
			metadata: {
				manifest: {
					"sap.app": {
						"id": "asd",
						"type": "application"
					}
				}
			},
			createContent: function () {
				return new SmartLink("IDSmartLink", {
					semanticObject: sSemanticObject
				});
			}
		});
		this.oUiComponent = new TestComponent("IDComponent");
		this.oUiComponentContainer = new ComponentContainer({
			component: this.oUiComponent,
			async: false
		});
		this.oSmartLink = this.oUiComponent.getRootControl();

		this.oUiComponentContainer.placeAt("qunit-fixture");
		await nextUIUpdate();

		const fnNavigationPopoverHandlerOnNavigateSpy = sinon.spy(this.oSmartLink, "fireInnerNavigate");

		const oFieldInfo = this.oSmartLink.getFieldInfo();
		await oFieldInfo.open(undefined, { getSource: () => this.oSmartLink });

		const oPopover = oFieldInfo.getDependents()[0];
		const oPanel = oPopover.getContent()[0];
		assert.ok(oPopover, "Popover exists");
		assert.ok(oPanel, "Panel exists");
		assert.equal(oPanel.getMetadata().getName(), "sap.ui.comp.navpopover.Panel", "Panel exists");

		oPanel.getParent = () => oPopover;

		const fnPanelNavigateSpy = sinon.spy(Panel, "navigate");

		const fnCheckWindowUrl = function () {
			window.removeEventListener('hashchange', fnCheckWindowUrl);
			var oResultUrl = window.location.href;
			assert.equal(oResultUrl, sBaseUrl + "#/dummyLink2", "Navigation happened");

			done();
		};
		window.addEventListener('hashchange', fnCheckWindowUrl);

		const oSelectionDialog = await oPanel._openPersonalizationDialog();
		assert.ok(oSelectionDialog.isA("sap.m.Dialog"), "SelectionDialog opened");

		const oLinkSelectionPanel = oSelectionDialog.getContent()[0];
		assert.ok(oLinkSelectionPanel.isA("sap.ui.mdc.p13n.panels.LinkSelectionPanel"), "LinkSelectionPanel exists");

		const oLink = oLinkSelectionPanel.getAggregation("_content").getItems()[0].getItems()[0].getCells()[0].getItems()[0].getItems()[0];
		oLink.firePress({
			getSource: function () {
				return oLink;
			}
		});

		// Assertion
		assert.ok(fnNavigationPopoverHandlerOnNavigateSpy.calledOnce, "NavigationPopoverHandler onNavigate event handling called once.");
		assert.ok(fnPanelNavigateSpy.notCalled, "Panel navigate function not called.");

		fnNavigationPopoverHandlerOnNavigateSpy.restore();
		fnPanelNavigateSpy.restore();
		done();
	});

	QUnit.test("UOM navigation handling", async function (assert) {
		const done = assert.async(4);
		const sSemanticObject = "TestObject-" + assert.test.testId;
		this.oSmartLink = new SmartLink({
			semanticObject: sSemanticObject,
			text: "123"
		});
		this.oSmartLink.placeAt("qunit-fixture");
		this.oSmartLink.setUom("JPY");

		await nextUIUpdate();

		assert.equal(this.oSmartLink.$().find("span").length, 3, "SmartLink with UoM includes 3 span elements");

		var oEventMock = {
			target: this.oSmartLink.$().find("span")[2],
			marked: false,
			setMarked: function () {
				this.marked = true;
			},
			preventDefault: function () {
				done();
			},
			which: KeyCodes.SPACE
		};

		var fnEventPreventDefaultSpy = sinon.spy(oEventMock, "preventDefault");
		var fnHandlePressSpy = sinon.spy(Link.prototype, "_handlePress");

		assert.ok(fnEventPreventDefaultSpy.notCalled, "prevent default not called yet.");
		assert.ok(fnHandlePressSpy.notCalled, "_handlePress not called yet.");

		// direct call
		this.oSmartLink._handlePress(Object.assign({}, oEventMock));
		assert.equal(fnEventPreventDefaultSpy.callCount, 1, "prevent default called once.");
		assert.equal(fnHandlePressSpy.callCount, 1, "sap/m/Link _handlePress called once.");
		assert.equal(fnHandlePressSpy.args[0][0].target, this.oSmartLink.getDomRef(), "correct target value used in sap/m/Link _handlePress.");

		// onsapenter
		this.oSmartLink.onsapenter(Object.assign({}, oEventMock));
		assert.equal(fnEventPreventDefaultSpy.callCount, 2, "prevent default called twice.");
		assert.equal(fnHandlePressSpy.callCount, 2, "sap/m/Link _handlePress called twice.");
		assert.equal(fnHandlePressSpy.args[0][0].target, this.oSmartLink.getDomRef(), "correct target value used in sap/m/Link _handlePress.");

		// onclick
		this.oSmartLink.onclick(Object.assign({}, oEventMock));
		assert.equal(fnEventPreventDefaultSpy.callCount, 3, "prevent default called thrice.");
		assert.equal(fnHandlePressSpy.callCount, 3, "sap/m/Link _handlePress called thrice.");
		assert.equal(fnHandlePressSpy.args[0][0].target, this.oSmartLink.getDomRef(), "correct target value used in sap/m/Link _handlePress.");

		// onkeyup
		this.oSmartLink.onkeyup(Object.assign({}, oEventMock));
		assert.equal(fnEventPreventDefaultSpy.callCount, 4, "prevent default called 4 times.");
		assert.equal(fnHandlePressSpy.callCount, 4, "sap/m/Link _handlePress called 4 times.");
		assert.equal(fnHandlePressSpy.args[0][0].target, this.oSmartLink.getDomRef(), "correct target value used in sap/m/Link _handlePress.");
	});

	QUnit.module("sap.ui.comp.navpopover.SmartLink: _getSemanticObjectControllerOfParent", {});

	QUnit.test("no parent", function (assert) {
		var oSmartLink = new SmartLink();

		assert.equal(oSmartLink._getSemanticObjectControllerOfParent(), undefined, "returns undefined");
	});

	QUnit.test("parent without SemanticObjectController", function (assert) {
		var oSmartLink = new SmartLink();
		var fnGetParentMock = sinon.stub(oSmartLink, "getParent").returns({
			getParent: function () {
				return false;
			}
		});

		assert.equal(oSmartLink._getSemanticObjectControllerOfParent(), undefined, "returns undefined");
		fnGetParentMock.reset();
	});

	QUnit.test("parent with SemanticObjectController", function (assert) {
		var oSmartLink = new SmartLink();
		var oSemanticObjectController = new SemanticObjectController();
		var fnGetParentMock = sinon.stub(oSmartLink, "getParent").returns({
			getParent: function () {
				return {
					getSemanticObjectController: function () {
						return oSemanticObjectController;
					}
				};
			}
		});
		var fnSetSemanticObjectControllerSpy = sinon.spy(oSmartLink, "setSemanticObjectController").withArgs(oSemanticObjectController);

		assert.deepEqual(oSmartLink._getSemanticObjectControllerOfParent(), oSemanticObjectController, "returns correct SemanticObjectController");
		assert.ok(fnSetSemanticObjectControllerSpy.called, "setSemanticObjectController called");
		assert.deepEqual(oSmartLink.getSemanticObjectController(), oSemanticObjectController, "getSemanticObjectController of SmartLink returns correct SemanticObjectController");

		fnSetSemanticObjectControllerSpy.reset();
		fnGetParentMock.reset();
	});

	QUnit.module("sap.ui.comp.navpopover.SmartLink: getAccessibilityInfo", {});

	[true, false].forEach(function (bEnabled) {
		QUnit.test((!bEnabled ? "not " : "") + "enabled SmartLink with Text and Href", function (assert) {
			const oSmartLink = new SmartLink({
				enabled: bEnabled,
				text: "Text",
				href: "#HREF"
			});
			const oExpectedAccessibilityInfo = bEnabled ? {
				"description": "Text",
				"enabled": true,
				"focusable": true,
				"role": "link",
				"type": "Link"
			} : {
				description: "Text"
			};

			assert.deepEqual(oSmartLink.getAccessibilityInfo(), oExpectedAccessibilityInfo, "Correct accessibilityInfo returned");
		});

		QUnit.test((!bEnabled ? "not " : "") + "enabled SmartLink with Href", function (assert) {
			const oSmartLink = new SmartLink({
				enabled: bEnabled,
				href: "#HREF"
			});
			const oExpectedAccessibilityInfo = bEnabled ? {
				"description": "",
				"enabled": true,
				"focusable": true,
				"role": "link",
				"type": undefined
			} : {
				description: "#HREF"
			};

			assert.deepEqual(oSmartLink.getAccessibilityInfo(), oExpectedAccessibilityInfo, "Correct accessibilityInfo returned");
		});

		QUnit.test((!bEnabled ? "not " : "") + "enabled SmartLink without Text and Href", function (assert) {
			const oSmartLink = new SmartLink({
				enabled: bEnabled
			});
			const oExpectedAccessibilityInfo = bEnabled ? {
				"description": "",
				"enabled": true,
				"focusable": true,
				"role": "link",
				"type": undefined
			} : {
				description: ""
			};

			assert.deepEqual(oSmartLink.getAccessibilityInfo(), oExpectedAccessibilityInfo, "Correct accessibilityInfo returned");
		});

		QUnit.test((!bEnabled ? "not " : "") + "enabled SmartLink without Text and Href - with UOM", function (assert) {
			const oSmartLink = new SmartLink({
				enabled: bEnabled,
				uom: " UOM"
			});
			const oExpectedAccessibilityInfo = bEnabled ? {
				"description": "",
				"enabled": true,
				"focusable": true,
				"role": "link",
				"type": undefined
			} : {
				description: ""
			};

			assert.deepEqual(oSmartLink.getAccessibilityInfo(), oExpectedAccessibilityInfo, "Correct accessibilityInfo returned");
		});

		QUnit.test((!bEnabled ? "not " : "") + "enabled SmartLink with Text - with UOM", function (assert) {
			const oSmartLink = new SmartLink({
				enabled: bEnabled,
				text: "Text",
				uom: " UOM"
			});
			const oExpectedAccessibilityInfo = bEnabled ? {
				"description": "Text UOM",
				"enabled": true,
				"focusable": true,
				"role": "link",
				"type": "Link"
			} : {
				description: "Text UOM"
			};

			assert.deepEqual(oSmartLink.getAccessibilityInfo(), oExpectedAccessibilityInfo, "Correct accessibilityInfo returned");
		});
	});

	QUnit.module("sap.ui.comp.navpopover.SmartLink: _updateEnabled", {});

	QUnit.test("ignored field in SemanticObjectController", function (assert) {
		var done = assert.async();
		var oSemanticObjectController = new SemanticObjectController({
			ignoredFields: "SmartLink"
		});
		var oSmartLink = new SmartLink({
			semanticObjectController: oSemanticObjectController,
			fieldName: "SmartLink"
		});

		assert.ok(oSmartLink.getEnabled(), "initial - SmartLink is enabled");

		oSmartLink._updateEnabled().then(function () {
			assert.notOk(oSmartLink.getEnabled(), "SmartLink is not enabled");
			done();
		});
	});

	QUnit.test("ignoreLinkRendering + forceLinkRendering", function (assert) {
		var done = assert.async();
		var oSmartLink = new SmartLink({
			ignoreLinkRendering: true,
			forceLinkRendering: true
		});

		assert.ok(oSmartLink.getEnabled(), "initial - SmartLink is enabled");

		oSmartLink._updateEnabled().then(function () {
			assert.notOk(oSmartLink.getEnabled(), "SmartLink is not enabled");
			done();
		});
	});

	QUnit.test("own forceLinkRendering", function (assert) {
		var done = assert.async();
		var oSmartLink = new SmartLink({
			enabled: false,
			forceLinkRendering: true
		});

		assert.notOk(oSmartLink.getEnabled(), "initial - SmartLink is not enabled");

		oSmartLink._updateEnabled().then(function () {
			assert.ok(oSmartLink.getEnabled(), "SmartLink is enabled");
			done();
		});
	});

	QUnit.test("SemanticObjectController forceLinkRendering", function (assert) {
		var done = assert.async();
		var oSemanticObjectController = new SemanticObjectController({
			forceLinkRendering: { "SmartLink": true }
		});
		var oSmartLink = new SmartLink({
			enabled: false,
			semanticObjectController: oSemanticObjectController,
			fieldName: "SmartLink"
		});

		assert.notOk(oSmartLink.getEnabled(), "initial - SmartLink is not enabled");

		oSmartLink._updateEnabled().then(function () {
			assert.ok(oSmartLink.getEnabled(), "SmartLink is enabled");
			done();
		});
	});

	QUnit.test("SemanticObjectController has no distinctSemanticObjects and no contactAnnotationPath", function (assert) {
		var done = assert.async();
		var oSemanticObjectController = new SemanticObjectController();
		var oSmartLink = new SmartLink({
			semanticObjectController: oSemanticObjectController
		});

		assert.ok(oSmartLink.getEnabled(), "initial - SmartLink is enabled");

		oSmartLink._updateEnabled().then(function () {
			assert.notOk(oSmartLink.getEnabled(), "SmartLink is not enabled");
			done();
		});
	});

	QUnit.start();
});
