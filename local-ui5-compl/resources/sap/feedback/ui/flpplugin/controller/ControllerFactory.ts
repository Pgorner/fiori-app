import ResourceBundle from 'sap/base/i18n/ResourceBundle';
import InitController from './InitController';
import PluginController from './PluginController';
import { PluginInfo } from '../common/Types';
import PxApiWrapper from '../pxapi/PxApiWrapper';

export default class ControllerFactory {
	static createPluginController(pxApiWrapper: PxApiWrapper, resourceBundle: ResourceBundle): PluginController {
		const pluginController = new PluginController(pxApiWrapper, resourceBundle);
		return pluginController;
	}

	static createInitController(pluginInfo: PluginInfo): InitController {
		const initController = new InitController(pluginInfo);
		return initController;
	}
}
