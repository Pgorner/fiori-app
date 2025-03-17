/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff3600.horizon.ui.api","sap/sac/df/firefly/ff5000.olap.dataprovider"
],
function(oFF)
{
"use strict";
oFF.FF8005_OLAP_UI_API_RESOURCES = function() {};
oFF.FF8005_OLAP_UI_API_RESOURCES.prototype = {};
oFF.FF8005_OLAP_UI_API_RESOURCES.prototype._ff_c = "FF8005_OLAP_UI_API_RESOURCES";

oFF.FF8005_OLAP_UI_API_RESOURCES.PATH_analyticalwidget_codeSnippetTemplate_txt = "analyticalwidget/codeSnippetTemplate.txt";
oFF.FF8005_OLAP_UI_API_RESOURCES.analyticalwidget_codeSnippetTemplate_txt = "PHA+PGNvZGU+PGhlYWQ+PC9jb2RlPjwvcD4KPHA+PGNvZGU+PCEtLSBMb2FkIHRoZSBjb21wb3NhYmxlIHdlYiBjb21wb25lbnRzIGxpYnJhcnkgLS0+PC9jb2RlPjwvcD4KPHA+PGNvZGU+PHNjcmlwdCBzcmM9IltbTElCX1VSTF1dcGxhaW4vZmY5MDAwLnBsYWluLmJ1bmRsZS5wcm9kLmpzIj48L3NjcmlwdD48L2NvZGU+PC9wPgo8cD48Y29kZT48c2NyaXB0IHNyYz0iW1tMSUJfVVJMXV1mZi53ZWIuY29tcG9uZW50cy5idW5kbGUucHJvZC5qcyI+PC9zY3JpcHQ+PC9jb2RlPjwvcD4KPHA+PC9wPgo8cD48Y29kZT48ZmYtY29tcG9zYWJsZS1hcHBbW0JPT1RTVFJBUF9DT05GSUdfVEVNUExBVEVdXT48L2NvZGU+PC9wPgo8cD48Y29kZT48L2ZmLWNvbXBvc2FibGUtYXBwPjwvY29kZT48L3A+CjxwPjxjb2RlPjwvaGVhZD48L2NvZGU+PC9wPgo8cD48Y29kZT48Ym9keT48L2NvZGU+PC9wPgo8cD48Y29kZT48IS0tIEVtYmVkIHRoZSB3aWRnZXQgLS0+PC9jb2RlPjwvcD4KPHA+PGNvZGU+PGZmLWFuYWx5dGljYWwtd2lkZ2V0IHdpZGdldGlkPSJbW1dJREdFVF9JRF1dIj48L2NvZGU+PC9wPgo8cD48Y29kZT5Mb2FkaW5nIHdpZGdldC4uLjwvY29kZT48L3A+CjxwPjxjb2RlPjwvZmYtYW5hbHl0aWNhbC13aWRnZXQ+PC9jb2RlPjwvcD4KPHA+PGNvZGU+PC9ib2R5PjwvY29kZT48L3A+Cg==";

oFF.XResources.registerResourceClass("ff8005.olap.ui.api", oFF.FF8005_OLAP_UI_API_RESOURCES);

oFF.OuAnalyticalWidgetExportUtils = {

	BOOTSTRAP_CONFIG_TEMPLATE_PLACEHOLDER:"[[BOOTSTRAP_CONFIG_TEMPLATE]]",
	CODE_SNIPPET_TEMPLATE_RESOURCE:"/analyticalwidget/codeSnippetTemplate.txt",
	LIB_URL_PLACEHOLDER:"[[LIB_URL]]",
	METADATA_FORM_DESCRIPTION_KEY:"description",
	METADATA_FORM_DISPLAY_NAME_KEY:"displayName",
	METADATA_FORM_TARGET_URL_KEY:"targetUrl",
	WIDGET_ID_PLACEHOLDER:"[[WIDGET_ID]]",
	enrichWidgetMetadataFromMetadataFormJson:function(widget, metadataFormModelJson)
	{
			if (oFF.notNull(widget) && oFF.notNull(metadataFormModelJson))
		{
			widget.setDisplayName(metadataFormModelJson.getStringByKey(oFF.OuAnalyticalWidgetExportUtils.METADATA_FORM_DISPLAY_NAME_KEY));
			widget.setDescription(metadataFormModelJson.getStringByKey(oFF.OuAnalyticalWidgetExportUtils.METADATA_FORM_DESCRIPTION_KEY));
			widget.setTargetUrl(metadataFormModelJson.getStringByKey(oFF.OuAnalyticalWidgetExportUtils.METADATA_FORM_TARGET_URL_KEY));
		}
	},
	presentCodeSnippetDialog:function(genesis, title, state, widgetId, previewUrl, libUrl, bootstrapConfigUrl)
	{
			let tmpDialog = genesis.newControl(oFF.UiType.DIALOG);
		tmpDialog.setState(state);
		tmpDialog.setTitle(title);
		let closeBtn = tmpDialog.addNewDialogButton();
		closeBtn.setText("Close");
		closeBtn.setButtonType(oFF.UiButtonType.PRIMARY);
		closeBtn.registerOnPress(oFF.UiLambdaPressListener.create((pressEvent) => {
			tmpDialog.close();
		}));
		let dialogMainLayout = tmpDialog.setNewContent(oFF.UiType.FLEX_LAYOUT);
		dialogMainLayout.setDirection(oFF.UiFlexDirection.COLUMN);
		dialogMainLayout.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
		dialogMainLayout.setAlignItems(oFF.UiFlexAlignItems.CENTER);
		dialogMainLayout.setPadding(oFF.UiCssBoxEdges.create("1rem"));
		dialogMainLayout.useMaxSpace();
		let dialogTitle = dialogMainLayout.addNewItemOfType(oFF.UiType.TITLE);
		dialogTitle.setText(oFF.XStringUtils.concatenate2("Widget id: ", widgetId));
		dialogTitle.setTitleLevel(oFF.UiTitleLevel.H_5);
		dialogTitle.setTitleStyle(oFF.UiTitleLevel.H_5);
		if (oFF.XStringUtils.isNotNullAndNotEmpty(previewUrl))
		{
			let previewUrlWithWidgetId = oFF.XStringUtils.concatenate2(previewUrl, widgetId);
			let previewLink = dialogMainLayout.addNewItemOfType(oFF.UiType.LINK);
			previewLink.setText("Preview");
			previewLink.setEmphasized(true);
			previewLink.setSrc(previewUrlWithWidgetId);
			previewLink.setTarget("_blank");
			previewLink.setMargin(oFF.UiCssBoxEdges.create("1rem 0 0 0"));
		}
		let finalLibUrl = libUrl;
		if (oFF.XStringUtils.isNotNullAndNotEmpty(finalLibUrl))
		{
			if (!oFF.XString.endsWith(finalLibUrl, "/"))
			{
				finalLibUrl = oFF.XStringUtils.concatenate2(finalLibUrl, "/");
			}
		}
		else
		{
			finalLibUrl = "./lib/";
		}
		let codeSnippetLabel = dialogMainLayout.addNewItemOfType(oFF.UiType.LABEL);
		codeSnippetLabel.setText("Code snippet:");
		codeSnippetLabel.setMargin(oFF.UiCssBoxEdges.create("1rem 0 0 0"));
		let codeSnippetStr = oFF.XResources.loadString(oFF.OuAnalyticalWidgetExportUtils.CODE_SNIPPET_TEMPLATE_RESOURCE);
		codeSnippetStr = oFF.XString.replace(codeSnippetStr, "<p>", "pppp");
		codeSnippetStr = oFF.XString.replace(codeSnippetStr, "</p>", "oooo");
		codeSnippetStr = oFF.XString.replace(codeSnippetStr, "<code>", "cccc");
		codeSnippetStr = oFF.XString.replace(codeSnippetStr, "</code>", "vvvv");
		codeSnippetStr = oFF.XStringUtils.escapeHtml(codeSnippetStr);
		codeSnippetStr = oFF.XString.replace(codeSnippetStr, "pppp", "<p>");
		codeSnippetStr = oFF.XString.replace(codeSnippetStr, "oooo", "</p>");
		codeSnippetStr = oFF.XString.replace(codeSnippetStr, "cccc", "<code>");
		codeSnippetStr = oFF.XString.replace(codeSnippetStr, "vvvv", "</code>");
		codeSnippetStr = oFF.XString.replace(codeSnippetStr, oFF.OuAnalyticalWidgetExportUtils.WIDGET_ID_PLACEHOLDER, widgetId);
		codeSnippetStr = oFF.XString.replace(codeSnippetStr, oFF.OuAnalyticalWidgetExportUtils.LIB_URL_PLACEHOLDER, finalLibUrl);
		let bootstrapConfigStr = bootstrapConfigUrl;
		if (oFF.XStringUtils.isNotNullAndNotEmpty(bootstrapConfigStr))
		{
			bootstrapConfigStr = oFF.XStringUtils.concatenate3(" config=\"", bootstrapConfigStr, "\"");
		}
		else
		{
			bootstrapConfigStr = "";
		}
		codeSnippetStr = oFF.XString.replace(codeSnippetStr, oFF.OuAnalyticalWidgetExportUtils.BOOTSTRAP_CONFIG_TEMPLATE_PLACEHOLDER, bootstrapConfigStr);
		let codeSnippetFormattedText = dialogMainLayout.addNewItemOfType(oFF.UiType.FORMATTED_TEXT);
		codeSnippetFormattedText.setText(codeSnippetStr);
		codeSnippetFormattedText.setBackgroundColor(oFF.UiColor.create("#80808033"));
		codeSnippetFormattedText.setPadding(oFF.UiCssBoxEdges.create("1rem"));
		tmpDialog.open();
	},
	presentWidgetExportFormPopup:function(genesis, existingWidget)
	{
			let popupPromise = oFF.XPromise.create((resolve, reject) => {
			let popupTitle = oFF.notNull(existingWidget) ? "Save widget" : "Create new widget";
			let submitBtnText = oFF.notNull(existingWidget) ? "Save" : "Create";
			let submitBtnIcon = oFF.notNull(existingWidget) ? "save" : "outbox";
			let formPopup = oFF.UtFormPopup.create(genesis, popupTitle, null);
			formPopup.setSubmitButtonText(submitBtnText);
			formPopup.setSubmitButtonIcon(submitBtnIcon);
			formPopup.addInput(oFF.OuAnalyticalWidgetExportUtils.METADATA_FORM_DISPLAY_NAME_KEY, oFF.notNull(existingWidget) ? existingWidget.getDisplayName() : null, "Display Name");
			formPopup.addInput(oFF.OuAnalyticalWidgetExportUtils.METADATA_FORM_DESCRIPTION_KEY, oFF.notNull(existingWidget) ? existingWidget.getDescription() : null, "Description");
			formPopup.addInput(oFF.OuAnalyticalWidgetExportUtils.METADATA_FORM_TARGET_URL_KEY, oFF.notNull(existingWidget) ? existingWidget.getTargetUrl() : null, "Target Url");
			formPopup.setSubmitConsumer((modelJson) => {
				if (oFF.notNull(existingWidget))
				{
					oFF.OuAnalyticalWidgetExportUtils.enrichWidgetMetadataFromMetadataFormJson(existingWidget, modelJson);
				}
				resolve(modelJson);
			});
			formPopup.setCancelProcedure(() => {
				reject(oFF.XError.create("Widget Metadata Dialog canceled"));
			});
			formPopup.open();
		});
		return popupPromise;
	},
	saveAsNewAnalyticalWidget:function(process, dataProvider, metadataFormModelJson, widgetCatalog)
	{
			return oFF.OuAnalyticalWidgetUtils.createAnalyticalWidgetFromDataProvider(process, dataProvider).onThenPromise((newWidget) => {
			oFF.OuAnalyticalWidgetExportUtils.enrichWidgetMetadataFromMetadataFormJson(newWidget, metadataFormModelJson);
			return oFF.OuAnalyticalWidgetUtils.saveWidgetAsJsonFile(process, newWidget, widgetCatalog);
		});
	}
};

oFF.OuAnalyticalWidgetUtils = {

	DEFAULT_CHART_TYPE_NAME:"Pie",
	DEFAULT_CHART_VIZ_NAME:"chartViz",
	_adjustWidgetCatalogPathIfNeeded:function(widgetCatalog)
	{
			if (oFF.isNull(widgetCatalog))
		{
			return widgetCatalog;
		}
		if (oFF.XString.endsWith(widgetCatalog, "/"))
		{
			return widgetCatalog;
		}
		return oFF.XStringUtils.concatenate2(widgetCatalog, "/");
	},
	_applyDefaultChartVizSettings:function(dataProvider, initialVizList)
	{
			if (oFF.XCollectionUtils.hasElements(initialVizList))
		{
			let tmpViz = initialVizList.get(0);
			if (tmpViz.getSemanticBindingType() === oFF.SemanticBindingType.CHART)
			{
				let tmpChartDef = tmpViz;
				let horAlignment = tmpChartDef.addNewSimpleTypeVariable(oFF.XValueType.STRING, oFF.OlapVisualizationConstants.LEGEND_STYLE_VARIABLE_HORIZONTAL_ALIGNMENT, oFF.OlapVisualizationConstants.LEGEND_STYLE_VARIABLE_HORIZONTAL_ALIGNMENT, false);
				horAlignment.setString(oFF.CellAlignmentHorizontal.CENTER.getName());
				let layoutDir = tmpChartDef.addNewSimpleTypeVariable(oFF.XValueType.STRING, oFF.OlapVisualizationConstants.LEGEND_STYLE_VARIABLE_LAYOUT_DIRECTION, oFF.OlapVisualizationConstants.LEGEND_STYLE_VARIABLE_LAYOUT_DIRECTION, false);
				layoutDir.setString(oFF.LayoutDirection.HORIZONTAL.getName());
			}
		}
		return oFF.XPromise.resolve(null);
	},
	_applyDefaultQuerySettings:function(dataProvider)
	{
			let queryManager = dataProvider.getQueryManager();
		if (oFF.isNull(queryManager))
		{
			return oFF.XPromise.resolve(null);
		}
		oFF.XCollectionUtils.forEach(queryManager.getQueryModel().getDimensions(), (dim) => {
			if (queryManager.getConvenienceCommands().isFieldContainerTextViewSupported(dim.getName(), null))
			{
				queryManager.getConvenienceCommands().setFieldContainerDisplay(dim.getName(), null, oFF.FieldContainerDisplay.TEXT);
			}
		});
		return oFF.XPromise.resolve(null);
	},
	applyDataProviderStateToAnalyticalWidget:function(dataProvider, analyticalWidget)
	{
			if (oFF.isNull(dataProvider))
		{
			return oFF.XPromise.reject(oFF.XError.create("Missing data provider! Cannot apply state!"));
		}
		if (oFF.isNull(analyticalWidget))
		{
			return oFF.XPromise.reject(oFF.XError.create("Missing analytical widget! Cannot apply state!"));
		}
		return dataProvider.getActions().getSerializationActions().exportRepository(true).onThenExt((inaRepoStruct) => {
			analyticalWidget.setInaRepoStructure(inaRepoStruct);
			analyticalWidget.setModelFormat(oFF.QModelFormat.INA_REPOSITORY_DELTA);
			analyticalWidget.setSystemName(dataProvider.getSystemName());
			analyticalWidget.setDataSourceFQN(dataProvider.getDataSourceName());
			return analyticalWidget;
		}).onThenPromise((res) => {
			return dataProvider.getActions().getVisualizationActions().getActiveVisualizationDefinition().onThenExt((curViz) => {
				analyticalWidget.setWidgetType(oFF.OuAnalyticalWidgetType.lookupBySemanticBindingType(curViz.getSemanticBindingType()));
				if (curViz.getSemanticBindingType() === oFF.SemanticBindingType.CHART)
				{
					let tmpChartDef = curViz;
					let curChartType = tmpChartDef.getChartSetting().getChartType();
					analyticalWidget.setChartType(curChartType);
				}
				return analyticalWidget;
			});
		});
	},
	createAnalyticalWidgetFromDataProvider:function(process, dataProvider)
	{
			if (oFF.isNull(process))
		{
			return oFF.XPromise.reject(oFF.XError.create("Missing process! Cannot create analytical widget file!"));
		}
		if (oFF.isNull(dataProvider))
		{
			return oFF.XPromise.reject(oFF.XError.create("Missing data provider! Cannot create analytical widget file!"));
		}
		let newWidget = oFF.OuAnalyticalWidget.create();
		return oFF.OuAnalyticalWidgetUtils.applyDataProviderStateToAnalyticalWidget(dataProvider, newWidget);
	},
	createDataProviderFromWidget:function(process, analyticalWidget)
	{
			let application = process.getApplication();
		let dataSource = oFF.QFactory.createDataSource();
		dataSource.setSystemName(analyticalWidget.getSystemName());
		dataSource.setFullQualifiedName(analyticalWidget.getDataSourceFQN());
		let dpCreateConfiguration = oFF.OuDataProviderConfiguration.createConfig(application, dataSource);
		dpCreateConfiguration.setDataProviderName(analyticalWidget.getId());
		dpCreateConfiguration.setLoadingActionManifests(false);
		dpCreateConfiguration.setStartAsConnected(true);
		dpCreateConfiguration.setRepoDeltaEnabled(analyticalWidget.getModelFormat() === oFF.QModelFormat.INA_REPOSITORY_DELTA);
		dpCreateConfiguration.getStartConnection().setRepoJson(analyticalWidget.getInaRepoStructure());
		dpCreateConfiguration.getStartConnection().setStartWithAutoFetch(true);
		return oFF.OuDataProviderFactory.createDataProviderFromSource(dpCreateConfiguration);
	},
	createDataProviderFromWidgetId:function(process, widgetId, widgetCatalog)
	{
			return oFF.OuAnalyticalWidgetUtils.getWidgeById(process, widgetId, widgetCatalog).onThenPromise((loadedWidget) => {
			return oFF.OuAnalyticalWidgetUtils.createDataProviderFromWidget(process, loadedWidget);
		});
	},
	createPristineDataProviderFromDataSource:function(dataSource, application)
	{
			if (oFF.isNull(dataSource))
		{
			return oFF.XPromise.reject(oFF.XError.create("Missing data source! Cannot create a data provider!"));
		}
		if (oFF.isNull(application))
		{
			return oFF.XPromise.reject(oFF.XError.create("Missing application! Cannot create a data provider!"));
		}
		let vizList = oFF.PrFactory.createList();
		let defaultViz = vizList.addNewStructure();
		defaultViz.putString(oFF.OuDataProviderConfiguration.VIZ_NAME, oFF.OuAnalyticalWidgetUtils.DEFAULT_CHART_VIZ_NAME);
		defaultViz.putString(oFF.OuDataProviderConfiguration.VIZ_TYPE, oFF.VisualizationType.CHART.getName());
		defaultViz.putString(oFF.OuDataProviderConfiguration.VIZ_PROTOCOL, oFF.ProtocolBindingType.HIGH_CHART_PROTOCOL.getName());
		defaultViz.putString(oFF.OuDataProviderConfiguration.VIZ_CHART_TYPE, oFF.ChartType.PIE.getName());
		let dpConnection = oFF.OuDataProviderConnection.createConnection(application);
		dpConnection.setDataSource(dataSource);
		dpConnection.setStartWithAutoFetch(true);
		dpConnection.setVisualizations(vizList);
		let dpCreateConfiguration = oFF.OuDataProviderConfiguration.createConfigForEmptyDataProvider(application);
		dpCreateConfiguration.setDataProviderName("analyticalWidgetDesignerDp");
		dpCreateConfiguration.setLoadingActionManifests(false);
		dpCreateConfiguration.setStartAsConnected(true);
		dpCreateConfiguration.setStartConnection(dpConnection);
		dpCreateConfiguration.getHooks().getFinalizeQueryManagerRegister().addFunction(oFF.OuAnalyticalWidgetUtils._applyDefaultQuerySettings);
		dpCreateConfiguration.getHooks().getAfterVisualizationLoadRegister().addBiFunction((dp, initialVizList) => {
			return oFF.OuAnalyticalWidgetUtils._applyDefaultChartVizSettings(dp, initialVizList);
		});
		return oFF.OuDataProviderFactory.createDataProviderFromSource(dpCreateConfiguration);
	},
	createWidgetFile:function(process, dataProvider, widgetCatalog)
	{
			if (oFF.isNull(process))
		{
			return oFF.XPromise.reject(oFF.XError.create("Missing process! Cannot create analytical widget file!"));
		}
		if (oFF.isNull(dataProvider))
		{
			return oFF.XPromise.reject(oFF.XError.create("Missing data provider! Cannot create analytical widget file!"));
		}
		if (oFF.XStringUtils.isNullOrEmpty(widgetCatalog))
		{
			return oFF.XPromise.reject(oFF.XError.create("No analytical widget catalog specified! Cannot create analytical widget file!"));
		}
		let newWidget = oFF.OuAnalyticalWidget.create();
		return oFF.OuAnalyticalWidgetUtils.applyDataProviderStateToAnalyticalWidget(dataProvider, newWidget).onThenPromise((res) => {
			let widgetDefFile = oFF.XFile.create(process, oFF.XStringUtils.concatenate2(oFF.OuAnalyticalWidgetUtils._adjustWidgetCatalogPathIfNeeded(widgetCatalog), newWidget.getId()));
			newWidget.updateModifiedTimestamp();
			return oFF.XFilePromise.saveJson(widgetDefFile, newWidget.getWidgetStructure()).onThenExt((file) => {
				return newWidget.getId();
			});
		});
	},
	getWidgeById:function(process, widgetId, widgetCatalog)
	{
			if (oFF.isNull(process))
		{
			return oFF.XPromise.reject(oFF.XError.create("Missing process! Cannot load analytical widget!"));
		}
		if (oFF.XStringUtils.isNullOrEmpty(widgetId))
		{
			return oFF.XPromise.reject(oFF.XError.create("Missing data provider! Cannot load analytical widget!"));
		}
		if (oFF.XStringUtils.isNullOrEmpty(widgetCatalog))
		{
			return oFF.XPromise.reject(oFF.XError.create("No analytical widget catalog specified! Cannot load analytical widget!"));
		}
		let widgetDefFile = oFF.XFile.create(process, oFF.XStringUtils.concatenate2(widgetCatalog, widgetId));
		return oFF.XFilePromise.loadJsonStructure(widgetDefFile).onThenExt((widgetStructJson) => {
			let tmpWidget = oFF.OuAnalyticalWidget.createByStructure(widgetStructJson);
			if (oFF.isNull(tmpWidget) || !tmpWidget.isValid())
			{
				throw oFF.XException.createException("Analytical widget data seems to be corrupted!");
			}
			return tmpWidget;
		});
	},
	getWidgetIdListFromWidgetCatalog:function(process, widgetCatalog)
	{
			let widgetCatalogDir = oFF.XFile.create(process, widgetCatalog);
		return oFF.XFilePromise.fetchChildren(widgetCatalogDir).onThenExt((children) => {
			let widgetIdList = oFF.XList.create();
			oFF.XCollectionUtils.forEach(children, (tmpChild) => {
				widgetIdList.add(tmpChild.getName());
			});
			return widgetIdList;
		});
	},
	getWidgetListFromWidgetCatalog:function(process, widgetCatalog)
	{
			let widgetCatalogDir = oFF.XFile.create(process, widgetCatalog);
		return oFF.XFilePromise.fetchChildren(widgetCatalogDir).onThenPromise((children) => {
			let widgetList = oFF.XList.create();
			let promiseList = oFF.XPromiseList.create();
			oFF.XCollectionUtils.forEach(children, (tmpChild) => {
				promiseList.add(oFF.XFilePromise.loadJsonStructure(tmpChild).onThenExt((fileJson) => {
					let tmpWidget = oFF.OuAnalyticalWidget.createByStructure(fileJson);
					if (oFF.notNull(tmpWidget) && tmpWidget.isValid())
					{
						widgetList.add(tmpWidget);
					}
					return tmpWidget;
				}));
			});
			let allSettlesPromise = oFF.XPromise.allSettled(promiseList);
			return allSettlesPromise.onThenExt((res) => {
				oFF.XCollectionUtils.sortByComparator(widgetList, (a, b) => {
					return oFF.XIntegerValue.create(oFF.XString.compare(a.getId(), b.getId()));
				});
				return widgetList;
			});
		});
	},
	saveExistingWidgetFile:function(process, dataProvider, widgetId, widgetCatalog)
	{
			if (oFF.isNull(dataProvider))
		{
			return oFF.XPromise.reject(oFF.XError.create("Missing data provider! Cannot save analytical widget file!"));
		}
		let widgetDefFile = oFF.XFile.create(process, oFF.XStringUtils.concatenate2(oFF.OuAnalyticalWidgetUtils._adjustWidgetCatalogPathIfNeeded(widgetCatalog), widgetId));
		return oFF.OuAnalyticalWidgetUtils.getWidgeById(process, widgetId, widgetCatalog).onThenPromise((loadedWidget) => {
			return oFF.OuAnalyticalWidgetUtils.applyDataProviderStateToAnalyticalWidget(dataProvider, loadedWidget).onThenPromise((res) => {
				loadedWidget.updateModifiedTimestamp();
				return oFF.XFilePromise.saveJson(widgetDefFile, loadedWidget.getWidgetStructure()).onThenExt((file) => {
					return widgetId;
				});
			});
		});
	},
	saveWidgetAsJsonFile:function(process, analyticalWidget, widgetCatalog)
	{
			if (oFF.isNull(process))
		{
			return oFF.XPromise.reject(oFF.XError.create("Missing process! Cannot create analytical widget file!"));
		}
		if (oFF.isNull(analyticalWidget) || !analyticalWidget.isValid())
		{
			return oFF.XPromise.reject(oFF.XError.create("Missing or invalid analytical widget! Cannot save!"));
		}
		if (oFF.XStringUtils.isNullOrEmpty(widgetCatalog))
		{
			return oFF.XPromise.reject(oFF.XError.create("No analytical widget catalog specified! Cannot create analytical widget file!"));
		}
		let widgetDefFile = oFF.XFile.create(process, oFF.XStringUtils.concatenate2(oFF.OuAnalyticalWidgetUtils._adjustWidgetCatalogPathIfNeeded(widgetCatalog), analyticalWidget.getId()));
		analyticalWidget.updateModifiedTimestamp();
		return oFF.XFilePromise.saveJson(widgetDefFile, analyticalWidget.getWidgetStructure()).onThenExt((file) => {
			return analyticalWidget;
		});
	}
};

oFF.OuDataProviderFilterDialogActionResult = function() {};
oFF.OuDataProviderFilterDialogActionResult.prototype = new oFF.XObject();
oFF.OuDataProviderFilterDialogActionResult.prototype._ff_c = "OuDataProviderFilterDialogActionResult";

oFF.OuDataProviderFilterDialogActionResult.create = function()
{
	return new oFF.OuDataProviderFilterDialogActionResult();
};
oFF.OuDataProviderFilterDialogActionResult.prototype.m_isSubmitted = false;
oFF.OuDataProviderFilterDialogActionResult.prototype.isDialogCancelled = function()
{
	return !this.m_isSubmitted;
};
oFF.OuDataProviderFilterDialogActionResult.prototype.isDialogSubmitted = function()
{
	return this.m_isSubmitted;
};
oFF.OuDataProviderFilterDialogActionResult.prototype.setDialogSubmitted = function(submitted)
{
	this.m_isSubmitted = submitted;
};

oFF.FilterDialogProgramRunnerFactory = {

	createForDimension:function(parentProcess, queryManager, dimension, title)
	{
			let runner = oFF.ProgramRunner.createRunner(parentProcess, oFF.FilterDialog.DEFAULT_PROGRAM_NAME_DIMENSION);
		let startdata = oFF.ProgramStartData.create();
		startdata.putXObject(oFF.DfOuDialogProgram.PRG_DATA_QUERY_MANAGER, queryManager);
		runner.setProgramStartData(startdata);
		runner.setStringArgument(oFF.FilterDialog.ARG_DIMENSION_NAME, dimension);
		runner.setStringArgument(oFF.FilterDialog.ARG_TITLE, title);
		return runner;
	},
	createForDimensionFilter:function(parentProcess, queryManager, dimension, title)
	{
			let runner = oFF.FilterDialogProgramRunnerFactory.createForDimension(parentProcess, queryManager, dimension, title);
		runner.setBooleanArgument(oFF.FilterDialog.ARG_OPEN_WITH_DYNAMIC_FILTER, true);
		return runner;
	},
	createForHierarchyCatalog:function(parentProcess, queryManager, dimension, title)
	{
			let runner = oFF.ProgramRunner.createRunner(parentProcess, oFF.FilterDialog.DEFAULT_PROGRAM_NAME_HIERARCHY_CATALOG);
		let startdata = oFF.ProgramStartData.create();
		startdata.putXObject(oFF.DfOuDialogProgram.PRG_DATA_QUERY_MANAGER, queryManager);
		runner.setProgramStartData(startdata);
		runner.setStringArgument(oFF.FilterDialog.ARG_DIMENSION_NAME, dimension);
		runner.setStringArgument(oFF.FilterDialog.ARG_TITLE, title);
		return runner;
	},
	createForLinkedMeasureBasedFilter:function(parentProcess, queryManager, mbfMemberName, layeredFilterName, title)
	{
			let runner = oFF.ProgramRunner.createRunner(parentProcess, oFF.FilterDialog.DEFAULT_PROGRAM_NAME_MEASURE_BASED_FILTER);
		let startdata = oFF.ProgramStartData.create();
		startdata.putXObject(oFF.DfOuDialogProgram.PRG_DATA_QUERY_MANAGER, queryManager);
		runner.setProgramStartData(startdata);
		runner.setStringArgument(oFF.FilterDialog.ARG_MBF_MEMBER_NAME, mbfMemberName);
		runner.setStringArgument(oFF.FilterDialog.ARG_LAYERED_FILTER_NAME, layeredFilterName);
		runner.setStringArgument(oFF.FilterDialog.ARG_TITLE, title);
		return runner;
	},
	createForMeasureBasedFilter:function(parentProcess, queryManager, mbfMemberName, filterMeasureBased, title)
	{
			let runner = oFF.ProgramRunner.createRunner(parentProcess, oFF.FilterDialog.DEFAULT_PROGRAM_NAME_MEASURE_BASED_FILTER);
		let startdata = oFF.ProgramStartData.create();
		startdata.putXObject(oFF.DfOuDialogProgram.PRG_DATA_QUERY_MANAGER, queryManager);
		startdata.putXObject(oFF.FilterDialog.PRG_DATA_MBF, filterMeasureBased);
		runner.setProgramStartData(startdata);
		runner.setStringArgument(oFF.FilterDialog.ARG_MBF_MEMBER_NAME, mbfMemberName);
		runner.setStringArgument(oFF.FilterDialog.ARG_TITLE, title);
		return runner;
	},
	createForUserAndTeam:function(parentProcess, title, workspace, owner)
	{
			let runner = oFF.ProgramRunner.createRunner(parentProcess, oFF.FilterDialog.DEFAULT_PROGRAM_NAME_USER_TEAM);
		runner.setStringArgument(oFF.FilterDialog.ARG_TITLE, title);
		runner.setStringArgument(oFF.FilterDialog.ARG_WORKSPACE, workspace);
		runner.setStringArgument(oFF.FilterDialog.ARG_HIDDEN_VALUES, owner);
		return runner;
	},
	createForVariable:function(parentProcess, queryManager, variable, title)
	{
			let runner = oFF.ProgramRunner.createRunner(parentProcess, oFF.FilterDialog.DEFAULT_PROGRAM_NAME_VARIABLE);
		if (oFF.notNull(queryManager))
		{
			let startdata = oFF.ProgramStartData.create();
			startdata.putXObject(oFF.DfOuDialogProgram.PRG_DATA_QUERY_MANAGER, queryManager);
			runner.setProgramStartData(startdata);
			runner.setStringArgument(oFF.FilterDialog.ARG_VARIABLE_NAME, variable.getName());
		}
		else
		{
			let startdataPlanning = oFF.ProgramStartData.create();
			startdataPlanning.putXObject(oFF.FilterDialog.PRG_DATA_VARIABLE, variable);
			runner.setProgramStartData(startdataPlanning);
		}
		runner.setStringArgument(oFF.FilterDialog.ARG_TITLE, title);
		return runner;
	},
	createForVariableFilter:function(parentProcess, queryManager, variable, title)
	{
			let runner = oFF.FilterDialogProgramRunnerFactory.createForVariable(parentProcess, queryManager, variable, title);
		runner.setBooleanArgument(oFF.FilterDialog.ARG_OPEN_WITH_VARIABLE_FILTER, true);
		return runner;
	}
};

oFF.FilterDialogValueFormatter = function() {};
oFF.FilterDialogValueFormatter.prototype = new oFF.XObject();
oFF.FilterDialogValueFormatter.prototype._ff_c = "FilterDialogValueFormatter";

oFF.FilterDialogValueFormatter.DEFAULT_RANGE_DISPLAY_PATTERN = "[ ] $1 - $2";
oFF.FilterDialogValueFormatter.DEFAULT_RANGE_EXCLUDED_DISPLAY_PATTERN = "![ ] $1 - $2";
oFF.FilterDialogValueFormatter.DEFAULT_RANGE_SIMPLIFIED_PATTERN = "$1 - $2";
oFF.FilterDialogValueFormatter.DEFAULT_VALUE_DISPLAY_PATTERN = "$1 ($2)";
oFF.FilterDialogValueFormatter.create = function(valuePattern, rangePattern, rangeExcludedPattern)
{
	let formatter = new oFF.FilterDialogValueFormatter();
	formatter.setupComponent(valuePattern, rangePattern, rangeExcludedPattern);
	return formatter;
};
oFF.FilterDialogValueFormatter.formatDateRangeSimplified = function(from, to)
{
	return oFF.FilterDialogValueFormatter.replace(oFF.FilterDialogValueFormatter.DEFAULT_RANGE_SIMPLIFIED_PATTERN, from, to);
};
oFF.FilterDialogValueFormatter.replace = function(pattern, value1, value2)
{
	if (oFF.XStringUtils.isNullOrEmpty(value2))
	{
		return value1;
	}
	if (oFF.XStringUtils.isNullOrEmpty(value1))
	{
		return value2;
	}
	return oFF.XString.replace(oFF.XString.replace(pattern, "$1", value1), "$2", value2);
};
oFF.FilterDialogValueFormatter.prototype.m_rangeExcludedPattern = null;
oFF.FilterDialogValueFormatter.prototype.m_rangePattern = null;
oFF.FilterDialogValueFormatter.prototype.m_rangeSimplifiedPattern = null;
oFF.FilterDialogValueFormatter.prototype.m_valuePattern = null;
oFF.FilterDialogValueFormatter.prototype.format = function(value1, value2)
{
	return oFF.FilterDialogValueFormatter.replace(this.m_valuePattern, value1, value2);
};
oFF.FilterDialogValueFormatter.prototype.formatRange = function(lowValue1, lowValue2, highValue1, highValue2, isExcludedRange)
{
	let pattern = isExcludedRange ? this.m_rangeExcludedPattern : this.m_rangePattern;
	return this.formatRangeWithPattern(pattern, lowValue1, lowValue2, highValue1, highValue2);
};
oFF.FilterDialogValueFormatter.prototype.formatRangeSimplified = function(lowValue1, lowValue2, highValue1, highValue2)
{
	return this.formatRangeWithPattern(this.m_rangeSimplifiedPattern, lowValue1, lowValue2, highValue1, highValue2);
};
oFF.FilterDialogValueFormatter.prototype.formatRangeWithPattern = function(pattern, lowValue1, lowValue2, highValue1, highValue2)
{
	let low = oFF.FilterDialogValueFormatter.replace(this.m_valuePattern, lowValue1, lowValue2);
	let high = oFF.FilterDialogValueFormatter.replace(this.m_valuePattern, highValue1, highValue2);
	return oFF.FilterDialogValueFormatter.replace(pattern, low, high);
};
oFF.FilterDialogValueFormatter.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_valuePattern = null;
	this.m_rangePattern = null;
	this.m_rangeExcludedPattern = null;
	this.m_rangeSimplifiedPattern = null;
};
oFF.FilterDialogValueFormatter.prototype.setupComponent = function(valuePattern, rangePattern, rangeExcludedPattern)
{
	this.m_valuePattern = valuePattern;
	if (oFF.isNull(this.m_valuePattern) || !oFF.XString.containsString(this.m_valuePattern, "$1") || !oFF.XString.containsString(this.m_valuePattern, "$2"))
	{
		this.m_valuePattern = oFF.FilterDialogValueFormatter.DEFAULT_VALUE_DISPLAY_PATTERN;
	}
	this.m_rangePattern = rangePattern;
	if (oFF.isNull(this.m_rangePattern) || !oFF.XString.containsString(this.m_rangePattern, "$1") || !oFF.XString.containsString(this.m_rangePattern, "$2"))
	{
		this.m_rangePattern = oFF.FilterDialogValueFormatter.DEFAULT_RANGE_DISPLAY_PATTERN;
		this.m_rangeSimplifiedPattern = oFF.FilterDialogValueFormatter.DEFAULT_RANGE_SIMPLIFIED_PATTERN;
	}
	else
	{
		this.m_rangeSimplifiedPattern = oFF.XString.substring(this.m_rangePattern, oFF.XString.indexOf(this.m_rangePattern, "$1"), oFF.XString.indexOf(this.m_rangePattern, "$2") + 2);
	}
	this.m_rangeExcludedPattern = rangeExcludedPattern;
	if (oFF.isNull(this.m_rangeExcludedPattern) || !oFF.XString.containsString(this.m_rangeExcludedPattern, "$1") || !oFF.XString.containsString(this.m_rangeExcludedPattern, "$2"))
	{
		this.m_rangeExcludedPattern = oFF.FilterDialogValueFormatter.DEFAULT_RANGE_EXCLUDED_DISPLAY_PATTERN;
	}
};

