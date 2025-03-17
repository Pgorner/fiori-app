/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff2220.ui.tools"
],
function(oFF)
{
"use strict";

oFF.SiWriterJava = function() {};
oFF.SiWriterJava.prototype = new oFF.XObject();
oFF.SiWriterJava.prototype._ff_c = "SiWriterJava";

oFF.SiWriterJava.create = function()
{
	let writer = new oFF.SiWriterJava();
	writer.m_buffer = oFF.XStringBufferExt.create();
	return writer;
};
oFF.SiWriterJava.prototype.m_buffer = null;
oFF.SiWriterJava.prototype.toString = function()
{
	return this.m_buffer.toString();
};
oFF.SiWriterJava.prototype.writeBlock = function(token)
{
	this.m_buffer.append("{");
	let child = token.getChild();
	if (oFF.notNull(child))
	{
		child.write(this);
	}
	this.m_buffer.append("}");
};
oFF.SiWriterJava.prototype.writeDefault = function(token) {};
oFF.SiWriterJava.prototype.writeDouble = function(token)
{
	this.m_buffer.append(token.getValue());
};
oFF.SiWriterJava.prototype.writeExpressionSequence = function(token)
{
	let children = token.getChildren();
	for (let i = 0; i < children.size(); i++)
	{
		let child = children.get(i);
		child.write(this);
		if (child.getType() !== oFF.SiTokenType.CURLY_BRACKET)
		{
			this.m_buffer.append(";");
		}
	}
};
oFF.SiWriterJava.prototype.writeFalse = function(token)
{
	this.m_buffer.append("false");
};
oFF.SiWriterJava.prototype.writeFunction = function(token)
{
	this.m_buffer.append(token.getValue());
	this.m_buffer.append("(");
	let children = token.getChildren();
	if (oFF.notNull(children))
	{
		for (let i = 0; i < children.size(); i++)
		{
			if (i > 0)
			{
				this.m_buffer.append(",");
			}
			let child = children.get(i);
			child.write(this);
		}
	}
	this.m_buffer.append(")");
};
oFF.SiWriterJava.prototype.writeIdentifier = function(token)
{
	this.m_buffer.append(token.getValue());
};
oFF.SiWriterJava.prototype.writeInteger = function(token)
{
	this.m_buffer.append(token.getValue());
};
oFF.SiWriterJava.prototype.writeOp = function(token, name)
{
	let left = token.getLeft();
	left.write(this);
	this.m_buffer.append(name);
	let right = token.getRight();
	right.write(this);
};
oFF.SiWriterJava.prototype.writeOpBoolAnd = function(token)
{
	this.writeOp(token, "&&");
};
oFF.SiWriterJava.prototype.writeOpBoolOr = function(token)
{
	this.writeOp(token, "||");
};
oFF.SiWriterJava.prototype.writeOpDiv = function(token)
{
	this.writeOp(token, "/");
};
oFF.SiWriterJava.prototype.writeOpDot = function(token)
{
	this.writeOp(token, ".");
};
oFF.SiWriterJava.prototype.writeOpEqual = function(token)
{
	this.writeOp(token, "==");
};
oFF.SiWriterJava.prototype.writeOpGreater = function(token)
{
	this.writeOp(token, ">");
};
oFF.SiWriterJava.prototype.writeOpGreaterEqual = function(token)
{
	this.writeOp(token, ">=");
};
oFF.SiWriterJava.prototype.writeOpLower = function(token)
{
	this.writeOp(token, "<");
};
oFF.SiWriterJava.prototype.writeOpLowerEqual = function(token)
{
	this.writeOp(token, "<=");
};
oFF.SiWriterJava.prototype.writeOpMinus = function(token)
{
	this.writeOp(token, "-");
};
oFF.SiWriterJava.prototype.writeOpMult = function(token)
{
	this.writeOp(token, "*");
};
oFF.SiWriterJava.prototype.writeOpNotEqual = function(token)
{
	this.writeOp(token, "!=");
};
oFF.SiWriterJava.prototype.writeOpPlus = function(token)
{
	this.writeOp(token, "+");
};
oFF.SiWriterJava.prototype.writeString = function(token)
{
	this.m_buffer.append("'");
	this.m_buffer.append(token.getValue());
	this.m_buffer.append("'");
};
oFF.SiWriterJava.prototype.writeTrue = function(token)
{
	this.m_buffer.append("true");
};

oFF.CustomControlRegistration = {

	s_controls:null,
	getAllEntries:function()
	{
			return oFF.CustomControlRegistration.s_controls;
	},
	getCustomControl:function(name)
	{
			return oFF.CustomControlRegistration.s_controls.getByKey(name);
	},
	setCustomControl:function(name, uiControl)
	{
			oFF.CustomControlRegistration.s_controls.put(name, uiControl);
	},
	staticSetup:function()
	{
			oFF.CustomControlRegistration.s_controls = oFF.XHashMapByString.create();
	}
};

oFF.GlobalValueHolder = function() {};
oFF.GlobalValueHolder.prototype = new oFF.XObject();
oFF.GlobalValueHolder.prototype._ff_c = "GlobalValueHolder";

oFF.GlobalValueHolder.prototype.m_content = null;
oFF.GlobalValueHolder.prototype.getContent = function()
{
	return this.m_content;
};
oFF.GlobalValueHolder.prototype.setContent = function(content)
{
	this.m_content = content;
};

oFF.SxJsonDpBindingFactory = function() {};
oFF.SxJsonDpBindingFactory.prototype = new oFF.DpBindingFactory();
oFF.SxJsonDpBindingFactory.prototype._ff_c = "SxJsonDpBindingFactory";

oFF.SxJsonDpBindingFactory.staticSetupJsonBindingFactory = function()
{
	oFF.DpBindingFactory.registerFactory(oFF.QuasarComponentType.JSON_DATA_PROVIDER, new oFF.SxJsonDpBindingFactory());
};
oFF.SxJsonDpBindingFactory.prototype.newBindingProvider = function(component, path)
{
	let dp = component;
	return oFF.SxJsonDpBindingProvider.create(dp, path);
};

oFF.SxJsonDpBindingProvider = function() {};
oFF.SxJsonDpBindingProvider.prototype = new oFF.XObject();
oFF.SxJsonDpBindingProvider.prototype._ff_c = "SxJsonDpBindingProvider";

oFF.SxJsonDpBindingProvider.create = function(dp, path)
{
	let newObject = new oFF.SxJsonDpBindingProvider();
	newObject.m_dp = dp;
	newObject.m_path = path;
	return newObject;
};
oFF.SxJsonDpBindingProvider.prototype.m_dp = null;
oFF.SxJsonDpBindingProvider.prototype.m_path = null;
oFF.SxJsonDpBindingProvider.prototype.getReceiverBindings = function()
{
	let list = oFF.XList.create();
	list.add(oFF.SemanticBindingType.STRING);
	return list;
};
oFF.SxJsonDpBindingProvider.prototype.getReceiverProtocolBindings = function(type)
{
	let list = oFF.XList.create();
	list.add(oFF.ProtocolBindingType.STRING);
	return list;
};
oFF.SxJsonDpBindingProvider.prototype.getSenderBindings = function()
{
	let list = oFF.XList.create();
	list.add(oFF.SemanticBindingType.STRING);
	return list;
};
oFF.SxJsonDpBindingProvider.prototype.getSenderProtocolBindings = function(type)
{
	let list = oFF.XList.create();
	list.add(oFF.ProtocolBindingType.STRING);
	return list;
};
oFF.SxJsonDpBindingProvider.prototype.newReceiverBinding = function(type, protocol)
{
	return oFF.SxJsonDpBindingReceiver.create(this.m_dp, this.m_path);
};
oFF.SxJsonDpBindingProvider.prototype.newSenderBinding = function(type, protocol)
{
	return oFF.SxJsonDpBindingSender.create(this.m_dp, this.m_path);
};

oFF.SxRestDpBindingFactory = function() {};
oFF.SxRestDpBindingFactory.prototype = new oFF.DpBindingFactory();
oFF.SxRestDpBindingFactory.prototype._ff_c = "SxRestDpBindingFactory";

oFF.SxRestDpBindingFactory.staticSetupJsonBindingFactory = function()
{
	oFF.DpBindingFactory.registerFactory(oFF.QuasarComponentType.REST_DATA_PROVIDER, new oFF.SxRestDpBindingFactory());
};
oFF.SxRestDpBindingFactory.prototype.newBindingProvider = function(component, path)
{
	let dp = component;
	return oFF.SxRestDpBindingProvider.create(dp, path);
};

oFF.SxRestDpBindingProvider = function() {};
oFF.SxRestDpBindingProvider.prototype = new oFF.XObject();
oFF.SxRestDpBindingProvider.prototype._ff_c = "SxRestDpBindingProvider";

oFF.SxRestDpBindingProvider.create = function(dp, path)
{
	let newObject = new oFF.SxRestDpBindingProvider();
	newObject.m_dp = dp;
	newObject.m_path = path;
	return newObject;
};
oFF.SxRestDpBindingProvider.prototype.m_dp = null;
oFF.SxRestDpBindingProvider.prototype.m_path = null;
oFF.SxRestDpBindingProvider.prototype.getReceiverBindings = function()
{
	let list = oFF.XList.create();
	list.add(oFF.SemanticBindingType.STRING);
	return list;
};
oFF.SxRestDpBindingProvider.prototype.getReceiverProtocolBindings = function(type)
{
	let list = oFF.XList.create();
	list.add(oFF.ProtocolBindingType.STRING);
	return list;
};
oFF.SxRestDpBindingProvider.prototype.getSenderBindings = function()
{
	let list = oFF.XList.create();
	list.add(oFF.SemanticBindingType.STRING);
	return list;
};
oFF.SxRestDpBindingProvider.prototype.getSenderProtocolBindings = function(type)
{
	let list = oFF.XList.create();
	list.add(oFF.ProtocolBindingType.STRING);
	return list;
};
oFF.SxRestDpBindingProvider.prototype.newReceiverBinding = function(type, protocol)
{
	return null;
};
oFF.SxRestDpBindingProvider.prototype.newSenderBinding = function(type, protocol)
{
	return oFF.SxRestDpBindingSender.create(this.m_dp, this.m_path);
};

oFF.SiToken = function() {};
oFF.SiToken.prototype = new oFF.XObject();
oFF.SiToken.prototype._ff_c = "SiToken";

oFF.SiToken.create = function(type)
{
	return oFF.SiToken.createExt(type, -1, null, null);
};
oFF.SiToken.createExt = function(type, operatorLevel, value, children)
{
	let newObj = new oFF.SiToken();
	newObj.m_type = type;
	if (operatorLevel !== -1)
	{
		newObj.m_operatorLevel = operatorLevel;
	}
	else
	{
		newObj.m_operatorLevel = type.getOperatorLevel();
	}
	newObj.m_value = value;
	newObj.m_children = children;
	return newObj;
};
oFF.SiToken.createWithValue = function(type, value)
{
	return oFF.SiToken.createExt(type, -1, value, null);
};
oFF.SiToken.prototype.m_children = null;
oFF.SiToken.prototype.m_operatorLevel = 0;
oFF.SiToken.prototype.m_type = null;
oFF.SiToken.prototype.m_value = null;
oFF.SiToken.prototype.add = function(token)
{
	if (oFF.isNull(this.m_children))
	{
		this.m_children = oFF.XList.create();
	}
	this.m_children.add(token);
	return this;
};
oFF.SiToken.prototype.getChild = function()
{
	if (oFF.notNull(this.m_children) && this.m_children.size() === 1)
	{
		return this.m_children.get(0);
	}
	return null;
};
oFF.SiToken.prototype.getChildren = function()
{
	return this.m_children;
};
oFF.SiToken.prototype.getLeft = function()
{
	if (oFF.notNull(this.m_children) && this.m_children.size() > 0)
	{
		return this.m_children.get(0);
	}
	return null;
};
oFF.SiToken.prototype.getOperatorLevel = function()
{
	return this.m_operatorLevel;
};
oFF.SiToken.prototype.getRight = function()
{
	if (oFF.notNull(this.m_children) && this.m_children.size() > 1)
	{
		return this.m_children.get(1);
	}
	return null;
};
oFF.SiToken.prototype.getType = function()
{
	return this.m_type;
};
oFF.SiToken.prototype.getValue = function()
{
	return this.m_value;
};
oFF.SiToken.prototype.hasElements = function()
{
	return this.isEmpty() === false;
};
oFF.SiToken.prototype.isEmpty = function()
{
	return oFF.isNull(this.m_children) || this.m_children.size() === 0;
};
oFF.SiToken.prototype.setChildren = function(children)
{
	this.m_children = children;
};
oFF.SiToken.prototype.setValue = function(value)
{
	this.m_value = value;
};
oFF.SiToken.prototype.size = function()
{
	if (oFF.isNull(this.m_children))
	{
		return 0;
	}
	return this.m_children.size();
};
oFF.SiToken.prototype.toClassicString = function()
{
	let buffer = oFF.XStringBuffer.create();
	if (this.m_type === oFF.SiTokenType.ROUND_BRACKET)
	{
		buffer.append("(");
	}
	else
	{
		buffer.append(this.m_type.getName());
		if (oFF.notNull(this.m_value))
		{
			buffer.append(":");
			buffer.append(this.m_value);
		}
	}
	if (oFF.notNull(this.m_children))
	{
		buffer.append("[");
		for (let i = 0; i < this.m_children.size(); i++)
		{
			if (i > 0)
			{
				buffer.append(", ");
			}
			buffer.append(this.m_children.get(i).toClassicString());
		}
		buffer.append("]");
	}
	if (this.m_type === oFF.SiTokenType.ROUND_BRACKET)
	{
		buffer.append(")");
	}
	return buffer.toString();
};
oFF.SiToken.prototype.toJson = function()
{
	let buffer = oFF.XStringBufferJson.create();
	this.toJsonInternal(buffer);
	return buffer.toString();
};
oFF.SiToken.prototype.toJsonInternal = function(buffer)
{
	if (this.m_type !== oFF.SiTokenType.ROUND_BRACKET)
	{
		buffer.openStructure();
		buffer.appendLabelAndString("Name", this.m_type.getName());
		if (oFF.notNull(this.m_value))
		{
			buffer.appendLabelAndString("Value", this.m_value);
		}
		if (oFF.notNull(this.m_children))
		{
			buffer.appendLabel("Children");
		}
	}
	if (oFF.notNull(this.m_children))
	{
		buffer.openArray();
		for (let i = 0; i < this.m_children.size(); i++)
		{
			let child = this.m_children.get(i);
			child.toJsonInternal(buffer);
		}
		buffer.closeArray();
	}
	if (this.m_type !== oFF.SiTokenType.ROUND_BRACKET)
	{
		buffer.closeStructure();
	}
	return buffer;
};
oFF.SiToken.prototype.toString = function()
{
	return this.toClassicString();
};
oFF.SiToken.prototype.write = function(writer)
{
	if (this.m_type === oFF.SiTokenType.EXPR_SEQ)
	{
		writer.writeExpressionSequence(this);
	}
	else if (this.m_type === oFF.SiTokenType.FUNCTION)
	{
		writer.writeFunction(this);
	}
	else if (this.m_type === oFF.SiTokenType.STRING)
	{
		writer.writeString(this);
	}
	else if (this.m_type === oFF.SiTokenType.INTEGER)
	{
		writer.writeInteger(this);
	}
	else if (this.m_type === oFF.SiTokenType.DOUBLE)
	{
		writer.writeDouble(this);
	}
	else if (this.m_type === oFF.SiTokenType.IDENTIFIER)
	{
		writer.writeIdentifier(this);
	}
	else if (this.m_type === oFF.SiTokenType.CURLY_BRACKET)
	{
		writer.writeBlock(this);
	}
	else if (this.m_type === oFF.SiTokenType.OP_DOT)
	{
		writer.writeOpDot(this);
	}
	else if (this.m_type === oFF.SiTokenType.OP_PLUS)
	{
		writer.writeOpPlus(this);
	}
	else if (this.m_type === oFF.SiTokenType.OP_MINUS)
	{
		writer.writeOpMinus(this);
	}
	else if (this.m_type === oFF.SiTokenType.OP_MULT)
	{
		writer.writeOpMult(this);
	}
	else if (this.m_type === oFF.SiTokenType.OP_DIV)
	{
		writer.writeOpDiv(this);
	}
	else if (this.m_type === oFF.SiTokenType.OP_LOWER)
	{
		writer.writeOpLower(this);
	}
	else if (this.m_type === oFF.SiTokenType.OP_LOWER_EQUAL)
	{
		writer.writeOpLowerEqual(this);
	}
	else if (this.m_type === oFF.SiTokenType.OP_GREATER)
	{
		writer.writeOpGreater(this);
	}
	else if (this.m_type === oFF.SiTokenType.OP_GREATER_EQUAL)
	{
		writer.writeOpGreaterEqual(this);
	}
	else if (this.m_type === oFF.SiTokenType.OP_EQUAL)
	{
		writer.writeOpEqual(this);
	}
	else if (this.m_type === oFF.SiTokenType.OP_NOT_EQUAL)
	{
		writer.writeOpNotEqual(this);
	}
	else if (this.m_type === oFF.SiTokenType.OP_BOOL_AND)
	{
		writer.writeOpBoolAnd(this);
	}
	else if (this.m_type === oFF.SiTokenType.OP_BOOL_OR)
	{
		writer.writeOpBoolOr(this);
	}
	else if (this.m_type === oFF.SiTokenType.CONST_TRUE)
	{
		writer.writeTrue(this);
	}
	else if (this.m_type === oFF.SiTokenType.CONST_FALSE)
	{
		writer.writeFalse(this);
	}
	else
	{
		writer.writeDefault(this);
	}
};

oFF.UiBinding = function() {};
oFF.UiBinding.prototype = new oFF.XObject();
oFF.UiBinding.prototype._ff_c = "UiBinding";

oFF.UiBinding.prototype.m_context = null;
oFF.UiBinding.prototype.getUiContext = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_context);
};
oFF.UiBinding.prototype.isReceiverReady = function()
{
	return true;
};
oFF.UiBinding.prototype.registerReceiverReadyListener = function(listener, customIdentifier) {};
oFF.UiBinding.prototype.releaseObject = function()
{
	this.m_context = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.UiBinding.prototype.setupExt = function(context)
{
	this.m_context = oFF.XWeakReferenceUtil.getWeakRef(context);
};
oFF.UiBinding.prototype.unregisterReceiverReadyListener = function(listener) {};

oFF.UiBindingFactory = function() {};
oFF.UiBindingFactory.prototype = new oFF.DpBindingFactory();
oFF.UiBindingFactory.prototype._ff_c = "UiBindingFactory";

oFF.UiBindingFactory.staticSetupUiBindingFactory = function()
{
	oFF.DpBindingFactory.registerFactory(oFF.UiComponentType.UI_CONTROL, new oFF.UiBindingFactory());
};
oFF.UiBindingFactory.prototype.newBindingProvider = function(component, path)
{
	if (oFF.XStringUtils.isNullOrEmpty(path))
	{
		return oFF.UiBindingProviderForStd.create(component, path);
	}
	else
	{
		return oFF.UiBindingProviderForAttributes.create(component, path);
	}
};

oFF.UiBindingProviderForAttributes = function() {};
oFF.UiBindingProviderForAttributes.prototype = new oFF.XObject();
oFF.UiBindingProviderForAttributes.prototype._ff_c = "UiBindingProviderForAttributes";

oFF.UiBindingProviderForAttributes.create = function(component, path)
{
	let newObj = new oFF.UiBindingProviderForAttributes();
	newObj.m_component = component;
	newObj.m_path = path;
	newObj.m_getterProperty = oFF.UiAllOperations.lookupGetterProperty(path);
	newObj.m_setterProperty = oFF.UiAllOperations.lookupSetterProperty(path);
	return newObj;
};
oFF.UiBindingProviderForAttributes.prototype.m_component = null;
oFF.UiBindingProviderForAttributes.prototype.m_getterProperty = null;
oFF.UiBindingProviderForAttributes.prototype.m_path = null;
oFF.UiBindingProviderForAttributes.prototype.m_setterProperty = null;
oFF.UiBindingProviderForAttributes.prototype.getReceiverBindings = function()
{
	let list = oFF.XList.create();
	let componentType = this.m_setterProperty.getComponentType();
	if (oFF.notNull(componentType))
	{
		if (componentType.isTypeOf(oFF.UiComponentType.UI_PROPERTY_OP_STRING))
		{
			list.add(oFF.SemanticBindingType.STRING);
		}
		else if (componentType.isTypeOf(oFF.UiComponentType.UI_PROPERTY_OP_JSON))
		{
			list.add(oFF.SemanticBindingType.JSON);
		}
	}
	return list;
};
oFF.UiBindingProviderForAttributes.prototype.getReceiverProtocolBindings = function(type)
{
	let list = oFF.XList.create();
	let componentType = this.m_setterProperty.getComponentType();
	if (oFF.notNull(componentType))
	{
		if (componentType.isTypeOf(oFF.UiComponentType.UI_PROPERTY_OP_STRING))
		{
			list.add(oFF.ProtocolBindingType.STRING);
		}
		else if (componentType.isTypeOf(oFF.UiComponentType.UI_PROPERTY_OP_JSON))
		{
			list.add(oFF.ProtocolBindingType.JSON);
		}
	}
	return list;
};
oFF.UiBindingProviderForAttributes.prototype.getSenderBindings = function()
{
	let list = oFF.XList.create();
	let componentType = this.m_getterProperty.getComponentType();
	if (oFF.notNull(componentType))
	{
		if (componentType.isTypeOf(oFF.UiComponentType.UI_PROPERTY_OP_STRING))
		{
			list.add(oFF.SemanticBindingType.STRING);
		}
		else if (componentType.isTypeOf(oFF.UiComponentType.UI_PROPERTY_OP_JSON))
		{
			list.add(oFF.SemanticBindingType.JSON);
		}
	}
	return list;
};
oFF.UiBindingProviderForAttributes.prototype.getSenderProtocolBindings = function(type)
{
	let list = oFF.XList.create();
	let componentType = this.m_getterProperty.getComponentType();
	if (oFF.notNull(componentType))
	{
		if (componentType.isTypeOf(oFF.UiComponentType.UI_PROPERTY_OP_STRING))
		{
			list.add(oFF.ProtocolBindingType.STRING);
		}
		else if (componentType.isTypeOf(oFF.UiComponentType.UI_PROPERTY_OP_JSON))
		{
			list.add(oFF.ProtocolBindingType.JSON);
		}
	}
	return list;
};
oFF.UiBindingProviderForAttributes.prototype.newReceiverBinding = function(type, protocol)
{
	let receiver = null;
	if (protocol === oFF.ProtocolBindingType.STRING)
	{
		receiver = oFF.UiBindingReceivePropString.create(this.m_component, this.m_setterProperty);
	}
	else if (protocol === oFF.ProtocolBindingType.JSON)
	{
		receiver = oFF.UiBindingReceivePropJson.create(this.m_component, this.m_setterProperty);
	}
	return receiver;
};
oFF.UiBindingProviderForAttributes.prototype.newSenderBinding = function(type, protocol)
{
	let sender = null;
	if (protocol === oFF.ProtocolBindingType.STRING)
	{
		sender = oFF.UiBindingSendPropString.create(this.m_component, this.m_getterProperty);
	}
	else if (protocol === oFF.ProtocolBindingType.JSON)
	{
		sender = oFF.UiBindingSendPropJson.create(this.m_component, this.m_getterProperty);
	}
	return sender;
};
oFF.UiBindingProviderForAttributes.prototype.toString = function()
{
	return this.m_path;
};

oFF.UiBindingProviderForStd = function() {};
oFF.UiBindingProviderForStd.prototype = new oFF.XObject();
oFF.UiBindingProviderForStd.prototype._ff_c = "UiBindingProviderForStd";

oFF.UiBindingProviderForStd.create = function(component, path)
{
	let newObj = new oFF.UiBindingProviderForStd();
	newObj.m_component = component;
	newObj.m_path = path;
	return newObj;
};
oFF.UiBindingProviderForStd.prototype.m_component = null;
oFF.UiBindingProviderForStd.prototype.m_path = null;
oFF.UiBindingProviderForStd.prototype.getReceiverBindings = function()
{
	let context = this.m_component;
	return context.getUiType().getReceiverBindings();
};
oFF.UiBindingProviderForStd.prototype.getReceiverProtocolBindings = function(type)
{
	let context = this.m_component;
	return context.getUiType().getReceiverProtocolBindings(type);
};
oFF.UiBindingProviderForStd.prototype.getSenderBindings = function()
{
	let context = this.m_component;
	return context.getUiType().getSenderBindings();
};
oFF.UiBindingProviderForStd.prototype.getSenderProtocolBindings = function(type)
{
	let context = this.m_component;
	return context.getUiType().getSenderProtocolBindings(type);
};
oFF.UiBindingProviderForStd.prototype.newReceiverBinding = function(type, protocol)
{
	let context = this.m_component;
	if (type.isTypeOf(oFF.SemanticBindingType.STRING))
	{
		return oFF.UiBindingReceiveText.create(context);
	}
	else if (type.isTypeOf(oFF.SemanticBindingType.JSON))
	{
		return oFF.UiBindingReceiveJson.create(context);
	}
	else
	{
		return null;
	}
};
oFF.UiBindingProviderForStd.prototype.newSenderBinding = function(type, protocol)
{
	let context = this.m_component;
	if (type === oFF.SemanticBindingType.STRING)
	{
		return oFF.UiBindingSendText.create(context);
	}
	return null;
};
oFF.UiBindingProviderForStd.prototype.toString = function()
{
	return this.m_path;
};

oFF.UiPrgContainerFactory = function() {};
oFF.UiPrgContainerFactory.prototype = new oFF.ProgramContainerFactory();
oFF.UiPrgContainerFactory.prototype._ff_c = "UiPrgContainerFactory";

oFF.UiPrgContainerFactory.staticSetupUiContainerFactory = function()
{
	oFF.ProgramContainerFactory.registerFactory(oFF.ProgramContainerType.CONSOLE, new oFF.UiPrgContainerFactory());
	oFF.ProgramContainerFactory.registerFactory(oFF.ProgramContainerType.WINDOW, new oFF.UiPrgContainerFactory());
	oFF.ProgramContainerFactory.registerFactory(oFF.ProgramContainerType.DIALOG, new oFF.UiPrgContainerFactory());
	oFF.ProgramContainerFactory.registerFactory(oFF.ProgramContainerType.STANDALONE, new oFF.UiPrgContainerFactory());
	oFF.ProgramContainerFactory.registerFactory(oFF.ProgramContainerType.CONTENT, new oFF.UiPrgContainerFactory());
};
oFF.UiPrgContainerFactory.prototype.newProgramContainer = function(containerType)
{
	let container = null;
	if (containerType === oFF.ProgramContainerType.CONSOLE)
	{
		container = oFF.UiPrgContainerTerminal.createExt(null, null);
	}
	else if (containerType === oFF.ProgramContainerType.WINDOW)
	{
		container = oFF.UiPrgContainerWindow.createExt(null, null);
	}
	else if (containerType === oFF.ProgramContainerType.DIALOG)
	{
		container = oFF.UiPrgContainerDialog.createExt(null, null);
	}
	else if (containerType === oFF.ProgramContainerType.STANDALONE)
	{
		container = oFF.UiPrgContainerStandalone.createExt(null, null);
	}
	else if (containerType === oFF.ProgramContainerType.CONTENT)
	{
		container = oFF.UiPrgContainerContent.createExt(null, null);
	}
	return container;
};

oFF.SxJsonDp = function() {};
oFF.SxJsonDp.prototype = new oFF.XObject();
oFF.SxJsonDp.prototype._ff_c = "SxJsonDp";

oFF.SxJsonDp.prototype.m_name = null;
oFF.SxJsonDp.prototype.m_structure = null;
oFF.SxJsonDp.prototype.m_tagging = null;
oFF.SxJsonDp.prototype.convertArray = function(name)
{
	let index = -1;
	if (oFF.XString.startsWith(name, "(") && oFF.XString.endsWith(name, " )"))
	{
		let size = oFF.XString.size(name);
		let indexValue = oFF.XString.substring(name, 1, size - 2);
		index = oFF.XInteger.convertFromStringWithDefault(indexValue, -1);
	}
	return index;
};
oFF.SxJsonDp.prototype.getComponentType = function()
{
	return oFF.QuasarComponentType.JSON_DATA_PROVIDER;
};
oFF.SxJsonDp.prototype.getDataProviderName = function()
{
	return this.m_name;
};
oFF.SxJsonDp.prototype.getElementByPath = function(path)
{
	let pathFragments = oFF.XStringTokenizer.splitString(path, "/");
	let currentElement = this.m_structure;
	let i = 0;
	for (; i < pathFragments.size() && oFF.notNull(currentElement); i++)
	{
		let name = pathFragments.get(i);
		let type = currentElement.getType();
		if (type === oFF.PrElementType.LIST)
		{
			let currentList = currentElement;
			let index = this.convertArray(name);
			if (index >= 0 && index < currentList.size())
			{
				currentElement = currentList.get(index);
			}
			else
			{
				currentElement = null;
			}
		}
		else if (type === oFF.PrElementType.STRUCTURE)
		{
			let currentStructure = currentElement;
			currentElement = currentStructure.getByKey(name);
		}
		else
		{
			currentElement = null;
		}
	}
	let found = null;
	if (i === pathFragments.size() && oFF.notNull(currentElement))
	{
		found = currentElement;
	}
	return found;
};
oFF.SxJsonDp.prototype.getTagging = function()
{
	return this.m_tagging;
};
oFF.SxJsonDp.prototype.setDataProviderName = function(name)
{
	this.m_name = name;
};
oFF.SxJsonDp.prototype.setElementByPath = function(path, element)
{
	let name;
	let type;
	let currentList;
	let currentStructure;
	let index;
	let pathFragments = oFF.XStringTokenizer.splitString(path, "/");
	let currentElement = this.m_structure;
	let i = 0;
	for (; i < pathFragments.size() - 1 && oFF.notNull(currentElement); i++)
	{
		name = pathFragments.get(i);
		type = currentElement.getType();
		if (type === oFF.PrElementType.LIST)
		{
			currentList = currentElement;
			index = this.convertArray(name);
			if (index >= 0 && index < currentList.size())
			{
				currentElement = currentList.get(index);
			}
			else
			{
				currentElement = null;
			}
		}
		else if (type === oFF.PrElementType.STRUCTURE)
		{
			currentStructure = currentElement;
			currentElement = currentStructure.getByKey(name);
		}
		else
		{
			currentElement = null;
		}
	}
	if (oFF.notNull(currentElement))
	{
		name = pathFragments.get(i);
		type = currentElement.getType();
		if (type === oFF.PrElementType.LIST)
		{
			currentList = currentElement;
			index = this.convertArray(name);
			if (index >= 0 && index < currentList.size())
			{
				currentElement = currentList.get(index);
			}
			else
			{
				currentElement = null;
			}
		}
		else if (type === oFF.PrElementType.STRUCTURE)
		{
			currentStructure = currentElement;
			currentElement = currentStructure.getByKey(name);
		}
	}
};

oFF.SxJsonDpBindingReceiver = function() {};
oFF.SxJsonDpBindingReceiver.prototype = new oFF.XObject();
oFF.SxJsonDpBindingReceiver.prototype._ff_c = "SxJsonDpBindingReceiver";

oFF.SxJsonDpBindingReceiver.create = function(dp, path)
{
	let receiver = new oFF.SxJsonDpBindingReceiver();
	receiver.m_dp = dp;
	receiver.m_path = path;
	return receiver;
};
oFF.SxJsonDpBindingReceiver.prototype.m_dp = null;
oFF.SxJsonDpBindingReceiver.prototype.m_path = null;
oFF.SxJsonDpBindingReceiver.prototype.getComponentType = function()
{
	return oFF.IoComponentType.BINDING_RECEIVER;
};
oFF.SxJsonDpBindingReceiver.prototype.getInteger = function()
{
	let element = this.m_dp.getElementByPath(this.m_path);
	if (oFF.notNull(element))
	{
		let type = element.getType();
		if (type === oFF.PrElementType.INTEGER)
		{
			return element.getInteger();
		}
	}
	return 0;
};
oFF.SxJsonDpBindingReceiver.prototype.getString = function()
{
	let element = this.m_dp.getElementByPath(this.m_path);
	if (oFF.notNull(element))
	{
		let type = element.getType();
		if (type === oFF.PrElementType.STRING)
		{
			return element.getString();
		}
	}
	return null;
};
oFF.SxJsonDpBindingReceiver.prototype.isReceiverReady = function()
{
	return true;
};
oFF.SxJsonDpBindingReceiver.prototype.registerReceiverReadyListener = function(listener, customIdentifier) {};
oFF.SxJsonDpBindingReceiver.prototype.setDataManifest = function(dataManifest) {};
oFF.SxJsonDpBindingReceiver.prototype.setElement = function(element)
{
	this.m_dp.setElementByPath(this.m_path, element);
};
oFF.SxJsonDpBindingReceiver.prototype.setInteger = function(value)
{
	let element = oFF.PrFactory.createInteger(value);
	this.setElement(element);
};
oFF.SxJsonDpBindingReceiver.prototype.setString = function(value)
{
	let element = oFF.PrFactory.createString(value);
	this.setElement(element);
};
oFF.SxJsonDpBindingReceiver.prototype.unregisterReceiverReadyListener = function(listener) {};

oFF.SxJsonDpBindingSender = function() {};
oFF.SxJsonDpBindingSender.prototype = new oFF.XObject();
oFF.SxJsonDpBindingSender.prototype._ff_c = "SxJsonDpBindingSender";

oFF.SxJsonDpBindingSender.create = function(dp, path)
{
	let sender = new oFF.SxJsonDpBindingSender();
	sender.m_dp = dp;
	sender.m_path = path;
	return sender;
};
oFF.SxJsonDpBindingSender.prototype.m_dp = null;
oFF.SxJsonDpBindingSender.prototype.m_path = null;
oFF.SxJsonDpBindingSender.prototype.getComponentType = function()
{
	return oFF.IoComponentType.BINDING_SENDER;
};
oFF.SxJsonDpBindingSender.prototype.getDataManifest = function()
{
	return null;
};
oFF.SxJsonDpBindingSender.prototype.getElement = function()
{
	return this.m_dp.getElementByPath(this.m_path);
};
oFF.SxJsonDpBindingSender.prototype.getInteger = function()
{
	let element = this.getElement();
	if (oFF.notNull(element) && element.getType() === oFF.PrElementType.INTEGER)
	{
		return element.getInteger();
	}
	return 0;
};
oFF.SxJsonDpBindingSender.prototype.getString = function()
{
	let element = this.getElement();
	if (oFF.notNull(element) && element.getType() === oFF.PrElementType.STRING)
	{
		return element.getString();
	}
	return null;
};
oFF.SxJsonDpBindingSender.prototype.isSenderValueReady = function()
{
	return true;
};
oFF.SxJsonDpBindingSender.prototype.processSenderUpdate = function() {};
oFF.SxJsonDpBindingSender.prototype.registerValueChangedListener = function(listener, customIdentifier) {};
oFF.SxJsonDpBindingSender.prototype.unregisterValueChangedListener = function(listener) {};

oFF.SxRestDp = function() {};
oFF.SxRestDp.prototype = new oFF.XObject();
oFF.SxRestDp.prototype._ff_c = "SxRestDp";

oFF.SxRestDp.prototype.m_application = null;
oFF.SxRestDp.prototype.m_dataRetrieved = false;
oFF.SxRestDp.prototype.m_dataUpdateListener = null;
oFF.SxRestDp.prototype.m_httpClient = null;
oFF.SxRestDp.prototype.m_name = null;
oFF.SxRestDp.prototype.m_structure = null;
oFF.SxRestDp.prototype.m_tagging = null;
oFF.SxRestDp.prototype.convertArray = function(name)
{
	let index = -1;
	if (oFF.XString.startsWith(name, "(") && oFF.XString.endsWith(name, " )"))
	{
		let size = oFF.XString.size(name);
		let indexValue = oFF.XString.substring(name, 1, size - 2);
		index = oFF.XInteger.convertFromStringWithDefault(indexValue, -1);
	}
	return index;
};
oFF.SxRestDp.prototype.getComponentType = function()
{
	return oFF.QuasarComponentType.REST_DATA_PROVIDER;
};
oFF.SxRestDp.prototype.getDataProviderName = function()
{
	return this.m_name;
};
oFF.SxRestDp.prototype.getElementByPath = function(path)
{
	let pathFragments = oFF.XStringTokenizer.splitString(path, "/");
	let currentElement = this.m_structure;
	let i = 0;
	for (; i < pathFragments.size() && oFF.notNull(currentElement); i++)
	{
		let name = pathFragments.get(i);
		let type = currentElement.getType();
		if (type === oFF.PrElementType.LIST)
		{
			let currentList = currentElement;
			let index = this.convertArray(name);
			if (index >= 0 && index < currentList.size())
			{
				currentElement = currentList.get(index);
			}
			else
			{
				currentElement = null;
			}
		}
		else if (type === oFF.PrElementType.STRUCTURE)
		{
			let currentStructure = currentElement;
			currentElement = currentStructure.getByKey(name);
		}
		else
		{
			currentElement = null;
		}
	}
	let found = null;
	if (i === pathFragments.size() && oFF.notNull(currentElement))
	{
		found = currentElement;
	}
	return found;
};
oFF.SxRestDp.prototype.getTagging = function()
{
	return this.m_tagging;
};
oFF.SxRestDp.prototype.isDataReady = function()
{
	return this.m_dataRetrieved;
};
oFF.SxRestDp.prototype.onHttpResponse = function(extResult, response, customIdentifier)
{
	if (extResult.isValid())
	{
		let data = extResult.getData();
		if (oFF.notNull(data))
		{
			let jsonContent = data.getJsonContent();
			if (oFF.notNull(jsonContent))
			{
				this.m_structure = jsonContent.asStructure();
				this.m_dataRetrieved = true;
				if (oFF.notNull(this.m_dataUpdateListener))
				{
					this.m_dataUpdateListener.onRestDataUpdate(this.m_structure, null);
				}
			}
		}
	}
};
oFF.SxRestDp.prototype.registerDataUpdate = function(listener)
{
	this.m_dataUpdateListener = listener;
};
oFF.SxRestDp.prototype.releaseObject = function()
{
	this.m_application.unregisterDataProvider(this);
	this.m_application = null;
	this.m_httpClient = oFF.XObjectExt.release(this.m_httpClient);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.SxRestDp.prototype.setDataProviderName = function(name)
{
	this.m_name = name;
};
oFF.SxRestDp.prototype.setElementByPath = function(path, element)
{
	let name;
	let type;
	let currentList;
	let currentStructure;
	let index;
	let pathFragments = oFF.XStringTokenizer.splitString(path, "/");
	let currentElement = this.m_structure;
	let i = 0;
	for (; i < pathFragments.size() - 1 && oFF.notNull(currentElement); i++)
	{
		name = pathFragments.get(i);
		type = currentElement.getType();
		if (type === oFF.PrElementType.LIST)
		{
			currentList = currentElement;
			index = this.convertArray(name);
			if (index >= 0 && index < currentList.size())
			{
				currentElement = currentList.get(index);
			}
			else
			{
				currentElement = null;
			}
		}
		else if (type === oFF.PrElementType.STRUCTURE)
		{
			currentStructure = currentElement;
			currentElement = currentStructure.getByKey(name);
		}
		else
		{
			currentElement = null;
		}
	}
	if (oFF.notNull(currentElement))
	{
		name = pathFragments.get(i);
		type = currentElement.getType();
		if (type === oFF.PrElementType.LIST)
		{
			currentList = currentElement;
			index = this.convertArray(name);
			if (index >= 0 && index < currentList.size())
			{
				currentElement = currentList.get(index);
			}
			else
			{
				currentElement = null;
			}
		}
		else if (type === oFF.PrElementType.STRUCTURE)
		{
			currentStructure = currentElement;
			currentElement = currentStructure.getByKey(name);
		}
	}
};
oFF.SxRestDp.prototype.setEndpointUrl = function(endpointUrl)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(endpointUrl))
	{
		let endpointUri = oFF.XUri.createFromUrl(endpointUrl);
		if (oFF.notNull(endpointUri))
		{
			this.m_httpClient = oFF.HttpClientFactory.newInstanceByConnection(this.m_application.getSession(), endpointUri);
			if (oFF.notNull(this.m_httpClient))
			{
				let request = this.m_httpClient.getRequest();
				request.setFromUri(endpointUri);
				request.setCorsSecured(false);
			}
		}
	}
};
oFF.SxRestDp.prototype.setupExt = function(name, endpointUrl, application)
{
	this.setup();
	this.m_application = application;
	this.m_dataRetrieved = false;
	this.m_structure = oFF.PrStructure.create();
	this.setDataProviderName(name);
	this.setEndpointUrl(endpointUrl);
	this.m_application.registerDataProvider(this);
};
oFF.SxRestDp.prototype.updateData = function()
{
	if (oFF.notNull(this.m_httpClient))
	{
		this.m_httpClient.processHttpRequest(oFF.SyncType.NON_BLOCKING, this, null);
	}
};

