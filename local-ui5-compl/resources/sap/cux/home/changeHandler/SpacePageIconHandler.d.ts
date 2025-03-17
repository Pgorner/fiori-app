declare module "sap/cux/home/changeHandler/SpacePageIconHandler" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import Control from "sap/ui/core/Control";
    import { IKeyUserChangeObject } from "sap/cux/home/interface/KeyUserInterface";
    import NewsAndPagesContainer from "sap/cux/home/NewsAndPagesContainer";
    function getContainer(control: Control): NewsAndPagesContainer;
    const SpacePageIconHandler: {
        applyChange: (change: IKeyUserChangeObject, control: Control) => boolean;
        revertChange: (change: IKeyUserChangeObject, control: Control) => void;
        completeChangeContent: () => void;
        getCondenserInfo: (change: IKeyUserChangeObject) => {
            affectedControl: object;
            classification: string;
            uniqueKey: string;
        };
    };
    export default SpacePageIconHandler;
}
//# sourceMappingURL=SpacePageIconHandler.d.ts.map