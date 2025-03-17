/* global  QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/core/Control",
	"sap/ui/comp/navpopover/LinkData",
	"sap/ui/comp/navpopover/NavigationPopover",
	"sap/ui/comp/navpopover/SmartLink",
	"sap/ui/comp/navpopover/NavigationContainer",
	"sap/m/Text",
	"sap/m/Button",
	"sap/m/Link",
	"sap/base/Log",
	"sap/ui/core/CustomData",
	"sap/ui/comp/navpopover/FakeFlpConnector",
	"sap/ui/core/Component",
	"sap/ui/qunit/utils/nextUIUpdate"
], function(
	qutils,
	Control,
	LinkData,
	NavigationPopover,
	SmartLink,
	NavigationContainer,
	Text,
	Button,
	Link,
	Log,
	CustomData,
	FakeFlpConnector,
	Component,
	nextUIUpdate
) {
	"use strict";

	var vExternalContentErrorMatcher = /The API should not be used in case that the external content has been set/;

	var oDefaultModuleSettings = {
		beforeEach: function() {
			this.oNavigationPopover = new NavigationPopover();
			this.oModel = this.oNavigationPopover._getInternalModel();
		},
		afterEach: function() {
			this.oNavigationPopover.destroy();
			this.oModel = undefined;
		}
	};

	var oExtendedModuleSettings = {
		beforeEach: function() {
			this.oNavigationPopover = new NavigationPopover();
			this.oNavigationPopoverWithExternalContent = new NavigationPopover({
				customData: new CustomData({
					key: "useExternalContent",
					value: true
				})
			});
			this.oModel = this.oNavigationPopover._getInternalModel();
		},
		afterEach: function() {
			this.oNavigationPopover.destroy();
			this.oNavigationPopoverWithExternalContent.destroy();
			this.oModel = undefined;
		}
	};

	QUnit.module("sap.ui.comp.navpopover.NavigationPopover");

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(new NavigationPopover());
	});

	/**
	 * @deprecated Since 1.40.0. The property <code>semanticObjectName</code> is obsolete as target determination is no longer done by
	 *             NavigationPopover. Instead the NavigationPopoverHandler is responsible for target determination.
	 * @deprecated Since 1.40.0. The property <code>semanticAttributes</code> is obsolete as target determination is no longer done by
	 *             NavigationPopover. Instead the NavigationPopoverHandler is responsible for target determination.
	 * @deprecated Since 1.40.0. The property <code>appStateKey</code> is obsolete as target determination is no longer done by
	 *             NavigationPopover. Instead the NavigationPopoverHandler is responsible for target determination.
	 * @deprecated Since 1.40.0. The property <code>ownNavigation</code> is obsolete as target determination is no longer done by
	 *             NavigationPopover. Instead the NavigationPopoverHandler is responsible for target determination.
	 */
	QUnit.test("constructor", function(assert) {
		// system under test
		var oNavigationPopover = new NavigationPopover();

		// assert
		assert.equal(oNavigationPopover.getSemanticObjectName(), "");
		assert.equal(oNavigationPopover.getAppStateKey(), "");
		assert.equal(oNavigationPopover.getMainNavigationId(), "");
		assert.equal(oNavigationPopover.getAvailableActionsPersonalizationText(), undefined);
		assert.deepEqual(oNavigationPopover.getSemanticAttributes(), null); // Default value of a property
		assert.deepEqual(oNavigationPopover.getAvailableActions(), []); // Default value of an aggregation
		assert.deepEqual(oNavigationPopover.getMainNavigation(), null);
		assert.deepEqual(oNavigationPopover.getOwnNavigation(), null);
		assert.deepEqual(oNavigationPopover.getSource(), null);
		assert.deepEqual(oNavigationPopover.getExtraContent(), null);
		assert.deepEqual(oNavigationPopover.getComponent(), null);

		assert.ok(oNavigationPopover._getContentContainer().getItems().length, 2);

		// cleanup
		oNavigationPopover.destroy();
	});

	QUnit.test("constructor with customData - useExternalContent", function(assert) {
		var oNavigationPopover = new NavigationPopover({
			customData: new CustomData({
				key: "useExternalContent",
				value: true
			})
		});

		assert.equal(oNavigationPopover._bUseExternalContent, true, "_bUseExternalContent set to true");
	});

	/**
	 * This test is not deprecated as it tests for deprecation itselfe
	 * @deprecated Since 1.42.0. Target determination is no longer done by NavigationPopover. Instead the NavigationPopoverHandler is responsible for
	 *             target determination.
	 */
	QUnit.test("retrieveNavTargets deprecation check", function(assert) {
		// Arrange
		var oNavigationPopover = new NavigationPopover();
		var oLogWarningSpy = sinon.spy(Log, "warning");
		assert.ok(oLogWarningSpy.notCalled, "No warning logged");

		// Act
		oNavigationPopover.retrieveNavTargets();

		// Assert
		assert.ok(oLogWarningSpy.calledWith("sap.ui.comp.navpopover.NavigationPopover#retrieveNavTargets called. This function is deprecated since UI5 version 1.42!"));
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationPopover: show");

	QUnit.test("no source assigned", function(assert) {
		var oNavigationPopover = new NavigationPopover();
		var fnLogErrorSpy = sinon.spy(Log, "error");

		oNavigationPopover.show();
		assert.equal(fnLogErrorSpy.args[0], "no source assigned", "Error raised when no soruce assigned");
	});

	QUnit.test("mainNavigation", function(assert) {
		// system under test
		var oNavigationPopover = new NavigationPopover({
			source: new SmartLink(),
			mainNavigation: new LinkData({
				text: "Main",
				href: "href1"
			})
		});

		// arrange
		sinon.stub(oNavigationPopover, "openBy");

		// act
		oNavigationPopover.show();

		// assertions
		assert.ok(oNavigationPopover.openBy.called);

		// cleanup
		oNavigationPopover.destroy();
	});

	QUnit.test("actions", function(assert) {
		// system under test
		var oNavigationPopover = new NavigationPopover({
			availableActions: [
				new LinkData({
					text: "Link1",
					href: "href1"
				}), new LinkData({
					text: "Link2",
					href: "href2"
				})
			]
		});

		// assertions
		assert.equal(oNavigationPopover._getContentContainer().getItems().length, 4);
		assert.equal(oNavigationPopover._getContentContainer().getItems()[2].getItems().length, 2, "Actions");
		assert.equal(oNavigationPopover._getContentContainer().getItems()[2].getItems()[0].getItems()[0].getText(), "Link1");
		assert.equal(oNavigationPopover._getContentContainer().getItems()[2].getItems()[0].getItems()[0].getHref(), "href1");
		assert.equal(oNavigationPopover._getContentContainer().getItems()[2].getItems()[1].getItems()[0].getText(), "Link2");
		assert.equal(oNavigationPopover._getContentContainer().getItems()[2].getItems()[1].getItems()[0].getHref(), "href2");

		// cleanup
		oNavigationPopover.destroy();
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationPopover");

	QUnit.test("setExtraContent", function(assert) {
		// system under test
		var oText1 = new Text();
		var oNavigationPopover = new NavigationPopover({
			extraContent: oText1
		});

		// assertions
		assert.deepEqual(oNavigationPopover.getExtraContent(), oText1.getId());
		assert.equal(oNavigationPopover._getContentContainer().getItems().length, 5);
		assert.equal(oNavigationPopover._getContentContainer().getItems()[1], oText1);

		// act
		oNavigationPopover.setExtraContent(oText1);

		// assertions
		assert.deepEqual(oNavigationPopover.getExtraContent(), oText1.getId());
		assert.equal(oNavigationPopover._getContentContainer().getItems().length, 5, "Content should not change if same control was added twice");
		assert.equal(oNavigationPopover._getContentContainer().getItems()[1], oText1);

		// act
		var oText2 = new Text();
		oNavigationPopover.setExtraContent(oText2);

		// assertions
		assert.equal(oNavigationPopover.getExtraContent(), oText2.getId(), "Association has to be filled correctly");
		assert.equal(oNavigationPopover._getContentContainer().getItems().length, 5);
		assert.equal(oNavigationPopover._getContentContainer().getItems()[1], oText2, "Control has to be in the content aggregation");
		assert.ok(!oText1.getParent(), "Control should have been removed after new control has been set");
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationPopover: getDirectLink");

	QUnit.test("only main link", function(assert) {
		// act: visible LinkData
		var oNavigationPopover = new NavigationPopover({
			mainNavigation: new LinkData({
				href: "href",
				text: "link"
			})
		});
		// assertions
		assert.ok(oNavigationPopover.getDirectLink());
		assert.ok(oNavigationPopover.getDirectLink() instanceof Link);

		// act: invisible LinkData
		oNavigationPopover = new NavigationPopover({
			mainNavigation: new LinkData({
				href: "href",
				text: "link",
				visible: false
			})
		});
		// assertions
		assert.ok(oNavigationPopover.getDirectLink());
		assert.ok(oNavigationPopover.getDirectLink() instanceof Link);

		// act: visible LinkData in combination with subTitle
		oNavigationPopover = new NavigationContainer({
			mainNavigation: new LinkData({
				href: "href",
				text: "link",
				description: "Additional info"
			})
		});
		// assertions
		assert.ok(oNavigationPopover.getDirectLink());
		assert.ok(oNavigationPopover.getDirectLink() instanceof Link);

		// cleanup
		oNavigationPopover.destroy();
	});

	QUnit.test("only one action", function(assert) {
		// act: visible LinkData
		var oNavigationPopover = new NavigationPopover({
			availableActions: [
				new LinkData({
					href: "href",
					text: "link"
				})
			]
		});
		// assertions
		assert.ok(oNavigationPopover.getDirectLink());
		assert.ok(oNavigationPopover.getDirectLink() instanceof Link);

		// act: invisible LinkData
		oNavigationPopover = new NavigationPopover({
			availableActions: [
				new LinkData({
					href: "href",
					text: "link",
					visible: false
				})
			]
		});
		// assertions
		assert.ok(oNavigationPopover.getDirectLink());
		assert.ok(oNavigationPopover.getDirectLink() instanceof Link);

		// act: visible LinkData in combination with subTitle
		oNavigationPopover = new NavigationContainer({
			availableActions: [
				new LinkData({
					href: "href",
					text: "link",
					description: "Additional info"
				})
			]
		});
		// assertions
		assert.ok(oNavigationPopover.getDirectLink(), "If only one available action exists (independent whether it is visible or not), direct navigation is possible");
		assert.ok(oNavigationPopover.getDirectLink() instanceof Link);

		// cleanup
		oNavigationPopover.destroy();
	});

	QUnit.test("only extraContent", function(assert) {
		// act
		var oNavigationPopover = new NavigationPopover({
			extraContent: new Control()
		});

		// assertions
		assert.ok(!oNavigationPopover.getDirectLink());

		// cleanup
		oNavigationPopover.destroy();
	});

	QUnit.test("main link and action", function(assert) {
		// act: visible LinkData
		var oNavigationPopover = new NavigationPopover({
			mainNavigation: new LinkData({
				href: "href1",
				text: "link1"
			}),
			availableActions: [
				new LinkData({
					href: "href2",
					text: "link2"
				})
			]
		});
		// assertions
		assert.ok(!oNavigationPopover.getDirectLink());

		// act: invisible LinkData
		oNavigationPopover = new NavigationPopover({
			mainNavigation: new LinkData({
				href: "href1",
				text: "link1",
				visible: false
			}),
			availableActions: [
				new LinkData({
					href: "href2",
					text: "link2",
					visible: false
				})
			]
		});
		// assertions
		assert.ok(!oNavigationPopover.getDirectLink());

		// cleanup
		oNavigationPopover.destroy();
	});

	QUnit.test("main link and extraContent", function(assert) {
		// act: visible LinkData
		var oNavigationPopover = new NavigationPopover({
			mainNavigation: new LinkData({
				href: "href1",
				text: "link1"
			}),
			extraContent: new Control()
		});
		// assertions
		assert.ok(!oNavigationPopover.getDirectLink());

		// act: invisible LinkData
		oNavigationPopover = new NavigationPopover({
			mainNavigation: new LinkData({
				href: "href1",
				text: "link1"
			}),
			extraContent: new Control()
		});
		// assertions
		assert.ok(!oNavigationPopover.getDirectLink());

		// cleanup
		oNavigationPopover.destroy();
	});

	QUnit.test("action and extraContent", function(assert) {
		// act: visible LinkData
		var oNavigationPopover = new NavigationPopover({
			availableActions: [
				new LinkData({
					href: "href2",
					text: "link2"
				})
			],
			extraContent: new Control()
		});
		// assertions
		assert.ok(!oNavigationPopover.getDirectLink());

		// act: invisible LinkData
		oNavigationPopover = new NavigationPopover({
			availableActions: [
				new LinkData({
					href: "href2",
					text: "link2"
				})
			],
			extraContent: new Control()
		});
		// assertions
		assert.ok(!oNavigationPopover.getDirectLink());

		// cleanup
		oNavigationPopover.destroy();
	});

	QUnit.test("main link, action and extraContent", function(assert) {
		// act: visible LinkData
		var oNavigationPopover = new NavigationPopover({
			mainNavigation: new LinkData({
				href: "href1",
				text: "link1"
			}),
			availableActions: [
				new LinkData({
					href: "href2",
					text: "link2"
				})
			],
			extraContent: new Control()
		});
		// assertions
		assert.ok(!oNavigationPopover.getDirectLink());

		// act: invisible LinkData
		oNavigationPopover = new NavigationPopover({
			mainNavigation: new LinkData({
				href: "href1",
				text: "link1"
			}),
			availableActions: [
				new LinkData({
					href: "href2",
					text: "link2"
				})
			],
			extraContent: new Control()
		});
		// assertions
		assert.ok(!oNavigationPopover.getDirectLink());

		// cleanup
		oNavigationPopover.destroy();
	});

	QUnit.test("with external content", function(assert) {
		var oLink = new LinkData({
			text: "DirectLink",
			href: "DirectHref"
		});
		var oNavigationPopover = new NavigationPopover({
			content: [
				new NavigationContainer({
					mainNavigation: oLink
				})
			],
			customData: new CustomData({
				key: "useExternalContent",
				value: true
			})
		});

		assert.deepEqual(oNavigationPopover.getDirectLink().getText(), oLink.getText(), "Correct link returned in case of external content");
		assert.deepEqual(oNavigationPopover.getDirectLink().getHref(), oLink.getHref(), "Correct link returned in case of external content");
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationPopover");

	QUnit.test("Main link: with no href", async function(assert) {
		// system under test
		var oText = new Text({
			text: "any source"
		});
		var oNavigationPopover = new NavigationPopover({
			mainNavigation: new LinkData({
				text: "text of Mainlink"
			}),
			availableActions: [
				new LinkData({
					href: "href1",
					text: "text of action link1"
				}), new LinkData({
					href: "href2",
					text: "text of action link2"
				})
			],
			source: oText
		});

		// arrange
		oText.placeAt("qunit-fixture");
		await nextUIUpdate();

		// act
		oNavigationPopover.show();

		// assertions
		assert.equal(oNavigationPopover.$().find("a").length, 3);
		assert.equal(oNavigationPopover.$().find("a")[0].text, "text of Mainlink");

		// cleanup
		oNavigationPopover.destroy();
		oText.destroy();
	});

	QUnit.test("Main link: with no href and mainNavigationId", async function(assert) {
		// system under test
		var oText = new Text({
			text: "any source"
		});
		var oNavigationPopover = new NavigationPopover({
			mainNavigationId: "Title of Mainlink",
			mainNavigation: new LinkData({
				text: "dummy"
			}),
			availableActions: [
				new LinkData({
					href: "href1",
					text: "text of action link1"
				}), new LinkData({
					href: "href2",
					text: "text of action link2"
				})
			],
			source: oText
		});

		// arrange
		oText.placeAt("qunit-fixture");
		await nextUIUpdate();

		// act
		oNavigationPopover.show();

		// assertions
		assert.equal(oNavigationPopover.$().find("a").length, 3);
		assert.equal(oNavigationPopover.$().find("a")[0].text, "Title of Mainlink");

		// cleanup
		oNavigationPopover.destroy();
		oText.destroy();
	});

	QUnit.test("Title of main link: with no title", async function(assert) {
		// system under test
		var oText = new Text({
			text: "any source"
		});
		var oNavigationPopover = new NavigationPopover({
			mainNavigation: new LinkData({
				href: "href",
				text: "text of Mainlink"
			}),
			source: oText
		});

		// arrange
		oText.placeAt("qunit-fixture");
		await nextUIUpdate();

		// act
		oNavigationPopover.show();

		// assertions
		assert.equal(oNavigationPopover.getMainNavigationId(), "");
		assert.ok(oNavigationPopover.getDomRef());

		// cleanup
		oNavigationPopover.destroy();
		oText.destroy();
	});

	QUnit.test("Title of main link: with title", async function(assert) {
		// system under test
		var oText = new Text({
			text: "any source"
		});
		var oNavigationPopover = new NavigationPopover({
			mainNavigationId: "Title of Mainlink",
			mainNavigation: new LinkData({
				href: "href",
				text: "text of Mainlink"
			}),
			source: oText
		});

		// arrange
		oText.placeAt("qunit-fixture");
		await nextUIUpdate();

		// act
		oNavigationPopover.show();

		// assertions
		assert.equal(oNavigationPopover.getMainNavigationId(), "Title of Mainlink");
		assert.ok(oNavigationPopover.getDomRef());

		// cleanup
		oNavigationPopover.destroy();
		oText.destroy();
	});

	QUnit.test("event 'navigate': mainNavigationLink", async function(assert) {
		// system under test
		var oText = new Text({
			text: "any source"
		});
		var oNavigationPopover = new NavigationPopover({
			mainNavigationId: "Title of Mainlink",
			mainNavigation: new LinkData({
				href: "href",
				text: "text of Mainlink"
			}),
			source: oText
		});

		// arrange
		var fnFireNavigateSpy = sinon.spy(oNavigationPopover, "fireNavigate");

		oText.placeAt("qunit-fixture");
		await nextUIUpdate();

		oNavigationPopover.show();

		// act
		qutils.triggerEvent("click", oNavigationPopover.$().find("a")[0], {
			srcControl: oNavigationPopover
		});
		qutils.triggerTouchEvent("tap", oNavigationPopover.$().find("a")[0], {
			srcControl: oNavigationPopover
		});

		// assertions
		assert.ok(fnFireNavigateSpy.calledOnce);

		// cleanup
		oNavigationPopover.destroy();
		oText.destroy();
		oNavigationPopover.fireNavigate.restore();
	});

	QUnit.test("event 'navigate': availableAction", async function(assert) {
		// system under test
		var oText = new Text({
			text: "any source"
		});
		var oNavigationPopover = new NavigationPopover({
			mainNavigationId: "Title of Mainlink",
			mainNavigation: new LinkData({
				href: "href",
				text: "text of Mainlink"
			}),
			availableActions: [
				new LinkData({
					href: "href",
					text: "text of action link"
				})
			],
			source: oText
		});

		// arrange
		var fnFireNavigateSpy = sinon.spy(oNavigationPopover, "fireNavigate");

		oText.placeAt("qunit-fixture");
		await nextUIUpdate();

		oNavigationPopover.show();

		// act
		qutils.triggerEvent("click", oNavigationPopover.$().find("a")[0], {
			srcControl: oNavigationPopover
		});
		qutils.triggerTouchEvent("tap", oNavigationPopover.$().find("a")[0], {
			srcControl: oNavigationPopover
		});

		// assertions
		assert.ok(fnFireNavigateSpy.calledOnce);

		// cleanup
		oNavigationPopover.destroy();
		oText.destroy();
		oNavigationPopover.fireNavigate.restore();
	});

	QUnit.test("availableAction", async function(assert) {
		// system under test
		var oText = new Text({
			text: "any source"
		});
		var oNavigationPopover = new NavigationPopover({
			mainNavigationId: "Title of Mainlink",
			mainNavigation: new LinkData({
				href: "href",
				text: "text of Mainlink"
			}),
			availableActions: [
				new LinkData({
					href: "href",
					text: "text of action link"
				})
			],
			source: oText
		});

		// arrange
		oText.placeAt("qunit-fixture");
		await nextUIUpdate();

		// act
		oNavigationPopover.show();

		// assertions
		assert.equal(oNavigationPopover._oPersonalizationButton.getVisible(), false);

		// cleanup
		oNavigationPopover.destroy();
		oText.destroy();
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationPopover: setMainNavigationId", oExtendedModuleSettings);

	QUnit.test("straight forward", function(assert) {
		// Assert - inital state
		assert.equal(this.oNavigationPopover.getMainNavigationId(), "", "No mainNavigationId set");
		assert.equal(this.oModel.getProperty("/mainNavigationLink/title"), undefined, "No mainNavigationId set in Model");

		// Act
		this.oNavigationPopover.setMainNavigationId("TEST");

		// Assert
		assert.equal(this.oNavigationPopover.getMainNavigationId(), "TEST", "Correct mainNavigationId set");
		assert.equal(this.oModel.getProperty("/mainNavigationLink/title"), "TEST", "Correct mainNavigationId set in Model");
	});

	QUnit.test("with external content", function(assert) {
		assert.throws(function() {
			this.oNavigationPopoverWithExternalContent.setMainNavigationId();
		}.bind(this), vExternalContentErrorMatcher, "Correct error thrown");
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationPopover: setAvailableActionsPersonalizationText", oExtendedModuleSettings);

	QUnit.test("straight forward", function(assert) {
		// Assert - inital state
		assert.equal(this.oNavigationPopover.getAvailableActionsPersonalizationText(), undefined, "No availableActionsPersonalizationText set");
		assert.equal(this.oModel.getProperty("/availableActionsPersonalizationText"), undefined, "No availableActionsPersonalizationText set in Model");

		// Act
		this.oNavigationPopover.setAvailableActionsPersonalizationText("TEST");

		// Assert
		assert.equal(this.oNavigationPopover.getAvailableActionsPersonalizationText(), "TEST", "Correct availableActionsPersonalizationText set");
		assert.equal(this.oModel.getProperty("/availableActionsPersonalizationText"), "TEST", "Correct availableActionsPersonalizationText set in Model");
	});

	QUnit.test("with external content", function(assert) {
		assert.throws(function() {
			this.oNavigationPopoverWithExternalContent.setAvailableActionsPersonalizationText();
		}.bind(this), vExternalContentErrorMatcher, "Correct error thrown");
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationPopover: setExtraContent", oExtendedModuleSettings);

	QUnit.test("initial state", function(assert) {
		// Assert
		assert.equal(this.oNavigationPopover.getExtraContent(), undefined, "No extraContent set");
		assert.equal(this.oModel.getProperty("/extraContent"), undefined, "No extraContent set in Model");
	});

	QUnit.test("set to Text control by control instance", function(assert) {
		// Arrange
		var oContentContainer = this.oNavigationPopover._getContentContainer();
		var fnContentContainerRemoveItemSpy = sinon.spy(oContentContainer, "removeItem");

		// Act
		var oText = new Text({ text: "TEXT" });
		this.oNavigationPopover.setExtraContent(oText);

		// Assert
		assert.deepEqual(this.oNavigationPopover.getExtraContent(), oText.getId(), "Correct extraContent set by oControl");
		assert.deepEqual(this.oModel.getProperty("/extraContent"), oText, "Correct extraContent set in Model");
		assert.ok(fnContentContainerRemoveItemSpy.notCalled, "extraContent not removed from contentContainer");
	});

	QUnit.test("overwrite with new Text control by id", function(assert) {
		// Arrange
		var oContentContainer = this.oNavigationPopover._getContentContainer();
		var fnContentContainerRemoveItemSpy = sinon.spy(oContentContainer, "removeItem");

		// Act
		var oText = new Text({ text: "TEXT" });
		this.oNavigationPopover.setExtraContent(oText);

		var oNewText = new Text({ text: "NEWTEXT" });
		this.oNavigationPopover.setExtraContent(oNewText.getId());

		// Assert
		assert.deepEqual(this.oNavigationPopover.getExtraContent(), oNewText.getId(), "Correct extraContent set by sId");
		assert.deepEqual(this.oModel.getProperty("/extraContent"), oNewText, "Correct extraContent set in Model");
		assert.ok(fnContentContainerRemoveItemSpy.calledOnce, "extraContent removed from contentContainer");
	});

	QUnit.test("set to array", function(assert) {
		// Arrange
		var oText = new Text({ text: "TEXT" });
		var oButton = new Button({ text: "TEXT" });

		// Act + Assert
		assert.throws(function() {
			this.oNavigationPopover.setExtraContent([oText, oButton]);
		}.bind(this), "Error thrown");
	});

	QUnit.test("with external content", function(assert) {
		assert.throws(function() {
			this.oNavigationPopoverWithExternalContent.setExtraContent();
		}.bind(this), vExternalContentErrorMatcher, "Correct error thrown");
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationPopover: setMainNavigation", oExtendedModuleSettings);

	var fnCheckSetMainNavigation = function(assert, oNavigationPopover, oModel, oLinkData, oExpectedMainNavigation, oExpectedModelValue) {
		if (oLinkData) {
			// Act
			oNavigationPopover.setMainNavigation(oLinkData);
		}
		// Assert
		assert.equal(oNavigationPopover.getMainNavigation(), oExpectedMainNavigation, "Correct mainNavigation set");
		assert.deepEqual(oModel.getProperty("/mainNavigationLink"), oExpectedModelValue, "Correct mainNavigationLink set in Model");
	};

	QUnit.test("initial state", function(assert) {
		// Arrange
		var oExpectedModelValue = {
			"href": undefined,
			"subtitle": undefined,
			"target": undefined,
			"title": undefined
		};

		// Act + Assert
		fnCheckSetMainNavigation(assert, this.oNavigationPopover, this.oModel, undefined, undefined, oExpectedModelValue);
	});

	QUnit.test("empty LinkData", function(assert) {
		// Arrange
		var oExpectedModelValue = {
			"href": undefined,
			"subtitle": undefined,
			"target": undefined,
			"title": ""
		};
		var oLinkData = new LinkData();

		// Act + Assert
		fnCheckSetMainNavigation(assert, this.oNavigationPopover, this.oModel, oLinkData, oLinkData, oExpectedModelValue);
	});

	QUnit.test("LinkData with href", function(assert) {
		// Arrange
		var oExpectedModelValue = {
			"href": "#href",
			"internalHref": "#internalHref",
			"subtitle": undefined,
			"target": "",
			"title": ""
		};
		var oLinkData = new LinkData({
			href: "#href",
			internalHref: "#internalHref"
		});

		// Act + Assert
		fnCheckSetMainNavigation(assert, this.oNavigationPopover, this.oModel, oLinkData, oLinkData, oExpectedModelValue);
	});

	QUnit.test("LinkData with href and target", function(assert) {
		// Arrange
		var oExpectedModelValue = {
			"href": "#href",
			"internalHref": "#internalHref",
			"subtitle": undefined,
			"target": "_blank",
			"title": ""
		};
		var oLinkData = new LinkData({
			href: "#href",
			internalHref: "#internalHref",
			target: "_blank"
		});

		// Act + Assert
		fnCheckSetMainNavigation(assert, this.oNavigationPopover, this.oModel, oLinkData, oLinkData, oExpectedModelValue);
	});

	QUnit.test("LinkData with href, target and text", function(assert) {
		// Arrange
		var oExpectedModelValue = {
			"href": "#href",
			"internalHref": "#internalHref",
			"subtitle": undefined,
			"target": "_blank",
			"title": "Title"
		};
		var oLinkData = new LinkData({
			href: "#href",
			internalHref: "#internalHref",
			target: "_blank",
			text: "Title"
		});

		// Act + Assert
		fnCheckSetMainNavigation(assert, this.oNavigationPopover, this.oModel, oLinkData, oLinkData, oExpectedModelValue);
	});

	QUnit.test("LinkData with href, target, title and description", function(assert) {
		// Arrange
		var oExpectedModelValue = {
			"href": "#href",
			"internalHref": "#internalHref",
			"subtitle": "Subtitle",
			"target": "_blank",
			"title": "Title"
		};
		var oLinkData = new LinkData({
			href: "#href",
			internalHref: "#internalHref",
			target: "_blank",
			text: "Title",
			description: "Subtitle"
		});

		// Act + Assert
		fnCheckSetMainNavigation(assert, this.oNavigationPopover, this.oModel, oLinkData, oLinkData, oExpectedModelValue);
	});

	QUnit.test("overwrite LinkData after title is set already", function(assert) {
		// Arrange
		this.oNavigationPopover.setMainNavigation(new LinkData({
			text: "Title"
		}));
		var oExpectedModelValue = {
			"href": "#href",
			"internalHref": "#internalHref",
			"subtitle": "Subtitle",
			"target": "_blank",
			"title": "Title"
		};
		var oLinkData = new LinkData({
			href: "#href",
			internalHref: "#internalHref",
			target: "_blank",
			text: "New Title",
			description: "Subtitle"
		});

		// Act + Assert
		fnCheckSetMainNavigation(assert, this.oNavigationPopover, this.oModel, oLinkData, oLinkData, oExpectedModelValue);
	});

	QUnit.test('set to undefined / null / ""', function(assert) {
		var oExpectedValue = {
			"href": undefined,
			"subtitle": undefined,
			"target": undefined,
			"title": undefined
		};
		var aValues = [undefined, null, ""];

		aValues.forEach(function(vValue) {
			// Act
			this.oNavigationPopover.setMainNavigation(vValue);

			// Assert
			assert.equal(this.oNavigationPopover.getMainNavigation(), undefined, "No mainNavigation set");
			assert.deepEqual(this.oModel.getProperty("/mainNavigationLink"), oExpectedValue, "No mainNavigation set in Model");
		}.bind(this));
	});

	QUnit.test("wrong control type", function(assert) {
		// Act + Assert
		assert.throws(function() {
			this.oNavigationPopover.setMainNavigation(new Text({text: "TEXT"}));
		}.bind(this), "Error thrown");
	});

	QUnit.test("set to array", function(assert) {
		// Arrange
		var oLinkData1 = new LinkData({ text: "TEXT", href: "href" });
		var oLinkData2 = new LinkData({ text: "TEXT", href: "href" });

		// Act + Assert
		assert.throws(function() {
			this.oNavigationPopover.setMainNavigation([oLinkData1, oLinkData2]);
		}.bind(this), "Error thrown");
	});

	QUnit.test("with external content", function(assert) {
		assert.throws(function() {
			this.oNavigationPopoverWithExternalContent.setMainNavigation();
		}.bind(this), vExternalContentErrorMatcher, "Correct error thrown");
	});

	// Remove press event handling as we can't check for that in QUnit..
	var fnRemovePressEventHandling = function(aAvailableActions) {
		aAvailableActions.forEach(function(oAvailableAction) {
			oAvailableAction.press = null;
		});
		return aAvailableActions;
	};

	QUnit.module("sap.ui.comp.navpopover.NavigationPopover: addAvailableAction", oExtendedModuleSettings);

	var fnCheckAddAvailableAction = function(assert, oNavigationPopover, oModel, oLinkData, aExpectedLinkData, aExpectedModelValues, sMessage) {
		// Act
		oNavigationPopover.addAvailableAction(oLinkData);

		// Assert
		assert.deepEqual(oNavigationPopover.getAvailableActions(), aExpectedLinkData, sMessage);
		assert.deepEqual(fnRemovePressEventHandling(oModel.getProperty("/availableActions")), aExpectedModelValues, sMessage + " in oModel");
	};

	QUnit.test("empty LinkData", function(assert) {
		// Arrange
		var oLinkData = new LinkData();

		// Act + Assert
		fnCheckAddAvailableAction(assert, this.oNavigationPopover, this.oModel, oLinkData, [oLinkData], [oLinkData.getJson()], "correct availableAction added");
	});

	QUnit.test("not empty LinkData", function(assert) {
		// Arrange
		var oLinkData = new LinkData({
			text: "TEXT",
			href: "#href",
			target: "_blank"
		});

		// Act + Assert
		fnCheckAddAvailableAction(assert, this.oNavigationPopover, this.oModel, oLinkData, [oLinkData], [oLinkData.getJson()], "correct availableAction added");
	});

	QUnit.test('undefined / null / ""', function(assert) {
		// Arrange
		var aValues = [undefined, null, ""];

		aValues.forEach(function(vValue) {
			// Act + Assert
			fnCheckAddAvailableAction(assert, this.oNavigationPopover, this.oModel, vValue, [], [], "No availableAction added");
		}.bind(this));
	});

	QUnit.test("wrong control type", function(assert) {
		// Act + Assert
		assert.throws(function() {
			this.oNavigationPopover.addAvailableAction(new Text({text: "TEXT"}));
		}.bind(this), "Error thrown");
	});

	QUnit.test("with external content", function(assert) {
		assert.throws(function() {
			this.oNavigationPopoverWithExternalContent.addAvailableAction();
		}.bind(this), vExternalContentErrorMatcher, "Correct error thrown");
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationPopover: insertAvailableAction", oExtendedModuleSettings);

	var fnCheckInsertAvailableAction = function(assert, oNavigationPopover, oModel, oLinkData, iIndex, aExpectedLinkData, aExpectedModelValues, sMessage) {
		// Act
		oNavigationPopover.insertAvailableAction(oLinkData, iIndex);

		// Assert
		assert.deepEqual(oNavigationPopover.getAvailableActions(), aExpectedLinkData, sMessage);
		assert.deepEqual(fnRemovePressEventHandling(oModel.getProperty("/availableActions")), fnRemovePressEventHandling(aExpectedModelValues), sMessage + " in oModel");
	};

	QUnit.test("empty LinkData", function(assert) {
		// Arrange
		var oLinkData = new LinkData();

		// Act + Assert
		fnCheckInsertAvailableAction(assert, this.oNavigationPopover, this.oModel, oLinkData, 0, [oLinkData], [oLinkData.getJson()], "correct available action inserted");
	});

	QUnit.test("not empty LinkData", function(assert) {
		var oEmptyLinkData = new LinkData();
		this.oNavigationPopover.addAvailableAction(oEmptyLinkData);

		// Arrange
		var oLinkData = new LinkData({
			text: "TEXT",
			href: "#href",
			target: "_blank"
		});

		// Act + Assert
		fnCheckInsertAvailableAction(assert, this.oNavigationPopover, this.oModel, oLinkData, 0, [oLinkData, oEmptyLinkData], [oLinkData.getJson(), oEmptyLinkData.getJson()], "correct available action inserted");
	});

	QUnit.test('undefined / null / ""', function(assert) {
		// Arrange
		var aValues = [undefined, null, ""];

		aValues.forEach(function(vValue) {
			// Act + Assert
			fnCheckInsertAvailableAction(assert, this.oNavigationPopover, this.oModel, vValue, 0, [], [], "No availableAction inserted");
		}.bind(this));
	});

	QUnit.test("wrong control type", function(assert) {
		// Act + Assert
		assert.throws(function() {
			this.oNavigationPopover.insertAvailableAction(new Text({text: "TEXT"}));
		}.bind(this), "Error thrown");
	});

	QUnit.test("with external content", function(assert) {
		assert.throws(function() {
			this.oNavigationPopoverWithExternalContent.insertAvailableAction();
		}.bind(this), vExternalContentErrorMatcher, "Correct error thrown");
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationPopover: removeAvailableAction", oExtendedModuleSettings);

	var fnCheckRemoveAvailableAction = function(assert, oNavigationPopover, oModel, oActionToRemove, aExpectedLinkData, aExpectedModelValues, sMessage) {
		// Act
		oNavigationPopover.removeAvailableAction(oActionToRemove);

		// Assert
		assert.deepEqual(oNavigationPopover.getAvailableActions(), aExpectedLinkData, sMessage);
		assert.deepEqual(fnRemovePressEventHandling(oModel.getProperty("/availableActions")), fnRemovePressEventHandling(aExpectedModelValues), sMessage + " in oModel");
	};

	QUnit.test("not existing available action", function(assert) {
		// Arrange
		var oLinkData = new LinkData();
		this.oNavigationPopover.addAvailableAction(oLinkData);

		// Act + Assert
		fnCheckRemoveAvailableAction(assert, this.oNavigationPopover, this.oModel, new LinkData(), [oLinkData], [oLinkData.getJson()], "No availableAction removed");
	});

	QUnit.test("existing available action", function(assert) {
		// Arrange
		var oLinkData1 = new LinkData();
		var oLinkData2 = new LinkData();
		var oLinkData3 = new LinkData();
		this.oNavigationPopover.addAvailableAction(oLinkData1);
		this.oNavigationPopover.addAvailableAction(oLinkData2);
		this.oNavigationPopover.addAvailableAction(oLinkData3);

		// Act + Assert
		fnCheckRemoveAvailableAction(assert, this.oNavigationPopover, this.oModel, oLinkData2, [oLinkData1, oLinkData3], [oLinkData1.getJson(), oLinkData3.getJson()], "No availableAction removed");
	});

	QUnit.test('undefined / null / ""', function(assert) {
		// Arrange
		var oLinkData = new LinkData();
		this.oNavigationPopover.addAvailableAction(oLinkData);
		var aValues = [undefined, null, ""];
		aValues.forEach(function(vValue) {
			// Act + Assert
			fnCheckRemoveAvailableAction(assert, this.oNavigationPopover, this.oModel, vValue, [oLinkData], [oLinkData.getJson()], "No availableAction removed");
		}.bind(this));
	});

	QUnit.test("with external content", function(assert) {
		assert.throws(function() {
			this.oNavigationPopoverWithExternalContent.removeAvailableAction();
		}.bind(this), vExternalContentErrorMatcher, "Correct error thrown");
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationPopover: removeAllAvailableActions", oExtendedModuleSettings);

	var fnCheckRemoveAllAvailableActions = function(assert, oNavigationPopover, oModel, sMessage) {
		// Act
		oNavigationPopover.removeAllAvailableActions();

		// Assert
		assert.deepEqual(oNavigationPopover.getAvailableActions(), [], sMessage);
		assert.deepEqual(oModel.getProperty("/availableActions"), [], sMessage + " in Model");
	};

	QUnit.test("when there are no availableActions", function(assert) {
		// Act + Assert
		fnCheckRemoveAllAvailableActions(assert, this.oNavigationPopover, this.oModel, "all available actions removed");
	});

	QUnit.test("when there are availableActions", function(assert) {
		// Arrange
		var oLinkData1 = new LinkData();
		var oLinkData2 = new LinkData();
		var oLinkData3 = new LinkData();
		this.oNavigationPopover.addAvailableAction(oLinkData1);
		this.oNavigationPopover.addAvailableAction(oLinkData2);
		this.oNavigationPopover.addAvailableAction(oLinkData3);

		// Act + Assert
		fnCheckRemoveAllAvailableActions(assert, this.oNavigationPopover, this.oModel, "all available actions removed");
	});

	QUnit.test("with external content", function(assert) {
		assert.throws(function() {
			this.oNavigationPopoverWithExternalContent.removeAllAvailableActions();
		}.bind(this), vExternalContentErrorMatcher, "Correct error thrown");
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationPopover: hasContent", oDefaultModuleSettings);

	QUnit.test("empty NavigationPopover", function(assert) {
		// Act / Assert
		assert.equal(this.oNavigationPopover.hasContent(), false, "False returned when called with empty NavigationPopover");
	});

	QUnit.test("mainNavigation without href", function(assert) {
		// Arrange
		this.oNavigationPopover.setMainNavigation(new LinkData({
			text: "Link"
		}));

		// Act / Assert
		assert.equal(this.oNavigationPopover.hasContent(), false, "False returned when called with mainNavigation without href");
	});

	QUnit.test("mainNavigation with href", function(assert) {
		// Arrange
		this.oNavigationPopover.setMainNavigation(new LinkData({
			text: "Link",
			href: "#href"
		}));

		// Act / Assert
		assert.equal(this.oNavigationPopover.hasContent(), true, "True returned when called with mainNavigation");
	});

	QUnit.test("availableActions", function(assert) {
		// Arrange
		this.oNavigationPopover = new NavigationPopover({
			availableActions: [
				new LinkData()
			]
		});

		// Act / Assert
		assert.equal(this.oNavigationPopover.hasContent(), true, "True returned when called with atleast one availableActions");
	});

	QUnit.test("external content", function(assert) {
		// Arrange
		var oNavigationContainer = new NavigationContainer();
		var fnNavigationContainerHasContentStub = sinon.stub(oNavigationContainer, "hasContent");
		fnNavigationContainerHasContentStub.returns(true);
		this.oNavigationPopover = new NavigationPopover({
			content: [
				new NavigationContainer()
			],
			customData: new CustomData({
				key: "useExternalContent",
				value: true
			})
		});

		// Act / Assert
		assert.equal(this.oNavigationPopover.hasContent(), false, "True returned when called with external content");
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationPopover: _getComponent", oDefaultModuleSettings);

	QUnit.test("no component set", function(assert) {
		assert.equal(this.oNavigationPopover._getComponent(), null, "No component returned");
	});

	QUnit.test("component set", function(assert) {
		var oComponent = new Component();
		this.oNavigationPopover.setComponent(oComponent);
		assert.deepEqual(this.oNavigationPopover._getComponent(), oComponent, "Correct component returned");
	});

	QUnit.test("component set to ID", function(assert) {
		var oComponent = new Component();
		this.oNavigationPopover.setComponent(oComponent.getId());
		assert.deepEqual(this.oNavigationPopover._getComponent(), oComponent, "Correct component returned");
	});

	QUnit.start();

});