oFF.SxRestDpBindingSender = function() {};
oFF.SxRestDpBindingSender.prototype = new oFF.XObject();
oFF.SxRestDpBindingSender.prototype._ff_c = "SxRestDpBindingSender";

oFF.SxRestDpBindingSender.create = function(dp, path)
{
	let sender = new oFF.SxRestDpBindingSender();
	sender.m_dp = dp;
	sender.m_path = path;
	dp.registerDataUpdate(sender);
	return sender;
};
oFF.SxRestDpBindingSender.prototype.m_dp = null;
oFF.SxRestDpBindingSender.prototype.m_path = null;
oFF.SxRestDpBindingSender.prototype.m_valueChangedListener = null;
oFF.SxRestDpBindingSender.prototype.getComponentType = function()
{
	return oFF.IoComponentType.BINDING_SENDER;
};
oFF.SxRestDpBindingSender.prototype.getDataManifest = function()
{
	return null;
};
oFF.SxRestDpBindingSender.prototype.getElement = function()
{
	return this.m_dp.getElementByPath(this.m_path);
};
oFF.SxRestDpBindingSender.prototype.getInteger = function()
{
	let element = this.getElement();
	if (oFF.notNull(element) && element.getType() === oFF.PrElementType.INTEGER)
	{
		return element.getInteger();
	}
	return 0;
};
oFF.SxRestDpBindingSender.prototype.getString = function()
{
	let element = this.getElement();
	if (oFF.notNull(element))
	{
		if (element.getType() === oFF.PrElementType.STRING)
		{
			return element.getString();
		}
		else
		{
			let convertedToString = element.asString();
			if (oFF.notNull(convertedToString))
			{
				return convertedToString.getString();
			}
		}
	}
	return null;
};
oFF.SxRestDpBindingSender.prototype.isSenderValueReady = function()
{
	return this.m_dp.isDataReady();
};
oFF.SxRestDpBindingSender.prototype.onRestDataUpdate = function(restData, customIdentifier)
{
	if (oFF.notNull(this.m_valueChangedListener))
	{
		this.m_valueChangedListener.onSenderValueChanged(this, null);
	}
};
oFF.SxRestDpBindingSender.prototype.processSenderUpdate = function()
{
	this.m_dp.updateData();
};
oFF.SxRestDpBindingSender.prototype.registerValueChangedListener = function(listener, customIdentifier)
{
	this.m_valueChangedListener = listener;
};
oFF.SxRestDpBindingSender.prototype.unregisterValueChangedListener = function(listener) {};

oFF.UiBindingReceiveJson = function() {};
oFF.UiBindingReceiveJson.prototype = new oFF.UiBinding();
oFF.UiBindingReceiveJson.prototype._ff_c = "UiBindingReceiveJson";

oFF.UiBindingReceiveJson.create = function(context)
{
	let newObj = new oFF.UiBindingReceiveJson();
	newObj.setupExt(context);
	return newObj;
};
oFF.UiBindingReceiveJson.prototype.getComponentType = function()
{
	return oFF.IoComponentType.BINDING_RECEIVER;
};
oFF.UiBindingReceiveJson.prototype.setDataManifest = function(dataManifest)
{
	let uiContext = this.getUiContext();
	if (oFF.notNull(uiContext))
	{
		uiContext.setDataManifest(dataManifest);
	}
};
oFF.UiBindingReceiveJson.prototype.setElement = function(element)
{
	let uiContext = this.getUiContext();
	if (oFF.notNull(uiContext))
	{
		uiContext.setModelJson(element);
	}
};

oFF.UiBindingReceivePropJson = function() {};
oFF.UiBindingReceivePropJson.prototype = new oFF.UiBinding();
oFF.UiBindingReceivePropJson.prototype._ff_c = "UiBindingReceivePropJson";

oFF.UiBindingReceivePropJson.create = function(context, clientOp)
{
	let newObj = new oFF.UiBindingReceivePropJson();
	newObj.setupExt(context);
	newObj.m_clientOp = clientOp;
	return newObj;
};
oFF.UiBindingReceivePropJson.prototype.m_clientOp = null;
oFF.UiBindingReceivePropJson.prototype.getComponentType = function()
{
	return oFF.IoComponentType.BINDING_RECEIVER;
};
oFF.UiBindingReceivePropJson.prototype.setDataManifest = function(dataManifest) {};
oFF.UiBindingReceivePropJson.prototype.setElement = function(element)
{
	let uiContext = this.getUiContext();
	if (oFF.notNull(uiContext) && oFF.notNull(this.m_clientOp))
	{
		this.m_clientOp.setJsonValue(uiContext, element);
	}
};

oFF.UiBindingReceivePropString = function() {};
oFF.UiBindingReceivePropString.prototype = new oFF.UiBinding();
oFF.UiBindingReceivePropString.prototype._ff_c = "UiBindingReceivePropString";

oFF.UiBindingReceivePropString.create = function(context, clientOp)
{
	let newObj = new oFF.UiBindingReceivePropString();
	newObj.setupExt(context);
	newObj.m_clientOp = clientOp;
	return newObj;
};
oFF.UiBindingReceivePropString.prototype.m_clientOp = null;
oFF.UiBindingReceivePropString.prototype.getComponentType = function()
{
	return oFF.IoComponentType.BINDING_RECEIVER;
};
oFF.UiBindingReceivePropString.prototype.getString = function()
{
	let uiContext = this.getUiContext();
	if (oFF.isNull(uiContext))
	{
		return null;
	}
	return this.m_clientOp.getString(uiContext);
};
oFF.UiBindingReceivePropString.prototype.setDataManifest = function(dataManifest) {};
oFF.UiBindingReceivePropString.prototype.setString = function(value)
{
	let uiContext = this.getUiContext();
	if (oFF.notNull(uiContext) && oFF.notNull(this.m_clientOp))
	{
		this.m_clientOp.setString(uiContext, value);
	}
};

oFF.UiBindingReceiveText = function() {};
oFF.UiBindingReceiveText.prototype = new oFF.UiBinding();
oFF.UiBindingReceiveText.prototype._ff_c = "UiBindingReceiveText";

oFF.UiBindingReceiveText.create = function(context)
{
	let newObj = new oFF.UiBindingReceiveText();
	newObj.setupExt(context);
	return newObj;
};
oFF.UiBindingReceiveText.prototype.getComponentType = function()
{
	return oFF.IoComponentType.BINDING_RECEIVER;
};
oFF.UiBindingReceiveText.prototype.getString = function()
{
	let uiContext = this.getUiContext();
	if (oFF.isNull(uiContext))
	{
		return null;
	}
	return uiContext.getText();
};
oFF.UiBindingReceiveText.prototype.setDataManifest = function(dataManifest) {};
oFF.UiBindingReceiveText.prototype.setString = function(value)
{
	let uiContext = this.getUiContext();
	if (oFF.notNull(uiContext))
	{
		uiContext.setText(value);
	}
};

oFF.UiBindingSendPropJson = function() {};
oFF.UiBindingSendPropJson.prototype = new oFF.XObject();
oFF.UiBindingSendPropJson.prototype._ff_c = "UiBindingSendPropJson";

