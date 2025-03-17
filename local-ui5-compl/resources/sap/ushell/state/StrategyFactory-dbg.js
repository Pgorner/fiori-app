// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/ushell/state/StateManager/Operation",
    "sap/ushell/state/StrategyFactory/DefaultStrategy",
    "sap/ushell/state/StrategyFactory/FloatingActionsStrategy",
    "sap/ushell/state/StrategyFactory/FloatingContainerStrategy",
    "sap/ushell/state/StrategyFactory/HeadItemsStrategy",
    "sap/ushell/state/StrategyFactory/HeadEndItemsStrategy",
    "sap/ushell/state/StrategyFactory/SidePaneStrategy",
    "sap/ushell/state/StrategyFactory/SubHeaderStrategy",
    "sap/ushell/state/StrategyFactory/UserActionsStrategy"
], function (
    ObjectPath,
    Operation,
    DefaultStrategy,
    FloatingActionsStrategy,
    FloatingContainerStrategy,
    HeadItemsStrategy,
    HeadEndItemsStrategy,
    SidePaneStrategy,
    SubHeaderStrategy,
    UserActionsStrategy
) {
    "use strict";

    /**
     * @alias sap.ushell.state.StrategyFactory
     * @namespace
     * @description This class provides strategies for adding, removing, and setting properties on the state object.
     * The strategies ensure that the state object is updated consistently.
     * Default strategies are provided for properties that do not have a specific strategy.
     *
     * @since 1.127.0
     * @private
     */
    class StrategyFactory {
        /**
         * Performs the operation on the state data.
         * The operation is done in place.
         * @param {object} oStateData The state data.
         * @param {sap.ushell.state.StateManager.Path} sPath The path to the property that should be updated.
         * @param {sap.ushell.state.StateManager.Operation} sOperation The operation that should be performed.
         * @param {any} vValue The value that should be set.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.StrategyFactory#perform
         */
        perform (oStateData, sPath, sOperation, vValue) {
            const fnStrategy = this.#getStrategy(sPath, sOperation);

            if (sOperation === Operation.Add || sOperation === Operation.Remove) {
                this.#performListOperation(oStateData, sPath, vValue, fnStrategy);
                return;
            }

            this.#performPropertyOperation(oStateData, sPath, vValue, fnStrategy);
        }

        /**
         * Performs the operation on a list.
         * The operation is done in place.
         * Ensures that the handler is called with the correct values.
         * @param {object} oStateData The state data.
         * @param {sap.ushell.state.StateManager.Path} sPath The path to the property that should be updated.
         * @param {any} vValue The value that should be set.
         * @param {function} fnStrategy The strategy function that should be used to perform the operation.
         *
         * @since 1.127.0
         * @private
         */
        #performListOperation (oStateData, sPath, vValue, fnStrategy) {
            const aList = ObjectPath.get(sPath, oStateData);
            if (!aList) {
                throw new Error(`Invalid path: ${sPath}`);
            }
            if (!Array.isArray(aList)) {
                throw new Error(`The path ${sPath} does not point to an array.`);
            }
            fnStrategy(aList, vValue);
        }

        /**
         * Performs the operation on a property.
         * The operation is done in place.
         * Ensures that the handler is called with the correct values.
         * @param {object} oStateData The state data.
         * @param {sap.ushell.state.StateManager.Path} sPath The path to the property that should be updated.
         * @param {any} vValue The value that should be set.
         * @param {function} fnStrategy The strategy function that should be used to perform the operation.
         *
         * @since 1.127.0
         * @private
         */
        #performPropertyOperation (oStateData, sPath, vValue, fnStrategy) {
            let sKey;
            let oParentNode;
            if (sPath.lastIndexOf(".") < 0) {
                // root node: e.g. "application"
                sKey = sPath;
                oParentNode = oStateData;
            } else {
                // nested path: e.g. "application.title"

                sKey = sPath.substring(sPath.lastIndexOf(".") + 1);
                const sParentNodePath = sPath.substring(0, sPath.lastIndexOf("."));
                oParentNode = ObjectPath.get(sParentNodePath, oStateData);
            }

            if (!oParentNode || !Object.hasOwn(oParentNode, sKey)) {
                throw new Error(`Invalid path: ${sPath}`);
            }

            fnStrategy(oParentNode, sKey, vValue);
        }

        /**
         * Returns the strategy function that should be used to perform the operation.
         * Provides a default strategy if no specific strategy is available.
         * @param {sap.ushell.state.StateManager.Path} sPath The path to the property that should be updated.
         * @param {sap.ushell.state.StateManager.Operation} sOperation The operation that should be performed.
         * @returns {function} The strategy function.
         *
         * @since 1.127.0
         * @private
         */
        #getStrategy (sPath, sOperation) {
            let fnStrategy;
            switch (sPath) {
                case "header.headItems":
                    fnStrategy = HeadItemsStrategy[sOperation]?.bind(HeadItemsStrategy);
                    break;

                case "header.headEndItems":
                    fnStrategy = HeadEndItemsStrategy[sOperation]?.bind(HeadEndItemsStrategy);
                    break;

                case "userActions.items":
                    fnStrategy = UserActionsStrategy[sOperation]?.bind(UserActionsStrategy);
                    break;

                case "floatingActions.items":
                    fnStrategy = FloatingActionsStrategy[sOperation]?.bind(FloatingActionsStrategy);
                    break;

                case "floatingContainer.items":
                    fnStrategy = FloatingContainerStrategy[sOperation]?.bind(FloatingContainerStrategy);
                    break;

                case "sidePane.items":
                    fnStrategy = SidePaneStrategy[sOperation]?.bind(SidePaneStrategy);
                    break;

                case "subHeader.items":
                    fnStrategy = SubHeaderStrategy[sOperation]?.bind(SubHeaderStrategy);
                    break;

                default:
                    // default strategy is set below
            }

            if (!fnStrategy) {
                fnStrategy = DefaultStrategy[sOperation]?.bind(DefaultStrategy);
            }

            return fnStrategy;
        }
    }

    return new StrategyFactory();

});
