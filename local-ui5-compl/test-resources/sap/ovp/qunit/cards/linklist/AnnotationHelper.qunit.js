/*global QUnit*/

sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "sap/ovp/cards/linklist/AnnotationHelper"
], function (utils, AnnotationHelper) {
    "use strict";

    QUnit.module("sap.ovp.cards.linklist.AnnotationHelper", {
        beforeEach: function () { },
        afterEach: function () { },
    });

    QUnit.test("AnnotationHelper - getSorters, descending sort", function (assert) {
        var oContext = new utils.ContextMock({
            ovpCardProperties: {
                "/sortBy": "sortProperty",
                "/sortOrder": "descending",
            },
        });
        var ovpCardProperties = oContext.getSetting("ovpCardProperties");
        var aSorter = AnnotationHelper.getSorters(ovpCardProperties);
        assert.ok(Array.isArray(aSorter));
        assert.ok(aSorter[0].path === "sortProperty");
        assert.ok(aSorter[0].descending === true);
    });

    QUnit.test("AnnotationHelper - getSorters, ascending sort", function (assert) {
        var oContext = new utils.ContextMock({
            ovpCardProperties: {
                "/sortBy": "sortProperty",
                "/sortOrder": "ascending",
            },
        });
        var ovpCardProperties = oContext.getSetting("ovpCardProperties");
        var aSorter = AnnotationHelper.getSorters(ovpCardProperties);
        assert.ok(Array.isArray(aSorter));
        assert.ok(aSorter[0].path === "sortProperty");
        assert.ok(aSorter[0].descending === false);
    });

    QUnit.test("AnnotationHelper - isValidURL, valid url check", function (assert) {
        var urlHTTP = "http://www.sap.com";
        var urlHTTPS = "https://www.sap.com";
        assert.ok(AnnotationHelper.isValidURL(urlHTTP));
        assert.ok(AnnotationHelper.isValidURL(urlHTTPS));
    });

    QUnit.test("AnnotationHelper - isValidURL, invalid url check", function (assert) {
        assert.ok(!AnnotationHelper.isValidURL("www.sap.com"));
        assert.ok(!AnnotationHelper.isValidURL("sap.com"));
    });

    QUnit.test("AnnotationHelper - getIconPath, check icon string", function (assert) {
        var iContext = {
            getModel: function () {
                return {
                    oModel: {
                        getODataVersion: function () {
                            return "4.0";
                        }
                    }
                }
            }
        }
        var iconString = "sap-icon://addresses";
        assert.ok(AnnotationHelper.getIconPath(iContext, iconString) === iconString);
    });

    QUnit.test("AnnotationHelper - getIconPath, check icon path binding", function (assert) {
        var iContext = {
            getModel: function () {
                return {
                    oModel: {
                        getODataVersion: function () {
                            return "4.0";
                        }
                    }
                }
            }
        }
        var oIconPath = { $Path: "iconPath" };
        var sResult = "{iconPath}";
        assert.ok(AnnotationHelper.getIconPath(iContext, oIconPath) === sResult);
    });

    QUnit.test("AnnotationHelper - formUrl, check formed URL", function (assert) {
        var sBasePath = "/static";
        var sImage1Path = "img/image1.jpg";
        var sImage2Path = "/img/image2.jpg";
        var sImage3Path;
        assert.ok(AnnotationHelper.formUrl(sBasePath, sImage1Path) === "/static/img/image1.jpg");
        assert.ok(AnnotationHelper.formUrl(sBasePath, sImage2Path) === "/static/img/image2.jpg");
        assert.ok(AnnotationHelper.formUrl(sBasePath, sImage3Path) === undefined);
    });
});