oFF.UiBindingSendPropJson.create = function(context, clientOp)
{
	let newObj = new oFF.UiBindingSendPropJson();
	newObj.m_context = context;
	newObj.m_clientOp = clientOp;
	return newObj;
};
oFF.UiBindingSendPropJson.prototype.m_clientOp = null;
oFF.UiBindingSendPropJson.prototype.m_context = null;
oFF.UiBindingSendPropJson.prototype.m_customIdentifier = null;
oFF.UiBindingSendPropJson.prototype.m_listener = null;
oFF.UiBindingSendPropJson.prototype.getComponentType = function()
{
	return oFF.IoComponentType.BINDING_SENDER;
};
oFF.UiBindingSendPropJson.prototype.getDataManifest = function()
{
	return null;
};
oFF.UiBindingSendPropJson.prototype.getElement = function()
{
	let jsonValue = this.m_clientOp.getJsonValue(this.m_context);
	return jsonValue;
};
oFF.UiBindingSendPropJson.prototype.isSenderValueReady = function()
{
	return true;
};
oFF.UiBindingSendPropJson.prototype.onChange = function(event)
{
	if (oFF.notNull(this.m_listener))
	{
		this.m_listener.onSenderValueChanged(this, this.m_customIdentifier);
	}
};
oFF.UiBindingSendPropJson.prototype.processSenderUpdate = function() {};
oFF.UiBindingSendPropJson.prototype.registerValueChangedListener = function(listener, customIdentifier)
{
	this.m_listener = listener;
	this.m_customIdentifier = customIdentifier;
	this.m_context.registerOnChange(this);
};
oFF.UiBindingSendPropJson.prototype.releaseObject = function()
{
	this.m_context = null;
	this.m_listener = null;
	this.m_customIdentifier = null;
	this.m_clientOp = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.UiBindingSendPropJson.prototype.unregisterValueChangedListener = function(listener)
{
	this.m_context.registerOnChange(null);
	this.m_listener = null;
	this.m_customIdentifier = null;
};

oFF.UiBindingSendPropString = function() {};
oFF.UiBindingSendPropString.prototype = new oFF.XObject();
oFF.UiBindingSendPropString.prototype._ff_c = "UiBindingSendPropString";

oFF.UiBindingSendPropString.create = function(context, clientOp)
{
	let newObj = new oFF.UiBindingSendPropString();
	newObj.m_context = context;
	newObj.m_clientOp = clientOp;
	return newObj;
};
oFF.UiBindingSendPropString.prototype.m_clientOp = null;
oFF.UiBindingSendPropString.prototype.m_context = null;
oFF.UiBindingSendPropString.prototype.m_customIdentifier = null;
oFF.UiBindingSendPropString.prototype.m_listener = null;
oFF.UiBindingSendPropString.prototype.getComponentType = function()
{
	return oFF.IoComponentType.BINDING_SENDER;
};
oFF.UiBindingSendPropString.prototype.getDataManifest = function()
{
	return null;
};
oFF.UiBindingSendPropString.prototype.getString = function()
{
	let value = this.m_clientOp.getString(this.m_context);
	return value;
};
oFF.UiBindingSendPropString.prototype.isSenderValueReady = function()
{
	return true;
};
oFF.UiBindingSendPropString.prototype.onChange = function(event)
{
	if (oFF.notNull(this.m_listener))
	{
		this.m_listener.onSenderValueChanged(this, this.m_customIdentifier);
	}
};
oFF.UiBindingSendPropString.prototype.processSenderUpdate = function() {};
oFF.UiBindingSendPropString.prototype.registerValueChangedListener = function(listener, customIdentifier)
{
	this.m_listener = listener;
	this.m_customIdentifier = customIdentifier;
	this.m_context.registerOnChange(this);
};
oFF.UiBindingSendPropString.prototype.releaseObject = function()
{
	this.m_context = null;
	this.m_listener = null;
	this.m_customIdentifier = null;
	this.m_clientOp = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.UiBindingSendPropString.prototype.unregisterValueChangedListener = function(listener)
{
	this.m_context.registerOnChange(null);
	this.m_listener = null;
	this.m_customIdentifier = null;
};

oFF.UiBindingSendText = function() {};
oFF.UiBindingSendText.prototype = new oFF.XObject();
oFF.UiBindingSendText.prototype._ff_c = "UiBindingSendText";

oFF.UiBindingSendText.create = function(context)
{
	let newObj = new oFF.UiBindingSendText();
	newObj.m_context = context;
	return newObj;
};
oFF.UiBindingSendText.prototype.m_context = null;
oFF.UiBindingSendText.prototype.m_customIdentifier = null;
oFF.UiBindingSendText.prototype.m_listener = null;
oFF.UiBindingSendText.prototype.getComponentType = function()
{
	return oFF.IoComponentType.BINDING_SENDER;
};
oFF.UiBindingSendText.prototype.getDataManifest = function()
{
	return null;
};
oFF.UiBindingSendText.prototype.getString = function()
{
	return this.m_context.getText();
};
oFF.UiBindingSendText.prototype.isSenderValueReady = function()
{
	return true;
};
oFF.UiBindingSendText.prototype.onChange = function(event)
{
	if (oFF.notNull(this.m_listener))
	{
		this.m_listener.onSenderValueChanged(this, this.m_customIdentifier);
	}
};
oFF.UiBindingSendText.prototype.processSenderUpdate = function() {};
oFF.UiBindingSendText.prototype.registerValueChangedListener = function(listener, customIdentifier)
{
	this.m_listener = listener;
	this.m_customIdentifier = customIdentifier;
	this.m_context.registerOnChange(this);
};
oFF.UiBindingSendText.prototype.releaseObject = function()
{
	this.m_context = null;
	this.m_listener = null;
	this.m_customIdentifier = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.UiBindingSendText.prototype.unregisterValueChangedListener = function(listener)
{
	this.m_context.registerOnChange(null);
	this.m_listener = null;
	this.m_customIdentifier = null;
};

oFF.SiProject = function() {};
oFF.SiProject.prototype = new oFF.DfNameObject();
oFF.SiProject.prototype._ff_c = "SiProject";

oFF.SiProject.create = function(name)
{
	let newObj = new oFF.SiProject();
	newObj._setupInternal(name);
	return newObj;
};
oFF.SiProject.prototype.m_compilationUnits = null;
oFF.SiProject.prototype.load = function(file)
{
	let content = file.load();
	let code = content.getString();
	let name = file.getName();
	this.m_compilationUnits.put(name, code);
	this.logMulti("Parsing ").append(file.getNativePath()).flush();
	let parser = oFF.SiParser2.create();
	parser.parse(code, 10);
};
oFF.SiProject.prototype.setup = function()
{
	oFF.DfNameObject.prototype.setup.call( this );
	this.m_compilationUnits = oFF.XHashMapByString.create();
};

oFF.ScriptEngine = function() {};
oFF.ScriptEngine.prototype = new oFF.MessageManager();
oFF.ScriptEngine.prototype._ff_c = "ScriptEngine";

oFF.ScriptEngine.create = function()
{
	let interpreter = new oFF.ScriptEngine();
	interpreter.setupInterpreter(null, true);
	return interpreter;
};
oFF.ScriptEngine.prototype.m_ast = null;
oFF.ScriptEngine.prototype.m_useNewParser = false;
oFF.ScriptEngine.prototype.m_virtualMachine = null;
oFF.ScriptEngine.prototype.compile = function(script)
{
	let parser;
	if (this.m_useNewParser)
	{
		parser = oFF.SiParser2.create();
	}
	else
	{
		parser = oFF.SiParser.create();
	}
	this.m_ast = parser.parse(script, -1);
	this.addAllMessages(parser);
	if (this.isValid())
	{
		this.m_virtualMachine.setRoot(this.m_ast);
	}
};
oFF.ScriptEngine.prototype.compileAllProjects = function(projectPath, outputPath)
{
	let session = oFF.DefaultSession.create();
	let file = oFF.XFile.createWithVars(session, projectPath);
	this.loadProjects(file);
};
oFF.ScriptEngine.prototype.compileAndExecute = function(script)
{
	this.compile(script);
	this.execute();
};
oFF.ScriptEngine.prototype.execute = function()
{
	this.m_virtualMachine.execute();
};
oFF.ScriptEngine.prototype.getAstAsJson = function()
{
	if (this.isValid())
	{
		return this.m_virtualMachine.getAstAsJson();
	}
	return "";
};
oFF.ScriptEngine.prototype.getAstRoot = function()
{
	return this.m_ast;
};
oFF.ScriptEngine.prototype.getCustomObject = function(name)
{
	return this.m_virtualMachine.getCustomObject(name);
};
oFF.ScriptEngine.prototype.getStateAsJson = function()
{
	return this.m_virtualMachine.getStateAsJson();
};
oFF.ScriptEngine.prototype.loadProjects = function(file)
{
	if (file.isDirectory() === true)
	{
		let children = file.getChildren();
		for (let i = 0; i < children.size(); i++)
		{
			let childFile = children.get(i);
			let projectName = childFile.getName();
			let project = oFF.SiProject.create(projectName);
			let javaFolder = childFile.newChild("java");
			this.log(projectName);
			this.loadRecursive(project, javaFolder);
		}
	}
};
oFF.ScriptEngine.prototype.loadRecursive = function(project, file)
{
	if (file.isDirectory() === true)
	{
		let children = file.getChildren();
		for (let i = 0; i < children.size(); i++)
		{
			let childFile = children.get(i);
			this.loadRecursive(project, childFile);
		}
	}
	else
	{
		let name = file.getName();
		if (oFF.XString.endsWith(name, ".java"))
		{
			project.load(file);
		}
	}
};
oFF.ScriptEngine.prototype.setCustomObject = function(name, value)
{
	this.m_virtualMachine.setCustomObject(name, value);
};
oFF.ScriptEngine.prototype.setInitialRegister = function(obj)
{
	this.m_virtualMachine.setInitialRegister(obj);
};
oFF.ScriptEngine.prototype.setVmCallback = function(callback)
{
	this.m_virtualMachine.setVmCallback(callback);
};
oFF.ScriptEngine.prototype.setupInterpreter = function(session, useNewParser)
{
	oFF.MessageManager.prototype.setupSessionContext.call( this , session);
	this.m_virtualMachine = oFF.SiInterpreter.create();
	this.m_useNewParser = useNewParser;
};
oFF.ScriptEngine.prototype.toString = function()
{
	if (this.isValid())
	{
		return this.m_virtualMachine.toString();
	}
	return oFF.MessageManager.prototype.toString.call( this );
};

oFF.SiInterpreter = function() {};
oFF.SiInterpreter.prototype = new oFF.MessageManager();
oFF.SiInterpreter.prototype._ff_c = "SiInterpreter";

oFF.SiInterpreter.create = function()
{
	let interpreter = new oFF.SiInterpreter();
	interpreter.setupSessionContext(null);
	return interpreter;
};
oFF.SiInterpreter.prototype.m_callback = null;
oFF.SiInterpreter.prototype.m_customObjects = null;
oFF.SiInterpreter.prototype.m_register = null;
oFF.SiInterpreter.prototype.m_registerHandler = null;
oFF.SiInterpreter.prototype.m_root = null;
oFF.SiInterpreter.prototype.m_savedRegisters = null;
oFF.SiInterpreter.prototype.m_stack = null;
oFF.SiInterpreter.prototype.m_variables = null;
oFF.SiInterpreter.prototype.afterScriptExecution = oFF.noSupport;
oFF.SiInterpreter.prototype.beforeScriptExecution = oFF.noSupport;
oFF.SiInterpreter.prototype.execute = function()
{
	if (this.isValid() && oFF.notNull(this.m_root))
	{
		this.m_stack = oFF.XList.create();
		this.m_register = null;
		this.m_callback.beforeScriptExecution(this);
		this.runOperations(this.m_root);
		this.m_callback.afterScriptExecution(this);
		this.m_stack = null;
		this.m_register = null;
	}
};
oFF.SiInterpreter.prototype.getAstAsJson = function()
{
	if (this.isValid() && oFF.notNull(this.m_root))
	{
		return this.m_root.toJson();
	}
	return "";
};
oFF.SiInterpreter.prototype.getAstRoot = function()
{
	return this.m_root;
};
oFF.SiInterpreter.prototype.getCustomObject = function(name)
{
	return this.m_customObjects.getByKey(name);
};
oFF.SiInterpreter.prototype.getRegister = function()
{
	return this.m_register;
};
oFF.SiInterpreter.prototype.getStack = function()
{
	return this.m_stack;
};
oFF.SiInterpreter.prototype.getStateAsJson = function()
{
	let buffer = oFF.XStringBufferJson.create();
	let keyList = oFF.XList.createWithList(this.m_variables.getKeysAsReadOnlyList());
	keyList.sortByDirection(oFF.XSortDirection.ASCENDING);
	let keys = keyList.getIterator();
	while (keys.hasNext() === true)
	{
		let key = keys.next();
		let object = this.m_variables.getByKey(key);
		buffer.appendLabelAndString(key, object.toString());
	}
	return buffer.toString();
};
oFF.SiInterpreter.prototype.nativeCall = function(interpreter, name, registerObj, stack, parameterCount)
{
	let offset = stack.size() - parameterCount;
	let param0 = stack.get(offset);
	let type0 = param0.getComponentType();
	let param1 = stack.get(offset + 1);
	let type1 = param1.getComponentType();
	let result = null;
	if (oFF.XString.isEqual(oFF.SiTokenType._OP_PLUS, name) || oFF.XString.isEqual(oFF.SiTokenType._OP_MINUS, name) || oFF.XString.isEqual(oFF.SiTokenType._OP_MULT, name) || oFF.XString.isEqual(oFF.SiTokenType._OP_DIV, name))
	{
		if (type0 === oFF.XValueType.INTEGER && type1 === oFF.XValueType.INTEGER)
		{
			let left = param0.getInteger();
			let right = param1.getInteger();
			if (oFF.XString.isEqual(oFF.SiTokenType._OP_PLUS, name))
			{
				result = oFF.XIntegerValue.create(left + right);
			}
			else if (oFF.XString.isEqual(oFF.SiTokenType._OP_MINUS, name))
			{
				result = oFF.XIntegerValue.create(left - right);
			}
			else if (oFF.XString.isEqual(oFF.SiTokenType._OP_MULT, name))
			{
				result = oFF.XIntegerValue.create(left * right);
			}
			else if (oFF.XString.isEqual(oFF.SiTokenType._OP_DIV, name))
			{
				result = oFF.XIntegerValue.create(left / right);
			}
		}
		else
		{
			let left2 = 0.0;
			let right2 = 0.0;
			if (type0 === oFF.XValueType.DOUBLE && type1 === oFF.XValueType.DOUBLE)
			{
				left2 = param0.getDouble();
				right2 = param1.getDouble();
			}
			else if (type0 === oFF.XValueType.DOUBLE && type1 === oFF.XValueType.INTEGER)
			{
				left2 = param0.getDouble();
				right2 = param1.getInteger();
			}
			else if (type0 === oFF.XValueType.INTEGER && type1 === oFF.XValueType.DOUBLE)
			{
				left2 = param0.getInteger();
				right2 = param1.getDouble();
			}
			if (oFF.XString.isEqual(oFF.SiTokenType._OP_PLUS, name))
			{
				result = oFF.XDoubleValue.create(left2 + right2);
			}
			else if (oFF.XString.isEqual(oFF.SiTokenType._OP_MINUS, name))
			{
				result = oFF.XDoubleValue.create(left2 - right2);
			}
			else if (oFF.XString.isEqual(oFF.SiTokenType._OP_MULT, name))
			{
				result = oFF.XDoubleValue.create(left2 * right2);
			}
			else if (oFF.XString.isEqual(oFF.SiTokenType._OP_DIV, name))
			{
				result = oFF.XDoubleValue.create(left2 / right2);
			}
		}
	}
	else if (oFF.XString.isEqual(oFF.SiTokenType._OP_EQUAL, name) || oFF.XString.isEqual(oFF.SiTokenType._OP_NOT_EQUAL, name) || oFF.XString.isEqual(oFF.SiTokenType._OP_LOWER, name) || oFF.XString.isEqual(oFF.SiTokenType._OP_LOWER_EQUAL, name) || oFF.XString.isEqual(oFF.SiTokenType._OP_GREATER, name) || oFF.XString.isEqual(oFF.SiTokenType._OP_GREATER_EQUAL, name))
	{
		if (type0 === oFF.XValueType.INTEGER && type1 === oFF.XValueType.INTEGER)
		{
			let left3 = param0.getInteger();
			let right3 = param1.getInteger();
			if (oFF.XString.isEqual(oFF.SiTokenType._OP_EQUAL, name))
			{
				result = oFF.XBooleanValue.create(left3 === right3);
			}
			else if (oFF.XString.isEqual(oFF.SiTokenType._OP_NOT_EQUAL, name))
			{
				result = oFF.XBooleanValue.create(left3 !== right3);
			}
			else if (oFF.XString.isEqual(oFF.SiTokenType._OP_LOWER, name))
			{
				result = oFF.XBooleanValue.create(left3 < right3);
			}
			else if (oFF.XString.isEqual(oFF.SiTokenType._OP_LOWER_EQUAL, name))
			{
				result = oFF.XBooleanValue.create(left3 <= right3);
			}
			else if (oFF.XString.isEqual(oFF.SiTokenType._OP_GREATER, name))
			{
				result = oFF.XBooleanValue.create(left3 > right3);
			}
			else if (oFF.XString.isEqual(oFF.SiTokenType._OP_GREATER_EQUAL, name))
			{
				result = oFF.XBooleanValue.create(left3 >= right3);
			}
		}
	}
	if (oFF.isNull(result))
	{
		result = oFF.XStringValue.create(oFF.XStringUtils.concatenate2("MyFuncResult", name));
	}
	return result;
};
oFF.SiInterpreter.prototype.pop = function(interpreter, number)
{
	let offset = this.m_stack.size() - number;
	for (let i = 0; i < number; i++)
	{
		this.m_stack.removeAt(offset);
	}
};
oFF.SiInterpreter.prototype.pushRegisterOnStack = function(interpreter)
{
	this.m_stack.add(this.m_register);
};
oFF.SiInterpreter.prototype.pushRegisterToMemory = function(interpreter, varName)
{
	this.m_variables.put(varName, this.m_register);
};
oFF.SiInterpreter.prototype.runOperations = function(token)
{
	if (oFF.notNull(token))
	{
		let type = token.getType();
		let children = token.getChildren();
		let value = token.getValue();
		if (type === oFF.SiTokenType.CURLY_BRACKET)
		{
			for (let i = 0; i < children.size(); i++)
			{
				let child = children.get(i);
				this.runOperations(child);
			}
		}
		else if (type === oFF.SiTokenType.EXPR_SEQ)
		{
			for (let j = 0; j < children.size(); j++)
			{
				this.runOperations(children.get(j));
			}
		}
		else if (type === oFF.SiTokenType.FUNCTION)
		{
			let parameterCount = 0;
			if (oFF.notNull(children))
			{
				parameterCount = children.size();
				if (parameterCount > 0)
				{
					this.m_registerHandler.pushRegisterOnStack(this);
					for (let k = 0; k < parameterCount; k++)
					{
						let current = children.get(k);
						this.runOperations(current);
						this.m_registerHandler.pushRegisterOnStack(this);
					}
					this.m_registerHandler.setStackToRegister(this, parameterCount);
				}
			}
			let returnValue = this.m_callback.nativeCall(this, value, this.m_registerHandler.getRegister(), this.m_registerHandler.getStack(), parameterCount);
			this.m_savedRegisters.add(this.m_register);
			this.m_registerHandler.setRegister(returnValue);
			if (parameterCount > 0)
			{
				this.m_registerHandler.pop(this, parameterCount + 1);
			}
		}
		else if (type === oFF.SiTokenType.STRING || type === oFF.SiTokenType.CELL_SELECTION)
		{
			this.m_registerHandler.setStringToRegister(this, value);
		}
		else if (type === oFF.SiTokenType.INTEGER)
		{
			this.m_registerHandler.setIntegerToRegister(this, oFF.XInteger.convertFromString(value));
		}
		else if (type === oFF.SiTokenType.DOUBLE)
		{
			this.m_registerHandler.setDoubleToRegister(this, oFF.XDouble.convertFromString(value));
		}
		else if (type === oFF.SiTokenType.CONST_FALSE)
		{
			this.m_registerHandler.setBooleanToRegister(this, false);
		}
		else if (type === oFF.SiTokenType.CONST_TRUE)
		{
			this.m_registerHandler.setBooleanToRegister(this, true);
		}
		else if (type === oFF.SiTokenType.OP_DOT)
		{
			let left = token.getLeft();
			this.runOperations(left);
			let right = token.getRight();
			this.runOperations(right);
		}
		else if (type === oFF.SiTokenType.OP_ASSIGN)
		{
			let varName = token.getLeft().getValue();
			this.runOperations(token.getRight());
			this.pushRegisterToMemory(this, varName);
		}
		else if (type === oFF.SiTokenType.OP_PLUS || type === oFF.SiTokenType.OP_MINUS || type === oFF.SiTokenType.OP_MULT || type === oFF.SiTokenType.OP_DIV || type === oFF.SiTokenType.OP_EQUAL || type === oFF.SiTokenType.OP_NOT_EQUAL || type === oFF.SiTokenType.OP_LOWER || type === oFF.SiTokenType.OP_LOWER_EQUAL || type === oFF.SiTokenType.OP_GREATER || type === oFF.SiTokenType.OP_GREATER_EQUAL)
		{
			this.m_registerHandler.pushRegisterOnStack(this);
			this.runOperations(token.getLeft());
			this.m_registerHandler.pushRegisterOnStack(this);
			this.runOperations(token.getRight());
			this.m_registerHandler.pushRegisterOnStack(this);
			this.m_registerHandler.setStackToRegister(this, 2);
			let registerObj = this.m_registerHandler.getRegister();
			let stack = this.m_registerHandler.getStack();
			let returnVal = this.nativeCall(this, type.getName(), registerObj, stack, 2);
			this.m_registerHandler.setRegister(returnVal);
			this.m_registerHandler.pop(this, 3);
		}
		else if (type === oFF.SiTokenType.IDENTIFIER)
		{
			this.m_registerHandler.setVariableToRegister(this, value);
		}
	}
};
oFF.SiInterpreter.prototype.setBooleanToRegister = function(interpreter, value)
{
	this.m_register = oFF.XBooleanValue.create(value);
};
oFF.SiInterpreter.prototype.setCustomObject = function(name, value)
{
	this.m_customObjects.put(name, value);
};
oFF.SiInterpreter.prototype.setDoubleToRegister = function(interpreter, value)
{
	this.m_register = oFF.XDoubleValue.create(value);
};
oFF.SiInterpreter.prototype.setInitialRegister = function(obj)
{
	this.setRegister(obj);
};
oFF.SiInterpreter.prototype.setIntegerToRegister = function(interpreter, value)
{
	this.m_register = oFF.XIntegerValue.create(value);
};
oFF.SiInterpreter.prototype.setRegister = function(obj)
{
	this.m_register = obj;
};
oFF.SiInterpreter.prototype.setRoot = function(root)
{
	this.m_root = root;
};
oFF.SiInterpreter.prototype.setStackToRegister = function(interpreter, topOffset)
{
	let index = this.m_stack.size() - 1 - topOffset;
	this.m_register = this.m_stack.get(index);
};
oFF.SiInterpreter.prototype.setStringToRegister = function(interpreter, value)
{
	this.m_register = oFF.XStringValue.create(value);
};
oFF.SiInterpreter.prototype.setVariableToRegister = function(interpreter, value)
{
	this.m_register = oFF.XStringValue.create(value);
};
oFF.SiInterpreter.prototype.setVmCallback = function(callback)
{
	this.m_callback = callback;
};
oFF.SiInterpreter.prototype.setupSessionContext = function(session)
{
	oFF.MessageManager.prototype.setupSessionContext.call( this , session);
	this.m_customObjects = oFF.XHashMapByString.create();
	this.m_variables = oFF.XHashMapByString.create();
	this.m_registerHandler = this;
	this.m_savedRegisters = oFF.XList.create();
};
oFF.SiInterpreter.prototype.toString = function()
{
	if (this.isValid() && oFF.notNull(this.m_root))
	{
		return this.m_root.toString();
	}
	return oFF.MessageManager.prototype.toString.call( this );
};

oFF.SiParser = function() {};
oFF.SiParser.prototype = new oFF.MessageManager();
oFF.SiParser.prototype._ff_c = "SiParser";

oFF.SiParser.create = function()
{
	let parser = new oFF.SiParser();
	parser.setupSessionContext(null);
	return parser;
};
oFF.SiParser.isExecutable = function(type)
{
	return type === oFF.SiTokenType.FUNCTION || type === oFF.SiTokenType.IDENTIFIER || type === oFF.SiTokenType.OP_DOT;
};
oFF.SiParser.prototype.clusterBrackets = function(tokens)
{
	let size = tokens.size();
	for (let i = 0; i < size; i++)
	{
		let current = tokens.get(i);
		let children = current.getChildren();
		let clearedChildren;
		if (current.getType() === oFF.SiTokenType.EXPR_SEQ)
		{
			clearedChildren = this.clusterBrackets(children);
		}
		else
		{
			clearedChildren = this.resolveBrackets(children);
		}
		current.setChildren(clearedChildren);
	}
	return tokens;
};
oFF.SiParser.prototype.clusterComma = function(tokens)
{
	let targetTokens = oFF.XList.create();
	let size = tokens.size();
	let parameterToken = null;
	for (let i = 0; i < size; i++)
	{
		let current = tokens.get(i);
		let type = current.getType();
		if (type === oFF.SiTokenType.COMMA)
		{
			if (oFF.isNull(parameterToken))
			{
				parameterToken = oFF.SiToken.createWithValue(oFF.SiTokenType.COMMA_LIST, null);
			}
			this.prepareSeq(targetTokens, parameterToken, true);
			targetTokens = oFF.XList.create();
		}
		else
		{
			let children = current.getChildren();
			if (oFF.notNull(children))
			{
				let newChildren = this.clusterComma(children);
				current.setChildren(newChildren);
			}
			targetTokens.add(current);
		}
	}
	if (oFF.notNull(parameterToken))
	{
		this.prepareSeq(targetTokens, parameterToken, true);
		let wrapper = oFF.XList.create();
		wrapper.add(parameterToken);
		return wrapper;
	}
	else if (tokens.size() > 1)
	{
		let seqToken = oFF.SiToken.createWithValue(oFF.SiTokenType.TOKEN_SEQ, null);
		seqToken.setChildren(targetTokens);
		let wrapper2 = oFF.XList.create();
		wrapper2.add(seqToken);
		return wrapper2;
	}
	else
	{
		return tokens;
	}
};
oFF.SiParser.prototype.clusterExpressions = function(tokens)
{
	let expSeq = oFF.SiToken.createWithValue(oFF.SiTokenType.EXPR_SEQ, null);
	let targetTokens = oFF.XList.create();
	let size = tokens.size();
	for (let i = 0; i < size; i++)
	{
		let current = tokens.get(i);
		if (current.getType() === oFF.SiTokenType.SEMICOLON)
		{
			this.prepareSeq(targetTokens, expSeq, false);
			targetTokens = oFF.XList.create();
		}
		else
		{
			targetTokens.add(current);
		}
	}
	this.prepareSeq(targetTokens, expSeq, false);
	let wrapper = oFF.XList.create();
	wrapper.add(expSeq);
	return wrapper;
};
oFF.SiParser.prototype.clusterFunctions = function(tokens)
{
	let targetTokens = null;
	if (oFF.notNull(tokens))
	{
		targetTokens = oFF.XList.create();
		let size = tokens.size();
		for (let i = 0; i < size; i++)
		{
			let current = tokens.get(i);
			let type = current.getType();
			let next = null;
			let nextType = null;
			if (i + 1 < size)
			{
				next = tokens.get(i + 1);
				nextType = next.getType();
			}
			if (type === oFF.SiTokenType.IDENTIFIER && oFF.notNull(next) && nextType === oFF.SiTokenType.ROUND_BRACKET)
			{
				let newFunction = oFF.SiToken.createWithValue(oFF.SiTokenType.FUNCTION, current.getValue());
				let nextChildren = next.getChildren();
				if (oFF.notNull(nextChildren) && nextChildren.size() !== 0)
				{
					if (nextChildren.size() !== 1)
					{
						let clusterResult = this.clusterFunctions(nextChildren);
						newFunction.setChildren(clusterResult);
					}
					else
					{
						let parameterToken = nextChildren.get(0);
						let commaList;
						if (parameterToken.getType() !== oFF.SiTokenType.COMMA_LIST)
						{
							commaList = oFF.XList.create();
							commaList.add(parameterToken);
						}
						else
						{
							commaList = parameterToken.getChildren();
						}
						newFunction.setChildren(commaList);
					}
				}
				current = newFunction;
				i++;
			}
			let children = current.getChildren();
			children = this.clusterFunctions(children);
			current.setChildren(children);
			targetTokens.add(current);
		}
	}
	return targetTokens;
};
oFF.SiParser.prototype.clusterOperations = function(tokens)
{
	let targetTokens = oFF.XList.create();
	let size = tokens.size();
	for (let i = 0; i < size; i++)
	{
		let current = tokens.get(i);
		let type = current.getType();
		let children = current.getChildren();
		if (oFF.notNull(children))
		{
			children = this.clusterOperations(children);
			current.setChildren(children);
		}
		if (type === oFF.SiTokenType.TOKEN_SEQ)
		{
			current = this.resolveTokenSequence(current);
		}
		targetTokens.add(current);
	}
	return targetTokens;
};
oFF.SiParser.prototype.parse = function(script, depth)
{
	let tokens = this.tokenize(script);
	let expressions = this.clusterExpressions(tokens);
	let expressions2 = this.clusterBrackets(expressions);
	let expressions3 = this.clusterComma(expressions2);
	let expressions4 = this.clusterFunctions(expressions3);
	let expressions5 = expressions4;
	let expressions6 = this.clusterOperations(expressions5);
	this.log(expressions6.toString());
	if (expressions6.size() === 1)
	{
		return expressions5.get(0);
	}
	this.addError(0, "Syntax error");
	return null;
};
oFF.SiParser.prototype.prepareSeq = function(tokens, parent, addEmpty)
{
	let size = tokens.size();
	if (size === 0)
	{
		if (addEmpty)
		{
			parent.add(oFF.SiToken.createWithValue(oFF.SiTokenType.EMPTY, null));
		}
	}
	else if (size === 1)
	{
		parent.add(tokens.get(0));
	}
	else
	{
		let seqToken = oFF.SiToken.createWithValue(oFF.SiTokenType.TOKEN_SEQ, null);
		seqToken.setChildren(tokens);
		parent.add(seqToken);
	}
};
oFF.SiParser.prototype.resolveBrackets = function(tokens)
{
	let targetTokens = oFF.XList.create();
	let stack = oFF.XList.create();
	let size = tokens.size();
	for (let i = 0; i < size; i++)
	{
		let current = tokens.get(i);
		let tokenType = current.getType();
		if (tokenType === oFF.SiTokenType.ROUND_BRACKET_OPEN)
		{
			stack.add(targetTokens);
			targetTokens = oFF.XList.create();
		}
		else if (tokenType === oFF.SiTokenType.ROUND_BRACKET_CLOSE)
		{
			if (stack.size() === 0)
			{
				return null;
			}
			let roundBracket = oFF.SiToken.createWithValue(oFF.SiTokenType.ROUND_BRACKET, null);
			roundBracket.setChildren(targetTokens);
			targetTokens = stack.removeAt(stack.size() - 1);
			targetTokens.add(roundBracket);
		}
		else
		{
			targetTokens.add(current);
		}
	}
	return targetTokens;
};
oFF.SiParser.prototype.resolveTokenSequence = function(tokenSeq)
{
	let children = tokenSeq.getChildren();
	let size = children.size();
	if (size === 1)
	{
		return children.get(0);
	}
	let op = null;
	let left = children.get(0);
	let offset = 1;
	while (true)
	{
		let operator = children.get(offset);
		let right = children.get(offset + 1);
		let leftType = left.getType();
		let opType = operator.getType();
		let rightType = right.getType();
		if (oFF.SiParser.isExecutable(leftType) === false)
		{
			this.addError(4, "Left operator not executable");
		}
		else if (oFF.SiParser.isExecutable(rightType) === false)
		{
			this.addError(5, "Right operator not executable");
		}
		if (opType === oFF.SiTokenType.DOT)
		{
			op = oFF.SiToken.createWithValue(oFF.SiTokenType.OP_DOT, null);
			op.add(left);
			op.add(right);
		}
		else
		{
			this.addError(6, "Not supported operator");
			return null;
		}
		offset = offset + 2;
		if (offset >= size)
		{
			break;
		}
		left = op;
	}
	return op;
};
oFF.SiParser.prototype.setupSessionContext = function(session)
{
	oFF.MessageManager.prototype.setupSessionContext.call( this , session);
};
oFF.SiParser.prototype.tokenize = function(script)
{
	let tokens = oFF.XList.create();
	let size = oFF.XString.size(script);
	let isInsideString = false;
	let isInsideIdentifier = false;
	let isInsideSpace = false;
	let isInsideInt = false;
	let start = 0;
	for (let i = 0; i <= size; )
	{
		let c;
		if (i === size)
		{
			c = 0;
		}
		else
		{
			c = oFF.XString.getCharAt(script, i);
		}
		if (isInsideString)
		{
			if (c === 39 || c === 0)
			{
				let stringValue = oFF.XString.substring(script, start + 1, i);
				tokens.add(oFF.SiToken.createWithValue(oFF.SiTokenType.STRING, stringValue));
				isInsideString = false;
			}
			i++;
		}
		else if (isInsideInt)
		{
			if (c >= 48 && c <= 57)
			{
				i++;
			}
			else
			{
				let intValue = oFF.XString.substring(script, start, i);
				tokens.add(oFF.SiToken.createWithValue(oFF.SiTokenType.INTEGER, intValue));
				isInsideInt = false;
			}
		}
		else if (isInsideSpace)
		{
			if (c === 32)
			{
				i++;
			}
			else
			{
				tokens.add(oFF.SiToken.createWithValue(oFF.SiTokenType.SPACE, null));
				isInsideSpace = false;
			}
		}
		else if (isInsideIdentifier)
		{
			if (c !== 0 && (c >= 65 && c <= 90 || c >= 97 && c <= 122 || c === 95 || c === 36 || c >= 48 && c <= 57))
			{
				i++;
			}
			else
			{
				let word = oFF.XString.substring(script, start, i);
				if (oFF.XString.isEqual(word, "true"))
				{
					tokens.add(oFF.SiToken.createWithValue(oFF.SiTokenType.CONST_TRUE, word));
				}
				else if (oFF.XString.isEqual(word, "false"))
				{
					tokens.add(oFF.SiToken.createWithValue(oFF.SiTokenType.CONST_FALSE, word));
				}
				else
				{
					tokens.add(oFF.SiToken.createWithValue(oFF.SiTokenType.IDENTIFIER, word));
				}
				isInsideIdentifier = false;
			}
		}
		else
		{
			if (c !== 0)
			{
				if (c === 39)
				{
					isInsideString = true;
					start = i;
				}
				else if (c === 32)
				{
					isInsideSpace = true;
					start = i;
				}
				else if (c >= 65 && c <= 90 || c >= 97 && c <= 122 || c === 95 || c === 36)
				{
					isInsideIdentifier = true;
					start = i;
				}
				else if (c >= 48 && c <= 57)
				{
					isInsideInt = true;
					start = i;
				}
				else
				{
					let element = oFF.XString.substring(script, i, i + 1);
					let tokenType = oFF.SiTokenType.lookup(element);
					if (oFF.isNull(tokenType))
					{
						tokenType = oFF.SiTokenType.UNDEFINED;
					}
					tokens.add(oFF.SiToken.createWithValue(tokenType, null));
				}
			}
			i++;
		}
	}
	return tokens;
};

oFF.SiParser2 = function() {};
oFF.SiParser2.prototype = new oFF.MessageManager();
oFF.SiParser2.prototype._ff_c = "SiParser2";

oFF.SiParser2.addTo = function(targetList, sourceList, start, end)
{
	let theTargetList = targetList;
	if (oFF.isNull(theTargetList))
	{
		theTargetList = oFF.XList.create();
	}
	if (oFF.notNull(sourceList))
	{
		let theEnd = end;
		if (end === -1)
		{
			theEnd = sourceList.size();
		}
		for (let k = start; k < theEnd; k++)
		{
			theTargetList.add(sourceList.get(k));
		}
	}
	return theTargetList;
};
oFF.SiParser2.create = function()
{
	let parser = new oFF.SiParser2();
	parser.setupSessionContext(null);
	return parser;
};
oFF.SiParser2.findFirst = function(tokens, type, start)
{
	let first = -1;
	if (oFF.notNull(tokens))
	{
		for (let i = start; i < tokens.size(); i++)
		{
			if (tokens.get(i).getType() === type)
			{
				first = i;
				break;
			}
		}
	}
	return first;
};
oFF.SiParser2.findFirstLevel = function(tokens, level, start)
{
	let first = -1;
	if (oFF.notNull(tokens))
	{
		for (let i = start; i < tokens.size(); i++)
		{
			if (tokens.get(i).getOperatorLevel() === level)
			{
				first = i;
				break;
			}
		}
	}
	return first;
};
oFF.SiParser2.findLast = function(tokens, type)
{
	let last = -1;
	if (oFF.notNull(tokens))
	{
		for (let i = 0; i < tokens.size(); i++)
		{
			if (tokens.get(i).getType() === type)
			{
				last = i;
			}
		}
	}
	return last;
};
oFF.SiParser2.findLastLevel = function(tokens, level, start)
{
	let first = -1;
	if (oFF.notNull(tokens))
	{
		for (let i = tokens.size() - 1; i >= 0; i--)
		{
			if (tokens.get(i).getOperatorLevel() === level)
			{
				first = i;
				break;
			}
		}
	}
	return first;
};
oFF.SiParser2.prototype.merge = function(targetTokens, opIndex, tokenType, takeLeftValue)
{
	if (opIndex > 0 && opIndex + 1 < targetTokens.size())
	{
		let left = targetTokens.get(opIndex - 1);
		let right = targetTokens.get(opIndex + 1);
		let value = null;
		if (takeLeftValue === true)
		{
			value = left.getValue();
		}
		let targetToken = oFF.SiToken.createExt(tokenType, 0, value, null);
		targetToken.add(left).add(right);
		targetTokens.set(opIndex - 1, targetToken);
		targetTokens.removeAt(opIndex);
		targetTokens.removeAt(opIndex);
		return targetToken;
	}
	else
	{
		return null;
	}
};
oFF.SiParser2.prototype.mergeSign = function(targetTokens)
{
	let pos = 0;
	let tokenBeforeSign = null;
	let tokenSign = null;
	let tokenNumber = null;
	while (pos < targetTokens.size())
	{
		tokenNumber = targetTokens.get(pos);
		let type = tokenNumber.getType();
		if (type.isNumber() && oFF.notNull(tokenSign))
		{
			let signType = tokenSign.getType();
			if (signType === oFF.SiTokenType.OP_PLUS || signType === oFF.SiTokenType.OP_MINUS)
			{
				let beforeType = null;
				if (oFF.notNull(tokenBeforeSign))
				{
					beforeType = tokenBeforeSign.getType();
				}
				if (oFF.isNull(beforeType) || beforeType.isOperator())
				{
					let newValue;
					if (signType === oFF.SiTokenType.OP_PLUS)
					{
						newValue = oFF.XStringUtils.concatenate2("+", tokenNumber.getValue());
					}
					else
					{
						newValue = oFF.XStringUtils.concatenate2("-", tokenNumber.getValue());
					}
					tokenNumber.setValue(newValue);
					targetTokens.removeAt(pos - 1);
					pos--;
				}
			}
		}
		tokenBeforeSign = tokenSign;
		tokenSign = tokenNumber;
		pos++;
	}
};
oFF.SiParser2.prototype.parse = function(script, depth)
{
	let returnToken;
	let tokens = this.tokenize(script, depth);
	if (depth === -1 || depth >= 10)
	{
		returnToken = this.parseCurlyBrackets(tokens);
	}
	else
	{
		returnToken = null;
	}
	return returnToken;
};
oFF.SiParser2.prototype.parseAssignment = function(targetTokens)
{
	while (targetTokens.size() > 1)
	{
		let lastIndex = oFF.SiParser2.findLastLevel(targetTokens, 5, 0);
		if (lastIndex === -1)
		{
			break;
		}
		let siToken = targetTokens.get(lastIndex);
		let type = siToken.getType();
		this.merge(targetTokens, lastIndex, type, true);
	}
	return this.parseComplexDefinition(targetTokens);
};
oFF.SiParser2.prototype.parseBrackets = function(tokens)
{
	let lastOpening = oFF.SiParser2.findLast(tokens, oFF.SiTokenType.ROUND_BRACKET_OPEN);
	if (lastOpening === -1)
	{
		let firstClosing = oFF.SiParser2.findFirst(tokens, oFF.SiTokenType.ROUND_BRACKET_CLOSE, 0);
		if (firstClosing === -1)
		{
			return this.parseCommaList(tokens);
		}
		this.addError(0, "Closing round bracket ')' not expected");
		return null;
	}
	let closing = oFF.SiParser2.findFirst(tokens, oFF.SiTokenType.ROUND_BRACKET_CLOSE, lastOpening);
	if (closing === -1)
	{
		this.addError(0, "Closing round bracket ')' not found");
		return null;
	}
	let roundBracket = oFF.SiToken.create(oFF.SiTokenType.ROUND_BRACKET);
	let bracketContent = oFF.SiParser2.addTo(null, tokens, lastOpening + 1, closing);
	if (bracketContent.size() > 0)
	{
		let deepthought = this.parseBrackets(bracketContent);
		roundBracket.add(deepthought);
	}
	let assembledTokens = oFF.SiParser2.addTo(null, tokens, 0, lastOpening);
	assembledTokens.add(roundBracket);
	oFF.SiParser2.addTo(assembledTokens, tokens, closing + 1, -1);
	return this.parseBrackets(assembledTokens);
};
oFF.SiParser2.prototype.parseCommaList = function(tokens)
{
	let commaListToken = oFF.SiToken.create(oFF.SiTokenType.COMMA_LIST);
	let start = 0;
	let nextComma;
	while (true)
	{
		nextComma = oFF.SiParser2.findFirst(tokens, oFF.SiTokenType.COMMA, start);
		let sequence = oFF.SiParser2.addTo(null, tokens, start, nextComma);
		if (sequence.size() > 0)
		{
			let expression7 = this.parseFunctionAndOperations(sequence);
			commaListToken.add(expression7);
		}
		else
		{
			commaListToken.add(oFF.SiToken.create(oFF.SiTokenType.EMPTY));
		}
		if (nextComma === -1)
		{
			break;
		}
		start = nextComma + 1;
	}
	if (commaListToken.size() === 1)
	{
		return commaListToken.getChild();
	}
	return commaListToken;
};
oFF.SiParser2.prototype.parseComplexDefinition = function(targetTokens)
{
	if (targetTokens.size() !== 1)
	{
		for (let i = 0; i < targetTokens.size() - 1; i++)
		{
			let token = targetTokens.get(i);
			let type = token.getType();
			if (type.isPrimitiveType())
			{
				let rightSide = targetTokens.get(i + 1);
				let name = rightSide.getValue();
				let varDef = oFF.SiToken.createExt(oFF.SiTokenType.PRIMITIVE_TYPE_VAR_DEF, 0, name, null);
				varDef.add(token);
				varDef.add(rightSide);
				return varDef;
			}
		}
		let tokenSequence = oFF.SiToken.createExt(oFF.SiTokenType.TOKEN_SEQ, 0, null, targetTokens);
		return tokenSequence;
	}
	else
	{
		return targetTokens.get(0);
	}
};
oFF.SiParser2.prototype.parseCurlyBrackets = function(tokens)
{
	let lastOpening = oFF.SiParser2.findLast(tokens, oFF.SiTokenType.CURLY_BRACKET_OPEN);
	if (lastOpening === -1)
	{
		let firstClosing = oFF.SiParser2.findFirst(tokens, oFF.SiTokenType.CURLY_BRACKET_CLOSE, 0);
		if (firstClosing === -1)
		{
			return this.parseExpressionSequences(tokens);
		}
		this.addError(0, "Closing curly bracket '}' not expected");
		return null;
	}
	let closing = oFF.SiParser2.findFirst(tokens, oFF.SiTokenType.CURLY_BRACKET_CLOSE, lastOpening);
	if (closing === -1)
	{
		this.addError(0, "Closing round bracket '}' not found");
		return null;
	}
	let curlyBracket = oFF.SiToken.create(oFF.SiTokenType.CURLY_BRACKET);
	let bracketContent = oFF.SiParser2.addTo(null, tokens, lastOpening + 1, closing);
	if (bracketContent.size() > 0)
	{
		let deepthought = this.parseCurlyBrackets(bracketContent);
		curlyBracket.add(deepthought);
	}
	let assembledTokens = oFF.SiParser2.addTo(null, tokens, 0, lastOpening);
	assembledTokens.add(curlyBracket);
	oFF.SiParser2.addTo(assembledTokens, tokens, closing + 1, -1);
	return this.parseCurlyBrackets(assembledTokens);
};
oFF.SiParser2.prototype.parseExpressionSequences = function(tokens)
{
	let rootToken = oFF.SiToken.create(oFF.SiTokenType.EXPR_SEQ);
	let start = 0;
	let nextSemicolon;
	while (true)
	{
		nextSemicolon = oFF.SiParser2.findFirst(tokens, oFF.SiTokenType.SEMICOLON, start);
		let sequence = oFF.SiParser2.addTo(null, tokens, start, nextSemicolon);
		if (sequence.size() > 0)
		{
			let expression7 = this.parseBrackets(sequence);
			rootToken.add(expression7);
		}
		if (nextSemicolon === -1)
		{
			break;
		}
		start = nextSemicolon + 1;
	}
	return rootToken;
};
oFF.SiParser2.prototype.parseFunctionAndOperations = function(tokens)
{
	let operatorOperandSequence = this.parseFunctions(tokens);
	let singleOperation = this.parseOperations(operatorOperandSequence);
	return singleOperation;
};
oFF.SiParser2.prototype.parseFunctions = function(tokens)
{
	let targetTokens = null;
	if (oFF.notNull(tokens))
	{
		targetTokens = oFF.XList.create();
		let size = tokens.size();
		for (let i = 0; i < size; i++)
		{
			let current = tokens.get(i);
			let type = current.getType();
			let next = null;
			let nextType = null;
			if (i + 1 < size)
			{
				next = tokens.get(i + 1);
				nextType = next.getType();
			}
			if (type === oFF.SiTokenType.IDENTIFIER && nextType === oFF.SiTokenType.ROUND_BRACKET && oFF.notNull(next))
			{
				let newFunction = oFF.SiToken.createWithValue(oFF.SiTokenType.FUNCTION, current.getValue());
				targetTokens.add(newFunction);
				let bracketChild = next.getChild();
				if (oFF.notNull(bracketChild))
				{
					let bracketChildType = bracketChild.getType();
					if (bracketChildType === oFF.SiTokenType.COMMA_LIST)
					{
						let multiParameter = bracketChild.getChildren();
						newFunction.setChildren(multiParameter);
					}
					else
					{
						newFunction.add(bracketChild);
					}
				}
				i++;
			}
			else
			{
				targetTokens.add(current);
			}
		}
	}
	return targetTokens;
};
oFF.SiParser2.prototype.parseOperations = function(children)
{
	if (oFF.isNull(children))
	{
		this.addError(0, "No children");
		return null;
	}
	if (children.size() === 1)
	{
		return children.get(0);
	}
	else if (children.size() === 0)
	{
		return null;
	}
	let targetTokens = oFF.XList.create();
	targetTokens.addAll(children);
	this.mergeSign(targetTokens);
	for (let k = 10; k >= 6; k--)
	{
		while (targetTokens.size() > 1)
		{
			let firstPointOp = oFF.SiParser2.findFirstLevel(targetTokens, k, 0);
			if (firstPointOp === -1)
			{
				break;
			}
			let siToken = targetTokens.get(firstPointOp);
			let type = siToken.getType();
			this.merge(targetTokens, firstPointOp, type, false);
		}
	}
	let returnToken = this.parseAssignment(targetTokens);
	return returnToken;
};
oFF.SiParser2.prototype.setupSessionContext = function(session)
{
	oFF.MessageManager.prototype.setupSessionContext.call( this , session);
};
oFF.SiParser2.prototype.spaceFreeTokens = function(tokens)
{
	let targetTokens = oFF.XList.create();
	let size = tokens.size();
	let token;
	let type;
	for (let k = 0; k < size; k++)
	{
		token = tokens.get(k);
		type = token.getType();
		if (type !== oFF.SiTokenType.SPACE && type !== oFF.SiTokenType.MULTI_LINE_COMMENT && type !== oFF.SiTokenType.SINGLE_LINE_COMMENT)
		{
			targetTokens.add(token);
		}
	}
	return targetTokens;
};
oFF.SiParser2.prototype.tokenize = function(script, depth)
{
	let resultTokens = null;
	if (depth === -1 || depth > 0)
	{
		let script2 = oFF.XString.replace(script, "\r", "");
		if (depth === -1 || depth > 1)
		{
			let tokens = oFF.XList.create();
			let isInsideMultiLineComment = false;
			let isInsideSingleLineComment = false;
			let isInsideString = false;
			let isInsideIdentifier = false;
			let isInsideSpace = false;
			let isInsideInt = false;
			let size = oFF.XString.size(script2);
			let start = 0;
			for (let i = 0; i <= size; )
			{
				let c;
				let n;
				if (i === size)
				{
					c = 0;
					n = 0;
				}
				else
				{
					c = oFF.XString.getCharAt(script2, i);
					if (i + 1 < size)
					{
						n = oFF.XString.getCharAt(script2, i + 1);
					}
					else
					{
						n = 0;
					}
				}
				if (isInsideMultiLineComment)
				{
					if (c === 0 || n === 0)
					{
						this.addError(0, "Unproper ending of multiline comment");
						break;
					}
					if (c === 42 && n === 47)
					{
						tokens.add(oFF.SiToken.createWithValue(oFF.SiTokenType.MULTI_LINE_COMMENT, oFF.XString.substring(script2, start + 2, i)));
						isInsideMultiLineComment = false;
						i = i + 2;
					}
					else
					{
						i++;
					}
				}
				else if (isInsideSingleLineComment)
				{
					if (c === 10 || c === 0)
					{
						tokens.add(oFF.SiToken.createWithValue(oFF.SiTokenType.SINGLE_LINE_COMMENT, oFF.XString.substring(script2, start + 2, i)));
						isInsideSingleLineComment = false;
					}
					i++;
				}
				else if (isInsideString)
				{
					if (c === 39 || c === 0)
					{
						tokens.add(oFF.SiToken.createWithValue(oFF.SiTokenType.STRING, oFF.XString.substring(script2, start + 1, i)));
						isInsideString = false;
					}
					i++;
				}
				else if (isInsideInt)
				{
					if (c >= 48 && c <= 57)
					{
						i++;
					}
					else
					{
						let intValue = oFF.XString.substring(script2, start, i);
						tokens.add(oFF.SiToken.createWithValue(oFF.SiTokenType.INTEGER, intValue));
						isInsideInt = false;
					}
				}
				else if (isInsideSpace)
				{
					if (c === 32)
					{
						i++;
					}
					else
					{
						tokens.add(oFF.SiToken.create(oFF.SiTokenType.SPACE));
						isInsideSpace = false;
					}
				}
				else if (isInsideIdentifier)
				{
					if (c !== 0 && (c >= 65 && c <= 90 || c >= 97 && c <= 122 || c === 95 || c === 36 || c >= 48 && c <= 57))
					{
						i++;
					}
					else
					{
						let word = oFF.XString.substring(script2, start, i);
						if (oFF.XString.isEqual(word, "true"))
						{
							tokens.add(oFF.SiToken.createWithValue(oFF.SiTokenType.CONST_TRUE, word));
						}
						else if (oFF.XString.isEqual(word, "false"))
						{
							tokens.add(oFF.SiToken.createWithValue(oFF.SiTokenType.CONST_FALSE, word));
						}
						else if (oFF.XString.isEqual(word, "int"))
						{
							tokens.add(oFF.SiToken.createWithValue(oFF.SiTokenType.TYPE_INT, word));
						}
						else
						{
							tokens.add(oFF.SiToken.createWithValue(oFF.SiTokenType.IDENTIFIER, word));
						}
						isInsideIdentifier = false;
					}
				}
				else
				{
					if (c !== 0)
					{
						if (c === 39)
						{
							isInsideString = true;
							start = i;
						}
						else if (c === 32)
						{
							isInsideSpace = true;
							start = i;
						}
						else if (c >= 65 && c <= 90 || c >= 97 && c <= 122 || c === 95 || c === 36)
						{
							isInsideIdentifier = true;
							start = i;
						}
						else if (c === 46)
						{
							tokens.add(oFF.SiToken.create(oFF.SiTokenType.OP_DOT));
						}
						else if (c === 43)
						{
							tokens.add(oFF.SiToken.create(oFF.SiTokenType.OP_PLUS));
						}
						else if (c === 45)
						{
							tokens.add(oFF.SiToken.create(oFF.SiTokenType.OP_MINUS));
						}
						else if (c === 42)
						{
							tokens.add(oFF.SiToken.create(oFF.SiTokenType.OP_MULT));
						}
						else if (c === 47)
						{
							if (n === 47)
							{
								isInsideSingleLineComment = true;
								start = i;
								i++;
							}
							else if (n === 42)
							{
								isInsideMultiLineComment = true;
								start = i;
								i++;
							}
							else
							{
								tokens.add(oFF.SiToken.create(oFF.SiTokenType.OP_DIV));
							}
						}
						else if (c === 60)
						{
							if (n === 61)
							{
								tokens.add(oFF.SiToken.create(oFF.SiTokenType.OP_LOWER_EQUAL));
								i++;
							}
							else
							{
								tokens.add(oFF.SiToken.create(oFF.SiTokenType.OP_LOWER));
							}
						}
						else if (c === 62)
						{
							if (n === 61)
							{
								tokens.add(oFF.SiToken.create(oFF.SiTokenType.OP_GREATER_EQUAL));
								i++;
							}
							else
							{
								tokens.add(oFF.SiToken.create(oFF.SiTokenType.OP_GREATER));
							}
						}
						else if (c === 61)
						{
							if (n === 61)
							{
								tokens.add(oFF.SiToken.create(oFF.SiTokenType.OP_EQUAL));
								i++;
							}
							else
							{
								tokens.add(oFF.SiToken.create(oFF.SiTokenType.OP_ASSIGN));
							}
						}
						else if (c === 33)
						{
							if (n === 61)
							{
								tokens.add(oFF.SiToken.create(oFF.SiTokenType.OP_NOT_EQUAL));
								i++;
							}
							else
							{
								tokens.add(oFF.SiToken.create(oFF.SiTokenType.OP_NOT));
							}
						}
						else if (c === 38)
						{
							if (n === 38)
							{
								tokens.add(oFF.SiToken.create(oFF.SiTokenType.OP_BOOL_AND));
								i++;
							}
							else
							{
								tokens.add(oFF.SiToken.create(oFF.SiTokenType.OP_BIN_AND));
							}
						}
						else if (c === 124)
						{
							if (n === 124)
							{
								tokens.add(oFF.SiToken.create(oFF.SiTokenType.OP_BOOL_OR));
								i++;
							}
							else
							{
								tokens.add(oFF.SiToken.create(oFF.SiTokenType.OP_BIN_OR));
							}
						}
						else if (c >= 48 && c <= 57)
						{
							isInsideInt = true;
							start = i;
						}
						else
						{
							let element = oFF.XString.substring(script2, i, i + 1);
							let tokenType = oFF.SiTokenType.lookup(element);
							if (oFF.isNull(tokenType))
							{
								tokenType = oFF.SiTokenType.UNDEFINED;
							}
							tokens.add(oFF.SiToken.create(tokenType));
						}
					}
					i++;
				}
			}
			let spaceFreeTokens = this.spaceFreeTokens(tokens);
			let tokensWithDouble = this.tokensWithDoublesAndCells(spaceFreeTokens);
			resultTokens = tokensWithDouble;
		}
	}
	return resultTokens;
};
oFF.SiParser2.prototype.tokensWithDoublesAndCells = function(tokens)
{
	let targetTokens = oFF.XList.create();
	let size = tokens.size();
	let token;
	for (let k = 0; k < size; k++)
	{
		token = tokens.get(k);
		let type = token.getType();
		let next = null;
		let nextType = null;
		let nextNext = null;
		let nextNextType = null;
		if (k + 2 < size)
		{
			next = tokens.get(k + 1);
			nextType = next.getType();
			nextNext = tokens.get(k + 2);
			nextNextType = nextNext.getType();
		}
		if (type === oFF.SiTokenType.INTEGER && nextType === oFF.SiTokenType.OP_DOT && nextNextType === oFF.SiTokenType.INTEGER && oFF.notNull(nextNext))
		{
			let doubleValue = oFF.XStringUtils.concatenate3(token.getValue(), ".", nextNext.getValue());
			let doubleToken = oFF.SiToken.createWithValue(oFF.SiTokenType.DOUBLE, doubleValue);
			targetTokens.add(doubleToken);
			k = k + 2;
		}
		else if (type === oFF.SiTokenType.IDENTIFIER && nextType === oFF.SiTokenType.OP_COLON && nextNextType === oFF.SiTokenType.IDENTIFIER && oFF.notNull(nextNext))
		{
			let cellSelectionValue = oFF.XStringUtils.concatenate3(token.getValue(), ":", nextNext.getValue());
			let cellSelectionToken = oFF.SiToken.createWithValue(oFF.SiTokenType.CELL_SELECTION, cellSelectionValue);
			targetTokens.add(cellSelectionToken);
			k = k + 2;
		}
		else
		{
			targetTokens.add(token);
		}
	}
	return targetTokens;
};

oFF.SiTokenType = function() {};
oFF.SiTokenType.prototype = new oFF.XConstant();
oFF.SiTokenType.prototype._ff_c = "SiTokenType";

oFF.SiTokenType.CELL_SELECTION = null;
oFF.SiTokenType.COMMA = null;
oFF.SiTokenType.COMMA_LIST = null;
oFF.SiTokenType.CONST_FALSE = null;
oFF.SiTokenType.CONST_TRUE = null;
oFF.SiTokenType.CURLY_BRACKET = null;
oFF.SiTokenType.CURLY_BRACKET_CLOSE = null;
oFF.SiTokenType.CURLY_BRACKET_OPEN = null;
oFF.SiTokenType.DIV = null;
oFF.SiTokenType.DOT = null;
oFF.SiTokenType.DOUBLE = null;
oFF.SiTokenType.EMPTY = null;
oFF.SiTokenType.EXPR_SEQ = null;
oFF.SiTokenType.FUNCTION = null;
oFF.SiTokenType.IDENTIFIER = null;
oFF.SiTokenType.INTEGER = null;
oFF.SiTokenType.MINUS = null;
oFF.SiTokenType.MULT = null;
oFF.SiTokenType.MULTI_LINE_COMMENT = null;
oFF.SiTokenType.OP_ASSIGN = null;
oFF.SiTokenType.OP_BIN_AND = null;
oFF.SiTokenType.OP_BIN_OR = null;
oFF.SiTokenType.OP_BOOL_AND = null;
oFF.SiTokenType.OP_BOOL_OR = null;
oFF.SiTokenType.OP_COLON = null;
oFF.SiTokenType.OP_DIV = null;
oFF.SiTokenType.OP_DOT = null;
oFF.SiTokenType.OP_EQUAL = null;
oFF.SiTokenType.OP_GREATER = null;
oFF.SiTokenType.OP_GREATER_EQUAL = null;
oFF.SiTokenType.OP_LOWER = null;
oFF.SiTokenType.OP_LOWER_EQUAL = null;
oFF.SiTokenType.OP_MINUS = null;
oFF.SiTokenType.OP_MULT = null;
oFF.SiTokenType.OP_NOT = null;
oFF.SiTokenType.OP_NOT_EQUAL = null;
oFF.SiTokenType.OP_PLUS = null;
oFF.SiTokenType.PLUS = null;
oFF.SiTokenType.PRIMITIVE_TYPE_VAR_DEF = null;
oFF.SiTokenType.ROUND_BRACKET = null;
oFF.SiTokenType.ROUND_BRACKET_CLOSE = null;
oFF.SiTokenType.ROUND_BRACKET_OPEN = null;
oFF.SiTokenType.SEMICOLON = null;
oFF.SiTokenType.SINGLE_LINE_COMMENT = null;
oFF.SiTokenType.SPACE = null;
oFF.SiTokenType.STRING = null;
oFF.SiTokenType.TOKEN_SEQ = null;
oFF.SiTokenType.TYPE_BOOLEAN = null;
oFF.SiTokenType.TYPE_DOUBLE = null;
oFF.SiTokenType.TYPE_INT = null;
oFF.SiTokenType.TYPE_STRING = null;
oFF.SiTokenType.UNDEFINED = null;
oFF.SiTokenType._OP_ASSIGN = "OpAssign";
oFF.SiTokenType._OP_BIN_AND = "OpBinAnd";
oFF.SiTokenType._OP_BIN_OR = "OpBinOr";
oFF.SiTokenType._OP_BOOL_AND = "OpBoolAnd";
oFF.SiTokenType._OP_BOOL_OR = "OpBoolOr";
oFF.SiTokenType._OP_DIV = "OpDiv";
oFF.SiTokenType._OP_EQUAL = "OpEqual";
oFF.SiTokenType._OP_GREATER = "OpGreater";
oFF.SiTokenType._OP_GREATER_EQUAL = "OpGreaterEqual";
oFF.SiTokenType._OP_LOWER = "OpLower";
oFF.SiTokenType._OP_LOWER_EQUAL = "OpLowerEqual";
oFF.SiTokenType._OP_MINUS = "OpMinus";
oFF.SiTokenType._OP_MULT = "OpMult";
oFF.SiTokenType._OP_NOT = "OpBinNot";
oFF.SiTokenType._OP_NOT_EQUAL = "OpNotEqual";
oFF.SiTokenType._OP_PLUS = "OpPlus";
oFF.SiTokenType.s_lookup = null;
oFF.SiTokenType.createNumber = function(name)
{
	let newObj = oFF.SiTokenType.createType(name);
	newObj.m_isNumber = true;
	return newObj;
};
oFF.SiTokenType.createOperator = function(name, operatorLevel)
{
	let newObj = new oFF.SiTokenType();
	newObj._setupInternal(name);
	newObj.m_operatorLevel = operatorLevel;
	oFF.SiTokenType.s_lookup.add(newObj);
	return newObj;
};
oFF.SiTokenType.createPrimitiveType = function(name)
{
	let newObj = new oFF.SiTokenType();
	newObj._setupInternal(name);
	newObj.m_isPrimitiveType = true;
	oFF.SiTokenType.s_lookup.add(newObj);
	return newObj;
};
oFF.SiTokenType.createType = function(name)
{
	let newObj = new oFF.SiTokenType();
	newObj._setupInternal(name);
	oFF.SiTokenType.s_lookup.add(newObj);
	return newObj;
};
oFF.SiTokenType.lookup = function(name)
{
	return oFF.SiTokenType.s_lookup.getByKey(name);
};
oFF.SiTokenType.staticSetup = function()
{
	oFF.SiTokenType.s_lookup = oFF.XSetOfNameObject.create();
	oFF.SiTokenType.IDENTIFIER = oFF.SiTokenType.createType("Identifier");
	oFF.SiTokenType.STRING = oFF.SiTokenType.createType("String");
	oFF.SiTokenType.INTEGER = oFF.SiTokenType.createNumber("Integer");
	oFF.SiTokenType.DOUBLE = oFF.SiTokenType.createNumber("Double");
	oFF.SiTokenType.CONST_TRUE = oFF.SiTokenType.createType("True");
	oFF.SiTokenType.CONST_FALSE = oFF.SiTokenType.createType("False");
	oFF.SiTokenType.SPACE = oFF.SiTokenType.createType("Space");
	oFF.SiTokenType.UNDEFINED = oFF.SiTokenType.createType("Undefined");
	oFF.SiTokenType.SEMICOLON = oFF.SiTokenType.createType(";");
	oFF.SiTokenType.OP_COLON = oFF.SiTokenType.createType(":");
	oFF.SiTokenType.COMMA = oFF.SiTokenType.createType(",");
	oFF.SiTokenType.COMMA_LIST = oFF.SiTokenType.createType("CommaList");
	oFF.SiTokenType.FUNCTION = oFF.SiTokenType.createType("Function");
	oFF.SiTokenType.ROUND_BRACKET_OPEN = oFF.SiTokenType.createType("(");
	oFF.SiTokenType.ROUND_BRACKET_CLOSE = oFF.SiTokenType.createType(")");
	oFF.SiTokenType.ROUND_BRACKET = oFF.SiTokenType.createType("()");
	oFF.SiTokenType.CURLY_BRACKET_OPEN = oFF.SiTokenType.createType("{");
	oFF.SiTokenType.CURLY_BRACKET_CLOSE = oFF.SiTokenType.createType("}");
	oFF.SiTokenType.CURLY_BRACKET = oFF.SiTokenType.createType("{}");
	oFF.SiTokenType.TOKEN_SEQ = oFF.SiTokenType.createType("TokenSeq");
	oFF.SiTokenType.EXPR_SEQ = oFF.SiTokenType.createType("ExprSeq");
	oFF.SiTokenType.EMPTY = oFF.SiTokenType.createType("Empty");
	oFF.SiTokenType.DOT = oFF.SiTokenType.createOperator(".", 10);
	oFF.SiTokenType.MULT = oFF.SiTokenType.createOperator("*", 9);
	oFF.SiTokenType.DIV = oFF.SiTokenType.createOperator("/", 9);
	oFF.SiTokenType.PLUS = oFF.SiTokenType.createOperator("+", 8);
	oFF.SiTokenType.MINUS = oFF.SiTokenType.createOperator("-", 8);
	oFF.SiTokenType.OP_DOT = oFF.SiTokenType.createOperator("OpDot", 10);
	oFF.SiTokenType.OP_MULT = oFF.SiTokenType.createOperator(oFF.SiTokenType._OP_MULT, 9);
	oFF.SiTokenType.OP_DIV = oFF.SiTokenType.createOperator(oFF.SiTokenType._OP_DIV, 9);
	oFF.SiTokenType.OP_PLUS = oFF.SiTokenType.createOperator(oFF.SiTokenType._OP_PLUS, 8);
	oFF.SiTokenType.OP_MINUS = oFF.SiTokenType.createOperator(oFF.SiTokenType._OP_MINUS, 8);
	oFF.SiTokenType.OP_LOWER = oFF.SiTokenType.createOperator(oFF.SiTokenType._OP_LOWER, 7);
	oFF.SiTokenType.OP_LOWER_EQUAL = oFF.SiTokenType.createOperator(oFF.SiTokenType._OP_LOWER_EQUAL, 7);
	oFF.SiTokenType.OP_GREATER = oFF.SiTokenType.createOperator(oFF.SiTokenType._OP_GREATER, 7);
	oFF.SiTokenType.OP_GREATER_EQUAL = oFF.SiTokenType.createOperator(oFF.SiTokenType._OP_GREATER_EQUAL, 7);
	oFF.SiTokenType.OP_EQUAL = oFF.SiTokenType.createOperator(oFF.SiTokenType._OP_EQUAL, 7);
	oFF.SiTokenType.OP_NOT_EQUAL = oFF.SiTokenType.createOperator(oFF.SiTokenType._OP_NOT_EQUAL, 7);
	oFF.SiTokenType.OP_BOOL_OR = oFF.SiTokenType.createOperator(oFF.SiTokenType._OP_BOOL_OR, 6);
	oFF.SiTokenType.OP_BOOL_AND = oFF.SiTokenType.createOperator(oFF.SiTokenType._OP_BOOL_AND, 6);
	oFF.SiTokenType.OP_ASSIGN = oFF.SiTokenType.createOperator(oFF.SiTokenType._OP_ASSIGN, 5);
	oFF.SiTokenType.OP_NOT = oFF.SiTokenType.createType(oFF.SiTokenType._OP_NOT);
	oFF.SiTokenType.OP_BIN_OR = oFF.SiTokenType.createType(oFF.SiTokenType._OP_BIN_OR);
	oFF.SiTokenType.OP_BIN_AND = oFF.SiTokenType.createType(oFF.SiTokenType._OP_BIN_AND);
	oFF.SiTokenType.CELL_SELECTION = oFF.SiTokenType.createType("CellSelection");
	oFF.SiTokenType.MULTI_LINE_COMMENT = oFF.SiTokenType.createType("MultiLineComment");
	oFF.SiTokenType.SINGLE_LINE_COMMENT = oFF.SiTokenType.createType("SingleLineComment");
	oFF.SiTokenType.TYPE_BOOLEAN = oFF.SiTokenType.createPrimitiveType("boolean");
	oFF.SiTokenType.TYPE_DOUBLE = oFF.SiTokenType.createPrimitiveType("double");
	oFF.SiTokenType.TYPE_INT = oFF.SiTokenType.createPrimitiveType("int");
	oFF.SiTokenType.TYPE_STRING = oFF.SiTokenType.createPrimitiveType("String");
	oFF.SiTokenType.PRIMITIVE_TYPE_VAR_DEF = oFF.SiTokenType.createType("PrimitiveTypeVarDef");
};
oFF.SiTokenType.prototype.m_isNumber = false;
oFF.SiTokenType.prototype.m_isPrimitiveType = false;
oFF.SiTokenType.prototype.m_operatorLevel = 0;
oFF.SiTokenType.prototype.getOperatorLevel = function()
{
	return this.m_operatorLevel;
};
oFF.SiTokenType.prototype.isNumber = function()
{
	return this.m_isNumber;
};
oFF.SiTokenType.prototype.isOperator = function()
{
	return this.m_operatorLevel > 0;
};
oFF.SiTokenType.prototype.isPrimitiveType = function()
{
	return this.m_isPrimitiveType;
};

oFF.DfUiPrgContainer = function() {};
oFF.DfUiPrgContainer.prototype = new oFF.ProgramContainer();
oFF.DfUiPrgContainer.prototype._ff_c = "DfUiPrgContainer";

oFF.DfUiPrgContainer.prototype.m_didShutdown = false;
oFF.DfUiPrgContainer.prototype.m_initialControlToFocus = null;
oFF.DfUiPrgContainer.prototype.m_uiManager = null;
oFF.DfUiPrgContainer.prototype._getContainerCssClass = function()
{
	let containerCssClass = null;
	if (this.getProgram().getResolvedProgramContainerType().isUiContainer())
	{
		let uiPrg = this.getUiProgram();
		containerCssClass = uiPrg.getContainerCssClass();
	}
	return containerCssClass;
};
oFF.DfUiPrgContainer.prototype._getContainerName = function()
{
	let containerName = null;
	if (this.getProgram().getResolvedProgramContainerType().isUiContainer())
	{
		let uiPrg = this.getUiProgram();
		containerName = uiPrg.getContainerName();
	}
	return containerName;
};
oFF.DfUiPrgContainer.prototype._isUiProgram = function()
{
	return this.getProgram() !== null && this.getProcess().getProcessType() === oFF.ProcessType.PROGRAM && this.getProgram().getComponentType().isTypeOf(oFF.UiComponentTypeExt.UI_PROGRAM) && this.getProgram().getResolvedProgramContainerType().isUiContainer();
};
oFF.DfUiPrgContainer.prototype.getGenesis = function()
{
	if (oFF.notNull(this.m_uiManager))
	{
		return this.m_uiManager.getFreeGenesis();
	}
	return null;
};
oFF.DfUiPrgContainer.prototype.getInitialControlToFocus = function()
{
	return this.m_initialControlToFocus;
};
oFF.DfUiPrgContainer.prototype.getOffsetHeight = function()
{
	return this.getContainerOffsetHeight();
};
oFF.DfUiPrgContainer.prototype.getOffsetWidth = function()
{
	return this.getContainerOffsetWidth();
};
oFF.DfUiPrgContainer.prototype.getTitle = function()
{
	let containerTitle = oFF.ProgramContainer.prototype.getTitle.call( this );
	if (oFF.XStringUtils.isNullOrEmpty(containerTitle))
	{
		let startCfg = this.getStartCfg();
		containerTitle = startCfg.getStartTitle();
	}
	return containerTitle;
};
oFF.DfUiPrgContainer.prototype.getUiManager = function()
{
	if (oFF.isNull(this.m_uiManager))
	{
		let program = this.getProgram();
		let process = program.getProcess();
		this.m_uiManager = process.getUiManager();
		if (oFF.isNull(this.m_uiManager))
		{
			this.m_uiManager = process.openSubSystem(oFF.SubSystemType.GUI);
		}
	}
	return this.m_uiManager;
};
oFF.DfUiPrgContainer.prototype.getUiProgram = function()
{
	if (this._isUiProgram())
	{
		try
		{
			return this.getProgram();
		}
		catch (error)
		{
			return null;
		}
	}
	return null;
};
oFF.DfUiPrgContainer.prototype.isBusy = function()
{
	return this.isContainerBusy();
};
oFF.DfUiPrgContainer.prototype.isContainerOpen = function()
{
	return false;
};
oFF.DfUiPrgContainer.prototype.isFloatingContainer = function()
{
	return false;
};
oFF.DfUiPrgContainer.prototype.isModalContainer = function()
{
	return false;
};
oFF.DfUiPrgContainer.prototype.isUiContainer = function()
{
	return true;
};
oFF.DfUiPrgContainer.prototype.killProgram = function()
{
	let program = this.getProgram();
	program.kill();
};
oFF.DfUiPrgContainer.prototype.notifyContainerClosed = function()
{
	if (this.getProgram() !== null)
	{
		this.getProgram().onContainerAfterClose();
	}
};
oFF.DfUiPrgContainer.prototype.notifyContainerOpened = function()
{
	if (this.getProgram() !== null)
	{
		this.getProgram().onContainerAfterOpen();
	}
};
oFF.DfUiPrgContainer.prototype.openAndRun = function(uiManager)
{
	this.m_uiManager = uiManager;
};
oFF.DfUiPrgContainer.prototype.releaseObject = function()
{
	this.shutdownContainer();
	this.m_initialControlToFocus = null;
	this.m_uiManager = null;
	oFF.ProgramContainer.prototype.releaseObject.call( this );
};
oFF.DfUiPrgContainer.prototype.runFull = function()
{
	let uiManager = this.getUiManager();
	if (oFF.notNull(uiManager))
	{
		this.openAndRun(uiManager);
	}
};
oFF.DfUiPrgContainer.prototype.setBusy = function(busy)
{
	this.setContainerBusy(busy);
};
oFF.DfUiPrgContainer.prototype.setContainerNameAndCssClass = function(element)
{
	if (oFF.notNull(element))
	{
		if (oFF.XStringUtils.isNotNullAndNotEmpty(this._getContainerName()))
		{
			element.setName(this._getContainerName());
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(this._getContainerCssClass()))
		{
			element.addCssClass(this._getContainerCssClass());
		}
	}
};
oFF.DfUiPrgContainer.prototype.setContainerSize = function(newSize)
{
	this.setContainerControlSize(newSize);
};
oFF.DfUiPrgContainer.prototype.setInitialControlToFocus = function(control)
{
	this.m_initialControlToFocus = control;
};
oFF.DfUiPrgContainer.prototype.setTitle = function(title)
{
	oFF.ProgramContainer.prototype.setTitle.call( this , title);
};
oFF.DfUiPrgContainer.prototype.setupUiContainer = function(startCfg, program)
{
	this.m_didShutdown = false;
	oFF.ProgramContainer.prototype.setupContainer.call( this , startCfg, program);
};
oFF.DfUiPrgContainer.prototype.shutdownContainer = function()
{
	if (!this.m_didShutdown)
	{
		this.m_didShutdown = true;
		this.deregisterContainerEvents();
		if (this.isContainerOpen())
		{
			this.closeContainerControl();
			this.notifyContainerClosed();
		}
		this.cleanupContainer();
	}
};
oFF.DfUiPrgContainer.prototype.terminateProgram = function()
{
	let program = this.getProgram();
	program.terminate();
};

oFF.SxEventScripting = function() {};
oFF.SxEventScripting.prototype = new oFF.XObject();
oFF.SxEventScripting.prototype._ff_c = "SxEventScripting";

oFF.SxEventScripting.create = function(script)
{
	let newObj = new oFF.SxEventScripting();
	newObj.setupEventScripting(null, script);
	return newObj;
};
oFF.SxEventScripting.prototype.m_map = null;
oFF.SxEventScripting.prototype.m_objCounter = 0;
oFF.SxEventScripting.prototype.m_script = null;
oFF.SxEventScripting.prototype.m_uiManager = null;
oFF.SxEventScripting.prototype.afterScriptExecution = function(interpreter) {};
oFF.SxEventScripting.prototype.beforeScriptExecution = function(interpreter) {};
oFF.SxEventScripting.prototype.executeByKeyword = function(name, parameters, executedFlag)
{
	if (oFF.XString.isEqual(oFF.UiQuasarConstants.QSA_DOLLAR, name))
	{
		let sigSel = parameters.getStringAtExt(0, null);
		let process = this.getUiManager().getSession();
		let selector = process.getSelector();
		let selectedComponents = selector.selectComponentByExpr(sigSel, oFF.SigSelDomain.UI, null, -1, true);
		executedFlag.setBoolean(true);
		return selectedComponents;
	}
	return null;
};
oFF.SxEventScripting.prototype.executeOperation = function(componentType, component, name, parameters)
{
	let retObj = null;
	if (componentType.isTypeOf(oFF.XComponentType._UI))
	{
		let uiContext = component;
		let operation = oFF.UiAllOperations.lookupOp(name);
		if (oFF.notNull(operation))
		{
			retObj = operation.executeOperation(this, uiContext, parameters, 0);
		}
	}
	return retObj;
};
oFF.SxEventScripting.prototype.fillParameters = function(stack, parameterCount)
{
	let parameters = oFF.PrFactory.createList();
	let offset = stack.size() - parameterCount;
	let stackObj;
	let entry;
	let valueType;
	for (let i = 0; i < parameterCount; i++)
	{
		stackObj = stack.get(offset + i);
		if (oFF.notNull(stackObj))
		{
			entry = stackObj;
			valueType = entry.getComponentType();
			if (valueType === oFF.XValueType.STRING)
			{
				parameters.addString(entry.toString());
			}
			else if (valueType === oFF.XValueType.BOOLEAN)
			{
				parameters.addBoolean(entry.getBoolean());
			}
			else if (valueType === oFF.XValueType.INTEGER)
			{
				parameters.addInteger(entry.getInteger());
			}
			else if (valueType === oFF.XValueType.DOUBLE)
			{
				parameters.addDouble(entry.getDouble());
			}
			else if (valueType.isTypeOf(oFF.XComponentType._UI))
			{
				let theId = this.newId();
				this.m_map.put(theId, entry);
				parameters.addString(theId);
			}
		}
		else
		{
			parameters.add(null);
		}
	}
	return parameters;
};
oFF.SxEventScripting.prototype.fillParameters2 = function(stack, parameterCount)
{
	let parameters = oFF.XList.create();
	let offset = stack.size() - parameterCount;
	let stackObj;
	let entry;
	let valueType;
	for (let i = 0; i < parameterCount; i++)
	{
		stackObj = stack.get(offset + i);
		if (oFF.notNull(stackObj))
		{
			entry = stackObj;
			valueType = entry.getComponentType();
			if (valueType === oFF.XValueType.STRING)
			{
				parameters.add(oFF.XReflectionParam.createString(entry.toString()));
			}
			else if (valueType === oFF.XValueType.BOOLEAN)
			{
				parameters.add(oFF.XReflectionParam.createBoolean(entry.getBoolean()));
			}
			else if (valueType === oFF.XValueType.INTEGER)
			{
				parameters.add(oFF.XReflectionParam.createInteger(entry.getInteger()));
			}
			else if (valueType === oFF.XValueType.DOUBLE)
			{
				parameters.add(oFF.XReflectionParam.createDouble(entry.getDouble()));
			}
			else
			{
				parameters.add(oFF.XReflectionParam.create(entry));
			}
		}
		else
		{
			parameters.add(oFF.XReflectionParam.create(null));
		}
	}
	return parameters;
};
oFF.SxEventScripting.prototype.getContext = function(identifier)
{
	let theComponent = this.m_map.getByKey(identifier);
	if (oFF.notNull(theComponent))
	{
		let theContext = theComponent;
		theContext = theContext.getOrigin();
		return theContext;
	}
	else
	{
		return null;
	}
};
oFF.SxEventScripting.prototype.getGenesis = function()
{
	return this.m_uiManager.getGenesis();
};
oFF.SxEventScripting.prototype.getUiManager = function()
{
	return this.m_uiManager;
};
oFF.SxEventScripting.prototype.lookupComponent = function(interpreter, component)
{
	let theComponent = component;
	if (oFF.isNull(theComponent))
	{
		theComponent = interpreter.getCustomObject("uicontext");
	}
	return theComponent;
};
oFF.SxEventScripting.prototype.nativeCall = function(interpreter, name, registerObj, stack, parameterCount)
{
	let parameters = this.fillParameters(stack, parameterCount);
	let executedFlag = oFF.XBooleanValue.create(false);
	let retObj = this.executeByKeyword(name, parameters, executedFlag);
	if (executedFlag.getBoolean() === false)
	{
		let component = this.lookupComponent(interpreter, registerObj);
		if (false)
		{
			let componentType = component.getComponentType();
			if (oFF.notNull(componentType))
			{
				retObj = this.executeOperation(componentType, component, name, parameters);
			}
		}
		else
		{
			let reflectParameters = this.fillParameters2(stack, parameterCount);
			let reflectReturn;
			if (oFF.notNull(parameters) && parameters.hasElements())
			{
				reflectReturn = oFF.XReflection.invokeMethodWithArgs(component, name, reflectParameters);
			}
			else
			{
				reflectReturn = oFF.XReflection.invokeMethod(component, name);
			}
			retObj = reflectReturn.getValue();
		}
	}
	return retObj;
};
oFF.SxEventScripting.prototype.newId = function()
{
	let theId = oFF.XStringBuffer.create().append("Id").appendInt(this.m_objCounter).toString();
	this.m_objCounter++;
	return theId;
};
oFF.SxEventScripting.prototype.onAfterClose = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_AFTER_CLOSE);
};
oFF.SxEventScripting.prototype.onAfterOpen = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_AFTER_OPEN);
};
oFF.SxEventScripting.prototype.onAfterRender = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_AFTER_RENDER);
};
oFF.SxEventScripting.prototype.onBack = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_BACK);
};
oFF.SxEventScripting.prototype.onBeforeClose = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_BEFORE_CLOSE);
};
oFF.SxEventScripting.prototype.onBeforeOpen = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_BEFORE_OPEN);
};
oFF.SxEventScripting.prototype.onBeforePageChanged = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_BEFORE_PAGE_CHANGED);
};
oFF.SxEventScripting.prototype.onButtonPress = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_BUTTON_PRESS);
};
oFF.SxEventScripting.prototype.onChange = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_CHANGE);
};
oFF.SxEventScripting.prototype.onChipUpdate = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_CHIP_UPDATE);
};
oFF.SxEventScripting.prototype.onClick = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_CLICK);
};
oFF.SxEventScripting.prototype.onClose = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_CLOSE);
};
oFF.SxEventScripting.prototype.onCollapse = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_COLLAPSE);
};
oFF.SxEventScripting.prototype.onColorSelect = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_COLOR_SELECT);
};
oFF.SxEventScripting.prototype.onColumnResize = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_COLUMN_RESIZE);
};
oFF.SxEventScripting.prototype.onContextMenu = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_CONTEXT_MENU);
};
oFF.SxEventScripting.prototype.onCursorChange = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_CURSOR_CHANGE);
};
oFF.SxEventScripting.prototype.onDelete = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_DELETE);
};
oFF.SxEventScripting.prototype.onDeselect = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_DESELECT);
};
oFF.SxEventScripting.prototype.onDetailPress = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_DETAIL_PRESS);
};
oFF.SxEventScripting.prototype.onDoubleClick = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_DOUBLE_CLICK);
};
oFF.SxEventScripting.prototype.onDragEnd = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_DRAG_END);
};
oFF.SxEventScripting.prototype.onDragEnter = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_DRAG_ENTER);
};
oFF.SxEventScripting.prototype.onDragOver = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_DRAG_OVER);
};
oFF.SxEventScripting.prototype.onDragStart = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_DRAG_START);
};
oFF.SxEventScripting.prototype.onDrop = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_DROP);
};
oFF.SxEventScripting.prototype.onEditingBegin = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_EDITING_BEGIN);
};
oFF.SxEventScripting.prototype.onEditingEnd = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_EDITING_END);
};
oFF.SxEventScripting.prototype.onEnter = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_ENTER);
};
oFF.SxEventScripting.prototype.onError = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_ERROR);
};
oFF.SxEventScripting.prototype.onEscape = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_ESCAPE);
};
oFF.SxEventScripting.prototype.onExecute = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_EXECUTE);
};
oFF.SxEventScripting.prototype.onExpand = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_EXPAND);
};
oFF.SxEventScripting.prototype.onFileDrop = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_FILE_DROP);
};
oFF.SxEventScripting.prototype.onHover = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_HOVER);
};
oFF.SxEventScripting.prototype.onHoverEnd = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_HOVER_END);
};
oFF.SxEventScripting.prototype.onItemClose = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_ITEM_CLOSE);
};
oFF.SxEventScripting.prototype.onItemDelete = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_ITEM_DELETE);
};
oFF.SxEventScripting.prototype.onItemPress = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_ITEM_PRESS);
};
oFF.SxEventScripting.prototype.onItemSelect = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_ITEM_SELECT);
};
oFF.SxEventScripting.prototype.onKeyDown = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_KEY_DOWN);
};
oFF.SxEventScripting.prototype.onKeyUp = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_KEY_UP);
};
oFF.SxEventScripting.prototype.onLiveChange = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_LIVE_CHANGE);
};
oFF.SxEventScripting.prototype.onLoadFinished = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_LOAD_FINISHED);
};
oFF.SxEventScripting.prototype.onMenuPress = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_MENU_PRESS);
};
oFF.SxEventScripting.prototype.onMove = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_MOVE);
};
oFF.SxEventScripting.prototype.onMoveEnd = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_MOVE_END);
};
oFF.SxEventScripting.prototype.onMoveStart = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_MOVE_START);
};
oFF.SxEventScripting.prototype.onOpen = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_OPEN);
};
oFF.SxEventScripting.prototype.onPageChanged = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_PAGE_CHANGED);
};
oFF.SxEventScripting.prototype.onPaste = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_PASTE);
};
oFF.SxEventScripting.prototype.onPress = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_PRESS);
};
oFF.SxEventScripting.prototype.onReadLineFinished = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_READ_LINE_FINISHED);
};
oFF.SxEventScripting.prototype.onRefresh = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_REFRESH);
};
oFF.SxEventScripting.prototype.onResize = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_RESIZE);
};
oFF.SxEventScripting.prototype.onRowResize = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_ROW_RESIZE);
};
oFF.SxEventScripting.prototype.onScroll = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_SCROLL);
};
oFF.SxEventScripting.prototype.onScrollLoad = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_SCROLL_LOAD);
};
oFF.SxEventScripting.prototype.onSearch = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_SEARCH);
};
oFF.SxEventScripting.prototype.onSelect = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_SELECT);
};
oFF.SxEventScripting.prototype.onSelectionChange = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_SELECTION_CHANGE);
};
oFF.SxEventScripting.prototype.onSelectionFinish = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_SELECTION_FINISH);
};
oFF.SxEventScripting.prototype.onSuggestionSelect = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_SUGGESTION_SELECT);
};
oFF.SxEventScripting.prototype.onTableDragAndDrop = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_TABLE_DRAG_AND_DROP);
};
oFF.SxEventScripting.prototype.onTerminate = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_TERMINATE);
};
oFF.SxEventScripting.prototype.onToggle = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_TOGGLE);
};
oFF.SxEventScripting.prototype.onValueHelpRequest = function(event)
{
	this.runEventScript(event, oFF.UiEvent.ON_VALUE_HELP_REQUEST);
};
oFF.SxEventScripting.prototype.runEventScript = function(event, eventDef)
{
	if (oFF.isNull(eventDef))
	{
		throw oFF.XException.createRuntimeException("Missing event! Please specify an event!");
	}
	let control = event.getControl();
	let script = this.m_script;
	if (oFF.notNull(control))
	{
		if (oFF.isNull(this.m_uiManager))
		{
			this.m_uiManager = control.getUiManager();
		}
		if (oFF.isNull(this.m_script))
		{
			let docElement = control.getCustomObject();
			script = docElement.getStringByKey(eventDef.getName());
		}
	}
	let interpreter = oFF.ScriptEngine.create();
	interpreter.setVmCallback(this);
	interpreter.setCustomObject("event", event);
	interpreter.setCustomObject("uicontext", control);
	interpreter.setInitialRegister(control);
	interpreter.compile(script);
	interpreter.execute();
};
oFF.SxEventScripting.prototype.setupEventScripting = function(uiManager, script)
{
	this.m_uiManager = uiManager;
	this.m_script = script;
	this.m_map = oFF.XHashMapByString.create();
};

