/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff2100.runtime"
],
function(oFF)
{
"use strict";

oFF.OrcaFileRequestAdapter = function() {};
oFF.OrcaFileRequestAdapter.prototype = new oFF.XObject();
oFF.OrcaFileRequestAdapter.prototype._ff_c = "OrcaFileRequestAdapter";

oFF.OrcaFileRequestAdapter.create = function(callback)
{
	let adapter = new oFF.OrcaFileRequestAdapter();
	adapter.callback = callback;
	return adapter;
};
oFF.OrcaFileRequestAdapter.prototype.callback = null;
oFF.OrcaFileRequestAdapter.prototype.onHttpFileProcessed = function(extResult, data, customIdentifier)
{
	this.callback(extResult);
};

oFF.OrcaResourceConstants = {

	ACCESS:"access",
	ACTION:"action",
	ALLOW_AUTH_OVERRIDE:"allowAuthOverride",
	ANCESTOR_INFO:"ancestorInfo",
	ANCESTOR_PATH:"ancestorPath",
	ANCESTOR_RESOURCE:"ancestorResource",
	ASCENDING:"ascending",
	AUTH:"auth",
	AUTH_ASSIGN:"assign",
	AUTH_COMMENT_ADD:"comment_add",
	AUTH_COMMENT_DELETE:"comment_delete",
	AUTH_COMMENT_VIEW:"comment_view",
	AUTH_COPY:"copy",
	AUTH_CREATE_DOC:"create_doc",
	AUTH_CREATE_FOLDER:"create_folder",
	AUTH_DELETE:"delete",
	AUTH_MAINTAIN:"maintain",
	AUTH_READ:"read",
	AUTH_UPDATE:"update",
	CAN_SHARE:"canShare",
	CAPABILITY:"capability",
	CATALOG_VIRTUAL_FOLDER:"Catalog",
	CDATA:"cdata",
	CHANGED_BY_DISPLAY_NAME:"changedByDisplayName",
	CREATED_BY:"createdBy",
	CREATED_BY_DISPLAY_NAME:"createdByDisplayName",
	CREATED_BY_SEARCH_FILTER:"createdBy",
	CREATED_TIME:"createdTime",
	CREATE_CONTENT:"createContent",
	CREATE_FOLDER:"createFolder",
	CREATE_LINK:"create",
	CREATE_OPTIONS:"createOpt",
	DATA:"data",
	DATA_ANALYZER_ENHANCED_PROPERTY:"DRAGONFLY",
	DATA_ANALYZER_INFO:"DATA_ANALYZER_INFO",
	DATA_ANALYZER_LINK_END_NDOE:"endNode",
	DATA_ANALYZER_LINK_ID_PARAM:"id",
	DATA_ANALYZER_LINK_PATH_NODES:"nodes",
	DATA_ANALYZER_LINK_PATH_RESPONSE_END_NODE:"createdEndNode",
	DATA_ANALYZER_LINK_REQUEST_DATA:"requestData",
	DATA_ANALYZER_LINK_TYPE_PARAM:"type",
	DATA_ANAYZER_INFO_VALUE:"dataAnalyzerOptimizedMode",
	DEFAULT_INSIGHT_SAVE_FOLDER_PATH:"/MyFiles",
	DEPENDENT_OBJECTS:"dependentObjects",
	DESCENDING:"descending",
	DESCRIPTION:"description",
	DIRECTION:"direction",
	ENHANCED_PROPERTIES:"enhancedProperties",
	EPM_OBJECT_DATA:"epmObjectData",
	EXCEPTION_NOT_THROWN_FOR_NO_ACCESS:"exceptionNotThrownForNoAccess",
	EXISTING_RESOURCE:"existingResource",
	EXISTS:"exists",
	FAV_RES_ID:"favResId",
	FEATURED:"featured",
	FETCH_ENHANCED_PROPERTIES:"fetchEnhancedProperties",
	FILTER:"filter",
	FILTER_CREATED_BY:"CREATED_BY",
	FILTER_NOT_CREATED_BY:"NOT_CREATED_BY",
	FILTER_RESOURCE_TYPE:"RESOURCE_TYPE",
	GET_ACCESS_DETAILS:"getAccessDetails",
	GET_ANCESTOR_AND_SUB_NODES:"getAncestorAndSubNodes",
	GET_CONTENT:"getContent",
	GET_RECENT_FILES:"getRecentFiles",
	GET_REPO_VIEW:"getRepoView",
	GET_RESOURCE_EX:"getResourceEx",
	GET_RESOURCE_WITH_NAME_EXISTS:"getResourceWithNameExists",
	GET_SPACE_VIEW:"getSpaceView",
	GET_SUB_NODES:"getSubNodes",
	INCLUDE_SELF:"includeSelf",
	INCLUDE_TOTAL_RESOURCE_COUNT:"includeTotalResourceCount",
	INFO:"info",
	IS_REMOTE:"isRemote",
	IS_SHARED:"isShared",
	IS_TRANSLATION_CLASH:"isTranslationClash",
	KEY:"key",
	KEYWORD:"keyword",
	LIMIT:"limit",
	LINK_GENERATE_END_NODE:"generateEndNode",
	METADATA:"metadata",
	METADATA_DEFINITION:"metadataDefinition",
	MOBILE_SUPPORT:"mobileSupport",
	MODIFIED_BY:"modifiedBy",
	MODIFIED_BY_DISPLAY_NAME:"modifiedByDisplayName",
	MODIFIED_TIME:"modifiedTime",
	MY_FILES_DISPLAY_NAME:"My Files",
	MY_FILES_VIRTUAL_FOLDER:"MyFiles",
	NAME:"name",
	NOT_CREATED_BY_SEARCH_FILTER:"notCreatedBy",
	OBJECT_ID:"objectId",
	OFFSET:"offset",
	OPTIONS:"options",
	ORDER_BY:"orderBy",
	ORIG_LANGUAGE:"origLangu",
	OWNER_DISPLAY_NAME:"ownerDisplayName",
	OWNER_ID:"ownerId",
	OWNER_TYPE:"ownerType",
	O_OPTIONS:"oOpt",
	PACKAGE_ID:"packageId",
	PARENT_RESOURCE_IDS:"parentResourceIds",
	PARENT_RES_ID:"parentResId",
	PRIVATE_FOLDER_PREFIX:"PRIVATE_",
	PROPERTIES:"properties",
	PUBLISHED_READABLE:"publishedReadable",
	RECENTLY_ACCESSED:"recentlyAccessed",
	RECENT_FILES_DISPLAY_NAME:"Recent Files",
	RECENT_FILES_VIRTUAL_FOLDER:"RecentFiles",
	RECENT_FILES_VIRTUAL_FOLDER_PATH:"/RecentFiles",
	RENAME_RESOURCE:"renameResource",
	RESOURCES:"resources",
	RESOURCE_ID:"resourceId",
	RESOURCE_ID_INPUT_SCHEDULE:"INPUT_SCHEDULE",
	RESOURCE_ID_PUBLIC:"PUBLIC",
	RESOURCE_ID_ROOT:"ROOT",
	RESOURCE_ID_SAMPLES:"SAMPLES",
	RESOURCE_ID_SHARED:"SHARED",
	RESOURCE_ID_SPACE:"SPACE",
	RESOURCE_ID_SYSTEM:"SYSTEM",
	RESOURCE_ID_TEAMS:"TEAMS",
	RESOURCE_ID_USERS:"USERS",
	RESOURCE_ID_WORKSPACE:"WORKSPACE",
	RESOURCE_ID_WORKSPACE_SUFFIX:"PRIVATE_",
	RESOURCE_SUBTYPE:"resourceSubtype",
	RESOURCE_TYPE:"resourceType",
	RESOURCE_TYPES:"resourceTypes",
	RESOURCE_TYPES_EXTENDED:"resourceTypesExtended",
	RESOURCE_TYPE_CUBE:"CUBE",
	RESOURCE_TYPE_FOLDER:"FOLDER",
	RESOURCE_TYPE_INSIGHT:"INSIGHT",
	RESOURCE_TYPE_LINK:"LINK",
	RESOURCE_TYPE_MODEL:"MODEL",
	RESOURCE_TYPE_STORY:"STORY",
	REST_ENDPOINT:"/sap/fpa/services/rest/epm/contentlib",
	REST_LINK_ENDPOINT:"/sap/fpa/services/rest/fpa/linkpath/v1/",
	SEARCH_ALL_RESOURCES:"searchAllResources",
	SEARCH_CRITERIA:"searchCriteria",
	SEARCH_VALUE:"value",
	SET_USER_SHARE:"setUserShare",
	SHARE:"share",
	SHARED:"shared",
	SHARED_RES_ID:"shareResId",
	SHARED_TO_ANY:"sharedToAny",
	SORT:"sort",
	SORT_DEFINITION:"sortDefinition",
	SOURCE_RESOURCE:"sourceResource",
	SOURCE_RES_ID:"sourceResId",
	SPACE:"space",
	SPACE_ID:"spaceId",
	STAGE_DELETE_LIST:"stageDeleteList",
	SUB_NODES:"subNodes",
	TOTAL_RESOURCE_COUNT:"totalResourceCount",
	TRANSLATION_ENABLED:"translationEnabled",
	UPDATE_CONTENT:"updateContent",
	UPDATE_COUNTER:"updateCounter",
	UPDATE_OPTIONS:"updateOpt",
	VALUE:"value",
	WORKSPACE:"WORKSPACE",
	WORKSPACES_VIRTUAL_FOLDER:"Workspaces"
};

oFF.OrcaResponseParser = {

	generateFilesInPath:function(resource, fs, process, targetUri, propertyName)
	{
			let myFilesPath = oFF.XStringUtils.concatenate2("/", oFF.OrcaResourceConstants.MY_FILES_VIRTUAL_FOLDER);
		let myFilesUri = oFF.XUri.createFromFilePath(process, myFilesPath, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR, oFF.ProtocolType.FS_CONTENTLIB);
		let previousFolder = fs.getFileFromCache(myFilesUri);
		let ancestors = resource.getListByKey(oFF.XStringUtils.isNotNullAndNotEmpty(propertyName) ? propertyName : oFF.OrcaResourceConstants.ANCESTOR_RESOURCE);
		let actualPath = oFF.XStringUtils.concatenate3("/", previousFolder.getName(), "/");
		for (let y = 0; y < ancestors.size(); y++)
		{
			let ancestor = ancestors.get(y);
			let resourceId = ancestor.getStringByKey(oFF.OrcaResourceConstants.RESOURCE_ID);
			if (oFF.OrcaContentlibResourceUtils.isPrivateFolder(resourceId) || !oFF.OrcaContentlibResourceUtils.canFolderShowInUi(resourceId) || oFF.XString.isEqual(previousFolder.getName(), resourceId) || !oFF.OrcaContentlibResourceUtils.checkAuth(ancestor, oFF.OrcaResourceConstants.AUTH_READ))
			{
				continue;
			}
			let fileUri = oFF.XUri.createFromFilePath(process, actualPath, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR, oFF.ProtocolType.FS_CONTENTLIB);
			actualPath = oFF.XStringUtils.concatenate3(actualPath, resourceId, "/");
			oFF.OrcaFile.createFolder(ancestor, process, fs, fileUri, true);
		}
	},
	getFileListFromResponse:function(response, uri, process, fs, file)
	{
			let resources = null;
		let files = oFF.XList.create();
		if (response.getType() === oFF.PrElementType.STRUCTURE)
		{
			if (response.asStructure().containsKey(oFF.OrcaResourceConstants.SUB_NODES))
			{
				resources = response.asStructure().getListByKey(oFF.OrcaResourceConstants.SUB_NODES);
			}
			else if (response.asStructure().containsKey(oFF.OrcaResourceConstants.RESOURCES))
			{
				resources = response.asStructure().getListByKey(oFF.OrcaResourceConstants.RESOURCES);
			}
			else
			{
				files.add(oFF.OrcaFile.create(response.asStructure(), process, fs, uri));
			}
			files.addAll(oFF.OrcaResponseParser.parseList(resources, process, fs, uri, file));
		}
		else if (response.getType() === oFF.PrElementType.LIST)
		{
			files.addAll(oFF.OrcaResponseParser.parseList(response.asList(), process, fs, uri, file));
		}
		else
		{
			resources = response.asList();
			files = oFF.OrcaResponseParser.parseList(resources, process, fs, uri, file);
		}
		return files;
	},
	getTotalResourceCount:function(response)
	{
			let totalResourceCount = -1;
		if (response.getType() === oFF.PrElementType.STRUCTURE)
		{
			let containsInfo = response.asStructure().containsKey(oFF.OrcaResourceConstants.INFO);
			let info = response.asStructure().getStructureByKey(oFF.OrcaResourceConstants.INFO);
			totalResourceCount = containsInfo ? info.getIntegerByKey(oFF.OrcaResourceConstants.TOTAL_RESOURCE_COUNT) : -1;
		}
		return totalResourceCount;
	},
	parseList:function(resources, process, fs, uri, file)
	{
			let files = oFF.XList.create();
		let size = resources.size();
		for (let i = 0; i < size; i++)
		{
			let resourceElement = resources.get(i);
			if (resourceElement.isStructure())
			{
				files.add(oFF.OrcaFile.create(resourceElement, process, fs, uri));
				let propertyName = null;
				if (oFF.notNull(file) && oFF.XString.isEqual(file.getName(), oFF.OrcaResourceConstants.RECENT_FILES_VIRTUAL_FOLDER))
				{
					propertyName = oFF.OrcaResourceConstants.ANCESTOR_PATH;
				}
				oFF.OrcaResponseParser.generateFilesInPath(resourceElement, fs, process, uri, propertyName);
			}
		}
		return files;
	}
};

oFF.ContentlibQueryData = function() {};
oFF.ContentlibQueryData.prototype = new oFF.XObjectExt();
oFF.ContentlibQueryData.prototype._ff_c = "ContentlibQueryData";

oFF.ContentlibQueryData.create = function(builder)
{
	let data = new oFF.ContentlibQueryData();
	data.m_targetName = builder.getTargetName();
	data.m_resourceType = builder.getResourceType();
	data.m_content = builder.getContent();
	data.m_resourceIds = builder.getResourceIds();
	data.m_file = builder.getFile();
	data.m_queryConfig = builder.getQueryConfig();
	data.m_privateFolder = builder.getPrivateFolder();
	data.m_accessState = builder.getAccessState();
	data.m_sendEmailNotification = builder.getSendEmailNotification();
	data.m_isAllUsersWithExistingAccess = builder.getIsAllUsersWithExistingAccess();
	data.m_interopLinkParameters = builder.getLinkParameters();
	return data;
};
oFF.ContentlibQueryData.prototype.m_accessState = null;
oFF.ContentlibQueryData.prototype.m_content = null;
oFF.ContentlibQueryData.prototype.m_file = null;
oFF.ContentlibQueryData.prototype.m_interopLinkParameters = null;
oFF.ContentlibQueryData.prototype.m_isAllUsersWithExistingAccess = false;
oFF.ContentlibQueryData.prototype.m_privateFolder = null;
oFF.ContentlibQueryData.prototype.m_queryConfig = null;
oFF.ContentlibQueryData.prototype.m_resourceIds = null;
oFF.ContentlibQueryData.prototype.m_resourceType = null;
oFF.ContentlibQueryData.prototype.m_sendEmailNotification = false;
oFF.ContentlibQueryData.prototype.m_targetName = null;
oFF.ContentlibQueryData.prototype.appendLinkPayloadAndReturnContentlibStruct = function(mainQueryObject)
{
	mainQueryObject.putString(oFF.OrcaResourceConstants.ACTION, oFF.OrcaResourceConstants.CREATE_LINK);
	let data = mainQueryObject.putNewStructure(oFF.OrcaResourceConstants.DATA);
	data.putBoolean(oFF.OrcaResourceConstants.LINK_GENERATE_END_NODE, true);
	let nodeList = data.putNewList(oFF.OrcaResourceConstants.DATA_ANALYZER_LINK_PATH_NODES);
	let storyNode = nodeList.addNewStructure();
	storyNode.putString(oFF.OrcaResourceConstants.DATA_ANALYZER_LINK_ID_PARAM, this.m_interopLinkParameters.getStoryId());
	storyNode.putString(oFF.OrcaResourceConstants.DATA_ANALYZER_LINK_TYPE_PARAM, oFF.OrcaResourceConstants.RESOURCE_TYPE_STORY);
	let widgetNode = nodeList.addNewStructure();
	widgetNode.putString(oFF.OrcaResourceConstants.DATA_ANALYZER_LINK_ID_PARAM, this.m_interopLinkParameters.getWidgetId());
	widgetNode.putString(oFF.OrcaResourceConstants.DATA_ANALYZER_LINK_TYPE_PARAM, this.m_interopLinkParameters.getWidgetType());
	let modelNode = nodeList.addNewStructure();
	modelNode.putString(oFF.OrcaResourceConstants.DATA_ANALYZER_LINK_ID_PARAM, this.m_interopLinkParameters.getDatasourceId());
	modelNode.putString(oFF.OrcaResourceConstants.DATA_ANALYZER_LINK_TYPE_PARAM, oFF.OrcaResourceConstants.RESOURCE_TYPE_MODEL);
	let terminalNode = data.putNewStructure(oFF.OrcaResourceConstants.DATA_ANALYZER_LINK_END_NDOE);
	terminalNode.putString(oFF.OrcaResourceConstants.DATA_ANALYZER_LINK_TYPE_PARAM, oFF.OrcaResourceConstants.RESOURCE_TYPE_INSIGHT);
	return terminalNode.putNewStructure(oFF.OrcaResourceConstants.DATA_ANALYZER_LINK_REQUEST_DATA);
};
oFF.ContentlibQueryData.prototype.createLink = function()
{
	return oFF.notNull(this.m_interopLinkParameters);
};
oFF.ContentlibQueryData.prototype.getAccessState = function()
{
	return this.m_accessState;
};
oFF.ContentlibQueryData.prototype.getContent = function()
{
	return this.m_content;
};
oFF.ContentlibQueryData.prototype.getFile = function()
{
	return this.m_file;
};
oFF.ContentlibQueryData.prototype.getIsAllUsersWithExistingAccess = function()
{
	return this.m_isAllUsersWithExistingAccess;
};
oFF.ContentlibQueryData.prototype.getPrivateFolder = function()
{
	return this.m_privateFolder;
};
oFF.ContentlibQueryData.prototype.getQueryConfig = function()
{
	return this.m_queryConfig;
};
oFF.ContentlibQueryData.prototype.getResourceIds = function()
{
	return this.m_resourceIds;
};
oFF.ContentlibQueryData.prototype.getResourceType = function()
{
	return this.m_resourceType;
};
oFF.ContentlibQueryData.prototype.getSendEmailNotification = function()
{
	return this.m_sendEmailNotification;
};
oFF.ContentlibQueryData.prototype.getTargetName = function()
{
	return this.m_targetName;
};

oFF.ContentlibQueryDataBuilder = function() {};
oFF.ContentlibQueryDataBuilder.prototype = new oFF.XObjectExt();
oFF.ContentlibQueryDataBuilder.prototype._ff_c = "ContentlibQueryDataBuilder";

oFF.ContentlibQueryDataBuilder.create = function()
{
	let builder = new oFF.ContentlibQueryDataBuilder();
	return builder;
};
oFF.ContentlibQueryDataBuilder.prototype.m_accessState = null;
oFF.ContentlibQueryDataBuilder.prototype.m_content = null;
oFF.ContentlibQueryDataBuilder.prototype.m_file = null;
oFF.ContentlibQueryDataBuilder.prototype.m_interopLinkParameters = null;
oFF.ContentlibQueryDataBuilder.prototype.m_isAllUsersWithExistingAccess = false;
oFF.ContentlibQueryDataBuilder.prototype.m_privateFolder = null;
oFF.ContentlibQueryDataBuilder.prototype.m_queryConfig = null;
oFF.ContentlibQueryDataBuilder.prototype.m_resourceIds = null;
oFF.ContentlibQueryDataBuilder.prototype.m_resourceType = null;
oFF.ContentlibQueryDataBuilder.prototype.m_sendEmailNotification = false;
oFF.ContentlibQueryDataBuilder.prototype.m_targetName = null;
oFF.ContentlibQueryDataBuilder.prototype.build = function()
{
	return oFF.ContentlibQueryData.create(this);
};
oFF.ContentlibQueryDataBuilder.prototype.getAccessState = function()
{
	return this.m_accessState;
};
oFF.ContentlibQueryDataBuilder.prototype.getContent = function()
{
	return this.m_content;
};
oFF.ContentlibQueryDataBuilder.prototype.getFile = function()
{
	return this.m_file;
};
oFF.ContentlibQueryDataBuilder.prototype.getIsAllUsersWithExistingAccess = function()
{
	return this.m_isAllUsersWithExistingAccess;
};
oFF.ContentlibQueryDataBuilder.prototype.getLinkParameters = function()
{
	return this.m_interopLinkParameters;
};
oFF.ContentlibQueryDataBuilder.prototype.getPrivateFolder = function()
{
	return this.m_privateFolder;
};
oFF.ContentlibQueryDataBuilder.prototype.getQueryConfig = function()
{
	return this.m_queryConfig;
};
oFF.ContentlibQueryDataBuilder.prototype.getResourceIds = function()
{
	return this.m_resourceIds;
};
oFF.ContentlibQueryDataBuilder.prototype.getResourceType = function()
{
	return this.m_resourceType;
};
oFF.ContentlibQueryDataBuilder.prototype.getSendEmailNotification = function()
{
	return this.m_sendEmailNotification;
};
oFF.ContentlibQueryDataBuilder.prototype.getTargetName = function()
{
	return this.m_targetName;
};
oFF.ContentlibQueryDataBuilder.prototype.setAccessState = function(accessState)
{
	this.m_accessState = accessState;
	return this;
};
oFF.ContentlibQueryDataBuilder.prototype.setContent = function(content)
{
	this.m_content = content;
	return this;
};
oFF.ContentlibQueryDataBuilder.prototype.setFile = function(file)
{
	this.m_file = file;
	return this;
};
oFF.ContentlibQueryDataBuilder.prototype.setIsAllUsersWithExistingAccess = function(isAllUsersWithExistingAccess)
{
	this.m_isAllUsersWithExistingAccess = isAllUsersWithExistingAccess;
	return this;
};
oFF.ContentlibQueryDataBuilder.prototype.setLinkParameters = function(fileAttrs)
{
	if (oFF.notNull(fileAttrs) && fileAttrs.containsKey(oFF.XFileAttribute.SAC_INTEROP_STORY_ID))
	{
		this.m_interopLinkParameters = oFF.LinkPathParameters.createFromFileAttrs(fileAttrs);
	}
	return this;
};
oFF.ContentlibQueryDataBuilder.prototype.setPrivateFolder = function(privateFolder)
{
	this.m_privateFolder = privateFolder;
	return this;
};
oFF.ContentlibQueryDataBuilder.prototype.setQueryConfig = function(queryConfig)
{
	this.m_queryConfig = queryConfig;
	return this;
};
oFF.ContentlibQueryDataBuilder.prototype.setResourceIds = function(resourceIds)
{
	this.m_resourceIds = resourceIds;
	return this;
};
oFF.ContentlibQueryDataBuilder.prototype.setResourceType = function(resourceType)
{
	this.m_resourceType = resourceType;
	return this;
};
oFF.ContentlibQueryDataBuilder.prototype.setSendEmailNotification = function(setEmailNotification)
{
	this.m_sendEmailNotification = setEmailNotification;
	return this;
};
oFF.ContentlibQueryDataBuilder.prototype.setTargetName = function(targetName)
{
	this.m_targetName = targetName;
	return this;
};

oFF.LinkPathParameters = function() {};
oFF.LinkPathParameters.prototype = new oFF.XObjectExt();
oFF.LinkPathParameters.prototype._ff_c = "LinkPathParameters";

oFF.LinkPathParameters.createFromFileAttrs = function(fileAttrs)
{
	let result = new oFF.LinkPathParameters();
	result.m_storyId = fileAttrs.getStringByKey(oFF.XFileAttribute.SAC_INTEROP_STORY_ID);
	result.m_widgetId = fileAttrs.getStructureReadOnlyByKey(oFF.XFileAttribute.SAC_INTEROP_WIDGET_ID).getStringByKey("id");
	result.m_widgetType = fileAttrs.getStructureReadOnlyByKey(oFF.XFileAttribute.SAC_INTEROP_WIDGET_ID).getStringByKey("type");
	result.m_datasourceId = fileAttrs.getStringByKey(oFF.XFileAttribute.SAC_INTEROP_DATASOURCE_ID);
	return result;
};
oFF.LinkPathParameters.prototype.m_datasourceId = null;
oFF.LinkPathParameters.prototype.m_storyId = null;
oFF.LinkPathParameters.prototype.m_widgetId = null;
oFF.LinkPathParameters.prototype.m_widgetType = null;
oFF.LinkPathParameters.prototype.getDatasourceId = function()
{
	return this.m_datasourceId;
};
oFF.LinkPathParameters.prototype.getStoryId = function()
{
	return this.m_storyId;
};
oFF.LinkPathParameters.prototype.getWidgetId = function()
{
	return this.m_widgetId;
};
oFF.LinkPathParameters.prototype.getWidgetType = function()
{
	return this.m_widgetType;
};

oFF.MetadataRequestGenerator = function() {};
oFF.MetadataRequestGenerator.prototype = new oFF.XObjectExt();
oFF.MetadataRequestGenerator.prototype._ff_c = "MetadataRequestGenerator";

oFF.MetadataRequestGenerator.create = function()
{
	let generator = new oFF.MetadataRequestGenerator();
	return generator;
};
oFF.MetadataRequestGenerator.prototype.addMetadataRequest = function(queryPayload, propertyName, file)
{
	let metadataDefinition = queryPayload.putNewStructure(propertyName);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.NAME, true);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.DESCRIPTION, true);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.OWNER_ID, true);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.OWNER_TYPE, true);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.CREATED_TIME, true);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.CREATED_BY, true);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.MODIFIED_BY, true);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.MODIFIED_TIME, true);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.RESOURCE_TYPE, true);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.RESOURCE_SUBTYPE, true);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.RESOURCE_ID, true);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.PARENT_RES_ID, true);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.SOURCE_RES_ID, true);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.SOURCE_RESOURCE, true);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.MOBILE_SUPPORT, true);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.ACCESS, true);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.UPDATE_COUNTER, true);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.IS_REMOTE, true);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.CAPABILITY, true);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.AUTH, true);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.PACKAGE_ID, true);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.PROPERTIES, true);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.ORIG_LANGUAGE, true);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.TRANSLATION_ENABLED, true);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.FEATURED, true);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.FAV_RES_ID, true);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.SHARED, true);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.SHARED_RES_ID, true);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.EXCEPTION_NOT_THROWN_FOR_NO_ACCESS, true);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.EPM_OBJECT_DATA, false);
	metadataDefinition.putBoolean(oFF.OrcaResourceConstants.OBJECT_ID, true);
	metadataDefinition.putBoolean("userAuthOnly", true);
	if (oFF.notNull(file))
	{
		let resourceId = file.getProviderMetadata().getStringByKey(oFF.XFileAttribute.UNIQUE_ID);
		let isRecentFilesFolder = oFF.XString.isEqual(resourceId, oFF.OrcaResourceConstants.RECENT_FILES_VIRTUAL_FOLDER);
		if (isRecentFilesFolder)
		{
			let ancestorPath = metadataDefinition.putNewStructure(oFF.OrcaResourceConstants.ANCESTOR_PATH);
			ancestorPath.putBoolean(oFF.OrcaResourceConstants.NAME, true);
			ancestorPath.putBoolean(oFF.OrcaResourceConstants.DESCRIPTION, true);
			ancestorPath.putBoolean(oFF.OrcaResourceConstants.SPACE_ID, true);
			ancestorPath.putBoolean(oFF.OrcaResourceConstants.ACCESS, true);
			ancestorPath.putBoolean(oFF.OrcaResourceConstants.PARENT_RES_ID, true);
			ancestorPath.putBoolean(oFF.OrcaResourceConstants.OWNER_TYPE, true);
			ancestorPath.putBoolean(oFF.OrcaResourceConstants.RESOURCE_TYPE, true);
			ancestorPath.putBoolean(oFF.OrcaResourceConstants.AUTH, true);
		}
		else
		{
			metadataDefinition.putBoolean(oFF.OrcaResourceConstants.ANCESTOR_INFO, true);
		}
	}
	else
	{
		metadataDefinition.putBoolean(oFF.OrcaResourceConstants.ANCESTOR_INFO, true);
	}
	let enhancedProperties = metadataDefinition.putNewList(oFF.OrcaResourceConstants.ENHANCED_PROPERTIES);
	enhancedProperties.addString(oFF.OrcaResourceConstants.DATA_ANALYZER_INFO);
};

