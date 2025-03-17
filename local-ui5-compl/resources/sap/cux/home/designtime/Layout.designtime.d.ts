declare module "sap/cux/home/designtime/Layout.designtime" {
    import Control from "sap/ui/core/Control";
    const designtime: {
        actions: {
            remove: any;
            settings: {
                icon: string;
                name: string;
                isEnabled: boolean;
                handler: (oWrapperControl: Control, mPropertyBag: Record<string, unknown>) => Promise<unknown>;
            };
        };
    };
    export default designtime;
}
//# sourceMappingURL=Layout.designtime.d.ts.map