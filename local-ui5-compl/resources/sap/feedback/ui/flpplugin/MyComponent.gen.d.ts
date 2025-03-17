declare module "sap/feedback/ui/flpplugin/MyComponent" {
import { PropertyBindingInfo } from 'sap/ui/base/ManagedObject';
import { $ComponentSettings } from 'sap/ui/core/Component';

declare module './Component' {
	/**
	 * Interface defining the settings object used in constructor calls
	 */
	interface $MyComponentSettings extends $ComponentSettings {
		/**
         * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
        Specifies the url for the Web/App Feedback project which should be loaded. This property is mandatory when providing the configuration manually.
         */
		url?: string | PropertyBindingInfo;

		/**
		 * Specifies the unique tenant id to map feedback results to this tenant. This property is mandatory when providing the configuration manually.
		 */
		tenantId?: string | PropertyBindingInfo;

		/**
         * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
        The tenant role provides an indicator of the tenant and its purpose (development, test, productive, etc.). Helpful to identify feedback from different source systems.
         */
		tenantRole?: string | PropertyBindingInfo;

		/**
         * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
        Enables some new features and changes the data format for the context data collected with the survey to version 2.
         */
		isPushEnabled?: boolean | PropertyBindingInfo | `{${string}}`;

		/**
         * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
        Internal usage only
         */
		pushChannelPath?: string | PropertyBindingInfo;

		/**
		 * Can be provided with the collected context data to the survey to allow filtering of survey results by product name.
		 */
		productName?: string | PropertyBindingInfo;

		/**
		 * Can be provided with the collected context data to the survey to allow filtering of survey results by platform type.
		 */
		platformType?: string | PropertyBindingInfo;

		/**
         * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
        Optional comma-separated string list of scope items to enable single features.
         */
		scopeSet?: string | PropertyBindingInfo;

		/**
		 * Identification data to select and load respective Central configuration.
		 */
		configIdentifier?: object | PropertyBindingInfo | `{${string}}`;

		/**
		 * Configuration providing all necessary information to start and run.
		 */
		configJson?: object | PropertyBindingInfo | `{${string}}`;
	}

	export default interface MyComponent {
		// property: url

		/**
         * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
        Specifies the url for the Web/App Feedback project which should be loaded. This property is mandatory when providing the configuration manually.
         */
		getUrl(): string;

		/**
         * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
        Specifies the url for the Web/App Feedback project which should be loaded. This property is mandatory when providing the configuration manually.
         */
		setUrl(url: string): this;

		// property: tenantId

		/**
		 * Specifies the unique tenant id to map feedback results to this tenant. This property is mandatory when providing the configuration manually.
		 */
		getTenantId(): string;

		/**
		 * Specifies the unique tenant id to map feedback results to this tenant. This property is mandatory when providing the configuration manually.
		 */
		setTenantId(tenantId: string): this;

		// property: tenantRole

		/**
         * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
        The tenant role provides an indicator of the tenant and its purpose (development, test, productive, etc.). Helpful to identify feedback from different source systems.
         */
		getTenantRole(): string;

		/**
         * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
        The tenant role provides an indicator of the tenant and its purpose (development, test, productive, etc.). Helpful to identify feedback from different source systems.
         */
		setTenantRole(tenantRole: string): this;

		// property: isPushEnabled

		/**
         * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
        Enables some new features and changes the data format for the context data collected with the survey to version 2.
         */
		getIsPushEnabled(): boolean;

		/**
         * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
        Enables some new features and changes the data format for the context data collected with the survey to version 2.
         */
		setIsPushEnabled(isPushEnabled: boolean): this;

		// property: pushChannelPath

		/**
         * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
        Internal usage only
         */
		getPushChannelPath(): string;

		/**
         * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
        Internal usage only
         */
		setPushChannelPath(pushChannelPath: string): this;

		// property: productName

		/**
		 * Can be provided with the collected context data to the survey to allow filtering of survey results by product name.
		 */
		getProductName(): string;

		/**
		 * Can be provided with the collected context data to the survey to allow filtering of survey results by product name.
		 */
		setProductName(productName: string): this;

		// property: platformType

		/**
		 * Can be provided with the collected context data to the survey to allow filtering of survey results by platform type.
		 */
		getPlatformType(): string;

		/**
		 * Can be provided with the collected context data to the survey to allow filtering of survey results by platform type.
		 */
		setPlatformType(platformType: string): this;

		// property: scopeSet

		/**
         * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
        Optional comma-separated string list of scope items to enable single features.
         */
		getScopeSet(): string;

		/**
         * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
        Optional comma-separated string list of scope items to enable single features.
         */
		setScopeSet(scopeSet: string): this;

		// property: configIdentifier

		/**
		 * Identification data to select and load respective Central configuration.
		 */
		getConfigIdentifier(): object;

		/**
		 * Identification data to select and load respective Central configuration.
		 */
		setConfigIdentifier(configIdentifier: object): this;

		// property: configJson

		/**
		 * Configuration providing all necessary information to start and run.
		 */
		getConfigJson(): object;

		/**
		 * Configuration providing all necessary information to start and run.
		 */
		setConfigJson(configJson: object): this;
	}
}
