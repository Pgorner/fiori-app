/* global  QUnit, sinon */

sap.ui.define([
	"sap/ui/comp/navpopover/FakeFlpConnector",
	"sap/ui/comp/navpopover/SmartLink",
	"sap/ui/comp/navpopover/SmartLinkDelegate",
	"sap/ui/comp/navpopover/SemanticObjectController",
	"sap/ui/comp/navpopover/Util",
	"sap/ui/base/Event",
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/thirdparty/jquery",
	'sap/ui/mdc/enums/LinkType',
	"sap/ui/comp/navpopover/LinkData",
	'sap/base/Log'
], function(
	FakeFlpConnector,
	SmartLink,
	SmartLinkDelegate,
	SemanticObjectController,
	Util,
	Event,
	nextUIUpdate,
	jQuery,
	LinkType,
	LinkData,
	Log
) {
	"use strict";

	var sBaseUrl = window.location.href;

	QUnit.module("sap.ui.comp.navpopover.SmartLinkDelegate", {
		beforeEach: function() {
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
		afterEach: function() {
			FakeFlpConnector.disableFakeConnector();
			SemanticObjectController.destroyDistinctSemanticObjects();
		}
	});

	QUnit.module("sap.ui.comp.navpopover.SmartLinkDelegate: fetchLinkType", {});

	QUnit.test("ignored field in SemanticObjectController", async function(assert) {
		const done = assert.async();
		const oSemanticObjectController = new SemanticObjectController({
			ignoredFields: "SmartLink"
		});
		const oSmartLink = new SmartLink({
			semanticObjectController: oSemanticObjectController,
			fieldName: "SmartLink"
		});

		const oFieldInfo = oSmartLink.getFieldInfo();
		const oLinkTypeWrapper = await SmartLinkDelegate.fetchLinkType(oFieldInfo);
		const bIsLink = oLinkTypeWrapper.initialType.type !== LinkType.Text;
		assert.ok(!bIsLink, "initial - SmartLink is not enabled");

		const runtimeType = await oLinkTypeWrapper.runtimeType;
		const bIsText = runtimeType.type === LinkType.Text;
		assert.ok(bIsText, "SmartLink is not enabled");
		done();
	});

	QUnit.test("ignoreLinkRendering + forceLinkRendering", async function(assert) {
		const done = assert.async();
		const oSmartLink = new SmartLink({
			ignoreLinkRendering: true,
			forceLinkRendering: true
		});

		const oFieldInfo = oSmartLink.getFieldInfo();
		const oLinkTypeWrapper = await SmartLinkDelegate.fetchLinkType(oFieldInfo);
		const bIsLink = oLinkTypeWrapper.initialType.type !== LinkType.Text;
		assert.ok(!bIsLink, "initial - SmartLink is not enabled");

		const runtimeType = await oLinkTypeWrapper.runtimeType;
		const bIsText = runtimeType.type === LinkType.Text;
		assert.ok(bIsText, "SmartLink is not enabled");
		done();
	});

	QUnit.test("own forceLinkRendering", async function(assert) {
		const done = assert.async();
		const oSmartLink = new SmartLink({
			enabled: false,
			forceLinkRendering: true
		});

		const oFieldInfo = oSmartLink.getFieldInfo();
		const oLinkTypeWrapper = await SmartLinkDelegate.fetchLinkType(oFieldInfo);
		// const bIsText = oLinkTypeWrapper.initialType.type === LinkType.Text;
		// assert.ok(bIsText, "initial - SmartLink is not enabled");

		const runtimeType = await oLinkTypeWrapper.runtimeType;
		const bIsLink = runtimeType.type !== LinkType.Text;
		assert.ok(bIsLink, "SmartLink is enabled");
		done();
	});

	QUnit.test("SemanticObjectController forceLinkRendering", async function(assert) {
		const done = assert.async();
		const oSemanticObjectController = new SemanticObjectController({
			forceLinkRendering: { "SmartLink": true }
		});
		const oSmartLink = new SmartLink({
			enabled: false,
			semanticObjectController: oSemanticObjectController,
			fieldName: "SmartLink"
		});

		const oFieldInfo = oSmartLink.getFieldInfo();
		const oLinkTypeWrapper = await SmartLinkDelegate.fetchLinkType(oFieldInfo);
		// const bIsText = oLinkTypeWrapper.initialType.type === LinkType.Text;
		// assert.ok(bIsText, "initial - SmartLink is not enabled");

		const runtimeType = await oLinkTypeWrapper.runtimeType;
		const bIsLink = runtimeType.type !== LinkType.Text;
		assert.ok(bIsLink, "SmartLink is enabled");
		done();
	});

	QUnit.test("SemanticObjectController has no distinctSemanticObjects and no contactAnnotationPath", async function(assert) {
		const done = assert.async();
		const oSemanticObjectController = new SemanticObjectController();
		const oSmartLink = new SmartLink({
			semanticObjectController: oSemanticObjectController
		});

		const oFieldInfo = oSmartLink.getFieldInfo();
		const oLinkTypeWrapper = await SmartLinkDelegate.fetchLinkType(oFieldInfo);
		const bIsLink = oLinkTypeWrapper.initialType.type !== LinkType.Text;
		assert.ok(!bIsLink, "initial - SmartLink is not enabled");

		const runtimeType = await oLinkTypeWrapper.runtimeType;
		const bIsText = runtimeType.type === LinkType.Text;
		assert.ok(bIsText, "SmartLink is not enabled");
		done();

	});

	QUnit.test("navigation with target='_blank'", async function(assert) {
		const done = assert.async();
		this.oSmartLink = new SmartLink({
			semanticObject: "TestObject",
			navigationTargetsObtained: function(oEvent) {
				const sMainNavigationId = "MainNavigation";
				const oMainNavigation = new LinkData({
					description: "",
					text: "MainNavigation",
					visible: true
				});
				const aAvailableActions = [
					new LinkData({
						text: "DummyLink1",
						href: sBaseUrl + "#/dummyLink1",
						target: "_blank"
					}),
					new LinkData({
						text: "DummyLink2",
						href: sBaseUrl + "#/dummyLink2",
						target: "_blank"
					})
				 ];

				oEvent.getParameter("show")(sMainNavigationId, oMainNavigation, aAvailableActions, undefined);
			}
		});

		this.oSmartLink.placeAt("qunit-fixture");
		await nextUIUpdate();

		const oSmartLinkDelegate = await this.oSmartLink.getFieldInfo().awaitControlDelegate();
		const fnSmartLinkDelegateOnNavigateSpy = sinon.spy(oSmartLinkDelegate, "onLinkPressed");

		const oFieldInfo = this.oSmartLink.getFieldInfo();
		oFieldInfo.open().then(function() {
			const oPopover = oFieldInfo.getDependents()[0];
			assert.ok(oPopover, "Popover exists");
			assert.ok(oPopover.getContent()[0], "Panel exists");
			assert.equal(oPopover.getContent()[0].getMetadata().getName(), "sap.ui.comp.navpopover.Panel", "Panel exists");

			const oPanel = oPopover.getContent()[0];

			const fnCheckWindowUrl = function() {
				window.removeEventListener('hashchange', fnCheckWindowUrl);
				var oResultUrl = window.location.href;
				assert.equal(oResultUrl, sBaseUrl + "#/dummyLink2", "Navigation happened");
				done();
			};

			window.addEventListener('hashchange', fnCheckWindowUrl);
			const fnUtilNavigateSpy = sinon.spy(Util, "navigate");
			const fnEventPreventDefaultSpy = sinon.spy(Event.prototype, "preventDefault");

			assert.ok(fnUtilNavigateSpy.notCalled, "Util 'navigate' function not called");
			assert.ok(fnEventPreventDefaultSpy.notCalled, "Event 'preventDefault' function not called");

			// Act
			// Press Link on Popover
			const oLink = oPanel._getLinkControls()[0];
			oLink.firePress();

			// assertions
			assert.ok(fnSmartLinkDelegateOnNavigateSpy.notCalled, "NavigationPopoverHandler '_onNavigate' not called");
			assert.ok(fnUtilNavigateSpy.notCalled, "Util 'navigate' function called not called");
			assert.ok(fnEventPreventDefaultSpy.notCalled, "Event 'preventDefault' function not called");

			fnUtilNavigateSpy.restore();
			fnEventPreventDefaultSpy.restore();

			done();
		});
	});

	QUnit.module("sap.ui.comp.navpopover.SmartLinkDelegate: _fireNavigationTargetsObtained", {
		beforeEach: function() {
			this.oNavigationTargets = {
				mainNavigation: new LinkData({
					href: "#mainNavigation"
				}),
				availableActions: [
					new LinkData({
						href: "#action1"
					}),
					new LinkData({
						href: "#action2"
					})
				],
				ownNavigation: new LinkData({
					href: "#home"
				})
			};
		},
		afterEach: function() {
			this.oNavigationTargets = undefined;
		}
	});

	QUnit.test("should not fire event when no eventhandling is provided", async function(assert) {
		const oSmartLink = new SmartLink();
		const fnFireNavigationTargetsObtainedSpy = sinon.spy(oSmartLink, "fireNavigationTargetsObtained");

		const sMainNavigationId = "mainNavigationId",
			sSemanticObjectDefault = "",
			oSemanticAttributes = {},
			sId = oSmartLink.getId(),
			aForms = [],
			oNavigationTargets = this.oNavigationTargets;

		const oResult = await SmartLinkDelegate._fireNavigationTargetsObtained(sMainNavigationId, sSemanticObjectDefault, oSemanticAttributes, sId, aForms, oNavigationTargets, {
			getParent: () => oSmartLink
		});

		assert.ok(fnFireNavigationTargetsObtainedSpy.notCalled, "'fireNavigationTargetsObtained' not called");

		assert.equal(oResult.mainNavigationId, sMainNavigationId, "Correct 'mainNavigationId' returned");
		assert.equal(oResult.extraContent, undefined, "Correct 'extraContent' returned");
		assert.equal(oResult.mainNavigation, this.oNavigationTargets.mainNavigation, "Correct 'mainNavigation' returned");
		assert.equal(oResult.availableActions.length, this.oNavigationTargets.availableActions.length, "Correct amount of 'availableActions' returned");
		assert.equal(oResult.availableActions, this.oNavigationTargets.availableActions, "Correct 'availableActions' returned");
		assert.equal(oResult.ownNavigation, this.oNavigationTargets.ownNavigation, "Correct 'ownNavigation' returned");
	});

	QUnit.test("should fire event when eventhandling is provided and 'navigationTargetsObtainedCallback' is not set", async function(assert) {
		const fnNavigationTargetsObtainedEventHandlingSpy = sinon.spy();
		const oSmartLink = new SmartLink({
			navigationTargetsObtained: fnNavigationTargetsObtainedEventHandlingSpy
		});
		oSmartLink.attachNavigationTargetsObtained((oEvent) => {
			oEvent.getParameter("show")();
		});

		const fnFireNavigationTargetsObtainedSpy = sinon.spy(oSmartLink, "fireNavigationTargetsObtained");

		const sMainNavigationId = "mainNavigationId",
			sSemanticObjectDefault = "",
			oSemanticAttributes = {},
			sId = oSmartLink.getId(),
			aForms = [],
			oNavigationTargets = this.oNavigationTargets;

		const oResult = await SmartLinkDelegate._fireNavigationTargetsObtained(sMainNavigationId, sSemanticObjectDefault, oSemanticAttributes, sId, aForms, oNavigationTargets, {
			getParent: () => oSmartLink
		});

		assert.ok(fnNavigationTargetsObtainedEventHandlingSpy.calledOnce, "eventhandling called once");
		assert.ok(fnFireNavigationTargetsObtainedSpy.calledOnce, "'fireNavigationTargetsObtained' called once");

		assert.equal(oResult.mainNavigationId, sMainNavigationId, "Correct 'mainNavigationId' returned");
		assert.equal(oResult.extraContent, undefined, "Correct 'extraContent' returned");
		assert.equal(oResult.mainNavigation, this.oNavigationTargets.mainNavigation, "Correct 'mainNavigation' returned");
		assert.equal(oResult.availableActions.length, this.oNavigationTargets.availableActions.length, "Correct amount of 'availableActions' returned");
		assert.equal(oResult.availableActions, this.oNavigationTargets.availableActions, "Correct 'availableActions' returned");
		assert.equal(oResult.ownNavigation, this.oNavigationTargets.ownNavigation, "Correct 'ownNavigation' returned");
	});

	QUnit.test("should be able to manipulate properties in eventhandling show method", async function(assert) {
		const oSmartLink = new SmartLink({});
		const sMainNavigationId = "mainNavigationId",
			sSemanticObjectDefault = "",
			oSemanticAttributes = {
				"": {
					test: "test"
				},
				"test": {}
			},
			sId = oSmartLink.getId(),
			aForms = [],
			oNavigationTargets = this.oNavigationTargets;

		const sManipulatedMainNavigationId = "new_mainNavigationId",
			oManipulatedMainNavigation = new LinkData({
				href: "#displayFactSheet"
			}),
			aManipulatedAvailableActions = [],
			oManipulatedAdditionalContent = new Text({ text: "Test" });

		oSmartLink.attachNavigationTargetsObtained((oEvent) => {
			const oMainNavigation = oEvent.getParameter("mainNavigation"),
				aActions = oEvent.getParameter("actions"),
				oOwnNavigation = oEvent.getParameter("ownNavigation"),
				aPopoverForms = oEvent.getParameter("popoverForms"),
				sSemanticObject = oEvent.getParameter("semanticObject"),
				oEventSemanticAttributes = oEvent.getParameter("semanticAttributes"),
				sOriginalId = oEvent.getParameter("originalId");

			assert.equal(oMainNavigation, oNavigationTargets.mainNavigation, "Correct 'mainNavigation' provided in event");
			assert.equal(aActions, oNavigationTargets.availableActions, "Correct 'actions' provided in event");
			assert.equal(oOwnNavigation, oNavigationTargets.ownNavigation, "Correct 'ownNavigation' provided in event");
			assert.equal(aPopoverForms, aForms, "Correct 'popoverForms' provided in event");
			assert.equal(sSemanticObject, sSemanticObjectDefault, "Correct 'semanticObject' provided in event");
			assert.equal(oEventSemanticAttributes, oSemanticAttributes[sSemanticObjectDefault], "Correct 'semanticAttributes' provided in event");
			assert.equal(sOriginalId, sId, "Correct 'originalId' provided in event");

			oEvent.getParameter("show")(sManipulatedMainNavigationId, oManipulatedMainNavigation, aManipulatedAvailableActions, oManipulatedAdditionalContent);
		});

		const oResult = await SmartLinkDelegate._fireNavigationTargetsObtained(sMainNavigationId, sSemanticObjectDefault, oSemanticAttributes, sId, aForms, oNavigationTargets, {
			getParent: () => oSmartLink
		});

		const {availableActions, extraContent, mainNavigation, mainNavigationId, originalId, ownNavigation, popoverForms, semanticAttributes, semanticObject} = oResult;

		assert.equal(mainNavigationId, sManipulatedMainNavigationId, "Correct 'mainNavigationId' returned");
		assert.equal(extraContent, oManipulatedAdditionalContent, "Correct 'extraContent' returned");
		assert.equal(mainNavigation, oManipulatedMainNavigation, "Correct 'mainNavigation' returned");
		assert.equal(availableActions.length, aManipulatedAvailableActions.length, "Correct amount of 'availableActions' returned");
		assert.equal(availableActions, aManipulatedAvailableActions, "Correct 'availableActions' returned");
		assert.equal(ownNavigation, oNavigationTargets.ownNavigation, "Correct 'ownNavigation' returned");

		assert.equal(originalId, undefined, "'originalId' should be undefined");
		assert.equal(popoverForms, undefined, "'popoverForms' should be undefined");
		assert.equal(semanticAttributes, undefined, "'semanticAttributes' should be undefined");
		assert.equal(semanticObject, undefined, "'semanticObject' should be undefined");
	});

	QUnit.test("should also fire event when 'navigationTargetsObtainedCallback' is set and log an warning when show is called", async function(assert) {
		let bEventHandlingCalled = false;
		const fnNavigationTargetsObtainedCallbackStub = sinon.stub();
		fnNavigationTargetsObtainedCallbackStub.returns(Promise.resolve());
		const fnWarningLogSpy = sinon.spy(Log, "warning");

		const oSmartLink = new SmartLink({
			navigationTargetsObtained: (oEvent) => {
				bEventHandlingCalled = true;
				const fnShow = oEvent.getParameter("show");
				fnShow();
			},
			navigationTargetsObtainedCallback: fnNavigationTargetsObtainedCallbackStub
		});

		const fnFireNavigationTargetsObtainedSpy = sinon.spy(oSmartLink, "fireNavigationTargetsObtained");

		const sMainNavigationId = "mainNavigationId",
			sSemanticObjectDefault = "",
			oSemanticAttributes = {},
			sId = oSmartLink.getId(),
			aForms = [],
			oNavigationTargets = {};


		await SmartLinkDelegate._fireNavigationTargetsObtained(sMainNavigationId, sSemanticObjectDefault, oSemanticAttributes, sId, aForms, oNavigationTargets, {
			getParent: () => oSmartLink
		});

		const sExpectedWarningMessage = `sap.ui.comp.navpopover.SmartLinkDelegate: "navigationTargetsObtained" event handling will be ignored as "navigationTargetsObtainedCallback" property is set.`;

		assert.ok(bEventHandlingCalled, "Eventhandling called");
		assert.ok(fnFireNavigationTargetsObtainedSpy.calledOnce, "'fireNavigationTargetsObtained' called once");
		assert.ok(fnNavigationTargetsObtainedCallbackStub.calledOnce, "'navigationTargetsObtainedCallback' called once");
		assert.ok(fnWarningLogSpy.calledOnce, "'warning' called once");
		assert.equal(fnWarningLogSpy.firstCall.args[0], sExpectedWarningMessage,"'warning' called once with correct warning message");
	});

	QUnit.test("should return results of 'navigationTargetsObtainedCallback' when set", async function(assert) {
		const oSmartLink = new SmartLink({});

		const sMainNavigationId = "mainNavigationId",
			sSemanticObjectDefault = "",
			oSemanticAttributes = {
				"": {
					test: "test"
				},
				"test": {}
			},
			sId = oSmartLink.getId(),
			aForms = [],
			oNavigationTargets = this.oNavigationTargets;

		const sManipulatedMainNavigationId = "new_mainNavigationId",
			oManipulatedMainNavigation = new LinkData({
				href: "#displayFactSheet"
			}),
			aManipulatedAvailableActions = [],
			oManipulatedAdditionalContent = new Text({ text: "Test" });

		oSmartLink.setNavigationTargetsObtainedCallback((oCallbackNavigationTargets) => {
			const {actions, extraContent, mainNavigation, mainNavigationId, originalId, ownNavigation, popoverForms, semanticAttributes, semanticObject} = oCallbackNavigationTargets;

			assert.equal(mainNavigation, oNavigationTargets.mainNavigation, "Correct 'mainNavigation' provided in callback");
			assert.equal(actions, oNavigationTargets.availableActions, "Correct 'actions' provided in callback");
			assert.equal(ownNavigation, oNavigationTargets.ownNavigation, "Correct 'ownNavigation' provided in callback");
			assert.equal(popoverForms, aForms, "Correct 'popoverForms' provided in callback");
			assert.equal(semanticObject, sSemanticObjectDefault, "Correct 'semanticObject' provided in callback");
			assert.equal(semanticAttributes, oSemanticAttributes[sSemanticObjectDefault], "Correct 'semanticAttributes' provided in callback");
			assert.equal(originalId, sId, "Correct 'originalId' provided in callback");

			// These two properties are additional compared to the old event handling
			assert.equal(extraContent, undefined, "Correct 'extraContent' provided in callback");
			assert.equal(mainNavigationId, sMainNavigationId, "Correct 'mainNavigationId' provided in callback");

			return Promise.resolve({
				...oCallbackNavigationTargets,
				mainNavigationId: sManipulatedMainNavigationId,
				extraContent: oManipulatedAdditionalContent,
				mainNavigation: oManipulatedMainNavigation,
				actions: aManipulatedAvailableActions
			});
		});

		const oResult = await SmartLinkDelegate._fireNavigationTargetsObtained(sMainNavigationId, sSemanticObjectDefault, oSemanticAttributes, sId, aForms, oNavigationTargets, {
			getParent: () => oSmartLink
		});
		const {availableActions, extraContent, mainNavigation, mainNavigationId, originalId, ownNavigation, popoverForms, semanticAttributes, semanticObject} = oResult;

		assert.equal(mainNavigationId, sManipulatedMainNavigationId, "Correct 'mainNavigationId' returned");
		assert.equal(extraContent, oManipulatedAdditionalContent, "Correct 'extraContent' returned");
		assert.equal(mainNavigation, oManipulatedMainNavigation, "Correct 'mainNavigation' returned");
		assert.equal(availableActions.length, aManipulatedAvailableActions.length, "Correct amount of 'availableActions' returned");
		assert.equal(availableActions, aManipulatedAvailableActions, "Correct 'availableActions' returned");
		assert.equal(ownNavigation, oNavigationTargets.ownNavigation, "Correct 'ownNavigation' returned");

		assert.equal(originalId, sId, "Correct 'originalId' returned");
		assert.equal(popoverForms, aForms, "Correct 'popoverForms' returned");
		assert.equal(semanticAttributes, oSemanticAttributes[sSemanticObjectDefault], "Correct 'semanticAttributes' returned");
		assert.equal(semanticObject, sSemanticObjectDefault, "Correct 'semanticObject' returned");
	});

	QUnit.start();
});
