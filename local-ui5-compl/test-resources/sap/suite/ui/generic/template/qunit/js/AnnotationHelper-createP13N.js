sap.ui.define(["sap/suite/ui/generic/template/js/AnnotationHelper",
		"sap/suite/ui/generic/template/lib/TemplateComponent"],
	function (AnnotationHelper, TemplateComponent) {

		var sNonAllowedCharacters = "^[/:.#_a-zA-Z0-9]*$";
		// map function which behaves exactly like jQuery map
		// it discards the undefined values in array
		function map (aItem, callback) {
			return aItem.map(callback).filter(function (element) {
				return element !== undefined;
			});
		}

		QUnit.module("Tests for Determining Actions", {
			beforeEach: function () {
				this.oAnnotationHelper = AnnotationHelper;
				this.oModel = {
					getODataEntityType: function (sQualifiedName, bAsPath) {
						var oODataEntityType = null;
						if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductType") {
							oODataEntityType = {name: "STTA_C_MP_ProductType"};
						} else if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_SupplierType") {
							oODataEntityType = {name: "STTA_C_MP_SupplierType"};
						}
						return oODataEntityType;
					},
					getODataAssociationEnd: function (oEntityType, sName) {
						var oODataAssociationEnd = null;
						if (sName === "to_Supplier") {
							oODataAssociationEnd = {type: "STTA_PROD_MAN.STTA_C_MP_SupplierType", multiplicity: "0..1"};
						}
						return oODataAssociationEnd;
					},
					getODataAssociationSetEnd: function (oEntityType, sNavigation) {
						var sEntitySet = null;
						if (sNavigation === "to_Supplier") {
							sEntitySet = "STTA_C_MP_SupplierType";
						}
						return sEntitySet;
					},
					getODataEntitySet: function (sEntitySet) {
						if (sEntitySet === "STTA_C_MP_SupplierType") {
							return oContextSet;
						}
					}
				};

				/* this.oInterface = {
                        getInterface: function (iPart, sPath) {
                            return {
                                getModel: function() {
                                    return this.oModel;
                                }.bind(this)
                            }
                        }.bind(this)
                    }; */

				this.oGetComponentDataStub = sinon.stub(sap.ui.core.UIComponent.prototype, "getComponentData", function () {
					return {
						registryEntry: {
							oTemplateContract: {
								mRoutingTree: {
									theRoute: {}
								},
								oBusyHelper: {
									setBusy: Function.prototype
								}
							},
							route: "theRoute"
						}
					};
				});
			},
			afterEach: function () {
				this.oAnnotationHelper = null;
				this.oInterface = {};
				this.oGetComponentDataStub.restore();
			},
			extractColumnKey: function (sCustomValue) {
				var sTemp = sCustomValue.replace(/\\/g, "");
				var oCustomValue = JSON.parse(sTemp);
				return oCustomValue.columnKey;
			}

		});

		QUnit.test("has method validation: isSelf", function (assert) {
			assert.equal(typeof this.oAnnotationHelper.createP13N, "function", "createP13N function availability");
		});

		QUnit.test("createP13N Function", function (assert) {
			var oContextSet, oContextProp, oDataField;
			var mColumnWidthIncludingColumnHeader = {};
			oContextSet = {
				name: "SalesOrder",
				entityType: "COLLE.SalesOrderType",
				extensions: {
					name: "searchable",
					namespace: "http://www.sap.com/Protocols/SAPData",
					value: "true"
				},
				"Org.OData.Capabilities.V1.SortRestrictions": {
					"NonSortableProperties": [{
						PropertyPath: "SalesOrderDraftUUID"
					}, {
						PropertyPath: "ApprovalComment"
					}]
				},
				entityType: "COLLE.SalesOrderType"

			};

			//Test----DataField
			oContextProp = {
				name: "ActiveSalesOrderID", type: "Edm.String", nullable: "false", maxLength: "10",
				entityType: "COLLE.SalesOrderType",
				"Org.OData.Core.V1.Computed": {Bool: "true"},
				"com.sap.vocabularies.Common.v1.Label": {
					String: "Sales Order ID (Active Document)"
				},
				entityType: "COLLE.SalesOrderType",
				extensions: {
					name: "label",
					namespace: "http://www.sap.com/Protocols/SAPData",
					value: "Sales Order ID (Active Document)"
				},

			};
			var aLineItem = [
				{
					RecordType: "com.sap.vocabularies.UI.v1.DataField",
					Value: {
						Path: "ProductPictureURL"
					}
				},
				{
					EdmType: "Edm.String",
					RecordType: "com.sap.vocabularies.UI.v1.DataField",

					Value: {
						Path: "ActiveSalesOrderID"
					},
					"com.sap.vocabularies.UI.v1.Importance": {
						EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
					}
				},
				{
					EdmType: "Edm.String",
					RecordType: "com.sap.vocabularies.UI.v1.DataField",
					Label: {
						String: "Column2"
					},
					Value: {
						Path: "ColumnPath2"
					},
					"com.sap.vocabularies.UI.v1.Importance": {
						EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
					}
				},
				{
					EdmType: "Edm.String",
					RecordType: "com.sap.vocabularies.UI.v1.DataField",
					Label: {
						String: "Column3"
					},
					Value: {
						Path: "ColumnPath3"
					},
					"com.sap.vocabularies.UI.v1.Importance": {
						EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
					}
				},
			];
			this.oInterface = {
				getInterface: function (iPart, sPath) {
					var oResult = {}
					if (iPart === 0) {
						oResult = {
							getModel: function () {
								return this.oModel;
							}.bind(this)
						};
					} else {
						oResult = {
							oDataField: oDataField,
							getPath: function () {
								that = this;
								var aColumnIndex = map(aLineItem ,function (oColumn, iIndex) {
									if (oColumn.Value && oColumn.Value.Path === that.oDataField.Value.Path) {
										return iIndex;
									}
								});
								return (aColumnIndex[0] >= 0 ? "/dataServices/schema/0/entityType/1/com.sap.vocabularies.UI.v1.LineItem/" + aColumnIndex[0] : "");
							},
							getModel: function () {
								return {
									getObject: function (sTerm) {
										return aLineItem;
									}
								};
							}
						}
					}
					return oResult;

				}.bind(this)
			};

			oDataField = {
				EdmType: "Edm.String", RecordType: "com.sap.vocabularies.UI.v1.DataField",
				Value: {
					Path: "ActiveSalesOrderID"
				},
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
				}
			};
			var sActualValue = this.oAnnotationHelper.createP13N(this.oInterface, oContextSet, oContextProp, oDataField, mColumnWidthIncludingColumnHeader);
			var sExpectedValue = "\\{\"columnKey\":\"ActiveSalesOrderID\", \"leadingProperty\":\"ActiveSalesOrderID\", \"type\":\"string\", \"sortProperty\":\"ActiveSalesOrderID\", \"filterProperty\":\"ActiveSalesOrderID\", \"columnIndex\":\"1\", \"autoColumnWidth\":\\{\"min\":2,\"max\":19,\"truncateLabel\":true\\}\\}";
			assert.equal(sActualValue, sExpectedValue, "should return Expected Value:" + sExpectedValue);

			/*Different Mock oDataField values
            oDataField = {
                    RecordType: "com.sap.vocabularies.UI.v1.DataFieldWithUrl",
                    Url:{Apply:{Name:"odata.concat", Parameters:[{Type:"LabeledElement", Value:"DraftAdministrativeData/SiblingEntity"},{Type:"Path", Value:"DraftAdministrativeData/SiblingEntity"}]}},
                    Value: {
                        Path: "ActiveSalesOrderID"
                    },
                    "com.sap.vocabularies.UI.v1.Importance" :{
                        EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
                    }
            };
            sActualValue = this.oAnnotationHelper.createP13N(this.oInterface, oContextSet, oContextProp, oDataField);
            sExpectedValue = "\\{\"columnKey\":\"ActiveSalesOrderID\", \"leadingProperty\":\"ActiveSalesOrderID\", \"additionalProperty\":\"ActiveSalesOrderID,undefined\", \"sortProperty\":\"undefined\", \"filterProperty\":\"undefined\" \\}";
            assert.equal(sActualValue,sExpectedValue,"should return Expected Value:"+sExpectedValue);*/

			//Test----DataField/ImageUrl
			oContextProp = {
				name: "ProductPictureURL", type: "Edm.String",
				entityType: "COLLE.SalesOrderType",
				"Org.OData.Core.V1.Computed": {Bool: "true"},
				"com.sap.vocabularies.Common.v1.Label": {
					String: "Image"
				},
				"com.sap.vocabularies.UI.v1.IsImageURL": {Bool: "true"},
				entityType: "COLLE.SalesOrderType",
				extensions: {
					name: "label",
					namespace: "http://www.sap.com/Protocols/SAPData",
					value: "Image"
				},
			};
			oDataField = {
				EdmType: "Edm.String", RecordType: "com.sap.vocabularies.UI.v1.DataField",
				Value: {
					Path: "ProductPictureURL"
				},
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
				}
			};
			sActualValue = this.oAnnotationHelper.createP13N(this.oInterface, oContextSet, oContextProp, oDataField, mColumnWidthIncludingColumnHeader);
			sExpectedValue = "\\{\"columnKey\":\"ProductPictureURL\", \"leadingProperty\":\"ProductPictureURL\", \"type\":\"string\", \"sortProperty\":\"ProductPictureURL\", \"filterProperty\":\"ProductPictureURL\", \"columnIndex\":\"0\", \"autoColumnWidth\":\\{\"min\":2,\"max\":19,\"truncateLabel\":true\\}\\}";
			assert.equal(sActualValue, sExpectedValue, "should return Expected Value:" + sExpectedValue);

			/*Test----add apply in the oDatafield to run else part
            oDataField = {EdmType: "Edm.String",
                    Value: {
                        Path: "",
                        Apply:{Name:"odata.concat", Parameters:[{Type:"Path", Value:"DraftAdministrativeData/SiblingEntity"},{Type:"Path", Value:"DraftAdministrativeData/SiblingEntity"}]}
                    }
            };
            sActualValue = this.oAnnotationHelper.createP13N(this.oInterface, oContextSet, oContextProp, oDataField);
            sExpectedValue ="\\{\"columnKey\":\"DraftAdministrativeData/SiblingEntity\", \"leadingProperty\":\"DraftAdministrativeData/SiblingEntity\", \"additionalProperty\":\"DraftAdministrativeData/SiblingEntity\", \"sortProperty\":\"ActiveSalesOrderID\", \"filterProperty\":\"ActiveSalesOrderID\" \\}";
            assert.equal(sActualValue,sExpectedValue, "should return Expected Value:"+sExpectedValue);

            oContextProp = {"com.sap.vocabularies.Common.v1.Text":{Path:"ActiveSalesOrderID"}};
            var sActualValue = this.oAnnotationHelper.createP13N(this.oInterface, oContextSet, oContextProp, oDataField);
            sExpectedValue = "\\{\"columnKey\":\"DraftAdministrativeData/SiblingEntity\", \"leadingProperty\":\"DraftAdministrativeData/SiblingEntity\", \"additionalProperty\":\"DraftAdministrativeData/SiblingEntity,ActiveSalesOrderID\", \"sortProperty\":\"undefined\", \"filterProperty\":\"undefined\" \\}";
            assert.equal(sActualValue,sExpectedValue,"should return Expected Value:"+sExpectedValue);
             */

		});

		QUnit.test("check method createP13NColumnForAction", function (assert) {
			var mColumnWidthIncludingColumnHeader = {};
			var aLineItem = [
				{
					RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
					Label: {
						String: "{@i18n>@ACTION_1}",
					},
					Action: {
						String: "ToolbarActionFunction1"
					},
					Inline: {
						Bool: "false"
					}
				},
				{
					RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
					Label: {
						String: "ToolbarAction2"
					},
					Action: {
						String: "ToolbarActionFunction2"
					}
				},
				{
					EdmType: "Edm.String",
					RecordType: "com.sap.vocabularies.UI.v1.DataField",
					Label: {
						String: "{@i18n>@Column1}"
					},
					Value: {
						Path: "ColumnPath1"
					},
					"com.sap.vocabularies.UI.v1.Importance": {
						EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
					}
				},
				{
					EdmType: "Edm.String",
					RecordType: "com.sap.vocabularies.UI.v1.DataField",
					Label: {
						String: "Column2"
					},
					Value: {
						Path: "ColumnPath2"
					},
					"com.sap.vocabularies.UI.v1.Importance": {
						EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
					}
				},
				{
					EdmType: "Edm.String",
					RecordType: "com.sap.vocabularies.UI.v1.DataField",
					Label: {
						String: "Column3"
					},
					Value: {
						Path: "ColumnPath3"
					},
					"com.sap.vocabularies.UI.v1.Importance": {
						EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
					}
				},
				{
					RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
					Label: {
						String: "LabelLineItemAction1"
					},
					Action: {
						String: "LineItemActionFunction1"
					},
					Inline: {
						Bool: "true"
					}
				},
				{
					RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
					Label: {
						String: "LabelLineItemAction2"
					},
					Action: {
						String: "LineItemActionFunction2"
					},
					Inline: {
						Bool: "true"
					}
				},
				{
					RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
					Label: {
						String: "{@i18n>@LineItemAction3}",
					},
					Action: {
						String: "LineItemActionFunction3"
					},
					Inline: {
						Bool: "true"
					}
				}
			];

			var iContext = {
				oDataField: null,
				getPath: function () {
					that = this;
					var aColumnIndex = map(aLineItem, function (oColumn, iIndex) {
						if (oColumn.Label && oColumn.Label.String === that.oDataField.Label.String) {
							return iIndex;
						}
					});
					return (aColumnIndex[0] >= 0 ? "/dataServices/schema/0/entityType/1/com.sap.vocabularies.UI.v1.LineItem/" + aColumnIndex[0] : "");
				},
				getModel: function () {
					return {
						getObject: function (sTerm) {
							return aLineItem;
						}
					};
				}
			}
			var oDataFieldAction = {
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
				Label: {
					String: "LabelLineItemAction1"
				},
				Action: {
					String: "LineItemActionFunction1"
				},
				Inline: {
					Bool: "true"
				}
			};
			var oDataFieldNavigation = {
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
				Label: {
					String: "LabelLineItemAction2"
				},
				SemanticObject: {
					String: "EPMProduct1"
				},
				Action: {
					String: "manage_stta"
				},
				Inline: {
					String: "true"
				}
			};

			//Test
			iContext.oDataField = oDataFieldAction;
			var sExpectedActionValue = '\\{"columnKey":"template::DataFieldForAction::LineItemActionFunction1", "columnIndex":"3", "actionButton":"true" \\}';
			var sActualValue = this.oAnnotationHelper.createP13NColumnForAction(iContext, oDataFieldAction, mColumnWidthIncludingColumnHeader);
			assert.equal(sActualValue, sExpectedActionValue, "P13N data for line item action created.");

			//Test
			iContext.oDataField = oDataFieldNavigation;
			sExpectedActionValue = '\\{"columnKey":"template::DataFieldForIntentBasedNavigation::EPMProduct1::manage_stta", "columnIndex":"4", "actionButton":"true" \\}';
			sActualValue = this.oAnnotationHelper.createP13NColumnForAction(iContext, oDataFieldNavigation, mColumnWidthIncludingColumnHeader);
			assert.equal(sActualValue, sExpectedActionValue, "P13N data for line item navigation action created.");

			//Test
			oDataFieldAction = {
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
				Label: {
					String: "{@i18n>@LineItemAction3}"
				},
				Action: {
					String: "LineItemActionFunction3"
				},
				Inline: {
					Bool: "true"
				},
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
				}
			};
			sActualValue = this.oAnnotationHelper.createP13NColumnForAction(iContext, oDataFieldAction, mColumnWidthIncludingColumnHeader);
			sActualValue = sActualValue.replace(/\\/g, "");
			var oActualValue = JSON.parse(sActualValue);
			assert.equal(!!oActualValue.columnKey.match(sNonAllowedCharacters), true, "not allowed chars are not allowed for columnKey");

		});
