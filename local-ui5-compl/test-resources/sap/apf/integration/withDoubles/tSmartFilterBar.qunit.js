/*global QUnit, sinon */
sap.ui.define([
	'sap/apf/testhelper/config/sampleConfiguration',
	'sap/apf/testhelper/doubles/resourcePathHandler',
	'sap/m/Page',
	'sap/ui/comp/smartfilterbar/SmartFilterBar',
	'sap/ui/core/mvc/View',
	'sap/ui/core/mvc/ViewType',
	'sap/ui/core/util/MockServer',
	'sap/ui/thirdparty/jquery',
	'sap/apf/core/utils/filter',
	'sap/apf/testhelper/createComponentAsPromise',
	'sap/apf/testhelper/doubles/navigationHandler',
	'sap/apf/testhelper/doubles/messageHandler',
	'sap/apf/testhelper/doubles/UiInstance',
	'sap/apf/testhelper/doubles/metadata',
	'sap/apf/testhelper/doubles/textResourceHandler',
	'sap/apf/testhelper/doubles/request',
	'sap/apf/testhelper/interfaces/IfResourcePathHandler'
], function(
	sampleConfig,
	ResourcePathHandlerDouble,
	Page,
	SmartFilterBar,
	View,
	ViewType,
	MockServer,
	jQuery,
	ApfFilter,
	createComponentAsPromise,
	NavigationHandlerDouble,
	MessageHandlerDouble,
	UiInstanceDouble,
	MetadataDouble,
	TextResourceHandlerDouble,
	ResourceDouble,
	IfResourcePathHandler
) {
	'use strict';

	var bMockserverIsUp = false;

	sap.ui.define("sap/test/controller/smartFilterBar.controller", [
		"sap/ui/core/mvc/Controller",
		'sap/ui/model/odata/v2/ODataModel'
	], function(Controller, ODataModel) {
		return Controller.extend("sap.test.controller.smartFilterBar", {
			onInit : function() {
				var oModel = new ODataModel("/test/service", true);
				//oModel.setCountSupported(false);
				this.getView().setModel(oModel);
			}
		});
	});

	sap.ui.define("sap/test/view/smartFilterBar", [
		"sap/ui/core/mvc/View"
	], function(View) {
		return View.extend("sap.test.view.smartFilterBar", {
			getControllerName : function() {
				return "sap.test.controller.smartFilterBar";
			},
			createContent : function(oController) {
				var that = this;
				var oPage = new Page({
					content : []
				});
				var sEntityType = this.getViewData().oSmartFilterBarConfiguration.entityType;
				this.getViewData().coreApi.getSmartFilterbarDefaultFilterValues().done(function(controlConfig){
					var oSmartFilterBar = new SmartFilterBar("TestSmartFilterBarId", {
						entityType : sEntityType,
						initialise: function(){
							that.getViewData().coreApi.registerSmartFilterBarInstance(oSmartFilterBar);
						},
						controlConfiguration: controlConfig
					});
					oPage.addContent(oSmartFilterBar);
				});
				return oPage;
			}
		});
	});


	function commonSetupAsPromise(context) {
		var deferred = jQuery.Deferred();
		if (!bMockserverIsUp) {
			var oMockServer = new MockServer({
				rootUri: "/test/service/"
			});

			oMockServer.simulate( sap.ui.require.toUrl("sap/apf/testhelper/mockServer/metadata/smartFilterBar.xml"),
					{
				'sMockdataBaseUrl' : sap.ui.require.toUrl("sap/apf/testhelper/mockServer/metadata/"),
				'bGenerateMissingMockData' : true
					});
			oMockServer.start();
			bMockserverIsUp = true;
		}

		var Request = function() {
			this.sendGetInBatch = function(oFilter, fnCallback) {
				context.usedFilterInPath = oFilter;
				setTimeout(function() {
					fnCallback({ data : [], metadata : undefined}, false);
				}, 1);		
			};
		};

		var ResourcePathHandler = function(inject) {

			ResourcePathHandlerDouble.call(this, inject);
			IfResourcePathHandler.call(this);
			this.loadConfigFromFilePath = function() {

				var that = this;
				var oConfiguration = sampleConfig.getSampleConfiguration("addSmartFilterBar");
				that.oCoreApi.loadAnalyticalConfiguration(oConfiguration);
			};
			this.getConfigurationProperties = function() {
				return jQuery.Deferred().resolve({
					appName : "appName"
				});
			};
		};

		var ExternalContext = function () {
			this.getCombinedContext = function () {
				var deferred = jQuery.Deferred();
				setTimeout(function() {
					deferred.resolve(context.combinedContextFilter);
				}, 1);
				return deferred.promise();
			};
		};
		var inject = {
				constructors : {
					Request : Request,
					ResourcePathHandler : ResourcePathHandler,
					ExternalContext : ExternalContext,
					TextResourceHandler : TextResourceHandlerDouble,
					NavigationHandler : NavigationHandlerDouble,
					UiInstance :  UiInstanceDouble,
					Metadata : MetadataDouble
				}
		};
		createComponentAsPromise(context, 
				{ stubAjaxForResourcePaths : true, componentId : "CompId1", path : "pathOfNoInterest",  inject : inject, componentData : {}}).done(function(){

					context.callbackForUpdatePath = function(oStep) {
						return null;
					};

					var smartFilterBarConfiguration;

					context.oComponent.getProbe().coreApi.getSmartFilterBarConfigurationAsPromise().done(function(config){
						smartFilterBarConfiguration = config;

						context.createSFBview = async function(){
							context.SFBview = await View.create({
								viewName : "module:sap/test/view/smartFilterBar",
								type : ViewType.JS,
								viewData : {
									coreApi : context.oComponent.getProbe().coreApi,
									oSmartFilterBarConfiguration : smartFilterBarConfiguration
								}
							});
						};

						context.getFilterFromSFB = function(smartFilterBarInstance){
							var filterFromSFB = new ApfFilter(context.messageHandler);
							smartFilterBarInstance.getFilters().forEach(function(filterObjectFromSFB){
								filterFromSFB.addAnd(ApfFilter.transformUI5FilterToInternal(context.messageHandler, filterObjectFromSFB));
							});
							return filterFromSFB;
						};
						context.messageHandler = context.oComponent.getProbe().messageHandler;
						deferred.resolve();
					});
				});
		return deferred.promise();
	}
	QUnit.module('Dividing and merging external context', {
		beforeEach: function() {
			sinon.config = sinon.config || {};
			sinon.config.useFakeTimers = false;
			sinon.config.useFakeServer = false;
		},
		afterEach : function() {
			this.SFBview.destroy();
			this.oCompContainer.destroy();
		}
	});
	QUnit.test('External context not applicable for SmartFilterbar', function(assert) {
		assert.expect(3);
		var done = assert.async();
		var that = this;
		var messageHandler = new MessageHandlerDouble().doubleCheckAndMessaging();
		this.combinedContextFilter = new ApfFilter(messageHandler, "PropertyA", "EQ", "1");

		commonSetupAsPromise(this).done(async function(){

			await this.createSFBview();

			this.oComponent.getProbe().coreApi.createStep("stepTemplateComponent1", function(){
				jQuery.when(that.oComponent.getProbe().coreApi.getCumulativeFilter(), that.oComponent.getProbe().coreApi.getSmartFilterBarAsPromise()).done(function(cumulativeStartFilter, smartFilterBarInstance){
					assert.equal(cumulativeStartFilter.toUrlParam(), "(PropertyA%20eq%20%271%27)", "StartFilterHandler returns correct cumulative filter");
					assert.equal(that.getFilterFromSFB(smartFilterBarInstance).toUrlParam(), "", "SmartFilterBar returns empty filter");
					assert.equal(that.usedFilterInPath.toUrlParam(), "(PropertyA%20eq%20%271%27)", "Correct combined filter applied in path update");
					done();
				});
			});	
		}.bind(this));

	});
	QUnit.test('External context partially applicable for SmartFilterbar', function(assert) {
		assert.expect(3);
		var done = assert.async();
		var that = this;
		var messageHandler = new MessageHandlerDouble().doubleCheckAndMessaging();
		this.combinedContextFilter = new ApfFilter(messageHandler, "PropertyA", "EQ", "1");
		this.combinedContextFilter.addAnd("Company", "EQ", "Company1");
		commonSetupAsPromise(this).done(async function(){
			await this.createSFBview();

			this.oComponent.getProbe().coreApi.createStep("stepTemplateComponent1", function(){
				jQuery.when(that.oComponent.getProbe().coreApi.getCumulativeFilter(), that.oComponent.getProbe().coreApi.getSmartFilterBarAsPromise()).done(function(cumulativeStartFilter, smartFilterBarInstance){
					assert.equal(cumulativeStartFilter.toUrlParam(), "(PropertyA%20eq%20%271%27)", "StartFilterHandler returns correct cumulative filter");
					assert.equal(that.getFilterFromSFB(smartFilterBarInstance).toUrlParam(), "(Company%20eq%20%27Company1%27)", "SmartFilterBar returns correct filter");
					assert.equal(that.usedFilterInPath.toUrlParam(), "((PropertyA%20eq%20%271%27)%20and%20(Company%20eq%20%27Company1%27))", "Correct combined filter applied in path update");
					done();
				});
			});
		}.bind(this));
	});
	QUnit.test('External context fully applicable for SmartFilterbar', function(assert) {
		assert.expect(3);
		var done = assert.async();
		var that = this;
		var messageHandler = new MessageHandlerDouble().doubleCheckAndMessaging();
		this.combinedContextFilter = new ApfFilter(messageHandler, "Company", "EQ", "Company1");
		this.combinedContextFilter.addOr("Company", "EQ", "Company2");
		commonSetupAsPromise(this).done(async function(){
			await this.createSFBview();

			this.oComponent.getProbe().coreApi.createStep("stepTemplateComponent1", function(){
				jQuery.when(that.oComponent.getProbe().coreApi.getCumulativeFilter(), that.oComponent.getProbe().coreApi.getSmartFilterBarAsPromise()).done(function(cumulativeStartFilter, smartFilterBarInstance){
					assert.equal(cumulativeStartFilter.toUrlParam(), "", "StartFilterHandler returns empty cumulative filter");
					assert.equal(that.getFilterFromSFB(smartFilterBarInstance).toUrlParam(), "((Company%20eq%20%27Company1%27)%20or%20(Company%20eq%20%27Company2%27))", "SmartFilterBar returns correct filter");
					assert.equal(that.usedFilterInPath.toUrlParam(), "((Company%20eq%20%27Company1%27)%20or%20(Company%20eq%20%27Company2%27))", "Correct combined filter applied in path update");
					done();
				});
			});
		}.bind(this));
	});
	QUnit.test('External context fully applicable for SmartFilterbar with ranges for not restricted filter properties', function(assert) {
		assert.expect(3);
		var done = assert.async();
		var that = this;
		var messageHandler = new MessageHandlerDouble().doubleCheckAndMessaging();
		this.combinedContextFilter = new ApfFilter(messageHandler, "Country", "GT", "Argentina");
		this.combinedContextFilter.addOr("Country", "BT", "Germany", "USA");
		commonSetupAsPromise(this).done(async function(){
			await this.createSFBview();

			this.oComponent.getProbe().coreApi.createStep("stepTemplateComponent1", function(){
				jQuery.when(that.oComponent.getProbe().coreApi.getCumulativeFilter(), that.oComponent.getProbe().coreApi.getSmartFilterBarAsPromise()).done(function(cumulativeStartFilter, smartFilterBarInstance){
					assert.equal(cumulativeStartFilter.toUrlParam(), "", "StartFilterHandler returns empty cumulative filter");
					assert.equal(that.getFilterFromSFB(smartFilterBarInstance).toUrlParam(), "((Country%20gt%20%27Argentina%27)%20or%20((Country%20ge%20%27Germany%27)%20and%20(Country%20le%20%27USA%27)))", "SmartFilterBar returns correct filter");
					assert.equal(that.usedFilterInPath.toUrlParam(), "((Country%20gt%20%27Argentina%27)%20or%20((Country%20ge%20%27Germany%27)%20and%20(Country%20le%20%27USA%27)))", "Correct combined filter applied in path update");
					done();
				});
			});
		}.bind(this));
	});
	QUnit.test('Empty external context', function(assert) {
		assert.expect(3);
		var done = assert.async();
		var that = this;
		var messageHandler = new MessageHandlerDouble().doubleCheckAndMessaging();
		this.combinedContextFilter = new ApfFilter(messageHandler);
		commonSetupAsPromise(this).done(async function(){
			await this.createSFBview();

			this.oComponent.getProbe().coreApi.createStep("stepTemplateComponent1", function(){
				jQuery.when(that.oComponent.getProbe().coreApi.getCumulativeFilter(), that.oComponent.getProbe().coreApi.getSmartFilterBarAsPromise()).done(function(cumulativeStartFilter, smartFilterBarInstance){
					assert.equal(cumulativeStartFilter.toUrlParam(), "", "StartFilterHandler returns empty cumulative filter");
					assert.equal(that.getFilterFromSFB(smartFilterBarInstance).toUrlParam(), "", "SmartFilterBar returns empty filter");
					assert.equal(that.usedFilterInPath.toUrlParam(), "", "Correct combined filter applied in path update");
					done();
				});
			});
		}.bind(this));
	});
	/*
	 * If one of the following tests break it's most likely due to changes in the SFB behaviour
	 */
	QUnit.module('Handling of inconsistent filters to metadata', {
		beforeEach : function(assert) {

		},
		afterEach : function() {
			this.SFBview.destroy();
			this.oCompContainer.destroy();
		}
	});
	QUnit.test('Multi value filter for single value property', function(assert) {
		assert.expect(3);
		var done = assert.async();
		var that = this;
		var messageHandler = new MessageHandlerDouble().doubleCheckAndMessaging();
		this.combinedContextFilter = new ApfFilter(messageHandler, "City", "EQ", "Walldorf");
		this.combinedContextFilter.addOr("City", "EQ", "Palo Alto");

		commonSetupAsPromise(this).done(async function(){
			await this.createSFBview();
			this.oComponent.getProbe().coreApi.createStep("stepTemplateComponent1", function(){
				jQuery.when(that.oComponent.getProbe().coreApi.getCumulativeFilter(), that.oComponent.getProbe().coreApi.getSmartFilterBarAsPromise()).done(function(cumulativeStartFilter, smartFilterBarInstance){
					assert.equal(cumulativeStartFilter.toUrlParam(), "", "StartFilterHandler returns empty cumulative filter");
					assert.equal(that.getFilterFromSFB(smartFilterBarInstance).toUrlParam(), "(City%20eq%20%27Walldorf%27)", "SmartFilterBar returns only first equality");
					assert.equal(that.usedFilterInPath.toUrlParam(), "(City%20eq%20%27Walldorf%27)", "Correct combined filter applied in path update");
					done();
				});
			});
		}.bind(this));
	});
	QUnit.test('Range filter for single value property', function(assert) {
		assert.expect(3);
		var done = assert.async();
		var that = this;
		var messageHandler = new MessageHandlerDouble().doubleCheckAndMessaging();
		this.combinedContextFilter = new ApfFilter(messageHandler, "City", "GT", "Walldorf");
		commonSetupAsPromise(this).done(async function(){
			await this.createSFBview();

			this.oComponent.getProbe().coreApi.createStep("stepTemplateComponent1", function(){
				jQuery.when(that.oComponent.getProbe().coreApi.getCumulativeFilter(), that.oComponent.getProbe().coreApi.getSmartFilterBarAsPromise()).done(function(cumulativeStartFilter, smartFilterBarInstance){
					assert.equal(cumulativeStartFilter.toUrlParam(), "", "StartFilterHandler returns empty cumulative filter");
					assert.equal(that.getFilterFromSFB(smartFilterBarInstance).toUrlParam(), "(City%20eq%20%27Walldorf%27)", "SmartFilterBar converts range to equality");
					assert.equal(that.usedFilterInPath.toUrlParam(), "(City%20eq%20%27Walldorf%27)", "Correct combined filter applied in path update");
					done();
				});
			});
		}.bind(this));
	});
	QUnit.test('Filter for a property that only restricts a value help', function(assert) {
		assert.expect(3);
		var done = assert.async();
		var that = this;
		var messageHandler = new MessageHandlerDouble().doubleCheckAndMessaging();
		this.combinedContextFilter = new ApfFilter(messageHandler, "Country", "EQ", "Germany");
		this.combinedContextFilter.addAnd("Continent", "EQ", "Europe");
		commonSetupAsPromise(this).done(async function(){
			await this.createSFBview();

			this.oComponent.getProbe().coreApi.createStep("stepTemplateComponent1", function(){
				jQuery.when(that.oComponent.getProbe().coreApi.getCumulativeFilter(), that.oComponent.getProbe().coreApi.getSmartFilterBarAsPromise()).done(function(cumulativeStartFilter, smartFilterBarInstance){
					assert.equal(cumulativeStartFilter.toUrlParam(), "(Continent%20eq%20%27Europe%27)", "Property that just restricts ValueHelp in SFB is returned by StartFilter");
					assert.equal(that.getFilterFromSFB(smartFilterBarInstance).toUrlParam(), "(Country%20eq%20%27Germany%27)", "Property that is in EntityType of SFB is returned by SFB");
					assert.equal(that.usedFilterInPath.toUrlParam(), "((Continent%20eq%20%27Europe%27)%20and%20(Country%20eq%20%27Germany%27))", "Correct combined filter applied in path update");
					done();
				});
			});
		}.bind(this));
	});
});
