// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @file QUnit tests for sap.ushell.renderer.AllMyApps.
 * Testing the consumptions of groups data, external providers data and catalogs data
 * and how the model is updated in each use-case.
 */
sap.ui.define([
    "sap/ui/core/Element",
    "sap/ui/core/mvc/XMLView",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Config",
    "sap/ushell/Container",
    "sap/ushell/library",
    "sap/ushell/resources",
    "sap/ushell/state/ShellModel"
], function (
    Element,
    XMLView,
    Device,
    JSONModel,
    jQuery,
    Config,
    Container,
    ushellLibrary,
    ushellResources,
    ShellModel
) {
    "use strict";

    /* global QUnit, sinon */

    // shortcut for sap.ushell.AppTitleState
    const AppTitleState = ushellLibrary.AppTitleState;

    // shortcut for sap.ushell.AllMyAppsState
    const AllMyAppsState = ushellLibrary.AllMyAppsState;

    // shortcut for sap.ushell.AllMyAppsProviderType
    const AllMyAppsProviderType = ushellLibrary.AllMyAppsProviderType;

    const sandbox = sinon.createSandbox();

    var oView;
    var oAllMyAppsModel = new JSONModel();
    var aExternalProvider0Data = [{
        title: "Group01",
        apps: [{
            title: "P0_G1_Title1",
            subTitle: "P0_G1_SubTitle1",
            url: "#Action-todefaultapp"
        }, {
            title: "P0_G1_Title2",
            subTitle: "P0_G1_SubTitle2",
            url: "https://www.youtube.com/"
        }]
    }, {
        title: "Group02",
        apps: [{
            title: "P0_G2_Title1",
            subTitle: "P0_G2_SubTitle1",
            url: "http://www.ynet.co.il"
        }, {
            title: "P0_G2_Title2",
            subTitle: "P0_G2_SubTitle2",
            url: "#Action-todefaultapp"
        }]
    }];
    var aExternalProvider1Data = [{
        title: "Group11",
        apps: [{
            title: "P1_G1_Title1",
            subTitle: "P1_G1_SubTitle1",
            url: "#Action-todefaultapp"
        }, {
            title: "P1_G1_Title2",
            subTitle: "P1_G1_SubTitle2",
            url: "https://www.youtube.com/"
        }]
    }, {
        title: "Group12",
        apps: [{
            title: "P1_G2_Title1",
            subTitle: "P1_G2_SubTitle1",
            url: "http://www.ynet.co.il"
        }, {
            title: "P1_G2_Title2",
            subTitle: "P1_G2_SubTitle2",
            url: "#Action-todefaultapp"
        }]
    }];
    var oAllMyAppsGetDataProvidersResponse1 = {
        ExternalProvider0: {
            getTitle: function () {
                return "ExternalProvider0";
            },
            getData: function () {
                var oDeferred = new jQuery.Deferred();
                oDeferred.resolve(aExternalProvider0Data);
                return oDeferred.promise();
            }
        }
    };
    var oAllMyAppsGetDataProvidersResponse2 = {
        ExternalProvider0: {
            getTitle: function () {
                return "ExternalProvider0";
            },
            getData: function () {
                var oDeferred = new jQuery.Deferred();
                oDeferred.resolve(aExternalProvider0Data);
                return oDeferred.promise();
            }
        },
        ExternalProvider1: {
            getTitle: function () {
                return "ExternalProvider1";
            },
            getData: function () {
                var oDeferred = new jQuery.Deferred();
                oDeferred.resolve(aExternalProvider1Data);
                return oDeferred.promise();
            }
        }
    };

    QUnit.module("sap.ushell.renderer.allMyApps.AllMyApps", {
        beforeEach: function () {
            return Container.init("local")
                .then(() => {
                    oAllMyAppsModel.setProperty("/AppsData", []);

                    return Container.getServiceAsync("AllMyApps");
                })
                .then((AllMyApps) => {
                    this.AllMyApps = AllMyApps;
                });
        },

        afterEach: function () {
            var oAllMyAppsView = Element.getElementById("allMyAppsView");
            if (oAllMyAppsView) {
                oAllMyAppsView.destroy();
            }

            sandbox.restore();
            ShellModel.getConfigModel().setProperty("/allMyAppsMasterLevel", undefined);
        }
    });

    // -------------------------------------------------------------------------------
    // ----------------------------------   TESTS   ----------------------------------
    // -------------------------------------------------------------------------------

    QUnit.test("Test onAfterRendering", function (assert) {
        var oClock;
        var oLoadAppsDataSpy;

        return XMLView.create({
            id: "allMyAppsView",
            viewName: "sap.ushell.renderer.allMyApps.AllMyApps"
        })
            .then(function (view) {
                oView = view;
                this.oController = oView.getController();
                this.oMasterPage = oView.byId("sapUshellAllMyAppsMasterPage");
                this.oDetailsPage = oView.byId("sapUshellAllMyAppsDetailsPage");
                this.oSplitApp = oView.byId("sapUshellAllMyAppsMasterDetail");

                oLoadAppsDataSpy = sandbox.stub();
                sandbox.stub(this.oController, "_getAllMyAppsManager").returns({
                    loadAppsData: oLoadAppsDataSpy
                });
                oClock = sandbox.useFakeTimers();

                this.oSwitchToInitialStateSpy = sandbox.stub(this.oController, "switchToInitialState");
                this.oIsSingleDataSourceStub = sandbox.stub(this.oController, "_isSingleDataSource").resolves();
                this.oMasterPageSetBusyStub = sandbox.stub(this.oMasterPage, "setBusy");
                this.oDetailsPageSetBusyStub = sandbox.stub(this.oDetailsPage, "setBusy");
                this.oSpitAppToMasterStub = sandbox.stub(this.oSplitApp, "toMaster");

                var oOnAfterRenderingPromise = this.oController.onAfterRendering();
                oClock.tick();
                return oOnAfterRenderingPromise;
            }.bind(this))
            .then(function () {
                assert.strictEqual(this.oMasterPageSetBusyStub.callCount, 1, "setBusy function called for the master page.");
                assert.strictEqual(this.oMasterPageSetBusyStub.firstCall.args[0], true, "setBusy called with 'true' for the master page.");
                assert.strictEqual(this.oDetailsPageSetBusyStub.callCount, 1, "setBusy function called for the details page.");
                assert.strictEqual(this.oDetailsPageSetBusyStub.firstCall.args[0], true, "setBusy called with 'true' for the details page.");
                assert.strictEqual(this.oSwitchToInitialStateSpy.callCount, 1, "switchToInitialState called once");
                assert.strictEqual(this.oIsSingleDataSourceStub.callCount, 1, "isSingleDataSource called once");
                assert.strictEqual(oLoadAppsDataSpy.callCount, 1, "AllMyAppsManager.loadAppsData called once");
                assert.strictEqual(this.oSpitAppToMasterStub.callCount, 1, "SplitApp's toMaster called once");
            }.bind(this));
    });

    QUnit.test("Test onAfterRendering on phone", function (assert) {
        var oOriginalDeviceSystem;
        var oLoadAppsDataSpy;
        var oClock;

        return XMLView.create({
            id: "allMyAppsView",
            viewName: "sap.ushell.renderer.allMyApps.AllMyApps"
        })
            .then(function (view) {
                oView = view;
                this.oController = oView.getController();
                this.oSplitApp = oView.byId("sapUshellAllMyAppsMasterDetail");

                oOriginalDeviceSystem = Device.system;
                oLoadAppsDataSpy = sandbox.stub();
                sandbox.stub(this.oController, "_getAllMyAppsManager").returns({
                    loadAppsData: oLoadAppsDataSpy
                });
                oClock = sandbox.useFakeTimers();

                Device.system.phone = true;
                this.oSwitchToInitialState = sandbox.stub(this.oController, "switchToInitialState");
                this.oIsSingleDataSource = sandbox.stub(this.oController, "_isSingleDataSource").resolves();
                this.oSplitAppToMaster = sandbox.stub(this.oSplitApp, "toMaster");
                this.oSplitAppToDetail = sandbox.stub(this.oSplitApp, "toDetail");

                var oOnAfterRenderingPromise = this.oController.onAfterRendering();
                oClock.tick();
                return oOnAfterRenderingPromise;
            }.bind(this))
            .then(function () {
                assert.strictEqual(this.oSplitAppToMaster.callCount, 1, "oView.oSplitApp.toMaster called");
                assert.strictEqual(this.oSplitAppToDetail.callCount, 0, "On phone,oView.oSplitApp.toDetail is not called");
                assert.strictEqual(this.oSwitchToInitialState.callCount, 1, "switchToInitialState called once");
                assert.strictEqual(this.oIsSingleDataSource.callCount, 1, "isSingleDataSource called once");
                assert.strictEqual(oLoadAppsDataSpy.callCount, 1, "AllMyAppsManager.loadAppsData called once");

                Device.system = oOriginalDeviceSystem;
                Device.system.phone = false;
            }.bind(this));
    });

    QUnit.test("Test _isSingleDataSource", function (assert) {
        var bShowGroupsApps = false;
        var bShowCatalogsApps = true;
        var bShowExternalProvidersApps = false;
        var oGetDataProvidersResponse = oAllMyAppsGetDataProvidersResponse1;

        sandbox.stub(Container, "getServiceAsync").resolves({
            isHomePageAppsEnabled: function () {
                return bShowGroupsApps;
            },
            isCatalogAppsEnabled: function () {
                return bShowCatalogsApps;
            },
            isExternalProviderAppsEnabled: function () {
                return bShowExternalProvidersApps;
            },
            getDataProviders: function () {
                return oGetDataProvidersResponse;
            }
        });

        return XMLView.create({
            id: "allMyAppsView",
            viewName: "sap.ushell.renderer.allMyApps.AllMyApps"
        })
            .then(function (view) {
                oView = view;
                this.oController = oView.getController();

                return this.oController._isSingleDataSource();
            }.bind(this))
            .then(function (bResult) {
                assert.strictEqual(bResult, false, "isSingleDataSource returns false when CatalogsApps are enabled");

                bShowGroupsApps = true;
                bShowCatalogsApps = false;
                bShowExternalProvidersApps = false;
                return this.oController._isSingleDataSource();
            }.bind(this))
            .then(function (bResult) {
                assert.strictEqual(bResult, true, "isSingleDataSource returns true when only GroupsApps are enabled");

                bShowGroupsApps = false;
                bShowCatalogsApps = false;
                bShowExternalProvidersApps = true;
                return this.oController._isSingleDataSource();
            }.bind(this))
            .then(function (bResult) {
                assert.strictEqual(bResult, true, "isSingleDataSource returns true when only ExternalProviders are enabled, and only singe provider exists");

                oGetDataProvidersResponse = oAllMyAppsGetDataProvidersResponse2;
                return this.oController._isSingleDataSource();
            }.bind(this))
            .then(function (bResult) {
                assert.strictEqual(bResult, false, "isSingleDataSource returns false when only ExternalProviders are enabled, and two providers exist");
            });
    });

    QUnit.test("Test switchToInitialState", function (assert) {
        const oConfigModel = ShellModel.getConfigModel();
        var oBindItemStub;
        var oIsSingleDataSourceStub;
        var oSplitAppToMasterSpy;
        var oViewOriginalSplitApp;
        var oSetTextStub;
        var oSetVisibleStub;

        return XMLView.create({
            id: "allMyAppsView",
            viewName: "sap.ushell.renderer.allMyApps.AllMyApps"
        })
            .then(async function (view) {
                oView = view;
                this.oController = oView.getController();

                oViewOriginalSplitApp = oView.byId("sapUshellAllMyAppsMasterDetail");
                oBindItemStub = sandbox.stub(oView.byId("sapUshellAllMyAppsDataSourcesList"), "bindItems").returns();
                oIsSingleDataSourceStub = sandbox.stub(this.oController, "_isSingleDataSource").resolves(true);
                oSetTextStub = sandbox.stub();
                oSetVisibleStub = sandbox.stub();
                oSplitAppToMasterSpy = sandbox.spy(oViewOriginalSplitApp, "toMaster");

                sandbox.stub(this.oController, "_getPopoverHeaderLabel").returns({
                    setText: oSetTextStub
                });
                sandbox.stub(this.oController, "_getPopoverHeaderContent").returns({
                    setVisible: sandbox.stub()
                });
                sandbox.stub(this.oController, "_getPopoverHeaderBackButton").returns({
                    setVisible: oSetVisibleStub
                });
                sandbox.stub(oViewOriginalSplitApp, "toDetail").returns(function () { });

                Device.system.phone = true;
                oConfigModel.setProperty("/shellAppTitleState", AppTitleState.AllMyAppsOnly);

                return this.oController.switchToInitialState();
            }.bind(this))
            .then(async function () {
                var sAllMyAppsMasterLevel = Config.last("/core/shell/model/allMyAppsMasterLevel");
                assert.strictEqual(sAllMyAppsMasterLevel, AllMyAppsState.FirstLevelSpread, "isSingleDataSource is true, allMyAppsMasterLevel is FirstLevelSpread");
                assert.strictEqual(oBindItemStub.callCount, 1, "BindItem called once");
                assert.strictEqual(oBindItemStub.args[0][0], "allMyAppsModel>/AppsData/0/groups", "BindItem called for binding groups level to the master list");
                assert.strictEqual(oSetVisibleStub.callCount, 1, "The current state is AllMyAppsOnly - BackButton setVisible called once");
                assert.strictEqual(oSetVisibleStub.args[0][0], false, "The current state is AllMyAppsOnly - BackButton setVisible called with false");
                assert.strictEqual(oSplitAppToMasterSpy.callCount, 1, "The device is phone, so oSplitApp.toMaster is called");
                assert.strictEqual(oSplitAppToMasterSpy.args[0][0], "allMyAppsView--sapUshellAllMyAppsMasterPage", "oSplitApp.toMaster is called for page sapUshellAllMyAppsMasterPage");
                assert.strictEqual(oSplitAppToMasterSpy.args[0][1], "show", "oSplitApp.toMaster page sapUshellAllMyAppsMasterPage show");

                // Changing two parameters:
                // 1. isSingleDataSource returns false (state should not be FirstLevelSpread)
                // 2. ShellAppTitle state changes to AllMyApps (from AllMyAppsOnly)
                oIsSingleDataSourceStub.restore();
                Device.system.phone = false;
                oSplitAppToMasterSpy = sandbox.spy();
                oIsSingleDataSourceStub = sandbox.stub(this.oController, "_isSingleDataSource").resolves(false);

                oConfigModel.setProperty("/shellAppTitleState", AppTitleState.AllMyApps);

                return this.oController.switchToInitialState();
            }.bind(this))
            .then(function () {
                var sAllMyAppsMasterLevel = Config.last("/core/shell/model/allMyAppsMasterLevel");
                assert.strictEqual(sAllMyAppsMasterLevel, AllMyAppsState.FirstLevel, "isSingleDataSource is false, allMyAppsMasterLevel is FirstLevel");
                assert.strictEqual(oBindItemStub.callCount, 2, "BindItem called twice");
                assert.strictEqual(oBindItemStub.args[1][0], "allMyAppsModel>/AppsData", "BindItem called for binding providers level to the master list");
                assert.strictEqual(oSetVisibleStub.callCount, 2, "The current state is AllMyApps - BackButton setVisible called twice");
                assert.strictEqual(oSetVisibleStub.args[1][0], true, "The current state is AllMyApps - BackButton setVisible called with true");
                assert.strictEqual(oSplitAppToMasterSpy.notCalled, true, "The device is not phone, so oSplitApp.toMaster is not called");

                oView.oSplitApp = oViewOriginalSplitApp;
            });
    });

    QUnit.test("Test handleSwitchToMasterAreaOnPhone", function (assert) {
        const oConfigModel = ShellModel.getConfigModel();
        var oIsSingleDataSourceStub;
        var oGetPopoverBackButtonStub;
        var oGetDataSourcesSelectedPathStub;
        var oSetVisibleStub = sandbox.stub();

        return XMLView.create({
            id: "allMyAppsView",
            viewName: "sap.ushell.renderer.allMyApps.AllMyApps"
        })
            .then(async function (view) {
                oView = view;
                this.oController = oView.getController();

                oIsSingleDataSourceStub = sandbox.stub(this.oController, "_isSingleDataSource").resolves(true);
                oGetPopoverBackButtonStub = sandbox.stub(this.oController, "_getPopoverHeaderBackButton").returns({
                    setVisible: oSetVisibleStub
                });
                oGetDataSourcesSelectedPathStub = sandbox.stub(this.oController, "_getDataSourcesSelectedPath").returns(
                    "/AppsData/2/groups/0"
                );

                sandbox.stub(this.oController, "_getPopoverHeaderContent").returns({
                    setVisible: sandbox.stub()
                });

                // Use case 1:
                // - SingleDataSource
                // - AllMyAppsState is AllMyAppsOnly (meaning: ShellNavMenu is not available)
                // Expected result: back button should not be visible
                oConfigModel.setProperty("/shellAppTitleState", AppTitleState.AllMyAppsOnly);


                // first call to the tested function, isSingleDataSource is true and StateEnum is AllMyAppsOnly
                return this.oController.handleSwitchToMasterAreaOnPhone();
            }.bind(this))
            .then(function () {
                const sAllMyAppsMasterLevel = oConfigModel.getProperty("/allMyAppsMasterLevel");
                assert.strictEqual(sAllMyAppsMasterLevel, AllMyAppsState.FirstLevelSpread, "Model property allMyAppsMasterLevel is set with FirstLevelSpread");
                assert.strictEqual(oSetVisibleStub.callCount, 1, "The current state is AllMyAppsOnly - BackButton setVisible called once");
                assert.strictEqual(oSetVisibleStub.args[0][0], false, "The current state is AllMyAppsOnly - BackButton setVisible called with false");

                // Use case 2:
                // - SingleDataSource
                // - AllMyAppsState is AllMyApps (meaning: ShellNavMenu is also available)
                // Expected result: back button needs to be visible
                oConfigModel.setProperty("/shellAppTitleState", AppTitleState.AllMyApps);
                return this.oController.handleSwitchToMasterAreaOnPhone();
            }.bind(this))
            .then(function () {
                assert.strictEqual(oSetVisibleStub.callCount, 2, "Visibility is updated after handleSwitchToMasterAreaOnPhone");

                // Use case 3:
                // - Not SingleDataSource
                // - The previously selected master item is a 2nd level item (i.e. group)
                // oSetVisibleSpy.restore();
                oSetVisibleStub = sandbox.stub();
                oGetPopoverBackButtonStub.restore();
                oGetPopoverBackButtonStub = sandbox.stub(this.oController, "_getPopoverHeaderBackButton").returns({
                    setVisible: oSetVisibleStub
                });
                oIsSingleDataSourceStub.restore();
                oIsSingleDataSourceStub = sandbox.stub(this.oController, "_isSingleDataSource").resolves(false);
                this.oController.handleSwitchToMasterAreaOnPhone();
            }.bind(this))
            .then(async function () {
                const sAllMyAppsMasterLevel = oConfigModel.getProperty("/allMyAppsMasterLevel");
                assert.strictEqual(sAllMyAppsMasterLevel, AllMyAppsState.SecondLevel, "Model property allMyAppsMasterLevel is set with SecondLevel");
                assert.strictEqual(oSetVisibleStub.callCount, 1, "Return to SecondLevel - BackButton setVisible is updated after handleSwitchToMasterAreaOnPhone call");

                // Use case 4:
                // - Not SingleDataSource
                // - The previously selected master item is a 1st level item (i.e. catalog)
                //  oSetVisibleSpy.restore();
                oSetVisibleStub = sandbox.stub();
                oGetPopoverBackButtonStub.restore();
                oGetPopoverBackButtonStub = sandbox.stub(this.oController, "_getPopoverHeaderBackButton").returns({
                    setVisible: oSetVisibleStub
                });
                oConfigModel.setProperty("/shellAppTitleState", AppTitleState.AllMyAppsOnly);

                oGetDataSourcesSelectedPathStub.restore();
                oGetDataSourcesSelectedPathStub = sandbox.stub(this.oController, "_getDataSourcesSelectedPath").returns("/AppsData/2");
                this.oController.handleSwitchToMasterAreaOnPhone();
            }.bind(this))
            .then(function () {
                const sAllMyAppsMasterLevel = oConfigModel.getProperty("/allMyAppsMasterLevel");
                assert.strictEqual(sAllMyAppsMasterLevel, AllMyAppsState.FirstLevel, "Model property allMyAppsMasterLevel is set with FirstLevel");
                assert.strictEqual(oSetVisibleStub.callCount, 1, "Return to FirstLevel - BackButton setVisible called once");
                assert.strictEqual(oSetVisibleStub.args[0][0], false, "Return to FirstLevel - BackButton setVisible called with false");
            });
    });

    QUnit.test("Test handleMasterListItemPress", function (assert) {
        var oGetPropertyReturnedProviderType;
        var oHandleMasterListItemPressToDetailsStub;
        var oHandleMasterListItemPressToSecondLevelStub;

        return XMLView.create({
            id: "allMyAppsView",
            viewName: "sap.ushell.renderer.allMyApps.AllMyApps"
        })
            .then(function (view) {
                oView = view;
                this.oController = oView.getController();

                oAllMyAppsModel = oView.getModel("allMyAppsModel");
                oGetPropertyReturnedProviderType = AllMyAppsProviderType.HOME;
                var oGetPropertyReturnedMasterState = AllMyAppsState.FirstLevel;
                var sClickedItemModelPath = "/AppsData/2";

                sandbox.stub(this.oController, "_getClickedDataSourceItemPath").returns(
                    sClickedItemModelPath
                );
                sandbox.stub(oAllMyAppsModel, "getProperty").callsFake(function (sProperty) {
                    if (sProperty.endsWith("type")) {
                        return oGetPropertyReturnedProviderType;
                    }
                    return oGetPropertyReturnedMasterState;
                });

                sandbox.stub(this.oController, "_getPopoverObject").returns({
                    getCustomHeader: sandbox.stub().returns({
                        getContentLeft: sandbox.stub().returns([])
                    })
                });

                oHandleMasterListItemPressToDetailsStub = sandbox.stub(this.oController, "handleMasterListItemPressToDetails");
                oHandleMasterListItemPressToSecondLevelStub = sandbox.stub(this.oController, "handleMasterListItemPressToSecondLevel");

                // Provider type HOME, Master level is FirstLevel => handleMasterListItemPressToSecondLevel should be called
                this.oController.handleMasterListItemPress({
                    getParameter: function () {
                        return "testListItem";
                    }
                });
                var iSecondLevelActualCallCount = oHandleMasterListItemPressToSecondLevelStub.callCount;
                assert.strictEqual(iSecondLevelActualCallCount, 1, "Provider type HOME, Master level is FirstLevel => handleMasterListItemPressToSecondLevel was called");

                // Provider type CATALOG, Master level is FirstLevel => handleMasterListItemPressToDetails should be called
                oGetPropertyReturnedProviderType = AllMyAppsProviderType.CATALOG;

                this.oController.handleMasterListItemPress({
                    getParameter: function () {
                        return "testListItem";
                    }
                });
                var iDetailsActualCallCount = oHandleMasterListItemPressToDetailsStub.callCount;
                assert.strictEqual(iDetailsActualCallCount, 1, "Provider type HOME, Master level is FirstLevel => handleMasterListItemPressToDetails was called");
            }.bind(this));
    });

    QUnit.test("Test handleMasterListItemPressToSecondLevel", function (assert) {
        const oConfigModel = ShellModel.getConfigModel();
        var oSplitAppToDetailStub;
        var oDataSourceListBindItemsStub;
        var oSetBindingContextStub;
        var sClickedItemModelPath;
        var oSetMasterLabelTextStub;
        var oSetDetailsLabelTextStub;
        var oSetVisibleStub;

        return XMLView.create({
            id: "allMyAppsView",
            viewName: "sap.ushell.renderer.allMyApps.AllMyApps"
        }).then(function (view) {
            oView = view;
            this.oController = oView.getController();
            this.oSplitApp = oView.byId("sapUshellAllMyAppsMasterDetail");
            this.oDataSourceList = oView.byId("sapUshellAllMyAppsDataSourcesList");

            oAllMyAppsModel = oView.getModel("allMyAppsModel");
            sClickedItemModelPath = "/AppsData/2";
            oSetMasterLabelTextStub = sandbox.stub();
            oSetDetailsLabelTextStub = sandbox.stub();
            oSetVisibleStub = sandbox.stub();
            sandbox.stub(this.oController, "_getPopoverHeaderContent").returns({
                setVisible: sandbox.stub()
            });
            sandbox.stub(this.oController, "_getPopoverHeaderLabel").returns({
                setText: oSetMasterLabelTextStub
            });
            sandbox.stub(this.oController, "_getDetailsHeaderLabel").returns({
                setText: oSetDetailsLabelTextStub
            });
            sandbox.stub(this.oController, "_getPopoverHeaderBackButton").returns({
                setVisible: oSetVisibleStub
            });

            oAllMyAppsModel.setProperty(sClickedItemModelPath, {});
            oAllMyAppsModel.setProperty(sClickedItemModelPath + "/groups", []);
            oAllMyAppsModel.setProperty(sClickedItemModelPath + "/groups/0", {});
            oAllMyAppsModel.setProperty(sClickedItemModelPath + "/groups/0/title", "someTitle");
            oAllMyAppsModel.setProperty(
                sClickedItemModelPath + "/type",
                AllMyAppsProviderType.HOME
            );

            oConfigModel.setProperty("/shellAppTitleState", AppTitleState.AllMyAppsOnly);

            oSplitAppToDetailStub = sandbox.stub(this.oSplitApp, "toDetail");
            oDataSourceListBindItemsStub = sandbox.stub(this.oDataSourceList, "bindItems");
            oSetBindingContextStub = sandbox.stub(this.oController, "_setBindingContext");

            Device.system.phone = false;
            this.oController.handleMasterListItemPressToSecondLevel(sClickedItemModelPath);

            // Verify that oSplitApp.toDetail("sapUshellAllMyAppsDetailsPage") is called
            assert.strictEqual(oSplitAppToDetailStub.callCount, 1, "Not on Phone, oView.oSplitApp.toDetail is called when first level master item pressed");

            // If the pressed item is not CATALOG, verify that the state is set to SecondLevel
            const sAllMyAppsMasterLevel = oConfigModel.getProperty("/allMyAppsMasterLevel");
            assert.strictEqual(sAllMyAppsMasterLevel, AllMyAppsState.SecondLevel, "allMyAppsMasterLevel set to AllMyAppsState.SecondLevel");

            // Verify that the list is bound to the second level (groups)
            assert.strictEqual(oDataSourceListBindItemsStub.callCount, 1, "oView.oDataSourceList.bindItems called");
            var sExpectedBindItemsArgs = "allMyAppsModel>" + sClickedItemModelPath + "/groups";
            assert.strictEqual(oDataSourceListBindItemsStub.args[0][0], sExpectedBindItemsArgs, "oView.oDataSourceList.bindItems called to bind the list to the groups level");

            // In case of AllMyAppsOnly - verify that the back button becomes visible
            assert.strictEqual(oSetVisibleStub.callCount, 1, "Setting back button visibility");
            assert.strictEqual(oSetVisibleStub.args[0][0], true, "Setting back button visibility to true");

            // Verify that the BindingContext of the details area is set to the first group of the clicked item/provider
            assert.strictEqual(oSetBindingContextStub.callCount, 1, "Setting details area context");
            var sExpectedBindingContextArgs = sClickedItemModelPath + "/groups/0";
            assert.strictEqual(oSetBindingContextStub.args[0][0], sExpectedBindingContextArgs, "Setting details area context to content of the first group of clicked item/provider");

            assert.strictEqual(oSetMasterLabelTextStub.callCount, 1, "One call to SetText of master area header label");
            var sHomeEntryTitle = ushellResources.i18n.getText("allMyApps_homeEntryTitle");
            assert.strictEqual(oSetMasterLabelTextStub.args[0][0], sHomeEntryTitle, "Master area header label is set to: " + sHomeEntryTitle);

            assert.strictEqual(oSetDetailsLabelTextStub.callCount, 1, "One call to SetText of details area header label");
            assert.strictEqual(oSetDetailsLabelTextStub.args[0][0], "someTitle", "Details area header label was set to someTitle");
        }.bind(this));
    });

    QUnit.test("Test handleMasterListItemPressToDetails", function (assert) {
        return XMLView.create({
            id: "allMyAppsView",
            viewName: "sap.ushell.renderer.allMyApps.AllMyApps"
        }).then(function (view) {
            oView = view;
            this.oController = oView.getController();

            oAllMyAppsModel = oView.getModel("allMyAppsModel");
            var oOriginalDeviceSystem = Device.system;
            var sClickedItemModelPath = "/AppsData/2";
            var oSetDetailsLabelTextSpy = sandbox.stub();
            var oSetVisibleSpy = sandbox.stub();

            sandbox.stub(this.oController, "handleSwitchToMasterAreaOnPhone").returns();
            sandbox.stub(this.oController, "_getDetailsHeaderLabel").returns({
                setText: oSetDetailsLabelTextSpy
            });
            sandbox.stub(this.oController, "_getPopoverHeaderBackButton").returns({
                setVisible: oSetVisibleSpy
            });
            sandbox.stub(this.oController, "_getPopoverHeaderContent").returns({
                setVisible: sandbox.stub()
            });

            oAllMyAppsModel.setProperty(sClickedItemModelPath, {});
            oAllMyAppsModel.setProperty(sClickedItemModelPath + "/groups", []);
            oAllMyAppsModel.setProperty(sClickedItemModelPath + "/groups/4", {});
            oAllMyAppsModel.setProperty(sClickedItemModelPath + "/groups/4/title", "someTitle");

            Device.system.phone = true;

            this.oController.handleMasterListItemPressToDetails(sClickedItemModelPath + "/groups/4");

            assert.strictEqual(oSetDetailsLabelTextSpy.callCount, 1, "Setting text of details header");
            assert.strictEqual(oSetDetailsLabelTextSpy.args[0][0], "someTitle", "Details area header label was set to someTitle");

            Device.system = oOriginalDeviceSystem;
        }.bind(this));
    });

    QUnit.module("AppFinder disabled", {
        beforeEach: function () {
            return Container.init("local").then(function () {
                oAllMyAppsModel.setProperty("/AppsData", []);
            });
        },

        afterEach: function () {
            var oAllMyAppsView = Element.getElementById("allMyAppsView");
            if (oAllMyAppsView) {
                oAllMyAppsView.destroy();
            }

            Config.emit("/core/catalog/enabled", true);
            sandbox.restore();
        }
    });

    QUnit.test("Link to open the AppFinder is not visible", function (assert) {
        Config.emit("/core/catalog/enabled", false);

        return XMLView.create({
            id: "allMyAppsView",
            viewName: "sap.ushell.renderer.allMyApps.AllMyApps"
        }).then(function (view) {
            oView = view;
            this.oController = oView.getController();
            this.oCustomLink = oView.byId("sapUshellAllMyAppsCustomPanelLink");
            this.oCustomPanel = oView.byId("sapUshellAllMyAppsCustomPanel");

            assert.equal(this.oCustomPanel.getItems().length, 2, "The custom label and the link should both be rendered.");
            assert.equal(this.oCustomLink.getVisible(), false, "The link to open the AppFinder should not be visible.");
        }.bind(this));
    });

    QUnit.test("Test link to open the AppFinder is visible", function (assert) {
        Config.emit("/core/catalog/enabled", true);

        return XMLView.create({
            id: "allMyAppsView",
            viewName: "sap.ushell.renderer.allMyApps.AllMyApps"
        }).then(function (view) {
            oView = view;
            this.oController = oView.getController();
            this.oCustomLink = oView.byId("sapUshellAllMyAppsCustomPanelLink");
            this.oCustomPanel = oView.byId("sapUshellAllMyAppsCustomPanel");

            assert.equal(this.oCustomPanel.getItems().length, 2, "The custom label and the link should both be rendered.");
            assert.equal(this.oCustomLink.getVisible(), true, "The link to open the AppFinder should be visible.");
        }.bind(this));
    });
});
