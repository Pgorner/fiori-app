// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.contentFinder.model.GraphQLListBinding
 */
sap.ui.define([
    "sap/ushell/components/contentFinder/model/GraphQLModel",
    "sap/ushell/components/contentFinder/model/GraphQLListBinding"
], function (
    GraphQLModel,
    GraphQLListBinding
) {
    "use strict";
    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox();

    QUnit.module("The function bindList", {
        beforeEach: function () {
            this.oModel = new GraphQLModel({
                appSearch: {
                    totalCount: 199
                }
            });

            this.sPath = "test-path";
            this.oContext = { test: "context" };
            this.aSorters = [{
                test: "sorter"
            }];
            this.aFilters = [{
                test: "filter"
            }];
            this.mParameters = {
                test: "param",
                totalCountPropertyPath: "/appSearch/totalCount"
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("returns an instance of GraphQLListBinding", function (assert) {
        var oResult = this.oModel.bindList(this.sPath, this.oContext, this.aSorters, this.aFilters, this.mParameters);
        assert.ok(oResult instanceof GraphQLListBinding, "An instance of GraphQLListBinding was returned.");
        assert.strictEqual(oResult.getLength(), 199, "The path was correctly set.");
        assert.strictEqual(oResult.getContext(), this.oContext, "The context was correctly set.");
    });
});
