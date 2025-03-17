/*global QUnit, sinon */
sap.ui.define([
    'sap/insights/HandleNonS4Environment',
    'sap/insights/CardExtension',
    'sap/base/Log'
], function (HandleNonS4Environment, CardExtension, Log) {
    "use strict";
    QUnit.module("HandleNonS4Environment test cases", {
        beforeEach: function () {
            this.oSandbox = sinon.sandbox.create();
        },
        afterEach: function () {
            this.oSandbox.restore();
            sinon.restore();
        }

    });

    QUnit.test("Detect and initialize HandleNonS4Evironment", function (assert) {
        window["sap-ushell-config"] = {
            ushell: {
                homeApp: false
            }
        };
        this.oCardExtension = new CardExtension();
        this.oCardExtension._setCard(null,
            {
                getManifestEntry: function () { return {}; }
            }
        );
        this.oSandbox.spy(HandleNonS4Environment, "initialize");
        return this.oCardExtension.loadDependencies().then(function () {
            assert.ok(HandleNonS4Environment.initialize.calledOnce, "HandleNonS4Environment.initialize is called");
            this.oCardExtension.destroy();
        }.bind(this));
    });

    QUnit.test("Do not call HandleNonS4Evironment if in S/4", function (assert) {
        window["sap-ushell-config"] = {
            ushell: {
                homeApp: true
            }
        };
        this.oCardExtension = new CardExtension();
        this.oCardExtension._setCard(null,
            {
                getManifestEntry: function () { return {}; }
            }
        );
        this.oSandbox.spy(HandleNonS4Environment, "initialize");
        return this.oCardExtension.loadDependencies().then(function () {
            assert.ok(HandleNonS4Environment.initialize.notCalled, "HandleNonS4Environment.initialize is not called");
            this.oCardExtension.destroy();
        }.bind(this));
    });

    QUnit.test("createAppStateId to return Id having length 40", function (assert) {
        var sId = HandleNonS4Environment._.createAppStateId();
        assert.equal(sId.length, 40, "Length 40 received");
    });

    QUnit.test("getIntent: get Target Intent with sXappStateId", async function (assert) {
        var oMockParameter = {
            "ibnTarget": {
                "semanticObject": "CreditMemoRequest",
                "action": "manage"
            },
            "ibnParams": {
                "sap-xapp-state-data": "{\"presentationVariant\":{\"SortOrder\":[{\"Property\":\"LastChangeDateTime\",\"Descending\":true}]},\"selectionVariant\":{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"OverallBillingBlockStatus\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"B\",\"High\":null},{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"C\",\"High\":null}]}]}}"
            },
            "sensitiveProps": []
        };
        var sMockStateId = "CI72CBK3QS2RGCN5486R5MK1DELQS9L5NBDLS951";
        var sTargetIntent = await HandleNonS4Environment._.getIntent(oMockParameter, sMockStateId);
        assert.equal(sTargetIntent, "#CreditMemoRequest-manage?sap-xapp-state=" + sMockStateId, "Correct TargetIntent Received: " + sTargetIntent);
    });

    QUnit.test("getIntent: get Target Intent without sXappStateId", async function (assert) {
        var oMockParameter = {
            "ibnTarget": {
                "semanticObject": "CreditMemoRequest",
                "action": "manage"
            },
            "ibnParams": {
                "sap-xapp-state-data": "{}"
            },
            "sensitiveProps": []
        };
        var sTargetIntent = await HandleNonS4Environment._.getIntent(oMockParameter);
        assert.equal(sTargetIntent, "#CreditMemoRequest-manage", "Correct TargetIntent Received: " + sTargetIntent);
    });

    QUnit.test("getIntent: get Target Intent when there is no sap-xapp-state-data", async function (assert) {
        var oMockParameter = {
            "ibnTarget": {
                "semanticObject": "CreditMemoRequest",
                "action": "manage"
            },
            "ibnParams": {
            },
            "sensitiveProps": []
        };
        var sTargetIntent = await HandleNonS4Environment._.getIntent(oMockParameter);
        assert.equal(sTargetIntent, "#CreditMemoRequest-manage", "Correct TargetIntent Received: " + sTargetIntent);
    });

    QUnit.test("getRuntimeDestinationUrl: get destination url when oCard is present", function (assert) {
        var sMockDestinationUrl = "https://TestDestinationURL:443";
        var oMockCard = {
            getHostInstance: function () {
                return {
                    getDestination: function (sS4DestinationNameAlias, oCard) {
                        return Promise.resolve(sMockDestinationUrl);
                    }
                };
            }
        };
        var promise = HandleNonS4Environment._.getRuntimeDestinationUrl(oMockCard);
        return promise.then(function (sRuntimeDestinationUrl) {
            assert.equal(sRuntimeDestinationUrl, sMockDestinationUrl, "Correct Destination Url Received: " + sRuntimeDestinationUrl);
        });
    });

    QUnit.test("getRuntimeDestinationUrl: get destination url when oCard is not present", function (assert) {
        var promise = HandleNonS4Environment._.getRuntimeDestinationUrl();
        return promise.then(function() {
            assert.ok(false, "Exptected reject was not triggered if no oCard is provided");
        }).catch(function (sError) {
            assert.equal(sError, "S/4 runtime destination URL could not be determined!",  "Error Message Received: " + sError);
        });
    });

    QUnit.test("getRuntimeDestinationUrl: get destination url when oCard has no host assigned", function (assert) {
        var oMockCard = {
            getHostInstance: function () {
                return null; // see openui5 src/sap.ui.integration/src/sap/ui/integration/widgets/Card.js
            }
        };
        var promise = HandleNonS4Environment._.getRuntimeDestinationUrl(oMockCard);
        return promise.then(function() {
            assert.ok(false, "Exptected reject was not triggered if oCard has no host is provided");
        }).catch(function (sError) {
            assert.equal(sError, "S/4 runtime destination URL could not be determined!",  "Error Message Received: " + sError);
        });
    });

    QUnit.test("getRuntimeDestinationUrl: Error scenario", function (assert) {
        var errorMsg = "Destination URL Not found!";
        var oMockCard = {
            getHostInstance: function () {
                return {
                    getDestination: function (sS4DestinationNameAlias, oCard) {
                        return Promise.reject(errorMsg);
                    }
                };
            }
        };
        this.oSandbox.spy(Log, "error");
        var promise = HandleNonS4Environment._.getRuntimeDestinationUrl(oMockCard);
        return promise.catch(function (errorMsg) {
            assert.equal(errorMsg, errorMsg, "Error Message Received");
        });
    });

    QUnit.test("addQueryParameter: In case of Url with query string, query parameter will be concatenated with '&'", async function (assert) {
        var sMockDestinationUrl = "https://TestDestinationURL:443?sap-ui-version=untested";
        var sResultUrl = await HandleNonS4Environment._.addQueryParameter(sMockDestinationUrl);
        assert.equal(sResultUrl, sMockDestinationUrl + "&sap-language=EN", "Query got concatenated with '&'");
    });

    QUnit.test("addQueryParameter: In case of Url without query string, query parameter will be concatenated with '?'", async function (assert) {
        var sMockDestinationUrl = "https://TestDestinationURL:443";
        var sResultUrl = await HandleNonS4Environment._.addQueryParameter(sMockDestinationUrl);
        assert.equal(sResultUrl, sMockDestinationUrl + "?sap-language=EN", "Query got concatenated with '?'");
    });

    QUnit.test("addQueryParameter: In case of host context, query parameters should get appended", async function (assert) {
        var sMockDestinationUrl = "https://TestDestinationURL:443";
        var oCard = {
            getHostInstance: function() {
                return {
                    getContextValue: function() {
                        return Promise.resolve(JSON.stringify({
                            "sap-ushell-config":"headerless",
                            "sap-ui-version":"untested"
                        }));
                    }
                };
            }
        };
        var sResultUrl = await HandleNonS4Environment._.addQueryParameter(sMockDestinationUrl, oCard);
        assert.equal(sResultUrl, sMockDestinationUrl + "?sap-language=EN&sap-ushell-config=headerless&sap-ui-version=untested", "Host Context got appended");
    });
    QUnit.test("addQueryParameter: In case of error in fetching host context, destination url should be returned", async function (assert) {
        var sMockDestinationUrl = "https://TestDestinationURL:443";
        var oCard = {
            getHostInstance: function() {
                return {
                    getContextValue: function() {
                        return Promise.reject();
                    }
                };
            }
        };
        var sResultUrl = await HandleNonS4Environment._.addQueryParameter(sMockDestinationUrl, oCard);
        assert.equal(sResultUrl, sMockDestinationUrl + "?sap-language=EN", "destination url is returned");
    });

    QUnit.test("saveXAppState", function (assert) {
        var sMockAppStateId = "CI72CBK3QS2RGCN5486R5MK1DELQS9L5NBDLS951";
        var sAppStateData = '{"presentationVariant":{"SortOrder":[{"Property":"LastChangeDateTime","Descending":true}]},"selectionVariant":{"Parameters":[],"SelectOptions":[{"PropertyName":"OverallBillingBlockStatus","Ranges":[{"Sign":"I","Option":"EQ","Low":"B","High":null},{"Sign":"I","Option":"EQ","Low":"C","High":null}]}]}}';
        var oMockCard = {
            request: function (oReqPayload) {
                return Promise.resolve("");
            }
        };
        this.oSandbox.spy(oMockCard, "request");
        HandleNonS4Environment._.saveXAppState(oMockCard, sMockAppStateId, sAppStateData);
        var oExpectedPayload = {
            id: sMockAppStateId,
            sessionKey: "",
            component: "",
            appName: "",
            value: sAppStateData.replaceAll("{", "\\{")
        };
        var oExpectedReqPayload = {
            url: "{{destinations.service}}/sap/opu/odata/UI2/INTEROP/GlobalContainers",
            method: "POST",
            parameters: oExpectedPayload,
            headers: {
                Accept: "application/json",
                "X-CSRF-Token": "{{csrfTokens.token1}}",
                "content-type": "application/json"
            }
        };
        assert.ok(oMockCard.request.calledWith(oExpectedReqPayload), "oCard.request was called with correct arguments");
    });

    QUnit.test("handleAction: successful generation of destinationUrl", function (assert) {
        var oMockEvent = {
            getParameter: function (sParameter) {
                if (sParameter === "type") {
                    return "Navigation";
                } else if (sParameter === "parameters") {
                    return {
                        "ibnTarget": {
                            "semanticObject": "CreditMemoRequest",
                            "action": "manage"
                        },
                        "ibnParams": {
                            "sap-xapp-state-data": "{\"presentationVariant\":{\"SortOrder\":[{\"Property\":\"LastChangeDateTime\",\"Descending\":true}]},\"selectionVariant\":{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"OverallBillingBlockStatus\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"B\",\"High\":null},{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"C\",\"High\":null}]}]}}"
                        },
                        "sensitiveProps": []
                    };
                }
                return "";
            },
            preventDefault: function () {}
        };
        var sMockDestinationUrl = "Test DestinationUrl";
        var oMockCard = {
            getHostInstance: function () {
                return {
                    getDestination: function (sS4DestinationNameAlias, oCard) {
                        return Promise.resolve(sMockDestinationUrl);
                    },
                    getContextValue: function (){
                        return Promise.resolve(null);
                    }
                };
            }
        };
        var done = assert.async();
        var oMockgetCard = {
            request: function () {
                return Promise.resolve();
            },
            triggerAction: function (oParameters) {
                assert.ok(oParameters.parameters.url.startsWith(sMockDestinationUrl + "?sap-language=EN#CreditMemoRequest-manage?sap-xapp-state="), "Correct URL was created: " + oParameters.parameters.url);
                done();
            }
        };
        var handleAction = HandleNonS4Environment._.handleAction.bind({
            getCard: function () {
                return oMockgetCard;
            },
            _oCard: oMockCard
        });
        handleAction(oMockEvent);
    });

    QUnit.test("handleAction: error in generation of destinationUrl", async function (assert) {
        var errorMsg = "Destination URL Not found!";
        var oMockEvent = {
            getParameter: function (sParameter) {
                if (sParameter === "type") {
                    return "Navigation";
                } else if (sParameter === "parameters") {
                    return {
                        "ibnTarget": {
                            "semanticObject": "CreditMemoRequest",
                            "action": "manage"
                        },
                        "ibnParams": {
                            "sap-xapp-state-data": "{\"presentationVariant\":{\"SortOrder\":[{\"Property\":\"LastChangeDateTime\",\"Descending\":true}]},\"selectionVariant\":{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"OverallBillingBlockStatus\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"B\",\"High\":null},{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"C\",\"High\":null}]}]}}"
                        },
                        "sensitiveProps": []
                    };
                }
                return "";
            },
            preventDefault: function () {}
        };
        var oMockCard = {
            getHostInstance: function () {
                return {
                    getDestination: function (sS4DestinationNameAlias, oCard) {
                        return Promise.reject(errorMsg);
                    },
                    getContextValue: function (){
                        return Promise.resolve(null);
                    }
                };
            }
        };
        var done = assert.async();
        var oMockgetCard = {
            request: function () {
                return Promise.resolve();
            },
            triggerAction: function () {}
        };
        this.oSandbox.spy(oMockgetCard, "triggerAction");
        var handleAction = HandleNonS4Environment._.handleAction.bind({
            getCard: function () {
                return oMockgetCard;
            },
            _oCard: oMockCard
        });
        sinon.stub(Log, 'error', function (e) {
            assert.equal(e, errorMsg, "Error Message Received");
            assert.ok(oMockgetCard.triggerAction.notCalled, "Trigger Action was not called on error");
            done();
        });
        await handleAction(oMockEvent);
    });

    QUnit.test("initialize", function (assert) {
        var oMockCardExt = {
            attachAction: function () {}
        };
        this.oSandbox.spy(oMockCardExt, "attachAction");
        HandleNonS4Environment.initialize(oMockCardExt);
        assert.ok(oMockCardExt.attachAction.calledOnce, "Card extension action handler successfully attached");
    });
});