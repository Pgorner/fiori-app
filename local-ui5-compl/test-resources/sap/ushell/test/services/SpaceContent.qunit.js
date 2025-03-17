// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.SpaceContent
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ui/thirdparty/hasher",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Config",
    "sap/ushell/library",
    "sap/ushell/services/SpaceContent",
    "sap/ushell/utils/WindowUtils",
    "sap/ushell/Container"
], function (
    Log,
    hasher,
    jQuery,
    Config,
    ushellLibrary,
    SpaceContent,
    WindowUtils,
    Container
) {
    "use strict";

    /* global QUnit, sinon*/

    var AppType = ushellLibrary.AppType;
    var DisplayFormat = ushellLibrary.DisplayFormat;

    var sandbox = sinon.createSandbox({});

    QUnit.module("isPersonalizationEnabled", {
        beforeEach: function () {
            sandbox.stub(Config, "last");
            this.oSpaceContentService = new SpaceContent();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the personalization enabled flag", function (assert) {
        // Arrange
        Config.last.withArgs("/core/shell/enablePersonalization").returns(true);

        // Act
        var bResult = this.oSpaceContentService.isPersonalizationEnabled();

        // Assert
        assert.strictEqual(bResult, true, "Returned the correct flag");
    });

    QUnit.module("getPage", {
        beforeEach: function () {
            this.oPageModelStub = {
                getProperty: sandbox.stub()
            };
            this.oPagesServiceStub = {
                loadPage: sandbox.stub(),
                getModel: sandbox.stub().returns(this.oPageModelStub)
            };
            sandbox.stub(Container, "getServiceAsync").withArgs("Pages").resolves(this.oPagesServiceStub);

            this.oSpaceContentService = new SpaceContent();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("returns the requested page from the Pages service", function (assert) {
        // Arrange
        this.oPagesServiceStub.loadPage.withArgs("testPage").resolves("/pages/0");
        var oTestPage = {
            id: "testPage"
        };
        this.oPageModelStub.getProperty.withArgs("/pages/0").returns(oTestPage);

        // Act
        return this.oSpaceContentService.getPage("testPage").then(function (oPage) {
            // Assert
            assert.deepEqual(oPage, oTestPage, "The page was returned");
            assert.notStrictEqual(oPage, oTestPage, "The page from the page model was cloned");
        });
    });

    QUnit.module("getPages", {
        beforeEach: function () {
            this.oPageModelStub = {
                getProperty: sandbox.stub()
            };
            this.oPagesServiceStub = {
                loadPages: sandbox.stub(),
                getModel: sandbox.stub().returns(this.oPageModelStub)
            };
            sandbox.stub(Container, "getServiceAsync").withArgs("Pages").resolves(this.oPagesServiceStub);

            this.oSpaceContentService = new SpaceContent();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("returns the requested pages from the Pages service", function (assert) {
        // Arrange
        var oPagePathMap = {
            testPage1: "/pages/0",
            testPage2: "/pages/1"
        };
        this.oPagesServiceStub.loadPages.withArgs(["testPage1", "testPage2"]).resolves(oPagePathMap);
        var oTestPage1 = {
            id: "testPage1"
        };
        var oTestPage2 = {
            id: "testPage1"
        };
        this.oPageModelStub.getProperty.withArgs("/pages/0").returns(oTestPage1);
        this.oPageModelStub.getProperty.withArgs("/pages/1").returns(oTestPage2);
        var oExpectedPages = {
            testPage1: oTestPage1,
            testPage2: oTestPage2
        };

        // Act
        return this.oSpaceContentService.getPages(["testPage1", "testPage2"]).then(function (oPages) {
            // Assert
            assert.deepEqual(oPages, oExpectedPages, "The pages were returned");
            assert.notStrictEqual(oPages.testPage1, oTestPage1, "The page from the page model was cloned");
            assert.notStrictEqual(oPages.testPage2, oTestPage2, "The page from the page model was cloned");
        });
    });

    QUnit.module("addSection", {
        beforeEach: function () {
            this.oPagesServiceStub = {
                getPageIndex: sandbox.stub(),
                addSection: sandbox.stub().resolves()
            };
            sandbox.stub(Container, "getServiceAsync").withArgs("Pages").resolves(this.oPagesServiceStub);
            this.oSpaceContentService = new SpaceContent();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Forwards to the Pages service", function (assert) {
        // Arrange
        this.oPagesServiceStub.getPageIndex.withArgs("testPage").returns(2);
        var oSectionProperties = {
            title: "New Section"
        };
        var aExpectedAddSectionArgs = [
            2,
            1,
            oSectionProperties
        ];

        // Act
        return this.oSpaceContentService.addSection("testPage", 1, oSectionProperties).then(function () {
            // Assert
            assert.deepEqual(this.oPagesServiceStub.addSection.args[0], aExpectedAddSectionArgs, "The API call was forwarded correctly");
        }.bind(this));
    });

    QUnit.module("addVisualization", {
        beforeEach: function () {
            this.oPagesServiceStub = {
                addVisualization: sandbox.stub().resolves()
            };
            sandbox.stub(Container, "getServiceAsync").withArgs("Pages").resolves(this.oPagesServiceStub);
            this.oSpaceContentService = new SpaceContent();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Forwards to the Pages service", function (assert) {
        // Arrange
        var aExpectedAddVisualizationArgs = [
            "testPage",
            1,
            "12345"
        ];

        // Act
        return this.oSpaceContentService.addVisualization("testPage", 1, "12345").then(function () {
            // Assert
            assert.deepEqual(this.oPagesServiceStub.addVisualization.args[0], aExpectedAddVisualizationArgs, "The API call was forwarded correctly");
        }.bind(this));
    });

    QUnit.module("moveVisualization", {
        beforeEach: function () {
            this.oPagesServiceStub = {
                getPageIndex: sandbox.stub(),
                moveVisualization: sandbox.stub().resolves()
            };
            sandbox.stub(Container, "getServiceAsync").withArgs("Pages").resolves(this.oPagesServiceStub);

            this.oSpaceContentService = new SpaceContent();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Forwards to the Pages service and returns the new visualization index", function (assert) {
        // Arrange
        this.oPagesServiceStub.getPageIndex.withArgs("testPage").returns(2);
        var oVisualizationIndex = {
            visualizationIndex: 2
        };
        this.oPagesServiceStub.moveVisualization.withArgs(2, 1, 1, 2, 2).resolves(oVisualizationIndex);
        var aExpectedmoveVisualizationArgs = [2, 1, 1, 2, 2];

        // Act
        return this.oSpaceContentService.moveVisualization("testPage", 1, 1, 2, 2).then(function (oNewVisualizationIndex) {
            // Assert
            assert.deepEqual(this.oPagesServiceStub.moveVisualization.args[0], aExpectedmoveVisualizationArgs, "The API call was forwarded correctly");
            assert.strictEqual(oNewVisualizationIndex, oVisualizationIndex, "The new visualization index was returned");
        }.bind(this));
    });

    QUnit.module("updateVisualization", {
        beforeEach: function () {
            this.oPagesServiceStub = {
                getPageIndex: sandbox.stub(),
                updateVisualization: sandbox.stub().resolves()
            };
            sandbox.stub(Container, "getServiceAsync").withArgs("Pages").resolves(this.oPagesServiceStub);

            this.oSpaceContentService = new SpaceContent();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Forwards to the Pages service", function (assert) {
        // Arrange
        this.oPagesServiceStub.getPageIndex.withArgs("testPage").returns(2);
        var aExpectedUpdateVisualizationArgs = [
            2,
            1,
            1,
            { displayFormatHint: DisplayFormat.Flat, title: "Test title", subtitle: "Test subtitle", info: "Test info" }
        ];

        // Act
        return this.oSpaceContentService.updateVisualization(
            "testPage",
            1,
            1,
            { displayFormatHint: DisplayFormat.Flat, title: "Test title", subtitle: "Test subtitle", info: "Test info" }
        ).then(function () {
            // Assert
            assert.deepEqual(this.oPagesServiceStub.updateVisualization.args[0], aExpectedUpdateVisualizationArgs, "The API call was forwarded correctly");
        }.bind(this));
    });

    QUnit.test("Only allows changing of selected properties", function (assert) {
        // Arrange
        this.oPagesServiceStub.getPageIndex.withArgs("testPage").returns(2);
        var aExpectedUpdateVisualizationProperties = {
            displayFormatHint: DisplayFormat.Flat,
            title: "Test title",
            subtitle: "Test subtitle",
            info: "Test info"
        };

        // Act
        return this.oSpaceContentService.updateVisualization("testPage", 1, 1, {
            displayFormatHint: DisplayFormat.Flat,
            title: "Test title",
            subtitle: "Test subtitle",
            info: "Test info",
            icon: "Test icon"
        }).then(function () {
            // Assert
            assert.deepEqual(this.oPagesServiceStub.updateVisualization.args[0][3], aExpectedUpdateVisualizationProperties, "Only the selected properties were forwarded");
        }.bind(this));
    });

    QUnit.module("deleteVisualization", {
        beforeEach: function () {
            this.oPagesServiceStub = {
                getPageIndex: sandbox.stub(),
                deleteVisualization: sandbox.stub().resolves()
            };
            sandbox.stub(Container, "getServiceAsync").withArgs("Pages").resolves(this.oPagesServiceStub);

            this.oSpaceContentService = new SpaceContent();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Forwards to the Pages service", function (assert) {
        // Arrange
        this.oPagesServiceStub.getPageIndex.withArgs("testPage").returns(2);
        var aExpectedDeleteVisualizationArgs = [2, 1, 1];

        // Act
        return this.oSpaceContentService.deleteVisualization("testPage", 1, 1).then(function () {
            // Assert
            assert.deepEqual(this.oPagesServiceStub.deleteVisualization.args[0], aExpectedDeleteVisualizationArgs, "The API call was forwarded correctly");
        }.bind(this));
    });

    QUnit.module("instantiateVisualization", {
        beforeEach: function () {
            this.oVisualizationInstantiationServiceStub = {
                instantiateVisualization: sandbox.stub()
            };
            sandbox.stub(Container, "getServiceAsync").withArgs("VisualizationInstantiation").resolves(this.oVisualizationInstantiationServiceStub);

            this.oSpaceContentService = new SpaceContent();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Forwards to the VisualizationInstantiation service", function (assert) {
        // Arrange
        var oVizData = {
            vizId: "test"
        };
        var oVizInstanceStub = {
            "I am a": "vizInstance"
        };
        this.oVisualizationInstantiationServiceStub.instantiateVisualization.withArgs(oVizData).returns(oVizInstanceStub);

        // Act
        return this.oSpaceContentService.instantiateVisualization(oVizData).then(function (oVizInstance) {
            // Assert
            assert.deepEqual(this.oVisualizationInstantiationServiceStub.instantiateVisualization.args[0][0], oVizData, "The API call was forwarded correctly");
            assert.deepEqual(oVizInstance, oVizInstanceStub, "The vizInstance was returned");
        }.bind(this));
    });

    QUnit.module("launchTileTarget", {
        beforeEach: function () {
            this.oSetHashStub = sandbox.stub(hasher, "setHash");
            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oRendererStub = {
                logRecentActivity: sandbox.stub().resolves()
            };
            sandbox.stub(Container, "getRendererInternal").withArgs("fiori2").returns(this.oRendererStub);
            this.oOpenURLStub = sandbox.stub(WindowUtils, "openURL");
            this.oLogErrorStub = sandbox.stub(Log, "error");
            this.oSpaceContentService = new SpaceContent();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Sets the hash for an intent", function (assert) {
        // Act
        this.oSpaceContentService.launchTileTarget("#Action-toappnavsample");

        // Assert
        assert.strictEqual(this.oSetHashStub.args[0][0], "#Action-toappnavsample", "The correct hash was set");
    });

    QUnit.test("Starts a URL and logs a recent activity for it if recent activity logging is enabled", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/shell/enableRecentActivity").returns(true);
        this.oConfigLastStub.withArgs("/core/shell/enableRecentActivityLogging").returns(true);
        var oExpectedRecentActivity = {
            title: "SAP.com",
            appType: AppType.URL,
            url: "https://www.sap.com",
            appId: "https://www.sap.com"
        };

        // Act
        this.oSpaceContentService.launchTileTarget("https://www.sap.com", "SAP.com");

        // Assert
        assert.deepEqual(this.oRendererStub.logRecentActivity.args[0][0], oExpectedRecentActivity, "The recent activity was logged");
        assert.deepEqual(this.oOpenURLStub.args[0], ["https://www.sap.com", "_blank"], "The URL was opened");
    });

    QUnit.test("Starts a URL but does not log a recent activity for it if recent activity logging is disabled", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/shell/enableRecentActivity").returns(false);
        this.oConfigLastStub.withArgs("/core/shell/enableRecentActivityLogging").returns(false);

        // Act
        this.oSpaceContentService.launchTileTarget("https://www.sap.com", "SAP.com");

        // Assert
        assert.strictEqual(this.oRendererStub.logRecentActivity.callCount, 0, "The recent activity was not logged");
        assert.deepEqual(this.oOpenURLStub.args[0], ["https://www.sap.com", "_blank"], "The URL was opened");
    });

    QUnit.test("Starts a URL but does not log a recent activity for it if recent activity logging is enabled but no title is provided", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/shell/enableRecentActivity").returns(true);
        this.oConfigLastStub.withArgs("/core/shell/enableRecentActivityLogging").returns(true);

        // Act
        this.oSpaceContentService.launchTileTarget("https://www.sap.com");

        // Assert
        assert.strictEqual(this.oRendererStub.logRecentActivity.callCount, 0, "The recent activity was not logged");
        assert.deepEqual(this.oOpenURLStub.args[0], ["https://www.sap.com", "_blank"], "The URL was opened");
    });

    QUnit.test("Only accepts strings as target URL", function (assert) {
        // Arrange

        // Act
        this.oSpaceContentService.launchTileTarget({ url: "https://www.sap.com" });

        // Assert
        assert.strictEqual(this.oLogErrorStub.callCount, 1, "An error was logged");
        assert.strictEqual(this.oSetHashStub.callCount, 0, "The hash was not changed");
        assert.deepEqual(this.oOpenURLStub.callCount, 0, "The URL was not opened");
    });

    QUnit.module("getUserDefaultParameter", {
        beforeEach: function () {
            this.oSystemContextStub = {
                contentProviderId: "local"
            };
            this.oCSTRServiceStub = {
                getSystemContext: sandbox.stub().withArgs("").resolves(this.oSystemContextStub)
            };
            this.oUserDefaultsServiceStub = {
                getValue: sandbox.stub()
            };
            var oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
            oGetServiceAsyncStub.withArgs("ClientSideTargetResolution").resolves(this.oCSTRServiceStub);
            oGetServiceAsyncStub.withArgs("UserDefaultParameters").resolves(this.oUserDefaultsServiceStub);

            this.oSpaceContentService = new SpaceContent();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns a single value", function (assert) {
        // Arrange
        var oUserDefaultParameterValue = {
            value: "0001"
        };
        this.oUserDefaultsServiceStub.getValue.withArgs("companyCode", this.oSystemContextStub).resolves(oUserDefaultParameterValue);

        // Act
        return this.oSpaceContentService.getUserDefaultParameter("companyCode").then(function (oParameterValue) {
            // Assert
            assert.deepEqual(oParameterValue, { value: "0001" }, "The user default parameter was returned");
        });
    });

    QUnit.test("Returns an extended value", function (assert) {
        // Arrange
        var oUserDefaultParameterValue = {
            extendedValue: {
                Ranges: [
                    {
                        Low: "A*",
                        High: "Z*",
                        Option: "BT",
                        Sign: "I"
                    }
                ]
            }
        };
        this.oUserDefaultsServiceStub.getValue.withArgs("companyCode", this.oSystemContextStub).resolves(oUserDefaultParameterValue);

        // Act
        return this.oSpaceContentService.getUserDefaultParameter("companyCode").then(function (oParameterValue) {
            // Assert
            assert.deepEqual(oParameterValue, oUserDefaultParameterValue, "The user default parameter was returned");
        });
    });

    QUnit.test("Returns as single and an extended value", function (assert) {
        // Arrange
        var oUserDefaultParameterValue = {
            value: "0001",
            extendedValue: {
                Ranges: [
                    {
                        Low: "A*",
                        High: "Z*",
                        Option: "BT",
                        Sign: "I"
                    }
                ]
            }
        };
        this.oUserDefaultsServiceStub.getValue.withArgs("companyCode", this.oSystemContextStub).resolves(oUserDefaultParameterValue);

        // Act
        return this.oSpaceContentService.getUserDefaultParameter("companyCode").then(function (oParameterValue) {
            // Assert
            assert.deepEqual(oParameterValue, oUserDefaultParameterValue, "The user default parameter was returned");
        });
    });

    QUnit.test("Returns null if the user default parameter doesn't have a value", function (assert) {
        // Arrange
        this.oUserDefaultsServiceStub.getValue.withArgs("companyCode", this.oSystemContextStub).resolves({});

        // Act
        return this.oSpaceContentService.getUserDefaultParameter("companyCode").then(function (oParameterValue) {
            // Assert
            assert.deepEqual(oParameterValue, null, "Null was returned");
        });
    });

    QUnit.test("Rejects if getValue rejects", function (assert) {
        // Arrange
        this.oUserDefaultsServiceStub.getValue.withArgs("companyCode", this.oSystemContextStub).rejects("Error");

        // Act
        return this.oSpaceContentService.getUserDefaultParameter("companyCode")
            .then(function () {
                // Assert
                assert.ok(false, "The promise was rejected");
            })
            .catch(function () {
                // Assert
                assert.ok(true, "The promise was rejected");
            });
    });
});
