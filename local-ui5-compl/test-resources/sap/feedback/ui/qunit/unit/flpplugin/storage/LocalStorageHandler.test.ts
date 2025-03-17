import { ThemeId } from '@sap-px/pxapi';
import Log from 'sap/base/Log';
import Constants from 'sap/feedback/ui/flpplugin/common/Constants';
import { UserState } from 'sap/feedback/ui/flpplugin/common/Types';
import LocalStorageHandler from 'sap/feedback/ui/flpplugin/storage/LocalStorageHandler';
// eslint-disable-next-line import/no-unresolved
import * as sinon from 'sinon';

export default function executeLocalStorageHandlerTests() {
	let errorLogStub: sinon.SinonStub<
			// eslint-disable-next-line @typescript-eslint/ban-types
			[sMessage: string, vDetails?: string | Error | undefined, sComponent?: string | undefined, fnSupportInfo?: Function | undefined],
			void
		>,
		debugLogStub: sinon.SinonStub<
			// eslint-disable-next-line @typescript-eslint/ban-types
			[sMessage: string, vDetails?: string | Error | undefined, sComponent?: string | undefined, fnSupportInfo?: Function | undefined],
			void
		>;
	QUnit.module('LocalStorageHandler unit tests', {
		beforeEach: function () {
			errorLogStub = sinon.stub(Log, 'error');
			debugLogStub = sinon.stub(Log, 'debug');
		},

		afterEach: function () {
			errorLogStub.restore();
			debugLogStub.restore();
		}
	});

	QUnit.test('getUserState - shall catch the error and return undefined if unable to parse the User state', (assert) => {
		const localStorageMock = {
			getItem: sinon.stub().withArgs(Constants.PUSH_STATE_STORAGE_KEY).returns('{{}'),
			setItem: sinon.stub()
		} as any;
		const getLocalStorageStub = sinon.stub(LocalStorageHandler, 'getLocalStorage').returns(localStorageMock);

		const userState = LocalStorageHandler.getUserState();

		assert.equal(userState, undefined);
		assert.ok(errorLogStub.called);

		getLocalStorageStub.restore();
	});

	QUnit.test('getUserState - shall return undefined if User state is not found in local storage', (assert) => {
		const localStorageMock = {
			getItem: sinon.stub().withArgs('something').returns(undefined),
			setItem: sinon.stub()
		} as unknown as Storage;
		const getLocalStorageStub = sinon.stub(LocalStorageHandler, 'getLocalStorage').returns(localStorageMock);

		const userState = LocalStorageHandler.getUserState();

		assert.equal(userState, undefined);
		assert.notOk(errorLogStub.called);

		getLocalStorageStub.restore();
	});

	QUnit.test('getUserState - shall return parsed User state if available', (assert) => {
		const userStateString =
			'{"version":1,"dynamicPushDate":1677316125907,"inAppPushDate":1676192925907,"lastTheme":"sap_fiori_3","currentTheme":"sap_fiori_3","featurePushStates":{"poc/featuretest":{"areaId":"POC","triggerName":"featureTest","triggerType":"recurring","lastChanged":1674637741016,"triggeredCount":1,"executedCount":0},"001/managestockpoc":{"areaId":"001","triggerName":"manageStockPoC","triggerType":"recurring","lastChanged":1674637743467,"triggeredCount":1,"executedCount":0}}}';
		const localStorageMock = {
			getItem: sinon.stub().withArgs(Constants.PUSH_STATE_STORAGE_KEY).returns(userStateString),
			setItem: sinon.stub()
		} as any;
		const getLocalStorageStub = sinon.stub(LocalStorageHandler, 'getLocalStorage').returns(localStorageMock);

		const userState = LocalStorageHandler.getUserState();

		assert.deepEqual(userState, JSON.parse(userStateString));

		getLocalStorageStub.restore();
	});

	QUnit.test('updateUserState - shall catch the error if unable to stringify the User state', (assert) => {
		const stringifyStub = sinon.stub(JSON, 'stringify').throws(new Error());

		const status = LocalStorageHandler.updateUserState({} as UserState);

		assert.ok(errorLogStub.called);
		assert.notOk(status);

		stringifyStub.restore();
	});

	QUnit.test('updateUserState - shall just return true in case if no userState provided', (assert) => {
		const stringifyStub = sinon.stub(JSON, 'stringify').throws(new Error());

		const status = LocalStorageHandler.updateUserState(undefined as unknown as UserState);

		assert.ok(status);

		stringifyStub.restore();
	});

	QUnit.test('updateUserState - shall set the provided local storage object', (assert) => {
		const userStateString =
			'{"version":1,"dynamicPushDate":1677316125907,"inAppPushDate":1676192925907,"lastTheme":"sap_fiori_3","currentTheme":"sap_fiori_3","featurePushStates":{"poc/featuretest":{"areaId":"POC","triggerName":"featureTest","triggerType":"recurring","lastChanged":1674637741016,"triggeredCount":1,"executedCount":0},"001/managestockpoc":{"areaId":"001","triggerName":"manageStockPoC","triggerType":"recurring","lastChanged":1674637743467,"triggeredCount":1,"executedCount":0}}}';
		const userState = JSON.parse(userStateString);
		const localStorageMock = {
			getItem: sinon.stub(),
			setItem: sinon.stub()
		} as any;
		const getLocalStorageStub = sinon.stub(LocalStorageHandler, 'getLocalStorage').returns(localStorageMock);

		const status = LocalStorageHandler.updateUserState(userState);

		assert.ok(localStorageMock.setItem.calledWith(Constants.PUSH_STATE_STORAGE_KEY, userStateString));
		assert.ok(debugLogStub.calledWith(Constants.DEBUG.PUSH_STATE_MIGRATED));
		assert.ok(status);

		getLocalStorageStub.restore();
	});

	QUnit.test('getLocalStorage - nothing but just for the sake of coverage!', (assert) => {
		const localStorage = LocalStorageHandler.getLocalStorage();

		assert.ok(localStorage);
	});

	QUnit.test('updateLastTheme - shall not call updateUserState when no themeId provided', (assert) => {
		const updateUserStateStub = sinon.stub(LocalStorageHandler, 'updateUserState');

		LocalStorageHandler.updateLastTheme(undefined as unknown as ThemeId);

		assert.notOk(updateUserStateStub.called);

		updateUserStateStub.restore();
	});

	QUnit.test('updateLastTheme - shall update user state with last theme', (assert) => {
		const getUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns({} as UserState);
		const updateUserStateStub = sinon.stub(LocalStorageHandler, 'updateUserState');

		LocalStorageHandler.updateLastTheme('sap_horizon');

		assert.ok(updateUserStateStub.calledWith({ lastTheme: 'sap_horizon' }));

		getUserStateStub.restore();
		updateUserStateStub.restore();
	});

	QUnit.test('updateCurrentTheme - shall update user state with current theme', (assert) => {
		const getUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns({} as UserState);
		const updateUserStateStub = sinon.stub(LocalStorageHandler, 'updateUserState');

		LocalStorageHandler.updateCurrentTheme('sap_horizon');

		assert.ok(updateUserStateStub.calledWith({ currentTheme: 'sap_horizon' }));

		getUserStateStub.restore();
		updateUserStateStub.restore();
	});

	QUnit.test('updateCurrentTheme - shall not update user state if themeId is not provided', (assert) => {
		const getUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns({} as UserState);
		const updateUserStateStub = sinon.stub(LocalStorageHandler, 'updateUserState');

		LocalStorageHandler.updateCurrentTheme(null as unknown as ThemeId);

		assert.notOk(updateUserStateStub.called);

		getUserStateStub.restore();
		updateUserStateStub.restore();
	});
}
