/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff3100.system.ui"
],
function(oFF)
{
"use strict";

oFF.HuHorizonApi = {

	HORIZON_PROGRAM_NAME:"Horizon",
	PARAM_CONFIG:"config",
	PARAM_CONFIG_FILE:"configFile",
	PARAM_SHOW_SPLASH_SCREEN:"showSplashScreen",
	PARAM_WORKSPACE_DIR:"workspaceDir",
	createRunnerWithConfiguration:function(parentProcess, configStr, showSplashScreen)
	{
			let tmpRunner = oFF.ProgramRunner.createRunner(parentProcess, oFF.HuHorizonApi.HORIZON_PROGRAM_NAME);
		tmpRunner.setStringArgument(oFF.HuHorizonApi.PARAM_CONFIG, configStr);
		tmpRunner.setBooleanArgument(oFF.HuHorizonApi.PARAM_SHOW_SPLASH_SCREEN, showSplashScreen);
		return tmpRunner;
	}
};

oFF.HuPluginRegistry = {

	s_pluginsClasses:null,
	getAllApiPlugins:function()
	{
			return oFF.HuPluginRegistry.s_pluginsClasses.getValuesAsReadOnlyList();
	},
	getAllApiPluginsNamesSorted:function()
	{
			let tmpPluginNamesSorted = oFF.HuPluginRegistry.s_pluginsClasses.getKeysAsReadOnlyList().createListCopy();
		tmpPluginNamesSorted.sortByDirection(oFF.XSortDirection.ASCENDING);
		return tmpPluginNamesSorted;
	},
	getPluginClass:function(pluginName)
	{
			return oFF.HuPluginRegistry.s_pluginsClasses.getByKey(pluginName);
	},
	registerPluginByClass:function(pluginClass)
	{
			if (oFF.notNull(pluginClass))
		{
			try
			{
				let tmpInstance = pluginClass.newInstance(null);
				let pluginName = tmpInstance.getName();
				if (!oFF.HuPluginRegistry.s_pluginsClasses.containsKey(pluginName))
				{
					oFF.HuPluginRegistry.s_pluginsClasses.put(pluginName, pluginClass);
				}
				tmpInstance = null;
			}
			catch (e)
			{
				throw oFF.XException.createRuntimeException("Failed to register plugin class! Class might be invalid!");
			}
		}
	},
	staticSetup:function()
	{
			oFF.HuPluginRegistry.s_pluginsClasses = oFF.XLinkedHashMapByString.create();
	}
};

oFF.HuUtils = {

	generateActionId:function(pluginName, actionName)
	{
			return oFF.XStringUtils.concatenate3(pluginName, ".", actionName);
	},
	generateSinglePluginStartupConfig:function(pluginName, pluginConfigStruct, commandPluginList)
	{
			let startupConfigStruct = oFF.PrFactory.createStructure();
		startupConfigStruct.putNewStructure("configuration");
		startupConfigStruct.putNewList("toolbar");
		if (oFF.XCollectionUtils.hasElements(commandPluginList))
		{
			startupConfigStruct.put("commands", commandPluginList);
		}
		else
		{
			startupConfigStruct.putNewList("commands");
		}
		let layoutStruct = startupConfigStruct.putNewStructure("layout");
		layoutStruct.putString("type", oFF.HuLayoutType.SINGLE_PLUGIN.getName());
		let pluginsList = startupConfigStruct.putNewList("plugins");
		let pluginToStartStruct = pluginsList.addNewStructure();
		pluginToStartStruct.putString("plugin", pluginName);
		if (oFF.XCollectionUtils.hasElements(pluginConfigStruct))
		{
			pluginToStartStruct.put("config", pluginConfigStruct);
		}
		else
		{
			pluginToStartStruct.putNewStructure("config");
		}
		return startupConfigStruct;
	}
};

oFF.HuDfHorizonPlugin = function() {};
oFF.HuDfHorizonPlugin.prototype = new oFF.XObject();
oFF.HuDfHorizonPlugin.prototype._ff_c = "HuDfHorizonPlugin";

oFF.HuDfHorizonPlugin.prototype.addErrorMessage = function(title, subtitle, description)
{
	this.getController().addErrorMessage(title, subtitle, description);
};
oFF.HuDfHorizonPlugin.prototype.addInfoMessage = function(title, subtitle, description)
{
	this.getController().addInfoMessage(title, subtitle, description);
};
oFF.HuDfHorizonPlugin.prototype.addSuccessMessage = function(title, subtitle, description)
{
	this.getController().addSuccessMessage(title, subtitle, description);
};
oFF.HuDfHorizonPlugin.prototype.addWarningMessage = function(title, subtitle, description)
{
	this.getController().addWarningMessage(title, subtitle, description);
};
oFF.HuDfHorizonPlugin.prototype.destroyPlugin = function()
{
	this._internalCleanup();
};
oFF.HuDfHorizonPlugin.prototype.executeAction = function(pluginName, actionName, customData)
{
	this._getControllerInternal().executeAction(pluginName, actionName, customData);
};
oFF.HuDfHorizonPlugin.prototype.executeActionById = function(actionId, customObject)
{
	this._getControllerInternal().executeActionById(actionId, customObject);
};
oFF.HuDfHorizonPlugin.prototype.generateActionId = function(commandPluginName, actionName)
{
	return oFF.XStringUtils.concatenate3(commandPluginName, ".", actionName);
};
oFF.HuDfHorizonPlugin.prototype.getApplication = function()
{
	let application = this.getController().getProcess().getApplication();
	return application;
};
oFF.HuDfHorizonPlugin.prototype.getConfiguration = function()
{
	return this._getControllerInternal().getConfiguration();
};
oFF.HuDfHorizonPlugin.prototype.getController = function()
{
	return this._getControllerInternal();
};
oFF.HuDfHorizonPlugin.prototype.getDataSpace = function()
{
	return this._getControllerInternal().getDataSpace();
};
oFF.HuDfHorizonPlugin.prototype.getLocalNotificationCenter = function()
{
	return this._getControllerInternal().getLocalNotificationCenter();
};
oFF.HuDfHorizonPlugin.prototype.getName = function()
{
	return this.getPluginName();
};
oFF.HuDfHorizonPlugin.prototype.getProcess = function()
{
	return this._getControllerInternal().getProcess();
};
oFF.HuDfHorizonPlugin.prototype.logDebug = function(logline)
{
	oFF.XLogger.println(logline);
};
oFF.HuDfHorizonPlugin.prototype.logError = function(logline)
{
	this.getProcess().getLogger().logError(logline);
};
oFF.HuDfHorizonPlugin.prototype.logInfo = function(logline)
{
	this.getProcess().getLogger().log(logline);
};
oFF.HuDfHorizonPlugin.prototype.logWarning = function(logline)
{
	this.getProcess().getLogger().logWarning(logline);
};
oFF.HuDfHorizonPlugin.prototype.onConfigurationChanged = function(configuration) {};
oFF.HuDfHorizonPlugin.prototype.processConfiguration = function(configuration) {};

oFF.HuDfCommandPlugin = function() {};
oFF.HuDfCommandPlugin.prototype = new oFF.HuDfHorizonPlugin();
oFF.HuDfCommandPlugin.prototype._ff_c = "HuDfCommandPlugin";

oFF.HuDfCommandPlugin.prototype.m_commandController = null;
oFF.HuDfCommandPlugin.prototype._getControllerInternal = function()
{
	return this.m_commandController;
};
oFF.HuDfCommandPlugin.prototype._internalCleanup = function()
{
	this.m_commandController = null;
};
oFF.HuDfCommandPlugin.prototype.getPluginType = function()
{
	return oFF.HuPluginType.COMMAND;
};
oFF.HuDfCommandPlugin.prototype.setupPlugin = function(controller)
{
	this.m_commandController = controller;
	return null;
};

oFF.HuLayoutType = function() {};
oFF.HuLayoutType.prototype = new oFF.XConstant();
oFF.HuLayoutType.prototype._ff_c = "HuLayoutType";

oFF.HuLayoutType.CAROUSEL = null;
oFF.HuLayoutType.FLEX = null;
oFF.HuLayoutType.GRID = null;
oFF.HuLayoutType.INTERACTIVE_SPLITTER = null;
oFF.HuLayoutType.SINGLE_PLUGIN = null;
oFF.HuLayoutType.TAB_BAR = null;
oFF.HuLayoutType.s_lookup = null;
oFF.HuLayoutType._createWithName = function(name)
{
	let newType = oFF.XConstant.setupName(new oFF.HuLayoutType(), name);
	newType.m_isSingleViewLayout = false;
	oFF.HuLayoutType.s_lookup.put(name, newType);
	return newType;
};
oFF.HuLayoutType.getAllTypeNames = function()
{
	return oFF.HuLayoutType.s_lookup.getKeysAsReadOnlyList();
};
oFF.HuLayoutType.lookup = function(name)
{
	return oFF.HuLayoutType.s_lookup.getByKey(name);
};
oFF.HuLayoutType.staticSetup = function()
{
	oFF.HuLayoutType.s_lookup = oFF.XHashMapByString.create();
	oFF.HuLayoutType.SINGLE_PLUGIN = oFF.HuLayoutType._createWithName("SinglePlugin")._setIsSingleViewLayout();
	oFF.HuLayoutType.INTERACTIVE_SPLITTER = oFF.HuLayoutType._createWithName("InteractiveSplitter");
	oFF.HuLayoutType.CAROUSEL = oFF.HuLayoutType._createWithName("Carousel");
	oFF.HuLayoutType.TAB_BAR = oFF.HuLayoutType._createWithName("TabBar");
	oFF.HuLayoutType.FLEX = oFF.HuLayoutType._createWithName("Flex");
	oFF.HuLayoutType.GRID = oFF.HuLayoutType._createWithName("Grid");
};
oFF.HuLayoutType.prototype.m_isSingleViewLayout = false;
oFF.HuLayoutType.prototype._setIsSingleViewLayout = function()
{
	this.m_isSingleViewLayout = true;
	return this;
};
oFF.HuLayoutType.prototype.isSingleViewLayout = function()
{
	return this.m_isSingleViewLayout;
};

oFF.HuPluginType = function() {};
oFF.HuPluginType.prototype = new oFF.XConstant();
oFF.HuPluginType.prototype._ff_c = "HuPluginType";

oFF.HuPluginType.COMMAND = null;
oFF.HuPluginType.COMPONENT = null;
oFF.HuPluginType.DOCUMENT = null;
oFF.HuPluginType.s_lookup = null;
oFF.HuPluginType._createWithName = function(name)
{
	let newType = oFF.XConstant.setupName(new oFF.HuPluginType(), name);
	newType.m_hasUi = false;
	oFF.HuPluginType.s_lookup.put(name, newType);
	return newType;
};
oFF.HuPluginType.getAllTypeNames = function()
{
	return oFF.HuPluginType.s_lookup.getKeysAsReadOnlyList();
};
oFF.HuPluginType.lookup = function(name)
{
	return oFF.HuPluginType.s_lookup.getByKey(name);
};
oFF.HuPluginType.staticSetup = function()
{
	oFF.HuPluginType.s_lookup = oFF.XHashMapByString.create();
	oFF.HuPluginType.COMPONENT = oFF.HuPluginType._createWithName("Component").setHasUi();
	oFF.HuPluginType.DOCUMENT = oFF.HuPluginType._createWithName("Document").setHasUi();
	oFF.HuPluginType.COMMAND = oFF.HuPluginType._createWithName("Command");
};
oFF.HuPluginType.prototype.m_hasUi = false;
oFF.HuPluginType.prototype.hasUi = function()
{
	return this.m_hasUi;
};
oFF.HuPluginType.prototype.setHasUi = function()
{
	this.m_hasUi = true;
	return this;
};

oFF.HuDfComponentPlugin = function() {};
oFF.HuDfComponentPlugin.prototype = new oFF.HuDfHorizonPlugin();
oFF.HuDfComponentPlugin.prototype._ff_c = "HuDfComponentPlugin";

oFF.HuDfComponentPlugin.prototype.m_componentController = null;
oFF.HuDfComponentPlugin.prototype._getControllerInternal = function()
{
	return this.m_componentController;
};
oFF.HuDfComponentPlugin.prototype._internalCleanup = function()
{
	this.m_componentController = null;
};
oFF.HuDfComponentPlugin.prototype.didBecameHidden = function() {};
oFF.HuDfComponentPlugin.prototype.didBecameVisible = function() {};
oFF.HuDfComponentPlugin.prototype.getPluginType = function()
{
	return oFF.HuPluginType.COMPONENT;
};
oFF.HuDfComponentPlugin.prototype.onResize = function(offsetWidth, offsetHeight) {};
oFF.HuDfComponentPlugin.prototype.setupPlugin = function(controller)
{
	this.m_componentController = controller;
	return null;
};

oFF.HuDfDocumentPlugin = function() {};
oFF.HuDfDocumentPlugin.prototype = new oFF.HuDfHorizonPlugin();
oFF.HuDfDocumentPlugin.prototype._ff_c = "HuDfDocumentPlugin";

oFF.HuDfDocumentPlugin.prototype.m_documentController = null;
oFF.HuDfDocumentPlugin.prototype._getControllerInternal = function()
{
	return this.m_documentController;
};
oFF.HuDfDocumentPlugin.prototype._internalCleanup = function()
{
	this.m_documentController = null;
};
oFF.HuDfDocumentPlugin.prototype.didBecameHidden = function() {};
oFF.HuDfDocumentPlugin.prototype.didBecameVisible = function() {};
oFF.HuDfDocumentPlugin.prototype.getAutoLayoutConfiguration = function()
{
	return null;
};
oFF.HuDfDocumentPlugin.prototype.getGenesis = function()
{
	return this._getControllerInternal().getGenesis();
};
oFF.HuDfDocumentPlugin.prototype.getGlobalDataSpace = function()
{
	return this.getController().getGlobalDataSpace();
};
oFF.HuDfDocumentPlugin.prototype.getPluginType = function()
{
	return oFF.HuPluginType.DOCUMENT;
};
oFF.HuDfDocumentPlugin.prototype.onResize = function(offsetWidth, offsetHeight) {};
oFF.HuDfDocumentPlugin.prototype.setupPlugin = function(controller)
{
	this.m_documentController = controller;
	return null;
};

oFF.HuPluginCategory = function() {};
oFF.HuPluginCategory.prototype = new oFF.UiBaseConstant();
oFF.HuPluginCategory.prototype._ff_c = "HuPluginCategory";

oFF.HuPluginCategory.DEBUG = null;
oFF.HuPluginCategory.OLAP = null;
oFF.HuPluginCategory.OTHER = null;
oFF.HuPluginCategory.SYSTEM = null;
oFF.HuPluginCategory.TEST = null;
oFF.HuPluginCategory.TOOL = null;
oFF.HuPluginCategory.UNCATEGORIZED = null;
oFF.HuPluginCategory.s_lookup = null;
oFF.HuPluginCategory.createCategoryIfNecessary = function(name)
{
	if (oFF.XStringUtils.isNullOrEmpty(name))
	{
		return null;
	}
	let capitalizedName = oFF.XStringUtils.capitalize(name);
	let customCategory = oFF.HuPluginCategory.lookup(capitalizedName);
	if (oFF.isNull(customCategory))
	{
		customCategory = oFF.HuPluginCategory.createWithName(capitalizedName);
	}
	return oFF.HuPluginCategory.lookup(capitalizedName);
};
oFF.HuPluginCategory.createWithName = function(name)
{
	let newType = oFF.UiBaseConstant.createUiConstant(new oFF.HuPluginCategory(), name, oFF.HuPluginCategory.s_lookup);
	newType.m_isDebug = false;
	return newType;
};
oFF.HuPluginCategory.lookup = function(name)
{
	return oFF.UiBaseConstant.lookupConstant(name, oFF.HuPluginCategory.s_lookup);
};
oFF.HuPluginCategory.staticSetup = function()
{
	oFF.HuPluginCategory.s_lookup = oFF.XHashMapByString.create();
	oFF.HuPluginCategory.SYSTEM = oFF.HuPluginCategory.createWithName("System");
	oFF.HuPluginCategory.OLAP = oFF.HuPluginCategory.createWithName("Olap");
	oFF.HuPluginCategory.TOOL = oFF.HuPluginCategory.createWithName("Tool");
	oFF.HuPluginCategory.DEBUG = oFF.HuPluginCategory.createWithName("Debug").setIsDebug();
	oFF.HuPluginCategory.TEST = oFF.HuPluginCategory.createWithName("Test");
	oFF.HuPluginCategory.OTHER = oFF.HuPluginCategory.createWithName("Other");
	oFF.HuPluginCategory.UNCATEGORIZED = oFF.HuPluginCategory.createWithName("Uncategorized");
};
oFF.HuPluginCategory.prototype.m_isDebug = false;
oFF.HuPluginCategory.prototype.isDebug = function()
{
	return this.m_isDebug;
};
oFF.HuPluginCategory.prototype.setIsDebug = function()
{
	this.m_isDebug = true;
	return this;
};

oFF.HuPluginTag = function() {};
oFF.HuPluginTag.prototype = new oFF.UiBaseConstant();
oFF.HuPluginTag.prototype._ff_c = "HuPluginTag";

oFF.HuPluginTag.DEBUG = null;
oFF.HuPluginTag.s_lookup = null;
oFF.HuPluginTag.createCustomTagIfNecessary = function(name)
{
	if (oFF.XStringUtils.isNullOrEmpty(name))
	{
		return null;
	}
	let customTag = oFF.HuPluginTag.lookup(name);
	if (oFF.isNull(customTag))
	{
		customTag = oFF.HuPluginTag.createWithName(name);
	}
	return oFF.HuPluginTag.lookup(name);
};
oFF.HuPluginTag.createWithName = function(name)
{
	let newTag = oFF.UiBaseConstant.createUiConstant(new oFF.HuPluginTag(), name, oFF.HuPluginTag.s_lookup);
	return newTag;
};
oFF.HuPluginTag.lookup = function(name)
{
	return oFF.UiBaseConstant.lookupConstant(name, oFF.HuPluginTag.s_lookup);
};
oFF.HuPluginTag.staticSetup = function()
{
	oFF.HuPluginTag.s_lookup = oFF.XHashMapByString.create();
	oFF.HuPluginTag.DEBUG = oFF.HuPluginTag.createWithName("debug");
};

oFF.HorizonUiApiModule = function() {};
oFF.HorizonUiApiModule.prototype = new oFF.DfModule();
oFF.HorizonUiApiModule.prototype._ff_c = "HorizonUiApiModule";

oFF.HorizonUiApiModule.s_module = null;
oFF.HorizonUiApiModule.getInstance = function()
{
	if (oFF.isNull(oFF.HorizonUiApiModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.SystemUiModule.getInstance());
		oFF.HorizonUiApiModule.s_module = oFF.DfModule.startExt(new oFF.HorizonUiApiModule());
		oFF.HuPluginType.staticSetup();
		oFF.HuPluginCategory.staticSetup();
		oFF.HuPluginTag.staticSetup();
		oFF.HuLayoutType.staticSetup();
		oFF.HuPluginRegistry.staticSetup();
		oFF.DfModule.stopExt(oFF.HorizonUiApiModule.s_module);
	}
	return oFF.HorizonUiApiModule.s_module;
};
oFF.HorizonUiApiModule.prototype.getName = function()
{
	return "ff3600.horizon.ui.api";
};

oFF.HorizonUiApiModule.getInstance();

return oFF;
} );