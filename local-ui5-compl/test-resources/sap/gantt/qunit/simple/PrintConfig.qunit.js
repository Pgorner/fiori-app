/* global QUnit*/
sap.ui.define([
    "sap/gantt/simple/PrintConfig",
    "sap/m/Button"
], function (PrintConfig, Button) {
    "use strict";
    QUnit.module("Print Configuration value validations", {
        before: function () {
            this.marginConfig = {
                marginLeft: 5,
                marginBottom: 5,
                marginRight: 5,
                marginTop: 5,
                marginLocked: true,
                marginType: "custom"
            };
            this.textConfig = {
                showHeaderText: true,
                showFooterText: true,
                headerText: "Header",
                footerText: "Footer"
            };
            this.pageConfig = {
                paperHeight: 10,
                paperWidth: 10,
                paperSize: "A4",
                unit: "mm",
                portrait: true,
                showPageNumber: true
            };
            this.durationConfig = {
                duration: "all",
                startDate: new Date(),
                endDate: new Date()
            };
            this.exportConfig = {
                exportAsJPEG: true,
                exportRange: "1,2",
                exportAll: true,
                compressionQuality: 1,
                scale: 50,
                multiplePage: true
            };
            this.printConfig = new PrintConfig(
                {
                    pageConfig: this.pageConfig,
                    textConfig: this.textConfig,
                    marginConfig: this.marginConfig,
                    durationConfig: this.durationConfig,
                    exportConfig: this.exportConfig
                });
        }
    });
    QUnit.test("Check if constructor is set properly", function (assert) {
        assert.ok(this.printConfig, "PrintConfig object is created");
    });
    QUnit.test("Method getMarginConfig should return margin configuration", function (assert) {
        assert.deepEqual(this.printConfig._getMarginConfig(), this.marginConfig, "getMarginConfig returns correct value");
    });
    QUnit.test("Method setMarginConfig with different values", function (assert) {
        var newMarginConfig1 = {
            marginLeft: 10,
            marginBottom: 10,
            marginRight: 10,
            marginTop: 10,
            marginLocked: true,
            marginType: "custom"
        };
        this.printConfig._setMarginConfig(newMarginConfig1);
        assert.deepEqual(this.printConfig._getMarginConfig(), newMarginConfig1, "setMarginConfig sets correct value");
        var newMarginConfig2 = {
            marginTop: 5,
            marginLocked: false,
            marginType: "custom"
        };
        this.printConfig._setMarginConfig(newMarginConfig2);
        assert.deepEqual(this.printConfig._getMarginConfig(), newMarginConfig2, "setMarginConfig sets correct value");
        assert.equal(this.printConfig._getMarginConfig().marginTop, 5, "setMarginConfig sets correct margin top value");
        assert.equal(this.printConfig._getMarginConfig().marginLocked, false, "setMarginConfig sets correct margin locked value");
        assert.equal(this.printConfig._getMarginConfig().marginType, "custom", "setMarginConfig sets correct margin type value");
        assert.equal(this.printConfig._getMarginConfig().marginLeft, 5, "setMarginConfig sets correct top value as left when type is custom and left value is not given");
        var newMarginConfig3 = {
            marginLocked: true,
            marginType: "custom",
            marginTop: 10
        };
        this.printConfig._setMarginConfig(newMarginConfig3);
        assert.deepEqual(this.printConfig._getMarginConfig(), newMarginConfig3, "setMarginConfig sets correct value");
        assert.equal(this.printConfig._getMarginConfig().marginLeft, 10, "setMarginConfig sets correct left value when locked is true");
        assert.equal(this.printConfig._getMarginConfig().marginRight, 10, "setMarginConfig sets correct right value when locked is true");
        var newMarginConfig4 = {
            marginType: "none"
        };
        this.printConfig._setMarginConfig(newMarginConfig4);
        assert.equal(this.printConfig._getMarginConfig().marginLeft, 0, "setMarginConfig sets correct left value when type is none");
        assert.equal(this.printConfig._getMarginConfig().marginRight, 0, "setMarginConfig sets correct right value when type is none");
        assert.equal(this.printConfig._getMarginConfig().marginTop, 0, "setMarginConfig sets correct top value when type is none");
        assert.equal(this.printConfig._getMarginConfig().marginBottom, 0, "setMarginConfig sets correct bottom value when type is none");
        assert.equal(this.printConfig._getMarginConfig().marginType, "none", "setMarginConfig sets correct margin type value");
    });

    QUnit.test("Method setMarginConfig with invalid margin top value", function (assert) {
        var newMarginConfig = {
            marginLeft: 5,
            marginBottom: 5,
            marginRight: 5,
            marginTop: 100,
            marginLocked: true,
            marginType: "custom"
        };
        try {
            this.printConfig._setMarginConfig(newMarginConfig);
        } catch (e) {
            assert.equal(e.code,"RANGE_ERROR","Range Error is thrown");
        }
    });

    QUnit.test("Method setMarginConfig with invalid margin type value", function (assert) {
        var newMarginConfig = {
            marginTop: 10,
            marginLocked: true,
            marginType: "abc"
        };
        try {
            this.printConfig._setMarginConfig(newMarginConfig);
        } catch (e) {
            assert.equal(e.code,"RANGE_ERROR","Range Error is thrown");
        }
    });

    QUnit.test("Method setTextConfig with different values", function (assert) {
        var newTextConfig = {
            showHeaderText: false,
            showFooterText: false,
            headerText: "Header",
            footerText: "Footer"
        };
        this.printConfig._setTextConfig(newTextConfig);
        assert.deepEqual(this.printConfig._getTextConfig(), newTextConfig, "setTextConfig sets correct value");
        assert.equal(this.printConfig._getTextConfig().showHeaderText, false, "setTextConfig sets correct showHeaderText value");
        assert.equal(this.printConfig._getTextConfig().showFooterText, false, "setTextConfig sets correct showFooterText value");
        assert.equal(this.printConfig._getTextConfig().headerText, "Header", "setTextConfig sets correct headerText value");
    });

    QUnit.test("Method setTextConfig with invalid value for showHeaderText", function (assert) {
        var newTextConfig = {
            showHeaderText: "false"
        };
        try {
            this.printConfig._setTextConfig(newTextConfig);
        } catch (e) {
            assert.equal(e.code,"TYPE_ERROR","Type Error is thrown");
        }
    });

    QUnit.test("Method setTextConfig with invalid value for header text", function (assert) {
        var newTextConfig = {
            showHeaderText: true,
            showFooterText: true,
            headerText: 5,
            footerText: "Footer"
        };
        try {
            this.printConfig._setTextConfig(newTextConfig);
        } catch (e) {
          assert.equal(e.code,"TYPE_ERROR","Type Error is thrown");
        }
    });

    QUnit.test("Method getPageConfig should return page configuration", function (assert) {
        assert.deepEqual(this.printConfig._getPageConfig(), this.pageConfig, "getPageConfig returns correct value");
    });

    QUnit.test("Method setPageConfig with different values", function (assert) {
        var newPageConfig = {
            paperHeight: 20,
            paperWidth: 20,
            unit: "mm",
            portrait: true,
            showPageNumber: true
        };
        this.printConfig._setPageConfig(newPageConfig);
        assert.deepEqual(this.printConfig._getPageConfig(), newPageConfig, "setPageConfig sets correct value");
        assert.equal(this.printConfig._getPageConfig().paperSize, "A4", "setPageConfig sets correct paperSize value");
        assert.equal(this.printConfig._getPageConfig().paperHeight, 297, "setPageConfig sets A4 paperHeight value");
        assert.equal(this.printConfig._getPageConfig().paperWidth, 210, "setPageConfig sets A4 paperWidth value");
        var newPageConfig1 = {
            paperSize: "Letter"
        };
        this.printConfig._setPageConfig(newPageConfig1);
        assert.deepEqual(this.printConfig._getPageConfig(), newPageConfig1, "setPageConfig sets correct value");
        assert.equal(this.printConfig._getPageConfig().unit, "in", "setPageConfig sets Letter unit value as inch");
    });

    QUnit.test("Method setPageConfig with invalid page size", function (assert) {
        var newPageConfig = {
            paperHeight: 20,
            paperWidth: 20,
            paperSize: "abc",
            portrait: true,
            showPageNumber: true
        };
        try {
            this.printConfig._setPageConfig(newPageConfig);
        } catch (e) {
            assert.equal(e.code,"RANGE_ERROR","Range Error is thrown");
        }
    });

    QUnit.test("Method setPageConfig with Custom page size", function (assert) {
        var newPageConfig = {
            paperSize: "Custom"
        };
        try {
            this.printConfig._setPageConfig(newPageConfig);
        } catch (e) {
            assert.equal(e.code,"REQUIRED_ERROR","Required Error is thrown for missing height width");
        }
        var newPageConfig1 = {
            paperSize: "Custom",
            paperHeight: "20",
            paperWidth: "20"
        };
        try {
            this.printConfig._setPageConfig(newPageConfig1);
        } catch (e) {
            assert.equal(e.code,"TYPE_ERROR","Type Error is thrown");
        }
    });

    QUnit.test("Method setPageConfig with invalid unit", function (assert) {
        var newPageConfig = {
            unit: "5ee"
        };
        try {
            this.printConfig._setPageConfig(newPageConfig);
        } catch (e) {
            assert.equal(e.code,"RANGE_ERROR","Range Error is thrown");
        }
    });

    QUnit.test("Method getDurationConfig should return duartion configuration", function (assert) {
        assert.deepEqual(this.printConfig._getDurationConfig(), this.durationConfig, "getDurationConfig returns correct value");
    });
    QUnit.test("Method setDurationConfig with duration as 'all'", function (assert) {
        var newDurationConfig = {
            duration: "all",
            startDate: new Date(),
            endDate: new Date()
        };
        this.printConfig._setDurationConfig(newDurationConfig);
        assert.deepEqual(this.printConfig._getDurationConfig(), newDurationConfig, "setDurationConfig sets correct value");
        assert.equal(this.printConfig._getDurationConfig().duration, "all", "setDurationConfig sets correct duration value");
    });

    QUnit.test("Method setDurationConfig with invalid duration", function (assert) {
        var newDurationConfig = {
            duration: "5ee",
            startDate: new Date(),
            endDate: new Date()
        };
        try {
            this.printConfig._setDurationConfig(newDurationConfig);
        } catch (e) {
            assert.equal(e.code,"RANGE_ERROR","Range Error is thrown");
        }
    });

    QUnit.test("Method setDurationConfig with duration missing", function (assert) {
        var newDurationConfig = {
            startDate: new Date(),
            endDate: new Date()
        };
        try {
            this.printConfig._setDurationConfig(newDurationConfig);
        } catch (e) {
            assert.equal(e.code,"REQUIRED_ERROR","Range Error is thrown");
        }
    });

    QUnit.test("Method setExportConfig with different values", function (assert) {
        var newExportConfig = {
            exportAsJPEG: false,
            exportRange: "0,1",
            exportAll: false,
            compressionQuality: 1,
            scale:50,
            multiplePage: true
        };
        this.printConfig._setExportConfig(newExportConfig);
        assert.deepEqual(this.printConfig._getExportConfig(), newExportConfig, "setExportConfig sets correct value");
        assert.equal(this.printConfig._getExportConfig().exportAsJPEG, false, "setExportConfig sets correct exportAsJPEG value");
        assert.equal(this.printConfig._getExportConfig().exportRange, "0,1", "setExportConfig sets correct exportRange value");
        assert.equal(this.printConfig._getExportConfig().exportAll, false, "setExportConfig sets correct exportAll value");
        assert.equal(this.printConfig._getExportConfig().compressionQuality, 1, "setExportConfig sets correct compressionQuality value");
        assert.equal(this.printConfig._getExportConfig().scale, 50, "setExportConfig sets correct scale value");
        assert.equal(this.printConfig._getExportConfig().multiplePage, true, "setExportConfig sets correct multiplePage value");
    });

    QUnit.test("Method setExportConfig with invalid range", function (assert) {
        var newExportConfig = {
            exportAsJPEG: false,
            exportRange: 123,
            exportAll: false,
            compressionQuality: 1,
            scale: 50,
            multiplePage: true
        };
        try {
            this.printConfig._setExportConfig(newExportConfig);
        } catch (e) {
            assert.equal(e.code,"TYPE_ERROR","Type Error is thrown");
        }
    });

    QUnit.test("Method setExportConfig with invalid scale", function (assert) {
        var newExportConfig = {
            exportAsJPEG: false,
            exportRange: "0,1",
            exportAll: false,
            compressionQuality: 1,
            scale: 345,
            multiplePage: true
        };
        try {
            this.printConfig._setExportConfig(newExportConfig);
        } catch (e) {
            assert.equal(e.code,"RANGE_ERROR","Range Error is thrown");
        }
    });
    QUnit.test("Method setExportConfig with invalid multiple page", function (assert) {
        var newExportConfig = {
            exportAsJPEG: false,
            exportRange: "0,1",
            exportAll: false,
            compressionQuality: 1,
            scale: 50,
            multiplePage: "5ee"
        };
        try {
            this.printConfig._setExportConfig(newExportConfig);
        } catch (e) {
            assert.equal(e.code,"TYPE_ERROR","Type Error is thrown");
        }
    });

    QUnit.test("Method setExportConfig with invalid export as jpeg", function (assert) {
        var newExportConfig = {
            exportAsJPEG: "5ee",
            exportRange: "0,1",
            exportAll: false,
            compressionQuality: 1,
            scale: 50,
            multiplePage: true
        };
        try {
            this.printConfig._setExportConfig(newExportConfig);
        } catch (e) {
           assert.equal(e.code,"TYPE_ERROR","Type Error is thrown");
        }
    });

    QUnit.test("Method setExportConfig with invalid compression quality", function (assert) {
        var newExportConfig = {
            compressionQuality: "abc"
        };
        try {
            this.printConfig._setExportConfig(newExportConfig);
        } catch (e) {
            assert.equal(e.code,"TYPE_ERROR","Type Error is thrown");
        }
        var newExportConfig1 = {
            compressionQuality: 200
        };
        try {
            this.printConfig._setExportConfig(newExportConfig1);
        } catch (e) {
            assert.equal(e.code,"RANGE_ERROR","Type Error is thrown");
        }
    });
});