oFF.DfUiProgram = function() {};
oFF.DfUiProgram.prototype = new oFF.DfApplicationProgram();
oFF.DfUiProgram.prototype._ff_c = "DfUiProgram";

oFF.DfUiProgram.UI_PRG_CONTENT_WRAPPER_CSS = "ffUiPrgContentWrapper";
oFF.DfUiProgram.prototype.m_contentPage = null;
oFF.DfUiProgram.prototype.m_genesis = null;
oFF.DfUiProgram.prototype.m_parentGenesis = null;
oFF.DfUiProgram.prototype.m_programMenuBar = null;
oFF.DfUiProgram.prototype._createProgramMenuBarEntry = function(prgDefaultMenuBtn)
{
	if (oFF.notNull(prgDefaultMenuBtn))
	{
		let programtMenu = this.m_genesis.newControl(oFF.UiType.MENU);
		let menuItems = this.getProgramMenuItems(this.getGenesis());
		programtMenu.addAllItems(oFF.XCollectionUtils.map(menuItems, (menuItem) => {
			return menuItem;
		}));
		if (!this.isEmbedded())
		{
			if (this._hasConfigurationMetadata())
			{
				programtMenu.addNewItem().setText("Settings...").setIcon("settings").setSectionStart(true).registerOnPress(oFF.UiLambdaPressListener.create((controlEvent) => {
					this.presentSettingsDialogIfPossible();
				}));
			}
			programtMenu.addNewItem().setText("Exit").setIcon("decline").setSectionStart(true).registerOnPress(oFF.UiLambdaPressListener.create((controlEvent) => {
				this.terminate();
			}));
		}
		programtMenu.openAt(prgDefaultMenuBtn);
	}
};
oFF.DfUiProgram.prototype._getParentGenesis = function()
{
	return this.m_parentGenesis;
};
oFF.DfUiProgram.prototype._getUiPrgContainerSafe = function()
{
	let uiPrgContainer = null;
	try
	{
		uiPrgContainer = this.getProgramContainer();
	}
	catch (error)
	{
		this.logWarning(oFF.XException.getMessage(error));
	}
	return uiPrgContainer;
};
oFF.DfUiProgram.prototype._handleStartupError = function(error)
{
	let errorMsg = oFF.XStringUtils.concatenate4("Failed to start ", this.getProgramName(), "! Error: ", error.getText());
	if (error.getThrowable() !== null)
	{
		oFF.XLogger.println(oFF.XException.getStackTrace(error.getThrowable(), 0));
	}
	if (this.getResolvedProgramContainerType().isEmbeddedContainer())
	{
		let errorStrip = this._getParentGenesis().newRoot(oFF.UiType.MESSAGE_STRIP);
		errorStrip.setMessageType(oFF.UiMessageType.ERROR);
		errorStrip.setText(errorMsg);
		oFF.XLogger.println(errorMsg);
	}
	else
	{
		this._getParentGenesis().showErrorToast(errorMsg);
	}
	this.kill();
};
oFF.DfUiProgram.prototype._hideSetupPromiseBusyIndicatorIfNeeded = function()
{
	if (this.showActivityIndicatorOnSetupPromise() && !this.isReleased())
	{
		this.setBusy(false);
	}
};
oFF.DfUiProgram.prototype._prepareProgramShell = function()
{
	if (this._shouldWrapContentInPage())
	{
		this.m_contentPage = this._getParentGenesis().newControl(oFF.UiType.PAGE);
		this.m_contentPage.addCssClass(oFF.DfUiProgram.UI_PRG_CONTENT_WRAPPER_CSS);
		this.m_contentPage.useMaxSpace();
		this.m_contentPage.setShowHeader(false);
		this.m_contentPage.setShowNavButton(false);
		this.m_contentPage.setContentOnlyBusy(true);
		this.m_contentPage.setEnableScrolling(true);
		if (this.isShowMenuBar())
		{
			this.m_programMenuBar = this._getParentGenesis().newControl(oFF.UiType.OVERFLOW_TOOLBAR);
			this.m_programMenuBar.setToolbarDesign(oFF.UiToolbarDesign.SOLID);
			this.m_programMenuBar.setWidth(oFF.UiCssLength.create("100%"));
			if (oFF.XStringUtils.isNotNullAndNotEmpty(this.getMenuBarDisplayName()) && !this.isEmbedded())
			{
				this.addMenuBarButton(this.getMenuBarDisplayName(), null, (controlEvent) => {
					let control = controlEvent.getControl();
					this._createProgramMenuBarEntry(control);
				});
			}
			this.m_contentPage.setSubHeader(this.m_programMenuBar);
		}
		this._getParentGenesis().setRoot(this.m_contentPage);
		let pageGenesis = oFF.UiGenesis.create(this.m_contentPage);
		this._proceedWithStartup(pageGenesis);
	}
	else
	{
		let contentWrapper = this._getParentGenesis().newControl(oFF.UiType.CONTENT_WRAPPER);
		contentWrapper.addCssClass(oFF.DfUiProgram.UI_PRG_CONTENT_WRAPPER_CSS);
		contentWrapper.useMaxSpace();
		this._getParentGenesis().setRoot(contentWrapper);
		let contentGenesis = oFF.UiGenesis.create(contentWrapper);
		this._proceedWithStartup(contentGenesis);
	}
};
oFF.DfUiProgram.prototype._proceedWithStartup = function(genesis)
{
	this.m_genesis = genesis;
	try
	{
		let setupPromise = this.setupProgram();
		if (oFF.isNull(setupPromise))
		{
			this.buildUi(genesis);
		}
		else
		{
			this._showSetupPromiseBusyIndicatorIfNeeded();
			setupPromise.onThen((boolVal) => {
				if (!this.isReleased() && (oFF.isNull(boolVal) || boolVal.getBoolean()))
				{
					this.buildUi(genesis);
				}
				else
				{
					this.logWarning3("The ", this.getProgramName(), " program execution was explicitly cancelled!");
					this.kill();
				}
			}).onCatch((error) => {
				this._handleStartupError(error);
			}).onFinally(() => {
				this._hideSetupPromiseBusyIndicatorIfNeeded();
			});
		}
	}
	catch (exception)
	{
		this._handleStartupError(oFF.XError.createWithThrowable(exception));
	}
};
oFF.DfUiProgram.prototype._shouldWrapContentInPage = function()
{
	return this.getUiManager().getPlatform().isTypeOf(oFF.XPlatform.IOS) === false && (this.getResolvedProgramContainerType() === oFF.ProgramContainerType.WINDOW || this.getResolvedProgramContainerType() === oFF.ProgramContainerType.STANDALONE || this.getResolvedProgramContainerType() === oFF.ProgramContainerType.CONTENT);
};
oFF.DfUiProgram.prototype._showSetupPromiseBusyIndicatorIfNeeded = function()
{
	if (this.showActivityIndicatorOnSetupPromise() && !this.isReleased())
	{
		this.setBusy(true);
	}
};
oFF.DfUiProgram.prototype.addMenuBarButton = function(text, icon, pressConsumer)
{
	if (this.getMenuBar() !== null)
	{
		let tmpMenuBarButton = this.getMenuBar().addNewItemOfType(oFF.UiType.BUTTON);
		tmpMenuBarButton.setButtonType(oFF.UiButtonType.TRANSPARENT);
		tmpMenuBarButton.setText(text);
		tmpMenuBarButton.setIcon(icon);
		tmpMenuBarButton.registerOnPress(oFF.UiLambdaPressListener.create(pressConsumer));
		return tmpMenuBarButton;
	}
	return oFF.UiContextDummy.getSingleton().getContent();
};
oFF.DfUiProgram.prototype.getComponentType = function()
{
	return oFF.UiComponentTypeExt.UI_PROGRAM;
};
oFF.DfUiProgram.prototype.getContainerCssClass = function()
{
	return null;
};
oFF.DfUiProgram.prototype.getContainerName = function()
{
	return null;
};
oFF.DfUiProgram.prototype.getDefaultContainerPosition = function()
{
	return null;
};
oFF.DfUiProgram.prototype.getDefaultContainerSize = function()
{
	return null;
};
oFF.DfUiProgram.prototype.getDefaultContainerType = function()
{
	return oFF.ProgramContainerType.WINDOW;
};
oFF.DfUiProgram.prototype.getDialogButtons = function(genesis)
{
	return null;
};
oFF.DfUiProgram.prototype.getDialogCustomFooterToolbar = function(genesis)
{
	return null;
};
oFF.DfUiProgram.prototype.getDialogCustomHeaderToolbar = function(genesis)
{
	return null;
};
oFF.DfUiProgram.prototype.getDialogState = function()
{
	return null;
};
oFF.DfUiProgram.prototype.getGenesis = function()
{
	return this.m_genesis;
};
oFF.DfUiProgram.prototype.getLocalStorage = function()
{
	return this.getProcess().getLocalStorage();
};
oFF.DfUiProgram.prototype.getLocalization = function()
{
	return this.getProcess().getKernel().getLocalizationCenter();
};
oFF.DfUiProgram.prototype.getMenuBar = function()
{
	if (oFF.notNull(this.m_programMenuBar))
	{
		return this.m_programMenuBar;
	}
	return oFF.UiContextDummy.getSingleton();
};
oFF.DfUiProgram.prototype.getMenuBarDisplayName = function()
{
	if (this.getProcess() !== null)
	{
		let prgCfg = this.getProcess().getProgramCfg();
		if (oFF.notNull(prgCfg))
		{
			let menuBarName = prgCfg.getProgramManifest().getDisplayName();
			if (oFF.XStringUtils.isNullOrEmpty(menuBarName))
			{
				menuBarName = prgCfg.getProgramManifest().getProgramName();
			}
			return menuBarName;
		}
	}
	return "PrgMenu";
};
oFF.DfUiProgram.prototype.getNotificationCenter = function()
{
	return this.getProcess().getNotificationCenter();
};
oFF.DfUiProgram.prototype.getOffsetHeight = function()
{
	let uiPrgContainer = this._getUiPrgContainerSafe();
	if (oFF.notNull(uiPrgContainer))
	{
		return uiPrgContainer.getOffsetHeight();
	}
	return 0;
};
oFF.DfUiProgram.prototype.getOffsetWidth = function()
{
	let uiPrgContainer = this._getUiPrgContainerSafe();
	if (oFF.notNull(uiPrgContainer))
	{
		return uiPrgContainer.getOffsetWidth();
	}
	return 0;
};
oFF.DfUiProgram.prototype.getProcessSharedDataSpace = function(spaceName)
{
	return this.getProcess().getSharedDataSpace(spaceName);
};
oFF.DfUiProgram.prototype.getProgramMenuItems = function(genesis)
{
	return null;
};
oFF.DfUiProgram.prototype.getProgramType = function()
{
	return oFF.ProgramType.UI;
};
oFF.DfUiProgram.prototype.getTitle = function()
{
	let programContainer = this.getProgramContainer();
	if (oFF.notNull(programContainer))
	{
		return programContainer.getTitle();
	}
	return "";
};
oFF.DfUiProgram.prototype.getUiManager = function()
{
	let uiManager = this.getProcess().getUiManager();
	if (oFF.isNull(uiManager))
	{
		uiManager = this.getProcess().openSubSystem(oFF.SubSystemType.GUI);
	}
	if (oFF.isNull(uiManager) && oFF.notNull(this.m_genesis))
	{
		uiManager = this.m_genesis.getUiManager();
	}
	return uiManager;
};
oFF.DfUiProgram.prototype.getWindowMenuItems = function(genesis)
{
	return null;
};
oFF.DfUiProgram.prototype.isBusy = function()
{
	let uiPrgContainer = this._getUiPrgContainerSafe();
	if (oFF.notNull(uiPrgContainer))
	{
		return uiPrgContainer.isBusy();
	}
	return false;
};
oFF.DfUiProgram.prototype.isEmbedded = function()
{
	return this.getResolvedProgramContainerType() !== null && this.getResolvedProgramContainerType().isEmbeddedContainer();
};
oFF.DfUiProgram.prototype.isMenuBarVisible = function()
{
	if (oFF.isNull(this.m_programMenuBar))
	{
		return false;
	}
	if (oFF.notNull(this.m_contentPage))
	{
		return this.m_contentPage.isShowSubHeader();
	}
	return false;
};
oFF.DfUiProgram.prototype.isOpenContainerMaximized = function()
{
	return false;
};
oFF.DfUiProgram.prototype.isResizeAllowed = function()
{
	return false;
};
oFF.DfUiProgram.prototype.isShowMenuBar = function()
{
	return false;
};
oFF.DfUiProgram.prototype.isStandalone = function()
{
	return this.getResolvedProgramContainerType() === oFF.ProgramContainerType.STANDALONE;
};
oFF.DfUiProgram.prototype.onContainerResize = function(newWidth, newHeight) {};
oFF.DfUiProgram.prototype.presentExitConfirmPopup = function(title, message)
{
	let exitConfirmPopup = oFF.UtConfirmPopup.create(this.getGenesis(), title, message);
	exitConfirmPopup.setConfirmButtonText("Exit");
	exitConfirmPopup.setConfirmButtonIcon("delete");
	exitConfirmPopup.setConfirmButtonType(oFF.UiButtonType.DESTRUCTIVE);
	exitConfirmPopup.setConfirmProcedure(() => {
		this.kill();
	});
	exitConfirmPopup.open();
};
oFF.DfUiProgram.prototype.presentSettingsDialogIfPossible = function()
{
	let settingsRunner = oFF.ProgramRunner.createRunner(this.getProcess(), "SettingsDialog");
	settingsRunner.setStringArgument("configurationName", this._getConfigurationMetadata().getName());
	settingsRunner.setBooleanArgument("userMode", true);
	settingsRunner.setProgramTerminatedConsumer((exitData) => {
		let hasChanges = oFF.notNull(exitData) ? exitData.getBooleanByKeyExt("hasChanges", false) : false;
		if (hasChanges)
		{
			this._reloadConfiguration();
		}
	});
	settingsRunner.runProgram();
};
oFF.DfUiProgram.prototype.releaseObject = function()
{
	this.m_programMenuBar = oFF.XObjectExt.release(this.m_programMenuBar);
	this.m_contentPage = oFF.XObjectExt.release(this.m_contentPage);
	this.m_genesis = oFF.XObjectExt.release(this.m_genesis);
	this.m_parentGenesis = null;
	oFF.DfApplicationProgram.prototype.releaseObject.call( this );
};
oFF.DfUiProgram.prototype.removeMenuBarButton = function(buttonToRemove)
{
	if (this.getMenuBar() !== null && oFF.notNull(buttonToRemove) && this.getMenuBar().getItems().contains(buttonToRemove))
	{
		this.getMenuBar().removeItem(buttonToRemove);
	}
};
oFF.DfUiProgram.prototype.renderUi = function(genesis)
{
	if (oFF.isNull(this.m_parentGenesis))
	{
		this.m_parentGenesis = genesis;
	}
	else
	{
		throw oFF.XException.createRuntimeException("Genesis already set! Cannot change program genesis during runtime!");
	}
	this.runProgram();
};
oFF.DfUiProgram.prototype.runProcess = function()
{
	if (this._getParentGenesis() === null)
	{
		throw oFF.XException.createRuntimeException("Missing genesis object, cannot render the UI. Please specify a genesis container object!");
	}
	this._prepareProgramShell();
	return true;
};
oFF.DfUiProgram.prototype.setBusy = function(busy)
{
	let uiPrgContainer = this._getUiPrgContainerSafe();
	if (oFF.notNull(uiPrgContainer))
	{
		uiPrgContainer.setBusy(busy);
	}
};
oFF.DfUiProgram.prototype.setContainerSize = function(newSize)
{
	let uiPrgContainer = this._getUiPrgContainerSafe();
	if (oFF.notNull(uiPrgContainer))
	{
		uiPrgContainer.setContainerSize(newSize);
	}
};
oFF.DfUiProgram.prototype.setInitialControlToFocus = function(control)
{
	let uiPrgContainer = this._getUiPrgContainerSafe();
	if (oFF.notNull(uiPrgContainer))
	{
		uiPrgContainer.setInitialControlToFocus(control);
	}
};
oFF.DfUiProgram.prototype.setTitle = function(title)
{
	let programContainer = this.getProgramContainer();
	if (oFF.notNull(programContainer))
	{
		programContainer.setTitle(title);
	}
};
oFF.DfUiProgram.prototype.showActivityIndicatorOnSetupPromise = function()
{
	return true;
};
oFF.DfUiProgram.prototype.showMenuBar = function(show)
{
	if (oFF.notNull(this.m_contentPage))
	{
		this.m_contentPage.setShowSubHeader(show);
	}
};