oFF.QueryFilterGenerator = function() {};
oFF.QueryFilterGenerator.prototype = new oFF.XObjectExt();
oFF.QueryFilterGenerator.prototype._ff_c = "QueryFilterGenerator";

oFF.QueryFilterGenerator.create = function()
{
	let generator = new oFF.QueryFilterGenerator();
	return generator;
};
oFF.QueryFilterGenerator.prototype.addFilter = function(payload, config)
{
	if (oFF.notNull(config))
	{
		let filters = config.getCartesianFilter();
		if (oFF.isNull(filters) || filters.size() === 0)
		{
			return;
		}
		let data = payload.getStructureByKey(oFF.OrcaResourceConstants.DATA);
		let filterList = data.putNewList(oFF.OrcaResourceConstants.FILTER);
		let supportedFilters = this.getSupportedFilters(filters);
		for (let i = 0; i < supportedFilters.size(); i++)
		{
			filterList.add(this.getContentlibFilter(supportedFilters.get(i)));
		}
	}
};
oFF.QueryFilterGenerator.prototype.getContentlibFilter = function(fileFilter)
{
	let contentlibFilter = oFF.PrFactory.createStructure();
	if (oFF.XString.isEqual(oFF.XFileAttribute.NODE_TYPE, fileFilter.getName()))
	{
		contentlibFilter.putString(oFF.OrcaResourceConstants.KEYWORD, oFF.OrcaResourceConstants.FILTER_RESOURCE_TYPE);
		contentlibFilter.putString(oFF.OrcaResourceConstants.VALUE, fileFilter.getValue());
	}
	else if (oFF.XString.isEqual(oFF.XFileAttribute.CREATED_BY, fileFilter.getName()))
	{
		let keyword = oFF.XString.isEqual(fileFilter.getType().getName(), oFF.XFileFilterType.NOT.getName()) ? oFF.OrcaResourceConstants.FILTER_NOT_CREATED_BY : oFF.OrcaResourceConstants.FILTER_CREATED_BY;
		contentlibFilter.putString(oFF.OrcaResourceConstants.KEYWORD, keyword);
		contentlibFilter.putString(oFF.OrcaResourceConstants.VALUE, fileFilter.getValue());
	}
	return contentlibFilter;
};
oFF.QueryFilterGenerator.prototype.getSupportedFilters = function(filters)
{
	let supportedFilters = oFF.XList.create();
	let addedFolder = false;
	let addedResourceTypeFilter = false;
	let supportedContentlibFilters = oFF.OrcaContentlibResourceUtils.getSupportedFilterMetadata();
	let supportedFilterAttributes = supportedContentlibFilters.getKeysAsReadOnlyList();
	for (let i = 0; i < filters.size(); i++)
	{
		let currentFilter = filters.get(i);
		if (!supportedFilterAttributes.contains(currentFilter.getName()))
		{
			continue;
		}
		else
		{
			let supportedFilterElement = supportedContentlibFilters.getStructureByKey(currentFilter.getName());
			let supportedFilterElementTypes = supportedFilterElement.getListByKey(oFF.XFileAttribute.SUPPORTED_FILTER_TYPES);
			let filterType = oFF.PrFactory.createString(currentFilter.getType().getName());
			if (supportedFilterElementTypes.contains(filterType))
			{
				supportedFilters.add(currentFilter);
				if (oFF.XString.isEqual(oFF.OrcaResourceConstants.RESOURCE_TYPE_FOLDER, currentFilter.getValue()))
				{
					addedFolder = true;
				}
				if (oFF.XString.isEqual(oFF.XFileAttribute.NODE_TYPE, currentFilter.getName()))
				{
					addedResourceTypeFilter = true;
				}
			}
		}
	}
	if (!addedFolder && addedResourceTypeFilter && supportedFilters.size() > 0)
	{
		let folderFilter = oFF.XFileFilterElement.create(oFF.XFileAttributeDef.NODE_TYPE, oFF.PrFactory.createStructure());
		folderFilter.setType(oFF.XFileFilterType.EXACT);
		folderFilter.setValue(oFF.OrcaResourceConstants.RESOURCE_TYPE_FOLDER);
		supportedFilters.add(folderFilter);
	}
	return supportedFilters;
};

oFF.QueryOptionsGenerator = function() {};
oFF.QueryOptionsGenerator.prototype = new oFF.XObjectExt();
oFF.QueryOptionsGenerator.prototype._ff_c = "QueryOptionsGenerator";

oFF.QueryOptionsGenerator.create = function()
{
	let generator = new oFF.QueryOptionsGenerator();
	return generator;
};
oFF.QueryOptionsGenerator.prototype.addOptions = function(payload, config, optionsPropertyName, resourceType)
{
	let data = payload.getStructureByKey(oFF.OrcaResourceConstants.DATA);
	let options = data.putNewStructure(optionsPropertyName);
	let enhancedProperties = options.putNewList(oFF.OrcaResourceConstants.FETCH_ENHANCED_PROPERTIES);
	enhancedProperties.addString(oFF.OrcaResourceConstants.DATA_ANALYZER_INFO);
	if (oFF.notNull(config))
	{
		if (config.getMaxItems() > -1)
		{
			options.putInteger(oFF.OrcaResourceConstants.LIMIT, config.getMaxItems());
			if (config.getOffset() > -1)
			{
				options.putInteger(oFF.OrcaResourceConstants.OFFSET, config.getOffset());
			}
			else
			{
				options.putInteger(oFF.OrcaResourceConstants.OFFSET, 0);
			}
		}
		if (config.getSingleSortDef() !== null)
		{
			let sort = options.putNewStructure(oFF.OrcaResourceConstants.SORT);
			sort.putString(oFF.OrcaResourceConstants.KEY, oFF.OrcaContentlibResourceUtils.getContentlibAttributeFromFileAttribute(config.getSingleSortDef().getAttributeName()));
			let direction = config.getSingleSortDef().getDirection();
			sort.putBoolean(oFF.OrcaResourceConstants.DESCENDING, direction === oFF.XSortDirection.DESCENDING);
		}
	}
	options.putBoolean(oFF.OrcaResourceConstants.INCLUDE_TOTAL_RESOURCE_COUNT, true);
	this.setTypeOptions(options, resourceType);
};
oFF.QueryOptionsGenerator.prototype.setTypeOptions = function(options, resourceType)
{
	if (oFF.isNull(resourceType))
	{
		return;
	}
	if (oFF.XString.isEqual(oFF.OrcaResourceConstants.RESOURCE_TYPE_CUBE, resourceType))
	{
		options.putBoolean("addMetadata", false);
		options.putBoolean("addLastUpdated", true);
		options.putBoolean("detail", true);
		options.putBoolean("visualization", true);
		options.putBoolean("rate", true);
		options.putBoolean("listFormula", true);
		options.putBoolean("listVersion", true);
		options.putBoolean("inclSubObjectTypes", true);
		options.putBoolean("planningFeatures", true);
		options.putBoolean("translateCustomizedDescription", true);
		let planning = options.putNewStructure("planning");
		planning.putBoolean("checks", true);
		options.putBoolean("needDimensionValidationRules", true);
	}
};

oFF.AncestorsAndSubNodes = function() {};
oFF.AncestorsAndSubNodes.prototype = new oFF.XObjectExt();
oFF.AncestorsAndSubNodes.prototype._ff_c = "AncestorsAndSubNodes";

oFF.AncestorsAndSubNodes.create = function(filterGenerator, optionsGenerator)
{
	let query = new oFF.AncestorsAndSubNodes();
	query.m_filterGenerator = filterGenerator;
	query.m_optionsGenerator = optionsGenerator;
	return query;
};
oFF.AncestorsAndSubNodes.prototype.m_filterGenerator = null;
oFF.AncestorsAndSubNodes.prototype.m_optionsGenerator = null;
oFF.AncestorsAndSubNodes.prototype.getPayload = function(queryData)
{
	if (oFF.isNull(queryData))
	{
		throw oFF.XException.createIllegalArgumentException("Query Data is required so that the ancestors and subnodes of the folder can be fetched");
	}
	if (queryData.getFile() === null)
	{
		throw oFF.XException.createIllegalArgumentException("A file object must be provided so that the getAncestorAndSubNodes query can be generated");
	}
	if (!queryData.getFile().isDirectory())
	{
		throw oFF.XException.createIllegalArgumentException("You cannot do a getAncestorsAndSubNodes call on a normal file, only a folder");
	}
	let folderId = queryData.getFile().getProviderMetadata().getStringByKey(oFF.XFileAttribute.UNIQUE_ID);
	if (oFF.XStringUtils.isNullOrEmpty(folderId))
	{
		throw oFF.XException.createIllegalArgumentException("A non-null and non empty resource id must be provided for the folder when running the getAncestorAndSubNodes query");
	}
	let queryObject = oFF.PrFactory.createStructure();
	queryObject.putString(oFF.OrcaResourceConstants.ACTION, oFF.OrcaResourceConstants.GET_ANCESTOR_AND_SUB_NODES);
	let data = queryObject.putNewStructure(oFF.OrcaResourceConstants.DATA);
	data.putString(oFF.OrcaResourceConstants.RESOURCE_ID, folderId);
	data.putBoolean("detail", false);
	data.putNewList("filter");
	data.putBoolean("bIncTemporary", true);
	data.putBoolean("allowAuthOverride", false);
	data.putBoolean("fetchAncestorNodes", true);
	data.putBoolean("showContentSharedWithUser", true);
	this.m_optionsGenerator.addOptions(queryObject, queryData.getQueryConfig(), oFF.OrcaResourceConstants.OPTIONS, null);
	this.m_filterGenerator.addFilter(queryObject, queryData.getQueryConfig());
	return queryObject;
};

oFF.CreateContent = function() {};
oFF.CreateContent.prototype = new oFF.XObjectExt();
oFF.CreateContent.prototype._ff_c = "CreateContent";

oFF.CreateContent.create = function(resolver)
{
	let query = new oFF.CreateContent();
	query.m_resolver = resolver;
	return query;
};
oFF.CreateContent.prototype.m_resolver = null;
oFF.CreateContent.prototype.appendContentlibPayload = function(queryData, queryObject)
{
	let file = queryData.getFile();
	let contentStructure = queryData.getContent().getJsonContent().asStructure();
	let jsonString = oFF.PrUtils.serialize(contentStructure, true, false, 0);
	queryObject.putString(oFF.OrcaResourceConstants.ACTION, oFF.OrcaResourceConstants.CREATE_CONTENT);
	let data = queryObject.putNewStructure(oFF.OrcaResourceConstants.DATA);
	let parentResId = file.getProviderMetadata().getStringByKeyExt(oFF.XFileAttribute.PARENT_UNIQUE_ID, file.getProviderParent().getName());
	let resolvedParentResId = this.m_resolver.resolveParentId(parentResId, file.getFsBase().getPrivateFolderName());
	if (oFF.XStringUtils.isNullOrEmpty(resolvedParentResId))
	{
		throw oFF.XException.createIllegalArgumentException("A parent resource id must be provided so that the file can be saved in a known folder.");
	}
	data.putString(oFF.OrcaResourceConstants.PARENT_RES_ID, resolvedParentResId);
	let resourceType = oFF.XStringUtils.isNullOrEmpty(queryData.getResourceType()) ? queryData.getResourceType() : file.getProviderMetadata().getStringByKey(oFF.XFileAttribute.NODE_TYPE);
	data.putString(oFF.OrcaResourceConstants.RESOURCE_TYPE, resourceType);
	if (file.getProviderMetadata().containsKey(oFF.XFileAttribute.NODE_SUB_TYPE))
	{
		data.putString(oFF.OrcaResourceConstants.RESOURCE_SUBTYPE, file.getProviderMetadata().getStringByKey(oFF.XFileAttribute.NODE_SUB_TYPE));
	}
	data.putString(oFF.OrcaResourceConstants.NAME, file.getName());
	data.putString(oFF.OrcaResourceConstants.DESCRIPTION, file.getProviderMetadata().getStringByKey(oFF.XFileAttribute.DESCRIPTION));
	data.putString(oFF.OrcaResourceConstants.CDATA, jsonString);
	if (oFF.XString.isEqual(oFF.OrcaResourceConstants.RESOURCE_TYPE_INSIGHT, file.getProviderMetadata().getStringByKeyExt(oFF.XFileAttribute.NODE_SUB_TYPE, null)))
	{
		let createOpt = data.putNewStructure(oFF.OrcaResourceConstants.CREATE_OPTIONS);
		let enhancedProperties = createOpt.putNewStructure(oFF.OrcaResourceConstants.ENHANCED_PROPERTIES);
		enhancedProperties.putString(oFF.OrcaResourceConstants.DATA_ANALYZER_INFO, oFF.OrcaResourceConstants.DATA_ANALYZER_ENHANCED_PROPERTY);
	}
};
oFF.CreateContent.prototype.getPayload = function(queryData)
{
	if (oFF.isNull(queryData))
	{
		throw oFF.XException.createIllegalArgumentException("Query Data is required so that the content can be fetched for the given file");
	}
	if (queryData.getFile() === null)
	{
		throw oFF.XException.createIllegalArgumentException("An orca file object is required so that the content can be fetched for the given file");
	}
	if (queryData.getFile().isDirectory())
	{
		throw oFF.XException.createIllegalArgumentException("You cannot do a createContent call on a folder");
	}
	if (queryData.getContent() === null)
	{
		throw oFF.XException.createIllegalArgumentException("Content must be provided so that the file can be saved");
	}
	let queryObject = oFF.PrFactory.createStructure();
	if (queryData.createLink())
	{
		let contentlibStruct = queryData.appendLinkPayloadAndReturnContentlibStruct(queryObject);
		this.appendContentlibPayload(queryData, contentlibStruct);
	}
	else
	{
		this.appendContentlibPayload(queryData, queryObject);
	}
	return queryObject;
};

oFF.CreateFolder = function() {};
oFF.CreateFolder.prototype = new oFF.XObjectExt();
oFF.CreateFolder.prototype._ff_c = "CreateFolder";

oFF.CreateFolder.create = function(resolver)
{
	let query = new oFF.CreateFolder();
	query.m_resolver = resolver;
	return query;
};
oFF.CreateFolder.prototype.m_resolver = null;
oFF.CreateFolder.prototype.getPayload = function(queryData)
{
	if (oFF.isNull(queryData))
	{
		throw oFF.XException.createIllegalArgumentException("Query Data is required so that the folder can be created");
	}
	let file = queryData.getFile();
	if (oFF.isNull(file))
	{
		throw oFF.XException.createIllegalArgumentException("An orca file object is required for syncing (creating) the in-memory object against the backend");
	}
	let parent = file.getProviderParent();
	let parentId = parent.getProviderMetadata().getStringByKeyExt(oFF.XFileAttribute.UNIQUE_ID, file.getProviderParent().getName());
	let folderName = file.getProviderMetadata().getStringByKeyExt(oFF.XFileAttribute.DISPLAY_NAME, file.getName());
	let description = file.getProviderMetadata().getStringByKeyExt(oFF.XFileAttribute.DESCRIPTION, "");
	let queryObject = oFF.PrFactory.createStructure();
	queryObject.putString(oFF.OrcaResourceConstants.ACTION, oFF.OrcaResourceConstants.CREATE_FOLDER);
	let data = queryObject.putNewStructure(oFF.OrcaResourceConstants.DATA);
	let resolvedParentResId = this.m_resolver.resolveParentId(parentId, file.getFsBase().getPrivateFolderName());
	if (oFF.XStringUtils.isNullOrEmpty(resolvedParentResId))
	{
		throw oFF.XException.createIllegalArgumentException("A non-empty, and non null parent resource id is required for the createFolder query");
	}
	if (oFF.XStringUtils.isNullOrEmpty(folderName))
	{
		throw oFF.XException.createIllegalArgumentException("A non-empty, and non null name is required for the createFolder query");
	}
	data.putString(oFF.OrcaResourceConstants.PARENT_RES_ID, resolvedParentResId);
	data.putString(oFF.OrcaResourceConstants.NAME, folderName);
	data.putString(oFF.OrcaResourceConstants.DESCRIPTION, description);
	return queryObject;
};

oFF.GetAccessDetails = function() {};
oFF.GetAccessDetails.prototype = new oFF.XObjectExt();
oFF.GetAccessDetails.prototype._ff_c = "GetAccessDetails";

oFF.GetAccessDetails.create = function()
{
	let query = new oFF.GetAccessDetails();
	return query;
};
oFF.GetAccessDetails.prototype.getPayload = function(queryData)
{
	if (oFF.isNull(queryData))
	{
		throw oFF.XException.createIllegalArgumentException("Query Data is required so we can get access rights of a file");
	}
	let file = queryData.getFile();
	if (oFF.isNull(file))
	{
		throw oFF.XException.createIllegalArgumentException("An orca file object is required so that we can get access rights on it from the backend");
	}
	let resourceId = file.getProviderMetadata().getStringByKey(oFF.XFileAttribute.UNIQUE_ID);
	if (oFF.XStringUtils.isNullOrEmpty(resourceId))
	{
		throw oFF.XException.createIllegalArgumentException("A resource id is required when fetching access rights on a file in contentlib");
	}
	let queryObject = oFF.PrFactory.createStructure();
	queryObject.putString("action", "getAccessDetails");
	let dataStruct = queryObject.putNewStructure("data");
	let resId = dataStruct.putNewList("resourceIds");
	resId.addString(resourceId);
	let queryParams = dataStruct.putNewStructure("queryParameters");
	let paginationConfig = queryData.getQueryConfig();
	if (oFF.notNull(paginationConfig))
	{
		queryParams.putInteger("offset", paginationConfig.getOffset());
		queryParams.putInteger("limit", paginationConfig.getMaxItems());
		if (paginationConfig.getSearchValue() !== null)
		{
			queryParams.putString("name", paginationConfig.getSearchValue());
		}
		else
		{
			queryParams.putString("name", "");
		}
	}
	else
	{
		queryParams.putInteger("offset", 0);
		queryParams.putString("name", "");
	}
	let spaces = dataStruct.putNewList("spaces");
	spaces.addString("");
	let options = dataStruct.putNewStructure("options");
	let types = options.putNewStructure("localizedTypeStrings");
	types.putString("team", "Team");
	types.putString("space", "SPACE");
	options.putBoolean("principalAuthOverride", true);
	options.putNewList("excludeUserIds");
	return queryObject;
};

oFF.GetContent = function() {};
oFF.GetContent.prototype = new oFF.XObjectExt();
oFF.GetContent.prototype._ff_c = "GetContent";

oFF.GetContent.create = function(optionsGenerator)
{
	let query = new oFF.GetContent();
	query.m_optionsGenerator = optionsGenerator;
	return query;
};
oFF.GetContent.prototype.m_optionsGenerator = null;
oFF.GetContent.prototype.getPayload = function(queryData)
{
	if (oFF.isNull(queryData))
	{
		throw oFF.XException.createIllegalArgumentException("Query Data is required so that the content can be fetched");
	}
	let file = queryData.getFile();
	if (oFF.isNull(file))
	{
		throw oFF.XException.createIllegalArgumentException("An orca file object is required so that the content can be fetched for the given file");
	}
	if (file.isDirectory())
	{
		throw oFF.XException.createIllegalArgumentException("You cannot fetch the content of a folder");
	}
	let resourceTypeForQuery = file.getProviderMetadata().getStringByKey(oFF.XFileAttribute.NODE_TYPE);
	let isLinkResource = oFF.XString.isEqual(oFF.OrcaResourceConstants.RESOURCE_TYPE_LINK, resourceTypeForQuery);
	let resourceId = file.getName();
	if (isLinkResource)
	{
		resourceId = file.getLinkedFile().getName();
		resourceTypeForQuery = file.getLinkedFile().getProviderMetadata().getStringByKey(oFF.XFileAttribute.NODE_TYPE);
		file = file.getLinkedFile();
	}
	if (oFF.XStringUtils.isNullOrEmpty(resourceId))
	{
		throw oFF.XException.createIllegalArgumentException("A resource id is required for running the getContent call");
	}
	let queryObject = oFF.PrFactory.createStructure();
	queryObject.putString(oFF.OrcaResourceConstants.ACTION, oFF.OrcaResourceConstants.GET_CONTENT);
	let data = queryObject.putNewStructure(oFF.OrcaResourceConstants.DATA);
	data.putString(oFF.OrcaResourceConstants.RESOURCE_ID, resourceId);
	data.putString(oFF.OrcaResourceConstants.RESOURCE_TYPE, resourceTypeForQuery);
	data.putBoolean("bIncDependency", true);
	this.m_optionsGenerator.addOptions(queryObject, null, oFF.OrcaResourceConstants.O_OPTIONS, resourceTypeForQuery);
	return queryObject;
};

oFF.GetResourceEx = function() {};
oFF.GetResourceEx.prototype = new oFF.XObjectExt();
oFF.GetResourceEx.prototype._ff_c = "GetResourceEx";

oFF.GetResourceEx.create = function(metadataGenerator)
{
	let query = new oFF.GetResourceEx();
	query.m_metadataGenerator = metadataGenerator;
	return query;
};
oFF.GetResourceEx.prototype.m_metadataGenerator = null;
oFF.GetResourceEx.prototype.getPayload = function(queryData)
{
	if (oFF.isNull(queryData))
	{
		throw oFF.XException.createIllegalArgumentException("Query Data is required so that the getResourceEx call can be completed");
	}
	let file = queryData.getFile();
	if (oFF.isNull(file))
	{
		throw oFF.XException.createIllegalArgumentException("An orca file object must be provided so that we can fetch the attributes/metadata for the given file");
	}
	let resourceId = file.getProviderMetadata().getStringByKeyExt(oFF.XFileAttribute.UNIQUE_ID, file.getName());
	if (oFF.XStringUtils.isNullOrEmpty(resourceId))
	{
		throw oFF.XException.createIllegalArgumentException("A resource id must be provided for fetching the metadata of a file on contentlib");
	}
	let queryObject = oFF.PrFactory.createStructure();
	queryObject.putString(oFF.OrcaResourceConstants.ACTION, oFF.OrcaResourceConstants.GET_RESOURCE_EX);
	let data = queryObject.putNewStructure(oFF.OrcaResourceConstants.DATA);
	this.m_metadataGenerator.addMetadataRequest(data, oFF.OrcaResourceConstants.METADATA, file);
	let metadata = data.getStructureByKey(oFF.OrcaResourceConstants.METADATA);
	let ancestorPath = metadata.putNewStructure(oFF.OrcaResourceConstants.ANCESTOR_PATH);
	ancestorPath.putBoolean(oFF.OrcaResourceConstants.ACCESS, true);
	ancestorPath.putBoolean(oFF.OrcaResourceConstants.NAME, true);
	ancestorPath.putBoolean(oFF.OrcaResourceConstants.DESCRIPTION, true);
	ancestorPath.putBoolean(oFF.OrcaResourceConstants.CREATED_TIME, true);
	ancestorPath.putBoolean(oFF.OrcaResourceConstants.CREATED_BY, true);
	ancestorPath.putBoolean(oFF.OrcaResourceConstants.MODIFIED_BY, true);
	ancestorPath.putBoolean(oFF.OrcaResourceConstants.MODIFIED_TIME, true);
	ancestorPath.putBoolean(oFF.OrcaResourceConstants.RESOURCE_TYPE, true);
	ancestorPath.putBoolean(oFF.OrcaResourceConstants.RESOURCE_SUBTYPE, true);
	data.putString(oFF.OrcaResourceConstants.RESOURCE_ID, resourceId);
	return queryObject;
};

oFF.GetResourceWithNameExists = function() {};
oFF.GetResourceWithNameExists.prototype = new oFF.XObjectExt();
oFF.GetResourceWithNameExists.prototype._ff_c = "GetResourceWithNameExists";

oFF.GetResourceWithNameExists.create = function(resolver)
{
	let query = new oFF.GetResourceWithNameExists();
	query.m_resolver = resolver;
	return query;
};
oFF.GetResourceWithNameExists.prototype.m_resolver = null;
oFF.GetResourceWithNameExists.prototype.getPayload = function(queryData)
{
	if (oFF.isNull(queryData))
	{
		throw oFF.XException.createIllegalArgumentException("Query Data is required so that we can check if a file exists");
	}
	let file = queryData.getFile();
	if (oFF.isNull(file))
	{
		throw oFF.XException.createIllegalArgumentException("An orca file object is required so that we can check for its existence on the server");
	}
	let name = file.getProviderMetadata().getStringByKeyExt(oFF.XFileAttribute.DISPLAY_NAME, file.getName());
	let parentName = oFF.XString.isEqual(file.getProviderParent().getName(), oFF.OrcaResourceConstants.MY_FILES_VIRTUAL_FOLDER) ? file.getFsBase().getPrivateFolderName() : file.getProviderParent().getName();
	let parentResId = file.getProviderMetadata().getStringByKeyExt(oFF.XFileAttribute.PARENT_UNIQUE_ID, parentName);
	let resolvedParentResId = this.m_resolver.resolveParentId(parentResId, file.getFsBase().getPrivateFolderName());
	let resourceTypeForQuery = file.getProviderMetadata().getStringByKey(oFF.XFileAttribute.NODE_TYPE);
	let queryObject = oFF.PrFactory.createStructure();
	queryObject.putString(oFF.OrcaResourceConstants.ACTION, oFF.OrcaResourceConstants.GET_RESOURCE_WITH_NAME_EXISTS);
	let data = queryObject.putNewStructure(oFF.OrcaResourceConstants.DATA);
	data.putString(oFF.OrcaResourceConstants.NAME, name);
	data.putString(oFF.OrcaResourceConstants.PARENT_RES_ID, resolvedParentResId);
	data.putString(oFF.OrcaResourceConstants.RESOURCE_TYPE, resourceTypeForQuery);
	return queryObject;
};

