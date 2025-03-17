// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.adapters.cdm.LaunchPageAdapter
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/adapters/cdm/CommonDataModelAdapter",
    "sap/ushell/Container",
    "sap/ushell/services/PersonalizationV2",
    "sap/ushell/test/utils"
], function (
    Log,
    jQuery,
    CommonDataModelAdapter,
    Container,
    PersonalizationV2,
    testUtils
) {
    "use strict";

    const { KeyCategory, WriteFrequency } = PersonalizationV2.prototype;

    /* global sinon, QUnit */
    var sandbox = sinon.createSandbox({});

    QUnit.module("CommonDataModelAdapter", {
        beforeEach: function () {
            return Container.init("local");
        },
        afterEach: function () {
            delete this.oAdapter;
            sandbox.restore();
        }
    });

    QUnit.test("check Interface", function (assert) {
        sandbox.stub(CommonDataModelAdapter.prototype, "_requestSiteData")
            .returns(new jQuery.Deferred().resolve({}).promise());
        this.oAdapter = new CommonDataModelAdapter(undefined, undefined, {
            config: {}
        });
        assert.strictEqual(typeof this.oAdapter.getSite, "function",
            "method getSite exists");
        assert.strictEqual(typeof this.oAdapter.getPersonalization, "function",
            "method getPersonalization exists");
    });

    QUnit.test("inject data via config", function (assert) {
        var oAdapter = new CommonDataModelAdapter(undefined, undefined, {
            config: { siteData: { this: "is it" } }
        });
        var done = assert.async();

        oAdapter.getSite().done(function (oSite) {
            assert.deepEqual(oSite, {
                this: "is it"
            }, "correct Site");
            done();
        });
    });

    QUnit.test("inject promise via config", function (assert) {
        var oDeferred = new jQuery.Deferred(),
            oAdapter = new CommonDataModelAdapter(undefined, undefined, {
                config: { siteDataPromise: oDeferred }
            }),
            a = 1,
            done = assert.async();

        oAdapter.getSite().done(function (oSite) {
            assert.deepEqual(oSite, {
                some: "data"
            }, "correct Site");
            assert.deepEqual(a, 2, "correct time");
            done();
        });
        a = 2;
        oDeferred.resolve({
            some: "data",
            personalization: { "i am": "stripped" }
        });
    });

    [{
        testDescription: "cdmSiteUrl is defined",
        config: { cdmSiteUrl: "/unittest/site.json" }
    }, {
        testDescription: "siteDataUrl is defined",
        config: { siteDataUrl: "/unittest/site.json" }
    }].forEach(function (oFixture) {
        QUnit.test("get site via request URL in config when " + oFixture.testDescription, function (assert) {
            var done = assert.async();
            var oDeferred = new jQuery.Deferred();
            var oJSONAjaxCallArgs;
            var fnOriginalAjax = jQuery.ajax;
            sandbox.stub(jQuery, "ajax").callsFake(function () {
                // ui5 does ajax calls for module loading, so we have to filter on JSON calls
                if (typeof arguments[0] === "object" && (arguments[0].dataType === "json")) {
                    oJSONAjaxCallArgs = arguments[0];
                    return oDeferred.promise();
                }
                fnOriginalAjax.apply(null, arguments);
            });
            var oAdapter = new CommonDataModelAdapter(undefined, undefined, {
                config: oFixture.config
            });
            var a = 1;
            oAdapter.getSite().then(function (oSite) {
                assert.strictEqual(Object.keys(oJSONAjaxCallArgs).length, 3,
                    "ajax request was made with 3 arguments");
                assert.strictEqual(oJSONAjaxCallArgs.dataType, "json", "got expected 'dataType' argument");
                assert.strictEqual(oJSONAjaxCallArgs.type, "GET", "got expected 'type' argument");

                var sExpectedUrlPattern = "^https?://[^/]+/unittest/site.json$";
                var reExpectedUrl = new RegExp(sExpectedUrlPattern);
                assert.strictEqual(reExpectedUrl.test(oJSONAjaxCallArgs.url), true, "the 'url' argument matches the pattern '" + sExpectedUrlPattern + "'");

                assert.deepEqual(oSite, { wow: "data" }, "correct Site");
                assert.deepEqual(a, 2, "correct time");
                jQuery.ajax.restore();
            }, function (vError) {
                assert.ok(false, "Promise was rejected: " + vError);
            }).then(done, done);
            a = 2;
            oDeferred.resolve({
                wow: "data",
                personalization: { "i am": "personalization" }
            });
        });
    });

    [{
        testDescription: "cdmSiteUrl is defined",
        config: { cdmSiteUrl: "./site.json" }
    }, {
        testDescription: "siteDataUrl is defined",
        config: { siteDataUrl: "./site.json" }
    }].forEach(function (oFixture) {
        QUnit.test("get site via request URL, consider base-tag when " + oFixture.testDescription, function (assert) {
            var done = assert.async();
            var oDeferred = new jQuery.Deferred();
            var oJSONAjaxCallArgs;
            var fnOriginalAjax = jQuery.ajax;

            // make sure it's a url path which is unlikely to happen on the server
            var sBaseUrl = "baseUrl" + new Date().getTime() + "/";
            var oBaseTag = document.createElement("base");
            oBaseTag.setAttribute("href", sBaseUrl);

            var oGetElemetsStub = sandbox.stub(document, "getElementsByTagName").returns([oBaseTag]);

            sandbox.stub(jQuery, "ajax").callsFake(function () {
                // ui5 does ajax calls for module loading, so we have to filter on JSON calls
                if (typeof arguments[0] === "object" && (arguments[0].dataType === "json")) {
                    oJSONAjaxCallArgs = arguments[0];
                    return oDeferred.promise();
                }
                fnOriginalAjax.apply(null, arguments);
            });

            var oAdapter = new CommonDataModelAdapter(undefined, undefined, {
                config: oFixture.config
            });

            oAdapter.getSite().then(function () {
                var sExpectedUrlPattern = "^https?://[^/]+.*" + sBaseUrl + "site.json$";
                var reExpectedUrl = new RegExp(sExpectedUrlPattern);
                assert.strictEqual(reExpectedUrl.test(oJSONAjaxCallArgs.url), true, "the 'url' argument matches the pattern '" + sExpectedUrlPattern + "'");
                jQuery.ajax.restore();
                oGetElemetsStub.restore();
            }, function (vError) {
                assert.ok(false, "Promise was rejected: " + vError);
                oGetElemetsStub.restore();
            }).then(done, done);

            oDeferred.resolve({});
        });
    });

    QUnit.test("get site is rejected if no siteData, siteDataPromise or URL specified in config", function (assert) {
        var done = assert.async();
        var oAjaxSpy = sandbox.spy(jQuery, "ajax");
        var oAdapter = new CommonDataModelAdapter(undefined, undefined, {
            config: {}
        });

        oAdapter.getSite().then(
            function (oResult) {
                assert.ok(false, "Expected that promise is rejected");
            },
            function (sError) {
                assert.strictEqual(sError, "Cannot load site: configuration property 'siteDataUrl' is missing for CommonDataModelAdapter.",
                    "Expected correct error message");
                // ui5 does ajax calls for module loading, so we have to filter on JSON calls
                assert.strictEqual(getJSONAjaxCalls(oAjaxSpy).length, 0, "Expected that jQuery.ajax is not called with dataType 'json'");
            })
            .then(done, done);
    });

    [{
        testDescription: "url comes from adapter config cdmSiteUrl",
        oConfig: { cdmSiteUrl: "/unittest/site.json" },
        sExpectedUrl: "/unittest/site.json"
    }, {
        testDescription: "url comes from adapter config siteDataUrl",
        oConfig: { siteDataUrl: "/unittest/site.json" },
        sExpectedUrl: "/unittest/site.json"
    }, {
        testDescription: "url comes from adapter parameter and enabled usage of parameter",
        oConfig: {
            siteDataUrl: "/unittest/site.json",
            allowSiteSourceFromURLParameter: true
        },
        sParameterValue: "foo/bar",
        sExpectedUrl: "foo/bar"
    }, {
        testDescription: "url comes from adapter parameter but it is not enabled usage of parameter",
        oConfig: { siteDataUrl: "/unittest/site.json" },
        sParameterValue: "foo/bar",
        sExpectedUrl: "/unittest/site.json"
    }, {
        testDescription: "no config defined",
        oConfig: null,
        sExpectedUrl: null
    }].forEach(function (oFixture) {
        QUnit.test("#_identifySiteUrlFromConfig calculates right URL when: " + oFixture.testDescription, function (assert) {
            var oDeferred = new jQuery.Deferred();
            sandbox.stub(jQuery, "ajax").callsFake(function () {
                // ui5 does ajax calls for module loading, so we have to filter on JSON calls
                if (typeof (arguments[0] === "object") && (arguments[0].dataType === "json")) {
                    return oDeferred.promise();
                }
            });
            var oAdapter = new CommonDataModelAdapter(undefined, undefined, {
                config: oFixture.oConfig
            });
            var oParamStub = sandbox.stub(URLSearchParams.prototype, "get").callsFake(function () {
                return oFixture.sParameterValue || null;
            });
            var sUrl = oAdapter._identifySiteUrlFromConfig({
                config: oFixture.oConfig
            });
            assert.equal(sUrl, oFixture.sExpectedUrl, "url returned as expected");
            oParamStub.restore();
        });
    });

    function getJSONAjaxCalls (oAjaxSpy) {
        var aJSONAjaxCalls = [];
        if (oAjaxSpy.callCount > 0) {
            aJSONAjaxCalls = oAjaxSpy.getCalls().filter(function (oCall) {
                return oCall.args[0].dataType === "json";
            });
        }
        return aJSONAjaxCalls;
    }

    QUnit.module("getPersonalization", {
        beforeEach: function () {
            this.oSiteDataPromise = new jQuery.Deferred();
            this.oAdapter = new CommonDataModelAdapter(undefined, undefined, {
                config: {
                    siteDataPromise: this.oSiteDataPromise
                }
            });

            this.oPersonalizationDataMock = { _version: "3.0.0" };
            this.oReadPersonalizationDataFromStorageStub = sandbox.stub(this.oAdapter, "_readPersonalizationDataFromStorage");
            this.oReadPersonalizationDataFromStorageStub.returns(new jQuery.Deferred().resolve(this.oPersonalizationDataMock));
        },
        afterEach: function () {
            delete this.oSiteDataPromise;
            delete this.oAdapter;
            sandbox.restore();
        }
    });

    QUnit.test("inject promise via config, getPersonalization", function (assert) {
        var done = assert.async();

        this.oAdapter.getPersonalization().done(function (oPersonalization) {
            assert.deepEqual(oPersonalization, {
                "i am": "personalization",
                _version: "2.0.0"
            }, "correct Personalization");
            done();
        });
        this.oSiteDataPromise.resolve({
            some: "data",
            personalization: {
                "i am": "personalization",
                _version: "2.0.0"
            },
            _version: "2.0.0"
        });
    });

    QUnit.test("Personalization is loaded when Site version is 1.0.0 and no personalization version is provided", function (assert) {
        var done = assert.async(),
            oTestSite = {
                some: "data",
                personalization: { "i am": "personalization" },
                _version: "1.0.0"
            };

        this.oAdapter.getPersonalization()
            .done(function (oData) {
                assert.ok(true, "Personalization promise was resolved");
                assert.deepEqual(oData, oTestSite.personalization, "Personalization was loaded");
                done();
            })
            .fail(function () {
                assert.ok(false, "Personalization promise was resolved");
                done();
            });

        this.oSiteDataPromise.resolve(oTestSite);
    });

    QUnit.test("Personalization is loaded when Site version is 1.0.0 and personalization version is 1.0.0", function (assert) {
        var done = assert.async(),
            oTestSite = {
                some: "data",
                personalization: {
                    "i am": "personalization",
                    _version: "1.0.0"
                },
                _version: "1.0.0"
            };

        this.oAdapter.getPersonalization()
            .done(function (oData) {
                assert.ok(true, "Personalization promise was resolved");
                assert.deepEqual(oData, oTestSite.personalization, "Personalization was loaded");
                done();
            })
            .fail(function () {
                assert.ok(false, "Personalization promise was resolved");
                done();
            });

        this.oSiteDataPromise.resolve(oTestSite);
    });

    QUnit.test("Personalization is loaded when Site version is 2.0.0 and personalization no version is provided", function (assert) {
        var done = assert.async(),
            oTestSite = {
                some: "data",
                personalization: { "i am": "personalization" },
                _version: "2.0.0"
            };

        this.oAdapter.getPersonalization()
            .done(function (oData) {
                assert.ok(true, "Personalization promise was resolved");
                assert.deepEqual(oData, oTestSite.personalization, "Personalization was loaded");
                done();
            })
            .fail(function () {
                assert.ok(false, "Personalization promise was resolved");
                done();
            });

        this.oSiteDataPromise.resolve(oTestSite);
    });

    QUnit.test("Personalization is loaded when Site version is 2.0.0 and personalization version is 2.0.0", function (assert) {
        var done = assert.async(),
            oTestSite = {
                some: "data",
                personalization: {
                    "i am": "personalization", _version: "2.0.0"
                },
                _version: "2.0.0"
            };

        this.oAdapter.getPersonalization()
            .done(function (oData) {
                assert.ok(true, "Personalization promise was resolved");
                assert.deepEqual(oData, oTestSite.personalization, "Personalization was loaded");
                done();
            })
            .fail(function () {
                assert.ok(false, "Personalization promise was resolved");
                done();
            });

        this.oSiteDataPromise.resolve(oTestSite);
    });

    QUnit.test("Personalization is NOT loaded when Site version is 2.0.0 and personalization version is 3.0.0", function (assert) {
        var done = assert.async(),
            oTestSite = {
                some: "data",
                personalization: {
                    "i am": "personalization",
                    _version: "3.0.0"
                },
                _version: "2.0.0"
            };

        this.oAdapter.getPersonalization()
            .done(function (oData) {
                assert.ok(true, "Personalization promise was resolved");
                assert.deepEqual(oData, undefined, "Personalization was not loaded");
                done();
            })
            .fail(function () {
                assert.ok(false, "Personalization promise was resolved");
                done();
            });

        this.oSiteDataPromise.resolve(oTestSite);
    });

    QUnit.test("Personalization is NOT loaded when Site version is 3.0.0 and no personalization version is provided", function (assert) {
        var done = assert.async(),
            oTestSite = {
                some: "data",
                personalization: { "i am": "personalization" },
                _version: "3.0.0"
            };

        this.oAdapter.getPersonalization()
            .done(function (oData) {
                assert.ok(true, "Personalization promise was resolved");
                assert.deepEqual(oData, undefined, "Personalization was not loaded");
                done();
            })
            .fail(function () {
                assert.ok(false, "Personalization promise was resolved");
                done();
            });

        this.oSiteDataPromise.resolve(oTestSite);
    });

    QUnit.test("Personalization is NOT loaded when Site version is 3.0.0 and personalization version is 1.0.0", function (assert) {
        var done = assert.async(),
            oTestSite = {
                some: "data",
                personalization: {
                    "i am": "personalization",
                    _version: "1.0.0"
                },
                _version: "3.0.0"
            };

        this.oAdapter.getPersonalization()
            .done(function (oData) {
                assert.ok(true, "Personalization promise was resolved");
                assert.deepEqual(oData, undefined, "Personalization was not loaded");
                done();
            })
            .fail(function () {
                assert.ok(false, "Personalization promise was resolved");
                done();
            });

        this.oSiteDataPromise.resolve(oTestSite);
    });

    QUnit.test("Personalization is NOT loaded when Site version is 3.0.0 and personalization version is 2.0.0", function (assert) {
        var done = assert.async();

        this.oAdapter.getPersonalization()
            .done(function (oData) {
                assert.ok(true, "Personalization promise was resolved");
                assert.deepEqual(oData, undefined, "Personalization was not loaded");
                done();
            })
            .fail(function () {
                assert.ok(false, "Personalization promise was resolved");
                done();
            });

        this.oSiteDataPromise.resolve({
            some: "data",
            personalization: {
                "i am": "personalization",
                _version: "2.0.0"
            },
            _version: "3.0.0"
        });
    });

    QUnit.test("Personalization is loaded when Site version is 3.0.0 and personalization version is 3.0.0", function (assert) {
        var done = assert.async(),
            oTestSite = {
                some: "data",
                personalization: {
                    "i am": "personalization",
                    _version: "3.0.0"
                },
                _version: "3.0.0"
            };

        this.oAdapter.getPersonalization()
            .done(function (oData) {
                assert.ok(true, "Personalization promise was resolved");
                assert.deepEqual(oData, oTestSite.personalization, "Personalization was loaded");
                done();
            })
            .fail(function () {
                assert.ok(false, "Personalization promise was resolved");
                done();
            });

        this.oSiteDataPromise.resolve(oTestSite);
    });

    QUnit.test("Reads personalization from storage", function (assert) {
        var done = assert.async();
        this.oExpectedVersion = "3.0.0";

        this.oAdapter.getPersonalization()
            .done(function () {
                assert.strictEqual(this.oReadPersonalizationDataFromStorageStub.getCall(0).args[0], this.oExpectedVersion, "'_readPersonalizationDataFromStorage' was called with the right argument");
            }.bind(this))
            .always(function () {
                done();
            });

        this.oSiteDataPromise.resolve({
            _version: this.oExpectedVersion
        });
    });

    QUnit.module("setPersonalization", {
        beforeEach: function () {
            this.oAdapter = new CommonDataModelAdapter();

            this.oMockPersonalizationData = { version: "3.0.0" };

            this.infoStub = sandbox.stub(Log, "info");

            this.oSetPersDataStub = sandbox.stub().resolves();
            this.oPersonalizerMock = {
                setPersData: this.oSetPersDataStub
            };
            this.oGetServiceStub = sandbox.stub();

            this.oGetPersonalizerMock = sandbox.stub().resolves(this.oPersonalizerMock);

            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceStub);

            this.oGetServiceStub.withArgs("PersonalizationV2").resolves({
                getPersonalizer: this.oGetPersonalizerMock,
                KeyCategory,
                WriteFrequency
            });

            this.oExpectedScope = {
                keyCategory: KeyCategory.FIXED_KEY,
                writeFrequency: WriteFrequency.LOW,
                clientStorageAllowed: true
            };
        },

        afterEach: function () {
            delete this.oAdapter;
            sandbox.restore();
        }
    });

    QUnit.test("Sets the personalization in the classic container", function (assert) {
        var done = assert.async();

        var oExpectedPersId = {
            container: "sap.ushell.cdm.personalization",
            item: "data"
        };

        this.oAdapter.setPersonalization(this.oMockPersonalizationData).done(function () {
            assert.ok(true, "Personalization promise was resolved");
            assert.deepEqual(this.infoStub.getCall(0).args, ["Personalization data has been stored successfully."], "The right info was logged");
            assert.deepEqual(this.oGetPersonalizerMock.getCall(0).args, [oExpectedPersId, this.oExpectedScope, undefined], "The right parameters were passed to 'getPersonalizer'");
            assert.strictEqual(this.oSetPersDataStub.getCall(0).args[0], this.oMockPersonalizationData, "'setPersData' was called with the right parameter");
        }.bind(this))
            .fail(function () {
                assert.ok(false, "Personalization promise should've been resolved");
            })
            .always(function () {
                done();
            });
    });

    QUnit.test("Sets the personalization in the cdm3-1 container", function (assert) {
        var done = assert.async();

        this.oMockPersonalizationData.version = "3.1.5";

        var oExpectedPersId = {
            container: "sap.ushell.cdm3-1.personalization",
            item: "data"
        };

        this.oAdapter.setPersonalization(this.oMockPersonalizationData).done(function () {
            assert.ok(true, "Personalization promise was resolved");
            assert.deepEqual(this.infoStub.getCall(0).args, ["Personalization data has been stored successfully."], "The right info was logged");
            assert.deepEqual(this.oGetPersonalizerMock.getCall(0).args, [oExpectedPersId, this.oExpectedScope, undefined], "The right parameters were passed to 'getPersonalizer'");
            assert.strictEqual(this.oSetPersDataStub.getCall(0).args[0], this.oMockPersonalizationData, "'setPersData' was called with the right parameter");
        }.bind(this))
            .fail(function () {
                assert.ok(false, "Personalization promise should've been resolved");
            })
            .always(function () {
                done();
            });
    });

    QUnit.test("Rejects when setPersData goes wrong", function (assert) {
        var done = assert.async();
        this.oSetPersDataStub.rejects();

        this.oAdapter.setPersonalization(this.oMockPersonalizationData).done(function () {
            assert.ok(false, "Personalization promise was rejected");
        })
            .fail(function () {
                assert.ok(true, "Personalization promise should've been rejected");
            })
            .always(function () {
                done();
            });
    });

    QUnit.module("_readPersonalizationDataFromStorage", {
        beforeEach: function () {
            this.oAdapter = new CommonDataModelAdapter();

            this.oMockPersonalizationData = { version: "3.0.0" };

            this.oGetPersDataStub = sandbox.stub().resolves();
            this.oPersonalizerMock = {
                getPersData: this.oGetPersDataStub
            };
            this.oGetServiceAsyncStub = sandbox.stub();

            this.oGetPersonalizerMock = sandbox.stub().resolves(this.oPersonalizerMock);

            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceAsyncStub);

            this.oGetServiceAsyncStub.withArgs("PersonalizationV2").resolves({
                getPersonalizer: this.oGetPersonalizerMock,
                KeyCategory,
                WriteFrequency
            });
        },

        afterEach: function () {
            delete this.oAdapter;
            sandbox.restore();
        }
    });

    QUnit.test("Reads the personalization in the classic container", function (assert) {
        var done = assert.async();

        var oExpectedPersId = {
            container: "sap.ushell.cdm.personalization",
            item: "data"
        };

        var oExpectedScope = {
            keyCategory: KeyCategory.FIXED_KEY,
            writeFrequency: WriteFrequency.LOW,
            clientStorageAllowed: true
        };

        this.oAdapter._readPersonalizationDataFromStorage().done(function () {
            assert.ok(true, "Personalization promise was resolved");
            assert.deepEqual(this.oGetPersonalizerMock.getCall(0).args, [oExpectedPersId, oExpectedScope], "The right parameters were passed to 'getPersonalizer'");
            assert.strictEqual(this.oGetPersDataStub.callCount, 1, "'getPersData' was called exactly once");
        }.bind(this))
            .fail(function () {
                assert.ok(false, "Personalization promise should've been resolved");
            })
            .always(function () {
                done();
            });
    });

    QUnit.test("Reads the personalization in the cdm3-1 container", function (assert) {
        var done = assert.async();

        var oExpectedPersId = {
            container: "sap.ushell.cdm3-1.personalization",
            item: "data"
        };

        var oExpectedScope = {
            keyCategory: KeyCategory.FIXED_KEY,
            writeFrequency: WriteFrequency.LOW,
            clientStorageAllowed: true
        };

        this.oAdapter._readPersonalizationDataFromStorage("3.1.5").done(function () {
            assert.ok(true, "Personalization promise was resolved");
            assert.deepEqual(this.oGetPersonalizerMock.getCall(0).args, [oExpectedPersId, oExpectedScope], "The right parameters were passed to 'getPersonalizer'");
            assert.strictEqual(this.oGetPersDataStub.callCount, 1, "'getPersData' was called exactly once");
        }.bind(this))
            .fail(function () {
                assert.ok(false, "Personalization promise should've been resolved");
            })
            .always(function () {
                done();
            });
    });

    QUnit.test("Rejects when setPersData goes wrong", function (assert) {
        var done = assert.async();
        this.oGetPersDataStub.rejects();

        this.oAdapter._readPersonalizationDataFromStorage()
            .done(function () {
                assert.ok(false, "Personalization promise was rejected");
            })
            .fail(function () {
                assert.ok(true, "Personalization promise should've been rejected");
            })
            .always(function () {
                done();
            });
    });
});
