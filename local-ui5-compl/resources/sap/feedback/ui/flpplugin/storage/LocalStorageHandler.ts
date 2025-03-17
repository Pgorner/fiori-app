import { ThemeId } from '@sap-px/pxapi';
import Log from 'sap/base/Log';
import Constants from '../common/Constants';
import { UserState } from '../common/Types';

export default class LocalStorageHandler {
	static getUserState(): UserState | undefined {
		try {
			const userStateString = this.getLocalStorage().getItem(Constants.PUSH_STATE_STORAGE_KEY);
			if (userStateString) {
				return JSON.parse(userStateString);
			}
		} catch (error: any) {
			Log.error(Constants.ERROR.UNABLE_TO_PARSE_USER_STATE, error.message, Constants.COMPONENT.LOCAL_STORAGE_HANDLER);
		}
		return undefined;
	}

	static updateUserState(userState: UserState): boolean {
		try {
			if (userState) {
				const userStateString = JSON.stringify(userState);
				this.getLocalStorage().setItem(Constants.PUSH_STATE_STORAGE_KEY, userStateString);
				Log.debug(Constants.DEBUG.PUSH_STATE_MIGRATED);
			}
		} catch (error: any) {
			Log.error(Constants.ERROR.UNABLE_TO_UPDATE_USER_STATE, error.message, Constants.COMPONENT.LOCAL_STORAGE_HANDLER);
			return false;
		}
		return true;
	}

	static updateLastTheme(themeId: ThemeId) {
		const userState = this.getUserState();
		if (userState && themeId) {
			userState.lastTheme = themeId;
			this.updateUserState(userState);
		}
	}

	static updateCurrentTheme(themeId: ThemeId) {
		const userState = this.getUserState();
		if (userState && themeId) {
			userState.currentTheme = themeId;
			this.updateUserState(userState);
		}
	}

	static getLocalStorage(): Storage {
		return localStorage;
	}
}
