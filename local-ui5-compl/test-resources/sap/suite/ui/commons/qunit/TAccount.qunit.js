sap.ui.define([
	"jquery.sap.global",
	"sap/suite/ui/commons/taccount/TAccount",
	"sap/suite/ui/commons/taccount/TAccountItem",
	"sap/suite/ui/commons/taccount/TAccountGroup",
	"sap/suite/ui/commons/taccount/TAccountPanel",
	"sap/suite/ui/commons/taccount/TAccountItemProperty",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Element",
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/core/Lib"
], function (jQuery, TAccount, TAccountItem, TAccountGroup, TAccountPanel, TAccountItemProperty, createAndAppendDiv, JSONModel, Element, nextUIUpdate, CoreLib) {
	"use strict";

	createAndAppendDiv("content");
	var oResourceBundle = CoreLib.getResourceBundleFor("sap.suite.ui.commons");

	async function render(oElement) {
		oElement.placeAt("content");
		await nextUIUpdate();
	}

	function createTAccount(sMeasure) {
		return new TAccount({
			measureOfUnit: sMeasure || "EUR",
			credit: [new TAccountItem({
				value: 300,
				properties: [new TAccountItemProperty({
					key: "A",
					value: "B"
				})]
			})],
			debit: [
				new TAccountItem({
					value: 100
				}),
				new TAccountItem({
					value: 50
				})
			]
		});
	}

	function createGroup() {
		return new TAccountGroup({
			accounts: [createTAccount(), createTAccount()]
		});
	}

	function createMixedGroup() {
		return new TAccountGroup({
			accounts: [createTAccount("EUR"), createTAccount("US")]
		});
	}

	function createPanel() {
		return new TAccountPanel({
			content: [createGroup(), createGroup()]
		});
	}

	function createMixedPanel() {
		return new TAccountPanel({
			content: [createMixedGroup(), createGroup()]
		});
	}

	QUnit.module("TAccount", {});

	QUnit.test("TAccount check", async function (assert) {
		var oAccount = createTAccount();
		await render(oAccount);

		assert.equal(oAccount._iSum, 150);

		oAccount.destroy();
	});


	QUnit.test("TAccountGroup check", async function (assert) {
		var oGroup = createGroup();
		await render(oGroup);

		assert.equal(oGroup._oSum.sum, 300);
		// aria-label test
		assert.equal(oGroup._getAriaText(), oResourceBundle.getText("TACCOUNT_GROUP_TITLE") + " " + (oGroup.getTitle() ? (oGroup.getTitle() + " ") : "") + oGroup._getSumText());
		oGroup.destroy();

		var oGroupMixed = createMixedGroup();
		await render(oGroupMixed);

		assert.equal(oGroupMixed._oSum.correct, false);
		oGroupMixed.destroy();
	});

	QUnit.test("TAccountGroup collapse", async function (assert) {
		var oGroup = createGroup();
		await render(oGroup);

		assert.equal(oGroup.$().find(".sapSuiteUiCommonsAccountTWrapper:visible").length, 2);
		oGroup._expandCollapseAllAccounts();
		await nextUIUpdate();

		oGroup.destroy();
	});
	QUnit.test("TAccountGroup Expand and Collapse All Invisible Text", async function (assert) {
		var oGroup = createGroup();
		await render(oGroup);
		await nextUIUpdate();
		assert.equal(oGroup._oIconExpand.getAriaDescribedBy()[0], oGroup._oInvisibleText.getId(),"Invisible Text set to Aria Described By for Expand Button");
		assert.equal(oGroup._oIconCollapse.getAriaDescribedBy()[0], oGroup._oInvisibleText.getId(),"Invisible Text set to Aria Described By for Expand Button");
		oGroup._oIconExpand.firePress();
		var actualAriaText = oGroup._oInvisibleText.getText(),
		expectedAriaText = oResourceBundle.getText("TACCOUNT_EXPAND_ALL");
		assert.equal(expectedAriaText, actualAriaText,"Invisible Text is correctly set for Expand All Button");
		oGroup._oIconCollapse.firePress();
		actualAriaText = oGroup._oInvisibleText.getText();
		expectedAriaText = oResourceBundle.getText("TACCOUNT_COLLAPSE_ALL");
		assert.equal(expectedAriaText, actualAriaText,"Invisible Text is correctly set for Collapse All Button");
		oGroup.destroy();
	});
	QUnit.test("TAccount Group Panel Accessibility", async function (assert) {
		var oPanel = buildPanel(aData),
			aArialabels = ["toolbarbalancelabel", "toolbarsumtitle" ];
		await render(oPanel);
		await nextUIUpdate();
		var groupPanelTitle = oResourceBundle.getText("TACCOUNT_GROUP_TITLE") + " " + oResourceBundle.getText("TACCOUNT_CREDIT") + ": " + (oPanel.getTitle() ? (oPanel.getTitle() + " ") : "") + oPanel._getSumText();
		assert.equal(oPanel.getDomRef().querySelector(".sapSuiteUiCommonsAccountGroup").getAttribute("aria-label"), groupPanelTitle, "T Account Group Panel aria label is correct");
		assert.equal(oPanel.getDomRef().querySelector(".sapSuiteUiCommonsAccountGroup").getAttribute("role"), "attribute", "T Account Group Panel role is set");
		assert.notOk(oPanel.getDomRef().querySelector(".sapSuiteUiCommonsGroupInfoIconWrapper").getAttribute("id"), "T Account Group Panel does not have id");
		var bIsFound = aArialabels.every(function(sId) {
			return oPanel._oToolbar.getDomRef().querySelector("#" + oPanel.getId() + "-toolbarswitcher").getAttribute("aria-labelledby").includes(sId);
		});
		assert.ok(bIsFound, "T Account Group Panel Segmented button has respective ariaLabel");
	});
	QUnit.test("TAccount Panel check", async function (assert) {
		var oPanel = createPanel();
		await render(oPanel);

		assert.equal(oPanel._oSum.sum, 600);
		oPanel.destroy();

		var oPanelMixed = createMixedPanel();
		await render(oPanelMixed);

		assert.equal(oPanelMixed._oSum.correct, false);
		oPanelMixed.destroy();
	});

	QUnit.test("TAccount Panel check", async function (assert) {
		var oPanel = createPanel();
		await render(oPanel);

		assert.equal(oPanel._oSum.sum, 600);
		oPanel.destroy();

		var oPanelMixed = createMixedPanel();
		await render(oPanelMixed);

		assert.equal(oPanelMixed._oSum.correct, false);
		oPanelMixed.destroy();
	});

	QUnit.test("Cancel button test",async function(assert){
		var oPanel = new TAccountPanel({
			properties: [new TAccountItemProperty({
				visible:false,
				key: "DocumentID",
				value: "Document ID"
			}),
			new TAccountItemProperty({
				visible:false,
				key: "PostingDate",
				value: "Posting Date"
			}),],
		
		});
		//opening the settings panel
		oPanel.openSettings()
		
		//selecting an element from list
		const oElement = oPanel._getPopover().getContent()[0].getItems()[3].getItems()[0];
		oElement.setSelected(true)

		//closing the settings without saving
		const button = oPanel._getPopover().getEndButton();
		button.firePress();

		//checking if the item is still selected
		const bIsSelected = oElement.getSelected()

		await render(oPanel)
		assert.equal(bIsSelected,false, "Item is not selected after closing the settings by clicking on cancel button");
	})

	QUnit.test("Test opening and closing balance", async function (assert) {
		var oAccount = createTAccount();
		await render(oAccount);

		assert.equal(oAccount.$().find(".sapSuiteUiCommonsAccountOpeningHeader").length, 0);
		assert.equal(oAccount.$().find(".sapSuiteUiCommonsAccountClosingHeader").length, 0);
		assert.equal(oAccount.$().find(".sapSuiteUiCommonsAccountClosingHeaderLine").length, 0);

		oAccount.destroy();

		var oAccountOpening = createTAccount();
		oAccountOpening.setOpening(true);
		oAccountOpening.setOpeningCredit(50000);
		await render(oAccountOpening);

		assert.equal(oAccountOpening.$().find(".sapSuiteUiCommonsAccountOpeningHeader").length, 1);
		assert.equal(oAccountOpening.$().find(".sapSuiteUiCommonsAccountClosingHeader").length, 1);
		assert.equal(oAccountOpening.$().find(".sapSuiteUiCommonsAccountClosingHeaderLine").length, 1);


		oAccountOpening.destroy();
	});

	QUnit.test("Test opening and closing balance 1", async function (assert) {
		var oAccount = createTAccount(),
			oGroup = new TAccountGroup({
				accounts: [oAccount]
			}),
			oPanel = new TAccountPanel({
				content: [oGroup]
			});

		await render(oPanel);
		assert.ok(oAccount._iSum.eq(150));

		oAccount.setOpening(true);
		oAccount.setOpeningCredit(100);
		await nextUIUpdate();
		assert.ok(oAccount._iSum.eq(250));
		assert.ok(oGroup._oSum.sum.eq(250));
		assert.ok(oPanel._oSum.sum.eq(250));

		oAccount.setOpeningDebit(50);
		await nextUIUpdate();
		assert.ok(oAccount._iSum.eq(200));
		assert.ok(oGroup._oSum.sum.eq(200));
		assert.ok(oPanel._oSum.sum.eq(200));

		oAccount.getCredit()[0].setValue(200);
		await nextUIUpdate();
		assert.ok(oAccount._iSum.eq(100));
		assert.ok(oGroup._oSum.sum.eq(100));
		assert.ok(oPanel._oSum.sum.eq(100));

		oAccount.getDebit()[0].setValue(50);
		await nextUIUpdate();
		assert.ok(oAccount._iSum.eq(150));
		assert.ok(oGroup._oSum.sum.eq(150));
		assert.ok(oPanel._oSum.sum.eq(150));

		oGroup.addAccount(new TAccount({
			measureOfUnit: "EUR",
			credit: [new TAccountItem({
				value: 100
			})],
			debit: [
				new TAccountItem({
					value: 50
				})
			]
		}));

		await nextUIUpdate();
		assert.ok(oGroup._oSum.sum.eq(200));
		assert.ok(oPanel._oSum.sum.eq(200));

		var oAccount1 = new TAccount({
			measureOfUnit: "US",
			credit: [new TAccountItem({
				value: 100
			})],
			debit: [
				new TAccountItem({
					value: 50
				})
			]
		});
		oGroup.addAccount(oAccount1);
		await nextUIUpdate();

		assert.equal(oGroup._oSum.correct, false);
		assert.equal(oGroup._oSum.correct, false);

		oGroup.getAccounts()[2].setMeasureOfUnit("EUR");
		await nextUIUpdate();

		assert.equal(oGroup._oSum.correct, true);
		assert.equal(oGroup._oSum.correct, true);

		assert.ok(oGroup._oSum.sum.eq(250));
		assert.ok(oPanel._oSum.sum.eq(250));

		oGroup.removeAccount(oAccount);
		await nextUIUpdate();

		assert.equal(oGroup._oSum.correct, true);
		assert.equal(oGroup._oSum.correct, true);

		assert.ok(oGroup._oSum.sum.eq(100));
		assert.ok(oPanel._oSum.sum.eq(100));

		oAccount1.addCredit(new TAccountItem({
			value: 320
		}));
		await nextUIUpdate();

		assert.equal(oGroup._oSum.correct, true);
		assert.equal(oGroup._oSum.correct, true);

		assert.ok(oAccount1._iSum.eq(370));
		assert.ok(oGroup._oSum.sum.eq(420));
		assert.ok(oPanel._oSum.sum.eq(420));

		oAccount.destroy();
	});


	// QUnit.test("Test ordered mode for TAccount items", async function (assert) {
	// 	var oAccount = new TAccount({
	// 		measureOfUnit: "EUR",
	// 		credit: [new TAccountItem({
	// 			value: 300,
	// 			properties: [new TAccountItemProperty({
	// 				label: "Posting Date",
	// 				key: "PostingDate",
	// 				value: "3/1/2018"
	// 			})]
	// 		})],
	// 		debit: [
	// 			new TAccountItem({
	// 				value: 100,
	// 				properties: [new TAccountItemProperty({
	// 					label: "Posting Date",
	// 					key: "PostingDate",
	// 					value: "1/1/2018"
	// 				})]
	// 			}),
	// 			new TAccountItem({
	// 				value: 50,
	// 				properties: [new TAccountItemProperty({
	// 					label: "Posting Date",
	// 					key: "PostingDate",
	// 					value: "5/1/2018"
	// 				})]
	// 			})
	// 		]
	// 	});

	// 	oAccount.setOrderBy("PostingDate");
	// 	await render(oAccount);

	// 	assert.equal(oAccount.$().find(".sapSuiteUiCommonsAccountItemLeft").length, 2);
	// 	assert.equal(oAccount.$().find(".sapSuiteUiCommonsAccountItemRight").length, 1);
	// 	assert.equal(oAccount.$().find(".sapSuiteUiCommonsAccountMiddleBorder").length, 1);

	// 	assert.equal(oAccount.$().find(".sapSuiteUiCommonsAccountItemTitle")[0].textContent, "100.00 EUR");
	// 	assert.equal(oAccount.$().find(".sapSuiteUiCommonsAccountItemTitle")[1].textContent, "300.00 EUR");
	// 	assert.equal(oAccount.$().find(".sapSuiteUiCommonsAccountItemTitle")[2].textContent, "50.00 EUR");

	// 	oAccount.destroy();
	// });

	QUnit.test("Test dropzones for drag and drop", async function (assert) {
		var oPanel = createPanel();
		await render(oPanel);
		var iGroupCols = oPanel.$().find(".sapSuiteUiCommonsAccountGroupColumn").length / 2;

		assert.equal(oPanel.$().find(".sapSuiteUiCommonsAccountGroupDroppingAreaInnerText").length, (iGroupCols + 2) * 2);
		assert.equal(oPanel.$().find(".sapSuiteUiCommonsTAccountDropZoneTop").length, 4);
		assert.equal(oPanel.$().find(".sapSuiteUiCommonsTAccountDropZoneBottom").length, 4);

		oPanel.destroy();
	});

	QUnit.test("Test keyboard control for drag and drop", async function (assert) {
		var oPanel = createMixedPanel(),
			oGroup = oPanel.getContent()[0],
			aAccounts = oGroup.getAccounts(),
			oEvent = {
				preventDefault: function () {
				},
				stopImmediatePropagation: function () {
				}
			},
			$columns;

		var fnTestLength = function (aLengths) {
			for (var i = 0; i < $columns.length; i++) {
				assert.equal(jQuery($columns[i]).find(".sapSuiteUiCommonsAccount").length, aLengths[i]);
			}
		};

		oEvent[sap.ui.Device.os.macintosh ? "metaKey" : "ctrlKey"] = true;
		assert.expect(110);

		await render(oPanel);
		// width for 5 columns
		oGroup.$("content").width(1800);
		oGroup._adjustUI();
		$columns = oGroup.$().find(".sapSuiteUiCommonsAccountGroupColumn");

		aAccounts[0].onsappreviousmodifiers(oEvent);
		fnTestLength([1, 1, 0, 0, 0]);
		aAccounts[0].onsapupmodifiers(oEvent);
		fnTestLength([1, 1, 0, 0, 0]);
		aAccounts[0].onsapnextmodifiers(oEvent);
		fnTestLength([0, 2, 0, 0, 0]);
		aAccounts[0].onsapupmodifiers(oEvent);
		fnTestLength([0, 2, 0, 0, 0]);
		aAccounts[0].onsapupmodifiers(oEvent);
		fnTestLength([1, 1, 0, 0, 0]);
		aAccounts[0].onsapdownmodifiers(oEvent);
		fnTestLength([0, 2, 0, 0, 0]);
		aAccounts[0].onsapdownmodifiers(oEvent);
		fnTestLength([0, 2, 0, 0, 0]);
		aAccounts[0].onsapdownmodifiers(oEvent);
		fnTestLength([0, 1, 1, 0, 0]);
		aAccounts[0].onsapnextmodifiers(oEvent);
		fnTestLength([0, 1, 0, 1, 0]);
		aAccounts[0].onsapnextmodifiers(oEvent);
		fnTestLength([0, 1, 0, 0, 1]);
		aAccounts[0].onsapnextmodifiers(oEvent);
		fnTestLength([0, 1, 0, 0, 1]);
		aAccounts[0].onsapdownmodifiers(oEvent);
		fnTestLength([0, 1, 0, 0, 1]);
		aAccounts[0].onsappreviousmodifiers(oEvent);
		fnTestLength([0, 1, 0, 1, 0]);
		aAccounts[0].onsappreviousmodifiers(oEvent);
		fnTestLength([0, 1, 1, 0, 0]);

		// Test change control key name
		oEvent.ctrlKey = false;
		oEvent.metaKey = true;
		aAccounts[0]._setControlKeyName("metaKey");

		aAccounts[0].onsappreviousmodifiers(oEvent);
		fnTestLength([0, 2, 0, 0, 0]);
		aAccounts[0].onsapnextmodifiers(oEvent);
		fnTestLength([0, 1, 1, 0, 0]);
		aAccounts[0].onsapupmodifiers(oEvent);
		fnTestLength([0, 2, 0, 0, 0]);
		aAccounts[0].onsapdownmodifiers(oEvent);
		fnTestLength([0, 1, 1, 0, 0]);

		oEvent.ctrlKey = true;
		oEvent.metaKey = false;
		aAccounts[0]._setControlKeyName("ctrlKey");

		aAccounts[0].onsappreviousmodifiers(oEvent);
		fnTestLength([0, 2, 0, 0, 0]);
		aAccounts[0].onsapnextmodifiers(oEvent);
		fnTestLength([0, 1, 1, 0, 0]);
		aAccounts[0].onsapupmodifiers(oEvent);
		fnTestLength([0, 2, 0, 0, 0]);
		aAccounts[0].onsapdownmodifiers(oEvent);
		fnTestLength([0, 1, 1, 0, 0]);

		oPanel.destroy();
	});

	QUnit.test("Header title/subtitle tooltip", async function (assert) {
		var oElement = {},
			oAccount = createTAccount(),
			sShortText = "Lorem ipsum dolor sit amet",
			sVeryLongText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun" +
				"t ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco labor" +
				"is nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate veli" +
				"t esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt " +
				"in ulpa qui officia deserunt mollit anim id est laborum.";

		var fnRefreshElement = async function (sClass) {
			await nextUIUpdate();
			oElement = oAccount.$().find(sClass);
		};

		assert.expect(18);
		await render(oAccount);

		oAccount.setTitle(sShortText);
		await fnRefreshElement(".sapSuiteUiCommonsAccountHeaderTitle");
		assert.notOk(oElement.attr("title"));
		assert.ok(oAccount.getDomRef().getAttribute("aria-label").includes(sShortText), "Aria label is visible and contains Short Text");

		oAccount.setTitle(sVeryLongText);
		await fnRefreshElement(".sapSuiteUiCommonsAccountHeaderTitle");
		assert.equal(oElement.attr("title"), sVeryLongText);
		assert.ok(oAccount.getDomRef().getAttribute("aria-label").includes(sVeryLongText), "Aria label is visible and contains Long Text");

		oAccount.setSubtitle(sVeryLongText);
		await fnRefreshElement(".sapSuiteUiCommonsAccountHeaderTitleWithSubtitle");
		assert.equal(oElement.attr("title"), sVeryLongText);
		assert.ok(oAccount.getDomRef().getAttribute("aria-label").includes(sVeryLongText), "Aria label is visible and contains Long Text");
		await fnRefreshElement(".sapSuiteUiCommonsAccountHeaderSubtitle");
		assert.equal(oElement.attr("title"), sVeryLongText);
		assert.ok(oAccount.getDomRef().getAttribute("aria-label").includes(sVeryLongText), "Aria label is visible and contains Long Text");

		oAccount.setTitle(sShortText);
		await fnRefreshElement(".sapSuiteUiCommonsAccountHeaderTitleWithSubtitle");
		assert.notOk(oElement.attr("title"));
		assert.ok(oAccount.getDomRef().getAttribute("aria-label").includes(sShortText), "Aria label is visible and contains Short Text");
		await fnRefreshElement(".sapSuiteUiCommonsAccountHeaderSubtitle");
		assert.equal(oElement.attr("title"), sVeryLongText);
		assert.ok(oAccount.getDomRef().getAttribute("aria-label").includes(sVeryLongText), "Aria label is visible and contains Long Text");

		oAccount.setSubtitle(sShortText);
		await fnRefreshElement(".sapSuiteUiCommonsAccountHeaderTitleWithSubtitle");
		assert.notOk(oElement.attr("title"));
		await fnRefreshElement(".sapSuiteUiCommonsAccountHeaderSubtitle");
		assert.notOk(oElement.attr("title"));
		assert.ok(oAccount.getDomRef().getAttribute("aria-label").includes(sShortText), "Aria label is visible and contains Short Text");

		oAccount.setTitle(sVeryLongText);
		await fnRefreshElement(".sapSuiteUiCommonsAccountHeaderTitleWithSubtitle");
		assert.equal(oElement.attr("title"), sVeryLongText);
		await fnRefreshElement(".sapSuiteUiCommonsAccountHeaderSubtitle");
		assert.notOk(oElement.attr("title"));
		assert.ok(oAccount.getDomRef().getAttribute("aria-label").includes(sVeryLongText), "Aria label is visible and contains Long Text");

		oAccount.destroy();
	});

	QUnit.test("TAccount group resizer", async function (assert) {
		var group = new TAccountGroup({});


		group.placeAt("content");
		await nextUIUpdate();

		var $group = group.$();
		$group.width(800);
		group._adjustUI();
		assert.equal(group._iColumnCount, 2, "4 columns");

		$group.width(300);
		group._adjustUI();
		assert.equal(group._iColumnCount, 1, "2 columns");

		$group.width(1400);
		group._adjustUI();
		assert.equal(group._iColumnCount, 4, "2 columns");
	});

	QUnit.test("TAccount test aria properties", async function (assert) {
		var oAccount = createTAccount();
		await render(oAccount);

		assert.equal(oAccount.$().attr("role"), "region", "TAccount has region role");
		assert.ok(oAccount.$().attr("aria-describedBy"), "TAccount has aria-describedBy attribute");

		assert.ok(Element.getElementById(oAccount.$().find(".sapSuiteUiCommonsAccountGroupCollapseIcon").attr("id")).isA("sap.m.Button"), "T container caret has button role");

		assert.equal(oAccount.$().find(".sapSuiteUiCommonsAccountInfoIconWrapper").attr("aria-labelledby"), oAccount.$().find(".sapSuiteUiCommonsAccountInfoIconWrapper").find(".sapUiInvisibleText").attr("id"), "T container mark has correct aria-labelledby property");

		assert.ok(oAccount.$().find(".sapSuiteUiCommonsAccountDebit").attr("aria-labelledBy"), "T container debit list has aria-labelledBy attribute");
		assert.ok(oAccount.$().find(".sapSuiteUiCommonsAccountCredit").attr("aria-labelledBy"), "T container credit list has aria-labelledBy attribute");
		assert.equal(oAccount.$().find(".sapSuiteUiCommonsAccountDebit").attr("role"), "listbox", "T container debit list has listbox role");
		assert.equal(oAccount.$().find(".sapSuiteUiCommonsAccountCredit").attr("role"), "listbox", "T container credit list has listbox role");

		var aItems = oAccount.$().find(".sapSuiteUiCommonsAccountItem");
		assert.equal(aItems[0].getAttribute("role"), "option", "TAccount item has option role");
		assert.equal(aItems[0].getAttribute("aria-setsize"), "2", "TAccount item has correct aria-setsize");
		assert.equal(aItems[0].getAttribute("aria-posinset"), "1", "TAccount item has correct aria-posinset");
		assert.equal(aItems[0].getAttribute("aria-selected"), "false", "TAccount item has correct aria-selected");
		assert.equal(aItems[0].getAttribute("aria-label"), oAccount.getDebit()[0]._getAriaLabel(), "TAccount item has correct aria-label");

		assert.equal(aItems[1].getAttribute("role"), "option", "TAccount item has option role");
		assert.equal(aItems[1].getAttribute("aria-setsize"), "2", "TAccount item has correct aria-setsize");
		assert.equal(aItems[1].getAttribute("aria-posinset"), "2", "TAccount item has correct aria-posinset");
		assert.equal(aItems[1].getAttribute("aria-selected"), "false", "TAccount item has correct aria-selected");
		assert.equal(aItems[1].getAttribute("aria-label"), oAccount.getDebit()[1]._getAriaLabel(), "TAccount item has correct aria-label");

		assert.equal(aItems[2].getAttribute("role"), "option", "TAccount item has option role");
		assert.equal(aItems[2].getAttribute("aria-setsize"), "1", "TAccount item has correct aria-setsize");
		assert.equal(aItems[2].getAttribute("aria-posinset"), "1", "TAccount item has correct aria-posinset");
		assert.equal(aItems[2].getAttribute("aria-selected"), "false", "TAccount item has correct aria-selected");
		assert.equal(aItems[2].getAttribute("aria-label"), oAccount.getCredit()[0]._getAriaLabel(), "TAccount item has correct aria-label");

		aItems[0].click();
		await nextUIUpdate();
		assert.equal(aItems[0].getAttribute("aria-selected"), "true", "TAccount item has correct aria-selected");
		assert.notEqual(aItems[0].getAttribute("aria-label"), oAccount.getDebit()[0]._getAriaLabel(), "TAccount item has correct aria-label");

		aItems[0].click();
		aItems[1].click();
		await nextUIUpdate();
		assert.equal(aItems[0].getAttribute("aria-selected"), "false", "TAccount item has correct aria-selected");
		assert.equal(aItems[0].getAttribute("aria-label"), oAccount.getDebit()[0]._getAriaLabel(), "TAccount item has correct aria-label");
		assert.equal(aItems[1].getAttribute("aria-selected"), "true", "TAccount item has correct aria-selected");
		assert.notEqual(aItems[1].getAttribute("aria-label"), oAccount.getDebit()[1]._getAriaLabel(), "TAccount item has correct aria-label");

		oAccount.destroy();
	});

	QUnit.test("Collapsing/expanding", async function (assert) {
		var fnDone = assert.async();

		var oGroup = createGroup();
		await render(oGroup);
		assert.expect(3);

		assert.ok(oGroup.getAccounts()[0].$().is(":visible"), "visible");
		oGroup._expandCollapse();
		// wait till anim ends
		var oI = setInterval(function () {
			if (!oGroup._bIsExpanding) {
				clearInterval(oI);
				assert.ok(!oGroup.getAccounts()[0].$().is(":visible"), "not visible");
				var collapseOrExpand = oGroup._getExpandAltText(true);
				if (collapseOrExpand ===  true) {
				assert.ok("sap-icon://navigation-right-arrow", "The navigation right arrow (Collapsed) is visible");
				} else {
					assert.ok("sap-icon://navigation-right-arrow", "The navigation down arrow (Expanded) is visible");
				}
				oGroup.destroy();
				fnDone();
			}
		}, 0);
	});

	QUnit.test("Alt text for ExpandCollapse icon in Taccount and Taccount group", async function (assert) {
		var oGroup = createGroup();
		var oFirstTAccount = oGroup.getAccounts()[0];
		await render(oGroup);
		assert.equal(oGroup._getExpandCollapse().getType(), "Transparent");
		assert.equal(oGroup._getExpandCollapse().getTooltip(), oResourceBundle.getText("TACCOUNT_COLLAPSE") + " " + oResourceBundle.getText("TACCOUNT_GROUP_TITLE"));

		oGroup._expandCollapse();
		oFirstTAccount.setCollapsed(true);

		assert.equal(oGroup._getExpandCollapse().getType(), "Transparent");
		assert.equal(oGroup._getExpandCollapse().getTooltip(), oResourceBundle.getText("TACCOUNT_EXPAND") + " " + oResourceBundle.getText("TACCOUNT_GROUP_TITLE"));
	});

	QUnit.test("Alt text for ExpandCollapse icon in Taccount and Taccount group with title", async function (assert) {
		// no binding test
		var oAccount = new TAccount({
			credit: [new TAccountItem({
				value: 100
			})]
		}),
		oAccountGroup = new TAccountGroup({
			title: "TAccount Group Title",
			accounts: oAccount
		}),
		oAccountPanel = new TAccountPanel({
			content: oAccountGroup
		});

		await render(oAccountPanel);

		assert.equal(oAccountGroup._getExpandCollapse().getType(), "Transparent");
		assert.equal(oAccountGroup._getExpandCollapse().getTooltip(), oResourceBundle.getText("TACCOUNT_COLLAPSE") + " " + oAccountGroup.getTitle());

		assert.equal(oAccountGroup._oIconExpand.getDomRef().title, oResourceBundle.getText("TACCOUNT_EXPAND") + " " + oResourceBundle.getText("TACCOUNT_ALL") + " " + oResourceBundle.getText("TACCOUNT_TITLE"));
		assert.equal(oAccountGroup._oIconCollapse.getDomRef().title, oResourceBundle.getText("TACCOUNT_COLLAPSE") + " " + oResourceBundle.getText("TACCOUNT_ALL") + " " + oResourceBundle.getText("TACCOUNT_TITLE"));
		oAccountGroup._expandCollapse();
		oAccount.setCollapsed(true);

		assert.equal(oAccountGroup._getExpandCollapse().getType(), "Transparent");
		assert.equal(oAccountGroup._getExpandCollapse().getTooltip(), oResourceBundle.getText("TACCOUNT_EXPAND") + " " + oAccountGroup.getTitle());
	});

	QUnit.test("Rendering collapsed", async function (assert) {
		var oGroup = createGroup();
		oGroup.setCollapsed(true);
		await render(oGroup);

		assert.ok(!oGroup.getAccounts()[0].$().is(":visible"), "not visible");
		oGroup.destroy();
	});

	QUnit.test("Runtime changes", async function (assert) {
		// no binding test
		var oAccount = new TAccount({
				credit: [new TAccountItem({
					value: 100
				})]
			}),
			oAccountGroup = new TAccountGroup({
				accounts: oAccount
			}),
			oAccountPanel = new TAccountPanel({
				content: oAccountGroup
			});

		await render(oAccountPanel);
		// add item
		oAccount.addCredit(new TAccountItem({
			value: 150
		}));

		await nextUIUpdate();
		assert.equal(oAccount._iSum, 250, "TAccount sum");

		oAccountGroup.addAccount(new TAccount({
			credit: [new TAccountItem({
				value: 50
			})]
		}));

		await nextUIUpdate();
		assert.equal(oAccountPanel._oSum.sum, 300, "TAccount sum");
		assert.equal(oAccountGroup._oSum.sum, 300, "TAccount sum");

		oAccountPanel.destroy();
	});

	function buildPanel(oData) {
		var oPanel = new TAccountPanel();
		var oGroup = new TAccountGroup();
		var oAccount = new TAccount();
		var oItem = new TAccountItem({
			value: "{value}"
		});

		oPanel.bindAggregation("content", {
			path: "/groups",
			template: oGroup,
			templateShareable: true
		});

		oGroup.bindAggregation("accounts", {
			path: "accounts",
			template: oAccount,
			templateShareable: true
		});

		oAccount.bindAggregation("credit", {
			path: "credit",
			template: oItem,
			templateShareable: true
		});

		var oModel = new JSONModel(oData);
		oPanel.setModel(oModel);

		return oPanel;
	}

	var aData = {
		"groups": [
			{
				"title": "Balance Sheet Accounts",
				"accounts": [
					{
						"title": "Cash (A)",
						"collapsed": true,
						"credit": [
							{
								"color": "sapUiErrorBorder",
								"value": 50,
								"group": "82546654"
							},
							{
								"color": "sapUiErrorBorder",
								"value": 100,
								"group": "82546654"
							}
						]
					}
				]
			}
		]
	};

	var aData1 = {
		"groups": [
			{
				"title": "Balance Sheet Accounts",
				"accounts": [
					{
						"title": "Cash (A)",
						"collapsed": true,
						"credit": [
							{
								"color": "sapUiErrorBorder",
								"value": 500,
								"group": "82546654"
							}
						]
					}
				]
			}
		]
	};

	var aData2 = {
		"groups": [
			{
				"title": "Balance Sheet Accounts",
				"accounts": [
					{
						"title": "Cash (A)",
						"collapsed": true,
						"credit": [
							{
								"color": "sapUiErrorBorder",
								"value": 500.67843,
								"group": "82546654"
							},
							{
								"color": "sapUiErrorBorder",
								"value": 100.67843,
								"group": "82546654"
							}
						]
					}
				]
			}
		]
	};


	QUnit.test("Runtime changes - binding", async function (assert) {
		var oPanel = buildPanel(aData);
		await render(oPanel);

		assert.equal(oPanel._oSum.sum, 150, "visible");

		aData.groups[0].accounts[0].credit.push({
			"value": 100
		});

		oPanel.setModel(new JSONModel(aData));
		assert.equal(oPanel.getSum().sum, 250, "visible");
		await nextUIUpdate();

		oPanel.setModel(new JSONModel(aData1));
		await nextUIUpdate();

		assert.equal(oPanel.getSum().sum, 500, "visible");
		oPanel.destroy();
	});

	// QUnit.test("Cheking maxFraction value", async function (assert) {
	// 		var oPanel = buildPanel(aData2);
	// 	    await render(oPanel);
	// 		assert.equal(oPanel.getMaxFractionDigits(), 2);
	// 		assert.equal(Math.abs(oPanel._getSumText()), "601.36", "visible");

	// 		oPanel = buildPanel(aData2);
	// 		oPanel.setMaxFractionDigits(5);
	// 		await render(oPanel);
	// 		assert.equal(oPanel.getMaxFractionDigits(), 5);
	// 		assert.equal(Math.abs(oPanel._getSumText()), "601.35686", "visible");
	// 		oPanel.destroy();
	// });

	QUnit.test("No data", async function (assert) {
		var oA1 = new TAccount({
			opening: true,
			openingCredit: 500,
			openingDebit: 200
		});
		await render(oA1);

		assert.ok(oA1.$().find(".sapSuiteUiCommonsAccountOpeningHeader").length === 0, "no header");
		var oA2 = new TAccount({
			opening: false,
			openingCredit: 500,
			openingDebit: 200
		});
		await render(oA2);

		assert.ok(oA2.$().find(".sapSuiteUiCommonsAccountNoData").length === 1, "no data");
		oA1.destroy();
		oA2.destroy();
	});


	QUnit.test("TAccount _click should be called only once", async function (assert) {
		var oAccount = createTAccount();
		var oCreditAccountItem = oAccount.getCredit()[0];
		var oDebitAccountItem1 = oAccount.getDebit()[0];
		var oDebitAccountItem2 = oAccount.getDebit()[1];
		var oCreditAccountItemClickSpy= sinon.spy(oCreditAccountItem, "_click");
		var oDebitAccountItemClickSpy1 = sinon.spy(oDebitAccountItem1, "_click");
		var oDebitAccountItemClickSpy2 = sinon.spy(oDebitAccountItem2, "_click");

		await render(oAccount);

		var aItems = oAccount.$().find(".sapSuiteUiCommonsAccountItem");

		aItems[0].click();
		await nextUIUpdate();
		assert.ok(oDebitAccountItemClickSpy1.calledOnce, "_click is called once");

		aItems[1].click();
		await nextUIUpdate();
		assert.ok(oDebitAccountItemClickSpy2.calledOnce, "_click is called once");

		aItems[2].click();
		await nextUIUpdate();
		assert.ok(oCreditAccountItemClickSpy.calledOnce, "_click is called once");

		oCreditAccountItemClickSpy.restore();
		oDebitAccountItemClickSpy1.restore();
		oDebitAccountItemClickSpy2.restore();
		oAccount.destroy();
	});
});
