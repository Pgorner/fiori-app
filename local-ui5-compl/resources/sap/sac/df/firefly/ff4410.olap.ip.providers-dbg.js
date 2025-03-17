/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff4400.olap.providers","sap/sac/df/firefly/ff4315.olap.ip.impl"
],
function(oFF)
{
"use strict";

oFF.PlanningStateHandlerImpl = function() {};
oFF.PlanningStateHandlerImpl.prototype = new oFF.XObject();
oFF.PlanningStateHandlerImpl.prototype._ff_c = "PlanningStateHandlerImpl";

oFF.PlanningStateHandlerImpl.prototype.getDataAreaStateByName = function(application, systemName, dataArea)
{
	return oFF.DataAreaState.getDataAreaStateByName(application, systemName, dataArea);
};
oFF.PlanningStateHandlerImpl.prototype.update = function(application, systemName, response, messageCollector)
{
	oFF.PlanningState.update(application, systemName, response, messageCollector);
};
oFF.PlanningStateHandlerImpl.prototype.updateFromResponse = function(application, systemName, request, response, messageCollector)
{
	oFF.PlanningState.updateFromResponse(application, systemName, request, response, messageCollector);
};

oFF.PlanningVariableProcessorProviderFactory = function() {};
oFF.PlanningVariableProcessorProviderFactory.prototype = new oFF.XObject();
oFF.PlanningVariableProcessorProviderFactory.prototype._ff_c = "PlanningVariableProcessorProviderFactory";

oFF.PlanningVariableProcessorProviderFactory.staticSetup = function()
{
	oFF.PlanningCommandWithId.s_variableHelpProviderFactory = new oFF.PlanningVariableProcessorProviderFactory();
};
oFF.PlanningVariableProcessorProviderFactory.prototype.createProcessorProvider = function(dataSource, variableRequestor, requestorProvider)
{
	return oFF.InAPlanningVarProcessorProvider.createInAVariableProcessorProvider(dataSource, variableRequestor, requestorProvider);
};
oFF.PlanningVariableProcessorProviderFactory.prototype.createVariableHelpProvider = function(planningCommandWithValueHelp)
{
	return oFF.InAPlanningValueHelpProvider.create(planningCommandWithValueHelp);
};

oFF.InADataAreaRequestHelper = {

	createGetMetadataRequestStructure:function(request)
	{
			let inaRequestStructure = oFF.PrFactory.createStructure();
		let dataAreaState = oFF.DataAreaState.getDataAreaState(request.getDataArea());
		if (!dataAreaState.isSubmitted())
		{
			inaRequestStructure.putNewList("DataAreas").add(dataAreaState.serializeToJson());
		}
		let metadata = inaRequestStructure.putNewStructure("Metadata");
		request.getPlanningService().getInaCapabilities().exportActiveCapabilities(metadata);
		metadata.putString("Context", "Planning");
		let expand = metadata.putNewList("Expand");
		expand.addString("Command");
		let dataSource = metadata.putNewStructure("DataSource");
		let dataAreaName = request.getDataArea().getDataArea();
		if (oFF.isNull(dataAreaName))
		{
			dataAreaName = "DEFAULT";
		}
		dataSource.putString("DataArea", dataAreaName);
		dataSource.putString("InstanceId", request.getInstanceId());
		return inaRequestStructure;
	},
	extractBaseDataSource:function(step)
	{
			let baseDataSource = oFF.PrUtils.getStructureProperty(step, "BaseDataSource");
		if (oFF.isNull(baseDataSource))
		{
			return null;
		}
		let objectName = oFF.PrUtils.getStringValueProperty(baseDataSource, "ObjectName", null);
		if (oFF.isNull(objectName))
		{
			return null;
		}
		let metaObjectType = oFF.MetaObjectType.lookup(oFF.PrUtils.getStringValueProperty(baseDataSource, "Type", null));
		if (oFF.isNull(metaObjectType))
		{
			return null;
		}
		return oFF.QFactory.createDataSourceWithType(metaObjectType, objectName);
	}
};

oFF.InAPlanningHelper = {

	DEFAULT_RETURN_CODE:9999,
	createCommandsList:function(rootStructure)
	{
			let planning = rootStructure.putNewStructure("Planning");
		return planning.putNewList("commands");
	},
	createModelCommand:function(model, commandName)
	{
			let command = oFF.PrFactory.createStructure();
		let effectiveCommandName = commandName;
		if (oFF.XString.isEqual("get_action_parameters", commandName))
		{
			effectiveCommandName = "get_parameters";
		}
		command.putString("command", effectiveCommandName);
		command.putString("schema", model.getPlanningModelSchema());
		command.putString("model", model.getPlanningModelName());
		if (oFF.XString.isEqual("get_parameters", commandName))
		{
			command.putString("mode", "LIST_PERSISTENT");
		}
		else if (oFF.XString.isEqual("get_versions", commandName))
		{
			let modeListGetVersions = command.putNewList("mode");
			modeListGetVersions.addString("LIST_PERSISTENT_PARAMETERS");
			if (model.isWithSharedVersions())
			{
				modeListGetVersions.addString("LIST_SHARED_VERSIONS");
			}
			modeListGetVersions.addString("LIST_QUERY_SOURCES");
			modeListGetVersions.addString("LIST_SHARED_PRIVILEGES");
			modeListGetVersions.addString("LIST_BACKUP_TIMESTAMP");
			modeListGetVersions.addString("LIST_ACTION_STATE");
		}
		else if (oFF.XString.isEqual("get_actions", commandName))
		{
			let modeListGetActions = command.putNewList("mode");
			modeListGetActions.addString("LIST_ACTION_PARAMETERS");
		}
		else if (oFF.XString.isEqual("get_action_parameters", commandName))
		{
			let modeListGetParameters = command.putNewList("mode");
			modeListGetParameters.addString("LIST_ACTIONS");
		}
		return command;
	},
	createVersionCommand:function(version, commandName)
	{
			let model = version.getPlanningModel();
		let command = oFF.PrFactory.createStructure();
		command.putString("command", commandName);
		command.putString("schema", model.getPlanningModelSchema());
		command.putString("model", model.getPlanningModelName());
		command.putInteger("version_id", version.getVersionId());
		if (version.isSharedVersion())
		{
			command.putString("owner", version.getVersionOwner());
		}
		if (oFF.XString.isEqual("get_version_state", commandName))
		{
			let modeListGetVersionState = command.putNewList("mode");
			modeListGetVersionState.addString("LIST_BACKUP_TIMESTAMP");
			modeListGetVersionState.addString("LIST_ACTION_STATE");
		}
		else if (oFF.XString.isEqual("get_parameters", commandName))
		{
			command.putString("mode", "LIST_PERSISTENT");
		}
		else if (oFF.XString.isEqual("init", commandName))
		{
			let persistenceType = version.getPlanningModel().getPersistenceType();
			if (oFF.notNull(persistenceType) && persistenceType !== oFF.PlanningPersistenceType.DEFAULT)
			{
				command.putString("persistent_pdcs", persistenceType.getName());
			}
		}
		else if (oFF.XString.isEqual("close", commandName))
		{
			command.putString("mode", oFF.CloseModeType.BACKUP.getName());
		}
		return command;
	},
	getCommandIndex:function(commands, commandName)
	{
			if (oFF.isNull(commands))
		{
			return -1;
		}
		let effectiveCommandName = commandName;
		let checkMode = false;
		let modeToCheck = null;
		if (oFF.XString.isEqual("get_action_parameters", commandName))
		{
			effectiveCommandName = "get_parameters";
			checkMode = true;
			modeToCheck = "LIST_ACTIONS";
		}
		for (let i = 0; i < commands.size(); i++)
		{
			let command = oFF.PrUtils.getStructureElement(commands, i);
			let commandString = oFF.PrUtils.getStringProperty(command, "command");
			if (oFF.isNull(commandString))
			{
				continue;
			}
			if (oFF.XString.isEqual(commandString.getString(), effectiveCommandName))
			{
				if (!checkMode)
				{
					return i;
				}
				let modeString = oFF.PrUtils.getStringProperty(command, "mode");
				if (oFF.notNull(modeString))
				{
					if (oFF.XString.isEqual(modeString.getString(), modeToCheck))
					{
						return i;
					}
				}
				let modeList = oFF.PrUtils.getListProperty(command, "mode");
				let len = oFF.PrUtils.getListSize(modeList, 0);
				for (let modeIndex = 0; modeIndex < len; modeIndex++)
				{
					let modeStringElement = oFF.PrUtils.getStringElement(modeList, modeIndex);
					if (oFF.notNull(modeStringElement))
					{
						if (oFF.XString.isEqual(modeStringElement.getString(), modeToCheck))
						{
							return i;
						}
					}
				}
			}
		}
		return -1;
	},
	getCommandResponse:function(commands, responses, commandName)
	{
			let commandIndex = oFF.InAPlanningHelper.getCommandIndex(commands, commandName);
		return oFF.PrUtils.getStructureElement(responses, commandIndex);
	},
	getCommandsList:function(rootStructure)
	{
			let planning = oFF.PrUtils.getStructureProperty(rootStructure, "Planning");
		return oFF.PrUtils.getListProperty(planning, "commands");
	},
	getResponsesList:function(rootStructure)
	{
			return oFF.PrUtils.getListProperty(rootStructure, "Planning");
	},
	getResponsesReturnCodeStrict:function(responseStructure, messageManager)
	{
			if (oFF.isNull(responseStructure) || oFF.isNull(messageManager))
		{
			return -1;
		}
		let returnCode = 0;
		let hasPlanningStructure = false;
		let planningStructure = oFF.PrUtils.getStructureProperty(responseStructure, "Planning");
		if (oFF.isNull(planningStructure))
		{
			let planningList = oFF.PrUtils.getListProperty(responseStructure, "Planning");
			if (oFF.notNull(planningList))
			{
				hasPlanningStructure = true;
				for (let i = 0; i < planningList.size(); i++)
				{
					planningStructure = oFF.PrUtils.getStructureElement(planningList, i);
					if (oFF.notNull(planningStructure))
					{
						let planningReturnCode = oFF.InAPlanningHelper.isValidPlanningStructure(planningStructure, messageManager);
						if (planningReturnCode !== 0)
						{
							returnCode = planningReturnCode;
							break;
						}
					}
				}
			}
		}
		else
		{
			hasPlanningStructure = true;
			returnCode = oFF.InAPlanningHelper.isValidPlanningStructure(planningStructure, messageManager);
		}
		if (!hasPlanningStructure)
		{
			messageManager.addErrorExt(oFF.OriginLayer.DRIVER, oFF.ErrorCodes.PARSER_ERROR, "Planning structure is missing", responseStructure);
			return oFF.InAPlanningHelper.DEFAULT_RETURN_CODE;
		}
		return returnCode;
	},
	hasErrors:function(importer, request, inaStructure)
	{
			let result = request.getResult();
		let responses = oFF.InAPlanningHelper.getResponsesList(inaStructure);
		if (oFF.isNull(responses))
		{
			importer.addError(oFF.ErrorCodes.PARSER_ERROR, "Couldn't find command responses.");
			return true;
		}
		oFF.InAHelper.importMessages(inaStructure, importer);
		let returnCode = oFF.InAPlanningHelper.getResponsesReturnCodeStrict(inaStructure, importer);
		result.setReturnCode(returnCode);
		if (importer.hasErrors() || returnCode !== 0)
		{
			if (returnCode === 3042)
			{
				request.getPlanningModel().resetPlanningModel();
			}
			return true;
		}
		return false;
	},
	isValidPlanningStructure:function(planningStructure, messageManager)
	{
			let returnCode = oFF.PrUtils.getIntegerValueProperty(planningStructure, "return_code", oFF.InAPlanningHelper.DEFAULT_RETURN_CODE);
		if (oFF.isNull(planningStructure))
		{
			messageManager.addError(oFF.ErrorCodes.PARSER_ERROR, "Planning structure is missing");
			return returnCode;
		}
		let exceptionText = oFF.PrUtils.getStringValueProperty(planningStructure, "exception_text", null);
		if (oFF.notNull(exceptionText))
		{
			messageManager.addErrorExt(oFF.OriginLayer.DRIVER, oFF.ErrorCodes.OTHER_ERROR, exceptionText, planningStructure);
			return returnCode;
		}
		let message = oFF.PrUtils.getStringValueProperty(planningStructure, "message", null);
		if (oFF.notNull(message))
		{
			messageManager.addErrorExt(oFF.OriginLayer.DRIVER, oFF.ErrorCodes.OTHER_ERROR, message, planningStructure);
			return returnCode;
		}
		return returnCode;
	},
	processResponseGetActionParameters:function(commands, responses, model)
	{
			let commandResponse = oFF.InAPlanningHelper.getCommandResponse(commands, responses, "get_action_parameters");
		if (oFF.isNull(commandResponse))
		{
			return false;
		}
		let parametersMap = oFF.XHashMapByString.create();
		let parametersList = oFF.PrUtils.getListProperty(commandResponse, "parameters");
		let len = oFF.PrUtils.getListSize(parametersList, 0);
		for (let i = 0; i < len; i++)
		{
			let parameterStructure = oFF.PrUtils.getStructureElement(parametersList, i);
			let parameterNameString = oFF.PrUtils.getStringProperty(parameterStructure, "name");
			if (oFF.isNull(parameterNameString))
			{
				return false;
			}
			let parameterName = parameterNameString.getString();
			if (parametersMap.containsKey(parameterName))
			{
				return false;
			}
			parametersMap.put(parameterName, parameterStructure);
		}
		let actionMetadataList = model.getActionMetadataListInternal();
		if (oFF.notNull(actionMetadataList))
		{
			for (let actionIndex = 0; actionIndex < actionMetadataList.size(); actionIndex++)
			{
				let actionMetadata = actionMetadataList.get(actionIndex);
				let actionParameterNames = actionMetadata.getActionParameterNames();
				let actionParameterMetadata = new oFF.PlanningActionParameterMetadata();
				actionParameterMetadata.setActionMetadata(actionMetadata);
				let actionParameterList = oFF.PrFactory.createList();
				if (oFF.notNull(actionParameterNames))
				{
					for (let actionParameterIndex = 0; actionParameterIndex < actionParameterNames.size(); actionParameterIndex++)
					{
						let actionParameterName = actionParameterNames.get(actionParameterIndex);
						if (!parametersMap.containsKey(actionParameterName))
						{
							return false;
						}
						let actionParameterStructure = parametersMap.getByKey(actionParameterName);
						actionParameterList.add(oFF.PrUtils.deepCopyElement(actionParameterStructure));
					}
				}
				actionParameterMetadata.setParameters(actionParameterList);
				actionMetadata.setActionParameterMetadata(actionParameterMetadata);
			}
		}
		return true;
	},
	processResponseGetActions:function(commands, responses, model)
	{
			let commandResponse = oFF.InAPlanningHelper.getCommandResponse(commands, responses, "get_actions");
		if (oFF.isNull(commandResponse))
		{
			return false;
		}
		let actionMetadataList = model.getActionMetadataListInternal();
		actionMetadataList.clear();
		let actions = oFF.PrUtils.getListProperty(commandResponse, "actions");
		if (oFF.isNull(actions))
		{
			return false;
		}
		for (let i = 0; i < actions.size(); i++)
		{
			let action = oFF.PrUtils.getStructureElement(actions, i);
			let actionId = oFF.PrUtils.getStringValueProperty(action, "id", null);
			if (oFF.isNull(actionId))
			{
				return false;
			}
			let actionName = oFF.PrUtils.getStringValueProperty(action, "name", null);
			if (oFF.isNull(actionName))
			{
				return false;
			}
			let actionType = oFF.PlanningActionType.lookup(oFF.PrUtils.getIntegerValueProperty(action, "type", -1));
			if (oFF.PrUtils.getBooleanValueProperty(action, "publish", false))
			{
				actionType = oFF.PlanningActionType.PUBLISH;
			}
			let actionMetadata = new oFF.PlanningActionMetadata();
			actionMetadata.setActionId(actionId);
			actionMetadata.setActionName(actionName);
			let actionDescription = oFF.PrUtils.getStringValueProperty(action, "description", null);
			actionMetadata.setActionDescription(actionDescription);
			actionMetadata.setActionType(actionType);
			let isDefault = oFF.PrUtils.getBooleanValueProperty(action, "default", false);
			actionMetadata.setDefault(isDefault);
			let parameterNames = null;
			let parametersList = oFF.PrUtils.getListProperty(action, "parameters");
			let len = oFF.PrUtils.getListSize(parametersList, 0);
			for (let parametersIndex = 0; parametersIndex < len; parametersIndex++)
			{
				let parameterStringElement = oFF.PrUtils.getStringElement(parametersList, parametersIndex);
				if (oFF.notNull(parameterStringElement))
				{
					if (oFF.isNull(parameterNames))
					{
						parameterNames = oFF.XList.create();
					}
					parameterNames.add(parameterStringElement.getString());
				}
			}
			actionMetadata.setActionParameterNames(parameterNames);
			actionMetadataList.add(actionMetadata);
		}
		return true;
	},
	processResponseGetParametersForModelTemplate:function(commands, responses, model)
	{
			if (!model.supportsVersionParameters())
		{
			return true;
		}
		let commandResponse = oFF.InAPlanningHelper.getCommandResponse(commands, responses, "get_parameters");
		if (oFF.isNull(commandResponse))
		{
			return false;
		}
		let versionParametersMetadata = model.getVersionParametersMetadataInternal();
		versionParametersMetadata.clear();
		let parametersList = oFF.PrUtils.getListProperty(commandResponse, "parameters");
		if (oFF.isNull(parametersList))
		{
			return true;
		}
		for (let i = 0; i < parametersList.size(); i++)
		{
			let parameterStructure = oFF.PrUtils.getStructureElement(parametersList, i);
			if (oFF.isNull(parameterStructure))
			{
				continue;
			}
			let nameString = oFF.PrUtils.getStringProperty(parameterStructure, "name");
			if (oFF.isNull(nameString))
			{
				continue;
			}
			let name = nameString.getString();
			if (oFF.XStringUtils.isNullOrEmpty(name))
			{
				continue;
			}
			let parameterMetadata = new oFF.PlanningVersionParameterMetadata();
			parameterMetadata.setName(name);
			let descriptionString = oFF.PrUtils.getStringProperty(parameterStructure, "description");
			if (oFF.notNull(descriptionString))
			{
				parameterMetadata.setDescription(descriptionString.getString());
			}
			let typeString = oFF.PrUtils.getStringProperty(parameterStructure, "type");
			if (oFF.notNull(typeString))
			{
				parameterMetadata.setType(typeString.getString());
			}
			let valueAllowed = oFF.PrUtils.getBooleanValueProperty(parameterStructure, "valueAllowed", false);
			parameterMetadata.setValueAllowed(valueAllowed);
			let hasValue = oFF.PrUtils.getBooleanValueProperty(parameterStructure, "hasValue", false);
			parameterMetadata.setHasValue(hasValue);
			parameterMetadata.setValue(oFF.PrUtils.getProperty(parameterStructure, "value"));
			versionParametersMetadata.put(parameterMetadata.getName(), parameterMetadata);
		}
		return true;
	},
	processResponseGetQuerySources:function(commands, responses, model)
	{
			let commandResponse = oFF.InAPlanningHelper.getCommandResponse(commands, responses, "get_query_sources");
		if (oFF.isNull(commandResponse))
		{
			return false;
		}
		let dataSources = model.getDataSourcesInternal();
		dataSources.clear();
		let querySources = oFF.PrUtils.getListProperty(commandResponse, "query_sources");
		if (oFF.isNull(querySources))
		{
			return false;
		}
		for (let i = 0; i < querySources.size(); i++)
		{
			let querySource = oFF.PrUtils.getStructureElement(querySources, i);
			let schema = oFF.PrUtils.getStringValueProperty(querySource, "schema", null);
			if (oFF.isNull(schema))
			{
				return false;
			}
			let name = oFF.PrUtils.getStringValueProperty(querySource, "name", null);
			if (oFF.isNull(name))
			{
				return false;
			}
			let identifier = oFF.QFactory.createDataSourceWithType(oFF.MetaObjectType.PLANNING, name);
			identifier.setSchemaName(schema);
			let queryDataSource = new oFF.PlanningModelQueryDataSource();
			let description = oFF.PrUtils.getStringValueProperty(querySource, "description", null);
			queryDataSource.setDescription(description);
			queryDataSource.setDataSource(identifier);
			queryDataSource.setPrimary(querySource.getBooleanByKeyExt("primary", true));
			dataSources.add(queryDataSource);
		}
		return true;
	},
	processResponseGetVersionState:function(commands, responses, version)
	{
			let commandResponse = oFF.InAPlanningHelper.getCommandResponse(commands, responses, "get_version_state");
		if (oFF.isNull(commandResponse))
		{
			return false;
		}
		let versionStateResponse = oFF.PrUtils.getStructureProperty(commandResponse, "version_state");
		if (oFF.isNull(versionStateResponse))
		{
			return false;
		}
		return oFF.InAPlanningHelper.setVersionState(versionStateResponse, version);
	},
	processResponseGetVersions:function(commands, responses, model)
	{
			let commandResponse = oFF.InAPlanningHelper.getCommandResponse(commands, responses, "get_versions");
		if (oFF.isNull(commandResponse))
		{
			return false;
		}
		let versionsList = oFF.PrUtils.getListProperty(commandResponse, "versions");
		if (oFF.isNull(versionsList))
		{
			return false;
		}
		model.resetAllVersionStates();
		model.setVersionPrivilegesInitialized();
		oFF.PlanningModelResponseUpdateVersionPrivileges.resetVersionPrivilegesServerState(model);
		let isOk = true;
		for (let i = 0; i < versionsList.size(); i++)
		{
			let versionStructure = oFF.PrUtils.getStructureElement(versionsList, i);
			if (!oFF.InAPlanningHelper.processVersionStructure(versionStructure, model))
			{
				isOk = false;
			}
		}
		oFF.PlanningModelResponseUpdateVersionPrivileges.resetVersionPrivilegesClientState(model);
		model.updateAllInvalidPrivileges();
		return isOk;
	},
	processVersionStructure:function(versionStructure, model)
	{
			if (oFF.isNull(versionStructure))
		{
			return false;
		}
		let schema = oFF.PrUtils.getStringValueProperty(versionStructure, "schema", null);
		if (oFF.isNull(schema))
		{
			return false;
		}
		if (!oFF.XString.isEqual(oFF.PrUtils.getStringValueProperty(versionStructure, "model", null), model.getPlanningModelName()))
		{
			return false;
		}
		let versionIdElement = oFF.PrUtils.getIntegerProperty(versionStructure, "version_id");
		if (oFF.isNull(versionIdElement))
		{
			return false;
		}
		let activeBoolean = oFF.PrUtils.getBooleanProperty(versionStructure, "active");
		if (oFF.isNull(activeBoolean))
		{
			return false;
		}
		let versionState = oFF.PlanningVersionState.lookup(oFF.PrUtils.getStringValueProperty(versionStructure, "state", null));
		if (oFF.isNull(versionState))
		{
			return false;
		}
		let isActive = activeBoolean.getBoolean();
		if (isActive !== versionState.isActive())
		{
			return false;
		}
		let totalChangesSize = oFF.PrUtils.getIntegerValueProperty(versionStructure, "changes", 0);
		let undoChangesSize = oFF.PrUtils.getIntegerValueProperty(versionStructure, "undo_changes", 0);
		let sharedVersion = false;
		let versionOwner = oFF.PrUtils.getStringValueProperty(versionStructure, "owner", null);
		let privilege = oFF.PlanningPrivilege.lookupWithDefault(oFF.PrUtils.getStringValueProperty(versionStructure, "privilege", null), null);
		if (oFF.isNull(privilege))
		{
			if (model.isWithSharedVersions())
			{
				return false;
			}
			versionOwner = null;
			privilege = oFF.PlanningPrivilege.OWNER;
		}
		else
		{
			if (privilege === oFF.PlanningPrivilege.OWNER)
			{
				versionOwner = null;
			}
			else
			{
				sharedVersion = true;
			}
		}
		if (sharedVersion === (privilege === oFF.PlanningPrivilege.OWNER))
		{
			return false;
		}
		let versionId = versionIdElement.getInteger();
		let versionDescription = oFF.PrUtils.getStringValueProperty(versionStructure, "description", null);
		let planningVersionIdentifier = model.getVersionIdentifier(versionId, sharedVersion, versionOwner);
		let planningVersion = model.getVersionById(planningVersionIdentifier, versionDescription);
		planningVersion.setPrivilege(privilege);
		planningVersion.setVersionState(versionState);
		planningVersion.setTotalChangesSize(totalChangesSize);
		planningVersion.setUndoChangesSize(undoChangesSize);
		let versionCreationTime = oFF.PrUtils.getStringProperty(versionStructure, "create_time");
		if (oFF.notNull(versionCreationTime))
		{
			let creationTime = oFF.XDateTime.createDateTimeFromIsoFormat(versionCreationTime.getString());
			planningVersion.setCreationTime(creationTime);
		}
		let versionBackupTime = oFF.PrUtils.getStringProperty(versionStructure, "backup_time");
		if (oFF.notNull(versionBackupTime))
		{
			let backupTime = oFF.XDateTime.createDateTimeFromIsoFormat(versionBackupTime.getString());
			planningVersion.setBackupTime(backupTime);
		}
		oFF.InAPlanningHelper.resetVersionParameters(versionStructure, planningVersion);
		if (!planningVersionIdentifier.isSharedVersion())
		{
			let querySourceList = oFF.PrUtils.getListProperty(versionStructure, "query_sources");
			let len = oFF.PrUtils.getListSize(querySourceList, 0);
			for (let querySourceIndex = 0; querySourceIndex < len; querySourceIndex++)
			{
				let querySourceStructure = oFF.PrUtils.getStructureElement(querySourceList, querySourceIndex);
				let dataSource = oFF.PlanningModelResponseUpdateVersionPrivileges.getVersionDataSource(querySourceStructure);
				let versionPrivilegeList = oFF.PrUtils.getListProperty(querySourceStructure, "version_privileges");
				oFF.PlanningModelResponseUpdateVersionPrivileges.updateVersionPrivileges(model, dataSource, planningVersionIdentifier, versionPrivilegeList);
			}
		}
		oFF.InAPlanningHelper.resetActionState(versionStructure, planningVersion);
		return true;
	},
	resetActionState:function(versionStructure, planningVersion)
	{
			let sequenceActive = false;
		let sequenceDescription = null;
		let sequenceCreateTime = null;
		let actionActive = false;
		let actionStartTime = null;
		let actionEndTime = null;
		let userName = null;
		let actionStateStructure = oFF.PrUtils.getStructureProperty(versionStructure, "action_state");
		if (oFF.notNull(actionStateStructure))
		{
			sequenceActive = oFF.PrUtils.getBooleanValueProperty(actionStateStructure, "sequence_active", false);
			if (sequenceActive)
			{
				sequenceDescription = oFF.PrUtils.getStringValueProperty(actionStateStructure, "sequence_description", null);
				if (oFF.isNull(sequenceDescription))
				{
					sequenceDescription = oFF.PrUtils.getStringValueProperty(actionStateStructure, "description", null);
				}
				sequenceCreateTime = oFF.PrUtils.getDateTimeProperty(actionStateStructure, "sequence_create_time", false, null);
				actionEndTime = oFF.PrUtils.getDateTimeProperty(actionStateStructure, "action_end_time", false, null);
				userName = oFF.PrUtils.getStringValueProperty(actionStateStructure, "user_name", null);
			}
			actionActive = oFF.PrUtils.getBooleanValueProperty(actionStateStructure, "action_active", false);
			if (actionActive)
			{
				actionStartTime = oFF.PrUtils.getDateTimeProperty(actionStateStructure, "action_start_time", false, null);
			}
		}
		planningVersion.setActionSequenceActive(sequenceActive);
		planningVersion.setActionSequenceDescription(sequenceDescription);
		planningVersion.setActionSequenceCreateTime(sequenceCreateTime);
		planningVersion.setActionActive(actionActive);
		planningVersion.setActionStartTime(actionStartTime);
		planningVersion.setActionEndTime(actionEndTime);
		planningVersion.setUserName(userName);
	},
	resetVersionParameters:function(commandResponse, version)
	{
			let versionParameters = oFF.PrFactory.createStructure();
		let parametersList = oFF.PrUtils.getListProperty(commandResponse, "parameters");
		if (oFF.notNull(parametersList))
		{
			for (let i = 0; i < parametersList.size(); i++)
			{
				let parameterStructure = oFF.PrUtils.getStructureElement(parametersList, i);
				if (oFF.isNull(parameterStructure))
				{
					continue;
				}
				if (!oFF.PrUtils.getBooleanValueProperty(parameterStructure, "hasValue", false))
				{
					continue;
				}
				let nameString = oFF.PrUtils.getStringProperty(parameterStructure, "name");
				if (oFF.isNull(nameString))
				{
					continue;
				}
				let valueElement = oFF.PrUtils.getProperty(parameterStructure, "value");
				versionParameters.put(nameString.getString(), valueElement);
			}
		}
		version.setParametersStructureInternal(versionParameters);
	},
	setVersionState:function(versionStateResponse, version)
	{
			let stateString = oFF.PrUtils.getStringValueProperty(versionStateResponse, "state", null);
		let planningVersionState = oFF.PlanningVersionState.lookup(stateString);
		if (oFF.isNull(planningVersionState))
		{
			return false;
		}
		let totalChangesSize = oFF.PrUtils.getIntegerValueProperty(versionStateResponse, "changes", 0);
		let undoChangesSize = oFF.PrUtils.getIntegerValueProperty(versionStateResponse, "undo_changes", 0);
		version.setVersionState(planningVersionState);
		version.setTotalChangesSize(totalChangesSize);
		version.setUndoChangesSize(undoChangesSize);
		let versionCreationTime = oFF.PrUtils.getStringProperty(versionStateResponse, "create_time");
		if (oFF.notNull(versionCreationTime))
		{
			let creationTime = oFF.XDateTime.createDateTimeFromIsoFormat(versionCreationTime.getString());
			version.setCreationTime(creationTime);
		}
		let versionBackupTime = oFF.PrUtils.getStringProperty(versionStateResponse, "backup_time");
		if (oFF.notNull(versionBackupTime))
		{
			let backupTime = oFF.XDateTime.createDateTimeFromIsoFormat(versionBackupTime.getString());
			version.setBackupTime(backupTime);
		}
		oFF.InAPlanningHelper.resetActionState(versionStateResponse, version);
		return true;
	}
};

oFF.InAPlanningHelperTmp = function() {};
oFF.InAPlanningHelperTmp.prototype = new oFF.XObject();
oFF.InAPlanningHelperTmp.prototype._ff_c = "InAPlanningHelperTmp";

oFF.InAPlanningHelperTmp.staticSetup = function()
{
	oFF.PlanningModelCommandHelper.SetHelper(new oFF.InAPlanningHelperTmp());
};
oFF.InAPlanningHelperTmp.prototype.convertRequestToBatch = function(request)
{
	let newRequestStructure = oFF.PrStructure.create();
	let batchList = newRequestStructure.putNewList(oFF.ConnectionConstants.INA_BATCH);
	let planningStructure = request.getStructureByKey("Planning");
	let commands = planningStructure.getListByKey("commands");
	for (let i = 0; i < commands.size(); i++)
	{
		let batchEntry = batchList.addNewStructure();
		batchEntry.put("Planning", commands.getStructureAt(i));
	}
	return newRequestStructure;
};
oFF.InAPlanningHelperTmp.prototype.convertResponseFromBatch = function(response)
{
	let newResponseStructure = oFF.PrStructure.create();
	let planningList = newResponseStructure.putNewList("Planning");
	let batchList = response.getListByKey(oFF.ConnectionConstants.INA_BATCH);
	for (let i = 0; i < batchList.size(); i++)
	{
		planningList.add(batchList.getStructureAt(i).getStructureByKey("Planning"));
	}
	return newResponseStructure;
};
oFF.InAPlanningHelperTmp.prototype.getCommandResponse = function(commands, responses, commandName)
{
	return oFF.InAPlanningHelper.getCommandResponse(commands, responses, commandName);
};
oFF.InAPlanningHelperTmp.prototype.getResponsesReturnCodeStrict = function(responseStructure, messageManager)
{
	return oFF.InAPlanningHelper.getResponsesReturnCodeStrict(responseStructure, messageManager);
};
oFF.InAPlanningHelperTmp.prototype.processResponseGetVersions = function(commands, responses, model)
{
	return oFF.InAPlanningHelper.processResponseGetVersions(commands, responses, model);
};
oFF.InAPlanningHelperTmp.prototype.resetVersionParameters = function(commandResponse, version)
{
	oFF.InAPlanningHelper.resetVersionParameters(commandResponse, version);
};

oFF.InAPlanningCapabilitiesProviderFactory = function() {};
oFF.InAPlanningCapabilitiesProviderFactory.prototype = new oFF.XObject();
oFF.InAPlanningCapabilitiesProviderFactory.prototype._ff_c = "InAPlanningCapabilitiesProviderFactory";

oFF.InAPlanningCapabilitiesProviderFactory.staticSetup = function()
{
	oFF.PlanningService.s_capabilitiesProviderFactory = new oFF.InAPlanningCapabilitiesProviderFactory();
};
oFF.InAPlanningCapabilitiesProviderFactory.prototype.create = function(session, serverMetadata, providerType)
{
	return oFF.InACapabilitiesProvider.create(session, serverMetadata, providerType, null);
};

oFF.InADataAreaRequestGetPlanningFunctionMetadata = function() {};
oFF.InADataAreaRequestGetPlanningFunctionMetadata.prototype = new oFF.QInAComponentWithStructure();
oFF.InADataAreaRequestGetPlanningFunctionMetadata.prototype._ff_c = "InADataAreaRequestGetPlanningFunctionMetadata";

oFF.InADataAreaRequestGetPlanningFunctionMetadata.prototype.exportComponentWithStructure = function(exporter, modelComponent, inaStructure, flags)
{
	let request = modelComponent;
	let inaRequestStructure = oFF.InADataAreaRequestHelper.createGetMetadataRequestStructure(request);
	let metadata = inaRequestStructure.getStructureByKey("Metadata");
	let dataSource = metadata.getStructureByKey("DataSource");
	dataSource.putString("ObjectName", request.getPlanningFunctionIdentifier().getPlanningFunctionName());
	dataSource.putString("Type", "PlanningFunction");
	return inaRequestStructure;
};
oFF.InADataAreaRequestGetPlanningFunctionMetadata.prototype.getComponentType = function()
{
	return oFF.OlapComponentType.DATA_AREA_GET_FUNCTION_METADATA;
};
oFF.InADataAreaRequestGetPlanningFunctionMetadata.prototype.importComponentWithStructure = function(importer, inaStructure, modelComponent, parentComponent, context)
{
	oFF.InAHelper.importMessages(inaStructure, importer);
	let request = modelComponent;
	let result = request.getResult();
	let command = oFF.PrUtils.getStructureProperty(inaStructure, "Command");
	if (oFF.isNull(command))
	{
		return null;
	}
	let dataSource = oFF.PrUtils.getStructureProperty(command, "DataSource");
	let dataAreaName = oFF.PrUtils.getStringValueProperty(dataSource, "DataArea", "DEFAULT");
	let dataArea = request.getDataArea();
	if (!oFF.XString.isEqual(dataArea.getDataArea(), dataAreaName))
	{
		return null;
	}
	let instanceIdRequest = request.getInstanceId();
	if (oFF.isNull(instanceIdRequest))
	{
		return null;
	}
	let objectName = oFF.PrUtils.getStringValueProperty(dataSource, "ObjectName", null);
	let planningFunctionIdentifier = request.getPlanningFunctionIdentifier();
	if (!oFF.XString.isEqual(objectName, planningFunctionIdentifier.getPlanningFunctionName()))
	{
		return null;
	}
	let type = oFF.PrUtils.getStringValueProperty(dataSource, "Type", null);
	if (!oFF.XString.isEqual(type, "PlanningFunction"))
	{
		return null;
	}
	let dimensions = oFF.PrUtils.getListProperty(command, "Dimensions");
	let variables = oFF.PrUtils.getListProperty(command, "Variables");
	let baseDatasource = oFF.InADataAreaRequestHelper.extractBaseDataSource(command);
	let metadata = new oFF.PlanningFunctionMetadata();
	metadata.setPlanningOperationIdentifier(planningFunctionIdentifier);
	metadata.setDataArea(dataArea);
	metadata.setInstanceId(instanceIdRequest);
	metadata.setDimenstions(dimensions);
	metadata.setVariables(variables);
	metadata.setBaseDataSource(baseDatasource);
	result.setPlanningOperationMetadata(metadata);
	return modelComponent;
};

oFF.InADataAreaRequestGetPlanningSequenceMetadata = function() {};
oFF.InADataAreaRequestGetPlanningSequenceMetadata.prototype = new oFF.QInAComponentWithStructure();
oFF.InADataAreaRequestGetPlanningSequenceMetadata.prototype._ff_c = "InADataAreaRequestGetPlanningSequenceMetadata";

oFF.InADataAreaRequestGetPlanningSequenceMetadata.extractStepMetadataList = function(command)
{
	let steps = oFF.PrUtils.getListProperty(command, "Steps");
	if (oFF.isNull(steps))
	{
		return null;
	}
	let result = oFF.XList.create();
	for (let i = 0; i < steps.size(); i++)
	{
		let step = oFF.PrUtils.getStructureElement(steps, i);
		if (oFF.isNull(step))
		{
			continue;
		}
		let number = oFF.PrUtils.getIntegerValueProperty(step, "StepNumber", 0);
		let type = oFF.PlanningSequenceStepType.lookup(oFF.PrUtils.getStringValueProperty(step, "StepType", null));
		let baseDataSource = oFF.InADataAreaRequestHelper.extractBaseDataSource(step);
		let filterName = oFF.PrUtils.getStringValueProperty(step, "FilterName", null);
		let planningFunctionName = oFF.PrUtils.getStringValueProperty(step, "PlanningFunctionName", null);
		let queryName = oFF.PrUtils.getStringValueProperty(step, "QueryName", null);
		let planningFunctionDescription = oFF.PrUtils.getStringValueProperty(step, "Description", null);
		let commandType = oFF.PrUtils.getStringValueProperty(step, "CommandType", null);
		let stepMetadata = new oFF.PlanningSequenceStepMetadata();
		stepMetadata.setNumber(number);
		stepMetadata.setType(type);
		stepMetadata.setBaseDataSource(baseDataSource);
		stepMetadata.setFilterName(filterName);
		stepMetadata.setPlanningFunctionName(planningFunctionName);
		stepMetadata.setQueryName(queryName);
		stepMetadata.setPlanningFunctionDescription(planningFunctionDescription);
		stepMetadata.setCommendType(commandType);
		result.add(stepMetadata);
	}
	return result;
};
oFF.InADataAreaRequestGetPlanningSequenceMetadata.prototype.exportComponentWithStructure = function(exporter, modelComponent, inaStructure, flags)
{
	let request = modelComponent;
	let inaRequestStructure = oFF.InADataAreaRequestHelper.createGetMetadataRequestStructure(request);
	let metadata = inaRequestStructure.getStructureByKey("Metadata");
	let dataSource = metadata.getStructureByKey("DataSource");
	dataSource.putString("ObjectName", request.getPlanningSequenceIdentifier().getPlanningSequenceName());
	dataSource.putString("Type", "PlanningSequence");
	return inaRequestStructure;
};
oFF.InADataAreaRequestGetPlanningSequenceMetadata.prototype.getComponentType = function()
{
	return oFF.OlapComponentType.DATA_AREA_GET_SEQUENCE_METADATA;
};
oFF.InADataAreaRequestGetPlanningSequenceMetadata.prototype.importComponentWithStructure = function(importer, inaStructure, modelComponent, parentComponent, context)
{
	oFF.InAHelper.importMessages(inaStructure, importer);
	let request = modelComponent;
	let result = request.getResult();
	let command = oFF.PrUtils.getStructureProperty(inaStructure, "Command");
	if (oFF.isNull(command))
	{
		return null;
	}
	let dataSource = oFF.PrUtils.getStructureProperty(command, "DataSource");
	let dataAreaName = oFF.PrUtils.getStringValueProperty(dataSource, "DataArea", "DEFAULT");
	let dataArea = request.getDataArea();
	if (!oFF.XString.isEqual(dataArea.getDataArea(), dataAreaName))
	{
		return null;
	}
	let instanceIdRequest = request.getInstanceId();
	if (oFF.isNull(instanceIdRequest))
	{
		return null;
	}
	let instanceId = oFF.PrUtils.getStringValueProperty(dataSource, "InstanceId", null);
	if (oFF.isNull(instanceId))
	{
		instanceId = instanceIdRequest;
	}
	else
	{
		if (!oFF.XString.isEqual(instanceId, instanceIdRequest))
		{
			return null;
		}
	}
	let objectName = oFF.PrUtils.getStringValueProperty(dataSource, "ObjectName", null);
	let planningSequenceIdentifier = request.getPlanningSequenceIdentifier();
	if (!oFF.XString.isEqual(objectName, planningSequenceIdentifier.getPlanningSequenceName()))
	{
		return null;
	}
	let type = oFF.PrUtils.getStringValueProperty(dataSource, "Type", null);
	if (!oFF.XString.isEqual(type, "PlanningSequence"))
	{
		return null;
	}
	let dimensions = oFF.PrUtils.getListProperty(command, "Dimensions");
	let variables = oFF.PrUtils.getListProperty(command, "Variables");
	let stepMetadataList = oFF.InADataAreaRequestGetPlanningSequenceMetadata.extractStepMetadataList(command);
	let metadata = new oFF.PlanningSequenceMetadata();
	metadata.setPlanningOperationIdentifier(planningSequenceIdentifier);
	metadata.setDataArea(dataArea);
	metadata.setInstanceId(instanceId);
	metadata.setDimenstions(dimensions);
	metadata.setVariables(variables);
	metadata.setStepMetadataList(stepMetadataList);
	result.setPlanningOperationMetadata(metadata);
	return modelComponent;
};

oFF.InADataAreaCommand = function() {};
oFF.InADataAreaCommand.prototype = new oFF.QInAComponentWithStructure();
oFF.InADataAreaCommand.prototype._ff_c = "InADataAreaCommand";

oFF.InADataAreaCommand.prototype.exportComponentWithStructure = function(exporter, modelComponent, inaStructure, flags)
{
	let command = modelComponent;
	let requestStructure = oFF.PrFactory.createStructure();
	let dataAreaState = oFF.DataAreaState.getDataAreaState(command.getDataArea());
	if (!dataAreaState.isSubmitted())
	{
		let dataAreaStructure = dataAreaState.serializeToJson();
		requestStructure.putNewList("DataAreas").add(dataAreaStructure);
	}
	let planningStructure = requestStructure.putNewStructure("Planning");
	command.getPlanningService().getInaCapabilities().exportActiveCapabilities(planningStructure);
	let commandsList = planningStructure.putNewList("Commands");
	let planningContextCommandType = command.getPlanningContextCommandType();
	let objectName = planningContextCommandType.toString();
	if (planningContextCommandType === oFF.PlanningContextCommandType.PUBLISH)
	{
		objectName = "SAVE";
	}
	let planningContextDataArea = command.getDataArea();
	let dataArea = planningContextDataArea.getDataArea();
	if (oFF.isNull(dataArea))
	{
		dataArea = "DEFAULT";
	}
	let commandStructure = commandsList.addNewStructure();
	let dataSource = commandStructure.putNewStructure("DataSource");
	dataSource.putString("ObjectName", objectName);
	dataSource.putString("Type", "DataAreaCommand");
	dataSource.putString("DataArea", dataArea);
	return requestStructure;
};
oFF.InADataAreaCommand.prototype.getComponentType = function()
{
	return oFF.OlapComponentType.DATA_AREA_COMMAND;
};
oFF.InADataAreaCommand.prototype.importComponentWithStructure = function(importer, inaStructure, modelComponent, parentComponent, context)
{
	oFF.InAHelper.importMessages(inaStructure, importer);
	if (importer.hasErrors())
	{
		return null;
	}
	let command = modelComponent;
	let result = command.getResult();
	let commandResultsList = oFF.PrUtils.getListProperty(inaStructure, "CommandResults");
	if (oFF.isNull(commandResultsList) || commandResultsList.size() !== 1)
	{
		return null;
	}
	let commandResultStructure = oFF.PrUtils.getStructureElement(commandResultsList, 0);
	result.setExecuted(oFF.PrUtils.getBooleanProperty(commandResultStructure, "Executed").getBoolean());
	return command;
};

oFF.InADataAreaCommandClose = function() {};
oFF.InADataAreaCommandClose.prototype = new oFF.QInAComponentWithStructure();
oFF.InADataAreaCommandClose.prototype._ff_c = "InADataAreaCommandClose";

oFF.InADataAreaCommandClose.prototype.exportComponentWithStructure = function(exporter, modelComponent, inaStructure, flags)
{
	let command = modelComponent;
	let dataAreaName = command.getDataArea().getDataArea();
	let requestStructure = oFF.PrFactory.createStructure();
	let planningStructure = requestStructure.putNewStructure("Analytics");
	let actionsList = planningStructure.putNewList("Actions");
	let actionStructure = actionsList.addNewStructure();
	actionStructure.putString("Type", "Close");
	let dataAreasList = actionStructure.putNewList("DataAreas");
	dataAreasList.addString(dataAreaName);
	return requestStructure;
};
oFF.InADataAreaCommandClose.prototype.getComponentType = function()
{
	return oFF.OlapComponentType.DATA_AREA_COMMAND_CLOSE;
};
oFF.InADataAreaCommandClose.prototype.importComponentWithStructure = function(importer, inaStructure, modelComponent, parentComponent, context)
{
	oFF.InAHelper.importMessages(inaStructure, importer);
	if (importer.hasErrors())
	{
		return null;
	}
	let command = modelComponent;
	let result = command.getResult();
	let dataArea = command.getDataArea();
	let queryConsumerServices = oFF.DataAreaUtil.getQueryConsumerServices(dataArea);
	if (oFF.notNull(queryConsumerServices))
	{
		for (let i = 0; i < queryConsumerServices.size(); i++)
		{
			let queryConsumerService = queryConsumerServices.get(i);
			oFF.XObjectExt.release(queryConsumerService);
		}
	}
	oFF.DataAreaState.removeDataAreaState(dataArea);
	let planningService = dataArea.getPlanningService();
	oFF.XObjectExt.release(planningService);
	result.setExecuted(true);
	return modelComponent;
};

oFF.InALightweightDataAreaCommand = function() {};
oFF.InALightweightDataAreaCommand.prototype = new oFF.QInAComponentWithStructure();
oFF.InALightweightDataAreaCommand.prototype._ff_c = "InALightweightDataAreaCommand";

oFF.InALightweightDataAreaCommand.prototype.exportComponentWithStructure = function(exporter, modelComponent, inaStructure, flags)
{
	let command = modelComponent;
	let requestStructure = oFF.PrFactory.createStructure();
	let planningStructure = requestStructure.putNewStructure("Planning");
	modelComponent.getQueryManager().getInaCapabilities().exportActiveCapabilities(planningStructure);
	let commandsList = planningStructure.putNewList("Commands");
	let planningContextCommandType = command.getPlanningContextCommandType();
	let objectName = planningContextCommandType.toString();
	let dataArea = command.getQueryModel().getDataArea();
	if (oFF.isNull(dataArea))
	{
		dataArea = "DEFAULT";
	}
	let commandStructure = commandsList.addNewStructure();
	let dataSource = commandStructure.putNewStructure("DataSource");
	dataSource.putString("ObjectName", objectName);
	dataSource.putString("Type", "DataAreaCommand");
	dataSource.putString("DataArea", dataArea);
	dataSource.putString("InstanceId", command.getQueryManager().getInstanceId());
	return requestStructure;
};
oFF.InALightweightDataAreaCommand.prototype.getComponentType = function()
{
	return oFF.OlapComponentType.LIGHTWEIGHT_DATA_AREA_COMMAND;
};
oFF.InALightweightDataAreaCommand.prototype.importComponentWithStructure = function(importer, inaStructure, modelComponent, parentComponent, context)
{
	oFF.InAHelper.importMessages(inaStructure, importer);
	if (importer.hasErrors())
	{
		return null;
	}
	let command = modelComponent;
	let result = command.getResult();
	let commandResultsList = oFF.PrUtils.getListProperty(inaStructure, "CommandResults");
	if (oFF.isNull(commandResultsList) || commandResultsList.size() !== 1)
	{
		return null;
	}
	let commandResultStructure = oFF.PrUtils.getStructureElement(commandResultsList, 0);
	result.setExecuted(oFF.PrUtils.getBooleanProperty(commandResultStructure, "Executed").getBoolean());
	return result;
};

oFF.InaPlanningModel = function() {};
oFF.InaPlanningModel.prototype = new oFF.QInAComponentWithStructure();
oFF.InaPlanningModel.prototype._ff_c = "InaPlanningModel";

oFF.InaPlanningModel.prototype.exportComponentWithStructure = function(exporter, modelComponent, inaStructure, flags)
{
	return null;
};
oFF.InaPlanningModel.prototype.getComponentType = function()
{
	return oFF.OlapComponentType.PLANNING_MODEL;
};
oFF.InaPlanningModel.prototype.importComponentWithStructure = function(importer, inaStructure, modelComponent, parentComponent, context)
{
	return null;
};

oFF.InAPlanningModelRequestCleanup = function() {};
oFF.InAPlanningModelRequestCleanup.prototype = new oFF.QInAComponentWithStructure();
oFF.InAPlanningModelRequestCleanup.prototype._ff_c = "InAPlanningModelRequestCleanup";

oFF.InAPlanningModelRequestCleanup.createCleanupCommand = function()
{
	let command = oFF.PrFactory.createStructure();
	command.putString("command", "cleanup");
	return command;
};
oFF.InAPlanningModelRequestCleanup.prototype.exportComponentWithStructure = function(exporter, modelComponent, inaStructure, flags)
{
	let request = modelComponent;
	let inaRequestStructure = oFF.PrFactory.createStructure();
	let commands = oFF.InAPlanningHelper.createCommandsList(inaRequestStructure);
	commands.add(oFF.InAPlanningModelRequestCleanup.createCleanupCommand());
	commands.add(oFF.InAPlanningHelper.createModelCommand(request.getPlanningModel(), "get_versions"));
	return inaRequestStructure;
};
oFF.InAPlanningModelRequestCleanup.prototype.getComponentType = function()
{
	return oFF.OlapComponentType.PLANNING_MODEL_CLEANUP_COMMAND;
};
oFF.InAPlanningModelRequestCleanup.prototype.importComponentWithStructure = function(importer, inaStructure, modelComponent, parentComponent, context)
{
	let request = modelComponent;
	if (oFF.InAPlanningHelper.hasErrors(importer, request, inaStructure))
	{
		return null;
	}
	let commands = oFF.InAPlanningHelper.getCommandsList(request.serializeToElement(oFF.QModelFormat.INA_DATA).asStructure());
	let responses = oFF.InAPlanningHelper.getResponsesList(inaStructure);
	if (!oFF.InAPlanningHelper.processResponseGetVersions(commands, responses, request.getPlanningModel()))
	{
		importer.addErrorExt(oFF.OriginLayer.DRIVER, oFF.ErrorCodes.PARSER_ERROR, "error in processing response structure", inaStructure);
		return null;
	}
	return modelComponent;
};

oFF.InAPlanningModelRequestRefreshActions = function() {};
oFF.InAPlanningModelRequestRefreshActions.prototype = new oFF.QInAComponentWithStructure();
oFF.InAPlanningModelRequestRefreshActions.prototype._ff_c = "InAPlanningModelRequestRefreshActions";

oFF.InAPlanningModelRequestRefreshActions.prototype.exportComponentWithStructure = function(exporter, modelComponent, inaStructure, flags)
{
	let request = modelComponent;
	let inaRequestStructure = oFF.PrFactory.createStructure();
	let commands = oFF.InAPlanningHelper.createCommandsList(inaRequestStructure);
	let model = request.getPlanningModel();
	commands.add(oFF.InAPlanningHelper.createModelCommand(model, "get_actions"));
	commands.add(oFF.InAPlanningHelper.createModelCommand(model, "get_action_parameters"));
	return inaRequestStructure;
};
oFF.InAPlanningModelRequestRefreshActions.prototype.getComponentType = function()
{
	return oFF.OlapComponentType.PLANNING_MODEL_REFRESH_ACTIONS_COMMAND;
};
oFF.InAPlanningModelRequestRefreshActions.prototype.importComponentWithStructure = function(importer, inaStructure, modelComponent, parentComponent, context)
{
	let request = modelComponent;
	if (oFF.InAPlanningHelper.hasErrors(importer, request, inaStructure))
	{
		return null;
	}
	let commands = oFF.InAPlanningHelper.getCommandsList(request.serializeToElement(oFF.QModelFormat.INA_DATA).asStructure());
	let responses = oFF.InAPlanningHelper.getResponsesList(inaStructure);
	if (!oFF.InAPlanningHelper.processResponseGetActions(commands, responses, request.getPlanningModel()))
	{
		importer.addErrorExt(oFF.OriginLayer.DRIVER, oFF.ErrorCodes.PARSER_ERROR, "error in processing response structure", inaStructure);
		return null;
	}
	return modelComponent;
};

oFF.InAPlanningModelRequestRefreshVersions = function() {};
oFF.InAPlanningModelRequestRefreshVersions.prototype = new oFF.QInAComponentWithStructure();
oFF.InAPlanningModelRequestRefreshVersions.prototype._ff_c = "InAPlanningModelRequestRefreshVersions";

oFF.InAPlanningModelRequestRefreshVersions.prototype.exportComponentWithStructure = function(exporter, modelComponent, inaStructure, flags)
{
	let request = modelComponent;
	let inaRequestStructure = oFF.PrFactory.createStructure();
	let commands = oFF.InAPlanningHelper.createCommandsList(inaRequestStructure);
	commands.add(oFF.InAPlanningHelper.createModelCommand(request.getPlanningModel(), "get_versions"));
	return inaRequestStructure;
};
oFF.InAPlanningModelRequestRefreshVersions.prototype.getComponentType = function()
{
	return oFF.OlapComponentType.PLANNING_MODEL_REFRESH_VERSIONS_COMMAND;
};
oFF.InAPlanningModelRequestRefreshVersions.prototype.importComponentWithStructure = function(importer, inaStructure, modelComponent, parentComponent, context)
{
	let request = modelComponent;
	if (oFF.InAPlanningHelper.hasErrors(importer, request, inaStructure))
	{
		return null;
	}
	let commands = oFF.InAPlanningHelper.getCommandsList(request.serializeToElement(oFF.QModelFormat.INA_DATA).asStructure());
	let responses = oFF.InAPlanningHelper.getResponsesList(inaStructure);
	if (!oFF.InAPlanningHelper.processResponseGetVersions(commands, responses, request.getPlanningModel()))
	{
		importer.addErrorExt(oFF.OriginLayer.DRIVER, oFF.ErrorCodes.PARSER_ERROR, "error in processing response structure", inaStructure);
		return null;
	}
	return modelComponent;
};

oFF.InAPlanningModelRequestUpdateVersionPrivileges = function() {};
oFF.InAPlanningModelRequestUpdateVersionPrivileges.prototype = new oFF.QInAComponentWithStructure();
oFF.InAPlanningModelRequestUpdateVersionPrivileges.prototype._ff_c = "InAPlanningModelRequestUpdateVersionPrivileges";

oFF.InAPlanningModelRequestUpdateVersionPrivileges.addPrivilegeCommand = function(commandsList, versionPrivilege)
{
	let privilegeState = versionPrivilege.getPrivilegeState();
	if (privilegeState !== oFF.PlanningPrivilegeState.TO_BE_GRANTED && privilegeState !== oFF.PlanningPrivilegeState.TO_BE_REVOKED)
	{
		return;
	}
	let commandValue;
	if (privilegeState === oFF.PlanningPrivilegeState.TO_BE_GRANTED)
	{
		commandValue = "grant_version_privilege";
	}
	else if (privilegeState === oFF.PlanningPrivilegeState.TO_BE_REVOKED)
	{
		commandValue = "revoke_version_privilege";
	}
	else
	{
		throw oFF.XException.createIllegalStateException("illegal privilege command");
	}
	let commandStructure = commandsList.addNewStructure();
	commandStructure.putString("command", commandValue);
	let planningModel = versionPrivilege.getPlanningModel();
	commandStructure.putString("schema", planningModel.getPlanningModelSchema());
	commandStructure.putString("model", planningModel.getPlanningModelName());
	let dataSource = versionPrivilege.getQueryDataSource();
	commandStructure.putString("query_source_schema", dataSource.getSchemaName());
	commandStructure.putString("query_source", dataSource.getObjectName());
	commandStructure.putInteger("version_id", versionPrivilege.getVersionId());
	if (versionPrivilege.isSharedVersion())
	{
		commandStructure.putString("owner", versionPrivilege.getVersionOwner());
	}
	commandStructure.putString("privilege", versionPrivilege.getPrivilege().getName());
	commandStructure.putString("grantee", versionPrivilege.getGrantee());
};
oFF.InAPlanningModelRequestUpdateVersionPrivileges.addShowVersionPrivilegesCommand = function(commandsList, planningModel, dataSource, version)
{
	let commandStructure = commandsList.addNewStructure();
	commandStructure.putString("command", "show_version_privileges");
	commandStructure.putString("schema", planningModel.getPlanningModelSchema());
	commandStructure.putString("model", planningModel.getPlanningModelName());
	commandStructure.putString("query_source_schema", dataSource.getSchemaName());
	commandStructure.putString("query_source", dataSource.getObjectName());
	commandStructure.putInteger("version_id", version.getVersionId());
	if (version.isSharedVersion())
	{
		commandStructure.putString("owner", version.getVersionOwner());
	}
};
oFF.InAPlanningModelRequestUpdateVersionPrivileges.addShowVersionPrivilegesCommands = function(commandsList, planningModel)
{
	let queryDataSources = planningModel.getQueryDataSources();
	let versions = planningModel.getVersions();
	for (let i = 0; i < queryDataSources.size(); i++)
	{
		let queryDataSource = queryDataSources.get(i).getDataSource();
		for (let j = 0; j < versions.size(); j++)
		{
			let version = versions.get(j);
			oFF.InAPlanningModelRequestUpdateVersionPrivileges.addShowVersionPrivilegesCommand(commandsList, planningModel, queryDataSource, version);
		}
	}
};
oFF.InAPlanningModelRequestUpdateVersionPrivileges.prototype.exportComponentWithStructure = function(exporter, modelComponent, inaStructure, flags)
{
	let request = modelComponent;
	let inaRequestStructure = oFF.PrFactory.createStructure();
	let planningStructure = inaRequestStructure.putNewStructure("Planning");
	let commandsList = planningStructure.putNewList("commands");
	let planningModel = request.getPlanningModel();
	if (planningModel.isVersionPrivilegesInitialized())
	{
		let versionPrivileges = planningModel.getVersionPrivileges();
		if (oFF.notNull(versionPrivileges))
		{
			for (let i = 0; i < versionPrivileges.size(); i++)
			{
				oFF.InAPlanningModelRequestUpdateVersionPrivileges.addPrivilegeCommand(commandsList, versionPrivileges.get(i));
			}
		}
	}
	oFF.InAPlanningModelRequestUpdateVersionPrivileges.addShowVersionPrivilegesCommands(commandsList, planningModel);
	return inaRequestStructure;
};
oFF.InAPlanningModelRequestUpdateVersionPrivileges.prototype.getComponentType = function()
{
	return oFF.OlapComponentType.PLANNING_MODEL_UPDATE_VERSION_PRIVILEGES_COMMAND;
};
oFF.InAPlanningModelRequestUpdateVersionPrivileges.prototype.importComponentWithStructure = function(importer, inaStructure, modelComponent, parentComponent, context)
{
	let request = modelComponent;
	if (oFF.InAPlanningHelper.hasErrors(importer, request, inaStructure))
	{
		return null;
	}
	let model = request.getPlanningModel();
	model.setVersionPrivilegesInitialized();
	let commands = oFF.InAPlanningHelper.getCommandsList(request.serializeToElement(oFF.QModelFormat.INA_DATA).asStructure());
	let responses = oFF.InAPlanningHelper.getResponsesList(inaStructure);
	if (oFF.isNull(commands) && oFF.isNull(responses))
	{
		return modelComponent;
	}
	if (oFF.isNull(commands) || oFF.isNull(responses) || commands.size() !== responses.size())
	{
		importer.addErrorExt(oFF.OriginLayer.DRIVER, oFF.ErrorCodes.PARSER_ERROR, "unexpected command response", inaStructure);
		return null;
	}
	oFF.PlanningModelResponseUpdateVersionPrivileges.resetVersionPrivilegesServerState(model);
	for (let i = 0; i < commands.size(); i++)
	{
		let command = oFF.PrUtils.getStructureElement(commands, i);
		let commandValue = oFF.PrUtils.getStringValueProperty(command, "command", null);
		if (!oFF.XString.isEqual(commandValue, "show_version_privileges"))
		{
			continue;
		}
		let response = oFF.PrUtils.getStructureElement(responses, i);
		let versionPrivilegeList = oFF.PrUtils.getListProperty(response, "version_privileges");
		if (oFF.isNull(versionPrivilegeList))
		{
			continue;
		}
		let dataSource = oFF.PlanningModelResponseUpdateVersionPrivileges.getVersionDataSource(command);
		let versionId = oFF.PrUtils.getIntegerValueProperty(command, "version_id", -1);
		let sharedVersion = false;
		let versionOwner = null;
		let owner = oFF.PrUtils.getStringProperty(command, "owner");
		if (oFF.notNull(owner))
		{
			sharedVersion = true;
			versionOwner = owner.getString();
		}
		let planningVersionIdentifier = model.getVersionIdentifier(versionId, sharedVersion, versionOwner);
		oFF.PlanningModelResponseUpdateVersionPrivileges.updateVersionPrivileges(model, dataSource, planningVersionIdentifier, versionPrivilegeList);
	}
	oFF.PlanningModelResponseUpdateVersionPrivileges.resetVersionPrivilegesClientState(model);
	return modelComponent;
};

oFF.InAPlanningModelRequestVersion = function() {};
oFF.InAPlanningModelRequestVersion.prototype = new oFF.QInAComponentWithStructure();
oFF.InAPlanningModelRequestVersion.prototype._ff_c = "InAPlanningModelRequestVersion";

oFF.InAPlanningModelRequestVersion.createCommandsList = function(rootStructure)
{
	let planning = rootStructure.putNewStructure("Planning");
	return planning.putNewList("commands");
};
oFF.InAPlanningModelRequestVersion.createGetParametersCommand = function(request)
{
	let requestType = request.getRequestType();
	if (requestType !== oFF.PlanningModelRequestType.INIT_VERSION && requestType !== oFF.PlanningModelRequestType.RESET_VERSION && requestType !== oFF.PlanningModelRequestType.UPDATE_PARAMETERS)
	{
		return null;
	}
	if (!request.getPlanningModel().supportsVersionParameters())
	{
		return null;
	}
	let version = request.getPlanningVersion();
	if (version.isSharedVersion())
	{
		return null;
	}
	return oFF.InAPlanningModelRequestVersion.createVersionCommand(version, "get_parameters");
};
oFF.InAPlanningModelRequestVersion.createVersionCommand = function(version, commandName)
{
	let model = version.getPlanningModel();
	let command = oFF.PrFactory.createStructure();
	command.putString("command", commandName);
	command.putString("schema", model.getPlanningModelSchema());
	command.putString("model", model.getPlanningModelName());
	command.putInteger("version_id", version.getVersionId());
	if (version.isSharedVersion())
	{
		command.putString("owner", version.getVersionOwner());
	}
	if (oFF.XString.isEqual("get_version_state", commandName))
	{
		let modeListGetVersionState = command.putNewList("mode");
		modeListGetVersionState.addString("LIST_BACKUP_TIMESTAMP");
		modeListGetVersionState.addString("LIST_ACTION_STATE");
	}
	else if (oFF.XString.isEqual("get_parameters", commandName))
	{
		command.putString("mode", "LIST_PERSISTENT");
	}
	else if (oFF.XString.isEqual("init", commandName))
	{
		let persistenceType = version.getPlanningModel().getPersistenceType();
		if (oFF.notNull(persistenceType) && persistenceType !== oFF.PlanningPersistenceType.DEFAULT)
		{
			command.putString("persistent_pdcs", persistenceType.getName());
		}
	}
	else if (oFF.XString.isEqual("close", commandName))
	{
		command.putString("mode", oFF.CloseModeType.BACKUP.getName());
	}
	return command;
};
oFF.InAPlanningModelRequestVersion.processResponseEndActionSequence = function(commands, responses, version)
{
	let commandResponse = oFF.InAPlanningHelper.getCommandResponse(commands, responses, oFF.PlanningModelRequestType.END_ACTION_SEQUENCE.getName());
	if (oFF.notNull(commandResponse))
	{
		version.setActionSequenceId(null);
	}
};
oFF.InAPlanningModelRequestVersion.processResponseGetParameters = function(commands, responses, version)
{
	let commandResponse = oFF.InAPlanningHelper.getCommandResponse(commands, responses, "get_parameters");
	if (oFF.notNull(commandResponse))
	{
		oFF.InAPlanningHelper.resetVersionParameters(commandResponse, version);
	}
};
oFF.InAPlanningModelRequestVersion.processResponseKillActionSequence = function(commands, responses, version)
{
	let commandResponse = oFF.InAPlanningHelper.getCommandResponse(commands, responses, oFF.PlanningModelRequestType.KILL_ACTION_SEQUENCE.getName());
	if (oFF.notNull(commandResponse))
	{
		version.setActionSequenceId(null);
	}
};
oFF.InAPlanningModelRequestVersion.prototype.addParametersToJson = function(request, commandStructure) {};
oFF.InAPlanningModelRequestVersion.prototype.exportComponentWithStructure = function(exporter, modelComponent, inaStructure, flags)
{
	let request = modelComponent;
	let inaRequestStructure = oFF.PrStructure.create();
	let commands = oFF.InAPlanningModelRequestVersion.createCommandsList(inaRequestStructure);
	let requestType = request.getRequestType();
	let version = request.getPlanningVersion();
	if (requestType === oFF.PlanningModelRequestType.RESET_VERSION)
	{
		commands.add(oFF.InAPlanningModelRequestVersion.createVersionCommand(version, oFF.PlanningModelRequestType.CLOSE_VERSION.getName()));
		commands.add(oFF.InAPlanningModelRequestVersion.createVersionCommand(version, oFF.PlanningModelRequestType.INIT_VERSION.getName()));
	}
	else if (requestType !== oFF.PlanningModelRequestType.UPDATE_PARAMETERS)
	{
		if (requestType === oFF.PlanningModelRequestType.CLOSE_VERSION)
		{
			let requestCloseVersion = request;
			if (requestCloseVersion.getCloseMode().isWithKillActionSequence())
			{
				commands.add(oFF.InAPlanningModelRequestVersion.createVersionCommand(version, oFF.PlanningModelRequestType.KILL_ACTION_SEQUENCE.getName()));
			}
		}
		let commandStructure = oFF.InAPlanningModelRequestVersion.createVersionCommand(version, requestType.getName());
		this.addParametersToJson(request, commandStructure);
		commands.add(commandStructure);
	}
	oFF.XCollectionUtils.addIfNotNull(commands, oFF.InAPlanningModelRequestVersion.createGetParametersCommand(request));
	if (request.useStateUpdate() && requestType !== oFF.PlanningModelRequestType.DROP_VERSION)
	{
		commands.add(oFF.InAPlanningModelRequestVersion.createVersionCommand(version, "get_version_state"));
	}
	return inaRequestStructure;
};
oFF.InAPlanningModelRequestVersion.prototype.getComponentType = function()
{
	return oFF.OlapComponentType.PLANNING_VERSION_COMMAND;
};
oFF.InAPlanningModelRequestVersion.prototype.importComponentWithStructure = function(importer, inaStructure, modelComponent, parentComponent, context)
{
	let request = modelComponent;
	if (oFF.InAPlanningHelper.hasErrors(importer, request, inaStructure))
	{
		return null;
	}
	if (request.isInvalidatingResultSet())
	{
		request.getPlanningContext().invalidate();
	}
	let version = request.getPlanningVersion();
	let commands = oFF.InAPlanningHelper.getCommandsList(request.serializeToElement(oFF.QModelFormat.INA_DATA).asStructure());
	let responses = oFF.InAPlanningHelper.getResponsesList(inaStructure);
	oFF.InAPlanningModelRequestVersion.processResponseEndActionSequence(commands, responses, version);
	oFF.InAPlanningModelRequestVersion.processResponseKillActionSequence(commands, responses, version);
	oFF.InAPlanningModelRequestVersion.processResponseGetParameters(commands, responses, version);
	if (!oFF.InAPlanningHelper.processResponseGetVersionState(commands, responses, version))
	{
		if (request.getRequestType() === oFF.PlanningModelRequestType.DROP_VERSION)
		{
			version.invalidateVersion();
			version.updateInvalidPrivileges();
		}
	}
	if (!this.importInternal(request, commands, responses))
	{
		importer.addErrorExt(oFF.OriginLayer.DRIVER, oFF.ErrorCodes.PARSER_ERROR, "error in processing response structure", inaStructure);
	}
	return modelComponent;
};
oFF.InAPlanningModelRequestVersion.prototype.importInternal = function(request, commands, responses)
{
	return true;
};

oFF.InAPlanningModelCommand = function() {};
oFF.InAPlanningModelCommand.prototype = new oFF.QInAComponentWithStructure();
oFF.InAPlanningModelCommand.prototype._ff_c = "InAPlanningModelCommand";

oFF.InAPlanningModelCommand.prototype.addCommandPerActiveVersionToList = function(command, commandList, commandName)
{
	let versions = command.getPlanningModel().getActiveVersions();
	for (let i = 0; i < versions.size(); i++)
	{
		let version = versions.get(i);
		let commandStructure = oFF.InAPlanningHelper.createVersionCommand(version, commandName);
		this.addParametersToJson(command, commandStructure);
		commandList.add(commandStructure);
	}
};
oFF.InAPlanningModelCommand.prototype.addParametersToJson = function(command, parametersStructure) {};
oFF.InAPlanningModelCommand.prototype.addRefreshCommandsToList = function(command, commandList)
{
	let model = command.getPlanningModel();
	if (!model.isModelInitialized())
	{
		commandList.add(oFF.InAPlanningHelper.createModelCommand(model, "get_query_sources"));
		commandList.add(oFF.InAPlanningHelper.createModelCommand(model, "get_actions"));
		if (model.supportsVersionParameters())
		{
			commandList.add(oFF.InAPlanningHelper.createModelCommand(model, "get_parameters"));
		}
		commandList.add(oFF.InAPlanningHelper.createModelCommand(model, "get_action_parameters"));
	}
};
oFF.InAPlanningModelCommand.prototype.exportComponentWithStructure = function(exporter, modelComponent, inaStructure, flags)
{
	let command = modelComponent;
	let model = command.getPlanningModel();
	let request = oFF.PrFactory.createStructure();
	let commandList = oFF.InAPlanningHelper.createCommandsList(request);
	this.fillCommandList(command, commandList, command.getPlanningContextCommandType());
	commandList.add(oFF.InAPlanningHelper.createModelCommand(model, "get_versions"));
	return request;
};
oFF.InAPlanningModelCommand.prototype.fillCommandList = function(command, commandList, commandType)
{
	if (commandType === oFF.PlanningContextCommandType.RESET)
	{
		this.addCommandPerActiveVersionToList(command, commandList, "close");
		this.addCommandPerActiveVersionToList(command, commandList, "init");
		return;
	}
	if (commandType === oFF.PlanningContextCommandType.SAVE)
	{
		this.addCommandPerActiveVersionToList(command, commandList, "save");
		return;
	}
	if (commandType === oFF.PlanningContextCommandType.BACKUP)
	{
		this.addCommandPerActiveVersionToList(command, commandList, "backup");
		return;
	}
	if (commandType === oFF.PlanningContextCommandType.CLOSE)
	{
		this.addCommandPerActiveVersionToList(command, commandList, "close");
		return;
	}
	if (commandType === oFF.PlanningContextCommandType.REFRESH || commandType === oFF.PlanningContextCommandType.HARD_DELETE)
	{
		if (commandType === oFF.PlanningContextCommandType.HARD_DELETE)
		{
			commandList.add(oFF.InAPlanningHelper.createModelCommand(command.getPlanningModel(), "delete_all_versions"));
		}
		this.addRefreshCommandsToList(command, commandList);
		return;
	}
	throw oFF.XException.createIllegalStateException("illegal command type");
};
oFF.InAPlanningModelCommand.prototype.getComponentType = function()
{
	return oFF.OlapComponentType.PLANNING_MODEL_COMMAND;
};
oFF.InAPlanningModelCommand.prototype.importComponentWithStructure = function(importer, inaStructure, modelComponent, parentComponent, context)
{
	let command = modelComponent;
	let result = command.getResult();
	oFF.InAHelper.importMessages(inaStructure, importer);
	let returnCode = oFF.InAPlanningHelper.getResponsesReturnCodeStrict(inaStructure, importer);
	result.setReturnCode(returnCode);
	if (importer.hasErrors() || returnCode !== 0)
	{
		return null;
	}
	if (!this.processResponseStructureInternal(command, inaStructure))
	{
		importer.addErrorExt(oFF.OriginLayer.DRIVER, oFF.ErrorCodes.PARSER_ERROR, "error in processing response structure", inaStructure);
		return null;
	}
	return command;
};
oFF.InAPlanningModelCommand.prototype.processResponseStructureInternal = function(command, responseStructure)
{
	let commands = oFF.InAPlanningHelper.getCommandsList(command.serializeToElement(oFF.QModelFormat.INA_DATA).asStructure());
	if (oFF.isNull(commands))
	{
		return false;
	}
	let responses = oFF.InAPlanningHelper.getResponsesList(responseStructure);
	if (oFF.isNull(responses))
	{
		return false;
	}
	let commandType = command.getPlanningContextCommandType();
	if (commandType !== oFF.PlanningContextCommandType.REFRESH && commandType !== oFF.PlanningContextCommandType.RESET && commandType !== oFF.PlanningContextCommandType.SAVE && commandType !== oFF.PlanningContextCommandType.BACKUP && commandType !== oFF.PlanningContextCommandType.CLOSE && commandType !== oFF.PlanningContextCommandType.HARD_DELETE)
	{
		throw oFF.XException.createIllegalStateException("illegal command type");
	}
	let model = command.getPlanningModel();
	if (commandType === oFF.PlanningContextCommandType.REFRESH || commandType === oFF.PlanningContextCommandType.HARD_DELETE)
	{
		if (!this.refreshResponseStructrue(commands, responses, model))
		{
			if (!model.isModelInitialized())
			{
				return false;
			}
		}
		else
		{
			model.setModelInitialized();
		}
	}
	if (!oFF.PlanningModelCommandHelper.processResponseGetVersions(commands, responses, model))
	{
		return false;
	}
	if (commandType === oFF.PlanningContextCommandType.HARD_DELETE)
	{
		let versions = model.getVersions();
		return versions.size() <= 0;
	}
	return true;
};
oFF.InAPlanningModelCommand.prototype.refreshResponseStructrue = function(commands, responses, model)
{
	if (!oFF.InAPlanningHelper.processResponseGetQuerySources(commands, responses, model))
	{
		return false;
	}
	if (!oFF.InAPlanningHelper.processResponseGetActions(commands, responses, model))
	{
		return false;
	}
	if (!oFF.InAPlanningHelper.processResponseGetParametersForModelTemplate(commands, responses, model))
	{
		return false;
	}
	return oFF.InAPlanningHelper.processResponseGetActionParameters(commands, responses, model);
};

oFF.InAPlanningAction = function() {};
oFF.InAPlanningAction.prototype = new oFF.QInAComponentWithStructure();
oFF.InAPlanningAction.prototype._ff_c = "InAPlanningAction";

oFF.InAPlanningAction.prototype.addCommand = function(planningAction, commandsList, commandName)
{
	let version = planningAction.getVersion();
	let commandStructure = oFF.InAPlanningHelper.createVersionCommand(version, commandName);
	commandsList.add(commandStructure);
	return commandStructure;
};
oFF.InAPlanningAction.prototype.exportComponentWithStructure = function(exporter, modelComponent, inaStructure, flags)
{
	let planningAction = modelComponent;
	let request = oFF.PrFactory.createStructure();
	let commands = oFF.InAPlanningHelper.createCommandsList(request);
	let command = this.addCommand(planningAction, commands, "action");
	let identifier = planningAction.getActionIdentifier();
	let actionId = identifier.getActionId();
	command.putString("action_id", actionId);
	let actionSequenceId = planningAction.getSequenceIdEffective();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(actionSequenceId))
	{
		command.putString("sequence_id", actionSequenceId);
	}
	if (!planningAction.getVersion().isActionSequenceActive())
	{
		let actionDescription = planningAction.getDescription();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(actionDescription))
		{
			command.putString("description", actionDescription);
		}
	}
	let actionParameters = planningAction.getActionParameters();
	if (oFF.notNull(actionParameters))
	{
		command.put("parameters", actionParameters);
	}
	else
	{
		if (planningAction.hasVariables())
		{
			let variables = planningAction.getVariableProcessor().getVariables();
			let parameterValues = command.putNewStructure("parameters");
			for (let i = 0; i < variables.size(); i++)
			{
				let variable = variables.get(i);
				if (variable.getVariableType().isTypeOf(oFF.VariableType.OPTION_LIST_VARIABLE))
				{
					let optionList = variable;
					let currentOption = optionList.getCurrentOption();
					parameterValues.putInteger(variable.getName(), oFF.XInteger.convertFromStringWithDefault(currentOption.getName(), -1));
				}
			}
		}
	}
	this.addCommand(planningAction, commands, "get_version_state");
	return request;
};
oFF.InAPlanningAction.prototype.getComponentType = function()
{
	return oFF.OlapComponentType.PLANNING_ACTION;
};
oFF.InAPlanningAction.prototype.importComponentWithStructure = function(importer, inaStructure, modelComponent, parentComponent, context)
{
	let planningAction = modelComponent;
	let result = planningAction.getResult();
	oFF.InAHelper.importMessages(inaStructure, importer);
	let returnCode = oFF.InAPlanningHelper.getResponsesReturnCodeStrict(inaStructure, importer);
	let responses = oFF.InAPlanningHelper.getResponsesList(inaStructure);
	if (oFF.isNull(responses))
	{
		if (returnCode === 0)
		{
			returnCode = -1;
		}
	}
	let commands = oFF.InAPlanningHelper.getCommandsList(planningAction.serializeToElement(oFF.QModelFormat.INA_DATA).asStructure());
	if (oFF.isNull(commands))
	{
		if (returnCode === 0)
		{
			returnCode = -1;
		}
	}
	let version = planningAction.getVersion();
	if (!oFF.InAPlanningHelper.processResponseGetVersionState(commands, responses, version))
	{
		if (returnCode === 0)
		{
			returnCode = -1;
		}
	}
	result.setReturnCode(returnCode);
	return planningAction;
};