oFF.GetSubNodes = function() {};
oFF.GetSubNodes.prototype = new oFF.XObjectExt();
oFF.GetSubNodes.prototype._ff_c = "GetSubNodes";

oFF.GetSubNodes.create = function(filterGenerator, optionsGenerator)
{
	let query = new oFF.GetSubNodes();
	query.m_filterGenerator = filterGenerator;
	query.m_optionsGenerator = optionsGenerator;
	return query;
};
oFF.GetSubNodes.prototype.m_filterGenerator = null;
oFF.GetSubNodes.prototype.m_optionsGenerator = null;
oFF.GetSubNodes.prototype.getPayload = function(queryData)
{
	let config = oFF.isNull(queryData) ? null : queryData.getQueryConfig();
	let queryObject = oFF.PrFactory.createStructure();
	queryObject.putString(oFF.OrcaResourceConstants.ACTION, oFF.OrcaResourceConstants.GET_SUB_NODES);
	let data = queryObject.putNewStructure(oFF.OrcaResourceConstants.DATA);
	data.putString(oFF.OrcaResourceConstants.RESOURCE_ID, oFF.OrcaResourceConstants.WORKSPACE);
	this.m_filterGenerator.addFilter(queryObject, config);
	this.m_optionsGenerator.addOptions(queryObject, config, oFF.OrcaResourceConstants.OPTIONS, null);
	return queryObject;
};

oFF.RecentFiles = function() {};
oFF.RecentFiles.prototype = new oFF.XObjectExt();
oFF.RecentFiles.prototype._ff_c = "RecentFiles";

oFF.RecentFiles.create = function(searchAllResourcesQuery, filterGenerator, optionsGenerator)
{
	let query = new oFF.RecentFiles();
	query.m_searchAllResourcesQuery = searchAllResourcesQuery;
	query.m_filterGenerator = filterGenerator;
	query.m_optionsGenerator = optionsGenerator;
	return query;
};
oFF.RecentFiles.prototype.m_filterGenerator = null;
oFF.RecentFiles.prototype.m_optionsGenerator = null;
oFF.RecentFiles.prototype.m_searchAllResourcesQuery = null;
oFF.RecentFiles.prototype.getPayload = function(queryData)
{
	if (oFF.isNull(queryData))
	{
		throw oFF.XException.createIllegalArgumentException("Query Data is required so that we can load the recent files");
	}
	let config = queryData.getQueryConfig();
	let resourceTypeStory = oFF.OrcaResourceConstants.RESOURCE_TYPE_STORY;
	let resourceSubtype = oFF.OrcaResourceConstants.RESOURCE_TYPE_INSIGHT;
	let queryObject = this.m_searchAllResourcesQuery.getPayload(queryData);
	let data = queryObject.getStructureByKey(oFF.OrcaResourceConstants.DATA);
	let searchCriteria = data.putNewStructure(oFF.OrcaResourceConstants.SEARCH_CRITERIA);
	searchCriteria.putInteger(oFF.OrcaResourceConstants.RECENTLY_ACCESSED, 60);
	searchCriteria.putString(oFF.OrcaResourceConstants.RESOURCE_TYPES, oFF.OrcaResourceConstants.RESOURCE_TYPE_STORY);
	let resourceTypesExtended = searchCriteria.putNewStructure(oFF.OrcaResourceConstants.RESOURCE_TYPES_EXTENDED);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(resourceSubtype))
	{
		resourceTypesExtended.putString(resourceTypeStory, resourceSubtype);
	}
	this.m_filterGenerator.addFilter(queryObject, config);
	this.m_optionsGenerator.addOptions(queryObject, config, oFF.OrcaResourceConstants.OPTIONS, null);
	return queryObject;
};

oFF.RenameResource = function() {};
oFF.RenameResource.prototype = new oFF.XObjectExt();
oFF.RenameResource.prototype._ff_c = "RenameResource";

oFF.RenameResource.create = function()
{
	let query = new oFF.RenameResource();
	return query;
};
oFF.RenameResource.prototype.getPayload = function(queryData)
{
	if (oFF.isNull(queryData))
	{
		throw oFF.XException.createIllegalArgumentException("Query Data is required so we can rename a file");
	}
	let file = queryData.getFile();
	if (oFF.isNull(file))
	{
		throw oFF.XException.createIllegalArgumentException("An orca file object is required so that we can rename it on the backend");
	}
	if (oFF.XStringUtils.isNullOrEmpty(queryData.getTargetName()))
	{
		throw oFF.XException.createIllegalArgumentException("A target name is required when renaming a file in contentlib");
	}
	let resourceId = file.getProviderMetadata().getStringByKey(oFF.XFileAttribute.UNIQUE_ID);
	if (oFF.XStringUtils.isNullOrEmpty(resourceId))
	{
		throw oFF.XException.createIllegalArgumentException("A resource id is required when renaming a file in contentlib");
	}
	let queryObject = oFF.PrFactory.createStructure();
	queryObject.putString(oFF.OrcaResourceConstants.ACTION, oFF.OrcaResourceConstants.RENAME_RESOURCE);
	let data = queryObject.putNewStructure(oFF.OrcaResourceConstants.DATA);
	data.putString("resourceId", resourceId);
	data.putString("name", queryData.getTargetName());
	let updateOptions = data.putNewStructure("updateOpt");
	updateOptions.putBoolean("onRemote", true);
	return queryObject;
};

oFF.RepoView = function() {};
oFF.RepoView.prototype = new oFF.XObjectExt();
oFF.RepoView.prototype._ff_c = "RepoView";

oFF.RepoView.create = function(filterGenerator, optionsGenerator)
{
	let query = new oFF.RepoView();
	query.m_filterGenerator = filterGenerator;
	query.m_optionsGenerator = optionsGenerator;
	return query;
};
oFF.RepoView.prototype.m_filterGenerator = null;
oFF.RepoView.prototype.m_optionsGenerator = null;
oFF.RepoView.prototype.getPayload = function(queryData)
{
	if (oFF.isNull(queryData))
	{
		throw oFF.XException.createIllegalArgumentException("Query Data is required so that the children of the root folder can be fetched");
	}
	let config = queryData.getQueryConfig();
	if (oFF.XStringUtils.isNullOrEmpty(queryData.getPrivateFolder()))
	{
		throw oFF.XException.createIllegalArgumentException("The private folder name is required for running the repo view query");
	}
	let privateFolder = queryData.getPrivateFolder();
	let queryObject = oFF.PrFactory.createStructure();
	queryObject.putString(oFF.OrcaResourceConstants.ACTION, oFF.OrcaResourceConstants.GET_REPO_VIEW);
	let data = queryObject.putNewStructure(oFF.OrcaResourceConstants.DATA);
	data.putString(oFF.OrcaResourceConstants.RESOURCE_ID, privateFolder);
	data.putBoolean("detail", false);
	data.putNewList("filter");
	data.putBoolean("bIncTemporary", true);
	data.putBoolean("allowAuthOverride", false);
	data.putBoolean("fetchAncestorNodes", true);
	data.putBoolean("showContentSharedWithUser", true);
	this.m_optionsGenerator.addOptions(queryObject, config, oFF.OrcaResourceConstants.OPTIONS, null);
	this.m_filterGenerator.addFilter(queryObject, config);
	return queryObject;
};

oFF.SearchAllResources = function() {};
oFF.SearchAllResources.prototype = new oFF.XObjectExt();
oFF.SearchAllResources.prototype._ff_c = "SearchAllResources";

oFF.SearchAllResources.create = function(filterGenerator, optionsGenerator, metadataGenerator)
{
	let query = new oFF.SearchAllResources();
	query.m_filterGenerator = filterGenerator;
	query.m_optionsGenerator = optionsGenerator;
	query.m_metadataGenerator = metadataGenerator;
	query.populateSearchOrderAttributes();
	return query;
};
oFF.SearchAllResources.prototype.m_attributeMap = null;
oFF.SearchAllResources.prototype.m_filterGenerator = null;
oFF.SearchAllResources.prototype.m_metadataGenerator = null;
oFF.SearchAllResources.prototype.m_optionsGenerator = null;
oFF.SearchAllResources.prototype.getPayload = function(queryData)
{
	if (oFF.isNull(queryData))
	{
		throw oFF.XException.createIllegalArgumentException("Query Data is required so that we can perform a search");
	}
	let file = queryData.getFile();
	let config = queryData.getQueryConfig();
	if (oFF.isNull(file))
	{
		throw oFF.XException.createIllegalArgumentException("An orca file is required so that we can search within it on the backend");
	}
	if (!file.isDirectory())
	{
		throw oFF.XException.createIllegalArgumentException("You can only search within a folder, not a file");
	}
	let isCatalog = oFF.XString.isEqual(file.getName(), oFF.OrcaResourceConstants.CATALOG_VIRTUAL_FOLDER);
	let privateFolder = file.getFsBase().getPrivateFolderName();
	let queryObject = oFF.PrFactory.createStructure();
	queryObject.putString(oFF.OrcaResourceConstants.ACTION, oFF.OrcaResourceConstants.SEARCH_ALL_RESOURCES);
	let data = queryObject.putNewStructure(oFF.OrcaResourceConstants.DATA);
	data.putBoolean(oFF.OrcaResourceConstants.ALLOW_AUTH_OVERRIDE, false);
	let searchCriteria = data.putNewStructure(oFF.OrcaResourceConstants.SEARCH_CRITERIA);
	let parentResourceIds = searchCriteria.putNewStructure(oFF.OrcaResourceConstants.PARENT_RESOURCE_IDS);
	let fileResId = file.getProviderMetadata().getStringByKey(oFF.XFileAttribute.UNIQUE_ID);
	if (oFF.XString.isEqual(fileResId, privateFolder) || isCatalog)
	{
		let publicFolder = parentResourceIds.putNewStructure(oFF.OrcaResourceConstants.RESOURCE_ID_PUBLIC);
		publicFolder.putBoolean(oFF.OrcaResourceConstants.INCLUDE_SELF, isCatalog ? false : true);
		let sharedFolder = parentResourceIds.putNewStructure(oFF.OrcaResourceConstants.RESOURCE_ID_SHARED);
		sharedFolder.putBoolean(oFF.OrcaResourceConstants.INCLUDE_SELF, false);
		let inputScheduleFolder = parentResourceIds.putNewStructure(oFF.OrcaResourceConstants.RESOURCE_ID_INPUT_SCHEDULE);
		inputScheduleFolder.putBoolean(oFF.OrcaResourceConstants.INCLUDE_SELF, isCatalog ? false : true);
		let samplesFolder = parentResourceIds.putNewStructure(oFF.OrcaResourceConstants.RESOURCE_ID_SAMPLES);
		samplesFolder.putBoolean(oFF.OrcaResourceConstants.INCLUDE_SELF, isCatalog ? false : true);
		let teamsFolder = parentResourceIds.putNewStructure(oFF.OrcaResourceConstants.RESOURCE_ID_TEAMS);
		teamsFolder.putBoolean(oFF.OrcaResourceConstants.INCLUDE_SELF, false);
		let privateFolderStructure = parentResourceIds.putNewStructure(privateFolder);
		privateFolderStructure.putBoolean(oFF.OrcaResourceConstants.INCLUDE_SELF, false);
	}
	let parentFolder = parentResourceIds.putNewStructure(fileResId);
	parentFolder.putBoolean(oFF.OrcaResourceConstants.INCLUDE_SELF, false);
	let resourceTypeFilter = oFF.OrcaResourceConstants.RESOURCE_TYPE_FOLDER;
	if (isCatalog)
	{
		searchCriteria.putBoolean(oFF.OrcaResourceConstants.PUBLISHED_READABLE, true);
	}
	else
	{
		searchCriteria.putString(oFF.OrcaResourceConstants.SEARCH_VALUE, file.getProviderMetadata().getStringByKey(oFF.XFileAttribute.DISPLAY_NAME));
	}
	if (oFF.notNull(config))
	{
		if (oFF.XStringUtils.isNotNullAndNotEmpty(config.getSearchValue()))
		{
			searchCriteria.putString(oFF.OrcaResourceConstants.SEARCH_VALUE, config.getSearchValue());
		}
		this.m_optionsGenerator.addOptions(queryObject, config, oFF.OrcaResourceConstants.OPTIONS, null);
		let supportedFilters = this.m_filterGenerator.getSupportedFilters(config.getCartesianFilter());
		if (supportedFilters.size() > 0)
		{
			let notCreatedByFilter = "";
			let createdByFilter = "";
			resourceTypeFilter = "";
			let value = "";
			for (let i = 0; i < supportedFilters.size(); i++)
			{
				let currentFilter = supportedFilters.get(i);
				if (oFF.XString.isEqual(currentFilter.getName(), oFF.XFileAttribute.NODE_TYPE))
				{
					value = currentFilter.getValue();
					resourceTypeFilter = oFF.XStringUtils.isNotNullAndNotEmpty(resourceTypeFilter) ? oFF.XStringUtils.concatenate3(resourceTypeFilter, ";", value) : value;
				}
				else if (oFF.XString.isEqual(currentFilter.getName(), oFF.XFileAttribute.CREATED_BY))
				{
					value = supportedFilters.get(i).getValue();
					if (oFF.XString.isEqual(currentFilter.getType().getName(), oFF.XFileFilterType.NOT.getName()))
					{
						notCreatedByFilter = oFF.XStringUtils.isNotNullAndNotEmpty(notCreatedByFilter) ? oFF.XStringUtils.concatenate3(notCreatedByFilter, ";", value) : value;
					}
					else
					{
						createdByFilter = oFF.XStringUtils.isNotNullAndNotEmpty(createdByFilter) ? oFF.XStringUtils.concatenate3(createdByFilter, ";", value) : value;
					}
				}
			}
			searchCriteria.putStringNotNullAndNotEmpty(oFF.OrcaResourceConstants.RESOURCE_TYPES, resourceTypeFilter);
			searchCriteria.putStringNotNullAndNotEmpty(oFF.OrcaResourceConstants.CREATED_BY_SEARCH_FILTER, createdByFilter);
			searchCriteria.putStringNotNullAndNotEmpty(oFF.OrcaResourceConstants.NOT_CREATED_BY_SEARCH_FILTER, notCreatedByFilter);
		}
	}
	else
	{
		let options = data.putNewStructure(oFF.OrcaResourceConstants.OPTIONS);
		options.putInteger(oFF.OrcaResourceConstants.LIMIT, 150);
		options.putInteger(oFF.OrcaResourceConstants.OFFSET, 0);
		options.putBoolean(oFF.OrcaResourceConstants.INCLUDE_TOTAL_RESOURCE_COUNT, true);
	}
	let sortDefinition = data.putNewStructure(oFF.OrcaResourceConstants.SORT_DEFINITION);
	let orderByAttribute = oFF.OrcaResourceConstants.NAME;
	let orderDirection = oFF.OrcaResourceConstants.ASCENDING;
	if (oFF.notNull(config) && config.getSingleSortDef() !== null && oFF.XStringUtils.isNotNullAndNotEmpty(config.getSingleSortDef().getAttributeName()))
	{
		orderByAttribute = this.getSearchOrderAttribute(config.getSingleSortDef().getAttributeName());
		let direction = config.getSingleSortDef().getDirection();
		orderDirection = direction === oFF.XSortDirection.DESCENDING ? oFF.OrcaResourceConstants.DESCENDING : oFF.OrcaResourceConstants.ASCENDING;
	}
	sortDefinition.putString(oFF.OrcaResourceConstants.ORDER_BY, orderByAttribute);
	sortDefinition.putString(oFF.OrcaResourceConstants.DIRECTION, orderDirection);
	this.m_metadataGenerator.addMetadataRequest(data, oFF.OrcaResourceConstants.METADATA_DEFINITION, file);
	return queryObject;
};
oFF.SearchAllResources.prototype.getSearchOrderAttribute = function(attribute)
{
	let value = this.m_attributeMap.getByKey(attribute) !== null ? this.m_attributeMap.getByKey(attribute) : "name";
	return value;
};
oFF.SearchAllResources.prototype.populateSearchOrderAttributes = function()
{
	this.m_attributeMap = oFF.XHashMapByString.create();
	this.m_attributeMap.put(oFF.XFileAttribute.UNIQUE_ID, "RESOURCE_ID");
	this.m_attributeMap.put(oFF.XFileAttribute.CHANGED_BY, "MODIFIED_BY");
	this.m_attributeMap.put(oFF.XFileAttribute.CHANGED_AT, "MODIFIED_TIME");
	this.m_attributeMap.put(oFF.XFileAttribute.PARENT_UNIQUE_ID, "PARENT_RES_ID");
	this.m_attributeMap.put(oFF.XFileAttribute.UPDATE_COUNT, "UPDATE_COUNTER");
	this.m_attributeMap.put(oFF.XFileAttribute.NODE_TYPE, "RESOURCE_TYPE");
	this.m_attributeMap.put(oFF.XFileAttribute.CREATED_BY, "CREATED_BY");
	this.m_attributeMap.put(oFF.XFileAttribute.CREATED_AT, "CREATED_TIME");
	this.m_attributeMap.put(oFF.XFileAttribute.OWNER_FOLDER, "OWNER_ID");
	this.m_attributeMap.put(oFF.XFileAttribute.DISPLAY_NAME, "name");
};

oFF.ShareFile = function() {};
oFF.ShareFile.prototype = new oFF.XObjectExt();
oFF.ShareFile.prototype._ff_c = "ShareFile";

oFF.ShareFile.create = function()
{
	let query = new oFF.ShareFile();
	return query;
};
oFF.ShareFile.prototype.getPayload = function(queryData)
{
	if (oFF.isNull(queryData))
	{
		throw oFF.XException.createIllegalArgumentException("Query Data is required so we can share a file");
	}
	let file = queryData.getFile();
	if (oFF.isNull(file))
	{
		throw oFF.XException.createIllegalArgumentException("An orca file object is required so that we can share it");
	}
	let resourceId = file.getProviderMetadata().getStringByKey(oFF.XFileAttribute.UNIQUE_ID);
	if (oFF.XStringUtils.isNullOrEmpty(resourceId))
	{
		throw oFF.XException.createIllegalArgumentException("A resource id is required when sharing a file in contentlib");
	}
	let queryObject = oFF.PrFactory.createStructure();
	let shareInfo = queryData.getAccessState();
	let accessNum = 0;
	let userAccess = shareInfo.getAllAccess();
	let user = userAccess.getKeysAsReadOnlyList().get(0);
	let accessMap = userAccess.getByKey(user);
	let accessStateBuilder = oFF.OrcaFileAccessStateBuilder.create();
	for (let i = 0; i < accessMap.getKeysAsReadOnlyList().size(); i++)
	{
		let access = accessMap.getKeysAsReadOnlyList().get(i);
		if (accessMap.getByKey(access).getBoolean())
		{
			accessNum = accessNum + accessStateBuilder.getAccessNumber(access);
		}
	}
	if (queryData.getIsAllUsersWithExistingAccess())
	{
		queryObject.putString("action", "setBulkShare");
		let dataStruct = queryObject.putNewStructure("data");
		dataStruct.putString("syncUsers", "ADDITIVE");
		dataStruct.putBoolean("syncDescendents", false);
		dataStruct.putString("userSelection", "EXCLUSIVE");
		let access = dataStruct.putNewStructure("access");
		access.putInteger("access", accessNum);
		dataStruct.putNewList("resourceIds").addString(resourceId);
		dataStruct.putBoolean("applyOwnerAccess", false);
		dataStruct.putString("name", "");
		dataStruct.putNewList("users").addString(queryData.getFile().getProviderMetadata().getStringByKey(oFF.XFileAttribute.CREATED_BY));
		let oOpt = dataStruct.putNewStructure("oOpt");
		oOpt.putBoolean("generateAltNotification", false);
	}
	else
	{
		queryObject.putString("action", "setUserShare");
		let dataStruct = queryObject.putNewStructure("data");
		dataStruct.putString("syncUsers", "ADDITIVE");
		dataStruct.putBoolean("syncDescendents", false);
		let access = dataStruct.putNewStructure("access");
		let resAccess = access.putNewStructure(resourceId);
		for (let i = 0; i < userAccess.size(); i++)
		{
			let accessStruct = resAccess.putNewStructure(userAccess.getKeysAsReadOnlyList().get(i));
			accessStruct.putInteger("access", accessNum);
		}
		let oOpt = dataStruct.putNewStructure("oOpt");
		oOpt.putBoolean("generateAltNotification", false);
		oOpt.putBoolean("sendEmailNotification", queryData.getSendEmailNotification());
	}
	return queryObject;
};

oFF.SpaceView = function() {};
oFF.SpaceView.prototype = new oFF.XObjectExt();
oFF.SpaceView.prototype._ff_c = "SpaceView";

oFF.SpaceView.create = function(filterGenerator, optionsGenerator)
{
	let query = new oFF.SpaceView();
	query.m_filterGenerator = filterGenerator;
	query.m_optionsGenerator = optionsGenerator;
	return query;
};
oFF.SpaceView.prototype.m_filterGenerator = null;
oFF.SpaceView.prototype.m_optionsGenerator = null;
oFF.SpaceView.prototype.getPayload = function(queryData)
{
	if (oFF.isNull(queryData))
	{
		throw oFF.XException.createIllegalArgumentException("Query Data is required so that we can load the root folder of a workspace");
	}
	let file = queryData.getFile();
	let config = queryData.getQueryConfig();
	if (oFF.isNull(file))
	{
		throw oFF.XException.createIllegalArgumentException("An orca file object is required for fetching the root folder within a workspace");
	}
	let queryObject = oFF.PrFactory.createStructure();
	queryObject.putString(oFF.OrcaResourceConstants.ACTION, oFF.OrcaResourceConstants.GET_SPACE_VIEW);
	let data = queryObject.putNewStructure(oFF.OrcaResourceConstants.DATA);
	let suffix = oFF.XStringUtils.concatenate2(oFF.OrcaResourceConstants.RESOURCE_ID_WORKSPACE_SUFFIX, file.getFsBase().getUserName());
	let fileResId = file.getProviderMetadata().getStringByKey(oFF.XFileAttribute.UNIQUE_ID);
	fileResId = oFF.XString.substring(fileResId, 0, oFF.XString.size(fileResId) - oFF.XString.size(oFF.OrcaResourceConstants.RESOURCE_ID_ROOT));
	let workSpaceResId = oFF.XStringUtils.concatenate2(fileResId, suffix);
	data.putString(oFF.OrcaResourceConstants.RESOURCE_ID, workSpaceResId);
	this.m_filterGenerator.addFilter(queryObject, config);
	this.m_optionsGenerator.addOptions(queryObject, config, oFF.OrcaResourceConstants.OPTIONS, null);
	return queryObject;
};

oFF.StageDeleteList = function() {};
oFF.StageDeleteList.prototype = new oFF.XObjectExt();
oFF.StageDeleteList.prototype._ff_c = "StageDeleteList";

oFF.StageDeleteList.create = function()
{
	let query = new oFF.StageDeleteList();
	return query;
};
oFF.StageDeleteList.prototype.getPayload = function(queryData)
{
	if (oFF.isNull(queryData))
	{
		throw oFF.XException.createIllegalArgumentException("Query Data is required so that we can delete a list of files");
	}
	if (queryData.getResourceIds() === null || queryData.getResourceIds().isEmpty())
	{
		throw oFF.XException.createIllegalArgumentException("A list of resource ids must be provided for deletion");
	}
	let queryObject = oFF.PrFactory.createStructure();
	queryObject.putString(oFF.OrcaResourceConstants.ACTION, oFF.OrcaResourceConstants.STAGE_DELETE_LIST);
	let data = queryObject.putNewStructure(oFF.OrcaResourceConstants.DATA);
	let deleteOptions = data.putNewStructure("deleteOpt");
	deleteOptions.putBoolean("onRemote", true);
	let resourceList = data.putNewList("resourceIds");
	resourceList.addAllStrings(queryData.getResourceIds());
	return queryObject;
};

oFF.UpdateContent = function() {};
oFF.UpdateContent.prototype = new oFF.XObjectExt();
oFF.UpdateContent.prototype._ff_c = "UpdateContent";

oFF.UpdateContent.create = function()
{
	let query = new oFF.UpdateContent();
	return query;
};
oFF.UpdateContent.prototype.appendContentlibPayload = function(queryData, queryObject)
{
	let file = queryData.getFile();
	let resourceId = file.getProviderMetadata().getStringByKeyExt(oFF.XFileAttribute.UNIQUE_ID, file.getName());
	if (oFF.XStringUtils.isNullOrEmpty(resourceId))
	{
		throw oFF.XException.createIllegalArgumentException("A resource id is required when updating a file's content");
	}
	let contentStructure = queryData.getContent().getJsonContent().asStructure();
	let jsonString = oFF.PrUtils.serialize(contentStructure, true, false, 0);
	queryObject.putString(oFF.OrcaResourceConstants.ACTION, oFF.OrcaResourceConstants.UPDATE_CONTENT);
	let data = queryObject.putNewStructure(oFF.OrcaResourceConstants.DATA);
	data.putString(oFF.OrcaResourceConstants.RESOURCE_ID, resourceId);
	data.putString(oFF.OrcaResourceConstants.NAME, file.getProviderMetadata().getStringByKey(oFF.XFileAttribute.DISPLAY_NAME));
	data.putString(oFF.OrcaResourceConstants.DESCRIPTION, file.getProviderMetadata().getStringByKey(oFF.XFileAttribute.DESCRIPTION));
	data.putString(oFF.OrcaResourceConstants.CDATA, jsonString);
	data.putInteger(oFF.OrcaResourceConstants.MOBILE_SUPPORT, file.getProviderMetadata().getIntegerByKey(oFF.XFileAttribute.MOBILE_SUPPORT));
	if (oFF.XString.isEqual(oFF.OrcaResourceConstants.RESOURCE_TYPE_INSIGHT, file.getProviderMetadata().getStringByKeyExt(oFF.XFileAttribute.NODE_SUB_TYPE, null)))
	{
		let updateOptions = data.putNewStructure(oFF.OrcaResourceConstants.UPDATE_OPTIONS);
		let enhancedProperties = updateOptions.putNewStructure(oFF.OrcaResourceConstants.ENHANCED_PROPERTIES);
		enhancedProperties.putString(oFF.OrcaResourceConstants.DATA_ANALYZER_INFO, oFF.OrcaResourceConstants.DATA_ANALYZER_ENHANCED_PROPERTY);
	}
};
oFF.UpdateContent.prototype.getPayload = function(queryData)
{
	if (oFF.isNull(queryData))
	{
		throw oFF.XException.createIllegalArgumentException("Query Data is required so we can update a file's content");
	}
	if (queryData.getFile() === null)
	{
		throw oFF.XException.createIllegalArgumentException("An orca file is required so that it can be updated on the server");
	}
	if (queryData.getFile().isDirectory())
	{
		throw oFF.XException.createIllegalArgumentException("You cannot do an updateContent call on a folder");
	}
	if (queryData.getContent() === null)
	{
		throw oFF.XException.createIllegalArgumentException("Content must be provided so that the file can be updated");
	}
	let queryObject = oFF.PrFactory.createStructure();
	if (queryData.createLink())
	{
		let contentlibStructure = queryData.appendLinkPayloadAndReturnContentlibStruct(queryObject);
		this.appendContentlibPayload(queryData, contentlibStructure);
	}
	else
	{
		this.appendContentlibPayload(queryData, queryObject);
	}
	return queryObject;
};

