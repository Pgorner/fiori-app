/* global */
sap.ui.define([
    "sap/ui/rta/enablement/elementActionTest",
    "sap/ui/comp/navpopover/FakeFlpConnector"
], function(elementActionTest, FakeFlpConnector) {
    'use strict';

    var fnEnableFakeFlp = function() {
        FakeFlpConnector.enableFakeConnector({
            'applicationUnderTest_SemanticObject': {
                links: [
                    {
                        action: "action_01",
                        intent: "?applicationUnderTest_SemanticObject_01#link",
                        text: "FactSheet of Name"
                    }, {
                        action: "action_02",
                        intent: "?applicationUnderTest_SemanticObject_02#link",
                        text: "Name Link2"
                    }, {
                        action: "action_03",
                        intent: "?applicationUnderTest_SemanticObject_03#link",
                        text: "Name Link3"
                    }, {
                        action: "action_04",
                        intent: "?applicationUnderTest_SemanticObject_04#link",
                        text: "Name Link4 (unavailable)"
                    }
                ]
            }
        });
    };

    var fnDisableFakeFlp = function() {
        FakeFlpConnector.disableFakeConnector();
    };

    var sSemanticObject = 'applicationUnderTest_SemanticObject';

    //var sPopoverId = 'sapuicompnavpopoverNavigationPopover---' + sSemanticObject;

    var sSmartLinkId = 'SmartLinkID';

    var fnGetView = function() {
        var sView =
            '<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:navpo="sap.ui.comp.navpopover">' +
                '<navpo:SmartLink id=\'' + sSmartLinkId + '\' text=\'SmartLink\' ' +
                    'semanticObject=\'' + sSemanticObject + '\' ' +
                    'enableAvailableActionsPersonalization="false"/>' +
            '</mvc:View>';

        return sView;
    };

    const fnGetPanel = async function(oView) {
		const oSmartLink = oView.byId(sSmartLinkId);
		const oFieldInfo = oSmartLink.getFieldInfo();
		await oFieldInfo.open();
		const oPopover = oFieldInfo.getDependents().find((oDependent) => {
			return oDependent.isA("sap.m.ResponsivePopover");
		});
		const oPanel = oPopover.getContent()[0];
        return oPanel;
    };

    const fnGetVisibleAvailableActions = function(oPanel) {
        const aVisibleItems = oPanel.getItems().filter((oItem) => {
			return oItem.getId() !== undefined && oItem.getVisible();
		});
		return aVisibleItems;
    };

    const fnCheckIntialState = async function(oUiComponent, oViewAfterAction, assert) {
        const done = assert.async();
		const oPanel = await fnGetPanel(oViewAfterAction);

		assert.ok(oPanel.getAggregation("_content").getContent().length, "then the Popover has content");

		assert.equal(fnGetVisibleAvailableActions(oPanel).length, 4, "then the Panel has 4 visible AvailableActions");
		done();
    };

    const fnCheckVisibleLinks = function(aVisibleLinks) {
        return function(_oUiComponent, oViewAfterAction, assert) {
            const done = assert.async();
            fnGetPanel(oViewAfterAction).then(function(oPanel) {
                const aVisilbeAvailableActions = fnGetVisibleAvailableActions(oPanel);
                assert.equal(aVisilbeAvailableActions.length, aVisibleLinks.length, "then the amount of visible links is " + aVisibleLinks.length);
                aVisilbeAvailableActions.forEach(function(oVisibleAvailableAction) {
                    assert.ok(aVisibleLinks.includes(oVisibleAvailableAction.getId()), "then the " + oVisibleAvailableAction.getId() + " action is visible.");
                });
                done();
            });
        };
    };

    var fnCreateAction = function(sKey, sChangeType, bVisible) {
        return {
            name: "settings",
            control: fnGetPanel,
            designtimeActionControl: function(oView) {
                return oView.byId(sSmartLinkId);
            },
            parameter: function() {
                return {
                    changeType: sChangeType,
                    content: {
                        key: sKey,
                        visible: bVisible,
						selector: {
							id: sKey,
							isLocal: false
						}
                    }
                };
            }
        };
    };

    var fnCreateAddAction = function(sKey) {
        return fnCreateAction(sKey, "addLink", true);
    };

    var fnCreateRemoveAction = function(sKey) {
        return fnCreateAction(sKey, "removeLink", false);
    };

    elementActionTest("Two addLink changes condensed into one", {
        xmlView: fnGetView(),
        jsOnly: true,
        action: fnCreateAddAction(sSemanticObject + "-action_01"),
        previousActions: [
            fnCreateAddAction(sSemanticObject + "-action_01")
        ],
        changesAfterCondensing: 1,
		afterAction: fnCheckIntialState,
		afterUndo: fnCheckIntialState,
		afterRedo: fnCheckIntialState,
        before: fnEnableFakeFlp,
        after: fnDisableFakeFlp
    });

    elementActionTest("Two removeLink changes condensed into one", {
        xmlView: fnGetView(),
        jsOnly: true,
        action: fnCreateRemoveAction(sSemanticObject + "-action_02"),
        previousActions: [
            fnCreateRemoveAction(sSemanticObject + "-action_02")
        ],
        changesAfterCondensing: 1,
		afterAction: fnCheckVisibleLinks([
            sSemanticObject + "-action_01", sSemanticObject + "-action_03", sSemanticObject + "-action_04"
        ]),
		afterUndo: fnCheckIntialState,
		afterRedo: fnCheckVisibleLinks([
            sSemanticObject + "-action_01", sSemanticObject + "-action_03", sSemanticObject + "-action_04"
        ]),
        before: fnEnableFakeFlp,
        after: fnDisableFakeFlp
    });

    elementActionTest("removeLink and addLink changes condensed into none", {
        xmlView: fnGetView(),
        jsOnly: true,
        action: fnCreateAddAction(sSemanticObject + "-action_03"),
        previousActions: [
            fnCreateRemoveAction(sSemanticObject + "-action_03")
        ],
        changesAfterCondensing: 0,
		afterAction: fnCheckIntialState,
		afterUndo: fnCheckIntialState,
		afterRedo: fnCheckIntialState,
        before: fnEnableFakeFlp,
        after: fnDisableFakeFlp
    });

});
