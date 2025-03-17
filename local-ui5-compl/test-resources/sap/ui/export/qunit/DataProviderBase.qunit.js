sap.ui.define([
	"sap/ui/export/ExportUtils",
	"sap/ui/export/provider/DataProviderBase"
], function(ExportUtils, DataProviderBase) {
	"use strict";

	/* global QUnit, sinon */

	let oDataProvider;

	const mExportSettings = {
		dataSource: {
			count: 3465,
			dataUrl: "/sap/opu/odata/SAP/BILLOFMATERIALV2_SRV/C_BillOfMaterialTP?sap-client=715&$format=json&$filter=((IsActiveEntity%20eq%20false%20or%20SiblingEntity/IsActiveEntity%20eq%20null)%20and%20BillOfMaterialCategory%20eq%20%27M%27)&$select=MaterialForEdit%2cMaterialForEdit_fc%2cMaterialName%2cPlantForEdit%2cPlantName%2cBillOfMaterialVariantUsage%2cBillOfMaterialVariantUsageDesc%2cBillOfMaterialVariantForEdit%2cBillOfMaterialVersionForEdit%2cBOMVersionStatusDescription%2cBOMVersionStatus%2cEngineeringChangeDocForEdit%2cIsLatestBOMVersion%2cBOMIsConfigurable%2cChangeRecord%2cBillOfMaterial%2cBillOfMaterialCategory%2cBillOfMaterialVariant%2cBillOfMaterialVersion%2cEngineeringChangeDocument%2cMaterial%2cPlant%2cDraftUUID%2cIsActiveEntity%2cHasDraftEntity%2cHasActiveEntity%2cAssign_to_plant_ac%2cUnassign_plant_ac%2cAssign_to_cr_ac%2cDraftAdministrativeData%2cIsVersionBillOfMaterial%2cIsMultipleBOMAlt%2cBOMGroup%2cBillOfMaterialAuthsnGrp%2cBOMHeaderText%2cHeaderValidityStartDate%2cIsVersionBillOfMaterial%2cIsMultipleBOMAlt%2cBOMGroup%2cBillOfMaterialAuthsnGrp%2cBOMHeaderText%2cHeaderValidityStartDate&$expand=DraftAdministrativeData",
			headers: {
				Accept: "application/json",
				"Accept-Language": "en",
				DataServiceVersion: "2.0",
				MaxDataServiceVersion: "2.0",
				"sap-contextid-accept": "header",
				"x-csrf-token": "mWRjf_mMpwh2YtrzSjdVuQ=="
			},
			serviceUrl: "/sap/opu/odata/SAP/BILLOFMATERIALV2_SRV/",
			sizeLimit: 600,
			type: "odata",
			useBatch: true
		},
		workbook: {
			columns: [
				{
					property: "SampleProperty",
					label: "Sample Column"
				},
				{
					property: "to_Company/CompanyName",
					label: "Company Name"
				}
			],
			hierarchyLevel: "__HierarchyPropertiesForZTEST_DD_FILESYS_HIER/DistanceFromRoot"
		}
	};

	const createBatchResponse = () => {
		return new Response([
			"--batch_6774c9a4-bf9b-4adf-b5e7-04f884d59340",
			"Content-Type: application/http",
			"Content-Transfer-Encoding: binary",
			"",
			"HTTP/1.1 200 OK",
			"DataServiceVersion: 2.0",
			"Content-Type: application/json",
			"Content-Length: 34",
			"",
			'{"d":{"__count":"0","results":[]}}',
			"--batch_6774c9a4-bf9b-4adf-b5e7-04f884d59340--"
		].join("\r\n"), {
			status: 202,
			statusText: "ACCEPTED",
			headers: new Headers({
				"cache-control": "no-cache, no-store, max-age=0, must-revalidate",
				"content-length": "219734",
				"content-type": "multipart/mixed; boundary=batch_4ecfdf82-8bb5-4a2a-b291-ba5f284e4cc2",
				"dataserviceversion": "2.0",
				"date": "Mon, 04 Nov 2024 00:35:39 GMT",
				"expires": "0",
				"pragma": "no-cache",
				"referrer-policy": "same-origin"
			})
		});
	};

	// Validate settings to ensure absolute URLs
	ExportUtils._validateDataSource(mExportSettings.dataSource);

	QUnit.module("Internals", {
		beforeEach: function() {
			const mSettingsCopy = JSON.parse(JSON.stringify(mExportSettings));
			oDataProvider = new DataProviderBase(mSettingsCopy);
		},
		afterEach: function() {
			oDataProvider = null;
		}
	});

	QUnit.test("_prepareDataUrl", function(assert) {
		assert.ok(mExportSettings.dataSource.dataUrl.indexOf("$skip") === -1, "Original dataUrl does not contain $skip");
		assert.ok(mExportSettings.dataSource.dataUrl.indexOf("$top") === -1, "Original dataUrl does not contain $top");

		assert.ok(oDataProvider.mSettings.dataSource.dataUrl.indexOf("$skip") > -1, "Original dataUrl contains $skip");
		assert.ok(oDataProvider.mSettings.dataSource.dataUrl.indexOf("$top") > -1, "Original dataUrl contains $top");
	});

	QUnit.test("_cleanUrl", function(assert) {
		let sResult = oDataProvider._cleanUrl(mExportSettings.dataSource.serviceUrl + "?sap-ui-debug=true#SAP-app-name");
		assert.ok(sResult.endsWith("/"), "URL ends correctly with a forward slash");
		assert.ok(sResult.indexOf("#") === -1, "URL contains no hash");
		assert.ok(sResult.indexOf("?") === -1, "URL contains no request parameters (search)");

		sResult = oDataProvider._cleanUrl("https://some.host.com/sap/opu/odata/sap/FAC_MANAGE_GLACCOUNT_SRV;v=2");
		assert.ok(sResult.endsWith("/"), "URL ends correctly with a forward slash");
		assert.ok(sResult.indexOf("#") === -1, "URL contains no hash");
		assert.ok(sResult.indexOf("?") === -1, "URL contains no request parameters (search)");
		assert.ok(sResult.endsWith("/sap/opu/odata/sap/FAC_MANAGE_GLACCOUNT_SRV;v=2/"), "Output is as expected");
	});

	QUnit.test("_getUrl", function(assert) {
		const sUrl = "https://fake.host.com/service/Customer?$select=Firstname,Lastname&$skip=0&$top=0";
		const sNextUrl = "/service/Customer?$skiptoken=F7JN0HTY";
		const iSkip = 100;
		const iTop = 50;

		oDataProvider.mSettings.dataSource.dataUrl = sUrl;

		let sResult = oDataProvider._getUrl(iSkip, iTop);
		assert.ok(sResult.indexOf("$skip=" + iSkip) > -1, "URL contains updated $skip");
		assert.ok(sResult.indexOf("$top=" + iTop) > -1, "URL contains updated $top");

		sResult = oDataProvider._getUrl(iSkip, iTop, sNextUrl);
		assert.ok(sResult.indexOf("$skip=") === -1, "URL does not contain $skip");
		assert.ok(sResult.indexOf("$top=") === -1, "URL does not contain $top");
		assert.ok(sResult.indexOf("$skiptoken") > -1, "URL contains $skiptoken");
		assert.ok(sResult.startsWith(sUrl.slice(0, 22)), "URL has same origin as the originating URL");
	});

	QUnit.test("getColumnsToConvert", function(assert) {
		const aColumns = DataProviderBase.getColumnsToConvert(mExportSettings.workbook.columns);

		assert.ok(Array.isArray(aColumns), "Function returned an array");
		assert.equal(aColumns.length, 1, "Only NavigationProperties are relevant for conversion");
	});

	QUnit.test("fnOnDataReceived", async function(assert) {
		oDataProvider.iBatchSize = 10;

		const aData =  [
			{"Product": "Product1", "Price": 100},
			{"Product": "Product2", "Price": 200},
			{"Product": "Product3", "Price": 300},
			{"Product": "Product4", "Price": 400},
			{"Product": "Product5", "Price": 500},
			{"Product": "Product6", "Price": 600},
			{"Product": "Product7", "Price": 700},
			{"Product": "Product8", "Price": 800},
			{"Product": "Product9", "Price": 900},
			{"Product": "Product10", "Price": 1000},
			{"Product": "Product11", "Price": 1100},
			{"Product": "Product12", "Price": 1200}
		];

		let aResponseData = aData.slice(0, 5);
		let oResponse = new Response(JSON.stringify({
			"@odata.nextLink": "https://fake.server.com/Entity?$skiptoken=AC23EF",
			value: aResponseData
		}), {
			status: 200,
			statusText: "OK"
		});

		let oExpectedResult = {
			fetched: 5,
			finished: false,
			progress: 1048575,
			total: 3465,
			rows: aResponseData
		};

		const oConvertDataStub = sinon.stub(oDataProvider, "fnConvertData");
		const oProcessCallbackStub = oDataProvider.fnProcessCallback = sinon.stub();
		const oIsFinishedSpy = sinon.spy(oDataProvider, "_isFinished");
		oDataProvider.mRequest = {dataUrl: ""};

		oConvertDataStub.returns(aResponseData);
		await oDataProvider.fnOnDataReceived(oResponse);

		assert.ok(oProcessCallbackStub.calledOnce, "processCallback should be called once");
		assert.ok(oProcessCallbackStub.calledWith(oExpectedResult), "processCallback should be called with the correct data");
		assert.ok(oConvertDataStub.calledOnce, "convertData should be called once");
		assert.ok(oConvertDataStub.calledWith(aResponseData), "convertData should be called with the correct data");
		assert.ok(oIsFinishedSpy.calledOnce, "isFinished should be called once");
		assert.ok(oIsFinishedSpy.calledWith(5, "https://fake.server.com/Entity?$skiptoken=AC23EF", 1048570, false), "isFinished should be called with the correct parameters");
		assert.equal(oDataProvider.iBatchSize, 5, "fetch size has been adjusted to server side paging limit");

		aResponseData = aData.slice(5, 10);
		oResponse = new Response(JSON.stringify({
			value: aResponseData
		}), {
			status: 200,
			statusText: "OK"
		});

		oExpectedResult = {
			fetched: 10, // sum of both calls
			finished: false,
			progress: 1048575,
			total: 3465,
			rows: aResponseData
		};

		oConvertDataStub.returns(aResponseData);
		await oDataProvider.fnOnDataReceived(oResponse);

		assert.ok(oProcessCallbackStub.calledTwice, "processCallback should be called a second time");
		assert.ok(oProcessCallbackStub.calledWith(oExpectedResult), "processCallback should be called with the correct data");
		assert.ok(oConvertDataStub.calledTwice, "convertData should be called a second time");
		assert.ok(oConvertDataStub.calledWith(aResponseData), "convertData should be called with the correct data");
		assert.ok(oIsFinishedSpy.calledTwice, "isFinished should be called a second time");
		assert.ok(oIsFinishedSpy.calledWith(5, undefined, 1048565, true), "isFinished should be called with the correct parameters");

		aResponseData = aData.slice(10);
		oResponse = new Response(JSON.stringify({
			value: aResponseData
		}), {
			status: 200,
			statusText: "OK"
		});
		oExpectedResult = {
			fetched: aData.length, // sum of all calls
			finished: true,
			progress: 1048575,
			total: 3465,
			rows: aResponseData
		};

		oConvertDataStub.returns(aResponseData);
		await oDataProvider.fnOnDataReceived(oResponse);

		assert.ok(oProcessCallbackStub.calledThrice, "processCallback should be called a third time");
		assert.ok(oProcessCallbackStub.calledWith(oExpectedResult), "processCallback should be called with the correct data");
		assert.ok(oConvertDataStub.calledThrice, "convertData should be called a third time");
		assert.ok(oConvertDataStub.calledWith(aResponseData), "convertData should be called with the correct data");
		assert.ok(oIsFinishedSpy.calledThrice, "isFinished should be called a third time");
		assert.ok(oIsFinishedSpy.calledWith(2, undefined, 1048563, false), "isFinished should be called with the correct parameters");

		oConvertDataStub.restore();
		oIsFinishedSpy.restore();
    });

	QUnit.test("_isFinished", function(assert) {
		// total rows 6,728 - request size 1,200 - server side paging 1,000 - downloadLimit 6,728
		oDataProvider.iBatchSize = 2200;
		assert.notOk(oDataProvider._isFinished(1000, "https://fake.server.com/Entity?$skiptoken=AC23EF", 5728, false), "isFinished should return false"); // After first 1,000
		assert.notOk(oDataProvider._isFinished(200, null, 5528, true), "isFinished should return false"); // After 1,200
		assert.notOk(oDataProvider._isFinished(1000, "https://fake.server.com/Entity?$skiptoken=AC23EF", 4528, false), "isFinished should return false"); // After 2,200
		assert.notOk(oDataProvider._isFinished(200, null, 4328, true), "isFinished should return false"); // After first 2,400
		assert.notOk(oDataProvider._isFinished(1000, "https://fake.server.com/Entity?$skiptoken=AC23EF", 3328, false), "isFinished should return false"); // After first 3,400
		assert.notOk(oDataProvider._isFinished(200, null, 3128, true), "isFinished should return false"); // After 3,600
		assert.notOk(oDataProvider._isFinished(1000, "https://fake.server.com/Entity?$skiptoken=AC23EF", 2128, false), "isFinished should return false"); // After first 4,600
		assert.notOk(oDataProvider._isFinished(200, null, 1928, true), "isFinished should return false"); // After 4,800
		assert.notOk(oDataProvider._isFinished(1000, "https://fake.server.com/Entity?$skiptoken=AC23EF", 928, false), "isFinished should return false"); // After first 5,800
		assert.notOk(oDataProvider._isFinished(200, null, 728, true), "isFinished should return false"); // After 6,000
		assert.ok(oDataProvider._isFinished(728, null, 0, false), "isFinished should return true"); // After 6,728

		// total rows 470 - request size 200 - no server side paging - downloadLimit 470
		oDataProvider.iBatchSize = 200;
		assert.notOk(oDataProvider._isFinished(200, null, 270, false), "isFinished should return false"); // After 200
		assert.notOk(oDataProvider._isFinished(200, null, 70, false), "isFinished should return false"); // After 400
		assert.ok(oDataProvider._isFinished(70, null, 0, false), "isFinished should return true"); // After 470

		// total rows 470 - request size 200 - no server side paging - no downloadLimit
		oDataProvider.iBatchSize = 200;
		assert.notOk(oDataProvider._isFinished(200, null, DataProviderBase.MAX_ROWS - 200, false), "isFinished should return false"); // After 200
		assert.notOk(oDataProvider._isFinished(200, null, DataProviderBase.MAX_ROWS - 400, false), "isFinished should return false"); // After 400
		assert.ok(oDataProvider._isFinished(70, null, DataProviderBase.MAX_ROWS - 470, false), "isFinished should return true"); // After 470

		// total rows 174 - request size 200 - small data set - no downloadLimit
		assert.ok(oDataProvider._isFinished(174, null, DataProviderBase.MAX_ROWS - 174, false), "isFinished should return true"); // After 174

		// total rows 200 - request size 200 - no downloadLimit
		assert.notOk(oDataProvider._isFinished(200, null, DataProviderBase.MAX_ROWS - 200, false), "isFinished should return false"); // After 200
		assert.ok(oDataProvider._isFinished(0, null, DataProviderBase.MAX_ROWS - 200, false), "isFinished should return true"); // After 200

		// total rows 6,728 - request size 1,200 - no $skip and $top - no dowloadLimit
		oDataProvider.iBatchSize = 1200;
		assert.ok(oDataProvider._isFinished(6728, null, DataProviderBase.MAX_ROWS - 6728, false), "isFinished should return true"); // After 6,728

		// total rows 6,728 - request size 1,200 - no $skip and $top - downloadLimit 5000
		assert.ok(oDataProvider._isFinished(6728, null, 0, false), "isFinished should return true"); // After 6,728

		// total rows 0 - request size 200 - no downloadLimit
		assert.ok(oDataProvider._isFinished(0, null, DataProviderBase.MAX_ROWS, false), "isFinished should return true"); // After 0

		// Invalid Scenarios - fetched rows 0 - server side paging - no downloadLimit
		assert.ok(oDataProvider._isFinished(0, "https://fake.server.com/Entity?$skiptoken=AC23EF", DataProviderBase.MAX_ROWS, false), "isFinished should return true"); // After 0
		assert.ok(oDataProvider._isFinished(0, "https://fake.server.com/Entity?$skiptoken=AC23EF", DataProviderBase.MAX_ROWS, true), "isFinished should return true"); // After 0
	 });

	QUnit.test("getDataConverter", function(assert) {
		const mSettings = JSON.parse(JSON.stringify(mExportSettings));
		assert.equal(mSettings.workbook.columns.length, 2, "2 columns available");

		const fnConvert = DataProviderBase.getDataConverter(mSettings);
		assert.equal(mSettings.workbook.columns.length, 2, "Column count did not change");

		const oRow = {
			"SampleProperty": "SampleValue",
			"to_Company": {
				"CompanyName": "SAP SE"
			},
			"__HierarchyPropertiesForZTEST_DD_FILESYS_HIER": {
				"DistanceFromRoot": 0
			}
		};

		fnConvert([oRow]);
		assert.ok(oRow["to_Company"], "Original NavigationProperty is still available");
		assert.notEqual(oRow["to_Company/CompanyName"], undefined, "Column related NavigationProperty was converted");

		assert.ok(oRow["__HierarchyPropertiesForZTEST_DD_FILESYS_HIER"], "Original NavigationProperty is still available");
		assert.notEqual(oRow["__HierarchyPropertiesForZTEST_DD_FILESYS_HIER/DistanceFromRoot"], undefined, "Hierarchy relevant NavigationProperty was converted");
	});

	QUnit.test("createRequestBody", function(assert) {
		const sUrl = "Customer?$select=Firstname,Lastname&$skip=0&$top=0";
		const oHeaders = new Headers({
			"Accept": "text/html", // Needs to be ignored
			"Accept-Language": "en",
			"DataServiceVersion": "2.0",
			"MaxDataServiceVersion": "2.0",
			"sap-contextid-accept": "header",
			"x-csrf-token": "bHidhDpl-kUf47QbT-Jwlh-ZPfFkee8WOPL8",
			"X-Requested-With": "XMLHttpRequest"
		});
		const sBoundary = "batch_f9874e6d-854f-4095-8407-50800434cfb4";
		const sRequestBody = DataProviderBase.createRequestBody(sUrl, sBoundary, oHeaders);

		assert.equal(sRequestBody.toLowerCase(), [
			"--batch_f9874e6d-854f-4095-8407-50800434cfb4",
			"Content-Type: application/http",
			"Content-Transfer-Encoding: binary",
			"",
			"GET Customer?$select=Firstname,Lastname&$skip=0&$top=0 HTTP/1.1",
			"Accept:application/json",
			"Accept-Language:en",
			"DataServiceVersion:2.0",
			"MaxDataServiceVersion:2.0",
			"sap-contextid-accept:header",
			"x-csrf-token:bHidhDpl-kUf47QbT-Jwlh-ZPfFkee8WOPL8",
			"X-Requested-With:XMLHttpRequest",
			"",
			"",
			"--batch_f9874e6d-854f-4095-8407-50800434cfb4--",
			""
		].join("\r\n").toLowerCase(), "Request body is as expected");
	});

	QUnit.test("createBatchRequest", function(assert) {
		const mSettings = mExportSettings.dataSource;
		const oAbortController = new AbortController();

		sinon.stub(DataProviderBase, "_createGuid").returns("f9874e6d-854f-4095-8407-50800434cfb4");
		sinon.spy(DataProviderBase, "createRequestBody");
		const oRequest = DataProviderBase.createBatchRequest(mSettings, oAbortController);

		assert.ok(oRequest instanceof Request, "Request object created");
		assert.ok(DataProviderBase.createRequestBody.calledOnce, "DataProviderBase#createRequestBody was called");
		assert.equal(oRequest.method, "POST", "Request method is POST");
		assert.ok(oRequest.signal instanceof AbortSignal, "Abort signal is defined");
		assert.equal(oRequest.headers.get("Accept"), "multipart/mixed", "Accept header is correct");
		assert.equal(oRequest.headers.get("Content-Type"), "multipart/mixed;boundary=batch_f9874e6d-854f-4095-8407-50800434cfb4", "Content-Type header is correct");

		for (const [sKey, sValue] of Object.entries(mSettings.headers)) {
			if (sKey !== "Accept") {
				assert.ok(oRequest.headers.has(sKey), `${sKey} header is available`);
				assert.equal(oRequest.headers.get(sKey), sValue, `${sKey} header is correct`);
			}
		}

		DataProviderBase._createGuid.restore();
		DataProviderBase.createRequestBody.restore();
	});

	QUnit.test("sendRequest", async function(assert) {
		const mSettings = Object.assign({}, mExportSettings.dataSource);

		sinon.spy(DataProviderBase, "createBatchRequest");
		sinon.spy(DataProviderBase, "createGetRequest");
		sinon.spy(DataProviderBase, "getBatchResponse");
		sinon.stub(window, "fetch").resolves(createBatchResponse());

		/* Test $batch request */
		let oResponse = await oDataProvider.sendRequest(mSettings);

		assert.ok(oResponse instanceof Response, "Response object was returned");
		assert.ok(DataProviderBase.getBatchResponse.calledOnce, "DataProviderBase#getBatchResponse was called");
		assert.ok(DataProviderBase.createBatchRequest.calledOnce, "DataProviderBase#createBatchRequest was called");
		assert.ok(window.fetch.calledOnce, "window.fetch was called");
		assert.ok(DataProviderBase.createGetRequest.notCalled, "DataProviderBase#createGetRequest was not called");

		window.fetch.resetHistory();
		DataProviderBase.getBatchResponse.resetHistory();
		DataProviderBase.createBatchRequest.resetHistory();
		DataProviderBase.createGetRequest.resetHistory();

		/* Test GET request */
		mSettings.useBatch = false;
		oResponse = await oDataProvider.sendRequest(mSettings);

		assert.ok(oResponse instanceof Response, "Response object was returned");
		assert.ok(DataProviderBase.createBatchRequest.notCalled, "DataProviderBase#createBatchRequest was not called");
		assert.ok(window.fetch.calledOnce, "window.fetch was called");
		assert.ok(DataProviderBase.createGetRequest.calledOnce, "DataProviderBase#createGetRequest was called");

		window.fetch.restore();
		DataProviderBase.getBatchResponse.restore();
		DataProviderBase.createBatchRequest.restore();
		DataProviderBase.createGetRequest.restore();
	});

	QUnit.test("sendRequest | abort", function(assert) {
		const done = assert.async();
		const mSettings = Object.assign({}, mExportSettings.dataSource);

		oDataProvider.sendRequest(mSettings).then(() => {
			assert.ok(false, "Request should not resolve");
		}).catch((oError) => {
			assert.ok(oError == null, "No error returned due to user cancelation");
		}).finally(done);

		assert.ok(oDataProvider._oPendingRequest instanceof AbortController, "AbortController is registered");
		oDataProvider._oPendingRequest?.abort();
	});

	QUnit.test("getBatchResponse", async function(assert) {
		let oBatchResponse = await DataProviderBase.getBatchResponse(createBatchResponse());

		assert.ok(oBatchResponse instanceof Response, "Response object returned");
		assert.equal(oBatchResponse.status, 200, "Response status code is 200");
		assert.equal(oBatchResponse.statusText, "OK", "Response status text is OK");
		assert.ok(oBatchResponse.headers.has("DataServiceVersion"), "DataServiceVersion header is available");
		assert.ok(oBatchResponse.headers.has("Content-Type"), "Content-Type header is available");
		assert.ok(oBatchResponse.headers.has("Content-Length"), "Content-Length header is available");
		assert.equal(oBatchResponse.headers.get("Content-Type"), "application/json", "Content-Type header is correct");
		assert.notOk(oBatchResponse.headers.has("Content-Transfer-Encoding"), "Content-Transfer-Encoding header is not available");
		assert.deepEqual(await oBatchResponse.json(), {d: {__count: "0", results: []}}, "Response body is as expected");

		const oResponse = new Response([
			"--batch_6774c9a4-bf9b-4adf-b5e7-04f884d59340",
			"Content-Type: application/http",
			"Content-Transfer-Encoding: binary",
			"",
			"HTTP/1.1 404 Not Found",
			"DataServiceVersion: 2.0",
			"Content-Type: application/json",
			"Content-Length: 34",
			"",
			'{"error":{"code":"404","message":"Not found"}}',
			"--batch_6774c9a4-bf9b-4adf-b5e7-04f884d59340--"
		].join("\r\n"));

		oBatchResponse = await DataProviderBase.getBatchResponse(oResponse);

		assert.ok(oBatchResponse instanceof Response, "Response object returned");
		assert.equal(oBatchResponse.status, 404, "Response status code is 404");
		assert.equal(oBatchResponse.statusText, "Not Found", "Response status text is Not Found");
		assert.ok(oBatchResponse.headers.has("DataServiceVersion"), "DataServiceVersion header is available");
		assert.ok(oBatchResponse.headers.has("Content-Type"), "Content-Type header is available");
		assert.ok(oBatchResponse.headers.has("Content-Length"), "Content-Length header is available");
		assert.equal(oBatchResponse.headers.get("Content-Type"), "application/json", "Content-Type header is correct");
		assert.notOk(oBatchResponse.headers.has("Content-Transfer-Encoding"), "Content-Transfer-Encoding header is not available");
		assert.deepEqual(await oBatchResponse.json(), {error: {code: "404", message: "Not found"}}, "Response body is as expected");
	});

	QUnit.test("getHarmonizedBodyFrom", async function(assert) {
		const oDataV4Response = {
			"@odata.context":"$metadata#Books(ID,authorFirstName,authorFullName,authorLastName,author_ID,changed,currency_code,genre_code,price,published,title)",
			"@odata.metadataEtag":"W/\"20241101050253\"",
			"@odata.count":"1015",
			"value":[
				{
					"ID": 1,
					"title": "Pride and Prejudice",
					"authorFullName": "Jane Austen",
					"price": "28.00",
					"currency_code": "EUR",
					"changed": "2006-04-02T01:32:31Z",
					"published": "1811-09-15"
				},
				{
					"ID": 2,
					"title": "Alice's Adventures in Wonderland",
					"authorFullName": "Lewis Carroll",
					"price": "19.80",
					"currency_code": "EUR",
					"changed": "2012-01-27T11:43:59Z",
					"published": "1893-10-25"
				},
				{
					"ID": 3,
					"title": "Frankenstein, Or, The Modern Prometheus",
					"authorFullName": "Mary Wollstonecraft Shelley",
					"price": "9.80",
					"currency_code": "EUR",
					"changed": "2015-12-01T07:47:11Z",
					"published": "1849-08-24"
				}
			]
		};
		const oDataV2Response = {
			"d": {
				"__count": "1015",
				"results": [
					{
						"__metadata": {
							"id": "https://fake.host.com:8080/sap/opu/odata/sap/ZMDC_V2SB_BOOKS/Books(1)",
							"uri": "https://fake.host.com:8080/sap/opu/odata/sap/ZMDC_V2SB_BOOKS/Books(1)",
							"type": "cds_zmdc_sd_books.BooksType"
						},
						"ID": 1,
						"title": "Pride and Prejudice",
						"author_ID": 101,
						"authorLastName": "Austen",
						"authorFirstName": "Jane",
						"authorFullName": "Jane Austen",
						"genre_code": "history",
						"price": "28.00",
						"currency_code": "EUR",
						"changed": "/Date(1143941551000+0000)/",
						"published": "/Date(-4995388800000)/"
					},
					{
						"__metadata": {
							"id": "https://fake.host.com:8080/sap/opu/odata/sap/ZMDC_V2SB_BOOKS/Books(3)",
							"uri": "https://fake.host.com:8080/sap/opu/odata/sap/ZMDC_V2SB_BOOKS/Books(3)",
							"type": "cds_zmdc_sd_books.BooksType"
						},
						"ID": 2,
						"title": "Alice's Adventures in Wonderland",
						"author_ID": 103,
						"authorLastName": "Carroll",
						"authorFirstName": "Lewis",
						"authorFullName": "Lewis Carroll",
						"genre_code": "law",
						"price": "19.80",
						"currency_code": "EUR",
						"changed": "/Date(1327664639000+0000)/",
						"published": "/Date(-2404166400000)/"
					},
					{
						"__metadata": {
							"id": "https://fake.host.com:8080/sap/opu/odata/sap/ZMDC_V2SB_BOOKS/Books(4)",
							"uri": "https://fake.host.com:8080/sap/opu/odata/sap/ZMDC_V2SB_BOOKS/Books(4)",
							"type": "cds_zmdc_sd_books.BooksType"
						},
						"ID": 3,
						"title": "Frankenstein, Or, The Modern Prometheus",
						"author_ID": 104,
						"authorLastName": "Shelley",
						"authorFirstName": "Mary Wollstonecraft",
						"authorFullName": "Mary Wollstonecraft Shelley",
						"genre_code": "biography",
						"price": "9.80",
						"currency_code": "EUR",
						"changed": "/Date(1448956031000+0000)/",
						"published": "/Date(-3798057600000)/"
					}
				]
			}
		};

		let oResponse = new Response(JSON.stringify(oDataV4Response));
		let {data: aData, nextUrl: sNextUrl} = await DataProviderBase.getHarmonizedBodyFrom(oResponse);

		assert.equal(aData.length, oDataV4Response.value.length, "OData V4: Data length is as expected");
		aData.forEach((oItem, iIndex) => {
			assert.deepEqual(oItem, oDataV4Response.value[iIndex], `OData V4: Data item ${iIndex} is as expected`);
		});
		assert.ok(sNextUrl == null, "Next URL is not defined");

		oResponse = new Response(JSON.stringify(oDataV2Response));
		({data: aData, nextUrl: sNextUrl} = await DataProviderBase.getHarmonizedBodyFrom(oResponse));

		assert.equal(aData.length, oDataV2Response.d.results.length, "OData V2: Data length is as expected");
		aData.forEach((oItem, iIndex) => {
			assert.deepEqual(oItem, oDataV2Response.d.results[iIndex], `OData V2: Data item ${iIndex} is as expected`);
		});
		assert.ok(sNextUrl == null, "Next URL is not defined");
	});
});