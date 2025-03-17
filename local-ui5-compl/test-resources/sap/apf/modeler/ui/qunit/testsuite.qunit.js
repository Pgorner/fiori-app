sap.ui.define(function() {
	"use strict";

	return {
		name: "apf.modeler TestSuite",
		defaults: {
			loader: {
				paths: {
					"sap/apf/integration": "test-resources/sap/apf/integration/",
					"sap/apf/testhelper": "test-resources/sap/apf/testhelper/",
					"sap/apf/internal/server": "test-resources/sap/apf/internal/server/"
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
			ui5: {
				libs: "sap.m"
			},
			bootCore: true,
			module: "test-resources/sap/apf/modeler/ui/{name}.qunit",
			page: "test-resources/sap/apf/modeler/ui/{name}.qunit.html"
		},
		tests: {
			"tApplicationList": {
				title: "Application List Unit Test"
			},
			"tCatalogService": {
				title: "Catalog Service Unit Test"
			},
			"tCategory": {
				title: "Category Unit Test"
			},
			"tConfiguration": {
				title: "Configuration - Modeler Unit Test"
			},
			"tConfigurationList": {
				title: "Configuration List Unit Test"
			},
			"tEditApplication": {
				title: "Edit Application Modeler Unit Test"
			},
			"tFacetFilter": {
				title: "Facet Filter Modeler Unit Test"
			},
			"tFacetFilterFRR": {
				title: "Facet Filter FRR Unit Tests"
			},
			"tFacetFilterVHR": {
				title: "Facet Filter VHR Unit Tests"
			},
			"tHierarchicalStepRequest": {
				title: "Hierarchical Step Request Unit Tests"
			},
			"tImportDeliveredContent": {
				title: "Import Delivered Content Unit Tests"
			},
			"tImportDeliveredContent2": {
				title: "Import Delivered Content Unit Tests"
			},
			"tImportFiles": {
				title: "Import Files Unit Tests"
			},
			"tMessageHandler": {
				title: "Modeler Message Handler Unit Tests"
			},
			"tNavigationTarget": {
				title: "Navigation Target Unit Test"
			},
			"tNavigationTargetParameter": {
				title: "Navigation Target Parameters"
			},
			"tNavTargetContextMapping": {
				title: "Navigation Target Context Mapping Unit Tests"
			},
			"tNewApplication": {
				title: "Add New Application Modeler Unit Test"
			},
			"tPreviewContent": {
				title: "Preview Content",
				ui5: {
					libs: "sap.m,sap.viz,sap.ui.layout,sap.ui.table"
				}
			},
			"tPropertyType": {
				title: "PropertyType",
				ui5: {
					libs: "sap.m,sap.viz,sap.ui.layout"
				}
			},
			"tPropertyTypeHandler": {
				title: "PropertyTypeHandler",
				ui5: {
					libs: "sap.m,sap.viz,sap.ui.layout"
				}
			},
			"tRepresentation": {
				title: "Representation View/Controller",
				ui5: {
					libs: "sap.m,sap.viz,sap.ui.layout"
				}
			},
			"tRepresentationCornerTexts": {
				title: "Representation CornerTexts Unit Tests"
			},
			"tRepresentationDimension": {
				title: "Representation Dimension Unit Tests",
				ui5: {
					libs: "sap.m,sap.viz,sap.ui.layout"
				}
			},
			"tRepresentationHierarchicalProperty": {
				title: "Representation Hierarchical Property Unit Tests"
			},
			"tRepresentationLegend": {
				title: "Representation Legend Unit Tests"
			},
			"tRepresentationMeasure": {
				title: "Representation Measure Unit Tests"
			},
			"tRepresentationProperty": {
				title: "Representation Property Unit Tests"
			},
			"tRepresentationSortProperty": {
				title: "Representation Sort Property Unit Tests"
			},
			"tRequestOptions": {
				title: "Request Options Unit Tests"
			},
			"tSmartFilterBar": {
				title: "Smart Filter Bar Unit Test"
			},
			"tSmartFilterBarRequest": {
				title: "Smart Filter Bar Request Unit Test"
			},
			"tSortPropertyType": {
				title: "SortPropertyType Test",
				ui5: {
					libs: "sap.m,sap.ui.layout"
				}
			},
			"tStep": {
				title: "Step Modeler Unit Test"
			},
			"tStepCornerTexts": {
				title: "Step CornerTexts Unit Tests",
				ui5: {
					libs: "sap.m,sap.viz,sap.ui.layout"
				}
			},
			"tStepFilterMapping": {
				title: "Step Filter Mapping Unit Tests",
				ui5: {
					libs: "sap.m,sap.viz,sap.ui.layout"
				}
			},
			"tStepRequest": {
				title: "Step Request fields Unit Tests",
				ui5: {
					libs: "sap.m,sap.viz,sap.ui.layout"
				}
			},
			"tStepSortProperty": {
				title: "Step Sort Property Unit Tests"
			},
			"tTitleAndBreadCrumb": {
				title: "Title And BreadCrumb Unit Test"
			},
			"tToolbar": {
				title: "Toolbar Unit Test"
			},


			"utils/tAPFTree": {
				title: "APF Tree - Unit Tests"
			},
			"utils/tDisplayOptionsValueBuilder": {
				// skipped as test was not listed in the original testsuite and has errors
				skip: true,
				title: "Display options Builder - Unit Tests"
			},
			"utils/tLabelForRepresentationTypes": {
				title: "Label for representation type - Unit Tests"
			},
			"utils/tNavigationHandler": {
				title: "Navigation Handler Unit Test"
			},
			"utils/tNullObjectChecker": {
				title: "NullObjectChecker - Unit Tests"
			},
			"utils/tOptionsValueModelBuilder": {
				title: "Options Value Model Builder - Unit Tests"
			},
			"utils/tPropertyTypeFactory": {
				title: "Property Type Factory- Unit Tests"
			},
			"utils/tPropertyTypeOrchestration": {
				title: "PropertyTypeOrchestration",
				ui5: {
					libs: "sap.m,sap.ui.layout"
				}
			},
			"utils/tPropertyTypeState": {
				title: "Property Type State- Unit Tests"
			},
			"utils/tRepresentationBasicDataHandler": {
				title: "Representation Basic Data Handler - Unit Tests"
			},
			"utils/tRepresentationHandler": {
				title: "Representation Handler Unit Tests"
			},
			"utils/tSortDataHandler": {
				title: "Sort Data Handler - Unit Tests"
			},
			"utils/tStaticValuesBuilder": {
				title: "Static Value Model Builder - Unit Tests"
			},
			"utils/tStepPropertyMetadataHandler": {
				title: "Step Property Metadata Handler - Unit Tests"
			},
			"utils/tTextManipulator": {
				title: "Text Manipulator - Unit Tests"
			},
			"utils/tTextPoolHelper": {
				// skipped as test was not listed in the origina ltestsuite and it has 0 tests
				skip: true,
				title: "Text Pool Helper - Unit Tests"
			},
			"utils/tTreeTableDisplayOptionsValueBuilder": {
				title: "Tree table display options value Builder - Unit Tests"
			},
			"utils/tViewValidator": {
				title: "View Validator - Unit Tests"
			}
		}
	};
});
