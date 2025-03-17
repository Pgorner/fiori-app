sap.ui.define([
    "sap/ovp/helpers/V4/MetadataAnalyzer",
    "sap/ui/model/odata/v4/ODataModel"
], function (
    V4MetadataAnalyser,
    ODataModel
) {
    "use strict";

    QUnit.test("V4MetadataAnalyser - getParametersByEntitySet, Extract properties of parameter EntitySet with other relevant informations", function (assert) {
        var oEntityContainer = {
            "$kind": "EntityContainer",
            "Books": {
                "$kind": "EntitySet",
                "$Type": "CatalogService.Books",
                "$NavigationPropertyBinding": { "author": "Authors" },
                "entityType": "CatalogService.Books"
            },
            "Authors": {
                "$kind": "EntitySet",
                "$Type": "CatalogService.Authors",
                "$NavigationPropertyBinding": { "books": "Books" }
            },
        };
        var oModelData = {
            "$Version": "4.0",
            "CatalogService.": { "$kind": "Schema" },
            "CatalogService.EntityContainer": oEntityContainer,
            "$EntityContainer": "CatalogService.EntityContainer",
            "CatalogService.Books": {
                "$kind": "EntityType",
                "$Key": ["ID"],
                "ID": {
                    "$kind": "Property",
                    "$Type": "Edm.Int32"
                },
                "title": {
                    "$kind": "Property",
                    "$Type": "Edm.String"
                },
                "author": {
                    "$kind": "NavigationProperty",
                    "$Type": "CatalogService.Authors",
                    "$Partner": "books",
                    "$ReferentialConstraint": { "author_ID": "ID", "author_name": "name" }
                }
            },
            "CatalogService.Authors": {
                "$kind": "EntityType",
                "$Key": ["ID", "name"],
                "ID": { "$kind": "Property", "$Type": "Edm.Int32", "$Nullable": false },
                "name": { "$kind": "Property", "$Type": "Edm.String", "$Nullable": false },
                "WeightUnit": { "$kind": "Property", "$Type": "Edm.String" },
                "books": {
                    "$kind": "NavigationProperty",
                    "$isCollection": true,
                    "$Type": "CatalogService.Books",
                    "$Partner": "author"
                }
            },
            "$Annotations": {
                "CatalogService.Authors": { "@SAP__common.ResultContext": true },
                "CatalogService.EntityContainer/Authors": {
                    "@SAP__common.ResultContext": true
                }
            },
            "my.bookshop.EntityContainer.": { "$kind": "Schema" }
        };
        var sUrl = "/ovp/catalog/",
            mModelOptions = {
                serviceUrl: sUrl,
                groupId: "$direct",
                autoExpandSelect: true,
                operationMode: "Server"
            },
            oModel = new ODataModel(mModelOptions);

        sinon.stub(oModel.getMetaModel(), "getObject").callsFake(function () { return oEntityContainer; });
        sinon.stub(oModel.getMetaModel(), "getData").callsFake(function () { return oModelData; });
        var oEntitySet = { "$kind": "EntitySet", "$Type": "CatalogService.Books", "$NavigationPropertyBinding": { "author": "Authors" } };
        var oResult = V4MetadataAnalyser.getParametersByEntitySet(oModel, oEntitySet, true);
        assert.deepEqual(
            oResult,
            { "entitySetName": "Authors", "parameters": [{ "name": "ID" }, { "name": "name" }], "navPropertyName": "CatalogService.Books" },
            "Extract properties of a V4 paramterized entity set"
        );
    });

    QUnit.test("getPropertyFromEntityType - extracts and returns the property information from the entity type", function (assert) {
        var sPropertyPath = "amount";
        var oEntityType = {
            "name": "Books",
            "property": {
                "$kind": "EntityType",
                "$Key": ["ID"],
                "ID": {
                    "$kind": "Property",
                    "$Type": "Edm.Int32"
                },
                "title": {
                    "$kind": "Property",
                    "$Type": "Edm.String"
                },
                "amount": {
                    "$kind": "Property",
                    "$Type": "Edm.Int32",
                }
            }
        };
        var aProertyInfo = V4MetadataAnalyser.getPropertyFromEntityType(sPropertyPath, oEntityType);
        assert.deepEqual(
            aProertyInfo,
            [{"$kind":"Property","$Type":"Edm.Int32"}],
            "Property info extracted");
    });

    QUnit.test("getPropertyFromEntityType - when oEntityType is not provided", function (assert) {
        var sPropertyPath = "amount";
        var oEntityType;
        var aProertyInfo = V4MetadataAnalyser.getPropertyFromEntityType(sPropertyPath, oEntityType);
        assert.ok(aProertyInfo, "check if aPropertyInfo is returned even if oEntityType is not provided");
    });
});
