/*global QUnit, sinon */
sap.ui.define([
	'sap/apf/api',
	'sap/apf/core/constants',
	'sap/apf/core/instance',
	'sap/apf/testhelper/createComponentAsPromise',
	'sap/apf/testhelper/config/sampleConfiguration',
	'sap/apf/testhelper/doubles/metadata',
	'sap/apf/testhelper/doubles/request',
	'sap/apf/testhelper/doubles/resourcePathHandler',
	'sap/apf/testhelper/doubles/sessionHandlerStubbedAjax',
	'sap/apf/testhelper/doubles/UiInstance',
	'sap/apf/testhelper/interfaces/IfResourcePathHandler',
	'sap/apf/testhelper/mockServer/wrapper',
	'sap/apf/utils/startFilterHandler',
	'sap/base/util/deepExtend',
	'sap/ui/comp/smartfilterbar/SmartFilterBar',
	'sap/ui/thirdparty/jquery',
	'sap/apf/testhelper/odata/sampleServiceData',
	'sap/apf/testhelper/doubles/Representation'
], function (
	Api,
	coreConstants,
	CoreInstance,
	createComponentAsPromise,
	sampleConfig,
	MetadataDouble,
	RequestDouble,
	ResourcePathHandlerDouble,
	SessionHandlerStubbedAjax,
	UiInstanceDouble,
	IfResourcePathHandler,
	mockServer,
	StartFilterHandler,
	deepExtend,
	SmartFilterBar,
	jQuery
) {
	'use strict';

	/**
	 * convenience function to define a filter
	 */
	function defineFilter (oApi, filters) {
		var oFilter = oApi.createFilter();
		var oExpression;
		var property;
		for(property in filters) {
			if (filters.hasOwnProperty(property)) {
				oExpression = {
						name : property,
						operator : coreConstants.FilterOperators.EQ,
						value : filters[property]
				};
				oFilter.getTopAnd().addExpression(oExpression);
			}
		}
		return oFilter;
	}
	function getConfiguration() {
		return {
			analyticalConfigurationName: "configForTesting-tApi",
			steps: [],
			requests: [],
			bindings: [],
			categories: [],
			representationTypes: [],
			navigationTargets: []
		};
	}

	function setupTheIsolatedComponent(context, assert) {
		var done = assert.async();
		var PatchedResourcePathHandler = function(inject) {
			ResourcePathHandlerDouble.call(this, inject);
			IfResourcePathHandler.call(this);
			this.loadConfigFromFilePath = function() {
				var oConfiguration = sampleConfig.getSampleConfiguration();
				this.oCoreApi.loadAnalyticalConfiguration(oConfiguration);
			};
		};
		var inject = {
				constructors : {
					ResourcePathHandler : PatchedResourcePathHandler,
					Metadata : MetadataDouble
				}
		};
		if (context.stubs) {
			inject = deepExtend(inject, context.stubs);
		}
		if (!inject.constructors.Request) {
			inject.constructors.Request = RequestDouble;
		}
		createComponentAsPromise(context, 
				{ stubAjaxForResourcePaths : true, doubleUiInstance : true, componentId : "CompId1", path : "pathOfNoInterest",  inject : inject, componentData : {}}).done(function(){

					context.callbackForUpdatePath = function(oStep) {
						return null;
					};
					done();
				});
	}

	QUnit.module('PathFilter with Apf Component', {
		beforeEach : function(assert) {
			var that = this;
			this.stubs = {};
			this.stubs.constructors = {
					StartFilterHandler : function(inject) {
						StartFilterHandler.call(this, inject);
						sinon.stub(this, "getCumulativeFilter", function() {
							return jQuery.Deferred().resolve(that.cumulativeFilter.getInternalFilter());
						});
					}
			};
			setupTheIsolatedComponent(this, assert);
		},
		afterEach : function() {
			this.oCompContainer && this.oCompContainer.destroy();
		}
	});
	QUnit.test("Cumulative filter SAPClient=777 restricts result set", function(assert) {
		this.cumulativeFilter = defineFilter(this.oApi, {
			SAPClient : "777"
		});
		this.oApi.createStep("stepTemplateComponent1", this.callbackForUpdatePath);
		var length = this.oApi.getSteps()[0].getSelectedRepresentation().aDataResponse.length;
		assert.equal(length, 10, "match 10 rows");
	});
	QUnit.test("Cumulative filter SAPClient=777 && companyCode EQ 2000 ", function(assert) {
		this.cumulativeFilter = defineFilter(this.oApi, {
			SAPClient : "777",
			CompanyCode : "2000"
		});
		this.oApi.createStep("stepTemplateComponent1", this.callbackForUpdatePath);
		var length = this.oApi.getSteps()[0].getSelectedRepresentation().aDataResponse.length;
		assert.equal(length, 5, "match 5 rows");
	});
	QUnit.test("Cumualtive Filter with SAPClient=777 && companyCode EQ 2000 && Customer EQ 2001", function(assert) {
		this.cumulativeFilter = defineFilter(this.oApi, {
			SAPClient : "777",
			CompanyCode : "2000",
			Customer : "2001"
		});
		this.oApi.createStep("stepTemplateComponent1", this.callbackForUpdatePath);
		var length = this.oApi.getSteps()[0].getSelectedRepresentation().aDataResponse.length;
		assert.equal(length, 1, "match 1 row");
	});
	QUnit.test("Cumulative filter with SAPClient=777 && companyCode EQ 2000 && Customer EQ 5555", function(assert) {
		this.cumulativeFilter = defineFilter(this.oApi, {
			SAPClient : "777",
			CompanyCode : "2000",
			Customer : "5555"
		});
		this.oApi.createStep("stepTemplateComponent1", this.callbackForUpdatePath);
		var length = this.oApi.getSteps()[0].getSelectedRepresentation().aDataResponse.length;
		assert.equal(length, 0, "match 0 row");
	});
	QUnit.module('StartFilter and SmartFilterBarFilter reflected in path', {
		beforeEach : function(assert) {
			var that = this;
			this.stubs = {};
			this.stubs.constructors = {
					StartFilterHandler : function(inject) {
						StartFilterHandler.call(this, inject);
						sinon.stub(this, "getCumulativeFilter", function() {
							return jQuery.Deferred().resolve(that.cumulativeFilter.getInternalFilter());
						});
					},
					Request : function() {
						this.sendGetInBatch = function(oFilter, fnCallback) {
							that.usedFilterInPath = oFilter;
							fnCallback({
								data : [],
								metadata : undefined
							}, false);
						};
					}
			};
			setupTheIsolatedComponent(this, assert);
			this.cumulativeFilter = defineFilter(this.oApi, {
				SAPClient : "777"
			});
		},
		registerSFB : function(){
			var oSFBStub = {
					getFilters: function(aFilterName){
						if(!aFilterName){
							return this.SFBFilter;
						}
						return this.SFBParameters[aFilterName[0]];
					}.bind(this),
					getAnalyticalParameters: function() {
						return this.analyticalParameters || [];
					}.bind(this),
					applyVariant: function(serializedFilter){
						this.SFBFilter = serializedFilter;
					}.bind(this), 
					fetchVariant: function(){
					}
			};
			this.oComponent.getProbe().coreApi.loadAnalyticalConfiguration(sampleConfig.getSampleConfiguration('addSmartFilterBar'));
			this.oComponent.getProbe().coreApi.registerSmartFilterBarInstance(oSFBStub);
		},
		afterEach : function() {
			this.oCompContainer && this.oCompContainer.destroy();
		}
	});
	QUnit.test("StartFilter and no SmartFilterBar", function(assert){
		var that = this;
		var done = assert.async();
		this.oApi.createStep("stepTemplateComponent1", function(){
			assert.equal(that.usedFilterInPath.toUrlParam(), "(SAPClient%20eq%20%27777%27)", "Filter from StartFilter only represented in request of step update");
			that.oComponent.getProbe().coreApi.getCumulativeFilterUpToActiveStep().done(function(cumulativeFilter){
				assert.equal(cumulativeFilter.toUrlParam(),  "((SAPClient%20eq%20%27777%27))", "Filter from StartFilter only represented in getCumulativeFilterUpToActiveStep in core");
				done();
			});
		});
	});
	QUnit.test("StartFilter and empty filter of SmartFilterBar", function(assert){
		var that = this;
		var done = assert.async();
		this.registerSFB();
		this.SFBFilter = [];
		this.oApi.createStep("stepTemplateComponent1", function(){
			assert.equal(that.usedFilterInPath.toUrlParam(), "(SAPClient%20eq%20%27777%27)", "Filter from StartFilter only represented in request of step update");
			that.oComponent.getProbe().coreApi.getCumulativeFilterUpToActiveStep().done(function(cumulativeFilter){
				assert.equal(cumulativeFilter.toUrlParam(),  "((SAPClient%20eq%20%27777%27))", "Filter from StartFilter only represented in getCumulativeFilterUpToActiveStep in core");
				done();
			});
		});
	});
	QUnit.test("StartFilter and single filter of SmartFilterBar", function(assert){
		var that = this;
		var done = assert.async();
		this.registerSFB();
		this.SFBFilter = [{
			sPath: "A",
			sOperator: "EQ",
			oValue1: "1"
		}];
		var expectedFilter = "((SAPClient%20eq%20%27777%27)%20and%20(A%20eq%20%271%27))";
		this.oApi.createStep("stepTemplateComponent1", function(){
			assert.equal(that.usedFilterInPath.toUrlParam(), expectedFilter, "Both filters represented in request of step update");
			that.oComponent.getProbe().coreApi.getCumulativeFilterUpToActiveStep().done(function(cumulativeFilter){
				assert.equal(cumulativeFilter.toUrlParam(),  expectedFilter, "Both filters represented in getCumulativeFilterUpToActiveStep in core");
				done();
			});
		});
	});
	
	QUnit.test("StartFilter and single filter of SmartFilterBar and two parameters of parameter entity set", function(assert){
		var that = this;
		var done = assert.async();
		this.registerSFB();
		this.SFBFilter = [{
			sPath: "A",
			sOperator: "EQ",
			oValue1: "1"
		}];
		this.SFBParameters = {
				'i_P_Curr' : [{
					oValue1: "EUR",
					sOperator: "EQ",
					sPath: "i_P_Curr"
				}],
				'i_P_Quan' : [{
					oValue1: "to",
					sOperator: "EQ",
					sPath: "i_P_Quan"
				}]
		};
		this.analyticalParameters = [ { fieldNameOData : 'P_Curr', fieldName : 'i_P_Curr'}, { fieldNameOData : 'P_Quan', fieldName : 'i_P_Quan'}];
		var expectedFilter = "((SAPClient%20eq%20%27777%27)%20and%20(A%20eq%20%271%27)%20and%20(P_Curr%20eq%20%27EUR%27)%20and%20(P_Quan%20eq%20%27to%27))";
		this.oApi.createStep("stepTemplateComponent1", function(){
			assert.equal(that.usedFilterInPath.toUrlParam(), expectedFilter, "Both filters and two parameters represented in request of step update");
			that.oComponent.getProbe().coreApi.getCumulativeFilterUpToActiveStep().done(function(cumulativeFilter){
				assert.equal(cumulativeFilter.toUrlParam(),  expectedFilter, "Both filters and two parameters represented in getCumulativeFilterUpToActiveStep in core");
				done();
			});
		});
	});
	QUnit.test("StartFilter and two parameters of parameter entity set", function(assert){
		var that = this;
		var done = assert.async();
		this.registerSFB();
		this.SFBFilter = [];
		this.SFBParameters = {
				'i_P_Curr' : [{
					oValue1: "EUR",
					sOperator: "EQ",
					sPath: "i_P_Curr"
				}],
				'i_P_Quan' : [{
					oValue1: "to",
					sOperator: "EQ",
					sPath: "i_P_Quan"
				}]
		};
		this.analyticalParameters = [ { fieldNameOData : 'P_Curr', fieldName : 'i_P_Curr'}, { fieldNameOData : 'P_Quan', fieldName : 'i_P_Quan'}];
		var expectedFilter = "((SAPClient%20eq%20%27777%27)%20and%20(P_Curr%20eq%20%27EUR%27)%20and%20(P_Quan%20eq%20%27to%27))";
		this.oApi.createStep("stepTemplateComponent1", function(){
			assert.equal(that.usedFilterInPath.toUrlParam(), expectedFilter, "Both parameters represented in request of step update");
			that.oComponent.getProbe().coreApi.getCumulativeFilterUpToActiveStep().done(function(cumulativeFilter){
				assert.equal(cumulativeFilter.toUrlParam(),  expectedFilter, "Both parameters represented in getCumulativeFilterUpToActiveStep in core");
				done();
			});
		});
	});
	QUnit.test("StartFilter and two filter of SmartFilterBar", function(assert){
		var that = this;
		var done = assert.async();
		this.registerSFB();
		this.SFBFilter = [{
			sPath: "A",
			sOperator: "EQ",
			oValue1: "1"
		},{
			sPath: "B",
			sOperator: "EQ",
			oValue1: "2"
		}];
		var expectedFilter = "((SAPClient%20eq%20%27777%27)%20and%20(A%20eq%20%271%27)%20and%20(B%20eq%20%272%27))";
		this.oApi.createStep("stepTemplateComponent1", function(){
			assert.equal(that.usedFilterInPath.toUrlParam(), expectedFilter, "Both filters represented in request of step update");
			that.oComponent.getProbe().coreApi.getCumulativeFilterUpToActiveStep().done(function(cumulativeFilter){
				assert.equal(cumulativeFilter.toUrlParam(), expectedFilter, "Both filters represented in getCumulativeFilterUpToActiveStep in core");
				done();
			});
		});
	});
	QUnit.module('Isolated API with cumulative filter', {
		beforeEach: function () {
			var that = this;
			this.testContext = {};
			function ResourcePathHandler(inject) {
				var handlerContext = this;
				IfResourcePathHandler.call(this, inject);
				ResourcePathHandlerDouble.call(this, inject);
				this.loadConfigFromFilePath = function () {
					handlerContext.oCoreApi.loadAnalyticalConfiguration(getConfiguration()); // loading is required
				};
			}

			this.testContext.stubs = {
					constructors: {
						ResourcePathHandler: ResourcePathHandler,
						SessionHandler: SessionHandlerStubbedAjax,
						UiInstance: UiInstanceDouble
					},
					probe: function (dependencies) {
						that.testContext.dependencies = dependencies;
					}
			};
			this.testContext.oApi = new Api(
					{},  // is in role of class Component, so some API stubs may be needed
					this.testContext.stubs
			);
			this.testContext.oApi.loadApplicationConfig('pathNameDoesNotMatter');
			this.testContext.oApi.startApf();
		},
		afterEach: function () {
		}
	});
	QUnit.test("create stubbed API ", function (assert) {
		assert.notEqual(this.testContext.oApi, undefined, "api exists");
		assert.notEqual(this.testContext.dependencies, undefined, "dependencies exists");
		assert.notEqual(this.testContext.dependencies.coreApi, undefined, "dependencies.coreApi exists");
	});
	QUnit.test("addPathFilter adds filter to cumulative path", function (assert) {
		var done = assert.async();
		var filter = this.testContext.oApi.createFilter();
		filter.getTopAnd().addExpression({
			name: 'A', operator: 'EQ', value: 1
		});
		// act
		this.testContext.oApi.addPathFilter(filter);

		var promise = this.testContext.dependencies.coreApi.getCumulativeFilter();
		promise.then(function (cumulativeFilter) {
			assert.notEqual(cumulativeFilter, undefined, "cumulativeFilter exists");
			assert.equal(cumulativeFilter.toUrlParam(), "(A%20eq%201)", "A eq 1");
			done();
		});
	});
	QUnit.test("updatePathFilter shall replace its filter in cumulative path", function (assert) {
		var done = assert.async();
		var filter = this.testContext.oApi.createFilter();
		filter.getTopAnd().addExpression({
			name: 'A', operator: 'EQ', value: 1
		});
		var replacement = this.testContext.oApi.createFilter();
		replacement.getTopAnd().addExpression({
			name: 'A', operator: 'EQ', value: 777
		});
		var id = this.testContext.oApi.addPathFilter(filter);

		// act
		this.testContext.oApi.updatePathFilter(id, replacement);
		var promise = this.testContext.dependencies.coreApi.getCumulativeFilter();
		promise.then(function (cumulativeFilter) {
			assert.notEqual(cumulativeFilter, undefined, "cumulativeFilter exists");
			assert.equal(cumulativeFilter.toUrlParam(), "(A%20eq%20777)", "A eq 777");
			done();
		});
	});
	QUnit.test("updatePathFilter called twice with different property names refuses 2nd update with error", function (assert) {
		var done = assert.async();
		var filter = this.testContext.oApi.createFilter();

		function errorCallback(messageObject) {
			assert.equal(messageObject.getPrevious().getCode(), "5100", "THEN message has been emitted");
		}
		this.testContext.dependencies.messageHandler.setMessageCallback(errorCallback);
		filter.getTopAnd().addExpression({
			name: 'A', operator: 'EQ', value: 1
		});
		var replacement = this.testContext.oApi.createFilter();
		replacement.getTopAnd().addExpression({
			name: 'B', operator: 'EQ', value: 777
		});
		var id = this.testContext.oApi.addPathFilter(filter);

		// act
		assert.throws(function() {
			this.testContext.oApi.updatePathFilter(id, replacement);
		}, Error, "fatal error");

		var promise = this.testContext.dependencies.coreApi.getCumulativeFilter();
		promise.then(function(cumulativeFilter) {
			assert.notEqual(cumulativeFilter, undefined, "cumulativeFilter exists");
			assert.equal(cumulativeFilter.toUrlParam(), "(A%20eq%201)", "A eq 1");
			done();
		});
	});
	QUnit.module('SmartFilterBar with Apf Component and UI', {
		beforeEach : function(assert) {
			var that = this;
			var done = assert.async();
			mockServer.activateDso();
			mockServer.activateDummyMetadata();
			var inject = {
				constructors : {
					Request : RequestDouble,
					StartFilterHandler : function(inject) {
						StartFilterHandler.call(this, inject);
						sinon.stub(this, "getCumulativeFilter", function() {
							return jQuery.Deferred().resolve(defineFilter(that.oApi).getInternalFilter());
						});
					},
					CoreInstance : function(){
						CoreInstance.constructor.apply(this, arguments);
						var loadConfig = this.loadAnalyticalConfiguration;
						this.loadAnalyticalConfiguration = function(configuration){
							configuration.smartFilterBar = {
								id : "id",
								service : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata/",
								entitySet : "CurrencyQueryResults"
							};
							loadConfig(configuration);
						};
					}
				}
			};
			createComponentAsPromise(this, { 
				stubAjaxForResourcePaths : true,
				componentId : "CompId1",
				inject : inject,
				componentData : {}
			}).done(function(){
				that.callbackForUpdatePath = function(oStep) {
					return null;
				};
				done();
			});
		},
		afterEach : function() {
			this.oCompContainer && this.oCompContainer.destroy();
			mockServer.deactivate();
		}
	});
	QUnit.test("No Path update when smartFilterBar is deserialized", function(assert) {
		var done = assert.async();
		SmartFilterBar.LIVE_MODE_INTERVAL = 0;
		var coreApi = this.oComponent.getProbe().coreApi;
		var updatePathSpy = sinon.spy(coreApi, "updatePath");
		coreApi.deserialize({
			smartFilterBar : {},
			path  : {
				steps : [{
					binding : {
						selectedRepresentationId : "representationId1",
						selectedRepresentation : {
							indicesOfSelectedData : [],
							selectionStrategy : "nothing",
							data : []
						}
					},
					stepId: "stepTemplate1"
				}],
				indicesOfActiveSteps : ["0"]
			}
		});
		setTimeout(function(){
			assert.strictEqual(updatePathSpy.callCount, 0, "Update path was not called from the smartFilterBar");
			assert.strictEqual(coreApi.isDirty(), false, "After open path the path should not be dirty");
			done();
		},1);
	});
});
