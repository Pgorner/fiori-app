import { ThemeId } from '@sap-px/pxapi';
import UI5Util from '../common/UI5Util';
import LocalStorageHandler from '../storage/LocalStorageHandler';

export default class ThemeData {
	public static initLastTheme() {
		const currentThemeId = UI5Util.getThemeId();
		let lastThemeId = currentThemeId;
		const userState = LocalStorageHandler.getUserState();
		if (userState && userState.lastTheme) {
			lastThemeId = ThemeId[userState.lastTheme as keyof typeof ThemeId];
			if (!lastThemeId) {
				lastThemeId = currentThemeId;
			}
		}
		this.updateThemeState(lastThemeId, currentThemeId);
	}

	public static updateCurrentTheme(newCurrentThemeId: ThemeId) {
		// Required as test are currently JavaScript based and input is string and invalid values not prohibited.
		const newThemeId = ThemeId[newCurrentThemeId as keyof typeof ThemeId] || ThemeId.none;
		const userState = LocalStorageHandler.getUserState();
		if (userState) {
			const lastCurrentThemeId = ThemeId[userState.currentTheme as keyof typeof ThemeId] || ThemeId.none;
			if (lastCurrentThemeId !== newThemeId) {
				this.updateThemeState(lastCurrentThemeId, newThemeId);
			}
		}
	}

	public static updateThemeState(newLastThemeId: ThemeId, currentThemeId: ThemeId) {
		LocalStorageHandler.updateLastTheme(newLastThemeId);
		LocalStorageHandler.updateCurrentTheme(currentThemeId);
	}

	public static getPreviousTheme(): ThemeId {
		const userState = LocalStorageHandler.getUserState();
		if (userState) {
			return ThemeId[userState.lastTheme as keyof typeof ThemeId] || ThemeId.none;
		}
		return ThemeId.none;
	}
}
