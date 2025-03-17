sap.ui.define(["sap/suite/ui/generic/template/js/AnnotationHelper"],
	function (AnnotationHelper) {
		QUnit.module("Test methods to check funtion determineTableType", {

			beforeEach: function () {
				this.oAnnotationHelper = AnnotationHelper;
			},

			afterEach: function () {
				this.oAnnotationHelper = null;
			},

			oFacet: {
				Label: {
					String: "{@i18n>@ProductDescriptions}"
				},
				Target: {
					AnnotationPath: "to_ProductText/@com.sap.vocabularies.UI.v1.LineItem"
				},
				RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet"
			}
		});

		QUnit.test("Method to test if Table is rendered as Analytical Table - if tableType is maintained as AnalyticalTable for each section", function (assert) {
			var oAnnotationHelper = this.oAnnotationHelper;
			var oFacet = this.oFacet;
			var oSections = {
				sections: {
					"to_ProductText::com.sap.vocabularies.UI.v1.LineItem": {
						tableType: "AnalyticalTable"
					}
				}
			};

			var bExpectedExpression = "AnalyticalTable";
			var bExpression = oAnnotationHelper.determineTableType(oFacet, oSections);
			assert.equal(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);
		});

		QUnit.test("Method to test if Table is rendered as Tree Table - if tableType is maintained as TreeTable for each section", function (assert) {
			var oAnnotationHelper = this.oAnnotationHelper;
			var oFacet = this.oFacet;
			var oSections = {
				sections: {
					"to_ProductText::com.sap.vocabularies.UI.v1.LineItem": {
						tableType: "TreeTable"
					}
				}
			};

			var bExpectedExpression = "TreeTable";
			var bExpression = oAnnotationHelper.determineTableType(oFacet, oSections);
			assert.equal(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);
		});

		QUnit.test("Method to test if Table is rendered as Grid Table - if tableType is maintained as GridTable for each section", function (assert) {
			var oAnnotationHelper = this.oAnnotationHelper;
			var oFacet = this.oFacet;
			var oSections = {
				sections: {
					"to_ProductText::com.sap.vocabularies.UI.v1.LineItem": {
						tableType: "GridTable"
					}
				}
			};

			var bExpectedExpression = "GridTable";
			var bExpression = oAnnotationHelper.determineTableType(oFacet, oSections);
			assert.equal(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);
		});

		QUnit.test("Method to test if Table is rendered as Responsive Table - if tableType is maintained as ResponsiveTable for each section", function (assert) {
			var oAnnotationHelper = this.oAnnotationHelper;
			var oFacet = this.oFacet;
			var oSections = {
				sections: {
					"to_ProductText::com.sap.vocabularies.UI.v1.LineItem": {
						tableType: "ResponsiveTable"
					}
				}
			};

			var bExpectedExpression = "ResponsiveTable";
			var bExpression = oAnnotationHelper.determineTableType(oFacet, oSections);
			assert.equal(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);
		});

//At ROOT LEVEL

		QUnit.test("Method to test if Table is rendered as Analytical Table - if tableType is maintained as AnalyticalTable at root level", function (assert) {
			var oAnnotationHelper = this.oAnnotationHelper;
			var oFacet = this.oFacet;
			var oSections = {
				tableType: "AnalyticalTable",
				sections: {
					"to_ProductText::com.sap.vocabularies.UI.v1.LineItem": {}
				}
			};

			var bExpectedExpression = "AnalyticalTable";
			var bExpression = oAnnotationHelper.determineTableType(oFacet, oSections);
			assert.equal(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);
		});

		QUnit.test("Method to test if Table is rendered as Tree Table - if tableType is maintained as TreeTable at root level", function (assert) {
			var oAnnotationHelper = this.oAnnotationHelper;
			var oFacet = this.oFacet;
			var oSections = {
				tableType: "TreeTable",
				sections: {
					"to_ProductText::com.sap.vocabularies.UI.v1.LineItem": {}
				}
			};

			var bExpectedExpression = "TreeTable";
			var bExpression = oAnnotationHelper.determineTableType(oFacet, oSections);
			assert.equal(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);
		});

		QUnit.test("Method to test if Table is rendered as Grid Table - if tableType is maintained as GridTable at root level", function (assert) {
			var oAnnotationHelper = this.oAnnotationHelper;
			var oFacet = this.oFacet;
			var oSections = {
				tableType: "GridTable",
				sections: {
					"to_ProductText::com.sap.vocabularies.UI.v1.LineItem": {}
				}
			};

			var bExpectedExpression = "GridTable";
			var bExpression = oAnnotationHelper.determineTableType(oFacet, oSections);
			assert.equal(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);
		});

		QUnit.test("Method to test if Table is rendered as Responsive Table - if tableType is maintained as ResponsiveTable at root level", function (assert) {
			var oAnnotationHelper = this.oAnnotationHelper;
			var oFacet = this.oFacet;
			var oSections = {
				tableType: "ResponsiveTable",
				sections: {
					"to_ProductText::com.sap.vocabularies.UI.v1.LineItem": {}
				}
			};

			var bExpectedExpression = "ResponsiveTable";
			var bExpression = oAnnotationHelper.determineTableType(oFacet, oSections);
			assert.equal(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);
		});

// check for old flag in manifest i.e. treeTable = true
		QUnit.test("Method to test if Table is rendered as Tree Table - if treeTable=true is maintained", function (assert) {
			var oAnnotationHelper = this.oAnnotationHelper;
			var oFacet = this.oFacet;
			var oSections = {
				sections: {
					"to_ProductText::com.sap.vocabularies.UI.v1.LineItem": {
						treeTable: true
					}
				}
			};

			var bExpectedExpression = true;
			var bExpression = oAnnotationHelper.determineTableType(oFacet, oSections);
			assert.equal(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);
		});
});