oFF.DfUiPrgContainerEmbedded = function() {};
oFF.DfUiPrgContainerEmbedded.prototype = new oFF.DfUiPrgContainer();
oFF.DfUiPrgContainerEmbedded.prototype._ff_c = "DfUiPrgContainerEmbedded";

oFF.DfUiPrgContainerEmbedded.prototype.m_isContainerOpen = false;
oFF.DfUiPrgContainerEmbedded.prototype.cleanupContainer = function() {};
oFF.DfUiPrgContainerEmbedded.prototype.closeContainerControl = function()
{
	this.m_isContainerOpen = false;
};
oFF.DfUiPrgContainerEmbedded.prototype.deregisterContainerEvents = function() {};
oFF.DfUiPrgContainerEmbedded.prototype.getContainerOffsetHeight = function()
{
	return 0;
};
oFF.DfUiPrgContainerEmbedded.prototype.getContainerOffsetWidth = function()
{
	return 0;
};
oFF.DfUiPrgContainerEmbedded.prototype.isContainerOpen = function()
{
	return this.m_isContainerOpen;
};
oFF.DfUiPrgContainerEmbedded.prototype.isFloatingContainer = function()
{
	return false;
};
oFF.DfUiPrgContainerEmbedded.prototype.isModalContainer = function()
{
	return false;
};
oFF.DfUiPrgContainerEmbedded.prototype.openContainerControl = function()
{
	this.m_isContainerOpen = true;
};
oFF.DfUiPrgContainerEmbedded.prototype.setContainerControlSize = function(newSize) {};
oFF.DfUiPrgContainerEmbedded.prototype.setContainerOpened = function()
{
	this.m_isContainerOpen = true;
	this.notifyContainerOpened();
};
oFF.DfUiPrgContainerEmbedded.prototype.setupUiContainer = function(startCfg, program)
{
	this.m_isContainerOpen = false;
	oFF.DfUiPrgContainer.prototype.setupUiContainer.call( this , startCfg, program);
};

