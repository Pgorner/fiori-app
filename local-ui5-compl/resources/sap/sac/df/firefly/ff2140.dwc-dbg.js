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

oFF.DwcFsConstants = {

	AMPERSAND:"&",
	ANALYTICAL_DATASET_TYPE:"DWC_FACT",
	ANALYTICAL_MODEL_TYPE:"DWC_CUBE",
	AND:" AND ",
	ATTRIBUTES:"attributes",
	CONSUMPTION_VIEW_PROSPECTIVE_TYPE:"DWC_CUBE",
	CURRICULUM:"curriculum",
	DWC:"DWC",
	DWC_FOLDER:"folder",
	DWC_SCHEMA_NAME_KEY:"space_name",
	ENCODED_DOUBLE_QUOTES:"%22",
	FACT_VIEW:"fact-view",
	FOLDER:"Folder",
	FOLDER_ID:"id",
	FOLDER_ID_RESPONSE:"folder_id",
	FOLDER_NAME_RESPONSE:"folder_name",
	FPA_ICON_PREFIX:"sap-icon://fpa/",
	ICON_FACT_VIEW:"FACTVIEW",
	ICON_FOLDER:"FOLDER",
	ICON_LIVEMODEL:"LIVEMODEL",
	ICON_PREFIX:"sap-icon://",
	ICON_SPACE:"SPACE",
	INA_MODEL:"inamodel",
	LIVE_MODEL:"live-model",
	NODE_TYPE_FOLDER:"sap.repo.folder",
	NODE_TYPE_SPACE:"sap.dwc.space",
	RESULT_BUSINESS_NAME_KEY:"businessName",
	RESULT_BUSINESS_TYPE_KEY:"deployment_business_type",
	RESULT_DEPLOYMENT_NAME_KEY:"deployment_name",
	RESULT_KIND_KEY:"kind",
	RESULT_LABEL_KEY:"business_name",
	RESULT_NAME_KEY:"name",
	RESULT_OBJECT_CREATOR_DISPLAY_NAME_KEY:"creator_user_name",
	RESULT_PARENT_HIERARCHY_KEY:"@com.sap.vocabularies.Search.v1.ParentHierarchies",
	RESULT_SEARCH_ROOT_KEY:"value",
	RESULT_SEARCH_TOTAL_COUNT_KEY:"@odata.count",
	RESULT_SPACE_CREATOR_DISPLAY_NAME_KEY:"#creatorBusinessName",
	RESULT_SPACE_LISTING_ROOT_KEY:"results",
	RESULT_SPACE_NAME_KEY:"space_name",
	SPACE_FOLDER:"Space",
	WILDCARD:"*"
};

oFF.DwcGenericFileRequestListener2 = function() {};
oFF.DwcGenericFileRequestListener2.prototype = new oFF.XObject();
oFF.DwcGenericFileRequestListener2.prototype._ff_c = "DwcGenericFileRequestListener2";

oFF.DwcGenericFileRequestListener2.create = function(callback)
{
	let listener = new oFF.DwcGenericFileRequestListener2();
	listener.callback = callback;
	return listener;
};
oFF.DwcGenericFileRequestListener2.prototype.callback = null;
oFF.DwcGenericFileRequestListener2.prototype.onHttpFileProcessed = function(extResult, data, customIdentifier)
{
	this.callback(extResult);
};

oFF.AllSpacesSearchRequestBuilder = function() {};
oFF.AllSpacesSearchRequestBuilder.prototype = new oFF.XObject();
oFF.AllSpacesSearchRequestBuilder.prototype._ff_c = "AllSpacesSearchRequestBuilder";

oFF.AllSpacesSearchRequestBuilder.SEARCH_COUNT = "$count=true";
oFF.AllSpacesSearchRequestBuilder.SEARCH_ORDER_BY = "$orderby=";
oFF.AllSpacesSearchRequestBuilder.SEARCH_QUERY_FILTER = "$apply=filter(Search.search(query=%27SCOPE:SEARCH_DESIGN%20(kind:EQ(S):%22sap.dwc.space%22)%20*%27))";
oFF.AllSpacesSearchRequestBuilder.SEARCH_SELECT = "$select=space_name,business_name,creator_user_name,id,kind";
oFF.AllSpacesSearchRequestBuilder.SEARCH_SKIP = "$skip=";
oFF.AllSpacesSearchRequestBuilder.SEARCH_TOP = "$top=";
oFF.AllSpacesSearchRequestBuilder.SEARCH_URL = "/repository/search/$all?";
oFF.AllSpacesSearchRequestBuilder.SEARCH_WHY_FOUND = "whyfound=true";
oFF.AllSpacesSearchRequestBuilder.create = function(fileQueryConfig)
{
	let builder = new oFF.AllSpacesSearchRequestBuilder();
	builder.m_fileQueryConfig = fileQueryConfig;
	return builder;
};
oFF.AllSpacesSearchRequestBuilder.prototype.m_fileQueryConfig = null;
oFF.AllSpacesSearchRequestBuilder.prototype.build = function()
{
	let orderByKey = "";
	let dwcSortDirection = "";
	let top = -1;
	let skip = -1;
	if (oFF.notNull(this.m_fileQueryConfig))
	{
		skip = this.m_fileQueryConfig.getOffset();
		top = this.m_fileQueryConfig.getMaxItems();
		if (this.m_fileQueryConfig.getSingleSortDef() !== null)
		{
			let ffSortDirection = this.m_fileQueryConfig.getSingleSortDef().getDirection().getName();
			dwcSortDirection = oFF.DwcFileUtil.getDwcSortDirection(ffSortDirection);
			let daAttributeName = this.m_fileQueryConfig.getSingleSortDef().getAttributeName();
			orderByKey = oFF.DwcFileUtil.getAllSpaceSearchOrderByKey(daAttributeName, dwcSortDirection);
		}
	}
	let stringUrlBuffer = oFF.XStringBuffer.create();
	stringUrlBuffer.append(oFF.AllSpacesSearchRequestBuilder.SEARCH_URL);
	if (top !== -1)
	{
		let searchUriTopFilter = oFF.XStringUtils.concatenate2(oFF.AllSpacesSearchRequestBuilder.SEARCH_TOP, oFF.XInteger.convertToString(top));
		stringUrlBuffer.append(searchUriTopFilter).append(oFF.DwcFsConstants.AMPERSAND);
	}
	if (skip !== -1)
	{
		let searchUriSkipFilter = oFF.XStringUtils.concatenate2(oFF.AllSpacesSearchRequestBuilder.SEARCH_SKIP, oFF.XInteger.convertToString(skip));
		stringUrlBuffer.append(searchUriSkipFilter).append(oFF.DwcFsConstants.AMPERSAND);
	}
	stringUrlBuffer.append(oFF.AllSpacesSearchRequestBuilder.SEARCH_COUNT).append(oFF.DwcFsConstants.AMPERSAND);
	stringUrlBuffer.append(oFF.AllSpacesSearchRequestBuilder.SEARCH_WHY_FOUND).append(oFF.DwcFsConstants.AMPERSAND);
	stringUrlBuffer.append(oFF.AllSpacesSearchRequestBuilder.SEARCH_SELECT).append(oFF.DwcFsConstants.AMPERSAND);
	stringUrlBuffer.append(oFF.AllSpacesSearchRequestBuilder.SEARCH_QUERY_FILTER).append(oFF.DwcFsConstants.AMPERSAND);
	if (!oFF.XStringUtils.isNullOrEmpty(orderByKey))
	{
		stringUrlBuffer.append(oFF.AllSpacesSearchRequestBuilder.SEARCH_ORDER_BY).append(orderByKey);
	}
	return stringUrlBuffer.toString();
};

oFF.BaseChildrenRequestBuilder = function() {};
oFF.BaseChildrenRequestBuilder.prototype = new oFF.XObject();
oFF.BaseChildrenRequestBuilder.prototype._ff_c = "BaseChildrenRequestBuilder";

oFF.BaseChildrenRequestBuilder.CLOSE_BRACKETS = ")";
oFF.BaseChildrenRequestBuilder.SEARCH_COUNT = "$count=true";
oFF.BaseChildrenRequestBuilder.SEARCH_ORDER_BY = "$orderby=";
oFF.BaseChildrenRequestBuilder.SEARCH_QUERY_FILTER_CLOSE = "%27))";
oFF.BaseChildrenRequestBuilder.SEARCH_SELECT = "$select=space_id,business_name,deployment_name,creator_user_name,deployment_business_type,id,space_description,space_name,folder_id,folder_name,kind";
oFF.BaseChildrenRequestBuilder.SEARCH_SKIP = "$skip=";
oFF.BaseChildrenRequestBuilder.SEARCH_TOP = "$top=";
oFF.BaseChildrenRequestBuilder.SEARCH_URL = "/repository/search/$all?";
oFF.BaseChildrenRequestBuilder.SEARCH_WHY_FOUND = "whyfound=true";
oFF.BaseChildrenRequestBuilder.prototype.folderId = null;
oFF.BaseChildrenRequestBuilder.prototype.m_fileQueryConfig = null;
oFF.BaseChildrenRequestBuilder.prototype.m_searchText = null;
oFF.BaseChildrenRequestBuilder.prototype.getCommonRequestParameters = function(orderByKey)
{
	let top = -1;
	let skip = -1;
	let searchUriTopFilter = "";
	let searchUriSkipFilter = "";
	let searchUriOrderByFilter = "";
	if (oFF.notNull(this.m_fileQueryConfig))
	{
		skip = this.m_fileQueryConfig.getOffset();
		top = this.m_fileQueryConfig.getMaxItems();
	}
	if (top !== -1)
	{
		searchUriTopFilter = oFF.XStringUtils.concatenate2(oFF.BaseChildrenRequestBuilder.SEARCH_TOP, oFF.XInteger.convertToString(top));
	}
	if (skip !== -1)
	{
		searchUriSkipFilter = oFF.XStringUtils.concatenate2(oFF.BaseChildrenRequestBuilder.SEARCH_SKIP, oFF.XInteger.convertToString(skip));
	}
	if (!oFF.XStringUtils.isNullOrEmpty(orderByKey))
	{
		searchUriOrderByFilter = oFF.XStringUtils.concatenate2(oFF.BaseChildrenRequestBuilder.SEARCH_ORDER_BY, orderByKey);
	}
	let stringUrlBuffer = oFF.XStringBuffer.create();
	stringUrlBuffer.append(oFF.BaseChildrenRequestBuilder.SEARCH_URL);
	if (!oFF.XStringUtils.isNullOrEmpty(searchUriTopFilter))
	{
		stringUrlBuffer.append(searchUriTopFilter).append(oFF.DwcFsConstants.AMPERSAND);
	}
	if (!oFF.XStringUtils.isNullOrEmpty(searchUriSkipFilter))
	{
		stringUrlBuffer.append(searchUriSkipFilter).append(oFF.DwcFsConstants.AMPERSAND);
	}
	if (!oFF.XStringUtils.isNullOrEmpty(searchUriOrderByFilter))
	{
		stringUrlBuffer.append(searchUriOrderByFilter).append(oFF.DwcFsConstants.AMPERSAND);
	}
	stringUrlBuffer.append(oFF.BaseChildrenRequestBuilder.SEARCH_COUNT).append(oFF.DwcFsConstants.AMPERSAND);
	stringUrlBuffer.append(oFF.BaseChildrenRequestBuilder.SEARCH_WHY_FOUND).append(oFF.DwcFsConstants.AMPERSAND);
	stringUrlBuffer.append(oFF.BaseChildrenRequestBuilder.SEARCH_SELECT).append(oFF.DwcFsConstants.AMPERSAND);
	return stringUrlBuffer;
};

oFF.DeployedObjectsSearchRequestBuilder = function() {};
oFF.DeployedObjectsSearchRequestBuilder.prototype = new oFF.XObject();
oFF.DeployedObjectsSearchRequestBuilder.prototype._ff_c = "DeployedObjectsSearchRequestBuilder";