oFF.InAPlanningModelRequestVersionClose = function() {};
oFF.InAPlanningModelRequestVersionClose.prototype = new oFF.InAPlanningModelRequestVersion();
oFF.InAPlanningModelRequestVersionClose.prototype._ff_c = "InAPlanningModelRequestVersionClose";

oFF.InAPlanningModelRequestVersionClose.prototype.addParametersToJson = function(request, commandStructure)
{
	let closeRequest = request;
	let closeMode = closeRequest.getCloseMode();
	if (oFF.notNull(closeMode) && !closeMode.isOnlyClient())
	{
		commandStructure.putString("mode", closeMode.getName());
	}
};
oFF.InAPlanningModelRequestVersionClose.prototype.getComponentType = function()
{
	return oFF.OlapComponentType.PLANNING_VERSION_CLOSE_COMMAND;
};

oFF.InAPlanningModelRequestVersionEndActionSequence = function() {};
oFF.InAPlanningModelRequestVersionEndActionSequence.prototype = new oFF.InAPlanningModelRequestVersion();
oFF.InAPlanningModelRequestVersionEndActionSequence.prototype._ff_c = "InAPlanningModelRequestVersionEndActionSequence";

oFF.InAPlanningModelRequestVersionEndActionSequence.prototype.addParametersToJson = function(request, commandStructure)
{
	let endRequest = request;
	let sequenceId = endRequest.getSequenceId();
	if (oFF.XStringUtils.isNullOrEmpty(sequenceId))
	{
		sequenceId = endRequest.getPlanningVersion().getActionSequenceId();
	}
	if (oFF.XStringUtils.isNotNullAndNotEmpty(sequenceId))
	{
		commandStructure.putString("sequence_id", sequenceId);
	}
	let description = endRequest.getDescription();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(description))
	{
		commandStructure.putString("description", description);
	}
};
oFF.InAPlanningModelRequestVersionEndActionSequence.prototype.getComponentType = function()
{
	return oFF.OlapComponentType.PLANNING_VERSION_END_ACTION_SEQUENCE_COMMAND;
};

