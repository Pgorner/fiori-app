import ResourceBundle from 'sap/base/i18n/ResourceBundle';
import Component from 'sap/ui/core/Component';
import ResourceModel from 'sap/ui/model/resource/ResourceModel';
import { PluginInfo, RawStartParameters } from './common/Types';
import ControllerFactory from './controller/ControllerFactory';
import PxApiWrapper from './pxapi/PxApiWrapper';
import ControlFactory from './ui/ControlFactory';

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
	static readonly metadata = {
		manifest: 'json',
		properties: {
			/**
			 * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
			 * Specifies the url for the Web/App Feedback project which should be loaded. This property is mandatory when providing the configuration manually.
			 */
			url: {
				name: 'url',
				type: 'string'
			},
			/**
			 * Specifies the unique tenant id to map feedback results to this tenant. This property is mandatory when providing the configuration manually.
			 */
			tenantId: {
				name: 'tenantId',
				type: 'string'
			},
			/**
			 * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
			 * The tenant role provides an indicator of the tenant and its purpose (development, test, productive, etc.). Helpful to identify feedback from different source systems.
			 */
			tenantRole: {
				name: 'tenantRole',
				type: 'string'
			},
			/**
			 * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
			 * Enables some new features and changes the data format for the context data collected with the survey to version 2.
			 */
			isPushEnabled: {
				name: 'isPushEnabled',
				type: 'boolean'
			},
			/**
			 * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
			 * Internal usage only
			 */
			pushChannelPath: {
				name: 'pushChannelPath',
				type: 'string'
			},
			/**
			 * Can be provided with the collected context data to the survey to allow filtering of survey results by product name.
			 */
			productName: {
				name: 'productName',
				type: 'string'
			},
			/**
			 * Can be provided with the collected context data to the survey to allow filtering of survey results by platform type.
			 */
			platformType: {
				name: 'platformType',
				type: 'string'
			},
			/**
			 * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
			 * Optional comma-separated string list of scope items to enable single features.
			 */
			scopeSet: {
				name: 'scopeSet',
				type: 'string'
			},
			/**
			 * Identification data to select and load respective Central configuration.
			 */
			configIdentifier: {
				name: 'configIdentifier',
				type: 'object'
			},
			/**
			 * Configuration providing all necessary information to start and run.
			 */
			configJson: {
				name: 'configJson',
				type: 'object'
			}
		}
	};

	private _pxApiWrapper: PxApiWrapper;

	// The following three lines were generated and should remain as-is to make TypeScript aware of the constructor signatures
	constructor(idOrSettings?: string | $MyComponentSettings);
	constructor(id?: string, settings?: $MyComponentSettings);
	constructor(id?: string, settings?: $MyComponentSettings) {
		super(id, settings);
	}

	public init() {
		(async () => {
			const settings = this.readFlpSettings();
			if (settings) {
				await this.runInitProcess(settings);
			}
		})();
	}

	public async load(): Promise<void> {
		const properties = this.readProperties();
		if (properties) {
			await this.runInitProcess(properties);
		}
	}

	private async runInitProcess(parameters: RawStartParameters) {
		const pluginInfo = {
			id: this.getManifestEntry('/sap.app/id'),
			version: this.getManifestEntry('/sap.app/applicationVersion/version')
		} as PluginInfo;
		const initController = ControllerFactory.createInitController(pluginInfo);
		const invitationDialog = ControlFactory.createSurveyInvitationDialog(this.getResourceBundle());
		const showCallback = invitationDialog.surveyInvitationDialogShowCallback.bind(invitationDialog);
		if (await initController.init(parameters, showCallback)) {
			this._pxApiWrapper = initController.pxApiWrapper;
			if (this._pxApiWrapper) {
				this._pxApiWrapper.invitationDialog = invitationDialog;
				this.initializePluginController();
			}
		}
	}

	private async initializePluginController(): Promise<void> {
		const pluginController = ControllerFactory.createPluginController(this._pxApiWrapper, this.getResourceBundle());
		await pluginController.initPlugin();
	}

	private getResourceBundle(): ResourceBundle {
		const resourceModel = this.getModel('i18n') as ResourceModel;
		return resourceModel.getResourceBundle() as ResourceBundle;
	}

	// FLP Settings
	private readFlpSettings(): RawStartParameters | undefined {
		const componentData = this.readComponentData();
		if (componentData) {
			if (
				(componentData.qualtricsInternalUri && componentData.tenantId && !componentData.configUrl) ||
				(!componentData.qualtricsInternalUri &&
					componentData.tenantId &&
					componentData.configUrl &&
					componentData.unitId &&
					componentData.environment)
			) {
				return componentData as RawStartParameters;
			}
		}
		return undefined;
	}

	private readComponentData(): any | undefined {
		const componentData = this.getComponentData() as any;
		if (componentData && componentData.config) {
			return componentData.config;
		}
		return undefined;
	}

	// Component Properties
	private readProperties(): RawStartParameters | undefined {
		if ((this.getProperty('url') || this.getProperty('configIdentifier') || this.getProperty('configJson')) && this.getProperty('tenantId')) {
			const properties = {
				tenantId: this.getProperty('tenantId'),
				tenantRole: this.getProperty('tenantRole'),
				qualtricsInternalUri: this.getProperty('url'),
				isPushEnabled: this.getProperty('isPushEnabled'),
				pushChannelPath: this.getProperty('pushChannelPath'),
				platformType: this.getProperty('platformType'),
				productName: this.getProperty('productName'),
				scopeSet: this.getProperty('scopeSet'),
				configJson: this.getProperty('configJson')
			} as RawStartParameters;

			if (this.getProperty('configIdentifier')) {
				const configIdentifier = this.getProperty('configIdentifier');
				properties.configUrl = configIdentifier.configUrl;
				properties.unitId = configIdentifier.unitId;
				properties.environment = configIdentifier.environment;
			}
			return properties;
		}
		return undefined;
	}
}
