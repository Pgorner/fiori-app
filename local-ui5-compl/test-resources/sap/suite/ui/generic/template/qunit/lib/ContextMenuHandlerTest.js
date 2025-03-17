/**
 * tests for the sap.suite.ui.generic.template.lib.ContextMenuHandler
 */

sap.ui.define([
    "testUtils/sinonEnhanced",
    "sap/suite/ui/generic/template/lib/ContextMenuHandler",
    "sap/ui/comp/smarttable/SmartTable",
    "sap/ui/model/odata/v2/Context",
    "sap/m/Table",
    "sap/m/Column",
    "sap/ui/model/json/JSONModel",
    "sap/m/OverflowToolbar",
    "sap/m/Button",
    "sap/ui/base/Event",
    "sap/m/MenuItem",
    "sap/m/Menu"
], function (
    sinon,
    ContextMenuHandler,
    SmartTable,
    Context,
    ResponsiveTable,
    ResponsiveTableColumn,
    JSONModel,
    OverflowToolbar,
    Button,
    Event,
    MenuItem,
    Menu
) {
    // Initializing SmartTable related controls
    var oResponsiveColumn = new ResponsiveTableColumn();
    var oToolbar = new OverflowToolbar({
        id: "Toolbar",
        content: [
            new Button("customAction1", { text: "Custom 1" }),
            new Button("customAction2", { text: "Custom 2" }),
            new Button("customAction3", { text: "Custom 3" }),
            new Button("customAction4", { text: "Custom 4" }),
            new Button("customAction5", { text: "Custom 5" }),
            new Button("deleteEntry", { text: "Delete" }),
            new Button("standardAction1", { text: "Standard 1" }),
            new Button("standardAction2", { text: "Standard 2" })
        ]
    });
    var oResponsiveTable = new ResponsiveTable({
        id: "responsiveTable",
        columns: [oResponsiveColumn],
        contextMenu: new Menu()
    });
    var oSmartTable = new SmartTable({
        id: "SmartTable",
        entitySet: "SalesOrder",
        tableType: "ResponsiveTable",
        items: oResponsiveTable,
        customToolbar: oToolbar
    });

    var oSmartTableModel = {
        hasPendingChanges: function () {
            return false;
        }
    };

    // Initializing FE related objects

    // Argument 1: oController related
    var oTempPrivModelInitialData = {
        generic: {
            controlProperties: {
                SmartTable: {
                    contextMenu: {
                        items: []
                    }
                }
            }
        }
    };
    var oTemplatePrivModel = (new JSONModel(oTempPrivModelInitialData)).setDefaultBindingMode("TwoWay");
    var oView = {
        getLocalId: function (sControlId) {
            return sControlId;
        },
        getModel: function () {
            return oTemplatePrivModel;
        }
    };
    var oController = {
        getView: function () {
            return oView;
        },
        getOwnerComponent: function () {
            return {
                getAppComponent: function () {
                    return {
                        getFlexibleColumnLayout: Function.prototype
                    };
                }
            };
        },
        onCustomAction1: Function.prototype,
        onCustomAction2: Function.prototype,
        onCustomAction3: Function.prototype,
        onCustomAction4: Function.prototype,
        onCustomAction5: Function.prototype
    };

    var aStandardActionsInfo = [
        { ID: "deleteEntry", RecordType: "CRUDActionDelete" },
        { ID: "standardAction1", RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction" },
        { ID: "standardAction2", RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" }
    ];

    var oStandardActionEnablementInfo = {
        "deleteEntry": { enabled: true },
        "standardAction1": { enabled: true },
        "standardAction2": { enabled: false }
    };

    var oBreakoutActionsInfo = {
        "customAction1": {
            id: "customAction1",
            text: "Custom 1",
            press: "onCustomAction1",
            requiresSelection: true
        },
        "customAction2": {
            id: "customAction2",
            text: "Custom 2",
            press: "onCustomAction2",
            requiresSelection: true
        },
        "customAction3": {
            id: "customAction3",
            text: "Custom 3",
            press: "onCustomAction3",
            requiresSelection: true,
            applicablePath: "IsActiveEntity"
        },
        "customAction4": {
            id: "customAction4",
            text: "Custom 4",
            press: "onCustomAction4",
            requiresSelection: false
        },
        "customAction5": {
            id: "customAction5",
            text: "Custom 5",
            press: "onCustomAction5",
            requiresSelection: true,
            excludeFromContextMenu: true
        }
    };

    var oBreakoutActionEnablementInfo = {
        "customAction1": true,
        "customAction2": true,
        "customAction3": false,
        "customAction4": true,
        "customAction5": true
    };

    // Argument 2: oTemplateUtils and it's sub-objects
    var oCommonUtils = {
        getToolbarCustomData: function () {
            return aStandardActionsInfo;
        },
        getBreakoutActions: function () {
            return oBreakoutActionsInfo;
        },
        getToolbarActionEnablementInfo: function (oStandardAction) {
            return oStandardActionEnablementInfo[oStandardAction.ID];
        },
        isBreakoutActionEnabled: function (oBreakoutAction) {
            return oBreakoutActionEnablementInfo[oBreakoutAction.id];
        },
        getText: function () {
            return "";
        }
    };

    var oComponentUtils = {
        canNavigateToSubEntitySet: function () {
            return false;
        },
        getViewLevel: function () {
            return 0;
        }
    };

    var oTableRowModel = new JSONModel({});
    var oRowContext = new Context(oTableRowModel, "/row1");
    var oFocusInfo = {
        focussedBindingContext: oRowContext,
        applicableContexts: [oRowContext],
        doesApplicableEqualSelected: true
    };

    var oPresentationControlHandler = {
        getFocusInfoForContextMenuEvent: function (oEvent) {
            return oFocusInfo;
        }
    };

    var oTemplateUtils = {
        oCommonUtils: oCommonUtils,
        oComponentUtils: oComponentUtils,
        oServices: {
            oApplication: {
                getEditFlowOfRoot: function () {
                    return "";
                }
            },
            oApplicationController: {
                synchronizeDraftAsync: function () {
                    return Promise.resolve();
                }
            },
            oPresentationControlHandlerFactory: {
                getPresentationControlHandler: function () {
                    return oPresentationControlHandler;
                }
            }
        }
    };

    // Argument 3: oState
    var oState = {};

    // Argument 4: Smart Table (Created above)
    // Argument 5: oConfiguration
    var oConfiguration = {
        executeAction: Function.prototype,
        findBreakoutActionByLocalId: function (aBreakoutActionsData, sToolbarButtonLocalId) {
            return aBreakoutActionsData.find(function (oBreakoutAction) {
                return sToolbarButtonLocalId === oBreakoutAction.id;
            });
        }
    }

    var oSmartTableModelStub;
    QUnit.module("Context menu handler", {
        setup: function () {
            oSmartTableModelStub = sinon.stub(oSmartTable, "getModel").returns(oSmartTableModel);
        },
        teardown: function () {
            oSmartTableModelStub.restore();
        }
    });

    // Global variable for context menu handler
    var oContextMenuHandler = new ContextMenuHandler(oController, oTemplateUtils, oState, oSmartTable, oConfiguration);
    //Firing "beforeOpenContextMenu" event
    var oBeforeOpenContextMenuEvent = new Event("beforeOpenContextMenu", oResponsiveTable);
    oContextMenuHandler.beforeOpenContextMenu(oBeforeOpenContextMenuEvent);

    QUnit.test("Check the context menu contents", function (assert) {
        var done = assert.async();
        // Instantiate the ContextMenuController
        assert.ok(oContextMenuHandler, "Handler is created");

        // Check the context menu contents
        var aContextMenuItems = oTemplatePrivModel.getProperty("/generic/controlProperties/SmartTable/contextMenu/items");
        var aContextMenuItemTexts = aContextMenuItems.map(function (oMenuItem) {
            return oMenuItem.text;
        });
        var aContextMenuItemHandlerPromises = aContextMenuItems.map(function (oMenuItem) {
            return oMenuItem.handlerPromise;
        })

        // "Custom 4" is omitted as "requiresSelection" is false
        // "Custom 5" is also omitted as "excludeFromContextMenu" is true
        // All other items are added
        assert.equal(aContextMenuItemTexts.toString(), ['Custom 1', 'Custom 2', 'Custom 3', 'Delete', 'Standard 1', 'Standard 2'].toString(), "Verify the contents");

        //Resolve all the handler promises to verify the menu item enablement
        Promise.all([aContextMenuItemHandlerPromises]).then(function () {
            var aUpdatedContextMenuItems = oTemplatePrivModel.getProperty("/generic/controlProperties/SmartTable/contextMenu/items");
            assert.equal(aUpdatedContextMenuItems[0].enabled, true, "'Custom 1' should be enabled");
            assert.equal(aUpdatedContextMenuItems[1].enabled, true, "'Custom 2' should be enabled");
            assert.equal(aUpdatedContextMenuItems[2].enabled, false, "'Custom 3' should be disabled");
            assert.equal(aUpdatedContextMenuItems[3].enabled, true, "'Delete' should be enabled");
            assert.equal(aUpdatedContextMenuItems[4].enabled, true, "'Standard 1' should be enabled");
            assert.equal(aUpdatedContextMenuItems[5].enabled, false, "'Standard 2' should be disabled");

            done();
        });
    });

    QUnit.test("Execute a breakout action", function (assert) {
        var aContextMenuItems = oTemplatePrivModel.getProperty("/generic/controlProperties/SmartTable/contextMenu/items");
        var oMenuItemForCustomAction1 = new MenuItem(aContextMenuItems[0]);
        // Stub for custom action 1 handler
        var oCustomAction1HandlerStub = sinon.stub(oController, "onCustomAction1");
        // Press event for menu item
        var oPressEvent = new Event("press", oMenuItemForCustomAction1);

        // Act
        oContextMenuHandler.onContextMenu(oPressEvent);

        // Check whether the custom method in controller is executed
        assert.equal(oCustomAction1HandlerStub.calledOnce, true, "Press event handler on the controller is invoked");
        // Restore the stubs
        oCustomAction1HandlerStub.restore();
    });
});