oFF.InAPlanningModelRequestVersionSetParameters = function() {};
oFF.InAPlanningModelRequestVersionSetParameters.prototype = new oFF.InAPlanningModelRequestVersion();
oFF.InAPlanningModelRequestVersionSetParameters.prototype._ff_c = "InAPlanningModelRequestVersionSetParameters";

oFF.InAPlanningModelRequestVersionSetParameters.prototype.addParametersToJson = function(request, commandStructure)
{
	let setRequest = request;
	let versionParametersStructure = setRequest.getVersionParametersStructure();
	if (oFF.PrUtils.getStructureSize(versionParametersStructure, 0) > 0)
	{
		commandStructure.put("parameters", versionParametersStructure);
	}
};
oFF.InAPlanningModelRequestVersionSetParameters.prototype.getComponentType = function()
{
	return oFF.OlapComponentType.PLANNING_VERSION_SET_PARAMETERS_COMMAND;
};

oFF.InAPlanningModelRequestVersionSetTimeout = function() {};
oFF.InAPlanningModelRequestVersionSetTimeout.prototype = new oFF.InAPlanningModelRequestVersion();
oFF.InAPlanningModelRequestVersionSetTimeout.prototype._ff_c = "InAPlanningModelRequestVersionSetTimeout";

oFF.InAPlanningModelRequestVersionSetTimeout.prototype.addParametersToJson = function(request, commandStructure)
{
	let timeoutRequest = request;
	commandStructure.putInteger("timeout_value", timeoutRequest.getTimeout());
};
oFF.InAPlanningModelRequestVersionSetTimeout.prototype.getComponentType = function()
{
	return oFF.OlapComponentType.PLANNING_VERSION_SET_TIMEOUT_COMMAND;
};