oFF.DeployedObjectsSearchRequestBuilder.CLOSE_BRACKETS = ")";
oFF.DeployedObjectsSearchRequestBuilder.OPEN_BRACKETS = "(";
oFF.DeployedObjectsSearchRequestBuilder.SEARCH_COLUMNS_FILTER = "AND (business_name deployment_name creator_user_name):";
oFF.DeployedObjectsSearchRequestBuilder.SEARCH_COUNT = "$count=true";
oFF.DeployedObjectsSearchRequestBuilder.SEARCH_FILTER_CLOSE = ")%27))";
oFF.DeployedObjectsSearchRequestBuilder.SEARCH_OBJECT_TYPE_FILTER = "kind:EQ(S):%22deployedObject%22 AND exposed_for_consumption_id:EQ(S):%22true%22 AND (deployment_business_type:EQ(S):%22DWC_CUBE%22 OR deployment_business_type:EQ(S):%22DWC_FACT%22)";
oFF.DeployedObjectsSearchRequestBuilder.SEARCH_ORDER_BY = "$orderby=";
oFF.DeployedObjectsSearchRequestBuilder.SEARCH_QUERY_WITHOUT_SPACE_FILTER = "$apply=filter(Search.search(query=%27SCOPE:SEARCH_DESIGN (";
oFF.DeployedObjectsSearchRequestBuilder.SEARCH_QUERY_WITH_SPACE_FILTER = "$apply=filter(Search.search(query=%27SCOPE:SEARCH_DESIGN (space_name:EQ(S):";
oFF.DeployedObjectsSearchRequestBuilder.SEARCH_SELECT = "$select=business_name,deployment_name,creator_user_name,deployment_business_type,space_name,name";
oFF.DeployedObjectsSearchRequestBuilder.SEARCH_SKIP = "$skip=";
oFF.DeployedObjectsSearchRequestBuilder.SEARCH_TOP = "$top=";
oFF.DeployedObjectsSearchRequestBuilder.SEARCH_URL = "/repository/search/$all?";
oFF.DeployedObjectsSearchRequestBuilder.SEARCH_WHY_FOUND = "whyfound=true";
oFF.DeployedObjectsSearchRequestBuilder.create = function(spaceName, searchText, fileQueryConfig)
{
	let builder = new oFF.DeployedObjectsSearchRequestBuilder();
	builder.m_spaceName = spaceName;
	builder.m_searchText = searchText;
	builder.m_fileQueryConfig = fileQueryConfig;
	return builder;
};
oFF.DeployedObjectsSearchRequestBuilder.prototype.m_fileQueryConfig = null;
oFF.DeployedObjectsSearchRequestBuilder.prototype.m_searchText = null;
oFF.DeployedObjectsSearchRequestBuilder.prototype.m_spaceName = null;
oFF.DeployedObjectsSearchRequestBuilder.prototype.build = function()
{
	let dwcOrderByKey = "";
	let dwcSortDirection = "";
	let searchUriTopFilter = "";
	let searchUriSkipFilter = "";
	let searchUriOrderByFilter = "";
	let top = -1;
	let skip = -1;
	if (oFF.notNull(this.m_fileQueryConfig))
	{
		skip = this.m_fileQueryConfig.getOffset();
		top = this.m_fileQueryConfig.getMaxItems();
		if (this.m_fileQueryConfig.getSingleSortDef() !== null)
		{
			let daAttributeName = this.m_fileQueryConfig.getSingleSortDef().getAttributeName();
			dwcOrderByKey = this.getDwcOrderByKey(daAttributeName);
			let ffSortDirection = this.m_fileQueryConfig.getSingleSortDef().getDirection().getName();
			dwcSortDirection = oFF.DwcFileUtil.getDwcSortDirection(ffSortDirection);
		}
	}
	if (top !== -1)
	{
		searchUriTopFilter = oFF.XStringUtils.concatenate2(oFF.DeployedObjectsSearchRequestBuilder.SEARCH_TOP, oFF.XInteger.convertToString(top));
	}
	if (skip !== -1)
	{
		searchUriSkipFilter = oFF.XStringUtils.concatenate2(oFF.DeployedObjectsSearchRequestBuilder.SEARCH_SKIP, oFF.XInteger.convertToString(skip));
	}
	if (!oFF.XStringUtils.isNullOrEmpty(dwcOrderByKey))
	{
		searchUriOrderByFilter = oFF.XStringUtils.concatenate4(oFF.DeployedObjectsSearchRequestBuilder.SEARCH_ORDER_BY, dwcOrderByKey, " ", dwcSortDirection);
	}
	let stringUrlBuffer = oFF.XStringBuffer.create();
	stringUrlBuffer.append(oFF.DeployedObjectsSearchRequestBuilder.SEARCH_URL);
	if (!oFF.XStringUtils.isNullOrEmpty(searchUriTopFilter))
	{
		stringUrlBuffer.append(searchUriTopFilter).append(oFF.DwcFsConstants.AMPERSAND);
	}
	if (!oFF.XStringUtils.isNullOrEmpty(searchUriSkipFilter))
	{
		stringUrlBuffer.append(searchUriSkipFilter).append(oFF.DwcFsConstants.AMPERSAND);
	}
	if (!oFF.XStringUtils.isNullOrEmpty(searchUriOrderByFilter))
	{
		stringUrlBuffer.append(searchUriOrderByFilter).append(oFF.DwcFsConstants.AMPERSAND);
	}
	stringUrlBuffer.append(oFF.DeployedObjectsSearchRequestBuilder.SEARCH_COUNT).append(oFF.DwcFsConstants.AMPERSAND);
	stringUrlBuffer.append(oFF.DeployedObjectsSearchRequestBuilder.SEARCH_WHY_FOUND).append(oFF.DwcFsConstants.AMPERSAND);
	stringUrlBuffer.append(oFF.DeployedObjectsSearchRequestBuilder.SEARCH_SELECT).append(oFF.DwcFsConstants.AMPERSAND);
	if (oFF.notNull(this.m_spaceName))
	{
		stringUrlBuffer.append(oFF.DeployedObjectsSearchRequestBuilder.SEARCH_QUERY_WITH_SPACE_FILTER).append(oFF.DwcFsConstants.ENCODED_DOUBLE_QUOTES).append(this.m_spaceName).append(oFF.DwcFsConstants.ENCODED_DOUBLE_QUOTES);
		stringUrlBuffer.append(oFF.DwcFsConstants.AND).append(oFF.DeployedObjectsSearchRequestBuilder.SEARCH_OBJECT_TYPE_FILTER).append(oFF.DeployedObjectsSearchRequestBuilder.SEARCH_COLUMNS_FILTER);
	}
	else
	{
		stringUrlBuffer.append(oFF.DeployedObjectsSearchRequestBuilder.SEARCH_QUERY_WITHOUT_SPACE_FILTER);
		stringUrlBuffer.append(oFF.DeployedObjectsSearchRequestBuilder.SEARCH_OBJECT_TYPE_FILTER).append(oFF.DeployedObjectsSearchRequestBuilder.SEARCH_COLUMNS_FILTER);
	}
	let encodedSearchString = oFF.XHttpUtils.encodeURIComponent(this.m_searchText);
	stringUrlBuffer.append(oFF.DeployedObjectsSearchRequestBuilder.OPEN_BRACKETS).append(encodedSearchString).append(oFF.DeployedObjectsSearchRequestBuilder.CLOSE_BRACKETS).append(oFF.DeployedObjectsSearchRequestBuilder.SEARCH_FILTER_CLOSE);
	return stringUrlBuffer.toString();
};
oFF.DeployedObjectsSearchRequestBuilder.prototype.getDwcOrderByKey = function(daAttributeName)
{
	let dwcOrderByKey = "";
	if (this.isDisplayName(daAttributeName) || this.isName(daAttributeName))
	{
		dwcOrderByKey = oFF.DwcFsConstants.RESULT_DEPLOYMENT_NAME_KEY;
	}
	else if (this.isDescription(daAttributeName))
	{
		dwcOrderByKey = oFF.DwcFsConstants.RESULT_LABEL_KEY;
	}
	else if (this.isCreatedByDisplayName(daAttributeName) || this.isCreatedByName(daAttributeName))
	{
		dwcOrderByKey = oFF.DwcFsConstants.RESULT_OBJECT_CREATOR_DISPLAY_NAME_KEY;
	}
	return dwcOrderByKey;
};
oFF.DeployedObjectsSearchRequestBuilder.prototype.isCreatedByDisplayName = function(daAttributeName)
{
	return oFF.XString.isEqual(daAttributeName, oFF.XFileAttribute.CREATED_BY_DISPLAY_NAME);
};
oFF.DeployedObjectsSearchRequestBuilder.prototype.isCreatedByName = function(daAttributeName)
{
	return oFF.XString.isEqual(daAttributeName, oFF.XFileAttribute.CREATED_BY);
};
oFF.DeployedObjectsSearchRequestBuilder.prototype.isDescription = function(daAttributeName)
{
	return oFF.XString.isEqual(daAttributeName, oFF.XFileAttribute.DESCRIPTION);
};
oFF.DeployedObjectsSearchRequestBuilder.prototype.isDisplayName = function(daAttributeName)
{
	return oFF.XString.isEqual(daAttributeName, oFF.XFileAttribute.DISPLAY_NAME);
};
oFF.DeployedObjectsSearchRequestBuilder.prototype.isName = function(daAttributeName)
{
	return oFF.XString.isEqual(daAttributeName, oFF.XFileAttribute.NAME);
};

oFF.ListAllSpacesRequestBuilder = function() {};
oFF.ListAllSpacesRequestBuilder.prototype = new oFF.XObject();
oFF.ListAllSpacesRequestBuilder.prototype._ff_c = "ListAllSpacesRequestBuilder";

oFF.ListAllSpacesRequestBuilder.SPACE_URL = "/repository/spaces?inSpaceManagement=false&details=id,name,business_name,%23creatorBusinessName";
oFF.ListAllSpacesRequestBuilder.create = function()
{
	return new oFF.ListAllSpacesRequestBuilder();
};
oFF.ListAllSpacesRequestBuilder.prototype.build = function()
{
	return oFF.ListAllSpacesRequestBuilder.SPACE_URL;
};

oFF.DatasphereRequestFactory = {

	getAllSpacesSearchRequest:function(fileQueryConfig)
	{
			return oFF.AllSpacesSearchRequestBuilder.create(fileQueryConfig).build();
	},
	getDeployedObjectsSearchRequest:function(spaceName, searchText, fileQueryConfig)
	{
			return oFF.DeployedObjectsSearchRequestBuilder.create(spaceName, searchText, fileQueryConfig).build();
	},
	getGlobalSearchRequest:function(searchText, fileQueryConfig)
	{
			return oFF.GlobalSearchRequestBuilder.create(searchText, fileQueryConfig).build();
	},
	getListSpaceOrFolderChildrenRequest:function(folderId, searchText, fileQueryConfig)
	{
			return oFF.ListSpaceOrFolderChildrenRequestBuilder.create(folderId, searchText, fileQueryConfig).build();
	},
	getSearchInSpaceOrFolderRequest:function(folderId, searchText, fileQueryConfig)
	{
			return oFF.SearchInSpaceOrFolderRequestBuilder.create(folderId, searchText, fileQueryConfig).build();
	},
	getSortGlobalSearchRequest:function(searchText, fileQueryConfig)
	{
			return oFF.SortGlobalSearchResultsRequestBuilder.create(searchText, fileQueryConfig).build();
	},
	getSortSearchResultsForSpaceOrFolderRequest:function(folderId, searchText, fileQueryConfig)
	{
			return oFF.SortSearchResultsForSpaceOrFolderRequestBuilder.create(folderId, searchText, fileQueryConfig).build();
	},
	listAllSpacesRequest:function()
	{
			return oFF.ListAllSpacesRequestBuilder.create().build();
	}
};

oFF.AllSpacesSearchRequestProcessor = function() {};
oFF.AllSpacesSearchRequestProcessor.prototype = new oFF.XObject();
oFF.AllSpacesSearchRequestProcessor.prototype._ff_c = "AllSpacesSearchRequestProcessor";

oFF.AllSpacesSearchRequestProcessor.create = function()
{
	return new oFF.AllSpacesSearchRequestProcessor();
};
oFF.AllSpacesSearchRequestProcessor.prototype.m_fileQueryConfig = null;
oFF.AllSpacesSearchRequestProcessor.prototype.accept = function(file, fileQueryConfig)
{
	this.m_fileQueryConfig = fileQueryConfig;
	return oFF.DwcFileUtil.isListAllSpacesRequest(file, fileQueryConfig.getSearchValue());
};
oFF.AllSpacesSearchRequestProcessor.prototype.process = function()
{
	return oFF.DatasphereRequestFactory.getAllSpacesSearchRequest(this.m_fileQueryConfig);
};

oFF.BaseSearchRequestProcessor = function() {};
oFF.BaseSearchRequestProcessor.prototype = new oFF.XObject();
oFF.BaseSearchRequestProcessor.prototype._ff_c = "BaseSearchRequestProcessor";

oFF.BaseSearchRequestProcessor.AND = "AND";
oFF.BaseSearchRequestProcessor.CARET = "^";
oFF.BaseSearchRequestProcessor.CLOSE_PARENTHESES = ")";
oFF.BaseSearchRequestProcessor.CLOSE_SQUARE_BRACKET = "]";
oFF.BaseSearchRequestProcessor.COLON = ":";
oFF.BaseSearchRequestProcessor.DOUBLE_QUOTE = "\"";
oFF.BaseSearchRequestProcessor.HIPHEN = "-";
oFF.BaseSearchRequestProcessor.NOT = "NOT";
oFF.BaseSearchRequestProcessor.OPEN_PARENTHESES = "(";
oFF.BaseSearchRequestProcessor.OPEN_SQUARE_BRACKET = "[";
oFF.BaseSearchRequestProcessor.OR = "OR";
oFF.BaseSearchRequestProcessor.QUESTION_MARK = "?";
oFF.BaseSearchRequestProcessor.SINGLE_BACK_SLASH = "\\";
oFF.BaseSearchRequestProcessor.SINGLE_QUOTE = "'";
oFF.BaseSearchRequestProcessor.TILDE = "~";
oFF.BaseSearchRequestProcessor.prototype.getDataSphereRequestReservedCharacters = function()
{
	let reservedCharacters = oFF.XArray.create(12);
	reservedCharacters.set(0, oFF.BaseSearchRequestProcessor.SINGLE_BACK_SLASH);
	reservedCharacters.set(1, oFF.BaseSearchRequestProcessor.HIPHEN);
	reservedCharacters.set(2, oFF.BaseSearchRequestProcessor.OPEN_PARENTHESES);
	reservedCharacters.set(3, oFF.BaseSearchRequestProcessor.CLOSE_PARENTHESES);
	reservedCharacters.set(4, oFF.BaseSearchRequestProcessor.TILDE);
	reservedCharacters.set(5, oFF.BaseSearchRequestProcessor.CARET);
	reservedCharacters.set(6, oFF.BaseSearchRequestProcessor.QUESTION_MARK);
	reservedCharacters.set(7, oFF.BaseSearchRequestProcessor.DOUBLE_QUOTE);
	reservedCharacters.set(8, oFF.BaseSearchRequestProcessor.COLON);
	reservedCharacters.set(9, oFF.BaseSearchRequestProcessor.SINGLE_QUOTE);
	reservedCharacters.set(10, oFF.BaseSearchRequestProcessor.OPEN_SQUARE_BRACKET);
	reservedCharacters.set(11, oFF.BaseSearchRequestProcessor.CLOSE_SQUARE_BRACKET);
	return reservedCharacters;
};
oFF.BaseSearchRequestProcessor.prototype.getDataSphereRequestReservedWords = function()
{
	let reservedWords = oFF.XArray.create(3);
	reservedWords.set(0, oFF.BaseSearchRequestProcessor.AND);
	reservedWords.set(1, oFF.BaseSearchRequestProcessor.OR);
	reservedWords.set(2, oFF.BaseSearchRequestProcessor.NOT);
	return reservedWords;
};

oFF.ListSpaceOrFolderChildrenRequestProcessor = function() {};
oFF.ListSpaceOrFolderChildrenRequestProcessor.prototype = new oFF.XObject();
oFF.ListSpaceOrFolderChildrenRequestProcessor.prototype._ff_c = "ListSpaceOrFolderChildrenRequestProcessor";

oFF.ListSpaceOrFolderChildrenRequestProcessor.create = function()
{
	return new oFF.ListSpaceOrFolderChildrenRequestProcessor();
};
oFF.ListSpaceOrFolderChildrenRequestProcessor.prototype.m_file = null;
oFF.ListSpaceOrFolderChildrenRequestProcessor.prototype.m_fileQueryConfig = null;
oFF.ListSpaceOrFolderChildrenRequestProcessor.prototype.accept = function(file, fileQueryConfig)
{
	this.m_file = file;
	this.m_fileQueryConfig = fileQueryConfig;
	return oFF.DwcFileUtil.isListSpaceOrFolderChildrenRequest(file, fileQueryConfig.getSearchValue());
};
oFF.ListSpaceOrFolderChildrenRequestProcessor.prototype.process = function()
{
	let searchText = oFF.XString.trim(this.m_fileQueryConfig.getSearchValue());
	searchText = !oFF.XStringUtils.isNullOrEmpty(searchText) ? searchText : oFF.DwcFsConstants.WILDCARD;
	let folderId = this.m_file.getProviderMetadataAndAttributes().getStringByKey(oFF.XFileAttribute.FOLDER_ID);
	if (oFF.isNull(folderId))
	{
		folderId = this.m_file.getName();
	}
	return oFF.DatasphereRequestFactory.getListSpaceOrFolderChildrenRequest(folderId, searchText, this.m_fileQueryConfig);
};

oFF.BaseDatasphereResponseProcessor = function() {};
oFF.BaseDatasphereResponseProcessor.prototype = new oFF.XObject();
oFF.BaseDatasphereResponseProcessor.prototype._ff_c = "BaseDatasphereResponseProcessor";

oFF.BaseDatasphereResponseProcessor.DWC = "dwc";
oFF.BaseDatasphereResponseProcessor.SPACE = "Space";
oFF.BaseDatasphereResponseProcessor.prototype.m_iconMap = null;
oFF.BaseDatasphereResponseProcessor.prototype.getIconByName = function(key)
{
	return this.m_iconMap.getByKey(key);
};
oFF.BaseDatasphereResponseProcessor.prototype.setupIcons = function()
{
	this.m_iconMap = oFF.XLinkedHashMapByString.create();
	this.m_iconMap.put(oFF.DwcFsConstants.ICON_LIVEMODEL, oFF.XStringUtils.concatenate2(oFF.DwcFsConstants.FPA_ICON_PREFIX, oFF.DwcFsConstants.LIVE_MODEL));
	this.m_iconMap.put(oFF.DwcFsConstants.ICON_FACT_VIEW, oFF.XStringUtils.concatenate2(oFF.DwcFsConstants.FPA_ICON_PREFIX, oFF.DwcFsConstants.FACT_VIEW));
	this.m_iconMap.put(oFF.DwcFsConstants.ICON_SPACE, oFF.XStringUtils.concatenate2(oFF.DwcFsConstants.ICON_PREFIX, oFF.DwcFsConstants.CURRICULUM));
	this.m_iconMap.put(oFF.DwcFsConstants.ICON_FOLDER, oFF.XStringUtils.concatenate2(oFF.DwcFsConstants.ICON_PREFIX, oFF.DwcFsConstants.DWC_FOLDER));
};

