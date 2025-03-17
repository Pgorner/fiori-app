import ResourceBundle from 'sap/base/i18n/ResourceBundle';
import UI5Util from 'sap/feedback/ui/flpplugin/common/UI5Util';
import ShellBarButton from 'sap/feedback/ui/flpplugin/ui/ShellBarButton';
import ShellExtension from 'sap/ushell/services/Extension';
import Item from 'sap/ushell/services/Extension/Item';
// eslint-disable-next-line import/no-unresolved
import * as sinon from 'sinon';

export default () => {
	QUnit.module('ShellBarButton unit tests', {});

	QUnit.test('initShellBarButton - shall call the headerEndItem with desired parameters', async (assert) => {
		const resourceBundle = {
			getText: sinon.stub().returns('Give Feedback')
		} as unknown as ResourceBundle;
		const openSurveyCallback = sinon.stub();
		const showForAllAppsStub = sinon.stub();
		const showOnHomeStub = sinon.stub().returns({ showForAllApps: showForAllAppsStub } as unknown as Item);
		const createHeaderItemMock = sinon
			.stub(ShellExtension.prototype, 'createHeaderItem')
			.returns(Promise.resolve({ showOnHome: showOnHomeStub } as unknown as Item));
		const shellExtensionServiceMock = {
			createHeaderItem: createHeaderItemMock
		} as unknown as ShellExtension;
		const getShellExtensionStub = sinon.stub(UI5Util, 'getExtensionService').returns(Promise.resolve(shellExtensionServiceMock));

		await ShellBarButton.initShellBarButton(resourceBundle, openSurveyCallback);

		assert.ok(createHeaderItemMock.calledWith(sinon.match.object, { position: 'end' }));
		assert.ok(showOnHomeStub.called);
		assert.ok(showForAllAppsStub.called);

		getShellExtensionStub.restore();
		createHeaderItemMock.restore();
	});

	QUnit.test('getHeaderItem - shall trigger a callback with press event', (assert) => {
		const resourceBundle = {
			getText: sinon.stub().returns('Give Feedback')
		} as unknown as ResourceBundle;
		const openSurveyCallbackStub = sinon.stub();

		const headerItem = ShellBarButton['getHeaderItem'](resourceBundle, openSurveyCallbackStub);

		headerItem.press();

		assert.ok(openSurveyCallbackStub.called);

		openSurveyCallbackStub.reset();
	});
};