oFF.InAPlanningModelRequestVersionStartActionSequence = function() {};
oFF.InAPlanningModelRequestVersionStartActionSequence.prototype = new oFF.InAPlanningModelRequestVersion();
oFF.InAPlanningModelRequestVersionStartActionSequence.prototype._ff_c = "InAPlanningModelRequestVersionStartActionSequence";

oFF.InAPlanningModelRequestVersionStartActionSequence.processResponseStartActionSequence = function(commands, responses, response)
{
	let request = response.getPlanningModelRequestVersion();
	let commandName = request.getRequestType().getName();
	let commandResponse = oFF.InAPlanningHelper.getCommandResponse(commands, responses, commandName);
	if (oFF.isNull(commandResponse))
	{
		return false;
	}
	let sequenceIdString = oFF.PrUtils.getStringProperty(commandResponse, "sequence_id");
	if (oFF.isNull(sequenceIdString))
	{
		return false;
	}
	let sequenceId = sequenceIdString.getString();
	response.setSequenceId(sequenceId);
	let version = request.getPlanningVersion();
	version.setActionSequenceId(sequenceId);
	return true;
};
oFF.InAPlanningModelRequestVersionStartActionSequence.prototype.addParametersToJson = function(request, commandStructure)
{
	let startRequest = request;
	let sequenceId = startRequest.getSequenceId();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(sequenceId))
	{
		commandStructure.putString("sequence_id", sequenceId);
	}
	let description = startRequest.getDescription();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(description))
	{
		commandStructure.putString("description", description);
	}
};
oFF.InAPlanningModelRequestVersionStartActionSequence.prototype.getComponentType = function()
{
	return oFF.OlapComponentType.PLANNING_VERSION_START_ACTION_SEQUENCE_COMMAND;
};
oFF.InAPlanningModelRequestVersionStartActionSequence.prototype.importInternal = function(request, commands, responses)
{
	let startRequest = request;
	let result = startRequest.getResult();
	return oFF.InAPlanningModelRequestVersionStartActionSequence.processResponseStartActionSequence(commands, responses, result);
};

