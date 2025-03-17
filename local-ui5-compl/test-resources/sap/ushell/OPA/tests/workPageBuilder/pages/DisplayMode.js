// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/actions/EnterText",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/matchers/I18NText",
    "sap/ushell/opa/actions/Drag",
    "sap/ushell/opa/actions/Drop",
    "sap/ui/test/matchers/Ancestor"
], function (Opa5, Press, EnterText, Properties, I18NTextMatcher, Drag, Drop, Ancestor) {
    "use strict";

    var sViewName = "sap.ushell.components.workPageBuilder.view.WorkPageBuilder";

    Opa5.createPageObjects({
        onTheWorkPage: {
            assertions: {
                iSeeFocusedTileWithProperties: function (oTileProperties) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.GenericTile",
                        matchers: new Properties(oTileProperties),
                        check: function (aTiles) {
                            return aTiles[0] &&
                                aTiles[0].getDomRef() &&
                                aTiles[0].getDomRef().closest(".sapFGridContainerItemWrapper") === document.activeElement;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The tile was focused");
                        }
                    });
                },
                iSeeTheRowsLetterBoxed: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.components.workPageBuilder.controls.WorkPageRow",
                        check: function (aWorkPageRows) {
                            return aWorkPageRows.length > 0 &&
                                aWorkPageRows.every((oRow) => window.getComputedStyle(oRow.getDomRef()).maxWidth === "1520px");
                        },
                        success: function () {
                            Opa5.assert.ok(true, "All rows were letterboxed (had a max-width)");
                        }
                    });
                }
            },
            actions: {
            }
        }
    });
});
