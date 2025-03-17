declare module "sap/cux/home/flexibility/Layout.flexibility" {
    export enum CHANGE_TYPES {
        HIDE = "hideControl",
        UNHIDE = "unhideControl",
        MOVE = "moveControls",
        PAGE_COLOR = "applyPageColor",
        SPACE_COLOR = "applySpaceColor",
        PAGE_ICON = "applyPageIcon",
        SPACE_ICON = "applySpaceIcon",
        NEWS_FEED_URL = "changeNewsFeedURL",
        NEWS_FEED_VISIBILITY = "setNewsFeedVisibility"
    }
    const _default: {
        moveControls: {
            layers: {
                USER: boolean;
            };
            changeHandler: object;
        };
        hideControl: string;
        unhideControl: string;
        applySpaceColor: {
            layers: {
                CUSTOMER: boolean;
            };
            changeHandler: {
                applyChange: (change: import("sap/cux/home/interface/KeyUserInterface").IKeyUserChangeObject, control: import("sap/ui/core/Control").default) => boolean;
                revertChange: (change: import("sap/cux/home/interface/KeyUserInterface").IKeyUserChangeObject, control: import("sap/ui/core/Control").default) => void;
                completeChangeContent: () => void;
                getCondenserInfo: (change: import("sap/cux/home/interface/KeyUserInterface").IKeyUserChangeObject) => {
                    affectedControl: object;
                    classification: string;
                    uniqueKey: string;
                };
            };
        };
        applyPageColor: {
            layers: {
                CUSTOMER: boolean;
            };
            changeHandler: {
                applyChange: (change: import("sap/cux/home/interface/KeyUserInterface").IKeyUserChangeObject, control: import("sap/ui/core/Control").default) => boolean;
                revertChange: (change: import("sap/cux/home/interface/KeyUserInterface").IKeyUserChangeObject, control: import("sap/ui/core/Control").default) => void;
                completeChangeContent: () => void;
                getCondenserInfo: (change: import("sap/cux/home/interface/KeyUserInterface").IKeyUserChangeObject) => {
                    affectedControl: object;
                    classification: string;
                    uniqueKey: string;
                };
            };
        };
        applySpaceIcon: {
            layers: {
                CUSTOMER: boolean;
            };
            changeHandler: {
                applyChange: (change: import("sap/cux/home/interface/KeyUserInterface").IKeyUserChangeObject, control: import("sap/ui/core/Control").default) => boolean;
                revertChange: (change: import("sap/cux/home/interface/KeyUserInterface").IKeyUserChangeObject, control: import("sap/ui/core/Control").default) => void;
                completeChangeContent: () => void;
                getCondenserInfo: (change: import("sap/cux/home/interface/KeyUserInterface").IKeyUserChangeObject) => {
                    affectedControl: object;
                    classification: string;
                    uniqueKey: string;
                };
            };
        };
        applyPageIcon: {
            layers: {
                CUSTOMER: boolean;
            };
            changeHandler: {
                applyChange: (change: import("sap/cux/home/interface/KeyUserInterface").IKeyUserChangeObject, control: import("sap/ui/core/Control").default) => boolean;
                revertChange: (change: import("sap/cux/home/interface/KeyUserInterface").IKeyUserChangeObject, control: import("sap/ui/core/Control").default) => void;
                completeChangeContent: () => void;
                getCondenserInfo: (change: import("sap/cux/home/interface/KeyUserInterface").IKeyUserChangeObject) => {
                    affectedControl: object;
                    classification: string;
                    uniqueKey: string;
                };
            };
        };
        changeNewsFeedURL: {
            layers: {
                CUSTOMER: boolean;
            };
            changeHandler: {
                applyChange: (change: import("sap/cux/home/interface/KeyUserInterface").IKeyUserChangeObject, control: import("sap/ui/core/Control").default) => boolean;
                revertChange: (change: import("sap/cux/home/interface/KeyUserInterface").IKeyUserChangeObject, control: import("sap/ui/core/Control").default) => void;
                completeChangeContent: () => void;
                getCondenserInfo: (change: import("sap/cux/home/interface/KeyUserInterface").IKeyUserChangeObject) => {
                    affectedControl: object;
                    classification: string;
                    uniqueKey: string;
                };
            };
        };
        setNewsFeedVisibility: {
            layers: {
                CUSTOMER: boolean;
            };
            changeHandler: {
                applyChange: (change: import("sap/cux/home/interface/KeyUserInterface").IKeyUserChangeObject, control: import("sap/ui/core/Control").default) => boolean;
                revertChange: (change: import("sap/cux/home/interface/KeyUserInterface").IKeyUserChangeObject, control: import("sap/ui/core/Control").default) => void;
                completeChangeContent: () => void;
                getCondenserInfo: (change: import("sap/cux/home/interface/KeyUserInterface").IKeyUserChangeObject) => {
                    affectedControl: object;
                    classification: string;
                    uniqueKey: string;
                };
            };
        };
    };
    export default _default;
}
//# sourceMappingURL=Layout.flexibility.d.ts.map