oFF.FilterDialogValueFactory = {

	s_factory:null,
	createDateRangeDynamic:function(dateRange)
	{
			return oFF.FilterDialogValueFactory.s_factory.newDateRangeDynamic(dateRange);
	},
	createDateRangeFixed:function(min, max, granularity, dateTimeProvider)
	{
			return oFF.FilterDialogValueFactory.s_factory.newDateRangeFixed(min, max, granularity, dateTimeProvider);
	},
	createEmptyValue:function()
	{
			return oFF.FilterDialogValueFactory.s_factory.newEmptyValue();
	},
	createNullValue:function()
	{
			return oFF.FilterDialogValueFactory.s_factory.newNullValue();
	},
	createRangeValue:function(low, high, excludedRange)
	{
			return oFF.FilterDialogValueFactory.s_factory.newRangeValue(low, high, excludedRange);
	},
	createSelectionFromFilter:function(dimension, filter)
	{
			return oFF.FilterDialogValueFactory.s_factory.newSelectionFromFilter(dimension, filter);
	},
	createSelectionFromVariable:function(variable)
	{
			return oFF.FilterDialogValueFactory.s_factory.newSelectionFromVariable(variable);
	},
	createTeamValue:function(name, text, icon)
	{
			return oFF.FilterDialogValueFactory.s_factory.newTeamValue(name, text, icon);
	},
	createTeamValueByFile:function(file)
	{
			return oFF.FilterDialogValueFactory.s_factory.newTeamValueByFile(file);
	},
	createUserValue:function(name, text, icon)
	{
			return oFF.FilterDialogValueFactory.s_factory.newUserValue(name, text, icon);
	},
	createUserValueByFile:function(file)
	{
			return oFF.FilterDialogValueFactory.s_factory.newUserValueByFile(file);
	},
	createValue:function(key, displayKey, text)
	{
			return oFF.FilterDialogValueFactory.s_factory.newValue(key, displayKey, text);
	},
	createValueExt:function(key, displayKey, text, hierarchyName, operator)
	{
			return oFF.FilterDialogValueFactory.s_factory.newValueExt(key, displayKey, text, hierarchyName, operator);
	},
	createValueHelpValue:function(node)
	{
			return oFF.FilterDialogValueFactory.s_factory.newValueHelpValue(node);
	},
	createValueHelpValueExt:function(node, hierarchyName, comparisonOperator)
	{
			return oFF.FilterDialogValueFactory.s_factory.newValueHelpValueExt(node, hierarchyName, comparisonOperator);
	},
	createValueWithType:function(key, displayKey, text, valueType)
	{
			return oFF.FilterDialogValueFactory.s_factory.newValueWithType(key, displayKey, text, valueType);
	},
	newDateRangeItemFromCartesianElement:function(filter, filterElement, dimension)
	{
			return oFF.FilterDialogValueFactory.s_factory.newDateRangeItemFromCartesianElement(filter, filterElement, dimension);
	},
	setInstance:function(factory)
	{
			oFF.FilterDialogValueFactory.s_factory = factory;
	}
};

oFF.FilterDialogLambdaBeforeFilterChangeListener = function() {};
oFF.FilterDialogLambdaBeforeFilterChangeListener.prototype = new oFF.XObject();
oFF.FilterDialogLambdaBeforeFilterChangeListener.prototype._ff_c = "FilterDialogLambdaBeforeFilterChangeListener";

oFF.FilterDialogLambdaBeforeFilterChangeListener.create = function(procedure)
{
	let result = new oFF.FilterDialogLambdaBeforeFilterChangeListener();
	result.m_procedure = procedure;
	return result;
};
oFF.FilterDialogLambdaBeforeFilterChangeListener.prototype.m_procedure = null;
oFF.FilterDialogLambdaBeforeFilterChangeListener.prototype.onBeforeChange = function(settings)
{
	if (oFF.notNull(this.m_procedure))
	{
		this.m_procedure(settings);
	}
};
oFF.FilterDialogLambdaBeforeFilterChangeListener.prototype.releaseObject = function()
{
	this.m_procedure = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.FilterDialogMBFUtils = {

	addFormulaFunctionToSelection:function(ifFunction, memberName, result)
	{
			if (oFF.notNull(ifFunction) && oFF.XString.isEqual(ifFunction.getFunctionName(), oFF.FormulaOperator.IF.getName()) && ifFunction.size() === 3)
		{
			let ifCondition = oFF.FilterDialogMBFUtils.asFormulaFunction(ifFunction.get(0));
			if (oFF.notNull(ifCondition))
			{
				let operator = oFF.FilterDialogMBFUtils.getByFormulaOperator(ifCondition.getFunctionName());
				if (operator === oFF.ComparisonOperator.BETWEEN || operator === oFF.ComparisonOperator.NOT_BETWEEN)
				{
					if (ifCondition.size() === 2)
					{
						let itemLow = oFF.FilterDialogMBFUtils.createItemFromFormulaFunction(oFF.FilterDialogMBFUtils.asFormulaFunction(ifCondition.get(0)), memberName, oFF.ComparisonOperator.EQUAL);
						let itemHigh = oFF.FilterDialogMBFUtils.createItemFromFormulaFunction(oFF.FilterDialogMBFUtils.asFormulaFunction(ifCondition.get(1)), memberName, oFF.ComparisonOperator.EQUAL);
						if (oFF.notNull(itemLow) && oFF.notNull(itemHigh))
						{
							result.add(oFF.FilterDialogValueFactory.createRangeValue(itemLow, itemHigh, operator === oFF.ComparisonOperator.NOT_BETWEEN));
						}
					}
				}
				else if (oFF.notNull(operator))
				{
					oFF.XCollectionUtils.addIfNotNull(result, oFF.FilterDialogMBFUtils.createItemFromFormulaFunction(ifCondition, memberName, operator));
				}
			}
			let elsePart = oFF.FilterDialogMBFUtils.asFormulaFunction(ifFunction.get(2));
			oFF.FilterDialogMBFUtils.addFormulaFunctionToSelection(elsePart, memberName, result);
		}
	},
	asFormulaFunction:function(formulaItem)
	{
			return oFF.notNull(formulaItem) && formulaItem.getOlapComponentType() === oFF.OlapComponentType.FORMULA_FUNCTION ? formulaItem : null;
	},
	createFormula:function(filterMeasureBased, memberName, selection)
	{
			if (!oFF.XCollectionUtils.hasElements(selection))
		{
			return null;
		}
		let functionIf = oFF.QFactory.createFormulaFunctionWithName(filterMeasureBased, oFF.FormulaOperator.IF.getName());
		let prevFuntionIf = null;
		let root = functionIf;
		for (let i = 0; i < selection.size(); i++)
		{
			let value = selection.get(i);
			if (!oFF.FilterDialogMBFUtils.isValidValue(value))
			{
				continue;
			}
			let operator = value.getComparisonOperator();
			let formulaOperator = oFF.FilterDialogMBFUtils.getFormulaOperator(operator);
			let isBetweenOperator = operator === oFF.ComparisonOperator.BETWEEN;
			let functionCondition;
			if ((isBetweenOperator || operator === oFF.ComparisonOperator.NOT_BETWEEN) && value.getType() === oFF.FilterDialogValueType.RANGE)
			{
				let rangeValue = value;
				functionCondition = oFF.QFactory.createFormulaFunctionWithName(filterMeasureBased, formulaOperator.getName());
				functionCondition.add(oFF.FilterDialogMBFUtils.createFormulaItemFunction(filterMeasureBased, memberName, isBetweenOperator ? oFF.FormulaOperator.GE : oFF.FormulaOperator.LT, rangeValue.getLow().getKey()));
				functionCondition.add(oFF.FilterDialogMBFUtils.createFormulaItemFunction(filterMeasureBased, memberName, isBetweenOperator ? oFF.FormulaOperator.LE : oFF.FormulaOperator.GT, rangeValue.getHigh().getKey()));
			}
			else
			{
				functionCondition = oFF.FilterDialogMBFUtils.createFormulaItemFunction(filterMeasureBased, memberName, formulaOperator, value.getKey());
			}
			functionIf.add(functionCondition);
			functionIf.add(oFF.QFactory.createFormulaConstantWithStringValue(filterMeasureBased, "1"));
			if (i === selection.size() - 1)
			{
				functionIf.add(oFF.QFactory.createFormulaConstantWithStringValue(filterMeasureBased, "0"));
			}
			else
			{
				prevFuntionIf = functionIf;
				functionIf = oFF.QFactory.createFormulaFunctionWithName(filterMeasureBased, oFF.FormulaOperator.IF.getName());
				prevFuntionIf.add(functionIf);
			}
		}
		if (functionIf.isEmpty())
		{
			if (functionIf === root)
			{
				return null;
			}
			prevFuntionIf.removeAt(2);
			prevFuntionIf.add(oFF.QFactory.createFormulaConstantWithStringValue(filterMeasureBased, "0"));
		}
		return root;
	},
	createFormulaItemFunction:function(filterMeasureBased, memberName, operator, constantValue)
	{
			let fif = oFF.QFactory.createFormulaFunctionWithName(filterMeasureBased, operator.getName());
		fif.add(oFF.QFactory.createFormulaMemberWithName(filterMeasureBased, memberName));
		let value = oFF.QFactory.createFormulaFunctionWithName(filterMeasureBased, oFF.FormulaOperator.DECFLOAT.getName());
		value.add(oFF.QFactory.createFormulaConstantWithStringValue(filterMeasureBased, constantValue));
		fif.add(value);
		return fif;
	},
	createItemFromFormulaFunction:function(fif, memberName, operator)
	{
			if (oFF.notNull(fif) && fif.size() === 2)
		{
			let formulaMember = fif.get(0).getOlapComponentType() === oFF.OlapComponentType.FORMULA_ITEM_MEMBER ? fif.get(0) : null;
			let formulaConstant = oFF.FilterDialogMBFUtils.asFormulaFunction(fif.get(1));
			if (oFF.notNull(formulaMember) && oFF.XString.isEqual(formulaMember.getMemberName(), memberName) && oFF.notNull(formulaConstant) && formulaConstant.hasElements())
			{
				let formulaConstantValue = formulaConstant.get(0);
				if (formulaConstantValue.getOlapComponentType() === oFF.OlapComponentType.FORMULA_CONSTANT)
				{
					return oFF.FilterDialogValueFactory.createValueExt(formulaConstantValue.getString(), null, null, null, operator);
				}
			}
		}
		return null;
	},
	getByFormulaOperator:function(formulaOperatorName)
	{
			if (oFF.XString.isEqual(formulaOperatorName, oFF.FormulaOperator.AND.getName()))
		{
			return oFF.ComparisonOperator.BETWEEN;
		}
		if (oFF.XString.isEqual(formulaOperatorName, oFF.FormulaOperator.OR.getName()))
		{
			return oFF.ComparisonOperator.NOT_BETWEEN;
		}
		if (oFF.XString.isEqual(formulaOperatorName, oFF.FormulaOperator.GT.getName()))
		{
			return oFF.ComparisonOperator.GREATER_THAN;
		}
		if (oFF.XString.isEqual(formulaOperatorName, oFF.FormulaOperator.GE.getName()))
		{
			return oFF.ComparisonOperator.GREATER_EQUAL;
		}
		if (oFF.XString.isEqual(formulaOperatorName, oFF.FormulaOperator.LT.getName()))
		{
			return oFF.ComparisonOperator.LESS_THAN;
		}
		if (oFF.XString.isEqual(formulaOperatorName, oFF.FormulaOperator.LE.getName()))
		{
			return oFF.ComparisonOperator.LESS_EQUAL;
		}
		if (oFF.XString.isEqual(formulaOperatorName, oFF.FormulaOperator.EQ.getName()))
		{
			return oFF.ComparisonOperator.EQUAL;
		}
		if (oFF.XString.isEqual(formulaOperatorName, oFF.FormulaOperator.NE.getName()))
		{
			return oFF.ComparisonOperator.NOT_EQUAL;
		}
		return null;
	},
	getFilterRanges:function(filterMeasureBased)
	{
			let result = oFF.XList.create();
		let memberName = oFF.FilterDialogMBFUtils.getMemberName(filterMeasureBased);
		if (oFF.notNull(memberName))
		{
			oFF.FilterDialogMBFUtils.addFormulaFunctionToSelection(oFF.FilterDialogMBFUtils.asFormulaFunction(filterMeasureBased.getFormula()), memberName, result);
		}
		return result;
	},
	getFilterRangesByMemberName:function(filterMeasureBased, memberName)
	{
			let result = oFF.XList.create();
		oFF.FilterDialogMBFUtils.addFormulaFunctionToSelection(oFF.FilterDialogMBFUtils.asFormulaFunction(filterMeasureBased.getFormula()), memberName, result);
		return result;
	},
	getFormulaOperator:function(comparisonOperator)
	{
			if (comparisonOperator === oFF.ComparisonOperator.BETWEEN)
		{
			return oFF.FormulaOperator.AND;
		}
		if (comparisonOperator === oFF.ComparisonOperator.NOT_BETWEEN)
		{
			return oFF.FormulaOperator.OR;
		}
		if (comparisonOperator === oFF.ComparisonOperator.GREATER_THAN)
		{
			return oFF.FormulaOperator.GT;
		}
		if (comparisonOperator === oFF.ComparisonOperator.GREATER_EQUAL)
		{
			return oFF.FormulaOperator.GE;
		}
		if (comparisonOperator === oFF.ComparisonOperator.LESS_THAN)
		{
			return oFF.FormulaOperator.LT;
		}
		if (comparisonOperator === oFF.ComparisonOperator.LESS_EQUAL)
		{
			return oFF.FormulaOperator.LE;
		}
		if (comparisonOperator === oFF.ComparisonOperator.NOT_EQUAL)
		{
			return oFF.FormulaOperator.NE;
		}
		return oFF.FormulaOperator.EQ;
	},
	getMemberName:function(filterMeasureBased)
	{
			return oFF.FilterDialogMBFUtils.getMemberNameFromFormula(oFF.FilterDialogMBFUtils.asFormulaFunction(filterMeasureBased.getFormula()));
	},
	getMemberNameFromFormula:function(ifFunction)
	{
			if (oFF.notNull(ifFunction) && oFF.XString.isEqual(ifFunction.getFunctionName(), oFF.FormulaOperator.IF.getName()) && ifFunction.hasElements())
		{
			let condition = oFF.FilterDialogMBFUtils.asFormulaFunction(ifFunction.get(0));
			let operator = oFF.notNull(condition) ? oFF.FilterDialogMBFUtils.getByFormulaOperator(condition.getFunctionName()) : null;
			if (operator === oFF.ComparisonOperator.BETWEEN || operator === oFF.ComparisonOperator.NOT_BETWEEN)
			{
				condition = oFF.FilterDialogMBFUtils.asFormulaFunction(condition.get(0));
			}
			if (oFF.notNull(condition) && condition.hasElements())
			{
				let formulaMember = condition.get(0).getOlapComponentType() === oFF.OlapComponentType.FORMULA_ITEM_MEMBER ? condition.get(0) : null;
				if (oFF.notNull(formulaMember) && oFF.XStringUtils.isNotNullAndNotEmpty(formulaMember.getMemberName()))
				{
					return formulaMember.getMemberName();
				}
			}
			return oFF.FilterDialogMBFUtils.getMemberNameFromFormula(oFF.FilterDialogMBFUtils.asFormulaFunction(ifFunction.get(2)));
		}
		return null;
	},
	isValidValue:function(value)
	{
			if (oFF.isNull(value) || value.isNull())
		{
			return false;
		}
		if (value.getType() === oFF.FilterDialogValueType.RANGE)
		{
			let rangeValue = value;
			return !rangeValue.getLow().isNull() && rangeValue.getLow().getKey() !== null && !rangeValue.getHigh().isNull() && rangeValue.getHigh().getKey() !== null;
		}
		return value.getKey() !== null;
	}
};

oFF.FilterDialogValueStatement = function() {};
oFF.FilterDialogValueStatement.prototype = new oFF.XObject();
oFF.FilterDialogValueStatement.prototype._ff_c = "FilterDialogValueStatement";

oFF.FilterDialogValueStatement.create = function(value, filterExpression, keyField, supplementDisplayKeyField, supplementTextField)
{
	let container = new oFF.FilterDialogValueStatement();
	container.setupValueStatement(value, filterExpression, keyField.getDimension().getFilterCapabilities().getFilterCapabilitiesByField(keyField), keyField, supplementDisplayKeyField, supplementTextField, false);
	return container;
};
oFF.FilterDialogValueStatement.createForVariableValue = function(value, variable, supplementDisplayKeyField, supplementTextField)
{
	let container = new oFF.FilterDialogValueStatement();
	let memberFilter = variable.getMemberFilter();
	container.setupValueStatement(value, memberFilter.getFilterExpression(), variable.getFilterCapability(), memberFilter.getField(), supplementDisplayKeyField, supplementTextField, true);
	return container;
};
oFF.FilterDialogValueStatement.prototype.m_filterCapability = null;
oFF.FilterDialogValueStatement.prototype.m_filterContext = null;
oFF.FilterDialogValueStatement.prototype.m_isVariableFilter = false;
oFF.FilterDialogValueStatement.prototype.m_keyField = null;
oFF.FilterDialogValueStatement.prototype.m_supplementDisplayKeyField = null;
oFF.FilterDialogValueStatement.prototype.m_supplementTextField = null;
oFF.FilterDialogValueStatement.prototype.m_value = null;
oFF.FilterDialogValueStatement.prototype._setComparisonOperator = function(filterOp)
{
	let operator = this.m_value.getComparisonOperator();
	filterOp.setComparisonOperator(this.m_value.isNull() ? oFF.ComparisonOperator.IS_NULL : operator);
	filterOp.setSetSign(oFF.SetSign.INCLUDING);
	let supportedExcludingOperators = oFF.notNull(this.m_filterCapability) ? this.m_filterCapability.getSupportedComparisonOperators(oFF.SetSign.EXCLUDING) : null;
	if (oFF.notNull(supportedExcludingOperators))
	{
		if (this.m_value.isNull())
		{
			if (operator === oFF.ComparisonOperator.NOT_EQUAL && supportedExcludingOperators.contains(oFF.ComparisonOperator.IS_NULL))
			{
				filterOp.setSetSign(oFF.SetSign.EXCLUDING);
			}
		}
		else if (operator === oFF.ComparisonOperator.NOT_EQUAL)
		{
			if (supportedExcludingOperators.contains(oFF.ComparisonOperator.EQUAL))
			{
				filterOp.setComparisonOperator(oFF.ComparisonOperator.EQUAL);
				filterOp.setSetSign(oFF.SetSign.EXCLUDING);
			}
		}
		else if (operator === oFF.ComparisonOperator.NOT_BETWEEN)
		{
			if (supportedExcludingOperators.contains(oFF.ComparisonOperator.BETWEEN))
			{
				filterOp.setComparisonOperator(oFF.ComparisonOperator.BETWEEN);
				filterOp.setSetSign(oFF.SetSign.EXCLUDING);
			}
		}
		else if (operator === oFF.ComparisonOperator.NOT_MATCH)
		{
			if (supportedExcludingOperators.contains(oFF.ComparisonOperator.MATCH))
			{
				filterOp.setComparisonOperator(oFF.ComparisonOperator.MATCH);
				filterOp.setSetSign(oFF.SetSign.EXCLUDING);
			}
		}
		else if (this.m_value.isExcluded() && supportedExcludingOperators.contains(operator))
		{
			filterOp.setSetSign(oFF.SetSign.EXCLUDING);
		}
	}
};
oFF.FilterDialogValueStatement.prototype._setFilterValue = function(valueBag, value, filterOperation)
{
	if (value.getType() === oFF.FilterDialogValueType.VALUEHELP)
	{
		valueBag.setDimensionMember(value.getValueHelpNode().getDimensionMember());
	}
	else
	{
		let key = value.getKey();
		valueBag.setValue(oFF.XValueUtil.getValueFromString(oFF.notNull(key) ? key : "", this.m_keyField.getValueType()));
	}
	filterOperation.setField(this.m_keyField);
	if (oFF.FilterDialogValueUtils.supportsDisplayKeySupplement(this.m_keyField, this.m_supplementDisplayKeyField) && (this.m_keyField !== this.m_supplementDisplayKeyField || !oFF.XString.isEqual(value.getDisplayKey(), value.getDisplayKeyFormatted())))
	{
		valueBag.addSupplementValue(this.m_supplementDisplayKeyField.getName(), this.m_supplementDisplayKeyField.getValueType().isDateTime() ? value.getDisplayKeyFormatted() : value.getDisplayKey());
	}
	if (oFF.notNull(this.m_supplementTextField))
	{
		valueBag.addSupplementValue(this.m_supplementTextField.getName(), value.getText());
	}
};
oFF.FilterDialogValueStatement.prototype.getFilterCapability = function()
{
	return this.m_filterCapability;
};
oFF.FilterDialogValueStatement.prototype.getFilterContext = function()
{
	return this.m_filterContext;
};
oFF.FilterDialogValueStatement.prototype.getKeyField = function()
{
	return this.m_keyField;
};
oFF.FilterDialogValueStatement.prototype.getSupplementDisplayKeyField = function()
{
	return this.m_supplementDisplayKeyField;
};
oFF.FilterDialogValueStatement.prototype.getSupplementTextField = function()
{
	return this.m_supplementTextField;
};
oFF.FilterDialogValueStatement.prototype.getValue = function()
{
	return this.m_value;
};
oFF.FilterDialogValueStatement.prototype.mapToFilterOperation = function()
{
	let type = this.m_value.getType();
	let filterElement;
	if (!this.m_isVariableFilter && (type === oFF.FilterDialogValueType.DATE_RANGE_FIXED || type === oFF.FilterDialogValueType.DATE_RANGE_DYNAMIC))
	{
		filterElement = oFF.QFactory.createFilterOperationDateRange(this.m_filterContext, this.m_keyField);
	}
	else
	{
		filterElement = oFF.QFactory.createFilterOperation(this.m_filterContext, this.m_keyField);
	}
	if (!this.m_isVariableFilter)
	{
		filterElement.setHierarchyName(this.m_value.getHierarchyName());
	}
	this._setComparisonOperator(filterElement);
	if (type === oFF.FilterDialogValueType.RANGE)
	{
		this._setFilterValue(filterElement.getLow(), this.m_value.getLow(), filterElement);
		this._setFilterValue(filterElement.getHigh(), this.m_value.getHigh(), filterElement);
	}
	else if (!this.m_isVariableFilter && (type === oFF.FilterDialogValueType.DATE_RANGE_FIXED || type === oFF.FilterDialogValueType.DATE_RANGE_DYNAMIC))
	{
		filterElement.setDateRange(this.m_value.getDateRange(), this.m_keyField);
	}
	else if (!this.m_value.isNull())
	{
		this._setFilterValue(filterElement.getLow(), this.m_value, filterElement);
	}
	return filterElement;
};
oFF.FilterDialogValueStatement.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_filterContext = null;
	this.m_filterCapability = null;
	this.m_keyField = null;
	this.m_supplementDisplayKeyField = null;
	this.m_supplementTextField = null;
};
oFF.FilterDialogValueStatement.prototype.setupValueStatement = function(value, filterExpression, filterCapability, keyField, supplementDisplayKeyField, supplementTextField, isVariableFilter)
{
	this.m_value = value;
	this.m_filterContext = filterExpression;
	this.m_filterCapability = filterCapability;
	this.m_isVariableFilter = isVariableFilter;
	this.m_keyField = keyField;
	this.m_supplementDisplayKeyField = supplementDisplayKeyField;
	this.m_supplementTextField = supplementTextField;
};

