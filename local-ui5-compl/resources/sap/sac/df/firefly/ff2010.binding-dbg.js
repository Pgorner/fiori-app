/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff1040.kernel.native"
],
function(oFF)
{
"use strict";

oFF.DataManifestConstants = {

};

oFF.DpBindingFactory = function() {};
oFF.DpBindingFactory.prototype = new oFF.XObject();
oFF.DpBindingFactory.prototype._ff_c = "DpBindingFactory";

oFF.DpBindingFactory.s_factories = null;
oFF.DpBindingFactory.createBindingProvider = function(component, path)
{
	let factory = null;
	let componentType = component.getComponentType();
	while (oFF.notNull(componentType))
	{
		let name = componentType.getName();
		factory = oFF.DpBindingFactory.s_factories.getByKey(name);
		if (oFF.notNull(factory))
		{
			break;
		}
		componentType = componentType.getParent();
	}
	let bindingProvider = null;
	if (oFF.notNull(factory))
	{
		bindingProvider = factory.newBindingProvider(component, path);
	}
	return bindingProvider;
};
oFF.DpBindingFactory.registerFactory = function(componentType, factory)
{
	oFF.DpBindingFactory.s_factories.put(componentType.getName(), factory);
};
oFF.DpBindingFactory.staticSetup = function()
{
	oFF.DpBindingFactory.s_factories = oFF.XHashMapByString.create();
};

oFF.DpDataManifestFactory = {

	ERROR_TEXT:"ErrorText",
	HAS_ERROR:"HasError",
	create:function(errorText)
	{
			let dataManifest = oFF.PrFactory.createStructure();
		dataManifest.putBoolean(oFF.DpDataManifestFactory.HAS_ERROR, true);
		dataManifest.putString(oFF.DpDataManifestFactory.ERROR_TEXT, errorText);
		return dataManifest;
	},
	createByMessages:function(messages)
	{
			let dataManifest = oFF.PrFactory.createStructure();
		if (oFF.notNull(messages) && messages.hasErrors())
		{
			dataManifest.putBoolean(oFF.DpDataManifestFactory.HAS_ERROR, true);
			dataManifest.putString(oFF.DpDataManifestFactory.ERROR_TEXT, messages.getSummary());
		}
		return dataManifest;
	}
};

oFF.DpBindingStringFactory = function() {};
oFF.DpBindingStringFactory.prototype = new oFF.DpBindingFactory();
oFF.DpBindingStringFactory.prototype._ff_c = "DpBindingStringFactory";

oFF.DpBindingStringFactory.staticSetupStringBindingFactory = function()
{
	oFF.DpBindingFactory.registerFactory(oFF.XValueType.STRING, new oFF.DpBindingStringFactory());
};
oFF.DpBindingStringFactory.prototype.newBindingProvider = function(component, path)
{
	let dp = component;
	return oFF.DpBindingStringProvider.create(dp, path);
};

oFF.DpBindingStringProvider = function() {};
oFF.DpBindingStringProvider.prototype = new oFF.XObject();
oFF.DpBindingStringProvider.prototype._ff_c = "DpBindingStringProvider";

oFF.DpBindingStringProvider.create = function(dp, path)
{
	let newObject = new oFF.DpBindingStringProvider();
	newObject.m_dp = dp;
	newObject.m_path = path;
	return newObject;
};
oFF.DpBindingStringProvider.prototype.m_dp = null;
oFF.DpBindingStringProvider.prototype.m_path = null;
oFF.DpBindingStringProvider.prototype.getReceiverBindings = function()
{
	let list = oFF.XList.create();
	list.add(oFF.SemanticBindingType.STRING);
	list.add(oFF.SemanticBindingType.INTEGER);
	return list;
};
oFF.DpBindingStringProvider.prototype.getReceiverProtocolBindings = function(type)
{
	let list = oFF.XList.create();
	list.add(oFF.ProtocolBindingType.STRING);
	list.add(oFF.ProtocolBindingType.INTEGER);
	return list;
};
oFF.DpBindingStringProvider.prototype.getSenderBindings = function()
{
	let list = oFF.XList.create();
	list.add(oFF.SemanticBindingType.STRING);
	list.add(oFF.SemanticBindingType.INTEGER);
	return list;
};
oFF.DpBindingStringProvider.prototype.getSenderProtocolBindings = function(type)
{
	let list = oFF.XList.create();
	list.add(oFF.ProtocolBindingType.STRING);
	list.add(oFF.ProtocolBindingType.INTEGER);
	return list;
};
oFF.DpBindingStringProvider.prototype.newReceiverBinding = function(type, protocol)
{
	return oFF.DpBindingStringReceiver.create(this.m_dp, this.m_path);
};
oFF.DpBindingStringProvider.prototype.newSenderBinding = function(type, protocol)
{
	return oFF.DpBindingStringSender.create(this.m_dp, this.m_path);
};

oFF.DpBindingStringReceiver = function() {};
oFF.DpBindingStringReceiver.prototype = new oFF.XObject();
oFF.DpBindingStringReceiver.prototype._ff_c = "DpBindingStringReceiver";

oFF.DpBindingStringReceiver.create = function(dp, path)
{
	let receiver = new oFF.DpBindingStringReceiver();
	receiver.m_dp = dp;
	receiver.m_path = path;
	return receiver;
};
oFF.DpBindingStringReceiver.prototype.m_dp = null;
oFF.DpBindingStringReceiver.prototype.m_path = null;
oFF.DpBindingStringReceiver.prototype.getComponentType = function()
{
	return oFF.IoComponentType.BINDING_RECEIVER;
};
oFF.DpBindingStringReceiver.prototype.getInteger = function()
{
	return oFF.XInteger.convertFromString(this.getString());
};
oFF.DpBindingStringReceiver.prototype.getString = function()
{
	return this.m_dp.getString();
};
oFF.DpBindingStringReceiver.prototype.isReceiverReady = function()
{
	return true;
};
oFF.DpBindingStringReceiver.prototype.registerReceiverReadyListener = function(listener, customIdentifier) {};
oFF.DpBindingStringReceiver.prototype.setDataManifest = function(dataManifest) {};
oFF.DpBindingStringReceiver.prototype.setInteger = function(value)
{
	this.m_dp.setString(oFF.XInteger.convertToString(value));
};
oFF.DpBindingStringReceiver.prototype.setString = function(value)
{
	this.m_dp.setString(value);
};
oFF.DpBindingStringReceiver.prototype.unregisterReceiverReadyListener = function(listener) {};

oFF.DpBindingStringSender = function() {};
oFF.DpBindingStringSender.prototype = new oFF.XObject();
oFF.DpBindingStringSender.prototype._ff_c = "DpBindingStringSender";

oFF.DpBindingStringSender.create = function(dp, path)
{
	let sender = new oFF.DpBindingStringSender();
	sender.m_dp = dp;
	sender.m_path = path;
	return sender;
};
oFF.DpBindingStringSender.prototype.m_dp = null;
oFF.DpBindingStringSender.prototype.m_path = null;
oFF.DpBindingStringSender.prototype.getComponentType = function()
{
	return oFF.IoComponentType.BINDING_SENDER;
};
oFF.DpBindingStringSender.prototype.getDataManifest = function()
{
	return null;
};
oFF.DpBindingStringSender.prototype.getInteger = function()
{
	return oFF.XInteger.convertFromString(this.getString());
};
oFF.DpBindingStringSender.prototype.getString = function()
{
	return this.m_dp.getString();
};
oFF.DpBindingStringSender.prototype.isSenderValueReady = function()
{
	return true;
};
oFF.DpBindingStringSender.prototype.processSenderUpdate = function() {};
oFF.DpBindingStringSender.prototype.registerValueChangedListener = function(listener, customIdentifier) {};
oFF.DpBindingStringSender.prototype.unregisterValueChangedListener = function(listener) {};

oFF.DpSelection = function() {};
oFF.DpSelection.prototype = new oFF.XObjectExt();
oFF.DpSelection.prototype._ff_c = "DpSelection";

oFF.DpSelection.create = function(list)
{
	let newObj = new oFF.DpSelection();
	newObj.m_list = list;
	return newObj;
};
oFF.DpSelection.prototype.m_list = null;
oFF.DpSelection.prototype.contains = function(element)
{
	return this.m_list.contains(element);
};
oFF.DpSelection.prototype.createListCopy = function()
{
	return this.m_list.createListCopy();
};
oFF.DpSelection.prototype.get = function(index)
{
	return this.m_list.get(index);
};
oFF.DpSelection.prototype.getComponentType = function()
{
	return oFF.KernelComponentType.SIGSEL_RESULT_LIST;
};
oFF.DpSelection.prototype.getIndex = function(element)
{
	return this.m_list.getIndex(element);
};
oFF.DpSelection.prototype.getIterator = function()
{
	return this.m_list.getIterator();
};
oFF.DpSelection.prototype.getValuesAsReadOnlyList = function()
{
	return this.m_list;
};
oFF.DpSelection.prototype.hasElements = function()
{
	return this.m_list.hasElements();
};
oFF.DpSelection.prototype.isEmpty = function()
{
	return this.m_list.isEmpty();
};
oFF.DpSelection.prototype.size = function()
{
	return this.m_list.size();
};

oFF.ProtocolBindingType = function() {};
oFF.ProtocolBindingType.prototype = new oFF.XConstantWithParent();
oFF.ProtocolBindingType.prototype._ff_c = "ProtocolBindingType";

oFF.ProtocolBindingType.ABSTRACT_CHART_PROTOCOL = null;
oFF.ProtocolBindingType.CUSTOM = null;
oFF.ProtocolBindingType.GOOGLE_CHART_PROTOCOL = null;
oFF.ProtocolBindingType.HIGH_CHART_PROTOCOL = null;
oFF.ProtocolBindingType.INTEGER = null;
oFF.ProtocolBindingType.JSON = null;
oFF.ProtocolBindingType.MICRO_CHART_PROTOCOL = null;
oFF.ProtocolBindingType.PLAIN_GRID = null;
oFF.ProtocolBindingType.SAC_TABLE_GRID = null;
oFF.ProtocolBindingType.SAP_KPI_PROTOCOL = null;
oFF.ProtocolBindingType.STRING = null;
oFF.ProtocolBindingType.VAL_CHART_PROTOCOL = null;
oFF.ProtocolBindingType.VIZ_FRAME_PROTOCOL = null;
oFF.ProtocolBindingType.VIZ_INSTANCE_PROTOCOL = null;
oFF.ProtocolBindingType.s_instances = null;
oFF.ProtocolBindingType.create = function(name, parent)
{
	let newConstant = new oFF.ProtocolBindingType();
	newConstant.setupExt(name, parent);
	oFF.ProtocolBindingType.s_instances.put(name, newConstant);
	return newConstant;
};
oFF.ProtocolBindingType.createCustomProtocolBindingType = function(name)
{
	let parent = oFF.ProtocolBindingType.CUSTOM;
	let existing = oFF.ProtocolBindingType.lookup(name);
	if (oFF.notNull(existing))
	{
		throw oFF.XException.createRuntimeException("Custom protocol binding type with the same name but different parent type is already existing");
	}
	return oFF.ProtocolBindingType.create(name, parent);
};
oFF.ProtocolBindingType.getAll = function()
{
	return oFF.ProtocolBindingType.s_instances.getValuesAsReadOnlyList();
};
oFF.ProtocolBindingType.lookup = function(name)
{
	return oFF.ProtocolBindingType.s_instances.getByKey(name);
};
oFF.ProtocolBindingType.staticSetup = function()
{
	oFF.ProtocolBindingType.s_instances = oFF.XHashMapByString.create();
	oFF.ProtocolBindingType.STRING = oFF.ProtocolBindingType.create("String", null);
	oFF.ProtocolBindingType.INTEGER = oFF.ProtocolBindingType.create("Integer", null);
	oFF.ProtocolBindingType.JSON = oFF.ProtocolBindingType.create("Json", null);
	oFF.ProtocolBindingType.ABSTRACT_CHART_PROTOCOL = oFF.ProtocolBindingType.create("Chart", oFF.ProtocolBindingType.JSON);
	oFF.ProtocolBindingType.HIGH_CHART_PROTOCOL = oFF.ProtocolBindingType.create("HighChart", oFF.ProtocolBindingType.ABSTRACT_CHART_PROTOCOL);
	oFF.ProtocolBindingType.GOOGLE_CHART_PROTOCOL = oFF.ProtocolBindingType.create("GoogleChart", oFF.ProtocolBindingType.ABSTRACT_CHART_PROTOCOL);
	oFF.ProtocolBindingType.VIZ_FRAME_PROTOCOL = oFF.ProtocolBindingType.create("VizFrame", oFF.ProtocolBindingType.ABSTRACT_CHART_PROTOCOL);
	oFF.ProtocolBindingType.MICRO_CHART_PROTOCOL = oFF.ProtocolBindingType.create("MicroChart", oFF.ProtocolBindingType.ABSTRACT_CHART_PROTOCOL);
	oFF.ProtocolBindingType.VAL_CHART_PROTOCOL = oFF.ProtocolBindingType.create("ValChart", oFF.ProtocolBindingType.ABSTRACT_CHART_PROTOCOL);
	oFF.ProtocolBindingType.VIZ_INSTANCE_PROTOCOL = oFF.ProtocolBindingType.create("VizInstance", oFF.ProtocolBindingType.ABSTRACT_CHART_PROTOCOL);
	oFF.ProtocolBindingType.SAP_KPI_PROTOCOL = oFF.ProtocolBindingType.create("SapKpiProtocol", oFF.ProtocolBindingType.JSON);
	oFF.ProtocolBindingType.PLAIN_GRID = oFF.ProtocolBindingType.create("PlainGrid", oFF.ProtocolBindingType.JSON);
	oFF.ProtocolBindingType.SAC_TABLE_GRID = oFF.ProtocolBindingType.create("SacTableGrid", oFF.ProtocolBindingType.JSON);
	oFF.ProtocolBindingType.CUSTOM = oFF.ProtocolBindingType.create("Custom", oFF.ProtocolBindingType.JSON);
};

oFF.SemanticBindingType = function() {};
oFF.SemanticBindingType.prototype = new oFF.XConstantWithParent();
oFF.SemanticBindingType.prototype._ff_c = "SemanticBindingType";

oFF.SemanticBindingType.AREA = null;
oFF.SemanticBindingType.BAR = null;
oFF.SemanticBindingType.BELLCURVE = null;
oFF.SemanticBindingType.BOXPLOT = null;
oFF.SemanticBindingType.BUBBLE = null;
oFF.SemanticBindingType.CHART = null;
oFF.SemanticBindingType.COLUMN = null;
oFF.SemanticBindingType.COMBBCL = null;
oFF.SemanticBindingType.CUSTOM = null;
oFF.SemanticBindingType.GRID = null;
oFF.SemanticBindingType.HEATMAP = null;
oFF.SemanticBindingType.INTEGER = null;
oFF.SemanticBindingType.JSON = null;
oFF.SemanticBindingType.KPI = null;
oFF.SemanticBindingType.LINE = null;
oFF.SemanticBindingType.MULTI = null;
oFF.SemanticBindingType.PIE = null;
oFF.SemanticBindingType.SCATTER = null;
oFF.SemanticBindingType.SINGLE = null;
oFF.SemanticBindingType.SPLINE = null;
oFF.SemanticBindingType.STRING = null;
oFF.SemanticBindingType.TABLE = null;
oFF.SemanticBindingType.TIMESERIES = null;
oFF.SemanticBindingType.TREEMAP = null;
oFF.SemanticBindingType.VARIABLEPIE = null;
oFF.SemanticBindingType.VARIWIDE = null;
oFF.SemanticBindingType.WORDCLOUD = null;
oFF.SemanticBindingType.s_instances = null;
oFF.SemanticBindingType.create = function(name, parent, protocol)
{
	let newConstant = new oFF.SemanticBindingType();
	newConstant.setupExt(name, parent);
	newConstant.m_defaultProtocol = protocol;
	oFF.SemanticBindingType.s_instances.put(name, newConstant);
	return newConstant;
};
oFF.SemanticBindingType.lookup = function(name)
{
	return oFF.SemanticBindingType.s_instances.getByKey(name);
};
oFF.SemanticBindingType.staticSetup = function()
{
	oFF.SemanticBindingType.s_instances = oFF.XHashMapByString.create();
	oFF.SemanticBindingType.STRING = oFF.SemanticBindingType.create("String", null, oFF.ProtocolBindingType.STRING);
	oFF.SemanticBindingType.INTEGER = oFF.SemanticBindingType.create("Integer", null, oFF.ProtocolBindingType.INTEGER);
	oFF.SemanticBindingType.JSON = oFF.SemanticBindingType.create("Json", null, oFF.ProtocolBindingType.JSON);
	oFF.SemanticBindingType.SINGLE = oFF.SemanticBindingType.create("Single", oFF.SemanticBindingType.JSON, null);
	oFF.SemanticBindingType.MULTI = oFF.SemanticBindingType.create("Multi", oFF.SemanticBindingType.JSON, null);
	oFF.SemanticBindingType.TABLE = oFF.SemanticBindingType.create("Table", oFF.SemanticBindingType.SINGLE, null);
	oFF.SemanticBindingType.GRID = oFF.SemanticBindingType.create("Grid", oFF.SemanticBindingType.SINGLE, null);
	oFF.SemanticBindingType.CHART = oFF.SemanticBindingType.create("Chart", oFF.SemanticBindingType.SINGLE, oFF.ProtocolBindingType.HIGH_CHART_PROTOCOL);
	oFF.SemanticBindingType.COMBBCL = oFF.SemanticBindingType.create("Combbcl", oFF.SemanticBindingType.CHART, null);
	oFF.SemanticBindingType.TIMESERIES = oFF.SemanticBindingType.create("Timeseries", oFF.SemanticBindingType.CHART, null);
	oFF.SemanticBindingType.COLUMN = oFF.SemanticBindingType.create("Column", oFF.SemanticBindingType.CHART, null);
	oFF.SemanticBindingType.BAR = oFF.SemanticBindingType.create("Bar", oFF.SemanticBindingType.CHART, null);
	oFF.SemanticBindingType.LINE = oFF.SemanticBindingType.create("Line", oFF.SemanticBindingType.CHART, null);
	oFF.SemanticBindingType.PIE = oFF.SemanticBindingType.create("Pie", oFF.SemanticBindingType.CHART, null);
	oFF.SemanticBindingType.WORDCLOUD = oFF.SemanticBindingType.create("WordCloud", oFF.SemanticBindingType.CHART, null);
	oFF.SemanticBindingType.BELLCURVE = oFF.SemanticBindingType.create("BellCurve", oFF.SemanticBindingType.CHART, null);
	oFF.SemanticBindingType.AREA = oFF.SemanticBindingType.create("Area", oFF.SemanticBindingType.CHART, null);
	oFF.SemanticBindingType.SCATTER = oFF.SemanticBindingType.create("Scatter", oFF.SemanticBindingType.CHART, null);
	oFF.SemanticBindingType.SPLINE = oFF.SemanticBindingType.create("Spline", oFF.SemanticBindingType.CHART, null);
	oFF.SemanticBindingType.VARIABLEPIE = oFF.SemanticBindingType.create("VariablePie", oFF.SemanticBindingType.CHART, null);
	oFF.SemanticBindingType.VARIWIDE = oFF.SemanticBindingType.create("Variwide", oFF.SemanticBindingType.CHART, null);
	oFF.SemanticBindingType.BOXPLOT = oFF.SemanticBindingType.create("BoxPlot", oFF.SemanticBindingType.CHART, null);
	oFF.SemanticBindingType.BUBBLE = oFF.SemanticBindingType.create("Bubble", oFF.SemanticBindingType.CHART, null);
	oFF.SemanticBindingType.HEATMAP = oFF.SemanticBindingType.create("Heatmap", oFF.SemanticBindingType.CHART, null);
	oFF.SemanticBindingType.TREEMAP = oFF.SemanticBindingType.create("Treemap", oFF.SemanticBindingType.CHART, null);
	oFF.SemanticBindingType.KPI = oFF.SemanticBindingType.create("Kpi", oFF.SemanticBindingType.SINGLE, oFF.ProtocolBindingType.SAP_KPI_PROTOCOL);
	oFF.SemanticBindingType.CUSTOM = oFF.SemanticBindingType.create("Custom", oFF.SemanticBindingType.SINGLE, null);
};
oFF.SemanticBindingType.prototype.m_defaultProtocol = null;
oFF.SemanticBindingType.prototype.getDefaultProtocol = function()
{
	if (oFF.notNull(this.m_defaultProtocol))
	{
		return this.m_defaultProtocol;
	}
	let theParent = this.getParent();
	if (oFF.isNull(theParent))
	{
		return null;
	}
	return theParent.getDefaultProtocol();
};

oFF.DpBinding = function() {};
oFF.DpBinding.prototype = new oFF.DfProcessContext();
oFF.DpBinding.prototype._ff_c = "DpBinding";

oFF.DpBinding.prototype.m_cacheDataManifest = null;
oFF.DpBinding.prototype.m_cacheId = null;
oFF.DpBinding.prototype.m_dataBinding = null;
oFF.DpBinding.prototype.m_dataError = null;
oFF.DpBinding.prototype.m_protocolBinding = null;
oFF.DpBinding.prototype.m_pullOnReceiverReady = false;
oFF.DpBinding.prototype.m_receiver = null;
oFF.DpBinding.prototype.m_sender = null;
oFF.DpBinding.prototype.bind = function(sender, receiver, pullOnReceiverReady)
{
	this.m_sender = sender;
	this.m_receiver = receiver;
	this.m_pullOnReceiverReady = pullOnReceiverReady;
	if (oFF.notNull(this.m_sender))
	{
		this.m_sender.registerValueChangedListener(this, null);
	}
	if (oFF.notNull(this.m_receiver) && pullOnReceiverReady)
	{
		this.m_receiver.registerReceiverReadyListener(this, null);
	}
	this.transport();
};
oFF.DpBinding.prototype.getCacheId = function()
{
	return this.m_cacheId;
};
oFF.DpBinding.prototype.getReceiver = function()
{
	return this.m_receiver;
};
oFF.DpBinding.prototype.getSender = function()
{
	return this.m_sender;
};
oFF.DpBinding.prototype.onReceiverReadyChanged = function(receiver, customIdentifier)
{
	this.transport();
};
oFF.DpBinding.prototype.onSenderValueChanged = function(sender, customIdentifier)
{
	this.transport();
};
oFF.DpBinding.prototype.releaseObject = function()
{
	if (oFF.notNull(this.m_sender))
	{
		this.m_sender.unregisterValueChangedListener(this);
	}
	if (oFF.notNull(this.m_receiver))
	{
		this.m_receiver.unregisterReceiverReadyListener(this);
	}
	this.m_sender = oFF.XObjectExt.release(this.m_sender);
	this.m_receiver = oFF.XObjectExt.release(this.m_receiver);
	oFF.DfProcessContext.prototype.releaseObject.call( this );
};
oFF.DpBinding.prototype.setCacheId = function(cacheId)
{
	this.m_cacheId = cacheId;
};
oFF.DpBinding.prototype.setupExt = function(process, dataBinding, protocolBinding)
{
	this.setupProcessContext(process);
	this.m_dataBinding = dataBinding;
	this.m_protocolBinding = protocolBinding;
};
oFF.DpBinding.prototype.transferDataManifest = function()
{
	if (oFF.notNull(this.m_sender))
	{
		let dataManifest = null;
		if (oFF.notNull(this.m_dataError))
		{
			dataManifest = oFF.DpDataManifestFactory.create(this.m_dataError);
		}
		else
		{
			try
			{
				dataManifest = this.m_sender.getDataManifest();
			}
			catch (e)
			{
				this.m_dataError = oFF.XException.getStackTrace(e, 0);
				this.log(this.m_dataError);
			}
		}
		if (oFF.notNull(this.m_receiver))
		{
			if (oFF.notNull(dataManifest))
			{
				try
				{
					this.m_receiver.setDataManifest(dataManifest);
				}
				catch (f)
				{
					this.log(oFF.XException.getStackTrace(f, 0));
				}
			}
		}
		this.m_dataError = null;
	}
};
oFF.DpBinding.prototype.transferDataManifestFromCache = function()
{
	if (oFF.notNull(this.m_sender))
	{
		if (oFF.notNull(this.m_receiver))
		{
			if (oFF.notNull(this.m_cacheDataManifest))
			{
				try
				{
					this.m_receiver.setDataManifest(this.m_cacheDataManifest);
				}
				catch (f)
				{
					this.log(oFF.XException.getStackTrace(f, 0));
				}
			}
		}
		this.m_dataError = null;
		this.m_cacheDataManifest = null;
	}
};
oFF.DpBinding.prototype.transport = function()
{
	if (oFF.notNull(this.m_sender) && oFF.notNull(this.m_receiver))
	{
		if (this.m_pullOnReceiverReady === false || this.m_receiver.isReceiverReady())
		{
			if (this.m_sender.isSenderValueReady() === false)
			{
				this.m_sender.processSenderUpdate();
				let isReady = this.m_sender.isSenderValueReady();
				if (isReady === false)
				{
					this.transportDataFromCache();
					this.transferDataManifestFromCache();
				}
			}
			else
			{
				this.transportData();
				this.transferDataManifest();
			}
		}
	}
};
oFF.DpBinding.prototype.transportDataFromCache = function() {};

oFF.DpBindingManager = function() {};
oFF.DpBindingManager.prototype = new oFF.DfProcessContext();
oFF.DpBindingManager.prototype._ff_c = "DpBindingManager";

oFF.DpBindingManager.create = function(process)
{
	let newObj = new oFF.DpBindingManager();
	newObj.setupProcessContext(process);
	return newObj;
};
oFF.DpBindingManager.doBinding = function(process, senderType, receiverType, protocolBinding, senderProvider, receiverProvider, cacheIdentifier, pullOnReceiverReady)
{
	let binding = null;
	let theProtocolBinding = protocolBinding;
	if (oFF.isNull(theProtocolBinding))
	{
		theProtocolBinding = receiverType.getDefaultProtocol();
	}
	let sender = senderProvider.newSenderBinding(senderType, theProtocolBinding);
	let receiver = receiverProvider.newReceiverBinding(receiverType, theProtocolBinding);
	if (oFF.notNull(sender) && oFF.notNull(receiver))
	{
		if (theProtocolBinding.isTypeOf(oFF.ProtocolBindingType.JSON))
		{
			binding = oFF.DpBindingJson.create(process, receiverType, theProtocolBinding, true);
		}
		else if (theProtocolBinding.isTypeOf(oFF.ProtocolBindingType.STRING))
		{
			binding = oFF.DpBindingString.create(process, receiverType, theProtocolBinding);
		}
		else if (theProtocolBinding.isTypeOf(oFF.ProtocolBindingType.INTEGER))
		{
			binding = oFF.DpBindingInteger.create(process, receiverType, theProtocolBinding);
		}
		if (oFF.notNull(binding))
		{
			binding.setCacheId(cacheIdentifier);
			binding.bind(sender, receiver, pullOnReceiverReady);
		}
	}
	return binding;
};
oFF.DpBindingManager.prototype.bindTogether = function(senderExpression, senderDefaultDomain, senderContextObject, receiverExpression, receiverDefaultDomain, receiverContextObject, type, cacheIdentifier, pullOnReceiverReady, isNeo)
{
	let senderProvider = null;
	let receiverProvider = null;
	if (isNeo === true || oFF.XString.startsWith(senderExpression, "ui:"))
	{
		senderProvider = this.getBindingProvider2(senderExpression, senderDefaultDomain, senderContextObject);
	}
	else
	{
		senderProvider = this.getBindingProvider2(senderExpression, senderDefaultDomain, senderContextObject);
	}
	receiverProvider = this.getBindingProvider2(receiverExpression, receiverDefaultDomain, receiverContextObject);
	if (oFF.notNull(senderProvider) && oFF.notNull(receiverProvider))
	{
		return this.doBindingWithProviders(senderProvider, receiverProvider, type, cacheIdentifier, pullOnReceiverReady);
	}
	else
	{
		return null;
	}
};
oFF.DpBindingManager.prototype.doBindingWithProviders = function(senderProvider, receiverProvider, type, cacheIdentifier, pullOnReceiverReady)
{
	let process = this.getProcess();
	let senderType = null;
	let receiverType = null;
	if (oFF.notNull(senderProvider) && oFF.notNull(receiverProvider))
	{
		let senderBindings = senderProvider.getSenderBindings();
		let receiverBindings = receiverProvider.getReceiverBindings();
		if (oFF.notNull(type))
		{
			for (let s = 0; s < senderBindings.size(); s++)
			{
				senderType = senderBindings.get(s);
				if (senderType.isEqualTo(type))
				{
					break;
				}
				senderType = null;
			}
			for (let r = 0; r < receiverBindings.size(); r++)
			{
				receiverType = receiverBindings.get(r);
				if (type.isTypeOf(receiverType))
				{
					break;
				}
				receiverType = null;
			}
		}
		if (oFF.isNull(senderType) || oFF.isNull(receiverType))
		{
			for (let i = 0; i < receiverBindings.size(); i++)
			{
				receiverType = receiverBindings.get(i);
				if (senderBindings.contains(receiverType))
				{
					senderType = receiverType;
					break;
				}
			}
		}
		if (oFF.notNull(senderType) && oFF.notNull(receiverType))
		{
			let senderProtocols = senderProvider.getSenderProtocolBindings(senderType);
			let receiverProtocols = receiverProvider.getReceiverProtocolBindings(receiverType);
			let protocol = null;
			if (oFF.notNull(receiverProtocols) && oFF.notNull(senderProtocols))
			{
				for (let k = 0; k < receiverProtocols.size(); k++)
				{
					let currentProtocol = receiverProtocols.get(k);
					if (senderProtocols.contains(currentProtocol))
					{
						protocol = currentProtocol;
						break;
					}
				}
			}
			return oFF.DpBindingManager.doBinding(process, senderType, receiverType, protocol, senderProvider, receiverProvider, cacheIdentifier, pullOnReceiverReady);
		}
	}
	return null;
};
oFF.DpBindingManager.prototype.getBindingProvider = function(expression, defaultDomain, contextObject, mergeIntoSpace)
{
	let theExpression = expression;
	if (oFF.isNull(theExpression) && oFF.notNull(defaultDomain))
	{
		theExpression = oFF.XStringUtils.concatenate2(defaultDomain.getName(), ":");
	}
	if (oFF.notNull(theExpression))
	{
		let parser = oFF.SigSelParser.create();
		let result = parser.parse(theExpression);
		if (result.isValid())
		{
			let ops = result.getData();
			let session = this.getSession();
			let selector = session.getSelector();
			if (ops.size() >= 1)
			{
				let operation = ops.get(0);
				let object1 = selector.selectComponentByOp(operation, defaultDomain, contextObject, -1, mergeIntoSpace);
				return object1;
			}
		}
	}
	return null;
};
oFF.DpBindingManager.prototype.getBindingProvider2 = function(expression, defaultDomain, contextObject)
{
	let component = null;
	let operation = null;
	let theExpression = expression;
	if (oFF.isNull(theExpression) && oFF.notNull(defaultDomain))
	{
		theExpression = oFF.XStringUtils.concatenate2(defaultDomain.getName(), ":");
	}
	if (oFF.notNull(theExpression))
	{
		let parser = oFF.SigSelParser.create();
		let result = parser.parse(theExpression);
		if (result.isValid())
		{
			let ops = result.getData();
			let session = this.getSession();
			let selector = session.getSelector();
			if (ops.size() >= 1)
			{
				operation = ops.get(0);
				component = selector.selectComponentByOp(operation, defaultDomain, contextObject, -1, false);
			}
		}
	}
	let provider = null;
	if (oFF.notNull(operation) && oFF.notNull(component))
	{
		provider = oFF.DpBindingFactory.createBindingProvider(component, operation.getSelectedProperty());
	}
	return provider;
};
oFF.DpBindingManager.prototype.selectComponentByExpr = function(sigSelExpression, defaultDomain, contextObject, maximumCount, mergeIntoSpace)
{
	let session = this.getSession();
	let selector = session.getSelector();
	return selector.selectComponentByExpr(sigSelExpression, defaultDomain, contextObject, maximumCount, mergeIntoSpace);
};
oFF.DpBindingManager.prototype.selectComponentByOp = function(operation, defaultDomain, contextObject, maximumCount, mergeIntoSpace)
{
	let session = this.getSession();
	let selector = session.getSelector();
	return selector.selectComponentByOp(operation, defaultDomain, contextObject, maximumCount, mergeIntoSpace);
};
oFF.DpBindingManager.prototype.selectComponentsByExpr = function(sigSelExpression, defaultDomain, contextObject, maximumCount)
{
	let session = this.getSession();
	let selector = session.getSelector();
	return selector.selectComponentsByExpr(sigSelExpression, defaultDomain, contextObject, maximumCount);
};
oFF.DpBindingManager.prototype.selectComponentsByOp = function(operation, defaultDomain, contextObject, maximumCount)
{
	let session = this.getSession();
	let selector = session.getSelector();
	return selector.selectComponentsByOp(operation, defaultDomain, contextObject, maximumCount);
};
oFF.DpBindingManager.prototype.selectSpecificBindingProvider = oFF.noSupport;

oFF.DpBindingInteger = function() {};
oFF.DpBindingInteger.prototype = new oFF.DpBinding();
oFF.DpBindingInteger.prototype._ff_c = "DpBindingInteger";

oFF.DpBindingInteger.create = function(process, dataBinding, protocolBinding)
{
	let newObj = new oFF.DpBindingInteger();
	newObj.setupExt(process, dataBinding, protocolBinding);
	return newObj;
};
oFF.DpBindingInteger.prototype.getComponentType = function()
{
	return oFF.IoComponentType.BINDING_ADAPTER_INT;
};
oFF.DpBindingInteger.prototype.transportData = function()
{
	let intValue = this.m_sender.getInteger();
	this.m_receiver.setInteger(intValue);
};

oFF.DpBindingJson = function() {};
oFF.DpBindingJson.prototype = new oFF.DpBinding();
oFF.DpBindingJson.prototype._ff_c = "DpBindingJson";

oFF.DpBindingJson.create = function(process, dataBinding, protocolBinding, checkForChanges)
{
	let newObj = new oFF.DpBindingJson();
	newObj.setupExt(process, dataBinding, protocolBinding);
	newObj.m_checkForChanges = checkForChanges;
	return newObj;
};
oFF.DpBindingJson.prototype.m_checkForChanges = false;
oFF.DpBindingJson.prototype.m_lastChecksum = null;
oFF.DpBindingJson.prototype.getComponentType = function()
{
	return oFF.IoComponentType.BINDING_ADAPTER_JSON;
};
oFF.DpBindingJson.prototype.pullFromCache = function()
{
	let element = null;
	let cacheId = this.getCacheId();
	if (oFF.notNull(cacheId))
	{
		let cacheManager = this.getProcess().getCacheManager();
		if (oFF.notNull(cacheManager))
		{
			let cache = cacheManager.getSubCache("dpbinding");
			if (oFF.notNull(cache))
			{
				element = cache.getByKey(cacheId);
			}
		}
	}
	return element;
};
oFF.DpBindingJson.prototype.putInCache = function(element)
{
	let cacheId = this.getCacheId();
	if (oFF.notNull(cacheId) && oFF.notNull(element))
	{
		let cacheManager = this.getProcess().getCacheManager();
		if (oFF.notNull(cacheManager))
		{
			let cache = cacheManager.getSubCache("dpbinding");
			if (oFF.notNull(cache))
			{
				cache.put(cacheId, element, null);
			}
		}
	}
};
oFF.DpBindingJson.prototype.setAtReceiver = function(element)
{
	if (oFF.notNull(this.m_receiver) && oFF.notNull(element))
	{
		let performApply = true;
		if (this.m_checkForChanges)
		{
			let normalized = oFF.PrUtils.serialize(element, true, false, 0);
			let newChecksum = oFF.XSha1.createSHA1(normalized);
			if (oFF.notNull(newChecksum) && oFF.notNull(this.m_lastChecksum))
			{
				if (oFF.XString.isEqual(newChecksum, this.m_lastChecksum))
				{
					performApply = false;
				}
			}
			this.m_lastChecksum = newChecksum;
		}
		if (performApply)
		{
			this.m_receiver.setElement(element);
		}
	}
};
oFF.DpBindingJson.prototype.transportData = function()
{
	if (oFF.notNull(this.m_sender))
	{
		try
		{
			let element = this.m_sender.getElement();
			this.putInCache(element);
			this.setAtReceiver(element);
		}
		catch (e)
		{
			this.m_dataError = oFF.XException.getStackTrace(e, 0);
			this.log(this.m_dataError);
		}
	}
};
oFF.DpBindingJson.prototype.transportDataFromCache = function()
{
	try
	{
		let element = this.pullFromCache();
		this.setAtReceiver(element);
	}
	catch (e)
	{
		this.log(oFF.XException.getStackTrace(e, 0));
	}
};

oFF.DpBindingString = function() {};
oFF.DpBindingString.prototype = new oFF.DpBinding();
oFF.DpBindingString.prototype._ff_c = "DpBindingString";

oFF.DpBindingString.create = function(process, dataBinding, protocolBinding)
{
	let newObj = new oFF.DpBindingString();
	newObj.setupExt(process, dataBinding, protocolBinding);
	return newObj;
};
oFF.DpBindingString.prototype.getComponentType = function()
{
	return oFF.IoComponentType.BINDING_ADAPTER_STRING;
};
oFF.DpBindingString.prototype.transportData = function()
{
	let stringValue = this.m_sender.getString();
	this.m_receiver.setString(stringValue);
};

oFF.BindingModule = function() {};
oFF.BindingModule.prototype = new oFF.DfModule();
oFF.BindingModule.prototype._ff_c = "BindingModule";

oFF.BindingModule.s_module = null;
oFF.BindingModule.getInstance = function()
{
	if (oFF.isNull(oFF.BindingModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.KernelNativeModule.getInstance());
		oFF.BindingModule.s_module = oFF.DfModule.startExt(new oFF.BindingModule());
		oFF.ProtocolBindingType.staticSetup();
		oFF.SemanticBindingType.staticSetup();
		oFF.DpBindingFactory.staticSetup();
		oFF.DpBindingStringFactory.staticSetupStringBindingFactory();
		oFF.DfModule.stopExt(oFF.BindingModule.s_module);
	}
	return oFF.BindingModule.s_module;
};
oFF.BindingModule.prototype.getName = function()
{
	return "ff2010.binding";
};

oFF.BindingModule.getInstance();

return oFF;
} );