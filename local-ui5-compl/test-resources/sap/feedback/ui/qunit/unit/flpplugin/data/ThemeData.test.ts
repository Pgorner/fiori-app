import { ThemeId } from '@sap-px/pxapi';
import { UserState } from 'sap/feedback/ui/flpplugin/common/Types';
import UI5Util from 'sap/feedback/ui/flpplugin/common/UI5Util';
import ThemeData from 'sap/feedback/ui/flpplugin/data/ThemeData';
import LocalStorageHandler from 'sap/feedback/ui/flpplugin/storage/LocalStorageHandler';
// eslint-disable-next-line import/no-unresolved
import * as sinon from 'sinon';

export default () => {
	QUnit.module('ThemeData unit tests', {});

	QUnit.test('initLastTheme - init last theme without persisted last theme value', (assert) => {
		const getThemeStub = sinon.stub(UI5Util, 'getThemeId').returns('sap_horizon');
		const getLocalStorageUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns({ lastTheme: null } as unknown as UserState);
		const updateThemeStateStub = sinon.stub(ThemeData, 'updateThemeState');

		ThemeData.initLastTheme();

		assert.ok(updateThemeStateStub.calledWith('sap_horizon', 'sap_horizon'));

		getThemeStub.restore();
		getLocalStorageUserStateStub.restore();
		updateThemeStateStub.restore();
	});

	QUnit.test('initLastTheme - init last theme with persisted valid last theme value', (assert) => {
		const getThemeStub = sinon.stub(UI5Util, 'getThemeId').returns('sap_horizon');
		const getLocalStorageUserStateStub = sinon
			.stub(LocalStorageHandler, 'getUserState')
			.returns({ lastTheme: 'sap_fiori_3' } as unknown as UserState);
		const updateThemeStateStub = sinon.stub(ThemeData, 'updateThemeState');

		ThemeData.initLastTheme();

		assert.ok(updateThemeStateStub.calledWith('sap_fiori_3', 'sap_horizon'));

		getThemeStub.restore();
		getLocalStorageUserStateStub.restore();
		updateThemeStateStub.restore();
	});

	QUnit.test('initLastTheme - init last theme with persisted invalid last theme value', (assert) => {
		const getThemeStub = sinon.stub(UI5Util, 'getThemeId').returns('sap_horizon');
		const getLocalStorageUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns({ lastTheme: 'foo' } as unknown as UserState);
		const updateThemeStateStub = sinon.stub(ThemeData, 'updateThemeState');

		ThemeData.initLastTheme();

		assert.ok(updateThemeStateStub.calledWith('sap_horizon', 'sap_horizon'));

		getThemeStub.restore();
		getLocalStorageUserStateStub.restore();
		updateThemeStateStub.restore();
	});

	QUnit.test('initLastTheme - init last theme with invalid current theme', (assert) => {
		const getThemeStub = sinon.stub(UI5Util, 'getThemeId').returns(ThemeId.none);
		const getLocalStorageUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns({ lastTheme: 'foo' } as unknown as UserState);
		const updateThemeStateStub = sinon.stub(ThemeData, 'updateThemeState');

		ThemeData.initLastTheme();

		assert.ok(updateThemeStateStub.calledWith('none', 'none'));

		getThemeStub.restore();
		getLocalStorageUserStateStub.restore();
		updateThemeStateStub.restore();
	});

	QUnit.test('updateCurrentTheme - shall not call updateThemeState when no userState provided', (assert) => {
		const getLocalStorageUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns(undefined);
		const updateThemeStateStub = sinon.stub(ThemeData, 'updateThemeState');

		ThemeData.updateCurrentTheme('sap_horizon');

		assert.notOk(updateThemeStateStub.called);

		getLocalStorageUserStateStub.restore();
		updateThemeStateStub.restore();
	});

	QUnit.test('updateCurrentTheme - invalid persisted theme, valid current theme', (assert) => {
		const getLocalStorageUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns({ currentTheme: 'foo' } as unknown as UserState);
		const updateThemeStateStub = sinon.stub(ThemeData, 'updateThemeState');

		ThemeData.updateCurrentTheme('sap_horizon');

		assert.ok(updateThemeStateStub.calledWith('none', 'sap_horizon'));

		getLocalStorageUserStateStub.restore();
		updateThemeStateStub.restore();
	});

	QUnit.test('updateCurrentTheme - valid persisted theme, invalid current theme', (assert) => {
		const getLocalStorageUserStateStub = sinon
			.stub(LocalStorageHandler, 'getUserState')
			.returns({ currentTheme: 'sap_horizon' } as unknown as UserState);
		const updateThemeStateStub = sinon.stub(ThemeData, 'updateThemeState');

		ThemeData.updateCurrentTheme('foo' as ThemeId);

		assert.ok(updateThemeStateStub.calledWith('sap_horizon', 'none'));

		getLocalStorageUserStateStub.restore();
		updateThemeStateStub.restore();
	});

	QUnit.test('updateCurrentTheme - valid persisted theme, valid current theme', (assert) => {
		const getLocalStorageUserStateStub = sinon
			.stub(LocalStorageHandler, 'getUserState')
			.returns({ currentTheme: 'sap_horizon' } as unknown as UserState);
		const updateThemeStateStub = sinon.stub(ThemeData, 'updateThemeState');

		ThemeData.updateCurrentTheme('sap_fiori_3');

		assert.ok(updateThemeStateStub.calledWith('sap_horizon', 'sap_fiori_3'));

		getLocalStorageUserStateStub.restore();
		updateThemeStateStub.restore();
	});

	QUnit.test('updateCurrentTheme - invalid persisted theme, invalid current theme', (assert) => {
		const getLocalStorageUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns({ currentTheme: 'foo' } as unknown as UserState);
		const updateThemeStateStub = sinon.stub(ThemeData, 'updateThemeState');

		ThemeData.updateCurrentTheme('invalid' as ThemeId);

		assert.notOk(updateThemeStateStub.called);

		getLocalStorageUserStateStub.restore();
		updateThemeStateStub.restore();
	});

	QUnit.test('updateThemeState - shall call updates to last and current theme', (assert) => {
		const updateLastThemeStub = sinon.stub(LocalStorageHandler, 'updateLastTheme');
		const updateCurrentThemeStub = sinon.stub(LocalStorageHandler, 'updateCurrentTheme');

		ThemeData.updateThemeState('firstValue' as ThemeId, 'secondValue' as ThemeId);

		assert.ok(updateLastThemeStub.calledWith('firstValue' as ThemeId));
		assert.ok(updateCurrentThemeStub.calledWith('secondValue' as ThemeId));

		updateLastThemeStub.restore();
		updateCurrentThemeStub.restore();
	});

	QUnit.test('getPreviousTheme - shall return valid theme', (assert) => {
		const getUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns({ lastTheme: 'sap_horizon' } as unknown as UserState);

		const result = ThemeData.getPreviousTheme();

		assert.equal(result, 'sap_horizon');

		getUserStateStub.restore();
	});

	QUnit.test('getPreviousTheme - shall return none for invalid theme if UserState contains invalid theme', (assert) => {
		const getUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns({ lastTheme: 'foo' } as unknown as UserState);

		const result = ThemeData.getPreviousTheme();

		assert.equal(result, 'none');

		getUserStateStub.restore();
	});

	QUnit.test('getPreviousTheme - shall return none for invalid theme if UserState cannot be read', (assert) => {
		const getUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns(null as unknown as UserState);

		const result = ThemeData.getPreviousTheme();

		assert.equal(result, 'none');

		getUserStateStub.restore();
	});
};