oFF.DwcFileUtil = {

	ASC:"ASC",
	ASCENDING:"ASCENDING",
	BACKSLASH:"\\",
	COMMA:",",
	DESC:"DESC",
	DOUBLE_QUOTE:"\"",
	DOUBLE_QUOTE_WITH_TRAILING_SPACE:"\" ",
	SINGLE_QUOTE:"'",
	SINGLE_QUOTE_OPEN_CLOSE:"''",
	SPACE_DIRECTORY:"Space",
	SPACE_DIRECTORY_WITH_SEPARATOR:"Space/",
	WHITESPACE:" ",
	addCommonMetaData:function(objectMetadata)
	{
			objectMetadata.putBoolean(oFF.XFileAttribute.IS_HIDDEN, false);
		objectMetadata.putBoolean(oFF.XFileAttribute.IS_EXECUTABLE, false);
		objectMetadata.putBoolean(oFF.XFileAttribute.SUPPORTS_CARTESIAN_FILTER, false);
		objectMetadata.putBoolean(oFF.XFileAttribute.SUPPORTS_SEARCH, true);
		objectMetadata.putBoolean(oFF.XFileAttribute.SUPPORTS_OFFSET, true);
		objectMetadata.putBoolean(oFF.XFileAttribute.SUPPORTS_MAX_ITEMS, true);
		objectMetadata.putBoolean(oFF.XFileAttribute.SUPPORTS_SINGLE_SORT, true);
	},
	escapeSearchQueryText:function(searchQueryText, reservedCharacters, reservedWords)
	{
			let escapedQuery = oFF.XString.trim(searchQueryText);
		for (let i = 0; i < reservedCharacters.size(); i++)
		{
			let specialCharacter = reservedCharacters.get(i);
			if (oFF.XString.isEqual(specialCharacter, oFF.DwcFileUtil.SINGLE_QUOTE))
			{
				escapedQuery = oFF.DwcFileUtil.escapeSingleQuote(escapedQuery);
			}
			else
			{
				let replaceValue = oFF.XStringUtils.concatenate2(oFF.DwcFileUtil.BACKSLASH, specialCharacter);
				escapedQuery = oFF.XString.replace(escapedQuery, specialCharacter, replaceValue);
			}
		}
		for (let j = 0; j < reservedWords.size(); j++)
		{
			let specialWord = reservedWords.get(j);
			let specialWordWithTrailingSpace = oFF.XStringUtils.concatenate2(specialWord, " ");
			let specialWordWithLeadingSpace = oFF.XStringUtils.concatenate2(" ", specialWord);
			let queryStringEqualsSpecialWord = oFF.XString.isEqual(specialWord, escapedQuery);
			if (queryStringEqualsSpecialWord)
			{
				escapedQuery = oFF.XStringUtils.concatenate3(oFF.DwcFileUtil.DOUBLE_QUOTE, specialWord, oFF.DwcFileUtil.DOUBLE_QUOTE);
			}
			let queryStringWithTrailingSpace = oFF.XString.startsWith(escapedQuery, specialWordWithTrailingSpace);
			if (queryStringWithTrailingSpace)
			{
				let subString1 = oFF.XString.substring(escapedQuery, oFF.XString.size(specialWord) + 1, oFF.XString.size(escapedQuery));
				escapedQuery = oFF.XStringUtils.concatenate4(oFF.DwcFileUtil.DOUBLE_QUOTE, specialWord, oFF.DwcFileUtil.DOUBLE_QUOTE_WITH_TRAILING_SPACE, subString1);
			}
			let queryStringWithLeadingSpace = oFF.XString.endsWith(escapedQuery, specialWordWithLeadingSpace);
			if (queryStringWithLeadingSpace)
			{
				let subString2 = oFF.XString.substring(escapedQuery, 0, oFF.XString.size(escapedQuery) - oFF.XString.size(specialWord));
				escapedQuery = oFF.XStringUtils.concatenate4(subString2, oFF.DwcFileUtil.DOUBLE_QUOTE, specialWord, oFF.DwcFileUtil.DOUBLE_QUOTE_WITH_TRAILING_SPACE);
			}
		}
		return escapedQuery;
	},
	escapeSingleQuote:function(query)
	{
			return oFF.XString.replace(query, oFF.DwcFileUtil.SINGLE_QUOTE, oFF.DwcFileUtil.SINGLE_QUOTE_OPEN_CLOSE);
	},
	getAllSpaceSearchOrderByKey:function(daAttributeName, sortDirection)
	{
			let stringUrlBuffer = oFF.XStringBuffer.create();
		if (oFF.DwcFileUtil.isDisplayName(daAttributeName) || oFF.DwcFileUtil.isName(daAttributeName))
		{
			stringUrlBuffer.append(oFF.DwcFsConstants.DWC_SCHEMA_NAME_KEY);
			stringUrlBuffer.append(oFF.DwcFileUtil.WHITESPACE);
			stringUrlBuffer.append(sortDirection);
		}
		else if (oFF.DwcFileUtil.isDescription(daAttributeName))
		{
			stringUrlBuffer.append(oFF.DwcFsConstants.RESULT_LABEL_KEY);
			stringUrlBuffer.append(oFF.DwcFileUtil.WHITESPACE);
			stringUrlBuffer.append(sortDirection);
		}
		else if (oFF.DwcFileUtil.isCreatedByDisplayName(daAttributeName) || oFF.DwcFileUtil.isCreatedByName(daAttributeName))
		{
			stringUrlBuffer.append(oFF.DwcFsConstants.RESULT_OBJECT_CREATOR_DISPLAY_NAME_KEY);
			stringUrlBuffer.append(oFF.DwcFileUtil.WHITESPACE);
			stringUrlBuffer.append(sortDirection);
		}
		return stringUrlBuffer.toString();
	},
	getBasicMetaData:function(displayName)
	{
			let typeFolderMetadata = oFF.PrFactory.createStructure();
		typeFolderMetadata.putBoolean(oFF.XFileAttribute.IS_DIRECTORY, true);
		typeFolderMetadata.putString(oFF.XFileAttribute.DISPLAY_NAME, displayName);
		oFF.DwcFileUtil.addCommonMetaData(typeFolderMetadata);
		return typeFolderMetadata;
	},
	getChildrenAttributes:function(element, file)
	{
			let objectType = "";
		let dataSourceType = "";
		let folderId = "";
		let kind = element.getStringByKey(oFF.DwcFsConstants.RESULT_KIND_KEY);
		if (oFF.notNull(kind) && (oFF.DwcFileUtil.isRepoFolder(kind) || oFF.DwcFileUtil.isRepoSpace(kind)))
		{
			objectType = oFF.DwcFsConstants.DWC_FOLDER;
			dataSourceType = oFF.DwcFsConstants.DWC_FOLDER;
			folderId = element.getStringByKey(oFF.DwcFsConstants.FOLDER_ID);
		}
		else
		{
			objectType = element.getStringByKey(oFF.DwcFsConstants.RESULT_BUSINESS_TYPE_KEY);
			dataSourceType = oFF.DwcFsConstants.INA_MODEL;
		}
		let host = file.getUri().getHost();
		let objectIcon = oFF.DwcFileUtil.getIconByObjectType(objectType);
		let schemaName = element.getStringByKey(oFF.DwcFsConstants.DWC_SCHEMA_NAME_KEY);
		let spaceObjectAttr = oFF.XHashMapByString.create();
		spaceObjectAttr.put(oFF.XFileAttribute.FOLDER_ID, folderId);
		spaceObjectAttr.put(oFF.XFileAttribute.NODE_TYPE, kind);
		spaceObjectAttr.put(oFF.XFileAttribute.ICON, objectIcon);
		let description = "";
		if (oFF.notNull(objectType) && !oFF.XString.isEqual(objectType, oFF.DwcFsConstants.DWC_FOLDER))
		{
			description = element.getStringByKey(oFF.DwcFsConstants.RESULT_LABEL_KEY);
		}
		spaceObjectAttr.put(oFF.XFileAttribute.DESCRIPTION, description);
		let createdByDisplayName = element.getStringByKey(oFF.DwcFsConstants.RESULT_OBJECT_CREATOR_DISPLAY_NAME_KEY);
		spaceObjectAttr.put(oFF.XFileAttribute.CREATED_BY_DISPLAY_NAME, createdByDisplayName);
		let displayName = "";
		if (oFF.notNull(objectType) && !oFF.XString.isEqual(objectType, oFF.DwcFsConstants.DWC_FOLDER))
		{
			displayName = element.getStringByKey(oFF.DwcFsConstants.RESULT_DEPLOYMENT_NAME_KEY);
		}
		else
		{
			displayName = element.getStringByKey(oFF.DwcFsConstants.RESULT_LABEL_KEY);
		}
		spaceObjectAttr.put(oFF.XFileAttribute.DISPLAY_NAME, displayName);
		spaceObjectAttr.put(oFF.XFileAttribute.OLAP_DATASOURCE_NAME, displayName);
		spaceObjectAttr.put(oFF.XFileAttribute.OLAP_DATASOURCE_SCHEMA, schemaName);
		spaceObjectAttr.put(oFF.XFileAttribute.SYSTEM_NAME, host);
		spaceObjectAttr.put(oFF.XFileAttribute.OLAP_DATASOURCE_TYPE, dataSourceType);
		spaceObjectAttr.put(oFF.XFileAttribute.SEMANTIC_TYPE, "");
		return spaceObjectAttr;
	},
	getCommonOrderByKeyParameters:function(daAttributeName, sortDirection, stringUrlBuffer)
	{
			if (oFF.DwcFileUtil.isDisplayName(daAttributeName) || oFF.DwcFileUtil.isName(daAttributeName))
		{
			stringUrlBuffer.append(oFF.DwcFsConstants.RESULT_DEPLOYMENT_NAME_KEY);
			stringUrlBuffer.append(oFF.DwcFileUtil.WHITESPACE);
			stringUrlBuffer.append(sortDirection);
			if (oFF.XString.containsString(stringUrlBuffer.toString(), oFF.DwcFsConstants.RESULT_KIND_KEY))
			{
				stringUrlBuffer.append(oFF.DwcFileUtil.COMMA);
				stringUrlBuffer.append(oFF.DwcFsConstants.RESULT_LABEL_KEY);
				stringUrlBuffer.append(oFF.DwcFileUtil.WHITESPACE);
				stringUrlBuffer.append(sortDirection);
			}
		}
		else if (oFF.DwcFileUtil.isDescription(daAttributeName))
		{
			stringUrlBuffer.append(oFF.DwcFsConstants.RESULT_LABEL_KEY);
			stringUrlBuffer.append(oFF.DwcFileUtil.WHITESPACE);
			stringUrlBuffer.append(sortDirection);
		}
		else if (oFF.DwcFileUtil.isCreatedByDisplayName(daAttributeName) || oFF.DwcFileUtil.isCreatedByName(daAttributeName))
		{
			stringUrlBuffer.append(oFF.DwcFsConstants.RESULT_OBJECT_CREATOR_DISPLAY_NAME_KEY);
			stringUrlBuffer.append(oFF.DwcFileUtil.WHITESPACE);
			stringUrlBuffer.append(sortDirection);
		}
	},
	getDwcSortDirection:function(fireFlySortDirection)
	{
			if (oFF.XStringUtils.isNullOrEmpty(fireFlySortDirection))
		{
			return oFF.DwcFileUtil.DESC;
		}
		switch (fireFlySortDirection)
		{
			case oFF.DwcFileUtil.ASCENDING:
				return oFF.DwcFileUtil.ASC;

			default:
				return oFF.DwcFileUtil.DESC;
		}
	},
	getIconByObjectType:function(objectType)
	{
			let fullIconPath = "";
		if (oFF.XStringUtils.isNullOrEmpty(objectType) || oFF.XString.isEqual(objectType, oFF.DwcFsConstants.ANALYTICAL_DATASET_TYPE))
		{
			fullIconPath = oFF.XStringUtils.concatenate2(oFF.DwcFsConstants.FPA_ICON_PREFIX, oFF.DwcFsConstants.FACT_VIEW);
		}
		else if (oFF.XString.isEqual(objectType, oFF.DwcFsConstants.ANALYTICAL_MODEL_TYPE))
		{
			fullIconPath = oFF.XStringUtils.concatenate2(oFF.DwcFsConstants.FPA_ICON_PREFIX, oFF.DwcFsConstants.LIVE_MODEL);
		}
		else if (oFF.XString.isEqual(objectType, oFF.DwcFsConstants.CONSUMPTION_VIEW_PROSPECTIVE_TYPE))
		{
			fullIconPath = oFF.XStringUtils.concatenate2(oFF.DwcFsConstants.FPA_ICON_PREFIX, oFF.DwcFsConstants.LIVE_MODEL);
		}
		else if (oFF.XString.isEqual(objectType, oFF.DwcFsConstants.DWC_FOLDER))
		{
			fullIconPath = oFF.XStringUtils.concatenate2(oFF.DwcFsConstants.FPA_ICON_PREFIX, oFF.DwcFsConstants.DWC_FOLDER);
		}
		return fullIconPath;
	},
	getIconKey:function(objectType)
	{
			let iconId = null;
		if (oFF.XStringUtils.isNullOrEmpty(objectType) || oFF.XString.isEqual(objectType, oFF.DwcFsConstants.ANALYTICAL_DATASET_TYPE))
		{
			iconId = oFF.DwcFsConstants.ICON_FACT_VIEW;
		}
		else if (oFF.XString.isEqual(objectType, oFF.DwcFsConstants.ANALYTICAL_MODEL_TYPE))
		{
			iconId = oFF.DwcFsConstants.ICON_LIVEMODEL;
		}
		else if (oFF.XString.isEqual(objectType, oFF.DwcFsConstants.CONSUMPTION_VIEW_PROSPECTIVE_TYPE))
		{
			iconId = oFF.DwcFsConstants.ICON_LIVEMODEL;
		}
		return iconId;
	},
	getListSpaceOrFolderOrderByKeyForSorting:function(daAttributeName, sortDirection)
	{
			let stringUrlBuffer = oFF.XStringBuffer.create();
		stringUrlBuffer.append(oFF.DwcFsConstants.RESULT_KIND_KEY).append(oFF.DwcFileUtil.WHITESPACE).append(oFF.DwcFileUtil.DESC);
		stringUrlBuffer.append(oFF.DwcFileUtil.COMMA);
		oFF.DwcFileUtil.getCommonOrderByKeyParameters(daAttributeName, sortDirection, stringUrlBuffer);
		return stringUrlBuffer.toString();
	},
	getSearchSpaceOrFolderOrderByKey:function(daAttributeName, sortDirection)
	{
			let stringUrlBuffer = oFF.XStringBuffer.create();
		oFF.DwcFileUtil.getCommonOrderByKeyParameters(daAttributeName, sortDirection, stringUrlBuffer);
		return stringUrlBuffer.toString();
	},
	getSearchSpaceResultMetaData:function(spaceElement)
	{
			let displayName = spaceElement.getStringByKey(oFF.DwcFsConstants.DWC_SCHEMA_NAME_KEY);
		let description = spaceElement.getStringByKey(oFF.DwcFsConstants.RESULT_LABEL_KEY);
		let creatorDisplayName = spaceElement.getStringByKey(oFF.DwcFsConstants.RESULT_OBJECT_CREATOR_DISPLAY_NAME_KEY);
		let kind = spaceElement.getStringByKey(oFF.DwcFsConstants.RESULT_KIND_KEY);
		let folderId = spaceElement.getStringByKey(oFF.DwcFsConstants.FOLDER_ID);
		let folderMetadata = oFF.PrFactory.createStructure();
		oFF.DwcFileUtil.addCommonMetaData(folderMetadata);
		folderMetadata.putBoolean(oFF.XFileAttribute.IS_DIRECTORY, true);
		if (!oFF.XStringUtils.isNullOrEmpty(displayName))
		{
			folderMetadata.putString(oFF.XFileAttribute.DISPLAY_NAME, displayName);
		}
		if (!oFF.XStringUtils.isNullOrEmpty(description))
		{
			folderMetadata.putString(oFF.XFileAttribute.DESCRIPTION, description);
		}
		if (!oFF.XStringUtils.isNullOrEmpty(creatorDisplayName))
		{
			folderMetadata.putString(oFF.XFileAttribute.CREATED_BY_DISPLAY_NAME, creatorDisplayName);
		}
		if (!oFF.XStringUtils.isNullOrEmpty(kind))
		{
			folderMetadata.putString(oFF.XFileAttribute.NODE_TYPE, kind);
		}
		if (!oFF.XStringUtils.isNullOrEmpty(folderId))
		{
			folderMetadata.putString(oFF.XFileAttribute.FOLDER_ID, folderId);
		}
		return folderMetadata;
	},
	getSearchSpacesResultAttributes:function(spaceElement, iconName)
	{
			let spaceAttr = oFF.XHashMapByString.create();
		let kind = spaceElement.getStringByKey(oFF.DwcFsConstants.RESULT_KIND_KEY);
		spaceAttr.put(oFF.XFileAttribute.NODE_TYPE, kind);
		spaceAttr.put(oFF.XFileAttribute.SYSTEM_TYPE, oFF.SystemType.DWC.getName());
		spaceAttr.put(oFF.XFileAttribute.ICON, iconName);
		let description = spaceElement.getStringByKey(oFF.DwcFsConstants.RESULT_LABEL_KEY);
		spaceAttr.put(oFF.XFileAttribute.DESCRIPTION, description);
		let createdByDisplayName = spaceElement.getStringByKey(oFF.DwcFsConstants.RESULT_OBJECT_CREATOR_DISPLAY_NAME_KEY);
		spaceAttr.put(oFF.XFileAttribute.CREATED_BY_DISPLAY_NAME, createdByDisplayName);
		let folderId = spaceElement.getStringByKey(oFF.DwcFsConstants.FOLDER_ID);
		spaceAttr.put(oFF.XFileAttribute.FOLDER_ID, folderId);
		let displayName = spaceElement.getStringByKey(oFF.DwcFsConstants.DWC_SCHEMA_NAME_KEY);
		spaceAttr.put(oFF.XFileAttribute.DISPLAY_NAME, displayName);
		return spaceAttr;
	},
	getSpaceAttributes:function(spaceElement, iconName)
	{
			let spaceAttr = oFF.XHashMapByString.create();
		let kind = spaceElement.getStringByKey(oFF.DwcFsConstants.RESULT_KIND_KEY);
		spaceAttr.put(oFF.XFileAttribute.NODE_TYPE, kind);
		spaceAttr.put(oFF.XFileAttribute.SYSTEM_TYPE, oFF.SystemType.DWC.getName());
		spaceAttr.put(oFF.XFileAttribute.ICON, iconName);
		let description = spaceElement.getStringByKey(oFF.DwcFsConstants.RESULT_BUSINESS_NAME_KEY);
		spaceAttr.put(oFF.XFileAttribute.DESCRIPTION, description);
		let createdByDisplayName = spaceElement.getStringByKey(oFF.DwcFsConstants.RESULT_SPACE_CREATOR_DISPLAY_NAME_KEY);
		spaceAttr.put(oFF.XFileAttribute.CREATED_BY_DISPLAY_NAME, createdByDisplayName);
		let folderId = spaceElement.getStringByKey(oFF.DwcFsConstants.FOLDER_ID);
		spaceAttr.put(oFF.XFileAttribute.FOLDER_ID, folderId);
		return spaceAttr;
	},
	getSpaceChildrenMetadata:function(element)
	{
			let spaceChildMetadata = oFF.PrFactory.createStructure();
		let displayName = element.getStringByKey(oFF.DwcFsConstants.RESULT_LABEL_KEY);
		let kind = element.getStringByKey(oFF.DwcFsConstants.RESULT_KIND_KEY);
		let description = "";
		let folderId = "";
		if (oFF.notNull(kind) && (oFF.DwcFileUtil.isRepoFolder(kind) || oFF.DwcFileUtil.isRepoSpace(kind)))
		{
			description = element.getStringByKey(oFF.DwcFsConstants.RESULT_DEPLOYMENT_NAME_KEY);
			spaceChildMetadata.putBoolean(oFF.XFileAttribute.IS_DIRECTORY, true);
			spaceChildMetadata.putString(oFF.XFileAttribute.NODE_TYPE, kind);
			folderId = element.getStringByKey(oFF.DwcFsConstants.FOLDER_ID);
		}
		let creatorDisplayName = element.getStringByKey(oFF.DwcFsConstants.RESULT_OBJECT_CREATOR_DISPLAY_NAME_KEY);
		oFF.DwcFileUtil.addCommonMetaData(spaceChildMetadata);
		if (!oFF.XStringUtils.isNullOrEmpty(displayName))
		{
			spaceChildMetadata.putString(oFF.XFileAttribute.DISPLAY_NAME, displayName);
		}
		if (!oFF.XStringUtils.isNullOrEmpty(description))
		{
			spaceChildMetadata.putString(oFF.XFileAttribute.DESCRIPTION, description);
		}
		if (!oFF.XStringUtils.isNullOrEmpty(creatorDisplayName))
		{
			spaceChildMetadata.putString(oFF.XFileAttribute.CREATED_BY_DISPLAY_NAME, creatorDisplayName);
		}
		if (!oFF.XStringUtils.isNullOrEmpty(creatorDisplayName))
		{
			spaceChildMetadata.putString(oFF.XFileAttribute.FOLDER_ID, folderId);
		}
		return spaceChildMetadata;
	},
	getSpaceMetaDataFromDwcResponse:function(spaceElement)
	{
			let displayName = spaceElement.getStringByKey(oFF.DwcFsConstants.RESULT_NAME_KEY);
		let description = spaceElement.getStringByKey(oFF.DwcFsConstants.RESULT_BUSINESS_NAME_KEY);
		let creatorDisplayName = spaceElement.getStringByKey(oFF.DwcFsConstants.RESULT_SPACE_CREATOR_DISPLAY_NAME_KEY);
		let kind = spaceElement.getStringByKey(oFF.DwcFsConstants.RESULT_KIND_KEY);
		let folderId = spaceElement.getStringByKey(oFF.DwcFsConstants.FOLDER_ID);
		let folderMetadata = oFF.PrFactory.createStructure();
		oFF.DwcFileUtil.addCommonMetaData(folderMetadata);
		folderMetadata.putBoolean(oFF.XFileAttribute.IS_DIRECTORY, true);
		if (!oFF.XStringUtils.isNullOrEmpty(displayName))
		{
			folderMetadata.putString(oFF.XFileAttribute.DISPLAY_NAME, displayName);
		}
		if (!oFF.XStringUtils.isNullOrEmpty(description))
		{
			folderMetadata.putString(oFF.XFileAttribute.DESCRIPTION, description);
		}
		if (!oFF.XStringUtils.isNullOrEmpty(creatorDisplayName))
		{
			folderMetadata.putString(oFF.XFileAttribute.CREATED_BY_DISPLAY_NAME, creatorDisplayName);
		}
		if (!oFF.XStringUtils.isNullOrEmpty(kind))
		{
			folderMetadata.putString(oFF.XFileAttribute.NODE_TYPE, kind);
		}
		if (!oFF.XStringUtils.isNullOrEmpty(folderId))
		{
			folderMetadata.putString(oFF.XFileAttribute.FOLDER_ID, folderId);
		}
		return folderMetadata;
	},
	getSpaceObjectAttributes:function(spaceElement, objectType, host, icon, dataSourceType)
	{
			let schemaName = spaceElement.getStringByKey(oFF.DwcFsConstants.DWC_SCHEMA_NAME_KEY);
		let spaceObjectAttr = oFF.XHashMapByString.create();
		spaceObjectAttr.put(oFF.XFileAttribute.NODE_TYPE, objectType);
		spaceObjectAttr.put(oFF.XFileAttribute.ICON, icon);
		let description = spaceElement.getStringByKey(oFF.DwcFsConstants.RESULT_LABEL_KEY);
		spaceObjectAttr.put(oFF.XFileAttribute.DESCRIPTION, description);
		let createdByDisplayName = spaceElement.getStringByKey(oFF.DwcFsConstants.RESULT_OBJECT_CREATOR_DISPLAY_NAME_KEY);
		spaceObjectAttr.put(oFF.XFileAttribute.CREATED_BY_DISPLAY_NAME, createdByDisplayName);
		let displayName = spaceElement.getStringByKey(oFF.DwcFsConstants.RESULT_DEPLOYMENT_NAME_KEY);
		spaceObjectAttr.put(oFF.XFileAttribute.OLAP_DATASOURCE_NAME, displayName);
		spaceObjectAttr.put(oFF.XFileAttribute.OLAP_DATASOURCE_SCHEMA, schemaName);
		spaceObjectAttr.put(oFF.XFileAttribute.SYSTEM_NAME, host);
		spaceObjectAttr.put(oFF.XFileAttribute.OLAP_DATASOURCE_TYPE, dataSourceType);
		spaceObjectAttr.put(oFF.XFileAttribute.SEMANTIC_TYPE, "");
		return spaceObjectAttr;
	},
	getSpaceObjectMetaDataFromDwcResponse:function(spaceObjectElement)
	{
			let displayName = spaceObjectElement.getStringByKey(oFF.DwcFsConstants.RESULT_DEPLOYMENT_NAME_KEY);
		let description = spaceObjectElement.getStringByKey(oFF.DwcFsConstants.RESULT_LABEL_KEY);
		let creatorDisplayName = spaceObjectElement.getStringByKey(oFF.DwcFsConstants.RESULT_OBJECT_CREATOR_DISPLAY_NAME_KEY);
		let spaceObjectMetadata = oFF.PrFactory.createStructure();
		oFF.DwcFileUtil.addCommonMetaData(spaceObjectMetadata);
		if (!oFF.XStringUtils.isNullOrEmpty(displayName))
		{
			spaceObjectMetadata.putString(oFF.XFileAttribute.DISPLAY_NAME, displayName);
		}
		if (!oFF.XStringUtils.isNullOrEmpty(description))
		{
			spaceObjectMetadata.putString(oFF.XFileAttribute.DESCRIPTION, description);
		}
		if (!oFF.XStringUtils.isNullOrEmpty(creatorDisplayName))
		{
			spaceObjectMetadata.putString(oFF.XFileAttribute.CREATED_BY_DISPLAY_NAME, creatorDisplayName);
		}
		return spaceObjectMetadata;
	},
	isCreatedByDisplayName:function(daAttributeName)
	{
			return oFF.XString.isEqual(daAttributeName, oFF.XFileAttribute.CREATED_BY_DISPLAY_NAME);
	},
	isCreatedByName:function(daAttributeName)
	{
			return oFF.XString.isEqual(daAttributeName, oFF.XFileAttribute.CREATED_BY);
	},
	isDescription:function(daAttributeName)
	{
			return oFF.XString.isEqual(daAttributeName, oFF.XFileAttribute.DESCRIPTION);
	},
	isDisplayName:function(daAttributeName)
	{
			return oFF.XString.isEqual(daAttributeName, oFF.XFileAttribute.DISPLAY_NAME);
	},
	isGetDeployedObjectsRequest:function(targetUriPath, fileName)
	{
			return oFF.DwcFileUtil.isTargetUriContainsDirSeparator(targetUriPath) && !oFF.DwcFileUtil.isSpaceDirectory(fileName);
	},
	isGetRootFolderRequest:function(targetUriPath)
	{
			return oFF.XString.isEqual(targetUriPath, oFF.XFile.SLASH);
	},
	isListAllSpacesRequest:function(file, searchString)
	{
			let fileName = file.getName();
		let parentHasSpaceFolder = oFF.DwcFileUtil.parentHasSpaceFolder(file.getUri().getPathContainer().getParentPath());
		return (oFF.DwcFileUtil.isSpaceDirectory(fileName) && !parentHasSpaceFolder) && (oFF.XStringUtils.isNullOrEmpty(searchString) || oFF.XStringUtils.isNotNullAndNotEmpty(searchString) && oFF.XString.size(searchString) === 0);
	},
	isListRootFolderRequest:function(file)
	{
			return oFF.XString.isEqual(file.getUri().getPath(), oFF.XFile.SLASH);
	},
	isListSpaceOrFolderChildrenRequest:function(file, searchString)
	{
			let nodeType = file.getProviderMetadataAndAttributes().getStringByKey(oFF.XFileAttribute.NODE_TYPE);
		return (oFF.DwcFileUtil.isRepoSpace(nodeType) || oFF.DwcFileUtil.isRepoFolder(nodeType)) && oFF.XStringUtils.isNullOrEmpty(searchString);
	},
	isName:function(daAttributeName)
	{
			return oFF.XString.isEqual(daAttributeName, oFF.XFileAttribute.NAME);
	},
	isRepoFolder:function(kind)
	{
			return oFF.XString.isEqual(kind, oFF.DwcFsConstants.NODE_TYPE_FOLDER) || oFF.XString.isEqual(kind, oFF.DwcFsConstants.FOLDER);
	},
	isRepoSpace:function(kind)
	{
			return oFF.XString.isEqual(kind, oFF.DwcFsConstants.NODE_TYPE_SPACE);
	},
	isSearchInSpaceOrFolderRequest:function(file, searchString)
	{
			let nodeType = file.getProviderMetadataAndAttributes().getStringByKey(oFF.XFileAttribute.NODE_TYPE);
		return (oFF.DwcFileUtil.isRepoSpace(nodeType) || oFF.DwcFileUtil.isRepoFolder(nodeType)) && !oFF.XStringUtils.isNullOrEmpty(searchString);
	},
	isSearchObjectsAcrossAllSpacesRequest:function(file, searchString)
	{
			return oFF.DwcFileUtil.isSpaceDirectory(file.getName()) && oFF.XString.size(searchString) > 0;
	},
	isSpaceDirectory:function(fileName)
	{
			return oFF.XString.isEqual(fileName, oFF.DwcFileUtil.SPACE_DIRECTORY);
	},
	isTargetUriContainsDirSeparator:function(targetUriPath)
	{
			return oFF.XString.containsString(targetUriPath, oFF.DwcFileUtil.SPACE_DIRECTORY_WITH_SEPARATOR);
	},
	parentHasSpaceFolder:function(parentPath)
	{
			return oFF.XString.containsString(parentPath, oFF.DwcFsConstants.SPACE_FOLDER);
	}
};

