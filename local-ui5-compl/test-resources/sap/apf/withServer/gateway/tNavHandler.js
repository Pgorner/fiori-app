/*
 * This test is executed manually against a server. The manual steps are described in the internal
 * document proxySettings.txt. Thus, it is not part of a testsuite. 
 *
 *global OData */
sap.ui.define([
	"sap/apf/core/utils/Filter",
	"sap/apf/utils/navigationHandler",
	"sap/apf/testhelper/doubles/createUiApiAsPromise",
	"sap/apf/testhelper/doubles/messageHandler",
	"sap/apf/withServer/helper"
], function(
	CoreFilter,
	NavigationHandler,
	createUiApiAsPromise,
	MessageHandlerDouble,
	Helper,
) {
	'use strict';

	function navigationHandlerCommonSetup(context, defaultTargets) {
		var that = context;
		that.messageHandler = new MessageHandlerDouble().doubleCheckAndMessaging().spyPutMessage();
		var inject = {
			instances : {
				messageHandler : that.messageHandler
			},
			functions : {
				getNavigationTargets : function() {
					return defaultTargets;
				},
				getCumulativeFilterUpToActiveStep : function() {
					var filter = new CoreFilter(that.messageHandler, "SAPClient", "EQ", "888");
					return jQuery.Deferred().resolve(filter.addAnd(new CoreFilter(that.messageHandler, "Country", "EQ", "BRA")));
				},
				serialize : function() {
					context.serializeCalled = true;
					return {
						path : 'Alpha'
					};
				},
				serializeContext : function() {
					context.serializeContextCalled = true;
					return {
						context : 'Beta'
					};
				},
				deserialize : function() {
					context.deserializeCalled = true;
				},
				deserializeContext : function() {
					context.deserializeContextCalled = true;
				}
			}
		};
		that.navigationHandler = new NavigationHandler(inject);
	}

	async function addNavigationTarget(semanticObjects, counter, navTargets, component) {

		if (counter > semanticObjects.length || counter > 100) {
			return navTargets;
		}

		const navigationService = await sap.ui.require("sap/ushell/Container").getServiceAsync("Navigation");
		const semanticObject = semanticObjects[counter];
		const aIntents = await navigationService.getLinks([{
				semanticObject : semanticObject,
				ignoreFormFactor : true,
				ui5Component : component
			}]);

		aIntents.forEach(function(intentDefinition) {
			var actionWithParameters = intentDefinition.intent.split("-");
			var action = actionWithParameters[1].split("?");
			action = action[0].split("~");
			navTargets.push({
				semanticObject : semanticObject.id,
				action : action[0],
				id : "xxx" + counter
			});
		});
		counter++;

		// recursive call
		return await addNavigationTarget(semanticObjects, counter, navTargets, component);
	}

	function getAllAvailableSemanticObjects(messageHandler, authTestHelper, fnCallback, component) {
		function prepareNavigationTargetsConfiguration(oData, results) {
			var semanticObjects = oData.results;
			var navTargets = [];
			addNavigationTarget(semanticObjects, 0, navTargets).then(function() {
				fnCallback(navTargets, component);
			});
		}
		authTestHelper.getXsrfToken("/sap/opu/odata/UI2/INTEROP/SemanticObjects").done(function(sXsrfToken){
			var request = {
					requestUri : "/sap/opu/odata/UI2/INTEROP/SemanticObjects?$format=json&$select=id,text",
					method : "GET",
					headers : {
						"x-csrf-token" : sXsrfToken
					}
			};
			OData.request(request, prepareNavigationTargetsConfiguration, function(){});
		});
	}
	QUnit.module("Ushell container", {
		beforeEach : function(assert) {
			var done = assert.async();
			this.config = {
					serviceRoot : "/sap/opu/odata/UI2/INTEROP/",
					entitySet : "SemanticObjects",
					systemType : "abap"
			};
			this.helper = new Helper(this.config);
			this.oAuthTestHelper = this.helper.createAuthTestHelper(done, function() {
				createUiApiAsPromise().done(function(uiApi){
					this.component = uiApi.component;
					done();
				}.bind(this));
			}.bind(this));
		}
	});
	QUnit.test("WHEN get all semantic objects", function(assert) {
		var done = assert.async();
		function returnSemanticObjects(oData, results) {
			var allAvailableSemanticObjects = oData.results;
			assert.ok(true, "could read all semantic objects");
			done();
			allAvailableSemanticObjects.forEach(function(semanticObject) {
				/* eslint-disable no-console */
				console.log(semanticObject.id + " - " + semanticObject.text);
				/* eslint-enable no-console */
			});
		}
		function returnErrors(oError) {
			assert.ok(false);
			done();
		}
		this.oAuthTestHelper.getXsrfToken("/sap/opu/odata/UI2/INTEROP/SemanticObjects").done(function(sXsrfToken){
			var request = {
				requestUri : "/sap/opu/odata/UI2/INTEROP/SemanticObjects?$format=json&$select=id,text",
				method : "GET",
				headers : {
					"x-csrf-token" : sXsrfToken
				}
			};
			OData.request(request, returnSemanticObjects, returnErrors);
		});
	});
	QUnit.test("WHEN getNavigationTargets is called", function(assert) {
		var done = assert.async();
		var that = this;
		function handleNavigationTargets(navTargets) {
			navigationHandlerCommonSetup(that, navTargets);
			that.navigationHandler.getNavigationTargets().done(function(navTargets) {
				assert.ok(navTargets, "THEN navigation targets are fetched from ui2 service");
				done();
			}).fail(function() {
				assert.ok(false, "error occurred");
				done();
			});
		}
		getAllAvailableSemanticObjects(this.messageHandler, this.oAuthTestHelper, handleNavigationTargets, this.component);
	});
});