oFF.InAPlanningModelRequestVersionStateDescriptions = function() {};
oFF.InAPlanningModelRequestVersionStateDescriptions.prototype = new oFF.InAPlanningModelRequestVersion();
oFF.InAPlanningModelRequestVersionStateDescriptions.prototype._ff_c = "InAPlanningModelRequestVersionStateDescriptions";

oFF.InAPlanningModelRequestVersionStateDescriptions.getVersionStateDescription = function(stateDescriptionStructure)
{
	let identifier = stateDescriptionStructure.getStringByKey("id");
	if (oFF.XStringUtils.isNullOrEmpty(identifier))
	{
		return null;
	}
	let integerProperty = oFF.PrUtils.getIntegerProperty(stateDescriptionStructure, "changes");
	if (oFF.isNull(integerProperty))
	{
		return null;
	}
	let startTime = oFF.PrUtils.getDateTimeProperty(stateDescriptionStructure, "start_time", false, null);
	if (oFF.isNull(startTime))
	{
		return null;
	}
	let endTime = oFF.PrUtils.getDateTimeProperty(stateDescriptionStructure, "end_time", false, null);
	if (oFF.isNull(endTime))
	{
		return null;
	}
	let description = stateDescriptionStructure.getStringByKey("description");
	let userName = stateDescriptionStructure.getStringByKey("user_name");
	return oFF.PlanningVersionStateDescription.create(identifier, description, userName, startTime, endTime, integerProperty.getInteger());
};
oFF.InAPlanningModelRequestVersionStateDescriptions.getVersionStateDescriptionList = function(stateDescriptionsStructure)
{
	let statesList = oFF.PrUtils.getListProperty(stateDescriptionsStructure, "states");
	if (oFF.isNull(statesList))
	{
		return null;
	}
	let descriptions = oFF.XList.create();
	for (let i = 0; i < statesList.size(); i++)
	{
		let stateDescription = oFF.InAPlanningModelRequestVersionStateDescriptions.getVersionStateDescription(statesList.getStructureAt(i));
		if (oFF.isNull(stateDescription))
		{
			continue;
		}
		descriptions.add(stateDescription);
	}
	return descriptions;
};
oFF.InAPlanningModelRequestVersionStateDescriptions.processResponseStateDescriptions = function(commands, responses, response)
{
	let request = response.getPlanningModelRequestVersion();
	let commandName = request.getRequestType().getName();
	let commandResponse = oFF.InAPlanningHelper.getCommandResponse(commands, responses, commandName);
	if (oFF.isNull(commandResponse))
	{
		return false;
	}
	let versionStateStructure = oFF.PrUtils.getStructureProperty(commandResponse, "version_state_descriptions");
	if (oFF.isNull(versionStateStructure))
	{
		return false;
	}
	let version = request.getPlanningVersion();
	let actionDescriptionResponse = response;
	actionDescriptionResponse.setVersionDescription(version.getVersionDescription());
	let identifier = oFF.PlanningVersionIdentifier.create(version.getVersionId(), version.isSharedVersion(), version.getVersionOwner());
	actionDescriptionResponse.setVersionIdentifier(identifier);
	let availableUndos = versionStateStructure.getIntegerByKey("available_undo");
	actionDescriptionResponse.setAvailableUndos(availableUndos);
	let availableRedos = versionStateStructure.getIntegerByKey("available_redo");
	actionDescriptionResponse.setAvailableRedos(availableRedos);
	let descriptions = oFF.InAPlanningModelRequestVersionStateDescriptions.getVersionStateDescriptionList(versionStateStructure);
	actionDescriptionResponse.setVersionStateDescriptions(descriptions);
	return true;
};
oFF.InAPlanningModelRequestVersionStateDescriptions.prototype.addParametersToJson = function(request, commandStructure)
{
	let descriptionRequest = request;
	let startIndex = descriptionRequest.getStartIndex();
	if (startIndex !== 0)
	{
		commandStructure.putInteger("start", startIndex);
		let count = descriptionRequest.getCount();
		if (count !== 0)
		{
			commandStructure.putInteger("count", count);
		}
	}
};
oFF.InAPlanningModelRequestVersionStateDescriptions.prototype.getComponentType = function()
{
	return oFF.OlapComponentType.PLANNING_VERSION_STATE_DESCRIPTIONS_COMMAND;
};
oFF.InAPlanningModelRequestVersionStateDescriptions.prototype.importInternal = function(request, commands, responses)
{
	let startRequest = request;
	let result = startRequest.getResult();
	return oFF.InAPlanningModelRequestVersionStateDescriptions.processResponseStateDescriptions(commands, responses, result);
};