oFF.DfUiPrgContainerFloating = function() {};
oFF.DfUiPrgContainerFloating.prototype = new oFF.DfUiPrgContainer();
oFF.DfUiPrgContainerFloating.prototype._ff_c = "DfUiPrgContainerFloating";

oFF.DfUiPrgContainerFloating.prototype.getInitialContainerPosition = function()
{
	let startCfg = this.getStartCfg();
	let initialContainerPosition = null;
	let manifestCssPosX = startCfg.getInitialContainerCssPosX();
	let manifestCssPosY = startCfg.getInitialContainerCssPosY();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(manifestCssPosX) || oFF.XStringUtils.isNotNullAndNotEmpty(manifestCssPosY))
	{
		initialContainerPosition = oFF.UiPosition.createByCss(manifestCssPosX, manifestCssPosY);
	}
	let uiProgram = this.getUiProgram();
	if (oFF.isNull(initialContainerPosition) && oFF.notNull(uiProgram))
	{
		initialContainerPosition = uiProgram.getDefaultContainerPosition();
	}
	return initialContainerPosition;
};
oFF.DfUiPrgContainerFloating.prototype.getInitialContainerSize = function()
{
	let startCfg = this.getStartCfg();
	let initialContainerSize = null;
	let manifestCssWidth = startCfg.getInitialContainerCssWidth();
	let manifestCssHeight = startCfg.getInitialContainerCssHeight();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(manifestCssWidth) || oFF.XStringUtils.isNotNullAndNotEmpty(manifestCssHeight))
	{
		initialContainerSize = oFF.UiSize.createByCss(manifestCssWidth, manifestCssHeight);
	}
	let uiProgram = this.getUiProgram();
	if (oFF.isNull(initialContainerSize) && oFF.notNull(uiProgram))
	{
		if (uiProgram.getDefaultContainerSize() !== null)
		{
			initialContainerSize = uiProgram.getDefaultContainerSize();
		}
	}
	return initialContainerSize;
};
oFF.DfUiPrgContainerFloating.prototype.isFloatingContainer = function()
{
	return true;
};
oFF.DfUiPrgContainerFloating.prototype.notifyContainerResized = function(newWidth, newHeight)
{
	if (this.getUiProgram() !== null)
	{
		this.getUiProgram().onContainerResize(newWidth, newHeight);
	}
};
oFF.DfUiPrgContainerFloating.prototype.shouldContainerOpenMaximized = function()
{
	let startCfg = this.getStartCfg();
	let initiallyMaximized = false;
	if (this.getUiProgram() !== null)
	{
		initiallyMaximized = this.getUiProgram().isOpenContainerMaximized();
	}
	if (startCfg.isInitiallyContainerMaximized())
	{
		initiallyMaximized = startCfg.isInitiallyContainerMaximized();
	}
	return initiallyMaximized;
};

