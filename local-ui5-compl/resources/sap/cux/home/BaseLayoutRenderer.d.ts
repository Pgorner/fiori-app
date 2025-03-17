declare module "sap/cux/home/BaseLayoutRenderer" {
    import RenderManager from "sap/ui/core/RenderManager";
    import BaseLayout from "sap/cux/home/BaseLayout";
    const _default: {
        apiVersion: number;
        /**
         * Renders the control.
         *
         * @public
         * @override
         * @param {RenderManager} rm - The RenderManager object.
         * @param {BaseLayout} control - The BaseLayout control to be rendered.
         */
        render: (rm: RenderManager, control: BaseLayout) => void;
    };
    export default _default;
}
//# sourceMappingURL=BaseLayoutRenderer.d.ts.map