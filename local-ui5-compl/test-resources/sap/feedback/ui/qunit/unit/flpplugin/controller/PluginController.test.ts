import ResourceBundle from 'sap/base/i18n/ResourceBundle';
import Log from 'sap/base/Log';
import Constants from 'sap/feedback/ui/flpplugin/common/Constants';
import UI5Util from 'sap/feedback/ui/flpplugin/common/UI5Util';
import PluginController from 'sap/feedback/ui/flpplugin/controller/PluginController';
import AppContextData from 'sap/feedback/ui/flpplugin/data/AppContextData';
import ThemeData from 'sap/feedback/ui/flpplugin/data/ThemeData';
import PxApiWrapper from 'sap/feedback/ui/flpplugin/pxapi/PxApiWrapper';
import ShellBarButton from 'sap/feedback/ui/flpplugin/ui/ShellBarButton';
import Theming, { Theming$AppliedEvent } from 'sap/ui/core/Theming';
// eslint-disable-next-line import/no-unresolved
import * as sinon from 'sinon';

export default () => {
	let errorLogStub: sinon.SinonStub<any[], any>;
	QUnit.module('PluginController unit tests', {
		beforeEach: function () {
			errorLogStub = sinon.stub(Log, 'error');
		},
		afterEach: function () {
			errorLogStub.restore();
		}
	});

	QUnit.test('initPlugin - shall initiate the user initiated feedback', async (assert) => {
		const pxApiWrapper = { pxApi: { isUserInitiatedFeedbackEnabled: true } } as PxApiWrapper;
		const resourceBundle = {} as ResourceBundle;
		const pluginController = new PluginController(pxApiWrapper, resourceBundle);
		const initUserInitiatedFeedbackStub = sinon.stub(pluginController, 'initUserInitiatedFeedback' as any);
		const prepareThemingSupportStub = sinon.stub(pluginController, 'prepareThemingSupport' as any);
		const initAppTriggeredPushStub = sinon.stub(pluginController, 'initAppTriggeredPush' as any);

		await pluginController.initPlugin();

		assert.ok(initUserInitiatedFeedbackStub.called);
		assert.ok(prepareThemingSupportStub.called);

		initUserInitiatedFeedbackStub.restore();
		prepareThemingSupportStub.restore();
		initAppTriggeredPushStub.restore();
	});

	QUnit.test('initPlugin - shall not initiate the user initiated feedback when "manual" scope set not defined', async (assert) => {
		const pxApiWrapper = { pxApi: { isUserInitiatedFeedbackEnabled: false } } as PxApiWrapper;
		const resourceBundle = {} as ResourceBundle;
		const pluginController = new PluginController(pxApiWrapper, resourceBundle);
		const initUserInitiatedFeedbackStub = sinon.stub(pluginController, 'initUserInitiatedFeedback' as any);
		const prepareThemingSupportStub = sinon.stub(pluginController, 'prepareThemingSupport' as any);
		const initAppTriggeredPushStub = sinon.stub(pluginController, 'initAppTriggeredPush' as any);

		await pluginController.initPlugin();

		assert.ok(initUserInitiatedFeedbackStub.notCalled);
		assert.ok(prepareThemingSupportStub.called);

		initUserInitiatedFeedbackStub.restore();
		prepareThemingSupportStub.restore();
		initAppTriggeredPushStub.restore();
	});

	QUnit.test('initUserInitiatedFeedback - shall call the initShellBarButton', async (assert) => {
		const pxApiWrapper = {} as PxApiWrapper;
		const resourceBundle = {} as ResourceBundle;
		const pluginController = new PluginController(pxApiWrapper, resourceBundle);
		const initShellBarButtonStub = sinon.stub(ShellBarButton, 'initShellBarButton');

		await pluginController['initUserInitiatedFeedback']();

		assert.ok(initShellBarButtonStub.called);

		initShellBarButtonStub.restore();
	});

	QUnit.test('openSurveyCallback - shall catch the error thrown by AppContextData - with Error()', async (assert) => {
		const pxApiWrapper = {
			openSurvey: sinon.stub()
		};
		const pluginController = new PluginController(pxApiWrapper as unknown as PxApiWrapper, {} as ResourceBundle);
		const getDataStub = sinon.stub(AppContextData, 'getData').returns(Promise.reject(new Error(Constants.ERROR.CURRENT_APP_NOT_AVAILABLE)));

		await pluginController['openSurveyCallback']();

		assert.ok(getDataStub.called);
		assert.notOk(pxApiWrapper.openSurvey.called);
		assert.ok(
			errorLogStub.calledWith(
				Constants.ERROR.CANNOT_TRIGGER_USER_INITIATED_FEEDBACK,
				Constants.ERROR.CURRENT_APP_NOT_AVAILABLE,
				Constants.COMPONENT.PLUGIN_CONTROLLER
			)
		);

		getDataStub.restore();
		errorLogStub.restore();
	});

	QUnit.test('openSurveyCallback - shall catch the error thrown by AppContextData - with undefined error', async (assert) => {
		const pxApiWrapper = {
			openSurvey: sinon.stub()
		};
		const pluginController = new PluginController(pxApiWrapper as unknown as PxApiWrapper, {} as ResourceBundle);
		const getDataStub = sinon.stub(AppContextData, 'getData').returns(Promise.reject(undefined));

		await pluginController['openSurveyCallback']();

		assert.ok(getDataStub.called);
		assert.notOk(pxApiWrapper.openSurvey.called);
		assert.ok(errorLogStub.calledWith(Constants.ERROR.CANNOT_TRIGGER_USER_INITIATED_FEEDBACK, undefined, Constants.COMPONENT.PLUGIN_CONTROLLER));

		getDataStub.restore();
		errorLogStub.restore();
	});

	QUnit.test('openSurveyCallback - call the openSurvey after fetching the appContextData', async (assert) => {
		const appContextData = {
			appFrameworkId: '1',
			appFrameworkVersion: '1.109.3 (202212090942)',
			appId: 'LAUNCHPAD',
			appSupportInfo: 'ach',
			appVersion: '1.0.0',
			technicalAppComponentId: 'sap.feedback.demo.fxtest',
			appTitle: 'Launchpad',
			languageTag: 'EN',
			theme: 'someTheme'
		};
		const pxApiWrapper = {
			openSurvey: sinon.stub()
		};
		const pluginController = new PluginController(pxApiWrapper as unknown as PxApiWrapper, {} as ResourceBundle);
		const getDataStub = sinon.stub(AppContextData, 'getData').returns(Promise.resolve(appContextData));

		await pluginController['openSurveyCallback']();

		assert.ok(getDataStub.called);
		assert.ok(pxApiWrapper.openSurvey.calledWith(appContextData));
		assert.notOk(errorLogStub.called);

		getDataStub.restore();
	});

	QUnit.test('initAppTriggeredPush - shall trigger the requestPush with the push data', async (assert) => {
		const pushData = {
			areaId: '001',
			payload: { test: '1234 - 5678 - 90123' },
			shortText: 'Some Feature',
			triggerName: 'manageStockPoC'
		};
		const eventBus = UI5Util.getEventBus();
		const pxApiWrapperMock = {
			requestPush: sinon.stub(),
			pxApi: { isUserInitiatedFeedbackEnabled: true }
		};
		const pluginController = new PluginController(pxApiWrapperMock as unknown as PxApiWrapper, {} as ResourceBundle);
		const prepareThemingSupportStub = sinon.stub(pluginController, 'prepareThemingSupport' as any);
		const userInitiatedFeedbackStub = sinon.stub(pluginController, 'initUserInitiatedFeedback' as any).returns(Promise.resolve());

		await pluginController.initPlugin();

		eventBus.publish(Constants.EVENT_BUS.CHANNEL_ID, Constants.EVENT_BUS.EVENT_ID, pushData);

		assert.ok(pxApiWrapperMock.requestPush.calledWith(pushData));

		prepareThemingSupportStub.restore();
		userInitiatedFeedbackStub.restore();
		pluginController['unsubscribeFromTheEventBusForTesting']();
	});

	QUnit.test('initAppTriggeredPush - shall trigger the requestPush with the push data also when "manual" scopeSet not defined.', async (assert) => {
		const pushData = {
			areaId: '001',
			payload: { test: '1234 - 5678 - 90123' },
			shortText: 'Some Feature',
			triggerName: 'manageStockPoC'
		};
		const eventBus = UI5Util.getEventBus();
		const pxApiWrapperMock = {
			requestPush: sinon.stub(),
			pxApi: { isUserInitiatedFeedbackEnabled: false }
		};
		const pluginController = new PluginController(pxApiWrapperMock as unknown as PxApiWrapper, {} as ResourceBundle);
		const prepareThemingSupportStub = sinon.stub(pluginController, 'prepareThemingSupport' as any);
		const userInitiatedFeedbackStub = sinon.stub(pluginController, 'initUserInitiatedFeedback' as any).returns(Promise.resolve());

		await pluginController.initPlugin();

		eventBus.publish(Constants.EVENT_BUS.CHANNEL_ID, Constants.EVENT_BUS.EVENT_ID, pushData);

		assert.ok(userInitiatedFeedbackStub.notCalled);
		assert.ok(pxApiWrapperMock.requestPush.calledWith(pushData));

		prepareThemingSupportStub.restore();
		userInitiatedFeedbackStub.restore();
		pluginController['unsubscribeFromTheEventBusForTesting']();
	});

	QUnit.test('prepareThemingSupport - shall init and update last theme and subscribe to themeChange', async (assert) => {
		const updateThemeIdStub = sinon.stub();
		const pxApiWrapper = { updateThemeId: updateThemeIdStub, pxApi: { isUserInitiatedFeedbackEnabled: true } } as unknown as PxApiWrapper;
		const resourceBundle = {} as ResourceBundle;
		const ui5UtilGetThemeStub = sinon.stub(UI5Util, 'getTheme').returns('sap_horizon');
		const pluginController = new PluginController(pxApiWrapper, resourceBundle);
		const initUserInitiatedFeedbackStub = sinon.stub(pluginController, 'initUserInitiatedFeedback' as any);
		const initLastThemeStub = sinon.stub(ThemeData, 'initLastTheme');
		//ActionItem:  UI5 2.0 Refactoring required
		const attachAppliedThemingStub = sinon.stub(Theming, 'attachApplied');

		await pluginController.initPlugin();

		assert.ok(initUserInitiatedFeedbackStub.called);
		assert.ok(initLastThemeStub.called);
		assert.ok(updateThemeIdStub.called);
		assert.ok(attachAppliedThemingStub.called);

		initUserInitiatedFeedbackStub.restore();
		initLastThemeStub.restore();
		ui5UtilGetThemeStub.restore();
		attachAppliedThemingStub.restore();
	});

	QUnit.test('themeChanged - shall call the onThemeChanged', (assert) => {
		const changedThemeId = 'sap_horizon';
		const eventDataMock = {
			theme: changedThemeId
		} as Theming$AppliedEvent;

		const updateThemeIdStub = sinon.stub();
		const pxApiWrapper = { updateThemeId: updateThemeIdStub } as unknown as PxApiWrapper;
		const updateCurrentThemeStub = sinon.stub(ThemeData, 'updateCurrentTheme');

		const resourceBundle = {} as ResourceBundle;

		const pluginController = new PluginController(pxApiWrapper, resourceBundle);
		const onThemeChangedStub = sinon.stub(pluginController, 'onThemeChanged' as any);

		//ActionItem:  UI5 2.0 Refactoring required
		// Done but untested
		pluginController['themeChanged'](eventDataMock);

		assert.ok(onThemeChangedStub.calledWith(changedThemeId));

		updateCurrentThemeStub.restore();
	});

	QUnit.test('onThemeChanged - update current theme', (assert) => {
		const changedThemeId = 'sap_horizon';

		const updateThemeIdStub = sinon.stub();
		const pxApiWrapper = { updateThemeId: updateThemeIdStub } as unknown as PxApiWrapper;
		const updateCurrentThemeStub = sinon.stub(ThemeData, 'updateCurrentTheme');

		const resourceBundle = {} as ResourceBundle;

		const pluginController = new PluginController(pxApiWrapper, resourceBundle);

		//ActionItem:  UI5 2.0 Refactoring required
		// Done but untested
		pluginController['onThemeChanged'](changedThemeId);

		assert.ok(updateThemeIdStub.calledWith('sap_horizon'));
		assert.ok(updateCurrentThemeStub.calledWith('sap_horizon'));

		updateCurrentThemeStub.restore();
	});
};