oFF.ResourceIdResolver = function() {};
oFF.ResourceIdResolver.prototype = new oFF.XObjectExt();
oFF.ResourceIdResolver.prototype._ff_c = "ResourceIdResolver";

oFF.ResourceIdResolver.create = function()
{
	let resolver = new oFF.ResourceIdResolver();
	return resolver;
};
oFF.ResourceIdResolver.prototype.resolveParentId = function(parentResId, privateFolderName)
{
	let resolvedParentResId = parentResId;
	if (oFF.XString.endsWith(resolvedParentResId, "_ROOT"))
	{
		resolvedParentResId = oFF.XString.replace(resolvedParentResId, "_ROOT", oFF.XStringUtils.concatenate2("_", privateFolderName));
	}
	if (oFF.XString.endsWith(resolvedParentResId, "__SHARED"))
	{
		resolvedParentResId = oFF.XString.replace(resolvedParentResId, "__SHARED", "");
	}
	return resolvedParentResId;
};

oFF.OrcaContentlibResourceUtils = function() {};
oFF.OrcaContentlibResourceUtils.prototype = new oFF.XObjectExt();
oFF.OrcaContentlibResourceUtils.prototype._ff_c = "OrcaContentlibResourceUtils";

oFF.OrcaContentlibResourceUtils.INVISIBLE_FOLDERS = null;
oFF.OrcaContentlibResourceUtils.METADATA_MAP = null;
oFF.OrcaContentlibResourceUtils.assertResourceId = function(resourceId)
{
	if (oFF.XStringUtils.isNullOrEmpty(resourceId))
	{
		throw oFF.XException.createIllegalArgumentException("Resource id must be non-null and non-empty");
	}
};
oFF.OrcaContentlibResourceUtils.canFolderShowInUi = function(resourceId)
{
	oFF.OrcaContentlibResourceUtils.assertResourceId(resourceId);
	let visible = true;
	if (oFF.isNull(oFF.OrcaContentlibResourceUtils.INVISIBLE_FOLDERS))
	{
		oFF.OrcaContentlibResourceUtils.populateInvisibleFolders();
	}
	if (oFF.OrcaContentlibResourceUtils.INVISIBLE_FOLDERS.contains(resourceId) || oFF.XStringUtils.isNullOrEmpty(resourceId))
	{
		visible = false;
	}
	return visible;
};
oFF.OrcaContentlibResourceUtils.checkAuth = function(contentlibResource, authToCheck)
{
	if (contentlibResource.getStructureByKey(oFF.OrcaResourceConstants.AUTH) === null || contentlibResource.getStructureByKey(oFF.OrcaResourceConstants.AUTH).isEmpty())
	{
		return false;
	}
	let auth = contentlibResource.getStructureByKey(oFF.OrcaResourceConstants.AUTH);
	if (oFF.XString.isEqual(oFF.OrcaResourceConstants.RESOURCE_TYPE_LINK, contentlibResource.getStringByKey(oFF.OrcaResourceConstants.RESOURCE_TYPE)))
	{
		let sourceResource = contentlibResource.getStructureByKey(oFF.OrcaResourceConstants.SOURCE_RESOURCE);
		if (oFF.notNull(sourceResource) && sourceResource.getStructureByKey(oFF.OrcaResourceConstants.AUTH) !== null)
		{
			auth = sourceResource.getStructureByKey(oFF.OrcaResourceConstants.AUTH);
		}
	}
	let canRead = auth.getBooleanByKey(authToCheck);
	return canRead;
};
oFF.OrcaContentlibResourceUtils.getContentlibAttributeFromFileAttribute = function(attributeName)
{
	if (oFF.isNull(oFF.OrcaContentlibResourceUtils.METADATA_MAP) || oFF.OrcaContentlibResourceUtils.METADATA_MAP.isEmpty())
	{
		oFF.OrcaContentlibResourceUtils.setupUtils();
	}
	return oFF.OrcaContentlibResourceUtils.METADATA_MAP.getByKey(attributeName);
};
oFF.OrcaContentlibResourceUtils.getSupportedFilterMetadata = function()
{
	let supportedFilters = oFF.PrFactory.createStructure();
	let nodeTypeFilter = supportedFilters.putNewStructure(oFF.XFileAttribute.NODE_TYPE);
	let nodeFilterTypes = nodeTypeFilter.putNewList(oFF.XFileAttribute.SUPPORTED_FILTER_TYPES);
	nodeFilterTypes.addString(oFF.XFileFilterType.EXACT.getName());
	let createdByFilter = supportedFilters.putNewStructure(oFF.XFileAttribute.CREATED_BY);
	let createdByFilterTypes = createdByFilter.putNewList(oFF.XFileAttribute.SUPPORTED_FILTER_TYPES);
	createdByFilterTypes.addString(oFF.XFileFilterType.EXACT.getName());
	createdByFilterTypes.addString(oFF.XFileFilterType.NOT.getName());
	return supportedFilters;
};
oFF.OrcaContentlibResourceUtils.isFolder = function(contentlibResource)
{
	return oFF.XString.isEqual(contentlibResource.getStringByKey(oFF.OrcaResourceConstants.RESOURCE_TYPE), oFF.OrcaResourceConstants.RESOURCE_TYPE_FOLDER);
};
oFF.OrcaContentlibResourceUtils.isInputFormsFolder = function(resourceId)
{
	oFF.OrcaContentlibResourceUtils.assertResourceId(resourceId);
	let inputFormsPresentAsSpaces = oFF.XString.endsWith(resourceId, oFF.OrcaResourceConstants.RESOURCE_ID_INPUT_SCHEDULE) && !oFF.OrcaContentlibResourceUtils.isPrivateFolder(resourceId);
	let isInputForms = oFF.XString.isEqual(resourceId, oFF.OrcaResourceConstants.RESOURCE_ID_INPUT_SCHEDULE);
	return isInputForms || inputFormsPresentAsSpaces;
};
oFF.OrcaContentlibResourceUtils.isPrivateFolder = function(resourceId)
{
	oFF.OrcaContentlibResourceUtils.assertResourceId(resourceId);
	let includesPrivatePrefix = oFF.XString.indexOf(resourceId, oFF.OrcaResourceConstants.PRIVATE_FOLDER_PREFIX) > -1;
	return includesPrivatePrefix;
};
oFF.OrcaContentlibResourceUtils.isUsersPrivateFolder = function(resourceId, userName)
{
	oFF.OrcaContentlibResourceUtils.assertResourceId(resourceId);
	let privateFolderName = oFF.XStringUtils.concatenate2(oFF.OrcaResourceConstants.PRIVATE_FOLDER_PREFIX, userName);
	return oFF.XString.isEqual(resourceId, privateFolderName);
};
oFF.OrcaContentlibResourceUtils.isWorkspaceResource = function(contentlibResource)
{
	let isWorkspaceFile = false;
	if (contentlibResource.containsKey(oFF.OrcaResourceConstants.SPACE_ID))
	{
		isWorkspaceFile = true;
		let spaceId = contentlibResource.getStringByKey(oFF.OrcaResourceConstants.SPACE_ID);
		if (oFF.XStringUtils.isNullOrEmpty(spaceId))
		{
			isWorkspaceFile = false;
		}
	}
	return isWorkspaceFile;
};
oFF.OrcaContentlibResourceUtils.populateInvisibleFolders = function()
{
	let invisibleFolders = oFF.XList.create();
	invisibleFolders.add(oFF.OrcaResourceConstants.RESOURCE_ID_SYSTEM);
	invisibleFolders.add(oFF.OrcaResourceConstants.RESOURCE_ID_TEAMS);
	invisibleFolders.add(oFF.OrcaResourceConstants.RESOURCE_ID_SPACE);
	invisibleFolders.add(oFF.OrcaResourceConstants.RESOURCE_ID_WORKSPACE);
	invisibleFolders.add(oFF.OrcaResourceConstants.RESOURCE_ID_ROOT);
	invisibleFolders.add(oFF.OrcaResourceConstants.RESOURCE_ID_SHARED);
	oFF.OrcaContentlibResourceUtils.INVISIBLE_FOLDERS = invisibleFolders;
};
oFF.OrcaContentlibResourceUtils.setupUtils = function()
{
	oFF.OrcaContentlibResourceUtils.METADATA_MAP = oFF.XHashMapByString.create();
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.UNIQUE_ID, oFF.OrcaResourceConstants.RESOURCE_ID);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.DISPLAY_NAME, oFF.OrcaResourceConstants.NAME);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.NAME, oFF.OrcaResourceConstants.NAME);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.DESCRIPTION, oFF.OrcaResourceConstants.DESCRIPTION);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.CREATED_BY, oFF.OrcaResourceConstants.CREATED_BY);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.NODE_TYPE, oFF.OrcaResourceConstants.RESOURCE_TYPE);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.NODE_SUB_TYPE, oFF.OrcaResourceConstants.RESOURCE_SUBTYPE);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.OWNER_TYPE, oFF.OrcaResourceConstants.OWNER_TYPE);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.PARENT_UNIQUE_ID, oFF.OrcaResourceConstants.PARENT_RES_ID);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.UPDATE_COUNT, oFF.OrcaResourceConstants.UPDATE_COUNTER);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.ORIGINAL_LANGUAGE, oFF.OrcaResourceConstants.ORIG_LANGUAGE);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.PACKAGE_ID, oFF.OrcaResourceConstants.PACKAGE_ID);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.MOBILE_SUPPORT, oFF.OrcaResourceConstants.MOBILE_SUPPORT);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.CHANGED_BY, oFF.OrcaResourceConstants.MODIFIED_BY);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.CREATED_AT, oFF.OrcaResourceConstants.CREATED_TIME);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.CHANGED_AT, oFF.OrcaResourceConstants.MODIFIED_TIME);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.CREATED_BY_DISPLAY_NAME, oFF.OrcaResourceConstants.CREATED_BY_DISPLAY_NAME);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.CHANGED_BY_DISPLAY_NAME, oFF.OrcaResourceConstants.MODIFIED_BY_DISPLAY_NAME);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.IS_SHARED, oFF.OrcaResourceConstants.IS_SHARED);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.SHARED_TO_ANY, oFF.OrcaResourceConstants.SHARED_TO_ANY);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.SHARED, oFF.OrcaResourceConstants.SHARED);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.SHAREABLE, oFF.OrcaResourceConstants.CAN_SHARE);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.OWNER_FOLDER, oFF.OrcaResourceConstants.OWNER_ID);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.CAN_ASSIGN, oFF.OrcaResourceConstants.AUTH_ASSIGN);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.CAN_READ, oFF.OrcaResourceConstants.AUTH_READ);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.CAN_UPDATE, oFF.OrcaResourceConstants.AUTH_UPDATE);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.CAN_DELETE, oFF.OrcaResourceConstants.AUTH_DELETE);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.CAN_CREATE_DOC, oFF.OrcaResourceConstants.AUTH_CREATE_DOC);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.CAN_CREATE_FOLDER, oFF.OrcaResourceConstants.AUTH_CREATE_FOLDER);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.CAN_COPY, oFF.OrcaResourceConstants.AUTH_COPY);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.CAN_COMMENT_VIEW, oFF.OrcaResourceConstants.AUTH_COMMENT_VIEW);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.CAN_COMMENT_ADD, oFF.OrcaResourceConstants.AUTH_COMMENT_ADD);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.CAN_COMMENT_DELETE, oFF.OrcaResourceConstants.AUTH_COMMENT_DELETE);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.CAN_MAINTAIN, oFF.OrcaResourceConstants.AUTH_MAINTAIN);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.CAN_COMMENT_VIEW, oFF.OrcaResourceConstants.AUTH_COMMENT_VIEW);
	oFF.OrcaContentlibResourceUtils.METADATA_MAP.put(oFF.XFileAttribute.CAN_COMMENT_VIEW, oFF.OrcaResourceConstants.AUTH_COMMENT_VIEW);
};
oFF.OrcaContentlibResourceUtils.shouldIgnoreQuickFilters = function(resourceId)
{
	oFF.OrcaContentlibResourceUtils.assertResourceId(resourceId);
	return oFF.XString.isEqual(resourceId, oFF.OrcaResourceConstants.RESOURCE_ID_SAMPLES);
};

oFF.OrcaFileAccessStateBuilder = function() {};
oFF.OrcaFileAccessStateBuilder.prototype = new oFF.XObjectExt();
oFF.OrcaFileAccessStateBuilder.prototype._ff_c = "OrcaFileAccessStateBuilder";

oFF.OrcaFileAccessStateBuilder.ASSIGN = 1;
oFF.OrcaFileAccessStateBuilder.COMMENT_ADD = 256;
oFF.OrcaFileAccessStateBuilder.COMMENT_DELETE = 512;
oFF.OrcaFileAccessStateBuilder.COMMENT_VIEW = 128;
oFF.OrcaFileAccessStateBuilder.COPY = 64;
oFF.OrcaFileAccessStateBuilder.CREATE_DOC = 16;
oFF.OrcaFileAccessStateBuilder.CREATE_FOLDER = 32;
oFF.OrcaFileAccessStateBuilder.DELETE = 8;
oFF.OrcaFileAccessStateBuilder.DENY = 0;
oFF.OrcaFileAccessStateBuilder.READ = 2;
oFF.OrcaFileAccessStateBuilder.UPDATE = 4;
oFF.OrcaFileAccessStateBuilder.create = function()
{
	let builder = new oFF.OrcaFileAccessStateBuilder();
	return builder;
};
oFF.OrcaFileAccessStateBuilder.prototype.getAccess = function(access, userId)
{
	let bIsRead = ((oFF.XMath.binaryAnd(access, oFF.OrcaFileAccessStateBuilder.READ)) !== 0);
	let bIsCopy = ((oFF.XMath.binaryAnd(access, oFF.OrcaFileAccessStateBuilder.COPY)) !== 0);
	let bIsCommentView = ((oFF.XMath.binaryAnd(access, oFF.OrcaFileAccessStateBuilder.COMMENT_VIEW)) !== 0);
	let bIsCommentAdd = ((oFF.XMath.binaryAnd(access, oFF.OrcaFileAccessStateBuilder.COMMENT_ADD)) !== 0);
	let bIsCommentDelete = ((oFF.XMath.binaryAnd(access, oFF.OrcaFileAccessStateBuilder.COMMENT_DELETE)) !== 0);
	let bIsUpdate = ((oFF.XMath.binaryAnd(access, oFF.OrcaFileAccessStateBuilder.UPDATE)) !== 0);
	let bIsShare = ((oFF.XMath.binaryAnd(access, oFF.OrcaFileAccessStateBuilder.ASSIGN)) !== 0);
	let bIsDelete = ((oFF.XMath.binaryAnd(access, oFF.OrcaFileAccessStateBuilder.DELETE)) !== 0);
	let accessState = oFF.XFileAccessState.create();
	accessState.setUserAccess(userId, oFF.XFileAccess.READ, bIsRead);
	accessState.setUserAccess(userId, oFF.XFileAccess.COPY, bIsCopy);
	accessState.setUserAccess(userId, oFF.XFileAccess.VIEW_COMMENT, bIsCommentView);
	accessState.setUserAccess(userId, oFF.XFileAccess.ADD_COMMENT, bIsCommentAdd);
	accessState.setUserAccess(userId, oFF.XFileAccess.DELETE_COMMENT, bIsCommentDelete);
	accessState.setUserAccess(userId, oFF.XFileAccess.UPDATE, bIsUpdate);
	accessState.setUserAccess(userId, oFF.XFileAccess.SHARE, bIsShare);
	accessState.setUserAccess(userId, oFF.XFileAccess.DELETE, bIsDelete);
	return accessState;
};
oFF.OrcaFileAccessStateBuilder.prototype.getAccessNumber = function(access)
{
	let iAccessNum = 0;
	if (access.isEqualTo(oFF.XFileAccess.READ))
	{
		iAccessNum = oFF.OrcaFileAccessStateBuilder.READ;
	}
	else if (access.isEqualTo(oFF.XFileAccess.COPY))
	{
		iAccessNum = oFF.OrcaFileAccessStateBuilder.COPY;
	}
	else if (access.isEqualTo(oFF.XFileAccess.VIEW_COMMENT))
	{
		iAccessNum = oFF.OrcaFileAccessStateBuilder.COMMENT_VIEW;
	}
	else if (access.isEqualTo(oFF.XFileAccess.ADD_COMMENT))
	{
		iAccessNum = oFF.OrcaFileAccessStateBuilder.COMMENT_ADD;
	}
	else if (access.isEqualTo(oFF.XFileAccess.UPDATE))
	{
		iAccessNum = oFF.OrcaFileAccessStateBuilder.UPDATE;
	}
	else if (access.isEqualTo(oFF.XFileAccess.CREATE))
	{
		iAccessNum = oFF.OrcaFileAccessStateBuilder.CREATE_DOC;
	}
	else if (access.isEqualTo(oFF.XFileAccess.SHARE))
	{
		iAccessNum = oFF.OrcaFileAccessStateBuilder.ASSIGN;
	}
	else if (access.isEqualTo(oFF.XFileAccess.DELETE))
	{
		iAccessNum = oFF.OrcaFileAccessStateBuilder.DELETE;
	}
	else if (access.isEqualTo(oFF.XFileAccess.DELETE_COMMENT))
	{
		iAccessNum = oFF.OrcaFileAccessStateBuilder.COMMENT_DELETE;
	}
	return iAccessNum;
};

oFF.OrcaFileMetadataUtils = function() {};
oFF.OrcaFileMetadataUtils.prototype = new oFF.XObjectExt();
oFF.OrcaFileMetadataUtils.prototype._ff_c = "OrcaFileMetadataUtils";

