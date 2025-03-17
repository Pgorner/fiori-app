/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff2240.ui.program"
],
function(oFF)
{
"use strict";

oFF.UiCompositeRemoteFactory = function() {};
oFF.UiCompositeRemoteFactory.prototype = new oFF.XObject();
oFF.UiCompositeRemoteFactory.prototype._ff_c = "UiCompositeRemoteFactory";

oFF.UiCompositeRemoteFactory.prototype.newInstance = function()
{
	return oFF.UiCompositeRemote.create();
};

oFF.UiServerEvent = function() {};
oFF.UiServerEvent.prototype = new oFF.XObject();
oFF.UiServerEvent.prototype._ff_c = "UiServerEvent";

oFF.UiServerEvent.s_evMap = null;
oFF.UiServerEvent.lookup = function(name)
{
	return oFF.UiServerEvent.s_evMap.getByKey(name);
};
oFF.UiServerEvent.staticSetup = function()
{
	oFF.UiServerEvent.s_evMap = oFF.XSetOfNameObject.create();
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnTransferStart());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnTransferEnd());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnSitAndWait());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnChangedValue());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnPropertySync());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnAssociationSync());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnSelect());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnSelectionChange());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnCollapse());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnExpand());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnDoubleClick());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnClick());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnContextMenu());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnClose());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnOpen());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnBeforeClose());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnBeforeOpen());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnAfterClose());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnAfterOpen());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnChange());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnEnter());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnLiveChange());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnDelete());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnDetailPress());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnPress());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnEditingBegin());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnEditingEnd());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnBack());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnRefresh());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnLoadFinished());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnMove());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnMoveStart());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnMoveEnd());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnResize());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnSuggestionSelect());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnScroll());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnScrollLoad());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnHover());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnHoverEnd());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnPaste());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnSelectionFinish());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnSearch());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnButtonPress());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnError());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnReadLineFinished());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnExecute());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnTerminate());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnFileDrop());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnDrop());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnDragEnter());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnDragOver());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnItemClose());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnItemSelect());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnTableDragAndDrop());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnMenuPress());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnValueHelpRequest());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnColumnResize());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnRowResize());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnItemPress());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnDragStart());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnDragEnd());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnEscape());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnKeyDown());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnKeyUp());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnItemDelete());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnDeselect());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnAfterRender());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnCursorChange());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnChipUpdate());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnBeforePageChanged());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnPageChanged());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnToggle());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnColorSelect());
};
oFF.UiServerEvent.prototype._deserializeEventInternal = function(eventBase, operation, uiAppContainer)
{
	if (oFF.notNull(eventBase) && oFF.notNull(operation))
	{
		if (operation.size() > oFF.SphereServer.PARAM_OFFSET)
		{
			eventBase.deserialize(operation.getStringAt(oFF.SphereServer.PARAM_OFFSET));
			if (oFF.notNull(uiAppContainer))
			{
				eventBase.deserializeUiObjects(uiAppContainer.getUiManager());
			}
		}
	}
	else
	{
		throw oFF.XException.createRuntimeException("Event deserialize failed! Missing required information. Check remote server events!");
	}
};
oFF.UiServerEvent.prototype.createControlChangeEvent = function(uiContext, uiAppContainer, operation)
{
	if (oFF.notNull(uiAppContainer) && oFF.notNull(uiContext))
	{
		let controlChangeEvent = oFF.UiControlChangeEvent.create(uiContext);
		this._deserializeEventInternal(controlChangeEvent, operation, uiAppContainer);
		return controlChangeEvent;
	}
	throw oFF.XException.createRuntimeException("Event handling failed! Missing uiContext or uiAppContainer. Check remote server events!");
};
oFF.UiServerEvent.prototype.createControlEvent = function(uiContext, uiAppContainer, operation)
{
	if (oFF.notNull(uiAppContainer) && oFF.notNull(uiContext))
	{
		let controlEvent = oFF.UiControlEvent.create(uiContext);
		this._deserializeEventInternal(controlEvent, operation, uiAppContainer);
		return controlEvent;
	}
	throw oFF.XException.createRuntimeException("Event handling failed! Missing uiContext or uiAppContainer. Check remote server events!");
};
oFF.UiServerEvent.prototype.createControlUpdateEvent = function(uiContext, uiAppContainer, operation)
{
	if (oFF.notNull(uiAppContainer) && oFF.notNull(uiContext))
	{
		let controlUpdateEvent = oFF.UiControlUpdateEvent.create(uiContext);
		this._deserializeEventInternal(controlUpdateEvent, operation, uiAppContainer);
		return controlUpdateEvent;
	}
	throw oFF.XException.createRuntimeException("Event handling failed! Missing uiContext or uiAppContainer. Check remote server events!");
};
oFF.UiServerEvent.prototype.createDragEventWithParams = function(uiContext, uiAppContainer, operation)
{
	if (oFF.notNull(uiAppContainer) && oFF.notNull(uiContext))
	{
		let dragEvent = oFF.UiDragEvent.create(uiContext);
		this._deserializeEventInternal(dragEvent, operation, uiAppContainer);
		return dragEvent;
	}
	throw oFF.XException.createRuntimeException("Event handling failed! Missing uiContext or uiAppContainer. Check remote server events!");
};
oFF.UiServerEvent.prototype.createDropEventWithParams = function(uiContext, uiAppContainer, operation)
{
	if (oFF.notNull(uiAppContainer) && oFF.notNull(uiContext))
	{
		let dropEvent = oFF.UiDropEvent.create(uiContext);
		this._deserializeEventInternal(dropEvent, operation, uiAppContainer);
		return dropEvent;
	}
	throw oFF.XException.createRuntimeException("Event handling failed! Missing uiContext or uiAppContainer. Check remote server events!");
};
oFF.UiServerEvent.prototype.createFileEvent = function(uiContext, uiAppContainer, operation)
{
	if (oFF.notNull(uiAppContainer) && oFF.notNull(uiContext))
	{
		let fileEvent = oFF.UiFileEvent.create(uiContext);
		this._deserializeEventInternal(fileEvent, operation, uiAppContainer);
		return fileEvent;
	}
	throw oFF.XException.createRuntimeException("Event handling failed! Missing uiContext or uiAppContainer. Check remote server events!");
};
oFF.UiServerEvent.prototype.createItemEventWithParams = function(uiContext, uiAppContainer, operation)
{
	if (oFF.notNull(uiAppContainer) && oFF.notNull(uiContext))
	{
		let itemEvent = oFF.UiItemEvent.create(uiContext);
		this._deserializeEventInternal(itemEvent, operation, uiAppContainer);
		return itemEvent;
	}
	throw oFF.XException.createRuntimeException("Event handling failed! Missing uiContext or uiAppContainer. Check remote server events!");
};
oFF.UiServerEvent.prototype.createKeyboardEvent = function(uiContext, uiAppContainer, operation)
{
	if (oFF.notNull(uiAppContainer) && oFF.notNull(uiContext))
	{
		let keyboardEvent = oFF.UiKeyboardEvent.create(uiContext);
		this._deserializeEventInternal(keyboardEvent, operation, uiAppContainer);
		return keyboardEvent;
	}
	throw oFF.XException.createRuntimeException("Event handling failed! Missing uiContext or uiAppContainer. Check remote server events!");
};
oFF.UiServerEvent.prototype.createMoveEvent = function(uiContext, uiAppContainer, operation)
{
	if (oFF.notNull(uiAppContainer) && oFF.notNull(uiContext))
	{
		let moveEvent = oFF.UiMoveEvent.create(uiContext);
		this._deserializeEventInternal(moveEvent, operation, uiAppContainer);
		return moveEvent;
	}
	throw oFF.XException.createRuntimeException("Event handling failed! Missing uiContext or uiAppContainer. Check remote server events!");
};
oFF.UiServerEvent.prototype.createResizeEvent = function(uiContext, uiAppContainer, operation)
{
	if (oFF.notNull(uiAppContainer) && oFF.notNull(uiContext))
	{
		let resizeEvent = oFF.UiResizeEvent.create(uiContext);
		this._deserializeEventInternal(resizeEvent, operation, uiAppContainer);
		return resizeEvent;
	}
	throw oFF.XException.createRuntimeException("Event handling failed! Missing uiContext or uiAppContainer. Check remote server events!");
};
oFF.UiServerEvent.prototype.createSelectionEvent = function(uiContext, uiAppContainer, operation)
{
	if (oFF.notNull(uiAppContainer) && oFF.notNull(uiContext))
	{
		let selectionEvent = oFF.UiSelectionEvent.create(uiContext);
		this._deserializeEventInternal(selectionEvent, operation, uiAppContainer);
		return selectionEvent;
	}
	throw oFF.XException.createRuntimeException("Event handling failed! Missing uiContext or uiAppContainer. Check remote server events!");
};
oFF.UiServerEvent.prototype.executeOperation = oFF.noSupport;
oFF.UiServerEvent.prototype.getEventDef = oFF.noSupport;
oFF.UiServerEvent.prototype.getName = function()
{
	let tmpEvent = this.getEventDef();
	if (oFF.notNull(tmpEvent))
	{
		return tmpEvent.getRemoteName();
	}
	throw oFF.XException.createRuntimeException("Missing event defintion for UiServerEvent. Check remote server events!");
};
oFF.UiServerEvent.prototype.isControlContext = function()
{
	return true;
};

oFF.DfUiServerOperationsContext = function() {};
oFF.DfUiServerOperationsContext.prototype = new oFF.XObject();
oFF.DfUiServerOperationsContext.prototype._ff_c = "DfUiServerOperationsContext";

oFF.DfUiServerOperationsContext.prototype.m_asyncActionMap = null;
oFF.DfUiServerOperationsContext.prototype.m_operations = null;
oFF.DfUiServerOperationsContext.prototype._addAsyncOperation = function(action)
{
	this.m_asyncActionMap.put(action.getUuid(), action);
	let operation = this._addOperation(action.getName());
	operation.addString(action.getUuid());
	return operation;
};
oFF.DfUiServerOperationsContext.prototype._addOperation = function(operationName)
{
	let newOp = this.m_operations.addNewList();
	newOp.addString(operationName);
	newOp.addNull();
	newOp.addNull();
	return newOp;
};
oFF.DfUiServerOperationsContext.prototype._setupOperationsContext = function()
{
	this.m_operations = oFF.PrFactory.createList();
	this.m_asyncActionMap = oFF.XHashMapByString.create();
};
oFF.DfUiServerOperationsContext.prototype.executeAsyncAction = function(actionUuid, actionState, actionResult)
{
	let didExecute = false;
	let remoteAsyncAction = this.m_asyncActionMap.getByKey(actionUuid);
	if (oFF.notNull(remoteAsyncAction))
	{
		remoteAsyncAction.processResult(actionState, actionResult);
		this.m_asyncActionMap.remove(actionResult);
		oFF.XObjectExt.release(remoteAsyncAction);
		didExecute = true;
	}
	return didExecute;
};
oFF.DfUiServerOperationsContext.prototype.fetchOprationSequence = function()
{
	let currentOperationSequence = this.m_operations;
	this.m_operations = oFF.PrFactory.createList();
	return currentOperationSequence;
};
oFF.DfUiServerOperationsContext.prototype.releaseObject = function()
{
	this.m_operations = oFF.XObjectExt.release(this.m_operations);
	this.m_asyncActionMap = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_asyncActionMap);
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.DfUiRemoteAsyncAction = function() {};
oFF.DfUiRemoteAsyncAction.prototype = new oFF.XObject();
oFF.DfUiRemoteAsyncAction.prototype._ff_c = "DfUiRemoteAsyncAction";

oFF.DfUiRemoteAsyncAction.prototype.m_name = null;
oFF.DfUiRemoteAsyncAction.prototype.m_promise = null;
oFF.DfUiRemoteAsyncAction.prototype.m_promiseReject = null;
oFF.DfUiRemoteAsyncAction.prototype.m_promiseResolve = null;
oFF.DfUiRemoteAsyncAction.prototype.m_promiseTimeoutId = null;
oFF.DfUiRemoteAsyncAction.prototype.m_uuid = null;
oFF.DfUiRemoteAsyncAction.prototype._setupAction = function(name)
{
	this.m_name = name;
	this.m_uuid = oFF.XGuid.getGuid();
	this.m_promise = oFF.XPromise.create((resolve, reject) => {
		this.m_promiseResolve = resolve;
		this.m_promiseReject = reject;
		this.m_promiseTimeoutId = oFF.XTimeout.timeout(20000, () => {
			this.processResult(oFF.UiRemoteAsyncActionState.REJECTED, "Remote async action timed out!");
		});
	});
};
oFF.DfUiRemoteAsyncAction.prototype.getName = function()
{
	return this.m_name;
};
oFF.DfUiRemoteAsyncAction.prototype.getPromise = function()
{
	return this.m_promise;
};
oFF.DfUiRemoteAsyncAction.prototype.getUuid = function()
{
	return this.m_uuid;
};
oFF.DfUiRemoteAsyncAction.prototype.processResult = function(actionState, actionResult)
{
	if (this.m_promise.getState() === oFF.XPromiseState.PENDING)
	{
		if (actionState === oFF.UiRemoteAsyncActionState.FULFILLED)
		{
			if (oFF.notNull(this.m_promiseResolve))
			{
				this.m_promiseResolve(this.convertStringResult(actionResult));
				this.m_promiseResolve = null;
			}
		}
		else if (actionState === oFF.UiRemoteAsyncActionState.REJECTED)
		{
			if (oFF.notNull(this.m_promiseReject))
			{
				this.m_promiseReject(oFF.XError.create(actionResult));
				this.m_promiseReject = null;
			}
		}
		else
		{
			throw oFF.XException.createException("Missing async action state!");
		}
		oFF.XTimeout.clear(this.m_promiseTimeoutId);
		this.m_promiseTimeoutId = null;
	}
};
oFF.DfUiRemoteAsyncAction.prototype.releaseObject = function()
{
	oFF.XTimeout.clear(this.m_promiseTimeoutId);
	this.m_promiseTimeoutId = null;
	if (oFF.notNull(this.m_promise) && this.m_promise.getState() === oFF.XPromiseState.PENDING)
	{
		this.m_promiseReject(oFF.XError.create("Unresolved async action promise was released!"));
	}
	this.m_promiseResolve = null;
	this.m_promiseReject = null;
	this.m_promise = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiServerEvOnAfterClose = function() {};
oFF.UiServerEvOnAfterClose.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnAfterClose.prototype._ff_c = "UiServerEvOnAfterClose";

oFF.UiServerEvOnAfterClose.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onAfterClose(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnAfterClose.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_AFTER_CLOSE;
};

oFF.UiServerEvOnAfterOpen = function() {};
oFF.UiServerEvOnAfterOpen.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnAfterOpen.prototype._ff_c = "UiServerEvOnAfterOpen";

oFF.UiServerEvOnAfterOpen.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onAfterOpen(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnAfterOpen.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_AFTER_OPEN;
};

oFF.UiServerEvOnAfterRender = function() {};
oFF.UiServerEvOnAfterRender.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnAfterRender.prototype._ff_c = "UiServerEvOnAfterRender";

oFF.UiServerEvOnAfterRender.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onAfterRender(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnAfterRender.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_AFTER_RENDER;
};

oFF.UiServerEvOnBack = function() {};
oFF.UiServerEvOnBack.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnBack.prototype._ff_c = "UiServerEvOnBack";

oFF.UiServerEvOnBack.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onBack(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnBack.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_BACK;
};

oFF.UiServerEvOnBeforeClose = function() {};
oFF.UiServerEvOnBeforeClose.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnBeforeClose.prototype._ff_c = "UiServerEvOnBeforeClose";

oFF.UiServerEvOnBeforeClose.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onBeforeClose(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnBeforeClose.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_BEFORE_CLOSE;
};

oFF.UiServerEvOnBeforeOpen = function() {};
oFF.UiServerEvOnBeforeOpen.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnBeforeOpen.prototype._ff_c = "UiServerEvOnBeforeOpen";

oFF.UiServerEvOnBeforeOpen.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onBeforeOpen(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnBeforeOpen.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_BEFORE_OPEN;
};

oFF.UiServerEvOnBeforePageChanged = function() {};
oFF.UiServerEvOnBeforePageChanged.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnBeforePageChanged.prototype._ff_c = "UiServerEvOnBeforePageChanged";

oFF.UiServerEvOnBeforePageChanged.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onBeforePageChanged(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnBeforePageChanged.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_BEFORE_PAGE_CHANGED;
};

oFF.UiServerEvOnButtonPress = function() {};
oFF.UiServerEvOnButtonPress.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnButtonPress.prototype._ff_c = "UiServerEvOnButtonPress";

oFF.UiServerEvOnButtonPress.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onButtonPress(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnButtonPress.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_BUTTON_PRESS;
};

oFF.UiServerEvOnChange = function() {};
oFF.UiServerEvOnChange.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnChange.prototype._ff_c = "UiServerEvOnChange";

oFF.UiServerEvOnChange.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onChange(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnChange.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_CHANGE;
};

oFF.UiServerEvOnChipUpdate = function() {};
oFF.UiServerEvOnChipUpdate.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnChipUpdate.prototype._ff_c = "UiServerEvOnChipUpdate";

oFF.UiServerEvOnChipUpdate.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlUpdateEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onChipUpdate(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnChipUpdate.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_CHIP_UPDATE;
};

oFF.UiServerEvOnClick = function() {};
oFF.UiServerEvOnClick.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnClick.prototype._ff_c = "UiServerEvOnClick";

oFF.UiServerEvOnClick.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onClick(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnClick.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_CLICK;
};

oFF.UiServerEvOnClose = function() {};
oFF.UiServerEvOnClose.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnClose.prototype._ff_c = "UiServerEvOnClose";

oFF.UiServerEvOnClose.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onClose(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnClose.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_CLOSE;
};

oFF.UiServerEvOnCollapse = function() {};
oFF.UiServerEvOnCollapse.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnCollapse.prototype._ff_c = "UiServerEvOnCollapse";

oFF.UiServerEvOnCollapse.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createItemEventWithParams(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onCollapse(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnCollapse.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_COLLAPSE;
};

oFF.UiServerEvOnColorSelect = function() {};
oFF.UiServerEvOnColorSelect.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnColorSelect.prototype._ff_c = "UiServerEvOnColorSelect";

oFF.UiServerEvOnColorSelect.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onColorSelect(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnColorSelect.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_COLOR_SELECT;
};

oFF.UiServerEvOnColumnResize = function() {};
oFF.UiServerEvOnColumnResize.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnColumnResize.prototype._ff_c = "UiServerEvOnColumnResize";

oFF.UiServerEvOnColumnResize.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onColumnResize(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnColumnResize.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_COLUMN_RESIZE;
};

oFF.UiServerEvOnContextMenu = function() {};
oFF.UiServerEvOnContextMenu.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnContextMenu.prototype._ff_c = "UiServerEvOnContextMenu";

oFF.UiServerEvOnContextMenu.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onContextMenu(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnContextMenu.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_CONTEXT_MENU;
};

oFF.UiServerEvOnCursorChange = function() {};
oFF.UiServerEvOnCursorChange.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnCursorChange.prototype._ff_c = "UiServerEvOnCursorChange";

oFF.UiServerEvOnCursorChange.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onCursorChange(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnCursorChange.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_CURSOR_CHANGE;
};

oFF.UiServerEvOnDelete = function() {};
oFF.UiServerEvOnDelete.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnDelete.prototype._ff_c = "UiServerEvOnDelete";

oFF.UiServerEvOnDelete.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createItemEventWithParams(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onDelete(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnDelete.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_DELETE;
};

oFF.UiServerEvOnDeselect = function() {};
oFF.UiServerEvOnDeselect.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnDeselect.prototype._ff_c = "UiServerEvOnDeselect";

oFF.UiServerEvOnDeselect.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onDeselect(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnDeselect.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_DESELECT;
};

oFF.UiServerEvOnDetailPress = function() {};
oFF.UiServerEvOnDetailPress.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnDetailPress.prototype._ff_c = "UiServerEvOnDetailPress";

oFF.UiServerEvOnDetailPress.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onDetailPress(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnDetailPress.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_DETAIL_PRESS;
};

oFF.UiServerEvOnDoubleClick = function() {};
oFF.UiServerEvOnDoubleClick.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnDoubleClick.prototype._ff_c = "UiServerEvOnDoubleClick";

oFF.UiServerEvOnDoubleClick.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onDoubleClick(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnDoubleClick.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_DOUBLE_CLICK;
};

oFF.UiServerEvOnDragEnd = function() {};
oFF.UiServerEvOnDragEnd.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnDragEnd.prototype._ff_c = "UiServerEvOnDragEnd";

oFF.UiServerEvOnDragEnd.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onDragEnd(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnDragEnd.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_DRAG_END;
};

oFF.UiServerEvOnDragEnter = function() {};
oFF.UiServerEvOnDragEnter.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnDragEnter.prototype._ff_c = "UiServerEvOnDragEnter";

oFF.UiServerEvOnDragEnter.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createDragEventWithParams(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onDragEnter(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnDragEnter.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_DRAG_ENTER;
};

oFF.UiServerEvOnDragOver = function() {};
oFF.UiServerEvOnDragOver.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnDragOver.prototype._ff_c = "UiServerEvOnDragOver";

oFF.UiServerEvOnDragOver.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createDragEventWithParams(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onDragOver(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnDragOver.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_DRAG_OVER;
};

oFF.UiServerEvOnDragStart = function() {};
oFF.UiServerEvOnDragStart.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnDragStart.prototype._ff_c = "UiServerEvOnDragStart";

oFF.UiServerEvOnDragStart.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onDragStart(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnDragStart.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_DRAG_START;
};

oFF.UiServerEvOnDrop = function() {};
oFF.UiServerEvOnDrop.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnDrop.prototype._ff_c = "UiServerEvOnDrop";

oFF.UiServerEvOnDrop.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createDropEventWithParams(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onDrop(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnDrop.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_DROP;
};

oFF.UiServerEvOnEditingBegin = function() {};
oFF.UiServerEvOnEditingBegin.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnEditingBegin.prototype._ff_c = "UiServerEvOnEditingBegin";

oFF.UiServerEvOnEditingBegin.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onEditingBegin(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnEditingBegin.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_EDITING_BEGIN;
};

oFF.UiServerEvOnEditingEnd = function() {};
oFF.UiServerEvOnEditingEnd.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnEditingEnd.prototype._ff_c = "UiServerEvOnEditingEnd";

oFF.UiServerEvOnEditingEnd.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onEditingEnd(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnEditingEnd.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_EDITING_END;
};

oFF.UiServerEvOnEnter = function() {};
oFF.UiServerEvOnEnter.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnEnter.prototype._ff_c = "UiServerEvOnEnter";

oFF.UiServerEvOnEnter.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onEnter(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnEnter.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_ENTER;
};

oFF.UiServerEvOnError = function() {};
oFF.UiServerEvOnError.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnError.prototype._ff_c = "UiServerEvOnError";

oFF.UiServerEvOnError.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onError(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnError.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_ERROR;
};

oFF.UiServerEvOnEscape = function() {};
oFF.UiServerEvOnEscape.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnEscape.prototype._ff_c = "UiServerEvOnEscape";

oFF.UiServerEvOnEscape.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onEscape(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnEscape.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_ESCAPE;
};

oFF.UiServerEvOnExecute = function() {};
oFF.UiServerEvOnExecute.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnExecute.prototype._ff_c = "UiServerEvOnExecute";

oFF.UiServerEvOnExecute.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onExecute(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnExecute.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_EXECUTE;
};

oFF.UiServerEvOnExpand = function() {};
oFF.UiServerEvOnExpand.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnExpand.prototype._ff_c = "UiServerEvOnExpand";

oFF.UiServerEvOnExpand.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createItemEventWithParams(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onExpand(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnExpand.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_EXPAND;
};

oFF.UiServerEvOnFileDrop = function() {};
oFF.UiServerEvOnFileDrop.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnFileDrop.prototype._ff_c = "UiServerEvOnFileDrop";

oFF.UiServerEvOnFileDrop.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createFileEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onFileDrop(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnFileDrop.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_FILE_DROP;
};

oFF.UiServerEvOnHover = function() {};
oFF.UiServerEvOnHover.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnHover.prototype._ff_c = "UiServerEvOnHover";

oFF.UiServerEvOnHover.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onHover(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnHover.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_HOVER;
};

oFF.UiServerEvOnHoverEnd = function() {};
oFF.UiServerEvOnHoverEnd.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnHoverEnd.prototype._ff_c = "UiServerEvOnHoverEnd";

oFF.UiServerEvOnHoverEnd.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onHoverEnd(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnHoverEnd.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_HOVER_END;
};

oFF.UiServerEvOnItemClose = function() {};
oFF.UiServerEvOnItemClose.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnItemClose.prototype._ff_c = "UiServerEvOnItemClose";

oFF.UiServerEvOnItemClose.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createItemEventWithParams(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onItemClose(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnItemClose.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_ITEM_CLOSE;
};

oFF.UiServerEvOnItemDelete = function() {};
oFF.UiServerEvOnItemDelete.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnItemDelete.prototype._ff_c = "UiServerEvOnItemDelete";

oFF.UiServerEvOnItemDelete.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createItemEventWithParams(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onItemDelete(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnItemDelete.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_ITEM_DELETE;
};

oFF.UiServerEvOnItemPress = function() {};
oFF.UiServerEvOnItemPress.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnItemPress.prototype._ff_c = "UiServerEvOnItemPress";

oFF.UiServerEvOnItemPress.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createItemEventWithParams(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onItemPress(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnItemPress.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_ITEM_PRESS;
};

oFF.UiServerEvOnItemSelect = function() {};
oFF.UiServerEvOnItemSelect.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnItemSelect.prototype._ff_c = "UiServerEvOnItemSelect";

oFF.UiServerEvOnItemSelect.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createItemEventWithParams(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onItemSelect(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnItemSelect.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_ITEM_SELECT;
};

oFF.UiServerEvOnKeyDown = function() {};
oFF.UiServerEvOnKeyDown.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnKeyDown.prototype._ff_c = "UiServerEvOnKeyDown";

oFF.UiServerEvOnKeyDown.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createKeyboardEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onKeyDown(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnKeyDown.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_KEY_DOWN;
};

oFF.UiServerEvOnKeyUp = function() {};
oFF.UiServerEvOnKeyUp.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnKeyUp.prototype._ff_c = "UiServerEvOnKeyUp";

oFF.UiServerEvOnKeyUp.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createKeyboardEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onKeyUp(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnKeyUp.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_KEY_UP;
};

oFF.UiServerEvOnLiveChange = function() {};
oFF.UiServerEvOnLiveChange.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnLiveChange.prototype._ff_c = "UiServerEvOnLiveChange";

oFF.UiServerEvOnLiveChange.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onLiveChange(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnLiveChange.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_LIVE_CHANGE;
};

oFF.UiServerEvOnLoadFinished = function() {};
oFF.UiServerEvOnLoadFinished.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnLoadFinished.prototype._ff_c = "UiServerEvOnLoadFinished";

oFF.UiServerEvOnLoadFinished.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onLoadFinished(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnLoadFinished.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_LOAD_FINISHED;
};

oFF.UiServerEvOnMenuPress = function() {};
oFF.UiServerEvOnMenuPress.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnMenuPress.prototype._ff_c = "UiServerEvOnMenuPress";

oFF.UiServerEvOnMenuPress.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onMenuPress(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnMenuPress.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_MENU_PRESS;
};

oFF.UiServerEvOnMove = function() {};
oFF.UiServerEvOnMove.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnMove.prototype._ff_c = "UiServerEvOnMove";

oFF.UiServerEvOnMove.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createMoveEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onMove(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnMove.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_MOVE;
};

oFF.UiServerEvOnMoveEnd = function() {};
oFF.UiServerEvOnMoveEnd.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnMoveEnd.prototype._ff_c = "UiServerEvOnMoveEnd";

oFF.UiServerEvOnMoveEnd.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createMoveEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onMoveEnd(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnMoveEnd.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_MOVE_END;
};

oFF.UiServerEvOnMoveStart = function() {};
oFF.UiServerEvOnMoveStart.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnMoveStart.prototype._ff_c = "UiServerEvOnMoveStart";

oFF.UiServerEvOnMoveStart.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createMoveEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onMoveStart(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnMoveStart.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_MOVE_START;
};

oFF.UiServerEvOnOpen = function() {};
oFF.UiServerEvOnOpen.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnOpen.prototype._ff_c = "UiServerEvOnOpen";

oFF.UiServerEvOnOpen.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onOpen(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnOpen.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_OPEN;
};

oFF.UiServerEvOnPageChanged = function() {};
oFF.UiServerEvOnPageChanged.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnPageChanged.prototype._ff_c = "UiServerEvOnPageChanged";

oFF.UiServerEvOnPageChanged.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlChangeEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onPageChanged(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnPageChanged.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_PAGE_CHANGED;
};

oFF.UiServerEvOnPaste = function() {};
oFF.UiServerEvOnPaste.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnPaste.prototype._ff_c = "UiServerEvOnPaste";

oFF.UiServerEvOnPaste.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onPaste(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnPaste.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_PASTE;
};

oFF.UiServerEvOnPress = function() {};
oFF.UiServerEvOnPress.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnPress.prototype._ff_c = "UiServerEvOnPress";

oFF.UiServerEvOnPress.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onPress(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnPress.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_PRESS;
};

oFF.UiServerEvOnReadLineFinished = function() {};
oFF.UiServerEvOnReadLineFinished.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnReadLineFinished.prototype._ff_c = "UiServerEvOnReadLineFinished";

oFF.UiServerEvOnReadLineFinished.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onReadLineFinished(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnReadLineFinished.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_READ_LINE_FINISHED;
};

oFF.UiServerEvOnRefresh = function() {};
oFF.UiServerEvOnRefresh.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnRefresh.prototype._ff_c = "UiServerEvOnRefresh";

oFF.UiServerEvOnRefresh.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onRefresh(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnRefresh.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_REFRESH;
};

oFF.UiServerEvOnResize = function() {};
oFF.UiServerEvOnResize.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnResize.prototype._ff_c = "UiServerEvOnResize";

oFF.UiServerEvOnResize.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createResizeEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onResize(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnResize.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_RESIZE;
};

oFF.UiServerEvOnRowResize = function() {};
oFF.UiServerEvOnRowResize.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnRowResize.prototype._ff_c = "UiServerEvOnRowResize";

oFF.UiServerEvOnRowResize.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onRowResize(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnRowResize.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_ROW_RESIZE;
};

oFF.UiServerEvOnScroll = function() {};
oFF.UiServerEvOnScroll.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnScroll.prototype._ff_c = "UiServerEvOnScroll";

oFF.UiServerEvOnScroll.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onScroll(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnScroll.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_SCROLL;
};

oFF.UiServerEvOnScrollLoad = function() {};
oFF.UiServerEvOnScrollLoad.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnScrollLoad.prototype._ff_c = "UiServerEvOnScrollLoad";

oFF.UiServerEvOnScrollLoad.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onScrollLoad(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnScrollLoad.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_SCROLL_LOAD;
};

oFF.UiServerEvOnSearch = function() {};
oFF.UiServerEvOnSearch.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnSearch.prototype._ff_c = "UiServerEvOnSearch";

oFF.UiServerEvOnSearch.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onSearch(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnSearch.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_SEARCH;
};

oFF.UiServerEvOnSelect = function() {};
oFF.UiServerEvOnSelect.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnSelect.prototype._ff_c = "UiServerEvOnSelect";

oFF.UiServerEvOnSelect.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createSelectionEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onSelect(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnSelect.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_SELECT;
};

oFF.UiServerEvOnSelectionChange = function() {};
oFF.UiServerEvOnSelectionChange.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnSelectionChange.prototype._ff_c = "UiServerEvOnSelectionChange";

oFF.UiServerEvOnSelectionChange.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createSelectionEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onSelectionChange(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnSelectionChange.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_SELECTION_CHANGE;
};

oFF.UiServerEvOnSelectionFinish = function() {};
oFF.UiServerEvOnSelectionFinish.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnSelectionFinish.prototype._ff_c = "UiServerEvOnSelectionFinish";

oFF.UiServerEvOnSelectionFinish.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createSelectionEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onSelectionFinish(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnSelectionFinish.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_SELECTION_FINISH;
};

oFF.UiServerEvOnSuggestionSelect = function() {};
oFF.UiServerEvOnSuggestionSelect.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnSuggestionSelect.prototype._ff_c = "UiServerEvOnSuggestionSelect";

oFF.UiServerEvOnSuggestionSelect.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createSelectionEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onSuggestionSelect(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnSuggestionSelect.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_SUGGESTION_SELECT;
};

oFF.UiServerEvOnTableDragAndDrop = function() {};
oFF.UiServerEvOnTableDragAndDrop.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnTableDragAndDrop.prototype._ff_c = "UiServerEvOnTableDragAndDrop";

oFF.UiServerEvOnTableDragAndDrop.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onTableDragAndDrop(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnTableDragAndDrop.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_TABLE_DRAG_AND_DROP;
};

oFF.UiServerEvOnTerminate = function() {};
oFF.UiServerEvOnTerminate.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnTerminate.prototype._ff_c = "UiServerEvOnTerminate";

oFF.UiServerEvOnTerminate.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onTerminate(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnTerminate.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_TERMINATE;
};

oFF.UiServerEvOnToggle = function() {};
oFF.UiServerEvOnToggle.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnToggle.prototype._ff_c = "UiServerEvOnToggle";

oFF.UiServerEvOnToggle.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createItemEventWithParams(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onToggle(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnToggle.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_TOGGLE;
};

oFF.UiServerEvOnValueHelpRequest = function() {};
oFF.UiServerEvOnValueHelpRequest.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnValueHelpRequest.prototype._ff_c = "UiServerEvOnValueHelpRequest";

oFF.UiServerEvOnValueHelpRequest.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let newEvent = this.createControlEvent(uiContext, uiAppContainer, operation);
	let tsControl = uiContext;
	tsControl.onValueHelpRequest(newEvent);
	return uiAppContainer;
};
oFF.UiServerEvOnValueHelpRequest.prototype.getEventDef = function()
{
	return oFF.UiEvent.ON_VALUE_HELP_REQUEST;
};

oFF.UiServerEvOnAssociationSync = function() {};
oFF.UiServerEvOnAssociationSync.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnAssociationSync.prototype._ff_c = "UiServerEvOnAssociationSync";

oFF.UiServerEvOnAssociationSync.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let associationOffset = oFF.SphereServer.PARAM_OFFSET;
	let newElementIdOffset = oFF.SphereServer.PARAM_OFFSET + 1;
	let associationName = operation.getStringAt(associationOffset);
	let newElementId = operation.getStringAt(newElementIdOffset);
	let associationDef = oFF.UiAssociation.lookup(associationName);
	if (oFF.notNull(uiContext) && oFF.notNull(associationDef))
	{
		let newElement = null;
		if (oFF.notNull(uiAppContainer))
		{
			newElement = uiAppContainer.getContext(newElementId);
		}
		else
		{
			throw oFF.XException.createRuntimeException("[Ui Remote] Could not find UiServerProgram! Cannot process association sync!");
		}
		uiContext.setAssociationElement(associationDef, newElement);
	}
	return uiAppContainer;
};
oFF.UiServerEvOnAssociationSync.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.EV_ON_ASSOCIATION_SYNC;
};

oFF.UiServerEvOnChangedValue = function() {};
oFF.UiServerEvOnChangedValue.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnChangedValue.prototype._ff_c = "UiServerEvOnChangedValue";

oFF.UiServerEvOnChangedValue.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let offset = oFF.SphereServer.PARAM_OFFSET;
	let methodName = operation.getStringAt(offset);
	offset++;
	let op = oFF.UiAllOperations.lookupOp(methodName);
	op.executeOperation(uiAppContainer, uiContext, operation, offset);
	return uiAppContainer;
};
oFF.UiServerEvOnChangedValue.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.EV_ON_CHANGED_VALUE;
};

oFF.UiServerEvOnPropertySync = function() {};
oFF.UiServerEvOnPropertySync.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnPropertySync.prototype._ff_c = "UiServerEvOnPropertySync";

oFF.UiServerEvOnPropertySync.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	let propOffset = oFF.SphereServer.PARAM_OFFSET;
	let valueOffset = oFF.SphereServer.PARAM_OFFSET + 1;
	let propName = operation.getStringAt(propOffset);
	let prop = oFF.UiProperty.lookup(propName);
	if (oFF.notNull(uiContext) && oFF.notNull(prop))
	{
		let tmpVal = null;
		if (operation.get(valueOffset) !== null)
		{
			if (oFF.UiSerializableObjectFactory.isSerializableObjectValueType(prop.getValueType()))
			{
				tmpVal = oFF.UiSerializableObjectFactory.parseToObject(operation.getStringAt(valueOffset), prop.getValueType());
			}
			else
			{
				let valType = operation.getElementTypeAt(valueOffset);
				if (valType === oFF.PrElementType.INTEGER)
				{
					tmpVal = oFF.XIntegerValue.create(operation.getIntegerAt(valueOffset));
				}
				else if (valType === oFF.PrElementType.BOOLEAN)
				{
					tmpVal = oFF.XBooleanValue.create(operation.getBooleanAt(valueOffset));
				}
				else if (valType === oFF.PrElementType.DOUBLE)
				{
					tmpVal = oFF.XDoubleValue.create(operation.getDoubleAt(valueOffset));
				}
				else if (valType === oFF.PrElementType.LONG)
				{
					tmpVal = oFF.XLongValue.create(operation.getLongAt(valueOffset));
				}
				else if (valType === oFF.PrElementType.STRING)
				{
					tmpVal = oFF.XStringValue.create(operation.getStringAt(valueOffset));
				}
				else
				{
					tmpVal = operation.get(valueOffset);
				}
			}
		}
		uiContext.updatePropertyValue(prop, tmpVal);
	}
	return uiAppContainer;
};
oFF.UiServerEvOnPropertySync.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.EV_ON_PROPERTY_SYNC;
};

oFF.UiServerEvOnSitAndWait = function() {};
oFF.UiServerEvOnSitAndWait.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnSitAndWait.prototype._ff_c = "UiServerEvOnSitAndWait";

oFF.UiServerEvOnSitAndWait.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	return uiAppContainer;
};
oFF.UiServerEvOnSitAndWait.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.EV_ON_SIT_AND_WAIT;
};
oFF.UiServerEvOnSitAndWait.prototype.isControlContext = function()
{
	return false;
};

oFF.UiServerEvOnTransferEnd = function() {};
oFF.UiServerEvOnTransferEnd.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnTransferEnd.prototype._ff_c = "UiServerEvOnTransferEnd";

oFF.UiServerEvOnTransferEnd.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	if (oFF.notNull(uiAppContainer))
	{
		let uiManager = uiAppContainer.getUiManager();
		if (oFF.notNull(uiManager))
		{
			uiManager.endValueTransfer();
		}
	}
	return uiAppContainer;
};
oFF.UiServerEvOnTransferEnd.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.EV_ON_TRANSFER_END;
};
oFF.UiServerEvOnTransferEnd.prototype.isControlContext = function()
{
	return false;
};

oFF.UiServerEvOnTransferStart = function() {};
oFF.UiServerEvOnTransferStart.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnTransferStart.prototype._ff_c = "UiServerEvOnTransferStart";

oFF.UiServerEvOnTransferStart.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	if (oFF.notNull(uiAppContainer))
	{
		let uiManager = uiAppContainer.getUiManager();
		if (oFF.notNull(uiManager))
		{
			uiManager.startValueTransfer();
		}
	}
	return uiAppContainer;
};
oFF.UiServerEvOnTransferStart.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.EV_ON_TRANSFER_START;
};
oFF.UiServerEvOnTransferStart.prototype.isControlContext = function()
{
	return false;
};

oFF.UiServerDevice = function() {};
oFF.UiServerDevice.prototype = new oFF.DfUiServerOperationsContext();
oFF.UiServerDevice.prototype._ff_c = "UiServerDevice";

oFF.UiServerDevice.create = function()
{
	let newIntance = new oFF.UiServerDevice();
	newIntance._setupOperationsContext();
	return newIntance;
};
oFF.UiServerDevice.prototype.getDeviceType = function()
{
	let stringAction = oFF.UiRemoteAsyncStringAction.create(oFF.UiRemoteProtocol.OP_UI_DEVICE_ASYNC_GET_DEVICE_TYPE);
	this._addAsyncOperation(stringAction);
	return stringAction.getPromise().onThenExt((devTypeStr) => {
		return oFF.UiDeviceType.lookup(devTypeStr);
	});
};
oFF.UiServerDevice.prototype.getScreenSize = function()
{
	let stringAction = oFF.UiRemoteAsyncStringAction.create(oFF.UiRemoteProtocol.OP_UI_DEVICE_ASYNC_GET_SCREEN_SIZE);
	this._addAsyncOperation(stringAction);
	return stringAction.getPromise().onThenExt((screenSizeStr) => {
		return oFF.UiSize.createByString(screenSizeStr);
	});
};
oFF.UiServerDevice.prototype.releaseObject = function()
{
	oFF.DfUiServerOperationsContext.prototype.releaseObject.call( this );
};

oFF.UiServerFramework = function() {};
oFF.UiServerFramework.prototype = new oFF.DfUiServerOperationsContext();
oFF.UiServerFramework.prototype._ff_c = "UiServerFramework";

oFF.UiServerFramework.create = function()
{
	let newIntance = new oFF.UiServerFramework();
	newIntance._setupOperationsContext();
	return newIntance;
};
oFF.UiServerFramework.prototype.announce = function(message, mode)
{
	let operation = this._addOperation(oFF.UiRemoteProtocol.OP_UI_FRAMEWORK_ANNOUNCE);
	operation.addString(message);
	if (oFF.notNull(mode))
	{
		operation.addString(mode.getName());
	}
	else
	{
		operation.addNull();
	}
};
oFF.UiServerFramework.prototype.calculateTextWidth = function(text, fontCss)
{
	return 0;
};
oFF.UiServerFramework.prototype.calculateTextWidthAsync = function(text, fontCss)
{
	let doubleAction = oFF.UiRemoteAsyncDoubleAction.create(oFF.UiRemoteProtocol.OP_UI_FRAMEWORK_ASYNC_CALCULATE_TEXT_WIDTH);
	let operation = this._addAsyncOperation(doubleAction);
	operation.addString(text);
	operation.addString(fontCss);
	return doubleAction.getPromise();
};
oFF.UiServerFramework.prototype.getAvailableThirdPartyLibraries = function()
{
	let structureAction = oFF.UiRemoteAsyncStructureAction.create(oFF.UiRemoteProtocol.OP_UI_FRAMEWORK_ASYNC_GET_AVAILABLE_THIRD_PARTY_LIBRARIES);
	this._addAsyncOperation(structureAction);
	return structureAction.getPromise();
};
oFF.UiServerFramework.prototype.getTheme = function()
{
	let stringAction = oFF.UiRemoteAsyncStringAction.create(oFF.UiRemoteProtocol.OP_UI_FRAMEWORK_ASYNC_GET_THEME);
	this._addAsyncOperation(stringAction);
	return stringAction.getPromise();
};
oFF.UiServerFramework.prototype.getThemeParameter = function(paramName)
{
	return null;
};
oFF.UiServerFramework.prototype.getThemeParameterAsync = function(paramName)
{
	let stringAction = oFF.UiRemoteAsyncStringAction.create(oFF.UiRemoteProtocol.OP_UI_FRAMEWORK_ASYNC_GET_THEME_PARAMETER);
	let operation = this._addAsyncOperation(stringAction);
	operation.addString(paramName);
	return stringAction.getPromise();
};
oFF.UiServerFramework.prototype.getViewportSize = function()
{
	let stringAction = oFF.UiRemoteAsyncStringAction.create(oFF.UiRemoteProtocol.OP_UI_FRAMEWORK_ASYNC_GET_VIEWPORT_SIZE);
	this._addAsyncOperation(stringAction);
	return stringAction.getPromise().onThenExt((viewportSizeStr) => {
		return oFF.UiSize.createByString(viewportSizeStr);
	});
};
oFF.UiServerFramework.prototype.openUrl = function(url, target)
{
	let operation = this._addOperation(oFF.UiRemoteProtocol.OP_UI_FRAMEWORK_OPEN_URL);
	operation.addString(url);
	operation.addString(target);
};
oFF.UiServerFramework.prototype.releaseObject = function()
{
	oFF.DfUiServerOperationsContext.prototype.releaseObject.call( this );
};
oFF.UiServerFramework.prototype.saveContent = function(content, contentName)
{
	let byteArrayStr = oFF.notNull(content) ? oFF.XByteArray.convertToString(content.getByteArray()) : null;
	let contentTypeStr = oFF.notNull(content) && content.getContentType() !== null ? content.getContentType().getName() : null;
	let operation = this._addOperation(oFF.UiRemoteProtocol.OP_UI_FRAMEWORK_SAVE_CONTENT);
	operation.addString(byteArrayStr);
	operation.addString(contentTypeStr);
	operation.addString(contentName);
};
oFF.UiServerFramework.prototype.setTheme = function(themeName, themeBaseUrl)
{
	let operation = this._addOperation(oFF.UiRemoteProtocol.OP_UI_FRAMEWORK_SET_THEME);
	operation.addString(themeName);
	operation.addString(themeBaseUrl);
};
oFF.UiServerFramework.prototype.writeTextToClipboard = function(text)
{
	let operation = this._addOperation(oFF.UiRemoteProtocol.OP_UI_FRAMEWORK_WRITE_TEXT_TO_CLIPBOARD);
	operation.addString(text);
};

oFF.UiRemoteAsyncDoubleAction = function() {};
oFF.UiRemoteAsyncDoubleAction.prototype = new oFF.DfUiRemoteAsyncAction();
oFF.UiRemoteAsyncDoubleAction.prototype._ff_c = "UiRemoteAsyncDoubleAction";

oFF.UiRemoteAsyncDoubleAction.create = function(name)
{
	let newInstance = new oFF.UiRemoteAsyncDoubleAction();
	newInstance._setupAction(name);
	return newInstance;
};
oFF.UiRemoteAsyncDoubleAction.prototype.convertStringResult = function(result)
{
	return oFF.XDoubleValue.create(oFF.XDouble.convertFromString(result));
};

oFF.UiRemoteAsyncStringAction = function() {};
oFF.UiRemoteAsyncStringAction.prototype = new oFF.DfUiRemoteAsyncAction();
oFF.UiRemoteAsyncStringAction.prototype._ff_c = "UiRemoteAsyncStringAction";

oFF.UiRemoteAsyncStringAction.create = function(name)
{
	let newInstance = new oFF.UiRemoteAsyncStringAction();
	newInstance._setupAction(name);
	return newInstance;
};
oFF.UiRemoteAsyncStringAction.prototype.convertStringResult = function(result)
{
	return result;
};

oFF.UiRemoteAsyncStructureAction = function() {};
oFF.UiRemoteAsyncStructureAction.prototype = new oFF.DfUiRemoteAsyncAction();
oFF.UiRemoteAsyncStructureAction.prototype._ff_c = "UiRemoteAsyncStructureAction";

oFF.UiRemoteAsyncStructureAction.create = function(name)
{
	let newInstance = new oFF.UiRemoteAsyncStructureAction();
	newInstance._setupAction(name);
	return newInstance;
};
oFF.UiRemoteAsyncStructureAction.prototype.convertStringResult = function(result)
{
	let tmpElement = oFF.PrUtils.deserialize(result);
	if (oFF.notNull(tmpElement) && tmpElement.isStructure())
	{
		return tmpElement.asStructure();
	}
	else
	{
		oFF.XLogger.printError("[UiRemoteAsyncStructureAction] Failed to parse remote structure string!");
	}
	return null;
};

oFF.SphereServer = function() {};
oFF.SphereServer.prototype = new oFF.XObjectExt();
oFF.SphereServer.prototype._ff_c = "SphereServer";

oFF.SphereServer.CUSTOM_PARAM_OFFSET = 4;
oFF.SphereServer.DEFAULT_SYNC_TIMER = 1000;
oFF.SphereServer.FRAGMENT_PROCESSING_TIMEOUT = 50;
oFF.SphereServer.PARAM_OFFSET = 3;
oFF.SphereServer.PROGRAM_INITIALIZING_TIMEOUT = 300;
oFF.SphereServer.createServer = function(process)
{
	let newObj = new oFF.SphereServer();
	newObj.setupServer(process);
	return newObj;
};
oFF.SphereServer.staticSetup = function() {};
oFF.SphereServer.prototype.DEBUGGING = false;
oFF.SphereServer.prototype.TRACING = false;
oFF.SphereServer.prototype.m_application = null;
oFF.SphereServer.prototype.m_environment = null;
oFF.SphereServer.prototype.m_runningServerProgramsSet = null;
oFF.SphereServer.prototype.m_startTime = null;
oFF.SphereServer.prototype._doIntegrityCheck = function(uiAppContainer, jsonContent)
{
	if (this.DEBUGGING)
	{
		let integrityCheck = jsonContent.getStructureByKey(oFF.UiRemoteProtocol.INTEGRITY_CHECK);
		let clientControlCount = integrityCheck.getIntegerByKey(oFF.UiRemoteProtocol.TOTAL_UI_ELEMENTS);
		let serverUiMgr = uiAppContainer.getProgramServerUiMgr();
		if (oFF.notNull(serverUiMgr))
		{
			let serverControlCount = serverUiMgr.getElementRegistrySize();
			if (clientControlCount !== serverControlCount)
			{
				let buffer = oFF.XStringBuffer.create();
				buffer.append("Server/Client ui element count different: ");
				buffer.appendInt(serverControlCount);
				buffer.append(" != ");
				buffer.appendInt(clientControlCount);
				this.log(buffer.toString());
			}
		}
	}
};
oFF.SphereServer.prototype._handleAsyncActionAction = function(uiAppContainer, jsonContent, serverResponse, serverJsonResponse)
{
	let isValid = this._validateClientRequest(uiAppContainer, jsonContent, serverResponse);
	if (isValid)
	{
		let actionUuid = jsonContent.getStringByKey(oFF.UiRemoteProtocol.OP_ASYNC_ACTION_UUID);
		let actionState = oFF.UiRemoteAsyncActionState.lookup(jsonContent.getStringByKey(oFF.UiRemoteProtocol.OP_ASYNC_ACTION_STATE));
		let actionResult = jsonContent.getStringByKey(oFF.UiRemoteProtocol.OP_ASYNC_ACTION_RESULT);
		let didExecute = uiAppContainer.executePendingAsyncAction(actionUuid, actionState, actionResult);
		if (didExecute)
		{
			this._prepareSuccessResponse(uiAppContainer, oFF.UiRemoteServerStatus.ASYNC_ACTION_SUCCESS.getName(), jsonContent, serverResponse, serverJsonResponse);
		}
		else
		{
			this._prepareErrorResponse(serverResponse, uiAppContainer.getIntanceId(), "Could not find async action on server!");
		}
	}
};
oFF.SphereServer.prototype._handleCheckInitializeStatusAction = function(uiServerPrg, jsonContent, serverResponse, serverJsonResponse)
{
	if (oFF.notNull(uiServerPrg))
	{
		if (uiServerPrg.isRunning())
		{
			this._prepareInitializedResponse(uiServerPrg, jsonContent, serverResponse, serverJsonResponse);
		}
		else if (uiServerPrg.isStarting())
		{
			this._prepareInitializingResponse(uiServerPrg, serverResponse, serverJsonResponse);
		}
		else
		{
			serverResponse.setStatusCode(oFF.HttpStatusCode.SC_INTERNAL_SERVER_ERROR);
			serverResponse.setStatusCodeDetails("Undefined remote program state!");
		}
	}
	else
	{
		serverResponse.setStatusCode(oFF.HttpStatusCode.SC_INTERNAL_SERVER_ERROR);
		serverResponse.setStatusCodeDetails("Could not find remote program for the specified instanceId!");
	}
};
oFF.SphereServer.prototype._handleCheckStatusAction = function(uiServerPrg, serverResponse, serverJsonResponse)
{
	let programStateStr = "Program not found!";
	if (oFF.notNull(uiServerPrg))
	{
		programStateStr = uiServerPrg.getProgramState().getName();
	}
	serverJsonResponse.putString(oFF.UiRemoteProtocol.REMOTE_PROGRAM_STATUS, programStateStr);
	serverJsonResponse.putString(oFF.UiRemoteProtocol.STATUS, oFF.UiRemoteServerStatus.EXECUTED.getName());
	serverResponse.setStatusCode(oFF.HttpStatusCode.SC_OK);
	serverResponse.setStatusCodeDetails("Program successfully terminated!");
};
oFF.SphereServer.prototype._handleEventAction = function(uiAppContainer, jsonContent, serverResponse, serverJsonResponse)
{
	let isValid = this._validateClientRequest(uiAppContainer, jsonContent, serverResponse);
	if (isValid)
	{
		this._doIntegrityCheck(uiAppContainer, jsonContent);
		this._processEvents(uiAppContainer, jsonContent);
		this._prepareSuccessResponse(uiAppContainer, oFF.UiRemoteServerStatus.EVENTS_PROCESSED.getName(), jsonContent, serverResponse, serverJsonResponse);
	}
};
oFF.SphereServer.prototype._handleGetServerInfoAction = function(serverResponse, serverJsonResponse)
{
	serverJsonResponse.putString(oFF.UiRemoteProtocol.PROTOCOL_VERSION, oFF.UiRemoteProtocol.REMOTE_UI_VERSION);
	serverJsonResponse.putLong(oFF.UiRemoteProtocol.START_TIME, this.m_startTime.getTimeInMilliseconds());
	let programsList = serverJsonResponse.putNewList(oFF.UiRemoteProtocol.PROGRAMS);
	oFF.XStream.of(oFF.ProgramRegistry.getOrderedAllEntries()).forEach((prgManifest) => {
		let tmpPrgStruct = programsList.addNewStructure();
		tmpPrgStruct.putString(oFF.UiRemoteProtocol.PROGRAM_NAME, prgManifest.getProgramName());
		tmpPrgStruct.putString(oFF.UiRemoteProtocol.PROGRAM_DESCRIPTION, prgManifest.getDescription());
		tmpPrgStruct.putString(oFF.UiRemoteProtocol.PROGRAM_CONTAINER_TYPE, prgManifest.getOutputContainerType().getName());
	});
	let runningContainersList = serverJsonResponse.putNewList(oFF.UiRemoteProtocol.RUNNING_CONTAINERS);
	let prgContainersKeyIterator = this.m_runningServerProgramsSet.getKeysAsIterator();
	while (prgContainersKeyIterator.hasNext())
	{
		let containerKey = prgContainersKeyIterator.next();
		let tmpContainer = this.m_runningServerProgramsSet.getByKey(containerKey);
		runningContainersList.add(tmpContainer.getServerProgramInfo());
	}
	serverJsonResponse.putString(oFF.UiRemoteProtocol.STATUS, oFF.UiRemoteServerStatus.EXECUTED.getName());
	serverResponse.setStatusCode(oFF.HttpStatusCode.SC_OK);
	serverResponse.setStatusCodeDetails("Server info success");
};
oFF.SphereServer.prototype._handleInitializeAction = function(jsonContent, serverResponse, serverJsonResponse)
{
	if (oFF.notNull(jsonContent))
	{
		let initData = jsonContent.getStructureByKey(oFF.UiRemoteProtocol.INIT_DATA);
		if (oFF.notNull(initData))
		{
			let newServerPrg = this._initializeServerProgram(initData);
			if (oFF.notNull(newServerPrg))
			{
				this._handleCheckInitializeStatusAction(newServerPrg, jsonContent, serverResponse, serverJsonResponse);
			}
			else
			{
				serverResponse.setStatusCode(oFF.HttpStatusCode.SC_INTERNAL_SERVER_ERROR);
				serverResponse.setStatusCodeDetails("Failed to initialize remote program!");
			}
		}
		else
		{
			serverResponse.setStatusCode(oFF.HttpStatusCode.SC_INTERNAL_SERVER_ERROR);
			serverResponse.setStatusCodeDetails("Missing init data! Cannot initialize program!");
		}
	}
	else
	{
		serverResponse.setStatusCode(oFF.HttpStatusCode.SC_INTERNAL_SERVER_ERROR);
		serverResponse.setStatusCodeDetails("Request is empty!");
	}
};
oFF.SphereServer.prototype._handleSyncAction = function(uiAppContainer, jsonContent, serverResponse, serverJsonResponse)
{
	let isValid = this._validateClientRequest(uiAppContainer, jsonContent, serverResponse);
	if (isValid)
	{
		this._doIntegrityCheck(uiAppContainer, jsonContent);
		this._processEvents(uiAppContainer, jsonContent);
		this._prepareSuccessResponse(uiAppContainer, oFF.UiRemoteServerStatus.SYNCED.getName(), jsonContent, serverResponse, serverJsonResponse);
	}
};
oFF.SphereServer.prototype._handleTerminateAction = function(uiServerPrg, serverResponse, serverJsonResponse)
{
	this._terminateProgram(uiServerPrg);
	serverResponse.setStatusCode(oFF.HttpStatusCode.SC_OK);
	serverResponse.setStatusCodeDetails("Program successfully terminated!");
	serverJsonResponse.putString(oFF.UiRemoteProtocol.STATUS, oFF.UiRemoteServerStatus.TERMINATED.getName());
};
oFF.SphereServer.prototype._initializeServerProgram = function(initData)
{
	let uiServerPrg = null;
	if (oFF.notNull(initData))
	{
		let process = this.getProcess();
		let env = process.getEnvironment();
		let sdk = env.getVariable(oFF.XEnvironmentConstants.FIREFLY_SDK);
		let sdkFile = oFF.XFile.create(process, sdk);
		let serverBase = sdkFile.getUri();
		uiServerPrg = oFF.UiServerProgram.createAndRun(initData, this.m_environment, serverBase, this.TRACING);
		if (oFF.notNull(uiServerPrg))
		{
			this.m_runningServerProgramsSet.add(uiServerPrg);
		}
	}
	return uiServerPrg;
};
oFF.SphereServer.prototype._prepareErrorResponse = function(errorResponse, instanceId, errorMessage)
{
	let errorJsonResponse = oFF.PrFactory.createStructure();
	errorJsonResponse.putString(oFF.UiRemoteProtocol.INSTANCE_ID, instanceId);
	errorJsonResponse.putString(oFF.UiRemoteProtocol.STATUS, oFF.UiRemoteServerStatus.ERROR.getName());
	errorJsonResponse.putString(oFF.UiRemoteProtocol.ERROR_MESSAGE, errorMessage);
	errorResponse.setStatusCode(oFF.HttpStatusCode.SC_INTERNAL_SERVER_ERROR);
	errorResponse.setStatusCodeDetails("An error occured during remote program execution!");
	errorResponse.setJsonObject(errorJsonResponse);
};
oFF.SphereServer.prototype._prepareInitializedResponse = function(uiServerPrg, jsonContent, serverResponse, serverJsonResponse)
{
	this._prepareSuccessResponse(uiServerPrg, oFF.UiRemoteServerStatus.INITIALIZED.getName(), jsonContent, serverResponse, serverJsonResponse);
	let processedFragment = uiServerPrg.processFragmentCfgs();
	if (processedFragment)
	{
		this._scheduleClientServerSync(serverJsonResponse, oFF.SphereServer.FRAGMENT_PROCESSING_TIMEOUT, oFF.UiRemoteSyncReason.FRAGMENT_PROCESSING);
	}
};
oFF.SphereServer.prototype._prepareInitializingResponse = function(uiServerPrg, serverResponse, serverJsonResponse)
{
	serverJsonResponse.putString(oFF.UiRemoteProtocol.INSTANCE_ID, uiServerPrg.getIntanceId());
	serverJsonResponse.putString(oFF.UiRemoteProtocol.STATUS, oFF.UiRemoteServerStatus.INITIALIZING.getName());
	this._scheduleClientServerSync(serverJsonResponse, oFF.SphereServer.PROGRAM_INITIALIZING_TIMEOUT, oFF.UiRemoteSyncReason.PROGRAM_INITIALIZING);
	serverResponse.setStatusCode(oFF.HttpStatusCode.SC_OK);
	serverResponse.setStatusCodeDetails("Server program starting!");
};
oFF.SphereServer.prototype._prepareSuccessResponse = function(uiAppContainer, status, jsonContent, serverResponse, serverJsonResponse)
{
	uiAppContainer.updateLastActivity();
	let uiManager = uiAppContainer.getProgramServerUiMgr();
	serverJsonResponse.putString(oFF.UiRemoteProtocol.INSTANCE_ID, uiAppContainer.getIntanceId());
	serverJsonResponse.put(oFF.UiRemoteProtocol.OPERATIONS, uiAppContainer.getPendingUiOperations());
	serverJsonResponse.putString(oFF.UiRemoteProtocol.STATUS, status);
	this._scheduleNextSyncTimerIfNeeded(serverJsonResponse);
	let newFragment = uiManager.getFragment();
	serverJsonResponse.putString(oFF.UiRemoteProtocol.FRAGMENT, newFragment);
	let integrityCheck = serverJsonResponse.putNewStructure(oFF.UiRemoteProtocol.INTEGRITY_CHECK);
	integrityCheck.putInteger(oFF.UiRemoteProtocol.TOTAL_UI_ELEMENTS, uiManager.getElementRegistrySize());
	integrityCheck.putString(oFF.UiRemoteProtocol.PROTOCOL_VERSION, oFF.UiRemoteProtocol.REMOTE_UI_VERSION);
	uiAppContainer.trace(jsonContent, serverJsonResponse);
	serverResponse.setStatusCode(oFF.HttpStatusCode.SC_OK);
	serverResponse.setStatusCodeDetails("OK");
};
oFF.SphereServer.prototype._processEvents = function(uiAppContainer, jsonContent)
{
	let events = jsonContent.getListByKey(oFF.UiRemoteProtocol.EVENTS);
	for (let k = 0; k < events.size(); k++)
	{
		let eventDesc2 = events.getListAt(k);
		let eventName2 = eventDesc2.getStringAt(0);
		let theEvent = oFF.UiServerEvent.lookup(eventName2);
		let context = null;
		if (theEvent.isControlContext())
		{
			let contextId = eventDesc2.getStringAt(1);
			let uiManager = uiAppContainer.getUiManager();
			context = uiManager.selectById(contextId);
		}
		theEvent.executeOperation(this, uiAppContainer.getIntanceId(), uiAppContainer, context, eventDesc2);
	}
};
oFF.SphereServer.prototype._scheduleClientServerSync = function(jsonResponse, time, reason)
{
	let reasonStr = oFF.UiRemoteSyncReason.BASIC_SYNC.getName();
	if (oFF.notNull(reason))
	{
		reasonStr = reason.getName();
	}
	if (time > 0)
	{
		jsonResponse.putInteger(oFF.UiRemoteProtocol.NEXT_SYNC_TIMER, time);
	}
	jsonResponse.putString(oFF.UiRemoteProtocol.SYNC_TIMER_REASON, reasonStr);
};
oFF.SphereServer.prototype._scheduleNextSyncTimerIfNeeded = function(jsonResponse)
{
	let dispatcher = oFF.Dispatcher.getInstance();
	let stillRunningTasks = dispatcher.getProcessingTimeReceiverCount();
	let activeTimeoutCount = oFF.XTimeoutManager.getManager().getActiveTimeoutCount();
	let nextTimeout = oFF.XTimeoutManager.getManager().getTimeLeftUntilNextExecution();
	let nextSyncTimer = 0;
	if (stillRunningTasks > 0)
	{
		nextSyncTimer = oFF.SphereServer.DEFAULT_SYNC_TIMER;
	}
	if (activeTimeoutCount > 0 && nextTimeout > 0)
	{
		if (nextSyncTimer > 0)
		{
			nextSyncTimer = oFF.XMath.min(nextTimeout, nextSyncTimer);
		}
		else
		{
			nextSyncTimer = nextTimeout;
		}
	}
	if (nextSyncTimer > 0)
	{
		this._scheduleClientServerSync(jsonResponse, nextSyncTimer, oFF.UiRemoteSyncReason.ACTIVE_TIMEOUTS);
		jsonResponse.putInteger(oFF.UiRemoteProtocol.STILL_RUNNING_TASKS, stillRunningTasks);
		jsonResponse.putInteger(oFF.UiRemoteProtocol.ACTIVE_TIMEOUTS, activeTimeoutCount);
	}
};
oFF.SphereServer.prototype._terminateProgram = function(uiServerPrg)
{
	if (oFF.notNull(uiServerPrg))
	{
		this.m_runningServerProgramsSet.removeElement(uiServerPrg);
		uiServerPrg.terminateServerPrg();
		uiServerPrg.releaseObject();
	}
};
oFF.SphereServer.prototype._validateClientRequest = function(uiAppContainer, jsonContent, serverResponse)
{
	if (oFF.notNull(jsonContent))
	{
		if (oFF.notNull(uiAppContainer))
		{
			return true;
		}
		else
		{
			serverResponse.setStatusCode(oFF.HttpStatusCode.SC_INTERNAL_SERVER_ERROR);
			serverResponse.setStatusCodeDetails("Could not find remote program for the specified instanceId!");
		}
	}
	else
	{
		serverResponse.setStatusCode(oFF.HttpStatusCode.SC_INTERNAL_SERVER_ERROR);
		serverResponse.setStatusCodeDetails("Request is empty!");
	}
	return false;
};
oFF.SphereServer.prototype.getApplication = function()
{
	return this.m_application;
};
oFF.SphereServer.prototype.getLogSeverity = function()
{
	return oFF.XObjectExt.prototype.getLogSeverity.call( this );
};
oFF.SphereServer.prototype.getLogWriter = function()
{
	return this.getSession().getLogWriter();
};
oFF.SphereServer.prototype.getProcess = function()
{
	return this.m_application.getProcess();
};
oFF.SphereServer.prototype.getProgramContainer = function(name)
{
	return this.m_runningServerProgramsSet.getByKey(name);
};
oFF.SphereServer.prototype.getSession = function()
{
	return this.m_application.getSession();
};
oFF.SphereServer.prototype.initServerContainer = function(environment)
{
	oFF.UiRemoteModule.getInstance();
	this.m_environment = environment;
	let kernelBoot = oFF.KernelBoot.create();
	kernelBoot.putAllEnvironmentVariables(environment);
	let kernel = kernelBoot.runFullBlockingMode();
	let process = kernel.getKernelProcessBase();
	process.newWorkingTaskManager(oFF.WorkingTaskManagerType.SINGLE_THREADED);
	this.setupServer(process);
};
oFF.SphereServer.prototype.onHttpRequest = function(serverRequestResponse)
{
	let clientRequest = serverRequestResponse.getClientHttpRequest();
	let remoteAction = null;
	let instanceId = null;
	try
	{
		let uri = clientRequest.getUri();
		remoteAction = oFF.UiRemoteAction.lookup(uri.getQueryElementValue(oFF.UiRemoteProtocol.ACTION));
		instanceId = uri.getQueryElementValue(oFF.UiRemoteProtocol.INSTANCE_ID);
		let jsonContent = clientRequest.getJsonContent();
		let uiServerPrg = this.m_runningServerProgramsSet.getByKey(instanceId);
		let serverResponse = oFF.HttpResponse.createResponse(clientRequest);
		let serverJsonResponse = oFF.PrFactory.createStructure();
		serverResponse.setJsonObject(serverJsonResponse);
		if (oFF.notNull(uiServerPrg) && uiServerPrg.isTerminated())
		{
			this._handleTerminateAction(uiServerPrg, serverResponse, serverJsonResponse);
		}
		else
		{
			if (remoteAction === oFF.UiRemoteAction.GET_SERVER_INFO)
			{
				this._handleGetServerInfoAction(serverResponse, serverJsonResponse);
			}
			else if (remoteAction === oFF.UiRemoteAction.INITIALIZE)
			{
				this._handleInitializeAction(jsonContent, serverResponse, serverJsonResponse);
			}
			else if (remoteAction === oFF.UiRemoteAction.CHECK_INITIALIZE_STATUS)
			{
				this._handleCheckInitializeStatusAction(uiServerPrg, jsonContent, serverResponse, serverJsonResponse);
			}
			else if (remoteAction === oFF.UiRemoteAction.SYNC)
			{
				this._handleSyncAction(uiServerPrg, jsonContent, serverResponse, serverJsonResponse);
			}
			else if (remoteAction === oFF.UiRemoteAction.EVENT)
			{
				this._handleEventAction(uiServerPrg, jsonContent, serverResponse, serverJsonResponse);
			}
			else if (remoteAction === oFF.UiRemoteAction.ASYNC_ACTION)
			{
				this._handleAsyncActionAction(uiServerPrg, jsonContent, serverResponse, serverJsonResponse);
			}
			else if (remoteAction === oFF.UiRemoteAction.CHECK_STATUS)
			{
				this._handleCheckStatusAction(uiServerPrg, serverResponse, serverJsonResponse);
			}
			else if (remoteAction === oFF.UiRemoteAction.TERMINATE)
			{
				this._handleTerminateAction(uiServerPrg, serverResponse, serverJsonResponse);
			}
			else
			{
				serverResponse.setStatusCode(oFF.HttpStatusCode.SC_NOT_ACCEPTABLE);
				serverResponse.setStatusCodeDetails("Unknown action");
			}
		}
		serverRequestResponse.setResponse(serverResponse);
	}
	catch (e)
	{
		if (remoteAction === oFF.UiRemoteAction.INITIALIZE)
		{
			this.terminateProgramById(instanceId);
		}
		this.logExt(oFF.OriginLayer.SERVER, oFF.Severity.ERROR, 0, oFF.XException.getStackTrace(e, 0));
		let errorResponse = oFF.HttpResponse.createResponse(clientRequest);
		this._prepareErrorResponse(errorResponse, instanceId, oFF.XException.getMessage(e));
		serverRequestResponse.setResponse(errorResponse);
	}
};
oFF.SphereServer.prototype.releaseObject = function()
{
	this.m_runningServerProgramsSet = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_runningServerProgramsSet);
	this.m_application = oFF.XObjectExt.release(this.m_application);
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.SphereServer.prototype.setupServer = function(process)
{
	this.m_application = oFF.ApplicationFactory.createApplication(process);
	let theSession = this.m_application.getSession();
	theSession.setDefaultSyncType(oFF.SyncType.NON_BLOCKING);
	this.m_runningServerProgramsSet = oFF.XSetOfNameObject.create();
	this.DEBUGGING = theSession.getEnvironment().getBooleanByKeyExt(oFF.XEnvironmentConstants.FIREFLY_SPHERE_DEBUGGING, false);
	this.TRACING = theSession.getEnvironment().getBooleanByKeyExt(oFF.XEnvironmentConstants.FIREFLY_SPHERE_TRACE, false);
	this.m_startTime = oFF.XDateTime.create();
};
oFF.SphereServer.prototype.terminateProgramById = function(instanceId)
{
	let uiServerPrg = this.m_runningServerProgramsSet.getByKey(instanceId);
	if (oFF.notNull(uiServerPrg))
	{
		this._terminateProgram(uiServerPrg);
	}
};

oFF.UiServerPrgContainer = function() {};
oFF.UiServerPrgContainer.prototype = new oFF.ProgramContainer();
oFF.UiServerPrgContainer.prototype._ff_c = "UiServerPrgContainer";

oFF.UiServerPrgContainer.createExt = function(startCfg, program)
{
	let container = new oFF.UiServerPrgContainer();
	container.setupContainer(startCfg, program);
	return container;
};
oFF.UiServerPrgContainer.prototype.m_didShutdown = false;
oFF.UiServerPrgContainer.prototype.m_shutdownProcedure = null;
oFF.UiServerPrgContainer.prototype.didShutdown = function()
{
	return this.m_didShutdown;
};
oFF.UiServerPrgContainer.prototype.releaseObject = function()
{
	this.m_didShutdown = true;
	oFF.ProgramContainer.prototype.releaseObject.call( this );
};
oFF.UiServerPrgContainer.prototype.runFull = function()
{
	this.m_didShutdown = false;
};
oFF.UiServerPrgContainer.prototype.setShutdownProcedure = function(procedure)
{
	this.m_shutdownProcedure = procedure;
};
oFF.UiServerPrgContainer.prototype.setupContainer = function(startCfg, program)
{
	this.m_didShutdown = false;
	oFF.ProgramContainer.prototype.setupContainer.call( this , startCfg, program);
};
oFF.UiServerPrgContainer.prototype.shutdownContainer = function()
{
	this.m_didShutdown = true;
	if (oFF.notNull(this.m_shutdownProcedure))
	{
		this.m_shutdownProcedure();
	}
};

oFF.UiRemoteAction = function() {};
oFF.UiRemoteAction.prototype = new oFF.UiBaseConstant();
oFF.UiRemoteAction.prototype._ff_c = "UiRemoteAction";

oFF.UiRemoteAction.ASYNC_ACTION = null;
oFF.UiRemoteAction.CHECK_INITIALIZE_STATUS = null;
oFF.UiRemoteAction.CHECK_STATUS = null;
oFF.UiRemoteAction.CONNECT = null;
oFF.UiRemoteAction.EVENT = null;
oFF.UiRemoteAction.GET_SERVER_INFO = null;
oFF.UiRemoteAction.INITIALIZE = null;
oFF.UiRemoteAction.SYNC = null;
oFF.UiRemoteAction.TERMINATE = null;
oFF.UiRemoteAction.s_lookup = null;
oFF.UiRemoteAction.create = function(name, requiresContainerInstance)
{
	let newConstant = oFF.UiBaseConstant.createUiConstant(new oFF.UiRemoteAction(), name, oFF.UiRemoteAction.s_lookup);
	newConstant.m_requiresContainerInstance = requiresContainerInstance;
	return newConstant;
};
oFF.UiRemoteAction.lookup = function(name)
{
	return oFF.UiBaseConstant.lookupConstant(name, oFF.UiRemoteAction.s_lookup);
};
oFF.UiRemoteAction.staticSetup = function()
{
	oFF.UiRemoteAction.s_lookup = oFF.XHashMapByString.create();
	oFF.UiRemoteAction.INITIALIZE = oFF.UiRemoteAction.create("Initialize", false);
	oFF.UiRemoteAction.CHECK_INITIALIZE_STATUS = oFF.UiRemoteAction.create("CheckInitializeStatus", true);
	oFF.UiRemoteAction.SYNC = oFF.UiRemoteAction.create("Sync", true);
	oFF.UiRemoteAction.CONNECT = oFF.UiRemoteAction.create("Connect", true);
	oFF.UiRemoteAction.EVENT = oFF.UiRemoteAction.create("Event", true);
	oFF.UiRemoteAction.ASYNC_ACTION = oFF.UiRemoteAction.create("AsyncAction", true);
	oFF.UiRemoteAction.CHECK_STATUS = oFF.UiRemoteAction.create("CheckStatus", true);
	oFF.UiRemoteAction.TERMINATE = oFF.UiRemoteAction.create("Terminate", true);
	oFF.UiRemoteAction.GET_SERVER_INFO = oFF.UiRemoteAction.create("GetServerInfo", false);
};
oFF.UiRemoteAction.prototype.m_requiresContainerInstance = false;
oFF.UiRemoteAction.prototype.requiresContainerInstance = function()
{
	return this.m_requiresContainerInstance;
};

oFF.UiRemoteAsyncActionState = function() {};
oFF.UiRemoteAsyncActionState.prototype = new oFF.UiBaseConstant();
oFF.UiRemoteAsyncActionState.prototype._ff_c = "UiRemoteAsyncActionState";

oFF.UiRemoteAsyncActionState.FULFILLED = null;
oFF.UiRemoteAsyncActionState.REJECTED = null;
oFF.UiRemoteAsyncActionState.s_lookup = null;
oFF.UiRemoteAsyncActionState.create = function(name)
{
	let newConstant = oFF.UiBaseConstant.createUiConstant(new oFF.UiRemoteAsyncActionState(), name, oFF.UiRemoteAsyncActionState.s_lookup);
	return newConstant;
};
oFF.UiRemoteAsyncActionState.lookup = function(name)
{
	return oFF.UiBaseConstant.lookupConstant(name, oFF.UiRemoteAsyncActionState.s_lookup);
};
oFF.UiRemoteAsyncActionState.staticSetup = function()
{
	oFF.UiRemoteAsyncActionState.s_lookup = oFF.XHashMapByString.create();
	oFF.UiRemoteAsyncActionState.FULFILLED = oFF.UiRemoteAsyncActionState.create("Fulfilled");
	oFF.UiRemoteAsyncActionState.REJECTED = oFF.UiRemoteAsyncActionState.create("Rejected");
};

oFF.UiRemoteServerStatus = function() {};
oFF.UiRemoteServerStatus.prototype = new oFF.UiBaseConstant();
oFF.UiRemoteServerStatus.prototype._ff_c = "UiRemoteServerStatus";

oFF.UiRemoteServerStatus.ASYNC_ACTION_SUCCESS = null;
oFF.UiRemoteServerStatus.ERROR = null;
oFF.UiRemoteServerStatus.EVENTS_PROCESSED = null;
oFF.UiRemoteServerStatus.EXECUTED = null;
oFF.UiRemoteServerStatus.INITIALIZED = null;
oFF.UiRemoteServerStatus.INITIALIZING = null;
oFF.UiRemoteServerStatus.SYNCED = null;
oFF.UiRemoteServerStatus.TERMINATED = null;
oFF.UiRemoteServerStatus.s_lookup = null;
oFF.UiRemoteServerStatus.create = function(name)
{
	let newConstant = oFF.UiBaseConstant.createUiConstant(new oFF.UiRemoteServerStatus(), name, oFF.UiRemoteServerStatus.s_lookup);
	return newConstant;
};
oFF.UiRemoteServerStatus.lookup = function(name)
{
	return oFF.UiBaseConstant.lookupConstant(name, oFF.UiRemoteServerStatus.s_lookup);
};
oFF.UiRemoteServerStatus.staticSetup = function()
{
	oFF.UiRemoteServerStatus.s_lookup = oFF.XHashMapByString.create();
	oFF.UiRemoteServerStatus.INITIALIZED = oFF.UiRemoteServerStatus.create("Initialized");
	oFF.UiRemoteServerStatus.INITIALIZING = oFF.UiRemoteServerStatus.create("initializing");
	oFF.UiRemoteServerStatus.EXECUTED = oFF.UiRemoteServerStatus.create("Executed");
	oFF.UiRemoteServerStatus.SYNCED = oFF.UiRemoteServerStatus.create("Synced");
	oFF.UiRemoteServerStatus.EVENTS_PROCESSED = oFF.UiRemoteServerStatus.create("EventsProcessed");
	oFF.UiRemoteServerStatus.ASYNC_ACTION_SUCCESS = oFF.UiRemoteServerStatus.create("AsyncActionSuccess");
	oFF.UiRemoteServerStatus.TERMINATED = oFF.UiRemoteServerStatus.create("Terminated");
	oFF.UiRemoteServerStatus.ERROR = oFF.UiRemoteServerStatus.create("Error");
};

oFF.UiRemoteSyncReason = function() {};
oFF.UiRemoteSyncReason.prototype = new oFF.UiBaseConstant();
oFF.UiRemoteSyncReason.prototype._ff_c = "UiRemoteSyncReason";

oFF.UiRemoteSyncReason.ACTIVE_TIMEOUTS = null;
oFF.UiRemoteSyncReason.BASIC_SYNC = null;
oFF.UiRemoteSyncReason.FRAGMENT_PROCESSING = null;
oFF.UiRemoteSyncReason.PROGRAM_INITIALIZING = null;
oFF.UiRemoteSyncReason.s_lookup = null;
oFF.UiRemoteSyncReason.create = function(name)
{
	let newConstant = oFF.UiBaseConstant.createUiConstant(new oFF.UiRemoteSyncReason(), name, oFF.UiRemoteSyncReason.s_lookup);
	return newConstant;
};
oFF.UiRemoteSyncReason.lookup = function(name)
{
	return oFF.UiBaseConstant.lookupConstant(name, oFF.UiRemoteSyncReason.s_lookup);
};
oFF.UiRemoteSyncReason.staticSetup = function()
{
	oFF.UiRemoteSyncReason.s_lookup = oFF.XHashMapByString.create();
	oFF.UiRemoteSyncReason.BASIC_SYNC = oFF.UiRemoteSyncReason.create("BasicSync");
	oFF.UiRemoteSyncReason.ACTIVE_TIMEOUTS = oFF.UiRemoteSyncReason.create("ActiveTimeouts");
	oFF.UiRemoteSyncReason.FRAGMENT_PROCESSING = oFF.UiRemoteSyncReason.create("FragmentProcessing");
	oFF.UiRemoteSyncReason.PROGRAM_INITIALIZING = oFF.UiRemoteSyncReason.create("ProgramInitializing");
};

oFF.UiServerProgramState = function() {};
oFF.UiServerProgramState.prototype = new oFF.UiBaseConstant();
oFF.UiServerProgramState.prototype._ff_c = "UiServerProgramState";

oFF.UiServerProgramState.RUNNING = null;
oFF.UiServerProgramState.STARTING = null;
oFF.UiServerProgramState.TERMINATED = null;
oFF.UiServerProgramState.s_lookup = null;
oFF.UiServerProgramState.create = function(name)
{
	let theConstant = oFF.XConstant.setupName(new oFF.UiServerProgramState(), name);
	return theConstant;
};
oFF.UiServerProgramState.lookup = function(name)
{
	return oFF.UiBaseConstant.lookupConstant(name, oFF.UiServerProgramState.s_lookup);
};
oFF.UiServerProgramState.staticSetup = function()
{
	oFF.UiServerProgramState.s_lookup = oFF.XHashMapByString.create();
	oFF.UiServerProgramState.STARTING = oFF.UiServerProgramState.create("Starting");
	oFF.UiServerProgramState.RUNNING = oFF.UiServerProgramState.create("Running");
	oFF.UiServerProgramState.TERMINATED = oFF.UiServerProgramState.create("Terminated");
};

oFF.SubSysGuiServerPrg = function() {};
oFF.SubSysGuiServerPrg.prototype = new oFF.DfProgramSubSys();
oFF.SubSysGuiServerPrg.prototype._ff_c = "SubSysGuiServerPrg";

oFF.SubSysGuiServerPrg.DEFAULT_PROGRAM_NAME = "@SubSys.Gui.Server";
oFF.SubSysGuiServerPrg.prototype.m_uiServerManager = null;
oFF.SubSysGuiServerPrg.prototype.getMainApi = function()
{
	return this.m_uiServerManager;
};
oFF.SubSysGuiServerPrg.prototype.getProgramName = function()
{
	return oFF.SubSysGuiServerPrg.DEFAULT_PROGRAM_NAME;
};
oFF.SubSysGuiServerPrg.prototype.getSubSystemType = function()
{
	return oFF.SubSystemType.GUI;
};
oFF.SubSysGuiServerPrg.prototype.newProgram = function()
{
	let newObj = new oFF.SubSysGuiServerPrg();
	newObj.setup();
	return newObj;
};
oFF.SubSysGuiServerPrg.prototype.runProcess = function()
{
	let process = this.getProcess();
	this.m_uiServerManager = oFF.UiServerManager.create(process, oFF.XPlatform.GENERIC);
	let procEnv = process.getEnvironment();
	let devInfoStr = procEnv.getStringByKeyExt(oFF.UiRemoteProtocol.INIT_DEVICE_INFO, null);
	if (oFF.notNull(devInfoStr))
	{
		let devInfo = oFF.UiDeviceInfo.createByString(devInfoStr);
		this.m_uiServerManager.setDeviceInfo(devInfo);
	}
	let driverInfoStr = procEnv.getStringByKeyExt(oFF.UiRemoteProtocol.INIT_DRIVER_INFO, null);
	if (oFF.notNull(driverInfoStr))
	{
		let driverInfo = oFF.UiDriverInfo.createByString(driverInfoStr);
		this.m_uiServerManager.setDriverInfo(driverInfo);
	}
	let styleClassStr = procEnv.getStringByKeyExt(oFF.UiRemoteProtocol.STYLE_CLASS, null);
	if (oFF.notNull(styleClassStr))
	{
		let styleClass = oFF.UiStyleClass.lookup(styleClassStr);
		if (oFF.notNull(styleClass))
		{
			this.m_uiServerManager.setDefaultStyleClass(styleClass);
		}
	}
	this.activateSubSystem(null, oFF.SubSystemStatus.ACTIVE);
	return false;
};

oFF.UiServerProgram = function() {};
oFF.UiServerProgram.prototype = new oFF.DfNameObject();
oFF.UiServerProgram.prototype._ff_c = "UiServerProgram";

oFF.UiServerProgram.createAndRun = function(initData, environment, serverBase, isTracingEnabled)
{
	let newObject = null;
	if (oFF.notNull(initData) && initData.isStructure())
	{
		newObject = new oFF.UiServerProgram();
		newObject.setupContainer(initData, environment);
		newObject.m_isTracingEnabled = isTracingEnabled;
		let success = newObject.createAndRunContainerProgram(serverBase);
		if (success === false)
		{
			newObject = null;
		}
	}
	return newObject;
};
oFF.UiServerProgram.prototype.m_application = null;
oFF.UiServerProgram.prototype.m_canProcessFragment = false;
oFF.UiServerProgram.prototype.m_environment = null;
oFF.UiServerProgram.prototype.m_fragmentCfgList = null;
oFF.UiServerProgram.prototype.m_initData = null;
oFF.UiServerProgram.prototype.m_isTracingEnabled = false;
oFF.UiServerProgram.prototype.m_kernel = null;
oFF.UiServerProgram.prototype.m_lastActivity = null;
oFF.UiServerProgram.prototype.m_prgCfgProgramName = null;
oFF.UiServerProgram.prototype.m_prgCfgRemotePrgContainerType = null;
oFF.UiServerProgram.prototype.m_serverPrgState = null;
oFF.UiServerProgram.prototype.m_serverUiDevice = null;
oFF.UiServerProgram.prototype.m_serverUiFramework = null;
oFF.UiServerProgram.prototype.m_startTime = null;
oFF.UiServerProgram.prototype.m_traceIndex = 0;
oFF.UiServerProgram.prototype.m_traceName = null;
oFF.UiServerProgram.prototype.m_uiProgram = null;
oFF.UiServerProgram.prototype._newServerDevice = function()
{
	this.m_serverUiDevice = oFF.UiServerDevice.create();
	return this.m_serverUiDevice;
};
oFF.UiServerProgram.prototype._newServerUiFramework = function()
{
	this.m_serverUiFramework = oFF.UiServerFramework.create();
	return this.m_serverUiFramework;
};
oFF.UiServerProgram.prototype.createAndRunContainerProgram = function(serverBase)
{
	this.m_startTime = oFF.XDateTime.create();
	this.m_lastActivity = oFF.XDateTime.create();
	let remoteLocation = this.m_initData.getStringByKey(oFF.UiRemoteProtocol.INIT_REMOTE_LOCATION);
	let prgEnv = oFF.XHashMapByString.create();
	if (oFF.notNull(this.m_environment))
	{
		prgEnv.putAll(this.m_environment);
	}
	prgEnv.put(oFF.XEnvironmentConstants.NETWORK_LOCATION, remoteLocation);
	let kernelBoot = oFF.KernelBoot.create();
	kernelBoot.putAllEnvironmentVariables(prgEnv);
	this.m_kernel = kernelBoot.runFullBlockingMode();
	let kernelProcess = this.m_kernel.getKernelProcessBase();
	kernelProcess.newWorkingTaskManager(oFF.WorkingTaskManagerType.SINGLE_THREADED);
	kernelProcess.setDefaultSyncType(oFF.SyncType.NON_BLOCKING);
	let state = oFF.KernelPersistentState.create(this.m_kernel);
	this.m_kernel.registerOnEvent(state);
	this.m_kernel.registerOnEvent(this);
	if (this.m_canProcessFragment)
	{
		this.m_fragmentCfgList = state.getStartCfgsByUrl(remoteLocation);
	}
	this.m_uiProgram = this.newProgram(kernelProcess);
	if (oFF.notNull(this.m_uiProgram))
	{
		this.m_uiProgram.initializeProgram().onFinally(() => {
			this.m_application = this.m_uiProgram.getApplication();
			let traceName = this.m_initData.getStringByKey(oFF.UiRemoteProtocol.INIT_TRACE_NAME);
			this.setTraceName(traceName);
			let uiServerManager = this.newServerUiManager(this.m_uiProgram, serverBase);
			this.m_application.setUiManager(uiServerManager);
			let genesis = oFF.UiGenesis.create(uiServerManager.getAnchor());
			this.m_uiProgram.renderUi(genesis);
			this.m_serverPrgState = oFF.UiServerProgramState.RUNNING;
		});
		return true;
	}
	else
	{
		this.log2("Cannot find factory for application: ", this.m_prgCfgProgramName);
		return false;
	}
};
oFF.UiServerProgram.prototype.executePendingAsyncAction = function(actionUuid, actionState, actionResult)
{
	let didFindAction = false;
	didFindAction = this.getProgramServerUiMgr().executeAsyncAction(actionUuid, actionState, actionResult);
	if (!didFindAction)
	{
		didFindAction = this.getProgramServerUiFramework().executeAsyncAction(actionUuid, actionState, actionResult);
	}
	if (!didFindAction)
	{
		didFindAction = this.getProgramServerUiDevice().executeAsyncAction(actionUuid, actionState, actionResult);
	}
	return didFindAction;
};
oFF.UiServerProgram.prototype.getContext = function(identifier)
{
	let uiContext = this.getUiManager().selectById(identifier);
	if (oFF.isNull(uiContext))
	{
		this.log2("Cannot find context for ", identifier);
	}
	return uiContext;
};
oFF.UiServerProgram.prototype.getGenesis = function()
{
	return this.getUiManager().getGenesis();
};
oFF.UiServerProgram.prototype.getIntanceId = function()
{
	return this.getName();
};
oFF.UiServerProgram.prototype.getPendingUiOperations = function()
{
	let pendingOperationList = this.getProgramServerUiMgr().fetchOprationSequence();
	if (oFF.isNull(pendingOperationList))
	{
		pendingOperationList = oFF.PrFactory.createList();
	}
	if (this.getProgramServerUiFramework() !== null)
	{
		pendingOperationList.addAll(this.getProgramServerUiFramework().fetchOprationSequence());
	}
	if (this.getProgramServerUiDevice() !== null)
	{
		pendingOperationList.addAll(this.getProgramServerUiDevice().fetchOprationSequence());
	}
	return pendingOperationList;
};
oFF.UiServerProgram.prototype.getProgramServerUiDevice = function()
{
	return this.m_serverUiDevice;
};
oFF.UiServerProgram.prototype.getProgramServerUiFramework = function()
{
	return this.m_serverUiFramework;
};
oFF.UiServerProgram.prototype.getProgramServerUiMgr = function()
{
	return this.getUiManager();
};
oFF.UiServerProgram.prototype.getProgramState = function()
{
	return this.m_serverPrgState;
};
oFF.UiServerProgram.prototype.getServerProgramInfo = function()
{
	let containerInfoStruct = oFF.PrFactory.createStructure();
	containerInfoStruct.putString(oFF.UiRemoteProtocol.INSTANCE_ID, this.getIntanceId());
	containerInfoStruct.putString(oFF.UiRemoteProtocol.PROGRAM_NAME, this.m_prgCfgProgramName);
	containerInfoStruct.putString(oFF.UiRemoteProtocol.STYLE_CLASS, this.getProgramServerUiMgr().getDefaultStyleClass().getName());
	containerInfoStruct.putString(oFF.UiRemoteProtocol.FRAGMENT, this.getProgramServerUiMgr().getFragment());
	containerInfoStruct.putLong(oFF.UiRemoteProtocol.START_TIME, this.m_startTime.getTimeInMilliseconds());
	containerInfoStruct.putLong(oFF.UiRemoteProtocol.LAST_ACTIVITY, this.m_lastActivity.getTimeInMilliseconds());
	return containerInfoStruct;
};
oFF.UiServerProgram.prototype.getUiManager = function()
{
	return this.m_application.getUiManager();
};
oFF.UiServerProgram.prototype.isRunning = function()
{
	return this.m_serverPrgState === oFF.UiServerProgramState.RUNNING;
};
oFF.UiServerProgram.prototype.isStarting = function()
{
	return this.m_serverPrgState === oFF.UiServerProgramState.STARTING;
};
oFF.UiServerProgram.prototype.isTerminated = function()
{
	return this.m_serverPrgState === oFF.UiServerProgramState.TERMINATED;
};
oFF.UiServerProgram.prototype.newProgram = function(process)
{
	let program = null;
	let initArgsStructure = this.m_initData.getStructureByKey(oFF.UiRemoteProtocol.INIT_ARGS_STRUCTURE);
	let initArgsString = this.m_initData.getStringByKey(oFF.UiRemoteProtocol.INIT_ARGS_STRING);
	let factory = oFF.ProgramRegistry.getProgramFactory(this.m_prgCfgProgramName);
	if (oFF.notNull(factory))
	{
		program = factory.newProgram();
		let subSession = process.newSubSession();
		if (oFF.isNull(initArgsStructure))
		{
			initArgsStructure = oFF.PrFactory.createStructure();
			let programMetadata = factory.getProgramMetadata();
			initArgsStructure = oFF.ProgramUtils.createArgStructureFromString(programMetadata, initArgsString);
		}
		let args = oFF.ProgramArgs.createWithStructure(initArgsStructure);
		let startCfg = oFF.ProgramStartCfg.create(process, this.m_prgCfgProgramName, null, args);
		startCfg.setProgram(program);
		startCfg.setProgramContainer(this.newServerPrgContainer(startCfg, program, process));
		if (oFF.notNull(this.m_prgCfgRemotePrgContainerType))
		{
			startCfg.setEnforcedContainerType(this.m_prgCfgRemotePrgContainerType);
		}
		subSession.setStartConfiguration(startCfg);
		program.setProcess(subSession);
	}
	return program;
};
oFF.UiServerProgram.prototype.newServerPrgContainer = function(startCfg, program, process)
{
	let newServerPrgContainer = oFF.UiServerPrgContainer.createExt(startCfg, program);
	newServerPrgContainer.setProcess(process);
	newServerPrgContainer.setShutdownProcedure(() => {
		this.terminateServerPrg();
	});
	return newServerPrgContainer;
};
oFF.UiServerProgram.prototype.newServerUiManager = function(uiProgram, serverBase)
{
	let remoteLocation = this.m_initData.getStringByKey(oFF.UiRemoteProtocol.INIT_REMOTE_LOCATION);
	let fragment = this.m_initData.getStringByKey(oFF.UiRemoteProtocol.FRAGMENT);
	let platformName = this.m_initData.getStringByKey(oFF.UiRemoteProtocol.INIT_PLATFORM);
	let devInfoStr = this.m_initData.getStringByKey(oFF.UiRemoteProtocol.INIT_DEVICE_INFO);
	let driverInfoStr = this.m_initData.getStringByKey(oFF.UiRemoteProtocol.INIT_DRIVER_INFO);
	let style = this.m_initData.getStringByKey(oFF.UiRemoteProtocol.STYLE_CLASS);
	let uiFrameworkConfig = this.m_initData.getStructureByKey(oFF.UiRemoteProtocol.INIT_UI_FRAMEWORK_CONFIG);
	let uiTypeDefs = this.m_initData.getStructureByKey(oFF.UiRemoteProtocol.INIT_UI_TYPE_DEFS);
	let clientBase = null;
	if (oFF.notNull(remoteLocation))
	{
		clientBase = oFF.XUri.createFromUrl(remoteLocation);
		clientBase.setPath("/");
		clientBase.setQuery(null);
		clientBase.setFragment(null);
	}
	let remotePlatform = oFF.XPlatform.lookupWithDefault(platformName, oFF.XPlatform.GENERIC);
	let uiServerManager = oFF.UiServerManager.create(uiProgram.getSession(), remotePlatform);
	uiServerManager.setResourceLocations(serverBase, clientBase);
	let process = uiProgram.getProcess();
	process.setEntity(oFF.ProcessEntity.GUI, uiServerManager);
	let kernel = process.getKernel();
	let subSystemContainer = kernel.getSubSystemContainer(oFF.SubSystemType.GUI);
	subSystemContainer.setSubSystem(uiServerManager);
	let selector = process.getSelector();
	selector.registerSelector(oFF.SigSelDomain.UI, uiServerManager.getSigSelProviderSelector());
	if (this.m_canProcessFragment)
	{
		uiServerManager.setFragment(fragment);
	}
	else
	{
		uiServerManager.setFragment("");
	}
	if (oFF.notNull(devInfoStr))
	{
		let devInfo = oFF.UiDeviceInfo.createByString(devInfoStr);
		uiServerManager.setDeviceInfo(devInfo);
	}
	if (oFF.notNull(driverInfoStr))
	{
		let driverInfo = oFF.UiDriverInfo.createByString(driverInfoStr);
		uiServerManager.setDriverInfo(driverInfo);
	}
	if (oFF.notNull(style))
	{
		let styleClass = oFF.UiStyleClass.lookup(style);
		if (oFF.notNull(styleClass))
		{
			uiServerManager.setDefaultStyleClass(styleClass);
		}
	}
	if (oFF.notNull(uiFrameworkConfig))
	{
		uiServerManager.setRtl(uiFrameworkConfig.getBooleanByKeyExt(oFF.UiRemoteProtocol.CLIENT_RTL, false));
	}
	if (oFF.notNull(uiTypeDefs))
	{
		let iterator = uiTypeDefs.getKeysAsReadOnlyList().getIterator();
		while (iterator.hasNext())
		{
			let uiType = iterator.next();
			let currentUiTypeDef = uiTypeDefs.getStructureByKey(uiType);
			let flagList = currentUiTypeDef.getListByKey(oFF.UiRemoteProtocol.CAPABILITY_FLAGS);
			if (oFF.notNull(flagList))
			{
				for (let i = 0; i < flagList.size(); i++)
				{
					let flag = flagList.getStringAt(i);
					uiServerManager.setUiTypeCapabilityFlag(uiType, flag);
				}
			}
		}
	}
	return uiServerManager;
};
oFF.UiServerProgram.prototype.onAfterClose = oFF.noSupport;
oFF.UiServerProgram.prototype.onAfterOpen = oFF.noSupport;
oFF.UiServerProgram.prototype.onAfterRender = oFF.noSupport;
oFF.UiServerProgram.prototype.onBack = oFF.noSupport;
oFF.UiServerProgram.prototype.onBeforeClose = oFF.noSupport;
oFF.UiServerProgram.prototype.onBeforeOpen = oFF.noSupport;
oFF.UiServerProgram.prototype.onBeforePageChanged = oFF.noSupport;
oFF.UiServerProgram.prototype.onButtonPress = oFF.noSupport;
oFF.UiServerProgram.prototype.onChange = oFF.noSupport;
oFF.UiServerProgram.prototype.onChipUpdate = oFF.noSupport;
oFF.UiServerProgram.prototype.onClick = oFF.noSupport;
oFF.UiServerProgram.prototype.onClose = oFF.noSupport;
oFF.UiServerProgram.prototype.onCollapse = oFF.noSupport;
oFF.UiServerProgram.prototype.onColorSelect = oFF.noSupport;
oFF.UiServerProgram.prototype.onColumnResize = oFF.noSupport;
oFF.UiServerProgram.prototype.onContextMenu = oFF.noSupport;
oFF.UiServerProgram.prototype.onCursorChange = oFF.noSupport;
oFF.UiServerProgram.prototype.onDelete = oFF.noSupport;
oFF.UiServerProgram.prototype.onDeselect = oFF.noSupport;
oFF.UiServerProgram.prototype.onDetailPress = oFF.noSupport;
oFF.UiServerProgram.prototype.onDoubleClick = oFF.noSupport;
oFF.UiServerProgram.prototype.onDragEnd = oFF.noSupport;
oFF.UiServerProgram.prototype.onDragEnter = oFF.noSupport;
oFF.UiServerProgram.prototype.onDragOver = oFF.noSupport;
oFF.UiServerProgram.prototype.onDragStart = oFF.noSupport;
oFF.UiServerProgram.prototype.onDrop = oFF.noSupport;
oFF.UiServerProgram.prototype.onEditingBegin = oFF.noSupport;
oFF.UiServerProgram.prototype.onEditingEnd = oFF.noSupport;
oFF.UiServerProgram.prototype.onEnter = oFF.noSupport;
oFF.UiServerProgram.prototype.onError = oFF.noSupport;
oFF.UiServerProgram.prototype.onEscape = oFF.noSupport;
oFF.UiServerProgram.prototype.onExecute = oFF.noSupport;
oFF.UiServerProgram.prototype.onExpand = oFF.noSupport;
oFF.UiServerProgram.prototype.onFileDrop = oFF.noSupport;
oFF.UiServerProgram.prototype.onHover = oFF.noSupport;
oFF.UiServerProgram.prototype.onHoverEnd = oFF.noSupport;
oFF.UiServerProgram.prototype.onItemClose = oFF.noSupport;
oFF.UiServerProgram.prototype.onItemDelete = oFF.noSupport;
oFF.UiServerProgram.prototype.onItemPress = oFF.noSupport;
oFF.UiServerProgram.prototype.onItemSelect = oFF.noSupport;
oFF.UiServerProgram.prototype.onKeyDown = oFF.noSupport;
oFF.UiServerProgram.prototype.onKeyUp = oFF.noSupport;
oFF.UiServerProgram.prototype.onLiveChange = oFF.noSupport;
oFF.UiServerProgram.prototype.onLoadFinished = oFF.noSupport;
oFF.UiServerProgram.prototype.onMenuPress = oFF.noSupport;
oFF.UiServerProgram.prototype.onMove = oFF.noSupport;
oFF.UiServerProgram.prototype.onMoveEnd = oFF.noSupport;
oFF.UiServerProgram.prototype.onMoveStart = oFF.noSupport;
oFF.UiServerProgram.prototype.onOpen = oFF.noSupport;
oFF.UiServerProgram.prototype.onPageChanged = oFF.noSupport;
oFF.UiServerProgram.prototype.onPaste = oFF.noSupport;
oFF.UiServerProgram.prototype.onPress = oFF.noSupport;
oFF.UiServerProgram.prototype.onProcessEvent = function(process, event)
{
	if (this.m_canProcessFragment)
	{
		this.getProgramServerUiMgr().setFragment(oFF.NetworkEnv.getFragment());
	}
};
oFF.UiServerProgram.prototype.onReadLineFinished = oFF.noSupport;
oFF.UiServerProgram.prototype.onRefresh = oFF.noSupport;
oFF.UiServerProgram.prototype.onResize = oFF.noSupport;
oFF.UiServerProgram.prototype.onRowResize = oFF.noSupport;
oFF.UiServerProgram.prototype.onScroll = oFF.noSupport;
oFF.UiServerProgram.prototype.onScrollLoad = oFF.noSupport;
oFF.UiServerProgram.prototype.onSearch = oFF.noSupport;
oFF.UiServerProgram.prototype.onSelect = oFF.noSupport;
oFF.UiServerProgram.prototype.onSelectionChange = oFF.noSupport;
oFF.UiServerProgram.prototype.onSelectionFinish = oFF.noSupport;
oFF.UiServerProgram.prototype.onSuggestionSelect = oFF.noSupport;
oFF.UiServerProgram.prototype.onTableDragAndDrop = oFF.noSupport;
oFF.UiServerProgram.prototype.onTerminate = oFF.noSupport;
oFF.UiServerProgram.prototype.onToggle = oFF.noSupport;
oFF.UiServerProgram.prototype.onValueHelpRequest = oFF.noSupport;
oFF.UiServerProgram.prototype.processFragmentCfgs = function()
{
	if (this.m_canProcessFragment && oFF.notNull(this.m_fragmentCfgList) && this.m_fragmentCfgList.hasElements())
	{
		for (let k = 0; k < this.m_fragmentCfgList.size(); k++)
		{
			let startCfg = this.m_fragmentCfgList.get(k);
			startCfg.setParentProcess(this.m_uiProgram.getProcess());
			startCfg.setIsNewConsoleNeeded(true);
			startCfg.setIsCreatingChildProcess(true);
			this.m_kernel.startPrg(startCfg, oFF.SyncType.NON_BLOCKING, null);
		}
		this.m_fragmentCfgList = null;
		return true;
	}
	return false;
};
oFF.UiServerProgram.prototype.releaseObject = function()
{
	this.m_startTime = oFF.XObjectExt.release(this.m_startTime);
	this.m_uiProgram = oFF.XObjectExt.release(this.m_uiProgram);
	this.m_kernel = oFF.XObjectExt.release(this.m_kernel);
	this.m_application = oFF.XObjectExt.release(this.m_application);
	this.m_initData = null;
	this.m_serverUiDevice = oFF.XObjectExt.release(this.m_serverUiDevice);
	this.m_serverUiFramework = oFF.XObjectExt.release(this.m_serverUiFramework);
	this.m_serverPrgState = oFF.UiServerProgramState.TERMINATED;
	oFF.DfNameObject.prototype.releaseObject.call( this );
};
oFF.UiServerProgram.prototype.setTraceName = function(traceName)
{
	this.m_traceName = traceName;
};
oFF.UiServerProgram.prototype.setupContainer = function(initData, environment)
{
	this.m_serverPrgState = oFF.UiServerProgramState.STARTING;
	this.m_initData = initData;
	this.m_environment = environment;
	let instanceId = this.m_initData.getStringByKeyExt(oFF.UiRemoteProtocol.INSTANCE_ID, oFF.XGuid.getGuid());
	let remoteLocation = this.m_initData.getStringByKey(oFF.UiRemoteProtocol.INIT_REMOTE_LOCATION);
	let programName = this.m_initData.getStringByKey(oFF.UiRemoteProtocol.INIT_PROGRAM_NAME);
	let programContainerTypeName = this.m_initData.getStringByKey(oFF.UiRemoteProtocol.PROGRAM_CONTAINER_TYPE);
	this._setupInternal(instanceId);
	let clientBase = null;
	if (oFF.notNull(remoteLocation))
	{
		clientBase = oFF.XUri.createFromUrl(remoteLocation);
		clientBase.setPath("/");
		clientBase.setQuery(null);
		clientBase.setFragment(null);
	}
	let remotePrgContainerType = oFF.ProgramContainerType.lookup(programContainerTypeName);
	this.m_prgCfgProgramName = programName;
	this.m_prgCfgRemotePrgContainerType = remotePrgContainerType;
	this.m_canProcessFragment = remotePrgContainerType === oFF.ProgramContainerType.STANDALONE;
	oFF.UiFramework.setInstance(this._newServerUiFramework());
	oFF.UiDevice.setInstance(this._newServerDevice());
};
oFF.UiServerProgram.prototype.terminateServerPrg = function()
{
	if (oFF.notNull(this.m_kernel))
	{
		this.m_kernel.unregisterOnEvent(this);
	}
	this.m_serverPrgState = oFF.UiServerProgramState.TERMINATED;
};
oFF.UiServerProgram.prototype.trace = function(request, response)
{
	if (this.m_isTracingEnabled)
	{
		let appTracePath = "${ff_tmp}/spheretraces";
		if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_traceName))
		{
			appTracePath = oFF.XStringUtils.concatenate3(appTracePath, oFF.XFile.SLASH, this.m_traceName);
		}
		let process = this.m_application.getProcess();
		let traceFolder = oFF.XFile.createWithVars(process, appTracePath);
		traceFolder.mkdirs();
		if (this.m_traceIndex === 0)
		{
			traceFolder.deleteChildren();
		}
		let requestPath = oFF.XStringUtils.concatenate4(appTracePath, oFF.XFile.SLASH, oFF.XInteger.convertToString(this.m_traceIndex), ".request.json");
		let responsePath = oFF.XStringUtils.concatenate4(appTracePath, oFF.XFile.SLASH, oFF.XInteger.convertToString(this.m_traceIndex), ".response.json");
		let uiTreePath = oFF.XStringUtils.concatenate4(appTracePath, oFF.XFile.SLASH, oFF.XInteger.convertToString(this.m_traceIndex), ".uitree.json");
		let requestFile = oFF.XFile.createWithVars(process, requestPath);
		let responseFile = oFF.XFile.createWithVars(process, responsePath);
		let uiTreeFile = oFF.XFile.createWithVars(process, uiTreePath);
		let requestContent = oFF.XByteArray.convertFromString(request.toString());
		requestFile.saveByteArray(requestContent);
		let responseContent = oFF.XByteArray.convertFromString(response.toString());
		responseFile.saveByteArray(responseContent);
		let uiTree = this.getProgramServerUiMgr().serializeUiTree();
		let uiTreeJsonString = uiTree.toString();
		let uiTreeContent = oFF.XByteArray.convertFromString(uiTreeJsonString);
		uiTreeFile.saveByteArray(uiTreeContent);
		this.m_traceIndex = this.m_traceIndex + 1;
	}
};
oFF.UiServerProgram.prototype.updateLastActivity = function()
{
	this.m_lastActivity = oFF.XDateTime.create();
};

oFF.SphereClient = function() {};
oFF.SphereClient.prototype = new oFF.DfUiProgram();
oFF.SphereClient.prototype._ff_c = "SphereClient";

oFF.SphereClient.DEBUG_VERBOSE = false;
oFF.SphereClient.DEFAULT_LOCATION = "http://localhost:3030";
oFF.SphereClient.DEFAULT_PROGRAM_NAME = "SphereClient";
oFF.SphereClient.DEFAULT_WEBWORKER_LOCATION = "webworker://";
oFF.SphereClient.MISMATCH_PROTOCOL_VER_MSG = "Ui remote client <-> server version mismatch! Might cause unexpected issues!";
oFF.SphereClient.PARAM_INIT_ARGS_STRING = "initArgsString";
oFF.SphereClient.PARAM_LOCATION = "location";
oFF.SphereClient.PARAM_PROGRAM = "program";
oFF.SphereClient.PARAM_WEBWORKER = "webworker";
oFF.SphereClient.REMOTE_SYSTEM_NAME = "remote";
oFF.SphereClient.SPHERE_CLIENT_ARGUMENTS_KEY = "arguments";
oFF.SphereClient.SPHERE_CLIENT_PROGRAM_NAME_KEY = "programName";
oFF.SphereClient.SPHERE_CLIENT_REMOTE_SERVER_KEY = "remoteServer";
oFF.SphereClient.SPHERE_CLIENT_TRACE_NAME_KEY = "traceName";
oFF.SphereClient.createRunner = function()
{
	let runner = oFF.KernelBoot.createByName(oFF.SphereClient.DEFAULT_PROGRAM_NAME);
	return runner;
};
oFF.SphereClient.prototype.m_clientStarted = false;
oFF.SphereClient.prototype.m_clientToServerMap = null;
oFF.SphereClient.prototype.m_didAutoStart = false;
oFF.SphereClient.prototype.m_errorDetailsLbl = null;
oFF.SphereClient.prototype.m_getSrvInfoBtn = null;
oFF.SphereClient.prototype.m_instanceId = null;
oFF.SphereClient.prototype.m_isRemoteProgramRunning = false;
oFF.SphereClient.prototype.m_locationUri = null;
oFF.SphereClient.prototype.m_mainLayout = null;
oFF.SphereClient.prototype.m_passiveValues = null;
oFF.SphereClient.prototype.m_prgInitArgsInput = null;
oFF.SphereClient.prototype.m_prgInitArgsString = null;
oFF.SphereClient.prototype.m_programComboBox = null;
oFF.SphereClient.prototype.m_programName = null;
oFF.SphereClient.prototype.m_remoteLocation = null;
oFF.SphereClient.prototype.m_remoteServerInput = null;
oFF.SphereClient.prototype.m_remoteTraceName = null;
oFF.SphereClient.prototype.m_serverToClientMap = null;
oFF.SphereClient.prototype.m_startBtn = null;
oFF.SphereClient.prototype.m_statusMessageLbl = null;
oFF.SphereClient.prototype.m_syncTimerId = null;
oFF.SphereClient.prototype.m_traceNameInput = null;
oFF.SphereClient.prototype.m_webworkerMode = false;
oFF.SphereClient.prototype._addAssociationSyncOperation = function(eventList, uiContext, assocaitionDef, newElement)
{
	if (oFF.isNull(eventList) || oFF.isNull(uiContext) || oFF.isNull(assocaitionDef))
	{
		throw oFF.XException.createRuntimeException("Missing required object! Cannot proceed with association sync!");
	}
	let assocationSyncList = eventList.addNewList();
	this._addOperation(assocationSyncList, oFF.UiRemoteProtocol.EV_ON_ASSOCIATION_SYNC, uiContext);
	assocationSyncList.addString(assocaitionDef.getName());
	if (oFF.notNull(newElement))
	{
		assocationSyncList.addString(this.lookupServerId(newElement.getId()));
	}
	else
	{
		assocationSyncList.addString(null);
	}
};
oFF.SphereClient.prototype._addControlRef = function(paramList, control)
{
	let theId = null;
	let theName = null;
	if (oFF.notNull(control))
	{
		theId = control.getId();
		theId = this.lookupServerId(theId);
		theName = control.getName();
	}
	paramList.addString(theId);
	paramList.addString(theName);
};
oFF.SphereClient.prototype._addIntegrityCheckToRequest = function(requestJson)
{
	let integrityCheck = requestJson.putNewStructure(oFF.UiRemoteProtocol.INTEGRITY_CHECK);
	integrityCheck.putInteger(oFF.UiRemoteProtocol.TOTAL_UI_ELEMENTS, this.getUiManager().getElementRegistrySize());
	integrityCheck.putString(oFF.UiRemoteProtocol.PROTOCOL_VERSION, oFF.UiRemoteProtocol.REMOTE_UI_VERSION);
};
oFF.SphereClient.prototype._addOperation = function(paramList, opName, control)
{
	paramList.addString(opName);
	this._addControlRef(paramList, control);
};
oFF.SphereClient.prototype._addPropertySyncOperation = function(eventList, uiContext, property)
{
	if (oFF.isNull(eventList) || oFF.isNull(uiContext) || oFF.isNull(property))
	{
		throw oFF.XException.createRuntimeException("Missing required object! Cannot proceed with property sync!");
	}
	let propSyncList = eventList.addNewList();
	this._addOperation(propSyncList, oFF.UiRemoteProtocol.EV_ON_PROPERTY_SYNC, uiContext);
	propSyncList.addString(property.getName());
	return propSyncList;
};
oFF.SphereClient.prototype._autoStart = function()
{
	this.m_didAutoStart = true;
	this._runRemoteProgram();
};
oFF.SphereClient.prototype._cleanupAllServerControlsIfNeeded = function()
{
	if (oFF.notNull(this.m_serverToClientMap) && this.m_serverToClientMap.hasElements())
	{
		this.m_serverToClientMap.remove(oFF.UiRemoteProtocol.REMOTE_ROOT_ANCHOR_ID);
		oFF.XCollectionUtils.releaseEntriesFromCollection(this.m_serverToClientMap);
		this.m_serverToClientMap.clear();
	}
};
oFF.SphereClient.prototype._cleanupControlMappingAfterRelease = function(contextName)
{
	this.m_serverToClientMap.remove(contextName);
	let mappedClientId = null;
	let keysIterator = this.m_clientToServerMap.getKeysAsIterator();
	while (keysIterator.hasNext())
	{
		let tmpKey = keysIterator.next();
		let tmpValue = this.m_clientToServerMap.getByKey(tmpKey);
		if (oFF.XString.isEqual(contextName, tmpValue))
		{
			mappedClientId = tmpKey;
			break;
		}
	}
	this.m_clientToServerMap.remove(mappedClientId);
};
oFF.SphereClient.prototype._closeClientServerMismatchWarningIfNeeded = function()
{
	let clientContainer = this.getGenesis().getAnchor();
	if (oFF.notNull(clientContainer) && clientContainer.getUiType() === oFF.UiType.PAGE)
	{
		clientContainer.setFooter(null);
		clientContainer.setFloatingFooter(false);
	}
};
oFF.SphereClient.prototype._collectPassiveValues = function()
{
	let element;
	let storageId;
	this.m_passiveValues = oFF.XProperties.create();
	let capabilityName = null;
	let select = null;
	capabilityName = oFF.UiType._SUPPORTS_COMMAND_HISTORY_CHANGE;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		while (select.hasNext())
		{
			element = select.next();
			storageId = this._createStorageId(element.getId(), capabilityName);
			let commandsStr = oFF.UiRemoteUtils.serializeStringList(element.getCommandHistory());
			this.m_passiveValues.putString(storageId, commandsStr);
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_FIRST_VISIBLE_ROW_CHANGE;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		let firstVisibleRow;
		while (select.hasNext())
		{
			element = select.next();
			firstVisibleRow = element.getFirstVisibleRow();
			if (oFF.notNull(firstVisibleRow))
			{
				storageId = this._createStorageId(element.getId(), capabilityName);
				this.m_passiveValues.putString(storageId, firstVisibleRow.getId());
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_NAVIGATION_PAGES_CHANGE;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		while (select.hasNext())
		{
			element = select.next();
			let navPagesIds = this._createControlIdsStringFromList(element.getPages());
			storageId = this._createStorageId(element.getId(), capabilityName);
			this.m_passiveValues.putString(storageId, navPagesIds);
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_SELECTED_ITEM;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		let item;
		while (select.hasNext())
		{
			element = select.next();
			item = element.getSelectedItem();
			if (oFF.notNull(item))
			{
				storageId = this._createStorageId(element.getId(), capabilityName);
				this.m_passiveValues.putString(storageId, item.getId());
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_SELECTED_ITEMS;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		while (select.hasNext())
		{
			element = select.next();
			let selectedItems = element.getSelectedItems();
			let selectedIds = this._createControlIdsStringFromList(selectedItems);
			storageId = this._createStorageId(element.getId(), capabilityName);
			this.m_passiveValues.putString(storageId, selectedIds);
		}
	}
};
oFF.SphereClient.prototype._createControlIdsStringFromList = function(controlList)
{
	if (oFF.isNull(controlList) || controlList.isEmpty())
	{
		return null;
	}
	let controlIdsBuffer = oFF.XStringBuffer.create();
	for (let a = 0; a < controlList.size(); a++)
	{
		let tmpControl = controlList.get(a);
		if (a > 0)
		{
			controlIdsBuffer.append(oFF.UiRemoteProtocol.MULTI_ITEM_SEPARATOR);
		}
		controlIdsBuffer.append(this.lookupServerId(tmpControl.getId()));
	}
	return controlIdsBuffer.toString();
};
oFF.SphereClient.prototype._createFormInput = function(layout, text, name, value, placeholder)
{
	let formLineLayout = this._createFormLine(layout, text);
	let tmpInput = formLineLayout.addNewItemOfType(oFF.UiType.INPUT);
	tmpInput.setName(name);
	tmpInput.setPlaceholder(placeholder);
	tmpInput.setValue(value);
	tmpInput.registerOnEnter(oFF.UiLambdaEnterListener.create((controlEvent) => {
		this._manualStart();
	}));
	return tmpInput;
};
oFF.SphereClient.prototype._createFormLine = function(layout, text)
{
	let wrapperLayout = layout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	wrapperLayout.setWidth(oFF.UiCssLength.create("100%"));
	wrapperLayout.setDirection(oFF.UiFlexDirection.ROW);
	wrapperLayout.setWrap(oFF.UiFlexWrap.NO_WRAP);
	let inputLabel = wrapperLayout.addNewItemOfType(oFF.UiType.LABEL);
	inputLabel.setWidth(oFF.UiCssLength.create("200px"));
	inputLabel.setText(text);
	return wrapperLayout;
};
oFF.SphereClient.prototype._createProgramComboBox = function(layout)
{
	let formLineLayout = this._createFormLine(layout, "Program: ");
	let tmpComboBox = formLineLayout.addNewItemOfType(oFF.UiType.COMBO_BOX);
	tmpComboBox.setName("ScProgramNameInput");
	tmpComboBox.setPlaceholder("Program");
	tmpComboBox.setWidth(oFF.UiCssLength.create("100%"));
	tmpComboBox.registerOnEnter(oFF.UiLambdaEnterListener.create((controlEvent) => {
		this._manualStart();
	}));
	let allPrograms = oFF.ProgramRegistry.getOrderedAllEntries().getIterator();
	while (allPrograms.hasNext())
	{
		let tmpPrgManifest = allPrograms.next();
		if (tmpPrgManifest.getOutputContainerType() !== oFF.ProgramContainerType.CONSOLE && tmpPrgManifest.getOutputContainerType() !== oFF.ProgramContainerType.NONE && oFF.XString.isEqual(tmpPrgManifest.getProgramName(), oFF.SphereClient.DEFAULT_PROGRAM_NAME) === false)
		{
			let newItem = tmpComboBox.addNewItem();
			newItem.setName(tmpPrgManifest.getProgramName());
			if (oFF.XStringUtils.isNotNullAndNotEmpty(tmpPrgManifest.getDescription()))
			{
				newItem.setText(oFF.XStringUtils.concatenate3(tmpPrgManifest.getProgramName(), " - ", tmpPrgManifest.getDescription()));
			}
			else
			{
				newItem.setText(tmpPrgManifest.getProgramName());
			}
		}
	}
	tmpComboBox.setSelectedName(this.m_programName);
	return tmpComboBox;
};
oFF.SphereClient.prototype._createRunningContainerTable = function(runningContainersList)
{
	let runningContainersTable = this.getGenesis().newControl(oFF.UiType.RESPONSIVE_TABLE);
	runningContainersTable.setBorderStyle(oFF.UiBorderStyle.SOLID);
	runningContainersTable.setBorderColor(oFF.UiColor.GREY);
	runningContainersTable.setBorderWidth(oFF.UiCssBoxEdges.create("1px"));
	runningContainersTable.setNoDataText("No running containers!");
	runningContainersTable.addNewResponsiveTableColumn().setWidth(oFF.UiCssLength.create("auto")).setNewHeader(oFF.UiType.LABEL).setText("InstanceId");
	runningContainersTable.addNewResponsiveTableColumn().setWidth(oFF.UiCssLength.create("130px")).setNewHeader(oFF.UiType.LABEL).setText("Program name");
	runningContainersTable.addNewResponsiveTableColumn().setWidth(oFF.UiCssLength.create("70px")).setNewHeader(oFF.UiType.LABEL).setText("Style");
	runningContainersTable.addNewResponsiveTableColumn().setWidth(oFF.UiCssLength.create("110px")).setNewHeader(oFF.UiType.LABEL).setText("Started");
	runningContainersTable.addNewResponsiveTableColumn().setWidth(oFF.UiCssLength.create("110px")).setNewHeader(oFF.UiType.LABEL).setText("Last activity");
	runningContainersTable.setSelectionMode(oFF.UiSelectionMode.NONE);
	if (oFF.notNull(runningContainersList))
	{
		oFF.XCollectionUtils.forEach(runningContainersList, (containerInfoStruct) => {
			if (containerInfoStruct.isStructure())
			{
				let tmpStruct = containerInfoStruct.asStructure();
				let instanceId = tmpStruct.getStringByKey(oFF.UiRemoteProtocol.INSTANCE_ID);
				let prgName = tmpStruct.getStringByKey(oFF.UiRemoteProtocol.PROGRAM_NAME);
				let styleClassStr = tmpStruct.getStringByKey(oFF.UiRemoteProtocol.STYLE_CLASS);
				let startTimeMillis = tmpStruct.getLongByKey(oFF.UiRemoteProtocol.START_TIME);
				let lastActivityMillis = tmpStruct.getLongByKey(oFF.UiRemoteProtocol.LAST_ACTIVITY);
				let startTimeStr = this._getElapsedStringFromMillis(startTimeMillis, true);
				let lastActivityStr = this._getElapsedStringFromMillis(lastActivityMillis, true);
				let tmpResponsiveRow = runningContainersTable.addNewResponsiveTableRow();
				tmpResponsiveRow.addNewResponsiveTableCell().setText(instanceId).setTooltip(instanceId);
				tmpResponsiveRow.addNewResponsiveTableCell().setText(prgName).setTooltip(prgName);
				tmpResponsiveRow.addNewResponsiveTableCell().setText(styleClassStr).setTooltip(styleClassStr);
				tmpResponsiveRow.addNewResponsiveTableCell().setText(startTimeStr).setTooltip(startTimeStr);
				tmpResponsiveRow.addNewResponsiveTableCell().setText(lastActivityStr).setTooltip(lastActivityStr);
			}
		});
	}
	return runningContainersTable;
};
oFF.SphereClient.prototype._createSrvProgramsList = function(srvProgramList)
{
	let prgList = this.getGenesis().newControl(oFF.UiType.LIST);
	prgList.setMaxHeight(oFF.UiCssLength.create("200px"));
	prgList.useMaxWidth();
	prgList.setSelectionMode(oFF.UiSelectionMode.NONE);
	prgList.setOverflow(oFF.UiOverflow.AUTO);
	if (oFF.notNull(srvProgramList))
	{
		oFF.XCollectionUtils.forEach(srvProgramList, (prgInfoStruct) => {
			if (prgInfoStruct.isStructure())
			{
				let tmpStruct = prgInfoStruct.asStructure();
				let prgName = tmpStruct.getStringByKey(oFF.UiRemoteProtocol.PROGRAM_NAME);
				let prgDesc = tmpStruct.getStringByKey(oFF.UiRemoteProtocol.PROGRAM_DESCRIPTION);
				let prgDevStr = tmpStruct.getStringByKey(oFF.UiRemoteProtocol.PROGRAM_CONTAINER_TYPE);
				let listItemText = oFF.XStringUtils.concatenate4(prgName, " [", prgDesc, "]");
				listItemText = oFF.XStringUtils.concatenate4(listItemText, " (", oFF.XString.substring(prgDevStr, 0, 1), ")");
				let newListItem = prgList.addNewItem();
				newListItem.setText(listItemText);
			}
		});
	}
	return prgList;
};
oFF.SphereClient.prototype._createStorageId = function(elementId, capabilityName)
{
	return oFF.XStringUtils.concatenate3(elementId, "_", capabilityName);
};
oFF.SphereClient.prototype._doIntergrityCheck = function(serverJson) {};
oFF.SphereClient.prototype._executeCheckInitializeStatusRequest = function()
{
	if (this.m_clientStarted)
	{
		let ocpFunction = this._prepareFunction(oFF.UiRemoteAction.CHECK_INITIALIZE_STATUS, this.m_instanceId);
		ocpFunction.processFunctionExecution(oFF.SyncType.NON_BLOCKING, this, null);
	}
};
oFF.SphereClient.prototype._executeCheckStatusRequest = function()
{
	let ocpFunction = this._prepareFunction(oFF.UiRemoteAction.CHECK_STATUS, this.m_instanceId);
	ocpFunction.processFunctionExecution(oFF.SyncType.NON_BLOCKING, oFF.UiLambdaFunctionExecutedListener.create((extResult) => {
		if (extResult.isValid())
		{
			let jsonContent = extResult.getData().getRootElement();
			if (oFF.notNull(jsonContent))
			{
				let remoteProgramStatus = jsonContent.getStringByKey(oFF.UiRemoteProtocol.REMOTE_PROGRAM_STATUS);
				this.getGenesis().showSuccessToast(remoteProgramStatus);
			}
		}
		else
		{
			this.getGenesis().showErrorToast("Check status request failed! No response from server!");
		}
	}), null);
};
oFF.SphereClient.prototype._executeGetServerInfo = function()
{
	this._prepareRemoteUiSystemLandscape(this.m_remoteLocation);
	let ocpFunction = this._prepareFunction(oFF.UiRemoteAction.GET_SERVER_INFO, null);
	ocpFunction.processFunctionExecution(oFF.SyncType.NON_BLOCKING, oFF.UiLambdaFunctionExecutedListener.create((extResult) => {
		this.m_getSrvInfoBtn.setEnabled(true);
		if (extResult.isValid())
		{
			let jsonContent = extResult.getData().getRootElement();
			if (oFF.notNull(jsonContent))
			{
				this._processGetServerInfoResponse(jsonContent);
			}
		}
		else
		{
			this.getGenesis().showErrorToast("Get server info failed! No response from server!");
		}
	}), null);
};
oFF.SphereClient.prototype._executeInitializeRequest = function(prgName, argsString, traceName)
{
	this._reInitClient();
	let ocpFunction = this._prepareFunction(oFF.UiRemoteAction.INITIALIZE, null);
	let initStruct = this._prepareIntegrityRequest(ocpFunction);
	initStruct.put(oFF.UiRemoteProtocol.INIT_DATA, this._getInitData(prgName, argsString, traceName));
	ocpFunction.processFunctionExecution(oFF.SyncType.NON_BLOCKING, this, null);
};
oFF.SphereClient.prototype._executeSyncRequest = function()
{
	if (this.m_clientStarted)
	{
		let ocpFunction = this._prepareFunction(oFF.UiRemoteAction.SYNC, this.m_instanceId);
		let singleEvent = this._prepareSingleEvent(ocpFunction);
		singleEvent.addString(oFF.UiRemoteProtocol.EV_ON_SIT_AND_WAIT);
		ocpFunction.processFunctionExecution(oFF.SyncType.NON_BLOCKING, this, null);
	}
};
oFF.SphereClient.prototype._executeTerminateRequest = function(instanceId, isFireAndForget, listener)
{
	let ocpFunction = this._prepareFunction(oFF.UiRemoteAction.TERMINATE, instanceId);
	ocpFunction.getRpcRequest().setIsFireAndForgetCall(isFireAndForget);
	let terminateStruct = this._prepareIntegrityRequest(ocpFunction);
	terminateStruct.putString(oFF.UiRemoteProtocol.INSTANCE_ID, instanceId);
	ocpFunction.processFunctionExecution(oFF.SyncType.NON_BLOCKING, listener, null);
};
oFF.SphereClient.prototype._getDefaultRemoteServerUrl = function()
{
	if (this._isWebWorkerEnabled())
	{
		return oFF.SphereClient.DEFAULT_WEBWORKER_LOCATION;
	}
	let tmpRemoteUri = oFF.NetworkEnv.getLocation();
	if (oFF.notNull(tmpRemoteUri))
	{
		let adapted = oFF.XUri.createFromOther(tmpRemoteUri);
		if (oFF.notNull(adapted))
		{
			adapted.setPath(null);
			adapted.setQuery(null);
			adapted.setFragment(null);
			return adapted.getUrl();
		}
	}
	return oFF.SphereClient.DEFAULT_LOCATION;
};
oFF.SphereClient.prototype._getElapsedStringFromMillis = function(startMillis, shortStyle)
{
	let elapsedStr = "";
	let currentTime = oFF.XDateTime.create();
	let timeDiffMinutes = oFF.XDouble.convertToInt((currentTime.getMilliseconds() - startMillis) / 1000 / 60);
	let timeDiffHours = oFF.XDouble.convertToInt(timeDiffMinutes / 60);
	let leftMinutes = oFF.XMath.mod(timeDiffMinutes, 60);
	if (leftMinutes === 0 && timeDiffHours === 0)
	{
		elapsedStr = "just now";
	}
	else if (shortStyle)
	{
		elapsedStr = oFF.XStringUtils.concatenate4(oFF.XInteger.convertToString(timeDiffHours), "h ", oFF.XInteger.convertToString(leftMinutes), "m ago");
	}
	else
	{
		elapsedStr = oFF.XStringUtils.concatenate4(oFF.XInteger.convertToString(timeDiffHours), " hours ", oFF.XInteger.convertToString(leftMinutes), " minutes ago");
	}
	return elapsedStr;
};
oFF.SphereClient.prototype._getInitData = function(programName, prgInitArgsString, traceName)
{
	let initDataStruct = oFF.PrFactory.createStructure();
	let location = oFF.NetworkEnv.getLocation();
	initDataStruct.putString(oFF.UiRemoteProtocol.INIT_REMOTE_LOCATION, oFF.notNull(location) ? location.getUrl() : oFF.SphereClient.DEFAULT_LOCATION);
	let fragment = oFF.NetworkEnv.getFragment();
	initDataStruct.putString(oFF.UiRemoteProtocol.FRAGMENT, fragment);
	if (oFF.notNull(programName))
	{
		initDataStruct.putString(oFF.UiRemoteProtocol.INIT_PROGRAM_NAME, programName);
	}
	if (oFF.notNull(prgInitArgsString))
	{
		initDataStruct.putString(oFF.UiRemoteProtocol.INIT_ARGS_STRING, prgInitArgsString);
	}
	if (oFF.notNull(traceName))
	{
		initDataStruct.putString(oFF.UiRemoteProtocol.INIT_TRACE_NAME, traceName);
	}
	let prgContainerType = this.getResolvedProgramContainerType();
	if (oFF.notNull(prgContainerType))
	{
		initDataStruct.putString(oFF.UiRemoteProtocol.PROGRAM_CONTAINER_TYPE, prgContainerType.getName());
	}
	let variableNames = oFF.XEnvironment.getInstance().getVariableNames();
	let iterator = variableNames.getIterator();
	while (iterator.hasNext())
	{
		let key = iterator.next();
		let value = oFF.XEnvironment.getInstance().getVariable(key);
		if (oFF.XString.isEqual(oFF.XString.toLowerCase(oFF.UiRemoteProtocol.INIT_PROGRAM_NAME), key))
		{
			initDataStruct.putString(oFF.UiRemoteProtocol.INIT_PROGRAM_NAME, value);
		}
		else if (oFF.XString.isEqual(oFF.XString.toLowerCase(oFF.UiRemoteProtocol.STYLE_CLASS), oFF.XString.toLowerCase(key)))
		{
			initDataStruct.putString(oFF.UiRemoteProtocol.STYLE_CLASS, value);
		}
		else
		{
			initDataStruct.putString(key, value);
		}
	}
	initDataStruct.putString(oFF.UiRemoteProtocol.INIT_PLATFORM, this.getUiManager().getPlatform().getName());
	initDataStruct.putString(oFF.UiRemoteProtocol.INIT_DEVICE_INFO, this.getUiManager().getDeviceInfo().serialize());
	initDataStruct.putString(oFF.UiRemoteProtocol.INIT_DRIVER_INFO, this.getUiManager().getDriverInfo().serialize());
	let uiFrameworkConfig = initDataStruct.putNewStructure(oFF.UiRemoteProtocol.INIT_UI_FRAMEWORK_CONFIG);
	uiFrameworkConfig.putBoolean(oFF.UiRemoteProtocol.CLIENT_RTL, this.getUiManager().isRtl());
	let uiTypeDefs = initDataStruct.putNewStructure(oFF.UiRemoteProtocol.INIT_UI_TYPE_DEFS);
	let allUiTypes = oFF.UiType.getAllUiTypesIterator();
	while (allUiTypes.hasNext())
	{
		let uiType = allUiTypes.next();
		let simpleFlags = uiType.getCapabilityFlags();
		if (oFF.notNull(simpleFlags))
		{
			let name = uiType.getName();
			let typeInfos = uiTypeDefs.putNewStructure(name);
			let simpleFlagList = typeInfos.putNewList(oFF.UiRemoteProtocol.CAPABILITY_FLAGS);
			let flagIterator = simpleFlags.getIterator();
			while (flagIterator.hasNext())
			{
				simpleFlagList.addString(flagIterator.next());
			}
		}
	}
	return initDataStruct;
};
oFF.SphereClient.prototype._handleAsyncOperation = function(op, actionUuid, uiContext, operation, offset)
{
	op.executeAsyncOperation(this, uiContext, operation, offset).onThen((result) => {
		this._sendAsyncActionResult(actionUuid, oFF.UiRemoteAsyncActionState.FULFILLED, result);
	}).onCatch((error) => {
		this._sendAsyncActionResult(actionUuid, oFF.UiRemoteAsyncActionState.REJECTED, error.getText());
	});
};
oFF.SphereClient.prototype._handleSyncOperation = function(op, retContextName, uiContext, operation, offset)
{
	let returnObj = op.executeOperation(this, uiContext, operation, offset);
	if (oFF.notNull(returnObj) && oFF.XStringUtils.isNotNullAndNotEmpty(retContextName) && returnObj.isReleased() === false)
	{
		let componentType = returnObj.getComponentType();
		if (componentType.isTypeOf(oFF.XComponentType._UI))
		{
			let uiReturnContext = returnObj;
			this.m_serverToClientMap.put(retContextName, uiReturnContext);
			let uiId = uiReturnContext.getId();
			if (oFF.XString.isEqual(uiId, retContextName) === false)
			{
				this.m_clientToServerMap.put(uiId, retContextName);
			}
		}
	}
	else if (oFF.notNull(returnObj) && oFF.XStringUtils.isNotNullAndNotEmpty(retContextName) && returnObj.isReleased())
	{
		this._cleanupControlMappingAfterRelease(retContextName);
	}
};
oFF.SphereClient.prototype._isWebWorkerEnabled = function()
{
	return this.m_webworkerMode || oFF.notNull(this.m_remoteServerInput) && oFF.XString.containsString(this.m_remoteServerInput.getValue(), "webworker");
};
oFF.SphereClient.prototype._manualStart = function()
{
	this.m_remoteLocation = this.m_remoteServerInput.getValue();
	this.m_programName = this.m_programComboBox.getSelectedItem() !== null ? this.m_programComboBox.getSelectedItem().getName() : null;
	this.m_prgInitArgsString = this.m_prgInitArgsInput.getValue();
	this.m_remoteTraceName = this.m_traceNameInput.getValue();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_remoteLocation) && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_programName))
	{
		this.m_startBtn.setEnabled(false);
		this.m_statusMessageLbl.setVisible(false);
		this.m_errorDetailsLbl.setVisible(false);
		this._runRemoteProgram();
		if (!this.m_didAutoStart)
		{
			this.getProcess().getLocalStorage().putString(oFF.SphereClient.SPHERE_CLIENT_REMOTE_SERVER_KEY, this.m_remoteLocation);
			this.getProcess().getLocalStorage().putString(oFF.SphereClient.SPHERE_CLIENT_PROGRAM_NAME_KEY, this.m_programName);
			this.getProcess().getLocalStorage().putString(oFF.SphereClient.SPHERE_CLIENT_ARGUMENTS_KEY, this.m_prgInitArgsString);
			this.getProcess().getLocalStorage().putString(oFF.SphereClient.SPHERE_CLIENT_TRACE_NAME_KEY, this.m_remoteTraceName);
		}
	}
	else
	{
		this.getGenesis().showWarningToast("Missing program name or remote server location! Cannot start!");
	}
};
oFF.SphereClient.prototype._passiveValueTransfer = function(eventList)
{
	let changedValueTransfer;
	changedValueTransfer = eventList.addNewList();
	changedValueTransfer.addString(oFF.UiRemoteProtocol.EV_ON_TRANSFER_START);
	let theId;
	let element;
	let item;
	let storageId;
	let capabilityName = null;
	let select = null;
	capabilityName = oFF.UiType._SUPPORTS_COMMAND_HISTORY_CHANGE;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		let newCommandHistory;
		let oldCommandHistory;
		while (select.hasNext())
		{
			element = select.next();
			storageId = this._createStorageId(element.getId(), capabilityName);
			newCommandHistory = oFF.UiRemoteUtils.serializeStringList(element.getCommandHistory());
			oldCommandHistory = this.m_passiveValues.getStringByKeyExt(storageId, "");
			if (oFF.XString.isEqual(newCommandHistory, oldCommandHistory) === false)
			{
				changedValueTransfer = eventList.addNewList();
				this._addOperation(changedValueTransfer, oFF.UiRemoteProtocol.EV_ON_CHANGED_VALUE, element);
				changedValueTransfer.addString(oFF.UiProperty.COMMAND_HISTORY.getSetterMethodName());
				changedValueTransfer.addString(newCommandHistory);
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_FIRST_VISIBLE_ROW_CHANGE;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		let newFirstVisibleRowId;
		let oldFirstVisibleRowId;
		while (select.hasNext())
		{
			element = select.next();
			storageId = this._createStorageId(element.getId(), capabilityName);
			let firstVisibleRow = element.getFirstVisibleRow();
			if (oFF.notNull(firstVisibleRow))
			{
				newFirstVisibleRowId = firstVisibleRow.getId();
				oldFirstVisibleRowId = this.m_passiveValues.getStringByKey(storageId);
				if (oFF.XString.isEqual(newFirstVisibleRowId, oldFirstVisibleRowId) === false)
				{
					changedValueTransfer = eventList.addNewList();
					this._addOperation(changedValueTransfer, oFF.UiRemoteProtocol.EV_ON_CHANGED_VALUE, element);
					changedValueTransfer.addString(oFF.UiProperty.FIRST_VISIBLE_ROW.getSetterMethodName());
					theId = newFirstVisibleRowId;
					theId = this.lookupServerId(theId);
					changedValueTransfer.addString(theId);
				}
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_NAVIGATION_PAGES_CHANGE;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		let newNavigationPages;
		let oldNavigationPages;
		while (select.hasNext())
		{
			element = select.next();
			storageId = this._createStorageId(element.getId(), capabilityName);
			newNavigationPages = this._createControlIdsStringFromList(element.getPages());
			oldNavigationPages = this.m_passiveValues.getStringByKey(storageId);
			if (oFF.XString.isEqual(newNavigationPages, oldNavigationPages) === false)
			{
				let newNavPagesList = oFF.XStringTokenizer.splitString(newNavigationPages, oFF.UiRemoteProtocol.MULTI_ITEM_SEPARATOR);
				let oldNavPagesList = oFF.XStringTokenizer.splitString(oldNavigationPages, oFF.UiRemoteProtocol.MULTI_ITEM_SEPARATOR);
				if (oFF.isNull(newNavPagesList))
				{
					newNavPagesList = oFF.XList.create();
				}
				if (oFF.isNull(oldNavPagesList))
				{
					oldNavPagesList = oFF.XList.create();
				}
				if (newNavPagesList.size() < oldNavPagesList.size())
				{
					changedValueTransfer = eventList.addNewList();
					for (let b = 0; b < oldNavPagesList.size(); b++)
					{
						let tmpControlId = oldNavPagesList.get(b);
						if (newNavPagesList.contains(tmpControlId) === false)
						{
							this._addOperation(changedValueTransfer, oFF.UiRemoteProtocol.EV_ON_CHANGED_VALUE, element);
							changedValueTransfer.addString(oFF.UiAggregation.PAGES.getRemoveMethodName());
							changedValueTransfer.addString(tmpControlId);
						}
					}
				}
				this.m_passiveValues.putString(storageId, newNavigationPages);
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_SELECTED_ITEM;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		let newSelectedId;
		let oldSelectedId;
		while (select.hasNext())
		{
			element = select.next();
			storageId = this._createStorageId(element.getId(), capabilityName);
			item = element.getSelectedItem();
			if (oFF.notNull(item))
			{
				newSelectedId = item.getId();
				oldSelectedId = this.m_passiveValues.getStringByKey(storageId);
				if (oFF.XString.isEqual(newSelectedId, oldSelectedId) === false)
				{
					changedValueTransfer = eventList.addNewList();
					this._addOperation(changedValueTransfer, oFF.UiRemoteProtocol.EV_ON_CHANGED_VALUE, element);
					changedValueTransfer.addString(oFF.UiRemoteProtocol.OP_SET_SELECTED_ITEM);
					theId = newSelectedId;
					theId = this.lookupServerId(theId);
					changedValueTransfer.addString(theId);
				}
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_SELECTED_ITEMS;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		while (select.hasNext())
		{
			element = select.next();
			storageId = this._createStorageId(element.getId(), capabilityName);
			let selectedItems = element.getSelectedItems();
			let newSelectedIds = this._createControlIdsStringFromList(selectedItems);
			let oldSelectedIds = this.m_passiveValues.getStringByKey(storageId);
			if (oFF.XString.isEqual(newSelectedIds, oldSelectedIds) === false)
			{
				changedValueTransfer = eventList.addNewList();
				this._addOperation(changedValueTransfer, oFF.UiRemoteProtocol.EV_ON_CHANGED_VALUE, element);
				changedValueTransfer.addString(oFF.UiRemoteProtocol.OP_SET_SELECTED_ITEMS);
				changedValueTransfer.addString(newSelectedIds);
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_ACTIVE_PAGE_CHANGE;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		let newActivePage;
		let oldActivePage;
		while (select.hasNext())
		{
			element = select.next();
			newActivePage = element.getActivePage();
			oldActivePage = element.getAssociationElement(oFF.UiAssociation.ACTIVE_PAGE);
			if (newActivePage !== oldActivePage)
			{
				this._addAssociationSyncOperation(eventList, element, oFF.UiAssociation.ACTIVE_PAGE, newActivePage);
				element.setAssociationElement(oFF.UiAssociation.ACTIVE_PAGE, newActivePage);
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_CHECKED_CHANGE;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		let newChecked;
		let oldChecked;
		while (select.hasNext())
		{
			element = select.next();
			newChecked = element.isChecked();
			oldChecked = element.getBooleanPropertyValue(oFF.UiProperty.CHECKED);
			if (newChecked !== oldChecked)
			{
				changedValueTransfer = this._addPropertySyncOperation(eventList, element, oFF.UiProperty.CHECKED);
				changedValueTransfer.addBoolean(newChecked);
				element.updatePropertyValue(oFF.UiProperty.CHECKED, oFF.XBooleanValue.create(newChecked));
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_PARTIALLY_CHECKED_CHANGE;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		let newPartiallyChecked;
		let oldPartiallyChecked;
		while (select.hasNext())
		{
			element = select.next();
			newPartiallyChecked = element.isPartiallyChecked();
			oldPartiallyChecked = element.getBooleanPropertyValue(oFF.UiProperty.PARTIALLY_CHECKED);
			if (newPartiallyChecked !== oldPartiallyChecked)
			{
				changedValueTransfer = this._addPropertySyncOperation(eventList, element, oFF.UiProperty.PARTIALLY_CHECKED);
				changedValueTransfer.addBoolean(newPartiallyChecked);
				element.updatePropertyValue(oFF.UiProperty.PARTIALLY_CHECKED, oFF.XBooleanValue.create(newPartiallyChecked));
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_ON_CHANGE;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		let newOn;
		let oldOn;
		while (select.hasNext())
		{
			element = select.next();
			newOn = element.isOn();
			oldOn = element.getBooleanPropertyValue(oFF.UiProperty.ON);
			if (newOn !== oldOn)
			{
				changedValueTransfer = this._addPropertySyncOperation(eventList, element, oFF.UiProperty.ON);
				changedValueTransfer.addBoolean(newOn);
				element.updatePropertyValue(oFF.UiProperty.ON, oFF.XBooleanValue.create(newOn));
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_SELECTED_CHANGE;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		let newSelected;
		let oldSelected;
		while (select.hasNext())
		{
			element = select.next();
			newSelected = element.isSelected();
			oldSelected = element.getBooleanPropertyValue(oFF.UiProperty.SELECTED);
			if (newSelected !== oldSelected)
			{
				changedValueTransfer = this._addPropertySyncOperation(eventList, element, oFF.UiProperty.SELECTED);
				changedValueTransfer.addBoolean(newSelected);
				element.updatePropertyValue(oFF.UiProperty.SELECTED, oFF.XBooleanValue.create(newSelected));
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_EXPANDED_CHANGE;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		let newExpanded;
		let oldExpanded;
		while (select.hasNext())
		{
			element = select.next();
			newExpanded = element.isExpanded();
			oldExpanded = element.getBooleanPropertyValue(oFF.UiProperty.EXPANDED);
			if (newExpanded !== oldExpanded)
			{
				changedValueTransfer = this._addPropertySyncOperation(eventList, element, oFF.UiProperty.EXPANDED);
				changedValueTransfer.addBoolean(newExpanded);
				element.updatePropertyValue(oFF.UiProperty.EXPANDED, oFF.XBooleanValue.create(newExpanded));
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_VALUE_CHANGE;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		let newValue;
		let oldValue;
		while (select.hasNext())
		{
			element = select.next();
			newValue = element.getValue();
			oldValue = element.getStringPropertyValue(oFF.UiProperty.VALUE);
			if (oFF.XString.isEqual(newValue, oldValue) === false)
			{
				changedValueTransfer = this._addPropertySyncOperation(eventList, element, oFF.UiProperty.VALUE);
				changedValueTransfer.addString(newValue);
				element.updatePropertyValue(oFF.UiProperty.VALUE, oFF.XStringValue.create(newValue));
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_SLIDER_VALUE_CHANGE;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		let newSliderValue;
		let oldSliderValue;
		while (select.hasNext())
		{
			element = select.next();
			newSliderValue = element.getSliderValue();
			oldSliderValue = element.getIntegerPropertyValue(oFF.UiProperty.SLIDER_VALUE);
			if (newSliderValue !== oldSliderValue)
			{
				changedValueTransfer = this._addPropertySyncOperation(eventList, element, oFF.UiProperty.SLIDER_VALUE);
				changedValueTransfer.addInteger(newSliderValue);
				element.updatePropertyValue(oFF.UiProperty.SLIDER_VALUE, oFF.XIntegerValue.create(newSliderValue));
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_RANGE_SLIDER_VALUE_CHANGE;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		let newSliderUpperValue;
		let oldSliderUpperValue;
		while (select.hasNext())
		{
			element = select.next();
			newSliderUpperValue = element.getSliderUpperValue();
			oldSliderUpperValue = element.getIntegerPropertyValue(oFF.UiProperty.SLIDER_UPPER_VALUE);
			if (newSliderUpperValue !== oldSliderUpperValue)
			{
				changedValueTransfer = this._addPropertySyncOperation(eventList, element, oFF.UiProperty.SLIDER_UPPER_VALUE);
				changedValueTransfer.addInteger(newSliderUpperValue);
				element.updatePropertyValue(oFF.UiProperty.SLIDER_UPPER_VALUE, oFF.XIntegerValue.create(newSliderUpperValue));
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_START_DATE_CHANGE;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		let newStartDate;
		let oldStartDate;
		while (select.hasNext())
		{
			element = select.next();
			newStartDate = element.getStartDate();
			oldStartDate = element.getStringPropertyValue(oFF.UiProperty.START_DATE);
			if (oFF.XString.isEqual(newStartDate, oldStartDate) === false)
			{
				changedValueTransfer = this._addPropertySyncOperation(eventList, element, oFF.UiProperty.START_DATE);
				changedValueTransfer.addString(newStartDate);
				element.updatePropertyValue(oFF.UiProperty.START_DATE, oFF.XStringValue.create(newStartDate));
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_END_DATE_CHANGE;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		let newEndDate;
		let oldEndDate;
		while (select.hasNext())
		{
			element = select.next();
			newEndDate = element.getEndDate();
			oldEndDate = element.getStringPropertyValue(oFF.UiProperty.END_DATE);
			if (oFF.XString.isEqual(newEndDate, oldEndDate) === false)
			{
				changedValueTransfer = this._addPropertySyncOperation(eventList, element, oFF.UiProperty.END_DATE);
				changedValueTransfer.addString(newEndDate);
				element.updatePropertyValue(oFF.UiProperty.END_DATE, oFF.XStringValue.create(newEndDate));
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_PRESSED_CHANGE;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		let newPressed;
		let oldPressed;
		while (select.hasNext())
		{
			element = select.next();
			newPressed = element.isPressed();
			oldPressed = element.getBooleanPropertyValue(oFF.UiProperty.PRESSED);
			if (newPressed !== oldPressed)
			{
				changedValueTransfer = this._addPropertySyncOperation(eventList, element, oFF.UiProperty.PRESSED);
				changedValueTransfer.addBoolean(newPressed);
				element.updatePropertyValue(oFF.UiProperty.PRESSED, oFF.XBooleanValue.create(newPressed));
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_OPEN_CHANGE;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		let newIsOpen;
		let oldIsOpen;
		while (select.hasNext())
		{
			element = select.next();
			newIsOpen = element.isOpen();
			oldIsOpen = element.getBooleanPropertyValue(oFF.UiProperty.OPEN);
			if (newIsOpen !== oldIsOpen)
			{
				changedValueTransfer = this._addPropertySyncOperation(eventList, element, oFF.UiProperty.OPEN);
				changedValueTransfer.addBoolean(newIsOpen);
				element.updatePropertyValue(oFF.UiProperty.OPEN, oFF.XBooleanValue.create(newIsOpen));
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_MAXIMIZED_CHANGE;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		let newIsMaximized;
		let oldIsMaximized;
		while (select.hasNext())
		{
			element = select.next();
			newIsMaximized = element.isMaximized();
			oldIsMaximized = element.getBooleanPropertyValue(oFF.UiProperty.MAXIMIZED);
			if (newIsMaximized !== oldIsMaximized)
			{
				changedValueTransfer = this._addPropertySyncOperation(eventList, element, oFF.UiProperty.MAXIMIZED);
				changedValueTransfer.addBoolean(newIsMaximized);
				element.updatePropertyValue(oFF.UiProperty.MAXIMIZED, oFF.XBooleanValue.create(newIsMaximized));
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_HIDDEN_CHANGE;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		let newIsHidden;
		let oldIsHidden;
		while (select.hasNext())
		{
			element = select.next();
			newIsHidden = element.isHidden();
			oldIsHidden = element.getBooleanPropertyValue(oFF.UiProperty.HIDDEN);
			if (newIsHidden !== oldIsHidden)
			{
				changedValueTransfer = this._addPropertySyncOperation(eventList, element, oFF.UiProperty.HIDDEN);
				changedValueTransfer.addBoolean(newIsHidden);
				element.updatePropertyValue(oFF.UiProperty.HIDDEN, oFF.XBooleanValue.create(newIsHidden));
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_OFFSET_HEIGHT_CHANGE;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		let newOffsetHeight;
		let oldOffsetHeight;
		while (select.hasNext())
		{
			element = select.next();
			newOffsetHeight = element.getOffsetHeight();
			oldOffsetHeight = element.getIntegerPropertyValue(oFF.UiProperty.OFFSET_HEIGHT);
			if (newOffsetHeight !== oldOffsetHeight)
			{
				changedValueTransfer = this._addPropertySyncOperation(eventList, element, oFF.UiProperty.OFFSET_HEIGHT);
				changedValueTransfer.addInteger(newOffsetHeight);
				element.updatePropertyValue(oFF.UiProperty.OFFSET_HEIGHT, oFF.XIntegerValue.create(newOffsetHeight));
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_OFFSET_WIDTH_CHANGE;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		let newOffsetWidth;
		let oldOffsetWidth;
		while (select.hasNext())
		{
			element = select.next();
			newOffsetWidth = element.getOffsetWidth();
			oldOffsetWidth = element.getIntegerPropertyValue(oFF.UiProperty.OFFSET_WIDTH);
			if (newOffsetWidth !== oldOffsetWidth)
			{
				changedValueTransfer = this._addPropertySyncOperation(eventList, element, oFF.UiProperty.OFFSET_WIDTH);
				changedValueTransfer.addInteger(newOffsetWidth);
				element.updatePropertyValue(oFF.UiProperty.OFFSET_WIDTH, oFF.XIntegerValue.create(newOffsetWidth));
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_CURSOR_POSITION_CHANGE;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		let newCursorPosition;
		let oldCursorPosition;
		while (select.hasNext())
		{
			element = select.next();
			newCursorPosition = element.getCursorPosition();
			oldCursorPosition = element.getObjectPropertyValue(oFF.UiProperty.CURSOR_POSITION);
			if (oFF.notNull(newCursorPosition) && oFF.notNull(oldCursorPosition) && (newCursorPosition.getRow() !== oldCursorPosition.getRow() || newCursorPosition.getColumn() !== oldCursorPosition.getColumn()) || oFF.notNull(newCursorPosition) && oFF.isNull(oldCursorPosition) || oFF.isNull(newCursorPosition) && oFF.notNull(oldCursorPosition))
			{
				changedValueTransfer = this._addPropertySyncOperation(eventList, element, oFF.UiProperty.CURSOR_POSITION);
				changedValueTransfer.addString(oFF.notNull(newCursorPosition) ? newCursorPosition.serialize() : null);
				element.updatePropertyValue(oFF.UiProperty.CURSOR_POSITION, newCursorPosition);
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_SCROLL_LEFT_CHANGE;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		let newScrollLeft;
		let oldScrollLeft;
		while (select.hasNext())
		{
			element = select.next();
			newScrollLeft = element.getScrollLeft();
			oldScrollLeft = element.getIntegerPropertyValue(oFF.UiProperty.SCROLL_LEFT);
			if (newScrollLeft !== oldScrollLeft)
			{
				changedValueTransfer = this._addPropertySyncOperation(eventList, element, oFF.UiProperty.SCROLL_LEFT);
				changedValueTransfer.addInteger(newScrollLeft);
				element.updatePropertyValue(oFF.UiProperty.SCROLL_LEFT, oFF.XIntegerValue.create(newScrollLeft));
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_SCROLL_TOP_CHANGE;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		let newScrollTop;
		let oldScrollTop;
		while (select.hasNext())
		{
			element = select.next();
			newScrollTop = element.getScrollLeft();
			oldScrollTop = element.getIntegerPropertyValue(oFF.UiProperty.SCROLL_TOP);
			if (newScrollTop !== oldScrollTop)
			{
				changedValueTransfer = this._addPropertySyncOperation(eventList, element, oFF.UiProperty.SCROLL_TOP);
				changedValueTransfer.addInteger(newScrollTop);
				element.updatePropertyValue(oFF.UiProperty.SCROLL_TOP, oFF.XIntegerValue.create(newScrollTop));
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_SELECTED_TEXT_CHANGE;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		let newSelectedText;
		let oldSelectedText;
		while (select.hasNext())
		{
			element = select.next();
			newSelectedText = element.getSelectedText();
			oldSelectedText = element.getStringPropertyValue(oFF.UiProperty.SELECTED_TEXT);
			if (!oFF.XString.isEqual(newSelectedText, oldSelectedText))
			{
				changedValueTransfer = this._addPropertySyncOperation(eventList, element, oFF.UiProperty.SELECTED_TEXT);
				changedValueTransfer.addString(newSelectedText);
				element.updatePropertyValue(oFF.UiProperty.SELECTED_TEXT, oFF.XStringValue.create(newSelectedText));
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_COLOR_STRING_CHANGE;
	select = this._selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		let newColorString;
		let oldColorString;
		while (select.hasNext())
		{
			element = select.next();
			newColorString = element.getColorString();
			oldColorString = element.getStringPropertyValue(oFF.UiProperty.COLOR_STRING);
			if (!oFF.XString.isEqual(newColorString, oldColorString))
			{
				changedValueTransfer = this._addPropertySyncOperation(eventList, element, oFF.UiProperty.COLOR_STRING);
				changedValueTransfer.addString(newColorString);
				element.updatePropertyValue(oFF.UiProperty.COLOR_STRING, oFF.XStringValue.create(newColorString));
			}
		}
	}
	changedValueTransfer = eventList.addNewList();
	changedValueTransfer.addString(oFF.UiRemoteProtocol.EV_ON_TRANSFER_END);
};
oFF.SphereClient.prototype._prepareEmptyRequest = function(ocpFunction)
{
	let requestStructure = oFF.PrFactory.createStructure();
	ocpFunction.getRpcRequest().setRequestStructure(requestStructure);
	return requestStructure;
};
oFF.SphereClient.prototype._prepareEventFunction = function()
{
	let ocpFunction = this._prepareFunction(oFF.UiRemoteAction.EVENT, this.m_instanceId);
	return ocpFunction;
};
oFF.SphereClient.prototype._prepareEventRequest = function(ocpFunction)
{
	let requestStructure = oFF.PrFactory.createStructure();
	ocpFunction.getRpcRequest().setRequestStructure(requestStructure);
	let eventList = requestStructure.putNewList(oFF.UiRemoteProtocol.EVENTS);
	requestStructure.putString(oFF.UiRemoteProtocol.INSTANCE_ID, this.m_instanceId);
	this._addIntegrityCheckToRequest(requestStructure);
	return eventList;
};
oFF.SphereClient.prototype._prepareFunction = function(remoteAction, instanceId)
{
	if (oFF.notNull(remoteAction))
	{
		let connection = this.getApplication().getConnectionPool().getConnection(oFF.SphereClient.REMOTE_SYSTEM_NAME);
		let buffer = oFF.XStringBuffer.create();
		buffer.append("/remote/myapp?");
		buffer.append(oFF.UiRemoteProtocol.ACTION);
		buffer.append("=");
		buffer.append(remoteAction.getName());
		if (remoteAction.requiresContainerInstance())
		{
			if (oFF.XStringUtils.isNotNullAndNotEmpty(instanceId))
			{
				buffer.append("&");
				buffer.append(oFF.UiRemoteProtocol.INSTANCE_ID);
				buffer.append("=");
				buffer.append(instanceId);
			}
			else
			{
				throw oFF.XException.createRuntimeException("Instance id is required for this request!");
			}
		}
		let path = buffer.toString();
		let ocpFunction = connection.newRpcFunction(path);
		ocpFunction.getRpcRequest().setMethod(oFF.HttpRequestMethod.HTTP_POST);
		return ocpFunction;
	}
	return null;
};
oFF.SphereClient.prototype._prepareIntegrityRequest = function(ocpFunction)
{
	let requestStructure = this._prepareEmptyRequest(ocpFunction);
	this._addIntegrityCheckToRequest(requestStructure);
	return requestStructure;
};
oFF.SphereClient.prototype._prepareRemoteUiSystemLandscape = function(locationUri)
{
	this.m_locationUri = this._prepareRemoteUri(locationUri);
	if (oFF.notNull(this.m_locationUri))
	{
		this.getApplication().getConnectionPool().clearConnections();
		let application = this.getApplication();
		let sysLand = oFF.StandaloneSystemLandscape.create(this);
		let system = sysLand.setSystemByUri(oFF.SphereClient.REMOTE_SYSTEM_NAME, this.m_locationUri, oFF.SystemType.GENERIC);
		system.setIsCsrfTokenRequired(false);
		application.setSystemLandscape(sysLand);
	}
};
oFF.SphereClient.prototype._prepareRemoteUri = function(locationUri)
{
	let tmpRemoteUri = null;
	if (oFF.notNull(locationUri))
	{
		tmpRemoteUri = oFF.XUri.createFromUrl(locationUri);
	}
	else
	{
		tmpRemoteUri = oFF.NetworkEnv.getLocation();
		if (oFF.isNull(tmpRemoteUri))
		{
			tmpRemoteUri = oFF.XUri.createFromUrl(oFF.SphereClient.DEFAULT_LOCATION);
		}
		else
		{
			let adapted = oFF.XUri.createFromOther(tmpRemoteUri);
			adapted.setPath(null);
			adapted.setQuery(null);
			adapted.setFragment(null);
			return adapted;
		}
	}
	if (oFF.notNull(tmpRemoteUri) && (oFF.XStringUtils.isNotNullAndNotEmpty(tmpRemoteUri.getHost()) || this._isWebWorkerEnabled()))
	{
		return tmpRemoteUri;
	}
	return null;
};
oFF.SphereClient.prototype._prepareSingleEvent = function(ocpFunction)
{
	let eventList = this._prepareEventRequest(ocpFunction);
	this._passiveValueTransfer(eventList);
	let singleEvent = eventList.addNewList();
	return singleEvent;
};
oFF.SphereClient.prototype._prepareUiEvent = function(event, eventDef, ocpFunction)
{
	if (oFF.isNull(eventDef))
	{
		throw oFF.XException.createRuntimeException("Missing event! Please specify an event!");
	}
	let eventBase = event;
	eventBase.mapElementIds((controlToMap) => {
		return this.lookupServerId(controlToMap.getId());
	});
	let singleEvent = this._prepareSingleEvent(ocpFunction);
	let control = eventBase.getControl();
	this._addOperation(singleEvent, eventDef.getRemoteName(), control);
	singleEvent.addString(eventBase.serialize());
	return singleEvent;
};
oFF.SphereClient.prototype._processGetServerInfoResponse = function(responseJsonContent)
{
	let serverVersion = responseJsonContent.getStringByKey(oFF.UiRemoteProtocol.PROTOCOL_VERSION);
	let startTimeMillis = responseJsonContent.getLongByKey(oFF.UiRemoteProtocol.START_TIME);
	let serverPrograms = responseJsonContent.getListByKey(oFF.UiRemoteProtocol.PROGRAMS);
	let runningContainers = responseJsonContent.getListByKey(oFF.UiRemoteProtocol.RUNNING_CONTAINERS);
	let versionStr = serverVersion;
	if (!oFF.XString.isEqual(serverVersion, oFF.UiRemoteProtocol.REMOTE_UI_VERSION))
	{
		versionStr = oFF.XStringUtils.concatenate2(serverVersion, " (client version mismatch!)");
	}
	let srvProgramsStr = "Server programs";
	if (oFF.notNull(serverPrograms))
	{
		srvProgramsStr = oFF.XStringUtils.concatenate4(srvProgramsStr, " (", oFF.XInteger.convertToString(serverPrograms.size()), ")");
	}
	let runningContainerStr = "Running containers";
	if (oFF.notNull(runningContainers))
	{
		runningContainerStr = oFF.XStringUtils.concatenate4(runningContainerStr, " (", oFF.XInteger.convertToString(runningContainers.size()), ")");
	}
	let serverInfoFormPopup = oFF.UtFormPopup.create(this.getGenesis(), "Server Info success!", null);
	serverInfoFormPopup.setPopupState(oFF.UiValueState.SUCCESS);
	serverInfoFormPopup.setWidth(oFF.UiCssLength.create("760px"));
	serverInfoFormPopup.setReadOnly();
	serverInfoFormPopup.addInput(null, this.m_remoteLocation, "Server");
	serverInfoFormPopup.addInput(null, versionStr, "Version");
	serverInfoFormPopup.addInput(null, this._getElapsedStringFromMillis(startTimeMillis, false), "Started");
	let runningContainerSection = serverInfoFormPopup.addFormSection(null, null, false);
	runningContainerSection.setGap(oFF.UiCssGap.create("5px"));
	runningContainerSection.addFormLabel(null, runningContainerStr, null);
	runningContainerSection.addFormCustomControl(null, this._createRunningContainerTable(runningContainers));
	let srvProgramsSection = serverInfoFormPopup.addFormSection(null, null, false);
	srvProgramsSection.setGap(oFF.UiCssGap.create("5px"));
	srvProgramsSection.addFormLabel(null, srvProgramsStr, null);
	srvProgramsSection.addFormCustomControl(null, this._createSrvProgramsList(serverPrograms));
	serverInfoFormPopup.open();
};
oFF.SphereClient.prototype._processServerOperations = function(jsonContent)
{
	let list = jsonContent.getListByKey(oFF.UiRemoteProtocol.OPERATIONS);
	let size = list.size();
	for (let i = 0; i < size; i++)
	{
		let operation = list.getListAt(i);
		let offset = 0;
		let operationName = operation.getStringAt(offset);
		offset = offset + 1;
		let op = oFF.UiAllOperations.lookupOp(operationName);
		if (oFF.notNull(op))
		{
			let uiContext = null;
			let contextName = operation.getStringAt(offset);
			offset = offset + 1;
			if (oFF.notNull(contextName))
			{
				uiContext = this.m_serverToClientMap.getByKey(contextName);
				if (oFF.isNull(uiContext))
				{
					this.logError2("Cannot find control context ", contextName);
				}
			}
			let retContextName = operation.getStringAt(offset);
			offset = offset + 1;
			if (!op.isAsyncOp())
			{
				this._handleSyncOperation(op, retContextName, uiContext, operation, offset);
			}
			else
			{
				let actionUuid = operation.getStringAt(offset);
				offset = offset + 1;
				this._handleAsyncOperation(op, actionUuid, uiContext, operation, offset);
			}
		}
		else
		{
			this.logError2("Cannot find operation: ", operationName);
		}
	}
};
oFF.SphereClient.prototype._reInitClient = function()
{
	this.m_passiveValues = oFF.XObjectExt.release(this.m_passiveValues);
	this.m_serverToClientMap = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_serverToClientMap);
	this.m_clientToServerMap = oFF.XObjectExt.release(this.m_clientToServerMap);
	this.m_passiveValues = oFF.XProperties.create();
	this.m_serverToClientMap = oFF.XHashMapByString.create();
	this.m_clientToServerMap = oFF.XHashMapByString.create();
	this.m_instanceId = null;
	let allUiTypes = oFF.UiType.getAllUiTypesIterator();
	while (allUiTypes.hasNext())
	{
		let currentType = allUiTypes.next();
		if (currentType.isComposite())
		{
			currentType.setFactory(new oFF.UiCompositeRemoteFactory());
		}
	}
};
oFF.SphereClient.prototype._restartClient = function()
{
	this._terminateRunningProgram();
	this._showInitialScreenIfNeeded();
};
oFF.SphereClient.prototype._runRemoteProgram = function()
{
	this._prepareRemoteUiSystemLandscape(this.m_remoteLocation);
	if (oFF.notNull(this.m_locationUri))
	{
		let activityIndicator = this.getGenesis().newRoot(oFF.UiType.ACTIVITY_INDICATOR);
		activityIndicator.useMaxSpace();
		activityIndicator.setIconSize(oFF.UiCssLength.create("1.5rem"));
		activityIndicator.setText(oFF.XStringUtils.concatenate4("Executing ", this.m_programName, " on ", this.m_remoteLocation));
		this._executeInitializeRequest(this.m_programName, this.m_prgInitArgsString, this.m_remoteTraceName);
	}
	else
	{
		this.getGenesis().showWarningToast("The specified remote server seems to be wrong!");
	}
};
oFF.SphereClient.prototype._scheduleServerRequestIfNeeded = function(serverJson, procedure)
{
	let nextSyncTimer = serverJson.getIntegerByKeyExt(oFF.UiRemoteProtocol.NEXT_SYNC_TIMER, -1);
	if (nextSyncTimer !== -1)
	{
		if (oFF.notNull(this.m_syncTimerId))
		{
			oFF.XTimeout.clear(this.m_syncTimerId);
		}
		this.m_syncTimerId = oFF.XTimeout.timeout(nextSyncTimer, () => {
			procedure();
			this.m_syncTimerId = null;
		});
	}
};
oFF.SphereClient.prototype._selectByCapability = function(capabilityFlag)
{
	let uiTypeList = oFF.UiType.lookupByCapabilityFlag(capabilityFlag);
	if (oFF.isNull(uiTypeList) || uiTypeList.isEmpty())
	{
		return null;
	}
	let selectStatement = oFF.XStringBuffer.create();
	for (let i = 0; i < uiTypeList.size(); i++)
	{
		if (i > 0)
		{
			selectStatement.append(oFF.UiRemoteProtocol.MULTI_ITEM_SEPARATOR);
		}
		selectStatement.append("?");
		selectStatement.append(uiTypeList.get(i).getName());
	}
	let selection = selectStatement.toString();
	let select = this.getUiManager().select(selection);
	return select;
};
oFF.SphereClient.prototype._sendAsyncActionResult = function(uuid, state, result)
{
	if (oFF.isNull(state))
	{
		throw oFF.XException.createRuntimeException("Missing async operation state!");
	}
	let ocpFunction = this._prepareFunction(oFF.UiRemoteAction.ASYNC_ACTION, this.m_instanceId);
	let requestStructure = this._prepareEmptyRequest(ocpFunction);
	requestStructure.putString(oFF.UiRemoteProtocol.OP_ASYNC_ACTION_UUID, uuid);
	requestStructure.putString(oFF.UiRemoteProtocol.OP_ASYNC_ACTION_STATE, state.getName());
	requestStructure.putString(oFF.UiRemoteProtocol.OP_ASYNC_ACTION_RESULT, result);
	ocpFunction.processFunctionExecution(oFF.SyncType.NON_BLOCKING, this, null);
};
oFF.SphereClient.prototype._sendUiEvent = function(event, eventDef)
{
	let ocpFunction = this._prepareEventFunction();
	this._prepareUiEvent(event, eventDef, ocpFunction);
	ocpFunction.processFunctionExecution(oFF.SyncType.NON_BLOCKING, this, null);
};
oFF.SphereClient.prototype._showClientServerMismatchWarning = function()
{
	let clientContainer = this.getGenesis().getAnchor();
	if (oFF.notNull(clientContainer) && clientContainer.getUiType() === oFF.UiType.PAGE)
	{
		clientContainer.setFloatingFooter(true);
		let toolbar = clientContainer.setNewFooter(oFF.UiType.TOOLBAR);
		let msgStrip = toolbar.addNewItemOfType(oFF.UiType.MESSAGE_STRIP);
		msgStrip.setText(oFF.SphereClient.MISMATCH_PROTOCOL_VER_MSG);
		msgStrip.setWidth(oFF.UiCssLength.create("99.9%"));
		msgStrip.setShowIcon(true);
		msgStrip.setIcon("alert");
		msgStrip.setMessageType(oFF.UiMessageType.WARNING);
		msgStrip.setShowCloseButton(true);
		msgStrip.registerOnClose(oFF.UiLambdaCloseListener.create((event) => {
			clientContainer.setFooter(null);
			clientContainer.setFloatingFooter(false);
		}));
	}
	else
	{
		this.getGenesis().showWarningToast(oFF.SphereClient.MISMATCH_PROTOCOL_VER_MSG);
	}
};
oFF.SphereClient.prototype._showError = function(errorMessage, errorDetails)
{
	this._showInitialScreenIfNeeded();
	this.m_statusMessageLbl.setVisible(true);
	this.m_statusMessageLbl.setText(errorMessage);
	this.m_statusMessageLbl.setBackgroundColor(oFF.UiColor.ERROR);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(errorDetails))
	{
		this.m_errorDetailsLbl.setVisible(true);
		this.m_errorDetailsLbl.setText(errorDetails);
	}
	this.m_startBtn.setEnabled(true);
	this.m_clientStarted = false;
};
oFF.SphereClient.prototype._showInfo = function(infoMessage)
{
	this._showInitialScreenIfNeeded();
	this.m_statusMessageLbl.setVisible(true);
	this.m_statusMessageLbl.setText(infoMessage);
	this.m_statusMessageLbl.setBackgroundColor(oFF.UiColor.INFO);
	this.m_startBtn.setEnabled(true);
	this.m_clientStarted = false;
};
oFF.SphereClient.prototype._showInitialScreenIfNeeded = function()
{
	if (this.getGenesis() !== null && (this.getGenesis().getRoot() === null || this.getGenesis().getRoot() !== this.m_mainLayout))
	{
		this._closeClientServerMismatchWarningIfNeeded();
		this.getGenesis().clearUi();
		this.m_mainLayout = this.getGenesis().newControl(oFF.UiType.FLEX_LAYOUT);
		this.m_mainLayout.setName("ScContentWrapper");
		this.m_mainLayout.useMaxSpace();
		this.m_mainLayout.setDirection(oFF.UiFlexDirection.COLUMN);
		this.m_mainLayout.setAlignItems(oFF.UiFlexAlignItems.CENTER);
		this.m_mainLayout.setPadding(oFF.UiCssBoxEdges.create("1rem"));
		this.m_mainLayout.setBackgroundDesign(oFF.UiBackgroundDesign.SOLID);
		let titleLbl = this.m_mainLayout.addNewItemOfType(oFF.UiType.LABEL);
		titleLbl.setText("Remote Ui connection");
		titleLbl.setFontSize(oFF.UiCssLength.create("1.25rem"));
		titleLbl.setFontWeight(oFF.UiFontWeight.BOLD);
		titleLbl.setTextAlign(oFF.UiTextAlign.CENTER);
		let subtitleLbl = this.m_mainLayout.addNewItemOfType(oFF.UiType.LABEL);
		subtitleLbl.setText(oFF.XStringUtils.concatenate2("Client version: ", oFF.UiRemoteProtocol.REMOTE_UI_VERSION));
		subtitleLbl.setFontSize(oFF.UiCssLength.create("1rem"));
		subtitleLbl.setTextAlign(oFF.UiTextAlign.CENTER);
		subtitleLbl.setPadding(oFF.UiCssBoxEdges.create("10px 0px 20px 0px"));
		this.m_remoteServerInput = this._createFormInput(this.m_mainLayout, "Remote server:", "ScRemoteServerInput", this.m_remoteLocation, "Server url");
		this.m_remoteServerInput.setEnabled(!this.m_didAutoStart);
		this.m_programComboBox = this._createProgramComboBox(this.m_mainLayout);
		this.m_programComboBox.setEnabled(!this.m_didAutoStart);
		this.m_prgInitArgsInput = this._createFormInput(this.m_mainLayout, "Init args:", "ScPrgInitArgsInput", this.m_prgInitArgsString, "Arguments");
		this.m_prgInitArgsInput.setEnabled(!this.m_didAutoStart);
		this.m_traceNameInput = this._createFormInput(this.m_mainLayout, "Trace name:", "ScTraceNameInput", this.m_remoteTraceName, "Trace");
		this.m_traceNameInput.setEnabled(!this.m_didAutoStart);
		let actionWrapper = this.m_mainLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
		actionWrapper.setDirection(oFF.UiFlexDirection.ROW);
		actionWrapper.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
		actionWrapper.setMargin(oFF.UiCssBoxEdges.create("10px 0px 0px 0px"));
		actionWrapper.useMaxWidth();
		this.m_startBtn = actionWrapper.addNewItemOfType(oFF.UiType.BUTTON);
		this.m_startBtn.setWidth(oFF.UiCssLength.create("150px"));
		this.m_startBtn.setText("Run");
		this.m_startBtn.setIcon("begin");
		this.m_startBtn.setButtonType(oFF.UiButtonType.PRIMARY);
		this.m_startBtn.setEnabled(true);
		this.m_startBtn.setMargin(oFF.UiCssBoxEdges.create("0px 10px 0px 0px"));
		this.m_startBtn.registerOnPress(oFF.UiLambdaPressListener.create((controlEvent) => {
			this._manualStart();
		}));
		if (this.m_didAutoStart)
		{
			this.m_startBtn.setText("Reconnect");
			this.m_startBtn.setIcon("refresh");
		}
		this.m_getSrvInfoBtn = actionWrapper.addNewItemOfType(oFF.UiType.BUTTON);
		this.m_getSrvInfoBtn.setWidth(oFF.UiCssLength.create("150px"));
		this.m_getSrvInfoBtn.setText("Get Server Info");
		this.m_getSrvInfoBtn.setIcon("it-host");
		this.m_getSrvInfoBtn.setEnabled(true);
		this.m_getSrvInfoBtn.setMargin(oFF.UiCssBoxEdges.create("0px 0px 0px 10px"));
		this.m_getSrvInfoBtn.registerOnPress(oFF.UiLambdaPressListener.create((controlEvent2) => {
			this.m_getSrvInfoBtn.setEnabled(false);
			this.m_remoteLocation = this.m_remoteServerInput.getValue();
			this.getProcess().getLocalStorage().putString(oFF.SphereClient.SPHERE_CLIENT_REMOTE_SERVER_KEY, this.m_remoteLocation);
			this._executeGetServerInfo();
		}));
		this.m_mainLayout.addNewItemOfType(oFF.UiType.SPACER);
		this.m_statusMessageLbl = this.m_mainLayout.addNewItemOfType(oFF.UiType.LABEL);
		this.m_statusMessageLbl.setText("");
		this.m_statusMessageLbl.setFontSize(oFF.UiCssLength.create("0.875rem"));
		this.m_statusMessageLbl.setWidth(oFF.UiCssLength.create("90%"));
		this.m_statusMessageLbl.setBackgroundColor(oFF.UiColor.ERROR);
		this.m_statusMessageLbl.setFontColor(oFF.UiColor.WHITE);
		this.m_statusMessageLbl.setFontWeight(oFF.UiFontWeight.BOLD);
		this.m_statusMessageLbl.setTextAlign(oFF.UiTextAlign.CENTER);
		this.m_statusMessageLbl.setPadding(oFF.UiCssBoxEdges.create("0.5rem"));
		this.m_statusMessageLbl.setCornerRadius(oFF.UiCssBoxEdges.create("5px"));
		this.m_statusMessageLbl.setVisible(false);
		this.m_errorDetailsLbl = this.m_mainLayout.addNewItemOfType(oFF.UiType.LABEL);
		this.m_errorDetailsLbl.setText("");
		this.m_errorDetailsLbl.setFontSize(oFF.UiCssLength.create("0.75rem"));
		this.m_errorDetailsLbl.setWidth(oFF.UiCssLength.create("90%"));
		this.m_errorDetailsLbl.setFontColor(oFF.UiColor.ERROR);
		this.m_errorDetailsLbl.setBackgroundColor(oFF.UiColor.WHITE);
		this.m_errorDetailsLbl.setTextAlign(oFF.UiTextAlign.LEFT);
		this.m_errorDetailsLbl.setWrapping(true);
		this.m_errorDetailsLbl.setPadding(oFF.UiCssBoxEdges.create("0.25rem"));
		this.m_errorDetailsLbl.setMargin(oFF.UiCssBoxEdges.create("10px 0px 0px 0px"));
		this.m_errorDetailsLbl.setCornerRadius(oFF.UiCssBoxEdges.create("5px"));
		this.m_errorDetailsLbl.setBorderColor(oFF.UiColor.ERROR);
		this.m_errorDetailsLbl.setBorderStyle(oFF.UiBorderStyle.SOLID);
		this.m_errorDetailsLbl.setBorderWidth(oFF.UiCssBoxEdges.create("1px"));
		this.m_errorDetailsLbl.setFontWeight(oFF.UiFontWeight.BOLD);
		this.m_errorDetailsLbl.setVisible(false);
		this.getGenesis().setRoot(this.m_mainLayout);
	}
	this._cleanupAllServerControlsIfNeeded();
};
oFF.SphereClient.prototype._terminateRunningProgram = function()
{
	if (this.m_clientStarted)
	{
		this.m_clientStarted = false;
		this.m_isRemoteProgramRunning = false;
		this._executeTerminateRequest(this.m_instanceId, true, null);
	}
};
oFF.SphereClient.prototype._updateTitle = function()
{
	this.setTitle(oFF.XStringUtils.concatenate5(this.m_programName, "@", this.m_locationUri.getHost(), ":", oFF.XInteger.convertToString(this.m_locationUri.getPort())));
};
oFF.SphereClient.prototype._validateClientServerProtocolVersion = function(jsonContent)
{
	if (jsonContent.containsKey(oFF.UiRemoteProtocol.STATUS))
	{
		let srvStatus = oFF.UiRemoteServerStatus.lookup(jsonContent.getStringByKey(oFF.UiRemoteProtocol.STATUS));
		if (srvStatus === oFF.UiRemoteServerStatus.INITIALIZED)
		{
			let integrityCheck = jsonContent.getStructureByKey(oFF.UiRemoteProtocol.INTEGRITY_CHECK);
			if (oFF.notNull(integrityCheck) && integrityCheck.containsKey(oFF.UiRemoteProtocol.PROTOCOL_VERSION))
			{
				let srvProtcolVersion = integrityCheck.getStringByKey(oFF.UiRemoteProtocol.PROTOCOL_VERSION);
				if (!oFF.XString.isEqual(srvProtcolVersion, oFF.UiRemoteProtocol.REMOTE_UI_VERSION))
				{
					this._showClientServerMismatchWarning();
				}
			}
		}
	}
};
oFF.SphereClient.prototype._validateServerStatus = function(jsonContent)
{
	if (!jsonContent.containsKey(oFF.UiRemoteProtocol.STATUS))
	{
		this._showInfo("Invalid server response");
		return false;
	}
	let srvStatus = oFF.UiRemoteServerStatus.lookup(jsonContent.getStringByKey(oFF.UiRemoteProtocol.STATUS));
	if (srvStatus === oFF.UiRemoteServerStatus.TERMINATED)
	{
		this.m_isRemoteProgramRunning = false;
		this._showInfo("Remote program terminated!");
		return false;
	}
	else if (!this.m_isRemoteProgramRunning && srvStatus === oFF.UiRemoteServerStatus.INITIALIZING)
	{
		this._scheduleServerRequestIfNeeded(jsonContent, this._executeCheckInitializeStatusRequest.bind(this));
		return false;
	}
	return true;
};
oFF.SphereClient.prototype.buildUi = function(genesis)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_programName) && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_remoteLocation))
	{
		this._autoStart();
	}
	else
	{
		this.m_remoteLocation = this.getProcess().getLocalStorage().getStringByKeyExt(oFF.SphereClient.SPHERE_CLIENT_REMOTE_SERVER_KEY, this.m_remoteLocation);
		this.m_programName = this.getProcess().getLocalStorage().getStringByKeyExt(oFF.SphereClient.SPHERE_CLIENT_PROGRAM_NAME_KEY, this.m_programName);
		this.m_prgInitArgsString = this.getProcess().getLocalStorage().getStringByKeyExt(oFF.SphereClient.SPHERE_CLIENT_ARGUMENTS_KEY, this.m_prgInitArgsString);
		this.m_remoteTraceName = this.getProcess().getLocalStorage().getStringByKeyExt(oFF.SphereClient.SPHERE_CLIENT_TRACE_NAME_KEY, this.m_remoteTraceName);
		if (oFF.XStringUtils.isNullOrEmpty(this.m_programName))
		{
			this.m_programName = "Athena";
		}
		this._showInitialScreenIfNeeded();
	}
	this.setTitle("SphereClient");
};
oFF.SphereClient.prototype.getContext = function(identifier)
{
	if (oFF.XStringUtils.isNullOrEmpty(identifier))
	{
		return null;
	}
	return this.m_serverToClientMap.getByKey(identifier);
};
oFF.SphereClient.prototype.getLogLayer = function()
{
	return oFF.OriginLayer.APPLICATION;
};
oFF.SphereClient.prototype.getLogSeverity = function()
{
	return oFF.Severity.PRINT;
};
oFF.SphereClient.prototype.getMenuBarDisplayName = function()
{
	return oFF.SphereClient.DEFAULT_PROGRAM_NAME;
};
oFF.SphereClient.prototype.getProgramName = function()
{
	return oFF.SphereClient.DEFAULT_PROGRAM_NAME;
};
oFF.SphereClient.prototype.getWindowMenuItems = function(genesis)
{
	let tmpMenuItems = oFF.XList.create();
	let checkStatusMenuItem = genesis.newControl(oFF.UiType.MENU_ITEM);
	checkStatusMenuItem.setText("Remote program status");
	checkStatusMenuItem.setIcon("message-information");
	checkStatusMenuItem.setTooltip("Check remote program status");
	checkStatusMenuItem.setEnabled(oFF.XStringUtils.isNotNullAndNotEmpty(this.m_instanceId));
	checkStatusMenuItem.registerOnPress(oFF.UiLambdaPressListener.create((controlEvent) => {
		this._executeCheckStatusRequest();
	}));
	tmpMenuItems.add(checkStatusMenuItem);
	let stopMenuItem = genesis.newControl(oFF.UiType.MENU_ITEM);
	stopMenuItem.setText("Stop");
	stopMenuItem.setIcon("stop");
	stopMenuItem.setTooltip("Stop remote program execution!");
	stopMenuItem.setEnabled(this.m_clientStarted);
	stopMenuItem.registerOnPress(oFF.UiLambdaPressListener.create((controlEvent) => {
		this._restartClient();
	}));
	tmpMenuItems.add(stopMenuItem);
	return tmpMenuItems;
};
oFF.SphereClient.prototype.isShowMenuBar = function()
{
	return false;
};
oFF.SphereClient.prototype.lookupServerId = function(clientId)
{
	let serverId = this.m_clientToServerMap.getByKey(clientId);
	if (oFF.notNull(serverId))
	{
		return serverId;
	}
	return clientId;
};
oFF.SphereClient.prototype.newProgram = function()
{
	let prg = new oFF.SphereClient();
	prg.setup();
	return prg;
};
oFF.SphereClient.prototype.onAfterClose = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_AFTER_CLOSE);
};
oFF.SphereClient.prototype.onAfterOpen = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_AFTER_OPEN);
};
oFF.SphereClient.prototype.onAfterRender = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_AFTER_RENDER);
};
oFF.SphereClient.prototype.onBack = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_BACK);
};
oFF.SphereClient.prototype.onBeforeClose = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_BEFORE_CLOSE);
};
oFF.SphereClient.prototype.onBeforeOpen = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_BEFORE_OPEN);
};
oFF.SphereClient.prototype.onBeforePageChanged = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_BEFORE_PAGE_CHANGED);
};
oFF.SphereClient.prototype.onButtonPress = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_BUTTON_PRESS);
};
oFF.SphereClient.prototype.onChange = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_CHANGE);
};
oFF.SphereClient.prototype.onChipUpdate = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_CHIP_UPDATE);
};
oFF.SphereClient.prototype.onClick = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_CLICK);
};
oFF.SphereClient.prototype.onClose = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_CLOSE);
};
oFF.SphereClient.prototype.onCollapse = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_COLLAPSE);
};
oFF.SphereClient.prototype.onColorSelect = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_COLOR_SELECT);
};
oFF.SphereClient.prototype.onColumnResize = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_COLUMN_RESIZE);
};
oFF.SphereClient.prototype.onContainerAfterClose = function()
{
	this._terminateRunningProgram();
};
oFF.SphereClient.prototype.onContextMenu = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_CONTEXT_MENU);
};
oFF.SphereClient.prototype.onCursorChange = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_CURSOR_CHANGE);
};
oFF.SphereClient.prototype.onDelete = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_DELETE);
};
oFF.SphereClient.prototype.onDeselect = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_DESELECT);
};
oFF.SphereClient.prototype.onDetailPress = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_DETAIL_PRESS);
};
oFF.SphereClient.prototype.onDoubleClick = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_DOUBLE_CLICK);
};
oFF.SphereClient.prototype.onDragEnd = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_DRAG_END);
};
oFF.SphereClient.prototype.onDragEnter = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_DRAG_ENTER);
};
oFF.SphereClient.prototype.onDragOver = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_DRAG_OVER);
};
oFF.SphereClient.prototype.onDragStart = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_DRAG_START);
};
oFF.SphereClient.prototype.onDrop = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_DROP);
};
oFF.SphereClient.prototype.onEditingBegin = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_EDITING_BEGIN);
};
oFF.SphereClient.prototype.onEditingEnd = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_EDITING_END);
};
oFF.SphereClient.prototype.onEnter = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_ENTER);
};
oFF.SphereClient.prototype.onError = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_ERROR);
};
oFF.SphereClient.prototype.onEscape = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_ESCAPE);
};
oFF.SphereClient.prototype.onExecute = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_EXECUTE);
};
oFF.SphereClient.prototype.onExpand = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_EXPAND);
};
oFF.SphereClient.prototype.onFileDrop = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_FILE_DROP);
};
oFF.SphereClient.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	if (extResult.isValid())
	{
		if (!this.m_clientStarted)
		{
			this.m_clientStarted = true;
			this._updateTitle();
		}
		let jsonContent = response.getRootElement();
		this.m_instanceId = jsonContent.getStringByKeyExt(oFF.UiRemoteProtocol.INSTANCE_ID, this.m_instanceId);
		if (!this._validateServerStatus(jsonContent))
		{
			return;
		}
		this.m_isRemoteProgramRunning = true;
		this._validateClientServerProtocolVersion(jsonContent);
		if (this.isStandalone())
		{
			let fragment = jsonContent.getStringByKey(oFF.UiRemoteProtocol.FRAGMENT);
			oFF.NetworkEnv.setFragment(fragment);
		}
		this._processServerOperations(jsonContent);
		this._doIntergrityCheck(jsonContent);
		this._collectPassiveValues();
		this._scheduleServerRequestIfNeeded(jsonContent, this._executeSyncRequest.bind(this));
	}
	else
	{
		this.logError("Error in ocp call");
		this.logError(extResult.getSummary());
		if (extResult.getServerStatusCode() === 0)
		{
			if (this.m_clientStarted)
			{
				this._showError("Lost connection to the server!", "");
			}
			else
			{
				this._showError("Could not connect to server!", "Server might not be running...");
			}
		}
		else if (oFF.notNull(response))
		{
			let errorJsonContent = response.getRootElement();
			let errMsg = oFF.XStringUtils.concatenate4("Error: (#", oFF.XInteger.convertToString(extResult.getServerStatusCode()), ") ", extResult.getServerStatusDetails());
			if (oFF.notNull(errorJsonContent) && errorJsonContent.hasElements())
			{
				let errorMessage = errorJsonContent.getStringByKeyExt(oFF.UiRemoteProtocol.ERROR_MESSAGE, null);
				if (!this.m_clientStarted)
				{
					this._showError(errMsg, errorMessage);
				}
				else
				{
					this.logError(errorMessage);
				}
			}
			else
			{
				this._showError(errMsg, "");
			}
		}
	}
};
oFF.SphereClient.prototype.onHover = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_HOVER);
};
oFF.SphereClient.prototype.onHoverEnd = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_HOVER_END);
};
oFF.SphereClient.prototype.onItemClose = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_ITEM_CLOSE);
};
oFF.SphereClient.prototype.onItemDelete = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_ITEM_DELETE);
};
oFF.SphereClient.prototype.onItemPress = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_ITEM_PRESS);
};
oFF.SphereClient.prototype.onItemSelect = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_ITEM_SELECT);
};
oFF.SphereClient.prototype.onKeyDown = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_KEY_DOWN);
};
oFF.SphereClient.prototype.onKeyUp = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_KEY_UP);
};
oFF.SphereClient.prototype.onLiveChange = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_LIVE_CHANGE);
};
oFF.SphereClient.prototype.onLoadFinished = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_LOAD_FINISHED);
};
oFF.SphereClient.prototype.onMenuPress = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_MENU_PRESS);
};
oFF.SphereClient.prototype.onMove = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_MOVE);
};
oFF.SphereClient.prototype.onMoveEnd = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_MOVE_END);
};
oFF.SphereClient.prototype.onMoveStart = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_MOVE_START);
};
oFF.SphereClient.prototype.onOpen = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_OPEN);
};
oFF.SphereClient.prototype.onPageChanged = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_PAGE_CHANGED);
};
oFF.SphereClient.prototype.onPaste = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_PASTE);
};
oFF.SphereClient.prototype.onPress = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_PRESS);
};
oFF.SphereClient.prototype.onReadLineFinished = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_READ_LINE_FINISHED);
};
oFF.SphereClient.prototype.onRefresh = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_REFRESH);
};
oFF.SphereClient.prototype.onResize = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_RESIZE);
};
oFF.SphereClient.prototype.onRowResize = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_ROW_RESIZE);
};
oFF.SphereClient.prototype.onScroll = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_SCROLL);
};
oFF.SphereClient.prototype.onScrollLoad = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_SCROLL_LOAD);
};
oFF.SphereClient.prototype.onSearch = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_SEARCH);
};
oFF.SphereClient.prototype.onSelect = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_SELECT);
};
oFF.SphereClient.prototype.onSelectionChange = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_SELECTION_CHANGE);
};
oFF.SphereClient.prototype.onSelectionFinish = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_SELECTION_FINISH);
};
oFF.SphereClient.prototype.onSuggestionSelect = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_SUGGESTION_SELECT);
};
oFF.SphereClient.prototype.onTableDragAndDrop = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_TABLE_DRAG_AND_DROP);
};
oFF.SphereClient.prototype.onTerminate = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_TERMINATE);
};
oFF.SphereClient.prototype.onToggle = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_TOGGLE);
};
oFF.SphereClient.prototype.onValueHelpRequest = function(event)
{
	this._sendUiEvent(event, oFF.UiEvent.ON_VALUE_HELP_REQUEST);
};
oFF.SphereClient.prototype.prepareProgramMetadata = function(metadata)
{
	metadata.addOption(oFF.SphereClient.PARAM_PROGRAM, "Specify the program name which should be execute.", "Program name", oFF.XValueType.STRING);
	metadata.addOption(oFF.SphereClient.PARAM_INIT_ARGS_STRING, "Specify the arguments string for the remote program.", "Arguments string", oFF.XValueType.STRING);
	metadata.addOption(oFF.SphereClient.PARAM_LOCATION, "Specify the remote server on which the program should be executed", "Remote uri", oFF.XValueType.STRING);
	metadata.addOption(oFF.SphereClient.PARAM_WEBWORKER, "Specify if the client should start the webworker", "", oFF.XValueType.STRING);
};
oFF.SphereClient.prototype.processArguments = function(args)
{
	this.m_programName = args.getStringByKey(oFF.SphereClient.PARAM_PROGRAM);
	this.m_prgInitArgsString = args.getStringByKeyExt(oFF.SphereClient.PARAM_INIT_ARGS_STRING, "");
	this.m_webworkerMode = oFF.XString.isEqual(args.getStringByKeyExt(oFF.SphereClient.PARAM_WEBWORKER, "false"), "true");
	this.m_remoteLocation = args.getStringByKeyExt(oFF.SphereClient.PARAM_LOCATION, this._getDefaultRemoteServerUrl());
	this.m_remoteTraceName = args.getStringByKeyExt(oFF.DfApplicationProgram.PARAM_TRACE_NAME, "");
};
oFF.SphereClient.prototype.processConfiguration = function(configuration) {};
oFF.SphereClient.prototype.releaseObject = function()
{
	oFF.DfUiProgram.prototype.releaseObject.call( this );
	this.m_remoteServerInput = oFF.XObjectExt.release(this.m_remoteServerInput);
	this.m_programComboBox = oFF.XObjectExt.release(this.m_programComboBox);
	this.m_prgInitArgsInput = oFF.XObjectExt.release(this.m_prgInitArgsInput);
	this.m_traceNameInput = oFF.XObjectExt.release(this.m_traceNameInput);
	this.m_startBtn = oFF.XObjectExt.release(this.m_startBtn);
	this.m_getSrvInfoBtn = oFF.XObjectExt.release(this.m_getSrvInfoBtn);
	this.m_errorDetailsLbl = oFF.XObjectExt.release(this.m_errorDetailsLbl);
	this.m_statusMessageLbl = oFF.XObjectExt.release(this.m_statusMessageLbl);
	this.m_mainLayout = oFF.XObjectExt.release(this.m_mainLayout);
	this.m_passiveValues = oFF.XObjectExt.release(this.m_passiveValues);
	this.m_serverToClientMap = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_serverToClientMap);
	this.m_clientToServerMap = oFF.XObjectExt.release(this.m_clientToServerMap);
	this.m_locationUri = oFF.XObjectExt.release(this.m_locationUri);
};
oFF.SphereClient.prototype.setupProgram = function()
{
	this.m_didAutoStart = false;
	this.m_clientStarted = false;
	this.m_isRemoteProgramRunning = false;
	return null;
};

oFF.UiServerManager = function() {};
oFF.UiServerManager.prototype = new oFF.DfUiManager();
oFF.UiServerManager.prototype._ff_c = "UiServerManager";

oFF.UiServerManager.VIRTUAL_ROOT_NAME = "virtualRoot";
oFF.UiServerManager.create = function(session, remotePlatform)
{
	let newObj = new oFF.UiServerManager();
	newObj.setupServerUiManager(session, remotePlatform);
	return newObj;
};
oFF.UiServerManager.prototype.m_clientBase = null;
oFF.UiServerManager.prototype.m_fragment = null;
oFF.UiServerManager.prototype.m_operations = null;
oFF.UiServerManager.prototype.m_remotePlatform = null;
oFF.UiServerManager.prototype.m_serverBase = null;
oFF.UiServerManager.prototype.m_uiTypeCapabilityFlags = null;
oFF.UiServerManager.prototype.adaptResourceUri = function(uri)
{
	if (oFF.isNull(uri))
	{
		return null;
	}
	if (oFF.notNull(this.m_serverBase) && oFF.notNull(this.m_clientBase))
	{
		if (this.m_serverBase.getProtocolType() === uri.getProtocolType())
		{
			let serverBasePath = this.m_serverBase.getPath();
			let path = uri.getPath();
			if (oFF.XString.startsWith(path, serverBasePath))
			{
				let size = oFF.XString.size(serverBasePath);
				let relative = oFF.XString.substring(path, size + 1, -1);
				let clientUri = oFF.XUri.createFromParentUriAndRelativeUrl(this.m_clientBase, relative, false);
				return clientUri.getUrl();
			}
		}
	}
	return uri.getUrl();
};
oFF.UiServerManager.prototype.addOperation = function(context, methodName, returnContext)
{
	let operation = null;
	if (this.m_callLevel === 0)
	{
		operation = this.m_operations.addNewList();
	}
	else
	{
		operation = oFF.PrFactory.createList();
	}
	operation.addString(methodName);
	if (oFF.notNull(context))
	{
		operation.addString(context.getId());
	}
	else
	{
		operation.addString(null);
	}
	if (oFF.notNull(returnContext))
	{
		operation.addString(returnContext.getId());
	}
	else
	{
		operation.addString(null);
	}
	return operation;
};
oFF.UiServerManager.prototype.addOperation1Boolean = function(object, name, param0)
{
	let operation = this.addOperation(object, name, null);
	operation.addBoolean(param0);
	return operation;
};
oFF.UiServerManager.prototype.addOperation1Context = function(object, name, param0)
{
	let operation = this.addOperation(object, name, null);
	if (oFF.notNull(param0))
	{
		operation.addString(param0.getId());
	}
	else
	{
		operation.addString(null);
	}
	return operation;
};
oFF.UiServerManager.prototype.addOperation1Double = function(object, name, param0)
{
	let operation = this.addOperation(object, name, null);
	operation.addDouble(param0);
	return operation;
};
oFF.UiServerManager.prototype.addOperation1Element = function(object, name, param0)
{
	let operation = this.addOperation(object, name, null);
	operation.add(param0);
	return operation;
};
oFF.UiServerManager.prototype.addOperation1Int = function(object, name, param0)
{
	let operation = this.addOperation(object, name, null);
	operation.addInteger(param0);
	return operation;
};
oFF.UiServerManager.prototype.addOperation1String = function(object, name, param0)
{
	let operation = this.addOperation(object, name, null);
	operation.addString(param0);
	return operation;
};
oFF.UiServerManager.prototype.executeAsyncAction = function(actionUuid, actionState, actionResult)
{
	return false;
};
oFF.UiServerManager.prototype.exportHtml = function(template)
{
	let root = oFF.DfUiManager.prototype.getAnchor.call( this );
	let htmldoc = oFF.UiUtils.exportToHtml(root, template);
	return htmldoc;
};
oFF.UiServerManager.prototype.fetchOprationSequence = function()
{
	let currentSequence = this.m_operations;
	this.m_operations = oFF.PrFactory.createList();
	return currentSequence;
};
oFF.UiServerManager.prototype.getAnchor = function()
{
	let root = this.getAnchorByName(oFF.UiServerManager.VIRTUAL_ROOT_NAME);
	this.addOperation(null, oFF.UiRemoteProtocol.OP_GET_ROOT, root);
	return root;
};
oFF.UiServerManager.prototype.getAnchorWrapperId = function(originId)
{
	return originId;
};
oFF.UiServerManager.prototype.getFragment = function()
{
	return this.m_fragment;
};
oFF.UiServerManager.prototype.getPlatform = function()
{
	return this.m_remotePlatform;
};
oFF.UiServerManager.prototype.getUidPrefix = function()
{
	return "srv_";
};
oFF.UiServerManager.prototype.hasUiTypeCapabilityFlag = function(uiType, flag)
{
	let set = this.m_uiTypeCapabilityFlags.getByKey(uiType);
	if (oFF.isNull(set))
	{
		return false;
	}
	return set.contains(flag);
};
oFF.UiServerManager.prototype.newControlExt = function(uiType, identifier, styleClass)
{
	let uiElement = oFF.DfUiManager.prototype.newControlExt.call( this , uiType, identifier, styleClass);
	if (oFF.notNull(uiElement) && uiType !== oFF.UiType.ROOT)
	{
		let prOperation = this.addOperation(null, oFF.UiRemoteProtocol.OP_UI_MGR_NEW_UI_CONTROL, uiElement);
		let theId = uiElement.getId();
		let uiStyleClass = uiElement.getUiStyleClass();
		prOperation.addString(uiType.getName());
		prOperation.addString(theId);
		prOperation.addString(oFF.notNull(uiStyleClass) ? uiStyleClass.getName() : null);
		if (uiElement.isCompositeControl())
		{
			this.addOperation1Context(uiElement, oFF.UiRemoteProtocol.OP_SET_BASE_CONTROL, uiElement.getBaseControl());
		}
	}
	return uiElement;
};
oFF.UiServerManager.prototype.releaseObject = function()
{
	oFF.DfUiManager.prototype.releaseObject.call( this );
};
oFF.UiServerManager.prototype.serializeUiTree = function()
{
	let anchor = oFF.DfUiManager.prototype.getAnchor.call( this );
	let anchorStructure = oFF.UiUtils.exportToStructure(anchor);
	return anchorStructure;
};
oFF.UiServerManager.prototype.setCalendarType = function(calendarType)
{
	oFF.DfUiManager.prototype.setCalendarType.call( this , calendarType);
	let params = this.addOperation(null, oFF.UiRemoteProtocol.OP_UI_MGR_SET_CALENDAR_TYPE, null);
	if (oFF.notNull(params))
	{
		if (oFF.notNull(calendarType))
		{
			params.addString(calendarType.getName());
		}
		else
		{
			params.addString(null);
		}
	}
};
oFF.UiServerManager.prototype.setFragment = function(fragment)
{
	this.m_fragment = fragment;
	oFF.NetworkEnv.setFragment(fragment);
};
oFF.UiServerManager.prototype.setResourceLocations = function(serverBase, clientBase)
{
	this.m_serverBase = serverBase;
	this.m_clientBase = clientBase;
	if (oFF.notNull(clientBase))
	{
		let env = this.getSession().getEnvironment();
		let targetUri = oFF.XUri.createChild(clientBase, "production/resources/");
		let targetUrl = targetUri.getUrlExt(true, true, true, true, false, true, true, false, false);
		env.setVariable(oFF.XEnvironmentConstants.FIREFLY_MIMES, targetUrl);
	}
};
oFF.UiServerManager.prototype.setRtl = function(enableRtl)
{
	oFF.DfUiManager.prototype.setRtl.call( this , enableRtl);
	let params = this.addOperation(null, oFF.UiRemoteProtocol.OP_UI_MGR_SET_RTL, null);
	if (oFF.notNull(params))
	{
		params.addBoolean(enableRtl);
	}
};
oFF.UiServerManager.prototype.setUiTypeCapabilityFlag = function(uiType, flag)
{
	let set = this.m_uiTypeCapabilityFlags.getByKey(uiType);
	if (oFF.isNull(set))
	{
		set = oFF.XHashSetOfString.create();
		this.m_uiTypeCapabilityFlags.put(uiType, set);
	}
	set.add(flag);
};
oFF.UiServerManager.prototype.setupServerUiManager = function(session, remotePlatform)
{
	oFF.DfUiManager.prototype.setupSessionContext.call( this , session);
	this.m_remotePlatform = remotePlatform;
	this.registerNativeAnchor(oFF.UiServerManager.VIRTUAL_ROOT_NAME, oFF.UiRemoteProtocol.REMOTE_ROOT_ANCHOR_ID, null);
	this.m_uiTypeCapabilityFlags = oFF.XHashMapByString.create();
	this.m_operations = oFF.PrFactory.createList();
	this.m_fragment = oFF.NetworkEnv.getFragment();
	let allUiTypes = oFF.UiType.getAllUiTypesIterator();
	while (allUiTypes.hasNext())
	{
		let currentType = allUiTypes.next();
		if (currentType.isComposite() === false)
		{
			currentType.setFactory(oFF.UiServerControl.createUiFactory());
		}
	}
};

oFF.UiServerControl = function() {};
oFF.UiServerControl.prototype = new oFF.DfUiGeneric();
oFF.UiServerControl.prototype._ff_c = "UiServerControl";

oFF.UiServerControl.createUiFactory = function()
{
	return new oFF.UiServerControl();
};
oFF.UiServerControl.prototype._addAggrAddOperation = function(protocol, element)
{
	let master = this.getMasterNoCall();
	if (oFF.notNull(master))
	{
		master.addOperation1Context(this, protocol, element);
	}
};
oFF.UiServerControl.prototype._addAggrInsertOperation = function(protocol, element, index)
{
	let master = this.getMasterNoCall();
	if (oFF.notNull(master))
	{
		let operation = master.addOperation1Context(this, protocol, element);
		operation.addInteger(index);
	}
};
oFF.UiServerControl.prototype._addAggrRemoveOperation = function(protocol, element)
{
	let master = this.getMasterNoCall();
	if (oFF.notNull(master))
	{
		master.addOperation1Context(this, protocol, element);
	}
};
oFF.UiServerControl.prototype._addAggregationClearOperation = function(protocol)
{
	this._addUIOperation(protocol);
};
oFF.UiServerControl.prototype._addAssociationAddOperation = function(associationDef, uiElement)
{
	this._addUIOperationWithControlContext(associationDef.getAddMethodName(), uiElement);
	return this;
};
oFF.UiServerControl.prototype._addAssociationClearOperation = function(associationDef)
{
	this._addUIOperation(associationDef.getClearMethodName());
	return this;
};
oFF.UiServerControl.prototype._addAssociationRemoveOperation = function(associationDef, uiElement)
{
	this._addUIOperationWithControlContext(associationDef.getRemoveMethodName(), uiElement);
	return this;
};
oFF.UiServerControl.prototype._addAssociationSetOperation = function(associationDef, uiElement)
{
	this._addUIOperationWithControlContext(associationDef.getSetterMethodName(), uiElement);
	return this;
};
oFF.UiServerControl.prototype._addBooleanPropertyOperation = function(prop, param)
{
	if (oFF.notNull(prop))
	{
		this._addOperation1Boolean(this, prop.getSetterMethodName(), param);
	}
	return this;
};
oFF.UiServerControl.prototype._addConstantOrNull = function(list, constant)
{
	if (oFF.notNull(constant))
	{
		list.addString(constant.getName());
	}
	else
	{
		list.addString(null);
	}
};
oFF.UiServerControl.prototype._addConstantPropertyOperation = function(prop, param)
{
	let constantName = null;
	if (oFF.notNull(param))
	{
		constantName = param.getName();
	}
	return this._addOperation1String(this, prop.getSetterMethodName(), constantName);
};
oFF.UiServerControl.prototype._addContextOrNull = function(list, context)
{
	if (oFF.notNull(context))
	{
		list.addString(context.getId());
	}
	else
	{
		list.addString(null);
	}
};
oFF.UiServerControl.prototype._addControlPropertyOperation = function(prop, controlContext)
{
	if (oFF.notNull(prop))
	{
		this._addUIOperationWithControlContext(prop.getSetterMethodName(), controlContext);
	}
	return this;
};
oFF.UiServerControl.prototype._addDoublePropertyOperation = function(prop, param)
{
	if (oFF.notNull(prop))
	{
		this._addOperation1Double(this, prop.getSetterMethodName(), param);
	}
	return this;
};
oFF.UiServerControl.prototype._addIdsListOrNull = function(list, itemList)
{
	if (oFF.isNull(itemList))
	{
		list.addString(null);
	}
	else
	{
		let itemIdsBuffer = oFF.XStringBuffer.create();
		for (let a = 0; a < itemList.size(); a++)
		{
			let tmpItem = itemList.get(a);
			if (a > 0)
			{
				itemIdsBuffer.append(oFF.UiRemoteProtocol.MULTI_ITEM_SEPARATOR);
			}
			itemIdsBuffer.append(tmpItem.getId());
		}
		list.addString(itemIdsBuffer.toString());
	}
};
oFF.UiServerControl.prototype._addIntegerPropertyOperation = function(prop, param)
{
	if (oFF.notNull(prop))
	{
		this._addOperation1Int(this, prop.getSetterMethodName(), param);
	}
	return this;
};
oFF.UiServerControl.prototype._addJsonPropertyOperation = function(prop, param)
{
	if (oFF.notNull(prop))
	{
		this._addOperation1Element(this, prop.getSetterMethodName(), param);
	}
	return this;
};
oFF.UiServerControl.prototype._addJsonStructureOrNull = function(list, jsonStruct)
{
	if (oFF.notNull(jsonStruct))
	{
		list.add(jsonStruct);
	}
	else
	{
		list.addString(null);
	}
};
oFF.UiServerControl.prototype._addListOfStringPropertyOperation = function(prop, param)
{
	if (oFF.notNull(prop))
	{
		this._addOperation1ListOfString(this, prop.getSetterMethodName(), param);
	}
	return this;
};
oFF.UiServerControl.prototype._addListOfStringsOrNull = function(list, stringList)
{
	if (oFF.isNull(stringList))
	{
		list.addString(null);
	}
	else
	{
		list.addString(oFF.UiRemoteUtils.serializeStringList(stringList));
	}
};
oFF.UiServerControl.prototype._addMethodOperation = function(method)
{
	if (oFF.isNull(method))
	{
		throw oFF.XException.createRuntimeException("Missing method metadata!");
	}
	return this._addUIOperationWithParams(method.getMethodName());
};
oFF.UiServerControl.prototype._addOperation1Boolean = function(object, name, param0)
{
	let master = this.getMasterNoCall();
	if (oFF.notNull(master))
	{
		master.addOperation1Boolean(object, name, param0);
	}
	return this;
};
oFF.UiServerControl.prototype._addOperation1Double = function(object, name, param0)
{
	let master = this.getMasterNoCall();
	if (oFF.notNull(master))
	{
		master.addOperation1Double(object, name, param0);
	}
	return this;
};
oFF.UiServerControl.prototype._addOperation1Element = function(object, name, param0)
{
	let master = this.getMasterNoCall();
	if (oFF.notNull(master))
	{
		master.addOperation1Element(this, name, param0);
	}
	return this;
};
oFF.UiServerControl.prototype._addOperation1Int = function(object, name, param0)
{
	let master = this.getMasterNoCall();
	if (oFF.notNull(master))
	{
		master.addOperation1Int(object, name, param0);
	}
	return this;
};
oFF.UiServerControl.prototype._addOperation1ListOfString = function(object, name, param0)
{
	let master = this.getMasterNoCall();
	if (oFF.notNull(master))
	{
		let addOperation = master.addOperation(object, name, this);
		this._addListOfStringsOrNull(addOperation, param0);
	}
	return this;
};
oFF.UiServerControl.prototype._addOperation1String = function(object, name, param0)
{
	let master = this.getMasterNoCall();
	if (oFF.notNull(master))
	{
		master.addOperation1String(object, name, param0);
	}
	return this;
};
oFF.UiServerControl.prototype._addRegisterEventListenerOperation = function(eventDef, listener)
{
	if (oFF.isNull(eventDef))
	{
		throw oFF.XException.createRuntimeException("Cannot add event listener operation. Missing event definition!");
	}
	let params = null;
	if (oFF.notNull(listener))
	{
		params = this._addUIOperationWithParams(oFF.UiRemoteProtocol.OP_REGISTER_EVENT_LISTENER);
	}
	else
	{
		params = this._addUIOperationWithParams(oFF.UiRemoteProtocol.OP_DEREGISTER_EVENT_LISTENER);
	}
	params.addString(eventDef.getName());
};
oFF.UiServerControl.prototype._addSerializableObjectOrNull = function(list, serializableObject)
{
	if (oFF.notNull(serializableObject))
	{
		list.addString(serializableObject.serialize());
	}
	else
	{
		list.addString(null);
	}
};
oFF.UiServerControl.prototype._addSerializableObjectPropertyOperation = function(prop, param)
{
	let objAsStr = null;
	if (oFF.notNull(param))
	{
		objAsStr = param.serialize();
	}
	return this._addOperation1String(this, prop.getSetterMethodName(), objAsStr);
};
oFF.UiServerControl.prototype._addStringPropertyOperation = function(prop, param)
{
	if (oFF.notNull(prop))
	{
		this._addOperation1String(this, prop.getSetterMethodName(), param);
	}
	return this;
};
oFF.UiServerControl.prototype._addUIOperation = function(protocol)
{
	let master = this.getMasterNoCall();
	if (oFF.notNull(master))
	{
		master.addOperation(this, protocol, this);
	}
};
oFF.UiServerControl.prototype._addUIOperationWithControlContext = function(protocol, controlContext)
{
	let master = this.getMasterNoCall();
	if (oFF.notNull(master))
	{
		master.addOperation1Context(this, protocol, controlContext);
	}
};
oFF.UiServerControl.prototype._addUIOperationWithControlContextList = function(protocol, controlList)
{
	let master = this.getMasterNoCall();
	if (oFF.notNull(master))
	{
		let addOperation = master.addOperation(this, protocol, null);
		this._addIdsListOrNull(addOperation, controlList);
	}
};
oFF.UiServerControl.prototype._addUIOperationWithParams = function(protocol)
{
	let master = this.getMasterNoCall();
	if (oFF.notNull(master))
	{
		return master.addOperation(this, protocol, null);
	}
	return null;
};
oFF.UiServerControl.prototype.addAssociationElement = function(associationDef, element)
{
	oFF.DfUiGeneric.prototype.addAssociationElement.call( this , associationDef, element);
	this._addAssociationAddOperation(associationDef, element);
};
oFF.UiServerControl.prototype.addAttribute = function(attributeName, value)
{
	oFF.DfUiGeneric.prototype.addAttribute.call( this , attributeName, value);
	let params = this._addMethodOperation(oFF.UiMethod.ADD_ATTRIBUTE);
	if (oFF.notNull(params))
	{
		params.addString(attributeName);
		params.addString(value);
	}
	return this;
};
oFF.UiServerControl.prototype.addCommand = function(commandName)
{
	oFF.DfUiGeneric.prototype.addCommand.call( this , commandName);
	let params = this._addMethodOperation(oFF.UiMethod.ADD_COMMAND);
	if (oFF.notNull(params))
	{
		params.addString(commandName);
	}
	return this;
};
oFF.UiServerControl.prototype.addCssClass = function(cssClass)
{
	oFF.DfUiGeneric.prototype.addCssClass.call( this , cssClass);
	let params = this._addMethodOperation(oFF.UiMethod.ADD_CSS_CLASS);
	if (oFF.notNull(params))
	{
		params.addString(cssClass);
	}
	return this;
};
oFF.UiServerControl.prototype.addElementToAggregation = function(element, aggrDef)
{
	oFF.DfUiGeneric.prototype.addElementToAggregation.call( this , element, aggrDef);
	if (oFF.notNull(element) && oFF.notNull(aggrDef))
	{
		this._addAggrAddOperation(aggrDef.getAddMethodName(), element);
	}
};
oFF.UiServerControl.prototype.addSelectedItem = function(selectedItem)
{
	oFF.DfUiGeneric.prototype.addSelectedItem.call( this , selectedItem);
	this._addUIOperationWithControlContext(oFF.UiRemoteProtocol.OP_ADD_SELECTED_ITEM, selectedItem);
	return this;
};
oFF.UiServerControl.prototype.back = function()
{
	oFF.DfUiGeneric.prototype.back.call( this );
	this._addMethodOperation(oFF.UiMethod.BACK);
	return this;
};
oFF.UiServerControl.prototype.bringToFront = function()
{
	oFF.DfUiGeneric.prototype.bringToFront.call( this );
	this._addMethodOperation(oFF.UiMethod.BRING_TO_FRONT);
	return this;
};
oFF.UiServerControl.prototype.clearAggregation = function(aggrDef)
{
	oFF.DfUiGeneric.prototype.clearAggregation.call( this , aggrDef);
	if (oFF.notNull(aggrDef))
	{
		this._addAggregationClearOperation(aggrDef.getClearMethodName());
	}
};
oFF.UiServerControl.prototype.clearAssociation = function(associationDef)
{
	oFF.DfUiGeneric.prototype.clearAssociation.call( this , associationDef);
	this._addAssociationClearOperation(associationDef);
};
oFF.UiServerControl.prototype.clearSelectedItems = function()
{
	oFF.DfUiGeneric.prototype.clearSelectedItems.call( this );
	this._addUIOperation(oFF.UiRemoteProtocol.OP_CLEAR_SELECTED_ITEMS);
	return this;
};
oFF.UiServerControl.prototype.clearSelection = function()
{
	oFF.DfUiGeneric.prototype.clearSelection.call( this );
	this._addMethodOperation(oFF.UiMethod.CLEAR_SELECTION);
};
oFF.UiServerControl.prototype.close = function()
{
	oFF.DfUiGeneric.prototype.close.call( this );
	this._addMethodOperation(oFF.UiMethod.CLOSE);
	return this;
};
oFF.UiServerControl.prototype.closeSuggestions = function()
{
	oFF.DfUiGeneric.prototype.closeSuggestions.call( this );
	this._addMethodOperation(oFF.UiMethod.CLOSE_SUGGESTIONS);
	return this;
};
oFF.UiServerControl.prototype.collapseAll = function()
{
	oFF.DfUiGeneric.prototype.collapseAll.call( this );
	this._addMethodOperation(oFF.UiMethod.COLLAPSE_ALL);
	return this;
};
oFF.UiServerControl.prototype.deleteText = function()
{
	oFF.DfUiGeneric.prototype.deleteText.call( this );
	this._addMethodOperation(oFF.UiMethod.DELETE_TEXT);
	return this;
};
oFF.UiServerControl.prototype.disableDropZones = function()
{
	oFF.DfUiGeneric.prototype.disableDropZones.call( this );
	this._addMethodOperation(oFF.UiMethod.DISABLE_DROP_ZONES);
	return this;
};
oFF.UiServerControl.prototype.enableDropZones = function(dropZonesJson)
{
	oFF.DfUiGeneric.prototype.enableDropZones.call( this , dropZonesJson);
	let params = this._addMethodOperation(oFF.UiMethod.ENABLE_DROP_ZONES);
	if (oFF.notNull(params))
	{
		this._addJsonStructureOrNull(params, dropZonesJson);
	}
	return this;
};
oFF.UiServerControl.prototype.expandToLevel = function(level)
{
	oFF.DfUiGeneric.prototype.expandToLevel.call( this , level);
	let params = this._addMethodOperation(oFF.UiMethod.EXPAND_TO_LEVEL);
	if (oFF.notNull(params))
	{
		params.addInteger(level);
	}
	return this;
};
oFF.UiServerControl.prototype.focus = function()
{
	oFF.DfUiGeneric.prototype.focus.call( this );
	this._addMethodOperation(oFF.UiMethod.FOCUS);
	return this;
};
oFF.UiServerControl.prototype.focusIndex = function(index)
{
	oFF.DfUiGeneric.prototype.focusIndex.call( this , index);
	let params = this._addMethodOperation(oFF.UiMethod.FOCUS_INDEX);
	if (oFF.notNull(params))
	{
		params.addInteger(index);
	}
	return this;
};
oFF.UiServerControl.prototype.fullscreen = function()
{
	oFF.DfUiGeneric.prototype.fullscreen.call( this );
	this._addMethodOperation(oFF.UiMethod.FULLSCREEN);
	return this;
};
oFF.UiServerControl.prototype.getMasterNoCall = function()
{
	let master = null;
	if (this.getUiManagerBase() !== null)
	{
		master = this.getUiManagerBase();
		if (oFF.notNull(master) && master.isExternalCall0() === false)
		{
			master = null;
		}
	}
	return master;
};
oFF.UiServerControl.prototype.hide = function(animated, refControl)
{
	oFF.DfUiGeneric.prototype.hide.call( this , animated, refControl);
	let params = this._addMethodOperation(oFF.UiMethod.HIDE);
	if (oFF.notNull(params))
	{
		params.addBoolean(animated);
		this._addContextOrNull(params, refControl);
	}
	return this;
};
oFF.UiServerControl.prototype.hideResizerAtIndex = function(index)
{
	oFF.DfUiGeneric.prototype.hideResizerAtIndex.call( this , index);
	let params = this._addMethodOperation(oFF.UiMethod.HIDE_RESIZER_AT_INDEX);
	if (oFF.notNull(params))
	{
		params.addInteger(index);
	}
	return this;
};
oFF.UiServerControl.prototype.insertElementIntoAggregation = function(element, index, aggrDef)
{
	oFF.DfUiGeneric.prototype.insertElementIntoAggregation.call( this , element, index, aggrDef);
	if (oFF.notNull(element) && oFF.notNull(aggrDef))
	{
		this._addAggrInsertOperation(aggrDef.getInsertMethodName(), element, index);
	}
};
oFF.UiServerControl.prototype.insertText = function(text)
{
	oFF.DfUiGeneric.prototype.insertText.call( this , text);
	let params = this._addMethodOperation(oFF.UiMethod.INSERT_TEXT);
	if (oFF.notNull(params))
	{
		params.addString(text);
	}
	return this;
};
oFF.UiServerControl.prototype.maximize = function(animated)
{
	oFF.DfUiGeneric.prototype.maximize.call( this , animated);
	let params = this._addMethodOperation(oFF.UiMethod.MAXIMIZE);
	if (oFF.notNull(params))
	{
		params.addBoolean(animated);
	}
	return this;
};
oFF.UiServerControl.prototype.newInstance = function()
{
	let object = new oFF.UiServerControl();
	object.setup();
	return object;
};
oFF.UiServerControl.prototype.offset = function(offsetX, offsetY)
{
	oFF.DfUiGeneric.prototype.offset.call( this , offsetX, offsetY);
	let params = this._addMethodOperation(oFF.UiMethod.OFFSET);
	if (oFF.notNull(params))
	{
		params.addInteger(offsetX);
		params.addInteger(offsetY);
	}
	return this;
};
oFF.UiServerControl.prototype.onAfterClose = function(event)
{
	let listener = this.getListenerOnAfterClose();
	if (oFF.notNull(listener))
	{
		listener.onAfterClose(event);
	}
};
oFF.UiServerControl.prototype.onAfterOpen = function(event)
{
	let listener = this.getListenerOnAfterOpen();
	if (oFF.notNull(listener))
	{
		listener.onAfterOpen(event);
	}
};
oFF.UiServerControl.prototype.onAfterRender = function(event)
{
	let listener = this.getListenerOnAfterRender();
	if (oFF.notNull(listener))
	{
		listener.onAfterRender(event);
	}
};
oFF.UiServerControl.prototype.onBack = function(event)
{
	let listener = this.getListenerOnBack();
	if (oFF.notNull(listener))
	{
		listener.onBack(event);
	}
};
oFF.UiServerControl.prototype.onBeforeClose = function(event)
{
	let listener = this.getListenerOnBeforeClose();
	if (oFF.notNull(listener))
	{
		listener.onBeforeClose(event);
	}
};
oFF.UiServerControl.prototype.onBeforeOpen = function(event)
{
	let listener = this.getListenerOnBeforeOpen();
	if (oFF.notNull(listener))
	{
		listener.onBeforeOpen(event);
	}
};
oFF.UiServerControl.prototype.onBeforePageChanged = function(event)
{
	let listener = this.getListenerOnBeforePageChanged();
	if (oFF.notNull(listener))
	{
		listener.onBeforePageChanged(event);
	}
};
oFF.UiServerControl.prototype.onButtonPress = function(event)
{
	let listener = this.getListenerOnButtonPress();
	if (oFF.notNull(listener))
	{
		listener.onButtonPress(event);
	}
};
oFF.UiServerControl.prototype.onChange = function(event)
{
	let listener = this.getListenerOnChange();
	if (oFF.notNull(listener))
	{
		listener.onChange(event);
	}
};
oFF.UiServerControl.prototype.onChipUpdate = function(event)
{
	let listener = this.getListenerOnChipUpdate();
	if (oFF.notNull(listener))
	{
		listener.onChipUpdate(event);
	}
};
oFF.UiServerControl.prototype.onClick = function(event)
{
	let listener = this.getListenerOnClick();
	if (oFF.notNull(listener))
	{
		listener.onClick(event);
	}
};
oFF.UiServerControl.prototype.onClose = function(event)
{
	let listener = this.getListenerOnClose();
	if (oFF.notNull(listener))
	{
		listener.onClose(event);
	}
};
oFF.UiServerControl.prototype.onCollapse = function(event)
{
	let listener = this.getListenerOnCollapse();
	if (oFF.notNull(listener))
	{
		listener.onCollapse(event);
	}
};
oFF.UiServerControl.prototype.onColorSelect = function(event)
{
	let listener = this.getListenerOnColorSelect();
	if (oFF.notNull(listener))
	{
		listener.onColorSelect(event);
	}
};
oFF.UiServerControl.prototype.onColumnResize = function(event)
{
	let listener = this.getListenerOnColumnResize();
	if (oFF.notNull(listener))
	{
		listener.onColumnResize(event);
	}
};
oFF.UiServerControl.prototype.onContextMenu = function(event)
{
	let listener = this.getListenerOnContextMenu();
	if (oFF.notNull(listener))
	{
		listener.onContextMenu(event);
	}
};
oFF.UiServerControl.prototype.onCursorChange = function(event)
{
	let listener = this.getListenerOnCursorChange();
	if (oFF.notNull(listener))
	{
		listener.onCursorChange(event);
	}
};
oFF.UiServerControl.prototype.onDelete = function(event)
{
	let listener = this.getListenerOnDelete();
	if (oFF.notNull(listener))
	{
		listener.onDelete(event);
	}
};
oFF.UiServerControl.prototype.onDeselect = function(event)
{
	let listener = this.getListenerOnDeselect();
	if (oFF.notNull(listener))
	{
		listener.onDeselect(event);
	}
};
oFF.UiServerControl.prototype.onDetailPress = function(event)
{
	let listener = this.getListenerOnDetailPress();
	if (oFF.notNull(listener))
	{
		listener.onDetailPress(event);
	}
};
oFF.UiServerControl.prototype.onDoubleClick = function(event)
{
	let listener = this.getListenerOnDoubleClick();
	if (oFF.notNull(listener))
	{
		listener.onDoubleClick(event);
	}
};
oFF.UiServerControl.prototype.onDragEnd = function(event)
{
	let listener = this.getListenerOnDragEnd();
	if (oFF.notNull(listener))
	{
		listener.onDragEnd(event);
	}
};
oFF.UiServerControl.prototype.onDragEnter = function(event)
{
	let listener = this.getListenerOnDragEnter();
	if (oFF.notNull(listener))
	{
		listener.onDragEnter(event);
	}
};
oFF.UiServerControl.prototype.onDragOver = function(event)
{
	let listener = this.getListenerOnDragOver();
	if (oFF.notNull(listener))
	{
		listener.onDragOver(event);
	}
};
oFF.UiServerControl.prototype.onDragStart = function(event)
{
	let listener = this.getListenerOnDragStart();
	if (oFF.notNull(listener))
	{
		listener.onDragStart(event);
	}
};
oFF.UiServerControl.prototype.onDrop = function(event)
{
	let listener = this.getListenerOnDrop();
	if (oFF.notNull(listener))
	{
		listener.onDrop(event);
	}
};
oFF.UiServerControl.prototype.onEditingBegin = function(event)
{
	let listener = this.getListenerOnEditingBegin();
	if (oFF.notNull(listener))
	{
		listener.onEditingBegin(event);
	}
};
oFF.UiServerControl.prototype.onEditingEnd = function(event)
{
	let listener = this.getListenerOnEditingEnd();
	if (oFF.notNull(listener))
	{
		listener.onEditingEnd(event);
	}
};
oFF.UiServerControl.prototype.onEnter = function(event)
{
	let listener = this.getListenerOnEnter();
	if (oFF.notNull(listener))
	{
		listener.onEnter(event);
	}
};
oFF.UiServerControl.prototype.onError = function(event)
{
	let listener = this.getListenerOnError();
	if (oFF.notNull(listener))
	{
		listener.onError(event);
	}
};
oFF.UiServerControl.prototype.onEscape = function(event)
{
	let listener = this.getListenerOnEscape();
	if (oFF.notNull(listener))
	{
		listener.onEscape(event);
	}
};
oFF.UiServerControl.prototype.onExecute = function(event)
{
	let listener = this.getListenerOnExecute();
	if (oFF.notNull(listener))
	{
		listener.onExecute(event);
	}
};
oFF.UiServerControl.prototype.onExpand = function(event)
{
	let listener = this.getListenerOnExpand();
	if (oFF.notNull(listener))
	{
		listener.onExpand(event);
	}
};
oFF.UiServerControl.prototype.onFileDrop = function(event)
{
	let listener = this.getListenerOnFileDrop();
	if (oFF.notNull(listener))
	{
		listener.onFileDrop(event);
	}
};
oFF.UiServerControl.prototype.onHover = function(event)
{
	let listener = this.getListenerOnHover();
	if (oFF.notNull(listener))
	{
		listener.onHover(event);
	}
};
oFF.UiServerControl.prototype.onHoverEnd = function(event)
{
	let listener = this.getListenerOnHoverEnd();
	if (oFF.notNull(listener))
	{
		listener.onHoverEnd(event);
	}
};
oFF.UiServerControl.prototype.onItemClose = function(event)
{
	let listener = this.getListenerOnItemClose();
	if (oFF.notNull(listener))
	{
		listener.onItemClose(event);
	}
};
oFF.UiServerControl.prototype.onItemDelete = function(event)
{
	let listener = this.getListenerOnItemDelete();
	if (oFF.notNull(listener))
	{
		listener.onItemDelete(event);
	}
};
oFF.UiServerControl.prototype.onItemPress = function(event)
{
	let listener = this.getListenerOnItemPress();
	if (oFF.notNull(listener))
	{
		listener.onItemPress(event);
	}
};
oFF.UiServerControl.prototype.onItemSelect = function(event)
{
	let listener = this.getListenerOnItemSelect();
	if (oFF.notNull(listener))
	{
		listener.onItemSelect(event);
	}
};
oFF.UiServerControl.prototype.onKeyDown = function(event)
{
	let listener = this.getListenerOnKeyDown();
	if (oFF.notNull(listener))
	{
		listener.onKeyDown(event);
	}
};
oFF.UiServerControl.prototype.onKeyUp = function(event)
{
	let listener = this.getListenerOnKeyUp();
	if (oFF.notNull(listener))
	{
		listener.onKeyUp(event);
	}
};
oFF.UiServerControl.prototype.onLiveChange = function(event)
{
	let listener = this.getListenerOnLiveChange();
	if (oFF.notNull(listener))
	{
		listener.onLiveChange(event);
	}
};
oFF.UiServerControl.prototype.onLoadFinished = function(event)
{
	let listener = this.getListenerOnLoadFinished();
	if (oFF.notNull(listener))
	{
		listener.onLoadFinished(event);
	}
};
oFF.UiServerControl.prototype.onMenuPress = function(event)
{
	let listener = this.getListenerOnMenuPress();
	if (oFF.notNull(listener))
	{
		listener.onMenuPress(event);
	}
};
oFF.UiServerControl.prototype.onMove = function(event)
{
	let listener = this.getListenerOnMove();
	if (oFF.notNull(listener))
	{
		listener.onMove(event);
	}
};
oFF.UiServerControl.prototype.onMoveEnd = function(event)
{
	let listener = this.getListenerOnMoveEnd();
	if (oFF.notNull(listener))
	{
		listener.onMoveEnd(event);
	}
};
oFF.UiServerControl.prototype.onMoveStart = function(event)
{
	let listener = this.getListenerOnMoveStart();
	if (oFF.notNull(listener))
	{
		listener.onMoveStart(event);
	}
};
oFF.UiServerControl.prototype.onOpen = function(event)
{
	let listener = this.getListenerOnOpen();
	if (oFF.notNull(listener))
	{
		listener.onOpen(event);
	}
};
oFF.UiServerControl.prototype.onPageChanged = function(event)
{
	let listener = this.getListenerOnPageChanged();
	if (oFF.notNull(listener))
	{
		listener.onPageChanged(event);
	}
};
oFF.UiServerControl.prototype.onPaste = function(event)
{
	let listener = this.getListenerOnPaste();
	if (oFF.notNull(listener))
	{
		listener.onPaste(event);
	}
};
oFF.UiServerControl.prototype.onPress = function(event)
{
	let listener = this.getListenerOnPress();
	if (oFF.notNull(listener))
	{
		listener.onPress(event);
	}
};
oFF.UiServerControl.prototype.onReadLineFinished = function(event)
{
	let listener = this.getListenerOnReadLineFinished();
	if (oFF.notNull(listener))
	{
		listener.onReadLineFinished(event);
	}
};
oFF.UiServerControl.prototype.onRefresh = function(event)
{
	let listener = this.getListenerOnRefresh();
	if (oFF.notNull(listener))
	{
		listener.onRefresh(event);
	}
};
oFF.UiServerControl.prototype.onResize = function(event)
{
	let listener = this.getListenerOnResize();
	if (oFF.notNull(listener))
	{
		listener.onResize(event);
	}
};
oFF.UiServerControl.prototype.onRowResize = function(event)
{
	let listener = this.getListenerOnRowResize();
	if (oFF.notNull(listener))
	{
		listener.onRowResize(event);
	}
};
oFF.UiServerControl.prototype.onScroll = function(event)
{
	let listener = this.getListenerOnScroll();
	if (oFF.notNull(listener))
	{
		listener.onScroll(event);
	}
};
oFF.UiServerControl.prototype.onScrollLoad = function(event)
{
	let listener = this.getListenerOnScrollLoad();
	if (oFF.notNull(listener))
	{
		listener.onScrollLoad(event);
	}
};
oFF.UiServerControl.prototype.onSearch = function(event)
{
	let listener = this.getListenerOnSearch();
	if (oFF.notNull(listener))
	{
		listener.onSearch(event);
	}
};
oFF.UiServerControl.prototype.onSelect = function(event)
{
	let listener = this.getListenerOnSelect();
	if (oFF.notNull(listener))
	{
		listener.onSelect(event);
	}
};
oFF.UiServerControl.prototype.onSelectionChange = function(event)
{
	let listener = this.getListenerOnSelectionChange();
	if (oFF.notNull(listener))
	{
		listener.onSelectionChange(event);
	}
};
oFF.UiServerControl.prototype.onSelectionFinish = function(event)
{
	let listener = this.getListenerOnSelectionFinish();
	if (oFF.notNull(listener))
	{
		listener.onSelectionFinish(event);
	}
};
oFF.UiServerControl.prototype.onSuggestionSelect = function(event)
{
	let listener = this.getListenerOnSuggestionSelect();
	if (oFF.notNull(listener))
	{
		listener.onSuggestionSelect(event);
	}
};
oFF.UiServerControl.prototype.onTableDragAndDrop = function(event)
{
	let listener = this.getListenerOnTableDragAndDrop();
	if (oFF.notNull(listener))
	{
		listener.onTableDragAndDrop(event);
	}
};
oFF.UiServerControl.prototype.onTerminate = function(event)
{
	let listener = this.getListenerOnTerminate();
	if (oFF.notNull(listener))
	{
		listener.onTerminate(event);
	}
};
oFF.UiServerControl.prototype.onToggle = function(event)
{
	let listener = this.getListenerOnToggle();
	if (oFF.notNull(listener))
	{
		listener.onToggle(event);
	}
};
oFF.UiServerControl.prototype.onValueHelpRequest = function(event)
{
	let listener = this.getListenerOnValueHelpRequest();
	if (oFF.notNull(listener))
	{
		listener.onValueHelpRequest(event);
	}
};
oFF.UiServerControl.prototype.open = function()
{
	oFF.DfUiGeneric.prototype.open.call( this );
	this._addMethodOperation(oFF.UiMethod.OPEN);
	return this;
};
oFF.UiServerControl.prototype.openAt = function(control)
{
	oFF.DfUiGeneric.prototype.openAt.call( this , control);
	let params = this._addMethodOperation(oFF.UiMethod.OPEN_AT);
	if (oFF.notNull(params))
	{
		this._addContextOrNull(params, control);
	}
	return this;
};
oFF.UiServerControl.prototype.openAtDock = function(control, withKeyboard, dockMy, dockAt, dockOffset)
{
	oFF.DfUiGeneric.prototype.openAtDock.call( this , control, withKeyboard, dockMy, dockAt, dockOffset);
	let params = this._addMethodOperation(oFF.UiMethod.OPEN_AT_DOCK);
	if (oFF.notNull(params))
	{
		this._addContextOrNull(params, control);
		params.addBoolean(withKeyboard);
		this._addConstantOrNull(params, dockMy);
		this._addConstantOrNull(params, dockAt);
		params.addString(dockOffset);
	}
	return this;
};
oFF.UiServerControl.prototype.openAtPosition = function(posX, posY)
{
	oFF.DfUiGeneric.prototype.openAtPosition.call( this , posX, posY);
	let params = this._addMethodOperation(oFF.UiMethod.OPEN_AT_POSITION);
	if (oFF.notNull(params))
	{
		params.addInteger(posX);
		params.addInteger(posY);
	}
	return this;
};
oFF.UiServerControl.prototype.popToPage = function(page)
{
	oFF.DfUiGeneric.prototype.popToPage.call( this , page);
	let params = this._addMethodOperation(oFF.UiMethod.POP_TO_PAGE);
	if (oFF.notNull(params))
	{
		this._addContextOrNull(params, page);
	}
	return this;
};
oFF.UiServerControl.prototype.prettyPrint = function()
{
	oFF.DfUiGeneric.prototype.prettyPrint.call( this );
	this._addMethodOperation(oFF.UiMethod.PRETTY_PRINT);
	return this;
};
oFF.UiServerControl.prototype.print = function(text)
{
	oFF.DfUiGeneric.prototype.print.call( this , text);
	let params = this._addMethodOperation(oFF.UiMethod.PRINT);
	if (oFF.notNull(params))
	{
		params.addString(text);
	}
};
oFF.UiServerControl.prototype.println = function(text)
{
	oFF.DfUiGeneric.prototype.println.call( this , text);
	let params = this._addMethodOperation(oFF.UiMethod.PRINTLN);
	if (oFF.notNull(params))
	{
		params.addString(text);
	}
};
oFF.UiServerControl.prototype.registerEventListener = function(eventDef, listener)
{
	oFF.DfUiGeneric.prototype.registerEventListener.call( this , eventDef, listener);
	this._addRegisterEventListenerOperation(eventDef, listener);
};
oFF.UiServerControl.prototype.releaseObject = function()
{
	this._addUIOperation(oFF.UiRemoteProtocol.OP_RELEASE_CONTROL);
	oFF.DfUiGeneric.prototype.releaseObject.call( this );
};
oFF.UiServerControl.prototype.removeAssociationElement = function(associationDef, element)
{
	oFF.DfUiGeneric.prototype.removeAssociationElement.call( this , associationDef, element);
	this._addAssociationRemoveOperation(associationDef, element);
};
oFF.UiServerControl.prototype.removeAttribute = function(attributeName)
{
	oFF.DfUiGeneric.prototype.removeAttribute.call( this , attributeName);
	let params = this._addMethodOperation(oFF.UiMethod.REMOVE_ATTRIBUTE);
	if (oFF.notNull(params))
	{
		params.addString(attributeName);
	}
	return this;
};
oFF.UiServerControl.prototype.removeCommand = function(commandName, keepCommand)
{
	oFF.DfUiGeneric.prototype.removeCommand.call( this , commandName, keepCommand);
	let params = this._addMethodOperation(oFF.UiMethod.REMOVE_COMMAND);
	if (oFF.notNull(params))
	{
		params.addString(commandName);
		params.addBoolean(keepCommand);
	}
	return this;
};
oFF.UiServerControl.prototype.removeCssClass = function(cssClass)
{
	oFF.DfUiGeneric.prototype.removeCssClass.call( this , cssClass);
	let params = this._addMethodOperation(oFF.UiMethod.REMOVE_CSS_CLASS);
	if (oFF.notNull(params))
	{
		params.addString(cssClass);
	}
	return this;
};
oFF.UiServerControl.prototype.removeElementFromAggregation = function(element, aggrDef)
{
	oFF.DfUiGeneric.prototype.removeElementFromAggregation.call( this , element, aggrDef);
	if (oFF.notNull(element) && oFF.notNull(aggrDef))
	{
		this._addAggrRemoveOperation(aggrDef.getRemoveMethodName(), element);
	}
};
oFF.UiServerControl.prototype.removeSelectedItem = function(selectedItem)
{
	oFF.DfUiGeneric.prototype.removeSelectedItem.call( this , selectedItem);
	this._addUIOperationWithControlContext(oFF.UiRemoteProtocol.OP_REMOVE_SELECTED_ITEM, selectedItem);
	return this;
};
oFF.UiServerControl.prototype.restore = function(animated)
{
	oFF.DfUiGeneric.prototype.restore.call( this , animated);
	let params = this._addMethodOperation(oFF.UiMethod.RESTORE);
	if (oFF.notNull(params))
	{
		params.addBoolean(animated);
	}
	return this;
};
oFF.UiServerControl.prototype.runModule = function(moduleName)
{
	oFF.DfUiGeneric.prototype.runModule.call( this , moduleName);
	let params = this._addMethodOperation(oFF.UiMethod.RUN_MODULE);
	if (oFF.notNull(params))
	{
		params.addString(moduleName);
	}
	return this;
};
oFF.UiServerControl.prototype.scrollTo = function(x, y, duration)
{
	oFF.DfUiGeneric.prototype.scrollTo.call( this , x, y, duration);
	let params = this._addMethodOperation(oFF.UiMethod.SCROLL_TO);
	if (oFF.notNull(params))
	{
		params.addInteger(x);
		params.addInteger(y);
		params.addInteger(duration);
	}
	return this;
};
oFF.UiServerControl.prototype.scrollToControl = function(control, duration)
{
	oFF.DfUiGeneric.prototype.scrollToControl.call( this , control, duration);
	let params = this._addMethodOperation(oFF.UiMethod.SCROLL_TO_CONTROL);
	if (oFF.notNull(params))
	{
		this._addContextOrNull(params, control);
		params.addInteger(duration);
	}
	return this;
};
oFF.UiServerControl.prototype.scrollToIndex = function(index)
{
	oFF.DfUiGeneric.prototype.scrollToIndex.call( this , index);
	let params = this._addMethodOperation(oFF.UiMethod.SCROLL_TO_INDEX);
	if (oFF.notNull(params))
	{
		params.addInteger(index);
	}
	return this;
};
oFF.UiServerControl.prototype.selectArea = function(xStartPos, yStartPos, xEndPos, yEndPos, scrollIntoView)
{
	oFF.DfUiGeneric.prototype.selectArea.call( this , xStartPos, yStartPos, xEndPos, yEndPos, scrollIntoView);
	let params = this._addMethodOperation(oFF.UiMethod.SELECT_AREA);
	if (oFF.notNull(params))
	{
		params.addInteger(xStartPos);
		params.addInteger(yStartPos);
		params.addInteger(xEndPos);
		params.addInteger(yEndPos);
		params.addBoolean(scrollIntoView);
	}
};
oFF.UiServerControl.prototype.selectCell = function(xPos, yPos, scrollIntoView)
{
	oFF.DfUiGeneric.prototype.selectCell.call( this , xPos, yPos, scrollIntoView);
	let params = this._addMethodOperation(oFF.UiMethod.SELECT_CELL);
	if (oFF.notNull(params))
	{
		params.addInteger(xPos);
		params.addInteger(yPos);
		params.addBoolean(scrollIntoView);
	}
};
oFF.UiServerControl.prototype.selectText = function(startIndex, endIndex)
{
	oFF.DfUiGeneric.prototype.selectText.call( this , startIndex, endIndex);
	let params = this._addMethodOperation(oFF.UiMethod.SELECT_TEXT);
	if (oFF.notNull(params))
	{
		params.addInteger(startIndex);
		params.addInteger(endIndex);
	}
	return this;
};
oFF.UiServerControl.prototype.selectTextByPosition = function(startPosition, endPosition)
{
	oFF.DfUiGeneric.prototype.selectTextByPosition.call( this , startPosition, endPosition);
	let params = this._addMethodOperation(oFF.UiMethod.SELECT_TEXT_BY_POSITION);
	if (oFF.notNull(params))
	{
		this._addSerializableObjectOrNull(params, startPosition);
		this._addSerializableObjectOrNull(params, endPosition);
	}
	return this;
};
oFF.UiServerControl.prototype.setActiveIcon = function(activeIcon)
{
	oFF.DfUiGeneric.prototype.setActiveIcon.call( this , activeIcon);
	return this._addStringPropertyOperation(oFF.UiProperty.ACTIVE_ICON, activeIcon);
};
oFF.UiServerControl.prototype.setAdaptTitleSize = function(adaptTitleSize)
{
	oFF.DfUiGeneric.prototype.setAdaptTitleSize.call( this , adaptTitleSize);
	return this._addBooleanPropertyOperation(oFF.UiProperty.ADAPT_TITLE_SIZE, adaptTitleSize);
};
oFF.UiServerControl.prototype.setAdditionalText = function(additionalText)
{
	oFF.DfUiGeneric.prototype.setAdditionalText.call( this , additionalText);
	return this._addStringPropertyOperation(oFF.UiProperty.ADDITIONAL_TEXT, additionalText);
};
oFF.UiServerControl.prototype.setAlignContent = function(alignContent)
{
	oFF.DfUiGeneric.prototype.setAlignContent.call( this , alignContent);
	return this._addConstantPropertyOperation(oFF.UiProperty.ALIGN_CONTENT, alignContent);
};
oFF.UiServerControl.prototype.setAlignItems = function(alignItems)
{
	oFF.DfUiGeneric.prototype.setAlignItems.call( this , alignItems);
	return this._addConstantPropertyOperation(oFF.UiProperty.ALIGN_ITEMS, alignItems);
};
oFF.UiServerControl.prototype.setAlignSelf = function(alignSelf)
{
	oFF.DfUiGeneric.prototype.setAlignSelf.call( this , alignSelf);
	return this._addConstantPropertyOperation(oFF.UiProperty.ALIGN_SELF, alignSelf);
};
oFF.UiServerControl.prototype.setAlternateRowColors = function(alternateRowColors)
{
	oFF.DfUiGeneric.prototype.setAlternateRowColors.call( this , alternateRowColors);
	return this._addBooleanPropertyOperation(oFF.UiProperty.ALTERNATE_ROW_COLORS, alternateRowColors);
};
oFF.UiServerControl.prototype.setAnimated = function(animated)
{
	oFF.DfUiGeneric.prototype.setAnimated.call( this , animated);
	return this._addBooleanPropertyOperation(oFF.UiProperty.ANIMATED, animated);
};
oFF.UiServerControl.prototype.setAnimationDuration = function(animationDuration)
{
	oFF.DfUiGeneric.prototype.setAnimationDuration.call( this , animationDuration);
	return this._addIntegerPropertyOperation(oFF.UiProperty.ANIMATION_DURATION, animationDuration);
};
oFF.UiServerControl.prototype.setApplyContentPadding = function(applyContentPadding)
{
	oFF.DfUiGeneric.prototype.setApplyContentPadding.call( this , applyContentPadding);
	return this._addBooleanPropertyOperation(oFF.UiProperty.APPLY_CONTENT_PADDING, applyContentPadding);
};
oFF.UiServerControl.prototype.setArrowOrientation = function(arrowOrientation)
{
	oFF.DfUiGeneric.prototype.setArrowOrientation.call( this , arrowOrientation);
	return this._addConstantPropertyOperation(oFF.UiProperty.ARROW_ORIENTATION, arrowOrientation);
};
oFF.UiServerControl.prototype.setAssociationElement = function(associationDef, element)
{
	oFF.DfUiGeneric.prototype.setAssociationElement.call( this , associationDef, element);
	this._addAssociationSetOperation(associationDef, element);
};
oFF.UiServerControl.prototype.setAuthor = function(author)
{
	oFF.DfUiGeneric.prototype.setAuthor.call( this , author);
	return this._addStringPropertyOperation(oFF.UiProperty.AUTHOR, author);
};
oFF.UiServerControl.prototype.setAutoFocus = function(autoFocus)
{
	oFF.DfUiGeneric.prototype.setAutoFocus.call( this , autoFocus);
	return this._addBooleanPropertyOperation(oFF.UiProperty.AUTO_FOCUS, autoFocus);
};
oFF.UiServerControl.prototype.setAutocomplete = function(autocomplete)
{
	oFF.DfUiGeneric.prototype.setAutocomplete.call( this , autocomplete);
	return this._addBooleanPropertyOperation(oFF.UiProperty.AUTOCOMPLETE, autocomplete);
};
oFF.UiServerControl.prototype.setAvatarColor = function(avatarColor)
{
	oFF.DfUiGeneric.prototype.setAvatarColor.call( this , avatarColor);
	return this._addConstantPropertyOperation(oFF.UiProperty.AVATAR_COLOR, avatarColor);
};
oFF.UiServerControl.prototype.setAvatarShape = function(avatarShape)
{
	oFF.DfUiGeneric.prototype.setAvatarShape.call( this , avatarShape);
	return this._addConstantPropertyOperation(oFF.UiProperty.AVATAR_SHAPE, avatarShape);
};
oFF.UiServerControl.prototype.setAvatarSize = function(avatarSize)
{
	oFF.DfUiGeneric.prototype.setAvatarSize.call( this , avatarSize);
	return this._addConstantPropertyOperation(oFF.UiProperty.AVATAR_SIZE, avatarSize);
};
oFF.UiServerControl.prototype.setBackgroundColor = function(backgroundColor)
{
	oFF.DfUiGeneric.prototype.setBackgroundColor.call( this , backgroundColor);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.BACKGROUND_COLOR, backgroundColor);
};
oFF.UiServerControl.prototype.setBackgroundDesign = function(backgroundDesign)
{
	oFF.DfUiGeneric.prototype.setBackgroundDesign.call( this , backgroundDesign);
	return this._addConstantPropertyOperation(oFF.UiProperty.BACKGROUND_DESIGN, backgroundDesign);
};
oFF.UiServerControl.prototype.setBackgroundImageSrc = function(src)
{
	oFF.DfUiGeneric.prototype.setBackgroundImageSrc.call( this , src);
	return this._addStringPropertyOperation(oFF.UiProperty.BACKGROUND_IMAGE_SRC, src);
};
oFF.UiServerControl.prototype.setBackgroundPosition = function(backgroundPosition)
{
	oFF.DfUiGeneric.prototype.setBackgroundPosition.call( this , backgroundPosition);
	return this._addStringPropertyOperation(oFF.UiProperty.BACKGROUND_POSITION, backgroundPosition);
};
oFF.UiServerControl.prototype.setBackgroundSize = function(backgroundSize)
{
	oFF.DfUiGeneric.prototype.setBackgroundSize.call( this , backgroundSize);
	return this._addStringPropertyOperation(oFF.UiProperty.BACKGROUND_SIZE, backgroundSize);
};
oFF.UiServerControl.prototype.setBadgeNumber = function(badgeNumber)
{
	oFF.DfUiGeneric.prototype.setBadgeNumber.call( this , badgeNumber);
	return this._addIntegerPropertyOperation(oFF.UiProperty.BADGE_NUMBER, badgeNumber);
};
oFF.UiServerControl.prototype.setBorderColor = function(borderColor)
{
	oFF.DfUiGeneric.prototype.setBorderColor.call( this , borderColor);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.BORDER_COLOR, borderColor);
};
oFF.UiServerControl.prototype.setBorderStyle = function(borderStyle)
{
	oFF.DfUiGeneric.prototype.setBorderStyle.call( this , borderStyle);
	return this._addConstantPropertyOperation(oFF.UiProperty.BORDER_STYLE, borderStyle);
};
oFF.UiServerControl.prototype.setBorderWidth = function(borderWidth)
{
	oFF.DfUiGeneric.prototype.setBorderWidth.call( this , borderWidth);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.BORDER_WIDTH, borderWidth);
};
oFF.UiServerControl.prototype.setBusy = function(busy)
{
	oFF.DfUiGeneric.prototype.setBusy.call( this , busy);
	return this._addBooleanPropertyOperation(oFF.UiProperty.BUSY, busy);
};
oFF.UiServerControl.prototype.setBusyDelay = function(busyDelay)
{
	oFF.DfUiGeneric.prototype.setBusyDelay.call( this , busyDelay);
	return this._addIntegerPropertyOperation(oFF.UiProperty.BUSY_DELAY, busyDelay);
};
oFF.UiServerControl.prototype.setBusyIndicatorSize = function(busyIndicatorSize)
{
	oFF.DfUiGeneric.prototype.setBusyIndicatorSize.call( this , busyIndicatorSize);
	return this._addConstantPropertyOperation(oFF.UiProperty.BUSY_INDICATOR_SIZE, busyIndicatorSize);
};
oFF.UiServerControl.prototype.setButtonType = function(buttonType)
{
	oFF.DfUiGeneric.prototype.setButtonType.call( this , buttonType);
	return this._addConstantPropertyOperation(oFF.UiProperty.BUTTON_TYPE, buttonType);
};
oFF.UiServerControl.prototype.setCarouselArrowsPlacement = function(carouselArrowsPlacement)
{
	oFF.DfUiGeneric.prototype.setCarouselArrowsPlacement.call( this , carouselArrowsPlacement);
	return this._addConstantPropertyOperation(oFF.UiProperty.CAROUSEL_ARROWS_PLACEMENT, carouselArrowsPlacement);
};
oFF.UiServerControl.prototype.setChartType = function(chartType)
{
	oFF.DfUiGeneric.prototype.setChartType.call( this , chartType);
	return this._addConstantPropertyOperation(oFF.UiProperty.CHART_TYPE, chartType);
};
oFF.UiServerControl.prototype.setChecked = function(checked)
{
	oFF.DfUiGeneric.prototype.setChecked.call( this , checked);
	return this._addBooleanPropertyOperation(oFF.UiProperty.CHECKED, checked);
};
oFF.UiServerControl.prototype.setCloseable = function(isCloseable)
{
	oFF.DfUiGeneric.prototype.setCloseable.call( this , isCloseable);
	return this._addBooleanPropertyOperation(oFF.UiProperty.CLOSEABLE, isCloseable);
};
oFF.UiServerControl.prototype.setCodeType = function(codeType)
{
	oFF.DfUiGeneric.prototype.setCodeType.call( this , codeType);
	return this._addStringPropertyOperation(oFF.UiProperty.CODE_TYPE, codeType);
};
oFF.UiServerControl.prototype.setColor = function(color)
{
	oFF.DfUiGeneric.prototype.setColor.call( this , color);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.COLOR, color);
};
oFF.UiServerControl.prototype.setColorPickerDisplayMode = function(colorPickerDisplayMode)
{
	oFF.DfUiGeneric.prototype.setColorPickerDisplayMode.call( this , colorPickerDisplayMode);
	return this._addConstantPropertyOperation(oFF.UiProperty.COLOR_PICKER_DISPLAY_MODE, colorPickerDisplayMode);
};
oFF.UiServerControl.prototype.setColorPickerMode = function(colorPickerMode)
{
	oFF.DfUiGeneric.prototype.setColorPickerMode.call( this , colorPickerMode);
	return this._addConstantPropertyOperation(oFF.UiProperty.COLOR_PICKER_MODE, colorPickerMode);
};
oFF.UiServerControl.prototype.setColorString = function(colorString)
{
	oFF.DfUiGeneric.prototype.setColorString.call( this , colorString);
	return this._addStringPropertyOperation(oFF.UiProperty.COLOR_STRING, colorString);
};
oFF.UiServerControl.prototype.setColorTheme = function(colorTheme)
{
	oFF.DfUiGeneric.prototype.setColorTheme.call( this , colorTheme);
	return this._addStringPropertyOperation(oFF.UiProperty.COLOR_THEME, colorTheme);
};
oFF.UiServerControl.prototype.setColors = function(colors)
{
	oFF.DfUiGeneric.prototype.setColors.call( this , colors);
	return this._addListOfStringPropertyOperation(oFF.UiProperty.COLORS, colors);
};
oFF.UiServerControl.prototype.setColumnCount = function(columnCount)
{
	oFF.DfUiGeneric.prototype.setColumnCount.call( this , columnCount);
	return this._addIntegerPropertyOperation(oFF.UiProperty.COLUMN_COUNT, columnCount);
};
oFF.UiServerControl.prototype.setColumnResize = function(columnResize)
{
	oFF.DfUiGeneric.prototype.setColumnResize.call( this , columnResize);
	return this._addBooleanPropertyOperation(oFF.UiProperty.COLUMN_RESIZE, columnResize);
};
oFF.UiServerControl.prototype.setCommandHistory = function(commandList)
{
	oFF.DfUiGeneric.prototype.setCommandHistory.call( this , commandList);
	return this._addListOfStringPropertyOperation(oFF.UiProperty.COMMAND_HISTORY, commandList);
};
oFF.UiServerControl.prototype.setContent = function(content)
{
	oFF.DfUiGeneric.prototype.setContent.call( this , content);
	return this._addControlPropertyOperation(oFF.UiProperty.CONTENT, content);
};
oFF.UiServerControl.prototype.setContentOnlyBusy = function(contentOnlyBusy)
{
	oFF.DfUiGeneric.prototype.setContentOnlyBusy.call( this , contentOnlyBusy);
	return this._addBooleanPropertyOperation(oFF.UiProperty.CONTENT_ONLY_BUSY, contentOnlyBusy);
};
oFF.UiServerControl.prototype.setCornerRadius = function(cornerRadius)
{
	oFF.DfUiGeneric.prototype.setCornerRadius.call( this , cornerRadius);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.CORNER_RADIUS, cornerRadius);
};
oFF.UiServerControl.prototype.setCount = function(count)
{
	oFF.DfUiGeneric.prototype.setCount.call( this , count);
	return this._addStringPropertyOperation(oFF.UiProperty.COUNT, count);
};
oFF.UiServerControl.prototype.setCounter = function(counter)
{
	oFF.DfUiGeneric.prototype.setCounter.call( this , counter);
	return this._addIntegerPropertyOperation(oFF.UiProperty.COUNTER, counter);
};
oFF.UiServerControl.prototype.setCurrentLocationText = function(text)
{
	oFF.DfUiGeneric.prototype.setCurrentLocationText.call( this , text);
	return this._addStringPropertyOperation(oFF.UiProperty.CURRENT_LOCATION_TEXT, text);
};
oFF.UiServerControl.prototype.setCursorPosition = function(cursorPosition)
{
	oFF.DfUiGeneric.prototype.setCursorPosition.call( this , cursorPosition);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.CURSOR_POSITION, cursorPosition);
};
oFF.UiServerControl.prototype.setCustomCompleter = function(customCompleter)
{
	oFF.DfUiGeneric.prototype.setCustomCompleter.call( this , customCompleter);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.CUSTOM_COMPLETER, customCompleter);
};
oFF.UiServerControl.prototype.setCustomParameters = function(customParameters)
{
	oFF.DfUiGeneric.prototype.setCustomParameters.call( this , customParameters);
	return this._addJsonPropertyOperation(oFF.UiProperty.CUSTOM_PARAMETERS, customParameters);
};
oFF.UiServerControl.prototype.setDataManifest = function(dataManifest)
{
	oFF.DfUiGeneric.prototype.setDataManifest.call( this , dataManifest);
	this._addJsonPropertyOperation(oFF.UiProperty.DATA_MANIFEST, dataManifest);
};
oFF.UiServerControl.prototype.setDecorative = function(decorative)
{
	oFF.DfUiGeneric.prototype.setDecorative.call( this , decorative);
	return this._addBooleanPropertyOperation(oFF.UiProperty.DECORATIVE, decorative);
};
oFF.UiServerControl.prototype.setDefaultColorString = function(colorString)
{
	oFF.DfUiGeneric.prototype.setDefaultColorString.call( this , colorString);
	return this._addStringPropertyOperation(oFF.UiProperty.DEFAULT_COLOR_STRING, colorString);
};
oFF.UiServerControl.prototype.setDescription = function(description)
{
	oFF.DfUiGeneric.prototype.setDescription.call( this , description);
	return this._addStringPropertyOperation(oFF.UiProperty.DESCRIPTION, description);
};
oFF.UiServerControl.prototype.setDirection = function(direction)
{
	oFF.DfUiGeneric.prototype.setDirection.call( this , direction);
	return this._addConstantPropertyOperation(oFF.UiProperty.DIRECTION, direction);
};
oFF.UiServerControl.prototype.setDisplayFormat = function(displayFormat)
{
	oFF.DfUiGeneric.prototype.setDisplayFormat.call( this , displayFormat);
	return this._addStringPropertyOperation(oFF.UiProperty.DISPLAY_FORMAT, displayFormat);
};
oFF.UiServerControl.prototype.setDisplayOnly = function(displayOnly)
{
	oFF.DfUiGeneric.prototype.setDisplayOnly.call( this , displayOnly);
	return this._addBooleanPropertyOperation(oFF.UiProperty.DISPLAY_ONLY, displayOnly);
};
oFF.UiServerControl.prototype.setDisplaySize = function(displaySize)
{
	oFF.DfUiGeneric.prototype.setDisplaySize.call( this , displaySize);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.DISPLAY_SIZE, displaySize);
};
oFF.UiServerControl.prototype.setDraggable = function(draggable)
{
	oFF.DfUiGeneric.prototype.setDraggable.call( this , draggable);
	return this._addBooleanPropertyOperation(oFF.UiProperty.DRAGGABLE, draggable);
};
oFF.UiServerControl.prototype.setDropCondition = function(dropCondition)
{
	oFF.DfUiGeneric.prototype.setDropCondition.call( this , dropCondition);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.DROP_CONDITION, dropCondition);
};
oFF.UiServerControl.prototype.setDropInfo = function(dropInfo)
{
	oFF.DfUiGeneric.prototype.setDropInfo.call( this , dropInfo);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.DROP_INFO, dropInfo);
};
oFF.UiServerControl.prototype.setDuration = function(duration)
{
	oFF.DfUiGeneric.prototype.setDuration.call( this , duration);
	return this._addIntegerPropertyOperation(oFF.UiProperty.DURATION, duration);
};
oFF.UiServerControl.prototype.setEditable = function(editable)
{
	oFF.DfUiGeneric.prototype.setEditable.call( this , editable);
	return this._addBooleanPropertyOperation(oFF.UiProperty.EDITABLE, editable);
};
oFF.UiServerControl.prototype.setElapsedTimeText = function(elapsedTimeText)
{
	oFF.DfUiGeneric.prototype.setElapsedTimeText.call( this , elapsedTimeText);
	return this._addStringPropertyOperation(oFF.UiProperty.ELAPSED_TIME_TEXT, elapsedTimeText);
};
oFF.UiServerControl.prototype.setElementStatus = function(elementStatus)
{
	oFF.DfUiGeneric.prototype.setElementStatus.call( this , elementStatus);
	return this._addConstantPropertyOperation(oFF.UiProperty.ELEMENT_STATUS, elementStatus);
};
oFF.UiServerControl.prototype.setEmphasized = function(emphasized)
{
	oFF.DfUiGeneric.prototype.setEmphasized.call( this , emphasized);
	return this._addBooleanPropertyOperation(oFF.UiProperty.EMPHASIZED, emphasized);
};
oFF.UiServerControl.prototype.setEnableDefaultTitleAndDescription = function(enableDefaultTitleAndDescription)
{
	oFF.DfUiGeneric.prototype.setEnableDefaultTitleAndDescription.call( this , enableDefaultTitleAndDescription);
	return this._addBooleanPropertyOperation(oFF.UiProperty.ENABLE_DEFAULT_TITLE_AND_DESCRIPTION, enableDefaultTitleAndDescription);
};
oFF.UiServerControl.prototype.setEnableReordering = function(enableReordering)
{
	oFF.DfUiGeneric.prototype.setEnableReordering.call( this , enableReordering);
	return this._addBooleanPropertyOperation(oFF.UiProperty.ENABLE_REORDERING, enableReordering);
};
oFF.UiServerControl.prototype.setEnableScrolling = function(enableScrolling)
{
	oFF.DfUiGeneric.prototype.setEnableScrolling.call( this , enableScrolling);
	return this._addBooleanPropertyOperation(oFF.UiProperty.ENABLE_SCROLLING, enableScrolling);
};
oFF.UiServerControl.prototype.setEnableWheelZoom = function(enableWheelZoom)
{
	oFF.DfUiGeneric.prototype.setEnableWheelZoom.call( this , enableWheelZoom);
	return this._addBooleanPropertyOperation(oFF.UiProperty.ENABLE_WHEEL_ZOOM, enableWheelZoom);
};
oFF.UiServerControl.prototype.setEnabled = function(enabled)
{
	oFF.DfUiGeneric.prototype.setEnabled.call( this , enabled);
	return this._addBooleanPropertyOperation(oFF.UiProperty.ENABLED, enabled);
};
oFF.UiServerControl.prototype.setEndDate = function(endDate)
{
	oFF.DfUiGeneric.prototype.setEndDate.call( this , endDate);
	return this._addStringPropertyOperation(oFF.UiProperty.END_DATE, endDate);
};
oFF.UiServerControl.prototype.setEndLink = function(link)
{
	oFF.DfUiGeneric.prototype.setEndLink.call( this , link);
	return this._addControlPropertyOperation(oFF.UiProperty.END_LINK, link);
};
oFF.UiServerControl.prototype.setExpandable = function(expandable)
{
	oFF.DfUiGeneric.prototype.setExpandable.call( this , expandable);
	return this._addBooleanPropertyOperation(oFF.UiProperty.EXPANDABLE, expandable);
};
oFF.UiServerControl.prototype.setExpanded = function(isExpanded)
{
	oFF.DfUiGeneric.prototype.setExpanded.call( this , isExpanded);
	return this._addBooleanPropertyOperation(oFF.UiProperty.EXPANDED, isExpanded);
};
oFF.UiServerControl.prototype.setFilterSuggests = function(filterSuggests)
{
	oFF.DfUiGeneric.prototype.setFilterSuggests.call( this , filterSuggests);
	return this._addBooleanPropertyOperation(oFF.UiProperty.FILTER_SUGGESTS, filterSuggests);
};
oFF.UiServerControl.prototype.setFirstDayOfWeek = function(firstDayOfWeek)
{
	oFF.DfUiGeneric.prototype.setFirstDayOfWeek.call( this , firstDayOfWeek);
	return this._addIntegerPropertyOperation(oFF.UiProperty.FIRST_DAY_OF_WEEK, firstDayOfWeek);
};
oFF.UiServerControl.prototype.setFirstVisibleRow = function(firstVisibleRow)
{
	oFF.DfUiGeneric.prototype.setFirstVisibleRow.call( this , firstVisibleRow);
	return this._addControlPropertyOperation(oFF.UiProperty.FIRST_VISIBLE_ROW, firstVisibleRow);
};
oFF.UiServerControl.prototype.setFixedNavList = function(navList)
{
	oFF.DfUiGeneric.prototype.setFixedNavList.call( this , navList);
	return this._addControlPropertyOperation(oFF.UiProperty.FIXED_NAV_LIST, navList);
};
oFF.UiServerControl.prototype.setFlex = function(flex)
{
	oFF.DfUiGeneric.prototype.setFlex.call( this , flex);
	return this._addStringPropertyOperation(oFF.UiProperty.FLEX, flex);
};
oFF.UiServerControl.prototype.setFloatingFooter = function(floatingFooter)
{
	oFF.DfUiGeneric.prototype.setFloatingFooter.call( this , floatingFooter);
	return this._addBooleanPropertyOperation(oFF.UiProperty.FLOATING_FOOTER, floatingFooter);
};
oFF.UiServerControl.prototype.setFontColor = function(fontColor)
{
	oFF.DfUiGeneric.prototype.setFontColor.call( this , fontColor);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.FONT_COLOR, fontColor);
};
oFF.UiServerControl.prototype.setFontFamily = function(fontFamily)
{
	oFF.DfUiGeneric.prototype.setFontFamily.call( this , fontFamily);
	return this._addStringPropertyOperation(oFF.UiProperty.FONT_FAMILY, fontFamily);
};
oFF.UiServerControl.prototype.setFontSize = function(fontSize)
{
	oFF.DfUiGeneric.prototype.setFontSize.call( this , fontSize);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.FONT_SIZE, fontSize);
};
oFF.UiServerControl.prototype.setFontStyle = function(fontStyle)
{
	oFF.DfUiGeneric.prototype.setFontStyle.call( this , fontStyle);
	return this._addConstantPropertyOperation(oFF.UiProperty.FONT_STYLE, fontStyle);
};
oFF.UiServerControl.prototype.setFontWeight = function(fontWeight)
{
	oFF.DfUiGeneric.prototype.setFontWeight.call( this , fontWeight);
	return this._addConstantPropertyOperation(oFF.UiProperty.FONT_WEIGHT, fontWeight);
};
oFF.UiServerControl.prototype.setFooter = function(footer)
{
	oFF.DfUiGeneric.prototype.setFooter.call( this , footer);
	return this._addControlPropertyOperation(oFF.UiProperty.FOOTER, footer);
};
oFF.UiServerControl.prototype.setFooterHeight = function(footerHeight)
{
	oFF.DfUiGeneric.prototype.setFooterHeight.call( this , footerHeight);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.FOOTER_HEIGHT, footerHeight);
};
oFF.UiServerControl.prototype.setFooterText = function(footerText)
{
	oFF.DfUiGeneric.prototype.setFooterText.call( this , footerText);
	return this._addStringPropertyOperation(oFF.UiProperty.FOOTER_TEXT, footerText);
};
oFF.UiServerControl.prototype.setFooterToolbar = function(toolbar)
{
	oFF.DfUiGeneric.prototype.setFooterToolbar.call( this , toolbar);
	return this._addControlPropertyOperation(oFF.UiProperty.FOOTER_TOOLBAR, toolbar);
};
oFF.UiServerControl.prototype.setFrameType = function(frameType)
{
	oFF.DfUiGeneric.prototype.setFrameType.call( this , frameType);
	return this._addConstantPropertyOperation(oFF.UiProperty.FRAME_TYPE, frameType);
};
oFF.UiServerControl.prototype.setFrom = function(from)
{
	oFF.DfUiGeneric.prototype.setFrom.call( this , from);
	return this._addStringPropertyOperation(oFF.UiProperty.FROM, from);
};
oFF.UiServerControl.prototype.setGap = function(gap)
{
	oFF.DfUiGeneric.prototype.setGap.call( this , gap);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.GAP, gap);
};
oFF.UiServerControl.prototype.setGridContainerSettings = function(gridContainerSettings)
{
	oFF.DfUiGeneric.prototype.setGridContainerSettings.call( this , gridContainerSettings);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.GRID_CONTAINER_SETTINGS, gridContainerSettings);
};
oFF.UiServerControl.prototype.setGridLayout = function(gridLayout)
{
	oFF.DfUiGeneric.prototype.setGridLayout.call( this , gridLayout);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.GRID_LAYOUT, gridLayout);
};
oFF.UiServerControl.prototype.setGroupItems = function(groupItems)
{
	oFF.DfUiGeneric.prototype.setGroupItems.call( this , groupItems);
	return this._addBooleanPropertyOperation(oFF.UiProperty.GROUP_ITEMS, groupItems);
};
oFF.UiServerControl.prototype.setGroupName = function(groupName)
{
	oFF.DfUiGeneric.prototype.setGroupName.call( this , groupName);
	return this._addStringPropertyOperation(oFF.UiProperty.GROUP_NAME, groupName);
};
oFF.UiServerControl.prototype.setGrowing = function(growing)
{
	oFF.DfUiGeneric.prototype.setGrowing.call( this , growing);
	return this._addBooleanPropertyOperation(oFF.UiProperty.GROWING, growing);
};
oFF.UiServerControl.prototype.setHeader = function(header)
{
	oFF.DfUiGeneric.prototype.setHeader.call( this , header);
	return this._addControlPropertyOperation(oFF.UiProperty.HEADER, header);
};
oFF.UiServerControl.prototype.setHeaderHeight = function(headerHeight)
{
	oFF.DfUiGeneric.prototype.setHeaderHeight.call( this , headerHeight);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.HEADER_HEIGHT, headerHeight);
};
oFF.UiServerControl.prototype.setHeaderMode = function(headerMode)
{
	oFF.DfUiGeneric.prototype.setHeaderMode.call( this , headerMode);
	return this._addConstantPropertyOperation(oFF.UiProperty.HEADER_MODE, headerMode);
};
oFF.UiServerControl.prototype.setHeaderPosition = function(headerPosition)
{
	oFF.DfUiGeneric.prototype.setHeaderPosition.call( this , headerPosition);
	return this._addConstantPropertyOperation(oFF.UiProperty.HEADER_POSITION, headerPosition);
};
oFF.UiServerControl.prototype.setHeaderToolbar = function(toolbar)
{
	oFF.DfUiGeneric.prototype.setHeaderToolbar.call( this , toolbar);
	return this._addControlPropertyOperation(oFF.UiProperty.HEADER_TOOLBAR, toolbar);
};
oFF.UiServerControl.prototype.setHeight = function(height)
{
	oFF.DfUiGeneric.prototype.setHeight.call( this , height);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.HEIGHT, height);
};
oFF.UiServerControl.prototype.setHighlight = function(messageType)
{
	oFF.DfUiGeneric.prototype.setHighlight.call( this , messageType);
	return this._addConstantPropertyOperation(oFF.UiProperty.HIGHLIGHT, messageType);
};
oFF.UiServerControl.prototype.setHorizontalAlign = function(horizontalAlign)
{
	oFF.DfUiGeneric.prototype.setHorizontalAlign.call( this , horizontalAlign);
	return this._addConstantPropertyOperation(oFF.UiProperty.HORIZONTAL_ALIGN, horizontalAlign);
};
oFF.UiServerControl.prototype.setHorizontalScrolling = function(horizontalScrolling)
{
	oFF.DfUiGeneric.prototype.setHorizontalScrolling.call( this , horizontalScrolling);
	return this._addBooleanPropertyOperation(oFF.UiProperty.HORIZONTAL_SCROLLING, horizontalScrolling);
};
oFF.UiServerControl.prototype.setIcon = function(icon)
{
	oFF.DfUiGeneric.prototype.setIcon.call( this , icon);
	return this._addStringPropertyOperation(oFF.UiProperty.ICON, icon);
};
oFF.UiServerControl.prototype.setIconColor = function(iconColor)
{
	oFF.DfUiGeneric.prototype.setIconColor.call( this , iconColor);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.ICON_COLOR, iconColor);
};
oFF.UiServerControl.prototype.setIconSize = function(iconSize)
{
	oFF.DfUiGeneric.prototype.setIconSize.call( this , iconSize);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.ICON_SIZE, iconSize);
};
oFF.UiServerControl.prototype.setIllustrationSize = function(illustrationSize)
{
	oFF.DfUiGeneric.prototype.setIllustrationSize.call( this , illustrationSize);
	return this._addConstantPropertyOperation(oFF.UiProperty.ILLUSTRATION_SIZE, illustrationSize);
};
oFF.UiServerControl.prototype.setIllustrationType = function(illustrationType)
{
	oFF.DfUiGeneric.prototype.setIllustrationType.call( this , illustrationType);
	return this._addConstantPropertyOperation(oFF.UiProperty.ILLUSTRATION_TYPE, illustrationType);
};
oFF.UiServerControl.prototype.setImageMode = function(imageMode)
{
	oFF.DfUiGeneric.prototype.setImageMode.call( this , imageMode);
	return this._addConstantPropertyOperation(oFF.UiProperty.IMAGE_MODE, imageMode);
};
oFF.UiServerControl.prototype.setImageSrc = function(imageSrc)
{
	oFF.DfUiGeneric.prototype.setImageSrc.call( this , imageSrc);
	return this._addStringPropertyOperation(oFF.UiProperty.IMAGE_SRC, imageSrc);
};
oFF.UiServerControl.prototype.setIncludeItemInSelection = function(includeItemInSelection)
{
	oFF.DfUiGeneric.prototype.setIncludeItemInSelection.call( this , includeItemInSelection);
	return this._addBooleanPropertyOperation(oFF.UiProperty.INCLUDE_ITEM_IN_SELECTION, includeItemInSelection);
};
oFF.UiServerControl.prototype.setInfo = function(info)
{
	oFF.DfUiGeneric.prototype.setInfo.call( this , info);
	return this._addStringPropertyOperation(oFF.UiProperty.INFO, info);
};
oFF.UiServerControl.prototype.setInfoState = function(infoState)
{
	oFF.DfUiGeneric.prototype.setInfoState.call( this , infoState);
	return this._addConstantPropertyOperation(oFF.UiProperty.INFO_STATE, infoState);
};
oFF.UiServerControl.prototype.setInfoStateInverted = function(infoStateInverted)
{
	oFF.DfUiGeneric.prototype.setInfoStateInverted.call( this , infoStateInverted);
	return this._addBooleanPropertyOperation(oFF.UiProperty.INFO_STATE_INVERTED, infoStateInverted);
};
oFF.UiServerControl.prototype.setInitials = function(initials)
{
	oFF.DfUiGeneric.prototype.setInitials.call( this , initials);
	return this._addStringPropertyOperation(oFF.UiProperty.INITIALS, initials);
};
oFF.UiServerControl.prototype.setInputType = function(inputType)
{
	oFF.DfUiGeneric.prototype.setInputType.call( this , inputType);
	return this._addConstantPropertyOperation(oFF.UiProperty.INPUT_TYPE, inputType);
};
oFF.UiServerControl.prototype.setIntervalSelection = function(intervalSelection)
{
	oFF.DfUiGeneric.prototype.setIntervalSelection.call( this , intervalSelection);
	return this._addBooleanPropertyOperation(oFF.UiProperty.INTERVAL_SELECTION, intervalSelection);
};
oFF.UiServerControl.prototype.setJustifyContent = function(justifyContent)
{
	oFF.DfUiGeneric.prototype.setJustifyContent.call( this , justifyContent);
	return this._addConstantPropertyOperation(oFF.UiProperty.JUSTIFY_CONTENT, justifyContent);
};
oFF.UiServerControl.prototype.setKey = function(key)
{
	oFF.DfUiGeneric.prototype.setKey.call( this , key);
	return this._addStringPropertyOperation(oFF.UiProperty.KEY, key);
};
oFF.UiServerControl.prototype.setKeyboardConfiguration = function(keyboardConfiguration)
{
	oFF.DfUiGeneric.prototype.setKeyboardConfiguration.call( this , keyboardConfiguration);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.KEYBOARD_CONFIGURATION, keyboardConfiguration);
};
oFF.UiServerControl.prototype.setLayoutData = function(layoutData)
{
	oFF.DfUiGeneric.prototype.setLayoutData.call( this , layoutData);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.LAYOUT_DATA, layoutData);
};
oFF.UiServerControl.prototype.setLazyLoading = function(lazyLoading)
{
	oFF.DfUiGeneric.prototype.setLazyLoading.call( this , lazyLoading);
	return this._addBooleanPropertyOperation(oFF.UiProperty.LAZY_LOADING, lazyLoading);
};
oFF.UiServerControl.prototype.setListItemType = function(listItemType)
{
	oFF.DfUiGeneric.prototype.setListItemType.call( this , listItemType);
	return this._addConstantPropertyOperation(oFF.UiProperty.LIST_ITEM_TYPE, listItemType);
};
oFF.UiServerControl.prototype.setListSeparators = function(listSeparators)
{
	oFF.DfUiGeneric.prototype.setListSeparators.call( this , listSeparators);
	return this._addConstantPropertyOperation(oFF.UiProperty.LIST_SEPARATORS, listSeparators);
};
oFF.UiServerControl.prototype.setLoadState = function(loadState)
{
	oFF.DfUiGeneric.prototype.setLoadState.call( this , loadState);
	return this._addConstantPropertyOperation(oFF.UiProperty.LOAD_STATE, loadState);
};
oFF.UiServerControl.prototype.setMargin = function(margin)
{
	oFF.DfUiGeneric.prototype.setMargin.call( this , margin);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.MARGIN, margin);
};
oFF.UiServerControl.prototype.setMaxChips = function(maxChips)
{
	oFF.DfUiGeneric.prototype.setMaxChips.call( this , maxChips);
	return this._addIntegerPropertyOperation(oFF.UiProperty.MAX_CHIPS, maxChips);
};
oFF.UiServerControl.prototype.setMaxDate = function(maxDate)
{
	oFF.DfUiGeneric.prototype.setMaxDate.call( this , maxDate);
	return this._addStringPropertyOperation(oFF.UiProperty.MAX_DATE, maxDate);
};
oFF.UiServerControl.prototype.setMaxHeight = function(maxHeight)
{
	oFF.DfUiGeneric.prototype.setMaxHeight.call( this , maxHeight);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.MAX_HEIGHT, maxHeight);
};
oFF.UiServerControl.prototype.setMaxLength = function(maxLength)
{
	oFF.DfUiGeneric.prototype.setMaxLength.call( this , maxLength);
	return this._addIntegerPropertyOperation(oFF.UiProperty.MAX_LENGTH, maxLength);
};
oFF.UiServerControl.prototype.setMaxLines = function(maxLines)
{
	oFF.DfUiGeneric.prototype.setMaxLines.call( this , maxLines);
	return this._addIntegerPropertyOperation(oFF.UiProperty.MAX_LINES, maxLines);
};
oFF.UiServerControl.prototype.setMaxWidth = function(maxWidth)
{
	oFF.DfUiGeneric.prototype.setMaxWidth.call( this , maxWidth);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.MAX_WIDTH, maxWidth);
};
oFF.UiServerControl.prototype.setMenu = function(menu)
{
	oFF.DfUiGeneric.prototype.setMenu.call( this , menu);
	return this._addControlPropertyOperation(oFF.UiProperty.MENU, menu);
};
oFF.UiServerControl.prototype.setMenuButtonMode = function(buttonMode)
{
	oFF.DfUiGeneric.prototype.setMenuButtonMode.call( this , buttonMode);
	return this._addConstantPropertyOperation(oFF.UiProperty.MENU_BUTTON_MODE, buttonMode);
};
oFF.UiServerControl.prototype.setMergeUndoDeltas = function(mergeUndoDeltas)
{
	oFF.DfUiGeneric.prototype.setMergeUndoDeltas.call( this , mergeUndoDeltas);
	return this._addBooleanPropertyOperation(oFF.UiProperty.MERGE_UNDO_DELTAS, mergeUndoDeltas);
};
oFF.UiServerControl.prototype.setMessageType = function(messageType)
{
	oFF.DfUiGeneric.prototype.setMessageType.call( this , messageType);
	return this._addConstantPropertyOperation(oFF.UiProperty.MESSAGE_TYPE, messageType);
};
oFF.UiServerControl.prototype.setMinDate = function(minDate)
{
	oFF.DfUiGeneric.prototype.setMinDate.call( this , minDate);
	return this._addStringPropertyOperation(oFF.UiProperty.MIN_DATE, minDate);
};
oFF.UiServerControl.prototype.setMinHeight = function(minHeight)
{
	oFF.DfUiGeneric.prototype.setMinHeight.call( this , minHeight);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.MIN_HEIGHT, minHeight);
};
oFF.UiServerControl.prototype.setMinWidth = function(minWidth)
{
	oFF.DfUiGeneric.prototype.setMinWidth.call( this , minWidth);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.MIN_WIDTH, minWidth);
};
oFF.UiServerControl.prototype.setMinutesInterval = function(minInterval)
{
	oFF.DfUiGeneric.prototype.setMinutesInterval.call( this , minInterval);
	return this._addIntegerPropertyOperation(oFF.UiProperty.MINUTES_INTERVAL, minInterval);
};
oFF.UiServerControl.prototype.setModal = function(modal)
{
	oFF.DfUiGeneric.prototype.setModal.call( this , modal);
	return this._addBooleanPropertyOperation(oFF.UiProperty.MODAL, modal);
};
oFF.UiServerControl.prototype.setModelJson = function(model)
{
	oFF.DfUiGeneric.prototype.setModelJson.call( this , model);
	return this._addJsonPropertyOperation(oFF.UiProperty.MODEL_JSON, model);
};
oFF.UiServerControl.prototype.setModified = function(modified)
{
	oFF.DfUiGeneric.prototype.setModified.call( this , modified);
	return this._addBooleanPropertyOperation(oFF.UiProperty.MODIFIED, modified);
};
oFF.UiServerControl.prototype.setMultiSelectMode = function(multiSelectMode)
{
	oFF.DfUiGeneric.prototype.setMultiSelectMode.call( this , multiSelectMode);
	return this._addConstantPropertyOperation(oFF.UiProperty.MULTI_SELECT_MODE, multiSelectMode);
};
oFF.UiServerControl.prototype.setName = function(name)
{
	oFF.DfUiGeneric.prototype.setName.call( this , name);
	return this._addStringPropertyOperation(oFF.UiProperty.NAME, name);
};
oFF.UiServerControl.prototype.setNavList = function(navList)
{
	oFF.DfUiGeneric.prototype.setNavList.call( this , navList);
	return this._addControlPropertyOperation(oFF.UiProperty.NAV_LIST, navList);
};
oFF.UiServerControl.prototype.setNoDataText = function(noDataText)
{
	oFF.DfUiGeneric.prototype.setNoDataText.call( this , noDataText);
	return this._addStringPropertyOperation(oFF.UiProperty.NO_DATA_TEXT, noDataText);
};
oFF.UiServerControl.prototype.setNode = function(isNode)
{
	oFF.DfUiGeneric.prototype.setNode.call( this , isNode);
	return this._addBooleanPropertyOperation(oFF.UiProperty.NODE, isNode);
};
oFF.UiServerControl.prototype.setNodeShape = function(nodeShape)
{
	oFF.DfUiGeneric.prototype.setNodeShape.call( this , nodeShape);
	return this._addConstantPropertyOperation(oFF.UiProperty.NODE_SHAPE, nodeShape);
};
oFF.UiServerControl.prototype.setOffText = function(offText)
{
	oFF.DfUiGeneric.prototype.setOffText.call( this , offText);
	return this._addStringPropertyOperation(oFF.UiProperty.OFF_TEXT, offText);
};
oFF.UiServerControl.prototype.setOn = function(isOn)
{
	oFF.DfUiGeneric.prototype.setOn.call( this , isOn);
	return this._addBooleanPropertyOperation(oFF.UiProperty.ON, isOn);
};
oFF.UiServerControl.prototype.setOnText = function(onText)
{
	oFF.DfUiGeneric.prototype.setOnText.call( this , onText);
	return this._addStringPropertyOperation(oFF.UiProperty.ON_TEXT, onText);
};
oFF.UiServerControl.prototype.setOpacity = function(opacity)
{
	oFF.DfUiGeneric.prototype.setOpacity.call( this , opacity);
	return this._addDoublePropertyOperation(oFF.UiProperty.OPACITY, opacity);
};
oFF.UiServerControl.prototype.setOrder = function(order)
{
	oFF.DfUiGeneric.prototype.setOrder.call( this , order);
	return this._addIntegerPropertyOperation(oFF.UiProperty.ORDER, order);
};
oFF.UiServerControl.prototype.setOrientation = function(orientation)
{
	oFF.DfUiGeneric.prototype.setOrientation.call( this , orientation);
	return this._addConstantPropertyOperation(oFF.UiProperty.ORIENTATION, orientation);
};
oFF.UiServerControl.prototype.setOverflow = function(overflow)
{
	oFF.DfUiGeneric.prototype.setOverflow.call( this , overflow);
	return this._addConstantPropertyOperation(oFF.UiProperty.OVERFLOW, overflow);
};
oFF.UiServerControl.prototype.setPadding = function(padding)
{
	oFF.DfUiGeneric.prototype.setPadding.call( this , padding);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.PADDING, padding);
};
oFF.UiServerControl.prototype.setPartiallyChecked = function(partiallyChecked)
{
	oFF.DfUiGeneric.prototype.setPartiallyChecked.call( this , partiallyChecked);
	return this._addBooleanPropertyOperation(oFF.UiProperty.PARTIALLY_CHECKED, partiallyChecked);
};
oFF.UiServerControl.prototype.setPath = function(path)
{
	oFF.DfUiGeneric.prototype.setPath.call( this , path);
	return this._addStringPropertyOperation(oFF.UiProperty.PATH, path);
};
oFF.UiServerControl.prototype.setPercentValue = function(value)
{
	oFF.DfUiGeneric.prototype.setPercentValue.call( this , value);
	return this._addDoublePropertyOperation(oFF.UiProperty.PERCENT_VALUE, value);
};
oFF.UiServerControl.prototype.setPlaceholder = function(placeholder)
{
	oFF.DfUiGeneric.prototype.setPlaceholder.call( this , placeholder);
	return this._addStringPropertyOperation(oFF.UiProperty.PLACEHOLDER, placeholder);
};
oFF.UiServerControl.prototype.setPlacement = function(placementType)
{
	oFF.DfUiGeneric.prototype.setPlacement.call( this , placementType);
	return this._addConstantPropertyOperation(oFF.UiProperty.PLACEMENT, placementType);
};
oFF.UiServerControl.prototype.setPressed = function(pressed)
{
	oFF.DfUiGeneric.prototype.setPressed.call( this , pressed);
	return this._addBooleanPropertyOperation(oFF.UiProperty.PRESSED, pressed);
};
oFF.UiServerControl.prototype.setPrimaryCalendarType = function(calendarType)
{
	oFF.DfUiGeneric.prototype.setPrimaryCalendarType.call( this , calendarType);
	return this._addConstantPropertyOperation(oFF.UiProperty.PRIMARY_CALENDAR_TYPE, calendarType);
};
oFF.UiServerControl.prototype.setPriority = function(priority)
{
	oFF.DfUiGeneric.prototype.setPriority.call( this , priority);
	return this._addConstantPropertyOperation(oFF.UiProperty.PRIORITY, priority);
};
oFF.UiServerControl.prototype.setPrompt = function(prompt)
{
	oFF.DfUiGeneric.prototype.setPrompt.call( this , prompt);
	return this._addStringPropertyOperation(oFF.UiProperty.PROMPT, prompt);
};
oFF.UiServerControl.prototype.setRequired = function(required)
{
	oFF.DfUiGeneric.prototype.setRequired.call( this , required);
	return this._addBooleanPropertyOperation(oFF.UiProperty.REQUIRED, required);
};
oFF.UiServerControl.prototype.setResizable = function(resizable)
{
	oFF.DfUiGeneric.prototype.setResizable.call( this , resizable);
	return this._addBooleanPropertyOperation(oFF.UiProperty.RESIZABLE, resizable);
};
oFF.UiServerControl.prototype.setRotation = function(rotation)
{
	oFF.DfUiGeneric.prototype.setRotation.call( this , rotation);
	return this._addIntegerPropertyOperation(oFF.UiProperty.ROTATION, rotation);
};
oFF.UiServerControl.prototype.setRowCount = function(rowCount)
{
	oFF.DfUiGeneric.prototype.setRowCount.call( this , rowCount);
	return this._addIntegerPropertyOperation(oFF.UiProperty.ROW_COUNT, rowCount);
};
oFF.UiServerControl.prototype.setRowMode = function(rowMode)
{
	oFF.DfUiGeneric.prototype.setRowMode.call( this , rowMode);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.ROW_MODE, rowMode);
};
oFF.UiServerControl.prototype.setSecondaryCalendarType = function(calendarType)
{
	oFF.DfUiGeneric.prototype.setSecondaryCalendarType.call( this , calendarType);
	return this._addConstantPropertyOperation(oFF.UiProperty.SECONDARY_CALENDAR_TYPE, calendarType);
};
oFF.UiServerControl.prototype.setSecondsInterval = function(secInterval)
{
	oFF.DfUiGeneric.prototype.setSecondsInterval.call( this , secInterval);
	return this._addIntegerPropertyOperation(oFF.UiProperty.SECONDS_INTERVAL, secInterval);
};
oFF.UiServerControl.prototype.setSectionStart = function(sectionStart)
{
	oFF.DfUiGeneric.prototype.setSectionStart.call( this , sectionStart);
	return this._addBooleanPropertyOperation(oFF.UiProperty.SECTION_START, sectionStart);
};
oFF.UiServerControl.prototype.setSelected = function(selected)
{
	oFF.DfUiGeneric.prototype.setSelected.call( this , selected);
	return this._addBooleanPropertyOperation(oFF.UiProperty.SELECTED, selected);
};
oFF.UiServerControl.prototype.setSelectedItem = function(item)
{
	oFF.DfUiGeneric.prototype.setSelectedItem.call( this , item);
	this._addUIOperationWithControlContext(oFF.UiRemoteProtocol.OP_SET_SELECTED_ITEM, item);
	return this;
};
oFF.UiServerControl.prototype.setSelectedItems = function(selectedItems)
{
	oFF.DfUiGeneric.prototype.setSelectedItems.call( this , selectedItems);
	this._addUIOperationWithControlContextList(oFF.UiRemoteProtocol.OP_SET_SELECTED_ITEMS, selectedItems);
	return this;
};
oFF.UiServerControl.prototype.setSelectionBehavior = function(selectionBehavior)
{
	oFF.DfUiGeneric.prototype.setSelectionBehavior.call( this , selectionBehavior);
	return this._addConstantPropertyOperation(oFF.UiProperty.SELECTION_BEHAVIOR, selectionBehavior);
};
oFF.UiServerControl.prototype.setSelectionMode = function(selectionMode)
{
	oFF.DfUiGeneric.prototype.setSelectionMode.call( this , selectionMode);
	return this._addConstantPropertyOperation(oFF.UiProperty.SELECTION_MODE, selectionMode);
};
oFF.UiServerControl.prototype.setSeparatorStyle = function(style)
{
	oFF.DfUiGeneric.prototype.setSeparatorStyle.call( this , style);
	return this._addConstantPropertyOperation(oFF.UiProperty.SEPARATOR_STYLE, style);
};
oFF.UiServerControl.prototype.setShortcutText = function(shortcutText)
{
	oFF.DfUiGeneric.prototype.setShortcutText.call( this , shortcutText);
	return this._addStringPropertyOperation(oFF.UiProperty.SHORTCUT_TEXT, shortcutText);
};
oFF.UiServerControl.prototype.setShowAddNewButton = function(showAddNewButton)
{
	oFF.DfUiGeneric.prototype.setShowAddNewButton.call( this , showAddNewButton);
	return this._addBooleanPropertyOperation(oFF.UiProperty.SHOW_ADD_NEW_BUTTON, showAddNewButton);
};
oFF.UiServerControl.prototype.setShowArrow = function(showArrow)
{
	oFF.DfUiGeneric.prototype.setShowArrow.call( this , showArrow);
	return this._addBooleanPropertyOperation(oFF.UiProperty.SHOW_ARROW, showArrow);
};
oFF.UiServerControl.prototype.setShowButtons = function(showButtons)
{
	oFF.DfUiGeneric.prototype.setShowButtons.call( this , showButtons);
	return this._addBooleanPropertyOperation(oFF.UiProperty.SHOW_BUTTONS, showButtons);
};
oFF.UiServerControl.prototype.setShowClearIcon = function(showClearIcon)
{
	oFF.DfUiGeneric.prototype.setShowClearIcon.call( this , showClearIcon);
	return this._addBooleanPropertyOperation(oFF.UiProperty.SHOW_CLEAR_ICON, showClearIcon);
};
oFF.UiServerControl.prototype.setShowCloseButton = function(showCloseButton)
{
	oFF.DfUiGeneric.prototype.setShowCloseButton.call( this , showCloseButton);
	return this._addBooleanPropertyOperation(oFF.UiProperty.SHOW_CLOSE_BUTTON, showCloseButton);
};
oFF.UiServerControl.prototype.setShowColon = function(showColon)
{
	oFF.DfUiGeneric.prototype.setShowColon.call( this , showColon);
	return this._addBooleanPropertyOperation(oFF.UiProperty.SHOW_COLON, showColon);
};
oFF.UiServerControl.prototype.setShowCurrentDateButton = function(showCurrentDateButton)
{
	oFF.DfUiGeneric.prototype.setShowCurrentDateButton.call( this , showCurrentDateButton);
	return this._addBooleanPropertyOperation(oFF.UiProperty.SHOW_CURRENT_DATE_BUTTON, showCurrentDateButton);
};
oFF.UiServerControl.prototype.setShowDefaultColorButton = function(showDefaultColorButton)
{
	oFF.DfUiGeneric.prototype.setShowDefaultColorButton.call( this , showDefaultColorButton);
	return this._addBooleanPropertyOperation(oFF.UiProperty.SHOW_DEFAULT_COLOR_BUTTON, showDefaultColorButton);
};
oFF.UiServerControl.prototype.setShowHeader = function(showHeader)
{
	oFF.DfUiGeneric.prototype.setShowHeader.call( this , showHeader);
	return this._addBooleanPropertyOperation(oFF.UiProperty.SHOW_HEADER, showHeader);
};
oFF.UiServerControl.prototype.setShowIcon = function(showIcon)
{
	oFF.DfUiGeneric.prototype.setShowIcon.call( this , showIcon);
	return this._addBooleanPropertyOperation(oFF.UiProperty.SHOW_ICON, showIcon);
};
oFF.UiServerControl.prototype.setShowLinkIcon = function(showLinkIcon)
{
	oFF.DfUiGeneric.prototype.setShowLinkIcon.call( this , showLinkIcon);
	return this._addBooleanPropertyOperation(oFF.UiProperty.SHOW_LINK_ICON, showLinkIcon);
};
oFF.UiServerControl.prototype.setShowMoreColorsButton = function(showMoreColorsButton)
{
	oFF.DfUiGeneric.prototype.setShowMoreColorsButton.call( this , showMoreColorsButton);
	return this._addBooleanPropertyOperation(oFF.UiProperty.SHOW_MORE_COLORS_BUTTON, showMoreColorsButton);
};
oFF.UiServerControl.prototype.setShowNavButton = function(showNavButton)
{
	oFF.DfUiGeneric.prototype.setShowNavButton.call( this , showNavButton);
	return this._addBooleanPropertyOperation(oFF.UiProperty.SHOW_NAV_BUTTON, showNavButton);
};
oFF.UiServerControl.prototype.setShowNoData = function(showNoData)
{
	oFF.DfUiGeneric.prototype.setShowNoData.call( this , showNoData);
	return this._addBooleanPropertyOperation(oFF.UiProperty.SHOW_NO_DATA, showNoData);
};
oFF.UiServerControl.prototype.setShowRecentColorsSection = function(showRecentColorsSection)
{
	oFF.DfUiGeneric.prototype.setShowRecentColorsSection.call( this , showRecentColorsSection);
	return this._addBooleanPropertyOperation(oFF.UiProperty.SHOW_RECENT_COLORS_SECTION, showRecentColorsSection);
};
oFF.UiServerControl.prototype.setShowSecondaryValues = function(showSecondaryValues)
{
	oFF.DfUiGeneric.prototype.setShowSecondaryValues.call( this , showSecondaryValues);
	return this._addBooleanPropertyOperation(oFF.UiProperty.SHOW_SECONDARY_VALUES, showSecondaryValues);
};
oFF.UiServerControl.prototype.setShowSelectAll = function(showSelectAll)
{
	oFF.DfUiGeneric.prototype.setShowSelectAll.call( this , showSelectAll);
	return this._addBooleanPropertyOperation(oFF.UiProperty.SHOW_SELECT_ALL, showSelectAll);
};
oFF.UiServerControl.prototype.setShowShowMoreButton = function(showShowMoreButton)
{
	oFF.DfUiGeneric.prototype.setShowShowMoreButton.call( this , showShowMoreButton);
	return this._addBooleanPropertyOperation(oFF.UiProperty.SHOW_SHOW_MORE_BUTTON, showShowMoreButton);
};
oFF.UiServerControl.prototype.setShowSorting = function(showSorting)
{
	oFF.DfUiGeneric.prototype.setShowSorting.call( this , showSorting);
	return this._addBooleanPropertyOperation(oFF.UiProperty.SHOW_SORTING, showSorting);
};
oFF.UiServerControl.prototype.setShowSubHeader = function(showSubHeader)
{
	oFF.DfUiGeneric.prototype.setShowSubHeader.call( this , showSubHeader);
	return this._addBooleanPropertyOperation(oFF.UiProperty.SHOW_SUB_HEADER, showSubHeader);
};
oFF.UiServerControl.prototype.setShowSuggestion = function(showSuggestion)
{
	oFF.DfUiGeneric.prototype.setShowSuggestion.call( this , showSuggestion);
	return this._addBooleanPropertyOperation(oFF.UiProperty.SHOW_SUGGESTION, showSuggestion);
};
oFF.UiServerControl.prototype.setShowValue = function(showValue)
{
	oFF.DfUiGeneric.prototype.setShowValue.call( this , showValue);
	return this._addBooleanPropertyOperation(oFF.UiProperty.SHOW_VALUE, showValue);
};
oFF.UiServerControl.prototype.setShowValueHelp = function(showValueHelp)
{
	oFF.DfUiGeneric.prototype.setShowValueHelp.call( this , showValueHelp);
	return this._addBooleanPropertyOperation(oFF.UiProperty.SHOW_VALUE_HELP, showValueHelp);
};
oFF.UiServerControl.prototype.setShowValueStateMessage = function(showValueStateMessage)
{
	oFF.DfUiGeneric.prototype.setShowValueStateMessage.call( this , showValueStateMessage);
	return this._addBooleanPropertyOperation(oFF.UiProperty.SHOW_VALUE_STATE_MESSAGE, showValueStateMessage);
};
oFF.UiServerControl.prototype.setSidePanelPosition = function(sidePanelPosition)
{
	oFF.DfUiGeneric.prototype.setSidePanelPosition.call( this , sidePanelPosition);
	return this._addConstantPropertyOperation(oFF.UiProperty.SIDE_PANEL_POSITION, sidePanelPosition);
};
oFF.UiServerControl.prototype.setSliderMaximum = function(maximum)
{
	oFF.DfUiGeneric.prototype.setSliderMaximum.call( this , maximum);
	return this._addIntegerPropertyOperation(oFF.UiProperty.SLIDER_MAXIMUM, maximum);
};
oFF.UiServerControl.prototype.setSliderMinimum = function(minimum)
{
	oFF.DfUiGeneric.prototype.setSliderMinimum.call( this , minimum);
	return this._addIntegerPropertyOperation(oFF.UiProperty.SLIDER_MINIMUM, minimum);
};
oFF.UiServerControl.prototype.setSliderStep = function(step)
{
	oFF.DfUiGeneric.prototype.setSliderStep.call( this , step);
	return this._addIntegerPropertyOperation(oFF.UiProperty.SLIDER_STEP, step);
};
oFF.UiServerControl.prototype.setSliderUpperValue = function(value)
{
	oFF.DfUiGeneric.prototype.setSliderUpperValue.call( this , value);
	return this._addIntegerPropertyOperation(oFF.UiProperty.SLIDER_UPPER_VALUE, value);
};
oFF.UiServerControl.prototype.setSliderValue = function(value)
{
	oFF.DfUiGeneric.prototype.setSliderValue.call( this , value);
	return this._addIntegerPropertyOperation(oFF.UiProperty.SLIDER_VALUE, value);
};
oFF.UiServerControl.prototype.setSortIndicator = function(sortOrder)
{
	oFF.DfUiGeneric.prototype.setSortIndicator.call( this , sortOrder);
	return this._addConstantPropertyOperation(oFF.UiProperty.SORT_INDICATOR, sortOrder);
};
oFF.UiServerControl.prototype.setSrc = function(src)
{
	oFF.DfUiGeneric.prototype.setSrc.call( this , src);
	return this._addStringPropertyOperation(oFF.UiProperty.SRC, src);
};
oFF.UiServerControl.prototype.setStartDate = function(startDate)
{
	oFF.DfUiGeneric.prototype.setStartDate.call( this , startDate);
	return this._addStringPropertyOperation(oFF.UiProperty.START_DATE, startDate);
};
oFF.UiServerControl.prototype.setState = function(state)
{
	oFF.DfUiGeneric.prototype.setState.call( this , state);
	return this._addConstantPropertyOperation(oFF.UiProperty.STATE, state);
};
oFF.UiServerControl.prototype.setStateJson = function(stateJson)
{
	oFF.DfUiGeneric.prototype.setStateJson.call( this , stateJson);
	return this._addJsonPropertyOperation(oFF.UiProperty.STATE_JSON, stateJson);
};
oFF.UiServerControl.prototype.setStateName = function(stateName)
{
	oFF.DfUiGeneric.prototype.setStateName.call( this , stateName);
	return this._addStringPropertyOperation(oFF.UiProperty.STATE_NAME, stateName);
};
oFF.UiServerControl.prototype.setSubHeader = function(subHeader)
{
	oFF.DfUiGeneric.prototype.setSubHeader.call( this , subHeader);
	return this._addControlPropertyOperation(oFF.UiProperty.SUB_HEADER, subHeader);
};
oFF.UiServerControl.prototype.setSubtitle = function(subtitle)
{
	oFF.DfUiGeneric.prototype.setSubtitle.call( this , subtitle);
	return this._addStringPropertyOperation(oFF.UiProperty.SUBTITLE, subtitle);
};
oFF.UiServerControl.prototype.setSyntaxHints = function(syntaxHints)
{
	oFF.DfUiGeneric.prototype.setSyntaxHints.call( this , syntaxHints);
	return this._addBooleanPropertyOperation(oFF.UiProperty.SYNTAX_HINTS, syntaxHints);
};
oFF.UiServerControl.prototype.setTableSelectionMode = function(tableSelectionMode)
{
	oFF.DfUiGeneric.prototype.setTableSelectionMode.call( this , tableSelectionMode);
	return this._addConstantPropertyOperation(oFF.UiProperty.TABLE_SELECTION_MODE, tableSelectionMode);
};
oFF.UiServerControl.prototype.setTag = function(tag)
{
	oFF.DfUiGeneric.prototype.setTag.call( this , tag);
	return this._addStringPropertyOperation(oFF.UiProperty.TAG, tag);
};
oFF.UiServerControl.prototype.setTarget = function(target)
{
	oFF.DfUiGeneric.prototype.setTarget.call( this , target);
	return this._addStringPropertyOperation(oFF.UiProperty.TARGET, target);
};
oFF.UiServerControl.prototype.setText = function(text)
{
	oFF.DfUiGeneric.prototype.setText.call( this , text);
	return this._addStringPropertyOperation(oFF.UiProperty.TEXT, text);
};
oFF.UiServerControl.prototype.setTextAlign = function(textAlign)
{
	oFF.DfUiGeneric.prototype.setTextAlign.call( this , textAlign);
	return this._addConstantPropertyOperation(oFF.UiProperty.TEXT_ALIGN, textAlign);
};
oFF.UiServerControl.prototype.setTextDecoration = function(textDecoration)
{
	oFF.DfUiGeneric.prototype.setTextDecoration.call( this , textDecoration);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.TEXT_DECORATION, textDecoration);
};
oFF.UiServerControl.prototype.setTileMode = function(tileMode)
{
	oFF.DfUiGeneric.prototype.setTileMode.call( this , tileMode);
	return this._addConstantPropertyOperation(oFF.UiProperty.TILE_MODE, tileMode);
};
oFF.UiServerControl.prototype.setTitle = function(title)
{
	oFF.DfUiGeneric.prototype.setTitle.call( this , title);
	return this._addStringPropertyOperation(oFF.UiProperty.TITLE, title);
};
oFF.UiServerControl.prototype.setTitleLevel = function(titleLevel)
{
	oFF.DfUiGeneric.prototype.setTitleLevel.call( this , titleLevel);
	return this._addConstantPropertyOperation(oFF.UiProperty.TITLE_LEVEL, titleLevel);
};
oFF.UiServerControl.prototype.setTitleStyle = function(titleStyle)
{
	oFF.DfUiGeneric.prototype.setTitleStyle.call( this , titleStyle);
	return this._addConstantPropertyOperation(oFF.UiProperty.TITLE_STYLE, titleStyle);
};
oFF.UiServerControl.prototype.setTo = function(to)
{
	oFF.DfUiGeneric.prototype.setTo.call( this , to);
	return this._addStringPropertyOperation(oFF.UiProperty.TO, to);
};
oFF.UiServerControl.prototype.setToolbarDesign = function(toolbarDesign)
{
	oFF.DfUiGeneric.prototype.setToolbarDesign.call( this , toolbarDesign);
	return this._addConstantPropertyOperation(oFF.UiProperty.TOOLBAR_DESIGN, toolbarDesign);
};
oFF.UiServerControl.prototype.setTooltip = function(tooltip)
{
	oFF.DfUiGeneric.prototype.setTooltip.call( this , tooltip);
	return this._addStringPropertyOperation(oFF.UiProperty.TOOLTIP, tooltip);
};
oFF.UiServerControl.prototype.setTruncate = function(truncate)
{
	oFF.DfUiGeneric.prototype.setTruncate.call( this , truncate);
	return this._addBooleanPropertyOperation(oFF.UiProperty.TRUNCATE, truncate);
};
oFF.UiServerControl.prototype.setUseDefaultActionOnly = function(useDefaultActionOnly)
{
	oFF.DfUiGeneric.prototype.setUseDefaultActionOnly.call( this , useDefaultActionOnly);
	return this._addBooleanPropertyOperation(oFF.UiProperty.USE_DEFAULT_ACTION_ONLY, useDefaultActionOnly);
};
oFF.UiServerControl.prototype.setValue = function(value)
{
	oFF.DfUiGeneric.prototype.setValue.call( this , value);
	return this._addStringPropertyOperation(oFF.UiProperty.VALUE, value);
};
oFF.UiServerControl.prototype.setValueFormat = function(valueFormat)
{
	oFF.DfUiGeneric.prototype.setValueFormat.call( this , valueFormat);
	return this._addStringPropertyOperation(oFF.UiProperty.VALUE_FORMAT, valueFormat);
};
oFF.UiServerControl.prototype.setValueHelpIcon = function(icon)
{
	oFF.DfUiGeneric.prototype.setValueHelpIcon.call( this , icon);
	return this._addStringPropertyOperation(oFF.UiProperty.VALUE_HELP_ICON, icon);
};
oFF.UiServerControl.prototype.setValueState = function(valueState)
{
	oFF.DfUiGeneric.prototype.setValueState.call( this , valueState);
	return this._addConstantPropertyOperation(oFF.UiProperty.VALUE_STATE, valueState);
};
oFF.UiServerControl.prototype.setValueStateText = function(valueStateText)
{
	oFF.DfUiGeneric.prototype.setValueStateText.call( this , valueStateText);
	return this._addStringPropertyOperation(oFF.UiProperty.VALUE_STATE_TEXT, valueStateText);
};
oFF.UiServerControl.prototype.setVerticalScrolling = function(verticalScrolling)
{
	oFF.DfUiGeneric.prototype.setVerticalScrolling.call( this , verticalScrolling);
	return this._addBooleanPropertyOperation(oFF.UiProperty.VERTICAL_SCROLLING, verticalScrolling);
};
oFF.UiServerControl.prototype.setVisible = function(visible)
{
	oFF.DfUiGeneric.prototype.setVisible.call( this , visible);
	return this._addBooleanPropertyOperation(oFF.UiProperty.VISIBLE, visible);
};
oFF.UiServerControl.prototype.setWidth = function(width)
{
	oFF.DfUiGeneric.prototype.setWidth.call( this , width);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.WIDTH, width);
};
oFF.UiServerControl.prototype.setWrap = function(wrap)
{
	oFF.DfUiGeneric.prototype.setWrap.call( this , wrap);
	return this._addConstantPropertyOperation(oFF.UiProperty.WRAP, wrap);
};
oFF.UiServerControl.prototype.setWrapping = function(wrapping)
{
	oFF.DfUiGeneric.prototype.setWrapping.call( this , wrapping);
	return this._addBooleanPropertyOperation(oFF.UiProperty.WRAPPING, wrapping);
};
oFF.UiServerControl.prototype.setX = function(x)
{
	oFF.DfUiGeneric.prototype.setX.call( this , x);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.X_POS, x);
};
oFF.UiServerControl.prototype.setY = function(y)
{
	oFF.DfUiGeneric.prototype.setY.call( this , y);
	return this._addSerializableObjectPropertyOperation(oFF.UiProperty.Y_POS, y);
};
oFF.UiServerControl.prototype.setup = function()
{
	oFF.DfUiGeneric.prototype.setup.call( this );
};
oFF.UiServerControl.prototype.shake = function()
{
	oFF.DfUiGeneric.prototype.shake.call( this );
	this._addMethodOperation(oFF.UiMethod.SHAKE);
	return this;
};
oFF.UiServerControl.prototype.show = function(animated, refControl)
{
	oFF.DfUiGeneric.prototype.show.call( this , animated, refControl);
	let params = this._addMethodOperation(oFF.UiMethod.SHOW);
	if (oFF.notNull(params))
	{
		params.addBoolean(animated);
		this._addContextOrNull(params, refControl);
	}
	return this;
};
oFF.UiServerControl.prototype.showResizerAtIndex = function(index)
{
	oFF.DfUiGeneric.prototype.showResizerAtIndex.call( this , index);
	let params = this._addMethodOperation(oFF.UiMethod.SHOW_RESIZER_AT_INDEX);
	if (oFF.notNull(params))
	{
		params.addInteger(index);
	}
	return this;
};
oFF.UiServerControl.prototype.showSuggestions = function()
{
	oFF.DfUiGeneric.prototype.showSuggestions.call( this );
	this._addMethodOperation(oFF.UiMethod.SHOW_SUGGESTIONS);
	return this;
};
oFF.UiServerControl.prototype.startReadLine = function(text, numOfChars)
{
	oFF.DfUiGeneric.prototype.startReadLine.call( this , text, numOfChars);
	let params = this._addMethodOperation(oFF.UiMethod.START_READ_LINE);
	if (oFF.notNull(params))
	{
		params.addString(text);
		params.addInteger(numOfChars);
	}
	return this;
};

oFF.UiCompositeRemote = function() {};
oFF.UiCompositeRemote.prototype = new oFF.UiComposite();
oFF.UiCompositeRemote.prototype._ff_c = "UiCompositeRemote";

oFF.UiCompositeRemote.create = function()
{
	let newObject = new oFF.UiCompositeRemote();
	newObject.setup();
	return newObject;
};
oFF.UiCompositeRemote.prototype.initializeComposite = function() {};

oFF.UiRemoteModule = function() {};
oFF.UiRemoteModule.prototype = new oFF.DfModule();
oFF.UiRemoteModule.prototype._ff_c = "UiRemoteModule";

oFF.UiRemoteModule.s_module = null;
oFF.UiRemoteModule.getInstance = function()
{
	if (oFF.isNull(oFF.UiRemoteModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.UiProgramModule.getInstance());
		oFF.UiRemoteModule.s_module = oFF.DfModule.startExt(new oFF.UiRemoteModule());
		oFF.UiRemoteAction.staticSetup();
		oFF.UiRemoteServerStatus.staticSetup();
		oFF.UiRemoteSyncReason.staticSetup();
		oFF.UiRemoteAsyncActionState.staticSetup();
		oFF.UiServerEvent.staticSetup();
		oFF.UiServerProgramState.staticSetup();
		oFF.SphereServer.staticSetup();
		oFF.ProgramRegistry.setProgramFactory(new oFF.SubSysGuiServerPrg());
		oFF.ProgramRegistry.setProgramFactory(new oFF.SphereClient());
		oFF.DfModule.stopExt(oFF.UiRemoteModule.s_module);
	}
	return oFF.UiRemoteModule.s_module;
};
oFF.UiRemoteModule.prototype.getName = function()
{
	return "ff2260.ui.remote";
};

oFF.UiRemoteModule.getInstance();

return oFF;
} );