oFF.FilterDialogValueUtils = {

	_updateFilterWithSelection:function(dimension, variable, filter, selection, mapper)
	{
			oFF.XObjectExt.assertNotNullExt(dimension, "Dimension must not be null");
		oFF.XObjectExt.assertNotNullExt(filter, "Filter must not be null");
		oFF.XObjectExt.assertNotNullExt(selection, "Selection must not be null");
		filter.clear();
		let hierarchyName = selection.get(0).getHierarchyName();
		let isVariableFilter = oFF.notNull(variable);
		let isHierarchical = oFF.XStringUtils.isNotNullAndNotEmpty(hierarchyName);
		let convertToFlat = isHierarchical && !isVariableFilter && (!dimension.isHierarchyActive() || !oFF.XString.isEqual(hierarchyName, dimension.getHierarchyName()));
		let keyField = oFF.FilterDialogValueUtils.getKeyField(dimension, variable, isHierarchical);
		let dkField = isHierarchical ? dimension.getHierarchyDisplayKeyField() : dimension.getFlatDisplayKeyField();
		let displayKeyField = oFF.FilterDialogValueUtils.supportsDisplayKeySupplement(keyField, dkField) ? dkField : null;
		let textField = oFF.XStream.of(selection).map((s) => {
			return oFF.FilterDialogValueUtils.mapToValueHelpValue(s);
		}).filterNullValues().map((vhv) => {
			return vhv.getTextField();
		}).findAny().orElseGet(() => {
			return isHierarchical ? dimension.getHierarchyTextField() : dimension.getFlatTextField();
		});
		if (!isVariableFilter)
		{
			filter.setHierarchyName(hierarchyName);
			filter.setConvertToFlatFilter(convertToFlat);
		}
		filter.setField(keyField);
		filter.addSupplementField(displayKeyField);
		filter.addSupplementField(textField);
		oFF.XCollectionUtils.forEach(selection, (selectedValue) => {
			let filterOp = null;
			let valueStatement;
			if (isVariableFilter)
			{
				valueStatement = oFF.FilterDialogValueStatement.createForVariableValue(selectedValue, variable, displayKeyField, textField);
			}
			else
			{
				valueStatement = oFF.FilterDialogValueStatement.create(selectedValue, filter.getFilterExpression(), keyField, displayKeyField, textField);
			}
			if (oFF.notNull(mapper))
			{
				filterOp = mapper(valueStatement);
			}
			if (oFF.isNull(filterOp))
			{
				filterOp = valueStatement.mapToFilterOperation();
			}
			valueStatement.releaseObject();
			oFF.XCollectionUtils.addIfNotPresent(filter, filterOp);
		});
	},
	_updateMBF:function(filterMeasureBased, memberName, dimensionContext, crossCalculationMeasure, selection)
	{
			filterMeasureBased.clearDimensionContext();
		oFF.XCollectionUtils.forEach(dimensionContext, (dimContext) => {
			filterMeasureBased.addDimensionContext(dimContext);
		});
		filterMeasureBased.setCrossCalculationMeasure(crossCalculationMeasure);
		filterMeasureBased.setFormula(oFF.FilterDialogMBFUtils.createFormula(filterMeasureBased, memberName, selection));
		filterMeasureBased.setLinkQueryFilter(true);
	},
	getKeyField:function(dimension, variable, isHierarchical)
	{
			if (oFF.QVariableUtils.useKeyNotCompoundForVariableFilter(variable))
		{
			let keyNotCompoundField = dimension.getFirstFieldByType(oFF.PresentationType.KEY_NOT_COMPOUND);
			if (oFF.notNull(keyNotCompoundField))
			{
				return keyNotCompoundField;
			}
		}
		return isHierarchical ? dimension.getHierarchyKeyField() : dimension.getFlatKeyField();
	},
	mapToValueHelpValue:function(value)
	{
			if (oFF.notNull(value) && value.getType() === oFF.FilterDialogValueType.VALUEHELP)
		{
			return value;
		}
		if (oFF.notNull(value) && value.getType() === oFF.FilterDialogValueType.RANGE)
		{
			let low = value.getLow();
			if (oFF.notNull(low) && low.getType() === oFF.FilterDialogValueType.VALUEHELP)
			{
				return low;
			}
			let high = value.getLow();
			if (oFF.notNull(high) && high.getType() === oFF.FilterDialogValueType.VALUEHELP)
			{
				return high;
			}
		}
		return null;
	},
	newSelectionFromFilter:function(dimension, filter)
	{
			return oFF.FilterDialogValueFactory.createSelectionFromFilter(dimension, filter);
	},
	newSelectionFromMeasureBasedFilter:function(filterMeasureBased)
	{
			return oFF.FilterDialogMBFUtils.getFilterRanges(filterMeasureBased);
	},
	newSelectionFromVariable:function(variable)
	{
			return oFF.FilterDialogValueFactory.createSelectionFromVariable(variable);
	},
	supportsDisplayKeySupplement:function(keyField, displayKeyField)
	{
			return oFF.notNull(keyField) && oFF.notNull(displayKeyField) && (keyField !== displayKeyField || keyField.getValueType().isDateTime());
	},
	supportsFilterOnDimension:function(dimension)
	{
			return oFF.notNull(dimension) && dimension.getKeyField() !== null && dimension.getKeyField().isFilterable();
	},
	updateDynamicFilter:function(dimension, selection)
	{
			oFF.FilterDialogValueUtils.updateDynamicFilterExt(dimension, selection, null);
	},
	updateDynamicFilterExt:function(dimension, selection, mapper)
	{
			if (oFF.isNull(dimension))
		{
			return;
		}
		let hasSelection = oFF.XCollectionUtils.hasElements(selection);
		let filter = dimension.getFilter();
		if (hasSelection || oFF.notNull(filter))
		{
			let queryFilter = dimension.getQueryModel().getFilter();
			queryFilter.queueEventing();
			let dynamicFilter = queryFilter.getDynamicFilter();
			if (hasSelection)
			{
				oFF.FilterDialogValueUtils._updateFilterWithSelection(dimension, null, oFF.notNull(filter) ? filter : dynamicFilter.getCartesianProductWithDefault().getCartesianListWithDefault(dimension), selection, mapper);
			}
			else
			{
				dynamicFilter.removeFilterById(filter.getUniqueId());
			}
			queryFilter.resumeEventing();
		}
	},
	updateLayeredFilter:function(dimension, layeredFilterName, selection)
	{
			oFF.FilterDialogValueUtils.updateLayeredFilterExt(dimension, layeredFilterName, selection, null);
	},
	updateLayeredFilterExt:function(dimension, layeredFilterName, selection, mapper)
	{
			if (oFF.isNull(dimension) || oFF.XStringUtils.isNullOrEmpty(layeredFilterName))
		{
			return;
		}
		let hasSelection = oFF.XCollectionUtils.hasElements(selection);
		let queryFilter = dimension.getQueryModel().getFilter();
		let layeredFilter = queryFilter.getLinkedFilter(layeredFilterName);
		let filter = oFF.notNull(layeredFilter) ? layeredFilter.getCartesianList(dimension) : null;
		if (hasSelection || oFF.notNull(filter))
		{
			queryFilter.queueEventing();
			if (oFF.isNull(layeredFilter))
			{
				layeredFilter = oFF.QFactory.createFilterExpression(queryFilter, queryFilter);
				queryFilter.linkFilter(layeredFilterName, layeredFilter);
			}
			layeredFilter.setPreserveOnRepoSerialization(true);
			if (hasSelection)
			{
				oFF.FilterDialogValueUtils._updateFilterWithSelection(dimension, null, oFF.notNull(filter) ? filter : layeredFilter.getCartesianProductWithDefault().getCartesianListWithDefault(dimension), selection, mapper);
			}
			else
			{
				layeredFilter.removeFilterById(filter.getUniqueId());
				if (!layeredFilter.getFilterRootElement().getChildren().hasNext())
				{
					queryFilter.linkFilter(layeredFilterName, null);
				}
			}
			queryFilter.resumeEventing();
		}
	},
	updateMeasureBasedFilter:function(filterMeasureBased, layeredFilterName, memberName, dimensionContext, crossCalculationMeasure, selection)
	{
			if (oFF.isNull(filterMeasureBased) || oFF.XStringUtils.isNullOrEmpty(memberName) || !oFF.XCollectionUtils.hasElements(dimensionContext))
		{
			return;
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(layeredFilterName))
		{
			let queryFilter = filterMeasureBased.getQueryModel().getFilter();
			queryFilter.queueEventing();
			oFF.FilterDialogValueUtils._updateMBF(filterMeasureBased, memberName, dimensionContext, crossCalculationMeasure, selection);
			if (filterMeasureBased.getFormula() === null)
			{
				queryFilter.linkFilter(layeredFilterName, null);
			}
			else
			{
				let linkedFilter = queryFilter.getLinkedFilter(layeredFilterName);
				if (oFF.isNull(linkedFilter))
				{
					linkedFilter = oFF.QFactory.createFilterExpression(queryFilter, queryFilter);
					queryFilter.linkFilter(layeredFilterName, linkedFilter);
				}
				linkedFilter.setPreserveOnRepoSerialization(true);
				if (linkedFilter.getFilterRootElement() !== filterMeasureBased)
				{
					linkedFilter.setComplexRoot(filterMeasureBased);
				}
			}
			queryFilter.resumeEventing();
		}
		else
		{
			filterMeasureBased.queueEventing();
			oFF.FilterDialogValueUtils._updateMBF(filterMeasureBased, memberName, dimensionContext, crossCalculationMeasure, selection);
			filterMeasureBased.resumeEventing();
		}
	},
	updateVariableFilter:function(variable, selection)
	{
			oFF.FilterDialogValueUtils.updateVariableFilterExt(variable, selection, null);
	},
	updateVariableFilterExt:function(variable, selection, mapper)
	{
			if (oFF.notNull(variable))
		{
			if (oFF.XCollectionUtils.hasElements(selection))
			{
				let memberFilter = variable.getMemberFilter();
				memberFilter.queueEventing();
				oFF.FilterDialogValueUtils._updateFilterWithSelection(variable.getDimension(), variable, memberFilter, selection, mapper);
				memberFilter.resumeEventing();
			}
			else if (variable.hasMemberFilter())
			{
				variable.getMemberFilter().clear();
			}
		}
	}
};

oFF.OuDataProviderCPConstants = {

	CMD_CREATE_DATA_PROVIDER_WITH_CONFIG:"createDataProviderWithConfig",
	CMD_GET_ACTIVE_DATA_PROVIDER:"getActiveDataProvider",
	CMD_GET_ALL_DATA_PROVIDER_NAMES:"getAllDataProviderNames",
	CMD_GET_DATA_PROVIDER_BY_NAME:"getDataProviderByName",
	CMD_REGISTER_DATA_PROVIDER_CONFIG:"registerDataProviderConfig",
	CMD_REGISTER_EXISTING_DATA_PROVIDER:"registerExistingDataProvider",
	CMD_REGISTER_EXISTING_QUERY_MANAGER:"registerExistingQueryManager",
	CMD_RELEASE_DATA_PROVIDER:"releaseDataProvider",
	CMD_SET_ACTIVE_DATA_PROVIDER:"setActiveDataProvider",
	CMD_SET_ACTIVE_VIZ_NAME:"setActiveVizName",
	CONFIG_DATA_PROVIDER_CONFIG:"config",
	CONFIG_DATA_PROVIDER_LIST:"dataProviders",
	CONFIG_DATA_PROVIDER_NAME:"dataProviderName",
	CONFIG_SHARED_DATA_SPACE_NAME:"sharedDataSpaceName",
	NOTIFICATION_ACTIVE_DATA_PROVIDER_CHANGED:"com.sap.ff.DataProviderCommand.Notification.ActiveProviderChanged",
	NOTIFICATION_DATA_PROVIDER_ADDED:"com.sap.ff.DataProviderCommand.Notification.Added",
	NOTIFICATION_DATA_PROVIDER_REMOVED:"com.sap.ff.DataProviderCommand.Notification.Removed",
	NOTIFICATION_PARAM_DATA_PROVIDER_NAME:"com.sap.ff.DataProviderCommand.NotificationData.DataProviderName"
};

oFF.OuDataProviderCPParam = function() {};
oFF.OuDataProviderCPParam.prototype = new oFF.XObject();
oFF.OuDataProviderCPParam.prototype._ff_c = "OuDataProviderCPParam";

oFF.OuDataProviderCPParam.createForCreateDataProviderWithConfig = function(config)
{
	let obj = new oFF.OuDataProviderCPParam();
	obj.setupParameter(null, config, null, null);
	return obj;
};
oFF.OuDataProviderCPParam.createForGetDataProvider = function(dataProviderName)
{
	let obj = new oFF.OuDataProviderCPParam();
	obj.setupParameter(dataProviderName, null, null, null);
	return obj;
};
oFF.OuDataProviderCPParam.createForRegisterDataSource = function(dataProviderName, config)
{
	let obj = new oFF.OuDataProviderCPParam();
	obj.setupParameter(dataProviderName, config, null, null);
	return obj;
};
oFF.OuDataProviderCPParam.createForRegisterExistingDataProvider = function(dataProviderName, dataProvider)
{
	let obj = new oFF.OuDataProviderCPParam();
	obj.setupParameter(dataProviderName, null, null, dataProvider);
	return obj;
};
oFF.OuDataProviderCPParam.createForRegisterExistingQueryManager = function(dataProviderName, queryManager)
{
	let obj = new oFF.OuDataProviderCPParam();
	obj.setupParameter(dataProviderName, null, queryManager, null);
	return obj;
};
oFF.OuDataProviderCPParam.prototype.m_dataProvider = null;
oFF.OuDataProviderCPParam.prototype.m_dataProviderConfig = null;
oFF.OuDataProviderCPParam.prototype.m_dataProviderName = null;
oFF.OuDataProviderCPParam.prototype.m_queryManager = null;
oFF.OuDataProviderCPParam.prototype.getDataProvider = function()
{
	return this.m_dataProvider;
};
oFF.OuDataProviderCPParam.prototype.getDataProviderConfig = function()
{
	return this.m_dataProviderConfig;
};
oFF.OuDataProviderCPParam.prototype.getDataProviderName = function()
{
	return this.m_dataProviderName;
};
oFF.OuDataProviderCPParam.prototype.getQueryManager = function()
{
	return this.m_queryManager;
};
oFF.OuDataProviderCPParam.prototype.setupParameter = function(dataProviderName, config, queryManager, dataProvider)
{
	this.m_dataProviderName = dataProviderName;
	this.m_dataProviderConfig = config;
	this.m_queryManager = queryManager;
	this.m_dataProvider = dataProvider;
};

oFF.OuDataProviderCPStorage = function() {};
oFF.OuDataProviderCPStorage.prototype = new oFF.XObject();
oFF.OuDataProviderCPStorage.prototype._ff_c = "OuDataProviderCPStorage";