oFF.InAPlanningModelRequestVersionUndoRedo = function() {};
oFF.InAPlanningModelRequestVersionUndoRedo.prototype = new oFF.InAPlanningModelRequestVersion();
oFF.InAPlanningModelRequestVersionUndoRedo.prototype._ff_c = "InAPlanningModelRequestVersionUndoRedo";

oFF.InAPlanningModelRequestVersionUndoRedo.prototype.addParametersToJson = function(request, commandStructure)
{
	let undoRedoRequest = request;
	let steps = undoRedoRequest.getSteps();
	if (steps > 0)
	{
		commandStructure.putInteger("num_undo_redo_steps", steps);
	}
};
oFF.InAPlanningModelRequestVersionUndoRedo.prototype.getComponentType = function()
{
	return oFF.OlapComponentType.PLANNING_VERSION_UNDO_REDO_COMMAND;
};

oFF.InAPlanningModelCloseCommand = function() {};
oFF.InAPlanningModelCloseCommand.prototype = new oFF.InAPlanningModelCommand();
oFF.InAPlanningModelCloseCommand.prototype._ff_c = "InAPlanningModelCloseCommand";

oFF.InAPlanningModelCloseCommand.prototype.addParametersToJson = function(command, parametersStructure)
{
	let closeCommand = command;
	let closeMode = closeCommand.getCloseMode();
	if (oFF.isNull(closeMode))
	{
		closeMode = oFF.CloseModeType.BACKUP;
	}
	parametersStructure.putString("mode", closeMode.getName());
};
oFF.InAPlanningModelCloseCommand.prototype.getComponentType = function()
{
	return oFF.OlapComponentType.PLANNING_MODEL_CLOSE_COMMAND;
};

