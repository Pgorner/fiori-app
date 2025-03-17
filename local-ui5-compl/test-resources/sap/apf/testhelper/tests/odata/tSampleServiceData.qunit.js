sap.ui.define([
	"sap/apf/testhelper/odata/injectDatajs",
	"sap/apf/testhelper/odata/injectODataDouble",
	"sap/apf/testhelper/odata/sampleServiceData",
	"sap/ui/thirdparty/datajs"
], function(
	datajsDouble,
	odataDouble,
	sampleService,
	OData
) {
	"use strict";

	QUnit.module('Injection');
	QUnit.test('Replace datajs OData object by double', function(assert) {
		var oOriginalOData = OData;
		OData = odataDouble.injectODataDouble();
		assert.notEqual(oOriginalOData, OData, 'Original OData replaced');
	});

	// skip reason: There's no (more?) reverseODataDoubleInjection
	QUnit.skip('Restore datajs OData object', function(assert) {
		var oOriginalOData = OData;
		odataDouble.injectODataDouble();
		odataDouble.reverseODataDoubleInjection();
		assert.equal(oOriginalOData, OData, 'Original OData restored');
	});



	QUnit.module('Get sample data', {
		beforeEach : function(assert) {
			odataDouble.injectODataDouble();
			this.oRequest = {};
			this.oRequest.data = {};
			this.oRequest.data.__batchRequests = [];
			this.oBatchRequest = this.oRequest.data.__batchRequests;
		}
	});
	QUnit.test('Directly from double function - no indirection to OData', function(assert) {
		assert.ok(sampleService.getSampleServiceData(), 'Service Test double instance expected');
	});
	QUnit.test('From URL with parameter entity set key properties', function(assert) {
		this.oBatchRequest.push({
			requestUri : 'http://domain:port/path1/path2/EntityType3(a=1, b=2)/Results?c=\'d\''
		});
		var aDataFromCallback;
		var fnCallback = function(oResponse) {
			aDataFromCallback = oResponse.__batchResponses[0].data.results;
		};
		OData.request(this.oRequest, fnCallback);
		assert.equal(aDataFromCallback.length, 20, "");
	});
	QUnit.test('From URL without parameter entity set key properties', function(assert) {
		this.oBatchRequest.push({
			requestUri : 'http://domain:port/path1/path2/EntityType1Results?c=\'d\''
		});
		var aDataFromCallback;
		var fnCallback = function(oResponse) {
			aDataFromCallback = oResponse.__batchResponses[0].data.results;
		};
		OData.request(this.oRequest, fnCallback);
		assert.equal(aDataFromCallback.length, 11, "");
	});
	QUnit.module('Get URI', {
		beforeEach : function(assert) {
			odataDouble.injectODataDouble();
			this.oRequest = {};
			this.oRequest.data = {};
			this.oRequest.data.__batchRequests = [];
			this.oBatchRequest = this.oRequest.data.__batchRequests;
		}
	});
	QUnit.test('Get URI from spy', function(assert) {
		this.oBatchRequest.push({
			requestUri : 'http://domain:port/path1/path2/SomeEntity'
		});
		OData.request(this.oRequest, function() {
		});
		assert.equal(datajsDouble.getUriFromODataSpy(), 'http://domain:port/path1/path2/SomeEntity');
		this.oBatchRequest.pop();
		this.oBatchRequest.push({
			requestUri : 'http://domain:port/path1/path2/AnotherEntity'
		});
		OData.request(this.oRequest, function() {
		});
		assert.equal(datajsDouble.getUriFromODataSpy(), 'http://domain:port/path1/path2/AnotherEntity');
	});
});
