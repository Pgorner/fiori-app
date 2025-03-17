/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff2600.visualization.abstract"
],
function(oFF)
{
"use strict";

oFF.XCellEngineParser = function() {};
oFF.XCellEngineParser.prototype = new oFF.XObject();
oFF.XCellEngineParser.prototype._ff_c = "XCellEngineParser";

oFF.XCellEngineParser.create = function()
{
	let instance = new oFF.XCellEngineParser();
	return instance;
};
oFF.XCellEngineParser.prototype.m_lookahead = null;
oFF.XCellEngineParser.prototype.m_tokenizer = null;
oFF.XCellEngineParser.prototype.additiveExpression = function()
{
	let left = this.multiplicativeExpression();
	while (this.isLookaheadAdditionOrSubtractionOperator())
	{
		let token = this.consume(oFF.XTokenTypes.ADDITIVE_OPERATOR);
		let right = this.multiplicativeExpression();
		left = oFF.XCellEngineParserBinaryOperation.create(left, token.getValue(), right);
	}
	return left;
};
oFF.XCellEngineParser.prototype.argumentList = function()
{
	this.consume(oFF.XTokenTypes.OPEN_PARENTHESIS);
	let args = oFF.XList.create();
	args.add(this.expression());
	while (oFF.XString.isEqual(this.m_lookahead.getType(), oFF.XTokenTypes.COMMA))
	{
		this.consume(oFF.XTokenTypes.COMMA);
		args.add(this.expression());
	}
	this.consume(oFF.XTokenTypes.CLOSE_PARENTHESIS);
	return args;
};
oFF.XCellEngineParser.prototype.consume = function(tokenType)
{
	let token = this.m_lookahead;
	if (oFF.isNull(token))
	{
		throw oFF.XException.createIllegalStateException(oFF.XStringUtils.concatenate3("SyntaxError: Unexpected end of input, expected: \"", tokenType, "\""));
	}
	if (!oFF.XString.isEqual(token.getType(), tokenType))
	{
		throw oFF.XException.createIllegalStateException(oFF.XStringUtils.concatenate4("SyntaxError: Unexpected token: \"", token.getValue(), "\", expected: \"", tokenType));
	}
	this.m_lookahead = this.m_tokenizer.getNextToken();
	return token;
};
oFF.XCellEngineParser.prototype.doubleLiteral = function()
{
	let token = this.consume(oFF.XTokenTypes.DOUBLE);
	return oFF.XCellEngineParserLiteral.create(oFF.XDoubleValue.create(oFF.XDouble.convertFromString(token.getValue())));
};
oFF.XCellEngineParser.prototype.expression = function()
{
	let expression = this.additiveExpression();
	return expression;
};
oFF.XCellEngineParser.prototype.functionCallExpression = function()
{
	let functionName = this.consume(oFF.XTokenTypes.FUNCTION_NAME).getValue();
	let args = this.argumentList();
	return oFF.XCellEngineParserFunctionCall.create(functionName, args);
};
oFF.XCellEngineParser.prototype.identifier = function()
{
	let identifier = null;
	let token = null;
	if (oFF.XString.isEqual(this.m_lookahead.getType(), oFF.XTokenTypes.IDENTIFIER))
	{
		token = this.consume(oFF.XTokenTypes.IDENTIFIER);
		identifier = oFF.XCellEngineParserIdentifier.create(token.getValue());
	}
	else
	{
		token = this.consume(oFF.XTokenTypes.RANGE_IDENTIFIER);
		identifier = oFF.XCellEngineParserIdentifier.create(token.getValue());
	}
	return identifier;
};
oFF.XCellEngineParser.prototype.integerLiteral = function()
{
	let token = this.consume(oFF.XTokenTypes.INTEGER);
	return oFF.XCellEngineParserLiteral.create(oFF.XIntegerValue.create(oFF.XInteger.convertFromString(token.getValue())));
};
oFF.XCellEngineParser.prototype.isLookAheadMultiplicativeOperator = function()
{
	return oFF.notNull(this.m_lookahead) && oFF.XString.isEqual(this.m_lookahead.getType(), oFF.XTokenTypes.MULTIPLICATIVE_OPERATOR);
};
oFF.XCellEngineParser.prototype.isLookAheadOpenParenthesis = function()
{
	return oFF.notNull(this.m_lookahead) && oFF.XString.isEqual(this.m_lookahead.getType(), oFF.XTokenTypes.OPEN_PARENTHESIS);
};
oFF.XCellEngineParser.prototype.isLookaheadAdditionOrSubtractionOperator = function()
{
	return oFF.notNull(this.m_lookahead) && oFF.XString.isEqual(this.m_lookahead.getType(), oFF.XTokenTypes.ADDITIVE_OPERATOR);
};
oFF.XCellEngineParser.prototype.multiplicativeExpression = function()
{
	let left = this.primaryExpression();
	while (this.isLookAheadMultiplicativeOperator())
	{
		let token = this.consume(oFF.XTokenTypes.MULTIPLICATIVE_OPERATOR);
		let right = this.primaryExpression();
		left = oFF.XCellEngineParserBinaryOperation.create(left, token.getValue(), right);
	}
	return left;
};
oFF.XCellEngineParser.prototype.parenthesisedExpression = function()
{
	this.consume(oFF.XTokenTypes.OPEN_PARENTHESIS);
	let expression = this.expression();
	this.consume(oFF.XTokenTypes.CLOSE_PARENTHESIS);
	return expression;
};
oFF.XCellEngineParser.prototype.parse = function(inputString)
{
	this.m_tokenizer = oFF.XCellEngineTokenizer.create(inputString);
	this.m_lookahead = this.m_tokenizer.getNextToken();
	if (oFF.isNull(this.m_lookahead))
	{
		return oFF.XCellEngineParserLiteral.create(oFF.XStringValue.create(""));
	}
	return this.expression();
};
oFF.XCellEngineParser.prototype.primaryExpression = function()
{
	let primaryExpression;
	if (this.isLookAheadOpenParenthesis())
	{
		primaryExpression = this.parenthesisedExpression();
	}
	else if (oFF.XString.isEqual(this.m_lookahead.getType(), oFF.XTokenTypes.INTEGER))
	{
		primaryExpression = this.integerLiteral();
	}
	else if (oFF.XString.isEqual(this.m_lookahead.getType(), oFF.XTokenTypes.IDENTIFIER) || oFF.XString.isEqual(this.m_lookahead.getType(), oFF.XTokenTypes.RANGE_IDENTIFIER))
	{
		primaryExpression = this.identifier();
	}
	else if (oFF.XString.isEqual(this.m_lookahead.getType(), oFF.XTokenTypes.DOUBLE))
	{
		primaryExpression = this.doubleLiteral();
	}
	else if (oFF.XString.isEqual(this.m_lookahead.getType(), oFF.XTokenTypes.FUNCTION_NAME))
	{
		primaryExpression = this.functionCallExpression();
	}
	else
	{
		primaryExpression = this.stringLiteral();
	}
	return primaryExpression;
};
oFF.XCellEngineParser.prototype.stringLiteral = function()
{
	let token = this.consume(oFF.XTokenTypes.STRING);
	return oFF.XCellEngineParserLiteral.create(oFF.XStringValue.create(token.getValue()));
};

oFF.XCellEngineParserBinaryOperation = function() {};
oFF.XCellEngineParserBinaryOperation.prototype = new oFF.XObject();
oFF.XCellEngineParserBinaryOperation.prototype._ff_c = "XCellEngineParserBinaryOperation";

oFF.XCellEngineParserBinaryOperation.create = function(left, operator, right)
{
	let obj = new oFF.XCellEngineParserBinaryOperation();
	obj.m_left = left;
	obj.operator = operator;
	obj.m_right = right;
	return obj;
};
oFF.XCellEngineParserBinaryOperation.prototype.m_left = null;
oFF.XCellEngineParserBinaryOperation.prototype.m_right = null;
oFF.XCellEngineParserBinaryOperation.prototype.operator = null;
oFF.XCellEngineParserBinaryOperation.prototype.accept = function(visitor)
{
	visitor.visitBinaryOperation(this);
};
oFF.XCellEngineParserBinaryOperation.prototype.getLeft = function()
{
	return this.m_left;
};
oFF.XCellEngineParserBinaryOperation.prototype.getOperator = function()
{
	return this.operator;
};
oFF.XCellEngineParserBinaryOperation.prototype.getRight = function()
{
	return this.m_right;
};
oFF.XCellEngineParserBinaryOperation.prototype.isEqualTo = function(other)
{
	let otherLiteral = other;
	return this.m_left.isEqualTo(otherLiteral.m_left) && oFF.XString.isEqual(this.operator, otherLiteral.operator) && this.m_right.isEqualTo(otherLiteral.m_right);
};

oFF.XCellEngineParserFunctionCall = function() {};
oFF.XCellEngineParserFunctionCall.prototype = new oFF.XObject();
oFF.XCellEngineParserFunctionCall.prototype._ff_c = "XCellEngineParserFunctionCall";

oFF.XCellEngineParserFunctionCall.create = function(functionName, args)
{
	let obj = new oFF.XCellEngineParserFunctionCall();
	obj.m_functionName = functionName;
	obj.m_args = args;
	return obj;
};
oFF.XCellEngineParserFunctionCall.prototype.m_args = null;
oFF.XCellEngineParserFunctionCall.prototype.m_functionName = null;
oFF.XCellEngineParserFunctionCall.prototype.accept = function(visitor)
{
	visitor.visitFunctionCall(this);
};
oFF.XCellEngineParserFunctionCall.prototype.getArs = function()
{
	return this.m_args;
};
oFF.XCellEngineParserFunctionCall.prototype.getFunctionName = function()
{
	return this.m_functionName;
};
oFF.XCellEngineParserFunctionCall.prototype.isEqualTo = function(other)
{
	let otherFunctionCall = other;
	let areArgsEqual = true;
	for (let i = 0; i < this.m_args.size(); i++)
	{
		let thisArg = this.m_args.get(i);
		let otherArg = otherFunctionCall.m_args.get(i);
		if (oFF.isNull(thisArg) || oFF.isNull(otherArg) || !thisArg.isEqualTo(otherArg))
		{
			areArgsEqual = false;
			break;
		}
	}
	return oFF.XString.isEqual(this.m_functionName, otherFunctionCall.m_functionName) && areArgsEqual;
};

oFF.XCellEngineParserIdentifier = function() {};
oFF.XCellEngineParserIdentifier.prototype = new oFF.XObject();
oFF.XCellEngineParserIdentifier.prototype._ff_c = "XCellEngineParserIdentifier";

oFF.XCellEngineParserIdentifier.create = function(identifier)
{
	let obj = new oFF.XCellEngineParserIdentifier();
	obj.m_identifier = identifier;
	return obj;
};
oFF.XCellEngineParserIdentifier.prototype.m_identifier = null;
oFF.XCellEngineParserIdentifier.prototype.accept = function(visitor)
{
	visitor.visitIdentifier(this);
};
oFF.XCellEngineParserIdentifier.prototype.getM_identifier = function()
{
	return this.m_identifier;
};
oFF.XCellEngineParserIdentifier.prototype.isEqualTo = function(other)
{
	let otherIdentifier = other;
	return oFF.XString.isEqual(this.m_identifier, otherIdentifier.m_identifier);
};

oFF.XCellEngineParserLiteral = function() {};
oFF.XCellEngineParserLiteral.prototype = new oFF.XObject();
oFF.XCellEngineParserLiteral.prototype._ff_c = "XCellEngineParserLiteral";

oFF.XCellEngineParserLiteral.create = function(value)
{
	let obj = new oFF.XCellEngineParserLiteral();
	obj.m_value = value;
	return obj;
};
oFF.XCellEngineParserLiteral.prototype.m_value = null;
oFF.XCellEngineParserLiteral.prototype.accept = function(visitor)
{
	visitor.visitLiteral(this);
};
oFF.XCellEngineParserLiteral.prototype.getValue = function()
{
	return this.m_value;
};
oFF.XCellEngineParserLiteral.prototype.isEqualTo = function(other)
{
	let otherLiteral = other;
	return this.m_value.isEqualTo(otherLiteral.m_value);
};

oFF.XCellEngineToken = function() {};
oFF.XCellEngineToken.prototype = new oFF.XObject();
oFF.XCellEngineToken.prototype._ff_c = "XCellEngineToken";

oFF.XCellEngineToken.create = function(type, value)
{
	let instance = new oFF.XCellEngineToken();
	instance.m_type = type;
	instance.m_value = value;
	return instance;
};
oFF.XCellEngineToken.prototype.m_type = null;
oFF.XCellEngineToken.prototype.m_value = null;
oFF.XCellEngineToken.prototype.getType = function()
{
	return this.m_type;
};
oFF.XCellEngineToken.prototype.getValue = function()
{
	return this.m_value;
};

oFF.XCellEngineTokenizer = function() {};
oFF.XCellEngineTokenizer.prototype = new oFF.XObject();
oFF.XCellEngineTokenizer.prototype._ff_c = "XCellEngineTokenizer";

oFF.XCellEngineTokenizer.create = function(string)
{
	let instance = new oFF.XCellEngineTokenizer();
	instance.m_string = string;
	instance.m_cursor = 0;
	instance.m_extractors = oFF.XArray.create(8);
	instance.setupXTokenizer();
	return instance;
};
oFF.XCellEngineTokenizer.prototype.m_cursor = 0;
oFF.XCellEngineTokenizer.prototype.m_extractors = null;
oFF.XCellEngineTokenizer.prototype.m_string = null;
oFF.XCellEngineTokenizer.prototype.getNextToken = function()
{
	let token = null;
	if (!this.hasMoreTokens())
	{
		return token;
	}
	if (this.startsWithEquals())
	{
		if (this.m_cursor === 0)
		{
			this.m_cursor = 1;
		}
		token = this.runExtractors();
		if (oFF.notNull(token))
		{
			return token;
		}
		throw oFF.XException.createIllegalStateException(oFF.XStringUtils.concatenate3("Unexpected token: \"", oFF.XString.substring(this.m_string, this.m_cursor, this.m_cursor + 1), "\""));
	}
	else
	{
		token = oFF.XCellEngineToken.create(oFF.XTokenTypes.STRING, oFF.XString.substring(this.m_string, 0, oFF.XString.size(this.m_string)));
	}
	return token;
};
oFF.XCellEngineTokenizer.prototype.hasMoreTokens = function()
{
	return oFF.notNull(this.m_string) && oFF.XString.size(this.m_string) > 0 && this.m_cursor < oFF.XString.size(this.m_string);
};
oFF.XCellEngineTokenizer.prototype.runExtractors = function()
{
	let token = null;
	for (let i = 0; i < this.m_extractors.size(); i++)
	{
		let extractor = this.m_extractors.get(i);
		extractor.setCursorPosition(this.m_cursor);
		token = extractor.extract();
		this.m_cursor = extractor.getCursorPosition();
		if (oFF.notNull(token))
		{
			break;
		}
	}
	return token;
};
oFF.XCellEngineTokenizer.prototype.setupXTokenizer = function()
{
	this.m_extractors.set(0, oFF.XWhiteSpaceExtractor.create(this.m_string));
	this.m_extractors.set(1, oFF.XCellEngineIdentifierExtractor.create(this.m_string));
	this.m_extractors.set(2, oFF.XCellFunctionCallExtractor.create(this.m_string));
	this.m_extractors.set(3, oFF.XNumericTokenExtractor.create(this.m_string));
	this.m_extractors.set(4, oFF.XAdditiveOperatorExtractor.create(this.m_string));
	this.m_extractors.set(5, oFF.XMultiplicativeOperatorExtractor.create(this.m_string));
	this.m_extractors.set(6, oFF.XParenthesisExtractor.create(this.m_string));
	this.m_extractors.set(7, oFF.XCellCommaExtractor.create(this.m_string));
};
oFF.XCellEngineTokenizer.prototype.startsWithEquals = function()
{
	return oFF.XString.isEqual(oFF.XString.substring(this.m_string, 0, 1), "=");
};

oFF.XAbstractTokenExtractor = function() {};
oFF.XAbstractTokenExtractor.prototype = new oFF.XObject();
oFF.XAbstractTokenExtractor.prototype._ff_c = "XAbstractTokenExtractor";

oFF.XAbstractTokenExtractor.prototype.m_cursor = 0;
oFF.XAbstractTokenExtractor.prototype.m_string = null;
oFF.XAbstractTokenExtractor.prototype.extract = function()
{
	let string = oFF.XString.substring(this.getString(), this.getCursorPosition(), oFF.XString.size(this.getString()));
	return this.extractInternal(string);
};
oFF.XAbstractTokenExtractor.prototype.getCursorPosition = function()
{
	return this.m_cursor;
};
oFF.XAbstractTokenExtractor.prototype.getString = function()
{
	return this.m_string;
};
oFF.XAbstractTokenExtractor.prototype.increaseCursor = function()
{
	this.m_cursor++;
};
oFF.XAbstractTokenExtractor.prototype.isEOF = function()
{
	return this.m_cursor === oFF.XString.size(this.m_string);
};
oFF.XAbstractTokenExtractor.prototype.setCursorPosition = function(cursorPosition)
{
	this.m_cursor = cursorPosition;
};
oFF.XAbstractTokenExtractor.prototype.setString = function(string)
{
	this.m_string = string;
};

oFF.XCellEngineCellProvider = function() {};
oFF.XCellEngineCellProvider.prototype = new oFF.XObject();
oFF.XCellEngineCellProvider.prototype._ff_c = "XCellEngineCellProvider";

oFF.XCellEngineCellProvider.create = function(spreadsheet)
{
	let instance = new oFF.XCellEngineCellProvider();
	instance.setupCellProvider(spreadsheet);
	return instance;
};
oFF.XCellEngineCellProvider.prototype.m_cells = null;
oFF.XCellEngineCellProvider.prototype.m_spreadsheet = null;
oFF.XCellEngineCellProvider.prototype.getCellAtAddress = function(address)
{
	return this.m_cells.get(address.getRow()).get(address.getColumn());
};
oFF.XCellEngineCellProvider.prototype.getCellRangeWithAddress = function(beginAddress, endAddress)
{
	let range = oFF.XList.create();
	for (let rowIndex = beginAddress.getRow(); rowIndex <= endAddress.getRow(); rowIndex++)
	{
		let row = oFF.XList.create();
		range.add(row);
		for (let columnIndex = beginAddress.getColumn(); columnIndex <= endAddress.getColumn(); columnIndex++)
		{
			row.add(this.m_cells.get(rowIndex).get(columnIndex));
		}
	}
	return range;
};
oFF.XCellEngineCellProvider.prototype.getCellRangeWithAddressRange = function(addressRange)
{
	let range = oFF.XList.create();
	for (let rowIndex = addressRange.getStartRow(); rowIndex <= addressRange.getEndRow(); rowIndex++)
	{
		let row = oFF.XList.create();
		range.add(row);
		for (let columnIndex = addressRange.getStartColumn(); columnIndex <= addressRange.getEndColumn(); columnIndex++)
		{
			row.add(this.m_cells.get(rowIndex).get(columnIndex));
		}
	}
	return range;
};
oFF.XCellEngineCellProvider.prototype.getCells = function()
{
	return this.m_cells;
};
oFF.XCellEngineCellProvider.prototype.releaseObject = function()
{
	for (let i = 0; i < this.m_cells.size(); i++)
	{
		for (let j = 0; j < this.m_cells.get(i).size(); j++)
		{
			oFF.XObjectExt.release(this.m_cells.get(i).get(j));
		}
		oFF.XObjectExt.release(this.m_cells.get(i));
	}
	oFF.XObjectExt.release(this.m_cells);
};
oFF.XCellEngineCellProvider.prototype.setupCellProvider = function(spreadsheet)
{
	this.m_spreadsheet = spreadsheet;
	this.m_cells = oFF.XList.create();
	for (let i = 0; i < 100; i++)
	{
		let rows = oFF.XList.create();
		this.m_cells.add(rows);
		for (let j = 0; j < 26; j++)
		{
			let cell = oFF.XCellEngineCell.createWithSpreadsheet(this.m_spreadsheet);
			rows.add(cell);
		}
	}
};

oFF.XSpreadsheetCellAccessor = function() {};
oFF.XSpreadsheetCellAccessor.prototype = new oFF.XObject();
oFF.XSpreadsheetCellAccessor.prototype._ff_c = "XSpreadsheetCellAccessor";

oFF.XSpreadsheetCellAccessor.create = function(spreadsheet)
{
	let instance = new oFF.XSpreadsheetCellAccessor();
	instance.m_spreadsheet = spreadsheet;
	return instance;
};
oFF.XSpreadsheetCellAccessor.prototype.m_spreadsheet = null;
oFF.XSpreadsheetCellAccessor.prototype.getCellAtAddress = function(address)
{
	return this.m_spreadsheet.getCellAtAddress(address);
};
oFF.XSpreadsheetCellAccessor.prototype.getCellRangeWithAddress = function(begin, end)
{
	return this.m_spreadsheet.getCellRangeWithAddress(begin, end);
};

oFF.XSpreadsheetInterpreter = function() {};
oFF.XSpreadsheetInterpreter.prototype = new oFF.XObject();
oFF.XSpreadsheetInterpreter.prototype._ff_c = "XSpreadsheetInterpreter";

oFF.XSpreadsheetInterpreter.create = function(cellProvider)
{
	let obj = new oFF.XSpreadsheetInterpreter();
	obj.setupFunctions();
	obj.m_cellProvider = cellProvider;
	return obj;
};
oFF.XSpreadsheetInterpreter.prototype.m_cellProvider = null;
oFF.XSpreadsheetInterpreter.prototype.m_functions = null;
oFF.XSpreadsheetInterpreter.prototype.m_root = null;
oFF.XSpreadsheetInterpreter.prototype.compile = function(formulaTree)
{
	formulaTree.accept(this);
	return this.m_root;
};
oFF.XSpreadsheetInterpreter.prototype.getFunction = function(functionName)
{
	return this.m_functions.getByKey(oFF.XString.toLowerCase(functionName));
};
oFF.XSpreadsheetInterpreter.prototype.isRange = function(identifier)
{
	return oFF.XStringUtils.containsString(identifier, ":", true);
};
oFF.XSpreadsheetInterpreter.prototype.setupFunctions = function()
{
	this.m_functions = oFF.XHashMapByString.create();
	this.m_functions.put("sum", oFF.XSumOperation.create());
	this.m_functions.put("average", oFF.XAverageOperation.create());
	this.m_functions.put("count", oFF.XCountOperation.create());
	this.m_functions.put("max", oFF.XMaxOperation.create());
	this.m_functions.put("min", oFF.XMinOperation.create());
};
oFF.XSpreadsheetInterpreter.prototype.visitBinaryOperation = function(xCellEngineBinaryOperation)
{
	xCellEngineBinaryOperation.getLeft().accept(this);
	let left = this.m_root;
	xCellEngineBinaryOperation.getRight().accept(this);
	let right = this.m_root;
	let operator = oFF.XSpreadsheetOperationFactory.createBinaryOperation(xCellEngineBinaryOperation.getOperator());
	this.m_root = oFF.XSpreadsheetBinaryOperation.create(left, operator, right);
};
oFF.XSpreadsheetInterpreter.prototype.visitFunctionCall = function(xCellEngineParserFunctionCall)
{
	let args = oFF.XList.create();
	for (let i = 0; i < xCellEngineParserFunctionCall.getArs().size(); i++)
	{
		xCellEngineParserFunctionCall.getArs().get(i).accept(this);
		args.add(this.m_root);
	}
	let functionName = xCellEngineParserFunctionCall.getFunctionName();
	let _function = this.getFunction(functionName);
	if (oFF.isNull(_function))
	{
		throw oFF.XException.createIllegalStateException(oFF.XStringUtils.concatenate3("SyntaxError: Function with name: \"", functionName, "\", expected does not exist"));
	}
	this.m_root = oFF.XSpreadsheetFunctionCall.create(_function, args);
};
oFF.XSpreadsheetInterpreter.prototype.visitIdentifier = function(xCellEngineParserIdentifier)
{
	let identifier = xCellEngineParserIdentifier.getM_identifier();
	if (this.isRange(identifier))
	{
		let addressRange = oFF.XCellAddressRange.createWithString(identifier);
		this.m_root = oFF.XSpreadsheetRangeIdentifier.create(this.m_cellProvider.getCellRangeWithAddress(addressRange.getStartingAddress(), addressRange.getEndingAddress()));
	}
	else
	{
		this.m_root = oFF.XSpreadsheetIdentifier.create(this.m_cellProvider.getCellAtAddress(oFF.XCellAddress.create(identifier)));
	}
};
oFF.XSpreadsheetInterpreter.prototype.visitLiteral = function(xCellEngineLiteral)
{
	this.m_root = oFF.XSpreadsheetLiteral.create(xCellEngineLiteral.getValue());
};

oFF.XSpreadsheetBinaryOperation = function() {};
oFF.XSpreadsheetBinaryOperation.prototype = new oFF.XObject();
oFF.XSpreadsheetBinaryOperation.prototype._ff_c = "XSpreadsheetBinaryOperation";

oFF.XSpreadsheetBinaryOperation.create = function(left, operator, right)
{
	let instance = new oFF.XSpreadsheetBinaryOperation();
	instance.left = left;
	instance.operator = operator;
	instance.right = right;
	return instance;
};
oFF.XSpreadsheetBinaryOperation.prototype.left = null;
oFF.XSpreadsheetBinaryOperation.prototype.operator = null;
oFF.XSpreadsheetBinaryOperation.prototype.right = null;
oFF.XSpreadsheetBinaryOperation.prototype.evaluate = function()
{
	let result;
	try
	{
		result = this.operator.apply(this.left.evaluate(), this.right.evaluate());
	}
	catch (t)
	{
		result = oFF.XStringValue.create("#ERROR");
	}
	return result;
};
oFF.XSpreadsheetBinaryOperation.prototype.isEqualTo = function(other)
{
	let otherBinaryOperation = other;
	return this.left.isEqualTo(otherBinaryOperation.left) && this.right.isEqualTo(otherBinaryOperation.right) && oFF.XString.isEqual(this.operator.getOperationType(), otherBinaryOperation.operator.getOperationType());
};

oFF.XSpreadsheetFunctionCall = function() {};
oFF.XSpreadsheetFunctionCall.prototype = new oFF.XObject();
oFF.XSpreadsheetFunctionCall.prototype._ff_c = "XSpreadsheetFunctionCall";

oFF.XSpreadsheetFunctionCall.create = function(_function, args)
{
	let instance = new oFF.XSpreadsheetFunctionCall();
	instance.m_function = _function;
	instance.m_args = args;
	return instance;
};
oFF.XSpreadsheetFunctionCall.prototype.m_args = null;
oFF.XSpreadsheetFunctionCall.prototype.m_function = null;
oFF.XSpreadsheetFunctionCall.prototype.evaluate = function()
{
	let result;
	try
	{
		let evaluatedArgs = oFF.XList.create();
		for (let i = 0; i < this.m_args.size(); i++)
		{
			evaluatedArgs.add(this.m_args.get(i).evaluate());
		}
		result = this.m_function.apply(evaluatedArgs);
	}
	catch (t)
	{
		result = oFF.XStringValue.create("#ERROR");
	}
	return result;
};

oFF.XSpreadsheetIdentifier = function() {};
oFF.XSpreadsheetIdentifier.prototype = new oFF.XObject();
oFF.XSpreadsheetIdentifier.prototype._ff_c = "XSpreadsheetIdentifier";

oFF.XSpreadsheetIdentifier.create = function(cell)
{
	let instance = new oFF.XSpreadsheetIdentifier();
	instance.m_cell = cell;
	return instance;
};
oFF.XSpreadsheetIdentifier.prototype.m_cell = null;
oFF.XSpreadsheetIdentifier.prototype.evaluate = function()
{
	let result;
	try
	{
		result = this.m_cell.evaluate();
	}
	catch (t)
	{
		result = oFF.XStringValue.create("#ERROR");
	}
	return result;
};
oFF.XSpreadsheetIdentifier.prototype.isEqualTo = function(other)
{
	let otherIdentifier = other;
	return this.m_cell.isEqualTo(otherIdentifier.m_cell);
};

oFF.XSpreadsheetLiteral = function() {};
oFF.XSpreadsheetLiteral.prototype = new oFF.XObject();
oFF.XSpreadsheetLiteral.prototype._ff_c = "XSpreadsheetLiteral";

oFF.XSpreadsheetLiteral.create = function(value)
{
	let instance = new oFF.XSpreadsheetLiteral();
	instance.m_value = value;
	return instance;
};
oFF.XSpreadsheetLiteral.prototype.m_value = null;
oFF.XSpreadsheetLiteral.prototype.evaluate = function()
{
	return this.m_value;
};
oFF.XSpreadsheetLiteral.prototype.isEqualTo = function(other)
{
	let otherLiteral = other;
	return this.m_value.isEqualTo(otherLiteral.m_value);
};

oFF.XSpreadsheetOperationFactory = {

	createBinaryOperation:function(operator)
	{
			let binaryOperation = null;
		if (oFF.XSpreadsheetOperationFactory.isAdditionOperator(operator))
		{
			binaryOperation = oFF.XAdditionFunction.create();
		}
		else if (oFF.XSpreadsheetOperationFactory.isSubtractionOperator(operator))
		{
			binaryOperation = oFF.XSubtractionFunction.create();
		}
		else if (oFF.XSpreadsheetOperationFactory.isMultiplicationOperator(operator))
		{
			binaryOperation = oFF.XMultiplicationFunction.create();
		}
		else if (oFF.XSpreadsheetOperationFactory.isDivisionOperator(operator))
		{
			binaryOperation = oFF.XDivisionFunction.create();
		}
		return binaryOperation;
	},
	isAdditionOperator:function(operator)
	{
			return oFF.XString.isEqual(operator, "+");
	},
	isDivisionOperator:function(operator)
	{
			return oFF.XString.isEqual(operator, "/");
	},
	isMultiplicationOperator:function(operator)
	{
			return oFF.XString.isEqual(operator, "*");
	},
	isSubtractionOperator:function(operator)
	{
			return oFF.XString.isEqual(operator, "-");
	}
};

oFF.XSpreadsheetRangeIdentifier = function() {};
oFF.XSpreadsheetRangeIdentifier.prototype = new oFF.XObject();
oFF.XSpreadsheetRangeIdentifier.prototype._ff_c = "XSpreadsheetRangeIdentifier";

oFF.XSpreadsheetRangeIdentifier.create = function(range)
{
	let instance = new oFF.XSpreadsheetRangeIdentifier();
	instance.m_range = oFF.XRangeValue.create(range);
	return instance;
};
oFF.XSpreadsheetRangeIdentifier.prototype.m_range = null;
oFF.XSpreadsheetRangeIdentifier.prototype.evaluate = function()
{
	return this.m_range;
};

oFF.XCellEngineBinaryOperationTypes = {

	ADDITION:"ADDITION",
	DIVISION:"DIVISION",
	MULTIPLICATION:"MULTIPLICATION",
	SUBTRACTION:"SUBTRACTION"
};

oFF.XAdditionFunction = function() {};
oFF.XAdditionFunction.prototype = new oFF.XObject();
oFF.XAdditionFunction.prototype._ff_c = "XAdditionFunction";

oFF.XAdditionFunction.create = function()
{
	let instance = new oFF.XAdditionFunction();
	return instance;
};
oFF.XAdditionFunction.prototype.apply = function(left, right)
{
	let firstDouble = this.convertToDouble(left);
	let secondDouble = this.convertToDouble(right);
	return oFF.XDoubleValue.create(firstDouble.getDouble() + secondDouble.getDouble());
};
oFF.XAdditionFunction.prototype.convertToDouble = function(value)
{
	return oFF.XDoubleValue.create(oFF.XDouble.convertFromString(value.getStringRepresentation()));
};
oFF.XAdditionFunction.prototype.getOperationType = function()
{
	return oFF.XCellEngineBinaryOperationTypes.ADDITION;
};

oFF.XAverageOperation = function() {};
oFF.XAverageOperation.prototype = new oFF.XObject();
oFF.XAverageOperation.prototype._ff_c = "XAverageOperation";

oFF.XAverageOperation.create = function()
{
	return new oFF.XAverageOperation();
};
oFF.XAverageOperation.prototype.apply = function(args)
{
	let value = oFF.XDoubleValue.create(0);
	let arg = args.get(0);
	if (!arg.getValueType().isEqualTo(oFF.XValueType.LIST))
	{
		value = this.convertToDouble(arg);
	}
	else
	{
		let rangeValue = arg;
		let count = 0;
		for (let rowIndex = 0; rowIndex < rangeValue.toRangeList().size(); rowIndex++)
		{
			let row = rangeValue.toRangeList().get(rowIndex);
			for (let columnIndex = 0; columnIndex < row.size(); columnIndex++)
			{
				count = count + 1;
				let doubleValue = this.convertToDouble(value);
				let doubleArg = this.convertToDouble(row.get(columnIndex).evaluate());
				value = oFF.XDoubleValue.create(doubleValue.getDouble() + doubleArg.getDouble());
			}
		}
		value = oFF.XDoubleValue.create(this.convertToDouble(value).getDouble() / count);
	}
	return value;
};
oFF.XAverageOperation.prototype.convertToDouble = function(value)
{
	return oFF.XDoubleValue.create(oFF.XDouble.convertFromString(value.getStringRepresentation()));
};

oFF.XCountOperation = function() {};
oFF.XCountOperation.prototype = new oFF.XObject();
oFF.XCountOperation.prototype._ff_c = "XCountOperation";

oFF.XCountOperation.create = function()
{
	return new oFF.XCountOperation();
};
oFF.XCountOperation.prototype.apply = function(args)
{
	let value = oFF.XDoubleValue.create(0);
	let arg = args.get(0);
	if (!arg.getValueType().isEqualTo(oFF.XValueType.LIST))
	{
		return oFF.XDoubleValue.create(1);
	}
	else
	{
		let rangeValue = arg;
		for (let rowIndex = 0; rowIndex < rangeValue.toRangeList().size(); rowIndex++)
		{
			let row = rangeValue.toRangeList().get(rowIndex);
			for (let columnIndex = 0; columnIndex < row.size(); columnIndex++)
			{
				let doubleValue = this.convertToDouble(value);
				value = oFF.XDoubleValue.create(doubleValue.getDouble() + 1);
			}
		}
	}
	return value;
};
oFF.XCountOperation.prototype.convertToDouble = function(value)
{
	return oFF.XDoubleValue.create(oFF.XDouble.convertFromString(value.getStringRepresentation()));
};

oFF.XDivisionFunction = function() {};
oFF.XDivisionFunction.prototype = new oFF.XObject();
oFF.XDivisionFunction.prototype._ff_c = "XDivisionFunction";

oFF.XDivisionFunction.create = function()
{
	let instance = new oFF.XDivisionFunction();
	return instance;
};
oFF.XDivisionFunction.prototype.apply = function(left, right)
{
	let firstDouble = this.convertToDouble(left);
	let secondDouble = this.convertToDouble(right);
	return oFF.XDoubleValue.create(firstDouble.getDouble() / secondDouble.getDouble());
};
oFF.XDivisionFunction.prototype.convertToDouble = function(value)
{
	return oFF.XDoubleValue.create(oFF.XDouble.convertFromString(value.getStringRepresentation()));
};
oFF.XDivisionFunction.prototype.getOperationType = function()
{
	return oFF.XCellEngineBinaryOperationTypes.DIVISION;
};

oFF.XMaxOperation = function() {};
oFF.XMaxOperation.prototype = new oFF.XObject();
oFF.XMaxOperation.prototype._ff_c = "XMaxOperation";

oFF.XMaxOperation.create = function()
{
	return new oFF.XMaxOperation();
};
oFF.XMaxOperation.prototype.apply = function(args)
{
	let value = oFF.XDoubleValue.create(0);
	let arg = args.get(0);
	let doubleValue = null;
	let doubleArg = null;
	if (!arg.getValueType().isEqualTo(oFF.XValueType.LIST))
	{
		doubleArg = this.convertToDouble(arg);
		value = oFF.XDoubleValue.create(doubleArg.getDouble());
	}
	else
	{
		let rangeValue = arg;
		let rangeList = rangeValue.toRangeList();
		value = this.convertToDouble(rangeList.get(0).get(0).evaluate());
		for (let rowIndex = 0; rowIndex < rangeList.size(); rowIndex++)
		{
			let row = rangeList.get(rowIndex);
			for (let columnIndex = 0; columnIndex < row.size(); columnIndex++)
			{
				doubleValue = this.convertToDouble(value);
				doubleArg = this.convertToDouble(row.get(columnIndex).evaluate());
				if (doubleArg.getDouble() > doubleValue.getDouble())
				{
					value = oFF.XDoubleValue.create(doubleArg.getDouble());
				}
			}
		}
	}
	return value;
};
oFF.XMaxOperation.prototype.convertToDouble = function(value)
{
	return oFF.XDoubleValue.create(oFF.XDouble.convertFromString(value.getStringRepresentation()));
};

oFF.XMinOperation = function() {};
oFF.XMinOperation.prototype = new oFF.XObject();
oFF.XMinOperation.prototype._ff_c = "XMinOperation";

oFF.XMinOperation.create = function()
{
	return new oFF.XMinOperation();
};
oFF.XMinOperation.prototype.apply = function(args)
{
	let value = oFF.XDoubleValue.create(0);
	let arg = args.get(0);
	let doubleValue = null;
	let doubleArg = null;
	if (!arg.getValueType().isEqualTo(oFF.XValueType.LIST))
	{
		doubleArg = this.convertToDouble(arg);
		value = oFF.XDoubleValue.create(doubleArg.getDouble());
	}
	else
	{
		let rangeValue = arg;
		let rangeList = rangeValue.toRangeList();
		value = this.convertToDouble(rangeList.get(0).get(0).evaluate());
		for (let rowIndex = 0; rowIndex < rangeList.size(); rowIndex++)
		{
			let row = rangeList.get(rowIndex);
			for (let columnIndex = 0; columnIndex < row.size(); columnIndex++)
			{
				doubleValue = this.convertToDouble(value);
				doubleArg = this.convertToDouble(row.get(columnIndex).evaluate());
				if (doubleArg.getDouble() < doubleValue.getDouble())
				{
					value = oFF.XDoubleValue.create(doubleArg.getDouble());
				}
			}
		}
	}
	return value;
};
oFF.XMinOperation.prototype.convertToDouble = function(value)
{
	return oFF.XDoubleValue.create(oFF.XDouble.convertFromString(value.getStringRepresentation()));
};

oFF.XMultiplicationFunction = function() {};
oFF.XMultiplicationFunction.prototype = new oFF.XObject();
oFF.XMultiplicationFunction.prototype._ff_c = "XMultiplicationFunction";

oFF.XMultiplicationFunction.create = function()
{
	let instance = new oFF.XMultiplicationFunction();
	return instance;
};
oFF.XMultiplicationFunction.prototype.apply = function(left, right)
{
	let firstDouble = this.convertToDouble(left);
	let secondDouble = this.convertToDouble(right);
	return oFF.XDoubleValue.create(firstDouble.getDouble() * secondDouble.getDouble());
};
oFF.XMultiplicationFunction.prototype.convertToDouble = function(value)
{
	return oFF.XDoubleValue.create(oFF.XDouble.convertFromString(value.getStringRepresentation()));
};
oFF.XMultiplicationFunction.prototype.getOperationType = function()
{
	return oFF.XCellEngineBinaryOperationTypes.MULTIPLICATION;
};

oFF.XSubtractionFunction = function() {};
oFF.XSubtractionFunction.prototype = new oFF.XObject();
oFF.XSubtractionFunction.prototype._ff_c = "XSubtractionFunction";

oFF.XSubtractionFunction.create = function()
{
	let instance = new oFF.XSubtractionFunction();
	return instance;
};
oFF.XSubtractionFunction.prototype.apply = function(left, right)
{
	let firstDouble = this.convertToDouble(left);
	let secondDouble = this.convertToDouble(right);
	return oFF.XDoubleValue.create(firstDouble.getDouble() - secondDouble.getDouble());
};
oFF.XSubtractionFunction.prototype.convertToDouble = function(value)
{
	return oFF.XDoubleValue.create(oFF.XDouble.convertFromString(value.getStringRepresentation()));
};
oFF.XSubtractionFunction.prototype.getOperationType = function()
{
	return oFF.XCellEngineBinaryOperationTypes.SUBTRACTION;
};

oFF.XSumOperation = function() {};
oFF.XSumOperation.prototype = new oFF.XObject();
oFF.XSumOperation.prototype._ff_c = "XSumOperation";

oFF.XSumOperation.create = function()
{
	return new oFF.XSumOperation();
};
oFF.XSumOperation.prototype.apply = function(args)
{
	let value = oFF.XDoubleValue.create(0);
	let arg = args.get(0);
	let doubleValue = null;
	let doubleArg = null;
	if (!arg.getValueType().isEqualTo(oFF.XValueType.LIST))
	{
		doubleValue = this.convertToDouble(value);
		doubleArg = this.convertToDouble(arg);
		value = oFF.XDoubleValue.create(doubleValue.getDouble() + doubleArg.getDouble());
	}
	else
	{
		let rangeValue = arg;
		for (let rowIndex = 0; rowIndex < rangeValue.toRangeList().size(); rowIndex++)
		{
			let row = rangeValue.toRangeList().get(rowIndex);
			for (let columnIndex = 0; columnIndex < row.size(); columnIndex++)
			{
				doubleValue = this.convertToDouble(value);
				doubleArg = this.convertToDouble(row.get(columnIndex).evaluate());
				value = oFF.XDoubleValue.create(doubleValue.getDouble() + doubleArg.getDouble());
			}
		}
	}
	return value;
};
oFF.XSumOperation.prototype.convertToDouble = function(value)
{
	return oFF.XDoubleValue.create(oFF.XDouble.convertFromString(value.getStringRepresentation()));
};

oFF.XCellAddressConverter = function() {};
oFF.XCellAddressConverter.prototype = new oFF.XObject();
oFF.XCellAddressConverter.prototype._ff_c = "XCellAddressConverter";

oFF.XCellAddressConverter.ASCII_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
oFF.XCellAddressConverter.create = function()
{
	let instance = new oFF.XCellAddressConverter();
	return instance;
};
oFF.XCellAddressConverter.prototype.convertIndicesToAddressString = function(colIndex, rowIndex)
{
	let colString = this.getColumnStringFromIndex(colIndex);
	let rowString = oFF.XInteger.convertToString(rowIndex + 1);
	return oFF.XStringUtils.concatenate2(colString, rowString);
};
oFF.XCellAddressConverter.prototype.convertStringAddressToColumnIndex = function(addressString)
{
	let columnAddress = this.getColumnString(addressString);
	let stringLength = oFF.XString.size(columnAddress);
	let column = 0;
	for (let i = 0; i < stringLength; i++)
	{
		let charAt = oFF.XString.getCharAt(columnAddress, i);
		let magnitude = oFF.XDouble.convertToInt(oFF.XMath.pow(26, stringLength - (i + 1)));
		column = column + magnitude * (charAt - 64);
	}
	return column - 1;
};
oFF.XCellAddressConverter.prototype.convertStringAddressToRowIndex = function(addressString)
{
	oFF.XString.toUpperCase(addressString);
	let begin = 0;
	for (let i = 0; i < oFF.XString.size(addressString); i++)
	{
		let charAt = oFF.XString.getCharAt(addressString, i);
		if (!this.isLetter(charAt))
		{
			begin = i;
			break;
		}
	}
	return oFF.XInteger.convertFromString(oFF.XString.substring(addressString, begin, oFF.XString.size(addressString))) - 1;
};
oFF.XCellAddressConverter.prototype.getColumnString = function(address)
{
	oFF.XString.toUpperCase(address);
	let end = 0;
	for (let i = 0; i < oFF.XString.size(address); i++)
	{
		let charAt = oFF.XString.getCharAt(address, i);
		if (!this.isLetter(charAt))
		{
			end = i;
			break;
		}
	}
	return oFF.XString.substring(address, 0, end);
};
oFF.XCellAddressConverter.prototype.getColumnStringFromIndex = function(colIndex)
{
	let normalizedColIndex = colIndex + 1;
	let colString = "";
	while (normalizedColIndex > 0)
	{
		let letterIndex = oFF.XMath.mod(colIndex, 26);
		let colChar = oFF.XString.substring(oFF.XCellAddressConverter.ASCII_CHARACTERS, letterIndex, letterIndex + 1);
		colString = oFF.XStringUtils.concatenate2(colChar, colString);
		normalizedColIndex = oFF.XMath.div(colIndex, 26);
	}
	return colString;
};
oFF.XCellAddressConverter.prototype.isLetter = function(charAt)
{
	return charAt >= 65 && charAt <= 90;
};

oFF.XAdditiveOperatorExtractor = function() {};
oFF.XAdditiveOperatorExtractor.prototype = new oFF.XAbstractTokenExtractor();
oFF.XAdditiveOperatorExtractor.prototype._ff_c = "XAdditiveOperatorExtractor";

oFF.XAdditiveOperatorExtractor.create = function(string)
{
	let instance = new oFF.XAdditiveOperatorExtractor();
	instance.setString(string);
	return instance;
};
oFF.XAdditiveOperatorExtractor.prototype.extractInternal = function(string)
{
	let token = null;
	let firstChar = oFF.XString.substring(string, 0, 1);
	if (oFF.XString.isEqual(firstChar, "+") || oFF.XString.isEqual(firstChar, "-"))
	{
		this.increaseCursor();
		token = oFF.XCellEngineToken.create(oFF.XTokenTypes.ADDITIVE_OPERATOR, firstChar);
	}
	return token;
};

oFF.XCellCommaExtractor = function() {};
oFF.XCellCommaExtractor.prototype = new oFF.XAbstractTokenExtractor();
oFF.XCellCommaExtractor.prototype._ff_c = "XCellCommaExtractor";

oFF.XCellCommaExtractor.create = function(string)
{
	let instance = new oFF.XCellCommaExtractor();
	instance.setString(string);
	return instance;
};
oFF.XCellCommaExtractor.prototype.extractInternal = function(string)
{
	let token = null;
	let firstChar = oFF.XString.substring(string, 0, 1);
	if (oFF.XString.isEqual(firstChar, ","))
	{
		this.increaseCursor();
		token = oFF.XCellEngineToken.create(oFF.XTokenTypes.COMMA, firstChar);
	}
	return token;
};

oFF.XCellEngineIdentifierExtractor = function() {};
oFF.XCellEngineIdentifierExtractor.prototype = new oFF.XAbstractTokenExtractor();
oFF.XCellEngineIdentifierExtractor.prototype._ff_c = "XCellEngineIdentifierExtractor";

oFF.XCellEngineIdentifierExtractor.create = function(string)
{
	let instance = new oFF.XCellEngineIdentifierExtractor();
	instance.setString(string);
	return instance;
};
oFF.XCellEngineIdentifierExtractor.prototype.extractInternal = function(string)
{
	let token = null;
	let identifierType = oFF.XTokenTypes.IDENTIFIER;
	let beginIndex = 0;
	let next = oFF.XString.substring(string, beginIndex, beginIndex + 1);
	beginIndex++;
	if (this.isLetter(next))
	{
		while (this.isLetter(next) && beginIndex < oFF.XString.size(string))
		{
			next = oFF.XString.substring(string, beginIndex, beginIndex + 1);
			beginIndex++;
		}
		if (!this.isNumber(next))
		{
			return null;
		}
		while (this.isNumber(next) && beginIndex < oFF.XString.size(string))
		{
			next = oFF.XString.substring(string, beginIndex, beginIndex + 1);
			if (this.isNumber(next))
			{
				beginIndex++;
			}
		}
		if (oFF.XString.isEqual(next, ":"))
		{
			identifierType = oFF.XTokenTypes.RANGE_IDENTIFIER;
			beginIndex++;
			next = oFF.XString.substring(string, beginIndex, beginIndex + 1);
			beginIndex++;
			while (this.isLetter(next) && beginIndex < oFF.XString.size(string))
			{
				next = oFF.XString.substring(string, beginIndex, beginIndex + 1);
				beginIndex++;
			}
			if (!this.isNumber(next))
			{
				return null;
			}
			while (this.isNumber(next) && beginIndex < oFF.XString.size(string))
			{
				next = oFF.XString.substring(string, beginIndex, beginIndex + 1);
				if (this.isNumber(next))
				{
					beginIndex++;
				}
			}
		}
		this.setCursorPosition(this.getCursorPosition() + beginIndex);
		token = oFF.XCellEngineToken.create(identifierType, oFF.XString.substring(string, 0, beginIndex));
	}
	return token;
};
oFF.XCellEngineIdentifierExtractor.prototype.isLetter = function(inputString)
{
	let normalizedString = oFF.XString.toUpperCase(inputString);
	let charAt = oFF.XString.getCharAt(normalizedString, 0);
	return charAt >= 65 && charAt <= 90;
};
oFF.XCellEngineIdentifierExtractor.prototype.isNumber = function(inputString)
{
	let charAt = oFF.XString.getCharAt(inputString, 0);
	return charAt >= 48 && charAt <= 57;
};

oFF.XCellFunctionCallExtractor = function() {};
oFF.XCellFunctionCallExtractor.prototype = new oFF.XAbstractTokenExtractor();
oFF.XCellFunctionCallExtractor.prototype._ff_c = "XCellFunctionCallExtractor";

oFF.XCellFunctionCallExtractor.create = function(string)
{
	let instance = new oFF.XCellFunctionCallExtractor();
	instance.setString(string);
	return instance;
};
oFF.XCellFunctionCallExtractor.prototype.extractInternal = function(string)
{
	let token = null;
	let isValid = false;
	let beginIndex = 0;
	let next = oFF.XString.substring(string, beginIndex, beginIndex + 1);
	beginIndex++;
	if (this.isLetter(next))
	{
		while (this.isLetter(next) && beginIndex < oFF.XString.size(string))
		{
			next = oFF.XString.substring(string, beginIndex, beginIndex + 1);
			if (oFF.XString.getCharAt(next, 0) === 40)
			{
				isValid = true;
				break;
			}
			beginIndex++;
		}
		if (isValid)
		{
			this.setCursorPosition(this.getCursorPosition() + beginIndex);
			token = oFF.XCellEngineToken.create(oFF.XTokenTypes.FUNCTION_NAME, oFF.XString.substring(string, 0, beginIndex));
		}
	}
	return token;
};
oFF.XCellFunctionCallExtractor.prototype.isLetter = function(inputString)
{
	let normalizedString = oFF.XString.toUpperCase(inputString);
	let charAt = oFF.XString.getCharAt(normalizedString, 0);
	return charAt >= 65 && charAt <= 90;
};

oFF.XMultiplicativeOperatorExtractor = function() {};
oFF.XMultiplicativeOperatorExtractor.prototype = new oFF.XAbstractTokenExtractor();
oFF.XMultiplicativeOperatorExtractor.prototype._ff_c = "XMultiplicativeOperatorExtractor";

oFF.XMultiplicativeOperatorExtractor.create = function(string)
{
	let instance = new oFF.XMultiplicativeOperatorExtractor();
	instance.setString(string);
	return instance;
};
oFF.XMultiplicativeOperatorExtractor.prototype.extractInternal = function(string)
{
	let token = null;
	let firstChar = oFF.XString.substring(string, 0, 1);
	if (oFF.XString.isEqual(firstChar, "*") || oFF.XString.isEqual(firstChar, "/"))
	{
		this.increaseCursor();
		token = oFF.XCellEngineToken.create(oFF.XTokenTypes.MULTIPLICATIVE_OPERATOR, firstChar);
	}
	return token;
};

oFF.XNumericTokenExtractor = function() {};
oFF.XNumericTokenExtractor.prototype = new oFF.XAbstractTokenExtractor();
oFF.XNumericTokenExtractor.prototype._ff_c = "XNumericTokenExtractor";

oFF.XNumericTokenExtractor.create = function(string)
{
	let instance = new oFF.XNumericTokenExtractor();
	instance.setString(string);
	instance.m_isInteger = true;
	return instance;
};
oFF.XNumericTokenExtractor.prototype.m_isInteger = false;
oFF.XNumericTokenExtractor.prototype.extractInternal = function(string)
{
	let token = null;
	let beginIndex = 0;
	try
	{
		oFF.XInteger.convertFromString(oFF.XString.substring(string, beginIndex, beginIndex + 1));
		this.increaseCursor();
		beginIndex++;
		while (!this.isEOF())
		{
			if (oFF.XString.isEqual(oFF.XString.substring(string, beginIndex, beginIndex + 1), "."))
			{
				this.m_isInteger = false;
				this.increaseCursor();
				beginIndex++;
			}
			try
			{
				oFF.XInteger.convertFromString(oFF.XString.substring(string, beginIndex, beginIndex + 1));
				this.increaseCursor();
				beginIndex++;
			}
			catch (internalException)
			{
				break;
			}
		}
		let numberToken = oFF.XString.substring(string, 0, beginIndex);
		if (this.m_isInteger)
		{
			token = oFF.XCellEngineToken.create(oFF.XTokenTypes.INTEGER, numberToken);
		}
		else
		{
			token = oFF.XCellEngineToken.create(oFF.XTokenTypes.DOUBLE, numberToken);
		}
	}
	catch (externalException)
	{
		token = null;
	}
	return token;
};

oFF.XParenthesisExtractor = function() {};
oFF.XParenthesisExtractor.prototype = new oFF.XAbstractTokenExtractor();
oFF.XParenthesisExtractor.prototype._ff_c = "XParenthesisExtractor";

oFF.XParenthesisExtractor.create = function(string)
{
	let instance = new oFF.XParenthesisExtractor();
	instance.setString(string);
	return instance;
};
oFF.XParenthesisExtractor.prototype.extractInternal = function(string)
{
	let token = null;
	let firstChar = oFF.XString.substring(string, 0, 1);
	if (oFF.XString.isEqual(firstChar, "("))
	{
		this.increaseCursor();
		token = oFF.XCellEngineToken.create(oFF.XTokenTypes.OPEN_PARENTHESIS, firstChar);
	}
	else if (oFF.XString.isEqual(firstChar, ")"))
	{
		this.increaseCursor();
		token = oFF.XCellEngineToken.create(oFF.XTokenTypes.CLOSE_PARENTHESIS, firstChar);
	}
	return token;
};

oFF.XWhiteSpaceExtractor = function() {};
oFF.XWhiteSpaceExtractor.prototype = new oFF.XAbstractTokenExtractor();
oFF.XWhiteSpaceExtractor.prototype._ff_c = "XWhiteSpaceExtractor";

oFF.XWhiteSpaceExtractor.create = function(string)
{
	let instance = new oFF.XWhiteSpaceExtractor();
	instance.setString(string);
	return instance;
};
oFF.XWhiteSpaceExtractor.prototype.extractInternal = function(string)
{
	let beginIndex = 0;
	let firstChar = oFF.XString.substring(string, beginIndex, beginIndex + 1);
	while (this.isWhiteSpace(firstChar))
	{
		this.increaseCursor();
		beginIndex++;
		firstChar = oFF.XString.substring(string, beginIndex, beginIndex + 1);
	}
	return null;
};
oFF.XWhiteSpaceExtractor.prototype.isWhiteSpace = function(firstChar)
{
	return oFF.XString.isEqual(firstChar, " ") || oFF.XString.isEqual(firstChar, "\t") || oFF.XString.isEqual(firstChar, "\n");
};

oFF.XCellFormat = function() {};
oFF.XCellFormat.prototype = new oFF.XObject();
oFF.XCellFormat.prototype._ff_c = "XCellFormat";

oFF.XCellFormat.create = function()
{
	let obj = new oFF.XCellFormat();
	obj.setupFormat();
	return obj;
};
oFF.XCellFormat.prototype.m_backgroundColor = null;
oFF.XCellFormat.prototype.m_bold = false;
oFF.XCellFormat.prototype.m_cellHorizontalAlignment = null;
oFF.XCellFormat.prototype.m_fontSize = 0;
oFF.XCellFormat.prototype.m_italic = false;
oFF.XCellFormat.prototype.m_numberFormatterSettings = null;
oFF.XCellFormat.prototype.m_textColor = null;
oFF.XCellFormat.prototype.addRightDigit = function()
{
	let digitsRight = this.m_numberFormatterSettings.getMaxDigitsRight();
	if (digitsRight >= 0)
	{
		this.m_numberFormatterSettings.setMaxDigitsRight(digitsRight + 1);
	}
	else
	{
		this.m_numberFormatterSettings.setMaxDigitsRight(1);
	}
};
oFF.XCellFormat.prototype.formatString = function(stringToFormat)
{
	if (oFF.XStringUtils.isNumber(stringToFormat))
	{
		let value = oFF.XDouble.convertFromString(stringToFormat);
		return oFF.XNumberFormatter.formatDoubleToStringUsingSettings(value, this.m_numberFormatterSettings);
	}
	return stringToFormat;
};
oFF.XCellFormat.prototype.getBackgroundColor = function()
{
	return this.m_backgroundColor;
};
oFF.XCellFormat.prototype.getBold = function()
{
	return this.m_bold;
};
oFF.XCellFormat.prototype.getFontSize = function()
{
	return this.m_fontSize;
};
oFF.XCellFormat.prototype.getHorizontalAlignment = function()
{
	return this.m_cellHorizontalAlignment;
};
oFF.XCellFormat.prototype.getItalic = function()
{
	return this.m_italic;
};
oFF.XCellFormat.prototype.getTextColor = function()
{
	return this.m_textColor;
};
oFF.XCellFormat.prototype.removeRightDigit = function()
{
	let digitsRight = this.m_numberFormatterSettings.getMaxDigitsRight();
	if (digitsRight > 0)
	{
		this.m_numberFormatterSettings.setMaxDigitsRight(digitsRight - 1);
	}
};
oFF.XCellFormat.prototype.setBackgroundColor = function(backgroundColor)
{
	this.m_backgroundColor = backgroundColor;
};
oFF.XCellFormat.prototype.setBold = function(bold)
{
	this.m_bold = bold;
};
oFF.XCellFormat.prototype.setFontSize = function(fontSize)
{
	this.m_fontSize = fontSize;
};
oFF.XCellFormat.prototype.setHorizontalAlignment = function(horizontalAlignment)
{
	this.m_cellHorizontalAlignment = horizontalAlignment;
};
oFF.XCellFormat.prototype.setItalic = function(italic)
{
	this.m_italic = italic;
};
oFF.XCellFormat.prototype.setTextColor = function(textColor)
{
	this.m_textColor = textColor;
};
oFF.XCellFormat.prototype.setupFormat = function()
{
	this.m_backgroundColor = "#ffffff";
	this.m_textColor = "#000000";
	this.m_bold = false;
	this.m_italic = false;
	this.m_fontSize = 0;
	this.m_numberFormatterSettings = oFF.XNumberFormatterSettingsFactory.getInstance().create();
};

oFF.XCellAddress = function() {};
oFF.XCellAddress.prototype = new oFF.XObject();
oFF.XCellAddress.prototype._ff_c = "XCellAddress";

oFF.XCellAddress.create = function(addressString)
{
	let instance = new oFF.XCellAddress();
	instance.internalSetup();
	instance.m_column = instance.m_addressConverter.convertStringAddressToColumnIndex(addressString);
	instance.m_row = instance.m_addressConverter.convertStringAddressToRowIndex(addressString);
	return instance;
};
oFF.XCellAddress.createWithIndices = function(row, column)
{
	let instance = new oFF.XCellAddress();
	instance.internalSetup();
	instance.m_column = column;
	instance.m_row = row;
	return instance;
};
oFF.XCellAddress.prototype.m_addressConverter = null;
oFF.XCellAddress.prototype.m_column = 0;
oFF.XCellAddress.prototype.m_row = 0;
oFF.XCellAddress.prototype.getAddressString = function()
{
	return this.m_addressConverter.convertIndicesToAddressString(this.m_column, this.m_row);
};
oFF.XCellAddress.prototype.getColumn = function()
{
	return this.m_column;
};
oFF.XCellAddress.prototype.getRow = function()
{
	return this.m_row;
};
oFF.XCellAddress.prototype.internalSetup = function()
{
	this.m_addressConverter = oFF.XCellAddressConverter.create();
};
oFF.XCellAddress.prototype.isEqualTo = function(other)
{
	let otherAddress = other;
	return this.m_row === otherAddress.m_row && this.m_column === otherAddress.m_column;
};
oFF.XCellAddress.prototype.releaseObject = function()
{
	oFF.XObjectExt.release(this.m_addressConverter);
};

oFF.XCellAddressRange = function() {};
oFF.XCellAddressRange.prototype = new oFF.XObject();
oFF.XCellAddressRange.prototype._ff_c = "XCellAddressRange";

oFF.XCellAddressRange.createWithIndices = function(startRow, endRow, startColumn, endColumn)
{
	let obj = new oFF.XCellAddressRange();
	obj.m_rangeStart = oFF.XCellAddress.createWithIndices(startRow, startColumn);
	obj.m_rangeEnd = oFF.XCellAddress.createWithIndices(endRow, endColumn);
	return obj;
};
oFF.XCellAddressRange.createWithString = function(addressString)
{
	let obj = new oFF.XCellAddressRange();
	let addressList = oFF.XStringTokenizer.splitString(addressString, ":");
	let size = addressList.size();
	obj.m_rangeStart = oFF.XCellAddress.create(addressList.get(0));
	obj.m_rangeEnd = size > 1 ? oFF.XCellAddress.create(addressList.get(1)) : oFF.XCellAddress.create(addressList.get(0));
	return obj;
};
oFF.XCellAddressRange.prototype.m_rangeEnd = null;
oFF.XCellAddressRange.prototype.m_rangeStart = null;
oFF.XCellAddressRange.prototype.getAddressString = function()
{
	let addressString = this.m_rangeStart.getAddressString();
	if (this.getStartRow() !== this.getEndRow() || this.getStartColumn() !== this.getEndColumn())
	{
		addressString = oFF.XStringUtils.concatenate3(addressString, ":", this.m_rangeEnd.getAddressString());
	}
	return addressString;
};
oFF.XCellAddressRange.prototype.getEndColumn = function()
{
	return this.m_rangeEnd.getColumn();
};
oFF.XCellAddressRange.prototype.getEndRow = function()
{
	return this.m_rangeEnd.getRow();
};
oFF.XCellAddressRange.prototype.getEndingAddress = function()
{
	return this.m_rangeEnd;
};
oFF.XCellAddressRange.prototype.getStartColumn = function()
{
	return this.m_rangeStart.getColumn();
};
oFF.XCellAddressRange.prototype.getStartRow = function()
{
	return this.m_rangeStart.getRow();
};
oFF.XCellAddressRange.prototype.getStartingAddress = function()
{
	return this.m_rangeStart;
};

oFF.XSpreadsheet = function() {};
oFF.XSpreadsheet.prototype = new oFF.XObject();
oFF.XSpreadsheet.prototype._ff_c = "XSpreadsheet";

oFF.XSpreadsheet.create = function()
{
	let instance = new oFF.XSpreadsheet();
	instance.setupSpreadsheet();
	return instance;
};
oFF.XSpreadsheet.prototype.m_baseProvider = null;
oFF.XSpreadsheet.prototype.m_cellAccessor = null;
oFF.XSpreadsheet.prototype.m_extraProviders = null;
oFF.XSpreadsheet.prototype.addCellProvider = function(cellAddress, cellProvider)
{
	this.m_extraProviders.put(cellAddress, cellProvider);
};
oFF.XSpreadsheet.prototype.getCellAccessor = function()
{
	return this.m_cellAccessor;
};
oFF.XSpreadsheet.prototype.getCellAtAddress = function(address)
{
	return this.m_baseProvider.getCellAtAddress(address);
};
oFF.XSpreadsheet.prototype.getCellRangeWithAddress = function(beginAddress, endAddress)
{
	return this.m_baseProvider.getCellRangeWithAddress(beginAddress, endAddress);
};
oFF.XSpreadsheet.prototype.getCellRangeWithAddressRange = function(addressRange)
{
	return this.m_baseProvider.getCellRangeWithAddressRange(addressRange);
};
oFF.XSpreadsheet.prototype.getCells = function()
{
	let baseCells = this.m_baseProvider.getCells();
	let keyIterator = this.m_extraProviders.getKeysAsReadOnlyList().getIterator();
	while (keyIterator.hasNext())
	{
		let key = keyIterator.next();
		let row = key.getRow();
		let column = key.getColumn();
		for (let rowIndex = row; rowIndex - row < this.m_extraProviders.getByKey(key).getCells().size(); rowIndex++)
		{
			for (let columnIndex = column; columnIndex - column < this.m_extraProviders.getByKey(key).getCells().get(rowIndex - row).size(); columnIndex++)
			{
				baseCells.get(rowIndex).get(columnIndex).setText(this.m_extraProviders.getByKey(key).getCells().get(rowIndex - row).get(columnIndex - column).getStringLiteral());
			}
		}
	}
	return baseCells;
};
oFF.XSpreadsheet.prototype.releaseObject = function()
{
	this.m_baseProvider = oFF.XObjectExt.release(this.m_baseProvider);
	this.m_cellAccessor = oFF.XObjectExt.release(this.m_cellAccessor);
	this.m_extraProviders = oFF.XObjectExt.release(this.m_extraProviders);
};
oFF.XSpreadsheet.prototype.setupSpreadsheet = function()
{
	this.m_baseProvider = oFF.XCellEngineCellProvider.create(this);
	this.m_cellAccessor = oFF.XSpreadsheetCellAccessor.create(this);
	this.m_extraProviders = oFF.XSimpleMap.create();
};

oFF.DfXCell = function() {};
oFF.DfXCell.prototype = new oFF.XObject();
oFF.DfXCell.prototype._ff_c = "DfXCell";

oFF.DfXCell.create = function()
{
	let instance = new oFF.DfXCell();
	instance.setText("");
	instance.setCellFormat(oFF.XCellFormat.create());
	return instance;
};
oFF.DfXCell.prototype.m_cellFormat = null;
oFF.DfXCell.prototype.m_changed = false;
oFF.DfXCell.prototype.m_stringLiteral = null;
oFF.DfXCell.prototype.addRightDigit = function()
{
	if (oFF.XStringUtils.isNumber(this.getStringRepresentation()))
	{
		this.m_cellFormat.addRightDigit();
	}
};
oFF.DfXCell.prototype.evaluate = function()
{
	return oFF.XStringValue.create(this.getStringLiteral());
};
oFF.DfXCell.prototype.getBackgroundColor = function()
{
	return this.m_cellFormat.getBackgroundColor();
};
oFF.DfXCell.prototype.getBold = function()
{
	return this.m_cellFormat.getBold();
};
oFF.DfXCell.prototype.getFontSize = function()
{
	return this.m_cellFormat.getFontSize();
};
oFF.DfXCell.prototype.getFormattedString = function()
{
	let stringRepresentation = this.getStringRepresentation();
	return this.m_cellFormat.formatString(stringRepresentation);
};
oFF.DfXCell.prototype.getHorizontalAlignment = function()
{
	return this.m_cellFormat.getHorizontalAlignment();
};
oFF.DfXCell.prototype.getItalic = function()
{
	return this.m_cellFormat.getItalic();
};
oFF.DfXCell.prototype.getStringLiteral = function()
{
	return this.m_stringLiteral;
};
oFF.DfXCell.prototype.getStringRepresentation = function()
{
	return this.evaluate().getStringRepresentation();
};
oFF.DfXCell.prototype.getTextColor = function()
{
	return this.m_cellFormat.getTextColor();
};
oFF.DfXCell.prototype.isChanged = function()
{
	return this.m_changed;
};
oFF.DfXCell.prototype.isEqualTo = function(other)
{
	let otherCell = other;
	return otherCell.evaluate().isEqualTo(otherCell.evaluate());
};
oFF.DfXCell.prototype.releaseObject = function() {};
oFF.DfXCell.prototype.removeRightDigit = function()
{
	if (oFF.XStringUtils.isNumber(this.getStringRepresentation()))
	{
		this.m_cellFormat.removeRightDigit();
	}
};
oFF.DfXCell.prototype.setBackgroundColor = function(backgroundColor)
{
	this.m_cellFormat.setBackgroundColor(backgroundColor);
};
oFF.DfXCell.prototype.setBold = function(bold)
{
	this.m_cellFormat.setBold(bold);
};
oFF.DfXCell.prototype.setCellFormat = function(cellFormat)
{
	this.m_cellFormat = cellFormat;
};
oFF.DfXCell.prototype.setFontSize = function(fontSize)
{
	this.m_cellFormat.setFontSize(fontSize);
};
oFF.DfXCell.prototype.setHorizontalAlignment = function(horizontalAlignment)
{
	this.m_cellFormat.setHorizontalAlignment(horizontalAlignment);
};
oFF.DfXCell.prototype.setItalic = function(italic)
{
	this.m_cellFormat.setItalic(italic);
};
oFF.DfXCell.prototype.setStringLiteral = function(stringLiteral)
{
	this.m_stringLiteral = stringLiteral;
};
oFF.DfXCell.prototype.setText = function(text)
{
	this.m_stringLiteral = text;
	this.m_changed = true;
};
oFF.DfXCell.prototype.setTextColor = function(textColor)
{
	this.m_cellFormat.setTextColor(textColor);
};
oFF.DfXCell.prototype.updateTextFromLinkedObject = function(text)
{
	if (!this.m_changed)
	{
		this.setText(text);
	}
};

oFF.XCellEngineCell = function() {};
oFF.XCellEngineCell.prototype = new oFF.DfXCell();
oFF.XCellEngineCell.prototype._ff_c = "XCellEngineCell";

oFF.XCellEngineCell.createWithSpreadsheet = function(spreadsheet)
{
	let instance = new oFF.XCellEngineCell();
	instance.m_spreadsheet = spreadsheet;
	instance.setTextInternal("");
	instance.setCellFormat(oFF.XCellFormat.create());
	return instance;
};
oFF.XCellEngineCell.prototype.m_formula = null;
oFF.XCellEngineCell.prototype.m_spreadsheet = null;
oFF.XCellEngineCell.prototype.evaluate = function()
{
	if (oFF.notNull(this.m_formula))
	{
		let compiler = oFF.XSpreadsheetInterpreter.create(this.m_spreadsheet.getCellAccessor());
		return compiler.compile(this.m_formula).evaluate();
	}
	return oFF.XStringValue.create("");
};
oFF.XCellEngineCell.prototype.releaseObject = function()
{
	oFF.XObjectExt.release(this.m_formula);
};
oFF.XCellEngineCell.prototype.setText = function(text)
{
	this.setTextInternal(text);
};
oFF.XCellEngineCell.prototype.setTextInternal = function(text)
{
	this.setStringLiteral(text);
	let parser = oFF.XCellEngineParser.create();
	this.m_formula = parser.parse(text);
};

oFF.XTokenTypes = function() {};
oFF.XTokenTypes.prototype = new oFF.XConstant();
oFF.XTokenTypes.prototype._ff_c = "XTokenTypes";

oFF.XTokenTypes.ADDITIVE_OPERATOR = "ADDITIVE_OPERATOR";
oFF.XTokenTypes.CLOSE_PARENTHESIS = "CLOSE_PARENTHESIS";
oFF.XTokenTypes.COMMA = "COMMA";
oFF.XTokenTypes.DOUBLE = "DOUBLE";
oFF.XTokenTypes.FUNCTION_NAME = "FUNCTION_NAME";
oFF.XTokenTypes.IDENTIFIER = "IDENTIFIER";
oFF.XTokenTypes.INTEGER = "INTEGER";
oFF.XTokenTypes.MULTIPLICATIVE_OPERATOR = "MULTIPLICATIVE_OPERATOR";
oFF.XTokenTypes.OPEN_PARENTHESIS = "OPEN_PARENTHESIS";
oFF.XTokenTypes.RANGE_IDENTIFIER = "RANGE_IDENTIFIER";
oFF.XTokenTypes.STRING = "STRING";

oFF.XRangeValue = function() {};
oFF.XRangeValue.prototype = new oFF.XAbstractValue();
oFF.XRangeValue.prototype._ff_c = "XRangeValue";

oFF.XRangeValue.create = function(range)
{
	let instance = new oFF.XRangeValue();
	instance.m_range = range;
	return instance;
};
oFF.XRangeValue.prototype.m_range = null;
oFF.XRangeValue.prototype.getStringRepresentation = function()
{
	return this.m_range.toString();
};
oFF.XRangeValue.prototype.getValueType = function()
{
	return oFF.XValueType.LIST;
};
oFF.XRangeValue.prototype.toRangeList = function()
{
	return this.m_range;
};

oFF.CellEngineModule = function() {};
oFF.CellEngineModule.prototype = new oFF.DfModule();
oFF.CellEngineModule.prototype._ff_c = "CellEngineModule";

oFF.CellEngineModule.s_module = null;
oFF.CellEngineModule.getInstance = function()
{
	if (oFF.isNull(oFF.CellEngineModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.IoModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.VisualizationAbstractModule.getInstance());
		oFF.CellEngineModule.s_module = oFF.DfModule.startExt(new oFF.CellEngineModule());
		oFF.DfModule.stopExt(oFF.CellEngineModule.s_module);
	}
	return oFF.CellEngineModule.s_module;
};
oFF.CellEngineModule.prototype.getName = function()
{
	return "ff3300.cell.engine";
};

oFF.CellEngineModule.getInstance();

return oFF;
} );