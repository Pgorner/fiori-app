sap.ui.define([
    "sap/ovp/helpers/ODataAnnotationHelper"
], function(ODataAnnotationHelper) {
    "use strict";

    QUnit.test("ODataAnnotationHelper - getRecords, get the annotation records for an entity type", function (assert) {
        var sAnnotationPath = "com.sap.vocabularies.UI.v1.Identification#navigationIntentBased";
        var aRecords = [
            {
                "SemanticObject":{"String":"browse"},
                "Action":{"String":"books1"},
                "RecordType":sAnnotationPath
            }
        ];
        var oEntityType = {
            "name": "Books",
            "com.sap.vocabularies.UI.v1.Identification#navigationIntentBased": aRecords
        };
        var oModel = {};
        assert.ok(ODataAnnotationHelper.getRecords(oEntityType, sAnnotationPath, oModel) === aRecords, "annotation records are returned");
    });
});
