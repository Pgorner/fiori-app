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

    QUnit.module("The function getLength", {
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
                test: "filter",
                getFilters: sandbox.stub().returns([])
            }];
            this.mParameters = {
                test: "param",
                totalCountPropertyPath: "/appSearch/totalCount"
            };
            this.oBinding = new GraphQLListBinding(this.oModel, this.sPath, this.oContext, this.aSorters, this.aFilters, this.mParameters);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("returns the correct length if no client-side filters are set", function (assert) {
        // Act
        var iLength = this.oBinding.getLength();

        // Assert
        assert.strictEqual(iLength, 199, "The correct length was returned.");
    });

    QUnit.test("returns the correct length if a client-side filter is set but it returns an empty filter", function (assert) {
        // Arrange
        this.oBinding.aFilters = [{test: "filter", getFilters: sandbox.stub().returns([])}];

        // Act
        var iLength = this.oBinding.getLength();

        // Assert
        assert.strictEqual(iLength, 199, "The correct length was returned.");
    });

    QUnit.test("returns the correct length if a client-side filter is set", function (assert) {
        // Arrange
        this.oBinding.aFilters = [{test: "filter", getFilters: sandbox.stub().returns([{test: "filter"}])}];
        this.oBinding.iLength = 150;

        // Act
        var iLength = this.oBinding.getLength();

        // Assert
        assert.strictEqual(iLength, 150, "The correct length was returned.");
    });

    QUnit.test("returns 0 if there is no totalCount in the model", function (assert) {
        // Arrange
        this.oModel.setData({});

        // Act
        var iLength = this.oBinding.getLength();

        // Assert
        assert.strictEqual(iLength, 0, "The correct length was returned.");
    });


    QUnit.module("The function isLengthFinal", {
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
            this.oBinding = new GraphQLListBinding(this.oModel, this.sPath, this.oContext, this.aSorters, this.aFilters, this.mParameters);
            this.oBinding.oList = {
                length: 199
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("returns true if the list length equals to totalCount", function (assert) {
        // Act
        var bIsLengthFinal = this.oBinding.isLengthFinal();

        // Assert
        assert.strictEqual(bIsLengthFinal, true, "The result was true.");
    });

    QUnit.test("returns true if the list length is bigger than totalCount", function (assert) {
        // Arrange
        this.oBinding.oList = {
            length: 204
        };

        // Act
        var bIsLengthFinal = this.oBinding.isLengthFinal();

        // Assert
        assert.strictEqual(bIsLengthFinal, true, "The result was true.");
    });

    QUnit.test("returns false if the list length is smaller than totalCount", function (assert) {
        // Arrange
        this.oBinding.oList = {
            length: 98
        };

        // Act
        var bIsLengthFinal = this.oBinding.isLengthFinal();

        // Assert
        assert.strictEqual(bIsLengthFinal, false, "The result was false.");
    });

});
