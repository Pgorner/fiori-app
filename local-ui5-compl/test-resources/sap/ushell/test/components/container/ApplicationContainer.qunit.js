// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for components/container/ApplicationContainer.js
 */
sap.ui.define([
    "sap/base/Log",
    "sap/base/util/deepExtend",
    "sap/base/util/ObjectPath",
    "sap/ui/base/Event",
    "sap/ui/core/Component",
    "sap/ui/core/Control",
    "sap/ui/core/Core",
    "sap/ui/core/EventBus",
    "sap/ui/core/Icon",
    "sap/ui/core/Supportability",
    "sap/ui/core/mvc/View",
    "sap/ui/core/RenderManager",
    "sap/ui/thirdparty/hasher", // required for "window.hasher"
    "sap/ui/thirdparty/jquery",
    "sap/ui/thirdparty/URI",
    "sap/ushell/ApplicationType",
    "sap/ushell/components/applicationIntegration/application/Application",
    "sap/ushell/components/applicationIntegration/application/BlueBoxHandler",
    "sap/ushell/components/applicationIntegration/application/PostMessageUtils",
    "sap/ushell/components/container/ApplicationContainer",
    "sap/ushell/components/container/IframePOSTUtils",
    "sap/ushell/services/Navigation/compatibility",
    "sap/ushell/Config",
    "sap/ushell/Container",
    "sap/ushell/test/utils",
    "sap/ushell/User",
    "sap/ushell/utils",
    "sap/ui/VersionInfo",
    "sap/ushell/ApplicationType/systemAlias"
], function (
    Log,
    deepExtend,
    ObjectPath,
    Event,
    Component,
    Control,
    Core,
    EventBus,
    Icon,
    Supportability,
    View,
    RenderManager,
    hasher,
    jQuery,
    URI,
    ApplicationType,
    Application,
    BlueBoxHandler,
    PostMessageUtils,
    ApplicationContainer,
    IframePOSTUtils,
    navigationCompatibility,
    Config,
    Container,
    testUtils,
    User,
    utils,
    VersionInfo,
    systemAlias
) {
    "use strict";

    /* global sinon, QUnit */

    var sandbox = sinon.createSandbox({});

    var A_ALL_APPLICATION_TYPES = Object.keys(ApplicationType.enum).map(function (sKey) {
        return ApplicationType.enum[sKey];
    });
    var aEmbeddableApplicationTypes = A_ALL_APPLICATION_TYPES.filter(function (sApplicationType) {
        return utils.isApplicationTypeEmbeddedInIframe(sApplicationType);
    });

    var oTestComponent,
        sPREFIX = "sap.ushell.components.container",
        sCONTAINER = sPREFIX + ".ApplicationContainer",
        sTESTURL = window.location.origin + "/a/b/c",
        oMessageTemplate = {
            data: {
                type: "request",
                service: "sap.ushell.services.CrossApplicationNavigation.unknownService",
                request_id: "generic_id",
                body: {}
            },
            origin: "http://our.origin:12345",
            source: { postMessage: "replace_me_with_a_spy" }
        },
        oFakeError = { message: "Post Message Fake Error" },
        oAppContainer,
        sIFRAME_FEATURE_POLICY = "autoplay;battery;camera;display-capture;geolocation;gyroscope;magnetometer;microphone;midi;clipboard-write;clipboard-read;fullscreen;";

    /**
     * Creates an object which can be used for the ApplicationContainer's application property.
     *
     * @param {string} [oProperties.text] the return value for getText().
     * @param {string} [oProperties.type] the return value for getType().
     * @param {string} [oProperties.url] the return value for getUrl().
     * @param {boolean} [oProperties.resolvable] the return value for isResolvable().
     *   If <code>true</code>, the object's function <code>resolve()</code> must be stubbed.
     * @returns the application object.
     */
    function getApplication (oProperties) {
        oProperties = oProperties || {};
        return {
            getText: function () { return oProperties.text; },
            getType: function () { return oProperties.type; },
            getUrl: function () { return oProperties.url; },
            isFolder: function () { return false; },
            isResolvable: function () { return oProperties.resolvable; },
            resolve: function () { throw new Error("resolve must be stubbed"); },
            getMenu: function () {
                return {
                    getDefaultErrorHandler: function () {
                        return oProperties.errorHandler;
                    }
                };
            }
        };
    }

    /**
     * Renders the container and expects that the internal render() is called with the given arguments.
     *
     * @param {sap.ushell.components.container.ApplicationContainer} oContainer the container.
     * @param {ApplicationType.enum} oApplicationType the expected applicationType.
     * @param {string} sUrl the expected URL.
     * @param {string} sAdditionalInformation the expected additional information.
     */
    function renderAndExpect (assert, oContainer, oApplicationType, sUrl, sAdditionalInformation) {
        var oRenderManager = new RenderManager();

        sandbox.stub(ApplicationContainer.prototype, "_render");

        oRenderManager.render(oContainer, document.createElement("DIV"));

        // ok(oContainer._render.calledWith(
        //     oRenderManager.getRendererInterface(),
        //     oContainer,
        //     oApplicationType,
        //     sUrl,
        //     sAdditionalInformation
        // ));

        assert.strictEqual(oContainer._render.args[0].length, 5);
        assert.strictEqual(oContainer._render.args[0][1], oContainer);
        assert.strictEqual(oContainer._render.args[0][2], oApplicationType);
        assert.strictEqual(oContainer._render.args[0][3], sUrl);
        assert.strictEqual(oContainer._render.args[0][4], sAdditionalInformation);
    }

    /**
     * Mocks Ushell Container.
     */
    function mockSapUshellContainer (oArgs) {
        function setFakeFunction (sName) {
            if (!oArgs.hasOwnProperty(sName)) {
                sandbox.stub(Container, sName);
            }
        }

        oArgs = oArgs || {};

        sandbox.stub(Container, "getUser").returns({
            getTheme: sandbox.stub().returns("SAP_TEST_THEME"),
            getAccessibilityMode: sandbox.stub()
        });
        setFakeFunction("attachLogoutEvent");
        setFakeFunction("detachLogoutEvent");
        setFakeFunction("addRemoteSystem");
        setFakeFunction("_isLocalSystem");
        setFakeFunction("getLogonSystem");

        sandbox.stub(Container, "getServiceAsync").callsFake(function (sServiceName) {
            return new Promise(function (fnResolve, fnReject) {
                if (oArgs.services && oArgs.services[sServiceName]) {
                    fnResolve(oArgs.services[sServiceName]);
                    return;
                }
                fnReject("ERROR: service stub for " + sServiceName + " was not provided in the test. Please add /services/" + sServiceName + " to mockSapUshellContainer arguments.");
            });
        });

        sandbox.stub(Container, "getFLPUrl").returns(window.location.href);
    }

    /**
     * Renders an iframe via the _render method in the given container.
     *
     * @param {object} oContainer the container to call _render on.
     * @param {object} oPrepareEnv an environment useful for calling <code>#renderInternally</code>.
     *   It's an object containing instances like:
     *   {
     *     renderManager: <instance>,
     *     rendererInterface: <instance>
     *   }
     * @param {string} sUrl the url property of the container.
     * @param {string} sApplicationType the application type.
     * @returns {object} a DIV node containing the rendered iFrame.
     */
    function renderInternally (oContainer, bUpdateDOM) {
        // the div is not attached to the "real" DOM and therefore is standalone and not rendered
        var oTargetNode = document.createElement("DIV");
        if (bUpdateDOM === true) {
            document.body.appendChild(oTargetNode);
        }

        oGlobalRM.render(oContainer, oTargetNode);

        return oTargetNode;
    }

    /**
     * Prepares the environment for a call to renderInternally.
     *
     * @param {sap.ushell.components.container.ApplicationContainer} oContainer the container.
     * @param {string} sUrl the application URL.
     * @param {object} [oMockConfigOverrides] optional overrides for the mock configuration(see code).
     *   This is an object containing paths to override like:
     *   <pre>
     *   {
     *     "/appContainer/fnGetFrameSource" : function () { ... },
     *     "/other/override": 123",
     *     ...
     *   }
     *   </pre>
     * @returns {object} An environment useful for calling <code>#renderInternally</code>.
     *   It's an object containing instances like:
     *   {
     *     renderManager: <instance>,
     *     rendererInterface: <instance>
     *   }
     */
    function prepareRenderInternally (oContainer, sUrl, oMockConfigOverrides, bSpyGetFrameSource) {
        var oMockConfig;

        oMockConfigOverrides = oMockConfigOverrides || {};
        oMockConfig = testUtils.overrideObject({
            //appContainer: { fnGetFrameSource: sandbox.stub().returns(sUrl) },
            utils: { bStubLocalStorageSetItem: true }
        }, oMockConfigOverrides);

        if (oMockConfig.utils.bStubLocalStorageSetItem) {
            sandbox.stub(utils, "localStorageSetItem");
        }

        // Arrange Renderer instance
        //sandbox.spy(oGlobalRMInterface, "accessibilityState");

        //oContainer.getFrameSource = oMockConfig.appContainer.fnGetFrameSource;
        if (bSpyGetFrameSource === undefined || bSpyGetFrameSource === true) {
            sandbox.spy(oContainer, "getFrameSource");
        }
        oContainer.addStyleClass("myClass1");

        sandbox.spy(oAppContainer.__proto__, "_adjustNwbcUrl");
        sandbox.spy(utils, "filterOutParamsFromLegacyAppURL");
        sandbox.spy(IframePOSTUtils, "generateRootElementForIFrame");
        sandbox.spy(IframePOSTUtils, "buildHTMLElements");
    }

    /**
     * Call the render() function and check that an IFrame is rendered for the given URL.
     *
     * @param {sap.ushell.components.container.ApplicationContainer} oContainer the container.
     * @param {ApplicationType.enum} sApplicationType the application type.
     * @param {string} sUrl the application URL.
     * @param {object} [oMockConfigOverrides] optional overrides for the mock configuration(see code).
     *   This is an object containing paths to override like:
     *   <pre>
     *   {
     *     "/appContainer/fnGetFrameSource" : function () { ... },
     *     "/other/override": 123",
     *     ...
     *   }
     *   </pre>
     * @param {boolean} [bIframeWithPost] the ifarme was rendered with post method and not get
     * @returns {object} the rendered iFrame if any or undefined.
     */
    function renderInternallyAndExpectIFrame (assert, oContainer, sApplicationType, sUrl, oMockConfigOverrides, bIframeWithPost, bAllowPolicyRendered, bSpyGetFrameSource, bUpdateDOM) {
        // Arrange
        prepareRenderInternally(oContainer, sUrl, oMockConfigOverrides, bSpyGetFrameSource);

        // Act
        var oTargetNode = renderInternally(oContainer, bUpdateDOM);

        // Assert
        testIFrameRendered(assert, oTargetNode, oContainer, sApplicationType, sUrl, bIframeWithPost, bAllowPolicyRendered);

        return oTargetNode;
    }

    /**
     * Tests that the iFrame was rendered after calling _render.
     *
     * @param {object} oTargetNode The target node.
     * @param {object} oPrepareEnv The prepare env.
     * @param {object} oContainer The container.
     * @param {string} sApplicationType The application type.
     * @param {string} sUrl The url.
     * @param {boolean} bIframeWithPost the ifarme was rendered with post method and not get
     */
    function testIFrameRendered (assert, oTargetNode, oContainer, sApplicationType, sUrl, bIframeWithPost, bAllowPolicyRendered) {
        var oIframe;

        if (bIframeWithPost === undefined) {
            bIframeWithPost = false;
        }
        if (!oTargetNode || !oTargetNode.childNodes || oTargetNode.childNodes.length !== 1) {
            assert.ok(false, "target node was not rendered as expected");
            return;
        }

        assert.strictEqual(oTargetNode.childNodes.length, 1);
        if (bIframeWithPost === true) {
            assert.strictEqual(oTargetNode.childNodes[0].childNodes.length, 2);
        } else {
            assert.strictEqual(oTargetNode.childNodes[0].childNodes.length, 0);
        }
        oIframe = oTargetNode.childNodes[0];

        if (utils.isApplicationTypeEmbeddedInIframe(sApplicationType, true) || utils.isApplicationTypeEmbeddedInIframe(oContainer.getFrameworkId())) {
            assert.ok(oContainer._adjustNwbcUrl.calledWith(sUrl), "adjustNwbcUrl called with " + sUrl);
            if (bIframeWithPost !== true) {
                var sRealURL = oContainer._adjustNwbcUrl(sUrl, sApplicationType);
                assert.strictEqual(oIframe.src, sRealURL, "IFRAME source was set to url " + sRealURL);
            } else {
                assert.strictEqual(oIframe.src, undefined);
            }
        } else {
            assert.strictEqual(oIframe.src, sUrl, "IFRAME source was set to url " + sUrl);
        }

        oContainer._adjustNwbcUrl.restore();

        checkIFrameNode(assert, oIframe, oContainer, bIframeWithPost);
        assert.strictEqual(oIframe.getAttribute("data-sap-ui"), oContainer.getId(), "iframe data-sap-ui attribute is set to the container id");
        assert.strictEqual(oIframe.id, oContainer.getId(), "iframe id is set correctly");
        if (bIframeWithPost !== true) {
            //ok(oGlobalRMInterface.accessibilityState.calledOnce, "renderer manager 'accessibilityState method was called once'");
        }
        assert.ok(oContainer.getFrameSource.calledOnce, "container getFrameSource method was called once");
        assert.ok(oContainer.getFrameSource.calledWith(sApplicationType, sUrl),
            "container getFrameSource method was called with the expected arguments");
        assert.ok(utils.filterOutParamsFromLegacyAppURL.called === bIframeWithPost);
        assert.ok(IframePOSTUtils.generateRootElementForIFrame.called === bIframeWithPost);
        assert.ok(IframePOSTUtils.buildHTMLElements.called === bIframeWithPost);
        if (bAllowPolicyRendered === true) {
            assert.strictEqual(oIframe.getAttribute("allow"), sIFRAME_FEATURE_POLICY, "iframe 'allow' is set correctly");
        } else if (bAllowPolicyRendered === false) {
            assert.strictEqual(oIframe.getAttribute("allow"), null, "iframe 'allow' should not exist");
        }

        utils.filterOutParamsFromLegacyAppURL.restore();
        IframePOSTUtils.generateRootElementForIFrame.restore();
        IframePOSTUtils.buildHTMLElements.restore();
    }

    function checkIFrameNode (assert, oIframe, oContainer, bIframeWithPost) {
        if (bIframeWithPost === true) {
            assert.strictEqual(oIframe.nodeName, "DIV", "got expected <div> dom node");
        } else {
            assert.strictEqual(oIframe.nodeName, "IFRAME", "got expected <iframe> dom node");
        }
        if (oAppContainer.bIgnoreClassCheck === undefined || oAppContainer.bIgnoreClassCheck === false) {
            assert.ok(oIframe.classList.contains("myClass1"), "iFrame has the expected class myClass1");
        }
        assert.ok(oIframe.classList.contains("sapUShellApplicationContainer"), "iFrame has the expected class sapUShellApplicationContainer");
        assert.strictEqual(oIframe.style.height, oContainer.getHeight(), "iframe height property was set correctly");
        assert.strictEqual(oIframe.style.width, oContainer.getWidth(), "iframe width property was set correctly");
        if (bIframeWithPost === true) {
            assert.strictEqual(oIframe.getAttribute("sap-iframe-app"), "true");
        } else {
            assert.strictEqual(oIframe.getAttribute("sap-iframe-app"), null);
        }
    }

    /**
     * Tests that the iFrame was not rendered after calling _render.
     *
     * @param {object} oTargetNode The target Node possibly containing an iframe.
     */
    function testIFrameNotRendered (assert, oContainer, oTargetNode) {
        if (!oTargetNode || !oTargetNode.childNodes || oTargetNode.childNodes.length !== 1) {
            assert.ok(true, "target node was not rendered");
        } else {
            assert.ok(false, "the IFrame was not rendered");
        }

        assert.ok(!utils.filterOutParamsFromLegacyAppURL.called);
        assert.ok(!IframePOSTUtils.generateRootElementForIFrame.called);
        assert.ok(!IframePOSTUtils.buildHTMLElements.called);
        utils.filterOutParamsFromLegacyAppURL.restore();
        IframePOSTUtils.generateRootElementForIFrame.restore();
        IframePOSTUtils.buildHTMLElements.restore();
    }

    /**
     * Calls <code>sap.ushell.components.container.createUi5View</code> for the given container
     * and tests that it fails with the given technical error message.
     *
     * @param {sap.ushell.components.container.ApplicationContainer} oContainer the container.
     * @param {string} sMessage technical error message.
     */
    function testFailingCreateUi5View (assert, oContainer, sMessage) {
        var fnCreateView = sandbox.spy(View, "create"),
            oLogMock = testUtils.createLogMock()
                .filterComponent(sCONTAINER)
                .error(sMessage, oContainer.getAdditionalInformation(), sCONTAINER);

        sandbox.stub(ApplicationContainer.prototype, "_createErrorControl");

        oContainer._createUi5View(oContainer, oContainer.getUrl(),
            oContainer.getAdditionalInformation());

        assert.ok(!fnCreateView.called);
        assert.ok(oContainer._createErrorControl.calledOnce);
        oLogMock.verify();
    }

    // a test component
    sap.ui.define("some/random/path/Component", ["sap/ui/core/UIComponent"], function (UIComponent) {
        oTestComponent = UIComponent.extend("some.random.path.Component", {
            metadata: {
                config: {
                    foo: "bar"
                }
            },
            createContent: function () {
                return new Icon();
            }
        });
        return oTestComponent;
    });

    // a test component w/o configuration
    sap.ui.define("some/random/path/no/config/Component", ["sap/ui/core/UIComponent"], function (UIComponent) {
        return UIComponent.extend("some.random.path.no.config.Component", {
            metadata: {},
            createContent: function () {
                return new Icon();
            }
        });
    });

    /**
     * Helper function to varruct a post message event.
     *
     * @param {object} [oProperties] parameter object.
     * @param {string} [oProperties.service] the name of the service that should be set in the message.
     * @param {string} [oProperties.body] the object that should be set in the message body.
     * @returns {object} message event object; the data property is always serialized.
     */
    function getServiceRequestMessage (oProperties) {
        var oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

        if (oProperties && oProperties.service) {
            oMessage.data.service = oProperties.service;
        }
        if (oProperties && oProperties.body) {
            oMessage.data.body = oProperties.body;
        }

        // always serialize message event data
        oMessage.data = JSON.stringify(oMessage.data);
        oMessage.source.postMessage = sandbox.spy();

        return oMessage;
    }

    // ---------------------------------------------------------------------------------------------
    var oGlobalRM;

    // Documentation can be found at http://docs.jquery.com/QUnit
    QUnit.module("components/container/ApplicationContainer.js", {
        beforeEach: function () {
            // Avoid writing to localStorage in any case
            // Never spy on localStorage, this is a strange object in IE9!
            oGlobalRM = new RenderManager();

            sandbox.stub(Storage.prototype, "removeItem");
            sandbox.stub(Storage.prototype, "setItem");
            ApplicationContainer.prototype._setCachedUI5Version(undefined);

            BlueBoxHandler.init();
            Application.init(BlueBoxHandler, PostMessageUtils);

            oAppContainer = Application.createApplicationContainer("application-test-id", { sURL: "xxxxxxx" });
            // prevent deferred events unless explicitely enabled
            sandbox.stub(ApplicationContainer.prototype, "_publishExternalEvent");
        },
        // This method is called after each test. Add every restoration code here.
        afterEach: function () {
            oGlobalRM.destroy();
            oGlobalRM = undefined;
            Application.destroy(oAppContainer);
            oAppContainer = undefined;
            sandbox.restore();
        }
    });

    QUnit.test("ApplicationContainer#invalidate", function (assert) {
        //case #1 - when control not rendered yet, invalidate triggers real rendering
        sandbox.stub(oAppContainer, "getDomRef").returns(undefined);
        sandbox.stub(Control.prototype, "invalidate");
        oAppContainer.invalidate();
        assert.ok(Control.prototype.invalidate.called, "Control invalidation should be called");

        //case #1 - when control was rendered, invalidate should not trigger real rendering
        Control.prototype.invalidate.reset();
        oAppContainer.getDomRef.restore();
        sandbox.stub(oAppContainer, "getDomRef").returns({});
        oAppContainer.invalidate();
        assert.ok(!Control.prototype.invalidate.called, "Control invalidation should be called");
    });

    QUnit.test("test declared properties", function (assert) {
        oAppContainer.setWidth("11%");
        oAppContainer.setHeight("180px");
        var actualProps = Object.keys(oAppContainer.getMetadata().getProperties());
        [
            "additionalInformation", "application", "applicationConfiguration",
            "applicationType", "height", "navigationMode", "text", "url", "visible", "width"
        ].forEach(function (sStr) {
            assert.ok(actualProps.indexOf(sStr) >= 0, " property " + sStr + " present");
        });
    });

    [{
        description: "accessibility was set to 'X'",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas", // NOTE: not the browser location URL!
        expectedUrlAddition: "sap-ie=edge&sap-accessibility=X&sap-ushell-timeout=0",
        nwbcTheme: undefined,
        accessibility: "X",
        applicationType: "NWBC"
    }, {
        description: "sap-accessibility was set to 'X' in the browser location url",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas",
        sapAccessibilityUrlBoolean: true,
        expectedUrlAddition: "sap-ie=edge&sap-accessibility=X&sap-ushell-timeout=0",
        nwbcTheme: undefined,
        accessibility: undefined,
        applicationType: "NWBC"
    }, {
        description: "sap-accessibility was set to false in the browser location url",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas",
        sapAccessibilityUrlBoolean: false,
        expectedUrlAddition: "sap-ie=edge&sap-ushell-timeout=0",
        nwbcTheme: undefined,
        accessibility: "X",
        applicationType: "NWBC"
    }, {
        description: "accessibility was set to undefined",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-ushell-timeout=0",
        nwbcTheme: undefined,
        accessibility: undefined,
        applicationType: "NWBC"
    }, {
        description: "accessibility was set to ''",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-ushell-timeout=0",
        nwbcTheme: undefined,
        accessibility: undefined,
        applicationType: "NWBC"
    }, {
        description: "theme from User object is undefined",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-ushell-timeout=0",
        nwbcTheme: undefined,
        accessibility: undefined,
        applicationType: "NWBC"
    }, {
        description: "theme from User object is a sap_ theme",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-theme=sap_hcb&sap-ushell-timeout=0",
        nwbcTheme: "sap_hcb",
        accessibility: undefined,
        applicationType: "NWBC"
    }, {
        description: "theme from User object is a custom theme",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-theme=custom_theme@https://frontendserver.company.com/the/theme/repository/path&sap-ushell-timeout=0",
        nwbcTheme: "custom_theme@https://frontendserver.company.com/the/theme/repository/path",
        accessibility: undefined,
        applicationType: "NWBC"
    }, {
        description: "the version is set (1.32.5) and applicationType = NWBC",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-ushell-timeout=0&sap-shell=FLP1.32.5-NWBC",
        version: "1.32.5",
        nwbcTheme: undefined,
        accessibility: undefined,
        applicationType: "NWBC"
    }, {
        description: "the version is set (1.32.5) and no applicationType is set",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-ushell-timeout=0&sap-shell=FLP1.32.5-NWBC",
        version: "1.32.5",
        nwbcTheme: undefined,
        accessibility: undefined
        // no application type
    }, {
        description: "the version is set (1.32.5) and applicationType = TR",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-keepclientsession=2&sap-ushell-timeout=0&sap-shell=FLP1.32.5",
        version: "1.32.5",
        nwbcTheme: undefined,
        accessibility: undefined,
        applicationType: "TR"
    }, {
        description: "sap-statistics was set to true in UI5 configuration",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas",
        sapStatisticsUI5ConfigBoolean: true,
        expectedUrlAddition: "sap-ie=edge&sap-statistics=true&sap-ushell-timeout=0",
        nwbcTheme: undefined,
        accessibility: undefined,
        applicationType: "NWBC"
    }, {
        description: "sap-statistics was set to false in UI5 configuration",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas",
        sapStatisticsUI5ConfigBoolean: false,
        expectedUrlAddition: "sap-ie=edge&sap-ushell-timeout=0",
        nwbcTheme: undefined,
        accessibility: undefined,
        applicationType: "NWBC"
    }, {
        description: "sap-statistics was set to true in the UI5 configuration and the sap-statistics appears as a non-true and non-false intent parameter",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas?sap-statistics=something",
        sapStatisticsUI5ConfigBoolean: true,
        expectedUrlAddition: "sap-ie=edge&sap-ushell-timeout=0",
        nwbcTheme: undefined,
        accessibility: undefined,
        applicationType: "NWBC"
    }, {
        description: "sap-statistics was set to true in the UI5 configuration and the sap-statistics appears false intent parameter",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas?sap-statistics=false",
        sapStatisticsUI5ConfigBoolean: true,
        expectedUrlAddition: "sap-ie=edge&sap-ushell-timeout=0",
        nwbcTheme: undefined,
        accessibility: undefined,
        applicationType: "NWBC"
    }, {
        description: "`bReuseSession` is true; the url has the query parameter `sap-keepclientsession=1`",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-keepclientsession=1&sap-ushell-timeout=0",
        nwbcTheme: undefined,
        accessibility: undefined,
        bReuseSession: true
    }, {
        description: "flp URL contains sap-iapp-state parameter in the hash in 1 parameter",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-iapp-state=APPSTATEID&sap-ushell-timeout=0",
        applicationType: "NWBC",
        getHashFunc: function () { return "Action-Semantic&/sap-iapp-state=APPSTATEID"; }
    }, {
        description: "flp URL contains sap-iapp-state parameter in the hash in 3 parameters",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-iapp-state=APPSTATEID&sap-ushell-timeout=0",
        applicationType: "NWBC",
        getHashFunc: function () { return "Action-Semantic&/AAAAA=12345667/sap-iapp-state=APPSTATEID/BBBBB=987654"; }
    }, {
        description: "flp URL contains empty hash",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-ushell-timeout=0",
        applicationType: "NWBC",
        getHashFunc: function () { return ""; }
    }, {
        description: "flp URL contains undefined hash",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-ushell-timeout=0",
        applicationType: "NWBC",
        getHashFunc: function () { return undefined; }
    }, {
        description: "flp URL contains no sap-iapp-state parameter in the hash",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-ushell-timeout=0",
        applicationType: "NWBC",
        getHashFunc: function () { return "Action-Semantic"; }
    }, {
        description: "flp URL contains empty sap-iapp-state parameter in the hash with 3 parameters",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-ushell-timeout=0",
        applicationType: "NWBC",
        getHashFunc: function () { return "Action-Semantic&/AAAAA=12345667/sap-iapp-state=/BBBBB=987654"; }
    }, {
        description: "flp URL contains empty sap-iapp-state parameter in the hash with 1 parameter only",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-ushell-timeout=0",
        applicationType: "NWBC",
        getHashFunc: function () { return "Action-Semantic&/sap-iapp-state="; }
    }, {
        description: "URL for compact density",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-touch=0&sap-ushell-timeout=0",
        applicationType: "NWBC",
        densityFunc: function () {
            jQuery("body")
                .toggleClass("sapUiSizeCompact", true)
                .toggleClass("sapUiSizeCozy", false);
        }
    }, {
        description: "URL for cozy density",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-touch=1&sap-ushell-timeout=0",
        applicationType: "NWBC",
        densityFunc: function () {
            jQuery("body")
                .toggleClass("sapUiSizeCompact", false)
                .toggleClass("sapUiSizeCozy", true);
        }
    }, {
        description: "session timeout is disabled",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-ushell-timeout=0",
        applicationType: "NWBC",
        sessionTimeoutFunc: function () {
            return sandbox.stub(Config, "last").returns(-1);
        }
    }, {
        description: "session timeout is null",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-ushell-timeout=0",
        applicationType: "NWBC",
        sessionTimeoutFunc: function () {
            return sandbox.stub(Config, "last").returns(null);
        }
    }, {
        description: "session timeout is empty string",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-ushell-timeout=0",
        applicationType: "NWBC",
        sessionTimeoutFunc: function () {
            return sandbox.stub(Config, "last").returns("");
        }
    }, {
        description: "session timeout is undefined",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-ushell-timeout=0",
        applicationType: "NWBC",
        sessionTimeoutFunc: function () {
            return sandbox.stub(Config, "last").returns(undefined);
        }
    }, {
        description: "session timeout is 10 min",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-ushell-timeout=10",
        applicationType: "NWBC",
        sessionTimeoutFunc: function () {
            return sandbox.stub(Config, "last").returns(10);
        }
    }, {
        description: "session timeout is 0",
        inputUrl: window.location.origin + "/sap/bc/ui2/nwbc/~canvas",
        expectedUrlAddition: "sap-ie=edge&sap-ushell-timeout=0",
        applicationType: "NWBC",
        sessionTimeoutFunc: function () {
            return sandbox.stub(Config, "last").returns(0);
        }
    }].forEach(function (oFixture) {
        QUnit.test("adjustNwbcUrl returns the correct URL when " + oFixture.description, function (assert) {
            // Arrange
            return Container.init("local").then(function () {
                var fHashStub;
                var fConfigStub;

                var fnGetParameterValueBooleanStub = sandbox.stub(utils, "getParameterValueBoolean").callsFake(function (sParameter, sUrl) {
                    if (sParameter === "sap-accessibility" && sUrl === undefined) { return oFixture.sapAccessibilityUrlBoolean; }
                    throw "code is calling getParameterValueBoolean with unexpected arguments";
                });

                sandbox.stub(Supportability, "isStatisticsEnabled").returns(oFixture.sapStatisticsUI5ConfigBoolean);

                if (oFixture.version) {
                    ApplicationContainer.prototype._setCachedUI5Version(oFixture.version);
                }
                sandbox.stub(Container, "getUser").returns({
                    getTheme: function (sThemeValueType) {
                        if (sThemeValueType === User.prototype.constants.themeFormat.NWBC) {
                            return oFixture.nwbcTheme;
                        }
                        return "noTheme";
                    },
                    getAccessibilityMode: function () {
                        return oFixture.accessibility;
                    }
                });

                if (oFixture.getHashFunc) {
                    fHashStub = sandbox.stub(window.hasher, "getHash");
                    fHashStub.callsFake(oFixture.getHashFunc);
                }

                if (oFixture.densityFunc) {
                    oFixture.densityFunc();
                }
                if (oFixture.sessionTimeoutFunc) {
                    fConfigStub = oFixture.sessionTimeoutFunc();
                }

                var sUrl = oFixture.inputUrl;
                // Act
                var sAdjustedUrl = decodeURIComponent(oAppContainer._adjustNwbcUrl(sUrl, oFixture.applicationType, undefined, oFixture.bReuseSession));
                // decode the URL for better readability in case of errors
                // Assert
                var sSep = oFixture.inputUrl.indexOf("?") >= 0 ? "&" : "?";

                assert.strictEqual(sAdjustedUrl, oFixture.inputUrl + sSep + oFixture.expectedUrlAddition);

                // restore
                if (oFixture.getHashFunc) {
                    fHashStub.restore();
                }

                jQuery("body")
                    .toggleClass("sapUiSizeCompact", false)
                    .toggleClass("sapUiSizeCozy", false);

                if (fConfigStub) {
                    fConfigStub.restore();
                }
                fnGetParameterValueBooleanStub.restore();
            });
        });
    });

    [{
        sExpectedUrl: "http://www.google.de",
        sExpectedConfigId: 1,
        sExpectedValidation: true,
        sTitle: "allowed external url"
    }, {
        sExpectedUrl: "#Buch-lesen",
        sExpectedConfigId: 2,
        sExpectedValidation: false,
        sTitle: "not allowed url"
    }, {
        sExpectedUrl: "#Action-toappnavsample",
        sExpectedConfigId: 3,
        sExpectedValidation: true,
        sTitle: "allowed semantic object and action"
    }, {
        sExpectedUrl: "blaBlabla",
        sExpectedConfigId: 4,
        sExpectedValidation: false,
        sTitle: "not allowed url format"
    }, {
        sExpectedUrl: "http://www.spiegel",
        sExpectedConfigId: 5,
        sExpectedValidation: false,
        sTitle: "not allowed url format. Ending is missing"
    }, {
        sExpectedUrl: "http:/www.spiegel.de",
        sExpectedConfigId: 6,
        sExpectedValidation: false,
        sTitle: "not allowed url format. One slash after http:/ is missing"
    }, {
        sExpectedUrl: "",
        sExpectedConfigId: 7,
        sExpectedValidation: false,
        sTitle: "empty string as url"
    }, {
        sExpectedUrl: undefined,
        sExpectedConfigId: 8,
        sExpectedValidation: false,
        sTitle: "url is undefined"
    }].forEach(function (oFixture) {
        QUnit.test("adaptIsUrlSupportedResultForMessagePopover: " + oFixture.sTitle, function (assert) {
            var fnResolve;
            var fnReject;
            var oES6PromisePassed = {}; // object containing the original resolve and reject functions gets passed to the unified shell
            var oES6Promise = new Promise(function (resolve, reject) { // promise created by SAP UI5
                oES6PromisePassed.resolve = resolve;
                oES6PromisePassed.reject = reject;
            });
            sandbox.stub(Container, "getServiceAsync").resolves({
                isUrlSupported: function (sUrl) {
                    assert.strictEqual(sUrl, oFixture.sExpectedUrl, "correct url was passed to the service");
                    return new Promise(function (resolve, reject) {
                        fnResolve = resolve;
                        fnReject = reject;
                    });
                }
            });

            oAppContainer._adaptIsUrlSupportedResultForMessagePopover({ promise: oES6PromisePassed, url: oFixture.sExpectedUrl, id: oFixture.sExpectedConfigId });

            setTimeout(function () {
                if (oFixture.sExpectedValidation) {
                    fnResolve();
                } else {
                    fnReject();
                }
            }, 1000);

            return oES6Promise.then(function (oResult) {
                assert.ok(true, "Promise was resolved and not rejected");
                assert.strictEqual(oResult.allowed, oFixture.sExpectedValidation, "SAP UI5 promise was resolved correctly");
                assert.strictEqual(oResult.id, oFixture.sExpectedConfigId, "Config ID was passed correctly and got resolved as expected");
            }).catch(function () {
                assert.ok(false);
            });
        });
    });

    QUnit.test("getTranslatedText", function (assert) {
        assert.equal(oAppContainer._getTranslatedText("search"), "Search", "Translated");
        assert.equal(oAppContainer._getTranslatedText("time_hours", ["100"]), "100 hours ago", "Translated");
    });

    QUnit.test("renderControlInDiv w/o child", function (assert) {
        var oTargetNode = document.createElement("DIV");

        oAppContainer.bTestControl = true;
        oAppContainer.setWidth("11%");
        oAppContainer.setHeight("180px");
        oAppContainer.addStyleClass("myClass1");
        //sandbox.spy(oGlobalRMInterface, "accessibilityState");

        oGlobalRM.render(oAppContainer, oTargetNode);

        var oDiv = oTargetNode.childNodes[0];
        assert.strictEqual(oDiv.nodeName, "DIV");
        assert.ok(oDiv.classList.contains("myClass1"), "Div has the expected class myClass1");
        assert.ok(oDiv.classList.contains("sapUShellApplicationContainer"), "Div has the expected class sapUShellApplicationContainer");
        assert.strictEqual(oDiv.getAttribute("data-sap-ui"), oAppContainer.getId());
        assert.strictEqual(oDiv.id, oAppContainer.getId());
        assert.strictEqual(oDiv.style.height, oAppContainer.getHeight());
        assert.strictEqual(oDiv.style.width, oAppContainer.getWidth());
        //ok(oGlobalRMInterface.accessibilityState.calledOnce);
    });

    QUnit.test("renderControlInDiv w/ child", function (assert) {
        var oTargetNode = document.createElement("section1234");
        var oChild = new Icon();

        oAppContainer.bTestControl = true;
        oAppContainer.oTestControl = oChild;
        oAppContainer.setWidth("11%");
        oAppContainer.setHeight("180px");
        oAppContainer.addStyleClass("myClass1");
        //sandbox.spy(oGlobalRMInterface, "accessibilityState");
        //sandbox.spy(oGlobalRMInterface, "renderControl");

        oGlobalRM.render(oAppContainer, oTargetNode);

        assert.strictEqual(oTargetNode.childNodes.length, 1);
        var oDiv = oTargetNode.childNodes[0];
        assert.strictEqual(oDiv.nodeName, "DIV");
        assert.ok(oDiv.classList.contains("myClass1"), "Div contains correct class");
        assert.ok(oDiv.classList.contains("sapUShellApplicationContainer"), "Div contains correct class");
        assert.strictEqual(oDiv.getAttribute("data-sap-ui"), oAppContainer.getId());
        assert.strictEqual(oDiv.id, oAppContainer.getId());
        assert.strictEqual(oDiv.style.height, oAppContainer.getHeight());
        assert.strictEqual(oDiv.style.width, oAppContainer.getWidth());
        //ok(oGlobalRMInterface.accessibilityState.calledOnce);
        //ok(oGlobalRMInterface.renderControl.calledOnce);
        //ok(oGlobalRMInterface.renderControl.calledWith(oChild));
    });

    QUnit.test("createErrorControl", function (assert) {
        var oCurrAppContainer = new ApplicationContainer();

        sandbox.stub(ApplicationContainer.prototype, "_getTranslatedText").returns("Error occurred");

        var oResult = oCurrAppContainer._createErrorControl();

        assert.ok(oResult instanceof Control, "public contract");
        assert.ok(oResult instanceof Icon, "implementation details");
        assert.strictEqual(oResult.getSize(), "2rem");
        assert.strictEqual(oResult.getSrc(), "sap-icon://error");
        assert.strictEqual(oResult.getTooltip(), "Error occurred");
        assert.ok(oCurrAppContainer._getTranslatedText.calledWith("an_error_has_occured"));
    });

    QUnit.test("ApplicationContainer control", function (assert) {
        assert.strictEqual(typeof ApplicationContainer, "function");

        assert.ok(oAppContainer instanceof Control);
        assert.strictEqual(oAppContainer.getAdditionalInformation(), "",
            "default for 'additionalInformation' property");
        assert.strictEqual(oAppContainer.getApplicationType(), "URL",
            "default for 'applicationType' property");
        assert.strictEqual(oAppContainer.getHeight(), "100%", "default for 'height' property");
        assert.strictEqual(oAppContainer.getUrl(), "", "default for 'url' property");
        assert.strictEqual(oAppContainer.getVisible(), true, "default for 'visible' property");
        assert.strictEqual(oAppContainer.getWidth(), "100%", "default for 'width' property");
        assert.strictEqual(oAppContainer.getApplication(), undefined, "default for 'application' property");
        assert.strictEqual(oAppContainer.getChild, undefined, "'child' hidden");

        QUnit.test("ApplicationContainer defines all its private aggregations in the design time metadata definition", function (assert) {
            var oCurAppContainer = new ApplicationContainer({
                applicationType: ApplicationType.URL.type
            });

            var aAllPrivateAggregations = Object.keys(oCurAppContainer.getMetadata().getAllPrivateAggregations());
            var oMetadata = oCurAppContainer.getMetadata();

            return oMetadata.loadDesignTime()
                .then(function (oDesignTimeMetadata) {
                    assert.ok(true, "loadDesignTime promise was resolved");

                    var oDesignTimeAggregations = oDesignTimeMetadata.aggregations;
                    assert.ok(oDesignTimeAggregations, "design time aggregations were defined on the ApplicationContainer");

                    if (oDesignTimeAggregations) {
                        aAllPrivateAggregations.forEach(function (sAggregation) {
                            assert.ok(oDesignTimeMetadata.aggregations.hasOwnProperty(sAggregation),
                                "The private aggregation '" + sAggregation + "' was defined among the design time metadata");
                        });
                    }
                })
                .catch(function (/*oError*/) {
                    assert.ok(false, "loadDesignTime promise was resolved");
                });
        });

        aEmbeddableApplicationTypes.forEach(function (sLegacyApplicationType) {
            var oCurAppContainer = new ApplicationContainer({
                applicationType: ApplicationType.enum[sLegacyApplicationType]
            });
            assert.strictEqual(oCurAppContainer.getApplicationType(),
                ApplicationType.enum[sLegacyApplicationType]);
        });

        assert.throws(function () {
            new ApplicationContainer({ applicationType: "foo" });
        });

        var oCurAppContainer = new ApplicationContainer({ url: sTESTURL });
        assert.strictEqual(oCurAppContainer.getUrl(), sTESTURL);

        oCurAppContainer = new ApplicationContainer({ visible: false });
        assert.strictEqual(oCurAppContainer.getVisible(), false);

        oCurAppContainer = new ApplicationContainer({ height: "200px" });
        assert.strictEqual(oCurAppContainer.getHeight(), "200px");

        assert.throws(function () {
            oCurAppContainer = new ApplicationContainer({ height: "200foo" });
        });

        oCurAppContainer = new ApplicationContainer({ width: "100px" });
        assert.strictEqual(oCurAppContainer.getWidth(), "100px");

        assert.throws(function () {
            oCurAppContainer = new ApplicationContainer({ width: "100foo" });
        });

        oCurAppContainer = new ApplicationContainer({ additionalInformation: "SAPUI5=" });
        assert.strictEqual(oCurAppContainer.getAdditionalInformation(), "SAPUI5=");
    });

    QUnit.test("ApplicationContainer renderer exists", function (assert) {
        var oRenderManager = new RenderManager(),
            oContainerRenderer = oRenderManager.getRenderer(oAppContainer);

        assert.strictEqual(typeof oContainerRenderer, "object", oContainerRenderer);
    });

    QUnit.test("sap.ushell.components.container.render URL", function (assert) {
        Application.destroy(oAppContainer);
        oAppContainer = new ApplicationContainer();
        oAppContainer.setUrl(sTESTURL);
        oAppContainer.setWidth("10%");
        oAppContainer.setHeight("20%");
        mockSapUshellContainer();
        renderInternallyAndExpectIFrame(assert, oAppContainer, ApplicationType.URL.type, sTESTURL);
    });

    QUnit.test("sap.ushell.components.container.render URL with 'allow' policy by default", function (assert) {
        Application.destroy(oAppContainer);
        oAppContainer = new ApplicationContainer();
        oAppContainer.setUrl(sTESTURL);
        oAppContainer.setWidth("10%");
        oAppContainer.setHeight("20%");
        mockSapUshellContainer();
        var oStubLast = sandbox.stub(Config, "last").returns(true);
        renderInternallyAndExpectIFrame(assert, oAppContainer, ApplicationType.URL.type, sTESTURL, undefined, undefined);
        oStubLast.restore();
    });

    QUnit.test("sap.ushell.components.container.render URL without 'allow' policy", function (assert) {
        Application.destroy(oAppContainer);
        oAppContainer = new ApplicationContainer();
        oAppContainer.setUrl(sTESTURL);
        oAppContainer.setWidth("10%");
        oAppContainer.setHeight("20%");
        mockSapUshellContainer();
        var oStubLast = sandbox.stub(Config, "last").returns(false);
        renderInternallyAndExpectIFrame(assert, oAppContainer, ApplicationType.URL.type, sTESTURL, undefined, undefined, false);
        oStubLast.restore();
    });

    QUnit.test("sap.ushell.components.container.render WDA", function (assert) {
        var sTempUrl = window.location.origin + "/sap/bc/webdynpro/sap/test_navigation_parameter";
        Application.destroy(oAppContainer);
        oAppContainer = new ApplicationContainer();
        oAppContainer.setUrl(sTempUrl);
        oAppContainer.setApplicationType(ApplicationType.WDA.type);
        oAppContainer.setWidth("10%");
        oAppContainer.setHeight("20%");
        sandbox.spy(systemAlias, "addSystemAlias");
        mockSapUshellContainer();
        renderInternallyAndExpectIFrame(assert, oAppContainer, ApplicationType.WDA.type, sTempUrl);
        assert.ok(systemAlias.addSystemAlias.calledOnce, "systemAlias.getSystemAlias was called");
    });

    ["NWBC", "TR", "WDA"].forEach(function (sLegacyApplicationType) {
        QUnit.test("sap.ushell.components.container.render " + sLegacyApplicationType, function (assert) {
            Application.destroy(oAppContainer);
            oAppContainer = new ApplicationContainer();

            return Container.init("local").then(function () {
                var sTempUrl = window.location.origin + "/sap/bc/ui2/nwbc/~canvas";
                oAppContainer.setUrl(sTempUrl);
                oAppContainer.setWidth("10%");
                oAppContainer.setHeight("20%");
                oAppContainer.setApplicationType(sLegacyApplicationType);
                mockSapUshellContainer();
                renderInternallyAndExpectIFrame(assert, oAppContainer, ApplicationType.enum[sLegacyApplicationType], sTempUrl);
            });
        });
    });

    QUnit.test("getFrameSource", function (assert) {
        assert.strictEqual(oAppContainer.getFrameSource(ApplicationType.URL.type, sTESTURL), sTESTURL);
    });

    QUnit.test("getFrameSource invalid type", function (assert) {
        assert.throws(function () {
            oAppContainer.getFrameSource("FOO", sTESTURL);
        }, /Illegal application type: FOO/);
    });

    QUnit.test("sap.ushell.components.container.render invalid type", function (assert) {
        var oRenderManager = new RenderManager(),
            sType = "FOO",
            sTechnicalErrorMsg = "Illegal application type: " + sType,
            oLogMock = testUtils.createLogMock()
                .filterComponent(sCONTAINER)
                .error(sTechnicalErrorMsg, null, sCONTAINER);

        Application.destroy(oAppContainer);
        oAppContainer = new ApplicationContainer();
        oAppContainer.setUrl(sTESTURL);

        sandbox.spy(ApplicationContainer.prototype, "_createErrorControl");

        oAppContainer._render(oRenderManager, oAppContainer, sType, sTESTURL, "");

        assert.ok(oAppContainer._createErrorControl.calledOnce);
        oLogMock.verify();
    });

    QUnit.test("getFrameSource throw new Error", function (assert) {
        var oRenderManager = new RenderManager(),
            sTechnicalErrorMsg = "Some error message",
            oLogMock = testUtils.createLogMock()
                .filterComponent(sCONTAINER)
                .error(sTechnicalErrorMsg, null, sCONTAINER);

        Application.destroy(oAppContainer);
        oAppContainer = new ApplicationContainer();
        oAppContainer.setUrl(sTESTURL);

        sandbox.spy(ApplicationContainer.prototype, "_createErrorControl");

        oAppContainer.getFrameSource = function () { throw new Error(sTechnicalErrorMsg); };
        oAppContainer._render(oRenderManager, oAppContainer, "n/a", sTESTURL, "");

        assert.ok(oAppContainer._createErrorControl.calledOnce);
        oLogMock.verify();
    });

    QUnit.test("sap.ushell.components.container.render invalid type w/ custom getFrameSource", function (assert) {
        Application.destroy(oAppContainer);
        oAppContainer = new ApplicationContainer();

        oAppContainer.setUrl(sTESTURL);
        oAppContainer.setWidth("10%");
        oAppContainer.setHeight("20%");

        sandbox.stub(oAppContainer, "getFrameSource").returns(sTESTURL);
        sandbox.stub(oAppContainer, "getApplicationType").returns("TRA");

        mockSapUshellContainer();
        renderInternallyAndExpectIFrame(assert, oAppContainer, "TRA", sTESTURL, undefined, undefined, undefined, false);
    });

    QUnit.test("sap.ushell.components.container.render UI5 (SAPUI5=)", function (assert) {

        var oDummyRenderer = {
            renderControl: sandbox.stub(),
            flush: sandbox.stub(),
            destroy: sandbox.stub()
        },
            oIcon = new Icon(),
            oRenderManagerA = new RenderManager().getInterface(),
            oRenderManagerB = new RenderManager().getInterface();

        Application.destroy(oAppContainer);
        oAppContainer = new ApplicationContainer();

        // return a button instead of a view, so that we have a control with the necessary
        // properties, but don't have to supply another file for the view definition
        sandbox.stub(ApplicationContainer.prototype, "_createUi5View").returns(
            new jQuery.Deferred().resolve(oIcon)
        );
        sandbox.stub(ApplicationContainer.prototype, "_renderControlInDiv");
        sandbox.stub(oRenderManagerA, "renderControl").returns(oDummyRenderer);
        sandbox.stub(oRenderManagerB, "renderControl");

        oAppContainer._render(oRenderManagerB, oAppContainer, ApplicationType.URL.type, sTESTURL, "SAPUI5=some.random.path.Viewname.view.xml");

        return oAppContainer.getDeffedControlCreation().then(function () {

            assert.ok(oAppContainer._createUi5View.calledOnce);
            assert.ok(oAppContainer._createUi5View.calledWith(oAppContainer, sTESTURL, "SAPUI5=some.random.path.Viewname.view.xml"));
            assert.ok(oAppContainer._renderControlInDiv.calledWith(oRenderManagerB, oAppContainer));

            var bRenderControlCalled1 = oDummyRenderer.renderControl.calledWith(oIcon),
                bRenderControlCalled2 = oRenderManagerB.renderControl.calledWith(oIcon);
            assert.ok((bRenderControlCalled1 && !bRenderControlCalled2) || (!bRenderControlCalled1 && bRenderControlCalled2));

            oRenderManagerA.renderControl.restore();
            oRenderManagerB.renderControl.restore();
        });
    });

    QUnit.test("ApplicationContainer invisible", function (assert) {
        Application.destroy(oAppContainer);
        oAppContainer = new ApplicationContainer();

        oAppContainer.setVisible(false);
        sandbox.stub(ApplicationContainer.prototype, "_render");
        sandbox.stub(ApplicationContainer.prototype, "_renderControlInDiv");

        oGlobalRM.render(oAppContainer, document.createElement("DIV"));

        assert.ok(oAppContainer._render.notCalled, "_render function wasn't called on the application container");
        //ok(oAppContainer._renderControlInDiv.calledWith(oGlobalRM.getRendererInterface(), oAppContainer));
    });

    QUnit.test("ApplicationContainer inactive", function (assert) {
        var oRenderManager = new RenderManager();

        Application.destroy(oAppContainer);
        oAppContainer = new ApplicationContainer();

        oAppContainer.setVisible(true);
        oAppContainer.setActive(false);
        sandbox.stub(ApplicationContainer.prototype, "_render");
        sandbox.stub(ApplicationContainer.prototype, "_renderControlInDiv");

        oRenderManager.render(oAppContainer, document.createElement("DIV"));

        assert.ok(oAppContainer._render.called, "_render function was called on inactive but visible application container");
    });

    QUnit.test("ApplicationContainer rendering (active container)", function (assert) {
        Application.destroy(oAppContainer);
        oAppContainer = new ApplicationContainer();
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl(window.location.origin + "/sap/public/bc/ui2/staging/test");
        oAppContainer.setAdditionalInformation("SAPUI5=will.be.ignored.view.xml");
        oAppContainer.setActive(true); // NOTE

        renderAndExpect(assert, oAppContainer, oAppContainer.getApplicationType(), oAppContainer.getUrl(), oAppContainer.getAdditionalInformation());
    });

    QUnit.test("createUi5View", function (assert) {
        Application.destroy(oAppContainer);
        oAppContainer = new ApplicationContainer();

        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl(window.location.origin + "/sap/public/bc/ui2/staging/test");
        // explicitely use ".view." in the view's path to check that this is no problem
        oAppContainer.setAdditionalInformation("SAPUI5=some.random.view.path.Viewname.view.xml");
        oAppContainer.setWidth("11%");
        oAppContainer.setHeight("180px");

        var oIcon = new Icon(),
            fnRegisterModulePath = sandbox.spy(sap.ui.loader, "config"),
            // return a button instead of a view, so that we have a control with the necessary
            // properties, but don't have to supply another file for the view definition
            fnCreateView = sandbox.stub(View, "create").resolves(oIcon);

        sandbox.spy(ApplicationContainer.prototype, "_destroyChild");

        return oAppContainer._createUi5View(oAppContainer, oAppContainer.getUrl(), oAppContainer.getAdditionalInformation()).then(function (oView) {
            assert.strictEqual(oView, oIcon, "createView returns our button");
            assert.ok(fnRegisterModulePath.calledOnce, "registerModulePath called");
            var oCalledWith = fnRegisterModulePath.getCall(0).args[0];
            assert.ok(oCalledWith.paths["some.random.view.path"]);
            assert.strictEqual(oCalledWith.paths["some.random.view.path"], window.location.origin + "/sap/public/bc/ui2/staging/test/some/random/view/path");
            assert.ok(fnCreateView.calledOnce, "createView called");
            assert.ok(oAppContainer._destroyChild.calledBefore(fnCreateView),
                "child destroyed before creating the view");
            assert.ok(fnCreateView.calledWith({
                id: oAppContainer.getId() + "-content",
                type: "XML",
                viewData: {},
                viewName: "some.random.view.path.Viewname"
            }), "createView args");
            assert.strictEqual(oIcon.getWidth(), "11%");
            assert.strictEqual(oIcon.getHeight(), "180px");
            assert.ok(oIcon.hasStyleClass("sapUShellApplicationContainer"),
                "style sapUShellApplicationContainer applied");
            assert.strictEqual(oIcon.getParent(), oAppContainer, "view's parent is the container");
        });
    });

    QUnit.test("createUi5View view in subfolder", function (assert) {
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl(window.location.origin + "/");
        oAppContainer.setAdditionalInformation("SAPUI5=some.random.path/view.Viewname.view.js");

        var fnRegisterModulePath = sandbox.spy(sap.ui.loader, "config"),
            fnCreateView = sandbox.stub(View, "create").resolves(new Icon());

        oAppContainer._createUi5View(oAppContainer, oAppContainer.getUrl(), oAppContainer.getAdditionalInformation());

        assert.ok(fnRegisterModulePath.calledOnce, "registerModulePath called");
        assert.strictEqual(fnRegisterModulePath.firstCall.args[0].paths["some.random.path"], window.location.origin + "/some/random/path");
        assert.ok(fnCreateView.calledOnce, "createView called");
        assert.strictEqual(fnCreateView.firstCall.args[0].type, "JS");
        assert.strictEqual(fnCreateView.firstCall.args[0].viewName, "some.random.path.view.Viewname");
    });

    QUnit.test("createUi5View with configuration data", function (assert) {
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl(window.location.origin + "/sap/public/bc/ui2/staging/test");
        // explicitely use ".view." in the view's path to check that this is no problem
        oAppContainer.setAdditionalInformation("SAPUI5=some.random.view.path.Viewname.view.xml");
        oAppContainer.setApplicationConfiguration({ a: 1, b: 2 });

        var oIcon = new Icon(),
            // return a button instead of a view, so we have a control with the necessary properties,
            // but don't have to supply another file for the view definition
            fnCreateView = sandbox.stub(View, "create").resolves(oIcon);

        sandbox.spy(sap.ui.loader, "config");
        return oAppContainer._createUi5View(oAppContainer, oAppContainer.getUrl(), oAppContainer.getAdditionalInformation()).then(function (oView) {
            assert.strictEqual(oView, oIcon, "createView returns our button");

            assert.ok(fnCreateView.calledOnce, "createView called");
            assert.ok(fnCreateView.calledWith({
                id: oAppContainer.getId() + "-content",
                type: "XML",
                viewData: { config: { a: 1, b: 2 } },
                viewName: "some.random.view.path.Viewname"
            }), "createView args");
        });
    });

    QUnit.test("createUi5View with view data", function (assert) {
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl(window.location.origin + "/sap/public/bc/ui2/staging/test?foo=bar&foo=baz&bar=baz");
        // explicitely use ".view." in the view's path to check that this is no problem
        oAppContainer.setAdditionalInformation("SAPUI5=some.random.view.path.Viewname.view.xml");

        var oIcon = new Icon();
        var fnRegisterModulePath = sandbox.spy(sap.ui.loader, "config");
        // return a button instead of a view, so that we have a control with the necessary
        // properties, but don't have to supply another file for the view definition
        var fnCreateView = sandbox.stub(View, "create").resolves(oIcon);

        return oAppContainer._createUi5View(oAppContainer, oAppContainer.getUrl(), oAppContainer.getAdditionalInformation()).then(function (oView) {
            assert.strictEqual(oView, oIcon, "createView returns our button");

            assert.ok(fnRegisterModulePath.calledOnce, "registerModulePath called");
            assert.ok(fnCreateView.calledOnce, "createView called");
            assert.ok(fnCreateView.calledWith({
                id: oAppContainer.getId() + "-content",
                type: "XML",
                viewData: { foo: ["bar", "baz"], bar: ["baz"] },
                viewName: "some.random.view.path.Viewname"
            }), "createView args");
        });
    });

    QUnit.test("createUi5View: invalid view type", function (assert) {
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl(window.location.origin + "/sap/public/bc/ui2/staging/test");
        oAppContainer.setAdditionalInformation("SAPUI5=path.Viewname.view.foo");

        var fnCreateView = sandbox.spy(View, "create");

        try {
            oAppContainer._createUi5View(oAppContainer, oAppContainer.getUrl(), oAppContainer.getAdditionalInformation());
        } catch (e) {
            assert.ok(true, "error was thrown");
        }
        assert.ok(fnCreateView.calledWith({
            id: oAppContainer.getId() + "-content",
            type: "FOO",
            viewData: {},
            viewName: "path.Viewname"
        }), "createView args");
    });

    function createComponentViaSapui5 (assert, sQueryString, oExpectedComponentData) {
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl(window.location.origin + "/sap/public/bc/ui2/staging/test" + sQueryString);
        oAppContainer.setAdditionalInformation("SAPUI5=some.random.path");
        oAppContainer.setWidth("11%");
        oAppContainer.setHeight("180px");

        sandbox.spy(sap.ui.loader, "config");

        return oAppContainer._createUi5View(oAppContainer, oAppContainer.getUrl(), oAppContainer.getAdditionalInformation()).then(function (oControl) {

            assert.strictEqual(oControl.getId(), oAppContainer.getId() + "-content", "component container ID");
            assert.ok(oControl.getComponentInstance() instanceof oTestComponent,
                "created the correct component");
            assert.strictEqual(oControl.getComponentInstance().getId(), oAppContainer.getId() + "-component",
                "component ID");
            assert.deepEqual(oControl.getComponentInstance().getComponentData(), oExpectedComponentData,
                "passed the component data correctly");
            assert.strictEqual(oControl.getWidth(), "11%");
            assert.strictEqual(oControl.getHeight(), "180px");
            assert.ok(oControl.hasStyleClass("sapUShellApplicationContainer"),
                "style sapUShellApplicationContainer applied");
            assert.strictEqual(oControl.getParent(), oAppContainer, "control's parent is the container");
        });
    }

    QUnit.test("createUi5View: component w/o componentData", function (assert) {
        return createComponentViaSapui5(assert, "", { startupParameters: {} });
    });

    QUnit.test("createUi5View: component w/ componentData", function (assert) {
        return createComponentViaSapui5(assert, "?foo=bar&foo=baz&sap-xapp-state=12343&bar=baz", {
            startupParameters: { foo: ["bar", "baz"], bar: ["baz"] },
            "sap-xapp-state": ["12343"]
        });
    });

    QUnit.test("createUi5View: component w/ componentData and sap-xapp-state-data", function (assert) {
        var oAppStateData = { a: 1 };
        var sAppStateData = JSON.stringify(oAppStateData);
        var sQueryString = "?foo=bar&foo=baz&sap-xapp-state-data=" + encodeURIComponent(sAppStateData) + "&bar=baz";
        return createComponentViaSapui5(assert, sQueryString, {
            startupParameters: { foo: ["bar", "baz"], bar: ["baz"] },
            "sap-xapp-state": [sAppStateData]
        });
    });

    QUnit.test("createUi5View: sap-xapp-state overrides sap-xapp-state-data", function (assert) {
        var oAppStateData = { a: 1 };
        var sAppStateData = JSON.stringify(oAppStateData);
        var sQueryString = "?foo=bar&sap-xapp-state=12343&sap-xapp-state-data=" + encodeURIComponent(sAppStateData) + "&bar=baz";
        return createComponentViaSapui5(assert, sQueryString, {
            startupParameters: { foo: ["bar"], bar: ["baz"] },
            "sap-xapp-state": ["12343"]
        });
    });

    QUnit.test("createUi5View: missing namespace", function (assert) {
        Application.destroy(oAppContainer);
        oAppContainer = new ApplicationContainer();
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl(window.location.origin + "/");
        oAppContainer.setAdditionalInformation("SAPUI5=Viewname.view.js");

        testFailingCreateUi5View(assert, oAppContainer, "Missing namespace");
    });

    QUnit.test("createUi5View: illegal namespace", function (assert) {
        Application.destroy(oAppContainer);
        oAppContainer = new ApplicationContainer();
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl(window.location.origin + "/");
        oAppContainer.setAdditionalInformation("SAPUI5=foo/bar/view.Viewname.view.js");

        testFailingCreateUi5View(assert, oAppContainer, "Invalid SAPUI5 URL");
    });

    QUnit.test("createUi5View: missing view name", function (assert) {
        Application.destroy(oAppContainer);
        oAppContainer = new ApplicationContainer();
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl(window.location.origin + "/");
        oAppContainer.setAdditionalInformation("SAPUI5=.view.js");

        testFailingCreateUi5View(assert, oAppContainer, "Invalid SAPUI5 URL");
    });

    QUnit.test("createUi5View: with application config and without view name", function (assert) {
        Application.destroy(oAppContainer);
        oAppContainer = new ApplicationContainer();
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl(window.location.origin + "/sap/public/bc/ui2/staging/test?foo=bar&foo=baz&sap-xapp-state=1234242&bar=baz");
        oAppContainer.setAdditionalInformation("SAPUI5=.view.js");
        oAppContainer.setApplicationConfiguration({ a: 1, b: 2 });

        sandbox.stub(Container, "getServiceAsync").resolves({});

        testFailingCreateUi5View(assert, oAppContainer, "Invalid SAPUI5 URL");

        var oResult = oAppContainer._createUi5Component(oAppContainer, oAppContainer.getUrl(), "some.random.path");
        assert.ok(oResult.oControl === undefined);
        assert.ok(oResult.oPromise !== undefined);
        return oResult.oPromise.then(function (oControl) {
            assert.deepEqual(oControl.getComponentInstance().getComponentData(),
                {
                    "sap-xapp-state": ["1234242"],
                    startupParameters: { foo: ["bar", "baz"], bar: ["baz"] },
                    config: { a: 1, b: 2 }
                },
                "passed the component data correctly"
            );
        });
    });

    QUnit.test("destroyChild() w/o child", function (assert) {
        sandbox.spy(oAppContainer, "destroyAggregation");

        oAppContainer._destroyChild(oAppContainer);

        assert.ok(oAppContainer.destroyAggregation.calledWith("child"), "child destroyed");
    });

    QUnit.test("destroyChild() w/ component", function (assert) {
        sandbox.stub(Container, "getServiceAsync").resolves({});

        oAppContainer._createUi5Component(oAppContainer, oAppContainer.getUrl(), "some.random.path");

        sandbox.spy(oAppContainer, "destroyAggregation");

        oAppContainer._destroyChild(oAppContainer);

        assert.ok(oAppContainer.destroyAggregation.calledWith("child"), "child destroyed");
    });

    QUnit.test("exit: destroyChild called", function (assert) {
        Application.destroy(oAppContainer);
        oAppContainer = new ApplicationContainer();
        sandbox.spy(ApplicationContainer.prototype, "_destroyChild");

        oAppContainer.exit();

        assert.ok(oAppContainer._destroyChild.calledWith(oAppContainer),
            "destroyChild called");
    });

    QUnit.test("exit: messageEventListener removed", function (assert) {
        var fnListenerDummy = sandbox.stub();
        var oRemoveEventListenerSpy = sandbox.spy(window, "removeEventListener");

        oAppContainer._messageEventListener = fnListenerDummy;

        oAppContainer.exit();

        assert.ok(oRemoveEventListenerSpy.calledWith("message", fnListenerDummy));
    });

    QUnit.test("exit: storageEventListener removed", function (assert) {
        var fnListenerDummy = sandbox.stub();
        var oRemoveEventListenerSpy = sandbox.spy(window, "removeEventListener");

        oAppContainer._storageEventListener = fnListenerDummy;

        oAppContainer.exit();

        assert.ok(oRemoveEventListenerSpy.calledWith("storage", fnListenerDummy));
    });

    QUnit.test("exit: unloadEventListener removed", function (assert) {
        var fnListenerDummy = sandbox.stub();
        var oRemoveEventListenerSpy = sandbox.spy(window, "removeEventListener");

        oAppContainer._unloadEventListener = fnListenerDummy;

        oAppContainer.exit();

        assert.ok(oRemoveEventListenerSpy.calledWith("pagehide", fnListenerDummy));
    });

    QUnit.test("sap.ushell.components.container.render UI5 (SAPUI5.component=)", function (assert) {
        Application.destroy(oAppContainer);
        oAppContainer = new ApplicationContainer();

        var oControl = new Icon(), // any control with width and height is sufficient
            oRenderManager = new RenderManager().getRendererInterface(),
            oCreateUi5ComponentStub = sandbox.stub(ApplicationContainer.prototype, "_createUi5Component")
                .returns({ oControl: oControl }),
            oRenderControlInDivStub = sandbox.stub(ApplicationContainer.prototype, "_renderControlInDiv");

        oAppContainer._render(oRenderManager, oAppContainer, ApplicationType.URL.type, sTESTURL, "SAPUI5.Component=some.random.path");

        return oAppContainer.getDeffedControlCreation().then(function () {
            assert.ok(oCreateUi5ComponentStub.calledOnce);
            assert.ok(oCreateUi5ComponentStub.calledWith(oAppContainer, sTESTURL, "some.random.path"));
            assert.ok(oRenderControlInDivStub.calledWith(oRenderManager, oAppContainer));
        });
    });

    QUnit.test("rerender without property change does not recreate component", function (assert) {
        Application.destroy(oAppContainer);
        oAppContainer = new ApplicationContainer();

        var oControl = new Icon(); // any control with width and height is sufficient
        var oRenderManager = new RenderManager();
        var oCreateUi5ComponentStub = sandbox.stub(ApplicationContainer.prototype,
            "_createUi5Component").returns({ oControl: oControl });

        // render the container twice (can happen due to async rerendering)
        oAppContainer._render(oRenderManager, oAppContainer, ApplicationType.URL.type, sTESTURL, "SAPUI5.Component=some.random.path");

        return oAppContainer.getDeffedControlCreation().then(function () {
            var fnOriginalGetAggregation = oAppContainer.getAggregation;
            sandbox.stub(oAppContainer, "getAggregation").callsFake(function (sAggregationName) {
                if (sAggregationName === "dragDropConfig") {
                    return fnOriginalGetAggregation.call(oAppContainer, sAggregationName);
                }
                if (sAggregationName === "customData") {
                    return [];
                }
                return oControl;
            });

            oAppContainer._render(oRenderManager, oAppContainer, ApplicationType.URL.type, sTESTURL, "SAPUI5.Component=some.random.path");

            // unless there is a change in the properties, the component should only be instantiated once
            oAppContainer.getDeffedControlCreation();
        }).then(function () {
            assert.ok(oCreateUi5ComponentStub.calledOnce);
        });
    });

    [{
        sProperty: "URL",
        fnSetter: function (oContainer) { oContainer.setUrl("http://new/url"); }
    }, {
        sProperty: "additionalInformation",
        fnSetter: function (oContainer) { oContainer.setAdditionalInformation("SAPUI5.Component=new.component"); }
    }, {
        sProperty: "applicationType",
        fnSetter: function (oContainer) { oContainer.setApplicationType(ApplicationType.NWBC.type); }
    }].forEach(function (oFixture) {
        // TODO: handle setHeight, setWidth; setApplication still relevant at all?
        QUnit.test("rerender with changed " + oFixture.sProperty + " does recreate component", function (assert) {
            Application.destroy(oAppContainer);
            oAppContainer = new ApplicationContainer();

            var oControl = new Icon(); // any control with width and height is sufficient
            var oRenderManager = new RenderManager();
            var oCreateUi5ComponentStub = sandbox.stub(ApplicationContainer.prototype,
                "_createUi5Component").returns({ oControl: oControl });

            // render the container twice (can happen due to async rerendering)
            oAppContainer._render(oRenderManager, oAppContainer, ApplicationType.URL.type, sTESTURL, "SAPUI5.Component=some.random.path");
            return oAppContainer.getDeffedControlCreation().then(function () {
                var fnOriginalGetAggregation = oAppContainer.getAggregation;
                sandbox.stub(oAppContainer, "getAggregation").callsFake(function (sAggregationName) {
                    if (sAggregationName === "dragDropConfig") {
                        return fnOriginalGetAggregation.call(oAppContainer, sAggregationName);
                    }
                    if (sAggregationName === "customData") {
                        return [];
                    }
                    return oControl;
                });

                oFixture.fnSetter(oAppContainer);

                oAppContainer._render(oRenderManager, oAppContainer, ApplicationType.URL.type, sTESTURL, "SAPUI5.Component=some.random.path");
                return oAppContainer.getDeffedControlCreation();
            }).then(function () {
                // since there was change in the properties, the component should be instantiated twice
                assert.ok(oCreateUi5ComponentStub.calledTwice);
            });
        });
    });

    // Documentation can be found at http://docs.jquery.com/QUnit
    QUnit.module("components/container/ApplicationContainer.js", {
        beforeEach: function () {
            // Avoid writing to localStorage in any case
            // Never spy on localStorage, this is a strange object in IE9!
            oGlobalRM = new RenderManager();
            oAppContainer = new ApplicationContainer();

            sandbox.stub(Storage.prototype, "removeItem");
            sandbox.stub(Storage.prototype, "setItem");
            sandbox.stub(ApplicationContainer.prototype, "_publishExternalEvent");
            sandbox.stub(VersionInfo, "load").returns({ version: undefined });
        },
        // This method is called after each test. Add every restoration code here.
        afterEach: function () {
            oGlobalRM.destroy();
            oGlobalRM = undefined;
            sandbox.restore();
        }
    });

    // TODO: Vadik please fix this
    // asyncTest("createUi5Component w.o. explicit startup data : defaulting of startupParameters", function () {
    //     oAppContainer.setApplicationType(ApplicationType.URL.type);
    //     oAppContainer.setUrl("http://example.org/sap/public/bc/ui2/staging/test");
    //     oAppContainer.setAdditionalInformation("SAPUI5.Component=some.random.path");
    //     oAppContainer.setApplicationConfiguration({"a": 1, "b": 2});
    //
    //     var oControl,
    //         cnt = 0,
    //         fct;
    //
    //     ObjectPath.create("sap.ushell.Container");
    //     sap.ushell.Container.getService = function (sService) {};
    //
    //     fct = function (sChannelId, sEventId, oArgs) {
    //         start();
    //         equal(cnt, 1, "correct asynchronous event");
    //         ok(oControl.getComponentInstance() === oArgs.component, "correct component");
    //         sap.ui.getCore().getEventBus().unsubscribe("sap.ushell", "appComponentLoaded", fct);
    //     };
    //     // enable eventing!
    //     sandbox.restore(oAppContainer._publishExternalEvent);
    //     sap.ui.getCore().getEventBus().subscribe("sap.ushell", "appComponentLoaded", fct);
    //     oControl = oAppContainer._createUi5Component(oAppContainer,
    //         oAppContainer.getUrl(), "some.random.path");
    //     cnt = cnt + 1;
    //     equal(oControl.getComponentInstance().getComponentData().hasOwnProperty("sap-xapp-state"), false, "no sap-xapp-state");
    //     deepEqual(oControl.getComponentInstance().getComponentData(),
    //         {  startupParameters: {},
    //             config: {"a": 1, "b": 2}},
    //         "passed the component data correctly");
    // });

    // Vadik please fix this
    // asyncTest("createUi5Component with explicit startup data : defaulting of startupParameters", function () {
    //     oAppContainer.setApplicationType(ApplicationType.URL.type);
    //     oAppContainer.setUrl("http://example.org/sap/public/bc/ui2/staging/test?sap-xapp-state=ABC&c=3");
    //     oAppContainer.setAdditionalInformation("SAPUI5.Component=some.random.path");
    //     oAppContainer.setApplicationConfiguration({"a": [1], "b": [2]});
    //
    //     var oControl,
    //         cnt = 0,
    //         fct;
    //
    //     ObjectPath.create("sap.ushell.Container");
    //     sap.ushell.Container.getService = function (sService) {};
    //
    //     fct = function (sChannelId, sEventId, oArgs) {
    //         start();
    //         equal(cnt, 1, "correct asynchronous event");
    //         ok(oControl.getComponentInstance() === oArgs.component, "correct component");
    //         sap.ui.getCore().getEventBus().unsubscribe("sap.ushell", "appComponentLoaded", fct);
    //     };
    //     // enable eventing!
    //     sandbox.restore(oAppContainer._publishExternalEvent);
    //     sap.ui.getCore().getEventBus().subscribe("sap.ushell", "appComponentLoaded", fct);
    //     oControl = oAppContainer._createUi5Component(oAppContainer,
    //         oAppContainer.getUrl(), "some.random.path");
    //     cnt = cnt + 1;
    //     equal(oControl.getComponentInstance().getComponentData().hasOwnProperty("sap-xapp-state"), true, "sap-xapp-state");
    //     deepEqual(oControl.getComponentInstance().getComponentData(),
    //         {  startupParameters: { "c" : ["3"]},
    //             "sap-xapp-state" : ["ABC"],
    //             config: {"a": [1], "b": [2]}},
    //         "passed the component data correctly");
    // });
    //

    // Vadik can you fix this
    // asyncTest("createUi5Component event sap.ushell.components.container.ApplicationContainer / componentCreacted fired", function () {
    //     oAppContainer.setApplicationType(ApplicationType.URL.type);
    //     oAppContainer.setUrl("http://example.org/sap/public/bc/ui2/staging/test?foo=bar&foo=baz&sap-xapp-state=1234242&bar=baz");
    //     oAppContainer.setAdditionalInformation("SAPUI5.Component=some.random.path");
    //     oAppContainer.setApplicationConfiguration({"a": 1, "b": 2});
    //
    //     var oControl,
    //         cnt = 0,
    //         fct;
    //
    //     ObjectPath.create("sap.ushell.Container");
    //     sap.ushell.Container.getService = function (sService) {};
    //
    //     fct = function (sChannelId, sEventId, oArgs) {
    //         start();
    //         equal(cnt, 1, "correct asynchronous event");
    //         ok(oControl.getComponentInstance() === oArgs.component, "correct component");
    //         sap.ui.getCore().getEventBus().unsubscribe("sap.ushell", "appComponentLoaded", fct);
    //     };
    //     // enable eventing!
    //     sandbox.restore(oAppContainer._publishExternalEvent);
    //     sap.ui.getCore().getEventBus().subscribe("sap.ushell", "appComponentLoaded", fct);
    //     oControl = oAppContainer._createUi5Component(oAppContainer,
    //         oAppContainer.getUrl(), "some.random.path");
    //     cnt = cnt + 1;
    //     deepEqual(oControl.getComponentInstance().getComponentData(),
    //         {  "sap-xapp-state" : [ "1234242" ],
    //             startupParameters: {foo: ["bar", "baz"], bar: ["baz"]},
    //             config: {"a": 1, "b": 2}},
    //         "passed the component data correctly");
    // });

    QUnit.test("createUi5Component event sap.ushell.components.container.ApplicationContainer / _prior.newUI5ComponentInstantion fired before component instantiation", function (assert) {
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl(window.location.origin + "/sap/public/bc/ui2/staging/test?foo=bar&foo=baz&sap-xapp-state=1234242&bar=baz");
        oAppContainer.setAdditionalInformation("SAPUI5.Component=some.random.path");
        oAppContainer.setApplicationConfiguration({ a: 1, b: 2 });

        var cnt = 0;
        var fct = function (sChannelId, sEventId, oArgs) {
            assert.equal(cnt, 0, "correct asynchronous event");
            assert.deepEqual(oArgs.name, "some.random.path", "correct arguments");
            EventBus.getInstance().unsubscribe("sap.ushell.components.container.ApplicationContainer", "_prior.newUI5ComponentInstantion", fct);
        };

        sandbox.stub(Container, "getServiceAsync").resolves({});

        EventBus.getInstance().subscribe("sap.ushell.components.container.ApplicationContainer", "_prior.newUI5ComponentInstantion", fct);

        var oResult = oAppContainer._createUi5Component(oAppContainer, oAppContainer.getUrl(), "some.random.path");
        assert.ok(oResult.oControl === undefined);
        assert.ok(oResult.oPromise !== undefined);
        return oResult.oPromise.then(function (oControl) {
            cnt = cnt + 1;
            assert.deepEqual(oControl.getComponentInstance().getComponentData(),
                {
                    "sap-xapp-state": ["1234242"],
                    startupParameters: { foo: ["bar", "baz"], bar: ["baz"] },
                    config: { a: 1, b: 2 }
                },
                "passed the component data correctly");
        });
    });

    QUnit.test("disable router : invoked stop if getRouter returns something present", function (assert) {
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl(window.location.origin + "/sap/public/bc/ui2/staging/test?foo=bar&foo=baz&sap-xapp-state=1234242&bar=baz");
        oAppContainer.setAdditionalInformation("SAPUI5.Component=some.random.path");
        oAppContainer.setApplicationConfiguration({ a: 1, b: 2 });

        sandbox.stub(Container, "getServiceAsync").resolves({});

        var oResult = oAppContainer._createUi5Component(oAppContainer, oAppContainer.getUrl(), "some.random.path");
        assert.ok(oResult.oControl === undefined);
        assert.ok(oResult.oPromise !== undefined);
        return oResult.oPromise.then(function (oControl) {
            assert.deepEqual(oControl.getComponentInstance().getComponentData(),
                {
                    "sap-xapp-state": ["1234242"],
                    startupParameters: { foo: ["bar", "baz"], bar: ["baz"] },
                    config: { a: 1, b: 2 }
                },
                "passed the component data correctly");
            var oRouterStopStub = sandbox.stub();
            oControl.getComponentInstance().getRouter = sandbox.stub().returns({ stop: oRouterStopStub });
            // simulate event
            oAppContainer._disableRouter(oControl.getComponentInstance());
            assert.ok(oRouterStopStub.called, "stop was called");
        });
    });

    QUnit.test("disable router : there is an evenhandler registered which effectively disables the router when the event is fired", function (assert) {
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl(window.location.origin + "/sap/public/bc/ui2/staging/test?foo=bar&foo=baz&sap-xapp-state=1234242&bar=baz");
        oAppContainer.setAdditionalInformation("SAPUI5.Component=some.random.path");
        oAppContainer.setApplicationConfiguration({ a: 1, b: 2 });

        var spySubscribe = sandbox.spy(EventBus.getInstance(), "subscribe");

        sandbox.stub(Container, "getServiceAsync").resolves({});

        var oResult = oAppContainer._createUi5Component(oAppContainer, oAppContainer.getUrl(), "some.random.path");
        assert.ok(oResult.oControl === undefined);
        assert.ok(oResult.oPromise !== undefined);
        return oResult.oPromise.then(function (oControl) {
            assert.deepEqual(oControl.getComponentInstance().getComponentData(),
                {
                    "sap-xapp-state": ["1234242"],
                    startupParameters: { foo: ["bar", "baz"], bar: ["baz"] },
                    config: { a: 1, b: 2 }
                },
                "passed the component data correctly");
            assert.equal(typeof oAppContainer._disableRouterEventHandler, "function", " function stored");
            assert.equal(spySubscribe.args[0][0], "sap.ushell.components.container.ApplicationContainer", "subscribe arg1");
            assert.equal(spySubscribe.args[0][1], "_prior.newUI5ComponentInstantion", "subscribe arg1");
            assert.equal(spySubscribe.args[0][2], oAppContainer._disableRouterEventHandler, " function registered");
            var oRouterStopStub = sandbox.stub();
            oControl.getComponentInstance().getRouter = sandbox.stub().returns({ stop: oRouterStopStub });
            // simulate event
            EventBus.getInstance().publish("sap.ushell.components.container.ApplicationContainer", "_prior.newUI5ComponentInstantion", {});
            assert.ok(oRouterStopStub.called, "stop was called");
        });
    });

    QUnit.test("disable Router: exit unsubscribes Event", function (assert) {
        sandbox.spy(oAppContainer, "destroyAggregation");
        var spyUnSubscribe = sandbox.spy(EventBus.getInstance(), "unsubscribe");
        oAppContainer._disableRouterEventHandler = function () { return "a"; };
        assert.equal(typeof oAppContainer._disableRouterEventHandler, "function", " function stored");
        oAppContainer.exit();
        assert.equal(spyUnSubscribe.args[0][0], "sap.ushell.components.container.ApplicationContainer", "subscribe arg1");
        assert.equal(spyUnSubscribe.args[0][1], "_prior.newUI5ComponentInstantion", "subscribe arg1");
        assert.equal(spyUnSubscribe.args[0][2], oAppContainer._disableRouterEventHandler, " function registered");

        if (this._disableRouterEventHandler) {
            EventBus.getInstance().unsubscribe("sap.ushell.components.container.ApplicationContainer", "_prior.newUI5ComponentInstantion", this._disableRouterEventHandler);
        }
        oAppContainer.exit();
        assert.ok(oAppContainer.destroyAggregation.calledWith("child"), "child destroyed");
    });

    QUnit.test("createUi5Component with configuration data", function (assert) {
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl("./sap/public/bc/ui2/staging/test?foo=bar&foo=baz&sap-xapp-state=1234242&bar=baz");
        oAppContainer.setAdditionalInformation("SAPUI5.Component=some.random.path");
        oAppContainer.setApplicationConfiguration({ a: 1, b: 2 });

        sandbox.stub(Container, "getServiceAsync").resolves({});

        var oResult = oAppContainer._createUi5Component(oAppContainer, oAppContainer.getUrl(), "some.random.path");
        assert.ok(oResult.oControl === undefined);
        assert.ok(oResult.oPromise !== undefined);
        return oResult.oPromise.then(function (oControl) {
            assert.deepEqual(oControl.getComponentInstance().getComponentData(),
                {
                    "sap-xapp-state": ["1234242"],
                    startupParameters: { foo: ["bar", "baz"], bar: ["baz"] },
                    config: { a: 1, b: 2 }
                },
                "passed the component data correctly");
        });
    });

    // TODO: vadik please fix this
    // test("createUi5Component", function () {
    //     oAppContainer.setApplicationType(ApplicationType.URL.type);
    //     oAppContainer.setUrl("http://example.org/sap/public/bc/ui2/staging/test?foo=bar&foo=baz&sap-xapp-state=1234242&bar=baz");
    //     oAppContainer.setAdditionalInformation("SAPUI5.Component=some.random.path");
    //     oAppContainer.setWidth("11%");
    //     oAppContainer.setHeight("180px");
    //     var oControl;
    //     sandbox.spy(jQuery.sap, "registerModulePath");
    //     sandbox.spy(oAppContainer, "_destroyChild");
    //     sandbox.spy(sap.ui, "component");
    //     ObjectPath.create("sap.ushell.Container");
    //     sap.ushell.Container.getService = function (sService) {};
    //     oControl = oAppContainer._createUi5Component(oAppContainer,
    //         oAppContainer.getUrl(), "some.random.path");
    //     ok(oAppContainer._destroyChild.calledBefore(sap.ui.core.Component),
    //         "child destroyed before creating the component");
    //     ok(sap.ui.loader.config.calledWithExactly("some.random.path",
    //         "http://example.org/sap/public/bc/ui2/staging/test/"),
    //         "registered the component correctly");
    //     ok(!sap.ui.loader.config.calledWith("sap.ca"), "did not register sap.ca");
    //     strictEqual(oControl.getId(), oAppContainer.getId() + "-content", "component container ID");
    //     ok(oControl.getComponentInstance() instanceof some.random.path.Component,
    //         "created the correct component");
    //     strictEqual(oControl.getComponentInstance().getId(), oAppContainer.getId() + "-component",
    //         "component ID");
    //     deepEqual(oControl.getComponentInstance().getComponentData(),
    //         {  "sap-xapp-state" : [ "1234242" ],
    //             startupParameters: {foo: ["bar", "baz"], bar: ["baz"]}},
    //         "passed the component data correctly");
    //     strictEqual(oControl.getWidth(), "11%");
    //     strictEqual(oControl.getHeight(), "180px");
    //     ok(oControl.hasStyleClass("sapUShellApplicationContainer"),
    //         "style sapUShellApplicationContainer applied");
    //     strictEqual(oControl.getParent(), oAppContainer, "control's parent is the container");
    // });

    [
        { additionalInfo: "SAPUI5=some.random.path", configuration: { foo: "bar" } },
        { additionalInfo: "SAPUI5.Component=some.random.path", configuration: { foo: "bar" } },
        { additionalInfo: "SAPUI5=some.random.path.no.config", configuration: undefined },
        { additionalInfo: "SAPUI5.Component=some.random.path.no.config", configuration: undefined },
        { additionalInfo: "SAPUI5=some.random.path.SomeView.view.xml", configuration: undefined },
        { additionalInfo: undefined, configuration: undefined },
        { type: ApplicationType.WDA.type, additionalInfo: undefined, configuration: undefined },
        { type: "INVALID_TYPE: Event fired even on error" }
    ].forEach(function (oFixture) {
        QUnit.test("application configuration: " + JSON.stringify(oFixture), function (assert) {
            var fnDone = assert.async();
            var oIcon = new Icon();
            var oRenderManager = new RenderManager();

            sandbox.stub(Container, "getServiceAsync").resolves({});
            sandbox.stub(Container, "attachLogoutEvent");
            sandbox.stub(Container, "addRemoteSystem");
            sandbox.stub(Container, "getUser").returns({
                getTheme: sandbox.stub(),
                getAccessibilityMode: sandbox.stub()
            });

            var oViewCreateStub = sandbox.stub(View, "create").resolves(oIcon);
            // no sandbox spy as event handler:
            // SAPUI5 empties event object at end of EventProvider.prototype.fireEvent
            oAppContainer.attachApplicationConfiguration(function (oEvent) {
                assert.ok(true, "event 'applicationConfiguration' sent");
                assert.strictEqual(oEvent.getId(), "applicationConfiguration", "event name");
                assert.deepEqual(oEvent.getParameter("configuration"), oFixture.configuration,
                    "event payload is component configuration");
                fnDone();
            });
            oAppContainer._render(oRenderManager, oAppContainer, oFixture.type || ApplicationType.URL.type,
                "./ushell/test-resources/sap/ushell/test/components/container", oFixture.additionalInfo);

            oViewCreateStub.restore();
        });
    });

    QUnit.test("ApplicationContainer invisible with Application", function (assert) {
        var oApplication = getApplication();
        var oRenderManager = new RenderManager();

        oAppContainer.setApplication(oApplication);
        oAppContainer.setVisible(false);

        sandbox.stub(oAppContainer, "_render");
        oRenderManager.render(oAppContainer, document.createElement("DIV"));

        assert.ok(oAppContainer._render.notCalled);
    });

    QUnit.test("ApplicationContainer Application rendering", function (assert) {
        var oApplication = getApplication({
            type: ApplicationType.URL.type,
            url: sTESTURL
        });
        oAppContainer.setApplicationType(ApplicationType.WDA.type);
        oAppContainer.setApplication(oApplication);
        oAppContainer.setUrl("/should/not/be/used");
        oAppContainer.setAdditionalInformation("SAPUI5=should.not.be.used.view.xml");

        renderAndExpect(assert, oAppContainer, oApplication.getType(), oApplication.getUrl(), "");
    });

    QUnit.test("createSystemForUrl", function (assert) {
        function check (sUrl, oExpectedSystem) {
            var oSystem = oAppContainer._createSystemForUrl(sUrl);
            assert.strictEqual(oSystem.getAlias(), oExpectedSystem.alias, "alias for " + sUrl);
            assert.strictEqual(oSystem.getBaseUrl(), oExpectedSystem.baseUrl, "baseUrl for " + sUrl);
            assert.strictEqual(oSystem.getClient(), oExpectedSystem.client, "client for " + sUrl);
            assert.strictEqual(oSystem.getPlatform(), "abap", "platform for " + sUrl);
        }

        check(window.location.origin + "/sap/bc/ui2/wda/~canvas?foo=bar", {
            alias: window.location.origin,
            baseUrl: window.location.origin
        });
        check(window.location.origin + "/sap/bc/ui2/wda/~canvas?foo=bar&sap-client=120", {
            alias: window.location.origin + "?sap-client=120",
            baseUrl: window.location.origin,
            client: "120"
        });
    });

    QUnit.test("ApplicationContainer logout de-/registration", function (assert) {
        // TODO:
        // In this test the app type changes for an existing ApplicationContainer instance.
        // Is this really a supported scenario?!
        // My impression is that  this cannot happen in reality...
        // See also FLPCOREANDUX-9173

        return Container.init("local").then(function () {
            mockSapUshellContainer();
            var oMockOverrides = {
                "/utils/bStubLocalStorageSetItem": false
            };

            oAppContainer.setApplicationType(ApplicationType.WDA.type);
            oAppContainer.setUrl(window.location.origin + "/sap/bc/ui2/wda/~canvas");

            var fnLogout;

            sandbox.spy(ApplicationContainer.prototype, "_createSystemForUrl");

            renderInternallyAndExpectIFrame(assert, oAppContainer, ApplicationType.WDA.type,
                window.location.origin + "/sap/bc/ui2/wda/~canvas", oMockOverrides);
            assert.ok(Container.attachLogoutEvent.callCount === 0, "logout NOT registered");
            assert.strictEqual(oAppContainer._getLogoutHandler(oAppContainer), undefined);

            oAppContainer.setApplicationType(ApplicationType.NWBC.type);
            oAppContainer.setUrl(window.location.origin + "/sap/bc/ui2/NWBC/~canvas?sap-client=120");

            oAppContainer.getFrameSource.restore();
            renderInternallyAndExpectIFrame(assert, oAppContainer, ApplicationType.NWBC.type,
                window.location.origin + "/sap/bc/ui2/NWBC/~canvas?sap-client=120", oMockOverrides);
            assert.strictEqual(Container.attachLogoutEvent.getCalls().length, 1, "logout registered: attachLogoutEvent was called once");
            fnLogout = Container.attachLogoutEvent.args[0][0];
            assert.strictEqual(typeof fnLogout, "function", "a logout function has been attached when attachLogoutEvent was called");
            assert.strictEqual(oAppContainer._getLogoutHandler(oAppContainer), fnLogout, "can get the logout handler via _getLogoutHandler");

            assert.ok(oAppContainer._createSystemForUrl
                .calledWith(window.location.origin + "/sap/bc/ui2/NWBC/~canvas?sap-client=120"),
                "created a system for the URL");

            assert.ok(Container.addRemoteSystem
                .calledWith(oAppContainer._createSystemForUrl.returnValues[0]),
                "the system was added to the controller");

            Container.attachLogoutEvent.reset();
            Container.detachLogoutEvent.reset();

            oAppContainer.setApplicationType(ApplicationType.WDA.type);
            oAppContainer.setUrl(window.location.origin + "/sap/bc/ui2/WDA/~canvas");

            oAppContainer.getFrameSource.restore();
            renderInternallyAndExpectIFrame(assert, oAppContainer, ApplicationType.WDA.type,
                window.location.origin + "/sap/bc/ui2/WDA/~canvas", oMockOverrides);
            assert.ok(Container.detachLogoutEvent.callCount === 1, "logout deregistered");
            assert.strictEqual(Container.detachLogoutEvent.args[0][0], fnLogout);
            assert.ok(Container.attachLogoutEvent.callCount === 0, "logout NOT registered");
            assert.strictEqual(oAppContainer._getLogoutHandler(oAppContainer), undefined);

            Container.attachLogoutEvent.reset();
            Container.detachLogoutEvent.reset();

            ["NWBC", "TR"].forEach(function (sNwbcLikeApplicationType) {
                oAppContainer.setApplicationType(ApplicationType[sNwbcLikeApplicationType].type);
                oAppContainer.setUrl(window.location.origin + "/sap/bc/ui2/" + sNwbcLikeApplicationType + "/~canvas");
                oAppContainer.getFrameSource.restore();

                renderInternallyAndExpectIFrame(assert, oAppContainer, ApplicationType.enum[sNwbcLikeApplicationType],
                    window.location.origin + "/sap/bc/ui2/" + sNwbcLikeApplicationType + "/~canvas", oMockOverrides);
                fnLogout = Container.attachLogoutEvent.args[0][0];

                assert.strictEqual(oAppContainer._getLogoutHandler(oAppContainer), fnLogout);
                oAppContainer.exit();
                assert.strictEqual(oAppContainer._getLogoutHandler(oAppContainer), undefined,
                    "logout deregistered after exit");
                assert.ok(Container.detachLogoutEvent.called, "logout deregistered on exit");

                Container.attachLogoutEvent.reset();
                Container.detachLogoutEvent.reset();
            });
        });
    });

    ["NWBC", "TR"].forEach(function (sNwbcLikeApplicationType) {
        QUnit.test("ApplicationContainer " + sNwbcLikeApplicationType + " Logoff fired", function (assert) {
            return Container.init("local").then(function () {
                mockSapUshellContainer();
                oAppContainer.setApplicationType(ApplicationType.enum[sNwbcLikeApplicationType]);
                oAppContainer.setUrl(window.location.origin + "/sap/bc/ui2/nwbc/~canvas");

                var oEvent = new Event(),
                    sTagName;
                sandbox.spy(oEvent, "preventDefault");

                renderInternallyAndExpectIFrame(assert, oAppContainer,
                    ApplicationType.enum[sNwbcLikeApplicationType],
                    window.location.origin + "/sap/bc/ui2/nwbc/~canvas",
                    undefined, undefined, undefined, undefined, true);

                var oTagStub, oSetAttrSub, oContentStub, oPostMessageStub;

                // don't do anything if the tagName doesn't match "IFRAME"
                // sTagName is here undefined
                oTagStub = sandbox.stub(oAppContainer.getDomRef(), "tagName").value(sTagName);
                oSetAttrSub = sandbox.stub(oAppContainer.getDomRef(), "setAttribute").callsFake(sandbox.stub());
                oPostMessageStub = sandbox.spy(function (sMessage/*, sOrigin*/) {
                    assert.strictEqual(JSON.parse(sMessage).action, "pro54_disableDirtyHandler",
                        "disable NWBC window.beforeUnload handlers");
                });
                oContentStub = sandbox.stub(oAppContainer.getDomRef(), "contentWindow").value({
                    postMessage: oPostMessageStub
                });
                oAppContainer._logout(oAppContainer, oEvent);
                sTagName = "FOO";
                oTagStub.restore();
                oTagStub = sandbox.stub(oAppContainer.getDomRef(), "tagName").value(sTagName);
                oAppContainer._logout(oAppContainer, oEvent);
                assert.ok(oEvent.preventDefault.notCalled, "preventDefault not called");
                assert.ok(oSetAttrSub.notCalled, "setAttribute not called");
                assert.ok(oPostMessageStub.notCalled, "postMessage not called");

                // logout via iFrame fired
                sTagName = "IFRAME";
                oTagStub.restore();
                oTagStub = sandbox.stub(oAppContainer.getDomRef(), "tagName").value(sTagName);
                oAppContainer._logout(oAppContainer, oEvent);
                assert.ok(oEvent.preventDefault.calledOnce, "preventDefault called");
                assert.ok(oPostMessageStub.calledOnce, "postMessage called");
                oTagStub.restore();
                oSetAttrSub.restore();
                oContentStub.restore();
            });
        });
    });

    ["NWBC", "TR"].forEach(function (sNwbcLikeApplicationType) {
        QUnit.test("ApplicationContainer " + sNwbcLikeApplicationType + " Logoff 2 Instances", function (assert) {
            // This test does not use the ApplicationContainer instance created as part of the setup function,
            // because here are two instances needed.
            return Container.init("local").then(function () {
                mockSapUshellContainer();
                var oContainer1 = new ApplicationContainer({
                    applicationType: ApplicationType.enum[sNwbcLikeApplicationType]
                });
                var oContainer2 = new ApplicationContainer({
                    applicationType: ApplicationType.enum[sNwbcLikeApplicationType]
                });
                var fnLogout1,
                    fnLogout2;

                var oMockOverrides = { "/utils/bStubLocalStorageSetItem": false };

                // render first container
                oContainer1.setUrl(window.location.origin + "/sap/bc/ui2/nwbc/~canvas");
                renderInternallyAndExpectIFrame(assert, oContainer1, ApplicationType.enum[sNwbcLikeApplicationType],
                    window.location.origin + "/sap/bc/ui2/nwbc/~canvas", oMockOverrides);
                assert.ok(Container.attachLogoutEvent.callCount === 1, "logout registered 1st");
                fnLogout1 = Container.attachLogoutEvent.args[0][0];

                // render second container
                oContainer2.setUrl(window.location.origin + "/sap/bc/ui2/nwbc/~canvas");
                renderInternallyAndExpectIFrame(assert, oContainer2, ApplicationType.enum[sNwbcLikeApplicationType],
                    window.location.origin + "/sap/bc/ui2/nwbc/~canvas", oMockOverrides);
                assert.ok(Container.attachLogoutEvent.callCount === 2, "logout registered 2nd");
                fnLogout2 = Container.attachLogoutEvent.args[1][0];
                assert.ok(fnLogout1 !== fnLogout2, "first and second logout registration different");

                // test logout map entries
                assert.strictEqual(oContainer1._getLogoutHandler(oContainer1), fnLogout1);
                assert.strictEqual(oContainer2._getLogoutHandler(oContainer2), fnLogout2);
            });
        });
    });

    QUnit.test("ApplicationContainer Application with resolve", function (assert) {
        var fnDone = assert.async();
        var oApplication = getApplication({
            text: "test application",
            url: "/should/not/be/used",
            resolvable: true
        });
        var oLaunchpadData = {
            applicationType: "URL",
            applicationData: "SAPUI5=some.random.view.xml",
            Absolute: { url: sTESTURL + "?" }
        };
        var oLogMock = testUtils.createLogMock()
            .filterComponent(sCONTAINER)
            .debug("Resolving " + oApplication.getUrl(), null, sCONTAINER)
            .debug("Resolved " + oApplication.getUrl(), JSON.stringify(oLaunchpadData), sCONTAINER),
            oRenderManager = new RenderManager(),
            oLoadingIndicator;

        oAppContainer.setApplication(oApplication);
        oAppContainer.setApplicationType(ApplicationType.WDA.type);
        oAppContainer.setUrl("/should/not/be/used/either");
        oAppContainer.setAdditionalInformation("SAPUI5=should.not.be.used.view.xml");

        sandbox.stub(ApplicationContainer.prototype, "_getTranslatedText").returns("foo");
        sandbox.stub(oApplication, "resolve").callsFake(function (fnSuccess, fnError) {
            // simulate the resolve: call success handler with (necessary) launchpad data
            utils.call(function () {
                fnSuccess(oLaunchpadData);
                // verify
                assert.ok(oAppContainer.getAggregation("child") === null,
                    "Loading indicator has been deleted again");

                // As a consequence of the invalidate UI5 would render again; simulate this
                renderAndExpect(assert, oAppContainer, "URL", sTESTURL, "SAPUI5=some.random.view.xml");

                oLogMock.verify();
                fnDone();
            }, fnError, true);
        });

        sandbox.stub(ApplicationContainer.prototype, "_renderControlInDiv");

        oRenderManager.render(oAppContainer, document.createElement("DIV"));

        oLoadingIndicator = oAppContainer.getAggregation("child");
        assert.strictEqual(oAppContainer._renderControlInDiv.args[0].length, 3);
        assert.strictEqual(oAppContainer._renderControlInDiv.args[0][1], oAppContainer);
        assert.strictEqual(oAppContainer._renderControlInDiv.args[0][2], oLoadingIndicator);

        assert.ok(oAppContainer._getTranslatedText.calledWith("loading",
            [oApplication.getText()]), "loading indicator text requested");
        assert.strictEqual(oLoadingIndicator.getText(), "foo", "Loading indicator text ok");
    });

    [undefined, sandbox.spy()].forEach(function (fnApplicationErrorHandler) {
        var sResolveFailed = "resolve failed";
        QUnit.test("ApplicationContainer Application resolve error w/" + (fnApplicationErrorHandler ? "" : "o") + " error handler", function (assert) {
            var fnDone = assert.async();
            var oApplication = getApplication({
                resolvable: true,
                errorHandler: fnApplicationErrorHandler
            });
            var oDiv = document.createElement("DIV"),
                oRenderManager = new RenderManager();

            oAppContainer.setApplication(oApplication);

            sandbox.spy(ApplicationContainer.prototype, "_createErrorControl");
            sandbox.stub(ApplicationContainer.prototype, "_renderControlInDiv");
            sandbox.stub(oApplication, "resolve").callsFake(function (fnSuccess, fnError) {
                utils.call(function () {
                    // simulate the resolve: call error handler (asynchronously)
                    fnError(sResolveFailed);

                    // verify
                    assert.ok(oAppContainer._createErrorControl.notCalled);
                    if (fnApplicationErrorHandler) {
                        assert.ok(fnApplicationErrorHandler.calledOnce);
                        assert.ok(fnApplicationErrorHandler.calledWith(sResolveFailed));
                    }

                    // simulate SAPUI5's automatic re-rendering
                    oRenderManager.render(oAppContainer, oDiv);

                    // verify
                    assert.ok(oAppContainer._createErrorControl.calledOnce);
                    assert.strictEqual(oAppContainer._renderControlInDiv.args[0].length, 3);
                    assert.strictEqual(oAppContainer._renderControlInDiv.args[0][1], oAppContainer);
                    fnDone();
                }, testUtils.onError, true);
            });

            oRenderManager.render(oAppContainer, oDiv);
        });
    });

    QUnit.test("ApplicationContainer init", function (assert) {
        sandbox.spy(window, "addEventListener");
        // ApplicationContainer needs to be reinitialized here, because of the uid() call
        oAppContainer = new ApplicationContainer();

        assert.ok(oAppContainer.globalDirtyStorageKey.indexOf("sap.ushell.Container.dirtyState.") > -1, "id start with correct prefix");
        assert.ok(window.addEventListener.calledWith("pagehide"), "unload registered");
        assert.ok(window.addEventListener.calledWith("storage"), "storage registered");
        assert.ok(window.addEventListener.calledWith("message"), "message registered");
    });

    // test("MessageConcept | ApplicationContainer is instanciated twice", function () {
    //     var oContainer = new ApplicationContainer();
    //         setDefaultHandlersSpy = sandbox.spy(sap.m.MessagePopover, "setDefaultHandlers");
    //     ok(setDefaultHandlersSpy.calledOnce,
    //         "Initializing the application container the first time, setDefaultHandlers is called once");
    //     // Instanciating the application container a second time to simulate
    //     // the use case that setDefaultHandlers is not called again, because the
    //     // validation logic was already attached to the SAP UI5 MessagePopover control before
    //     oContainer = new ApplicationContainer();
    //     ok(!setDefaultHandlersSpy.calledTwice,
    //         "setDefaultHandlers is not called again");
    // });

    ["NWBC", "TR"].forEach(function (sNwbcLikeApplicationType) {
        QUnit.test("ApplicationContainer IDs in sync with localStorage when applicationType is " + sNwbcLikeApplicationType, function (assert) {
            return Container.init("local").then(function () {
                mockSapUshellContainer({
                    addRemoteSystem: undefined,
                    attachLogoutEvent: undefined,
                    detachLogoutEvent: undefined,
                    getLogonSystem: undefined,
                    _isLocalSystem: undefined
                });

                var oMockOverrides = { "/utils/bStubLocalStorageSetItem": false };

                oAppContainer.setApplicationType(ApplicationType.enum[sNwbcLikeApplicationType]);
                oAppContainer.setUrl(window.location.origin + "/sap/bc/ui2/NWBC/~canvas?sap-client=120");
                renderInternallyAndExpectIFrame(assert, oAppContainer, ApplicationType.enum[sNwbcLikeApplicationType],
                    window.location.origin + "/sap/bc/ui2/NWBC/~canvas?sap-client=120", oMockOverrides);
                assert.ok(Storage.prototype.removeItem.calledWith(oAppContainer.globalDirtyStorageKey),
                    "removeItem called");
                assert.ok(Storage.prototype.setItem.calledWith(oAppContainer.globalDirtyStorageKey, "INITIAL"),
                    "calledWith right ID");

                // render second time
                Storage.prototype.removeItem.reset();
                Storage.prototype.setItem.reset();
                oAppContainer.getFrameSource.restore();
                renderInternallyAndExpectIFrame(assert, oAppContainer, ApplicationType.enum[sNwbcLikeApplicationType],
                    window.location.origin + "/sap/bc/ui2/NWBC/~canvas?sap-client=120", oMockOverrides);
                assert.ok(Storage.prototype.removeItem.calledWith(oAppContainer.globalDirtyStorageKey),
                    "removeItem called");
                assert.ok(Storage.prototype.setItem.calledWith(oAppContainer.globalDirtyStorageKey, "INITIAL"),
                    "calledWith right ID");
                Storage.prototype.removeItem.reset();
                oAppContainer.exit();
                assert.ok(Storage.prototype.removeItem.calledOnce, "removeItem called after exit");
            });
        });
    });

    // test("handleMessageEvent for CrossApplicationNavigation with data as JSON object", function () {
    //     var oMessage = JSON.parse(JSON.stringify(oMessageTemplate));
    //     // test preparation
    //     delete oMessage.data.type;
    //     sandbox.stub(oAppContainer, "_handleMessageEvent");
    //     // function to be tested
    //     var oApplicationContainer = {
    //         getActive: sandbox.stub().returns(true)
    //     };
    //     oAppContainer._handleMessageEvent(oApplicationContainer, oMessage);
    //     ok(oAppContainer._handleServiceMessageEvent.calledOnce,
    //         "checks if handleServiceMessageEvent method gets called only once");
    //     ok(oAppContainer._handleServiceMessageEvent
    //         .calledWith(oApplicationContainer, oMessage, oMessage.data), "called with correct parameters");
    // });

    // test("handleMessageEvent for CrossApplicationNavigation with data as string", function () {
    //     var oMessage = JSON.parse(JSON.stringify(oMessageTemplate));
    //     // test preparation
    //     delete oMessage.data.type;
    //     oMessage.data = JSON.stringify(oMessage.data);
    //     sandbox.spy(ApplicationContainer.prototype, "_handleServiceMessageEvent");
    //     // function to be tested
    //     var oApplicationContainer = {
    //         getActive: sandbox.stub().returns(true)
    //     };
    //     oAppContainer._handleMessageEvent(oApplicationContainer, oMessage);
    //     ok(oAppContainer._handleServiceMessageEvent.calledOnce,
    //         "checks if handleServiceMessageEvent method gets called only once");
    //     ok(oAppContainer._handleServiceMessageEvent
    //         .calledWith(oApplicationContainer, oMessage, JSON.parse(oMessage.data)), "called with correct parameters");
    // });

    // Documentation can be found at http://docs.jquery.com/QUnit
    QUnit.module("components/container/ApplicationContainer.js", {
        beforeEach: function () {
            sandbox.restore();
            // Avoid writing to localStorage in any case
            // Never spy on localStorage, this is a strange object in IE9!
            oGlobalRM = new RenderManager();
            ApplicationContainer.prototype._resetPluginsLoadIndications();
            sandbox.stub(Storage.prototype, "removeItem");
            sandbox.stub(Storage.prototype, "setItem");
            sandbox.stub(VersionInfo, "load").returns({ version: undefined });

            BlueBoxHandler.init();
            Application.init(BlueBoxHandler, PostMessageUtils);
            oAppContainer = Application.createApplicationContainer("application-test-id", {
                sURL: "xxxxxxx"
            });

            // prevent deferred events unless explicitely enabled
            sandbox.stub(ApplicationContainer.prototype, "_publishExternalEvent");
        },
        // This method is called after each test. Add every restoration code here.
        afterEach: function () {
            if (ObjectPath.get("sap-ushell-config.services.PostMessage.config.config")) {
                ObjectPath.get("sap-ushell-config.services.PostMessage.config").config = undefined;
            }
            sandbox.restore();
            Application.destroy(oAppContainer);
            oAppContainer = undefined;
            oGlobalRM.destroy();
            oGlobalRM = undefined;
        }
    });

    [{
        testDescription: "getUi5ComponentName is null",
        fnGetUi5ComponentName: null,
        bContainerIsActive: true,
        expectedMessageHandled: true
    }, {
        testDescription: "getUi5ComponentName is undefined",
        fnGetUi5ComponentName: undefined,
        bContainerIsActive: true,
        expectedMessageHandled: true
    }, {
        testDescription: "getUi5ComponentName returns a UI5 component name",
        fnGetUi5ComponentName: sandbox.stub().returns("some.component.name"),
        bContainerIsActive: true,
        expectedMessageHandled: false,
        expectedLogCall: [
            "Skipping handling of postMessage 'message' event with data '{" +
            "\"service\":\"sap.ushell.services.CrossApplicationNavigation.unknownService\"," +
            "\"request_id\":\"generic_id\",\"body\":{}}' on container of UI5 application 'some.component.name'",
            "Only non UI5 application containers can handle 'message' postMessage event",
            "sap.ushell.components.container.ApplicationContainer"
        ]
    }, {
        testDescription: "getUi5ComponentName returns an empty string",
        fnGetUi5ComponentName: sandbox.stub().returns(""),
        bContainerIsActive: true,
        expectedMessageHandled: false,
        expectedLogCall: [
            "Skipping handling of postMessage 'message' event with data '{" +
            "\"service\":\"sap.ushell.services.CrossApplicationNavigation.unknownService\"," +
            "\"request_id\":\"generic_id\",\"body\":{}}' on container of UI5 application ''",
            "Only non UI5 application containers can handle 'message' postMessage event",
            "sap.ushell.components.container.ApplicationContainer"
        ]
    }, {
        // tests that when a postMessage is received on an inactive container, this is not handled
        testDescription: "container is not active and getUi5ComponentName is null",
        fnGetUi5ComponentName: sandbox.stub().returns(null),
        bContainerIsActive: false,
        expectedMessageHandled: false,
        expectedLogCall: [
            "Skipping handling of postMessage 'message' event with data '{\"service\":\"sap.ushell.services.CrossApplicationNavigation" +
            ".unknownService\",\"request_id\":\"generic_id\",\"body\":{}}' on inactive container 'SOME_CONTAINER_ID'",
            "Only active containers can handle 'message' postMessage event",
            "sap.ushell.components.container.ApplicationContainer"
        ]
    }].forEach(function (oFixture) {
        QUnit.test("handleMessageEvent handling logic works as expected when " + oFixture.testDescription, function (assert) {
            var oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

            // test preparation
            delete oMessage.data.type;
            sandbox.spy(Application, "handleServiceMessageEvent");

            sandbox.stub(Log, "debug");

            // function to be tested
            var oApplicationContainer = {
                getId: sandbox.stub().returns("SOME_CONTAINER_ID"),
                getUi5ComponentName: oFixture.fnGetUi5ComponentName,
                getActive: sandbox.stub().returns(oFixture.bContainerIsActive)
            };
            oAppContainer._handleMessageEvent(oApplicationContainer, oMessage);

            assert.strictEqual(
                Application.handleServiceMessageEvent.getCalls().length,
                oFixture.expectedMessageHandled ? 1 : 0,
                "_handleServiceMessageEvent method was called the expected number of times");

            if (oFixture.hasOwnProperty("expectedLogCall")) {
                assert.strictEqual(
                    Log.debug.getCalls().length,
                    oFixture.expectedLogCall ? 1 : 0,
                    "Log.debug was called the expected number of times");

                assert.deepEqual(
                    Log.debug.getCalls()[0].args,
                    oFixture.expectedLogCall,
                    "Log.debug was called with the expected arguments"
                );
            }
        });
    });

    ["NWBC", "TR"].forEach(function (sNwbcLikeApplicationType) {
        QUnit.test("handleMessageEvent for pro54_setGlobalDirty when application type is " + sNwbcLikeApplicationType, function (assert) {
            return Container.init("local").then(function () {
                var oContentWindow = {},
                    oMessage = {
                        data: {
                            action: "pro54_setGlobalDirty",
                            parameters: { globalDirty: "DIRTY" }
                        },
                        source: oContentWindow
                    },
                    oLogMock = testUtils.createLogMock()
                        .filterComponent("sap.ushell.components.container.ApplicationContainer"),
                    sStorageKey;

                sandbox.spy(utils, "localStorageSetItem");
                sandbox.stub(Storage.prototype, "getItem").callsFake(function (sKey) {
                    return "PENDING";
                });
                oAppContainer.setApplicationType(ApplicationType.enum[sNwbcLikeApplicationType]);
                sandbox.stub(oAppContainer, "getDomRef").returns({
                    tagName: "IFRAME",
                    contentWindow: oContentWindow,
                    src: new URI()
                });

                sStorageKey = oAppContainer.globalDirtyStorageKey;
                oLogMock.debug("getGlobalDirty() pro54_setGlobalDirty SetItem key:" +
                    sStorageKey + " value: " + oMessage.data.parameters.globalDirty,
                    null,
                    "sap.ushell.components.container.ApplicationContainer");
                oAppContainer._handleMessageEvent(oAppContainer, oMessage);

                assert.ok(Storage.prototype.setItem.calledWith(sStorageKey, "DIRTY"),
                    "localStorage.setItem called");
                assert.ok(utils.localStorageSetItem.calledWith(sStorageKey,
                    "DIRTY", true),
                    "localStorageSetItem wrapper called with third paramaeter");
                oLogMock.verify();

                // second test: message from wrong window
                oMessage.source = {};
                utils.localStorageSetItem.reset();

                oAppContainer._handleMessageEvent(oAppContainer, oMessage);
                assert.ok(utils.localStorageSetItem.notCalled);

                // third test: message when no DOM ref
                oAppContainer.getDomRef.returns(undefined);
                utils.localStorageSetItem.reset();

                oAppContainer._handleMessageEvent(oAppContainer, oMessage);
                assert.ok(utils.localStorageSetItem.notCalled);

                // TODO test when not PENDING
                // TODO test with stringified oMessage.data (parseable/non-parseable)
            });
        });
    });

    // TODO: move this code to appLifeCycle
    // [{
    //     testDescription: "register kuki on CrossApplicationNavigation",
    //     fnGetUi5ComponentName: sandbox.stub().returns(null),
    //     expectedMessageHandled: true,
    //     oMsg: {
    //         data: {
    //             type: "request",
    //             service: "sap.ushell.services.CrossApplicationNavigation.kuki",
    //             request_id: "generic_id",
    //             body: {}
    //         },
    //         source: { postMessage: "replace_me_with_a_spy" }
    //     },
    //     commHandler: {
    //         sService: "sap.ushell.services.CrossApplicationNavigation",
    //         oServiceCalls: {
    //             "kuki": {
    //                 executeServiceCallFn: function (oServiceParams) {
    //                     return  new jQuery.Deferred().resolve("yello kuki").promise();
    //                 }
    //             }
    //         }
    //     },
    //     expectedLogCall: {
    //         type: "response",
    //         service: "sap.ushell.services.CrossApplicationNavigation.kuki",
    //         request_id: "generic_id",
    //         status: "success",
    //         body: { "result": "yello kuki" }
    //     }
    // }, {
    //     testDescription: "register kuki on NewService",
    //     fnGetUi5ComponentName: sandbox.stub().returns(null),
    //     expectedMessageHandled: true,
    //     oMsg: {
    //         data: {
    //             type: "request",
    //             service: "sap.ushell.services.NewService.kuki",
    //             request_id: "generic_id",
    //             body: {}
    //         },
    //         source: { postMessage: "replace_me_with_a_spy" }
    //     },
    //     commHandler: {
    //         sService: "sap.ushell.services.NewService",
    //         oServiceCalls: {
    //             "kuki": {
    //                 executeServiceCallFn: function (oServiceParams) {
    //                     return  new jQuery.Deferred().resolve("yello kuki").promise();
    //                 }
    //             }
    //         }
    //     },
    //     expectedLogCall: {
    //         type: "response",
    //         service: "sap.ushell.services.NewService.kuki",
    //         request_id: "generic_id",
    //         status: "success",
    //         body: { "result": "yello kuki" }
    //     }
    // }, {
    //     testDescription: "register two services ku & ki calling ku",
    //     fnGetUi5ComponentName: sandbox.stub().returns(null),
    //     expectedMessageHandled: true,
    //     oMsg: {
    //         data: {
    //             type: "request",
    //             service: "sap.ushell.services.NewService.ku",
    //             request_id: "generic_id",
    //             body: {}
    //         },
    //         source: { postMessage: "replace_me_with_a_spy" }
    //     },
    //     commHandler: {
    //         sService: "sap.ushell.services.NewService",
    //         oServiceCalls: {
    //             "ku": {
    //                 executeServiceCallFn: function (oServiceParams) {
    //                     return  new jQuery.Deferred().resolve("yello ku").promise();
    //                 }
    //             },
    //             "ki": {
    //                 executeServiceCallFn: function (oServiceParams) {
    //                     return  new jQuery.Deferred().resolve("yello ki").promise();
    //                 }
    //             }
    //         }
    //     },
    //     expectedLogCall: {
    //         type: "response",
    //         service: "sap.ushell.services.NewService.ku",
    //         request_id: "generic_id",
    //         status: "success",
    //         body: { "result": "yello ku" }
    //     }
    // }, {
    //     testDescription: "register two services ku & ki calling ki",
    //     fnGetUi5ComponentName: sandbox.stub().returns(null),
    //     expectedMessageHandled: true,
    //     oMsg: {
    //         data: {
    //             type: "request",
    //             service: "sap.ushell.services.NewService.ki",
    //             request_id: "generic_id",
    //             body: {}
    //         },
    //         source: { postMessage: "replace_me_with_a_spy" }
    //     },
    //     commHandler: {
    //         sService: "sap.ushell.services.NewService",
    //         oServiceCalls: {
    //             "ku": {
    //                 executeServiceCallFn: function (oServiceParams) {
    //                     return  new jQuery.Deferred().resolve("yello ku").promise();
    //                 }
    //             },
    //             "ki": {
    //                 executeServiceCallFn: function (oServiceParams) {
    //                     return  new jQuery.Deferred().resolve("yello ki").promise();
    //                 }
    //             }
    //         }
    //     },
    //     expectedLogCall: {
    //         type: "response",
    //         service: "sap.ushell.services.NewService.ki",
    //         request_id: "generic_id",
    //         status: "success",
    //         body: { "result": "yello ki" }
    //     }
    // }].forEach(function (oFixture) {
    //     test("handleMessageEvent Communication Handler Testing......" + oFixture.testDescription, function () {
    //         var oUri = URI(),
    //             oMessage = JSON.parse(JSON.stringify(oFixture.oMsg));
    //         oMessage.origin =  oUri.protocol() + "://" + oUri.host();
    //         // test preparation
    //         sandbox.spy(ApplicationContainer.prototype, "_handleServiceMessageEvent");
    //         oMessage.source.postMessage = sandbox.stub();
    //         sandbox.stub(Log, "debug");
    //         // function to be tested
    //         var oApplicationContainer = {
    //             getApplicationType: sandbox.stub().returns(ApplicationType.URL.type),
    //             getDomRef: sandbox.stub().returns({ tagName: "IFRAME" }),
    //             getId: sandbox.stub().returns("SOME_CONTAINER_ID"),
    //             getUi5ComponentName: oFixture.fnGetUi5ComponentName,
    //             getActive: sandbox.stub().returns(true)
    //         };
    //         oAppContainer.assignCommunicationHandlers(oFixture.commHandler);
    //         oAppContainer._handleMessageEvent(oApplicationContainer, oMessage);
    //         strictEqual(
    //             oAppContainer._handleServiceMessageEvent.getCalls().length,
    //             oFixture.expectedMessageHandled ? 1 : 0,
    //             "_handleServiceMessageEvent method was called the expected number of times");
    //         if (oFixture.hasOwnProperty("expectedLogCall")) {
    //             deepEqual(
    //                 oMessage.source.postMessage.getCalls()[0].args[0],
    //                 JSON.stringify(oFixture.expectedLogCall),
    //                 "Log.debug was called with the expected arguments"
    //             );
    //         }
    //     });
    // });

    QUnit.test("handleServiceMessageEvent logs on messages without source", function () {
        var oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

        delete oMessage.source;

        // Arrange + Assert
        var oConfig = ObjectPath.create("sap-ushell-config.services.PostMessage.config");
        oConfig.enabled = true;
        sandbox.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);

        var oLogMock = testUtils.createLogMock()
            .filterComponent("sap.ushell.components.container.ApplicationContainer")
            .debug("Cannot send response message to origin ' " + oMessage.origin,
                "`source` member of request message is not an object",
                "sap.ushell.components.container.ApplicationContainer")
            .sloppy();

        // Act
        Application.handleServiceMessageEvent(undefined, oMessage, oMessage.data);

        oLogMock.verify();
    });

    QUnit.test("handleServiceMessageEvent sends nice error message back to the caller when caller attempted to call a non-existing service", function (assert) {
        var oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

        // Arrange + Assert

        // NOTE: service does not exist
        oMessage.data.service = "sap.ushell.services.CrossApplicationNavigation.unknownService";
        oMessage.source.postMessage = sandbox.stub();

        var oConfig = ObjectPath.create("sap-ushell-config.services.PostMessage.config");
        oConfig.enabled = true;
        sandbox.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);

        // Act
        Application.handleServiceMessageEvent(undefined, oMessage, oMessage.data);

        assert.strictEqual(oMessage.source.postMessage.callCount, 1, "postMessage was called once");
        assert.deepEqual(oMessage.source.postMessage.getCall(0).args, [
            JSON.stringify({
                type: "response",
                service: "sap.ushell.services.CrossApplicationNavigation.unknownService",
                request_id: "generic_id",
                status: "error",
                body: { code: -1, message: "Unknown service name: 'sap.ushell.services.CrossApplicationNavigation.unknownService'" }
            }),
            "http://our.origin:12345"
        ], "response postMessage was called with the expected arguments");
    });

    QUnit.test("handleServiceMessageEvent with config on", function () {
        var oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

        // test preparation
        var oConfig = ObjectPath.create("sap-ushell-config.services.PostMessage.config");
        oConfig.enabled = true;

        sandbox.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(false);
        var oLogMock = testUtils.createLogMock()
            .filterComponent("sap.ushell.components.container.ApplicationContainer")
            .debug("Received post message request from origin '" + oMessage.origin + "': " + JSON.stringify(oMessage.data),
                null, "sap.ushell.components.container.ApplicationContainer")
            .warning("Received message from untrusted origin '" + oMessage.origin + "': " + JSON.stringify(oMessage.data),
                null, "sap.ushell.components.container.ApplicationContainer");

        // function to be tested
        Application.handleServiceMessageEvent(undefined, oMessage, oMessage.data);

        oLogMock.verify();
    });

    QUnit.test("handleServiceMessageEvent with config off", function () {
        var oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

        // test preparation
        var oConfig = ObjectPath.create("sap-ushell-config.services.PostMessage.config");
        oConfig.enabled = false;
        var oLogMock = testUtils.createLogMock()
            .filterComponent("sap.ushell.components.container.ApplicationContainer")
            .debug("Received post message request from origin '" + oMessage.origin + "': " + JSON.stringify(oMessage.data),
                null, "sap.ushell.components.container.ApplicationContainer")
            .warning("Received message for CrossApplicationNavigation, but this feature is " +
                "disabled. It can be enabled via launchpad configuration property " +
                "'services.PostMessage.config.enabled: true'",
                undefined, "sap.ushell.components.container.ApplicationContainer");

        // function to be tested
        Application.handleServiceMessageEvent(undefined, oMessage, oMessage.data);

        oLogMock.verify();
    });

    QUnit.test("handleServiceMessageEvent with no post message config", function () {
        var oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

        // test preparation
        ObjectPath.create("sap-ushell-config.services.PostMessage.config");
        sandbox.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(false);
        var oLogMock = testUtils.createLogMock()
            .filterComponent("sap.ushell.components.container.ApplicationContainer")
            .debug("Received post message request from origin '" + oMessage.origin + "': " + JSON.stringify(oMessage.data),
                null, "sap.ushell.components.container.ApplicationContainer")
            .warning("Received message from untrusted origin '" + oMessage.origin + "': " + JSON.stringify(oMessage.data),
                null, "sap.ushell.components.container.ApplicationContainer");

        // function to be tested
        Application.handleServiceMessageEvent(undefined, oMessage, oMessage.data);

        oLogMock.verify();
    });

    QUnit.test("handleServiceMessageEvent service definition", function (assert) {
        // Test if the handleServiceMessageEvent method doesn't return
        // when the service starts with sap.ushell.services.CrossApplicationNavigation.

        // test data
        var oMessage = JSON.parse(JSON.stringify(oMessageTemplate));
        oMessage.source.postMessage = sandbox.spy();
        var oMessageStatus = { bApiRegistered: true };

        // test preparation
        var oConfig = ObjectPath.create("sap-ushell-config.services.PostMessage.config");
        oConfig.enabled = false;
        var oLogMock = testUtils.createLogMock()
            .filterComponent("sap.ushell.components.container.ApplicationContainer")
            .debug("Received post message request from origin '" + oMessage.origin + "': " + JSON.stringify(oMessage.data),
                null, "sap.ushell.components.container.ApplicationContainer")
            .warning("Received message for CrossApplicationNavigation, but this feature is disabled." +
                " It can be enabled via launchpad configuration property 'services.PostMessage.config.enabled: true'",
                undefined, "sap.ushell.components.container.ApplicationContainer");

        // function to be tested
        Application.handleServiceMessageEvent(undefined, oMessage, oMessage.data, oMessageStatus);

        oLogMock.verify();
        assert.ok(oMessageStatus.bApiRegistered, "Api was found");

        // Test the behaviour of the handleServiceMessageEvent method in the case it has a
        // service string defined which is not starting with sap.ushell.services.CrossApplicationNavigation.
        // The method then has to return and NOT log a warning (as defined in the next conditional block)

        // test data
        oMessage.data.service = "otherService";

        // test preparation
        sandbox.spy(Log, "warning");
        oMessageStatus.bKeepMessagesForPlugins = true;
        oMessageStatus.bApiRegistered = true;

        // function to be tested
        Application.handleServiceMessageEvent(undefined, oMessage, oMessage.data, oMessageStatus);

        assert.ok(!Log.warning.called, "No warning logged");
        assert.ok(!oMessageStatus.bApiRegistered, "Api was not found");

        // function to be tested

        oMessageStatus.bKeepMessagesForPlugins = false;
        oMessageStatus.bApiRegistered = true;

        oMessage.source.postMessage = sandbox.spy();

        oMessage.data.service = "a.b.c";
        Application.handleServiceMessageEvent(undefined, oMessage, oMessage.data, oMessageStatus);

        assert.ok(!Log.warning.called, "No warning logged");
        assert.ok(oMessageStatus.bApiRegistered, "Api was found");
        assert.deepEqual(oMessage.source.postMessage.getCall(0).args, [JSON.stringify({
            type: "response",
            service: "a.b.c",
            request_id: "generic_id",
            status: "error",
            body: {
                code: -1,
                message: "Unknown service name: 'a.b.c'"
            }
        }), "http://our.origin:12345"], "postMessage was called with the expected arguments");

    });

    QUnit.test("handleServiceMessageEvent setDirtyFlag - success", function (assert) {
        var fnDone = assert.async();
        Container.init("local").then(function () {
            // test data
            var bTestDirtyFlag = true,
                oMessage = getServiceRequestMessage({
                    service: "sap.ushell.services.Container.setDirtyFlag",
                    body: { bIsDirty: bTestDirtyFlag }
                }),
                oMessageData = JSON.parse(oMessage.data);

            // test preparation
            var oConfig = ObjectPath.create("sap-ushell-config.services.PostMessage.config");
            oConfig.enabled = true;
            sandbox.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);
            sandbox.stub(Container, "setDirtyFlag");

            // function to be tested
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect a successful call
            setTimeout(function () {
                assert.strictEqual(Container.setDirtyFlag.callCount,
                    1, "Container.setDirtyFlag is called 1 time");
                assert.deepEqual(Container.setDirtyFlag.getCall(0).args, [
                    bTestDirtyFlag], "Container.setDirtyFlag was called with the expected arguments");

                assert.strictEqual(oMessage.source.postMessage.callCount, 1, "postMessage was called one time");
                assert.deepEqual(oMessage.source.postMessage.getCall(0).args, [JSON.stringify({
                    type: "response",
                    service: oMessageData.service,
                    request_id: oMessageData.request_id,
                    status: "success",
                    body: {}
                }), oMessage.origin], "postMessage was called with the expected arguments");
                fnDone();
            }, 1000);
        });
    });

    QUnit.test("handleServiceMessageEvent hrefForExternal - success", function (assert) {
        var fnDone = assert.async();
        Container.init("local").then(function () {
            // test data
            var oMessage = getServiceRequestMessage({
                service: "sap.ushell.services.CrossApplicationNavigation.hrefForExternal",
                body: {
                    oArgs: {
                        target: {
                            semanticObject: "UnitTest",
                            action: "someAction"
                        },
                        params: { A: "B" }
                    }
                }
            });
            var oMessageData = JSON.parse(oMessage.data);

            // test preparation
            var oConfig = ObjectPath.create("sap-ushell-config.services.PostMessage.config");
            oConfig.enabled = true;
            sandbox.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);

            const NavigationMock = {
                getHref: sandbox.stub().resolves("result")
            };
            sandbox.stub(Container, "getServiceAsync");
            Container.getServiceAsync.withArgs("Navigation").resolves(NavigationMock);

            // function to be tested
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect a successful call
            setTimeout(function () {
                assert.deepEqual(NavigationMock.getHref.getCall(0).args[0], oMessageData.body.oArgs);
                assert.ok(oMessage.source.postMessage.calledOnce, "postMessage was called once");
                assert.deepEqual(oMessage.source.postMessage.getCall(0).args[0], JSON.stringify({
                    type: "response",
                    service: oMessageData.service,
                    request_id: oMessageData.request_id,
                    status: "success",
                    body: { result: "result" }
                }), oMessage.origin);
                fnDone();
            }, 1000);
        });
    });

    QUnit.test("handleServiceMessageEvent hrefForExternal - error", function (assert) {
        var fnDone = assert.async();
        Container.init("local").then(function () {
            var oMessage = getServiceRequestMessage({ service: "sap.ushell.services.CrossApplicationNavigation.hrefForExternal" }),
                oMessageData = JSON.parse(oMessage.data);

            // adapt test data to throw exception
            var oConfig = ObjectPath.create("sap-ushell-config.services.PostMessage.config");
            oConfig.enabled = true;
            sandbox.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);

            const NavigationMock = {
                getHref: sandbox.stub().returns(Promise.reject(oFakeError.message))
            };
            sandbox.stub(Container, "getServiceAsync");
            Container.getServiceAsync.withArgs("Navigation").resolves(NavigationMock);

            // function to be tested
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect an error
            setTimeout(function () {
                assert.ok(NavigationMock.getHref.calledOnce, "hrefForExternal was called once");
                assert.deepEqual(oMessage.source.postMessage.getCall(0).args[0], JSON.stringify({
                    type: "response",
                    service: oMessageData.service,
                    request_id: oMessageData.request_id,
                    status: "error",
                    body: { message: oFakeError.message }
                }), oMessage.origin);
                fnDone();
            }, 1000);
        });
    });

    QUnit.test("handleServiceMessageEvent getSemanticObjectLinks - success", function (assert) {
        var fnDone = assert.async();
        Container.init("local").then(function () {
            // test data
            var oMessage = getServiceRequestMessage({
                service: "sap.ushell.services.CrossApplicationNavigation.getSemanticObjectLinks",
                body: {
                    sSemanticObject: "UnitTest",
                    mParameters: { A: "B" },
                    bIgnoreFormFactors: false
                }
            });
            var oMessageData = JSON.parse(oMessage.data);

            // test preparation
            var oConfig = ObjectPath.create("sap-ushell-config.services.PostMessage.config");
            oConfig.enabled = true;
            sandbox.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);
            sandbox.stub(navigationCompatibility, "getSemanticObjectLinks").resolves("result");

            // simulate event
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // check result
            setTimeout(function () {
                assert.ok(navigationCompatibility.getSemanticObjectLinks.calledWith(
                    oMessageData.body.sSemanticObject, oMessageData.body.mParameters, oMessageData.body.bIgnoreFormFactors
                ), "I was called");
                assert.ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                    type: "response",
                    service: oMessageData.service,
                    request_id: oMessageData.request_id,
                    status: "success",
                    body: { result: "result" }
                }), oMessage.origin), "postMessage called with proper args");
                fnDone();
            }, 1000);
        });
    });

    QUnit.test("handleServiceMessageEvent getSemanticObjectLinks - error", function (assert) {
        var fnDone = assert.async();
        Container.init("local").then(function () {
            // test data
            var oMessage = getServiceRequestMessage({
                service: "sap.ushell.services.CrossApplicationNavigation.getSemanticObjectLinks"
            });
            var oMessageData = JSON.parse(oMessage.data);

            // test preparation
            var oConfig = ObjectPath.create("sap-ushell-config.services.PostMessage.config");
            oConfig.enabled = true;
            sandbox.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);
            sandbox.stub(navigationCompatibility, "getSemanticObjectLinks").returns(Promise.reject("rejected!"));

            // simulate event
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            setTimeout(function () {
                // we expect an error
                assert.ok(navigationCompatibility.getSemanticObjectLinks.calledOnce, "getSemanticObjectLinks was called");
                assert.deepEqual(oMessage.source.postMessage.getCall(0).args[0], JSON.stringify({
                    type: "response",
                    service: oMessageData.service,
                    request_id: oMessageData.request_id,
                    status: "error",
                    body: { message: "rejected!" }
                }), oMessage.origin);
                fnDone();
            }, 1000);
        });
    });

    QUnit.test("handleServiceMessageEvent isIntentSupported - success", function (assert) {
        var fnDone = assert.async();
        Container.init("local").then(function () {
            // test data
            var oMessage = getServiceRequestMessage({
                service: "sap.ushell.services.CrossApplicationNavigation.isIntentSupported",
                body: { aIntents: ["#GenericWrapperTest-open", "#Action-showBookmark", "#Action-invalidAction"] }
            });
            var oMessageData = JSON.parse(oMessage.data);

            // test preparation
            var oConfig = ObjectPath.create("sap-ushell-config.services.PostMessage.config");
            oConfig.enabled = true;
            sandbox.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);
            sandbox.stub(navigationCompatibility, "isIntentSupported").resolves("result");

            // simulate event
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);
            // check result
            setTimeout(function () {
                assert.ok(navigationCompatibility.isIntentSupported.calledWith(oMessageData.body.aIntents), "Called with proper args");
                assert.ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                    type: "response",
                    service: oMessageData.service,
                    request_id: oMessageData.request_id,
                    status: "success",
                    body: { result: "result" }
                }), oMessage.origin), "called with proper args");
                fnDone();
            }, 1000);
        });
    });

    QUnit.test("handleServiceMessageEvent isIntentSupported - error", function (assert) {
        var fnDone = assert.async();
        Container.init("local").then(function () {
            // test data
            var oMessage = getServiceRequestMessage({
                service: "sap.ushell.services.CrossApplicationNavigation.isIntentSupported"
            });
            var oMessageData = JSON.parse(oMessage.data);

            // test preparation
            var oConfig = ObjectPath.create("sap-ushell-config.services.PostMessage.config");
            oConfig.enabled = true;
            sandbox.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);
            sandbox.stub(navigationCompatibility, "isIntentSupported").returns(Promise.reject("rejected!"));

            // simulate event
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect an error
            setTimeout(function () {
                assert.ok(navigationCompatibility.isIntentSupported.calledOnce, "isIntentSupported was called");
                assert.ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                    type: "response",
                    service: oMessageData.service,
                    request_id: oMessageData.request_id,
                    status: "error",
                    body: { message: "rejected!" }
                }), oMessage.origin), "called with proper args");
                fnDone();
            }, 1000);
        });
    });

    QUnit.test("handleServiceMessageEvent isNavigationSupported - success", function (assert) {
        var fnDone = assert.async();
        Container.init("local").then(function () {
            // test data
            var oMessage = getServiceRequestMessage({
                service: "sap.ushell.services.CrossApplicationNavigation.isNavigationSupported",
                body: {
                    aIntents: [
                        { target: { semanticObjcet: "Action", action: "showBookmark" } },
                        { target: { semanticObject: "Action", action: "invalidAction" } }
                    ]
                }
            });
            var oMessageData = JSON.parse(oMessage.data);

            // test preparation
            var oConfig = ObjectPath.create("sap-ushell-config.services.PostMessage.config");
            oConfig.enabled = true;
            sandbox.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);

            const NavigationMock = {
                isNavigationSupported: sandbox.stub().resolves("result")
            };
            sandbox.stub(Container, "getServiceAsync");
            Container.getServiceAsync.withArgs("Navigation").resolves(NavigationMock);

            // simulate event
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // check result
            setTimeout(function () {
                assert.ok(NavigationMock.isNavigationSupported.calledWith(oMessageData.body.aIntents), "called with proper args");
                assert.ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                    type: "response",
                    service: oMessageData.service,
                    request_id: oMessageData.request_id,
                    status: "success",
                    body: { result: "result" }
                }), oMessage.origin), "called with proper args");
                fnDone();
            }, 1000);
        });
    });

    QUnit.test("handleServiceMessageEvent isNavigationSupported - error", function (assert) {
        var fnDone = assert.async();
        Container.init("local").then(function () {
            // test data
            var oMessage = getServiceRequestMessage({
                service: "sap.ushell.services.CrossApplicationNavigation.isNavigationSupported"
            });
            var oMessageData = JSON.parse(oMessage.data);

            // test preparation
            var oConfig = ObjectPath.create("sap-ushell-config.services.PostMessage.config");
            oConfig.enabled = true;
            sandbox.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);

            const NavigationMock = {
                isNavigationSupported: sandbox.stub().returns(Promise.reject("rejected!"))
            };
            sandbox.stub(Container, "getServiceAsync");
            Container.getServiceAsync.withArgs("Navigation").resolves(NavigationMock);

            // simulate event
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect an error
            setTimeout(function () {
                assert.ok(NavigationMock.isNavigationSupported.calledOnce, "isNavigationSupported was called");
                assert.ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                    type: "response",
                    service: oMessageData.service,
                    request_id: oMessageData.request_id,
                    status: "error",
                    body: { message: "rejected!" }
                }), oMessage.origin), "called with proper args");
                fnDone();
            }, 1000);
        });
    });

    QUnit.test("handleServiceMessageEvent getAppStateData - success", function (assert) {
        var fnDone = assert.async();
        Container.init("local").then(function () {
            // test data
            var oMessage = getServiceRequestMessage({
                service: "sap.ushell.services.CrossApplicationNavigation.getAppStateData",
                body: { sAppStateKey: "ABC" }
            });
            var oMessageData = JSON.parse(oMessage.data);

            // test preparation
            var oConfig = ObjectPath.create("sap-ushell-config.services.PostMessage.config");
            oConfig.enabled = true;
            sandbox.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);
            sandbox.stub(navigationCompatibility, "getAppStateData").resolves("result1");

            // simulate event
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // check result
            setTimeout(function () {
                assert.deepEqual(navigationCompatibility.getAppStateData.args[0], [oMessageData.body.sAppStateKey], "proper arguments");
                assert.deepEqual(oMessage.source.postMessage.args[0], [JSON.stringify({
                    type: "response",
                    service: oMessageData.service,
                    request_id: oMessageData.request_id,
                    status: "success",
                    body: { result: "result1" }
                }), oMessage.origin], " proper args");
                fnDone();
            }, 1000);
        });
    });

    QUnit.test("handleServiceMessageEvent getAppStateData - error", function (assert) {
        var fnDone = assert.async();
        Container.init("local").then(function () {
            // test data
            var oMessage = getServiceRequestMessage({
                service: "sap.ushell.services.CrossApplicationNavigation.getAppStateData"
            });
            var oMessageData = JSON.parse(oMessage.data);

            // test preparation
            var oConfig = ObjectPath.create("sap-ushell-config.services.PostMessage.config");
            oConfig.enabled = true;
            sandbox.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);
            sandbox.stub(navigationCompatibility, "getAppStateData").returns(Promise.reject("rejected!"));

            // simulate event
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect an error
            setTimeout(function () {
                assert.ok(navigationCompatibility.getAppStateData.calledOnce, "getAppStateData was called");
                assert.ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                    type: "response",
                    service: oMessageData.service,
                    request_id: oMessageData.request_id,
                    status: "error",
                    body: { message: "rejected!" }
                }), oMessage.origin), "called with proper args");
                fnDone();
            }, 1000);
        });
    });

    [{
        testDescription: "simple call with parameter",
        oArgs: {
            target: { semanticObject: "UnitTest", action: "someAction" },
            params: { A: "B" }
        },
        expectedLocalStorageContent: {}, // nothing stored: no expanded sap-system given
        expectedResponse: { status: "success" }
    }, {
        testDescription: "call with expanded sap-system parameter",
        oArgs: {
            target: { semanticObject: "UnitTest", action: "someAction" },
            params: {
                "sap-ui2-wd-app-id": "WDR_TEST_PORTAL_NAV_TARGET",
                "sap-system": {
                    id: "UI3",
                    client: "000",
                    language: "EN",
                    http: { id: "UI3_HTTP", host: "ldai1ui3.example.com", port: 50032 },
                    https: { id: "UI3_HTTPS", host: "ldai1ui3.example.com", port: 44332 },
                    rfc: { id: "UI3", systemId: "UI3", host: "ldciui3.example.com", service: 32, loginGroup: "PUBLIC" }
                }
            }
        },
        expectedLocalStorageContent: {
            "sap-system-data$UI3": JSON.stringify({ // data are stored
                id: "UI3",
                client: "000",
                language: "EN",
                http: { id: "UI3_HTTP", host: "ldai1ui3.example.com", port: 50032 },
                https: { id: "UI3_HTTPS", host: "ldai1ui3.example.com", port: 44332 },
                rfc: { id: "UI3", systemId: "UI3", host: "ldciui3.example.com", service: 32, loginGroup: "PUBLIC" }
            })
        },
        expectedPublicApiCallArgs: {
            target: { semanticObject: "UnitTest", action: "someAction" },
            params: {
                "sap-ui2-wd-app-id": "WDR_TEST_PORTAL_NAV_TARGET",
                "sap-system": "UI3" // the ID from the expanded data
            }
        },
        expectedResponse: { status: "success" }
    }, {
        testDescription: "call with expanded sap-system parameter and sap-system-src (not in sid notation)",
        testCurrentSystemInformation: {
            name: "UR5",
            client: "120"
        },
        oArgs: {
            target: { semanticObject: "UnitTest", action: "someAction" },
            params: {
                "sap-ui2-wd-app-id": "WDR_TEST_PORTAL_NAV_TARGET",
                "sap-system": {
                    id: "UI3",
                    client: "000",
                    language: "EN",
                    http: { id: "UI3_HTTP", host: "ldai1ui3.example.com", port: 50032 },
                    https: { id: "UI3_HTTPS", host: "ldai1ui3.example.com", port: 44332 },
                    rfc: { id: "UI3", systemId: "UI3", host: "ldciui3.example.com", service: 32, loginGroup: "PUBLIC" }
                },
                "sap-system-src": "UR5CLNT120"
            }
        },
        expectedLocalStorageContent: {
            "sap-system-data#UR5CLNT120:UI3": JSON.stringify({
                id: "UI3",
                client: "000",
                language: "EN",
                http: { id: "UI3_HTTP", host: "ldai1ui3.example.com", port: 50032 },
                https: { id: "UI3_HTTPS", host: "ldai1ui3.example.com", port: 44332 },
                rfc: { id: "UI3", systemId: "UI3", host: "ldciui3.example.com", service: 32, loginGroup: "PUBLIC" }
            })
        },
        expectedPublicApiCallArgs: {
            target: { semanticObject: "UnitTest", action: "someAction" },
            params: {
                "sap-ui2-wd-app-id": "WDR_TEST_PORTAL_NAV_TARGET",
                "sap-system": "UI3",
                "sap-system-src": "UR5CLNT120"
            }
        },
        expectedResponse: { status: "success" }
    }, {
        testDescription: "call with expanded sap-system parameter and sap-system-src (in sid notation, not matching the current system)",
        testCurrentSystemInformation: { // system where the FLP runs
            name: "UR5",
            client: "120"
        },
        oArgs: {
            target: { semanticObject: "UnitTest", action: "someAction" },
            params: {
                "sap-ui2-wd-app-id": "WDR_TEST_PORTAL_NAV_TARGET",
                "sap-system": {
                    id: "UI3",
                    client: "000",
                    language: "EN",
                    http: { id: "UI3_HTTP", host: "ldai1ui3.example.com", port: 50032 },
                    https: { id: "UI3_HTTPS", host: "ldai1ui3.example.com", port: 44332 },
                    rfc: { id: "UI3", systemId: "UI3", host: "ldciui3.example.com", service: 32, loginGroup: "PUBLIC" }
                },
                "sap-system-src": "sid(UV3.120)" // this is supposed to be the unique id of the system that sent the expanded sap-system
            }
        },
        expectedLocalStorageContent: {
            "sap-system-data#sid(UV3.120):UI3": JSON.stringify({
                id: "UI3",
                client: "000",
                language: "EN",
                http: { id: "UI3_HTTP", host: "ldai1ui3.example.com", port: 50032 },
                https: { id: "UI3_HTTPS", host: "ldai1ui3.example.com", port: 44332 },
                rfc: { id: "UI3", systemId: "UI3", host: "ldciui3.example.com", service: 32, loginGroup: "PUBLIC" }
            })
        },
        expectedPublicApiCallArgs: {
            target: { semanticObject: "UnitTest", action: "someAction" },
            params: {
                "sap-ui2-wd-app-id": "WDR_TEST_PORTAL_NAV_TARGET",
                "sap-system": "UI3",
                "sap-system-src": "sid(UV3.120)"
            }
        },
        expectedResponse: { status: "success" }
    }, {
        testDescription: "call with expanded sap-system parameter and sap-system-src (in sid notation, matching the current system)",
        testCurrentSystemInformation: {
            name: "UR5",
            client: "120"
        },
        oArgs: {
            target: { semanticObject: "UnitTest", action: "someAction" },
            params: {
                "sap-ui2-wd-app-id": "WDR_TEST_PORTAL_NAV_TARGET",
                "sap-system": {
                    id: "UI3",
                    client: "000",
                    language: "EN",
                    http: { id: "UI3_HTTP", host: "ldai1ui3.example.com", port: 50032 },
                    https: { id: "UI3_HTTPS", host: "ldai1ui3.example.com", port: 44332 },
                    rfc: { id: "UI3", systemId: "UI3", host: "ldciui3.example.com", service: 32, loginGroup: "PUBLIC" }
                },
                "sap-system-src": "sid(UR5.120)" // this is provided, and it matches the local system...
            }
        },
        expectedLocalStorageContent: {
            "sap-system-data#sid(UR5.120):UI3": JSON.stringify({ // note: empty string used for sap-system
                id: "UI3",
                client: "000",
                language: "EN",
                http: { id: "UI3_HTTP", host: "ldai1ui3.example.com", port: 50032 },
                https: { id: "UI3_HTTPS", host: "ldai1ui3.example.com", port: 44332 },
                rfc: { id: "UI3", systemId: "UI3", host: "ldciui3.example.com", service: 32, loginGroup: "PUBLIC" }
            })
        },
        expectedPublicApiCallArgs: {
            target: { semanticObject: "UnitTest", action: "someAction" },
            params: {
                "sap-ui2-wd-app-id": "WDR_TEST_PORTAL_NAV_TARGET",
                "sap-system": "UI3",
                "sap-system-src": "sid(UR5.120)"
            }
        },
        expectedResponse: { status: "success" }
    }, {
        testDescription: "call with sap-system in sid notation matching the local system",
        testCurrentSystemInformation: { // the system name and client are used to identify the local system instead
            name: "UI3",
            client: "000"
        },
        oArgs: {
            target: { semanticObject: "UnitTest", action: "someAction" },
            params: {
                "sap-ui2-wd-app-id": "WDR_TEST_PORTAL_NAV_TARGET",
                "sap-system": "sid(UI3.000)"
                // no sap-system-src provided
            }
        },
        expectedLocalStorageContent: {},
        expectedPublicApiCallArgs: {
            target: { semanticObject: "UnitTest", action: "someAction" },
            params: { "sap-ui2-wd-app-id": "WDR_TEST_PORTAL_NAV_TARGET" } // sap-system is removed completely
        },
        expectedResponse: { status: "success" }
    }].forEach(function (oFixture) {
        QUnit.test("handleServiceMessageEvent toExternal: " + oFixture.testDescription, function (assert) {
            var fnDone = assert.async();
            Container.init("local").then(function () {
                // Arrange
                var oOriginalArgs = deepExtend({}, oFixture.oArgs),
                    oMessage = getServiceRequestMessage({
                        service: "sap.ushell.services.CrossApplicationNavigation.toExternal",
                        body: { oArgs: oFixture.oArgs }
                    }),
                    oMessageData = JSON.parse(oMessage.data);

                var oConfig = ObjectPath.create("sap-ushell-config.services.PostMessage.config");
                oConfig.enabled = true;
                sandbox.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);

                const oNavigationMock = {
                    navigate: sandbox.stub().resolves("")
                };
                mockSapUshellContainer({
                    services: { Navigation: oNavigationMock },
                    getLogonSystem: undefined
                });
                if (oFixture.testCurrentSystemInformation) {
                    sandbox.stub(Container, "getLogonSystem").returns({
                        getSystemName: sandbox.stub().returns(oFixture.testCurrentSystemInformation.name),
                        getClient: sandbox.stub().returns(oFixture.testCurrentSystemInformation.client)
                    });
                } else {
                    // make sure nothing is assumed about getLogonSystem
                    sandbox.stub(Container, "getLogonSystem")
                        .throws("ERROR: getLogonSystem should not be called during this test, or API should be mocked accordingly");
                }

                var oLocalStorageContent = {};
                sandbox.stub(utils, "getLocalStorage").returns({
                    setItem: function (sKey, sValue) { oLocalStorageContent[sKey] = sValue; }
                });

                // Act
                Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

                setTimeout(function () {
                    // Assert
                    assert.strictEqual(oNavigationMock.navigate.callCount, 1, "CrossApplicationNavigation#toExternal was called once");
                    if (oNavigationMock.navigate.callCount === 1) {
                        var oExpectedCallArgs = oFixture.expectedPublicApiCallArgs || oOriginalArgs;

                        assert.deepEqual(oNavigationMock.navigate.getCall(0).args[0], oExpectedCallArgs,
                            "The public interface CrossApplicationNavigation#toExternal was called with the expected arguments");
                    }

                    assert.deepEqual(oMessage.source.postMessage.args[0], [JSON.stringify({
                        type: "response",
                        service: oMessageData.service,
                        request_id: oMessageData.request_id,
                        status: oFixture.expectedResponse.status || "success",
                        body: oFixture.expectedResponse.body || { result: "" }
                    }), oMessage.origin], "called with proper args");

                    if (oFixture.expectedLocalStorageContent) {
                        assert.deepEqual(oLocalStorageContent, oFixture.expectedLocalStorageContent,
                            "expected content was stored in the local storage");
                    } else {
                        assert.strictEqual(oLocalStorageContent, {},
                            "no content was stored in the local storage");
                    }
                    fnDone();
                }, 1000);
            });
        });
    });

    QUnit.test("handleServiceMessageEvent ShellUIService setTitle", function (assert) {
        var fnDone = assert.async();
        Container.init("local").then(function () {
            // test data
            var oMessage = getServiceRequestMessage({
                service: "sap.ushell.ui5service.ShellUIService.setTitle",
                body: { sTitle: "Purchase Order" }
            });
            var oMessageData = JSON.parse(oMessage.data);
            var oSetTitleStub = sandbox.stub();

            var oConfig = ObjectPath.create("sap-ushell-config.services.PostMessage.config");
            oConfig.enabled = true;

            sandbox.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);

            sandbox.stub(oAppContainer, "getShellUIService").returns({
                setTitle: oSetTitleStub
            });

            // simulate event
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // check result
            setTimeout(function () {
                assert.deepEqual(oSetTitleStub.args[0], [oMessageData.body.sTitle], "setTitle method of public service called with proper arguments");
                assert.deepEqual(oMessage.source.postMessage.args[0], [JSON.stringify({
                    type: "response",
                    service: oMessageData.service,
                    request_id: oMessageData.request_id,
                    status: "success",
                    body: {}
                }), oMessage.origin], " proper args");
                fnDone();
            }, 1000);
        });
    });

    QUnit.test("handleServiceMessageEvent ShellUIService backToPreviousApp", function (assert) {
        var fnDone = assert.async();
        Container.init("local").then(function () {
            // test data
            var oMessage = getServiceRequestMessage({
                service: "sap.ushell.services.CrossApplicationNavigation.backToPreviousApp",
                body: {}
            });
            var oMessageData = JSON.parse(oMessage.data);

            // test preparation
            var oConfig = ObjectPath.create("sap-ushell-config.services.PostMessage.config");
            oConfig.enabled = true;
            sandbox.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);

            const NavigationMock = {
                backToPreviousApp: sandbox.stub()
            };
            sandbox.stub(Container, "getServiceAsync");
            Container.getServiceAsync.withArgs("Navigation").resolves(NavigationMock);

            // function to be tested
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect a successful call
            setTimeout(function () {
                // second call comes from dark mode:
                assert.strictEqual(Container.getServiceAsync.callCount, 1, "Container.getServiceAsync was called once");
                assert.deepEqual(Container.getServiceAsync.getCall(0).args, ["Navigation"], "Container.getServiceAsync was called with the expected argument");
                assert.strictEqual(NavigationMock.backToPreviousApp.callCount, 1, "backToPreviousApp method was called once");
                assert.ok(oMessage.source.postMessage.calledOnce, "postMessage was called once");
                assert.deepEqual(
                    oMessage.source.postMessage.getCall(0).args, [JSON.stringify({
                        type: "response",
                        service: oMessageData.service,
                        request_id: oMessageData.request_id,
                        status: "success",
                        body: {}
                    }), oMessage.origin],
                    "postMessage was called with the expected arguments");
                fnDone();
            }, 1000);
        });
    });

    QUnit.test("handleServiceMessageEvent ShellUIService backToPreviousApp (via sap.ushell.services.CrossApplicationNavigation.backToPreviousApp)", function (assert) {
        var fnDone = assert.async();
        Container.init("local").then(function () {
            // test data
            var oMessage = getServiceRequestMessage({
                service: "sap.ushell.services.CrossApplicationNavigation.backToPreviousApp",
                body: {}
            });
            var oMessageData = JSON.parse(oMessage.data);

            // test preparation
            var oConfig = ObjectPath.create("sap-ushell-config.services.PostMessage.config");
            oConfig.enabled = true;
            sandbox.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);

            const NavigationMock = {
                backToPreviousApp: sandbox.stub()
            };
            sandbox.stub(Container, "getServiceAsync");
            Container.getServiceAsync.withArgs("Navigation").resolves(NavigationMock);

            // function to be tested
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            setTimeout(function () {
                // we expect a successful call
                // second call comes from dark mode:
                assert.strictEqual(Container.getServiceAsync.callCount, 1, "Container.getServiceAsync was called once");
                assert.deepEqual(Container.getServiceAsync.getCall(0).args, ["Navigation"], "Container.getServiceAsync was called with the expected argument");
                assert.strictEqual(NavigationMock.backToPreviousApp.callCount, 1, "backToPreviousApp method was called once");
                assert.ok(oMessage.source.postMessage.calledOnce, "postMessage was called once");
                assert.deepEqual(
                    oMessage.source.postMessage.getCall(0).args, [JSON.stringify({
                        type: "response",
                        service: oMessageData.service,
                        request_id: oMessageData.request_id,
                        status: "success",
                        body: {}
                    }), oMessage.origin],
                    "postMessage was called with the expected arguments");
                fnDone();
            }, 1000);
        });
    });

    [{
        testDescription: "called with steps argument",
        messageBody: { iSteps: 2 },
        expectedArgument: [2]
    }, {
        testDescription: "called without steps argument",
        messageBody: {},
        expectedArgument: [undefined]
    }].forEach(function (oFixture) {
        QUnit.test("handleServiceMessageEvent historyBack (via sap.ushell.services.CrossApplicationNavigation.historyBack) when" + oFixture.testDescription, function (assert) {
            var fnDone = assert.async();
            Container.init("local").then(function () {
                // test data
                var oMessage = getServiceRequestMessage({
                    service: "sap.ushell.services.CrossApplicationNavigation.historyBack",
                    body: oFixture.messageBody
                });
                var oMessageData = JSON.parse(oMessage.data);

                // test preparation
                var oConfig = ObjectPath.create("sap-ushell-config.services.PostMessage.config");
                oConfig.enabled = true;
                sandbox.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);

                const NavigationMock = {
                    historyBack: sandbox.stub()
                };
                sandbox.stub(Container, "getServiceAsync");
                Container.getServiceAsync.withArgs("Navigation").resolves(NavigationMock);

                // function to be tested
                Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

                setTimeout(function () {
                    // we expect a successful call
                    // second call is due to dark mode
                    assert.strictEqual(Container.getServiceAsync.callCount, 1, "Container.getServiceAsync was called once");
                    assert.deepEqual(Container.getServiceAsync.getCall(0).args, ["Navigation"], "Container.getServiceAsync was called with the expected argument");
                    assert.deepEqual(NavigationMock.historyBack.getCall(0).args, oFixture.expectedArgument,
                        "CrossApplicationNavigation#historyBack was called with the expected argument: " + oFixture.expectedArgument);
                    assert.strictEqual(NavigationMock.historyBack.callCount, 1, "historyBack method was called once");
                    assert.ok(oMessage.source.postMessage.calledOnce, "postMessage was called once");
                    assert.deepEqual(
                        oMessage.source.postMessage.getCall(0).args,
                        [
                            JSON.stringify({
                                type: "response",
                                service: oMessageData.service,
                                request_id: oMessageData.request_id,
                                status: "success",
                                body: {}
                            }),
                            oMessage.origin
                        ],
                        "postMessage was called with the expected arguments"
                    );
                    fnDone();
                }, 1000);
            });
        });
    });

    QUnit.test("handleServiceMessageEvent getFLPUrl (via sap.ushell.services.Container.getFLPUrl", function (assert) {
        var fnDone = assert.async();
        Container.init("local").then(function () {
            // test data
            var oMessage = getServiceRequestMessage({
                service: "sap.ushell.services.Container.getFLPUrl",
                body: {}
            });
            var oMessageData = JSON.parse(oMessage.data);

            // test preparation
            var oConfig = ObjectPath.create("sap-ushell-config.services.PostMessage.config");
            oConfig.enabled = true;
            sandbox.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);

            var oGetFLPUrlStub = sandbox.stub(Container, "getFLPUrl").returns("result1");

            // function to be tested
            Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            setTimeout(function () {
                // we expect a successful call
                assert.strictEqual(oGetFLPUrlStub.callCount, 1, "Container.getService was called once");
                assert.ok(oMessage.source.postMessage.calledOnce, "postMessage was called once");
                assert.deepEqual(
                    oMessage.source.postMessage.getCall(0).args, [JSON.stringify({
                        type: "response",
                        service: oMessageData.service,
                        request_id: oMessageData.request_id,
                        status: "success",
                        body: { result: "result1" }
                    }), oMessage.origin],
                    "postMessage was called with the expected arguments");
                fnDone();
            }, 1000);
        });
    });

    [{
        testDescription: "callbackMessage with service specified",
        oMessageBody: {
            callbackMessage: {
                service: "some.gui.service.id",
                supportedProtocolVersions: ["1"]
            }
        },
        expectedSetBackNavigationArgumentType: "function"
    }, {
        testDescription: "empty callbackMessage specified",
        oMessageBody: { callbackMessage: {} },
        expectedSetBackNavigationArgumentType: "undefined"
    }, {
        testDescription: "empty body specified",
        oMessageBody: {},
        expectedSetBackNavigationArgumentType: "undefined"
    }].forEach(function (oFixture) {
        QUnit.test("handleServiceMessageEvent ShellUIService setBackNavigation when " + oFixture.testDescription, function (assert) {
            // Tests that the sap.ushell.ui5service.ShellUIService.setBackNavigation is handled correctly when made by the GUI.
            // To do this, the test simulates a setBackNavigation call made via postMessage by the GUI application.
            var fnDone = assert.async();
            Container.init("local").then(function () {
                var oMessage = getServiceRequestMessage({
                    service: "sap.ushell.ui5service.ShellUIService.setBackNavigation",
                    body: oFixture.oMessageBody
                });
                var oMessageData = JSON.parse(oMessage.data);
                var oSetBackNavigationStub = sandbox.stub();

                var oConfig = ObjectPath.create("sap-ushell-config.services.PostMessage.config");
                oConfig.enabled = true;

                sandbox.stub(oAppContainer.__proto__, "_isTrustedPostMessageSource").returns(true);
                sandbox.stub(oAppContainer, "getShellUIService").returns({ setBackNavigation: oSetBackNavigationStub });

                // simulate GUI triggering postMessage
                Application.handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

                setTimeout(function () {
                    // check how the message was handled
                    assert.strictEqual(oSetBackNavigationStub.callCount, 1, "ShellUIService#setBackNavigation method was called with one argument");
                    assert.strictEqual(typeof oSetBackNavigationStub.getCall(0).args[0], oFixture.expectedSetBackNavigationArgumentType,
                        "ShellUIService#setBackNavigation method was called with first argument of type " + oFixture.expectedSetBackNavigationArgumentType);
                    assert.deepEqual(oMessage.source.postMessage.args[0], [JSON.stringify({
                        type: "response",
                        service: oMessageData.service,
                        request_id: oMessageData.request_id,
                        status: "success",
                        body: {}
                    }), oMessage.origin], "response to setBackNavigation contains the proper arguments");
                    fnDone();
                }, 1000);
            });
        });
    });

    ["NWBC", "TR"].forEach(function (sNwbcLikeApplicationType) {
        QUnit.test("ApplicationContainer localStorage eventing", function (assert) {
            var fnDone1 = assert.async();
            var fnDone2 = assert.async();
            Container.init("local").then(function () {
                mockSapUshellContainer();

                var oMockOverrides = { "/utils/bStubLocalStorageSetItem": false };
                var oLogMock = testUtils.createLogMock()
                    .filterComponent("sap.ushell.components.container.ApplicationContainer")
                    .debug("getGlobalDirty() send pro54_getGlobalDirty ",
                        null,
                        "sap.ushell.components.container.ApplicationContainer");
                var sStorageKey;
                var oStorageEvent = document.createEvent("StorageEvent");

                oAppContainer.setApplicationType(ApplicationType.enum[sNwbcLikeApplicationType]);

                sStorageKey = oAppContainer.globalDirtyStorageKey;

                oAppContainer.setUrl(window.location.origin + "/sap/bc/ui2/" + sNwbcLikeApplicationType + "/~canvas?sap-client=120");
                renderInternallyAndExpectIFrame(assert, oAppContainer, oAppContainer.getApplicationType(),
                    window.location.origin + "/sap/bc/ui2/" + sNwbcLikeApplicationType + "/~canvas?sap-client=120", oMockOverrides,
                    undefined, undefined, undefined, true);

                var oPostMessageStub;
                sandbox.stub(oAppContainer.getDomRef(), "tagName").value("IFRAME");
                oPostMessageStub = sandbox.spy(function (sMessage/*, sOrigin*/) {
                    assert.strictEqual(JSON.parse(sMessage).action, "pro54_getGlobalDirty",
                        sNwbcLikeApplicationType + ".getGlobalDirty fired");
                    fnDone1();
                });
                sandbox.stub(oAppContainer.getDomRef(), "contentWindow").value({
                    postMessage: oPostMessageStub
                });

                oStorageEvent.initStorageEvent("storage", false, false, sStorageKey, "", "PENDING",
                    "", localStorage);

                sandbox.spy(utils, "localStorageSetItem");
                sandbox.stub(Storage.prototype, "getItem").returns("PENDING");

                // code under test
                dispatchEvent(oStorageEvent);
                assert.ok(oPostMessageStub.calledOnce);
                oLogMock.verify();

                sandbox.restore();
                fnDone2();
            });
        });
    });

    [false, true].forEach(function (bIsPostMethod) {
        QUnit.test("ApplicationContainer rendering on inactive container", function (assert) {
            // Arrange
            var sUrl = window.location.origin + "/sap/public/bc/ui2/staging/test";
            oAppContainer.setApplicationType(ApplicationType.TR.type);
            oAppContainer.setUrl(sUrl);
            oAppContainer.setAdditionalInformation("SAPUI5=will.be.ignored.view.xml");
            oAppContainer.setActive(false); // NOTE
            oAppContainer.setIframeWithPost(bIsPostMethod);

            mockSapUshellContainer();
            var oPrepareEnv = prepareRenderInternally(oAppContainer, sUrl);

            // Act
            var oTargetNode = renderInternally(oAppContainer, oPrepareEnv, sUrl, oAppContainer.getApplicationType());

            testIFrameNotRendered(assert, oAppContainer, oTargetNode);
        });
    });

    [{
        testDescription: "trusted origin and original container",
        otherContentWindow: true,
        origin: new URI(),
        expectedResult: true
    }, {
        testDescription: "trusted origin and different container",
        otherContentWindow: false,
        origin: new URI(),
        expectedResult: true
    }, {
        testDescription: "not trusted origin and original container",
        otherContentWindow: true,
        origin: new URI("http://sap.com/"),
        expectedResult: false
    }, {
        testDescription: "not trusted origin and different container",
        otherContentWindow: false,
        origin: new URI("http://sap.com/"),
        expectedResult: true
    }].forEach(function (oFixture) {
        QUnit.test("isTrustedPostMessageSource works as expected whith " + oFixture.testDescription, function (assert) {
            var oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

            // test preparation
            delete oMessage.data.type;
            oMessage.data = JSON.stringify(oMessage.data);
            sandbox.spy(oAppContainer.__proto__, "_isTrustedPostMessageSource");

            var oContentWindow = { name: "oContentWindow" },
                otherContentWindow = { name: "otherContentWindow" };

            oMessage.source = oContentWindow;
            oMessage.origin = oFixture.origin.protocol() + "://" + oFixture.origin.host();

            var oApplicationContainer = {
                getIframeWithPost: sandbox.stub().returns(false),
                getId: sandbox.stub().returns("CONTAINER_ID"),
                getDomRef: sandbox.stub().returns({
                    tagName: "IFRAME",
                    contentWindow: oFixture.otherContentWindow ? otherContentWindow : oContentWindow,
                    src: new URI()
                }),
                _getIFrame: ApplicationContainer.prototype._getIFrame,
                _getIFrameUrl: ApplicationContainer.prototype._getIFrameUrl,
                _isTrustedPostMessageSource: ApplicationContainer.prototype._isTrustedPostMessageSource
            };

            var bTrusted = oAppContainer._isTrustedPostMessageSource(oApplicationContainer, oMessage);

            assert.strictEqual(bTrusted, oFixture.expectedResult);
        });
    });

    [{
        id: "application-container-test1",
        desc: "NWBC, simple case without app state",
        appType: "NWBC",
        URL: window.location.origin + "/sap/public/bc/ui2/staging/test",
        expectedParameters: {
            totalNumber: 1,
            values: [{
                name: "sap-flp-params",
                value: "{\"sap-flp-url\":\"" + window.location.href + "\",\"system-alias\":\"\"}"
            }]
        }
    }
        // }, {
        //     id: "application-container-test2",
        //     desc: "TR, simple case without app state",
        //     appType: "TR",
        //     sapPostParams: true,
        //     URL: window.location.origin + "/sap/public/bc/ui2/staging/test",
        //     expectedParameters: {
        //         totalNumber: 5,
        //         URL: window.location.origin + "/sap/public/bc/ui2/staging/test",
        //         values: [{
        //             name: "sap-flp-params",
        //             value: "{\"sap-flp-url\":\"" + window.location.href + "\"}"
        //         }]
        //     }
        // }, {
        //     id: "application-container-test3",
        //     desc: "TR, send the 'sap-flp-params' with all other Iframe Url Params by POST",
        //     appType: "TR",
        //     sapPostParams: true,
        //     URL: window.location.origin + "/sap/public/bc/ui2/staging/test?sap-additional-param1=111&sap-additional-param2=222",
        //     expectedParameters: {
        //         totalNumber: 7,
        //         URL: window.location.origin + "/sap/public/bc/ui2/staging/test",
        //         values: [{
        //             name: "sap-flp-params",
        //             value: "{\"sap-flp-url\":\"" + window.location.href + "\"}"
        //         }, {
        //             name: "sap-additional-param1",
        //             value: "111"
        //         }, {
        //             name: "sap-additional-param2",
        //             value: "222"
        //         }]
        //     }
        // }, {
        //     id: "application-container-test4",
        //     desc: "TR, 'sap-iframe-hint' is sent by GET. All other params - by POST",
        //     appType: "TR",
        //     sapPostParams: true,
        //     URL: window.location.origin + "/sap/public/bc/ui2/staging/test?sap-iframe-hint=GUI&sap-additional-param1=111&sap-additional-param2=222",
        //     expectedParameters: {
        //         totalNumber: 7,
        //         URL: window.location.origin + "/sap/public/bc/ui2/staging/test?sap-iframe-hint=GUI",
        //         values: [{
        //             name: "sap-flp-params",
        //             value: "{\"sap-flp-url\":\"" + window.location.href + "\"}"
        //         }, {
        //             name: "sap-additional-param1",
        //             value: "111"
        //         }, {
        //             name: "sap-additional-param2",
        //             value: "222"
        //         }]
        //     }
        // }, {
        //     id: "application-container-test5",
        //     desc: "NWBC, URL contains sap-intent-param",
        //     appType: "NWBC",
        //     URL: window.location.origin + "/sap/public/bc/ui2/staging/test?sap-intent-param=V1",
        //     appStateData: [
        //         ["sap-intent-param-data-1234"]
        //     ],
        //     expectedParameters: {
        //         totalNumber: 1,
        //         values: [{
        //             name: "sap-flp-params",
        //             value: "{\"sap-intent-param-data\":\"sap-intent-param-data-1234\",\"sap-flp-url\":\"" + window.location.href + "\"}"
        //         }]
        //     }
        // }, {
        //     id: "application-container-test6",
        //     desc: "NWBC, URL contains sap-intent-param, sap-xapp-state and sap-iapp-state",
        //     appType: "NWBC",
        //     URL: window.location.origin + "/sap/public/bc/ui2/staging/test?sap-intent-param=V1&sap-xapp-state=V2&sap-iapp-state=V3",
        //     appStateData: [
        //         ["sap-intent-param-data-1234"],
        //         ["sap-xapp-state-data-5678"],
        //         ["sap-iapp-state-data-9012"]
        //     ],
        //     expectedParameters: {
        //         totalNumber: 1,
        //         values: [{
        //             name: "sap-flp-params",
        //             value: "{\"sap-intent-param-data\":\"sap-intent-param-data-1234\",\"sap-xapp-state-data\":\"sap-xapp-state-data-5678\"," +
        //                 "\"sap-iapp-state-data\":\"sap-iapp-state-data-9012\",\"sap-flp-url\":\"" + window.location.href + "\"}"
        //         }]
        //     }
        // }, {
        //     id: "application-container-test7",
        //     desc: "NWBC, URL contains sap-intent-param and another simple params that should be ignored",
        //     appType: "NWBC",
        //     URL: window.location.origin + "/sap/public/bc/ui2/staging/test?param1=1&sap-intent-param=V1&param2=2",
        //     appStateData: [
        //         ["sap-intent-param-data-1234"]
        //     ],
        //     expectedParameters: {
        //         totalNumber: 1,
        //         values: [{
        //             name: "sap-flp-params",
        //             value: "{\"sap-intent-param-data\":\"sap-intent-param-data-1234\",\"sap-flp-url\":\"" + window.location.href + "\"}"
        //         }]
        //     }
        // }, {
        //     id: "application-container-test8",
        //     desc: "WCF, simple case without app state",
        //     appType: "WCF",
        //     sapPostParams: true,
        //     URL: window.location.origin + "/sap/public/bc/ui2/staging/test",
        //     expectedParameters: {
        //         totalNumber: 1,
        //         URL: window.location.origin + "/sap/public/bc/ui2/staging/test",
        //         values: [{
        //             name: "sap-flp-params",
        //             value: "{\"sap-flp-url\":\"" + window.location.href + "\"}"
        //         }]
        //     }
        // }
    ].forEach(function (oFixture) {
        QUnit.test("ApplicationContainer rendering and IFrame with form post - " + oFixture.id + ": " + oFixture.desc, function (assert) {
            var fnDone = assert.async();
            Container.init("local").then(function () {
                Application.destroy(oAppContainer);
                oAppContainer = Application.createApplicationContainer(oFixture.id, {
                    sURL: "aaaa"
                });
                oAppContainer.setIframeWithPost(true);
                oAppContainer.setApplicationType(oFixture.appType);
                oAppContainer.setUrl(oFixture.URL);

                var oFakeCrossApplicationNavigation = {
                    getAppStateData: function () {
                        var oDeferred = new jQuery.Deferred();
                        setTimeout(function () {
                            oDeferred.resolve(oFixture.appStateData);
                        }, 0);

                        return oDeferred.promise();
                    }
                };
                mockSapUshellContainer({
                    services: { CrossApplicationNavigation: oFakeCrossApplicationNavigation }
                });

                prepareRenderInternally(oAppContainer, oFixture.URL);
                var oTargetNode = renderInternally(oAppContainer, true);

                oAppContainer.oDeferredRenderer.done(function () {
                    oAppContainer.bIgnoreClassCheck = true;
                    testIFrameRendered(assert, oTargetNode, oAppContainer, oFixture.appType, oFixture.URL, true);
                    checkPostFormNode(assert, oTargetNode, oAppContainer, oFixture);
                    checkPostIFrameNode(assert, oTargetNode, oAppContainer);
                    if (oTargetNode.remove) {
                        oTargetNode.remove();
                    } else {
                        oTargetNode.parentNode.removeChild(oTargetNode);
                    }
                    fnDone();
                });
            });
        });
    });

    function checkPostFormNode (assert, oTargetNode, oAppContainer, oFixture) {
        var oForm = jQuery(oTargetNode).children("div").children("form");
        assert.strictEqual(oForm.length, 1, "only one form element should be generated inside the div");
        oForm = oForm[0];
        assert.strictEqual(oForm.method, "post");
        assert.strictEqual(oForm.id, oAppContainer.getId() + "-form");
        assert.strictEqual(oForm.name, oAppContainer.getId() + "-form");
        assert.strictEqual(oForm.target, oAppContainer.getId() + "-iframe");
        if (utils.isApplicationTypeEmbeddedInIframe(oFixture.appType)) {
            if (oFixture.appType === "TR" && oFixture.sapPostParams === true) {
                assert.strictEqual(oForm.action, oFixture.expectedParameters.URL);
            } else {
                assert.strictEqual(oForm.action, oAppContainer._adjustNwbcUrl(oFixture.URL));
            }
        } else {
            assert.strictEqual(oForm.action, oFixture.URL);
        }
        assert.strictEqual(oForm.style.display, "none");
        assert.strictEqual(oForm.classList.length, 0);

        assert.strictEqual(oForm.childElementCount, oFixture.expectedParameters.totalNumber);
        var arrParameterValues = [];
        if (oFixture.expectedParameters.values) {
            arrParameterValues = arrParameterValues.concat(oFixture.expectedParameters.values);
        }
        arrParameterValues.forEach(function (element) {
            checkPostFormInputParameterNode(assert, oForm, element);
        });
    }

    function checkPostFormInputParameterNode (assert, oForm, element) {
        var oFormInput = jQuery(oForm).children("input[name='" + element.name + "']");
        assert.strictEqual(oFormInput.length, 1);
        oFormInput = oFormInput[0];
        assert.strictEqual(oFormInput.value, element.value);
        assert.strictEqual(oFormInput.classList.length, 0);
        assert.strictEqual(oFormInput.childElementCount, 0);
    }

    function checkPostIFrameNode (assert, oTargetNode, oAppContainer) {
        var oIframe = jQuery(oTargetNode).children("div").children("iframe");
        assert.strictEqual(oIframe.length, 1, "only one iframe element should be generated inside the div");
        oIframe = oIframe[0];
        assert.strictEqual(oIframe.childElementCount, 0);
        checkIFrameNode(assert, oIframe, oAppContainer, false);
        assert.strictEqual(oIframe.id, oAppContainer.getId() + "-iframe");
        assert.strictEqual(oIframe.src, "");
        assert.strictEqual(oIframe.getAttribute("data-sap-ui"), oAppContainer.getId() + "-iframe");
    }

    QUnit.test("ApplicationContainer rendering application type URL with form post enabled should not render form", function (assert) {
        // Arrange
        var sUrl = window.location.origin + "/sap/public/bc/ui2/staging/test";
        oAppContainer.setIframeWithPost(true);
        oAppContainer.setApplicationType(ApplicationType.URL.type);
        oAppContainer.setUrl(sUrl);

        mockSapUshellContainer();

        renderInternallyAndExpectIFrame(assert, oAppContainer, ApplicationType.URL.type, sUrl, undefined, false);
    });

    [{
        description: "with POST request",
        setPostInURL: false,
        expected: 0
    }, {
        description: "with GET request",
        setPostInURL: false,
        expected: 0
    }, {
        description: "with GET request",
        setPOSTInURL: false,
        expected: 0
    }, {
        description: "with GET request",
        setPostInURL: false,
        expected: 0
    }].forEach(function (oFixture) {
        QUnit.test("ApplicationContainer - rendering cFLP application " + oFixture.description, function (assert) {
            return Container.init("local").then(function () {
                var sUrl = window.location.origin + "/sap/public/bc/ui2/staging/test";
                oAppContainer.setIframeWithPost(oFixture.setPostInURL);
                oAppContainer.setApplicationType(ApplicationType.URL.type);
                oAppContainer.setUrl(sUrl);

                var oRenderManager = new RenderManager();

                sandbox.spy(utils, "filterOutParamsFromLegacyAppURL");
                sandbox.spy(utils, "getParamKeys");
                sandbox.spy(IframePOSTUtils, "buildHTMLElements");

                oRenderManager.render(oAppContainer, document.createElement("DIV"));

                assert.ok(utils.filterOutParamsFromLegacyAppURL.callCount === oFixture.expected, "container _filterURLParams method was called as expected");
                assert.ok(utils.getParamKeys.callCount === oFixture.expected, "container _getParamKeys method was called as expected");
                assert.ok(IframePOSTUtils.buildHTMLElements.callCount === oFixture.expected, "container _buildHTMLElements method was called as expected");

                sandbox.restore();
            });
        });
    });

    QUnit.test("Post messages received after plugins initiated", function (assert) {
        var fnDone = assert.async();
        Container.init("local").then(function () {
            var oDeferred = new jQuery.Deferred();
            var oPromise = oDeferred.promise();
            var oHandleMessageStub = sandbox.stub(ApplicationContainer.prototype, "_handleMessageEvent");

            sandbox.stub(Container, "getServiceAsync").resolves({
                getPluginLoadingPromise: sandbox.stub().returns(oPromise)
            });

            oDeferred.resolve();

            ApplicationContainer.prototype._handlePostMessagesForPluginsPostLoading({}, {}, {
                bApiRegistered: false
            });
            ApplicationContainer.prototype._handlePostMessagesForPluginsPostLoading({}, {}, {
                bApiRegistered: false
            });

            setTimeout(function () {
                oPromise.done(function () {
                    assert.ok(!oHandleMessageStub.called, "messages should not be processed");
                    sandbox.restore();
                    fnDone();
                });
            }, 1000);
        });
    });

    QUnit.test("Post messages received before plugins initiated", function (assert) {
        var fnDone = assert.async();
        Container.init("local").then(function () {
            var oDeferred = new jQuery.Deferred();
            var oPromise = oDeferred.promise();
            var oHandleMessageStub = sandbox.stub(ApplicationContainer.prototype, "_handleMessageEvent");

            sandbox.stub(Container, "getServiceAsync").resolves({
                getPluginLoadingPromise: sandbox.stub().returns(oPromise)
            });

            ApplicationContainer.prototype._handlePostMessagesForPluginsPostLoading({}, {}, {
                bApiRegistered: true
            });
            ApplicationContainer.prototype._handlePostMessagesForPluginsPostLoading({}, {}, {
                bApiRegistered: false
            });
            ApplicationContainer.prototype._handlePostMessagesForPluginsPostLoading({}, {}, {
                bApiRegistered: true
            });
            ApplicationContainer.prototype._handlePostMessagesForPluginsPostLoading({}, {}, {
                bApiRegistered: false
            });
            ApplicationContainer.prototype._handlePostMessagesForPluginsPostLoading({}, {}, {
                bApiRegistered: true
            });

            setTimeout(function () {
                oDeferred.resolve();

                oPromise.done(function () {

                    assert.strictEqual(oHandleMessageStub.callCount, 2, "messages should not be processed");
                    sandbox.restore();
                    fnDone();
                });

            }, 1000);
        });
    });

    [{
        description: "Open with POST, configuration parameter = true  ",
        setPostInURL: true,
        openIframeWithPostConfiguration: true,
        openByPost: 1,
        openByGet: 1,
        applicationType: "WDA"
    }, {
        description: "Open with GET, configuration parameter = false",
        setPostInURL: false,
        openIframeInPost: false,
        openByPost: 0,
        openByGet: 1,
        applicationType: "NWBC"
    }].forEach(function (oFixture) {
        QUnit.test("ApplicationContainer - rendering " + oFixture.description, function (assert) {
            return Container.init("local").then(function () {
                var sUrl = window.location.origin + "/sap/public/bc/ui2/staging/test";
                oAppContainer.setIframeWithPost(oFixture.setPostInURL);
                oAppContainer.setApplicationType(oFixture.applicationType);
                oAppContainer.setUrl(sUrl);
                sandbox.stub(Config, "last").returns(oFixture.openIframeInPost);
                var oRenderManager = new RenderManager();


                sandbox.spy(IframePOSTUtils, "renderIframeWithPOST");
                var oFireEventStub = sandbox.spy(oAppContainer, "fireEvent");
                //sandbox.spy(oAppContainer, "fireEvent").calledWith("applicationConfiguration");

                oRenderManager.render(oAppContainer, document.createElement("DIV"));

                assert.ok(IframePOSTUtils.renderIframeWithPOST.callCount === oFixture.openByPost, "renderIframeWithPOST method was called as expected");
                assert.ok(oFireEventStub.calledOnceWith("applicationConfiguration"), "fireEvent method was called as expected");
            });
        });
    });


    [{
        applicationType: "URL",
        frameworkId: "WCF",
        results: {
            urlParams: "sap-ie=edge&sap-theme=SAP_TEST_THEME&sap-iapp-state=ABCD&sap-ushell-timeout=0"
        }
    }, {
        applicationType: "URL",
        frameworkId: "TR",
        results: {
            urlParams: "sap-ie=edge&sap-theme=SAP_TEST_THEME&sap-iapp-state=ABCD&sap-ushell-timeout=0"
        }
    }, {
        applicationType: "URL",
        frameworkId: "NWBC",
        results: {
            urlParams: "sap-ie=edge&sap-theme=SAP_TEST_THEME&sap-iapp-state=ABCD&sap-ushell-timeout=0"
        }
    }, {
        applicationType: "WCF",
        frameworkId: "",
        results: {
            urlParams: "sap-ie=edge&sap-theme=SAP_TEST_THEME&sap-iapp-state=ABCD&sap-ushell-timeout=0"
        }
    }, {
        applicationType: "TR",
        frameworkId: "",
        results: {
            urlParams: "sap-ie=edge&sap-theme=SAP_TEST_THEME&sap-keepclientsession=2&sap-iapp-state=ABCD&sap-ushell-timeout=0"
        }
    }, {
        applicationType: "NWBC",
        frameworkId: "",
        results: {
            urlParams: "sap-ie=edge&sap-theme=SAP_TEST_THEME&sap-iapp-state=ABCD&sap-ushell-timeout=0"
        }
    }].forEach(function (oFixture) {
        QUnit.test("ApplicationContainer rendering iframe URL should append app state.", function (assert) {
            var sUrl = window.location.origin + "/sap/public/bc/ui2/staging/test";
            var appState = "ABCD";
            sandbox.stub(window.hasher, "getHash").returns(`#APPLICATION?sap-iapp-state=${appState}`);

            oAppContainer.setApplicationType(oFixture.applicationType);
            oAppContainer.setFrameworkId(oFixture.frameworkId);
            oAppContainer.setUrl(sUrl);

            mockSapUshellContainer();
            var targetNode = renderInternallyAndExpectIFrame(assert, oAppContainer, oAppContainer.getApplicationType(), sUrl);

            assert.strictEqual(targetNode.childNodes[0].src, `${sUrl}?${oFixture.results.urlParams}`, "App state has been appended to iFrame URL");
            sandbox.restore();
        });
    });
});