oFF.QuasarComponentType = function() {};
oFF.QuasarComponentType.prototype = new oFF.XComponentType();
oFF.QuasarComponentType.prototype._ff_c = "QuasarComponentType";

oFF.QuasarComponentType.JSON_DATA_PROVIDER = null;
oFF.QuasarComponentType.REST_DATA_PROVIDER = null;
oFF.QuasarComponentType.createQuasarType = function(constant, parent)
{
	let mt = new oFF.QuasarComponentType();
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
oFF.QuasarComponentType.staticSetupQuasarType = function()
{
	oFF.QuasarComponentType.JSON_DATA_PROVIDER = oFF.QuasarComponentType.createQuasarType("JsonDataProvider", oFF.IoComponentType.DATA_PROVIDER);
	oFF.QuasarComponentType.REST_DATA_PROVIDER = oFF.QuasarComponentType.createQuasarType("RestDataProvider", oFF.IoComponentType.DATA_PROVIDER);
};

oFF.DfUiDialogProgram = function() {};
oFF.DfUiDialogProgram.prototype = new oFF.DfUiProgram();
oFF.DfUiDialogProgram.prototype._ff_c = "DfUiDialogProgram";

oFF.DfUiDialogProgram.prototype._getDialogPrgContainer = function()
{
	let dialogPrgContainer = null;
	try
	{
		let tmpDialogPrgContainer = this.getProgramContainer();
		if (oFF.notNull(tmpDialogPrgContainer) && tmpDialogPrgContainer.getContainerType() === oFF.ProgramContainerType.DIALOG)
		{
			dialogPrgContainer = tmpDialogPrgContainer;
		}
	}
	catch (e)
	{
		this.log("Not a dialog container");
	}
	return dialogPrgContainer;
};
oFF.DfUiDialogProgram.prototype.getComponentType = function()
{
	return oFF.UiComponentTypeExt.UI_DIALOG_PROGRAM;
};
oFF.DfUiDialogProgram.prototype.getDefaultContainerType = function()
{
	return oFF.ProgramContainerType.DIALOG;
};
oFF.DfUiDialogProgram.prototype.getDialogButtons = function(genesis)
{
	return null;
};
oFF.DfUiDialogProgram.prototype.getDialogCustomFooterToolbar = function(genesis)
{
	return null;
};
oFF.DfUiDialogProgram.prototype.getDialogCustomHeaderToolbar = function(genesis)
{
	return null;
};
oFF.DfUiDialogProgram.prototype.getDialogState = function()
{
	return null;
};
oFF.DfUiDialogProgram.prototype.isShowMenuBar = function()
{
	return false;
};
oFF.DfUiDialogProgram.prototype.releaseObject = function()
{
	oFF.DfUiProgram.prototype.releaseObject.call( this );
};
oFF.DfUiDialogProgram.prototype.shake = function()
{
	let dialogPrgContainer = this._getDialogPrgContainer();
	if (oFF.notNull(dialogPrgContainer))
	{
		dialogPrgContainer.shake();
	}
};

oFF.DfUiPrgContainerGenericWindow = function() {};
oFF.DfUiPrgContainerGenericWindow.prototype = new oFF.DfUiPrgContainerFloating();
oFF.DfUiPrgContainerGenericWindow.prototype._ff_c = "DfUiPrgContainerGenericWindow";

oFF.DfUiPrgContainerGenericWindow.prototype.m_containerWindow = null;
oFF.DfUiPrgContainerGenericWindow.prototype.m_taskBarButton = null;
oFF.DfUiPrgContainerGenericWindow.prototype._createTaskBarButtonMenu = function(taskBarButton)
{
	let contextMenu = this.getGenesis().newControl(oFF.UiType.MENU);
	let closePrgMenuItem = contextMenu.addNewItem();
	closePrgMenuItem.setText("Close program");
	closePrgMenuItem.setIcon("decline");
	closePrgMenuItem.registerOnPress(oFF.UiLambdaPressListener.create((controlEvent) => {
		this.terminateProgram();
	}));
	closePrgMenuItem.setCustomObject(taskBarButton);
	let toggleVisibillityMenuItem = contextMenu.addNewItem();
	toggleVisibillityMenuItem.setText(this.getWindow().isHidden() ? "Show" : "Hide");
	toggleVisibillityMenuItem.setIcon(this.getWindow().isHidden() ? "header" : "minimize");
	toggleVisibillityMenuItem.registerOnPress(oFF.UiLambdaPressListener.create((controlEvent) => {
		this._toggleContainerWindowVisibillityState();
	}));
	toggleVisibillityMenuItem.setCustomObject(taskBarButton);
	let splitLeftMenuItem = contextMenu.addNewItem();
	splitLeftMenuItem.setText("Split left");
	splitLeftMenuItem.setIcon("slim-arrow-left");
	splitLeftMenuItem.registerOnPress(oFF.UiLambdaPressListener.create((controlEvent) => {
		this._handleSplitWindowLeft();
	}));
	splitLeftMenuItem.setCustomObject(taskBarButton);
	let splitRightMenuItem = contextMenu.addNewItem();
	splitRightMenuItem.setText("Split right");
	splitRightMenuItem.setIcon("slim-arrow-right");
	splitRightMenuItem.registerOnPress(oFF.UiLambdaPressListener.create((controlEvent) => {
		this._handleSplitWindowRight();
	}));
	splitRightMenuItem.setCustomObject(taskBarButton);
	return contextMenu;
};
oFF.DfUiPrgContainerGenericWindow.prototype._createWindowMenuIfAvailable = function()
{
	let tmpMenuItems = this._getWindowMenuItems();
	if (oFF.notNull(tmpMenuItems) && tmpMenuItems.size() > 0)
	{
		this.getWindow().registerOnMenuPress(oFF.UiLambdaMenuPressListener.create((controlEvent) => {
			let posX = controlEvent.getParameters().getIntegerByKeyExt(oFF.UiEventParams.PARAM_MENU_X, -1);
			let posy = controlEvent.getParameters().getIntegerByKeyExt(oFF.UiEventParams.PARAM_MENU_Y, -1);
			let windowMenu = this.getGenesis().newControl(oFF.UiType.MENU);
			windowMenu.addAllItems(oFF.XCollectionUtils.map(tmpMenuItems, (menuItem) => {
				return menuItem;
			}));
			windowMenu.openAtPosition(posX, posy);
		}));
	}
};
oFF.DfUiPrgContainerGenericWindow.prototype._getTaskBarButton = function()
{
	return this.m_taskBarButton;
};
oFF.DfUiPrgContainerGenericWindow.prototype._getWindowMenuItems = function()
{
	if (this.getUiProgram() !== null)
	{
		return this.getUiProgram().getWindowMenuItems(this.getGenesis());
	}
	return null;
};
oFF.DfUiPrgContainerGenericWindow.prototype._handleSplitWindowLeft = function()
{
	this._handleTaskBarbuttonPress(false);
	this.getWindow().setFrameCss("0px", "0px", "50%", "100%");
};
oFF.DfUiPrgContainerGenericWindow.prototype._handleSplitWindowRight = function()
{
	this._handleTaskBarbuttonPress(false);
	this.getWindow().setFrameCss("50%", "0px", "50%", "100%");
};
oFF.DfUiPrgContainerGenericWindow.prototype._handleTaskBarbuttonPress = function(animated)
{
	if (this.getWindow().isHidden())
	{
		this.getWindow().show(animated, this._getTaskBarButton());
	}
	else
	{
		this.getWindow().bringToFront();
	}
};
oFF.DfUiPrgContainerGenericWindow.prototype._removeTaskBarButtonFromParent = function()
{
	let tempTaskBarBtn = this._getTaskBarButton();
	if (oFF.notNull(tempTaskBarBtn))
	{
		let taskBarBtnParent = tempTaskBarBtn.getParent();
		if (oFF.notNull(taskBarBtnParent) && taskBarBtnParent.getUiType() === oFF.UiType.TASK_BAR)
		{
			taskBarBtnParent.removeItem(tempTaskBarBtn);
		}
	}
};
oFF.DfUiPrgContainerGenericWindow.prototype._toggleContainerWindowMaximizedState = function()
{
	if (this.getWindow().isMaximized())
	{
		this.getWindow().restore(true);
	}
	else
	{
		this.getWindow().maximize(true);
	}
};
oFF.DfUiPrgContainerGenericWindow.prototype._toggleContainerWindowVisibillityState = function()
{
	if (this.getWindow().isHidden())
	{
		this.getWindow().show(true, this._getTaskBarButton());
	}
	else
	{
		this.getWindow().hide(true, this._getTaskBarButton());
	}
};
oFF.DfUiPrgContainerGenericWindow.prototype.cleanupContainer = function()
{
	this._removeTaskBarButtonFromParent();
};
oFF.DfUiPrgContainerGenericWindow.prototype.closeContainerControl = function()
{
	if (this.getWindow() !== null && this.isContainerOpen())
	{
		this.getWindow().close();
	}
};
oFF.DfUiPrgContainerGenericWindow.prototype.deregisterContainerEvents = function()
{
	if (this.getWindow() !== null)
	{
		this.getWindow().registerOnOpen(null);
		this.getWindow().registerOnClose(null);
	}
};
oFF.DfUiPrgContainerGenericWindow.prototype.getContainerOffsetHeight = function()
{
	if (this.getWindow() !== null)
	{
		return this.getWindow().getOffsetHeight();
	}
	return 0;
};
oFF.DfUiPrgContainerGenericWindow.prototype.getContainerOffsetWidth = function()
{
	if (this.getWindow() !== null)
	{
		return this.getWindow().getOffsetWidth();
	}
	return 0;
};
oFF.DfUiPrgContainerGenericWindow.prototype.getWindow = function()
{
	return this.m_containerWindow;
};
oFF.DfUiPrgContainerGenericWindow.prototype.isContainerOpen = function()
{
	if (this.getWindow() !== null)
	{
		return this.getWindow().isOpen();
	}
	return false;
};
oFF.DfUiPrgContainerGenericWindow.prototype.isModalContainer = function()
{
	return false;
};
oFF.DfUiPrgContainerGenericWindow.prototype.onButtonPress = function(event)
{
	let pressedButtonName = event.getParameters().getStringByKeyExt(oFF.UiEventParams.PARAM_PRESSED_BUTTON_TYPE, null);
	let pressedButtonType = oFF.UiPressedButtonType.lookup(pressedButtonName);
	if (oFF.notNull(pressedButtonType) && pressedButtonType === oFF.UiPressedButtonType.HIDE)
	{
		this._toggleContainerWindowVisibillityState();
	}
	if (oFF.notNull(pressedButtonType) && pressedButtonType === oFF.UiPressedButtonType.MAXIMIZE)
	{
		this._toggleContainerWindowMaximizedState();
	}
	if (oFF.notNull(pressedButtonType) && pressedButtonType === oFF.UiPressedButtonType.CLOSE)
	{
		this.terminateProgram();
	}
};
oFF.DfUiPrgContainerGenericWindow.prototype.onClose = function(event)
{
	this.killProgram();
};
oFF.DfUiPrgContainerGenericWindow.prototype.onMoveEnd = function(event) {};
oFF.DfUiPrgContainerGenericWindow.prototype.onOpen = function(event)
{
	this.notifyContainerOpened();
};
oFF.DfUiPrgContainerGenericWindow.prototype.openAndRun = function(uiManager)
{
	oFF.DfUiPrgContainerFloating.prototype.openAndRun.call( this , uiManager);
};
oFF.DfUiPrgContainerGenericWindow.prototype.openContainerControl = function()
{
	if (this.getWindow() !== null && !this.isContainerOpen())
	{
		this.getWindow().open();
	}
};
oFF.DfUiPrgContainerGenericWindow.prototype.releaseObject = function()
{
	oFF.DfUiPrgContainerFloating.prototype.releaseObject.call( this );
	this.m_taskBarButton = null;
	this.m_containerWindow = oFF.XObjectExt.release(this.m_containerWindow);
};
oFF.DfUiPrgContainerGenericWindow.prototype.setContainerControlSize = function(newSize)
{
	if (this.getWindow() !== null)
	{
		this.getWindow().setSize(newSize);
	}
};
oFF.DfUiPrgContainerGenericWindow.prototype.setContainerWindow = function(containerWindow)
{
	this.m_containerWindow = containerWindow;
	if (this.getInitialContainerSize() !== null)
	{
		this.m_containerWindow.setSize(this.getInitialContainerSize());
	}
	if (this.getInitialContainerPosition() !== null)
	{
		this.m_containerWindow.setPosition(this.getInitialContainerPosition());
	}
	if (this.shouldContainerOpenMaximized())
	{
		this.m_containerWindow.maximize(false);
	}
	this._createWindowMenuIfAvailable();
};
oFF.DfUiPrgContainerGenericWindow.prototype.setTaskBarButton = function(taskBarBtn)
{
	if (oFF.notNull(taskBarBtn))
	{
		this.m_taskBarButton = taskBarBtn;
		this.m_taskBarButton.registerOnPress(oFF.UiLambdaPressListener.create((controlEvent) => {
			this._handleTaskBarbuttonPress(true);
		}));
		this.m_taskBarButton.registerOnContextMenu(oFF.UiLambdaContextMenuListener.create((controlEvent) => {
			let posX = controlEvent.getParameters().getIntegerByKeyExt(oFF.UiEventParams.PARAM_CLICK_X, 0);
			let posY = controlEvent.getParameters().getIntegerByKeyExt(oFF.UiEventParams.PARAM_CLICK_Y, 0);
			let contextMenu = this._createTaskBarButtonMenu(this.m_taskBarButton);
			if (oFF.notNull(contextMenu))
			{
				contextMenu.openAtPosition(posX, posY);
			}
		}));
	}
};
oFF.DfUiPrgContainerGenericWindow.prototype.setTitle = function(title)
{
	oFF.DfUiPrgContainerFloating.prototype.setTitle.call( this , title);
	if (this.getWindow() !== null)
	{
		this.getWindow().setTitle(title);
	}
	if (this._getTaskBarButton() !== null)
	{
		this._getTaskBarButton().setText(title);
	}
};

oFF.UiPrgContainerContent = function() {};
oFF.UiPrgContainerContent.prototype = new oFF.DfUiPrgContainerEmbedded();
oFF.UiPrgContainerContent.prototype._ff_c = "UiPrgContainerContent";

oFF.UiPrgContainerContent.createExt = function(startCfg, program)
{
	let container = new oFF.UiPrgContainerContent();
	container.setupContainer(startCfg, program);
	return container;
};
oFF.UiPrgContainerContent.prototype.m_contentControl = null;
oFF.UiPrgContainerContent.prototype.getContainerType = function()
{
	return oFF.ProgramContainerType.CONTENT;
};
oFF.UiPrgContainerContent.prototype.isContainerBusy = function()
{
	if (oFF.notNull(this.m_contentControl))
	{
		return this.m_contentControl.isBusy();
	}
	return false;
};
oFF.UiPrgContainerContent.prototype.openAndRun = function(uiManager)
{
	let uiProgram = this.getUiProgram();
	uiProgram.initializeProgram().onFinally(() => {
		let genesis = oFF.UiGenesis.create(this.m_contentControl);
		genesis.clearUi();
		this.setContainerNameAndCssClass(this.m_contentControl);
		uiProgram.renderUi(genesis);
		this.setContainerOpened();
	});
};
oFF.UiPrgContainerContent.prototype.runFull = function()
{
	try
	{
		let process = this.getProcess();
		let startConfiguration = process.getProgramCfg();
		this.m_contentControl = startConfiguration.getAnchorContentControl();
	}
	catch (e)
	{
		this.m_contentControl = null;
	}
	if (oFF.isNull(this.m_contentControl) || !this.m_contentControl.hasProperty(oFF.UiProperty.CONTENT))
	{
		throw oFF.XException.createRuntimeException("Missing content control! A content program container requires a content based control to be specified!");
	}
	else
	{
		this.openAndRun(this.getUiManager());
	}
};
oFF.UiPrgContainerContent.prototype.setContainerBusy = function(busy)
{
	if (oFF.notNull(this.m_contentControl))
	{
		this.m_contentControl.setBusy(busy);
	}
};

oFF.UiPrgContainerDialog = function() {};
oFF.UiPrgContainerDialog.prototype = new oFF.DfUiPrgContainerFloating();
oFF.UiPrgContainerDialog.prototype._ff_c = "UiPrgContainerDialog";

oFF.UiPrgContainerDialog.DIALOG_PRG_CONTAINER_TAG = "ffDialogPrgContainer";
oFF.UiPrgContainerDialog.createExt = function(startCfg, program)
{
	let dialogContainer = new oFF.UiPrgContainerDialog();
	dialogContainer.setupContainer(startCfg, program);
	return dialogContainer;
};
oFF.UiPrgContainerDialog.prototype.m_containerDialog = null;
oFF.UiPrgContainerDialog.prototype._addAutoCreatedCloseButton = function()
{
	let autoCreatedCloseBtn = this.getDialog().addNewDialogButton();
	autoCreatedCloseBtn.setText("Close");
	autoCreatedCloseBtn.registerOnPress(oFF.UiLambdaPressListener.create((controlEvent) => {
		this.terminateProgram();
	}));
	this.setInitialControlToFocus(autoCreatedCloseBtn);
};
oFF.UiPrgContainerDialog.prototype._canResize = function()
{
	if (this.getUiProgram() !== null)
	{
		return this.getUiProgram().isResizeAllowed();
	}
	return false;
};
oFF.UiPrgContainerDialog.prototype._getDialogButtons = function()
{
	if (this.getUiProgram() !== null)
	{
		return this.getUiProgram().getDialogButtons(this.getGenesis());
	}
	return null;
};
oFF.UiPrgContainerDialog.prototype._getDialogCustomFooterToolbar = function()
{
	if (this.getUiProgram() !== null)
	{
		return this.getUiProgram().getDialogCustomHeaderToolbar(this.getGenesis());
	}
	return null;
};
oFF.UiPrgContainerDialog.prototype._getDialogCustomHeaderToolbar = function()
{
	if (this.getUiProgram() !== null)
	{
		return this.getUiProgram().getDialogCustomHeaderToolbar(this.getGenesis());
	}
	return null;
};
oFF.UiPrgContainerDialog.prototype._getDialogState = function()
{
	if (this.getUiProgram() !== null)
	{
		return this.getUiProgram().getDialogState();
	}
	return null;
};
oFF.UiPrgContainerDialog.prototype._setContainerDialog = function(dialog)
{
	this.m_containerDialog = dialog;
	this.setContainerNameAndCssClass(dialog);
	if (this.getInitialContainerSize() !== null)
	{
		this.m_containerDialog.setSize(this.getInitialContainerSize());
	}
	let dlgBtns = this._getDialogButtons();
	if (oFF.notNull(dlgBtns) && dlgBtns.size() > 0)
	{
		this.getDialog().addAllDialogButtons(dlgBtns);
		this.setInitialControlToFocus(dlgBtns.get(0));
	}
	else
	{
		this._addAutoCreatedCloseButton();
	}
	let tmpHeaderToolbar = this._getDialogCustomHeaderToolbar();
	if (oFF.notNull(tmpHeaderToolbar))
	{
		this.getDialog().setHeaderToolbar(tmpHeaderToolbar);
	}
	let tmpFooterToolbar = this._getDialogCustomFooterToolbar();
	if (oFF.notNull(tmpFooterToolbar))
	{
		this.getDialog().setFooterToolbar(tmpFooterToolbar);
	}
	let valueState = this._getDialogState();
	if (oFF.notNull(valueState))
	{
		this.getDialog().setState(valueState);
	}
};
oFF.UiPrgContainerDialog.prototype._setInitialFocus = function()
{
	if (this.getDialog() !== null)
	{
		this.getDialog().setInitialFocus(this.getInitialControlToFocus());
	}
};
oFF.UiPrgContainerDialog.prototype.cleanupContainer = function() {};
oFF.UiPrgContainerDialog.prototype.closeContainerControl = function()
{
	if (this.getDialog() !== null && this.isContainerOpen())
	{
		this.getDialog().close();
	}
};
oFF.UiPrgContainerDialog.prototype.deregisterContainerEvents = function()
{
	if (this.getDialog() !== null)
	{
		this.getDialog().registerOnAfterOpen(null);
		this.getDialog().registerOnAfterClose(null);
		this.getDialog().registerOnEscape(null);
		this.getDialog().registerOnResize(null);
	}
};
oFF.UiPrgContainerDialog.prototype.getContainerOffsetHeight = function()
{
	if (this.getDialog() !== null)
	{
		return this.getDialog().getOffsetHeight();
	}
	return 0;
};
oFF.UiPrgContainerDialog.prototype.getContainerOffsetWidth = function()
{
	if (this.getDialog() !== null)
	{
		return this.getDialog().getOffsetWidth();
	}
	return 0;
};
oFF.UiPrgContainerDialog.prototype.getContainerType = function()
{
	return oFF.ProgramContainerType.DIALOG;
};
oFF.UiPrgContainerDialog.prototype.getDialog = function()
{
	return this.m_containerDialog;
};
oFF.UiPrgContainerDialog.prototype.isContainerBusy = function()
{
	if (this.getDialog() !== null)
	{
		return this.getDialog().isBusy();
	}
	return false;
};
oFF.UiPrgContainerDialog.prototype.isContainerOpen = function()
{
	if (this.getDialog() !== null)
	{
		return this.getDialog().isOpen();
	}
	return false;
};
oFF.UiPrgContainerDialog.prototype.isModalContainer = function()
{
	return true;
};
oFF.UiPrgContainerDialog.prototype.openAndRun = function(uiManager)
{
	oFF.DfUiPrgContainerFloating.prototype.openAndRun.call( this , uiManager);
	let uiProgram = this.getProgram();
	uiProgram.initializeProgram().onFinally(() => {
		let tmpDialog = uiManager.newControl(oFF.UiType.DIALOG);
		tmpDialog.setTag(oFF.UiPrgContainerDialog.DIALOG_PRG_CONTAINER_TAG);
		tmpDialog.setTitle(this.getTitle());
		tmpDialog.setHeight(oFF.UiCssLength.create("500px"));
		tmpDialog.setWidth(oFF.UiCssLength.create("600px"));
		tmpDialog.registerOnAfterOpen(oFF.UiLambdaAfterOpenListener.create((controlEvent) => {
			this.notifyContainerOpened();
		}));
		tmpDialog.registerOnAfterClose(oFF.UiLambdaAfterCloseListener.create((controlEvent2) => {
			this.killProgram();
		}));
		tmpDialog.registerOnEscape(oFF.UiLambdaEscapeListener.create((controlEvent3) => {
			this.terminateProgram();
		}));
		tmpDialog.registerOnResize(oFF.UiLambdaResizeListener.create((resizeEvent) => {
			this.notifyContainerResized(resizeEvent.getOffsetWidth(), resizeEvent.getOffsetHeight());
		}));
		tmpDialog.setCustomObject(this);
		this._setContainerDialog(tmpDialog);
		tmpDialog.setResizable(this._canResize());
		tmpDialog.open();
		let innerGenesis = oFF.UiGenesis.create(tmpDialog);
		uiProgram.renderUi(innerGenesis);
		this._setInitialFocus();
	});
};
oFF.UiPrgContainerDialog.prototype.openContainerControl = function()
{
	if (this.getDialog() !== null && !this.isContainerOpen())
	{
		this.getDialog().open();
	}
};
oFF.UiPrgContainerDialog.prototype.releaseObject = function()
{
	oFF.DfUiPrgContainerFloating.prototype.releaseObject.call( this );
	this.m_containerDialog = oFF.XObjectExt.release(this.m_containerDialog);
};
oFF.UiPrgContainerDialog.prototype.setContainerBusy = function(busy)
{
	if (this.getDialog() !== null)
	{
		this.getDialog().setBusy(busy);
	}
};
oFF.UiPrgContainerDialog.prototype.setContainerControlSize = function(newSize)
{
	if (this.getDialog() !== null)
	{
		this.getDialog().setSize(newSize);
	}
};
oFF.UiPrgContainerDialog.prototype.setInitialControlToFocus = function(control)
{
	oFF.DfUiPrgContainerFloating.prototype.setInitialControlToFocus.call( this , control);
	this._setInitialFocus();
};
oFF.UiPrgContainerDialog.prototype.setTitle = function(title)
{
	oFF.DfUiPrgContainerFloating.prototype.setTitle.call( this , title);
	if (this.getDialog() !== null)
	{
		this.getDialog().setTitle(title);
	}
};
oFF.UiPrgContainerDialog.prototype.setupUiContainer = function(startCfg, program)
{
	oFF.DfUiPrgContainerFloating.prototype.setupContainer.call( this , startCfg, program);
};
oFF.UiPrgContainerDialog.prototype.shake = function()
{
	if (this.getDialog() !== null)
	{
		this.getDialog().shake();
	}
};

oFF.UiPrgContainerStandalone = function() {};
oFF.UiPrgContainerStandalone.prototype = new oFF.DfUiPrgContainerEmbedded();
oFF.UiPrgContainerStandalone.prototype._ff_c = "UiPrgContainerStandalone";

oFF.UiPrgContainerStandalone.createExt = function(startCfg, program)
{
	let container = new oFF.UiPrgContainerStandalone();
	container.setupContainer(startCfg, program);
	return container;
};
oFF.UiPrgContainerStandalone.prototype.m_root = null;
oFF.UiPrgContainerStandalone.prototype.m_rootGuid = null;
oFF.UiPrgContainerStandalone.prototype.cleanupContainer = function()
{
	this.getUiManager().deregisterNativeAnchorByName(this.m_rootGuid);
	oFF.DfUiPrgContainerEmbedded.prototype.cleanupContainer.call( this );
};
oFF.UiPrgContainerStandalone.prototype.getContainerType = function()
{
	return oFF.ProgramContainerType.STANDALONE;
};
oFF.UiPrgContainerStandalone.prototype.initializeUi = function(uiManager)
{
	this.openAndRun(uiManager);
};
oFF.UiPrgContainerStandalone.prototype.isContainerBusy = function()
{
	if (oFF.notNull(this.m_root))
	{
		return this.m_root.isBusy();
	}
	return false;
};
oFF.UiPrgContainerStandalone.prototype.openAndRun = function(uiManager)
{
	let uiProgram = this.getProgram();
	uiProgram.initializeProgram().onFinally(() => {
		if (oFF.notNull(this.m_rootGuid))
		{
			this.m_root = uiManager.getAnchorByName(this.m_rootGuid);
		}
		else
		{
			this.m_root = uiManager.getAnchor();
		}
		let genesis = oFF.UiGenesis.create(this.m_root);
		uiProgram.renderUi(genesis);
		this.setContainerOpened();
	});
};
oFF.UiPrgContainerStandalone.prototype.releaseObject = function()
{
	this.m_root = oFF.XObjectExt.release(this.m_root);
	oFF.DfUiPrgContainerEmbedded.prototype.releaseObject.call( this );
};
oFF.UiPrgContainerStandalone.prototype.runFull = function()
{
	let process = this.getProcess();
	let uiManager = this.getUiManager();
	if (oFF.notNull(uiManager))
	{
		this.m_rootGuid = oFF.XGuid.getGuid();
		let startConfiguration = process.getProgramCfg();
		let nativeAnchorId = startConfiguration.getNativeAnchorId();
		let nativeAnchorObject = startConfiguration.getNativeAnchorObject();
		uiManager.registerNativeAnchor(this.m_rootGuid, nativeAnchorId, nativeAnchorObject);
		uiManager.invokeOnEventingThread(this);
	}
};
oFF.UiPrgContainerStandalone.prototype.setContainerBusy = function(busy)
{
	if (oFF.notNull(this.m_root))
	{
		this.m_root.setBusy(busy);
	}
};

oFF.UiComponentTypeExt = function() {};
oFF.UiComponentTypeExt.prototype = new oFF.UiComponentType();
oFF.UiComponentTypeExt.prototype._ff_c = "UiComponentTypeExt";

oFF.UiComponentTypeExt.UI_DIALOG_PROGRAM = null;
oFF.UiComponentTypeExt.UI_PROGRAM = null;
oFF.UiComponentTypeExt.UI_STUDIO = null;
oFF.UiComponentTypeExt.UI_STUDIO_PROGRAM = null;
oFF.UiComponentTypeExt.staticSetupUiExtComponentType = function()
{
	oFF.UiComponentTypeExt.UI_STUDIO = oFF.UiComponentType.createUiComponentType("UiStudio", oFF.XComponentType._UI);
	oFF.UiComponentTypeExt.UI_PROGRAM = oFF.UiComponentType.createUiComponentType("UiProgram", oFF.RuntimeComponentType.APPLICATION_PROGRAM);
	oFF.UiComponentTypeExt.UI_STUDIO_PROGRAM = oFF.UiComponentType.createUiComponentType("UiStudioProgram", oFF.UiComponentTypeExt.UI_PROGRAM);
	oFF.UiComponentTypeExt.UI_DIALOG_PROGRAM = oFF.UiComponentType.createUiComponentType("UiDialogProgram", oFF.UiComponentTypeExt.UI_PROGRAM);
};

oFF.UiPrgContainerTerminal = function() {};
oFF.UiPrgContainerTerminal.prototype = new oFF.DfUiPrgContainerGenericWindow();
oFF.UiPrgContainerTerminal.prototype._ff_c = "UiPrgContainerTerminal";

oFF.UiPrgContainerTerminal.COMMAND_SEPARATOR = "[-cmd-]";
oFF.UiPrgContainerTerminal.MAX_COMMAND_HISTORY_SIZE = 40;
oFF.UiPrgContainerTerminal.TERMINAL_COMMAND_HISTORY_KEY = "terminal_commandHistory";
oFF.UiPrgContainerTerminal.TERMINAL_PRG_CONTAINER_TAG = "ffTerminalWindow";
oFF.UiPrgContainerTerminal.createExt = function(startCfg, program)
{
	let newObj = new oFF.UiPrgContainerTerminal();
	newObj.setupContainer(startCfg, program);
	return newObj;
};
oFF.UiPrgContainerTerminal.prototype.m_commandList = null;
oFF.UiPrgContainerTerminal.prototype.m_singleLineListener = null;
oFF.UiPrgContainerTerminal.prototype.m_terminalWindow = null;
oFF.UiPrgContainerTerminal.prototype.m_workingDirChangedConsumerUuid = null;
oFF.UiPrgContainerTerminal.prototype._addCommandToHistory = function(cmd)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(cmd) && oFF.XString.size(oFF.XString.replace(cmd, " ", "")) > 0)
	{
		if (oFF.notNull(this.m_commandList))
		{
			if (this.m_commandList.size() > 0)
			{
				let lastCmd = oFF.XCollectionUtils.last(this.m_commandList);
				if (oFF.XString.isEqual(cmd, lastCmd))
				{
					return;
				}
			}
			this.m_commandList.add(cmd);
			if (this.m_commandList.size() > oFF.UiPrgContainerTerminal.MAX_COMMAND_HISTORY_SIZE)
			{
				this.m_commandList.removeAt(0);
			}
			let cmdHistoryStr = oFF.XCollectionUtils.join(this.m_commandList, oFF.UiPrgContainerTerminal.COMMAND_SEPARATOR);
			oFF.XLocalStorage.getInstance().putString(oFF.UiPrgContainerTerminal.TERMINAL_COMMAND_HISTORY_KEY, cmdHistoryStr);
		}
	}
};
oFF.UiPrgContainerTerminal.prototype._getTerminalContainer = function()
{
	return this.getWindow();
};
oFF.UiPrgContainerTerminal.prototype._initCommandHistory = function()
{
	if (this._getTerminalContainer() !== null)
	{
		let cmdHistoryStr = oFF.XLocalStorage.getInstance().getStringByKeyExt(oFF.UiPrgContainerTerminal.TERMINAL_COMMAND_HISTORY_KEY, "");
		this.m_commandList = oFF.XStringTokenizer.splitString(cmdHistoryStr, oFF.UiPrgContainerTerminal.COMMAND_SEPARATOR);
		if (oFF.notNull(this.m_commandList) && this.m_commandList.size() === 1)
		{
			let tmpOld = oFF.XStringTokenizer.splitString(cmdHistoryStr, ",");
			if (oFF.notNull(tmpOld) && tmpOld.size() > 1)
			{
				this.m_commandList = tmpOld;
			}
		}
		this._getTerminalContainer().setCommandHistory(this.m_commandList);
	}
	if (oFF.isNull(this.m_commandList))
	{
		this.m_commandList = oFF.XList.create();
	}
};
oFF.UiPrgContainerTerminal.prototype._registerForWorkingDirectoryChanges = function()
{
	try
	{
		let processBase = this.getProcess();
		if (oFF.notNull(processBase))
		{
			this.m_workingDirChangedConsumerUuid = processBase.addWorkingDirectoryChangedConsumer(this._updateWorkingDirectory.bind(this));
		}
	}
	catch (e)
	{
		oFF.XLogger.println("Error while getting the process!");
	}
};
oFF.UiPrgContainerTerminal.prototype._unregisterFromWorkingDirectoryChanges = function()
{
	try
	{
		let processBase = this.getProcess();
		if (oFF.notNull(processBase) && oFF.notNull(this.m_workingDirChangedConsumerUuid))
		{
			processBase.removeWorkingDirectoryChangedConsumerByUuid(this.m_workingDirChangedConsumerUuid);
			this.m_workingDirChangedConsumerUuid = null;
		}
	}
	catch (e)
	{
		this.m_workingDirChangedConsumerUuid = null;
	}
};
oFF.UiPrgContainerTerminal.prototype._updateWorkingDirectory = function(workingDirectoryUri)
{
	if (oFF.notNull(workingDirectoryUri))
	{
		this.setPath(workingDirectoryUri.getPath());
	}
};
oFF.UiPrgContainerTerminal.prototype.getContainerType = function()
{
	return oFF.ProgramContainerType.CONSOLE;
};
oFF.UiPrgContainerTerminal.prototype.isBlocked = function()
{
	return this._getTerminalContainer().isBusy();
};
oFF.UiPrgContainerTerminal.prototype.isContainerBusy = function()
{
	if (oFF.notNull(this.m_terminalWindow))
	{
		return this.m_terminalWindow.isBusy();
	}
	return false;
};
oFF.UiPrgContainerTerminal.prototype.isLogWritten = function(layer, severity)
{
	return true;
};
oFF.UiPrgContainerTerminal.prototype.logExt = function(layer, severity, code, message)
{
	let fullMsg = oFF.DfLogWriter.createLogString(layer, severity, code, message);
	this._getTerminalContainer().println(fullMsg);
};
oFF.UiPrgContainerTerminal.prototype.onClose = function(event)
{
	this._unregisterFromWorkingDirectoryChanges();
	oFF.DfUiPrgContainerGenericWindow.prototype.onClose.call( this , event);
};
oFF.UiPrgContainerTerminal.prototype.onExecute = function(event)
{
	if (oFF.notNull(this.m_singleLineListener))
	{
		let listener = this.m_singleLineListener;
		this.m_singleLineListener = null;
		let command = event.getParameters().getStringByKeyExt(oFF.UiEventParams.PARAM_COMMAND, null);
		command = oFF.XString.trim(command);
		try
		{
			listener.onLineRead(command);
			this._addCommandToHistory(command);
			command = "";
			this.m_singleLineListener = listener;
		}
		catch (e)
		{
			this.m_singleLineListener = listener;
		}
	}
	else
	{
		this._getTerminalContainer().println("404 Command not found. It got lost in the void...");
	}
};
oFF.UiPrgContainerTerminal.prototype.onOpen = function(event)
{
	if (this.getProcess() === null || this.getProcess().isReleased())
	{
		this.shutdownContainer();
		return;
	}
	if (this.getProcess() !== null)
	{
		let workingDir = this.getProcess().getWorkingDirectoryUri();
		this._updateWorkingDirectory(workingDir);
		if (oFF.notNull(workingDir))
		{
			this._registerForWorkingDirectoryChanges();
		}
	}
	oFF.DfUiPrgContainerGenericWindow.prototype.onOpen.call( this , event);
};
oFF.UiPrgContainerTerminal.prototype.openAndRun = function(uiManager)
{
	oFF.DfUiPrgContainerGenericWindow.prototype.openAndRun.call( this , uiManager);
	let program = this.getProgram();
	let session = program.getSession();
	session.setStdin(this);
	session.setStdout(this);
	session.setStdlog(this);
	program.initializeProgram().onFinally(() => {
		this.m_terminalWindow = uiManager.newControl(oFF.UiType.TERMINAL);
		this.m_terminalWindow.setTag(oFF.UiPrgContainerTerminal.TERMINAL_PRG_CONTAINER_TAG);
		this.m_terminalWindow.setTitle(this.getTitle());
		this.m_terminalWindow.setCustomObject(this);
		this.m_terminalWindow.registerOnExecute(this);
		this.m_terminalWindow.registerOnOpen(this);
		this.m_terminalWindow.registerOnClose(this);
		this.m_terminalWindow.registerOnButtonPress(this);
		this.m_terminalWindow.registerOnMoveEnd(this);
		this.m_terminalWindow.registerOnResize(oFF.UiLambdaResizeListener.create((resizeEvent) => {
			this.notifyContainerResized(resizeEvent.getOffsetWidth(), resizeEvent.getOffsetHeight());
		}));
		this.setContainerNameAndCssClass(this.m_terminalWindow);
		this.setContainerWindow(this.m_terminalWindow);
		this._initCommandHistory();
		this.m_terminalWindow.open();
		program.runProgram();
	});
};
oFF.UiPrgContainerTerminal.prototype.print = function(text)
{
	if (this._getTerminalContainer() !== null)
	{
		this._getTerminalContainer().print(text);
	}
};
oFF.UiPrgContainerTerminal.prototype.println = function(text)
{
	if (this._getTerminalContainer() !== null)
	{
		this._getTerminalContainer().println(text);
	}
};
oFF.UiPrgContainerTerminal.prototype.readLine = function(listener)
{
	this.m_singleLineListener = listener;
	return null;
};
oFF.UiPrgContainerTerminal.prototype.releaseObject = function()
{
	this._unregisterFromWorkingDirectoryChanges();
	this.m_terminalWindow = oFF.XObjectExt.release(this.m_terminalWindow);
	this.m_commandList = oFF.XObjectExt.release(this.m_commandList);
	oFF.DfUiPrgContainerGenericWindow.prototype.releaseObject.call( this );
};
oFF.UiPrgContainerTerminal.prototype.setAllowUserInput = function(allowInput)
{
	this.setContainerBusy(!allowInput);
};
oFF.UiPrgContainerTerminal.prototype.setBlocked = function(isBlocked)
{
	this._getTerminalContainer().setBusy(isBlocked);
};
oFF.UiPrgContainerTerminal.prototype.setContainerBusy = function(busy)
{
	if (oFF.notNull(this.m_terminalWindow))
	{
		this.m_terminalWindow.setBusy(busy);
	}
};
oFF.UiPrgContainerTerminal.prototype.setPath = function(path)
{
	this._getTerminalContainer().setPath(path);
};
oFF.UiPrgContainerTerminal.prototype.setPrompt = function(prompt)
{
	this._getTerminalContainer().setPrompt(prompt);
};
oFF.UiPrgContainerTerminal.prototype.setReadLineFinishedConsumer = function(consumer) {};
oFF.UiPrgContainerTerminal.prototype.startReadLine = function(text, numOfChars)
{
	this._getTerminalContainer().startReadLine(text, numOfChars);
};
oFF.UiPrgContainerTerminal.prototype.supportsSyncType = function(syncType)
{
	if (syncType === oFF.SyncType.NON_BLOCKING)
	{
		return true;
	}
	else
	{
		return false;
	}
};

