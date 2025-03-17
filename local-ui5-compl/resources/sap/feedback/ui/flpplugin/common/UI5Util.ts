import { ThemeId } from '@sap-px/pxapi';
import Localization from 'sap/base/i18n/Localization';
import EventBus from 'sap/ui/core/EventBus';
import Theming from 'sap/ui/core/Theming';
import Container from 'sap/ushell/Container';
import AppLifeCycle, { CurrentApplication } from 'sap/ushell/services/AppLifeCycle';
import ShellExtension from 'sap/ushell/services/Extension';
import Util from './Util';

export default class UI5Util {
	public static async getShellContainer(): Promise<Container> {
		//ActionItem: UI5 2.0 Refactoring required
		// Done but untested & workaround
		return new Promise((fnResolve) => {
			sap.ui.require(['sap/ushell/Container'], (Container: Container) => {
				fnResolve(Container);
			});
		});
	}

	public static async getAppLifeCycleService(): Promise<AppLifeCycle> {
		const shellContainer = await this.getShellContainer();
		// ActionItem: As per JSDoc, getServiceAsync returns 'Promise<sap.ushell.services.Service>' as return value
		const appLifeCycleService = shellContainer.getServiceAsync('AppLifeCycle') as unknown;
		return appLifeCycleService as AppLifeCycle;
	}

	public static async getExtensionService(): Promise<ShellExtension> {
		const shellContainer = await this.getShellContainer();
		// ActionItem: As per JSDoc, getServiceAsync returns 'Promise<sap.ushell.services.Service>' as return value
		const appLifeCycleService = shellContainer.getServiceAsync('Extension') as unknown;
		return appLifeCycleService as ShellExtension;
	}

	public static async getCurrentApp(): Promise<CurrentApplication | undefined> {
		const appAppLifeCycleService = await this.getAppLifeCycleService();
		return appAppLifeCycleService.getCurrentApplication();
	}

	public static getTheme(): string {
		//ActionItem:  UI5 2.0 Refactoring required
		// Done but untested
		return Theming.getTheme();
	}

	public static getThemeId(): ThemeId {
		//ActionItem:  UI5 2.0 Refactoring required
		// Done but untested
		const themeId = this.getTheme();
		return Util.convertStringToThemeId(themeId);
	}

	public static getLanguage(): string {
		//ActionItem:  UI5 2.0 Refactoring required
		// Done but untested
		return Localization.getLanguage();
	}

	public static getEventBus(): EventBus {
		return EventBus.getInstance();
	}
}
