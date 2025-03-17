declare module "sap/cux/home/changeHandler/LayoutHandler" {
    import Control from "sap/ui/core/Control";
    class LayoutHandler {
        private keyuserPersDialog;
        private persDialogResolve;
        private allChanges;
        loadPersonalizationDialog(oWrapperControl: Control, mPropertyBag: Record<string, unknown>): Promise<unknown>;
        onCancelDialog(): void;
        addChanges(aChanges: Array<unknown>): void;
        clearChanges(): void;
        resolve(): void;
    }
    const layoutHandler: LayoutHandler;
    export default layoutHandler;
}
//# sourceMappingURL=LayoutHandler.d.ts.map