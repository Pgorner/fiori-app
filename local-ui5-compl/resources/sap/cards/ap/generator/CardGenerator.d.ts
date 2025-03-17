/// <reference types="openui5" />
declare module "sap/cards/ap/generator/CardGenerator" {
    import Component from "sap/ui/core/Component";
    import type Control from "sap/ui/core/Control";
    enum CardTypes {
        INTEGRATION = "integration",
        ADAPTIVE = "adaptive"
    }
    let cardGeneratorDialog: Promise<Control | Control[]> | undefined;
    function initializeAsync(oAppComponent: Component): Promise<void>;
}
//# sourceMappingURL=CardGenerator.d.ts.map