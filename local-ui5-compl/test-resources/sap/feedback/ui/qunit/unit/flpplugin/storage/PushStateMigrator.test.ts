import Log from 'sap/base/Log';
import Constants from 'sap/feedback/ui/flpplugin/common/Constants';
import LocalStorageHandler from 'sap/feedback/ui/flpplugin/storage/LocalStorageHandler';
import PushStateMigrator from 'sap/feedback/ui/flpplugin/storage/PushStateMigrator';
// eslint-disable-next-line import/no-unresolved
import * as sinon from 'sinon';

export default function executePushStateMigratorTests() {
	let debugLogStub: sinon.SinonStub<any[], any>;
	QUnit.module('PushStateMigrator unit tests', {
		beforeEach: function () {
			debugLogStub = sinon.stub(Log, 'debug');
		},

		afterEach: function () {
			debugLogStub.restore();
		}
	});

	QUnit.test('migrate - shall not do anything when userState is not found', (assert) => {
		const getUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns(undefined);
		const setUserStateStub = sinon.stub(LocalStorageHandler, 'updateUserState');

		PushStateMigrator.migrate();

		assert.notOk(setUserStateStub.called);

		getUserStateStub.restore();
		setUserStateStub.restore();
	});

	QUnit.test('migrate - shall not migrate the push state when there is no OLD push state found', (assert) => {
		const getUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns({
			timedPushDate: 1675242558195,
			appPushDate: 1675242558195,
			appPushStates: {},
			version: 0
		});
		const setUserStateStub = sinon.stub(LocalStorageHandler, 'updateUserState');

		PushStateMigrator.migrate();

		assert.notOk(setUserStateStub.called);
		assert.ok(debugLogStub.calledWith(Constants.DEBUG.NO_OLD_PUSH_STATE, undefined, Constants.COMPONENT.PUSH_STATE_MIGRATOR));

		getUserStateStub.restore();
		setUserStateStub.restore();
	});

	QUnit.test('migrate - shall not update the Push state - without Push states', (assert) => {
		const oldUserState = {
			currentTheme: 'my_theme',
			lastTheme: 'my_theme',
			version: 1
		};
		const getUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns(oldUserState);
		const setUserStateStub = sinon.stub(LocalStorageHandler, 'updateUserState');

		PushStateMigrator.migrate();

		assert.notOk(setUserStateStub.called);
		assert.ok(debugLogStub.calledWith(Constants.DEBUG.NO_OLD_PUSH_STATE, undefined, Constants.COMPONENT.PUSH_STATE_MIGRATOR));

		getUserStateStub.restore();
		setUserStateStub.restore();
	});

	QUnit.test('migrate - shall update the Push state with new Keys - with App triggered', (assert) => {
		const oldUserState = {
			currentTheme: 'my_theme',
			featurePushStates: {},
			inAppPushDate: 1675242558195,
			lastTheme: 'my_theme',
			version: 1
		};
		const newUserState = {
			currentTheme: 'my_theme',
			appPushStates: {},
			appPushDate: 1675242558195,
			lastTheme: 'my_theme',
			version: 1
		};
		const getUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns(oldUserState);
		const setUserStateStub = sinon.stub(LocalStorageHandler, 'updateUserState');

		PushStateMigrator.migrate();

		assert.ok(setUserStateStub.calledWith(newUserState));

		getUserStateStub.restore();
		setUserStateStub.restore();
	});

	QUnit.test('migrate - shall update the Push state with new Keys - with Time controlled', (assert) => {
		const oldUserState = {
			currentTheme: 'my_theme',
			dynamicPushDate: 1675242558195,
			lastTheme: 'my_theme',
			version: 1
		};
		const newUserState = {
			currentTheme: 'my_theme',
			timedPushDate: 1675242558195,
			lastTheme: 'my_theme',
			version: 1
		};
		const getUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns(oldUserState);
		const setUserStateStub = sinon.stub(LocalStorageHandler, 'updateUserState');

		PushStateMigrator.migrate();

		assert.ok(setUserStateStub.calledWith(newUserState));

		getUserStateStub.restore();
		setUserStateStub.restore();
	});

	QUnit.test('migrate - shall update the Push state with new Keys - with App push and Time controlled push', (assert) => {
		const oldUserState = {
			currentTheme: 'my_theme',
			dynamicPushDate: 1675242558195,
			featurePushStates: {
				'002/poc': {
					areaId: '007',
					executedCount: 1,
					lastChanged: 1675175919691,
					triggerName: 'pocTrigger',
					triggerType: 'recurring',
					triggeredCount: 1
				}
			},
			inAppPushDate: 1675242558195,
			lastTheme: 'my_theme',
			version: 1
		};
		const newUserState = {
			currentTheme: 'my_theme',
			timedPushDate: 1675242558195,
			appPushStates: {
				'002/poc': {
					areaId: '007',
					executedCount: 1,
					lastChanged: 1675175919691,
					triggerName: 'pocTrigger',
					triggerType: 'recurring',
					triggeredCount: 1
				}
			},
			appPushDate: 1675242558195,
			lastTheme: 'my_theme',
			version: 1
		};
		const getUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns(oldUserState);
		const setUserStateStub = sinon.stub(LocalStorageHandler, 'updateUserState');

		PushStateMigrator.migrate();

		assert.ok(setUserStateStub.calledWith(newUserState));

		getUserStateStub.restore();
		setUserStateStub.restore();
	});
}
