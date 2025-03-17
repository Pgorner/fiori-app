// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.CommonDataModel
 */
sap.ui.define([
    "sap/base/Log",
    "sap/base/util/deepExtend",
    "sap/base/util/ObjectPath",
    "sap/ui/core/Manifest",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/services/CommonDataModel",
    "sap/ushell/services/CommonDataModel/PersonalizationProcessor",
    "sap/ushell/services/CommonDataModel/SiteConverter",
    "sap/ushell/services/CommonDataModel/vizTypeDefaults/VizTypeDefaults",
    "sap/ushell/Config",
    "sap/ushell/utils",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readApplications",
    "sap/ushell/Container"
], function (
    Log,
    deepExtend,
    ObjectPath,
    Manifest,
    jQuery,
    CommonDataModel,
    PersonalizationProcessor,
    SiteConverter,
    VizTypeDefaults,
    Config,
    ushellUtils,
    readApplications,
    Container
) {
    "use strict";

    /* global sinon, QUnit */

    var sandbox = sinon.createSandbox({});

    QUnit.module("constructor", {
        beforeEach: function () {
            window["sap-ushell-config"] = {};
            this.oGetSiteDeferred = new jQuery.Deferred();
            this.oMockAdapter = {
                getSite: sandbox.stub().returns(this.oGetSiteDeferred)
            };
            this.oLoadAndApplyPersonalizationForCDMVersion30Stub = sandbox.stub(CommonDataModel.prototype, "_loadAndApplyPersonalizationForCDMVersion30");
        },
        afterEach: function () {
            sandbox.restore();
            delete window["sap-ushell-config"];
        }
    });

    QUnit.test("Sets expected properties, gets the site and calls oLoadAndApplyPersonalizationForCDMVersion30Stub for CDM 3.0", function (assert) {
        // Arrange
        this.oGetSiteDeferred.resolve({ _version: "3.0.0" });
        // Act
        var oCommonDataModelService = new CommonDataModel(this.oMockAdapter);
        // Assert
        assert.deepEqual(oCommonDataModelService._oAdapter, this.oMockAdapter, "Adapter was saved to service object");
        assert.ok(oCommonDataModelService._oPersonalizationProcessor instanceof PersonalizationProcessor, "PersonalizationProcessor was saved to service object");
        assert.ok(oCommonDataModelService._oSiteConverter instanceof SiteConverter, "SiteConverter was initialized");
        assert.ok(this.oMockAdapter.getSite.called, "getSite was called");
        assert.ok(this.oLoadAndApplyPersonalizationForCDMVersion30Stub.called, "Personalization flow was started");
        assert.deepEqual(oCommonDataModelService._oOriginalSite, { _version: "3.0.0" }, "Original site was initialized");
        assert.deepEqual(oCommonDataModelService._oPersonalizedSiteForCDMVersion30, {}, "Personalized site was initialized");
    });

    QUnit.test("Sets expected properties, gets the site and calls oLoadAndApplyPersonalizationForCDMVersion30Stub for CDM versions < 3.0", function (assert) {
        // Arrange
        this.oGetSiteDeferred.resolve({ _version: "2.0.0" });
        // Act
        var oCommonDataModelService = new CommonDataModel(this.oMockAdapter);
        // Assert
        assert.ok(this.oLoadAndApplyPersonalizationForCDMVersion30Stub.called, "Personalization flow was started");
        assert.deepEqual(oCommonDataModelService._oOriginalSite, { _version: "2.0.0" }, "Original site was initialized");
    });

    QUnit.test("Doesn't load the personalization if not FLP home is started for CDM 3.0", function (assert) {
        // Arrange
        this.oGetSiteDeferred.resolve({ _version: "3.0.0" });
        ObjectPath.set("renderers.fiori2.componentData.config.rootIntent", "Some-home", window["sap-ushell-config"]);
        // Act
        var oCommonDataModelService = new CommonDataModel(this.oMockAdapter);
        // Assert
        assert.ok(this.oMockAdapter.getSite.called, "getSite was called");
        assert.ok(this.oLoadAndApplyPersonalizationForCDMVersion30Stub.notCalled, "Personalization flow was not started");
        assert.deepEqual(oCommonDataModelService._oOriginalSite, { _version: "3.0.0" }, "Original site was initialized");
        assert.equal(oCommonDataModelService._bLoadPersonalizationForCDMVersion30Late, true, "_bLoadPersonalizationForCDMVersion30Late flag is correct");
    });

    QUnit.test("Prepares the site for CDM 3.1", async function (assert) {
        // Arrange
        this.oGetSiteDeferred.resolve({ _version: "3.1.0" });
        const oVizTypes = {};
        ObjectPath.set(["sap.ushell.StaticAppLauncher", "sap.flp", "vizOptions", "displayFormats", "supported"], ["tile", "link"], oVizTypes);
        sandbox.stub(VizTypeDefaults, "getAll").returns(oVizTypes);
        const oExpectedVizTypes = {};
        ObjectPath.set(["sap.ushell.StaticAppLauncher", "sap.flp", "vizOptions", "displayFormats", "supported"], ["standard", "compact"], oExpectedVizTypes);

        // Act
        var oCommonDataModelService = new CommonDataModel(this.oMockAdapter);

        // Assert
        const oSite = await ushellUtils.promisify(oCommonDataModelService.getSite());
        assert.ok(this.oMockAdapter.getSite.called, "getSite was called");
        assert.ok(this.oLoadAndApplyPersonalizationForCDMVersion30Stub.notCalled, "Personalization flow was not started");
        assert.equal(oCommonDataModelService._bLoadPersonalizationForCDMVersion30Late, false, "_bLoadPersonalizationForCDMVersion30Late flag is correct");
        assert.deepEqual(oSite.vizTypes, oExpectedVizTypes, "Standard vizTypes were added and adapted");
    });

    QUnit.test("Fails the SiteDeferred promise when the site could not be loaded", function (assert) {
        // Arrange
        this.oGetSiteDeferred.reject();
        // Act
        var oCommonDataModelService = new CommonDataModel(this.oMockAdapter);
        // Assert
        assert.ok(this.oMockAdapter.getSite.called, "getSite was called");
        assert.strictEqual(oCommonDataModelService._oSiteDeferred.state(), "rejected", "Site Promise was rejected");
        assert.equal(oCommonDataModelService._bLoadPersonalizationForCDMVersion30Late, false, "_bLoadPersonalizationForCDMVersion30Late flag is correct");
    });

    QUnit.module("_loadAndApplyPersonalizationForCDMVersion30", {
        beforeEach: function () {
            this.oMockAdapter = {
                _getSiteDeferred: new jQuery.Deferred(),
                getSite: sandbox.spy(function () {
                    return this._getSiteDeferred.promise();
                }),
                _getPersonalizationDeferred: new jQuery.Deferred(),
                getPersonalization: sandbox.spy(function () {
                    return this._getPersonalizationDeferred.promise();
                })
            };
            this.oMockPersonalizationProcessor = {
                _mixinPersonalizationDeferred: new jQuery.Deferred(),
                mixinPersonalization: sandbox.spy(function () {
                    return this._mixinPersonalizationDeferred.promise();
                })
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Instantiates everything and calls getSite on the adapter", function (assert) {
        // Arrange
        var oOriginalSite = {
            _version: "3.0.0",
            originalProperty: "foo"
        };
        var oPers = { personalizedProperty: "bar" };
        var oPersonalizedSite = {
            _version: "3.0.0",
            originalProperty: "foo",
            personalizedProperty: "bar"
        };

        // act #1
        var oCommonDataModelService = new CommonDataModel(this.oMockAdapter);

        // assert #1
        assert.strictEqual(oCommonDataModelService._oAdapter, this.oMockAdapter, "property oAdapter");
        assert.ok(oCommonDataModelService._oPersonalizationProcessor instanceof PersonalizationProcessor,
            "property oPersonalizationProcessor");
        assert.strictEqual(this.oMockAdapter.getSite.callCount, 1, "getSite called");
        // arrange #2
        // overwrite oPersonalizationProcessor before it is used (note: require is called within constructor)
        oCommonDataModelService._oPersonalizationProcessor = this.oMockPersonalizationProcessor;
        var oTriggerMixinPersonalizationInSiteSpy = sandbox.spy(oCommonDataModelService, "_triggerMixinPersonalizationInSite");

        // act #2
        this.oMockAdapter._getSiteDeferred.resolve(oOriginalSite);
        this.oMockAdapter._getPersonalizationDeferred.resolve(oPers);
        this.oMockPersonalizationProcessor._mixinPersonalizationDeferred.resolve(oPersonalizedSite);

        var fnDone = assert.async();
        oCommonDataModelService._oSiteDeferred
            .fail(function () {
                assert.ok(false, "unexpected reject of _oSiteDeferred");
                fnDone();
            })
            .done(function (oResolvedPersonalizedSite) {
                assert.deepEqual(oResolvedPersonalizedSite, oPersonalizedSite, "done handler: personalized site");

                assert.strictEqual(oTriggerMixinPersonalizationInSiteSpy.callCount, 1, "_triggerMixinPersonalizationInSite is called once.");
                assert.ok(oTriggerMixinPersonalizationInSiteSpy.getCall(0).calledWith(oOriginalSite, oPers), "_triggerMixinPersonalizationInSite was called with the correct parameters");
                assert.strictEqual(this.oMockAdapter.getPersonalization.callCount, 1, "getPersonalization called");
                assert.strictEqual(this.oMockPersonalizationProcessor.mixinPersonalization.callCount, 1, "mixinPersonalization called");

                assert.deepEqual(oCommonDataModelService._oOriginalSite, oOriginalSite, "original site");
                assert.notStrictEqual(oCommonDataModelService._oOriginalSite, oOriginalSite, "oOriginalCdmSite is a copy");
                assert.deepEqual(oCommonDataModelService._oPersonalizedSiteForCDMVersion30, oPersonalizedSite, "_oPersonalizedSite");

                // Check that standard vizTypes have been added. One manifest property is checked to verify the loading was successful.
                assert.strictEqual(oCommonDataModelService._oPersonalizedSiteForCDMVersion30.vizTypes["sap.ushell.StaticAppLauncher"]["sap.app"].type, "component",
                    "Static tile visualization type added");
                assert.strictEqual(oCommonDataModelService._oPersonalizedSiteForCDMVersion30.vizTypes["sap.ushell.DynamicAppLauncher"]["sap.app"].type, "component",
                    "Dynamic tile visualization type added");
                assert.strictEqual(oCommonDataModelService._oPersonalizedSiteForCDMVersion30.vizTypes["sap.ushell.Card"]["sap.app"].type, "card",
                    "Card visualization type added");
                fnDone();
            }.bind(this));
    });

    QUnit.test("Fails if getting the site from the adapter fails", function (assert) {
        // Arrange

        // Act
        var oCommonDataModelService = new CommonDataModel(this.oMockAdapter);

        // overwrite oPersonalizationProcessor before it is used (note: require is called within constructor)
        oCommonDataModelService._oPersonalizationProcessor = this.oMockPersonalizationProcessor;

        this.oMockAdapter._getSiteDeferred.reject("intentionally failed");

        // Assert
        return ushellUtils.promisify(oCommonDataModelService._oSiteDeferred.promise())
            .then(function () {
                assert.ok(false, "unexpected resolve of _oSiteDeferred");
            })
            .catch(function (sMessage) {
                assert.strictEqual(sMessage, "intentionally failed", "error message");
            });
    });

    QUnit.test("Still works if getting the personalization from the adapter fails", function (assert) {
        // Arrange
        var oOriginalSite = {
            _version: "3.0.0",
            originalProperty: "foo"
        };

        // Act
        var oCommonDataModelService = new CommonDataModel(this.oMockAdapter);

        // overwrite oPersonalizationProcessor before it is used (note: require is called within constructor)
        oCommonDataModelService._oPersonalizationProcessor = this.oMockPersonalizationProcessor;

        this.oMockAdapter._getSiteDeferred.resolve(oOriginalSite);
        this.oMockAdapter._getPersonalizationDeferred.reject("intentionally failed");
        this.oMockPersonalizationProcessor._mixinPersonalizationDeferred.resolve(oOriginalSite);

        // Assert
        return ushellUtils.promisify(oCommonDataModelService._oSiteDeferred.promise())
            .then(function () {
                assert.ok(true, "The site deferred was resolved");
            })
            .catch(function (sMessage) {
                assert.ok(false, "unexpected reject of _oSiteDeferred");
            });
    });

    QUnit.test("Fails if mixing in the personalization fails", function (assert) {
        // Arrange
        var oOriginalSite = {
            _version: "3.0.0",
            originalProperty: "foo"
        };
        var oPers = { personalizedProperty: "bar" };

        // Act
        var oCommonDataModelService = new CommonDataModel(this.oMockAdapter);

        // overwrite oPersonalizationProcessor before it is used (note: require is called within constructor)
        oCommonDataModelService._oPersonalizationProcessor = this.oMockPersonalizationProcessor;

        this.oMockAdapter._getSiteDeferred.resolve(oOriginalSite);
        this.oMockAdapter._getPersonalizationDeferred.resolve(oPers);
        this.oMockPersonalizationProcessor._mixinPersonalizationDeferred.reject("intentionally failed");

        // Assert
        return ushellUtils.promisify(oCommonDataModelService._oSiteDeferred.promise())
            .then(function () {
                assert.ok(false, "unexpected resolve of _oSiteDeferred");
            })
            .catch(function (sMessage) {
                assert.strictEqual(sMessage, "intentionally failed", "error message");
            });
    });

    QUnit.module("_applyPagePersonalization", {
        beforeEach: function () {
            this.oSiteMock = { _version: "3.1.0" };
            this.oPersonalizationMock = {
                _version: "3.1.0",
                somePageId: { some: "Personalization" }
            };
            this.oPage = {
                _version: "3.1.0",
                identification: { id: "somePageId" }
            };
            this.o30Page = {
                _version: "3.0.0",
                identification: { id: "somePageId" }
            };

            this.oTriggerMixinPersonalizationInSiteStub = sandbox.stub(CommonDataModel.prototype, "_triggerMixinPersonalizationInSite");
            this.oTriggerMixinPersonalizationInSiteStub.callsFake(function (oPage) {
                if (oPage._version === "3.0.0") {
                    oPage.personalized = true;
                    return Promise.resolve(oPage);
                }
            });

            this.oGetPersonalizationStub = sandbox.stub();
            this.oGetPersonalizationStub.withArgs("3.1.0").returns(new jQuery.Deferred().resolve(this.oPersonalizationMock).promise());
            this.oCDMService = new CommonDataModel({
                getSite: sandbox.stub().returns(new jQuery.Deferred().resolve(this.oSiteMock).promise()),
                getPersonalization: this.oGetPersonalizationStub
            });

            this.oConvertToStub = sandbox.stub();
            this.oConvertToStub.callsFake(function (sVersion, oPage) {
                if (sVersion === "3.1.0" && oPage._version === "3.0.0") {
                    oPage._version = "3.1.0";
                    return oPage;
                }
                if (sVersion === "3.0.0" && oPage._version === "3.1.0") {
                    oPage._version = "3.0.0";
                    return oPage;
                }
            });
            this.oCDMService._oSiteConverter = {
                convertTo: this.oConvertToStub
            };

            this.oCDMService._oPersonalizedPages = {};
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the correct result", function (assert) {
        // Arrange
        var oExpectedPage = {
            _version: "3.1.0",
            identification: { id: "somePageId" },
            personalized: true
        };
        // Act
        return this.oCDMService._applyPagePersonalization(this.oPage, this.oPersonalizationMock)
            .then(function (oPersonalizedPage) {
                // Assert
                assert.deepEqual(oPersonalizedPage, oExpectedPage, "returned the correct result");

                assert.deepEqual(this.oCDMService._oPersonalizedPages.somePageId, oExpectedPage, "saved the page correctly");
                assert.deepEqual(this.oCDMService._oPersonalizationDeltasForCDMVersion31, this.oPersonalizationMock, "saved the personalization deltas correctly");
                assert.strictEqual(this.oTriggerMixinPersonalizationInSiteStub.callCount, 1, "_triggerMixinPersonalizationInSite was called once");

                var oPagePersonalizationDelta = this.oPersonalizationMock.somePageId;
                assert.deepEqual(this.oTriggerMixinPersonalizationInSiteStub.getCall(0).args[1], oPagePersonalizationDelta,
                    "_triggerMixinPersonalizationInSite was called with the correct personalization");
                assert.strictEqual(this.oConvertToStub.callCount, 2, "convertTo was called twice");
            }.bind(this));
    });

    QUnit.test("Returns the correct result for very deep objects", function (assert) {
        // Arrange
        ObjectPath.set("this.is.a.very.deep.object.that.is.more.than.ten.levels.deep", true, this.oPage);

        // Act
        return this.oCDMService._applyPagePersonalization(this.oPage, this.oPersonalizationMock)
            .then(function () {
                // Assert
                assert.deepEqual(this.oCDMService._oPersonalizationDeltasForCDMVersion31, this.oPersonalizationMock, "saved the personalization deltas correctly");
                assert.strictEqual(this.oTriggerMixinPersonalizationInSiteStub.callCount, 1, "_triggerMixinPersonalizationInSite was called once");

                var oPagePersonalizationDelta = this.oPersonalizationMock.somePageId;
                assert.deepEqual(this.oTriggerMixinPersonalizationInSiteStub.getCall(0).args[1], oPagePersonalizationDelta,
                    "_triggerMixinPersonalizationInSite was called with the correct personalization");
                assert.strictEqual(this.oConvertToStub.callCount, 2, "convertTo was called twice");
            }.bind(this));
    });

    QUnit.test("Returns the correct result if _version is not available", function (assert) {
        // Arrange
        this.oPersonalizationMock.version = "3.1.0";
        delete this.oPersonalizationMock._version;

        var oExpectedPage = {
            _version: "3.1.0",
            identification: { id: "somePageId" },
            personalized: true
        };
        // Act
        return this.oCDMService._applyPagePersonalization(this.oPage, this.oPersonalizationMock)
            .then(function (oPersonalizedPage) {
                // Assert
                assert.deepEqual(oPersonalizedPage, oExpectedPage, "returned the correct result");

                assert.deepEqual(this.oCDMService._oPersonalizedPages.somePageId, oExpectedPage, "saved the page correctly");
                assert.deepEqual(this.oCDMService._oPersonalizationDeltasForCDMVersion31, this.oPersonalizationMock, "saved the personalization deltas correctly");
                assert.strictEqual(this.oTriggerMixinPersonalizationInSiteStub.callCount, 1, "_triggerMixinPersonalizationInSite was called once");

                var oPagePersonalizationDelta = this.oPersonalizationMock.somePageId;
                assert.deepEqual(this.oTriggerMixinPersonalizationInSiteStub.getCall(0).args[1], oPagePersonalizationDelta,
                    "_triggerMixinPersonalizationInSite was called with the correct personalization");
                assert.strictEqual(this.oConvertToStub.callCount, 2, "convertTo was called twice");
            }.bind(this));
    });

    QUnit.test("Returns the correct result if there is no personalization", function (assert) {
        // Arrange
        this.oPersonalizationMock = {};
        this.oTriggerMixinPersonalizationInSiteStub.withArgs(sandbox.match.any, {}).callsFake(function (oPage) {
            if (oPage._version === "3.0.0") {
                oPage.personalized = true;
                return Promise.resolve(oPage);
            }
        });
        var oExpectedPage = {
            _version: "3.1.0",
            identification: { id: "somePageId" },
            personalized: true
        };
        // Act
        return this.oCDMService._applyPagePersonalization(this.oPage, this.oPersonalizationMock)
            .then(function (oPersonalizedPage) {
                // Assert
                assert.deepEqual(oPersonalizedPage, oExpectedPage, "returned the correct result");

                assert.deepEqual(this.oCDMService._oPersonalizedPages.somePageId, oExpectedPage, "saved the page correctly");
                assert.deepEqual(this.oCDMService._oPersonalizationDeltasForCDMVersion31, {}, "saved the personalization deltas correctly");
                assert.strictEqual(this.oTriggerMixinPersonalizationInSiteStub.callCount, 1, "_triggerMixinPersonalizationInSite was called once");
                assert.deepEqual(this.oTriggerMixinPersonalizationInSiteStub.getCall(0).args[1], {}, "_triggerMixinPersonalizationInSite was called with the correct personalization");
                assert.strictEqual(this.oConvertToStub.callCount, 2, "convertTo was called twice");
            }.bind(this));
    });

    QUnit.test("Rejects when mixin personalization fails", function (assert) {
        // Arrange
        this.oTriggerMixinPersonalizationInSiteStub.withArgs(sandbox.match.any, sandbox.match.any).rejects();
        // Act
        return this.oCDMService._applyPagePersonalization(this.oPage, this.oPersonalizationMock)
            .then(function () {
                assert.ok(false, "promise should have been rejected");
            })
            .catch(function () {
                // Assert
                assert.ok(true, "promise was rejected");
            });
    });

    QUnit.test("Migrates classic personalization to pages personalization", function (assert) {
        // Arrange
        var oClassicPersonalization = {
            _version: "3.0.0",
            groups: {},
            groupsOrder: [],
            addedGroups: {}
        };
        this.oPage.identification.id = "classicHomePage";

        var oExpectedPersonalization = {
            classicHomePage: oClassicPersonalization,
            _version: "3.1.0",
            version: "3.1.0"
        };
        // Act
        return this.oCDMService._applyPagePersonalization(this.oPage, oClassicPersonalization)
            .then(function () {
                // Assert
                assert.deepEqual(this.oCDMService._oPersonalizationDeltasForCDMVersion31, oExpectedPersonalization, "saved the personalization deltas correctly");

                var oPersonalization = this.oTriggerMixinPersonalizationInSiteStub.firstCall.args[1];
                assert.deepEqual(oPersonalization, oClassicPersonalization, "_triggerMixinPersonalizationInSite was called with the correct personalization");
            }.bind(this));
    });

    QUnit.test("Recovers broken personalization for classicHomePage", function (assert) {
        // Arrange
        var oBrokenPersonalization = {
            classicHomePage: {
                version: "3.1.0",
                page1: {
                    _version: "3.0.0",
                    groupsOrder: ["group1", "group2", "group3"]
                },
                page2: {
                    _version: "3.0.0",
                    groupsOrder: ["group2", "group1", "group3"]
                }
            },
            page1: {
                _version: "3.0.0",
                groupsOrder: ["group3", "group2", "group1"]
            },
            _version: "3.1.0",
            version: "3.1.0"
        };
        var oExpectedPersonalization = {
            page1: {
                _version: "3.0.0",
                groupsOrder: ["group3", "group2", "group1"]
            },
            page2: {
                _version: "3.0.0",
                groupsOrder: ["group2", "group1", "group3"]
            },
            _version: "3.1.0",
            version: "3.1.0"
        };

        // Act
        return this.oCDMService._applyPagePersonalization(this.oPage, oBrokenPersonalization)
            .then(function () {
                // Assert
                assert.deepEqual(this.oCDMService._oPersonalizationDeltasForCDMVersion31, oExpectedPersonalization, "saved the correct personalization");
            }.bind(this));
    });

    QUnit.test("Does not recover correct personalization for classicHomePage", function (assert) {
        // Arrange
        var oCorrectPersonalization = {
            classicHomePage: {
                _version: "3.0.0",
                groupsOrder: ["group1", "group2", "group3"]
            },
            page1: {
                _version: "3.0.0",
                groupsOrder: ["group3", "group2", "group1"]
            },
            _version: "3.1.0",
            version: "3.1.0"
        };
        this.oGetPersonalizationStub.withArgs("3.1.0").returns(new jQuery.Deferred().resolve(oCorrectPersonalization).promise());
        var oExpectedPersonalization = {
            classicHomePage: {
                _version: "3.0.0",
                groupsOrder: ["group1", "group2", "group3"]
            },
            page1: {
                _version: "3.0.0",
                groupsOrder: ["group3", "group2", "group1"]
            },
            _version: "3.1.0",
            version: "3.1.0"
        };

        // Act
        return this.oCDMService._applyPagePersonalization(this.oPage, oCorrectPersonalization)
            .then(function () {
                // Assert
                assert.deepEqual(this.oCDMService._oPersonalizationDeltasForCDMVersion31, oExpectedPersonalization, "saved the correct personalization");
            }.bind(this));
    });

    QUnit.module("_triggerMixinPersonalizationInSite", {
        beforeEach: function () {
            this.oOriginalSite = {
                _version: "3.1.0",
                originalProperty: "foo"
            };
            this.oPersonalization = { personalizedProperty: "bar" };
            this.oPersonalizedSite = {
                _version: "3.1.0",
                originalProperty: "foo",
                personalizedProperty: "bar"
            };
            this.oMockAdapter = {
                _getSiteDeferred: new jQuery.Deferred(),
                getSite: sandbox.spy(function () {
                    return this._getSiteDeferred.promise();
                })
            };

            this.oMockPersonalizationProcessor = {
                _mixinPersonalizationDeferred: new jQuery.Deferred(),
                mixinPersonalization: sandbox.spy(function () {
                    return this._mixinPersonalizationDeferred.promise();
                })
            };

            this.oCommonDataModelService = new CommonDataModel(this.oMockAdapter);

            this.oCommonDataModelService._oPersonalizationProcessor = this.oMockPersonalizationProcessor;
        },
        afterEach: function () {
        }
    });

    QUnit.test("calls mixinPersonalization with the correct parameters and returns a personalized site.", async function (assert) {
        // Arrange
        this.oMockPersonalizationProcessor._mixinPersonalizationDeferred.resolve(this.oPersonalizedSite);

        // Act
        const oPersonalizedSite = await this.oCommonDataModelService._triggerMixinPersonalizationInSite(this.oOriginalSite, this.oPersonalization);

        // Assert
        assert.ok(this.oMockPersonalizationProcessor.mixinPersonalization.getCall(0).calledWith(this.oOriginalSite, this.oPersonalization),
            "the function mixinPersonalization called with the right parameters.");
        assert.strictEqual(this.oMockPersonalizationProcessor.mixinPersonalization.callCount, 1, "the function mixinPersonalization called exactly once.");
        assert.deepEqual(oPersonalizedSite, this.oPersonalizedSite, "the correct personalized site was returned.");
        // Cleanup
    });

    QUnit.test("calls all needed check functions on the personalized site", async function (assert) {
        // Arrange
        var oEnsureCompleteSiteSpy = sandbox.spy(this.oCommonDataModelService, "_ensureCompleteSite");
        var oEnsureGroupsOrderSpy = sandbox.spy(this.oCommonDataModelService, "_ensureGroupsOrder");
        var oEnsureStandardVizTypesPresentSpy = sandbox.spy(this.oCommonDataModelService, "_ensureStandardVizTypesPresent");

        this.oMockPersonalizationProcessor._mixinPersonalizationDeferred.resolve(this.oPersonalizedSite);

        // Act
        await this.oCommonDataModelService._triggerMixinPersonalizationInSite(this.oOriginalSite, this.oPersonalization);

        // Assert
        assert.strictEqual(oEnsureCompleteSiteSpy.callCount, 1, "the function _ensureCompleteSite was called exactly once.");
        assert.strictEqual(oEnsureGroupsOrderSpy.callCount, 1, "the function _ensureGroupsOrder was called exactly once.");
        assert.strictEqual(oEnsureStandardVizTypesPresentSpy.callCount, 1, "the function _ensureStandardVizTypesPresent was called exactly once.");
        assert.ok(oEnsureCompleteSiteSpy.getCall(0).calledWith(this.oPersonalizedSite), "the function _ensureCompleteSite was called with the right parameters.");
        assert.ok(oEnsureGroupsOrderSpy.getCall(0).calledWith(this.oPersonalizedSite), "the function _ensureGroupsOrder was called with the right parameters.");
        assert.ok(oEnsureStandardVizTypesPresentSpy.getCall(0).calledWith(this.oPersonalizedSite), "the function _ensureStandardVizTypesPresent was called with the right parameters.");
    });

    QUnit.test("checks the error case", async function (assert) {
        // Arrange
        this.oMockPersonalizationProcessor._mixinPersonalizationDeferred.reject("Error");

        // Act
        try {
            await this.oCommonDataModelService._triggerMixinPersonalizationInSite(this.oOriginalSite, this.oPersonalization);
        } catch (sError) {
            // Assert
            assert.strictEqual(sError, "Error", "the function correctly rejects after mixin handler rejected.");
        }
    });

    QUnit.module("sap.ushell.services.CommonDataModel", {
        beforeEach: function (assert) {
            var done = assert.async();
            window["sap-ushell-config"] = { services: { CommonDataModel: { adapter: { module: "sap.ushell.adapters.cdm.CommonDataModelAdapter" } } } };

            this.isFlpHomeIntentStub = sandbox.stub(ushellUtils, "isFlpHomeIntent");
            this.isFlpHomeIntentStub.returns(true);

            Container.init("local")
                .then(function () {
                    Container.getServiceAsync("CommonDataModel").then(function (CommonDataModelService) {
                        this.CommonDataModelService = CommonDataModelService;
                        done();
                    }.bind(this));
                }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("#getPlugins should always return a promise", function (assert) {
        sandbox.stub(this.CommonDataModelService, "getSiteWithoutPersonalization").callsFake(function () {
            return jQuery.when({
                applications: {
                    plugin_0: {
                        "sap.app": {
                            id: "plugin:0",
                            title: "Plugin 0",
                            crossNavigation: { inbounds: { "Shell-plugin": {} } }
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_0_component" },
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: { "sap-ushell-plugin-type": "RendererExtensions" }
                            }
                        }
                    },
                    plugin_1: {
                        "sap.app": {
                            id: "plugin:1",
                            title: "Plugin 1",
                            crossNavigation: { inbounds: { "Shell-plugin": {} } }
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_1_component" },
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: { "sap-ushell-plugin-type": "RendererExtensions" }
                            }
                        }
                    }
                }
            });
        });

        return this.CommonDataModelService.getPlugins()
            .then(function (aPlugins) {
                assert.ok(aPlugins, "Resolved some value for all plugins");
                return this.CommonDataModelService.getPlugins("UserDefaults");
            }.bind(this))
            .then(function (aPlugins) {
                assert.ok(aPlugins, "Resolved some value for a specific plugin");
            });
    });

    QUnit.test("#getPlugins should correctly identify plugins among apps", function (assert) {
        var done = assert.async();

        sandbox.stub(this.CommonDataModelService, "getSiteWithoutPersonalization").callsFake(function () {
            return jQuery.when({
                applications: {
                    // inbounds present and type is plugin
                    plugin_0: {
                        "sap.app": {
                            id: "plugin:0",
                            title: "Plugin 0",
                            crossNavigation: { inbounds: { "plugin_0_Shell-plugin": {} } }
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_0_component" },
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: { "sap-ushell-plugin-type": "RendererExtensions" }
                            }
                        }
                    },
                    plugin_1: {
                        "sap.app": {
                            id: "plugin:1",
                            title: "Plugin 1",
                            crossNavigation: { inbounds: { "plugin_1_Shell-plugin": {} } }
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_1_component" },
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: { "sap-ushell-plugin-type": "RendererExtensions" }
                            }
                        }
                    },
                    // NO inbounds and type is plugin
                    plugin_2: {
                        "sap.app": {
                            id: "plugin:2",
                            title: "Plugin 2"
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_2_component" },
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: { "sap-ushell-plugin-type": "UserDefaults" }
                            }
                        }
                    },
                    plugin_3: {
                        "sap.app": {
                            id: "plugin:3",
                            title: "Plugin 3"
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_3_component" },
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: { "sap-ushell-plugin-type": "UnsupportedCategory" }
                            }
                        }
                    },
                    // inbounds present, type is not plugin
                    plugin_4: {
                        "sap.app": {
                            id: "plugin:3",
                            title: "Plugin 3",
                            crossNavigation: { inbounds: { "plugin_4_Shell-plugin": {} } }
                        },
                        "sap.flp": { type: "tile" },
                        "sap.ui5": { componentName: "plugin_4_component" }
                    },
                    // NO inbounds present, type is not plugin
                    plugin_5: {
                        "sap.app": {
                            id: "plugin:5",
                            title: "Plugin 5"
                        },
                        "sap.flp": { type: "tile" },
                        "sap.ui5": { componentName: "plugin_5_component" }
                    },
                    // type is plugin, but no config
                    plugin_6: {
                        "sap.app": {
                            id: "plugin:6",
                            title: "Plugin 6"
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_6_component" },
                        "sap.platform.runtime": { componentProperties: { url: "http://" } }
                    },
                    // inbound has non-overlapping parameters
                    plugin_7: {
                        "sap.app": {
                            id: "plugin:7",
                            title: "Plugin 7",
                            crossNavigation: {
                                inbounds: {
                                    "first_Shell-plugin": {
                                        semanticObject: "Shell",
                                        action: "plugin",
                                        signature: {
                                            parameters: {
                                                param1: { // not in sap.platform.runtime
                                                    defaultValue: { value: "value1" }
                                                },
                                                param2: { // not in sap.platform.runtime
                                                    defaultValue: {
                                                        type: "plain",
                                                        value: "value2"
                                                    }
                                                },
                                                param3: {
                                                    required: true,
                                                    filter: { // filter is ignored
                                                        type: "plain",
                                                        value: "value3"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_7_component" },
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: { "sap-ushell-plugin-type": "RendererExtensions" }
                            }
                        }
                    },
                    // inbound has overlapping parameters
                    plugin_8: {
                        "sap.app": {
                            id: "plugin:8",
                            title: "Plugin 8",
                            crossNavigation: {
                                inbounds: {
                                    "OverLapping_Shell-plugin": {
                                        semanticObject: "Shell",
                                        action: "plugin",
                                        signature: {
                                            parameters: {
                                                param1: { // also in sap.platform.runtime
                                                    defaultValue: { value: "valueFromInbound" }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_8_component" },
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: { param1: "valueFromConfig" }
                            }
                        }
                    },
                    // multiple inbound with SO: Shell-plugin
                    plugin_9: {
                        "sap.app": {
                            id: "plugin:9",
                            title: "Plugin 9",
                            crossNavigation: {
                                inbounds: {
                                    "First_Shell-plugin": {
                                        semanticObject: "Shell",
                                        action: "plugin",
                                        signature: {
                                            parameters: {
                                                param1: { // not in sap.platform.runtime
                                                    defaultValue: { value: "value1" }
                                                },
                                                param2: { // not in sap.platform.runtime
                                                    defaultValue: {
                                                        type: "plain",
                                                        value: "value2"
                                                    }
                                                },
                                                param3: {
                                                    required: true,
                                                    filter: { // filter is ignored
                                                        type: "plain",
                                                        value: "value3"
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    "Second_Shell-plugin": {
                                        semanticObject: "Shell",
                                        action: "plugin",
                                        signature: {
                                            parameters: {
                                                param1: { // not in sap.platform.runtime
                                                    defaultValue: { value: "value4" }
                                                },
                                                param2: { // not in sap.platform.runtime
                                                    defaultValue: {
                                                        type: "plain",
                                                        value: "value5"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_9_component" },
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: { "sap-ushell-plugin-type": "RendererExtensions" }
                            }
                        }
                    },
                    // inbound is empty
                    plugin_10: {
                        "sap.app": {
                            id: "plugin:10",
                            title: "Plugin 10",
                            crossNavigation: {
                                inbounds: {
                                    "OverLapping_Shell-plugin": {
                                    }
                                }
                            }
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_10_component" },
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: { param10: "valueFromConfig" }
                            }
                        }
                    },
                    // No Inbound with SO-action: Shell-plugin
                    plugin_11: {
                        "sap.app": {
                            id: "plugin:11",
                            title: "Plugin 11",
                            crossNavigation: {
                                inbounds: {
                                    "No_Shell-plugin": {
                                        semanticObject: "PO",
                                        action: "display",
                                        signature: {
                                            parameters: {
                                                param1: { // not in sap.platform.runtime
                                                    defaultValue: { value: "value1" }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_11_component" },
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: { param10: "valueFromConfig" }
                            }
                        }
                    }
                }
            });
        });

        // Test plugin identification among set of apps.
        this.CommonDataModelService.getPlugins(null)
            .then(function (oPlugins) {
                assert.deepEqual(oPlugins, {
                    plugin_0: {
                        url: "http://",
                        config: { "sap-ushell-plugin-type": "RendererExtensions" },
                        component: "plugin_0_component"
                    },
                    plugin_1: {
                        url: "http://",
                        config: { "sap-ushell-plugin-type": "RendererExtensions" },
                        component: "plugin_1_component"
                    },
                    plugin_2: {
                        url: "http://",
                        config: { "sap-ushell-plugin-type": "UserDefaults" },
                        component: "plugin_2_component"
                    },
                    plugin_3: {
                        url: "http://",
                        config: { "sap-ushell-plugin-type": "UnsupportedCategory" },
                        component: "plugin_3_component"
                    },
                    plugin_6: {
                        url: "http://",
                        component: "plugin_6_component",
                        config: {}
                    },
                    plugin_7: {
                        url: "http://",
                        component: "plugin_7_component",
                        config: {
                            // merged: signature parameters + componentProperties
                            param1: "value1",
                            param2: "value2",
                            "sap-ushell-plugin-type": "RendererExtensions"
                        }
                    },
                    plugin_8: {
                        url: "http://",
                        component: "plugin_8_component",
                        config: { param1: "valueFromInbound" } // value from signature takes precedence
                    },
                    plugin_9: {
                        url: "http://",
                        component: "plugin_9_component",
                        config: {
                            // merged: signature parameters + componentProperties
                            param1: "value1",
                            param2: "value2",
                            "sap-ushell-plugin-type": "RendererExtensions"
                        }
                    },
                    plugin_10: {
                        url: "http://",
                        component: "plugin_10_component",
                        config: { param10: "valueFromConfig" }
                    },
                    plugin_11: {
                        component: "plugin_11_component",
                        config: { param10: "valueFromConfig" },
                        url: "http://"
                    }
                }, "Correctly identifies plugins in site and returns them");
            }, function (vError) {
                return vError;
            })
            .then(done, done);

        this.CommonDataModelService.getSiteWithoutPersonalization.restore();
    });

    QUnit.test("#getPlugins should transfer form factor", function (assert) {
        var done = assert.async();

        sandbox.stub(this.CommonDataModelService, "getSiteWithoutPersonalization").callsFake(function () {
            return jQuery.when({
                applications: {
                    // deviceTypes is provided
                    plugin_0: {
                        "sap.app": {
                            id: "plugin:0",
                            title: "Plugin 0",
                            crossNavigation: { inbounds: { "Shell-plugin": {} } }
                        },
                        "sap.ui": {
                            technology: "UI5",
                            deviceTypes: {
                                desktop: true,
                                tablet: true,
                                phone: true
                            }
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_0_component" },
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: { "sap-ushell-plugin-type": "RendererExtensions" }
                            }
                        }
                    },
                    //only phone
                    plugin_1: {
                        "sap.app": {
                            id: "plugin:1",
                            title: "Plugin 1",
                            crossNavigation: { inbounds: { "Shell-plugin": {} } }
                        },
                        "sap.ui": {
                            technology: "UI5",
                            deviceTypes: {
                                desktop: false,
                                tablet: false,
                                phone: true
                            }
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_1_component" },
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: { "sap-ushell-plugin-type": "RendererExtensions" }
                            }
                        }
                    },
                    // no device type is provided
                    plugin_2: {
                        "sap.app": {
                            id: "plugin:2",
                            title: "Plugin 2",
                            crossNavigation: { inbounds: { "Shell-plugin": {} } }
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_2_component" },
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: { "sap-ushell-plugin-type": "RendererExtensions" }
                            }
                        }
                    }
                }
            });
        });

        // Test plugin identification among set of apps.
        this.CommonDataModelService.getPlugins(null)
            .then(function (oPlugins) {
                assert.deepEqual(oPlugins, {
                    plugin_0: {
                        url: "http://",
                        config: { "sap-ushell-plugin-type": "RendererExtensions" },
                        component: "plugin_0_component",
                        deviceTypes: {
                            desktop: true,
                            tablet: true,
                            phone: true
                        }
                    },
                    plugin_1: {
                        url: "http://",
                        config: { "sap-ushell-plugin-type": "RendererExtensions" },
                        component: "plugin_1_component",
                        deviceTypes: {
                            desktop: false,
                            tablet: false,
                            phone: true
                        }
                    },
                    plugin_2: {
                        url: "http://",
                        config: { "sap-ushell-plugin-type": "RendererExtensions" },
                        component: "plugin_2_component"
                    }
                }, "Correctly identifies plugins in site and returns them");
            }, function (vError) {
                return vError;
            })
            .then(done, done);

        this.CommonDataModelService.getSiteWithoutPersonalization.restore();
    });

    QUnit.test("#getPlugins should not error when no inbounds are defined", function (assert) {
        var done = assert.async();

        sandbox.stub(this.CommonDataModelService, "getSiteWithoutPersonalization").callsFake(function () {
            return jQuery.when({
                applications: {
                    plugin: {
                        "sap.app": {
                            id: "plugin",
                            title: "Plugin",
                            crossNavigation: { inbounds: {} } // no inbounds
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_0_component" },
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: { "sap-ushell-plugin-type": "RendererExtensions" }
                            }
                        }
                    }
                }
            });
        });

        sandbox.stub(Log, "error");

        // Test plugin identification among set of apps.
        this.CommonDataModelService.getPlugins(null)
            .then(function (/*oPlugins*/) {
                assert.ok(true, "getPlugins promise was resolved");
                assert.strictEqual(Log.error.callCount, 0, "Log.error was called 0 times");
            }, function (vError) {
                assert.ok(false, "getPlugins promise was resolved. ERROR: " + vError);
            })
            .then(done, done);

        this.CommonDataModelService.getSiteWithoutPersonalization.restore();
    });

    QUnit.test("#getPlugins should error if no Shell-plugin inbound is defined", function (assert) {
        var done = assert.async();

        sandbox.stub(this.CommonDataModelService, "getSiteWithoutPersonalization").callsFake(function () {
            return jQuery.when({
                applications: {
                    plugin: {
                        "sap.app": {
                            id: "plugin",
                            title: "Plugin",
                            crossNavigation: { inbounds: { InboundId: {} } } // note: not Shell-plugin
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_0_component" },
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: { "sap-ushell-plugin-type": "RendererExtensions" }
                            }
                        }
                    }
                }
            });
        });

        sandbox.stub(Log, "error");

        // Test plugin identification among set of apps.
        this.CommonDataModelService.getPlugins(null)
            .then(function (/*oPlugins*/) {
                assert.ok(true, "getPlugins promise was resolved");
                assert.strictEqual(Log.error.callCount, 1,
                    "Log.error was called once");

                assert.deepEqual(Log.error.getCall(0).args, [
                    "Cannot find inbound with semanticObject:Shell and action:plugin for plugin 'plugin'",
                    "plugin startup configuration cannot be determined correctly",
                    "sap.ushell.services.CommonDataModel"
                ], "Log.error was called with the expected arguments");
            }, function (vError) {
                assert.ok(false, "getPlugins promise was resolved. ERROR: " + vError);
            })
            .then(done, done);

        this.CommonDataModelService.getSiteWithoutPersonalization.restore();
    });

    QUnit.test("#getPlugins should warn if multiple inbounds are defined for a plugin", function (assert) {
        var done = assert.async();

        sandbox.stub(this.CommonDataModelService, "getSiteWithoutPersonalization").callsFake(function () {
            return jQuery.when({
                applications: {
                    plugin: {
                        "sap.app": {
                            id: "plugin",
                            title: "Plugin",
                            crossNavigation: {
                                inbounds: {
                                    "Shell-plugin": {},
                                    AnotherInbound1: {},
                                    AnotherInbound2: {}
                                }
                            }
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_0_component" },
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: { "sap-ushell-plugin-type": "RendererExtensions" }
                            }
                        }
                    }
                }
            });
        });

        sandbox.stub(Log, "warning");

        // Test plugin identification among set of apps.
        this.CommonDataModelService.getPlugins(null)
            .then(function (/*oPlugins*/) {
                assert.ok(true, "getPlugins promise was resolved");
                assert.strictEqual(Log.warning.callCount, 1,
                    "Log.warning was called once");

                assert.deepEqual(Log.warning.getCall(0).args, [
                    "Multiple inbounds are defined for plugin 'plugin'",
                    "Plugin startup configuration will be determined using the first signature inbound with semanticObject:Shell and action:plugin for plugin.",
                    "sap.ushell.services.CommonDataModel"
                ], "Log.warning was called with the expected arguments");
            }, function (vError) {
                assert.ok(false, "getPlugins promise was resolved. ERROR: " + vError);
            })
            .then(done, done);

        this.CommonDataModelService.getSiteWithoutPersonalization.restore();
    });

    QUnit.test("#getPlugins should have a consistent cache", function (assert) {
        var done = assert.async();

        sandbox.stub(this.CommonDataModelService, "getSiteWithoutPersonalization").callsFake(function () {
            return jQuery.when({
                applications: {
                    // inbounds present and type is plugin
                    plugin_0: {
                        "sap.app": {
                            id: "plugin:0",
                            title: "Plugin 0",
                            crossNavigation: { inbounds: { "Shell-plugin": {} } }
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_0_component" },
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: { "sap-ushell-plugin-type": "RendererExtensions" }
                            }
                        }
                    },
                    // NO inbounds and type is plugin
                    plugin_3: {
                        "sap.app": {
                            id: "plugin:3",
                            title: "Plugin 3"
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_3_component" },
                        "sap.platform.runtime": {
                            componentProperties: {
                                config: { "sap-ushell-plugin-type": "UnsupportedCategory" }
                            }
                        }
                    },
                    // NO inbounds present, type is not plugin
                    plugin_5: {
                        "sap.app": {
                            id: "plugin:5",
                            title: "Plugin 5"
                        },
                        "sap.flp": { type: "tile" },
                        "sap.ui5": { componentName: "plugin_5_component" }
                    },
                    // type is plugin but no category specified
                    plugin_6: {
                        "sap.app": {
                            id: "plugin:6",
                            title: "Plugin 6"
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_6_component" },
                        "sap.platform.runtime": { componentProperties: {} }
                    }
                }
            });
        });

        // Test cache consistency.
        jQuery.when(this.CommonDataModelService.getPlugins(), this.CommonDataModelService.getPlugins())
            .then(function (oFirstPluginSet, oSecondPluginSet) {
                assert.throws(function () {
                    oFirstPluginSet["bad property"] = {};
                }, TypeError, "Memoized output is secured from external corruption");

                assert.strictEqual(oFirstPluginSet, oSecondPluginSet, "Subsequent calls return the same references");
            })
            .then(done, done);

        this.CommonDataModelService.getSiteWithoutPersonalization.restore();
    });

    QUnit.test("#getPlugins should be robust if sap.platform.runtime section is missing", function (assert) {
        var done = assert.async();

        sandbox.stub(this.CommonDataModelService, "getSiteWithoutPersonalization").callsFake(function () {
            return jQuery.when({
                applications: {
                    // type is plugin and "sap.platform.runtime" section missing
                    plugin_0: {
                        "sap.app": {
                            id: "plugin:0",
                            title: "Plugin 0"
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_0_component" }
                    },
                    // type is plugin and "sap.platform.runtime" section is null
                    plugin_1: {
                        "sap.app": {
                            id: "plugin:0",
                            title: "Plugin 0"
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_0_component" },
                        "sap.platform.runtime": null
                    },
                    // type is plugin and "sap.platform.runtime" section is a number
                    plugin_2: {
                        "sap.app": {
                            id: "plugin:0",
                            title: "Plugin 0"
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_0_component" },
                        "sap.platform.runtime": 42
                    },
                    // type is plugin and "sap.platform.runtime"/componentProperties section missing
                    plugin_3: {
                        "sap.app": {
                            id: "plugin:3",
                            title: "Plugin 3"
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_3_component" },
                        "sap.platform.runtime": {}
                    },
                    // type is plugin and "sap.platform.runtime"/componentProperties section is null
                    plugin_4: {
                        "sap.app": {
                            id: "plugin:0",
                            title: "Plugin 0"
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_0_component" },
                        "sap.platform.runtime": { componentProperties: null }
                    },
                    // type is plugin and "sap.platform.runtime"/componentProperties section is a function
                    plugin_5: {
                        "sap.app": {
                            id: "plugin:0",
                            title: "Plugin 0"
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_0_component" },
                        "sap.platform.runtime": {
                            componentProperties: function () { }
                        }
                    }
                }
            });
        });

        sandbox.stub(Log, "error");

        this.CommonDataModelService.getPlugins(null)
            .then(function (/*oPlugins*/) {
                assert.ok(true, "getPlugins promise was resolved");
                assert.strictEqual(Log.error.callCount, 6,
                    "Log.error was called twice");

                assert.deepEqual(Log.error.getCall(0).args, [
                    "Cannot find 'sap.platform.runtime' section for plugin 'plugin_0'",
                    "plugin might not be started correctly",
                    "sap.ushell.services.CommonDataModel"
                ], "Log.error was called with the expected arguments");
                assert.deepEqual(Log.error.getCall(1).args, [
                    "Cannot find 'sap.platform.runtime' section for plugin 'plugin_1'",
                    "plugin might not be started correctly",
                    "sap.ushell.services.CommonDataModel"
                ], "Log.error was called with the expected arguments");
                assert.deepEqual(Log.error.getCall(2).args, [
                    "Cannot find 'sap.platform.runtime' section for plugin 'plugin_2'",
                    "plugin might not be started correctly",
                    "sap.ushell.services.CommonDataModel"
                ], "Log.error was called with the expected arguments");
                assert.deepEqual(Log.error.getCall(3).args, [
                    "Cannot find 'sap.platform.runtime/componentProperties' section for plugin 'plugin_3'",
                    "plugin might not be started correctly",
                    "sap.ushell.services.CommonDataModel"
                ], "Log.error was called with the expected arguments");
                assert.deepEqual(Log.error.getCall(4).args, [
                    "Cannot find 'sap.platform.runtime/componentProperties' section for plugin 'plugin_4'",
                    "plugin might not be started correctly",
                    "sap.ushell.services.CommonDataModel"
                ], "Log.error was called with the expected arguments");
                assert.deepEqual(Log.error.getCall(5).args, [
                    "Cannot find 'sap.platform.runtime/componentProperties' section for plugin 'plugin_5'",
                    "plugin might not be started correctly",
                    "sap.ushell.services.CommonDataModel"
                ], "Log.error was called with the expected arguments");
            }, function (vError) {
                assert.ok(false, "expected that getPlugins promise was resolved. ERROR: " + vError);
            })
            .then(done, done);

        this.CommonDataModelService.getSiteWithoutPersonalization.restore();
    });

    QUnit.test("getSite", function (assert) {
        // arrange
        var oCommonDataModelService,
            oSiteDeferredMock = new jQuery.Deferred(),
            oMockAdapter = {
                getSite: sandbox.spy(function () {
                    // dead end function. promise is never resolved.
                    // just needed so the constructor does not fail
                    return (new jQuery.Deferred()).promise();
                })
                // getPersonalization not needed
            },
            oPersonalizedSite = {
                originalProperty: "foo",
                personalizedProperty: "bar"
            },
            fnDone = assert.async();

        oCommonDataModelService = new CommonDataModel(oMockAdapter);
        // overwrite _oSiteDeferred as it is used by getSite
        oCommonDataModelService._oSiteDeferred = oSiteDeferredMock.promise();

        // act - success case
        oSiteDeferredMock.resolve(oPersonalizedSite);
        oCommonDataModelService.getSite()
            .fail(function () {
                assert.ok(false, "unexpected reject of _oSiteDeferred");
            })
            .done(function (oResolvedPersonalizedSite) {
                assert.deepEqual(oResolvedPersonalizedSite, oPersonalizedSite, "done handler: personalized site");
            })
            .always(fnDone);
    });

    QUnit.test("get site", function (assert) {
        // arrange
        var oCommonDataModelService,
            oSiteDeferredMock = new jQuery.Deferred(),
            oMockAdapter = {
                getSite: sandbox.spy(function () {
                    // dead end function. promise is never resolved.
                    // just needed so the constructor does not fail
                    return (new jQuery.Deferred()).promise();
                })
                // getPersonalization not needed
            },
            fnDone = assert.async();

        oCommonDataModelService = new CommonDataModel(oMockAdapter);

        // failure case
        oSiteDeferredMock = new jQuery.Deferred();
        oCommonDataModelService._oSiteDeferred = oSiteDeferredMock.promise();

        // act - success case
        oSiteDeferredMock.reject("intentionally failed");
        oCommonDataModelService.getSite()
            .done(function () {
                assert.ok(false, "unexpected resolve of _oSiteDeferred");
            })
            .fail(function (sMessage) {
                assert.strictEqual(sMessage, "intentionally failed", "error message");
            })
            .always(fnDone);
    });

    QUnit.test("getSite: apply personalization if it was not applied", function (assert) {
        // arrange
        var oCommonDataModelService,
            oSiteDeferredMock = new jQuery.Deferred(),
            oGetSite = new jQuery.Deferred(),
            oMockAdapter = {
                getSite: sandbox.spy(function () {
                    // dead end function. promise is never resolved.
                    // just needed so the constructor does not fail
                    return oGetSite.promise();
                })
                // getPersonalization not needed
            },
            oPersonalizedSite = { originalProperty: "foo", personalizedProperty: "bar" },
            fnDone = assert.async();

        ObjectPath.set("renderers.fiori2.componentData.config.rootIntent", "Some-home", window["sap-ushell-config"]);
        oCommonDataModelService = new CommonDataModel(oMockAdapter);
        // overwrite _oSiteDeferred as it is used by getSite
        oCommonDataModelService._oSiteDeferred = oSiteDeferredMock.promise();
        var oLoadAndApplyPersonalizationForCDMVersion30Stub = sandbox.stub(oCommonDataModelService, "_loadAndApplyPersonalizationForCDMVersion30");
        sandbox.stub(oCommonDataModelService, "getSiteWithoutPersonalization").returns((new jQuery.Deferred()).resolve().promise());
        oGetSite.resolve({});

        // act - success case
        oSiteDeferredMock.resolve(oPersonalizedSite);
        oCommonDataModelService.getSite()
            .fail(function () {
                assert.ok(false, "unexpected reject of _oSiteDeferred");
            })
            .done(function (oResolvedPersonalizedSite) {
                assert.deepEqual(oResolvedPersonalizedSite, oPersonalizedSite, "done handler: personalized site");
                assert.ok(oLoadAndApplyPersonalizationForCDMVersion30Stub.calledOnce, "_loadAndApplyPersonalizationForCDMVersion30 was called");
            })
            .always(fnDone);
    });

    QUnit.test("getSite: _oOriginalSite and _oPersonalizedSiteForCDMVersion30 must be different objects when _bLoadPersonalizationForCDMVersion30Late is true", function (assert) {
        // arrange
        var oCommonDataModelService,
            originSite = {},
            oSiteDeferredMock = new jQuery.Deferred(),
            oGetSite = new jQuery.Deferred(),
            oMockAdapter = {
                getSite: sandbox.spy(function () {
                    // dead end function. promise is never resolved.
                    // just needed so the constructor does not fail
                    return oGetSite.promise();
                })
                // getPersonalization not needed
            },
            fnDone = assert.async();

        ObjectPath.set("renderers.fiori2.componentData.config.rootIntent", "Some-home", window["sap-ushell-config"]);
        oCommonDataModelService = new CommonDataModel(oMockAdapter);
        // overwrite _oSiteDeferred as it is used by getSite
        oCommonDataModelService._oSiteDeferred = oSiteDeferredMock.promise();
        var oLoadAndApplyPersonalizationStub = sandbox.stub(oCommonDataModelService, "_loadAndApplyPersonalizationForCDMVersion30");
        oGetSite.resolve(originSite);

        // act - success case
        oSiteDeferredMock.resolve();
        oCommonDataModelService.getSite()
            .fail(function () {
                assert.ok(false, "unexpected reject of _oSiteDeferred");
            })
            .done(function (oResolvedPersonalizedSite) {
                assert.ok(oLoadAndApplyPersonalizationStub.calledOnce, "_loadAndApplyPersonalizationForCDMVersion30 was called");
                assert.ok(oLoadAndApplyPersonalizationStub.getCall(0).args[0] !== oCommonDataModelService._oOriginalSite, "_oOriginalSite is different object from site for personalization");
            })
            .always(fnDone);
    });

    QUnit.test("getSite: _oOriginalSite and _oPersonalizedSiteForCDMVersion30 must be different objects when _bLoadPersonalizationForCDMVersion30Late is false", function (assert) {
        // arrange
        var oCommonDataModelService,
            originSite = {},
            oSiteDeferredMock = new jQuery.Deferred(),
            oMockAdapter = {
                getSite: sandbox.spy(function () {
                    // dead end function. promise is never resolved.
                    // just needed so the constructor does not fail
                    return (new jQuery.Deferred()).resolve(originSite).promise();
                })
                // getPersonalization not needed
            },
            fnDone = assert.async();

        this.isFlpHomeIntentStub.returns(false);
        ObjectPath.set("renderers.fiori2.componentData.config.rootIntent", "Some-home", window["sap-ushell-config"]);
        oCommonDataModelService = new CommonDataModel(oMockAdapter);
        // overwrite _oSiteDeferred as it is used by getSite
        oCommonDataModelService._oSiteDeferred = oSiteDeferredMock.promise();
        var oLoadAndApplyPersonalizationStub = sandbox.stub(oCommonDataModelService, "_loadAndApplyPersonalizationForCDMVersion30");

        // act - success case
        oSiteDeferredMock.resolve();
        oCommonDataModelService.getSite()
            .fail(function () {
                assert.ok(false, "unexpected reject of _oSiteDeferred");
            })
            .done(function (oResolvedPersonalizedSite) {
                assert.ok(oLoadAndApplyPersonalizationStub.calledOnce, "_loadAndApplyPersonalizationForCDMVersion30 was called");
                assert.ok(oLoadAndApplyPersonalizationStub.getCall(0).args[0] !== oCommonDataModelService._oOriginalSite, "_oOriginalSite is different object from site for personalization");
            })
            .always(fnDone);
    });

    QUnit.module("getPage", {
        beforeEach: function () {
            this.oPageMock = { id: "validPageId" };
            this.oPersonalizedPageMock = { id: "validPageId", personalized: true };
            this.oMyPageMock = { id: "myPageId" };
            this.oPersonalizedMyPageMock = { id: "myPageId", personalized: true };
            this.oConfigStub = sandbox.stub(Config, "last");
            this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(true);
            this.oConfigStub.withArgs("/core/spaces/myHome/enabled").returns(true);
            this.oConfigStub.withArgs("/core/spaces/myHome/myHomePageId").returns("myPageId");

            this.oGetPageFromAdapterStub = sandbox.stub(CommonDataModel.prototype, "_getPageFromAdapter");
            this.oGetPageFromAdapterStub.withArgs("validPageId").resolves(this.oPageMock);
            this.oGetPageFromAdapterStub.withArgs("myPageId").resolves(this.oMyPageMock);

            this.oApplyPagePersonalizationStub = sandbox.stub(CommonDataModel.prototype, "_applyPagePersonalization");
            this.oApplyPagePersonalizationStub.withArgs(this.oPageMock).resolves(this.oPersonalizedPageMock);
            this.oApplyPagePersonalizationStub.withArgs(this.oMyPageMock).resolves(this.oPersonalizedMyPageMock);
            this.oGetPersonalizationStub = sandbox.stub();
            this.oGetPersonalizationStub.returns(new jQuery.Deferred().resolve(this.oPersonalizationMock).promise());

            this.oCDMService = new CommonDataModel({
                getSite: sandbox.stub().returns(new jQuery.Deferred().resolve({}).promise()),
                getPersonalization: this.oGetPersonalizationStub
            });
            this.oCDMService._oPersonalizedPages = {};
            this.oMigratePersonalizedPagesStub = sandbox.stub(this.oCDMService, "_migratePersonalizedPages")
                .callsFake((args) => Promise.resolve(args)); // _migratePersonalizedPages always returns the pages given in input
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resolves a personalized page, when personalization is enabled", function (assert) {
        // Arrange
        // Act
        return this.oCDMService.getPage("validPageId")
            .then(function (oPage) {
                // Assert
                assert.deepEqual(oPage, this.oPersonalizedPageMock, "returned the correct result");
                assert.strictEqual(this.oGetPageFromAdapterStub.callCount, 1, "_getPageFromAdapter was called once");
                assert.strictEqual(this.oApplyPagePersonalizationStub.callCount, 1, "_applyPagePersonalization was called once");
            }.bind(this));
    });

    QUnit.test("Resolves a page without personalization page, when personalization is disabled", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);
        // Act
        return this.oCDMService.getPage("validPageId")
            .then(function (oPage) {
                // Assert
                assert.deepEqual(oPage, this.oPageMock, "returned the correct result");
                assert.strictEqual(this.oGetPageFromAdapterStub.callCount, 1, "_getPageFromAdapter was called once");
                assert.strictEqual(this.oApplyPagePersonalizationStub.callCount, 0, "_applyPagePersonalization was not called");
            }.bind(this));
    });

    QUnit.test("Rejects if gathering the page fails", function (assert) {
        // Arrange
        var sExpectedMessage = "CommonDataModel Service: Cannot get page validPageId";
        this.oGetPageFromAdapterStub.withArgs(sandbox.match.any).rejects();
        // Act
        return this.oCDMService.getPage("validPageId")
            .then(function () {
                // Assert
                assert.ok(false, "promise should have been rejected");
            })
            .catch(function (sMessage) {
                assert.strictEqual(sMessage, sExpectedMessage, "rejected with the correct message");
            });
    });

    QUnit.test("Still resolves if gathering the personalization fails", function (assert) {
        // Arrange
        this.oGetPersonalizationStub.returns(new jQuery.Deferred().reject().promise());

        // Act
        return this.oCDMService.getPage("validPageId")
            .then(function (oPage) {
                // Assert
                assert.deepEqual(oPage, this.oPersonalizedPageMock, "returned the correct result");
            }.bind(this));
    });

    QUnit.test("Rejects if personalization mixin fails", function (assert) {
        // Arrange
        var sExpectedMessage = "Personalization Processor: Cannot mixin the personalization.";
        this.oApplyPagePersonalizationStub.withArgs(sandbox.match.any).rejects();
        // Act
        return this.oCDMService.getPage("validPageId")
            .then(function () {
                // Assert
                assert.ok(false, "promise should have been rejected");
            })
            .catch(function (sMessage) {
                assert.strictEqual(sMessage, sExpectedMessage, "rejected with the correct message");
            });
    });

    QUnit.test("Resolves the same page if it was already loaded", function (assert) {
        // Arrange
        var oPersonalizedPage = { id: "validPageId", personalized: true };
        this.oCDMService._oPersonalizedPages.validPageId = oPersonalizedPage;
        // Act
        return this.oCDMService.getPage("validPageId").then(function (oPage) {
            // Assert
            assert.strictEqual(oPage, oPersonalizedPage, "Returned the correct page object");
        });
    });

    QUnit.test("Resolves a page without personalization page, when personalization is disabled and myHome is disabled", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);
        this.oConfigStub.withArgs("/core/spaces/myHome/enabled").returns(false);
        // Act
        return this.oCDMService.getPage("myPageId")
            .then(function (oPage) {
                // Assert
                assert.deepEqual(oPage, this.oMyPageMock, "returned the correct result");
                assert.strictEqual(this.oGetPageFromAdapterStub.callCount, 1, "_getPageFromAdapter was called once");
                assert.strictEqual(this.oApplyPagePersonalizationStub.callCount, 0, "_applyPagePersonalization was not called");
            }.bind(this));
    });

    QUnit.test("Resolves a page without personalization page, when personalization is disabled, myHome is enabled and the myHomePageId is not match", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);
        this.oConfigStub.withArgs("/core/spaces/myHome/enabled").returns(true);
        // Act
        return this.oCDMService.getPage("validPageId")
            .then(function (oPage) {
                // Assert
                assert.deepEqual(oPage, this.oPageMock, "returned the correct result");
                assert.strictEqual(this.oGetPageFromAdapterStub.callCount, 1, "_getPageFromAdapter was called once");
                assert.strictEqual(this.oApplyPagePersonalizationStub.callCount, 0, "_applyPagePersonalization was not called");
            }.bind(this));
    });

    QUnit.test("Resolves a page with personalization page, when personalization is disabled, myHome is enabled and the myHomePageId is match", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);
        this.oConfigStub.withArgs("/core/spaces/myHome/enabled").returns(true);
        // Act
        return this.oCDMService.getPage("myPageId")
            .then(function (oPage) {
                // Assert
                assert.deepEqual(oPage, this.oPersonalizedMyPageMock, "returned the correct result");
                assert.strictEqual(this.oGetPageFromAdapterStub.callCount, 1, "_getPageFromAdapter was called once");
                assert.strictEqual(this.oApplyPagePersonalizationStub.callCount, 1, "_applyPagePersonalization was called once");
            }.bind(this));
    });

    QUnit.test("Migrates a personalized page, when personalization is enabled", function (assert) {
        // Arrange
        var aMigratedPages = [{ id: "migratedPage" }];
        this.oMigratePersonalizedPagesStub.withArgs([this.oPersonalizedPageMock]).resolves(aMigratedPages);
        // Act
        return this.oCDMService.getPage("validPageId")
            .then(function (oPage) {
                // Assert
                assert.strictEqual(oPage, aMigratedPages[0], "resolved the correct page");
                assert.strictEqual(this.oMigratePersonalizedPagesStub.callCount, 1, "_migratePersonalizedPages was called once");
            }.bind(this));
    });

    QUnit.module("_getPageFromAdapter", {
        beforeEach: function () {
            this.sPageIdMock = "somePageId";
            this.oPageMock = { identification: { id: this.sPageIdMock } };

            this.oGetPageStub = sandbox.stub();
            this.oGetPageStub.withArgs(this.sPageIdMock).resolves(this.oPageMock);
            this.oCDMService = new CommonDataModel({
                getSite: sandbox.stub().returns(new jQuery.Deferred().resolve({}).promise()),
                getPersonalization: sandbox.stub().returns(new jQuery.Deferred()),
                getPage: this.oGetPageStub
            });
            this.oGetCachedVisualizationsStub = sandbox.stub(this.oCDMService, "getCachedVisualizations").resolves({
                cachedVisualization: {}
            });
            this.oGetCachedVizTypesStub = sandbox.stub(this.oCDMService, "getCachedVizTypes").resolves({
                cachedVizType: {}
            });
            this.oCDMService._oOriginalSite = {
                visualizations: {},
                vizTypes: {},
                pages: {}
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Adds newly retrieved visualizations & vizTypes to the CDM site & returns a cloned copy of the requested page", function (assert) {
        // Act
        return this.oCDMService._getPageFromAdapter(this.sPageIdMock)
            .then(function (oPage) {
                // Assert
                assert.deepEqual(oPage, this.oPageMock, "returned the correct result");

                var oExpectedSiteVisualizations = { cachedVisualization: {} };
                var oExpectedSiteVizTypes = { cachedVizType: {} };
                assert.deepEqual(this.oCDMService._oOriginalSite.pages[this.sPageIdMock], this.oPageMock, "saved the correct result");
                assert.deepEqual(this.oCDMService._oOriginalSite.visualizations, oExpectedSiteVisualizations, "added the correct visualizations to the CDM site");
                assert.deepEqual(this.oCDMService._oOriginalSite.vizTypes, oExpectedSiteVizTypes, "added the correct vizTypes to the CDM site");
            }.bind(this));
    });

    QUnit.test("Returns page via site fallback", function (assert) {
        // Arrange
        delete this.oCDMService._oAdapter.getPage;
        this.oCDMService._oOriginalSite.pages[this.sPageIdMock] = this.oPageMock;
        // Act
        return this.oCDMService._getPageFromAdapter(this.sPageIdMock)
            .then(function (oPage) {
                // Assert
                assert.deepEqual(oPage, this.oPageMock, "returned the correct result");

                assert.deepEqual(this.oCDMService._oOriginalSite.pages[this.sPageIdMock], this.oPageMock, "saved the correct result");
            }.bind(this));
    });

    QUnit.test("Rejects when getPage fails", function (assert) {
        // Arrange
        this.oGetPageStub.withArgs(this.sPageIdMock).rejects();
        // Act
        return this.oCDMService._getPageFromAdapter(this.sPageIdMock)
            .then(function () {
                assert.ok(false, "promise should have been rejected");
            })
            .catch(function () {
                // Assert
                assert.ok(true, "promise rejected");
            });
    });

    QUnit.module("getPages", {
        beforeEach: function () {
            this.oPageMock = { id: "validPageId" };
            this.oMyPageMock = { id: "myHomePageId" };
            this.oPagesMock = {
                validPageId: this.oPageMock,
                myHomePageId: this.oMyPageMock
            };
            this.oPersonalizedPageMock = { id: "validPageId", personalized: true };
            this.oPersonalizedMyPageMock = { id: "myHomePageId", personalized: true };
            this.oConfigStub = sandbox.stub(Config, "last");
            this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(true);
            this.oConfigStub.withArgs("/core/spaces/myHome/enabled").returns(true);
            this.oConfigStub.withArgs("/core/spaces/myHome/myHomePageId").returns("myHomePageId");

            this.oGetPagesFromAdapterStub = sandbox.stub(CommonDataModel.prototype, "_getPagesFromAdapter");
            this.oGetPagesFromAdapterStub.callsFake(function (aPageIds) {
                var oPages = {};
                aPageIds.forEach(function (sPageId) {
                    oPages[sPageId] = this.oPagesMock[sPageId];
                }.bind(this));
                return Promise.resolve(oPages);
            }.bind(this));

            this.oApplyPagePersonalizationStub = sandbox.stub(CommonDataModel.prototype, "_applyPagePersonalization");
            this.oApplyPagePersonalizationStub.callsFake(function (oPage) {
                if (oPage) {
                    oPage.personalized = true;
                }
                return Promise.resolve(oPage);
            });

            this.oCDMService = new CommonDataModel({
                getSite: sandbox.stub().returns(new jQuery.Deferred().resolve({}).promise()),
                getPersonalization: sandbox.stub().returns(new jQuery.Deferred().resolve(this.oPersonalizedMock).promise())
            });
            this.oCDMService._oPersonalizedPages = {};
            this.oMigratePersonalizedPagesStub = sandbox.stub(this.oCDMService, "_migratePersonalizedPages")
                .callsFake((args) => Promise.resolve(args));
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resolves a list of personalized pages, when personalization is enabled", function (assert) {
        // Arrange
        // Act
        return this.oCDMService.getPages(["validPageId"])
            .then(function (aPages) {
                assert.deepEqual(aPages, [this.oPersonalizedPageMock], "Returned the correct result");
                assert.strictEqual(this.oGetPagesFromAdapterStub.callCount, 1, "_getPagesFromAdapter was called once");
                assert.strictEqual(this.oApplyPagePersonalizationStub.callCount, 1, "_applyPagePersonalization was not called");
            }.bind(this));
    });

    QUnit.test("Resolves a list of pages without personalization, when personalization is disabled", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);
        // Act
        return this.oCDMService.getPages(["validPageId"])
            .then(function (aPages) {
                assert.deepEqual(aPages, [this.oPageMock], "Returned the correct result");
                assert.strictEqual(this.oGetPagesFromAdapterStub.callCount, 1, "_getPagesFromAdapter was called once");
                assert.strictEqual(this.oApplyPagePersonalizationStub.callCount, 0, "_applyPagePersonalization was not called");
            }.bind(this));
    });

    QUnit.test("Filters undefined pages out", function (assert) {
        // Arrange
        // Act
        return this.oCDMService.getPages(["validPageId", "undefinedPageId"])
            .then(function (aPages) {
                assert.deepEqual(aPages, [this.oPageMock], "Returned the correct result");
            }.bind(this));
    });

    QUnit.test("Rejects if gathering the page fails", function (assert) {
        // Arrange
        var sExpectedMessage = "CommonDataModel Service: Cannot get pages";
        this.oGetPagesFromAdapterStub.rejects();
        // Act
        return this.oCDMService.getPages(["validPageId"])
            .then(function () {
                // Assert
                assert.ok(false, "promise should have been rejected");
            })
            .catch(function (sMessage) {
                assert.strictEqual(sMessage, sExpectedMessage, "rejected with the correct message");
            });
    });

    QUnit.test("Rejects if personalization mixin fails", function (assert) {
        // Arrange
        var sExpectedMessage = "Personalization Processor: Cannot mixin the personalization.";
        this.oApplyPagePersonalizationStub.rejects();
        // Act
        return this.oCDMService.getPages(["validPageId"])
            .then(function () {
                // Assert
                assert.ok(false, "promise should have been rejected");
            })
            .catch(function (sMessage) {
                assert.strictEqual(sMessage, sExpectedMessage, "rejected with the correct message");
            });
    });

    QUnit.test("Resolves the same page if it was already loaded", function (assert) {
        // Arrange
        var oPersonalizedPage = {
            id: "cachedPage",
            personalized: true
        };
        this.oCDMService._oPersonalizedPages.cachedPage = oPersonalizedPage;
        // Act
        return this.oCDMService.getPages(["validPageId", "cachedPage"])
            .then(function (aPages) {
                // Assert
                assert.strictEqual(aPages[1], oPersonalizedPage, "Resolved with the correct page object");
            });
    });

    QUnit.test("Resolves a list of pages without personalization, when personalization is disabled and myHome is disabled", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);
        this.oConfigStub.withArgs("/core/spaces/myHome/enabled").returns(false);
        // Act
        return this.oCDMService.getPages(["validPageId", "myHomePageId"])
            .then(function (aPages) {
                assert.deepEqual(aPages, [this.oPageMock, this.oMyPageMock], "Returned the correct result");
                assert.strictEqual(this.oGetPagesFromAdapterStub.callCount, 1, "_getPagesFromAdapter was called once");
                assert.strictEqual(this.oApplyPagePersonalizationStub.callCount, 0, "_applyPagePersonalization was not called");
            }.bind(this));
    });

    QUnit.test("Resolves myHome page with personalization, when personalization is disabled and myHome is enabled", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);
        this.oConfigStub.withArgs("/core/spaces/myHome/enabled").returns(true);
        // Act
        return this.oCDMService.getPages(["validPageId", "myHomePageId"])
            .then(function (aPages) {
                assert.deepEqual(aPages, [this.oPageMock, this.oPersonalizedMyPageMock], "Returned the correct result");
                assert.strictEqual(this.oGetPagesFromAdapterStub.callCount, 1, "_getPagesFromAdapter was called once");
                assert.strictEqual(this.oApplyPagePersonalizationStub.callCount, 1, "_applyPagePersonalization was called once");
            }.bind(this));
    });

    QUnit.test("Migrates a personalized page, when personalization is enabled", function (assert) {
        // Arrange
        var aMigratedPages = [{ id: "migratedPage" }];
        this.oMigratePersonalizedPagesStub.withArgs([this.oPersonalizedPageMock]).resolves(aMigratedPages);
        // Act
        return this.oCDMService.getPages(["validPageId"])
            .then(function (aPages) {
                // Assert
                assert.deepEqual(aPages, aMigratedPages, "resolved the correct page");
                assert.strictEqual(this.oMigratePersonalizedPagesStub.callCount, 1, "_migratePersonalizedPages was called once");
            }.bind(this));
    });

    QUnit.test("Resolves the same promise if the load of the requested pages are started. ", function (assert) {
        // Arrange
        // Act
        var pCallOne = this.oCDMService.getPages(["validPageId", "cachedPage"]);
        var pCallTwo = this.oCDMService.getPages(["validPageId", "cachedPage"]);
        assert.strictEqual(pCallOne, pCallTwo, "Same Promise is returned for the same requested page IDs.");
    });

    QUnit.test("Resolves a different promise for different page IDs requested.", function (assert) {
        // Act
        var pCallOne = this.oCDMService.getPages(["validPageId"]);
        var pCallTwo = this.oCDMService.getPages(["validPageId", "cachedPage"]);
        assert.notStrictEqual(pCallOne, pCallTwo, "Same Promise is returned for the same requested page IDs.");
    });

    QUnit.module("_getPagesFromAdapter", {
        beforeEach: function () {
            this.aPageIdsMock = ["firstPage", "secondPage"];
            this.oPagesMock = {
                firstPage: { identification: { id: "firstPage" } },
                secondPage: { identification: { id: "secondPage" } }
            };

            this.oGetPagesStub = sandbox.stub();
            this.oGetPagesStub.withArgs(this.aPageIdsMock).resolves(this.oPagesMock);
            this.oCDMService = new CommonDataModel({
                getSite: sandbox.stub().returns(new jQuery.Deferred().resolve({}).promise()),
                getPersonalization: sandbox.stub().returns(new jQuery.Deferred()),
                getPages: this.oGetPagesStub
            });
            this.oGetCachedVisualizationsStub = sandbox.stub(this.oCDMService, "getCachedVisualizations").resolves({
                cachedVisualization: {}
            });
            this.oGetCachedVizTypesStub = sandbox.stub(this.oCDMService, "getCachedVizTypes").resolves({
                cachedVizType: {}
            });
            this.oCDMService._oOriginalSite = {
                visualizations: {},
                vizTypes: {},
                pages: {}
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Adds newly retrieved visualizations & vizTypes to the CDM site & returns a cloned copy of the requested pages", function (assert) {
        // Act
        return this.oCDMService._getPagesFromAdapter(this.aPageIdsMock)
            .then(function (oPages) {
                // Assert
                assert.deepEqual(oPages, this.oPagesMock, "returned the correct result");

                var oExpectedSiteVisualizations = { cachedVisualization: {} };
                var oExpectedSiteVizTypes = { cachedVizType: {} };
                assert.deepEqual(this.oCDMService._oOriginalSite.pages.firstPage, this.oPagesMock.firstPage, "added the correct page to the CDM site");
                assert.deepEqual(this.oCDMService._oOriginalSite.pages.secondPage, this.oPagesMock.secondPage, "added the correct page to the CDM site");
                assert.deepEqual(this.oCDMService._oOriginalSite.visualizations, oExpectedSiteVisualizations, "added the correct visualizations to the CDM site");
                assert.deepEqual(this.oCDMService._oOriginalSite.vizTypes, oExpectedSiteVizTypes, "added the correct vizTypes to the CDM site");
            }.bind(this));
    });

    QUnit.test("Returns page via site fallback", function (assert) {
        // Arrange
        delete this.oCDMService._oAdapter.getPages;
        this.oCDMService._oOriginalSite.pages = this.oPagesMock;
        // Act
        return this.oCDMService._getPagesFromAdapter(this.aPageIdsMock)
            .then(function (oPages) {
                // Assert
                assert.deepEqual(oPages, this.oPagesMock, "returned the correct result");
                assert.deepEqual(this.oCDMService._oOriginalSite.pages.firstPage, this.oPagesMock.firstPage, "added the correct page to the CDM site");
                assert.deepEqual(this.oCDMService._oOriginalSite.pages.secondPage, this.oPagesMock.secondPage, "added the correct page to the CDM site");
            }.bind(this));
    });

    QUnit.test("Rejects when getPages fails", function (assert) {
        // Arrange
        this.oGetPagesStub.withArgs(this.aPageIdsMock).rejects();
        // Act
        return this.oCDMService._getPagesFromAdapter(this.aPageIdsMock)
            .then(function () {
                assert.ok(false, "promise should have been rejected");
            })
            .catch(function () {
                // Assert
                assert.ok(true, "promise rejected");
            });
    });

    QUnit.module("getAllPages", {
        beforeEach: function () {
            var oMockAdapter = {
                getSite: function () {
                    return new jQuery.Deferred().resolve({}).promise();
                },
                getPersonalization: sandbox.stub().returns(new jQuery.Deferred().resolve().promise())
            };
            this.aPages = [];

            this.oGetServiceAsyncStub = sandbox.stub();
            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceAsyncStub);

            // The menu service returns content nodes
            this.oGetContentNodesStub = sandbox.stub().resolves([
                {
                    id: "space1",
                    label: "Space 1",
                    type: "Space",
                    isContainer: false,
                    children: [{
                        id: "page1",
                        label: "Page 1",
                        type: "Page",
                        isContainer: true,
                        children: []
                    }, {
                        id: "page2",
                        label: "Page 2",
                        type: "Page",
                        isContainer: true,
                        children: []
                    }]
                },
                {
                    id: "space2",
                    label: "Space 2",
                    type: "Space",
                    isContainer: false,
                    children: [{
                        id: "page3",
                        label: "Page 3",
                        type: "Page",
                        isContainer: true,
                        children: []
                    }, {
                        id: "page3",
                        label: "Page 3",
                        type: "Page",
                        isContainer: true,
                        children: []
                    }, {
                        id: "page4",
                        label: "Page 4",
                        type: "Page",
                        isContainer: true,
                        children: []
                    }]
                }
            ]);
            this.oGetServiceAsyncStub.withArgs("Menu").resolves({
                getContentNodes: this.oGetContentNodesStub
            });

            this.oCDMService = new CommonDataModel(oMockAdapter);

            this.oGetAllPersonalizedPagesStub = sandbox.stub(this.oCDMService, "_getAllPersonalizedPages");
            this.oGetAllPersonalizedPagesStub.resolves(this.aPages);
            this.oGetPagesStub = sandbox.stub(this.oCDMService, "getPages");
            this.oGetPagesStub.resolves(this.aPages);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resolves with the correct result", function (assert) {
        // Arrange
        var aExpectedGetPagesArgs = ["page1", "page2", "page3", "page4"];
        // Act
        return this.oCDMService.getAllPages().then(function (aResult) {
            // Assert
            assert.strictEqual(aResult, this.aPages, "returned correct result");
            assert.strictEqual(this.oGetContentNodesStub.callCount, 1, "getContentNodes() was called once");
            assert.strictEqual(this.oGetPagesStub.callCount, 1, "getPages was called once");
            assert.deepEqual(this.oGetPagesStub.getCall(0).args, [aExpectedGetPagesArgs], "getPages was called with correct parameters");
        }.bind(this));
    });

    QUnit.test("Resolves with the correct result when filtered for personalized pages ", function (assert) {
        // Act
        return this.oCDMService.getAllPages({ personalizedPages: true }).then(function (aResult) {
            // Assert
            assert.strictEqual(aResult, this.aPages, "returned correct result");
            assert.strictEqual(this.oGetAllPersonalizedPagesStub.callCount, 1, "_getAllPersonalizedPages was called once");
        }.bind(this));
    });

    QUnit.test("Rejects if menu service is not available", function (assert) {
        // Arrange
        this.oGetServiceAsyncStub.withArgs("Menu").rejects();
        // Act
        return this.oCDMService.getAllPages()
            .then(function () {
                // Assert
                assert.ok(false, "promise should have rejected");
            })
            .catch(function () {
                // Assert
                assert.ok(true, "promise rejected");
            });
    });

    QUnit.module("getApplications", {
        beforeEach: function () {
            var oMockAdapter = {
                getSite: function () {
                    return new jQuery.Deferred().resolve({}).promise();
                },
                getPersonalization: sandbox.stub().returns(new jQuery.Deferred().resolve().promise())
            };
            this.oCDMService = new CommonDataModel(oMockAdapter);
        }
    });

    QUnit.test("Resolves with all applications defined in the Common Data Model", function (assert) {
        // Arrange
        this.oCDMService._oSiteDeferred = new jQuery.Deferred().resolve({
            _version: "3.1.0",
            applications: {
                "sap.ushell.demo.AppNavSample": {
                    "sap.app": {
                        id: "sap.ushell.demo.AppNavSample",
                        title: "Demo actual title AppNavSample",
                        subTitle: "AppNavSample",
                        ach: "CA-UI2-INT-FE",
                        applicationVersion: { version: "1.0.0" }
                    },
                    "sap.flp": { type: "application" },
                    "sap.ui": {
                        technology: "UI5",
                        icons: { icon: "sap-icon://Fiori2/F0018" },
                        deviceTypes: {
                            desktop: true,
                            tablet: false,
                            phone: false
                        }
                    },
                    "sap.ui5": { componentName: "sap.ushell.demo.AppNavSample" }
                },
                "sap.ushell.demo.AppPersSample": {
                    "sap.app": {
                        id: "sap.ushell.demo.AppPersSample",
                        title: "Demo actual title AppPersSample",
                        subTitle: "AppPersSample",
                        ach: "CA-UI2-INT-FE",
                        applicationVersion: {
                            version: "1.0.0"
                        }
                    },
                    "sap.flp": { type: "application" },
                    "sap.ui": {
                        technology: "UI5",
                        icons: { icon: "sap-icon://Fiori2/F0018" },
                        deviceTypes: {
                            desktop: true,
                            tablet: false,
                            phone: false
                        }
                    },
                    "sap.ui5": { componentName: "sap.ushell.demo.AppPersSample" }
                }
            }
        }).promise();

        var oExpectedApplications = {
            "sap.ushell.demo.AppNavSample": {
                "sap.app": {
                    id: "sap.ushell.demo.AppNavSample",
                    title: "Demo actual title AppNavSample",
                    subTitle: "AppNavSample",
                    ach: "CA-UI2-INT-FE",
                    applicationVersion: { version: "1.0.0" }
                },
                "sap.flp": { type: "application" },
                "sap.ui": {
                    technology: "UI5",
                    icons: { icon: "sap-icon://Fiori2/F0018" },
                    deviceTypes: {
                        desktop: true,
                        tablet: false,
                        phone: false
                    }
                },
                "sap.ui5": { componentName: "sap.ushell.demo.AppNavSample" }
            },
            "sap.ushell.demo.AppPersSample": {
                "sap.app": {
                    id: "sap.ushell.demo.AppPersSample",
                    title: "Demo actual title AppPersSample",
                    subTitle: "AppPersSample",
                    ach: "CA-UI2-INT-FE",
                    applicationVersion: { version: "1.0.0" }
                },
                "sap.flp": { type: "application" },
                "sap.ui": {
                    technology: "UI5",
                    icons: { icon: "sap-icon://Fiori2/F0018" },
                    deviceTypes: {
                        desktop: true,
                        tablet: false,
                        phone: false
                    }
                },
                "sap.ui5": { componentName: "sap.ushell.demo.AppPersSample" }
            }
        };

        // Act
        return this.oCDMService.getApplications().then(function (oApplications) {
            // Assert
            assert.deepEqual(oApplications, oExpectedApplications, "The function resolves with all CDM applications.");
        });
    });

    QUnit.test("Rejects with an error message if the Common Data Model doesn't have any applications", function (assert) {
        var fnDone = assert.async();
        // Act
        this.oCDMService.getApplications()
            .catch(function (sErrorMessage) {
                // Assert
                assert.strictEqual(sErrorMessage, "CDM applications not found.", "The function rejects with the error message 'CDM applications not found.'.");
            })
            .finally(fnDone);
    });

    QUnit.test("Rejects if the CDM site jQuery Deferred promise is rejected", function (assert) {
        // Arrange
        this.oCDMService._oSiteDeferred = new jQuery.Deferred().reject("CDM Site promise rejected").promise();

        // Act
        return this.oCDMService.getApplications().catch(function (sErrorMessage) {
            // Assert
            assert.strictEqual(sErrorMessage, "CDM Site promise rejected", "The function rejects if the CDM site promise fails.");
        });
    });

    QUnit.module("getVizTypes", {
        beforeEach: function () {
            this.oGetVizTypesStub = sandbox.stub().resolves({
                vizType1: {},
                vizType2: {}
            });
            var oMockAdapter = {
                getSite: function () {
                    return new jQuery.Deferred().resolve({}).promise();
                },
                getPersonalization: sandbox.stub().returns(new jQuery.Deferred().resolve().promise()),
                getVizTypes: this.oGetVizTypesStub
            };
            this.oCDMService = new CommonDataModel(oMockAdapter);
            this.oGetCachedVizTypesStub = sandbox.stub(this.oCDMService, "getCachedVizTypes").resolves({
                cachedVizType: {}
            });
            this.oGetSitePropertyStub = sandbox.stub(this.oCDMService, "_getSiteProperty").rejects();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls the adapter function and merges the result into the CDM site", function (assert) {
        // Arrange
        this.oGetSitePropertyStub.withArgs("vizTypes").resolves({
            standardVizType: {}
        });

        // Act
        return this.oCDMService.getVizTypes().then(function (oResult) {
            assert.strictEqual(this.oGetSitePropertyStub.firstCall.args[0], "vizTypes", "The function retrieved the current vizTypes from the CDM site.");
            assert.strictEqual(this.oGetVizTypesStub.callCount, 1, "The adapter function was called once.");
            assert.strictEqual(this.oGetCachedVizTypesStub.callCount, 0, "The fallback function wasn't called.");
            var oExpectedVizTypes = {
                standardVizType: {},
                vizType1: {},
                vizType2: {}
            };
            assert.deepEqual(oResult, oExpectedVizTypes, "Returned the expected vizTypes.");
        }.bind(this));
    });

    QUnit.test("Fallback to cached viz types if the adapter doesn't provide a getVizTypes function", function (assert) {
        // Arrange
        delete this.oCDMService._oAdapter.getVizTypes;

        // Act
        return this.oCDMService.getVizTypes().then(function (oResult) {
            assert.strictEqual(this.oGetCachedVizTypesStub.callCount, 1, "The fallback getCachedVizTypes function was called once.");
            var oExpectedVizTypes = { cachedVizType: {} };
            assert.deepEqual(oResult, oExpectedVizTypes, "Returned the cached results from the fallback function.");
        }.bind(this));
    });

    QUnit.module("getCachedVizTypes", {
        beforeEach: function () {
            var oAdapterMock = {
                getSite: function () {
                    return new jQuery.Deferred().resolve({}).promise();
                },
                getPersonalization: sandbox.stub().returns(new jQuery.Deferred().resolve().promise())
            };
            this.oCDMService = new CommonDataModel(oAdapterMock);
            this.oGetSitePropertyStub = sandbox.stub(this.oCDMService, "_getSiteProperty").withArgs("vizTypes").resolves({
                standardVizType: {}
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resolves with the correct vizTypes", function (assert) {
        // Act
        return this.oCDMService.getCachedVizTypes().then(function (oResult) {
            // Assert
            assert.strictEqual(this.oGetSitePropertyStub.firstCall.args[0], "vizTypes", "The function retrieved the current vizTypes from the CDM site.");
            var oExpectedVizTypes = { standardVizType: {} };
            assert.deepEqual(oResult, oExpectedVizTypes, "Returned the correct vizTypes.");
        }.bind(this));
    });

    QUnit.test("Calls the adapter function if it exists and merges its result into the CDM site", function (assert) {
        // Arrange
        this.oCDMService._oAdapter.getCachedVizTypes = sandbox.stub().resolves({
            cachedVizType: {}
        });

        // Act
        return this.oCDMService.getCachedVizTypes().then(function (oResult) {
            // Assert
            assert.strictEqual(this.oGetSitePropertyStub.firstCall.args[0], "vizTypes", "The function retrieved the current vizTypes from the CDM site.");
            var oExpectedVizTypes = {
                standardVizType: {},
                cachedVizType: {}
            };
            assert.deepEqual(oResult, oExpectedVizTypes, "Returned the merged vizTypes.");
        }.bind(this));
    });

    QUnit.module("getVisualizations", {
        beforeEach: function () {
            this.oGetVisualizationsStub = sandbox.stub().resolves({
                VisualizationOne: {},
                VisualizationTwo: {}
            });
            var oMockAdapter = {
                getSite: function () {
                    return new jQuery.Deferred().resolve({}).promise();
                },
                getPersonalization: sandbox.stub().returns(new jQuery.Deferred().resolve().promise()),
                getVisualizations: this.oGetVisualizationsStub
            };
            this.oCDMService = new CommonDataModel(oMockAdapter);
            this.oGetCachedVisualizations = sandbox.stub(this.oCDMService, "getCachedVisualizations").resolves({
                CachedVisualization: {}
            });
            this.oGetSitePropertyStub = sandbox.stub(this.oCDMService, "_getSiteProperty").rejects();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls the adapter function and merges the result into the CDM site", function (assert) {
        // Arrange
        this.oGetSitePropertyStub.withArgs("visualizations").resolves({
            CustomVisualization: {}
        });

        // Act
        return this.oCDMService.getVisualizations().then(function (oResult) {
            assert.strictEqual(this.oGetSitePropertyStub.firstCall.args[0], "visualizations", "The function retrieved the current visualizations from the CDM site.");
            assert.strictEqual(this.oGetVisualizationsStub.callCount, 1, "The adapter function was called once.");
            assert.strictEqual(this.oGetCachedVisualizations.callCount, 0, "The fallback function wasn't called.");
            var oExpectedVisualizations = {
                CustomVisualization: {},
                VisualizationOne: {},
                VisualizationTwo: {}
            };
            assert.deepEqual(oResult, oExpectedVisualizations, "Returned the expected visualizations.");
        }.bind(this));
    });

    QUnit.test("Fallback to cached visualizations if the adapter doesn't provide a getVisualizations function", function (assert) {
        // Arrange
        delete this.oCDMService._oAdapter.getVisualizations;

        // Act
        return this.oCDMService.getVisualizations().then(function (oResult) {
            assert.strictEqual(this.oGetCachedVisualizations.callCount, 1, "The fallback getCachedVisualizations function was called once.");
            var oExpectedVizTypes = {
                CachedVisualization: {}
            };
            assert.deepEqual(oResult, oExpectedVizTypes, "Returned the cached results from the fallback function.");
        }.bind(this));
    });

    QUnit.module("getCachedVisualizations", {
        beforeEach: function () {
            var oMockAdapter = {
                getSite: function () {
                    return new jQuery.Deferred().resolve({}).promise();
                },
                getPersonalization: sandbox.stub().returns(new jQuery.Deferred().resolve().promise())
            };
            this.oCDMService = new CommonDataModel(oMockAdapter);
            this.oGetSitePropertyStub = sandbox.stub(this.oCDMService, "_getSiteProperty").withArgs("visualizations").resolves({
                OverloadedApp1: {
                    vizType: "sap.ushell.StaticAppLauncher",
                    businessApp: "OverloadedApp1.BusinessApp",
                    vizConfig: {
                        "sap.flp": {
                            target: {
                                appId: "OverloadedApp1",
                                inboundId: "Overloaded-start"
                            }
                        }
                    }
                }
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resolves with the correct visualizations", function (assert) {
        // Act
        return this.oCDMService.getCachedVisualizations().then(function (oVisualizations) {
            // Assert
            assert.strictEqual(this.oGetSitePropertyStub.firstCall.args[0], "visualizations", "The function retrieved the current visualizations from the CDM site.");
            var oExpectedVisualizations = {
                OverloadedApp1: {
                    vizType: "sap.ushell.StaticAppLauncher",
                    businessApp: "OverloadedApp1.BusinessApp",
                    vizConfig: {
                        "sap.flp": {
                            target: {
                                appId: "OverloadedApp1",
                                inboundId: "Overloaded-start"
                            }
                        }
                    }
                }
            };
            assert.deepEqual(oVisualizations, oExpectedVisualizations, "The function resolves with all CDM visualizations.");
        }.bind(this));
    });

    QUnit.test("Calls the adapter function if it exists and returns the result", function (assert) {
        // Arrange
        this.oCDMService._oAdapter.getCachedVisualizations = sandbox.stub().resolves({
            OverloadedApp2: {
                vizType: "sap.ushell.StaticAppLauncher",
                businessApp: "OverloadedApp2.BusinessApp",
                vizConfig: {
                    "sap.flp": {
                        target: {
                            appId: "OverloadedApp2",
                            inboundId: "Overloaded-start"
                        }
                    }
                }
            }
        });

        // Act
        return this.oCDMService.getCachedVisualizations().then(function (oResult) {
            assert.strictEqual(this.oGetSitePropertyStub.firstCall.args[0], "visualizations", "The function retrieved the current visualizations from the CDM site.");
            var oExpectedVisualizations = {
                OverloadedApp1: {
                    vizType: "sap.ushell.StaticAppLauncher",
                    businessApp: "OverloadedApp1.BusinessApp",
                    vizConfig: {
                        "sap.flp": {
                            target: {
                                appId: "OverloadedApp1",
                                inboundId: "Overloaded-start"
                            }
                        }
                    }
                },
                OverloadedApp2: {
                    vizType: "sap.ushell.StaticAppLauncher",
                    businessApp: "OverloadedApp2.BusinessApp",
                    vizConfig: {
                        "sap.flp": {
                            target: {
                                appId: "OverloadedApp2",
                                inboundId: "Overloaded-start"
                            }
                        }
                    }
                }
            };
            assert.deepEqual(oResult, oExpectedVisualizations, "Returned the merged visualizations.");
        }.bind(this));
    });

    QUnit.module("getOriginalPage", {
        beforeEach: function () {
            this.oGetSiteStub = sandbox.stub().returns(new jQuery.Deferred().resolve({
                _version: "3.1.0",
                pages: { page1: { identification: { id: "page1" } } }
            }).promise());
            this.oCDMService = new CommonDataModel({
                getSite: this.oGetSiteStub
            });
        }
    });

    QUnit.test("returns the page", function (assert) {
        var oExpectedPage = { identification: { id: "page1" } };
        var oReturnedPage = this.oCDMService.getOriginalPage("page1");
        assert.deepEqual(oExpectedPage, oReturnedPage, "The correct page was returned");
    });

    QUnit.module("save", {
        beforeEach: function () {
            this.oGetSiteStub = sandbox.stub().returns(new jQuery.Deferred());
            this.oGetPersonalizationDeferred = new jQuery.Deferred();
            this.oGetPersonalizationStub = sandbox.stub().returns(this.oGetPersonalizationDeferred.promise());
            this.oSetPersonalizationDeferred = new jQuery.Deferred();
            this.oSetPersonalizationStub = sandbox.stub().returns(this.oSetPersonalizationDeferred.promise());

            this.oCDMService = new CommonDataModel({
                getSite: this.oGetSiteStub,
                getPersonalization: this.oGetPersonalizationStub,
                setPersonalization: this.oSetPersonalizationStub
            });

            this.oExtractPersonalizationDeferred = new jQuery.Deferred();
            this.oExtractPersonalizationStub = sandbox.stub(this.oCDMService._oPersonalizationProcessor, "extractPersonalization");
            this.oExtractPersonalizationStub.returns(this.oExtractPersonalizationDeferred.promise());

            this.oConvertToStub = sandbox.stub(this.oCDMService._oSiteConverter, "convertTo").callsFake(function (_version, page) {
                return page;
            });

            this.oCDMService._oPersonalizedPages = {};
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("3.0: Resolves and does not save if personalization delta is empty", function (assert) {
        // Arrange
        var done = assert.async();
        this.oExtractPersonalizationDeferred.resolve();

        // Act & Assert
        this.oCDMService.save()
            .done(function () {
                assert.strictEqual(this.oSetPersonalizationStub.callCount, 0, "setPersonalization was not called.");
                assert.strictEqual(this.oExtractPersonalizationStub.callCount, 1, "extractPersonalization was called once.");
            }.bind(this))
            .fail(function (e) {
                assert.ok(false, "Promise was resolved");
            })
            .always(done);
    });

    QUnit.test("3.0: Rejects if setPersonalization fails", function (assert) {
        // Arrange
        var done = assert.async();
        this.oSetPersonalizationDeferred.reject("Promise rejected due to any reason.");
        this.oExtractPersonalizationDeferred.resolve({ foo: "bar" });

        // Act & Assert
        this.oCDMService.save()
            .done(function () {
                assert.ok(false, "Promise was rejected");
            })
            .fail(function (sMessage) {
                assert.strictEqual(this.oSetPersonalizationStub.callCount, 1, "setPersonalization was called once.");
                assert.strictEqual(this.oExtractPersonalizationStub.callCount, 1, "extractPersonalization was called once.");
                assert.strictEqual(sMessage, "Promise rejected due to any reason.", "fail message is correct.");
            }.bind(this))
            .always(done);
    });

    QUnit.test("3.0: Rejects if personalization cannot be extracted", function (assert) {
        // Arrange
        var done = assert.async();
        this.oCDMService._oOriginalSite = {
            _version: "3.0.0",
            someProp: "someVal"
        };

        this.oExtractPersonalizationDeferred.reject();

        // Act & Assert
        this.oCDMService.save("SomeSite")
            .done(function () {
                assert.ok(false, "Promise was rejected");
            })
            .fail(function (error) {
                assert.strictEqual(error, "Personalization Processor: Cannot extract personalization.", "Promise was rejected with the proper error message");
            })
            .always(done);
    });

    QUnit.test("3.1: Resolves if the personalization was successfully saved", function (assert) {
        // Arrange
        var done = assert.async();
        this.oCDMService._oOriginalSite = {
            _version: "3.1.0",
            someProp: "someVal",
            pages: { SomePage: { SomePageProp: "Val" } }
        };

        this.oExtractPersonalizationDeferred.resolve("SomeExtractedPers");
        this.oSetPersonalizationDeferred.resolve();

        var oExpectedPersonalizationContainer = {
            version: "3.1.0",
            _version: "3.1.0",
            SomePage: "SomeExtractedPers"
        };

        // Act & Assert
        this.oCDMService.save("SomePage")
            .done(function () {
                assert.strictEqual(this.oGetSiteStub.callCount, 1, "getSite was called");
                assert.deepEqual(this.oExtractPersonalizationStub.firstCall.args[0], undefined, "extractPersonalization was called with the proper personalized page");
                assert.deepEqual(this.oExtractPersonalizationStub.firstCall.args[1], this.oCDMService._oOriginalSite.pages.SomePage, "extractPersonalization was called with the proper page");
                assert.deepEqual(this.oSetPersonalizationStub.firstCall.args[0], oExpectedPersonalizationContainer, "setPersonalization was called with the expected personalization");
            }.bind(this))
            .fail(function (error) {
                assert.ok(false, "Promise was resolved");
            })
            .always(done);
    });

    QUnit.test("3.1: Resolves and saves correct personalization delta", function (assert) {
        // Arrange
        var done = assert.async();
        this.oCDMService._oOriginalSite = {
            _version: "3.1.0",
            originalProperty: "foo",
            pages: {}
        };

        this.oExtractPersonalizationDeferred.resolve({ foo: "bar" });
        this.oSetPersonalizationDeferred.resolve();

        var oExpectedPersonalizationDelta = { foo: "bar" };
        var oExpectedPersonalizationDeltaMap = {
            version: "3.1.0",
            _version: "3.1.0",
            page1: oExpectedPersonalizationDelta
        };

        // Act & Assert
        this.oCDMService.save("page1")
            .done(function () {
                assert.strictEqual(this.oExtractPersonalizationStub.callCount, 1, "extractPersonalization was called once.");
                assert.deepEqual(this.oSetPersonalizationStub.firstCall.args[0], oExpectedPersonalizationDeltaMap, "setPersonalization was called with correct personalization delta.");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "Promise was resolved");
            })
            .always(done);
    });

    QUnit.test("3.1: Resolves and does not save if no personalization delta is empty", function (assert) {
        // Arrange
        var done = assert.async();
        this.oCDMService._oOriginalSite = {
            _version: "3.1.0",
            someProp: "someVal",
            pages: { SomePage: { SomePageProp: "Val" } }
        };

        this.oExtractPersonalizationDeferred.resolve();

        // Act & Assert
        this.oCDMService.save("SomePage")
            .done(function () {
                assert.strictEqual(this.oSetPersonalizationStub.callCount, 0, "setPersonalization was not called");
            }.bind(this))
            .fail(function (error) {
                assert.ok(false, "Promise was resolved");
            })
            .always(done);
    });

    QUnit.test("3.1: Rejects if no page id was provided", function (assert) {
        // Arrange
        var done = assert.async();
        this.oCDMService._oOriginalSite = {
            _version: "3.1.0"
        };

        // Act & Assert
        this.oCDMService.save()
            .done(function () {
                assert.ok(false, "Promise was rejected");
            })
            .fail(function (error) {
                assert.strictEqual(error, "No page id was provided", "Promise was rejected with the proper error message");
            })
            .always(done);
    });

    QUnit.test("3.1: Rejects if the setPersonalization fails", function (assert) {
        // Arrange
        var done = assert.async();
        this.oCDMService._oOriginalSite = {
            _version: "3.1.0",
            someProp: "someVal",
            pages: { SomePage: { SomePageProp: "Val" } }
        };

        this.oExtractPersonalizationDeferred.resolve("SomeExtractedPers");
        this.oSetPersonalizationDeferred.reject("SomeError");

        // Act & Assert
        this.oCDMService.save("SomeSite")
            .done(function () {
                assert.ok(false, "Promise was rejected");
            })
            .fail(function (error) {
                assert.strictEqual(error, "SomeError", "Promise was rejected with the proper error message");
            })
            .always(done);
    });

    QUnit.test("3.1: Converts single pageId to an array", function (assert) {
        // Arrange
        var done = assert.async();
        this.oCDMService._oOriginalSite = {
            _version: "3.1.0",
            pages: { Page1: {} }
        };

        var oSaveCdmVersion31Spy = sandbox.spy(this.oCDMService, "_saveCdmVersion31");
        this.oSetPersonalizationDeferred.resolve();
        this.oExtractPersonalizationDeferred.resolve();

        // Act & Assert
        this.oCDMService.save("Page1")
            .done(function () {
                assert.deepEqual(oSaveCdmVersion31Spy.firstCall.args[0], ["Page1"], "_saveCdmVersion31 was called correctly");
            })
            .fail(function (error) {
                assert.ok(false, "Promise was resolved");
            })
            .always(done);
    });

    QUnit.test("3.1: Handles multiple pages and saves only once", function (assert) {
        // Arrange
        var done = assert.async();
        this.oCDMService._oOriginalSite = {
            _version: "3.1.0",
            pages: {
                Page1: { id: "Page1" },
                Page2: { id: "Page2" }
            }
        };

        var oPersMock = {
            Page1: { id: "PagePers1" },
            Page2: { id: "PagePers2" }
        };

        var oSaveCdmVersion31Spy = sandbox.spy(this.oCDMService, "_saveCdmVersion31");
        this.oSetPersonalizationDeferred.resolve();
        this.oExtractPersonalizationStub.callsFake(function (oPersonalized, oOriginal) {
            var oPers = oPersMock[oOriginal.id];
            return new jQuery.Deferred().resolve(oPers).promise();
        });

        var oExpectedPersonalization = {
            Page1: { id: "PagePers1" },
            Page2: { id: "PagePers2" },
            _version: "3.1.0",
            version: "3.1.0"
        };

        // Act & Assert
        this.oCDMService.save(["Page1", "Page2"])
            .done(function () {
                assert.deepEqual(oSaveCdmVersion31Spy.firstCall.args[0], ["Page1", "Page2"], "_saveCdmVersion31 was called correctly");
                assert.deepEqual(this.oSetPersonalizationStub.callCount, 1, "setPersonalization was called once");
                assert.deepEqual(this.oSetPersonalizationStub.firstCall.args[0], oExpectedPersonalization, "Saved the correct personalization");
            }.bind(this))
            .fail(function (error) {
                assert.ok(false, "Promise was resolved");
            })
            .always(done);
    });

    QUnit.test("Calls the correct internals if the CDM version does not equal 3.1.0", function (assert) {
        // Arrange
        var done = assert.async();
        this.oCDMService._oOriginalSite = {
            _version: "3.0.0"
        };

        var oSaveCdmVersion30Stub = sandbox.stub(this.oCDMService, "_saveCdmVersion30").resolves();

        // Act & Assert
        this.oCDMService.save()
            .done(function () {
                assert.strictEqual(oSaveCdmVersion30Stub.callCount, 1, "_saveCdmVersion30 was called once");
            })
            .fail(function (error) {
                assert.ok(false, "Promise was resolved");
            })
            .always(done);
    });

    QUnit.test("Rejects if reading the personalization has failed before", function (assert) {
        // Arrange
        var done = assert.async();
        this.oGetPersonalizationDeferred.reject("SomeError");

        // Act & Assert
        this.oCDMService._getPersonalization()
            .then(function () {
                this.oCDMService.save()
                    .done(function () {
                        assert.ok(false, "Promise was resolved");
                    })
                    .fail(function (sErrorMessage) {
                        assert.strictEqual(this.oSetPersonalizationStub.callCount, 0, "setPersonalization was not called");
                        assert.ok(sErrorMessage.length > 0, "An error message was returned");
                    }.bind(this))
                    .always(done);
            }.bind(this));
    });

    QUnit.module("_saveCdmVersion31", {
        beforeEach: function () {
            this.oGetSiteStub = sandbox.stub().returns(new jQuery.Deferred());
            this.oSetPersonalizationStub = sandbox.stub().returns(new jQuery.Deferred().resolve().promise());

            this.oCDMService = new CommonDataModel({
                getSite: this.oGetSiteStub,
                setPersonalization: this.oSetPersonalizationStub
            });
            this.oCDMService._oPersonalizedPages = {};
            this.oCDMService._oOriginalSite = {
                _version: "3.1.0",
                pages: {
                    brokenPers: { id: "brokenPers" },
                    emptyPers: { id: "emptyPers" },
                    Page1: { id: "Page1" },
                    Page2: { id: "Page2" }
                }
            };
            var oExtractedPers = {
                brokenPers: null,
                emptyPers: {},
                Page1: { id: "Page1Pers" },
                Page2: { id: "Page2Pers" }
            };

            this.oExtractPersonalizationStub = sandbox.stub(this.oCDMService._oPersonalizationProcessor, "extractPersonalization").callsFake(function (oPersonalized, oOriginal) {
                var oPers = oExtractedPers[oOriginal.id];
                var oDeferred = new jQuery.Deferred();
                if (oPers) {
                    oDeferred.resolve(oPers);
                } else {
                    oDeferred.reject("Extraction failed");
                }
                return oDeferred.promise();
            });

            this.oConvertToStub = sandbox.stub(this.oCDMService._oSiteConverter, "convertTo").callsFake(function (_version, page) {
                return page;
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resolves and logs an error if extraction fails", function (assert) {
        // Arrange
        var oErrorStub = sandbox.stub(Log, "error");
        var aExpectedError = [
            "Cannot extract personalization of page brokenPers: Extraction failed",
            null,
            "sap.ushell.services.CommonDataModel"
        ];

        // Act & Assert
        return this.oCDMService._saveCdmVersion31(["brokenPers"])
            .then(function () {
                assert.deepEqual(oErrorStub.firstCall.args, aExpectedError, "The error was logged correctly");
                assert.strictEqual(this.oSetPersonalizationStub.callCount, 0, "setPersonalization was not called");
            }.bind(this));
    });

    QUnit.test("Resolves if personalization is empty", function (assert) {
        // Act & Assert
        return this.oCDMService._saveCdmVersion31(["emptyPers"])
            .then(function () {
                assert.strictEqual(this.oSetPersonalizationStub.callCount, 0, "setPersonalization was not called");
            }.bind(this));
    });

    QUnit.test("Saves correct personalization with empty and failing personalization", function (assert) {
        // Arrange
        var oExpectedPersonalization = {
            Page1: { id: "Page1Pers" },
            Page2: { id: "Page2Pers" },
            _version: "3.1.0",
            version: "3.1.0"
        };

        // Act & Assert
        return this.oCDMService._saveCdmVersion31(["emptyPers", "brokenPers", "Page1", "Page2"])
            .then(function () {
                assert.strictEqual(this.oSetPersonalizationStub.callCount, 1, "setPersonalization was called once");
                assert.deepEqual(this.oSetPersonalizationStub.firstCall.args[0], oExpectedPersonalization, "correct personalization was saved");
            }.bind(this));
    });

    QUnit.module("_setPersonalization", {
        beforeEach: function () {
            this.oGetSiteStub = sandbox.stub().returns(new jQuery.Deferred());
            this.oSetPersonalizationStub = sandbox.stub();
            this.oCDMService = new CommonDataModel({
                getSite: this.oGetSiteStub,
                setPersonalization: this.oSetPersonalizationStub
            });
        }
    });

    QUnit.test("only calls setPersonalization once when multiple saves were triggered and the first one was not yet processed", function (assert) {
        // Arrange
        var oDeferred = new jQuery.Deferred();
        this.oSetPersonalizationStub.returns(oDeferred);
        // Act
        this.oCDMService._setPersonalization();
        this.oCDMService._setPersonalization();
        this.oCDMService._setPersonalization();
        // Assert
        assert.strictEqual(this.oSetPersonalizationStub.callCount, 1, "Only called setPersonalization once");
    });

    QUnit.test("calls setPersonalization a second time with the latest delta when the first call was processed if multiple saves were queried and properly resolves all promises", function (assert) {
        // Arrange
        var oDeferred = new jQuery.Deferred(),
            aPromises = [];

        this.oSetPersonalizationStub.returns(oDeferred);
        // Act
        aPromises.push(this.oCDMService._setPersonalization("one"));
        aPromises.push(this.oCDMService._setPersonalization("two"));
        aPromises.push(this.oCDMService._setPersonalization("three"));
        oDeferred.resolve();
        // Assert
        return Promise.all(aPromises)
            .then(function () {
                assert.strictEqual(this.oSetPersonalizationStub.callCount, 2, "called setPersonalization twice");
                assert.strictEqual(this.oSetPersonalizationStub.getCall(1).args[0], "three", "second call was with the last delta");
            }.bind(this));
    });

    QUnit.test("doesn't resolve queued queries before the newest delta is saved", function (assert) {
        // Arrange
        var oSetPersonalizationDeferred = new jQuery.Deferred(),
            oSecondDeferred = new jQuery.Deferred(),
            oPromise;

        this.oSetPersonalizationStub.onCall(0).returns(oSetPersonalizationDeferred);
        this.oSetPersonalizationStub.onCall(1).returns(oSecondDeferred);
        // Act
        this.oCDMService._setPersonalization("one");
        oPromise = this.oCDMService._setPersonalization("two");
        this.oCDMService._setPersonalization("three");
        assert.strictEqual(this.oSetPersonalizationStub.callCount, 1, "setPersonalization was called once");
        assert.strictEqual(this.oSetPersonalizationStub.getCall(0).args[0], "one", "setPersonalization was called with the correct arguments");
        oSetPersonalizationDeferred.resolve();
        oSecondDeferred.resolve();

        // Assert
        return oPromise
            .then(function () {
                assert.strictEqual(this.oSetPersonalizationStub.callCount, 2, "setPersonalization was called twice");
                assert.strictEqual(this.oSetPersonalizationStub.getCall(1).args[0], "three", "setPersonalization was called with the correct arguments the second time");
            }.bind(this))
            .catch(function (e) {
                assert.ok(false, "Promise was resolved");
            });
    });

    QUnit.module("sap.ushell.services.CommonDataModel", {
        beforeEach: function (assert) {
            var done = assert.async();
            this.oMockAdapter = {
                _getSiteDeferred: new jQuery.Deferred(),
                getSite: sandbox.spy(function () {
                    return this._getSiteDeferred.promise();
                }),
                _getPersonalizationDeferred: new jQuery.Deferred(),
                getPersonalization: sandbox.spy(function () {
                    return this._getPersonalizationDeferred.promise();
                }),
                _setPersonalizationDeferred: new jQuery.Deferred(),
                setPersonalization: sandbox.spy(function () {
                    return this._setPersonalizationDeferred.promise();
                })
            };
            this.oConvertToStub = sandbox.stub(SiteConverter.prototype, "convertTo");
            window["sap-ushell-config"] = { services: { CommonDataModel: { adapter: { module: "sap.ushell.adapters.cdm.CommonDataModelAdapter" } } } };

            Container.init("local")
                .then(function () {
                    Container.getServiceAsync("CommonDataModel").then(function (CommonDataModelService) {
                        this.CommonDataModelService = CommonDataModelService;
                        done();
                    }.bind(this));
                }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    [{
        testDescription: "fails because of undefined group id",
        input: { sGroupId: undefined },
        output: {
            oOriginalGroup: { identification: { id: "bar" } },
            sErrorMessage: "Group does not exist in original site."
        }
    }, {
        testDescription: "fails because of wrong group id (object instead of string)",
        input: { sGroupId: {} },
        output: { sErrorMessage: "Group does not exist in original site." }
    }, {
        testDescription: "fails because of undefined group id (number instead of string)",
        input: { sGroupId: 3 },
        output: { sErrorMessage: "Group does not exist in original site." }
    }, {
        testDescription: "fails because group was not found in original site",
        input: { sGroupId: "myGroupId" },
        output: { sErrorMessage: "Group does not exist in original site." }
    }].forEach(function (oFixture) {
        QUnit.test("getGroupFromOriginalSite, failure: " + oFixture.testDescription, function (assert) {
            // Arrange
            var oOriginalGroup = oFixture.output.oOriginalGroup,
                oMockAdapter = {
                    getSite: function () {
                        return new jQuery.Deferred().resolve({
                            _version: "3.0.0",
                            groups: { foo: oOriginalGroup }
                        }).promise();
                    },
                    getPersonalization: function () {
                        return new jQuery.Deferred().resolve({}).promise();
                    }
                },
                oCommonDataModelService = new CommonDataModel(oMockAdapter),
                fnDone = assert.async();

            // Act
            oCommonDataModelService.getGroupFromOriginalSite(oFixture.input.sGroupId)
                .done(function () {
                    assert.ok(false, "Promise resolved unexpectedly");
                })
                .fail(function (sErrorMessage) {
                    // Assert
                    assert.strictEqual(sErrorMessage, oFixture.output.sErrorMessage, "error message returned");
                })
                .always(fnDone);
        });
    });

    QUnit.test("getGroupFromOriginalSite, success: returns copies", function (assert) {
        // Arrange
        var oOriginalGroup = { identification: { id: "bar" } },
            oMockAdapter = {
                getSite: function () {
                    return new jQuery.Deferred().resolve({
                        _version: "3.0.0",
                        groups: {
                            // We have to clone the because the original site is cloned in the CDM Service
                            // and the old reference is then reused
                            foo: deepExtend({}, oOriginalGroup)
                        }
                    }).promise();
                },
                getPersonalization: function () {
                    return new jQuery.Deferred().resolve({}).promise();
                }
            },
            oCommonDataModelService = new CommonDataModel(oMockAdapter),
            fnDone = assert.async();

        oCommonDataModelService.getGroupFromOriginalSite("foo")
            .fail(function () {
                assert.ok(false, "Promise resolved unexpectedly");
            })
            .done(function (oResetGroup1) {
                // call getGroupFromOriginalSite again to verify, that copies are returned
                oCommonDataModelService.getGroupFromOriginalSite("foo")
                    .fail(function () {
                        assert.ok(false, "Promise resolved unexpectedly");
                    })
                    .done(function (oResetGroup2) {
                        // Note: CommonDataModel extends the site received from the adapter
                        assert.deepEqual(oResetGroup1, oOriginalGroup, "original group returned");
                        assert.notStrictEqual(oResetGroup1, oResetGroup2, "copies are returned");
                    });
            })
            .always(fnDone);
    });

    (function () {
        // Begin of test for method "_applyRemainingProperties":
        // testDescription: completes sentence like "Does something WHEN ...":
        [{
            testDescription: "a group is undefined",
            oOriginalSite: { groups: { foobar: undefined } },
            expectedChangedOriginalSite: { groups: {} }
        }, {
            testDescription: "payload is undefined",
            oOriginalSite: { groups: { foobar: {} } },
            expectedChangedOriginalSite: {
                groups: {
                    foobar: {
                        payload: {
                            tiles: [],
                            groups: [],
                            links: []
                        }
                    }
                }
            }
        }, {
            testDescription: "all properties are missing",
            oOriginalSite: { groups: { foobar: { payload: {} } } },
            expectedChangedOriginalSite: {
                groups: {
                    foobar: {
                        payload: {
                            tiles: [],
                            groups: [],
                            links: []
                        }
                    }
                }
            }
        }, {
            testDescription: "one property is missing",
            oOriginalSite: {
                groups: {
                    foobar: {
                        payload: {
                            tiles: [{}],
                            groups: ["group1", "group2"]
                        }
                    }
                }
            },
            expectedChangedOriginalSite: {
                groups: {
                    foobar: {
                        payload: {
                            tiles: [{}],
                            groups: ["group1", "group2"],
                            links: []
                        }
                    }
                }
            }
        }, {
            testDescription: "all properties are set",
            oOriginalSite: {
                groups: {
                    foobar: {
                        payload: {
                            tiles: [{}],
                            groups: ["group1", "group2"],
                            links: [{}]
                        }
                    }
                }
            },
            expectedChangedOriginalSite: {
                groups: {
                    foobar: {
                        payload: {
                            tiles: [{}],
                            groups: ["group1", "group2"],
                            links: [{}]
                        }
                    }
                }
            }
        }].forEach(function (oFixture) {
            QUnit.test("_ensureCompleteSite: Correctly initialize empty properties when  " + oFixture.testDescription, function (assert) {
                sandbox.spy(this.CommonDataModelService, "_ensureCompleteSite");
                this.CommonDataModelService._ensureCompleteSite(oFixture.oOriginalSite);
                assert.deepEqual(
                    oFixture.oOriginalSite,
                    oFixture.expectedChangedOriginalSite,
                    "correctly initialized empty properties in Original site"
                );
                this.CommonDataModelService._ensureCompleteSite.restore();
            });
        });
    })();

    QUnit.test("_ensureGroupsOrder: remove first groups order entry if the group is not available", function (assert) {
        var oSite = {
            site: { payload: { groupsOrder: ["a", "b", "c"] } },
            groups: {
                b: {},
                c: {}
            }
        };
        var aExpectedGroupsOrder = ["b", "c"];

        this.CommonDataModelService._ensureGroupsOrder(oSite);

        assert.deepEqual(oSite.site.payload.groupsOrder, aExpectedGroupsOrder, "The missing group got removed");
    });

    QUnit.test("_ensureGroupsOrder: remove last groups order entry if the group is not available", function (assert) {
        var oSite = {
            site: { payload: { groupsOrder: ["a", "b", "c"] } },
            groups: {
                a: {},
                b: {}
            }
        };
        var aExpectedGroupsOrder = ["a", "b"];

        this.CommonDataModelService._ensureGroupsOrder(oSite);

        assert.deepEqual(oSite.site.payload.groupsOrder, aExpectedGroupsOrder, "The missing group got removed");
    });

    QUnit.module("getMenuEntries", {
        beforeEach: function () {
            this.sMenuKeyMock = "main";
            this.oSiteMock = {
                menus: {
                    main: {
                        identification: { id: "main" },
                        payload: {
                            menuEntries: [{
                                id: "space01",
                                title: "Space 1",
                                description: "Description of space 1",
                                icon: "sap-icon://syringe",
                                type: "intent",
                                target: {
                                    semanticObject: "Launchpad",
                                    action: "openFLPPage",
                                    parameters: [
                                        { name: "pageId", value: "page1" },
                                        { name: "spaceId", value: "space01" }
                                    ]
                                }
                            }]
                        }
                    }
                }
            };
            this.oGetSiteDeferred = new jQuery.Deferred();
            this.oMockAdapter = {
                getSite: sandbox.stub().returns(this.oGetSiteDeferred)
            };
            this.oCDMService = new CommonDataModel(this.oMockAdapter);
            this.oCDMService._oSiteDeferred.resolve(this.oSiteMock);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns array of menuEntries", function (assert) {
        //Act
        return this.oCDMService.getMenuEntries(this.sMenuKeyMock).then(function (aMenuEntries) {
            //Assert
            assert.deepEqual(aMenuEntries, this.oSiteMock.menus[this.sMenuKeyMock].payload.menuEntries, "correct array was returned");
            assert.notStrictEqual(aMenuEntries, this.oSiteMock.menus[this.sMenuKeyMock].payload.menuEntries, "menuEntries were cloned");
        }.bind(this));
    });

    QUnit.test("Returns empty array of if menu is not available", function (assert) {
        //Act
        return this.oCDMService.getMenuEntries("nonAvailableMenu").then(function (aMenuEntries) {
            //Assert
            assert.deepEqual(aMenuEntries, [], "empty array was returned");
        });
    });

    QUnit.module("getContentProviderIds", {
        beforeEach: function () {
            this.oFirstApplication = { id: "first" };
            this.oSecondApplication = { id: "second" };

            this.oSiteMock = {
                systemAliases: {
                    firstSystemAlias: {},
                    secondSystemAlias: {},
                    thirdSystemAlias: {}
                },
                applications: {
                    firstApplication: this.oFirstApplication,
                    secondApplication: this.oSecondApplication
                }
            };
            this.oGetSiteDeferred = new jQuery.Deferred();
            this.oMockAdapter = {
                getSite: sandbox.stub().returns(this.oGetSiteDeferred)
            };
            this.oCDMService = new CommonDataModel(this.oMockAdapter);
            this.oCDMService._oSiteDeferred.resolve(this.oSiteMock);

            this.getContentProviderIdStub = sandbox.stub(readApplications, "getContentProviderId");
            this.getContentProviderIdStub.withArgs(this.oFirstApplication).returns("firstSystemAlias");
            this.getContentProviderIdStub.withArgs(this.oSecondApplication).returns("secondSystemAlias");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns an array of contentProviderIds", function (assert) {
        // Arrange
        var oExpectedResult = ["firstSystemAlias", "secondSystemAlias"];

        // Act
        return this.oCDMService.getContentProviderIds().then(function (oResult) {
            // Assert
            assert.deepEqual(oResult, oExpectedResult, "The right result was returned");
            assert.strictEqual(this.getContentProviderIdStub.callCount, 2, "getContentProviderId was called exactly twice");
            assert.deepEqual(this.getContentProviderIdStub.getCall(0).args, [this.oFirstApplication], "getContentProviderId was called with the right args");
            assert.deepEqual(this.getContentProviderIdStub.getCall(1).args, [this.oSecondApplication], "getContentProviderId was called with the right args");
        }.bind(this));
    });

    QUnit.module("The method _ensureProperDisplayFormats", {
        beforeEach: function () {
            this.oMockAdapter = {
                getSite: sandbox.stub().returns(new jQuery.Deferred())
            };
            this.oCDMService = new CommonDataModel(this.oMockAdapter);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("converts the display formats of the site object to the current standards in a site with pages and spaces", function (assert) {
        // Arrange
        this.oSiteMock = {
            vizTypes: {
                vizType1: {
                    "sap.flp": {
                        vizOptions: {
                            displayFormats: {
                                supported: ["standard", "link", "flat", "standardWide"],
                                default: "standard"
                            }
                        }
                    }
                }
            },
            pages: {
                page1: {
                    payload: {
                        sections: {
                            section1: {
                                viz: { viz1: { displayFormatHint: "standard" } }
                            }
                        }
                    }
                }
            }
        };
        this.oCDMService._oOriginalSite = this.oSiteMock;
        // Act
        var oSite = this.oCDMService._oOriginalSite;
        this.oCDMService._ensureProperDisplayFormats(this.oCDMService._oOriginalSite);
        // Assert
        assert.deepEqual(oSite.vizTypes.vizType1["sap.flp"].vizOptions.displayFormats.supported, [
            "standard", "compact", "flat", "standardWide"
        ], "The supported display formats have been correctly converted");
        assert.strictEqual(oSite.vizTypes.vizType1["sap.flp"].vizOptions.displayFormats.default, "standard", "The default display format was left untouched as it is the current standard");
        assert.strictEqual(oSite.pages.page1.payload.sections.section1.viz.viz1.displayFormatHint, "standard", "The displayFormatHint of the viz was correctly converted");
    });

    QUnit.test("converts the display formats of the site object to the current standards in a site with groups", function (assert) {
        // Arrange
        this.oSiteMock = {
            vizTypes: {
                vizType1: {
                    "sap.flp": {
                        vizOptions: {
                            displayFormats: {
                                supported: ["standard", "link", "flat", "standardWide"],
                                default: "link"
                            }
                        }
                    }
                }
            },
            groups: {
                group1: {
                    payload: {
                        tiles: [{ displayFormatHint: "standard" }]
                    }
                }
            }
        };
        this.oCDMService._oOriginalSite = this.oSiteMock;
        // Act
        var oSite = this.oCDMService._oOriginalSite;
        this.oCDMService._ensureProperDisplayFormats(this.oCDMService._oOriginalSite);
        // Assert
        assert.deepEqual(oSite.vizTypes.vizType1["sap.flp"].vizOptions.displayFormats.supported, [
            "standard", "compact", "flat", "standardWide"
        ], "The supported display formats have been correctly converted");
        assert.strictEqual(oSite.vizTypes.vizType1["sap.flp"].vizOptions.displayFormats.default, "compact", "The default display format was correctly converted");
        assert.strictEqual(oSite.groups.group1.payload.tiles[0].displayFormatHint, "standard", "The displayFormatHint of the viz was correctly converted");
    });

    QUnit.module("the method _mapDisplayFormats", {
        beforeEach: function () {
            this.oMockAdapter = {
                getSite: sandbox.stub().returns(new jQuery.Deferred())
            };
            this.oCDMService = new CommonDataModel(this.oMockAdapter);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("returns an array of converted displayFormats", function (assert) {
        // Arrange
        var aInputDisplayFormats = ["standard", "tile", "link", "compact", "flat", "flatWide", "standardWide"];
        var aExpectedDisplayFormats = ["standard", "standard", "compact", "compact", "flat", "flatWide", "standardWide"];
        // Act
        var aResultingDisplayFormats = this.oCDMService._mapDisplayFormats(aInputDisplayFormats);
        // Assert
        assert.deepEqual(aResultingDisplayFormats, aExpectedDisplayFormats, "The array of displayFormats was correctly converted");
    });

    QUnit.module("_getSiteProperty", {
        beforeEach: function () {
            this.oMockSite = {
                _version: "3.0.0",
                site: {},
                vizTypes: {
                    vizType1: {
                        "sap.flp": {
                            vizOptions: {
                                displayFormats: {
                                    supported: ["standard", "link", "flat", "standardWide"],
                                    default: "link"
                                }
                            }
                        }
                    }
                }
            };
            var oMockAdapter = {
                getSite: function () {
                    return new jQuery.Deferred().resolve({}).promise();
                },
                getPersonalization: sandbox.stub().returns(new jQuery.Deferred().resolve().promise())
            };
            this.oCDMService = new CommonDataModel(oMockAdapter);
            this.oCDMService._oSiteDeferred = new jQuery.Deferred().resolve(this.oMockSite).promise();
            this.oObjectPathGetSpy = sandbox.spy(ObjectPath, "get");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resolves with the correct site property value", function (assert) {
        // Act
        var aObjectPatch = ["vizTypes", "vizType1", "sap.flp", "vizOptions", "displayFormats", "default"];
        return this.oCDMService._getSiteProperty(aObjectPatch).then(function (sDefaultDisplayFormat) {
            // Assert
            assert.deepEqual(this.oObjectPathGetSpy.firstCall.args[0], aObjectPatch, "The function calls ObjectPath.get with the provided object path.");
            assert.deepEqual(this.oObjectPathGetSpy.firstCall.args[1], this.oMockSite, "The function calls ObjectPath.get with CDM site as root object.");
            assert.strictEqual(sDefaultDisplayFormat, "link", "The function returns the correct value for the provided object path.");
        }.bind(this));
    });

    QUnit.test("Rejects the promise if the site deferred failed", function (assert) {
        // Arrange
        this.oCDMService._oSiteDeferred = new jQuery.Deferred().reject("Site Deferred rejected").promise();

        // Act
        return this.oCDMService._getSiteProperty("someProperty").catch(function (sError) {
            // Assert
            assert.strictEqual(sError, "Site Deferred rejected", "The promise was rejected with the correct error message.");
        });
    });

    QUnit.module("getVizType", {
        beforeEach: function () {
            this.oSiteMock = {
                vizTypes: {
                    "cached.viz.type": { id: "cached.viz.type" }
                }
            };
            this.oNewVizType = { id: "new.viz.type" };
            this.oGetVizTypeStub = sandbox.stub().resolves(this.oNewVizType);
            this.oAdapterMock = {
                getSite: function () {
                    return new jQuery.Deferred().resolve({}).promise();
                },
                getPersonalization: sandbox.stub().returns(new jQuery.Deferred().resolve().promise()),
                getVizType: this.oGetVizTypeStub
            };

            this.oCDMService = new CommonDataModel(this.oAdapterMock);
            this.oCDMService._oSiteDeferred = new jQuery.Deferred().resolve(this.oSiteMock).promise();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the cached vizType when adapter does not provide getVizType", function (assert) {
        // Arrange
        delete this.oAdapterMock.getVizType;
        var sVizType = "cached.viz.type";
        // Act
        return this.oCDMService.getVizType(sVizType).then(function (oVizType) {
            // Assert
            assert.strictEqual(oVizType, this.oSiteMock.vizTypes[sVizType], "Resolved the correct vizType");
        }.bind(this));
    });

    QUnit.test("Calls the adapter getVizType", function (assert) {
        // Arrange
        var sVizType = "new.viz.type";
        // Act
        return this.oCDMService.getVizType(sVizType).then(function (oVizType) {
            // Assert
            assert.deepEqual(oVizType, this.oNewVizType, "Resolved the correct vizType");
            assert.strictEqual(this.oGetVizTypeStub.callCount, 1, "getVizType was called once");
            assert.deepEqual(this.oSiteMock.vizTypes[sVizType], oVizType, "saved the new vizType to the site");
        }.bind(this));
    });

    QUnit.module("_migratePersonalizedPages", {
        beforeEach: function () {
            this.oMigratePersonalizedPagesStub = sandbox.stub().resolves([]);
            this.oAdapterMock = {
                getSite: function () {
                    return new jQuery.Deferred().resolve({}).promise();
                },
                getPersonalization: sandbox.stub().returns(new jQuery.Deferred().resolve().promise()),
                migratePersonalizedPages: this.oMigratePersonalizedPagesStub
            };

            this.oCDMService = new CommonDataModel(this.oAdapterMock);
            this.oSaveStub = sandbox.stub(this.oCDMService, "save").resolves();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls the migration on the adapter", function (assert) {
        // Arrange
        var aPages = [{ id: "page1" }];
        // Act
        return this.oCDMService._migratePersonalizedPages(aPages)
            .then(function (aMigratedPages) {
                assert.strictEqual(aMigratedPages, aPages, "Resolved the correct pages object");
                assert.strictEqual(this.oMigratePersonalizedPagesStub.callCount, 1, "oAdapter.migratePersonalizedPages was called once");
                assert.strictEqual(this.oMigratePersonalizedPagesStub.firstCall.args[0], aPages, "oAdapter.migratePersonalizedPages was called with correct pages");
            }.bind(this));
    });

    QUnit.test("Saves the pages resolved by the migration", function (assert) {
        // Arrange
        var aPages = [{ id: "page1" }];
        this.oMigratePersonalizedPagesStub.resolves(["page1"]);
        // Act
        return this.oCDMService._migratePersonalizedPages(aPages)
            .then(function () {
                assert.strictEqual(this.oSaveStub.callCount, 1, "save was called once");
                assert.deepEqual(this.oSaveStub.firstCall.args[0], ["page1"], "save was called with correct pageIds");
            }.bind(this));
    });

    QUnit.test("Does not save when no pageIds were resolved", function (assert) {
        // Arrange
        var aPages = [{ id: "page1" }];
        // Act
        return this.oCDMService._migratePersonalizedPages(aPages)
            .then(function () {
                assert.strictEqual(this.oSaveStub.callCount, 0, "save was not called");
            }.bind(this));
    });

    QUnit.test("Resolves pages when adapter does not implement migratePersonalizedPages", function (assert) {
        // Arrange
        delete this.oAdapterMock.migratePersonalizedPages;
        var aPages = [{ id: "page1" }];

        // Act
        return this.oCDMService._migratePersonalizedPages(aPages)
            .then(function (aMigratedPages) {
                assert.strictEqual(aMigratedPages, aPages, "Resolved the correct pages object");
                assert.strictEqual(this.oSaveStub.callCount, 0, "save was not called");
                assert.strictEqual(this.oMigratePersonalizedPagesStub.callCount, 0, "oAdapter.migratePersonalizedPages was not called");
            }.bind(this));
    });

    QUnit.module("_ensureStandardVizTypesPresent", {
        beforeEach: function () {
            this.oAdapterMock = {
                getSite: function () {
                    return new jQuery.Deferred().resolve({}).promise();
                },
                getPersonalization: sandbox.stub().returns(new jQuery.Deferred().resolve().promise())
            };

            this.oCDMService = new CommonDataModel(this.oAdapterMock);

            this.oVizTypeDefaultsGetAllStub = sandbox.stub(VizTypeDefaults, "getAll").resolves({
                "standard.viz.type": "fake"
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Does not alter the site for versions below 3.", async function (assert) {
        // Arrange
        const oSite = {
            _version: "2.0.0",
            vizTypes: {}
        };
        const oExpectedSite = {
            _version: "2.0.0",
            vizTypes: {}
        };

        // Act
        await this.oCDMService._ensureStandardVizTypesPresent(oSite);

        // Assert
        assert.deepEqual(oSite, oExpectedSite, "No viz types were added");
        assert.strictEqual(this.oVizTypeDefaultsGetAllStub.callCount, 0, "VizTypeDefaults.getAll was not called");
    });

    QUnit.test("Adds the standard viz types to the site if it does not contain any vizTypes", async function (assert) {
        // Arrange
        const oSite = {
            _version: "3.1.0"
        };
        const oExpectedSite = {
            _version: "3.1.0",
            vizTypes: {
                "standard.viz.type": "fake"
            }
        };

        // Act
        await this.oCDMService._ensureStandardVizTypesPresent(oSite);

        // Assert
        assert.deepEqual(oSite, oExpectedSite, "Added the standard viz types");
        assert.strictEqual(this.oVizTypeDefaultsGetAllStub.callCount, 1, "VizTypeDefaults.getAll was called once");
    });

    QUnit.test("Adds the standard viz types to the site if it already contains different vizTypes", async function (assert) {
        // Arrange
        const oSite = {
            _version: "3.1.0",
            vizTypes: {
                "site.viz.type": "fake"
            }
        };
        const oExpectedSite = {
            _version: "3.1.0",
            vizTypes: {
                "site.viz.type": "fake",
                "standard.viz.type": "fake"
            }
        };

        // Act
        await this.oCDMService._ensureStandardVizTypesPresent(oSite);

        // Assert
        assert.deepEqual(oSite, oExpectedSite, "Added the standard viz types");
        assert.strictEqual(this.oVizTypeDefaultsGetAllStub.callCount, 1, "VizTypeDefaults.getAll was called once");
    });

    QUnit.test("Does not overwrite the standard viz types in the site if it already contains one", async function (assert) {
        // Arrange
        const oSite = {
            _version: "3.1.0",
            vizTypes: {
                "standard.viz.type": "from site"
            }
        };
        const oExpectedSite = {
            _version: "3.1.0",
            vizTypes: {
                "standard.viz.type": "from site"
            }
        };

        // Act
        await this.oCDMService._ensureStandardVizTypesPresent(oSite);

        // Assert
        assert.deepEqual(oSite, oExpectedSite, "Did not overwrite the standard viz types");
        assert.strictEqual(this.oVizTypeDefaultsGetAllStub.callCount, 1, "VizTypeDefaults.getAll was called once");
    });

    QUnit.module("_getAllPersonalizedPages", {
        beforeEach: function () {
            this.oPersMock = {};
            this.oGetPersonalizationStub = sandbox.stub();
            this.oGetPersonalizationStub.returns(new jQuery.Deferred().resolve().promise());
            this.oAdapterMock = {
                getSite: function () {
                    return new jQuery.Deferred().resolve({}).promise();
                },
                getPersonalization: this.oGetPersonalizationStub
            };

            this.oCDMService = new CommonDataModel(this.oAdapterMock);

            this.oCDMService._oGetSitePromise = Promise.resolve();
            this.oCDMService._oOriginalSite = { _version: "3.1.0" };
            this.oGetAssignedPageIdsStub = sandbox.stub(this.oCDMService, "_getAssignedPageIds").resolves(["page1", "page2", "page3"]);
            this.oGetPagesStub = sandbox.stub(this.oCDMService, "getPages").callsFake(function (aPageIds) {
                var aPages = aPageIds.map(function (sId) {
                    return { id: sId };
                });
                return Promise.resolve(aPages);
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resolves the correct pages", function (assert) {
        // Arrange
        var oPersMock = {
            page2: {
                _version: "3.0.0"
            },
            page3: {
                movedTiles: {},
                _version: "3.0.0"
            },
            page4: {
                movedTiles: {},
                _version: "3.0.0"
            },
            version: "3.1.0",
            _version: "3.1.0"
        };
        this.oGetPersonalizationStub.withArgs("3.1.0").returns(new jQuery.Deferred().resolve(oPersMock).promise());
        // Act
        return this.oCDMService._getAllPersonalizedPages()
            .then(function (aPages) {
                assert.deepEqual(aPages, [{ id: "page3" }], "Resolved correct pages");
            });
    });

    QUnit.test("Resolves an empty array when the personalization is empty", function (assert) {
        // Arrange
        var oPersMock = {
            version: "3.1.0",
            _version: "3.1.0"
        };
        this.oGetPersonalizationStub.withArgs("3.1.0").returns(new jQuery.Deferred().resolve(oPersMock).promise());
        // Act
        return this.oCDMService._getAllPersonalizedPages()
            .then(function (aPages) {
                assert.deepEqual(aPages, [], "Resolved an empty array");
            });
    });

    QUnit.module("_getAssignedPageIds & _collectPageIds", {
        beforeEach: function () {
            // Mock menu service
            this.oGetServiceAsyncStub = sandbox.stub();
            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceAsyncStub);

            this.oGetServiceAsyncStub.withArgs("Menu").resolves({
                getContentNodes: sandbox.stub().resolves([
                    {
                        id: "ContentNode1",
                        label: "Space 1",
                        type: "Space",
                        isContainer: false,
                        children: [{
                            id: "ContentNode2",
                            label: "Page 1",
                            type: "Page",
                            isContainer: true
                        }]
                    }, {
                        id: "ContentNode3",
                        label: "Group 1",
                        type: "HomepageGroup",
                        isContainer: true,
                        children: []
                    },
                    {
                        id: "ContentNode4",
                        label: "Space 2",
                        type: "Space",
                        isContainer: false,
                        children: [{
                            id: "ContentNode5",
                            label: "Page 2",
                            type: "Page",
                            isContainer: true,
                            children: []
                        }, {
                            id: "ContentNode5",
                            label: "Page 2",
                            type: "Page",
                            isContainer: true
                        }, {
                            id: "ContentNode6",
                            label: "...",
                            type: "Unknown",
                            isContainer: false,
                            children: [{
                                id: "ContentNode7",
                                label: "Page 4",
                                type: "Page",
                                isContainer: true,
                                children: []
                            }]
                        }]
                    }
                ])
            });

            // Create CommonDataModel service for testing
            this.oAdapterMock = {
                getSite: function () {
                    return new jQuery.Deferred().resolve({}).promise();
                },
                getPersonalization: sandbox.stub().returns(new jQuery.Deferred().resolve().promise())
            };

            this.oCDMService = new CommonDataModel(this.oAdapterMock);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resolve the correct IDs", function (assert) {
        // Arrange
        var aExpectedPageIds = ["ContentNode2", "ContentNode5", "ContentNode7"];
        // Act
        return this.oCDMService._getAssignedPageIds()
            .then(function (aPageIds) {
                assert.deepEqual(aPageIds, aExpectedPageIds, "Resolved correct page IDs from content nodes");
            });
    });
});
