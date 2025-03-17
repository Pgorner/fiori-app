// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/* global QUnit, sinon */

/**
 * @file QUnit tests for sap.ushell.ui.footerbar.AboutDialog.controller
 */
sap.ui.define([
    "sap/ushell/ui/footerbar/AboutDialog.controller",
    "sap/ui/core/Fragment",
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/resources",
    "sap/ushell/Config",
    "sap/ui/Device",
    "sap/ushell/Container"
], function (
    AboutDialogController,
    Fragment,
    AppConfiguration,
    resources,
    Config,
    Device,
    Container
) {
    "use strict";

    var sandbox = sinon.createSandbox({});

    function aggregateEntries (aEntries) {
        return aEntries.reduce((oParams, oEntry) => {
            if (!oParams[oEntry.parameterName]) {
                oParams[oEntry.parameterName] = {};
            }

            oParams[oEntry.parameterName][oEntry.type] = oEntry.value;
            return oParams;
        }, {});
    }

    QUnit.module("The onClose function", {
        beforeEach: function (assert) {
            var done = assert.async();
            this.oController = new AboutDialogController();

            Fragment.load({
                id: "aboutDialogFragment",
                name: "sap.ushell.ui.footerbar.AboutDialog",
                type: "XML",
                controller: this.oController
            }).then(function (dialog) {
                this.oAboutDialog = dialog;
                sandbox.stub(this.oController, "_getDialog").returns(this.oAboutDialog);
            }.bind(this)).finally(done);

            sandbox.stub(this.oController, "_setupAboutDialogModel");
        },
        afterEach: function () {
            this.oController.destroy();
            if (this.oAboutDialog) {
                this.oAboutDialog.destroy();
            }
            sandbox.restore();
        }
    });

    QUnit.test("Calls the close function of the dialog.", function (assert) {
        // Arrange
        this.oDialogCloseSpy = sandbox.spy(this.oAboutDialog, "close");

        // Act
        this.oAboutDialog.open();

        // Assert
        assert.ok(Fragment.byId("aboutDialogFragment", "aboutDialog").isOpen(), "About Dialog was opened.");

        // Act
        this.oController.onClose();

        // Assert
        assert.strictEqual(this.oDialogCloseSpy.callCount, 1, "The close function of the dialog was called once.");
    });

    QUnit.module("The onAfterClose function", {
        beforeEach: function (assert) {
            var done = assert.async();
            this.oController = new AboutDialogController();

            Fragment.load({
                id: "aboutDialogFragment",
                name: "sap.ushell.ui.footerbar.AboutDialog",
                type: "XML",
                controller: this.oController
            }).then(function (dialog) {
                this.oAboutDialog = dialog;
                sandbox.stub(this.oController, "_getDialog").returns(this.oAboutDialog);
            }.bind(this)).finally(done);

            sandbox.stub(this.oController, "_setupAboutDialogModel");
        },
        afterEach: function () {
            this.oController.destroy();
            if (this.oAboutDialog) {
                this.oAboutDialog.destroy();
            }
            sandbox.restore();
        }
    });

    QUnit.test("Calls the destroy function of the dialog.", function (assert) {
        // Arrange
        this.oDialogDestroySpy = sandbox.spy(this.oAboutDialog, "destroy");

        // Act
        this.oAboutDialog.open();

        // Assert
        assert.ok(Fragment.byId("aboutDialogFragment", "aboutDialog").isOpen(), "About Dialog was opened.");

        // Act
        this.oController.onAfterClose();

        // Assert
        assert.strictEqual(this.oDialogDestroySpy.callCount, 1, "The destroy function of the dialog was called once.");
    });
    QUnit.module("Master Navigation Tests", {
        beforeEach: function () {
            this.oController = new AboutDialogController();

            this.oSplitAppStub = sinon.stub(this.oController, "_getSplitAppObj").returns({
                isMasterShown: sinon.stub().returns(true),
                backToTopMaster: sinon.stub(),
                showMaster: sinon.stub(),
                hideMaster: sinon.stub()
            });

            this.oController.oBackButton = {
                setVisible: sinon.stub()
            };
            this.oController.oMenuButton = {
                setVisible: sinon.stub(),
                setPressed: sinon.stub(),
                setTooltip: sinon.stub()
            };

            sinon.stub(Fragment, "byId").callsFake(function (sFragmentId, sElementId) {
                if (sElementId === "aboutDialogNavBackButton") {
                    return this.oController.oBackButton;
                } else if (sElementId === "aboutDialogMenuButton") {
                    return this.oController.oMenuButton;
                }
            }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
            Fragment.byId.restore();
        }
    });

    QUnit.test("onBeforeMasterOpen should call _updateHeaderButtonVisibility", function (assert) {
        var oUpdateHeaderSpy = sinon.spy(this.oController, "_updateHeaderButtonVisibility");

        this.oController.onBeforeMasterOpen();

        assert.ok(oUpdateHeaderSpy.calledOnce, "_updateHeaderButtonVisibility was called once");
        assert.ok(this.oController.oMenuButton.setVisible.called, "setVisible was called on oMenuButton");

        oUpdateHeaderSpy.restore();
    });

    QUnit.test("navigateBackToMaster should call backToTopMaster and _updateHeaderButtonVisibility", function (assert) {
        var oUpdateHeaderSpy = sinon.spy(this.oController, "_updateHeaderButtonVisibility");

        this.oController.navigateBackToMaster();

        assert.ok(this.oController._getSplitAppObj().backToTopMaster.calledOnce, "backToTopMaster was called once");
        assert.ok(oUpdateHeaderSpy.calledOnce, "_updateHeaderButtonVisibility was called once");

        oUpdateHeaderSpy.restore();
    });

    QUnit.test("navToggleButtonPressHandler should toggle master visibility and update header button visibility", function (assert) {
        var oUpdateHeaderSpy = sinon.spy(this.oController, "_updateHeaderButtonVisibility");

        this.oController.navToggleButtonPressHandler();

        assert.ok(this.oController._getSplitAppObj().hideMaster.calledOnce, "hideMaster was called once");
        assert.ok(oUpdateHeaderSpy.calledOnce, "_updateHeaderButtonVisibility was called once");

        this.oController._getSplitAppObj().isMasterShown.returns(false);

        this.oController.navToggleButtonPressHandler();

        assert.ok(this.oController._getSplitAppObj().showMaster.calledOnce, "showMaster was called once after state change");
        assert.ok(oUpdateHeaderSpy.calledTwice, "_updateHeaderButtonVisibility was called twice");

        oUpdateHeaderSpy.restore();
    });

    QUnit.test("_updateHeaderButtonVisibility should adjust visibility and properties of back and menu buttons", function (assert) {
        var oDeviceStub = sinon.stub(Device, "system").value({ phone: false });
        var oDeviceOrientationStub = sinon.stub(Device, "orientation").value({ portrait: true });

        this.oController._updateHeaderButtonVisibility();

        var bIsMasterShown = this.oController._getSplitAppObj().isMasterShown();

        assert.ok(this.oController.oMenuButton.setVisible.calledWith(true), "setVisible(true) was called on oMenuButton");
        assert.ok(this.oController.oMenuButton.setPressed.calledWith(bIsMasterShown), "setPressed was called with correct value on oMenuButton");

        oDeviceStub.restore();
        oDeviceOrientationStub.restore();
    });

    QUnit.module("The onBeforeOpen function", {
        beforeEach: function (assert) {
            var done = assert.async();
            this.oController = new AboutDialogController();
            sandbox.stub(this.oController, "_setupAppInfoModel").returns(Promise.resolve());

            this.oGetProductNameStub = sandbox.stub();
            this.oGetProductVersionStub = sandbox.stub();
            this.oGetSystemNameStub = sandbox.stub();
            this.oGetSystemRoleStub = sandbox.stub();
            this.oGetTenantRoleStub = sandbox.stub();
            this.oGetContentDensityStub = sandbox.stub();
            this.oGetThemeStub = sandbox.stub();
            this.oGetUserStub = sandbox.stub(Container, "getUser").returns({
                getContentDensity: this.oGetContentDensityStub,
                getTheme: this.oGetThemeStub
            });
            this.oGetLogonSystemStub = sandbox.stub(Container, "getLogonSystem").returns({
                getProductName: this.oGetProductNameStub,
                getProductVersion: this.oGetProductVersionStub,
                getSystemName: this.oGetSystemNameStub,
                getSystemRole: this.oGetSystemRoleStub,
                getTenantRole: this.oGetTenantRoleStub
            });

            Fragment.load({
                id: "aboutDialogFragment",
                name: "sap.ushell.ui.footerbar.AboutDialog",
                type: "XML",
                controller: this.oController
            }).then(function (dialog) {
                this.oAboutDialog = dialog;
            }.bind(this)).finally(done);
        },
        afterEach: function () {
            this.oController.destroy();
            if (this.oAboutDialog) {
                this.oAboutDialog.destroy();
            }
            delete Device.support.touch;
            delete Device.system.phone;
            delete Device.system.tablet;
            delete Device.system.desktop;
            delete Device.system.combi;
            sandbox.restore();
        }
    });

    QUnit.test("Sets up the model for the About Dialog by calling the _setupAboutDialogModel function.", function (assert) {
        // Arrange
        this.oSetupAboutDialogModelSpy = sandbox.spy(this.oController, "_setupAboutDialogModel");

        // Act
        this.oController.onBeforeOpen();

        // Assert
        assert.strictEqual(this.oSetupAboutDialogModelSpy.callCount, 1, "The _setupAboutDialogModel function was called once.");
    });

    QUnit.test("Sets up the correct SysInfo properties in case no system information was returned.", function (assert) {
        // Act
        this.oController.onBeforeOpen();

        // Assert
        const aEntries = this.oAboutDialog.getModel("SysInfo").getProperty("/entries");
        const oValues = aggregateEntries(aEntries);
        assert.strictEqual(oValues.tenantRole, undefined, "The tenantRole property was setup correctly.");
        assert.strictEqual(oValues.systemName, undefined, "The systemName property was setup correctly.");
        assert.strictEqual(oValues.systemRole, undefined, "The systemName property was setup correctly.");
        assert.strictEqual(oValues.productName, undefined, "The productName property was setup correctly.");
        assert.strictEqual(oValues.productVersion, undefined, "The productVersion property was setup correctly.");
    });

    QUnit.test("Sets up the correct SysInfo properties in case system information was returned.", function (assert) {
        // Arrange
        this.oGetProductNameStub.returns("MOCK_PRODUCT_NAME");
        this.oGetProductVersionStub.returns("MOCK_PRODUCT_VERSION");
        this.oGetSystemNameStub.returns("MOCK_SYSTEM_NAME");
        this.oGetSystemRoleStub.returns("MOCK_SYSTEM_ROLE");
        this.oGetTenantRoleStub.returns("MOCK_TENANT_ROLE");

        // Act
        this.oController.onBeforeOpen();

        // Assert
        const aEntries = this.oAboutDialog.getModel("SysInfo").getProperty("/entries");
        const oValues = aggregateEntries(aEntries);
        assert.deepEqual(oValues.productName, { label: "{i18n>productName}", text: "MOCK_PRODUCT_NAME" }, "The productName property was setup correctly.");
        assert.deepEqual(oValues.productVersion, { label: "{i18n>productVersionFld}", text: "MOCK_PRODUCT_VERSION" }, "The productVersion property was setup correctly.");
        assert.deepEqual(oValues.systemName, { label: "{i18n>systemName}", text: "MOCK_SYSTEM_NAME" }, "The systemName property was setup correctly.");
        assert.deepEqual(oValues.systemRole, { label: "{i18n>systemRole}", text: "MOCK_SYSTEM_ROLE" }, "The systemRole property was setup correctly.");
        assert.deepEqual(oValues.tenantRole, { label: "{i18n>tenantRole}", text: "MOCK_TENANT_ROLE" }, "The tenantRole property was setup correctly.");
    });

    QUnit.test("Sets up the correct UserEnvInfo properties.", function (assert) {
        // Arrange
        this.oGetThemeStub.returns("MOCK_THEME");
        this.oGetContentDensityStub.returns("MOCK_CONTENT_DENSITY");
        Device.support.touch = false;
        Device.system.phone = false;
        Device.system.tablet = false;
        Device.system.desktop = false;
        Device.system.combi = false;

        // Act
        this.oController.onBeforeOpen();

        // Assert
        const aEntries = this.oAboutDialog.getModel("UserEnvInfo").getProperty("/entries");
        const oValues = aggregateEntries(aEntries);
        assert.deepEqual(oValues.userAgentFld, { label: "{i18n>userAgentFld}", text: navigator.userAgent }, "The userAgent property was setup correctly.");
        assert.deepEqual(oValues.activeTheme, { label: "{i18n>activeTheme}", text: "MOCK_THEME" }, "The activeTheme property was setup correctly.");
        assert.deepEqual(oValues.optimizedForTouch, { label: "{i18n>AppearanceContentDensityLabel}", text: "{i18n>no}" }, "The optimizedForTouch property was setup correctly.");
        assert.deepEqual(oValues.touchSupported, { label: "{i18n>touchSupported}", text: "{i18n>no}" }, "The touchSupported property was setup correctly.");
        assert.deepEqual(oValues.deviceType, undefined, "The deviceType property was setup correctly.");
    });

    QUnit.test("Sets up the correct device-related UserEnvInfo properties for a desktop device.", function (assert) {
        // Arrange
        Device.support.touch = false;
        Device.system.phone = false;
        Device.system.tablet = false;
        Device.system.desktop = true;
        Device.system.combi = false;

        // Act
        this.oController.onBeforeOpen();

        // Assert
        const aEntries = this.oAboutDialog.getModel("UserEnvInfo").getProperty("/entries");
        const oValues = aggregateEntries(aEntries);
        assert.deepEqual(oValues.optimizedForTouch, { label: "{i18n>AppearanceContentDensityLabel}", text: "{i18n>no}" }, "The optimizedForTouch property was setup correctly.");
        assert.deepEqual(oValues.touchSupported, { label: "{i18n>touchSupported}", text: "{i18n>no}" }, "The touchSupported property was setup correctly.");
        assert.deepEqual(oValues.deviceType, { label: "{i18n>deviceType}", text: "{i18n>configuration.form_factor_desktop}" }, "The deviceType property was setup correctly.");
    });

    QUnit.test("Sets up the correct device-related UserEnvInfo properties for a phone with content density \"cozy\".", function (assert) {
        // Arrange
        Device.support.touch = true;
        Device.system.phone = true;
        Device.system.tablet = false;
        Device.system.desktop = false;
        Device.system.combi = false;
        this.oGetContentDensityStub.returns("cozy");

        // Act
        this.oController.onBeforeOpen();

        // Assert
        const aEntries = this.oAboutDialog.getModel("UserEnvInfo").getProperty("/entries");
        const oValues = aggregateEntries(aEntries);
        assert.deepEqual(oValues.optimizedForTouch, { label: "{i18n>AppearanceContentDensityLabel}", text: "{i18n>yes}" }, "The optimizedForTouch property was setup correctly.");
        assert.deepEqual(oValues.touchSupported, { label: "{i18n>touchSupported}", text: "{i18n>yes}" }, "The touchSupported property was setup correctly.");
        assert.deepEqual(oValues.deviceType, { label: "{i18n>deviceType}", text: "{i18n>configuration.form_factor_phone}" }, "The deviceType property was setup correctly.");
    });

    QUnit.test("Sets up the correct device-related UserEnvInfo properties for a tablet with content density \"compact\".", function (assert) {
        // Arrange
        Device.support.touch = true;
        Device.system.phone = false;
        Device.system.tablet = true;
        Device.system.desktop = false;
        Device.system.combi = false;
        this.oGetContentDensityStub.returns("compact");

        // Act
        this.oController.onBeforeOpen();

        // Assert
        const aEntries = this.oAboutDialog.getModel("UserEnvInfo").getProperty("/entries");
        const oValues = aggregateEntries(aEntries);
        assert.deepEqual(oValues.optimizedForTouch, { label: "{i18n>AppearanceContentDensityLabel}", text: "{i18n>no}" }, "The optimizedForTouch property was setup correctly.");
        assert.deepEqual(oValues.touchSupported, { label: "{i18n>touchSupported}", text: "{i18n>yes}" }, "The touchSupported property was setup correctly.");
        assert.deepEqual(oValues.deviceType, { label: "{i18n>deviceType}", text: "{i18n>configuration.form_factor_tablet}" }, "The deviceType property was setup correctly.");
    });

    QUnit.test("Sets up the correct device-related UserEnvInfo properties for a desktop combi device with content density \"compact\".", function (assert) {
        // Arrange
        Device.support.touch = true;
        Device.system.phone = false;
        Device.system.tablet = false;
        Device.system.desktop = true;
        Device.system.combi = true;
        this.oGetContentDensityStub.returns("compact");

        // Act
        this.oController.onBeforeOpen();

        // Assert
        const aEntries = this.oAboutDialog.getModel("UserEnvInfo").getProperty("/entries");
        const oValues = aggregateEntries(aEntries);
        assert.deepEqual(oValues.optimizedForTouch, { label: "{i18n>AppearanceContentDensityLabel}", text: "{i18n>no}" }, "The optimizedForTouch property was setup correctly.");
        assert.deepEqual(oValues.touchSupported, { label: "{i18n>touchSupported}", text: "{i18n>yes}" }, "The touchSupported property was setup correctly.");
        assert.deepEqual(oValues.deviceType, { label: "{i18n>deviceType}", text: "{i18n>configuration.form_factor_combi}" }, "The deviceType property was setup correctly.");
    });

    QUnit.module("The _setupAppInfoModel function", {
        beforeEach: function (assert) {
            var done = assert.async();
            this.oController = new AboutDialogController();
            sandbox.stub(this.oController, "_getSystemInformation");

            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
            this.oCurrentApplicationMock = {
                getAllAppInfo: function (bValues) {
                    const aParameters = [
                        "appId",
                        "appVersion",
                        "appSupportInfo",
                        "technicalAppComponentId",
                        "appFrameworkId",
                        "appFrameworkVersion"
                    ];

                    return aParameters.reduce((oParams, sParameterName) => {
                        if (bValues) {
                            oParams[sParameterName] = `MOCK_${sParameterName}`;
                        } else {
                            oParams[sParameterName] = { value: `MOCK_${sParameterName}` };
                        }
                        return oParams;
                    }, {});
                }
            };
            this.oGetServiceAsyncStub.withArgs("AppLifeCycle").resolves({
                getCurrentApplication: sandbox.stub().returns(this.oCurrentApplicationMock)
            });

            sandbox.stub(AppConfiguration, "getMetadata").returns({ title: "MOCK_title" });

            Fragment.load({
                id: "aboutDialogFragment",
                name: "sap.ushell.ui.footerbar.AboutDialog",
                type: "XML",
                controller: this.oController
            }).then(function (dialog) {
                this.oAboutDialog = dialog;
            }.bind(this)).finally(done);
        },
        afterEach: function () {
            this.oController.destroy();
            if (this.oAboutDialog) {
                this.oAboutDialog.destroy();
            }
            sandbox.restore();
        }
    });

    QUnit.test("Sets up the AppInfo model in case the content provider info cannot be shown.", function (assert) {
        // Arrange
        var done = assert.async();
        assert.expect(7);
        Config.emit("/core/contentProviders/providerInfo/enabled", false);
        var oExpectedAppId = {
            label: "{i18n>appId}",
            text: "MOCK_appId"
        };
        var oExpectedAppVersion = {
            label: "{i18n>appVersion}",
            text: "MOCK_appVersion"
        };
        var oExpectedAppSupportInfo = {
            label: "{i18n>appSupportInfo}",
            text: "MOCK_appSupportInfo"
        };
        var oExpectedTechnicalAppComponentId = {
            label: "{i18n>technicalAppComponentId}",
            text: "MOCK_technicalAppComponentId"
        };
        var oExpectedAppFrameworkId = {
            label: "{i18n>appFrameworkId}",
            text: "MOCK_appFrameworkId"
        };
        var oExpectedAppFrameworkVersion = {
            label: "{i18n>appFrameworkVersion}",
            text: "MOCK_appFrameworkVersion"
        };

        // Act
        this.oController._setupAppInfoModel().then(function () {
            // Assert
            const aEntries = this.oAboutDialog.getModel("AppInfo").getProperty("/entries");
            const oValues = aggregateEntries(aEntries);
            assert.deepEqual(oValues.appId, oExpectedAppId, "The appId property is setup correctly.");
            assert.deepEqual(oValues.appVersion, oExpectedAppVersion, "The appVersion property is setup correctly.");
            assert.deepEqual(oValues.appSupportInfo, oExpectedAppSupportInfo, "The appSupportInfo property is setup correctly.");
            assert.deepEqual(oValues.technicalAppComponentId, oExpectedTechnicalAppComponentId, "The appComponentId property is setup correctly.");
            assert.deepEqual(oValues.appFrameworkId, oExpectedAppFrameworkId, "The appFrameworkId property is setup correctly.");
            assert.deepEqual(oValues.appFrameworkVersion, oExpectedAppFrameworkVersion, "The appFrameworkVersion property is setup correctly.");
            assert.deepEqual(oValues.contentProviderLabel, undefined, "The contentProviderLabel property is setup correctly.");
        }.bind(this)).finally(done);
    });

    QUnit.test("Sets up the AppInfo model in case the content provider info can be shown.", function (assert) {
        // Arrange
        var done = assert.async();
        assert.expect(7);
        Config.emit("/core/contentProviders/providerInfo/enabled", true);
        this.oCurrentApplicationMock.getSystemContext = sandbox.stub().resolves({ label: "MOCK_contentProviderLabel" });
        var oExpectedAppId = {
            label: "{i18n>appId}",
            text: "MOCK_appId"
        };
        var oExpectedAppVersion = {
            label: "{i18n>appVersion}",
            text: "MOCK_appVersion"
        };
        var oExpectedAppSupportInfo = {
            label: "{i18n>appSupportInfo}",
            text: "MOCK_appSupportInfo"
        };
        var oExpectedTechnicalAppComponentId = {
            label: "{i18n>technicalAppComponentId}",
            text: "MOCK_technicalAppComponentId"
        };
        var oExpectedAppFrameworkId = {
            label: "{i18n>appFrameworkId}",
            text: "MOCK_appFrameworkId"
        };
        var oExpectedAppFrameworkVersion = {
            label: "{i18n>appFrameworkVersion}",
            text: "MOCK_appFrameworkVersion"
        };
        var oExpectedContentProviderLabel = {
            label: "{i18n>contentProviderLabel}",
            text: "MOCK_contentProviderLabel"
        };

        // Act
        this.oController._setupAppInfoModel().then(function () {
            // Assert
            const aEntries = this.oAboutDialog.getModel("AppInfo").getProperty("/entries");
            const oValues = aggregateEntries(aEntries);
            assert.deepEqual(oValues.appId, oExpectedAppId, "The appId property is setup correctly.");
            assert.deepEqual(oValues.appVersion, oExpectedAppVersion, "The appVersion property is setup correctly.");
            assert.deepEqual(oValues.appSupportInfo, oExpectedAppSupportInfo, "The appSupportInfo property is setup correctly.");
            assert.deepEqual(oValues.technicalAppComponentId, oExpectedTechnicalAppComponentId, "The appComponentId property is setup correctly.");
            assert.deepEqual(oValues.appFrameworkId, oExpectedAppFrameworkId, "The appFrameworkId property is setup correctly.");
            assert.deepEqual(oValues.appFrameworkVersion, oExpectedAppFrameworkVersion, "The appFrameworkVersion property is setup correctly.");
            assert.deepEqual(oValues.contentProviderLabel, oExpectedContentProviderLabel, "The contentProviderLabel property is setup correctly.");
        }.bind(this)).finally(done);
    });

    QUnit.test("Application title from PostMessage API title.", async function (assert) {
        const oParametersMap = {
            title: "MOCK_title",
            appTitle: "MOCK_appTitle"
        };
        this.oCurrentApplicationMock.getAllAppInfo = sandbox.stub().callsFake((bValues) => {
            if (bValues) {
                return oParametersMap;
            }
            return {
                title: { value: oParametersMap.title },
                appTitle: { value: oParametersMap.appTitle }
            };
        });
        this.oCurrentApplicationMock.getSystemContext = sandbox.stub().resolves({ label: "MOCK_contentProviderLabel" });
        const oExpectedAppTitle = {
            label: "{i18n>appTitle}",
            text: oParametersMap.title
        };

        await this.oController._setupAppInfoModel();
        const aEntries = this.oAboutDialog.getModel("AppInfo").getProperty("/entries");
        const oAppTitleData = aggregateEntries(aEntries).appTitle;
        assert.deepEqual(oAppTitleData, oExpectedAppTitle, "The appTitle property is taken from title.");
    });

    QUnit.test("Application title from PostMessage API appTitle.", async function (assert) {
        const oParametersMap = {
            appTitle: "MOCK_appTitle"
        };
        this.oCurrentApplicationMock.getAllAppInfo = sandbox.stub().callsFake((bValues) => {
            if (bValues) {
                return oParametersMap;
            }
            return {
                appTitle: { value: oParametersMap.appTitle }
            };
        });
        this.oCurrentApplicationMock.getSystemContext = sandbox.stub().resolves({ label: "MOCK_contentProviderLabel" });
        const oExpectedAppTitle = {
            label: "{i18n>appTitle}",
            text: oParametersMap.appTitle
        };

        await this.oController._setupAppInfoModel();
        const aEntries = this.oAboutDialog.getModel("AppInfo").getProperty("/entries");
        const oAppTitleData = aggregateEntries(aEntries).appTitle;
        assert.deepEqual(oAppTitleData, oExpectedAppTitle, "The appTitle property is taken from appTitle.");
    });

    QUnit.module("The calculateNumberOfColumns function", {
        beforeEach: function () {
            this.oController = new AboutDialogController();
        },
        afterEach: function () {
            this.oController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Returns 1 in case the given object is undefined.", function (assert) {
        assert.strictEqual(
            this.oController.calculateNumberOfColumns(undefined),
            1,
            "Returns 1 in case the passed argument is undefined."
        );
    });

    QUnit.test("Returns 1 in case the given object has less than two properties.", function (assert) {
        assert.strictEqual(
            this.oController.calculateNumberOfColumns({}),
            1,
            "Returns 1 in case the passed argument is an empty object."
        );
        assert.strictEqual(
            this.oController.calculateNumberOfColumns({ test: "TEST" }),
            1,
            "Returns 1 in case the passed object has one property."
        );
    });

    QUnit.test("Returns 2 in case the given object has at least two properties.", function (assert) {
        assert.strictEqual(
            this.oController.calculateNumberOfColumns({ test0: "TEST", test1: "TEST" }),
            2,
            "Returns 2 in case the passed object has two properties."
        );
        assert.strictEqual(
            this.oController.calculateNumberOfColumns({ test0: "TEST", test1: "TEST", test2: "TEST" }),
            2,
            "Returns 2 in case the passed object has three properties."
        );
    });

    QUnit.module("The isFormVisible function", {
        beforeEach: function () {
            this.oController = new AboutDialogController();
        },
        afterEach: function () {
            this.oController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Returns false in case the given object is empty.", function (assert) {
        assert.strictEqual(
            this.oController.isFormVisible({}),
            false,
            "Returns false in case the passed object is empty."
        );
    });

    QUnit.test("Returns false in case the given object is undefined.", function (assert) {
        assert.strictEqual(
            this.oController.isFormVisible(undefined),
            false,
            "Returns false in case the passed argument is undefined."
        );
    });

    QUnit.test("Returns true in case the given object has at least one property.", function (assert) {
        assert.strictEqual(
            this.oController.isFormVisible({ test0: "TEST" }),
            true,
            "Returns true in case the passed object has one property."
        );
    });
});
