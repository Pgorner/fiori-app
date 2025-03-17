import { ThemeId } from '@sap-px/pxapi';
import { PushFeedbackRequestData } from '@sap-px/pxapi/dist/api/common/Types';
import ResourceBundle from 'sap/base/i18n/ResourceBundle';
import Log from 'sap/base/Log';
import Theming, { Theming$AppliedEvent } from 'sap/ui/core/Theming';
import Constants from '../common/Constants';
import UI5Util from '../common/UI5Util';
import Util from '../common/Util';
import AppContextData from '../data/AppContextData';
import ThemeData from '../data/ThemeData';
import PxApiWrapper from '../pxapi/PxApiWrapper';
import ShellBarButton from '../ui/ShellBarButton';

export default class PluginController {
	private _pxApiWrapper: PxApiWrapper;
	private _resourceBundle: ResourceBundle;

	constructor(pxApiWrapper: PxApiWrapper, resourceBundle: ResourceBundle) {
		this._pxApiWrapper = pxApiWrapper;
		this._resourceBundle = resourceBundle;
	}

	// init
	async initPlugin(): Promise<void> {
		if (this._pxApiWrapper.pxApi.isUserInitiatedFeedbackEnabled) {
			await this.initUserInitiatedFeedback();
		}
		this.prepareThemingSupport();
		this.initAppTriggeredPush();
	}

	private prepareThemingSupport() {
		ThemeData.initLastTheme();
		this._pxApiWrapper.updateThemeId(UI5Util.getTheme() as ThemeId);
		this.subscribeThemeChanged();
	}

	private async initUserInitiatedFeedback(): Promise<void> {
		await ShellBarButton.initShellBarButton(this._resourceBundle, this.openSurveyCallback.bind(this));
	}

	private subscribeThemeChanged() {
		//ActionItem:  UI5 2.0 Refactoring required
		// Done but untested
		Theming.attachApplied(this.themeChanged.bind(this));
	}

	private themeChanged(eventData: Theming$AppliedEvent) {
		this.onThemeChanged(eventData.theme);
	}

	private async openSurveyCallback(): Promise<void> {
		try {
			const appContextData = await AppContextData.getData();
			this._pxApiWrapper.openSurvey(appContextData);
		} catch (error: unknown) {
			let message;
			if (error instanceof Error) {
				message = error.message;
			}
			Log.error(Constants.ERROR.CANNOT_TRIGGER_USER_INITIATED_FEEDBACK, message, Constants.COMPONENT.PLUGIN_CONTROLLER);
		}
	}

	private onThemeChanged(themeId: string) {
		const newThemeId = Util.convertStringToThemeId(themeId);
		this._pxApiWrapper.updateThemeId(newThemeId);
		ThemeData.updateCurrentTheme(newThemeId);
	}

	private initAppTriggeredPush(): void {
		UI5Util.getEventBus().subscribe(Constants.EVENT_BUS.CHANNEL_ID, Constants.EVENT_BUS.EVENT_ID, this.eventBusCallback, this);
	}

	private eventBusCallback(_: string, __: string, eventData: any): void {
		this._pxApiWrapper.requestPush(eventData as PushFeedbackRequestData);
	}

	private unsubscribeFromTheEventBusForTesting(): void {
		UI5Util.getEventBus().unsubscribe(Constants.EVENT_BUS.CHANNEL_ID, Constants.EVENT_BUS.EVENT_ID, this.eventBusCallback, this);
	}
}