oFF.BaseGlobalSearchChildrenRequestBuilder = function() {};
oFF.BaseGlobalSearchChildrenRequestBuilder.prototype = new oFF.BaseChildrenRequestBuilder();
oFF.BaseGlobalSearchChildrenRequestBuilder.prototype._ff_c = "BaseGlobalSearchChildrenRequestBuilder";

oFF.BaseGlobalSearchChildrenRequestBuilder.SEARCH_QUERY_FILTER = "$apply=filter(Search.search(query=%27SCOPE:SEARCH_DESIGN ((kind:EQ(S):%22deployedObject%22 AND (deployment_business_type:EQ(S):%22DWC_CUBE%22 OR deployment_business_type:EQ(S):%22DWC_FACT%22) AND exposed_for_consumption_id:EQ(S):%22true%22) OR kind:EQ(S):%22sap.repo.folder%22) (deployment_name business_name creator_user_name):(";
oFF.BaseGlobalSearchChildrenRequestBuilder.prototype.buildSearchQuery = function(orderByKey)
{
	let stringUrlBuffer = this.getCommonRequestParameters(orderByKey);
	stringUrlBuffer.append(oFF.BaseGlobalSearchChildrenRequestBuilder.SEARCH_QUERY_FILTER);
	let encodedSearchString = oFF.XHttpUtils.encodeURIComponent(this.m_searchText);
	stringUrlBuffer.append(encodedSearchString).append(oFF.BaseChildrenRequestBuilder.CLOSE_BRACKETS).append(oFF.BaseChildrenRequestBuilder.SEARCH_QUERY_FILTER_CLOSE);
	return stringUrlBuffer;
};

oFF.BaseSearchChildrenRequestBuilder = function() {};
oFF.BaseSearchChildrenRequestBuilder.prototype = new oFF.BaseChildrenRequestBuilder();
oFF.BaseSearchChildrenRequestBuilder.prototype._ff_c = "BaseSearchChildrenRequestBuilder";