oFF.OrcaFileMetadataUtils.create = function()
{
	let obj = new oFF.OrcaFileMetadataUtils();
	obj.setupUtils();
	return obj;
};
oFF.OrcaFileMetadataUtils.createWithFile = function(file)
{
	let obj = new oFF.OrcaFileMetadataUtils();
	obj.m_file = file;
	obj.setupUtils();
	return obj;
};
oFF.OrcaFileMetadataUtils.prototype.m_file = null;
oFF.OrcaFileMetadataUtils.prototype.m_metadata = null;
oFF.OrcaFileMetadataUtils.prototype.m_metadataMap = null;
oFF.OrcaFileMetadataUtils.prototype.addFilePathMetadata = function(contentlibResource)
{
	let useAncestorResource = contentlibResource.containsKey(oFF.OrcaResourceConstants.ANCESTOR_RESOURCE) && !contentlibResource.getListByKey(oFF.OrcaResourceConstants.ANCESTOR_RESOURCE).isEmpty();
	let useAncestorPath = contentlibResource.containsKey(oFF.OrcaResourceConstants.ANCESTOR_PATH) && !contentlibResource.getListByKey(oFF.OrcaResourceConstants.ANCESTOR_PATH).isEmpty() && contentlibResource.getListByKey(oFF.OrcaResourceConstants.ANCESTOR_PATH).getElementTypeAt(0) === oFF.PrElementType.STRUCTURE;
	let ancestorProperty = "";
	if (useAncestorResource)
	{
		ancestorProperty = oFF.OrcaResourceConstants.ANCESTOR_RESOURCE;
	}
	else if (useAncestorPath)
	{
		ancestorProperty = oFF.OrcaResourceConstants.ANCESTOR_PATH;
	}
	let isShared = contentlibResource.containsKey("shareResId") && oFF.XStringUtils.isNotNullAndNotEmpty(contentlibResource.getStringByKey("shareResId"));
	if (oFF.XStringUtils.isNotNullAndNotEmpty(ancestorProperty))
	{
		let isWorkspace = oFF.OrcaContentlibResourceUtils.isWorkspaceResource(contentlibResource);
		let ancestorName = isWorkspace ? oFF.OrcaResourceConstants.WORKSPACES_VIRTUAL_FOLDER : oFF.OrcaResourceConstants.MY_FILES_VIRTUAL_FOLDER;
		let ancestorDescription = isWorkspace ? oFF.OrcaResourceConstants.WORKSPACES_VIRTUAL_FOLDER : oFF.OrcaResourceConstants.MY_FILES_DISPLAY_NAME;
		let fileUrl = oFF.XStringUtils.concatenate2("/", ancestorName);
		let ancestors = contentlibResource.getListByKey(ancestorProperty);
		let ancestorsPath = this.m_metadata.putNewList(oFF.XFileAttribute.ANCESTOR_RESOURCE);
		let myFiles = ancestorsPath.addNewStructure();
		myFiles.putString(oFF.XFileAttribute.UNIQUE_ID, ancestorName);
		myFiles.putString(oFF.XFileAttribute.DISPLAY_NAME, ancestorDescription);
		let isLinkType = oFF.XString.isEqual(contentlibResource.getStringByKey(oFF.OrcaResourceConstants.RESOURCE_ID), oFF.OrcaResourceConstants.RESOURCE_TYPE_LINK);
		if (!isLinkType)
		{
			for (let i = 0; i < ancestors.size(); i++)
			{
				let ancestor = ancestors.getStructureAt(i);
				let resourceId = ancestor.getStringByKey(oFF.OrcaResourceConstants.RESOURCE_ID);
				if (oFF.XString.startsWith(resourceId, oFF.OrcaResourceConstants.PRIVATE_FOLDER_PREFIX) || oFF.XString.indexOf(resourceId, oFF.OrcaResourceConstants.PRIVATE_FOLDER_PREFIX) > -1)
				{
					continue;
				}
				if (!oFF.OrcaContentlibResourceUtils.checkAuth(ancestor, oFF.OrcaResourceConstants.AUTH_READ) || !oFF.OrcaContentlibResourceUtils.canFolderShowInUi(resourceId))
				{
					continue;
				}
				let displayName = ancestor.getStringByKey(oFF.OrcaResourceConstants.NAME);
				fileUrl = oFF.XStringUtils.concatenate3(fileUrl, "/", resourceId);
				let ancestorPath = ancestorsPath.addNewStructure();
				if (this.shouldUseDescriptionAsDisplayName(resourceId))
				{
					displayName = ancestor.getStringByKey(oFF.OrcaResourceConstants.DESCRIPTION);
				}
				ancestorPath.putString(oFF.XFileAttribute.UNIQUE_ID, resourceId);
				ancestorPath.putString(oFF.XFileAttribute.DISPLAY_NAME, displayName);
			}
		}
		fileUrl = oFF.XStringUtils.concatenate3(fileUrl, "/", this.m_metadata.getStringByKey(oFF.XFileAttribute.UNIQUE_ID));
		this.m_metadata.putBoolean(oFF.XFileAttribute.IS_LINK, true);
		if (this.m_file.isDirectory())
		{
			fileUrl = oFF.XStringUtils.concatenate2(fileUrl, "/");
		}
		this.m_metadata.putString(oFF.XFileAttribute.PROVIDER_LINK_URL, fileUrl);
	}
	else if (isShared)
	{
		let ancestorName = oFF.OrcaResourceConstants.MY_FILES_VIRTUAL_FOLDER;
		let ancestorDescription = oFF.OrcaResourceConstants.MY_FILES_DISPLAY_NAME;
		let ancestorsPath = this.m_metadata.putNewList(oFF.XFileAttribute.ANCESTOR_RESOURCE);
		let myFiles = ancestorsPath.addNewStructure();
		myFiles.putString(oFF.XFileAttribute.UNIQUE_ID, ancestorName);
		myFiles.putString(oFF.XFileAttribute.DISPLAY_NAME, ancestorDescription);
	}
	else if (this.m_file.isVirtual())
	{
		let fileUrl = oFF.XStringUtils.concatenate3("/", this.m_file.getName(), "/");
		this.m_metadata.putString(oFF.XFileAttribute.PROVIDER_LINK_URL, fileUrl);
	}
};
oFF.OrcaFileMetadataUtils.prototype.addMetadataIfPresent = function(resource, resourceProperty, fileAttribute)
{
	if (oFF.notNull(resource) && resource.containsKey(resourceProperty))
	{
		let isDate = oFF.XString.isEqual(oFF.OrcaResourceConstants.CREATED_TIME, resourceProperty) || oFF.XString.isEqual(oFF.OrcaResourceConstants.MODIFIED_TIME, resourceProperty);
		if (fileAttribute.isString())
		{
			this.m_metadata.putString(fileAttribute.getName(), resource.getStringByKey(resourceProperty));
		}
		else if (fileAttribute.isBoolean())
		{
			this.m_metadata.putBoolean(fileAttribute.getName(), resource.getBooleanByKey(resourceProperty));
		}
		else if (fileAttribute.isInteger())
		{
			if (isDate)
			{
				let date = resource.getStringByKey(resourceProperty);
				let convertedDate = oFF.XDateTime.createDateTimeFromIsoFormat(date);
				this.m_metadata.putLong(fileAttribute.getName(), convertedDate.getMilliseconds());
			}
			else
			{
				this.m_metadata.putInteger(fileAttribute.getName(), resource.getIntegerByKey(resourceProperty));
			}
		}
	}
};
oFF.OrcaFileMetadataUtils.prototype.getContentlibAttributeFromFileAttribute = function(attributeName)
{
	return this.m_metadataMap.getByKey(attributeName);
};
oFF.OrcaFileMetadataUtils.prototype.setFileMetadata = function(contentlibResource)
{
	if (oFF.isNull(contentlibResource) && oFF.isNull(this.m_file))
	{
		throw oFF.XException.createIllegalArgumentException("Cannot set metadata without a valid resource from the contentlib and a valid file");
	}
	this.m_metadata = this.m_file.getProviderMetadata();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(contentlibResource.getStringByKey(oFF.OrcaResourceConstants.RESOURCE_ID)))
	{
		this.m_file.setProviderIsExisting(true);
	}
	this.m_metadata.putString(oFF.XFileAttribute.HOST_NAME, this.m_file.getFsBase().getHostName());
	this.m_metadata.putString(oFF.XFileAttribute.UNIQUE_ID, contentlibResource.getStringByKey(oFF.OrcaResourceConstants.RESOURCE_ID));
	this.m_metadata.putString(oFF.XFileAttribute.DISPLAY_NAME, contentlibResource.getStringByKey(oFF.OrcaResourceConstants.NAME));
	this.m_metadata.putString(oFF.XFileAttribute.DESCRIPTION, contentlibResource.getStringByKey(oFF.OrcaResourceConstants.DESCRIPTION));
	this.m_metadata.putString(oFF.XFileAttribute.ICON, this.m_file.getFsBase().getIconName(contentlibResource));
	this.addMetadataIfPresent(contentlibResource, oFF.OrcaResourceConstants.OWNER_ID, oFF.XFileAttributeDef.OWNER_FOLDER);
	this.addMetadataIfPresent(contentlibResource, oFF.OrcaResourceConstants.OWNER_TYPE, oFF.XFileAttributeDef.OWNER_TYPE);
	this.addMetadataIfPresent(contentlibResource, oFF.OrcaResourceConstants.PARENT_RES_ID, oFF.XFileAttributeDef.PARENT_UNIQUE_ID);
	this.addMetadataIfPresent(contentlibResource, oFF.OrcaResourceConstants.UPDATE_COUNTER, oFF.XFileAttributeDef.UPDATE_COUNT);
	this.addMetadataIfPresent(contentlibResource, oFF.OrcaResourceConstants.ORIG_LANGUAGE, oFF.XFileAttributeDef.ORIGINAL_LANGUAGE);
	this.addMetadataIfPresent(contentlibResource, oFF.OrcaResourceConstants.PACKAGE_ID, oFF.XFileAttributeDef.PACKAGE_ID);
	this.addMetadataIfPresent(contentlibResource, oFF.OrcaResourceConstants.RESOURCE_TYPE, oFF.XFileAttributeDef.NODE_TYPE);
	this.m_file.setIsDirectory(oFF.OrcaContentlibResourceUtils.isFolder(contentlibResource));
	this.addMetadataIfPresent(contentlibResource, oFF.OrcaResourceConstants.RESOURCE_SUBTYPE, oFF.XFileAttributeDef.NODE_SUB_TYPE);
	this.addMetadataIfPresent(contentlibResource, oFF.OrcaResourceConstants.MOBILE_SUPPORT, oFF.XFileAttributeDef.MOBILE_SUPPORT);
	this.addMetadataIfPresent(contentlibResource, oFF.OrcaResourceConstants.CREATED_BY, oFF.XFileAttributeDef.CREATED_BY);
	this.addMetadataIfPresent(contentlibResource, oFF.OrcaResourceConstants.MODIFIED_BY, oFF.XFileAttributeDef.CHANGED_BY);
	this.addMetadataIfPresent(contentlibResource, oFF.OrcaResourceConstants.CREATED_TIME, oFF.XFileAttributeDef.CREATED_AT);
	this.addMetadataIfPresent(contentlibResource, oFF.OrcaResourceConstants.MODIFIED_TIME, oFF.XFileAttributeDef.CHANGED_AT);
	this.addMetadataIfPresent(contentlibResource, oFF.OrcaResourceConstants.CREATED_BY_DISPLAY_NAME, oFF.XFileAttributeDef.CREATED_BY_DISPLAY_NAME);
	this.addMetadataIfPresent(contentlibResource, oFF.OrcaResourceConstants.MODIFIED_BY_DISPLAY_NAME, oFF.XFileAttributeDef.CHANGED_BY_DISPLAY_NAME);
	this.addMetadataIfPresent(contentlibResource, oFF.OrcaResourceConstants.IS_SHARED, oFF.XFileAttributeDef.IS_SHARED);
	this.addMetadataIfPresent(contentlibResource, oFF.OrcaResourceConstants.SHARED_TO_ANY, oFF.XFileAttributeDef.SHARED_TO_ANY);
	this.addMetadataIfPresent(contentlibResource, oFF.OrcaResourceConstants.SHARED, oFF.XFileAttributeDef.SHARED);
	this.addMetadataIfPresent(contentlibResource, oFF.OrcaResourceConstants.CAN_SHARE, oFF.XFileAttributeDef.SHAREABLE);
	this.addMetadataIfPresent(contentlibResource, oFF.OrcaResourceConstants.MODIFIED_BY_DISPLAY_NAME, oFF.XFileAttributeDef.CHANGED_BY_DISPLAY_NAME);
	this.addMetadataIfPresent(contentlibResource, oFF.OrcaResourceConstants.CAN_SHARE, oFF.XFileAttributeDef.SHAREABLE);
	this.addMetadataIfPresent(contentlibResource, oFF.OrcaResourceConstants.SPACE_ID, oFF.XFileAttributeDef.SPACE_ID);
	this.addMetadataIfPresent(contentlibResource, oFF.OrcaResourceConstants.OBJECT_ID, oFF.XFileAttributeDef.SAC_EPM_OBJECT_ID);
	if (contentlibResource.containsKey(oFF.OrcaResourceConstants.AUTH))
	{
		let authStructure = contentlibResource.getStructureByKey(oFF.OrcaResourceConstants.AUTH);
		this.addMetadataIfPresent(authStructure, oFF.OrcaResourceConstants.AUTH_ASSIGN, oFF.XFileAttributeDef.CAN_ASSIGN);
		this.addMetadataIfPresent(authStructure, oFF.OrcaResourceConstants.AUTH_READ, oFF.XFileAttributeDef.CAN_READ);
		this.addMetadataIfPresent(authStructure, oFF.OrcaResourceConstants.AUTH_UPDATE, oFF.XFileAttributeDef.CAN_UPDATE);
		this.addMetadataIfPresent(authStructure, oFF.OrcaResourceConstants.AUTH_DELETE, oFF.XFileAttributeDef.CAN_DELETE);
		this.addMetadataIfPresent(authStructure, oFF.OrcaResourceConstants.AUTH_CREATE_DOC, oFF.XFileAttributeDef.CAN_CREATE_DOC);
		this.addMetadataIfPresent(authStructure, oFF.OrcaResourceConstants.AUTH_CREATE_FOLDER, oFF.XFileAttributeDef.CAN_CREATE_FOLDER);
		this.addMetadataIfPresent(authStructure, oFF.OrcaResourceConstants.AUTH_COPY, oFF.XFileAttributeDef.CAN_COPY);
		this.addMetadataIfPresent(authStructure, oFF.OrcaResourceConstants.AUTH_COMMENT_VIEW, oFF.XFileAttributeDef.CAN_COMMENT_VIEW);
		this.addMetadataIfPresent(authStructure, oFF.OrcaResourceConstants.AUTH_COMMENT_ADD, oFF.XFileAttributeDef.CAN_COMMENT_ADD);
		this.addMetadataIfPresent(authStructure, oFF.OrcaResourceConstants.AUTH_COMMENT_DELETE, oFF.XFileAttributeDef.CAN_COMMENT_DELETE);
		this.addMetadataIfPresent(authStructure, oFF.OrcaResourceConstants.AUTH_MAINTAIN, oFF.XFileAttributeDef.CAN_MAINTAIN);
	}
	if (oFF.XString.isEqual(oFF.OrcaResourceConstants.RESOURCE_TYPE_INSIGHT, contentlibResource.getStringByKeyExt(oFF.OrcaResourceConstants.RESOURCE_SUBTYPE, null)))
	{
		this.addMetadataIfPresent(contentlibResource.getStructureByKey(oFF.OrcaResourceConstants.ENHANCED_PROPERTIES), oFF.OrcaResourceConstants.DATA_ANAYZER_INFO_VALUE, oFF.XFileAttributeDef.SOURCE_PROGRAM);
	}
	this.m_metadata.putBoolean(oFF.XFileAttribute.IGNORE_QUICKFILTERS, oFF.OrcaContentlibResourceUtils.shouldIgnoreQuickFilters(contentlibResource.getStringByKey(oFF.OrcaResourceConstants.RESOURCE_ID)));
	if (!this.m_metadata.containsKey(oFF.XFileAttribute.IS_WORKSPACE_FILE) || contentlibResource.containsKey(oFF.OrcaResourceConstants.SPACE_ID))
	{
		let isWorkspaceFile = oFF.OrcaContentlibResourceUtils.isWorkspaceResource(contentlibResource);
		this.m_metadata.putBoolean(oFF.XFileAttribute.IS_WORKSPACE_FILE, isWorkspaceFile);
	}
	this.addFilePathMetadata(contentlibResource);
	if (contentlibResource.containsKey(oFF.OrcaResourceConstants.CDATA) && contentlibResource.getStructureByKey(oFF.OrcaResourceConstants.CDATA) !== null)
	{
		this.m_file.getName();
		let content = oFF.XContent.createJsonObjectContent(oFF.ContentType.APPLICATION_JSON, contentlibResource.getStructureByKey(oFF.OrcaResourceConstants.CDATA));
		this.m_file.setProviderFileContent(content);
	}
	let sourceRes = contentlibResource.getStructureByKey(oFF.OrcaResourceConstants.SOURCE_RESOURCE);
	let containsSourceRes = oFF.notNull(sourceRes) && !sourceRes.isEmpty() && oFF.XStringUtils.isNotNullAndNotEmpty(sourceRes.getStringByKey(oFF.OrcaResourceConstants.RESOURCE_ID));
	let isLinkResource = this.m_file.isLinkNodeType();
	if (isLinkResource && containsSourceRes)
	{
		let sourceResource = oFF.OrcaFile.create(contentlibResource.getStructureByKey(oFF.OrcaResourceConstants.SOURCE_RESOURCE), this.m_file.getProcess(), this.m_file.getProviderFileSystem(), this.m_file.getUri());
		this.m_file.setLinkedFile(sourceResource);
		this.m_file.getProviderMetadata().put(oFF.XFileAttribute.SOURCE_RESOURCE, sourceResource.getProviderMetadata());
		this.m_file.getProviderMetadata().putString(oFF.XFileAttribute.DISPLAY_NAME, sourceResource.getProviderMetadata().getStringByKey(oFF.XFileAttribute.DISPLAY_NAME));
		this.m_file.getProviderMetadata().putString(oFF.XFileAttribute.DESCRIPTION, sourceResource.getProviderMetadata().getStringByKey(oFF.XFileAttribute.DESCRIPTION));
		this.m_file.getProviderMetadata().putString(oFF.XFileAttribute.ICON, sourceResource.getProviderMetadata().getStringByKey(oFF.XFileAttribute.ICON));
	}
	this.updateFileName();
	this.updateSharingAttribute();
};
oFF.OrcaFileMetadataUtils.prototype.setupUtils = function()
{
	this.m_metadataMap = oFF.XHashMapByString.create();
	this.m_metadataMap.put(oFF.XFileAttribute.UNIQUE_ID, oFF.OrcaResourceConstants.RESOURCE_ID);
	this.m_metadataMap.put(oFF.XFileAttribute.DISPLAY_NAME, oFF.OrcaResourceConstants.NAME);
	this.m_metadataMap.put(oFF.XFileAttribute.NAME, oFF.OrcaResourceConstants.NAME);
	this.m_metadataMap.put(oFF.XFileAttribute.DESCRIPTION, oFF.OrcaResourceConstants.DESCRIPTION);
	this.m_metadataMap.put(oFF.XFileAttribute.CREATED_BY, oFF.OrcaResourceConstants.CREATED_BY);
	this.m_metadataMap.put(oFF.XFileAttribute.NODE_TYPE, oFF.OrcaResourceConstants.RESOURCE_TYPE);
	this.m_metadataMap.put(oFF.XFileAttribute.NODE_SUB_TYPE, oFF.OrcaResourceConstants.RESOURCE_SUBTYPE);
	this.m_metadataMap.put(oFF.XFileAttribute.OWNER_TYPE, oFF.OrcaResourceConstants.OWNER_TYPE);
	this.m_metadataMap.put(oFF.XFileAttribute.PARENT_UNIQUE_ID, oFF.OrcaResourceConstants.PARENT_RES_ID);
	this.m_metadataMap.put(oFF.XFileAttribute.UPDATE_COUNT, oFF.OrcaResourceConstants.UPDATE_COUNTER);
	this.m_metadataMap.put(oFF.XFileAttribute.ORIGINAL_LANGUAGE, oFF.OrcaResourceConstants.ORIG_LANGUAGE);
	this.m_metadataMap.put(oFF.XFileAttribute.PACKAGE_ID, oFF.OrcaResourceConstants.PACKAGE_ID);
	this.m_metadataMap.put(oFF.XFileAttribute.MOBILE_SUPPORT, oFF.OrcaResourceConstants.MOBILE_SUPPORT);
	this.m_metadataMap.put(oFF.XFileAttribute.CHANGED_BY, oFF.OrcaResourceConstants.MODIFIED_BY);
	this.m_metadataMap.put(oFF.XFileAttribute.CREATED_AT, oFF.OrcaResourceConstants.CREATED_TIME);
	this.m_metadataMap.put(oFF.XFileAttribute.CHANGED_AT, oFF.OrcaResourceConstants.MODIFIED_TIME);
	this.m_metadataMap.put(oFF.XFileAttribute.CREATED_BY_DISPLAY_NAME, oFF.OrcaResourceConstants.CREATED_BY_DISPLAY_NAME);
	this.m_metadataMap.put(oFF.XFileAttribute.CHANGED_BY_DISPLAY_NAME, oFF.OrcaResourceConstants.MODIFIED_BY_DISPLAY_NAME);
	this.m_metadataMap.put(oFF.XFileAttribute.IS_SHARED, oFF.OrcaResourceConstants.IS_SHARED);
	this.m_metadataMap.put(oFF.XFileAttribute.SHARED_TO_ANY, oFF.OrcaResourceConstants.SHARED_TO_ANY);
	this.m_metadataMap.put(oFF.XFileAttribute.SHARED, oFF.OrcaResourceConstants.SHARED);
	this.m_metadataMap.put(oFF.XFileAttribute.SHAREABLE, oFF.OrcaResourceConstants.CAN_SHARE);
	this.m_metadataMap.put(oFF.XFileAttribute.OWNER_FOLDER, oFF.OrcaResourceConstants.OWNER_ID);
	this.m_metadataMap.put(oFF.XFileAttribute.CAN_ASSIGN, oFF.OrcaResourceConstants.AUTH_ASSIGN);
	this.m_metadataMap.put(oFF.XFileAttribute.CAN_READ, oFF.OrcaResourceConstants.AUTH_READ);
	this.m_metadataMap.put(oFF.XFileAttribute.CAN_UPDATE, oFF.OrcaResourceConstants.AUTH_UPDATE);
	this.m_metadataMap.put(oFF.XFileAttribute.CAN_DELETE, oFF.OrcaResourceConstants.AUTH_DELETE);
	this.m_metadataMap.put(oFF.XFileAttribute.CAN_CREATE_DOC, oFF.OrcaResourceConstants.AUTH_CREATE_DOC);
	this.m_metadataMap.put(oFF.XFileAttribute.CAN_CREATE_FOLDER, oFF.OrcaResourceConstants.AUTH_CREATE_FOLDER);
	this.m_metadataMap.put(oFF.XFileAttribute.CAN_COPY, oFF.OrcaResourceConstants.AUTH_COPY);
	this.m_metadataMap.put(oFF.XFileAttribute.CAN_COMMENT_VIEW, oFF.OrcaResourceConstants.AUTH_COMMENT_VIEW);
	this.m_metadataMap.put(oFF.XFileAttribute.CAN_COMMENT_ADD, oFF.OrcaResourceConstants.AUTH_COMMENT_ADD);
	this.m_metadataMap.put(oFF.XFileAttribute.CAN_COMMENT_DELETE, oFF.OrcaResourceConstants.AUTH_COMMENT_DELETE);
	this.m_metadataMap.put(oFF.XFileAttribute.CAN_MAINTAIN, oFF.OrcaResourceConstants.AUTH_MAINTAIN);
	this.m_metadataMap.put(oFF.XFileAttribute.CAN_COMMENT_VIEW, oFF.OrcaResourceConstants.AUTH_COMMENT_VIEW);
	this.m_metadataMap.put(oFF.XFileAttribute.CAN_COMMENT_VIEW, oFF.OrcaResourceConstants.AUTH_COMMENT_VIEW);
};
oFF.OrcaFileMetadataUtils.prototype.shouldUseDescriptionAsDisplayName = function(resourceId)
{
	let folders = oFF.XList.create();
	folders.add(oFF.OrcaResourceConstants.RESOURCE_ID_ROOT);
	folders.add(oFF.OrcaResourceConstants.RESOURCE_ID_PUBLIC);
	folders.add(oFF.OrcaResourceConstants.RESOURCE_ID_SHARED);
	folders.add(oFF.OrcaResourceConstants.RESOURCE_ID_TEAMS);
	folders.add(oFF.OrcaResourceConstants.RESOURCE_ID_USERS);
	let isInputForms = oFF.OrcaContentlibResourceUtils.isInputFormsFolder(resourceId);
	let validOwnerType = this.m_metadata.containsKey(oFF.XFileAttribute.OWNER_TYPE) && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_metadata.getStringByKey(oFF.XFileAttribute.OWNER_TYPE));
	let isSample = oFF.XString.isEqual(oFF.OrcaResourceConstants.RESOURCE_ID_SAMPLES, resourceId) && validOwnerType;
	return folders.contains(resourceId) || isSample || isInputForms;
};
oFF.OrcaFileMetadataUtils.prototype.updateFileName = function()
{
	let resourceId = this.m_metadata.getStringByKeyExt(oFF.XFileAttribute.UNIQUE_ID, "");
	if (this.shouldUseDescriptionAsDisplayName(resourceId))
	{
		this.m_metadata.putString(oFF.XFileAttribute.DISPLAY_NAME, this.m_metadata.getStringByKey(oFF.XFileAttribute.DESCRIPTION));
	}
};
oFF.OrcaFileMetadataUtils.prototype.updateSharingAttribute = function()
{
	let resourceId = this.m_metadata.getStringByKeyExt(oFF.XFileAttribute.UNIQUE_ID, "");
	let folders = oFF.XList.create();
	folders.add(oFF.OrcaResourceConstants.RESOURCE_ID_SAMPLES);
	folders.add(oFF.OrcaResourceConstants.RESOURCE_ID_TEAMS);
	folders.add(oFF.OrcaResourceConstants.RESOURCE_ID_USERS);
	folders.add(oFF.OrcaResourceConstants.RESOURCE_ID_INPUT_SCHEDULE);
	if (folders.contains(resourceId))
	{
		this.m_metadata.putBoolean(oFF.XFileAttribute.IS_SHARED, false);
	}
};

oFF.OrcaResponseFilterFactory = function() {};
oFF.OrcaResponseFilterFactory.prototype = new oFF.XObjectExt();
oFF.OrcaResponseFilterFactory.prototype._ff_c = "OrcaResponseFilterFactory";

oFF.OrcaResponseFilterFactory.getDragonflyInsightFilter = function()
{
	return (file) => {
		let isInsight = oFF.XString.isEqual(oFF.OrcaResourceConstants.RESOURCE_TYPE_INSIGHT, file.getProviderMetadata().getStringByKeyExt(oFF.XFileAttribute.NODE_SUB_TYPE, null));
		let isDragonflyInsight = isInsight && oFF.XString.isEqual(oFF.OrcaResourceConstants.DATA_ANALYZER_ENHANCED_PROPERTY, file.getProviderMetadata().getStringByKeyExt(oFF.XFileAttribute.SOURCE_PROGRAM, null));
		return isDragonflyInsight;
	};
};
oFF.OrcaResponseFilterFactory.getSearchResponseFilterBySubtype = function()
{
	return (file, query) => {
		let md = file.getProviderMetadata();
		let fileNodeType = md.getStringByKeyExt(oFF.XFileAttribute.NODE_TYPE, null);
		let fileNodeSubtype = md.getStringByKeyExt(oFF.XFileAttribute.NODE_SUB_TYPE, null);
		if (oFF.XString.isEqual(fileNodeType, oFF.OrcaResourceConstants.RESOURCE_TYPE_FOLDER))
		{
			return true;
		}
		let allowedResourceSubTypes = oFF.XList.create();
		let allowedResourceTypes = oFF.XList.create();
		let filters = query.getCartesianFilter();
		for (let i = 0; i < filters.size(); i++)
		{
			let currentFilter = filters.get(i);
			let value = currentFilter.getValue();
			let name = currentFilter.getName();
			if (oFF.XString.isEqual(name, oFF.XFileAttribute.NODE_TYPE))
			{
				allowedResourceTypes.add(value);
			}
			else if (oFF.XString.isEqual(name, oFF.XFileAttribute.NODE_SUB_TYPE))
			{
				allowedResourceSubTypes.add(value);
			}
		}
		let isFileNodeTypeAllowed = true;
		if (allowedResourceTypes.size() > 0)
		{
			isFileNodeTypeAllowed = allowedResourceTypes.contains(fileNodeType);
		}
		let isFileSubtypeAllowed = true;
		if (allowedResourceSubTypes.size() > 0)
		{
			isFileNodeTypeAllowed = allowedResourceSubTypes.contains(fileNodeSubtype);
		}
		if (isFileNodeTypeAllowed && isFileSubtypeAllowed)
		{
			return true;
		}
		return false;
	};
};

oFF.ContentlibRequestAction = function() {};
oFF.ContentlibRequestAction.prototype = new oFF.XConstant();
oFF.ContentlibRequestAction.prototype._ff_c = "ContentlibRequestAction";

oFF.ContentlibRequestAction.CREATE_CONTENT = null;
oFF.ContentlibRequestAction.CREATE_FOLDER = null;
oFF.ContentlibRequestAction.GET_ACCESS_DETAILS = null;
oFF.ContentlibRequestAction.GET_ANCESTOR_AND_SUB_NODES = null;
oFF.ContentlibRequestAction.GET_CONTENT = null;
oFF.ContentlibRequestAction.GET_RECENT_FILES = null;
oFF.ContentlibRequestAction.GET_REPO_VIEW = null;
oFF.ContentlibRequestAction.GET_RESOURCE_EX = null;
oFF.ContentlibRequestAction.GET_RESOURCE_WITH_NAME_EXISTS = null;
oFF.ContentlibRequestAction.GET_SPACE_VIEW = null;
oFF.ContentlibRequestAction.GET_SUB_NODES = null;
oFF.ContentlibRequestAction.RENAME_RESOURCE = null;
oFF.ContentlibRequestAction.SEARCH_ALL_RESOURCES = null;
oFF.ContentlibRequestAction.SHARE_FILE = null;
oFF.ContentlibRequestAction.STAGE_DELETE_LIST = null;
oFF.ContentlibRequestAction.UPDATE_CONTENT = null;
oFF.ContentlibRequestAction.s_lookup = null;
oFF.ContentlibRequestAction.create = function(name)
{
	let type = new oFF.ContentlibRequestAction();
	type.setupConstant(name);
	oFF.ContentlibRequestAction.s_lookup.put(name, type);
	return type;
};
oFF.ContentlibRequestAction.lookup = function(name)
{
	return oFF.ContentlibRequestAction.s_lookup.getByKey(name);
};
oFF.ContentlibRequestAction.staticSetup = function()
{
	oFF.ContentlibRequestAction.s_lookup = oFF.XHashMapByString.create();
	oFF.ContentlibRequestAction.GET_ANCESTOR_AND_SUB_NODES = oFF.ContentlibRequestAction.create("getAncestorsAndSubNodes");
	oFF.ContentlibRequestAction.CREATE_CONTENT = oFF.ContentlibRequestAction.create("createContent");
	oFF.ContentlibRequestAction.CREATE_FOLDER = oFF.ContentlibRequestAction.create("createFolder");
	oFF.ContentlibRequestAction.GET_CONTENT = oFF.ContentlibRequestAction.create("getContent");
	oFF.ContentlibRequestAction.GET_RESOURCE_EX = oFF.ContentlibRequestAction.create("getResourceEx");
	oFF.ContentlibRequestAction.GET_RESOURCE_WITH_NAME_EXISTS = oFF.ContentlibRequestAction.create("getResourceWithNameExists");
	oFF.ContentlibRequestAction.GET_SUB_NODES = oFF.ContentlibRequestAction.create("getSubNodes");
	oFF.ContentlibRequestAction.GET_RECENT_FILES = oFF.ContentlibRequestAction.create("getRecentFiles");
	oFF.ContentlibRequestAction.RENAME_RESOURCE = oFF.ContentlibRequestAction.create("renameResource");
	oFF.ContentlibRequestAction.GET_REPO_VIEW = oFF.ContentlibRequestAction.create("getRepoView");
	oFF.ContentlibRequestAction.SEARCH_ALL_RESOURCES = oFF.ContentlibRequestAction.create("searchAllResources");
	oFF.ContentlibRequestAction.GET_SPACE_VIEW = oFF.ContentlibRequestAction.create("getSpaceView");
	oFF.ContentlibRequestAction.STAGE_DELETE_LIST = oFF.ContentlibRequestAction.create("stageDeleteList");
	oFF.ContentlibRequestAction.UPDATE_CONTENT = oFF.ContentlibRequestAction.create("updateContent");
	oFF.ContentlibRequestAction.GET_ACCESS_DETAILS = oFF.ContentlibRequestAction.create("getAccessDetails");
	oFF.ContentlibRequestAction.SHARE_FILE = oFF.ContentlibRequestAction.create("shareFile");
};

oFF.OrcaFile = function() {};
oFF.OrcaFile.prototype = new oFF.DfXFileProviderFinalFile();
oFF.OrcaFile.prototype._ff_c = "OrcaFile";

