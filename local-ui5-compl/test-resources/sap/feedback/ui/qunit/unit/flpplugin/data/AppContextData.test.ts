import Log from 'sap/base/Log';
import Constants from 'sap/feedback/ui/flpplugin/common/Constants';
import { AppInfo } from 'sap/feedback/ui/flpplugin/common/Types';
import UI5Util from 'sap/feedback/ui/flpplugin/common/UI5Util';
import Util from 'sap/feedback/ui/flpplugin/common/Util';
import AppContextData from 'sap/feedback/ui/flpplugin/data/AppContextData';
import ThemeData from 'sap/feedback/ui/flpplugin/data/ThemeData';
import AppConfiguration from 'sap/ushell/services/AppConfiguration';
import { CurrentApplication } from 'sap/ushell/services/AppLifeCycle';
// eslint-disable-next-line import/no-unresolved
import * as sinon from 'sinon';

export default () => {
	let warningLogStub: sinon.SinonStub<
			[sMessage: string, vDetails?: string | Error | undefined, sComponent?: string | undefined, fnSupportInfo?: any],
			void
		>,
		errorLogStub: sinon.SinonStub<
			[sMessage: string, vDetails?: string | Error | undefined, sComponent?: string | undefined, fnSupportInfo?: any],
			void
		>;
	const defaultAppContextData = {
		appFrameworkId: Constants.DEFAULT_VALUE_NA,
		appFrameworkVersion: Constants.DEFAULT_VALUE_NA,
		theme: Constants.DEFAULT_VALUE_NA,
		appId: Constants.DEFAULT_VALUE_NA,
		appTitle: Constants.DEFAULT_VALUE_NA,
		languageTag: Constants.DEFAULT_VALUE_NA,
		technicalAppComponentId: Constants.DEFAULT_VALUE_NA,
		appVersion: Constants.DEFAULT_VALUE_NA,
		appSupportInfo: Constants.DEFAULT_VALUE_NA
	};

	QUnit.module('AppContextData unit tests', {
		beforeEach: function () {
			warningLogStub = sinon.stub(Log, 'warning');
			errorLogStub = sinon.stub(Log, 'error');
		},

		afterEach: function () {
			warningLogStub.restore();
			errorLogStub.restore();
		}
	});

	QUnit.test('getData - shall return the default appContextData and log the warning when application type is not supported', async (assert) => {
		const getCurrentAppStub = sinon.stub(UI5Util, 'getCurrentApp').returns(
			Promise.resolve({
				applicationType: 'unsupportedApp'
			} as unknown as CurrentApplication)
		);

		const appContextData = await AppContextData.getData();

		assert.deepEqual(appContextData, defaultAppContextData);
		assert.ok(warningLogStub.calledWith(Constants.WARNING.UNSUPPORTED_APP_TYPE, undefined, Constants.COMPONENT.APP_CONTEXT_DATA));

		getCurrentAppStub.restore();
		warningLogStub.restore();
	});

	QUnit.test('getData - shall throw log and throw error when current application is not available', async (assert) => {
		const getCurrentAppStub = sinon.stub(UI5Util, 'getCurrentApp').returns(Promise.resolve(undefined));

		try {
			await AppContextData.getData();
		} catch (error) {
			const err = error as Error;
			assert.equal(err.message, Constants.ERROR.CURRENT_APP_NOT_AVAILABLE);
			assert.ok(errorLogStub.calledWith(Constants.ERROR.CURRENT_APP_NOT_AVAILABLE, undefined, Constants.COMPONENT.APP_CONTEXT_DATA));

			getCurrentAppStub.restore();
			errorLogStub.restore();
		}
	});

	QUnit.test('getData - shall return the app context data', async (assert) => {
		const appInfo = {
			appFrameworkId: 'UI5',
			appFrameworkVersion: '1.109.3 (202212090942)',
			appId: 'Launchpad',
			appSupportInfo: 'ach',
			appVersion: '1.0.0',
			technicalAppComponentId: 'sap.feedback.demo.fxtest'
		};
		const expectedContextData = {
			appFrameworkVersion: '1.109.3 (202212090942)',
			appId: 'Launchpad',
			appSupportInfo: 'ach',
			appVersion: '1.0.0',
			technicalAppComponentId: 'sap.feedback.demo.fxtest',
			appTitle: 'Launchpad',
			languageTag: 'EN',
			appFrameworkId: '2',
			previousTheme: 'sap_fiori_3',
			theme: 'base'
		};
		const currentAppMock = {
			applicationType: 'ui5',
			getInfo: sinon.stub().returns(Promise.resolve(appInfo))
		} as unknown as CurrentApplication;
		const getLanguageStub = sinon.stub(UI5Util, 'getLanguage').returns('en');
		const getThemeStub = sinon.stub(UI5Util, 'getTheme').returns('base');
		const getPreviousThemeStub = sinon.stub(ThemeData, 'getPreviousTheme').returns('sap_fiori_3');
		const getCurrentAppStub = sinon.stub(UI5Util, 'getCurrentApp').returns(Promise.resolve(currentAppMock));
		const getMetadataStub = sinon.stub(AppConfiguration, 'getMetadata' as any).returns({
			title: expectedContextData.appTitle
		});
		const appContextData = await AppContextData.getData();

		assert.deepEqual(appContextData, expectedContextData);

		getCurrentAppStub.restore();
		getMetadataStub.restore();
		getPreviousThemeStub.restore();
		getThemeStub.restore();
		getLanguageStub.restore();
	});

	QUnit.test('isAppTypeSupported - shall return true for supported App types and false for unsupported App types', (assert) => {
		const supportedAppTypes = ['ui5', 'wda', 'gui', 'tr', 'nwbc', 'url'];
		const unSupportedAppTypes = ['abc', 'test'];

		supportedAppTypes.forEach(function (currentAppType) {
			const result = AppContextData['isAppTypeSupported'](currentAppType);

			assert.ok(result);
		});
		unSupportedAppTypes.forEach(function (currentAppType) {
			const result = AppContextData['isAppTypeSupported'](currentAppType);

			assert.notOk(result);
		});
	});

	QUnit.test('getAppInfo - shall return the expected appInfo - title available in appConfig metadata', async (assert) => {
		const appInfo = {
			appFrameworkId: 'UI5',
			appFrameworkVersion: '1.109.3 (202212090942)',
			appId: 'F9999',
			appSupportInfo: 'ach',
			appVersion: '1.0.0',
			technicalAppComponentId: 'sap.feedback.demo.fxtest'
		};
		const expectedAppInfo = {
			appFrameworkId: 'UI5',
			appFrameworkVersion: '1.109.3 (202212090942)',
			appId: 'F9999',
			appSupportInfo: 'ach',
			appVersion: '1.0.0',
			technicalAppComponentId: 'sap.feedback.demo.fxtest',
			appTitle: 'hello world title'
		};
		const currentAppMock = {
			getInfo: sinon.stub().returns(Promise.resolve(appInfo))
		} as unknown as CurrentApplication;
		const getMetadataStub = sinon.stub(AppConfiguration, 'getMetadata' as any).returns({
			title: expectedAppInfo.appTitle
		});

		const resultedAppInfo = await AppContextData['getAppInfo'](currentAppMock);

		assert.deepEqual(resultedAppInfo, expectedAppInfo);

		currentAppMock.getInfo.reset();
		getMetadataStub.restore();
	});

	QUnit.test('getAppInfo - shall return the expected appInfo - appConfig metadata is empty {}', async (assert) => {
		const appInfo = {
			appFrameworkId: 'UI5',
			appFrameworkVersion: '1.109.3 (202212090942)',
			appId: 'LAUNCHPAD',
			appSupportInfo: 'ach',
			appVersion: '1.0.0',
			technicalAppComponentId: 'sap.feedback.demo.fxtest'
		};
		const expectedAppInfo = {
			appFrameworkId: 'UI5',
			appFrameworkVersion: '1.109.3 (202212090942)',
			appId: 'LAUNCHPAD',
			appSupportInfo: 'ach',
			appVersion: '1.0.0',
			technicalAppComponentId: 'sap.feedback.demo.fxtest',
			appTitle: 'Launchpad'
		};
		const currentAppMock = {
			getInfo: sinon.stub().returns(Promise.resolve(appInfo))
		} as unknown as CurrentApplication;
		const getMetadataStub = sinon.stub(AppConfiguration, 'getMetadata' as any).returns({});

		const resultedAppInfo = await AppContextData['getAppInfo'](currentAppMock);

		assert.deepEqual(resultedAppInfo, expectedAppInfo);

		currentAppMock.getInfo.reset();
		getMetadataStub.restore();
	});

	QUnit.test('getAppInfo - shall return the expected appInfo - appConfig metadata is undefined', async (assert) => {
		const appInfo = {
			appFrameworkId: 'UI5',
			appFrameworkVersion: '1.109.3 (202212090942)',
			appId: 'LAUNCHPAD',
			appSupportInfo: 'ach',
			appVersion: '1.0.0',
			technicalAppComponentId: 'sap.feedback.demo.fxtest'
		};
		const expectedAppInfo = {
			appFrameworkId: 'UI5',
			appFrameworkVersion: '1.109.3 (202212090942)',
			appId: 'LAUNCHPAD',
			appSupportInfo: 'ach',
			appVersion: '1.0.0',
			technicalAppComponentId: 'sap.feedback.demo.fxtest',
			appTitle: 'Launchpad'
		};
		const currentAppMock = {
			getInfo: sinon.stub().returns(Promise.resolve(appInfo))
		} as unknown as CurrentApplication;
		const getMetadataStub = sinon.stub(AppConfiguration, 'getMetadata' as any).returns(undefined);

		const resultedAppInfo = await AppContextData['getAppInfo'](currentAppMock);

		assert.deepEqual(resultedAppInfo, expectedAppInfo);

		currentAppMock.getInfo.reset();
		getMetadataStub.restore();
	});

	QUnit.test('getAppInfo - shall return the expected appInfo - appInfo is undefined', async (assert) => {
		const currentApp = {
			getInfo: sinon.stub().returns(Promise.resolve(undefined))
		} as unknown as CurrentApplication;

		const resultedAppInfo = await AppContextData['getAppInfo'](currentApp);

		assert.deepEqual(resultedAppInfo, undefined);

		currentApp.getInfo.reset();
	});

	QUnit.test('getContextData - shall return the application context data using provided appInfo', async (assert) => {
		const appInfo = {
			appFrameworkId: 'UI5',
			appFrameworkVersion: '1.109.3 (202212090942)',
			appId: 'LAUNCHPAD',
			appSupportInfo: 'ach',
			appVersion: '1.0.0',
			technicalAppComponentId: 'sap.feedback.demo.fxtest',
			appTitle: 'Launchpad'
		};
		const expectedContextData = {
			appFrameworkVersion: '1.109.3 (202212090942)',
			appId: 'LAUNCHPAD',
			appSupportInfo: 'ach',
			appVersion: '1.0.0',
			technicalAppComponentId: 'sap.feedback.demo.fxtest',
			appTitle: 'Launchpad',
			languageTag: 'EN',
			previousTheme: 'sap_horizon',
			appFrameworkId: '1',
			theme: 'someTheme'
		};
		const getPreviousThemeStub = sinon.stub(ThemeData, 'getPreviousTheme').returns('sap_horizon');
		const getThemeStub = sinon.stub(UI5Util, 'getTheme').returns(expectedContextData.theme);
		const convertAppFrameworkTypeToIdStub = sinon.stub(Util, 'convertAppFrameworkTypeToId').returns(expectedContextData.appFrameworkId);
		const getLanguageStub = sinon.stub(AppContextData, 'getLanguage' as any).returns(expectedContextData.languageTag);

		const contextData = await AppContextData['getContextData'](appInfo);
		assert.deepEqual(contextData, expectedContextData);

		getPreviousThemeStub.restore();
		getThemeStub.restore();
		convertAppFrameworkTypeToIdStub.restore();
		getLanguageStub.restore();
	});

	QUnit.test(
		'getContextData - shall return the application context data, returning defaults for some values. Using provided appInfo with some missing properties',
		async (assert) => {
			const appInfo = {
				appFrameworkId: 'UI5',
				appFrameworkVersion: undefined,
				appId: undefined,
				appSupportInfo: null,
				appVersion: undefined,
				technicalAppComponentId: null,
				appTitle: undefined
			};
			const expectedContextData = {
				appFrameworkVersion: Constants.DEFAULT_VALUE_NA,
				appId: Constants.DEFAULT_VALUE_NA,
				appSupportInfo: Constants.DEFAULT_VALUE_NA,
				appVersion: Constants.DEFAULT_VALUE_NA,
				technicalAppComponentId: Constants.DEFAULT_VALUE_NA,
				appTitle: Constants.DEFAULT_VALUE_NA,
				languageTag: 'EN',
				previousTheme: 'sap_horizon',
				appFrameworkId: '1',
				theme: 'someTheme'
			};
			const getPreviousThemeStub = sinon.stub(ThemeData, 'getPreviousTheme').returns('sap_horizon');
			const getThemeStub = sinon.stub(UI5Util, 'getTheme').returns(expectedContextData.theme);
			const convertAppFrameworkTypeToIdStub = sinon.stub(Util, 'convertAppFrameworkTypeToId').returns(expectedContextData.appFrameworkId);
			const getLanguageStub = sinon.stub(AppContextData, 'getLanguage' as any).returns(expectedContextData.languageTag);

			const contextData = await AppContextData['getContextData'](appInfo);
			assert.deepEqual(contextData, expectedContextData);

			getPreviousThemeStub.restore();
			getThemeStub.restore();
			convertAppFrameworkTypeToIdStub.restore();
			getLanguageStub.restore();
		}
	);

	QUnit.test('getContextData - shall return the application context data using provided appInfo - appInfo is undefined', async (assert) => {
		let appInfo;
		const expectedContextData = {
			appFrameworkVersion: Constants.DEFAULT_VALUE_NA,
			appId: Constants.DEFAULT_VALUE_NA,
			appSupportInfo: Constants.DEFAULT_VALUE_NA,
			appVersion: Constants.DEFAULT_VALUE_NA,
			technicalAppComponentId: Constants.DEFAULT_VALUE_NA,
			appTitle: Constants.DEFAULT_VALUE_NA,
			languageTag: 'EN',
			previousTheme: 'sap_horizon',
			appFrameworkId: '1',
			theme: 'someTheme'
		};
		const getPreviousThemeStub = sinon.stub(ThemeData, 'getPreviousTheme').returns('sap_horizon');
		const getThemeStub = sinon.stub(UI5Util, 'getTheme').returns(expectedContextData.theme);
		const convertAppFrameworkTypeToIdStub = sinon.stub(Util, 'convertAppFrameworkTypeToId').returns(expectedContextData.appFrameworkId);
		const getLanguageStub = sinon.stub(AppContextData, 'getLanguage' as any).returns(expectedContextData.languageTag);

		const contextData = await AppContextData['getContextData'](appInfo as unknown as AppInfo);
		assert.deepEqual(contextData, expectedContextData);

		getPreviousThemeStub.restore();
		getThemeStub.restore();
		convertAppFrameworkTypeToIdStub.restore();
		getLanguageStub.restore();
	});

	QUnit.test('getLanguage - shall return the language: without userData', (assert) => {
		const getLanguageStub = sinon.stub(UI5Util, 'getLanguage').returns('en');

		const language = AppContextData['getLanguage']();

		assert.equal(language, 'EN');

		getLanguageStub.restore();
	});
};
