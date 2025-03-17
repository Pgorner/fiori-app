declare module "sap/cux/home/interface/KeyUserInterface" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import Control from "sap/ui/core/Control";
    import { CHANGE_TYPES } from "sap/cux/home/flexibility/Layout.flexibility";
    interface IKeyUserChange {
        selectorControl: Control;
        changeSpecificData: IChangeSpecificData;
    }
    interface IChangeSpecificData {
        changeType: CHANGE_TYPES;
        content?: object;
    }
    interface INewsFeedVisibiliyChange {
        isNewsFeedVisible?: boolean;
    }
    interface INewsPersData {
        validUrl?: boolean;
        oldValidUrl?: boolean;
        newsFeedURL?: string;
        oldNewsFeedUrl?: string;
        showCustomNewsFeed?: boolean;
        oldShowCustomNewsFeed?: boolean;
        customNewsFeedKey?: string;
        oldCustomNewsFeedKey?: string;
        customNewsFeedFileName?: string;
    }
    interface IMovedElement {
        id: string;
        sourceIndex?: number;
        targetIndex?: number;
        element?: unknown;
    }
    interface ISourceTarget {
        id: string;
        parent: IParent;
        publicAggregation: unknown;
        aggregation: unknown;
    }
    interface ISpecificChangeInfo {
        content: {
            movedElements: Array<IMovedElement>;
            source: ISourceTarget;
            target: ISourceTarget;
        };
        movedElements: Array<IMovedElement>;
        source: ISourceTarget;
        target: ISourceTarget;
    }
    interface IModifier {
        bySelector: (id: string, oAppComponent: unknown) => unknown;
        getControlType: (oParent: IParent) => string;
        getSelector: (id: unknown, oAppComponent: unknown, mAdditionalInfo?: unknown) => unknown;
    }
    interface IParent {
        getId: () => string;
    }
    interface IChange {
        addDependentControl: (id: string | string[], alias: string, mPropertyBag: unknown) => void;
        setContent: (content: unknown) => void;
    }
    interface IpropertyBag {
        modifier: IModifier;
        appComponent: unknown;
    }
    interface IContent {
        movedElements: Array<unknown>;
        source: {
            selector: unknown;
        };
        target: {
            selector: unknown;
        };
    }
    interface ISpacePagePersonalization {
        spaceId?: string;
        BGColor?: string;
        oldColor?: string;
        applyColorToAllPages?: boolean;
        oldApplyColorToAllPages?: boolean;
        pageId?: string;
        icon?: string;
        oldIcon?: string;
    }
    interface IKeyUserChangeObject {
        getSelector: () => object;
        getContent: () => object;
    }
}
//# sourceMappingURL=KeyUserInterface.d.ts.map