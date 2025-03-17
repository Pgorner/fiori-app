/**
 * tests for the sap.suite.ui.generic.template.js.AnnotationHelperStreamSupport.js and in particular for the SmartChart in multi-tab mode
 */
sap.ui.define(
	[
		"sap/suite/ui/generic/template/js/AnnotationHelperHiddenTermSupport",
	],
	function (AnnotationHelperHiddenTermSupport) {
		"use strict";

		QUnit.module("getHiddenColumnInfo");

    [
      {
        lineItems: [],
        expect: {columnKeyToCellHiddenPath: {}, staticHiddenColumns: []}
      },
      {
        lineItems: [
          { param: "param01", hidden: {} }
        ],
        expect: {columnKeyToCellHiddenPath: {}, staticHiddenColumns: ["param01"]}
      },
      {
        lineItems: [
          { param: "param01", hidden: {} },
          { param: "param02", hidden: {Path: ""} },
        ],
        expect: {columnKeyToCellHiddenPath: {}, staticHiddenColumns: ["param01", "param02"]}
      },
      {
        lineItems: [
          { param: "param01", hidden: {} },
          { param: "param02", hidden: {Path: "AA.BB"} },
        ],
        expect: {columnKeyToCellHiddenPath: {param02: "AA.BB"}, staticHiddenColumns: ["param01", ]}
      },
      {
        lineItems: [
          { param: "param01", hidden: {} },
          { param: "param02", hidden: {Path: "AA/BB"} },
        ],
        expect: {columnKeyToCellHiddenPath: {}, staticHiddenColumns: ["param01", ]}
      },
      {
        lineItems: [
          { param: "param01", hidden: {} },
          { param: "param02", hidden: {Path: "/AA.BB"} },
        ],
        expect: {columnKeyToCellHiddenPath: {param02: "AA.BB"}, staticHiddenColumns: ["param01", ]}
      },
      {
        lineItems: [
          { param: "param01", hidden: {Bool: "true"} }
        ],
        expect: {columnKeyToCellHiddenPath: {}, staticHiddenColumns: ["param01"]}
      },
      {
        lineItems: [ { param: "param01", hidden: {Bool: "false"} } ],
        expect: {columnKeyToCellHiddenPath: {}, staticHiddenColumns: []}
      },
    ].forEach(function(data) {
      QUnit.test(JSON.stringify(data), function (assert) {
        var oSmartTable = getSmartTable();
        var oLineItems = data.lineItems.map(function(entry) {
          return {
            RecordType: "com.sap.vocabularies.UI.v1.DataField",
            Value: {Path: entry.param},
            "com.sap.vocabularies.UI.v1.Hidden": entry.hidden ? entry.hidden:undefined
          };
        });

        oSmartTable.oModel.oMetaModel.getODataEntitySet.returns({entityType: "entityType"});
        oSmartTable.oModel.oMetaModel.getODataEntityType.returns({ "com.sap.vocabularies.UI.v1.LineItem": oLineItems });
        oSmartTable.getCustomData.returns([]);

        var result = AnnotationHelperHiddenTermSupport.getHiddenColumnInfo(oSmartTable);

        assert.deepEqual(result, data.expect, "expected result received");
      });
    })

    function getSmartTable() {
      var oModel = getModel();
      return {
        oModel: oModel,
        getModel: sinon.stub().returns(oModel),
        getEntitySet: sinon.stub(),
        getCustomData: sinon.stub(),
      }
    };

    function getModel() {
      var oMetaModel = getMetaModel();
      return {
        oMetaModel: oMetaModel,
        getMetaModel: sinon.stub().returns(oMetaModel),
      }
    };

    function getMetaModel() {
      return {
        getODataEntitySet: sinon.stub(),
        getODataEntityType: sinon.stub(),
      }
    };
	}
);
