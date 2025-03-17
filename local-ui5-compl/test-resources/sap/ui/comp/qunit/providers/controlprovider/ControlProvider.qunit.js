/* global QUnit sinon */
sap.ui.define([
	"sap/ui/comp/providers/ControlProvider",
	"sap/ui/comp/odata/MetadataAnalyser",
	"sap/ui/comp/odata/CriticalityMetadata",
	"sap/ui/comp/util/FormatUtil",
	"sap/ui/comp/smartfield/ODataHelper",
	"sap/ui/comp/smartfield/AnnotationHelper",
	"sap/ui/comp/navpopover/SemanticObjectController",
	"sap/ui/comp/odata/AnalyticalAnalyser"
], function(ControlProvider, MetadataAnalyser, CriticalityMetadata, FormatUtil, ODataHelper, AnnotationHelper, SemanticObjectController, AnalyticalAnalyser) {
	"use strict";

	QUnit.module("sap.ui.comp.providers.ControlProvider", {
		beforeEach: function() {
			this.oControlProvider = new ControlProvider({
				processDataFieldDefault: true,
				metadataAnalyser: new MetadataAnalyser(),
				useUTCDateTime: true
			});
		},
		afterEach: function() {
			this.oControlProvider.destroy();
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oControlProvider);
	});

	QUnit.test("Shall contain an instance of metadata analyser", function(assert) {
		assert.ok(this.oControlProvider._oMetadataAnalyser);
		assert.strictEqual(this.oControlProvider._oMetadataAnalyser instanceof MetadataAnalyser, true);
	});

	QUnit.test("Shall contain an instance of ODataHelper which is initializing AnalyticalAnalyser", function(assert) {
		var oAnalyticalAnalyser = this.oControlProvider._oHelper.getAnalyzer();

		assert.ok(this.oControlProvider._oHelper instanceof ODataHelper);
		assert.ok(oAnalyticalAnalyser instanceof AnalyticalAnalyser);
	});

	QUnit.test("Shall return the view metadata with Text as default template for field", function(assert) {
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({});
		assert.ok(oFieldViewMetadata);
		assert.equal(oFieldViewMetadata.template.isA("sap.m.Text"), true);
	});

	QUnit.test("Shall return the view metadata with Input as template for editable field", function(assert) {
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({}, true);
		assert.ok(oFieldViewMetadata);
		assert.equal(oFieldViewMetadata.template.isA("sap.m.Input"), true);
	});

	QUnit.test("Shall return the view metadata with DatePicker as template for date format field", function(assert) {
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.DateTime",
			displayFormat: "Date"
		}, true);
		assert.ok(oFieldViewMetadata);
		assert.equal(oFieldViewMetadata.template.isA("sap.m.DatePicker"), true);

		var oValueBindingInfo = oFieldViewMetadata.template.getBindingInfo("value");
		assert.ok(oValueBindingInfo);
		assert.ok(oValueBindingInfo.type.isA("sap.ui.model.odata.type.DateTime"));
	});

	QUnit.test("Shall return the view metadata with UTC true in format options", function(assert) {
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.DateTime"
		}, true);
		assert.ok(oFieldViewMetadata);
		assert.strictEqual(oFieldViewMetadata.modelType.oFormatOptions.UTC, true);
	});

	QUnit.test("Shall return the view metadata with DatePicker as template for IsCalendarDate field", function(assert) {
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String",
			isCalendarDate: true
		}, true);
		assert.ok(oFieldViewMetadata);
		assert.equal(oFieldViewMetadata.template.isA("sap.m.DatePicker"), true);
	});

	QUnit.test("Shall return the view metadata with right aligned Text as template for IsCalendarDate field", function(assert) {
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String",
			"com.sap.vocabularies.Common.v1.IsCalendarDate": {
				Bool: "true"
			}
		});
		assert.ok(oFieldViewMetadata);
		assert.equal(oFieldViewMetadata.template.isA("sap.m.Text"), true);
		assert.equal(oFieldViewMetadata.align, "Right");
	});

	QUnit.test("Shall return the view metadata with right aligned Text as template for Calendar/FiscalYear annotated field", function(assert) {
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String",
			"com.sap.vocabularies.Common.v1.IsFiscalYear": {
				Bool: "true"
			}
		});
		assert.ok(oFieldViewMetadata);
		assert.equal(oFieldViewMetadata.template.isA("sap.m.Text"), true);
		assert.equal(oFieldViewMetadata.align, "Right");
	});

	QUnit.test("Shall return the view metadata with right aligned Input control as template for Calendar/FiscalYear annotated field", function(assert) {
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String",
			"com.sap.vocabularies.Common.v1.IsFiscalYear": {
				Bool: "true"
			}
		}, true);
		assert.ok(oFieldViewMetadata);
		assert.equal(oFieldViewMetadata.template.isA("sap.m.Input"), true);
		assert.equal(oFieldViewMetadata.template.getTextAlign(), "Right");
		assert.equal(oFieldViewMetadata.align, "Right");
	});

	QUnit.test("Shall return the view metadata with HBox as default template for Measure fields", function(assert) {
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.Decimal",
			isMeasureField: true,
			unit: "bar"
		});
		assert.ok(oFieldViewMetadata);
		assert.equal(oFieldViewMetadata.template.isA("sap.m.HBox"), true);
	});

	QUnit.test("Shall return the view metadata with Text as default template for Measure fields without unit", function(assert) {
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.Decimal",
			isMeasureField: true
		});
		assert.ok(oFieldViewMetadata);
		assert.equal(oFieldViewMetadata.template.isA("sap.m.Text"), true);
	});

	QUnit.test("Shall return the view metadata with Link as default template for IsEmailAddress and IsPhoneNumber annotations", function(assert) {
		// isEmailAddress
		var oFieldViewMetadataEmail = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String",
			isEmailAddress: true
		});
		assert.ok(oFieldViewMetadataEmail);
		assert.equal(oFieldViewMetadataEmail.template.isA("sap.m.Link"), true, "Email address would be rendered as a link");

		// isPhoneNumber
		var oFieldViewMetadataPhone = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String",
			isPhoneNumber: true
		});
		assert.ok(oFieldViewMetadataPhone);
		assert.equal(oFieldViewMetadataPhone.template.isA("sap.m.Link"), true, "Phone number would be rendered as a link");
	});

	QUnit.test("Shall return the view metadata with ObjectIdentifier as default template for fields with SemanticKey", function(assert) {
		var fSpy = this.spy(MetadataAnalyser, "resolveEditableFieldFor");
		assert.ok(fSpy.notCalled);

		// setup necessary properties
		this.oControlProvider._oSemanticKeyAnnotation = {
			semanticKeyFields: [
				"Product"
			]
		};
		this.oControlProvider._isMobileTable = true;

		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "Product",
			type: "Edm.Decimal",
			unit: "UnitFieldPath"
		});

		assert.ok(oFieldViewMetadata);
		assert.equal(oFieldViewMetadata.template.isA("sap.m.ObjectIdentifier"), true);

		assert.ok(fSpy.notCalled); //no need to check "EditableFieldFor"
	});

	QUnit.test("Shall return the view metadata with ObjectIdentifier as default template for fields with SemanticKey (via EditableFieldFor)", function(assert) {
		var fSpy = this.spy(MetadataAnalyser, "resolveEditableFieldFor");
		assert.ok(fSpy.notCalled);

		this.oControlProvider._oSemanticKeyAnnotation = {
			semanticKeyFields: [
				"Product"
			]
		};
		this.oControlProvider._isMobileTable = true;

		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.Decimal",
			description: "DescPath",
			// Dummy EditableFieldFor annotation pointing to some property
			"com.sap.vocabularies.Common.v1.EditableFieldFor": {
				PropertyPath: "Product"
			}
		});

		assert.ok(oFieldViewMetadata);
		assert.equal(oFieldViewMetadata.template.isA("sap.m.ObjectIdentifier"), true);

		assert.ok(fSpy.calledOnce);
	});

	QUnit.test("Shall return the view metadata with Link as default template for fields with URLInfo (via DataFieldDefault)", function(assert) {
		var fSpy = sinon.spy(this.oControlProvider._oMetadataAnalyser, "updateDataFieldDefault");
		assert.ok(fSpy.notCalled);

		this.oControlProvider._oLineItemAnnotation = {
			fields: [
				"notFoo"
			]
		};

		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String",
			// Dummy DataFieldWithURL --> URLInfo in UI.DataFieldDefault
			"com.sap.vocabularies.UI.v1.DataFieldDefault": {
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldWithUrl",
				Label: "Label for foo",
				Url: {
					Path: "bar"
				}
			}
		});

		assert.ok(oFieldViewMetadata);
		assert.deepEqual(oFieldViewMetadata.urlInfo, {
			urlPath: "bar"
		});
		assert.equal(oFieldViewMetadata.template.isA("sap.m.Link"), true);
		assert.ok(fSpy.calledOnce);
	});

	QUnit.test("Shall return the view metadata with ObjectStatus as default template for fields with Criticality (via DataFieldDefault)", function(assert) {
		var fSpy = sinon.spy(this.oControlProvider._oMetadataAnalyser, "updateDataFieldDefault");
		assert.ok(fSpy.notCalled);

		this.oControlProvider._oLineItemAnnotation = {};

		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.Decimal",
			description: "foo", // this will be ignored (as this is a UoM field primarily)
			unit: "UnitFieldPath",
			// Dummy DataFieldWithURL --> CriticalityIno in UI.DataFieldDefault
			"com.sap.vocabularies.UI.v1.DataFieldDefault": {
				RecordType: "com.sap.vocabularies.UI.v1.DataField",
				Label: "Label for foo",
				Criticality: {
					EnumMember: "com.sap.vocabularies.UI.v1.CriticalityType/Critical"
				},
				CriticalityRepresentation: {
					EnumMember: "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon"
				}
			}
		});

		assert.ok(oFieldViewMetadata);
		assert.strictEqual(oFieldViewMetadata.align, "Right");
		assert.equal(oFieldViewMetadata.template.isA("sap.m.ObjectStatus"), true);

		assert.ok(fSpy.calledOnce);
	});

	QUnit.test("Shall right align date fields, regardless of description display", function(assert) {
		var fSpy = sinon.spy(this.oControlProvider._oMetadataAnalyser, "updateDataFieldDefault");
		assert.ok(fSpy.notCalled);

		this.oControlProvider._oLineItemAnnotation = {};

		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.DateTimeOffset",
			description: "foo",
			displayBehaviour: "descriptionOnly"
		});

		assert.ok(oFieldViewMetadata);
		assert.strictEqual(oFieldViewMetadata.align, "Right");
		assert.equal(oFieldViewMetadata.template.isA("sap.m.Text"), true);

		assert.ok(fSpy.calledOnce);
	});

	QUnit.test("Shall right align UoM fields, regardless of description display", function(assert) {
		var fSpy = sinon.spy(this.oControlProvider._oMetadataAnalyser, "updateDataFieldDefault");
		assert.ok(fSpy.notCalled);

		this.oControlProvider._oLineItemAnnotation = {};

		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.Decimal",
			unit: "foo",
			description: "fooDesc",
			displayBehaviour: "descriptionOnly"
		});

		assert.ok(oFieldViewMetadata);
		assert.strictEqual(oFieldViewMetadata.align, "Right");
		assert.equal(oFieldViewMetadata.template.isA("sap.m.HBox"), true);
		assert.equal(oFieldViewMetadata.template.getItems().length, 2, "Template has 2 items.");
		assert.equal(oFieldViewMetadata.template.getItems()[1].isA("sap.m.Text"), true, "Unit field is a Text control.");
		assert.strictEqual(oFieldViewMetadata.template.getItems()[1].getWidth(), "3.3em", "Width of the unit field is set to 3.3em");

		assert.ok(fSpy.calledOnce);
	});

	QUnit.test("Shall not right align numeric ObjectStatus with non idOnly description display", function(assert) {
		var fSpy = sinon.spy(this.oControlProvider._oMetadataAnalyser, "updateDataFieldDefault");
		assert.ok(fSpy.notCalled);

		this.oControlProvider._oLineItemAnnotation = {};

		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.Int32",
			description: "foo",
			displayBehaviour: "descriptionOnly",
			// Dummy DataField --> CriticalityInfo in UI.DataFieldDefault
			"com.sap.vocabularies.UI.v1.DataFieldDefault": {
				RecordType: "com.sap.vocabularies.UI.v1.DataField",
				Label: "Label for foo",
				Criticality: {
					EnumMember: "com.sap.vocabularies.UI.v1.CriticalityType/Critical"
				},
				CriticalityRepresentation: {
					EnumMember: "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon"
				}
			}
		});

		assert.ok(oFieldViewMetadata);
		assert.strictEqual(oFieldViewMetadata.align, undefined);
		assert.equal(oFieldViewMetadata.template.isA("sap.m.ObjectStatus"), true);

		assert.ok(fSpy.calledOnce);
	});

	QUnit.test("Shall not right align numeric fields with description display", function(assert) {
		var fSpy = sinon.spy(this.oControlProvider._oMetadataAnalyser, "updateDataFieldDefault");
		assert.ok(fSpy.notCalled);

		this.oControlProvider._oLineItemAnnotation = {};

		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.Int32",
			description: "foo",
			displayBehaviour: "descriptionOnly"
		});

		assert.ok(oFieldViewMetadata);
		assert.strictEqual(oFieldViewMetadata.align, undefined);
		assert.equal(oFieldViewMetadata.template.isA("sap.m.Text"), true);

		assert.ok(fSpy.calledOnce);
	});

	QUnit.test("Shall right align numeric fields with description for idOnly display", function(assert) {
		var fSpy = sinon.spy(this.oControlProvider._oMetadataAnalyser, "updateDataFieldDefault");
		assert.ok(fSpy.notCalled);

		this.oControlProvider._oLineItemAnnotation = {};

		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.Int32",
			description: "foo",
			displayBehaviour: "idOnly"
		});

		assert.ok(oFieldViewMetadata);
		assert.strictEqual(oFieldViewMetadata.align, "Right");
		assert.equal(oFieldViewMetadata.template.isA("sap.m.Text"), true);

		assert.ok(fSpy.calledOnce);
	});

	QUnit.test("Shall ignore DataFieldDefault when processing is disabled", function(assert) {
		var fSpy = sinon.spy(this.oControlProvider._oMetadataAnalyser, "updateDataFieldDefault");
		assert.ok(fSpy.notCalled);

		this.oControlProvider._oLineItemAnnotation = {
			fields: [
				"notFoo"
			]
		};

		assert.ok(this.oControlProvider._bProcessDataFieldDefault);

		this.oControlProvider._bProcessDataFieldDefault = false;

		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String",
			// Dummy DataFieldWithURL --> URLInfo in UI.DataFieldDefault
			"com.sap.vocabularies.UI.v1.DataFieldDefault": {
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldWithUrl",
				Label: "Label for foo",
				Url: {
					Path: "bar"
				}
			}
		});

		assert.ok(oFieldViewMetadata);
		assert.equal(oFieldViewMetadata.urlInfo, undefined);
		assert.equal(oFieldViewMetadata.template.isA("sap.m.Text"), true);
		assert.ok(fSpy.notCalled);
	});

	QUnit.test("MeasureField template control should have Mono font", function(assert) {
		this.oControlProvider._oLineItemAnnotation = {};

		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.Decimal",
			isCurrency: true,
			unit: "foo"
		});

		assert.ok(oFieldViewMetadata);
		assert.strictEqual(oFieldViewMetadata.align, "Right");
		assert.equal(oFieldViewMetadata.template.isA("sap.m.HBox"), true);

		var aItems = oFieldViewMetadata.template.getItems(),
			oAmount = aItems[0],
			oUnit = aItems[1];

		assert.ok(oAmount.isA("sap.m.Text"));
		assert.equal(oAmount.getTextAlign(), "End");
		assert.ok(oAmount.hasStyleClass("sapUiCompCurrencyTabNums"));
		assert.ok(oUnit.isA("sap.m.Text"));
		assert.equal(oUnit.getTextAlign(), "End");
		assert.ok(oUnit.hasStyleClass("sapUiCompCurrencyMonoFont"));
	});

	QUnit.test("Shall create multiunit link for Currency in Analytical scenarios", function(assert) {
		this.oControlProvider._oLineItemAnnotation = {};
		this.oControlProvider._isAnalyticalTable = true;

		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.Decimal",
			isCurrency: true,
			unit: "foo"
		});

		assert.ok(oFieldViewMetadata);
		assert.strictEqual(oFieldViewMetadata.align, "Right");
		assert.equal(oFieldViewMetadata.template.isA("sap.m.VBox"), true);
		assert.equal(oFieldViewMetadata.template.getItems()[0].isA("sap.m.Link"), true);
		assert.equal(oFieldViewMetadata.template.getItems()[1].isA("sap.m.HBox"), true);
	});

	QUnit.test("Shall create multiunit link for UoM in Analytical scenarios", function(assert) {
		this.oControlProvider._oLineItemAnnotation = {};
		this.oControlProvider._isAnalyticalTable = true;

		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.Decimal",
			unit: "foo"
		});

		assert.ok(oFieldViewMetadata);
		assert.strictEqual(oFieldViewMetadata.align, "Right");
		assert.equal(oFieldViewMetadata.template.isA("sap.m.VBox"), true);
		assert.equal(oFieldViewMetadata.template.getItems()[0].isA("sap.m.Link"), true);
		assert.equal(oFieldViewMetadata.template.getItems()[1].isA("sap.m.HBox"), true);
	});

	QUnit.test("Shall return the view metadata with Link as default template for fields with URLInfo (regardless of table type)", function(assert) {
		var fSpy = sinon.spy(this.oControlProvider._oMetadataAnalyser, "updateDataFieldDefault");
		assert.ok(fSpy.notCalled);
		this.oControlProvider._oLineItemAnnotation = {
			fields: [
				"foo"
			]
		};
		// Dummy DataFieldWithURL --> URLInfo in UI.LineItem
		this.oControlProvider._oLineItemAnnotation.urlInfo = {
			"foo": {
				urlPath: "bar"
			}
		};

		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String",
			// Dummy DataFieldWithURL --> URLInfo in UI.DataFieldDefault
			"com.sap.vocabularies.UI.v1.DataFieldDefault": {
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldWithUrl",
				Label: "Label for foo",
				Url: {
					Path: "NewPath"
				}
			}
		});

		assert.ok(oFieldViewMetadata);
		assert.deepEqual(oFieldViewMetadata.urlInfo, {
			urlPath: "bar"
		});
		assert.notEqual(oFieldViewMetadata.urlInfo.urlPath, "NewPath");
		assert.equal(oFieldViewMetadata.template.isA("sap.m.Link"), true);

		assert.ok(fSpy.notCalled);
	});

	QUnit.test("Shall return the view metadata with ObjectStatus as default template for fields with Criticality (regardless of table type)", function(assert) {

		this.oControlProvider._oLineItemAnnotation = {
			fields: [
				"foo"
			]
		};
		// Dummy DataField --> Criticality in UI.LineItem
		this.oControlProvider._oLineItemAnnotation.criticality = {
			"foo": {
				criticalityRepresentationType: "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon",
				criticalityType: "com.sap.vocabularies.UI.v1.CriticalityType/Critical"
			}
		};

		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String"
		});

		assert.ok(oFieldViewMetadata);
		assert.equal(oFieldViewMetadata.template.isA("sap.m.ObjectStatus"), true);
	});

	QUnit.test("Shall return the view metadata with ObjectStatus as default template for fields with Criticality (regardless of table type), considering displayBehaviour", function(assert) {
		this.oControlProvider._oLineItemAnnotation = {
			fields: [
				"foo"
			]
		};
		this.oControlProvider._bEnableDescriptions = true;
		// Dummy DataField --> Criticality in UI.LineItem
		this.oControlProvider._oLineItemAnnotation.criticality = {
			"foo": {
				criticalityRepresentationType: "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon",
				criticalityType: "com.sap.vocabularies.UI.v1.CriticalityType/Critical"
			}
		};

		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String",
			description: "desc",
			displayBehaviour: "descriptionAndId"
		});

		assert.ok(oFieldViewMetadata);
		var oControl = oFieldViewMetadata.template;
		assert.equal(oControl.isA("sap.m.ObjectStatus"), true);

		// Descrition and displayBehaviour present --> Binding/info exists accordingly
		var oTextBindingInfo = oControl.getBindingInfo("text");
		assert.ok(oTextBindingInfo);
		assert.ok(oTextBindingInfo.formatter);
		assert.equal(oTextBindingInfo.parts.length, 2);
		assert.equal(oTextBindingInfo.parts[1].path, "desc");
	});

	QUnit.test("Criticality info (Both Static) -  shall be considered while creating ObjectStatusControl", function(assert) {
		this.oControlProvider._isMobileTable = true;
		this.oControlProvider._oLineItemAnnotation = {
			fields: [
				"foo"
			]
		};
		// With criticalityRepresentationType set to "WithoutIcon"
		this.oControlProvider._oLineItemAnnotation.criticality = {
			"foo": {
				criticalityRepresentationType: "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon",
				criticalityType: "com.sap.vocabularies.UI.v1.CriticalityType/Neutral"
			}
		};
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String"
		});
		assert.ok(oFieldViewMetadata);
		var oControl = oFieldViewMetadata.template;
		assert.equal(oControl.isA("sap.m.ObjectStatus"), true);

		// Static Criticality and Icon --> No binding/info exists
		assert.equal(oControl.getBindingInfo("state"), undefined);
		assert.equal(oControl.getBindingInfo("icon"), undefined);

		// Check Static Values
		assert.equal(oControl.getState(), "None");
		assert.equal(oControl.getIcon(), "");

		// Without criticalityRepresentationType enum --> default
		this.oControlProvider._oLineItemAnnotation.criticality = {
			"foo": {
				criticalityType: "com.sap.vocabularies.UI.v1.CriticalityType/Positive"
			}
		};
		oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String"
		});
		assert.ok(oFieldViewMetadata);
		oControl = oFieldViewMetadata.template;
		assert.equal(oControl.isA("sap.m.ObjectStatus"), true);

		// Static Criticality and Icon --> No binding/info exists
		assert.equal(oControl.getBindingInfo("state"), undefined);
		assert.equal(oControl.getBindingInfo("icon"), undefined);

		// Check Static Values
		assert.equal(oControl.getState(), "Success");
		assert.equal(oControl.getIcon(), "sap-icon://sys-enter-2");
		assert.equal(oFieldViewMetadata.criticality, undefined);
		assert.equal(oFieldViewMetadata.criticalityRepresentation, undefined);
	});

	QUnit.test("Criticality info (only CriticalityType Static) -  shall be considered while creating ObjectStatusControl", function(assert) {
		this.oControlProvider._isMobileTable = true;
		this.oControlProvider._oLineItemAnnotation = {
			fields: [
				"foo"
			]
		};
		// With criticalityRepresentation pointing to a Path
		this.oControlProvider._oLineItemAnnotation.criticality = {
			"foo": {
				criticalityRepresentationPath: "PathToSomeField",
				criticalityType: "com.sap.vocabularies.UI.v1.CriticalityType/Neutral"
			}
		};
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String"
		});
		assert.ok(oFieldViewMetadata);
		var oControl = oFieldViewMetadata.template;
		assert.equal(oControl.isA("sap.m.ObjectStatus"), true);

		// Static Criticality --> No binding/info exists
		assert.equal(oControl.getBindingInfo("state"), undefined);
		assert.equal(oControl.getState(), "None");

		// Dynamic Value for Icon with value path and formatter
		var oIconBindingInfo = oControl.getBindingInfo("icon");
		assert.ok(oIconBindingInfo);
		assert.equal(oIconBindingInfo.parts.length, 1);
		assert.equal(oIconBindingInfo.parts[0].path, "PathToSomeField");
		var fIconFormatter = oIconBindingInfo.formatter;
		assert.ok(fIconFormatter);
		// returns icon for static criticality for any field value
		assert.equal(fIconFormatter("com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithIcon"), null);
		assert.equal(fIconFormatter(), null);

		// returns no-icon only when value is "WithoutIcon"
		assert.equal(fIconFormatter("com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon"), undefined);

		assert.equal(oFieldViewMetadata.criticality, undefined);
		assert.equal(oFieldViewMetadata.criticalityRepresentation, "PathToSomeField");
	});

	QUnit.test("Criticality info (only CriticalityRepresentationType Static) -  shall be considered while creating ObjectStatusControl", function(assert) {
		this.oControlProvider._isMobileTable = true;
		this.oControlProvider._oLineItemAnnotation = {
			fields: [
				"foo"
			]
		};
		// With criticality pointing to a Path && criticalityRepresentationType set to "WithoutIcon"
		this.oControlProvider._oLineItemAnnotation.criticality = {
			"foo": {
				criticalityRepresentationType: "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon",
				path: "PathToSomeCriticalityField"
			}
		};
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String"
		});
		assert.ok(oFieldViewMetadata);
		var oControl = oFieldViewMetadata.template;
		assert.equal(oControl.isA("sap.m.ObjectStatus"), true);

		// Dynamic Criticality but WithoutIcon --> No binding/info exists for icon
		assert.equal(oControl.getBindingInfo("icon"), undefined);
		assert.equal(oControl.getIcon(), "");

		// Dynamic Value for State with value path and formatter
		var oStateBindingInfo = oControl.getBindingInfo("state");
		assert.ok(oStateBindingInfo);
		assert.equal(oStateBindingInfo.parts.length, 1);
		assert.equal(oStateBindingInfo.parts[0].path, "PathToSomeCriticalityField");
		var fStateFormatter = oStateBindingInfo.formatter;
		assert.ok(fStateFormatter);
		// returns state based on the value/enum member name
		assert.equal(fStateFormatter(1), "Error");
		assert.equal(fStateFormatter("com.sap.vocabularies.UI.v1.CriticalityType/Critical"), "Warning");

		// returns nothing for invalid/unknown values
		assert.equal(fStateFormatter("foo"), undefined);
		assert.equal(fStateFormatter(), undefined);

		// Test With Icon
		delete this.oControlProvider._oLineItemAnnotation.criticality["foo"].criticalityRepresentationType;
		oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String"
		});
		assert.ok(oFieldViewMetadata);
		oControl = oFieldViewMetadata.template;
		assert.equal(oControl.isA("sap.m.ObjectStatus"), true);

		// Dynamic Criticality and icon --> Binding/info exists for icon
		var oIconBindingInfo = oControl.getBindingInfo("icon");
		assert.ok(oIconBindingInfo);
		assert.equal(oIconBindingInfo.parts.length, 1);
		assert.equal(oIconBindingInfo.parts[0].path, "PathToSomeCriticalityField");
		var fIconFormatter = oIconBindingInfo.formatter;
		assert.equal(fIconFormatter, CriticalityMetadata.getCriticalityIcon);
		// returns icon based on Criticality field value
		assert.equal(fIconFormatter(1), "sap-icon://error");
		assert.equal(fIconFormatter("com.sap.vocabularies.UI.v1.CriticalityType/Critical"), "sap-icon://alert");

		// returns nothing for invalid/unknown values
		assert.equal(fIconFormatter("foo"), undefined);
		assert.equal(fIconFormatter(), undefined);

		assert.equal(oFieldViewMetadata.criticality, "PathToSomeCriticalityField");
		assert.equal(oFieldViewMetadata.criticalityRepresentation, undefined);
	});

	QUnit.test("Criticality info (both Dynamic Paths) -  shall be considered while creating ObjectStatusControl", function(assert) {
		this.oControlProvider._isMobileTable = true;
		this.oControlProvider._oLineItemAnnotation = {
			fields: [
				"foo"
			]
		};
		// With criticality pointing to a Path && criticalityRepresentationType set to "WithoutIcon"
		this.oControlProvider._oLineItemAnnotation.criticality = {
			"foo": {
				criticalityRepresentationPath: "PathToSomeField",
				path: "PathToSomeCriticalityField"
			}
		};
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String"
		});
		assert.ok(oFieldViewMetadata);
		var oControl = oFieldViewMetadata.template;
		assert.equal(oControl.isA("sap.m.ObjectStatus"), true);

		// Dynamic Criticality and icon --> Binding/info exists for icon
		var oIconBindingInfo = oControl.getBindingInfo("icon");
		assert.ok(oIconBindingInfo);
		assert.equal(oIconBindingInfo.parts.length, 2);
		assert.equal(oIconBindingInfo.parts[0].path, "PathToSomeCriticalityField");
		assert.equal(oIconBindingInfo.parts[1].path, "PathToSomeField");
		var fIconFormatter = oIconBindingInfo.formatter;

		// returns icon based on Criticality field value
		assert.equal(fIconFormatter(1), "sap-icon://error");
		assert.equal(fIconFormatter("com.sap.vocabularies.UI.v1.CriticalityType/Critical", "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithIcon"), "sap-icon://alert");

		// returns nothing for icon based on Criticality field value when WithoutIcon is explicitly specified
		assert.equal(fIconFormatter(2, "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon"), undefined);
		assert.equal(fIconFormatter("com.sap.vocabularies.UI.v1.CriticalityType/Critical", "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon"), undefined);

		// returns nothing for invalid/unknown values regardless of whether "WithoutIcon" is explicitly specified
		assert.equal(fIconFormatter("foo"), undefined);
		assert.equal(fIconFormatter(1, "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon"), undefined);
		assert.equal(fIconFormatter(), undefined);

		// Dynamic Value for State with value path and formatter
		var oStateBindingInfo = oControl.getBindingInfo("state");
		assert.ok(oStateBindingInfo);
		assert.equal(oStateBindingInfo.parts.length, 1);
		assert.equal(oStateBindingInfo.parts[0].path, "PathToSomeCriticalityField");
		var fStateFormatter = oStateBindingInfo.formatter;
		assert.ok(fStateFormatter);
		// returns state based on the value/enum member name
		assert.equal(fStateFormatter(1), "Error");
		assert.equal(fStateFormatter("com.sap.vocabularies.UI.v1.CriticalityType/Critical"), "Warning");

		// returns nothing for invalid/unknown values
		assert.equal(fStateFormatter("foo"), undefined);
		assert.equal(fStateFormatter(), undefined);

		assert.equal(oFieldViewMetadata.criticality, "PathToSomeCriticalityField");
		assert.equal(oFieldViewMetadata.criticalityRepresentation, "PathToSomeField");
	});

	QUnit.test("Destroy", function(assert) {
		assert.equal(this.oControlProvider.bIsDestroyed, undefined);
		this.oControlProvider.destroy();
		assert.equal(this.oControlProvider._oMetadataAnalyser, null);
		assert.equal(this.oControlProvider._aTableViewMetadata, null);
		assert.strictEqual(this.oControlProvider.bIsDestroyed, true);
	});

	QUnit.test("createModelTypeInstance", function(assert) {
		["Boolean", "Byte", "DateTime", "Double", "Decimal", "Int16", "Int32", "Int64", "SByte", "Single", "String", "Time"].forEach(function(sType) {
			var oModelType = this.oControlProvider.createModelTypeInstance({type : "Edm." + sType});
			assert.ok(oModelType.isA("sap.ui.model.odata.type." + sType), "Edm." + sType + " type created successfully");
		}, this);
	});

	QUnit.test("_updateValueListMetadata should check for Common.ValueListWithFixedValues", function(assert) {
		// Arrange
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			"com.sap.vocabularies.Common.v1.ValueList": {},
			"com.sap.vocabularies.Common.v1.ValueListWithFixedValues": {Bool: "true"}
		});

		// Act
		this.oControlProvider._updateValueListMetadata(oFieldViewMetadata);

		// Assert
		assert.equal(oFieldViewMetadata.hasFixedValues, true, "ValueListWithFixedValues is correctly evaluated");

	});

	QUnit.test("_createEditableTemplate must not use BindingInfos with formatter", function(assert) {
		const aFields = [
			{ name: "Property01", visible: true, displayBehaviour: "descriptionAndId", type: "Edm.String" },
			{ name: "Property02", visible: true, displayBehaviour: "descriptionAndId", type: "Edm.String", description: "DescriptionId" },
			{ name: "Property03", visible: true, displayBehaviour: "descriptionAndId", type: "Edm.Date" },
			{ name: "Property04", visible: true, displayBehaviour: "descriptionAndId", type: "Edm.Time" },
			{ name: "Property05", visible: true, displayBehaviour: "descriptionAndId", type: "Edm.DateTime", "sap:display-format": "Date" },
			{ name: "Property06", visible: true, displayBehaviour: "descriptionAndId", type: "Edm.DateTimeOffset", timezone: "TimezoneId" },
			{ name: "Property07", visible: true, displayBehaviour: "descriptionAndId", type: "Edm.Boolean" },
			{ name: "Property08", visible: true, displayBehaviour: "descriptionAndId", type: "Edm.Byte" },
			{ name: "Property09", visible: true, displayBehaviour: "descriptionAndId", type: "Edm.Decimal", unit: "UnitId", scale: 2 },
			{ name: "Property10", visible: true, displayBehaviour: "descriptionAndId", type: "Edm.Int32" },
			{ name: "Property11", visible: true, displayBehaviour: "descriptionAndId", type: "Edm.String", isFiscalDate: true }
		];
		const aControlBindingMap = {
			"sap.m.DatePicker": "value",
			"sap.m.CheckBox": "selected",
			"sap.m.Input": "value",
			"sap.m.TimePicker": "value"
		};

		aFields.forEach((oField) => {
			const oTemplate = this.oControlProvider._createEditableTemplate(oField);

			assert.ok(oTemplate, "Template is defined");

			const [, sBindingProperty] = Object.entries(aControlBindingMap).find(([sClassName]) => oTemplate.isA(sClassName));
			const mBindingInfo = oTemplate.getBindingInfo(sBindingProperty);

			assert.ok(mBindingInfo, "BindingInfo is available");
			assert.notOk(mBindingInfo.formatter, "No formatter assigned");
		});
	});

	QUnit.module("whitespace formatter", {
		beforeEach: function() {
			this.oControlProvider = new ControlProvider({
				processDataFieldDefault: true,
				metadataAnalyser: new MetadataAnalyser(),
				useUTCDateTime: true
			});
		},
		afterEach: function() {
			this.oControlProvider.destroy();
		}
	});

	QUnit.test("Text without TextArrangement", function(assert) {
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo"
		});
		assert.ok(oFieldViewMetadata);
		assert.strictEqual(typeof oFieldViewMetadata.template.getBindingInfo("text")["formatter"], "function", "formatter for whitespaceReplacer added for mobile table");
	});

	QUnit.test("Text with TextArrangement", function(assert) {
		this.oControlProvider._bEnableDescriptions = true;
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			description: "bar",
			displayBehaviour: "descriptionAndId"
		});

		assert.strictEqual(typeof oFieldViewMetadata.template.getBindingInfo("text")["formatter"], "function", "formatter for whitespaceReplacer added for mobile table");
	});

	QUnit.test("Link", function(assert) {
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			"com.sap.vocabularies.UI.v1.DataFieldDefault": {
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldWithUrl",
				Label: "Label for foo",
				Url: {
					Path: "bar"
				}
			}
		});

		assert.strictEqual(typeof oFieldViewMetadata.template.getBindingInfo("text")["formatter"], "function", "formatter for whitespaceReplacer added");
	});

	QUnit.test("ObjectStatus", function(assert) {
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.Decimal",
			description: "foo", // this will be ignored (as this is a UoM field primarily)
			// Dummy DataFieldWithURL --> CriticalityIno in UI.DataFieldDefault
			"com.sap.vocabularies.UI.v1.DataFieldDefault": {
				RecordType: "com.sap.vocabularies.UI.v1.DataField",
				Label: "Label for foo",
				Criticality: {
					EnumMember: "com.sap.vocabularies.UI.v1.CriticalityType/Critical"
				},
				CriticalityRepresentation: {
					EnumMember: "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon"
				}
			}
		});

		assert.strictEqual(typeof oFieldViewMetadata.template.getBindingInfo("text")["formatter"], "function", "formatter for whitespaceReplacer added");
	});

	QUnit.test("ObjectIdentifier", function(assert) {
		// ObjectIdentifier is only created for mobile table
		this.oControlProvider._isMobileTable = true;
		this.oControlProvider._oSemanticKeyAnnotation = {
			semanticKeyFields: [
				"Product"
			]
		};

		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "Product",
			description: "Code",
			displayBehaviour: "descriptionAndId"
		});
		assert.strictEqual(typeof oFieldViewMetadata.template.getBindingInfo("title")["formatter"], "function", "formatter for whitespaceReplacer added");
		assert.strictEqual(typeof oFieldViewMetadata.template.getBindingInfo("text")["formatter"], "function", "formatter for whitespaceReplacer added");
	});

	QUnit.test("isEmail & isPhone Link", function(assert) {
		// isEmailAddress
		var oFieldViewMetadataEmail = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String",
			isEmailAddress: true
		});
		assert.strictEqual(typeof oFieldViewMetadataEmail.template.getBindingInfo("text")["formatter"], "function", "formatter for whitespaceReplacer added");

		// isPhoneNumber
		var oFieldViewMetadataPhone = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String",
			isPhoneNumber: true
		});
		assert.strictEqual(typeof oFieldViewMetadataPhone.template.getBindingInfo("text")["formatter"], "function", "formatter for whitespaceReplacer added");
	});

	QUnit.test("SmartLink with CodeList", function(assert) {
		var oFieldTemplate = this.oControlProvider._createSmartLinkFieldTemplate({
			name: "OverdueAmount",
			label: "Overdue Amount",
			type: "Edm.Decimal",
			isCurrencyField: true,
			unit: "CurrencyCode",
			semanticObjects: {}
		});

		assert.ok(oFieldTemplate, "FieldTemplate has been created");
		assert.ok(typeof oFieldTemplate.isA === "function");
		assert.ok(oFieldTemplate.isA("sap.ui.comp.navpopover.SmartLink"), "SmartLink control created");
		assert.ok(oFieldTemplate.getBindingInfo("text"), "BindingInfo for text property available");
		assert.ok(Array.isArray(oFieldTemplate.getBindingInfo("text").parts), "BindingInfo has parts");
		assert.equal(oFieldTemplate.getBindingInfo("text").parts.length, 3, "BindingInfo has parts has a length of 3 (Amount, Currency and CodeList)");
	});

	QUnit.module("customizeConfig properties", {
		beforeEach: function() {
			this.oControlProvider = new ControlProvider({
				processDataFieldDefault: true,
				metadataAnalyser: new MetadataAnalyser()
			});
		},
		afterEach: function() {
			this.oControlProvider.destroy();
		}
	});

	QUnit.test("smartField", function(assert) {
		this.oControlProvider.useSmartField = true;
		this.oControlProvider._sEntitySet = "foo";
		this.oControlProvider._oCustomizeConfigTextInEditModeSource = {"*": "ValueList"};
		this.oControlProvider._oCustomizeConfigClientSideMandatoryCheck = {"*": false};
		var fnCompleteSmartFieldStub = sinon.stub(this.oControlProvider, "_completeSmartField").returns(function(){});

		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String"
		}, true);

		assert.strictEqual(oFieldViewMetadata.template.getTextInEditModeSource(), "ValueList", "TextInEditModeSource set on smartField");
		assert.strictEqual(oFieldViewMetadata.template.getClientSideMandatoryCheck(), false, "ClientSideMandatoryCheck set on smartField");
		fnCompleteSmartFieldStub.restore();
	});

	QUnit.test("SmartField propagation of defaultInputFieldDisplayBehaviour", function(assert) {
		// Arrange
		var fnCustomDataStub = this.stub(),
			oHelper;

		this.oControlProvider._mSmartField.entitySetObject = {};

		// Arrange Mock ODataHelper
		oHelper = sinon.createStubInstance(ODataHelper);
		oHelper.oAnnotation = sinon.createStubInstance(AnnotationHelper);
		oHelper.getProperty = function (oData) {
			oData.property = {
				property: {}
			};
		};
		this.oControlProvider._oHelper = oHelper;

		// Act
		this.oControlProvider._completeSmartField({
			displayBehaviour: "descriptionAndId",
			template: {
				getTextInEditModeSource: function(){return "None";},
				setTextInEditModeSource: function(){},
				data: fnCustomDataStub
			}
		});

		// Assert
		assert.ok(
			fnCustomDataStub.calledWithExactly("defaultInputFieldDisplayBehaviour", "descriptionAndId"),
			"Proper display behaviour propagated to SmartField template"
		);
	});

	QUnit.test("SmartField propagation of ignoreInsertRestrictions", function(assert) {
		// Arrange
		var mViewFieldTemplateData = new Map(),
			oHelper,
			oConfigData;

		this.oControlProvider._mSmartField.entitySetObject = {};
		this.oControlProvider._oCustomizeConfigIgnoreInsertRestrictions = {
			"*": true,
			"foo": false
		};

		// Arrange Mock ODataHelper
		oHelper = sinon.createStubInstance(ODataHelper);
		oHelper.oAnnotation = sinon.createStubInstance(AnnotationHelper);
		oHelper.getProperty = function (oData) {
			oData.property = {
				property: {}
			};
		};
		this.oControlProvider._oHelper = oHelper;

		// Act
		var oViewMetadata1 = {
			name: "test",
			template: {
				getTextInEditModeSource: function(){return "None";},
				setTextInEditModeSource: function(){},
				data: function(sKey, vValue) {
					mViewFieldTemplateData.set(sKey, vValue);
				}
			}
		};

		this.oControlProvider._completeSmartField(oViewMetadata1);

		// Assert
		oConfigData = mViewFieldTemplateData.get("configdata").configdata;
		assert.ok(oConfigData.hasOwnProperty("ignoreInsertRestrictions"), "SmartField's configdata contains the property ignoreInsertRestrictions");
		assert.strictEqual(oConfigData.ignoreInsertRestrictions, true, "Proper ignoreInsertRestrictions propagated to SmartField template");
		mViewFieldTemplateData.clear();

		// Act
		var oViewMetadata2 = {
			name: "foo",
			template: {
				getTextInEditModeSource: function(){return "None";},
				setTextInEditModeSource: function(){},
				data: function(sKey, vValue) {
					mViewFieldTemplateData.set(sKey, vValue);
				}
			}
		};

		this.oControlProvider._completeSmartField(oViewMetadata2);

		// Assert
		oConfigData = mViewFieldTemplateData.get("configdata").configdata;
		assert.strictEqual(oConfigData.ignoreInsertRestrictions, false, "Proper ignoreInsertRestrictions propagated to SmartField template, since 'foo' has the value false defined for ignoreInsertRestrictions");
	});

	QUnit.test("SmartField propagation of valuelistType with fixed-values for V4 annotation ValueListWithFixedValues is prioritized over V2 annotation", function(assert) {
		// Arrange
		var mViewFieldTemplateData = new Map(),
			oHelper,
			oConfigData;

		this.oControlProvider._mSmartField.entitySetObject = {};
		this.oControlProvider._oCustomizeConfigIgnoreInsertRestrictions = {
			"*": true,
			"foo": false
		};

		// Arrange Mock ODataHelper
		oHelper = sinon.createStubInstance(ODataHelper);
		oHelper.oAnnotation = sinon.createStubInstance(AnnotationHelper);
		oHelper.getProperty = function (oData) {
			oData.property = {
				property: {
					"sap:value-list": "standard",
					"com.sap.vocabularies.Common.v1.ValueListWithFixedValues": {
						"Bool": "true"
					}
				}
			};
		};
		this.oControlProvider._oHelper = oHelper;

		// Act
		var oViewMetadata1 = {
			name: "test",
			template: {
				getTextInEditModeSource: function(){return "None";},
				setTextInEditModeSource: function(){},
				data: function (sKey, vValue) {
					mViewFieldTemplateData.set(sKey, vValue);
				}
			}
		};

		this.oControlProvider._completeSmartField(oViewMetadata1);

		// Assert
		oConfigData = mViewFieldTemplateData.get("configdata").configdata;
		assert.ok(oConfigData.hasOwnProperty("annotations"), "SmartField's configdata contains the property annotations");
		assert.ok(oConfigData.annotations.hasOwnProperty("valuelistType"), "SmartField's configdata contains the property annotations with property valuelistType");
		assert.strictEqual(oConfigData.annotations.valuelistType, "fixed-values", "Proper valuelistType with fixed-values propagated to SmartField template");
		mViewFieldTemplateData.clear();
	});

	QUnit.test("SmartField: semanticKey and semanticObject behaviour", function(assert) {
		var done = assert.async();

		function checkForFunction(aNavigationTargetsObtained, oCorrectFunction) {
			for (let index = 0; index < aNavigationTargetsObtained.length; index++) {
				if (aNavigationTargetsObtained[index].fFunction == oCorrectFunction) {
					return true;
				}
			}
			return false;
		}

		// needed for _completeSmartField, as no this._mSmartField.entitySetObject is defined
		var fnCompleteSmartFieldStub = sinon.stub(this.oControlProvider, "_completeSmartField").returns(function(){});

		var oMetadata = {
			name: "foo",
			semanticObjects: {
				additionalSemanticObjects: ["FakeFlpSemanticObject"],
				defaultSemanticObject: '{dummy}'
			}
		};

		//this.oControlProvider._oSemanticObjectController = new SemanticObjectController();
		this.oControlProvider.useSmartField = true;
		this.oControlProvider.useSmartToggle = true;
		this.oControlProvider._isMobileTable = true;
		this.oControlProvider._oLineItemAnnotation = {
			fields: [
				"foo"
			]
		};

		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata(oMetadata);

		setTimeout(function() {
			assert.ok(oFieldViewMetadata);
			assert.equal(this.oControlProvider._aSmartLinks.length, 0, "ControlProvider doesn't have any LinkHandlers");

			this.oControlProvider._oSemanticKeyAnnotation = {
				semanticKeyFields: [
					"foo"
				]
			};
			oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata(oMetadata);

			setTimeout(function() {
				assert.equal(this.oControlProvider._aSmartLinks[0].hasListeners("navigationTargetsObtained"), true, "NavigationTargetsObtained exists");
				//Checks if the _fnNavigationTargetsObtainedListener function was set through _createObjectIdentifierTemplate
				assert.equal(checkForFunction(this.oControlProvider._aSmartLinks[0].mEventRegistry.navigationTargetsObtained, this.oControlProvider._fnNavigationTargetsObtainedListener), true, "Correct Function was set in _createObjectIdentifierTemplate");

				this.oControlProvider._aSmartLinks[0].destroy();
				this.oControlProvider._aSmartLinks = [];

				this.oControlProvider._oSemanticKeyAnnotation = {
					semanticKeyFields: [
						"foo"
					]
				};
				this.oControlProvider._oSemanticObjectController = new SemanticObjectController();
				this.oControlProvider._oSemanticObjectController.attachNavigationTargetsObtained(function() {});

				oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata(oMetadata);
				setTimeout(function() {
					assert.equal(this.oControlProvider._oSemanticObjectController.hasListeners("navigationTargetsObtained"), true, "SemanticObjectController NavigationTargetsObtained listener exists");
					assert.equal(checkForFunction(this.oControlProvider._aSmartLinks[0].mEventRegistry.navigationTargetsObtained, this.oControlProvider._fnNavigationTargetsObtainedListener), false, "Function was not set in _createObjectIdentifierTemplate");

					fnCompleteSmartFieldStub.restore();
					done();
				}.bind(this), 500);
			}.bind(this), 500);
		}.bind(this), 500);

	});

	QUnit.module("DateTimeOffset with Timezone", {
		beforeEach: function() {
			this.oControlProvider = new ControlProvider({
				processDataFieldDefault: true,
				metadataAnalyser: new MetadataAnalyser()
			});
		},
		afterEach: function() {
			this.oControlProvider.destroy();
		}
	});

	QUnit.test("_getDefaultBindingInfo should return the parts for DateTimeOffset & Timezone property paths", function(assert) {
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "DateTimeOffsetProperty",
			type: "Edm.DateTimeOffset",
			timezone: "TimezoneProperty"
		});

		assert.ok(oFieldViewMetadata.modelType.isA("sap.ui.model.odata.type.DateTimeOffset"), "Correct model type assigned");

		var oBindingInfo = this.oControlProvider._getDefaultBindingInfo(oFieldViewMetadata, oFieldViewMetadata.modelType);

		assert.strictEqual(oBindingInfo.parts.length, 2);
		assert.strictEqual(oBindingInfo.parts[0].path, "DateTimeOffsetProperty");
		assert.ok(oBindingInfo.parts[0].type.isA("sap.ui.model.odata.type.DateTimeOffset"));
		assert.strictEqual(oBindingInfo.parts[1].path, "TimezoneProperty");
	});

	QUnit.test("_getDefaultBindingInfo should return correct parts for String & isTimezone", function(assert) {
		const oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "TimezoneProperty",
			type: "Edm.String",
			isTimezone: true
		});
		const oType = ControlProvider._createModelTypeInstance(oFieldViewMetadata);
		assert.ok(oType.isA("sap.ui.model.odata.type.DateTimeWithTimezone"), "Correct model type assigned");

		const oBindingInfo = this.oControlProvider._getDefaultBindingInfo(oFieldViewMetadata, oType);
		assert.equal(oBindingInfo.parts.length, 2, "Composite binding contains 2 parts");
		assert.strictEqual(oBindingInfo.parts[0].path, undefined, "No path assigned for first binding parameter");
		assert.strictEqual(oBindingInfo.parts[0].value, null, "Static value assigned for first binding parameter");
		assert.ok(oBindingInfo.type.isA("sap.ui.model.odata.type.DateTimeWithTimezone"), "Correct binding type");
	});

	QUnit.test("_getDefaultBindingInfo return correct formatter when have NumericText with TextArrangment", function(assert) {
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "StringProperty",
			type: "Edm.String",
			isDigitSequence: true,
			displayBehaviour: "idAndDescription",
			description: "text"
		});

		this.oControlProvider._bEnableDescriptions = true;

		assert.ok(oFieldViewMetadata.modelType.isA("sap.ui.comp.odata.type.NumericText"), "Correct model type assigned");

		var oBindingInfo = this.oControlProvider._getDefaultBindingInfo(oFieldViewMetadata, oFieldViewMetadata.modelType);
		var sFormattedValue = oBindingInfo.formatter(null, "text");

		assert.strictEqual(oBindingInfo.parts.length, 2);
		assert.strictEqual(oBindingInfo.parts[0].path, "StringProperty");
		assert.ok(oBindingInfo.parts[0].type.isA("sap.ui.comp.odata.type.NumericText"));
		assert.strictEqual(oBindingInfo.parts[1].path, "text");
		assert.strictEqual(sFormattedValue, " (text)");
	});
});
