import { ThemeId } from '@sap-px/pxapi';
import Constants from 'sap/feedback/ui/flpplugin/common/Constants';
import Util from 'sap/feedback/ui/flpplugin/common/Util';
// eslint-disable-next-line import/no-unresolved
import * as sinon from 'sinon';

export default () => {
	QUnit.module('Utils unit tests', {});

	QUnit.test('convertStringToThemeId - shall return corresponding theme ids', (assert) => {
		assert.equal(Util.convertStringToThemeId('none'), ThemeId.none);
		assert.equal(Util.convertStringToThemeId('no_valid_id'), ThemeId.none);
		assert.equal(Util.convertStringToThemeId(''), ThemeId.none);
		assert.equal(Util.convertStringToThemeId(' '), ThemeId.none);
		assert.equal(Util.convertStringToThemeId('sap_horizon'), ThemeId.sap_horizon);
		assert.equal(Util.convertStringToThemeId('sap_horizon_dark'), ThemeId.sap_horizon_dark);
		assert.equal(Util.convertStringToThemeId('sap_horizon_hcb'), ThemeId.sap_horizon_hcb);
		assert.equal(Util.convertStringToThemeId('sap_horizon_hcw'), ThemeId.sap_horizon_hcw);
		assert.equal(Util.convertStringToThemeId('sap_fiori_3'), ThemeId.sap_fiori_3);
		assert.equal(Util.convertStringToThemeId('sap_fiori_3_dark'), ThemeId.sap_fiori_3_dark);
		assert.equal(Util.convertStringToThemeId('sap_fiori_3_hcb'), ThemeId.sap_fiori_3_hcb);
		assert.equal(Util.convertStringToThemeId('sap_fiori_3_hcw'), ThemeId.sap_fiori_3_hcw);
		assert.equal(Util.convertStringToThemeId('sap_belize'), ThemeId.sap_belize);
		assert.equal(Util.convertStringToThemeId('sap_belize_plus'), ThemeId.sap_belize_plus);
		assert.equal(Util.convertStringToThemeId('sap_belize_hcb'), ThemeId.sap_belize_hcb);
		assert.equal(Util.convertStringToThemeId('sap_belize_hcw'), ThemeId.sap_belize_hcw);
	});

	QUnit.test('formatLanguageTag - shall return language correctly formatted or default', function (assert) {
		assert.equal(Util.formatLanguageTag('de'), 'DE');
		assert.equal(Util.formatLanguageTag(' fr '), 'FR');
		assert.equal(Util.formatLanguageTag('de-de'), 'DE-DE');
		assert.equal(Util.formatLanguageTag('en-GB'), 'EN-GB');
		assert.equal(Util.formatLanguageTag(' en-GB'), 'EN-GB');
		assert.equal(Util.formatLanguageTag(''), Constants.DEFAULT_LANGUAGE);
		assert.equal(Util.formatLanguageTag(' '), Constants.DEFAULT_LANGUAGE);
		assert.equal(Util.formatLanguageTag('d'), 'D');
		assert.equal(Util.formatLanguageTag('abc'), 'ABC');
		assert.equal(Util.formatLanguageTag('def '), 'DEF');
	});

	QUnit.test('stringToTitleCase - shall return Title case for given string', (assert) => {
		const stringMap = new Map();
		stringMap.set(undefined, undefined);
		stringMap.set('TEST', 'Test');
		stringMap.set('TEST something', 'Test Something');

		stringMap.forEach(function (value, key) {
			assert.equal(Util.stringToTitleCase(key), value);
		});
	});

	QUnit.test('convertAppFrameworkTypeToId - shall return Id for given framework type', (assert) => {
		const stringMap = new Map();
		stringMap.set(undefined, 1);
		stringMap.set('ui5', '2');
		stringMap.set('wda', '8');
		stringMap.set('somethingElse', '1');

		stringMap.forEach(function (value, key) {
			assert.equal(Util.convertAppFrameworkTypeToId(key), value);
		});
	});

	QUnit.test('isUnitIdUrlParamSet - shall return true if "sap-px-unitId" url parameter set', (assert) => {
		const windowSearchLocationStub = sinon.stub(Util, 'getWindowSearchLocation').returns('?sap-px-unitId=abc');

		assert.ok(Util.isUnitIdUrlParamSet());

		windowSearchLocationStub.restore();
	});

	QUnit.test('isUnitIdUrlParamSet - shall return false if "sap-px-unitId" url parameter is not set', (assert) => {
		const windowSearchLocationStub = sinon.stub(Util, 'getWindowSearchLocation').returns('?sap-px-env=abc');

		assert.notOk(Util.isUnitIdUrlParamSet());

		windowSearchLocationStub.restore();
	});

	QUnit.test('isUnitIdUrlParamSet - shall return false search parameters are not set', (assert) => {
		const windowSearchLocationStub = sinon.stub(Util, 'getWindowSearchLocation').returns('');

		assert.notOk(Util.isUnitIdUrlParamSet());

		windowSearchLocationStub.restore();
	});

	QUnit.test('getUnitIdUrlParamValue - shall return null', (assert) => {
		const windowSearchLocationStub = sinon.stub(Util, 'getWindowSearchLocation').returns('');

		assert.ok(Util.getUnitIdUrlParamValue() === null);

		windowSearchLocationStub.restore();
	});

	QUnit.test('getUnitIdUrlParamValue - shall return null if "sap-px-unitId" url parameter value is missing', (assert) => {
		const windowSearchLocationStub = sinon.stub(Util, 'getWindowSearchLocation').returns('?sap-px-unitId');

		assert.ok(Util.getUnitIdUrlParamValue() === null);

		windowSearchLocationStub.restore();
	});

	QUnit.test('getUnitIdUrlParamValue - shall return parameter value if "sap-px-unitId" url parameter is set', (assert) => {
		const windowSearchLocationStub = sinon.stub(Util, 'getWindowSearchLocation').returns('?sap-px-unitId=abc');

		assert.equal(Util.getUnitIdUrlParamValue(), 'abc');

		windowSearchLocationStub.restore();
	});

	QUnit.test('getUnitIdUrlParamValue - shall return parameter value lowercased if "sap-px-unitId" url parameter is set', (assert) => {
		const windowSearchLocationStub = sinon.stub(Util, 'getWindowSearchLocation').returns('?sap-px-unitId=ABC');

		assert.equal(Util.getUnitIdUrlParamValue(), 'abc');

		windowSearchLocationStub.restore();
	});

	QUnit.test('getUnitIdUrlParamValue - shall return parameter null if "sap-px-unitId" url parameter is not set', (assert) => {
		const windowSearchLocationStub = sinon.stub(Util, 'getWindowSearchLocation').returns('?sap-px-env=abc');

		assert.equal(Util.getUnitIdUrlParamValue(), null);

		windowSearchLocationStub.restore();
	});

	QUnit.test('isEnvironmentUrlParamSet - shall return true if "sap-px-env" url parameter set', (assert) => {
		const windowSearchLocationStub = sinon.stub(Util, 'getWindowSearchLocation').returns('?sap-px-env=test');

		assert.ok(Util.isEnvironmentUrlParamSet());

		windowSearchLocationStub.restore();
	});

	QUnit.test('isEnvironmentUrlParamSet - shall return false if "sap-px-env" url parameter not set', (assert) => {
		const windowSearchLocationStub = sinon.stub(Util, 'getWindowSearchLocation').returns('?sap-px-unitId=test');

		assert.notOk(Util.isEnvironmentUrlParamSet());

		windowSearchLocationStub.restore();
	});

	QUnit.test('getEnvironmentUrlParamValue - shall return parameter value if "sap-px-env" url parameter is set', (assert) => {
		const windowSearchLocationStub = sinon.stub(Util, 'getWindowSearchLocation').returns('?sap-px-env=test');

		assert.equal(Util.getEnvironmentUrlParamValue(), 'test');

		windowSearchLocationStub.restore();
	});

	QUnit.test('getEnvironmentUrlParamValue - shall return parameter value lowercased if "sap-px-env" url parameter is set', (assert) => {
		const windowSearchLocationStub = sinon.stub(Util, 'getWindowSearchLocation').returns('?sap-px-env=TEST');

		assert.equal(Util.getEnvironmentUrlParamValue(), 'test');

		windowSearchLocationStub.restore();
	});

	QUnit.test('getEnvironmentUrlParamValue - shall return parameter null if "sap-px-env" url parameter is not set', (assert) => {
		const windowSearchLocationStub = sinon.stub(Util, 'getWindowSearchLocation').returns('?sap-px-unitId=test');

		assert.equal(Util.getEnvironmentUrlParamValue(), null);

		windowSearchLocationStub.restore();
	});

	QUnit.test('ensureGlobalContext - shall ensure "window.sap" is existing and otherwise create it', (assert) => {
		const currentValue = globalThis.sap;
		(globalThis.sap as any) = null;
		const resultValue = Util.ensureGlobalContext();

		assert.equal(globalThis.sap, resultValue);
		globalThis.sap = currentValue;
	});

	QUnit.test('ensureGlobalContext - shall ensure firstLevel property is added if not existing already', (assert) => {
		const resultValue = Util.ensureGlobalContext('qtx');
		assert.equal((globalThis.sap as any).qtx, resultValue);
		(globalThis.sap as any).qtx = undefined;
		const resultValueAfterClear = Util.ensureGlobalContext('qtx');
		assert.equal((globalThis.sap as any).qtx, resultValueAfterClear);
	});

	QUnit.test('ensureGlobalContext - shall ensure secondLevel property is added if not existing already', (assert) => {
		const resultValue = Util.ensureGlobalContext('qtx', 'test');
		assert.equal((globalThis.sap as any).qtx.test, resultValue);
		(globalThis.sap as any).qtx.test = undefined;
		const resultValueAfterClear = Util.ensureGlobalContext('qtx', 'test');
		assert.equal((globalThis.sap as any).qtx.test, resultValueAfterClear);
	});

	QUnit.test('ensureGlobalContext - shall not change already existing properties', (assert) => {
		(globalThis.sap as any).qtx = {
			test: { foo: 'bar' }
		};
		const resultValue = Util.ensureGlobalContext('qtx', 'test');
		assert.equal((globalThis.sap as any).qtx.test, resultValue);
	});
};
