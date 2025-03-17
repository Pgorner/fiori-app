import Localization from 'sap/base/i18n/Localization';
import UI5Util from 'sap/feedback/ui/flpplugin/common/UI5Util';
import EventBus from 'sap/ui/core/EventBus';
import Theming from 'sap/ui/core/Theming';
import Container from 'sap/ushell/Container';
import AppLifeCycle from 'sap/ushell/services/AppLifeCycle';
import ShellExtension from 'sap/ushell/services/Extension';
// eslint-disable-next-line import/no-unresolved
import * as sinon from 'sinon';

export default () => {
	QUnit.module('UI5Util unit tests', {});

	QUnit.test('getTheme - shall return the current theme.', (assert) => {
		const getThemeStub = sinon.stub(Theming, 'getTheme').returns('sap_fiori_3');
		const themeResult = UI5Util.getTheme();

		assert.equal(themeResult, 'sap_fiori_3');

		getThemeStub.restore();
	});

	QUnit.test('getThemeId - shall return the current theme typed.', (assert) => {
		const getThemeStub = sinon.stub(UI5Util, 'getTheme').returns('sap_fiori_3');
		const themeResult = UI5Util.getThemeId();

		assert.equal(themeResult, 'sap_fiori_3');

		getThemeStub.restore();
	});

	QUnit.test('getLanguage - shall return the current language.', (assert) => {
		const getLanguageStub = sinon.stub(Localization, 'getLanguage').returns('en-us');
		const resultedLanguage = UI5Util.getLanguage();

		assert.equal(resultedLanguage, 'en-us');

		getLanguageStub.restore();
	});

	QUnit.test('getCurrentApp - shall return the current application.', async (assert) => {
		const appLifeCycleServiceMock = { getCurrentApplication: sinon.stub().returns({}) };
		const getAppLifeCycleServiceStub = sinon
			.stub(UI5Util, 'getAppLifeCycleService')
			.returns(Promise.resolve(appLifeCycleServiceMock as unknown as AppLifeCycle));

		const resultedCurrentApp = await UI5Util.getCurrentApp();

		assert.ok(appLifeCycleServiceMock.getCurrentApplication.called);
		assert.deepEqual(resultedCurrentApp, {});

		getAppLifeCycleServiceStub.restore();
		appLifeCycleServiceMock.getCurrentApplication.reset();
	});

	QUnit.test('getAppLifeCycleService - shall return the current AppLifeCycle.', async (assert) => {
		const getServiceAsyncMock = sinon.stub().withArgs('AppLifeCycle').returns({});
		const shellContainerMock = {
			getServiceAsync: getServiceAsyncMock
		} as unknown as Container;
		const getShellContainerStub = sinon.stub(UI5Util, 'getShellContainer').returns(Promise.resolve(shellContainerMock));

		const resultedAppLifeCycle = await UI5Util.getAppLifeCycleService();

		assert.ok(getServiceAsyncMock.calledWith('AppLifeCycle'));
		assert.deepEqual(resultedAppLifeCycle, {} as AppLifeCycle);

		getShellContainerStub.restore();
	});

	QUnit.test('getExtensionService - shall return the current ShellExtension.', async (assert) => {
		const getServiceAsyncMock = sinon.stub().withArgs('Extension').returns({});
		const shellContainerMock = {
			getServiceAsync: getServiceAsyncMock
		} as unknown as Container;
		const getShellContainerStub = sinon.stub(UI5Util, 'getShellContainer').returns(Promise.resolve(shellContainerMock));

		const resultedAppLifeCycle = await UI5Util.getExtensionService();

		assert.ok(getServiceAsyncMock.calledWith('Extension'));
		assert.deepEqual(resultedAppLifeCycle, {} as ShellExtension);

		getShellContainerStub.restore();
	});

	QUnit.test('getShellContainer - shall return the current getShellContainer.', async (assert) => {
		const resultedShellContainer = await UI5Util.getShellContainer();

		assert.notEqual(resultedShellContainer, null);
	});

	QUnit.test('getEventBus - shall return the UI5 Event bus.', (assert) => {
		const eventBusGetInstanceStub = sinon.stub(EventBus, 'getInstance');

		UI5Util.getEventBus();

		assert.ok(eventBusGetInstanceStub.called);

		eventBusGetInstanceStub.restore();
	});
};