//*********************************************************************
		QUnit.test("check method createP13NColumnForIndicator", function (assert) {
			var mColumnWidthIncludingColumnHeader = {};
			this.oInterface = {
				getInterface: function (iPart, sPath) {
					var oResult = {}
					if (iPart === 0) {
						oResult = {
							getModel: function () {
								return this.oModel;
							}.bind(this)
						};
					}
					return oResult;
				}.bind(this)
			};

			var oContextSet = {
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType"
			};

			var oNavigationStub = sinon.stub(this.oAnnotationHelper, "_getNavigationPrefix").returns("");
			var iColumnIndexStub = sinon.stub(this.oAnnotationHelper, "_determineColumnIndex").returns(1);

			var oDataField = {
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
				Label: {
					String: "LabelRating"
				},
				Target: {
					AnnotationPath: "to_Rating/@com.sap.vocabularies.UI.v1.DataPoint#Rating"
				}
			};

			var oDataFieldTarget = {
				Value: {
					Path: "Quantity"
				}
			};

			//Test
			sExpectedP13nValue = '\\{"columnKey":"template::DataFieldForAnnotation::to_Rating/com.sap.vocabularies.UI.v1.DataPoint#Rating", "leadingProperty":"Quantity", "additionalProperty":"Quantity", "columnIndex":"1", "sortProperty":"Quantity", "filterProperty":"Quantity", \"autoColumnWidth\":\\{\"truncateLabel\":true\\}\\}';
			sActualValue = this.oAnnotationHelper.createP13NColumnForIndicator(this.oInterface, oContextSet, oDataField, oDataFieldTarget, {}, {}, mColumnWidthIncludingColumnHeader);
			assert.equal(sActualValue, sExpectedP13nValue, "P13N data for rating and progress indicator created correctly when there is no navigation in target.");
			oNavigationStub.restore();

			oNavigationStub = sinon.stub(this.oAnnotationHelper, "_getNavigationPrefix").returns("to_Supplier");
			sExpectedP13nValue = '\\{"columnKey":"template::DataFieldForAnnotation::to_Rating/com.sap.vocabularies.UI.v1.DataPoint#Rating", "leadingProperty":"to_Supplier/Quantity", "additionalProperty":"to_Supplier/Quantity", "columnIndex":"1", "sortProperty":"Quantity", "filterProperty":"Quantity", \"autoColumnWidth\":\\{\"truncateLabel\":true\\}\\}';
			sActualValue = this.oAnnotationHelper.createP13NColumnForIndicator(this.oInterface, oContextSet, oDataField, oDataFieldTarget, {}, {}, mColumnWidthIncludingColumnHeader);
			assert.equal(sActualValue, sExpectedP13nValue, "P13N data for rating and progress indicator created correctly when there is navigation in target.");

			this.oAnnotationHelper._getNavigationPrefix.restore();
		});


		QUnit.test("Check columnKeys individually and cross all p13N methods", function (assert) {
			var mColumnWidthIncludingColumnHeader = {};
			var oDataField, oContextSet, oContextProp, oDataFieldTarget = {};
			var sActualValue_CustomData, sActualValue_ColumnKey, sAnnotationPath = "";
			var aActualValueColumnKeys = [];
			var sExpectedValue = "";
			var sFioriTemplatePrefix = "template";//"template";
			var sSeperator = "::"; //"::";
			var aLineItem = [
				/*
                 * DataFieldIsImage
                                    <Record Type="UI.DataField">
                                        <PropertyValue Property="Value" Path="ProductPictureURL"/>
                                    </Record>
                 */
				{
					RecordType: "com.sap.vocabularies.UI.v1.DataField",
					Value: {
						Path: "ProductPictureURL"
					}
				},
				/*
                 * DataFieldIsImage with navigation
                                    <Record Type="UI.DataField">
                                        <PropertyValue Property="Value" Path="to_URL/ProductPictureURL"/>
                                    </Record>
                 */
				{
					RecordType: "com.sap.vocabularies.UI.v1.DataField",
					Value: {
						Path: "to_URL/ProductPictureURL"
					}
				},
				/*
                 * DataFieldWithIntentBasedNavigation
                 * 		<Record Type="UI.DataFieldWithIntentBasedNavigation">
                                    <PropertyValue Property="Label" String="Supplier (with IBN)"/>
                                    <PropertyValue Property="Value" Path="Supplier"/>
                                    <PropertyValue Property="SemanticObject" String="EPMProduct"/>
                                    <PropertyValue Property="Action" String="manage_stta"/>
                                </Record>
                 */
				{
					RecordType: "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation",
					Label: {
						String: "LabelSupplier (with IBN)"
					},
					Value: {
						Path: "Supplier"
					},
					Action: {
						String: "manage_stta"
					},
					SemanticObject: {
						String: "EPMProduct"
					}
				},
				/*
                 * DataFieldForIntentBasedNavigation
                 * 	<Record Type="UI.DataFieldForIntentBasedNavigation">
                                    <PropertyValue Property="Label" String="Manage Products (ST)_1"/>
                                    <PropertyValue Property="SemanticObject" String="EPMProduct1"/>
                                    <PropertyValue Property="Action" String="manage_stta"/>
                                    <PropertyValue Property="Inline" Bool="true"/>
                                </Record>
                 */
				{
					RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
					Label: {
						String: "LabelManage Products (ST)_1"
					},
					SemanticObject: {
						String: "EPMProduct1"
					},
					Action: {
						String: "manage_stta"
					},
					Inline: {
						String: "true"
					}
				},
				/*
                 * DataFieldForAction (inline)
                 * <Record Type="UI.DataFieldForAction">
                                <PropertyValue Property="Label" String="Copy"/>
                                <PropertyValue Property="IconUrl" String="sap-icon://copy"/>
                                <PropertyValue Property="Action" String="STTA_PROD_MAN.STTA_PROD_MAN_Entities/STTA_C_MP_ProductCopy"/>
                                <PropertyValue Property="Inline" Bool="true"/>
                            </Record>
                 * */
				{
					RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
					Label: {
						String: "LabelCopy"
					},
					Action: {
						String: "STTA_PROD_MAN.STTA_PROD_MAN_Entities/STTA_C_MP_ProductCopy"
					},
					Inline: {
						Bool: "true"
					}
				},
				/*
                 * ContactPopUpOver
                 * <Record Type="UI.DataFieldForAnnotation">
                                <PropertyValue Property="Label" String="{@i18n&gt;@Supplier}"/>
                                <PropertyValue Property="Target" AnnotationPath="to_Supplier/@Communication.Contact"/>
                            </Record>
                 */
				{
					RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
					Label: {
						String: "{@i18n&gt;@Supplier}"
					},
					Target: {
						AnnotationPath: "to_Supplier/@com.sap.vocabularies.Communication.v1.Contact"
					}
				},
				/* RatingProgressIndicators
                 * <Record Type="UI.DataFieldForAnnotation">
                                    <PropertyValue Property="Label" String="Rating"/>
                                    <PropertyValue Property="Target" AnnotationPath="@UI.DataPoint#Rating"/>
                                </Record>
                 * */
				{
					RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
					Label: {
						String: "LabelRating"
					},
					Target: {
						AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#Rating"
					}
				},
				/* RatingProgressIndicators
                 * <Record Type="UI.DataFieldForAnnotation">
                                    <PropertyValue Property="Label" String="Rating"/>
                                    <PropertyValue Property="Target" AnnotationPath="@UI.DataPoint#Rating"/>
                                </Record>
                 * */
				{
					RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
					Label: {
						String: "LabelRating"
					},
					Target: {
						AnnotationPath: "to_Rating/@com.sap.vocabularies.UI.v1.DataPoint#Rating"
					}
				},
				/*
                 * Smart micro chart
                 * <Record Type="UI.DataFieldForAnnotation">
                                    <PropertyValue Property="Label" String="Sales"/>
                                    <PropertyValue Property="Target" AnnotationPath="to_ProductSalesPrice/@UI.Chart#SalesPriceAreaChart"/>
                                </Record>
                 * */
				{
					RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
					Label: {
						String: "LabelSales"
					},
					Target: {
						AnnotationPath: "to_Supplier/@com.sap.vocabularies.UI.v1.Chart#SalesPriceAreaChart"
					}
				},
				/* DataFieldWithUrl without navigation
                 *  <Record Type="UI.DataFieldWithUrl">
                                    <PropertyValue Property="Label" String="Currency (Ext. String Link)" />
                                    <PropertyValue Property="Value" Path="CurrencyCode" />
                                    <PropertyValue Property="Url">
                                        <Apply Function="odata.fillUriTemplate">
                                            <String>https://www.google.com/#q={code}</String>
                                            <LabeledElement Name="code">
                                                <Path>CurrencyCode</Path>
                                            </LabeledElement>
                                        </Apply>
                                    </PropertyValue>
                                    <Annotation Term="UI.Importance" EnumMember="UI.ImportanceType/High"/>
                                </Record>
                 * */
				{
					RecordType: "com.sap.vocabularies.UI.v1.DataFieldWithUrl",
					Label: {
						String: "Currency (Ext. String Link)"
					},
					Value: {
						Path: "CurrencyCode"
					}
				},
				/* DataFieldWithUrl with navigation
                 *  <Record Type="UI.DataFieldWithUrl">
                                    <PropertyValue Property="Label" String="to_LifecycleStatus/Status_Text" />
                                    <PropertyValue Property="Value" Path="to_LifecycleStatus/Status_Text" />
                                    ...
                                    <Annotation Term="UI.Importance" EnumMember="UI.ImportanceType/High"/>
                                </Record>
                 * */
				{
					RecordType: "com.sap.vocabularies.UI.v1.DataFieldWithUrl",
					Label: {
						String: "to_LifecycleStatus/Status_Text"
					},
					Value: {
						Path: "to_LifecycleStatus/Status_Text"
					}
				}
			];

			//Test DataFieldIsImage
			oDataField = aLineItem[0];
			oContextSet = {};
			oContextProp = {};
			oContextProp["com.sap.vocabularies.UI.v1.IsImageURL"] = "true";
			this.oInterface = {
				getInterface: function (iPart, sPath) {
					var oResult = {}
					if (iPart === 0) {
						oResult = {
							getModel: function () {
								return this.oModel;
							}.bind(this)
						};
					} else {
						oResult = {
							oDataField: oDataField,
							getPath: function () {
								that = this;
								var aColumnIndex = map(aLineItem, function (oColumn, iIndex) {
									if (oColumn.Value && oColumn.Value.Path === that.oDataField.Value.Path) {
										return iIndex;
									}
								});
								return (aColumnIndex[0] >= 0 ? "/dataServices/schema/0/entityType/1/com.sap.vocabularies.UI.v1.LineItem/" + aColumnIndex[0] : "");
							},
							getModel: function () {
								return {
									getObject: function (sTerm) {
										return aLineItem;
									}
								};
							}
						}
					}
					return oResult;

				}.bind(this)
			};
			sActualValue_CustomData = this.oAnnotationHelper.createP13N(this.oInterface, oContextSet, oContextProp, oDataField, mColumnWidthIncludingColumnHeader);
			sActualValue_ColumnKey = this.extractColumnKey(sActualValue_CustomData);
			sExpectedValue = "ProductPictureURL";
			console.log("columnKey: " + sExpectedValue);
			assert.equal(sActualValue_ColumnKey, sExpectedValue, "DataFieldIsImage - Check for expected ColumnKey: " + sExpectedValue);
			assert.equal(!!sActualValue_ColumnKey.match(sNonAllowedCharacters), true, "DataFieldIsImage - Check that the ColumnKey does not contain not allowed chars: " + sActualValue_ColumnKey);
			aActualValueColumnKeys.push(sActualValue_ColumnKey);

			//Test DataFieldIsImage with navigation
			oDataField = aLineItem[1];
			oContextSet = {};
			oContextProp = {};
			oContextProp["com.sap.vocabularies.UI.v1.IsImageURL"] = "true";
			sActualValue_CustomData = this.oAnnotationHelper.createP13N(this.oInterface, oContextSet, oContextProp, oDataField, mColumnWidthIncludingColumnHeader);
			sActualValue_ColumnKey = this.extractColumnKey(sActualValue_CustomData);
			sExpectedValue = "to_URL/ProductPictureURL";
			console.log("columnKey: " + sExpectedValue);
			assert.equal(sActualValue_ColumnKey, sExpectedValue, "DataFieldIsImage with navigation - Check for expected ColumnKey: " + sExpectedValue);
			assert.equal(!!sActualValue_ColumnKey.match(sNonAllowedCharacters), true, "DataFieldIsImage with navigation - Check that the ColumnKey does not contain not allowed chars: " + sActualValue_ColumnKey);
			aActualValueColumnKeys.push(sActualValue_ColumnKey);

			//Test DataFieldWithIntentBasedNavigation
			oDataField = aLineItem[2];
			oContextSet = {
				oDataField: null,
				getPath: function () {
					that = this;
					var aColumnIndex = map(aLineItem, function (oColumn, iIndex) {
						if (oColumn.Label && oColumn.Label.String === that.oDataField.Label.String) {
							return iIndex;
						}
					});
					return (aColumnIndex[0] >= 0 ? "/dataServices/schema/0/entityType/1/com.sap.vocabularies.UI.v1.LineItem/" + aColumnIndex[0] : "");
				},
				getModel: function () {
					return {
						getObject: function (sTerm) {
							return aLineItem;
						}
					};
				}
			}
			oContextSet.oDataField = oDataField;
			sActualValue_CustomData = this.oAnnotationHelper.createP13NColumnForAction(oContextSet, oDataField, mColumnWidthIncludingColumnHeader);
			sActualValue_ColumnKey = this.extractColumnKey(sActualValue_CustomData);
			sExpectedValue = sFioriTemplatePrefix + sSeperator + "DataFieldWithIntentBasedNavigation" + sSeperator + oDataField.SemanticObject.String + sSeperator + oDataField.Action.String + sSeperator + oDataField.Value.Path;
			console.log("columnKey: " + sExpectedValue);
			assert.equal(sActualValue_ColumnKey, sExpectedValue, "DataFieldWithIntentBasedNavigation - Check for expected ColumnKey: " + sExpectedValue);
			assert.equal(!!sActualValue_ColumnKey.match(sNonAllowedCharacters), true, "DataFieldWithIntentBasedNavigation - Check that the ColumnKey does not contain not allowed chars: " + sActualValue_ColumnKey);
			aActualValueColumnKeys.push(sActualValue_ColumnKey);

			//Test DataFieldForIntentBasedNavigation
			oDataField = aLineItem[3];
			oContextSet.oDataField = oDataField;
			sActualValue_CustomData = this.oAnnotationHelper.createP13NColumnForAction(oContextSet, oDataField, mColumnWidthIncludingColumnHeader);
			sActualValue_ColumnKey = this.extractColumnKey(sActualValue_CustomData);
			sExpectedValue = sFioriTemplatePrefix + sSeperator + "DataFieldForIntentBasedNavigation" + sSeperator + oDataField.SemanticObject.String + sSeperator + oDataField.Action.String;
			console.log("columnKey: " + sExpectedValue);
			assert.equal(sActualValue_ColumnKey, sExpectedValue, "DataFieldForIntentBasedNavigation - Check for expected ColumnKey: " + sExpectedValue);
			assert.equal(!!sActualValue_ColumnKey.match(sNonAllowedCharacters), true, "DataFieldForIntentBasedNavigation - Check that the ColumnKey does not contain not allowed chars: " + sActualValue_ColumnKey);
			aActualValueColumnKeys.push(sActualValue_ColumnKey);

			//Test DataFieldForAction (inline)
			oDataField = aLineItem[4];
			oContextSet.oDataField = oDataField;
			sActualValue_CustomData = this.oAnnotationHelper.createP13NColumnForAction(oContextSet, oDataField, mColumnWidthIncludingColumnHeader);
			sActualValue_ColumnKey = this.extractColumnKey(sActualValue_CustomData);
			sExpectedValue = sFioriTemplatePrefix + sSeperator + "DataFieldForAction" + sSeperator + oDataField.Action.String; //or without the service only: "STTA_PROD_MAN_Entities/STTA_C_MP_ProductCopy";
			console.log("columnKey: " + sExpectedValue);
			assert.equal(sActualValue_ColumnKey, sExpectedValue, "DataFieldForAction (inline) - Check for expected ColumnKey: " + sExpectedValue);
			assert.equal(!!sActualValue_ColumnKey.match(sNonAllowedCharacters), true, "DataFieldForAction (inline) - Check that the ColumnKey does not contain not allowed chars: " + sActualValue_ColumnKey);
			aActualValueColumnKeys.push(sActualValue_ColumnKey);

			//Test ContactPopUpOver (with navigation)
			oDataField = aLineItem[5];
			sAnnotationPath = oDataField.Target.AnnotationPath;
			var oInterface = {
				getInterface: function (iPart, sPath) {
					var oResult = {}
					if (iPart === 0) {
						oResult = {
							getModel: function () {
								return this.oModel;
							}.bind(this)
						};
					} else {
						oResult = {
							oDataField: oDataField,
							getPath: function () {
								that = this
								var aColumnIndex = map(aLineItem, function (oColumn, iIndex) {
									if (oColumn.Label && oColumn.Label.String === that.oDataField.Label.String) {
										return iIndex;
									}
								});
								return (aColumnIndex[0] >= 0 ? "/dataServices/schema/0/entityType/1/com.sap.vocabularies.UI.v1.LineItem/" + aColumnIndex[0] : "");
							},
							getModel: function () {
								return {
									getObject: function (sTerm) {
										return aLineItem;
									}
								};
							}
						}
					}
					return oResult;

				}.bind(this)
			};
			oContextSet = {
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType"
			};
			oContextProp = {};
			oDataFieldTarget = {
				fn: {
					Path: "CompanyName"
				}
			};
			sActualValue_CustomData = this.oAnnotationHelper.createP13NColumnForContactPopUp(oInterface, oContextSet, oDataField, oDataFieldTarget, sAnnotationPath, mColumnWidthIncludingColumnHeader);
			sActualValue_ColumnKey = this.extractColumnKey(sActualValue_CustomData);
			sExpectedValue = sFioriTemplatePrefix + sSeperator + "DataFieldForAnnotation" + sSeperator + oDataField.Target.AnnotationPath.replace('@', '');
			console.log("columnKey: " + sExpectedValue);
			assert.equal(sActualValue_ColumnKey, sExpectedValue, "ContactPopUpOver (with navigation) - Check for expected ColumnKey: " + sExpectedValue);
			assert.equal(!!sActualValue_ColumnKey.match(sNonAllowedCharacters), true, "ContactPopUpOver (with navigation) - Check that the ColumnKey does not contain not allowed chars: " + sActualValue_ColumnKey);
			aActualValueColumnKeys.push(sActualValue_ColumnKey);

			//Test RatingProgressIndicators
			oDataField = aLineItem[6];
			sAnnotationPath = oDataField.Target.AnnotationPath;
			oDataFieldTarget = {
				Value: {
					Path: "Quantity"
				}
			};
			var oDataFieldTargetValue = {};
			sActualValue_CustomData = this.oAnnotationHelper.createP13NColumnForIndicator(oInterface, oContextSet, oDataField, oDataFieldTarget, oDataFieldTargetValue, sAnnotationPath, mColumnWidthIncludingColumnHeader);
			sActualValue_ColumnKey = this.extractColumnKey(sActualValue_CustomData);
			sExpectedValue = sFioriTemplatePrefix + sSeperator + "DataFieldForAnnotation" + sSeperator + oDataField.Target.AnnotationPath.replace('@', '');
			console.log("columnKey: " + sExpectedValue);
			assert.equal(sActualValue_ColumnKey, sExpectedValue, "RatingProgressIndicators - Check for expected ColumnKey: " + sExpectedValue);
			assert.equal(!!sActualValue_ColumnKey.match(sNonAllowedCharacters), true, "RatingProgressIndicators - Check that the ColumnKey does not contain not allowed chars: " + sActualValue_ColumnKey);
			aActualValueColumnKeys.push(sActualValue_ColumnKey);

			//Test RatingProgressIndicators (with navigation)
			oDataField = aLineItem[7];
			sAnnotationPath = oDataField.Target.AnnotationPath;
			oDataFieldTarget = {
				Value: {
					Path: "Quantity"
				}
			};
			var oDataFieldTargetValue = {};
			sActualValue_CustomData = this.oAnnotationHelper.createP13NColumnForIndicator(oInterface, oContextSet, oDataField, oDataFieldTarget, oDataFieldTargetValue, sAnnotationPath, mColumnWidthIncludingColumnHeader);
			sActualValue_ColumnKey = this.extractColumnKey(sActualValue_CustomData);
			sExpectedValue = sFioriTemplatePrefix + sSeperator + "DataFieldForAnnotation" + sSeperator + oDataField.Target.AnnotationPath.replace('@', '');
			console.log("columnKey: " + sExpectedValue);
			assert.equal(sActualValue_ColumnKey, sExpectedValue, "RatingProgressIndicators (with navigation) - Check for expected ColumnKey: " + sExpectedValue);
			assert.equal(!!sActualValue_ColumnKey.match(sNonAllowedCharacters), true, "RatingProgressIndicators (with navigation) - Check that the ColumnKey does not contain not allowed chars: " + sActualValue_ColumnKey);
			aActualValueColumnKeys.push(sActualValue_ColumnKey);

			//Test Smart micro chart
			oDataField = aLineItem[8];
			sAnnotationPath = oDataField.Target.AnnotationPath;
			oDataFieldTarget = {};
			var oDataFieldTargetValue = {};
			sActualValue_CustomData = this.oAnnotationHelper.createP13NColumnForChart(oInterface, oContextSet, oDataField, oDataFieldTarget, sAnnotationPath, mColumnWidthIncludingColumnHeader);
			sActualValue_ColumnKey = this.extractColumnKey(sActualValue_CustomData);
			sExpectedValue = sFioriTemplatePrefix + sSeperator + "DataFieldForAnnotation" + sSeperator + oDataField.Target.AnnotationPath.replace('@', '');
			console.log("columnKey: " + sExpectedValue);
			assert.equal(sActualValue_ColumnKey, sExpectedValue, "Smart micro chart - Check for expected ColumnKey: " + sExpectedValue);
			assert.equal(!!sActualValue_ColumnKey.match(sNonAllowedCharacters), true, "Smart micro chart - Check that the ColumnKey does not contain not allowed chars: " + sActualValue_ColumnKey);
			aActualValueColumnKeys.push(sActualValue_ColumnKey);

			//Test DataFieldWithUrl without navigation
			oDataField = aLineItem[9];
			sActualValue_ColumnKey = oDataField.Value.Path; //determination and specification of columnKey done by SmartTable
			console.log("example for determination and specification of columnKey done by SmartTable - columnKey: " + sActualValue_ColumnKey);
			aActualValueColumnKeys.push(sActualValue_ColumnKey);

			//Test DataFieldWithUrl without navigation
			oDataField = aLineItem[10];
			sActualValue_ColumnKey = oDataField.Value.Path; //example for determination and specification of columnKey done by SmartTable
			console.log("example for determination and specification of columnKey done by SmartTable - columnKey: " + sActualValue_ColumnKey);
			aActualValueColumnKeys.push(sActualValue_ColumnKey);

			//Test breakout
			sActualValue_ColumnKey = "ProductPictureURL2"; //specification up to the breakout developer
			console.log("specification up to the breakout developer - columnKey: " + sActualValue_ColumnKey);
			aActualValueColumnKeys.push(sActualValue_ColumnKey);

			//Test Cross all ColumnKeys
			var aActualValueColumnKeys_Sorted = aActualValueColumnKeys.slice().sort();
			var aDuplicates = [];
			for (var i = 0; i < aActualValueColumnKeys.length - 1; i++) {
				if (aActualValueColumnKeys_Sorted[i + 1] === aActualValueColumnKeys_Sorted[i]) {
					aDuplicates.push(aActualValueColumnKeys_Sorted[i]);
				}
			}
			assert.equal(aDuplicates.length, 0, "Cross all ColumnKeys - Check for duplicate columnKeys: " + aDuplicates.toString());

		});

		QUnit.test("P13N with description and unit", function (assert) {
			var mColumnWidthIncludingColumnHeader = {};
			var oInterface = {
				getInterface: function () {
					return {
						getModel: function () {
							return {
								getODataEntityType: function () {return {};},
								getObject: function () {return {};}
							}
						},
						getPath: function () {return "";}
					}
				}
			}
			var oContextSet = {
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType"
			};

			var oContextProp = {
				"com.sap.vocabularies.Common.v1.Text": {
					Path: "ProductText"
				},
				"Org.OData.Measures.V1.Unit": {
					Path: "ProductUnit"
				}
			};

			var oDataField = {
				RecordType: "com.sap.vocabularies.UI.v1.DataField",
				Value: {
					Path: "Product"
				}
			};

			var sP13N = this.oAnnotationHelper.createP13N(oInterface, oContextSet, oContextProp, oDataField, mColumnWidthIncludingColumnHeader);
			var oP13N = JSON.parse(sP13N.replace(/\\/g, ""));
			assert.equal(oP13N.description, "ProductText", "The P13N should contain the description");
			assert.equal(oP13N.unit, "ProductUnit", "The P13N should contain the unit");
		});

		QUnit.test("P13N for connected fields", function (assert) {
			var mColumnWidthIncludingColumnHeader = {};
			var oEntityType = {
				name: "STTA_C_MP_ProductType",
				namespace: "STTA_PROD_MAN",
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
				property: [
					{
						"name": "Height",
						"type": "Edm.Decimal",
						"Org.OData.Measures.V1.Unit": {
							"Path": "DimensionUnit"
						}
					},
					{
						"name": "Width",
						"type": "Edm.Decimal",
						"Org.OData.Measures.V1.Unit": {
							"Path": "DimensionUnit"
						}
					},
					{
						"name": "Depth",
						"type": "Edm.Decimal",
						"Org.OData.Measures.V1.Unit": {
							"Path": "DimensionUnit"
						}
					}
				]
			}
			var oInterface = {
				getInterface: function () {
					return {
						getModel: function () {
							return {
								getODataEntityType: function () {return oEntityType;},
								getObject: function () {return {};},
								getContext: function () {
									return {
										getObject: function() {
											return {
												entityType: oEntityType
											}
										}
									}
								}
							}
						},
						getPath: function () {return "";}
					}
				}
			}
			var oEntitySetContext = {
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType"
			};

			var oConnectedColumn = {
				"Target": {
					"AnnotationPath": "@com.sap.vocabularies.UI.v1.FieldGroup#DTAGroup"
				},
				"Label": {
					"String": "Dimensions"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataFieldForAnnotation"
			};

			var oConnectedDataFields = {
				"Data": [
					{
						"Value": {
							"Path": "Depth"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					},
					{
						"Value": {
							"Path": "Width"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					},
					{
						"Value": {
							"Path": "Height"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					}
				],
				"RecordType": "com.sap.vocabularies.UI.v1.FieldGroupType"
			};

			var sP13N = this.oAnnotationHelper.createP13NColumnForConnectedFields(oInterface, oEntitySetContext, oConnectedColumn, oConnectedDataFields, mColumnWidthIncludingColumnHeader);
			var oP13N = JSON.parse(sP13N.replace(/\\/g, ""));
			var aAdditionalProperties = oP13N.additionalProperty.split(",");
			var aAdditionalSortProperties = oP13N.additionalSortProperty.split(",");
			// The "p13nData" should always have "leadingProperty". Otherwise, the column won't be available in exported excel.
			assert.equal(oP13N.leadingProperty, "Depth", "First data field's path should be set as 'leadingProperty'");
			assert.equal(oP13N.sortProperty, "Depth", "First data field's path should be set as 'sortProperty' as well");
			assert.ok(aAdditionalProperties.includes("Width") && aAdditionalProperties.includes("Height"), "Paths of all remaining data fields should be included in the additionalProperty");
			assert.ok(aAdditionalSortProperties.includes("Width") && aAdditionalSortProperties.includes("Height"), "Paths of all the remaining data fields should be included in the additionalSortProperty as well");
			assert.ok(aAdditionalProperties.includes("DimensionUnit"), "The unit should be included in the additionalProperty");
			assert.ok(aAdditionalSortProperties.includes("DimensionUnit"), "The unit should be included in the additionalSortProperty");
		});

});
