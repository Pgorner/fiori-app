// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.adapters.cdm.v3._LaunchPage.readPages
 */
sap.ui.define([
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readPages"
], function (
    readPages
) {
    "use strict";

    /* global QUnit*/

    QUnit.module("The method getVisualizationReferences");

    QUnit.test("Returns all vizReferences of a page", function (assert) {
        //Arrange
        var oPage = {
            payload: {
                sections: {
                    sec1: {
                        layout: {
                            vizOrder: ["viz1", "viz2"]
                        },
                        viz: {
                            viz1: { id: "viz1" },
                            viz2: { id: "viz2" }
                        }
                    },
                    sec2: {
                        layout: {
                            vizOrder: ["viz3", "viz4"]
                        },
                        viz: {
                            viz3: { id: "viz3" },
                            viz4: { id: "viz4" }
                        }
                    }
                }
            }
        };
        var aExpectedResult = [
            { id: "viz1" },
            { id: "viz2" },
            { id: "viz3" },
            { id: "viz4" }
        ];
        //Act
        var oResult = readPages.getVisualizationReferences(oPage);
        //Assert
        assert.deepEqual(oResult, aExpectedResult, "returned the correct result");
    });

    QUnit.test("Returns an empty array if no vizReferences are present on the page", function (assert) {
        //Arrange
        var oPage = {
            payload: {
                sections: {
                    sec1: {
                        layout: { vizOrder: [] },
                        viz: {}
                    }
                }
            }
        };
        var aExpectedResult = [];
        //Act
        var oResult = readPages.getVisualizationReferences(oPage);
        //Assert
        assert.deepEqual(oResult, aExpectedResult, "returned the correct result");
    });
});
