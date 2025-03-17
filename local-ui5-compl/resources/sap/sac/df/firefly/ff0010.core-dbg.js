/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff0005.language.ext"
],
function(oFF)
{
"use strict";

oFF.XCompararorStringAsNumber = function() {};
oFF.XCompararorStringAsNumber.prototype = new oFF.XObject();
oFF.XCompararorStringAsNumber.prototype._ff_c = "XCompararorStringAsNumber";

oFF.XCompararorStringAsNumber.prototype.m_sortDirection = null;
oFF.XCompararorStringAsNumber.prototype.compare = function(o1, o2)
{
	let i1 = oFF.XInteger.convertFromString(o1);
	let i2 = oFF.XInteger.convertFromString(o2);
	if (i1 === i2)
	{
		return 0;
	}
	let result = 1;
	if (i1 < i2)
	{
		result = -1;
	}
	if (this.m_sortDirection === oFF.XSortDirection.DESCENDING)
	{
		return -result;
	}
	return result;
};
oFF.XCompararorStringAsNumber.prototype.setupExt = function(sortDirection)
{
	this.m_sortDirection = sortDirection;
};

oFF.XComparatorDouble = function() {};
oFF.XComparatorDouble.prototype = new oFF.XObject();
oFF.XComparatorDouble.prototype._ff_c = "XComparatorDouble";

oFF.XComparatorDouble.create = function()
{
	return new oFF.XComparatorDouble();
};
oFF.XComparatorDouble.prototype.compare = function(o1, o2)
{
	let s1 = o1.getDouble();
	let s2 = o2.getDouble();
	if (s1 === s2)
	{
		return 0;
	}
	else if (s1 > s2)
	{
		return 1;
	}
	else
	{
		return -1;
	}
};

oFF.XComparatorInteger = function() {};
oFF.XComparatorInteger.prototype = new oFF.XObject();
oFF.XComparatorInteger.prototype._ff_c = "XComparatorInteger";

oFF.XComparatorInteger.create = function()
{
	return new oFF.XComparatorInteger();
};
oFF.XComparatorInteger.prototype.compare = function(o1, o2)
{
	let s1 = o1.getInteger();
	let s2 = o2.getInteger();
	if (s1 === s2)
	{
		return 0;
	}
	else if (s1 > s2)
	{
		return 1;
	}
	else
	{
		return -1;
	}
};

oFF.XComparatorLambda = function() {};
oFF.XComparatorLambda.prototype = new oFF.XObject();
oFF.XComparatorLambda.prototype._ff_c = "XComparatorLambda";

oFF.XComparatorLambda.create = function(comparingLambda)
{
	let result = new oFF.XComparatorLambda();
	result.m_lambda = comparingLambda;
	return result;
};
oFF.XComparatorLambda.prototype.m_lambda = null;
oFF.XComparatorLambda.prototype.compare = function(o1, o2)
{
	return this.m_lambda(o1, o2).getInteger();
};

oFF.XComparatorLong = function() {};
oFF.XComparatorLong.prototype = new oFF.XObject();
oFF.XComparatorLong.prototype._ff_c = "XComparatorLong";

oFF.XComparatorLong.create = function()
{
	return new oFF.XComparatorLong();
};
oFF.XComparatorLong.prototype.compare = function(o1, o2)
{
	let s1 = o1.getLong();
	let s2 = o2.getLong();
	if (s1 === s2)
	{
		return 0;
	}
	else if (s1 > s2)
	{
		return 1;
	}
	else
	{
		return -1;
	}
};

oFF.XComparatorName = function() {};
oFF.XComparatorName.prototype = new oFF.XObject();
oFF.XComparatorName.prototype._ff_c = "XComparatorName";

oFF.XComparatorName.create = function()
{
	return new oFF.XComparatorName();
};
oFF.XComparatorName.prototype.compare = function(o1, o2)
{
	let s1 = o1.getName();
	let s2 = o2.getName();
	return oFF.XString.compare(s1, s2);
};

oFF.XComparatorString = function() {};
oFF.XComparatorString.prototype = new oFF.XObject();
oFF.XComparatorString.prototype._ff_c = "XComparatorString";

oFF.XComparatorString.create = function(descending)
{
	let comparator = new oFF.XComparatorString();
	comparator.m_descending = descending;
	return comparator;
};
oFF.XComparatorString.prototype.m_descending = false;
oFF.XComparatorString.prototype.compare = function(o1, o2)
{
	if (this.m_descending)
	{
		return oFF.XString.compare(o2.getString(), o1.getString());
	}
	return oFF.XString.compare(o1.getString(), o2.getString());
};

oFF.XComparatorWrapFunction = function() {};
oFF.XComparatorWrapFunction.prototype = new oFF.XObject();
oFF.XComparatorWrapFunction.prototype._ff_c = "XComparatorWrapFunction";

oFF.XComparatorWrapFunction.create = function(wrapFunction, targetComparator)
{
	let result = new oFF.XComparatorWrapFunction();
	result.m_wrapFunction = wrapFunction;
	result.m_comparator = targetComparator;
	return result;
};
oFF.XComparatorWrapFunction.prototype.m_comparator = null;
oFF.XComparatorWrapFunction.prototype.m_wrapFunction = null;
oFF.XComparatorWrapFunction.prototype.compare = function(o1, o2)
{
	return this.m_comparator.compare(this.m_wrapFunction(o1), this.m_wrapFunction(o2));
};

oFF.XIteratorWrapper = function() {};
oFF.XIteratorWrapper.prototype = new oFF.XObject();
oFF.XIteratorWrapper.prototype._ff_c = "XIteratorWrapper";

oFF.XIteratorWrapper.create = function(list)
{
	let newObject = new oFF.XIteratorWrapper();
	newObject.m_iterator = list;
	return newObject;
};
oFF.XIteratorWrapper.prototype.m_iterator = null;
oFF.XIteratorWrapper.prototype.hasNext = function()
{
	return this.m_iterator.hasNext();
};
oFF.XIteratorWrapper.prototype.next = function()
{
	return this.m_iterator.next();
};
oFF.XIteratorWrapper.prototype.releaseObject = function()
{
	this.m_iterator = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.XObjectIterator = function() {};
oFF.XObjectIterator.prototype = new oFF.XObject();
oFF.XObjectIterator.prototype._ff_c = "XObjectIterator";

oFF.XObjectIterator.create = function(list)
{
	let newObject = new oFF.XObjectIterator();
	newObject.m_list = list;
	newObject.m_index = -1;
	return newObject;
};
oFF.XObjectIterator.prototype.m_index = 0;
oFF.XObjectIterator.prototype.m_list = null;
oFF.XObjectIterator.prototype.getList = function()
{
	return this.m_list;
};
oFF.XObjectIterator.prototype.hasNext = function()
{
	return this.m_index + 1 < this.getList().size();
};
oFF.XObjectIterator.prototype.next = function()
{
	this.m_index++;
	return this.getList().get(this.m_index);
};
oFF.XObjectIterator.prototype.releaseObject = function()
{
	this.m_list = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.XUniversalIterator = function() {};
oFF.XUniversalIterator.prototype = new oFF.XObject();
oFF.XUniversalIterator.prototype._ff_c = "XUniversalIterator";

oFF.XUniversalIterator.create = function(list)
{
	let newObject = new oFF.XUniversalIterator();
	newObject.m_list = list;
	newObject.m_index = -1;
	return newObject;
};
oFF.XUniversalIterator.prototype.m_index = 0;
oFF.XUniversalIterator.prototype.m_list = null;
oFF.XUniversalIterator.prototype.getList = function()
{
	return this.m_list;
};
oFF.XUniversalIterator.prototype.hasNext = function()
{
	return this.m_index + 1 < this.getList().size();
};
oFF.XUniversalIterator.prototype.next = function()
{
	this.m_index++;
	return this.getList().get(this.m_index);
};
oFF.XUniversalIterator.prototype.releaseObject = function()
{
	this.m_list = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.XArrayUtils = {

	copyFromObjectArray:function(source, target, sourceOffset, targetOffset, length)
	{
			let sourcePos = sourceOffset;
		let targetPos = targetOffset;
		let value;
		for (let i = 0; i < length; i++)
		{
			value = source.get(sourcePos);
			target.set(targetPos, value);
			sourcePos++;
			targetPos++;
		}
	},
	copyFromStringArray:function(source, target, sourceOffset, targetOffset, length)
	{
			let sourcePos = sourceOffset;
		let targetPos = targetOffset;
		let value;
		for (let i = 0; i < length; i++)
		{
			value = source.get(sourcePos);
			target.set(targetPos, value);
			sourcePos++;
			targetPos++;
		}
	}
};

oFF.XListUtils = {

	addAllObjects:function(source, target)
	{
			let so = source;
		let to = target;
		if (oFF.notNull(source) && so !== to)
		{
			let list = source.getValuesAsReadOnlyList();
			let size = list.size();
			for (let i = 0; i < size; i++)
			{
				target.add(list.get(i));
			}
		}
	},
	addAllStrings:function(source, target)
	{
			if (oFF.notNull(source) && source !== target)
		{
			let list = source.getValuesAsReadOnlyList();
			let size = list.size();
			for (let i = 0; i < size; i++)
			{
				target.add(list.get(i));
			}
		}
	},
	areStringListsEqual:function(thisStringList, otherStringList)
	{
			if (oFF.isNull(otherStringList))
		{
			return false;
		}
		if (thisStringList === otherStringList)
		{
			return true;
		}
		if (thisStringList.size() !== otherStringList.size())
		{
			return false;
		}
		for (let idx = 0; idx < thisStringList.size(); idx++)
		{
			if (!oFF.XString.isEqual(thisStringList.get(idx), otherStringList.get(idx)))
			{
				return false;
			}
		}
		return true;
	},
	assertGetSetIndexValid:function(space, index)
	{
			if (index < 0 || index >= space.size())
		{
			throw oFF.XException.createIllegalArgumentException("illegal index");
		}
	},
	assertInsertIndexValid:function(space, index)
	{
			if (index < 0 || index > space.size())
		{
			throw oFF.XException.createIllegalArgumentException("illegal index");
		}
	},
	getIndexOf:function(list, element)
	{
			if (oFF.notNull(list))
		{
			let theSize = list.size();
			for (let i = 0; i < theSize; i++)
			{
				let listElement = list.get(i);
				if (oFF.XObject.areObjectsEqual(listElement, element))
				{
					return i;
				}
			}
		}
		return -1;
	},
	isListEquals:function(thisObject, otherObject)
	{
			if (thisObject === otherObject)
		{
			return true;
		}
		if (oFF.isNull(thisObject) || oFF.isNull(otherObject))
		{
			return false;
		}
		if (thisObject.size() !== otherObject.size())
		{
			return false;
		}
		for (let idx = 0; idx < thisObject.size(); idx++)
		{
			let thisItemObject = thisObject.get(idx);
			let otherItemObject = otherObject.get(idx);
			if (!oFF.XObject.areObjectsEqual(thisItemObject, otherItemObject))
			{
				return false;
			}
		}
		return true;
	},
	reorderList:function(list, orderedNames)
	{
			if (oFF.notNull(list) && oFF.notNull(orderedNames))
		{
			if (list.size() === orderedNames.size())
			{
				let existingOrder = list.getKeysAsReadOnlyList();
				if (existingOrder.size() === orderedNames.size())
				{
					let orderIsEqual = true;
					let name;
					for (let i = 0; i < orderedNames.size(); i++)
					{
						name = orderedNames.get(i);
						if (!oFF.XString.isEqual(name, existingOrder.get(i)))
						{
							orderIsEqual = false;
							break;
						}
					}
					if (orderIsEqual === false)
					{
						let element;
						let currentIndex;
						for (let j = 0; j < orderedNames.size(); j++)
						{
							name = orderedNames.get(j);
							element = list.getByKey(name);
							if (oFF.isNull(element))
							{
								return;
							}
						}
						for (let k = 0; k < orderedNames.size(); k++)
						{
							name = orderedNames.get(k);
							element = list.getByKey(name);
							currentIndex = list.getIndex(element);
							list.moveElement(currentIndex, k);
						}
					}
				}
			}
		}
	},
	sublist:function(source, target, beginIndex, endIndex)
	{
			for (let i = beginIndex; i <= endIndex; i++)
		{
			target.add(source.get(i));
		}
		return target;
	}
};

oFF.XMapUtils = {

	putAllObjects:function(source, target)
	{
			if (oFF.notNull(target) && oFF.notNull(source))
		{
			let iterator = source.getKeysAsIterator();
			while (iterator.hasNext())
			{
				let value = iterator.next();
				target.put(value, source.getByKey(value));
			}
			oFF.XObjectExt.release(iterator);
		}
		return target;
	},
	putAllObjectsByString:function(source, target)
	{
			if (oFF.notNull(source) && oFF.notNull(target))
		{
			let keys = source.getKeysAsReadOnlyList();
			let size = keys.size();
			let key;
			let value;
			for (let i = 0; i < size; i++)
			{
				key = keys.get(i);
				value = source.getByKey(key);
				target.put(key, value);
			}
		}
	},
	putAllStrings:function(source, target)
	{
			if (oFF.notNull(source) && oFF.notNull(target))
		{
			let keys = source.getKeysAsReadOnlyList();
			let size = keys.size();
			let key;
			let value;
			for (let i = 0; i < size; i++)
			{
				key = keys.get(i);
				value = source.getByKey(key);
				target.put(key, value);
			}
		}
	}
};

oFF.DfAbstractReadOnlyBinary = function() {};
oFF.DfAbstractReadOnlyBinary.prototype = new oFF.XObjectExt();
oFF.DfAbstractReadOnlyBinary.prototype._ff_c = "DfAbstractReadOnlyBinary";

oFF.DfAbstractReadOnlyBinary.prototype.isEmpty = function()
{
	return !this.hasElements();
};

oFF.DfAbstractArray = function() {};
oFF.DfAbstractArray.prototype = new oFF.XObject();
oFF.DfAbstractArray.prototype._ff_c = "DfAbstractArray";

oFF.DfAbstractArray.prototype.cloneExt = function(flags)
{
	return this.createArrayCopy();
};
oFF.DfAbstractArray.prototype.toString = function()
{
	let buffer = oFF.XStringBuffer.create();
	buffer.append("[");
	for (let i = 0; i < this.size(); i++)
	{
		if (i > 0)
		{
			buffer.append(",");
		}
		buffer.append(oFF.XString.convertToString(this.get(i)));
	}
	buffer.append("]");
	return buffer.toString();
};

oFF.DfAbstractKeyBagOfString = function() {};
oFF.DfAbstractKeyBagOfString.prototype = new oFF.DfAbstractReadOnlyBinary();
oFF.DfAbstractKeyBagOfString.prototype._ff_c = "DfAbstractKeyBagOfString";

oFF.DfAbstractKeyBagOfString.prototype.getKeysAsIterator = function()
{
	return this.getKeysAsReadOnlyList().getIterator();
};

oFF.XSortDirection = function() {};
oFF.XSortDirection.prototype = new oFF.XConstant();
oFF.XSortDirection.prototype._ff_c = "XSortDirection";

oFF.XSortDirection.ASCENDING = null;
oFF.XSortDirection.DEFAULT_VALUE = null;
oFF.XSortDirection.DESCENDING = null;
oFF.XSortDirection.DISABLED = null;
oFF.XSortDirection.NONE = null;
oFF.XSortDirection.isExplicit = function(direction)
{
	return direction === oFF.XSortDirection.DESCENDING || direction === oFF.XSortDirection.ASCENDING;
};
oFF.XSortDirection.staticSetup = function()
{
	oFF.XSortDirection.ASCENDING = oFF.XConstant.setupName(new oFF.XSortDirection(), "ASCENDING");
	oFF.XSortDirection.DESCENDING = oFF.XConstant.setupName(new oFF.XSortDirection(), "DESCENDING");
	oFF.XSortDirection.DEFAULT_VALUE = oFF.XConstant.setupName(new oFF.XSortDirection(), "DEFAULT");
	oFF.XSortDirection.NONE = oFF.XConstant.setupName(new oFF.XSortDirection(), "NONE");
	oFF.XSortDirection.DISABLED = oFF.XConstant.setupName(new oFF.XSortDirection(), "DISABLED");
};

oFF.DfAbstractMapByString = function() {};
oFF.DfAbstractMapByString.prototype = new oFF.DfAbstractKeyBagOfString();
oFF.DfAbstractMapByString.prototype._ff_c = "DfAbstractMapByString";

oFF.DfAbstractMapByString.prototype.cloneExt = function(flags)
{
	return this.createMapByStringCopy();
};
oFF.DfAbstractMapByString.prototype.getIterator = function()
{
	return this.getValuesAsReadOnlyList().getIterator();
};
oFF.DfAbstractMapByString.prototype.isEqualTo = function(other)
{
	if (oFF.isNull(other))
	{
		return false;
	}
	if (this === other)
	{
		return true;
	}
	let otherMap = other;
	if (this.size() !== otherMap.size())
	{
		return false;
	}
	let keys = this.getKeysAsIterator();
	while (keys.hasNext())
	{
		let key = keys.next();
		if (!otherMap.containsKey(key))
		{
			return false;
		}
		let thisValue = this.getByKey(key);
		let thatValue = otherMap.getByKey(key);
		if (!oFF.XObject.areObjectsEqual(thisValue, thatValue))
		{
			return false;
		}
	}
	oFF.XObjectExt.release(keys);
	return true;
};
oFF.DfAbstractMapByString.prototype.putAll = function(other)
{
	oFF.XMapUtils.putAllObjectsByString(other, this);
};
oFF.DfAbstractMapByString.prototype.putIfAbsent = function(key, element)
{
	let existingElement = this.getByKey(key);
	if (oFF.isNull(existingElement))
	{
		this.put(key, element);
	}
};
oFF.DfAbstractMapByString.prototype.putIfNotNull = function(key, element)
{
	if (oFF.notNull(element))
	{
		this.put(key, element);
	}
};

oFF.DfAbstractSetOfString = function() {};
oFF.DfAbstractSetOfString.prototype = new oFF.DfAbstractReadOnlyBinary();
oFF.DfAbstractSetOfString.prototype._ff_c = "DfAbstractSetOfString";

oFF.DfAbstractSetOfString.prototype.addAll = function(other)
{
	oFF.XListUtils.addAllStrings(other, this);
};
oFF.DfAbstractSetOfString.prototype.cloneExt = function(flags)
{
	return this.createSetCopy();
};
oFF.DfAbstractSetOfString.prototype.createSetCopy = function()
{
	return this.createSetOfStringCopy();
};
oFF.DfAbstractSetOfString.prototype.getIterator = function()
{
	return this.getValuesAsReadOnlyList().getIterator();
};
oFF.DfAbstractSetOfString.prototype.isEqualTo = function(other)
{
	if (oFF.isNull(other))
	{
		return false;
	}
	if (this === other)
	{
		return true;
	}
	let otherSet = other;
	if (this.size() !== otherSet.size())
	{
		return false;
	}
	let values = this.getIterator();
	while (values.hasNext())
	{
		let value = values.next();
		if (!otherSet.contains(value))
		{
			return false;
		}
	}
	oFF.XObjectExt.release(values);
	return true;
};

oFF.DfAbstractList = function() {};
oFF.DfAbstractList.prototype = new oFF.DfAbstractReadOnlyBinary();
oFF.DfAbstractList.prototype._ff_c = "DfAbstractList";

oFF.DfAbstractList.prototype.addAll = function(other)
{
	oFF.XListUtils.addAllObjects(other, this);
};
oFF.DfAbstractList.prototype.contains = function(element)
{
	return this.getIndex(element) !== -1;
};
oFF.DfAbstractList.prototype.getIndex = function(element)
{
	return oFF.XListUtils.getIndexOf(this, element);
};
oFF.DfAbstractList.prototype.getValuesAsReadOnlyList = function()
{
	return this;
};
oFF.DfAbstractList.prototype.isEqualTo = function(other)
{
	return oFF.XListUtils.isListEquals(this, other);
};
oFF.DfAbstractList.prototype.moveElement = function(fromIndex, toIndex)
{
	oFF.XListUtils.assertGetSetIndexValid(this, fromIndex);
	oFF.XListUtils.assertGetSetIndexValid(this, toIndex);
	let size = this.size();
	if (fromIndex < 0 || fromIndex >= size || toIndex < 0 || toIndex >= size)
	{
		throw oFF.XException.createIllegalStateException("Index out of bounds");
	}
	if (fromIndex === toIndex)
	{
		return;
	}
	this.insert(toIndex, this.removeAt(fromIndex));
};
oFF.DfAbstractList.prototype.removeElement = function(element)
{
	let index = this.getIndex(element);
	if (index !== -1)
	{
		this.removeAt(index);
	}
	return element;
};

oFF.CoreModule = function() {};
oFF.CoreModule.prototype = new oFF.DfModule();
oFF.CoreModule.prototype._ff_c = "CoreModule";

oFF.CoreModule.s_module = null;
oFF.CoreModule.getInstance = function()
{
	if (oFF.isNull(oFF.CoreModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.LanguageExtModule.getInstance());
		oFF.CoreModule.s_module = oFF.DfModule.startExt(new oFF.CoreModule());
		oFF.XSortDirection.staticSetup();
		oFF.DfModule.stopExt(oFF.CoreModule.s_module);
	}
	return oFF.CoreModule.s_module;
};
oFF.CoreModule.prototype.getName = function()
{
	return "ff0010.core";
};

oFF.CoreModule.getInstance();

return oFF;
} );