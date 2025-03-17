// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.CommonDataModel.SiteConverter
 */
sap.ui.define([
    "sap/ushell/services/CommonDataModel/SiteConverter",
    "sap/base/Log"
], function (SiteConverter, Log) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("The Converter", {
        beforeEach: function () {
            this.oSiteConverter = new SiteConverter();
            this.oCdm31Page = oDummyCdm31Page;
            this.oCdm30Site = oDummyCdm30Site;
            this.oLogErrorStub = sandbox.stub(Log, "error");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("converts a page from 3.1.0 to 3.0.0", function (assert) {
        // Act
        var oConvertedPage = this.oSiteConverter.convertTo("3.0.0", this.oCdm31Page);

        // Assert
        assert.deepEqual(oConvertedPage, this.oCdm30Site, "The converted page is the valid 3.0.0 site.");
    });

    QUnit.test("converts a site from 3.0.0 to 3.1.0", function (assert) {
        // Act
        var oConvertedSite = this.oSiteConverter.convertTo("3.1.0", this.oCdm30Site);

        // Assert
        assert.deepEqual(oConvertedSite, this.oCdm31Page, "The converted site is the valid 3.1.0 page.");
    });

    QUnit.test("hands over an incorrect version and should return an empty object and show an error message", function (assert) {
        // Act
        var oConvertedSite = this.oSiteConverter.convertTo("0.0.0", this.oCdm30Site);

        // Assert
        assert.deepEqual(oConvertedSite, {}, "The convert function returns an empty object.");
        assert.strictEqual(this.oLogErrorStub.callCount, 1, "The method error of Log is called once.");
    });

    QUnit.test("hands over no CDM 3.1 page or CDM 3.0 site which should lead to an error and an empty object", function (assert) {
        // Arrange
        var oWrongObject = {};

        // Act
        var oConvertedObject = this.oSiteConverter.convertTo("0.0.0", oWrongObject);

        // Assert
        assert.deepEqual(oConvertedObject, {}, "The convert function returns an empty object.");
        assert.strictEqual(this.oLogErrorStub.callCount, 1, "The method error of Log is called once.");
    });

    var oDummyCdm31Page = {
        identification: {
            id: "ZUH_TEST_PAGE",
            title: "Test Page for Review etc."
        },
        payload: {
            layout: {
                sectionOrder: [
                    "3WO90XZ1DX18XI3ICOGPMY7ZP",
                    "section2"
                ]
            },
            sections: {
                "3WO90XZ1DX18XI3ICOGPMY7ZP": {
                    id: "3WO90XZ1DX18XI3ICOGPMY7ZP",
                    title: "This is the first section on this page",
                    visible: false,
                    preset: false,
                    locked: false,
                    default: false,
                    layout: {
                        vizOrder: [
                            "3WO90XZ1DX18XI3IUI32TFZOO",
                            "3WO90XZ1DX18XI3IUI32TG608"
                        ]
                    },
                    viz: {
                        "3WO90XZ1DX18XI3IUI32TFZOO": {
                            id: "3WO90XZ1DX18XI3IUI32TFZOO",
                            vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_CLIENT_TRESOLUTION"
                        },
                        "3WO90XZ1DX18XI3IUI32TG608": {
                            id: "3WO90XZ1DX18XI3IUI32TG608",
                            vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_AUTOTEST_CDM_BC_TEST"
                        }
                    }
                },
                section2: {
                    id: "section2",
                    title: "This is the second section on this page",
                    layout: {
                        vizOrder: [
                            "viz1",
                            "viz2"
                        ]
                    },
                    viz: {
                        viz1: {
                            id: "viz1",
                            vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_CLIENT_TRESOLUTION"
                        },
                        viz2: {
                            id: "viz2",
                            vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_AUTOTEST_CDM_BC_TEST"
                        }
                    }
                }
            }
        }
    };

    var oDummyCdm30Site = {
        _version: "3.0.0",
        site: {
            identification: {
                id: "ZUH_TEST_PAGE",
                title: "Test Page for Review etc."
            },
            payload: {
                groupsOrder: [
                    "3WO90XZ1DX18XI3ICOGPMY7ZP",
                    "section2"
                ]
            }
        },
        groups: {
            "3WO90XZ1DX18XI3ICOGPMY7ZP": {
                identification: {
                    isVisible: false,
                    id: "3WO90XZ1DX18XI3ICOGPMY7ZP",
                    title: "This is the first section on this page"
                },
                payload: {
                    isPreset: false,
                    locked: false,
                    isDefaultGroup: false,
                    tiles: [{
                        id: "3WO90XZ1DX18XI3IUI32TFZOO",
                        vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_CLIENT_TRESOLUTION"
                    }, {
                        id: "3WO90XZ1DX18XI3IUI32TG608",
                        vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_AUTOTEST_CDM_BC_TEST"
                    }]
                }
            },
            section2: {
                identification: {
                    id: "section2",
                    title: "This is the second section on this page"
                },
                payload: {
                    tiles: [{
                        id: "viz1",
                        vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_CLIENT_TRESOLUTION"
                    }, {
                        id: "viz2",
                        vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_AUTOTEST_CDM_BC_TEST"
                    }]
                }
            }
        }
    };
});
