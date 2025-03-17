// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/ApplicationType/urlTemplateResolution",
    "sap/ushell/Container",
    "sap/ushell/Config"
], function (
    urlTemplateResolution,
    Container,
    Config
) {
    "use strict";

    /* global QUnit sinon */

    const sandbox = sinon.createSandbox({});

    QUnit.module("The function _createEnv", {
        beforeEach: () => {
            const oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            oGetServiceAsyncStub.withArgs("UserInfo").resolves({
                getUser: sandbox.stub().returns({
                    getContentDensity: () => "compact",
                    getTheme: sandbox.stub().returns("sap_horizon")
                })
            });

            oGetServiceAsyncStub.withArgs("PluginManager").resolves({
                _getNamesOfPluginsWithAgents: sandbox.stub().returns([])
            });
        },
        afterEach: () => {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the enableShellPersonalization config", async (assert) => {
        //Arrange
        sandbox.stub(Config, "last").withArgs("/core/shell/enablePersonalization").returns(true);

        //Act
        const oEnv = await urlTemplateResolution._createEnv();

        //Assert
        assert.strictEqual(oEnv.enableShellPersonalization, true, "The enableShellPersonalization config is returned correctly");
    });

    QUnit.module("The function _addLanguageToURLTemplateResult", {
        beforeEach: function () {
            this.oResult = {
                url: ""
            };
            this.oSiteAppSection = {
                "sap.integration": {
                    urlTemplateId: ""
                }
            };
            this.oRuntime = {
                env: {
                    language: "EN"
                }
            };
        }
    });

    QUnit.test("Adds the parameter sap-language to WCF app URLs", function (assert) {
        //Arrange
        this.oResult.url = "https://abap.server/sap/bc/bsp/sap/crm_ui_start/default.htm";
        this.oSiteAppSection["sap.integration"].urlTemplateId = "urltemplate.url-dynamic";
        const sExpectedURL = "https://abap.server/sap/bc/bsp/sap/crm_ui_start/default.htm?sap-language=EN";

        //Act
        urlTemplateResolution._addLanguageToURLTemplateResult(this.oResult, this.oSiteAppSection, this.oRuntime);

        //Assert
        assert.strictEqual(this.oResult.url, sExpectedURL, "The sap-language parameter was added");
    });

    QUnit.test("Doesn't add the parameter sap-language to other URL templates", function (assert) {
        //Arrange
        this.oResult.url = "https://abap.server/sap/bc/bsp/sap/crm_ui_start/default.htm";
        this.oSiteAppSection["sap.integration"].urlTemplateId = "urltemplate.fiori";
        const sExpectedURL = "https://abap.server/sap/bc/bsp/sap/crm_ui_start/default.htm";

        //Act
        urlTemplateResolution._addLanguageToURLTemplateResult(this.oResult, this.oSiteAppSection, this.oRuntime);

        //Assert
        assert.strictEqual(this.oResult.url, sExpectedURL, "The sap-language parameter was not added");
    });

    QUnit.test("Doesn't add the parameter sap-language to other URLs for the same URL template", function (assert) {
        //Arrange
        this.oResult.url = "https://some.server/custom/path/";
        this.oSiteAppSection["sap.integration"].urlTemplateId = "urltemplate.url-dynamic";
        const sExpectedURL = "https://some.server/custom/path/";

        //Act
        urlTemplateResolution._addLanguageToURLTemplateResult(this.oResult, this.oSiteAppSection, this.oRuntime);

        //Assert
        assert.strictEqual(this.oResult.url, sExpectedURL, "The sap-language parameter was not added");
    });

    QUnit.test("Doesn't add the parameter sap-language to WCF app URLs a second time", function (assert) {
        //Arrange
        this.oResult.url = "https://abap.server/sap/bc/bsp/sap/crm_ui_start/default.htm?sap-language=EN";
        this.oSiteAppSection["sap.integration"].urlTemplateId = "urltemplate.url-dynamic";
        const sExpectedURL = "https://abap.server/sap/bc/bsp/sap/crm_ui_start/default.htm?sap-language=EN";

        //Act
        urlTemplateResolution._addLanguageToURLTemplateResult(this.oResult, this.oSiteAppSection, this.oRuntime);

        //Assert
        assert.strictEqual(this.oResult.url, sExpectedURL, "The sap-language parameter was not added");
    });
});
