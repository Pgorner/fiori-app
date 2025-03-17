// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define(function () {
    "use strict";

    const aLibs = ["sap.ui.core", "sap.m", "sap.ui.layout"];
    if (document.URL.indexOf("devenv=true") < 0) {
        aLibs.push("sap.ushell");
    }

    return {
        name: "TestSuite for sap.ushell",
        defaults: {
            qunit: {
                version: 2,
                testTimeout: 60000
            },
            sinon: {
                version: 4
            },
            ui5: {
                compatVersion: "edge",
                libs: aLibs,
                language: "en"
            },
            loader: {
                paths: {
                    "sap/ushell/test": "test-resources/sap/ushell/test",
                    "sap/ushell/cdmLiveSiteData": "test-resources/sap/ushell/cdmLiveSiteData",
                    "sap/ushell/cdmSiteData": "test-resources/sap/ushell/cdmSiteData",
                    "sap/ushell/demo": "test-resources/sap/ushell/demoapps",
                    "sap/ushell/shells/demo": "test-resources/sap/ushell/shells/demo",
                    "sap/ushell": "resources/sap/ushell",
                    "sap/ushell/opa": "test-resources/sap/ushell/OPA",
                    "sap/ushell/testUtils": "test-resources/sap/ushell/test/utils"
                }
            },
            coverage: {
                only: ["sap/ushell"],
                branchTracking: true
            },
            page: "test-resources/sap/ushell/qunit/teststarter.qunit.html?test={name}",
            beforeBootstrap: "sap/ushell/test/utils/QUnitNamespaceExtension",
            autostart: true,
            reorder: false,
            bootCore: true
        },
        tests: {
            // ################################################################
            // Unit Tests (moved to "testsuite.unit.qunit.js"):
            // ################################################################
            "../test/api/BootstrapObserver": {
                title: "sap/ushell/api/BootstrapObserver"
            },
            "../test/api/Copilot": {
                title: "sap/ushell/api/Copilot"
            },
            "../test/api/Inbox": {
                title: "sap/ushell/api/Inbox"
            },
            "../test/api/NewExperience": {
                title: "sap/ushell/api/NewExperience"
            },
            "../test/api/RTA": {
                title: "sap/ushell/api/RTA"
            },
            "../test/api/S4MyHome": {
                title: "sap/ushell/api/S4MyHome"
            },
            "../test/api/common/ComponentInstantiation": {
                title: "sap/ushell/api/common/ComponentInstantiation"
            },
            "../test/api/workpage/Designtime": {
                title: "sap/ushell/api/workpage/Designtime"
            },
            "../test/api/workpage/Runtime": {
                title: "sap/ushell/api/workpage/Runtime"
            },
            "../test/AppInfoParameters": {
                title: "sap/ushell/AppInfoParameters"
            },
            "../test/Config": {
                title: "sap/ushell/Config"
            },
            "../test/CanvasShapesManager": {
                title: "sap/ushell/CanvasShapesManager"
            },
            "../test/EventHub": {
                title: "sap/ushell/EventHub"
            },
            /**
             * @deprecated As of version 1.120
             */
            "../test/Layout": {
                title: "sap/ushell/Layout"
            },
            "../test/navigationMode": {
                title: "sap/ushell/navigationMode"
            },
            "../test/NWBCInterface": {
                title: "sap/ushell/NWBCInterface"
            },
            "../test/System": {
                title: "sap/ushell/System"
            },
            "../test/SessionHandler": {
                title: "sap/ushell/SessionHandler"
            },
            "../test/User": {
                title: "sap/ushell/User"
            },
            "../test/utils": {
                title: "sap/ushell/utils"
            },
            "../test/Ui5ServiceFactory": {
                title: "sap/ushell/Ui5ServiceFactory"
            },
            "../test/Ui5NativeServiceFactory": {
                title: "sap/ushell/Ui5NativeServiceFactory"
            },
            "../test/TechnicalParameters": {
                title: "sap/ushell/TechnicalParameters"
            },
            "../test/testUtils": {
                title: "sap/ushell/testUtils"
            },
            "../test/UIActions": {
                title: "sap/ushell/UIActions"
            },
            "../test/ApplicationType": {
                title: "sap/ushell/ApplicationType"
            },
            "../test/ApplicationType/guiResolution": {
                title: "sap/ushell/ApplicationType/guiResolution"
            },
            "../test/ApplicationType/systemAlias": {
                title: "sap/ushell/ApplicationType/systemAlias"
            },
            "../test/ApplicationType/utils": {
                title: "sap/ushell/ApplicationType/utils"
            },
            "../test/ApplicationType/wdaResolution": {
                title: "sap/ushell/ApplicationType/wdaResolution"
            },
            "../test/URLTemplateProcessor": {
                title: "sap/ushell/URLTemplateProcessor"
            },
            "../test/URLTemplateProcessor/DefinitionParameterSetBuilder": {
                title: "sap/ushell/URLTemplateProcessor/DefinitionParameterSetBuilder"
            },
            "../test/URLTemplateProcessor/DependencyGraph": {
                title: "sap/ushell/URLTemplateProcessor/DependencyGraph"
            },
            "../test/URLTemplateProcessor/TemplateParameterParser": {
                title: "sap/ushell/URLTemplateProcessor/TemplateParameterParser"
            },
            "../test/URLTemplateProcessor/Functions": {
                title: "sap/ushell/URLTemplateProcessor/Functions"
            },
            "../test/ApplicationType/URLTemplateResolution": {
                title: "sap/ushell/ApplicationType/URLTemplateResolution"
            },
            "../test/adapters/cdm/ClientSideTargetResolutionAdapter": {
                title: "sap/ushell/adapters/cdm/ClientSideTargetResolutionAdapter"
            },
            "../test/adapters/cdm/CommonDataModelAdapter": {
                title: "sap/ushell/adapters/cdm/CommonDataModelAdapter"
            },
            "../test/adapters/cdm/ConfigurationDefaultsAdapter": {
                title: "sap/ushell/adapters/cdm/ConfigurationDefaultsAdapter"
            },
            "../test/adapters/cdm/ContainerAdapter": {
                title: "sap/ushell/adapters/cdm/ContainerAdapter"
            },
            /**
             * @deprecated As of version 1.112
             */
            "../test/adapters/cdm/LaunchPageAdapter": {
                title: "sap/ushell/adapters/cdm/LaunchPageAdapter"
            },
            "../test/adapters/cdm/MenuAdapter": {
                title: "sap/ushell/adapters/cdm/MenuAdapter"
            },
            "../test/adapters/cdm/PagesCommonDataModelAdapter": {
                title: "sap/ushell/adapters/cdm/PagesCommonDataModelAdapter"
            },
            /**
             * @deprecated since 1.120.0
             */
            "../test/adapters/cdm/PersonalizationAdapter": {
                title: "sap/ushell/adapters/cdm/PersonalizationAdapter"
            },
            "../test/adapters/cdm/PersonalizationV2Adapter": {
                title: "sap/ushell/adapters/cdm/PersonalizationV2Adapter"
            },
            "../test/adapters/cdm/uri.transform": {
                title: "sap/ushell/adapters/cdm/uri.transform"
            },
            "../test/adapters/cdm/util/AppForInbound": {
                title: "sap/ushell/adapters/cdm/util/AppForInbound"
            },
            "../test/adapters/cep/MenuAdapter": {
                title: "sap/ushell/adapters/cep/MenuAdapter"
            },
            /**
             * @deprecated As of version 1.120
             */
            "../test/adapters/cep/NavTargetResolutionAdapter": {
                title: "sap/ushell/adapters/cep/NavTargetResolutionAdapter"
            },
            "../test/adapters/cep/NavTargetResolutionInternalAdapter": {
                title: "sap/ushell/adapters/cep/NavTargetResolutionInternalAdapter"
            },
            "../test/adapters/cep/SearchCEPAdapter": {
                title: "sap/ushell/adapters/cep/SearchCEPAdapter"
            },
            "../test/adapters/cdm/util/cdmSiteUtils": {
                title: "sap/ushell/adapters/cdm/util/cdmSiteUtils"
            },
            "../test/adapters/cdm/v3/_LaunchPage/readApplications": {
                title: "sap/ushell/adapters/cdm/v3/_LaunchPage/readApplications"
            },
            "../test/adapters/cdm/v3/_LaunchPage/readHome": {
                title: "sap/ushell/adapters/cdm/v3/_LaunchPage/readHome"
            },
            "../test/adapters/cdm/v3/_LaunchPage/readPages": {
                title: "sap/ushell/adapters/cdm/v3/_LaunchPage/readPages"
            },
            "../test/adapters/cdm/v3/_LaunchPage/readUtils": {
                title: "sap/ushell/adapters/cdm/v3/_LaunchPage/readUtils"
            },
            "../test/adapters/cdm/v3/_LaunchPage/readVisualizations": {
                title: "sap/ushell/adapters/cdm/v3/_LaunchPage/readVisualizations"
            },
            /**
             * @deprecated As of version 1.112
             */
            "../test/adapters/cdm/_LaunchPageAdapter/LaunchPageAdapter.Bookmark": {
                title: "sap/ushell/adapters/cdm/_LaunchPageAdapter/LaunchPageAdapter.Bookmark"
            },
            /**
             * @deprecated As of version 1.112
             */
            "../test/adapters/cdm/_LaunchPageAdapter/LaunchPageAdapter.catalogs": {
                title: "sap/ushell/adapters/cdm/_LaunchPageAdapter/LaunchPageAdapter.catalogs"
            },
            "../test/adapters/cflp/UserDefaultParameterPersistenceAdapter": {
                title: "sap/ushell/adapters/cflp/UserDefaultParameterPersistenceAdapter"
            },
            "../test/adapters/local/AppStateAdapter": {
                title: "sap/ushell/adapters/local/AppStateAdapter"
            },
            "../test/adapters/local/ClientSideTargetResolutionAdapter": {
                title: "sap/ushell/adapters/local/ClientSideTargetResolutionAdapter"
            },
            "../test/adapters/local/ContainerAdapter": {
                title: "sap/ushell/adapters/local/ContainerAdapter"
            },
            /**
             * @deprecated As of version 1.120
             */
            "../test/adapters/local/LaunchPageAdapter": {
                title: "sap/ushell/adapters/local/LaunchPageAdapter"
            },
            /**
             * @deprecated As of version 1.120
             */
            "../test/adapters/local/NavTargetResolutionAdapter": {
                title: "sap/ushell/adapters/local/NavTargetResolutionAdapter"
            },
            "../test/adapters/local/NavTargetResolutionInternalAdapter": {
                title: "sap/ushell/adapters/local/NavTargetResolutionInternalAdapter"
            },
            "../test/adapters/local/PersonalizationAdapter": {
                title: "sap/ushell/adapters/local/PersonalizationAdapter"
            },
            "../test/adapters/local/PersonalizationAdapter2": {
                title: "sap/ushell/adapters/local/PersonalizationAdapter2"
            },
            "../test/adapters/local/SupportTicketAdapterTest": {
                title: "sap/ushell/adapters/local/SupportTicketAdapterTest"
            },
            "../test/adapters/local/UserDefaultParameterPersistenceAdapter": {
                title: "sap/ushell/adapters/local/UserDefaultParameterPersistenceAdapter"
            },
            "../test/adapters/local/UserInfoAdapter": {
                title: "sap/ushell/adapters/local/UserInfoAdapter"
            },
            "../test/adapters/lrep/AppVariantPersonalizationAdapter": {
                title: "sap/ushell/adapters/lrep/AppVariantPersonalizationAdapter"
            },
            "../test/appRuntime/ui5/services/adapters/ContainerAdapter": {
                title: "sap/ushell/appRuntime/ui5/services/adapters/ContainerAdapter"
            },
            /**
             * @deprecated As of version 1.120
             */
            "../test/appRuntime/ui5/services/AppConfiguration": {
                title: "sap/ushell/appRuntime/ui5/services/AppConfiguration"
            },
            "../test/appRuntime/ui5/services/AppLifeCycle": {
                title: "sap/ushell/appRuntime/ui5/services/AppLifeCycle"
            },
            "../test/appRuntime/ui5/services/AppLifeCycleAgent": {
                title: "sap/ushell/appRuntime/ui5/services/AppLifeCycleAgent"
            },
            "../test/appRuntime/ui5/services/ShellUIService": {
                title: "sap/ushell/appRuntime/ui5/services/ShellUIService"
            },
            "../test/appRuntime/ui5/services/UserDefaultParameters": {
                title: "sap/ushell/appRuntime/ui5/services/UserDefaultParameters"
            },
            "../test/appRuntime/ui5/services/AppState": {
                title: "sap/ushell/appRuntime/ui5/services/AppState"
            },
            "../test/appRuntime/ui5/services/Container": {
                title: "sap/ushell/appRuntime/ui5/services/Container"
            },
            /**
             * @deprecated As of version 1.120
             */
            "../test/appRuntime/ui5/services/CrossApplicationNavigation": {
                title: "sap/ushell/appRuntime/ui5/services/CrossApplicationNavigation"
            },
            "../test/appRuntime/ui5/services/Extension": {
                title: "sap/ushell/appRuntime/ui5/services/Extension"
            },
            "../test/appRuntime/ui5/services/FrameBoundExtension": {
                title: "sap/ushell/appRuntime/ui5/services/FrameBoundExtension"
            },
            /**
             * @deprecated since 1.120
             */
            "../test/appRuntime/ui5/services/NavTargetResolution": {
                title: "sap/ushell/appRuntime/ui5/services/NavTargetResolution"
            },
            "../test/appRuntime/ui5/services/NavTargetResolutionInternal": {
                title: "sap/ushell/appRuntime/ui5/services/NavTargetResolutionInternal"
            },
            "../test/appRuntime/ui5/services/ShellNavigationInternal": {
                title: "sap/ushell/appRuntime/ui5/services/ShellNavigationInternal"
            },
            "../test/appRuntime/ui5/AppRuntime": {
                title: "sap/ushell/appRuntime/ui5/AppRuntime",
                loader: {
                    paths: {
                        "sap/ushell/demoapps": "test-resources/sap/ushell/demoapps"
                    }
                }
            },
            "../test/appRuntime/ui5/AppRuntimeService": {
                title: "sap/ushell/appRuntime/ui5/AppRuntimeService"
            },
            "../test/appRuntime/ui5/AppCommunicationMgr": {
                title: "sap/ushell/appRuntime/ui5/AppCommunicationMgr"
            },
            "../test/appRuntime/ui5/SessionHandlerAgent": {
                title: "sap/ushell/appRuntime/ui5/SessionHandlerAgent"
            },
            "../test/appRuntime/ui5/PluginsPostMessageInterface": {
                title: "sap/ushell/appRuntime/ui5/PluginsPostMessageInterface"
            },
            "../test/appRuntime/ui5/plugins/baseRta/CheckConditions": {
                title: "sap/ushell/appRuntime/ui5/plugins/baseRta/CheckConditions",
                loader: {
                    paths: {
                        "sap/ushell/plugin/utils": "test-resources/sap/ushell/test/appRuntime/ui5/plugins/utils/"
                    }
                }
            },
            "../test/appRuntime/ui5/plugins/baseRta/Renderer": {
                title: "sap/ushell/appRuntime/ui5/plugins/baseRta/Renderer",
                loader: {
                    paths: {
                        "sap/ushell/plugin/utils": "test-resources/sap/ushell/test/appRuntime/ui5/plugins/utils/"
                    }
                }
            },
            "../test/appRuntime/ui5/plugins/baseRta/Trigger": {
                title: "sap/ushell/appRuntime/ui5/plugins/baseRta/Trigger",
                loader: {
                    paths: {
                        "sap/ushell/plugin/utils": "test-resources/sap/ushell/test/appRuntime/ui5/plugins/utils/"
                    }
                }
            },
            "../test/appRuntime/ui5/plugins/baseRta/AppLifeCycleUtils": {
                title: "sap/ushell/appRuntime/ui5/plugins/baseRta/AppLifeCycleUtils"
            },
            "../test/appRuntime/ui5/plugins/rtaShell/Component": {
                title: "sap/ushell/appRuntime/ui5/plugins/rtaShell/Component",
                loader: {
                    paths: {
                        "sap/ushell/plugin/utils": "test-resources/sap/ushell/test/appRuntime/ui5/plugins/utils/"
                    }
                }
            },
            "../test/appRuntime/ui5/plugins/rtaAgent/Component": {
                title: "sap/ushell/appRuntime/ui5/plugins/rtaAgent/Component",
                loader: {
                    paths: {
                        "sap/ushell/plugin/utils": "test-resources/sap/ushell/test/appRuntime/ui5/plugins/utils/"
                    }
                }
            },
            "../test/appRuntime/ui5/renderers/fiori2/AccessKeysAgent": {
                title: "sap/ushell/appRuntime/ui5/renderers/fiori2/AccessKeysAgent"
            },
            "../test/appRuntime/ui5/renderers/fiori2/Renderer": {
                title: "sap/ushell/appRuntime/ui5/renderers/fiori2/Renderer"
            },
            "../test/appRuntime/ui5/renderers/fiori2/RendererExtensions": {
                title: "sap/ushell/appRuntime/ui5/renderers/fiori2/RendererExtensions"
            },
            "../test/bootstrap/common/common.configure.ui5": {
                title: "sap/ushell/bootstrap/common/common.configure.ui5"
            },
            "../test/bootstrap/common/common.configure.ui5.extractLibs": {
                title: "sap/ushell/bootstrap/common/common.configure.ui5.extractLibs"
            },
            "../test/bootstrap/common/common.configure.ui5datetimeformat": {
                title: "sap/ushell/bootstrap/common/common.configure.ui5datetimeformat"
            },
            "../test/bootstrap/common/common.configure.ui5language": {
                title: "sap/ushell/bootstrap/common/common.configure.ui5language"
            },
            "../test/bootstrap/common/common.configure.ui5theme": {
                title: "sap/ushell/bootstrap/common/common.configure.ui5theme"
            },
            "../test/bootstrap/common/common.configure.ushell": {
                title: "sap/ushell/bootstrap/common/common.configure.ushell"
            },
            "../test/bootstrap/common/common.create.configcontract.core": {
                title: "sap/ushell/bootstrap/common/common.create.configcontract.core"
            },
            "../test/bootstrap/common/common.read.metatags": {
                title: "sap/ushell/bootstrap/common/common.read.metatags"
            },
            "../test/bootstrap/common/common.load.bootstrapExtension": {
                title: "sap/ushell/bootstrap/common/common.load.bootstrapExtension"
            },
            "../test/bootstrap/common/common.load.core-min": {
                title: "sap/ushell/bootstrap/common/common.load.core-min"
            },
            "../test/bootstrap/common/common.load.script": {
                title: "sap/ushell/bootstrap/common/common.load.script"
            },
            "../test/bootstrap/common/common.read.ui5theme.from.config": {
                title: "sap/ushell/bootstrap/common/common.read.ui5theme.from.config"
            },
            "../test/bootstrap/common/common.read.ushell.config.from.url": {
                title: "sap/ushell/bootstrap/common/common.read.ushell.config.from.url"
            },
            "../test/bootstrap/common/common.util": {
                title: "sap/ushell/bootstrap/common/common.util"
            },
            "../test/bootstrap/sandbox": {
                title: "sap/ushell/bootstrap/sandbox",
                loader: {
                    paths: {
                        "sap/ushell/bootstrap/sandbox": "test-resources/sap/ushell/bootstrap/sandbox",
                        "sap/ushell/shells/sandbox": "test-resources/sap/ushell/shells/sandbox"
                    }
                }
            },
            "../test/bootstrap/SchedulingAgent": {
                title: "sap/ushell/bootstrap/SchedulingAgent"
            },
            "../test/bootstrap/SchedulingAgent/FLPScheduler": {
                title: "sap/ushell/bootstrap/SchedulingAgent/FLPScheduler"
            },
            "../test/bootstrap/SchedulingAgent/EventProcessor": {
                title: "sap/ushell/bootstrap/SchedulingAgent/EventProcessor"
            },
            "../test/bootstrap/SchedulingAgent/FLPLoader": {
                title: "sap/ushell/bootstrap/SchedulingAgent/FLPLoader"
            },
            "../test/bootstrap/SchedulingAgent/Logger": {
                title: "sap/ushell/bootstrap/SchedulingAgent/Logger"
            },
            "../test/bootstrap/SchedulingAgent/State": {
                title: "sap/ushell/bootstrap/SchedulingAgent/State"
            },
            /**
             * @deprecated As of version 1.120
             */
            "../test/components/_HomepageManager/DashboardLoadingManager": {
                title: "sap/ushell/components/_HomepageManager/DashboardLoadingManager"
            },
            /**
             * @deprecated As of version 1.120
             */
            "../test/components/_HomepageManager/HomepageManagerPersonalization": {
                title: "sap/ushell/components/_HomepageManager/HomepageManagerPersonalization"
            },
            "../test/components/_HomepageManager/PagingManager": {
                title: "sap/ushell/components/_HomepageManager/PagingManager"
            },
            /**
             * @deprecated As of version 1.120
             */
            "../test/components/_HomepageManager/PersistentPageOperationAdapter": {
                title: "sap/ushell/components/_HomepageManager/PersistentPageOperationAdapter"
            },
            "../test/components/applicationIntegration/AppLifeCycle": {
                title: "sap/ushell/components/applicationIntegration/AppLifeCycle"
            },
            "../test/components/applicationIntegration/Storage": {
                title: "sap/ushell/components/applicationIntegration/Storage"
            },
            "../test/components/applicationIntegration/application/Application": {
                title: "sap/ushell/components/applicationIntegration/application/Application"
            },
            "../test/components/applicationIntegration/configuration/AppMeta": {
                title: "sap/ushell/components/applicationIntegration/configuration/AppMeta"
            },
            "../test/components/applicationIntegration/application/BlueBoxHandler": {
                title: "sap/ushell/components/applicationIntegration/application/BlueBoxHandler"
            },
            "../test/components/applicationIntegration/application/StatefulContainer": {
                title: "sap/ushell/components/applicationIntegration/application/StatefulContainer",
                loader: {
                    paths: {
                        "sap/ushell/shells/cdm": "test-resources/sap/ushell/shells/cdm"
                    }
                }
            },
            //"../test/components/applicationIntegration/application/FE": {
            //    title: "sap/ushell/components/applicationIntegration/application/FE"
            //},
            "../test/components/applicationIntegration/application/CustomAppInfo": {
                title: "sap/ushell/components/applicationIntegration/application/CustomAppInfo",
                loader: {
                    paths: {
                        "sap/ushell/shells/cdm": "test-resources/sap/ushell/shells/cdm"
                    }
                }
            },
            "../test/components/applicationIntegration/application/KeepAliveRestricted": {
                title: "sap/ushell/components/applicationIntegration/application/KeepAliveRestricted",
                loader: {
                    paths: {
                        "sap/ushell/shells/demo": "test-resources/sap/ushell/shells/demo"
                    }
                }
            },
            "../test/components/applicationIntegration/application/PostMessageAPI": {
                title: "sap/ushell/components/applicationIntegration/application/PostMessageAPI"
            },
            "../test/components/applicationIntegration/relatedServices/RelatedServices": {
                title: "sap/ushell/components/applicationIntegration/relatedServices/RelatedServices"
            },
            "../test/components/appfinder/AppFinder": {
                title: "sap/ushell/components/appfinder/AppFinder"
            },
            "../test/components/appfinder/EasyAccess": {
                title: "sap/ushell/components/appfinder/EasyAccess"
            },
            "../test/components/appfinder/GroupListPopover": {
                title: "sap/ushell/components/appfinder/GroupListPopover"
            },
            "../test/components/appfinder/HierarchyApps": {
                title: "sap/ushell/components/appfinder/HierarchyApps"
            },
            "../test/components/appfinder/HierarchyFolders": {
                title: "sap/ushell/components/appfinder/HierarchyFolders"
            },
            "../test/components/appfinder/VisualizationOrganizerHelper": {
                title: "sap/ushell/components/appfinder/VisualizationOrganizerHelper"
            },
            "../test/components/appfinder/Component": {
                title: "sap/ushell/components/appfinder/Component"
            },
            //ContentFinder Tests
            "../test/components/contentFinder/Component": {
                title: "sap/ushell/components/contentFinder/Component"
            },
            "../test/components/contentFinder/dialog/Component": {
                title: "sap/ushell/components/contentFinder/dialog/Component"
            },
            "../test/components/contentFinder/controller/ContentFinderDialog.controller": {
                title: "sap/ushell/components/contentFinder/ContentFinderDialog.controller"
            },
            "../test/components/contentFinder/CatalogService": {
                title: "sap/ushell/components/CatalogService"
            },
            "../test/components/contentFinder/controller/AppSearch.controller": {
                title: "sap/ushell/components/contentFinder/AppSearch.controller"
            },
            "../test/components/contentFinder/model/formatter": {
                title: "sap/ushell/components/contentFinder/formatter"
            },
            "../test/components/contentFinder/model/GraphQLListBinding": {
                title: "sap/ushell/components/contentFinder/model/GraphQLListBinding"
            },
            "../test/components/contentFinder/model/GraphQLModel": {
                title: "sap/ushell/components/contentFinder/model/GraphQLModel"
            },
            "../test/components/contentFinderStandalone/Component": {
                title: "sap/ushell/components/contentFinderStandalone/Component"
            },
            "../test/components/contentFinderStandalone/controller/ContentFinderStandalone.controller": {
                title: "sap/ushell/components/contentFinderStandalone/ContentFinderStandalone.controller"
            },
            "../test/components/container/ApplicationContainer": {
                title: "sap/ushell/components/container/ApplicationContainer"
            },
            "../test/components/container/IframePOSTUtils": {
                title: "sap/ushell/components/container/IframePOSTUtils"
            },
            "../test/components/runtimeSwitcher/Component": {
                title: "sap/ushell/components/runtimeSwitcher/Component"
            },
            "../test/components/runtimeSwitcher/controller/RuntimeSwitcher.controller": {
                title: "sap/ushell/components/runtimeSwitcher/controller/RuntimeSwitcher.controller"
            },
            /**
             * @deprecated since 1.118
             */
            "../test/components/factsheet/annotation/ODataURLTemplating": {
                title: "sap/ushell/components/factsheet/annotation/ODataURLTemplating"
            },
            /**
             * @deprecated since 1.118
             */
            "../test/components/homepage/ActionMode": {
                title: "sap/ushell/components/homepage/ActionMode"
            },
            /**
             * @deprecated since 1.118
             */
            "../test/components/homepage/DashboardGroupsBox": {
                title: "sap/ushell/components/homepage/DashboardGroupsBox"
            },
            /**
             * @deprecated since 1.118
             */
            "../test/components/homepage/DashboardContent": {
                title: "sap/ushell/components/homepage/DashboardContent"
            },
            /**
             * @deprecated since 1.118
             */
            "../test/components/homepage/DashboardUIActions": {
                title: "sap/ushell/components/homepage/DashboardUIActions"
            },
            /**
             * @deprecated since 1.118
             */
            "../test/components/homepage/Component": {
                title: "sap/ushell/components/homepage/Component"
            },
            "../test/components/pages/ActionMode": {
                title: "sap/ushell/components/pages/ActionMode"
            },
            "../test/components/pages/Component": {
                title: "sap/ushell/components/pages/Component"
            },
            "../test/components/pages/MyHomeImport": {
                title: "sap/ushell/components/pages/MyHomeImport"
            },
            "../test/components/pages/StateManager": {
                title: "sap/ushell/components/pages/StateManager"
            },
            "../test/components/pages/controller/PageRuntime.controller": {
                title: "sap/ushell/components/pages/controller/PageRuntime.controller"
            },
            "../test/components/pages/controller/PagesAndSpaceId": {
                title: "sap/ushell/components/pages/controller/PagesAndSpaceId"
            },
            "../test/components/pages/controller/MyHome.controller": {
                title: "sap/ushell/components/pages/controller/MyHome.controller"
            },
            "../test/components/pages/controller/ImportDialog.controller": {
                title: "sap/ushell/components/pages/controller/ImportDialog.controller"
            },
            "../test/components/shell/FloatingContainer/Component": {
                title: "sap/ushell/components/shell/FloatingContainer/Component"
            },
            "../test/components/shell/UserImage/UserImageComponent": {
                title: "sap/ushell/components/shell/UserImage/UserImageComponent"
            },
            "../test/components/shell/Notifications/NotificationsComponent": {
                title: "sap/ushell/components/shell/Notifications/NotificationsComponent"
            },
            "../test/components/shell/Notifications/Notifications": {
                title: "sap/ushell/components/shell/Notifications/Notifications"
            },
            "../test/components/shell/UserActionsMenu/UserActionsMenu.controller": {
                title: "sap/ushell/components/shell/UserActionsMenu/UserActionsMenu.controller"
            },
            "../test/components/shell/MenuBar/Component": {
                title: "sap/ushell/components/shell/MenuBar/Component"
            },
            "../test/components/shell/MenuBar/MenuBar.controller": {
                title: "sap/ushell/components/shell/MenuBar/MenuBar.controller"
            },
            "../test/components/shell/NavigationBarMenu/NavigationBarMenu.controller": {
                title: "sap/ushell/components/shell/NavigationBarMenu/NavigationBarMenu.controller"
            },
            "../test/components/shell/ProductSwitch/ProductSwitchComponent": {
                title: "sap/ushell/components/shell/ProductSwitch/ProductSwitchComponent"
            },
            "../test/components/shell/PostLoadingHeaderEnhancement/Component": {
                title: "sap/ushell/components/shell/PostLoadingHeaderEnhancement/Component"
            },
            "../test/components/shell/SideNavigation/Component": {
                title: "sap/ushell/components/shell/SideNavigation/Component"
            },
            "../test/components/shell/SideNavigation/SideNavigation.controller": {
                title: "sap/ushell/components/shell/SideNavigation/SideNavigation.controller"
            },
            "../test/components/CatalogsManager": {
                title: "sap/ushell/components/CatalogsManager"
            },
            "../test/components/ComponentKeysHandler": {
                title: "sap/ushell/components/ComponentKeysHandler"
            },
            "../test/components/DestroyHelper": {
                title: "sap/ushell/components/DestroyHelper"
            },
            "../test/components/GroupsHelper": {
                title: "sap/ushell/components/GroupsHelper"
            },
            /**
             * @deprecated since 1.118
             */
            "../test/components/HomepageManager": {
                title: "sap/ushell/components/HomepageManager"
            },
            "../test/components/Override": {
                title: "sap/ushell/components/Override"
            },
            "../test/components/SharedComponentUtils": {
                title: "sap/ushell/components/SharedComponentUtils"
            },
            "../test/components/MessagingHelper": {
                title: "sap/ushell/components/MessagingHelper"
            },
            "../test/components/VisualizationOrganizer": {
                title: "sap/ushell/components/VisualizationOrganizer"
            },
            "../test/components/shell/searchCEP/SearchProviders/SearchServiceProvider": {
                title: "sap/ushell/shell/searchCEP/SearchProviders/SearchServiceProvider"
            },
            "../test/components/shell/searchCEP/SearchProviders/FrequentActivityProvider": {
                title: "sap/ushell/shell/searchCEP/SearchProviders/FrequentActivityProvider"
            },
            "../test/components/shell/searchCEP/SearchProviders/RecentSearchProvider": {
                title: "sap/ushell/shell/searchCEP/SearchProviders/RecentSearchProvider"
            },
            "../test/components/shell/Settings/SettingsComponent": {
                title: "sap/ushell/components/shell/Settings/SettingsComponent"
            },
            "../test/components/shell/Settings/UserSettings.controller": {
                title: "sap/ushell/components/shell/Settings/UserSettings.controller"
            },
            "../test/components/shell/Settings/ErrorMessageHelper": {
                title: "sap/ushell/components/shell/Settings/ErrorMessageHelper"
            },
            "../test/components/shell/Settings/userAccount/UserAccountEntry": {
                title: "sap/ushell/components/shell/Settings/userAccount/UserAccountEntry"
            },
            "../test/components/shell/Settings/userAccount/UserAccountSelector.controller": {
                title: "sap/ushell/components/shell/Settings/userAccount/UserAccountSelector.controller"
            },
            "../test/components/shell/Settings/appearance/AppearanceEntry": {
                title: "sap/ushell/components/shell/Settings/appearance/AppearanceEntry"
            },
            "../test/components/shell/Settings/appearance/Appearance.controller": {
                title: "sap/ushell/components/shell/Settings/appearance/Appearance.controller"
            },
            /**
             * @deprecated As of version 1.120
             */
            "../test/components/shell/Settings/homepage/HomepageEntry": {
                title: "sap/ushell/components/shell/Settings/homepage/HomepageEntry"
            },
            "../test/components/shell/Settings/spaces/SpacesEntry": {
                title: "sap/ushell/components/shell/Settings/spaces/SpacesEntry"
            },
            "../test/components/shell/Settings/userActivities/UserActivitiesEntry": {
                title: "sap/ushell/components/shell/Settings/userActivities/UserActivitiesEntry"
            },
            "../test/components/shell/Settings/userActivities/UserActivitiesSetting.controller": {
                title: "sap/ushell/components/shell/Settings/userActivities/UserActivitiesSetting.controller"
            },
            "../test/components/shell/Settings/notifications/NotificationsEntry": {
                title: "sap/ushell/components/shell/Settings/notifications/NotificationsEntry"
            },
            "../test/components/shell/Settings/notifications/NotificationsSetting.controller": {
                title: "sap/ushell/components/shell/Settings/notifications/NotificationsSetting.controller"
            },
            "../test/components/shell/Settings/userDefaults/UserDefaultsEntry": {
                title: "sap/ushell/components/shell/Settings/userDefaults/UserDefaultsEntry"
            },
            "../test/components/shell/Settings/userDefaults/UserDefaultsForm": {
                title: "sap/ushell/components/shell/Settings/userDefaults/UserDefaultsForm"
            },
            "../test/components/shell/Settings/userDefaults/UserDefaultsSetting.controller": {
                title: "sap/ushell/components/shell/Settings/userDefaults/UserDefaultsSetting.controller",
                ui5: {
                    libs: ["sap.ui.fl"]
                }
            },
            "../test/components/shell/Settings/userLanguageRegion/UserLanguageRegion": {
                title: "sap/ushell/components/shell/Settings/userLanguageRegion/UserLanguageRegion"
            },
            "../test/components/tiles/applauncher/StaticTile": {
                title: "sap/ushell/components/tiles/applauncher/StaticTile"
            },
            "../test/components/tiles/applauncherdynamic/DynamicTile": {
                title: "sap/ushell/components/tiles/applauncherdynamic/DynamicTile"
            },
            "../test/components/tiles/cdm/applauncher/StaticTile": {
                title: "sap/ushell/components/tiles/cdm/applauncher/StaticTile"
            },
            "../test/components/tiles/cdm/applauncherdynamic/DynamicTile": {
                title: "sap/ushell/components/tiles/cdm/applauncherdynamic/DynamicTile"
            },
            "../test/components/tiles/utils": {
                title: "sap/ushell/components/tiles/utils"
            },
            "../test/components/cards/Card": {
                title: "sap/ushell/components/cards/Card"
            },
            "../test/components/cards/ManifestPropertyHelper": {
                title: "sap/ushell/components/cards/ManifestPropertyHelper"
            },
            "../test/components/userActivity/userActivityLog": {
                title: "sap/ushell/components/userActivity/userActivityLog"
            },
            "../test/components/workPageBuilder/Component": {
                title: "sap/ushell/components/workPageBuilder/Component",
                ui5: {
                    libs: ["sap.f"]
                }
            },
            "../test/components/workPageBuilder/controller/WorkPageBuilder.controller": {
                title: "sap/ushell/components/workPageBuilder/controller/WorkPageBuilder.controller"
            },
            "../test/components/workPageBuilder/controller/WorkPageBuilder.layout": {
                title: "sap/ushell/components/workPageBuilder/controller/WorkPageBuilder.layout"
            },
            "../test/components/workPageBuilder/controller/WorkPageBuilder.accessibility": {
                title: "sap/ushell/components/workPageBuilder/controller/WorkPageBuilder.accessibility"
            },
            "../test/components/workPageBuilder/controller/WorkPageHost": {
                title: "sap/ushell/components/workPageBuilder/controller/WorkPageHost"
            },
            "../test/components/workPageBuilder/controller/DestinationResolver": {
                title: "sap/ushell/components/workPageBuilder/controller/DestinationResolver"
            },
            "../test/components/workPageBuilder/controls/WorkPage": {
                title: "sap/ushell/components/workPageBuilder/controls/WorkPage"
            },
            "../test/components/workPageBuilder/controls/WorkPageButton": {
                title: "sap/ushell/components/workPageBuilder/controls/WorkPageButton"
            },
            "../test/components/workPageBuilder/controls/WorkPageCell": {
                title: "sap/ushell/components/workPageBuilder/controls/WorkPageCell"
            },
            "../test/components/workPageBuilder/controls/WorkPageColumn": {
                title: "sap/ushell/components/workPageBuilder/controls/WorkPageColumn"
            },
            "../test/components/workPageBuilder/controls/WorkPageColumnResizer": {
                title: "sap/ushell/components/workPageBuilder/controls/WorkPageColumnResizer"
            },
            "../test/components/workPageBuilder/controls/WorkPageRow": {
                title: "sap/ushell/components/workPageBuilder/controls/WorkPageRow"
            },
            "../test/components/workPageRuntime/Component": {
                title: "sap/ushell/components/workPageRuntime/Component"
            },
            "../test/components/workPageRuntime/controller/WorkPageRuntime.controller": {
                title: "sap/ushell/components/workPageRuntime/controller/WorkPageRuntime.controller"
            },
            "../test/components/cepsearchresult/app/Component": {
                title: "sap/ushell/components/cepsearchresult/app/Component",
                coverage: {
                    only: ["sap/ushell/components/cepsearchresult/app"]
                }
            },
            "../test/components/cepsearchresult/app/util/Edition": {
                title: "sap/ushell/components/cepsearchresult/app/util/Edition",
                coverage: {
                    only: ["sap/ushell/components/cepsearchresult/app/util/Edition"]
                }
            },
            "../test/components/cepsearchresult/app/util/controls/Category": {
                title: "sap/ushell/components/cepsearchresult/app/util/controls/Category",
                coverage: {
                    only: [
                        "sap/ushell/components/cepsearchresult/app/util/controls/Category",
                        "sap/ushell/components/cepsearchresult/app/util/controls/categories"
                    ]
                }
            },
            "../test/components/cepsearchresult/app/util/appendStyleVars": {
                title: "sap/ushell/components/cepsearchresult/app/util/appendStyleVars",
                coverage: {
                    only: ["sap/ushell/components/cepsearchresult/app/util/appendStyleVars"]
                }
            },
            "../test/components/cepsearchresult/app/cards/searchresultwidget/SearchResultWidget": {
                title: "sap/ushell/components/cepsearchresult/app/cards/searchresultwidget/SearchResultWidget",
                coverage: {
                    only: [
                        "sap/ushell/components/cepsearchresult/app/cards/searchresultwidget"
                    ]
                }
            },
            "../test/components/cepsearchresult/app/util/controls/Paginator": {
                title: "sap/ushell/components/cepsearchresult/app/util/controls/Paginator",
                coverage: {
                    only: ["sap/ushell/components/cepsearchresult/app/util/controls/Paginator"]
                }
            },
            "../test/performance/FesrEnhancer": {
                title: "sap/ushell/performance/FesrEnhancer"
            },
            "../test/performance/ShellAnalytics": {
                title: "sap/ushell/performance/ShellAnalytics"
            },
            "../test/performance/StatisticalRecord": {
                title: "sap/ushell/performance/StatisticalRecord"
            },
            "plugins/rta-personalize/Component": {
                title: "sap/ushell/plugins/rta-personalize/Component"
            },
            "plugins/BaseRTAPlugin": {
                title: "sap/ushell/plugins/BaseRTAPlugin",
                loader: {
                    paths: {
                        "sap/ushell/plugin/utils": "test-resources/sap/ushell/test/appRuntime/ui5/plugins/utils/"
                    }
                }
            },
            "../test/renderer/AccessKeysHandler": {
                title: "sap/ushell/renderer/AccessKeysHandler"
            },
            "../test/renderer/AllMyApps/AllMyApps": {
                title: "sap/ushell/renderer/AllMyApps/AllMyApps"
            },
            "../test/renderer/AllMyApps/AllMyAppsManager": {
                title: "sap/ushell/renderer/AllMyApps/AllMyAppsManager"
            },
            "../test/renderer/Renderer": {
                title: "sap/ushell/renderer/Renderer"
            },
            "../test/renderer/Renderer.Navigation": {
                title: "sap/ushell/renderer/Renderer.Navigation"
            },
            "../test/renderer/Renderer.State": {
                title: "sap/ushell/renderer/Renderer.State"
            },
            "../test/renderer/shellHeader/ShellHeader.controller": {
                title: "sap/ushell/renderer/shellHeader/ShellHeader.controller"
            },
            /**
            * @deprecated since 1.119.0
            */
            "../test/renderers/fiori2/RendererExtensions": {
                title: "sap/ushell/renderers/fiori2/RendererExtensions"
            },
            "../test/renderer/utils": {
                title: "sap/ushell/renderer/utils"
            },
            "../test/renderer/Shell": {
                title: "sap/ushell/renderer/Shell"
            },
            "../test/renderer/ShellLayout": {
                title: "sap/ushell/renderer/ShellLayout"
            },
            "../test/services/AllMyApps": {
                title: "sap/ushell/services/AllMyApps"
            },
            "../test/services/AppConfiguration": {
                title: "sap/ushell/services/AppConfiguration"
            },
            /**
            * @deprecated since 1.120.0
            */
            "../test/services/AppContext": {
                title: "sap/ushell/services/AppContext"
            },
            "../test/services/AppLifeCycle": {
                title: "sap/ushell/services/AppLifeCycle"
            },
            "../test/services/AppState": {
                title: "sap/ushell/services/AppState"
            },
            "../test/services/appstate/WindowAdapter": {
                title: "sap/ushell/services/appstate/WindowAdapter"
            },
            /**
             * @deprecated As of version 1.120
             */
            "../test/services/Bookmark": {
                title: "sap/ushell/services/Bookmark"
            },
            "../test/services/BookmarkV2": {
                title: "sap/ushell/services/BookmarkV2"
            },
            "../test/services/ClientSideTargetResolution": {
                title: "sap/ushell/services/ClientSideTargetResolution"
            },
            "../test/services/CommonDataModel": {
                title: "sap/ushell/services/CommonDataModel"
            },
            "../test/services/CommonDataModel/PersonalizationProcessor": {
                title: "sap/ushell/services/CommonDataModel/PersonalizationProcessor"
            },
            /**
             * @deprecated since 1.120.0
             */
            "../test/services/CommonDataModel/PersonalizationProcessorCDMBlackbox": {
                title: "sap/ushell/services/CommonDataModel/PersonalizationProcessorCDMBlackbox"
            },
            /**
             * @deprecated since 1.120.0
             */
            "../test/services/CommonDataModel/PersonalizationProcessorCDMBlackboxV2": {
                title: "sap/ushell/services/CommonDataModel/PersonalizationProcessorCDMBlackboxV2"
            },
            "../test/services/CommonDataModel/SiteConverter": {
                title: "sap/ushell/services/CommonDataModel/SiteConverter"
            },
            "../test/services/CommonDataModel/vizTypeDefaults/VizTypeDefaults": {
                title: "sap/ushell/services/vizTypeDefaults/VizTypeDefaults"
            },
            "../test/services/Configuration": {
                title: "sap/ushell/services/Configuration"
            },
            "../test/services/ConfigurationDefaults": {
                title: "sap/ushell/services/ConfigurationDefaults"
            },
            "../test/Container": {
                title: "sap/ushell/Container"
            },
            /**
            * @deprecated since 1.120.0
            */
            "../test/services/ContentExtensionAdapterFactory": {
                title: "sap/ushell/services/ContentExtensionAdapterFactory"
            },
            /**
             * @deprecated since 1.120.0
             */
            "../test/services/CrossApplicationNavigation": {
                title: "sap/ushell/services/CrossApplicationNavigation"
            },
            "../test/services/DarkModeSupport": {
                title: "sap/ushell/services/DarkModeSupport"
            },
            "../test/services/Extension": {
                title: "sap/ushell/services/Extension"
            },
            "../test/services/Extension/HeaderItem": {
                title: "sap/ushell/services/Extension/HeaderItem"
            },
            "../test/services/Extension/UserAction": {
                title: "sap/ushell/services/Extension/UserAction"
            },
            "../test/services/FrameBoundExtension": {
                title: "sap/ushell/services/FrameBoundExtension"
            },
            "../test/services/FrameBoundExtension/FloatingContainer": {
                title: "sap/ushell/services/FrameBoundExtension/FloatingContainer"
            },
            "../test/services/FrameBoundExtension/Footer": {
                title: "sap/ushell/services/FrameBoundExtension/Footer"
            },
            "../test/services/FrameBoundExtension/HeaderItem": {
                title: "sap/ushell/services/FrameBoundExtension/HeaderItem"
            },
            "../test/services/FrameBoundExtension/SidePane": {
                title: "sap/ushell/services/FrameBoundExtension/SidePane"
            },
            "../test/services/FrameBoundExtension/SubHeader": {
                title: "sap/ushell/services/FrameBoundExtension/SubHeader"
            },
            "../test/services/FrameBoundExtension/ToolArea": {
                title: "sap/ushell/services/FrameBoundExtension/ToolArea"
            },
            "../test/services/FrameBoundExtension/UserAction": {
                title: "sap/ushell/services/FrameBoundExtension/UserAction"
            },
            "../test/services/FrameBoundExtension/UserSettingsEntry": {
                title: "sap/ushell/services/FrameBoundExtension/UserSettingsEntry"
            },
            /**
             * @deprecated since 1.112.0
             */
            "../test/services/LaunchPage": {
                title: "sap/ushell/services/LaunchPage"
            },
            /**
             * @deprecated since 1.120.0
             */
            "../test/services/_LaunchPage/LaunchPage.Bookmark": {
                title: "sap/ushell/services/_LaunchPage/LaunchPage.Bookmark"
            },
            "../test/services/Menu": {
                title: "sap/ushell/services/Menu"
            },
            /**
            * @deprecated since 1.120.0
            */
            "../test/services/Message": {
                title: "sap/ushell/services/Message"
            },
            "../test/services/MessageBroker": {
                title: "sap/ushell/services/MessageBroker"
            },
            //"../test/services/MessageBroker/MessageBrokerApp": {
            //    title: "sap/ushell/services/MessageBroker/MessageBrokerApp"
            //},
            "../test/services/MessageBroker/MessageBrokerEngine": {
                title: "sap/ushell/services/MessageBroker/MessageBrokerEngine"
            },
            "../test/services/MessageInternal": {
                title: "sap/ushell/services/MessageInternal"
            },
            "../test/services/Navigation": {
                title: "sap/ushell/services/Navigation"
            },
            "../test/services/Navigation/compatibility": {
                title: "sap/ushell/services/Navigation/compatibility"
            },
            "../test/services/Navigation/utils": {
                title: "sap/ushell/services/Navigation/Utils"
            },
            "../test/services/NavigationDataProvider": {
                title: "sap/ushell/services/NavigationDataProvider"
            },
            /**
             * @deprecated As of version 1.120.
             */
            "../test/services/NavTargetResolution": {
                title: "sap/ushell/services/NavTargetResolution"
            },
            "../test/services/NavTargetResolutionInternal": {
                title: "sap/ushell/services/NavTargetResolutionInternal"
            },
            /**
             * @deprecated As of version 1.120.
             */
            "../test/services/NavTargetResolutionCDMBlackbox": {
                title: "sap/ushell/services/NavTargetResolutionCDMBlackbox"
            },
            /**
             * @deprecated As of version 1.120.
             */
            "../test/services/NavTargetResolutionCDMBlackboxV2": {
                title: "sap/ushell/services/NavTargetResolutionCDMBlackboxV2"
            },
            "../test/services/NavTargetResolutionInternalCDMBlackbox": {
                title: "sap/ushell/services/NavTargetResolutionInternalCDMBlackbox"
            },
            "../test/services/NavTargetResolutionInternalCDMBlackboxV2": {
                title: "sap/ushell/services/NavTargetResolutionInternalCDMBlackboxV2"
            },
            /**
             * @deprecated As of version 1.120
             */
            "../test/services/Notifications": {
                title: "sap/ushell/services/Notifications"
            },
            "../test/services/NotificationsV2": {
                title: "sap/ushell/services/NotificationsV2"
            },
            "../test/services/_PageReferencing/PageReferencer": {
                title: "sap/ushell/services/_PageReferencing/PageReferencer"
            },
            "../test/services/Pages": {
                title: "sap/ushell/services/Pages"
            },
            /**
            * @deprecated since 1.120.0
            */
            "../test/services/Personalization": {
                title: "sap/ushell/services/Personalization"
            },
            /**
            * @deprecated since 1.120.0
            */
            "../test/services/PersonalizationResetEntirePersonalization": {
                title: "sap/ushell/services/PersonalizationResetEntirePersonalization"
            },
            "../test/services/PersonalizationV2": {
                title: "sap/ushell/services/PersonalizationV2"
            },
            "../test/services/PersonalizationV2Container": {
                title: "sap/ushell/services/PersonalizationV2Container"
            },
            "../test/services/PersonalizationV2ResetEntirePersonalization": {
                title: "sap/ushell/services/PersonalizationV2ResetEntirePersonalization"
            },
            "../test/services/PluginManager/Extensions": {
                title: "sap/ushell/services/PluginManager/Extensions"
            },
            "../test/services/PluginManager/HeaderExtensions": {
                title: "sap/ushell/services/PluginManager/HeaderExtensions"
            },
            "../test/services/PluginManager/MenuExtensions": {
                title: "sap/ushell/services/PluginManager/MenuExtensions"
            },
            "../test/services/PluginManager": {
                title: "sap/ushell/services/PluginManager"
            },
            "../test/services/ReferenceResolver": {
                title: "sap/ushell/services/ReferenceResolver"
            },
            "../test/services/SearchableContent": {
                title: "sap/ushell/services/SearchableContent"
            },
            "../test/services/SearchCEP": {
                title: "sap/ushell/services/SearchCEP"
            },
            "../test/services/ShellNavigation": {
                title: "sap/ushell/services/ShellNavigation"
            },
            "../test/services/ShellNavigationInternal": {
                title: "sap/ushell/services/ShellNavigationInternal"
            },
            "../test/services/ShellNavigation.History": {
                title: "sap/ushell/services/ShellNavigation.History",
                loader: {
                    paths: {
                        "sap/ui/core/qunit": "test-resources/sap/ui/core/qunit"
                    }
                }
            },
            "../test/services/ShellNavigationHashChanger": {
                title: "sap/ushell/services/ShellNavigationHashChanger"
            },
            /**
             * @deprecated since 1.119
             */
            "../test/services/SmartNavigation": {
                title: "sap/ushell/services/SmartNavigation"
            },
            "../test/services/SpaceContent": {
                title: "sap/ushell/services/SpaceContent"
            },
            "../test/services/SupportTicket": {
                title: "sap/ushell/services/SupportTicket"
            },
            "../test/services/URLParsing": {
                title: "sap/ushell/services/URLParsing"
            },
            /**
            * @deprecated since 1.119
            */
            "../test/services/URLShortening": {
                title: "sap/ushell/services/URLShortening"
            },
            "../test/services/Ui5ComponentLoader": {
                title: "sap/ushell/services/Ui5ComponentLoader"
            },
            "../test/services/UITracer": {
                title: "sap/ushell/services/UITracer"
            },
            "../test/services/UserDefaultParameterPersistence": {
                title: "sap/ushell/services/UserDefaultParameterPersistence"
            },
            "../test/services/UserDefaultParameters": {
                title: "sap/ushell/services/UserDefaultParameters"
            },
            "../test/services/UserDefaultPluginSample": {
                title: "sap/ushell/demoapps/UserDefaultPluginSample/UserDefaultPluginSample"
            },
            "../test/services/UserInfo": {
                title: "sap/ushell/services/UserInfo"
            },
            "../test/services/UserRecents": {
                title: "sap/ushell/services/UserRecents"
            },
            "../test/services/VisualizationDataProvider": {
                title: "sap/ushell/services/VisualizationDataProvider"
            },
            "../test/services/VisualizationInstantiation": {
                title: "sap/ushell/services/VisualizationInstantiation"
            },
            "../test/services/ClientSideTargetResolution/Formatter": {
                title: "sap/ushell/services/ClientSideTargetResolution/Formatter"
            },
            "../test/services/ClientSideTargetResolution/InboundProvider": {
                title: "sap/ushell/services/ClientSideTargetResolution/InboundProvider"
            },
            "../test/services/ClientSideTargetResolution/ParameterMapping": {
                title: "sap/ushell/services/ClientSideTargetResolution/ParameterMapping"
            },
            "../test/services/ClientSideTargetResolution/InboundIndex": {
                title: "sap/ushell/services/ClientSideTargetResolution/InboundIndex"
            },
            "../test/services/ClientSideTargetResolution/Search": {
                title: "sap/ushell/services/ClientSideTargetResolution/Search"
            },
            "../test/services/ClientSideTargetResolution/StagedLogger": {
                title: "sap/ushell/services/ClientSideTargetResolution/StagedLogger"
            },
            "../test/services/ClientSideTargetResolution/SystemContext": {
                title: "sap/ushell/services/ClientSideTargetResolution/SystemContext"
            },
            "../test/services/ClientSideTargetResolution/Utils": {
                title: "sap/ushell/services/ClientSideTargetResolution/Utils"
            },
            "../test/services/ClientSideTargetResolution/VirtualInbounds": {
                title: "sap/ushell/services/ClientSideTargetResolution/VirtualInbounds"
            },
            "../test/services/ClientSideTargetResolution/XAppStateProcessing": {
                title: "sap/ushell/services/ClientSideTargetResolution/XAppStateProcessing"
            },
            "../test/services/ClientSideTargetResolution/PrelaunchOperations": {
                title: "sap/ushell/services/ClientSideTargetResolution/PrelaunchOperations"
            },
            /**
            * @deprecated since 1.120
            */
            "../test/services/_CrossApplicationNavigation/utils": {
                title: "sap/ushell/services/_CrossApplicationNavigation/Utils"
            },
            "../test/services/Ui5ComponentLoader/utils": {
                title: "sap/ushell/services/Ui5ComponentLoader/Utils"
            },
            "../test/state/BaseState": {
                title: "sap/ushell/state/BaseState"
            },
            "../test/state/BindingHelper": {
                title: "sap/ushell/state/BindingHelper"
            },
            "../test/state/ControlManager": {
                title: "sap/ushell/state/ControlManager"
            },
            "../test/state/CurrentState": {
                title: "sap/ushell/state/CurrentState"
            },
            "../test/state/KeepAlive": {
                title: "sap/ushell/state/KeepAlive"
            },
            "../test/state/KeepAlive.integration": {
                title: "sap/ushell/state/KeepAlive.integration"
            },
            "../test/state/ShellModel": {
                title: "sap/ushell/state/ShellModel"
            },
            "../test/state/StateManager": {
                title: "sap/ushell/state/StateManager"
            },
            "../test/state/StateManager.integration": {
                title: "sap/ushell/state/StateManager.integration"
            },
            "../test/state/StateRules": {
                title: "sap/ushell/state/StateRules"
            },
            "../test/state/StrategyFactory": {
                title: "sap/ushell/state/StrategyFactory"
            },
            "../test/state/StrategyFactory/DefaultStrategy": {
                title: "sap/ushell/state/StrategyFactory/DefaultStrategy"
            },
            "../test/state/StrategyFactory/FloatingActionsStrategy": {
                title: "sap/ushell/state/StrategyFactory/FloatingActionsStrategy"
            },
            "../test/state/StrategyFactory/FloatingContainerStrategy": {
                title: "sap/ushell/state/StrategyFactory/FloatingContainerStrategy"
            },
            "../test/state/StrategyFactory/HeadEndItemsStrategy": {
                title: "sap/ushell/state/StrategyFactory/HeadEndItemsStrategy"
            },
            "../test/state/StrategyFactory/HeadItemsStrategy": {
                title: "sap/ushell/state/StrategyFactory/HeadItemsStrategy"
            },
            "../test/state/StrategyFactory/SidePaneStrategy": {
                title: "sap/ushell/state/StrategyFactory/SidePaneStrategy"
            },
            "../test/state/StrategyFactory/SubHeaderStrategy": {
                title: "sap/ushell/state/StrategyFactory/SubHeaderStrategy"
            },
            "../test/state/StrategyFactory/UserActionsStrategy": {
                title: "sap/ushell/state/StrategyFactory/UserActionsStrategy"
            },
            "../test/support/plugins/flpConfig/FlpConfigurationPlugin": {
                title: "sap/ushell/support/plugins/flpConfig/FlpConfigurationPlugin"
            },
            "../test/ui/AppContainer": {
                title: "sap/ushell/ui/AppContainer"
            },
            "../test/ui/ContentNodeSelector": {
                title: "sap/ushell/ui/ContentNodeSelector"
            },
            "../test/ui/ContentNodeTreeItem": {
                title: "sap/ushell/ui/ContentNodeTreeItem"
            },
            "../test/ui/CustomGroupHeaderListItem": {
                title: "sap/ushell/ui/CustomGroupHeaderListItem"
            },
            "../test/ui/QuickAccess": {
                group: "ui-tests",
                title: "sap/ushell/ui/QuickAccess"
            },
            "../test/ui/ShellHeader": {
                group: "ui-tests",
                title: "sap/ushell/ui/ShellHeader"
            },
            /**
             * @deprecated since 1.120
             */
            "../test/ui/appfinder/AppBox": {
                title: "sap/ushell/ui/appfinder/AppBox"
            },
            "../test/ui/appfinder/AppBoxInternal": {
                title: "sap/ushell/ui/appfinder/AppBoxInternal"
            },
            "../test/ui/bookmark/SaveOnPage.controller": {
                title: "sap/ushell/ui/bookmark/SaveOnPage.controller"
            },
            "../test/ui/cards/RecentActivitiesExtension": {
                title: "sap/ushell/ui/cards/RecentActivitiesExtension",
                loader: {
                    paths: {
                        "sap/ushell/ui/cards": "resources/sap/ushell/ui/cards"
                    }
                },
                ui5: {
                    libs: ["sap.ui.integration"]
                }
            },
            "../test/ui/cards/FrequentActivitiesExtension": {
                title: "sap/ushell/ui/cards/FrequentActivitiesExtension",
                loader: {
                    paths: {
                        "sap/ushell/ui/cards": "resources/sap/ushell/ui/cards"
                    }
                },
                ui5: {
                    libs: ["sap.ui.integration"]
                }
            },
            "../test/ui/footerbar/AboutButton": {
                title: "sap/ushell/ui/footerbar/AboutButton"
            },
            "../test/ui/footerbar/AboutDialog.controller": {
                title: "sap/ushell/ui/footerbar/AboutDialog.controller"
            },
            "../test/ui/footerbar/AddBookmarkButton": {
                title: "sap/ushell/ui/footerbar/AddBookmarkButton"
            },
            "../test/ui/footerbar/ContactSupportButton": {
                title: "sap/ushell/ui/footerbar/ContactSupportButton"
            },
            "../test/ui/footerbar/JamDiscussButton": {
                title: "sap/ushell/ui/footerbar/JamDiscussButton"
            },
            "../test/ui/footerbar/JamShareButton": {
                title: "sap/ushell/ui/footerbar/JamShareButton"
            },
            "../test/ui/footerbar/LogoutButton": {
                title: "sap/ushell/ui/footerbar/LogoutButton"
            },
            "../test/ui/footerbar/SaveAsTile": {
                title: "sap/ushell/ui/footerbar/SaveAsTile"
            },
            "../test/ui/footerbar/SendAsEmailButton": {
                title: "sap/ushell/ui/footerbar/SendAsEmailButton"
            },
            "../test/ui/launchpad/AccessibilityCustomData": {
                title: "sap/ushell/ui/launchpad/AccessibilityCustomData"
            },
            "../test/ui/launchpad/ActionItem": {
                title: "sap/ushell/ui/launchpad/ActionItem"
            },
            /**
             * @deprecated As of version 1.120
             */
            "../test/ui/launchpad/AnchorItem": {
                title: "sap/ushell/ui/launchpad/AnchorItem"
            },
            /**
             * @deprecated As of version 1.120
             */
            "../test/ui/launchpad/AnchorNavigationBar": {
                title: "sap/ushell/ui/launchpad/AnchorNavigationBar"
            },
            "../test/ui/launchpad/CatalogEntryContainer": {
                title: "sap/ushell/ui/launchpad/CatalogEntryContainer"
            },
            "../test/ui/launchpad/CatalogsContainer": {
                title: "sap/ushell/ui/launchpad/CatalogsContainer"
            },
            /**
             * @deprecated As of version 1.120
             */
            "../test/ui/launchpad/DashboardGroupsContainer": {
                title: "sap/ushell/ui/launchpad/DashboardGroupsContainer"
            },
            "../test/ui/launchpad/FailedTileDialog": {
                title: "sap/ushell/ui/launchpad/FailedTileDialog"
            },
            "../test/ui/launchpad/GroupHeaderActions": {
                title: "sap/ushell/ui/launchpad/GroupHeaderActions"
            },
            "../test/ui/launchpad/GroupListItem": {
                title: "sap/ushell/ui/launchpad/GroupListItem"
            },
            /**
            * @deprecated As of version 1.120
            */
            "../test/ui/launchpad/LinkTileWrapper": {
                title: "sap/ushell/ui/launchpad/LinkTileWrapper"
            },
            "../test/ui/launchpad/LoadingDialog": {
                title: "sap/ushell/ui/launchpad/LoadingDialog"
            },
            "../test/ui/launchpad/Page": {
                title: "sap/ushell/ui/launchpad/Page"
            },
            "../test/ui/launchpad/Section": {
                title: "sap/ushell/ui/launchpad/Section"
            },
            "../test/ui/launchpad/ExtendedChangeDetection": {
                title: "sap/ushell/ui/launchpad/ExtendedChangeDetection"
            },
            "../test/ui/launchpad/Tile": {
                title: "sap/ushell/ui/launchpad/Tile"
            },
            "../test/ui/launchpad/TileContainer": {
                title: "sap/ushell/ui/launchpad/TileContainer"
            },
            /**
             * @deprecated since 1.120.0
             */
            "../test/ui/launchpad/TileState": {
                title: "sap/ushell/ui/launchpad/TileState"
            },
            "../test/ui/launchpad/TileStateInternal": {
                title: "sap/ushell/ui/launchpad/TileStateInternal"
            },
            "../test/ui/launchpad/VizInstance": {
                title: "sap/ushell/ui/launchpad/VizInstance"
            },
            "../test/ui/launchpad/VizInstanceAbap": {
                title: "sap/ushell/ui/launchpad/VizInstanceAbap"
            },
            "../test/ui/launchpad/VizInstanceBase": {
                title: "sap/ushell/ui/launchpad/VizInstanceBase"
            },
            "../test/ui/launchpad/VizInstanceCdm": {
                title: "sap/ushell/ui/launchpad/VizInstanceCdm"
            },
            "../test/ui/launchpad/VizInstanceLink": {
                title: "sap/ushell/ui/launchpad/VizInstanceLink"
            },
            /**
             * @deprecated As of version 1.120
             */
            "../test/ui/launchpad/VizInstanceLaunchPage": {
                title: "sap/ushell/ui/launchpad/VizInstanceLaunchPage"
            },
            "../test/ui/shell/RightFloatingContainer": {
                title: "sap/ushell/ui/shell/RightFloatingContainer"
            },
            "../test/ui/shell/ShellAppTitle": {
                title: "sap/ushell/ui/shell/ShellAppTitle"
            },
            "../test/ui/shell/ShellAppTitleRenderer": {
                title: "sap/ushell/ui/shell/ShellAppTitleRenderer"
            },
            "../test/ui/shell/ShellHeadItem": {
                title: "sap/ushell/ui/shell/ShellHeadItem"
            },
            "../test/ui/shell/SubHeader": {
                title: "sap/ushell/ui/shell/SubHeader"
            },
            "../test/ui/shell/SidePane": {
                title: "sap/ushell/ui/shell/SidePane"
            },
            "../test/ui/shell/SysInfoBar": {
                title: "sap/ushell/ui/shell/SysInfoBar"
            },
            "../test/ui/shell/OverflowListItem": {
                title: "sap/ushell/ui/shell/OverflowListItem"
            },
            "../test/ui/tile/DynamicTile": {
                title: "sap/ushell/ui/tile/DynamicTile"
            },
            "../test/ui/tile/ImageTile": {
                title: "sap/ushell/ui/tile/ImageTile"
            },
            /**
            * @deprecated As of version 1.120
            */
            "../test/ui/tile/StaticTile": {
                title: "sap/ushell/ui/tile/StaticTile"
            },
            "../test/ui/tile/TileBase": {
                title: "sap/ushell/ui/tile/TileBase"
            },
            "../test/ui5service/ShellUIService": {
                title: "sap/ushell/ui5service/ShellUIService"
            },
            "../test/ui5service/ShellUIServiceFactory": {
                title: "sap/ushell/ui5service/ShellUIServiceFactory"
            },
            /**
            * @deprecated since 1.118
            */
            "../test/ui5service/UserStatus": {
                title: "sap/ushell/ui5service/UserStatusService"
            },
            "../test/utils/chipsUtils": {
                title: "sap/ushell/utils/chipsUtils"
            },
            "../test/utils/Deferred": {
                title: "sap/ushell/utils/Deferred"
            },
            "../test/utils/DynamicTileRequest": {
                title: "sap/ushell/utils/DynamicTileRequest"
            },
            "../test/utils/HttpClient": {
                title: "sap/ushell/utils/HttpClient"
            },
            "../test/utils/WindowUtils": {
                title: "sap/ushell/utils/WindowUtils"
            },
            "../test/utils/objectOperations": {
                title: "sap/ushell/utils/objectOperations"
            },
            "../test/utils/utilsCdm": {
                title: "sap/ushell/utils/utilsCdm"
            },
            "../test/utils/UrlParsing": {
                title: "sap/ushell/utils/UrlParsing"
            },
            "../test/utils/RestrictedJSONModel": {
                title: "sap/ushell/utils/RestrictedJSONModel"
            },
            "../test/utils/URLShortening": {
                title: "sap/ushell/utils/URLShortening"
            },
            "../test/utils/workpage/WorkPageService": {
                title: "sap/ushell/utils/workpage/WorkPageService"
            },
            "../test/utils/workpage/WorkPageVizInstantiation": {
                title: "sap/ushell/utils/workpage/WorkPageVizInstantiation"
            },
            "../test/utils/tilecard/TileCard": {
                title: "sap/ushell/utils/tilecard/TileCard",
                coverage: {
                    only: [
                        "sap/ushell/utils/tilecard/TileCard",
                        "sap/ushell/utils/workpage/WorkPageVizInstantiation"
                    ]
                }
            },
            UserActionsMenuPlacement: {
                group: "OPA, Spaces mode",
                title: "UserActionsMenuPlacement",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/header/journeys/UserActionsMenuPlacement"
                    }
                }
            },
            MenuBar: {
                group: "OPA, Spaces mode",
                title: "MenuBar",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/homepage/journeys/MenuBar"
                    }
                }
            },
            Notifications: {
                group: "OPA, Spaces mode",
                title: "Notifications",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/notifications/journeys/Notifications"
                    }
                }
            },
            QuickAccessDialog: {
                group: "OPA, Spaces mode",
                title: "QuickAccessDialog",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/homepage/journeys/QuickAccessDialog"
                    }
                }
            },
            SearchContainer: {
                group: "OPA, Spaces mode",
                title: "SearchContainer",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/header/journeys/SearchContainer"
                    }
                }
            },
            ThemeSettings: {
                group: "OPA, Spaces mode",
                title: "ThemeSettings",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/homepage/journeys/ThemeSettings"
                    }
                }
            },
            UserSettings: {
                group: "OPA, Spaces mode",
                title: "UserSettings",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/notifications/journeys/UserSettings"
                    }
                }
            },
            UserSettingsSave: {
                group: "OPA, Spaces mode",
                title: "UserSettingsSave",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/userSettings/journeys/UserSettingsSave"
                    }
                }
            },

            // ################################################################
            // Integration Tests (moved to "testsuite.integration.qunit.js"):
            // ################################################################
            "../test/adapters/cdm/v3/_LaunchPage/readUtils.integration": {
                title: "sap/ushell/adapters/cdm/v3/_LaunchPage/readUtils.integration"
            },
            "../test/adapters/cflp/UserDefaultParameterPersistence.integration": {
                title: "sap/ushell/adapters/cflp/UserDefaultParameterPersistence.integration"
            },
            "../test/bootstrap/SchedulingAgent.integration": {
                title: "sap/ushell/bootstrap/SchedulingAgent.integration"
            },
            "../test/components/shell/Settings/UserSettings.integration": {
                title: "UserSettings - integration test - grouped entries as tabs"
            },
            WorkPageBuilderEditMode: {
                group: "OPA, CEP WorkpageBuilder",
                title: "CEP WorkpageBuilder Edit Mode",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/workPageBuilder/journeys/EditMode"
                    }
                }
            },
            WorkPageBuilderDisplayMode: {
                group: "OPA, CEP WorkpageBuilder",
                title: "CEP WorkpageBuilder DisplayMode",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/workPageBuilder/journeys/DisplayMode"
                    }
                }
            },
            // CEPSearchResult: {
            //     group: "OPA, CEP SearchResult",
            //     title: "CEP SearchResult Application",
            //     module: "test-resources/sap/ushell/OPA/JourneyExecutor",
            //     autostart: false,
            //     loader: {
            //         paths: {
            //             journey: "test-resources/sap/ushell/OPA/tests/cepsearchresult/journeys/SearchAppView"
            //         }
            //     }
            // },
            ContentFinder: {
                group: "OPA, CEP ContentFinder",
                title: "CEP ContentFinder",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/contentFinder/journeys/General"
                    }
                }
            },
            ContentFinderStandalone: {
                group: "OPA, CEP ContentFinder",
                title: "CEP ContentFinder Standalone (Fullscreen)",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/contentFinderStandalone/journeys/General"
                    }
                }
            },
            /**
            * @deprecated since 1.117
            */
            Accessibility: {
                group: "OPA, Classical FLP",
                title: "Classic Homepage Accessibility",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/homepage/journeys/Accessibility"
                    }
                }
            },
            /**
            * @deprecated since 1.117
            */
            AnchorNavigationBar: {
                group: "OPA, Classical FLP",
                title: "AnchorNavigationBar",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/homepage/journeys/AnchorNavigationBar"
                    }
                }
            },
            /**
            * @deprecated since 1.117
            */
            AppFinder: {
                group: "OPA, Classical FLP",
                title: "AppFinder",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/homepage/journeys/AppFinder"
                    }
                }
            },
            /**
            * @deprecated since 1.117
            */
            Bookmark: {
                group: "OPA, Classical FLP",
                title: "Bookmark",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/demoapps/journeys/BookmarkAppClassicHomepage"
                    }
                }
            },
            EndItemsOverflow: {
                group: "OPA, Spaces mode",
                title: "EndItemsOverflow",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/header/journeys/EndItemsOverflow"
                    }
                }
            },
            FloatingContainer: {
                group: "OPA, Spaces mode",
                title: "FloatingContainer",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/header/journeys/FloatingContainer",
                        "sap/ushell/demo/PluginAddDummyCopilot/component": "test-resources/sap/ushell/demoapps/BootstrapPluginSample/PluginAddDummyCopilot/component",
                        "sap/ushell/demo/PluginAddDummyCopilot/component/controller": "test-resources/sap/ushell/demoapps/BootstrapPluginSample/PluginAddDummyCopilot/component/controller",
                        "sap/ushell/demo/PluginAddDummyCopilot": "test-resources/sap/ushell/demoapps/BootstrapPluginSample/PluginAddDummyCopilot"
                    }
                }
            },
            UserActionsMenu: {
                group: "OPA, Spaces mode",
                title: "UserActionsMenu",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/header/journeys/UserActionsMenu"
                    }
                }
            },
            TileSize: {
                group: "OPA, Spaces mode",
                title: "TileSize",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/homepage/journeys/TileSize"
                    }
                }
            },
            DisplayFormatCdm: {
                group: "OPA, Display format",
                title: "DisplayFormatCdm",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        "sap/ushell/demotiles": "test-resources/sap/ushell/demotiles",
                        journey: "test-resources/sap/ushell/OPA/tests/spacesMode/journeys/DisplayFormatCdm"
                    }

                }
            },
            DisplayFormatAbap: {
                group: "OPA, Display format",
                title: "DisplayFormatAbap",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        "sap/ushell/demotiles": "test-resources/sap/ushell/demotiles",
                        journey: "test-resources/sap/ushell/OPA/tests/spacesMode/journeys/DisplayFormatAbap"
                    }
                }
            },
            AppExtensionsIsolated: {
                group: "OPA, Isolation",
                title: "AppExtensions",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/isolation/journeys/AppExtensionsIsolated"
                    }
                }
            },
            AccessibilitySpaces: {
                group: "OPA, Spaces mode",
                title: "AccessibilitySpaces",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/spacesMode/journeys/Accessibility"
                    }
                }
            },
            AppFinderSpaces: {
                group: "OPA, Spaces mode",
                title: "AppFinderSpaces",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/spacesMode/journeys/AppFinder"
                    }
                }
            },
            AppFinderWithoutSectionId: {
                group: "OPA, Spaces mode",
                title: "AppFinderSpaces",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/spacesMode/journeys/AppFinderWithoutSectionId"
                    }
                }
            },
            BookmarkApp: {
                group: "OPA, Spaces mode",
                title: "Bookmark",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/demoapps/journeys/BookmarkAppSpacesMode"
                    }
                }
            },
            BookmarkSpaces: {
                group: "OPA, Spaces mode",
                title: "BookmarkSpaces",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/spacesMode/journeys/Bookmark"
                    }
                }
            },
            EditMode: {
                group: "OPA, Spaces mode",
                title: "EditMode",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/spacesMode/journeys/EditMode"
                    }
                }
            },
            HierarchyMenu: {
                group: "OPA, Spaces mode",
                title: "HierarchyMenu",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/spacesMode/journeys/HierarchyMenu"
                    }
                }
            },
            HomeApp: {
                group: "OPA, Spaces mode",
                title: "HomeApp",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/spacesMode/journeys/HomeApp"
                    }
                }
            },
            MenuBarPersonalization: {
                group: "OPA, Spaces mode",
                title: "MenuBarPersonalization",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/spacesMode/journeys/MenuBarPersonalization"
                    }
                }
            },
            MenuBarAccessibility: {
                group: "OPA, Spaces mode",
                title: "MenuBarAccessibility",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/spacesMode/journeys/MenuBarAccessibility"
                    }
                }
            },
            MenuBarPersonalizationWithoutHomeApp: {
                group: "OPA, Spaces mode",
                title: "MenuBarPersonalizationWithoutHomeApp",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/spacesMode/journeys/MenuBarPersonalizationWithoutHomeApp"
                    }
                }
            },
            RuntimeTests: {
                group: "OPA, Spaces mode",
                title: "RuntimeTests",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/spacesMode/journeys/RuntimeTests"
                    }
                }
            },
            AboutDialog: {
                group: "OPA, miscellaneous",
                title: "AboutDialog",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/userSettings/journeys/AboutDialog"
                    }
                }
            },
            AllMyAppsMenu: {
                group: "OPA, miscellaneous",
                title: "AllMyAppsMenu",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/spacesMode/journeys/AllMyAppsMenu"
                    }
                }
            },
            FlpBootstrap: {
                group: "OPA, miscellaneous",
                title: "FlpBootstrap",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/FlpBootstrap",
                        "sap/ushell/shells/sandbox": "test-resources/sap/ushell/shells/sandbox",
                        "sap/ushell/shells/cdm": "test-resources/sap/ushell/shells/cdm"
                    }
                }
            },
            Sandbox2: {
                group: "OPA, miscellaneous",
                title: "Sandbox2",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/Sandbox2Test"
                    }
                }
            },
            UnblockHeader: {
                group: "OPA, miscellaneous",
                title: "Unblock Shell Header by navigation",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/spacesMode/journeys/UnblockHeader"
                    }
                }
            },
            UserDefaults: {
                group: "OPA, miscellaneous",
                title: "UserDefaults",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/userSettings/journeys/UserDefaults",
                        sandbox: "test-resources/sap/ushell/bootstrap/sandbox"
                    }
                }
            },
            basicIsolationAppLoad: {
                group: "OPAtests",
                title: "basicIsolationAppLoad",
                module: "test-resources/sap/ushell/test/opaTests/basicIsolationAppLoad",
                autostart: true
            },
            CozyCompact: {
                group: "OPAtests",
                title: "CozyCompact",
                module: "test-resources/sap/ushell/test/opaTests/cozyCompact/CozyCompact"
            },
            PersonalizationRestart: {
                group: "OPAtests",
                title: "PersonalizationRestart",
                module: "test-resources/sap/ushell/test/opaTests/rta/PersonalizationRestart",
                qunit: {
                    testTimeout: 100000
                }
            },
            VariantsNavigation: {
                group: "OPAtests",
                title: "VariantsNavigation",
                module: "test-resources/sap/ushell/test/opaTests/rta/VariantsNavigation",
                qunit: {
                    testTimeout: 100000
                }
            },
            stateLean: {
                group: "OPAtests",
                title: "stateLean",
                module: "test-resources/sap/ushell/test/opaTests/stateLean/stateLean"
            }
        }
    };
});
