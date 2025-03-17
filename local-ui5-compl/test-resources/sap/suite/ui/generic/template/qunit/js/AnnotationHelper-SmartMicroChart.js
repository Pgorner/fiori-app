sap.ui.define(["sap/suite/ui/generic/template/js/AnnotationHelper"],
	function (AnnotationHelper) {
		QUnit.module("Tests for SmartMicroChart in the Header Facet", {
			beforeEach: function () {
				this.oAnnotationHelper = AnnotationHelper;
			},

			afterEach: function () {
				this.oAnnotationHelper = null;
			}
		});

		QUnit.test("getEntitySetName", function (assert) {
			oAnnotationPath = {};
			oEntitySet = {entityType: "MainEntityType", name: "MainEntity"}
			sExpectedEntitySetName = "MainEntity";
			assert.equal(this.oAnnotationHelper.getEntitySetName(oAnnotationPath, oEntitySet), sExpectedEntitySetName, "Main Entity was provided. Entity name as expected:" + sExpectedEntitySetName);

			oAnnotationPath = {entityType: "ReferencedEntityType", name: "ReferencedEntity"}
			sExpectedEntitySetName = "ReferencedEntity";
			assert.equal(this.oAnnotationHelper.getEntitySetName(oAnnotationPath, oEntitySet), sExpectedEntitySetName, "Referenced Entity was provided. Entity name as expected:" + sExpectedEntitySetName);

			oAnnotationPath = undefined;
			oEntitySet = {entityType: "MainEntityType", name: "MainEntity"}
			sExpectedEntitySetName = "";
			assert.equal(this.oAnnotationHelper.getEntitySetName(oAnnotationPath, oEntitySet), sExpectedEntitySetName, "Negative Test, referenced entity is undefined. Entity name as expected:" + sExpectedEntitySetName);

			oAnnotationPath = undefined;
			oEntitySet = undefined
			sExpectedEntitySetName = "";
			assert.equal(this.oAnnotationHelper.getEntitySetName(oAnnotationPath, oEntitySet), sExpectedEntitySetName, "Negative Test, referenced and main entities are undefined. Entity name as expected:" + sExpectedEntitySetName);
		});
});
