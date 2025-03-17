/* global QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/navpopover/FakeFlpConnector",
	"sap/ui/comp/navpopover/SmartLink",
	"sap/ui/comp/navpopover/NavigationPopoverHandler",
	"sap/ui/comp/navpopover/SemanticObjectController",
	"sap/ui/comp/odata/MetadataAnalyser",
	"sap/base/Log",
	"sap/m/Text",
	"sap/ui/comp/navpopover/Util",
	"sap/ui/comp/navpopover/Factory",
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/comp/navpopover/SmartLinkDelegate"
], function(FakeFlpConnector, SmartLink, NavigationPopoverHandler, SemanticObjectController, MetadataAnalyser, Log, Text, Util, Factory, nextUIUpdate, SmartLinkDelegate) {
	"use strict";

	var sBaseUrl = window.location.href;

	var fnEnableFakeFlp = function() {
		FakeFlpConnector.enableFakeConnector({
			TestObject: {
				links: [
					{
						action: "displayFactSheet",
						intent: "#/dummyLink1",
						text: "Fact Sheet"
					}, {
						action: "anyAction",
						intent: "#/dummyLink2",
						text: "List"
					}
				]
			},
			TestObject2: {
				links: [
					{
						action: "displayFactSheet",
						intent: "#/dummyLink3",
						text: "Fact Sheet"
					}, {
						action: "anyAction",
						intent: "#/dummyLink4",
						text: "List2"
					}
				]
			},
			TestObject3: {
				links: []
			}
		});
	};

	QUnit.module("sap.ui.comp.navpopover.SemanticObjectController", {
		beforeEach: function() {
			fnEnableFakeFlp();
		},
		afterEach: function() {
			FakeFlpConnector.disableFakeConnector();
			SemanticObjectController.destroyDistinctSemanticObjects();
		}
	});

	QUnit.test("constructor", function(assert) {
		var oSemanticObjectController = new SemanticObjectController();
		assert.ok(oSemanticObjectController);
		assert.equal(oSemanticObjectController.getContactAnnotationPaths(), null);
		assert.equal(oSemanticObjectController.getEnableAvailableActionsPersonalization(), null);
		assert.equal(oSemanticObjectController.getMapFieldToSemanticObject(), undefined);
	});

	QUnit.test("getDistinctSemanticObjects with delay", function(assert) {
		// system under test

		// arrange
		var done = assert.async();
		var oExpectedDistinctSemanticObjects = {
			"TestObject": {},
			"TestObject2": {},
			"TestObject3": {}
		};

		SemanticObjectController.getDistinctSemanticObjects().then(function(oResult) {
			// act

			// assertions
			assert.deepEqual(oResult, oExpectedDistinctSemanticObjects, "correct distinct SemanticObjects returned");
			assert.ok(SemanticObjectController.bHasPrefetchedDistinctSemanticObjects, "bHasPrefetchedDistinctSemanticObjects set to true");
			assert.deepEqual(SemanticObjectController.getJSONModel().getProperty("/distinctSemanticObjects"), oExpectedDistinctSemanticObjects, "correct distinct SemanticObjects set in model");

			done();

			// cleanup
		});
	});

	QUnit.test("setIgnoredFields - via constructor", async function(assert) {
		// system under test
		var oSemanticObjectController = new SemanticObjectController({
			ignoredFields: "TestField, DummyField"
		});

		// arrange

		// act
		var oSmartLink = new SmartLink({
			fieldName: "TestField",
			semanticObject: "TestObject",
			semanticObjectController: oSemanticObjectController
		});

		oSmartLink.placeAt("qunit-fixture");
		await nextUIUpdate();

		// assertions
		var done = assert.async();
		SmartLinkDelegate._isSmartLinkEnabled(oSmartLink).then((bIsEnabled) => {
			assert.equal(bIsEnabled, false);

			done();

			// cleanup
			oSemanticObjectController.destroy();
			oSmartLink.destroy();
		});
	});

	QUnit.test("setIgnoredFields - via setIgnoredFields method", async function(assert) {
		// system under test
		var oSemanticObjectController = new SemanticObjectController();

		// arrange
		var oSmartLink = new SmartLink({
			fieldName: "TestField",
			semanticObject: "TestObject",
			semanticObjectController: oSemanticObjectController
		});

		// act
		oSemanticObjectController.setIgnoredFields("TestField, DummyField");

		oSmartLink.placeAt("qunit-fixture");
		await nextUIUpdate();

		// assertions
		var done = assert.async();
		SmartLinkDelegate._isSmartLinkEnabled(oSmartLink).then((bIsEnabled) => {
			assert.equal(bIsEnabled, false);

			done();

			// cleanup
			oSemanticObjectController.destroy();
			oSmartLink.destroy();
		});
	});

	QUnit.test("setIgnoredFields - via setSemanticObjectController method", async function(assert) {
		// system under test
		var oSemanticObjectController = new SemanticObjectController({
			ignoredFields: "TestField"
		});

		// arrange
		var oSmartLink = new SmartLink({
			fieldName: "TestField",
			semanticObject: "TestObject",
			semanticObjectController: new SemanticObjectController({
				ignoredFields: "DummyField"
			})
		});

		// act
		oSmartLink.setSemanticObjectController(oSemanticObjectController);

		oSmartLink.placeAt("qunit-fixture");
		await nextUIUpdate();

		// assertions
		var done = assert.async();
		SmartLinkDelegate._isSmartLinkEnabled(oSmartLink).then((bIsEnabled) => {
			assert.equal(bIsEnabled, false);

			done();

			// cleanup
			oSemanticObjectController.destroy();
			oSmartLink.destroy();
		});
	});

	QUnit.test("setIgnoredFields", function(assert) {
		// system under test
		var oSemanticObjectController = new SemanticObjectController();

		// arrange
		var oSmartLink = new SmartLink({
			fieldName: "TestField",
			semanticObject: "TestObject",
			semanticObjectController: oSemanticObjectController
		});

		// act
		oSemanticObjectController.setIgnoredFields("TestField, DummyField");
		oSemanticObjectController.setIgnoredFields("DummyField1, DummyField2");

		// assertions
		var done = assert.async();
		SemanticObjectController.getDistinctSemanticObjects().then(function() {

			assert.equal(oSmartLink.getEnabled(), true);
			done();

			// cleanup
			oSemanticObjectController.destroy();
			oSmartLink.destroy();
		});
	});

	QUnit.test("Check BeforePopoverOpens event", function(assert) {
		// system under test
		var oSemanticObjectController = new SemanticObjectController();

		var bOpenWasCalled = false;
		var oEventArgs = {
			open: function() {
				bOpenWasCalled = true;
			}
		};

		var oSmartLink = new SmartLink();
		oSemanticObjectController.registerControl(oSmartLink);

		oSmartLink.fireBeforePopoverOpens(oEventArgs);
		assert.ok(bOpenWasCalled, "SemanticObject controller has to call open if BeforePopoverOpens is not registered");

		bOpenWasCalled = false;
		var aReceivedParams = null;
		oSemanticObjectController.attachBeforePopoverOpens(function(oEvent) {
			aReceivedParams = oEvent.getParameters();
		});

		oSmartLink.fireBeforePopoverOpens(oEventArgs);
		assert.ok(!bOpenWasCalled, "SemanticObject controller should not call open if BeforePopoverOpens is registered");
		assert.ok(aReceivedParams.open === oEventArgs.open, "open function has to be forwarded via event args if BeforePopoverOpens is registered");

		// cleanup
		oSemanticObjectController.destroy();
		oSmartLink.destroy();
	});

	QUnit.test("Check TargetsObtained event", function(assert) {
		// system under test
		var oSemanticObjectController = new SemanticObjectController();

		var bShowWasCalled = false;
		var oEventArgs = {
			show: function() {
				bShowWasCalled = true;
			}
		};

		var oSmartLink = new SmartLink();
		oSemanticObjectController.registerControl(oSmartLink);

		oSmartLink.fireNavigationTargetsObtained(oEventArgs);
		assert.ok(bShowWasCalled, "SemanticObject controller has to call show if TargetsObtained is not registered");

		bShowWasCalled = false;
		var aReceivedParams = null;
		oSemanticObjectController.attachNavigationTargetsObtained(function(oEvent) {
			aReceivedParams = oEvent.getParameters();
		});

		oSmartLink.fireNavigationTargetsObtained(oEventArgs);
		assert.ok(!bShowWasCalled, "SemanticObject controller should not call open if TargetsObtained is registered");
		assert.ok(aReceivedParams.show === oEventArgs.show, "show function has to be forwarded via event args if TargetsObtained is registered");

		// cleanup
		oSemanticObjectController.destroy();
		oSmartLink.destroy();
	});

	QUnit.test("Check getFieldSemanticObjectMap function", function(assert) {
		// system under test
		var oSemanticObjectController = new SemanticObjectController();

		var oLogWarningStub = sinon.spy(Log, "warning");
		var oMyMap = {};
		var oMap = oSemanticObjectController.getFieldSemanticObjectMap();
		assert.ok(oMap === null, "no map should be returned");
		assert.ok(oLogWarningStub.calledOnce, "no map available, warning should be logged");

		sinon.stub(MetadataAnalyser.prototype, "getFieldSemanticObjectMap").returns(oMyMap);
		oSemanticObjectController.setEntitySet("dummySet");
		oMap = oSemanticObjectController.getFieldSemanticObjectMap();
		assert.ok(oMap === oMyMap, "map should be returned");
		assert.ok(MetadataAnalyser.prototype.getFieldSemanticObjectMap.calledOnce, "MetadataAnalyser function should be called once");

		oMap = oSemanticObjectController.getFieldSemanticObjectMap();
		assert.ok(MetadataAnalyser.prototype.getFieldSemanticObjectMap.calledOnce, "MetadataAnalyser function should be called only once");

		// cleanup
		oSemanticObjectController.destroy();
		oLogWarningStub.restore();
	});

	QUnit.test("Check getEntitySet function", function(assert) {
		// system under test
		var oSemanticObjectController = new SemanticObjectController();

		var oParent = {
			getParent: function() {
				return {
					getParent: function() {
						return {
							getEntitySet: function() {
								return "dummySet";
							}
						};
					}
				};
			}
		};

		oSemanticObjectController.getParent = function() {
			return oParent;
		};
		assert.equal(oSemanticObjectController.getEntitySet(), "dummySet", "entity set should be taken from parent");

		// cleanup
		oSemanticObjectController.destroy();
	});

	/**
	 * @deprecated Since 1.42.0. The property <code>prefetchNavigationTargets</code> is obsolete as navigation targets are determined
	 *             automatically. The SmartLink controls are re-rendered as soon as the asynchronous determination of navigation targets
	 *             has been completed.
	 */
	QUnit.test("setPrefetchNavigationTargets - BCP 1680068310", function(assert) {
		// system under test
		var oSemanticObjectController = new SemanticObjectController();

		// arrange
		var done = assert.async();
		oSemanticObjectController.attachPrefetchDone(function(oEvent) {
			// assertions
			assert.equal(Object.keys(oEvent.getParameters().semanticObjects).length, 3);

			done();

			// cleanup
			oSemanticObjectController.destroy();
		});

		// act
		oSemanticObjectController.setPrefetchNavigationTargets(true);
	});

	/**
	 * @deprecated Since 1.42.0. The property <code>prefetchNavigationTargets</code> is obsolete as navigation targets are determined
	 *             automatically. The SmartLink controls are re-rendered as soon as the asynchronous determination of navigation targets
	 *             has been completed.
	 * @deprecated Since 1.42.0. The method <code>hasSemanticObjectLinks</code> is obsolete because it depends on the property
	 *             <code>prefetchNavigationTargets</code> which has been deprecated.
	 */
	QUnit.test("setPrefetchNavigationTargets", function(assert) {
		// system under test
		var oSemanticObjectController = new SemanticObjectController();

		// arrange
		var fnFirePrefetchDoneSpy = sinon.spy(oSemanticObjectController, "firePrefetchDone");
		var done = assert.async();
		oSemanticObjectController.attachPrefetchDone(function(oEvent) {
			// assert
			assert.ok(fnFirePrefetchDoneSpy.calledOnce);
			assert.equal(oSemanticObjectController.hasSemanticObjectLinks("TestObject"), true);
			assert.equal(oSemanticObjectController.hasSemanticObjectLinks("dummy"), false);
			assert.equal(oSemanticObjectController.hasSemanticObjectLinks(""), false);
			assert.equal(oSemanticObjectController.hasSemanticObjectLinks(null), false);

			done();

			// cleanup
			oSemanticObjectController.destroy();
		});

		// act
		oSemanticObjectController.setPrefetchNavigationTargets(true);
	});

	/**
	 * @deprecated Since 1.42.0. The property <code>prefetchNavigationTargets</code> is obsolete as navigation targets are determined
	 *             automatically. The SmartLink controls are re-rendered as soon as the asynchronous determination of navigation targets
	 *             has been completed.
	 */
	QUnit.test("setPrefetchNavigationTargets", function(assert) {
		// system under test
		var oSemanticObjectController = new SemanticObjectController();

		// arrange
		var fnFirePrefetchDoneSpy = sinon.spy(oSemanticObjectController, "firePrefetchDone");

		// act
		oSemanticObjectController.setPrefetchNavigationTargets(false);

		// assert
		assert.ok(!fnFirePrefetchDoneSpy.calledOnce);

		// cleanup
		oSemanticObjectController.destroy();
	});

	QUnit.module("sap.ui.comp.navpopover.SemanticObjectController: getDistinctSemanticObjects", {
		beforeEach: function() {
			fnEnableFakeFlp();
		},
		afterEach: function() {
			FakeFlpConnector.disableFakeConnector();
			SemanticObjectController.destroyDistinctSemanticObjects();
		}
	});

	QUnit.test("Several instances of SemanticObjectController", function(assert) {
		// system under test

		// arrange
		var done = assert.async();
		var fnHasDistinctSemanticObjectSpy = sinon.spy(SemanticObjectController, "getDistinctSemanticObjects");

		// act
		var oSemanticObjectController1 = new SemanticObjectController();
		var oSemanticObjectController2 = new SemanticObjectController();

		SemanticObjectController.getDistinctSemanticObjects().then(function() {

			// assert
			assert.strictEqual(fnHasDistinctSemanticObjectSpy.callCount, 3);

			done();

			// cleanup
			oSemanticObjectController1.destroy();
			oSemanticObjectController2.destroy();
		});
	});

	QUnit.test("Order of multiple calls", function(assert) {
		// system under test

		// arrange
		var aTimer = [];

		// act
		var done = assert.async();
		SemanticObjectController.getDistinctSemanticObjects().then(function(oSemanticObjects) {

			// assert
			assert.equal(aTimer.length, 0);
			assert.equal(!!oSemanticObjects[""], false);

			aTimer.push("");
			done();

			// cleanup
			SemanticObjectController.destroyDistinctSemanticObjects();
		});

		var done1 = assert.async();
		SemanticObjectController.getDistinctSemanticObjects().then(function(oSemanticObjects) {

			// assert
			assert.equal(aTimer[0], "");
			assert.equal(!!oSemanticObjects["TestObject"], true);

			aTimer.push("TestObject");
			done1();

			// cleanup
			SemanticObjectController.destroyDistinctSemanticObjects();
		});

		var done2 = assert.async();
		SemanticObjectController.getDistinctSemanticObjects("TestObject2").then(function(oSemanticObjects) {

			// assert
			assert.equal(aTimer[0], "");
			assert.equal(aTimer[1], "TestObject");
			assert.equal(!!oSemanticObjects["TestObject2"], true);

			aTimer.push("TestObject2");
			done2();

			// cleanup
			SemanticObjectController.destroyDistinctSemanticObjects();
		});

		var done3 = assert.async();
		SemanticObjectController.getDistinctSemanticObjects(null).then(function(oSemanticObjects) {

			// assert
			assert.equal(aTimer[0], "");
			assert.equal(aTimer[1], "TestObject");
			assert.equal(aTimer[2], "TestObject2");
			assert.equal(!!oSemanticObjects[null], false);

			done3();

			// cleanup
			SemanticObjectController.destroyDistinctSemanticObjects();
		});

		var done4 = assert.async();
		SemanticObjectController.getDistinctSemanticObjects().then(function(oSemanticObjects) {
			// assert
			assert.equal(!!oSemanticObjects[""], false);

			SemanticObjectController.getDistinctSemanticObjects().then(function(oSemanticObjects) {

				// assert
				assert.equal(!!oSemanticObjects["TestObject"], true);

				done4();

				// cleanup
				SemanticObjectController.destroyDistinctSemanticObjects();
			});
		});
	});

	QUnit.test("Navigation (destroy of instance) -> model is still intact", function(assert) {
		var done = assert.async(2);
		var oSemanticObjectController = new SemanticObjectController();
		var oFirstSemanticObjects;

		SemanticObjectController.getDistinctSemanticObjects().then(function(oSemanticObjects) {
			oFirstSemanticObjects = Object.assign({}, oSemanticObjects);
			done();
		});

		oSemanticObjectController.destroy();

		SemanticObjectController.getDistinctSemanticObjects().then(function(oSemanticObjects) {
			assert.deepEqual(oSemanticObjects, oFirstSemanticObjects);
			done();
		});
	});

	QUnit.module("sap.ui.comp.navpopover.SemanticObjectController: registerControl", {
		beforeEach: function() {
			this.oSemanticObjectController = new SemanticObjectController();
		},
		afterEach: function() {
			this.oSemanticObjectController.destroy();
			this.oSemanticObjectController = undefined;
		}
	});

	QUnit.test("Text control", function(assert) {
		// Arrange
		var oText = new Text({ text: "TEXT" });
		var oLogWarningSpy = sinon.spy(Log, "warning");
		assert.ok(oLogWarningSpy.notCalled, "No warning logged");

		// Act + Assert
		this.oSemanticObjectController.registerControl(oText);
		assert.ok(oLogWarningSpy.calledWith("sap.ui.comp.navpopover.SemanticObjectController: " + oText.getMetadata() + " is neither of SmartLink nor of NavigationPopoverHandler instance"), "Correct warning logged");

		oLogWarningSpy.restore();
	});

	QUnit.test('undefined / null / ""', function(assert) {
		// Arrange
		var aValues = [undefined, null, ""];

		aValues.forEach(function(vValue) {
			// Arrange
			var oLogWarningSpy = sinon.spy(Log, "warning");
			assert.ok(oLogWarningSpy.notCalled, "No warning logged");

			// Act
			this.oSemanticObjectController.registerControl(vValue);

			// Assert
			assert.ok(oLogWarningSpy.calledWith("sap.ui.comp.navpopover.SemanticObjectController: parameter is neither of SmartLink nor of NavigationPopoverHandler instance"), "Correct warning logged");

			// Cleanup
			oLogWarningSpy.restore();
		}.bind(this));
	});

	var fnCheckRegisterControl = function(assert, oSemanticObjectController, oControl) {
		// act
		oSemanticObjectController.registerControl(oControl);

		// assertions
		assert.equal(oSemanticObjectController._aRegisteredControls.length, 1, "one control has to be registered");
		assert.ok(oControl.hasListeners("beforePopoverOpens"), "Semantic Object Controller has to register event BeforePopoverOpens");
		assert.ok(oControl.hasListeners("navigationTargetsObtained"), "Semantic Object Controller has to register event NavigationTargetsObtained");
		if (oControl.isA("sap.ui.navpopover.NavigationPopoverHandler")) {
			assert.ok(oControl.hasListeners("innerNavigate"), "Semantic Object Controller has to register event InnerNavigate");
		}
	};

	var fnCheckAlreadyRegisteredRegisterControl = function(assert, oSemanticObjectController, oControl) {
		fnCheckRegisterControl(assert, oSemanticObjectController, oControl);

		// act
		oSemanticObjectController.registerControl(oControl);

		// assertions
		assert.equal(oSemanticObjectController._aRegisteredControls.length, 1, "one control has to be registered");
	};

	[new SmartLink(), new NavigationPopoverHandler()].forEach((oControl) => {
		QUnit.test(`should register ${oControl.getMetadata().getName()}`, function(assert) {
			fnCheckRegisterControl(assert, this.oSemanticObjectController, oControl);
		});

		QUnit.test(`should not do anything with already registered ${oControl.getMetadata().getName()}`, function(assert) {
			fnCheckAlreadyRegisteredRegisterControl(assert, this.oSemanticObjectController, oControl);
		});

		QUnit.test(`should override navigationTargetsObtainedCallback of ${oControl.getMetadata().getName()}`, function(assert) {
			const fnNavigationTargetsObtainedCallback = () => {};
			this.oSemanticObjectController.setNavigationTargetsObtainedCallback(fnNavigationTargetsObtainedCallback);

			fnCheckRegisterControl(assert, this.oSemanticObjectController, oControl);
			assert.equal(oControl.getNavigationTargetsObtainedCallback(), fnNavigationTargetsObtainedCallback, "'navigationTargetsObtainedCallback' overriden");

			this.oSemanticObjectController.unregisterControl(oControl);

			const fnNewNavigationTargetsObtainedCallback = () => {};
			oControl.setNavigationTargetsObtainedCallback(fnNewNavigationTargetsObtainedCallback);
			fnCheckRegisterControl(assert, this.oSemanticObjectController, oControl);
			assert.equal(oControl.getNavigationTargetsObtainedCallback(), fnNavigationTargetsObtainedCallback, "'navigationTargetsObtainedCallback' overriden");

			this.oSemanticObjectController.unregisterControl(oControl);
			oControl.setNavigationTargetsObtainedCallback(fnNewNavigationTargetsObtainedCallback);
			this.oSemanticObjectController.setNavigationTargetsObtainedCallback(undefined);
			fnCheckRegisterControl(assert, this.oSemanticObjectController, oControl);
			assert.equal(oControl.getNavigationTargetsObtainedCallback(), fnNewNavigationTargetsObtainedCallback, "'navigationTargetsObtainedCallback' overriden");
		});
	});

	QUnit.module("sap.ui.comp.navpopover.SemanticObjectController: unregisterControl", {
		beforeEach: function() {
			this.oSemanticObjectController = new SemanticObjectController();
		},
		afterEach: function() {
			this.oSemanticObjectController.destroy();
			this.oSemanticObjectController = undefined;
		}
	});

	QUnit.test('undefined / null / ""', function(assert) {
		// Arrange
		var aValues = [undefined, null, ""];
		this.oSemanticObjectController.registerControl(new SmartLink());

		aValues.forEach(function(vValue) {
			// Act
			this.oSemanticObjectController.unregisterControl(vValue);

			// Assert
			assert.equal(this.oSemanticObjectController._aRegisteredControls.length, 1, "amount of registered controls not changed");
		}.bind(this));
	});

	var fnCheckUnregisterControl = function(assert, oSemanticObjectController, oControl) {
		// act
		oSemanticObjectController.registerControl(oControl);
		oSemanticObjectController.unregisterControl(oControl);

		// assertions
		assert.equal(oSemanticObjectController._aRegisteredControls.length, 0, "no control has to be registered");
		assert.ok(!oControl.hasListeners("beforePopoverOpens"), "Semantic Object Controller has to unregister event BeforePopoverOpens");
		assert.ok(!oControl.hasListeners("navigationTargetsObtained"), "Semantic Object Controller has to unregister event NavigationTargetsObtained");
		assert.ok(!oControl.hasListeners("innerNavigate"), "Semantic Object Controller has to unregister event InnerNavigate");
	};

	var fnCheckNotRegisteredUnregisterControl = function(assert, oSemanticObjectController, oControl) {
		// act
		oSemanticObjectController.registerControl(new SmartLink());
		oSemanticObjectController.unregisterControl(oControl);

		// assertions
		assert.equal(oSemanticObjectController._aRegisteredControls.length, 1, "amount of registered controls not changed");
	};

	[new SmartLink(), new NavigationPopoverHandler()].forEach((oControl) => {
		QUnit.test(`should unregister ${oControl.getMetadata().getName()}`, function(assert) {
			fnCheckUnregisterControl(assert, this.oSemanticObjectController, new SmartLink());
		});

		QUnit.test(`should do nothing with not registered ${oControl.getMetadata().getName()}`, function(assert) {
			fnCheckNotRegisteredUnregisterControl(assert, this.oSemanticObjectController, new SmartLink());
		});
	});

	QUnit.module("sap.ui.comp.navpopover.SemanticObjectController: _onNavigate", {
		beforeEach: function() {
			this.oSemanticObjectController = new SemanticObjectController();
			this.oEventMock = {
				getParameters: function() {
					return {
						text: "TEXT",
						href: sBaseUrl + "#HREF",
						internalHref: sBaseUrl + "#INTERNALHREF",
						originalId: "ORIGINALID",
						semanticObject: "SEMANTICOBJECT",
						semanticAttributes: "SEMANTICATTRIBUTES"
					};
				},
				getSource: function() {
					return {
						getBeforeNavigationCallback: function() {
							return undefined;
						}
					};
				}
			};
		},
		afterEach: function() {
			this.oSemanticObjectController.destroy();
			this.oSemanticObjectController = undefined;
		}
	});

	var fnCheckNavigationInfo = function(assert, oNavigationInfo, oEventMockParameters) {
		assert.equal(oNavigationInfo.text, oEventMockParameters.text, "Correct text value in oNavigationInfo");
		assert.equal(oNavigationInfo.href, oEventMockParameters.href, "Correct href value in oNavigationInfo");
		assert.equal(oNavigationInfo.originalId, oEventMockParameters.originalId, "Correct originalId value in oNavigationInfo");
		assert.equal(oNavigationInfo.semanticObject, oEventMockParameters.semanticObject, "Correct semanticObject value in oNavigationInfo");
		assert.equal(oNavigationInfo.semanticAttributes, oEventMockParameters.semanticAttributes, "Correct semanticAttributes value in oNavigationInfo");
	};

	QUnit.test("with own getBeforeNavigationCallback returning TRUE", function(assert) {
		// Arrange
		var done = assert.async();
		var oEventMockParameters = this.oEventMock.getParameters();

		var fnUtilNavigateSpy = sinon.spy(Util, "navigate");
		// Create a beforeNavigationCallback function inside a sinon.spy to check if it's called later on
		var fnBeforeNavigationCallbackSpy = sinon.spy(function(oNavigationInfo) {
			// Assert 2 -> check navigation information
			fnCheckNavigationInfo(assert, oNavigationInfo, oEventMockParameters);

			// Act 2 -> allow navigation
			return Promise.resolve(true);
		});
		this.oSemanticObjectController.setBeforeNavigationCallback(fnBeforeNavigationCallbackSpy);

		// Create event handling for window "hashchange" event to check if navigation happened
		var fnCheckWindowUrl = function() {
			window.removeEventListener('hashchange', fnCheckWindowUrl);
			var oResultUrl = window.location.href;
			// Assert 3 -> navigation happened
			assert.ok(fnBeforeNavigationCallbackSpy.calledOnce, "'beforeNavigationCallback' function called");
			assert.equal(oResultUrl, sBaseUrl + "#INTERNALHREF", "Navigation happened");
			assert.ok(fnUtilNavigateSpy.calledOnce, "Util 'navigate' function called");

			// Cleanup
			fnUtilNavigateSpy.restore();
			done();
		};
		window.addEventListener('hashchange', fnCheckWindowUrl);

		// Act 1 -> trigger navigation process
		this.oSemanticObjectController._onNavigate(this.oEventMock);

		// Assert 1 -> no navigation happened
		assert.ok(fnUtilNavigateSpy.notCalled, "Util 'navigate' function not called");
	});

	QUnit.test("with own getBeforeNavigationCallback returning FALSE", function(assert) {
		// Arrange
		var done = assert.async();
		var oEventMockParameters = this.oEventMock.getParameters();
		var sCurrentUrl = window.location.href;

		var fnUtilNavigateSpy = sinon.spy(Util, "navigate");
		// Create a beforeNavigationCallback function inside a sinon.spy to check if it's called later on
		var fnBeforeNavigationCallbackSpy = sinon.spy(function(oNavigationInfo) {
			// Assert 2 -> check navigation information
			fnCheckNavigationInfo(assert, oNavigationInfo, oEventMockParameters);

			// Act 2 -> don't allow navigation
			return Promise.resolve(false);
		});
		this.oSemanticObjectController.setBeforeNavigationCallback(fnBeforeNavigationCallbackSpy);

		// Act 1 -> trigger navigation process
		this.oSemanticObjectController._onNavigate(this.oEventMock);

		// Assert 1 -> no navigation happened
		assert.ok(fnUtilNavigateSpy.notCalled, "Util 'navigate' function not called");

		setTimeout(function() {
			// Assert 3 -> no navigation happened
			assert.ok(fnBeforeNavigationCallbackSpy.calledOnce, "'beforeNavigationCallback' function called");
			assert.ok(fnUtilNavigateSpy.notCalled, "Util 'navigate' function still not called");
			assert.equal(sCurrentUrl, window.location.href, "window.location.href did not change");

			// Cleanup
			fnUtilNavigateSpy.restore();
			done();
		}, 0);
	});

	QUnit.test("with source getBeforeNavigationCallback", function(assert) {
		// Arrange
		var done = assert.async();

		var fnUtilNavigateSpy = sinon.spy(Util, "navigate");
		var fnFireNavigateSpy = sinon.spy(this.oSemanticObjectController, "fireNavigate");
		this.oEventMock.getSource = function() {
			return {
				getBeforeNavigationCallback: function() {
					return true;
				}
			};
		};
		this.oEventMock.getParameters = function() {
			return {
				text: "TEXT",
				href: sBaseUrl + "#HREF2",
				internalHref: sBaseUrl + "#INTERNALHREF2",
				originalId: "ORIGINALID",
				semanticObject: "SEMANTICOBJECT",
				semanticAttributes: "SEMANTICATTRIBUTES"
			};
		};
		var oEventMockParameters = this.oEventMock.getParameters();

		// Create event handling for window "hashchange" event to check if navigation happened
		var fnCheckWindowUrl = function() {
			window.removeEventListener('hashchange', fnCheckWindowUrl);
			var oResultUrl = window.location.href;
			// Assert 3 -> navigation happened
			assert.ok(fnFireNavigateSpy.calledOnce, "'fireNavigate' function called");
			fnCheckNavigationInfo(assert, fnFireNavigateSpy.args[0][0], oEventMockParameters);
			assert.equal(oResultUrl, sBaseUrl + "#INTERNALHREF2", "Navigation happened");

			// Cleanup
			fnUtilNavigateSpy.restore();
			done();
		};
		window.addEventListener('hashchange', fnCheckWindowUrl);

		// Act 1 -> trigger navigation process
		this.oSemanticObjectController._onNavigate(this.oEventMock);

		// Assert 1 -> navigation happened
		assert.ok(fnUtilNavigateSpy.calledOnce, "Util 'navigate' function called");
	});

	QUnit.test("without getBeforeNavigationCallback", function(assert) {
		// Arrange
		var done = assert.async();

		var fnUtilNavigateSpy = sinon.spy(Util, "navigate");

		this.oSemanticObjectController.setBeforeNavigationCallback(undefined);

		// Create event handling for window "hashchange" event to check if navigation happened
		var fnCheckWindowUrl = function() {
			window.removeEventListener('hashchange', fnCheckWindowUrl);
			var oResultUrl = window.location.href;
			// Assert 2 -> navigation happened
			assert.equal(oResultUrl, sBaseUrl + "#INTERNALHREF", "Navigation happened");
			assert.ok(fnUtilNavigateSpy.calledOnce, "Util 'navigate' function called");

			// Cleanup
			fnUtilNavigateSpy.restore();
			done();
		};
		window.addEventListener('hashchange', fnCheckWindowUrl);

		// Act -> trigger navigation process
		this.oSemanticObjectController._onNavigate(this.oEventMock);

		// Assert 1 -> navigation happened
		assert.ok(fnUtilNavigateSpy.calledOnce, "Util 'navigate' function called");
	});

	QUnit.test('undefined / null / ""', function(assert) {
		// Arrange
		var aValues = [undefined, null , ""];

		var fnUtilNavigateSpy = sinon.spy(Util, "navigate");

		// Act -> trigger navigation process
		aValues.forEach(function(vValue) {
			this.oSemanticObjectController._onNavigate(vValue);

			// Assert 1 -> navigation happened
			assert.ok(fnUtilNavigateSpy.notCalled, "Util 'navigate' function not called");
		}.bind(this));

		// Cleanup
		fnUtilNavigateSpy.restore();
	});

	QUnit.module("sap.ui.comp.navpopover.SemanticObjectController: setEnableAvailableActionsPersonalization", {
		beforeEach: function() {
			this.oSemanticObjectController = new SemanticObjectController({
				enableAvailableActionsPersonalization: {
					"Test" : true
				}
			});
		},
		afterEach: function() {
			this.oSemanticObjectController.destroy();
			this.oSemanticObjectController = undefined;
		}
	});

	QUnit.test('undefined / null / ""', function(assert) {
		var aValues = [undefined, null];

		assert.throws(function() {
			this.oSemanticObjectController.setEnableAvailableActionsPersonalization("");
		}, 'Error thrown when trying to set it to ""');

		aValues.forEach(function(vValue) {
			this.oSemanticObjectController.setEnableAvailableActionsPersonalization(vValue);
			assert.equal(this.oSemanticObjectController.getEnableAvailableActionsPersonalization(), vValue, "Set to value " + vValue);
		}.bind(this));
	});

	/* Disabled due to timing issues with other tests. This tests cover the error logging and are able to run standalone
	QUnit.module("sap.ui.comp.navpopover.SemanticObjectController: No CrossApplicationNavigation service", {
		beforeEach: function() {
			this.fnLogErrorSpy = sinon.spy(Log, "error");
		},
		afterEach: function() {
			this.fnLogErrorSpy.restore();
			SemanticObjectController.destroyDistinctSemanticObjects();
		}
	});

	QUnit.test("getDistinctSemanticObjects", function(assert) {
		var done = assert.async();

		SemanticObjectController.getDistinctSemanticObjects().then(function(oResult) {
			assert.ok(this.fnLogErrorSpy.calledWith("sap.ui.comp.navpopover.SemanticObjectController: Service 'CrossApplicationNavigation' could not be obtained"), "Correct error logged");
			assert.equal(SemanticObjectController.bHasPrefetchedDistinctSemanticObjects, true, "bHasPrefetchedDistinctSemanticObjects set to true");
			assert.deepEqual(oResult, {}, "empty object returned");

			done();
		}.bind(this));
	});

	QUnit.test("getNavigationTargetActions", function(assert) {
		var done = assert.async();

		SemanticObjectController.getNavigationTargetActions().then(function(oResult) {
			assert.ok(this.fnLogErrorSpy.calledWith("sap.ui.comp.navpopover.SemanticObjectController: Service 'CrossApplicationNavigation' or 'URLParsing' could not be obtained"), "Correct error logged");
			assert.equal(SemanticObjectController.bHasPrefetchedDistinctSemanticObjects, true, "bHasPrefetchedDistinctSemanticObjects set to true");
			assert.deepEqual(oResult, {}, "empty object returned");

			done();
		}.bind(this));
	});

	QUnit.module("sap.ui.comp.navpopover.SemanticObjectController: CrossApplicationNavigation service rejecting promise", {
		before: function() {
			this.fnFactoryGetServiceMock = sinon.stub(Factory, "getService").withArgs("CrossApplicationNavigation").returns({
				getDistinctSemanticObjects: function() {
					return Promise.reject();
				},
				getLinks: function() {
					return Promise.reject();
				}
			});
		},
		after: function() {
			this.fnFactoryGetServiceMock.reset();
		},
		beforeEach: function() {
			this.fnLogErrorSpy = sinon.spy(Log, "error");
		},
		afterEach: function() {
			this.fnLogErrorSpy.restore();
			SemanticObjectController.destroyDistinctSemanticObjects();
		}
	});

	QUnit.test("getDistinctSemanticObjects", function(assert) {
		var done = assert.async();

		SemanticObjectController.getDistinctSemanticObjects().then(function(oResult) {
			assert.ok(this.fnLogErrorSpy.calledWith("sap.ui.comp.navpopover.SemanticObjectController: getDistinctSemanticObjects() of service 'CrossApplicationNavigation' failed"), "Correct error logged");
			assert.equal(SemanticObjectController.bHasPrefetchedDistinctSemanticObjects, true, "bHasPrefetchedDistinctSemanticObjects set to true");
			assert.deepEqual(oResult, {}, "empty object returned");

			done();
		}.bind(this));
	});

	QUnit.test("getNavigationTargetActions", function(assert) {
		var done = assert.async();

		SemanticObjectController.getNavigationTargetActions().then(function(oResult) {
			assert.ok(this.fnLogErrorSpy.calledWith("sap.ui.comp.navpopover.SemanticObjectController: getLinks() of service 'CrossApplicationNavigation' failed"), "Correct error logged");
			assert.equal(SemanticObjectController.bHasPrefetchedDistinctSemanticObjects, true, "bHasPrefetchedDistinctSemanticObjects set to true");
			assert.deepEqual(oResult, {}, "empty object returned");

			done();
		}.bind(this));
	});
	*/

	QUnit.start();
});