oFF.OuDataProviderCPStorage.createDpStorage = function()
{
	let obj = new oFF.OuDataProviderCPStorage();
	obj.setup();
	return obj;
};
oFF.OuDataProviderCPStorage.prototype.m_activeDataProviders = null;
oFF.OuDataProviderCPStorage.prototype.m_addListeners = null;
oFF.OuDataProviderCPStorage.prototype.m_dataProviderConfigs = null;
oFF.OuDataProviderCPStorage.prototype.m_dataProviderPromises = null;
oFF.OuDataProviderCPStorage.prototype.m_removeListeners = null;
oFF.OuDataProviderCPStorage.prototype.getActiveDataProviders = function()
{
	return this.m_activeDataProviders;
};
oFF.OuDataProviderCPStorage.prototype.getAllAvailableDataProviderNames = function()
{
	let names = oFF.XHashSetOfString.create();
	names.addAll(this.m_dataProviderConfigs.getKeysAsReadOnlyList());
	names.addAll(this.m_dataProviderPromises.getKeysAsReadOnlyList());
	names.addAll(this.m_activeDataProviders.getKeysAsReadOnlyList());
	return names;
};
oFF.OuDataProviderCPStorage.prototype.getDataProviderAddListeners = function()
{
	return this.m_addListeners;
};
oFF.OuDataProviderCPStorage.prototype.getDataProviderConfigs = function()
{
	return this.m_dataProviderConfigs;
};
oFF.OuDataProviderCPStorage.prototype.getDataProviderPromises = function()
{
	return this.m_dataProviderPromises;
};
oFF.OuDataProviderCPStorage.prototype.getDataProviderRemoveListeners = function()
{
	return this.m_removeListeners;
};
oFF.OuDataProviderCPStorage.prototype.notifyAddListeners = function(dataProviderName)
{
	this.m_addListeners.accept(oFF.XStringValue.create(dataProviderName));
};
oFF.OuDataProviderCPStorage.prototype.notifyRemoveListeners = function(dataProviderName)
{
	this.m_removeListeners.accept(oFF.XStringValue.create(dataProviderName));
};
oFF.OuDataProviderCPStorage.prototype.putActiveDataProvider = function(dataProviderName, dataProvider)
{
	this.m_activeDataProviders.put(dataProviderName, dataProvider);
	this.m_dataProviderConfigs.put(dataProviderName, dataProvider.getConfig());
	this.notifyAddListeners(dataProviderName);
};
oFF.OuDataProviderCPStorage.prototype.putDataProviderConfig = function(dataProviderName, config)
{
	this.m_dataProviderConfigs.put(dataProviderName, config);
	this.notifyAddListeners(dataProviderName);
};
oFF.OuDataProviderCPStorage.prototype.putDataProviderPromise = function(dataProviderName, dataProviderPromise)
{
	this.m_dataProviderPromises.put(dataProviderName, dataProviderPromise);
	dataProviderPromise.then((newDataProvider) => {
		this.m_activeDataProviders.put(dataProviderName, newDataProvider);
		this.m_dataProviderPromises.remove(dataProviderName);
		return newDataProvider;
	}, null);
	this.notifyAddListeners(dataProviderName);
};
oFF.OuDataProviderCPStorage.prototype.releaseObject = function()
{
	this.m_activeDataProviders = oFF.XObjectExt.release(this.m_activeDataProviders);
	this.m_dataProviderPromises = oFF.XObjectExt.release(this.m_dataProviderPromises);
	this.m_dataProviderConfigs = oFF.XObjectExt.release(this.m_dataProviderConfigs);
	this.m_addListeners = oFF.XObjectExt.release(this.m_addListeners);
	this.m_removeListeners = oFF.XObjectExt.release(this.m_removeListeners);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.OuDataProviderCPStorage.prototype.removeActiveDataProvider = function(dataProviderName)
{
	this.m_activeDataProviders.remove(dataProviderName);
	this.m_dataProviderPromises.remove(dataProviderName);
	this.notifyRemoveListeners(dataProviderName);
};
oFF.OuDataProviderCPStorage.prototype.setup = function()
{
	oFF.XObject.prototype.setup.call( this );
	this.m_activeDataProviders = oFF.XHashMapByString.create();
	this.m_dataProviderPromises = oFF.XHashMapByString.create();
	this.m_dataProviderConfigs = oFF.XHashMapByString.create();
	this.m_addListeners = oFF.XConsumerCollection.create();
	this.m_removeListeners = oFF.XConsumerCollection.create();
};

oFF.OuDataProviderPluginEventManager = function() {};
oFF.OuDataProviderPluginEventManager.prototype = new oFF.XObject();
oFF.OuDataProviderPluginEventManager.prototype._ff_c = "OuDataProviderPluginEventManager";

oFF.OuDataProviderPluginEventManager.create = function(controller, dataProviderName)
{
	let manager = new oFF.OuDataProviderPluginEventManager();
	manager._setupExt(controller, dataProviderName);
	return manager;
};
oFF.OuDataProviderPluginEventManager.prototype.m_controller = null;
oFF.OuDataProviderPluginEventManager.prototype.m_dataProvider = null;
oFF.OuDataProviderPluginEventManager.prototype.m_dataProviderName = null;
oFF.OuDataProviderPluginEventManager.prototype.m_dpAddedObserverId = null;
oFF.OuDataProviderPluginEventManager.prototype.m_dpLifecycleObserverId = null;
oFF.OuDataProviderPluginEventManager.prototype.m_dpModelChangeListener = null;
oFF.OuDataProviderPluginEventManager.prototype.m_dpModelChangeObserverId = null;
oFF.OuDataProviderPluginEventManager.prototype.m_dpReadyListener = null;
oFF.OuDataProviderPluginEventManager.prototype.m_dpReleasedListener = null;
oFF.OuDataProviderPluginEventManager.prototype.m_dpRemovedObserverId = null;
oFF.OuDataProviderPluginEventManager.prototype.m_dpResultDataFetchListener = null;
oFF.OuDataProviderPluginEventManager.prototype.m_dpResultDataFetchObserverId = null;
oFF.OuDataProviderPluginEventManager.prototype.m_dpVizChangeListener = null;
oFF.OuDataProviderPluginEventManager.prototype.m_dpVizChangeObserverId = null;
oFF.OuDataProviderPluginEventManager.prototype._observeDataProviderChanges = function()
{
	if (oFF.notNull(this.m_dataProvider))
	{
		let eventing = this.m_dataProvider.getEventing();
		this.m_dpModelChangeObserverId = eventing.getListenerForModelChanges().addConsumer(this._onDataProviderModelChange.bind(this));
		this.m_dpVizChangeObserverId = eventing.getListenerForVisualizationChanges().addConsumer(this._onDataProviderVizChange.bind(this));
		this.m_dpResultDataFetchObserverId = eventing.getListenerForResultDataFetch().addConsumer(this._onDataProviderResultDataFetch.bind(this));
		this.m_dpLifecycleObserverId = eventing.getListenerForLifecycle().addConsumer(this._onDataProviderLifecycleChange.bind(this));
	}
};
oFF.OuDataProviderPluginEventManager.prototype._observeDataProviderEvents = function()
{
	let notificationCenter = this.m_controller.getLocalNotificationCenter();
	let setDataProviderProcedure;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_dataProviderName))
	{
		setDataProviderProcedure = oFF.XProcedureHolder.create(() => {
			let dpPromise = oFF.OuDataProviderCommandPlugin.runGetDataProviderByName(this.m_controller, this.m_dataProviderName);
			this._setDataProviderFromPromise(dpPromise);
		});
		setDataProviderProcedure.execute();
		this.m_dpAddedObserverId = notificationCenter.addObserverForName(oFF.OuDataProviderCPConstants.NOTIFICATION_DATA_PROVIDER_ADDED, (data) => {
			let addedDPName = data.getStringByKey(oFF.OuDataProviderCPConstants.NOTIFICATION_PARAM_DATA_PROVIDER_NAME);
			if (oFF.XString.isEqual(addedDPName, this.m_dataProviderName))
			{
				setDataProviderProcedure.execute();
			}
		});
	}
	else
	{
		setDataProviderProcedure = oFF.XProcedureHolder.create(() => {
			let dpPromise = oFF.OuDataProviderCommandPlugin.runGetActiveDataProvider(this.m_controller);
			this._setDataProviderFromPromise(dpPromise);
		});
		setDataProviderProcedure.execute();
		this.m_dpAddedObserverId = notificationCenter.addObserverForName(oFF.OuDataProviderCPConstants.NOTIFICATION_ACTIVE_DATA_PROVIDER_CHANGED, (data) => {
			setDataProviderProcedure.execute();
		});
	}
	this.m_dpRemovedObserverId = notificationCenter.addObserverForName(oFF.OuDataProviderCPConstants.NOTIFICATION_DATA_PROVIDER_REMOVED, (data) => {
		let removedDPName = data.getStringByKey(oFF.OuDataProviderCPConstants.NOTIFICATION_PARAM_DATA_PROVIDER_NAME);
		if (oFF.notNull(this.m_dataProvider))
		{
			let currentDpName = this.m_dataProvider.getName();
			if (oFF.XString.isEqual(removedDPName, currentDpName))
			{
				this._resetDataProvider();
			}
		}
	});
};
oFF.OuDataProviderPluginEventManager.prototype._onDataProviderLifecycleChange = function(evt)
{
	if (evt.isNewlyConnected())
	{
		this._onDataProviderReady();
	}
	else if (evt.getNewState() === oFF.OuDataProviderLifecycle.RELEASED)
	{
		this._resetDataProvider();
	}
};
oFF.OuDataProviderPluginEventManager.prototype._onDataProviderModelChange = function(evt)
{
	if (oFF.notNull(this.m_dpModelChangeListener))
	{
		this.m_dpModelChangeListener(this.m_dataProvider, evt);
	}
};
oFF.OuDataProviderPluginEventManager.prototype._onDataProviderReady = function()
{
	if (oFF.notNull(this.m_dpReadyListener))
	{
		this.m_dpReadyListener(this.m_dataProvider);
	}
};
oFF.OuDataProviderPluginEventManager.prototype._onDataProviderResultDataFetch = function(evt)
{
	if (oFF.notNull(this.m_dpResultDataFetchListener))
	{
		this.m_dpResultDataFetchListener(this.m_dataProvider, evt);
	}
};
oFF.OuDataProviderPluginEventManager.prototype._onDataProviderVizChange = function(evt)
{
	if (oFF.notNull(this.m_dpVizChangeListener) && oFF.notNull(this.m_dataProvider))
	{
		this.m_dataProvider.getActions().getVisualizationActions().getActiveVisualizationDefinition().onThen((vizDef) => {
			this.m_dpVizChangeListener(vizDef.getName(), evt);
		}).onCatch((error) => {
			this.m_dpVizChangeListener(null, evt);
		});
	}
};
oFF.OuDataProviderPluginEventManager.prototype._resetDataProvider = function()
{
	this._setDataProvider(null);
	if (oFF.notNull(this.m_dpReleasedListener))
	{
		this.m_dpReleasedListener(this.m_dataProviderName);
	}
};
oFF.OuDataProviderPluginEventManager.prototype._setDataProvider = function(provider)
{
	let hasDataProviderChanged = this.m_dataProvider !== provider;
	if (hasDataProviderChanged)
	{
		this._unobserveDataProviderChanges();
		this.m_dataProvider = provider;
		this._observeDataProviderChanges();
	}
	return hasDataProviderChanged;
};
oFF.OuDataProviderPluginEventManager.prototype._setDataProviderFromPromise = function(getDataProviderPromise)
{
	getDataProviderPromise.onThen(this._updateDpAndNotify.bind(this)).onCatch((error) => {
		this._updateDpAndNotify(null);
	});
};
oFF.OuDataProviderPluginEventManager.prototype._setupExt = function(controller, dataProviderName)
{
	this.setup();
	if (oFF.isNull(controller))
	{
		throw oFF.XException.createIllegalArgumentException("Controller cannot be null!");
	}
	this.m_controller = controller;
	this.m_dataProviderName = dataProviderName;
	this._observeDataProviderEvents();
};
oFF.OuDataProviderPluginEventManager.prototype._unobserveDataProviderChanges = function()
{
	if (oFF.notNull(this.m_dataProvider))
	{
		let eventing = this.m_dataProvider.getEventing();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_dpModelChangeObserverId))
		{
			eventing.getListenerForModelChanges().removeConsumerByUuid(this.m_dpModelChangeObserverId);
			this.m_dpModelChangeObserverId = null;
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_dpVizChangeObserverId))
		{
			eventing.getListenerForVisualizationChanges().removeConsumerByUuid(this.m_dpVizChangeObserverId);
			this.m_dpVizChangeObserverId = null;
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_dpResultDataFetchObserverId))
		{
			eventing.getListenerForResultDataFetch().removeConsumerByUuid(this.m_dpResultDataFetchObserverId);
			this.m_dpResultDataFetchObserverId = null;
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_dpLifecycleObserverId))
		{
			eventing.getListenerForLifecycle().removeConsumerByUuid(this.m_dpLifecycleObserverId);
			this.m_dpLifecycleObserverId = null;
		}
	}
};
oFF.OuDataProviderPluginEventManager.prototype._unobserveDataProviderEvents = function()
{
	let notificationCenter = this.m_controller.getLocalNotificationCenter();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_dpAddedObserverId))
	{
		notificationCenter.removeObserverByUuid(this.m_dpAddedObserverId);
		this.m_dpAddedObserverId = null;
	}
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_dpRemovedObserverId))
	{
		notificationCenter.removeObserverByUuid(this.m_dpRemovedObserverId);
		this.m_dpRemovedObserverId = null;
	}
	this._unobserveDataProviderChanges();
};
oFF.OuDataProviderPluginEventManager.prototype._updateDpAndNotify = function(dataProvider)
{
	if (this._setDataProvider(dataProvider))
	{
		this._onDataProviderReady();
	}
};
oFF.OuDataProviderPluginEventManager.prototype.getDataProvider = function()
{
	return this.m_dataProvider;
};
oFF.OuDataProviderPluginEventManager.prototype.notifyDataProviderUpdateListeners = function()
{
	if (oFF.notNull(this.m_dataProvider))
	{
		this.m_dataProvider.getEventing().notifyExternalModelChange(null);
	}
};
oFF.OuDataProviderPluginEventManager.prototype.releaseObject = function()
{
	this._unobserveDataProviderEvents();
	this.m_dpReadyListener = null;
	this.m_dpModelChangeListener = null;
	this.m_dpVizChangeListener = null;
	this.m_dpReleasedListener = null;
	this.m_dataProviderName = null;
	this.m_controller = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.OuDataProviderPluginEventManager.prototype.setDataProviderModelChangeListener = function(modelChangeListener)
{
	this.m_dpModelChangeListener = modelChangeListener;
};
oFF.OuDataProviderPluginEventManager.prototype.setDataProviderReadyListener = function(readyListener)
{
	this.m_dpReadyListener = readyListener;
};
oFF.OuDataProviderPluginEventManager.prototype.setDataProviderReleasedListener = function(releasedListener)
{
	this.m_dpReleasedListener = releasedListener;
};
oFF.OuDataProviderPluginEventManager.prototype.setDataProviderResultDataFetchListener = function(resultDataFetchListener)
{
	this.m_dpResultDataFetchListener = resultDataFetchListener;
};
oFF.OuDataProviderPluginEventManager.prototype.setDataProviderVizChangeListener = function(vizChangeListener)
{
	this.m_dpVizChangeListener = vizChangeListener;
};

oFF.OuDragDropHelper = function() {};
oFF.OuDragDropHelper.prototype = new oFF.XObject();
oFF.OuDragDropHelper.prototype._ff_c = "OuDragDropHelper";

oFF.OuDragDropHelper.NOTIFICATION_DATA_DRAG_MODELS = "com.sap.ff.DragDropHelper.NotificationData.dragModels";
oFF.OuDragDropHelper.NOTIFICATION_DRAG_END = "com.sap.ff.DragDropHelper.Notification.dragEnd";
oFF.OuDragDropHelper.NOTIFICATION_DRAG_START = "com.sap.ff.DragDropHelper.Notification.dragStart";
oFF.OuDragDropHelper.createHelper = function(process)
{
	let obj = new oFF.OuDragDropHelper();
	obj.setupExt(process);
	return obj;
};
oFF.OuDragDropHelper.prototype.m_dragEndListenerIds = null;
oFF.OuDragDropHelper.prototype.m_dragStartListenerIds = null;
oFF.OuDragDropHelper.prototype.m_process = null;
oFF.OuDragDropHelper.prototype.addDragEndListener = function(procedure)
{
	let listenerId = this.m_process.getNotificationCenter().addObserverForName(oFF.OuDragDropHelper.NOTIFICATION_DRAG_END, (data) => {
		procedure();
	});
	this.m_dragEndListenerIds.add(listenerId);
	return listenerId;
};
oFF.OuDragDropHelper.prototype.addDragStartListener = function(consumer)
{
	let listenerId = this.m_process.getNotificationCenter().addObserverForName(oFF.OuDragDropHelper.NOTIFICATION_DRAG_START, (data) => {
		let models = data.getXObjectByKeyExt(oFF.OuDragDropHelper.NOTIFICATION_DATA_DRAG_MODELS, oFF.XList.create());
		consumer(models);
	});
	this.m_dragStartListenerIds.add(listenerId);
	return listenerId;
};
oFF.OuDragDropHelper.prototype.postDragEnd = function()
{
	this.m_process.getNotificationCenter().postNotificationWithName(oFF.OuDragDropHelper.NOTIFICATION_DRAG_END, null);
};
oFF.OuDragDropHelper.prototype.postDragStart = function(models)
{
	let data = oFF.XNotificationData.create();
	data.putXObject(oFF.OuDragDropHelper.NOTIFICATION_DATA_DRAG_MODELS, models);
	this.m_process.getNotificationCenter().postNotificationWithName(oFF.OuDragDropHelper.NOTIFICATION_DRAG_START, data);
};
oFF.OuDragDropHelper.prototype.releaseObject = function()
{
	oFF.XCollectionUtils.forEach(this.m_dragStartListenerIds, (startId) => {
		this.m_process.getNotificationCenter().removeObserverByUuid(startId);
	});
	oFF.XCollectionUtils.forEach(this.m_dragEndListenerIds, (endId) => {
		this.m_process.getNotificationCenter().removeObserverByUuid(endId);
	});
	this.m_dragStartListenerIds = oFF.XObjectExt.release(this.m_dragStartListenerIds);
	this.m_dragEndListenerIds = oFF.XObjectExt.release(this.m_dragEndListenerIds);
	this.m_process = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.OuDragDropHelper.prototype.removeDragEndListener = function(uuid)
{
	this.m_dragEndListenerIds.removeElement(uuid);
	this.m_process.getNotificationCenter().removeObserverByUuid(uuid);
};
oFF.OuDragDropHelper.prototype.removeDragStartListener = function(uuid)
{
	this.m_dragStartListenerIds.removeElement(uuid);
	this.m_process.getNotificationCenter().removeObserverByUuid(uuid);
};
oFF.OuDragDropHelper.prototype.setupExt = function(process)
{
	this.m_process = process;
	this.m_dragStartListenerIds = oFF.XList.create();
	this.m_dragEndListenerIds = oFF.XList.create();
};

oFF.FilterDialogLambdaCloseListener = function() {};
oFF.FilterDialogLambdaCloseListener.prototype = new oFF.XObject();
oFF.FilterDialogLambdaCloseListener.prototype._ff_c = "FilterDialogLambdaCloseListener";

oFF.FilterDialogLambdaCloseListener.create = function(onSubmit, onCancel)
{
	let result = new oFF.FilterDialogLambdaCloseListener();
	result.m_submitConsumer = onSubmit;
	result.m_cancelProcedure = onCancel;
	return result;
};
oFF.FilterDialogLambdaCloseListener.createExt = function(onSubmit, onCancel)
{
	let result = new oFF.FilterDialogLambdaCloseListener();
	result.m_extSubmitConsumer = onSubmit;
	result.m_cancelProcedure = onCancel;
	return result;
};
oFF.FilterDialogLambdaCloseListener.prototype.m_cancelProcedure = null;
oFF.FilterDialogLambdaCloseListener.prototype.m_extSubmitConsumer = null;
oFF.FilterDialogLambdaCloseListener.prototype.m_submitConsumer = null;
oFF.FilterDialogLambdaCloseListener.prototype.onFilterDialogCancel = function()
{
	if (oFF.notNull(this.m_cancelProcedure))
	{
		this.m_cancelProcedure();
	}
};
oFF.FilterDialogLambdaCloseListener.prototype.onFilterDialogOk = function(selection, settings)
{
	if (oFF.notNull(this.m_submitConsumer))
	{
		this.m_submitConsumer(selection);
	}
	else if (oFF.notNull(this.m_extSubmitConsumer))
	{
		this.m_extSubmitConsumer(selection, settings);
	}
};
oFF.FilterDialogLambdaCloseListener.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_submitConsumer = null;
	this.m_extSubmitConsumer = null;
	this.m_cancelProcedure = null;
};

oFF.OuAnalyticalWidget = function() {};
oFF.OuAnalyticalWidget.prototype = new oFF.XObject();
oFF.OuAnalyticalWidget.prototype._ff_c = "OuAnalyticalWidget";

oFF.OuAnalyticalWidget.CHART_TYPE_KEY = "chartType";
oFF.OuAnalyticalWidget.CREATE_TIMESTAMP_KEY = "createTimestamp";
oFF.OuAnalyticalWidget.CURRENT_VERSION = "0.4.0";
oFF.OuAnalyticalWidget.DATA_SOURCE_KEY = "dataSource";
oFF.OuAnalyticalWidget.DESCRIPTION_KEY = "description";
oFF.OuAnalyticalWidget.DISPLAY_NAME_KEY = "displayName";
oFF.OuAnalyticalWidget.INA_REPO_KEY = "inaRepo";
oFF.OuAnalyticalWidget.MODEL_FORMAT_KEY = "modelFormat";
oFF.OuAnalyticalWidget.MODIFIED_TIMESTAMP_KEY = "modifiedTimestamp";
oFF.OuAnalyticalWidget.SYSTEM_NAME_KEY = "systemName";
oFF.OuAnalyticalWidget.TARGET_URL_KEY = "targetUrl";
oFF.OuAnalyticalWidget.VERSION_KEY = "version";
oFF.OuAnalyticalWidget.WIDGET_ID_KEY = "widgetId";
oFF.OuAnalyticalWidget.WIDGET_TYPE_KEY = "widgetType";
oFF.OuAnalyticalWidget.create = function()
{
	let newObject = new oFF.OuAnalyticalWidget();
	newObject._setupInternal();
	return newObject;
};
oFF.OuAnalyticalWidget.createByStructure = function(widgetStructure)
{
	let newObject = new oFF.OuAnalyticalWidget();
	newObject._setupByStructure(widgetStructure);
	return newObject;
};
oFF.OuAnalyticalWidget.prototype.m_chartType = null;
oFF.OuAnalyticalWidget.prototype.m_createTimestamp = 0;
oFF.OuAnalyticalWidget.prototype.m_dataSourceFQN = null;
oFF.OuAnalyticalWidget.prototype.m_description = null;
oFF.OuAnalyticalWidget.prototype.m_displayName = null;
oFF.OuAnalyticalWidget.prototype.m_inaRepoStruct = null;
oFF.OuAnalyticalWidget.prototype.m_modelFormat = null;
oFF.OuAnalyticalWidget.prototype.m_modifiedTimestamp = 0;
oFF.OuAnalyticalWidget.prototype.m_systemName = null;
oFF.OuAnalyticalWidget.prototype.m_targetUrl = null;
oFF.OuAnalyticalWidget.prototype.m_version = null;
oFF.OuAnalyticalWidget.prototype.m_widgetId = null;
oFF.OuAnalyticalWidget.prototype.m_widgetType = null;
oFF.OuAnalyticalWidget.prototype._generateWidgetStructure = function()
{
	let tmpStruct = oFF.PrFactory.createStructure();
	tmpStruct.putString(oFF.OuAnalyticalWidget.WIDGET_ID_KEY, this.m_widgetId);
	tmpStruct.putString(oFF.OuAnalyticalWidget.DISPLAY_NAME_KEY, this.m_displayName);
	tmpStruct.putString(oFF.OuAnalyticalWidget.DESCRIPTION_KEY, this.m_description);
	tmpStruct.putString(oFF.OuAnalyticalWidget.WIDGET_TYPE_KEY, oFF.notNull(this.m_widgetType) ? this.m_widgetType.getName() : null);
	tmpStruct.putString(oFF.OuAnalyticalWidget.CHART_TYPE_KEY, oFF.notNull(this.m_chartType) ? this.m_chartType.getName() : null);
	tmpStruct.putString(oFF.OuAnalyticalWidget.TARGET_URL_KEY, this.m_targetUrl);
	tmpStruct.putString(oFF.OuAnalyticalWidget.VERSION_KEY, this.m_version);
	tmpStruct.put(oFF.OuAnalyticalWidget.INA_REPO_KEY, this.m_inaRepoStruct);
	tmpStruct.putString(oFF.OuAnalyticalWidget.MODEL_FORMAT_KEY, oFF.notNull(this.m_modelFormat) ? this.m_modelFormat.getName() : null);
	tmpStruct.putString(oFF.OuAnalyticalWidget.SYSTEM_NAME_KEY, this.m_systemName);
	tmpStruct.putString(oFF.OuAnalyticalWidget.DATA_SOURCE_KEY, this.m_dataSourceFQN);
	tmpStruct.putLong(oFF.OuAnalyticalWidget.CREATE_TIMESTAMP_KEY, this.m_createTimestamp);
	tmpStruct.putLong(oFF.OuAnalyticalWidget.MODIFIED_TIMESTAMP_KEY, this.m_modifiedTimestamp);
	return tmpStruct;
};
oFF.OuAnalyticalWidget.prototype._parseStructure = function(widgetStructure)
{
	if (oFF.notNull(widgetStructure) && widgetStructure.isStructure())
	{
		this.m_widgetId = widgetStructure.getStringByKey(oFF.OuAnalyticalWidget.WIDGET_ID_KEY);
		this.m_displayName = widgetStructure.getStringByKey(oFF.OuAnalyticalWidget.DISPLAY_NAME_KEY);
		this.m_description = widgetStructure.getStringByKey(oFF.OuAnalyticalWidget.DESCRIPTION_KEY);
		this.m_widgetType = oFF.OuAnalyticalWidgetType.lookup(widgetStructure.getStringByKey(oFF.OuAnalyticalWidget.WIDGET_TYPE_KEY));
		this.m_chartType = oFF.ChartType.lookup(widgetStructure.getStringByKey(oFF.OuAnalyticalWidget.CHART_TYPE_KEY));
		this.m_targetUrl = widgetStructure.getStringByKey(oFF.OuAnalyticalWidget.TARGET_URL_KEY);
		this.m_version = widgetStructure.getStringByKey(oFF.OuAnalyticalWidget.VERSION_KEY);
		this.m_inaRepoStruct = widgetStructure.getStructureByKey(oFF.OuAnalyticalWidget.INA_REPO_KEY);
		this.m_modelFormat = oFF.ContentType.lookup(widgetStructure.getStringByKey(oFF.OuAnalyticalWidget.MODEL_FORMAT_KEY));
		this.m_systemName = widgetStructure.getStringByKey(oFF.OuAnalyticalWidget.SYSTEM_NAME_KEY);
		this.m_dataSourceFQN = widgetStructure.getStringByKey(oFF.OuAnalyticalWidget.DATA_SOURCE_KEY);
		this.m_createTimestamp = widgetStructure.getLongByKey(oFF.OuAnalyticalWidget.CREATE_TIMESTAMP_KEY);
		this.m_modifiedTimestamp = widgetStructure.getLongByKey(oFF.OuAnalyticalWidget.MODIFIED_TIMESTAMP_KEY);
	}
	else
	{
		throw oFF.XException.createRuntimeException("Missing or invalid widget json!");
	}
};
oFF.OuAnalyticalWidget.prototype._setupByStructure = function(struct)
{
	this._parseStructure(struct);
};
oFF.OuAnalyticalWidget.prototype._setupInternal = function()
{
	this.m_widgetId = oFF.XGuid.getGuid();
	this.m_version = oFF.OuAnalyticalWidget.CURRENT_VERSION;
	this.m_createTimestamp = oFF.XSystemUtils.getCurrentTimeInMilliseconds();
	this.m_createTimestamp = oFF.XSystemUtils.getCurrentTimeInMilliseconds();
};
oFF.OuAnalyticalWidget.prototype.getChartType = function()
{
	return this.m_chartType;
};
oFF.OuAnalyticalWidget.prototype.getCreateTimestamp = function()
{
	return this.m_createTimestamp;
};
oFF.OuAnalyticalWidget.prototype.getDataSourceFQN = function()
{
	return this.m_dataSourceFQN;
};
oFF.OuAnalyticalWidget.prototype.getDataSourceName = function()
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_dataSourceFQN))
	{
		let lastOpenBracketIndex = oFF.XString.lastIndexOf(this.m_dataSourceFQN, "[");
		let lastCloseBracketIndex = oFF.XString.lastIndexOf(this.m_dataSourceFQN, "]");
		if (lastOpenBracketIndex !== -1 && lastCloseBracketIndex !== -1 && lastOpenBracketIndex < lastCloseBracketIndex)
		{
			return oFF.XString.substring(this.m_dataSourceFQN, lastOpenBracketIndex + 1, lastCloseBracketIndex);
		}
	}
	return this.m_dataSourceFQN;
};
oFF.OuAnalyticalWidget.prototype.getDescription = function()
{
	return this.m_description;
};
oFF.OuAnalyticalWidget.prototype.getDisplayName = function()
{
	return this.m_displayName;
};
oFF.OuAnalyticalWidget.prototype.getId = function()
{
	return this.m_widgetId;
};
oFF.OuAnalyticalWidget.prototype.getInaRepoStructure = function()
{
	return this.m_inaRepoStruct;
};
oFF.OuAnalyticalWidget.prototype.getModelFormat = function()
{
	return this.m_modelFormat;
};
oFF.OuAnalyticalWidget.prototype.getModifiedTimestamp = function()
{
	return this.m_modifiedTimestamp;
};
oFF.OuAnalyticalWidget.prototype.getSystemName = function()
{
	return this.m_systemName;
};
oFF.OuAnalyticalWidget.prototype.getTargetUrl = function()
{
	return this.m_targetUrl;
};
oFF.OuAnalyticalWidget.prototype.getVersion = function()
{
	return this.m_version;
};
oFF.OuAnalyticalWidget.prototype.getWidgetStructure = function()
{
	return this._generateWidgetStructure();
};
oFF.OuAnalyticalWidget.prototype.getWidgetType = function()
{
	return this.m_widgetType;
};
oFF.OuAnalyticalWidget.prototype.getWidgetTypeString = function()
{
	let widgetTypeStr = this.getWidgetType() !== null ? this.getWidgetType().getName() : null;
	if (this.getWidgetType() === oFF.OuAnalyticalWidgetType.CHART)
	{
		widgetTypeStr = this.getChartType() !== null ? this.getChartType().getName() : null;
	}
	return widgetTypeStr;
};
oFF.OuAnalyticalWidget.prototype.isValid = function()
{
	if (oFF.isNull(this.m_modelFormat) || oFF.isNull(this.m_inaRepoStruct) || this.m_inaRepoStruct.isEmpty() || oFF.XStringUtils.isNullOrEmpty(this.m_systemName) || oFF.XStringUtils.isNullOrEmpty(this.m_dataSourceFQN))
	{
		return false;
	}
	return true;
};
oFF.OuAnalyticalWidget.prototype.releaseObject = function()
{
	this.m_widgetType = null;
	this.m_chartType = null;
	this.m_inaRepoStruct = oFF.XObjectExt.release(this.m_inaRepoStruct);
	this.m_modelFormat = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.OuAnalyticalWidget.prototype.setChartType = function(chartType)
{
	this.m_chartType = chartType;
};
oFF.OuAnalyticalWidget.prototype.setDataSourceFQN = function(dataSourceFQN)
{
	this.m_dataSourceFQN = dataSourceFQN;
};
oFF.OuAnalyticalWidget.prototype.setDescription = function(description)
{
	this.m_description = description;
};
oFF.OuAnalyticalWidget.prototype.setDisplayName = function(displayName)
{
	this.m_displayName = displayName;
};
oFF.OuAnalyticalWidget.prototype.setInaRepoStructure = function(inaRepoStructure)
{
	this.m_inaRepoStruct = oFF.PrStructure.createDeepCopy(inaRepoStructure);
};
oFF.OuAnalyticalWidget.prototype.setModelFormat = function(modelFormat)
{
	this.m_modelFormat = modelFormat;
};
oFF.OuAnalyticalWidget.prototype.setSystemName = function(systemName)
{
	this.m_systemName = systemName;
};
oFF.OuAnalyticalWidget.prototype.setTargetUrl = function(targetUrl)
{
	this.m_targetUrl = targetUrl;
};
oFF.OuAnalyticalWidget.prototype.setWidgetType = function(widgetType)
{
	this.m_widgetType = widgetType;
};
oFF.OuAnalyticalWidget.prototype.updateModifiedTimestamp = function()
{
	this.m_modifiedTimestamp = oFF.XSystemUtils.getCurrentTimeInMilliseconds();
};

oFF.OuDataProviderDimensionFilterDialogAction = function() {};
oFF.OuDataProviderDimensionFilterDialogAction.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDataProviderDimensionFilterDialogAction.prototype._ff_c = "OuDataProviderDimensionFilterDialogAction";

oFF.OuDataProviderDimensionFilterDialogAction.ACTION_NAME = "DefaultDimensionFilterDialogAction";
oFF.OuDataProviderDimensionFilterDialogAction.create = function(actions)
{
	let obj = new oFF.OuDataProviderDimensionFilterDialogAction();
	obj.setupAction(actions);
	return obj;
};
oFF.OuDataProviderDimensionFilterDialogAction.prototype.createActionResult = function(parameters, submitted)
{
	let dialogResult = oFF.OuDataProviderFilterDialogActionResult.create();
	dialogResult.setDialogSubmitted(submitted);
	let actionResult = this.newActionResult(parameters);
	actionResult.setReturnValue(dialogResult);
	if (submitted)
	{
		actionResult.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
	}
	return actionResult;
};
oFF.OuDataProviderDimensionFilterDialogAction.prototype.doAction = function(parameters)
{
	let process = this.getDataProvider().getApplication().getProcess();
	let queryManager = this.getDataProvider().getQueryManager();
	return oFF.XPromise.create((resolve, reject) => {
		let dimensionName = parameters.get(0);
		let title = parameters.get(1);
		let otherArguments = parameters.size() >= 3 ? oFF.PrUtils.deserialize(parameters.get(2)) : null;
		let runner = oFF.FilterDialogProgramRunnerFactory.createForDimensionFilter(process, queryManager, dimensionName, title);
		runner.setAllArguments(otherArguments);
		runner.getProgramStartData().putXObject(oFF.FilterDialog.PRG_DATA_LISTENER_CLOSE, oFF.FilterDialogLambdaCloseListener.create((selection) => {
			resolve(this.createActionResult(parameters, true));
		}, () => {
			resolve(this.createActionResult(parameters, false));
		}));
		runner.runProgram();
	});
};
oFF.OuDataProviderDimensionFilterDialogAction.prototype.executeTyped = function(dimension, title, otherArguments)
{
	let parameters = oFF.XList.create();
	parameters.add(dimension.getName());
	parameters.add(title);
	parameters.add(oFF.notNull(otherArguments) ? oFF.PrUtils.serialize(otherArguments, false, false, -1) : null);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDataProviderDimensionFilterDialogAction.prototype.getName = function()
{
	return oFF.OuDataProviderDimensionFilterDialogAction.ACTION_NAME;
};
oFF.OuDataProviderDimensionFilterDialogAction.prototype.releaseObject = function()
{
	oFF.DfOuDataProviderAction.prototype.releaseObject.call( this );
};
oFF.OuDataProviderDimensionFilterDialogAction.prototype.setupAction = function(actionsBase)
{
	oFF.DfOuDataProviderAction.prototype.setupAction.call( this , actionsBase);
};

oFF.OuDataProviderOlapUiApiActionsCollection = function() {};
oFF.OuDataProviderOlapUiApiActionsCollection.prototype = new oFF.DfOuDataProviderActionsCollection();
oFF.OuDataProviderOlapUiApiActionsCollection.prototype._ff_c = "OuDataProviderOlapUiApiActionsCollection";

oFF.OuDataProviderOlapUiApiActionsCollection.NAME = "OlapUiApiActions";
oFF.OuDataProviderOlapUiApiActionsCollection.getOlapUiApiActions = function(dataProvider)
{
	return dataProvider.getActions().getActionCollectionByName(oFF.OuDataProviderOlapUiApiActionsCollection.NAME);
};
oFF.OuDataProviderOlapUiApiActionsCollection.prototype.m_dimensionFilterDialogAction = null;
oFF.OuDataProviderOlapUiApiActionsCollection.prototype.getName = function()
{
	return oFF.OuDataProviderOlapUiApiActionsCollection.NAME;
};
oFF.OuDataProviderOlapUiApiActionsCollection.prototype.openDimensionFilterDialog = function(dimension, title, otherArguments)
{
	return this.m_dimensionFilterDialogAction.executeTyped(dimension, title, otherArguments);
};
oFF.OuDataProviderOlapUiApiActionsCollection.prototype.releaseObject = function()
{
	this.m_dimensionFilterDialogAction = oFF.XObjectExt.release(this.m_dimensionFilterDialogAction);
	oFF.DfOuDataProviderActionsCollection.prototype.releaseObject.call( this );
};
oFF.OuDataProviderOlapUiApiActionsCollection.prototype.setupCollection = function(actions)
{
	oFF.DfOuDataProviderActionsCollection.prototype.setupCollection.call( this , actions);
	this.m_dimensionFilterDialogAction = this.addAction(oFF.OuDataProviderDimensionFilterDialogAction.create(this.getActions()));
};

oFF.FilterDialogConfig = function() {};
oFF.FilterDialogConfig.prototype = new oFF.XObject();
oFF.FilterDialogConfig.prototype._ff_c = "FilterDialogConfig";

oFF.FilterDialogConfig.DEFAULT_PAGE_SIZE = 20;
oFF.FilterDialogConfig.DEFAULT_PRELOAD_PAGE_COUNT = 8;
oFF.FilterDialogConfig.DEFAULT_PRELOAD_PAGE_COUNT_SMALL = 4;
oFF.FilterDialogConfig.DEFAULT_SEARCH_SIZE = 100;
oFF.FilterDialogConfig.PAGE_SIZE_COLLAPSED_HEADER_NO_SCROLLBAR = 14;
oFF.FilterDialogConfig.create = function(args, programStartData, queryManager, contentType)
{
	let config = new oFF.FilterDialogConfig();
	config.setupConfig(args, programStartData, queryManager, contentType);
	return config;
};
oFF.FilterDialogConfig.getArgs = function(args, configuration)
{
	let mergedArgs;
	if (oFF.notNull(args))
	{
		mergedArgs = args;
	}
	else
	{
		mergedArgs = oFF.ProgramArgs.create();
	}
	if (oFF.notNull(configuration))
	{
		let configKeys = oFF.XCollectionUtils.filter(configuration.getKeysAsReadOnlyList(), (key) => {
			return !mergedArgs.containsKey(key);
		});
		oFF.XCollectionUtils.forEach(configKeys, (configKey) => {
			mergedArgs.put(configKey, configuration.getByKey(configKey));
		});
	}
	return mergedArgs;
};
oFF.FilterDialogConfig.prototype.m_alwaysShowSelectionContainer = false;
oFF.FilterDialogConfig.prototype.m_beforeFilterChangeListener = null;
oFF.FilterDialogConfig.prototype.m_closeListener = null;
oFF.FilterDialogConfig.prototype.m_contentType = null;
oFF.FilterDialogConfig.prototype.m_defaultAttributeSelection = null;
oFF.FilterDialogConfig.prototype.m_defaultSelection = null;
oFF.FilterDialogConfig.prototype.m_defaultViewType = null;
oFF.FilterDialogConfig.prototype.m_dimension = null;
oFF.FilterDialogConfig.prototype.m_displayInfo = null;
oFF.FilterDialogConfig.prototype.m_displayInfoExtendedSettings = false;
oFF.FilterDialogConfig.prototype.m_dynamicDateRangeMaxYears = 0;
oFF.FilterDialogConfig.prototype.m_excludeByDefault = false;
oFF.FilterDialogConfig.prototype.m_externalValueHelpProcess = null;
oFF.FilterDialogConfig.prototype.m_filterMeasureBased = null;
oFF.FilterDialogConfig.prototype.m_hiddenValues = null;
oFF.FilterDialogConfig.prototype.m_hideCumulatedMeasures = false;
oFF.FilterDialogConfig.prototype.m_hierarchy = null;
oFF.FilterDialogConfig.prototype.m_isOpenWithDynamicFilter = false;
oFF.FilterDialogConfig.prototype.m_isOpenWithVariableFilter = false;
oFF.FilterDialogConfig.prototype.m_layeredFilterName = null;
oFF.FilterDialogConfig.prototype.m_listChildNodePageSize = 0;
oFF.FilterDialogConfig.prototype.m_listPageSize = 0;
oFF.FilterDialogConfig.prototype.m_listPreloadPageCount = 0;
oFF.FilterDialogConfig.prototype.m_listenerSelectionChange = null;
oFF.FilterDialogConfig.prototype.m_mbfMemberName = null;
oFF.FilterDialogConfig.prototype.m_offerClipboard = false;
oFF.FilterDialogConfig.prototype.m_offerEqualInRangeFilter = false;
oFF.FilterDialogConfig.prototype.m_offerExclude = false;
oFF.FilterDialogConfig.prototype.m_offerExcludeAdvanced = false;
oFF.FilterDialogConfig.prototype.m_offerFunctionalValuesView = false;
oFF.FilterDialogConfig.prototype.m_offerHierarchyChange = false;
oFF.FilterDialogConfig.prototype.m_offerListView = false;
oFF.FilterDialogConfig.prototype.m_offerNullInRangeFilter = false;
oFF.FilterDialogConfig.prototype.m_offerRangeView = false;
oFF.FilterDialogConfig.prototype.m_offerReadModeChange = false;
oFF.FilterDialogConfig.prototype.m_offerReadModeExtendedSettings = false;
oFF.FilterDialogConfig.prototype.m_readMode = null;
oFF.FilterDialogConfig.prototype.m_resizeable = false;
oFF.FilterDialogConfig.prototype.m_searchSize = 0;
oFF.FilterDialogConfig.prototype.m_searchValue = null;
oFF.FilterDialogConfig.prototype.m_selectionMode = null;
oFF.FilterDialogConfig.prototype.m_selectionRequired = false;
oFF.FilterDialogConfig.prototype.m_simplifiedSearch = false;
oFF.FilterDialogConfig.prototype.m_textUsageType = null;
oFF.FilterDialogConfig.prototype.m_title = null;
oFF.FilterDialogConfig.prototype.m_usageTrackingConsumer = null;
oFF.FilterDialogConfig.prototype.m_valueFormatter = null;
oFF.FilterDialogConfig.prototype.m_variable = null;
oFF.FilterDialogConfig.prototype.m_workspace = null;
oFF.FilterDialogConfig.prototype.evalContentObject = function(args, programStartData, queryManager, contentType)
{
	this.m_contentType = contentType;
	if (this.m_contentType === oFF.FilterDialogContentType.VARIABLE)
	{
		this.m_variable = this.getObjectFromPrgStartData(programStartData, oFF.FilterDialog.PRG_DATA_VARIABLE);
		if (oFF.isNull(this.m_variable) && oFF.notNull(queryManager) && args.containsKey(oFF.FilterDialog.ARG_VARIABLE_NAME))
		{
			this.m_variable = queryManager.getVariable(args.getStringByKey(oFF.FilterDialog.ARG_VARIABLE_NAME));
		}
		this.m_dimension = oFF.notNull(this.m_variable) ? this.m_variable.getDimension() : null;
	}
	else if ((this.m_contentType === oFF.FilterDialogContentType.DIMENSION || this.m_contentType === oFF.FilterDialogContentType.HIERARCHY_CATALOG) && oFF.notNull(queryManager))
	{
		this.m_dimension = queryManager.getDimensionAccessor().getDimensionByName(args.getStringByKey(oFF.FilterDialog.ARG_DIMENSION_NAME));
	}
	else if (this.m_contentType === oFF.FilterDialogContentType.MEASURE_BASED_FILTER)
	{
		this.m_mbfMemberName = args.getStringByKey(oFF.FilterDialog.ARG_MBF_MEMBER_NAME);
		this.m_filterMeasureBased = this.getObjectFromPrgStartData(programStartData, oFF.FilterDialog.PRG_DATA_MBF);
		if (oFF.XStringUtils.isNullOrEmpty(this.m_mbfMemberName) && oFF.notNull(this.m_filterMeasureBased))
		{
			this.m_mbfMemberName = oFF.FilterDialogMBFUtils.getMemberName(this.m_filterMeasureBased);
		}
	}
};
oFF.FilterDialogConfig.prototype.getBeforeFilterChangeListener = function()
{
	return this.m_beforeFilterChangeListener;
};
oFF.FilterDialogConfig.prototype.getCloseListener = function()
{
	return this.m_closeListener;
};
oFF.FilterDialogConfig.prototype.getContentType = function()
{
	return this.m_contentType;
};
oFF.FilterDialogConfig.prototype.getDefaultAttributeSelection = function()
{
	return this.m_defaultAttributeSelection;
};
oFF.FilterDialogConfig.prototype.getDefaultSelection = function()
{
	return this.m_defaultSelection;
};
oFF.FilterDialogConfig.prototype.getDefaultViewType = function()
{
	return this.m_defaultViewType;
};
oFF.FilterDialogConfig.prototype.getDimension = function()
{
	return this.m_dimension;
};
oFF.FilterDialogConfig.prototype.getDisplayInfo = function()
{
	return this.m_displayInfo;
};
oFF.FilterDialogConfig.prototype.getDisplayInfoFromFilter = function(filter)
{
	if (oFF.notNull(filter) && filter.hasUiSettings(oFF.QContextType.SELECTOR))
	{
		return filter.getUiSettings(oFF.QContextType.SELECTOR).getDisplayInfo();
	}
	if (oFF.notNull(filter) && filter.hasUiSettings(oFF.QContextType.RESULT_SET))
	{
		return filter.getUiSettings(oFF.QContextType.RESULT_SET).getDisplayInfo();
	}
	return null;
};
oFF.FilterDialogConfig.prototype.getDynamicDateRangeMaxYears = function()
{
	return this.m_dynamicDateRangeMaxYears;
};
oFF.FilterDialogConfig.prototype.getExternalValueHelpProcess = function()
{
	return this.m_externalValueHelpProcess;
};
oFF.FilterDialogConfig.prototype.getHiddenValues = function()
{
	return this.m_hiddenValues;
};
oFF.FilterDialogConfig.prototype.getHierarchy = function()
{
	return this.m_hierarchy;
};
oFF.FilterDialogConfig.prototype.getLayeredFilterName = function()
{
	return this.m_layeredFilterName;
};
oFF.FilterDialogConfig.prototype.getList = function(commaSeparatedList)
{
	return oFF.XStream.ofString(oFF.XStringTokenizer.splitString(commaSeparatedList, ",")).map((attrName1) => {
		return oFF.XStringValue.create(oFF.XString.trim(attrName1.getString()));
	}).filter((attrName2) => {
		return oFF.XStringUtils.isNotNullAndNotEmpty(attrName2.getString());
	}).collect(oFF.XStreamCollector.toListOfString((s) => {
		return s.getString();
	}));
};
oFF.FilterDialogConfig.prototype.getListChildNodePageSize = function()
{
	return this.m_listChildNodePageSize;
};
oFF.FilterDialogConfig.prototype.getListPageSize = function()
{
	return this.m_listPageSize;
};
oFF.FilterDialogConfig.prototype.getListPreloadPageCount = function()
{
	return this.m_listPreloadPageCount;
};
oFF.FilterDialogConfig.prototype.getListenerSelectionChange = function()
{
	return this.m_listenerSelectionChange;
};
oFF.FilterDialogConfig.prototype.getMeasureBasedFilter = function()
{
	return this.m_filterMeasureBased;
};
oFF.FilterDialogConfig.prototype.getMeasureBasedFilterMember = function()
{
	return this.m_mbfMemberName;
};
oFF.FilterDialogConfig.prototype.getObjectFromPrgStartData = function(programStartData, key)
{
	return oFF.notNull(programStartData) ? programStartData.getXObjectByKey(key) : null;
};
oFF.FilterDialogConfig.prototype.getReadMode = function()
{
	return this.m_readMode;
};
oFF.FilterDialogConfig.prototype.getSearchSize = function()
{
	return this.m_searchSize;
};
oFF.FilterDialogConfig.prototype.getSearchValue = function()
{
	return this.m_searchValue;
};
oFF.FilterDialogConfig.prototype.getSelectionMode = function()
{
	return this.m_selectionMode;
};
oFF.FilterDialogConfig.prototype.getTextUsageType = function()
{
	return this.m_textUsageType;
};
oFF.FilterDialogConfig.prototype.getTitle = function()
{
	return this.m_title;
};
oFF.FilterDialogConfig.prototype.getUsageTrackingConsumer = function()
{
	return this.m_usageTrackingConsumer;
};
oFF.FilterDialogConfig.prototype.getValueFormatter = function()
{
	return this.m_valueFormatter;
};
oFF.FilterDialogConfig.prototype.getVariable = function()
{
	return this.m_variable;
};
oFF.FilterDialogConfig.prototype.getWorkspace = function()
{
	return this.m_workspace;
};
oFF.FilterDialogConfig.prototype.isAlwaysShowSelectionContainer = function()
{
	return this.m_alwaysShowSelectionContainer;
};
oFF.FilterDialogConfig.prototype.isExcludeByDefault = function()
{
	return this.m_excludeByDefault;
};
oFF.FilterDialogConfig.prototype.isHideCumulatedMeasures = function()
{
	return this.m_hideCumulatedMeasures;
};
oFF.FilterDialogConfig.prototype.isOfferClipboard = function()
{
	return this.m_offerClipboard;
};
oFF.FilterDialogConfig.prototype.isOfferDisplayInfoExtendedSettings = function()
{
	return this.m_displayInfoExtendedSettings;
};
oFF.FilterDialogConfig.prototype.isOfferEqualInRangeFilter = function()
{
	return this.m_offerEqualInRangeFilter;
};
oFF.FilterDialogConfig.prototype.isOfferExclude = function()
{
	return this.m_offerExclude;
};
oFF.FilterDialogConfig.prototype.isOfferExcludeAdvanced = function()
{
	return this.m_offerExcludeAdvanced;
};
oFF.FilterDialogConfig.prototype.isOfferFunctionalValuesView = function()
{
	return this.m_offerFunctionalValuesView;
};
oFF.FilterDialogConfig.prototype.isOfferHierarchyChange = function()
{
	return this.m_offerHierarchyChange;
};
oFF.FilterDialogConfig.prototype.isOfferListView = function()
{
	return this.m_offerListView;
};
oFF.FilterDialogConfig.prototype.isOfferNullInRangeFilter = function()
{
	return this.m_offerNullInRangeFilter;
};
oFF.FilterDialogConfig.prototype.isOfferRangeView = function()
{
	return this.m_offerRangeView;
};
oFF.FilterDialogConfig.prototype.isOfferReadModeChange = function()
{
	return this.m_offerReadModeChange;
};
oFF.FilterDialogConfig.prototype.isOfferReadModeExtendedSettings = function()
{
	return this.m_offerReadModeExtendedSettings;
};
oFF.FilterDialogConfig.prototype.isOpenWithDynamicFilter = function()
{
	return this.m_isOpenWithDynamicFilter;
};
oFF.FilterDialogConfig.prototype.isOpenWithLayeredFilter = function()
{
	return !this.m_isOpenWithDynamicFilter && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_layeredFilterName);
};
oFF.FilterDialogConfig.prototype.isOpenWithVariableFilter = function()
{
	return this.m_isOpenWithVariableFilter;
};
oFF.FilterDialogConfig.prototype.isResizeable = function()
{
	return this.m_resizeable;
};
oFF.FilterDialogConfig.prototype.isSelectionRequired = function()
{
	return this.m_selectionRequired;
};
oFF.FilterDialogConfig.prototype.isShowSimplifiedSearch = function()
{
	return this.m_simplifiedSearch;
};
oFF.FilterDialogConfig.prototype.isValid = function()
{
	if (this.m_contentType === oFF.FilterDialogContentType.VARIABLE)
	{
		return oFF.notNull(this.m_variable) && oFF.notNull(this.m_dimension);
	}
	if (this.m_contentType === oFF.FilterDialogContentType.DIMENSION)
	{
		let useFilter = this.m_isOpenWithDynamicFilter || oFF.XStringUtils.isNotNullAndNotEmpty(this.m_layeredFilterName);
		return oFF.notNull(this.m_dimension) && (!useFilter || oFF.XCollectionUtils.hasElements(this.m_defaultSelection) || oFF.FilterDialogValueUtils.supportsFilterOnDimension(this.m_dimension));
	}
	if (this.m_contentType === oFF.FilterDialogContentType.HIERARCHY_CATALOG)
	{
		return oFF.notNull(this.m_dimension);
	}
	if (this.m_contentType === oFF.FilterDialogContentType.MEASURE_BASED_FILTER)
	{
		return oFF.XStringUtils.isNotNullAndNotEmpty(this.m_mbfMemberName) && oFF.notNull(this.m_filterMeasureBased);
	}
	return this.m_contentType === oFF.FilterDialogContentType.USER_TEAM;
};
oFF.FilterDialogConfig.prototype.registerOnClose = function(closeListener)
{
	this.m_closeListener = closeListener;
};
oFF.FilterDialogConfig.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_contentType = null;
	this.m_variable = null;
	this.m_dimension = null;
	this.m_mbfMemberName = null;
	this.m_filterMeasureBased = null;
	this.m_layeredFilterName = null;
	this.m_closeListener = null;
	this.m_beforeFilterChangeListener = null;
	this.m_listenerSelectionChange = null;
	this.m_title = null;
	this.m_selectionMode = null;
	this.m_defaultSelection = null;
	this.m_externalValueHelpProcess = null;
	this.m_displayInfo = null;
	this.m_textUsageType = null;
	this.m_readMode = null;
	this.m_hierarchy = null;
	this.m_defaultViewType = null;
	this.m_usageTrackingConsumer = null;
	this.m_defaultAttributeSelection = oFF.XObjectExt.release(this.m_defaultAttributeSelection);
	this.m_valueFormatter = oFF.XObjectExt.release(this.m_valueFormatter);
};
oFF.FilterDialogConfig.prototype.setReadMode = function(readMode)
{
	this.m_readMode = readMode;
};
oFF.FilterDialogConfig.prototype.setupConfig = function(args, programStartData, queryManager, contentType)
{
	this.evalContentObject(args, programStartData, queryManager, contentType);
	this.m_usageTrackingConsumer = oFF.FilterDialogUsageTrackingConsumer.lookup(args.getStringByKey(oFF.FilterDialog.ARG_USAGE_TRACKING_CONSUMER));
	this.m_isOpenWithDynamicFilter = args.getBooleanByKey(oFF.FilterDialog.ARG_OPEN_WITH_DYNAMIC_FILTER);
	this.m_isOpenWithVariableFilter = args.getBooleanByKey(oFF.FilterDialog.ARG_OPEN_WITH_VARIABLE_FILTER);
	this.m_layeredFilterName = args.getStringByKey(oFF.FilterDialog.ARG_LAYERED_FILTER_NAME);
	this.m_closeListener = this.getObjectFromPrgStartData(programStartData, oFF.FilterDialog.PRG_DATA_LISTENER_CLOSE);
	this.m_beforeFilterChangeListener = this.getObjectFromPrgStartData(programStartData, oFF.FilterDialog.PRG_DATA_LISTENER_BEFORE_FILTER_CHANGE);
	this.m_listenerSelectionChange = this.getObjectFromPrgStartData(programStartData, oFF.FilterDialog.PRG_DATA_LISTENER_SELECTION_CHANGE);
	this.m_title = args.getStringByKey(oFF.FilterDialog.ARG_TITLE);
	this.m_selectionMode = oFF.UiTableSelectionMode.lookup(args.getStringByKey(oFF.FilterDialog.PARAM_SELECTION_MODE));
	if (oFF.isNull(this.m_selectionMode) || this.m_selectionMode === oFF.UiTableSelectionMode.NONE)
	{
		let selectionMode = oFF.UiSelectionMode.lookup(args.getStringByKey(oFF.FilterDialog.PARAM_SELECTION_MODE));
		this.m_selectionMode = oFF.notNull(selectionMode) && selectionMode === oFF.UiSelectionMode.MULTI_SELECT ? oFF.UiTableSelectionMode.MULTI_TOGGLE : oFF.UiTableSelectionMode.SINGLE;
	}
	this.m_selectionRequired = args.getBooleanByKey(oFF.FilterDialog.PARAM_SELECTION_REQUIRED);
	this.m_resizeable = args.getBooleanByKeyExt(oFF.FilterDialog.PARAM_RESIZABLE, true);
	this.m_defaultSelection = this.getObjectFromPrgStartData(programStartData, oFF.FilterDialog.PRG_DATA_DEFAULT_SELECTION);
	this.m_alwaysShowSelectionContainer = args.getBooleanByKey(oFF.FilterDialog.PARAM_ALWAYS_SHOW_SELECTION_CONTAINER);
	this.m_valueFormatter = oFF.FilterDialogValueFormatter.create(args.getStringByKey(oFF.FilterDialog.PARAM_DISPLAY_PATTERN_VALUE), args.getStringByKey(oFF.FilterDialog.PARAM_DISPLAY_PATTERN_RANGE), null);
	this.m_externalValueHelpProcess = this.getObjectFromPrgStartData(programStartData, oFF.FilterDialog.PRG_DATA_EXTERNAL_VALUEHELP_PROCESS);
	this.m_displayInfo = oFF.FilterDisplayInfo.lookup(args.getStringByKey(oFF.FilterDialog.PARAM_DISPLAY_INFO));
	this.m_displayInfoExtendedSettings = args.getBooleanByKey(oFF.FilterDialog.PARAM_OFFER_DISPLAY_INFO_EXTENDED_SETTINGS);
	this.m_textUsageType = oFF.FilterDialogTextUsageType.lookup(args.getStringByKey(oFF.FilterDialog.PARAM_DIMENSION_TEXT_USAGE_TYPE));
	if (oFF.isNull(this.m_textUsageType))
	{
		this.m_textUsageType = oFF.FilterDialogTextUsageType.AUTO;
	}
	if (args.containsKey(oFF.FilterDialog.PARAM_DIMENSION_DEFAULT_ATTRIBUTE_SELECTION))
	{
		this.m_defaultAttributeSelection = this.getList(args.getStringByKey(oFF.FilterDialog.PARAM_DIMENSION_DEFAULT_ATTRIBUTE_SELECTION));
	}
	this.m_simplifiedSearch = args.getBooleanByKey(oFF.FilterDialog.PARAM_SIMPLIFIED_SEARCH);
	this.m_searchSize = oFF.XMath.max(args.getIntegerByKeyExt(oFF.FilterDialog.PARAM_SEARCH_SIZE, oFF.FilterDialogConfig.DEFAULT_SEARCH_SIZE), 1);
	this.m_searchValue = args.getStringByKey(oFF.FilterDialog.ARG_SEARCH_VALUE);
	let defaultPageSize = oFF.FilterDialogConfig.DEFAULT_PAGE_SIZE;
	let defaultPreloadPageCount = oFF.FilterDialogConfig.DEFAULT_PRELOAD_PAGE_COUNT;
	if (this.m_contentType === oFF.FilterDialogContentType.DIMENSION)
	{
		this.m_offerRangeView = args.getBooleanByKey(oFF.FilterDialog.PARAM_OFFER_RANGE_VIEW);
		this.m_offerFunctionalValuesView = args.getBooleanByKey(oFF.FilterDialog.PARAM_OFFER_FUNCTIONAL_VALUES_VIEW) && oFF.FilterDialogViewType.FUNCTIONAL_VALUES.isSupportedByDim(this.m_dimension);
		this.m_offerListView = args.getBooleanByKey(oFF.FilterDialog.PARAM_OFFER_LIST_VIEW) || !this.m_offerRangeView && !this.m_offerFunctionalValuesView;
		this.setupDefaultViewType(args);
		if (this.m_isOpenWithDynamicFilter && oFF.notNull(this.m_dimension))
		{
			let dynamicFilter = this.m_dimension.getFilter();
			this.m_defaultSelection = oFF.FilterDialogValueFactory.createSelectionFromFilter(this.m_dimension, dynamicFilter);
			if (oFF.isNull(this.m_displayInfo))
			{
				this.m_displayInfo = this.getDisplayInfoFromFilter(dynamicFilter);
			}
		}
		else if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_layeredFilterName) && oFF.notNull(this.m_dimension))
		{
			let layeredFilter = this.m_dimension.getQueryModel().getFilter().getLinkedFilter(this.m_layeredFilterName);
			let filter = oFF.notNull(layeredFilter) ? layeredFilter.getCartesianList(this.m_dimension) : null;
			this.m_defaultSelection = oFF.FilterDialogValueFactory.createSelectionFromFilter(this.m_dimension, filter);
			if (oFF.isNull(this.m_displayInfo))
			{
				this.m_displayInfo = this.getDisplayInfoFromFilter(filter);
			}
		}
		if (oFF.notNull(this.m_defaultSelection) && this.m_defaultSelection.size() > 1 && this.m_selectionMode === oFF.UiTableSelectionMode.SINGLE)
		{
			this.m_defaultSelection.clear();
		}
		if (oFF.XCollectionUtils.hasElements(this.m_defaultSelection))
		{
			this.m_hierarchy = this.m_defaultSelection.get(0).getHierarchyName();
		}
		else if (args.containsKey(oFF.FilterDialog.PARAM_HIERARCHY))
		{
			let hierarchyName = args.getStringByKey(oFF.FilterDialog.PARAM_HIERARCHY);
			this.m_hierarchy = oFF.XStringUtils.isNullOrEmpty(hierarchyName) ? null : hierarchyName;
		}
		else if (oFF.notNull(this.m_dimension) && this.m_dimension.isHierarchyActive())
		{
			this.m_hierarchy = this.m_dimension.getHierarchyName();
		}
	}
	else if (this.m_contentType === oFF.FilterDialogContentType.VARIABLE)
	{
		this.m_offerRangeView = args.getBooleanByKey(oFF.FilterDialog.PARAM_OFFER_RANGE_VIEW);
		this.m_offerListView = args.getBooleanByKey(oFF.FilterDialog.PARAM_OFFER_LIST_VIEW) || !this.m_offerRangeView;
		this.setupDefaultViewType(args);
		if (this.m_isOpenWithVariableFilter && oFF.notNull(this.m_variable))
		{
			this.m_defaultSelection = oFF.FilterDialogValueFactory.createSelectionFromVariable(this.m_variable);
			this.m_selectionMode = this.m_variable.supportsMultipleValues() ? oFF.UiTableSelectionMode.MULTI_TOGGLE : oFF.UiTableSelectionMode.SINGLE;
			if (oFF.isNull(this.m_displayInfo))
			{
				this.m_displayInfo = this.getDisplayInfoFromFilter(this.m_variable.hasMemberFilter() ? this.m_variable.getMemberFilter() : null);
			}
		}
	}
	else if (this.m_contentType === oFF.FilterDialogContentType.HIERARCHY_CATALOG)
	{
		this.m_offerListView = true;
	}
	else if (this.m_contentType === oFF.FilterDialogContentType.MEASURE_BASED_FILTER)
	{
		this.m_offerRangeView = true;
		if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_layeredFilterName) && oFF.notNull(queryManager) && queryManager.getModelCapabilities().supportsFilterMeasureBased())
		{
			let layeredMbf = queryManager.getQueryModel().getFilter().getLinkedFilter(this.m_layeredFilterName);
			if (oFF.notNull(layeredMbf))
			{
				let filterRootElement = layeredMbf.getFilterRootElement();
				if (oFF.notNull(filterRootElement) && filterRootElement.getOlapComponentType() === oFF.FilterComponentType.FILTER_MEASURE_BASED)
				{
					this.m_filterMeasureBased = filterRootElement;
				}
			}
			if (oFF.isNull(this.m_filterMeasureBased))
			{
				this.m_filterMeasureBased = oFF.QFactory.createFilterMeasureBased(queryManager.getQueryModel(), this.m_layeredFilterName);
			}
		}
	}
	else if (this.m_contentType === oFF.FilterDialogContentType.USER_TEAM)
	{
		this.m_offerListView = true;
		this.m_simplifiedSearch = true;
		defaultPageSize = oFF.FilterDialogConfig.PAGE_SIZE_COLLAPSED_HEADER_NO_SCROLLBAR;
		defaultPreloadPageCount = oFF.FilterDialogConfig.DEFAULT_PRELOAD_PAGE_COUNT_SMALL;
	}
	this.m_listPageSize = oFF.XMath.max(args.getIntegerByKeyExt(oFF.FilterDialog.PARAM_LIST_PAGE_SIZE, defaultPageSize), 1);
	this.m_listPreloadPageCount = oFF.XMath.max(args.getIntegerByKeyExt(oFF.FilterDialog.PARAM_LIST_PRELOAD_PAGE_COUNT, defaultPreloadPageCount), 1);
	this.m_listChildNodePageSize = oFF.XMath.max(args.getIntegerByKeyExt(oFF.FilterDialog.PARAM_LIST_CHILD_NODES_PAGE_SIZE, 50), 1);
	this.m_offerClipboard = args.getBooleanByKey(oFF.FilterDialog.PARAM_OFFER_CLIPBOARD);
	this.m_offerHierarchyChange = args.getBooleanByKey(oFF.FilterDialog.PARAM_OFFER_HIERARCHY_CHANGE);
	this.m_readMode = oFF.OlapUiReadMode.lookup(args.getStringByKey(oFF.FilterDialog.PARAM_READMODE));
	this.m_offerReadModeExtendedSettings = args.getBooleanByKey(oFF.FilterDialog.PARAM_OFFER_READMODE_EXTENDED_SETTINGS);
	this.m_offerReadModeChange = this.m_offerReadModeExtendedSettings || oFF.isNull(this.m_readMode) || args.getBooleanByKey(oFF.FilterDialog.PARAM_OFFER_READMODE_CHANGE);
	this.m_hideCumulatedMeasures = args.getBooleanByKey(oFF.FilterDialog.PARAM_HIDE_CUMULATED_MEASURES);
	this.m_offerEqualInRangeFilter = args.getBooleanByKey(oFF.FilterDialog.PARAM_OFFER_EQUAL_IN_RANGE_FILTER);
	this.m_offerNullInRangeFilter = args.getBooleanByKey(oFF.FilterDialog.PARAM_OFFER_NULL_IN_RANGE_FILTER);
	this.m_dynamicDateRangeMaxYears = oFF.XMath.max(args.getIntegerByKeyExt(oFF.FilterDialog.PARAM_DYNAMIC_DATE_RANGE_MAX_YEARS, 100), 0);
	this.m_offerExcludeAdvanced = args.getBooleanByKey(oFF.FilterDialog.PARAM_OFFER_EXCLUDE_ADVANCED);
	this.m_offerExclude = !this.m_offerExcludeAdvanced && args.getBooleanByKey(oFF.FilterDialog.PARAM_OFFER_EXCLUDE);
	if (this.m_offerExclude)
	{
		this.m_excludeByDefault = args.getBooleanByKey(oFF.FilterDialog.PARAM_EXCLUDE_BY_DEFAULT);
		let singleMemberSelections = oFF.XCollectionUtils.filter(this.m_defaultSelection, (val) => {
			return val.getComparisonOperator() === oFF.ComparisonOperator.EQUAL || val.getComparisonOperator() === oFF.ComparisonOperator.NOT_EQUAL;
		});
		if (oFF.XCollectionUtils.hasElements(singleMemberSelections))
		{
			this.m_excludeByDefault = oFF.XStream.of(singleMemberSelections).allMatch((val3) => {
				return val3.isExcluded();
			});
		}
	}
	this.m_workspace = args.getStringByKey(oFF.FilterDialog.ARG_WORKSPACE);
	if (args.containsKey(oFF.FilterDialog.ARG_HIDDEN_VALUES))
	{
		this.m_hiddenValues = this.getList(args.getStringByKey(oFF.FilterDialog.ARG_HIDDEN_VALUES));
	}
};
oFF.FilterDialogConfig.prototype.setupDefaultViewType = function(args)
{
	this.m_defaultViewType = oFF.FilterDialogViewType.getByName(args.getStringByKey(oFF.FilterDialog.PARAM_DEFAULT_VIEW_TYPE));
	if (this.m_defaultViewType === oFF.FilterDialogViewType.MEASURE_BASED_FILTER || this.m_defaultViewType === oFF.FilterDialogViewType.LIST && !this.m_offerListView || this.m_defaultViewType === oFF.FilterDialogViewType.RANGE && !this.m_offerRangeView || this.m_defaultViewType === oFF.FilterDialogViewType.FUNCTIONAL_VALUES && !this.m_offerFunctionalValuesView)
	{
		this.m_defaultViewType = null;
	}
};