oFF.OrcaFile._create = function(process, fileSystem, uri, isVirtual)
{
	let orcaFs = fileSystem;
	let file = orcaFs.getFileFromCache(uri);
	if (oFF.isNull(file))
	{
		file = new oFF.OrcaFile();
		file.setupOrcaFile(process, fileSystem, uri);
		let fileName = uri.getPathContainer().getFileName();
		let isRootDirectory = oFF.XString.isEqual(fileSystem.getRootDirectoryUri().getPath(), uri.getPath());
		let metadata = oFF.PrFactory.createStructure();
		file.setProviderMetadata(metadata);
		metadata.putAll(file.getProviderMetadata());
		if (isRootDirectory)
		{
			file.setProviderIsExisting(true);
			metadata.putString(oFF.XFileAttribute.NODE_TYPE, oFF.OrcaResourceConstants.RESOURCE_TYPE_FOLDER);
			file.setIsDirectory(true);
			metadata.putBoolean(oFF.XFileAttribute.IS_WRITEABLE, false);
			metadata.putBoolean(oFF.XFileAttribute.IS_READABLE, true);
			metadata.putBoolean(oFF.XFileAttribute.IS_FILE, false);
			metadata.putBoolean(oFF.XFileAttribute.IS_DIRECTORY, true);
			metadata.putBoolean(oFF.XFileAttribute.IS_EXECUTABLE, false);
			file.setSupportedQueryOptions(metadata);
		}
		else if (isVirtual)
		{
			if (oFF.XString.isEqual(fileName, oFF.OrcaResourceConstants.MY_FILES_VIRTUAL_FOLDER))
			{
				file.setProviderIsExisting(true);
				metadata.putString(oFF.XFileAttribute.NODE_TYPE, oFF.OrcaResourceConstants.RESOURCE_TYPE_FOLDER);
				metadata.putString(oFF.XFileAttribute.UNIQUE_ID, file.getFsBase().getPrivateFolderName());
				metadata.putString(oFF.XFileAttribute.DISPLAY_NAME, oFF.OrcaResourceConstants.MY_FILES_DISPLAY_NAME);
				metadata.putBoolean(oFF.XFileAttribute.IS_WRITEABLE, true);
			}
			else if (oFF.XString.isEqual(fileName, oFF.OrcaResourceConstants.CATALOG_VIRTUAL_FOLDER) || oFF.XString.isEqual(fileName, oFF.OrcaResourceConstants.WORKSPACES_VIRTUAL_FOLDER) || oFF.XString.isEqual(fileName, oFF.OrcaResourceConstants.RECENT_FILES_VIRTUAL_FOLDER))
			{
				file.setProviderIsExisting(true);
				metadata.putString(oFF.XFileAttribute.NODE_TYPE, oFF.OrcaResourceConstants.RESOURCE_TYPE_FOLDER);
				metadata.putString(oFF.XFileAttribute.UNIQUE_ID, fileName);
				metadata.putString(oFF.XFileAttribute.DISPLAY_NAME, fileName);
				metadata.putBoolean(oFF.XFileAttribute.IS_WRITEABLE, false);
			}
			if (oFF.XString.isEqual(fileName, oFF.OrcaResourceConstants.RECENT_FILES_VIRTUAL_FOLDER))
			{
				file.m_hidden = true;
				metadata.putString(oFF.XFileAttribute.DISPLAY_NAME, oFF.OrcaResourceConstants.RECENT_FILES_DISPLAY_NAME);
			}
			file.setIsDirectory(true);
			metadata.putBoolean(oFF.XFileAttribute.IS_READABLE, true);
			metadata.putBoolean(oFF.XFileAttribute.IS_FILE, false);
			metadata.putBoolean(oFF.XFileAttribute.IS_DIRECTORY, true);
			metadata.putBoolean(oFF.XFileAttribute.IS_EXECUTABLE, false);
			file.setSupportedQueryOptions(metadata);
		}
		else
		{
			metadata.putString(oFF.XFileAttribute.DISPLAY_NAME, fileName);
			let nodeTypeValue = uri.getQueryElementValue(oFF.XFileAttribute.NODE_TYPE);
			if (oFF.notNull(nodeTypeValue))
			{
				metadata.putString(oFF.XFileAttribute.NODE_TYPE, nodeTypeValue);
			}
		}
		let parentPath = uri.getPathContainer().getParentPath();
		if (oFF.notNull(parentPath))
		{
			let pathElements = oFF.XStringTokenizer.splitString(parentPath, "/");
			let elementCount = pathElements.size();
			let parentFileName = pathElements.get(elementCount - 2);
			if (oFF.XString.isEqual(parentFileName, oFF.OrcaResourceConstants.MY_FILES_VIRTUAL_FOLDER))
			{
				metadata.putString(oFF.XFileAttribute.PARENT_UNIQUE_ID, file.getFsBase().getPrivateFolderName());
			}
			else
			{
				if (!oFF.XString.isEqual("", parentFileName))
				{
					let parent = file.getProviderParent();
					let parentName = parent.getProviderMetadata().getStringByKeyExt(oFF.XFileAttribute.UNIQUE_ID, file.getProviderParent().getName());
					metadata.putString(oFF.XFileAttribute.PARENT_UNIQUE_ID, parentName);
				}
			}
		}
		metadata.putString(oFF.XFileAttribute.SYSTEM_NAME, file.getFsBase().getOrcaConnection().getSystemName());
		metadata.putString(oFF.XFileAttribute.FILE_TYPE, metadata.getStringByKey(oFF.XFileAttribute.NODE_TYPE));
		metadata.putLong(oFF.XFileAttribute.SIZE, -1);
		metadata.putLong(oFF.XFileAttribute.CHANGED_AT, -1);
		metadata.putBoolean(oFF.XFileAttribute.IS_HIDDEN, file.m_hidden);
		metadata.putBoolean(oFF.XFileAttribute.IS_EXISTING, file.getProviderIsExisting());
		file.setProviderMetadata(metadata);
		if (file.isVirtual() || isRootDirectory)
		{
			orcaFs.addFileToCache(file.getUri().getPathContainer().getFileName(), file);
		}
	}
	return file;
};
oFF.OrcaFile.create = function(contentlibResource, process, fs, uri)
{
	let orcaFs = fs;
	let isFolder = oFF.OrcaContentlibResourceUtils.isFolder(contentlibResource);
	let fileUri;
	if (isFolder)
	{
		fileUri = oFF.XUri.createChildDir(uri, contentlibResource.getStringByKey(oFF.OrcaResourceConstants.RESOURCE_ID));
	}
	else
	{
		fileUri = oFF.XUri.createChildFile(uri, contentlibResource.getStringByKey(oFF.OrcaResourceConstants.RESOURCE_ID));
	}
	let file = orcaFs.getFileFromCache(fileUri);
	if (oFF.isNull(file))
	{
		file = new oFF.OrcaFile();
		file.setupOrcaFile(process, fs, fileUri);
		file.setProviderMetadata(oFF.PrStructure.create());
	}
	file.setProviderIsExisting(true);
	file.getProviderMetadata().putString(oFF.XFileAttribute.SYSTEM_NAME, file.getFsBase().getOrcaConnection().getSystemName());
	file.setMetadataInternal(contentlibResource);
	orcaFs.addFileToCache(file.getUri().getPathContainer().getFileName(), file);
	return file;
};
oFF.OrcaFile.createFolder = function(contentlibResource, process, fs, vfsUri, isFolder)
{
	let file = oFF.OrcaFile.create(contentlibResource, process, fs, vfsUri);
	file.setIsDirectory(isFolder);
	return file;
};
oFF.OrcaFile.createFromCache = function(process, fs, uri, metadata)
{
	let file = new oFF.OrcaFile();
	file.setupOrcaFile(process, fs, uri);
	file.setProviderMetadata(metadata);
	file.m_isDir = oFF.XString.isEqual(oFF.OrcaResourceConstants.RESOURCE_TYPE_FOLDER, file.getProviderMetadata().getStringByKey(oFF.XFileAttribute.NODE_TYPE));
	file.setProviderIsExisting(true);
	file.setSupportedQueryOptions(file.getProviderMetadata());
	return file;
};
oFF.OrcaFile.prototype.m_accessState = null;
oFF.OrcaFile.prototype.m_attributesForChanges = null;
oFF.OrcaFile.prototype.m_fileAttributeUtils = null;
oFF.OrcaFile.prototype.m_hidden = false;
oFF.OrcaFile.prototype.m_isDir = false;
oFF.OrcaFile.prototype.addExtendedMetadata = function()
{
	let metadata = this.getProviderMetadata();
	metadata.putString(oFF.XFileAttribute.FILE_TYPE, metadata.getStringByKey(oFF.XFileAttribute.NODE_TYPE));
	metadata.putLong(oFF.XFileAttribute.SIZE, -1);
	metadata.putLong(oFF.XFileAttribute.CHANGED_AT, metadata.getLongByKey(oFF.XFileAttribute.CHANGED_AT));
	metadata.putBoolean(oFF.XFileAttribute.IS_HIDDEN, this.m_hidden);
	metadata.putBoolean(oFF.XFileAttribute.IS_WRITEABLE, metadata.getBooleanByKey(oFF.XFileAttribute.CAN_UPDATE));
	metadata.putBoolean(oFF.XFileAttribute.IS_READABLE, metadata.getBooleanByKey(oFF.XFileAttribute.CAN_READ));
	metadata.putBoolean(oFF.XFileAttribute.IS_EXISTING, this.getProviderIsExisting());
	metadata.putBoolean(oFF.XFileAttribute.IS_EXECUTABLE, false);
	let resourceType = metadata.getStringByKey(oFF.XFileAttribute.NODE_TYPE);
	let isFile = !oFF.XString.isEqual(oFF.OrcaResourceConstants.RESOURCE_TYPE_FOLDER, resourceType);
	metadata.putBoolean(oFF.XFileAttribute.IS_FILE, isFile);
	metadata.putBoolean(oFF.XFileAttribute.IS_DIRECTORY, !isFile);
	this.setSupportedQueryOptions(metadata);
};
oFF.OrcaFile.prototype.getAccessState = function()
{
	return this.m_accessState;
};
oFF.OrcaFile.prototype.getAttributesForChanges = function()
{
	if (oFF.isNull(this.m_attributesForChanges))
	{
		this.m_attributesForChanges = oFF.PrFactory.createStructure();
	}
	return this.m_attributesForChanges;
};
oFF.OrcaFile.prototype.getDestinationFile = function()
{
	let destinationFile = this;
	if (this.isLinkNodeType())
	{
		destinationFile = this.getLinkedFile();
	}
	return destinationFile;
};
oFF.OrcaFile.prototype.getFsBase = function()
{
	return this.m_fs;
};
oFF.OrcaFile.prototype.getLastModifiedTimestamp = function()
{
	if (this.getProviderMetadata().containsKey(oFF.XFileAttribute.CHANGED_AT))
	{
		return this.getProviderMetadata().getLongByKey(oFF.XFileAttribute.CHANGED_AT);
	}
	return 0;
};
oFF.OrcaFile.prototype.getLinkedFile = function()
{
	return this.getFsBase().getLinkFromCache(this.getProviderMetadata().getStringByKey(oFF.XFileAttribute.UNIQUE_ID), this.getUri());
};
oFF.OrcaFile.prototype.getProviderAttributes = function()
{
	return this.getProviderMetadata();
};
oFF.OrcaFile.prototype.getProviderParent = function()
{
	let parentUri = oFF.XUri.createParent(this.getUri());
	let parent = this.getFsBase().newFile(this.getProcess(), parentUri);
	return parent;
};
oFF.OrcaFile.prototype.isDirectory = function()
{
	return this.m_isDir;
};
oFF.OrcaFile.prototype.isExisting = function()
{
	let isRootDirectory = oFF.XString.isEqual(this.getFsBase().getRootDirectoryUri().getPath(), this.getUri().getPath());
	if (this.getProviderIsExisting())
	{
		return this.getProviderIsExisting();
	}
	else if (this.isVirtual() || isRootDirectory)
	{
		return true;
	}
	else
	{
		return this.processProviderIsExisting(oFF.SyncType.BLOCKING, null, null).getData().getProviderIsExisting();
	}
};
oFF.OrcaFile.prototype.isFile = function()
{
	return !this.isDirectory();
};
oFF.OrcaFile.prototype.isLinkNodeType = function()
{
	let nodeType = this.getProviderMetadata().getStringByKey(oFF.XFileAttribute.NODE_TYPE);
	return oFF.XString.isEqual(oFF.OrcaResourceConstants.RESOURCE_TYPE_LINK, nodeType);
};
oFF.OrcaFile.prototype.isVirtual = function()
{
	let virtualIds = oFF.XList.create();
	virtualIds.add(this.getFsBase().getPrivateFolderName());
	virtualIds.add(oFF.OrcaResourceConstants.CATALOG_VIRTUAL_FOLDER);
	virtualIds.add(oFF.OrcaResourceConstants.WORKSPACES_VIRTUAL_FOLDER);
	virtualIds.add(oFF.OrcaResourceConstants.RECENT_FILES_VIRTUAL_FOLDER);
	return virtualIds.contains(this.getProviderMetadata().getStringByKey(oFF.XFileAttribute.UNIQUE_ID));
};
oFF.OrcaFile.prototype.newChildFile = function(childUri, childMetadata)
{
	let process = this.getProcess();
	let fileSystem = this.getProviderFileSystem();
	let file = oFF.OrcaFile._create(process, fileSystem, childUri, false);
	return file;
};
oFF.OrcaFile.prototype.newFile = function(uri)
{
	return this.getFsBase().newFile(this.getProcess(), uri);
};
oFF.OrcaFile.prototype.processProviderFetchAccessRights = function(syncType, listener, customIdentifier, config)
{
	return this.getFsBase().processFetchAccessRights(syncType, listener, customIdentifier, this, config);
};
oFF.OrcaFile.prototype.processProviderFetchChildren = function(syncType, listener, customIdentifier, config)
{
	let sync = this.getFsBase().processFetchChildren(syncType, listener, customIdentifier, this, config);
	return sync;
};
oFF.OrcaFile.prototype.processProviderFetchMetadata = function(syncType, listener, customIdentifier, cachingType)
{
	return this.getFsBase().processFetchMetadata(syncType, listener, customIdentifier, this);
};
oFF.OrcaFile.prototype.processProviderIsExisting = function(syncType, listener, customIdentifier)
{
	return this.getFsBase().processIsExisting(syncType, listener, customIdentifier, this);
};
oFF.OrcaFile.prototype.processProviderLoad = function(syncType, listener, customIdentifier, compression)
{
	let sync = this.getFsBase().processLoad(syncType, listener, customIdentifier, this, compression);
	return sync;
};
oFF.OrcaFile.prototype.processProviderMkdir = function(syncType, listener, customIdentifier, includeParentDirs, attributes)
{
	this.setIsDirectory(true);
	let sync = this.getFsBase().processMkdir(syncType, listener, customIdentifier, this, includeParentDirs);
	return sync;
};
oFF.OrcaFile.prototype.processProviderSave = function(syncType, listener, customIdentifier, content, compression, attributes, saveMode)
{
	let sync = this.getFsBase().processSave(syncType, listener, customIdentifier, this, content, compression, attributes);
	return sync;
};
oFF.OrcaFile.prototype.processProviderShare = function(syncType, listener, customIdentifier, shareInfo, sendNotificationEmail, isAllUsersWithExistingAccess)
{
	let sync = this.getFsBase().processShare(syncType, listener, customIdentifier, this, shareInfo, sendNotificationEmail, isAllUsersWithExistingAccess);
	return sync;
};
oFF.OrcaFile.prototype.releaseObject = function()
{
	this.m_attributesForChanges = oFF.XObjectExt.release(this.m_attributesForChanges);
	this.m_accessState = oFF.XObjectExt.release(this.m_accessState);
};
oFF.OrcaFile.prototype.setAccessState = function(accessState)
{
	this.m_accessState = accessState;
};
oFF.OrcaFile.prototype.setIsDirectory = function(isDirectory)
{
	this.m_isDir = isDirectory;
};
oFF.OrcaFile.prototype.setLinkedFile = function(sourceResource)
{
	this.getFsBase().addLinkToCache(this.getProviderMetadata().getStringByKey(oFF.XFileAttribute.UNIQUE_ID), sourceResource);
};
oFF.OrcaFile.prototype.setMetadataInternal = function(contentlibResource)
{
	this.m_fileAttributeUtils.setFileMetadata(contentlibResource);
	this.addExtendedMetadata();
};
oFF.OrcaFile.prototype.setSupportedQueryOptions = function(metadata)
{
	let featuresSupported = this.isDirectory();
	let isLinkResource = this.isLinkNodeType();
	if (isLinkResource && this.getLinkedFile() !== null)
	{
		featuresSupported = this.getLinkedFile().isDirectory();
	}
	metadata.putBoolean(oFF.XFileAttribute.SUPPORTS_OFFSET, featuresSupported);
	metadata.putBoolean(oFF.XFileAttribute.SUPPORTS_MAX_ITEMS, featuresSupported);
	metadata.putBoolean(oFF.XFileAttribute.SUPPORTS_SINGLE_SORT, featuresSupported);
	metadata.putBoolean(oFF.XFileAttribute.SUPPORTS_CARTESIAN_FILTER, featuresSupported);
	metadata.putBoolean(oFF.XFileAttribute.SUPPORTS_SEARCH, featuresSupported);
	if (featuresSupported)
	{
		let supportedFilters = metadata.putNewStructure(oFF.XFileAttribute.SUPPORTED_FILTERS);
		supportedFilters.putAll(oFF.OrcaContentlibResourceUtils.getSupportedFilterMetadata());
	}
};
oFF.OrcaFile.prototype.setupOrcaFile = function(process, fileSystem, uri)
{
	this.setupFile(process, fileSystem, uri);
	this.m_fileAttributeUtils = oFF.OrcaFileMetadataUtils.createWithFile(this);
};
oFF.OrcaFile.prototype.supportsProviderFetchChildren = function()
{
	return true;
};
oFF.OrcaFile.prototype.supportsProviderIsExisting = function()
{
	return true;
};
oFF.OrcaFile.prototype.supportsProviderLoad = function()
{
	return true;
};
oFF.OrcaFile.prototype.supportsProviderMkdir = function()
{
	return true;
};
oFF.OrcaFile.prototype.supportsProviderSave = function()
{
	return true;
};
oFF.OrcaFile.prototype.supportsProviderSetLastModified = function()
{
	return false;
};

oFF.SubSysFsContentlibPrg = function() {};
oFF.SubSysFsContentlibPrg.prototype = new oFF.DfSubSysFilesystem();
oFF.SubSysFsContentlibPrg.prototype._ff_c = "SubSysFsContentlibPrg";

oFF.SubSysFsContentlibPrg.DEFAULT_PROGRAM_NAME = "@SubSys.FileSystem.fscontentlib";
oFF.SubSysFsContentlibPrg.FS_PREFIX = "fscontentlib:";
oFF.SubSysFsContentlibPrg.prototype.m_fs = null;
oFF.SubSysFsContentlibPrg.prototype.m_orcaFileSystems = null;
oFF.SubSysFsContentlibPrg.prototype.getAllInitializedFileSystems = function()
{
	if (oFF.isNull(this.m_orcaFileSystems))
	{
		this.m_orcaFileSystems = oFF.XHashMapByString.create();
	}
	return this.m_orcaFileSystems;
};
oFF.SubSysFsContentlibPrg.prototype.getFileSystem = function(protocolType)
{
	return this.m_fs;
};
oFF.SubSysFsContentlibPrg.prototype.getFileSystemByUri = function(uri)
{
	if (oFF.isNull(this.m_orcaFileSystems))
	{
		this.m_orcaFileSystems = oFF.XHashMapByString.create();
	}
	let host = uri.getHost();
	let fs;
	let key = oFF.XStringUtils.concatenate2(oFF.SubSysFsContentlibPrg.FS_PREFIX, host);
	if (this.m_orcaFileSystems.containsKey(key))
	{
		fs = this.m_orcaFileSystems.getByKey(key);
	}
	else
	{
		fs = oFF.OrcaFileSystem.createWithSystem(this.getProcess(), host);
		this.m_orcaFileSystems.put(key, fs);
	}
	this.m_fs = fs;
	return this.m_fs;
};
oFF.SubSysFsContentlibPrg.prototype.getProgramName = function()
{
	return oFF.SubSysFsContentlibPrg.DEFAULT_PROGRAM_NAME;
};
oFF.SubSysFsContentlibPrg.prototype.getProtocolType = function()
{
	return oFF.ProtocolType.FS_CONTENTLIB;
};
oFF.SubSysFsContentlibPrg.prototype.newProgram = function()
{
	let prg = new oFF.SubSysFsContentlibPrg();
	prg.setup();
	return prg;
};
oFF.SubSysFsContentlibPrg.prototype.processFetchFileSystem = function(syncType, listener, customIdentifier, uri)
{
	if (this.getProcess().getConnectionPool() === null)
	{
		this.getProcess().setEntity(oFF.ProcessEntity.CONNECTION_POOL, oFF.ConnectionPool.create(this.getProcess()));
	}
	return oFF.OrcaContentlibFsActionFetch.createAndRun(syncType, listener, customIdentifier, this, uri);
};
oFF.SubSysFsContentlibPrg.prototype.runProcess = function()
{
	this.activateSubSystem(null, oFF.SubSystemStatus.ACTIVE);
	if (this.getProcess().getConnectionPool() === null)
	{
		this.getProcess().setEntity(oFF.ProcessEntity.CONNECTION_POOL, oFF.ConnectionPool.create(this.getProcess()));
	}
	this.m_orcaFileSystems = oFF.XHashMapByString.create();
	return true;
};

oFF.OrcaContentlibFsActionFetch = function() {};
oFF.OrcaContentlibFsActionFetch.prototype = new oFF.SyncActionExt();
oFF.OrcaContentlibFsActionFetch.prototype._ff_c = "OrcaContentlibFsActionFetch";

oFF.OrcaContentlibFsActionFetch.createAndRun = function(syncType, listener, customIdentifier, fsmr, uri)
{
	let object = new oFF.OrcaContentlibFsActionFetch();
	object.m_uri = uri;
	object.setupActionAndRun(syncType, listener, customIdentifier, fsmr);
	return object;
};
oFF.OrcaContentlibFsActionFetch.prototype.m_uri = null;
oFF.OrcaContentlibFsActionFetch.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onFileSystemFetched(extResult, data, customIdentifier);
};
oFF.OrcaContentlibFsActionFetch.prototype.onFileProviderChildrenFetched = function(extResult, file, children, resultset, customIdentifier)
{
	if (extResult.hasErrors())
	{
		this.addAllMessages(extResult);
	}
	this.endSync();
};
oFF.OrcaContentlibFsActionFetch.prototype.processSynchronization = function(syncType)
{
	let fileSystem = this.getActionContext().getFileSystemByUri(this.m_uri);
	this.setData(fileSystem);
	return fileSystem.loadMyFiles(this, syncType);
};
oFF.OrcaContentlibFsActionFetch.prototype.releaseObjectInternal = function() {};

oFF.OrcaFileBaseAction = function() {};
oFF.OrcaFileBaseAction.prototype = new oFF.SyncActionExt();
oFF.OrcaFileBaseAction.prototype._ff_c = "OrcaFileBaseAction";

oFF.OrcaFileBaseAction.SAVE = "save";
oFF.OrcaFileBaseAction.UPDATE = "update";
oFF.OrcaFileBaseAction.prototype.addResponseError = function(response)
{
	let message = "";
	if (oFF.isNull(response))
	{
		message = "Response is null";
	}
	else
	{
		message = oFF.XStringUtils.concatenate2("Response is not correct format: ", response.getRootElementAsString());
	}
	this.addErrorExt(oFF.OriginLayer.IOLAYER, oFF.ErrorCodes.SYSTEM_IO_HTTP, message, null);
};
oFF.OrcaFileBaseAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onHttpFileProcessed(extResult, data, customIdentifier);
};

oFF.OrcaFileSystem = function() {};
oFF.OrcaFileSystem.prototype = new oFF.DfXFileSystem();
oFF.OrcaFileSystem.prototype._ff_c = "OrcaFileSystem";

