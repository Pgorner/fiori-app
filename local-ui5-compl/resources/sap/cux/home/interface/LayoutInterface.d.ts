declare module "sap/cux/home/interface/LayoutInterface" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import ColumnListItem from "sap/m/ColumnListItem";
    import Component from "sap/ui/core/Component";
    import BaseContainer from "sap/cux/home/BaseContainer";
    import BaseLayout from "sap/cux/home/BaseLayout";
    import Layout from "sap/cux/home/Layout";
    interface IElement {
        completeId: string;
        sContainerType: string;
        blocked: boolean;
        visible: boolean;
        title: string;
        text: string;
    }
    interface IAddResponse {
        key?: string;
    }
    interface IControlPersonalizationWriteAPI {
        add: (settings: {
            changes: IManagePersChanges[];
            appComponent?: Component;
            ignoreVariantManagement: boolean;
        }) => Promise<IAddResponse[]>;
        save: (settings: {
            selector: {
                appComponent: Component | undefined;
            };
            changes: IAddResponse[] | undefined;
        }) => Promise<void>;
        reset: (settings: {
            selectors: (BaseContainer | BaseLayout)[];
            changeTypes: string[];
        }) => Promise<void>;
    }
    interface IDragEvent {
        draggedControl: ColumnListItem;
        droppedControl: ColumnListItem;
    }
    interface IManagePersChanges {
        selectorElement: Layout | BaseContainer;
        changeSpecificData: {
            changeType?: string;
            movedElements?: Array<{
                id: string;
                sourceIndex: number;
                targetIndex: number;
            }>;
            source?: {
                id: string;
                aggregation: string;
            };
            target?: {
                id: string;
                aggregation: string;
            };
        };
    }
}
//# sourceMappingURL=LayoutInterface.d.ts.map