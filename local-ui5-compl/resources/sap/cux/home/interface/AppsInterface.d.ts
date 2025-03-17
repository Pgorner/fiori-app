declare module "sap/cux/home/interface/AppsInterface" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import GridContainerItemLayoutData from "sap/f/GridContainerItemLayoutData";
    import Control from "sap/ui/core/Control";
    import { dnd } from "sap/ui/core/library";
    import App from "sap/cux/home/App";
    import Group from "sap/cux/home/Group";
    import MenuItem from "sap/cux/home/MenuItem";
    import { ICardManifest } from "sap/cux/home/interface/CardsInterface";
    interface IParseSBParameters {
        tileConfiguration?: object;
        TILE_PROPERTIES?: object;
        semanticObject?: string;
        semanticAction?: string;
        evaluationId?: string;
    }
    interface ICustomVisualization {
        appId?: string;
        oldAppId?: string;
        url?: string;
        leanURL?: string;
        title?: string;
        subtitle?: string;
        BGColor?: string;
        isFav?: boolean;
        isSection?: boolean;
        icon?: string;
        indicatorDataSource?: string;
        isCount?: boolean;
        contentProviderId?: string;
        isSmartBusinessTile?: boolean;
        visualization?: IVisualization;
        persConfig?: IPersConfig;
        setActive?: (val: boolean) => void;
        vizId?: string;
        status?: string;
        menuItems?: MenuItem[];
        addedInFavorites?: boolean;
        pageId?: string;
        refresh?: () => void;
        getDisplayFormat?: () => string;
        setLayoutData?: (data: GridContainerItemLayoutData) => void;
        bindProperty?: (propertyName: string, path: string) => void;
        fioriId?: string;
    }
    interface IPersConfig {
        pageId?: string;
        sectionIndex?: number;
        isDefaultSection?: boolean;
        visualizationIndex?: number;
        sectionId?: string;
        sectionTitle?: string;
        isPresetSection?: boolean;
        duplicateApps?: ICustomVisualization[];
    }
    interface IAppInbounds {
        semanticObject: string;
        action: string;
        signature?: {
            parameters?: {
                "sap-fiori-id"?: {
                    defaultValue: {
                        value?: string;
                    };
                };
            };
        };
        resolutionResult?: {
            applicationDependencies?: {
                name?: string;
                manifest?: ICardManifest;
            };
            ui5ComponentName?: string;
        };
    }
    interface IVisualization {
        id?: string;
        icon?: string;
        info?: string;
        numberUnit?: string;
        vizConfig?: IVisualizationConfig;
        targetURL: string;
        title?: string;
        subtitle?: string;
        contentProviderId?: string;
        vizId: string;
        vizType: string;
        sectionId?: string;
        appIds?: string[];
        ignoreDuplicateApps?: boolean;
        _instantiationData?: {
            chip?: {
                configuration?: object;
                bags?: {
                    sb_tileProperties?: {
                        texts?: {
                            title?: string;
                            description?: string;
                        };
                    };
                };
            };
        };
        target?: {
            semanticObject?: string;
            action?: string;
        };
        indicatorDataSource?: {
            path: string;
        };
        isBookmark?: boolean;
        orgAppId?: string;
        displayFormatHint?: string;
        supportedDisplayFormats?: string;
        dataSource?: object;
    }
    interface ISection {
        id?: string;
        index?: number;
        title?: string;
        isSection?: boolean;
        badge?: string;
        BGColor?: string;
        icon?: string;
        isPresetSection?: boolean;
        apps?: ICustomVisualization[];
        default?: boolean;
        preset?: boolean;
        visualizations?: IVisualization[];
        sectionIndex?: number;
        sectionProperties?: object;
    }
    interface IVisualizationConfig {
        "sap.app": IVisualization;
        "sap.flp": IVisualization;
        "sap.ui": {
            icons: {
                icon: string;
            };
        };
    }
    interface ISectionAndVisualization extends ISection, ICustomVisualization {
    }
    interface IAppPersonalization {
        BGColor: string;
        isSection: boolean;
        sectionId?: string;
        isRecentlyAddedApp: boolean;
        appId?: string;
    }
    interface IItemPersonalization {
        color?: string;
        icon?: string;
    }
    interface IUpdatePersonalizationConfig {
        visualization: ICustomVisualization;
        color?: string;
        isTargetGroupDefault?: boolean;
        targetGroupId?: string;
    }
    interface IActivity {
        title: string;
        url: string;
        appId: string;
        icon: string;
        appType: string;
        timestamp: number;
        orgAppId: string;
        targetURL?: string;
        vizId: string;
        addedInFavorites: boolean;
        dateStamp?: number;
        usageArray?: number[];
    }
    interface IAppPersonalizationConfig {
        appId?: string;
        oldAppId?: string;
        sectionId?: string;
        isSection?: boolean;
        isRecentlyAddedApp?: boolean;
    }
    interface IDragDropInfo {
        dragItem: App | Group;
        dropItem: App | Group;
        dropPosition: dnd.RelativeDropPosition;
        dropControl: Control;
        dragItemIndex: number;
        dropItemIndex: number;
    }
}
//# sourceMappingURL=AppsInterface.d.ts.map