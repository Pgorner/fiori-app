// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.applicationIntegration.application.PostMessageAPI
 */
sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/base/Log",
    "sap/m/library",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/components/container/ApplicationContainer",
    "sap/ushell/components/applicationIntegration/application/PostMessageAPI",
    "sap/ushell/components/applicationIntegration/application/PostMessageUtils",
    "sap/ui/thirdparty/URI",
    "sap/ushell/Container"
], function (
    ObjectPath,
    Log,
    mobileLibrary,
    jQuery,
    ApplicationContainer,
    PostMessageAPI,
    PostMessageUtils,
    URI,
    Container
) {
    "use strict";

    // shortcut for sap.m.URLHelper
    var URLHelper = mobileLibrary.URLHelper;

    /* global sinon, QUnit */

    var sandbox = sinon.createSandbox({});

    QUnit.module("sap.ushell.components.applicationIntegration.application.PostMessageAPI", {
        beforeEach: function (assert) {
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("test sendEmail no app state with bSetAppStateToPublic=false", function (assert) {
        var oTriggerEmailStub = sandbox.stub(URLHelper, "triggerEmail");

        PostMessageAPI._sendEmail(
            "to",
            "subject http://www.a.com as test",
            "body with link http://www.a.com",
            "cc",
            "bcc",
            "http://www.a.com",
            false);

        assert.ok(oTriggerEmailStub.calledWith(
            "to",
            "subject " + document.URL + " as test",
            "body with link " + document.URL,
            "cc",
            "bcc"));
    });

    QUnit.test("test sendEmail no app state with bSetAppStateToPublic=true", function (assert) {
        const done = assert.async();
        var oTriggerEmailStub = sandbox.stub(URLHelper, "triggerEmail");

        sandbox.stub(Container, "getServiceAsync").callsFake(function () {
            return Promise.resolve({
                setAppStateToPublic: sandbox.stub().returns(new jQuery.Deferred().resolve("http://www.a.com").promise())
            });
        });

        PostMessageAPI._sendEmail(
            "to",
            "subject http://www.a.com as test",
            "body with link http://www.a.com",
            "cc",
            "bcc",
            "http://www.a.com",
            true);

        setTimeout(function () {
            assert.ok(oTriggerEmailStub.calledWith(
                "to",
                "subject " + document.URL + " as test",
                "body with link " + document.URL,
                "cc",
                "bcc"));
            done();
        }, 0);
    });

    QUnit.test("test sendEmail with app state with bSetAppStateToPublic=true", function (assert) {
        const done = assert.async();
        var oTriggerEmailStub = sandbox.stub(URLHelper, "triggerEmail");

        sandbox.stub(Container, "getServiceAsync").callsFake(function () {
            return Promise.resolve({
                setAppStateToPublic: sandbox.stub().returns(new jQuery.Deferred().resolve(
                    "http://www.a.com?sap-xapp-state=CCC&sap-iapp-state=DDD&dummy=4",
                    "AAA", "BBB", "CCC", "DDD"
                ).promise())
            });
        });

        sandbox.stub(PostMessageAPI, "_getBrowserURL").returns(document.URL + "?sap-xapp-state=AAA&sap-iapp-state=BBB&dummy=4");

        PostMessageAPI._sendEmail(
            "to",
            "subject http://www.a.com?sap-xapp-state=AAA&sap-iapp-state=BBB&dummy=4 as test",
            "body with link http://www.a.com?sap-xapp-state=AAA&sap-iapp-state=BBB&dummy=4",
            "cc",
            "bcc",
            "http://www.a.com?sap-xapp-state=AAA&sap-iapp-state=BBB&dummy=4",
            true);

        setTimeout(function () {
            assert.ok(oTriggerEmailStub.calledWith(
                "to",
                "subject " + document.URL + "?sap-xapp-state=CCC&sap-iapp-state=DDD&dummy=4 as test",
                "body with link " + document.URL + "?sap-xapp-state=CCC&sap-iapp-state=DDD&dummy=4",
                "cc",
                "bcc"));

            done();
        }, 0);
    });

    QUnit.test("test sendEmail with app state with bSetAppStateToPublic=true with sIStateKey and no sXStateKey", function (assert) {
        const done = assert.async();
        var oTriggerEmailStub = sandbox.stub(URLHelper, "triggerEmail");

        sandbox.stub(Container, "getServiceAsync").callsFake(function () {
            return Promise.resolve({
                setAppStateToPublic: sandbox.stub().returns(new jQuery.Deferred().resolve(
                    "http://www.a.com?sap-iapp-state=DDD&dummy=4",
                    undefined, "BBB", "", "DDD"
                ).promise())
            });
        });

        sandbox.stub(PostMessageAPI, "_getBrowserURL").returns("http://www.xyz.com?sap-iapp-state=BBB&dummy=4");

        PostMessageAPI._sendEmail(
            "to",
            "subject http://www.a.com?sap-iapp-state=BBB&dummy=4 as test",
            "body with link http://www.a.com?sap-iapp-state=BBB&dummy=4",
            "cc",
            "bcc",
            "http://www.a.com?sap-iapp-state=BBB&dummy=4",
            true);

        setTimeout(function () {
            assert.ok(oTriggerEmailStub.calledWith(
                "to",
                "subject http://www.xyz.com?sap-iapp-state=DDD&dummy=4 as test",
                "body with link http://www.xyz.com?sap-iapp-state=DDD&dummy=4",
                "cc",
                "bcc"));

            done();
        }, 0);
    });

    QUnit.test("_stripBookmarkServiceUrlForLocalContentProvider - noop if parameters empty", function (assert) {
        PostMessageAPI._stripBookmarkServiceUrlForLocalContentProvider();
        assert.ok(true, "no parameters");

        PostMessageAPI._stripBookmarkServiceUrlForLocalContentProvider({}, {});
        assert.ok(true, "empty objects");

        PostMessageAPI._stripBookmarkServiceUrlForLocalContentProvider(undefined, {});
        assert.ok(true, "empty system context");
    });

    QUnit.test("_stripBookmarkServiceUrlForLocalContentProvider - service URL property not added for local content provider", function (assert) {
        var oParameters = {
        };
        var oSystemContext = {
            id: ""
        };

        PostMessageAPI._stripBookmarkServiceUrlForLocalContentProvider(oParameters, oSystemContext);
        assert.strictEqual(oParameters.hasOwnProperty("serviceUrl"), false, "service URL property is not added");
    });

    QUnit.test("_stripBookmarkServiceUrlForLocalContentProvider - service URL removed for local content provider", function (assert) {
        var oParameters = {
            serviceUrl: "../dummy/odata/service"
        };
        var oSystemContext = {
            id: ""
        };

        PostMessageAPI._stripBookmarkServiceUrlForLocalContentProvider(oParameters, oSystemContext);
        assert.strictEqual(oParameters.serviceUrl, undefined, "service URL is undefined");
    });

    QUnit.test("_stripBookmarkServiceUrlForLocalContentProvider - service URL removed for 'saas_approuter' content provider", function (assert) {
        var oParameters = {
            serviceUrl: "../dummy/odata/service"
        };
        var oSystemContext = {
            id: "saas_approuter"
        };

        PostMessageAPI._stripBookmarkServiceUrlForLocalContentProvider(oParameters, oSystemContext);
        assert.strictEqual(oParameters.serviceUrl, undefined, "service URL is undefined");
    });

    QUnit.module("for registerAsyncDirtyStateProvider", {
        beforeEach: function () {
            return Container.init("local");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("registerAsyncDirtyStateProvider with post message result", function (assert) {
        var done = assert.async();
        var oServiceParams = {
            oContainer: {
                getDomRef: sandbox.stub().returns({
                    tagName: "IFRAME",
                    src: new URI()
                }),
                _getIFrame: ApplicationContainer.prototype._getIFrame,
                _getIFrameUrl: ApplicationContainer.prototype._getIFrameUrl,
                getIframeWithPost: sandbox.stub().returns(false)
            }
        };

        sandbox.stub(PostMessageUtils, "postMessageToIframeObject").callsFake(function () {
            return new Promise(function (fnResolve) {
                setTimeout(function () {
                    fnResolve({
                        body: {
                            result: true
                        }
                    });
                }, 200);
            });
        });
        PostMessageAPI.registerAsyncDirtyStateProvider(oServiceParams);
        Container.getDirtyFlagsAsync().then(function (bIsDirty) {
            assert.ok(bIsDirty === true);
            done();
        });
    });

    QUnit.test("registerAsyncDirtyStateProvider with no post message result", function (assert) {
        var done = assert.async();
        var oServiceParams = {
            oContainer: {
                postMessageToCurrentIframe: sandbox.stub().callsFake(function (oMessage, bWaitForResponse) {
                    return new Promise(function (fnResolve) {
                    });
                })
            }
        };

        sandbox.stub(PostMessageUtils, "createPostMessageRequest").returns({});
        PostMessageAPI.registerAsyncDirtyStateProvider(oServiceParams);
        Container.getDirtyFlagsAsync().then(function (bIsDirty) {
            assert.ok(bIsDirty === false);
            done();
        });
    });

    QUnit.test("backButtonPressedCallback works as expected", function (assert) {
        var oPostMessageStub = sandbox.stub(),
            oFakeSourceWindow = { postMessage: oPostMessageStub };

        // this callback is called when the back button is pressed
        PostMessageAPI._backButtonPressedCallback(oFakeSourceWindow, "some.service", "some.origin");

        assert.strictEqual(oPostMessageStub.callCount, 1, "postMessage method was called once on the given window");
        assert.strictEqual(oPostMessageStub.getCall(0).args.length, 2, "postMessage method was called with two arguments");
        try {
            var oJsonCallArg = JSON.parse(oPostMessageStub.getCall(0).args[0]);
            assert.ok(true, "first argument is valid JSON");
            assert.strictEqual(oJsonCallArg.type, "request", ".type member has the expected value");
            assert.strictEqual(oJsonCallArg.service, "some.service", ".service member has the expected value");
            assert.strictEqual(!!oJsonCallArg.request_id.match(/id[-]\d+[-]\d+/), true, ".request_id member matches the format id-#########-###");
            assert.deepEqual(oJsonCallArg.body, {}, ".body member is empty");
        } catch (oError) {
            assert.ok(false, "first argument is valid JSON. Error:" + oError);
        }

        assert.strictEqual(oPostMessageStub.getCall(0).args[1], "some.origin", "obtained the expected second argument");
    });

    QUnit.test("sap.ushell.services.UserDefaultParameters", async function (assert) {
        const fnDone = assert.async();
        const oAPIs = PostMessageAPI.getAPIs();
        const oSystemContextMock = {
            test: "system-context"
        };
        const sParamName = "test-param-name";

        const [AppLifeCycle, UserDefaultParameters] = await Promise.all([
            Container.getServiceAsync("AppLifeCycle"),
            Container.getServiceAsync("UserDefaultParameters")
        ]);

        const oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
        oGetServiceAsyncStub.withArgs("AppLifeCycle").resolves(AppLifeCycle);
        oGetServiceAsyncStub.withArgs("UserDefaultParameters").resolves(UserDefaultParameters);

        sandbox.stub(AppLifeCycle, "getCurrentApplication").returns({
            getSystemContext: sandbox.stub().resolves(oSystemContextMock)
        });

        this.oGetValueStub = sandbox.stub(UserDefaultParameters, "getValue");

        await oAPIs["sap.ushell.services.UserDefaultParameters"].oServiceCalls.getValue.executeServiceCallFn({
            oMessageData: {
                body: {
                    sParameterName: sParamName
                }
            }
        });

        assert.strictEqual(this.oGetValueStub.callCount, 1, "getValue was called once.");
        assert.deepEqual(this.oGetValueStub.firstCall.args, [sParamName, oSystemContextMock], "getValue was called with the expected arguments.");

        fnDone();
    });
});