oFF.BaseSearchChildrenRequestBuilder.SEARCH_QUERY_FILTER_DESCENDANT_OF = "$apply=filter(Search.search(query=%27SCOPE:SEARCH_DESIGN%20((kind:EQ(S):%22deployedObject%22 AND (deployment_business_type:EQ(S):%22DWC_CUBE%22 OR deployment_business_type:EQ(S):%22DWC_FACT%22) AND exposed_for_consumption_id:EQ(S):%22true%22%20AND%20folder_id:DESCENDANT_OF:";
oFF.BaseSearchChildrenRequestBuilder.SEARCH_QUERY_FOLDER_FILTER = ") OR (kind:EQ(S):%22sap.repo.folder%22%20AND%20folder_id:DESCENDANT_OF:";
oFF.BaseSearchChildrenRequestBuilder.SEARCH_QUERY_SEARCH_STRING_FILTER = ")) (deployment_name business_name creator_user_name):(";
oFF.BaseSearchChildrenRequestBuilder.prototype.buildSearchQuery = function(orderByKey)
{
	let stringUrlBuffer = this.getCommonRequestParameters(orderByKey);
	stringUrlBuffer.append(oFF.BaseSearchChildrenRequestBuilder.SEARCH_QUERY_FILTER_DESCENDANT_OF).append(oFF.DwcFsConstants.ENCODED_DOUBLE_QUOTES).append(this.folderId).append(oFF.DwcFsConstants.ENCODED_DOUBLE_QUOTES);
	stringUrlBuffer.append(oFF.BaseSearchChildrenRequestBuilder.SEARCH_QUERY_FOLDER_FILTER).append(oFF.DwcFsConstants.ENCODED_DOUBLE_QUOTES).append(this.folderId).append(oFF.DwcFsConstants.ENCODED_DOUBLE_QUOTES);
	stringUrlBuffer.append(oFF.BaseSearchChildrenRequestBuilder.SEARCH_QUERY_SEARCH_STRING_FILTER);
	let encodedSearchString = oFF.XHttpUtils.encodeURIComponent(this.m_searchText);
	stringUrlBuffer.append(encodedSearchString).append(oFF.BaseChildrenRequestBuilder.CLOSE_BRACKETS).append(oFF.BaseChildrenRequestBuilder.SEARCH_QUERY_FILTER_CLOSE);
	return stringUrlBuffer;
};

oFF.ListSpaceOrFolderChildrenRequestBuilder = function() {};
oFF.ListSpaceOrFolderChildrenRequestBuilder.prototype = new oFF.BaseChildrenRequestBuilder();
oFF.ListSpaceOrFolderChildrenRequestBuilder.prototype._ff_c = "ListSpaceOrFolderChildrenRequestBuilder";

oFF.ListSpaceOrFolderChildrenRequestBuilder.SEARCH_QUERY_FILTER_CHILD_OFF = "$apply=filter(Search.search(query=%27SCOPE:SEARCH_DESIGN%20((kind:EQ(S):%22deployedObject%22 AND (deployment_business_type:EQ(S):%22DWC_CUBE%22 OR deployment_business_type:EQ(S):%22DWC_FACT%22) AND exposed_for_consumption_id:EQ(S):%22true%22%20AND%20folder_id:CHILD_OF:";
oFF.ListSpaceOrFolderChildrenRequestBuilder.SEARCH_QUERY_FOLDER_FILTER = ") OR (kind:EQ(S):%22sap.repo.folder%22%20AND%20folder_id:CHILD_OF:";
oFF.ListSpaceOrFolderChildrenRequestBuilder.SEARCH_QUERY_SEARCH_STRING_FILTER = ")) (deployment_name business_name creator_user_name):(";
oFF.ListSpaceOrFolderChildrenRequestBuilder.create = function(folderId, searchText, fileQueryConfig)
{
	let builder = new oFF.ListSpaceOrFolderChildrenRequestBuilder();
	builder.folderId = folderId;
	builder.m_searchText = searchText;
	builder.m_fileQueryConfig = fileQueryConfig;
	return builder;
};
oFF.ListSpaceOrFolderChildrenRequestBuilder.prototype.build = function()
{
	let orderByKey = "";
	let sortDirection = "";
	if (oFF.notNull(this.m_fileQueryConfig))
	{
		if (this.m_fileQueryConfig.getSingleSortDef() !== null)
		{
			let ffSortDirection = this.m_fileQueryConfig.getSingleSortDef().getDirection().getName();
			sortDirection = oFF.DwcFileUtil.getDwcSortDirection(ffSortDirection);
			let daAttributeName = this.m_fileQueryConfig.getSingleSortDef().getAttributeName();
			orderByKey = oFF.DwcFileUtil.getListSpaceOrFolderOrderByKeyForSorting(daAttributeName, sortDirection);
		}
	}
	let stringUrlBuffer = this.getCommonRequestParameters(orderByKey);
	stringUrlBuffer.append(oFF.ListSpaceOrFolderChildrenRequestBuilder.SEARCH_QUERY_FILTER_CHILD_OFF).append(oFF.DwcFsConstants.ENCODED_DOUBLE_QUOTES).append(this.folderId).append(oFF.DwcFsConstants.ENCODED_DOUBLE_QUOTES);
	stringUrlBuffer.append(oFF.ListSpaceOrFolderChildrenRequestBuilder.SEARCH_QUERY_FOLDER_FILTER).append(oFF.DwcFsConstants.ENCODED_DOUBLE_QUOTES).append(this.folderId).append(oFF.DwcFsConstants.ENCODED_DOUBLE_QUOTES);
	stringUrlBuffer.append(oFF.ListSpaceOrFolderChildrenRequestBuilder.SEARCH_QUERY_SEARCH_STRING_FILTER);
	let encodedSearchString = oFF.XHttpUtils.encodeURIComponent(this.m_searchText);
	stringUrlBuffer.append(encodedSearchString).append(oFF.BaseChildrenRequestBuilder.CLOSE_BRACKETS).append(oFF.BaseChildrenRequestBuilder.SEARCH_QUERY_FILTER_CLOSE);
	return stringUrlBuffer.toString();
};

oFF.GlobalSearchRequestProcessor = function() {};
oFF.GlobalSearchRequestProcessor.prototype = new oFF.BaseSearchRequestProcessor();
oFF.GlobalSearchRequestProcessor.prototype._ff_c = "GlobalSearchRequestProcessor";

oFF.GlobalSearchRequestProcessor.create = function()
{
	return new oFF.GlobalSearchRequestProcessor();
};
oFF.GlobalSearchRequestProcessor.prototype.m_fileQueryConfig = null;
oFF.GlobalSearchRequestProcessor.prototype.m_lastSearchText = null;
oFF.GlobalSearchRequestProcessor.prototype.m_lastSortDirection = null;
oFF.GlobalSearchRequestProcessor.prototype.accept = function(file, fileQueryConfig)
{
	this.m_fileQueryConfig = fileQueryConfig;
	return oFF.DwcFileUtil.isSearchObjectsAcrossAllSpacesRequest(file, fileQueryConfig.getSearchValue());
};
oFF.GlobalSearchRequestProcessor.prototype.isSortingRequest = function(searchText, ffSortDirection)
{
	return oFF.XString.isEqual(this.m_lastSearchText, searchText) && !oFF.XString.isEqual(this.m_lastSortDirection, ffSortDirection);
};
oFF.GlobalSearchRequestProcessor.prototype.process = function()
{
	let searchText = oFF.XString.trim(this.m_fileQueryConfig.getSearchValue());
	searchText = !oFF.XStringUtils.isNullOrEmpty(searchText) ? searchText : oFF.DwcFsConstants.WILDCARD;
	if (!oFF.XString.isEqual(searchText, oFF.DwcFsConstants.WILDCARD))
	{
		searchText = oFF.DwcFileUtil.escapeSearchQueryText(searchText, this.getDataSphereRequestReservedCharacters(), this.getDataSphereRequestReservedWords());
	}
	let ffSortDirection = this.m_fileQueryConfig.getSingleSortDef().getDirection().getName();
	if (this.isSortingRequest(searchText, ffSortDirection))
	{
		this.m_lastSearchText = searchText;
		this.m_lastSortDirection = ffSortDirection;
		return oFF.DatasphereRequestFactory.getSortGlobalSearchRequest(searchText, this.m_fileQueryConfig);
	}
	else
	{
		this.m_lastSearchText = searchText;
		this.m_lastSortDirection = ffSortDirection;
		return oFF.DatasphereRequestFactory.getGlobalSearchRequest(searchText, this.m_fileQueryConfig);
	}
};

oFF.SearchInSpaceOrFolderRequestProcessor = function() {};
oFF.SearchInSpaceOrFolderRequestProcessor.prototype = new oFF.BaseSearchRequestProcessor();
oFF.SearchInSpaceOrFolderRequestProcessor.prototype._ff_c = "SearchInSpaceOrFolderRequestProcessor";

oFF.SearchInSpaceOrFolderRequestProcessor.create = function()
{
	return new oFF.SearchInSpaceOrFolderRequestProcessor();
};
oFF.SearchInSpaceOrFolderRequestProcessor.prototype.m_file = null;
oFF.SearchInSpaceOrFolderRequestProcessor.prototype.m_fileQueryConfig = null;
oFF.SearchInSpaceOrFolderRequestProcessor.prototype.m_lastFolderId = null;
oFF.SearchInSpaceOrFolderRequestProcessor.prototype.m_lastSearchText = null;
oFF.SearchInSpaceOrFolderRequestProcessor.prototype.m_lastSortDirection = null;
oFF.SearchInSpaceOrFolderRequestProcessor.prototype.accept = function(file, fileQueryConfig)
{
	this.m_file = file;
	this.m_fileQueryConfig = fileQueryConfig;
	return oFF.DwcFileUtil.isSearchInSpaceOrFolderRequest(file, fileQueryConfig.getSearchValue());
};
oFF.SearchInSpaceOrFolderRequestProcessor.prototype.isSortingRequest = function(folderId, searchText, ffSortDirection)
{
	return oFF.XString.isEqual(this.m_lastFolderId, folderId) && oFF.XString.isEqual(this.m_lastSearchText, searchText) && !oFF.XString.isEqual(this.m_lastSortDirection, ffSortDirection);
};
oFF.SearchInSpaceOrFolderRequestProcessor.prototype.process = function()
{
	let searchText = oFF.XString.trim(this.m_fileQueryConfig.getSearchValue());
	searchText = !oFF.XStringUtils.isNullOrEmpty(searchText) ? searchText : oFF.DwcFsConstants.WILDCARD;
	if (!oFF.XString.isEqual(searchText, oFF.DwcFsConstants.WILDCARD))
	{
		searchText = oFF.DwcFileUtil.escapeSearchQueryText(searchText, this.getDataSphereRequestReservedCharacters(), this.getDataSphereRequestReservedWords());
	}
	let folderId = this.m_file.getProviderMetadataAndAttributes().getStringByKey(oFF.XFileAttribute.FOLDER_ID);
	let ffSortDirection = this.m_fileQueryConfig.getSingleSortDef().getDirection().getName();
	if (this.isSortingRequest(folderId, searchText, ffSortDirection))
	{
		this.m_lastFolderId = folderId;
		this.m_lastSearchText = searchText;
		this.m_lastSortDirection = ffSortDirection;
		return oFF.DatasphereRequestFactory.getSortSearchResultsForSpaceOrFolderRequest(folderId, searchText, this.m_fileQueryConfig);
	}
	else
	{
		this.m_lastFolderId = folderId;
		this.m_lastSearchText = searchText;
		this.m_lastSortDirection = ffSortDirection;
		return oFF.DatasphereRequestFactory.getSearchInSpaceOrFolderRequest(folderId, searchText, this.m_fileQueryConfig);
	}
};

oFF.SearchResponseProcessor = function() {};
oFF.SearchResponseProcessor.prototype = new oFF.BaseDatasphereResponseProcessor();
oFF.SearchResponseProcessor.prototype._ff_c = "SearchResponseProcessor";

oFF.SearchResponseProcessor.HIERARCHY = "hierarchy";
oFF.SearchResponseProcessor.create = function()
{
	let processor = new oFF.SearchResponseProcessor();
	processor.setupIcons();
	return processor;
};
oFF.SearchResponseProcessor.prototype.m_file = null;
oFF.SearchResponseProcessor.prototype.m_fileSystem = null;
oFF.SearchResponseProcessor.prototype.accept = function(file, fileSystem, searchString)
{
	this.m_file = file;
	this.m_fileSystem = fileSystem;
	return !oFF.DwcFileUtil.isListAllSpacesRequest(file, searchString);
};
oFF.SearchResponseProcessor.prototype.process = function(response)
{
	let childFiles = oFF.XList.create();
	let results = response.getRootElementGeneric().asList().asStructure().getListByKey(oFF.DwcFsConstants.RESULT_SEARCH_ROOT_KEY);
	for (let i = 0; i < results.size(); i++)
	{
		let element = results.get(i);
		if (oFF.DatasphereFeatureToggle.isActive(oFF.DatasphereFeatureToggle.RESOURCE_EXPLORER_DATASPHERE_FOLDER_SUPPORT))
		{
			this.processResponseWithFolders(element, childFiles);
		}
		else
		{
			this.processResponseWithoutFolders(element, childFiles);
		}
	}
	let totalResults = response.getRootElementGeneric().asList().asStructure().getIntegerByKey(oFF.DwcFsConstants.RESULT_SEARCH_TOTAL_COUNT_KEY);
	this.m_file.setProviderChildFiles(childFiles, totalResults);
};
oFF.SearchResponseProcessor.prototype.processResponseWithFolders = function(element, childFiles)
{
	let newObjectFileName = element.getStringByKey(oFF.DwcFsConstants.RESULT_LABEL_KEY);
	let childObjectUri = oFF.XUri.createChildFile(this.m_file.getUri(), newObjectFileName);
	let spaceObjectAttributes = oFF.DwcFileUtil.getChildrenAttributes(element, this.m_file);
	let childFile = oFF.DwcFile.createFile(this.m_fileSystem.getProcess(), this.m_fileSystem, childObjectUri, spaceObjectAttributes);
	let parentHierarchy = element.getListByKey(oFF.DwcFsConstants.RESULT_PARENT_HIERARCHY_KEY).getStructureAt(0).getListByKey(oFF.SearchResponseProcessor.HIERARCHY);
	let iterator = parentHierarchy.getIterator();
	while (iterator.hasNext())
	{
		let parent = iterator.next();
		let parentId = parent.getStringByKey(oFF.DwcFsConstants.FOLDER_ID_RESPONSE);
		if (!this.m_fileSystem.getFileCache().containsKey(parentId))
		{
			let attributes = oFF.XHashMapByString.create();
			let folderName = parent.getStringByKey(oFF.DwcFsConstants.FOLDER_NAME_RESPONSE);
			attributes.put(oFF.XFileAttribute.DISPLAY_NAME, folderName);
			attributes.put(oFF.XFileAttribute.FOLDER_ID, parentId);
			attributes.put(oFF.XFileAttribute.NODE_TYPE, oFF.DwcFsConstants.NODE_TYPE_FOLDER);
			let folderMetadata = oFF.DwcFileUtil.getBasicMetaData(folderName);
			let parentFolder = oFF.DwcFile.createFile(this.m_fileSystem.getProcess(), this.m_fileSystem, childObjectUri, attributes);
			parentFolder.setProviderMetadata(folderMetadata);
		}
	}
	let metadata = oFF.DwcFileUtil.getSpaceChildrenMetadata(element);
	this.setLinkUrlWithFolders(childFile, element);
	childFile.setProviderMetadata(metadata);
	childFiles.add(childFile);
};
oFF.SearchResponseProcessor.prototype.processResponseWithoutFolders = function(element, childFiles)
{
	let newObjectFileName = element.getStringByKey(oFF.DwcFsConstants.RESULT_DEPLOYMENT_NAME_KEY);
	let childObjectFolderUri = oFF.XUri.createChildFile(this.m_file.getUri(), newObjectFileName);
	let objectType = element.getStringByKey(oFF.DwcFsConstants.RESULT_BUSINESS_TYPE_KEY);
	let host = this.m_file.getUri().getHost();
	let iconKey = oFF.DwcFileUtil.getIconKey(objectType);
	let modelIcon = this.getIconByName(iconKey);
	let dataSourceType = oFF.DwcFsConstants.INA_MODEL;
	let spaceObjectAttributes = oFF.DwcFileUtil.getSpaceObjectAttributes(element, objectType, host, modelIcon, dataSourceType);
	let childFile = oFF.DwcFile.createFile(this.m_fileSystem.getProcess(), this.m_fileSystem, childObjectFolderUri, spaceObjectAttributes);
	let metadata = oFF.DwcFileUtil.getSpaceObjectMetaDataFromDwcResponse(element);
	this.setLinkUrl(childFile, element);
	childFile.setProviderMetadata(metadata);
	childFiles.add(childFile);
};
oFF.SearchResponseProcessor.prototype.setLinkUrl = function(childFile, spaceElement)
{
	let m_attributes = childFile.getProviderAttributes();
	let staticLink = oFF.XStringUtils.concatenate3(oFF.XUri.PATH_SEPARATOR, oFF.ProtocolType.SYS.toString(), oFF.XUri.PATH_SEPARATOR);
	let fileName = childFile.getName();
	let spaceName = spaceElement.getStringByKey(oFF.DwcFsConstants.RESULT_SPACE_NAME_KEY);
	let linkUrl = oFF.XStringUtils.concatenate4(staticLink, spaceName, oFF.XUri.PATH_SEPARATOR, fileName);
	m_attributes.putBoolean(oFF.XFileAttribute.IS_LINK, true);
	m_attributes.putString(oFF.XFileAttribute.LINK_URL, linkUrl);
};
oFF.SearchResponseProcessor.prototype.setLinkUrlWithFolders = function(childFile, spaceElement)
{
	let parentHierarchyBuffer = oFF.XStringBuffer.create();
	parentHierarchyBuffer.append(oFF.XUri.PATH_SEPARATOR).append(oFF.ProtocolType.SYS.toString()).append(oFF.XUri.PATH_SEPARATOR);
	let systemName = childFile.getProviderMetadataAndAttributes().getStringByKey(oFF.XFileAttribute.SYSTEM_NAME);
	parentHierarchyBuffer.append(systemName).append(oFF.XUri.PATH_SEPARATOR).append(oFF.BaseDatasphereResponseProcessor.DWC).append(oFF.XUri.PATH_SEPARATOR).append(oFF.BaseDatasphereResponseProcessor.SPACE).append(oFF.XUri.PATH_SEPARATOR);
	let parentHierarchy = spaceElement.getListByKey(oFF.DwcFsConstants.RESULT_PARENT_HIERARCHY_KEY).getStructureAt(0).getListByKey(oFF.SearchResponseProcessor.HIERARCHY);
	let iterator = parentHierarchy.getIterator();
	while (iterator.hasNext())
	{
		let parent = iterator.next();
		let parentId = parent.getStringByKey(oFF.DwcFsConstants.FOLDER_ID_RESPONSE);
		parentHierarchyBuffer.append(parentId).append(oFF.XUri.PATH_SEPARATOR);
	}
	let objectId = spaceElement.getStringByKey(oFF.DwcFsConstants.FOLDER_ID);
	if (!oFF.XString.containsString(parentHierarchyBuffer.toString(), objectId))
	{
		parentHierarchyBuffer.append(objectId).append(oFF.XUri.PATH_SEPARATOR);
	}
	let m_attributes = childFile.getProviderAttributes();
	m_attributes.putBoolean(oFF.XFileAttribute.IS_LINK, true);
	m_attributes.putString(oFF.XFileAttribute.LINK_URL, parentHierarchyBuffer.toString());
};

