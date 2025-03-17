// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/playground/controller/BaseController",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/library",
    "sap/ushell/Config",
    "sap/ushell/Container",
    "sap/ui/core/library"
], function (
    BaseController,
    Fragment,
    JSONModel,
    ushellLibrary,
    Config,
    Container,
    coreLib
) {
    "use strict";

    // shortcut for sap.ui.core.ValueState
    var ValueState = coreLib.ValueState;

    var ContentNodeType = ushellLibrary.ContentNodeType;

    /* global sinon */
    const sandbox = sinon.createSandbox({});

    var aSpacesContentNodes = [{
        id: "space1",
        label: "Test Space 1",
        type: ContentNodeType.Space,
        isContainer: false,
        children: [{
            id: "page1",
            label: "Test Page 1",
            type: ContentNodeType.Page,
            isContainer: true
        }, {
            id: "page2",
            label: "Test Page 2",
            type: ContentNodeType.Page,
            isContainer: true
        }, {
            id: "page3",
            label: "Test Page 3",
            type: ContentNodeType.Page,
            isContainer: true
        }, {
            id: "page4",
            label: "Test Page 4",
            type: ContentNodeType.Page,
            isContainer: true
        }]
    }, {
        id: "space2",
        label: "Test Space 2",
        type: ContentNodeType.Space,
        isContainer: false,
        children: [{
            id: "page1",
            label: "Test Page 1",
            type: ContentNodeType.Page,
            isContainer: true
        }, {
            id: "page2",
            label: "Test Page 2",
            type: ContentNodeType.Page,
            isContainer: true
        }, {
            id: "page3",
            label: "Test Page 3",
            type: ContentNodeType.Page,
            isContainer: true
        }, {
            id: "page4",
            label: "Test Page 4",
            type: ContentNodeType.Page,
            isContainer: true
        }]
    }];

    var aGroupContentNodes = [{
        id: "/UI2/Fiori2LaunchpadHome",
        label: "Fiori Wave2 Launchpad Home",
        type: ContentNodeType.HomepageGroup,
        isContainer: true
    }, {
        id: "3WO90XZ14NGMZEPJ49LW6VZR9",
        label: "Testday",
        type: ContentNodeType.HomepageGroup,
        isContainer: true
    }, {
        id: "SAP_PRC_BCG_SUPPLIER_EVAL",
        label: "Supplier Evaluation",
        type: ContentNodeType.HomepageGroup,
        isContainer: true
    }, {
        id: "SAP_PRC_BCG_ESS",
        label: "Employee Self Services",
        type: ContentNodeType.HomepageGroup,
        isContainer: true
    }, {
        id: "SAP_PRC_BCG_PRC_REL_ACT",
        label: "Procurement-Related Activities",
        type: ContentNodeType.HomepageGroup,
        isContainer: true
    }, {
        id: "/UI2/FLP_DEMO_LOCKED2",
        label: "UI2 FLP Demo - Locked Group 2",
        type: ContentNodeType.HomepageGroup,
        isContainer: true
    }, {
        id: "/UI2/FLP_DEMO_LOCKED0",
        label: "UI2 FLP Demo - Locked Group Empty",
        type: ContentNodeType.HomepageGroup,
        isContainer: true
    }, {
        id: "/UI2/FLP_DEMO_LOCKED1",
        label: "UI2 FLP Demo - Locked Group 1",
        type: ContentNodeType.HomepageGroup,
        isContainer: true
    }, {
        id: "/UI2/FLP_DEMO_EXT_NAV",
        label: "UI2 FLP Demo - External Navigation",
        type: ContentNodeType.HomepageGroup,
        isContainer: true
    }];

    var ContentNodeSelectorController = BaseController.extend("sap.ushell.playground.controller.ContentNodeSelector");

    ContentNodeSelectorController.prototype.prepareMocks = function () {
        sandbox.restore(); // prepareMocks might be called multiple times

        sandbox.stub(Container, "getServiceAsync").withArgs("BookmarkV2").resolves({
            getContentNodes: () => {
                return Promise.resolve(this.aContentNodes);
            }
        });

        sandbox.stub(Container, "getUser").returns({
            getShowMyHome: () => {
                return true;
            }
        });

        const oConfigLastStub = sandbox.stub(Config, "last");
        oConfigLastStub.withArgs("/core/spaces/enabled").callsFake(() => {
            return this.oModel.getProperty("/spacesMode");
        });
        oConfigLastStub.callThrough();
    };

    ContentNodeSelectorController.prototype.restoreMocks = function () {
        sandbox.restore();
    };

    ContentNodeSelectorController.prototype.onInit = function () {
        this.prepareMocks();

        this.aContentNodes = aGroupContentNodes;

        this._initModel();
        this._loadFragment();
    };

    ContentNodeSelectorController.prototype._initModel = function () {
        var oView = this.getView();

        this.oModel = new JSONModel({
            spacesMode: false,
            selectedNodes: [],
            eventCount: 0
        });
        oView.setModel(this.oModel);
    };

    ContentNodeSelectorController.prototype._loadFragment = function () {
        var oView = this.getView();

        oView.setBusyIndicatorDelay(0);
        oView.setBusy(true);

        Fragment.load({
            id: "ContentNodeSelectorInner",
            fragmentName: "sap.ushell.playground.view.ContentNodeSelectorInner",
            controller: this
        }).then((oFragment) => {
            oView.byId("ContentNodeSelectorContainer").addContent(oFragment);
            this.oContentNodeSelector = Fragment.byId("ContentNodeSelectorInner", "SelectedNodesComboBox");

            oView.setBusy(false);
        });
    };

    ContentNodeSelectorController.prototype.onModeChange = function (oEvent) {
        var bState = oEvent.getParameter("state");

        if (bState) {
            this.aContentNodes = aSpacesContentNodes;
        } else {
            this.aContentNodes = aGroupContentNodes;
        }

        this.oModel.setProperty("/spacesMode", bState);

        var oMultiInput = this.oContentNodeSelector.getAggregation("content");
        oMultiInput.destroyTokens();
        oMultiInput.setValue("");
        // the init method should never be called, but we need it here
        // to update the binding of the title of the value help dialog
        this.oContentNodeSelector.init();
    };

    ContentNodeSelectorController.prototype.onSubmit = function () {
        var aSelectedContentNodes = this.oContentNodeSelector.getSelectedContentNodes();

        this.oModel.setProperty("/selectedNodes", aSelectedContentNodes);
    };

    ContentNodeSelectorController.prototype.onClearSelection = function () {
        this.oContentNodeSelector.clearSelection();
    };

    ContentNodeSelectorController.prototype.onSetValueStateWarning = function () {
        this.oContentNodeSelector.setValueState(ValueState.Warning);
    };

    ContentNodeSelectorController.prototype.onSetValueStateError = function () {
        this.oContentNodeSelector.setValueState(ValueState.Error);
    };

    ContentNodeSelectorController.prototype.onSetValueStateSuccess = function () {
        this.oContentNodeSelector.setValueState(ValueState.Success);
    };

    ContentNodeSelectorController.prototype.onSetValueStateInformation = function () {
        this.oContentNodeSelector.setValueState(ValueState.Information);
    };

    ContentNodeSelectorController.prototype.onSetValueStateNone = function () {
        this.oContentNodeSelector.setValueState(ValueState.None);
    };

    ContentNodeSelectorController.prototype.onSetValueStateText = function (oEvent) {
        this.oContentNodeSelector.setValueStateText(oEvent.getParameter("value"));
    };

    ContentNodeSelectorController.prototype.onSelectionChanged = function () {
        var oModel = this.getView().getModel();
        var iCurrentEventCount = oModel.getProperty("/eventCount");
        oModel.setProperty("/eventCount", iCurrentEventCount + 1);
    };

    return ContentNodeSelectorController;
});