oFF.OuAnalyticalWidgetType = function() {};
oFF.OuAnalyticalWidgetType.prototype = new oFF.XConstant();
oFF.OuAnalyticalWidgetType.prototype._ff_c = "OuAnalyticalWidgetType";

oFF.OuAnalyticalWidgetType.CHART = null;
oFF.OuAnalyticalWidgetType.KPI = null;
oFF.OuAnalyticalWidgetType.TABLE = null;
oFF.OuAnalyticalWidgetType.s_lookup = null;
oFF.OuAnalyticalWidgetType._createWithName = function(name)
{
	let newType = oFF.XConstant.setupName(new oFF.OuAnalyticalWidgetType(), name);
	oFF.OuAnalyticalWidgetType.s_lookup.put(name, newType);
	return newType;
};
oFF.OuAnalyticalWidgetType.getAllTypeNames = function()
{
	return oFF.OuAnalyticalWidgetType.s_lookup.getKeysAsReadOnlyList();
};
oFF.OuAnalyticalWidgetType.lookup = function(name)
{
	return oFF.OuAnalyticalWidgetType.s_lookup.getByKey(name);
};
oFF.OuAnalyticalWidgetType.lookupBySemanticBindingType = function(semanticBindingType)
{
	if (semanticBindingType === oFF.SemanticBindingType.TABLE || semanticBindingType === oFF.SemanticBindingType.GRID)
	{
		return oFF.OuAnalyticalWidgetType.TABLE;
	}
	if (semanticBindingType === oFF.SemanticBindingType.KPI)
	{
		return oFF.OuAnalyticalWidgetType.KPI;
	}
	if (semanticBindingType === oFF.SemanticBindingType.CHART)
	{
		return oFF.OuAnalyticalWidgetType.CHART;
	}
	return null;
};
oFF.OuAnalyticalWidgetType.staticSetup = function()
{
	oFF.OuAnalyticalWidgetType.s_lookup = oFF.XHashMapByString.create();
	oFF.OuAnalyticalWidgetType.CHART = oFF.OuAnalyticalWidgetType._createWithName("Chart");
	oFF.OuAnalyticalWidgetType.TABLE = oFF.OuAnalyticalWidgetType._createWithName("Table");
	oFF.OuAnalyticalWidgetType.KPI = oFF.OuAnalyticalWidgetType._createWithName("Kpi");
};

