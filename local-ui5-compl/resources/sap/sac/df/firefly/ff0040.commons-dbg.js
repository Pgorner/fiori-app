/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff0030.core.ext"
],
function(oFF)
{
"use strict";

oFF.XEncoderFactory = function() {};
oFF.XEncoderFactory.prototype = new oFF.XObject();
oFF.XEncoderFactory.prototype._ff_c = "XEncoderFactory";

oFF.XEncoderFactory.s_instance = null;
oFF.XEncoderFactory.getInstance = function()
{
	return oFF.XEncoderFactory.s_instance;
};
oFF.XEncoderFactory.setInstance = function(instance)
{
	oFF.XEncoderFactory.s_instance = instance;
};

oFF.XEncoderSecretFactory = function() {};
oFF.XEncoderSecretFactory.prototype = new oFF.XObject();
oFF.XEncoderSecretFactory.prototype._ff_c = "XEncoderSecretFactory";

oFF.XEncoderSecretFactory.s_instance = null;
oFF.XEncoderSecretFactory.getInstance = function()
{
	return oFF.XEncoderSecretFactory.s_instance;
};
oFF.XEncoderSecretFactory.setInstance = function(instance)
{
	oFF.XEncoderSecretFactory.s_instance = instance;
};

oFF.DfEncoder = function() {};
oFF.DfEncoder.prototype = new oFF.XObject();
oFF.DfEncoder.prototype._ff_c = "DfEncoder";

oFF.DfEncoder.prototype.m_allowedResultType = null;
oFF.DfEncoder.prototype.ensureResultTypeIsValid = function(encoded, reject)
{
	if (oFF.isNull(this.m_allowedResultType) || oFF.isNull(encoded) || encoded.getType() !== this.m_allowedResultType)
	{
		reject(oFF.XError.create("Invalid IXEncoderResult type!"));
		return false;
	}
	return true;
};
oFF.DfEncoder.prototype.setupDfEncoder = function(allowedResultType)
{
	this.m_allowedResultType = allowedResultType;
};

oFF.DfEncoderSecret = function() {};
oFF.DfEncoderSecret.prototype = new oFF.XObject();
oFF.DfEncoderSecret.prototype._ff_c = "DfEncoderSecret";


oFF.XEncoderAESResult = function() {};
oFF.XEncoderAESResult.prototype = new oFF.XObject();
oFF.XEncoderAESResult.prototype._ff_c = "XEncoderAESResult";

oFF.XEncoderAESResult.FIELD_KEY_ALGORITHM = "alg";
oFF.XEncoderAESResult.FIELD_KEY_CYPHER_TEXT = "ct";
oFF.XEncoderAESResult.FIELD_KEY_INITIALIZATION_VECTOR = "iv";
oFF.XEncoderAESResult.create = function(initializationVector, cypherText)
{
	let coder64 = oFF.XBase64.getInstance();
	let encoded = new oFF.XEncoderAESResult();
	encoded.cypherTextBase64 = coder64.encodeFromBytes(cypherText);
	encoded.cypherTextBytes = cypherText;
	encoded.initializationVectorBase64 = coder64.encodeFromBytes(initializationVector);
	encoded.initializationVectorBytes = initializationVector;
	return encoded;
};
oFF.XEncoderAESResult.prototype.cypherTextBase64 = null;
oFF.XEncoderAESResult.prototype.cypherTextBytes = null;
oFF.XEncoderAESResult.prototype.initializationVectorBase64 = null;
oFF.XEncoderAESResult.prototype.initializationVectorBytes = null;
oFF.XEncoderAESResult.prototype.getCypherTextBase64 = function()
{
	return this.cypherTextBase64;
};
oFF.XEncoderAESResult.prototype.getCypherTextBytes = function()
{
	return this.cypherTextBytes;
};
oFF.XEncoderAESResult.prototype.getInitializationVectorBase64 = function()
{
	return this.initializationVectorBase64;
};
oFF.XEncoderAESResult.prototype.getInitializationVectorBytes = function()
{
	return this.initializationVectorBytes;
};
oFF.XEncoderAESResult.prototype.getType = function()
{
	return oFF.XEncoderResultType.AES;
};

oFF.XEncoderNoopResult = function() {};
oFF.XEncoderNoopResult.prototype = new oFF.XObject();
oFF.XEncoderNoopResult.prototype._ff_c = "XEncoderNoopResult";

oFF.XEncoderNoopResult.FIELD_KEY_CONTENT = "content";
oFF.XEncoderNoopResult.create = function(content)
{
	let encoded = new oFF.XEncoderNoopResult();
	encoded.m_content = content;
	return encoded;
};
oFF.XEncoderNoopResult.prototype.m_content = null;
oFF.XEncoderNoopResult.prototype.getContent = function()
{
	return this.m_content;
};
oFF.XEncoderNoopResult.prototype.getType = function()
{
	return oFF.XEncoderResultType.NOOP;
};

oFF.XConverterUtils = {

	getBoolean:function(component)
	{
			let type = component.getComponentType();
		if (type === oFF.XValueType.BOOLEAN)
		{
			return component.getBoolean();
		}
		else if (type === oFF.XValueType.STRING)
		{
			let strValue = component.getString();
			return oFF.XBoolean.convertFromString(strValue);
		}
		else if (type === oFF.XValueType.INTEGER)
		{
			let intValue = component.getInteger();
			return intValue !== 0;
		}
		else if (type === oFF.XValueType.LONG)
		{
			let longValue = oFF.XLong.convertToInt(component.getLong());
			return longValue !== 0;
		}
		else if (type === oFF.XValueType.DOUBLE)
		{
			let doubleValue = oFF.XDouble.convertToInt(component.getDouble());
			return doubleValue !== 0;
		}
		else
		{
			return false;
		}
	},
	getDouble:function(component)
	{
			let type = component.getComponentType();
		if (type === oFF.XValueType.INTEGER)
		{
			return oFF.XInteger.convertToDouble(component.getInteger());
		}
		else if (type === oFF.XValueType.LONG)
		{
			return oFF.XLong.convertToDouble(component.getLong());
		}
		else if (type === oFF.XValueType.DOUBLE)
		{
			return component.getDouble();
		}
		else if (type === oFF.XValueType.STRING)
		{
			let strValue = component.getString();
			return oFF.XDouble.convertFromString(strValue);
		}
		else
		{
			return 0.0;
		}
	},
	getInteger:function(component)
	{
			let type = component.getComponentType();
		if (type === oFF.XValueType.INTEGER)
		{
			return component.getInteger();
		}
		else if (type === oFF.XValueType.LONG)
		{
			return oFF.XLong.convertToInt(component.getLong());
		}
		else if (type === oFF.XValueType.DOUBLE)
		{
			return oFF.XDouble.convertToInt(component.getDouble());
		}
		else if (type === oFF.XValueType.STRING)
		{
			let strValue = component.getString();
			return oFF.XInteger.convertFromString(strValue);
		}
		else
		{
			return 0;
		}
	},
	getLong:function(component)
	{
			let type = component.getComponentType();
		if (type === oFF.XValueType.INTEGER)
		{
			return component.getInteger();
		}
		else if (type === oFF.XValueType.LONG)
		{
			return component.getLong();
		}
		else if (type === oFF.XValueType.DOUBLE)
		{
			return oFF.XDouble.convertToLong(component.getDouble());
		}
		else if (type === oFF.XValueType.STRING)
		{
			let strValue = component.getString();
			return oFF.XLong.convertFromString(strValue);
		}
		else
		{
			return 0;
		}
	},
	getString:function(component)
	{
			let type = component.getComponentType();
		if (type === oFF.XValueType.STRING)
		{
			return component.getString();
		}
		else if (type === oFF.XValueType.BOOLEAN)
		{
			return component.getStringRepresentation();
		}
		else if (type === oFF.XValueType.INTEGER)
		{
			return component.getStringRepresentation();
		}
		else if (type === oFF.XValueType.LONG)
		{
			return component.getStringRepresentation();
		}
		else if (type === oFF.XValueType.DOUBLE)
		{
			return component.getStringRepresentation();
		}
		else
		{
			return component.toString();
		}
	}
};

oFF.XReflectionParam = function() {};
oFF.XReflectionParam.prototype = new oFF.XObject();
oFF.XReflectionParam.prototype._ff_c = "XReflectionParam";

oFF.XReflectionParam.create = function(obj)
{
	let param = new oFF.XReflectionParam();
	param.m_value = obj;
	return param;
};
oFF.XReflectionParam.createBoolean = function(value)
{
	let param = new oFF.XReflectionParam();
	param.m_value = oFF.XBooleanValue.create(value);
	param.m_isWrapped = true;
	return param;
};
oFF.XReflectionParam.createDouble = function(value)
{
	let param = new oFF.XReflectionParam();
	param.m_value = oFF.XDoubleValue.create(value);
	param.m_isWrapped = true;
	return param;
};
oFF.XReflectionParam.createInteger = function(value)
{
	let param = new oFF.XReflectionParam();
	param.m_value = oFF.XIntegerValue.create(value);
	param.m_isWrapped = true;
	return param;
};
oFF.XReflectionParam.createLong = function(value)
{
	let param = new oFF.XReflectionParam();
	param.m_value = oFF.XLongValue.create(value);
	param.m_isWrapped = true;
	return param;
};
oFF.XReflectionParam.createString = function(value)
{
	let param = new oFF.XReflectionParam();
	param.m_value = oFF.XStringValue.create(value);
	param.m_isWrapped = true;
	return param;
};
oFF.XReflectionParam.prototype.m_isWrapped = false;
oFF.XReflectionParam.prototype.m_value = null;
oFF.XReflectionParam.prototype.getBoolean = function()
{
	return oFF.XConverterUtils.getBoolean(this.m_value);
};
oFF.XReflectionParam.prototype.getDouble = function()
{
	return oFF.XConverterUtils.getDouble(this.m_value);
};
oFF.XReflectionParam.prototype.getInteger = function()
{
	return oFF.XConverterUtils.getInteger(this.m_value);
};
oFF.XReflectionParam.prototype.getLong = function()
{
	return oFF.XConverterUtils.getLong(this.m_value);
};
oFF.XReflectionParam.prototype.getString = function()
{
	return oFF.XConverterUtils.getString(this.m_value);
};
oFF.XReflectionParam.prototype.getValue = function()
{
	return this.m_value;
};
oFF.XReflectionParam.prototype.isWrapped = function()
{
	return this.m_isWrapped;
};
oFF.XReflectionParam.prototype.releaseObject = function()
{
	if (this.m_isWrapped)
	{
		this.m_value = oFF.XObjectExt.release(this.m_value);
	}
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.XLogBufferNull = function() {};
oFF.XLogBufferNull.prototype = new oFF.XObject();
oFF.XLogBufferNull.prototype._ff_c = "XLogBufferNull";

oFF.XLogBufferNull.SINGLETON = null;
oFF.XLogBufferNull.staticSetup = function()
{
	oFF.XLogBufferNull.SINGLETON = new oFF.XLogBufferNull();
};
oFF.XLogBufferNull.prototype.append = function(value)
{
	return this;
};
oFF.XLogBufferNull.prototype.appendBoolean = function(value)
{
	return this;
};
oFF.XLogBufferNull.prototype.appendChar = function(value)
{
	return this;
};
oFF.XLogBufferNull.prototype.appendDouble = function(value)
{
	return this;
};
oFF.XLogBufferNull.prototype.appendInt = function(value)
{
	return this;
};
oFF.XLogBufferNull.prototype.appendLine = function(value)
{
	return this;
};
oFF.XLogBufferNull.prototype.appendLong = function(value)
{
	return this;
};
oFF.XLogBufferNull.prototype.appendNewLine = function()
{
	return this;
};
oFF.XLogBufferNull.prototype.appendObject = function(value)
{
	return this;
};
oFF.XLogBufferNull.prototype.clear = function() {};
oFF.XLogBufferNull.prototype.flush = function() {};
oFF.XLogBufferNull.prototype.length = function()
{
	return 0;
};

oFF.XLogger = {

	s_logger:null,
	getInstance:function()
	{
			return oFF.XLogger.s_logger;
	},
	printError:function(errorMsg)
	{
			oFF.XLogger.s_logger.logExt(null, oFF.Severity.ERROR, 0, errorMsg);
	},
	println:function(logline)
	{
			oFF.XLogger.s_logger.logExt(null, null, 0, logline);
	},
	setInstance:function(logger)
	{
			oFF.XLogger.s_logger = logger;
	}
};

oFF.InfoCodes = {

	DIMENSION_LAZY_LOAD:1000001,
	OTHER_INFO:1000000,
	QUERY_MODEL_VERSION_VALID:1000002
};

oFF.XPromise = function() {};
oFF.XPromise.prototype = new oFF.XObject();
oFF.XPromise.prototype._ff_c = "XPromise";

oFF.XPromise._createForInternalUse = function()
{
	let newPromise = new oFF.XPromise();
	newPromise._setupPromise(null);
	return newPromise;
};
oFF.XPromise.all = function(promiseList)
{
	let allPromise = oFF.XPromise._createForInternalUse();
	let returnValues = oFF.XList.create();
	let resolvedList = oFF.XPromiseList.create();
	if (oFF.isNull(promiseList) || promiseList.size() === 0)
	{
		allPromise._fulfillInternal(returnValues);
	}
	else
	{
		oFF.XCollectionUtils.forEach(promiseList, (tmpPromise) => {
			tmpPromise.onThen((value) => {
				returnValues.add(value);
				resolvedList.add(tmpPromise);
				if (resolvedList.size() === promiseList.size())
				{
					for (let a = 0; a < resolvedList.size(); a++)
					{
						let originalIndex = promiseList.getIndex(resolvedList.get(a));
						resolvedList.moveElement(a, originalIndex);
						returnValues.moveElement(a, originalIndex);
					}
					allPromise._fulfillInternal(returnValues);
				}
			}).onCatch((error) => {
				allPromise._rejectInternal(error);
			});
		});
	}
	return allPromise;
};
oFF.XPromise.allSettled = function(promiseList)
{
	let allSettledPromise = oFF.XPromise._createForInternalUse();
	let returnValues = oFF.XList.create();
	let resolvedList = oFF.XPromiseList.create();
	if (oFF.isNull(promiseList) || promiseList.size() === 0)
	{
		allSettledPromise._fulfillInternal(returnValues);
	}
	else
	{
		oFF.XCollectionUtils.forEach(promiseList, (tmpPromise) => {
			tmpPromise.onThen((value) => {
				let fulfilResult = oFF.XPromiseResult.createFulfil(value);
				returnValues.add(fulfilResult);
				resolvedList.add(tmpPromise);
				if (resolvedList.size() === promiseList.size())
				{
					allSettledPromise._fulfillInternal(returnValues);
				}
			}).onCatch((error) => {
				let rejectResult = oFF.XPromiseResult.createReject(error);
				returnValues.add(rejectResult);
				resolvedList.add(tmpPromise);
				if (resolvedList.size() === promiseList.size())
				{
					for (let a = 0; a < resolvedList.size(); a++)
					{
						let originalIndex = promiseList.getIndex(resolvedList.get(a));
						resolvedList.moveElement(a, originalIndex);
						returnValues.moveElement(a, originalIndex);
					}
					allSettledPromise._fulfillInternal(returnValues);
				}
			});
		});
	}
	return allSettledPromise;
};
oFF.XPromise.any = function(promiseList)
{
	let anyPromise = oFF.XPromise._createForInternalUse();
	let rejctedList = oFF.XPromiseList.create();
	if (oFF.isNull(promiseList) || promiseList.size() === 0)
	{
		anyPromise._fulfillInternal(null);
	}
	else
	{
		oFF.XCollectionUtils.forEach(promiseList, (tmpPromise) => {
			tmpPromise.onThen((value) => {
				anyPromise._fulfillInternal(value);
			}).onCatch((error) => {
				rejctedList.add(tmpPromise);
				if (rejctedList.size() === promiseList.size())
				{
					anyPromise._rejectInternal(error);
				}
			});
		});
	}
	return anyPromise;
};
oFF.XPromise.create = function(promiseConsumer)
{
	let newPromise = new oFF.XPromise();
	newPromise._setupPromise(promiseConsumer);
	return newPromise;
};
oFF.XPromise.race = function(promiseList)
{
	let racePromise = oFF.XPromise._createForInternalUse();
	if (oFF.isNull(promiseList) || promiseList.size() === 0)
	{
		racePromise._fulfillInternal(null);
	}
	else
	{
		oFF.XCollectionUtils.forEach(promiseList, (tmpPromise) => {
			tmpPromise.onThen((value) => {
				racePromise._fulfillInternal(value);
			}).onCatch((error) => {
				racePromise._rejectInternal(error);
			});
		});
	}
	return racePromise;
};
oFF.XPromise.reject = function(reason)
{
	let newPromise = new oFF.XPromise();
	newPromise._setupPromise(null);
	newPromise._rejectInternal(reason);
	return newPromise;
};
oFF.XPromise.resolve = function(value)
{
	let newPromise = new oFF.XPromise();
	newPromise._setupPromise(null);
	newPromise._fulfillInternal(value);
	return newPromise;
};
oFF.XPromise.prototype.m_fulfillValue = null;
oFF.XPromise.prototype.m_promiseConsumer = null;
oFF.XPromise.prototype.m_promiseState = null;
oFF.XPromise.prototype.m_rejectReason = null;
oFF.XPromise.prototype.m_thenChainPromiseList = null;
oFF.XPromise.prototype._executePromiseConsumer = function()
{
	if (oFF.notNull(this.m_promiseConsumer))
	{
		try
		{
			this.m_promiseConsumer(this._getResolveConsumer(), this._getRejectConsumer());
		}
		catch (e)
		{
			this._rejectInternal(oFF.XError.createWithThrowable(e));
		}
	}
};
oFF.XPromise.prototype._fulfillChainedPromises = function(value)
{
	oFF.XCollectionUtils.forEach(this.m_thenChainPromiseList, (thenLinkedPromise) => {
		thenLinkedPromise.resolveChainPromise(value);
	});
	this.m_thenChainPromiseList.clear();
};
oFF.XPromise.prototype._fulfillInternal = function(value)
{
	if (this.m_promiseState === oFF.XPromiseState.PENDING)
	{
		this.m_fulfillValue = value;
		this.m_rejectReason = null;
		this.m_promiseState = oFF.XPromiseState.FULFILLED;
		this._fulfillChainedPromises(value);
	}
};
oFF.XPromise.prototype._getRejectConsumer = function()
{
	return (reason) => {
		this._rejectInternal(reason);
	};
};
oFF.XPromise.prototype._getResolveConsumer = function()
{
	return (value) => {
		this._fulfillInternal(value);
	};
};
oFF.XPromise.prototype._rejectChainedPromises = function(reason)
{
	oFF.XCollectionUtils.forEach(this.m_thenChainPromiseList, (thenLinkedPromise) => {
		thenLinkedPromise.rejectChainPromise(reason);
	});
	this.m_thenChainPromiseList.clear();
};
oFF.XPromise.prototype._rejectInternal = function(reason)
{
	if (this.m_promiseState === oFF.XPromiseState.PENDING)
	{
		this.m_fulfillValue = null;
		this.m_rejectReason = reason;
		this.m_promiseState = oFF.XPromiseState.REJECTED;
		this._rejectChainedPromises(reason);
	}
};
oFF.XPromise.prototype._setupPromise = function(promiseConsumer)
{
	this.m_thenChainPromiseList = oFF.XList.create();
	this.m_promiseConsumer = promiseConsumer;
	this.m_promiseState = oFF.XPromiseState.PENDING;
	this._executePromiseConsumer();
};
oFF.XPromise.prototype.getState = function()
{
	return this.m_promiseState;
};
oFF.XPromise.prototype.isSettled = function()
{
	return this.getState() === oFF.XPromiseState.FULFILLED || this.getState() === oFF.XPromiseState.REJECTED;
};
oFF.XPromise.prototype.onCatch = function(onRejected)
{
	let onRejectedHandler = null;
	if (oFF.notNull(onRejected))
	{
		onRejectedHandler = (err) => {
			let returnVal = null;
			onRejected(err);
			return returnVal;
		};
	}
	return this.then(null, onRejectedHandler);
};
oFF.XPromise.prototype.onCatchExt = function(onRejected)
{
	return this.then(null, onRejected);
};
oFF.XPromise.prototype.onFinally = function(onFinally)
{
	let onResolvedHandler = (res) => {
		if (oFF.notNull(onFinally))
		{
			onFinally();
		}
		return res;
	};
	let onRejectedHandler = (err) => {
		if (oFF.notNull(onFinally))
		{
			onFinally();
		}
		throw oFF.XException.createExceptionForRethrowWithDefault(err.getThrowable(), err.getText());
	};
	return this.then(onResolvedHandler, onRejectedHandler);
};
oFF.XPromise.prototype.onThen = function(onFulfiled)
{
	let onResolvedHandler = null;
	if (oFF.notNull(onFulfiled))
	{
		onResolvedHandler = (res) => {
			let returnVal = null;
			onFulfiled(res);
			return returnVal;
		};
	}
	return this.then(onResolvedHandler, null);
};
oFF.XPromise.prototype.onThenExt = function(onFulfiled)
{
	return this.then(onFulfiled, null);
};
oFF.XPromise.prototype.onThenPromise = function(onFulfiled)
{
	let returnPromise = null;
	if (oFF.notNull(onFulfiled))
	{
		if (this.getState() === oFF.XPromiseState.FULFILLED)
		{
			try
			{
				returnPromise = onFulfiled(this.m_fulfillValue);
			}
			catch (e)
			{
				returnPromise = oFF.XPromise.reject(oFF.XError.createWithThrowable(e));
			}
		}
		else if (this.getState() === oFF.XPromiseState.PENDING)
		{
			let internalResolvedHandler = (res) => {
				return res;
			};
			let internalChainPromise = oFF.XThenChainPromiseInternal._createForInternalUse(internalResolvedHandler, null);
			let onResolvedHandler = (res) => {
				let returnVal = null;
				try
				{
					let insidePromise = onFulfiled(res);
					if (oFF.notNull(insidePromise))
					{
						insidePromise.onThen((result) => {
							internalChainPromise.resolveChainPromise(result);
						}).onCatch((error) => {
							internalChainPromise.rejectChainPromise(error);
						});
					}
					else
					{
						internalChainPromise.resolveChainPromise(oFF.XObject.castToAny(res));
					}
				}
				catch (e)
				{
					internalChainPromise.rejectChainPromise(oFF.XError.createWithThrowable(e));
				}
				return returnVal;
			};
			let onRejectedHandler = (err) => {
				let returnVal = null;
				internalChainPromise.rejectChainPromise(err);
				return returnVal;
			};
			this.then(onResolvedHandler, onRejectedHandler);
			returnPromise = internalChainPromise.getChainPromise();
		}
	}
	if (oFF.isNull(returnPromise))
	{
		returnPromise = this.onThenExt(null);
	}
	return returnPromise;
};
oFF.XPromise.prototype.releaseObject = function()
{
	this.m_promiseConsumer = null;
	this.m_promiseState = null;
	this.m_thenChainPromiseList = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.XPromise.prototype.then = function(onFulfiled, onRejected)
{
	try
	{
		if (this.getState() !== oFF.XPromiseState.PENDING)
		{
			let returnFulfillValue = null;
			if (this.getState() === oFF.XPromiseState.FULFILLED)
			{
				if (oFF.notNull(onFulfiled))
				{
					returnFulfillValue = onFulfiled(this.m_fulfillValue);
				}
				else
				{
					returnFulfillValue = oFF.XObject.castToAny(this.m_fulfillValue);
				}
				return oFF.XPromise.resolve(returnFulfillValue);
			}
			else if (this.getState() === oFF.XPromiseState.REJECTED)
			{
				if (oFF.notNull(onRejected))
				{
					returnFulfillValue = onRejected(this.m_rejectReason);
					return oFF.XPromise.resolve(returnFulfillValue);
				}
				else
				{
					return oFF.XPromise.reject(this.m_rejectReason);
				}
			}
		}
	}
	catch (e)
	{
		return oFF.XPromise.reject(oFF.XError.createWithThrowable(e));
	}
	let newChainPromise = oFF.XThenChainPromiseInternal._createForInternalUse(onFulfiled, onRejected);
	this.m_thenChainPromiseList.add(newChainPromise);
	return newChainPromise.getChainPromise();
};
oFF.XPromise.prototype.toString = function()
{
	return oFF.XStringUtils.concatenate3("Promise<", this.m_promiseState.getName(), ">");
};

oFF.XPromiseResult = function() {};
oFF.XPromiseResult.prototype = new oFF.XObject();
oFF.XPromiseResult.prototype._ff_c = "XPromiseResult";

oFF.XPromiseResult.createFulfil = function(value)
{
	let newResult = new oFF.XPromiseResult();
	newResult._setupFulfilled(value);
	return newResult;
};
oFF.XPromiseResult.createReject = function(error)
{
	let newResult = new oFF.XPromiseResult();
	newResult._setupRejected(error);
	return newResult;
};
oFF.XPromiseResult.prototype.m_error = null;
oFF.XPromiseResult.prototype.m_promiseState = null;
oFF.XPromiseResult.prototype.m_value = null;
oFF.XPromiseResult.prototype._setupFulfilled = function(value)
{
	this.m_promiseState = oFF.XPromiseState.FULFILLED;
	this.m_value = value;
};
oFF.XPromiseResult.prototype._setupRejected = function(error)
{
	this.m_promiseState = oFF.XPromiseState.REJECTED;
	this.m_error = error;
};
oFF.XPromiseResult.prototype.getReason = function()
{
	return this.m_error;
};
oFF.XPromiseResult.prototype.getStatus = function()
{
	return this.m_promiseState;
};
oFF.XPromiseResult.prototype.getValue = function()
{
	return this.m_value;
};
oFF.XPromiseResult.prototype.isFulfill = function()
{
	return this.m_promiseState === oFF.XPromiseState.FULFILLED;
};
oFF.XPromiseResult.prototype.isReject = function()
{
	return this.m_promiseState === oFF.XPromiseState.REJECTED;
};
oFF.XPromiseResult.prototype.releaseObject = function()
{
	this.m_promiseState = null;
	this.m_value = null;
	this.m_error = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.XThenChainPromiseInternal = function() {};
oFF.XThenChainPromiseInternal.prototype = new oFF.XObject();
oFF.XThenChainPromiseInternal.prototype._ff_c = "XThenChainPromiseInternal";

oFF.XThenChainPromiseInternal._createForInternalUse = function(onFulfilled, onRejected)
{
	let newInstance = new oFF.XThenChainPromiseInternal();
	newInstance._setupChainPromise(onFulfilled, onRejected);
	return newInstance;
};
oFF.XThenChainPromiseInternal.prototype.m_chainPromise = null;
oFF.XThenChainPromiseInternal.prototype.m_chainPromiseReject = null;
oFF.XThenChainPromiseInternal.prototype.m_chainPromiseResolve = null;
oFF.XThenChainPromiseInternal.prototype.m_onFulfilled = null;
oFF.XThenChainPromiseInternal.prototype.m_onRejected = null;
oFF.XThenChainPromiseInternal.prototype._getOnFulfillCallback = function()
{
	return this.m_onFulfilled;
};
oFF.XThenChainPromiseInternal.prototype._getOnRejectCallback = function()
{
	return this.m_onRejected;
};
oFF.XThenChainPromiseInternal.prototype._rejectChainedPromiseInternal = function(error)
{
	if (oFF.notNull(this.m_chainPromiseReject))
	{
		this.m_chainPromiseReject(error);
	}
	else
	{
		throw oFF.XException.createExceptionForRethrowWithDefault(error.getThrowable(), error.getText());
	}
};
oFF.XThenChainPromiseInternal.prototype._resolveChainPromiseInternal = function(value)
{
	if (oFF.notNull(this.m_chainPromiseResolve))
	{
		this.m_chainPromiseResolve(value);
	}
};
oFF.XThenChainPromiseInternal.prototype._setupChainPromise = function(onFulfilled, onRejected)
{
	this.m_onFulfilled = onFulfilled;
	this.m_onRejected = onRejected;
	this.m_chainPromise = oFF.XPromise.create((resolve, reject) => {
		this.m_chainPromiseResolve = resolve;
		this.m_chainPromiseReject = reject;
	});
};
oFF.XThenChainPromiseInternal.prototype.getChainPromise = function()
{
	if (oFF.notNull(this.m_chainPromise))
	{
		return this.m_chainPromise;
	}
	return null;
};
oFF.XThenChainPromiseInternal.prototype.rejectChainPromise = function(error)
{
	try
	{
		let tmpRejectFunction = this._getOnRejectCallback();
		if (oFF.notNull(tmpRejectFunction))
		{
			let fulfillValue = tmpRejectFunction(error);
			this._resolveChainPromiseInternal(fulfillValue);
		}
		else
		{
			this._rejectChainedPromiseInternal(error);
		}
	}
	catch (e)
	{
		this._rejectChainedPromiseInternal(oFF.XError.createWithThrowable(e));
	}
};
oFF.XThenChainPromiseInternal.prototype.releaseObject = function()
{
	this.m_onFulfilled = null;
	this.m_onRejected = null;
	this.m_chainPromise = null;
	this.m_chainPromiseResolve = null;
	this.m_chainPromiseReject = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.XThenChainPromiseInternal.prototype.resolveChainPromise = function(value)
{
	try
	{
		let returnFulfillValue = null;
		let tmpFullfillFunction = this._getOnFulfillCallback();
		if (oFF.notNull(tmpFullfillFunction))
		{
			returnFulfillValue = tmpFullfillFunction(value);
		}
		else
		{
			returnFulfillValue = oFF.XObject.castToAny(value);
		}
		this._resolveChainPromiseInternal(returnFulfillValue);
	}
	catch (e)
	{
		this._rejectChainedPromiseInternal(oFF.XError.createWithThrowable(e));
	}
};

oFF.XRegex = function() {};
oFF.XRegex.prototype = new oFF.XObject();
oFF.XRegex.prototype._ff_c = "XRegex";

oFF.XRegex.s_instance = null;
oFF.XRegex.getInstance = function()
{
	return oFF.XRegex.s_instance;
};
oFF.XRegex.setInstance = function(instance)
{
	oFF.XRegex.s_instance = instance;
};
oFF.XRegex.prototype.getAllGroupsOfMatch = oFF.noSupport;
oFF.XRegex.prototype.getFirstGroupOfMatch = oFF.noSupport;
oFF.XRegex.prototype.getFirstMatch = function(target, pattern)
{
	return this.getFirstMatchFrom(target, pattern, 0);
};
oFF.XRegex.prototype.getFirstMatchFrom = oFF.noSupport;
oFF.XRegex.prototype.replaceAll = oFF.noSupport;
oFF.XRegex.prototype.replaceMatches = oFF.noSupport;

oFF.XRegexMatch = function() {};
oFF.XRegexMatch.prototype = new oFF.XObject();
oFF.XRegexMatch.prototype._ff_c = "XRegexMatch";

oFF.XRegexMatch.create = function(groups, groupsStart, groupsEnd)
{
	let matcher = new oFF.XRegexMatch();
	matcher.m_groups = groups.getValuesAsReadOnlyList();
	matcher.m_groupsStart = groupsStart.getValuesAsReadOnlyList();
	matcher.m_groupsEnd = groupsEnd.getValuesAsReadOnlyList();
	return matcher;
};
oFF.XRegexMatch.prototype.m_groups = null;
oFF.XRegexMatch.prototype.m_groupsEnd = null;
oFF.XRegexMatch.prototype.m_groupsStart = null;
oFF.XRegexMatch.prototype.getGroup = function(groupIndex)
{
	if (groupIndex <= this.getGroupCount())
	{
		return this.m_groups.get(groupIndex);
	}
	return null;
};
oFF.XRegexMatch.prototype.getGroupCount = function()
{
	if (oFF.isNull(this.m_groups))
	{
		return 0;
	}
	return this.m_groups.size() - 1;
};
oFF.XRegexMatch.prototype.getGroupEnd = function(groupIndex)
{
	if (oFF.notNull(this.m_groupsEnd) && groupIndex <= this.m_groupsEnd.size())
	{
		return this.m_groupsEnd.get(groupIndex).getInteger();
	}
	return -1;
};
oFF.XRegexMatch.prototype.getGroupStart = function(groupIndex)
{
	if (oFF.notNull(this.m_groupsStart) && groupIndex <= this.m_groupsStart.size())
	{
		return this.m_groupsStart.get(groupIndex).getInteger();
	}
	return -1;
};

oFF.XStdio = {

	s_stdio:null,
	getInstance:function()
	{
			return oFF.XStdio.s_stdio;
	},
	setInstance:function(stdio)
	{
			oFF.XStdio.s_stdio = stdio;
	}
};

oFF.XBase64 = function() {};
oFF.XBase64.prototype = new oFF.XObject();
oFF.XBase64.prototype._ff_c = "XBase64";

oFF.XBase64.s_instance = null;
oFF.XBase64.getInstance = function()
{
	return oFF.XBase64.s_instance;
};
oFF.XBase64.setInstance = function(instance)
{
	oFF.XBase64.s_instance = instance;
};
oFF.XBase64.prototype.decodeToString = function(encoded)
{
	return oFF.XByteArray.convertToString(this.decodeToBytes(encoded));
};
oFF.XBase64.prototype.encodeFromString = function(decoded)
{
	return this.encodeFromBytes(oFF.XByteArray.convertFromString(decoded));
};

oFF.XSha1 = function() {};
oFF.XSha1.prototype = new oFF.XObject();
oFF.XSha1.prototype._ff_c = "XSha1";

oFF.XSha1.s_instance = null;
oFF.XSha1.createSHA1 = function(text)
{
	return oFF.XSha1.getInstance().encode(text);
};
oFF.XSha1.getInstance = function()
{
	return oFF.XSha1.s_instance;
};
oFF.XSha1.setInstance = function(instance)
{
	oFF.XSha1.s_instance = instance;
};

oFF.DfEncoderAES = function() {};
oFF.DfEncoderAES.prototype = new oFF.DfEncoder();
oFF.DfEncoderAES.prototype._ff_c = "DfEncoderAES";

oFF.DfEncoderAES.ENCRYPTION_MODE = "AES-GCM";
oFF.DfEncoderAES.IV_LENGTH = 16;
oFF.DfEncoderAES.KEY_LENGTH_BITS = 256;

oFF.DfEncoderFactory = function() {};
oFF.DfEncoderFactory.prototype = new oFF.XEncoderFactory();
oFF.DfEncoderFactory.prototype._ff_c = "DfEncoderFactory";

oFF.DfEncoderFactory.prototype.createNoop = function()
{
	return oFF.XEncoderNoop.create();
};

oFF.DfEncoderSecretFactory = function() {};
oFF.DfEncoderSecretFactory.prototype = new oFF.XEncoderSecretFactory();
oFF.DfEncoderSecretFactory.prototype._ff_c = "DfEncoderSecretFactory";


oFF.XEncoderNoop = function() {};
oFF.XEncoderNoop.prototype = new oFF.DfEncoder();
oFF.XEncoderNoop.prototype._ff_c = "XEncoderNoop";

oFF.XEncoderNoop.create = function()
{
	let encoder = new oFF.XEncoderNoop();
	encoder.setupDfEncoder(oFF.XEncoderResultType.NOOP);
	return encoder;
};
oFF.XEncoderNoop.prototype.decode = function(encoded)
{
	return oFF.XPromise.create((resolve, reject) => {
		if (!this.ensureResultTypeIsValid(encoded, reject))
		{
			return;
		}
		let castedEncoded = encoded;
		resolve(castedEncoded.getContent());
	});
};
oFF.XEncoderNoop.prototype.encode = function(decoded)
{
	return oFF.XPromise.create((resolve, reject) => {
		resolve(oFF.XEncoderNoopResult.create(decoded));
	});
};

oFF.XError = function() {};
oFF.XError.prototype = new oFF.XObject();
oFF.XError.prototype._ff_c = "XError";

oFF.XError.create = function(text)
{
	let instance = new oFF.XError();
	instance.m_text = text;
	instance.m_type = oFF.XErrorType.GENERIC;
	return instance;
};
oFF.XError.createWithMessage = function(message)
{
	let instance = new oFF.XError();
	instance.m_text = message.getText();
	instance.m_message = message;
	instance.m_type = oFF.XErrorType.GENERIC;
	return instance;
};
oFF.XError.createWithThrowable = function(throwable)
{
	let instance = new oFF.XError();
	instance.m_text = oFF.XException.getMessage(throwable);
	instance.m_throwable = throwable;
	instance.m_type = oFF.XErrorType.GENERIC;
	return instance;
};
oFF.XError.prototype.m_cause = null;
oFF.XError.prototype.m_message = null;
oFF.XError.prototype.m_text = null;
oFF.XError.prototype.m_throwable = null;
oFF.XError.prototype.m_type = null;
oFF.XError.prototype.attachCause = function(cause)
{
	this.m_cause = cause;
	return this;
};
oFF.XError.prototype.getCause = function()
{
	return this.m_cause;
};
oFF.XError.prototype.getErrorType = function()
{
	return this.m_type;
};
oFF.XError.prototype.getMessage = function()
{
	return this.m_message;
};
oFF.XError.prototype.getText = function()
{
	return this.m_text;
};
oFF.XError.prototype.getThrowable = function()
{
	return this.m_throwable;
};
oFF.XError.prototype.setErrorType = function(errorType)
{
	if (oFF.notNull(errorType))
	{
		this.m_type = errorType;
	}
	return this;
};
oFF.XError.prototype.toString = function()
{
	let result = oFF.XStringBuffer.create().append("XError: ").append(this.m_text);
	if (oFF.notNull(this.m_message))
	{
		result.appendNewLine().append("Message: ").append(this.m_message.toString());
	}
	if (oFF.notNull(this.m_throwable))
	{
		result.appendNewLine().append("Thrown By: ").appendNewLine().append(oFF.XException.getMessage(this.m_throwable)).appendNewLine().append(oFF.XException.getStackTrace(this.m_throwable, 0));
	}
	if (oFF.notNull(this.m_cause))
	{
		result.appendNewLine().append("Caused By: ").appendNewLine().append(this.m_cause.toString());
	}
	return result.toString();
};

oFF.DfStdio = function() {};
oFF.DfStdio.prototype = new oFF.XObject();
oFF.DfStdio.prototype._ff_c = "DfStdio";

oFF.DfStdio.prototype.getStderr = function()
{
	return this;
};
oFF.DfStdio.prototype.getStdin = function()
{
	return this;
};
oFF.DfStdio.prototype.getStdlog = function()
{
	return this;
};
oFF.DfStdio.prototype.getStdout = function()
{
	return this;
};
oFF.DfStdio.prototype.print = function(text) {};
oFF.DfStdio.prototype.printError = function(errorMsg)
{
	this.println(errorMsg);
};
oFF.DfStdio.prototype.println = function(text) {};
oFF.DfStdio.prototype.readLine = function(listener)
{
	return null;
};
oFF.DfStdio.prototype.setAllowUserInput = function(allowInput) {};
oFF.DfStdio.prototype.supportsSyncType = function(syncType)
{
	return false;
};

oFF.XDateTimeFactory = function() {};
oFF.XDateTimeFactory.prototype = new oFF.XObjectExt();
oFF.XDateTimeFactory.prototype._ff_c = "XDateTimeFactory";

oFF.XDateTimeFactory.s_instance = null;
oFF.XDateTimeFactory.getInstance = function()
{
	return oFF.XDateTimeFactory.s_instance;
};

oFF.XNumberFormatterSettingsFactory = function() {};
oFF.XNumberFormatterSettingsFactory.prototype = new oFF.XObjectExt();
oFF.XNumberFormatterSettingsFactory.prototype._ff_c = "XNumberFormatterSettingsFactory";

oFF.XNumberFormatterSettingsFactory.s_instance = null;
oFF.XNumberFormatterSettingsFactory.getInstance = function()
{
	return oFF.XNumberFormatterSettingsFactory.s_instance;
};

oFF.XWriteStreamBuffer = function() {};
oFF.XWriteStreamBuffer.prototype = new oFF.XObjectExt();
oFF.XWriteStreamBuffer.prototype._ff_c = "XWriteStreamBuffer";

oFF.XWriteStreamBuffer.create = function()
{
	let streamBuffer = new oFF.XWriteStreamBuffer();
	streamBuffer.m_buffer = oFF.XStringBuffer.create();
	return streamBuffer;
};
oFF.XWriteStreamBuffer.prototype.m_buffer = null;
oFF.XWriteStreamBuffer.prototype.print = function(text)
{
	this.m_buffer.append(text);
};
oFF.XWriteStreamBuffer.prototype.println = function(text)
{
	this.m_buffer.appendLine(text);
};
oFF.XWriteStreamBuffer.prototype.toString = function()
{
	return this.m_buffer.toString();
};

oFF.XClassElement = function() {};
oFF.XClassElement.prototype = new oFF.DfNameObject();
oFF.XClassElement.prototype._ff_c = "XClassElement";

oFF.XClassElement.prototype.m_accessModifier = null;
oFF.XClassElement.prototype.getAccessModifier = function()
{
	return this.m_accessModifier;
};

oFF.DfLogWriter = function() {};
oFF.DfLogWriter.prototype = new oFF.XObject();
oFF.DfLogWriter.prototype._ff_c = "DfLogWriter";

oFF.DfLogWriter.createLogString = function(layer, severity, code, message)
{
	let buffer = oFF.XStringBuffer.create();
	buffer.append("[").append(oFF.XDateTimeFactory.getInstance().createTime().toIsoFormat()).append("] ");
	if (oFF.notNull(severity))
	{
		buffer.append("[").append(severity.getName()).append("] ");
	}
	if (oFF.notNull(layer))
	{
		buffer.append(layer).append(": ");
	}
	if (code !== oFF.ErrorCodes.OTHER_ERROR)
	{
		buffer.append("(#");
		buffer.appendInt(code);
		buffer.append(") ");
	}
	if (oFF.notNull(message))
	{
		buffer.append(message);
	}
	return buffer.toString();
};
oFF.DfLogWriter.prototype.addLogLayer = function(layer) {};
oFF.DfLogWriter.prototype.clear = function() {};
oFF.DfLogWriter.prototype.disableAllLogLayers = function() {};
oFF.DfLogWriter.prototype.disableAllLogSeverity = function()
{
	this.setLogFilterLevel(oFF.Severity.PRINT.getLevel());
};
oFF.DfLogWriter.prototype.disableAllLogs = function()
{
	this.disableAllLogLayers();
	this.disableAllLogSeverity();
};
oFF.DfLogWriter.prototype.enableAllLogLayers = function() {};
oFF.DfLogWriter.prototype.enableAllLogSeverity = function()
{
	this.setLogFilterLevel(oFF.Severity.DEBUG.getLevel());
};
oFF.DfLogWriter.prototype.enableAllLogs = function()
{
	this.enableAllLogLayers();
	this.enableAllLogSeverity();
};
oFF.DfLogWriter.prototype.hasElements = function()
{
	return false;
};
oFF.DfLogWriter.prototype.isEmpty = function()
{
	return true;
};
oFF.DfLogWriter.prototype.isLogWritten = function(layer, severity)
{
	return true;
};
oFF.DfLogWriter.prototype.setLogFilterLevel = function(filterLevel) {};
oFF.DfLogWriter.prototype.setLogFilterSeverity = function(filterLevel)
{
	this.setLogFilterLevel(filterLevel.getLevel());
};
oFF.DfLogWriter.prototype.size = function()
{
	return 0;
};

oFF.DateRangeGranularity = function() {};
oFF.DateRangeGranularity.prototype = new oFF.XConstant();
oFF.DateRangeGranularity.prototype._ff_c = "DateRangeGranularity";

oFF.DateRangeGranularity.CURRENT_MONTH = null;
oFF.DateRangeGranularity.CURRENT_QUARTER = null;
oFF.DateRangeGranularity.CURRENT_YEAR = null;
oFF.DateRangeGranularity.DAY = null;
oFF.DateRangeGranularity.HALF_YEAR = null;
oFF.DateRangeGranularity.MONTH = null;
oFF.DateRangeGranularity.QUARTER = null;
oFF.DateRangeGranularity.YEAR = null;
oFF.DateRangeGranularity.getHighest = function(granularities)
{
	if (oFF.XCollectionUtils.hasElements(granularities))
	{
		if (granularities.contains(oFF.DateRangeGranularity.DAY))
		{
			return oFF.DateRangeGranularity.DAY;
		}
		if (granularities.contains(oFF.DateRangeGranularity.MONTH))
		{
			return oFF.DateRangeGranularity.MONTH;
		}
		if (granularities.contains(oFF.DateRangeGranularity.QUARTER))
		{
			return oFF.DateRangeGranularity.QUARTER;
		}
		if (granularities.contains(oFF.DateRangeGranularity.HALF_YEAR))
		{
			return oFF.DateRangeGranularity.HALF_YEAR;
		}
		return oFF.DateRangeGranularity.YEAR;
	}
	return null;
};
oFF.DateRangeGranularity.staticSetup = function()
{
	oFF.DateRangeGranularity.YEAR = oFF.XConstant.setupName(new oFF.DateRangeGranularity(), "Year");
	oFF.DateRangeGranularity.HALF_YEAR = oFF.XConstant.setupName(new oFF.DateRangeGranularity(), "HalfYear");
	oFF.DateRangeGranularity.QUARTER = oFF.XConstant.setupName(new oFF.DateRangeGranularity(), "Quarter");
	oFF.DateRangeGranularity.MONTH = oFF.XConstant.setupName(new oFF.DateRangeGranularity(), "Month");
	oFF.DateRangeGranularity.DAY = oFF.XConstant.setupName(new oFF.DateRangeGranularity(), "Day");
	oFF.DateRangeGranularity.CURRENT_YEAR = oFF.XConstant.setupName(new oFF.DateRangeGranularity(), "CurrentYear");
	oFF.DateRangeGranularity.CURRENT_QUARTER = oFF.XConstant.setupName(new oFF.DateRangeGranularity(), "CurrentQuarter");
	oFF.DateRangeGranularity.CURRENT_MONTH = oFF.XConstant.setupName(new oFF.DateRangeGranularity(), "CurrentMonth");
};
oFF.DateRangeGranularity.prototype.isCurrentDateUnit = function()
{
	return this === oFF.DateRangeGranularity.CURRENT_YEAR || this === oFF.DateRangeGranularity.CURRENT_QUARTER || this === oFF.DateRangeGranularity.CURRENT_MONTH;
};
oFF.DateRangeGranularity.prototype.isDay = function()
{
	return this === oFF.DateRangeGranularity.DAY;
};
oFF.DateRangeGranularity.prototype.isHalfYear = function()
{
	return this === oFF.DateRangeGranularity.HALF_YEAR;
};
oFF.DateRangeGranularity.prototype.isMonth = function()
{
	return this === oFF.DateRangeGranularity.MONTH || this === oFF.DateRangeGranularity.CURRENT_MONTH;
};
oFF.DateRangeGranularity.prototype.isQuarter = function()
{
	return this === oFF.DateRangeGranularity.QUARTER || this === oFF.DateRangeGranularity.CURRENT_QUARTER;
};
oFF.DateRangeGranularity.prototype.isYear = function()
{
	return this === oFF.DateRangeGranularity.YEAR || this === oFF.DateRangeGranularity.CURRENT_YEAR;
};

oFF.DateTimeFormat = function() {};
oFF.DateTimeFormat.prototype = new oFF.XConstant();
oFF.DateTimeFormat.prototype._ff_c = "DateTimeFormat";

oFF.DateTimeFormat.ISO = null;
oFF.DateTimeFormat.SAP = null;
oFF.DateTimeFormat.staticSetup = function()
{
	oFF.DateTimeFormat.ISO = oFF.XConstant.setupName(new oFF.DateTimeFormat(), "IsoDate");
	oFF.DateTimeFormat.SAP = oFF.XConstant.setupName(new oFF.DateTimeFormat(), "SapDate");
};

oFF.DateTimeGranularityType = function() {};
oFF.DateTimeGranularityType.prototype = new oFF.XConstant();
oFF.DateTimeGranularityType.prototype._ff_c = "DateTimeGranularityType";

oFF.DateTimeGranularityType.ALL = null;
oFF.DateTimeGranularityType.CALMONTH = null;
oFF.DateTimeGranularityType.CALQUARTER = null;
oFF.DateTimeGranularityType.DAY = null;
oFF.DateTimeGranularityType.HALFYEAR = null;
oFF.DateTimeGranularityType.HOUR = null;
oFF.DateTimeGranularityType.MILLISECOND = null;
oFF.DateTimeGranularityType.MINUTE = null;
oFF.DateTimeGranularityType.SECOND = null;
oFF.DateTimeGranularityType.WEEK = null;
oFF.DateTimeGranularityType.YEAR = null;
oFF.DateTimeGranularityType.s_lookup = null;
oFF.DateTimeGranularityType.create = function(name)
{
	let newConstant = oFF.XConstant.setupName(new oFF.DateTimeGranularityType(), name);
	oFF.DateTimeGranularityType.s_lookup.add(newConstant);
	return newConstant;
};
oFF.DateTimeGranularityType.lookup = function(name)
{
	return oFF.DateTimeGranularityType.s_lookup.getByKey(name);
};
oFF.DateTimeGranularityType.staticSetup = function()
{
	oFF.DateTimeGranularityType.s_lookup = oFF.XSetOfNameObject.create();
	oFF.DateTimeGranularityType.ALL = oFF.DateTimeGranularityType.create("ALL");
	oFF.DateTimeGranularityType.YEAR = oFF.DateTimeGranularityType.create("YEAR");
	oFF.DateTimeGranularityType.HALFYEAR = oFF.DateTimeGranularityType.create("HALFYEAR");
	oFF.DateTimeGranularityType.CALQUARTER = oFF.DateTimeGranularityType.create("CALQUARTER");
	oFF.DateTimeGranularityType.CALMONTH = oFF.DateTimeGranularityType.create("CALMONTH");
	oFF.DateTimeGranularityType.WEEK = oFF.DateTimeGranularityType.create("WEEK");
	oFF.DateTimeGranularityType.DAY = oFF.DateTimeGranularityType.create("DAY");
	oFF.DateTimeGranularityType.HOUR = oFF.DateTimeGranularityType.create("HOUR");
	oFF.DateTimeGranularityType.MINUTE = oFF.DateTimeGranularityType.create("MINUTE");
	oFF.DateTimeGranularityType.SECOND = oFF.DateTimeGranularityType.create("SECOND");
	oFF.DateTimeGranularityType.MILLISECOND = oFF.DateTimeGranularityType.create("MILLISECOND");
};

oFF.XCalendarType = function() {};
oFF.XCalendarType.prototype = new oFF.XConstant();
oFF.XCalendarType.prototype._ff_c = "XCalendarType";

oFF.XCalendarType.BUDDHIST = null;
oFF.XCalendarType.GREGORIAN = null;
oFF.XCalendarType.ISLAMIC = null;
oFF.XCalendarType.JAPANESE = null;
oFF.XCalendarType.PERSIAN = null;
oFF.XCalendarType.s_lookup = null;
oFF.XCalendarType.create = function(name)
{
	let newConstant = new oFF.XCalendarType();
	newConstant._setupInternal(name);
	oFF.XCalendarType.s_lookup.put(name, newConstant);
	return newConstant;
};
oFF.XCalendarType.lookup = function(value)
{
	return oFF.XCalendarType.s_lookup.getByKey(value);
};
oFF.XCalendarType.staticSetup = function()
{
	oFF.XCalendarType.s_lookup = oFF.XHashMapByString.create();
	oFF.XCalendarType.BUDDHIST = oFF.XCalendarType.create("Buddhist");
	oFF.XCalendarType.GREGORIAN = oFF.XCalendarType.create("Gregorian");
	oFF.XCalendarType.ISLAMIC = oFF.XCalendarType.create("Islamic");
	oFF.XCalendarType.JAPANESE = oFF.XCalendarType.create("Japanese");
	oFF.XCalendarType.PERSIAN = oFF.XCalendarType.create("Persian");
};

oFF.CurrencyPresentation = function() {};
oFF.CurrencyPresentation.prototype = new oFF.XConstant();
oFF.CurrencyPresentation.prototype._ff_c = "CurrencyPresentation";

oFF.CurrencyPresentation.ISO = null;
oFF.CurrencyPresentation.SYMBOL = null;
oFF.CurrencyPresentation.s_all = null;
oFF.CurrencyPresentation.create = function(name)
{
	let newConstant = oFF.XConstant.setupName(new oFF.CurrencyPresentation(), name);
	oFF.CurrencyPresentation.s_all.add(newConstant);
	return newConstant;
};
oFF.CurrencyPresentation.lookup = function(name)
{
	return oFF.CurrencyPresentation.s_all.getByKey(name);
};
oFF.CurrencyPresentation.staticSetup = function()
{
	oFF.CurrencyPresentation.s_all = oFF.XSetOfNameObject.create();
	oFF.CurrencyPresentation.SYMBOL = oFF.CurrencyPresentation.create("Symbol");
	oFF.CurrencyPresentation.ISO = oFF.CurrencyPresentation.create("Iso");
};

oFF.ScaleAndUnitPlacement = function() {};
oFF.ScaleAndUnitPlacement.prototype = new oFF.XConstant();
oFF.ScaleAndUnitPlacement.prototype._ff_c = "ScaleAndUnitPlacement";

oFF.ScaleAndUnitPlacement.CELL = null;
oFF.ScaleAndUnitPlacement.COLUMNS = null;
oFF.ScaleAndUnitPlacement.ROWS = null;
oFF.ScaleAndUnitPlacement.SUBTITLE = null;
oFF.ScaleAndUnitPlacement.s_all = null;
oFF.ScaleAndUnitPlacement.create = function(name)
{
	let newConstant = oFF.XConstant.setupName(new oFF.ScaleAndUnitPlacement(), name);
	oFF.ScaleAndUnitPlacement.s_all.add(newConstant);
	return newConstant;
};
oFF.ScaleAndUnitPlacement.lookup = function(name)
{
	return oFF.ScaleAndUnitPlacement.s_all.getByKey(name);
};
oFF.ScaleAndUnitPlacement.staticSetup = function()
{
	oFF.ScaleAndUnitPlacement.s_all = oFF.XSetOfNameObject.create();
	oFF.ScaleAndUnitPlacement.CELL = oFF.ScaleAndUnitPlacement.create("Cell");
	oFF.ScaleAndUnitPlacement.ROWS = oFF.ScaleAndUnitPlacement.create("Rows");
	oFF.ScaleAndUnitPlacement.COLUMNS = oFF.ScaleAndUnitPlacement.create("Columns");
	oFF.ScaleAndUnitPlacement.SUBTITLE = oFF.ScaleAndUnitPlacement.create("Subtitle");
};

oFF.ScaleFormat = function() {};
oFF.ScaleFormat.prototype = new oFF.XConstant();
oFF.ScaleFormat.prototype._ff_c = "ScaleFormat";

oFF.ScaleFormat.LONG = null;
oFF.ScaleFormat.SHORT = null;
oFF.ScaleFormat.s_all = null;
oFF.ScaleFormat.create = function(name)
{
	let newConstant = oFF.XConstant.setupName(new oFF.ScaleFormat(), name);
	oFF.ScaleFormat.s_all.add(newConstant);
	return newConstant;
};
oFF.ScaleFormat.lookup = function(name)
{
	return oFF.ScaleFormat.s_all.getByKey(name);
};
oFF.ScaleFormat.staticSetup = function()
{
	oFF.ScaleFormat.s_all = oFF.XSetOfNameObject.create();
	oFF.ScaleFormat.SHORT = oFF.ScaleFormat.create("Short");
	oFF.ScaleFormat.LONG = oFF.ScaleFormat.create("Long");
};

oFF.SignPresentation = function() {};
oFF.SignPresentation.prototype = new oFF.XConstant();
oFF.SignPresentation.prototype._ff_c = "SignPresentation";

oFF.SignPresentation.AFTER_NUMBER = null;
oFF.SignPresentation.BEFORE_NUMBER = null;
oFF.SignPresentation.BRACKETS = null;
oFF.SignPresentation.s_all = null;
oFF.SignPresentation.create = function(name)
{
	let newConstant = oFF.XConstant.setupName(new oFF.SignPresentation(), name);
	oFF.SignPresentation.s_all.add(newConstant);
	return newConstant;
};
oFF.SignPresentation.lookup = function(name)
{
	return oFF.SignPresentation.s_all.getByKey(name);
};
oFF.SignPresentation.staticSetup = function()
{
	oFF.SignPresentation.s_all = oFF.XSetOfNameObject.create();
	oFF.SignPresentation.BEFORE_NUMBER = oFF.SignPresentation.create("BEFORE_NUMBER");
	oFF.SignPresentation.AFTER_NUMBER = oFF.SignPresentation.create("AFTER_NUMBER");
	oFF.SignPresentation.BRACKETS = oFF.SignPresentation.create("BRACKETS");
};

oFF.TraceType = function() {};
oFF.TraceType.prototype = new oFF.XConstant();
oFF.TraceType.prototype._ff_c = "TraceType";

oFF.TraceType.BW_CATT = null;
oFF.TraceType.BW_STD = null;
oFF.TraceType.FILE = null;
oFF.TraceType.JSON = null;
oFF.TraceType.NONE = null;
oFF.TraceType.URL = null;
oFF.TraceType.lookup = function(name)
{
	if (oFF.XStringUtils.isNullOrEmpty(name))
	{
		return null;
	}
	switch (name)
	{
		case "None":
			return oFF.TraceType.NONE;

		case "Url":
			return oFF.TraceType.URL;

		case "File":
			return oFF.TraceType.FILE;

		case "JsonEmbedded":
			return oFF.TraceType.JSON;

		case "BWStd":
			return oFF.TraceType.BW_STD;

		case "BWCATT":
			return oFF.TraceType.BW_CATT;

		default:
			return null;
	}
};
oFF.TraceType.staticSetup = function()
{
	oFF.TraceType.NONE = oFF.XConstant.setupName(new oFF.TraceType(), "None");
	oFF.TraceType.URL = oFF.XConstant.setupName(new oFF.TraceType(), "Url");
	oFF.TraceType.FILE = oFF.XConstant.setupName(new oFF.TraceType(), "File");
	oFF.TraceType.JSON = oFF.XConstant.setupName(new oFF.TraceType(), "JsonEmbedded");
	oFF.TraceType.BW_STD = oFF.XConstant.setupName(new oFF.TraceType(), "BWStd");
	oFF.TraceType.BW_CATT = oFF.XConstant.setupName(new oFF.TraceType(), "BWCATT");
};

oFF.TriStateBool = function() {};
oFF.TriStateBool.prototype = new oFF.XConstant();
oFF.TriStateBool.prototype._ff_c = "TriStateBool";

oFF.TriStateBool._DEFAULT = null;
oFF.TriStateBool._FALSE = null;
oFF.TriStateBool._TRUE = null;
oFF.TriStateBool.create = function(constant, aequivalent)
{
	let object = new oFF.TriStateBool();
	object.setupExt(constant, aequivalent);
	return object;
};
oFF.TriStateBool.getBooleanWithFallback = function(triStateBool, fallback)
{
	let result;
	if (triStateBool === oFF.TriStateBool._TRUE)
	{
		result = true;
	}
	else if (triStateBool === oFF.TriStateBool._FALSE)
	{
		result = false;
	}
	else
	{
		result = fallback;
	}
	return result;
};
oFF.TriStateBool.isExplicitBooleanValue = function(triStateBool)
{
	return triStateBool === oFF.TriStateBool._FALSE || triStateBool === oFF.TriStateBool._TRUE;
};
oFF.TriStateBool.lookup = function(value)
{
	if (value)
	{
		return oFF.TriStateBool._TRUE;
	}
	return oFF.TriStateBool._FALSE;
};
oFF.TriStateBool.staticSetup = function()
{
	oFF.TriStateBool._TRUE = oFF.TriStateBool.create("TRUE", true);
	oFF.TriStateBool._FALSE = oFF.TriStateBool.create("FALSE", false);
	oFF.TriStateBool._DEFAULT = oFF.TriStateBool.create("DEFAULT", false);
};
oFF.TriStateBool.prototype.m_boolAequivalent = false;
oFF.TriStateBool.prototype.getBoolean = function()
{
	return this.m_boolAequivalent;
};
oFF.TriStateBool.prototype.setupExt = function(constant, aequivalent)
{
	this._setupInternal(constant);
	this.m_boolAequivalent = aequivalent;
};

oFF.XEncoderResultType = function() {};
oFF.XEncoderResultType.prototype = new oFF.XConstant();
oFF.XEncoderResultType.prototype._ff_c = "XEncoderResultType";

oFF.XEncoderResultType.AES = null;
oFF.XEncoderResultType.NOOP = null;
oFF.XEncoderResultType.s_lookup = null;
oFF.XEncoderResultType.create = function(name)
{
	let newConstant = new oFF.XEncoderResultType();
	newConstant._setupInternal(name);
	oFF.XEncoderResultType.s_lookup.put(name, newConstant);
	return newConstant;
};
oFF.XEncoderResultType.lookup = function(value)
{
	return oFF.XEncoderResultType.s_lookup.getByKey(oFF.XString.toLowerCase(value));
};
oFF.XEncoderResultType.lookupWithDefault = function(value, defaultValue)
{
	let encoderResultType = oFF.XEncoderResultType.lookup(value);
	if (oFF.notNull(encoderResultType))
	{
		return encoderResultType;
	}
	return defaultValue;
};
oFF.XEncoderResultType.staticSetup = function()
{
	oFF.XEncoderResultType.s_lookup = oFF.XHashMapByString.create();
	oFF.XEncoderResultType.AES = oFF.XEncoderResultType.create("aes");
	oFF.XEncoderResultType.NOOP = oFF.XEncoderResultType.create("noop");
};

oFF.XEncoderType = function() {};
oFF.XEncoderType.prototype = new oFF.XConstant();
oFF.XEncoderType.prototype._ff_c = "XEncoderType";

oFF.XEncoderType.DEFAULT = null;
oFF.XEncoderType.OFF = null;
oFF.XEncoderType.s_lookup = null;
oFF.XEncoderType.create = function(name)
{
	let newConstant = new oFF.XEncoderType();
	newConstant._setupInternal(name);
	oFF.XEncoderType.s_lookup.put(name, newConstant);
	return newConstant;
};
oFF.XEncoderType.lookup = function(value)
{
	return oFF.XEncoderType.s_lookup.getByKey(oFF.XString.toLowerCase(value));
};
oFF.XEncoderType.lookupWithDefault = function(value, defaultValue)
{
	let encoderType = oFF.XEncoderType.lookup(value);
	if (oFF.notNull(encoderType))
	{
		return encoderType;
	}
	return defaultValue;
};
oFF.XEncoderType.staticSetup = function()
{
	oFF.XEncoderType.s_lookup = oFF.XHashMapByString.create();
	oFF.XEncoderType.OFF = oFF.XEncoderType.create("off");
	oFF.XEncoderType.DEFAULT = oFF.XEncoderType.create("default");
};

oFF.XAccessModifier = function() {};
oFF.XAccessModifier.prototype = new oFF.XConstant();
oFF.XAccessModifier.prototype._ff_c = "XAccessModifier";

oFF.XAccessModifier.PRIVATE = null;
oFF.XAccessModifier.PROTECTED = null;
oFF.XAccessModifier.PUBLIC = null;
oFF.XAccessModifier.staticSetup = function()
{
	oFF.XAccessModifier.PRIVATE = oFF.XConstant.setupName(new oFF.XAccessModifier(), "Private");
	oFF.XAccessModifier.PROTECTED = oFF.XConstant.setupName(new oFF.XAccessModifier(), "Protected");
	oFF.XAccessModifier.PUBLIC = oFF.XConstant.setupName(new oFF.XAccessModifier(), "Public");
};

oFF.XMember = function() {};
oFF.XMember.prototype = new oFF.XClassElement();
oFF.XMember.prototype._ff_c = "XMember";

oFF.XMember.create = function(name, accessModifier)
{
	let member = new oFF.XMember();
	member._setupInternal(name);
	member.m_accessModifier = accessModifier;
	return member;
};

oFF.XMethod = function() {};
oFF.XMethod.prototype = new oFF.XClassElement();
oFF.XMethod.prototype._ff_c = "XMethod";

oFF.XMethod.create = function(name, accessModifier)
{
	let method = new oFF.XMethod();
	method._setupInternal(name);
	method.m_accessModifier = accessModifier;
	return method;
};

oFF.ExtendedInfoType = function() {};
oFF.ExtendedInfoType.prototype = new oFF.XConstant();
oFF.ExtendedInfoType.prototype._ff_c = "ExtendedInfoType";

oFF.ExtendedInfoType.CONTEXT_STRUCTURE = null;
oFF.ExtendedInfoType.QUERY_MODEL_ID = null;
oFF.ExtendedInfoType.UNKNOWN = null;
oFF.ExtendedInfoType.staticSetup = function()
{
	oFF.ExtendedInfoType.UNKNOWN = oFF.XConstant.setupName(new oFF.ExtendedInfoType(), "UNKNOWN");
	oFF.ExtendedInfoType.CONTEXT_STRUCTURE = oFF.XConstant.setupName(new oFF.ExtendedInfoType(), "CONTEXT_STRUCTURE");
	oFF.ExtendedInfoType.QUERY_MODEL_ID = oFF.XConstant.setupName(new oFF.ExtendedInfoType(), "QUERY_MODEL_ID");
};

oFF.XPromiseState = function() {};
oFF.XPromiseState.prototype = new oFF.XConstant();
oFF.XPromiseState.prototype._ff_c = "XPromiseState";

oFF.XPromiseState.FULFILLED = null;
oFF.XPromiseState.PENDING = null;
oFF.XPromiseState.REJECTED = null;
oFF.XPromiseState.staticSetup = function()
{
	oFF.XPromiseState.PENDING = oFF.XConstant.setupName(new oFF.XPromiseState(), "Pending");
	oFF.XPromiseState.FULFILLED = oFF.XConstant.setupName(new oFF.XPromiseState(), "Fulfilled");
	oFF.XPromiseState.REJECTED = oFF.XConstant.setupName(new oFF.XPromiseState(), "Rejected");
};

oFF.SyncType = function() {};
oFF.SyncType.prototype = new oFF.XConstant();
oFF.SyncType.prototype._ff_c = "SyncType";

oFF.SyncType.BLOCKING = null;
oFF.SyncType.DELAYED = null;
oFF.SyncType.NON_BLOCKING = null;
oFF.SyncType.REGISTER = null;
oFF.SyncType.UNREGISTER = null;
oFF.SyncType.staticSetup = function()
{
	oFF.SyncType.BLOCKING = oFF.XConstant.setupName(new oFF.SyncType(), "Blocking");
	oFF.SyncType.NON_BLOCKING = oFF.XConstant.setupName(new oFF.SyncType(), "NonBlocking");
	oFF.SyncType.DELAYED = oFF.XConstant.setupName(new oFF.SyncType(), "Delayed");
	oFF.SyncType.REGISTER = oFF.XConstant.setupName(new oFF.SyncType(), "Register");
	oFF.SyncType.UNREGISTER = oFF.XConstant.setupName(new oFF.SyncType(), "Unregister");
};

oFF.XValueFormat = function() {};
oFF.XValueFormat.prototype = new oFF.XConstant();
oFF.XValueFormat.prototype._ff_c = "XValueFormat";

oFF.XValueFormat.ISO_DATE = null;
oFF.XValueFormat.SAP_DATE = null;
oFF.XValueFormat.staticSetup = function()
{
	oFF.XValueFormat.ISO_DATE = oFF.DateTimeFormat.ISO;
	oFF.XValueFormat.SAP_DATE = oFF.DateTimeFormat.SAP;
};

oFF.XComponentType = function() {};
oFF.XComponentType.prototype = new oFF.XConstantWithParent();
oFF.XComponentType.prototype._ff_c = "XComponentType";

oFF.XComponentType._ACTION = null;
oFF.XComponentType._DATASOURCE = null;
oFF.XComponentType._GENERIC = null;
oFF.XComponentType._MODEL = null;
oFF.XComponentType._PROGRAM = null;
oFF.XComponentType._ROOT = null;
oFF.XComponentType._UI = null;
oFF.XComponentType._VALUE = null;
oFF.XComponentType.s_lookupAll = null;
oFF.XComponentType.createType = function(name, parent)
{
	return oFF.XConstantWithParent.setupWithNameAndParent(new oFF.XComponentType(), name, parent);
};
oFF.XComponentType.lookupComponentType = function(name)
{
	return oFF.XComponentType.s_lookupAll.getByKey(name);
};
oFF.XComponentType.staticSetupComponentType = function()
{
	oFF.XComponentType.s_lookupAll = oFF.XSetOfNameObject.create();
	oFF.XComponentType._ROOT = oFF.XConstantWithParent.setupWithNameAndParent(new oFF.XComponentType(), "_root", null);
	oFF.XComponentType._ACTION = oFF.XConstantWithParent.setupWithNameAndParent(new oFF.XComponentType(), "_action", oFF.XComponentType._ROOT);
	oFF.XComponentType._UI = oFF.XConstantWithParent.setupWithNameAndParent(new oFF.XComponentType(), "_ui", oFF.XComponentType._ROOT);
	oFF.XComponentType._DATASOURCE = oFF.XConstantWithParent.setupWithNameAndParent(new oFF.XComponentType(), "_datasource", oFF.XComponentType._ROOT);
	oFF.XComponentType._MODEL = oFF.XConstantWithParent.setupWithNameAndParent(new oFF.XComponentType(), "_model", oFF.XComponentType._ROOT);
	oFF.XComponentType._VALUE = oFF.XConstantWithParent.setupWithNameAndParent(new oFF.XComponentType(), "_value", oFF.XComponentType._ROOT);
	oFF.XComponentType._GENERIC = oFF.XConstantWithParent.setupWithNameAndParent(new oFF.XComponentType(), "_generic", oFF.XComponentType._ROOT);
	oFF.XComponentType._PROGRAM = oFF.XConstantWithParent.setupWithNameAndParent(new oFF.XComponentType(), "_program", oFF.XComponentType._ROOT);
};
oFF.XComponentType.prototype.setupExt = function(name, parent)
{
	oFF.XConstantWithParent.prototype.setupExt.call( this , name, parent);
	oFF.XComponentType.s_lookupAll.add(this);
};

oFF.XErrorType = function() {};
oFF.XErrorType.prototype = new oFF.XConstantWithParent();
oFF.XErrorType.prototype._ff_c = "XErrorType";

oFF.XErrorType.GENERIC = null;
oFF.XErrorType.createError = function(a, errorName, parent)
{
	if (oFF.XStringUtils.isNullOrEmpty(errorName))
	{
		throw oFF.XException.createIllegalArgumentException("Missing name, you cannot create an error without a name!");
	}
	if (oFF.notNull(parent))
	{
		a.setupExt(errorName, parent);
	}
	else
	{
		a.setupExt(errorName, oFF.XErrorType.GENERIC);
	}
	return a;
};
oFF.XErrorType.createExt = function(constant, parent)
{
	let et = new oFF.XErrorType();
	if (oFF.notNull(parent))
	{
		et.setupExt(constant, parent);
	}
	else
	{
		et.setupExt(constant, null);
	}
	return et;
};
oFF.XErrorType.staticSetup = function()
{
	oFF.XErrorType.GENERIC = oFF.XErrorType.createExt("Generic", null);
};

oFF.XPromiseList = function() {};
oFF.XPromiseList.prototype = new oFF.XObject();
oFF.XPromiseList.prototype._ff_c = "XPromiseList";

oFF.XPromiseList.create = function()
{
	let newList = new oFF.XPromiseList();
	newList._setupPromiseList();
	return newList;
};
oFF.XPromiseList.createFromList = function(otherList)
{
	let newList = new oFF.XPromiseList();
	newList._setupPromiseList();
	newList.m_promiseList.addAll(otherList);
	return newList;
};
oFF.XPromiseList.toPromiseList = function()
{
	return oFF.XStreamCollectorImpl.create(() => {
		let list = oFF.XPromiseList.create();
		return list;
	}, (result, nextValue) => {
		result.add(nextValue);
		return result;
	});
};
oFF.XPromiseList.prototype.m_promiseList = null;
oFF.XPromiseList.prototype._setupPromiseList = function()
{
	this.m_promiseList = oFF.XList.create();
};
oFF.XPromiseList.prototype.add = function(element)
{
	this.m_promiseList.add(element);
};
oFF.XPromiseList.prototype.addAll = function(other)
{
	this.m_promiseList.addAll(other);
};
oFF.XPromiseList.prototype.clear = function()
{
	this.m_promiseList.clear();
};
oFF.XPromiseList.prototype.contains = function(element)
{
	return this.m_promiseList.contains(element);
};
oFF.XPromiseList.prototype.createArrayCopy = function()
{
	return this.m_promiseList.createArrayCopy();
};
oFF.XPromiseList.prototype.createListCopy = function()
{
	return this.m_promiseList.createListCopy();
};
oFF.XPromiseList.prototype.get = function(index)
{
	return this.m_promiseList.get(index);
};
oFF.XPromiseList.prototype.getIndex = function(element)
{
	return this.m_promiseList.getIndex(element);
};
oFF.XPromiseList.prototype.getIterator = function()
{
	return this.m_promiseList.getIterator();
};
oFF.XPromiseList.prototype.getValuesAsReadOnlyList = function()
{
	return this.m_promiseList.getValuesAsReadOnlyList();
};
oFF.XPromiseList.prototype.hasElements = function()
{
	return this.m_promiseList.hasElements();
};
oFF.XPromiseList.prototype.insert = function(index, element)
{
	this.m_promiseList.insert(index, element);
};
oFF.XPromiseList.prototype.isEmpty = function()
{
	return this.m_promiseList.isEmpty();
};
oFF.XPromiseList.prototype.moveElement = function(fromIndex, toIndex)
{
	this.m_promiseList.moveElement(fromIndex, toIndex);
};
oFF.XPromiseList.prototype.releaseObject = function()
{
	this.m_promiseList = oFF.XObjectExt.release(this.m_promiseList);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.XPromiseList.prototype.removeAt = function(index)
{
	return this.m_promiseList.removeAt(index);
};
oFF.XPromiseList.prototype.removeElement = function(element)
{
	return this.m_promiseList.removeElement(element);
};
oFF.XPromiseList.prototype.set = function(index, element)
{
	this.m_promiseList.set(index, element);
};
oFF.XPromiseList.prototype.size = function()
{
	return this.m_promiseList.size();
};
oFF.XPromiseList.prototype.sortByComparator = function(comparator)
{
	this.m_promiseList.sortByComparator(comparator);
};
oFF.XPromiseList.prototype.sortByDirection = function(sortDirection)
{
	this.m_promiseList.sortByDirection(sortDirection);
};
oFF.XPromiseList.prototype.sublist = function(beginIndex, endIndex)
{
	return this.m_promiseList.sublist(beginIndex, endIndex);
};

oFF.CommonsModule = function() {};
oFF.CommonsModule.prototype = new oFF.DfModule();
oFF.CommonsModule.prototype._ff_c = "CommonsModule";

oFF.CommonsModule.s_module = null;
oFF.CommonsModule.getInstance = function()
{
	if (oFF.isNull(oFF.CommonsModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.CoreExtModule.getInstance());
		oFF.CommonsModule.s_module = oFF.DfModule.startExt(new oFF.CommonsModule());
		oFF.XEncoderResultType.staticSetup();
		oFF.XEncoderType.staticSetup();
		oFF.XComponentType.staticSetupComponentType();
		oFF.XLogBufferNull.staticSetup();
		oFF.ExtendedInfoType.staticSetup();
		oFF.DateTimeFormat.staticSetup();
		oFF.DateTimeGranularityType.staticSetup();
		oFF.DateRangeGranularity.staticSetup();
		oFF.XCalendarType.staticSetup();
		oFF.XValueFormat.staticSetup();
		oFF.CurrencyPresentation.staticSetup();
		oFF.ScaleFormat.staticSetup();
		oFF.ScaleAndUnitPlacement.staticSetup();
		oFF.SignPresentation.staticSetup();
		oFF.TraceType.staticSetup();
		oFF.TriStateBool.staticSetup();
		oFF.XAccessModifier.staticSetup();
		oFF.SyncType.staticSetup();
		oFF.XErrorType.staticSetup();
		oFF.XPromiseState.staticSetup();
		oFF.DfModule.stopExt(oFF.CommonsModule.s_module);
	}
	return oFF.CommonsModule.s_module;
};
oFF.CommonsModule.prototype.getName = function()
{
	return "ff0040.commons";
};

oFF.CommonsModule.getInstance();

return oFF;
} );