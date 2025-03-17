// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for module "PageReferencer"
 */
sap.ui.define([
    "sap/ushell/services/_PageReferencing/PageReferencer",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Container"
], function(
    // Container
    PageReferencer,
    jQuery,
    Container
) {
    "use strict";

    /* global QUnit, sinon */

    var oPageInfo = {
        id: "Z_TEST_ID",
        title: "Test Page",
        description: "Test"
    };

    var oPageLayout = [{
        id: "Group1",
        title: "Group 1",
        viz: []
    }, {
        id: "Group2",
        title: "Group 2",
        viz: [{
            tileCatalogId: "id1",
            target: "#Action-toappnavsample"
        }, {
            tileCatalogId: "id2",
            target: "#Action-totestapp"
        }]
    }];

    var oResolveHashStub;

    QUnit.module("sap/ushell/services/_PageReferencing/PageReferencer", {
        beforeEach: function (assert) {
            var done = assert.async();
            Container.init("local")
                .then(function () {
                    Container.getServiceAsync("NavTargetResolutionInternal").then(function (NavTargetResolutionService) {
                        this.NavTargetResolutionService = NavTargetResolutionService;
                        done();
                    }.bind(this));
                }.bind(this));
        },
        afterEach: function () {
            if (oResolveHashStub) {
                oResolveHashStub.restore();
            }
        }
    });

    QUnit.test("Create reference page with empty section", function (assert) {
        var fnDone = assert.async();
        var oResultPromise = PageReferencer.createReferencePage(oPageInfo, []);
        oResultPromise.then(function (oResult) {
            assert.equal(oResult.id, oPageInfo.id, "Id set correctly in reference page");
            assert.equal(oResult.title, oPageInfo.title, "Title set correctly in reference page");
            assert.equal(oResult.description, oPageInfo.description, "Description set correctly in reference page");
            assert.equal(oResult.sections.length, 0, "Sections should be empty");
            fnDone();
        });
    });

    QUnit.test("Create reference page for one group without any tiles", function (assert) {
        var fnDone = assert.async();
        var oEmptyGroup = oPageLayout[0];

        PageReferencer.createReferencePage(oPageInfo, [oEmptyGroup]).then(function (oResult) {
            assert.equal(oResult.sections.length, 1, "Sections should contain 1 item");
            assert.equal(oResult.sections[0].id, oEmptyGroup.id, "Id of the empty group set correctly in reference page");
            assert.equal(oResult.sections[0].title, oEmptyGroup.title, "Title  of the empty group set correctly in reference page");
            assert.equal(oResult.sections[0].visualizations.length, 0, "The empty group hasn't tiles in reference page");
            fnDone();
        });
    });

    QUnit.test("Create reference page when all tiles resolved", function (assert) {
        var fnDone = assert.async();
        var oGroup = oPageLayout[1];
        var permanentKey = "X-SAP-UI2-CATALOGPAGE:/UI2/FLP/UW2:ET091D7N8BTEAL3ATDLMJ1B8Q";

        oResolveHashStub = sinon.stub(this.NavTargetResolutionService, "resolveHashFragment").returns(new jQuery.Deferred().resolve({
            inboundPermanentKey: permanentKey
        }));

        PageReferencer.createReferencePage(oPageInfo, oPageLayout).then(function (oResult) {
            var aVisualizations = oResult.sections[1].visualizations;
            assert.equal(oResolveHashStub.callCount, oGroup.viz.length, "resolveHashFragment called for all hash targets");
            assert.equal(aVisualizations.length, oGroup.viz.length, "The number of tiles in reference page is the same as in layout");
            assert.equal(aVisualizations[0].inboundPermanentKey, permanentKey, "inboundPermanentKey is taken from ClientSideTargetResolution");
            assert.equal(aVisualizations[0].vizId, oGroup.viz[0].tileCatalogId, "vizId set correctly");
            assert.equal(aVisualizations[1].inboundPermanentKey, permanentKey, "inboundPermanentKey is taken from ClientSideTargetResolution");
            assert.equal(aVisualizations[1].vizId, oGroup.viz[1].tileCatalogId, "vizId set correctly");
            oResolveHashStub.restore();
            fnDone();
        });
    });

    QUnit.test("Create reference page is rejected when one of the tile is not resolved", function (assert) {
        var fnDone = assert.async();

        oResolveHashStub = sinon.stub(this.NavTargetResolutionService, "resolveHashFragment");
        oResolveHashStub.withArgs("#Action-toappnavsample").returns(new jQuery.Deferred().reject("reject"));
        oResolveHashStub.returns(new jQuery.Deferred().resolve({ inboundPermanentKey: "key" }));

        PageReferencer.createReferencePage(oPageInfo, oPageLayout).then(
            function () {
                assert.ok(false, "Promise should be rejected");
                fnDone();
            },
            function () {
                assert.ok(true, "Promise should be rejected");
                fnDone();
            }
        );
    });

    QUnit.test("Do not call resolveHashFragment for duplicate target", function (assert) {
        var fnDone = assert.async();
        var oGroup = {
            id: "Group2",
            title: "Group 2",
            viz: [{
                tileCatalogId: "id1",
                target: "#Action-toappnavsample"
            }, {
                tileCatalogId: "id2",
                target: "#Action-toappnavsample"
            }]
        };

        oResolveHashStub = sinon.stub(this.NavTargetResolutionService, "resolveHashFragment").returns(new jQuery.Deferred().resolve({
            inboundPermanentKey: "key"
        }));

        PageReferencer.createReferencePage(oPageInfo, [oGroup]).then(function () {
            assert.equal(oResolveHashStub.callCount, 1, "resolveHashFragment called for all unique hash targets");
            oResolveHashStub.restore();
            fnDone();
        });
    });

    QUnit.test("Do not call resolveHashFragment if target is not defined", function (assert) {
        var fnDone = assert.async();
        var oGroup = {
            id: "Group2",
            title: "Group 2",
            viz: [{
                tileCatalogId: "id1",
                target: undefined
            }]
        };

        oResolveHashStub = sinon.stub(this.NavTargetResolutionService, "resolveHashFragment").returns(new jQuery.Deferred().resolve({
            inboundPermanentKey: "key"
        }));

        PageReferencer.createReferencePage(oPageInfo, [oGroup]).then(function (oResult) {
            var aVisualizations = oResult.sections[0].visualizations;
            assert.equal(oResolveHashStub.callCount, 0, "resolveHashFragment should not be called if the target is not defined");
            assert.equal(aVisualizations[0].inboundPermanentKey, undefined, "inboundPermanentKey should be undefined when target is not defined");
            oResolveHashStub.restore();
            fnDone();
        });
    });
});