oFF.FilterDialogContentType = function() {};
oFF.FilterDialogContentType.prototype = new oFF.XConstant();
oFF.FilterDialogContentType.prototype._ff_c = "FilterDialogContentType";

oFF.FilterDialogContentType.DIMENSION = null;
oFF.FilterDialogContentType.HIERARCHY_CATALOG = null;
oFF.FilterDialogContentType.MEASURE_BASED_FILTER = null;
oFF.FilterDialogContentType.USER_TEAM = null;
oFF.FilterDialogContentType.VARIABLE = null;
oFF.FilterDialogContentType.staticSetup = function()
{
	oFF.FilterDialogContentType.VARIABLE = oFF.XConstant.setupName(new oFF.FilterDialogContentType(), "Variable");
	oFF.FilterDialogContentType.DIMENSION = oFF.XConstant.setupName(new oFF.FilterDialogContentType(), "Dimension");
	oFF.FilterDialogContentType.HIERARCHY_CATALOG = oFF.XConstant.setupName(new oFF.FilterDialogContentType(), "HierarchyCatalog");
	oFF.FilterDialogContentType.MEASURE_BASED_FILTER = oFF.XConstant.setupName(new oFF.FilterDialogContentType(), "MeasureBasedFilter");
	oFF.FilterDialogContentType.USER_TEAM = oFF.XConstant.setupName(new oFF.FilterDialogContentType(), "UserTeam");
};
oFF.FilterDialogContentType.prototype.isBackendDriven = function()
{
	return this.isValueHelp() || this.isHierarchyCatalog();
};
oFF.FilterDialogContentType.prototype.isDimensionMemberValueHelp = function()
{
	return this.isEqualTo(oFF.FilterDialogContentType.DIMENSION);
};
oFF.FilterDialogContentType.prototype.isHierarchyCatalog = function()
{
	return this.isEqualTo(oFF.FilterDialogContentType.HIERARCHY_CATALOG);
};
oFF.FilterDialogContentType.prototype.isMeasureBasedFilter = function()
{
	return this.isEqualTo(oFF.FilterDialogContentType.MEASURE_BASED_FILTER);
};
oFF.FilterDialogContentType.prototype.isValueHelp = function()
{
	return this.isVariableValueHelp() || this.isDimensionMemberValueHelp();
};
oFF.FilterDialogContentType.prototype.isVariableValueHelp = function()
{
	return this.isEqualTo(oFF.FilterDialogContentType.VARIABLE);
};

oFF.FilterDialogTextUsageType = function() {};
oFF.FilterDialogTextUsageType.prototype = new oFF.XConstant();
oFF.FilterDialogTextUsageType.prototype._ff_c = "FilterDialogTextUsageType";

oFF.FilterDialogTextUsageType.AUTO = null;
oFF.FilterDialogTextUsageType.DIMENSION_DEFAULT = null;
oFF.FilterDialogTextUsageType.RESULTSET_TEXT = null;
oFF.FilterDialogTextUsageType.s_allTypes = null;
oFF.FilterDialogTextUsageType.lookup = function(name)
{
	return oFF.FilterDialogTextUsageType.s_allTypes.getByKey(name);
};
oFF.FilterDialogTextUsageType.setupTextUsageType = function(name)
{
	let textUsageType = oFF.XConstant.setupName(new oFF.FilterDialogTextUsageType(), name);
	oFF.FilterDialogTextUsageType.s_allTypes.put(name, textUsageType);
	return textUsageType;
};
oFF.FilterDialogTextUsageType.staticSetup = function()
{
	oFF.FilterDialogTextUsageType.s_allTypes = oFF.XHashMapByString.create();
	oFF.FilterDialogTextUsageType.RESULTSET_TEXT = oFF.FilterDialogTextUsageType.setupTextUsageType("resultset");
	oFF.FilterDialogTextUsageType.DIMENSION_DEFAULT = oFF.FilterDialogTextUsageType.setupTextUsageType("dimension");
	oFF.FilterDialogTextUsageType.AUTO = oFF.FilterDialogTextUsageType.setupTextUsageType("auto");
};

oFF.FilterDialogUsageTrackingConsumer = function() {};
oFF.FilterDialogUsageTrackingConsumer.prototype = new oFF.XConstant();
oFF.FilterDialogUsageTrackingConsumer.prototype._ff_c = "FilterDialogUsageTrackingConsumer";

oFF.FilterDialogUsageTrackingConsumer.CONTEXT_MENU_BUILDER = null;
oFF.FilterDialogUsageTrackingConsumer.CONTEXT_MENU_CHART = null;
oFF.FilterDialogUsageTrackingConsumer.CONTEXT_MENU_TABLE = null;
oFF.FilterDialogUsageTrackingConsumer.FILTER_LINE = null;
oFF.FilterDialogUsageTrackingConsumer.FILTER_LINE_TOKEN = null;
oFF.FilterDialogUsageTrackingConsumer.s_allConsumers = null;
oFF.FilterDialogUsageTrackingConsumer.lookup = function(name)
{
	return oFF.FilterDialogUsageTrackingConsumer.s_allConsumers.getByKey(name);
};
oFF.FilterDialogUsageTrackingConsumer.setupTextUsageType = function(name)
{
	let textUsageType = oFF.XConstant.setupName(new oFF.FilterDialogUsageTrackingConsumer(), name);
	oFF.FilterDialogUsageTrackingConsumer.s_allConsumers.put(name, textUsageType);
	return textUsageType;
};
oFF.FilterDialogUsageTrackingConsumer.staticSetup = function()
{
	oFF.FilterDialogUsageTrackingConsumer.s_allConsumers = oFF.XHashMapByString.create();
	oFF.FilterDialogUsageTrackingConsumer.FILTER_LINE = oFF.FilterDialogUsageTrackingConsumer.setupTextUsageType("FilterLine");
	oFF.FilterDialogUsageTrackingConsumer.FILTER_LINE_TOKEN = oFF.FilterDialogUsageTrackingConsumer.setupTextUsageType("FilterLineToken");
	oFF.FilterDialogUsageTrackingConsumer.CONTEXT_MENU_TABLE = oFF.FilterDialogUsageTrackingConsumer.setupTextUsageType("ContextMenuTable");
	oFF.FilterDialogUsageTrackingConsumer.CONTEXT_MENU_CHART = oFF.FilterDialogUsageTrackingConsumer.setupTextUsageType("ContextMenuChart");
	oFF.FilterDialogUsageTrackingConsumer.CONTEXT_MENU_BUILDER = oFF.FilterDialogUsageTrackingConsumer.setupTextUsageType("ContextMenuBuilder");
};

oFF.FilterDialogViewType = function() {};
oFF.FilterDialogViewType.prototype = new oFF.XConstant();
oFF.FilterDialogViewType.prototype._ff_c = "FilterDialogViewType";

oFF.FilterDialogViewType.FUNCTIONAL_VALUES = null;
oFF.FilterDialogViewType.LIST = null;
oFF.FilterDialogViewType.MEASURE_BASED_FILTER = null;
oFF.FilterDialogViewType.RANGE = null;
oFF.FilterDialogViewType.s_allTypes = null;
oFF.FilterDialogViewType.getAllFilterTypes = function()
{
	return oFF.FilterDialogViewType.s_allTypes.getValuesAsReadOnlyList();
};
oFF.FilterDialogViewType.getByName = function(name)
{
	return oFF.FilterDialogViewType.s_allTypes.getByKey(name);
};
oFF.FilterDialogViewType.setupFilterType = function(name)
{
	let filterType = oFF.XConstant.setupName(new oFF.FilterDialogViewType(), name);
	oFF.FilterDialogViewType.s_allTypes.put(name, filterType);
	return filterType;
};
oFF.FilterDialogViewType.staticSetup = function()
{
	oFF.FilterDialogViewType.s_allTypes = oFF.XHashMapByString.create();
	oFF.FilterDialogViewType.LIST = oFF.FilterDialogViewType.setupFilterType("List");
	oFF.FilterDialogViewType.RANGE = oFF.FilterDialogViewType.setupFilterType("Range");
	oFF.FilterDialogViewType.MEASURE_BASED_FILTER = oFF.FilterDialogViewType.setupFilterType("MeasureBasedFilter");
	oFF.FilterDialogViewType.FUNCTIONAL_VALUES = oFF.FilterDialogViewType.setupFilterType("FunctionalValues");
};
oFF.FilterDialogViewType.prototype.isSupportedByDim = function(dimension)
{
	if (oFF.notNull(dimension))
	{
		if (this === oFF.FilterDialogViewType.LIST)
		{
			return true;
		}
		if (this === oFF.FilterDialogViewType.RANGE)
		{
			let flatKeyField = dimension.getFlatKeyField();
			let valueType = flatKeyField.getValueType();
			if (valueType.isNumber())
			{
				return true;
			}
			let supportsDateRangeFilter = oFF.QFilterUtil.supportsDateRangeFilter(flatKeyField);
			if (supportsDateRangeFilter || valueType.isDateBased() || dimension.getDimensionType() === oFF.DimensionType.TIME || dimension.getDimensionType() === oFF.DimensionType.DATE)
			{
				return supportsDateRangeFilter;
			}
			let filterCapability = dimension.getFilterCapabilities().getFilterCapabilitiesByField(flatKeyField);
			return oFF.notNull(filterCapability) && oFF.XCollectionUtils.contains(filterCapability.getSupportedComparisonOperators(oFF.SetSign.INCLUDING), (incOperator) => {
				return incOperator.isRange();
			}) && !dimension.getDimensionType().isTypeOf(oFF.DimensionType.GENERAL_VERSION);
		}
		if (this === oFF.FilterDialogViewType.MEASURE_BASED_FILTER)
		{
			return (dimension.isStructure() || dimension.getDimensionType() === oFF.DimensionType.ACCOUNT) && dimension.getQueryModel().getModelCapabilities().supportsFilterMeasureBased();
		}
		if (this === oFF.FilterDialogViewType.FUNCTIONAL_VALUES)
		{
			return false;
		}
	}
	return false;
};
oFF.FilterDialogViewType.prototype.isSupportedByMember = function(member)
{
	if (oFF.isNull(member) || !this.isSupportedByDim(member.getDimension()))
	{
		return false;
	}
	if (this === oFF.FilterDialogViewType.MEASURE_BASED_FILTER)
	{
		if (member.getMemberType().isTypeOf(oFF.MemberType.MEASURE))
		{
			let isNumericShiftPercentByApi = member.isNumericShiftPercent();
			let isNumericShiftPercentByShift = member.getDimension().getQueryManager().getSystemType().isTypeOf(oFF.SystemType.HANA) && member.getNumericShift() !== null && member.getNumericShift().getInteger() === 2;
			return !(isNumericShiftPercentByApi || isNumericShiftPercentByShift);
		}
		return false;
	}
	return true;
};
oFF.FilterDialogViewType.prototype.isSupportedByVar = function(variable)
{
	if (oFF.notNull(variable) && variable.getVariableType().isTypeOf(oFF.VariableType.DIMENSION_MEMBER_VARIABLE))
	{
		if (this === oFF.FilterDialogViewType.LIST)
		{
			return true;
		}
		if (this === oFF.FilterDialogViewType.RANGE)
		{
			let dimMemberVar = variable;
			if (variable.getVariableType().isTypeOf(oFF.VariableType.HIERARCHY_NODE_VARIABLE) && oFF.XStringUtils.isNotNullAndNotEmpty(dimMemberVar.getHierarchyName()))
			{
				return false;
			}
			let filterCapability = dimMemberVar.getFilterCapability();
			return oFF.notNull(filterCapability) && oFF.XCollectionUtils.contains(filterCapability.getSupportedComparisonOperators(oFF.SetSign.INCLUDING), (incOperator) => {
				return incOperator.isRange();
			});
		}
	}
	return false;
};

oFF.FilterDialogValueType = function() {};
oFF.FilterDialogValueType.prototype = new oFF.XConstant();
oFF.FilterDialogValueType.prototype._ff_c = "FilterDialogValueType";

oFF.FilterDialogValueType.BASIC = null;
oFF.FilterDialogValueType.DATE_RANGE_DYNAMIC = null;
oFF.FilterDialogValueType.DATE_RANGE_FIXED = null;
oFF.FilterDialogValueType.HIERARCHY_CATALOG = null;
oFF.FilterDialogValueType.RANGE = null;
oFF.FilterDialogValueType.TEAM = null;
oFF.FilterDialogValueType.USER = null;
oFF.FilterDialogValueType.VALUEHELP = null;
oFF.FilterDialogValueType.staticSetup = function()
{
	oFF.FilterDialogValueType.BASIC = oFF.XConstant.setupName(new oFF.FilterDialogValueType(), "basic");
	oFF.FilterDialogValueType.VALUEHELP = oFF.XConstant.setupName(new oFF.FilterDialogValueType(), "valueHelp");
	oFF.FilterDialogValueType.RANGE = oFF.XConstant.setupName(new oFF.FilterDialogValueType(), "range");
	oFF.FilterDialogValueType.DATE_RANGE_DYNAMIC = oFF.XConstant.setupName(new oFF.FilterDialogValueType(), "dateRangeDynamic");
	oFF.FilterDialogValueType.DATE_RANGE_FIXED = oFF.XConstant.setupName(new oFF.FilterDialogValueType(), "dateRangeFixed");
	oFF.FilterDialogValueType.HIERARCHY_CATALOG = oFF.XConstant.setupName(new oFF.FilterDialogValueType(), "hierarchyCatalog");
	oFF.FilterDialogValueType.USER = oFF.XConstant.setupName(new oFF.FilterDialogValueType(), "user");
	oFF.FilterDialogValueType.TEAM = oFF.XConstant.setupName(new oFF.FilterDialogValueType(), "team");
};

