/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define([], function () {
  "use strict";

  /* eslint-disable max-classes-per-file */
  /** Copyright 2019 SAP SE or an SAP affiliate company. All rights reserved. */

  const reservedCharacters = ["\\", "-", "(", ")", "~", "^", "?", "\"", ":", "'", "[", "]"]; //add new elements at the end of the array
  const reservedWords = ["AND", "OR", "NOT"];
  function replaceAll(original, search, replacement) {
    return original.split(search).join(replacement);
  }
  const escapeSingleQuote = value => {
    return value.replace(/'/g, "''");
  };
  const escapeDoubleQuoteAndBackslash = value => {
    return value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
  };
  function escapeQuery(query) {
    let escapedQuery = query ? query.trim() : "";
    if (escapedQuery !== "") {
      for (const specialCharacter of reservedCharacters) {
        if (specialCharacter) {
          if (specialCharacter === "'") {
            escapedQuery = escapeSingleQuote(escapedQuery);
          } else {
            escapedQuery = replaceAll(escapedQuery, specialCharacter, "\\" + specialCharacter);
          }
        }
      }
      for (const specialWord of reservedWords) {
        if (escapedQuery === specialWord) {
          escapedQuery = "\"" + specialWord + "\"";
        }
        if (escapedQuery.startsWith(specialWord + " ")) {
          escapedQuery = "\"" + specialWord + "\" " + escapedQuery.substring(specialWord.length + 1);
        }
        if (escapedQuery.endsWith(" " + specialWord)) {
          escapedQuery = escapedQuery.substring(0, escapedQuery.length - (specialWord.length + 1)) + " \"" + specialWord + "\"";
        }
        //escapedQuery = replaceAll(escapedQuery, " " + specialWord + " ", " \"" + specialWord + "\" ");
        escapedQuery = escapedQuery.replace(new RegExp(` ${specialWord} `, 'g'), ` \"${specialWord}\" `);
      }
    }

    //if (escapedQuery === "") {
    //  escapedQuery = " ";
    //}
    return escapedQuery;
  }
  function escapeQueryWithCustomLength(query, length) {
    return escapeQuery(query).substring(0, length);
  }
  function escapeQueryWithDefaultLength(query) {
    return escapeQuery(query).substring(0, 1500);
  }
  function existValueInEnum(type, value) {
    return Object.keys(type).filter(k => isNaN(Number(k))).filter(k => type[k] === value).length > 0;
  }
  var NearOrdering = /*#__PURE__*/function (NearOrdering) {
    NearOrdering["Ordered"] = "O";
    NearOrdering["Unordered"] = "U";
    return NearOrdering;
  }(NearOrdering || {});
  class ListValues {
    clazz = this.constructor.name;
    values;
    constructor(item) {
      this.values = item.values;
    }
    toStatement() {
      return `[${this.values.map(value => typeof value === "string" ? "'" + escapeSingleQuote(value) + "'" : value.toStatement()).join(",")}]`;
    }
  }
  class NullValue {
    clazz = this.constructor.name;
    constructor() {}
    toStatement() {
      return "null";
    }
  }
  class BooleanValue {
    clazz = this.constructor.name;
    value;
    constructor(item) {
      this.value = item.value;
    }
    toStatement() {
      return this.value.toString();
    }
  }
  class NumberValue {
    clazz = this.constructor.name;
    value;
    constructor(item) {
      this.value = item.value;
    }
    toStatement() {
      return String(this.value);
    }
  }
  class StringValue {
    clazz = this.constructor.name;
    value;
    isQuoted;
    isSingleQuoted;
    withoutEnclosing;
    constructor(item) {
      this.value = item.value;
      this.isQuoted = item.isQuoted;
      this.isSingleQuoted = item.isSingleQuoted;
      this.withoutEnclosing = item.withoutEnclosing;
    }
    toStatement() {
      if (this.withoutEnclosing) {
        return String(Number.parseFloat(this.value));
      }
      if (this.isQuoted) {
        return `"${escapeDoubleQuoteAndBackslash(this.value)}"`;
      }
      if (this.isSingleQuoted) {
        return `'${escapeSingleQuote(this.value)}'`;
      }
      return this.value;
    }
  }
  class ViewParameter {
    clazz = this.constructor.name;
    param;
    constructor(item) {
      this.param = item.param;
    }
    toStatement() {
      return `param "${escapeDoubleQuoteAndBackslash(this.param)}"`;
    }
  }
  class HierarchyFacet {
    clazz = this.constructor.name;
    facetColumn;
    rootIds;
    levels;
    constructor(item) {
      this.facetColumn = item.facetColumn;
      this.rootIds = item.rootIds;
      this.levels = item.levels;
    }
    toStatement() {
      return `(${this.facetColumn},(${this.rootIds.map(id => id ? "'" + id + "'" : "null").join(",")}),${this.levels})`;
    }
  }
  class NearOperator {
    clazz = this.constructor.name;
    distance;
    ordering;
    constructor(item) {
      this.distance = item.distance;
      this.ordering = item.ordering;
    }
    toStatement() {
      return `:NEAR(${this.distance}${this.ordering ? "," + this.ordering : ""}):`;
    }
  }
  var InListOperator = /*#__PURE__*/function (InListOperator) {
    InListOperator["AND"] = "AND";
    InListOperator["OR"] = "OR";
    return InListOperator;
  }(InListOperator || {});
  class InList {
    clazz = this.constructor.name;
    operator;
    values;
    constructor(item) {
      this.operator = item.operator;
      this.values = item.values;
    }
    toStatement() {
      return `${this.operator}(${this.values.join(" ")})`;
    }
  }
  class SpatialReferenceSystemsOperatorBase {
    clazz = this.constructor.name;
    functionName;
    id;
    constructor(functionName, id) {
      this.functionName = functionName;
      this.id = id;
    }
    toStatement() {
      return `:${this.functionName}${this.id ? "(" + this.id + ")" : ""}:`;
    }
  }
  class SpatialReferenceSystemsOperator {
    clazz = this.constructor.name;
    id;
    constructor(item) {
      this.id = item.id;
    }
    toStatement() {
      return `:${this.id ? "(" + this.id + "):" : ""}`;
    }
  }
  class WithinOperator extends SpatialReferenceSystemsOperatorBase {
    constructor(item) {
      super("WITHIN", item.id);
    }
  }
  class CoveredByOperator extends SpatialReferenceSystemsOperatorBase {
    constructor(item) {
      super("COVERED_BY", item.id);
    }
  }
  class IntersectsOperator extends SpatialReferenceSystemsOperatorBase {
    constructor(item) {
      super("INTERSECTS", item.id);
    }
  }
  const pointCoordinates = item => `${item.x} ${item.y}`;
  class PointValues {
    clazz = this.constructor.name;
    point;
    constructor(point) {
      this.point = point;
    }
    toStatement() {
      return `POINT(${pointCoordinates(this.point)})`;
    }
  }
  class MultiPointValues {
    clazz = this.constructor.name;
    points;
    constructor(points) {
      this.points = points;
    }
    toStatement() {
      return `MULTIPOINT(${this.points.map(point => "(" + pointCoordinates(point) + ")").join(",")})`;
    }
  }
  class LineStringValues {
    clazz = this.constructor.name;
    points;
    constructor(points) {
      this.points = points;
    }
    toStatement() {
      return `LINESTRING${LineStringValues.toLineStringArray(this.points)}`;
    }
    static toLineStringArray(points) {
      return `(${points.map(point => pointCoordinates(point)).join(", ")})`;
    }
  }
  class CircularStringValues extends LineStringValues {
    constructor(points) {
      super(points);
    }
    toStatement() {
      return `CIRCULARSTRING${LineStringValues.toLineStringArray(this.points)}`;
    }
  }
  class MultiLineStringValues {
    clazz = this.constructor.name;
    lineStrings;
    constructor(points) {
      this.lineStrings = points;
    }
    toStatement() {
      return `MULTILINESTRING(${this.lineStrings.map(lineString => LineStringValues.toLineStringArray(lineString)).join(", ")})`;
    }
  }
  class PolygonValues extends MultiLineStringValues {
    constructor(points) {
      super(points);
    }
    toStatement() {
      return `POLYGON${PolygonValues.toPolygonStringArray(this.lineStrings)}`;
    }
    static toPolygonStringArray(polygon) {
      return `(${polygon.map(lineString => LineStringValues.toLineStringArray(lineString)).join(", ")})`;
    }
  }
  class MultiPolygonValues {
    clazz = this.constructor.name;
    polygons;
    constructor(polygons) {
      this.polygons = polygons;
    }
    toStatement() {
      return `MULTIPOLYGON(${this.polygons.map(polygon => PolygonValues.toPolygonStringArray(polygon)).join(", ")})`;
    }
  }
  class GeometryCollectionValues {
    clazz = this.constructor.name;
    geometryCollection;
    constructor(geometryCollection) {
      this.geometryCollection = geometryCollection;
    }
    toStatement() {
      return `GEOMETRYCOLLECTION(${this.geometryCollection.map(geometry => geometry.toStatement()).join(", ")})`;
    }
  }
  class RangeValues {
    clazz = this.constructor.name;
    start;
    end;
    excludeStart;
    excludeEnd;
    constructor(item) {
      this.start = item.start;
      this.end = item.end;
      this.excludeStart = item.excludeStart;
      this.excludeEnd = item.excludeEnd;
    }
    toStatement() {
      return `${this.excludeStart ? "]" : "["}${escapeQuery(this.start.toString())} ${escapeQuery(this.end.toString())}${this.excludeEnd ? "[" : "]"}`;
    }
  }
  class Comparison {
    clazz = this.constructor.name;
    property;
    operator;
    value;
    valueAsReservedWord;
    searchOptions;
    constructor(item) {
      this.property = item.property;
      this.operator = item.operator;
      this.value = item.value;
      this.valueAsReservedWord = item.valueAsReservedWord;
      this.searchOptions = item.searchOptions;
    }
    toStatement() {
      let escapeValueCharStart = "";
      let escapeValueCharEnd = "";
      /* 
      if (existValueInEnum(ComparisonOperator, this.operator)) {
        if (this.valueAsReservedWord) {
          escapeValueCharStart = "";
          escapeValueCharEnd = "";
        } else {
          escapeValueCharStart = "'";
          escapeValueCharEnd = "'";
        }
      } else if (this.operator === SearchQueryComparisonOperator.Fuzzy) {
        escapeValueCharStart = "(";
        escapeValueCharEnd = ")";
      } */
      let isODataComparison = false;
      if (existValueInEnum(ComparisonOperator, this.operator)) {
        isODataComparison = true;
        if (this.value && (this.value instanceof NullValue || this.value instanceof BooleanValue || this.value instanceof NumberValue || this.value instanceof ListValues || this.value instanceof ViewParameter)) {
          this.valueAsReservedWord = true;
        }
        if (this.valueAsReservedWord) {
          escapeValueCharStart = "";
          escapeValueCharEnd = "";
        } else {
          escapeValueCharStart = "'";
          escapeValueCharEnd = "'";
        }
      }
      const propertyValues = typeof this.property === "string" ? this.property : this.property.toStatement();
      let valueQuery = "";
      if (this.value) {
        if (typeof this.value === "string") {
          if (isODataComparison) {
            valueQuery = escapeSingleQuote(this.value);
          } else {
            valueQuery = escapeQuery(this.value.toString());
          }
        } else {
          valueQuery = this.value.toStatement();
        }
        // valueQuery = typeof (this.value) === "string" ? escapeQuery(this.value.toString()) : this.value.toStatement();
      }
      const comparisonOperator = typeof this.operator === "string" ? this.operator : this.operator.toStatement();
      const comparisonStatement = propertyValues + comparisonOperator + escapeValueCharStart + valueQuery + escapeValueCharEnd;
      return addFuzzySearchOptions(comparisonStatement, this.searchOptions);
    }
  }
  class ScopeComparison {
    clazz = this.constructor.name;
    values;
    constructor(item) {
      this.values = item.values;
    }
    toStatement() {
      if (this.values.length === 0) {
        throw new Error("ScopeComparison values cannot be empty");
      }
      return this.values.length > 1 ? `SCOPE:(${this.values.join(" OR ")})` : `SCOPE:${this.values[0]}`;
    }
  }
  class Term {
    clazz = this.constructor.name;
    term;
    searchOptions;
    isQuoted;
    doEshEscaping;
    constructor(item) {
      this.term = item.term;
      this.searchOptions = item.searchOptions;
      this.isQuoted = item.isQuoted;
      if (typeof item.doEshEscaping != 'undefined' && item.doEshEscaping != null) {
        this.doEshEscaping = item.doEshEscaping;
      } else {
        this.doEshEscaping = true;
      }
    }
    toStatement() {
      let finalTerm;
      if (this.doEshEscaping) {
        finalTerm = this.isQuoted ? '"' + escapePhrase(this.term) + '"' : escapeQuery(this.term);
      } else {
        finalTerm = this.isQuoted ? '"' + this.term + '"' : this.term;
      }
      return addFuzzySearchOptions(finalTerm, this.searchOptions);
    }
  }
  const escapePhrase = value => {
    let returnValue = value.replace(/\\/g, '\\\\');
    returnValue = returnValue.replace(/"/g, '\\"');
    // returnValue = returnValue.replace(/\*/g, '\\*'); // do not escape *
    returnValue = returnValue.replace(/\?/g, '\\?');
    returnValue = returnValue.replace(/\'/g, "''");
    return returnValue;
  };
  class Phrase {
    clazz = this.constructor.name;
    phrase;
    searchOptions;
    doEshEscaping;
    constructor(item) {
      this.phrase = item.phrase;
      this.searchOptions = item.searchOptions;
      if (typeof item.doEshEscaping != 'undefined' && item.doEshEscaping != null) {
        this.doEshEscaping = item.doEshEscaping;
      } else {
        this.doEshEscaping = true;
      }
    }
    toStatement() {
      let finalPhrase;
      if (this.doEshEscaping) {
        finalPhrase = escapePhrase(this.phrase);
      } else {
        finalPhrase = this.phrase;
      }
      // return addFuzzySearchOptions("\"" + replaceAll(this.phrase, '"', '\\"') + "\"", this.searchOptions);
      // return addFuzzySearchOptions("\"" + this.phrase.replace(/"/g, '\\"') + "\"", this.searchOptions);
      // return addFuzzySearchOptions("\"" + escapePhrase(this.phrase) + "\"", this.searchOptions);
      return addFuzzySearchOptions("\"" + finalPhrase + "\"", this.searchOptions);
    }
  }
  class Near {
    clazz = this.constructor.name;
    terms;
    distance;
    ordering;
    searchOptions;
    constructor(item) {
      this.terms = item.terms;
      this.distance = item.distance;
      this.ordering = item.ordering;
      this.searchOptions = item.searchOptions;
    }
    toStatement() {
      const values = [];
      this.terms.forEach(value => {
        values.push(typeof value === "string" ? value : value.toStatement());
      });
      const nearStatement = `NEAR(${this.distance}${this.ordering ? "," + this.ordering : ""}):(${values.join(" ")})`;
      return addFuzzySearchOptions(nearStatement, this.searchOptions);
    }
  }
  class Property {
    clazz = this.constructor.name;
    property;
    prefixOperator;
    // searchOptions: ISearchOptions

    constructor(item) {
      this.property = item.property;
      this.prefixOperator = item.prefixOperator;
    }
    toStatement() {
      if (this.prefixOperator) {
        return this.prefixOperator + " " + this.property;
      }
      return this.property;
    }
  }
  var LogicalOperator = /*#__PURE__*/function (LogicalOperator) {
    LogicalOperator["and"] = "and";
    LogicalOperator["or"] = "or";
    LogicalOperator["not"] = "not";
    return LogicalOperator;
  }(LogicalOperator || {});
  var SearchQueryLogicalOperator = /*#__PURE__*/function (SearchQueryLogicalOperator) {
    SearchQueryLogicalOperator["AND"] = "AND";
    SearchQueryLogicalOperator["TIGHT_AND"] = "";
    SearchQueryLogicalOperator["OR"] = "OR";
    SearchQueryLogicalOperator["NOT"] = "NOT";
    SearchQueryLogicalOperator["ROW"] = "ROW";
    SearchQueryLogicalOperator["AUTH"] = "AUTH";
    SearchQueryLogicalOperator["FILTER"] = "FILTER";
    SearchQueryLogicalOperator["FILTERWF"] = "FILTERWF";
    SearchQueryLogicalOperator["BOOST"] = "BOOST";
    return SearchQueryLogicalOperator;
  }(SearchQueryLogicalOperator || {});
  var SearchQueryPrefixOperator = /*#__PURE__*/function (SearchQueryPrefixOperator) {
    SearchQueryPrefixOperator["AND"] = "AND";
    SearchQueryPrefixOperator["OR"] = "OR";
    SearchQueryPrefixOperator["NOT"] = "NOT";
    SearchQueryPrefixOperator["AND_NOT"] = "AND NOT";
    SearchQueryPrefixOperator["OR_NOT"] = "OR NOT";
    return SearchQueryPrefixOperator;
  }(SearchQueryPrefixOperator || {});
  function addFuzzySearchOptions(item, searchOptions) {
    let returnStatement = item;
    if (searchOptions) {
      if (searchOptions.fuzzinessThreshold) {
        returnStatement = returnStatement + "~" + searchOptions.fuzzinessThreshold.toString();
      }
      if (searchOptions.fuzzySearchOptions) {
        if (!searchOptions.fuzzinessThreshold) {
          returnStatement = returnStatement + "~0.8"; //default fuzzinessThreshold
        }
        returnStatement = returnStatement + "[" + searchOptions.fuzzySearchOptions + "]";
      }
      if (searchOptions.weight !== undefined) {
        returnStatement = `${returnStatement}^${searchOptions.weight}`;
      }
    }
    return returnStatement;
  }
  class Expression {
    clazz = this.constructor.name;
    operator;
    items;
    searchOptions;
    constructor(item) {
      this.operator = item.operator;
      this.items = item.items;
      this.searchOptions = item.searchOptions;
    }
    toStatement() {
      let returnStatement = "";
      switch (this.operator) {
        case SearchQueryLogicalOperator.ROW:
        case SearchQueryLogicalOperator.AUTH:
        case SearchQueryLogicalOperator.FILTER:
        case SearchQueryLogicalOperator.FILTERWF:
        case SearchQueryLogicalOperator.BOOST:
          let operatorValue = this.items.map(i => i.toStatement()).join(" " + this.operator + " ");
          if (!operatorValue.startsWith("(")) {
            operatorValue = "(" + operatorValue + ")";
          }
          returnStatement = this.operator + ":" + operatorValue;
          break;
        case SearchQueryLogicalOperator.NOT:
          if (this.items.length > 1) {
            throw new Error("Invalid operator. NOT operator is allowed only on a single item.");
          }
          returnStatement = "(NOT " + this.items[0].toStatement() + ")";
          break;
        case LogicalOperator.not:
          if (this.items.length > 1) {
            throw new Error("Invalid operator. 'not' operator is allowed only on a single item.");
          }
          returnStatement = "not " + this.items[0].toStatement();
          break;
        default:
          if (!this.items || this.items.length == 0) {
            return "";
          } else if (this.items.length > 1) {
            const itemsScopes = this.items.filter(i => {
              return i instanceof ScopeComparison;
            });
            if (itemsScopes.length > 0) {
              returnStatement = this.items.map(i => i.toStatement()).join(`${this.operator === "" ? " " : " " + this.operator + " "}`);
            } else {
              returnStatement = "(" + this.items.map(i => i.toStatement()).join(`${this.operator === "" ? " " : " " + this.operator + " "}`) + ")";
            }
          } else {
            returnStatement = this.items[0].toStatement();
          }
          break;
      }
      return addFuzzySearchOptions(returnStatement, this.searchOptions);
    }
  }
  var SearchQueryComparisonOperator = /*#__PURE__*/function (SearchQueryComparisonOperator) {
    SearchQueryComparisonOperator["Search"] = ":";
    SearchQueryComparisonOperator["EqualCaseInsensitive"] = ":EQ:";
    SearchQueryComparisonOperator["NotEqualCaseInsensitive"] = ":NE:";
    SearchQueryComparisonOperator["LessThanCaseInsensitive"] = ":LT:";
    SearchQueryComparisonOperator["LessThanOrEqualCaseInsensitive"] = ":LE:";
    SearchQueryComparisonOperator["GreaterThanCaseInsensitive"] = ":GT:";
    SearchQueryComparisonOperator["GreaterThanOrEqualCaseInsensitive"] = ":GE:";
    SearchQueryComparisonOperator["EqualCaseSensitive"] = ":EQ(S):";
    SearchQueryComparisonOperator["NotEqualCaseSensitive"] = ":NE(S):";
    SearchQueryComparisonOperator["LessThanCaseSensitive"] = ":LT(S):";
    SearchQueryComparisonOperator["LessThanOrEqualCaseSensitive"] = ":LE(S):";
    SearchQueryComparisonOperator["GreaterThanCaseSensitive"] = ":GT(S):";
    SearchQueryComparisonOperator["GreaterThanOrEqualCaseSensitive"] = ":GE(S):";
    SearchQueryComparisonOperator["IsNull"] = ":IS:NULL";
    SearchQueryComparisonOperator["BetweenCaseInsensitive"] = ":BT:";
    SearchQueryComparisonOperator["BetweenCaseSensitive"] = ":BT(S):";
    SearchQueryComparisonOperator["DescendantOf"] = ":DESCENDANT_OF:";
    SearchQueryComparisonOperator["ChildOf"] = ":CHILD_OF:";
    return SearchQueryComparisonOperator;
  }(SearchQueryComparisonOperator || {});
  var ComparisonOperator = /*#__PURE__*/function (ComparisonOperator) {
    ComparisonOperator["Equal"] = " eq ";
    ComparisonOperator["NotEqual"] = " ne ";
    ComparisonOperator["GreaterThan"] = " gt ";
    ComparisonOperator["LessThan"] = " lt ";
    ComparisonOperator["GreaterThanOrEqualTo"] = " ge ";
    ComparisonOperator["LessThanOrEqualTo"] = " le ";
    ComparisonOperator["Is"] = " is ";
    ComparisonOperator["In"] = " in ";
    ComparisonOperator["IsNot"] = " is not ";
    return ComparisonOperator;
  }(ComparisonOperator || {});
  var ESOrderType = /*#__PURE__*/function (ESOrderType) {
    ESOrderType["Ascending"] = "ASC";
    ESOrderType["Descending"] = "DESC";
    return ESOrderType;
  }(ESOrderType || {});
  const SEARCH_DEFAULTS = {
    query: "",
    scope: ""
  };
  class PropertyAlias {
    clazz = this.constructor.name;
    path;
    alias;
    constructor(item) {
      this.path = item.path;
      this.alias = item.alias;
    }
    toStatement() {
      return `${this.path.join(".")} ${this.alias}`;
      // return `${this.path.map((item)=> "\"" + escapeDoubleQuoteAndBackslash(item) + "\"").join(".")} ${this.alias}`;
    }
  }
  class Alias {
    clazz = this.constructor.name;
    type;
    alias;
    constructor(item) {
      this.type = item.type;
      this.alias = item.alias;
    }
    toStatement() {
      return `${this.type} ${this.alias}`;
      // return `"${escapeDoubleQuoteAndBackslash(this.type)}" ${this.alias}`;
    }
  }
  class DynamicView {
    clazz = this.constructor.name;
    name;
    select;
    aliases;
    properties;
    paths;
    conditions;
    constructor(item) {
      this.name = item.name;
      this.select = item.select;
      this.aliases = item.aliases;
      this.properties = item.properties;
      this.paths = item.paths;
      this.conditions = item.conditions;
    }
    toStatement() {
      let returnValue = {
        name: this.name,
        select: this.select.join(", ")
      };
      let listOfAliases = [];
      if (this.aliases) {
        returnValue.aliases = this.aliases.map(alias => {
          return alias.toStatement();
        }).join(", ");
        listOfAliases = this.aliases.map(item => item.alias);
      }
      returnValue.properties = this.properties.map(property => {
        return property.toStatement();
      }).join(", ");
      returnValue.paths = this.paths.map(paths => {
        return paths.map(path => {
          return typeof path === 'string' ? path : path.join(".");
        }).join('/');
      }).join(", ");
      if (this.conditions) {
        returnValue.conditions = this.conditions.map(condition => {
          return condition.toStatement();
        }).join(", ");
      }
      return Object.keys(returnValue).map(key => {
        return `${key}: ${returnValue[key]}`;
      }).join("; ") + ";";
    }
  }
  class CustomFunction {
    clazz = this.constructor.name;
    name;
    arguments;
    constructor(item) {
      this.name = item.name;
      this.arguments = item.arguments;
    }
    toStatement() {
      let argumentsValue = '';
      if (this.arguments) {
        argumentsValue = Object.keys(this.arguments).map(key => {
          let singleArgumentValue = `${key}=`;
          if (this.arguments && typeof this.arguments[key] === 'string') {
            singleArgumentValue = `'${escapeSingleQuote(this.arguments[key])}'`;
          } else if (this.arguments && this.arguments[key] && typeof this.arguments[key] === 'object') {
            if (typeof this.arguments[key].toStatement === "function") {
              if (this.arguments[key] instanceof CustomFunction || this.arguments[key] instanceof FilterFunction) {
                singleArgumentValue = this.arguments[key].toStatement();
              } else {
                if (this.arguments[key] instanceof NumberValue) {
                  singleArgumentValue = this.arguments[key].toStatement();
                } else {
                  singleArgumentValue = `'${this.arguments[key].toStatement()}'`;
                }
              }
            } else if (Array.isArray(this.arguments[key])) {
              singleArgumentValue = "[" + this.arguments[key].map(element => {
                if (element instanceof NumberValue) {
                  return element.toStatement();
                } else if (typeof element === 'string') {
                  return `'${escapeSingleQuote(element)}'`;
                } else {
                  return String(element);
                }
              }).join(",") + "]";
            } else {
              throw new Error("Unexpected object: " + this.arguments[key]);
            }
          } else {
            singleArgumentValue = String(this.arguments ? String(this.arguments[key]) : '');
          }
          return `${key}=${singleArgumentValue}`;
        }).join(",");
      }
      return `${typeof this.name === "string" ? this.name : this.name.join(".")}(${argumentsValue})`;
    }
  }
  class FilterFunction {
    clazz = this.constructor.name;
    customFunction;
    oDataFilter;
    constructor(item) {
      this.customFunction = item.customFunction;
      this.oDataFilter = item.oDataFilter;
    }
    toStatement() {
      let returnStatement;
      if (this.customFunction instanceof Expression) {
        let expressionStatement = `Search.search(query='${this.customFunction.toStatement()}')`;
        if (this.oDataFilter) {
          expressionStatement += ` and ${this.oDataFilter.toStatement()}`;
        }
        returnStatement = `filter(${expressionStatement})`;
      } else {
        returnStatement = `filter(${this.customFunction.toStatement()}`;
        if (this.oDataFilter) {
          returnStatement += ` and ${this.oDataFilter.toStatement()}`;
        }
        returnStatement += ")";
      }
      return returnStatement;
    }
  }
  const deserialize = jsonO => {
    //const jsonO = JSON.parse(jsonStr);
    if (typeof jsonO === "object") {
      switch (jsonO.clazz) {
        case "Property":
          return new Property(jsonO);
        case "Near":
          jsonO.terms = jsonO.terms.map(item => deserialize(item));
          return new Near(jsonO);
        case "Phrase":
          return new Phrase(jsonO);
        case "RangeValues":
          return new RangeValues(jsonO);
        case "GeometryCollectionValues":
          return new GeometryCollectionValues(jsonO.geometryCollection.map(item => deserialize(item)));
        case "MultiPolygonValues":
          return new MultiPolygonValues(jsonO.polygons);
        case "MultiLineStringValues":
          return new MultiLineStringValues(jsonO.lineStrings);
        case "CircularStringValues":
          return new CircularStringValues(jsonO.points);
        case "LineStringValues":
          return new LineStringValues(jsonO.points);
        case "MultiPointValues":
          return new MultiPointValues(jsonO.points);
        case "PointValues":
          return new PointValues(jsonO.point);
        case "SpatialReferenceSystemsOperator":
          return new SpatialReferenceSystemsOperator(jsonO);
        case "SpatialReferenceSystemsOperatorBase":
          return new SpatialReferenceSystemsOperatorBase(jsonO);
        case "InList":
          return new InList(jsonO);
        case "NearOperator":
          return new NearOperator(jsonO);
        case "Term":
          return new Term(jsonO);
        case "HierarchyFacet":
          return new HierarchyFacet(jsonO);
        case "Comparison":
          const deserializedComparison = new Comparison(jsonO);
          if (typeof deserializedComparison.property === "object") {
            deserializedComparison.property = deserialize(deserializedComparison.property);
          }
          if (deserializedComparison.operator && typeof deserializedComparison.operator === "object") {
            deserializedComparison.operator = deserialize(deserializedComparison.operator);
          }
          if (deserializedComparison.value && typeof deserializedComparison.value === "object") {
            deserializedComparison.value = deserialize(deserializedComparison.value);
          }
          return deserializedComparison;
        case "ScopeComparison":
          return new ScopeComparison(jsonO);
        case "WithinOperator":
          return new WithinOperator(jsonO);
        case "PolygonValues":
          return new PolygonValues(jsonO.lineStrings);
        case "CoveredByOperator":
          return new CoveredByOperator(jsonO);
        case "IntersectsOperator":
          return new IntersectsOperator(jsonO);
        case "Expression":
          const returnExpression = new Expression(jsonO);
          returnExpression.items = returnExpression.items.map(item => deserialize(item));
          return returnExpression;
        case "DynamicView":
          const returnDynamicView = new DynamicView(jsonO);
          returnDynamicView.properties = returnDynamicView.properties.map(property => deserialize(property));
          if (returnDynamicView.aliases) {
            returnDynamicView.aliases = returnDynamicView.aliases.map(alias => deserialize(alias));
          }
          if (returnDynamicView.conditions) {
            if (Array.isArray(returnDynamicView.conditions)) {
              returnDynamicView.conditions = returnDynamicView.conditions.map(condition => deserialize(condition));
            } else {
              returnDynamicView.conditions = deserialize(returnDynamicView.conditions);
            }
          }
          return returnDynamicView;
        case "Alias":
          return new Alias(jsonO);
        case "PropertyAlias":
          return new PropertyAlias(jsonO);
        case "ListValues":
          const returnValue = new ListValues(jsonO);
          returnValue.values = returnValue.values.map(element => deserialize(element));
          return returnValue;
        case "ViewParameter":
          return new ViewParameter(jsonO);
        case "NullValue":
          return new NullValue();
        case "BooleanValue":
          return new BooleanValue(jsonO);
        case "NumberValue":
          return new NumberValue(jsonO);
        case "StringValue":
          return new StringValue(jsonO);
        case "CustomFunction":
          const returnCustomFunction = new CustomFunction(jsonO);
          if (returnCustomFunction.arguments) {
            Object.keys(returnCustomFunction.arguments).map(key => {
              if (returnCustomFunction.arguments && typeof returnCustomFunction.arguments[key] === 'object' && typeof returnCustomFunction.arguments[key].clazz === "string") {
                if (["CustomFunction", "FilterFunction"].includes(returnCustomFunction.arguments[key].clazz)) {
                  returnCustomFunction.arguments[key] = deserialize(returnCustomFunction.arguments[key]);
                } else {
                  throw new Error(`Invalid statement in: ${key} = ${returnCustomFunction.arguments[key]}`);
                }
              }
            });
          }
          return returnCustomFunction;
        case "FilterFunction":
          const returnFilterFunction = new FilterFunction(jsonO);
          returnFilterFunction.customFunction = deserialize(returnFilterFunction.customFunction);
          if (returnFilterFunction.oDataFilter) {
            returnFilterFunction.oDataFilter = deserialize(returnFilterFunction.oDataFilter);
          }
          return returnFilterFunction;
        default:
          throw new Error("not implemented: " + JSON.stringify(jsonO));
      }
    }
    return jsonO;
  };
  var __exports = {
    __esModule: true
  };
  __exports.escapeSingleQuote = escapeSingleQuote;
  __exports.escapeDoubleQuoteAndBackslash = escapeDoubleQuoteAndBackslash;
  __exports.escapeQuery = escapeQuery;
  __exports.escapeQueryWithCustomLength = escapeQueryWithCustomLength;
  __exports.escapeQueryWithDefaultLength = escapeQueryWithDefaultLength;
  __exports.existValueInEnum = existValueInEnum;
  __exports.NearOrdering = NearOrdering;
  __exports.ListValues = ListValues;
  __exports.NullValue = NullValue;
  __exports.BooleanValue = BooleanValue;
  __exports.NumberValue = NumberValue;
  __exports.StringValue = StringValue;
  __exports.ViewParameter = ViewParameter;
  __exports.HierarchyFacet = HierarchyFacet;
  __exports.NearOperator = NearOperator;
  __exports.InListOperator = InListOperator;
  __exports.InList = InList;
  __exports.SpatialReferenceSystemsOperator = SpatialReferenceSystemsOperator;
  __exports.WithinOperator = WithinOperator;
  __exports.CoveredByOperator = CoveredByOperator;
  __exports.IntersectsOperator = IntersectsOperator;
  __exports.PointValues = PointValues;
  __exports.MultiPointValues = MultiPointValues;
  __exports.LineStringValues = LineStringValues;
  __exports.CircularStringValues = CircularStringValues;
  __exports.MultiLineStringValues = MultiLineStringValues;
  __exports.PolygonValues = PolygonValues;
  __exports.MultiPolygonValues = MultiPolygonValues;
  __exports.GeometryCollectionValues = GeometryCollectionValues;
  __exports.RangeValues = RangeValues;
  __exports.Comparison = Comparison;
  __exports.ScopeComparison = ScopeComparison;
  __exports.Term = Term;
  __exports.escapePhrase = escapePhrase;
  __exports.Phrase = Phrase;
  __exports.Near = Near;
  __exports.Property = Property;
  __exports.LogicalOperator = LogicalOperator;
  __exports.SearchQueryLogicalOperator = SearchQueryLogicalOperator;
  __exports.SearchQueryPrefixOperator = SearchQueryPrefixOperator;
  __exports.Expression = Expression;
  __exports.SearchQueryComparisonOperator = SearchQueryComparisonOperator;
  __exports.ComparisonOperator = ComparisonOperator;
  __exports.ESOrderType = ESOrderType;
  __exports.SEARCH_DEFAULTS = SEARCH_DEFAULTS;
  __exports.PropertyAlias = PropertyAlias;
  __exports.Alias = Alias;
  __exports.DynamicView = DynamicView;
  __exports.CustomFunction = CustomFunction;
  __exports.FilterFunction = FilterFunction;
  __exports.deserialize = deserialize;
  return __exports;
});
})();