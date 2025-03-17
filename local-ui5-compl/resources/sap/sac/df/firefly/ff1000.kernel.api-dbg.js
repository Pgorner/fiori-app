/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff0230.io.ext"
],
function(oFF)
{
"use strict";

oFF.CoConfigurationMetadataConstants = {

	CONFIGURATION_KEY:"Configuration",
	DESCRIPTION_KEY:"Description",
	NAME_KEY:"Name",
	PROPERTIES_KEY:"Properties",
	TITLE_KEY:"Title",
	TYPE_KEY:"Type"
};

oFF.CoPropertyMetadataConstants = {

	ADMIN_ONLY_KEY:"AdminOnly",
	CHOICES_KEY:"Choices",
	DEFAULT_KEY:"Default",
	DESCRIPTION_KEY:"Description",
	DISPLAY_NAME_KEY:"DisplayName",
	ENUM_KEY:"Enum",
	EXCLUSIVE_MAXIMUM_KEY:"ExclusiveMaximum",
	EXCLUSIVE_MINIMUM_KEY:"ExclusiveMinimum",
	GROUP_KEY:"Group",
	HIDDEN_KEY:"Hidden",
	ITEMS_KEY:"Items",
	MAXIMUM_KEY:"Maximum",
	MAX_LENGTH_KEY:"MaxLength",
	MINIMUM_KEY:"Minimum",
	MIN_ITEMS_KEY:"MinItems",
	MIN_LENGTH_KEY:"MinLength",
	MULTIPLE_OF_KEY:"MultipleOf",
	NAME_KEY:"Name",
	PATTERN_KEY:"Pattern",
	PROPERTIES_KEY:"Properties",
	PROPERTY_KEY:"Property",
	TYPE_KEY:"Type",
	UNIQUE_ITEMS_KEY:"UniqueItems"
};

oFF.XFileAttribute = {

	ACCESS_RIGHTS:"os.accessRights",
	ANCESTOR_RESOURCE:"contentlib.ancestorResource",
	BOOLEAN_BASED:"abstract.BooleanBased",
	CAN_ASSIGN:"auth.canAssign",
	CAN_COMMENT_ADD:"auth.canCommentAdd",
	CAN_COMMENT_DELETE:"auth.canCommentDelete",
	CAN_COMMENT_VIEW:"auth.canCommentView",
	CAN_COPY:"auth.canCopy",
	CAN_CREATE_DOC:"auth.canCreateDoc",
	CAN_CREATE_FOLDER:"auth.canCreateFolder",
	CAN_DELETE:"auth.canDelete",
	CAN_MAINTAIN:"auth.canMaintain",
	CAN_READ:"auth.canRead",
	CAN_UPDATE:"auth.canUpdate",
	CHANGED_AT:"os.changedAt",
	CHANGED_BY:"os.changedBy",
	CHANGED_BY_DISPLAY_NAME:"os.changedBy.displayName",
	COMMANDS_LIST:"list",
	COMMANDS_METADATA:"os.cmds",
	COMMAND_ARGS:"arguments",
	COMMAND_ARG_DESCRIPTION:"argDescription",
	COMMAND_ARG_NAME:"argName",
	COMMAND_ARG_TYPE:"argType",
	COMMAND_DESCRIPTION:"description",
	COMMAND_NAME:"name",
	COMMAND_RETURN_DESCRIPTION:"returnDescription",
	COMMAND_RETURN_TYPE:"returnType",
	CREATED_AT:"os.createdAt",
	CREATED_BY:"os.createdBy",
	CREATED_BY_DISPLAY_NAME:"os.createdBy.displayName",
	DATE_MS_BASED:"abstract.DateMsBased",
	DESCRIPTION:"os.node.description",
	DISPLAY_NAME:"os.displayName",
	FILE_TYPE:"os.fileType",
	FOLDER_ID:"os.folderId",
	HOST_NAME:"os.sys.host.name",
	ICON:"os.node.icon",
	IGNORE_QUICKFILTERS:"os.ignoreQuickFilters",
	INTEGER_BASED:"abstract.IntegerBasedAttribute",
	IS_DIRECTORY:"os.isDirectory",
	IS_EXECUTABLE:"os.isExecutable",
	IS_EXISTING:"os.isExisting",
	IS_FILE:"os.isFile",
	IS_HIDDEN:"os.isHidden",
	IS_LINK:"os.isLink",
	IS_READABLE:"os.isReadable",
	IS_SHARED:"os.is_shared",
	IS_WORKSPACE_FILE:"os.isWorkspaceFile",
	IS_WRITEABLE:"os.isWriteable",
	LINK_URL:"os.linkUrl",
	LIST_BASED:"abstract.ListBased",
	METADATA:"contentlib.metadata",
	MOBILE_SUPPORT:"os.mobile.support",
	NAME:"os.name",
	NODE_SUB_TYPE:"os.node.subType",
	NODE_TYPE:"os.node.type",
	OLAP_DATASOURCE:"abstract.OlapDataSource",
	OLAP_DATASOURCE_NAME:"olap.ds.name",
	OLAP_DATASOURCE_PACKAGE:"olap.ds.package",
	OLAP_DATASOURCE_SCHEMA:"olap.ds.schema",
	OLAP_DATASOURCE_SYSTEM:"olap.ds.system",
	OLAP_DATASOURCE_TYPE:"olap.ds.type",
	OLAP_DATA_CATEGORY:"olap.dt.category",
	ORIGINAL_LANGUAGE:"os.originalLanguage",
	OWNER_FOLDER:"os.ownerFolder",
	OWNER_TYPE:"os.ownerType",
	PACKAGE_ID:"contentlib.packageId",
	PARENT_UNIQUE_ID:"os.parentUniqueId",
	PROVIDER_LINK_URL:"os.providerLinkUrl",
	SAC_EPM_OBJECT_ID:"epm.objectId",
	SAC_FETCH_LINKED_STORY:"sac.fetchLinkedStoryId",
	SAC_INTEROP_DATASOURCE_ID:"sac.datasourceId",
	SAC_INTEROP_STORY_ID:"sac.interopStoryId",
	SAC_INTEROP_WIDGET_ID:"sac.interopWidgetId",
	SAC_LINKED_STORY_ID:"sac.linkedStoryId",
	SAC_LINKED_STORY_NAME:"sac.linkedStoryName",
	SEMANTIC_TYPE:"os.res.type",
	SHAREABLE:"os.sharable",
	SHARED:"os.shared",
	SHARED_TO_ANY:"os.shared_to_any",
	SHORTCUT_TOOL:"shortcut.tool",
	SHORTCUT_VERSION:"shortcut.version",
	SIZE:"os.size",
	SOURCE_PROGRAM:"os.sourceProgram",
	SOURCE_RESOURCE:"contentlib.sourceResource",
	SPACE_ID:"os.spaceId",
	STORY_CONTENT:"contentlib.storyContent",
	STRING_BASED:"abstract.StringBasedAttribute",
	STRUCTURE_BASED:"abstract.StructureBased",
	SUPPORTED_FILTERS:"os.md.supportedFilters",
	SUPPORTED_FILTER_TYPES:"os.md.supportedFilterTypes",
	SUPPORTS_CARTESIAN_FILTER:"os.md.supportsCartesianFilter",
	SUPPORTS_COMMANDS:"os.md.supportsCommands",
	SUPPORTS_DELETE:"os.md.supportsDelete",
	SUPPORTS_DELETE_RECURSIVE:"os.md.supportsDeleteRecursive",
	SUPPORTS_EXECUTE:"os.md.supportsExecute",
	SUPPORTS_FETCH_CHILDREN:"os.md.supportsFetchChildren",
	SUPPORTS_IS_EXISTING:"os.md.supportsIsExisting",
	SUPPORTS_LOAD:"os.md.supportsLoad",
	SUPPORTS_MAX_ITEMS:"os.md.supportsMaxItems",
	SUPPORTS_MKDIR:"os.md.supportsMkdir",
	SUPPORTS_OFFSET:"os.md.supportsOffset",
	SUPPORTS_PARALLEL_SEARCH:"os.md.supportsParallelSearch",
	SUPPORTS_RENAME_TO:"os.md.supportsRenameTo",
	SUPPORTS_SAVE:"os.md.supportsSave",
	SUPPORTS_SEARCH:"os.md.supportsSearch",
	SUPPORTS_SET_LAST_MODIFIED:"os.md.supportsSetLastModified",
	SUPPORTS_SET_WRITABLE:"os.md.supportsSetWritable",
	SUPPORTS_SINGLE_SORT:"os.md.supportsSingleSort",
	SUPPORTS_SIZE:"os.md.supportsSize",
	SYSTEM_NAME:"os.sys.name",
	SYSTEM_TYPE:"os.sys.type",
	TARGET_URL:"os.targetUrl",
	UNIQUE_ID:"os.uniqueId",
	UPDATE_COUNT:"os.updateCount",
	URL:"os.url",
	URL_BASED:"abstract.UrlBased",
	USER:"abstract.User"
};

oFF.InAMergeProcessorFactory = function() {};
oFF.InAMergeProcessorFactory.prototype = new oFF.XObject();
oFF.InAMergeProcessorFactory.prototype._ff_c = "InAMergeProcessorFactory";

oFF.InAMergeProcessorFactory.s_factory = null;
oFF.InAMergeProcessorFactory.createInAMergeProcessor = function(connectionPool)
{
	let factory = oFF.InAMergeProcessorFactory.s_factory;
	let newObject = null;
	if (oFF.notNull(connectionPool))
	{
		if (oFF.notNull(factory) && connectionPool.getInAMergeProcessor() === null)
		{
			newObject = factory.newInAMergeProcessor(connectionPool);
		}
	}
	return newObject;
};
oFF.InAMergeProcessorFactory.registerFactory = function(factory)
{
	oFF.InAMergeProcessorFactory.s_factory = factory;
};

oFF.ModuleLoaderFactory = function() {};
oFF.ModuleLoaderFactory.prototype = new oFF.XObject();
oFF.ModuleLoaderFactory.prototype._ff_c = "ModuleLoaderFactory";

oFF.ModuleLoaderFactory.s_singletonInstance = null;
oFF.ModuleLoaderFactory.getInstance = function()
{
	return oFF.ModuleLoaderFactory.s_singletonInstance;
};
oFF.ModuleLoaderFactory.register = function(moduleLoader)
{
	oFF.ModuleLoaderFactory.s_singletonInstance = moduleLoader;
};

oFF.ConnectionParameters = {

	ALIAS:"ALIAS",
	APP_PROTOCOL_CIP:"CIP",
	APP_PROTOCOL_INA:"INA",
	APP_PROTOCOL_INA2:"INA2",
	APP_PROTOCOL_RSR:"RSR",
	APP_PROTOCOL_SQL:"SQL",
	ASSOCIATED_HANA_SYSTEM:"ASSOCIATED_HANA_SYSTEM",
	AUTHENTICATION_QUERY:"AUTHENTICATION_QUERY",
	AUTHENTICATION_TYPE:"AUTHENTICATION_TYPE",
	AUTHENTICATION_TYPE__BASIC:"BASIC",
	AUTHENTICATION_TYPE__BEARER:"BEARER",
	AUTHENTICATION_TYPE__NONE:"NONE",
	AUTHENTICATION_TYPE__SAML_WITH_PASSWORD:"SAML_WITH_PASSWORD",
	CACHE_HINTS_ENABLED:"CACHE_HINTS_ENABLED",
	CACHE_HINT_LEAVE_THROUGH:"CACHE_HINT_LEAVE_THROUGH",
	CLIENT:"CLIENT",
	CLIENT_IDENTIFIER_HEADER_ACTIVE:"CLIENT_IDENTIFIER_HEADER_ACTIVE",
	CONTENT_TYPE:"CONTENT_TYPE",
	CONTEXTS:"CONTEXTS",
	CORRELATION_ID_ACTIVE:"CORRELATION_ID_ACTIVE",
	CUSTOM_SSO_PATH:"CUSTOM_SSO_PATH",
	DEFINITION:"definition",
	DESCRIPTION:"DESCRIPTION",
	ELEMENT_TOKEN:"ELEMENT",
	ENABLE_FIREFLY_OAUTH_VISIBLE_POPUP_AUTHENTICATION:"ENABLE_FIREFLY_OAUTH_VISIBLE_POPUP_AUTHENTICATION",
	ENABLE_TESTS:"ENABLE_TESTS",
	ENFORCE_TESTS:"ENFORCE_TESTS",
	EQS_PATTERNS:"EQS_PATTERNS",
	FPA_AUTHENTICATION_METHOD:"FPA_AUTHENTICATION_METHOD",
	FPA_CONNECTION_TYPE:"FPA_CONNECTION_TYPE",
	FPA_CREATED_AT:"FPA_CREATED_AT",
	FPA_CREATED_BY:"FPA_CREATED_BY",
	FPA_IS_CONNECTED:"FPA_IS_CONNECTED",
	FPA_IS_DWC:"FPA_IS_DWC",
	FPA_IS_NEED_CREDENTIAL:"FPA_IS_NEED_CREDENTIAL",
	FPA_KEEP_ALIVE_INTERVAL:"FPA_KEEP_ALIVE_INTERVAL",
	FPA_MODIFIED_AT:"FPA_MODIFIED_AT",
	FPA_USE_FIREFLY_AUTHENTICATION:"FPA_USE_FIREFLY_AUTHENTICATION",
	FPA_USE_LIVE_INTEGRATION_CONNECTION_MANAGER:"FPA_USE_LIVE_INTEGRATION_CONNECTION_MANAGER",
	HOST:"HOST",
	IDP_RENDERS_STORAGE_ACCESS:"IDP_RENDERS_STORAGE_ACCESS",
	INTERNAL_USER:"INTERNAL_USER",
	INVISIBLE_TO_VISIBLE_IFRAME_TIMEOUT:"INVISIBLE_TO_VISIBLE_IFRAME_TIMEOUT",
	IS_CONNECTED:"IS_CONNECTED",
	IS_CONTEXT_ID_REQUIRED:"IS_CONTEXT_ID_REQUIRED",
	IS_CSRF_REQUIRED:"IS_CSRF_REQUIRED",
	IS_SAML_STANDARD_COMPLIANT:"IS_SAML_STANDARD_COMPLIANT",
	IS_X_AUTHORIZATION_REQUIRED:"IS_X_AUTHORIZATION_REQUIRED",
	KEEP_ALIVE_DELAY:"KEEP_ALIVE_DELAY",
	KEEP_ALIVE_INTERVAL:"KEEP_ALIVE_INTERVAL",
	LANGUAGE:"LANGUAGE",
	MAPPINGS:"MAPPINGS",
	MAPPING_DESERIALIZATION_SCHEMA:"MAPPING_DESERIALIZE_SCHEMA",
	MAPPING_DESERIALIZATION_TABLE:"MAPPING_DESERIALIZE_TABLE",
	MAPPING_SERIALIZATION_SCHEMA:"MAPPING_SERIALIZE_SCHEMA",
	MAPPING_SERIALIZATION_TABLE:"MAPPING_SERIALIZE_TABLE",
	MAPPING_SYSTEM_NAME:"MAPPING_SYSTEM_NAME",
	NAME:"NAME",
	OEM_APPLICATION_ID:"OEM_APPLICATION_ID",
	ORGANIZATION_TOKEN:"ORGANIZATION",
	ORIGIN:"ORIGIN",
	PASSWORD:"PASSWORD",
	PATH:"PATH",
	PORT:"PORT",
	PREFIX:"PREFIX",
	PREFLIGHT:"PREFLIGHT",
	PROTOCOL:"PROTOCOL",
	PROTOCOL_FILE:"FILE",
	PROTOCOL_HTTP:"HTTP",
	PROTOCOL_HTTPS:"HTTPS",
	PROXY_AUTHORIZATION:"PROXY_AUTHORIZATION",
	PROXY_HOST:"PROXY_HOST",
	PROXY_PORT:"PROXY_PORT",
	PROXY_TYPE:"PROXY_TYPE",
	SAP_PASSPORT_ACTIVE:"SAP_PASSPORT_ACTIVE",
	SCC_PORT:"sccPort",
	SCC_VIRTUAL_HOST:"sccVirtualHost",
	SECURE:"SECURE",
	SECURE_LOGIN_PROFILE:"SECURE_LOGIN_PROFILE",
	SESSION_CARRIER_TYPE:"SESSION_CARRIER_TYPE",
	SQL_CONNECT_JAVA:"SQL_CONNECT_JAVA",
	SQL_DRIVER_JAVA:"SQL_DRIVER_JAVA",
	STORAGE_HTML_PATH:"STORAGE_HTML_PATH",
	SYSTEM_TYPE:"SYSTEM_TYPE",
	SYSTYPE:"SYSTYPE",
	TAGS:"TAGS",
	TENANT_ID:"TENANT_ID",
	TENANT_ROOT_PACKAGE:"TENANT_ROOT_PACKAGE",
	TIMEOUT:"TIMEOUT",
	TOKEN_EXPIRES_AT:"AUTHENTICATION_TOKEN_EXPIRATION",
	TOKEN_VALUE:"TOKEN_VALUE",
	TOP_LEVEL_HTML_PATH:"TOP_LEVEL_HTML_PATH",
	URL:"URL",
	USER:"USER",
	USER_TOKEN:"USER_TOKEN",
	WEBDISPATCHER_URI:"WEBDISPATCHER_URI",
	X509CERTIFICATE:"X509CERTIFICATE"
};

oFF.ServerService = {

	ANALYTIC:"Analytics",
	BWMASTERDATA:"BWMasterData",
	CATALOG:"Catalog",
	DIMENSION_EXTENSION:"ffs4DimensionExtension",
	DOCUMENTS:"Documents",
	HIERARCHY_MEMBER:"HierarchyMember",
	INA:"InA",
	LIST_REPORTING:"ListReporting",
	MASTERDATA:"Masterdata",
	MODEL_PERSISTENCY:"ModelPersistence",
	PLANNING:"Planning",
	VALUE_HELP:"ValueHelp",
	WORKSPACE:"Workspace"
};

oFF.RpcFunctionFactory = function() {};
oFF.RpcFunctionFactory.prototype = new oFF.XObject();
oFF.RpcFunctionFactory.prototype._ff_c = "RpcFunctionFactory";

oFF.RpcFunctionFactory.s_defaultFactory = null;
oFF.RpcFunctionFactory.s_factoryByProtocol = null;
oFF.RpcFunctionFactory.s_factoryBySystemType = null;
oFF.RpcFunctionFactory.create = function(context, name, systemType, protocolType)
{
	let factory = null;
	if (oFF.notNull(systemType))
	{
		factory = oFF.RpcFunctionFactory.s_factoryBySystemType.getByKey(systemType.getName());
	}
	if (oFF.isNull(factory))
	{
		factory = oFF.RpcFunctionFactory.s_factoryByProtocol.getByKey(protocolType.getName());
	}
	if (oFF.isNull(factory))
	{
		factory = oFF.RpcFunctionFactory.s_defaultFactory;
	}
	let result = null;
	if (oFF.notNull(factory))
	{
		result = factory.newRpcFunction(context, name, systemType, protocolType);
	}
	return result;
};
oFF.RpcFunctionFactory.registerDefaultFactory = function(factory)
{
	oFF.RpcFunctionFactory.s_defaultFactory = factory;
};
oFF.RpcFunctionFactory.registerFactory = function(protocolType, systemType, factory)
{
	if (oFF.notNull(protocolType))
	{
		oFF.RpcFunctionFactory.s_factoryByProtocol.put(protocolType.getName(), factory);
	}
	if (oFF.notNull(systemType))
	{
		oFF.RpcFunctionFactory.s_factoryBySystemType.put(systemType.getName(), factory);
	}
};
oFF.RpcFunctionFactory.staticSetupFunctionFactory = function()
{
	oFF.RpcFunctionFactory.s_factoryByProtocol = oFF.XHashMapByString.create();
	oFF.RpcFunctionFactory.s_factoryBySystemType = oFF.XHashMapByString.create();
};

oFF.ProcessEntity = {

	APPLICATION:"rt.Application",
	CACHE_PROVIDER:"rt.CacheProvider",
	CONNECTION_POOL:"rt.ConnectionPool",
	CREDENTIALS_PROVIDER:"rt.CredentialsProvider",
	DATA_PROVIDER_POOL:"rt.DataProviderPool",
	EVENT_TRACKER:"app.EventTracker",
	GUI:"rt.Gui",
	KEY_MANAGER:"rt.KeyManager",
	OLAP_ENVIRONMENT:"olap.OlapEnvironment",
	SUB_SYSTEM:"rt.SubSystem",
	SYSTEM_LANDSCAPE:"rt.SystemLandscape"
};

oFF.XFileAccessState = function() {};
oFF.XFileAccessState.prototype = new oFF.XObjectExt();
oFF.XFileAccessState.prototype._ff_c = "XFileAccessState";

oFF.XFileAccessState.create = function()
{
	let shareRequest = new oFF.XFileAccessState();
	shareRequest.m_userAccessMap = oFF.XHashMapByString.create();
	return shareRequest;
};
oFF.XFileAccessState.prototype.m_userAccessMap = null;
oFF.XFileAccessState.prototype.getAccessForUser = function(userName)
{
	let access = oFF.XOptional.empty();
	if (this.m_userAccessMap.containsKey(userName))
	{
		let readOnlyAccess = this.m_userAccessMap.getByKey(userName);
		access = oFF.XOptional.of(readOnlyAccess);
	}
	return access;
};
oFF.XFileAccessState.prototype.getAllAccess = function()
{
	return this.m_userAccessMap;
};
oFF.XFileAccessState.prototype.setUserAccess = function(userName, accessType, hasAccess)
{
	let access;
	if (this.m_userAccessMap.containsKey(userName))
	{
		access = this.m_userAccessMap.getByKey(userName);
		access.put(accessType, oFF.XBooleanValue.create(hasAccess));
	}
	else
	{
		access = oFF.XSimpleMap.create();
	}
	access.put(accessType, oFF.XBooleanValue.create(hasAccess));
	this.m_userAccessMap.put(userName, access);
};

oFF.XUsageTrackingCenter = function() {};
oFF.XUsageTrackingCenter.prototype = new oFF.XObject();
oFF.XUsageTrackingCenter.prototype._ff_c = "XUsageTrackingCenter";

oFF.XUsageTrackingCenter.s_externalAdapter = null;
oFF.XUsageTrackingCenter.s_singletonInstance = null;
oFF.XUsageTrackingCenter.getCenter = function()
{
	if (oFF.isNull(oFF.XUsageTrackingCenter.s_singletonInstance))
	{
		let newCenter = new oFF.XUsageTrackingCenter();
		newCenter.setupCenter();
		oFF.XUsageTrackingCenter.s_singletonInstance = newCenter;
	}
	return oFF.XUsageTrackingCenter.s_singletonInstance;
};
oFF.XUsageTrackingCenter.setExternalAdapter = function(externalAdapter)
{
	oFF.XUsageTrackingCenter.s_externalAdapter = externalAdapter;
};
oFF.XUsageTrackingCenter.prototype.recordUsage = function(action, feature, parameters)
{
	if (oFF.notNull(oFF.XUsageTrackingCenter.s_externalAdapter))
	{
		oFF.XUsageTrackingCenter.s_externalAdapter.recordUsage(action, feature, parameters);
	}
};
oFF.XUsageTrackingCenter.prototype.setupCenter = function()
{
	this.setup();
};

oFF.XLocalizationCenter = function() {};
oFF.XLocalizationCenter.prototype = new oFF.XObject();
oFF.XLocalizationCenter.prototype._ff_c = "XLocalizationCenter";

oFF.XLocalizationCenter.s_externalAdapter = null;
oFF.XLocalizationCenter.s_singletonInstance = null;
oFF.XLocalizationCenter.getCenter = function()
{
	if (oFF.isNull(oFF.XLocalizationCenter.s_singletonInstance))
	{
		let newCenter = new oFF.XLocalizationCenter();
		newCenter.setupCenter();
		oFF.XLocalizationCenter.s_singletonInstance = newCenter;
	}
	return oFF.XLocalizationCenter.s_singletonInstance;
};
oFF.XLocalizationCenter.getExternalAdapter = function()
{
	return oFF.XLocalizationCenter.s_externalAdapter;
};
oFF.XLocalizationCenter.setExternalAdapter = function(externalAdapter)
{
	oFF.XLocalizationCenter.s_externalAdapter = externalAdapter;
};
oFF.XLocalizationCenter.prototype.m_commonsLocalizationProviders = null;
oFF.XLocalizationCenter.prototype.m_localizationProviders = null;
oFF.XLocalizationCenter.prototype.getComment = function(key)
{
	let foundProvider = oFF.XCollectionUtils.findFirst(this.m_localizationProviders, (provider) => {
		let providerComment = provider.getComment(key);
		return !oFF.XStringUtils.isNotNullAndNotEmpty(providerComment);
	});
	if (oFF.notNull(foundProvider))
	{
		return foundProvider.getComment(key);
	}
	return null;
};
oFF.XLocalizationCenter.prototype.getCommonsProviders = function()
{
	return this.m_commonsLocalizationProviders;
};
oFF.XLocalizationCenter.prototype.getLocalizationKeys = function()
{
	return this.getRawLocalizationTexts().getKeysAsReadOnlyList();
};
oFF.XLocalizationCenter.prototype.getLocalizationProviderByName = function(name)
{
	return this.m_localizationProviders.getByKey(name);
};
oFF.XLocalizationCenter.prototype.getName = function()
{
	return "LocalizationCenterProvider";
};
oFF.XLocalizationCenter.prototype.getRawLocalizationTexts = function()
{
	let allTextsMap = oFF.XHashMapByString.create();
	oFF.XCollectionUtils.forEach(this.m_localizationProviders, (provider) => {
		allTextsMap.putAll(provider.getRawLocalizationTexts());
	});
	return allTextsMap;
};
oFF.XLocalizationCenter.prototype.getText = function(key)
{
	return this.getTextWithPlaceholders(key, null);
};
oFF.XLocalizationCenter.prototype.getTextWithPlaceholder = function(key, replacement)
{
	let replacementList = oFF.XList.create();
	replacementList.add(replacement);
	return this.getTextWithPlaceholders(key, replacementList);
};
oFF.XLocalizationCenter.prototype.getTextWithPlaceholder2 = function(key, replacement1, replacement2)
{
	let replacementList = oFF.XList.create();
	replacementList.add(replacement1);
	replacementList.add(replacement2);
	return this.getTextWithPlaceholders(key, replacementList);
};
oFF.XLocalizationCenter.prototype.getTextWithPlaceholders = function(key, replacementList)
{
	let foundProvider = oFF.XCollectionUtils.findFirst(this.m_localizationProviders, (provider) => {
		let providerText = provider.getTextWithPlaceholders(key, replacementList);
		return !oFF.XString.isEqual(key, providerText) && oFF.XStringUtils.isNotNullAndNotEmpty(providerText);
	});
	if (oFF.notNull(foundProvider))
	{
		return foundProvider.getTextWithPlaceholders(key, replacementList);
	}
	return key;
};
oFF.XLocalizationCenter.prototype.getTranslatedMap = function()
{
	let allTranslatedTextsMap = oFF.XHashMapByString.create();
	oFF.XCollectionUtils.forEach(this.m_localizationProviders, (provider) => {
		allTranslatedTextsMap.putAll(provider.getTranslatedMap());
	});
	return allTranslatedTextsMap;
};
oFF.XLocalizationCenter.prototype.registerCommonsLocalizationProvider = function(provider)
{
	if (oFF.notNull(provider) && !this.m_commonsLocalizationProviders.containsKey(provider.getName()))
	{
		this.m_commonsLocalizationProviders.add(provider);
	}
};
oFF.XLocalizationCenter.prototype.registerLocalizationProvider = function(provider)
{
	if (oFF.notNull(provider) && !this.m_localizationProviders.containsKey(provider.getName()))
	{
		this.m_localizationProviders.add(provider);
	}
};
oFF.XLocalizationCenter.prototype.setProductive = function(isProductive)
{
	oFF.XCollectionUtils.forEach(this.m_localizationProviders, (provider) => {
		provider.setProductive(isProductive);
	});
};
oFF.XLocalizationCenter.prototype.setupCenter = function()
{
	this.setup();
	this.m_localizationProviders = oFF.XListOfNameObject.create();
	this.m_commonsLocalizationProviders = oFF.XListOfNameObject.create();
};

oFF.CoConfigurationLayer = function() {};
oFF.CoConfigurationLayer.prototype = new oFF.XConstant();
oFF.CoConfigurationLayer.prototype._ff_c = "CoConfigurationLayer";

oFF.CoConfigurationLayer.ADMIN = null;
oFF.CoConfigurationLayer.PLATFORM = null;
oFF.CoConfigurationLayer.USER = null;
oFF.CoConfigurationLayer.s_lookup = null;
oFF.CoConfigurationLayer._createNewLayer = function(name, defaultDirPath, environmentVarName)
{
	if (oFF.XStringUtils.isNullOrEmpty(name))
	{
		throw oFF.XException.createIllegalArgumentException("Missing name, you cannot create aconfiguration layer without a name!");
	}
	if (oFF.CoConfigurationLayer.lookup(name) !== null)
	{
		throw oFF.XException.createIllegalArgumentException("A configuration layer with the specified name already exists!");
	}
	let newLayer = oFF.XConstant.setupName(new oFF.CoConfigurationLayer(), name);
	newLayer.m_defaultConfigDirPath = defaultDirPath;
	newLayer.m_envVarName = environmentVarName;
	oFF.CoConfigurationLayer.s_lookup.put(oFF.XString.toLowerCase(name), newLayer);
	return newLayer;
};
oFF.CoConfigurationLayer.getAllConfigurationLayers = function()
{
	return oFF.CoConfigurationLayer.s_lookup.getValuesAsReadOnlyList();
};
oFF.CoConfigurationLayer.lookup = function(name)
{
	let nameLower = oFF.XString.toLowerCase(name);
	return oFF.CoConfigurationLayer.s_lookup.getByKey(nameLower);
};
oFF.CoConfigurationLayer.staticSetup = function()
{
	oFF.CoConfigurationLayer.s_lookup = oFF.XHashMapByString.create();
	oFF.CoConfigurationLayer.USER = oFF.CoConfigurationLayer._createNewLayer("User", "/home/main/.config/", oFF.XEnvironmentConstants.FIREFLY_USER_CFG_DIR);
	oFF.CoConfigurationLayer.ADMIN = oFF.CoConfigurationLayer._createNewLayer("Admin", "/var/admin/.config/", oFF.XEnvironmentConstants.FIREFLY_ADMIN_CFG_DIR);
	oFF.CoConfigurationLayer.PLATFORM = oFF.CoConfigurationLayer._createNewLayer("Platform", "/etc/platform/.config/", oFF.XEnvironmentConstants.FIREFLY_PLATFORM_CFG_DIR);
};
oFF.CoConfigurationLayer.prototype.m_defaultConfigDirPath = null;
oFF.CoConfigurationLayer.prototype.m_envVarName = null;
oFF.CoConfigurationLayer.prototype.getDefaultConfigDirPath = function()
{
	return this.m_defaultConfigDirPath;
};
oFF.CoConfigurationLayer.prototype.getEnvironmentVariableName = function()
{
	return this.m_envVarName;
};

oFF.CoConfigurationType = function() {};
oFF.CoConfigurationType.prototype = new oFF.XConstant();
oFF.CoConfigurationType.prototype._ff_c = "CoConfigurationType";

oFF.CoConfigurationType.OTHER = null;
oFF.CoConfigurationType.PLUGIN = null;
oFF.CoConfigurationType.PROGRAM = null;
oFF.CoConfigurationType.UNKNOWN = null;
oFF.CoConfigurationType.s_lookup = null;
oFF.CoConfigurationType._create = function(name)
{
	let theConstant = oFF.XConstant.setupName(new oFF.CoConfigurationType(), name);
	oFF.CoConfigurationType.s_lookup.put(name, theConstant);
	return theConstant;
};
oFF.CoConfigurationType.getAllTypeNames = function()
{
	return oFF.CoConfigurationType.s_lookup.getKeysAsReadOnlyList();
};
oFF.CoConfigurationType.lookup = function(name)
{
	return oFF.CoConfigurationType.s_lookup.getByKey(name);
};
oFF.CoConfigurationType.staticSetup = function()
{
	oFF.CoConfigurationType.s_lookup = oFF.XLinkedHashMapByString.create();
	oFF.CoConfigurationType.PROGRAM = oFF.CoConfigurationType._create("Program");
	oFF.CoConfigurationType.PLUGIN = oFF.CoConfigurationType._create("Plugin");
	oFF.CoConfigurationType.OTHER = oFF.CoConfigurationType._create("Other");
	oFF.CoConfigurationType.UNKNOWN = oFF.CoConfigurationType._create("Unknown");
};

oFF.CoDataType = function() {};
oFF.CoDataType.prototype = new oFF.XConstant();
oFF.CoDataType.prototype._ff_c = "CoDataType";

oFF.CoDataType.ARRAY = null;
oFF.CoDataType.BOOLEAN = null;
oFF.CoDataType.INTEGER = null;
oFF.CoDataType.NUMBER = null;
oFF.CoDataType.OBJECT = null;
oFF.CoDataType.STRING = null;
oFF.CoDataType.s_lookup = null;
oFF.CoDataType._createNewType = function(name, linkedElementType)
{
	if (oFF.XStringUtils.isNullOrEmpty(name))
	{
		throw oFF.XException.createIllegalArgumentException("Missing name, you cannot create a data type without a name!");
	}
	if (oFF.CoDataType.lookup(name) !== null)
	{
		throw oFF.XException.createIllegalArgumentException("A data type with the specified name already exists!");
	}
	let newType = oFF.XConstant.setupName(new oFF.CoDataType(), name);
	newType.setupType(name, linkedElementType);
	return newType;
};
oFF.CoDataType.lookup = function(name)
{
	let nameLower = oFF.XString.toLowerCase(name);
	return oFF.CoDataType.s_lookup.getByKey(nameLower);
};
oFF.CoDataType.staticSetup = function()
{
	oFF.CoDataType.s_lookup = oFF.XHashMapByString.create();
	oFF.CoDataType.STRING = oFF.CoDataType._createNewType("String", oFF.PrElementType.STRING);
	oFF.CoDataType.BOOLEAN = oFF.CoDataType._createNewType("Boolean", oFF.PrElementType.BOOLEAN);
	oFF.CoDataType.INTEGER = oFF.CoDataType._createNewType("Integer", oFF.PrElementType.INTEGER);
	oFF.CoDataType.NUMBER = oFF.CoDataType._createNewType("Number", oFF.PrElementType.DOUBLE);
	oFF.CoDataType.ARRAY = oFF.CoDataType._createNewType("Array", oFF.PrElementType.LIST);
	oFF.CoDataType.OBJECT = oFF.CoDataType._createNewType("Object", oFF.PrElementType.STRUCTURE);
};
oFF.CoDataType.prototype.m_linkedElemenType = null;
oFF.CoDataType.prototype.isNumeric = function()
{
	return this === oFF.CoDataType.INTEGER || this === oFF.CoDataType.NUMBER;
};
oFF.CoDataType.prototype.isOfElementType = function(elementType)
{
	return this.m_linkedElemenType === elementType;
};
oFF.CoDataType.prototype.setupType = function(name, linkedElementType)
{
	this.m_linkedElemenType = linkedElementType;
	oFF.CoDataType.s_lookup.put(oFF.XString.toLowerCase(name), this);
};

oFF.CoPropertyGroup = function() {};
oFF.CoPropertyGroup.prototype = new oFF.XConstant();
oFF.CoPropertyGroup.prototype._ff_c = "CoPropertyGroup";

oFF.CoPropertyGroup.UNGROUPED = null;
oFF.CoPropertyGroup.s_customGroups = null;
oFF.CoPropertyGroup._createWithName = function(name)
{
	let newGroup = oFF.XConstant.setupName(new oFF.CoPropertyGroup(), name);
	return newGroup;
};
oFF.CoPropertyGroup.createGroupIfNecessary = function(name)
{
	if (oFF.XStringUtils.isNullOrEmpty(name))
	{
		return null;
	}
	let tmpGroup = oFF.CoPropertyGroup.s_customGroups.getByKey(name);
	if (oFF.isNull(tmpGroup))
	{
		tmpGroup = oFF.CoPropertyGroup._createWithName(name);
		oFF.CoPropertyGroup.s_customGroups.put(name, tmpGroup);
	}
	return oFF.CoPropertyGroup.s_customGroups.getByKey(name);
};
oFF.CoPropertyGroup.staticSetup = function()
{
	oFF.CoPropertyGroup.s_customGroups = oFF.XHashMapByString.create();
	oFF.CoPropertyGroup.UNGROUPED = oFF.CoPropertyGroup._createWithName("Ungrouped");
};

oFF.DataProviderType = function() {};
oFF.DataProviderType.prototype = new oFF.XConstant();
oFF.DataProviderType.prototype._ff_c = "DataProviderType";

oFF.DataProviderType.BASIC = null;
oFF.DataProviderType.OLAP = null;
oFF.DataProviderType.staticSetup = function()
{
	oFF.DataProviderType.BASIC = oFF.XConstant.setupName(new oFF.DataProviderType(), "Basic");
	oFF.DataProviderType.OLAP = oFF.XConstant.setupName(new oFF.DataProviderType(), "Olap");
};

oFF.XFileAccess = function() {};
oFF.XFileAccess.prototype = new oFF.XConstant();
oFF.XFileAccess.prototype._ff_c = "XFileAccess";

oFF.XFileAccess.ADD_COMMENT = null;
oFF.XFileAccess.COPY = null;
oFF.XFileAccess.CREATE = null;
oFF.XFileAccess.DELETE = null;
oFF.XFileAccess.DELETE_COMMENT = null;
oFF.XFileAccess.EXECUTE = null;
oFF.XFileAccess.MAINTAIN = null;
oFF.XFileAccess.READ = null;
oFF.XFileAccess.SHARE = null;
oFF.XFileAccess.UPDATE = null;
oFF.XFileAccess.VIEW_COMMENT = null;
oFF.XFileAccess.s_lookup = null;
oFF.XFileAccess.create = function(name)
{
	let type = new oFF.XFileAccess();
	type.setupConstant(name);
	oFF.XFileAccess.s_lookup.put(name, type);
	return type;
};
oFF.XFileAccess.lookup = function(name)
{
	return oFF.XFileAccess.s_lookup.getByKey(name);
};
oFF.XFileAccess.staticSetup = function()
{
	oFF.XFileAccess.s_lookup = oFF.XHashMapByString.create();
	oFF.XFileAccess.READ = oFF.XFileAccess.create("Read");
	oFF.XFileAccess.UPDATE = oFF.XFileAccess.create("Update");
	oFF.XFileAccess.CREATE = oFF.XFileAccess.create("Create");
	oFF.XFileAccess.EXECUTE = oFF.XFileAccess.create("Execute");
	oFF.XFileAccess.MAINTAIN = oFF.XFileAccess.create("Maintain");
	oFF.XFileAccess.DELETE = oFF.XFileAccess.create("Delete");
	oFF.XFileAccess.COPY = oFF.XFileAccess.create("Copy");
	oFF.XFileAccess.SHARE = oFF.XFileAccess.create("Share");
	oFF.XFileAccess.VIEW_COMMENT = oFF.XFileAccess.create("ViewComment");
	oFF.XFileAccess.ADD_COMMENT = oFF.XFileAccess.create("AddComment");
	oFF.XFileAccess.DELETE_COMMENT = oFF.XFileAccess.create("DeleteComment");
};

oFF.XFileCachingType = function() {};
oFF.XFileCachingType.prototype = new oFF.XConstant();
oFF.XFileCachingType.prototype._ff_c = "XFileCachingType";

oFF.XFileCachingType.AUTO = null;
oFF.XFileCachingType.ENFORCE_UPDATE = null;
oFF.XFileCachingType.USE_CACHE = null;
oFF.XFileCachingType.s_lookup = null;
oFF.XFileCachingType.create = function(name)
{
	let type = new oFF.XFileCachingType();
	type.setupConstant(name);
	oFF.XFileCachingType.s_lookup.put(name, type);
	return type;
};
oFF.XFileCachingType.lookup = function(name)
{
	return oFF.XFileCachingType.s_lookup.getByKey(name);
};
oFF.XFileCachingType.staticSetup = function()
{
	oFF.XFileCachingType.s_lookup = oFF.XHashMapByString.create();
	oFF.XFileCachingType.AUTO = oFF.XFileCachingType.create("Auto");
	oFF.XFileCachingType.ENFORCE_UPDATE = oFF.XFileCachingType.create("EnforceUpdate");
	oFF.XFileCachingType.USE_CACHE = oFF.XFileCachingType.create("UseCache");
};

oFF.XFileFilterType = function() {};
oFF.XFileFilterType.prototype = new oFF.XConstant();
oFF.XFileFilterType.prototype._ff_c = "XFileFilterType";

oFF.XFileFilterType.ASTERISK = null;
oFF.XFileFilterType.EXACT = null;
oFF.XFileFilterType.NOT = null;
oFF.XFileFilterType.s_lookup = null;
oFF.XFileFilterType.create = function(name)
{
	let type = new oFF.XFileFilterType();
	type.setupConstant(name);
	oFF.XFileFilterType.s_lookup.put(name, type);
	return type;
};
oFF.XFileFilterType.lookup = function(name)
{
	return oFF.XFileFilterType.s_lookup.getByKey(name);
};
oFF.XFileFilterType.staticSetup = function()
{
	oFF.XFileFilterType.s_lookup = oFF.XHashMapByString.create();
	oFF.XFileFilterType.EXACT = oFF.XFileFilterType.create("Exact");
	oFF.XFileFilterType.ASTERISK = oFF.XFileFilterType.create("Asterisk");
	oFF.XFileFilterType.NOT = oFF.XFileFilterType.create("Not");
};

oFF.XFileSaveMode = function() {};
oFF.XFileSaveMode.prototype = new oFF.XConstant();
oFF.XFileSaveMode.prototype._ff_c = "XFileSaveMode";

oFF.XFileSaveMode.AUTO = null;
oFF.XFileSaveMode.CREATE = null;
oFF.XFileSaveMode.REPLACE = null;
oFF.XFileSaveMode.UPDATE = null;
oFF.XFileSaveMode.s_lookup = null;
oFF.XFileSaveMode.create = function(name)
{
	let type = new oFF.XFileSaveMode();
	type.setupConstant(name);
	oFF.XFileSaveMode.s_lookup.put(name, type);
	return type;
};
oFF.XFileSaveMode.lookup = function(name)
{
	return oFF.XFileSaveMode.s_lookup.getByKey(name);
};
oFF.XFileSaveMode.staticSetup = function()
{
	oFF.XFileSaveMode.s_lookup = oFF.XHashMapByString.create();
	oFF.XFileSaveMode.AUTO = oFF.XFileSaveMode.create("Auto");
	oFF.XFileSaveMode.CREATE = oFF.XFileSaveMode.create("Create");
	oFF.XFileSaveMode.UPDATE = oFF.XFileSaveMode.create("Update");
	oFF.XFileSaveMode.REPLACE = oFF.XFileSaveMode.create("Replace");
};

oFF.InAMergeProcessingMode = function() {};
oFF.InAMergeProcessingMode.prototype = new oFF.XConstant();
oFF.InAMergeProcessingMode.prototype._ff_c = "InAMergeProcessingMode";

oFF.InAMergeProcessingMode.EXECUTE_PERSISTED = null;
oFF.InAMergeProcessingMode.MERGE_EXECUTE = null;
oFF.InAMergeProcessingMode.MERGE_PERSIST = null;
oFF.InAMergeProcessingMode.create = function(name)
{
	let newConstant = oFF.XConstant.setupName(new oFF.InAMergeProcessingMode(), name);
	return newConstant;
};
oFF.InAMergeProcessingMode.staticSetup = function()
{
	oFF.InAMergeProcessingMode.MERGE_EXECUTE = oFF.InAMergeProcessingMode.create("MergeAndExecute");
	oFF.InAMergeProcessingMode.MERGE_PERSIST = oFF.InAMergeProcessingMode.create("MergeAndPersist");
	oFF.InAMergeProcessingMode.EXECUTE_PERSISTED = oFF.InAMergeProcessingMode.create("ExecutePersisted");
};

oFF.ServiceApiLevel = function() {};
oFF.ServiceApiLevel.prototype = new oFF.XConstant();
oFF.ServiceApiLevel.prototype._ff_c = "ServiceApiLevel";

oFF.ServiceApiLevel.BOOTSTRAP = null;
oFF.ServiceApiLevel.PERSONALIZATION = null;
oFF.ServiceApiLevel.READ_ONLY = null;
oFF.ServiceApiLevel.create = function(name, level)
{
	let type = new oFF.ServiceApiLevel();
	type._setupInternal(name);
	type.m_level = level;
	return type;
};
oFF.ServiceApiLevel.staticSetup = function()
{
	oFF.ServiceApiLevel.BOOTSTRAP = oFF.ServiceApiLevel.create("Bootstrap", 0);
	oFF.ServiceApiLevel.READ_ONLY = oFF.ServiceApiLevel.create("UserProfile", 1);
	oFF.ServiceApiLevel.PERSONALIZATION = oFF.ServiceApiLevel.create("BootstrapLandscape", 2);
};
oFF.ServiceApiLevel.prototype.m_level = 0;
oFF.ServiceApiLevel.prototype.getLevel = function()
{
	return this.m_level;
};

oFF.ResourceType = function() {};
oFF.ResourceType.prototype = new oFF.XConstant();
oFF.ResourceType.prototype._ff_c = "ResourceType";

oFF.ResourceType.CONTAINER = null;
oFF.ResourceType.CSS = null;
oFF.ResourceType.JAVASCRIPT = null;
oFF.ResourceType.MODULE = null;
oFF.ResourceType.MODULE_REF = null;
oFF.ResourceType.PROGRAM = null;
oFF.ResourceType.staticSetup = function()
{
	oFF.ResourceType.JAVASCRIPT = oFF.XConstant.setupName(new oFF.ResourceType(), "Javascript");
	oFF.ResourceType.CSS = oFF.XConstant.setupName(new oFF.ResourceType(), "Css");
	oFF.ResourceType.MODULE = oFF.XConstant.setupName(new oFF.ResourceType(), "Module");
	oFF.ResourceType.MODULE_REF = oFF.XConstant.setupName(new oFF.ResourceType(), "ModuleRef");
	oFF.ResourceType.CONTAINER = oFF.XConstant.setupName(new oFF.ResourceType(), "Container");
	oFF.ResourceType.PROGRAM = oFF.XConstant.setupName(new oFF.ResourceType(), "Program");
};

oFF.SystemRole = function() {};
oFF.SystemRole.prototype = new oFF.XConstant();
oFF.SystemRole.prototype._ff_c = "SystemRole";

oFF.SystemRole.DATA_PROVIDER = null;
oFF.SystemRole.MASTER = null;
oFF.SystemRole.PRIMARY_BLENDING_HOST = null;
oFF.SystemRole.REPOSITORY = null;
oFF.SystemRole.SYSTEM_LANDSCAPE = null;
oFF.SystemRole.USER_MANAGEMENT = null;
oFF.SystemRole.s_lookup = null;
oFF.SystemRole.s_roles = null;
oFF.SystemRole.create = function(name)
{
	let newConstant = new oFF.SystemRole();
	newConstant._setupInternal(name);
	oFF.SystemRole.s_roles.add(newConstant);
	oFF.SystemRole.s_lookup.put(name, newConstant);
	return newConstant;
};
oFF.SystemRole.getAllRoles = function()
{
	return oFF.SystemRole.s_roles;
};
oFF.SystemRole.lookup = function(name)
{
	return oFF.SystemRole.s_lookup.getByKey(name);
};
oFF.SystemRole.staticSetup = function()
{
	oFF.SystemRole.s_roles = oFF.XList.create();
	oFF.SystemRole.s_lookup = oFF.XHashMapByString.create();
	oFF.SystemRole.MASTER = oFF.SystemRole.create("Master");
	oFF.SystemRole.DATA_PROVIDER = oFF.SystemRole.create("DataProvider");
	oFF.SystemRole.REPOSITORY = oFF.SystemRole.create("Repository");
	oFF.SystemRole.USER_MANAGEMENT = oFF.SystemRole.create("UserManagement");
	oFF.SystemRole.SYSTEM_LANDSCAPE = oFF.SystemRole.create("SystemLandscape");
	oFF.SystemRole.PRIMARY_BLENDING_HOST = oFF.SystemRole.create("PrimaryBlendingHost");
};

oFF.ProgramCategory = function() {};
oFF.ProgramCategory.prototype = new oFF.XConstant();
oFF.ProgramCategory.prototype._ff_c = "ProgramCategory";

oFF.ProgramCategory.GENERIC = null;
oFF.ProgramCategory.MISC = null;
oFF.ProgramCategory.MOBILE = null;
oFF.ProgramCategory.OLAP = null;
oFF.ProgramCategory.QUASAR = null;
oFF.ProgramCategory.SHELL = null;
oFF.ProgramCategory.SUB_SYSTEM = null;
oFF.ProgramCategory.SYSTEM = null;
oFF.ProgramCategory.TEST = null;
oFF.ProgramCategory.s_lookup = null;
oFF.ProgramCategory.create = function(name)
{
	let theConstant = oFF.XConstant.setupName(new oFF.ProgramCategory(), name);
	oFF.ProgramCategory.s_lookup.put(name, theConstant);
	oFF.ProgramCategory.s_lookup.put(oFF.XString.toLowerCase(name), theConstant);
	oFF.ProgramCategory.s_lookup.put(oFF.XString.toUpperCase(name), theConstant);
	return theConstant;
};
oFF.ProgramCategory.lookup = function(name)
{
	let namerLower = oFF.XString.toLowerCase(name);
	return oFF.ProgramCategory.s_lookup.getByKey(namerLower);
};
oFF.ProgramCategory.lookupwithDefault = function(name, defaultCategory)
{
	let tmpCategory = oFF.ProgramCategory.lookup(name);
	if (oFF.notNull(tmpCategory))
	{
		return tmpCategory;
	}
	return defaultCategory;
};
oFF.ProgramCategory.staticSetup = function()
{
	oFF.ProgramCategory.s_lookup = oFF.XHashMapByString.create();
	oFF.ProgramCategory.GENERIC = oFF.ProgramCategory.create("Generic");
	oFF.ProgramCategory.MISC = oFF.ProgramCategory.create("Misc");
	oFF.ProgramCategory.TEST = oFF.ProgramCategory.create("Test");
	oFF.ProgramCategory.SYSTEM = oFF.ProgramCategory.create("System");
	oFF.ProgramCategory.OLAP = oFF.ProgramCategory.create("Olap");
	oFF.ProgramCategory.QUASAR = oFF.ProgramCategory.create("Quasar");
	oFF.ProgramCategory.MOBILE = oFF.ProgramCategory.create("Mobile");
	oFF.ProgramCategory.SHELL = oFF.ProgramCategory.create("Shell");
	oFF.ProgramCategory.SUB_SYSTEM = oFF.ProgramCategory.create("SubSystem");
};

oFF.ProgramContainerType = function() {};
oFF.ProgramContainerType.prototype = new oFF.XConstant();
oFF.ProgramContainerType.prototype._ff_c = "ProgramContainerType";

oFF.ProgramContainerType.CONSOLE = null;
oFF.ProgramContainerType.CONTENT = null;
oFF.ProgramContainerType.DIALOG = null;
oFF.ProgramContainerType.DUMMY = null;
oFF.ProgramContainerType.NONE = null;
oFF.ProgramContainerType.STANDALONE = null;
oFF.ProgramContainerType.WINDOW = null;
oFF.ProgramContainerType.s_lookup = null;
oFF.ProgramContainerType.create = function(name)
{
	let theConstant = oFF.XConstant.setupName(new oFF.ProgramContainerType(), name);
	theConstant.m_isUiContainer = false;
	theConstant.m_isFloatingContainer = false;
	theConstant.m_isEmbeddedContainer = false;
	oFF.ProgramContainerType.s_lookup.put(name, theConstant);
	return theConstant;
};
oFF.ProgramContainerType.lookup = function(name)
{
	return oFF.ProgramContainerType.s_lookup.getByKey(name);
};
oFF.ProgramContainerType.staticSetup = function()
{
	oFF.ProgramContainerType.s_lookup = oFF.XHashMapByString.create();
	oFF.ProgramContainerType.NONE = oFF.ProgramContainerType.create("None");
	oFF.ProgramContainerType.DUMMY = oFF.ProgramContainerType.create("Dummy");
	oFF.ProgramContainerType.CONSOLE = oFF.ProgramContainerType.create("Console");
	oFF.ProgramContainerType.WINDOW = oFF.ProgramContainerType.create("Window").markUiContainer().markFloatingContainer();
	oFF.ProgramContainerType.DIALOG = oFF.ProgramContainerType.create("Dialog").markUiContainer().markFloatingContainer();
	oFF.ProgramContainerType.STANDALONE = oFF.ProgramContainerType.create("Standalone").markUiContainer().markEmbeddedContainer();
	oFF.ProgramContainerType.CONTENT = oFF.ProgramContainerType.create("Content").markUiContainer().markEmbeddedContainer();
};
oFF.ProgramContainerType.prototype.m_isEmbeddedContainer = false;
oFF.ProgramContainerType.prototype.m_isFloatingContainer = false;
oFF.ProgramContainerType.prototype.m_isUiContainer = false;
oFF.ProgramContainerType.prototype.isEmbeddedContainer = function()
{
	return this.m_isEmbeddedContainer;
};
oFF.ProgramContainerType.prototype.isFloatingContainer = function()
{
	return this.m_isFloatingContainer;
};
oFF.ProgramContainerType.prototype.isUiContainer = function()
{
	return this.m_isUiContainer;
};
oFF.ProgramContainerType.prototype.markEmbeddedContainer = function()
{
	this.m_isEmbeddedContainer = true;
	return this;
};
oFF.ProgramContainerType.prototype.markFloatingContainer = function()
{
	this.m_isFloatingContainer = true;
	return this;
};
oFF.ProgramContainerType.prototype.markUiContainer = function()
{
	this.m_isUiContainer = true;
	return this;
};

oFF.ProgramType = function() {};
oFF.ProgramType.prototype = new oFF.XConstant();
oFF.ProgramType.prototype._ff_c = "ProgramType";

oFF.ProgramType.BACKGROUND = null;
oFF.ProgramType.SHELL = null;
oFF.ProgramType.SUB_SYS = null;
oFF.ProgramType.UI = null;
oFF.ProgramType.s_lookup = null;
oFF.ProgramType.create = function(name)
{
	let theConstant = oFF.XConstant.setupName(new oFF.ProgramType(), name);
	oFF.ProgramType.s_lookup.put(name, theConstant);
	return theConstant;
};
oFF.ProgramType.lookup = function(name)
{
	return oFF.ProgramType.s_lookup.getByKey(name);
};
oFF.ProgramType.staticSetup = function()
{
	oFF.ProgramType.s_lookup = oFF.XHashMapByString.create();
	oFF.ProgramType.BACKGROUND = oFF.ProgramType.create("Background");
	oFF.ProgramType.SUB_SYS = oFF.ProgramType.create("SubSys");
	oFF.ProgramType.SHELL = oFF.ProgramType.create("Shell");
	oFF.ProgramType.UI = oFF.ProgramType.create("Ui");
};

oFF.ProcessEventType = function() {};
oFF.ProcessEventType.prototype = new oFF.XConstant();
oFF.ProcessEventType.prototype._ff_c = "ProcessEventType";

oFF.ProcessEventType.ACTIVE = null;
oFF.ProcessEventType.BEFORE_SHUTDOWN_REQUEST = null;
oFF.ProcessEventType.CREATED = null;
oFF.ProcessEventType.HTTP_RESPONSE = null;
oFF.ProcessEventType.PROGRAM_STARTED = null;
oFF.ProcessEventType.PROGRAM_STARTUP_ERROR = null;
oFF.ProcessEventType.PROGRAM_TITLE_CHANGED = null;
oFF.ProcessEventType.SHUTDOWN_REQUEST = null;
oFF.ProcessEventType.SHUTDOWN_STARTED = null;
oFF.ProcessEventType.START_CFG_CHANGED = null;
oFF.ProcessEventType.TERMINATED = null;
oFF.ProcessEventType.create = function(name)
{
	let theConstant = oFF.XConstant.setupName(new oFF.ProcessEventType(), name);
	return theConstant;
};
oFF.ProcessEventType.staticSetup = function()
{
	oFF.ProcessEventType.CREATED = oFF.ProcessEventType.create("Created");
	oFF.ProcessEventType.ACTIVE = oFF.ProcessEventType.create("Active");
	oFF.ProcessEventType.PROGRAM_STARTED = oFF.ProcessEventType.create("ProgramStarted");
	oFF.ProcessEventType.PROGRAM_STARTUP_ERROR = oFF.ProcessEventType.create("ProgramStartupError");
	oFF.ProcessEventType.START_CFG_CHANGED = oFF.ProcessEventType.create("StartCfgChanged");
	oFF.ProcessEventType.PROGRAM_TITLE_CHANGED = oFF.ProcessEventType.create("ProgramTitleChanged");
	oFF.ProcessEventType.BEFORE_SHUTDOWN_REQUEST = oFF.ProcessEventType.create("BeforeShutdownRequest");
	oFF.ProcessEventType.SHUTDOWN_REQUEST = oFF.ProcessEventType.create("ShutdownRequest");
	oFF.ProcessEventType.SHUTDOWN_STARTED = oFF.ProcessEventType.create("ShutdownStarted");
	oFF.ProcessEventType.TERMINATED = oFF.ProcessEventType.create("Terminated");
	oFF.ProcessEventType.HTTP_RESPONSE = oFF.ProcessEventType.create("HttpResponse");
};

oFF.ProcessType = function() {};
oFF.ProcessType.prototype = new oFF.XConstant();
oFF.ProcessType.prototype._ff_c = "ProcessType";

oFF.ProcessType.GENERIC = null;
oFF.ProcessType.PLUGIN = null;
oFF.ProcessType.PROGRAM = null;
oFF.ProcessType.ROOT = null;
oFF.ProcessType.SERVICE = null;
oFF.ProcessType.SUBSYSTEM = null;
oFF.ProcessType.s_lookup = null;
oFF.ProcessType.create = function(name)
{
	let theConstant = oFF.XConstant.setupName(new oFF.ProcessType(), name);
	oFF.ProcessType.s_lookup.put(name, theConstant);
	return theConstant;
};
oFF.ProcessType.lookup = function(name)
{
	return oFF.ProcessType.s_lookup.getByKey(name);
};
oFF.ProcessType.staticSetup = function()
{
	oFF.ProcessType.s_lookup = oFF.XHashMapByString.create();
	oFF.ProcessType.ROOT = oFF.ProcessType.create("Root");
	oFF.ProcessType.PROGRAM = oFF.ProcessType.create("Program");
	oFF.ProcessType.SUBSYSTEM = oFF.ProcessType.create("SubSystem");
	oFF.ProcessType.SERVICE = oFF.ProcessType.create("Service");
	oFF.ProcessType.PLUGIN = oFF.ProcessType.create("Plugin");
	oFF.ProcessType.GENERIC = oFF.ProcessType.create("Generic");
};

oFF.SigSelDomain = function() {};
oFF.SigSelDomain.prototype = new oFF.XConstant();
oFF.SigSelDomain.prototype._ff_c = "SigSelDomain";

oFF.SigSelDomain.CONTEXT = null;
oFF.SigSelDomain.DATA = null;
oFF.SigSelDomain.ENVVARS = null;
oFF.SigSelDomain.SUBSYSTEM = null;
oFF.SigSelDomain.UI = null;
oFF.SigSelDomain.s_all = null;
oFF.SigSelDomain.create = function(name)
{
	let domain = new oFF.SigSelDomain();
	domain._setupInternal(name);
	oFF.SigSelDomain.s_all.add(domain);
	return domain;
};
oFF.SigSelDomain.lookup = function(name)
{
	return oFF.SigSelDomain.s_all.getByKey(name);
};
oFF.SigSelDomain.staticSetup = function()
{
	oFF.SigSelDomain.s_all = oFF.XSetOfNameObject.create();
	oFF.SigSelDomain.UI = oFF.SigSelDomain.create("ui");
	oFF.SigSelDomain.DATA = oFF.SigSelDomain.create("dp");
	oFF.SigSelDomain.CONTEXT = oFF.SigSelDomain.create("Context");
	oFF.SigSelDomain.SUBSYSTEM = oFF.SigSelDomain.create("subsys");
	oFF.SigSelDomain.ENVVARS = oFF.SigSelDomain.create("env");
};

oFF.SigSelIndexType = function() {};
oFF.SigSelIndexType.prototype = new oFF.XConstant();
oFF.SigSelIndexType.prototype._ff_c = "SigSelIndexType";

oFF.SigSelIndexType.NAME = null;
oFF.SigSelIndexType.NONE = null;
oFF.SigSelIndexType.POSITION = null;
oFF.SigSelIndexType.staticSetup = function()
{
	oFF.SigSelIndexType.NONE = oFF.XConstant.setupName(new oFF.SigSelIndexType(), "None");
	oFF.SigSelIndexType.NAME = oFF.XConstant.setupName(new oFF.SigSelIndexType(), "Name");
	oFF.SigSelIndexType.POSITION = oFF.XConstant.setupName(new oFF.SigSelIndexType(), "Position");
};

oFF.SigSelType = function() {};
oFF.SigSelType.prototype = new oFF.XConstant();
oFF.SigSelType.prototype._ff_c = "SigSelType";

oFF.SigSelType.MATCH = null;
oFF.SigSelType.MATCH_ID = null;
oFF.SigSelType.MATCH_NAME = null;
oFF.SigSelType.WILDCARD = null;
oFF.SigSelType.staticSetup = function()
{
	oFF.SigSelType.MATCH = oFF.XConstant.setupName(new oFF.SigSelType(), "Match");
	oFF.SigSelType.MATCH_ID = oFF.XConstant.setupName(new oFF.SigSelType(), "MatchId");
	oFF.SigSelType.MATCH_NAME = oFF.XConstant.setupName(new oFF.SigSelType(), "MatchName");
	oFF.SigSelType.WILDCARD = oFF.XConstant.setupName(new oFF.SigSelType(), "Wildcard");
};

oFF.SubSystemStatus = function() {};
oFF.SubSystemStatus.prototype = new oFF.XConstant();
oFF.SubSystemStatus.prototype._ff_c = "SubSystemStatus";

oFF.SubSystemStatus.ACTIVE = null;
oFF.SubSystemStatus.BOOTSTRAP = null;
oFF.SubSystemStatus.CLOSED = null;
oFF.SubSystemStatus.INACTIVE = null;
oFF.SubSystemStatus.INITIAL = null;
oFF.SubSystemStatus.LOADING = null;
oFF.SubSystemStatus.create = function(name)
{
	let unitType = new oFF.SubSystemStatus();
	unitType._setupInternal(name);
	return unitType;
};
oFF.SubSystemStatus.staticSetup = function()
{
	oFF.SubSystemStatus.INITIAL = oFF.SubSystemStatus.create("Initial");
	oFF.SubSystemStatus.BOOTSTRAP = oFF.SubSystemStatus.create("Bootstrap");
	oFF.SubSystemStatus.LOADING = oFF.SubSystemStatus.create("Loading");
	oFF.SubSystemStatus.ACTIVE = oFF.SubSystemStatus.create("Active");
	oFF.SubSystemStatus.INACTIVE = oFF.SubSystemStatus.create("Inactive");
	oFF.SubSystemStatus.CLOSED = oFF.SubSystemStatus.create("Closed");
};

oFF.SubSystemType = function() {};
oFF.SubSystemType.prototype = new oFF.XConstant();
oFF.SubSystemType.prototype._ff_c = "SubSystemType";

oFF.SubSystemType.BOOTSTRAP_LANDSCAPE = null;
oFF.SubSystemType.CACHE = null;
oFF.SubSystemType.CREDENTIALS_PROVIDER = null;
oFF.SubSystemType.CREDENTIALS_PROVIDER_LITE = null;
oFF.SubSystemType.CREDENTIALS_PROVIDER_ORCA = null;
oFF.SubSystemType.CREDENTIALS_PROVIDER_ORCA_LITE = null;
oFF.SubSystemType.DATA_PROVIDER_POOL = null;
oFF.SubSystemType.ENCRYPTION = null;
oFF.SubSystemType.FILE_SYSTEM = null;
oFF.SubSystemType.GUI = null;
oFF.SubSystemType.KEY_MANAGER = null;
oFF.SubSystemType.SHARED_SERVERS = null;
oFF.SubSystemType.SYSTEM_LANDSCAPE = null;
oFF.SubSystemType.USER_PROFILE = null;
oFF.SubSystemType.VIRTUAL_FILE_SYSTEM = null;
oFF.SubSystemType.s_instances = null;
oFF.SubSystemType.create = function(name)
{
	let type = new oFF.SubSystemType();
	type._setupInternal(name);
	oFF.SubSystemType.s_instances.put(name, type);
	return type;
};
oFF.SubSystemType.lookup = function(name)
{
	return oFF.SubSystemType.s_instances.getByKey(name);
};
oFF.SubSystemType.staticSetup = function()
{
	oFF.SubSystemType.s_instances = oFF.XHashMapByString.create();
	oFF.SubSystemType.GUI = oFF.SubSystemType.create("Gui");
	oFF.SubSystemType.USER_PROFILE = oFF.SubSystemType.create("UserProfile");
	oFF.SubSystemType.BOOTSTRAP_LANDSCAPE = oFF.SubSystemType.create("BootstrapLandscape");
	oFF.SubSystemType.SYSTEM_LANDSCAPE = oFF.SubSystemType.create("SystemLandscape");
	oFF.SubSystemType.SHARED_SERVERS = oFF.SubSystemType.create("SharedServers");
	oFF.SubSystemType.FILE_SYSTEM = oFF.SubSystemType.create("FileSystem");
	oFF.SubSystemType.VIRTUAL_FILE_SYSTEM = oFF.SubSystemType.create("VirtualFileSystem");
	oFF.SubSystemType.ENCRYPTION = oFF.SubSystemType.create("Encryption");
	oFF.SubSystemType.CACHE = oFF.SubSystemType.create("Cache");
	oFF.SubSystemType.CREDENTIALS_PROVIDER = oFF.SubSystemType.create("CredentialsProvider");
	oFF.SubSystemType.CREDENTIALS_PROVIDER_LITE = oFF.SubSystemType.create("CredentialsProviderLite");
	oFF.SubSystemType.CREDENTIALS_PROVIDER_ORCA = oFF.SubSystemType.create("CredentialsProviderOrca");
	oFF.SubSystemType.CREDENTIALS_PROVIDER_ORCA_LITE = oFF.SubSystemType.create("OrcaCredentialsProviderLite");
	oFF.SubSystemType.DATA_PROVIDER_POOL = oFF.SubSystemType.create("DataProviderPool");
	oFF.SubSystemType.KEY_MANAGER = oFF.SubSystemType.create("KeyManager");
};

oFF.DataProviderActionParameterType = function() {};
oFF.DataProviderActionParameterType.prototype = new oFF.CoDataType();
oFF.DataProviderActionParameterType.prototype._ff_c = "DataProviderActionParameterType";

oFF.DataProviderActionParameterType.AXIS_TYPE = null;
oFF.DataProviderActionParameterType.CHART_TYPE = null;
oFF.DataProviderActionParameterType.COMPARISON_OPERATOR = null;
oFF.DataProviderActionParameterType.DIMENSION = null;
oFF.DataProviderActionParameterType.DIMENSION_MEMBER = null;
oFF.DataProviderActionParameterType.FIELD = null;
oFF.DataProviderActionParameterType.MEMBER_READ_MODE = null;
oFF.DataProviderActionParameterType.PROTOCOL_BINDING_TYPE = null;
oFF.DataProviderActionParameterType.VISUALIZATION_TYPE = null;
oFF.DataProviderActionParameterType.ZERO_SUPPRESSION_TYPE = null;
oFF.DataProviderActionParameterType.createConstant = function(name)
{
	let constant = oFF.XConstant.setupName(new oFF.DataProviderActionParameterType(), name);
	constant.setupType(name, oFF.PrElementType.STRING);
	return constant;
};
oFF.DataProviderActionParameterType.staticSetupExt = function()
{
	oFF.DataProviderActionParameterType.DIMENSION = oFF.DataProviderActionParameterType.createConstant("Dimension");
	oFF.DataProviderActionParameterType.DIMENSION_MEMBER = oFF.DataProviderActionParameterType.createConstant("DimensionMember");
	oFF.DataProviderActionParameterType.FIELD = oFF.DataProviderActionParameterType.createConstant("Field");
	oFF.DataProviderActionParameterType.AXIS_TYPE = oFF.DataProviderActionParameterType.createConstant("AxisType");
	oFF.DataProviderActionParameterType.COMPARISON_OPERATOR = oFF.DataProviderActionParameterType.createConstant("ComparisonOperator");
	oFF.DataProviderActionParameterType.MEMBER_READ_MODE = oFF.DataProviderActionParameterType.createConstant("MemberReadMode");
	oFF.DataProviderActionParameterType.ZERO_SUPPRESSION_TYPE = oFF.DataProviderActionParameterType.createConstant("ZeroSuppressionType");
	oFF.DataProviderActionParameterType.VISUALIZATION_TYPE = oFF.DataProviderActionParameterType.createConstant("VisualizationType");
	oFF.DataProviderActionParameterType.PROTOCOL_BINDING_TYPE = oFF.DataProviderActionParameterType.createConstant("ProtocolBindingType");
	oFF.DataProviderActionParameterType.CHART_TYPE = oFF.DataProviderActionParameterType.createConstant("ChartType");
};

oFF.XFileAttributeDef = function() {};
oFF.XFileAttributeDef.prototype = new oFF.XConstantWithParent();
oFF.XFileAttributeDef.prototype._ff_c = "XFileAttributeDef";

oFF.XFileAttributeDef.ACCESS_RIGHTS = null;
oFF.XFileAttributeDef.ANCESTOR_PATH = null;
oFF.XFileAttributeDef.ANCESTOR_RESOURCE = null;
oFF.XFileAttributeDef.BOOLEAN_BASED = null;
oFF.XFileAttributeDef.CAN_ASSIGN = null;
oFF.XFileAttributeDef.CAN_COMMENT_ADD = null;
oFF.XFileAttributeDef.CAN_COMMENT_DELETE = null;
oFF.XFileAttributeDef.CAN_COMMENT_VIEW = null;
oFF.XFileAttributeDef.CAN_COPY = null;
oFF.XFileAttributeDef.CAN_CREATE_DOC = null;
oFF.XFileAttributeDef.CAN_CREATE_FOLDER = null;
oFF.XFileAttributeDef.CAN_DELETE = null;
oFF.XFileAttributeDef.CAN_MAINTAIN = null;
oFF.XFileAttributeDef.CAN_READ = null;
oFF.XFileAttributeDef.CAN_UPDATE = null;
oFF.XFileAttributeDef.CHANGED_AT = null;
oFF.XFileAttributeDef.CHANGED_BY = null;
oFF.XFileAttributeDef.CHANGED_BY_DISPLAY_NAME = null;
oFF.XFileAttributeDef.CREATED_AT = null;
oFF.XFileAttributeDef.CREATED_BY = null;
oFF.XFileAttributeDef.CREATED_BY_DISPLAY_NAME = null;
oFF.XFileAttributeDef.DATE_MS_BASED = null;
oFF.XFileAttributeDef.DEPENDENT_OBJECTS = null;
oFF.XFileAttributeDef.DESCRIPTION = null;
oFF.XFileAttributeDef.DISPLAY_NAME = null;
oFF.XFileAttributeDef.FAVOURTIE_RESOURCE_ID = null;
oFF.XFileAttributeDef.FILE_TYPE = null;
oFF.XFileAttributeDef.FOLDER_ID = null;
oFF.XFileAttributeDef.HOST_NAME = null;
oFF.XFileAttributeDef.ICON = null;
oFF.XFileAttributeDef.IGNORE_QUICKFILTERS = null;
oFF.XFileAttributeDef.INTEGER_BASED = null;
oFF.XFileAttributeDef.IS_DIRECTORY = null;
oFF.XFileAttributeDef.IS_EXECUTABLE = null;
oFF.XFileAttributeDef.IS_EXISTING = null;
oFF.XFileAttributeDef.IS_FILE = null;
oFF.XFileAttributeDef.IS_HIDDEN = null;
oFF.XFileAttributeDef.IS_LINK = null;
oFF.XFileAttributeDef.IS_READABLE = null;
oFF.XFileAttributeDef.IS_SHARED = null;
oFF.XFileAttributeDef.IS_WORKSPACE_FILE = null;
oFF.XFileAttributeDef.IS_WRITEABLE = null;
oFF.XFileAttributeDef.LINK_URL = null;
oFF.XFileAttributeDef.LIST_BASED = null;
oFF.XFileAttributeDef.METADATA = null;
oFF.XFileAttributeDef.MOBILE_SUPPORT = null;
oFF.XFileAttributeDef.NAME = null;
oFF.XFileAttributeDef.NODE_SUB_TYPE = null;
oFF.XFileAttributeDef.NODE_TYPE = null;
oFF.XFileAttributeDef.OLAP_DATASOURCE = null;
oFF.XFileAttributeDef.OLAP_DATASOURCE_NAME = null;
oFF.XFileAttributeDef.OLAP_DATASOURCE_PACKAGE = null;
oFF.XFileAttributeDef.OLAP_DATASOURCE_SCHEMA = null;
oFF.XFileAttributeDef.OLAP_DATASOURCE_SYSTEM = null;
oFF.XFileAttributeDef.OLAP_DATASOURCE_TYPE = null;
oFF.XFileAttributeDef.OLAP_DATA_CATEGORY = null;
oFF.XFileAttributeDef.ORIGINAL_LANGUAGE = null;
oFF.XFileAttributeDef.OWNER_FOLDER = null;
oFF.XFileAttributeDef.OWNER_TYPE = null;
oFF.XFileAttributeDef.PACKAGE_ID = null;
oFF.XFileAttributeDef.PARENT_UNIQUE_ID = null;
oFF.XFileAttributeDef.PROVIDER_LINK_URL = null;
oFF.XFileAttributeDef.SAC_EPM_OBJECT_ID = null;
oFF.XFileAttributeDef.SEMANTIC_TYPE = null;
oFF.XFileAttributeDef.SHAREABLE = null;
oFF.XFileAttributeDef.SHARED = null;
oFF.XFileAttributeDef.SHARED_TO_ANY = null;
oFF.XFileAttributeDef.SIZE = null;
oFF.XFileAttributeDef.SOURCE_PROGRAM = null;
oFF.XFileAttributeDef.SOURCE_RESOURCE = null;
oFF.XFileAttributeDef.SPACE_ID = null;
oFF.XFileAttributeDef.STORY_CONTENT = null;
oFF.XFileAttributeDef.STRING_BASED = null;
oFF.XFileAttributeDef.STRUCTURE_BASED = null;
oFF.XFileAttributeDef.SUB_OBJECTS = null;
oFF.XFileAttributeDef.SUPPORTED_FILTERS = null;
oFF.XFileAttributeDef.SUPPORTED_FILTER_TYPES = null;
oFF.XFileAttributeDef.SUPPORTS_CARTESIAN_FILTER = null;
oFF.XFileAttributeDef.SUPPORTS_DELETE = null;
oFF.XFileAttributeDef.SUPPORTS_DELETE_RECURSIVE = null;
oFF.XFileAttributeDef.SUPPORTS_EXECUTE = null;
oFF.XFileAttributeDef.SUPPORTS_FETCH_CHILDREN = null;
oFF.XFileAttributeDef.SUPPORTS_IS_EXISTING = null;
oFF.XFileAttributeDef.SUPPORTS_LOAD = null;
oFF.XFileAttributeDef.SUPPORTS_MAX_ITEMS = null;
oFF.XFileAttributeDef.SUPPORTS_MKDIR = null;
oFF.XFileAttributeDef.SUPPORTS_OFFSET = null;
oFF.XFileAttributeDef.SUPPORTS_PARALLEL_SEARCH = null;
oFF.XFileAttributeDef.SUPPORTS_RENAME_TO = null;
oFF.XFileAttributeDef.SUPPORTS_SAVE = null;
oFF.XFileAttributeDef.SUPPORTS_SEARCH = null;
oFF.XFileAttributeDef.SUPPORTS_SET_LAST_MODIFIED = null;
oFF.XFileAttributeDef.SUPPORTS_SET_WRITABLE = null;
oFF.XFileAttributeDef.SUPPORTS_SINGLE_SORT = null;
oFF.XFileAttributeDef.SUPPORTS_SIZE = null;
oFF.XFileAttributeDef.SYSTEM_NAME = null;
oFF.XFileAttributeDef.SYSTEM_TYPE = null;
oFF.XFileAttributeDef.TARGET_URL = null;
oFF.XFileAttributeDef.TEXTS = null;
oFF.XFileAttributeDef.UNIQUE_ID = null;
oFF.XFileAttributeDef.UPDATE_COUNT = null;
oFF.XFileAttributeDef.URL_BASED = null;
oFF.XFileAttributeDef.USER = null;
oFF.XFileAttributeDef.VIEWS = null;
oFF.XFileAttributeDef.s_lookup = null;
oFF.XFileAttributeDef.create = function(name, parent)
{
	let type = new oFF.XFileAttributeDef();
	type.setupExt(name, parent);
	oFF.XFileAttributeDef.s_lookup.put(name, type);
	return type;
};
oFF.XFileAttributeDef.lookup = function(name)
{
	return oFF.XFileAttributeDef.s_lookup.getByKey(name);
};
oFF.XFileAttributeDef.staticSetup = function()
{
	oFF.XFileAttributeDef.s_lookup = oFF.XHashMapByString.create();
	oFF.XFileAttributeDef.STRING_BASED = oFF.XFileAttributeDef.create(oFF.XFileAttribute.STRING_BASED, null);
	oFF.XFileAttributeDef.INTEGER_BASED = oFF.XFileAttributeDef.create(oFF.XFileAttribute.INTEGER_BASED, null);
	oFF.XFileAttributeDef.BOOLEAN_BASED = oFF.XFileAttributeDef.create(oFF.XFileAttribute.BOOLEAN_BASED, null);
	oFF.XFileAttributeDef.STRUCTURE_BASED = oFF.XFileAttributeDef.create(oFF.XFileAttribute.STRUCTURE_BASED, null);
	oFF.XFileAttributeDef.LIST_BASED = oFF.XFileAttributeDef.create(oFF.XFileAttribute.LIST_BASED, null);
	oFF.XFileAttributeDef.DATE_MS_BASED = oFF.XFileAttributeDef.create(oFF.XFileAttribute.DATE_MS_BASED, oFF.XFileAttributeDef.INTEGER_BASED);
	oFF.XFileAttributeDef.URL_BASED = oFF.XFileAttributeDef.create(oFF.XFileAttribute.URL_BASED, oFF.XFileAttributeDef.STRING_BASED);
	oFF.XFileAttributeDef.NAME = oFF.XFileAttributeDef.create(oFF.XFileAttribute.NAME, oFF.XFileAttributeDef.STRING_BASED);
	oFF.XFileAttributeDef.DISPLAY_NAME = oFF.XFileAttributeDef.create(oFF.XFileAttribute.DISPLAY_NAME, oFF.XFileAttributeDef.STRING_BASED);
	oFF.XFileAttributeDef.DESCRIPTION = oFF.XFileAttributeDef.create(oFF.XFileAttribute.DESCRIPTION, oFF.XFileAttributeDef.STRING_BASED);
	oFF.XFileAttributeDef.ICON = oFF.XFileAttributeDef.create(oFF.XFileAttribute.ICON, oFF.XFileAttributeDef.STRING_BASED);
	oFF.XFileAttributeDef.NODE_TYPE = oFF.XFileAttributeDef.create(oFF.XFileAttribute.NODE_TYPE, oFF.XFileAttributeDef.STRING_BASED);
	oFF.XFileAttributeDef.SEMANTIC_TYPE = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SEMANTIC_TYPE, oFF.XFileAttributeDef.STRING_BASED);
	oFF.XFileAttributeDef.FILE_TYPE = oFF.XFileAttributeDef.create(oFF.XFileAttribute.FILE_TYPE, oFF.XFileAttributeDef.STRING_BASED);
	oFF.XFileAttributeDef.SIZE = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SIZE, oFF.XFileAttributeDef.INTEGER_BASED);
	oFF.XFileAttributeDef.IS_EXISTING = oFF.XFileAttributeDef.create(oFF.XFileAttribute.IS_EXISTING, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.IS_DIRECTORY = oFF.XFileAttributeDef.create(oFF.XFileAttribute.IS_DIRECTORY, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.IS_FILE = oFF.XFileAttributeDef.create(oFF.XFileAttribute.IS_FILE, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.IS_EXECUTABLE = oFF.XFileAttributeDef.create(oFF.XFileAttribute.IS_EXECUTABLE, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.IS_HIDDEN = oFF.XFileAttributeDef.create(oFF.XFileAttribute.IS_HIDDEN, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.IS_READABLE = oFF.XFileAttributeDef.create(oFF.XFileAttribute.IS_READABLE, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.IS_WRITEABLE = oFF.XFileAttributeDef.create(oFF.XFileAttribute.IS_WRITEABLE, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.IGNORE_QUICKFILTERS = oFF.XFileAttributeDef.create(oFF.XFileAttribute.IGNORE_QUICKFILTERS, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.IS_WORKSPACE_FILE = oFF.XFileAttributeDef.create(oFF.XFileAttribute.IS_WORKSPACE_FILE, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.SPACE_ID = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SPACE_ID, oFF.XFileAttributeDef.STRING_BASED);
	oFF.XFileAttributeDef.FOLDER_ID = oFF.XFileAttributeDef.create(oFF.XFileAttribute.FOLDER_ID, oFF.XFileAttributeDef.STRING_BASED);
	oFF.XFileAttributeDef.TARGET_URL = oFF.XFileAttributeDef.create(oFF.XFileAttribute.TARGET_URL, oFF.XFileAttributeDef.URL_BASED);
	oFF.XFileAttributeDef.IS_LINK = oFF.XFileAttributeDef.create(oFF.XFileAttribute.IS_LINK, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.LINK_URL = oFF.XFileAttributeDef.create(oFF.XFileAttribute.LINK_URL, oFF.XFileAttributeDef.URL_BASED);
	oFF.XFileAttributeDef.PROVIDER_LINK_URL = oFF.XFileAttributeDef.create(oFF.XFileAttribute.PROVIDER_LINK_URL, oFF.XFileAttributeDef.URL_BASED);
	oFF.XFileAttributeDef.USER = oFF.XFileAttributeDef.create(oFF.XFileAttribute.USER, oFF.XFileAttributeDef.STRING_BASED);
	oFF.XFileAttributeDef.CREATED_BY = oFF.XFileAttributeDef.create(oFF.XFileAttribute.CREATED_BY, oFF.XFileAttributeDef.USER);
	oFF.XFileAttributeDef.CREATED_AT = oFF.XFileAttributeDef.create(oFF.XFileAttribute.CREATED_AT, oFF.XFileAttributeDef.DATE_MS_BASED);
	oFF.XFileAttributeDef.CHANGED_BY = oFF.XFileAttributeDef.create(oFF.XFileAttribute.CHANGED_BY, oFF.XFileAttributeDef.USER);
	oFF.XFileAttributeDef.CHANGED_AT = oFF.XFileAttributeDef.create(oFF.XFileAttribute.CHANGED_AT, oFF.XFileAttributeDef.DATE_MS_BASED);
	oFF.XFileAttributeDef.OLAP_DATASOURCE = oFF.XFileAttributeDef.create(oFF.XFileAttribute.OLAP_DATASOURCE, oFF.XFileAttributeDef.STRING_BASED);
	oFF.XFileAttributeDef.OLAP_DATASOURCE_NAME = oFF.XFileAttributeDef.create(oFF.XFileAttribute.OLAP_DATASOURCE_NAME, oFF.XFileAttributeDef.OLAP_DATASOURCE);
	oFF.XFileAttributeDef.OLAP_DATASOURCE_SCHEMA = oFF.XFileAttributeDef.create(oFF.XFileAttribute.OLAP_DATASOURCE_SCHEMA, oFF.XFileAttributeDef.OLAP_DATASOURCE);
	oFF.XFileAttributeDef.OLAP_DATASOURCE_PACKAGE = oFF.XFileAttributeDef.create(oFF.XFileAttribute.OLAP_DATASOURCE_PACKAGE, oFF.XFileAttributeDef.OLAP_DATASOURCE);
	oFF.XFileAttributeDef.OLAP_DATASOURCE_TYPE = oFF.XFileAttributeDef.create(oFF.XFileAttribute.OLAP_DATASOURCE_TYPE, oFF.XFileAttributeDef.OLAP_DATASOURCE);
	oFF.XFileAttributeDef.OLAP_DATASOURCE_SYSTEM = oFF.XFileAttributeDef.create(oFF.XFileAttribute.OLAP_DATASOURCE_SYSTEM, oFF.XFileAttributeDef.OLAP_DATASOURCE);
	oFF.XFileAttributeDef.OLAP_DATA_CATEGORY = oFF.XFileAttributeDef.create(oFF.XFileAttribute.OLAP_DATA_CATEGORY, oFF.XFileAttributeDef.OLAP_DATASOURCE);
	oFF.XFileAttributeDef.SYSTEM_TYPE = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SYSTEM_TYPE, oFF.XFileAttributeDef.STRING_BASED);
	oFF.XFileAttributeDef.SYSTEM_NAME = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SYSTEM_NAME, oFF.XFileAttributeDef.STRING_BASED);
	oFF.XFileAttributeDef.HOST_NAME = oFF.XFileAttributeDef.create(oFF.XFileAttribute.HOST_NAME, oFF.XFileAttributeDef.STRING_BASED);
	oFF.XFileAttributeDef.UNIQUE_ID = oFF.XFileAttributeDef.create(oFF.XFileAttribute.UNIQUE_ID, oFF.XFileAttributeDef.STRING_BASED);
	oFF.XFileAttributeDef.OWNER_FOLDER = oFF.XFileAttributeDef.create(oFF.XFileAttribute.OWNER_FOLDER, oFF.XFileAttributeDef.STRING_BASED);
	oFF.XFileAttributeDef.OWNER_TYPE = oFF.XFileAttributeDef.create(oFF.XFileAttribute.OWNER_TYPE, oFF.XFileAttributeDef.STRING_BASED);
	oFF.XFileAttributeDef.PARENT_UNIQUE_ID = oFF.XFileAttributeDef.create(oFF.XFileAttribute.PARENT_UNIQUE_ID, oFF.XFileAttributeDef.STRING_BASED);
	oFF.XFileAttributeDef.UPDATE_COUNT = oFF.XFileAttributeDef.create(oFF.XFileAttribute.UPDATE_COUNT, oFF.XFileAttributeDef.INTEGER_BASED);
	oFF.XFileAttributeDef.ORIGINAL_LANGUAGE = oFF.XFileAttributeDef.create(oFF.XFileAttribute.ORIGINAL_LANGUAGE, oFF.XFileAttributeDef.STRING_BASED);
	oFF.XFileAttributeDef.PACKAGE_ID = oFF.XFileAttributeDef.create(oFF.XFileAttribute.PACKAGE_ID, oFF.XFileAttributeDef.STRING_BASED);
	oFF.XFileAttributeDef.NODE_SUB_TYPE = oFF.XFileAttributeDef.create(oFF.XFileAttribute.NODE_SUB_TYPE, oFF.XFileAttributeDef.STRING_BASED);
	oFF.XFileAttributeDef.MOBILE_SUPPORT = oFF.XFileAttributeDef.create(oFF.XFileAttribute.MOBILE_SUPPORT, oFF.XFileAttributeDef.INTEGER_BASED);
	oFF.XFileAttributeDef.CREATED_BY_DISPLAY_NAME = oFF.XFileAttributeDef.create(oFF.XFileAttribute.CREATED_BY_DISPLAY_NAME, oFF.XFileAttributeDef.STRING_BASED);
	oFF.XFileAttributeDef.CHANGED_BY_DISPLAY_NAME = oFF.XFileAttributeDef.create(oFF.XFileAttribute.CHANGED_BY_DISPLAY_NAME, oFF.XFileAttributeDef.STRING_BASED);
	oFF.XFileAttributeDef.SOURCE_RESOURCE = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SOURCE_RESOURCE, oFF.XFileAttributeDef.STRUCTURE_BASED);
	oFF.XFileAttributeDef.ANCESTOR_RESOURCE = oFF.XFileAttributeDef.create(oFF.XFileAttribute.ANCESTOR_RESOURCE, oFF.XFileAttributeDef.LIST_BASED);
	oFF.XFileAttributeDef.SHARED_TO_ANY = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SHARED_TO_ANY, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.IS_SHARED = oFF.XFileAttributeDef.create(oFF.XFileAttribute.IS_SHARED, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.SHARED = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SHARED, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.SHAREABLE = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SHAREABLE, oFF.XFileAttributeDef.STRING_BASED);
	oFF.XFileAttributeDef.STORY_CONTENT = oFF.XFileAttributeDef.create(oFF.XFileAttribute.STORY_CONTENT, oFF.XFileAttributeDef.STRUCTURE_BASED);
	oFF.XFileAttributeDef.SAC_EPM_OBJECT_ID = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SAC_EPM_OBJECT_ID, oFF.XFileAttributeDef.STRING_BASED);
	oFF.XFileAttributeDef.METADATA = oFF.XFileAttributeDef.create(oFF.XFileAttribute.METADATA, oFF.XFileAttributeDef.STRUCTURE_BASED);
	oFF.XFileAttributeDef.SOURCE_PROGRAM = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SOURCE_PROGRAM, oFF.XFileAttributeDef.STRING_BASED);
	oFF.XFileAttributeDef.CAN_ASSIGN = oFF.XFileAttributeDef.create(oFF.XFileAttribute.CAN_ASSIGN, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.CAN_READ = oFF.XFileAttributeDef.create(oFF.XFileAttribute.CAN_READ, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.CAN_UPDATE = oFF.XFileAttributeDef.create(oFF.XFileAttribute.CAN_UPDATE, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.CAN_DELETE = oFF.XFileAttributeDef.create(oFF.XFileAttribute.CAN_DELETE, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.CAN_CREATE_DOC = oFF.XFileAttributeDef.create(oFF.XFileAttribute.CAN_CREATE_DOC, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.CAN_CREATE_FOLDER = oFF.XFileAttributeDef.create(oFF.XFileAttribute.CAN_CREATE_FOLDER, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.CAN_COPY = oFF.XFileAttributeDef.create(oFF.XFileAttribute.CAN_COPY, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.CAN_COMMENT_VIEW = oFF.XFileAttributeDef.create(oFF.XFileAttribute.CAN_COMMENT_VIEW, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.CAN_COMMENT_ADD = oFF.XFileAttributeDef.create(oFF.XFileAttribute.CAN_COMMENT_ADD, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.CAN_COMMENT_DELETE = oFF.XFileAttributeDef.create(oFF.XFileAttribute.CAN_COMMENT_DELETE, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.CAN_MAINTAIN = oFF.XFileAttributeDef.create(oFF.XFileAttribute.CAN_MAINTAIN, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.SUPPORTS_CARTESIAN_FILTER = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SUPPORTS_CARTESIAN_FILTER, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.SUPPORTS_OFFSET = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SUPPORTS_OFFSET, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.SUPPORTS_MAX_ITEMS = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SUPPORTS_MAX_ITEMS, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.SUPPORTS_SINGLE_SORT = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SUPPORTS_SINGLE_SORT, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.SUPPORTS_SEARCH = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SUPPORTS_SEARCH, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.SUPPORTS_PARALLEL_SEARCH = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SUPPORTS_PARALLEL_SEARCH, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.SUPPORTED_FILTER_TYPES = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SUPPORTED_FILTER_TYPES, oFF.XFileAttributeDef.LIST_BASED);
	oFF.XFileAttributeDef.SUPPORTED_FILTERS = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SUPPORTED_FILTERS, oFF.XFileAttributeDef.STRUCTURE_BASED);
	oFF.XFileAttributeDef.SUPPORTS_SET_LAST_MODIFIED = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SUPPORTS_SET_LAST_MODIFIED, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.SUPPORTS_SIZE = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SUPPORTS_SIZE, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.SUPPORTS_RENAME_TO = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SUPPORTS_RENAME_TO, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.SUPPORTS_DELETE = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SUPPORTS_DELETE, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.SUPPORTS_DELETE_RECURSIVE = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SUPPORTS_DELETE_RECURSIVE, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.SUPPORTS_MKDIR = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SUPPORTS_MKDIR, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.SUPPORTS_IS_EXISTING = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SUPPORTS_IS_EXISTING, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.SUPPORTS_FETCH_CHILDREN = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SUPPORTS_FETCH_CHILDREN, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.SUPPORTS_LOAD = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SUPPORTS_LOAD, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.SUPPORTS_SAVE = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SUPPORTS_SAVE, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.SUPPORTS_EXECUTE = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SUPPORTS_EXECUTE, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.SUPPORTS_SET_WRITABLE = oFF.XFileAttributeDef.create(oFF.XFileAttribute.SUPPORTS_SET_WRITABLE, oFF.XFileAttributeDef.BOOLEAN_BASED);
	oFF.XFileAttributeDef.ACCESS_RIGHTS = oFF.XFileAttributeDef.create(oFF.XFileAttribute.ACCESS_RIGHTS, oFF.XFileAttributeDef.LIST_BASED);
};
oFF.XFileAttributeDef.prototype.isBoolean = function()
{
	return this.isTypeOf(oFF.XFileAttributeDef.BOOLEAN_BASED);
};
oFF.XFileAttributeDef.prototype.isDouble = function()
{
	return false;
};
oFF.XFileAttributeDef.prototype.isInteger = function()
{
	return this.isTypeOf(oFF.XFileAttributeDef.INTEGER_BASED);
};
oFF.XFileAttributeDef.prototype.isList = function()
{
	return this.isTypeOf(oFF.XFileAttributeDef.LIST_BASED);
};
oFF.XFileAttributeDef.prototype.isLong = function()
{
	return this.isTypeOf(oFF.XFileAttributeDef.INTEGER_BASED);
};
oFF.XFileAttributeDef.prototype.isNumeric = function()
{
	return this.isTypeOf(oFF.XFileAttributeDef.INTEGER_BASED);
};
oFF.XFileAttributeDef.prototype.isObject = function()
{
	return false;
};
oFF.XFileAttributeDef.prototype.isString = function()
{
	return this.isTypeOf(oFF.XFileAttributeDef.STRING_BASED);
};

oFF.ResourceStatus = function() {};
oFF.ResourceStatus.prototype = new oFF.XConstantWithParent();
oFF.ResourceStatus.prototype._ff_c = "ResourceStatus";

oFF.ResourceStatus.ABSTRACT_FINISHED = null;
oFF.ResourceStatus.ABSTRACT_INITIALIZING = null;
oFF.ResourceStatus.DYNAMIC_INITIALIZING = null;
oFF.ResourceStatus.FAILED = null;
oFF.ResourceStatus.INITIAL = null;
oFF.ResourceStatus.LOADING = null;
oFF.ResourceStatus.SUCCESS = null;
oFF.ResourceStatus.UNDEFINED = null;
oFF.ResourceStatus.create = function(name, parent)
{
	let type = new oFF.ResourceStatus();
	type.setupExt(name, parent);
	return type;
};
oFF.ResourceStatus.staticSetup = function()
{
	oFF.ResourceStatus.UNDEFINED = oFF.ResourceStatus.create("Undefined", null);
	oFF.ResourceStatus.INITIAL = oFF.ResourceStatus.create("Initial", null);
	oFF.ResourceStatus.ABSTRACT_INITIALIZING = oFF.ResourceStatus.create("AbstractInitializing", null);
	oFF.ResourceStatus.LOADING = oFF.ResourceStatus.create("Loading", oFF.ResourceStatus.ABSTRACT_INITIALIZING);
	oFF.ResourceStatus.DYNAMIC_INITIALIZING = oFF.ResourceStatus.create("DynamicInitializing", oFF.ResourceStatus.ABSTRACT_INITIALIZING);
	oFF.ResourceStatus.ABSTRACT_FINISHED = oFF.ResourceStatus.create("AbstractFinished", null);
	oFF.ResourceStatus.SUCCESS = oFF.ResourceStatus.create("Success", oFF.ResourceStatus.ABSTRACT_FINISHED);
	oFF.ResourceStatus.FAILED = oFF.ResourceStatus.create("Failed", oFF.ResourceStatus.ABSTRACT_FINISHED);
};

oFF.KernelComponentType = function() {};
oFF.KernelComponentType.prototype = new oFF.XComponentType();
oFF.KernelComponentType.prototype._ff_c = "KernelComponentType";

oFF.KernelComponentType.SIGSEL_RESULT_LIST = null;
oFF.KernelComponentType.SYSTEM_DESCRIPTION = null;
oFF.KernelComponentType.SYSTEM_LANDSCAPE = null;
oFF.KernelComponentType.createKernelType = function(constant, parent)
{
	let mt = new oFF.KernelComponentType();
	if (oFF.isNull(parent))
	{
		mt.setupExt(constant, oFF.XComponentType._ROOT);
	}
	else
	{
		mt.setupExt(constant, parent);
	}
	return mt;
};
oFF.KernelComponentType.staticSetupKernelComponentTypes = function()
{
	oFF.KernelComponentType.SIGSEL_RESULT_LIST = oFF.KernelComponentType.createKernelType("SigSelResultList", oFF.XComponentType._ROOT);
	oFF.KernelComponentType.SYSTEM_DESCRIPTION = oFF.KernelComponentType.createKernelType("SystemDescription", oFF.XComponentType._ROOT);
	oFF.KernelComponentType.SYSTEM_LANDSCAPE = oFF.KernelComponentType.createKernelType("SystemLandscape", oFF.XComponentType._ROOT);
};

oFF.CoConfigurationErrorType = function() {};
oFF.CoConfigurationErrorType.prototype = new oFF.XErrorType();
oFF.CoConfigurationErrorType.prototype._ff_c = "CoConfigurationErrorType";

oFF.CoConfigurationErrorType.MANIFEST_COULD_NOT_PROCESS_MANIFEST_JSON = null;
oFF.CoConfigurationErrorType.MANIFEST_INVALID_NAME = null;
oFF.CoConfigurationErrorType.MANIFEST_MISSING_NAME = null;
oFF.CoConfigurationErrorType.createConfigValidationError = function(constant, parent)
{
	return oFF.XErrorType.createError(new oFF.CoConfigurationErrorType(), constant, parent);
};
oFF.CoConfigurationErrorType.staticSetupConfiguration = function()
{
	oFF.CoConfigurationErrorType.MANIFEST_MISSING_NAME = oFF.CoConfigurationErrorType.createConfigValidationError("ManifestMissingName", null);
	oFF.CoConfigurationErrorType.MANIFEST_INVALID_NAME = oFF.CoConfigurationErrorType.createConfigValidationError("ManifestInvalidName", null);
	oFF.CoConfigurationErrorType.MANIFEST_COULD_NOT_PROCESS_MANIFEST_JSON = oFF.CoConfigurationErrorType.createConfigValidationError("CouldNotProcessManifestJson", null);
};

oFF.CoPropertyValidationErrorType = function() {};
oFF.CoPropertyValidationErrorType.prototype = new oFF.XErrorType();
oFF.CoPropertyValidationErrorType.prototype._ff_c = "CoPropertyValidationErrorType";

oFF.CoPropertyValidationErrorType.DATA_TYPE_MISMATCH = null;
oFF.CoPropertyValidationErrorType.VALUE_DOES_NOT_MATCH_PATTERN = null;
oFF.CoPropertyValidationErrorType.VALUE_LENGTH_OUT_OF_RANGE = null;
oFF.CoPropertyValidationErrorType.VALUE_NOT_MULTIPLE_OF = null;
oFF.CoPropertyValidationErrorType.VALUE_OUT_OF_RANGE = null;
oFF.CoPropertyValidationErrorType.createConfigValidationError = function(constant, parent)
{
	return oFF.XErrorType.createError(new oFF.CoPropertyValidationErrorType(), constant, parent);
};
oFF.CoPropertyValidationErrorType.staticSetupPropertyValidation = function()
{
	oFF.CoPropertyValidationErrorType.DATA_TYPE_MISMATCH = oFF.CoPropertyValidationErrorType.createConfigValidationError("DataTypeMismatch", null);
	oFF.CoPropertyValidationErrorType.VALUE_OUT_OF_RANGE = oFF.CoPropertyValidationErrorType.createConfigValidationError("ValueOutOfRange", null);
	oFF.CoPropertyValidationErrorType.VALUE_NOT_MULTIPLE_OF = oFF.CoPropertyValidationErrorType.createConfigValidationError("ValueNotMultipleOf", null);
	oFF.CoPropertyValidationErrorType.VALUE_LENGTH_OUT_OF_RANGE = oFF.CoPropertyValidationErrorType.createConfigValidationError("ValueLengthOutOfRange", null);
	oFF.CoPropertyValidationErrorType.VALUE_DOES_NOT_MATCH_PATTERN = oFF.CoPropertyValidationErrorType.createConfigValidationError("ValueDoesNotMatchPattern", null);
};

oFF.DataProviderErrorType = function() {};
oFF.DataProviderErrorType.prototype = new oFF.XErrorType();
oFF.DataProviderErrorType.prototype._ff_c = "DataProviderErrorType";

oFF.DataProviderErrorType.ACTION_MANIFEST_VALIDATION = null;
oFF.DataProviderErrorType.createDataProviderError = function(constant, parent)
{
	return oFF.XErrorType.createError(new oFF.DataProviderErrorType(), constant, parent);
};
oFF.DataProviderErrorType.staticSetupDataProvider = function()
{
	oFF.DataProviderErrorType.ACTION_MANIFEST_VALIDATION = oFF.DataProviderErrorType.createDataProviderError("ActionManifestValidation", null);
};

oFF.KernelApiModule = function() {};
oFF.KernelApiModule.prototype = new oFF.DfModule();
oFF.KernelApiModule.prototype._ff_c = "KernelApiModule";

oFF.KernelApiModule.s_module = null;
oFF.KernelApiModule.getInstance = function()
{
	if (oFF.isNull(oFF.KernelApiModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.IoExtModule.getInstance());
		oFF.KernelApiModule.s_module = oFF.DfModule.startExt(new oFF.KernelApiModule());
		oFF.CoConfigurationLayer.staticSetup();
		oFF.CoConfigurationType.staticSetup();
		oFF.CoDataType.staticSetup();
		oFF.CoPropertyGroup.staticSetup();
		oFF.CoConfigurationErrorType.staticSetupConfiguration();
		oFF.CoPropertyValidationErrorType.staticSetupPropertyValidation();
		oFF.ResourceType.staticSetup();
		oFF.ResourceStatus.staticSetup();
		oFF.SubSystemType.staticSetup();
		oFF.ProgramType.staticSetup();
		oFF.ProgramContainerType.staticSetup();
		oFF.ProgramCategory.staticSetup();
		oFF.SystemRole.staticSetup();
		oFF.SigSelType.staticSetup();
		oFF.SigSelDomain.staticSetup();
		oFF.SigSelIndexType.staticSetup();
		oFF.SubSystemStatus.staticSetup();
		oFF.ServiceApiLevel.staticSetup();
		oFF.KernelComponentType.staticSetupKernelComponentTypes();
		oFF.ProcessType.staticSetup();
		oFF.ProcessEventType.staticSetup();
		oFF.XFileAttributeDef.staticSetup();
		oFF.XFileFilterType.staticSetup();
		oFF.XFileCachingType.staticSetup();
		oFF.XFileSaveMode.staticSetup();
		oFF.XFileAccess.staticSetup();
		oFF.DataProviderType.staticSetup();
		oFF.DataProviderErrorType.staticSetupDataProvider();
		oFF.DataProviderActionParameterType.staticSetupExt();
		oFF.DfModule.stopExt(oFF.KernelApiModule.s_module);
	}
	return oFF.KernelApiModule.s_module;
};
oFF.KernelApiModule.prototype.getName = function()
{
	return "ff1000.kernel.api";
};

oFF.KernelApiModule.getInstance();

return oFF;
} );