oFF.OuDataProviderCommandPlugin = function() {};
oFF.OuDataProviderCommandPlugin.prototype = new oFF.HuDfCommandPlugin();
oFF.OuDataProviderCommandPlugin.prototype._ff_c = "OuDataProviderCommandPlugin";

oFF.OuDataProviderCommandPlugin.DEFAULT_SHARED_SPACE_NAME = "DataProviderCommand.SharedSpace";
oFF.OuDataProviderCommandPlugin.PLUGIN_NAME = "DataProviderCommand";
oFF.OuDataProviderCommandPlugin.SPACE_STORAGE = "DataProviderCommand.Storage";
oFF.OuDataProviderCommandPlugin.runAllDataProviderNames = function(controller)
{
	let actionId = oFF.XStringUtils.concatenate3(oFF.OuDataProviderCommandPlugin.PLUGIN_NAME, ".", oFF.OuDataProviderCPConstants.CMD_GET_ALL_DATA_PROVIDER_NAMES);
	return controller.executeActionById(actionId, null).then((result) => {
		return result;
	}, null);
};
oFF.OuDataProviderCommandPlugin.runGetActiveDataProvider = function(controller)
{
	let actionId = oFF.XStringUtils.concatenate3(oFF.OuDataProviderCommandPlugin.PLUGIN_NAME, ".", oFF.OuDataProviderCPConstants.CMD_GET_ACTIVE_DATA_PROVIDER);
	return controller.executeActionById(actionId, null).then((result) => {
		return result;
	}, null);
};
oFF.OuDataProviderCommandPlugin.runGetDataProviderByName = function(controller, dataProviderName)
{
	let actionId = oFF.XStringUtils.concatenate3(oFF.OuDataProviderCommandPlugin.PLUGIN_NAME, ".", oFF.OuDataProviderCPConstants.CMD_GET_DATA_PROVIDER_BY_NAME);
	let param = oFF.OuDataProviderCPParam.createForGetDataProvider(dataProviderName);
	return controller.executeActionById(actionId, param).then((result) => {
		return result;
	}, null);
};
oFF.OuDataProviderCommandPlugin.runRegisterDataProviderConfigAction = function(controller, dataProviderName, config)
{
	let actionId = oFF.XStringUtils.concatenate3(oFF.OuDataProviderCommandPlugin.PLUGIN_NAME, ".", oFF.OuDataProviderCPConstants.CMD_REGISTER_DATA_PROVIDER_CONFIG);
	let param = oFF.OuDataProviderCPParam.createForRegisterDataSource(dataProviderName, config);
	return controller.executeActionById(actionId, param);
};
oFF.OuDataProviderCommandPlugin.runRegisterExistingDataProviderAction = function(controller, dataProviderName, dataProvider)
{
	let actionId = oFF.XStringUtils.concatenate3(oFF.OuDataProviderCommandPlugin.PLUGIN_NAME, ".", oFF.OuDataProviderCPConstants.CMD_REGISTER_EXISTING_DATA_PROVIDER);
	let param = oFF.OuDataProviderCPParam.createForRegisterExistingDataProvider(dataProviderName, dataProvider);
	return controller.executeActionById(actionId, param);
};
oFF.OuDataProviderCommandPlugin.runRegisterExistingQueryManagerAction = function(controller, dataProviderName, queryManager)
{
	let actionId = oFF.XStringUtils.concatenate3(oFF.OuDataProviderCommandPlugin.PLUGIN_NAME, ".", oFF.OuDataProviderCPConstants.CMD_REGISTER_EXISTING_QUERY_MANAGER);
	let param = oFF.OuDataProviderCPParam.createForRegisterExistingQueryManager(dataProviderName, queryManager);
	return controller.executeActionById(actionId, param).then((result) => {
		return result;
	}, null);
};
oFF.OuDataProviderCommandPlugin.runReleaseDataProvider = function(controller, dataProviderName)
{
	let actionId = oFF.XStringUtils.concatenate3(oFF.OuDataProviderCommandPlugin.PLUGIN_NAME, ".", oFF.OuDataProviderCPConstants.CMD_RELEASE_DATA_PROVIDER);
	let param = oFF.OuDataProviderCPParam.createForGetDataProvider(dataProviderName);
	return controller.executeActionById(actionId, param).then((result) => {
		return result;
	}, null);
};
oFF.OuDataProviderCommandPlugin.runSetActiveDataProvider = function(controller, dataProviderName)
{
	let actionId = oFF.XStringUtils.concatenate3(oFF.OuDataProviderCommandPlugin.PLUGIN_NAME, ".", oFF.OuDataProviderCPConstants.CMD_SET_ACTIVE_DATA_PROVIDER);
	let param = oFF.OuDataProviderCPParam.createForGetDataProvider(dataProviderName);
	return controller.executeActionById(actionId, param);
};
oFF.OuDataProviderCommandPlugin.prototype.m_activeDataProviderName = null;
oFF.OuDataProviderCommandPlugin.prototype.m_dataProviderAddedConsumerId = null;
oFF.OuDataProviderCommandPlugin.prototype.m_dataProviderRemovedConsumerId = null;
oFF.OuDataProviderCommandPlugin.prototype.m_dpPoolChangeListenerId = null;
oFF.OuDataProviderCommandPlugin.prototype.m_onDataProviderAddedConsumer = null;
oFF.OuDataProviderCommandPlugin.prototype.m_onDataProviderRemovedConsumer = null;
oFF.OuDataProviderCommandPlugin.prototype.m_sharedDataSpaceName = null;
oFF.OuDataProviderCommandPlugin.prototype._getDPPool = function()
{
	return this.getProcess().getDataProviderPool();
};
oFF.OuDataProviderCommandPlugin.prototype._setupSharedStorage = function()
{
	let sharedDataSpace = this.getController().getProcess().getSharedDataSpace(this.m_sharedDataSpaceName);
	if (oFF.isNull(sharedDataSpace))
	{
		sharedDataSpace = this.getController().getProcess().createSharedDataSpace(this.m_sharedDataSpaceName);
	}
	if (!sharedDataSpace.containsKey(oFF.OuDataProviderCommandPlugin.SPACE_STORAGE))
	{
		let storage = oFF.OuDataProviderCPStorage.createDpStorage();
		sharedDataSpace.putXObject(oFF.OuDataProviderCommandPlugin.SPACE_STORAGE, storage);
	}
};
oFF.OuDataProviderCommandPlugin.prototype._subscribeToDPPoolChanges = function()
{
	let dataProviderPool = this._getDPPool();
	if (oFF.notNull(dataProviderPool))
	{
		this.m_dpPoolChangeListenerId = dataProviderPool.addChangeConsumer((dataProviderName) => {
			let isAdded = dataProviderPool.hasDataProviderByName(dataProviderName);
			let dpNameXString = oFF.XStringValue.create(dataProviderName);
			if (isAdded && oFF.notNull(this.m_onDataProviderAddedConsumer))
			{
				this.m_onDataProviderAddedConsumer(dpNameXString);
			}
			else if (!isAdded && oFF.notNull(this.m_onDataProviderRemovedConsumer))
			{
				this.m_onDataProviderRemovedConsumer(dpNameXString);
			}
		});
	}
};
oFF.OuDataProviderCommandPlugin.prototype._unsubscribeFromDPPoolChanges = function()
{
	let dataProviderPool = this._getDPPool();
	if (oFF.notNull(dataProviderPool) && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_dpPoolChangeListenerId))
	{
		dataProviderPool.removeChangeConsumerByUuid(this.m_dpPoolChangeListenerId);
		this.m_dpPoolChangeListenerId = null;
	}
};
oFF.OuDataProviderCommandPlugin.prototype.createDataProvider = function(config)
{
	let dataProviderName = config.getDataProviderName();
	if (oFF.XStringUtils.isNullOrEmpty(dataProviderName))
	{
		return oFF.XPromise.reject(oFF.XError.create("dataprovider name cannot be empty"));
	}
	config.getHooks().getFinalizeQueryManagerRegister().addFunction((dataProvider) => {
		let queryManager = dataProvider.getQueryManager();
		let applicationSettings = queryManager.getQueryModel().getVisualizationManager().getApplicationSettings();
		applicationSettings.setMaxRows(oFF.XMath.max(-1, applicationSettings.getMaxRows()));
		applicationSettings.setMaxColumns(oFF.XMath.max(50, applicationSettings.getMaxColumns()));
		applicationSettings.setMinRowsFetch(oFF.XMath.max(150, applicationSettings.getMinRowsFetch()));
		applicationSettings.setMinColumnsFetch(oFF.XMath.max(50, applicationSettings.getMinColumnsFetch()));
		return null;
	});
	let newDpPromise = oFF.OuDataProviderFactory.createDataProviderFromSource(config);
	this.getSharedStorage().putDataProviderPromise(dataProviderName, newDpPromise);
	return newDpPromise;
};
oFF.OuDataProviderCommandPlugin.prototype.createDataProviderAction = function(param)
{
	return this.createDataProvider(param.getDataProviderConfig());
};
oFF.OuDataProviderCommandPlugin.prototype.destroyPlugin = function()
{
	let sharedStorage = this.getSharedStorage();
	oFF.XCollectionUtils.forEach(sharedStorage.getAllAvailableDataProviderNames(), (dpName) => {
		let param = oFF.OuDataProviderCPParam.createForGetDataProvider(dpName);
		this.releaseDataProviderAction(param);
	});
	sharedStorage.getDataProviderAddListeners().removeConsumerByUuid(this.m_dataProviderAddedConsumerId);
	sharedStorage.getDataProviderRemoveListeners().removeConsumerByUuid(this.m_dataProviderRemovedConsumerId);
	this._unsubscribeFromDPPoolChanges();
	this.m_dataProviderAddedConsumerId = null;
	this.m_dataProviderRemovedConsumerId = null;
	this.m_onDataProviderAddedConsumer = null;
	this.m_onDataProviderRemovedConsumer = null;
	this.m_sharedDataSpaceName = null;
	oFF.HuDfCommandPlugin.prototype.destroyPlugin.call( this );
};
oFF.OuDataProviderCommandPlugin.prototype.getActiveDataProviderAction = function()
{
	return this.getDataProviderByNameAction(this.m_activeDataProviderName);
};
oFF.OuDataProviderCommandPlugin.prototype.getDataProviderAction = function(param)
{
	let dataProviderName = param.getDataProviderName();
	return this.getDataProviderByNameAction(dataProviderName);
};
oFF.OuDataProviderCommandPlugin.prototype.getDataProviderByNameAction = function(dataProviderName)
{
	let dpPool = this.getProcess().getDataProviderPool();
	if (oFF.notNull(dpPool))
	{
		let dataProviderFromPool = dpPool.getDataProviderByName(dataProviderName);
		if (oFF.notNull(dataProviderFromPool))
		{
			return oFF.XPromise.resolve(dataProviderFromPool);
		}
	}
	let sharedStorage = this.getSharedStorage();
	let dataProvider = sharedStorage.getActiveDataProviders().getByKey(dataProviderName);
	if (oFF.notNull(dataProvider) && !dataProvider.isReleased())
	{
		return oFF.XPromise.resolve(dataProvider);
	}
	let dpPromise = sharedStorage.getDataProviderPromises().getByKey(dataProviderName);
	if (oFF.notNull(dpPromise) && dpPromise.getState() !== oFF.XPromiseState.REJECTED)
	{
		return dpPromise;
	}
	let dpConfig = sharedStorage.getDataProviderConfigs().getByKey(dataProviderName);
	if (oFF.isNull(dpConfig))
	{
		return oFF.XPromise.reject(this.getNotFoundError(dataProviderName));
	}
	return this.createDataProvider(dpConfig);
};
oFF.OuDataProviderCommandPlugin.prototype.getNotFoundError = function(dataProviderName)
{
	let errorMsg = oFF.XStringUtils.concatenate2("No DataProvider or DataProviderConfig found for name ", dataProviderName);
	return oFF.XError.create(errorMsg);
};
oFF.OuDataProviderCommandPlugin.prototype.getNotificationDataWithDpName = function(dataProviderName)
{
	let data = oFF.XNotificationData.create();
	data.putString(oFF.OuDataProviderCPConstants.NOTIFICATION_PARAM_DATA_PROVIDER_NAME, dataProviderName);
	return data;
};
oFF.OuDataProviderCommandPlugin.prototype.getPluginCategory = function()
{
	return oFF.HuPluginCategory.OLAP;
};
oFF.OuDataProviderCommandPlugin.prototype.getPluginName = function()
{
	return oFF.OuDataProviderCommandPlugin.PLUGIN_NAME;
};
oFF.OuDataProviderCommandPlugin.prototype.getSharedStorage = function()
{
	let sharedDataSpace = this.getController().getProcess().getSharedDataSpace(this.m_sharedDataSpaceName);
	return sharedDataSpace.getXObjectByKey(oFF.OuDataProviderCommandPlugin.SPACE_STORAGE);
};
oFF.OuDataProviderCommandPlugin.prototype.onStorageAdded = function(dataProviderName)
{
	let data = this.getNotificationDataWithDpName(dataProviderName.getString());
	this.getController().getLocalNotificationCenter().postNotificationWithName(oFF.OuDataProviderCPConstants.NOTIFICATION_DATA_PROVIDER_ADDED, data);
};
oFF.OuDataProviderCommandPlugin.prototype.onStorageRemoved = function(dataProviderName)
{
	let data = this.getNotificationDataWithDpName(dataProviderName.getString());
	this.getController().getLocalNotificationCenter().postNotificationWithName(oFF.OuDataProviderCPConstants.NOTIFICATION_DATA_PROVIDER_REMOVED, data);
};
oFF.OuDataProviderCommandPlugin.prototype.readDataSourcesFromConfig = function()
{
	let config = this.getConfiguration();
	let dataSources = config.getListByKey(oFF.OuDataProviderCPConstants.CONFIG_DATA_PROVIDER_LIST);
	if (!oFF.XCollectionUtils.hasElements(dataSources))
	{
		return;
	}
	for (let i = 0; i < dataSources.size(); i++)
	{
		let dataSourceJson = dataSources.get(i).asStructure();
		let dataProviderName = dataSourceJson.getStringByKey(oFF.OuDataProviderCPConstants.CONFIG_DATA_PROVIDER_NAME);
		let configJson = dataSourceJson.getStructureByKey(oFF.OuDataProviderCPConstants.CONFIG_DATA_PROVIDER_CONFIG);
		if (oFF.isNull(configJson))
		{
			continue;
		}
		let dpConfig = oFF.OuDataProviderConfiguration.createConfigFromJson(this.getController().getApplication(), configJson);
		dpConfig.setDataProviderName(dataProviderName);
		this.getSharedStorage().putDataProviderConfig(dataProviderName, dpConfig);
	}
};
oFF.OuDataProviderCommandPlugin.prototype.registerActions = function(commandController)
{
	commandController.registerAction(oFF.OuDataProviderCPConstants.CMD_REGISTER_DATA_PROVIDER_CONFIG, (context, data) => {
		return this.registerDataProviderConfigAction(data).onThenExt((registerResult) => {
			return registerResult;
		});
	});
	commandController.registerAction(oFF.OuDataProviderCPConstants.CMD_REGISTER_EXISTING_QUERY_MANAGER, (context, data) => {
		return this.registerExistingQueryManagerAction(data).onThenExt((dataProvider) => {
			return dataProvider;
		});
	});
	commandController.registerAction(oFF.OuDataProviderCPConstants.CMD_REGISTER_EXISTING_DATA_PROVIDER, (context, data) => {
		return this.registerExistingDataProviderAction(data).onThenExt((registerResult) => {
			return registerResult;
		});
	});
	commandController.registerAction(oFF.OuDataProviderCPConstants.CMD_CREATE_DATA_PROVIDER_WITH_CONFIG, (context, data) => {
		return this.createDataProviderAction(data).onThenExt((dataProvider) => {
			return dataProvider;
		});
	});
	commandController.registerAction(oFF.OuDataProviderCPConstants.CMD_GET_DATA_PROVIDER_BY_NAME, (context, data) => {
		return this.getDataProviderAction(data).onThenExt((dataProvider) => {
			return dataProvider;
		});
	});
	commandController.registerAction(oFF.OuDataProviderCPConstants.CMD_GET_ALL_DATA_PROVIDER_NAMES, (context, data) => {
		return oFF.XPromise.resolve(this.getSharedStorage().getAllAvailableDataProviderNames());
	});
	commandController.registerAction(oFF.OuDataProviderCPConstants.CMD_RELEASE_DATA_PROVIDER, (context, data) => {
		return this.releaseDataProviderAction(data).onThenExt((releaseResult) => {
			return releaseResult;
		});
	});
	commandController.registerAction(oFF.OuDataProviderCPConstants.CMD_SET_ACTIVE_DATA_PROVIDER, (context, data) => {
		return this.setActiveDataProviderAction(data).onThenExt((setResult) => {
			return setResult;
		});
	});
	commandController.registerAction(oFF.OuDataProviderCPConstants.CMD_GET_ACTIVE_DATA_PROVIDER, (context, data) => {
		return this.getActiveDataProviderAction().onThenExt((activeDp) => {
			return activeDp;
		});
	});
};
oFF.OuDataProviderCommandPlugin.prototype.registerDataProviderConfigAction = function(param)
{
	let dataProviderName = param.getDataProviderName();
	let dpConfig = param.getDataProviderConfig();
	if (oFF.XStringUtils.isNullOrEmpty(dataProviderName) || oFF.isNull(dpConfig))
	{
		return oFF.XPromise.reject(oFF.XError.create("Please provide a valid parameter."));
	}
	this.getSharedStorage().putDataProviderConfig(dataProviderName, dpConfig);
	return oFF.XPromise.resolve(oFF.XBooleanValue.create(true));
};
oFF.OuDataProviderCommandPlugin.prototype.registerExistingDataProviderAction = function(param)
{
	let dataProviderName = param.getDataProviderName();
	let dataProvider = param.getDataProvider();
	this.getSharedStorage().putActiveDataProvider(dataProviderName, dataProvider);
	return oFF.XPromise.resolve(oFF.XBooleanValue.create(true));
};
oFF.OuDataProviderCommandPlugin.prototype.registerExistingQueryManagerAction = function(param)
{
	let dataProviderName = param.getDataProviderName();
	let queryManager = param.getQueryManager();
	let dpConfig = oFF.OuDataProviderConfiguration.createConfig(this.getController().getApplication(), queryManager.getDataSource());
	return oFF.OuDataProviderFactory.createDataProviderFromQueryManager(queryManager, dpConfig).onThen((dp) => {
		this.getSharedStorage().putActiveDataProvider(dataProviderName, dp);
	});
};
oFF.OuDataProviderCommandPlugin.prototype.releaseDataProviderAction = function(param)
{
	let dataProviderName = param.getDataProviderName();
	let activeDataProvider;
	let dataProviderPool = this.getProcess().getDataProviderPool();
	if (oFF.notNull(dataProviderPool))
	{
		activeDataProvider = dataProviderPool.getDataProviderByName(dataProviderName);
		if (oFF.notNull(activeDataProvider))
		{
			dataProviderPool.removeDataProviderByName(dataProviderName);
			return this.shutdownDataProviderAction(dataProviderName, activeDataProvider);
		}
	}
	let sharedStorage = this.getSharedStorage();
	activeDataProvider = sharedStorage.getActiveDataProviders().getByKey(dataProviderName);
	if (oFF.notNull(activeDataProvider))
	{
		return this.shutdownDataProviderAction(dataProviderName, activeDataProvider);
	}
	let dpPromise = sharedStorage.getDataProviderPromises().getByKey(dataProviderName);
	if (oFF.notNull(dpPromise) && dpPromise.getState() !== oFF.XPromiseState.REJECTED)
	{
		return oFF.XPromise.create((resolve, reject) => {
			dpPromise.onThen((dataProvider) => {
				this.shutdownDataProviderAction(dataProviderName, dataProvider);
			}).onCatch(reject);
		});
	}
	return oFF.XPromise.reject(this.getNotFoundError(dataProviderName));
};
oFF.OuDataProviderCommandPlugin.prototype.setActiveDataProviderAction = function(param)
{
	let dataProviderName = param.getDataProviderName();
	let dataProviderPool = this.getProcess().getDataProviderPool();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(dataProviderName) && !this.getSharedStorage().getAllAvailableDataProviderNames().contains(dataProviderName) && (oFF.isNull(dataProviderPool) || !dataProviderPool.hasDataProviderByName(dataProviderName)))
	{
		return oFF.XPromise.reject(this.getNotFoundError(dataProviderName));
	}
	this.m_activeDataProviderName = dataProviderName;
	let data = this.getNotificationDataWithDpName(this.m_activeDataProviderName);
	this.getController().getLocalNotificationCenter().postNotificationWithName(oFF.OuDataProviderCPConstants.NOTIFICATION_ACTIVE_DATA_PROVIDER_CHANGED, data);
	return oFF.XPromise.resolve(oFF.XBooleanValue.create(true));
};
oFF.OuDataProviderCommandPlugin.prototype.setupPlugin = function(controller)
{
	oFF.HuDfCommandPlugin.prototype.setupPlugin.call( this , controller);
	this.m_sharedDataSpaceName = this.getConfiguration().getStringByKey(oFF.OuDataProviderCPConstants.CONFIG_SHARED_DATA_SPACE_NAME);
	if (oFF.XStringUtils.isNullOrEmpty(this.m_sharedDataSpaceName))
	{
		this.m_sharedDataSpaceName = oFF.OuDataProviderCommandPlugin.DEFAULT_SHARED_SPACE_NAME;
	}
	this.m_onDataProviderAddedConsumer = this.onStorageAdded.bind(this);
	this.m_onDataProviderRemovedConsumer = this.onStorageRemoved.bind(this);
	this._setupSharedStorage();
	this.m_dataProviderAddedConsumerId = this.getSharedStorage().getDataProviderAddListeners().addConsumer(this.m_onDataProviderAddedConsumer);
	this.m_dataProviderRemovedConsumerId = this.getSharedStorage().getDataProviderRemoveListeners().addConsumer(this.m_onDataProviderRemovedConsumer);
	this._subscribeToDPPoolChanges();
	this.readDataSourcesFromConfig();
	return null;
};
oFF.OuDataProviderCommandPlugin.prototype.shutdownDataProviderAction = function(dataProviderName, dataProvider)
{
	let shutdownPromise = dataProvider.getActions().getLifecycleActions().disconnectDataProvider();
	this.getSharedStorage().removeActiveDataProvider(dataProviderName);
	return shutdownPromise;
};

oFF.OlapUiReadMode = function() {};
oFF.OlapUiReadMode.prototype = new oFF.XConstant();
oFF.OlapUiReadMode.prototype._ff_c = "OlapUiReadMode";

oFF.OlapUiReadMode.BOOKED = null;
oFF.OlapUiReadMode.BOOKED_CASCADING = null;
oFF.OlapUiReadMode.MASTER = null;
oFF.OlapUiReadMode.QUERY_DEFAULT = null;
oFF.OlapUiReadMode.s_lookup = null;
oFF.OlapUiReadMode.create = function(name, ffReadMode)
{
	let readMode = oFF.XConstant.setupName(new oFF.OlapUiReadMode(), name);
	readMode.m_ffReadMode = ffReadMode;
	oFF.OlapUiReadMode.s_lookup.put(oFF.XString.toLowerCase(name), readMode);
	return readMode;
};
oFF.OlapUiReadMode.lookup = function(value)
{
	return oFF.OlapUiReadMode.s_lookup.getByKey(oFF.XString.toLowerCase(value));
};
oFF.OlapUiReadMode.lookupByFFReadMode = function(readMode)
{
	return oFF.XCollectionUtils.findFirst(oFF.OlapUiReadMode.s_lookup.getValuesAsReadOnlyList(), (olapUiReadMode) => {
		return olapUiReadMode.getFFReadMode() === readMode;
	});
};
oFF.OlapUiReadMode.staticSetup = function()
{
	oFF.OlapUiReadMode.s_lookup = oFF.XHashMapByString.create();
	oFF.OlapUiReadMode.BOOKED = oFF.OlapUiReadMode.create("booked", oFF.QMemberReadMode.BOOKED);
	oFF.OlapUiReadMode.BOOKED_CASCADING = oFF.OlapUiReadMode.create("bookedCascading", oFF.QMemberReadMode.BOOKED_AND_SPACE_AND_STATE);
	oFF.OlapUiReadMode.MASTER = oFF.OlapUiReadMode.create("master", oFF.QMemberReadMode.MASTER);
	oFF.OlapUiReadMode.QUERY_DEFAULT = oFF.OlapUiReadMode.create("default", oFF.QMemberReadMode.DEFAULT_VALUE);
};
oFF.OlapUiReadMode.prototype.m_ffReadMode = null;
oFF.OlapUiReadMode.prototype.getFFReadMode = function()
{
	return this.m_ffReadMode;
};

oFF.DfOuDataProviderComponentPlugin = function() {};
oFF.DfOuDataProviderComponentPlugin.prototype = new oFF.HuDfComponentPlugin();
oFF.DfOuDataProviderComponentPlugin.prototype._ff_c = "DfOuDataProviderComponentPlugin";

