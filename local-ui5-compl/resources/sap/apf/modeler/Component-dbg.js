/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/apf/modeler/core/instance",
	"sap/m/routing/RouteMatchedHandler",
	"sap/apf/modeler/ui/utils/APFRouter",
	"sap/apf/modeler/ui/utils/constants",
	"sap/apf/modeler/ui/utils/APFTree",
	"sap/apf/core/layeredRepositoryProxy",
	"sap/apf/core/constants",
	"sap/base/util/deepExtend",
	"sap/ui/core/mvc/ViewType",
	"sap/ui/dom/includeStylesheet"
], function(
	UIComponent,
	Instance,
	RouteMatchedHandler,
	APFRouter,
	constants,
	APFTree,
	layeredRepositoryProxy,
	coreConstants,
	deepExtend,
	ViewType,
	includeStylesheet
) {
	'use strict';

	/**
	 * @class
	 * @name sap.apf.modeler.Component
	 */
	var component = UIComponent.extend("sap.apf.modeler.Component", /** @lends sap.apf.modeler.Component.prototype */ {
		oCoreApi : null,
		metadata : {
			"manifest" : "json",
			"library" : "sap.apf"
		},
		/**
		 * Initialize the Component instance after creation.
		 * 
		 * The component, that extends this component should call this method.
		 *
		 * @private
		 * @returns {undefined} no returning value
		 */
		init : function() {
			//check datasource from manifest, whether there are other settings
			//for backward compatibility 1.28 fiori v1.0
			var persistenceServiceRoot, catalogServiceRoot;
			var targetForNavigation;
			if (this.initHasAlreadyBeenCalled) {
				return;
			}
			this.initHasAlreadyBeenCalled = true;
			var manifest = deepExtend({}, this.getManifest());
			var baseManifest = component.prototype.getMetadata()._getManifest();

			if (manifest["sap.app"].crossNavigation && manifest["sap.app"].crossNavigation.outbounds && manifest["sap.app"].crossNavigation.outbounds.navigateToGenericRuntime) {
				targetForNavigation = manifest["sap.app"].crossNavigation.outbounds.navigateToGenericRuntime;
			}
			if (manifest["sap.app"].dataSources && manifest["sap.app"].dataSources.AnalyticalConfigurationServiceRoot) {
				persistenceServiceRoot = manifest["sap.app"].dataSources.AnalyticalConfigurationServiceRoot.uri;
			} else {
				persistenceServiceRoot = coreConstants.modelerPersistenceServiceRoot;
			}
			var persistenceConfiguration = {
				serviceRoot : persistenceServiceRoot
			};
			var inject = this.getInjections();
			inject.instances = inject.instances || {};
			inject.instances.component = this;

			inject.functions =  inject.functions || {};
			if (targetForNavigation) {
				inject.functions.getNavigationTargetForGenericRuntime = function() {
					return targetForNavigation;
				};
			} else {
				inject.functions.getNavigationTargetForGenericRuntime = function() {
					if (manifest['sap.app'] && manifest['sap.app'].id === 'fnd.apf.dts1') {
						return {
							semanticObject : "FioriApplication",
							action : 'executeAPFConfigurationS4HANA'
						};
					}
					return {
						semanticObject : "FioriApplication",
						action : 'executeAPFConfiguration'
					};
				};
			}
			if (manifest["sap.app"].dataSources && manifest["sap.app"].dataSources.GatewayCatalogService) {
				catalogServiceRoot = manifest["sap.app"].dataSources.GatewayCatalogService.uri;
			} else if (baseManifest["sap.app"].dataSources && baseManifest["sap.app"].dataSources.GatewayCatalogService) {
				catalogServiceRoot = baseManifest["sap.app"].dataSources.GatewayCatalogService.uri;
			}
			inject.functions.getCatalogServiceUri = function() {
				return catalogServiceRoot;
			};
			this.oCoreApi = new (inject.constructors && inject.constructors.Instance || Instance)(persistenceConfiguration, inject);
			var apfLocation = this.oCoreApi.getUriGenerator().getApfLocation();
			includeStylesheet(apfLocation + "modeler/resources/css/configModeler.css", "configModelerCss");
			UIComponent.prototype.init.apply(this, arguments);
			//initialize the router
			this.getRouter().initialize();
			//register the UI callback for message handling 
			var oMessageHandlerView = sap.ui.view({
				viewName : "sap.apf.modeler.ui.view.messageHandler",
				type : ViewType.XML,
				viewData : this.oCoreApi
			});
			var fnCallbackMessageHandling = oMessageHandlerView.getController().showMessage;
			this.oCoreApi.setCallbackForMessageHandling(fnCallbackMessageHandling.bind(oMessageHandlerView.getController()));
		},
		/**
		 * Creates the content of the component. A component, that extends this component should call this method.
		 *
		 * @private
		 * @returns {sap.ui.core.Control} the content
		 */
		createContent : function() {
			var applicationListView = sap.ui.view({
				viewName : "sap.apf.modeler.ui.view.applicationList",
				type : ViewType.XML,
				viewData : this.oCoreApi
			});
			this.oCoreApi.getUriGenerator().getApfLocation();
			return applicationListView;
		}
		,
		/**
		 * This function can be implemented by an extending Component.js.
		 * This is intended for the demokit to inject specific logic without changing the code
		 *
		 * @public
		 * @experimental NOT FOR PRODUCTION USE
		 * @since 1.46.0
		 * @returns {object} Object containing optional injects and exits
		 * @returns {object.exits} Exit functions
		 * @returns {object.exits.getRuntimeUrl} function the gets (applicationId, configurationId) as parameter. Should return an url that is used for the 'execute' functionality in modeler.
		 */
		getInjections : function() {
			return {
				instances: {},
				exits: {}
			};
		}
	});

	return component;
}, true);