oFF.SpaceListResponseProcessor = function() {};
oFF.SpaceListResponseProcessor.prototype = new oFF.BaseDatasphereResponseProcessor();
oFF.SpaceListResponseProcessor.prototype._ff_c = "SpaceListResponseProcessor";

oFF.SpaceListResponseProcessor.create = function()
{
	let processor = new oFF.SpaceListResponseProcessor();
	processor.setupIcons();
	return processor;
};
oFF.SpaceListResponseProcessor.prototype.m_file = null;
oFF.SpaceListResponseProcessor.prototype.m_fileSystem = null;
oFF.SpaceListResponseProcessor.prototype.accept = function(file, fileSystem, searchString)
{
	this.m_file = file;
	this.m_fileSystem = fileSystem;
	return oFF.DwcFileUtil.isListAllSpacesRequest(file, searchString);
};
oFF.SpaceListResponseProcessor.prototype.process = function(response)
{
	let results = null;
	this.m_fileSystem.dropCache();
	let childFiles = oFF.XList.create();
	if (oFF.DatasphereFeatureToggle.isActive(oFF.DatasphereFeatureToggle.RESOURCE_EXPLORER_DATASPHERE_FOLDER_SUPPORT))
	{
		let systemName = this.m_file.getUri().getHost();
		results = response.getRootElementGeneric().asList().asStructure().getListByKey(oFF.DwcFsConstants.RESULT_SEARCH_ROOT_KEY);
		for (let i = 0; i < results.size(); i++)
		{
			let element = results.get(i);
			let newSchemaFileName = element.getStringByKey(oFF.DwcFsConstants.DWC_SCHEMA_NAME_KEY);
			let spaceId = element.getStringByKey(oFF.DwcFsConstants.FOLDER_ID);
			let childSpaceFolderUri = oFF.XUri.createChildFile(this.m_file.getUri(), newSchemaFileName);
			let spaceIcon = this.getIconByName(oFF.DwcFsConstants.ICON_SPACE);
			let spaceAttributes = oFF.DwcFileUtil.getSearchSpacesResultAttributes(element, spaceIcon);
			let childFile = oFF.DwcFile.createFile(this.m_fileSystem.getProcess(), this.m_fileSystem, childSpaceFolderUri, spaceAttributes);
			let metadata = oFF.DwcFileUtil.getSearchSpaceResultMetaData(element);
			childFile.setProviderMetadata(metadata);
			let parentHierarchyLinkUrlBuffer = oFF.XStringBuffer.create();
			parentHierarchyLinkUrlBuffer.append(oFF.XUri.PATH_SEPARATOR).append(oFF.ProtocolType.SYS.toString()).append(oFF.XUri.PATH_SEPARATOR);
			parentHierarchyLinkUrlBuffer.append(systemName).append(oFF.XUri.PATH_SEPARATOR).append(oFF.BaseDatasphereResponseProcessor.DWC).append(oFF.XUri.PATH_SEPARATOR).append(oFF.BaseDatasphereResponseProcessor.SPACE).append(oFF.XUri.PATH_SEPARATOR);
			parentHierarchyLinkUrlBuffer.append(spaceId).append(oFF.XUri.PATH_SEPARATOR);
			let m_attributes = childFile.getProviderAttributes();
			m_attributes.putBoolean(oFF.XFileAttribute.IS_LINK, true);
			m_attributes.putString(oFF.XFileAttribute.LINK_URL, parentHierarchyLinkUrlBuffer.toString());
			childFiles.add(childFile);
		}
	}
	else
	{
		results = response.getRootElementGeneric().asList().asStructure().getListByKey(oFF.DwcFsConstants.RESULT_SPACE_LISTING_ROOT_KEY);
		for (let i = 0; i < results.size(); i++)
		{
			let element = results.get(i);
			let newSchemaFileName = element.getStringByKey(oFF.DwcFsConstants.RESULT_NAME_KEY);
			let childSpaceFolderUri = oFF.XUri.createChildFile(this.m_file.getUri(), newSchemaFileName);
			let spaceIcon = this.getIconByName(oFF.DwcFsConstants.ICON_SPACE);
			let spaceAttributes = oFF.DwcFileUtil.getSpaceAttributes(element, spaceIcon);
			let childFolder = oFF.DwcFile.createFile(this.m_fileSystem.getProcess(), this.m_fileSystem, childSpaceFolderUri, spaceAttributes);
			let metadata = oFF.DwcFileUtil.getSpaceMetaDataFromDwcResponse(element);
			childFolder.setProviderMetadata(metadata);
			childFiles.add(childFolder);
		}
	}
	this.m_file.setProviderChildFiles(childFiles, childFiles.size());
};

oFF.GlobalSearchRequestBuilder = function() {};
oFF.GlobalSearchRequestBuilder.prototype = new oFF.BaseGlobalSearchChildrenRequestBuilder();
oFF.GlobalSearchRequestBuilder.prototype._ff_c = "GlobalSearchRequestBuilder";

oFF.GlobalSearchRequestBuilder.create = function(searchText, fileQueryConfig)
{
	let builder = new oFF.GlobalSearchRequestBuilder();
	builder.m_searchText = searchText;
	builder.m_fileQueryConfig = fileQueryConfig;
	return builder;
};
oFF.GlobalSearchRequestBuilder.prototype.build = function()
{
	let orderByKey = "";
	let dwcSortDirection;
	if (oFF.notNull(this.m_fileQueryConfig))
	{
		if (this.m_fileQueryConfig.getSingleSortDef() !== null)
		{
			let ffSortDirection = this.m_fileQueryConfig.getSingleSortDef().getDirection().getName();
			dwcSortDirection = oFF.DwcFileUtil.getDwcSortDirection(ffSortDirection);
			let daAttributeName = this.m_fileQueryConfig.getSingleSortDef().getAttributeName();
			orderByKey = oFF.DwcFileUtil.getSearchSpaceOrFolderOrderByKey(daAttributeName, dwcSortDirection);
		}
	}
	let stringUrlBuffer = this.buildSearchQuery(orderByKey);
	return stringUrlBuffer.toString();
};

oFF.SearchInSpaceOrFolderRequestBuilder = function() {};
oFF.SearchInSpaceOrFolderRequestBuilder.prototype = new oFF.BaseSearchChildrenRequestBuilder();
oFF.SearchInSpaceOrFolderRequestBuilder.prototype._ff_c = "SearchInSpaceOrFolderRequestBuilder";

oFF.SearchInSpaceOrFolderRequestBuilder.create = function(folderId, searchText, fileQueryConfig)
{
	let builder = new oFF.SearchInSpaceOrFolderRequestBuilder();
	builder.folderId = folderId;
	builder.m_searchText = searchText;
	builder.m_fileQueryConfig = fileQueryConfig;
	return builder;
};
oFF.SearchInSpaceOrFolderRequestBuilder.prototype.build = function()
{
	let orderByKey = "";
	let sortDirection = "";
	if (oFF.notNull(this.m_fileQueryConfig))
	{
		if (this.m_fileQueryConfig.getSingleSortDef() !== null)
		{
			let ffSortDirection = this.m_fileQueryConfig.getSingleSortDef().getDirection().getName();
			sortDirection = oFF.DwcFileUtil.getDwcSortDirection(ffSortDirection);
			let daAttributeName = this.m_fileQueryConfig.getSingleSortDef().getAttributeName();
			orderByKey = oFF.DwcFileUtil.getSearchSpaceOrFolderOrderByKey(daAttributeName, sortDirection);
		}
	}
	let stringUrlBuffer = this.buildSearchQuery(orderByKey);
	return stringUrlBuffer.toString();
};

oFF.SortGlobalSearchResultsRequestBuilder = function() {};
oFF.SortGlobalSearchResultsRequestBuilder.prototype = new oFF.BaseGlobalSearchChildrenRequestBuilder();
oFF.SortGlobalSearchResultsRequestBuilder.prototype._ff_c = "SortGlobalSearchResultsRequestBuilder";

oFF.SortGlobalSearchResultsRequestBuilder.create = function(searchText, fileQueryConfig)
{
	let builder = new oFF.SortGlobalSearchResultsRequestBuilder();
	builder.m_searchText = searchText;
	builder.m_fileQueryConfig = fileQueryConfig;
	return builder;
};
oFF.SortGlobalSearchResultsRequestBuilder.prototype.build = function()
{
	let orderByKey = "";
	if (oFF.notNull(this.m_fileQueryConfig))
	{
		if (this.m_fileQueryConfig.getSingleSortDef() !== null)
		{
			let ffSortDirection = this.m_fileQueryConfig.getSingleSortDef().getDirection().getName();
			let sortDirection = oFF.DwcFileUtil.getDwcSortDirection(ffSortDirection);
			let daAttributeName = this.m_fileQueryConfig.getSingleSortDef().getAttributeName();
			orderByKey = oFF.DwcFileUtil.getListSpaceOrFolderOrderByKeyForSorting(daAttributeName, sortDirection);
		}
	}
	let stringUrlBuffer = this.buildSearchQuery(orderByKey);
	return stringUrlBuffer.toString();
};

oFF.SortSearchResultsForSpaceOrFolderRequestBuilder = function() {};
oFF.SortSearchResultsForSpaceOrFolderRequestBuilder.prototype = new oFF.BaseSearchChildrenRequestBuilder();
oFF.SortSearchResultsForSpaceOrFolderRequestBuilder.prototype._ff_c = "SortSearchResultsForSpaceOrFolderRequestBuilder";

oFF.SortSearchResultsForSpaceOrFolderRequestBuilder.create = function(folderId, searchText, fileQueryConfig)
{
	let builder = new oFF.SortSearchResultsForSpaceOrFolderRequestBuilder();
	builder.folderId = folderId;
	builder.m_searchText = searchText;
	builder.m_fileQueryConfig = fileQueryConfig;
	return builder;
};
oFF.SortSearchResultsForSpaceOrFolderRequestBuilder.prototype.build = function()
{
	let orderByKey = "";
	if (oFF.notNull(this.m_fileQueryConfig))
	{
		if (this.m_fileQueryConfig.getSingleSortDef() !== null)
		{
			let ffSortDirection = this.m_fileQueryConfig.getSingleSortDef().getDirection().getName();
			let sortDirection = oFF.DwcFileUtil.getDwcSortDirection(ffSortDirection);
			let daAttributeName = this.m_fileQueryConfig.getSingleSortDef().getAttributeName();
			orderByKey = oFF.DwcFileUtil.getListSpaceOrFolderOrderByKeyForSorting(daAttributeName, sortDirection);
		}
	}
	let stringUrlBuffer = this.buildSearchQuery(orderByKey);
	return stringUrlBuffer.toString();
};

oFF.DatasphereFeatureToggle = function() {};
oFF.DatasphereFeatureToggle.prototype = new oFF.XConstant();
oFF.DatasphereFeatureToggle.prototype._ff_c = "DatasphereFeatureToggle";

oFF.DatasphereFeatureToggle.RESOURCE_EXPLORER_DATASPHERE_FOLDER_SUPPORT = null;
oFF.DatasphereFeatureToggle.m_featureToggles = null;
oFF.DatasphereFeatureToggle.create = function(name)
{
	let newObj = new oFF.DatasphereFeatureToggle();
	newObj.setupInternal(name);
	oFF.DatasphereFeatureToggle.m_featureToggles.put(name, newObj);
	return newObj;
};
oFF.DatasphereFeatureToggle.disable = function(featureToggle)
{
	if (oFF.notNull(featureToggle))
	{
		featureToggle.m_isActive = false;
	}
};
oFF.DatasphereFeatureToggle.disableAll = function()
{
	if (oFF.notNull(oFF.DatasphereFeatureToggle.m_featureToggles))
	{
		oFF.XStream.of(oFF.DatasphereFeatureToggle.m_featureToggles).forEach(oFF.DatasphereFeatureToggle.disable);
	}
};
oFF.DatasphereFeatureToggle.enable = function(featureToggle)
{
	if (oFF.notNull(featureToggle))
	{
		featureToggle.m_isActive = true;
	}
};
oFF.DatasphereFeatureToggle.enableAll = function()
{
	if (oFF.notNull(oFF.DatasphereFeatureToggle.m_featureToggles))
	{
		oFF.XStream.of(oFF.DatasphereFeatureToggle.m_featureToggles).forEach(oFF.DatasphereFeatureToggle.enable);
	}
};
oFF.DatasphereFeatureToggle.isActive = function(featureToggle)
{
	return oFF.notNull(featureToggle) && featureToggle.m_isActive;
};
oFF.DatasphereFeatureToggle.lookup = function(name)
{
	return oFF.DatasphereFeatureToggle.m_featureToggles.getByKey(name);
};
oFF.DatasphereFeatureToggle.staticSetup = function()
{
	oFF.DatasphereFeatureToggle.m_featureToggles = oFF.XHashMapByString.create();
	oFF.DatasphereFeatureToggle.RESOURCE_EXPLORER_DATASPHERE_FOLDER_SUPPORT = oFF.DatasphereFeatureToggle.create("RESOURCE_EXPLORER_DATASPHERE_FOLDER_SUPPORT");
};
oFF.DatasphereFeatureToggle.prototype.m_isActive = false;
oFF.DatasphereFeatureToggle.prototype.setupInternal = function(name)
{
	oFF.XConstant.prototype.setupConstant.call( this , name);
	this.m_isActive = false;
};

