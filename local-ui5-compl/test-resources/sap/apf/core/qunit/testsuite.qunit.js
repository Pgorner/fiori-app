sap.ui.define([], function() {
	"use strict";

	return {
		name: "APF TestSuite",
		defaults: {
			loader: {
				paths: {
					"sap/apf/integration": "test-resources/sap/apf/integration/",
					"sap/apf/testhelper": "test-resources/sap/apf/testhelper/"
				}
			},
			qunit: {
				version: 2
			},
			sinon: {
				version: 1,
				qunitBridge: true,
				useFakeTimer: false
			},
			bootCore: true,
			module: "test-resources/sap/apf/{name}.qunit",
			page: "test-resources/sap/apf/{name}.qunit.html"
		},
		tests: {
			"base/tComponent": {
				title: "Base Component",
				ui5: {
					libs: "sap.m,sap.suite.ui.commons"
				}
			},
			"core/tAjax": {
				title: "Ajax test on local resources",
				sinon: {
					version: 4
				}
			},
			"core/tBinding": {
				title: "Binding"
			},
			"core/tClosure": {
				title: "Principal Closure Tests"
			},
			"core/tConfigurationFactory": {
				title: "ConfigurationFactory"
			},
			"core/tConfigurationFactoryNoDoubles": {
				title: "ConfigurationFactory W/O Test Doubles"
			},
			"core/tEntityTypeMetadata": {
				title: "Entity Type Metadata<"
			},
			"core/tHierarchicalStep": {
				title: "HierarchicalStep"
			},
			"core/tInstance": {
				title: "Core Instance"
			},
			"core/tInterfaces": {
				title: "Interfaces method compatibility"
			},
			"core/tLayeredRepositoryProxy": {
				title: "Layered Repository Proxy"
			},
			"core/tMessageHandler": {
				title: "Message Handler"
			},
			"core/tMessageHandlerLogging": {
				skip: true, // test is broken, see comments in JS file
				title: "Special Error Tests"
			},
			"core/tMessageHandlerWithThrow": {
				title: "Message Handler with Throw"
			},
			"core/tMessageObject": {
				title: "Message Object"	
			},
			"core/tMetadata": {
				title: "Metadata with server double"
			},
			"core/tMetadataFacade": {
				title: "MetadataFacade"
			},
			"core/tMetadataFactory": {
				title: "Metadata factory"
			},
			"core/tMetadataProperty": {
				title: "MetadataProperty"
			},
			"core/tOdataProxy": {
				title: "OData Proxy"
			},
			"core/tODataRequest": {
				title: "ODataRequest with local resources"
			},
			"core/tPath": {
				title: "Path"
			},
			"core/tPathUpdate": {
				title: "Path Update"
			},
			"core/tPersistence": {
				title: "Persistence"
			},
			"core/tReadRequestByRequiredFilterWithDouble": {
				title: "ReadRequestByRequiredFilter"
			},
			"core/tReadRequestWithDouble": {
				title: "ReadRequest"
			},
			"core/tRequest": {
				title: "Request"
			},
			"core/tRequestUriGenerator": {
				title: "Combination Request URI Generator"
			},
			"core/tResourcePathHandler": {
				title: "ResourcePathHandler"
			},
			"core/tResourcePathHandlerWithCFProxy": {
				title: "ResourcePathHandler with Cloud Foundry Proxy"
			},
			"core/tResourcePathHandlerWithLRep": {
				title: "ResourcePathHandler with Layered Repository Access"
			},
			"core/tSessionHandler": {
				title: "SessionHandler"
			},
			"core/tStep": {
				title: "Step"
			},
			"core/tTextResourceHandler": {
				title: "Text Resource Handler"
			},

			"core/utils/tAnnotationHandler": {
				title: "Annotation Handler"
			},
			"core/utils/tAreRequestOptionsEqual": {
				title: "Check on Equality for Request Options"
			},
			"core/utils/tCheckForTimeout": {
				title: "CheckForTimeout"
			},
			"core/utils/tFileExists": {
				title: "File Exists"
			},
			"core/utils/tFilter": {
				title: "Filter"
			},
			"core/utils/tFilterSimplify": {
				title: "Filter Simplify"
			},
			"core/utils/tFilterTerm": {
				title: "FilterTerm"
			},
			"core/utils/tUriGenerator": {
				title: "URI Generator"
			},

			"cloudFoundry/tAnalysisPathProxy": {
				title: "Cloud Foundry Proxy for Analysis Pathes"
			},
			"cloudFoundry/tModelerProxy": {
				title: "Modeler Proxy",
				ui5: {
					libs: "sap.m,sap.ui.layout"
				}
			},
			"cloudFoundry/tModelerProxyVendorImport": {
				title: "Cloud Foundry Proxy for Import of Analytical Configuration",
				ui5: {
					
				}
			},
			"cloudFoundry/tRuntimeProxy": {
				title: "Cloud Foundry Runtime Proxy for Analytical Configuration"
			},
			"cloudFoundry/tUiHandler": {
				title: "Cloud Foundry UI - UI Handler"
			},
			"cloudFoundry/tUtils": {
				action: "Cloud Foundry Utils"
			},

			"utils/tExecuteFilterMapping": {
				title: "FilterMapping",
				ui5: {
					libs: "sap.m,sap.ui.layout"	
				}
			},
			"utils/tExternalContext": {
				title: "External Context",
				ui5: {
					libs: "sap.m,sap.ui.layout"
				}
			},
			"utils/tFilter": {
				title: "FilterFacade"
			},
			"utils/tFilterIdHandler": {
				title: "Filter ID Handler"
			},
			"utils/tHashtable": {
				title: "Hashtable"
			},
			"utils/tNavigationHandler": {
				title: "Navigation Handler"
			},
			"utils/tProxyTextHandlerForLocalTexts": {
				title: "proxyTextHandlerForLocalTexts"
			},
			"utils/tSbAdapter": {
				title: "SmartBusiness adapter"
			},
			"utils/tSerializationMediator": {
				title: "Serialization Mediator"
			},
			"utils/tStartFilter": {
				title: "Start Filter"
			},
			"utils/tStartFilterHandler": {
				title: "Start Filter Handler"
			},
			"utils/tStartFilterHandlerAsync": {
				title: "Start Filter Handler Async"
			},
			"utils/tStartFilterPropagation": {
				title: "Start Filter Propagation"
			},
			"utils/tStartParameter": {
				title: "Start Parameter"
			},
			"utils/tUtils": {
				title: "sap.apf.utils.tUtils",
				libs: "sap.m,sap.ui.layout"
			},

			"tApf": {
				title: "Analysis Path Framework API",
				ui5: {
					libs: "sap.m, sap.viz, sap.ui.table"
				}
			},
			"tApi": {
				title: "API",
				ui5: {
					libs: "sap.m, sap.viz, sap.ui.table"
				}
			}
		}
	};
});