oFF.DfOuDataProviderComponentPlugin.NOTIFICATION_COMPONENT_PLUGIN_REFRESH = "com.sap.ff.DataProviderComponentPlugin.Notification.Refresh";
oFF.DfOuDataProviderComponentPlugin.prototype.m_dpEventManager = null;
oFF.DfOuDataProviderComponentPlugin.prototype.m_isUiReady = false;
oFF.DfOuDataProviderComponentPlugin.prototype.m_pluginRefreshObserverId = null;
oFF.DfOuDataProviderComponentPlugin.prototype._fireOnDataProviderReady = function(dataProvider)
{
	if (this.m_isUiReady)
	{
		let controller = this.getController();
		controller.setBusy(true);
		let qmPromise = oFF.notNull(dataProvider) ? dataProvider.getOrCreateQueryManager() : oFF.XPromise.resolve(null);
		qmPromise.onThen((qm) => {
			this.onDataProviderReady(dataProvider);
		}).onCatch((error) => {
			oFF.XLogger.printError(error.getText());
		}).onFinally(() => {
			controller.setBusy(false);
		});
	}
};
oFF.DfOuDataProviderComponentPlugin.prototype._observePluginNotifications = function()
{
	let notificationCenter = this.getController().getLocalNotificationCenter();
	this.m_pluginRefreshObserverId = notificationCenter.addObserverForName(oFF.DfOuDataProviderComponentPlugin.NOTIFICATION_COMPONENT_PLUGIN_REFRESH, (data) => {
		this._fireOnDataProviderReady(this.getDataProvider());
	});
};
oFF.DfOuDataProviderComponentPlugin.prototype._setupEventManager = function(controller, dpName)
{
	this.m_dpEventManager = oFF.OuDataProviderPluginEventManager.create(controller, dpName);
	this.m_dpEventManager.setDataProviderReadyListener(this._fireOnDataProviderReady.bind(this));
	this.m_dpEventManager.setDataProviderReleasedListener(this.onDataProviderReleased.bind(this));
	this.m_dpEventManager.setDataProviderModelChangeListener((dp, evt1) => {
		this.onDataProviderModelChange(dp, evt1);
	});
	this.m_dpEventManager.setDataProviderVizChangeListener((vizName, evt2) => {
		this.onDataProviderVizChange(vizName, evt2);
	});
	this.m_dpEventManager.setDataProviderResultDataFetchListener((dp, evt3) => {
		this.onDataProviderResultDataFetch(dp, evt3);
	});
};
oFF.DfOuDataProviderComponentPlugin.prototype._unobservePluginNotifications = function()
{
	let notificationCenter = this.getController().getLocalNotificationCenter();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_pluginRefreshObserverId))
	{
		notificationCenter.removeObserverByUuid(this.m_pluginRefreshObserverId);
		this.m_pluginRefreshObserverId = null;
	}
};
oFF.DfOuDataProviderComponentPlugin.prototype.buildPluginUi = function(genesis)
{
	this.buildDataProviderPluginUi(genesis);
	this.m_isUiReady = true;
	let dataProvider = this.getDataProvider();
	if (oFF.notNull(dataProvider))
	{
		this._fireOnDataProviderReady(dataProvider);
	}
};
oFF.DfOuDataProviderComponentPlugin.prototype.destroyPlugin = function()
{
	this._unobservePluginNotifications();
	this.m_dpEventManager = oFF.XObjectExt.release(this.m_dpEventManager);
	oFF.HuDfComponentPlugin.prototype.destroyPlugin.call( this );
};
oFF.DfOuDataProviderComponentPlugin.prototype.getDataProvider = function()
{
	return this.m_dpEventManager.getDataProvider();
};
oFF.DfOuDataProviderComponentPlugin.prototype.getMenuCommandConsumer = function()
{
	return oFF.XBiConsumerHolder.create((s, p) => {
		let dataProvider = this.getDataProvider();
		if (oFF.notNull(dataProvider))
		{
			dataProvider.getActions().executeActionByName(s, p);
		}
	});
};
oFF.DfOuDataProviderComponentPlugin.prototype.notifyDataProviderUpdateListeners = function()
{
	this.m_dpEventManager.notifyDataProviderUpdateListeners();
};
oFF.DfOuDataProviderComponentPlugin.prototype.setupPlugin = function(controller)
{
	oFF.HuDfComponentPlugin.prototype.setupPlugin.call( this , controller);
	this._setupEventManager(controller, this.getConfiguration().getStringByKey(oFF.OuDataProviderConfiguration.CONFIG_DATA_PROVIDER_NAME));
	this._observePluginNotifications();
	return null;
};

oFF.DfOuDataProviderDocumentPlugin = function() {};
oFF.DfOuDataProviderDocumentPlugin.prototype = new oFF.HuDfDocumentPlugin();
oFF.DfOuDataProviderDocumentPlugin.prototype._ff_c = "DfOuDataProviderDocumentPlugin";

oFF.DfOuDataProviderDocumentPlugin.prototype.m_dpEventManager = null;
oFF.DfOuDataProviderDocumentPlugin.prototype.m_isUiReady = false;
oFF.DfOuDataProviderDocumentPlugin.prototype._fireOnDataProviderReady = function(dataProvider)
{
	if (this.m_isUiReady)
	{
		this.onDataProviderReady(dataProvider);
	}
};
oFF.DfOuDataProviderDocumentPlugin.prototype._setupEventManager = function(controller, dpName)
{
	this.m_dpEventManager = oFF.OuDataProviderPluginEventManager.create(controller, dpName);
	this.m_dpEventManager.setDataProviderReadyListener(this._fireOnDataProviderReady.bind(this));
	this.m_dpEventManager.setDataProviderReleasedListener(this.onDataProviderReleased.bind(this));
	this.m_dpEventManager.setDataProviderModelChangeListener((dp, evt1) => {
		this.onDataProviderModelChange(dp, evt1);
	});
	this.m_dpEventManager.setDataProviderVizChangeListener((vizName, evt2) => {
		this.onDataProviderVizChange(vizName, evt2);
	});
	this.m_dpEventManager.setDataProviderResultDataFetchListener((dp, evt3) => {
		this.onDataProviderResultDataFetch(dp, evt3);
	});
};
oFF.DfOuDataProviderDocumentPlugin.prototype.destroyPlugin = function()
{
	this.m_dpEventManager = oFF.XObjectExt.release(this.m_dpEventManager);
	oFF.HuDfDocumentPlugin.prototype.destroyPlugin.call( this );
};
oFF.DfOuDataProviderDocumentPlugin.prototype.getDataProvider = function()
{
	return this.m_dpEventManager.getDataProvider();
};
oFF.DfOuDataProviderDocumentPlugin.prototype.layoutDocument = function(documentController)
{
	this.layoutDataProviderBasedDocument(documentController);
	this.m_isUiReady = true;
	let dataProvider = this.getDataProvider();
	if (oFF.notNull(dataProvider))
	{
		this._fireOnDataProviderReady(dataProvider);
	}
};
oFF.DfOuDataProviderDocumentPlugin.prototype.setupPlugin = function(controller)
{
	oFF.HuDfDocumentPlugin.prototype.setupPlugin.call( this , controller);
	this._setupEventManager(controller, this.getConfiguration().getStringByKey(oFF.OuDataProviderConfiguration.CONFIG_DATA_PROVIDER_NAME));
	return null;
};

oFF.DfOuDialogProgram = function() {};
oFF.DfOuDialogProgram.prototype = new oFF.DfUiDialogProgram();
oFF.DfOuDialogProgram.prototype._ff_c = "DfOuDialogProgram";

oFF.DfOuDialogProgram.PARAM_QUERY_MANAGER_NAME = "queryManagerName";
oFF.DfOuDialogProgram.PRG_DATA_CANCEL_PROCEDURE = "cancelProcedure";
oFF.DfOuDialogProgram.PRG_DATA_OK_PROCEDURE = "okProcedure";
oFF.DfOuDialogProgram.PRG_DATA_QUERY_MANAGER = "queryManager";
oFF.DfOuDialogProgram.prototype.m_cancelProcedure = null;
oFF.DfOuDialogProgram.prototype.m_okProcedure = null;
oFF.DfOuDialogProgram.prototype.m_queryManager = null;
oFF.DfOuDialogProgram.prototype._doSetupDefaultProgramArguments = function(metadata)
{
	oFF.DfUiDialogProgram.prototype._doSetupDefaultProgramArguments.call( this , metadata);
	metadata.addParameter(oFF.DfOuDialogProgram.PARAM_QUERY_MANAGER_NAME, "The name of the query manager (String)");
};
oFF.DfOuDialogProgram.prototype._prepareDefaultArguments = function()
{
	oFF.DfUiDialogProgram.prototype._prepareDefaultArguments.call( this );
	let prgArgs = this.getArguments();
	if (this.getStartData() !== null)
	{
		this.m_queryManager = this.getStartData().getXObjectByKey(oFF.DfOuDialogProgram.PRG_DATA_QUERY_MANAGER);
		this.m_okProcedure = this.getStartData().getXObjectByKey(oFF.DfOuDialogProgram.PRG_DATA_OK_PROCEDURE);
		this.m_cancelProcedure = this.getStartData().getXObjectByKey(oFF.DfOuDialogProgram.PRG_DATA_CANCEL_PROCEDURE);
	}
	if (oFF.isNull(this.m_queryManager) && prgArgs.containsKey(oFF.DfOuDialogProgram.PARAM_QUERY_MANAGER_NAME))
	{
		let parentProcess = this.getProcess().getParentProcess();
		if (oFF.notNull(parentProcess))
		{
			let application = parentProcess.getApplication();
			if (oFF.notNull(application))
			{
				let olapEnv = application.getOlapEnvironment();
				if (oFF.notNull(olapEnv))
				{
					this.m_queryManager = olapEnv.getQueryManagerByName(prgArgs.getStringByKey(oFF.DfOuDialogProgram.PARAM_QUERY_MANAGER_NAME));
				}
			}
		}
	}
};
oFF.DfOuDialogProgram.prototype.assertQueryManagerSet = function()
{
	if (oFF.isNull(this.m_queryManager))
	{
		throw oFF.XException.createRuntimeException("Missing query manager!");
	}
};
oFF.DfOuDialogProgram.prototype.getQueryManager = function()
{
	return this.m_queryManager;
};
oFF.DfOuDialogProgram.prototype.notifyCancelPressed = function()
{
	if (oFF.notNull(this.m_cancelProcedure))
	{
		this.m_cancelProcedure.execute();
	}
};
oFF.DfOuDialogProgram.prototype.notifyOkPressed = function()
{
	if (oFF.notNull(this.m_okProcedure))
	{
		this.m_okProcedure.execute();
	}
};
oFF.DfOuDialogProgram.prototype.releaseObject = function()
{
	this.m_queryManager = null;
	this.m_okProcedure = null;
	this.m_cancelProcedure = null;
	oFF.DfUiDialogProgram.prototype.releaseObject.call( this );
};
oFF.DfOuDialogProgram.prototype.setQueryManager = function(queryManager)
{
	this.m_queryManager = queryManager;
};

oFF.FilterDialog = function() {};
oFF.FilterDialog.prototype = new oFF.DfOuDialogProgram();
oFF.FilterDialog.prototype._ff_c = "FilterDialog";

oFF.FilterDialog.ARG_DIMENSION_NAME = "dimensionName";
oFF.FilterDialog.ARG_HIDDEN_VALUES = "hiddenValues";
oFF.FilterDialog.ARG_LAYERED_FILTER_NAME = "layeredFilterName";
oFF.FilterDialog.ARG_MBF_MEMBER_NAME = "measureBasedFilterMemberName";
oFF.FilterDialog.ARG_OPEN_WITH_DYNAMIC_FILTER = "openWithDynamicFilter";
oFF.FilterDialog.ARG_OPEN_WITH_VARIABLE_FILTER = "openWithVariableFilter";
oFF.FilterDialog.ARG_SEARCH_VALUE = "searchValue";
oFF.FilterDialog.ARG_TITLE = "title";
oFF.FilterDialog.ARG_USAGE_TRACKING_CONSUMER = "usageTrackingConsumer";
oFF.FilterDialog.ARG_VARIABLE_NAME = "variableName";
oFF.FilterDialog.ARG_WORKSPACE = "workspace";
oFF.FilterDialog.DEFAULT_PROGRAM_NAME_DIMENSION = "FilterDialogDimension";
oFF.FilterDialog.DEFAULT_PROGRAM_NAME_HIERARCHY_CATALOG = "FilterDialogHierarchyCatalog";
oFF.FilterDialog.DEFAULT_PROGRAM_NAME_MEASURE_BASED_FILTER = "FilterDialogMeasureBasedFilter";
oFF.FilterDialog.DEFAULT_PROGRAM_NAME_USER_TEAM = "FilterDialogUserTeam";
oFF.FilterDialog.DEFAULT_PROGRAM_NAME_VARIABLE = "FilterDialogVariable";
oFF.FilterDialog.PARAM_ALWAYS_SHOW_SELECTION_CONTAINER = "alwaysShowSelectionContainer";
oFF.FilterDialog.PARAM_DEFAULT_VIEW_TYPE = "defaultViewType";
oFF.FilterDialog.PARAM_DIMENSION_DEFAULT_ATTRIBUTE_SELECTION = "dimensionDefaultAttributeSelection";
oFF.FilterDialog.PARAM_DIMENSION_TEXT_USAGE_TYPE = "dimensionTextUsageType";
oFF.FilterDialog.PARAM_DISPLAY_INFO = "displayInfo";
oFF.FilterDialog.PARAM_DISPLAY_PATTERN_RANGE = "displayPatternRange";
oFF.FilterDialog.PARAM_DISPLAY_PATTERN_VALUE = "displayPatternValue";
oFF.FilterDialog.PARAM_DYNAMIC_DATE_RANGE_MAX_YEARS = "dynamicDateRangeMaxYears";
oFF.FilterDialog.PARAM_EXCLUDE_BY_DEFAULT = "excludeByDefault";
oFF.FilterDialog.PARAM_HIDE_CUMULATED_MEASURES = "hideCumulatedMeasures";
oFF.FilterDialog.PARAM_HIERARCHY = "hierarchy";
oFF.FilterDialog.PARAM_LIST_CHILD_NODES_PAGE_SIZE = "childNodesPageSize";
oFF.FilterDialog.PARAM_LIST_PAGE_SIZE = "lisPageSize";
oFF.FilterDialog.PARAM_LIST_PRELOAD_PAGE_COUNT = "listPreloadPageCount";
oFF.FilterDialog.PARAM_OFFER_CLIPBOARD = "offerClipboard";
oFF.FilterDialog.PARAM_OFFER_DISPLAY_INFO_EXTENDED_SETTINGS = "offerDisplayInfoExtendedSettings";
oFF.FilterDialog.PARAM_OFFER_EQUAL_IN_RANGE_FILTER = "offerEqualInRangeFilter";
oFF.FilterDialog.PARAM_OFFER_EXCLUDE = "offerExclude";
oFF.FilterDialog.PARAM_OFFER_EXCLUDE_ADVANCED = "offerExcludeAdvanced";
oFF.FilterDialog.PARAM_OFFER_FUNCTIONAL_VALUES_VIEW = "offerFunctionalValuesView";
oFF.FilterDialog.PARAM_OFFER_HIERARCHY_CHANGE = "offerHierarchyChange";
oFF.FilterDialog.PARAM_OFFER_LIST_VIEW = "offerListView";
oFF.FilterDialog.PARAM_OFFER_NULL_IN_RANGE_FILTER = "offerNullInRangeFilter";
oFF.FilterDialog.PARAM_OFFER_RANGE_VIEW = "offerRangeView";
oFF.FilterDialog.PARAM_OFFER_READMODE_CHANGE = "offerReadModeChange";
oFF.FilterDialog.PARAM_OFFER_READMODE_EXTENDED_SETTINGS = "offerReadModeExtendedSettings";
oFF.FilterDialog.PARAM_READMODE = "readMode";
oFF.FilterDialog.PARAM_RESIZABLE = "resizeable";
oFF.FilterDialog.PARAM_SEARCH_SIZE = "searchSize";
oFF.FilterDialog.PARAM_SELECTION_MODE = "selectionMode";
oFF.FilterDialog.PARAM_SELECTION_REQUIRED = "selectionRequired";
oFF.FilterDialog.PARAM_SIMPLIFIED_SEARCH = "simplifiedSearch";
oFF.FilterDialog.PRG_DATA_DEFAULT_SELECTION = "defaultSelection";
oFF.FilterDialog.PRG_DATA_EXTERNAL_VALUEHELP_PROCESS = "externalValueHelpProcess";
oFF.FilterDialog.PRG_DATA_LISTENER_BEFORE_FILTER_CHANGE = "beforeFilterChangeListener";
oFF.FilterDialog.PRG_DATA_LISTENER_CLOSE = "closeListener";
oFF.FilterDialog.PRG_DATA_LISTENER_SELECTION_CHANGE = "listenerSelectionChange";
oFF.FilterDialog.PRG_DATA_MBF = "measureBasedFilter";
oFF.FilterDialog.PRG_DATA_VARIABLE = "variable";
oFF.FilterDialog.prototype.m_config = null;
oFF.FilterDialog.prototype.getConfig = function()
{
	return this.m_config;
};
oFF.FilterDialog.prototype.getDefaultContainerSize = function()
{
	if (this.getUiManager().getDeviceInfo().isMobile())
	{
		return oFF.UiSize.createMax();
	}
	return oFF.UiSize.createExt(oFF.UiCssLength.createExt(974, oFF.UiCssSizeUnit.PIXEL), oFF.UiCssLength.createExt(640, oFF.UiCssSizeUnit.PIXEL));
};
oFF.FilterDialog.prototype.getDimensionConfig = function()
{
	return this.getContentType() === oFF.FilterDialogContentType.DIMENSION ? this.m_config : null;
};
oFF.FilterDialog.prototype.getHierarchyCatalogConfig = function()
{
	return this.getContentType() === oFF.FilterDialogContentType.HIERARCHY_CATALOG ? this.m_config : null;
};
oFF.FilterDialog.prototype.getMeasureBasedFilterConfig = function()
{
	return this.getContentType() === oFF.FilterDialogContentType.MEASURE_BASED_FILTER ? this.m_config : null;
};
oFF.FilterDialog.prototype.getUserTeamFilterConfig = function()
{
	return this.getContentType() === oFF.FilterDialogContentType.USER_TEAM ? this.m_config : null;
};
oFF.FilterDialog.prototype.getVariableConfig = function()
{
	return this.getContentType() === oFF.FilterDialogContentType.VARIABLE ? this.m_config : null;
};
oFF.FilterDialog.prototype.isResizeAllowed = function()
{
	return oFF.notNull(this.m_config) && this.m_config.isResizeable();
};
oFF.FilterDialog.prototype.prepareProgramMetadata = function(metadata)
{
	metadata.addParameter(oFF.FilterDialog.ARG_VARIABLE_NAME, "The name of the variable to open the dialog for (String)");
	metadata.addParameter(oFF.FilterDialog.ARG_DIMENSION_NAME, "The name of the dimension to open the dialog for (String)");
	metadata.addParameter(oFF.FilterDialog.ARG_MBF_MEMBER_NAME, "The name of the structure/dimension member to open the measure based filter dialog for (String)");
	metadata.addParameter(oFF.FilterDialog.ARG_USAGE_TRACKING_CONSUMER, "The consumer of the filter dialog, used for usage tracking (String)");
	metadata.addParameter(oFF.FilterDialog.ARG_OPEN_WITH_DYNAMIC_FILTER, "Whether the dialog should parse and update the dynamic filter (Boolean)");
	metadata.addParameter(oFF.FilterDialog.ARG_OPEN_WITH_VARIABLE_FILTER, "Whether the dialog should parse and update the variable filter (Boolean)");
	metadata.addParameter(oFF.FilterDialog.ARG_LAYERED_FILTER_NAME, "The name of a specific layered filter which should be parsed and updated by the dialog (String)");
	metadata.addParameter(oFF.FilterDialog.ARG_TITLE, "The title shown in the dialog header (String)");
	metadata.addParameter(oFF.FilterDialog.PARAM_SELECTION_MODE, "The name of the dialog UI table selection mode (String)");
	metadata.addParameter(oFF.FilterDialog.PARAM_SELECTION_REQUIRED, "Whether a selection is required (Boolean)");
	metadata.addParameter(oFF.FilterDialog.PARAM_RESIZABLE, "Whether the dialog should be resizeable (Boolean)");
	metadata.addParameter(oFF.FilterDialog.PARAM_ALWAYS_SHOW_SELECTION_CONTAINER, "Whether the selection list should always be visible in the dialog (Boolean)");
	metadata.addParameter(oFF.FilterDialog.PARAM_DISPLAY_PATTERN_VALUE, "A pattern for showing ID and Description of a value (String)");
	metadata.addParameter(oFF.FilterDialog.PARAM_DISPLAY_PATTERN_RANGE, "A pattern for showing a range with 2 values (String)");
	metadata.addParameter(oFF.FilterDialog.PARAM_OFFER_EXCLUDE, "Whether an exclude toggle should be available (Boolean)");
	metadata.addParameter(oFF.FilterDialog.PARAM_OFFER_EXCLUDE_ADVANCED, "Whether the possibility of adding included and excluded values to the selection should be available (Boolean)");
	metadata.addParameter(oFF.FilterDialog.PARAM_EXCLUDE_BY_DEFAULT, "Whether the exclude toggle should be activated by default. Only if offerExclude is on and no default selection is given. (Boolean)");
	metadata.addParameter(oFF.FilterDialog.PARAM_OFFER_LIST_VIEW, "Whether a list of members should be available for selection (Boolean)");
	metadata.addParameter(oFF.FilterDialog.PARAM_OFFER_RANGE_VIEW, "Whether it should be possible to view and define range values (Boolean)");
	metadata.addParameter(oFF.FilterDialog.PARAM_OFFER_FUNCTIONAL_VALUES_VIEW, "Whether functional values should be available for selection (Boolean)");
	metadata.addParameter(oFF.FilterDialog.PARAM_DEFAULT_VIEW_TYPE, "The default view to be shown if several views are offered (String)");
	metadata.addParameter(oFF.FilterDialog.PARAM_LIST_PAGE_SIZE, "The page size in a list view (Integer)");
	metadata.addParameter(oFF.FilterDialog.PARAM_LIST_PRELOAD_PAGE_COUNT, "The pages preloaded in a list view (Integer)");
	metadata.addParameter(oFF.FilterDialog.PARAM_LIST_CHILD_NODES_PAGE_SIZE, "The page size of children in a tree (Integer)");
	metadata.addParameter(oFF.FilterDialog.PARAM_DISPLAY_INFO, "The display info in a list, e.g. id or description (String)");
	metadata.addParameter(oFF.FilterDialog.PARAM_OFFER_DISPLAY_INFO_EXTENDED_SETTINGS, "Whether all available display info possibilities should be shown, e.g. 'Decription and ID' (Boolean)");
	metadata.addParameter(oFF.FilterDialog.PARAM_DIMENSION_TEXT_USAGE_TYPE, "The dimension text usage type to switch between resultset and dimension default text field (String)");
	metadata.addParameter(oFF.FilterDialog.PARAM_DIMENSION_DEFAULT_ATTRIBUTE_SELECTION, "The names of the dimension attributes selected by default as comma separated list (String)");
	metadata.addParameter(oFF.FilterDialog.PARAM_OFFER_CLIPBOARD, "Whether a clipboard for copy paste functionality should be available (Boolean)");
	metadata.addParameter(oFF.FilterDialog.PARAM_OFFER_HIERARCHY_CHANGE, "Whether changing the hierarchy should be available (Boolean)");
	metadata.addParameter(oFF.FilterDialog.PARAM_OFFER_READMODE_CHANGE, "Whether changing the readmode should be possible. Will automatically be possible if no readMode parameter is provided (Boolean)");
	metadata.addParameter(oFF.FilterDialog.PARAM_OFFER_READMODE_EXTENDED_SETTINGS, "Whether additional readmodes like BOOKED_AND_SPACE_AND_STATE should be available for selection (Boolean)");
	metadata.addParameter(oFF.FilterDialog.PARAM_READMODE, "The name of the initial used readmode of type OlapUiReadMode (String)");
	metadata.addParameter(oFF.FilterDialog.PARAM_HIERARCHY, "The name of the hierarchy used by default or empty string if flat presentation should be used (String)");
	metadata.addParameter(oFF.FilterDialog.PARAM_HIDE_CUMULATED_MEASURES, "Whether cumulated and calculation measures should be hidden (Boolean)");
	metadata.addParameter(oFF.FilterDialog.PARAM_SIMPLIFIED_SEARCH, "Whether the search should not offer any attributes but always just search on key and text (Boolean)");
	metadata.addParameter(oFF.FilterDialog.PARAM_SEARCH_SIZE, "The amount of values searched in a list view (Integer)");
	metadata.addParameter(oFF.FilterDialog.ARG_SEARCH_VALUE, "The default value for a search, executed at dialog startup (String)");
	metadata.addParameter(oFF.FilterDialog.PARAM_OFFER_EQUAL_IN_RANGE_FILTER, "Whether comparison operator EQUAL should be available in range view (Boolean)");
	metadata.addParameter(oFF.FilterDialog.PARAM_OFFER_NULL_IN_RANGE_FILTER, "Whether comparison operator IS_NULL should be available in range view (Boolean)");
	metadata.addParameter(oFF.FilterDialog.PARAM_DYNAMIC_DATE_RANGE_MAX_YEARS, "The max amount of years for look back and ahead in dynamic date ranges (Integer)");
	metadata.addParameter(oFF.FilterDialog.ARG_WORKSPACE, "The workspace Id (String)");
	metadata.addParameter(oFF.FilterDialog.ARG_HIDDEN_VALUES, "A comma separated list of values being hidden in the filter dialog (String)");
};
oFF.FilterDialog.prototype.processArguments = function(args) {};
oFF.FilterDialog.prototype.processConfiguration = function(configuration)
{
	let args = oFF.FilterDialogConfig.getArgs(this.getArguments(), configuration);
	this.m_config = oFF.FilterDialogConfig.create(args, this.getStartData(), this.getQueryManager(), this.getContentType());
	if (!this.m_config.isValid())
	{
		this.kill();
		throw oFF.XException.createIllegalArgumentException("Invalid filter dialog configuration!");
	}
};
oFF.FilterDialog.prototype.releaseObject = function()
{
	oFF.DfOuDialogProgram.prototype.releaseObject.call( this );
	this.m_config = oFF.XObjectExt.release(this.m_config);
};
oFF.FilterDialog.prototype.setupProgram = function()
{
	return null;
};

oFF.OlapUiApiModule = function() {};
oFF.OlapUiApiModule.prototype = new oFF.DfModule();
oFF.OlapUiApiModule.prototype._ff_c = "OlapUiApiModule";

oFF.OlapUiApiModule.s_module = null;
oFF.OlapUiApiModule.getInstance = function()
{
	if (oFF.isNull(oFF.OlapUiApiModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.UiModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.UiProgramModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.HorizonUiApiModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.OlapDataProviderModule.getInstance());
		oFF.OlapUiApiModule.s_module = oFF.DfModule.startExt(new oFF.OlapUiApiModule());
		oFF.FilterDialogValueType.staticSetup();
		oFF.FilterDialogContentType.staticSetup();
		oFF.OuAnalyticalWidgetType.staticSetup();
		oFF.HuPluginRegistry.registerPluginByClass(oFF.XClass.create(oFF.OuDataProviderCommandPlugin));
		oFF.OuDataProviderActionCollectionRegistry.registerCollectionByClass(oFF.XClass.create(oFF.OuDataProviderOlapUiApiActionsCollection));
		oFF.DfModule.stopExt(oFF.OlapUiApiModule.s_module);
	}
	return oFF.OlapUiApiModule.s_module;
};
oFF.OlapUiApiModule.prototype.getName = function()
{
	return "ff8005.olap.ui.api";
};

oFF.OlapUiApiModule.getInstance();

return oFF;
} );