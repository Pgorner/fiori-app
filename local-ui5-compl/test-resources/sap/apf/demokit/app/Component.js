sap.ui.define([
	"sap/apf/base/Component",
	'sap/apf/demokit/app/helper/contextMediator',
	'sap/apf/demokit/app/helper/formatter',
	'sap/apf/demokit/app/model/initializeMockServer',
	"sap/ui/core/mvc/ViewType",
	"sap/ui/dom/includeStylesheet",
	'sap/apf/demokit/app/helper/preselectionFunction',
	'sap/apf/demokit/app/representation/stackedBarChart'
], function(
	ApfComponent,
	ContextMediator,
	formatter,
	initializeMockServer,
	ViewType,
	includeStylesheet
) {
	"use strict";

	return ApfComponent.extend("sap.apf.demokit.app.Component", {
		oApi : null,
		metadata : {
			"manifest": "json",
			"config" : {
				"fullWidth" : true
			},
			"name" : "Component",
			"version" : "1.3.0",
			"dependencies" : {
				"libs" : [ "sap.m", "sap.ui.layout", "sap.ui.comp"]
			}
		},
		/**
		 * Initialize the application
		 * 
		 * @returns {sap.ui.core.Control} the content
		 */
		init : function() {
			// Load application css file
			var cssPath = sap.ui.require.toUrl('sap/apf/demokit/app/resources/css/app.css');
			includeStylesheet(cssPath);

			this.oComponentData = {};
			this.oComponentData.startupParameters = {
				"evaluationId" : [ "com.sap.apf.receivables.america" ]
			};
			var oMockServerHelper = initializeMockServer.getInstance();
			oMockServerHelper.startApplicationMockServer();
			oMockServerHelper.startPersistencyMockServer();
			oMockServerHelper.startSmartBusinessMockServer();
			oMockServerHelper.startApplicationAnnotationMockServer();
			oMockServerHelper.startPersistencyAnnotationMockServer();
			ApfComponent.prototype.init.apply(this, arguments);
		},
		/**
		 * Creates the application layout and returns the outer layout of APF 
		 * @returns
		 */
		createContent : function() {
			this.oApi = this.getApi();	 
			// Calling parent Component's createContent method.
			var appLayout = ApfComponent.prototype.createContent.apply(this, arguments);
			try {
				var exchangeRateContent = sap.ui.view({
					viewName : "sap.apf.demokit.app.controls.view.exchangeRate",
					type : ViewType.JS,
					viewData : {
						oApi : this.oApi
					},
					width : "70%"
				});
				var currencyContent = sap.ui.view({
					viewName : "sap.apf.demokit.app.controls.view.reportingCurrency",
					type : ViewType.JS,
					viewData : {
						oApi : this.oApi
					}
				});
				
				this.oApi.addMasterFooterContent(currencyContent);
				this.oApi.addMasterFooterContent(exchangeRateContent);
				formatter.getInstance(this.oApi);
			} catch(e) {
				 // continue regardless of error
			}
			return appLayout;
		},
		destroy : function() {
			ContextMediator.destroyInstance();
			formatter.destroyInstance();
			initializeMockServer.destroyInstance();
			ApfComponent.prototype.destroy.apply(this, arguments);
		}
	});
});
