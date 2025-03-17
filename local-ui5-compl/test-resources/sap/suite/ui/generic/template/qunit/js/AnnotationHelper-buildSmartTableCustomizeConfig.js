sap.ui.define(["sap/suite/ui/generic/template/js/AnnotationHelper"],
    function (AnnotationHelper) {

        var oModel = {
            getODataProperty: function (oType, vName, bAsPath) {
                var oODataProperty = null;
                if (oType.name === "STTA_C_MP_ProductType" && vName === "CanDelete") {
                    oODataProperty = { name: "CanDelete", type: "Edm.Boolean" };
                } else if (oType.name === "STTA_C_MP_ProductRestrictionType" && vName === "CanDelete") {
                    oODataProperty = { name: "CanDelete", type: "Edm.Boolean" };
                }
                return oODataProperty;
            },
            getODataEntityType: function (sQualifiedName, bAsPath) {
                var oODataEntityType = null;
                if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductType") {
                    oODataEntityType = { name: "STTA_C_MP_ProductType" };
                } else if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductRestrictionType") {
                    oODataEntityType = { name: "STTA_C_MP_ProductRestrictionType" };
                }
                return oODataEntityType;
            },
            getODataAssociationEnd: function (oEntityType, sName) {
                var oODataAssociationEnd = null;
                if (sName === "to_ProductText") {
                    oODataAssociationEnd = {
                        entitySet: "STTA_C_MP_ProductText",
                        type: "STTA_PROD_MAN.STTA_C_MP_ProductRestrictionType",
                        multiplicity: "0..*"
                    };
                }
                return oODataAssociationEnd;
            },
            getODataAssociationSetEnd: function (oEntityType, sName) {
                if (sName === "to_ProductText") {
                    oODataAssociationEnd = {
                        entitySet: "STTA_C_MP_ProductText"
                    };
                }
                return oODataAssociationEnd;
            },
            getODataEntitySet: function (sName) {
                return that.oSourceEntitySet;
            }
        };

        var oInterface = {
            getInterface: function (i) {
                return (i === 0) && {
                    getModel: function () {
                        return oModel;
                    }
                };
            }
        };

        this.oSourceEntitySet = {
            "entityType": "STTA_PROD_MAN.STTA_C_MP_ProductType",
            "name": "STTA_C_MP_Product"
        };

        this.oRelatedEntitySet = {
            "entityType": "STTA_PROD_MAN.STTA_C_MP_ProductTextType",
            "name": "STTA_C_MP_ProductText"
        };

        function fnCreateSourceEntitySetWithInsertRestrictions(oInsertRestrictions) {
            var oSourceEntitySet = {
                name: "STTA_C_MP_Product",
                entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
                "Org.OData.Capabilities.V1.NavigationRestrictions": {
                    "RestrictedProperties": [
                        {
                            "InsertRestrictions": oInsertRestrictions,
                            "NavigationProperty": {
                                "NavigationPropertyPath": "to_ProductText"
                            }
                        }
                    ]
                }
            };
            return oSourceEntitySet;
        }

        QUnit.module("Tests for buildSmartTableCustomizeConfig", {

        });

        QUnit.test("Navigation restriction with insertable property as (Bool=true)", function (assert) {
            //Setup
            var oInsertRestrictions = {
                "Insertable": {
                    "Bool": "true"
                }
            };
            var oSourceEntitySetWithBooleanTrue = fnCreateSourceEntitySetWithInsertRestrictions(oInsertRestrictions);
            var oExpectedIgnoreInsertRestrictions = { "*": true };

            //Action
            var sCustomizeConfig = AnnotationHelper.buildSmartTableCustomizeConfig(oInterface, oSourceEntitySetWithBooleanTrue, oRelatedEntitySet);

            //Assertion
            var oCustomizeConfig = JSON.parse(sCustomizeConfig);
            assert.deepEqual(oCustomizeConfig["ignoreInsertRestrictions"], oExpectedIgnoreInsertRestrictions, "Customize config contains 'ingoreInsertRestrictions' object with entry {* = true}");
        });

        QUnit.test("Navigation restriction with insertable property as (Bool=false)", function (assert) {
            //Setup
            var oInsertRestrictions = {
                "Insertable": {
                    "Bool": "false"
                }
            };
            var oSourceEntitySetWithBooleanTrue = fnCreateSourceEntitySetWithInsertRestrictions(oInsertRestrictions);
            var oExpectedIgnoreInsertRestrictions = { "*": false };

            //Action
            var sCustomizeConfig = AnnotationHelper.buildSmartTableCustomizeConfig(oInterface, oSourceEntitySetWithBooleanTrue, oRelatedEntitySet);

            //Assertion
            var oCustomizeConfig = JSON.parse(sCustomizeConfig);
            assert.deepEqual(oCustomizeConfig["ignoreInsertRestrictions"], oExpectedIgnoreInsertRestrictions, "Customize config contains 'ingoreInsertRestrictions' object with entry {* = false}");
        });

        QUnit.test("Navigation restriction with insertable property path", function (assert) {
            //Setup
            var oInsertRestrictions = {
                "Insertable": {
                    "Path": "Activation_ac"
                }
            };
            var oSourceEntitySetWithBooleanTrue = fnCreateSourceEntitySetWithInsertRestrictions(oInsertRestrictions);
            var oExpectedIgnoreInsertRestrictions = { "*": true };

            //Action
            var sCustomizeConfig = AnnotationHelper.buildSmartTableCustomizeConfig(oInterface, oSourceEntitySetWithBooleanTrue, oRelatedEntitySet);

            //Assertion
            var oCustomizeConfig = JSON.parse(sCustomizeConfig);
            assert.deepEqual(oCustomizeConfig["ignoreInsertRestrictions"], oExpectedIgnoreInsertRestrictions, "Customize config contains 'ingoreInsertRestrictions' object with entry {* = true}");
        });

        QUnit.test("Source entity without navigation restriction", function (assert) {
            var oSourceEntitySetWithoutInsertRestrictions = fnCreateSourceEntitySetWithInsertRestrictions(null);
            var oExpectedCustomizeConfig = {
                "clientSideMandatoryCheck": {
                    "*": false
                }
            };

            //Action
            var sCustomizeConfig = AnnotationHelper.buildSmartTableCustomizeConfig(oInterface, oSourceEntitySetWithoutInsertRestrictions, oRelatedEntitySet);
            var oCustomizeConfig = JSON.parse(sCustomizeConfig);

            //Assertion
            assert.deepEqual(oCustomizeConfig, oExpectedCustomizeConfig, "Customize config should not have navigation property");
        });

        QUnit.test("Client side mandatory check Disabled for OP smart table", function (assert) {
            var oExpectedCustomizeConfig = {
                "clientSideMandatoryCheck": {
                    "*": false
                }
            };

            //Action
            var sCustomizeConfig = AnnotationHelper.buildSmartTableCustomizeConfig(oInterface, oSourceEntitySet, oRelatedEntitySet);
            var oCustomizeConfig = JSON.parse(sCustomizeConfig);

            //Assertion
            assert.deepEqual(oCustomizeConfig, oExpectedCustomizeConfig, "Customize config have client side mandatory check turned off");
        });
    }
);