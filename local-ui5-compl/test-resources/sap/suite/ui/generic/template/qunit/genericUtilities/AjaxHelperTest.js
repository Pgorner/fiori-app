sap.ui.define([
	"testUtils/sinonEnhanced",
	"sap/suite/ui/generic/template/genericUtilities/AjaxHelper",
	"sap/ui/core/util/MockServer",
	"sap/suite/ui/generic/template/genericUtilities/testableHelper"
], function (sinon, AjaxHelper, MockServer, testableHelper) {
	"use strict";
	var rootServerUrl = "/ajaxHelperTest/";
	var oMockServer = new MockServer({
		rootUri: rootServerUrl
	});
	MockServer.config({
		autoRespond: true,
		autoRespondAfter: 300
	});
	var oStubForPrivate = testableHelper.startTest();
	var serverEndPoint = "testPath/:uniquePath";
	var contentTypeJson = { "Content-Type": "application/json" };
	var contentTypeXmlObj = { "Content-Type": "application/xml" };
	var dummyJsonArray = [{ "id": 12, "comment": "Hey there"}];
	var dummyJsonString = JSON.stringify(dummyJsonArray);
	var dummyXML = "<note>" +
	"<to>Tove</to>" +
	"<from>Jani</from>" +
	"<heading>Reminder</heading>" +
	"<body>Don't forget me this weekend!</body>" +
	"</note>";
	var aRequests =[
		{method:"GET", path:serverEndPoint, response: function() { response(200, contentTypeJson, dummyJsonString);}},
		{method:"POST", path:serverEndPoint, response: function() { response(200, contentTypeJson, dummyJsonString);}}
	];
	oMockServer.setRequests(aRequests);
	oMockServer.start();
	//var globalXhr = sinon.useFakeXMLHttpRequest();
	var globalXhr;
	var requests = this.requests = [];

	function getXHRForUrl(sUrl) {
		return requests.filter(function(xhr) {
			return xhr.url === sUrl;
		})
	}
	function fnGeneralSetup() {
		if (!oMockServer.isStarted()) {
			oMockServer.start();
			}
			globalXhr = sinon.useFakeXMLHttpRequest();
			globalXhr.onCreate = function (xhr) {
				requests.push(xhr);
				sinon.spy(xhr, "setRequestHeader");
				sinon.spy(xhr, "send");
				sinon.spy(xhr, "open");
		}
		testableHelper.startTest();
		var createDummyAjax = oStubForPrivate.handelResponse && oStubForPrivate.encodeData;
		if (!createDummyAjax) {
			var testUrl = "/ajaxHelperTest/testPath/test";
			var oPromise = AjaxHelper.ajax({url:testUrl});
			var oReq = getXHRForUrl(testUrl)[0];
			oReq.respond(200, contentTypeJson, dummyJsonString);
			oPromise.then(function(){
			});
		}
	}
	// After each test filter the reqest whose ready state is 4
	// then remove the stubs attached to these xhr
	function removeXhr(xhr){
		requests.splice(requests.indexOf(xhr),1);
	}
	function fnGeneralTearDown() {
			requests.filter(function(xhr){
				return xhr.readyState === 4
			}).forEach(function(xhr) {
				removeXhr(xhr);
				xhr.send.restore();
				xhr.open.restore();
				xhr.setRequestHeader.restore();
			});
			if (oMockServer.isStarted()) {
				oMockServer.stop();
			}
			if(globalXhr.restore){
				globalXhr.restore();
			}
			testableHelper.endTest();
	}
	QUnit.module("Test the setup of an instance", {
		beforeEach: fnGeneralSetup,
		afterEach: fnGeneralTearDown
	});
	QUnit.test("AjaxHelper.ajax, test basic GET request with server responded with correct json data", function (assert) {
		assert.expect(7);
		var testUrl = "/ajaxHelperTest/testPath/test1";
		var oPromise = AjaxHelper.ajax({url:testUrl});
		assert.equal("function", typeof oPromise.then, "AjaxHelper.ajax returns a promise when called with async flag is true");
		var oReq = getXHRForUrl(testUrl)[0];
		oReq.respond(200, contentTypeJson, dummyJsonString);
		return oPromise.then(function (response) {
			assert.ok(oReq.setRequestHeader.calledOnce, "set Request headers is called");
			var contentTypeHeaders = ["application/x-www-form-urlencoded"];
			assert.equal(contentTypeHeaders[0], oReq.setRequestHeader.getCall(0).args[1], "Content-type header of request is form-url-encoded");
			assert.ok(oReq.open.calledOnce, "open method is called");
			assert.equal(true, oReq.open.getCall(0).args[2], "XHR is opened with async vlaue of true");
			assert.ok(oReq.send.calledOnce, "send method is called");
			var success = response.success && response.statusCode === 200;
			assert.ok(success, "GET request for json data is successful")
		});
	});
	QUnit.test("AjaxHelper.ajax, test basic GET request, server responded with incorrect json data", function (assert) {
		assert.expect(1);
		var testUrl = "/ajaxHelperTest/testPath/test2";
		var incorrectJsonString = dummyJsonString + "hi";
		var oPromise = AjaxHelper.ajax({url:testUrl});
		var oReq = getXHRForUrl(testUrl)[0];
		oReq.respond(200, contentTypeJson, incorrectJsonString);
		return oPromise.catch(function (response) {
			var unSuccess = !response.success && response.statusCode === 200 && response.textStatus === "parsing error";
			assert.ok(unSuccess, "Promise is rejected with error during parsing")
		});
	});
	QUnit.test("AjaxHelper.ajax, test GET request for xml data, server responds with correct xml data", function (assert) {
		assert.expect(1);
		var testUrl = "/ajaxHelperTest/testPath/test3";
		var oPromise = AjaxHelper.ajax({url:testUrl});
		var oReq = getXHRForUrl(testUrl)[0];
		oReq.respond(200, contentTypeXmlObj, dummyXML);
		return oPromise.then(function(response){
			var success = response.success && response.statusCode === 200 && response.textStatus === "success"
			assert.ok(success, "GET request for xml data is successful")
		});
	});
	QUnit.test("AjaxHelper.ajax, test basic GET request with server responded with not found error", function(assert) {
		assert.expect(1);
		var testUrl = "/ajaxHelperTest/testPath/test4";
		var oPromise = AjaxHelper.ajax({url:testUrl});
		var oReq = getXHRForUrl(testUrl)[0];
		oReq.respond(404, { }, 'Not Found');
		return oPromise.catch(function(response){
			var unSuccess = !response.success && response.statusCode === 404;
			assert.ok(unSuccess, "Promise is rejceted with statusCode 404")
		});
	});
	QUnit.test("AjaxHelper.ajax, test basic POST request with server responded with correct json data", function(assert) {
		assert.expect(5);
		var testUrl = "/ajaxHelperTest/testPath/test5";
		var dummyData = {
			key1:'value1'
		}
		var oPromise = AjaxHelper.ajax({url:testUrl, type:"POST", data:dummyData});
		var dummyEncodedData = oStubForPrivate.encodeData(dummyData);
		var oReq = getXHRForUrl(testUrl)[0];
		oReq.respond(200, contentTypeJson, dummyJsonString);
		return oPromise.then(function(response){
			assert.ok(oReq.setRequestHeader.calledOnce, "set Request headers is called")
			var contentTypeHeaders = ["application/x-www-form-urlencoded"]
			assert.equal(contentTypeHeaders[0], oReq.setRequestHeader.getCall(0).args[1], "Content-type header of request is form-url-encoded")
			assert.ok(oReq.send.calledOnce, "send method is called");
			assert.equal(dummyEncodedData, oReq.send.getCall(0).args[0], "Data is sent with body of request in url-encoded form");
			var success = response.success && response.statusCode === 200;
			assert.ok(success, "POST request is successful")
		})
	});
	QUnit.test("AjaxHelper.getJson, test basic GET request for json data", function(assert) {
		assert.expect(4);
		var ajaxStub = sinon.stub(AjaxHelper, "ajax", function () {
			return {
				then: function(callback){
					callback(arguments);
				}
			}
		})
		var oPromise = AjaxHelper.getJSON("/ajaxHelperTest/testPath");
		assert.ok(AjaxHelper.ajax.calledOnce, "AjaxHelper.ajax is called");
		assert.equal("/ajaxHelperTest/testPath", AjaxHelper.ajax.getCall(0).args[0].url, "AjaxHelper.ajax is called with url given in getJSON function");
		assert.equal("json", AjaxHelper.ajax.getCall(0).args[0].dataType, "AjaxHelper.ajax is called with dataType json");
		assert.equal("function", typeof oPromise.then, "getJson Function returns a promise");
		ajaxStub.restore();
	});
	QUnit.test("AjaxHelper.sjax, test basic POST request with server responded with correct json data", function(assert) {
		assert.expect(2);
		var dummyData = {
			key1:'value1'
		}
		var ajaxStub = sinon.stub(AjaxHelper, "ajax", function () {
		})
		AjaxHelper.sjax({url:"/ajaxHelperTest/testPath", type:"POST", data:dummyData});
		assert.ok(AjaxHelper.ajax.calledOnce, "AjaxHelper.ajax is called");
		assert.equal(false, AjaxHelper.ajax.getCall(0).args[0].async, "AjaxHelper.ajax is called with async flag as false");
		ajaxStub.restore();
	});
	QUnit.test("AjaxHelper.syncGetJSON, test correct internal calls to other functions", function(assert) {
		assert.expect(3);
		var sjaxStub = sinon.stub(AjaxHelper, "sjax", function () {
		})
		AjaxHelper.syncGetJSON("/ajaxHelperTest/testPath");
		assert.ok(AjaxHelper.sjax.calledOnce, "AjaxHelper.sjax is called");
		assert.equal("/ajaxHelperTest/testPath", AjaxHelper.sjax.getCall(0).args[0].url, "AjaxHelper.sjax is called with correct url");
		assert.equal("json", AjaxHelper.sjax.getCall(0).args[0].dataType, "AjaxHelper.sjax is called with dataType json");
		sjaxStub.restore();
	});
	QUnit.test("handelResponse, test response of this function when request is successful from server", function(assert) {
		assert.expect(5);
		var event = {target: {
			status: 200,
			statusText:"success",
			responseText:"Hello",
			getResponseHeader: function(){
				return "application/plain;utf-8"
			}
		}}
		var settings ={};
		var oResult = oStubForPrivate.handelResponse(event, settings);
		assert.equal(oResult.success, true, "Response has success flag as true");
		assert.equal(oResult.data, event.target.responseText, "Response has correct data");
		assert.equal(oResult.statusCode, 200, "Response has correct status code");
		assert.equal(oResult.textStatus, "success", "Response has correct textStatus");
		assert.equal(oResult.error, undefined, "Response does not have error")
	});
	QUnit.test("handelResponse, test response of this function when server sends a json data", function(assert) {
		assert.expect(5);
		var event = {target: {
			status: 200,
			statusText:"success",
			responseText:JSON.stringify(dummyJsonArray),
			getResponseHeader: function(){
				return "application/json;utf-8"
			}
		}}
		var settings ={};
		var oResult = oStubForPrivate.handelResponse(event, settings);
		assert.equal(oResult.success, true, "Response has success flag as true");
		assert.deepEqual(oResult.data, dummyJsonArray, "Response has correct JSON data");
		assert.equal(oResult.statusCode, 200, "Response has correct status code");
		assert.equal(oResult.textStatus, "success", "Response has correct textStatus");
		assert.equal(oResult.error, undefined, "Response does not have error")
	});
	QUnit.test("handelResponse, test response of this function when we input unsupported data type", function(assert) {
		assert.expect(3);
		var event = {target: {
			status: 200,
			statusText:"success",
			responseText:JSON.stringify(dummyJsonArray),
			getResponseHeader: function(){
				return "application/unsupported;utf-8"
			}
		}}
		var settings ={};
		var oResult = oStubForPrivate.handelResponse(event, settings);
		assert.equal(oResult.success, false, "Response has success flag as false");
		assert.equal(oResult.textStatus, "error", "Response has correct textStatus");
		assert.notEqual(oResult.error, undefined, "Response does have error")
	});
	QUnit.test("handelResponse, test response of this function when we input different data type then specified in settings", function(assert) {
		assert.expect(3);
		var event = {target: {
			status: 200,
			statusText:"success",
			responseText:"Hello",
			getResponseHeader: function(){
				return "application/xml;utf-8"
			}
		}}
		var settings ={dataType:"json"};
		var oResult = oStubForPrivate.handelResponse(event, settings);
		assert.equal(oResult.success, false, "Response has success flag as false");
		assert.equal(oResult.textStatus, "parsing error", "Response has correct textStatus");
		assert.notEqual(oResult.error, undefined, "Response does have error")
	});
	QUnit.test("ParseJson, test for correct and incorrect json", function(assert) {
		assert.expect(5);
		var correctJsonString = JSON.stringify(dummyJsonArray);
		var incorrectJsonString = correctJsonString + "hi"
		var correctResponse = oStubForPrivate.parseJson(correctJsonString);
		assert.deepEqual(correctResponse.data, dummyJsonArray, "Response correct json data");
		assert.equal(correctResponse.error, undefined, "Response does not have error");
		var inCorrectResponse = oStubForPrivate.parseJson(incorrectJsonString);
		assert.equal(inCorrectResponse.success, false, "Parsing is not successful");
		assert.notEqual(inCorrectResponse.error, undefined, "Response has error");
		assert.equal(inCorrectResponse.textStatus, "parsing error", "textStatus is parsing error");
	});
	QUnit.test("encodeData, test for input as object and string ", function(assert) {
		assert.expect(2);
		var dummyJson = {key:"value value1",key2:"value"};
		var dummyString = JSON.stringify(dummyJson);
		var incodedJsonString = "key=value%20value1&key2=value";
		var encodedData = oStubForPrivate.encodeData(dummyJson);
		assert.equal(encodedData, incodedJsonString, "encoding of object is correct");
		encodedData = oStubForPrivate.encodeData(dummyString);
		assert.equal(encodedData, dummyString, "don't do enncoding for string, return same as input")
	});
	QUnit.test("ParseXML, test for correct and incorrect XMLdocument", function(assert) {
		assert.expect(5);
		var inCorrectXMLString = dummyXML + "hi";
		var correctResponse = oStubForPrivate.parseXML(dummyXML);
		assert.notEqual(correctResponse.data, undefined, "Response has correct xml data");
		assert.equal(correctResponse.error, undefined, "Response does not have error");
		var inCorrectResponse = oStubForPrivate.parseXML(inCorrectXMLString);
		assert.equal(inCorrectResponse.success, false, "Parsing is not successful");
		assert.notEqual(inCorrectResponse.error, undefined, "Response has error");
		assert.equal(inCorrectResponse.textStatus, "parsing error", "textStatus is parsing error");
	});

});
