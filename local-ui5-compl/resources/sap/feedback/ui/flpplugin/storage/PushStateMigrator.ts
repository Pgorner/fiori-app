import Log from 'sap/base/Log';
import LocalStorageHandler from './LocalStorageHandler';
import Constants from '../common/Constants';
import { UserState } from '../common/Types';

export default class PushStateMigrator {
	// returns 'false' only in case of failure while migrating the push state (worst case) else 'true'
	static migrate(): boolean {
		const userState = LocalStorageHandler.getUserState();
		if (userState) {
			if (this.isOldPushStateAvailable(userState)) {
				const newUserState = this.getNewUserState(userState);
				return LocalStorageHandler.updateUserState(newUserState);
			} else {
				Log.debug(Constants.DEBUG.NO_OLD_PUSH_STATE, undefined, Constants.COMPONENT.PUSH_STATE_MIGRATOR);
			}
		}
		return true;
	}

	private static isOldPushStateAvailable(userState: UserState): boolean {
		if (userState.dynamicPushDate || userState.inAppPushDate || userState.featurePushStates) {
			return true;
		}
		return false;
	}

	private static getNewUserState(userState: UserState): UserState {
		const keyValues = Object.keys(userState).map((key) => {
			const newKey = this.pushStateKeyMap[key] || key;
			return { [newKey]: userState[key as keyof UserState] };
		});
		return Object.assign({}, ...keyValues);
	}

	private static get pushStateKeyMap(): {
		[x: string]: keyof UserState;
	} {
		return { dynamicPushDate: 'timedPushDate', inAppPushDate: 'appPushDate', featurePushStates: 'appPushStates' };
	}
}