oFF.OrcaFileSystem.createWithSystem = function(process, systemName)
{
	let newObj = new oFF.OrcaFileSystem();
	newObj.m_fileCache = oFF.XHashMapByString.create();
	newObj.m_linkFileCache = oFF.XHashMapByString.create();
	newObj.m_systemName = systemName;
	newObj.QUERY_GENERATOR_FACTORY = oFF.XSimpleMap.create();
	newObj.setupProcessContext(process);
	return newObj;
};
oFF.OrcaFileSystem.prototype.QUERY_GENERATOR_FACTORY = null;
oFF.OrcaFileSystem.prototype.loadMyFilesListener = null;
oFF.OrcaFileSystem.prototype.m_connection = null;
oFF.OrcaFileSystem.prototype.m_fileCache = null;
oFF.OrcaFileSystem.prototype.m_iconMap = null;
oFF.OrcaFileSystem.prototype.m_linkFileCache = null;
oFF.OrcaFileSystem.prototype.m_relevantSubTypes = null;
oFF.OrcaFileSystem.prototype.m_rootFile = null;
oFF.OrcaFileSystem.prototype.m_serverHostName = null;
oFF.OrcaFileSystem.prototype.m_systemName = null;
oFF.OrcaFileSystem.prototype.m_uniqueIconFolders = null;
oFF.OrcaFileSystem.prototype.addFileToCache = function(key, file)
{
	this.m_fileCache.put(key, file.getProviderMetadata());
};
oFF.OrcaFileSystem.prototype.addLinkToCache = function(key, file)
{
	this.m_linkFileCache.put(key, file.getProviderMetadata());
};
oFF.OrcaFileSystem.prototype.createFileFromCache = function(key, uri)
{
	let metadata = this.m_fileCache.getByKey(key);
	let uriToSet = uri;
	if (oFF.isNull(metadata))
	{
		return null;
	}
	if (metadata.getBooleanByKey(oFF.XFileAttribute.IS_DIRECTORY))
	{
		let url = uri.getUrl();
		let hasTrailingSlash = oFF.XString.endsWith(url, "/");
		if (!hasTrailingSlash)
		{
			url = oFF.XStringUtils.concatenate2(url, "/");
			uriToSet = oFF.XUri.createFromUrl(url);
		}
	}
	return oFF.OrcaFile.createFromCache(this.getProcess(), this, uriToSet, oFF.PrStructure.createDeepCopy(metadata));
};
oFF.OrcaFileSystem.prototype.dropFileFromCache = function(uri)
{
	let key = this.getCleanUri(uri).getPathContainer().getFileName();
	this.m_fileCache.remove(key);
};
oFF.OrcaFileSystem.prototype.getCleanUri = function(uri)
{
	let filePath = uri.getPath();
	let cleanUri = this.mapResourceIdToVirtualIds(filePath);
	return cleanUri;
};
oFF.OrcaFileSystem.prototype.getFileFromCache = function(uri)
{
	let isRootDirectory = oFF.XString.isEqual(this.getRootDirectoryUri().getPath(), uri.getPath());
	let file = null;
	if (isRootDirectory)
	{
		file = this.m_rootFile;
	}
	else
	{
		let cleanUri = this.getCleanUri(uri);
		let key = cleanUri.getPathContainer().getFileName();
		file = this.createFileFromCache(key, cleanUri);
	}
	return file;
};
oFF.OrcaFileSystem.prototype.getFileNames = function(files)
{
	let stringList = oFF.XList.create();
	if (oFF.notNull(files))
	{
		for (let i = 0; i < files.size(); i++)
		{
			stringList.add(files.get(i).getProviderMetadata().getStringByKey(oFF.XFileAttribute.DISPLAY_NAME));
		}
	}
	return stringList;
};
oFF.OrcaFileSystem.prototype.getHostName = function()
{
	return this.m_serverHostName;
};
oFF.OrcaFileSystem.prototype.getIconName = function(contentlibResource)
{
	let resourceType = contentlibResource.getStringByKey(oFF.OrcaResourceConstants.RESOURCE_TYPE);
	let resourceSubType = contentlibResource.getStringByKey(oFF.OrcaResourceConstants.RESOURCE_SUBTYPE);
	let resourceId = contentlibResource.getStringByKey(oFF.OrcaResourceConstants.RESOURCE_ID);
	let key = resourceType;
	let isIntegratedModel = false;
	let data = contentlibResource.getStructureByKey(oFF.OrcaResourceConstants.DATA);
	if (oFF.XString.isEqual(oFF.OrcaResourceConstants.RESOURCE_TYPE_CUBE, resourceType))
	{
		if (oFF.notNull(data))
		{
			let cdata = data.getStructureByKey(oFF.OrcaResourceConstants.CDATA);
			if (oFF.notNull(cdata))
			{
				let mode = cdata.getStringByKey("mode");
				isIntegratedModel = oFF.XString.isEqual(mode, "integrated");
				key = isIntegratedModel ? oFF.XStringUtils.concatenate2(key, ";live") : key;
			}
		}
	}
	if (oFF.XStringUtils.isNotNullAndNotEmpty(resourceSubType))
	{
		if (oFF.XString.isEqual(oFF.OrcaResourceConstants.RESOURCE_TYPE_STORY, resourceType) && this.m_relevantSubTypes.contains(resourceSubType))
		{
			key = oFF.XStringUtils.concatenate3(key, ";", resourceSubType);
		}
	}
	if (oFF.XStringUtils.isNotNullAndNotEmpty(resourceId))
	{
		if (oFF.XString.isEqual(oFF.OrcaResourceConstants.RESOURCE_TYPE_FOLDER, resourceType) && this.m_uniqueIconFolders.contains(resourceId))
		{
			if (oFF.XStringUtils.isNullOrEmpty(resourceSubType) || !this.m_relevantSubTypes.contains(resourceSubType))
			{
				key = oFF.XStringUtils.concatenate2(key, ";");
			}
			key = oFF.XStringUtils.concatenate3(key, ";", resourceId);
		}
	}
	let iconName = this.m_iconMap.getByKey(key);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(iconName))
	{
		return iconName;
	}
	else
	{
		return "";
	}
};
oFF.OrcaFileSystem.prototype.getLinkFromCache = function(key, uri)
{
	let metadata = this.m_linkFileCache.getByKey(key);
	if (oFF.isNull(metadata))
	{
		return null;
	}
	let file = oFF.OrcaFile.createFromCache(this.getProcess(), this, uri, metadata);
	return file;
};
oFF.OrcaFileSystem.prototype.getOrcaConnection = function()
{
	if (oFF.isNull(this.m_connection))
	{
		this.m_connection = this.getProcess().getConnectionPool().getConnection(this.m_systemName);
	}
	return this.m_connection;
};
oFF.OrcaFileSystem.prototype.getPrivateFolderName = function()
{
	return oFF.XStringUtils.concatenate2(oFF.OrcaResourceConstants.PRIVATE_FOLDER_PREFIX, this.getUserName());
};
oFF.OrcaFileSystem.prototype.getProtocolType = function()
{
	return oFF.ProtocolType.FS_CONTENTLIB;
};
oFF.OrcaFileSystem.prototype.getQuery = function(key)
{
	return this.QUERY_GENERATOR_FACTORY.getByKey(key);
};
oFF.OrcaFileSystem.prototype.getRootFile = function()
{
	return this.m_rootFile;
};
oFF.OrcaFileSystem.prototype.getRootFolderChildren = function()
{
	let virtualFolders = oFF.XList.create();
	let parentUri = this.getRootDirectoryUri();
	let root = oFF.XUri.createChildDir(parentUri, null);
	let repoUri = oFF.XUri.createChildDir(root, oFF.OrcaResourceConstants.MY_FILES_VIRTUAL_FOLDER);
	let repoFolder = oFF.OrcaFile._create(this.getProcess(), this, repoUri, true);
	let catalogUri = oFF.XUri.createChildDir(root, oFF.OrcaResourceConstants.CATALOG_VIRTUAL_FOLDER);
	let catalogFolder = oFF.OrcaFile._create(this.getProcess(), this, catalogUri, true);
	let workspacesUri = oFF.XUri.createChildDir(root, oFF.OrcaResourceConstants.WORKSPACES_VIRTUAL_FOLDER);
	let workspacesFolder = oFF.OrcaFile._create(this.getProcess(), this, workspacesUri, true);
	let recentFilesUri = oFF.XUri.createChildDir(root, oFF.OrcaResourceConstants.RECENT_FILES_VIRTUAL_FOLDER);
	let recentFilesFolder = oFF.OrcaFile._create(this.getProcess(), this, recentFilesUri, true);
	virtualFolders.add(repoFolder);
	virtualFolders.add(catalogFolder);
	virtualFolders.add(workspacesFolder);
	virtualFolders.add(recentFilesFolder);
	return virtualFolders;
};
oFF.OrcaFileSystem.prototype.getUserName = function()
{
	return this.getProcess().getUserProfile().getName();
};
oFF.OrcaFileSystem.prototype.getWorkingDirectoryUri = function()
{
	return oFF.XUri.createFromUrl("fscontentlib:///");
};
oFF.OrcaFileSystem.prototype.handleServerMetadata = function(extResult, syncType)
{
	if (extResult.hasErrors() && oFF.notNull(this.loadMyFilesListener))
	{
		this.loadMyFilesListener.addAllMessages(extResult);
	}
	this.setupIcons();
	this.setupQueries();
	this.m_serverHostName = extResult.getData() !== null ? extResult.getData().getOrcaPublicUrl() : "";
	let uri = oFF.XUri.createFromFilePath(this.getProcess(), "/", oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.NONE, oFF.ProtocolType.FS_CONTENTLIB);
	this.m_rootFile = oFF.OrcaFile._create(this.getProcess(), this, uri, false);
	this.m_rootFile.processProviderFetchChildren(syncType, this.loadMyFilesListener, null, null);
	this.loadMyFilesListener = null;
};
oFF.OrcaFileSystem.prototype.isExistingExt = function(file)
{
	let targetPath = file.getTargetUriPath();
	if (oFF.XString.isEqual(targetPath, "/"))
	{
		return true;
	}
	else
	{
		return file.processProviderIsExisting(oFF.SyncType.BLOCKING, null, null).getData().getProviderIsExisting();
	}
};
oFF.OrcaFileSystem.prototype.loadMyFiles = function(loadListener, syncType)
{
	this.loadMyFilesListener = loadListener;
	this.m_connection = this.getProcess().getConnectionPool().getConnection(this.m_systemName);
	if (oFF.SyncType.NON_BLOCKING === syncType)
	{
		this.m_connection.getSystemConnect().getServerMetadataExt(syncType, this, null);
		return true;
	}
	else
	{
		this.handleServerMetadata(this.m_connection.getSystemConnect().getServerMetadataExt(syncType, null, null), syncType);
		return false;
	}
};
oFF.OrcaFileSystem.prototype.mapResourceIdToVirtualIds = function(filePath)
{
	let mappedPath = filePath;
	let userPrivateFolder = oFF.XStringUtils.concatenate2("/", this.getPrivateFolderName());
	let userPrivateFolderSlash = oFF.XStringUtils.concatenate3("/", this.getPrivateFolderName(), "/");
	if (oFF.XString.isEqual(filePath, userPrivateFolder) || oFF.XString.isEqual(filePath, userPrivateFolderSlash))
	{
		let cleanPath = oFF.XStringUtils.stripStart(filePath, userPrivateFolder);
		mappedPath = oFF.XStringUtils.concatenate4("/", oFF.OrcaResourceConstants.MY_FILES_VIRTUAL_FOLDER, cleanPath, "/");
	}
	return oFF.XUri.createFromUrl(mappedPath);
};
oFF.OrcaFileSystem.prototype.newFile = function(process, uri)
{
	let file = this.getFileFromCache(uri);
	if (oFF.isNull(file))
	{
		file = oFF.OrcaFile._create(process, this, uri, false);
	}
	return file;
};
oFF.OrcaFileSystem.prototype.onServerMetadataLoaded = function(extResult, serverMetadata, customIdentifier)
{
	this.handleServerMetadata(extResult, oFF.SyncType.NON_BLOCKING);
};
oFF.OrcaFileSystem.prototype.processFetchAccessRights = function(syncType, listener, customIdentifier, orcaFile, config)
{
	let syncAction = oFF.OrcaFileFetchAccessDetailsAction.createAndRun(syncType, orcaFile, this, oFF.OrcaFileRequestAdapter.create((fileRequestAction) => {
		let data = fileRequestAction.getData();
		if (oFF.notNull(listener))
		{
			listener.onFileProviderFetchAccessRights(fileRequestAction, data, data.getAccessState(), customIdentifier);
		}
	}), customIdentifier, config);
	return syncAction;
};
oFF.OrcaFileSystem.prototype.processFetchChildren = function(syncType, listener, customIdentifier, orcaFile, config)
{
	let syncAction = oFF.OrcaFileGetChildrenAction.createAndRun(syncType, orcaFile, this, oFF.OrcaFileRequestAdapter.create((fileRequestAction) => {
		let data = fileRequestAction.getData();
		if (oFF.notNull(listener))
		{
			listener.onFileProviderChildrenFetched(fileRequestAction, data, data.getProviderChildFiles(), data.getProviderChildrenResultset(), customIdentifier);
		}
	}), config);
	return syncAction;
};
oFF.OrcaFileSystem.prototype.processFetchMetadata = function(syncType, listener, customIdentifier, orcaFile)
{
	if (orcaFile.getAttributes().containsKey(oFF.XFileAttribute.SAC_FETCH_LINKED_STORY) && !orcaFile.getAttributes().containsKey(oFF.XFileAttribute.SAC_LINKED_STORY_ID))
	{
		let syncAction = oFF.OrcaFileFetchStoryLinkAction.createAndRun(syncType, orcaFile, this, oFF.OrcaFileRequestAdapter.create((fileRequestAction) => {
			let data = fileRequestAction.getData();
			if (oFF.notNull(listener))
			{
				listener.onFileProviderFetchMetadata(fileRequestAction, data, data.getProviderMetadataAndAttributes(), customIdentifier);
			}
		}), customIdentifier);
		return syncAction;
	}
	else
	{
		let syncAction = oFF.OrcaFileFetchMetadataAction.createAndRun(syncType, orcaFile, this, oFF.OrcaFileRequestAdapter.create((fileRequestAction) => {
			let data = fileRequestAction.getData();
			if (oFF.notNull(listener))
			{
				listener.onFileProviderFetchMetadata(fileRequestAction, data, data.getProviderMetadataAndAttributes(), customIdentifier);
			}
		}), customIdentifier);
		return syncAction;
	}
};
oFF.OrcaFileSystem.prototype.processIsExisting = function(syncType, listener, customIdentifier, orcaFile)
{
	return oFF.OrcaFileExistingAction.createAndRun(syncType, orcaFile, this, oFF.OrcaFileRequestAdapter.create((fileRequestAction) => {
		let file = fileRequestAction.getData();
		if (oFF.notNull(listener))
		{
			listener.onFileProviderExistsCheck(fileRequestAction, file, file.getProviderIsExisting(), customIdentifier);
		}
	}), customIdentifier);
};
oFF.OrcaFileSystem.prototype.processLoad = function(syncType, listener, customIdentifier, orcaFile, compression)
{
	let syncAction = oFF.OrcaFileLoadAction.createAndRun(syncType, orcaFile, this, oFF.OrcaFileRequestAdapter.create((fileRequestAction) => {
		let data = fileRequestAction.getData();
		if (oFF.notNull(listener))
		{
			listener.onFileProviderLoaded(fileRequestAction, data, data.getProviderContent(), customIdentifier);
		}
	}), customIdentifier, compression);
	return syncAction;
};
oFF.OrcaFileSystem.prototype.processMkdir = function(syncType, listener, customIdentifier, orcaFile, includeParentDirs)
{
	let syncAction = oFF.OrcaFileMkdirAction.createAndRun(syncType, orcaFile, this, oFF.OrcaFileRequestAdapter.create((fileRequestAction) => {
		let data = fileRequestAction.getData();
		if (oFF.notNull(listener))
		{
			listener.onFileProviderDirectoryCreated(fileRequestAction, data, customIdentifier);
		}
	}), customIdentifier);
	return syncAction;
};
oFF.OrcaFileSystem.prototype.processSave = function(syncType, listener, customIdentifier, orcaFile, content, compression, attributes)
{
	let action = "";
	if (orcaFile.getProviderIsExisting())
	{
		action = oFF.OrcaFileBaseAction.UPDATE;
	}
	else
	{
		action = oFF.OrcaFileBaseAction.SAVE;
	}
	let syncAction = oFF.OrcaFileSaveAction.createAndRun(syncType, orcaFile, content, this, oFF.OrcaFileRequestAdapter.create((fileRequestAction) => {
		let data = fileRequestAction.getData();
		if (oFF.notNull(listener))
		{
			listener.onFileProviderSaved(fileRequestAction, data, content, customIdentifier);
		}
	}), customIdentifier, compression, action, attributes);
	return syncAction;
};
oFF.OrcaFileSystem.prototype.processShare = function(syncType, listener, customIdentifier, orcaFile, accessState, sendNotificationEmail, isAllUsersWithExistingAccess)
{
	let syncAction = oFF.OrcaFileShareAction.createAndRun(syncType, orcaFile, this, oFF.OrcaFileRequestAdapter.create((fileRequestAction) => {
		let data = fileRequestAction.getData();
		if (oFF.notNull(listener))
		{
			listener.onFileProviderShare(fileRequestAction, data, customIdentifier);
		}
	}), customIdentifier, accessState, sendNotificationEmail, isAllUsersWithExistingAccess);
	return syncAction;
};
oFF.OrcaFileSystem.prototype.registerQuery = function(key, object)
{
	this.QUERY_GENERATOR_FACTORY.put(key, object);
};
oFF.OrcaFileSystem.prototype.setupIcons = function()
{
	this.m_iconMap = oFF.XLinkedHashMapByString.create();
	let prefix = "sap-icon://fpa/";
	this.m_iconMap.put("DASHBOARD", oFF.XStringUtils.concatenate2(prefix, "dashboards"));
	this.m_iconMap.put("STORY", oFF.XStringUtils.concatenate2(prefix, "stories"));
	this.m_iconMap.put("STORY;TEMPLATE", oFF.XStringUtils.concatenate2(prefix, "template"));
	this.m_iconMap.put("STORY;APPLICATION", oFF.XStringUtils.concatenate2(prefix, "details"));
	this.m_iconMap.put("STORY;INSIGHT", oFF.XStringUtils.concatenate2(prefix, "chart-table"));
	this.m_iconMap.put("FOLDER", oFF.XStringUtils.concatenate2(prefix, "folder"));
	this.m_iconMap.put("FOLDER;;TEAMS", oFF.XStringUtils.concatenate2(prefix, "users"));
	this.m_iconMap.put("FOLDER;;INPUT_SCHEDULE", oFF.XStringUtils.concatenate2(prefix, "input-form"));
	this.m_iconMap.put("FOLDER;;USERS", oFF.XStringUtils.concatenate2(prefix, "person"));
	this.m_iconMap.put("FILE", oFF.XStringUtils.concatenate2(prefix, "file"));
	this.m_iconMap.put("CUBE", oFF.XStringUtils.concatenate2(prefix, "models"));
	this.m_iconMap.put("CUBE;live", oFF.XStringUtils.concatenate2(prefix, "live-model"));
	this.m_iconMap.put("DATASET", oFF.XStringUtils.concatenate2(prefix, "data-set"));
	this.m_iconMap.put("INPUT_SCHEDULE", oFF.XStringUtils.concatenate2(prefix, "input-form"));
	this.m_iconMap.put("PRESENTATION_V2", oFF.XStringUtils.concatenate2(prefix, "boardroom"));
	this.m_iconMap.put("POINTOFINTEREST", oFF.XStringUtils.concatenate2(prefix, "marker"));
	this.m_iconMap.put("THEMING", oFF.XStringUtils.concatenate2(prefix, "style"));
	this.m_iconMap.put("DWC_REMOTE_TABLE", oFF.XStringUtils.concatenate2(prefix, "live-table"));
	this.m_iconMap.put("DWC_LOCAL_TABLE", oFF.XStringUtils.concatenate2(prefix, "table"));
	this.m_iconMap.put("DWC_ERMODEL", oFF.XStringUtils.concatenate2(prefix, "relationship-diagram"));
	this.m_iconMap.put("DWC_ESMODEL", oFF.XStringUtils.concatenate2(prefix, "inspection"));
	this.m_iconMap.put("DWC_VIEW", oFF.XStringUtils.concatenate2(prefix, "table-view"));
	this.m_iconMap.put("DWC_DATAFLOW", oFF.XStringUtils.concatenate2(prefix, "data-flow"));
	this.m_iconMap.put("DWC_WRANGLING_SESSION", oFF.XStringUtils.concatenate2(prefix, "wrangling"));
	this.m_iconMap.put("DWC_CUBE", oFF.XStringUtils.concatenate2(prefix, "models"));
	this.m_iconMap.put("EXTERNALCONTENT", oFF.XStringUtils.concatenate2(prefix, "link"));
	this.m_iconMap.put("PREDICTIVESCENARIO", oFF.XStringUtils.concatenate2(prefix, "binoculars"));
	this.m_uniqueIconFolders = oFF.XList.create();
	this.m_uniqueIconFolders.add("TEAMS");
	this.m_uniqueIconFolders.add("INPUT_SCHEDULE");
	this.m_uniqueIconFolders.add("USERS");
	this.m_relevantSubTypes = oFF.XList.create();
	this.m_relevantSubTypes.add("TEMPLATE");
	this.m_relevantSubTypes.add("APPLICATION");
	this.m_relevantSubTypes.add("INSIGHT");
};
oFF.OrcaFileSystem.prototype.setupQueries = function()
{
	let filterGenerator = oFF.QueryFilterGenerator.create();
	let optionsGenerator = oFF.QueryOptionsGenerator.create();
	let resourceIdResolver = oFF.ResourceIdResolver.create();
	let metadataGenerator = oFF.MetadataRequestGenerator.create();
	this.registerQuery(oFF.ContentlibRequestAction.GET_ANCESTOR_AND_SUB_NODES, oFF.AncestorsAndSubNodes.create(filterGenerator, optionsGenerator));
	this.registerQuery(oFF.ContentlibRequestAction.GET_CONTENT, oFF.GetContent.create(optionsGenerator));
	this.registerQuery(oFF.ContentlibRequestAction.CREATE_FOLDER, oFF.CreateFolder.create(resourceIdResolver));
	this.registerQuery(oFF.ContentlibRequestAction.CREATE_CONTENT, oFF.CreateContent.create(resourceIdResolver));
	this.registerQuery(oFF.ContentlibRequestAction.UPDATE_CONTENT, oFF.UpdateContent.create());
	this.registerQuery(oFF.ContentlibRequestAction.GET_RESOURCE_EX, oFF.GetResourceEx.create(metadataGenerator));
	this.registerQuery(oFF.ContentlibRequestAction.GET_RESOURCE_WITH_NAME_EXISTS, oFF.GetResourceWithNameExists.create(resourceIdResolver));
	this.registerQuery(oFF.ContentlibRequestAction.GET_SUB_NODES, oFF.GetSubNodes.create(filterGenerator, optionsGenerator));
	this.registerQuery(oFF.ContentlibRequestAction.GET_RECENT_FILES, oFF.RecentFiles.create(oFF.SearchAllResources.create(filterGenerator, optionsGenerator, metadataGenerator), filterGenerator, optionsGenerator));
	this.registerQuery(oFF.ContentlibRequestAction.GET_REPO_VIEW, oFF.RepoView.create(filterGenerator, optionsGenerator));
	this.registerQuery(oFF.ContentlibRequestAction.SEARCH_ALL_RESOURCES, oFF.SearchAllResources.create(filterGenerator, optionsGenerator, metadataGenerator));
	this.registerQuery(oFF.ContentlibRequestAction.GET_SPACE_VIEW, oFF.SpaceView.create(filterGenerator, optionsGenerator));
	this.registerQuery(oFF.ContentlibRequestAction.STAGE_DELETE_LIST, oFF.StageDeleteList.create());
	this.registerQuery(oFF.ContentlibRequestAction.RENAME_RESOURCE, oFF.RenameResource.create());
	this.registerQuery(oFF.ContentlibRequestAction.GET_ACCESS_DETAILS, oFF.GetAccessDetails.create());
	this.registerQuery(oFF.ContentlibRequestAction.SHARE_FILE, oFF.ShareFile.create());
};

oFF.OrcaFileDeleteAction = function() {};
oFF.OrcaFileDeleteAction.prototype = new oFF.OrcaFileBaseAction();
oFF.OrcaFileDeleteAction.prototype._ff_c = "OrcaFileDeleteAction";

oFF.OrcaFileDeleteAction.createAndRun = function(syncType, orcaFile, fileSystem, listener, customIdentifier)
{
	let object = new oFF.OrcaFileDeleteAction();
	object.m_file = orcaFile.getDestinationFile();
	object.setData(object.m_file);
	object.setupActionAndRun(syncType, listener, customIdentifier, fileSystem);
	return object;
};
oFF.OrcaFileDeleteAction.prototype.m_file = null;
oFF.OrcaFileDeleteAction.prototype.m_resourceId = null;
oFF.OrcaFileDeleteAction.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		if (oFF.notNull(response) && response.getRootElement() !== null)
		{
			this.m_file.setProviderIsExisting(false);
			this.setData(this.m_file);
		}
		else
		{
			this.addResponseError(response);
		}
	}
	else
	{
		this.m_file.addAllMessages(extResult);
	}
	this.endSync();
};
oFF.OrcaFileDeleteAction.prototype.processSynchronization = function(syncType)
{
	let uri = oFF.XUri.createFromUrl(oFF.OrcaResourceConstants.REST_ENDPOINT);
	let connection = this.getActionContext().getOrcaConnection();
	let ocpFunction = connection.newRpcFunctionByUri(uri);
	let request = ocpFunction.getRpcRequest();
	let payloadStructure = oFF.PrFactory.createStructure();
	let resourceIds = oFF.XList.create();
	resourceIds.add(this.m_resourceId);
	let queryData = oFF.ContentlibQueryDataBuilder.create().setResourceIds(resourceIds).build();
	payloadStructure = this.m_file.getFsBase().getQuery(oFF.ContentlibRequestAction.STAGE_DELETE_LIST).getPayload(queryData);
	request.setRequestStructure(payloadStructure);
	ocpFunction.processFunctionExecution(syncType, this, null);
	return true;
};

oFF.OrcaFileExistingAction = function() {};
oFF.OrcaFileExistingAction.prototype = new oFF.OrcaFileBaseAction();
oFF.OrcaFileExistingAction.prototype._ff_c = "OrcaFileExistingAction";

oFF.OrcaFileExistingAction.createAndRun = function(syncType, orcaFile, fileSystem, listener, customIdentifier)
{
	let object = new oFF.OrcaFileExistingAction();
	object.m_file = orcaFile.getDestinationFile();
	object.setData(object.m_file);
	object.setupActionAndRun(syncType, listener, customIdentifier, fileSystem);
	return object;
};
oFF.OrcaFileExistingAction.prototype.m_file = null;
oFF.OrcaFileExistingAction.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		if (oFF.notNull(response) && response.getRootElement() !== null)
		{
			let requestResponse = response.getRootElement();
			let exists = requestResponse.getBooleanByKey(oFF.OrcaResourceConstants.EXISTS);
			if (exists)
			{
				let uri = this.m_file.getUri();
				let parentUri = oFF.XUri.createParent(uri);
				let existingResourceJson = requestResponse.getListByKey(oFF.OrcaResourceConstants.EXISTING_RESOURCE).get(0).asStructure();
				oFF.OrcaFile.create(existingResourceJson, this.m_file.getProcess(), this.m_file.getFsBase(), parentUri);
				this.m_file.setMetadataInternal(existingResourceJson);
			}
			this.m_file.setProviderIsExisting(exists);
		}
	}
	else
	{
		this.addResponseError(response);
		this.m_file.addAllMessages(extResult);
	}
	this.endSync();
};
oFF.OrcaFileExistingAction.prototype.processSynchronization = function(syncType)
{
	if (this.m_file.isVirtual())
	{
		this.endSync();
		return false;
	}
	else
	{
		let uri = oFF.XUri.createFromUrl(oFF.OrcaResourceConstants.REST_ENDPOINT);
		let connection = this.getActionContext().getOrcaConnection();
		let ocpFunction = connection.newRpcFunctionByUri(uri);
		let request = ocpFunction.getRpcRequest();
		let payloadStructure = oFF.PrFactory.createStructure();
		let queryData = oFF.ContentlibQueryDataBuilder.create().setFile(this.m_file).build();
		payloadStructure = this.m_file.getFsBase().getQuery(oFF.ContentlibRequestAction.GET_RESOURCE_WITH_NAME_EXISTS).getPayload(queryData);
		request.setRequestStructure(payloadStructure);
		ocpFunction.processFunctionExecution(syncType, this, null);
		return true;
	}
};

oFF.OrcaFileFetchAccessDetailsAction = function() {};
oFF.OrcaFileFetchAccessDetailsAction.prototype = new oFF.OrcaFileBaseAction();
oFF.OrcaFileFetchAccessDetailsAction.prototype._ff_c = "OrcaFileFetchAccessDetailsAction";

