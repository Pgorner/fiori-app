import ResourceBundle from 'sap/base/i18n/ResourceBundle';
import { PluginInfo } from 'sap/feedback/ui/flpplugin/common/Types';
import ControllerFactory from 'sap/feedback/ui/flpplugin/controller/ControllerFactory';
import InitController from 'sap/feedback/ui/flpplugin/controller/InitController';
import PluginController from 'sap/feedback/ui/flpplugin/controller/PluginController';
import PxApiWrapper from 'sap/feedback/ui/flpplugin/pxapi/PxApiWrapper';

export default () => {
	QUnit.module('ControllerFactory unit tests', {});

	QUnit.test('createPluginController - shall return the instance of the PluginController', (assert) => {
		const pluginController = ControllerFactory.createPluginController({} as PxApiWrapper, {} as ResourceBundle);

		assert.ok(pluginController instanceof PluginController);
	});

	QUnit.test('createInitController - shall return the instance of the InitController', (assert) => {
		const initController = ControllerFactory.createInitController({} as PluginInfo);

		assert.ok(initController instanceof InitController);
	});
};
