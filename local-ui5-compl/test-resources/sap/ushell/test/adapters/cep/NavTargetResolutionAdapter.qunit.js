// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileoverview QUnit tests for sap.ushell.adapters.cep.NavTargetResolutionAdapter
 * @deprecated As of version 1.120
 */

sap.ui.define([
        "sap/ushell/adapters/cep/NavTargetResolutionAdapter",
        "sap/base/util/ObjectPath",
        "sap/ushell/utils/HttpClient",
        "sap/ushell/Config",
        "sap/ushell/Container"

    ],
    function (
        NavTargetResolutionAdapter,
        ObjectPath,
        HttpClient,
        Config,
        Container
    ) {
        "use strict";

        /* global sinon, QUnit */

        var sandbox = sinon.sandbox.create();

        QUnit.module("_getIntentForService", {
            beforeEach: function () {
                var oConfig = {
                    config: {}
                };
                this.oAdapter = new NavTargetResolutionAdapter({}, {}, oConfig);
                return Container.init("local");
            },
            afterEach: function () {
                sandbox.restore();
            }
        });

        var oSampleRequest = {
            semanticObject: "OutputRequestItem",
            semanticObjectAction: "show",
            intentParameters: {
                SalesOrganization: ["001"],
                SalesOffice: ["FRA"]
            },
            queryParameters: {
                siteId: "5b65b497-f218-443c-b3fd-92300a194efa"
            }
        };

        QUnit.test("calls service correctly", function (assert) {
            sandbox.stub(Config, "last").withArgs("/core/site/siteId").returns("5b65b497-f218-443c-b3fd-92300a194efa");

            return this.oAdapter._getIntentForService("#OutputRequestItem-show?SalesOrganization=001&SalesOffice=FRA")
                .then(function (oRequestActual) {
                    assert.deepEqual(oRequestActual, oSampleRequest);
                })
                .catch(function () {
                    assert.ok(false, "failed to resolve");
                });
        });

        QUnit.module("_addVirtualInboundsToApplications");

        QUnit.test("calls function correctly", function (assert) {
            this.oAdapter = new NavTargetResolutionAdapter({}, {}, {});
            var oApp = ObjectPath.get("oAdapterConfiguration.config.applications", this.oAdapter);
            assert.equal(Boolean(oApp["Action-search"]), true);
        });

        QUnit.module("resolveHashFragment", {
            beforeEach: function () {
                var oConfig = {
                    config: {}
                };
                this.oFakeServer = sandbox.useFakeXMLHttpRequest();
                this.oAdapter = new NavTargetResolutionAdapter({}, {}, oConfig);
            },
            afterEach: function () {
                sandbox.restore();
            }
        });

        QUnit.test("Promise Resolved", function (assert) {

            sandbox.stub(HttpClient.prototype, "post").returns(Promise.resolve({
                success: true,
                status: 200,
                responseText: JSON.stringify({ result: " test" })
            }));

            sandbox.stub(this.oAdapter, "_getIntentForService").returns(Promise.resolve({}));
            return this.oAdapter.resolveHashFragment()
                .then(function () {
                    assert.ok(true, "resolved");
                })
                .catch(function () {
                    assert.ok(false, "failed to resolve");
                });
        });

        QUnit.test("calls resolveHashFragment correctly if it resolves to an array", function (assert) {
            sandbox.stub(HttpClient.prototype, "post").returns(Promise.resolve({
                status: 200,
                responseText: JSON.stringify([
                    {
                        bulkIndex: 0,
                        url: "https://my-test-url",
                        stateIdentifier: "test",
                        stateValidity: 1,
                        launchType: "auto"
                    }
                ])
            }));

            sandbox.stub(this.oAdapter, "_getIntentForService").returns(Promise.resolve({}));
            return this.oAdapter.resolveHashFragment()
                .then(function (resolutionResult) {
                    assert.deepEqual({
                        additionalInformation: "",
                        url: "https://my-test-url",
                        applicationType: "URL",
                        navigationMode: "newWindow"
                    }, resolutionResult, "The resolution result was as expected.");
                })
                .catch(function () {
                    assert.ok(false, "failed to resolve");
                });
        });

        QUnit.test("calls resolveHashFragment correctly if it resolves to an object", function (assert) {
            sandbox.stub(HttpClient.prototype, "post").returns(Promise.resolve({
                status: 200,
                responseText: JSON.stringify(
                    {
                        bulkIndex: 0,
                        url: "https://my-test-url",
                        stateIdentifier: "test",
                        stateValidity: 1,
                        launchType: "auto"
                    })
            }));

            sandbox.stub(this.oAdapter, "_getIntentForService").returns(Promise.resolve({}));
            return this.oAdapter.resolveHashFragment()
                .then(function (resolutionResult) {
                    assert.deepEqual({
                        additionalInformation: "",
                        url: "https://my-test-url",
                        applicationType: "URL",
                        navigationMode: "newWindow"
                    }, resolutionResult, "The resolution result was as expected.");
                })
                .catch(function () {
                    assert.ok(false, "failed to resolve");
                });
        });

        QUnit.test("rejects if the response returns with ok: false", function (assert) {
            var done = assert.async();
            sandbox.stub(HttpClient.prototype, "post").returns(Promise.resolve({
                status: 404,
                responseText: JSON.stringify({ result: " test" })
            }));
            sandbox.stub(this.oAdapter, "_getIntentForService").returns(Promise.resolve({}));
            this.oAdapter.resolveHashFragment()
                .then(function () {
                    assert.ok(false, "The promise was resolved");
                })
                .catch(function () {
                    assert.ok(true, "The promise was rejected");
                }).always(done);
        });

        QUnit.module("The function isIntentSupported", {
            beforeEach: function () {
                var oConfig = {
                    config: {}
                };
                this.oAdapter = new NavTargetResolutionAdapter({}, {}, oConfig);
                return Container.init("local");
            },
            afterEach: function () {
                sandbox.restore();
            }
        });

        QUnit.test("forwards the already resolved intents as an object.", function (assert) {
            // Arrange
            this.aDemoIntents = ["#Action-toappnavsample"];
            this.oDemoIntents = {
                "#Action-toappnavsample": {
                    supported: true
                }
            };
            // Act
            this.oAdapter.isIntentSupported(this.aDemoIntents).then(function (aIntents) {
                // Assert
                assert.deepEqual(this.oDemoIntents, aIntents, "The correct intents were forwarded as an object.");
            }.bind(this));
        });
    });
