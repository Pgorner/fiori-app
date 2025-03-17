/*global QUnit */
sap.ui.define([
	"sap/apf/core/messageObject",
	"sap/apf/core/odataRequest",
	"sap/apf/core/resourcePathHandler",
	"sap/apf/core/utils/fileExists",
	"sap/apf/core/utils/uriGenerator",
	"sap/apf/utils/startParameter",
	"sap/apf/utils/utils",
	"sap/apf/testhelper/helper",
	"sap/apf/testhelper/config/sampleConfiguration",
	"sap/apf/testhelper/doubles/messageHandler",
	"sap/apf/testhelper/interfaces/IfCoreApi",
	"sap/apf/testhelper/interfaces/IfMessageHandler",
	"sap/ui/thirdparty/datajs",
	"sap/ui/thirdparty/jquery",
	'sap/apf/testhelper/mockServer/wrapper',
	'sap/apf/core/constants'
], function(
	MessageObject,
	odataRequestWrapper,
	ResourcePathHandler,
	FileExists,
	uriGenerator,
	StartParameter,
	utils,
	helper,
	sampleConfig,
	MessageHandlerDouble,
	IfCoreApi,
	IfMessageHandler,
	OData,
	jQuery
) {
	'use strict';

	helper.injectURLParameters({
		'sap-apf-configuration-id' : "543EC63F05550175E10000000A445B6D.643EC63F05550175E10000000A445B6D"
	});

	QUnit.module("Load application configuration directly where ActivateLRep is set", {
		beforeEach : function(assert) {
			var that = this;
			that.application = "543EC63F05550175E10000000A445B6D";
			that.configuration = "643EC63F05550175E10000000A445B6D";
			this.originalAjax = jQuery.ajax;
			helper.adjustResourcePaths(this.originalAjax);
			this.oMessageHandler = new MessageHandlerDouble().raiseOnCheck().spyPutMessage();
			this.LrepProxy = function() {
				this.readEntity = function(entitySetName, callback, inputParameters, selectList,  application, layer, directives) {
					var data = {};
					assert.equal(entitySetName, 'configuration', "THEN configuration is read FROM LREP");
					assert.equal(inputParameters[0].value, that.configuration, "THEN correct configuration is requested");
					
					assert.equal(application, that.application, "THEN correct application is supplied");
					data.Application = that.application;
					data.AnalyticalConfiguration = that.configuration;
					data.SerializedAnalyticalConfiguration = JSON.stringify(sampleConfig.getSampleConfiguration());
					data.AnalyticalConfigurationName = "configForTesting";
					assert.equal(directives.noMetadata, true, "THEN directive is set to avoid reading metadata");
					callback(data, {});
				};
				this.readCollection = function(entitySetName, callback, inputParameters, selectList, filter, async) {
					assert.equal(entitySetName, 'texts', "THEN texts are read FROM LREP");
					var aTerms = filter.getFilterTermsForProperty('Application');
					assert.equal(aTerms[0].getValue(), that.application, "THEN application is provided in the filter");
					//supply some texts
					var texts = [ {
						TextElement : "343EC63F05550175E10000000A445B6D",
						Language : "",
						TextElementType : "XLAB",
						TextElementDescription : "uniqueLabelText",
						MaximumLength : 15,
						Application : that.application,
						TranslationHint : "Hint",
						LastChangeUTCDateTime : "/Date(1412690202721)/"
					}, {
						TextElement : "143EC63F05550175E10000000A445B6D",
						Language : "",
						TextElementType : "XTIT",
						TextElementDescription : "TITLE1",
						MaximumLength : 30,
						Application : that.application,
						TranslationHint : "Hint",
						LastChangeUTCDateTime : "/Date(1412692222731)/"
					} ];
					setTimeout(function() {callback(texts, {}); },1);
				};
			};
		},
		afterEach : function(assert) {
			jQuery.ajax = this.originalAjax;
		},
		loadManifestAndResourcePathHandler : function() {
			var manifest;
			var that = this;
			jQuery.ajax({
				url : sap.ui.require.toUrl("sap/apf/testhelper/comp/manifest.json"),
				dataType : "json",
				success : function(oData) {
					manifest = oData;
				},
				error : function(oJqXHR, sStatus, sError) {
					manifest = {};
				},
				async : false
			});

			manifest["sap.apf"].activateLrep = true;
			var baseManifest;
			jQuery.ajax({
				url : sap.ui.require.toUrl("sap/apf/base/manifest.json"),
				dataType : "json",
				success : function(oData) {
					baseManifest = oData;
				},
				error : function(oJqXHR, sStatus, sError) {
					baseManifest = {};
				},
				async : false
			});

			this.coreApi = new IfCoreApi();
			this.coreApi.getXsrfToken = function() {
				return utils.createPromise('otto');
			};
			this.coreApi.getStartParameterFacade = function() {
				var startParameterFacade = new StartParameter({}, {
					manifest : manifest,
					baseManifest : baseManifest
				});
				return startParameterFacade;
			};
			this.coreApi.getUriGenerator = function() {
				return uriGenerator;
			};
			this.coreApi.loadMessageConfiguration = function(conf, bResetRegistry) {
				if (bResetRegistry) {
					that.loadedApfMessageConfiguration = conf;
				} else {
					that.loadedApplicationMessageConfiguration = conf;
				}
			};
			this.coreApi.registerTextWithKey = function(key, text) {};
			this.coreApi.getEntityTypeMetadata = function() {
				return {
					getPropertyMetadata : function() {
						return {};
					}
				};
			};
			this.coreApi.odataRequest = function(oRequest, fnSuccess, fnError, oBatchHandler) {
				var oInject = {
					instances: {
						datajs: OData
					}
				};
				odataRequestWrapper(oInject, oRequest, fnSuccess, fnError, oBatchHandler);
			};
			this.coreApi.loadAnalyticalConfiguration = function(object) {
				that.loadedAnalyticalConfiguration = object;
			};
			this.coreApi.loadTextElements = function(textElements) {
				that.loadedTextElements = textElements;
			};
			var SpyFileExists = function() {
				var fileExists = new FileExists();
				that.headRequests = [];
				this.check = function (sUrl) {
					that.headRequests.push(sUrl);
					return fileExists.check(sUrl);
				};
			};
			this.corePromise = jQuery.Deferred();
			this.oInject = {
				constructors: {
					LayeredRepositoryProxy: this.LrepProxy
				},
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.coreApi,
					fileExists : new SpyFileExists()
				},
				functions : {
					initTextResourceHandlerAsPromise : utils.createPromise,
					isUsingCloudFoundryProxy : function() { return false; }
				},
				manifests : {
					manifest : manifest,
					baseManifest : baseManifest
				},
				corePromise : this.corePromise
			};
			this.resPathHandler = new ResourcePathHandler(this.oInject);
		}
	});
	QUnit.test("WHEN activateLrep is set in Manifest", function(assert) {
		this.loadManifestAndResourcePathHandler();
		var done = assert.async();
		this.corePromise.done(function(){
			assert.equal(this.loadedAnalyticalConfiguration.steps.length, 10, "THEN analytical configuration with 10 steps has been loaded");
			assert.equal(this.loadedAnalyticalConfiguration.steps[0].id, "stepTemplate1", "THEN the first step has expected id");
			this.headRequests.forEach(function(url){
				assert.equal(url.search('/resources/sap/apf/resources/i18n/apfUi.properties'), -1, "no head request on apfUi.properties");
				assert.equal(url.search('/resources/config/sampleConfiguration.json'), -1, "no head request on sample configuration");
			});
			done();
		}.bind(this));
		
	});
});
