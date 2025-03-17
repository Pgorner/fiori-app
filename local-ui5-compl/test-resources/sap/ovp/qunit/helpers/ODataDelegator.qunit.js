sap.ui.define([
    "sap/ovp/helpers/ODataDelegator",
    "sap/ovp/cards/MetadataAnalyser",
    "sap/ovp/helpers/V4/MetadataAnalyzer"
], function (
    ODataDelegator,
    V2MetadataAnalyser,
    V4MetadataAnalyser
) {
    "use strict";

    QUnit.test("ODataDelegator - getParametersByEntitySet, should call / delegate responsiblity to the appropriate handler based on model version", function (assert) {
        var oEntitySet = {
            "name": "Books",
            "entityType": "CatalogService.Books",
            "Org.OData.Capabilities.V1.SearchRestrictions": {"Searchable": {"Bool": "false"}}
        };
        var v2spy = sinon.stub(V2MetadataAnalyser, "getParametersByEntitySet").callsFake(function (){return true;});
        var v4spy = sinon.stub(V4MetadataAnalyser, "getParametersByEntitySet").callsFake(function (){return true;});

        //v2 model
        var oModel = {
            getODataVersion: function () {
                return "2.0";
            }
        };
        ODataDelegator.getParametersByEntitySet(oModel, oEntitySet);
        assert.ok(v2spy.called, "V2 metadata analyzer gets called");

        //V4 model
        oModel.getODataVersion = function () {
            return "4.0";
        }
        ODataDelegator.getParametersByEntitySet(oModel, oEntitySet);
        assert.ok(v4spy.called, "V4 metadata analyzer gets called");

    });

    QUnit.test("ODataDelegator - getPropertyFromEntityType, should call / delegate responsiblity to the appropriate handler based on model version", function (assert) {
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
        }
        var v2spy = sinon.stub(V2MetadataAnalyser, "getPropertyFromEntityType").callsFake(function (){return true;});
        var v4spy = sinon.stub(V4MetadataAnalyser, "getPropertyFromEntityType").callsFake(function (){return true;});

        //v2 model
        var oModel = {
            getODataVersion: function () {
                return "2.0";
            }
        };
        ODataDelegator.getPropertyFromEntityType(sPropertyPath, oEntityType, oModel);
        assert.ok(v2spy.called, "V2 metadata analyzer gets called");
        
        //V4 model
        oModel.getODataVersion = function () {
            return "4.0";
        }
        ODataDelegator.getPropertyFromEntityType(sPropertyPath, oEntityType, oModel);
        assert.ok(v4spy.called, "V4 metadata analyzer gets called");

    });
});