oFF.UiPrgContainerWindow = function() {};
oFF.UiPrgContainerWindow.prototype = new oFF.DfUiPrgContainerGenericWindow();
oFF.UiPrgContainerWindow.prototype._ff_c = "UiPrgContainerWindow";

oFF.UiPrgContainerWindow.createExt = function(startCfg, program)
{
	let window = new oFF.UiPrgContainerWindow();
	window.setupContainer(startCfg, program);
	return window;
};
oFF.UiPrgContainerWindow.prototype.m_window = null;
oFF.UiPrgContainerWindow.prototype.getContainerType = function()
{
	return oFF.ProgramContainerType.WINDOW;
};
oFF.UiPrgContainerWindow.prototype.isContainerBusy = function()
{
	if (oFF.notNull(this.m_window))
	{
		return this.m_window.isBusy();
	}
	return false;
};
oFF.UiPrgContainerWindow.prototype.openAndRun = function(uiManager)
{
	oFF.DfUiPrgContainerGenericWindow.prototype.openAndRun.call( this , uiManager);
	let uiProgram = this.getProgram();
	uiProgram.initializeProgram().onFinally(() => {
		this.m_window = uiManager.newControl(oFF.UiType.WINDOW);
		this.m_window.setTitle(this.getTitle());
		this.m_window.setCustomObject(this);
		this.m_window.registerOnOpen(this);
		this.m_window.registerOnClose(this);
		this.m_window.registerOnButtonPress(this);
		this.m_window.registerOnMoveEnd(this);
		this.m_window.registerOnResize(oFF.UiLambdaResizeListener.create((resizeEvent) => {
			this.notifyContainerResized(resizeEvent.getOffsetWidth(), resizeEvent.getOffsetHeight());
		}));
		this.setContainerNameAndCssClass(this.m_window);
		this.setContainerWindow(this.m_window);
		this.m_window.open();
		let innerGenesis = oFF.UiGenesis.create(this.m_window);
		uiProgram.renderUi(innerGenesis);
	});
};
oFF.UiPrgContainerWindow.prototype.releaseObject = function()
{
	this.m_window = oFF.XObjectExt.release(this.m_window);
	oFF.DfUiPrgContainerGenericWindow.prototype.releaseObject.call( this );
};
oFF.UiPrgContainerWindow.prototype.setContainerBusy = function(busy)
{
	if (oFF.notNull(this.m_window))
	{
		this.m_window.setBusy(busy);
	}
};

oFF.UiProgramModule = function() {};
oFF.UiProgramModule.prototype = new oFF.DfModule();
oFF.UiProgramModule.prototype._ff_c = "UiProgramModule";

oFF.UiProgramModule.s_module = null;
oFF.UiProgramModule.getInstance = function()
{
	if (oFF.isNull(oFF.UiProgramModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.UiToolsModule.getInstance());
		oFF.UiProgramModule.s_module = oFF.DfModule.startExt(new oFF.UiProgramModule());
		oFF.UiBindingFactory.staticSetupUiBindingFactory();
		oFF.SiTokenType.staticSetup();
		oFF.QuasarComponentType.staticSetupQuasarType();
		oFF.SxJsonDpBindingFactory.staticSetupJsonBindingFactory();
		oFF.SxRestDpBindingFactory.staticSetupJsonBindingFactory();
		oFF.UiComponentTypeExt.staticSetupUiExtComponentType();
		oFF.UiPrgContainerFactory.staticSetupUiContainerFactory();
		oFF.CustomControlRegistration.staticSetup();
		oFF.DfModule.stopExt(oFF.UiProgramModule.s_module);
	}
	return oFF.UiProgramModule.s_module;
};
oFF.UiProgramModule.prototype.getName = function()
{
	return "ff2240.ui.program";
};

oFF.UiProgramModule.getInstance();

return oFF;
} );