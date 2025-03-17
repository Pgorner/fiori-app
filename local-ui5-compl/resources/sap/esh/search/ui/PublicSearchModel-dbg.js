/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["sap/ui/model/json/JSONModel", "./sinaNexTS/sina/cloneUtil"], function (JSONModel, ___sinaNexTS_sina_cloneUtil) {
  "use strict";

  const clonePublic = ___sinaNexTS_sina_cloneUtil["clonePublic"];
  /**
   * @namespace sap.esh.search.ui
   */
  const PublicSearchModel = JSONModel.extend("sap.esh.search.ui.PublicSearchModel", {
    // name used to bind to controls (see SearchCompositeControl)
    constructor: function _constructor(settings) {
      JSONModel.prototype.constructor.call(this);
      this.modelName = settings.modelName;
      this.internalSearchModel = settings.internalSearchModel;
    },
    setPropertyFromInternalModel: function _setPropertyFromInternalModel(internalModel, sPath, oValue, oContext, bAsyncUpdate) {
      let propertyValue;
      let absolutePath = sPath;
      if (oContext) {
        absolutePath = `${oContext.getPath()}/${sPath}`;
      }
      if (absolutePath === "/results") {
        const fnDataToBeCloned = item => {
          if (item["type"] === "appcontainer") {
            return item.tiles;
          } else {
            return item.sinaItem;
          }
        };
        // search results
        let searchResults;
        try {
          searchResults = {
            items: oValue.map((searchResultItem, index) => {
              const clonedData = clonePublic(fnDataToBeCloned(searchResultItem));
              const resultSetItem = {
                data: clonedData,
                selected: searchResultItem.selected,
                setSelected: select => {
                  internalModel.setProperty(`/results/${index}/selected`, select);
                },
                selectionEnabled: searchResultItem.selectionEnabled,
                setSelectionEnabled: enable => {
                  internalModel.setProperty(`/results/${index}/selectionEnabled`, enable);
                },
                customItemStyleClass: searchResultItem.customItemStyleClass,
                // css class to be added to result item (table, grid, list)
                setCustomItemStyleClass: customItemStyleClass => {
                  internalModel.setProperty(`/results/${index}/customItemStyleClass`, customItemStyleClass);
                }
              };
              return resultSetItem;
            })
          };
        } catch (error) {
          throw new Error("Public Model could not be updated. Error: " + error + ")");
        }
        propertyValue = searchResults;
      }
      if (!propertyValue) {
        propertyValue = oValue;
      }
      this.setPropertyInternal(absolutePath, propertyValue, undefined, bAsyncUpdate);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setPropertyInternal: function _setPropertyInternal(sPath, oValue, oContext, bAsyncUpdate) {
      let absolutePath = sPath;
      let success;
      if (oContext) {
        absolutePath = `${oContext.getPath()}/${sPath}`;
      }
      const publicProperty = this.isPublicProperty(absolutePath);
      if (publicProperty.length > 0) {
        if (typeof publicProperty[0]?.targetPath !== "undefined") {
          // property shall be renamed for public model
          if (typeof publicProperty[0]?.targetPath === "function") {
            success = JSONModel.prototype.setProperty.call(this, publicProperty[0]?.targetPath(absolutePath), oValue, undefined, bAsyncUpdate);
          } else {
            success = JSONModel.prototype.setProperty.call(this, publicProperty[0]?.targetPath, oValue, oContext, bAsyncUpdate);
          }
        } else {
          // default
          success = JSONModel.prototype.setProperty.call(this, sPath, oValue, oContext, bAsyncUpdate);
        }
        // update 'multiSelectionObjects', ... of internal model
        if (absolutePath.startsWith("/results/") && absolutePath.endsWith("/selected")) {
          this.internalSearchModel.updateMultiSelectionSelected();
        }
      } else {
        // this property is private and shall not be added to public search model
      }
      return success;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setProperty: function _setProperty(sPath, oValue, oContext, bAsyncUpdate) {
      // in general we need to make sure this model is only updated by ELISA SearchModel !!!
      // Changeable properties:
      // - /results/items[...]/selected
      // - /results/items[...]/selectionEnabled
      // - /results/items[...]/customItemStyleClass
      let absolutePath = sPath;
      if (oContext) {
        absolutePath = `${oContext.getPath()}/${sPath}`;
      }
      if (absolutePath.startsWith("/results/items/") && absolutePath.endsWith("/selected")) {
        const successPublicModel = JSONModel.prototype.setProperty.call(this, sPath, oValue, oContext, bAsyncUpdate);
        // selected: Checkbox (item) is set (if visible -> see selection modes)
        const propertyPathSearchModel = `/results/${absolutePath.replace("/results/items/", "").replace("/selected", "")}/selected`;
        const successInternalModel = this.internalSearchModel.setPropertyInternal(propertyPathSearchModel, oValue, undefined, bAsyncUpdate, false);
        this.internalSearchModel.updateMultiSelectionSelected();
        return successPublicModel && successInternalModel;
      } else if (absolutePath.startsWith("/results/items/") && absolutePath.endsWith("/selectionEnabled")) {
        const successPublicModel = JSONModel.prototype.setProperty.call(this, sPath, oValue, oContext, bAsyncUpdate);
        // selectionEnabled: Checkbox (item) is enabled (if visible -> see selection modes)
        const propertyPathSearchModel = `/results/${absolutePath.replace("/results/items/", "").replace("/selectionEnabled", "")}/selectionEnabled`;
        const successInternalModel = this.internalSearchModel.setPropertyInternal(propertyPathSearchModel, oValue, undefined, bAsyncUpdate, false);
        return successPublicModel && successInternalModel;
      } else if (absolutePath.startsWith("/results/items/") && absolutePath.endsWith("/customItemStyleClass")) {
        const successPublicModel = JSONModel.prototype.setProperty.call(this, sPath, oValue, oContext, bAsyncUpdate);
        const propertyPathSearchModel = `/results/${absolutePath.replace("/results/items/", "").replace("/customItemStyleClass", "")}/customItemStyleClass`;
        const successInternalModel = this.internalSearchModel.setPropertyInternal(propertyPathSearchModel, oValue, undefined, bAsyncUpdate, false);
        return successPublicModel && successInternalModel;
      } else {
        throw new Error(`The public search model '${this.modelName}' is read-only but for properties "/results/items/<idx>/selected", "/results/items/<idx>/selectionEnabled" and "/results/items/<idx>/customItemStyleClass". You are changing property '${absolutePath}'.`);
      }
    },
    isPublicProperty: function _isPublicProperty(sPath) {
      const publicProperty = PublicSearchModel.publicSearchModelPropertyPath.filter(prop => {
        if (prop.sourcePath instanceof RegExp) {
          return sPath.match(prop.sourcePath);
        } else {
          return prop.sourcePath === sPath;
        }
      });
      return publicProperty;
    }
  });
  PublicSearchModel.defaultModelName = "publicSearchModel";
  PublicSearchModel.publicSearchModelPropertyPath = [
  // when changing this list, make sure to keep QUnit test in sync: PublicSearchModel.spec.js
  {
    sourcePath: "/results"
  }, {
    sourcePath: /^\/results\/.*\/selected$/,
    // RegExp: Starts with '/results' and ends with '/selected'
    targetPath: sPath => sPath.replace("/results/", "/results/items/")
  }, {
    sourcePath: /^\/tableRows\/.*\/selected$/,
    // RegExp: Starts with '/tableRows' and ends with '/selected'
    targetPath: sPath => sPath.replace("/tableRows/", "/results/items/")
  }, {
    sourcePath: /^\/results\/.*\/selectionEnabled$/,
    // RegExp: Starts with '/results' and ends with '/selectionEnabled'
    targetPath: sPath => sPath.replace("/results/", "/results/items/")
  }, {
    sourcePath: /^\/tableRows\/.*\/selectionEnabled$/,
    // RegExp: Starts with '/tableRows' and ends with '/selectionEnabled'
    targetPath: sPath => sPath.replace("/tableRows/", "/results/items/")
  }, {
    sourcePath: /^\/results\/.*\/customItemStyleClass$/,
    // RegExp: Starts with '/results' and ends with '/customItemStyleClass'
    targetPath: sPath => sPath.replace("/results/", "/results/items/")
  }, {
    sourcePath: /^\/tableRows\/.*\/customItemStyleClass$/,
    // RegExp: Starts with '/tableRows' and ends with '/customItemStyleClass'
    targetPath: sPath => sPath.replace("/tableRows/", "/results/items/")
  }, {
    sourcePath: "/count"
  }, {
    sourcePath: "/singleSelectionSelected"
  }, {
    sourcePath: "/multiSelectionSelected"
  }, {
    sourcePath: "/multiSelectionObjects"
  }];
  return PublicSearchModel;
});
})();