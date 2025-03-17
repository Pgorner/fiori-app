declare module "sap/cux/home/BaseContainerRenderer" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import RenderManager from "sap/ui/core/RenderManager";
    import BaseContainer from "sap/cux/home/BaseContainer";
    const _default: {
        apiVersion: number;
        /**
         * Renders the control.
         *
         * @public
         * @override
         * @param {RenderManager} rm - The RenderManager object.
         * @param {BaseContainer} control - The BaseContainer control to be rendered.
         */
        render: (rm: RenderManager, control: BaseContainer) => void;
        /**
         * Renders the content of the control.
         *
         * @private
         * @param {RenderManager} rm - The RenderManager object.
         * @param {BaseContainer} control - The BaseContainer control.
         */
        renderContent: (rm: RenderManager, control: BaseContainer) => void;
    };
    export default _default;
}
//# sourceMappingURL=BaseContainerRenderer.d.ts.map