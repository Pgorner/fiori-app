/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff3600.horizon.ui.api"
],
function(oFF)
{
"use strict";

oFF.HuHorizonConstants = {

	ALT_PLUGIN_DIRECTORY:"/home/main/horizon/pluginmanifests",
	CUSTOM_PLUGIN_MANIFESTS_TO_PROCESS_ENV_VARIABLE:"ff_horizon_custom_plugin_manifests_to_process",
	DEBUG_ENVIRONMENT_ENABLED:false,
	DEBUG_ENVIRONMENT_ENV_VARIABLE:"ff_horizon_debug",
	DEFAULT_CONFIG_EXTENSION:".cfg",
	DEFAULT_HOME_DIRECTORY:"/home/main/",
	DEFAULT_PLUGIN_DIRECTORY:"/etc/horizon/pluginmanifests",
	DEFAULT_PLUGIN_MANIFEST_EXTENSION:".json",
	DEFAULT_SPLASH_SCREEN_IMAGE_PATH:"${ff_mimes}/images/horizon/splashScreen.png",
	FRAMEWORK_VERSION:"0.9.0",
	PLUGIN_MANIFEST_PROCESSING_MODE_ENV_VARIABLE:"ff_horizon_plugin_manifest_processing_mode",
	SELECTED_WORKSPACE_PATH_KEY:"selectedWorkSpacePath"
};

oFF.HuHorizonInternalNotifications = {

	ALL_PLUGIN_RENDERING_FINISHED:"com.sap.ff.Horizon.Notification.AllPluginRenderingFinished",
	FRAMEWORK_MODE_CHANGED:"com.sap.ff.Horizon.Notification.FrameworkModeChanged",
	HIDE_SHELL_MENU:"com.sap.ff.Horizon.Notification.HideShellMenu",
	HORIZON_CONFIGURATION_CHANGED:"com.sap.ff.Horizon.Notification.HorizonConfigurationChanged",
	MESSAGE_MANAGER_CLEAR_ALL_MESSAGES:"com.sap.ff.Horizon.Notification.MessageManager.ClearAllMessages",
	MESSAGE_MANAGER_CLEAR_MESSAGES:"com.sap.ff.Horizon.Notification.MessageManager.ClearMessages",
	MESSAGE_MANAGER_CLEAR_MESSAGES_MESSAGE_TYPE_NOTIFI_DATA:"com.sap.ff.Horizon.NotificationData.MessageManager.ClearMessagesMessageType",
	MESSAGE_MANAGER_NEW_MESSAGE:"com.sap.ff.Horizon.Notification.MessageManager.NewMessage",
	MESSAGE_MANAGER_NEW_MESSAGE_MESSAGE_NOTIFI_DATA:"com.sap.ff.Horizon.NotificationData.MessageManager.NewMessageMessage",
	MESSAGE_MANAGER_STATUS_MESSAGE_CHANGED:"com.sap.ff.Horizon.Notification.MessageManager.StatusMessageChanged",
	MESSAGE_MANAGER_STATUS_MESSAGE_CHANGED_NEW_MESSAGE_NOTIFI_DATA:"com.sap.ff.Horizon.NotificationData.MessageManager.StatusMessageChangedNewMessage",
	NEW_WORKSPACE_TITLE_NOTIFI_DATA:"com.sap.ff.Horizon.NotificationData.NewWorkspaceTitle",
	PLUGIN_STARTED:"com.sap.ff.Horizon.Notification.Plugin.Started",
	PLUGIN_STARTED_PLUGIN_NAME_NOTIFI_DATA:"com.sap.ff.Horizon.NotificationData.Plugin.StartedPluginName",
	PLUGIN_STARTED_PLUGIN_TYPE_NOTIFI_DATA:"com.sap.ff.Horizon.NotificationData.Plugin.StartedPluginType",
	SET_WORKSPACE_TITLE:"com.sap.ff.Horizon.Notification.SetWorkspaceTitle",
	SHOW_SHELL_MENU:"com.sap.ff.Horizon.Notification.ShowShellMenu",
	STATUS_BAR_MANAGER_CLEAR_MESSAGES_PRESSED:"com.sap.ff.Horizon.Notification.StatusBarManager.ClearMessagesPressed",
	STATUS_BAR_MANAGER_CLEAR_MESSAGES_PRESSED_MESSAGE_TYPE_NOTIFY_DATA:"com.sap.ff.Horizon.NotificationData.StatusBarManager.ClearMessagesPressedMessageType",
	STATUS_BAR_MANAGER_HIDE_NETWORK_ACTIVITY_INDICATOR:"com.sap.ff.Horizon.Notification.StatusBarManager.HideNetworkActivityIndicator",
	STATUS_BAR_MANAGER_SHOW_NETWORK_ACTIVITY_INDICATOR:"com.sap.ff.Horizon.Notification.StatusBarManager.ShowNetworkActivityIndicator",
	TEST_ACTION_NOTIFICATION_DATA_KEY_CONTEXT:"com.sap.ff.Horizon.NotificationData.Test.Action.context",
	TEST_ACTION_NOTIFICATION_DATA_KEY_CUSTOM_DATA:"com.sap.ff.Horizon.NotificationData.Test.Action.customData",
	TEST_ACTION_NOTIFICATION_PREFIX:"com.sap.ff.Horizon.Notification.Test.Action."
};

oFF.HuHorizonDebugUtility = function() {};
oFF.HuHorizonDebugUtility.prototype = new oFF.XObject();
oFF.HuHorizonDebugUtility.prototype._ff_c = "HuHorizonDebugUtility";

oFF.HuHorizonDebugUtility.create = function(process)
{
	let newInstance = new oFF.HuHorizonDebugUtility();
	newInstance._setupInternal(process);
	return newInstance;
};
oFF.HuHorizonDebugUtility.prototype.m_process = null;
oFF.HuHorizonDebugUtility.prototype.m_startupStartTimeMs = 0;
oFF.HuHorizonDebugUtility.prototype.m_startupTimeMs = 0;
oFF.HuHorizonDebugUtility.prototype._getProcess = function()
{
	return this.m_process;
};
oFF.HuHorizonDebugUtility.prototype._setupInternal = function(process)
{
	this.m_process = process;
};
oFF.HuHorizonDebugUtility.prototype.getLastStartupTime = function()
{
	return this.m_startupTimeMs;
};
oFF.HuHorizonDebugUtility.prototype.isDebugEnvironment = function()
{
	return this._getProcess().getEnvironment().getBooleanByKeyExt(oFF.HuHorizonConstants.DEBUG_ENVIRONMENT_ENV_VARIABLE, oFF.HuHorizonConstants.DEBUG_ENVIRONMENT_ENABLED);
};
oFF.HuHorizonDebugUtility.prototype.presentPluginProcessTaskManger = function()
{
	let taskManagerPrgRunner = oFF.SuTaskManager.createDialogRunnerForProcessId(this._getProcess(), this._getProcess().getProcessId());
	taskManagerPrgRunner.runProgram();
};
oFF.HuHorizonDebugUtility.prototype.releaseObject = function()
{
	this.m_process = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.HuHorizonDebugUtility.prototype.startupFinished = function()
{
	let bootFinishTimeMs = oFF.XSystemUtils.getCurrentTimeInMilliseconds();
	this.m_startupTimeMs = bootFinishTimeMs - this.m_startupStartTimeMs;
	return this.m_startupTimeMs;
};
oFF.HuHorizonDebugUtility.prototype.startupStarted = function()
{
	this.m_startupStartTimeMs = oFF.XSystemUtils.getCurrentTimeInMilliseconds();
};

oFF.HuLayoutFactory = {

	s_classMap:null,
	_registerLayout:function(layoutType, objectClass)
	{
			if (oFF.notNull(layoutType) && oFF.notNull(objectClass))
		{
			oFF.HuLayoutFactory.s_classMap.put(layoutType.getName(), objectClass);
		}
		else
		{
			oFF.XLogger.println("Cannot register layout class! Missing layout type or object class!");
		}
	},
	createLayout:function(layoutManager, layoutType)
	{
			let returnVal = null;
		if (oFF.isNull(layoutType))
		{
			throw oFF.XException.createRuntimeException("Missing layout type! A layout type is required to create a new layout object!");
		}
		if (oFF.isNull(layoutManager))
		{
			throw oFF.XException.createRuntimeException("Missing layout manager! A layout manager is required to create a new layout object!");
		}
		let objClass = oFF.HuLayoutFactory.s_classMap.getByKey(layoutType.getName());
		if (oFF.notNull(objClass))
		{
			try
			{
				returnVal = objClass.newInstance(null);
				returnVal.initLayout(layoutManager);
				if (returnVal.getLayoutType() !== layoutType)
				{
					throw oFF.XException.createException("Layout type does not match the layout type from the new object instance!");
				}
			}
			catch (excp)
			{
				oFF.XLogger.println(oFF.XStringUtils.concatenate2("[HuLayoutFactory] Error during layout initialization. Reason: ", oFF.XException.getMessage(excp)));
			}
		}
		return returnVal;
	},
	staticSetup:function()
	{
			oFF.HuLayoutFactory.s_classMap = oFF.XHashMapByString.create();
		oFF.HuLayoutFactory._registerLayout(oFF.HuLayoutType.SINGLE_PLUGIN, oFF.XClass.create(oFF.HuSinglePluginLayout));
		oFF.HuLayoutFactory._registerLayout(oFF.HuLayoutType.INTERACTIVE_SPLITTER, oFF.XClass.create(oFF.HuInteractiveSplitterLayout));
		oFF.HuLayoutFactory._registerLayout(oFF.HuLayoutType.CAROUSEL, oFF.XClass.create(oFF.HuCarouselLayout));
		oFF.HuLayoutFactory._registerLayout(oFF.HuLayoutType.TAB_BAR, oFF.XClass.create(oFF.HuTabBarLayout));
		oFF.HuLayoutFactory._registerLayout(oFF.HuLayoutType.FLEX, oFF.XClass.create(oFF.HuFlexLayout));
		oFF.HuLayoutFactory._registerLayout(oFF.HuLayoutType.GRID, oFF.XClass.create(oFF.HuGridLayout));
	}
};

oFF.HuPluginManifestLoader = {

	MANIFESTS_RESOURCE_LOCATION:"/manifests/horizon/plugins/",
	s_processedResourceManifests:null,
	loadPluginManifestsFromResources:function()
	{
			if (oFF.isNull(oFF.HuPluginManifestLoader.s_processedResourceManifests))
		{
			oFF.HuPluginManifestLoader.s_processedResourceManifests = oFF.XList.create();
		}
		let resourceManifests = oFF.XResourcesExt.list(oFF.HuPluginManifestLoader.MANIFESTS_RESOURCE_LOCATION);
		oFF.XCollectionUtils.forEach(resourceManifests, (resource) => {
			if (!oFF.HuPluginManifestLoader.s_processedResourceManifests.contains(resource))
			{
				let resourcePath = oFF.XStringUtils.concatenate2(oFF.HuPluginManifestLoader.MANIFESTS_RESOURCE_LOCATION, resource);
				oFF.HuPluginRegistryBase.registerPluginByResource(resourcePath);
				oFF.HuPluginManifestLoader.s_processedResourceManifests.add(resource);
			}
		});
		return oFF.XPromise.resolve(oFF.XBooleanValue.create(true));
	}
};

oFF.HuPluginRegistryBase = {

	MANIFEST_RESOURCE_TEMPLATE:"/manifests/horizon/plugins/{{PLUGIN_NAME}}.json",
	MANIFEST_RESOURCE_TEMPLATE_PLUGIN_KEY:"{{PLUGIN_NAME}}",
	s_pluginsFactories:null,
	_attemptLoadManifestFromResources:function(pluginName)
	{
			let manifestResource = oFF.XString.replace(oFF.HuPluginRegistryBase.MANIFEST_RESOURCE_TEMPLATE, oFF.HuPluginRegistryBase.MANIFEST_RESOURCE_TEMPLATE_PLUGIN_KEY, pluginName);
		if (oFF.XResources.exists(manifestResource))
		{
			oFF.HuPluginRegistryBase._registerManifestByResource(manifestResource);
		}
	},
	_registerManifestByResource:function(resourcePath)
	{
			try
		{
			let manifestStructure = oFF.XResourcesExt.loadJson(resourcePath);
			let tmpManifest = oFF.HuPluginManifest.createByStructure(manifestStructure);
			oFF.HuPluginRegistryBase.registerPluginByManifest(tmpManifest, resourcePath);
		}
		catch (e)
		{
			oFF.XLogger.printError(oFF.XStringUtils.concatenate2("[Horizon Plugin Registry] Failed to register plugin manifest by resource! Error: ", oFF.XException.getMessage(e)));
		}
	},
	canPluginBeInitialized:function(pluginName)
	{
			if (oFF.XStringUtils.isNotNullAndNotEmpty(pluginName))
		{
			let tmpPluginFactory = oFF.HuPluginRegistryBase.s_pluginsFactories.getByKey(pluginName);
			if (oFF.notNull(tmpPluginFactory))
			{
				return tmpPluginFactory.canBeInitialized();
			}
		}
		return false;
	},
	clearAllPluginManifests:function()
	{
			oFF.XCollectionUtils.forEach(oFF.HuPluginRegistryBase.s_pluginsFactories, (tmpFactory) => {
			tmpFactory.setManifest(null);
			tmpFactory.setManifestOriginPath(null);
		});
	},
	didRegisterManifestFromOrigin:function(originPath)
	{
			let containsFromOrigin = oFF.XCollectionUtils.contains(oFF.HuPluginRegistryBase.s_pluginsFactories.getValuesAsReadOnlyList(), (tmpFactory) => {
			return tmpFactory.getManifest() !== null && oFF.XString.isEqual(originPath, tmpFactory.getManifestOriginPath());
		});
		return containsFromOrigin;
	},
	getAllLoadedPluginNames:function()
	{
			return oFF.HuPluginRegistryBase.getAllLoadedPluginNamesByType(null);
	},
	getAllLoadedPluginNamesByType:function(pluginType)
	{
			let tmpStringList = oFF.XList.create();
		oFF.XCollectionUtils.forEach(oFF.HuPluginRegistryBase.s_pluginsFactories.getValuesAsReadOnlyList(), (tmpPluginFactory) => {
			if (tmpPluginFactory.isPluginLoaded() && (oFF.isNull(pluginType) || tmpPluginFactory.getPluginType() === pluginType))
			{
				tmpStringList.add(tmpPluginFactory.getName());
			}
		});
		tmpStringList.sortByDirection(oFF.XSortDirection.ASCENDING);
		return tmpStringList;
	},
	getAllRegisteredPluginNames:function()
	{
			let tmpPluginNamesSorted = oFF.HuPluginRegistryBase.s_pluginsFactories.getKeysAsReadOnlyList().createListCopy();
		tmpPluginNamesSorted.sortByDirection(oFF.XSortDirection.ASCENDING);
		return tmpPluginNamesSorted;
	},
	getPluginFactory:function(pluginName)
	{
			if (oFF.XStringUtils.isNotNullAndNotEmpty(pluginName))
		{
			return oFF.HuPluginRegistryBase.s_pluginsFactories.getByKey(pluginName);
		}
		return null;
	},
	getPluginFactoryByStartupInfo:function(pluginStartupInfo)
	{
			if (oFF.notNull(pluginStartupInfo) && oFF.XStringUtils.isNotNullAndNotEmpty(pluginStartupInfo.getPluginName()))
		{
			return oFF.HuPluginRegistryBase.s_pluginsFactories.getByKey(pluginStartupInfo.getPluginName());
		}
		return null;
	},
	hasManifest:function(pluginName)
	{
			if (oFF.XStringUtils.isNotNullAndNotEmpty(pluginName))
		{
			let tmpPluginFactory = oFF.HuPluginRegistryBase.s_pluginsFactories.getByKey(pluginName);
			if (oFF.notNull(tmpPluginFactory))
			{
				return tmpPluginFactory.getManifest() !== null;
			}
		}
		return false;
	},
	isPluginLoaded:function(pluginName)
	{
			if (oFF.XStringUtils.isNotNullAndNotEmpty(pluginName))
		{
			let tmpPluginFactory = oFF.HuPluginRegistryBase.s_pluginsFactories.getByKey(pluginName);
			if (oFF.notNull(tmpPluginFactory))
			{
				return tmpPluginFactory.isPluginLoaded();
			}
		}
		return false;
	},
	loadApiPlugin:function(pluginName)
	{
			if (!oFF.HuPluginRegistryBase.isPluginLoaded(pluginName))
		{
			oFF.HuPluginRegistryBase.registerPluginByClass(oFF.HuPluginRegistry.getPluginClass(pluginName));
		}
	},
	loadApiPlugins:function()
	{
			let apiPluginNames = oFF.HuPluginRegistry.getAllApiPluginsNamesSorted();
		if (oFF.XCollectionUtils.hasElements(apiPluginNames))
		{
			oFF.XCollectionUtils.forEach(apiPluginNames, (apiPluginName) => {
				oFF.HuPluginRegistryBase.loadApiPlugin(apiPluginName);
			});
		}
	},
	registerPluginByClass:function(pluginClass)
	{
			if (oFF.notNull(pluginClass))
		{
			try
			{
				let tmpInstance = pluginClass.newInstance(null);
				let pluginName = tmpInstance.getName();
				if (!oFF.HuPluginRegistryBase.s_pluginsFactories.containsKey(pluginName))
				{
					let newPluginFactory = oFF.HuPluginFactory.create(pluginName);
					newPluginFactory.setFactoryClass(pluginClass);
					oFF.HuPluginRegistryBase.s_pluginsFactories.put(pluginName, newPluginFactory);
				}
				else
				{
					let existingPluginFactory = oFF.HuPluginRegistryBase.s_pluginsFactories.getByKey(pluginName);
					if (existingPluginFactory.getFactoryClass() === null)
					{
						existingPluginFactory.setFactoryClass(pluginClass);
					}
				}
				oFF.HuPluginRegistryBase._attemptLoadManifestFromResources(tmpInstance.getName());
			}
			catch (e)
			{
				throw oFF.XException.createRuntimeException("Failed to register plugin class! Class might be invalid!");
			}
		}
	},
	registerPluginByManifest:function(pluginManifest, originPath)
	{
			if (oFF.notNull(pluginManifest))
		{
			let pluginName = pluginManifest.getName();
			let pluginFactory = oFF.HuPluginRegistryBase.s_pluginsFactories.getByKey(pluginName);
			if (oFF.isNull(pluginFactory))
			{
				pluginFactory = oFF.HuPluginFactory.create(pluginName);
				pluginFactory.setManifest(pluginManifest);
				pluginFactory.setManifestOriginPath(originPath);
				oFF.HuPluginRegistryBase.s_pluginsFactories.put(pluginName, pluginFactory);
			}
			else
			{
				if (pluginFactory.getManifest() === null)
				{
					pluginFactory.setManifest(pluginManifest);
					pluginFactory.setManifestOriginPath(originPath);
				}
			}
			oFF.CoConfigurationRegistry.registerConfigurationByProviderIfNeeded(pluginFactory);
		}
	},
	registerPluginByResource:function(resourcePath)
	{
			if (oFF.XStringUtils.isNotNullAndNotEmpty(resourcePath) && oFF.XResources.exists(resourcePath))
		{
			oFF.HuPluginRegistryBase._registerManifestByResource(resourcePath);
		}
	},
	staticSetup:function()
	{
			oFF.HuPluginRegistryBase.s_pluginsFactories = oFF.XLinkedHashMapByString.create();
	}
};

oFF.HuPluginControllerFactory = {

	s_classMap:null,
	_registerPluginController:function(pluginType, objectClass)
	{
			if (oFF.notNull(pluginType) && oFF.notNull(objectClass))
		{
			oFF.HuPluginControllerFactory.s_classMap.put(pluginType.getName(), objectClass);
		}
		else
		{
			throw oFF.XException.createRuntimeException("Cannot register plugin controller class! Missing plugin type or object class!");
		}
	},
	createNewController:function(pluginParentController, pluginStartupInfo)
	{
			if (oFF.isNull(pluginStartupInfo))
		{
			return oFF.XPromise.reject(oFF.XError.create("Cannot initialize plugin! Missign plugin startup info!").setErrorType(oFF.HuErrorType.MISSING_PLUGIN_STARTUP_INFO));
		}
		let pluginFactory = oFF.HuPluginRegistryBase.getPluginFactoryByStartupInfo(pluginStartupInfo);
		if (oFF.isNull(pluginFactory) || !pluginFactory.canBeInitialized())
		{
			return oFF.XPromise.reject(oFF.XError.create("Cannot initialize plugin! Invalid factory!").setErrorType(oFF.HuErrorType.PLUGIN_INITIALIZATION_ERROR));
		}
		if (oFF.isNull(pluginParentController))
		{
			return oFF.XPromise.reject(oFF.XError.create("Cannot initialize plugin! Missing parent controller!").setErrorType(oFF.HuErrorType.PLUGIN_INITIALIZATION_ERROR));
		}
		let pluginType = pluginFactory.getPluginType();
		let objClass = oFF.HuPluginControllerFactory.s_classMap.getByKey(pluginType.getName());
		if (oFF.isNull(objClass))
		{
			return oFF.XPromise.reject(oFF.XError.create("Could not find plugin controller class for the specified plugin type!").setErrorType(oFF.HuErrorType.PLUGIN_INITIALIZATION_ERROR));
		}
		try
		{
			let newPluginControllerInstance = objClass.newInstance(null);
			if (newPluginControllerInstance.getPluginType() !== pluginType)
			{
				throw oFF.XException.createException("Plugin type does not match the plugin type from the new object instance!");
			}
			newPluginControllerInstance.configure(pluginFactory, pluginParentController, pluginStartupInfo);
			return newPluginControllerInstance.initializePlugin().onThenExt((result) => {
				return newPluginControllerInstance;
			});
		}
		catch (excp)
		{
			return oFF.XPromise.reject(oFF.XError.create(oFF.XStringUtils.concatenate2("[HuPluginControllerFactory] Error during plugin controller initialization. Reason: ", oFF.XException.getMessage(excp))).setErrorType(oFF.HuErrorType.PLUGIN_INITIALIZATION_ERROR));
		}
	},
	staticSetup:function()
	{
			oFF.HuPluginControllerFactory.s_classMap = oFF.XHashMapByString.create();
		oFF.HuPluginControllerFactory._registerPluginController(oFF.HuPluginType.COMPONENT, oFF.XClass.create(oFF.HuComponentPluginController));
		oFF.HuPluginControllerFactory._registerPluginController(oFF.HuPluginType.DOCUMENT, oFF.XClass.create(oFF.HuDocumentPluginController));
		oFF.HuPluginControllerFactory._registerPluginController(oFF.HuPluginType.COMMAND, oFF.XClass.create(oFF.HuCommandPluginController));
	}
};

oFF.HuPluginManifestConstants = {

	AUTHOR_KEY:"Author",
	CONFIGURATION_KEY:"Configuration",
	DEPENDENCIES_KEY:"Dependencies",
	DESCRIPTION_KEY:"Description",
	DISPLAY_NAME_KEY:"DisplayName",
	MODULES_KEY:"Modules",
	NAME_KEY:"Name",
	PLUGIN_CATEGORY_KEY:"Category",
	PLUGIN_TYPE_KEY:"Type",
	SUB_SYSTEMS_KEY:"SubSystems",
	TAGS_KEY:"Tags",
	URL_KEY:"Url",
	VERSION_KEY:"Version"
};

oFF.HuBaseUtils = {

	deregisterNotificationObservers:function(notificationObserverIds, notificationCenter)
	{
			if (oFF.XCollectionUtils.hasElements(notificationObserverIds) && oFF.notNull(notificationCenter))
		{
			oFF.XCollectionUtils.forEach(notificationObserverIds, (observerId) => {
				notificationCenter.removeObserverByUuid(observerId);
			});
			notificationObserverIds.clear();
		}
	},
	formatLogWithContextName:function(contextName, logline)
	{
			if (oFF.XStringUtils.isNotNullAndNotEmpty(contextName))
		{
			return oFF.XStringUtils.concatenate4("(", contextName, ") ", logline);
		}
		return logline;
	},
	loadPluginDependencies:function(pluginFactory, kernel, logContext)
	{
			if (oFF.isNull(pluginFactory) || pluginFactory.getManifest() === null)
		{
			return oFF.XPromise.resolve(oFF.XBooleanValue.create(false));
		}
		if (oFF.isNull(kernel))
		{
			return oFF.XPromise.reject(oFF.XError.create("A kernel is required for loading plugin dependencies!"));
		}
		if (oFF.isNull(logContext))
		{
			return oFF.XPromise.reject(oFF.XError.create("Missing log context!"));
		}
		if (pluginFactory.areDependenciesLoaded())
		{
			logContext.logDebug(oFF.XStringUtils.concatenate3("Dependencies for plugin ", pluginFactory.getName(), " already loaded!"));
			return oFF.XPromise.resolve(oFF.XBooleanValue.create(false));
		}
		let pluginModules = pluginFactory.getManifest().getModules();
		if (!oFF.XCollectionUtils.hasElements(pluginModules))
		{
			logContext.logDebug(oFF.XStringUtils.concatenate3("Plugin ", pluginFactory.getName(), " has no module dependencies!"));
		}
		else
		{
			logContext.logDebug(oFF.XStringUtils.concatenate4("Loading ", pluginFactory.getName(), " module dependencies: ", oFF.XCollectionUtils.join(pluginModules, ", ")));
		}
		let pluginSubSystems = pluginFactory.getManifest().getSubSystems();
		if (!oFF.XCollectionUtils.hasElements(pluginSubSystems))
		{
			logContext.logDebug(oFF.XStringUtils.concatenate3("Plugin ", pluginFactory.getName(), " has no sub system dependencies!"));
		}
		else
		{
			logContext.logDebug(oFF.XStringUtils.concatenate4("Starting ", pluginFactory.getName(), " sub system dependencies: ", oFF.XCollectionUtils.join(pluginSubSystems, ", ")));
		}
		return pluginFactory.loadDependencies(kernel).onThen((res) => {
			logContext.logDebug(oFF.XStringUtils.concatenate3("Dependencies for plugin ", pluginFactory.getName(), " successfully loaded!"));
			oFF.HuPluginRegistryBase.loadApiPlugin(pluginFactory.getName());
		}).onCatch((err) => {
			logContext.logDebug(oFF.XStringUtils.concatenate4("Could not load dependencies for plugin ", pluginFactory.getName(), " | Reason: ", err.getText()));
			throw oFF.XException.createException(err.getText());
		});
	}
};

oFF.HuHorizonWorkspaceConstants = {

	GIT_IGNORE_FILE_NAME:".gitignore",
	HORIZON_DIR_NAME:".horizon",
	HORIZON_WORKSPACE_CONFIG_FILE_NAME:"horizon.cfg",
	PLUGINS_DIR_NAME:"plugins",
	PLUGIN_SETTINGS_DIR_NAME:"settings",
	PLUGIN_STORAGE_DIR_NAME:"storage",
	SETTINGS_FILE_NAME:"settings.cfg",
	STATE_FILE_NAME:"state.json",
	STORAGE_FILE_EXTENSION:".json"
};

oFF.HuMessage = function() {};
oFF.HuMessage.prototype = new oFF.XObject();
oFF.HuMessage.prototype._ff_c = "HuMessage";

oFF.HuMessage.createError = function(title, subtitle, description, messageGroup)
{
	let newStatusObj = new oFF.HuMessage();
	newStatusObj._setupMessageObject(title, subtitle, description, oFF.HuMessageType.ERROR, messageGroup);
	return newStatusObj;
};
oFF.HuMessage.createInformation = function(title, subtitle, description, messageGroup)
{
	let newStatusObj = new oFF.HuMessage();
	newStatusObj._setupMessageObject(title, subtitle, description, oFF.HuMessageType.INFORMATION, messageGroup);
	return newStatusObj;
};
oFF.HuMessage.createSuccess = function(title, subtitle, description, messageGroup)
{
	let newStatusObj = new oFF.HuMessage();
	newStatusObj._setupMessageObject(title, subtitle, description, oFF.HuMessageType.SUCCESS, messageGroup);
	return newStatusObj;
};
oFF.HuMessage.createWarning = function(title, subtitle, description, messageGroup)
{
	let newStatusObj = new oFF.HuMessage();
	newStatusObj._setupMessageObject(title, subtitle, description, oFF.HuMessageType.WARNING, messageGroup);
	return newStatusObj;
};
oFF.HuMessage.prototype.m_description = null;
oFF.HuMessage.prototype.m_messageGroup = null;
oFF.HuMessage.prototype.m_messageType = null;
oFF.HuMessage.prototype.m_subtitle = null;
oFF.HuMessage.prototype.m_title = null;
oFF.HuMessage.prototype._setupMessageObject = function(title, subtitle, description, messageType, messageGroup)
{
	this.m_title = title;
	this.m_subtitle = subtitle;
	this.m_description = description;
	this.m_messageType = messageType;
	this.m_messageGroup = messageGroup;
	if (oFF.isNull(this.m_messageType))
	{
		this.m_messageType = oFF.HuMessageType.INFORMATION;
	}
	if (oFF.isNull(this.m_messageGroup))
	{
		this.m_messageGroup = oFF.HuMessageGroup.SYSTEM;
	}
};
oFF.HuMessage.prototype.getDescription = function()
{
	return this.m_description;
};
oFF.HuMessage.prototype.getMessageGroup = function()
{
	return this.m_messageGroup;
};
oFF.HuMessage.prototype.getMessageType = function()
{
	return this.m_messageType;
};
oFF.HuMessage.prototype.getSubtitle = function()
{
	return this.m_subtitle;
};
oFF.HuMessage.prototype.getTitle = function()
{
	return this.m_title;
};
oFF.HuMessage.prototype.releaseObject = function()
{
	this.m_messageType = null;
	this.m_messageGroup = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.HuDeveloperAction = function() {};
oFF.HuDeveloperAction.prototype = new oFF.XObject();
oFF.HuDeveloperAction.prototype._ff_c = "HuDeveloperAction";

oFF.HuDeveloperAction.create = function(displayName, description, icon, isSectionStart, actionProcedure)
{
	let newInstance = new oFF.HuDeveloperAction();
	newInstance._setupAction(displayName, description, icon, isSectionStart, actionProcedure);
	return newInstance;
};
oFF.HuDeveloperAction.prototype.m_actionProcedure = null;
oFF.HuDeveloperAction.prototype.m_actionUuid = null;
oFF.HuDeveloperAction.prototype.m_description = null;
oFF.HuDeveloperAction.prototype.m_displayName = null;
oFF.HuDeveloperAction.prototype.m_icon = null;
oFF.HuDeveloperAction.prototype.m_isSectionStart = false;
oFF.HuDeveloperAction.prototype._setupAction = function(displayName, description, icon, isSectionStart, actionProcedure)
{
	this.m_displayName = displayName;
	this.m_description = description;
	this.m_icon = icon;
	this.m_isSectionStart = isSectionStart;
	this.m_actionProcedure = actionProcedure;
	if (oFF.XStringUtils.isNullOrEmpty(this.m_displayName))
	{
		throw oFF.XException.createRuntimeException("[HuDeveloperAction] Cannot create a new action object without a display name!");
	}
	if (oFF.isNull(this.m_actionProcedure))
	{
		throw oFF.XException.createRuntimeException("[HuDeveloperAction] Cannot create a new action object without an action procedure!");
	}
	this.m_actionUuid = oFF.XStringUtils.concatenate2("devAction_", oFF.XGuid.getGuid());
};
oFF.HuDeveloperAction.prototype.getActionProcedure = function()
{
	return this.m_actionProcedure;
};
oFF.HuDeveloperAction.prototype.getDescription = function()
{
	return this.m_description;
};
oFF.HuDeveloperAction.prototype.getDisplayName = function()
{
	return this.m_displayName;
};
oFF.HuDeveloperAction.prototype.getIcon = function()
{
	return this.m_icon;
};
oFF.HuDeveloperAction.prototype.getId = function()
{
	return this.m_actionUuid;
};
oFF.HuDeveloperAction.prototype.isSectionStart = function()
{
	return this.m_isSectionStart;
};
oFF.HuDeveloperAction.prototype.releaseObject = function()
{
	this.m_actionProcedure = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.HuPluginStartupInfo = function() {};
oFF.HuPluginStartupInfo.prototype = new oFF.XObject();
oFF.HuPluginStartupInfo.prototype._ff_c = "HuPluginStartupInfo";

oFF.HuPluginStartupInfo.CONFIG = "config";
oFF.HuPluginStartupInfo.EXTRA_DATA_CONTAINER = "container";
oFF.HuPluginStartupInfo.EXTRA_DATA_LAYOUT = "layout";
oFF.HuPluginStartupInfo.NAME = "name";
oFF.HuPluginStartupInfo.PLUGIN = "plugin";
oFF.HuPluginStartupInfo.create = function(pluginName)
{
	return oFF.HuPluginStartupInfo.createExt(pluginName, null, null, null, null);
};
oFF.HuPluginStartupInfo.createExt = function(pluginName, configJson, name, layoutJson, containerJson)
{
	let newInstance = new oFF.HuPluginStartupInfo();
	newInstance._setupInternal(pluginName, configJson, name, layoutJson, containerJson);
	if (newInstance._isValid())
	{
		return newInstance;
	}
	return null;
};
oFF.HuPluginStartupInfo.createWithStructure = function(jsonStructure)
{
	return oFF.HuPluginStartupInfo.createWithStructureExt(null, jsonStructure);
};
oFF.HuPluginStartupInfo.createWithStructureExt = function(pluginName, jsonStructure)
{
	let newInstance = new oFF.HuPluginStartupInfo();
	newInstance._setupWithPluginNameAndStructure(pluginName, jsonStructure);
	if (newInstance._isValid())
	{
		return newInstance;
	}
	return null;
};
oFF.HuPluginStartupInfo.prototype.m_configJson = null;
oFF.HuPluginStartupInfo.prototype.m_containerJson = null;
oFF.HuPluginStartupInfo.prototype.m_layoutJson = null;
oFF.HuPluginStartupInfo.prototype.m_name = null;
oFF.HuPluginStartupInfo.prototype.m_pluginName = null;
oFF.HuPluginStartupInfo.prototype._isValid = function()
{
	return oFF.XStringUtils.isNotNullAndNotEmpty(this.m_pluginName);
};
oFF.HuPluginStartupInfo.prototype._processExtraData = function(extraDataStructure)
{
	if (oFF.notNull(extraDataStructure))
	{
		this.m_layoutJson = extraDataStructure.getStructureByKey(oFF.HuPluginStartupInfo.EXTRA_DATA_LAYOUT);
		this.m_containerJson = extraDataStructure.getStructureByKey(oFF.HuPluginStartupInfo.EXTRA_DATA_CONTAINER);
	}
};
oFF.HuPluginStartupInfo.prototype._processStructure = function(jsonStructure)
{
	if (oFF.notNull(jsonStructure))
	{
		this.m_pluginName = jsonStructure.getStringByKeyExt(oFF.HuPluginStartupInfo.PLUGIN, this.m_pluginName);
		if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_pluginName))
		{
			this.m_name = jsonStructure.getStringByKey(oFF.HuPluginStartupInfo.NAME);
			this.m_configJson = jsonStructure.getStructureByKey(oFF.HuPluginStartupInfo.CONFIG);
			this._processExtraData(jsonStructure);
		}
	}
};
oFF.HuPluginStartupInfo.prototype._setupInternal = function(pluginName, configJson, name, layoutJson, containerJson)
{
	this.m_pluginName = pluginName;
	this.m_configJson = configJson;
	this.m_name = name;
	this.m_layoutJson = layoutJson;
	this.m_containerJson = containerJson;
};
oFF.HuPluginStartupInfo.prototype._setupWithPluginNameAndStructure = function(pluginName, jsonStructure)
{
	this.m_pluginName = pluginName;
	this._processStructure(jsonStructure);
};
oFF.HuPluginStartupInfo.prototype.getConfigStructure = function()
{
	if (oFF.isNull(this.m_configJson))
	{
		this.m_configJson = oFF.PrFactory.createStructure();
	}
	return this.m_configJson;
};
oFF.HuPluginStartupInfo.prototype.getContainerStructure = function()
{
	if (oFF.isNull(this.m_containerJson))
	{
		this.m_containerJson = oFF.PrFactory.createStructure();
	}
	return this.m_containerJson;
};
oFF.HuPluginStartupInfo.prototype.getLayoutStructure = function()
{
	if (oFF.isNull(this.m_layoutJson))
	{
		this.m_layoutJson = oFF.PrFactory.createStructure();
	}
	return this.m_layoutJson;
};
oFF.HuPluginStartupInfo.prototype.getName = function()
{
	return this.m_name;
};
oFF.HuPluginStartupInfo.prototype.getPluginName = function()
{
	return this.m_pluginName;
};
oFF.HuPluginStartupInfo.prototype.releaseObject = function()
{
	this.m_pluginName = null;
	this.m_configJson = null;
	this.m_name = null;
	this.m_layoutJson = null;
	this.m_containerJson = null;
};

oFF.HuToolbarItem = function() {};
oFF.HuToolbarItem.prototype = new oFF.XObject();
oFF.HuToolbarItem.prototype._ff_c = "HuToolbarItem";

oFF.HuToolbarItem.create = function(actionId, name, text, icon, tooltip, group)
{
	let newStatusObj = new oFF.HuToolbarItem();
	newStatusObj._setupToolbarItem(actionId, name, text, icon, tooltip, group);
	return newStatusObj;
};
oFF.HuToolbarItem.prototype.m_actionId = null;
oFF.HuToolbarItem.prototype.m_group = null;
oFF.HuToolbarItem.prototype.m_icon = null;
oFF.HuToolbarItem.prototype.m_name = null;
oFF.HuToolbarItem.prototype.m_text = null;
oFF.HuToolbarItem.prototype.m_tooltip = null;
oFF.HuToolbarItem.prototype._setupToolbarItem = function(actionId, name, text, icon, tooltip, group)
{
	this.m_actionId = actionId;
	this.m_name = name;
	this.m_text = text;
	this.m_icon = icon;
	this.m_tooltip = tooltip;
	this.m_group = group;
	if (oFF.XStringUtils.isNullOrEmpty(this.m_icon))
	{
		this.m_icon = "question-mark";
	}
	if (oFF.isNull(this.m_group))
	{
		this.m_group = oFF.HuToolbarGroup.UNGROUPED;
	}
};
oFF.HuToolbarItem.prototype.getActionId = function()
{
	return this.m_actionId;
};
oFF.HuToolbarItem.prototype.getGroup = function()
{
	return this.m_group;
};
oFF.HuToolbarItem.prototype.getIcon = function()
{
	return this.m_icon;
};
oFF.HuToolbarItem.prototype.getName = function()
{
	return this.m_name;
};
oFF.HuToolbarItem.prototype.getText = function()
{
	return this.m_text;
};
oFF.HuToolbarItem.prototype.getTooltip = function()
{
	return this.m_tooltip;
};
oFF.HuToolbarItem.prototype.isValid = function()
{
	return oFF.XStringUtils.isNotNullAndNotEmpty(this.m_actionId);
};
oFF.HuToolbarItem.prototype.releaseObject = function()
{
	this.m_group = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.HuBootConfig = function() {};
oFF.HuBootConfig.prototype = new oFF.XObjectExt();
oFF.HuBootConfig.prototype._ff_c = "HuBootConfig";

oFF.HuBootConfig.create = function()
{
	let newInstance = new oFF.HuBootConfig();
	newInstance._setupBootConfig();
	return newInstance;
};
oFF.HuBootConfig.prototype.m_configFilePath = null;
oFF.HuBootConfig.prototype.m_configStr = null;
oFF.HuBootConfig.prototype.m_horizonConfiguration = null;
oFF.HuBootConfig.prototype.m_isShowSplashScreen = false;
oFF.HuBootConfig.prototype.m_workspaceDirectoryPasth = null;
oFF.HuBootConfig.prototype._setupBootConfig = function()
{
	this.m_isShowSplashScreen = true;
};
oFF.HuBootConfig.prototype.getConfigFilePath = function()
{
	return this.m_configFilePath;
};
oFF.HuBootConfig.prototype.getConfigString = function()
{
	return this.m_configStr;
};
oFF.HuBootConfig.prototype.getHorizonConfiguration = function()
{
	return this.m_horizonConfiguration;
};
oFF.HuBootConfig.prototype.getWorkspaceDirectoryPath = function()
{
	return this.m_workspaceDirectoryPasth;
};
oFF.HuBootConfig.prototype.isShowSplashScreen = function()
{
	return this.m_isShowSplashScreen;
};
oFF.HuBootConfig.prototype.releaseObject = function()
{
	this.m_horizonConfiguration = null;
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.HuBootConfig.prototype.setConfigFilePath = function(configFilePath)
{
	this.m_configFilePath = configFilePath;
};
oFF.HuBootConfig.prototype.setConfigString = function(configStr)
{
	this.m_configStr = configStr;
};
oFF.HuBootConfig.prototype.setHorizonConfiguration = function(horizonConfiguration)
{
	this.m_horizonConfiguration = horizonConfiguration;
};
oFF.HuBootConfig.prototype.setShowSplashScreen = function(showSplashScreen)
{
	this.m_isShowSplashScreen = showSplashScreen;
};
oFF.HuBootConfig.prototype.setWorkspaceDirectoryPath = function(workspaceDirectoryPath)
{
	this.m_workspaceDirectoryPasth = workspaceDirectoryPath;
};
oFF.HuBootConfig.prototype.shouldBootIntoVirtualWorkspace = function()
{
	return oFF.XStringUtils.isNotNullAndNotEmpty(this.getConfigString()) || oFF.XStringUtils.isNotNullAndNotEmpty(this.getConfigFilePath());
};

oFF.HuLogger = function() {};
oFF.HuLogger.prototype = new oFF.XObject();
oFF.HuLogger.prototype._ff_c = "HuLogger";

oFF.HuLogger.DEBUG_PREFIX = "[Debug] ";
oFF.HuLogger.INFO_PREFIX = "[Info] ";
oFF.HuLogger.createNewLogger = function()
{
	let newLogger = new oFF.HuLogger();
	return newLogger;
};
oFF.HuLogger.prototype.m_isDebugLogEnabled = false;
oFF.HuLogger.prototype.logDebug = function(logline)
{
	if (this.m_isDebugLogEnabled)
	{
		oFF.XLogger.println(oFF.XStringUtils.concatenate2(oFF.HuLogger.DEBUG_PREFIX, logline));
	}
};
oFF.HuLogger.prototype.logInfo = function(logline)
{
	oFF.XLogger.println(oFF.XStringUtils.concatenate2(oFF.HuLogger.INFO_PREFIX, logline));
};
oFF.HuLogger.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.HuLogger.prototype.setDebugEnabled = function(enabled)
{
	this.m_isDebugLogEnabled = enabled;
};

oFF.HuPluginManifest = function() {};
oFF.HuPluginManifest.prototype = new oFF.XObject();
oFF.HuPluginManifest.prototype._ff_c = "HuPluginManifest";

oFF.HuPluginManifest.createByStructure = function(manifestStructure)
{
	let newManifest = new oFF.HuPluginManifest();
	newManifest._setupByStructure(manifestStructure);
	return newManifest;
};
oFF.HuPluginManifest.prototype.m_author = null;
oFF.HuPluginManifest.prototype.m_configurationMetadata = null;
oFF.HuPluginManifest.prototype.m_dependenciesList = null;
oFF.HuPluginManifest.prototype.m_description = null;
oFF.HuPluginManifest.prototype.m_displayName = null;
oFF.HuPluginManifest.prototype.m_modulesList = null;
oFF.HuPluginManifest.prototype.m_name = null;
oFF.HuPluginManifest.prototype.m_pluginCategory = null;
oFF.HuPluginManifest.prototype.m_pluginType = null;
oFF.HuPluginManifest.prototype.m_subSystemsList = null;
oFF.HuPluginManifest.prototype.m_tags = null;
oFF.HuPluginManifest.prototype.m_url = null;
oFF.HuPluginManifest.prototype.m_validationErrors = null;
oFF.HuPluginManifest.prototype.m_version = null;
oFF.HuPluginManifest.prototype._addModuleDependency = function(moduleName)
{
	if (!this.m_modulesList.contains(moduleName))
	{
		this.m_modulesList.add(moduleName);
	}
};
oFF.HuPluginManifest.prototype._addPluginDependency = function(pluginName)
{
	if (!this.m_dependenciesList.contains(pluginName))
	{
		this.m_dependenciesList.add(pluginName);
	}
};
oFF.HuPluginManifest.prototype._addSubSystem = function(subSystemName)
{
	if (!this.m_subSystemsList.contains(subSystemName))
	{
		this.m_subSystemsList.add(subSystemName);
	}
};
oFF.HuPluginManifest.prototype._addTagByString = function(tagStr)
{
	let processedTagStr = oFF.XString.trim(tagStr);
	processedTagStr = oFF.XString.toLowerCase(processedTagStr);
	let pluginTag = oFF.HuPluginTag.createCustomTagIfNecessary(processedTagStr);
	if (!this.m_tags.contains(pluginTag))
	{
		this.m_tags.add(pluginTag);
	}
};
oFF.HuPluginManifest.prototype._parseStructure = function(manifestStructure)
{
	if (oFF.notNull(manifestStructure) && manifestStructure.isStructure())
	{
		this._setName(manifestStructure.getStringByKey(oFF.HuPluginManifestConstants.NAME_KEY));
		this._setPluginType(oFF.HuPluginType.lookup(manifestStructure.getStringByKey(oFF.HuPluginManifestConstants.PLUGIN_TYPE_KEY)));
		this._setDescription(manifestStructure.getStringByKey(oFF.HuPluginManifestConstants.DESCRIPTION_KEY));
		this._setDisplayName(manifestStructure.getStringByKey(oFF.HuPluginManifestConstants.DISPLAY_NAME_KEY));
		this._setPluginCategory(oFF.HuPluginCategory.createCategoryIfNecessary(manifestStructure.getStringByKey(oFF.HuPluginManifestConstants.PLUGIN_CATEGORY_KEY)));
		this._setAuthor(manifestStructure.getStringByKey(oFF.HuPluginManifestConstants.AUTHOR_KEY));
		this._setVersion(manifestStructure.getStringByKey(oFF.HuPluginManifestConstants.VERSION_KEY));
		this._processTagsElement(manifestStructure.getByKey(oFF.HuPluginManifestConstants.TAGS_KEY));
		this._processPluginDependencies(manifestStructure.getByKey(oFF.HuPluginManifestConstants.DEPENDENCIES_KEY));
		this._processModuleDependencies(manifestStructure.getByKey(oFF.HuPluginManifestConstants.MODULES_KEY));
		this._processSubSystems(manifestStructure.getByKey(oFF.HuPluginManifestConstants.SUB_SYSTEMS_KEY));
		this._setUrl(manifestStructure.getStringByKey(oFF.HuPluginManifestConstants.URL_KEY));
		this._setConfigurationMetadata(oFF.CoConfigurationMetadataUtils.processConfigurationMetadataSafe(this.getName(), oFF.CoConfigurationType.PLUGIN, manifestStructure.getByKey(oFF.HuPluginManifestConstants.CONFIGURATION_KEY)));
	}
	else
	{
		throw oFF.XException.createRuntimeException("Missing or invalid plugin manifest json!");
	}
};
oFF.HuPluginManifest.prototype._processListOrStrElement = function(element, consumer)
{
	if (oFF.notNull(element) && oFF.notNull(consumer))
	{
		if (element.isString())
		{
			let elementStr = element.asString().getString();
			let tmpStrList = oFF.XStringTokenizer.splitString(elementStr, ",");
			oFF.XCollectionUtils.forEach(tmpStrList, consumer);
		}
		else if (element.isList())
		{
			let elementList = element.asList();
			oFF.XCollectionUtils.forEach(elementList, (tmpElement) => {
				if (tmpElement.isString())
				{
					consumer(tmpElement.asString().getString());
				}
			});
		}
	}
};
oFF.HuPluginManifest.prototype._processModuleDependencies = function(modulesElement)
{
	this._processListOrStrElement(modulesElement, (tmpStr) => {
		this._addModuleDependency(tmpStr);
	});
};
oFF.HuPluginManifest.prototype._processPluginDependencies = function(pluginDependeciesElement)
{
	this._processListOrStrElement(pluginDependeciesElement, (tmpStr) => {
		this._addPluginDependency(tmpStr);
	});
};
oFF.HuPluginManifest.prototype._processSubSystems = function(modulesElement)
{
	this._processListOrStrElement(modulesElement, (tmpStr) => {
		this._addSubSystem(tmpStr);
	});
};
oFF.HuPluginManifest.prototype._processTagsElement = function(tagsElement)
{
	this._processListOrStrElement(tagsElement, (tmpStr) => {
		this._addTagByString(tmpStr);
	});
};
oFF.HuPluginManifest.prototype._setAuthor = function(author)
{
	this.m_author = author;
};
oFF.HuPluginManifest.prototype._setConfigurationMetadata = function(configurationMetadata)
{
	this.m_configurationMetadata = configurationMetadata;
};
oFF.HuPluginManifest.prototype._setDescription = function(description)
{
	this.m_description = description;
};
oFF.HuPluginManifest.prototype._setDisplayName = function(displayName)
{
	this.m_displayName = displayName;
};
oFF.HuPluginManifest.prototype._setName = function(name)
{
	this.m_name = name;
};
oFF.HuPluginManifest.prototype._setPluginCategory = function(pluginCategory)
{
	this.m_pluginCategory = pluginCategory;
};
oFF.HuPluginManifest.prototype._setPluginType = function(pluginType)
{
	this.m_pluginType = pluginType;
};
oFF.HuPluginManifest.prototype._setUrl = function(url)
{
	this.m_url = url;
};
oFF.HuPluginManifest.prototype._setVersion = function(version)
{
	this.m_version = version;
};
oFF.HuPluginManifest.prototype._setupByStructure = function(struct)
{
	this._setupInternal();
	this._parseStructure(struct);
	this._validate();
};
oFF.HuPluginManifest.prototype._setupInternal = function()
{
	this.m_tags = oFF.XList.create();
	this.m_dependenciesList = oFF.XList.create();
	this.m_modulesList = oFF.XList.create();
	this.m_subSystemsList = oFF.XList.create();
	this.m_validationErrors = oFF.XList.create();
};
oFF.HuPluginManifest.prototype._validate = function()
{
	this.m_validationErrors.clear();
	if (oFF.XStringUtils.isNullOrEmpty(this.m_name))
	{
		this.m_validationErrors.add(oFF.XError.create("Missing plugin name!").setErrorType(oFF.HuErrorType.MANIFEST_MISSING_NAME));
	}
	if (oFF.XStringUtils.containsString(this.m_name, " ", true))
	{
		this.m_validationErrors.add(oFF.XError.create("Name cannot contain spaces!").setErrorType(oFF.HuErrorType.MANIFEST_INVALID_NAME));
	}
};
oFF.HuPluginManifest.prototype.getAuthor = function()
{
	return this.m_author;
};
oFF.HuPluginManifest.prototype.getConfigurationMetadata = function()
{
	return this.m_configurationMetadata;
};
oFF.HuPluginManifest.prototype.getDependencies = function()
{
	return this.m_dependenciesList;
};
oFF.HuPluginManifest.prototype.getDescription = function()
{
	return this.m_description;
};
oFF.HuPluginManifest.prototype.getDisplayName = function()
{
	return this.m_displayName;
};
oFF.HuPluginManifest.prototype.getModules = function()
{
	return this.m_modulesList;
};
oFF.HuPluginManifest.prototype.getName = function()
{
	return this.m_name;
};
oFF.HuPluginManifest.prototype.getPluginCategory = function()
{
	return this.m_pluginCategory;
};
oFF.HuPluginManifest.prototype.getPluginType = function()
{
	return this.m_pluginType;
};
oFF.HuPluginManifest.prototype.getSubSystems = function()
{
	return this.m_subSystemsList;
};
oFF.HuPluginManifest.prototype.getTags = function()
{
	return this.m_tags;
};
oFF.HuPluginManifest.prototype.getUrl = function()
{
	return this.m_url;
};
oFF.HuPluginManifest.prototype.getValidationErrors = function()
{
	return this.m_validationErrors;
};
oFF.HuPluginManifest.prototype.getVersion = function()
{
	return this.m_version;
};
oFF.HuPluginManifest.prototype.hasConfigurationMetadata = function()
{
	return oFF.notNull(this.m_configurationMetadata) && this.m_configurationMetadata.hasProperties();
};
oFF.HuPluginManifest.prototype.isValid = function()
{
	return !this.m_validationErrors.hasElements();
};
oFF.HuPluginManifest.prototype.releaseObject = function()
{
	this.m_validationErrors = oFF.XObjectExt.release(this.m_validationErrors);
	this.m_configurationMetadata = null;
	this.m_pluginType = null;
	this.m_tags.clear();
	this.m_tags = oFF.XObjectExt.release(this.m_tags);
	this.m_dependenciesList = oFF.XObjectExt.release(this.m_dependenciesList);
	this.m_modulesList = oFF.XObjectExt.release(this.m_modulesList);
	this.m_subSystemsList = oFF.XObjectExt.release(this.m_subSystemsList);
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.HuHorizonDfPopup = function() {};
oFF.HuHorizonDfPopup.prototype = new oFF.DfUiPopup();
oFF.HuHorizonDfPopup.prototype._ff_c = "HuHorizonDfPopup";

oFF.HuHorizonDfPopup.prototype.m_controller = null;
oFF.HuHorizonDfPopup.prototype.getGenericController = function()
{
	return this.m_controller;
};
oFF.HuHorizonDfPopup.prototype.releaseObject = function()
{
	this.m_controller = null;
	oFF.DfUiPopup.prototype.releaseObject.call( this );
};
oFF.HuHorizonDfPopup.prototype.setupPopup = function(genesis)
{
	oFF.DfUiPopup.prototype.setupPopup.call( this , genesis);
};
oFF.HuHorizonDfPopup.prototype.setupWithController = function(controller)
{
	this.m_controller = controller;
	this.setupPopup(controller.getGenesis());
};

oFF.HuDfHorizonLogContext = function() {};
oFF.HuDfHorizonLogContext.prototype = new oFF.XObject();
oFF.HuDfHorizonLogContext.prototype._ff_c = "HuDfHorizonLogContext";

oFF.HuDfHorizonLogContext.prototype.m_logger = null;
oFF.HuDfHorizonLogContext.prototype._setupLogger = function(logger)
{
	this.m_logger = logger;
};
oFF.HuDfHorizonLogContext.prototype.getLogger = function()
{
	return this.m_logger;
};
oFF.HuDfHorizonLogContext.prototype.logDebug = function(logline)
{
	if (this.getLogger() !== null)
	{
		this.getLogger().logDebug(oFF.HuBaseUtils.formatLogWithContextName(this.getLogContextName(), logline));
	}
};
oFF.HuDfHorizonLogContext.prototype.logInfo = function(logline)
{
	if (this.getLogger() !== null)
	{
		this.getLogger().logInfo(oFF.HuBaseUtils.formatLogWithContextName(this.getLogContextName(), logline));
	}
};
oFF.HuDfHorizonLogContext.prototype.releaseObject = function()
{
	this.m_logger = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.HuPluginFactory = function() {};
oFF.HuPluginFactory.prototype = new oFF.XObject();
oFF.HuPluginFactory.prototype._ff_c = "HuPluginFactory";

oFF.HuPluginFactory.create = function(name)
{
	let newInstance = new oFF.HuPluginFactory();
	newInstance._setupWithName(name);
	return newInstance;
};
oFF.HuPluginFactory.prototype.m_areModuleDependenciesLoaded = false;
oFF.HuPluginFactory.prototype.m_areSubSystemDependenciesStarted = false;
oFF.HuPluginFactory.prototype.m_factoryClass = null;
oFF.HuPluginFactory.prototype.m_manifest = null;
oFF.HuPluginFactory.prototype.m_manifestOriginPath = null;
oFF.HuPluginFactory.prototype.m_metadataInstance = null;
oFF.HuPluginFactory.prototype.m_name = null;
oFF.HuPluginFactory.prototype._createPluginInstance = function()
{
	if (this.getFactoryClass() !== null)
	{
		let newInstance = this.getFactoryClass().newInstance(null);
		if (oFF.isNull(newInstance))
		{
			throw oFF.XException.createRuntimeException("Failed to create plugin instance! Class might be invalid!");
		}
		return newInstance;
	}
	else
	{
		throw oFF.XException.createRuntimeException("Missing factory class! Cannot create plugin instance!");
	}
};
oFF.HuPluginFactory.prototype._loadModuleDependencies = function(moduleManager)
{
	if (this.getManifest() === null || this.m_areModuleDependenciesLoaded)
	{
		this.m_areModuleDependenciesLoaded = true;
		return oFF.XPromise.resolve(oFF.XBooleanValue.create(false));
	}
	let pluginModules = this.getManifest().getModules();
	if (!oFF.XCollectionUtils.hasElements(pluginModules))
	{
		return oFF.XPromise.resolve(oFF.XBooleanValue.create(false));
	}
	let loadManifestModulesPromise = oFF.XPromise.create((resolve, reject) => {
		moduleManager.processMultiModulesLoad(oFF.SyncType.NON_BLOCKING, oFF.UiLambdaModuleLoadedMultiListener.create((extResult, modules) => {
			if (extResult.isValid())
			{
				this.m_areModuleDependenciesLoaded = true;
				resolve(oFF.XBooleanValue.create(true));
			}
			else
			{
				this.m_areModuleDependenciesLoaded = false;
				reject(oFF.XError.createWithMessage(extResult.getFirstError()));
			}
		}), null, pluginModules);
	});
	return loadManifestModulesPromise;
};
oFF.HuPluginFactory.prototype._prepareMetadataInstance = function()
{
	this.m_metadataInstance = this._createPluginInstance();
};
oFF.HuPluginFactory.prototype._setupWithName = function(name)
{
	this.m_name = name;
	this.m_areModuleDependenciesLoaded = false;
	this.m_areSubSystemDependenciesStarted = false;
};
oFF.HuPluginFactory.prototype._startSubSystemDependencies = function(kernel)
{
	if (this.getManifest() === null || this.m_areSubSystemDependenciesStarted)
	{
		this.m_areSubSystemDependenciesStarted = true;
		return oFF.XPromise.resolve(oFF.XBooleanValue.create(false));
	}
	let subSystemNamesToStart = this.getManifest().getSubSystems();
	if (!oFF.XCollectionUtils.hasElements(subSystemNamesToStart))
	{
		return oFF.XPromise.resolve(oFF.XBooleanValue.create(false));
	}
	let subSysToStartList = oFF.XList.create();
	oFF.XCollectionUtils.forEach(subSystemNamesToStart, (subSysName) => {
		let tmpSubSysType = oFF.SubSystemType.lookup(subSysName);
		if (oFF.isNull(tmpSubSysType))
		{
			oFF.XLogger.printError(oFF.XStringUtils.concatenate2("[Horizon Plugin Factory] Plugin has a dependency to an unknown sub system: ", subSysName));
		}
		else
		{
			subSysToStartList.add(tmpSubSysType);
		}
	});
	let subSystemStartPromiseList = oFF.XPromiseList.create();
	oFF.XCollectionUtils.forEach(subSysToStartList, (tmpSubSys) => {
		let baseKernel = kernel;
		subSystemStartPromiseList.add(baseKernel.startSubSystemIfNecessary(tmpSubSys));
	});
	let subSystemsStartAllPromise = oFF.XPromise.all(subSystemStartPromiseList);
	return subSystemsStartAllPromise.onThenExt((result) => {
		this.m_areSubSystemDependenciesStarted = true;
		return oFF.XBooleanValue.create(true);
	});
};
oFF.HuPluginFactory.prototype.areDependenciesLoaded = function()
{
	return this.m_areModuleDependenciesLoaded && this.m_areSubSystemDependenciesStarted;
};
oFF.HuPluginFactory.prototype.canBeInitialized = function()
{
	return this.isPluginLoaded() && this.getPluginType() !== null;
};
oFF.HuPluginFactory.prototype.canLoadLibraryByUrl = function()
{
	return this.getManifest() !== null && oFF.XStringUtils.isNotNullAndNotEmpty(this.getManifest().getUrl()) && oFF.XLanguage.getLanguage() === oFF.XLanguage.JAVASCRIPT || oFF.XLanguage.getLanguage() === oFF.XLanguage.TYPESCRIPT;
};
oFF.HuPluginFactory.prototype.getAuthor = function()
{
	if (this.getManifest() !== null)
	{
		return this.getManifest().getAuthor();
	}
	return null;
};
oFF.HuPluginFactory.prototype.getConfigurationMetadata = function()
{
	if (this.getManifest() !== null)
	{
		return this.getManifest().getConfigurationMetadata();
	}
	return null;
};
oFF.HuPluginFactory.prototype.getDependencies = function()
{
	if (this.getManifest() !== null)
	{
		return this.getManifest().getDependencies();
	}
	return null;
};
oFF.HuPluginFactory.prototype.getDescription = function()
{
	if (this.getManifest() !== null)
	{
		return this.getManifest().getDescription();
	}
	return null;
};
oFF.HuPluginFactory.prototype.getDisplayName = function()
{
	if (this.getManifest() !== null)
	{
		return this.getManifest().getDisplayName();
	}
	return null;
};
oFF.HuPluginFactory.prototype.getFactoryClass = function()
{
	return this.m_factoryClass;
};
oFF.HuPluginFactory.prototype.getManifest = function()
{
	return this.m_manifest;
};
oFF.HuPluginFactory.prototype.getManifestOriginPath = function()
{
	return this.m_manifestOriginPath;
};
oFF.HuPluginFactory.prototype.getMetadata = function()
{
	return this.m_metadataInstance;
};
oFF.HuPluginFactory.prototype.getModules = function()
{
	if (this.getManifest() !== null)
	{
		return this.getManifest().getModules();
	}
	return null;
};
oFF.HuPluginFactory.prototype.getName = function()
{
	if (oFF.XStringUtils.isNullOrEmpty(this.m_name))
	{
		try
		{
			this.m_name = this.getMetadata().getName();
		}
		catch (error)
		{
			if (this.getManifest() !== null && oFF.XStringUtils.isNotNullAndNotEmpty(this.getManifest().getName()))
			{
				this.m_name = this.getManifest().getName();
			}
		}
	}
	return this.m_name;
};
oFF.HuPluginFactory.prototype.getPluginCategory = function()
{
	let pluginCategory = null;
	try
	{
		pluginCategory = this.getMetadata().getPluginCategory();
	}
	catch (error)
	{
		pluginCategory = null;
	}
	if (oFF.isNull(pluginCategory) && this.getManifest() !== null && this.getManifest().getPluginCategory() !== null)
	{
		pluginCategory = this.getManifest().getPluginCategory();
	}
	if (oFF.isNull(pluginCategory))
	{
		pluginCategory = oFF.HuPluginCategory.UNCATEGORIZED;
	}
	return pluginCategory;
};
oFF.HuPluginFactory.prototype.getPluginType = function()
{
	let pluginType = null;
	try
	{
		pluginType = this.getMetadata().getPluginType();
	}
	catch (error)
	{
		pluginType = null;
	}
	if (oFF.isNull(pluginType) && this.getManifest().getPluginType() !== null)
	{
		pluginType = this.getManifest().getPluginType();
	}
	return pluginType;
};
oFF.HuPluginFactory.prototype.getSubSystems = function()
{
	if (this.getManifest() !== null)
	{
		return this.getManifest().getSubSystems();
	}
	return null;
};
oFF.HuPluginFactory.prototype.getTags = function()
{
	if (this.getManifest() !== null)
	{
		return this.getManifest().getTags();
	}
	return null;
};
oFF.HuPluginFactory.prototype.getUrl = function()
{
	if (this.getManifest() !== null)
	{
		return this.getManifest().getUrl();
	}
	return null;
};
oFF.HuPluginFactory.prototype.getValidationErrors = function()
{
	if (this.getManifest() !== null)
	{
		return this.getManifest().getValidationErrors();
	}
	return oFF.XList.create();
};
oFF.HuPluginFactory.prototype.getVersion = function()
{
	if (this.getManifest() !== null)
	{
		return this.getManifest().getVersion();
	}
	return null;
};
oFF.HuPluginFactory.prototype.hasConfigurationMetadata = function()
{
	if (this.getManifest() !== null)
	{
		return this.getManifest().hasConfigurationMetadata();
	}
	return false;
};
oFF.HuPluginFactory.prototype.isDebugPlugin = function()
{
	return this.getPluginCategory() !== null && this.getPluginCategory().isDebug();
};
oFF.HuPluginFactory.prototype.isInconsistent = function()
{
	if (this.getManifest() !== null && this.getMetadata() !== null)
	{
		let manifestType = this.getManifest().getPluginType();
		let metadataType = this.getMetadata().getPluginType();
		if (oFF.notNull(manifestType) && oFF.notNull(metadataType) && manifestType !== metadataType)
		{
			return true;
		}
	}
	return false;
};
oFF.HuPluginFactory.prototype.isPluginFullyValid = function()
{
	return this.canBeInitialized() && this.getManifest() !== null;
};
oFF.HuPluginFactory.prototype.isPluginLoaded = function()
{
	return this.getFactoryClass() !== null;
};
oFF.HuPluginFactory.prototype.isValid = function()
{
	if (this.getManifest() !== null)
	{
		return this.getManifest().isValid();
	}
	return true;
};
oFF.HuPluginFactory.prototype.loadDependencies = function(kernel)
{
	if (oFF.isNull(kernel))
	{
		return oFF.XPromise.reject(oFF.XError.create("Missing kernel! Cannot load module dependencies and start sub systems!"));
	}
	if (this.getManifest() === null || this.areDependenciesLoaded())
	{
		this.m_areModuleDependenciesLoaded = true;
		this.m_areSubSystemDependenciesStarted = true;
		return oFF.XPromise.resolve(oFF.XBooleanValue.create(false));
	}
	return this._loadModuleDependencies(kernel).onThenPromise((result) => {
		return this._startSubSystemDependencies(kernel);
	});
};
oFF.HuPluginFactory.prototype.newPluginInstance = function()
{
	return this._createPluginInstance();
};
oFF.HuPluginFactory.prototype.releaseObject = function()
{
	this.m_factoryClass = null;
	this.m_metadataInstance = null;
	this.m_manifest = null;
	this.m_manifestOriginPath = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.HuPluginFactory.prototype.setFactoryClass = function(factoryClass)
{
	if (oFF.isNull(this.m_factoryClass))
	{
		this.m_factoryClass = factoryClass;
		this._prepareMetadataInstance();
	}
};
oFF.HuPluginFactory.prototype.setManifest = function(manifest)
{
	this.m_manifest = manifest;
};
oFF.HuPluginFactory.prototype.setManifestOriginPath = function(originPath)
{
	this.m_manifestOriginPath = originPath;
};
oFF.HuPluginFactory.prototype.setMetadata = function(metadata)
{
	if (oFF.isNull(this.m_metadataInstance))
	{
		this.m_metadataInstance = metadata;
	}
};

oFF.HuDfHorizonToolsContext = function() {};
oFF.HuDfHorizonToolsContext.prototype = new oFF.HuDfHorizonLogContext();
oFF.HuDfHorizonToolsContext.prototype._ff_c = "HuDfHorizonToolsContext";

oFF.HuDfHorizonToolsContext.prototype.m_toolsContext = null;
oFF.HuDfHorizonToolsContext.prototype._getToolsContext = function()
{
	return this.m_toolsContext;
};
oFF.HuDfHorizonToolsContext.prototype._setupWithToolsContext = function(toolContext)
{
	this.m_toolsContext = toolContext;
	if (oFF.isNull(this.m_toolsContext))
	{
		throw oFF.XException.createRuntimeException("Missing tools context! A tools context is required for this object!");
	}
	this._setupLogger(toolContext.getLogger());
	this.logDebug("-> Init");
	this._setupToolsContext();
};
oFF.HuDfHorizonToolsContext.prototype.getLocalNotificationCenter = function()
{
	return this._getToolsContext().getLocalNotificationCenter();
};
oFF.HuDfHorizonToolsContext.prototype.getLocalStorage = function()
{
	return this._getToolsContext().getLocalStorage();
};
oFF.HuDfHorizonToolsContext.prototype.getProcess = function()
{
	return this._getToolsContext().getProcess();
};
oFF.HuDfHorizonToolsContext.prototype.getSession = function()
{
	return this._getToolsContext().getSession();
};
oFF.HuDfHorizonToolsContext.prototype.releaseObject = function()
{
	this.m_toolsContext = null;
	oFF.HuDfHorizonLogContext.prototype.releaseObject.call( this );
};

oFF.HuNotificationPosterPopup = function() {};
oFF.HuNotificationPosterPopup.prototype = new oFF.HuHorizonDfPopup();
oFF.HuNotificationPosterPopup.prototype._ff_c = "HuNotificationPosterPopup";

oFF.HuNotificationPosterPopup.create = function(controller)
{
	let dialog = new oFF.HuNotificationPosterPopup();
	dialog.setupWithController(controller);
	return dialog;
};
oFF.HuNotificationPosterPopup.prototype.m_input = null;
oFF.HuNotificationPosterPopup.prototype._cancelPopup = function()
{
	this.close();
};
oFF.HuNotificationPosterPopup.prototype._postNotification = function()
{
	this.getGenericController().getLocalNotificationCenter().postNotificationWithName(this.m_input.getValue(), null);
};
oFF.HuNotificationPosterPopup.prototype.buildPopupContent = function(genesis)
{
	let mainLayout = genesis.newControl(oFF.UiType.FLEX_LAYOUT);
	mainLayout.useMaxSpace();
	mainLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	let dlgLabel = mainLayout.addNewItemOfType(oFF.UiType.LABEL);
	dlgLabel.setText("Specify the notificaion id to post");
	this.m_input = mainLayout.addNewItemOfType(oFF.UiType.INPUT);
	this.m_input.registerOnEnter(oFF.UiLambdaEnterListener.create((controlEvent) => {
		this._postNotification();
	}));
	this.setInitialFocus(this.m_input);
	genesis.setRoot(mainLayout);
};
oFF.HuNotificationPosterPopup.prototype.configurePopup = function(dialog)
{
	dialog.setTitle("Horizon Notification Poster");
	dialog.setWidth(oFF.UiCssLength.create("600px"));
	this.addButton(oFF.UiButtonType.DEFAULT, "Close", "decline", (controlEvent) => {
		this._cancelPopup();
	});
	this.addButton(oFF.UiButtonType.PRIMARY, "Post", "paper-plane", (controlEvent) => {
		this._postNotification();
	});
};
oFF.HuNotificationPosterPopup.prototype.onPopupClosed = function(controlEvent) {};
oFF.HuNotificationPosterPopup.prototype.onPopupOpened = function(controlEvent) {};
oFF.HuNotificationPosterPopup.prototype.releaseObject = function()
{
	this.m_input = oFF.XObjectExt.release(this.m_input);
	oFF.HuHorizonDfPopup.prototype.releaseObject.call( this );
};

oFF.HuWorkspaceSelectionPopup = function() {};
oFF.HuWorkspaceSelectionPopup.prototype = new oFF.HuHorizonDfPopup();
oFF.HuWorkspaceSelectionPopup.prototype._ff_c = "HuWorkspaceSelectionPopup";

oFF.HuWorkspaceSelectionPopup.create = function(controller)
{
	let dialog = new oFF.HuWorkspaceSelectionPopup();
	dialog.setupWithController(controller);
	return dialog;
};
oFF.HuWorkspaceSelectionPopup.prototype.m_cancelProcedure = null;
oFF.HuWorkspaceSelectionPopup.prototype.m_input = null;
oFF.HuWorkspaceSelectionPopup.prototype.m_inputConsumer = null;
oFF.HuWorkspaceSelectionPopup.prototype._cancelPopup = function()
{
	if (oFF.notNull(this.m_cancelProcedure))
	{
		this.m_cancelProcedure();
	}
	this.close();
};
oFF.HuWorkspaceSelectionPopup.prototype._confirmPopup = function()
{
	if (oFF.notNull(this.m_inputConsumer) && oFF.notNull(this.m_input))
	{
		this.m_inputConsumer(this.m_input.getValue());
	}
	this.close();
};
oFF.HuWorkspaceSelectionPopup.prototype._presentDirectorySelection = function()
{
	let config = oFF.SuResourceExplorerConfigWrapper.create();
	config.setTitle("Select a directory as a workspace");
	config.setInitialPath(oFF.HuHorizonConstants.DEFAULT_HOME_DIRECTORY);
	oFF.SuResourceExplorerPromise.selectDirectory(this.getGenericController().getProcess(), config).onThen((selectedDir) => {
		if (oFF.notNull(selectedDir))
		{
			this.m_input.setValue(selectedDir.getUri().getPath());
		}
	}).onCatch((errMsg) => {
		this.getGenesis().showErrorToast(errMsg.getText());
	});
};
oFF.HuWorkspaceSelectionPopup.prototype.buildPopupContent = function(genesis)
{
	let mainLayout = genesis.newControl(oFF.UiType.FLEX_LAYOUT);
	mainLayout.useMaxSpace();
	mainLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	let dlgTitle = mainLayout.addNewItemOfType(oFF.UiType.TITLE);
	dlgTitle.setText("Select a directory as a workspace");
	dlgTitle.setTitleStyle(oFF.UiTitleLevel.H_6);
	dlgTitle.setTitleLevel(oFF.UiTitleLevel.H_6);
	let dlgDescLabel = mainLayout.addNewItemOfType(oFF.UiType.LABEL);
	dlgDescLabel.setText("Horizon uses the workspace directory to store settings and state artifacts.");
	dlgDescLabel.setMargin(oFF.UiCssBoxEdges.create("0 0 0.5rem 0"));
	this.m_input = mainLayout.addNewItemOfType(oFF.UiType.INPUT);
	this.m_input.setShowValueHelp(true);
	this.m_input.registerOnEnter(oFF.UiLambdaEnterListener.create((controlEvent) => {
		this._confirmPopup();
	}));
	this.m_input.registerOnValueHelpRequest(oFF.UiLambdaValueHelpRequestListener.create((controlEvent2) => {
		this._presentDirectorySelection();
	}));
	this.setInitialFocus(this.m_input);
	genesis.setRoot(mainLayout);
};
oFF.HuWorkspaceSelectionPopup.prototype.configurePopup = function(dialog)
{
	dialog.setTitle("Horizon workspace");
	dialog.setWidth(oFF.UiCssLength.create("600px"));
	this.addButton(oFF.UiButtonType.DEFAULT, "Cancel", "sys-cancel-2", (controlEvent) => {
		this._cancelPopup();
	});
	this.addButton(oFF.UiButtonType.PRIMARY, "Launch", "begin", (controlEvent) => {
		this._confirmPopup();
	});
};
oFF.HuWorkspaceSelectionPopup.prototype.onPopupClosed = function(controlEvent) {};
oFF.HuWorkspaceSelectionPopup.prototype.onPopupOpened = function(controlEvent) {};
oFF.HuWorkspaceSelectionPopup.prototype.releaseObject = function()
{
	this.m_inputConsumer = null;
	this.m_cancelProcedure = null;
	this.m_input = oFF.XObjectExt.release(this.m_input);
	oFF.HuHorizonDfPopup.prototype.releaseObject.call( this );
};
oFF.HuWorkspaceSelectionPopup.prototype.setCancelProcedure = function(procedure)
{
	this.m_cancelProcedure = procedure;
};
oFF.HuWorkspaceSelectionPopup.prototype.setInputConsumer = function(consumer)
{
	this.m_inputConsumer = consumer;
};
oFF.HuWorkspaceSelectionPopup.prototype.setInputValue = function(value)
{
	if (oFF.notNull(this.m_input))
	{
		this.m_input.setValue(value);
	}
};

oFF.HuDfBootScreenView = function() {};
oFF.HuDfBootScreenView.prototype = new oFF.DfUiView();
oFF.HuDfBootScreenView.prototype._ff_c = "HuDfBootScreenView";

oFF.HuDfBootScreenView.prototype.getViewControl = function(genesis)
{
	return genesis.newControl(oFF.UiType.FLEX_LAYOUT);
};
oFF.HuDfBootScreenView.prototype.setupView = function() {};

oFF.HuEmptyWorkspaceView = function() {};
oFF.HuEmptyWorkspaceView.prototype = new oFF.DfUiView();
oFF.HuEmptyWorkspaceView.prototype._ff_c = "HuEmptyWorkspaceView";

oFF.HuEmptyWorkspaceView.create = function(genesis)
{
	let newView = new oFF.HuEmptyWorkspaceView();
	newView.initView(genesis);
	return newView;
};
oFF.HuEmptyWorkspaceView.prototype.m_messageLbl = null;
oFF.HuEmptyWorkspaceView.prototype.m_reloadConfigProcedure = null;
oFF.HuEmptyWorkspaceView.prototype._notifyReloadConfigButtonPressed = function()
{
	if (oFF.notNull(this.m_reloadConfigProcedure))
	{
		this.m_reloadConfigProcedure();
	}
};
oFF.HuEmptyWorkspaceView.prototype.destroyView = function()
{
	this.m_messageLbl = oFF.XObjectExt.release(this.m_messageLbl);
	this.m_reloadConfigProcedure = null;
};
oFF.HuEmptyWorkspaceView.prototype.getViewControl = function(genesis)
{
	return genesis.newControl(oFF.UiType.FLEX_LAYOUT);
};
oFF.HuEmptyWorkspaceView.prototype.layoutView = function(viewControl)
{
	viewControl.setDirection(oFF.UiFlexDirection.COLUMN);
	viewControl.useMaxSpace();
	viewControl.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	viewControl.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
	this.m_messageLbl = viewControl.addNewItemOfType(oFF.UiType.LABEL);
	this.m_messageLbl.setWrapping(true);
	this.m_messageLbl.setMaxWidth(oFF.UiCssLength.create("75%"));
	let actionButtonRow = viewControl.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	actionButtonRow.setDirection(oFF.UiFlexDirection.ROW);
	actionButtonRow.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
	actionButtonRow.setMargin(oFF.UiCssBoxEdges.create("1rem 0 0 0"));
	let reloadConfigBtn = actionButtonRow.addNewItemOfType(oFF.UiType.BUTTON);
	reloadConfigBtn.setText("Reload Configuration");
	reloadConfigBtn.setIcon("refresh");
	reloadConfigBtn.registerOnPress(oFF.UiLambdaPressListener.create((controlEvent) => {
		this._notifyReloadConfigButtonPressed();
	}));
};
oFF.HuEmptyWorkspaceView.prototype.setMessageText = function(text)
{
	if (oFF.notNull(this.m_messageLbl))
	{
		this.m_messageLbl.setText(text);
	}
};
oFF.HuEmptyWorkspaceView.prototype.setReloadConfigButtonPressedProcdeure = function(procedure)
{
	this.m_reloadConfigProcedure = procedure;
};
oFF.HuEmptyWorkspaceView.prototype.setupView = function() {};

oFF.HuDfHorizonBootAction = function() {};
oFF.HuDfHorizonBootAction.prototype = new oFF.HuDfHorizonLogContext();
oFF.HuDfHorizonBootAction.prototype._ff_c = "HuDfHorizonBootAction";

oFF.HuDfHorizonBootAction.prototype.m_bootController = null;
oFF.HuDfHorizonBootAction.prototype._getBootController = function()
{
	return this.m_bootController;
};
oFF.HuDfHorizonBootAction.prototype._setupWithBootController = function(bootController)
{
	this.m_bootController = bootController;
	if (oFF.isNull(this.m_bootController))
	{
		throw oFF.XException.createRuntimeException("Missing boot controller! Cannot create a boot action without a boot controller!");
	}
	this._setupLogger(bootController);
	this._setupAction();
};
oFF.HuDfHorizonBootAction.prototype.getLocalNotificationCenter = function()
{
	return this._getBootController().getLocalNotificationCenter();
};
oFF.HuDfHorizonBootAction.prototype.getLocalStorage = function()
{
	return this._getBootController().getLocalStorage();
};
oFF.HuDfHorizonBootAction.prototype.getLogContextName = function()
{
	return oFF.XStringUtils.isNotNullAndNotEmpty(this.getActionName()) ? oFF.XStringUtils.concatenate2(this.getActionName(), " Boot Action") : "Unnamed Boot Action";
};
oFF.HuDfHorizonBootAction.prototype.getProcess = function()
{
	return this._getBootController().getProcess();
};
oFF.HuDfHorizonBootAction.prototype.getSession = function()
{
	return this._getBootController().getSession();
};
oFF.HuDfHorizonBootAction.prototype.releaseObject = function()
{
	this.m_bootController = null;
	oFF.HuDfHorizonLogContext.prototype.releaseObject.call( this );
};

oFF.HuBootControllerStatus = function() {};
oFF.HuBootControllerStatus.prototype = new oFF.XConstant();
oFF.HuBootControllerStatus.prototype._ff_c = "HuBootControllerStatus";

oFF.HuBootControllerStatus.BOOT_ERROR = null;
oFF.HuBootControllerStatus.BOOT_FINISHED = null;
oFF.HuBootControllerStatus.BOOT_IN_PROGRESS = null;
oFF.HuBootControllerStatus.CONFIGURATION_RELOAD_FINISHED = null;
oFF.HuBootControllerStatus.CONFIGURATION_RELOAD_IN_PROGRESS = null;
oFF.HuBootControllerStatus.INITIAL = null;
oFF.HuBootControllerStatus.WORKSPACE_SWITCH_FINISHED = null;
oFF.HuBootControllerStatus.WORKSPACE_SWITCH_IN_PROGRESS = null;
oFF.HuBootControllerStatus._createWithName = function(name)
{
	return oFF.XConstant.setupName(new oFF.HuBootControllerStatus(), name);
};
oFF.HuBootControllerStatus.staticSetup = function()
{
	oFF.HuBootControllerStatus.INITIAL = oFF.HuBootControllerStatus._createWithName("Initial");
	oFF.HuBootControllerStatus.BOOT_IN_PROGRESS = oFF.HuBootControllerStatus._createWithName("BootInProgress");
	oFF.HuBootControllerStatus.BOOT_ERROR = oFF.HuBootControllerStatus._createWithName("BootError");
	oFF.HuBootControllerStatus.BOOT_FINISHED = oFF.HuBootControllerStatus._createWithName("BootFinished");
	oFF.HuBootControllerStatus.WORKSPACE_SWITCH_IN_PROGRESS = oFF.HuBootControllerStatus._createWithName("WorkspaceSwitchInProgress");
	oFF.HuBootControllerStatus.WORKSPACE_SWITCH_FINISHED = oFF.HuBootControllerStatus._createWithName("WorkspaceSwitchFinished");
	oFF.HuBootControllerStatus.CONFIGURATION_RELOAD_IN_PROGRESS = oFF.HuBootControllerStatus._createWithName("ConfigurationReloadInProgress");
	oFF.HuBootControllerStatus.CONFIGURATION_RELOAD_FINISHED = oFF.HuBootControllerStatus._createWithName("ConfigurationReloadFinished");
};

oFF.HuFrameworkMode = function() {};
oFF.HuFrameworkMode.prototype = new oFF.XConstant();
oFF.HuFrameworkMode.prototype._ff_c = "HuFrameworkMode";

oFF.HuFrameworkMode.DEBUG = null;
oFF.HuFrameworkMode.DEVELOPER = null;
oFF.HuFrameworkMode.PRODUCTION = null;
oFF.HuFrameworkMode.TEST = null;
oFF.HuFrameworkMode.s_lookup = null;
oFF.HuFrameworkMode._createWithName = function(name)
{
	let newConstant = oFF.XConstant.setupName(new oFF.HuFrameworkMode(), name);
	oFF.HuFrameworkMode.s_lookup.put(oFF.XString.toLowerCase(name), newConstant);
	return newConstant;
};
oFF.HuFrameworkMode.lookup = function(name)
{
	return oFF.HuFrameworkMode.s_lookup.getByKey(oFF.XString.toLowerCase(name));
};
oFF.HuFrameworkMode.staticSetup = function()
{
	oFF.HuFrameworkMode.s_lookup = oFF.XHashMapByString.create();
	oFF.HuFrameworkMode.PRODUCTION = oFF.HuFrameworkMode._createWithName("Production");
	oFF.HuFrameworkMode.DEVELOPER = oFF.HuFrameworkMode._createWithName("Developer");
	oFF.HuFrameworkMode.DEBUG = oFF.HuFrameworkMode._createWithName("Debug");
	oFF.HuFrameworkMode.TEST = oFF.HuFrameworkMode._createWithName("Test");
};
oFF.HuFrameworkMode.prototype.isProduction = function()
{
	return this === oFF.HuFrameworkMode.PRODUCTION;
};

oFF.HuMainControllerStatus = function() {};
oFF.HuMainControllerStatus.prototype = new oFF.XConstant();
oFF.HuMainControllerStatus.prototype._ff_c = "HuMainControllerStatus";

oFF.HuMainControllerStatus.BOOTING = null;
oFF.HuMainControllerStatus.INITIAL = null;
oFF.HuMainControllerStatus.READY = null;
oFF.HuMainControllerStatus.RELOADING_CONFIGURATION = null;
oFF.HuMainControllerStatus.RUNNING = null;
oFF.HuMainControllerStatus._createWithName = function(name)
{
	return oFF.XConstant.setupName(new oFF.HuMainControllerStatus(), name);
};
oFF.HuMainControllerStatus.staticSetup = function()
{
	oFF.HuMainControllerStatus.INITIAL = oFF.HuMainControllerStatus._createWithName("Initial");
	oFF.HuMainControllerStatus.BOOTING = oFF.HuMainControllerStatus._createWithName("Booting");
	oFF.HuMainControllerStatus.RELOADING_CONFIGURATION = oFF.HuMainControllerStatus._createWithName("ReloadingConfiguration");
	oFF.HuMainControllerStatus.READY = oFF.HuMainControllerStatus._createWithName("Ready");
	oFF.HuMainControllerStatus.RUNNING = oFF.HuMainControllerStatus._createWithName("Running");
};
oFF.HuMainControllerStatus.prototype.isSetupPhase = function()
{
	return this !== oFF.HuMainControllerStatus.READY && this !== oFF.HuMainControllerStatus.RUNNING;
};

oFF.HuDfHorizonLayout = function() {};
oFF.HuDfHorizonLayout.prototype = new oFF.HuDfHorizonToolsContext();
oFF.HuDfHorizonLayout.prototype._ff_c = "HuDfHorizonLayout";

oFF.HuDfHorizonLayout.prototype.m_layoutConfigJson = null;
oFF.HuDfHorizonLayout.prototype.m_layoutManager = null;
oFF.HuDfHorizonLayout.prototype._setupToolsContext = function()
{
	this._setupLayout(this.getGenesis());
	this.getView().addCssClass(oFF.XStringUtils.concatenate3("ffHorizon", this.getLayoutType().getName(), "Layout"));
};
oFF.HuDfHorizonLayout.prototype._setupWithLayoutManager = function(layoutManager)
{
	this.m_layoutManager = layoutManager;
	this.m_layoutConfigJson = oFF.PrStructure.createDeepCopy(layoutManager.getLayoutConfigJson());
	if (oFF.isNull(this.m_layoutConfigJson))
	{
		this.m_layoutConfigJson = oFF.PrFactory.createStructure();
	}
	this._setupWithToolsContext(layoutManager);
};
oFF.HuDfHorizonLayout.prototype.getGenesis = function()
{
	return this.m_layoutManager.getGenesis();
};
oFF.HuDfHorizonLayout.prototype.getLayoutConfigJson = function()
{
	return this.m_layoutConfigJson;
};
oFF.HuDfHorizonLayout.prototype.getLogContextName = function()
{
	return oFF.XStringUtils.concatenate2(this.getLayoutType().getName(), " Layout");
};
oFF.HuDfHorizonLayout.prototype.initLayout = function(layoutManager)
{
	if (oFF.notNull(this.m_layoutManager))
	{
		throw oFF.XException.createRuntimeException("Layout already initialized!");
	}
	if (oFF.isNull(layoutManager))
	{
		throw oFF.XException.createRuntimeException("Missing layout manager! A layout manager is required for layout initialization!");
	}
	this._setupWithLayoutManager(layoutManager);
};
oFF.HuDfHorizonLayout.prototype.notifyPluginBecameHidden = function(viewPluginController)
{
	if (oFF.notNull(viewPluginController))
	{
		viewPluginController.onPluginContainerDidBecameHidden();
	}
	else
	{
		this.logDebug("Could not find plugin controller! Cannot notify didBecameHidden");
	}
};
oFF.HuDfHorizonLayout.prototype.notifyPluginBecameVisible = function(viewPluginController)
{
	if (oFF.notNull(viewPluginController))
	{
		viewPluginController.onPluginContainerDidBecameVisible();
	}
	else
	{
		this.logDebug("Could not find plugin controller! Cannot notify didBecameVisible");
	}
};
oFF.HuDfHorizonLayout.prototype.releaseObject = function()
{
	this.m_layoutManager = null;
	this.m_layoutConfigJson = null;
	oFF.HuDfHorizonToolsContext.prototype.releaseObject.call( this );
};

oFF.HuDfHorizonManager = function() {};
oFF.HuDfHorizonManager.prototype = new oFF.HuDfHorizonToolsContext();
oFF.HuDfHorizonManager.prototype._ff_c = "HuDfHorizonManager";

oFF.HuDfHorizonManager.prototype.m_genericController = null;
oFF.HuDfHorizonManager.prototype._getController = function()
{
	return this.m_genericController;
};
oFF.HuDfHorizonManager.prototype._setupToolsContext = function()
{
	this._setupManager();
};
oFF.HuDfHorizonManager.prototype._setupWithGenericController = function(genericController)
{
	this.m_genericController = genericController;
	if (oFF.isNull(this.m_genericController))
	{
		throw oFF.XException.createRuntimeException("Missing controller! A controller is required for this manager!");
	}
	this._setupWithToolsContext(genericController);
};
oFF.HuDfHorizonManager.prototype.getGenesis = function()
{
	return this._getController().getGenesis();
};
oFF.HuDfHorizonManager.prototype.getLogContextName = function()
{
	return this._getManagerName();
};
oFF.HuDfHorizonManager.prototype.releaseObject = function()
{
	this.m_genericController = null;
	oFF.HuDfHorizonToolsContext.prototype.releaseObject.call( this );
};

oFF.HuDfHorizonPluginController = function() {};
oFF.HuDfHorizonPluginController.prototype = new oFF.HuDfHorizonLogContext();
oFF.HuDfHorizonPluginController.prototype._ff_c = "HuDfHorizonPluginController";

oFF.HuDfHorizonPluginController.prototype.m_configuration = null;
oFF.HuDfHorizonPluginController.prototype.m_dataSpaceChangedUuidList = null;
oFF.HuDfHorizonPluginController.prototype.m_developerActionList = null;
oFF.HuDfHorizonPluginController.prototype.m_frameworkModeChangedCallback = null;
oFF.HuDfHorizonPluginController.prototype.m_globalNotificationObserverIds = null;
oFF.HuDfHorizonPluginController.prototype.m_internalNotificationObserverIds = null;
oFF.HuDfHorizonPluginController.prototype.m_isInitialized = false;
oFF.HuDfHorizonPluginController.prototype.m_isRunning = false;
oFF.HuDfHorizonPluginController.prototype.m_parentController = null;
oFF.HuDfHorizonPluginController.prototype.m_pluginDataStorage = null;
oFF.HuDfHorizonPluginController.prototype.m_pluginFactory = null;
oFF.HuDfHorizonPluginController.prototype.m_pluginInstance = null;
oFF.HuDfHorizonPluginController.prototype.m_pluginProcess = null;
oFF.HuDfHorizonPluginController.prototype.m_pluginStartupInfo = null;
oFF.HuDfHorizonPluginController.prototype.m_pluginSubApplication = null;
oFF.HuDfHorizonPluginController.prototype.m_uuid = null;
oFF.HuDfHorizonPluginController.prototype._cleanUpDataSpaceListeners = function()
{
	if (oFF.notNull(this.m_dataSpaceChangedUuidList) && this.m_dataSpaceChangedUuidList.size() > 0)
	{
		if (this._getDataSpaceBase() !== null)
		{
			oFF.XCollectionUtils.forEach(this.m_dataSpaceChangedUuidList, (listnerUuid) => {
				this._getDataSpaceBase().removeChangeConsumerByUuid(listnerUuid);
			});
		}
		this.m_dataSpaceChangedUuidList.clear();
	}
	this.m_dataSpaceChangedUuidList = oFF.XObjectExt.release(this.m_dataSpaceChangedUuidList);
};
oFF.HuDfHorizonPluginController.prototype._cleanupNotificationObservers = function()
{
	oFF.HuBaseUtils.deregisterNotificationObservers(this.m_globalNotificationObserverIds, this.getProcess().getNotificationCenter());
	this.m_globalNotificationObserverIds = oFF.XObjectExt.release(this.m_globalNotificationObserverIds);
	oFF.HuBaseUtils.deregisterNotificationObservers(this.m_internalNotificationObserverIds, this.getLocalNotificationCenter());
	this.m_internalNotificationObserverIds = oFF.XObjectExt.release(this.m_internalNotificationObserverIds);
};
oFF.HuDfHorizonPluginController.prototype._createSubProcess = function()
{
	let mainApplication = this._getParentController().getProcess().getApplication();
	let newProcess = this._getParentController().getProcess().newChildProcess(oFF.ProcessType.PLUGIN);
	newProcess.setDescription(this.getName());
	this.m_pluginProcess = newProcess;
	this.m_pluginSubApplication = mainApplication.newSubApplication(this.m_pluginProcess);
	newProcess.registerOnEvent(oFF.ProcessEventLambdaListener.create((event, eventType) => {
		if (eventType === oFF.ProcessEventType.TERMINATED)
		{
			this.kill();
		}
	}));
};
oFF.HuDfHorizonPluginController.prototype._ensureModuleDependencies = function()
{
	return this.getMainController().getPluginToolsService().ensureModuleDependencies(this._getPluginFactory().getName());
};
oFF.HuDfHorizonPluginController.prototype._getAndCreateConfigurationIfNecessary = function()
{
	if (oFF.isNull(this.m_configuration))
	{
		this.m_configuration = oFF.CoConfiguration.create(this._getPluginFactory().getConfigurationMetadata(), null);
	}
	return this.m_configuration;
};
oFF.HuDfHorizonPluginController.prototype._getCurrentMode = function()
{
	return this.getMainController().getCurrentFrameworkMode();
};
oFF.HuDfHorizonPluginController.prototype._getDataSpaceBase = function()
{
	return this.getDataSpace();
};
oFF.HuDfHorizonPluginController.prototype._getParentController = function()
{
	return this.m_parentController;
};
oFF.HuDfHorizonPluginController.prototype._getPluginFactory = function()
{
	return this.m_pluginFactory;
};
oFF.HuDfHorizonPluginController.prototype._getPluginInstance = function()
{
	return this.m_pluginInstance;
};
oFF.HuDfHorizonPluginController.prototype._getPluginMessageGroup = function()
{
	return oFF.HuMessageGroup.createForPluginNameIfNecessary(this.getName(), this.getPluginDisplayNameOrName());
};
oFF.HuDfHorizonPluginController.prototype._handlePluginSetupError = function(setupError)
{
	this.addErrorMessage("Setup error", "Error during plugin setup!", setupError.getText());
};
oFF.HuDfHorizonPluginController.prototype._handlePluginStartupException = function(error)
{
	this.addErrorMessage("Startup failed", "Error during plugin startup!", error.getText());
	oFF.XLogger.printError(oFF.XException.getStackTrace(error.getThrowable(), 0));
};
oFF.HuDfHorizonPluginController.prototype._isConfigured = function()
{
	if (this._getParentController() === null || this._getPluginFactory() === null || !this._getPluginFactory().canBeInitialized() || this.getPluginStartupInfo() === null)
	{
		return false;
	}
	return true;
};
oFF.HuDfHorizonPluginController.prototype._isInitialized = function()
{
	return this.m_isInitialized;
};
oFF.HuDfHorizonPluginController.prototype._isRootLevelPlugin = function()
{
	return this._getParentController() === this.getMainController();
};
oFF.HuDfHorizonPluginController.prototype._isRunning = function()
{
	return this.m_isRunning;
};
oFF.HuDfHorizonPluginController.prototype._notifyConfigurationChanged = function(newConfiguration)
{
	try
	{
		this._getPluginInstance().onConfigurationChanged(newConfiguration);
	}
	catch (err)
	{
		this.logDebug("Missing onConfigurationChanged method on the plugin instance!");
	}
};
oFF.HuDfHorizonPluginController.prototype._postPluginStartedNotification = function()
{
	let pluginStartedNotificationData = oFF.XNotificationData.create();
	pluginStartedNotificationData.putString(oFF.HuHorizonInternalNotifications.PLUGIN_STARTED_PLUGIN_NAME_NOTIFI_DATA, this.getName());
	pluginStartedNotificationData.putXObject(oFF.HuHorizonInternalNotifications.PLUGIN_STARTED_PLUGIN_TYPE_NOTIFI_DATA, this.getPluginType());
	this.getLocalNotificationCenter().postNotificationWithName(oFF.HuHorizonInternalNotifications.PLUGIN_STARTED, pluginStartedNotificationData);
};
oFF.HuDfHorizonPluginController.prototype._preparePluginConfiguration = function(rawConfigJson)
{
	return this.getMainController().getPluginToolsService().createConfigurationForPlugin(this._getPluginFactory(), rawConfigJson).onThen((configuration) => {
		this.m_configuration = configuration;
	});
};
oFF.HuDfHorizonPluginController.prototype._preparePluginStorage = function()
{
	this.m_pluginDataStorage = oFF.HuPluginDataStorage.create(this.getLogger());
	let pluginStorageFile = this.getMainController().getWorkspaceManager().getStorageFileForPlugin(this._getPluginFactory());
	return this.m_pluginDataStorage.initializeStorage(pluginStorageFile).then((result) => {
		return this.m_pluginDataStorage;
	}, null);
};
oFF.HuDfHorizonPluginController.prototype._reloadPluginConfigurationAndNotify = function()
{
	this._preparePluginConfiguration(null).onFinally(() => {
		this._notifyConfigurationChanged(this.getConfiguration());
	});
};
oFF.HuDfHorizonPluginController.prototype._setupNotificationObservers = function()
{
	this.m_globalNotificationObserverIds = oFF.XList.create();
	this.m_globalNotificationObserverIds.add(this.getProcess().getNotificationCenter().addObserverForName(oFF.CoConfigurationConstants.NOTIFICATION_CONFIGURATION_CHANGED, (payload) => {
		let configurationName = payload.getStringByKey(oFF.CoConfigurationConstants.NOTIFICATION_DATA_CONFIGURATION_NAME);
		if (oFF.XString.isEqual(configurationName, this.getName()))
		{
			this._reloadPluginConfigurationAndNotify();
		}
	}));
	this.m_internalNotificationObserverIds = oFF.XList.create();
	this.m_internalNotificationObserverIds.add(this.getLocalNotificationCenter().addObserverForName(oFF.HuHorizonInternalNotifications.FRAMEWORK_MODE_CHANGED, (payload) => {
		if (oFF.notNull(this.m_frameworkModeChangedCallback))
		{
			this.m_frameworkModeChangedCallback();
		}
	}));
};
oFF.HuDfHorizonPluginController.prototype._throwInvalidPluginTypeException = function()
{
	throw oFF.XException.createRuntimeException(oFF.XStringUtils.concatenate2("Invalid plugin type -> ", this.getPluginType().getName()));
};
oFF.HuDfHorizonPluginController.prototype.actionByIdExists = function(actionId)
{
	if (this.getMainController() !== null)
	{
		return this.getMainController().getCommandPluginManager().actionByIdExists(actionId);
	}
	return false;
};
oFF.HuDfHorizonPluginController.prototype.actionExists = function(pluginName, actionName)
{
	return this.actionByIdExists(oFF.HuUtils.generateActionId(pluginName, actionName));
};
oFF.HuDfHorizonPluginController.prototype.addDataSpaceChangedListener = function(listener)
{
	if (oFF.isNull(this.m_dataSpaceChangedUuidList))
	{
		this.m_dataSpaceChangedUuidList = oFF.XList.create();
	}
	let listenerUuid = this._getDataSpaceBase().addChangeConsumer(listener);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(listenerUuid))
	{
		this.m_dataSpaceChangedUuidList.add(listenerUuid);
	}
	return listenerUuid;
};
oFF.HuDfHorizonPluginController.prototype.addDeveloperActionMenuEntry = function(displayName, description, icon, isSectionStart, procedure)
{
	let newDevAction = oFF.HuDeveloperAction.create(displayName, description, icon, isSectionStart, procedure);
	this.m_developerActionList.add(newDevAction);
	return newDevAction.getId();
};
oFF.HuDfHorizonPluginController.prototype.addErrorMessage = function(title, subtitle, description)
{
	this.getMainController().getMessageManager().addErrorMessage(title, subtitle, description, this._getPluginMessageGroup());
};
oFF.HuDfHorizonPluginController.prototype.addInfoMessage = function(title, subtitle, description)
{
	this.getMainController().getMessageManager().addInfoMessage(title, subtitle, description, this._getPluginMessageGroup());
};
oFF.HuDfHorizonPluginController.prototype.addSuccessMessage = function(title, subtitle, description)
{
	this.getMainController().getMessageManager().addSuccessMessage(title, subtitle, description, this._getPluginMessageGroup());
};
oFF.HuDfHorizonPluginController.prototype.addWarningMessage = function(title, subtitle, description)
{
	this.getMainController().getMessageManager().addWarningMessage(title, subtitle, description, this._getPluginMessageGroup());
};
oFF.HuDfHorizonPluginController.prototype.configure = function(pluginFactory, parentController, pluginStartupInfo)
{
	this.m_pluginFactory = pluginFactory;
	this.m_parentController = parentController;
	this.m_pluginStartupInfo = pluginStartupInfo;
	this._setupLogger(parentController);
};
oFF.HuDfHorizonPluginController.prototype.executeAction = function(pluginName, actionName, customData)
{
	return this.executeActionById(oFF.HuUtils.generateActionId(pluginName, actionName), customData);
};
oFF.HuDfHorizonPluginController.prototype.executeActionById = function(actionId, customData)
{
	if (this.getMainController() !== null)
	{
		return this.getMainController().getCommandPluginManager().executeAction(actionId, this, customData);
	}
	return oFF.XPromise.reject(oFF.XError.create("Critical error during action execution!"));
};
oFF.HuDfHorizonPluginController.prototype.getAllActionIds = function()
{
	if (this.getMainController() !== null)
	{
		return this.getMainController().getCommandPluginManager().getAllActionIds();
	}
	return oFF.XList.create();
};
oFF.HuDfHorizonPluginController.prototype.getApplication = function()
{
	return this.m_pluginSubApplication;
};
oFF.HuDfHorizonPluginController.prototype.getConfiguration = function()
{
	return this._getAndCreateConfigurationIfNecessary();
};
oFF.HuDfHorizonPluginController.prototype.getDataSpace = function()
{
	return this._getParentController().getDataSpace();
};
oFF.HuDfHorizonPluginController.prototype.getDataStorage = function()
{
	return this.m_pluginDataStorage;
};
oFF.HuDfHorizonPluginController.prototype.getLocalNotificationCenter = function()
{
	return this._getParentController().getLocalNotificationCenter();
};
oFF.HuDfHorizonPluginController.prototype.getLocalStorage = function()
{
	return this._getParentController().getLocalStorage();
};
oFF.HuDfHorizonPluginController.prototype.getLogContextName = function()
{
	return "Plugin";
};
oFF.HuDfHorizonPluginController.prototype.getMainController = function()
{
	if (this._getParentController() !== null)
	{
		return this._getParentController().getMainController();
	}
	return null;
};
oFF.HuDfHorizonPluginController.prototype.getMenuDeveloperActionList = function()
{
	return this.m_developerActionList;
};
oFF.HuDfHorizonPluginController.prototype.getName = function()
{
	return this._getPluginFactory().getName();
};
oFF.HuDfHorizonPluginController.prototype.getPluginCategory = function()
{
	return this._getPluginFactory().getPluginCategory();
};
oFF.HuDfHorizonPluginController.prototype.getPluginDisplayNameOrName = function()
{
	let displayName = this._getPluginFactory().getDisplayName();
	if (oFF.XStringUtils.isNullOrEmpty(displayName))
	{
		displayName = this.getName();
	}
	return displayName;
};
oFF.HuDfHorizonPluginController.prototype.getPluginStartupInfo = function()
{
	return this.m_pluginStartupInfo;
};
oFF.HuDfHorizonPluginController.prototype.getProcess = function()
{
	return this.m_pluginProcess;
};
oFF.HuDfHorizonPluginController.prototype.getSession = function()
{
	return this.getProcess();
};
oFF.HuDfHorizonPluginController.prototype.getUuid = function()
{
	return this.m_uuid;
};
oFF.HuDfHorizonPluginController.prototype.hideNetworkActivityIndicator = function()
{
	this.getLocalNotificationCenter().postNotificationWithName(oFF.HuHorizonInternalNotifications.STATUS_BAR_MANAGER_HIDE_NETWORK_ACTIVITY_INDICATOR, null);
};
oFF.HuDfHorizonPluginController.prototype.initializePlugin = function()
{
	let initializationPromise = oFF.XPromise.create((resolve, reject) => {
		if (this._isInitialized())
		{
			reject(oFF.XError.create("Plugin controller is already initialized!").setErrorType(oFF.HuErrorType.PLUGIN_INITIALIZATION_ERROR));
		}
		if (!this._isConfigured())
		{
			reject(oFF.XError.create("Failed to initialize plugin controller! Missing parent controller, plugin factory or plugin startup info!").setErrorType(oFF.HuErrorType.PLUGIN_INITIALIZATION_ERROR));
		}
		else
		{
			this.m_pluginInstance = this._getPluginFactory().newPluginInstance();
			this.m_uuid = oFF.XGuid.getGuid();
			this._createSubProcess();
			this._setupNotificationObservers();
			this.m_developerActionList = oFF.XList.create();
			this._ensureModuleDependencies().onFinally(() => {
				this._preparePluginStorage().onFinally(() => {
					this._preparePluginConfiguration(this.getPluginStartupInfo().getConfigStructure()).onFinally(() => {
						this._initSpecificPlugin(this.getConfiguration());
						this.m_isInitialized = true;
						resolve(oFF.XBooleanValue.create(true));
					});
				});
			});
		}
	});
	return initializationPromise;
};
oFF.HuDfHorizonPluginController.prototype.isDeveloperModeActive = function()
{
	return this._getCurrentMode() === oFF.HuFrameworkMode.DEBUG || this._getCurrentMode() === oFF.HuFrameworkMode.DEVELOPER || this._getCurrentMode() === oFF.HuFrameworkMode.TEST;
};
oFF.HuDfHorizonPluginController.prototype.isProductionModeActive = function()
{
	return this._getCurrentMode() === oFF.HuFrameworkMode.PRODUCTION;
};
oFF.HuDfHorizonPluginController.prototype.isTestModeActive = function()
{
	return this._getCurrentMode() === oFF.HuFrameworkMode.TEST;
};
oFF.HuDfHorizonPluginController.prototype.kill = function()
{
	this.releaseObject();
};
oFF.HuDfHorizonPluginController.prototype.loadWorkspaceFileContent = function(filePath)
{
	if (this.getMainController().getWorkspaceManager().isVirtualWorkspace())
	{
		return oFF.XPromise.reject(oFF.XError.create("No workspace found!"));
	}
	let workspaceChildFile = this.getMainController().getWorkspaceManager().getWorkspaceDirectory().newChild(filePath);
	return oFF.XFilePromise.loadContent(workspaceChildFile);
};
oFF.HuDfHorizonPluginController.prototype.presentSettingsDialogIfPossible = function()
{
	if (this._getPluginFactory().hasConfigurationMetadata())
	{
		let settingsRunner = oFF.SuSettingsDialog.createRunnerForConfiguration(this.getProcess(), this._getPluginFactory().getConfigurationMetadata().getName(), () => {
			this._reloadPluginConfigurationAndNotify();
		});
		settingsRunner.runProgram();
	}
};
oFF.HuDfHorizonPluginController.prototype.releaseObject = function()
{
	this._cleanupNotificationObservers();
	this.m_frameworkModeChangedCallback = null;
	this._getPluginInstance().destroyPlugin();
	this._cleanUpDataSpaceListeners();
	this._destroySpecificPlugin();
	this.m_developerActionList = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_developerActionList);
	this.m_pluginFactory = null;
	this.m_parentController = null;
	this.m_pluginStartupInfo = null;
	this.m_configuration = oFF.XObjectExt.release(this.m_configuration);
	this.m_pluginDataStorage = oFF.XObjectExt.release(this.m_pluginDataStorage);
	this.m_pluginSubApplication = oFF.XObjectExt.release(this.m_pluginSubApplication);
	this.m_pluginProcess = oFF.XObjectExt.release(this.m_pluginProcess);
	this.m_pluginInstance = null;
	this.m_isRunning = false;
	oFF.HuDfHorizonLogContext.prototype.releaseObject.call( this );
};
oFF.HuDfHorizonPluginController.prototype.removeDataSpaceChangedListener = function(listenerUuid)
{
	this._getDataSpaceBase().removeChangeConsumerByUuid(listenerUuid);
	if (oFF.notNull(this.m_dataSpaceChangedUuidList))
	{
		this.m_dataSpaceChangedUuidList.removeElement(listenerUuid);
	}
};
oFF.HuDfHorizonPluginController.prototype.removeDeveloperActionMenuEntry = function(actionId)
{
	oFF.XCollectionUtils.removeIf(this.m_developerActionList, (tmpAction) => {
		return oFF.XString.isEqual(tmpAction.getId(), actionId);
	});
};
oFF.HuDfHorizonPluginController.prototype.run = function()
{
	let runPromise = oFF.XPromise.create((resolve, reject) => {
		if (!this._isInitialized())
		{
			reject(oFF.XError.create("Plugin controller not initialized! Cannot start!").setErrorType(oFF.HuErrorType.PLUGIN_STARTUP_ERROR));
		}
		if (!this._isRunning())
		{
			this.m_isRunning = true;
			try
			{
				this._getPluginInstance().processConfiguration(this.getConfiguration());
				let setupPromise = this._setupSpecificPlugin();
				if (oFF.isNull(setupPromise))
				{
					this._runSpecificPlugin();
					this._postPluginStartedNotification();
					resolve(oFF.XBooleanValue.create(true));
				}
				else
				{
					this._setPluginUiBusy(true);
					setupPromise.onCatch((error) => {
						this._handlePluginSetupError(error);
					}).onFinally(() => {
						this._setPluginUiBusy(false);
						this._runSpecificPlugin();
						this._postPluginStartedNotification();
						resolve(oFF.XBooleanValue.create(true));
					});
				}
			}
			catch (err)
			{
				this.m_isRunning = false;
				this._handlePluginStartupException(oFF.XError.createWithThrowable(err));
				reject(oFF.XError.createWithThrowable(err).setErrorType(oFF.HuErrorType.PLUGIN_STARTUP_ERROR));
			}
		}
		else
		{
			reject(oFF.XError.create("Ilegal state! The plugin controller is already running.").setErrorType(oFF.HuErrorType.PLUGIN_STARTUP_ERROR));
		}
	});
	return runPromise;
};
oFF.HuDfHorizonPluginController.prototype.setFrameworkModeChangedCallback = function(callback)
{
	this.m_frameworkModeChangedCallback = callback;
};
oFF.HuDfHorizonPluginController.prototype.setStatusMessage = function(message)
{
	this.getMainController().getMessageManager().setStatusMessage(message);
};
oFF.HuDfHorizonPluginController.prototype.showNetworkActivityIndicator = function()
{
	this.getLocalNotificationCenter().postNotificationWithName(oFF.HuHorizonInternalNotifications.STATUS_BAR_MANAGER_SHOW_NETWORK_ACTIVITY_INDICATOR, null);
};
oFF.HuDfHorizonPluginController.prototype.toString = function()
{
	let strBuf = oFF.XStringBuffer.create();
	strBuf.append("[");
	strBuf.append(this.getPluginType().getName());
	strBuf.append("] ");
	strBuf.append(this.getName());
	return strBuf.toString();
};

oFF.HuPluginLoader = function() {};
oFF.HuPluginLoader.prototype = new oFF.HuDfHorizonToolsContext();
oFF.HuPluginLoader.prototype._ff_c = "HuPluginLoader";

oFF.HuPluginLoader.create = function(toolsContext)
{
	let newInstance = new oFF.HuPluginLoader();
	newInstance._setupWithToolsContext(toolsContext);
	return newInstance;
};
oFF.HuPluginLoader.prototype.m_modulesInProgressList = null;
oFF.HuPluginLoader.prototype._getKernel = function()
{
	return this.getProcess().getKernel();
};
oFF.HuPluginLoader.prototype._loadPluginLibrary = function(pluginFactory)
{
	let loadLibraryPromise = oFF.XPromise.create((resolve, reject) => {
		let pluginLibrary = oFF.ModuleManager.getModuleDef(pluginFactory.getName());
		if (oFF.isNull(pluginLibrary))
		{
			pluginLibrary = oFF.ModuleManager.registerLibrary(pluginFactory.getName(), pluginFactory.getName(), pluginFactory.getManifest().getUrl());
		}
		if (oFF.notNull(pluginLibrary))
		{
			this.getLogger().logDebug(oFF.XStringUtils.concatenate2("Loading plugin library: ", pluginFactory.getName()));
			let moduleNames = oFF.XList.create();
			moduleNames.add(pluginLibrary.getName());
			this._getKernel().processMultiModulesLoad(oFF.SyncType.NON_BLOCKING, oFF.UiLambdaModuleLoadedMultiListener.create((extResult2, modules2) => {
				this.getLogger().logDebug(oFF.XStringUtils.concatenate4("Plugin library ", pluginFactory.getManifest().getName(), " successfully loaded from: ", pluginFactory.getManifest().getUrl()));
				resolve(oFF.XBooleanValue.create(true));
			}), null, moduleNames);
		}
		else
		{
			this.logDebug(oFF.XStringUtils.concatenate2("Library not found: ", pluginFactory.getName()));
			resolve(oFF.XBooleanValue.create(true));
		}
	});
	return loadLibraryPromise;
};
oFF.HuPluginLoader.prototype._setupToolsContext = function()
{
	this.m_modulesInProgressList = oFF.XList.create();
};
oFF.HuPluginLoader.prototype.getLogContextName = function()
{
	return "Plugin Loader";
};
oFF.HuPluginLoader.prototype.loadPlugin = function(pluginFactory)
{
	if (pluginFactory.isPluginLoaded())
	{
		this.logDebug(oFF.XStringUtils.concatenate2("Plugin already loaded: ", pluginFactory.getName()));
		return oFF.XPromise.resolve(oFF.XBooleanValue.create(true));
	}
	if (pluginFactory.canLoadLibraryByUrl())
	{
		return this._loadPluginLibrary(pluginFactory);
	}
	else
	{
		return oFF.HuBaseUtils.loadPluginDependencies(pluginFactory, this._getKernel(), this);
	}
};
oFF.HuPluginLoader.prototype.releaseObject = function()
{
	this.m_modulesInProgressList.clear();
	this.m_modulesInProgressList = oFF.XObjectExt.release(this.m_modulesInProgressList);
	oFF.HuDfHorizonToolsContext.prototype.releaseObject.call( this );
};

oFF.HuDfHorizonProcessor = function() {};
oFF.HuDfHorizonProcessor.prototype = new oFF.HuDfHorizonToolsContext();
oFF.HuDfHorizonProcessor.prototype._ff_c = "HuDfHorizonProcessor";

oFF.HuDfHorizonProcessor.prototype._setupToolsContext = function()
{
	this._setupProcessor();
};
oFF.HuDfHorizonProcessor.prototype.getLogContextName = function()
{
	return this._getProcessorName();
};
oFF.HuDfHorizonProcessor.prototype.releaseObject = function()
{
	oFF.HuDfHorizonToolsContext.prototype.releaseObject.call( this );
};

oFF.HuDfMainControllerContext = function() {};
oFF.HuDfMainControllerContext.prototype = new oFF.HuDfHorizonToolsContext();
oFF.HuDfMainControllerContext.prototype._ff_c = "HuDfMainControllerContext";

oFF.HuDfMainControllerContext.prototype.m_mainController = null;
oFF.HuDfMainControllerContext.prototype._setupToolsContext = function()
{
	this._setupMainControllerContext();
};
oFF.HuDfMainControllerContext.prototype._setupWithMainController = function(mainController)
{
	this.m_mainController = mainController;
	if (oFF.isNull(this.m_mainController))
	{
		throw oFF.XException.createRuntimeException("Missing main controller! A main controller is required for this object!");
	}
	this._setupWithToolsContext(mainController);
};
oFF.HuDfMainControllerContext.prototype.getMainController = function()
{
	return this.m_mainController;
};
oFF.HuDfMainControllerContext.prototype.releaseObject = function()
{
	this.m_mainController = null;
	oFF.HuDfHorizonToolsContext.prototype.releaseObject.call( this );
};

oFF.HuActivityIndicatorBootScreenView = function() {};
oFF.HuActivityIndicatorBootScreenView.prototype = new oFF.HuDfBootScreenView();
oFF.HuActivityIndicatorBootScreenView.prototype._ff_c = "HuActivityIndicatorBootScreenView";

oFF.HuActivityIndicatorBootScreenView.create = function(genesis)
{
	let newView = new oFF.HuActivityIndicatorBootScreenView();
	newView.initView(genesis);
	return newView;
};
oFF.HuActivityIndicatorBootScreenView.prototype.destroyView = function() {};
oFF.HuActivityIndicatorBootScreenView.prototype.layoutView = function(viewControl)
{
	viewControl.setDirection(oFF.UiFlexDirection.COLUMN);
	viewControl.useMaxSpace();
	viewControl.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	viewControl.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
	viewControl.addNewItemOfType(oFF.UiType.ACTIVITY_INDICATOR);
};
oFF.HuActivityIndicatorBootScreenView.prototype.setCurrentPercentValue = function(percentValue) {};
oFF.HuActivityIndicatorBootScreenView.prototype.setCurrentStatusText = function(statusText) {};
oFF.HuActivityIndicatorBootScreenView.prototype.setErrorMessage = function(errorMsg)
{
	this.getView().clearItems();
	let errorStrip = this.getView().addNewItemOfType(oFF.UiType.MESSAGE_STRIP);
	errorStrip.setMessageType(oFF.UiMessageType.ERROR);
	errorStrip.setText(errorMsg);
};

oFF.HuSplashBootScreenView = function() {};
oFF.HuSplashBootScreenView.prototype = new oFF.HuDfBootScreenView();
oFF.HuSplashBootScreenView.prototype._ff_c = "HuSplashBootScreenView";

oFF.HuSplashBootScreenView.create = function(genesis, splashScreenImagePath)
{
	let newView = new oFF.HuSplashBootScreenView();
	newView._setSplashScreenImagePath(splashScreenImagePath);
	newView.initView(genesis);
	return newView;
};
oFF.HuSplashBootScreenView.prototype.m_currentBootActionLbl = null;
oFF.HuSplashBootScreenView.prototype.m_splashImage = null;
oFF.HuSplashBootScreenView.prototype.m_splashImagePath = null;
oFF.HuSplashBootScreenView.prototype.m_splashMessageStrip = null;
oFF.HuSplashBootScreenView.prototype.m_splashProgressIndicator = null;
oFF.HuSplashBootScreenView.prototype._setSplashScreenImagePath = function(imgPath)
{
	this.m_splashImagePath = imgPath;
	if (oFF.notNull(this.m_splashImage))
	{
		this.m_splashImage.setSrc(imgPath);
	}
};
oFF.HuSplashBootScreenView.prototype.destroyView = function()
{
	this.m_splashImage = oFF.XObjectExt.release(this.m_splashImage);
	this.m_currentBootActionLbl = oFF.XObjectExt.release(this.m_currentBootActionLbl);
	this.m_splashProgressIndicator = oFF.XObjectExt.release(this.m_splashProgressIndicator);
	this.m_splashMessageStrip = oFF.XObjectExt.release(this.m_splashMessageStrip);
};
oFF.HuSplashBootScreenView.prototype.layoutView = function(viewControl)
{
	viewControl.setDirection(oFF.UiFlexDirection.COLUMN);
	viewControl.useMaxSpace();
	viewControl.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	viewControl.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
	this.m_splashImage = viewControl.addNewItemOfType(oFF.UiType.IMAGE);
	this.m_splashImage.setSrc(this.m_splashImagePath);
	this.m_splashImage.useMaxSpace();
	this.m_splashImage.setImageMode(oFF.UiImageMode.BACKGROUND);
	this.m_splashImage.setBackgroundSize("contain");
	this.m_splashImage.setBackgroundPosition("center");
	this.m_splashImage.setMargin(oFF.UiCssBoxEdges.create("1rem 0 0 0"));
	this.m_splashImage.setMaxWidth(oFF.UiCssLength.create("512px"));
	this.m_splashImage.setMaxHeight(oFF.UiCssLength.create("512px"));
	this.m_currentBootActionLbl = viewControl.addNewItemOfType(oFF.UiType.LABEL);
	this.m_currentBootActionLbl.setTextAlign(oFF.UiTextAlign.CENTER);
	this.m_currentBootActionLbl.setFlex("0 0 auto");
	this.m_currentBootActionLbl.setMargin(oFF.UiCssBoxEdges.create("1rem 0 0 0"));
	this.m_currentBootActionLbl.setVisible(false);
	this.m_currentBootActionLbl.setText("");
	this.m_splashProgressIndicator = viewControl.addNewItemOfType(oFF.UiType.PROGRESS_INDICATOR);
	this.m_splashProgressIndicator.setWidth(oFF.UiCssLength.create("50%"));
	this.m_splashProgressIndicator.setMargin(oFF.UiCssBoxEdges.create("0 0 0.5rem 0"));
	this.m_splashMessageStrip = viewControl.addNewItemOfType(oFF.UiType.MESSAGE_STRIP);
	this.m_splashMessageStrip.setMessageType(oFF.UiMessageType.ERROR);
	this.m_splashMessageStrip.setMargin(oFF.UiCssBoxEdges.create("0 0 1rem 0"));
	this.m_splashMessageStrip.setShowCloseButton(false);
	this.m_splashMessageStrip.setVisible(false);
};
oFF.HuSplashBootScreenView.prototype.setCurrentPercentValue = function(percentValue)
{
	if (oFF.notNull(this.m_splashProgressIndicator))
	{
		this.m_splashProgressIndicator.setPercentValue(percentValue);
	}
};
oFF.HuSplashBootScreenView.prototype.setCurrentStatusText = function(statusText)
{
	if (oFF.notNull(this.m_currentBootActionLbl))
	{
		if (oFF.XStringUtils.isNotNullAndNotEmpty(statusText))
		{
			this.m_currentBootActionLbl.setVisible(true);
		}
		else
		{
			this.m_currentBootActionLbl.setVisible(false);
		}
		this.m_currentBootActionLbl.setText(statusText);
	}
};
oFF.HuSplashBootScreenView.prototype.setErrorMessage = function(errorMsg)
{
	if (oFF.notNull(this.m_splashMessageStrip))
	{
		if (oFF.XStringUtils.isNotNullAndNotEmpty(errorMsg))
		{
			this.m_splashMessageStrip.setVisible(true);
		}
		else
		{
			this.m_splashMessageStrip.setVisible(false);
		}
		this.m_splashMessageStrip.setText(errorMsg);
	}
};

oFF.HuMessageGroup = function() {};
oFF.HuMessageGroup.prototype = new oFF.XConstant();
oFF.HuMessageGroup.prototype._ff_c = "HuMessageGroup";

oFF.HuMessageGroup.PLUGIN = null;
oFF.HuMessageGroup.SYSTEM = null;
oFF.HuMessageGroup.s_pluginGroups = null;
oFF.HuMessageGroup._createWithName = function(name)
{
	let newGroup = oFF.XConstant.setupName(new oFF.HuMessageGroup(), name);
	newGroup._setDisplayName(name);
	return newGroup;
};
oFF.HuMessageGroup.createForPluginNameIfNecessary = function(name, displayName)
{
	let pluginGroup = oFF.HuMessageGroup.s_pluginGroups.getByKey(name);
	if (oFF.isNull(pluginGroup))
	{
		pluginGroup = oFF.HuMessageGroup._createWithName(name);
		pluginGroup._setDisplayName(oFF.XStringUtils.isNotNullAndNotEmpty(displayName) ? displayName : name);
		oFF.HuMessageGroup.s_pluginGroups.put(name, pluginGroup);
	}
	return oFF.HuMessageGroup.s_pluginGroups.getByKey(name);
};
oFF.HuMessageGroup.staticSetup = function()
{
	oFF.HuMessageGroup.s_pluginGroups = oFF.XHashMapByString.create();
	oFF.HuMessageGroup.SYSTEM = oFF.HuMessageGroup._createWithName("System");
	oFF.HuMessageGroup.PLUGIN = oFF.HuMessageGroup._createWithName("Plugin");
};
oFF.HuMessageGroup.prototype.m_displayName = null;
oFF.HuMessageGroup.prototype._setDisplayName = function(displayName)
{
	this.m_displayName = displayName;
};
oFF.HuMessageGroup.prototype.getDisplayName = function()
{
	return this.m_displayName;
};

oFF.HuMessageType = function() {};
oFF.HuMessageType.prototype = new oFF.XConstant();
oFF.HuMessageType.prototype._ff_c = "HuMessageType";

oFF.HuMessageType.ERROR = null;
oFF.HuMessageType.INFORMATION = null;
oFF.HuMessageType.SUCCESS = null;
oFF.HuMessageType.WARNING = null;
oFF.HuMessageType._createWithName = function(name)
{
	return oFF.XConstant.setupName(new oFF.HuMessageType(), name);
};
oFF.HuMessageType.staticSetup = function()
{
	oFF.HuMessageType.INFORMATION = oFF.HuMessageType._createWithName("Information");
	oFF.HuMessageType.SUCCESS = oFF.HuMessageType._createWithName("Success");
	oFF.HuMessageType.WARNING = oFF.HuMessageType._createWithName("Warning");
	oFF.HuMessageType.ERROR = oFF.HuMessageType._createWithName("Error");
};

oFF.HuToolbarGroup = function() {};
oFF.HuToolbarGroup.prototype = new oFF.XConstant();
oFF.HuToolbarGroup.prototype._ff_c = "HuToolbarGroup";

oFF.HuToolbarGroup.DEBUG = null;
oFF.HuToolbarGroup.UNGROUPED = null;
oFF.HuToolbarGroup.s_customGroups = null;
oFF.HuToolbarGroup._createWithName = function(name)
{
	let newGroup = oFF.XConstant.setupName(new oFF.HuToolbarGroup(), name);
	return newGroup;
};
oFF.HuToolbarGroup.createCustomGroupIfNecessary = function(name)
{
	let customGroup = oFF.HuToolbarGroup.s_customGroups.getByKey(name);
	if (oFF.isNull(customGroup))
	{
		customGroup = oFF.HuToolbarGroup._createWithName(name);
		oFF.HuToolbarGroup.s_customGroups.put(name, customGroup);
	}
	return oFF.HuToolbarGroup.s_customGroups.getByKey(name);
};
oFF.HuToolbarGroup.staticSetup = function()
{
	oFF.HuToolbarGroup.s_customGroups = oFF.XHashMapByString.create();
	oFF.HuToolbarGroup.DEBUG = oFF.HuToolbarGroup._createWithName("Debug");
	oFF.HuToolbarGroup.UNGROUPED = oFF.HuToolbarGroup._createWithName("Ungrouped");
};

oFF.HuConfigBootAction = function() {};
oFF.HuConfigBootAction.prototype = new oFF.HuDfHorizonBootAction();
oFF.HuConfigBootAction.prototype._ff_c = "HuConfigBootAction";

oFF.HuConfigBootAction.create = function(bootController)
{
	let newInstance = new oFF.HuConfigBootAction();
	newInstance._setupWithBootController(bootController);
	return newInstance;
};
oFF.HuConfigBootAction.prototype.m_configFile = null;
oFF.HuConfigBootAction.prototype.m_configFilePath = null;
oFF.HuConfigBootAction.prototype.m_configStr = null;
oFF.HuConfigBootAction.prototype._createConfigFile = function()
{
	return oFF.XFilePromise.saveContent(this.m_configFile, this._getBootController().getConfigManager().getSaveContent());
};
oFF.HuConfigBootAction.prototype._loadConfigJson = function(configFile)
{
	let configFileLoadPromise = oFF.XPromise.create((resolve, reject) => {
		oFF.XFilePromise.isExisting(configFile).onThen((isExisting) => {
			if (isExisting.getBoolean())
			{
				oFF.XFilePromise.loadJsonStructure(this.m_configFile).onThen((tmpConfigJson) => {
					resolve(tmpConfigJson);
				}).onCatch((loadError) => {
					reject(oFF.XError.create("Cannot read file!").setErrorType(oFF.HuErrorType.CONFIG_SYNTAX_ERROR));
				});
			}
			else
			{
				reject(oFF.XError.create("File does not exist!").setErrorType(oFF.HuErrorType.CONFIG_FILE_NOT_FOUND));
			}
		}).onCatch((fileExistingError) => {
			reject(oFF.XError.create(fileExistingError.getText()).attachCause(fileExistingError).setErrorType(oFF.HuErrorType.CONFIG_FILE_NOT_FOUND));
		});
	});
	return configFileLoadPromise;
};
oFF.HuConfigBootAction.prototype._parseStringifiedJson = function(stringifiedJson)
{
	let parsedJson = null;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(stringifiedJson))
	{
		let tmpElement = oFF.PrUtils.deserialize(stringifiedJson);
		if (oFF.notNull(tmpElement) && tmpElement.isStructure())
		{
			parsedJson = tmpElement;
		}
	}
	return parsedJson;
};
oFF.HuConfigBootAction.prototype._setupAction = function() {};
oFF.HuConfigBootAction.prototype._shouldCreateConfigFileIfNeeded = function()
{
	return this._getBootController().getWorkspaceManager() !== null && !this._getBootController().getWorkspaceManager().isVirtualWorkspace() && this._getBootController().getWorkspaceManager().getWorkspaceDirectory() !== null;
};
oFF.HuConfigBootAction.prototype.executeBootAction = function()
{
	if (this._getBootController().getWorkspaceManager() !== null && !this._getBootController().getWorkspaceManager().isVirtualWorkspace() && this._getBootController().getWorkspaceManager().getWorkspaceDirectory() !== null)
	{
		this.m_configFile = this._getBootController().getWorkspaceManager().getHorizonWorkspaceConfigFile();
	}
	if (this._getBootController().getWorkspaceManager() !== null && this._getBootController().getWorkspaceManager().isVirtualWorkspace() && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_configStr))
	{
		let parsedJson = this._parseStringifiedJson(this.m_configStr);
		if (oFF.notNull(parsedJson))
		{
			this._getBootController().initConfigManager(parsedJson);
			return oFF.XPromise.resolve(oFF.XBooleanValue.create(true));
		}
	}
	if (oFF.isNull(this.m_configFile) && this._getBootController().getWorkspaceManager() !== null && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_configFilePath))
	{
		this.m_configFile = oFF.XFile.createWithVars(this._getBootController().getProcess(), this.m_configFilePath);
	}
	let bootPromise = oFF.XPromise.create((resolve, reject) => {
		this._loadConfigJson(this.m_configFile).onThen((tmpConfig) => {
			this._getBootController().initConfigManager(tmpConfig);
			resolve(oFF.XBooleanValue.create(true));
		}).onCatch((loadConfigError) => {
			if (loadConfigError.getErrorType() === oFF.HuErrorType.CONFIG_SYNTAX_ERROR)
			{
				reject(oFF.XError.create("Syntax error! Could not read configuration file!"));
			}
			else
			{
				this._getBootController().initConfigManager(null);
				if (loadConfigError.getErrorType() === oFF.HuErrorType.CONFIG_FILE_NOT_FOUND && this._shouldCreateConfigFileIfNeeded())
				{
					this._createConfigFile().onFinally(() => {
						resolve(oFF.XBooleanValue.create(true));
					});
				}
				else
				{
					resolve(oFF.XBooleanValue.create(true));
				}
			}
		});
	});
	return bootPromise;
};
oFF.HuConfigBootAction.prototype.getActionName = function()
{
	return "Config";
};
oFF.HuConfigBootAction.prototype.releaseObject = function()
{
	this.m_configFile = oFF.XObjectExt.release(this.m_configFile);
	oFF.HuDfHorizonBootAction.prototype.releaseObject.call( this );
};
oFF.HuConfigBootAction.prototype.setConfigFilePath = function(configFilePath)
{
	this.m_configFilePath = configFilePath;
};
oFF.HuConfigBootAction.prototype.setConfigStr = function(configStr)
{
	this.m_configStr = configStr;
};

oFF.HuFinalizeSetupBootAction = function() {};
oFF.HuFinalizeSetupBootAction.prototype = new oFF.HuDfHorizonBootAction();
oFF.HuFinalizeSetupBootAction.prototype._ff_c = "HuFinalizeSetupBootAction";

oFF.HuFinalizeSetupBootAction.create = function(bootController)
{
	let newInstance = new oFF.HuFinalizeSetupBootAction();
	newInstance._setupWithBootController(bootController);
	return newInstance;
};
oFF.HuFinalizeSetupBootAction.prototype._setupAction = function() {};
oFF.HuFinalizeSetupBootAction.prototype.executeBootAction = function()
{
	return this._getBootController().finalizeMainControllerSetup();
};
oFF.HuFinalizeSetupBootAction.prototype.getActionName = function()
{
	return "FinalizeSetup";
};

oFF.HuPluginsManifestLoadBootAction = function() {};
oFF.HuPluginsManifestLoadBootAction.prototype = new oFF.HuDfHorizonBootAction();
oFF.HuPluginsManifestLoadBootAction.prototype._ff_c = "HuPluginsManifestLoadBootAction";

oFF.HuPluginsManifestLoadBootAction.create = function(bootController)
{
	let newInstance = new oFF.HuPluginsManifestLoadBootAction();
	newInstance._setupWithBootController(bootController);
	return newInstance;
};
oFF.HuPluginsManifestLoadBootAction.prototype.m_pluginManifestProcessingMode = null;
oFF.HuPluginsManifestLoadBootAction.prototype._getPluginManifestDirectoryList = function()
{
	let pluginDirList = oFF.XList.create();
	pluginDirList.add(oFF.XFile.createWithVars(this._getBootController().getProcess(), oFF.HuHorizonConstants.DEFAULT_PLUGIN_DIRECTORY));
	pluginDirList.add(oFF.XFile.createWithVars(this._getBootController().getProcess(), oFF.HuHorizonConstants.ALT_PLUGIN_DIRECTORY));
	oFF.XCollectionUtils.forEach(this._getBootController().getConfigManager().getHorizonConfiguration().getPluginDirectories(), (tmpDir) => {
		pluginDirList.add(oFF.XFile.createWithVars(this._getBootController().getProcess(), tmpDir));
	});
	return pluginDirList;
};
oFF.HuPluginsManifestLoadBootAction.prototype._loadPluginManifests = function()
{
	this.logDebug(oFF.XStringUtils.concatenate2("Plugin manifest processing mode: ", this.m_pluginManifestProcessingMode.getName()));
	let loadPluginManifestPromise = oFF.XPromise.create((resolve, reject) => {
		oFF.HuPluginRegistryBase.loadApiPlugins();
		if (this.m_pluginManifestProcessingMode === oFF.HuPluginManifestProcessingMode.DISABLED)
		{
			resolve(oFF.XBooleanValue.create(true));
		}
		else
		{
			let newLoader = oFF.HuPluginManifestProcessor.create(this);
			let pluginManifestLoadPromiseList = oFF.XPromiseList.create();
			if (this.m_pluginManifestProcessingMode === oFF.HuPluginManifestProcessingMode.CUSTOM || this.m_pluginManifestProcessingMode === oFF.HuPluginManifestProcessingMode.FULL)
			{
				pluginManifestLoadPromiseList.add(newLoader.processPluginManifestFiles(this._parseCustomPluginManifestFilesToProcess()));
			}
			if (oFF.isNull(this.m_pluginManifestProcessingMode) || this.m_pluginManifestProcessingMode === oFF.HuPluginManifestProcessingMode.DEFAULT || this.m_pluginManifestProcessingMode === oFF.HuPluginManifestProcessingMode.FULL)
			{
				pluginManifestLoadPromiseList.add(newLoader.processPluginManifestDirectories(this._getPluginManifestDirectoryList()));
			}
			let allPluginLoadPromise = oFF.XPromise.allSettled(pluginManifestLoadPromiseList);
			allPluginLoadPromise.onFinally(() => {
				resolve(oFF.XBooleanValue.create(true));
			});
		}
	});
	return loadPluginManifestPromise;
};
oFF.HuPluginsManifestLoadBootAction.prototype._parseCustomPluginManifestFilesToProcess = function()
{
	let fileList = oFF.XList.create();
	let pluginManifestFilesStr = this.getProcess().getEnvironment().getStringByKey(oFF.HuHorizonConstants.CUSTOM_PLUGIN_MANIFESTS_TO_PROCESS_ENV_VARIABLE);
	let filesNameList = oFF.XStringTokenizer.splitString(pluginManifestFilesStr, ",");
	if (oFF.XCollectionUtils.hasElements(filesNameList))
	{
		oFF.XCollectionUtils.forEach(filesNameList, (fileName) => {
			let fileNameCorrected = oFF.XString.trim(fileName);
			let hasExtension = oFF.XFileUtils.hasFileExtension(fileNameCorrected);
			let hasPath = oFF.XString.lastIndexOf(fileNameCorrected, oFF.XUri.PATH_SEPARATOR) !== -1;
			if (!hasExtension && !hasPath && oFF.HuPluginRegistryBase.hasManifest(fileNameCorrected))
			{
				return;
			}
			if (!hasExtension)
			{
				fileNameCorrected = oFF.XStringUtils.concatenate2(fileNameCorrected, oFF.HuHorizonConstants.DEFAULT_PLUGIN_MANIFEST_EXTENSION);
			}
			if (!hasPath)
			{
				fileNameCorrected = oFF.XStringUtils.concatenate3(oFF.HuHorizonConstants.DEFAULT_PLUGIN_DIRECTORY, oFF.XUri.PATH_SEPARATOR, fileNameCorrected);
			}
			fileList.add(oFF.XFile.create(this.getProcess(), fileNameCorrected));
		});
	}
	return fileList;
};
oFF.HuPluginsManifestLoadBootAction.prototype._setupAction = function()
{
	this.m_pluginManifestProcessingMode = oFF.HuPluginManifestProcessingMode.lookup(this.getProcess().getEnvironment().getStringByKey(oFF.HuHorizonConstants.PLUGIN_MANIFEST_PROCESSING_MODE_ENV_VARIABLE));
	if (oFF.isNull(this.m_pluginManifestProcessingMode))
	{
		this.m_pluginManifestProcessingMode = oFF.HuPluginManifestProcessingMode.DEFAULT;
	}
	this.logDebug(oFF.XStringUtils.concatenate2("Number of registered plugins: ", oFF.XInteger.convertToString(oFF.HuPluginRegistryBase.getAllLoadedPluginNames().size())));
};
oFF.HuPluginsManifestLoadBootAction.prototype.executeBootAction = function()
{
	return this._loadPluginManifests();
};
oFF.HuPluginsManifestLoadBootAction.prototype.getActionName = function()
{
	return "Plugins Manifest Load";
};
oFF.HuPluginsManifestLoadBootAction.prototype.releaseObject = function()
{
	this.m_pluginManifestProcessingMode = null;
	oFF.HuDfHorizonBootAction.prototype.releaseObject.call( this );
};

oFF.HuPluginsModuleLoadBootAction = function() {};
oFF.HuPluginsModuleLoadBootAction.prototype = new oFF.HuDfHorizonBootAction();
oFF.HuPluginsModuleLoadBootAction.prototype._ff_c = "HuPluginsModuleLoadBootAction";

oFF.HuPluginsModuleLoadBootAction.create = function(bootController)
{
	let newInstance = new oFF.HuPluginsModuleLoadBootAction();
	newInstance._setupWithBootController(bootController);
	return newInstance;
};
oFF.HuPluginsModuleLoadBootAction.prototype.m_pluginLoader = null;
oFF.HuPluginsModuleLoadBootAction.prototype._getPluginLoader = function()
{
	return this.m_pluginLoader;
};
oFF.HuPluginsModuleLoadBootAction.prototype._loadPlugins = function()
{
	let configPlugins = this._getBootController().getConfigManager().getPluginsConfiguration().getAllStartupPlugins();
	if (!oFF.XCollectionUtils.hasElements(configPlugins))
	{
		this.logDebug("No plugins in configuration specified!");
		return oFF.XPromise.resolve(oFF.XBooleanValue.create(true));
	}
	this.logDebug(oFF.XStringUtils.concatenate2("Configuration plugins: ", oFF.XCollectionUtils.join(configPlugins, ",")));
	let pluginLoadPromiseList = oFF.XPromiseList.create();
	oFF.XCollectionUtils.forEach(configPlugins, (plugin) => {
		pluginLoadPromiseList.add(this._processPluginLoad(plugin));
	});
	let pluginsLoadAllPromise = oFF.XPromise.allSettled(pluginLoadPromiseList);
	return pluginsLoadAllPromise.onThenExt((result) => {
		return oFF.XBooleanValue.create(true);
	});
};
oFF.HuPluginsModuleLoadBootAction.prototype._processPluginLoad = function(pluginName)
{
	let pluginLoadPromise = oFF.XPromise.create((resolve, reject) => {
		if (!oFF.HuPluginRegistryBase.isPluginLoaded(pluginName))
		{
			if (oFF.HuPluginRegistryBase.hasManifest(pluginName))
			{
				this.logDebug(oFF.XStringUtils.concatenate2(pluginName, " plugin not loaded, attempting to load..."));
				this._getPluginLoader().loadPlugin(oFF.HuPluginRegistryBase.getPluginFactory(pluginName)).onFinally(() => {
					resolve(oFF.XBooleanValue.create(true));
				});
			}
			else
			{
				this.logDebug(oFF.XStringUtils.concatenate3("!!!! ", pluginName, ", Plugin manifest not found,cannot load!"));
				reject(oFF.XError.create("Plugin manifest not found!"));
			}
		}
		else
		{
			this.logDebug(oFF.XStringUtils.concatenate2("Plugin already loaded -> ", pluginName));
			resolve(oFF.XBooleanValue.create(true));
		}
	});
	return pluginLoadPromise;
};
oFF.HuPluginsModuleLoadBootAction.prototype._setupAction = function()
{
	this.m_pluginLoader = oFF.HuPluginLoader.create(this);
};
oFF.HuPluginsModuleLoadBootAction.prototype.executeBootAction = function()
{
	return this._loadPlugins().onThen((res) => {
		oFF.HuPluginRegistryBase.loadApiPlugins();
	});
};
oFF.HuPluginsModuleLoadBootAction.prototype.getActionName = function()
{
	return "Plugins Module Load";
};
oFF.HuPluginsModuleLoadBootAction.prototype.releaseObject = function()
{
	this.m_pluginLoader = oFF.XObjectExt.release(this.m_pluginLoader);
	oFF.HuDfHorizonBootAction.prototype.releaseObject.call( this );
};

oFF.HuWorkspaceBootAction = function() {};
oFF.HuWorkspaceBootAction.prototype = new oFF.HuDfHorizonBootAction();
oFF.HuWorkspaceBootAction.prototype._ff_c = "HuWorkspaceBootAction";

oFF.HuWorkspaceBootAction.create = function(bootController)
{
	let newInstance = new oFF.HuWorkspaceBootAction();
	newInstance._setupWithBootController(bootController);
	return newInstance;
};
oFF.HuWorkspaceBootAction.prototype._executeBootConfigSpecifiedWorkspaceLoad = function(workspaceDirPath)
{
	let workspaceBootConfigPromise = oFF.XPromise.create((resolve, reject) => {
		let specifiedWorkspaceDir = oFF.XFile.createWithVars(this._getBootController().getProcess(), workspaceDirPath);
		oFF.XFilePromise.isExisting(specifiedWorkspaceDir).onThen((isExisting) => {
			if (isExisting.getBoolean())
			{
				this._handleDirectorySelected(specifiedWorkspaceDir, false).onThen((workspaceDir) => {
					resolve(oFF.XBooleanValue.create(true));
				}).onCatch(reject);
			}
			else
			{
				reject(oFF.XError.create("The specified workspace directory does not exist!"));
			}
		}).onCatch(reject);
	});
	return workspaceBootConfigPromise;
};
oFF.HuWorkspaceBootAction.prototype._executeDefaultWorkspaceLoad = function()
{
	return this._selectWorkspace().onThenPromise((directory) => {
		if (oFF.isNull(directory))
		{
			throw oFF.XException.createException("No workspace selected! Cannot continue!");
		}
		return this._handleDirectorySelected(directory, true);
	});
};
oFF.HuWorkspaceBootAction.prototype._executeVirtualWorkspaceLoad = function()
{
	return this._handleDirectorySelected(null, false);
};
oFF.HuWorkspaceBootAction.prototype._handleDirectorySelected = function(directory, saveInLocalStorage)
{
	if (saveInLocalStorage)
	{
		this._saveSelectedWorspaceDirPath(directory);
	}
	return this._getBootController().initWorkspaceManager(directory);
};
oFF.HuWorkspaceBootAction.prototype._saveSelectedWorspaceDirPath = function(workspaceDir)
{
	if (oFF.notNull(workspaceDir))
	{
		let selectedWorkspaceDirPath = workspaceDir.getUri().getPath();
		this._getBootController().getLocalStorage().putString(oFF.HuHorizonConstants.SELECTED_WORKSPACE_PATH_KEY, selectedWorkspaceDirPath);
	}
};
oFF.HuWorkspaceBootAction.prototype._selectWorkspace = function()
{
	let savedWorkspaceDirectoryPath = this._getBootController().getLocalStorage().getStringByKey(oFF.HuHorizonConstants.SELECTED_WORKSPACE_PATH_KEY);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(savedWorkspaceDirectoryPath))
	{
		let workspaceDirSelectionPromise = oFF.XPromise.create((resolve, reject) => {
			let savedWorkspaceDir = oFF.XFile.createWithVars(this._getBootController().getProcess(), savedWorkspaceDirectoryPath);
			oFF.XFilePromise.isExisting(savedWorkspaceDir).onThen((isExisting) => {
				if (isExisting.getBoolean())
				{
					resolve(savedWorkspaceDir);
				}
				else
				{
					this.logDebug("Saved workspace does not exist!");
					this._showWorkspaceSelectionDialog().onThen((selectedDir) => {
						resolve(selectedDir);
					}).onCatch(reject);
				}
			}).onCatch(reject);
		});
		return workspaceDirSelectionPromise;
	}
	return this._showWorkspaceSelectionDialog();
};
oFF.HuWorkspaceBootAction.prototype._setupAction = function() {};
oFF.HuWorkspaceBootAction.prototype._showWorkspaceSelectionDialog = function()
{
	let workspaceSelectionPromise = oFF.XPromise.create((resolve, reject) => {
		let selectionPopups = oFF.HuWorkspaceSelectionPopup.create(this._getBootController());
		if (this._getBootController().getWorkspaceManager() !== null && this._getBootController().getWorkspaceManager().getWorkspaceDirectory() !== null)
		{
			selectionPopups.setInputValue(this._getBootController().getWorkspaceManager().getWorkspaceDirectory().getUri().getPath());
		}
		else
		{
			selectionPopups.setInputValue(oFF.HuHorizonConstants.DEFAULT_HOME_DIRECTORY);
		}
		selectionPopups.setInputConsumer((selectedPath) => {
			if (oFF.XStringUtils.isNotNullAndNotEmpty(selectedPath))
			{
				let selectedDirectory = oFF.XFile.createWithVars(this._getBootController().getProcess(), selectedPath);
				resolve(selectedDirectory);
			}
			else
			{
				reject(oFF.XError.create("Invalid directory path!"));
			}
		});
		selectionPopups.setCancelProcedure(() => {
			reject(oFF.XError.create("Please specify a workspace to proceed!"));
		});
		selectionPopups.open();
	});
	return workspaceSelectionPromise;
};
oFF.HuWorkspaceBootAction.prototype.executeBootAction = function()
{
	if (this._getBootController().getBootConfig().shouldBootIntoVirtualWorkspace())
	{
		return this._executeVirtualWorkspaceLoad();
	}
	else if (oFF.XStringUtils.isNotNullAndNotEmpty(this._getBootController().getBootConfig().getWorkspaceDirectoryPath()))
	{
		return this._executeBootConfigSpecifiedWorkspaceLoad(this._getBootController().getBootConfig().getWorkspaceDirectoryPath());
	}
	return this._executeDefaultWorkspaceLoad();
};
oFF.HuWorkspaceBootAction.prototype.getActionName = function()
{
	return "Workspace";
};
oFF.HuWorkspaceBootAction.prototype.presentWorkspaceDirectorySelection = function()
{
	return this._showWorkspaceSelectionDialog();
};
oFF.HuWorkspaceBootAction.prototype.releaseObject = function()
{
	oFF.HuDfHorizonBootAction.prototype.releaseObject.call( this );
};
oFF.HuWorkspaceBootAction.prototype.switchWorkspace = function(directory)
{
	return this._handleDirectorySelected(directory, true);
};

oFF.HuPluginManifestProcessingMode = function() {};
oFF.HuPluginManifestProcessingMode.prototype = new oFF.UiBaseConstant();
oFF.HuPluginManifestProcessingMode.prototype._ff_c = "HuPluginManifestProcessingMode";

oFF.HuPluginManifestProcessingMode.CUSTOM = null;
oFF.HuPluginManifestProcessingMode.DEFAULT = null;
oFF.HuPluginManifestProcessingMode.DISABLED = null;
oFF.HuPluginManifestProcessingMode.FULL = null;
oFF.HuPluginManifestProcessingMode.s_lookup = null;
oFF.HuPluginManifestProcessingMode._createWithName = function(name)
{
	return oFF.UiBaseConstant.createUiConstant(new oFF.HuPluginManifestProcessingMode(), name, oFF.HuPluginManifestProcessingMode.s_lookup);
};
oFF.HuPluginManifestProcessingMode.lookup = function(name)
{
	return oFF.UiBaseConstant.lookupConstant(name, oFF.HuPluginManifestProcessingMode.s_lookup);
};
oFF.HuPluginManifestProcessingMode.staticSetup = function()
{
	oFF.HuPluginManifestProcessingMode.s_lookup = oFF.XHashMapByString.create();
	oFF.HuPluginManifestProcessingMode.FULL = oFF.HuPluginManifestProcessingMode._createWithName("Full");
	oFF.HuPluginManifestProcessingMode.DEFAULT = oFF.HuPluginManifestProcessingMode._createWithName("Default");
	oFF.HuPluginManifestProcessingMode.CUSTOM = oFF.HuPluginManifestProcessingMode._createWithName("Custom");
	oFF.HuPluginManifestProcessingMode.DISABLED = oFF.HuPluginManifestProcessingMode._createWithName("Disabled");
};

oFF.HuDataSpace = function() {};
oFF.HuDataSpace.prototype = new oFF.DfDataSpace();
oFF.HuDataSpace.prototype._ff_c = "HuDataSpace";

oFF.HuDataSpace.create = function()
{
	let dataSpace = new oFF.HuDataSpace();
	dataSpace._setupDataSpace();
	return dataSpace;
};
oFF.HuDataSpace.prototype.m_keyObserverMap = null;
oFF.HuDataSpace.prototype._setupDataSpace = function()
{
	this.m_keyObserverMap = oFF.XHashMapByString.create();
	this.setup();
};
oFF.HuDataSpace.prototype.addKeyObserver = function(key, callback)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(key) && oFF.notNull(callback))
	{
		if (!this.m_keyObserverMap.containsKey(key))
		{
			this.m_keyObserverMap.put(key, oFF.XHashMapByString.create());
		}
		let observerUuid = oFF.XGuid.getGuid();
		observerUuid = oFF.XStringUtils.concatenate4("dsObserver_", key, "_", observerUuid);
		this.m_keyObserverMap.getByKey(key).put(observerUuid, oFF.XProcedureHolder.create(callback));
		return observerUuid;
	}
	return null;
};
oFF.HuDataSpace.prototype.dataForKeyChanged = function(changedKey)
{
	let tmpKeyMap = this.m_keyObserverMap.getByKey(changedKey);
	if (oFF.notNull(tmpKeyMap) && tmpKeyMap.size() > 0)
	{
		oFF.XCollectionUtils.forEach(tmpKeyMap.getValuesAsReadOnlyList(), (tmpCallback) => {
			tmpCallback.execute();
		});
	}
};
oFF.HuDataSpace.prototype.releaseObject = function()
{
	this.m_keyObserverMap = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_keyObserverMap);
	oFF.DfDataSpace.prototype.releaseObject.call( this );
};
oFF.HuDataSpace.prototype.removeKeyObserver = function(callback)
{
	oFF.XCollectionUtils.forEach(this.m_keyObserverMap.getValuesAsReadOnlyList(), (keyMap) => {
		oFF.XCollectionUtils.removeFromMapIf(keyMap, (key, value) => {
			return value.getProcedure() === callback;
		});
	});
};
oFF.HuDataSpace.prototype.removeKeyObserverByUuid = function(observerUuid)
{
	oFF.XCollectionUtils.forEach(this.m_keyObserverMap, (keyMap) => {
		if (keyMap.containsKey(observerUuid))
		{
			keyMap.remove(observerUuid);
		}
	});
};

oFF.HuDfHorizonPluginManager = function() {};
oFF.HuDfHorizonPluginManager.prototype = new oFF.HuDfHorizonManager();
oFF.HuDfHorizonPluginManager.prototype._ff_c = "HuDfHorizonPluginManager";

oFF.HuDfHorizonPluginManager.prototype.m_pluginParentController = null;
oFF.HuDfHorizonPluginManager.prototype.m_runningPlugins = null;
oFF.HuDfHorizonPluginManager.prototype._getPluginParentController = function()
{
	return this.m_pluginParentController;
};
oFF.HuDfHorizonPluginManager.prototype._onBeforePluginInit = function(pluginStartupInfo)
{
	if (oFF.notNull(pluginStartupInfo))
	{
		this.logDebug(oFF.XStringUtils.concatenate3("Initializing plugin --> ", pluginStartupInfo.getPluginName(), " ---------------------------------"));
	}
};
oFF.HuDfHorizonPluginManager.prototype._runPlugin = function(pluginController)
{
	if (oFF.notNull(pluginController))
	{
		this.logDebug(oFF.XStringUtils.concatenate3("Running plugin --> ", pluginController.getName(), " ---------------------------------"));
		return pluginController.run().onThenExt((result) => {
			this.m_runningPlugins.put(pluginController.getUuid(), pluginController);
			return pluginController;
		}).onCatch((err) => {
			this.m_runningPlugins.remove(pluginController.getUuid());
		});
	}
	return oFF.XPromise.reject(oFF.XError.create("Missing plugin controller! Cannot run!"));
};
oFF.HuDfHorizonPluginManager.prototype._setupManager = function()
{
	this.m_runningPlugins = oFF.XHashMapByString.create();
	this._setupPluginManager();
};
oFF.HuDfHorizonPluginManager.prototype._setupWithParentController = function(parentController)
{
	this.m_pluginParentController = parentController;
	if (oFF.isNull(this.m_pluginParentController))
	{
		throw oFF.XException.createRuntimeException("Missing parent controller! A parent controller is required for a plugin manager!");
	}
	this._setupWithGenericController(parentController);
};
oFF.HuDfHorizonPluginManager.prototype.getAllRunningPlugins = function()
{
	return this.m_runningPlugins.getValuesAsReadOnlyList();
};
oFF.HuDfHorizonPluginManager.prototype.getPluginByUuid = function(pluginUuid)
{
	return this.m_runningPlugins.getByKey(pluginUuid);
};
oFF.HuDfHorizonPluginManager.prototype.killPluginByUuid = function(pluginUuid)
{
	if (this.m_runningPlugins.containsKey(pluginUuid))
	{
		let tmpPlugin = this.m_runningPlugins.getByKey(pluginUuid);
		this.m_runningPlugins.remove(pluginUuid);
		tmpPlugin.kill();
		return true;
	}
	return false;
};
oFF.HuDfHorizonPluginManager.prototype.releaseObject = function()
{
	this.m_runningPlugins = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_runningPlugins);
	oFF.HuDfHorizonManager.prototype.releaseObject.call( this );
};

oFF.HuDfViewPluginController = function() {};
oFF.HuDfViewPluginController.prototype = new oFF.HuDfHorizonPluginController();
oFF.HuDfViewPluginController.prototype._ff_c = "HuDfViewPluginController";

oFF.HuDfViewPluginController.prototype.m_pluginGenesis = null;
oFF.HuDfViewPluginController.prototype.m_pluginTitle = null;
oFF.HuDfViewPluginController.prototype.m_viewPluginWrapper = null;
oFF.HuDfViewPluginController.prototype._destroySpecificPlugin = function()
{
	this._destroySpecificViewPlugin();
	this.m_viewPluginWrapper = oFF.XObjectExt.release(this.m_viewPluginWrapper);
	this.m_pluginGenesis = oFF.XObjectExt.release(this.m_pluginGenesis);
};
oFF.HuDfViewPluginController.prototype._getPluginGenesis = function()
{
	return this.m_pluginGenesis;
};
oFF.HuDfViewPluginController.prototype._getViewPluginInstance = function()
{
	try
	{
		return this._getPluginInstance();
	}
	catch (err)
	{
		this._throwInvalidPluginTypeException();
	}
	return null;
};
oFF.HuDfViewPluginController.prototype._initSpecificPlugin = function(configuration)
{
	let mainGenesis = this._getParentController().getMainController().getGenesis();
	if (oFF.isNull(mainGenesis))
	{
		throw oFF.XException.createRuntimeException("Missing genesis! Cannot create view plugin!");
	}
	this.m_viewPluginWrapper = mainGenesis.newControl(oFF.UiType.CONTENT_WRAPPER);
	this.m_viewPluginWrapper.useMaxSpace();
	let innerGenesis = oFF.UiGenesis.create(this.m_viewPluginWrapper);
	this.m_pluginGenesis = innerGenesis;
	this._initSpecificViewPlugin();
};
oFF.HuDfViewPluginController.prototype._setPluginUiBusy = function(busy)
{
	if (this.getPluginWrapperView() !== null)
	{
		this.getPluginWrapperView().setBusy(busy);
	}
};
oFF.HuDfViewPluginController.prototype.getPluginTitle = function()
{
	return this.m_pluginTitle;
};
oFF.HuDfViewPluginController.prototype.getPluginWrapperView = function()
{
	return this.m_viewPluginWrapper;
};
oFF.HuDfViewPluginController.prototype.getView = function()
{
	return this.getPluginWrapperView();
};
oFF.HuDfViewPluginController.prototype.onPluginContainerDidBecameHidden = function()
{
	try
	{
		this._getViewPluginInstance().didBecameHidden();
	}
	catch (err)
	{
		this.logDebug("Missing didBecameHidden method on the plugin instance!");
	}
};
oFF.HuDfViewPluginController.prototype.onPluginContainerDidBecameVisible = function()
{
	try
	{
		this._getViewPluginInstance().didBecameVisible();
	}
	catch (err)
	{
		this.logDebug("Missing didBecameVisible method on the plugin instance!");
	}
};
oFF.HuDfViewPluginController.prototype.onPluginContainerResize = function(offsetWidth, offsetHeight)
{
	try
	{
		this._getViewPluginInstance().onResize(offsetWidth, offsetHeight);
	}
	catch (err)
	{
		this.logDebug("Missing onResize method on the plugin instance!");
	}
};
oFF.HuDfViewPluginController.prototype.setBusy = function(busy)
{
	this._setPluginUiBusy(busy);
};
oFF.HuDfViewPluginController.prototype.setPluginTitle = function(title)
{
	this.m_pluginTitle = title;
};

oFF.HuCommandPluginController = function() {};
oFF.HuCommandPluginController.prototype = new oFF.HuDfHorizonPluginController();
oFF.HuCommandPluginController.prototype._ff_c = "HuCommandPluginController";

oFF.HuCommandPluginController.prototype.m_actionMap = null;
oFF.HuCommandPluginController.prototype._destroySpecificPlugin = function()
{
	this.m_actionMap = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_actionMap);
};
oFF.HuCommandPluginController.prototype._getCommandPluginInstance = function()
{
	try
	{
		return this._getPluginInstance();
	}
	catch (err)
	{
		this._throwInvalidPluginTypeException();
	}
	return null;
};
oFF.HuCommandPluginController.prototype._initSpecificPlugin = function(configuration)
{
	this.m_actionMap = oFF.XHashMapByString.create();
};
oFF.HuCommandPluginController.prototype._postTestNotificationIfNecessary = function(actionName, context, customData)
{
	if (this.isTestModeActive())
	{
		let data = oFF.XNotificationData.create();
		data.putXObject(oFF.HuHorizonInternalNotifications.TEST_ACTION_NOTIFICATION_DATA_KEY_CONTEXT, context);
		data.putXObject(oFF.HuHorizonInternalNotifications.TEST_ACTION_NOTIFICATION_DATA_KEY_CUSTOM_DATA, customData);
		let name = oFF.XStringUtils.concatenate4(oFF.HuHorizonInternalNotifications.TEST_ACTION_NOTIFICATION_PREFIX, this.getCommandSpaceName(), ".", actionName);
		this.getLocalNotificationCenter().postNotificationWithName(name, data);
	}
};
oFF.HuCommandPluginController.prototype._runSpecificPlugin = function()
{
	this._getCommandPluginInstance().registerActions(this);
};
oFF.HuCommandPluginController.prototype._setPluginUiBusy = function(busy) {};
oFF.HuCommandPluginController.prototype._setupSpecificPlugin = function()
{
	return this._getCommandPluginInstance().setupPlugin(this);
};
oFF.HuCommandPluginController.prototype.executeCommandSpaceAction = function(actionName, context, customData)
{
	let tmpFunction = this.m_actionMap.getByKey(actionName);
	if (oFF.notNull(tmpFunction))
	{
		this._postTestNotificationIfNecessary(actionName, context, customData);
		return tmpFunction.apply(context, customData);
	}
	return null;
};
oFF.HuCommandPluginController.prototype.getAllActionNames = function()
{
	return this.m_actionMap.getKeysAsReadOnlyList();
};
oFF.HuCommandPluginController.prototype.getCommandSpaceName = function()
{
	return this.getName();
};
oFF.HuCommandPluginController.prototype.getFreeGenesis = function()
{
	return this.getMainController().getUiController().getFreeGenesis();
};
oFF.HuCommandPluginController.prototype.getPluginType = function()
{
	return oFF.HuPluginType.COMMAND;
};
oFF.HuCommandPluginController.prototype.hasAction = function(actionName)
{
	return this.m_actionMap.containsKey(actionName);
};
oFF.HuCommandPluginController.prototype.registerAction = function(actionName, _function)
{
	this.m_actionMap.put(actionName, oFF.XBiFunctionHolder.create(_function));
};

oFF.HuDfHorizonService = function() {};
oFF.HuDfHorizonService.prototype = new oFF.HuDfMainControllerContext();
oFF.HuDfHorizonService.prototype._ff_c = "HuDfHorizonService";

oFF.HuDfHorizonService.prototype._setupMainControllerContext = function()
{
	this._setupService();
};
oFF.HuDfHorizonService.prototype.getLogContextName = function()
{
	return this._getServiceName();
};
oFF.HuDfHorizonService.prototype.releaseObject = function()
{
	oFF.HuDfMainControllerContext.prototype.releaseObject.call( this );
};

oFF.HuPluginDataStorage = function() {};
oFF.HuPluginDataStorage.prototype = new oFF.HuDfHorizonLogContext();
oFF.HuPluginDataStorage.prototype._ff_c = "HuPluginDataStorage";

oFF.HuPluginDataStorage.AUTO_FLASH_TIMEOUT = 300;
oFF.HuPluginDataStorage.create = function(logger)
{
	let pluginStorage = new oFF.HuPluginDataStorage();
	pluginStorage._setupLogger(logger);
	return pluginStorage;
};
oFF.HuPluginDataStorage.prototype.m_activeTimeoutId = null;
oFF.HuPluginDataStorage.prototype.m_storageFile = null;
oFF.HuPluginDataStorage.prototype.m_structure = null;
oFF.HuPluginDataStorage.prototype._flushDataToDisk = function()
{
	if (oFF.notNull(this.m_storageFile))
	{
		if (oFF.notNull(this.m_activeTimeoutId))
		{
			oFF.XTimeout.clear(this.m_activeTimeoutId);
		}
		this.m_activeTimeoutId = oFF.XTimeout.timeout(oFF.HuPluginDataStorage.AUTO_FLASH_TIMEOUT, () => {
			this.logDebug("Auto flushing data to disk!");
			this.save();
		});
	}
};
oFF.HuPluginDataStorage.prototype.clear = function()
{
	this.m_structure.clear();
	this._flushDataToDisk();
};
oFF.HuPluginDataStorage.prototype.containsKey = function(key)
{
	return this.m_structure.containsKey(key);
};
oFF.HuPluginDataStorage.prototype.getBooleanByKey = function(name)
{
	return this.m_structure.getBooleanByKey(name);
};
oFF.HuPluginDataStorage.prototype.getBooleanByKeyExt = function(name, defaultValue)
{
	return this.m_structure.getBooleanByKeyExt(name, defaultValue);
};
oFF.HuPluginDataStorage.prototype.getByKey = function(key)
{
	return this.m_structure.getByKey(key);
};
oFF.HuPluginDataStorage.prototype.getDoubleByKey = function(name)
{
	return this.m_structure.getDoubleByKey(name);
};
oFF.HuPluginDataStorage.prototype.getDoubleByKeyExt = function(name, defaultValue)
{
	return this.m_structure.getDoubleByKeyExt(name, defaultValue);
};
oFF.HuPluginDataStorage.prototype.getIntegerByKey = function(name)
{
	return this.m_structure.getIntegerByKey(name);
};
oFF.HuPluginDataStorage.prototype.getIntegerByKeyExt = function(name, defaultValue)
{
	return this.m_structure.getIntegerByKeyExt(name, defaultValue);
};
oFF.HuPluginDataStorage.prototype.getKeysAsIterator = function()
{
	return this.m_structure.getKeysAsIterator();
};
oFF.HuPluginDataStorage.prototype.getKeysAsReadOnlyList = function()
{
	return this.m_structure.getKeysAsReadOnlyList();
};
oFF.HuPluginDataStorage.prototype.getListByKey = function(name)
{
	return this.m_structure.getListByKey(name);
};
oFF.HuPluginDataStorage.prototype.getListReadOnlyByKey = function(name)
{
	return this.getListByKey(name);
};
oFF.HuPluginDataStorage.prototype.getLogContextName = function()
{
	return "Plugin Data Storage";
};
oFF.HuPluginDataStorage.prototype.getLongByKey = function(name)
{
	return this.m_structure.getLongByKey(name);
};
oFF.HuPluginDataStorage.prototype.getLongByKeyExt = function(name, defaultValue)
{
	return this.m_structure.getLongByKeyExt(name, defaultValue);
};
oFF.HuPluginDataStorage.prototype.getStringByKey = function(name)
{
	return this.m_structure.getStringByKey(name);
};
oFF.HuPluginDataStorage.prototype.getStringByKeyExt = function(name, defaultValue)
{
	return this.m_structure.getStringByKeyExt(name, defaultValue);
};
oFF.HuPluginDataStorage.prototype.getStructureByKey = function(name)
{
	return this.m_structure.getStructureByKey(name);
};
oFF.HuPluginDataStorage.prototype.getStructureReadOnlyByKey = function(name)
{
	return this.getStructureByKey(name);
};
oFF.HuPluginDataStorage.prototype.hasElements = function()
{
	return this.m_structure.hasElements();
};
oFF.HuPluginDataStorage.prototype.hasNullByKey = function(name)
{
	return this.m_structure.hasNullByKey(name);
};
oFF.HuPluginDataStorage.prototype.initializeStorage = function(storageFile)
{
	this.logDebug("Preparing plugin data storage!");
	this.m_storageFile = storageFile;
	if (oFF.notNull(this.m_storageFile))
	{
		return oFF.XFilePromise.loadJsonStructure(this.m_storageFile).onThenExt((fileJson) => {
			this.logDebug(oFF.XStringUtils.concatenate2("Found  plugin data storage file -> ", this.m_storageFile.getUrl()));
			this.m_structure = fileJson.clone();
			return oFF.XBooleanValue.create(true);
		}).onCatch((err) => {
			this.logDebug("Plugin data storage file not found!");
			this.m_structure = oFF.PrFactory.createStructure();
		});
	}
	this.logDebug("No plugin data storage file found! Data will not be persisted in workspace!");
	this.m_structure = oFF.PrFactory.createStructure();
	return oFF.XPromise.resolve(oFF.XBooleanValue.create(false));
};
oFF.HuPluginDataStorage.prototype.isEmpty = function()
{
	return this.m_structure.isEmpty();
};
oFF.HuPluginDataStorage.prototype.putBoolean = function(key, booleanValue)
{
	this.m_structure.putBoolean(key, booleanValue);
	this._flushDataToDisk();
};
oFF.HuPluginDataStorage.prototype.putDouble = function(name, doubleValue)
{
	this.m_structure.putDouble(name, doubleValue);
	this._flushDataToDisk();
};
oFF.HuPluginDataStorage.prototype.putInteger = function(name, intValue)
{
	this.m_structure.putInteger(name, intValue);
	this._flushDataToDisk();
};
oFF.HuPluginDataStorage.prototype.putList = function(name, list)
{
	this.m_structure.put(name, list);
	this._flushDataToDisk();
};
oFF.HuPluginDataStorage.prototype.putLong = function(name, longValue)
{
	this.m_structure.putLong(name, longValue);
	this._flushDataToDisk();
};
oFF.HuPluginDataStorage.prototype.putNewList = function(name)
{
	let newList = this.m_structure.putNewList(name);
	this._flushDataToDisk();
	return newList;
};
oFF.HuPluginDataStorage.prototype.putNewStructure = function(name)
{
	let newStructure = this.m_structure.putNewStructure(name);
	this._flushDataToDisk();
	return newStructure;
};
oFF.HuPluginDataStorage.prototype.putNull = function(name)
{
	this.m_structure.putNull(name);
	this._flushDataToDisk();
};
oFF.HuPluginDataStorage.prototype.putString = function(name, stringValue)
{
	this.m_structure.putString(name, stringValue);
	this._flushDataToDisk();
};
oFF.HuPluginDataStorage.prototype.putStringNotNull = function(name, stringValue)
{
	this.m_structure.putStringNotNull(name, stringValue);
	this._flushDataToDisk();
};
oFF.HuPluginDataStorage.prototype.putStringNotNullAndNotEmpty = function(name, stringValue)
{
	this.m_structure.putStringNotNullAndNotEmpty(name, stringValue);
	this._flushDataToDisk();
};
oFF.HuPluginDataStorage.prototype.putStructure = function(name, structure)
{
	this.m_structure.put(name, structure);
	this._flushDataToDisk();
};
oFF.HuPluginDataStorage.prototype.releaseObject = function()
{
	this.m_structure = oFF.XObjectExt.release(this.m_structure);
	this.m_storageFile = null;
	oFF.HuDfHorizonLogContext.prototype.releaseObject.call( this );
};
oFF.HuPluginDataStorage.prototype.remove = function(key)
{
	let removedElement = this.m_structure.remove(key);
	this._flushDataToDisk();
	return removedElement;
};
oFF.HuPluginDataStorage.prototype.save = function()
{
	if (oFF.notNull(this.m_activeTimeoutId))
	{
		oFF.XTimeout.clear(this.m_activeTimeoutId);
	}
	if (oFF.notNull(this.m_storageFile))
	{
		return oFF.XFilePromise.saveJson(this.m_storageFile, this.m_structure).onThenExt((savedFile) => {
			this.logDebug("Successfully saved plugin data into storage!");
			return oFF.XBooleanValue.create(true);
		}).onCatch((err) => {
			this.logDebug(oFF.XStringUtils.concatenate2("Failed to save plugin data into storage! Error: ", err.getText()));
		});
	}
	return oFF.XPromise.reject(oFF.XError.create("Cannot persist data! Virtual workspace active!"));
};
oFF.HuPluginDataStorage.prototype.size = function()
{
	return this.m_structure.size();
};

oFF.HuDfSubController = function() {};
oFF.HuDfSubController.prototype = new oFF.HuDfMainControllerContext();
oFF.HuDfSubController.prototype._ff_c = "HuDfSubController";

oFF.HuDfSubController.prototype._setupMainControllerContext = function()
{
	this._setupController();
};
oFF.HuDfSubController.prototype.getCurrentMode = function()
{
	return this.getMainController().getCurrentFrameworkMode();
};
oFF.HuDfSubController.prototype.getDebugUtility = function()
{
	return this.getMainController().getDebugUtility();
};
oFF.HuDfSubController.prototype.getGenesis = function()
{
	return this.getMainController().getGenesis();
};
oFF.HuDfSubController.prototype.getHorizonConfiguration = function()
{
	return this.getMainController().getConfigurationManager().getHorizonConfiguration();
};
oFF.HuDfSubController.prototype.getLogContextName = function()
{
	return this._getControllerName();
};
oFF.HuDfSubController.prototype.getMainGenesis = function()
{
	return this.getMainController().getMainGenesis();
};
oFF.HuDfSubController.prototype.isRunningInDebugEnvironment = function()
{
	return this.getMainController().isRunningInDebugEnvironment();
};
oFF.HuDfSubController.prototype.releaseObject = function()
{
	oFF.HuDfMainControllerContext.prototype.releaseObject.call( this );
};

oFF.HuCarouselLayout = function() {};
oFF.HuCarouselLayout.prototype = new oFF.HuDfHorizonLayout();
oFF.HuCarouselLayout.prototype._ff_c = "HuCarouselLayout";

oFF.HuCarouselLayout.LAYOUT_ARROWS_PLACEMENT = "arrowsPlacement";
oFF.HuCarouselLayout.prototype.m_carousel = null;
oFF.HuCarouselLayout.prototype.m_pluginList = null;
oFF.HuCarouselLayout.prototype._handleBeforePageChanged = function(controlEvent)
{
	this.logDebug("OnBeforePageChanged");
};
oFF.HuCarouselLayout.prototype._handlePageChanged = function(controlChangeEvent)
{
	this.logDebug("OnPageChanged");
	if (oFF.notNull(controlChangeEvent))
	{
		let oldPluginController = oFF.XCollectionUtils.findFirst(this.m_pluginList, (tmpViewPluginControl) => {
			return tmpViewPluginControl.getView() === controlChangeEvent.getOldControl();
		});
		let newPluginController = oFF.XCollectionUtils.findFirst(this.m_pluginList, (tmpViewPluginControl) => {
			return tmpViewPluginControl.getView() === controlChangeEvent.getNewControl();
		});
		this.notifyPluginBecameHidden(oldPluginController);
		this.notifyPluginBecameVisible(newPluginController);
	}
};
oFF.HuCarouselLayout.prototype._setupLayout = function(genesis)
{
	this.m_pluginList = oFF.XList.create();
	let arrowsPlacement = oFF.UiCarouselArrowsPlacement.lookup(this.getLayoutConfigJson().getStringByKey(oFF.HuCarouselLayout.LAYOUT_ARROWS_PLACEMENT));
	if (oFF.isNull(arrowsPlacement))
	{
		arrowsPlacement = oFF.UiCarouselArrowsPlacement.PAGE_INDICATOR;
	}
	this.m_carousel = this.getGenesis().newControl(oFF.UiType.CAROUSEL);
	this.m_carousel.useMaxSpace();
	this.m_carousel.setCarouselArrowsPlacement(arrowsPlacement);
	this.m_carousel.registerOnBeforePageChanged(oFF.UiLambdaBeforePageChangedListener.create(this._handleBeforePageChanged.bind(this)));
	this.m_carousel.registerOnPageChanged(oFF.UiLambdaPageChangedListener.create(this._handlePageChanged.bind(this)));
};
oFF.HuCarouselLayout.prototype.addPluginView = function(viewPluginController)
{
	if (oFF.notNull(viewPluginController) && !this.m_pluginList.contains(viewPluginController))
	{
		this.m_carousel.addItem(viewPluginController.getView());
		this.m_pluginList.add(viewPluginController);
	}
};
oFF.HuCarouselLayout.prototype.getLayoutType = function()
{
	return oFF.HuLayoutType.CAROUSEL;
};
oFF.HuCarouselLayout.prototype.getView = function()
{
	return this.m_carousel;
};
oFF.HuCarouselLayout.prototype.isPluginVisible = function(viewPluginController)
{
	if (oFF.notNull(viewPluginController))
	{
		return viewPluginController.getView() === this.m_carousel.getActivePage();
	}
	return false;
};
oFF.HuCarouselLayout.prototype.releaseObject = function()
{
	this.m_pluginList.clear();
	this.m_pluginList = oFF.XObjectExt.release(this.m_pluginList);
	this.m_carousel = oFF.XObjectExt.release(this.m_carousel);
	oFF.HuDfHorizonLayout.prototype.releaseObject.call( this );
};
oFF.HuCarouselLayout.prototype.removePluginView = function(viewPluginController)
{
	if (oFF.notNull(viewPluginController) && this.m_pluginList.contains(viewPluginController))
	{
		this.m_carousel.removeItem(viewPluginController.getView());
		this.m_pluginList.removeElement(viewPluginController);
	}
};

oFF.HuFlexLayout = function() {};
oFF.HuFlexLayout.prototype = new oFF.HuDfHorizonLayout();
oFF.HuFlexLayout.prototype._ff_c = "HuFlexLayout";

oFF.HuFlexLayout.ITEM_HEIGHT = "height";
oFF.HuFlexLayout.ITEM_SIZE = "size";
oFF.HuFlexLayout.ITEM_WIDTH = "width";
oFF.HuFlexLayout.LAYOUT_DIRECTION = "direction";
oFF.HuFlexLayout.MIN_ITEM_SIZE = "50px";
oFF.HuFlexLayout.prototype.m_flexLayout = null;
oFF.HuFlexLayout.prototype.m_pluginList = null;
oFF.HuFlexLayout.prototype._configurePluginView = function(pluginView, containerStructure)
{
	if (oFF.notNull(pluginView) && oFF.notNull(containerStructure) && containerStructure.hasElements())
	{
		pluginView.setMinWidth(oFF.UiCssLength.create(oFF.HuFlexLayout.MIN_ITEM_SIZE));
		pluginView.setMinHeight(oFF.UiCssLength.create(oFF.HuFlexLayout.MIN_ITEM_SIZE));
		let itemSize = this._getItemSizeFromItemStruct(containerStructure);
		if (oFF.notNull(itemSize))
		{
			if ((this.m_flexLayout.getDirection() === oFF.UiFlexDirection.ROW || this.m_flexLayout.getDirection() === oFF.UiFlexDirection.ROW_REVERSE) && itemSize.getWidth() !== null)
			{
				pluginView.setWidth(itemSize.getWidth());
			}
			else if ((this.m_flexLayout.getDirection() === oFF.UiFlexDirection.COLUMN || this.m_flexLayout.getDirection() === oFF.UiFlexDirection.COLUMN_REVERSE) && itemSize.getHeight() !== null)
			{
				pluginView.setHeight(itemSize.getHeight());
			}
		}
	}
};
oFF.HuFlexLayout.prototype._getItemSizeFromItemStruct = function(containerStructure)
{
	let tmpSize = oFF.UiSize.createEmpty();
	if (containerStructure.containsKey(oFF.HuFlexLayout.ITEM_SIZE))
	{
		let sizeCss = containerStructure.getStringByKey(oFF.HuFlexLayout.ITEM_SIZE);
		tmpSize.setByCss(sizeCss, sizeCss);
	}
	else
	{
		let widthCss = containerStructure.getStringByKey(oFF.HuFlexLayout.ITEM_WIDTH);
		let heightCss = containerStructure.getStringByKey(oFF.HuFlexLayout.ITEM_HEIGHT);
		tmpSize.setByCss(widthCss, heightCss);
	}
	return tmpSize;
};
oFF.HuFlexLayout.prototype._setupLayout = function(genesis)
{
	this.m_pluginList = oFF.XList.create();
	let direction = oFF.UiFlexDirection.lookup(this.getLayoutConfigJson().getStringByKey(oFF.HuFlexLayout.LAYOUT_DIRECTION));
	this.m_flexLayout = this.getGenesis().newControl(oFF.UiType.FLEX_LAYOUT);
	this.m_flexLayout.useMaxSpace();
	this.m_flexLayout.setWrap(oFF.UiFlexWrap.NO_WRAP);
	if (oFF.notNull(direction))
	{
		this.m_flexLayout.setDirection(direction);
	}
};
oFF.HuFlexLayout.prototype.addPluginView = function(viewPluginController)
{
	if (oFF.notNull(viewPluginController) && !this.m_pluginList.contains(viewPluginController))
	{
		let pluginView = viewPluginController.getView();
		this._configurePluginView(pluginView, viewPluginController.getPluginStartupInfo().getContainerStructure());
		this.m_flexLayout.addItem(pluginView);
		this.m_pluginList.add(viewPluginController);
	}
};
oFF.HuFlexLayout.prototype.getLayoutType = function()
{
	return oFF.HuLayoutType.FLEX;
};
oFF.HuFlexLayout.prototype.getView = function()
{
	return this.m_flexLayout;
};
oFF.HuFlexLayout.prototype.isPluginVisible = function(viewPluginController)
{
	if (oFF.notNull(viewPluginController))
	{
		return this.m_pluginList.contains(viewPluginController);
	}
	return false;
};
oFF.HuFlexLayout.prototype.releaseObject = function()
{
	this.m_flexLayout = oFF.XObjectExt.release(this.m_flexLayout);
	this.m_pluginList = oFF.XObjectExt.release(this.m_pluginList);
	oFF.HuDfHorizonLayout.prototype.releaseObject.call( this );
};
oFF.HuFlexLayout.prototype.removePluginView = function(viewPluginController)
{
	if (oFF.notNull(viewPluginController) && this.m_pluginList.contains(viewPluginController))
	{
		this.m_flexLayout.removeItem(viewPluginController.getView());
		this.m_pluginList.removeElement(viewPluginController);
	}
};

oFF.HuGridLayout = function() {};
oFF.HuGridLayout.prototype = new oFF.HuDfHorizonLayout();
oFF.HuGridLayout.prototype._ff_c = "HuGridLayout";

oFF.HuGridLayout.ITEM_COLUMNS = "columns";
oFF.HuGridLayout.ITEM_DEFAULT_COLUMNS = 5;
oFF.HuGridLayout.ITEM_DEFAULT_MIN_ROWS = 4;
oFF.HuGridLayout.ITEM_MIN_ROWS = "minRows";
oFF.HuGridLayout.ITEM_ROWS = "rows";
oFF.HuGridLayout.LAYOUT_ALLOW_PLUGIN_DRAG_AND_DROP = "allowPluginDragAndDrop";
oFF.HuGridLayout.LAYOUT_COLUMN_SIZE = "columnSize";
oFF.HuGridLayout.LAYOUT_DEFAULT_GAP = "0.5rem";
oFF.HuGridLayout.LAYOUT_DEFAULT_MAX_COLUMN_SIZE = "80px";
oFF.HuGridLayout.LAYOUT_DEFAULT_MIN_COLUMN_SIZE = "40px";
oFF.HuGridLayout.LAYOUT_DEFAULT_ROW_SIZE = "80px";
oFF.HuGridLayout.LAYOUT_GAP = "gap";
oFF.HuGridLayout.LAYOUT_MAX_COLUMN_SIZE = "maxColumnSize";
oFF.HuGridLayout.LAYOUT_MIN_COLUMN_SIZE = "minColumnSize";
oFF.HuGridLayout.LAYOUT_ROW_SIZE = "rowSize";
oFF.HuGridLayout.prototype.m_gridContainer = null;
oFF.HuGridLayout.prototype.m_pluginList = null;
oFF.HuGridLayout.prototype._configurePluginView = function(pluginView, containerStructure)
{
	if (oFF.notNull(pluginView) && oFF.notNull(containerStructure) && containerStructure.hasElements())
	{
		if (this._isDragAndDropEnabled())
		{
			pluginView.setDraggable(true);
		}
		let layoutData = oFF.UiLayoutData.createGridContainerItem();
		layoutData.setGridContainerItemColumns(containerStructure.getIntegerByKeyExt(oFF.HuGridLayout.ITEM_COLUMNS, oFF.HuGridLayout.ITEM_DEFAULT_COLUMNS));
		layoutData.setGridContainerItemMinRows(containerStructure.getIntegerByKeyExt(oFF.HuGridLayout.ITEM_MIN_ROWS, oFF.HuGridLayout.ITEM_DEFAULT_MIN_ROWS));
		if (containerStructure.containsKey(oFF.HuGridLayout.ITEM_ROWS))
		{
			layoutData.setGridContainerItemRows(containerStructure.getIntegerByKey(oFF.HuGridLayout.ITEM_ROWS));
		}
		pluginView.setLayoutData(layoutData);
	}
};
oFF.HuGridLayout.prototype._handleDrop = function(dropEvent)
{
	let dragPosition = this.m_gridContainer.getIndexOfItem(dropEvent.getDraggedControl());
	let dropPosition = this.m_gridContainer.getIndexOfItem(dropEvent.getDroppedControl());
	this.m_gridContainer.removeItem(dropEvent.getDraggedControl());
	if (dragPosition < dropPosition)
	{
		dragPosition--;
	}
	if (dropEvent.getRelativeDropPosition() === oFF.UiRelativeDropPosition.AFTER)
	{
		dropPosition++;
	}
	this.m_gridContainer.insertItem(dropEvent.getDraggedControl(), dropPosition);
	this.m_gridContainer.focusIndex(dropPosition);
};
oFF.HuGridLayout.prototype._isDragAndDropEnabled = function()
{
	return this.getLayoutConfigJson().getBooleanByKeyExt(oFF.HuGridLayout.LAYOUT_ALLOW_PLUGIN_DRAG_AND_DROP, false);
};
oFF.HuGridLayout.prototype._setupLayout = function(genesis)
{
	this.m_pluginList = oFF.XList.create();
	let gridSettings = oFF.UiGridContainerSettings.create();
	if (this.getLayoutConfigJson().containsKey(oFF.HuGridLayout.LAYOUT_COLUMN_SIZE))
	{
		gridSettings.setColumnSize(oFF.UiCssLength.create(this.getLayoutConfigJson().getStringByKey(oFF.HuGridLayout.LAYOUT_COLUMN_SIZE)));
	}
	gridSettings.setRowSize(oFF.UiCssLength.create(this.getLayoutConfigJson().getStringByKeyExt(oFF.HuGridLayout.LAYOUT_ROW_SIZE, oFF.HuGridLayout.LAYOUT_DEFAULT_ROW_SIZE)));
	gridSettings.setMinColumnSize(oFF.UiCssLength.create(this.getLayoutConfigJson().getStringByKeyExt(oFF.HuGridLayout.LAYOUT_MIN_COLUMN_SIZE, oFF.HuGridLayout.LAYOUT_DEFAULT_MIN_COLUMN_SIZE)));
	gridSettings.setMaxColumnSize(oFF.UiCssLength.create(this.getLayoutConfigJson().getStringByKeyExt(oFF.HuGridLayout.LAYOUT_MAX_COLUMN_SIZE, oFF.HuGridLayout.LAYOUT_DEFAULT_MAX_COLUMN_SIZE)));
	gridSettings.setGap(oFF.UiCssLength.create(this.getLayoutConfigJson().getStringByKeyExt(oFF.HuGridLayout.LAYOUT_GAP, oFF.HuGridLayout.LAYOUT_DEFAULT_GAP)));
	this.m_gridContainer = this.getGenesis().newControl(oFF.UiType.GRID_CONTAINER);
	this.m_gridContainer.useMaxSpace();
	this.m_gridContainer.setOverflow(oFF.UiOverflow.AUTO);
	this.m_gridContainer.setGridContainerSettings(gridSettings);
	if (this._isDragAndDropEnabled())
	{
		this.m_gridContainer.setDropInfo(oFF.UiDropInfo.create(oFF.UiDropPosition.BETWEEN, null, oFF.UiDropLayout.HORIZONTAL, oFF.UiAggregation.ITEMS));
		this.m_gridContainer.registerOnDrop(oFF.UiLambdaDropListener.create(this._handleDrop.bind(this)));
	}
};
oFF.HuGridLayout.prototype.addPluginView = function(viewPluginController)
{
	if (oFF.notNull(viewPluginController) && !this.m_pluginList.contains(viewPluginController))
	{
		let pluginView = viewPluginController.getView();
		this._configurePluginView(pluginView, viewPluginController.getPluginStartupInfo().getContainerStructure());
		this.m_gridContainer.addItem(pluginView);
		this.m_pluginList.add(viewPluginController);
	}
};
oFF.HuGridLayout.prototype.getLayoutType = function()
{
	return oFF.HuLayoutType.GRID;
};
oFF.HuGridLayout.prototype.getView = function()
{
	return this.m_gridContainer;
};
oFF.HuGridLayout.prototype.isPluginVisible = function(viewPluginController)
{
	if (oFF.notNull(viewPluginController))
	{
		return this.m_pluginList.contains(viewPluginController);
	}
	return false;
};
oFF.HuGridLayout.prototype.releaseObject = function()
{
	this.m_gridContainer = oFF.XObjectExt.release(this.m_gridContainer);
	this.m_pluginList = oFF.XObjectExt.release(this.m_pluginList);
	oFF.HuDfHorizonLayout.prototype.releaseObject.call( this );
};
oFF.HuGridLayout.prototype.removePluginView = function(viewPluginController)
{
	if (oFF.notNull(viewPluginController) && this.m_pluginList.contains(viewPluginController))
	{
		this.m_gridContainer.removeItem(viewPluginController.getView());
		this.m_pluginList.removeElement(viewPluginController);
	}
};

oFF.HuInteractiveSplitterLayout = function() {};
oFF.HuInteractiveSplitterLayout.prototype = new oFF.HuDfHorizonLayout();
oFF.HuInteractiveSplitterLayout.prototype._ff_c = "HuInteractiveSplitterLayout";

oFF.HuInteractiveSplitterLayout.ITEM_HEIGHT = "height";
oFF.HuInteractiveSplitterLayout.ITEM_SIZE = "size";
oFF.HuInteractiveSplitterLayout.ITEM_WIDTH = "width";
oFF.HuInteractiveSplitterLayout.LAYOUT_ALLOW_PLUGIN_REORDERING = "allowPluginReordering";
oFF.HuInteractiveSplitterLayout.LAYOUT_ORIENTATION = "orientation";
oFF.HuInteractiveSplitterLayout.MIN_ITEM_WIDTH = "50px";
oFF.HuInteractiveSplitterLayout.prototype.m_mainInteractiveSplitter = null;
oFF.HuInteractiveSplitterLayout.prototype.m_splitterItemMap = null;
oFF.HuInteractiveSplitterLayout.prototype._configurePluginWrapper = function(splitterItem, containerStructure)
{
	if (oFF.notNull(splitterItem) && oFF.notNull(containerStructure) && containerStructure.hasElements())
	{
		let itemSize = this._getItemSizeFromItemStruct(containerStructure);
		if (oFF.notNull(itemSize))
		{
			if (this.m_mainInteractiveSplitter.getOrientation() === oFF.UiOrientation.HORIZONTAL && itemSize.getWidth() !== null)
			{
				splitterItem.setWidth(itemSize.getWidth());
			}
			else if (this.m_mainInteractiveSplitter.getOrientation() === oFF.UiOrientation.VERTICAL && itemSize.getHeight() !== null)
			{
				splitterItem.setHeight(itemSize.getHeight());
			}
		}
	}
};
oFF.HuInteractiveSplitterLayout.prototype._createAndAddViewPluginWrapper = function(viewPluginController)
{
	if (oFF.notNull(viewPluginController))
	{
		let splitterItem = this.m_mainInteractiveSplitter.newItem();
		splitterItem.setContent(viewPluginController.getPluginWrapperView());
		splitterItem.setMinWidth(oFF.UiCssLength.create(oFF.HuInteractiveSplitterLayout.MIN_ITEM_WIDTH));
		splitterItem.registerOnResize(oFF.UiLambdaResizeListener.create((resizeEvent) => {
			viewPluginController.onPluginContainerResize(resizeEvent.getOffsetWidth(), resizeEvent.getOffsetHeight());
		}));
		this._configurePluginWrapper(splitterItem, viewPluginController.getPluginStartupInfo().getContainerStructure());
		this.m_mainInteractiveSplitter.addItem(splitterItem);
		return splitterItem;
	}
	return null;
};
oFF.HuInteractiveSplitterLayout.prototype._getItemSizeFromItemStruct = function(containerStructure)
{
	let tmpSize = oFF.UiSize.createEmpty();
	if (containerStructure.containsKey(oFF.HuInteractiveSplitterLayout.ITEM_SIZE))
	{
		let sizeCss = containerStructure.getStringByKey(oFF.HuInteractiveSplitterLayout.ITEM_SIZE);
		tmpSize.setByCss(sizeCss, sizeCss);
	}
	else
	{
		let widthCss = containerStructure.getStringByKey(oFF.HuInteractiveSplitterLayout.ITEM_WIDTH);
		let heightCss = containerStructure.getStringByKey(oFF.HuInteractiveSplitterLayout.ITEM_HEIGHT);
		tmpSize.setByCss(widthCss, heightCss);
	}
	return tmpSize;
};
oFF.HuInteractiveSplitterLayout.prototype._setupLayout = function(genesis)
{
	this.m_splitterItemMap = oFF.XHashMapByString.create();
	let orientation = oFF.UiOrientation.lookup(this.getLayoutConfigJson().getStringByKey(oFF.HuInteractiveSplitterLayout.LAYOUT_ORIENTATION));
	let isViewReorderingAllowed = this.getLayoutConfigJson().getBooleanByKeyExt(oFF.HuInteractiveSplitterLayout.LAYOUT_ALLOW_PLUGIN_REORDERING, false);
	this.m_mainInteractiveSplitter = this.getGenesis().newControl(oFF.UiType.INTERACTIVE_SPLITTER);
	this.m_mainInteractiveSplitter.setOrientation(oFF.UiOrientation.HORIZONTAL);
	this.m_mainInteractiveSplitter.setEnableReordering(isViewReorderingAllowed);
	this.m_mainInteractiveSplitter.useMaxSpace();
	if (oFF.notNull(orientation))
	{
		this.m_mainInteractiveSplitter.setOrientation(orientation);
	}
};
oFF.HuInteractiveSplitterLayout.prototype.addPluginView = function(viewPluginController)
{
	if (oFF.notNull(viewPluginController) && !this.m_splitterItemMap.containsKey(viewPluginController.getUuid()))
	{
		let splitterItem = this._createAndAddViewPluginWrapper(viewPluginController);
		this.m_splitterItemMap.put(viewPluginController.getUuid(), splitterItem);
	}
};
oFF.HuInteractiveSplitterLayout.prototype.getLayoutType = function()
{
	return oFF.HuLayoutType.INTERACTIVE_SPLITTER;
};
oFF.HuInteractiveSplitterLayout.prototype.getView = function()
{
	return this.m_mainInteractiveSplitter;
};
oFF.HuInteractiveSplitterLayout.prototype.isPluginVisible = function(viewPluginController)
{
	if (oFF.notNull(viewPluginController))
	{
		return this.m_splitterItemMap.containsKey(viewPluginController.getUuid());
	}
	return false;
};
oFF.HuInteractiveSplitterLayout.prototype.releaseObject = function()
{
	this.m_mainInteractiveSplitter = oFF.XObjectExt.release(this.m_mainInteractiveSplitter);
	this.m_splitterItemMap = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_splitterItemMap);
	oFF.HuDfHorizonLayout.prototype.releaseObject.call( this );
};
oFF.HuInteractiveSplitterLayout.prototype.removePluginView = function(viewPluginController)
{
	if (oFF.notNull(viewPluginController))
	{
		let tmpSplitterItem = this.m_splitterItemMap.remove(viewPluginController.getUuid());
		if (oFF.notNull(tmpSplitterItem))
		{
			this.m_mainInteractiveSplitter.removeItem(tmpSplitterItem);
			tmpSplitterItem.setContent(null);
			oFF.XObjectExt.release(tmpSplitterItem);
		}
	}
};

oFF.HuSinglePluginLayout = function() {};
oFF.HuSinglePluginLayout.prototype = new oFF.HuDfHorizonLayout();
oFF.HuSinglePluginLayout.prototype._ff_c = "HuSinglePluginLayout";

oFF.HuSinglePluginLayout.prototype.m_activePluginUuid = null;
oFF.HuSinglePluginLayout.prototype.m_mainContentWrapper = null;
oFF.HuSinglePluginLayout.prototype._setupLayout = function(genesis)
{
	this.m_mainContentWrapper = this.getGenesis().newControl(oFF.UiType.CONTENT_WRAPPER);
	this.m_mainContentWrapper.useMaxSpace();
};
oFF.HuSinglePluginLayout.prototype.addPluginView = function(viewPluginController)
{
	if (oFF.notNull(viewPluginController) && oFF.isNull(this.m_activePluginUuid))
	{
		this.m_mainContentWrapper.setContent(viewPluginController.getPluginWrapperView());
		this.m_activePluginUuid = viewPluginController.getUuid();
	}
};
oFF.HuSinglePluginLayout.prototype.getLayoutType = function()
{
	return oFF.HuLayoutType.SINGLE_PLUGIN;
};
oFF.HuSinglePluginLayout.prototype.getView = function()
{
	return this.m_mainContentWrapper;
};
oFF.HuSinglePluginLayout.prototype.isPluginVisible = function(viewPluginController)
{
	if (oFF.notNull(viewPluginController))
	{
		return oFF.XString.isEqual(this.m_activePluginUuid, viewPluginController.getUuid());
	}
	return false;
};
oFF.HuSinglePluginLayout.prototype.releaseObject = function()
{
	this.m_mainContentWrapper = oFF.XObjectExt.release(this.m_mainContentWrapper);
	this.m_activePluginUuid = null;
	oFF.HuDfHorizonLayout.prototype.releaseObject.call( this );
};
oFF.HuSinglePluginLayout.prototype.removePluginView = function(viewPluginController)
{
	if (oFF.notNull(viewPluginController) && this.isPluginVisible(viewPluginController))
	{
		this.m_mainContentWrapper.setContent(null);
		this.m_activePluginUuid = null;
	}
};

oFF.HuTabBarLayout = function() {};
oFF.HuTabBarLayout.prototype = new oFF.HuDfHorizonLayout();
oFF.HuTabBarLayout.prototype._ff_c = "HuTabBarLayout";

oFF.HuTabBarLayout.ITEM_TITLE = "title";
oFF.HuTabBarLayout.LAYOUT_ALLOW_TAB_CLOSING = "allowTabClosing";
oFF.HuTabBarLayout.prototype.m_pluginList = null;
oFF.HuTabBarLayout.prototype.m_selectedTabBarItem = null;
oFF.HuTabBarLayout.prototype.m_tabBar = null;
oFF.HuTabBarLayout.prototype.m_tabBarItemMap = null;
oFF.HuTabBarLayout.prototype._createAndAddViewPluginWrapper = function(viewPluginController)
{
	if (oFF.notNull(viewPluginController))
	{
		let tabBarItem = this.m_tabBar.newItem();
		tabBarItem.setText(this._getTabBarItemText(viewPluginController));
		tabBarItem.setContent(viewPluginController.getPluginWrapperView());
		tabBarItem.setShowCloseButton(this.getLayoutConfigJson().getBooleanByKeyExt(oFF.HuTabBarLayout.LAYOUT_ALLOW_TAB_CLOSING, false));
		this.m_tabBar.addItem(tabBarItem);
		return tabBarItem;
	}
	return null;
};
oFF.HuTabBarLayout.prototype._getTabBarItemText = function(viewPluginController)
{
	let tabBarText = null;
	if (oFF.notNull(viewPluginController))
	{
		tabBarText = viewPluginController.getPluginTitle();
		if (oFF.XStringUtils.isNullOrEmpty(tabBarText))
		{
			let containerConfigStruct = viewPluginController.getPluginStartupInfo().getContainerStructure();
			if (oFF.notNull(containerConfigStruct))
			{
				tabBarText = containerConfigStruct.getStringByKey(oFF.HuTabBarLayout.ITEM_TITLE);
			}
			if (oFF.XStringUtils.isNullOrEmpty(tabBarText))
			{
				tabBarText = viewPluginController.getName();
			}
		}
	}
	return tabBarText;
};
oFF.HuTabBarLayout.prototype._handleItemClose = function(itemEvent)
{
	this.logDebug("OnItemClose");
	if (oFF.notNull(itemEvent))
	{
		let closedPluginController = oFF.XCollectionUtils.findFirst(this.m_pluginList, (tmpViewPluginControl) => {
			return this.m_tabBarItemMap.getByKey(tmpViewPluginControl.getUuid()) === itemEvent.getAffectedItem();
		});
		if (oFF.notNull(closedPluginController))
		{
			if (this.m_selectedTabBarItem === itemEvent.getAffectedItem())
			{
				this.m_selectedTabBarItem = null;
			}
			this.logDebug(oFF.XStringUtils.concatenate2("Tab Item closed! Killing plugin with id: ", closedPluginController.getUuid()));
			this.removePluginView(closedPluginController);
			closedPluginController.kill();
		}
	}
};
oFF.HuTabBarLayout.prototype._handleItemSelect = function(itemEvent)
{
	this.logDebug("OnItemSelect");
	if (oFF.notNull(itemEvent))
	{
		if (this.m_selectedTabBarItem === itemEvent.getAffectedItem())
		{
			this.logDebug("Item already selected! Skipping!");
			return;
		}
		let oldPluginController = oFF.XCollectionUtils.findFirst(this.m_pluginList, (tmpViewPluginControl) => {
			return this.m_tabBarItemMap.getByKey(tmpViewPluginControl.getUuid()) === this.m_selectedTabBarItem;
		});
		let newPluginController = oFF.XCollectionUtils.findFirst(this.m_pluginList, (tmpViewPluginControl) => {
			return this.m_tabBarItemMap.getByKey(tmpViewPluginControl.getUuid()) === itemEvent.getAffectedItem();
		});
		this.notifyPluginBecameHidden(oldPluginController);
		this.notifyPluginBecameVisible(newPluginController);
		this.m_selectedTabBarItem = itemEvent.getAffectedItem();
	}
};
oFF.HuTabBarLayout.prototype._setupLayout = function(genesis)
{
	this.m_pluginList = oFF.XList.create();
	this.m_tabBarItemMap = oFF.XHashMapByString.create();
	this.m_tabBar = this.getGenesis().newControl(oFF.UiType.TAB_BAR);
	this.m_tabBar.useMaxSpace();
	this.m_tabBar.registerOnItemSelect(oFF.UiLambdaItemSelectListener.create(this._handleItemSelect.bind(this)));
	this.m_tabBar.registerOnItemClose(oFF.UiLambdaItemCloseListener.create(this._handleItemClose.bind(this)));
};
oFF.HuTabBarLayout.prototype.addPluginView = function(viewPluginController)
{
	if (oFF.notNull(viewPluginController) && !this.m_tabBarItemMap.containsKey(viewPluginController.getUuid()))
	{
		let tabBarItem = this._createAndAddViewPluginWrapper(viewPluginController);
		this.m_tabBarItemMap.put(viewPluginController.getUuid(), tabBarItem);
		this.m_pluginList.add(viewPluginController);
		if (oFF.isNull(this.m_selectedTabBarItem))
		{
			this.m_selectedTabBarItem = tabBarItem;
		}
	}
};
oFF.HuTabBarLayout.prototype.getLayoutType = function()
{
	return oFF.HuLayoutType.TAB_BAR;
};
oFF.HuTabBarLayout.prototype.getView = function()
{
	return this.m_tabBar;
};
oFF.HuTabBarLayout.prototype.isPluginVisible = function(viewPluginController)
{
	if (oFF.notNull(viewPluginController))
	{
		return viewPluginController.getView() === this.m_tabBar.getSelectedItem();
	}
	return false;
};
oFF.HuTabBarLayout.prototype.releaseObject = function()
{
	this.m_pluginList.clear();
	this.m_pluginList = oFF.XObjectExt.release(this.m_pluginList);
	this.m_tabBar = oFF.XObjectExt.release(this.m_tabBar);
	this.m_tabBarItemMap = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_tabBarItemMap);
	oFF.HuDfHorizonLayout.prototype.releaseObject.call( this );
};
oFF.HuTabBarLayout.prototype.removePluginView = function(viewPluginController)
{
	if (oFF.notNull(viewPluginController))
	{
		let tmpTabBarItem = this.m_tabBarItemMap.remove(viewPluginController.getUuid());
		if (oFF.notNull(tmpTabBarItem))
		{
			this.m_tabBar.removeItem(tmpTabBarItem);
			tmpTabBarItem.setContent(null);
			oFF.XObjectExt.release(tmpTabBarItem);
			this.m_pluginList.removeElement(viewPluginController);
		}
	}
};

oFF.HuHorizonConfigurationManager = function() {};
oFF.HuHorizonConfigurationManager.prototype = new oFF.HuDfHorizonManager();
oFF.HuHorizonConfigurationManager.prototype._ff_c = "HuHorizonConfigurationManager";

oFF.HuHorizonConfigurationManager.COMMANDS_SECTION = "commands";
oFF.HuHorizonConfigurationManager.CONFIGIGURATION_SECTION = "configuration";
oFF.HuHorizonConfigurationManager.LAYOUT_SECTION = "layout";
oFF.HuHorizonConfigurationManager.PLUGINS_SECTION = "plugins";
oFF.HuHorizonConfigurationManager.TOOLBAR_SECTION = "toolbar";
oFF.HuHorizonConfigurationManager.create = function(genericController, configStruct)
{
	let newInstance = new oFF.HuHorizonConfigurationManager();
	newInstance._setupWithGenericController(genericController);
	newInstance._processConfigurationJson(configStruct);
	return newInstance;
};
oFF.HuHorizonConfigurationManager.prototype.m_configurationJson = null;
oFF.HuHorizonConfigurationManager.prototype.m_horizonConfiguration = null;
oFF.HuHorizonConfigurationManager.prototype.m_isConfigValid = false;
oFF.HuHorizonConfigurationManager.prototype.m_layoutConfiguration = null;
oFF.HuHorizonConfigurationManager.prototype.m_pluginConfiguration = null;
oFF.HuHorizonConfigurationManager.prototype.m_toolbarConfiguration = null;
oFF.HuHorizonConfigurationManager.prototype._createConfigSectionsIfNeeded = function()
{
	if (!this.m_configurationJson.containsKey(oFF.HuHorizonConfigurationManager.CONFIGIGURATION_SECTION))
	{
		this.m_configurationJson.putNewStructure(oFF.HuHorizonConfigurationManager.CONFIGIGURATION_SECTION);
	}
	if (!this.m_configurationJson.containsKey(oFF.HuHorizonConfigurationManager.PLUGINS_SECTION))
	{
		this.m_configurationJson.putNewList(oFF.HuHorizonConfigurationManager.PLUGINS_SECTION);
	}
	if (!this.m_configurationJson.containsKey(oFF.HuHorizonConfigurationManager.COMMANDS_SECTION))
	{
		this.m_configurationJson.putNewList(oFF.HuHorizonConfigurationManager.COMMANDS_SECTION);
	}
	if (!this.m_configurationJson.containsKey(oFF.HuHorizonConfigurationManager.TOOLBAR_SECTION))
	{
		this.m_configurationJson.putNewList(oFF.HuHorizonConfigurationManager.TOOLBAR_SECTION);
	}
	if (!this.m_configurationJson.containsKey(oFF.HuHorizonConfigurationManager.LAYOUT_SECTION))
	{
		this.m_configurationJson.putNewStructure(oFF.HuHorizonConfigurationManager.LAYOUT_SECTION);
	}
};
oFF.HuHorizonConfigurationManager.prototype._getCommandsSection = function()
{
	return this.getConfigurationJson().getByKey(oFF.HuHorizonConfigurationManager.COMMANDS_SECTION);
};
oFF.HuHorizonConfigurationManager.prototype._getConfigurationSection = function()
{
	return this.getConfigurationJson().getStructureByKey(oFF.HuHorizonConfigurationManager.CONFIGIGURATION_SECTION);
};
oFF.HuHorizonConfigurationManager.prototype._getLayoutSection = function()
{
	return this.getConfigurationJson().getByKey(oFF.HuHorizonConfigurationManager.LAYOUT_SECTION);
};
oFF.HuHorizonConfigurationManager.prototype._getManagerName = function()
{
	return "Config Manager";
};
oFF.HuHorizonConfigurationManager.prototype._getPluginsSection = function()
{
	return this.getConfigurationJson().getByKey(oFF.HuHorizonConfigurationManager.PLUGINS_SECTION);
};
oFF.HuHorizonConfigurationManager.prototype._getToolbarSection = function()
{
	return this.getConfigurationJson().getByKey(oFF.HuHorizonConfigurationManager.TOOLBAR_SECTION);
};
oFF.HuHorizonConfigurationManager.prototype._processConfigurationJson = function(configStruct)
{
	if (oFF.isNull(configStruct))
	{
		this.m_configurationJson = oFF.PrFactory.createStructure();
		this.m_isConfigValid = true;
		this._setupEmptyConfig();
	}
	else
	{
		this.m_configurationJson = configStruct.clone();
		this.m_isConfigValid = this._validateExistingConfig();
		this._createConfigSectionsIfNeeded();
	}
	let tmpHorizonConfigurationProcessor = oFF.HuHorizonConfigurationProcessor.create(this);
	tmpHorizonConfigurationProcessor.processJsonElement(this._getConfigurationSection());
	this.m_horizonConfiguration = tmpHorizonConfigurationProcessor;
	let tmpPluginsConfigurationProcessor = oFF.HuPluginsConfigurationProcessor.create(this);
	tmpPluginsConfigurationProcessor.processJsonElement(this._getPluginsSection());
	tmpPluginsConfigurationProcessor.processJsonElement(this._getCommandsSection());
	this.m_pluginConfiguration = tmpPluginsConfigurationProcessor;
	let tmpToolbarConfigurationProcessor = oFF.HuToolbarConfigurationProcessor.create(this);
	tmpToolbarConfigurationProcessor.processJsonElement(this._getToolbarSection());
	this.m_toolbarConfiguration = tmpToolbarConfigurationProcessor;
	let tmpLayoutConfigurationProcessor = oFF.HuLayoutConfigurationProcessor.create(this);
	tmpLayoutConfigurationProcessor.processJsonElement(this._getLayoutSection());
	this.m_layoutConfiguration = tmpLayoutConfigurationProcessor;
};
oFF.HuHorizonConfigurationManager.prototype._setupEmptyConfig = function()
{
	this._createConfigSectionsIfNeeded();
};
oFF.HuHorizonConfigurationManager.prototype._setupManager = function() {};
oFF.HuHorizonConfigurationManager.prototype._validateExistingConfig = function()
{
	if (!this.m_configurationJson.containsKey(oFF.HuHorizonConfigurationManager.CONFIGIGURATION_SECTION))
	{
		return false;
	}
	if (!this.m_configurationJson.containsKey(oFF.HuHorizonConfigurationManager.PLUGINS_SECTION))
	{
		return false;
	}
	return true;
};
oFF.HuHorizonConfigurationManager.prototype.getConfigurationJson = function()
{
	return this.m_configurationJson;
};
oFF.HuHorizonConfigurationManager.prototype.getHorizonConfiguration = function()
{
	return this.m_horizonConfiguration;
};
oFF.HuHorizonConfigurationManager.prototype.getLayoutConfiguration = function()
{
	return this.m_layoutConfiguration;
};
oFF.HuHorizonConfigurationManager.prototype.getPluginsConfiguration = function()
{
	return this.m_pluginConfiguration;
};
oFF.HuHorizonConfigurationManager.prototype.getSaveContent = function()
{
	let jsonString = oFF.PrUtils.serialize(this.getConfigurationJson(), false, true, 2);
	return oFF.XContent.createStringContent(oFF.ContentType.JSON, jsonString);
};
oFF.HuHorizonConfigurationManager.prototype.getToolbarConfiguration = function()
{
	return this.m_toolbarConfiguration;
};
oFF.HuHorizonConfigurationManager.prototype.isConfigurationValid = function()
{
	return this.m_isConfigValid;
};
oFF.HuHorizonConfigurationManager.prototype.releaseObject = function()
{
	this.m_pluginConfiguration = oFF.XObjectExt.release(this.m_pluginConfiguration);
	this.m_horizonConfiguration = oFF.XObjectExt.release(this.m_horizonConfiguration);
	this.m_toolbarConfiguration = oFF.XObjectExt.release(this.m_toolbarConfiguration);
	this.m_layoutConfiguration = oFF.XObjectExt.release(this.m_layoutConfiguration);
	this.m_configurationJson = oFF.XObjectExt.release(this.m_configurationJson);
	oFF.HuDfHorizonManager.prototype.releaseObject.call( this );
};

oFF.HuHorizonMenuManager = function() {};
oFF.HuHorizonMenuManager.prototype = new oFF.HuDfHorizonManager();
oFF.HuHorizonMenuManager.prototype._ff_c = "HuHorizonMenuManager";

oFF.HuHorizonMenuManager.create = function(genericController, programInstance)
{
	let newInstance = new oFF.HuHorizonMenuManager();
	newInstance._setupWithGenericController(genericController);
	newInstance._setProgramInstance(programInstance);
	return newInstance;
};
oFF.HuHorizonMenuManager.prototype.m_menuButtons = null;
oFF.HuHorizonMenuManager.prototype.m_programInstance = null;
oFF.HuHorizonMenuManager.prototype._getManagerName = function()
{
	return "Menu Manager";
};
oFF.HuHorizonMenuManager.prototype._getMenuControl = function()
{
	return this._getProgramInstance().getProgramMenu();
};
oFF.HuHorizonMenuManager.prototype._getProgramInstance = function()
{
	return this.m_programInstance;
};
oFF.HuHorizonMenuManager.prototype._setProgramInstance = function(programInstance)
{
	this.m_programInstance = programInstance;
};
oFF.HuHorizonMenuManager.prototype._setupManager = function()
{
	this.m_menuButtons = oFF.XList.create();
};
oFF.HuHorizonMenuManager.prototype.addMenuButton = function(text, icon, pressConsumer)
{
	let tmpButton = this._getProgramInstance().addProgramMenuButton(text, icon, pressConsumer);
	this.m_menuButtons.add(tmpButton);
	return tmpButton;
};
oFF.HuHorizonMenuManager.prototype.clearMenuButtons = function()
{
	this._getMenuControl().clearItems();
};
oFF.HuHorizonMenuManager.prototype.getAllMenuButtons = function()
{
	return this.m_menuButtons;
};
oFF.HuHorizonMenuManager.prototype.isMenuVisible = function()
{
	return this._getProgramInstance().isProgramMenuVisible();
};
oFF.HuHorizonMenuManager.prototype.releaseObject = function()
{
	this.clearMenuButtons();
	this.m_menuButtons = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_menuButtons);
	this.m_programInstance = null;
	oFF.HuDfHorizonManager.prototype.releaseObject.call( this );
};
oFF.HuHorizonMenuManager.prototype.removeMenuButton = function(buttonToRemove)
{
	if (oFF.notNull(buttonToRemove) && this.m_menuButtons.contains(buttonToRemove))
	{
		this._getProgramInstance().removeProgramMenuButton(buttonToRemove);
	}
};
oFF.HuHorizonMenuManager.prototype.setMenuVisible = function(visible)
{
	this._getProgramInstance().setProgramMenuVisible(visible);
};

oFF.HuHorizonMessageManager = function() {};
oFF.HuHorizonMessageManager.prototype = new oFF.HuDfHorizonManager();
oFF.HuHorizonMessageManager.prototype._ff_c = "HuHorizonMessageManager";

oFF.HuHorizonMessageManager.create = function(genericController)
{
	let newInstance = new oFF.HuHorizonMessageManager();
	newInstance._setupWithGenericController(genericController);
	return newInstance;
};
oFF.HuHorizonMessageManager.prototype.m_errorMessages = null;
oFF.HuHorizonMessageManager.prototype.m_infoMessages = null;
oFF.HuHorizonMessageManager.prototype.m_statusBarClearMessagesPressedObserverId = null;
oFF.HuHorizonMessageManager.prototype.m_statusMessage = null;
oFF.HuHorizonMessageManager.prototype.m_successMessages = null;
oFF.HuHorizonMessageManager.prototype.m_warningMessages = null;
oFF.HuHorizonMessageManager.prototype._clearMessagesByType = function(messageType)
{
	if (messageType === oFF.HuMessageType.INFORMATION)
	{
		oFF.XCollectionUtils.releaseEntriesFromCollection(this.m_infoMessages);
		this.m_infoMessages.clear();
	}
	else if (messageType === oFF.HuMessageType.SUCCESS)
	{
		oFF.XCollectionUtils.releaseEntriesFromCollection(this.m_successMessages);
		this.m_successMessages.clear();
	}
	else if (messageType === oFF.HuMessageType.WARNING)
	{
		oFF.XCollectionUtils.releaseEntriesFromCollection(this.m_warningMessages);
		this.m_warningMessages.clear();
	}
	else if (messageType === oFF.HuMessageType.ERROR)
	{
		oFF.XCollectionUtils.releaseEntriesFromCollection(this.m_errorMessages);
		this.m_errorMessages.clear();
	}
};
oFF.HuHorizonMessageManager.prototype._getManagerName = function()
{
	return "Message Manager";
};
oFF.HuHorizonMessageManager.prototype._handleStatusBarClearMessagesPressedNotification = function(notifyData)
{
	if (oFF.notNull(notifyData))
	{
		let messageType = notifyData.getXObjectByKey(oFF.HuHorizonInternalNotifications.STATUS_BAR_MANAGER_CLEAR_MESSAGES_PRESSED_MESSAGE_TYPE_NOTIFY_DATA);
		this._clearMessagesByType(messageType);
	}
};
oFF.HuHorizonMessageManager.prototype._postAllMessagesClearNotification = function()
{
	this.getLocalNotificationCenter().postNotificationWithName(oFF.HuHorizonInternalNotifications.MESSAGE_MANAGER_CLEAR_ALL_MESSAGES, null);
};
oFF.HuHorizonMessageManager.prototype._postMessagesClearNotification = function(messageType)
{
	let notifyData = oFF.XNotificationData.create();
	notifyData.putXObject(oFF.HuHorizonInternalNotifications.MESSAGE_MANAGER_CLEAR_MESSAGES_MESSAGE_TYPE_NOTIFI_DATA, messageType);
	this.getLocalNotificationCenter().postNotificationWithName(oFF.HuHorizonInternalNotifications.MESSAGE_MANAGER_CLEAR_MESSAGES, notifyData);
};
oFF.HuHorizonMessageManager.prototype._postNewMessageNotification = function(newMessage)
{
	let notifyData = oFF.XNotificationData.create();
	notifyData.putXObject(oFF.HuHorizonInternalNotifications.MESSAGE_MANAGER_NEW_MESSAGE_MESSAGE_NOTIFI_DATA, newMessage);
	this.getLocalNotificationCenter().postNotificationWithName(oFF.HuHorizonInternalNotifications.MESSAGE_MANAGER_NEW_MESSAGE, notifyData);
};
oFF.HuHorizonMessageManager.prototype._postStatusChangedNotification = function()
{
	let notifyData = oFF.XNotificationData.create();
	notifyData.putString(oFF.HuHorizonInternalNotifications.MESSAGE_MANAGER_STATUS_MESSAGE_CHANGED_NEW_MESSAGE_NOTIFI_DATA, this.m_statusMessage);
	this.getLocalNotificationCenter().postNotificationWithName(oFF.HuHorizonInternalNotifications.MESSAGE_MANAGER_STATUS_MESSAGE_CHANGED, notifyData);
};
oFF.HuHorizonMessageManager.prototype._setupManager = function()
{
	this.m_infoMessages = oFF.XList.create();
	this.m_successMessages = oFF.XList.create();
	this.m_warningMessages = oFF.XList.create();
	this.m_errorMessages = oFF.XList.create();
	this.m_statusBarClearMessagesPressedObserverId = this.getLocalNotificationCenter().addObserverForName(oFF.HuHorizonInternalNotifications.STATUS_BAR_MANAGER_CLEAR_MESSAGES_PRESSED, this._handleStatusBarClearMessagesPressedNotification.bind(this));
};
oFF.HuHorizonMessageManager.prototype.addErrorMessage = function(title, subtitle, description, messageGroup)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(title))
	{
		let newErrorMessage = oFF.HuMessage.createError(title, subtitle, description, messageGroup);
		this.m_errorMessages.add(newErrorMessage);
		this._postNewMessageNotification(newErrorMessage);
	}
};
oFF.HuHorizonMessageManager.prototype.addInfoMessage = function(title, subtitle, description, messageGroup)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(title))
	{
		let newInfoMessage = oFF.HuMessage.createInformation(title, subtitle, description, messageGroup);
		this.m_infoMessages.add(newInfoMessage);
		this._postNewMessageNotification(newInfoMessage);
	}
};
oFF.HuHorizonMessageManager.prototype.addSuccessMessage = function(title, subtitle, description, messageGroup)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(title))
	{
		let newSuccessMessage = oFF.HuMessage.createSuccess(title, subtitle, description, messageGroup);
		this.m_successMessages.add(newSuccessMessage);
		this._postNewMessageNotification(newSuccessMessage);
	}
};
oFF.HuHorizonMessageManager.prototype.addSystemErrorMessage = function(title, subtitle, description)
{
	this.addErrorMessage(title, subtitle, description, oFF.HuMessageGroup.SYSTEM);
};
oFF.HuHorizonMessageManager.prototype.addSystemInfoMessage = function(title, subtitle, description)
{
	this.addInfoMessage(title, subtitle, description, oFF.HuMessageGroup.SYSTEM);
};
oFF.HuHorizonMessageManager.prototype.addSystemSuccessMessage = function(title, subtitle, description)
{
	this.addSuccessMessage(title, subtitle, description, oFF.HuMessageGroup.SYSTEM);
};
oFF.HuHorizonMessageManager.prototype.addSystemWarningMessage = function(title, subtitle, description)
{
	this.addWarningMessage(title, subtitle, description, oFF.HuMessageGroup.SYSTEM);
};
oFF.HuHorizonMessageManager.prototype.addWarningMessage = function(title, subtitle, description, messageGroup)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(title))
	{
		let newWarningMessage = oFF.HuMessage.createWarning(title, subtitle, description, messageGroup);
		this.m_warningMessages.add(newWarningMessage);
		this._postNewMessageNotification(newWarningMessage);
	}
};
oFF.HuHorizonMessageManager.prototype.clearAllMessages = function()
{
	this.clearInfoMessages();
	this.clearSuccessMessages();
	this.clearWarningMessages();
	this.clearErrorMessages();
	this._postAllMessagesClearNotification();
};
oFF.HuHorizonMessageManager.prototype.clearErrorMessages = function()
{
	this._clearMessagesByType(oFF.HuMessageType.ERROR);
	this._postMessagesClearNotification(oFF.HuMessageType.ERROR);
};
oFF.HuHorizonMessageManager.prototype.clearInfoMessages = function()
{
	this._clearMessagesByType(oFF.HuMessageType.INFORMATION);
	this._postMessagesClearNotification(oFF.HuMessageType.INFORMATION);
};
oFF.HuHorizonMessageManager.prototype.clearSuccessMessages = function()
{
	this._clearMessagesByType(oFF.HuMessageType.SUCCESS);
	this._postMessagesClearNotification(oFF.HuMessageType.SUCCESS);
};
oFF.HuHorizonMessageManager.prototype.clearWarningMessages = function()
{
	this._clearMessagesByType(oFF.HuMessageType.WARNING);
	this._postMessagesClearNotification(oFF.HuMessageType.WARNING);
};
oFF.HuHorizonMessageManager.prototype.getAllErrorMessages = function()
{
	return this.m_errorMessages;
};
oFF.HuHorizonMessageManager.prototype.getAllInfoMessages = function()
{
	return this.m_infoMessages;
};
oFF.HuHorizonMessageManager.prototype.getAllMessages = function()
{
	let allMessages = oFF.XList.create();
	allMessages.addAll(this.getAllInfoMessages());
	allMessages.addAll(this.getAllSuccessMessages());
	allMessages.addAll(this.getAllWarningMessages());
	allMessages.addAll(this.getAllErrorMessages());
	return allMessages;
};
oFF.HuHorizonMessageManager.prototype.getAllSuccessMessages = function()
{
	return this.m_successMessages;
};
oFF.HuHorizonMessageManager.prototype.getAllWarningMessages = function()
{
	return this.m_warningMessages;
};
oFF.HuHorizonMessageManager.prototype.getStatus = function()
{
	return this.m_statusMessage;
};
oFF.HuHorizonMessageManager.prototype.hasErrorMessages = function()
{
	return this.m_errorMessages.size() > 0;
};
oFF.HuHorizonMessageManager.prototype.hasInfoMessages = function()
{
	return this.m_infoMessages.size() > 0;
};
oFF.HuHorizonMessageManager.prototype.hasMessages = function()
{
	return this.hasInfoMessages() || this.hasSuccessMessages() || this.hasWarningMessages() || this.hasErrorMessages();
};
oFF.HuHorizonMessageManager.prototype.hasSuccessMessages = function()
{
	return this.m_successMessages.size() > 0;
};
oFF.HuHorizonMessageManager.prototype.hasWarningMessages = function()
{
	return this.m_warningMessages.size() > 0;
};
oFF.HuHorizonMessageManager.prototype.releaseObject = function()
{
	this.m_infoMessages = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_infoMessages);
	this.m_successMessages = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_successMessages);
	this.m_warningMessages = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_warningMessages);
	this.m_errorMessages = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_errorMessages);
	this.getLocalNotificationCenter().removeObserverByUuid(this.m_statusBarClearMessagesPressedObserverId);
	oFF.HuDfHorizonManager.prototype.releaseObject.call( this );
};
oFF.HuHorizonMessageManager.prototype.setStatusMessage = function(statusMsg)
{
	this.m_statusMessage = statusMsg;
	this._postStatusChangedNotification();
};

oFF.HuHorizonStateManager = function() {};
oFF.HuHorizonStateManager.prototype = new oFF.HuDfHorizonManager();
oFF.HuHorizonStateManager.prototype._ff_c = "HuHorizonStateManager";

oFF.HuHorizonStateManager.create = function(genericController)
{
	let newInstance = new oFF.HuHorizonStateManager();
	newInstance._setupWithGenericController(genericController);
	return newInstance;
};
oFF.HuHorizonStateManager.prototype._getManagerName = function()
{
	return "State Manager";
};
oFF.HuHorizonStateManager.prototype._setupManager = function() {};
oFF.HuHorizonStateManager.prototype.releaseObject = function()
{
	oFF.HuDfHorizonManager.prototype.releaseObject.call( this );
};

oFF.HuHorizonWorkspaceManager = function() {};
oFF.HuHorizonWorkspaceManager.prototype = new oFF.HuDfHorizonManager();
oFF.HuHorizonWorkspaceManager.prototype._ff_c = "HuHorizonWorkspaceManager";

oFF.HuHorizonWorkspaceManager.create = function(genericController, workspaceDir)
{
	let newInstance = new oFF.HuHorizonWorkspaceManager();
	newInstance._setupWithGenericController(genericController);
	newInstance._processWorkspaceDir(workspaceDir);
	return newInstance;
};
oFF.HuHorizonWorkspaceManager.prototype.m_horizonDir = null;
oFF.HuHorizonWorkspaceManager.prototype.m_isVirtualWorkspace = false;
oFF.HuHorizonWorkspaceManager.prototype.m_pluginSettingsDir = null;
oFF.HuHorizonWorkspaceManager.prototype.m_pluginStorageDir = null;
oFF.HuHorizonWorkspaceManager.prototype.m_pluginsDir = null;
oFF.HuHorizonWorkspaceManager.prototype.m_settingsFile = null;
oFF.HuHorizonWorkspaceManager.prototype.m_stateFile = null;
oFF.HuHorizonWorkspaceManager.prototype.m_workspaceDir = null;
oFF.HuHorizonWorkspaceManager.prototype.m_workspaceHorizonConfigFile = null;
oFF.HuHorizonWorkspaceManager.prototype._getManagerName = function()
{
	return "Workspace Manager";
};
oFF.HuHorizonWorkspaceManager.prototype._prepareDirIfNecessary = function(dir)
{
	return oFF.XFilePromise.isExisting(dir).onThenPromise((isDirExisting) => {
		if (isDirExisting.getBoolean())
		{
			return oFF.XPromise.resolve(dir);
		}
		else
		{
			return oFF.XFilePromise.mkdir(dir, false);
		}
	});
};
oFF.HuHorizonWorkspaceManager.prototype._prepareFileIfNecessary = function(file)
{
	return oFF.XFilePromise.isExisting(file).onThenPromise((isExisting) => {
		if (isExisting.getBoolean())
		{
			return oFF.XPromise.resolve(file);
		}
		else
		{
			return oFF.XFilePromise.saveText(file, "");
		}
	});
};
oFF.HuHorizonWorkspaceManager.prototype._prepareHorizonDirIfNecessary = function()
{
	if (this.getPluginSettingsDirectory() === null)
	{
		let prepareHorizonDirPromise = oFF.XPromise.create((resolve, reject) => {
			let horizonDir = this.m_workspaceDir.newChild(oFF.HuHorizonWorkspaceConstants.HORIZON_DIR_NAME);
			this._prepareDirIfNecessary(horizonDir).onThen((newDir) => {
				this.m_horizonDir = horizonDir;
				let dirPreparePromiseList = oFF.XPromiseList.create();
				dirPreparePromiseList.add(this._prepareStateFileIfNecessary());
				dirPreparePromiseList.add(this._prepareSettingsFileIfNecessary());
				let horizonDirAllPromise = oFF.XPromise.all(dirPreparePromiseList);
				horizonDirAllPromise.onThen((result) => {
					resolve(oFF.XBooleanValue.create(true));
				}).onCatch(reject);
			}).onCatch(reject);
		});
		return prepareHorizonDirPromise;
	}
	return oFF.XPromise.resolve(oFF.XBooleanValue.create(true));
};
oFF.HuHorizonWorkspaceManager.prototype._preparePluginSettingsDirIfNecessary = function()
{
	if (this.getPluginSettingsDirectory() === null)
	{
		let prepareSettingsDirPromise = oFF.XPromise.create((resolve, reject) => {
			let pluginSettingsDir = this.getPluginsDirectory().newChild(oFF.HuHorizonWorkspaceConstants.PLUGIN_SETTINGS_DIR_NAME);
			this._prepareDirIfNecessary(pluginSettingsDir).onThen((newDir) => {
				this.m_pluginSettingsDir = pluginSettingsDir;
				resolve(oFF.XBooleanValue.create(true));
			}).onCatch(reject);
		});
		return prepareSettingsDirPromise;
	}
	return oFF.XPromise.resolve(oFF.XBooleanValue.create(true));
};
oFF.HuHorizonWorkspaceManager.prototype._preparePluginStorageDirIfNecessary = function()
{
	if (this.getPluginStorageDirectory() === null)
	{
		let prepareStorageDirPromise = oFF.XPromise.create((resolve, reject) => {
			let pluginStorageDir = this.getPluginsDirectory().newChild(oFF.HuHorizonWorkspaceConstants.PLUGIN_STORAGE_DIR_NAME);
			this._prepareDirIfNecessary(pluginStorageDir).onThen((newDir) => {
				this.m_pluginStorageDir = pluginStorageDir;
				resolve(oFF.XBooleanValue.create(true));
			}).onCatch(reject);
		});
		return prepareStorageDirPromise;
	}
	return oFF.XPromise.resolve(oFF.XBooleanValue.create(true));
};
oFF.HuHorizonWorkspaceManager.prototype._preparePluginsDirIfNecessary = function()
{
	if (this.getPluginsDirectory() === null)
	{
		let preparePluginsDirPromise = oFF.XPromise.create((resolve, reject) => {
			let pluginsDir = this.getHorizonDirectory().newChild(oFF.HuHorizonWorkspaceConstants.PLUGINS_DIR_NAME);
			this._prepareDirIfNecessary(pluginsDir).onThen((newDir) => {
				this.m_pluginsDir = pluginsDir;
				this._preparePluginSettingsDirIfNecessary().onThen((settingsDir) => {
					this._preparePluginStorageDirIfNecessary().onThen((storageDir) => {
						resolve(oFF.XBooleanValue.create(true));
					}).onCatch(reject);
				}).onCatch(reject);
			}).onCatch(reject);
		});
		return preparePluginsDirPromise;
	}
	return oFF.XPromise.resolve(oFF.XBooleanValue.create(true));
};
oFF.HuHorizonWorkspaceManager.prototype._prepareSettingsFileIfNecessary = function()
{
	if (this.getSettingsFile() === null)
	{
		let prepareSettingsFilePromise = oFF.XPromise.create((resolve, reject) => {
			let settingsFile = this.getHorizonDirectory().newChild(oFF.HuHorizonWorkspaceConstants.SETTINGS_FILE_NAME);
			this._prepareFileIfNecessary(settingsFile).onThen((newFile) => {
				this.m_settingsFile = settingsFile;
				resolve(oFF.XBooleanValue.create(true));
			}).onCatch(reject);
		});
		return prepareSettingsFilePromise;
	}
	return oFF.XPromise.resolve(oFF.XBooleanValue.create(true));
};
oFF.HuHorizonWorkspaceManager.prototype._prepareStateFileIfNecessary = function()
{
	if (this.getStateFile() === null)
	{
		let prepareStateFilePromise = oFF.XPromise.create((resolve, reject) => {
			let stateFile = this.getHorizonDirectory().newChild(oFF.HuHorizonWorkspaceConstants.STATE_FILE_NAME);
			this._prepareFileIfNecessary(stateFile).onThen((newFile) => {
				this.m_stateFile = stateFile;
				resolve(oFF.XBooleanValue.create(true));
			}).onCatch(reject);
		});
		return prepareStateFilePromise;
	}
	return oFF.XPromise.resolve(oFF.XBooleanValue.create(true));
};
oFF.HuHorizonWorkspaceManager.prototype._processWorkspaceDir = function(workspaceDir)
{
	this.m_workspaceDir = workspaceDir;
	if (oFF.isNull(this.m_workspaceDir))
	{
		this.m_isVirtualWorkspace = true;
		this.logDebug("No workspace directory specified! Settings cannot be preserved!");
	}
};
oFF.HuHorizonWorkspaceManager.prototype._setupManager = function() {};
oFF.HuHorizonWorkspaceManager.prototype.getHorizonDirectory = function()
{
	return this.m_horizonDir;
};
oFF.HuHorizonWorkspaceManager.prototype.getHorizonWorkspaceConfigFile = function()
{
	return this.m_workspaceHorizonConfigFile;
};
oFF.HuHorizonWorkspaceManager.prototype.getPluginSettingsDirectory = function()
{
	return this.m_pluginSettingsDir;
};
oFF.HuHorizonWorkspaceManager.prototype.getPluginStorageDirectory = function()
{
	return this.m_pluginStorageDir;
};
oFF.HuHorizonWorkspaceManager.prototype.getPluginsDirectory = function()
{
	return this.m_pluginsDir;
};
oFF.HuHorizonWorkspaceManager.prototype.getSettingsFile = function()
{
	return this.m_settingsFile;
};
oFF.HuHorizonWorkspaceManager.prototype.getSettingsFileForPlugin = function(pluginMetadata)
{
	if (oFF.notNull(pluginMetadata) && !this.isVirtualWorkspace())
	{
		let fileName = oFF.CoConfigurationUtils.createConfigurationFileNameForName(pluginMetadata.getName());
		let pluginSettingsFile = this.getPluginSettingsDirectory().newChild(fileName);
		return pluginSettingsFile;
	}
	return null;
};
oFF.HuHorizonWorkspaceManager.prototype.getStateFile = function()
{
	return this.m_stateFile;
};
oFF.HuHorizonWorkspaceManager.prototype.getStorageFileForPlugin = function(pluginMetadata)
{
	if (oFF.notNull(pluginMetadata) && !this.isVirtualWorkspace())
	{
		let fileName = oFF.XStringUtils.concatenate2(pluginMetadata.getName(), oFF.HuHorizonWorkspaceConstants.STORAGE_FILE_EXTENSION);
		let pluginStorageFile = this.getPluginStorageDirectory().newChild(fileName);
		return pluginStorageFile;
	}
	return null;
};
oFF.HuHorizonWorkspaceManager.prototype.getWorkspaceDirectory = function()
{
	return this.m_workspaceDir;
};
oFF.HuHorizonWorkspaceManager.prototype.isVirtualWorkspace = function()
{
	return this.m_isVirtualWorkspace;
};
oFF.HuHorizonWorkspaceManager.prototype.prepareSubDirectoriesIfNecessary = function()
{
	if (this.isVirtualWorkspace())
	{
		return oFF.XPromise.resolve(oFF.XBooleanValue.create(true));
	}
	if (oFF.notNull(this.m_workspaceDir))
	{
		this.m_workspaceHorizonConfigFile = this.m_workspaceDir.newChild(oFF.HuHorizonWorkspaceConstants.HORIZON_WORKSPACE_CONFIG_FILE_NAME);
		let prepareWorkspacePromise = oFF.XPromise.create((resolve, reject) => {
			this._prepareHorizonDirIfNecessary().onThen((isSuccess) => {
				this._preparePluginsDirIfNecessary().onThen((isSuccess2) => {
					resolve(oFF.XBooleanValue.create(true));
				}).onCatch(reject);
			}).onCatch(reject);
		});
		return prepareWorkspacePromise;
	}
	return oFF.XPromise.reject(oFF.XError.create("No workspace directory specified"));
};
oFF.HuHorizonWorkspaceManager.prototype.releaseObject = function()
{
	this.m_pluginStorageDir = oFF.XObjectExt.release(this.m_pluginStorageDir);
	this.m_pluginsDir = oFF.XObjectExt.release(this.m_pluginsDir);
	this.m_pluginSettingsDir = oFF.XObjectExt.release(this.m_pluginSettingsDir);
	this.m_settingsFile = oFF.XObjectExt.release(this.m_settingsFile);
	this.m_stateFile = oFF.XObjectExt.release(this.m_stateFile);
	this.m_horizonDir = oFF.XObjectExt.release(this.m_horizonDir);
	this.m_workspaceHorizonConfigFile = oFF.XObjectExt.release(this.m_workspaceHorizonConfigFile);
	this.m_workspaceDir = oFF.XObjectExt.release(this.m_workspaceDir);
	oFF.HuDfHorizonManager.prototype.releaseObject.call( this );
};
oFF.HuHorizonWorkspaceManager.prototype.setIsVirtualWorkspace = function(virtualWorkspace)
{
	this.m_isVirtualWorkspace = virtualWorkspace;
};

oFF.HuDfConfigurationProcessor = function() {};
oFF.HuDfConfigurationProcessor.prototype = new oFF.HuDfHorizonProcessor();
oFF.HuDfConfigurationProcessor.prototype._ff_c = "HuDfConfigurationProcessor";

oFF.HuDfConfigurationProcessor.prototype._getProcessorName = function()
{
	return oFF.XStringUtils.concatenate2(this._getConfigurationProcessorName(), " Configuration");
};
oFF.HuDfConfigurationProcessor.prototype._setupProcessor = function()
{
	this._setupConfigurationProcessor();
};
oFF.HuDfConfigurationProcessor.prototype.processJsonElement = function(jsonElement)
{
	if (oFF.notNull(jsonElement))
	{
		this._processConfigurationElement(jsonElement);
	}
};
oFF.HuDfConfigurationProcessor.prototype.releaseObject = function()
{
	oFF.HuDfHorizonProcessor.prototype.releaseObject.call( this );
};

oFF.HuPluginManifestProcessor = function() {};
oFF.HuPluginManifestProcessor.prototype = new oFF.HuDfHorizonProcessor();
oFF.HuPluginManifestProcessor.prototype._ff_c = "HuPluginManifestProcessor";

oFF.HuPluginManifestProcessor.create = function(toolsContext)
{
	let newInstance = new oFF.HuPluginManifestProcessor();
	newInstance._setupWithToolsContext(toolsContext);
	return newInstance;
};
oFF.HuPluginManifestProcessor.prototype.m_pluginLoader = null;
oFF.HuPluginManifestProcessor.prototype._filterDirectoryChildren = function(dirChildren)
{
	if (oFF.isNull(dirChildren) || !dirChildren.hasElements())
	{
		return dirChildren;
	}
	let filteredChildrenList = oFF.XList.create();
	oFF.XCollectionUtils.forEach(dirChildren, (tmpChild) => {
		if (oFF.HuPluginRegistryBase.didRegisterManifestFromOrigin(this._getFileOriginPath(tmpChild)))
		{
			return;
		}
		if (tmpChild.isHidden())
		{
			return;
		}
		oFF.XLogger.println(this._getFileOriginPath(tmpChild));
		filteredChildrenList.add(tmpChild);
	});
	return filteredChildrenList;
};
oFF.HuPluginManifestProcessor.prototype._getFileOriginPath = function(file)
{
	if (oFF.notNull(file) && file.getUrl() !== null)
	{
		return file.getUri().getPath();
	}
	return oFF.XGuid.getGuid();
};
oFF.HuPluginManifestProcessor.prototype._getProcessorName = function()
{
	return "Plugin Manifest Processor";
};
oFF.HuPluginManifestProcessor.prototype._processDirectoryChildren = function(dirChildren)
{
	let loadDirectoryChildrenPromise = oFF.XPromise.create((resolve, reject) => {
		let filteredDirectoryChildren = this._filterDirectoryChildren(dirChildren);
		this.logDebug(oFF.XStringUtils.concatenate2("Filtered directory children! Remaining number of files to process: ", oFF.XInteger.convertToString(filteredDirectoryChildren.size())));
		let directoryChildrenLoadList = oFF.XPromiseList.create();
		oFF.XCollectionUtils.forEach(filteredDirectoryChildren, (tmpChild) => {
			directoryChildrenLoadList.add(this._processPluginManifestFile(tmpChild));
		});
		let dirChildrenLoadPromise = oFF.XPromise.allSettled(directoryChildrenLoadList);
		dirChildrenLoadPromise.onFinally(() => {
			resolve(oFF.XBooleanValue.create(true));
		});
	});
	return loadDirectoryChildrenPromise;
};
oFF.HuPluginManifestProcessor.prototype._processPluginManifestDirectory = function(dir)
{
	if (oFF.notNull(dir))
	{
		let pluginDirLoadPromise = oFF.XPromise.create((resolve, reject) => {
			this.getLogger().logDebug(oFF.XStringUtils.concatenate2("Processing plugin dir: ", dir.getUri().getPath()));
			oFF.XFilePromise.isExisting(dir).onThen((isExisting) => {
				if (isExisting.getBoolean())
				{
					this.logDebug("Plugins dir existing!");
					oFF.XFilePromise.fetchChildren(dir).onThen((dirChildren) => {
						this.logDebug(oFF.XStringUtils.concatenate3("Plugin directory has ", oFF.XInteger.convertToString(dirChildren.size()), " files!"));
						this._processDirectoryChildren(dirChildren).onFinally(() => {
							resolve(oFF.XBooleanValue.create(true));
						});
					}).onCatch(reject);
				}
				else
				{
					this.logDebug("Plugins dir NOT existing!");
					resolve(oFF.XBooleanValue.create(true));
				}
			}).onCatch(reject);
		});
		return pluginDirLoadPromise;
	}
	return oFF.XPromise.resolve(oFF.XBooleanValue.create(true));
};
oFF.HuPluginManifestProcessor.prototype._processPluginManifestFile = function(file)
{
	let loadFilePromise = oFF.XPromise.create((resolve, reject) => {
		oFF.XFilePromise.loadJsonStructure(file).onThen((fileJson) => {
			this.logDebug(oFF.XStringUtils.concatenate2("---- Processing plugin manifest file ->  ", file.getName()));
			let tmpManifest = null;
			try
			{
				tmpManifest = oFF.HuPluginManifest.createByStructure(fileJson);
			}
			catch (error)
			{
				this.logDebug(oFF.XStringUtils.concatenate2("!!!! Failed to process plugin manifest! Error; ", oFF.XException.getMessage(error)));
			}
			if (oFF.isNull(tmpManifest))
			{
				this.logDebug("!!!! Failed to process plugin file!");
			}
			else if (!tmpManifest.isValid())
			{
				this.logDebug(oFF.XStringUtils.concatenate2("!!!! Invalid plugin manifest! Error: ", tmpManifest.getValidationErrors().get(0).getText()));
			}
			else
			{
				this.logDebug(oFF.XStringUtils.concatenate2("Plugin manifest loaded successfully: ", tmpManifest.getName()));
				if (oFF.HuPluginRegistryBase.getPluginFactory(tmpManifest.getName()) === null)
				{
					oFF.HuPluginRegistryBase.registerPluginByManifest(tmpManifest, this._getFileOriginPath(file));
				}
				else
				{
					if (!oFF.HuPluginRegistryBase.hasManifest(tmpManifest.getName()))
					{
						this.logDebug("Plugin registered but has no manifest! Adding manifest!");
						oFF.HuPluginRegistryBase.registerPluginByManifest(tmpManifest, this._getFileOriginPath(file));
					}
					else
					{
						this.logDebug("Plugin already registered!");
					}
				}
			}
			resolve(oFF.XBooleanValue.create(true));
		}).onCatch(reject);
	});
	return loadFilePromise;
};
oFF.HuPluginManifestProcessor.prototype._setupProcessor = function()
{
	this.m_pluginLoader = oFF.HuPluginLoader.create(this);
};
oFF.HuPluginManifestProcessor.prototype.processPluginManifestDirectories = function(directories)
{
	let loadPluginsPromise = oFF.XPromise.create((resolve, reject) => {
		if (oFF.isNull(directories) || !directories.hasElements())
		{
			resolve(oFF.XBooleanValue.create(true));
			return;
		}
		let pluginLoadPromiseList = oFF.XPromiseList.create();
		oFF.XCollectionUtils.forEach(directories, (tmpDir) => {
			pluginLoadPromiseList.add(this._processPluginManifestDirectory(tmpDir));
		});
		let allPluginLoadPromise = oFF.XPromise.allSettled(pluginLoadPromiseList);
		allPluginLoadPromise.onFinally(() => {
			resolve(oFF.XBooleanValue.create(true));
		});
	});
	return loadPluginsPromise;
};
oFF.HuPluginManifestProcessor.prototype.processPluginManifestFiles = function(manifestFileList)
{
	let loadPluginManifestPromise = oFF.XPromise.create((resolve, reject) => {
		if (oFF.isNull(manifestFileList) || !manifestFileList.hasElements())
		{
			resolve(oFF.XBooleanValue.create(true));
			return;
		}
		let pluginManifestLoadPromiseList = oFF.XPromiseList.create();
		oFF.XCollectionUtils.forEach(manifestFileList, (tmpManifestFile) => {
			pluginManifestLoadPromiseList.add(this._processPluginManifestFile(tmpManifestFile));
		});
		let allPluginManifestLoadPromise = oFF.XPromise.allSettled(pluginManifestLoadPromiseList);
		allPluginManifestLoadPromise.onFinally(() => {
			resolve(oFF.XBooleanValue.create(true));
		});
	});
	return loadPluginManifestPromise;
};
oFF.HuPluginManifestProcessor.prototype.releaseObject = function()
{
	this.m_pluginLoader = oFF.XObjectExt.release(this.m_pluginLoader);
	oFF.HuDfHorizonProcessor.prototype.releaseObject.call( this );
};

oFF.HuHorizonBootController = function() {};
oFF.HuHorizonBootController.prototype = new oFF.HuDfSubController();
oFF.HuHorizonBootController.prototype._ff_c = "HuHorizonBootController";

oFF.HuHorizonBootController.create = function(mainController, bootConfig)
{
	let newInstance = new oFF.HuHorizonBootController();
	newInstance.setBootConfig(bootConfig);
	newInstance._setupWithMainController(mainController);
	return newInstance;
};
oFF.HuHorizonBootController.prototype.m_bootActionsSequenceList = null;
oFF.HuHorizonBootController.prototype.m_bootConfig = null;
oFF.HuHorizonBootController.prototype.m_bootError = false;
oFF.HuHorizonBootController.prototype.m_bootScreen = null;
oFF.HuHorizonBootController.prototype.m_currentAction = null;
oFF.HuHorizonBootController.prototype.m_currentStatus = null;
oFF.HuHorizonBootController.prototype.m_numberOfBootActions = 0;
oFF.HuHorizonBootController.prototype.m_statusChangedListeners = null;
oFF.HuHorizonBootController.prototype._ensureBootConfigExists = function()
{
	if (oFF.isNull(this.m_bootConfig))
	{
		this.logDebug("Missing boot configuration! Using default configuration!");
		this.m_bootConfig = oFF.HuBootConfig.create();
	}
};
oFF.HuHorizonBootController.prototype._getControllerName = function()
{
	return "Boot Controller";
};
oFF.HuHorizonBootController.prototype._logBootActionFinish = function(action)
{
	this.logDebug(oFF.XStringUtils.concatenate2("### Finished action: -> ", action.getActionName()));
};
oFF.HuHorizonBootController.prototype._logBootActionStart = function(action)
{
	this.logDebug(oFF.XStringUtils.concatenate2("### Starting action: -> ", action.getActionName()));
};
oFF.HuHorizonBootController.prototype._notifyStatusChanged = function(status)
{
	oFF.XCollectionUtils.forEach(this.m_statusChangedListeners, (tmpListener) => {
		tmpListener.accept(status);
	});
};
oFF.HuHorizonBootController.prototype._prepareBoot = function(status)
{
	this._setStatus(status);
	this._presentBootScreen();
};
oFF.HuHorizonBootController.prototype._prepareConfigurationReload = function()
{
	this.m_bootActionsSequenceList.clear();
	this.m_bootError = false;
	let tmpConfigBootAction = oFF.HuConfigBootAction.create(this);
	tmpConfigBootAction.setConfigStr(this.getBootConfig().getConfigString());
	tmpConfigBootAction.setConfigFilePath(this.getBootConfig().getConfigFilePath());
	this.m_bootActionsSequenceList.add(tmpConfigBootAction);
	this.m_bootActionsSequenceList.add(oFF.HuPluginsModuleLoadBootAction.create(this));
	this.m_bootActionsSequenceList.add(oFF.HuFinalizeSetupBootAction.create(this));
	this.m_numberOfBootActions = this.m_bootActionsSequenceList.size();
};
oFF.HuHorizonBootController.prototype._prepareRegularBoot = function()
{
	this.m_bootActionsSequenceList.clear();
	this.m_bootError = false;
	let tmpConfigBootAction = oFF.HuConfigBootAction.create(this);
	tmpConfigBootAction.setConfigStr(this.getBootConfig().getConfigString());
	tmpConfigBootAction.setConfigFilePath(this.getBootConfig().getConfigFilePath());
	this.m_bootActionsSequenceList.add(oFF.HuWorkspaceBootAction.create(this));
	this.m_bootActionsSequenceList.add(tmpConfigBootAction);
	this.m_bootActionsSequenceList.add(oFF.HuPluginsManifestLoadBootAction.create(this));
	this.m_bootActionsSequenceList.add(oFF.HuPluginsModuleLoadBootAction.create(this));
	this.m_bootActionsSequenceList.add(oFF.HuFinalizeSetupBootAction.create(this));
	this.m_numberOfBootActions = this.m_bootActionsSequenceList.size();
};
oFF.HuHorizonBootController.prototype._prepareWorkspaceSwitch = function()
{
	this.m_bootActionsSequenceList.clear();
	this.m_bootError = false;
	this.m_bootActionsSequenceList.add(oFF.HuConfigBootAction.create(this));
	this.m_bootActionsSequenceList.add(oFF.HuPluginsModuleLoadBootAction.create(this));
	this.m_bootActionsSequenceList.add(oFF.HuFinalizeSetupBootAction.create(this));
	this.m_numberOfBootActions = this.m_bootActionsSequenceList.size();
};
oFF.HuHorizonBootController.prototype._presentBootScreen = function()
{
	if (this.getBootConfig().isShowSplashScreen())
	{
		let resolvedImagePath = this.getMainController().getProcess().resolvePath(oFF.HuHorizonConstants.DEFAULT_SPLASH_SCREEN_IMAGE_PATH);
		this.m_bootScreen = oFF.HuSplashBootScreenView.create(this.getGenesis(), resolvedImagePath);
	}
	else
	{
		this.m_bootScreen = oFF.HuActivityIndicatorBootScreenView.create(this.getGenesis());
	}
	this.getMainGenesis().setRoot(this.m_bootScreen.getView());
};
oFF.HuHorizonBootController.prototype._processBootActionsInOrder = function()
{
	let booPromise = oFF.XPromise.create((resolve, reject) => {
		this._processCurrentBootAction(resolve, reject);
	});
	return booPromise;
};
oFF.HuHorizonBootController.prototype._processCurrentBootAction = function(resolve, reject)
{
	if (oFF.notNull(this.m_bootActionsSequenceList) && this.m_bootActionsSequenceList.size() > 0)
	{
		this.m_currentAction = this.m_bootActionsSequenceList.removeAt(0);
		this._setCurrentActionLbl();
		this._logBootActionStart(this.m_currentAction);
		this.m_currentAction.executeBootAction().onThen((isSuccess) => {
			this._logBootActionFinish(this.m_currentAction);
			this._setProgressIndicatorValue();
			this._processCurrentBootAction(resolve, reject);
		}).onCatch((error) => {
			let errorMsg = oFF.XStringUtils.concatenate2("Error during startup! Reason: ", error.getText());
			this._showBootError(errorMsg);
			reject(error);
		});
	}
	else
	{
		this.m_currentAction = null;
		this._setCurrentActionLbl();
		resolve(oFF.XBooleanValue.create(true));
	}
};
oFF.HuHorizonBootController.prototype._setCurrentActionLbl = function()
{
	if (oFF.notNull(this.m_bootScreen))
	{
		let currentActionStr = null;
		if (oFF.notNull(this.m_currentAction))
		{
			if (this.m_bootError)
			{
				currentActionStr = oFF.XStringUtils.concatenate2("Boot interrupted during: ", this.m_currentAction.getActionName());
			}
			else
			{
				currentActionStr = oFF.XStringUtils.concatenate2("Processing: ", this.m_currentAction.getActionName());
			}
		}
		else if (this.m_bootError)
		{
			currentActionStr = "Boot error...";
		}
		else
		{
			currentActionStr = "Boot finished...";
		}
		this.m_bootScreen.setCurrentStatusText(currentActionStr);
	}
};
oFF.HuHorizonBootController.prototype._setProgressIndicatorValue = function()
{
	if (oFF.notNull(this.m_bootScreen))
	{
		let leftActions = this.m_bootActionsSequenceList.size();
		let percentValue = leftActions / this.m_numberOfBootActions;
		percentValue = percentValue * 100;
		percentValue = 100 - percentValue;
		this.m_bootScreen.setCurrentPercentValue(percentValue);
	}
};
oFF.HuHorizonBootController.prototype._setStatus = function(status)
{
	if (oFF.notNull(status) && this.m_currentStatus !== status)
	{
		this.m_currentStatus = status;
		this.logDebug(oFF.XStringUtils.concatenate2("Controller status changed to: ", status.getName()));
		this._notifyStatusChanged(status);
	}
};
oFF.HuHorizonBootController.prototype._setupController = function()
{
	this.m_statusChangedListeners = oFF.XList.create();
	this.m_currentStatus = oFF.HuBootControllerStatus.INITIAL;
	this.m_bootActionsSequenceList = oFF.XList.create();
	this._ensureBootConfigExists();
};
oFF.HuHorizonBootController.prototype._showBootError = function(errorMsg)
{
	if (oFF.notNull(this.m_bootScreen))
	{
		if (oFF.XStringUtils.isNotNullAndNotEmpty(errorMsg))
		{
			this.m_bootScreen.setErrorMessage(errorMsg);
			this.m_bootError = true;
			this._setCurrentActionLbl();
		}
		else
		{
			this.m_bootScreen.setErrorMessage(null);
		}
	}
};
oFF.HuHorizonBootController.prototype._startConfigurationReload = function()
{
	this._prepareBoot(oFF.HuBootControllerStatus.CONFIGURATION_RELOAD_IN_PROGRESS);
	return this._processBootActionsInOrder().onThen((isSuccess) => {
		this._setStatus(oFF.HuBootControllerStatus.CONFIGURATION_RELOAD_FINISHED);
	});
};
oFF.HuHorizonBootController.prototype._startRegularBoot = function()
{
	this._prepareBoot(oFF.HuBootControllerStatus.BOOT_IN_PROGRESS);
	return this._processBootActionsInOrder().then((isSuccess) => {
		this._setStatus(oFF.HuBootControllerStatus.BOOT_FINISHED);
		return isSuccess;
	}, null);
};
oFF.HuHorizonBootController.prototype._startWorkspaceSwitch = function()
{
	return this._switchWorkspaceInternal().then((isSuccess) => {
		this._setStatus(oFF.HuBootControllerStatus.WORKSPACE_SWITCH_FINISHED);
		return isSuccess;
	}, null);
};
oFF.HuHorizonBootController.prototype._switchWorkspaceInternal = function()
{
	let switchWorkspacePromise = oFF.XPromise.create((resolve, reject) => {
		let workspaceBootAction = oFF.HuWorkspaceBootAction.create(this);
		workspaceBootAction.presentWorkspaceDirectorySelection().onThen((directory) => {
			if (oFF.notNull(directory))
			{
				this._prepareBoot(oFF.HuBootControllerStatus.WORKSPACE_SWITCH_IN_PROGRESS);
				this._logBootActionStart(workspaceBootAction);
				workspaceBootAction.switchWorkspace(directory).onThen((isSuccess) => {
					this._logBootActionFinish(workspaceBootAction);
					this._processBootActionsInOrder().onThen((isSuccess2) => {
						resolve(oFF.XBooleanValue.create(true));
					});
				}).onCatch(reject);
			}
			else
			{
				reject(oFF.XError.create("Missing workspace directory!"));
			}
		}).onCatch((errMsg) => {
			this.logDebug("Workspace switch cancelled!");
		});
	});
	return switchWorkspacePromise;
};
oFF.HuHorizonBootController.prototype.addStatusChangedListener = function(listener)
{
	this.m_statusChangedListeners.add(oFF.XConsumerHolder.create(listener));
};
oFF.HuHorizonBootController.prototype.executeConfigurationReload = function()
{
	this._prepareConfigurationReload();
	return this._startConfigurationReload();
};
oFF.HuHorizonBootController.prototype.executeRegularBoot = function()
{
	this._prepareRegularBoot();
	return this._startRegularBoot();
};
oFF.HuHorizonBootController.prototype.executeWorkspaceSwitch = function()
{
	this._prepareWorkspaceSwitch();
	return this._startWorkspaceSwitch();
};
oFF.HuHorizonBootController.prototype.finalizeMainControllerSetup = function()
{
	let finalizePromise = oFF.XPromise.create((resolve, reject) => {
		try
		{
			this.getMainController().finalizeControllerSetup();
			resolve(oFF.XBooleanValue.create(true));
		}
		catch (err)
		{
			let tmpError = oFF.XError.create("Error during boot finalization!").attachCause(oFF.XError.createWithThrowable(err));
			reject(tmpError);
		}
	});
	return finalizePromise;
};
oFF.HuHorizonBootController.prototype.getBootConfig = function()
{
	return this.m_bootConfig;
};
oFF.HuHorizonBootController.prototype.getConfigManager = function()
{
	return this.getMainController().getConfigurationManager();
};
oFF.HuHorizonBootController.prototype.getCurrentStatus = function()
{
	return this.m_currentStatus;
};
oFF.HuHorizonBootController.prototype.getWorkspaceManager = function()
{
	return this.getMainController().getWorkspaceManager();
};
oFF.HuHorizonBootController.prototype.initConfigManager = function(configStruct)
{
	this.getMainController().initConfigManager(configStruct);
	return oFF.XPromise.resolve(oFF.XBooleanValue.create(true));
};
oFF.HuHorizonBootController.prototype.initWorkspaceManager = function(workspaceDir)
{
	this.getMainController().initWorkspaceManager(workspaceDir);
	return this.getMainController().getWorkspaceManager().prepareSubDirectoriesIfNecessary();
};
oFF.HuHorizonBootController.prototype.releaseObject = function()
{
	this.m_bootConfig = null;
	this.m_bootActionsSequenceList = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_bootActionsSequenceList);
	this.m_currentAction = null;
	this.m_currentStatus = null;
	this.m_statusChangedListeners = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_statusChangedListeners);
	this.m_bootScreen = oFF.XObjectExt.release(this.m_bootScreen);
	oFF.HuDfSubController.prototype.releaseObject.call( this );
};
oFF.HuHorizonBootController.prototype.removeStatusChangedListener = function(listener)
{
	oFF.XCollectionUtils.removeIf(this.m_statusChangedListeners, (tmpConsumerHolder) => {
		return tmpConsumerHolder.getConsumer() === listener;
	});
};
oFF.HuHorizonBootController.prototype.setBootConfig = function(bootConfig)
{
	this.m_bootConfig = bootConfig;
	this._ensureBootConfigExists();
};

oFF.HuErrorType = function() {};
oFF.HuErrorType.prototype = new oFF.XErrorType();
oFF.HuErrorType.prototype._ff_c = "HuErrorType";

oFF.HuErrorType.COMMAND_PLUGIN_ALREADY_RUNNING = null;
oFF.HuErrorType.CONFIG_ERROR = null;
oFF.HuErrorType.CONFIG_FILE_NOT_FOUND = null;
oFF.HuErrorType.CONFIG_SYNTAX_ERROR = null;
oFF.HuErrorType.MANIFEST_INVALID_NAME = null;
oFF.HuErrorType.MANIFEST_MISSING_NAME = null;
oFF.HuErrorType.MANIFEST_VALIDATION_ERROR = null;
oFF.HuErrorType.MISSING_PLUGIN_STARTUP_INFO = null;
oFF.HuErrorType.PLUGIN_CANNOT_BE_INITIALIZED_ERROR = null;
oFF.HuErrorType.PLUGIN_ERROR = null;
oFF.HuErrorType.PLUGIN_INITIALIZATION_ERROR = null;
oFF.HuErrorType.PLUGIN_STARTUP_ERROR = null;
oFF.HuErrorType.createHorizonError = function(constant, parent)
{
	return oFF.XErrorType.createError(new oFF.HuErrorType(), constant, parent);
};
oFF.HuErrorType.staticSetupHorizon = function()
{
	oFF.HuErrorType.CONFIG_ERROR = oFF.HuErrorType.createHorizonError("ConfigError", null);
	oFF.HuErrorType.CONFIG_FILE_NOT_FOUND = oFF.HuErrorType.createHorizonError("ConfigFileNotFound", oFF.HuErrorType.CONFIG_ERROR);
	oFF.HuErrorType.CONFIG_SYNTAX_ERROR = oFF.HuErrorType.createHorizonError("ConfigSyntaxError", oFF.HuErrorType.CONFIG_ERROR);
	oFF.HuErrorType.MANIFEST_VALIDATION_ERROR = oFF.HuErrorType.createHorizonError("ManifestValidationError", null);
	oFF.HuErrorType.MANIFEST_MISSING_NAME = oFF.HuErrorType.createHorizonError("ManifestMissingName", oFF.HuErrorType.MANIFEST_VALIDATION_ERROR);
	oFF.HuErrorType.MANIFEST_INVALID_NAME = oFF.HuErrorType.createHorizonError("ManifestInvalidName", oFF.HuErrorType.MANIFEST_VALIDATION_ERROR);
	oFF.HuErrorType.PLUGIN_ERROR = oFF.HuErrorType.createHorizonError("PluginError", null);
	oFF.HuErrorType.PLUGIN_INITIALIZATION_ERROR = oFF.HuErrorType.createHorizonError("PluginInitializationError", oFF.HuErrorType.PLUGIN_ERROR);
	oFF.HuErrorType.PLUGIN_STARTUP_ERROR = oFF.HuErrorType.createHorizonError("PluginStartupError", oFF.HuErrorType.PLUGIN_INITIALIZATION_ERROR);
	oFF.HuErrorType.MISSING_PLUGIN_STARTUP_INFO = oFF.HuErrorType.createHorizonError("MissingPluginStartupInfo", oFF.HuErrorType.PLUGIN_STARTUP_ERROR);
	oFF.HuErrorType.PLUGIN_CANNOT_BE_INITIALIZED_ERROR = oFF.HuErrorType.createHorizonError("PluginCannotBeInitializedError", oFF.HuErrorType.PLUGIN_STARTUP_ERROR);
	oFF.HuErrorType.COMMAND_PLUGIN_ALREADY_RUNNING = oFF.HuErrorType.createHorizonError("CommandPluginAlreadyRunningError", oFF.HuErrorType.PLUGIN_STARTUP_ERROR);
};

oFF.HuHorizonMainController = function() {};
oFF.HuHorizonMainController.prototype = new oFF.HuDfHorizonLogContext();
oFF.HuHorizonMainController.prototype._ff_c = "HuHorizonMainController";

oFF.HuHorizonMainController.create = function(horizonPrgInstance)
{
	let newInstance = new oFF.HuHorizonMainController();
	newInstance._setupWithProgramInstance(horizonPrgInstance);
	return newInstance;
};
oFF.HuHorizonMainController.prototype.m_activeBootController = null;
oFF.HuHorizonMainController.prototype.m_bootConfig = null;
oFF.HuHorizonMainController.prototype.m_commandPluginManager = null;
oFF.HuHorizonMainController.prototype.m_configurationManager = null;
oFF.HuHorizonMainController.prototype.m_currentStatus = null;
oFF.HuHorizonMainController.prototype.m_debugUtility = null;
oFF.HuHorizonMainController.prototype.m_globalDataSpace = null;
oFF.HuHorizonMainController.prototype.m_localNotificationCenter = null;
oFF.HuHorizonMainController.prototype.m_loggerInstance = null;
oFF.HuHorizonMainController.prototype.m_messageManager = null;
oFF.HuHorizonMainController.prototype.m_pluginToolsService = null;
oFF.HuHorizonMainController.prototype.m_programInstance = null;
oFF.HuHorizonMainController.prototype.m_shellController = null;
oFF.HuHorizonMainController.prototype.m_stateManager = null;
oFF.HuHorizonMainController.prototype.m_statusChangedListeners = null;
oFF.HuHorizonMainController.prototype.m_uiController = null;
oFF.HuHorizonMainController.prototype.m_viewPluginManager = null;
oFF.HuHorizonMainController.prototype.m_workspaceManager = null;
oFF.HuHorizonMainController.prototype._createInvalidPluginMessagesIfNeeded = function()
{
	let invalidPlugins = this.getConfigurationManager().getPluginsConfiguration().getInvalidPluginNames();
	if (oFF.notNull(invalidPlugins) && invalidPlugins.size() > 0)
	{
		oFF.XCollectionUtils.forEach(invalidPlugins, (invalidPluginName) => {
			let messageSubtitle = oFF.XStringUtils.concatenate3("The plugin with name ", invalidPluginName, " was not found!");
			this.getMessageManager().addSystemWarningMessage("Invalid plugin!", null, messageSubtitle);
		});
	}
};
oFF.HuHorizonMainController.prototype._handleControllerReady = function()
{
	this.logDebug("Init -> Controller ready...");
	this.m_activeBootController = oFF.XObjectExt.release(this.m_activeBootController);
	this._startHorizonFramework();
};
oFF.HuHorizonMainController.prototype._handleHorizonRunning = function()
{
	this._setInitialStatus();
	this.logDebug("Init -> Startup complete! Horizon framework is running.");
	this.getDebugUtility().startupFinished();
	if (this.isRunningInDebugEnvironment())
	{
		this.logDebug("###### Running in debug environment ######");
		this.logDebug(oFF.XStringUtils.concatenate3("Startup time -> ", oFF.XLong.convertToString(this.getDebugUtility().getLastStartupTime()), "ms"));
	}
};
oFF.HuHorizonMainController.prototype._handleStatusChangedInternal = function(controllerStatus)
{
	if (controllerStatus === oFF.HuMainControllerStatus.BOOTING)
	{
		this._prepareBoot();
	}
	else if (controllerStatus === oFF.HuMainControllerStatus.RELOADING_CONFIGURATION)
	{
		this._prepareConfigurationReload();
	}
	else if (controllerStatus === oFF.HuMainControllerStatus.READY)
	{
		this._handleControllerReady();
	}
	else if (controllerStatus === oFF.HuMainControllerStatus.RUNNING)
	{
		this._handleHorizonRunning();
	}
};
oFF.HuHorizonMainController.prototype._initializeAllConfigCommandPlugins = function()
{
	this.logDebug("Init -> Initialize config command plugins");
	let startupCommandPlugins = this.getConfigurationManager().getPluginsConfiguration().getAllStartupCommandPlugins();
	return this.getCommandPluginManager().runAllCommandPlugins(startupCommandPlugins).onThenExt((result) => {
		this._processCommandPluginStartupResult(result);
		return oFF.XBooleanValue.create(true);
	});
};
oFF.HuHorizonMainController.prototype._notifyListenersStatusChanged = function(status)
{
	oFF.XCollectionUtils.forEach(this.m_statusChangedListeners, (tmpListener) => {
		tmpListener.accept(status);
	});
};
oFF.HuHorizonMainController.prototype._prepareBoot = function()
{
	this.logDebug("Init -> Prepare boot...");
	this._prepareControllerForStartup(true);
};
oFF.HuHorizonMainController.prototype._prepareConfigurationReload = function()
{
	this.logDebug("Init -> Prepare configuration reload...");
	this._prepareControllerForStartup(false);
};
oFF.HuHorizonMainController.prototype._prepareControllerForStartup = function(fullCleanup)
{
	this.getDebugUtility().startupStarted();
	this.getShellController().getMenuManager().setMenuVisible(false);
	if (fullCleanup)
	{
		this.m_messageManager = oFF.XObjectExt.release(this.m_messageManager);
		this.m_messageManager = oFF.HuHorizonMessageManager.create(this);
		this.m_workspaceManager = oFF.XObjectExt.release(this.m_workspaceManager);
	}
	else
	{
		this.m_messageManager.setStatusMessage(null);
		this.m_messageManager.clearAllMessages();
	}
	this.m_globalDataSpace = oFF.XObjectExt.release(this.m_globalDataSpace);
	this.m_pluginToolsService = oFF.XObjectExt.release(this.m_pluginToolsService);
	this.m_viewPluginManager = oFF.XObjectExt.release(this.m_viewPluginManager);
	this.m_commandPluginManager = oFF.XObjectExt.release(this.m_commandPluginManager);
	this.m_stateManager = oFF.XObjectExt.release(this.m_stateManager);
	this.m_uiController = oFF.XObjectExt.release(this.m_uiController);
	this.m_configurationManager = oFF.XObjectExt.release(this.m_configurationManager);
};
oFF.HuHorizonMainController.prototype._processCommandPluginStartupResult = function(startupResult)
{
	try
	{
		oFF.XCollectionUtils.forEach(startupResult, (promiseResult) => {
			if (promiseResult.getStatus() === oFF.XPromiseState.REJECTED)
			{
				let tmpError = promiseResult.getReason();
				if (oFF.notNull(tmpError) && tmpError.getErrorType().isTypeOf(oFF.HuErrorType.COMMAND_PLUGIN_ALREADY_RUNNING))
				{
					this.getMessageManager().addSystemWarningMessage("Command plugin already running!", null, tmpError.getText());
				}
			}
		});
	}
	catch (err)
	{
		this.logDebug("Error during command plugin startup processing!");
	}
};
oFF.HuHorizonMainController.prototype._registerAllNotificationsObserverIfNeeded = function()
{
	if (this.isRunningInDebugEnvironment())
	{
		this.m_localNotificationCenter.addAllObserver((notifyName, notifyData) => {
			this.logDebug(oFF.XStringUtils.concatenate2("Local notification posted -> ", notifyName));
		});
	}
};
oFF.HuHorizonMainController.prototype._setInitialStatus = function()
{
	if (!this.getConfigurationManager().getPluginsConfiguration().hasStartupViewPlugins())
	{
		this.getMessageManager().setStatusMessage("No startup document or component plugins specified in the configuration...");
	}
	else if (this.isRunningInDebugEnvironment() && oFF.XStringUtils.isNullOrEmpty(this.getMessageManager().getStatus()))
	{
		this.getMessageManager().setStatusMessage("Ready...");
	}
};
oFF.HuHorizonMainController.prototype._setupWithProgramInstance = function(horizonPrgInstance)
{
	this.m_programInstance = horizonPrgInstance;
	this.m_debugUtility = oFF.HuHorizonDebugUtility.create(this.getProcess());
	this.m_localNotificationCenter = oFF.XNotificationCenter.create();
	this._registerAllNotificationsObserverIfNeeded();
	this.m_loggerInstance = oFF.HuLogger.createNewLogger();
	this.m_loggerInstance.setDebugEnabled(this.m_debugUtility.isDebugEnvironment());
	this._setupLogger(this.m_loggerInstance);
	this.m_statusChangedListeners = oFF.XList.create();
	this.m_currentStatus = oFF.HuMainControllerStatus.INITIAL;
	this.m_shellController = oFF.HuHorizonShellController.create(this);
};
oFF.HuHorizonMainController.prototype._startHorizonFramework = function()
{
	this.logDebug("Init -> Starting horizon framework...");
	let frameworkStartupPromise = oFF.XPromise.create((resolve, reject) => {
		this.getShellController().setBusy(true);
		this._initializeAllConfigCommandPlugins().onFinally(() => {
			this.getShellController().reInitShell();
			this.getShellController().setBusy(false);
			this.getUiController().reInitUi().onFinally(() => {
				this.setControllerStatus(oFF.HuMainControllerStatus.RUNNING);
				resolve(oFF.XBooleanValue.create(true));
			});
		});
	});
	return frameworkStartupPromise;
};
oFF.HuHorizonMainController.prototype._throwInvalidStateException = function()
{
	throw oFF.XException.createRuntimeException("Cannot replace manger instance as controller is not in boot state!");
};
oFF.HuHorizonMainController.prototype.addStatusChangedListener = function(listener)
{
	this.m_statusChangedListeners.add(oFF.XConsumerHolder.create(listener));
};
oFF.HuHorizonMainController.prototype.applyNewConfiguration = function(configStruct)
{
	if (this.getCurrentBootConfig() !== null && oFF.notNull(configStruct) && !this.getCurrentControllerStatus().isSetupPhase())
	{
		this.getCurrentBootConfig().setConfigString(oFF.PrUtils.serialize(configStruct, false, false, 0));
		this.getCurrentBootConfig().setConfigFilePath(null);
		this.getCurrentBootConfig().setShowSplashScreen(false);
		this.getCurrentBootConfig().setWorkspaceDirectoryPath(null);
		this.getWorkspaceManager().setIsVirtualWorkspace(true);
		this.reloadConfiguration();
	}
};
oFF.HuHorizonMainController.prototype.finalizeControllerSetup = function()
{
	if (this.getCurrentControllerStatus().isSetupPhase())
	{
		this.logDebug("Init -> Finalize setup");
		let startupMode = this.getConfigurationManager().getHorizonConfiguration().getFrameworkMode();
		this.logDebug(oFF.XStringUtils.concatenate3("Init -> Starting in framework mode [", startupMode.getName(), "]"));
		this.logDebug("Init -> Initialize global data space");
		this.m_globalDataSpace = oFF.HuDataSpace.create();
		this.logDebug("Init -> Validating and grouping plugins from configuration");
		this.getConfigurationManager().getPluginsConfiguration().validateAndGroupPlugins();
		this._createInvalidPluginMessagesIfNeeded();
		this.logDebug("Init -> Create command plugin manager");
		this.m_commandPluginManager = oFF.HuHorizonCommandPluginManager.create(this);
		this.logDebug("Init -> Create view plugin manager");
		this.m_viewPluginManager = oFF.HuHorizonViewPluginManager.create(this);
		this.logDebug("Init -> Create state manager");
		this.m_stateManager = oFF.HuHorizonStateManager.create(this);
		this.logDebug("Init -> Create plugin tools service");
		this.m_pluginToolsService = oFF.HuPluginToolsService.create(this);
		this.logDebug("Init -> Create Ui controller");
		this.m_uiController = oFF.HuHorizonUiController.create(this);
	}
	else
	{
		this._throwInvalidStateException();
	}
};
oFF.HuHorizonMainController.prototype.getCommandPluginManager = function()
{
	return this.m_commandPluginManager;
};
oFF.HuHorizonMainController.prototype.getConfigurationManager = function()
{
	return this.m_configurationManager;
};
oFF.HuHorizonMainController.prototype.getCurrentBootConfig = function()
{
	return this.m_bootConfig;
};
oFF.HuHorizonMainController.prototype.getCurrentControllerStatus = function()
{
	return this.m_currentStatus;
};
oFF.HuHorizonMainController.prototype.getCurrentFrameworkMode = function()
{
	return this.getConfigurationManager().getHorizonConfiguration().getFrameworkMode();
};
oFF.HuHorizonMainController.prototype.getDataSpace = function()
{
	return this.m_globalDataSpace;
};
oFF.HuHorizonMainController.prototype.getDebugUtility = function()
{
	return this.m_debugUtility;
};
oFF.HuHorizonMainController.prototype.getGenesis = function()
{
	return this.getMainGenesis();
};
oFF.HuHorizonMainController.prototype.getLocalNotificationCenter = function()
{
	return this.m_localNotificationCenter;
};
oFF.HuHorizonMainController.prototype.getLocalStorage = function()
{
	return this.getProcess().getLocalStorage();
};
oFF.HuHorizonMainController.prototype.getLogContextName = function()
{
	return "Controller";
};
oFF.HuHorizonMainController.prototype.getMainController = function()
{
	return this;
};
oFF.HuHorizonMainController.prototype.getMainGenesis = function()
{
	return this.getProgramInstance().getGenesis();
};
oFF.HuHorizonMainController.prototype.getMessageManager = function()
{
	return this.m_messageManager;
};
oFF.HuHorizonMainController.prototype.getPluginToolsService = function()
{
	return this.m_pluginToolsService;
};
oFF.HuHorizonMainController.prototype.getProcess = function()
{
	return this.getProgramInstance().getProcess();
};
oFF.HuHorizonMainController.prototype.getProgramInstance = function()
{
	return this.m_programInstance;
};
oFF.HuHorizonMainController.prototype.getSession = function()
{
	return this.getProgramInstance().getSession();
};
oFF.HuHorizonMainController.prototype.getShellController = function()
{
	return this.m_shellController;
};
oFF.HuHorizonMainController.prototype.getStateManager = function()
{
	return this.m_stateManager;
};
oFF.HuHorizonMainController.prototype.getUiController = function()
{
	return this.m_uiController;
};
oFF.HuHorizonMainController.prototype.getViewPluginManager = function()
{
	return this.m_viewPluginManager;
};
oFF.HuHorizonMainController.prototype.getWorkspaceManager = function()
{
	return this.m_workspaceManager;
};
oFF.HuHorizonMainController.prototype.initConfigManager = function(configStruct)
{
	if (this.getCurrentControllerStatus().isSetupPhase())
	{
		this.logDebug("Init -> Config manager");
		this.m_configurationManager = oFF.HuHorizonConfigurationManager.create(this, configStruct);
	}
	else
	{
		this._throwInvalidStateException();
	}
};
oFF.HuHorizonMainController.prototype.initWorkspaceManager = function(workspaceDirectory)
{
	if (this.getCurrentControllerStatus().isSetupPhase())
	{
		this.logDebug("Init -> Workspace manager");
		this.m_workspaceManager = oFF.HuHorizonWorkspaceManager.create(this, workspaceDirectory);
	}
	else
	{
		this._throwInvalidStateException();
	}
};
oFF.HuHorizonMainController.prototype.initiateBoot = function(bootConfig)
{
	this.m_bootConfig = bootConfig;
	this.setControllerStatus(oFF.HuMainControllerStatus.BOOTING);
	this.m_activeBootController = oFF.HuHorizonBootController.create(this, this.m_bootConfig);
	let bootPromise = this.m_activeBootController.executeRegularBoot();
	bootPromise = bootPromise.onThen((isSuccess) => {
		this.setControllerStatus(oFF.HuMainControllerStatus.READY);
	});
	if (this.getShellController().isEmbedded())
	{
		bootPromise = bootPromise.onCatchExt((error) => {
			this.logDebug(oFF.XStringUtils.concatenate2("Error during boot: ", error.getText()));
			return oFF.XBooleanValue.create(true);
		});
	}
	return bootPromise;
};
oFF.HuHorizonMainController.prototype.isRunningInDebugEnvironment = function()
{
	return this.getDebugUtility().isDebugEnvironment();
};
oFF.HuHorizonMainController.prototype.releaseObject = function()
{
	this.m_pluginToolsService = oFF.XObjectExt.release(this.m_pluginToolsService);
	this.m_viewPluginManager = oFF.XObjectExt.release(this.m_viewPluginManager);
	this.m_commandPluginManager = oFF.XObjectExt.release(this.m_commandPluginManager);
	this.m_stateManager = oFF.XObjectExt.release(this.m_stateManager);
	this.m_messageManager = oFF.XObjectExt.release(this.m_messageManager);
	this.m_activeBootController = oFF.XObjectExt.release(this.m_activeBootController);
	this.m_bootConfig = oFF.XObjectExt.release(this.m_bootConfig);
	this.m_uiController = oFF.XObjectExt.release(this.m_uiController);
	this.m_shellController = oFF.XObjectExt.release(this.m_shellController);
	this.m_workspaceManager = oFF.XObjectExt.release(this.m_workspaceManager);
	this.m_configurationManager = oFF.XObjectExt.release(this.m_configurationManager);
	this.m_globalDataSpace = oFF.XObjectExt.release(this.m_globalDataSpace);
	this.m_currentStatus = null;
	this.m_statusChangedListeners = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_statusChangedListeners);
	this.m_debugUtility = oFF.XObjectExt.release(this.m_debugUtility);
	this.m_loggerInstance = oFF.XObjectExt.release(this.m_loggerInstance);
	this.m_localNotificationCenter = oFF.XObjectExt.release(this.m_localNotificationCenter);
	this.m_programInstance = null;
	oFF.HuDfHorizonLogContext.prototype.releaseObject.call( this );
};
oFF.HuHorizonMainController.prototype.reloadConfiguration = function()
{
	this.m_activeBootController = oFF.HuHorizonBootController.create(this, this.m_bootConfig);
	this.m_activeBootController.addStatusChangedListener((booCtrlStatus) => {
		if (booCtrlStatus === oFF.HuBootControllerStatus.CONFIGURATION_RELOAD_IN_PROGRESS)
		{
			this.setControllerStatus(oFF.HuMainControllerStatus.RELOADING_CONFIGURATION);
		}
	});
	this.m_activeBootController.executeConfigurationReload().onThen((result) => {
		this.setControllerStatus(oFF.HuMainControllerStatus.READY);
	});
};
oFF.HuHorizonMainController.prototype.removeStatusChangedListener = function(listener)
{
	oFF.XCollectionUtils.removeIf(this.m_statusChangedListeners, (tmpConsumerHolder) => {
		return tmpConsumerHolder.getConsumer() === listener;
	});
};
oFF.HuHorizonMainController.prototype.requestWorkspaceSwitch = function()
{
	this.m_activeBootController = oFF.HuHorizonBootController.create(this, this.m_bootConfig);
	this.m_activeBootController.addStatusChangedListener((booCtrlStatus) => {
		if (booCtrlStatus === oFF.HuBootControllerStatus.WORKSPACE_SWITCH_IN_PROGRESS)
		{
			this.setControllerStatus(oFF.HuMainControllerStatus.BOOTING);
		}
	});
	this.m_activeBootController.executeWorkspaceSwitch().onThen((result) => {
		this.setControllerStatus(oFF.HuMainControllerStatus.READY);
	});
};
oFF.HuHorizonMainController.prototype.setControllerStatus = function(status)
{
	if (oFF.notNull(status) && this.m_currentStatus !== status)
	{
		this.m_currentStatus = status;
		this.logDebug(oFF.XStringUtils.concatenate2("Status changed to: ", status.getName()));
		this._handleStatusChangedInternal(status);
		this._notifyListenersStatusChanged(status);
	}
};
oFF.HuHorizonMainController.prototype.setLoggerInstance = function(logger)
{
	if (oFF.notNull(logger))
	{
		this.m_loggerInstance = logger;
	}
};

oFF.HuComponentPluginController = function() {};
oFF.HuComponentPluginController.prototype = new oFF.HuDfViewPluginController();
oFF.HuComponentPluginController.prototype._ff_c = "HuComponentPluginController";

oFF.HuComponentPluginController.prototype._destroySpecificViewPlugin = function() {};
oFF.HuComponentPluginController.prototype._getComponentPluginInstance = function()
{
	try
	{
		return this._getPluginInstance();
	}
	catch (err)
	{
		this._throwInvalidPluginTypeException();
	}
	return null;
};
oFF.HuComponentPluginController.prototype._initSpecificViewPlugin = function()
{
	this.getPluginWrapperView().addCssClass("ffHorizonComponentPlugin");
};
oFF.HuComponentPluginController.prototype._runSpecificPlugin = function()
{
	this._getComponentPluginInstance().buildPluginUi(this.getGenesis());
};
oFF.HuComponentPluginController.prototype._setupSpecificPlugin = function()
{
	return this._getComponentPluginInstance().setupPlugin(this);
};
oFF.HuComponentPluginController.prototype.getGenesis = function()
{
	return this._getPluginGenesis();
};
oFF.HuComponentPluginController.prototype.getPluginType = function()
{
	return oFF.HuPluginType.COMPONENT;
};

oFF.HuDocumentPluginController = function() {};
oFF.HuDocumentPluginController.prototype = new oFF.HuDfViewPluginController();
oFF.HuDocumentPluginController.prototype._ff_c = "HuDocumentPluginController";

oFF.HuDocumentPluginController.prototype.m_documentDataSpace = null;
oFF.HuDocumentPluginController.prototype.m_documentLayoutManager = null;
oFF.HuDocumentPluginController.prototype.m_documentViewPluginManager = null;
oFF.HuDocumentPluginController.prototype.m_globalDataSpaceChangedUuidList = null;
oFF.HuDocumentPluginController.prototype.m_layoutConfiguration = null;
oFF.HuDocumentPluginController.prototype._cleanUpGlobalDataSpaceListeners = function()
{
	if (oFF.notNull(this.m_globalDataSpaceChangedUuidList) && this.m_globalDataSpaceChangedUuidList.size() > 0)
	{
		if (this._getGlobalDataSpaceBase() !== null)
		{
			oFF.XCollectionUtils.forEach(this.m_globalDataSpaceChangedUuidList, (listnerUuid) => {
				this._getGlobalDataSpaceBase().removeChangeConsumerByUuid(listnerUuid);
			});
		}
		this.m_globalDataSpaceChangedUuidList.clear();
	}
	this.m_globalDataSpaceChangedUuidList = oFF.XObjectExt.release(this.m_globalDataSpaceChangedUuidList);
};
oFF.HuDocumentPluginController.prototype._destroySpecificViewPlugin = function()
{
	this._cleanUpGlobalDataSpaceListeners();
	this.m_documentViewPluginManager = oFF.XObjectExt.release(this.m_documentViewPluginManager);
	this.m_documentLayoutManager = oFF.XObjectExt.release(this.m_documentLayoutManager);
	this.m_layoutConfiguration = oFF.XObjectExt.release(this.m_layoutConfiguration);
	this.m_documentDataSpace = oFF.XObjectExt.release(this.m_documentDataSpace);
};
oFF.HuDocumentPluginController.prototype._ensurePluginModuleDependencies = function(pluginName)
{
	return this.getMainController().getPluginToolsService().ensureModuleDependencies(pluginName);
};
oFF.HuDocumentPluginController.prototype._getDocumentAutoLayoutConfiguration = function()
{
	try
	{
		return this._getDocumentPluginInstance().getAutoLayoutConfiguration();
	}
	catch (err)
	{
		this.logDebug("Missing getAutoLayoutConfiguration method on the document plugin instance!");
	}
	return null;
};
oFF.HuDocumentPluginController.prototype._getDocumentLayoutManager = function()
{
	return this.m_documentLayoutManager;
};
oFF.HuDocumentPluginController.prototype._getDocumentPluginInstance = function()
{
	try
	{
		return this._getPluginInstance();
	}
	catch (err)
	{
		this._throwInvalidPluginTypeException();
	}
	return null;
};
oFF.HuDocumentPluginController.prototype._getDocumentViewPluginManager = function()
{
	return this.m_documentViewPluginManager;
};
oFF.HuDocumentPluginController.prototype._getGlobalDataSpaceBase = function()
{
	return this.getGlobalDataSpace();
};
oFF.HuDocumentPluginController.prototype._initLayoutConfiguration = function()
{
	let tmpLayoutConfig = oFF.HuLayoutConfigurationProcessor.create(this);
	let layoutConfiguration = this.getPluginStartupInfo().getLayoutStructure();
	if (!oFF.XCollectionUtils.hasElements(layoutConfiguration))
	{
		layoutConfiguration = this._getDocumentAutoLayoutConfiguration();
	}
	if (oFF.XCollectionUtils.hasElements(layoutConfiguration))
	{
		tmpLayoutConfig.processJsonElement(layoutConfiguration);
	}
	else
	{
		tmpLayoutConfig.setLayoutType(oFF.HuLayoutType.FLEX);
	}
	return tmpLayoutConfig;
};
oFF.HuDocumentPluginController.prototype._initSpecificViewPlugin = function()
{
	this.getPluginWrapperView().addCssClass("ffHorizonDocumentPlugin");
	this.getPluginWrapperView().setMinHeight(oFF.UiCssLength.create("0"));
	this.getPluginWrapperView().setFlex("1");
	this.m_documentDataSpace = oFF.HuDataSpace.create();
	this.m_layoutConfiguration = this._initLayoutConfiguration();
	this.m_documentLayoutManager = oFF.HuHorizonLayoutManager.create(this, this.m_layoutConfiguration);
	this.m_documentViewPluginManager = oFF.HuHorizonViewPluginManager.create(this);
	this.m_documentViewPluginManager.setPluginInitializedConsumer(this.m_documentLayoutManager.addPluginView.bind(this.m_documentLayoutManager));
	this.m_documentViewPluginManager.setPluginRunErrorConsumer(this.m_documentLayoutManager.removePluginView.bind(this.m_documentLayoutManager));
	this.setRoot(this.m_documentLayoutManager.getView());
};
oFF.HuDocumentPluginController.prototype._postSetWorkspaceTitleNotification = function(newTitle)
{
	let setWorkspaceTitleNotifyData = oFF.XNotificationData.create();
	setWorkspaceTitleNotifyData.putString(oFF.HuHorizonInternalNotifications.NEW_WORKSPACE_TITLE_NOTIFI_DATA, newTitle);
	this.getLocalNotificationCenter().postNotificationWithName(oFF.HuHorizonInternalNotifications.SET_WORKSPACE_TITLE, setWorkspaceTitleNotifyData);
};
oFF.HuDocumentPluginController.prototype._runSpecificPlugin = function()
{
	this._getDocumentPluginInstance().layoutDocument(this);
};
oFF.HuDocumentPluginController.prototype._setupSpecificPlugin = function()
{
	return this._getDocumentPluginInstance().setupPlugin(this);
};
oFF.HuDocumentPluginController.prototype.addGlobalDataSpaceChangedListener = function(listener)
{
	if (oFF.isNull(this.m_globalDataSpaceChangedUuidList))
	{
		this.m_globalDataSpaceChangedUuidList = oFF.XList.create();
	}
	let listenerUuid = this._getGlobalDataSpaceBase().addChangeConsumer(listener);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(listenerUuid))
	{
		this.m_globalDataSpaceChangedUuidList.add(listenerUuid);
	}
	return listenerUuid;
};
oFF.HuDocumentPluginController.prototype.addNewComponentPlugin = function(pluginName, config, containerConfig)
{
	let tmpPluginStartupInfo = oFF.HuPluginStartupInfo.createExt(pluginName, config, null, null, containerConfig);
	return this._ensurePluginModuleDependencies(pluginName).onThenPromise((res) => {
		return this._getDocumentViewPluginManager().runViewPlugin(tmpPluginStartupInfo).onThenExt((newInstance) => {
			return newInstance.getUuid();
		});
	});
};
oFF.HuDocumentPluginController.prototype.destroyComponentPlugin = function(pluginUuid)
{
	let tmpViewPlugin = this._getDocumentViewPluginManager().getPluginByUuid(pluginUuid);
	if (oFF.notNull(tmpViewPlugin))
	{
		this._getDocumentLayoutManager().removePluginView(tmpViewPlugin);
		this._getDocumentViewPluginManager().killPluginByUuid(pluginUuid);
	}
};
oFF.HuDocumentPluginController.prototype.getAllAvailableComponentPlugins = function()
{
	return oFF.HuPluginRegistryBase.getAllLoadedPluginNamesByType(oFF.HuPluginType.COMPONENT);
};
oFF.HuDocumentPluginController.prototype.getAutoLayoutView = function()
{
	return this._getDocumentLayoutManager().getView();
};
oFF.HuDocumentPluginController.prototype.getDataSpace = function()
{
	return this.m_documentDataSpace;
};
oFF.HuDocumentPluginController.prototype.getGenesis = function()
{
	return this._getPluginGenesis();
};
oFF.HuDocumentPluginController.prototype.getGlobalDataSpace = function()
{
	return this._getParentController().getDataSpace();
};
oFF.HuDocumentPluginController.prototype.getMainController = function()
{
	return this._getParentController().getMainController();
};
oFF.HuDocumentPluginController.prototype.getPluginType = function()
{
	return oFF.HuPluginType.DOCUMENT;
};
oFF.HuDocumentPluginController.prototype.getPluginView = function(pluginUuid)
{
	let tmpViewPlugin = this._getDocumentViewPluginManager().getPluginByUuid(pluginUuid);
	if (oFF.notNull(tmpViewPlugin))
	{
		return tmpViewPlugin.getPluginWrapperView();
	}
	return null;
};
oFF.HuDocumentPluginController.prototype.hideComponentPlugin = function(pluginUuid)
{
	let tmpViewPlugin = this._getDocumentViewPluginManager().getPluginByUuid(pluginUuid);
	if (oFF.notNull(tmpViewPlugin))
	{
		this._getDocumentLayoutManager().removePluginView(tmpViewPlugin);
	}
};
oFF.HuDocumentPluginController.prototype.newComponentPlugin = function(pluginName, config, containerConfig)
{
	let tmpPluginStartupInfo = oFF.HuPluginStartupInfo.createExt(pluginName, config, null, null, containerConfig);
	return this._ensurePluginModuleDependencies(pluginName).onThenPromise((res) => {
		return this._getDocumentViewPluginManager().initializeViewPlugin(tmpPluginStartupInfo).onThenPromise((newInstance) => {
			return newInstance.run().onThenExt((newInstance2) => {
				return newInstance.getUuid();
			});
		});
	});
};
oFF.HuDocumentPluginController.prototype.removeGlobalDataSpaceChangedListener = function(listenerUuid)
{
	this._getGlobalDataSpaceBase().removeChangeConsumerByUuid(listenerUuid);
	if (oFF.notNull(this.m_globalDataSpaceChangedUuidList))
	{
		this.m_globalDataSpaceChangedUuidList.removeElement(listenerUuid);
	}
};
oFF.HuDocumentPluginController.prototype.setRoot = function(control)
{
	if (this.getPluginWrapperView().getContent() === this._getDocumentLayoutManager().getView())
	{
		this.getPluginWrapperView().setContent(null);
	}
	this._getPluginGenesis().setRoot(control);
};
oFF.HuDocumentPluginController.prototype.setWorkspaceTitle = function(title)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(title))
	{
		if (this._isRootLevelPlugin())
		{
			this._postSetWorkspaceTitleNotification(title);
		}
		else
		{
			this.logDebug("Only plugins which are direct main controller children can change the workspace title!");
		}
	}
};
oFF.HuDocumentPluginController.prototype.showComponentPlugin = function(pluginUuid)
{
	let tmpViewPlugin = this._getDocumentViewPluginManager().getPluginByUuid(pluginUuid);
	if (oFF.notNull(tmpViewPlugin))
	{
		this._getDocumentLayoutManager().addPluginView(tmpViewPlugin);
	}
};

oFF.HuHorizonLayoutManager = function() {};
oFF.HuHorizonLayoutManager.prototype = new oFF.HuDfHorizonManager();
oFF.HuHorizonLayoutManager.prototype._ff_c = "HuHorizonLayoutManager";

oFF.HuHorizonLayoutManager.create = function(controller, layoutConfiguration)
{
	let newInstance = new oFF.HuHorizonLayoutManager();
	newInstance.m_layoutConfiguration = layoutConfiguration;
	newInstance._setupWithGenericController(controller);
	return newInstance;
};
oFF.HuHorizonLayoutManager.prototype.m_activePluginLayout = null;
oFF.HuHorizonLayoutManager.prototype.m_layoutConfiguration = null;
oFF.HuHorizonLayoutManager.prototype._getManagerName = function()
{
	return "Layout Manager";
};
oFF.HuHorizonLayoutManager.prototype._setupManager = function()
{
	if (oFF.isNull(this.m_layoutConfiguration))
	{
		this.logDebug("No layout configuration specified! Using default layout settings!");
	}
	this.m_activePluginLayout = oFF.HuLayoutFactory.createLayout(this, this.getLayoutType());
	if (oFF.isNull(this.m_activePluginLayout))
	{
		this.logDebug("Critical error during layout initialization!");
	}
	this.logDebug(oFF.XStringUtils.concatenate2("Using layout: ", this.getLayoutType().getName()));
};
oFF.HuHorizonLayoutManager.prototype.addPluginView = function(viewPluginController)
{
	this.m_activePluginLayout.addPluginView(viewPluginController);
};
oFF.HuHorizonLayoutManager.prototype.getLayoutConfigJson = function()
{
	let configStructure = null;
	if (oFF.notNull(this.m_layoutConfiguration))
	{
		configStructure = this.m_layoutConfiguration.getLayoutConfigJson();
	}
	return configStructure;
};
oFF.HuHorizonLayoutManager.prototype.getLayoutType = function()
{
	let layoutType = null;
	if (oFF.notNull(this.m_layoutConfiguration))
	{
		layoutType = this.m_layoutConfiguration.getLayoutType();
	}
	if (oFF.isNull(layoutType))
	{
		layoutType = oFF.HuLayoutType.INTERACTIVE_SPLITTER;
	}
	return layoutType;
};
oFF.HuHorizonLayoutManager.prototype.getView = function()
{
	return this.m_activePluginLayout.getView();
};
oFF.HuHorizonLayoutManager.prototype.isPluginVisible = function(viewPluginController)
{
	return this.m_activePluginLayout.isPluginVisible(viewPluginController);
};
oFF.HuHorizonLayoutManager.prototype.releaseObject = function()
{
	this.m_activePluginLayout = oFF.XObjectExt.release(this.m_activePluginLayout);
	this.m_layoutConfiguration = null;
	oFF.HuDfHorizonManager.prototype.releaseObject.call( this );
};
oFF.HuHorizonLayoutManager.prototype.removePluginView = function(viewPluginController)
{
	this.m_activePluginLayout.removePluginView(viewPluginController);
};

oFF.HuHorizonCommandPluginManager = function() {};
oFF.HuHorizonCommandPluginManager.prototype = new oFF.HuDfHorizonPluginManager();
oFF.HuHorizonCommandPluginManager.prototype._ff_c = "HuHorizonCommandPluginManager";

oFF.HuHorizonCommandPluginManager.create = function(mainController)
{
	let newInstance = new oFF.HuHorizonCommandPluginManager();
	newInstance._setupWithParentController(mainController);
	return newInstance;
};
oFF.HuHorizonCommandPluginManager.prototype.m_commandPluginsStartingInProgess = null;
oFF.HuHorizonCommandPluginManager.prototype._getActionName = function(actionId)
{
	let result = oFF.XStringTokenizer.splitString(actionId, ".");
	if (oFF.notNull(result) && result.size() === 2)
	{
		return result.get(1);
	}
	return null;
};
oFF.HuHorizonCommandPluginManager.prototype._getCommandSpace = function(pluginName)
{
	let runningPlugins = this.getAllRunningPlugins();
	return oFF.XCollectionUtils.findFirst(runningPlugins, (pluginController) => {
		return oFF.XString.isEqual(pluginController.getCommandSpaceName(), pluginName);
	});
};
oFF.HuHorizonCommandPluginManager.prototype._getCommandSpaceName = function(actionId)
{
	let result = oFF.XStringTokenizer.splitString(actionId, ".");
	if (oFF.notNull(result) && result.size() === 2)
	{
		return result.get(0);
	}
	return null;
};
oFF.HuHorizonCommandPluginManager.prototype._getManagerName = function()
{
	return "Command Plugin Manager";
};
oFF.HuHorizonCommandPluginManager.prototype._initializeNewCommandPlugin = function(pluginStartupInfo)
{
	this._onBeforePluginInit(pluginStartupInfo);
	return oFF.HuPluginControllerFactory.createNewController(this._getPluginParentController(), pluginStartupInfo);
};
oFF.HuHorizonCommandPluginManager.prototype._setupPluginManager = function()
{
	this.m_commandPluginsStartingInProgess = oFF.XHashSetOfString.create();
};
oFF.HuHorizonCommandPluginManager.prototype._validateActionId = function(actionId)
{
	let result = oFF.XStringTokenizer.splitString(actionId, ".");
	return oFF.notNull(result) && result.size() === 2;
};
oFF.HuHorizonCommandPluginManager.prototype.actionByIdExists = function(actionId)
{
	let isValid = this._validateActionId(actionId);
	if (isValid)
	{
		let commandSpaceName = this._getCommandSpaceName(actionId);
		let tmpCommandPlugin = this._getCommandSpace(commandSpaceName);
		if (oFF.notNull(tmpCommandPlugin))
		{
			let actionName = this._getActionName(actionId);
			if (tmpCommandPlugin.hasAction(actionName))
			{
				return true;
			}
		}
	}
	return false;
};
oFF.HuHorizonCommandPluginManager.prototype.actionExists = function(pluginName, actionName)
{
	return this.actionByIdExists(oFF.HuUtils.generateActionId(pluginName, actionName));
};
oFF.HuHorizonCommandPluginManager.prototype.executeAction = function(actionId, context, customData)
{
	let executionError = "Unknown error during action execution!";
	let isValid = this._validateActionId(actionId);
	if (isValid)
	{
		let commandSpaceName = this._getCommandSpaceName(actionId);
		let tmpCommandPlugin = this._getCommandSpace(commandSpaceName);
		if (oFF.notNull(tmpCommandPlugin))
		{
			let actionName = this._getActionName(actionId);
			if (tmpCommandPlugin.hasAction(actionName))
			{
				let commandPromise = tmpCommandPlugin.executeCommandSpaceAction(actionName, context, customData);
				if (oFF.isNull(commandPromise))
				{
					commandPromise = oFF.XPromise.resolve(oFF.XBooleanValue.create(true));
				}
				return commandPromise;
			}
			else
			{
				executionError = oFF.XStringUtils.concatenate4("Action ", actionName, " not found on command space ", commandSpaceName);
			}
		}
		else
		{
			executionError = oFF.XStringUtils.concatenate2("Command space not found: ", commandSpaceName);
		}
	}
	else
	{
		executionError = oFF.XStringUtils.concatenate2("Invalid action id: ", actionId);
	}
	this.logInfo(executionError);
	return oFF.XPromise.reject(oFF.XError.create(executionError));
};
oFF.HuHorizonCommandPluginManager.prototype.getAllActionIds = function()
{
	let actionIdsList = oFF.XList.create();
	oFF.XCollectionUtils.forEach(this.getAllRunningPlugins(), (commandPlugin) => {
		actionIdsList.addAll(commandPlugin.getAllActionNames());
	});
	return actionIdsList;
};
oFF.HuHorizonCommandPluginManager.prototype.getAllRunningCommandSpaceNames = function()
{
	let runningPlugins = this.getAllRunningPlugins();
	return oFF.XCollectionUtils.map(runningPlugins, (pluginController) => {
		return pluginController.getCommandSpaceName();
	});
};
oFF.HuHorizonCommandPluginManager.prototype.isCommandSpaceRunning = function(commandPluginName)
{
	let runningPlugins = this.getAllRunningPlugins();
	return oFF.XCollectionUtils.contains(runningPlugins, (pluginController) => {
		return oFF.XString.isEqual(pluginController.getCommandSpaceName(), commandPluginName);
	});
};
oFF.HuHorizonCommandPluginManager.prototype.releaseObject = function()
{
	this.m_commandPluginsStartingInProgess.clear();
	this.m_commandPluginsStartingInProgess = oFF.XObjectExt.release(this.m_commandPluginsStartingInProgess);
	oFF.HuDfHorizonPluginManager.prototype.releaseObject.call( this );
};
oFF.HuHorizonCommandPluginManager.prototype.runAllCommandPlugins = function(pluginList)
{
	if (oFF.notNull(pluginList) && pluginList.hasElements())
	{
		let promiseList = oFF.XPromiseList.create();
		oFF.XCollectionUtils.forEach(pluginList, (commandPluginStartupInfo) => {
			let runPromise = this.runCommandPlugin(commandPluginStartupInfo);
			runPromise.onCatch((err) => {
				this.logDebug(oFF.XStringUtils.concatenate2("Error starting plugin: ", err.getText()));
			});
			promiseList.add(runPromise);
		});
		let allPromise = oFF.XPromise.allSettled(promiseList);
		return allPromise;
	}
	return oFF.XPromise.resolve(oFF.XList.create());
};
oFF.HuHorizonCommandPluginManager.prototype.runCommandPlugin = function(pluginStartupInfo)
{
	if (oFF.isNull(pluginStartupInfo))
	{
		return oFF.XPromise.reject(oFF.XError.create("Cannot create plugin instance! Missing plugin start info!").setErrorType(oFF.HuErrorType.MISSING_PLUGIN_STARTUP_INFO));
	}
	let pluginName = pluginStartupInfo.getPluginName();
	if (!oFF.HuPluginRegistryBase.canPluginBeInitialized(pluginName))
	{
		this.logDebug(oFF.XStringUtils.concatenate2("Plugin not available, cannot create instance -> ", pluginName));
		return oFF.XPromise.reject(oFF.XError.create(oFF.XStringUtils.concatenate3("The command plugin with name ", pluginName, " cannot be found!")).setErrorType(oFF.HuErrorType.PLUGIN_CANNOT_BE_INITIALIZED_ERROR));
	}
	if (this.isCommandSpaceRunning(pluginName) || this.m_commandPluginsStartingInProgess.contains(pluginName))
	{
		this.logDebug(oFF.XStringUtils.concatenate2("Command plugin already running --> ", pluginName));
		return oFF.XPromise.reject(oFF.XError.create(oFF.XStringUtils.concatenate3("The command plugin with name ", pluginName, " is already running!")).setErrorType(oFF.HuErrorType.COMMAND_PLUGIN_ALREADY_RUNNING));
	}
	this.m_commandPluginsStartingInProgess.add(pluginName);
	return this._initializeNewCommandPlugin(pluginStartupInfo).onThenPromise((newInstance) => {
		return this._runPlugin(newInstance).onFinally(() => {
			this.m_commandPluginsStartingInProgess.removeElement(pluginName);
		});
	});
};

oFF.HuHorizonViewPluginManager = function() {};
oFF.HuHorizonViewPluginManager.prototype = new oFF.HuDfHorizonPluginManager();
oFF.HuHorizonViewPluginManager.prototype._ff_c = "HuHorizonViewPluginManager";

oFF.HuHorizonViewPluginManager.create = function(parentController)
{
	let newInstance = new oFF.HuHorizonViewPluginManager();
	newInstance._setupWithParentController(parentController);
	return newInstance;
};
oFF.HuHorizonViewPluginManager.prototype.m_pluginInitialitedConsumer = null;
oFF.HuHorizonViewPluginManager.prototype.m_pluginRunErrorConsumer = null;
oFF.HuHorizonViewPluginManager.prototype._getManagerName = function()
{
	return "View Plugin Manager";
};
oFF.HuHorizonViewPluginManager.prototype._initializeNewGenericViewPlugin = function(pluginStartupInfo)
{
	this._onBeforePluginInit(pluginStartupInfo);
	return oFF.HuPluginControllerFactory.createNewController(this._getPluginParentController(), pluginStartupInfo);
};
oFF.HuHorizonViewPluginManager.prototype._notifyPluginInitialized = function(pluginController)
{
	if (oFF.notNull(this.m_pluginInitialitedConsumer))
	{
		this.m_pluginInitialitedConsumer(pluginController);
	}
};
oFF.HuHorizonViewPluginManager.prototype._notifyPluginRunError = function(pluginController)
{
	if (oFF.notNull(this.m_pluginRunErrorConsumer))
	{
		this.m_pluginRunErrorConsumer(pluginController);
	}
};
oFF.HuHorizonViewPluginManager.prototype._setupPluginManager = function() {};
oFF.HuHorizonViewPluginManager.prototype.initializeViewPlugin = function(pluginStartupInfo)
{
	if (oFF.isNull(pluginStartupInfo))
	{
		return oFF.XPromise.reject(oFF.XError.create("Cannot create plugin instance! Missing plugin start info!").setErrorType(oFF.HuErrorType.MISSING_PLUGIN_STARTUP_INFO));
	}
	let pluginName = pluginStartupInfo.getPluginName();
	if (!oFF.HuPluginRegistryBase.canPluginBeInitialized(pluginName))
	{
		this.logDebug(oFF.XStringUtils.concatenate2("Plugin not available, cannot create instance -> ", pluginName));
		return oFF.XPromise.reject(oFF.XError.create(oFF.XStringUtils.concatenate3("The view plugin with name ", pluginName, " cannot be found!")).setErrorType(oFF.HuErrorType.PLUGIN_CANNOT_BE_INITIALIZED_ERROR));
	}
	return this._initializeNewGenericViewPlugin(pluginStartupInfo);
};
oFF.HuHorizonViewPluginManager.prototype.releaseObject = function()
{
	this.m_pluginInitialitedConsumer = null;
	this.m_pluginRunErrorConsumer = null;
	oFF.HuDfHorizonPluginManager.prototype.releaseObject.call( this );
};
oFF.HuHorizonViewPluginManager.prototype.runAllViewPlugins = function(pluginList)
{
	if (oFF.notNull(pluginList) && pluginList.hasElements())
	{
		let promiseList = oFF.XPromiseList.create();
		oFF.XCollectionUtils.forEach(pluginList, (viewPluginStartupInfo) => {
			let runPromise = this.runViewPlugin(viewPluginStartupInfo);
			runPromise.onCatch((err) => {
				this.logDebug(oFF.XStringUtils.concatenate2("Error starting plugin: ", err.getText()));
			});
			promiseList.add(runPromise);
		});
		let allPromise = oFF.XPromise.allSettled(promiseList);
		return allPromise.onThenExt((allPromiseResult) => {
			let runningPluginList = oFF.XList.create();
			oFF.XCollectionUtils.forEach(allPromiseResult, (result) => {
				if (result.getStatus() === oFF.XPromiseState.FULFILLED)
				{
					runningPluginList.add(result.getValue());
				}
			});
			return runningPluginList;
		});
	}
	return oFF.XPromise.resolve(oFF.XList.create());
};
oFF.HuHorizonViewPluginManager.prototype.runAllViewPluginsInOrder = function(pluginList)
{
	if (oFF.notNull(pluginList) && pluginList.hasElements())
	{
		let initializePromiseList = oFF.XPromiseList.create();
		oFF.XCollectionUtils.forEach(pluginList, (viewPluginStartupInfo) => {
			let initializePluginPromise = this.initializeViewPlugin(viewPluginStartupInfo);
			initializePluginPromise.onCatch((err) => {
				this.logDebug(oFF.XStringUtils.concatenate2("Error during plugin initialization: ", err.getText()));
			});
			initializePromiseList.add(initializePluginPromise);
		});
		let allInitializePromise = oFF.XPromise.allSettled(initializePromiseList);
		return allInitializePromise.onThenPromise((allPromiseResult) => {
			let initializedPluginList = oFF.XList.create();
			oFF.XCollectionUtils.forEach(allPromiseResult, (result) => {
				if (result.getStatus() === oFF.XPromiseState.FULFILLED)
				{
					let pluginControllerInstance = result.getValue();
					let index = pluginList.getIndex(pluginControllerInstance.getPluginStartupInfo());
					if (index >= initializedPluginList.size())
					{
						index = initializedPluginList.size();
					}
					initializedPluginList.insert(index, pluginControllerInstance);
				}
			});
			let runPromiseList = oFF.XPromiseList.create();
			let runningPluginList = oFF.XList.create();
			oFF.XCollectionUtils.forEach(initializedPluginList, (tmpController) => {
				runningPluginList.add(tmpController);
				this._notifyPluginInitialized(tmpController);
				let runPluginPromise = this._runPlugin(tmpController).onCatch((error) => {
					runningPluginList.removeElement(tmpController);
					this._notifyPluginRunError(tmpController);
				});
				runPromiseList.add(runPluginPromise);
			});
			let allRunPromise = oFF.XPromise.allSettled(runPromiseList);
			return allRunPromise.onThenExt((allRunPromiseResult) => {
				return runningPluginList;
			});
		});
	}
	return oFF.XPromise.resolve(oFF.XList.create());
};
oFF.HuHorizonViewPluginManager.prototype.runViewPlugin = function(pluginStartupInfo)
{
	return this.initializeViewPlugin(pluginStartupInfo).onThenPromise((newInstance) => {
		this._notifyPluginInitialized(newInstance);
		return this._runPlugin(newInstance).onCatch((error) => {
			this._notifyPluginRunError(newInstance);
		});
	});
};
oFF.HuHorizonViewPluginManager.prototype.setPluginInitializedConsumer = function(consumer)
{
	this.m_pluginInitialitedConsumer = consumer;
};
oFF.HuHorizonViewPluginManager.prototype.setPluginRunErrorConsumer = function(consumer)
{
	this.m_pluginRunErrorConsumer = consumer;
};

oFF.HuHorizonStatusBarManager = function() {};
oFF.HuHorizonStatusBarManager.prototype = new oFF.HuDfHorizonManager();
oFF.HuHorizonStatusBarManager.prototype._ff_c = "HuHorizonStatusBarManager";

oFF.HuHorizonStatusBarManager.ACTIVITY_INDICATOR_ICON_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsQAAALEBxi1JjQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAMUSURBVEiJrZZLbFVVFIa/f5/Ti7UWq4bYFNHgQEwkyqAiieiAxGBMjGmJqEQiAx048ZmYaNL2WkwLEZSXGlNmTUysASJOQElQGBGMKWEAxoF1QlQMYNPXvfec/TvoU0ofof2Ha6/z/Wutfc7ZW8ykom9RyH8XnIjmMLXJMd7R8Iz5M0gzruzzEl3L+4D6scigxNG4Ktl6+jGaJb7AvLT+Pv0wm0G4YfTDrEnX8l+nwAFqiFxhs3IFlgJ3ElgG8O0FNx885zfn7sBWaM92W3p7vGqgBkDmy9iavI5kgJ8v+dbGBg0dP+eagSXu7+tH764N0wr+XyC055+NwS37Y8ekEUCiayocoLFBQwAbH9HgPyUdWlpQ1+wdtGevCrqAaLONtrR7bFzP4+QQRcUbAaaq86zvHyn5yL9l/bRng94ASAEoul7knwIYvU9b0j3xVFv6zVzgcWUl1lwZ0cPG6cRUAILyD4DbgDPEsGu+wOvVsl6HC4FNaaLHx2Maex3/BOosb6Sl6vubNRjX1uNeeXmIF9edY2fK1exJpDrgEnl6YqFwgBD5/HLFT59crZGUEBqxEZzyPDZyPvpjhGOJWHF7HV+lIXq5Bdi/LQYc4Mcm7QX2AqSIaoAYQmmxDB7o8fKBgXx/JefrFPsvJIJdvyjzASplmoczNUVzbxoV+oQxrFokPlcrdAexuhDDLlH0gwr5BaDimNRT1JXFMgIIFHURdB6oIomvLBSYHqg8lezOhsKOyp5RA8BwAEB2Kx1etqCKS7rbw65GapiM9jhRe96r9sxqz06yz0tuiv6eR/ex03eMhyb/psXyGoVwCqgFvnNMXqao/nmBP3F1GMgPesRbHDnKjqrnJjqaNCj0Wt4MlIFnFbKzbM+emRO+vbJBA/GMM7ZQGj2Lpi5PP5M/Kq9TDD3AitEM/WJzBOJplP4NZMTsHhQelb0JWEvZUCK64LfoKOyf3QCgw3eFctbqoNdg9EufJgNlw4hMlc9b6Qt06uL1aTPfKgBa/BAx2ybpCeyVNrXKVUAexBp2iCdR1U461DsT4j8tvEUHScegaAAAAABJRU5ErkJggg==";
oFF.HuHorizonStatusBarManager.ICON_MARGIN = "0 0.375rem";
oFF.HuHorizonStatusBarManager.create = function(controller)
{
	let newInstance = new oFF.HuHorizonStatusBarManager();
	newInstance._setupWithGenericController(controller);
	return newInstance;
};
oFF.HuHorizonStatusBarManager.prototype.m_clearAllMessagesObserverId = null;
oFF.HuHorizonStatusBarManager.prototype.m_clearMessagesObserverId = null;
oFF.HuHorizonStatusBarManager.prototype.m_didRender = false;
oFF.HuHorizonStatusBarManager.prototype.m_errorsIcon = null;
oFF.HuHorizonStatusBarManager.prototype.m_hideNetworkActivityIndicatorObserverId = null;
oFF.HuHorizonStatusBarManager.prototype.m_infoIcon = null;
oFF.HuHorizonStatusBarManager.prototype.m_networkActivityIndicator = null;
oFF.HuHorizonStatusBarManager.prototype.m_newMessagesObserverId = null;
oFF.HuHorizonStatusBarManager.prototype.m_showNetworkActivityIndicatorObserverId = null;
oFF.HuHorizonStatusBarManager.prototype.m_statusLabel = null;
oFF.HuHorizonStatusBarManager.prototype.m_statusMessageChangedObserverId = null;
oFF.HuHorizonStatusBarManager.prototype.m_successIcon = null;
oFF.HuHorizonStatusBarManager.prototype.m_warningsIcon = null;
oFF.HuHorizonStatusBarManager.prototype.m_wrapperLayout = null;
oFF.HuHorizonStatusBarManager.prototype._addMessage = function(message)
{
	if (oFF.notNull(message))
	{
		if (message.getMessageType() === oFF.HuMessageType.INFORMATION)
		{
			this._addMessageToIconWidget(message, this._getInfoMessageIcon());
		}
		else if (message.getMessageType() === oFF.HuMessageType.SUCCESS)
		{
			this._addMessageToIconWidget(message, this._getSuccessMessageIcon());
		}
		else if (message.getMessageType() === oFF.HuMessageType.WARNING)
		{
			this._addMessageToIconWidget(message, this._getWarningMessageIcon());
		}
		else if (message.getMessageType() === oFF.HuMessageType.ERROR)
		{
			this._addMessageToIconWidget(message, this._getErrorMessageIcon());
			this._presentErrorMessagePopoverIfNecessary();
		}
	}
};
oFF.HuHorizonStatusBarManager.prototype._addMessageToIconWidget = function(newMessage, iconWidget)
{
	if (oFF.notNull(newMessage) && oFF.notNull(iconWidget))
	{
		iconWidget.addMessage(newMessage.getTitle(), newMessage.getSubtitle(), newMessage.getDescription(), newMessage.getMessageGroup().getDisplayName());
		if (!iconWidget.isVisible() && iconWidget.getNumberOfMessages() > 0)
		{
			iconWidget.setVisible(true);
		}
	}
};
oFF.HuHorizonStatusBarManager.prototype._clearAllMessages = function()
{
	this._clearMessagesByType(oFF.HuMessageType.INFORMATION);
	this._clearMessagesByType(oFF.HuMessageType.SUCCESS);
	this._clearMessagesByType(oFF.HuMessageType.WARNING);
	this._clearMessagesByType(oFF.HuMessageType.ERROR);
};
oFF.HuHorizonStatusBarManager.prototype._clearMessagesByType = function(messageType)
{
	if (messageType === oFF.HuMessageType.INFORMATION)
	{
		this._clearMessagesForIconWidget(this._getInfoMessageIcon());
	}
	else if (messageType === oFF.HuMessageType.SUCCESS)
	{
		this._clearMessagesForIconWidget(this._getSuccessMessageIcon());
	}
	else if (messageType === oFF.HuMessageType.WARNING)
	{
		this._clearMessagesForIconWidget(this._getWarningMessageIcon());
	}
	else if (messageType === oFF.HuMessageType.ERROR)
	{
		this._clearMessagesForIconWidget(this._getErrorMessageIcon());
	}
};
oFF.HuHorizonStatusBarManager.prototype._clearMessagesForIconWidget = function(iconWidget)
{
	if (oFF.notNull(iconWidget))
	{
		iconWidget.clearAllMessages();
		if (iconWidget.isVisible() && iconWidget.getNumberOfMessages() === 0)
		{
			iconWidget.setVisible(false);
		}
	}
};
oFF.HuHorizonStatusBarManager.prototype._createStatusBarIfNeeded = function()
{
	if (oFF.isNull(this.m_wrapperLayout))
	{
		this.m_wrapperLayout = this.getGenesis().newControl(oFF.UiType.FLEX_LAYOUT);
		this.m_wrapperLayout.addCssClass("ffHorizonStatusBar");
		this.m_wrapperLayout.setAlignItems(oFF.UiFlexAlignItems.CENTER);
		this.m_wrapperLayout.setFlex("0 0 auto");
		this.m_wrapperLayout.setBackgroundDesign(oFF.UiBackgroundDesign.SOLID);
		this.m_wrapperLayout.setPadding(oFF.UiCssBoxEdges.create("0.375rem"));
		this.m_wrapperLayout.setHeight(oFF.UiCssLength.create("2rem"));
		this.m_wrapperLayout.registerOnAfterRender(oFF.UiLambdaAfterRenderListener.create(this._handleStatusBarRendered.bind(this)));
		this.m_wrapperLayout.addItem(this._getStatusLabel());
		this.m_wrapperLayout.addItem(this._getInfoMessageIcon().getView());
		this.m_wrapperLayout.addItem(this._getSuccessMessageIcon().getView());
		this.m_wrapperLayout.addItem(this._getWarningMessageIcon().getView());
		this.m_wrapperLayout.addItem(this._getErrorMessageIcon().getView());
		this.m_wrapperLayout.addItem(this._getNetworkActivityIndicator());
	}
	return this.m_wrapperLayout;
};
oFF.HuHorizonStatusBarManager.prototype._getErrorMessageIcon = function()
{
	if (oFF.isNull(this.m_errorsIcon))
	{
		this.m_errorsIcon = oFF.UtMessageIconWidget.create(this.getGenesis(), oFF.UiMessageType.ERROR);
		this.m_errorsIcon.setMargin(oFF.UiCssBoxEdges.create(oFF.HuHorizonStatusBarManager.ICON_MARGIN));
		this.m_errorsIcon.setVisible(false);
		this.m_errorsIcon.setShowClearButton(true);
		this.m_errorsIcon.setClearPressProcedure(() => {
			this._clearMessagesByType(oFF.HuMessageType.ERROR);
			this._postClearMessagesPressedNotification(oFF.HuMessageType.ERROR);
		});
	}
	return this.m_errorsIcon;
};
oFF.HuHorizonStatusBarManager.prototype._getInfoMessageIcon = function()
{
	if (oFF.isNull(this.m_infoIcon))
	{
		this.m_infoIcon = oFF.UtMessageIconWidget.create(this.getGenesis(), oFF.UiMessageType.INFORMATION);
		this.m_infoIcon.setMargin(oFF.UiCssBoxEdges.create(oFF.HuHorizonStatusBarManager.ICON_MARGIN));
		this.m_infoIcon.setVisible(false);
		this.m_infoIcon.setShowClearButton(true);
		this.m_infoIcon.setClearPressProcedure(() => {
			this._clearMessagesByType(oFF.HuMessageType.INFORMATION);
			this._postClearMessagesPressedNotification(oFF.HuMessageType.INFORMATION);
		});
	}
	return this.m_infoIcon;
};
oFF.HuHorizonStatusBarManager.prototype._getManagerName = function()
{
	return "StatusBar Manager";
};
oFF.HuHorizonStatusBarManager.prototype._getNetworkActivityIndicator = function()
{
	if (oFF.isNull(this.m_networkActivityIndicator))
	{
		this.m_networkActivityIndicator = this.getGenesis().newControl(oFF.UiType.ACTIVITY_INDICATOR);
		this.m_networkActivityIndicator.setIconSize(oFF.UiCssLength.create("1rem"));
		this.m_networkActivityIndicator.setSrc(oFF.HuHorizonStatusBarManager.ACTIVITY_INDICATOR_ICON_BASE64);
		this.m_networkActivityIndicator.setTooltip("Requesting backend data...");
		this.m_networkActivityIndicator.setMargin(oFF.UiCssBoxEdges.create(oFF.HuHorizonStatusBarManager.ICON_MARGIN));
		this.m_networkActivityIndicator.setFlex("0 0 auto");
		this.m_networkActivityIndicator.setVisible(false);
	}
	return this.m_networkActivityIndicator;
};
oFF.HuHorizonStatusBarManager.prototype._getStatusLabel = function()
{
	if (oFF.isNull(this.m_statusLabel))
	{
		this.m_statusLabel = this.getGenesis().newControl(oFF.UiType.LABEL);
		this.m_statusLabel.setFlex("auto");
	}
	return this.m_statusLabel;
};
oFF.HuHorizonStatusBarManager.prototype._getSuccessMessageIcon = function()
{
	if (oFF.isNull(this.m_successIcon))
	{
		this.m_successIcon = oFF.UtMessageIconWidget.create(this.getGenesis(), oFF.UiMessageType.SUCCESS);
		this.m_successIcon.setMargin(oFF.UiCssBoxEdges.create(oFF.HuHorizonStatusBarManager.ICON_MARGIN));
		this.m_successIcon.setVisible(false);
		this.m_successIcon.setShowClearButton(true);
		this.m_successIcon.setClearPressProcedure(() => {
			this._clearMessagesByType(oFF.HuMessageType.SUCCESS);
			this._postClearMessagesPressedNotification(oFF.HuMessageType.SUCCESS);
		});
	}
	return this.m_successIcon;
};
oFF.HuHorizonStatusBarManager.prototype._getWarningMessageIcon = function()
{
	if (oFF.isNull(this.m_warningsIcon))
	{
		this.m_warningsIcon = oFF.UtMessageIconWidget.create(this.getGenesis(), oFF.UiMessageType.WARNING);
		this.m_warningsIcon.setMargin(oFF.UiCssBoxEdges.create(oFF.HuHorizonStatusBarManager.ICON_MARGIN));
		this.m_warningsIcon.setVisible(false);
		this.m_warningsIcon.setShowClearButton(true);
		this.m_warningsIcon.setClearPressProcedure(() => {
			this._clearMessagesByType(oFF.HuMessageType.WARNING);
			this._postClearMessagesPressedNotification(oFF.HuMessageType.WARNING);
		});
	}
	return this.m_warningsIcon;
};
oFF.HuHorizonStatusBarManager.prototype._handleClearMessagesNotification = function(notifyData)
{
	if (oFF.notNull(notifyData))
	{
		let messageType = notifyData.getXObjectByKey(oFF.HuHorizonInternalNotifications.MESSAGE_MANAGER_CLEAR_MESSAGES_MESSAGE_TYPE_NOTIFI_DATA);
		this._clearMessagesByType(messageType);
	}
};
oFF.HuHorizonStatusBarManager.prototype._handleNewMessageNotification = function(notifyData)
{
	if (oFF.notNull(notifyData))
	{
		let newMessage = notifyData.getXObjectByKey(oFF.HuHorizonInternalNotifications.MESSAGE_MANAGER_NEW_MESSAGE_MESSAGE_NOTIFI_DATA);
		this._addMessage(newMessage);
	}
};
oFF.HuHorizonStatusBarManager.prototype._handleStatusBarRendered = function(controlEvent)
{
	if (oFF.notNull(this.m_wrapperLayout))
	{
		this.m_wrapperLayout.registerOnAfterRender(null);
	}
	this.m_didRender = true;
	this._presentErrorMessagePopoverIfNecessary();
};
oFF.HuHorizonStatusBarManager.prototype._handleStatusMessageChangedNotification = function(notifyData)
{
	if (oFF.notNull(notifyData))
	{
		let newStatusMsg = notifyData.getStringByKey(oFF.HuHorizonInternalNotifications.MESSAGE_MANAGER_STATUS_MESSAGE_CHANGED_NEW_MESSAGE_NOTIFI_DATA);
		this.setStatusMessage(newStatusMsg);
	}
};
oFF.HuHorizonStatusBarManager.prototype._postClearMessagesPressedNotification = function(messageType)
{
	let notifyData = oFF.XNotificationData.create();
	notifyData.putXObject(oFF.HuHorizonInternalNotifications.STATUS_BAR_MANAGER_CLEAR_MESSAGES_PRESSED_MESSAGE_TYPE_NOTIFY_DATA, messageType);
	this.getLocalNotificationCenter().postNotificationWithName(oFF.HuHorizonInternalNotifications.STATUS_BAR_MANAGER_CLEAR_MESSAGES_PRESSED, notifyData);
};
oFF.HuHorizonStatusBarManager.prototype._presentErrorMessagePopoverIfNecessary = function()
{
	if (this.m_didRender && this.isStatusBarVisible() && this._getErrorMessageIcon().hasMessages())
	{
		this._getErrorMessageIcon().open();
	}
};
oFF.HuHorizonStatusBarManager.prototype._setNetworkActivityIndicatorVisible = function(visible)
{
	this._getNetworkActivityIndicator().setVisible(visible);
};
oFF.HuHorizonStatusBarManager.prototype._setupManager = function()
{
	this.m_didRender = false;
	this.m_showNetworkActivityIndicatorObserverId = this.getLocalNotificationCenter().addObserverForName(oFF.HuHorizonInternalNotifications.STATUS_BAR_MANAGER_SHOW_NETWORK_ACTIVITY_INDICATOR, (notifyData) => {
		this.showNetworkActivityIndicator();
	});
	this.m_hideNetworkActivityIndicatorObserverId = this.getLocalNotificationCenter().addObserverForName(oFF.HuHorizonInternalNotifications.STATUS_BAR_MANAGER_HIDE_NETWORK_ACTIVITY_INDICATOR, (notifyData) => {
		this.hideNetworkActivityIndicator();
	});
	this.m_statusMessageChangedObserverId = this.getLocalNotificationCenter().addObserverForName(oFF.HuHorizonInternalNotifications.MESSAGE_MANAGER_STATUS_MESSAGE_CHANGED, this._handleStatusMessageChangedNotification.bind(this));
	this.m_newMessagesObserverId = this.getLocalNotificationCenter().addObserverForName(oFF.HuHorizonInternalNotifications.MESSAGE_MANAGER_NEW_MESSAGE, this._handleNewMessageNotification.bind(this));
	this.m_clearMessagesObserverId = this.getLocalNotificationCenter().addObserverForName(oFF.HuHorizonInternalNotifications.MESSAGE_MANAGER_CLEAR_MESSAGES, this._handleClearMessagesNotification.bind(this));
	this.m_clearAllMessagesObserverId = this.getLocalNotificationCenter().addObserverForName(oFF.HuHorizonInternalNotifications.MESSAGE_MANAGER_CLEAR_ALL_MESSAGES, (notifyData) => {
		this._clearAllMessages();
	});
};
oFF.HuHorizonStatusBarManager.prototype._updateStatusLabel = function(message, color)
{
	this._getStatusLabel().setText(message);
	this._getStatusLabel().setFontColor(color);
};
oFF.HuHorizonStatusBarManager.prototype.addAllMessages = function(messages)
{
	oFF.XCollectionUtils.forEach(messages, (message) => {
		this._addMessage(message);
	});
};
oFF.HuHorizonStatusBarManager.prototype.getView = function()
{
	return this._createStatusBarIfNeeded();
};
oFF.HuHorizonStatusBarManager.prototype.hideNetworkActivityIndicator = function()
{
	this._setNetworkActivityIndicatorVisible(false);
};
oFF.HuHorizonStatusBarManager.prototype.isStatusBarVisible = function()
{
	return this.getView().isVisible();
};
oFF.HuHorizonStatusBarManager.prototype.releaseObject = function()
{
	this.getLocalNotificationCenter().removeObserverByUuid(this.m_showNetworkActivityIndicatorObserverId);
	this.getLocalNotificationCenter().removeObserverByUuid(this.m_hideNetworkActivityIndicatorObserverId);
	this.getLocalNotificationCenter().removeObserverByUuid(this.m_statusMessageChangedObserverId);
	this.getLocalNotificationCenter().removeObserverByUuid(this.m_newMessagesObserverId);
	this.getLocalNotificationCenter().removeObserverByUuid(this.m_clearMessagesObserverId);
	this.getLocalNotificationCenter().removeObserverByUuid(this.m_clearAllMessagesObserverId);
	this.m_networkActivityIndicator = oFF.XObjectExt.release(this.m_networkActivityIndicator);
	this.m_infoIcon = oFF.XObjectExt.release(this.m_infoIcon);
	this.m_successIcon = oFF.XObjectExt.release(this.m_successIcon);
	this.m_errorsIcon = oFF.XObjectExt.release(this.m_errorsIcon);
	this.m_warningsIcon = oFF.XObjectExt.release(this.m_warningsIcon);
	this.m_statusLabel = oFF.XObjectExt.release(this.m_statusLabel);
	this.m_wrapperLayout = oFF.XObjectExt.release(this.m_wrapperLayout);
	oFF.HuDfHorizonManager.prototype.releaseObject.call( this );
};
oFF.HuHorizonStatusBarManager.prototype.setStatusBarVisible = function(visible)
{
	this.getView().setVisible(visible);
};
oFF.HuHorizonStatusBarManager.prototype.setStatusMessage = function(message)
{
	this._updateStatusLabel(message, null);
};
oFF.HuHorizonStatusBarManager.prototype.showNetworkActivityIndicator = function()
{
	this._setNetworkActivityIndicatorVisible(true);
};
oFF.HuHorizonStatusBarManager.prototype.toggleStatusBar = function()
{
	this.setStatusBarVisible(!this.isStatusBarVisible());
};

oFF.HuHorizonToolbarManager = function() {};
oFF.HuHorizonToolbarManager.prototype = new oFF.HuDfHorizonManager();
oFF.HuHorizonToolbarManager.prototype._ff_c = "HuHorizonToolbarManager";

oFF.HuHorizonToolbarManager.create = function(controller)
{
	let newInstance = new oFF.HuHorizonToolbarManager();
	newInstance._setupWithGenericController(controller);
	return newInstance;
};
oFF.HuHorizonToolbarManager.prototype.m_groupMap = null;
oFF.HuHorizonToolbarManager.prototype.m_toolbarWidget = null;
oFF.HuHorizonToolbarManager.prototype._createToolbarIfNeeded = function()
{
	if (oFF.isNull(this.m_toolbarWidget))
	{
		this.m_toolbarWidget = oFF.UtToolbarWidget.create(this.getGenesis());
		this.m_toolbarWidget.addCssClass("ffHorizonToolbar");
	}
	return this.m_toolbarWidget;
};
oFF.HuHorizonToolbarManager.prototype._getManagerName = function()
{
	return "Toolbar Manager";
};
oFF.HuHorizonToolbarManager.prototype._setupManager = function()
{
	this.m_groupMap = oFF.XLinkedHashMapByString.create();
};
oFF.HuHorizonToolbarManager.prototype.clearToolbarGroups = function()
{
	this.m_groupMap.clear();
	this._createToolbarIfNeeded().clearItems();
};
oFF.HuHorizonToolbarManager.prototype.createNewGroup = function(groupName)
{
	let tmpGroup = this.getGroupByName(groupName);
	if (oFF.isNull(tmpGroup))
	{
		tmpGroup = this._createToolbarIfNeeded().getToolbarSection().newGroup();
		this.m_groupMap.put(groupName, tmpGroup);
	}
	return tmpGroup;
};
oFF.HuHorizonToolbarManager.prototype.getGroupByName = function(groupName)
{
	return this.m_groupMap.getByKey(groupName);
};
oFF.HuHorizonToolbarManager.prototype.getGroupByNameCreateIfNeeded = function(groupName)
{
	let tmpGroup = this.getGroupByName(groupName);
	if (oFF.isNull(tmpGroup))
	{
		tmpGroup = this.createNewGroup(groupName);
	}
	return tmpGroup;
};
oFF.HuHorizonToolbarManager.prototype.getView = function()
{
	return this._createToolbarIfNeeded().getView();
};
oFF.HuHorizonToolbarManager.prototype.hasItems = function()
{
	if (oFF.notNull(this.m_groupMap) && this.m_groupMap.hasElements())
	{
		let foundGroup = oFF.XCollectionUtils.findFirst(this.m_groupMap, (tmpGroup) => {
			return tmpGroup.getItems() !== null && tmpGroup.getItems().hasElements();
		});
		return oFF.notNull(foundGroup);
	}
	return false;
};
oFF.HuHorizonToolbarManager.prototype.isToolbarVisible = function()
{
	return this._createToolbarIfNeeded().getView().isVisible();
};
oFF.HuHorizonToolbarManager.prototype.releaseObject = function()
{
	this.m_groupMap.clear();
	this.m_groupMap = oFF.XObjectExt.release(this.m_groupMap);
	this.m_toolbarWidget = oFF.XObjectExt.release(this.m_toolbarWidget);
	oFF.HuDfHorizonManager.prototype.releaseObject.call( this );
};
oFF.HuHorizonToolbarManager.prototype.renderToolbar = function()
{
	if (oFF.notNull(this.m_groupMap) && this.m_groupMap.hasElements())
	{
		oFF.XCollectionUtils.forEach(this.m_groupMap, (tmpGroup) => {
			this._createToolbarIfNeeded().getToolbarSection().addGroup(tmpGroup);
		});
	}
};
oFF.HuHorizonToolbarManager.prototype.setToolbarVisible = function(visible)
{
	this._createToolbarIfNeeded().getView().setVisible(visible);
};

oFF.HuHorizonConfigurationProcessor = function() {};
oFF.HuHorizonConfigurationProcessor.prototype = new oFF.HuDfConfigurationProcessor();
oFF.HuHorizonConfigurationProcessor.prototype._ff_c = "HuHorizonConfigurationProcessor";

oFF.HuHorizonConfigurationProcessor.MENU_VISIBLE = "menuVisible";
oFF.HuHorizonConfigurationProcessor.MODE = "mode";
oFF.HuHorizonConfigurationProcessor.PLUGIN_DIRECTORIES = "pluginDirectories";
oFF.HuHorizonConfigurationProcessor.STATUS_BAR_VISIBLE = "statusBarVisible";
oFF.HuHorizonConfigurationProcessor.TITLE = "title";
oFF.HuHorizonConfigurationProcessor.TOOLBAR_VISIBLE = "toolbarVisible";
oFF.HuHorizonConfigurationProcessor.create = function(toolsContext)
{
	let newInstance = new oFF.HuHorizonConfigurationProcessor();
	newInstance._setupWithToolsContext(toolsContext);
	return newInstance;
};
oFF.HuHorizonConfigurationProcessor.prototype.m_configurationJson = null;
oFF.HuHorizonConfigurationProcessor.prototype._getConfigurationJson = function()
{
	return this.m_configurationJson;
};
oFF.HuHorizonConfigurationProcessor.prototype._getConfigurationProcessorName = function()
{
	return "Horizon";
};
oFF.HuHorizonConfigurationProcessor.prototype._isProductionMode = function()
{
	return this.getFrameworkMode() === oFF.HuFrameworkMode.PRODUCTION;
};
oFF.HuHorizonConfigurationProcessor.prototype._postFrameworkModeChangedNotification = function()
{
	this.getLocalNotificationCenter().postNotificationWithName(oFF.HuHorizonInternalNotifications.FRAMEWORK_MODE_CHANGED, null);
};
oFF.HuHorizonConfigurationProcessor.prototype._postHorizonConfigurationChangedNotification = function()
{
	this.getLocalNotificationCenter().postNotificationWithName(oFF.HuHorizonInternalNotifications.HORIZON_CONFIGURATION_CHANGED, null);
};
oFF.HuHorizonConfigurationProcessor.prototype._processConfigurationElement = function(jsonElement)
{
	if (oFF.notNull(jsonElement))
	{
		if (jsonElement.isStructure())
		{
			this.m_configurationJson = jsonElement.asStructure();
		}
	}
	else
	{
		this.logDebug("Missing configuration structure!");
	}
};
oFF.HuHorizonConfigurationProcessor.prototype._setupConfigurationProcessor = function() {};
oFF.HuHorizonConfigurationProcessor.prototype.addPluginDirectory = function(directory)
{
	let pluginDirList = this._getConfigurationJson().getListByKey(oFF.HuHorizonConfigurationProcessor.PLUGIN_DIRECTORIES);
	if (oFF.isNull(pluginDirList))
	{
		pluginDirList = this._getConfigurationJson().putNewList(oFF.HuHorizonConfigurationProcessor.PLUGIN_DIRECTORIES);
	}
	if (oFF.XStringUtils.isNotNullAndNotEmpty(directory))
	{
		pluginDirList.addString(directory);
		this._postHorizonConfigurationChangedNotification();
	}
	return this;
};
oFF.HuHorizonConfigurationProcessor.prototype.getFrameworkMode = function()
{
	let mode = oFF.HuFrameworkMode.lookup(this._getConfigurationJson().getStringByKey(oFF.HuHorizonConfigurationProcessor.MODE));
	if (oFF.isNull(mode))
	{
		mode = oFF.HuFrameworkMode.PRODUCTION;
	}
	return mode;
};
oFF.HuHorizonConfigurationProcessor.prototype.getPluginDirectories = function()
{
	let pluginDirList = this._getConfigurationJson().getListByKey(oFF.HuHorizonConfigurationProcessor.PLUGIN_DIRECTORIES);
	let tmpList = oFF.XList.create();
	if (oFF.notNull(pluginDirList))
	{
		for (let k = 0; k < pluginDirList.size(); k++)
		{
			if (pluginDirList.getElementTypeAt(k) === oFF.PrElementType.STRING)
			{
				let tmpPath = pluginDirList.getStringAt(k);
				tmpList.add(tmpPath);
			}
		}
	}
	return tmpList;
};
oFF.HuHorizonConfigurationProcessor.prototype.getWorkspaceTitle = function()
{
	return this._getConfigurationJson().getStringByKeyExt(oFF.HuHorizonConfigurationProcessor.TITLE, "Horizon");
};
oFF.HuHorizonConfigurationProcessor.prototype.isMenuVisible = function()
{
	return this._getConfigurationJson().getBooleanByKeyExt(oFF.HuHorizonConfigurationProcessor.MENU_VISIBLE, !this._isProductionMode());
};
oFF.HuHorizonConfigurationProcessor.prototype.isStatusBarVisible = function()
{
	return this._getConfigurationJson().getBooleanByKeyExt(oFF.HuHorizonConfigurationProcessor.STATUS_BAR_VISIBLE, !this._isProductionMode());
};
oFF.HuHorizonConfigurationProcessor.prototype.isToolbarPropertySet = function()
{
	return this._getConfigurationJson().containsKey(oFF.HuHorizonConfigurationProcessor.TOOLBAR_VISIBLE);
};
oFF.HuHorizonConfigurationProcessor.prototype.isToolbarVisible = function()
{
	return this._getConfigurationJson().getBooleanByKeyExt(oFF.HuHorizonConfigurationProcessor.TOOLBAR_VISIBLE, !this._isProductionMode());
};
oFF.HuHorizonConfigurationProcessor.prototype.releaseObject = function()
{
	this.m_configurationJson = null;
	oFF.HuDfConfigurationProcessor.prototype.releaseObject.call( this );
};
oFF.HuHorizonConfigurationProcessor.prototype.removePluginDirectory = function(directory)
{
	let pluginDirList = this._getConfigurationJson().getListByKey(oFF.HuHorizonConfigurationProcessor.PLUGIN_DIRECTORIES);
	if (oFF.isNull(pluginDirList))
	{
		pluginDirList = this._getConfigurationJson().putNewList(oFF.HuHorizonConfigurationProcessor.PLUGIN_DIRECTORIES);
	}
	if (oFF.XStringUtils.isNotNullAndNotEmpty(directory))
	{
		pluginDirList.removeElement(oFF.PrFactory.createString(directory));
		this._postHorizonConfigurationChangedNotification();
	}
	return this;
};
oFF.HuHorizonConfigurationProcessor.prototype.setFrameworkMode = function(mode)
{
	if (oFF.notNull(mode))
	{
		let didChange = this.getFrameworkMode() !== mode;
		this._getConfigurationJson().putString(oFF.HuHorizonConfigurationProcessor.MODE, mode.getName());
		this._postHorizonConfigurationChangedNotification();
		if (didChange)
		{
			this._postFrameworkModeChangedNotification();
		}
	}
	return this;
};
oFF.HuHorizonConfigurationProcessor.prototype.setMenuVisible = function(visible)
{
	this._getConfigurationJson().putBoolean(oFF.HuHorizonConfigurationProcessor.MENU_VISIBLE, visible);
	this._postHorizonConfigurationChangedNotification();
	return this;
};
oFF.HuHorizonConfigurationProcessor.prototype.setStatusBarVisible = function(visible)
{
	this._getConfigurationJson().putBoolean(oFF.HuHorizonConfigurationProcessor.STATUS_BAR_VISIBLE, visible);
	this._postHorizonConfigurationChangedNotification();
	return this;
};
oFF.HuHorizonConfigurationProcessor.prototype.setToolbarVisible = function(visible)
{
	this._getConfigurationJson().putBoolean(oFF.HuHorizonConfigurationProcessor.TOOLBAR_VISIBLE, visible);
	this._postHorizonConfigurationChangedNotification();
	return this;
};
oFF.HuHorizonConfigurationProcessor.prototype.setWorkspaceTitle = function(newTitle)
{
	this._getConfigurationJson().putString(oFF.HuHorizonConfigurationProcessor.TITLE, newTitle);
	this._postHorizonConfigurationChangedNotification();
	return this;
};

oFF.HuLayoutConfigurationProcessor = function() {};
oFF.HuLayoutConfigurationProcessor.prototype = new oFF.HuDfConfigurationProcessor();
oFF.HuLayoutConfigurationProcessor.prototype._ff_c = "HuLayoutConfigurationProcessor";

oFF.HuLayoutConfigurationProcessor.CONFIG = "config";
oFF.HuLayoutConfigurationProcessor.TYPE = "type";
oFF.HuLayoutConfigurationProcessor.create = function(toolsContext)
{
	let newInstance = new oFF.HuLayoutConfigurationProcessor();
	newInstance._setupWithToolsContext(toolsContext);
	return newInstance;
};
oFF.HuLayoutConfigurationProcessor.prototype.m_layoutConfigJson = null;
oFF.HuLayoutConfigurationProcessor.prototype.m_layoutType = null;
oFF.HuLayoutConfigurationProcessor.prototype._getConfigurationProcessorName = function()
{
	return "Layout";
};
oFF.HuLayoutConfigurationProcessor.prototype._processConfigurationElement = function(jsonElement)
{
	if (oFF.notNull(jsonElement))
	{
		if (jsonElement.isStructure())
		{
			this._processLayoutStructure(jsonElement.asStructure());
		}
	}
	else
	{
		this.logDebug("Missing configuration structure!");
	}
};
oFF.HuLayoutConfigurationProcessor.prototype._processLayoutStructure = function(layoutStructure)
{
	let typeStr = layoutStructure.getStringByKey(oFF.HuLayoutConfigurationProcessor.TYPE);
	this.m_layoutType = oFF.HuLayoutType.lookup(typeStr);
	this.m_layoutConfigJson = layoutStructure.getStructureByKey(oFF.HuLayoutConfigurationProcessor.CONFIG);
};
oFF.HuLayoutConfigurationProcessor.prototype._setupConfigurationProcessor = function()
{
	this.m_layoutType = null;
	this.m_layoutConfigJson = null;
};
oFF.HuLayoutConfigurationProcessor.prototype.getLayoutConfigJson = function()
{
	return this.m_layoutConfigJson;
};
oFF.HuLayoutConfigurationProcessor.prototype.getLayoutType = function()
{
	return this.m_layoutType;
};
oFF.HuLayoutConfigurationProcessor.prototype.releaseObject = function()
{
	this.m_layoutType = null;
	this.m_layoutConfigJson = null;
	oFF.HuDfConfigurationProcessor.prototype.releaseObject.call( this );
};
oFF.HuLayoutConfigurationProcessor.prototype.setLayoutType = function(layoutType)
{
	this.m_layoutType = layoutType;
	return this;
};

oFF.HuPluginsConfigurationProcessor = function() {};
oFF.HuPluginsConfigurationProcessor.prototype = new oFF.HuDfConfigurationProcessor();
oFF.HuPluginsConfigurationProcessor.prototype._ff_c = "HuPluginsConfigurationProcessor";

oFF.HuPluginsConfigurationProcessor.create = function(toolsContext)
{
	let newInstance = new oFF.HuPluginsConfigurationProcessor();
	newInstance._setupWithToolsContext(toolsContext);
	return newInstance;
};
oFF.HuPluginsConfigurationProcessor.prototype.m_allConfigPlugins = null;
oFF.HuPluginsConfigurationProcessor.prototype.m_invalidPluginNames = null;
oFF.HuPluginsConfigurationProcessor.prototype.m_startupCommandPlugins = null;
oFF.HuPluginsConfigurationProcessor.prototype.m_startupViewPlugins = null;
oFF.HuPluginsConfigurationProcessor.prototype._getConfigurationProcessorName = function()
{
	return "Plugins";
};
oFF.HuPluginsConfigurationProcessor.prototype._groupPlugins = function()
{
	if (oFF.notNull(this.m_allConfigPlugins) && this.m_allConfigPlugins.size() > 0)
	{
		this.m_startupViewPlugins.clear();
		this.m_startupCommandPlugins.clear();
		oFF.XCollectionUtils.forEach(this.m_allConfigPlugins, (tmpPluginStartupInfo) => {
			let tmpPluginFactory = oFF.HuPluginRegistryBase.getPluginFactory(tmpPluginStartupInfo.getPluginName());
			if (tmpPluginFactory.getPluginType() === oFF.HuPluginType.COMPONENT)
			{
				this.m_startupViewPlugins.add(tmpPluginStartupInfo);
			}
			else if (tmpPluginFactory.getPluginType() === oFF.HuPluginType.DOCUMENT)
			{
				this.m_startupViewPlugins.add(tmpPluginStartupInfo);
			}
			else if (tmpPluginFactory.getPluginType() === oFF.HuPluginType.COMMAND)
			{
				this.m_startupCommandPlugins.add(tmpPluginStartupInfo);
			}
		});
	}
};
oFF.HuPluginsConfigurationProcessor.prototype._processConfigurationElement = function(jsonElement)
{
	if (oFF.notNull(jsonElement))
	{
		if (jsonElement.isStructure())
		{
			this._processPluginStructure(jsonElement.asStructure());
		}
		else if (jsonElement.isList())
		{
			this._processPluginList(jsonElement.asList());
		}
		else if (jsonElement.isString())
		{
			this._processPluginString(jsonElement.asString());
		}
	}
};
oFF.HuPluginsConfigurationProcessor.prototype._processPluginList = function(pluginList)
{
	oFF.XCollectionUtils.forEach(pluginList, (tmpElement) => {
		if (tmpElement.isStructure())
		{
			let tmpStruct = tmpElement.asStructure();
			let newPluginStartupInfo = oFF.HuPluginStartupInfo.createWithStructure(tmpStruct);
			if (oFF.notNull(newPluginStartupInfo))
			{
				this.m_allConfigPlugins.add(newPluginStartupInfo);
			}
		}
		else if (tmpElement.isString())
		{
			let pluginName = tmpElement.asString().getString();
			let newPluginStartupInfo = oFF.HuPluginStartupInfo.create(pluginName);
			this.m_allConfigPlugins.add(newPluginStartupInfo);
		}
	});
};
oFF.HuPluginsConfigurationProcessor.prototype._processPluginString = function(pluginsString)
{
	let pluginName = pluginsString.getString();
	let newPluginStartupInfo = oFF.HuPluginStartupInfo.create(pluginName);
	this.m_allConfigPlugins.add(newPluginStartupInfo);
};
oFF.HuPluginsConfigurationProcessor.prototype._processPluginStructure = function(pluginsStruct)
{
	let keysList = pluginsStruct.getKeysAsReadOnlyList();
	oFF.XCollectionUtils.forEach(keysList, (tmpKey) => {
		let tmpStruct = pluginsStruct.getStructureByKey(tmpKey);
		let newPluginStartupInfo = oFF.HuPluginStartupInfo.createWithStructureExt(tmpKey, tmpStruct);
		if (oFF.notNull(newPluginStartupInfo))
		{
			this.m_allConfigPlugins.add(newPluginStartupInfo);
		}
	});
};
oFF.HuPluginsConfigurationProcessor.prototype._setupConfigurationProcessor = function()
{
	this.m_allConfigPlugins = oFF.XList.create();
	this.m_startupViewPlugins = oFF.XList.create();
	this.m_startupCommandPlugins = oFF.XList.create();
	this.m_invalidPluginNames = oFF.XList.create();
};
oFF.HuPluginsConfigurationProcessor.prototype._validatePlugins = function()
{
	if (oFF.notNull(this.m_allConfigPlugins) && this.m_allConfigPlugins.size() > 0)
	{
		let newAllPluginList = oFF.XList.create();
		oFF.XCollectionUtils.forEach(this.m_allConfigPlugins, (tmpPluginStartupInfo) => {
			let pluginName = tmpPluginStartupInfo.getPluginName();
			let canBeInitialized = oFF.HuPluginRegistryBase.canPluginBeInitialized(pluginName);
			if (canBeInitialized)
			{
				newAllPluginList.add(tmpPluginStartupInfo);
			}
			else
			{
				this.m_invalidPluginNames.add(pluginName);
			}
		});
		this.m_allConfigPlugins.clear();
		this.m_allConfigPlugins.addAll(newAllPluginList);
	}
};
oFF.HuPluginsConfigurationProcessor.prototype.getAllStartupCommandPlugins = function()
{
	return this.m_startupCommandPlugins;
};
oFF.HuPluginsConfigurationProcessor.prototype.getAllStartupPlugins = function()
{
	let startupList = oFF.XList.create();
	oFF.XCollectionUtils.forEach(this.m_allConfigPlugins, (startupItem) => {
		startupList.add(startupItem.getPluginName());
	});
	return startupList;
};
oFF.HuPluginsConfigurationProcessor.prototype.getAllStartupViewPlugins = function()
{
	return this.m_startupViewPlugins;
};
oFF.HuPluginsConfigurationProcessor.prototype.getInvalidPluginNames = function()
{
	return this.m_invalidPluginNames;
};
oFF.HuPluginsConfigurationProcessor.prototype.hasStartupCommandPlugins = function()
{
	return this.m_startupCommandPlugins.hasElements();
};
oFF.HuPluginsConfigurationProcessor.prototype.hasStartupViewPlugins = function()
{
	return this.m_startupViewPlugins.hasElements();
};
oFF.HuPluginsConfigurationProcessor.prototype.releaseObject = function()
{
	oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_startupCommandPlugins);
	oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_startupViewPlugins);
	oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_allConfigPlugins);
	this.m_invalidPluginNames = oFF.XObjectExt.release(this.m_invalidPluginNames);
	oFF.HuDfConfigurationProcessor.prototype.releaseObject.call( this );
};
oFF.HuPluginsConfigurationProcessor.prototype.validateAndGroupPlugins = function()
{
	this._validatePlugins();
	this._groupPlugins();
};

oFF.HuToolbarConfigurationProcessor = function() {};
oFF.HuToolbarConfigurationProcessor.prototype = new oFF.HuDfConfigurationProcessor();
oFF.HuToolbarConfigurationProcessor.prototype._ff_c = "HuToolbarConfigurationProcessor";

oFF.HuToolbarConfigurationProcessor.ACTION = "action";
oFF.HuToolbarConfigurationProcessor.GROUP = "group";
oFF.HuToolbarConfigurationProcessor.ICON = "icon";
oFF.HuToolbarConfigurationProcessor.NAME = "name";
oFF.HuToolbarConfigurationProcessor.TEXT = "text";
oFF.HuToolbarConfigurationProcessor.TOOLTIP = "tooltip";
oFF.HuToolbarConfigurationProcessor.create = function(toolsContext)
{
	let newInstance = new oFF.HuToolbarConfigurationProcessor();
	newInstance._setupWithToolsContext(toolsContext);
	return newInstance;
};
oFF.HuToolbarConfigurationProcessor.prototype.m_allGroupsInOrder = null;
oFF.HuToolbarConfigurationProcessor.prototype.m_allToolbarItems = null;
oFF.HuToolbarConfigurationProcessor.prototype.m_groupedToolbarItems = null;
oFF.HuToolbarConfigurationProcessor.prototype._createGroupsAndGroupItems = function()
{
	if (oFF.notNull(this.m_allToolbarItems) && this.m_allToolbarItems.size() > 0)
	{
		oFF.XCollectionUtils.forEach(this.m_allToolbarItems, (tmpToolbarItem) => {
			let tmpGroup = tmpToolbarItem.getGroup();
			if (tmpGroup !== oFF.HuToolbarGroup.UNGROUPED && !this.m_allGroupsInOrder.contains(tmpGroup))
			{
				this.m_allGroupsInOrder.add(tmpGroup);
			}
			let groupList = this.m_groupedToolbarItems.getByKey(tmpGroup.getName());
			if (oFF.isNull(groupList))
			{
				groupList = oFF.XList.create();
				this.m_groupedToolbarItems.put(tmpGroup.getName(), groupList);
			}
			groupList.add(tmpToolbarItem);
		});
		if (this.m_groupedToolbarItems.containsKey(oFF.HuToolbarGroup.UNGROUPED.getName()))
		{
			this.m_allGroupsInOrder.add(oFF.HuToolbarGroup.UNGROUPED);
		}
	}
};
oFF.HuToolbarConfigurationProcessor.prototype._getConfigurationProcessorName = function()
{
	return "Toolbar";
};
oFF.HuToolbarConfigurationProcessor.prototype._processConfigurationElement = function(jsonElement)
{
	if (oFF.notNull(jsonElement))
	{
		if (jsonElement.isList())
		{
			this._processToolbarList(jsonElement.asList());
			this._createGroupsAndGroupItems();
		}
	}
	else
	{
		this.logDebug("Missing configuration list!");
	}
};
oFF.HuToolbarConfigurationProcessor.prototype._processToolbarList = function(toolbarList)
{
	oFF.XCollectionUtils.forEach(toolbarList, (tmpElement) => {
		if (tmpElement.isStructure())
		{
			let tmpStruct = tmpElement.asStructure();
			let actionId = tmpStruct.getStringByKey(oFF.HuToolbarConfigurationProcessor.ACTION);
			if (oFF.XStringUtils.isNotNullAndNotEmpty(actionId))
			{
				let name = tmpStruct.getStringByKey(oFF.HuToolbarConfigurationProcessor.NAME);
				let text = tmpStruct.getStringByKey(oFF.HuToolbarConfigurationProcessor.TEXT);
				let icon = tmpStruct.getStringByKey(oFF.HuToolbarConfigurationProcessor.ICON);
				let tooltip = tmpStruct.getStringByKey(oFF.HuToolbarConfigurationProcessor.TOOLTIP);
				let groupName = tmpStruct.getStringByKey(oFF.HuToolbarConfigurationProcessor.GROUP);
				let tmpGroup = oFF.HuToolbarGroup.UNGROUPED;
				if (oFF.XStringUtils.isNotNullAndNotEmpty(groupName))
				{
					tmpGroup = oFF.HuToolbarGroup.createCustomGroupIfNecessary(groupName);
				}
				let newToolbarItem = oFF.HuToolbarItem.create(actionId, name, text, icon, tooltip, tmpGroup);
				this.m_allToolbarItems.add(newToolbarItem);
			}
		}
		else if (tmpElement.isString())
		{
			let actionId2 = tmpElement.asString().getString();
			let newToolbarItem2 = oFF.HuToolbarItem.create(actionId2, null, null, null, null, null);
			this.m_allToolbarItems.add(newToolbarItem2);
		}
	});
};
oFF.HuToolbarConfigurationProcessor.prototype._setupConfigurationProcessor = function()
{
	this.m_allToolbarItems = oFF.XList.create();
	this.m_allGroupsInOrder = oFF.XList.create();
	this.m_groupedToolbarItems = oFF.XLinkedHashMapByString.create();
};
oFF.HuToolbarConfigurationProcessor.prototype.getAllGroupsInOrder = function()
{
	return this.m_allGroupsInOrder;
};
oFF.HuToolbarConfigurationProcessor.prototype.getAllToolbarItems = function()
{
	return this.m_allToolbarItems;
};
oFF.HuToolbarConfigurationProcessor.prototype.getAllToolbarItemsGrouped = function()
{
	return this.m_groupedToolbarItems;
};
oFF.HuToolbarConfigurationProcessor.prototype.hasToolbarItems = function()
{
	return this.getAllToolbarItems().hasElements();
};
oFF.HuToolbarConfigurationProcessor.prototype.releaseObject = function()
{
	this.m_groupedToolbarItems.clear();
	this.m_groupedToolbarItems = oFF.XObjectExt.release(this.m_groupedToolbarItems);
	this.m_allGroupsInOrder.clear();
	this.m_allGroupsInOrder = oFF.XObjectExt.release(this.m_allGroupsInOrder);
	this.m_allToolbarItems = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_allToolbarItems);
	oFF.HuDfConfigurationProcessor.prototype.releaseObject.call( this );
};

oFF.HuHorizon = function() {};
oFF.HuHorizon.prototype = new oFF.DfUiProgram();
oFF.HuHorizon.prototype._ff_c = "HuHorizon";

oFF.HuHorizon.prototype.m_controller = null;
oFF.HuHorizon.prototype.m_startupCompleteProcedure = null;
oFF.HuHorizon.prototype._fireStartupCompleteProcedureIfNeeded = function()
{
	if (oFF.notNull(this.m_startupCompleteProcedure))
	{
		this.m_startupCompleteProcedure();
	}
};
oFF.HuHorizon.prototype._getController = function()
{
	return this.m_controller;
};
oFF.HuHorizon.prototype._handleControllerStatusChanged = function(newStatus)
{
	if (newStatus === oFF.HuMainControllerStatus.RUNNING)
	{
		this._fireStartupCompleteProcedureIfNeeded();
	}
};
oFF.HuHorizon.prototype._registerPluginStartedObserver = function()
{
	this._getController().getLocalNotificationCenter().addObserverForName(oFF.HuHorizonInternalNotifications.PLUGIN_STARTED, (data) => {
		this.logDebug(oFF.HuHorizonInternalNotifications.PLUGIN_STARTED);
		this.logDebug(data.getStringByKey(oFF.HuHorizonInternalNotifications.PLUGIN_STARTED_PLUGIN_NAME_NOTIFI_DATA));
		let tmpPluginType = data.getXObjectByKey(oFF.HuHorizonInternalNotifications.PLUGIN_STARTED_PLUGIN_TYPE_NOTIFI_DATA);
		if (oFF.notNull(tmpPluginType))
		{
			this.logDebug(tmpPluginType.getName());
		}
	});
};
oFF.HuHorizon.prototype.actionByIdExists = function(actionId)
{
	let controller = this._getController();
	if (oFF.notNull(controller))
	{
		let pluginManager = controller.getCommandPluginManager();
		if (oFF.notNull(pluginManager))
		{
			return pluginManager.actionByIdExists(actionId);
		}
	}
	return false;
};
oFF.HuHorizon.prototype.actionExists = function(pluginName, actionName)
{
	return this.actionByIdExists(oFF.HuUtils.generateActionId(pluginName, actionName));
};
oFF.HuHorizon.prototype.addLocalNotificationObserver = function(name, consumer)
{
	if (this._getController() !== null)
	{
		return this._getController().getLocalNotificationCenter().addObserverForName(name, consumer);
	}
	return null;
};
oFF.HuHorizon.prototype.addProgramMenuButton = function(text, icon, pressConsumer)
{
	return this.addMenuBarButton(text, icon, pressConsumer);
};
oFF.HuHorizon.prototype.buildUi = function(genesis)
{
	if (this.m_controller.getCurrentControllerStatus() === oFF.HuMainControllerStatus.RUNNING)
	{
		this._fireStartupCompleteProcedureIfNeeded();
	}
	else
	{
		this.m_controller.addStatusChangedListener(this._handleControllerStatusChanged.bind(this));
	}
};
oFF.HuHorizon.prototype.canTerminate = function()
{
	return oFF.DfUiProgram.prototype.canTerminate.call( this );
};
oFF.HuHorizon.prototype.executeAction = function(pluginName, actionName, customData)
{
	return this.executeActionById(oFF.HuUtils.generateActionId(pluginName, actionName), customData);
};
oFF.HuHorizon.prototype.executeActionById = function(actionId, customData)
{
	if (this._getController() !== null && this._getController().getCommandPluginManager() !== null)
	{
		return this._getController().getCommandPluginManager().executeAction(actionId, this._getController(), customData);
	}
	return oFF.XPromise.reject(oFF.XError.create("Failed to execute action! Unknown error!"));
};
oFF.HuHorizon.prototype.getAllActionIds = function()
{
	let controller = this._getController();
	if (oFF.notNull(controller))
	{
		let pluginManager = controller.getCommandPluginManager();
		if (oFF.notNull(pluginManager))
		{
			return pluginManager.getAllActionIds();
		}
	}
	return oFF.XList.create();
};
oFF.HuHorizon.prototype.getContainerCssClass = function()
{
	return "ffHorizonProgram";
};
oFF.HuHorizon.prototype.getDefaultContainerSize = function()
{
	return oFF.UiSize.createByCss("70vw", "70vh");
};
oFF.HuHorizon.prototype.getLogContextName = function()
{
	return "Program";
};
oFF.HuHorizon.prototype.getLogSeverity = function()
{
	return oFF.DfUiProgram.prototype.getLogSeverity.call( this );
};
oFF.HuHorizon.prototype.getLogger = function()
{
	return this._getController().getLogger();
};
oFF.HuHorizon.prototype.getMenuBarDisplayName = function()
{
	return null;
};
oFF.HuHorizon.prototype.getProgramMenu = function()
{
	return this.getMenuBar();
};
oFF.HuHorizon.prototype.getProgramName = function()
{
	return oFF.HuHorizonApi.HORIZON_PROGRAM_NAME;
};
oFF.HuHorizon.prototype.isContainerEmbedded = function()
{
	return this.isEmbedded();
};
oFF.HuHorizon.prototype.isProgramBusy = function()
{
	return this.isBusy();
};
oFF.HuHorizon.prototype.isProgramMenuVisible = function()
{
	return this.isMenuBarVisible();
};
oFF.HuHorizon.prototype.isShowMenuBar = function()
{
	return true;
};
oFF.HuHorizon.prototype.logDebug = function(logline)
{
	this.getLogger().logDebug(oFF.HuBaseUtils.formatLogWithContextName(this.getLogContextName(), logline));
};
oFF.HuHorizon.prototype.logInfo = function(logline)
{
	this.getLogger().logInfo(oFF.HuBaseUtils.formatLogWithContextName(this.getLogContextName(), logline));
};
oFF.HuHorizon.prototype.newProgram = function()
{
	let prg = new oFF.HuHorizon();
	prg.setup();
	return prg;
};
oFF.HuHorizon.prototype.postLocalNotification = function(name, data)
{
	if (this._getController() !== null)
	{
		this._getController().getLocalNotificationCenter().postNotificationWithName(name, data);
	}
};
oFF.HuHorizon.prototype.prepareProgramMetadata = function(metadata)
{
	metadata.addParameter(oFF.HuHorizonApi.PARAM_CONFIG, "A stringified json containing the horizon configuration.");
	metadata.addParameter(oFF.HuHorizonApi.PARAM_CONFIG_FILE, "A path pointing to a file containing the configuration.");
	metadata.addParameter(oFF.HuHorizonApi.PARAM_WORKSPACE_DIR, "A path to the workspace directory which should be used.");
	metadata.addParameter(oFF.HuHorizonApi.PARAM_SHOW_SPLASH_SCREEN, "Whether to show the splash screen during startup.");
	metadata.addParameter(oFF.DfProgram.PARAM_FILE, "Same as configFile");
};
oFF.HuHorizon.prototype.processArguments = function(args) {};
oFF.HuHorizon.prototype.processConfiguration = function(configuration) {};
oFF.HuHorizon.prototype.releaseObject = function()
{
	this.m_startupCompleteProcedure = null;
	this.m_controller = oFF.XObjectExt.release(this.m_controller);
	oFF.DfUiProgram.prototype.releaseObject.call( this );
};
oFF.HuHorizon.prototype.reloadWithConfiguration = function(configStruct)
{
	if (this._getController() !== null)
	{
		this._getController().applyNewConfiguration(configStruct);
	}
};
oFF.HuHorizon.prototype.removeLocalNotificationObserverByUuid = function(uuid)
{
	if (this._getController() !== null)
	{
		this._getController().getLocalNotificationCenter().removeObserverByUuid(uuid);
	}
};
oFF.HuHorizon.prototype.removeProgramMenuButton = function(buttonToRemove)
{
	this.removeMenuBarButton(buttonToRemove);
};
oFF.HuHorizon.prototype.setContainerTitle = function(newTitle)
{
	this.setTitle(newTitle);
};
oFF.HuHorizon.prototype.setProgramBusy = function(busy)
{
	this.setBusy(busy);
};
oFF.HuHorizon.prototype.setProgramMenuVisible = function(visible)
{
	this.showMenuBar(visible);
};
oFF.HuHorizon.prototype.setStartupCompleteProcedure = function(procedure)
{
	this.m_startupCompleteProcedure = procedure;
	if (oFF.notNull(this.m_controller) && this.m_controller.getCurrentControllerStatus() === oFF.HuMainControllerStatus.RUNNING)
	{
		this._fireStartupCompleteProcedureIfNeeded();
	}
};
oFF.HuHorizon.prototype.setStatusBarVisible = function(visible)
{
	if (this._getController() !== null && this._getController().getUiController() !== null)
	{
		this._getController().getUiController().getStatusBarManager().setStatusBarVisible(visible);
	}
};
oFF.HuHorizon.prototype.setupProgram = function()
{
	let prgArgs = this.getArguments();
	let bootConfig = oFF.HuBootConfig.create();
	bootConfig.setConfigString(prgArgs.getStringByKey(oFF.HuHorizonApi.PARAM_CONFIG));
	bootConfig.setConfigFilePath(prgArgs.getStringByKeyExt(oFF.HuHorizonApi.PARAM_CONFIG_FILE, prgArgs.getStringByKey(oFF.DfProgram.PARAM_FILE)));
	bootConfig.setWorkspaceDirectoryPath(prgArgs.getStringByKey(oFF.HuHorizonApi.PARAM_WORKSPACE_DIR));
	bootConfig.setShowSplashScreen(prgArgs.getBooleanByKeyExt(oFF.HuHorizonApi.PARAM_SHOW_SPLASH_SCREEN, bootConfig.isShowSplashScreen()));
	bootConfig.setHorizonConfiguration(this.getConfiguration());
	this.m_controller = oFF.HuHorizonMainController.create(this);
	this._registerPluginStartedObserver();
	return this.m_controller.initiateBoot(bootConfig);
};
oFF.HuHorizon.prototype.showActivityIndicatorOnSetupPromise = function()
{
	return false;
};

oFF.HuPluginToolsService = function() {};
oFF.HuPluginToolsService.prototype = new oFF.HuDfHorizonService();
oFF.HuPluginToolsService.prototype._ff_c = "HuPluginToolsService";

oFF.HuPluginToolsService.create = function(mainController)
{
	let newInstance = new oFF.HuPluginToolsService();
	newInstance._setupWithMainController(mainController);
	return newInstance;
};
oFF.HuPluginToolsService.prototype.m_configCache = null;
oFF.HuPluginToolsService.prototype._addConfigCacheEntryIfNeeded = function(cacheKey, structure)
{
	if (oFF.notNull(this.m_configCache) && !this.m_configCache.containsKey(cacheKey))
	{
		this.m_configCache.put(cacheKey, structure);
	}
};
oFF.HuPluginToolsService.prototype._appendWorkspaceConfigurationIfPossible = function(manifest, configuration)
{
	if (oFF.isNull(configuration))
	{
		return oFF.XPromise.reject(oFF.XError.create("Missing configuration! Cannot append workspace configuration!"));
	}
	let cacheKey = this._getWorkspaceCacheKey(manifest);
	if (this._hasCacheEntry(cacheKey))
	{
		let cachedWorkspaceSettings = this._getCachedConfigStructure(cacheKey);
		this._logCacheState("workspace settings", cachedWorkspaceSettings);
		configuration.mergeWithStructure(cachedWorkspaceSettings);
		return oFF.XPromise.resolve(configuration);
	}
	let settingsFile = this.getMainController().getWorkspaceManager().getSettingsFileForPlugin(manifest);
	if (oFF.notNull(settingsFile))
	{
		return oFF.XFilePromise.loadJsonStructure(settingsFile).then((pluginSettings) => {
			this.logDebug(oFF.XStringUtils.concatenate2("Found plugin settings file in workspace -> ", settingsFile.getUrl()));
			this._addConfigCacheEntryIfNeeded(cacheKey, pluginSettings);
			configuration.mergeWithStructure(pluginSettings);
			return configuration;
		}, (err) => {
			this._addConfigCacheEntryIfNeeded(cacheKey, null);
			return null;
		});
	}
	return oFF.XPromise.resolve(configuration);
};
oFF.HuPluginToolsService.prototype._getCachedConfigStructure = function(cacheKey)
{
	if (oFF.notNull(this.m_configCache))
	{
		return this.m_configCache.getByKey(cacheKey);
	}
	return null;
};
oFF.HuPluginToolsService.prototype._getServiceName = function()
{
	return "Plugin Configuration Service";
};
oFF.HuPluginToolsService.prototype._getWorkspaceCacheKey = function(pluginMetadata)
{
	if (oFF.notNull(pluginMetadata))
	{
		return oFF.XStringUtils.concatenate2("workspace_", pluginMetadata.getName());
	}
	return null;
};
oFF.HuPluginToolsService.prototype._hasCacheEntry = function(cacheKey)
{
	if (oFF.notNull(this.m_configCache) && this.m_configCache.containsKey(cacheKey))
	{
		return true;
	}
	return false;
};
oFF.HuPluginToolsService.prototype._logCacheState = function(type, cacheStruct)
{
	this.logDebug(oFF.XStringUtils.concatenate4("Found cached ", type, "! Cache state: ", oFF.notNull(cacheStruct) ? "Has data" : "Empty"));
};
oFF.HuPluginToolsService.prototype._setupService = function()
{
	this.m_configCache = oFF.XHashMapByString.create();
};
oFF.HuPluginToolsService.prototype._validatePluginDependencies = function(dependencies, isDocumentPlugin)
{
	if (!oFF.XCollectionUtils.hasElements(dependencies))
	{
		return true;
	}
	let canAllBeInitialized = oFF.XCollectionUtils.ensureAll(dependencies, (dependencyPluginName) => {
		let tmpFactory = oFF.HuPluginRegistryBase.getPluginFactory(dependencyPluginName);
		if (oFF.isNull(tmpFactory))
		{
			return false;
		}
		return tmpFactory.canBeInitialized();
	});
	if (!canAllBeInitialized)
	{
		return false;
	}
	let configDependenciesToCheck = oFF.XList.create();
	if (!isDocumentPlugin)
	{
		configDependenciesToCheck.addAll(dependencies);
	}
	else
	{
		oFF.XCollectionUtils.forEach(dependencies, (dependencyPluginName) => {
			let tmpFactory = oFF.HuPluginRegistryBase.getPluginFactory(dependencyPluginName);
			if (!tmpFactory.getPluginType().hasUi())
			{
				configDependenciesToCheck.add(dependencyPluginName);
			}
		});
	}
	return oFF.XCollectionUtils.ensureAll(configDependenciesToCheck, (dependencyPluginName) => {
		return this.getMainController().getConfigurationManager().getPluginsConfiguration().getAllStartupPlugins().contains(dependencyPluginName);
	});
};
oFF.HuPluginToolsService.prototype.checkPluginDependencies = function(pluginName)
{
	let pluginFactory = oFF.HuPluginRegistryBase.getPluginFactory(pluginName);
	if (oFF.notNull(pluginFactory))
	{
		let pluginDependencies = pluginFactory.getDependencies();
		if (!oFF.XCollectionUtils.hasElements(pluginDependencies))
		{
			return true;
		}
		return this._validatePluginDependencies(pluginDependencies, pluginFactory.getPluginType() === oFF.HuPluginType.DOCUMENT);
	}
	return false;
};
oFF.HuPluginToolsService.prototype.createConfigurationForPlugin = function(manifest, pluginConfig)
{
	let configurationPreparePromise = oFF.XPromise.create((resolve, reject) => {
		this.logDebug("Preparing plugin configuration!");
		if (oFF.isNull(manifest))
		{
			resolve(oFF.CoConfiguration.create(null, pluginConfig));
			return;
		}
		oFF.CoConfigurationUtils.getResolvedConfigurationForProvider(this.getProcess(), manifest).onThen((tmpConfiguration) => {
			if (manifest.hasConfigurationMetadata())
			{
				this.logDebug("Plugin has configuration metadata!");
			}
			else
			{
				this.logDebug("Plugin has no configuration metadata!");
			}
			this._appendWorkspaceConfigurationIfPossible(manifest, tmpConfiguration).onFinally(() => {
				tmpConfiguration.mergeWithStructure(pluginConfig);
				resolve(tmpConfiguration);
			});
		}).onCatch(reject);
	});
	return configurationPreparePromise;
};
oFF.HuPluginToolsService.prototype.ensureModuleDependencies = function(pluginName)
{
	let pluginFactory = oFF.HuPluginRegistryBase.getPluginFactory(pluginName);
	if (oFF.isNull(pluginFactory))
	{
		return oFF.XPromise.reject(oFF.XError.create("Could not find the specified plugin! Cannot load dependencies!"));
	}
	return oFF.HuBaseUtils.loadPluginDependencies(pluginFactory, this.getProcess().getKernel(), this);
};
oFF.HuPluginToolsService.prototype.releaseObject = function()
{
	this.m_configCache.clear();
	this.m_configCache = oFF.XObjectExt.release(this.m_configCache);
	oFF.HuDfHorizonService.prototype.releaseObject.call( this );
};

oFF.HuHorizonShellController = function() {};
oFF.HuHorizonShellController.prototype = new oFF.HuDfSubController();
oFF.HuHorizonShellController.prototype._ff_c = "HuHorizonShellController";

oFF.HuHorizonShellController.create = function(mainController)
{
	let newInstance = new oFF.HuHorizonShellController();
	newInstance._setupWithMainController(mainController);
	return newInstance;
};
oFF.HuHorizonShellController.prototype.m_menuManager = null;
oFF.HuHorizonShellController.prototype.m_notificationObserverIds = null;
oFF.HuHorizonShellController.prototype._getControllerName = function()
{
	return "Shell Controller";
};
oFF.HuHorizonShellController.prototype._handleFrameworkModeChangedNotification = function(notifyData)
{
	this.logDebug(oFF.XStringUtils.concatenate3("Mode changed to ", this.getCurrentMode().getName(), ", re-rendering shell menu!"));
	this._initShellMenu();
};
oFF.HuHorizonShellController.prototype._handleHideShellMenuNotification = function(notifyData)
{
	this.getMenuManager().setMenuVisible(false);
};
oFF.HuHorizonShellController.prototype._handleSetWorkspaceTitleNotification = function(notifyData)
{
	if (oFF.notNull(notifyData))
	{
		let newTitle = notifyData.getStringByKey(oFF.HuHorizonInternalNotifications.NEW_WORKSPACE_TITLE_NOTIFI_DATA);
		this.logDebug(oFF.XStringUtils.concatenate2("Workspace title changed -> ", newTitle));
		if (oFF.XStringUtils.isNotNullAndNotEmpty(newTitle))
		{
			this.setTitle(newTitle);
		}
	}
};
oFF.HuHorizonShellController.prototype._handleShowShellMenuNotification = function(notifyData)
{
	this.getMenuManager().setMenuVisible(true);
};
oFF.HuHorizonShellController.prototype._initShellMenu = function()
{
	this.getMenuManager().clearMenuButtons();
	this.getMenuManager().addMenuButton("File", null, (controlEvent) => {
		this._presentFileMenu(controlEvent);
	});
	if (this.getCurrentMode() === oFF.HuFrameworkMode.DEVELOPER || this.getCurrentMode() === oFF.HuFrameworkMode.DEBUG)
	{
		this.getMenuManager().addMenuButton("Developer Tools", null, (controlEvent) => {
			this._presentDeveloperToolsMenu(controlEvent);
		});
	}
	if (this.getCurrentMode() === oFF.HuFrameworkMode.DEBUG)
	{
		this.getMenuManager().addMenuButton("Debug", null, (controlEvent) => {
			this._presentDebugMenu(controlEvent);
		});
	}
	this.getMenuManager().setMenuVisible(this.getMainController().getConfigurationManager().getHorizonConfiguration().isMenuVisible());
};
oFF.HuHorizonShellController.prototype._presentDebugMenu = function(controlEvent)
{
	if (oFF.notNull(controlEvent) && controlEvent.getControl() !== null)
	{
		let debugMenu = this.getGenesis().newControl(oFF.UiType.MENU);
		let manifestsSubMenu = debugMenu.addNewItem();
		manifestsSubMenu.setText("Manifests");
		let clearAllPluginManifestsMenuItem = manifestsSubMenu.addNewItem();
		clearAllPluginManifestsMenuItem.setText("Clear all plugin manifests");
		clearAllPluginManifestsMenuItem.setIcon("eraser");
		clearAllPluginManifestsMenuItem.setEnabled(true);
		clearAllPluginManifestsMenuItem.registerOnPress(oFF.UiLambdaPressListener.create((pressEvent) => {
			oFF.HuPluginRegistryBase.clearAllPluginManifests();
			this.getGenesis().showSuccessToast("Plugin manifests successfully cleared!");
		}));
		let toolsSubMenu = debugMenu.addNewItem();
		toolsSubMenu.setText("Tools");
		let postNotificationMenuItem = toolsSubMenu.addNewItem();
		postNotificationMenuItem.setText("Post Notification...");
		postNotificationMenuItem.setIcon("paper-plane");
		postNotificationMenuItem.setEnabled(true);
		postNotificationMenuItem.registerOnPress(oFF.UiLambdaPressListener.create((pressEvent) => {
			oFF.HuNotificationPosterPopup.create(this).open();
		}));
		let pluginProcessesMenuItem = toolsSubMenu.addNewItem();
		pluginProcessesMenuItem.setText("Plugin processes...");
		pluginProcessesMenuItem.setIcon("instance");
		pluginProcessesMenuItem.setEnabled(true);
		pluginProcessesMenuItem.registerOnPress(oFF.UiLambdaPressListener.create((pressEvent) => {
			this.getDebugUtility().presentPluginProcessTaskManger();
		}));
		debugMenu.openAt(controlEvent.getControl());
	}
};
oFF.HuHorizonShellController.prototype._presentDeveloperToolsMenu = function(controlEvent)
{
	if (oFF.notNull(controlEvent) && controlEvent.getControl() !== null)
	{
		let developerToolsMenu = this.getGenesis().newControl(oFF.UiType.MENU);
		let configurationSubMenu = developerToolsMenu.addNewItem();
		configurationSubMenu.setText("Configuration");
		let reloadCurrentConfigMenuItem = configurationSubMenu.addNewItem();
		reloadCurrentConfigMenuItem.setText("Reload current configuration");
		reloadCurrentConfigMenuItem.setIcon("refresh");
		reloadCurrentConfigMenuItem.setEnabled(true);
		reloadCurrentConfigMenuItem.registerOnPress(oFF.UiLambdaPressListener.create((pressEvent) => {
			this.getMainController().reloadConfiguration();
		}));
		let copyConfigurationToClipboardMenuItem = configurationSubMenu.addNewItem();
		copyConfigurationToClipboardMenuItem.setText("Copy current configuration to the firefly clipboard");
		copyConfigurationToClipboardMenuItem.setIcon("copy");
		copyConfigurationToClipboardMenuItem.setEnabled(true);
		copyConfigurationToClipboardMenuItem.setSectionStart(true);
		copyConfigurationToClipboardMenuItem.registerOnPress(oFF.UiLambdaPressListener.create((pressEvent) => {
			this.getProcess().getClipboard().write(oFF.XContent.createJsonObjectContent(oFF.ContentType.JSON, this.getMainController().getConfigurationManager().getConfigurationJson())).onThen((result) => {
				this.getGenesis().showSuccessToast("Current configuration copied to the firefly clipbord");
			}).onCatch((err) => {
				this.getGenesis().showErrorToast("Error copying the current configuration to the firefly clipboard");
			});
		}));
		let applyConfigurationMenuItem = configurationSubMenu.addNewItem();
		applyConfigurationMenuItem.setText("Configuration Editor");
		applyConfigurationMenuItem.setIcon("edit");
		applyConfigurationMenuItem.setEnabled(true);
		applyConfigurationMenuItem.registerOnPress(oFF.UiLambdaPressListener.create((pressEvent) => {
			let textAreaPopup = oFF.UtTextAreaPopup.create(this.getGenesis(), "Configuration Editor", "json", oFF.PrUtils.serialize(this.getMainController().getConfigurationManager().getConfigurationJson(), false, true, 2));
			textAreaPopup.setConfirmConsumer((configStr) => {
				let tmpElem = oFF.PrUtils.deserialize(configStr);
				if (oFF.notNull(tmpElem) && tmpElem.isStructure())
				{
					this.getMainController().applyNewConfiguration(tmpElem.asStructure());
				}
				else
				{
					this.getGenesis().showErrorToast("Configuration not in json format!");
				}
			});
			textAreaPopup.open();
		}));
		let allRunningCommandPlugins = this.getMainController().getCommandPluginManager().getAllRunningPlugins();
		oFF.XCollectionUtils.listEntries(allRunningCommandPlugins, (index, tmpCmdPlugin) => {
			this._renderDevActionsIfNeeded(tmpCmdPlugin, developerToolsMenu, index.getInteger() === 0);
		});
		let allRunningViewPlugins = this.getMainController().getViewPluginManager().getAllRunningPlugins();
		oFF.XCollectionUtils.listEntries(allRunningViewPlugins, (index, tmpViewPlugin) => {
			this._renderDevActionsIfNeeded(tmpViewPlugin, developerToolsMenu, index.getInteger() === 0);
		});
		developerToolsMenu.openAt(controlEvent.getControl());
	}
};
oFF.HuHorizonShellController.prototype._presentFileMenu = function(controlEvent)
{
	if (oFF.notNull(controlEvent) && controlEvent.getControl() !== null)
	{
		let fileMenu = this.getGenesis().newControl(oFF.UiType.MENU);
		let preferencesMenuItem = fileMenu.addNewItem();
		preferencesMenuItem.setText("Preferences...");
		preferencesMenuItem.setIcon("settings");
		preferencesMenuItem.setEnabled(true);
		preferencesMenuItem.registerOnPress(oFF.UiLambdaPressListener.create((controlEvent2) => {
			let settingsDlgRunner = oFF.SuSettingsDialog.createRunnerForConfigurationType(this.getProcess(), oFF.CoConfigurationType.PLUGIN);
			settingsDlgRunner.runProgram();
		}));
		let availablePluginsMenuItem = fileMenu.addNewItem();
		availablePluginsMenuItem.setText("Available plugins...");
		availablePluginsMenuItem.setIcon("switch-views");
		availablePluginsMenuItem.setEnabled(true);
		availablePluginsMenuItem.setSectionStart(true);
		availablePluginsMenuItem.registerOnPress(oFF.UiLambdaPressListener.create((controlEvent3) => {
			this._presentPluginListDialog();
		}));
		if (!this.getMainController().getWorkspaceManager().isVirtualWorkspace())
		{
			let switchWorkspaceMenuItem = fileMenu.addNewItem();
			switchWorkspaceMenuItem.setText("Switch workspace...");
			switchWorkspaceMenuItem.setIcon("list");
			switchWorkspaceMenuItem.setEnabled(true);
			switchWorkspaceMenuItem.setSectionStart(true);
			switchWorkspaceMenuItem.registerOnPress(oFF.UiLambdaPressListener.create((controlEvent4) => {
				this.getMainController().requestWorkspaceSwitch();
			}));
		}
		if (!this.isEmbedded())
		{
			let exitMenuItem = fileMenu.addNewItem();
			exitMenuItem.setText("Exit");
			exitMenuItem.setIcon("decline");
			exitMenuItem.setEnabled(true);
			exitMenuItem.setSectionStart(true);
			exitMenuItem.registerOnPress(oFF.UiLambdaPressListener.create((controlEvent5) => {
				this.getMainController().getProgramInstance().terminate();
			}));
		}
		fileMenu.openAt(controlEvent.getControl());
	}
};
oFF.HuHorizonShellController.prototype._presentPluginListDialog = function()
{
	let pluginListDialogRunner = oFF.HuPluginListDialog.createRunnerForDebug(this.getProcess(), this.isRunningInDebugEnvironment() || this.getCurrentMode() === oFF.HuFrameworkMode.DEBUG);
	pluginListDialogRunner.runProgram();
};
oFF.HuHorizonShellController.prototype._renderDevActionsIfNeeded = function(pluginController, developerToolsMenu, isSectionStart)
{
	if (oFF.notNull(pluginController))
	{
		let devActionList = pluginController.getMenuDeveloperActionList();
		if (oFF.XCollectionUtils.hasElements(devActionList))
		{
			let tmpPluginActionsSubMenu = developerToolsMenu.addNewItem();
			tmpPluginActionsSubMenu.setText(pluginController.getPluginDisplayNameOrName());
			tmpPluginActionsSubMenu.setSectionStart(isSectionStart);
			oFF.XCollectionUtils.forEach(devActionList, (tmpAction) => {
				let tmpPluginActionMenuItem = tmpPluginActionsSubMenu.addNewItem();
				tmpPluginActionMenuItem.setText(tmpAction.getDisplayName());
				tmpPluginActionMenuItem.setIcon(tmpAction.getIcon());
				tmpPluginActionMenuItem.setTooltip(tmpAction.getDescription());
				tmpPluginActionMenuItem.setSectionStart(tmpAction.isSectionStart());
				tmpPluginActionMenuItem.registerOnPress(oFF.UiLambdaPressListener.create((pressEvent) => {
					tmpAction.getActionProcedure()();
				}));
			});
		}
	}
};
oFF.HuHorizonShellController.prototype._setWorkspaceTitle = function()
{
	this.setTitle(this.getMainController().getConfigurationManager().getHorizonConfiguration().getWorkspaceTitle());
};
oFF.HuHorizonShellController.prototype._setupController = function()
{
	this.m_menuManager = oFF.HuHorizonMenuManager.create(this, this.getMainController().getProgramInstance());
	this.m_notificationObserverIds = oFF.XList.create();
	this.m_notificationObserverIds.add(this.getLocalNotificationCenter().addObserverForName(oFF.HuHorizonInternalNotifications.SET_WORKSPACE_TITLE, this._handleSetWorkspaceTitleNotification.bind(this)));
	this.m_notificationObserverIds.add(this.getLocalNotificationCenter().addObserverForName(oFF.HuHorizonInternalNotifications.SHOW_SHELL_MENU, this._handleShowShellMenuNotification.bind(this)));
	this.m_notificationObserverIds.add(this.getLocalNotificationCenter().addObserverForName(oFF.HuHorizonInternalNotifications.HIDE_SHELL_MENU, this._handleHideShellMenuNotification.bind(this)));
	this.m_notificationObserverIds.add(this.getLocalNotificationCenter().addObserverForName(oFF.HuHorizonInternalNotifications.FRAMEWORK_MODE_CHANGED, this._handleFrameworkModeChangedNotification.bind(this)));
};
oFF.HuHorizonShellController.prototype.getMenuManager = function()
{
	return this.m_menuManager;
};
oFF.HuHorizonShellController.prototype.isEmbedded = function()
{
	return this.getMainController().getProgramInstance().isContainerEmbedded();
};
oFF.HuHorizonShellController.prototype.reInitShell = function()
{
	this._setWorkspaceTitle();
	this._initShellMenu();
};
oFF.HuHorizonShellController.prototype.releaseObject = function()
{
	oFF.HuBaseUtils.deregisterNotificationObservers(this.m_notificationObserverIds, this.getLocalNotificationCenter());
	this.m_notificationObserverIds = oFF.XObjectExt.release(this.m_notificationObserverIds);
	this.m_menuManager = oFF.XObjectExt.release(this.m_menuManager);
	oFF.HuDfSubController.prototype.releaseObject.call( this );
};
oFF.HuHorizonShellController.prototype.setBusy = function(busy)
{
	this.getMainController().getProgramInstance().setProgramBusy(busy);
};
oFF.HuHorizonShellController.prototype.setTitle = function(title)
{
	this.getMainController().getProgramInstance().setContainerTitle(title);
};

oFF.HuHorizonUiController = function() {};
oFF.HuHorizonUiController.prototype = new oFF.HuDfSubController();
oFF.HuHorizonUiController.prototype._ff_c = "HuHorizonUiController";

oFF.HuHorizonUiController.create = function(mainController)
{
	let newInstance = new oFF.HuHorizonUiController();
	newInstance._setupWithMainController(mainController);
	return newInstance;
};
oFF.HuHorizonUiController.prototype.m_contentContainer = null;
oFF.HuHorizonUiController.prototype.m_freeGenesis = null;
oFF.HuHorizonUiController.prototype.m_layoutManager = null;
oFF.HuHorizonUiController.prototype.m_mainLayout = null;
oFF.HuHorizonUiController.prototype.m_statusBarManager = null;
oFF.HuHorizonUiController.prototype.m_toolbarManager = null;
oFF.HuHorizonUiController.prototype._applyInitialConfig = function()
{
	this.logDebug("Applying initial ui config");
	this.getToolbarManager().setToolbarVisible(this._shouldShowToolbar());
	this.getStatusBarManager().setStatusBarVisible(this.getMainController().getConfigurationManager().getHorizonConfiguration().isStatusBarVisible());
};
oFF.HuHorizonUiController.prototype._applyInitialStatusBarState = function()
{
	this.logDebug("Applying initial status bar state");
	let initialStatusMsg = this.getMainController().getMessageManager().getStatus();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(initialStatusMsg))
	{
		this.getStatusBarManager().setStatusMessage(initialStatusMsg);
	}
	if (this.getMainController().getMessageManager().hasMessages())
	{
		this.getStatusBarManager().addAllMessages(this.getMainController().getMessageManager().getAllMessages());
	}
};
oFF.HuHorizonUiController.prototype._createDebugToolbarGroupIfNeeded = function()
{
	if (this.isRunningInDebugEnvironment())
	{
		let debugGroup = this.getToolbarManager().createNewGroup(oFF.HuToolbarGroup.DEBUG.getName());
		debugGroup.addButton("showToastTest", "Show Toast", "Shows an error toast", "accept").setPressConsumer((event) => {
			this.getGenesis().showErrorToast("Works!");
		});
		debugGroup.addButton("commandTest", "Command Test", "A toolbar entry which execute command plugin actions", "action").setPressConsumer((event2) => {
			this.getMainController().getCommandPluginManager().executeAction("SimpleToastCommand.show", this.getMainController(), null);
		});
	}
};
oFF.HuHorizonUiController.prototype._generateToolbarItemsIfNeeded = function()
{
	if (this.getMainController().getConfigurationManager().getToolbarConfiguration().hasToolbarItems())
	{
		let allGroups = this.getMainController().getConfigurationManager().getToolbarConfiguration().getAllGroupsInOrder();
		oFF.XCollectionUtils.forEach(allGroups, (tmpGroup) => {
			this.getToolbarManager().createNewGroup(tmpGroup.getName());
		});
		let allToolbarItems = this.getMainController().getConfigurationManager().getToolbarConfiguration().getAllToolbarItems();
		oFF.XCollectionUtils.forEach(allToolbarItems, (tmpToolbarItem) => {
			let tmpGroup2 = this.getToolbarManager().getGroupByNameCreateIfNeeded(tmpToolbarItem.getGroup().getName());
			if (oFF.notNull(tmpGroup2))
			{
				let tmpBtn = tmpGroup2.addButton(tmpToolbarItem.getName(), tmpToolbarItem.getText(), tmpToolbarItem.getTooltip(), tmpToolbarItem.getIcon());
				tmpBtn.setPressConsumer((event2) => {
					this.getMainController().getCommandPluginManager().executeAction(tmpToolbarItem.getActionId(), this.getMainController(), null);
				});
				tmpBtn.setEnabled(this.getMainController().getCommandPluginManager().actionByIdExists(tmpToolbarItem.getActionId()));
			}
		});
	}
};
oFF.HuHorizonUiController.prototype._getControllerName = function()
{
	return "Ui Controller";
};
oFF.HuHorizonUiController.prototype._getFinalStartupViewPlugins = function()
{
	let startupViewPlugins = this.getMainController().getConfigurationManager().getPluginsConfiguration().getAllStartupViewPlugins();
	let finalStartupViewPlugins = oFF.XList.create();
	oFF.XCollectionUtils.forEach(this._validateLayoutPluginCountCompatibility(startupViewPlugins), (startupViewPlugin) => {
		let areDependenciesValid = this.getMainController().getPluginToolsService().checkPluginDependencies(startupViewPlugin.getPluginName());
		if (areDependenciesValid)
		{
			finalStartupViewPlugins.add(startupViewPlugin);
		}
		else
		{
			this.getMainController().getMessageManager().addSystemWarningMessage("Dependency missing!", null, oFF.XStringUtils.concatenate3("The dependencies for plugin ", startupViewPlugin.getPluginName(), " are missing!"));
		}
	});
	return finalStartupViewPlugins;
};
oFF.HuHorizonUiController.prototype._onPluginInitialized = function(pluginController)
{
	this.logDebug(oFF.XStringUtils.concatenate2("Rendering plugin ui --> ", pluginController.getName()));
	if (this.getLayoutManager() !== null)
	{
		this.getLayoutManager().addPluginView(pluginController);
	}
};
oFF.HuHorizonUiController.prototype._onPluginRunError = function(pluginController)
{
	this.logDebug(oFF.XStringUtils.concatenate3("Error during plugin startup --> ", pluginController.getName(), " Removing plugin view!"));
	if (this.getLayoutManager() !== null)
	{
		this.getLayoutManager().removePluginView(pluginController);
	}
};
oFF.HuHorizonUiController.prototype._presentEmptyWorkspaceView = function(message)
{
	let emptyWorkspaceView = oFF.HuEmptyWorkspaceView.create(this.getGenesis());
	emptyWorkspaceView.setMessageText(message);
	emptyWorkspaceView.setReloadConfigButtonPressedProcdeure(() => {
		this.getMainController().reloadConfiguration();
	});
	this.m_contentContainer.setContent(emptyWorkspaceView.getView());
};
oFF.HuHorizonUiController.prototype._registerForInternalKeybordEvents = function()
{
	if (oFF.notNull(this.m_mainLayout))
	{
		let changeModeProductionKeyboardState = oFF.UiKeyboardState.create(true, true, false, true, false, "KeyP", null);
		let changeModeDeveloperKeyboardState = oFF.UiKeyboardState.create(true, true, false, true, false, "KeyD", null);
		let changeModeDebugKeyboardState = oFF.UiKeyboardState.create(true, true, false, true, false, "KeyE", null);
		let horizonInternalKeyboardConfig = oFF.UiKeyboardConfiguration.create();
		horizonInternalKeyboardConfig.addPreventDefaultState(changeModeProductionKeyboardState);
		horizonInternalKeyboardConfig.addStopPropagationState(changeModeProductionKeyboardState);
		horizonInternalKeyboardConfig.addPreventDefaultState(changeModeDeveloperKeyboardState);
		horizonInternalKeyboardConfig.addPreventDefaultState(changeModeDebugKeyboardState);
		this.m_mainLayout.setKeyboardConfiguration(horizonInternalKeyboardConfig);
		this.m_mainLayout.registerOnKeyDown(oFF.UiLambdaKeyDownListener.create((keyDownEvent) => {
			if (changeModeProductionKeyboardState.isEqualToAction(keyDownEvent))
			{
				this.getHorizonConfiguration().setFrameworkMode(oFF.HuFrameworkMode.PRODUCTION);
			}
			else if (changeModeDeveloperKeyboardState.isEqualToAction(keyDownEvent))
			{
				this.getHorizonConfiguration().setFrameworkMode(oFF.HuFrameworkMode.DEVELOPER);
				this.getLocalNotificationCenter().postNotificationWithName(oFF.HuHorizonInternalNotifications.SHOW_SHELL_MENU, null);
			}
			else if (changeModeDebugKeyboardState.isEqualToAction(keyDownEvent))
			{
				this.getHorizonConfiguration().setFrameworkMode(oFF.HuFrameworkMode.DEBUG);
				this.getLocalNotificationCenter().postNotificationWithName(oFF.HuHorizonInternalNotifications.SHOW_SHELL_MENU, null);
			}
		}));
	}
};
oFF.HuHorizonUiController.prototype._renderPlugins = function()
{
	this.logDebug("Starting ---== Plugins ==---");
	if (this.getMainController().getConfigurationManager().isConfigurationValid())
	{
		if (this.getMainController().getConfigurationManager().getPluginsConfiguration().hasStartupViewPlugins())
		{
			let finalStartupViewPlugins = this._getFinalStartupViewPlugins();
			if (oFF.notNull(finalStartupViewPlugins) && finalStartupViewPlugins.hasElements())
			{
				return this.getMainController().getViewPluginManager().runAllViewPluginsInOrder(finalStartupViewPlugins).onThenExt((result) => {
					this.logDebug("Finished rendering all startup view plugins!");
					return oFF.XBooleanValue.create(true);
				});
			}
			else
			{
				this._presentEmptyWorkspaceView("Some plugins specified in the configuration have missing dependencies...");
				this.logDebug("Plugin dependencies are missing! Nothing to render...");
				return oFF.XPromise.resolve(oFF.XBooleanValue.create(true));
			}
		}
		else
		{
			this._presentEmptyWorkspaceView("No document or component plugins specified in the configuration...");
			this.logDebug("No view plugins specified in the configuration! Nothing to render...");
			return oFF.XPromise.resolve(oFF.XBooleanValue.create(true));
		}
	}
	else
	{
		this._presentEmptyWorkspaceView("The specified configuration file is invalid...");
		this.logDebug("The specified configuration file is invalid! Nothing to render...");
		return oFF.XPromise.resolve(oFF.XBooleanValue.create(true));
	}
};
oFF.HuHorizonUiController.prototype._renderToolbar = function()
{
	this.logDebug("Rendering ---== Toolbar ==---");
	this._createDebugToolbarGroupIfNeeded();
	this._generateToolbarItemsIfNeeded();
	this.getToolbarManager().renderToolbar();
};
oFF.HuHorizonUiController.prototype._setupController = function()
{
	this.m_freeGenesis = oFF.UiFreeGenesis.create(this.getGenesis().getUiManager());
	this.m_statusBarManager = oFF.HuHorizonStatusBarManager.create(this);
	this.m_toolbarManager = oFF.HuHorizonToolbarManager.create(this);
	this.m_layoutManager = oFF.HuHorizonLayoutManager.create(this, this.getMainController().getConfigurationManager().getLayoutConfiguration());
	this.getMainController().getViewPluginManager().setPluginInitializedConsumer(this._onPluginInitialized.bind(this));
	this.getMainController().getViewPluginManager().setPluginRunErrorConsumer(this._onPluginRunError.bind(this));
	this._applyInitialStatusBarState();
};
oFF.HuHorizonUiController.prototype._shouldShowToolbar = function()
{
	if (this.getMainController().getConfigurationManager().getHorizonConfiguration().isToolbarPropertySet())
	{
		return this.getMainController().getConfigurationManager().getHorizonConfiguration().isToolbarVisible();
	}
	return this.isRunningInDebugEnvironment() || this.getMainController().getConfigurationManager().getToolbarConfiguration().hasToolbarItems();
};
oFF.HuHorizonUiController.prototype._validateLayoutPluginCountCompatibility = function(pluginListToStart)
{
	if (oFF.notNull(pluginListToStart))
	{
		if (this.getLayoutManager().getLayoutType().isSingleViewLayout() && pluginListToStart.size() > 1)
		{
			this.getMainController().getMessageManager().addSystemWarningMessage("Could not render all plugins", "Incompatible layout", "The selected layout only supports rendering of one plugin!");
			this.logDebug(oFF.XStringUtils.concatenate3("A single plugin layout was selected but the configuration plugin count is ", oFF.XInteger.convertToString(pluginListToStart.size()), "! Rendering only the first plugin!"));
			return oFF.XCollectionUtils.singletonList(pluginListToStart.get(0));
		}
	}
	return pluginListToStart;
};
oFF.HuHorizonUiController.prototype.getFreeGenesis = function()
{
	return this.m_freeGenesis;
};
oFF.HuHorizonUiController.prototype.getLayoutManager = function()
{
	return this.m_layoutManager;
};
oFF.HuHorizonUiController.prototype.getStatusBarManager = function()
{
	return this.m_statusBarManager;
};
oFF.HuHorizonUiController.prototype.getToolbarManager = function()
{
	return this.m_toolbarManager;
};
oFF.HuHorizonUiController.prototype.reInitUi = function()
{
	this.logDebug("Initialize Ui");
	this.m_mainLayout = this.getGenesis().newControl(oFF.UiType.FLEX_LAYOUT);
	this.m_mainLayout.useMaxSpace();
	this.m_mainLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_mainLayout.setBackgroundDesign(oFF.UiBackgroundDesign.SOLID);
	this.m_mainLayout.addItem(this.getToolbarManager().getView());
	this.m_contentContainer = this.m_mainLayout.addNewItemOfType(oFF.UiType.CONTENT_WRAPPER);
	this.m_contentContainer.addCssClass("ffHorizonMainContent");
	this.m_contentContainer.setMinHeight(oFF.UiCssLength.create("0"));
	this.m_contentContainer.useMaxSpace();
	this.m_contentContainer.setFlex("1 1 auto");
	this.m_contentContainer.setContent(this.getLayoutManager().getView());
	this.m_mainLayout.addItem(this.getStatusBarManager().getView());
	this._applyInitialConfig();
	this.getMainGenesis().setRoot(this.m_mainLayout);
	this._renderToolbar();
	this._registerForInternalKeybordEvents();
	return this._renderPlugins().onFinally(() => {
		this.logDebug("Ui initialized!");
		this.getLocalNotificationCenter().postNotificationWithName(oFF.HuHorizonInternalNotifications.ALL_PLUGIN_RENDERING_FINISHED, null);
	});
};
oFF.HuHorizonUiController.prototype.releaseObject = function()
{
	this.m_statusBarManager = oFF.XObjectExt.release(this.m_statusBarManager);
	this.m_toolbarManager = oFF.XObjectExt.release(this.m_toolbarManager);
	this.m_layoutManager = oFF.XObjectExt.release(this.m_layoutManager);
	this.m_contentContainer = oFF.XObjectExt.release(this.m_contentContainer);
	this.m_mainLayout = oFF.XObjectExt.release(this.m_mainLayout);
	this.m_freeGenesis = oFF.XObjectExt.release(this.m_freeGenesis);
	this.getMainGenesis().clearUi();
	oFF.HuDfSubController.prototype.releaseObject.call( this );
};

oFF.HuPluginListDialog = function() {};
oFF.HuPluginListDialog.prototype = new oFF.DfUiDialogProgram();
oFF.HuPluginListDialog.prototype._ff_c = "HuPluginListDialog";

oFF.HuPluginListDialog.DEFAULT_PROGRAM_NAME = "HorizonPluginListDialog";
oFF.HuPluginListDialog.ENTRY_LABEL_FLEX = "0 0 120px";
oFF.HuPluginListDialog.ENTRY_WRAPPER_MARGIN = "0.375rem";
oFF.HuPluginListDialog.PARAM_SHOW_ALL = "showAll";
oFF.HuPluginListDialog.createRunnerForDebug = function(parentProcess, showAllPlugins)
{
	let tmpRunner = oFF.ProgramRunner.createRunner(parentProcess, oFF.HuPluginListDialog.DEFAULT_PROGRAM_NAME);
	tmpRunner.setBooleanArgument(oFF.HuPluginListDialog.PARAM_SHOW_ALL, showAllPlugins);
	return tmpRunner;
};
oFF.HuPluginListDialog.prototype.m_currentPluginFactory = null;
oFF.HuPluginListDialog.prototype.m_isShowAll = false;
oFF.HuPluginListDialog.prototype.m_pluginDetailsContainer = null;
oFF.HuPluginListDialog.prototype.m_searchableListView = null;
oFF.HuPluginListDialog.prototype._createChipContainer = function(label, stringList)
{
	let chipContainerLayout = this.getGenesis().newControl(oFF.UiType.FLEX_LAYOUT);
	chipContainerLayout.setDirection(oFF.UiFlexDirection.ROW);
	chipContainerLayout.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	chipContainerLayout.setMinHeight(oFF.UiCssLength.create("1.5rem"));
	chipContainerLayout.setMargin(oFF.UiCssBoxEdges.create(oFF.HuPluginListDialog.ENTRY_WRAPPER_MARGIN));
	let tmpLabelLbl = chipContainerLayout.addNewItemOfType(oFF.UiType.LABEL);
	tmpLabelLbl.setText(oFF.XStringUtils.concatenate2(label, ": "));
	tmpLabelLbl.setFlex(oFF.HuPluginListDialog.ENTRY_LABEL_FLEX);
	if (oFF.notNull(stringList) && stringList.hasElements())
	{
		let chipContainer = chipContainerLayout.addNewItemOfType(oFF.UiType.CHIP_CONTAINER);
		chipContainer.setEditable(false);
		oFF.XCollectionUtils.forEach(stringList, (textEntry) => {
			let tmpChip = chipContainer.addNewChip();
			tmpChip.setText(textEntry);
			tmpChip.setEditable(false);
		});
	}
	else
	{
		let tmpTextLbl = chipContainerLayout.addNewItemOfType(oFF.UiType.LABEL);
		tmpTextLbl.setText("-");
		tmpTextLbl.setFontWeight(oFF.UiFontWeight.BOLD);
	}
	return chipContainerLayout;
};
oFF.HuPluginListDialog.prototype._createNewLabel = function(label, text, wrapping)
{
	let labelLayout = this.getGenesis().newControl(oFF.UiType.FLEX_LAYOUT);
	labelLayout.setDirection(oFF.UiFlexDirection.ROW);
	labelLayout.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	labelLayout.setMargin(oFF.UiCssBoxEdges.create(oFF.HuPluginListDialog.ENTRY_WRAPPER_MARGIN));
	let tmpLabelLbl = labelLayout.addNewItemOfType(oFF.UiType.LABEL);
	tmpLabelLbl.setText(oFF.XStringUtils.concatenate2(label, ": "));
	tmpLabelLbl.setFlex(oFF.HuPluginListDialog.ENTRY_LABEL_FLEX);
	let tmpTextLbl = labelLayout.addNewItemOfType(oFF.UiType.LABEL);
	tmpTextLbl.setText(oFF.XStringUtils.isNotNullAndNotEmpty(text) ? text : "-");
	tmpTextLbl.setFontWeight(oFF.UiFontWeight.BOLD);
	tmpTextLbl.setWrapping(wrapping);
	return labelLayout;
};
oFF.HuPluginListDialog.prototype._fillPluginList = function(pluginType)
{
	if (oFF.notNull(this.m_searchableListView))
	{
		let sortedPluginNames = oFF.HuPluginRegistryBase.getAllRegisteredPluginNames();
		let itemList = oFF.XList.create();
		oFF.XCollectionUtils.forEach(sortedPluginNames, (pluginName) => {
			let tmpPluginFactory = oFF.HuPluginRegistryBase.getPluginFactory(pluginName);
			if (oFF.notNull(tmpPluginFactory) && (oFF.isNull(pluginType) || pluginType === tmpPluginFactory.getPluginType()) && (!tmpPluginFactory.isDebugPlugin() || this.m_isShowAll))
			{
				let newListItem = this.getGenesis().newControl(oFF.UiType.LIST_ITEM);
				newListItem.setName(tmpPluginFactory.getName());
				newListItem.setText(this._getListItemText(tmpPluginFactory));
				newListItem.setCustomObject(tmpPluginFactory);
				newListItem.setIcon(this._getIconForPlugin(tmpPluginFactory));
				newListItem.setTooltip(tmpPluginFactory.getName());
				newListItem.setHighlight(this._getHighlightForPlugin(tmpPluginFactory));
				newListItem.setInfoStateInverted(true);
				newListItem.setInfo(this._getInfoTextForPlugin(tmpPluginFactory));
				newListItem.setInfoState(this._getInfoStateForPlugin(tmpPluginFactory));
				itemList.add(newListItem);
			}
		});
		if (oFF.notNull(itemList) && itemList.hasElements())
		{
			this.m_searchableListView.setListItems(itemList);
		}
	}
};
oFF.HuPluginListDialog.prototype._getHighlightForPlugin = function(pluginFactory)
{
	if (oFF.notNull(pluginFactory))
	{
		if (pluginFactory.isInconsistent())
		{
			return oFF.UiMessageType.WARNING;
		}
		else if (pluginFactory.isPluginFullyValid())
		{
			return oFF.UiMessageType.SUCCESS;
		}
		else if (pluginFactory.canBeInitialized())
		{
			return oFF.UiMessageType.INFORMATION;
		}
	}
	return oFF.UiMessageType.ERROR;
};
oFF.HuPluginListDialog.prototype._getIconForPlugin = function(pluginFactory)
{
	if (oFF.notNull(pluginFactory))
	{
		if (pluginFactory.getPluginType() === oFF.HuPluginType.COMPONENT)
		{
			return "screen-split-two";
		}
		else if (pluginFactory.getPluginType() === oFF.HuPluginType.DOCUMENT)
		{
			return "document";
		}
		else if (pluginFactory.getPluginType() === oFF.HuPluginType.COMMAND)
		{
			return "command-line-interfaces";
		}
	}
	return "question-mark";
};
oFF.HuPluginListDialog.prototype._getInfoStateForPlugin = function(pluginFactory)
{
	if (oFF.notNull(pluginFactory))
	{
		if (pluginFactory.isPluginFullyValid())
		{
			if (pluginFactory.isInconsistent())
			{
				return oFF.UiValueState.WARNING;
			}
			return null;
		}
		if (!pluginFactory.canBeInitialized())
		{
			return oFF.UiValueState.ERROR;
		}
		else
		{
			return oFF.UiValueState.INFORMATION;
		}
	}
	return oFF.UiValueState.NONE;
};
oFF.HuPluginListDialog.prototype._getInfoTextForPlugin = function(pluginFactory)
{
	if (oFF.notNull(pluginFactory))
	{
		if (pluginFactory.isPluginFullyValid())
		{
			if (pluginFactory.isInconsistent())
			{
				return "Inconsistent";
			}
			return null;
		}
		if (!pluginFactory.canBeInitialized())
		{
			return "Error";
		}
		else
		{
			return "No Manifest";
		}
	}
	return null;
};
oFF.HuPluginListDialog.prototype._getListItemText = function(pluginFactory)
{
	let itemText = "Unknown";
	if (oFF.notNull(pluginFactory))
	{
		itemText = pluginFactory.getDisplayName();
		if (oFF.XStringUtils.isNullOrEmpty(itemText))
		{
			itemText = pluginFactory.getName();
		}
	}
	return itemText;
};
oFF.HuPluginListDialog.prototype._getTagList = function(pluginFactory)
{
	if (oFF.notNull(pluginFactory) && pluginFactory.getTags() !== null && pluginFactory.getTags().hasElements())
	{
		let newStrList = oFF.XList.create();
		oFF.XCollectionUtils.forEach(pluginFactory.getTags(), (tag) => {
			newStrList.add(tag.getName());
		});
		return newStrList;
	}
	return null;
};
oFF.HuPluginListDialog.prototype._prepareUi = function()
{
	this._fillPluginList(null);
	if (oFF.notNull(this.m_searchableListView) && this.m_searchableListView.getListItems().hasElements())
	{
		let tmpListItem = this.m_searchableListView.getListItems().get(0);
		this.m_searchableListView.selectItem(tmpListItem);
		let tmpPluginFactory = tmpListItem.getCustomObject();
		this._updateDetails(tmpPluginFactory);
	}
};
oFF.HuPluginListDialog.prototype._setupTypeDropdown = function()
{
	if (oFF.notNull(this.m_searchableListView))
	{
		let dropdownItemList = oFF.XList.create();
		let allDdItem = this.getGenesis().newControl(oFF.UiType.DROPDOWN_ITEM);
		allDdItem.setTag(null);
		allDdItem.setText("All");
		dropdownItemList.add(allDdItem);
		oFF.XCollectionUtils.forEach(oFF.HuPluginType.getAllTypeNames(), (typeName) => {
			let tmpDdItem = this.getGenesis().newControl(oFF.UiType.DROPDOWN_ITEM);
			tmpDdItem.setTag(typeName);
			tmpDdItem.setText(typeName);
			dropdownItemList.add(tmpDdItem);
		});
		this.m_searchableListView.addFilterDropdown(dropdownItemList, allDdItem, (selectedDdItem) => {
			let currentSerchText = this.m_searchableListView.getSearchText();
			this._fillPluginList(oFF.HuPluginType.lookup(selectedDdItem.getTag()));
			this.m_searchableListView.search(currentSerchText);
		});
	}
};
oFF.HuPluginListDialog.prototype._showPluginDetails = function(pluginFactory)
{
	if (oFF.notNull(this.m_pluginDetailsContainer) && oFF.notNull(pluginFactory))
	{
		let detailsLayout = this.m_pluginDetailsContainer.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
		detailsLayout.setDirection(oFF.UiFlexDirection.COLUMN);
		detailsLayout.useMaxWidth();
		detailsLayout.useMaxHeight();
		detailsLayout.setPadding(oFF.UiCssBoxEdges.create("0.5rem"));
		let pluginTitle = detailsLayout.addNewItemOfType(oFF.UiType.TITLE);
		pluginTitle.setText(this._getListItemText(pluginFactory));
		pluginTitle.setTitleLevel(oFF.UiTitleLevel.H_4);
		pluginTitle.setTitleStyle(oFF.UiTitleLevel.H_4);
		pluginTitle.setMargin(oFF.UiCssBoxEdges.create("0.5rem"));
		pluginTitle.setWrapping(false);
		pluginTitle.setFlex("0 0 auto");
		pluginTitle.setBorderColor(oFF.UiColor.GREY);
		pluginTitle.setBorderWidth(oFF.UiCssBoxEdges.create("0px 0px 1px 0px"));
		pluginTitle.setBorderStyle(oFF.UiBorderStyle.SOLID);
		let pluginNameLbl = this._createNewLabel("Plugin name", pluginFactory.getName(), true);
		detailsLayout.addItem(pluginNameLbl);
		let pluginTypeLbl = this._createNewLabel("Plugin type", pluginFactory.getPluginType() !== null ? pluginFactory.getPluginType().getName() : "Unknown", true);
		detailsLayout.addItem(pluginTypeLbl);
		let descriptionLbl = this._createNewLabel("Description", pluginFactory.getDescription(), true);
		detailsLayout.addItem(descriptionLbl);
		let authorLbl = this._createNewLabel("Author", pluginFactory.getAuthor(), true);
		detailsLayout.addItem(authorLbl);
		let versionLbl = this._createNewLabel("Version", pluginFactory.getVersion(), true);
		detailsLayout.addItem(versionLbl);
		let categoryLbl = this._createNewLabel("Category", pluginFactory.getPluginCategory().getName(), true);
		detailsLayout.addItem(categoryLbl);
		let tagsLbl = this._createChipContainer("Tags", this._getTagList(pluginFactory));
		detailsLayout.addItem(tagsLbl);
		let pluginDependenciesLbl = this._createNewLabel("Dependencies", oFF.XCollectionUtils.join(pluginFactory.getDependencies(), ", "), true);
		detailsLayout.addItem(pluginDependenciesLbl);
		let modulesLbl = this._createNewLabel("Modules", oFF.XCollectionUtils.join(pluginFactory.getModules(), ", "), true);
		detailsLayout.addItem(modulesLbl);
		let subSystemsLbl = this._createNewLabel("SubSystems", oFF.XCollectionUtils.join(pluginFactory.getSubSystems(), ", "), true);
		detailsLayout.addItem(subSystemsLbl);
		let isPluginLoadedLbl = this._createNewLabel("Is loaded", pluginFactory.isPluginLoaded() ? "Yes" : "No", true);
		detailsLayout.addItem(isPluginLoadedLbl);
		let hasManifestLbl = this._createNewLabel("Has manifest", pluginFactory.getManifest() !== null ? "Yes" : "No", true);
		detailsLayout.addItem(hasManifestLbl);
		if (pluginFactory.getManifest() !== null)
		{
			let manifestOriginPathLbl = this._createNewLabel("Manifest origin", pluginFactory.getManifestOriginPath(), true);
			detailsLayout.addItem(manifestOriginPathLbl);
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(pluginFactory.getUrl()))
		{
			let sourceUrlLbl = this._createNewLabel("Source url", pluginFactory.getUrl(), true);
			detailsLayout.addItem(sourceUrlLbl);
		}
		let hasConfigurationMetadataLbl = this._createNewLabel("Has configuration", pluginFactory.getConfigurationMetadata() !== null ? "Yes" : "No", true);
		detailsLayout.addItem(hasConfigurationMetadataLbl);
	}
};
oFF.HuPluginListDialog.prototype._updateDetails = function(pluginFactory)
{
	if (oFF.notNull(this.m_pluginDetailsContainer) && oFF.notNull(pluginFactory))
	{
		this.m_pluginDetailsContainer.clearItems();
		this.m_currentPluginFactory = pluginFactory;
		this._showPluginDetails(pluginFactory);
	}
};
oFF.HuPluginListDialog.prototype.buildUi = function(genesis)
{
	let mainLayout = genesis.newControl(oFF.UiType.FLEX_LAYOUT);
	mainLayout.useMaxSpace();
	mainLayout.setDirection(oFF.UiFlexDirection.ROW);
	mainLayout.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	mainLayout.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
	mainLayout.setWrap(oFF.UiFlexWrap.NO_WRAP);
	mainLayout.setBackgroundDesign(oFF.UiBackgroundDesign.SOLID);
	this.m_searchableListView = oFF.UtSearchableListView.create(this.getGenesis(), null);
	this.m_searchableListView.setSearchFieldPlaceholder("Search plugin...");
	this.m_searchableListView.setListItemSelectedConsumer((selectedListItem) => {
		let tmpPluginFactory = selectedListItem.getCustomObject();
		this._updateDetails(tmpPluginFactory);
	});
	this.m_searchableListView.setListChangdConsumer((newList) => {
		if (oFF.notNull(this.m_currentPluginFactory))
		{
			let foundListItem = oFF.XCollectionUtils.findFirst(newList, (listItem) => {
				return listItem.getCustomObject() === this.m_currentPluginFactory;
			});
			if (oFF.notNull(foundListItem))
			{
				this.m_searchableListView.selectItem(foundListItem);
			}
		}
	});
	this._setupTypeDropdown();
	let searchableListWrapper = this.m_searchableListView.getView();
	searchableListWrapper.setWidth(oFF.UiCssLength.create("300px"));
	searchableListWrapper.setFlex("0 0 300px ");
	searchableListWrapper.setBorderWidth(oFF.UiCssBoxEdges.create("0px 1px 0px 0px"));
	searchableListWrapper.setBorderColor(oFF.UiColor.GREY);
	searchableListWrapper.setBorderStyle(oFF.UiBorderStyle.SOLID);
	mainLayout.addItem(searchableListWrapper);
	this.m_pluginDetailsContainer = mainLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	this.m_pluginDetailsContainer.useMaxHeight();
	this.m_pluginDetailsContainer.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_pluginDetailsContainer.setJustifyContent(oFF.UiFlexJustifyContent.START);
	this.m_pluginDetailsContainer.setAlignItems(oFF.UiFlexAlignItems.START);
	this.m_pluginDetailsContainer.setMinWidth(oFF.UiCssLength.create("0"));
	this.m_pluginDetailsContainer.setFlex("auto");
	this.m_pluginDetailsContainer.setBackgroundColor(oFF.UiColor.WHITE);
	genesis.setRoot(mainLayout);
	this._prepareUi();
};
oFF.HuPluginListDialog.prototype.getDefaultContainerSize = function()
{
	return oFF.UiSize.createByCss("900px", "60vh");
};
oFF.HuPluginListDialog.prototype.getDialogButtons = function(genesis)
{
	let closeBtn = genesis.newControl(oFF.UiType.DIALOG_BUTTON);
	closeBtn.setText("Close");
	closeBtn.setIcon("sys-cancel-2");
	closeBtn.registerOnPress(oFF.UiLambdaPressListener.create((event) => {
		this.terminate();
	}));
	let tmpList = oFF.XList.create();
	tmpList.add(closeBtn);
	return tmpList;
};
oFF.HuPluginListDialog.prototype.getLogSeverity = function()
{
	return oFF.DfUiDialogProgram.prototype.getLogSeverity.call( this );
};
oFF.HuPluginListDialog.prototype.getProgramName = function()
{
	return oFF.HuPluginListDialog.DEFAULT_PROGRAM_NAME;
};
oFF.HuPluginListDialog.prototype.newProgram = function()
{
	let prg = new oFF.HuPluginListDialog();
	prg.setup();
	return prg;
};
oFF.HuPluginListDialog.prototype.prepareProgramMetadata = function(metadata)
{
	metadata.addParameter(oFF.HuPluginListDialog.PARAM_SHOW_ALL, "Whether to show all the plugins, including debug ones!");
};
oFF.HuPluginListDialog.prototype.processArguments = function(args)
{
	this.m_isShowAll = args.getBooleanByKeyExt(oFF.HuPluginListDialog.PARAM_SHOW_ALL, false);
};
oFF.HuPluginListDialog.prototype.processConfiguration = function(configuration) {};
oFF.HuPluginListDialog.prototype.releaseObject = function()
{
	this.m_currentPluginFactory = null;
	this.m_searchableListView = oFF.XObjectExt.release(this.m_searchableListView);
	this.m_pluginDetailsContainer = oFF.XObjectExt.release(this.m_pluginDetailsContainer);
	oFF.DfUiDialogProgram.prototype.releaseObject.call( this );
};
oFF.HuPluginListDialog.prototype.setupProgram = function()
{
	this.setTitle("Horizon Plugin List");
	return null;
};

oFF.HorizonUiModule = function() {};
oFF.HorizonUiModule.prototype = new oFF.DfModule();
oFF.HorizonUiModule.prototype._ff_c = "HorizonUiModule";

oFF.HorizonUiModule.s_module = null;
oFF.HorizonUiModule.getInstance = function()
{
	if (oFF.isNull(oFF.HorizonUiModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.HorizonUiApiModule.getInstance());
		oFF.HorizonUiModule.s_module = oFF.DfModule.startExt(new oFF.HorizonUiModule());
		oFF.HuBootControllerStatus.staticSetup();
		oFF.HuMainControllerStatus.staticSetup();
		oFF.HuPluginManifestProcessingMode.staticSetup();
		oFF.HuFrameworkMode.staticSetup();
		oFF.HuMessageType.staticSetup();
		oFF.HuMessageGroup.staticSetup();
		oFF.HuToolbarGroup.staticSetup();
		oFF.HuErrorType.staticSetupHorizon();
		oFF.HuPluginControllerFactory.staticSetup();
		oFF.HuLayoutFactory.staticSetup();
		oFF.HuPluginRegistryBase.staticSetup();
		oFF.ProgramRegistry.setProgramFactory(new oFF.HuHorizon());
		oFF.ProgramRegistry.setProgramFactory(new oFF.HuPluginListDialog());
		oFF.HuPluginManifestLoader.loadPluginManifestsFromResources();
		oFF.DfModule.stopExt(oFF.HorizonUiModule.s_module);
	}
	return oFF.HorizonUiModule.s_module;
};
oFF.HorizonUiModule.prototype.getName = function()
{
	return "ff3610.horizon.ui";
};

oFF.HorizonUiModule.getInstance();

return oFF;
} );