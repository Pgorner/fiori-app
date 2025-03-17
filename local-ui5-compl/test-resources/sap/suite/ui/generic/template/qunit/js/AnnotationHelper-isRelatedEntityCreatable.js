sap.ui.define(["sap/suite/ui/generic/template/js/AnnotationHelper"],
	function (AnnotationHelper) {

		QUnit.module("Tests for isRelatedEntityCreatable", {
			beforeEach: function () {
				this.oAnnotationHelper = AnnotationHelper;
				this.oInterface = {
					getInterface: function (iPart, sPath) {
						return {
							getModel: function () {
								return this.oModel;
							}.bind(this)
						}
					}.bind(this)
				};
				this.oSourceEntitySet = {
					name: "STTA_C_MP_Product",
					entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
					"Org.OData.Capabilities.V1.InsertRestrictions": {
						"NonInsertableNavigationProperties": [
							{
								"If": [
									{"Not": {Path: "CanInsertItems"}},
									{"NavigationPropertyPath": "to_ProductText"}
								]
							}
						]
					}
				};
				this.oRelatedEntitySet = {
					name: "STTA_C_MP_ProductText",
					entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType"
				};

				this.oModel = {
					getODataProperty: function (oType, vName, bAsPath) {
						var oODataProperty = null;
						if (oType.name === "STTA_C_MP_ProductType" && vName === "CanInsertItems") {
							oODataProperty = {name: "CanInsertItems", type: "Edm.Boolean"};
						} else if (oType.name === "STTA_C_MP_ProductInsertableType" && vName === "CanInsertItems") {
							oODataProperty = {name: "CanInsertItems", type: "Edm.Boolean"};
						}
						return oODataProperty;
					},
					getODataEntityType: function (sQualifiedName, bAsPath) {
						var oODataEntityType = null;
						if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductType") {
							oODataEntityType = {
								name: "STTA_C_MP_ProductType",
								entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType"
							};
						} else if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductInsertableType") {
							oODataEntityType = {
								name: "STTA_C_MP_ProductInsertableType",
								entityType: "STTA_PROD_MAN.STTA_C_MP_ProductInsertableType"
							};
						}
						return oODataEntityType;
					},
					getODataAssociationSetEnd: function (oEntityType, sName) {
						var oODataAssociationSetEnd = null;
						if (sName === "to_ProductText") {
							oODataAssociationSetEnd = {entitySet: "STTA_C_MP_ProductText"};
						} else if (sName === "to_ProductInsertable") {
							oODataAssociationSetEnd = {entitySet: "STTA_C_MP_ProductInsertable"};
						}
						return oODataAssociationSetEnd;
					},
					getODataAssociationEnd: function (oEntityType, sName) {
						var oODataAssociationEnd = null;
						if (sName === "to_ProductText") {
							oODataAssociationEnd = {
								type: "STTA_PROD_MAN.STTA_C_MP_ProductTextType",
								multiplicity: "0..*"
							};
						} else if (sName === "to_ProductInsertable") {
							oODataAssociationEnd = {
								type: "STTA_PROD_MAN.STTA_C_MP_ProductInsertableType",
								multiplicity: "0..1"
							};
						}
						return oODataAssociationEnd;
					}
				};

				this.aSubPages = [
					{
						"navigationProperty": "to_ProductText",
						"entitySet": "STTA_C_MP_ProductText",
						"component": {
							"name": "sap.suite.ui.generic.template.ObjectPage"
						}
					}
				];

				this.stubActionControlExpand = sinon.stub(AnnotationHelper, "_actionControlExpand");
			},
			afterEach: function () {
				this.oAnnotationHelper = null;
				this.oInterface = {};
				this.oSourceEntitySet = {};
				this.oRelatedEntitySet = {};
				this.stubActionControlExpand.restore();
			}
		});

		function fnArrangeInlineMode (sCreateMode) {
			var oSourceEntitySet = {
				name: "STTA_C_MP_Product",
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType"
			};

			var oRelatedEntitySet = {
				name: "STTA_C_MP_ProductText",
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType"
			};

			var oFacet = {
				"Label": {
					"String": "{@i18n>@ProductDescriptions}"
				},
				"Target": {
					"AnnotationPath": "to_ProductText/@com.sap.vocabularies.UI.v1.LineItem"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.ReferenceFacet"
			};

			var aSections = {
				"to_ProductText::com.sap.vocabularies.UI.v1.LineItem": {
					"navigationProperty": "to_ProductText",
					"entitySet": "STTA_C_MP_ProductText",
					"multiSelect": true,
					"createMode": sCreateMode,
					"tableSettings": {
						"variantManagement": true
					}
				}
			};

			return {
				sourceEntitySet: oSourceEntitySet,
				relatedEntitySet: oRelatedEntitySet,
				facet: oFacet,
				sections: aSections
			}
		}

		QUnit.test("Function isRelatedEntityCreatable is available", function (assert) {
			assert.ok(this.oAnnotationHelper.isRelatedEntityCreatable);
		});

		QUnit.test("isRelatedEntityCreatable returns false WHEN there is no subpage", function (assert) {
			var expected = false;

			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, true), expected, "Returns 'false' in draft");
			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, undefined, undefined, undefined, false), expected, "Returns 'false' in non-draft");
		});

		QUnit.test("isRelatedEntityCreatable returns expressions WHEN there is no InsertRestrictions", function (assert) {
			var expectedInDraft = "{= ${ui>/editable} }";
			var expectedInNonDraft = "{= !${ui>/editable} }";

			this.oSourceEntitySet["Org.OData.Capabilities.V1.InsertRestrictions"] = undefined;
			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, this.aSubPages, undefined, undefined, true), expectedInDraft, "Returns expression '" + expectedInDraft + "' when 'Org.OData.Capabilities.V1.InsertRestrictions' is undefined in draft");
			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, this.aSubPages, undefined, undefined, false), expectedInNonDraft, "Returns expression '" + expectedInNonDraft + " " + "' when 'Org.OData.Capabilities.V1.InsertRestrictions' is undefined in non-draft");

			this.oSourceEntitySet["Org.OData.Capabilities.V1.InsertRestrictions"] = {};
			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, this.aSubPages, undefined, undefined, true), expectedInDraft, "Returns expression '" + expectedInDraft + "' when 'NonInsertableNavigationProperties' is undefined in draft");
			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, this.aSubPages, undefined, undefined, false), expectedInNonDraft, "Returns expression '" + expectedInNonDraft + "' when 'NonInsertableNavigationProperties' is undefined in non-draft");

			this.oSourceEntitySet["Org.OData.Capabilities.V1.InsertRestrictions"] = {
				"NonInsertableNavigationProperties": []
			};
			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, this.aSubPages, undefined, undefined, true), expectedInDraft, "Returns expression '" + expectedInDraft + "' when 'NonInsertableNavigationProperties' has 0 entries in draft");
			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, this.aSubPages, undefined, undefined, false), expectedInNonDraft, "Returns expression '" + expectedInNonDraft + "' when 'NonInsertableNavigationProperties' has 0 entries in non-draft");


		});


		QUnit.test("isRelatedEntityCreatable returns expression WHEN there is 1 InsertRestrictions", function (assert) {
			var expectedInDraft = "{= !!${CanInsertItems} && ${ui>/editable} }";
			var expectedInNonDraft = "{= !!${CanInsertItems} && !${ui>/editable} }";

			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, this.aSubPages, undefined, undefined, true), expectedInDraft, "Returns expression " + expectedInDraft + " in draft");
			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, this.aSubPages, undefined, undefined, false), expectedInNonDraft, "Returns expression " + expectedInNonDraft + " in non-draft");
		});

		QUnit.test("isRelatedEntityCreatable returns expression WHEN there is 1 InsertRestrictions BUT the navigation path is undefined", function (assert) {
			var expectedInDraft = "{= ${ui>/editable} }";
			var expectedInNonDraft = "{= !${ui>/editable} }";
			this.oSourceEntitySet = {
				name: "STTA_C_MP_Product",
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
				"Org.OData.Capabilities.V1.InsertRestrictions": {
					"NonInsertableNavigationProperties": [
						{
							"If": [
								{"Not": {Path: "CanInsertItems"}},
								{"NavigationPropertyPath": undefined}
							]
						}
					]
				}
			}
			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, this.aSubPages, undefined, undefined, true), expectedInDraft, "Returns expression " + expectedInDraft + " in draft");
			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, this.aSubPages, undefined, undefined, false), expectedInNonDraft, "Returns expression " + expectedInNonDraft + " in non-draft");

			this.oSourceEntitySet = {
				name: "STTA_C_MP_Product",
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
				"Org.OData.Capabilities.V1.InsertRestrictions": {
					"NonInsertableNavigationProperties": [
						{
							"NavigationPropertyPath": undefined
						}
					]
				}
			}
			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, this.aSubPages, undefined, undefined, true), expectedInDraft, "Returns expression " + expectedInDraft);
			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, this.aSubPages, undefined, undefined, false), expectedInNonDraft, "Returns expression " + expectedInNonDraft);

			this.oSourceEntitySet = {
				name: "STTA_C_MP_Product",
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
				"Org.OData.Capabilities.V1.InsertRestrictions": {
					"NonInsertableNavigationProperties": [
						{
							"Bad": [
								{"Not": {Path: "CanInsertItems"}},
								{"NavigationPropertyPath": "to_ProductSet"}
							]
						}
					]
				}
			}
			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, this.aSubPages, undefined, undefined, true), expectedInDraft, "Returns expression " + expectedInDraft);
			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, this.aSubPages, undefined, undefined, false), expectedInNonDraft, "Returns expression " + expectedInNonDraft);
		});

		QUnit.test("isRelatedEntityCreatable returns expression WHEN there is 1 InsertRestrictions that is a navigation path", function (assert) {
			var expectedInDraft = "{= !!${to_ProductInsertable/CanInsertItems} && ${ui>/editable} }";
			var expectedInNonDraft = "{= !!${to_ProductInsertable/CanInsertItems} && !${ui>/editable} }";
			this.oSourceEntitySet = {
				name: "STTA_C_MP_Product",
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
				"Org.OData.Capabilities.V1.InsertRestrictions": {
					"NonInsertableNavigationProperties": [
						{
							"If": [
								{"Not": {Path: "to_ProductInsertable/CanInsertItems"}},
								{"NavigationPropertyPath": "to_ProductText"}
							]
						}
					]
				}
			}
			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, this.aSubPages, undefined, undefined, true), expectedInDraft, "Returns expression " + expectedInDraft + " in draft");
			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, this.aSubPages, undefined, undefined, false), expectedInNonDraft, "Returns expression " + expectedInNonDraft + " in non-draft");

		});

		QUnit.test("isRelatedEntityCreatable returns false WHEN there is 1 InsertRestrictions with no condition", function (assert) {
			var expected = false;

			this.oSourceEntitySet = {
				name: "STTA_C_MP_Product",
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
				"Org.OData.Capabilities.V1.InsertRestrictions": {
					"NonInsertableNavigationProperties": [
						{
							"NavigationPropertyPath": "to_ProductText"
						}
					]
				}
			};
			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, this.aSubPages, undefined, undefined, true), expected, "Returns 'false' in draft");
			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, this.aSubPages, undefined, undefined, false), expected, "Returns 'false' in non-draft");

		});

		QUnit.test("isRelatedEntityCreatable returns expression WHEN there is 1 InsertRestrictions with only 1 IF condition", function (assert) {
			var expectedInDraft = "{= !${CanInsertItems} && ${ui>/editable} }";
			var expectedInNonDraft = "{= !${CanInsertItems} && !${ui>/editable} }";

			this.oSourceEntitySet = {
				name: "STTA_C_MP_Product",
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
				"Org.OData.Capabilities.V1.InsertRestrictions": {
					"NonInsertableNavigationProperties": [
						{
							"If": [
								{Path: "CanInsertItems"},
								{"NavigationPropertyPath": "to_ProductText"}
							]
						}
					]
				}
			};
			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, this.aSubPages, undefined, undefined, true), expectedInDraft, "Returns expression " + expectedInDraft + " in draft");
			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, this.aSubPages, undefined, undefined, false), expectedInNonDraft, "Returns expression " + expectedInNonDraft + " in non-draft");

		});

		QUnit.test("isRelatedEntityCreatable returns expression WHEN there is 1 InsertRestrictions with a NavigationPropertyPath that does not exist", function (assert) {
			var expectedInDraft = "{= ${ui>/editable} }";
			var expectedInNonDraft = "{= !${ui>/editable} }";

			this.oSourceEntitySet = {
				name: "STTA_C_MP_Product",
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
				"Org.OData.Capabilities.V1.InsertRestrictions": {
					"NonInsertableNavigationProperties": [
						{
							"If": [
								{"Not": {Path: "CanInsertItems"}},
								{"NavigationPropertyPath": "to_NotARealNavigationPath"}
							]
						}
					]
				}
			};
			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, this.aSubPages, undefined, undefined, true), expectedInDraft, "Returns expression " + expectedInDraft + " in draft");
			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, this.aSubPages, undefined, undefined, false), expectedInNonDraft, "Returns expression " + expectedInNonDraft + " in non-draft");

		});

		QUnit.test("isRelatedEntityCreatable returns false WHEN there is 1 InsertRestrictions BUT the creatable-path does not exist", function (assert) {
			var expected = false;

			this.oSourceEntitySet = {
				name: "STTA_C_MP_Product",
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
				"Org.OData.Capabilities.V1.InsertRestrictions": {
					"NonInsertableNavigationProperties": [
						{
							"If": [
								{"Not": {Path: "DoesNotExist"}},
								{"NavigationPropertyPath": "to_ProductText"}
							]
						}
					]
				}
			};
			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, this.aSubPages, undefined, undefined, true), expected, "Returns 'false' in draft");
			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, this.aSubPages, undefined, undefined, false), expected, "Returns 'false' in non-draft");

		});

		QUnit.test("isRelatedEntityCreatable returns expression WHEN there is 2 InsertRestrictions", function (assert) {
			var expectedInDraft = "{= !!${CanInsertItems} && ${ui>/editable} }";
			var expectedInNonDraft = "{= !!${CanInsertItems} && !${ui>/editable} }";
			this.oSourceEntitySet = {
				name: "STTA_C_MP_Product",
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
				"Org.OData.Capabilities.V1.InsertRestrictions": {
					"NonInsertableNavigationProperties": [
						{
							"If": [
								{"Not": {Path: "CanInsertItems"}},
								{"NavigationPropertyPath": "to_AnotherNavigationPath"}
							]
						},
						{
							"If": [
								{"Not": {Path: "CanInsertItems"}},
								{"NavigationPropertyPath": "to_ProductText"}
							]
						}
					]
				}
			};
			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, this.aSubPages, undefined, undefined, true), expectedInDraft, "Returns expression " + expectedInDraft + " in draft");
			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, this.aSubPages, undefined, undefined, false), expectedInNonDraft, "Returns expression " + expectedInNonDraft + " in non-draft");

		});

		QUnit.test("isRelatedEntityCreatable returns expression WHEN there is 4 InsertRestrictions", function (assert) {
			var expectedInDraft = "{= !!${CanInsertItems} && ${ui>/editable} }";
			var expectedInNonDraft = "{= !!${CanInsertItems} && !${ui>/editable} }";

			this.oSourceEntitySet = {
				name: "STTA_C_MP_Product",
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
				"Org.OData.Capabilities.V1.InsertRestrictions": {
					"NonInsertableNavigationProperties": [
						{
							"If": [
								{"Not": {Path: "CanInsertItems"}},
								{"NavigationPropertyPath": "to_AnotherNavigationPath"}
							]
						},
						{
							"If": [
								{"Not": {Path: "CanInsertItems"}},
								{"NavigationPropertyPath": "to_AnotherNavigationPath2"}
							]
						},
						{
							"If": [
								{"Not": {Path: "CanInsertItems"}},
								{"NavigationPropertyPath": "to_ProductText"}
							]
						},
						{
							"If": [
								{"Not": {Path: "CanInsertItems"}},
								{"NavigationPropertyPath": "to_AnotherNavigationPath3"}
							]
						}
					]
				}
			};
			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, this.aSubPages, undefined, undefined, true), expectedInDraft, "Returns expression " + expectedInDraft + " in draft");
			assert.equal(this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, this.oSourceEntitySet, this.oRelatedEntitySet, this.aSubPages, undefined, undefined, false), expectedInNonDraft, "Returns expression " + expectedInNonDraft + " in non-draft");

		});

		QUnit.test("Draft mode: isRelatedEntityCreatable returns expression WHEN create mode is inline", function (assert) {
			var oInlineModeArrangement = fnArrangeInlineMode("inline", "ResponsiveTable");
			var sExpectedResult = "{= ${ui>/editable} }";

			var sResult = this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, oInlineModeArrangement.sourceEntitySet, oInlineModeArrangement.relatedEntitySet, undefined, oInlineModeArrangement.facet, oInlineModeArrangement, true);
			assert.equal(sResult, sExpectedResult, "Returns expression " + sExpectedResult + " in draft");
		});

		QUnit.test("Non-Draft mode: isRelatedEntityCreatable returns expression WHEN create mode is inline", function (assert) {
			var oInlineModeArrangement = fnArrangeInlineMode("inline");
			var sExpectedResult = "{= !${ui>/editable} }";

			var sResult = this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, oInlineModeArrangement.sourceEntitySet, oInlineModeArrangement.relatedEntitySet, undefined, oInlineModeArrangement.facet, oInlineModeArrangement, false);
			assert.equal(sResult, sExpectedResult, "Returns expression " + sExpectedResult + " in non-draft");
		});

		QUnit.test("Create mode is 'creationRows' with responsive table", function (assert) {
			var oInlineModeArrangement = fnArrangeInlineMode("creationRows");
			var bExpectedResult = false;

			var bResult = this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, oInlineModeArrangement.sourceEntitySet, oInlineModeArrangement.relatedEntitySet, undefined, oInlineModeArrangement.facet, oInlineModeArrangement, true, false, "ResponsiveTable");
			assert.equal(bResult, bExpectedResult, "Returns 'false'");
		});

		QUnit.test("Create mode is 'creationRows' with grid table", function (assert) {
			var oInlineModeArrangement = fnArrangeInlineMode("creationRows");
			var sExpectedResult = "{= ${ui>/editable} }";

			var sResult = this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, oInlineModeArrangement.sourceEntitySet, oInlineModeArrangement.relatedEntitySet, undefined, oInlineModeArrangement.facet, oInlineModeArrangement, true, false, "GridTable");
			assert.equal(sResult, sExpectedResult, "Returns expression " + sExpectedResult);
		});

		QUnit.test("Create mode is 'creationRowsHiddenInEditMode' with responsive table", function (assert) {
			var oInlineModeArrangement = fnArrangeInlineMode("creationRowsHiddenInEditMode");
			var sExpectedResult = "{= !${ui>/createMode} && ${ui>/editable} }";

			var sResult = this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, oInlineModeArrangement.sourceEntitySet, oInlineModeArrangement.relatedEntitySet, undefined, oInlineModeArrangement.facet, oInlineModeArrangement, true, false, "ResponsiveTable");
			assert.equal(sResult, sExpectedResult, "Returns expression " + sExpectedResult);
		});

		QUnit.test("Create mode is 'creationRowsHiddenInEditMode' with grid table", function (assert) {
			var oInlineModeArrangement = fnArrangeInlineMode("creationRowsHiddenInEditMode");
			var sExpectedResult = "{= ${ui>/editable} }";

			var sResult = this.oAnnotationHelper.isRelatedEntityCreatable(this.oInterface, oInlineModeArrangement.sourceEntitySet, oInlineModeArrangement.relatedEntitySet, undefined, oInlineModeArrangement.facet, oInlineModeArrangement, true, false, "GridTable");
			assert.equal(sResult, sExpectedResult, "Returns expression " + sExpectedResult);
		});
});
