import { Environment } from '@sap-px/pxapi';
import { ConfigIdentifier, SurveyInvitationDialogCallback, TenantInfo } from '@sap-px/pxapi/dist/api/common/Types';
import Log from 'sap/base/Log';
import Constants from 'sap/feedback/ui/flpplugin/common/Constants';
import { RawStartParameters } from 'sap/feedback/ui/flpplugin/common/Types';
import Util from 'sap/feedback/ui/flpplugin/common/Util';
import InitController from 'sap/feedback/ui/flpplugin/controller/InitController';
import PxApiWrapper from 'sap/feedback/ui/flpplugin/pxapi/PxApiWrapper';
import PushStateMigrator from 'sap/feedback/ui/flpplugin/storage/PushStateMigrator';
import Device from 'sap/ui/Device';
// eslint-disable-next-line import/no-unresolved
import * as sinon from 'sinon';

export default () => {
	const pluginInfo = {
		id: 'pluginId',
		version: 'pluginVersion'
	};
	let tenantInfo: TenantInfo, configIdentifier: ConfigIdentifier, platformType: string, productName: string;
	const surveyInvitationDialogCallback = sinon.stub();

	QUnit.module('InitController unit tests', {
		beforeEach: function () {
			tenantInfo = {
				tenantId: 'foo',
				tenantRole: 'bar'
			};
			configIdentifier = {
				configUrl: 'somepxconfigUrl',
				unitId: 'SomeUnitId',
				environment: 'test'
			};
			platformType = 'QUnit';
			productName = 'UnitTest';
		},
		afterEach: function () {
			surveyInvitationDialogCallback.reset();
			surveyInvitationDialogCallback.resetBehavior();
		}
	});

	QUnit.test('init - shall not initialize PluginController when Push state migration failed', async (assert) => {
		const errorInfoStub = sinon.stub(Log, 'error');
		const migrateStub = sinon.stub(PushStateMigrator, 'migrate').returns(false);
		const initController = new InitController(pluginInfo);

		const result = await initController.init({} as RawStartParameters, {} as SurveyInvitationDialogCallback);

		assert.equal(result, false);
		assert.ok(errorInfoStub.calledWith(Constants.ERROR.PUSH_STATE_MIGRATION_FAILED, undefined, Constants.COMPONENT.INIT_CONTROLLER));

		migrateStub.restore();
		errorInfoStub.restore();
	});

	QUnit.test('init - shall not initialize PluginController when device is Phone', async (assert) => {
		const originalPhoneValue = Device.system.phone;
		Object.defineProperty(Device.system, 'phone', { value: true });
		const logInfoStub = sinon.stub(Log, 'info');
		const initController = new InitController(pluginInfo);

		const result = await initController.init({} as RawStartParameters, {} as SurveyInvitationDialogCallback);

		assert.ok(logInfoStub.called);
		assert.equal(result, false);

		Object.defineProperty(Device.system, 'phone', { value: originalPhoneValue });
		logInfoStub.restore();
	});

	QUnit.test('init - shall initialize PluginController when device is not Phone', async (assert) => {
		const originalPhoneValue = Device.system.phone;
		Object.defineProperty(Device.system, 'phone', { value: false });
		const hasOldParametersStub = sinon.stub(InitController.prototype, 'hasOldParameters' as any).returns(true);
		const initWithOldParametersStub = sinon.stub(InitController.prototype, 'initWithOldParameters' as any).returns(Promise.resolve(true));
		const initController = new InitController(pluginInfo);

		const result = await initController.init({} as RawStartParameters, {} as SurveyInvitationDialogCallback);

		assert.equal(result, true);

		hasOldParametersStub.restore();
		initWithOldParametersStub.restore();
		Object.defineProperty(Device.system, 'phone', { value: originalPhoneValue });
	});

	QUnit.test('init - shall initialize PluginController with old parameters (embedded config, no scopeSet)', async (assert) => {
		const originalPhoneValue = Device.system.phone;
		Object.defineProperty(Device.system, 'phone', { value: false });
		const rawParameters = {
			tenantId: tenantInfo.tenantId,
			tenantRole: tenantInfo.tenantRole,
			qualtricsInternalUri: 'someUrl',
			platformType: platformType,
			productName: productName
		};
		const pxApiWrapperInitStub = sinon.stub(PxApiWrapper.prototype, 'initialize');
		pxApiWrapperInitStub.withArgs(tenantInfo, undefined, sinon.match.object).returns(Promise.resolve(true));
		const initController = new InitController(pluginInfo);

		const result = await initController.init(
			rawParameters as RawStartParameters,
			surveyInvitationDialogCallback as SurveyInvitationDialogCallback
		);

		assert.equal(result, true);
		const args = pxApiWrapperInitStub.getCall(0).args as any;
		assert.equal(args[2].startupConfig?.scopeSet.length, 1);
		assert.equal(args[2].startupConfig?.scopeSet[0], Constants.SCOPE_SETS.MANUAL);

		pxApiWrapperInitStub.restore();
		Object.defineProperty(Device.system, 'phone', { value: originalPhoneValue });
	});

	QUnit.test('init - shall initialize PluginController with old parameters (embedded config, with scopeSet)', async (assert) => {
		const originalPhoneValue = Device.system.phone;
		Object.defineProperty(Device.system, 'phone', { value: false });
		const rawParameters = {
			tenantId: tenantInfo.tenantId,
			tenantRole: tenantInfo.tenantRole,
			qualtricsInternalUri: 'someUrl',
			platformType: platformType,
			productName: productName,
			scopeSet: 'abc, def'
		};
		const pxApiWrapperInitStub = sinon.stub(PxApiWrapper.prototype, 'initialize');
		pxApiWrapperInitStub.withArgs(tenantInfo, undefined, sinon.match.object).returns(Promise.resolve(true));
		const initController = new InitController(pluginInfo);

		const result = await initController.init(
			rawParameters as RawStartParameters,
			surveyInvitationDialogCallback as SurveyInvitationDialogCallback
		);

		assert.equal(result, true);
		const args = pxApiWrapperInitStub.getCall(0).args as any;
		assert.equal(args[2].startupConfig.scopeSet.length, 3);

		pxApiWrapperInitStub.restore();

		Object.defineProperty(Device.system, 'phone', { value: originalPhoneValue });
	});

	QUnit.test('init - shall initialize PluginController with new parameters (central config)', async (assert) => {
		const originalPhoneValue = Device.system.phone;
		Object.defineProperty(Device.system, 'phone', { value: false });
		const rawParameters = {
			tenantId: tenantInfo.tenantId,
			tenantRole: tenantInfo.tenantRole,
			configUrl: configIdentifier.configUrl,
			unitId: configIdentifier.unitId,
			environment: configIdentifier.environment
		};
		const pxApiWrapperInitStub = sinon.stub(PxApiWrapper.prototype, 'initialize');
		pxApiWrapperInitStub.withArgs(tenantInfo, configIdentifier).returns(Promise.resolve(true));
		const initController = new InitController(pluginInfo);

		const result = await initController.init(
			rawParameters as RawStartParameters,
			surveyInvitationDialogCallback as SurveyInvitationDialogCallback
		);

		assert.equal(result, true);

		pxApiWrapperInitStub.restore();
		Object.defineProperty(Device.system, 'phone', { value: originalPhoneValue });
	});

	QUnit.test('init - shall initialize PluginController with new parameters + URL Params (central config)', async (assert) => {
		const originalPhoneValue = Device.system.phone;
		Object.defineProperty(Device.system, 'phone', { value: false });
		const rawParameters = {
			tenantId: tenantInfo.tenantId,
			tenantRole: tenantInfo.tenantRole,
			configUrl: configIdentifier.configUrl,
			unitId: configIdentifier.unitId,
			environment: configIdentifier.environment
		};
		const expectedConfigIdentifier = {
			configUrl: configIdentifier.configUrl,
			unitId: 'abc',
			environment: Environment.dev
		};
		const windowSearchLocationStub = sinon.stub(Util, 'getWindowSearchLocation').returns('?sap-px-unitId=ABC&sap-px-env=dev');
		const pxApiWrapperInitStub = sinon.stub(PxApiWrapper.prototype, 'initialize');
		pxApiWrapperInitStub.withArgs(tenantInfo, expectedConfigIdentifier).returns(Promise.resolve(true));

		const initController = new InitController(pluginInfo);

		const result = await initController.init(
			rawParameters as RawStartParameters,
			surveyInvitationDialogCallback as SurveyInvitationDialogCallback
		);

		assert.equal(result, true);

		windowSearchLocationStub.restore();
		pxApiWrapperInitStub.restore();
		Object.defineProperty(Device.system, 'phone', { value: originalPhoneValue });
	});

	QUnit.test('init - shall initialize PluginController with new parameters (config json)', async (assert) => {
		const configJson = {
			version: '0.4.0',
			startupConfig: {
				qualtricsInternalUri: 'SomeUrl',
				productName: productName,
				platformType: platformType
			},
			runtimeConfig: {
				useApi: true
			},
			themingConfig: {
				writeToGlobals: true
			}
		};
		const originalPhoneValue = Device.system.phone;
		Object.defineProperty(Device.system, 'phone', { value: false });
		const rawParameters = {
			tenantId: tenantInfo.tenantId,
			tenantRole: tenantInfo.tenantRole,
			configJson: configJson
		};
		const pxApiWrapperInitStub = sinon.stub(PxApiWrapper.prototype, 'initialize');
		pxApiWrapperInitStub.withArgs(tenantInfo, undefined, configJson).returns(Promise.resolve(true));
		const initController = new InitController(pluginInfo);

		const result = await initController.init(
			rawParameters as RawStartParameters,
			surveyInvitationDialogCallback as SurveyInvitationDialogCallback
		);

		assert.equal(result, true);

		pxApiWrapperInitStub.restore();
		Object.defineProperty(Device.system, 'phone', { value: originalPhoneValue });
	});

	QUnit.test('init - shall log error when inconsistent parameters provided', async (assert) => {
		const originalPhoneValue = Device.system.phone;
		Object.defineProperty(Device.system, 'phone', { value: false });
		const rawParameters = {
			tenantId: tenantInfo.tenantId,
			tenantRole: tenantInfo.tenantRole,
			platformType: productName,
			productName: platformType
		};
		const logErrorStub = sinon.stub(Log, 'error');
		const pxApiWrapperInitStub = sinon.stub(PxApiWrapper.prototype, 'initialize');
		pxApiWrapperInitStub.returns(Promise.resolve(true));
		const initController = new InitController(pluginInfo);

		const result = await initController.init(
			rawParameters as RawStartParameters,
			surveyInvitationDialogCallback as SurveyInvitationDialogCallback
		);

		assert.equal(result, false);
		assert.ok(logErrorStub.called);

		logErrorStub.restore();
		pxApiWrapperInitStub.restore();
		Object.defineProperty(Device.system, 'phone', { value: originalPhoneValue });
	});

	QUnit.test('initWithNewParameters - shall log error when inconsistent parameters provided', async (assert) => {
		const initController = new InitController(pluginInfo);
		const logErrorStub = sinon.stub(Log, 'error');
		const rawParameters = {
			key1: 'value1',
			key2: 'value2'
		};

		const result = await initController['initWithNewParameters'](
			rawParameters as unknown as RawStartParameters,
			surveyInvitationDialogCallback as SurveyInvitationDialogCallback
		);

		assert.equal(result, false);
		assert.ok(logErrorStub.calledWith(Constants.ERROR.INIT_PARAMS_INCONSISTENT, undefined, Constants.COMPONENT.INIT_CONTROLLER));

		logErrorStub.restore();
	});

	QUnit.test('get pxApiWrapper - shall return PxApiWrapper', (assert) => {
		const initController = new InitController(pluginInfo);

		assert.ok(initController instanceof InitController);
		assert.ok(initController.pxApiWrapper);
	});

	QUnit.test('overwriteWithUrlParameters - shall not overwrite the unitId and environment', (assert) => {
		const getUnitIdUrlParamValueStub = sinon.stub(Util, 'getUnitIdUrlParamValue').returns(null);
		const parameters = {
			unitId: '123',
			environment: 'dev'
		};
		const initController = new InitController(pluginInfo);

		initController['overwriteWithUrlParameters'](parameters as RawStartParameters);

		assert.deepEqual(parameters, {
			unitId: '123',
			environment: 'dev'
		});

		getUnitIdUrlParamValueStub.restore();
	});

	QUnit.test('overwriteWithUrlParameters - shall not overwrite the unitId and environment', (assert) => {
		const getUnitIdUrlParamValueStub = sinon.stub(Util, 'getUnitIdUrlParamValue').returns('123');
		const getEnvironmentUrlParamValueStub = sinon.stub(Util, 'getEnvironmentUrlParamValue').returns('dev');
		const parameters = {
			unitId: '456',
			environment: 'prod'
		};
		const initController = new InitController(pluginInfo);

		initController['overwriteWithUrlParameters'](parameters as RawStartParameters);

		assert.deepEqual(parameters, {
			unitId: '123',
			environment: 'dev'
		});

		getUnitIdUrlParamValueStub.restore();
		getEnvironmentUrlParamValueStub.restore();
	});

	QUnit.test('convertScopeSet - shall return the appropriate (new) scope set values for given (old) scope set string', (assert) => {
		const initController = new InitController(pluginInfo);

		const resultedScopSet1 = initController['convertScopeSet']('featurePush, dynamicPush, somethingElse');
		assert.deepEqual(resultedScopSet1, ['appPush', 'timedPush', 'somethingElse', 'manual']);

		const resultedScopSet2 = initController['convertScopeSet']('somethingElse');
		assert.deepEqual(resultedScopSet2, ['somethingElse', 'manual']);

		const resultedScopSet3 = initController['convertScopeSet'](undefined);
		assert.deepEqual(resultedScopSet3, [Constants.SCOPE_SETS.MANUAL]);

		const resultedScopSet4 = initController['convertScopeSet']('');
		assert.deepEqual(resultedScopSet4, [Constants.SCOPE_SETS.MANUAL]);
	});

	QUnit.test('appendManualScopeSet - scope set shall add manual scope set value to the Empty scopeSet array', (assert) => {
		const initController = new InitController(pluginInfo);

		const resultedScopSet = initController['appendManualScopeSet']([]);

		assert.deepEqual(resultedScopSet, ['manual']);
	});

	QUnit.test('appendManualScopeSet - scope set shall add manual scope set value to the existing the scopeSet array', (assert) => {
		const initController = new InitController(pluginInfo);

		const resultedScopSet = initController['appendManualScopeSet'](['appPush', 'timedPush']);

		assert.deepEqual(resultedScopSet, ['appPush', 'timedPush', 'manual']);
	});

	QUnit.test(
		'appendManualScopeSet - scope set shall not add again manual scope set value to the existing the scopeSet array if its already set',
		(assert) => {
			const initController = new InitController(pluginInfo);

			const resultedScopSet = initController['appendManualScopeSet'](['appPush', 'timedPush', 'manual']);

			assert.deepEqual(resultedScopSet, ['appPush', 'timedPush', 'manual']);
		}
	);
};
