/* global  QUnit, sinon */

sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/comp/navpopover/NavigationContainer",
	"sap/ui/comp/navpopover/LinkData",
	"sap/m/Text",
	"sap/m/Link",
	"sap/m/Button",
	"sap/ui/core/Control",
	"sap/ui/fl/apply/api/FlexRuntimeInfoAPI",
	"sap/ui/comp/navpopover/FakeFlpConnector",
	"sap/base/Log",
	"sap/ui/base/Event",
	"sap/m/Title",
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/core/Component"
], function(
	qutils,
	NavigationContainer,
	LinkData,
	Text,
	Link,
	Button,
	Control,
	FlexRuntimeInfoAPI,
	FakeFlpConnector,
	Log,
	Event,
	Title,
	nextUIUpdate,
	Component
) {
	"use strict";

	const fnGetHeaderContent = function(oNavigationContainer) {
		return oNavigationContainer.getItems()[0];
	};

	const fnGetTitle = function(oNavigationContainer) {
		const oHeaderContent = fnGetHeaderContent(oNavigationContainer);

		if (!oHeaderContent) {
			return undefined;
		}

		return fnGetHeaderContent(oNavigationContainer).getItems()[0];
	};

	const fnGetTitleLink = function(oNavigationContainer) {
		const oTitle = fnGetTitle(oNavigationContainer);

		if (!oTitle) {
			return undefined;
		}

		return oTitle.getContent();
	};

	const fnGetSubTitle = function(oNavigationContainer) {
		const oHeaderContent = fnGetHeaderContent(oNavigationContainer);

		if (!oHeaderContent) {
			return undefined;
		}

		return fnGetHeaderContent(oNavigationContainer).getItems()[1];
	};

	const fnGetPersonalizationButtonContainer = function(oNavigationContainer) {
		return oNavigationContainer.getItems()[4];
	};

	const fnGetPersonalizationButton = function(oNavigationContainer) {
		return fnGetPersonalizationButtonContainer(oNavigationContainer).getItems()[0];
	};

	const fnGetAvailableActionsContainer = function(oNavigationContainer) {
		return oNavigationContainer.getItems()[3];
	};

	const fnGetAvailableActionLink = function(oNavigationContainer, iIndex) {
		return fnGetAvailableActionsContainer(oNavigationContainer).getItems()[iIndex].getItems()[0];
	};

	// const fnGetAvailableActionDescription = function(oNavigationContainer, iIndex) {
	// 	return fnGetAvailableActionsContainer(oNavigationContainer).getItems()[iIndex].getItems()[1];
	// };

	const fnGetExtraContent = function(oNavigationContainer) {
		return oNavigationContainer.getItems()[1];
	};

	QUnit.module("sap.ui.comp.navpopover.NavigationContainer", {
		beforeEach: function() {
		},
		afterEach: function() {
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(new NavigationContainer());
	});

	QUnit.test("constructor", function(assert) {
		// system under test
		var oNavigationContainer = new NavigationContainer({});

		// assert
		assert.equal(oNavigationContainer.getEnableAvailableActionsPersonalization(), true);
		assert.deepEqual(oNavigationContainer.getAvailableActions(), []); // Default value of an aggregation
		assert.deepEqual(oNavigationContainer.getMainNavigation(), null);
		assert.deepEqual(oNavigationContainer.getExtraContent(), null);
		assert.deepEqual(oNavigationContainer.getComponent(), null);

		// cleanup
		oNavigationContainer.destroy();
	});

	/*------------------------------------------------------------------------------------*/

	QUnit.test("display - mainNavigationId", async function(assert) {
		// system under test
		var oNavigationContainer = new NavigationContainer({
			mainNavigationId: "myMainNavigationId"
		});

		// arrange

		// act
		oNavigationContainer.placeAt("qunit-fixture");
		await nextUIUpdate();

		// assertions
		assert.ok(oNavigationContainer.getDomRef(), "The NavigationContainer should have a DomRef.");
		assert.equal(fnGetPersonalizationButtonContainer(oNavigationContainer).getVisible(), false, "The personalization button container shouldn't be visible.");
		assert.equal(fnGetPersonalizationButton(oNavigationContainer).getDomRef(), null, "The personalization button shouldn't be visible.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getText(), "myMainNavigationId", "The title link should display the correct text.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getHref(), "", "The title link should have no href.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getEnabled(), false, "The title link should be disabled.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getVisible(), true, "The title link should be visible.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getDomRef().attributes["aria-disabled"].value, 'true', "The title link should have attribute 'aria-disabled'.");
		assert.equal(fnGetSubTitle(oNavigationContainer).getText(), "", "The subtitle text should be empty.");
		assert.equal(fnGetSubTitle(oNavigationContainer).getVisible(), false, "The subtitle shouldn't be visible.");

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("display - mainNavigation", async function(assert) {
		// system under test
		var oNavigationContainer = new NavigationContainer({
			mainNavigation: new LinkData({
				text: "Main",
				description: "SubTitle",
				href: "href1"
			})
		});

		// arrange

		// act
		oNavigationContainer.placeAt("qunit-fixture");
		await nextUIUpdate();

		// assertions
		assert.ok(oNavigationContainer.getDomRef(), "The NavigationContainer should have a DomRef.");
		assert.equal(fnGetPersonalizationButtonContainer(oNavigationContainer).getVisible(), false, "The personalization button container shouldn't be visible.");
		assert.equal(fnGetPersonalizationButton(oNavigationContainer).getDomRef(), null, "The personalization button shouldn't be visible.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getText(), "Main", "The title link should display the correct text.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getHref(), "href1", "The title link should have the correct href.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getEnabled(), true, "The title link should be enabled.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getVisible(), true, "The title link should be visible.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getDomRef().attributes["aria-disabled"], undefined, "The title link should not have attribute 'aria-disabled'.");
		assert.equal(fnGetSubTitle(oNavigationContainer).getText(), "SubTitle", "The subtitle text should be correct.");
		assert.equal(fnGetSubTitle(oNavigationContainer).getVisible(), true, "The subtitle should be visible.");

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("display - mainNavigation with no href", async function(assert) {
		// system under test
		var oNavigationContainer = new NavigationContainer({
			mainNavigation: new LinkData({
				text: "Main",
				description: "SubTitle"
			})
		});

		// arrange

		// act
		oNavigationContainer.placeAt("qunit-fixture");
		await nextUIUpdate();

		// assertions
		assert.ok(oNavigationContainer.getDomRef(), "The NavigationContainer should have a DomRef.");
		assert.equal(fnGetPersonalizationButtonContainer(oNavigationContainer).getVisible(), false, "The personalization button container shouldn't be visible.");
		assert.equal(fnGetPersonalizationButton(oNavigationContainer).getDomRef(), null, "The personalization button shouldn't be visible.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getText(), "Main", "The title link should display the correct text.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getHref(), "", "The title link should have no href.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getEnabled(), false, "The title link should be disabled.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getVisible(), true, "The title link should be visible.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getDomRef().attributes["aria-disabled"].value, 'true', "The title link should have attribute 'aria-disabled'.");
		assert.equal(fnGetSubTitle(oNavigationContainer).getText(), "SubTitle", "The subtitle text should be correct.");
		assert.equal(fnGetSubTitle(oNavigationContainer).getVisible(), true, "The subtitle should be visible.");

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("display - mainNavigation with no href and not empty mainNavigationId", async function(assert) {
		// system under test
		var oNavigationContainer = new NavigationContainer({
			mainNavigationId: "myMainNavigationId",
			mainNavigation: new LinkData({
				text: "Main",
				description: "SubTitle"
			})
		});

		// arrange

		// act
		oNavigationContainer.placeAt("qunit-fixture");
		await nextUIUpdate();

		// assertions
		assert.ok(oNavigationContainer.getDomRef(), "The NavigationContainer should have a DomRef.");
		assert.equal(fnGetPersonalizationButtonContainer(oNavigationContainer).getVisible(), false, "The personalization button container shouldn't be visible.");
		assert.equal(fnGetPersonalizationButton(oNavigationContainer).getDomRef(), null, "The personalization button shouldn't be visible.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getText(), "myMainNavigationId", "The title link should display the correct text.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getHref(), "", "The title link should have no href.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getEnabled(), false, "The title link should be disabled.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getVisible(), true, "The title link should be visible.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getDomRef().attributes["aria-disabled"].value, 'true', "The title link should have attribute 'aria-disabled'.");
		assert.equal(fnGetSubTitle(oNavigationContainer).getText(), "SubTitle", "The subtitle text should be correct.");
		assert.equal(fnGetSubTitle(oNavigationContainer).getVisible(), true, "The subtitle should be visible.");

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("display - mainNavigation with not empty mainNavigationId", async function(assert) {
		// system under test
		var oNavigationContainer = new NavigationContainer({
			mainNavigationId: 'myMainNavigation',
			mainNavigation: new LinkData({
				text: "Main",
				description: "SubTitle",
				href: "href1"
			})
		});

		// arrange

		// act
		oNavigationContainer.placeAt("qunit-fixture");
		await nextUIUpdate();

		// assertions
		assert.ok(oNavigationContainer.getDomRef(), "The NavigationContainer should have a DomRef.");
		assert.equal(fnGetPersonalizationButtonContainer(oNavigationContainer).getVisible(), false, "The personalization button container shouldn't be visible.");
		assert.equal(fnGetPersonalizationButton(oNavigationContainer).getDomRef(), null, "The personalization button shouldn't be visible.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getText(), "myMainNavigation", "The title link should display the correct text.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getHref(), "href1", "The title link should have the correct href.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getEnabled(), true, "The title link should be enabled.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getVisible(), true, "The title link should be visible.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getDomRef().attributes["aria-disabled"], undefined, "The title link should not have attribute 'aria-disabled'.");
		assert.equal(fnGetSubTitle(oNavigationContainer).getText(), "SubTitle", "The subtitle text should be correct.");
		assert.equal(fnGetSubTitle(oNavigationContainer).getVisible(), true, "The subtitle should be visible.");

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("display - mainNavigation with empty mainNavigationId", async function(assert) {
		// system under test
		var oNavigationContainer = new NavigationContainer({
			mainNavigationId: '',
			mainNavigation: new LinkData({
				text: "Main",
				description: "SubTitle",
				href: "href1"
			})
		});

		// arrange

		// act
		oNavigationContainer.placeAt("qunit-fixture");
		await nextUIUpdate();

		// assertions
		assert.ok(oNavigationContainer.getDomRef(), "The NavigationContainer should have a DomRef.");
		assert.equal(fnGetPersonalizationButtonContainer(oNavigationContainer).getVisible(), false, "The personalization button container shouldn't be visible.");
		assert.equal(fnGetPersonalizationButton(oNavigationContainer).getDomRef(), null, "The personalization button shouldn't be visible.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getText(), "", "The title link should display the correct text.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getHref(), "href1", "The title link should have the correct href.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getEnabled(), true, "The title link should be enabled.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getVisible(), false, "The title link shouldn't be visible.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getDomRef(), undefined, "The title link should not have a DomRef.");
		assert.equal(fnGetSubTitle(oNavigationContainer).getText(), "SubTitle", "The subtitle text should be correct.");
		assert.equal(fnGetSubTitle(oNavigationContainer).getVisible(), true, "The subtitle should be visible.");

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("display - availableActions", async function(assert) {
		// system under test
		var oNavigationContainer = new NavigationContainer({
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

		// act
		oNavigationContainer.placeAt("qunit-fixture");
		await nextUIUpdate();

		// assertions
		assert.ok(oNavigationContainer.getDomRef(), "The NavigationContainer should have a DomRef.");
		assert.equal(fnGetPersonalizationButtonContainer(oNavigationContainer).getVisible(), false, "The personalization button container shouldn't be visible.");
		assert.equal(fnGetPersonalizationButton(oNavigationContainer).getDomRef(), null, "The personalization button shouldn't be visible.");

		assert.equal(fnGetAvailableActionsContainer(oNavigationContainer).getItems().length, 2, "The available actions container should have 2 items.");

		assert.equal(fnGetAvailableActionLink(oNavigationContainer, 0).getText(), "Link1", "The first action should have correct text.");
		assert.equal(fnGetAvailableActionLink(oNavigationContainer, 0).getHref(), "href1", "The first action should have correct href.");
		assert.equal(fnGetAvailableActionLink(oNavigationContainer, 0).getVisible(), true, "The first action should be visible.");
		assert.equal(fnGetAvailableActionLink(oNavigationContainer, 0).getEnabled(), true, "The first action should be enabled.");
		assert.equal(fnGetAvailableActionLink(oNavigationContainer, 0).getDomRef().attributes["aria-disabled"], undefined, "The first action shouldn't have attribute aria-disabled.");

		assert.equal(fnGetAvailableActionLink(oNavigationContainer, 1).getText(), "Link2", "The second action should have correct text.");
		assert.equal(fnGetAvailableActionLink(oNavigationContainer, 1).getHref(), "href2", "The second action should have correct href.");
		assert.equal(fnGetAvailableActionLink(oNavigationContainer, 1).getVisible(), true, "The second action should be visible.");
		assert.equal(fnGetAvailableActionLink(oNavigationContainer, 1).getEnabled(), true, "The second action should be enabled.");
		assert.equal(fnGetAvailableActionLink(oNavigationContainer, 1).getDomRef().attributes["aria-disabled"], undefined, "The second action shouldn't have attribute aria-disabled.");

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("display - extraContent", async function(assert) {
		// system under test
		var oText1 = new Text({
			text: "myText"
		});
		var oNavigationContainer = new NavigationContainer({
			extraContent: oText1
		});

		// act
		oNavigationContainer.placeAt("qunit-fixture");
		await nextUIUpdate();

		// assertions
		assert.ok(oNavigationContainer.getDomRef(), "The NavigationContainer should have a DomRef.");
		assert.deepEqual(oNavigationContainer.getExtraContent(), oText1.getId(), "The extra content aggregation should be set correctly.");
		assert.equal(fnGetExtraContent(oNavigationContainer).getId(), oText1.getId(), "The extra content should be set correctly.");
		assert.equal(fnGetExtraContent(oNavigationContainer).getText(), oText1.getText(), "The extra content should have correct text.");

		// act
		oNavigationContainer.setExtraContent(oText1);
		await nextUIUpdate();

		// assertions
		assert.ok(oNavigationContainer.getDomRef(), "The NavigationContainer should have a DomRef.");
		assert.deepEqual(oNavigationContainer.getExtraContent(), oText1.getId(), "The extra content aggregation should not change if same control was added twice");
		assert.equal(fnGetExtraContent(oNavigationContainer).getId(), oText1.getId(), "The extra content should be set correctly.");
		assert.equal(fnGetExtraContent(oNavigationContainer).getText(), oText1.getText(), "The extra content should have correct text.");

		// act
		var oText2 = new Text({
			text: "myTextNew"
		});
		oNavigationContainer.setExtraContent(oText2);
		await nextUIUpdate();

		// assertions
		assert.ok(oNavigationContainer.getDomRef(), "The NavigationContainer should have a DomRef.");
		assert.deepEqual(oNavigationContainer.getExtraContent(), oText2.getId(), "The extra content aggregation should be updated.");
		assert.equal(oNavigationContainer.$().find("#" + oText2.getId()).length, 1);
		assert.ok(oNavigationContainer.$().find("#" + oText2.getId())[0].textContent.endsWith("myTextNew"));
		assert.ok(!oText1.getParent(), "Control should have been removed after new control has been set");

		// cleanup
		oNavigationContainer.destroy();
		oText1.destroy();
		oText2.destroy();
	});

	QUnit.test("display - mainNavigation, mainNavigationId, availableActions, extraContent", async function(assert) {
		// system under test
		var oText1 = new Text({
			text: "myText"
		});
		var oNavigationContainer = new NavigationContainer({
			mainNavigationId: "myMainNavigationId",
			mainNavigation: new LinkData({
				text: "Main",
				description: "SubTitle",
				href: "href1"
			}),
			availableActions: [
				new LinkData({
					text: "Link1",
					href: "href1"
				}), new LinkData({
					text: "Link2",
					href: "href2"
				})
			],
			extraContent: oText1
		});

		// arrange

		// act
		oNavigationContainer.placeAt("qunit-fixture");
		await nextUIUpdate();

		// assertions
		assert.ok(oNavigationContainer.getDomRef(), "The NavigationContainer should have a DomRef.");
		assert.equal(fnGetPersonalizationButtonContainer(oNavigationContainer).getVisible(), false, "The personalization button container shouldn't be visible.");
		assert.equal(fnGetPersonalizationButton(oNavigationContainer).getDomRef(), null, "The personalization button shouldn't be visible.");

		assert.equal(fnGetTitleLink(oNavigationContainer).getText(), "myMainNavigationId", "The title link should display the correct text.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getHref(), "href1", "The title link should have correct href.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getEnabled(), true, "The title link should be enabled.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getVisible(), true, "The title link should be visible.");
		assert.equal(fnGetTitleLink(oNavigationContainer).getDomRef().attributes["aria-disabled"], undefined, "The title link should not have attribute 'aria-disabled'.");
		assert.equal(fnGetSubTitle(oNavigationContainer).getText(), "SubTitle", "The subtitle text should be correct.");
		assert.equal(fnGetSubTitle(oNavigationContainer).getVisible(), true, "The subtitle should be visible.");

		assert.equal(fnGetAvailableActionsContainer(oNavigationContainer).getItems().length, 2, "The available actions container should have 2 items.");

		assert.equal(fnGetAvailableActionLink(oNavigationContainer, 0).getText(), "Link1", "The first action should have correct text.");
		assert.equal(fnGetAvailableActionLink(oNavigationContainer, 0).getHref(), "href1", "The first action should have correct href.");
		assert.equal(fnGetAvailableActionLink(oNavigationContainer, 0).getVisible(), true, "The first action should be visible.");
		assert.equal(fnGetAvailableActionLink(oNavigationContainer, 0).getEnabled(), true, "The first action should be enabled.");
		assert.equal(fnGetAvailableActionLink(oNavigationContainer, 0).getDomRef().attributes["aria-disabled"], undefined, "The first action shouldn't have attribute aria-disabled.");

		assert.equal(fnGetAvailableActionLink(oNavigationContainer, 1).getText(), "Link2", "The second action should have correct text.");
		assert.equal(fnGetAvailableActionLink(oNavigationContainer, 1).getHref(), "href2", "The second action should have correct href.");
		assert.equal(fnGetAvailableActionLink(oNavigationContainer, 1).getVisible(), true, "The second action should be visible.");
		assert.equal(fnGetAvailableActionLink(oNavigationContainer, 1).getEnabled(), true, "The second action should be enabled.");
		assert.equal(fnGetAvailableActionLink(oNavigationContainer, 1).getDomRef().attributes["aria-disabled"], undefined, "The second action shouldn't have attribute aria-disabled.");

		assert.equal(fnGetExtraContent(oNavigationContainer).getId(), oText1.getId(), "The extra content should be set correctly.");
		assert.equal(fnGetExtraContent(oNavigationContainer).getText(), oText1.getText(), "The extra content should have correct text.");

		// cleanup
		oNavigationContainer.destroy();
		oText1.destroy();
	});

	QUnit.test("Text wrapping for long Links", async function(assert) {
		var sTitleLinkText = "myMainNavigationIdmyMainNavigationIdmyMainNavigationIdmyMainNavigationIdmyMainNavigationIdmyMainNavigationIdmyMainNavigationIdmyMainNavigationId";
		var oNavigationContainer = new NavigationContainer({
			mainNavigationId: sTitleLinkText,
			mainNavigation: new LinkData({
				text: "Main",
				description: "SubTitle",
				href: "href1"
			}),
			availableActions: [
				new LinkData({
					text: "Link1",
					href: "href1"
				}), new LinkData({
					text: "Link2",
					href: "href2"
				})
			],
			width: "380px"
		});

		// act
		oNavigationContainer.placeAt("qunit-fixture");
		await nextUIUpdate();

		// assertions
		assert.ok(oNavigationContainer.getDomRef(), "NavigationContainer DomRef available.");
		assert.equal(oNavigationContainer.$().find("a").length, 3, "There are 3 Links on the NavigationContainer.");
		assert.equal(oNavigationContainer.$().find("a")[0].text, sTitleLinkText, "Title-Link has text '" + sTitleLinkText + "'");

		assert.ok(oNavigationContainer.$().find("a")[0].classList.contains("sapMLnkWrapping"), "Title-Link has class 'sapMLnkWrapping'");
		assert.ok(oNavigationContainer.$().find("a")[1].classList.contains("sapMLnkWrapping"), "Link1 has class 'sapMLnkWrapping'");
		assert.ok(oNavigationContainer.$().find("a")[2].classList.contains("sapMLnkWrapping"), "Link2 has class 'sapMLnkWrapping'");
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationContainer: getDirectLink", {
		beforeEach: function() {
		},
		afterEach: function() {
		}
	});

	QUnit.test("only main link", function(assert) {
		// act: visible LinkData
		var oNavigationContainer = new NavigationContainer({
			mainNavigation: new LinkData({
				href: "href",
				text: "link"
			})
		});
		// assertions
		assert.ok(oNavigationContainer.getDirectLink());
		assert.ok(oNavigationContainer.getDirectLink() instanceof Link);

		// act: invisible LinkData
		oNavigationContainer = new NavigationContainer({
			mainNavigation: new LinkData({
				href: "href",
				text: "link",
				visible: false
			})
		});
		// assertions
		assert.ok(oNavigationContainer.getDirectLink(), "If only one available action exists (independent whether it is visible or not), direct navigation is possible");
		assert.ok(oNavigationContainer.getDirectLink() instanceof Link);

		// act: visible LinkData in combination with subTitle
		oNavigationContainer = new NavigationContainer({
			mainNavigation: new LinkData({
				href: "href",
				text: "link",
				description: "Additional info"
			})
		});
		// assertions
		assert.ok(oNavigationContainer.getDirectLink());
		assert.ok(oNavigationContainer.getDirectLink() instanceof Link);

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("only one action", function(assert) {
		// act: visible LinkData
		var oNavigationContainer = new NavigationContainer({
			availableActions: [
				new LinkData({
					href: "href",
					text: "link"
				})
			]
		});
		// assertions
		assert.ok(oNavigationContainer.getDirectLink());
		assert.ok(oNavigationContainer.getDirectLink() instanceof Link);

		// act: invisible LinkData
		oNavigationContainer = new NavigationContainer({
			availableActions: [
				new LinkData({
					href: "href",
					text: "link",
					visible: false
				})
			]
		});
		// assertions
		assert.ok(oNavigationContainer.getDirectLink(), "If only one available action exists (independent whether it is visible or not), direct navigation is possible");
		assert.ok(oNavigationContainer.getDirectLink() instanceof Link);

		// act: visible LinkData in combination with subTitle
		oNavigationContainer = new NavigationContainer({
			availableActions: [
				new LinkData({
					href: "href",
					text: "link",
					description: "Additional info"
				})
			]
		});
		// assertions
		assert.ok(oNavigationContainer.getDirectLink(), "If only one available action exists (independent whether it is visible or not), direct navigation is possible");
		assert.ok(oNavigationContainer.getDirectLink() instanceof Link);

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("multiple actions", function(assert) {
		// act: visible LinkData
		var oNavigationContainer = new NavigationContainer({
			availableActions: [
				new LinkData({
					href: "href1",
					text: "link1"
				}),
				new LinkData({
					href: "href2",
					text: "link2"
				})
			]
		});
		// assertions
		assert.ok(!oNavigationContainer.getDirectLink());


		// act: invisible LinkData
		oNavigationContainer = new NavigationContainer({
			availableActions: [
				new LinkData({
					href: "href1",
					text: "link1",
					visible: false
				}),
				new LinkData({
					href: "href2",
					text: "link2",
					visible: false
				})
			]
		});

		// assertions
		assert.ok(!oNavigationContainer.getDirectLink());

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("only extraContent", function(assert) {
		// act
		var oNavigationContainer = new NavigationContainer({
			extraContent: new Control()
		});

		// assertions
		assert.ok(!oNavigationContainer.getDirectLink());

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("main link and action", function(assert) {
		// system under test

		// arrange

		// act: visible LinkData
		var oNavigationContainer = new NavigationContainer({
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
		assert.ok(!oNavigationContainer.getDirectLink());

		// act: invisible LinkData
		oNavigationContainer = new NavigationContainer({
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
		assert.ok(!oNavigationContainer.getDirectLink());

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("main link and extraContent", function(assert) {
		// system under test

		// arrange

		// act: visible LinkData
		var oNavigationContainer = new NavigationContainer({
			mainNavigation: new LinkData({
				href: "href1",
				text: "link1"
			}),
			extraContent: new Control()
		});
		// assertions
		assert.ok(!oNavigationContainer.getDirectLink());

		// act: invisible LinkData
		oNavigationContainer = new NavigationContainer({
			mainNavigation: new LinkData({
				href: "href1",
				text: "link1"
			}),
			extraContent: new Control()
		});
		// assertions
		assert.ok(!oNavigationContainer.getDirectLink());

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("action and extraContent", function(assert) {
		// system under test

		// arrange

		// act: visible LinkData
		var oNavigationContainer = new NavigationContainer({
			availableActions: [
				new LinkData({
					href: "href2",
					text: "link2"
				})
			],
			extraContent: new Control()
		});
		// assertions
		assert.ok(!oNavigationContainer.getDirectLink());

		// act: invisible LinkData
		oNavigationContainer = new NavigationContainer({
			availableActions: [
				new LinkData({
					href: "href2",
					text: "link2"
				})
			],
			extraContent: new Control()
		});
		// assertions
		assert.ok(!oNavigationContainer.getDirectLink());

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("main link, action and extraContent", function(assert) {
		// system under test

		// arrange

		// act: visible LinkData
		var oNavigationContainer = new NavigationContainer({
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
		assert.ok(!oNavigationContainer.getDirectLink());

		// act: invisible LinkData
		oNavigationContainer = new NavigationContainer({
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
		assert.ok(!oNavigationContainer.getDirectLink());

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationContainer", {
		beforeEach: function() {
		},
		afterEach: function() {
		}
	});

	QUnit.test("event 'navigate': mainNavigationLink", async function(assert) {
		// system under test
		var oNavigationContainer = new NavigationContainer({
			mainNavigation: new LinkData({
				text: "Main",
				description: "SubTitle",
				href: "href"
			})
		});

		// arrange
		var fnFireNavigateSpy = sinon.spy(oNavigationContainer, "fireNavigate");

		oNavigationContainer.placeAt("qunit-fixture");
		await nextUIUpdate();

		// act
		qutils.triggerEvent("click", oNavigationContainer.$().find("a")[0], {
			srcControl: oNavigationContainer
		});
		qutils.triggerTouchEvent("tap", oNavigationContainer.$().find("a")[0], {
			srcControl: oNavigationContainer
		});

		// assertions
		assert.ok(fnFireNavigateSpy.calledOnce);

		// cleanup
		oNavigationContainer.destroy();
		oNavigationContainer.fireNavigate.restore();
	});

	QUnit.test("event 'navigate': availableAction", async function(assert) {
		// system under test
		var oNavigationContainer = new NavigationContainer({
			mainNavigation: new LinkData({
				href: "href",
				text: "text of Mainlink"
			}),
			availableActions: [
				new LinkData({
					href: "href",
					text: "text of action link"
				})
			]
		});

		// arrange
		var fnFireNavigateSpy = sinon.spy(oNavigationContainer, "fireNavigate");

		oNavigationContainer.placeAt("qunit-fixture");
		await nextUIUpdate();

		// act
		qutils.triggerEvent("click", oNavigationContainer.$().find("a")[1], {
			srcControl: oNavigationContainer
		});
		qutils.triggerTouchEvent("tap", oNavigationContainer.$().find("a")[1], {
			srcControl: oNavigationContainer
		});

		// assertions
		assert.ok(fnFireNavigateSpy.calledOnce);

		// cleanup
		oNavigationContainer.destroy();
		oNavigationContainer.fireNavigate.restore();
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationContainer: enableAvailableActionsPersonalization", {
		beforeEach: function() {
		},
		afterEach: function() {
			this.oNavigationContainer.destroy();
		}
	});
	QUnit.test("personalization link is not visible if enableAvailableActionsPersonalization is not set", async function(assert) {
		this.oNavigationContainer = new NavigationContainer({
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
			]
		});
		this.oNavigationContainer.placeAt("qunit-fixture");
		await nextUIUpdate();

		// assertions
		assert.ok(this.oNavigationContainer.getDomRef());
		assert.equal(this.oNavigationContainer.$().find("button").length, 0, "personalization link is invisible");
		assert.equal(this.oNavigationContainer.$().find("a").length, 2);
		assert.equal(this.oNavigationContainer.$().find("a")[0].text, "Title of Mainlink");
		assert.equal(this.oNavigationContainer.$().find("a")[1].text, "text of action link");

	});

	QUnit.test("personalization link is visible if enableAvailableActionsPersonalization is set", async function(assert) {
		this.oNavigationContainer = new NavigationContainer({
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
			enableAvailableActionsPersonalization: true
		});
		this.oNavigationContainer.placeAt("qunit-fixture");
		await nextUIUpdate();

		// assertions
		assert.ok(this.oNavigationContainer.getDomRef());
		assert.equal(this.oNavigationContainer.$().find("button").length, 1, "personalization link is visible");
		assert.equal(this.oNavigationContainer.$().find("a")[0].text, "Title of Mainlink");
		assert.equal(this.oNavigationContainer.$().find("a")[1].text, "text of action link");
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationContainer: update availableAction aggregation", {
		beforeEach: async function() {
			this.oNavigationContainer = new NavigationContainer({
				availableActions: [
					new LinkData({
						key: "link01",
						visible: false
					}), new LinkData({
						key: "link02",
						visible: false
					})
				]
			});
			this.oNavigationContainer.placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.oNavigationContainer.destroy();
		}
	});
	QUnit.test("test 01", function(assert) {
		// assert before act
		assert.ok(this.oNavigationContainer.getDomRef());
		assert.equal(this.oNavigationContainer.$().find("button").length, 0);
		assert.equal(this.oNavigationContainer.$().find("a").length, 0);

		assert.equal(this.oNavigationContainer._oActionArea.getVisible(), false, "Container of availableActions");
		assert.equal(this.oNavigationContainer._oActionArea.getItems().length, 2, "availableActions");
		assert.equal(this.oNavigationContainer._oActionArea.getItems()[0].getVisible(), false, "first availableAction");
		assert.equal(this.oNavigationContainer._oActionArea.getItems()[1].getVisible(), false, "second availableAction");

		// act
		this.oNavigationContainer.getAvailableActions()[0].setVisible(true);

		// assert
		assert.equal(this.oNavigationContainer.$().find("button").length, 0);
		assert.equal(this.oNavigationContainer._oActionArea.getVisible(), true, "Container of availableActions");
		assert.equal(this.oNavigationContainer._oActionArea.getItems().length, 2, "availableActions");
		assert.equal(this.oNavigationContainer._oActionArea.getItems()[0].getVisible(), true, "first availableAction");
		assert.equal(this.oNavigationContainer._oActionArea.getItems()[1].getVisible(), false, "second availableAction");

		// act
		this.oNavigationContainer.getAvailableActions()[0].setVisible(false);
		this.oNavigationContainer.getAvailableActions()[1].setVisible(true);

		// assert
		assert.equal(this.oNavigationContainer.$().find("button").length, 0);
		assert.equal(this.oNavigationContainer._oActionArea.getVisible(), true, "Container of availableActions");
		assert.equal(this.oNavigationContainer._oActionArea.getItems().length, 2, "availableActions");
		assert.equal(this.oNavigationContainer._oActionArea.getItems()[0].getVisible(), false, "first availableAction");
		assert.equal(this.oNavigationContainer._oActionArea.getItems()[1].getVisible(), true, "second availableAction");
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationContainer: open selection dialog", {
		beforeEach: async function() {
			this.oButton = new Button({
				text: "More Links"
			});

			sinon.stub(FlexRuntimeInfoAPI, "waitForChanges").resolves();
			this.oNavigationContainer = new NavigationContainer({
				availableActions: [
					new LinkData({
						href: "#href",
						internalHref: "#internalHref",
						key: "link01",
						text: "Link 01",
						visible: false
					}), new LinkData({
						href: "#href2",
						key: "link02",
						text: "Link 02",
						visible: false
					})
				]
			});
			this.oButton.addDependent(this.oNavigationContainer);

			this.oButton.placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.oButton.destroy();
			this.oNavigationContainer.destroy();
		}
	});
	QUnit.test("test 01", function(assert) {
		var done = assert.async();
		// assert before act
		assert.equal(this.oButton.getDependents().length, 1);
		assert.equal(this.oButton.getDependents()[0], this.oNavigationContainer);

		// act
		this.oNavigationContainer.openSelectionDialog(false, true, undefined, true, undefined, this.oButton).then(function() {
			assert.equal(this.oButton.getDependents().length, 2);
			assert.equal(this.oButton.getDependents()[0], this.oNavigationContainer);
			assert.ok(this.oButton.getDependents()[1].isA("sap.m.Dialog"));

			var oDialog = this.oButton.getDependents()[1];
			var aItems = oDialog.getContent()[0].getAggregation("_content").getItems()[0].getItems();

			assert.equal(aItems[0].getCells()[0].getItems()[0].getItems()[0].getCustomData()[0].getKey(), "internalHref", "'internalHref' customData set");
			assert.equal(aItems[0].getCells()[0].getItems()[0].getItems()[0].getCustomData()[0].getValue(), "#internalHref", "'internalHref' customData has correct value");
			assert.ok(aItems[0].getCells()[0].getItems()[0].getItems()[0].getWrapping(), "Wrapping enabled");

			done();
		}.bind(this));
	});

	QUnit.module("Basic methods", {

	});

	QUnit.test("_getControl", function(assert) {
		// No control set
		var oNavigationContainer = new NavigationContainer({});

		assert.equal(oNavigationContainer._getControl(), undefined, "No control returned");

		// Control set to ID of a control
		var oText = new Text({
			text: "Test"
		});
		oNavigationContainer.setControl(oText.getId());
		assert.equal(oNavigationContainer._getControl(), oText, "Text control returned");

		// Control set to instance of a control
		oNavigationContainer.setControl(oText);
		assert.equal(oNavigationContainer._getControl(), oText, "Text control returned");
	});

	QUnit.test("_getComponent", function(assert) {
		// No component set
		var oNavigationContainer = new NavigationContainer({});

		assert.equal(oNavigationContainer._getComponent(), undefined, "No component returned");

		// Component set to ID of a control
		var oComponent = new Component({});
		oNavigationContainer.setComponent(oComponent.getId());
		assert.equal(oNavigationContainer._getComponent(), oComponent, "Correct component returned");

		// Component set to instance of a control
		oNavigationContainer.setComponent(oComponent);
		assert.equal(oNavigationContainer._getComponent(), oComponent, "Correct component returned");
	});

	QUnit.test("_observeAvailableActionsChanges - NavigationContainer", function(assert) {
		var oNavigationContainer = new NavigationContainer({});
		var oModel = oNavigationContainer._getInternalModel();

		var oChanges = {
			object: oNavigationContainer,
			children: [
				undefined
			]
		};

		var fnLogErrorSpy = sinon.spy(Log, "error");

		// Case 1: Try to change something else then "availableActions"
		oChanges.name = "testName";
		oNavigationContainer._observeAvailableActionsChanges(oChanges);
		assert.equal(fnLogErrorSpy.args[0], "The 'testName' of NavigationContainer is not supported yet.", "Correct error logged when name = 'testName'");

		oChanges.name = undefined;
		oNavigationContainer._observeAvailableActionsChanges(oChanges);
		assert.equal(fnLogErrorSpy.args[1], "The 'undefined' of NavigationContainer is not supported yet.", "Correct error logged when name = undefined");

		oChanges.name = "";
		oNavigationContainer._observeAvailableActionsChanges(oChanges);
		assert.equal(fnLogErrorSpy.args[2], "The '' of NavigationContainer is not supported yet.", "Correct error logged when name = ''");

		// Case 2: Try to change "availableActions" with not allowed mutation
		oChanges.name = "availableActions";

		oChanges.mutation = "testMutation";
		oNavigationContainer._observeAvailableActionsChanges(oChanges);
		assert.equal(fnLogErrorSpy.args[3], "Mutation 'testMutation' is not supported jet.", "Correct error logged when mutation = 'testMutation'");

		oChanges.mutation = undefined;
		oNavigationContainer._observeAvailableActionsChanges(oChanges);
		assert.equal(fnLogErrorSpy.args[4], "Mutation 'undefined' is not supported jet.", "Correct error logged when mutation = undefined");

		oChanges.mutation = "";
		oNavigationContainer._observeAvailableActionsChanges(oChanges);
		assert.equal(fnLogErrorSpy.args[5], "Mutation '' is not supported jet.", "Correct error logged when mutation = ''");

		// Case 3: Try to remove a "availableAction"
		oChanges.mutation = "remove";
		oNavigationContainer._observeAvailableActionsChanges(oChanges);
		assert.equal(fnLogErrorSpy.args[6], "Deletion of AvailableActions is not supported", "Correct error logged when mutation = 'remove'");

		// Case 4: Try to insert empty LinkData
		oChanges.mutation = "insert";
		oNavigationContainer._observeAvailableActionsChanges(oChanges);
		assert.deepEqual(oModel.getProperty("/initialAvailableActions/"), [], "No LinkData added to initialAvailableActions");
		assert.deepEqual(oModel.getProperty("/availableActions/"), [], "No LinkData added to availableActions");

		// Case 5: Try to insert incorrect Control as LinkData
		oChanges.children = [ new Text({text: "Test"}) ];
		oNavigationContainer._observeAvailableActionsChanges(oChanges);
		assert.deepEqual(oModel.getProperty("/initialAvailableActions/"), [], "No LinkData added to initialAvailableActions");
		assert.deepEqual(oModel.getProperty("/availableActions/"), [], "No LinkData added to availableActions");

		// Case 6: Insert LinkData
		var oLinkData = new LinkData({
			text: "Link01",
			href: "#Link01"
		});
		oChanges.children = [
			oLinkData
		];
		var fnIndexOfAvailableActionStub = sinon.stub(oNavigationContainer, "indexOfAvailableAction");
		fnIndexOfAvailableActionStub.withArgs(oLinkData).returns(0);

		oNavigationContainer._observeAvailableActionsChanges(oChanges);
		assert.deepEqual(oModel.getProperty("/initialAvailableActions"), [oLinkData.getJson()], "LinkData added to initialAvailableActions");
		assert.deepEqual(oModel.getProperty("/availableActions"), [oLinkData.getJson()], "LinkData added to availableActions");

		fnLogErrorSpy.restore();
		fnIndexOfAvailableActionStub.restore();
	});

	QUnit.test("_observeAvailableActionsChanges - LinkData", function(assert) {
		var oNavigationContainer = new NavigationContainer({});
		var oLinkData = new LinkData({});
		var oModel = oNavigationContainer._getInternalModel();

		var oChanges = {
			object: oLinkData
		};

		var fnLogErrorSpy = sinon.spy(Log, "error");

		// Case 1: Try to change something else then "visible"
		oChanges.name = "testName";
		oNavigationContainer._observeAvailableActionsChanges(oChanges);
		assert.equal(fnLogErrorSpy.args[0], "The 'testName' of LinkData is not supported yet.", "Correct error logged when name = 'testName'");

		oChanges.name = undefined;
		oNavigationContainer._observeAvailableActionsChanges(oChanges);
		assert.equal(fnLogErrorSpy.args[1], "The 'undefined' of LinkData is not supported yet.", "Correct error logged when name = undefined");

		oChanges.name = "";
		oNavigationContainer._observeAvailableActionsChanges(oChanges);
		assert.equal(fnLogErrorSpy.args[2], "The '' of LinkData is not supported yet.", "Correct error logged when name = ''");

		// Case 2: Try to change not existing LinkData
		oChanges.name = "visible";
		oNavigationContainer._observeAvailableActionsChanges(oChanges);
		assert.equal(fnLogErrorSpy.args[3], "The available action with key 'undefined' does not exist in availableActions.", "Correct error logged when LinkData does not exist in availableActions");

		// Case 3: Try to change existing LinkData
		oNavigationContainer = new NavigationContainer({
			availableActions: [ oLinkData ]
		});
		oModel = oNavigationContainer._getInternalModel();
		oLinkData.key = "TestKey";

		oNavigationContainer._observeAvailableActionsChanges(oChanges);
		assert.deepEqual(oModel.getProperty("/initialAvailableActions"), [ oLinkData.getJson() ], "Correct LinkData saved in model - initialAvailableActions");
		assert.deepEqual(oModel.getProperty("/availableActions"), [ oLinkData.getJson() ], "Correct LinkData saved in model - availableActions");

		// Case 4: Change visibility of existing LinkData
		oLinkData.setVisible(false);
		oNavigationContainer._observeAvailableActionsChanges(oChanges);
		assert.deepEqual(oModel.getProperty("/initialAvailableActions"), [ oLinkData.getJson() ], "Correct LinkData saved in model - initialAvailableActions");
		assert.deepEqual(oModel.getProperty("/availableActions"), [ oLinkData.getJson() ], "Correct LinkData saved in model - availableActions");
		assert.equal(oModel.getProperty("/initialAvailableActions/0/visible"), false, "Correct initialAvailableActions visibility value in model");
		assert.equal(oModel.getProperty("/availableActions/0/visible"), false, "Correct availableActions visibility value in model");

		// Case 5: Change visibility of exsiting LinkData with "visibleChangedByUser"
		oLinkData.setVisible(true);
		oLinkData.setVisibleChangedByUser(true);
		oNavigationContainer = new NavigationContainer({
			availableActions: [ oLinkData ]
		});
		oModel = oNavigationContainer._getInternalModel();
		oLinkData.setVisible(false);
		oNavigationContainer._observeAvailableActionsChanges(oChanges);

		// Can't move these lines of code upwards as there seems to be an issue with QUnits "deepEqual" throwing an error message otherweise.
		var oInitialAvailableAction = Object.assign({}, oLinkData.getJson());
		oInitialAvailableAction.visible = true;

		assert.deepEqual(oModel.getProperty("/initialAvailableActions"), [ oInitialAvailableAction ], "Correct LinkData saved in model - initialAvailableActions");
		assert.deepEqual(oModel.getProperty("/availableActions"), [ oLinkData.getJson() ], "Correct LinkData saved in model - availableActions");
		assert.equal(oModel.getProperty("/initialAvailableActions/0/visible"), true, "Correct initialAvailableActions visibility value in model");
		assert.equal(oModel.getProperty("/availableActions/0/visible"), false, "Correct availableActions visibility value in model");

		fnLogErrorSpy.restore();
	});

	QUnit.test("setExtraContent", function(assert) {
		var oDummyControl = new Text();
		var sDummyControlId = oDummyControl.getId();
		oDummyControl.destroy();

		var oText = new Text({ text: "ExtraContent" });
		var oNavigationContainer = new NavigationContainer({});
		var oModel = oNavigationContainer._getInternalModel();

		assert.deepEqual(oModel.getProperty("/extraContent"), undefined, "Initial ExtraContent is undefined");

		oNavigationContainer.setExtraContent(undefined);
		assert.deepEqual(oModel.getProperty("/extraContent"), undefined, "ExtraContent not changed when trying to set it to undefined");

		oNavigationContainer.setExtraContent(null);
		assert.deepEqual(oModel.getProperty("/extraContent"), undefined, "ExtraContent not changed when trying to set it to null");

		oNavigationContainer.setExtraContent("");
		assert.deepEqual(oModel.getProperty("/extraContent"), undefined, "ExtraContent not changed when trying to set it to ''");

		oNavigationContainer.setExtraContent(oText.getId());
		assert.deepEqual(oModel.getProperty("/extraContent"), oText, "ExtraContent changed when trying to set it to a existing ID");

		oNavigationContainer.setExtraContent(sDummyControlId);
		assert.deepEqual(oModel.getProperty("/extraContent"), undefined, "ExtraContent changed to undefined when trying to set it to a no longer existing control ID");

		oNavigationContainer.setExtraContent(oText);
		assert.deepEqual(oModel.getProperty("/extraContent"), oText, "ExtraContent changed when trying to set it to a existing control");
	});

	QUnit.test("setMainNavigation", function(assert) {
		var oNavigationContainer = new NavigationContainer({});
		var oModel = oNavigationContainer._getInternalModel();
		var oExpectedValue = {
			href: undefined,
			subtitle: undefined,
			target: undefined,
			title: undefined
		};
		var oEmptyLinkData = new LinkData({});

		assert.equal(oNavigationContainer.getMainNavigation(), undefined, "Initial mainNavigation is undefined");
		assert.deepEqual(oModel.getProperty("/mainNavigationLink"), oExpectedValue, "Initial mainNaivagationLink in model is default");

		oNavigationContainer.setMainNavigation(undefined);
		assert.equal(oNavigationContainer.getMainNavigation(), undefined, "MainNaivigation is still undefined");
		assert.deepEqual(oModel.getProperty("/mainNavigationLink"), oExpectedValue, "mainNaivagationLink in model is still default");

		oNavigationContainer.setMainNavigation(null);
		assert.equal(oNavigationContainer.getMainNavigation(), undefined, "MainNaivigation is still undefined");
		assert.deepEqual(oModel.getProperty("/mainNavigationLink"), oExpectedValue, "mainNaivagationLink in model is still default");

		oNavigationContainer.setMainNavigation("");
		assert.equal(oNavigationContainer.getMainNavigation(), undefined, "MainNaivigation is still undefined");
		assert.deepEqual(oModel.getProperty("/mainNavigationLink"), oExpectedValue, "mainNaivagationLink in model is still default");

		oNavigationContainer.setMainNavigation(oEmptyLinkData);
		// Set title to empty string as the default value for text of LinkData returns empty string
		oExpectedValue.title = "";
		assert.deepEqual(oNavigationContainer.getMainNavigation(), oEmptyLinkData, "MainNaivigation is an empty LinkData");
		assert.deepEqual(oModel.getProperty("/mainNavigationLink"), oExpectedValue, "mainNaivagationLink in model has an empty string as title");

		var oLinkData = new LinkData({
			href: "#Link01",
			internalHref: "#LinkInternal"
		});
		oNavigationContainer.setMainNavigation(oLinkData);
		oExpectedValue.href = "#Link01";
		oExpectedValue.target = "";
		oExpectedValue.internalHref = "#LinkInternal";
		assert.deepEqual(oNavigationContainer.getMainNavigation(), oLinkData, "MainNaivigation is a LinkData object with href");
		assert.deepEqual(oModel.getProperty("/mainNavigationLink"), oExpectedValue, "mainNaivagationLink in model has an empty string as title and target and correct href");

		oLinkData.setText("Title");
		oNavigationContainer.setMainNavigation(oLinkData);
		assert.deepEqual(oNavigationContainer.getMainNavigation(), oLinkData, "MainNaivigation is a LinkData object with href and title");
		assert.deepEqual(oModel.getProperty("/mainNavigationLink"), oExpectedValue, "Title of mainNaivagationLink in model did not change");

		oModel.setProperty("/mainNavigationLink/title", undefined);
		oNavigationContainer.setMainNavigation(oLinkData);
		oExpectedValue.title = "Title";
		assert.deepEqual(oNavigationContainer.getMainNavigation(), oLinkData, "MainNaivigation is a LinkData object with href and title");
		assert.deepEqual(oModel.getProperty("/mainNavigationLink"), oExpectedValue, "Title of mainNaivagationLink in model did change");

		oLinkData.setDescription("description");
		oNavigationContainer.setMainNavigation(oLinkData);
		oExpectedValue.subtitle = "description";
		assert.deepEqual(oNavigationContainer.getMainNavigation(), oLinkData, "MainNaivigation is a LinkData object with description, href and title");
		assert.deepEqual(oModel.getProperty("/mainNavigationLink"), oExpectedValue, "Subtitle of mainNaivagationLink in model did change");
	});

	QUnit.module("_onLinkPress", {
		beforeEach: function() {
			this.oMLink = new Link({});
		},
		afterEach: function() {
			this.oMLink.destroy();
		}
	});

	var fnCheckPreventedNavigation = function(assert, oNavigationContainer, oEvent) {
		var fnFireNavigateSpy = sinon.spy(oNavigationContainer, "fireNavigate");

		assert.ok(fnFireNavigateSpy.notCalled, "'navigate' event not fired before _onLinkPress");
		oNavigationContainer._onLinkPress(oEvent);
		assert.ok(fnFireNavigateSpy.notCalled, "'navigate' event not fired after _onLinkPress");

		fnFireNavigateSpy.restore();
	};

	QUnit.test("with target='_blank'", function(assert) {
		var oNavigationContainer = new NavigationContainer({});
		this.oMLink.setTarget("_blank");
		var oEvent = new Event("press", this.oMLink, {});

		fnCheckPreventedNavigation(assert, oNavigationContainer, oEvent);
	});

	[
		{ctrlKey: true, metaKey: false},
		{ctrlKey: false, metaKey: true},
		{ctrlKey: true, metaKey: true}
	].forEach(function(oEventSettings) {
		QUnit.test("ctrlKey" + (!oEventSettings.ctrlKey ? " not" : "") + " pressed and metaKey " + (!oEventSettings.metaKey ? " not" : "") + " pressed", function(assert) {
			var oNavigationContainer = new NavigationContainer({});
			var oEvent = new Event("press", this.oMLink, oEventSettings);

			fnCheckPreventedNavigation(assert, oNavigationContainer, oEvent);
		});
	});

	QUnit.test("straight forward", function(assert) {
		var oNavigationContainer = new NavigationContainer({});
		var oEvent = new Event("press", this.oMLink, {});
		var fnFireNavigateSpy = sinon.spy(oNavigationContainer, "fireNavigate");

		assert.ok(fnFireNavigateSpy.notCalled, "'navigate' event not fired before _onLinkPress");
		oNavigationContainer._onLinkPress(oEvent);

		assert.ok(fnFireNavigateSpy.calledOnce, "'navigate' event fired after _onLinkPress");
		fnFireNavigateSpy.restore();
	});

	QUnit.start();
});
