sap.ui.define(["sap/ui/Device"], function (Device) {
	"use strict";
	var bIsIE = Device.browser.msie;
	return {
		name: "QUnit TestSuite for sap.suite.ui.generic.template",
		defaults: {
			qunit: {
				version: 2
			},
			ui5: {
				noConflict: true,
				theme: "sap_fiori_3",
				language: "en",
				libs: ["sap.m", "sap.ui.layout", "sap.ui.comp", "sap.ui.generic.app", "sap.ui.rta"],
				"xx-waitForTheme": true,
				resourceRoots: {
					"sap/suite/ui/generic/template/integration": "test-resources/sap/suite/ui/generic/template/integration",
					"sap/suite/ui/generic/template/demokit": "test-resources/sap/suite/ui/generic/template/demokit",
					"testUtils": "test-resources/sap/suite/ui/generic/template/qunit",
					"utils": "test-resources/sap/suite/ui/generic/template/utils"
				}
			},
			sinon: {
				version: 1
			},
			loader: {
				paths: {
					tests: "test-resources/sap/suite/ui/generic/template/qunit",
					qunit: "test-resources/sap/suite/ui/generic/template/qunit"
				}
			}
			//bootCore: true
		},
		tests: {
			"ReuseComponentSupportTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/extensionAPI/ReuseComponentSupportTest",
				title: "QUnit: /lib/extensionAPI/ReuseComponentSupportTest",
				group: "qunit @/extensionAPI"
			},
			"ExtensionAPINavigationControllerTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/extensionAPI/NavigationControllerTest",
				title: "QUnit: /lib/extensionAPI/NavigationController",
				group: "qunit @/extensionAPI"
			},
			"AjaxHelperTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/genericUtilities/AjaxHelperTest",
				title: "QUnit: /genericUtilities/AjaxHelperTest",
				group: "qunit @/genericUtilities"
			},
			"controlStateWrapperFactoryTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/genericUtilities/ControlStateWrapperFactoryTest",
				title: "QUnit: /genericUtilities/controlStateWrapperFactoryTest",
				group: "qunit @/genericUtilities"
			},
			"FeLoggerTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/genericUtilities/FeLoggerTest",
				title: "QUnit: /genericUtilities/FeLogger Test",
				group: "qunit @/lib"
			},
			"expressionHelperTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/genericUtilities/expressionHelperTest",
				title: "QUnit: /genericUtilities/expressionHelper Test",
				group: "qunit @/lib"
			},
			"filterHelperTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/genericUtilities/filterHelperTest",
				title: "QUnit: /genericUtilities/filterHelper Test",
				group: "qunit @/lib"
			},
			"jsonHelperTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/genericUtilities/jsonHelperTest",
				title: "QUnit: /genericUtilities/jsonHelper Test",
				group: "qunit @/lib"
			},
			"metadataAnalyser": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/genericUtilities/metadataAnalyserTest",
				title: "QUnit: /genericUtilities/metadataAnalyserTest",
				group: "qunit @/lib"
			},
			"oDataModelHelper": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/genericUtilities/oDataModelHelperTest",
				title: "QUnit: /genericUtilities/oDataModelHelper Test",
				group: "qunit @/lib"
			},
			"utils": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/genericUtilities/utilsTest",
				title: "QUnit: /genericUtilities/utils Test",
				group: "qunit @/lib"
			},
			"SmartVariantManagementWrapperTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/genericUtilities/controlStateWrapperFactory/SmartVariantManagementWrapperTest",
				title: "QUnit: /genericUtilities/controlStateWrapperFactory/SmartVariantManagementWrapperTest",
				group: "qunit @/genericUtilities"
			},
			"SmartTableChartCommonTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/genericUtilities/controlStateWrapperFactory/SmartTableChartCommonTest",
				title: "QUnit: /genericUtilities/controlStateWrapperFactory/SmartTableChartCommonTest",
				group: "qunit @/genericUtilities"
			},
			"listUtilsTests": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/listTemplates/listUtilsTests",
				title: "QUnit: /listTemplates/listUtils.qunit",
				group: "qunit @/listTemplates"
			},
			"SemanticDateRangeTypeHelperTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/listTemplates/semanticDateRangeTypeHelperTests",
				title: "QUnit: /listTemplates/semanticDateRangeTypeHelper.qunit",
				group: "qunit @/listTemplates"
			},
			"FilterSettingsPreparationHelperTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/listTemplates/filterSettingsPreparationHelperTests",
				title: "QUnit: /listTemplates/filterSettingsPreparationHelperTests.qunit",
				group: "qunit @/listTemplates"
			},
			"AnnotationHelperTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/js/AnnotationHelper.qunit",
				title: "QUnit: Annotation Helper",
				group: "qunit @/js",
				ui5: {
					resourceRoots: {
						"tests": "test-resources/sap/suite/ui/generic/template/qunit/js"
					}
				}
			},
			"AnnotationHelperHiddenTermSupportTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/js/AnnotationHelperHiddenTermSupportTest",
				title: "QUnit: AnnotationHelperHiddenTermSupportTest",
				group: "qunit @/js"
			},
			"AnnotationHelperStreamSupportTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/js/AnnotationHelperStreamSupportTest",
				title: "QUnit: Annotation Helper Stream Support",
				group: "qunit @/js"
			},
			"PreparationHelperTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/js/preparationHelperTest",
				title: "QUnit: PreparationHelperTest",
				group: "qunit @/js"
			},
			"RuntimeFormattersTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/js/RuntimeFormattersTest",
				title: "QUnit: RuntimeFormattersTest",
				group: "qunit @/js"
			},
			"ObjectPageTemplateSpecificPreparationHelperTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/ObjectPage/templateSpecificPreparationHelperTest",
				title: "QUnit: ObjectPageTemplateSpecificPreparationHelperTest",
				group: "qunit @/ObjectPage"
			},
			"ExtensionPointTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/ExtensionPointTest",
				title: "QUnit: /lib/ExtensionPointTest",
				group: "qunit @/lib"
			},
			"InsightsCardHelperTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/insights/InsightsCardHelperTest",
				title: "QUnit: /lib/insights/InsightsCardHelperTest",
				group: "qunit @/lib"
			},
			"EasyFilterBarHandlerTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/ai/EasyFilterBarHandlerTest",
				title: "QUnit: /lib/ai/EasyFilterBarHandlerTest",
				group: "qunit @/lib"
			},
			"AppComponentTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/AppComponentTest",
				title: "QUnit: /lib/AppComponentTest",
				group: "qunit @/lib"
			},
			"AdaptiveCardHelperTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/AdaptiveCardHelperTest",
				title: "QUnit: /lib/AdaptiveCardHelperTest",
				group: "qunit @/lib",
				qunit: {
					version: 1
				}
			},
			"ApplicationTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/ApplicationTest",
				title: "QUnit: /lib/ApplicationTest",
				group: "qunit @/lib"
			},
			"CRUDActionHandlerTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/CRUDActionHandlerTest",
				title: "QUnit: /lib/CRUDActionHandlerTest",
				group: "qunit @/lib"
			},
			"BusyHelperTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/BusyHelperTest",
				title: "QUnit: /lib/BusyHelperTest",
				group: "qunit @/lib"
			},
			"CommonEventHandlersTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/CommonEventHandlersTest",
				title: "QUnit: /lib/CommonEventHandlersTest",
				group: "qunit @/lib"
			},
			"CommonUtilsTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/CommonUtilsTest.qunit",
				title: "QUnit: /lib/CommonUtilsTest",
				group: "qunit @/lib"
			},
			"ComponentUtilsTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/ComponentUtilsTest.qunit",
				title: "QUnit: /lib/ComponentUtilsTest",
				group: "qunit @/lib"
			},
			"CommandComponentUtilsTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/CommandComponentUtilsTest",
				title: "QUnit: /lib/CommandComponentUtilsTest",
				group: "qunit @/lib"
			},
			"CRUDHelperTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/CRUDHelperTest",
				title: "QUnit: /CRUDHelper",
				group: "qunit @/lib"
			},
			"CRUDManagerTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/CRUDManager.qunit",
				title: "QUnit: /CRUDManager",
				group: "qunit @/lib"
			},
			"FlexibleColumnLayoutHandlerTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/FlexibleColumnLayoutHandlerTest",
				title: "QUnit: /lib/FlexibleColumnLayoutHandlerTest",
				group: "qunit @/lib"
			},
			"FlexibleColumnLayoutHelperTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/FlexibleColumnLayoutHelperTest",
				title: "QUnit: /lib/FlexibleColumnLayoutHelperTest",
				group: "qunit @/lib"
			},
			"MessageUtilsTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/MessageUtilsTest",
				title: "QUnit: /lib/MessageUtilsTest",
				group: "qunit @/lib"
			},
			"StatePreserverTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/StatePreserverTest",
				title: "QUnit: /lib/StatePreserverTest",
				group: "qunit @/lib"
			},
			"TemplateComponent": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/TemplateComponent.qunit",
				title: "QUnit: TemplateComponent",
				group: "qunit @/lib"
			},
			"ViewDependencyHelperTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/ViewDependencyHelperTest",
				title: "QUnit: /lib/ViewDependencyHelperTest",
				group: "qunit @/lib"
			},
			"KeepAliveHelperTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/KeepAliveHelperTest",
				title: "QUnit: /lib/KeepAliveHelperTest",
				group: "qunit @/lib"
			},
			"ShareUtilsTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/ShareUtilsTest",
				title: "QUnit: lib/ShareUtils Test",
				group: "qunit @/lib"
			},
			"ShellPersonalizationServiceTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/ShellPersonalizationServiceTest",
				title: "QUnit: /lib/ShellPersonalizationServiceTest",
				group: "qunit @/lib"
			},
			"SideEffectUtilTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/SideEffectUtilTest",
				title: "QUnit: lib/SideEffectUtilTest Test",
				group: "qunit @/lib"
			},
			"ContextMenuHandlerTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/ContextMenuHandlerTest",
				title: "QUnit: lib/ContextMenuHandlerTest Test",
				group: "qunit @/lib",
				qunit: {
					version: 1
				}
			},
			"NavigationControllerTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/navigation/NavigationControllerTest",
				title: "QUnit: /lib/navigation/NavigationControllerTest",
				group: "qunit @/lib"
			},
			"RoutingHelperTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/navigation/routingHelperTest",
				title: "QUnit: /lib/navigation/routingHelperTest",
				group: "qunit @/lib"
			},
			"StartupParameterHelperTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/navigation/startupParameterHelperTest",
				title: "QUnit: /lib/navigation/startupParameterTest",
				group: "qunit @/lib"
			},
			"SmartTableHandlerTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/presentationControl/SmartTableHandlerTest",
				title: "QUnit: /lib/presentationControl/SmartTableHandlerTest",
				group: "qunit @/lib"
			},
			"MultipleTablesModeHelperTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/multipleViews/MultipleTablesModeHelperTest",
				title: "QUnit: /lib/multipleViews/MultipleTablesModeHelperTest",
				group: "qunit @/lib"
			},
			"SmartTableDesigntimeTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/designtime/SmartTableDesigntimeTest",
				title: "QUnit: SmartTableDesigntimeTest",
				group: "qunit @/designtime"
			},
			"DynamicPageDesigntimeTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/designtime/DynamicPageDesigntimeTest",
				title: "QUnit: DynamicPageDesigntimeTest",
				group: "qunit @/designtime"
			},
			"designtime/designtimeUtilsTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/designtime/utils/designtimeUtilsTest",
				title: "QUnit: designtime/designtimeUtilsTest",
				group: "qunit @/designtime"
			},
			"ExampleTest": {
				module: "test-resources/sap/suite/ui/generic/template/internal/exampleTest",
				title: "MQUnit: Example",
				group: "qunit @/internal"
			},
			/* "21_MockServerTest": {
				module: "test-resources/sap/suite/ui/generic/template/internal/demokitErrTest",
				title: "MockServer Smoke Tests"
			},*/
			"MockFuctionTests": {
				module: "test-resources/sap/suite/ui/generic/template/internal/mockFunctionsTest",
				title: "QUnit: mockFunctionsTest",
				group: "qunit @/internal",
				ui5: {
					resourceRoots: {
						"tests": "test-resources/sap/suite/ui/generic/template/internal",
						"demokits": "test-resources/sap/suite/ui/generic/template/demokit"
					}
				}
			},
			"ListReportControllerImplementationTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/ListReport/controller/ControllerImplementationTest",
				title: "QUnit: ListReport/controller/ControllerImplementationTest",
				group: "qunit @/ListReport/controller"
			},
			"IappStateHandlerTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/ListReport/controller/IappStateHandlerTest",
				title: "QUnit: ListReport/controller/IappStateHandlerTest",
				group: "qunit @/ListReport/controller"
			},
			"LegacyStateHandlerTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/ListReport/controller/LegacyStateHandlerTest",
				title: "QUnit: ListReport/controller/LegacyStateHandlerTest",
				group: "qunit @/ListReport/controller"
			},
			"MultipleViewsHandlerTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/ListReport/controller/MultipleViewsHandlerTest",
				title: "QUnit: ListReport/controller/MultipleViewsHandlerTest",
				group: "qunit @/ListReport/controller"
			},
			"MultiEditHandlerTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/ListReport/controller/MultiEditHandlerTest",
				title: "QUnit: ListReport/controller/MultiEditHandlerTest",
				group: "qunit @/ListReport/controller"
			},
			"ComponentTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/ListReport/ComponentTests",
				title: "QUnit: /ListReport/Component.qunit",
				group: "qunit @/ListReport"
			},
			"NonDraftTransactionControllerTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/ListReport/extensionAPI/NonDraftTransactionControllerTest",
				title: "QUnit: /ListReport/extensionAPI/NonDraftTransactionControllerTest",
				group: "qunit @/ListReport/extensionAPI"
			},
			"ExtensionAPITest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/ListReport/extensionAPI/ExtensionAPITest",
				title: "QUnit: /ListReport/extensionAPI/ExtensionAPITest",
				group: "qunit @/ListReport/extensionAPI"
			},
			"AnnotationHelperSmartChartTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/ListReport/AnnotationHelper-SmartChart",
				title: "QUnit: ListReport/AnnotationHelper Test",
				group: "qunit @/ListReport"
			},
			"AnnotationHelperSmartListTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/ListReport/AnnotationHelperSmartListTest",
				title: "QUnit: ListReport/AnnotationHelper Test",
				group: "qunit @/ListReport"
			},
			"ListReportAnnotationHelper": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/ListReport/AnnotationHelper",
				title: "QUnit: ListReport/AnnotationHelper Test",
				group: "qunit @/ListReport"
			},
			"CreateWithDialogHandlerTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/CreateWithDialogHandlerTest",
				title: "QUnit: lib/CreateWithDialogHandlerTest",
				group: "qunit @/lib"
			},
			"RetryAfterHandlerTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/RetryAfterHandlerTest",
				title: "QUnit: lib/RetryAfterHandlerTest",
				group: "qunit @/lib"
			},
			"deletionHelperTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/deletionHelperTest",
				title: "QUnit: lib/deletionHelperTest",
				group: "qunit @/lib"
			},	
			"ContextBookkeepingTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/ContextBookkeepingTest",
				title: "QUnit: lib/ContextBookkeepingTest",
				group: "qunit @/lib"
			},
			"AddNewObjectPageTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/manifestMerger/AddNewObjectPageTest",
				title: "QUnit: /manifestMerger/AddNewObjectPageTest",
				group: "qunit @/manifestMerger"
			},
			"ChangePageConfigurationTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/manifestMerger/ChangePageConfigurationTest",
				title: "QUnit: /manifestMerger/ChangePageConfigurationTest",
				group: "qunit @/manifestMerger"
			},
			"AnnotationHelperActionButtonsTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/ObjectPage/annotationHelpers/AnnotationHelperActionButtonsTest",
				title: "QUnit: /ObjectPage/annotationHelpers/AnnotationHelperActionButtonsTest",
				group: "qunit @/ObjectPage/annotationHelpers"
			},
			"AnnotationHelperSideContentTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/ObjectPage/annotationHelpers/AnnotationHelperSideContentTest",
				title: "QUnit: /ObjectPage/annotationHelpers/AnnotationHelperSideContentTest",
				group: "qunit @/ObjectPage/annotationHelpers"
			},
			"ControllerImplementationTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/ObjectPage/controller/ControllerImplementationTest",
				title: "QUnit: /ObjectPage/controller/ControllerImplementationTest",
				group: "qunit @/ObjectPage/controller"
			},
			"InlineCreationRowsHelperTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/ObjectPage/controller/inlineCreationRows/InlineCreationRowsHelperTest",
				title: "QUnit: /ObjectPage/controller/inlineCreationRows/InlineCreationRowsHelperTest",
				group: "qunit @/ObjectPage/controller"
			},
			"RelatedAppsHandlerTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/ObjectPage/controller/RelatedAppsHandlerTest",
				title: "QUnit: /ObjectPage/controller/RelatedAppsHandlerTest",
				group: "qunit @/ObjectPage/controller"
			},
			"ObjectPageExtensionAPITest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/ObjectPage/extensionAPI/ExtensionAPITest",
				title: "QUnit: /ObjectPage/extensionAPI/ExtensionAPITest",
				group: "qunit @/ObjectPage/extensionAPI"
			},
			"AlpTestSuite": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/AnalyticalListPage/alptestsuite",
				title: "QUnit TestSuite for sap.suite.ui.generic.template",
				group: "qunit @/AnalyticalListPage/control"
			},
			"OPAManageProductsTreeTableListReportTest": {
				module: "test-resources/sap/suite/ui/generic/template/integration/ManageProductsTreeTable/journeys/AllJourneys",
				title: "OPA Tests for Manage Products tree table List Report",
				group: "OPATests @/integration/ManageProductsTreeTable",
				autostart: false
			},
			"OPATestsManageProductsExternalNavigation1": {
				module: "test-resources/sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/AllJourneysExternalNavigation1",
				title: "OPA Tests Manage Products External Navigation 1",
				group: "OPATests @/integration/ManageProducts_new",
				autostart: false
			},
			"OPATestsManageProductsExternalNavigation2": {
				module: "test-resources/sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/AllJourneysExternalNavigation2",
				title: "OPA Tests Manage Products External Navigation 2",
				group: "OPATests @/integration/ManageProducts_new",
				autostart: false
			},
			"OPATestsManageProductsExternalNavigation3": {
				module: "test-resources/sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/AllJourneysExternalNavigation3",
				title: "OPA Tests Manage Products External Navigation 3",
				group: "OPATests @/integration/ManageProducts_new",
				autostart: false
			},
			"OPATestsManageProductsTest_OPDynamicHeader": {
				module: "test-resources/sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/AllJourneysOPDynamicHeader",
				title: "OPA Tests Manage Products Dynamic Header",
				group: "OPATests @/integration/ManageProducts_new",
				autostart: false
			},
			"OPATestsForManageProductsTest_OPViewLazyLoading": {
				module: "test-resources/sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/AllJourneysOPViewLazyLoading",
				title: "OPA Tests Manage Products ObjectPage ViewLazyLoading",
				group: "OPATests @/integration/ManageProducts_new",
				autostart: false
			},
			"OPATestsManageProductsTest_ExternalNavigationSmLiQv": {
				module: "test-resources/sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/AllJourneysSmLiQv",
				title: "OPA Tests Manage Products External Navigation Semantic Link Quick View",
				group: "OPATests @/integration/ManageProducts_new",
				autostart: false
			},
			"OPATestsForManageProductsListTest_LR1": {
				module: "test-resources/sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/AllJourneysLR1",
				title: "OPA Tests for Manage Products List Report 1",
				group: "OPATests @/integration/ManageProducts_new",
				autostart: false
			},
			"OPATestsForManageProductsListTest_LR2": {
				module: "test-resources/sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/AllJourneysLR2",
				title: "OPA Tests for Manage Products List Report 2",
				group: "OPATests @/integration/ManageProducts_new",
				autostart: false
			},
			"OPATestsForManageProductsListTest_LR3": {
				module: "test-resources/sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/AllJourneysLR3",
				title: "OPA Tests for Manage Products List Report 3",
				group: "OPATests @/integration/ManageProducts_new",
				autostart: false
			},
			"OPATestsForManageProductsListTest_LR4": {
				module: "test-resources/sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/AllJourneysLR4",
				title: "OPA Tests for Manage Products List Report 4",
				group: "OPATests @/integration/ManageProducts_new",
				autostart: false
			},
			"OPATestsForManageProductsListTest_LR5": {
				module: "test-resources/sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/AllJourneysLR5",
				title: "OPA Tests for Manage Products List Report 5",
				group: "OPATests @/integration/ManageProducts_new",
				autostart: false
			},
			"OPATestsForManageProductsTest_OP1": {
				module: "test-resources/sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/AllJourneysOP1",
				title: "OPA Tests Manage Products ObjectPage Open 1",
				group: "OPATests @/integration/ManageProducts_new",
				autostart: false
			},
			"OPATestsForManageProductsTest_OP2": {
				module: "test-resources/sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/AllJourneysOP2",
				title: "OPA Tests Manage Products ObjectPage Open 2",
				group: "OPATests @/integration/ManageProducts_new",
				autostart: false
			},
			"OPATestsForManageProductsTest_OP3": {
				module: "test-resources/sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/AllJourneysOP3",
				title: "OPA Tests Manage Products ObjectPage Open 3",
				group: "OPATests @/integration/ManageProducts_new",
				autostart: false
			},
			"OpaTestsForManageProducts": {
				module: "test-resources/sap/suite/ui/generic/template/integration/ManageProducts/AllJourneys",
				title: "Opa tests for sap.suite.ui.generic.template ManageProducts",
				group: "OPATests @/integration/ManageProducts",
				autostart: false
			},
			"OPATestsForSalesOrderNonDraft_LR1": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderNonDraft/journeys/AllJourneysListReport1",
				title: "OPA Tests for Sales Order Non Draft 1",
				group: "OPATests @/integration/SalesOrderNonDraft",
				autostart: false
			},
			"OPATestsForSalesOrderNonDraft_LR2": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderNonDraft/journeys/AllJourneysListReport2",
				title: "OPA Tests for Sales Order Non Draft 2",
				group: "OPATests @/integration/SalesOrderNonDraft",
				autostart: false
			},
			"OPATestsForSalesOrderNonDraft_OP": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderNonDraft/journeys/AllJourneysObjectPage",
				title: "OPA Tests for Sales Order Non Draft",
				group: "OPATests @/integration/SalesOrderNonDraft",
				autostart: false
			},
			"OPATestsforSalesOrderItemAggregation_LR1": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderItemAggregation/journeys/AllJourneysListReport1",
				title: "OPA Tests for Sales Order Item Aggregation 1",
				group: "OPATests @/integration/SalesOrderItemAggregation",
				autostart: false
			},
			"OPATestsforSalesOrderItemAggregation_LR2": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderItemAggregation/journeys/AllJourneysListReport2",
				title: "OPA Tests for Sales Order Item Aggregation 2",
				group: "OPATests @/integration/SalesOrderItemAggregation",
				autostart: false
			},
			"OPATestsforSalesOrderItemAggregation_LR3": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderItemAggregation/journeys/AllJourneysListReport3",
				title: "OPA Tests for Sales Order Item Aggregation 3",
				group: "OPATests @/integration/SalesOrderItemAggregation",
				autostart: false
			},
			"OPATestsforDemoFilterSettingsLR": {
				module: "test-resources/sap/suite/ui/generic/template/integration/demoFilterSettings/journeys/AllJourneys",
				title: "OPA Tests for Filter Settings",
				group: "OPATests @/integration/demoFilterSettings",
				autostart: false
			},
			"OPATestsfordemoObjectPagePathSupportOP": {
				module: "test-resources/sap/suite/ui/generic/template/integration/demoObjectPagePathSupport/journeys/AllJourneys",
				title: "OPA Tests for ObjectPage Path Support",
				group: "OPATests @/integration/demoObjectPagePathSupport",
				autostart: false
			},
			"OPATestsforSalesOrderItemAggregation_OP": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderItemAggregation/journeys/AllJourneysObjectPage",
				title: "OPA Tests for Sales Order Item Aggregation",
				group: "OPATests @/integration/SalesOrderItemAggregation",
				autostart: false
			},
			"OPATestsforSalesOrderwithoutExtensions_LR1": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/journeys/AllJourneysLR1",
				title: "OPA Tests for Sales Order without Extensions 1",
				group: "OPATests @/integration/SalesOrderNoExtensions",
				autostart: false
			},
			"OPATestsforSalesOrderwithoutExtensions_LR2": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/journeys/AllJourneysLR2",
				title: "OPA Tests for Sales Order without Extensions 2",
				group: "OPATests @/integration/SalesOrderNoExtensions",
				autostart: false
			},
			"OPATestsforSalesOrderwithoutExtensions_LR3": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/journeys/AllJourneysLR3",
				title: "OPA Tests for Sales Order without Extensions 3",
				group: "OPATests @/integration/SalesOrderNoExtensions",
				autostart: false
			},
			"OPATestsforSalesOrderwithoutExtensions_LR4": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/journeys/AllJourneysLR4",
				title: "OPA Tests for Sales Order without Extensions 4",
				group: "OPATests @/integration/SalesOrderNoExtensions",
				autostart: false
			},
			"OPATestsforSalesOrderwithoutExtensions_FileUpload": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/journeys/FileUploaderJourney",
				title: "OPA Tests for Sales Order without Extensions File Upload",
				group: "OPATests @/integration/SalesOrderNoExtensions",
				autostart: false
			},
			"OPATestsforSalesOrderwithoutExtensions_OPViewLazyLoading": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/journeys/AllJourneysOPViewLazyLoading",
				title: "OPA Tests for Sales Order without Extensions ObjectPage ViewLazyLoading",
				group: "OPATests @/integration/SalesOrderNoExtensions",
				autostart: false
			},
			"OPATestsforSalesOrderwithoutExtensions_OP1": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/journeys/AllJourneysOP1",
				title: "OPA Tests for Sales Order without Extensions 1",
				group: "OPATests @/integration/SalesOrderNoExtensions",
				autostart: false
			},
			"OPATestsforSalesOrderwithoutExtensions_OP2": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/journeys/AllJourneysOP2",
				title: "OPA Tests for Sales Order without Extensions 2",
				group: "OPATests @/integration/SalesOrderNoExtensions",
				autostart: false
			},
			"OPATestsforSalesOrderwithoutExtensions_OP3": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/journeys/AllJourneysOP3",
				title: "OPA Tests for Sales Order without Extensions 3",
				group: "OPATests @/integration/SalesOrderNoExtensions",
				autostart: false
			},
			"OPATestsforSalesOrderwithoutExtensions_OP4": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/journeys/AllJourneysOP4",
				title: "OPA Tests for Sales Order without Extensions 4",
				group: "OPATests @/integration/SalesOrderNoExtensions",
				autostart: false
			},
			"OPATestsforSalesOrderwithoutExtensions_OP5": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/journeys/AllJourneysOP5",
				title: "OPA Tests for Sales Order without Extensions ",
				group: "OPATests @/integration/SalesOrderNoExtensions",
				autostart: false
			},
			"OPATestsforSalesOrderwithoutExtensions_OPCRUD": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/journeys/AllJourneysOPCRUD",
				title: "OPA Tests for Sales Order without Extensions CRUD",
				group: "OPATests @/integration/SalesOrderNoExtensions",
				autostart: false
			},
			"OPATestsforSalesOrderwithoutExtensions_LocalSE": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderNoExtensionsSE/journeys/LocalSideEffectsJourney",
				title: "OPA Tests for Sales Order without Extensions Local Side Effect",
				group: "OPATests @/integration/SalesOrderNoExtensionsSE",
				autostart: false
			},
			"OPATestsforSalesOrderwithoutExtensions_GlobalSE": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderNoExtensionsSE/journeys/GlobalSideEffectsJourney",
				title: "OPA Tests for Sales Order without Extensions Global Side Effect",
				group: "OPATests @/integration/SalesOrderNoExtensionsSE",
				autostart: false
			},
			"OPATestsForSalesOrderTableTabs_LR1": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderTableTabs/journeys/AllJourneysLR1",
				title: "OPA Tests for Table Tabs LR1",
				group: "OPATests @/integration/SalesOrderTableTabs",
				autostart: false
			},
			"OPATestsForSalesOrderTableTabs_LR2": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderTableTabs/journeys/AllJourneysLR2",
				title: "OPA Tests for Table Tabs LR2",
				group: "OPATests @/integration/SalesOrderTableTabs",
				autostart: false
			},
			"OPATestsForSegmentedButtonsTest_LR1": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderSegButtons/journeys/AllJourneysListReport1",
				title: "OPA Tests for Segmented Buttons and Flexible Column Layout",
				group: "OPATests @/integration/SalesOrderSegButtons",
				autostart: false
			},
			"OPATestsForSegmentedButtonsTest_LR2": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderSegButtons/journeys/AllJourneysListReport2",
				title: "OPA Tests for Segmented Buttons and Flexible Column Layout",
				group: "OPATests @/integration/SalesOrderSegButtons",
				autostart: false
			},
			"OPATestsForSegmentedButtonsTest_LR3": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderSegButtons/journeys/AllJourneysListReport3",
				title: "OPA Tests for Segmented Buttons and Flexible Column Layout",
				group: "OPATests @/integration/SalesOrderSegButtons",
				autostart: false
			},
			"OPATestsForSegmentedButtonsTest_LR4": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderSegButtons/journeys/AllJourneysListReport4",
				title: "OPA Tests for Segmented Buttons and Flexible Column Layout",
				group: "OPATests @/integration/SalesOrderSegButtons",
				autostart: false
			},
			"OPATestsForSegmentedButtonsTest_OP": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderSegButtons/journeys/AllJourneysObjectPage",
				title: "OPA Tests for Segmented Buttons and Flexible Column Layout",
				group: "OPATests @/integration/SalesOrderSegButtons",
				autostart: false
			},
			"OPATestsForSalesOrderMultiEntitySets_LR1": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderMultiEntitySets/journeys/ListReportJourneys1",
				title: "OPA Tests for Sales Order Multi Entity Sets 1",
				group: "OPATests @/integration/SalesOrderMultiEntitySets",
				autostart: false
			},
			"OPATestsForSalesOrderMultiEntitySets_LR2": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderMultiEntitySets/journeys/ListReportJourneys2",
				title: "OPA Tests for Sales Order Multi Entity Sets 2",
				group: "OPATests @/integration/SalesOrderMultiEntitySets",
				autostart: false
			},
			"OPATestsForSalesOrderMultiEntitySets_OP": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderMultiEntitySets/journeys/ObjectPageJourneys",
				title: "OPA Tests for Sales Order Multi Entity Sets OP",
				group: "OPATests @/integration/SalesOrderMultiEntitySets",
				autostart: false
			},
			"OPATestsForSalesOrderItemEditableFieldFor_LR": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderItemEditableFieldFor/journeys/AllJourneysListReport",
				title: "OPA Tests for Sales Order Items with EditableFieldFor LR",
				group: "OPATests @/integration/SalesOrderItemEditableFieldFor",
				autostart: false
			},
			"OPATestsForSalesOrderItemEditableFieldFor_OP": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderItemEditableFieldFor/journeys/AllJourneysObjectPage",
				title: "OPA Tests for Sales Order Items with EditableFieldFor OP",
				group: "OPATests @/integration/SalesOrderItemEditableFieldFor",
				autostart: false
			},
			"OPATestsForSalesOrderWorklist": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderWorklist/journeys/AllJourneys",
				title: "OPA Tests for Sales Order Worklist",
				group: "OPATests @/integration/SalesOrderWorklist",
				autostart: false
			},
			"OPATestsForSalesOrderSmartList_StdList": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderSmartList/journeys/AllJourneys_StdList",
				title: "OPA Tests for Sales Order SmartList_StdList",
				group: "OPATests @/integration/SalesOrderSmartlist",
				autostart: false
			},
			"OPATestsForSalesOrderSmartList_ObjList": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderSmartList/journeys/AllJourneys_ObjList",
				title: "OPA Tests for Sales Order SmartList_ObjList",
				group: "OPATests @/integration/SalesOrderSmartlist",
				autostart: false
			},
			"opaTestsAnalyticalList": {
				module: "test-resources/sap/suite/ui/generic/template/integration/AnalyticalListPage/AllJourneys",
				title: "Opa tests for AnalyticalListPage",
				group: "OPATests @/integration/AnalyticalListPage",
				autostart: false,
				skip: bIsIE
			},
			"opaTestsALPWithExtension": {
				module: "test-resources/sap/suite/ui/generic/template/integration/AnalyticalListPage/ALPWithExtensionsAllJourneys",
				title: "Opa tests for AnalyticalListPage with Extensions",
				group: "OPATests @/integration/AnalyticalListPage",
				autostart: false,
				skip: bIsIE
			},
			"opaTestsALPwithParams": {
				module: "test-resources/sap/suite/ui/generic/template/integration/AnalyticalListPage/ALPWithParamAllJourneys",
				title: "Opa tests for AnalyticalListPage with Params",
				group: "OPATests @/integration/AnalyticalListPage",
				autostart: false
			},
			"opaTestsALPParamsWithNav": {
				module: "test-resources/sap/suite/ui/generic/template/integration/AnalyticalListPage/ALPWithParamsNavAllJourney",
				title: "Opa tests for AnalyticalListPage with Params",
				group: "OPATests @/integration/AnalyticalListPage",
				autostart: false
			},
			"opaTestsALPWithSettings": {
				module: "test-resources/sap/suite/ui/generic/template/integration/AnalyticalListPage/ALPWithSettingsAllJourneys",
				title: "Opa tests for AnalyticalListPage with Settings",
				group: "OPATests @/integration/AnalyticalListPage",
				autostart: false
			},
			"opaTestsALPFilterBar": {
				module: "test-resources/sap/suite/ui/generic/template/integration/AnalyticalListPage/ALPFilterBarJourneys",
				title: "Opa tests for AnalyticalListPage",
				group: "OPATests @/integration/AnalyticalListPage",
				autostart: false
			},
			"opaTestsALPMultiTable": {
				module: "test-resources/sap/suite/ui/generic/template/integration/AnalyticalListPage/ALPMultiTableJourney",
				title: "Opa tests for AnalyticalListPage MultiTable",
				group: "OPATests @/integration/AnalyticalListPage",
				autostart: false
			},
			"opaTestsALPSanityTest": {
				module: "test-resources/sap/suite/ui/generic/template/integration/AnalyticalListPage/ALPSanityJourney",
				title: "Opa Sanity tests for AnalyticalListPage",
				group: "OPATests @/integration/AnalyticalListPage",
				autostart: false
			},
			"opaTestsALPWithTreeTable": {
				module: "test-resources/sap/suite/ui/generic/template/integration/AnalyticalListPage/ALPWithTreeTableAllJourneys",
				title: "Opa tests for AnalyticalListPage with Tree Table",
				group: "OPATests @/integration/AnalyticalListPage",
				autostart: false
			}
		}
	};
});
