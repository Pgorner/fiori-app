/*global QUnit */
sap.ui.define([
	"sap/ui/export/util/PDFCapabilities",
	"sap/ui/thirdparty/sinon-qunit"
], function (PDFCapabilities, SinonQUnit) {
	"use strict";

	const mCapabilities = {
		ArchiveFormat: true,
		Border: true,
		CoverPage: true,
		DocumentDescriptionCollection: "MyDocumentDescription",
		DocumentDescriptionReference: "https://some.fake.host/service/$metadata",
		FitToPage: true,
		FontName: true,
		FontSize: true,
		HeaderFooter: true,
		IANATimezoneFormat: true,
		Margin: true,
		Padding: true,
		ResultSizeDefault: 5000,
		ResultSizeMaximum: 10000,
		Signature: true,
		TextDirectionLayout: true,
		Treeview: true,
		UploadToFileShare: true
	};

	let oCapabilities;

	QUnit.module("Public Interface", {
		beforeEach: function() {
			oCapabilities = new PDFCapabilities(mCapabilities);
		},
		afterEach: function() {
			oCapabilities = null;
		}
	});

	QUnit.test("constructor", function(assert) {
		for (const [sProperty, vValue] of Object.entries(mCapabilities)) {
			assert.equal(oCapabilities[sProperty], vValue, "Properties have been correctly initialized");
		}
	});

	QUnit.test("constructor - without settings", function(assert) {
		oCapabilities = new PDFCapabilities();

		for (const [sProperty] of Object.entries(mCapabilities)) {
			assert.notEqual(typeof oCapabilities[sProperty], "undefined", `Property ${sProperty} has been defined`);
		}
	});

	QUnit.test("constructor - unknown properties", function(assert) {
		const mCapabilities = {
			GZip: true,
			Password: true,
			ConcurrentEditing: 42
		};

		oCapabilities = new PDFCapabilities(mCapabilities);

		for (const [sProperty, vValue] of Object.entries(mCapabilities)) {
			assert.ok(vValue, "Value was provided for the property");
			assert.equal(oCapabilities[sProperty], undefined, "Property is undefined");
		}
	});

	QUnit.test("constructor - incorrect property types", function(assert) {
		const mCapabilities = {
			ArchiveFormat: {},
			Border: () => {},
			CoverPage: "123",
			DocumentDescriptionCollection: true,
			DocumentDescriptionReference: 42,
			FitToPage: "abc",
			FontName: undefined,
			FontSize: [],
			HeaderFooter: 1.5,
			IANATimezoneFormat: "true",
			Margin: null,
			Padding: NaN,
			ResultSizeDefault: "500",
			ResultSizeMaximum: "MyDocumentDescription",
			Signature: {},
			TextDirectionLayout: 42,
			Treeview: undefined,
			UploadToFileShare: []
		};

		oCapabilities = new PDFCapabilities(mCapabilities);

		for (const [sProperty, vValue] of Object.entries(mCapabilities)) {
			assert.notEqual(typeof oCapabilities[sProperty], "undefined", `Property ${sProperty} has been defined`);
			assert.notDeepEqual(oCapabilities[sProperty], vValue, `Default value has been assigned to property ${sProperty}`);
		}
	});

	QUnit.test("isValid", function(assert) {
		assert.ok(oCapabilities.DocumentDescriptionReference, "DocumentDescriptionReference is available");
		assert.ok(oCapabilities.DocumentDescriptionCollection, "DocumentDescriptionCollection is available");
		assert.equal(typeof oCapabilities.ResultSizeMaximum, "number", "ResultSizeMaximum is a number");
		assert.ok(oCapabilities.ResultSizeMaximum > 0, "ResultSizeMaximum is greater than zero");
		assert.ok(oCapabilities.isValid(), "Valid capabilities");
	});
});