oFF.DwcFile = function() {};
oFF.DwcFile.prototype = new oFF.DfXFileProvider();
oFF.DwcFile.prototype._ff_c = "DwcFile";

oFF.DwcFile.createFile = function(process, fileSystem, uri, attributes)
{
	let file = new oFF.DwcFile();
	file.setupDwcFile(process, fileSystem, uri);
	let targetPath = uri.getPath();
	let isRootDirectory = oFF.XString.isEqual(fileSystem.getRootDirectoryUri().getPath(), uri.getPath());
	if (isRootDirectory || oFF.DwcFile.isEndsWithPathSeparator(targetPath, file.getName()) || oFF.DwcFile.isSpaceFolderWithNoSpaceParent(file, uri.getPathContainer().getParentPath()))
	{
		file.getProviderAttributes().putString(oFF.XFileAttribute.NODE_TYPE, oFF.DwcFsConstants.FOLDER);
		let systemType = attributes.getByKey(oFF.XFileAttribute.SYSTEM_TYPE);
		file.getProviderAttributes().putString(oFF.XFileAttribute.SYSTEM_TYPE, systemType);
	}
	else
	{
		if (oFF.notNull(attributes) && attributes.size() > 0)
		{
			let keysAsIteratorOfString = attributes.getKeysAsIterator();
			while (keysAsIteratorOfString.hasNext())
			{
				let key = keysAsIteratorOfString.next();
				file.getProviderAttributes().putString(key, attributes.getByKey(key));
			}
		}
	}
	file.setProviderIsExisting(true);
	let providerAttributes = file.getProviderAttributes();
	let folderId = providerAttributes.getStringByKey(oFF.XFileAttribute.FOLDER_ID);
	if (!oFF.XStringUtils.isNullOrEmpty(folderId))
	{
		fileSystem.getFileCache().put(folderId, file);
	}
	return file;
};
oFF.DwcFile.isEndsWithPathSeparator = function(targetPath, fileName)
{
	return oFF.XString.endsWith(targetPath, oFF.XUri.PATH_SEPARATOR) && !oFF.XString.endsWith(fileName, oFF.XUri.PATH_SEPARATOR);
};
oFF.DwcFile.isSpaceFolderWithNoSpaceParent = function(file, parentPath)
{
	let parentHasSpaceFolder = oFF.DwcFileUtil.parentHasSpaceFolder(parentPath);
	return oFF.XString.isEqual(file.getName(), oFF.DwcFsConstants.SPACE_FOLDER) && !parentHasSpaceFolder;
};
oFF.DwcFile.prototype.getProviderMetadataAndAttributes = function()
{
	let parentHasSpaceFolder = oFF.DwcFileUtil.parentHasSpaceFolder(this.getUri().getPathContainer().getParentPath());
	if (oFF.XString.isEqual(this.getName(), oFF.DwcFileUtil.SPACE_DIRECTORY) && !parentHasSpaceFolder)
	{
		return this.getProviderMetadata();
	}
	else
	{
		let combined = oFF.PrFactory.createStructure();
		let providerMetadata = this.getProviderMetadata();
		combined.putAll(providerMetadata);
		combined.putAll(this.getProviderAttributes());
		return combined;
	}
};
oFF.DwcFile.prototype.processProviderFetchChildren = function(syncType, listener, customIdentifier, config)
{
	let sync = this.m_fs.processFetchChildren(this, syncType, listener, customIdentifier, config);
	return sync;
};
oFF.DwcFile.prototype.processProviderFetchMetadata = function(syncType, listener, customIdentifier, cachingType)
{
	return this.m_fs.processFetchMetadata(this, syncType, listener, customIdentifier);
};
oFF.DwcFile.prototype.processProviderIsExisting = function(syncType, listener, customIdentifier)
{
	return this.m_fs.processIsExisting(this, syncType, listener, customIdentifier);
};
oFF.DwcFile.prototype.setupDwcFile = function(process, fileSystem, uri)
{
	this.setupFile(process, fileSystem, uri);
};
oFF.DwcFile.prototype.supportsProviderFetchChildren = function()
{
	return true;
};
oFF.DwcFile.prototype.supportsProviderIsExisting = function()
{
	return true;
};

oFF.DwcFileBaseAction2 = function() {};
oFF.DwcFileBaseAction2.prototype = new oFF.SyncActionExt();
oFF.DwcFileBaseAction2.prototype._ff_c = "DwcFileBaseAction2";

oFF.DwcFileBaseAction2.INVALID_RESPONSE = "Invalid response: ";
oFF.DwcFileBaseAction2.RESPONSE_IS_NULL = "Response is null";
oFF.DwcFileBaseAction2.prototype.addResponseError = function(response)
{
	let message = "";
	if (oFF.isNull(response))
	{
		message = oFF.DwcFileBaseAction2.RESPONSE_IS_NULL;
	}
	else
	{
		message = oFF.XStringUtils.concatenate2(oFF.DwcFileBaseAction2.INVALID_RESPONSE, response.getRootElementAsString());
	}
	this.addErrorExt(oFF.OriginLayer.IOLAYER, oFF.ErrorCodes.SYSTEM_IO_HTTP, message, null);
};
oFF.DwcFileBaseAction2.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onHttpFileProcessed(extResult, data, customIdentifier);
};
oFF.DwcFileBaseAction2.prototype.releaseObjectInternal = function() {};

oFF.XDwcFsActionFetch = function() {};
oFF.XDwcFsActionFetch.prototype = new oFF.SyncActionExt();
oFF.XDwcFsActionFetch.prototype._ff_c = "XDwcFsActionFetch";

oFF.XDwcFsActionFetch.createAndRun = function(syncType, listener, customIdentifier, fsmr, uri)
{
	let object = new oFF.XDwcFsActionFetch();
	object.m_uri = uri;
	object.setupActionAndRun(syncType, listener, customIdentifier, fsmr);
	return object;
};
oFF.XDwcFsActionFetch.prototype.m_uri = null;
oFF.XDwcFsActionFetch.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onFileSystemFetched(extResult, data, customIdentifier);
};
oFF.XDwcFsActionFetch.prototype.processSynchronization = function(syncType)
{
	let fileSystem = this.getActionContext().getFileSystemByUri(this.m_uri);
	this.setData(fileSystem);
	return false;
};

oFF.SubSysFsDwcPrg = function() {};
oFF.SubSysFsDwcPrg.prototype = new oFF.DfSubSysFilesystem();
oFF.SubSysFsDwcPrg.prototype._ff_c = "SubSysFsDwcPrg";

oFF.SubSysFsDwcPrg.DEFAULT_PROGRAM_NAME = "@SubSys.FileSystem.fsdwc";
oFF.SubSysFsDwcPrg.prototype.m_dwcFileSystems = null;
oFF.SubSysFsDwcPrg.prototype.m_fs = null;
oFF.SubSysFsDwcPrg.prototype.getAllInitializedFileSystems = function()
{
	return this.m_dwcFileSystems;
};
oFF.SubSysFsDwcPrg.prototype.getFileSystem = function(protocolType)
{
	return this.m_fs;
};
oFF.SubSysFsDwcPrg.prototype.getFileSystemByUri = function(uri)
{
	if (oFF.isNull(this.m_dwcFileSystems))
	{
		this.m_dwcFileSystems = oFF.XHashMapByString.create();
	}
	let host = uri.getHost();
	let dwcFs;
	let cachedFs = this.m_dwcFileSystems.getByKey(host);
	if (oFF.notNull(cachedFs))
	{
		dwcFs = cachedFs;
	}
	else
	{
		if (oFF.notNull(host))
		{
			dwcFs = oFF.DwcFileSystem.createByHost(this.getProcess(), host);
		}
		else
		{
			dwcFs = oFF.DwcFileSystem.create(this.getProcess());
		}
		this.m_dwcFileSystems.put(host, dwcFs);
	}
	this.m_fs = dwcFs;
	return this.m_fs;
};
oFF.SubSysFsDwcPrg.prototype.getProgramName = function()
{
	return oFF.SubSysFsDwcPrg.DEFAULT_PROGRAM_NAME;
};
oFF.SubSysFsDwcPrg.prototype.getProtocolType = function()
{
	return oFF.ProtocolType.FS_DWC;
};
oFF.SubSysFsDwcPrg.prototype.newProgram = function()
{
	let prg = new oFF.SubSysFsDwcPrg();
	prg.setup();
	return prg;
};
oFF.SubSysFsDwcPrg.prototype.processFetchFileSystem = function(syncType, listener, customIdentifier, uri)
{
	if (this.getProcess().getConnectionPool() === null)
	{
		this.getProcess().setEntity(oFF.ProcessEntity.CONNECTION_POOL, oFF.ConnectionPool.create(this.getProcess()));
	}
	return oFF.XDwcFsActionFetch.createAndRun(syncType, listener, customIdentifier, this, uri);
};
oFF.SubSysFsDwcPrg.prototype.runProcess = function()
{
	this.m_dwcFileSystems = oFF.XHashMapByString.create();
	let process = this.getProcess();
	if (this.getProcess().getConnectionPool() === null)
	{
		this.getProcess().setEntity(oFF.ProcessEntity.CONNECTION_POOL, oFF.ConnectionPool.create(this.getProcess()));
	}
	this.m_fs = oFF.DwcFileSystem.create(process);
	this.activateSubSystem(null, oFF.SubSystemStatus.ACTIVE);
	return true;
};

oFF.DwcFileSystem = function() {};
oFF.DwcFileSystem.prototype = new oFF.DfXFileSystem();
oFF.DwcFileSystem.prototype._ff_c = "DwcFileSystem";

oFF.DwcFileSystem.CHILDREN = "children";
oFF.DwcFileSystem.NAME = "name";
oFF.DwcFileSystem.create = function(process)
{
	let dwcFileSystem = new oFF.DwcFileSystem();
	dwcFileSystem.m_fileCache = oFF.XHashMapByString.create();
	dwcFileSystem.setupProcessContext(process);
	return dwcFileSystem;
};
oFF.DwcFileSystem.createByHost = function(process, host)
{
	let dwcFileSystem = new oFF.DwcFileSystem();
	dwcFileSystem.m_fileCache = oFF.XHashMapByString.create();
	dwcFileSystem.getRequestProcessors().add(oFF.AllSpacesSearchRequestProcessor.create());
	dwcFileSystem.getRequestProcessors().add(oFF.ListSpaceOrFolderChildrenRequestProcessor.create());
	dwcFileSystem.getRequestProcessors().add(oFF.SearchInSpaceOrFolderRequestProcessor.create());
	dwcFileSystem.getRequestProcessors().add(oFF.GlobalSearchRequestProcessor.create());
	dwcFileSystem.getResponseProcessors().add(oFF.SearchResponseProcessor.create());
	dwcFileSystem.getResponseProcessors().add(oFF.SpaceListResponseProcessor.create());
	dwcFileSystem.setupProcessContext(process);
	return dwcFileSystem;
};
oFF.DwcFileSystem.prototype.m_fileCache = null;
oFF.DwcFileSystem.prototype.m_fs = null;
oFF.DwcFileSystem.prototype.m_rootFile = null;
oFF.DwcFileSystem.prototype.requestProcessors = null;
oFF.DwcFileSystem.prototype.responseProcessors = null;
oFF.DwcFileSystem.prototype.dropCache = function()
{
	this.getFileCache().clear();
};
oFF.DwcFileSystem.prototype.getAttributes = function(file)
{
	let result = null;
	let targetPath = file.getTargetUriPath();
	let fileStructure = this.getFileStructure(targetPath);
	if (oFF.notNull(fileStructure))
	{
		result = fileStructure.getStructureByKey(oFF.DwcFsConstants.ATTRIBUTES);
	}
	if (oFF.isNull(result))
	{
		result = oFF.DfXFileSystem.prototype.getAttributes.call( this , file);
	}
	return result;
};
oFF.DwcFileSystem.prototype.getChildren = function(file)
{
	let children = oFF.XList.create();
	return children;
};
oFF.DwcFileSystem.prototype.getFileCache = function()
{
	return this.m_fileCache;
};
oFF.DwcFileSystem.prototype.getFileStructure = function(targetPath)
{
	let element = null;
	if (oFF.XString.startsWith(targetPath, oFF.XUri.PATH_SEPARATOR) === true)
	{
		element = this.m_fs;
		let elements = oFF.XStringTokenizer.splitString(targetPath, oFF.XUri.PATH_SEPARATOR);
		if (oFF.XStringUtils.isNullOrEmpty(elements.get(0)))
		{
			elements.removeAt(0);
		}
		let size = elements.size();
		if (size > 0)
		{
			if (oFF.XStringUtils.isNullOrEmpty(elements.get(size - 1)))
			{
				elements.removeAt(size - 1);
			}
		}
		for (let k = 0; k < elements.size() && oFF.notNull(element); k++)
		{
			let name = elements.get(k);
			let childList = element.getListByKey(oFF.DwcFileSystem.CHILDREN);
			element = null;
			if (oFF.notNull(childList))
			{
				for (let i = 0; i < childList.size(); i++)
				{
					let currentChild = childList.getStructureAt(i);
					let currentName = currentChild.getStringByKey(oFF.DwcFileSystem.NAME);
					if (oFF.XString.isEqual(name, currentName))
					{
						element = currentChild;
						break;
					}
				}
			}
		}
	}
	return element;
};
oFF.DwcFileSystem.prototype.getFileType = function(file)
{
	if (this.isDirectoryExt(file))
	{
		return oFF.XFileType.DIR;
	}
	else
	{
		return oFF.XFileType.FILE;
	}
};
oFF.DwcFileSystem.prototype.getProtocolType = function()
{
	return oFF.ProtocolType.FS_DWC;
};
oFF.DwcFileSystem.prototype.getRequestProcessors = function()
{
	if (oFF.isNull(this.requestProcessors))
	{
		this.requestProcessors = oFF.XList.create();
	}
	return this.requestProcessors;
};
oFF.DwcFileSystem.prototype.getResponseProcessors = function()
{
	if (oFF.isNull(this.responseProcessors))
	{
		this.responseProcessors = oFF.XList.create();
	}
	return this.responseProcessors;
};
oFF.DwcFileSystem.prototype.isExistingExt = function(file)
{
	let targetPath = file.getTargetUriPath();
	let fileStructure = this.getFileStructure(targetPath);
	return oFF.notNull(fileStructure);
};
oFF.DwcFileSystem.prototype.isFileExt = function(file)
{
	return !this.isDirectoryExt(file);
};
oFF.DwcFileSystem.prototype.isProviderDirectoryExt = function(file)
{
	let targetPath = file.getUri().getPath();
	let fileStructure = this.getFileStructure(targetPath);
	return oFF.notNull(fileStructure) ? fileStructure.containsKey(oFF.DwcFileSystem.CHILDREN) : false;
};
oFF.DwcFileSystem.prototype.newFile = function(process, uri)
{
	let fileId = uri.getPathContainer().getFileName();
	let file = this.getFileCache().getByKey(fileId);
	if (oFF.isNull(file))
	{
		file = oFF.DwcFile.createFile(process, this, uri, oFF.XHashMapByString.create());
	}
	if (oFF.notNull(this.m_rootFile) && oFF.XString.isEqual(uri.getPath(), oFF.XUri.PATH_SEPARATOR))
	{
		let host = uri.getHost();
		if (!oFF.XString.isEqual(host, this.m_rootFile.getUri().getHost()))
		{
			this.m_rootFile = file;
		}
		return this.m_rootFile;
	}
	else if (oFF.XString.isEqual(uri.getPath(), oFF.XUri.PATH_SEPARATOR))
	{
		this.m_rootFile = file;
	}
	return file;
};
oFF.DwcFileSystem.prototype.processFetchChildren = function(dwcFile, syncType, listener, customIdentifier, config)
{
	return oFF.DwcFileFetchChildrenAction.createAndRun(syncType, dwcFile, this, oFF.DwcGenericFileRequestListener2.create((fileRequestAction) => {
		let data = fileRequestAction.getData();
		if (oFF.notNull(listener))
		{
			listener.onFileProviderChildrenFetched(fileRequestAction, data, data.getProviderChildFiles(), data.getProviderChildrenResultset(), customIdentifier);
		}
	}), customIdentifier, config);
};
oFF.DwcFileSystem.prototype.processFetchMetadata = function(dwcFile, syncType, listener, customIdentifier)
{
	let syncAction = oFF.DwcFileFetchMetadataAction2.createAndRun(syncType, dwcFile, this, oFF.DwcGenericFileRequestListener2.create((fileRequestAction) => {
		let data = fileRequestAction.getData();
		if (oFF.notNull(listener))
		{
			listener.onFileProviderFetchMetadata(fileRequestAction, data, data.getProviderMetadataAndAttributes(), customIdentifier);
		}
	}), customIdentifier);
	return syncAction;
};
oFF.DwcFileSystem.prototype.processIsExisting = function(olapFile, syncType, listener, customIdentifier)
{
	let syncAction = oFF.DwcFileFetchMetadataAction2.createAndRun(syncType, olapFile, this, oFF.DwcGenericFileRequestListener2.create((fileRequestAction) => {
		let file = fileRequestAction.getData();
		if (oFF.notNull(listener))
		{
			listener.onFileProviderExistsCheck(fileRequestAction, file, file.getProviderIsExisting(), customIdentifier);
		}
	}), customIdentifier);
	return syncAction;
};

