sap.ui.define([
	"sap/ui/core/Configuration",
	"sap/ui/core/date/UI5Date",
	"sap/suite/ui/generic/template/genericUtilities/jsonHelper",
],function(UI5Configuration, UI5Date, jsonHelper) {
	"use strict";

		function equalityTest(sName, vObject, sMessage, bChangedExpected, aPath, fnPrepare){
			QUnit.test(sName, function(assert){
				(fnPrepare || Function.prototype)();
				var sStandardJson = JSON.stringify(vObject); // for later comparison
				var vStringifiable = jsonHelper.getStringifiable(vObject); // this is vObject2 from the documentation of the process
				var sStringified = JSON.stringify(vStringifiable); // this is the serialized version of the object
				var vParsed = JSON.parse(sStringified); // this is vObject3 from the documentation of the process
				var oDestringified = jsonHelper.deStringify(vParsed); // this is vObject4 from the documentation of the process
				assert.deepEqual(oDestringified, vObject, sMessage); // check whether main contract was fulfilled
				// The following two tests check whether vTestObject was changed by the operation
				assert.equal(JSON.stringify(vObject), sStandardJson, "Structure of test object should be unchanged"); // This already gives a good test for not having changed vObject. However, there are scenarios in which JSON.stringify gives same results for different input 
				assert.deepEqual(vStringifiable, jsonHelper.getStringifiable(vObject), "Applying the getStringifiable function a second time must lead to identical results"); // If vObject would have been changed in such a subtle way it now should produce a different result in the jsonHelper.getStringifiable method.
				// check whether the expectation was right whether the stringifiable object is identical to the original object
				if (bChangedExpected){
					assert.ok(vStringifiable !== vObject, "The stringifiable object must differ from the original object");
				} else {
					assert.strictEqual(vStringifiable, vObject, "The stringifiable object should just be the original object");
				}
				aPath = aPath || (vObject && typeof vObject == "object" && ["test"]);
				if (aPath){
					var vObjectPart = vObject;
					var oDestringifiedPart = oDestringified;
					aPath.forEach(function(sProp){
						vObjectPart = vObjectPart[sProp];
						oDestringifiedPart = oDestringifiedPart[sProp];
					});
					assert.deepEqual(oDestringifiedPart, vObjectPart, "also hidden properties should be equivalent");
				}
			});
		}

		var sCurrentTimezone;
	
		QUnit.module("genericUtilities.jsonHelper", {
			beforeEach : function() {
				sCurrentTimezone = UI5Configuration.getTimezone();
			},
			afterEach : function() {
				UI5Configuration.setTimezone(sCurrentTimezone);
			}
		}, function() {
			equalityTest("Stringify-Destringify simple Date", new Date(), "current date must be handled correctly", true);
			equalityTest("Stringify-Destringify another simple Date", new Date(100), "any date must be handled correctly", true);
			equalityTest("Stringify-Destringify integer", 15, "any integer must be handled correctly", false);
			equalityTest("Stringify-Destringify string", "This is a test string äöü@ß", "any string must be handled correctly", false);
			equalityTest("Stringify-Destringify boolean", false, "any boolean must be handled correctly", false);
			equalityTest("Stringify-Destringify null", null, "null must be handled correctly", false);
			equalityTest("Stringify-Destringify undefined", undefined, "undefined must be handled correctly", true);
			equalityTest("Stringify-Destringify normal object", { "testprop.1": 1, "testprop-2": "2", testprop3: true, testprop4: { "": "deep", "x.y": null } }, "any object without dates must be handled correctly", false);
			equalityTest("Stringify-Destringify object with dates",{ "testprop.1": 1, "testprop-2": "2", testprop3: new Date(), "testprop,4": { "": new Date(27) } }, "any object with dates must be handled correctly", true);
			equalityTest("Stringify-Destringify object possibly being a result of Stringify", { "sap.suite.ui.generic.template.genericUtils.jsonHelper.versionInfo": 1, testprop2: "2" }, "results of stringify must be handled correctly", true);
			equalityTest("Stringify-Destringify object being a result of Stringify", jsonHelper.getStringifiable(new Date()), "results of simple stringify must be handled correctly", true);
			equalityTest("Stringify-Destringify object being a result of Stringify", jsonHelper.getStringifiable({ "testprop.1": 1, "testprop-2": "2", testprop3: new Date(), "testprop,4": { "": new Date(27) } }), "results of complex stringify must be handled correctly", true);
			equalityTest("Stringify-Destringify object with nested undefined", { "testprop.1": 1, "testprop-2": undefined, testprop3: 4.5, "testprop,4": { "": undefined } }, "any object with nested undefined must be handled correctly", true);
			equalityTest("Stringify-Destringify object with nested array with Date", { "testprop.1": 1, "testprop-2": [new Date(45), new Date(17), 28, "sssdddfff"], testprop3: 4.5, "testprop,4": { "": undefined } }, "any object with nested array must be handled correctly", true);
			equalityTest("Stringify-Destringify object with nested array without Date", { "testprop.1": 1, "testprop-2": [true, null, 28, "sssdddfff"], testprop3: 4.5, "testprop,4": { "": 17 } }, "any object with nested array must be handled correctly", false);
			var dObject = new Date();
			dObject.test = new Date(15);
			equalityTest("Stringify-Destringify a Date with additional properties", dObject, "any date with additional properties must be handled correctly", true);
			dObject.oDateParts = new Date(15);
			equalityTest("Stringify-Destringify a Date with additional special properties", dObject, "any date with additional special properties must be handled correctly", true, ["oDateParts"]);
			var dObject2 = new Date(23);
			dObject2[""] = dObject;
			equalityTest("Stringify-Destringify another Date with additional properties", { a: dObject2 }, "nested dates with additional properties must be handled correctly", true, ["a", "", "test"]);
			dObject2.sTimezoneID = "myTest";
			equalityTest("Stringify-Destringify another Date with special additional properties", { a: dObject2 }, "nested dates with special additional properties must be handled correctly", true, ["a", "sTimezoneID"]);
			dObject.oDate = UI5Date.getInstance();
			equalityTest("Stringify-Destringify a Date with additional special properties of type UI5Date", dObject, "any date with additional special properties must be handled correctly", true, ["oDate"]);
			equalityTest("Stringify-Destringify simple UI5Date", dObject.oDate, "current UI5 date must be handled correctly", true);
			dObject.oDate.test = undefined;
			equalityTest("Stringify-Destringify UI5Date with undefined property", dObject.oDate, "current UI5 date with property must be handled correctly", true);
			var oTestObject = {};
			var fnPrepare = function(){ // delay setting the timezone into the test, so that it will be reset by afterEach.
				UI5Configuration.setTimezone("Pacific/Fiji");
				oTestObject.a = UI5Date.getInstance();
			};
			equalityTest("Stringify-Destringify object with a UI5 date in another time-zone", oTestObject, "UI5 date in another time-zone must be handled correctly", true, null, fnPrepare);
		});

});
