declare module "sap/feedback/ui/flpplugin/Component" {
    import Component from 'sap/ui/core/Component';
    /**
     *
     * @namespace sap.feedback.ui.flpplugin
     *
     * @class
     * Enables users to provide feedback in the Fiori Launchpad.
     *
     * @extends sap.ui.core.Component
     * @name sap.feedback.ui.flpplugin.Component
     * @author SAP SE
     * @since 1.90.0
     */
    export default class MyComponent extends Component {
        static readonly metadata: {
            manifest: string;
            properties: {
                /**
                 * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
                 * Specifies the url for the Web/App Feedback project which should be loaded. This property is mandatory when providing the configuration manually.
                 */
                url: {
                    name: string;
                    type: string;
                };
                /**
                 * Specifies the unique tenant id to map feedback results to this tenant. This property is mandatory when providing the configuration manually.
                 */
                tenantId: {
                    name: string;
                    type: string;
                };
                /**
                 * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
                 * The tenant role provides an indicator of the tenant and its purpose (development, test, productive, etc.). Helpful to identify feedback from different source systems.
                 */
                tenantRole: {
                    name: string;
                    type: string;
                };
                /**
                 * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
                 * Enables some new features and changes the data format for the context data collected with the survey to version 2.
                 */
                isPushEnabled: {
                    name: string;
                    type: string;
                };
                /**
                 * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
                 * Internal usage only
                 */
                pushChannelPath: {
                    name: string;
                    type: string;
                };
                /**
                 * Can be provided with the collected context data to the survey to allow filtering of survey results by product name.
                 */
                productName: {
                    name: string;
                    type: string;
                };
                /**
                 * Can be provided with the collected context data to the survey to allow filtering of survey results by platform type.
                 */
                platformType: {
                    name: string;
                    type: string;
                };
                /**
                 * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
                 * Optional comma-separated string list of scope items to enable single features.
                 */
                scopeSet: {
                    name: string;
                    type: string;
                };
                /**
                 * Identification data to select and load respective Central configuration.
                 */
                configIdentifier: {
                    name: string;
                    type: string;
                };
                /**
                 * Configuration providing all necessary information to start and run.
                 */
                configJson: {
                    name: string;
                    type: string;
                };
            };
        };
        private _pxApiWrapper;
        constructor(idOrSettings?: string | $MyComponentSettings);
        constructor(id?: string, settings?: $MyComponentSettings);
        init(): void;
        load(): Promise<void>;
        private runInitProcess;
        private initializePluginController;
        private getResourceBundle;
        private readFlpSettings;
        private readComponentData;
        private readProperties;
    }
}
//# sourceMappingURL=Component.d.ts.map