oFF.DwcFileFetchChildrenAction = function() {};
oFF.DwcFileFetchChildrenAction.prototype = new oFF.DwcFileBaseAction2();
oFF.DwcFileFetchChildrenAction.prototype._ff_c = "DwcFileFetchChildrenAction";

oFF.DwcFileFetchChildrenAction.AND = "AND";
oFF.DwcFileFetchChildrenAction.CARET = "^";
oFF.DwcFileFetchChildrenAction.CLOSE_PARENTHESES = ")";
oFF.DwcFileFetchChildrenAction.CLOSE_SQUARE_BRACKET = "]";
oFF.DwcFileFetchChildrenAction.COLON = ":";
oFF.DwcFileFetchChildrenAction.DOUBLE_QUOTE = "\"";
oFF.DwcFileFetchChildrenAction.HIPHEN = "-";
oFF.DwcFileFetchChildrenAction.NOT = "NOT";
oFF.DwcFileFetchChildrenAction.OPEN_PARENTHESES = "(";
oFF.DwcFileFetchChildrenAction.OPEN_SQUARE_BRACKET = "[";
oFF.DwcFileFetchChildrenAction.OR = "OR";
oFF.DwcFileFetchChildrenAction.QUESTION_MARK = "?";
oFF.DwcFileFetchChildrenAction.SINGLE_BACK_SLASH = "\\";
oFF.DwcFileFetchChildrenAction.SINGLE_QUOTE = "'";
oFF.DwcFileFetchChildrenAction.TILDE = "~";
oFF.DwcFileFetchChildrenAction.createAndRun = function(syncType, dwcFile, fileSystem, listener, customIdentifier, config)
{
	let action = new oFF.DwcFileFetchChildrenAction();
	action.m_file = dwcFile;
	action.m_ofs = fileSystem;
	action.m_FileQueryConfig = config;
	action.setData(dwcFile);
	action.reservedCharacters = oFF.XArray.create(12);
	action.reservedCharacters.set(0, oFF.DwcFileFetchChildrenAction.SINGLE_BACK_SLASH);
	action.reservedCharacters.set(1, oFF.DwcFileFetchChildrenAction.HIPHEN);
	action.reservedCharacters.set(2, oFF.DwcFileFetchChildrenAction.OPEN_PARENTHESES);
	action.reservedCharacters.set(3, oFF.DwcFileFetchChildrenAction.CLOSE_PARENTHESES);
	action.reservedCharacters.set(4, oFF.DwcFileFetchChildrenAction.TILDE);
	action.reservedCharacters.set(5, oFF.DwcFileFetchChildrenAction.CARET);
	action.reservedCharacters.set(6, oFF.DwcFileFetchChildrenAction.QUESTION_MARK);
	action.reservedCharacters.set(7, oFF.DwcFileFetchChildrenAction.DOUBLE_QUOTE);
	action.reservedCharacters.set(8, oFF.DwcFileFetchChildrenAction.COLON);
	action.reservedCharacters.set(9, oFF.DwcFileFetchChildrenAction.SINGLE_QUOTE);
	action.reservedCharacters.set(10, oFF.DwcFileFetchChildrenAction.OPEN_SQUARE_BRACKET);
	action.reservedCharacters.set(11, oFF.DwcFileFetchChildrenAction.CLOSE_SQUARE_BRACKET);
	action.reservedWords = oFF.XArray.create(3);
	action.reservedWords.set(0, oFF.DwcFileFetchChildrenAction.AND);
	action.reservedWords.set(1, oFF.DwcFileFetchChildrenAction.OR);
	action.reservedWords.set(2, oFF.DwcFileFetchChildrenAction.NOT);
	action.setupActionAndRun(syncType, listener, customIdentifier, fileSystem);
	return action;
};
oFF.DwcFileFetchChildrenAction.prototype.m_FileQueryConfig = null;
oFF.DwcFileFetchChildrenAction.prototype.m_file = null;
oFF.DwcFileFetchChildrenAction.prototype.m_ofs = null;
oFF.DwcFileFetchChildrenAction.prototype.reservedCharacters = null;
oFF.DwcFileFetchChildrenAction.prototype.reservedWords = null;
oFF.DwcFileFetchChildrenAction.prototype.getDeployedObjects = function(syncType, spaceName, searchText)
{
	let fullUrl = oFF.DatasphereRequestFactory.getDeployedObjectsSearchRequest(spaceName, searchText, this.m_FileQueryConfig);
	let uri = oFF.XUri.createFromUrl(fullUrl);
	let getModelsBySpaceFunction = this.getDwcConnection().newRpcFunctionByUri(uri);
	getModelsBySpaceFunction.getRpcRequest().setMethod(oFF.HttpRequestMethod.HTTP_GET);
	getModelsBySpaceFunction.processFunctionExecution(syncType, this, null);
};
oFF.DwcFileFetchChildrenAction.prototype.getDwcConnection = function()
{
	return this.getProcess().getConnectionPool().getConnection(this.m_file.getUri().getHost());
};
oFF.DwcFileFetchChildrenAction.prototype.getSpacesForCurrentUser = function(syncType)
{
	let uri = oFF.XUri.createFromUrl(oFF.DatasphereRequestFactory.listAllSpacesRequest());
	let getSpacesFunction = this.getDwcConnection().newRpcFunctionByUri(uri);
	getSpacesFunction.getRpcRequest().setMethod(oFF.HttpRequestMethod.HTTP_GET);
	getSpacesFunction.processFunctionExecution(syncType, this, null);
};
oFF.DwcFileFetchChildrenAction.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		if (oFF.notNull(response) && response.getRootElement() !== null)
		{
			if (this.m_ofs.getResponseProcessors() !== null && !this.m_ofs.getResponseProcessors().isEmpty())
			{
				let iterator = this.m_ofs.getResponseProcessors().getIterator();
				while (iterator.hasNext())
				{
					let processor = iterator.next();
					if (processor.accept(this.m_file, this.m_ofs, this.m_FileQueryConfig.getSearchValue()))
					{
						processor.process(response);
						break;
					}
				}
			}
			else
			{
				this.m_file.setProviderChildFiles(oFF.XList.create(), 0);
			}
		}
		else
		{
			this.addResponseError(response);
		}
	}
	this.endSync();
};
oFF.DwcFileFetchChildrenAction.prototype.processSynchronization = function(syncType)
{
	let doContinue;
	if (oFF.DatasphereFeatureToggle.isActive(oFF.DatasphereFeatureToggle.RESOURCE_EXPLORER_DATASPHERE_FOLDER_SUPPORT))
	{
		doContinue = this.processTargetUri(syncType);
	}
	else
	{
		doContinue = this.processTargetUriNoFolderSupport(syncType);
	}
	return doContinue;
};
oFF.DwcFileFetchChildrenAction.prototype.processTargetUri = function(syncType)
{
	let doContinue = true;
	let requestUrl;
	if (oFF.DwcFileUtil.isListRootFolderRequest(this.m_file))
	{
		this.setRootFolders();
		doContinue = false;
	}
	else if (this.m_ofs.getRequestProcessors() !== null && !this.m_ofs.getRequestProcessors().isEmpty())
	{
		let iterator = this.m_ofs.getRequestProcessors().getIterator();
		while (iterator.hasNext())
		{
			let requestProcessor = iterator.next();
			if (requestProcessor.accept(this.m_file, this.m_FileQueryConfig))
			{
				requestUrl = requestProcessor.process();
				this.sendRequestToDataSphereBackend(requestUrl, syncType);
				break;
			}
		}
	}
	return doContinue;
};
oFF.DwcFileFetchChildrenAction.prototype.processTargetUriNoFolderSupport = function(syncType)
{
	let doContinue = true;
	let targetUriPath = this.m_file.getUri().getPath();
	let fileName = this.m_file.getName();
	let searchText = null;
	let originalSearchText = "";
	if (oFF.notNull(this.m_FileQueryConfig))
	{
		originalSearchText = this.m_FileQueryConfig.getSearchValue();
		searchText = oFF.XString.trim(originalSearchText);
	}
	if (oFF.DwcFileUtil.isGetRootFolderRequest(targetUriPath))
	{
		this.setRootFolders();
		doContinue = false;
	}
	else if (oFF.DwcFileUtil.isGetDeployedObjectsRequest(targetUriPath, fileName))
	{
		searchText = oFF.DwcFileUtil.escapeSearchQueryText(searchText, this.reservedCharacters, this.reservedWords);
		searchText = !oFF.XStringUtils.isNullOrEmpty(searchText) ? searchText : oFF.DwcFsConstants.WILDCARD;
		this.getDeployedObjects(syncType, fileName, searchText);
	}
	else if (oFF.DwcFileUtil.isListAllSpacesRequest(this.m_file, originalSearchText))
	{
		this.getSpacesForCurrentUser(syncType);
	}
	else if (oFF.DwcFileUtil.isSearchObjectsAcrossAllSpacesRequest(this.m_file, originalSearchText))
	{
		searchText = !oFF.XStringUtils.isNullOrEmpty(searchText) ? searchText : oFF.DwcFsConstants.WILDCARD;
		if (!oFF.XString.isEqual(searchText, oFF.DwcFsConstants.WILDCARD))
		{
			searchText = oFF.DwcFileUtil.escapeSearchQueryText(searchText, this.reservedCharacters, this.reservedWords);
		}
		this.getDeployedObjects(syncType, null, searchText);
	}
	return doContinue;
};
oFF.DwcFileFetchChildrenAction.prototype.sendRequestToDataSphereBackend = function(fullUrl, syncType)
{
	let uri = oFF.XUri.createFromUrl(fullUrl);
	let getDataSphereFunction = this.getDwcConnection().newRpcFunctionByUri(uri);
	getDataSphereFunction.getRpcRequest().setMethod(oFF.HttpRequestMethod.HTTP_GET);
	getDataSphereFunction.processFunctionExecution(syncType, this, null);
};
oFF.DwcFileFetchChildrenAction.prototype.setRootFolders = function()
{
	let children = oFF.XList.create();
	let dwcFileAttr = oFF.XHashMapByString.create();
	dwcFileAttr.put(oFF.XFileAttribute.NODE_TYPE, oFF.DwcFsConstants.FOLDER);
	dwcFileAttr.put(oFF.XFileAttribute.SYSTEM_TYPE, oFF.DwcFsConstants.DWC);
	let schemaChildFolderUri = oFF.XUri.createChildDir(this.m_file.getUri(), oFF.DwcFsConstants.SPACE_FOLDER);
	let spaceFolder = oFF.DwcFile.createFile(this.getProcess(), this.m_ofs, schemaChildFolderUri, dwcFileAttr);
	let schemaFolderMetadata = oFF.DwcFileUtil.getBasicMetaData(oFF.DwcFsConstants.SPACE_FOLDER);
	spaceFolder.setProviderMetadata(schemaFolderMetadata);
	children.add(spaceFolder);
	this.m_file.setProviderChildFiles(children, 1);
};

oFF.DwcFileFetchMetadataAction2 = function() {};
oFF.DwcFileFetchMetadataAction2.prototype = new oFF.DwcFileBaseAction2();
oFF.DwcFileFetchMetadataAction2.prototype._ff_c = "DwcFileFetchMetadataAction2";

oFF.DwcFileFetchMetadataAction2.createAndRun = function(syncType, dwcFile, fileSystem, listener, customIdentifier)
{
	let action = new oFF.DwcFileFetchMetadataAction2();
	action.m_file = dwcFile;
	action.setData(dwcFile);
	action.setupActionAndRun(syncType, listener, customIdentifier, fileSystem);
	return action;
};
oFF.DwcFileFetchMetadataAction2.prototype.m_file = null;
oFF.DwcFileFetchMetadataAction2.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.endSync();
};
oFF.DwcFileFetchMetadataAction2.prototype.processSynchronization = function(syncType)
{
	let doContinue;
	doContinue = this.processTargetUri(syncType);
	return doContinue;
};
oFF.DwcFileFetchMetadataAction2.prototype.processTargetUri = function(syncType)
{
	let doContinue = true;
	let fileName = this.m_file.getName();
	if (oFF.XString.isEqual(fileName, oFF.DwcFsConstants.SPACE_FOLDER))
	{
		let metadata = oFF.DwcFileUtil.getBasicMetaData(fileName);
		this.m_file.setProviderMetadata(metadata);
		doContinue = false;
	}
	return doContinue;
};

oFF.DwcModule = function() {};
oFF.DwcModule.prototype = new oFF.DfModule();
oFF.DwcModule.prototype._ff_c = "DwcModule";

oFF.DwcModule.DWC_MODULE = "ff2140.dwc";
oFF.DwcModule.s_module = null;
oFF.DwcModule.getInstance = function()
{
	if (oFF.isNull(oFF.DwcModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.RuntimeModule.getInstance());
		oFF.DwcModule.s_module = oFF.DfModule.startExt(new oFF.DwcModule());
		oFF.DatasphereFeatureToggle.staticSetup();
		oFF.ProgramRegistry.setProgramFactory(new oFF.SubSysFsDwcPrg());
		oFF.DfModule.stopExt(oFF.DwcModule.s_module);
	}
	return oFF.DwcModule.s_module;
};
oFF.DwcModule.prototype.getName = function()
{
	return oFF.DwcModule.DWC_MODULE;
};

oFF.DwcModule.getInstance();

return oFF;
} );