oFF.InAPlanningVarProvider = function() {};
oFF.InAPlanningVarProvider.prototype = new oFF.DfOlapEnvContext();
oFF.InAPlanningVarProvider.prototype._ff_c = "InAPlanningVarProvider";

oFF.InAPlanningVarProvider.prototype.m_activeMainCapabilities = null;
oFF.InAPlanningVarProvider.prototype.m_connection = null;
oFF.InAPlanningVarProvider.prototype.m_directVariableTransfer = false;
oFF.InAPlanningVarProvider.prototype.m_export = null;
oFF.InAPlanningVarProvider.prototype.m_importVariables = null;
oFF.InAPlanningVarProvider.prototype.m_isVariableSubmitNeeded = false;
oFF.InAPlanningVarProvider.prototype.m_supportsCheckVariables = false;
oFF.InAPlanningVarProvider.prototype.m_supportsReInitVariables = false;
oFF.InAPlanningVarProvider.prototype.m_supportsVariableMasking = false;
oFF.InAPlanningVarProvider.prototype.createFunction = function()
{
	return this.createFunctionExt(true);
};
oFF.InAPlanningVarProvider.prototype.createFunctionExt = function(batchable)
{
	let path = this.getRequestPath();
	let ocpFunction = batchable ? this.m_connection.newRpcFunction(path) : this.m_connection.newRpcFunctionForNonBatchableQuery(path);
	let request = ocpFunction.getRpcRequest();
	request.setMethod(oFF.HttpRequestMethod.HTTP_POST);
	return ocpFunction;
};
oFF.InAPlanningVarProvider.prototype.exportVariables = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.getConnection = function()
{
	return this.m_connection;
};
oFF.InAPlanningVarProvider.prototype.getRequestPath = function()
{
	let fastPathCap = this.m_activeMainCapabilities.getByKey(oFF.InACapabilities.C032_FAST_PATH);
	if (oFF.notNull(fastPathCap) && fastPathCap.getValue() !== null)
	{
		return fastPathCap.getValue();
	}
	let systemDescription = this.m_connection.getSystemDescription();
	return systemDescription.getSystemType().getInAPath();
};
oFF.InAPlanningVarProvider.prototype.getSystemDescription = function()
{
	return this.m_connection.getSystemDescription();
};
oFF.InAPlanningVarProvider.prototype.getSystemName = function()
{
	let systemDescription = this.getSystemDescription();
	if (oFF.isNull(systemDescription))
	{
		return null;
	}
	return systemDescription.getSystemName();
};
oFF.InAPlanningVarProvider.prototype.getSystemType = function()
{
	return this.getSystemDescription().getSystemType();
};
oFF.InAPlanningVarProvider.prototype.getVariablesExporter = function()
{
	return this.m_export;
};
oFF.InAPlanningVarProvider.prototype.getVariablesImporter = function()
{
	return this.m_importVariables;
};
oFF.InAPlanningVarProvider.prototype.importVariables = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.isDirectVariableTransfer = function()
{
	return this.m_directVariableTransfer;
};
oFF.InAPlanningVarProvider.prototype.isVariableSubmitNeeded = function()
{
	return this.m_isVariableSubmitNeeded;
};
oFF.InAPlanningVarProvider.prototype.isVariableValuesRuntimeNeeded = function()
{
	return false;
};
oFF.InAPlanningVarProvider.prototype.processActivateVariableVariant = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.processCheckVariables = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.processDeleteVariableVariant = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.processEmptyVariableDefinition = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.processReInitVariableAfterSubmit = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.processResetExitOrDynamicVariable = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.processRetrieveVariableRuntimeInformation = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.processSaveVariableVariant = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.processSetGetVariableValues = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.processUpdateDynamicVariables = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.processUpdateVariableVariantValues = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.processVariableCancel = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.processVariableSubmit = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.releaseObject = function()
{
	this.m_connection = null;
	this.m_activeMainCapabilities = null;
	this.m_export = oFF.XObjectExt.release(this.m_export);
	this.m_importVariables = oFF.XObjectExt.release(this.m_importVariables);
	oFF.DfOlapEnvContext.prototype.releaseObject.call( this );
};
oFF.InAPlanningVarProvider.prototype.setDirectVariableTransfer = function(directVariableTransfer)
{
	this.m_directVariableTransfer = directVariableTransfer;
};
oFF.InAPlanningVarProvider.prototype.setIsVariableSubmitNeeded = function(submit)
{
	this.m_isVariableSubmitNeeded = submit;
};
oFF.InAPlanningVarProvider.prototype.setupVariablesProvider = function(application, connection, activeMainCapabilities)
{
	this.setupOlapApplicationContext(application.getOlapEnvironment());
	this.m_connection = connection;
	this.m_activeMainCapabilities = activeMainCapabilities;
	let capabilityModel = oFF.QCapabilities.create();
	oFF.InACapabilitiesProvider.importCapabilities(activeMainCapabilities, capabilityModel);
	this.m_export = oFF.QInAExportFactory.createForData(application, capabilityModel);
	this.m_importVariables = oFF.QInAImportFactory.createForMetadata(application, capabilityModel);
	this.m_isVariableSubmitNeeded = true;
	this.m_supportsCheckVariables = true;
	this.m_supportsReInitVariables = capabilityModel.supportsReInitVariables();
	this.m_supportsVariableMasking = capabilityModel.supportsVariableMasking();
};
oFF.InAPlanningVarProvider.prototype.supportsCheckVariables = function()
{
	return this.m_supportsCheckVariables && this.isDirectVariableTransfer();
};
oFF.InAPlanningVarProvider.prototype.supportsDirectVariableTransfer = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.supportsReInitVariables = function()
{
	return this.m_supportsReInitVariables;
};
oFF.InAPlanningVarProvider.prototype.supportsVariableMasking = function()
{
	return this.m_supportsVariableMasking;
};

oFF.InAPlanningModelRequestVersionInit = function() {};
oFF.InAPlanningModelRequestVersionInit.prototype = new oFF.InAPlanningModelRequestVersionSetParameters();
oFF.InAPlanningModelRequestVersionInit.prototype._ff_c = "InAPlanningModelRequestVersionInit";

oFF.InAPlanningModelRequestVersionInit.prototype.addParametersToJson = function(request, commandStructure)
{
	oFF.InAPlanningModelRequestVersionSetParameters.prototype.addParametersToJson.call( this , request, commandStructure);
	let initRequest = request;
	let description = initRequest.getPlanningVersion().getVersionDescription();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(description))
	{
		commandStructure.putString("description", description);
	}
	let restoreBackupType = initRequest.getRestoreBackupType();
	if (oFF.notNull(restoreBackupType))
	{
		if (oFF.RestoreBackupType.RESTORE_TRUE === restoreBackupType)
		{
			commandStructure.putBoolean("restore_backup", true);
		}
		else if (oFF.RestoreBackupType.RESTORE_FALSE === restoreBackupType)
		{
			commandStructure.putBoolean("restore_backup", false);
		}
	}
};
oFF.InAPlanningModelRequestVersionInit.prototype.getComponentType = function()
{
	return oFF.OlapComponentType.PLANNING_VERSION_INIT_COMMAND;
};

oFF.InAPlanningVarProcessorProvider = function() {};
oFF.InAPlanningVarProcessorProvider.prototype = new oFF.InAPlanningVarProvider();
oFF.InAPlanningVarProcessorProvider.prototype._ff_c = "InAPlanningVarProcessorProvider";

oFF.InAPlanningVarProcessorProvider.createInAVariableProcessorProvider = function(dataSource, variableRequestor, requestorProvider)
{
	let provider = new oFF.InAPlanningVarProcessorProvider();
	provider.setupInAVariableProcessorProvider(dataSource, variableRequestor, requestorProvider);
	return provider;
};
oFF.InAPlanningVarProcessorProvider.prototype.m_processor = null;
oFF.InAPlanningVarProcessorProvider.prototype.m_requestorProvider = null;
oFF.InAPlanningVarProcessorProvider.prototype.m_variableRequestorBase = null;
oFF.InAPlanningVarProcessorProvider.prototype.exportVariables = function(variablesContext, parentStructure)
{
	let variableList = this.m_export.exportVariableList(variablesContext);
	parentStructure.putNotNullAndNotEmpty("Variables", variableList);
};
oFF.InAPlanningVarProcessorProvider.prototype.getContext = function()
{
	return null;
};
oFF.InAPlanningVarProcessorProvider.prototype.getRequestorProvider = function()
{
	return this.m_requestorProvider;
};
oFF.InAPlanningVarProcessorProvider.prototype.getVariableProcessor = function()
{
	return this.m_processor;
};
oFF.InAPlanningVarProcessorProvider.prototype.importVariables = function(variablesList, variableContext)
{
	let wrapper = oFF.PrFactory.createStructure();
	wrapper.put("Variables", variablesList);
	this.m_importVariables.importVariables(wrapper, variableContext);
};
oFF.InAPlanningVarProcessorProvider.prototype.processCheckVariables = function(syncType, listener, customIdentifier)
{
	return oFF.InAPlanningVarCheckVariablesAction.createAndRun(this, syncType, listener, customIdentifier);
};
oFF.InAPlanningVarProcessorProvider.prototype.processReInitVariableAfterSubmit = function(syncType, listener, customIdentifier)
{
	return oFF.InAPlanningVarReInitAfterSubmitAction.createAndRun(this, syncType, listener, customIdentifier);
};
oFF.InAPlanningVarProcessorProvider.prototype.processRetrieveVariableRuntimeInformation = function(syncType, listener, customIdentifier)
{
	return oFF.InAPlanningVarGetRuntimeInfoAction.createAndRun(this, syncType, listener, customIdentifier);
};
oFF.InAPlanningVarProcessorProvider.prototype.processSetGetVariableValues = function(syncType, listener, customIdentifier)
{
	return oFF.InAPlanningVarSetGetValuesAction.createAndRun(this, syncType, listener, customIdentifier);
};
oFF.InAPlanningVarProcessorProvider.prototype.processVariableCancel = function(syncType, listener, customIdentifier)
{
	return oFF.InAPlanningVarCancelAction.createAndRun(this, syncType, listener, customIdentifier);
};
oFF.InAPlanningVarProcessorProvider.prototype.processVariableSubmit = function(syncType, listener, customIdentifier)
{
	return oFF.InAPlanningVarSubmitAction.createAndRun(this, syncType, listener, customIdentifier);
};
oFF.InAPlanningVarProcessorProvider.prototype.releaseObject = function()
{
	this.m_processor = oFF.XObjectExt.release(this.m_processor);
	this.m_requestorProvider = null;
	this.m_variableRequestorBase = null;
	oFF.InAPlanningVarProvider.prototype.releaseObject.call( this );
};
oFF.InAPlanningVarProcessorProvider.prototype.setupInAVariableProcessorProvider = function(dataSource, variableRequestorBase, requestorProvider)
{
	let application = variableRequestorBase.getApplication();
	let systemName = variableRequestorBase.getSystemName();
	let connection = application.getConnectionPool().getConnection(systemName);
	let serverMetadata = application.getConnectionPool().getSystemConnect(systemName).getServerMetadata();
	let capabilities = serverMetadata.getMetadataForService(oFF.ServerService.ANALYTIC);
	this.setupVariablesProvider(application, connection, capabilities);
	this.m_requestorProvider = requestorProvider;
	this.m_variableRequestorBase = variableRequestorBase;
	let context = this.getOlapEnv().getContext();
	this.m_processor = oFF.QVariableProcessor.createVariableProcessor(context, dataSource, this, this.m_variableRequestorBase);
	this.m_variableRequestorBase.setVariableProcessorBase(this.m_processor);
};
oFF.InAPlanningVarProcessorProvider.prototype.supportsMaintainsVariableVariants = function()
{
	return this.m_processor.supportsMaintainsVariableVariants();
};

