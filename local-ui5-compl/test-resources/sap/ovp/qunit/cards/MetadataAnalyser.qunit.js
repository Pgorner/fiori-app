/*global QUnit*/

sap.ui.define([
    "sap/ovp/cards/MetadataAnalyser"
], function (MetadataAnalyser) {
    "use strict";

    //Main EntitySet
    var oMainEntitySet = {
        entityType: "oMainEntityType",
        type: "oMainEntityType",
        entitySet: "Main Entity Set",
    };
    var oMainEntityType = {
        property: ["property1", "property2"],
        navigationProperty: [
            {
                name: "NavigationEntity1",
            },
            {
                name: "ParametricEntity1",
            },
        ],
    };

    // Entity Set Containing Parameter
    var oParametricEntitySet = {
        entityType: "oParametricEntityType",
        type: "oParametricEntityType",
        entitySet: "Entity With Parameters",
    };

    var oParametricEntityType = {
        key: {
            propertyRef: [
                {
                    name: "param1",
                },
                {
                    name: "param2",
                },
            ],
        },
        navigationProperty: [
            {
                name: "MainEntitySet",
            },
        ],
        "sap:semantics": "parameters",
        "property": [
            {
                "name": "param1",
                "type": "string"
            },
            {
                "name": "param2",
                "type": "string"
            },
            {
                "name": "param3",
                "type": "string"
            }
        ]
    };

    // Navigation Entity Set.
    var oNavigationEntitySet = {
        entityType: "RandomEntityType",
        type: "RandomEntityType",
        entitySet: "ParametricEntity1",
    };

    var oNavigationEntityType = {
        property: ["Nproperty1", "Nproperty2", "Nproperty3", "Nproperty4"],
        navigationProperty: [
            {
                name: "RandomEntitySet",
            },
        ],
        "sap:semantics": "aggregate",
    };

    var oMetaModel = {
        getODataEntitySet: function (sEntitySet) {
            switch (sEntitySet) {
                case "MainEntitySet":
                    return oMainEntitySet;
                case "ParametricEntity1":
                    return oParametricEntitySet;
                case "NavigationEntity1":
                    return oNavigationEntitySet;
            }
        },
        getODataEntityType: function (sEntityType) {
            switch (sEntityType) {
                case "oMainEntityType":
                    return oMainEntityType;
                case "oParametricEntityType":
                    return oParametricEntityType;
                case "RandomEntityType":
                    return oNavigationEntityType;
            }
        },
        getODataAssociationEnd: function (oEntityType, sNavigationName) {
            return this.getODataEntitySet(sNavigationName);
        },
        getODataAssociationSetEnd: function (oEntityType, sNavigationName) {
            return this.getODataEntitySet(sNavigationName);
        },
    };

    var oMetadataAnalyser;
    var oController = {
        getOwnerComponent: function () {
            return {
                getAppComponent: function () {
                    return {
                        getModel: function () {
                            return {
                                getMetaModel: function () {
                                    return oMetaModel;
                                },
                            };
                        },
                    };
                },
            };
        },
    };
    var oSandbox;

    function fnGeneralSetup() {
        oSandbox = sinon.sandbox.create();
    }

    function fnGeneralTeardown() {
        oSandbox.restore();
    }

    QUnit.module("Test for retrieving parameter by EntitySet name", {
        beforeEach: fnGeneralSetup,
        afterEach: fnGeneralTeardown,
    });

    QUnit.test("Test if parameter is returned is correct", function (assert) {
        var oComponent = oController.getOwnerComponent();
        var oAppComponent = oComponent.getAppComponent();
        var oResult = MetadataAnalyser.getParametersByEntitySet(oAppComponent.getModel(), "MainEntitySet");
        assert.strictEqual(oResult.entitySetName, "Entity With Parameters", "Entity Set name is correct");
        assert.strictEqual(oResult.navPropertyName, "MainEntitySet", "Navigation Property contains parameters");
        assert.strictEqual(oResult.parameters.length, 2, "Parameters retrieved correctly");
        assert.strictEqual(oResult.parameters[0], 'param1', "First Parameter retrieved correctly");
        assert.strictEqual(oResult.parameters[1], 'param2', "second Parameter retrieved correctly");
        oResult = MetadataAnalyser.getParametersByEntitySet(oAppComponent.getModel(), "MainEntitySet", true);
        assert.strictEqual(oResult.parameters.length, 2, "Parameters retrieved correctly");
        //parameters are fully retrived i.e. both name and string property retrived for parameters
        assert.strictEqual(oResult.parameters[0].name, 'param1', "First Parameter name is retrieved correctly");
        assert.strictEqual(oResult.parameters[0].type, 'string', "First Parameter name is retrieved correctly");
        assert.strictEqual(oResult.parameters[1].name, 'param2', "Second Parameter name is retrieved correctly");
        assert.strictEqual(oResult.parameters[1].type, 'string', "Second Parameter name is retrieved correctly");
    });

    QUnit.module("Test to get property from EntitySet name", {
        beforeEach: fnGeneralSetup,
        afterEach: fnGeneralTeardown,
    });

    QUnit.test("Test if property retrieved from EntitySet is correct", function (assert) {
        var oComponent = oController.getOwnerComponent();
        var oAppComponent = oComponent.getAppComponent();
        var aProperty = MetadataAnalyser.getPropertyOfEntitySet(oAppComponent.getModel(), "NavigationEntity1");
        assert.strictEqual(aProperty.length, 4, "All properties retreived.");
    });

    QUnit.module("Test to check for analytical parameterised entity set", {
        beforeEach: fnGeneralSetup,
        afterEach: fnGeneralTeardown,
    });

    QUnit.test("Test for analytical parameterised test", function (assert) {
        var oComponent = oController.getOwnerComponent();
        var oAppComponent = oComponent.getAppComponent();
        var aProperty = MetadataAnalyser.checkAnalyticalParameterisedEntitySet(
            oAppComponent.getModel(),
            "NavigationEntity1"
        );
        assert.strictEqual(aProperty, true, "Analytical Parameterized Entity Set");
    });

    QUnit.test("getPropertyFromEntityType - extracts and returns the property information from the entity type", function (assert) {
        var sPropertyPath = "category";
        var oEntityType = {
            "name": "Books",
            "property": [
                {
                    "name": "amount",
                    "type": "Edm.Int32"
                },
                {
                    "name": "category",
                    "type": "Edm.String"
                }
            ]
        };
        var aProertyInfo = MetadataAnalyser.getPropertyFromEntityType(sPropertyPath, oEntityType);
        assert.deepEqual(
            aProertyInfo, 
            [{
                "name": "category",
                "type": "Edm.String"
            }],
            "Property info extracted");
    });
});
