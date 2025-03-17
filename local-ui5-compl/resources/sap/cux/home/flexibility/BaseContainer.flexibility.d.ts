declare module "sap/cux/home/flexibility/BaseContainer.flexibility" {
    import BaseContainer from "sap/cux/home/BaseContainer";
    import { IKeyUserChange } from "sap/cux/home/interface/KeyUserInterface";
    enum Action {
        applyChange = "applyChange",
        revertChange = "revertChange"
    }
    type ChangeHandler = {
        applyChange: (change: IKeyUserChange, control: BaseContainer, propertyBag: object) => Promise<void>;
        revertChange: (change: IKeyUserChange, control: BaseContainer, propertyBag: object) => Promise<void>;
    };
    const resetLayoutSections: (changeType: ChangeHandler, action: Action, change: IKeyUserChange, control: BaseContainer, propertyBag: object) => Promise<void>;
    const _default: {
        hideControl: {
            layers: {
                USER: boolean;
            };
            changeHandler: ChangeHandler;
        };
        unhideControl: {
            layers: {
                USER: boolean;
            };
            changeHandler: ChangeHandler;
        };
    };
    export default _default;
}
//# sourceMappingURL=BaseContainer.flexibility.d.ts.map