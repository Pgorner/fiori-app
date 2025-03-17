sap.ui.define([
    "sap/ovp/insights/helpers/ContentHelper"
], function(ContentHelper) {
    "use strict";

    QUnit.test("ContentHelper  - function: addBrackets", function (assert) {
        assert.ok(ContentHelper.addBrackets("pathName") === "{pathName}", "Bracket is added to a path.");
        assert.ok(ContentHelper.addBrackets("{pathName}") === "{pathName}", "Additional unwanted bracket is not added to a path.");
        assert.ok(ContentHelper.addBrackets("{= ${pathName}}") === "{= ${pathName}}", "Additional unwanted bracket is not added to an expression.");
    });

    QUnit.test("ContentHelper  - function: getHeaderStatus", function (assert) {
        var oBatch;
        assert.deepEqual(ContentHelper.getHeaderStatus(oBatch), { text: "{= ${/d/__count} === '0' ? '' : extension.formatters.formatHeaderCount( ${/d/__count}) }" }, "Header status with count when there is call without batch.");
        oBatch = {batch: true};
        assert.deepEqual(ContentHelper.getHeaderStatus(oBatch), { "text": "{= ${/content/d/__count} === '0' ? '' : extension.formatters.formatHeaderCount( ${/content/d/__count}) }" }, "Header status with count when there is call with batch.");
    });

    QUnit.test("ContentHelper  - function: getData", function (assert) {
        var oBatch;
        assert.deepEqual(ContentHelper.getData(oBatch), { path: "/d/results" }, "Data path when there is call without batch.");
        oBatch = {batch: true};
        assert.deepEqual(ContentHelper.getData(oBatch), { path: "/content/d/results" }, "Data path when there is call with batch.");
    });

    QUnit.test("ContentHelper  - function: isAnExpression", function (assert) {
        assert.equal(ContentHelper.isAnExpression("{= ${pathName}}"), true, "String is an expression.");
        assert.equal(ContentHelper.isAnExpression("{pathName}"), false, "Path String is not an expression.");
        assert.equal(ContentHelper.isAnExpression("pathName"), false, "String is not an expression.");
    });

    QUnit.test("ContentHelper  - function: buildValueStateExpression", function (assert) {
        var sStateType = "color";
        assert.equal(ContentHelper.buildValueStateExpression("{= ${pathName}}"), "{= ${pathName}}", "Returns expression directly when expression is already present.");
        assert.equal(ContentHelper.buildValueStateExpression("Good", sStateType), "{= extension.formatters.formatCriticality('Good', 'color')}", "Returns new expression with value.");
        assert.equal(ContentHelper.buildValueStateExpression("{pathName}", sStateType), "{= extension.formatters.formatCriticality(${pathName}, 'color')}", "Returns new expression with path variable.");
    });

    QUnit.test("ContentHelper  - function: getBindingPathOrValue", function (assert) {
        // check empty
        var sPropertyName, sExpectedExpression;
        var oProperties = {
                property1: "property1Value", // vaue
                property2: "{property2Path}", // single path binding
                property3: {
                    parts: [{ path : '{property3Path}'}]
                },
                property4: {
                    parts: [{ path : '{property4Path}'}],
                    type: {
                        oFormat: {
                            oFormatOptions: {
                                "percentSign": "%",
                                "pattern": "#,##0.###"
                            }
                        }
                    }
                },
                property5: {
                    parts: [{ path : '{property5Path}'},
                        {
                            "value": {
                                "dateFormat": {
                                    "relative": true,
                                    "relativeScale": "auto",
                                    "bUTC": false
                                },
                                "bUTC": false,
                                "functionName": "CardAnnotationhelper.formatDate"
                            },
                            "model": "ovpCardProperties",
                            "mode": "OneWay"
                        }],
                    formatter: function() {}
                },
                property6: {
                    parts: [{ path : '{property6Path1}'}, { path : '{property6Path2}'},
                        {
                            "value": {
                                "numberOfFractionalDigits": "0",
                                "scaleFactor": "1000",
                                "functionName": "CardAnnotationhelper.formatCurrency"
                            },
                            "model": "ovpCardProperties",
                            "mode": "OneWay"
                        }],
                    formatter: function() {}
                },
                property7: {
                    parts: [{ path : '{property7Path1}'}, { path : '{property7Path2}'},
                        {
                            "value": {
                                "numberOfFractionalDigits": 1,
                                "functionName": "CardAnnotationhelper.formatNumberCalculation"
                            },
                            "model": "ovpCardProperties",
                            "mode": "OneWay"
                        }],
                    formatter: function() {}
                }
            };
        var oControl = {
                getProperty: function (propertyName) {
                    return oProperties[propertyName];
                },
                getBindingInfo: function () {
                    return;
                },
                getBindingPath: function (propertyName) {
                    return oProperties[propertyName];
                }
            };
        assert.equal(ContentHelper.getBindingPathOrValue(oControl, sPropertyName), null, "Returned null when parameters are empty.");
        // check direct value
        sPropertyName = "property1";
        assert.equal(ContentHelper.getBindingPathOrValue(oControl, sPropertyName), "property1Value", "Returned property value when binding is not present.");
        // check simple binding
        oControl.getBindingInfo = function (propertyName) {
            return oProperties[propertyName];
        };
        sPropertyName = "property2";
        assert.equal(ContentHelper.getBindingPathOrValue(oControl, sPropertyName), "{property2Path}", "Returned property path when simple binding is present.");
        // check binding with parts
        sPropertyName = "property3";
        assert.equal(ContentHelper.getBindingPathOrValue(oControl, sPropertyName), "{property3Path}", "Returned property path when single path is present but in parts.");

        // check binding with parts and type with formatter
        sPropertyName = "property4";
        sExpectedExpression = "{= extension.formatters.formatNumber({'percentSign':'%','pattern':'#,##0.###'},[0],${{property4Path}})}";
        assert.equal(ContentHelper.getBindingPathOrValue(oControl, sPropertyName), sExpectedExpression, "Returned expression with formatting from 'type'.");

        // date formatter
        sPropertyName = "property5";
        sExpectedExpression = "{= extension.formatters.formatDate(${{property5Path}}, {'relative':true,'relativeScale':'auto','bUTC':false})}";
        assert.equal(ContentHelper.getBindingPathOrValue(oControl, sPropertyName), sExpectedExpression, "Returned expression with date formatter");

        // currency formatter
        sPropertyName = "property6";
        sExpectedExpression = "{= extension.formatters.formatCurrency({'numberOfFractionalDigits':'0','scaleFactor':'1000'},false,${{property6Path1}},${{property6Path2}})}";
        assert.equal(ContentHelper.getBindingPathOrValue(oControl, sPropertyName), sExpectedExpression, "Returned expression with currency formatter");

        // formatNumberCalculation formatter
        sPropertyName = "property7";
        sExpectedExpression = "{= extension.formatters.formatNumber({'numberOfFractionalDigits':1},[0],${{property7Path1}},${{property7Path2}})}";
        assert.equal(ContentHelper.getBindingPathOrValue(oControl, sPropertyName), sExpectedExpression, "Returned expression with formatNumberCalculation formatter");

    });  
});
