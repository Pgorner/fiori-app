/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../sinaNexTS/sina/SearchResultSetItemAttribute", "../sinaNexTS/sina/AttributeType"], function (___sinaNexTS_sina_SearchResultSetItemAttribute, ___sinaNexTS_sina_AttributeType) {
  "use strict";

  const SearchResultSetItemAttribute = ___sinaNexTS_sina_SearchResultSetItemAttribute["SearchResultSetItemAttribute"];
  const AttributeType = ___sinaNexTS_sina_AttributeType["AttributeType"];
  class Formatter {
    assembleLabel1(sinaSuggestion) {
      const title = [];
      let isHighlighted = false;
      let attribute;
      const titleAttributes = sinaSuggestion.object.titleAttributes;
      for (let i = 0; i < titleAttributes.length; ++i) {
        attribute = titleAttributes[i];
        if (attribute.metadata?.type === AttributeType.ImageUrl) {
          continue;
        }
        title.push(attribute.valueHighlighted);
        if (attribute.isHighlighted) {
          isHighlighted = true;
        }
      }
      return {
        label: title.join(" "),
        isHighlighted: isHighlighted
      };
    }
    assembleLabel2(label1IsHighlighted, sinaSuggestion) {
      const detailAttributes = sinaSuggestion.object.detailAttributes;
      let attribute;
      if (detailAttributes.length === 0) {
        return "";
      }
      if (!label1IsHighlighted) {
        attribute = this.getFirstHighlightedAttribute(detailAttributes);
        if (attribute) {
          return attribute.valueHighlighted;
        }
      }
      attribute = this.getFirstStringAttribute(detailAttributes);
      if (attribute) {
        return attribute.label + ": " + attribute.valueHighlighted;
      }
      return "";
    }
    getFirstHighlightedAttribute(attributes) {
      for (let i = 0; i < attributes.length; ++i) {
        const attribute = attributes[i];
        if (attribute.isHighlighted) {
          return attribute;
        }
      }
    }
    getFirstStringAttribute(attributes) {
      const sortOrder = {
        Date: 40,
        Double: 70,
        GeoJson: 130,
        ImageBlob: 120,
        ImageUrl: 110,
        Integer: 60,
        String: 10,
        Time: 50,
        Timestamp: 30
      };
      if (attributes.length === 0) {
        return null;
      }
      attributes = attributes.slice();
      attributes.sort(function (a1, a2) {
        return sortOrder[a1.metadata.type] - sortOrder[a2.metadata.type];
      });
      const attribute = attributes[0];
      if (sortOrder[attribute.metadata.type] > 100) {
        return null;
      }
      return attribute;
    }
    assembleNavigation(sinaSuggestion) {
      if (!sinaSuggestion.object.defaultNavigationTarget) {
        return null;
      }
      const navigationTarget = sinaSuggestion.object.defaultNavigationTarget;
      navigationTarget.target = "_blank"; // open in new window
      return navigationTarget;
    }
    assembleImageUrl(sinaSuggestion) {
      const aAttributes = sinaSuggestion.object.detailAttributes.concat(sinaSuggestion.object.titleAttributes);
      for (let i = 0; i < aAttributes.length; ++i) {
        const attribute = aAttributes[i];
        if (attribute instanceof SearchResultSetItemAttribute && attribute.metadata.type === attribute.sina.AttributeType.ImageUrl) {
          return {
            imageUrl: attribute.value,
            imageExists: true,
            imageIsCircular: attribute.metadata.format && attribute.metadata.format === sinaSuggestion.sina.AttributeFormatType.Round
          };
        }
      }
      return {
        exists: false
      };
    }
    format(suggestionProvider, sinaSuggestion) {
      // create suggestion
      const suggestion = sinaSuggestion;

      // assemble label
      const label1 = this.assembleLabel1(sinaSuggestion);
      suggestion.label1 = label1.label;

      // assemble second label (second line in UI)
      suggestion.label2 = this.assembleLabel2(label1.isHighlighted, sinaSuggestion);

      // assemble navigation target
      suggestion.titleNavigation = this.assembleNavigation(sinaSuggestion);

      // assemble image url
      const imageUrl = this.assembleImageUrl(sinaSuggestion);
      sinaSuggestion.sina.core.extend(suggestion, imageUrl);

      // position
      suggestion.position = sinaSuggestion.position;

      // add
      suggestionProvider.addSuggestion(suggestion);
    }
  }
  return Formatter;
});
})();