oFF.InAPlanningVarAction = function() {};
oFF.InAPlanningVarAction.prototype = new oFF.QOlapSyncAction();
oFF.InAPlanningVarAction.prototype._ff_c = "InAPlanningVarAction";

oFF.InAPlanningVarAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onVariableProcessorExecuted(extResult, data, customIdentifier);
};
oFF.InAPlanningVarAction.prototype.checkDirectValueTransfer = function()
{
	if (!this.doStrictVariableProcessing())
	{
		return;
	}
	let variableProcessor = this.getActionContext().getVariableProcessor();
	if (oFF.isNull(variableProcessor))
	{
		return;
	}
	if (variableProcessor.isDirectVariableTransferEnabled())
	{
		throw oFF.XException.createIllegalStateException("stateful variable handling cannot be mixed with direct variable transfer");
	}
};
oFF.InAPlanningVarAction.prototype.createFunction = function()
{
	return this.getActionContext().createFunction();
};
oFF.InAPlanningVarAction.prototype.doStrictVariableProcessing = function()
{
	let parent = this.getActionContext();
	if (oFF.isNull(parent))
	{
		return false;
	}
	let application = parent.getApplication();
	return oFF.notNull(application);
};
oFF.InAPlanningVarAction.prototype.getExporter = function()
{
	return this.getActionContext().getVariablesExporter();
};
oFF.InAPlanningVarAction.prototype.getImporter = function()
{
	return this.getActionContext().getVariablesImporter();
};
oFF.InAPlanningVarAction.prototype.getProcessor = function()
{
	return this.getActionContext().getVariableProcessor();
};
oFF.InAPlanningVarAction.prototype.getRequestorProvider = function()
{
	return this.getActionContext().getRequestorProvider();
};
oFF.InAPlanningVarAction.prototype.isSuccessfullyProcessed = function()
{
	return this.isValid();
};
oFF.InAPlanningVarAction.prototype.setStructure = function(rootElement)
{
	if (oFF.notNull(rootElement))
	{
		let deepCopy = oFF.PrFactory.createStructureDeepCopy(rootElement);
		let provider = this.getActionContext();
		oFF.PlanningState.update(provider.getApplication(), provider.getSystemName(), deepCopy, this);
		return !oFF.InAHelper.importMessages(deepCopy, this);
	}
	return false;
};
oFF.InAPlanningVarAction.prototype.setVariablesStructure = function(rootElement)
{
	if (oFF.notNull(rootElement))
	{
		let deepCopy = oFF.PrFactory.createStructureDeepCopy(rootElement);
		let provider = this.getActionContext();
		oFF.PlanningState.update(provider.getApplication(), provider.getSystemName(), deepCopy, this);
		if (!oFF.InAHelper.importMessages(deepCopy, this))
		{
			let cubeStructure = deepCopy.getStructureByKey("Cube");
			if (oFF.isNull(cubeStructure))
			{
				let message2 = deepCopy.toString();
				this.addError(oFF.ErrorCodes.PARSER_ERROR, message2);
				return false;
			}
			let importer = this.getImporter();
			let processor = this.getProcessor();
			importer.importVariables(cubeStructure, processor.getVariableContainerBase());
			return true;
		}
	}
	return false;
};

oFF.InAPlanningVarCancelAction = function() {};
oFF.InAPlanningVarCancelAction.prototype = new oFF.InAPlanningVarAction();
oFF.InAPlanningVarCancelAction.prototype._ff_c = "InAPlanningVarCancelAction";

oFF.InAPlanningVarCancelAction.createAndRun = function(parent, syncType, listener, customIdentifier)
{
	let newObject = new oFF.InAPlanningVarCancelAction();
	newObject.setupActionAndRun(syncType, listener, customIdentifier, parent);
	return newObject;
};
oFF.InAPlanningVarCancelAction.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid() && oFF.notNull(response))
	{
		this.getQueryManagerBase().setVariableProcessorState(oFF.VariableProcessorState.SUBMITTED);
	}
	this.setData(this);
	this.endSync();
};
oFF.InAPlanningVarCancelAction.prototype.processSynchronization = function(syncType)
{
	return false;
};

oFF.InAPlanningVarCheckVariablesAction = function() {};
oFF.InAPlanningVarCheckVariablesAction.prototype = new oFF.InAPlanningVarAction();
oFF.InAPlanningVarCheckVariablesAction.prototype._ff_c = "InAPlanningVarCheckVariablesAction";

oFF.InAPlanningVarCheckVariablesAction.createAndRun = function(parent, syncType, listener, customIdentifier)
{
	let newObject = new oFF.InAPlanningVarCheckVariablesAction();
	newObject.setupActionAndRun(syncType, listener, customIdentifier, parent);
	return newObject;
};
oFF.InAPlanningVarCheckVariablesAction.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid() && oFF.notNull(response))
	{
		let rootElement = response.getRootElement();
		this.setStructure(rootElement);
	}
	this.setData(this);
	this.endSync();
};
oFF.InAPlanningVarCheckVariablesAction.prototype.processSynchronization = function(syncType)
{
	return false;
};

oFF.InAPlanningVarGetRuntimeInfoAction = function() {};
oFF.InAPlanningVarGetRuntimeInfoAction.prototype = new oFF.InAPlanningVarAction();
oFF.InAPlanningVarGetRuntimeInfoAction.prototype._ff_c = "InAPlanningVarGetRuntimeInfoAction";

oFF.InAPlanningVarGetRuntimeInfoAction.createAndRun = function(parent, syncType, listener, customIdentifier)
{
	let newObject = new oFF.InAPlanningVarGetRuntimeInfoAction();
	newObject.setupActionAndRun(syncType, listener, customIdentifier, parent);
	return newObject;
};
oFF.InAPlanningVarGetRuntimeInfoAction.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid() && oFF.notNull(response))
	{
		let rootElement = response.getRootElement();
		let successfullyProcessed = this.setVariablesStructure(rootElement);
		if (successfullyProcessed)
		{
			this.getProcessor().setVariableProcessorState(oFF.VariableProcessorState.CHANGEABLE_REINIT);
		}
		else
		{
			this.addError(oFF.ErrorCodes.OTHER_ERROR, "Error when setting variable structure");
		}
	}
	this.setData(this);
	this.endSync();
};
oFF.InAPlanningVarGetRuntimeInfoAction.prototype.processSynchronization = function(syncType)
{
	this.checkDirectValueTransfer();
	let ocpFunction = this.createFunction();
	let requestStructure = oFF.PrFactory.createStructure();
	let requestorProvider = this.getRequestorProvider();
	requestorProvider.fillVariableRequestorDataRequestContext(requestStructure, false, "VariableDefinition");
	this.getProcessor().setVariableProcessorState(oFF.VariableProcessorState.PROCESSING_UPDATE_VALUES);
	ocpFunction.getRpcRequest().setRequestStructure(requestStructure);
	ocpFunction.processFunctionExecution(syncType, this, null);
	return true;
};

oFF.InAPlanningVarReInitAfterSubmitAction = function() {};
oFF.InAPlanningVarReInitAfterSubmitAction.prototype = new oFF.InAPlanningVarAction();
oFF.InAPlanningVarReInitAfterSubmitAction.prototype._ff_c = "InAPlanningVarReInitAfterSubmitAction";

oFF.InAPlanningVarReInitAfterSubmitAction.createAndRun = function(parent, syncType, listener, customIdentifier)
{
	let newObject = new oFF.InAPlanningVarReInitAfterSubmitAction();
	newObject.setupActionAndRun(syncType, listener, customIdentifier, parent);
	return newObject;
};
oFF.InAPlanningVarReInitAfterSubmitAction.prototype.onVariableProcessorExecuted = function(extResult, result, customIdentifier)
{
	this.addAllMessages(extResult);
	this.setData(this);
	this.endSync();
};
oFF.InAPlanningVarReInitAfterSubmitAction.prototype.processSynchronization = function(syncType)
{
	return false;
};

oFF.InAPlanningVarSetGetValuesAction = function() {};
oFF.InAPlanningVarSetGetValuesAction.prototype = new oFF.InAPlanningVarAction();
oFF.InAPlanningVarSetGetValuesAction.prototype._ff_c = "InAPlanningVarSetGetValuesAction";

oFF.InAPlanningVarSetGetValuesAction.createAndRun = function(parent, syncType, listener, customIdentifier)
{
	let newObject = new oFF.InAPlanningVarSetGetValuesAction();
	newObject.setupActionAndRun(syncType, listener, customIdentifier, parent);
	return newObject;
};
oFF.InAPlanningVarSetGetValuesAction.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid() && oFF.notNull(response))
	{
		let rootElement = response.getRootElement();
		if (!this.setVariablesStructure(rootElement))
		{
			this.addError(oFF.ErrorCodes.OTHER_ERROR, "Error when setting variable structure");
		}
	}
	this.setData(this);
	this.endSync();
};
oFF.InAPlanningVarSetGetValuesAction.prototype.processSynchronization = function(syncType)
{
	let planningService = this.getRequestorProvider().getPlanningContext().getPlanningService();
	if (planningService.supportsPlanningValueHelp())
	{
		this.checkDirectValueTransfer();
		let ocpFunction = this.createFunction();
		let requestStructure = oFF.PrFactory.createStructure();
		let requestorProvider = this.getRequestorProvider();
		requestorProvider.fillVariableRequestorDataRequestContext(requestStructure, true, "VariableDefinition");
		ocpFunction.getRpcRequest().setRequestStructure(requestStructure);
		ocpFunction.processFunctionExecution(syncType, this, null);
		return true;
	}
	return false;
};

oFF.InAPlanningVarSubmitAction = function() {};
oFF.InAPlanningVarSubmitAction.prototype = new oFF.InAPlanningVarAction();
oFF.InAPlanningVarSubmitAction.prototype._ff_c = "InAPlanningVarSubmitAction";

oFF.InAPlanningVarSubmitAction.createAndRun = function(parent, syncType, listener, customIdentifier)
{
	let newObject = new oFF.InAPlanningVarSubmitAction();
	newObject.setupActionAndRun(syncType, listener, customIdentifier, parent);
	return newObject;
};
oFF.InAPlanningVarSubmitAction.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid() && oFF.notNull(response))
	{
		let rootElement = response.getRootElement();
		let successfullyProcessed = this.setStructure(rootElement);
		this.getProcessor().setVariableProcessorState(oFF.VariableProcessorState.SUBMITTED);
		if (!successfullyProcessed)
		{
			this.addError(oFF.ErrorCodes.OTHER_ERROR, "Error when setting variable structure");
		}
	}
	this.setData(this);
	this.endSync();
};
oFF.InAPlanningVarSubmitAction.prototype.processSynchronization = function(syncType)
{
	this.checkDirectValueTransfer();
	if (!this.getActionContext().isVariableSubmitNeeded())
	{
		this.setData(this);
		return false;
	}
	let ocpFunction = this.createFunction();
	let requestStructure = oFF.PrFactory.createStructure();
	let requestorProvider = this.getRequestorProvider();
	let inaDefinition = requestorProvider.fillVariableRequestorDataRequestContext(requestStructure, false, "VariableSubmit");
	this.getExporter().exportVariables(this.getProcessor().getVariableContainer(), inaDefinition);
	ocpFunction.getRpcRequest().setRequestStructure(requestStructure);
	ocpFunction.processFunctionExecution(syncType, this, null);
	return true;
};

oFF.IpProviderModule = function() {};
oFF.IpProviderModule.prototype = new oFF.DfModule();
oFF.IpProviderModule.prototype._ff_c = "IpProviderModule";

oFF.IpProviderModule.s_module = null;
oFF.IpProviderModule.addAllComponents = function()
{
	oFF.QInA.addInAComponent(new oFF.InAPlanningAction());
	oFF.QInA.addInAComponent(new oFF.InAPlanningModelCommand());
	oFF.QInA.addInAComponent(new oFF.InAPlanningModelCloseCommand());
	oFF.QInA.addInAComponent(new oFF.InAPlanningModelRequestCleanup());
	oFF.QInA.addInAComponent(new oFF.InAPlanningModelRequestRefreshActions());
	oFF.QInA.addInAComponent(new oFF.InAPlanningModelRequestRefreshVersions());
	oFF.QInA.addInAComponent(new oFF.InAPlanningModelRequestUpdateVersionPrivileges());
	oFF.QInA.addInAComponent(new oFF.InAPlanningModelRequestVersion());
	oFF.QInA.addInAComponent(new oFF.InAPlanningModelRequestVersionClose());
	oFF.QInA.addInAComponent(new oFF.InAPlanningModelRequestVersionEndActionSequence());
	oFF.QInA.addInAComponent(new oFF.InAPlanningModelRequestVersionInit());
	oFF.QInA.addInAComponent(new oFF.InAPlanningModelRequestVersionSetParameters());
	oFF.QInA.addInAComponent(new oFF.InAPlanningModelRequestVersionSetTimeout());
	oFF.QInA.addInAComponent(new oFF.InAPlanningModelRequestVersionStartActionSequence());
	oFF.QInA.addInAComponent(new oFF.InAPlanningModelRequestVersionStateDescriptions());
	oFF.QInA.addInAComponent(new oFF.InAPlanningModelRequestVersionUndoRedo());
	oFF.QInA.addInAComponent(new oFF.InADataAreaCommand());
	oFF.QInA.addInAComponent(new oFF.InADataAreaCommandClose());
	oFF.QInA.addInAComponent(new oFF.InADataAreaRequestGetPlanningFunctionMetadata());
	oFF.QInA.addInAComponent(new oFF.InADataAreaRequestGetPlanningSequenceMetadata());
	oFF.QInA.addInAComponent(new oFF.InALightweightDataAreaCommand());
};
oFF.IpProviderModule.getInstance = function()
{
	if (oFF.isNull(oFF.IpProviderModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.IpImplModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.ProviderModule.getInstance());
		oFF.IpProviderModule.s_module = oFF.DfModule.startExt(new oFF.IpProviderModule());
		oFF.QInA.staticSetupForPlanning();
		oFF.InAPlanningCapabilitiesProviderFactory.staticSetup();
		oFF.PlanningVariableProcessorProviderFactory.staticSetup();
		oFF.PlanningStateHandler.setInstance(new oFF.PlanningStateHandlerImpl());
		oFF.InAPlanningHelperTmp.staticSetup();
		oFF.IpProviderModule.addAllComponents();
		oFF.QInA.removeEmptyContainers();
		oFF.DfModule.stopExt(oFF.IpProviderModule.s_module);
	}
	return oFF.IpProviderModule.s_module;
};
oFF.IpProviderModule.prototype.getName = function()
{
	return "ff4410.olap.ip.providers";
};

oFF.IpProviderModule.getInstance();

return oFF;
} );