oFF.OrcaFileFetchAccessDetailsAction.createAndRun = function(syncType, orcaFile, orcaFileSystem, listener, customIdentifier, config)
{
	let object = new oFF.OrcaFileFetchAccessDetailsAction();
	object.m_file = orcaFile;
	object.m_paginationConfig = config;
	object.setData(orcaFile);
	object.setupActionAndRun(syncType, listener, customIdentifier, orcaFileSystem);
	return object;
};
oFF.OrcaFileFetchAccessDetailsAction.prototype.m_file = null;
oFF.OrcaFileFetchAccessDetailsAction.prototype.m_paginationConfig = null;
oFF.OrcaFileFetchAccessDetailsAction.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		if (oFF.notNull(response) && response.getRootElement() !== null)
		{
			let resourceAccessJson = response.getRootElement();
			let userCount = resourceAccessJson.getIntegerByKey("userCount");
			let teamCount = resourceAccessJson.getIntegerByKey("teamCount");
			let resultsList = resourceAccessJson.getListByKey("results");
			let userAccess = this.m_file.getProviderAttributes().putNewList(oFF.XFileAttribute.ACCESS_RIGHTS);
			let accessState = null;
			for (let i = 0; i < resultsList.size(); i++)
			{
				let info = resultsList.getStructureAt(i);
				let access = info.getListByKey("resourceAccess").getStructureAt(0).getStructureByKey("access").getIntegerByKey("effective");
				let accessStateBuilder = oFF.OrcaFileAccessStateBuilder.create();
				accessState = accessStateBuilder.getAccess(access, info.getStringByKey("id"));
				let userAccessInfo = userAccess.addNewStructure();
				userAccessInfo.putString("id", info.getStringByKey("id"));
				userAccessInfo.putInteger("access", access);
				userAccessInfo.putString("type", info.getStringByKey("type"));
				userAccessInfo.putString("displayName", info.getStringByKey("displayName"));
			}
			let userAndTeamCount = userAccess.addNewStructure();
			userAndTeamCount.putInteger("userCount", userCount);
			userAndTeamCount.putInteger("teamCount", teamCount);
			this.m_file.setAccessState(accessState);
		}
	}
	this.endSync();
};
oFF.OrcaFileFetchAccessDetailsAction.prototype.processSynchronization = function(syncType)
{
	if (oFF.XString.isEqual(this.m_file.getUri().getPath(), this.m_file.getFsBase().getRootDirectoryUri().getPath()) || this.m_file.isVirtual())
	{
		this.addAllMessages(this.m_file);
		return false;
	}
	let uri = oFF.XUri.createFromUrl(oFF.OrcaResourceConstants.REST_ENDPOINT);
	let connection = this.getActionContext().getOrcaConnection();
	let ocpFunction = connection.newRpcFunctionByUri(uri);
	let request = ocpFunction.getRpcRequest();
	let queryData = oFF.ContentlibQueryDataBuilder.create().setFile(this.m_file).setQueryConfig(this.m_paginationConfig).build();
	let payloadStructure = this.m_file.getFsBase().getQuery(oFF.ContentlibRequestAction.GET_ACCESS_DETAILS).getPayload(queryData);
	request.setRequestStructure(payloadStructure);
	ocpFunction.getRpcRequest().setMethod(oFF.HttpRequestMethod.HTTP_POST);
	ocpFunction.processFunctionExecution(syncType, this, null);
	return true;
};

oFF.OrcaFileFetchMetadataAction = function() {};
oFF.OrcaFileFetchMetadataAction.prototype = new oFF.OrcaFileBaseAction();
oFF.OrcaFileFetchMetadataAction.prototype._ff_c = "OrcaFileFetchMetadataAction";

oFF.OrcaFileFetchMetadataAction.createAndRun = function(syncType, orcaFile, fileSystem, listener, customIdentifier)
{
	let object = new oFF.OrcaFileFetchMetadataAction();
	object.m_file = orcaFile.getDestinationFile();
	object.setData(object.m_file);
	object.setupActionAndRun(syncType, listener, customIdentifier, fileSystem);
	return object;
};
oFF.OrcaFileFetchMetadataAction.prototype.m_file = null;
oFF.OrcaFileFetchMetadataAction.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		if (oFF.notNull(response) && response.getRootElement() !== null)
		{
			let resourceMetadataJson = response.getRootElement();
			if (this.m_file.isVirtual())
			{
				resourceMetadataJson.putString(oFF.OrcaResourceConstants.NAME, this.m_file.getProviderMetadata().getStringByKey(oFF.XFileAttribute.NAME));
				resourceMetadataJson.putString(oFF.OrcaResourceConstants.DESCRIPTION, this.m_file.getProviderMetadata().getStringByKey(oFF.XFileAttribute.DESCRIPTION));
				this.m_file.setMetadataInternal(resourceMetadataJson);
				if (oFF.XString.isEqual(this.m_file.getName(), oFF.OrcaResourceConstants.CATALOG_VIRTUAL_FOLDER) || oFF.XString.isEqual(this.m_file.getName(), oFF.OrcaResourceConstants.WORKSPACES_VIRTUAL_FOLDER) || oFF.XString.isEqual(this.m_file.getName(), oFF.OrcaResourceConstants.RECENT_FILES_VIRTUAL_FOLDER))
				{
					this.m_file.getProviderMetadata().putBoolean(oFF.XFileAttribute.IS_WRITEABLE, false);
				}
			}
			else
			{
				this.m_file.setMetadataInternal(resourceMetadataJson);
				oFF.OrcaResponseParser.generateFilesInPath(resourceMetadataJson, this.m_file.getFsBase(), this.getProcess(), this.m_file.getUri(), oFF.OrcaResourceConstants.ANCESTOR_PATH);
			}
			this.m_file.setProviderIsExisting(true);
			this.setData(this.m_file);
		}
		else
		{
			this.addResponseError(response);
		}
	}
	else
	{
		this.m_file.addAllMessages(extResult);
	}
	this.endSync();
};
oFF.OrcaFileFetchMetadataAction.prototype.processSynchronization = function(syncType)
{
	if (oFF.XString.isEqual(this.m_file.getUri().getPath(), this.m_file.getFsBase().getRootDirectoryUri().getPath()) || this.m_file.isVirtual() || !this.m_file.getProviderIsExisting())
	{
		this.addAllMessages(this.m_file);
		return false;
	}
	let uri = oFF.XUri.createFromUrl(oFF.OrcaResourceConstants.REST_ENDPOINT);
	let connection = this.getActionContext().getOrcaConnection();
	let ocpFunction = connection.newRpcFunctionByUri(uri);
	let request = ocpFunction.getRpcRequest();
	let queryData = oFF.ContentlibQueryDataBuilder.create().setFile(this.m_file).build();
	let payloadStructure = this.m_file.getFsBase().getQuery(oFF.ContentlibRequestAction.GET_RESOURCE_EX).getPayload(queryData);
	request.setRequestStructure(payloadStructure);
	ocpFunction.processFunctionExecution(syncType, this, null);
	return true;
};

oFF.OrcaFileFetchStoryLinkAction = function() {};
oFF.OrcaFileFetchStoryLinkAction.prototype = new oFF.OrcaFileBaseAction();
oFF.OrcaFileFetchStoryLinkAction.prototype._ff_c = "OrcaFileFetchStoryLinkAction";

oFF.OrcaFileFetchStoryLinkAction.GET_START_NODES_BY_TYPE_AND_CURRENT_NODE_ID = "getStartNodesByTypeAndCurrentNodeId";
oFF.OrcaFileFetchStoryLinkAction.createAndRun = function(syncType, orcaFile, fileSystem, listener, customIdentifier)
{
	let object = new oFF.OrcaFileFetchStoryLinkAction();
	object.m_file = orcaFile;
	object.setData(object.m_file);
	object.setupActionAndRun(syncType, listener, customIdentifier, fileSystem);
	return object;
};
oFF.OrcaFileFetchStoryLinkAction.prototype.m_file = null;
oFF.OrcaFileFetchStoryLinkAction.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	let linkedStoryId = "";
	if (extResult.isValid())
	{
		if (oFF.notNull(response) && response.getRootElementGeneric() !== null)
		{
			let list = response.getRootElementGeneric().asList();
			let linkData = list.getStructureAt(0);
			linkedStoryId = linkData.getStringByKey(oFF.OrcaResourceConstants.DATA_ANALYZER_LINK_ID_PARAM);
			let linkedStoryName = linkData.getStructureByKey(oFF.OrcaResourceConstants.DATA).getStringByKey(oFF.OrcaResourceConstants.NAME);
			this.m_file.getProviderAttributes().putString(oFF.XFileAttribute.SAC_LINKED_STORY_NAME, linkedStoryName);
		}
		else
		{
			this.addResponseError(response);
		}
	}
	else
	{
		this.m_file.addAllMessages(extResult);
	}
	this.m_file.getProviderAttributes().putString(oFF.XFileAttribute.SAC_LINKED_STORY_ID, linkedStoryId);
	this.m_file.getProviderAttributes().remove(oFF.XFileAttribute.SAC_FETCH_LINKED_STORY);
	this.endSync();
};
oFF.OrcaFileFetchStoryLinkAction.prototype.processSynchronization = function(syncType)
{
	let uri = oFF.XUri.createFromUrl(oFF.OrcaResourceConstants.REST_LINK_ENDPOINT);
	let connection = this.getActionContext().getOrcaConnection();
	let ocpFunction = connection.newRpcFunctionByUri(uri);
	let request = ocpFunction.getRpcRequest();
	let payloadStructure = oFF.PrFactory.createStructure();
	payloadStructure.putString(oFF.OrcaResourceConstants.ACTION, oFF.OrcaFileFetchStoryLinkAction.GET_START_NODES_BY_TYPE_AND_CURRENT_NODE_ID);
	let data = payloadStructure.putNewStructure(oFF.OrcaResourceConstants.DATA);
	data.putString(oFF.OrcaResourceConstants.DATA_ANALYZER_LINK_TYPE_PARAM, oFF.OrcaResourceConstants.RESOURCE_TYPE_STORY);
	data.putString("currentNodeId", this.m_file.getAttributes().getStringByKey(oFF.XFileAttribute.UNIQUE_ID));
	request.setRequestStructure(payloadStructure);
	ocpFunction.processFunctionExecution(syncType, this, null);
	return true;
};

oFF.OrcaFileGetChildrenAction = function() {};
oFF.OrcaFileGetChildrenAction.prototype = new oFF.OrcaFileBaseAction();
oFF.OrcaFileGetChildrenAction.prototype._ff_c = "OrcaFileGetChildrenAction";

oFF.OrcaFileGetChildrenAction.createAndRun = function(syncType, orcaFile, fileSystem, listener, config)
{
	let object = new oFF.OrcaFileGetChildrenAction();
	object.m_file = orcaFile.getDestinationFile();
	object.m_config = config;
	object.setData(object.m_file);
	object.setupActionAndRun(syncType, listener, null, fileSystem);
	return object;
};
oFF.OrcaFileGetChildrenAction.prototype.m_config = null;
oFF.OrcaFileGetChildrenAction.prototype.m_file = null;
oFF.OrcaFileGetChildrenAction.prototype.m_hasSearchValue = false;
oFF.OrcaFileGetChildrenAction.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		if (oFF.notNull(response) && response.getRootElement() !== null)
		{
			let fileName = this.m_file.getName();
			let fileResponse = null;
			let uri = oFF.XUri.createChildDir(this.m_file.getUri(), null);
			let childFiles;
			if (oFF.XString.isEqual(fileName, oFF.OrcaResourceConstants.WORKSPACES_VIRTUAL_FOLDER))
			{
				fileResponse = response.getRootElementGeneric().asList();
			}
			else
			{
				fileResponse = response.getRootElement();
			}
			let totalResourceCount = oFF.OrcaResponseParser.getTotalResourceCount(fileResponse);
			let filteredFiles = oFF.XList.create();
			childFiles = oFF.OrcaResponseParser.getFileListFromResponse(fileResponse, uri, this.getProcess(), this.m_file.getFsBase(), this.m_file);
			if (oFF.XString.isEqual(fileName, oFF.OrcaResourceConstants.RECENT_FILES_VIRTUAL_FOLDER))
			{
				let totalRecentFilesToShow = 25;
				let insightIterator = childFiles.getIterator();
				while (insightIterator.hasNext())
				{
					let insightFile = insightIterator.next();
					if (oFF.OrcaResponseFilterFactory.getDragonflyInsightFilter()(insightFile))
					{
						filteredFiles.add(insightFile);
					}
					if (filteredFiles.size() >= totalRecentFilesToShow)
					{
						break;
					}
				}
				childFiles = filteredFiles;
			}
			else if (this.m_hasSearchValue)
			{
				let fileIterator = childFiles.getIterator();
				while (fileIterator.hasNext())
				{
					let file = fileIterator.next();
					if (oFF.OrcaResponseFilterFactory.getSearchResponseFilterBySubtype()(file, this.m_config))
					{
						filteredFiles.add(file);
					}
				}
				childFiles = filteredFiles;
			}
			let targets = oFF.XList.create();
			if (oFF.notNull(childFiles))
			{
				for (let i = 0; i < childFiles.size(); i++)
				{
					targets.add(childFiles.get(i));
				}
			}
			this.m_file.setProviderChildFiles(targets, totalResourceCount);
			this.m_file.setProviderIsExisting(true);
		}
		else
		{
			this.addResponseError(response);
		}
	}
	else
	{
		this.m_file.addAllMessages(extResult);
	}
	this.endSync();
};
oFF.OrcaFileGetChildrenAction.prototype.processSynchronization = function(syncType)
{
	let uri = oFF.XUri.createFromUrl(oFF.OrcaResourceConstants.REST_ENDPOINT);
	let connection = this.getActionContext().getOrcaConnection();
	let ocpFunction = connection.newRpcFunctionByUri(uri);
	let request = ocpFunction.getRpcRequest();
	let payloadStructure = oFF.PrFactory.createStructure();
	let fileName = this.m_file.getName();
	this.m_hasSearchValue = oFF.notNull(this.m_config) && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_config.getSearchValue());
	let isCatalog = oFF.XString.isEqual(fileName, oFF.OrcaResourceConstants.CATALOG_VIRTUAL_FOLDER);
	let isWorkspace = this.m_file.getProviderMetadata().getBooleanByKey(oFF.XFileAttribute.IS_WORKSPACE_FILE);
	let queryData = oFF.ContentlibQueryDataBuilder.create().setFile(this.m_file).setQueryConfig(this.m_config).setPrivateFolder(this.m_file.getFsBase().getPrivateFolderName()).build();
	let rpcMethod;
	if (oFF.XString.isEqual(this.m_file.getUri().getPath(), this.m_file.getFsBase().getRootDirectoryUri().getPath()))
	{
		let childrenFiles = this.m_file.getFsBase().getRootFolderChildren();
		let targets = oFF.XList.create();
		if (oFF.notNull(childrenFiles))
		{
			for (let i = 0; i < childrenFiles.size(); i++)
			{
				targets.add(childrenFiles.get(i));
			}
		}
		this.m_file.setProviderChildFiles(targets, -1);
		this.addAllMessages(this.m_file);
		return false;
	}
	else if (this.m_hasSearchValue)
	{
		rpcMethod = oFF.ContentlibRequestAction.SEARCH_ALL_RESOURCES;
	}
	else if (oFF.XString.isEqual(fileName, oFF.OrcaResourceConstants.MY_FILES_VIRTUAL_FOLDER))
	{
		rpcMethod = oFF.ContentlibRequestAction.GET_REPO_VIEW;
	}
	else if (isCatalog)
	{
		rpcMethod = oFF.ContentlibRequestAction.SEARCH_ALL_RESOURCES;
	}
	else if (oFF.XString.isEqual(fileName, oFF.OrcaResourceConstants.WORKSPACES_VIRTUAL_FOLDER))
	{
		rpcMethod = oFF.ContentlibRequestAction.GET_SUB_NODES;
	}
	else if (oFF.XString.isEqual(fileName, oFF.OrcaResourceConstants.RECENT_FILES_VIRTUAL_FOLDER))
	{
		rpcMethod = oFF.ContentlibRequestAction.GET_RECENT_FILES;
	}
	else if (isWorkspace && oFF.XString.endsWith(fileName, oFF.OrcaResourceConstants.RESOURCE_ID_ROOT))
	{
		rpcMethod = oFF.ContentlibRequestAction.GET_SPACE_VIEW;
	}
	else
	{
		rpcMethod = oFF.ContentlibRequestAction.GET_ANCESTOR_AND_SUB_NODES;
	}
	payloadStructure = this.m_file.getFsBase().getQuery(rpcMethod).getPayload(queryData);
	request.setRequestStructure(payloadStructure);
	ocpFunction.processFunctionExecution(syncType, this, null);
	return true;
};

oFF.OrcaFileLoadAction = function() {};
oFF.OrcaFileLoadAction.prototype = new oFF.OrcaFileBaseAction();
oFF.OrcaFileLoadAction.prototype._ff_c = "OrcaFileLoadAction";

oFF.OrcaFileLoadAction.createAndRun = function(syncType, orcaFile, fileSystem, listener, customIdentifier, compression)
{
	let object = new oFF.OrcaFileLoadAction();
	object.m_file = orcaFile;
	object.setData(object.m_file);
	object.setupActionAndRun(syncType, listener, customIdentifier, fileSystem);
	return object;
};
oFF.OrcaFileLoadAction.prototype.m_file = null;
oFF.OrcaFileLoadAction.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		if (oFF.notNull(response) && response.getRootElement() !== null)
		{
			let contentlibResource = response.getRootElement();
			if (contentlibResource.containsKey("cdata") && contentlibResource.getStructureByKey(oFF.OrcaResourceConstants.CDATA) !== null)
			{
				let content = oFF.XContent.createJsonObjectContent(oFF.ContentType.APPLICATION_JSON, contentlibResource.getStructureByKey(oFF.OrcaResourceConstants.CDATA));
				this.m_file.setProviderFileContent(content);
			}
			this.m_file.setMetadataInternal(contentlibResource);
			this.m_file.setProviderIsExisting(true);
		}
		else
		{
			this.addResponseError(response);
		}
	}
	else
	{
		this.m_file.addAllMessages(extResult);
	}
	this.endSync();
};
oFF.OrcaFileLoadAction.prototype.processSynchronization = function(syncType)
{
	let uri = oFF.XUri.createFromUrl(oFF.OrcaResourceConstants.REST_ENDPOINT);
	let connection = this.getActionContext().getOrcaConnection();
	let ocpFunction = connection.newRpcFunctionByUri(uri);
	let request = ocpFunction.getRpcRequest();
	let payloadStructure = oFF.PrFactory.createStructure();
	let queryData = oFF.ContentlibQueryDataBuilder.create().setFile(this.m_file).build();
	payloadStructure = this.m_file.getFsBase().getQuery(oFF.ContentlibRequestAction.GET_CONTENT).getPayload(queryData);
	request.setRequestStructure(payloadStructure);
	ocpFunction.processFunctionExecution(syncType, this, null);
	return true;
};

oFF.OrcaFileMkdirAction = function() {};
oFF.OrcaFileMkdirAction.prototype = new oFF.OrcaFileBaseAction();
oFF.OrcaFileMkdirAction.prototype._ff_c = "OrcaFileMkdirAction";

oFF.OrcaFileMkdirAction.createAndRun = function(syncType, orcaFile, fileSystem, listener, customIdentifier)
{
	let object = new oFF.OrcaFileMkdirAction();
	object.m_file = orcaFile.getDestinationFile();
	object.setData(object.m_file);
	object.setupActionAndRun(syncType, listener, customIdentifier, fileSystem);
	return object;
};
oFF.OrcaFileMkdirAction.prototype.m_file = null;
oFF.OrcaFileMkdirAction.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		if (oFF.notNull(response) && response.getRootElement() !== null)
		{
			let resourceJson = response.getRootElement();
			this.m_file.getFsBase().dropFileFromCache(this.m_file.getUri());
			let uri = this.m_file.getUri();
			let parentUri = oFF.XUri.createParent(uri);
			this.m_file = oFF.OrcaFile.create(resourceJson, this.getProcess(), this.getActionContext(), parentUri);
			this.setData(this.m_file);
		}
		else
		{
			this.addResponseError(response);
		}
	}
	else
	{
		this.m_file.addAllMessages(extResult);
	}
	this.endSync();
};
oFF.OrcaFileMkdirAction.prototype.processSynchronization = function(syncType)
{
	let uri = oFF.XUri.createFromUrl(oFF.OrcaResourceConstants.REST_ENDPOINT);
	let connection = this.getActionContext().getOrcaConnection();
	let ocpFunction = connection.newRpcFunctionByUri(uri);
	let request = ocpFunction.getRpcRequest();
	let payloadStructure = oFF.PrFactory.createStructure();
	let queryData = oFF.ContentlibQueryDataBuilder.create().setFile(this.m_file).build();
	payloadStructure = this.m_file.getFsBase().getQuery(oFF.ContentlibRequestAction.CREATE_FOLDER).getPayload(queryData);
	request.setRequestStructure(payloadStructure);
	ocpFunction.processFunctionExecution(syncType, this, null);
	return true;
};

oFF.OrcaFileSaveAction = function() {};
oFF.OrcaFileSaveAction.prototype = new oFF.OrcaFileBaseAction();
oFF.OrcaFileSaveAction.prototype._ff_c = "OrcaFileSaveAction";

oFF.OrcaFileSaveAction.createAndRun = function(syncType, orcaFile, content, fileSystem, listener, customIdentifier, compression, action, attributes)
{
	let object = new oFF.OrcaFileSaveAction();
	object.m_file = orcaFile.getDestinationFile();
	if (orcaFile.isLinkNodeType())
	{
		object.m_resourceType = object.m_file.getProviderMetadata().getStringByKey(oFF.XFileAttribute.NODE_TYPE);
	}
	else
	{
		object.m_resourceType = attributes.getStringByKey(oFF.XFileAttribute.NODE_TYPE);
	}
	object.m_action = action;
	object.setData(object.m_file);
	object.m_content = content;
	object.setupActionAndRun(syncType, listener, customIdentifier, fileSystem);
	return object;
};
oFF.OrcaFileSaveAction.prototype.m_action = null;
oFF.OrcaFileSaveAction.prototype.m_content = null;
oFF.OrcaFileSaveAction.prototype.m_file = null;
oFF.OrcaFileSaveAction.prototype.m_resourceType = null;
oFF.OrcaFileSaveAction.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		if (oFF.notNull(response) && response.getRootElement() !== null)
		{
			let resourceJson = response.getRootElement();
			if (resourceJson.containsKey(oFF.OrcaResourceConstants.DATA_ANALYZER_LINK_PATH_RESPONSE_END_NODE))
			{
				let nodeList = resourceJson.getListByKey(oFF.OrcaResourceConstants.DATA_ANALYZER_LINK_PATH_NODES);
				resourceJson = nodeList.getStructureAt(nodeList.size() - 1).getStructureByKey(oFF.OrcaResourceConstants.DATA);
			}
			if (oFF.XString.isEqual(this.m_action, oFF.OrcaFileBaseAction.SAVE))
			{
				let uri = this.m_file.getUri();
				let parentUri = oFF.XUri.createParent(uri);
				this.m_file.getFsBase().dropFileFromCache(this.m_file.getUri());
				this.m_file = oFF.OrcaFile.create(resourceJson, this.getProcess(), this.getActionContext(), parentUri);
				this.setData(this.m_file);
			}
			else
			{
				this.m_file.setMetadataInternal(resourceJson);
			}
		}
		else
		{
			this.addResponseError(response);
		}
	}
	else
	{
		this.m_file.addAllMessages(extResult);
	}
	this.endSync();
};
oFF.OrcaFileSaveAction.prototype.processSynchronization = function(syncType)
{
	let restEndpoint = this.m_file.getAttributes().containsKey(oFF.XFileAttribute.SAC_INTEROP_STORY_ID) ? oFF.OrcaResourceConstants.REST_LINK_ENDPOINT : oFF.OrcaResourceConstants.REST_ENDPOINT;
	let uri = oFF.XUri.createFromUrl(restEndpoint);
	let connection = this.getActionContext().getOrcaConnection();
	let ocpFunction = connection.newRpcFunctionByUri(uri);
	let request = ocpFunction.getRpcRequest();
	let payloadStructure = oFF.PrFactory.createStructure();
	let queryData = oFF.ContentlibQueryDataBuilder.create().setFile(this.m_file).setResourceType(this.m_resourceType).setContent(this.m_content).setLinkParameters(this.m_file.getAttributes()).build();
	let rpcMethod = oFF.ContentlibRequestAction.CREATE_CONTENT;
	if (oFF.XString.isEqual(this.m_action, oFF.OrcaFileBaseAction.UPDATE))
	{
		rpcMethod = oFF.ContentlibRequestAction.UPDATE_CONTENT;
	}
	payloadStructure = this.m_file.getFsBase().getQuery(rpcMethod).getPayload(queryData);
	request.setRequestStructure(payloadStructure);
	ocpFunction.processFunctionExecution(syncType, this, null);
	return true;
};

oFF.OrcaFileShareAction = function() {};
oFF.OrcaFileShareAction.prototype = new oFF.OrcaFileBaseAction();
oFF.OrcaFileShareAction.prototype._ff_c = "OrcaFileShareAction";

oFF.OrcaFileShareAction.createAndRun = function(syncType, orcaFile, fileSystem, listener, customIdentifier, shareInfo, sendNotificationEmail, isAllUsersWithExistingAccess)
{
	let object = new oFF.OrcaFileShareAction();
	object.m_file = orcaFile;
	object.m_sendNotificationEmail = sendNotificationEmail;
	object.m_shareInfo = shareInfo;
	object.m_allUsersWithExistingAccess = isAllUsersWithExistingAccess;
	object.setData(object.m_file);
	object.setupActionAndRun(syncType, listener, customIdentifier, fileSystem);
	return object;
};
oFF.OrcaFileShareAction.prototype.m_allUsersWithExistingAccess = false;
oFF.OrcaFileShareAction.prototype.m_file = null;
oFF.OrcaFileShareAction.prototype.m_sendNotificationEmail = false;
oFF.OrcaFileShareAction.prototype.m_shareInfo = null;
oFF.OrcaFileShareAction.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	this.endSync();
};
oFF.OrcaFileShareAction.prototype.processSynchronization = function(syncType)
{
	let uri = oFF.XUri.createFromUrl(oFF.OrcaResourceConstants.REST_ENDPOINT);
	let connection = this.getActionContext().getOrcaConnection();
	let ocpFunction = connection.newRpcFunctionByUri(uri);
	let request = ocpFunction.getRpcRequest();
	let queryData = oFF.ContentlibQueryDataBuilder.create().setFile(this.m_file).setAccessState(this.m_shareInfo).setSendEmailNotification(this.m_sendNotificationEmail).setIsAllUsersWithExistingAccess(this.m_allUsersWithExistingAccess).build();
	let payloadStructure = this.m_file.getFsBase().getQuery(oFF.ContentlibRequestAction.SHARE_FILE).getPayload(queryData);
	request.setRequestStructure(payloadStructure);
	ocpFunction.processFunctionExecution(syncType, this, null);
	return true;
};

oFF.ContentlibModule = function() {};
oFF.ContentlibModule.prototype = new oFF.DfModule();
oFF.ContentlibModule.prototype._ff_c = "ContentlibModule";

oFF.ContentlibModule.s_module = null;
oFF.ContentlibModule.getInstance = function()
{
	if (oFF.isNull(oFF.ContentlibModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.RuntimeModule.getInstance());
		oFF.ContentlibModule.s_module = oFF.DfModule.startExt(new oFF.ContentlibModule());
		oFF.ContentlibRequestAction.staticSetup();
		oFF.ProgramRegistry.setProgramFactory(new oFF.SubSysFsContentlibPrg());
		oFF.DfModule.stopExt(oFF.ContentlibModule.s_module);
	}
	return oFF.ContentlibModule.s_module;
};
oFF.ContentlibModule.prototype.getName = function()
{
	return "ff2150.contentlib";
};

oFF.ContentlibModule.getInstance();

return oFF;
} );