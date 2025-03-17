/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
  "sap/sac/df/utils/ResourceBundle",
  [
    "sap/sac/df/utils/ResourceModel"
  ],
  function (ResourceModel) {
    "use strict";
    const resourceBundle = ResourceModel.getResourceBundle();
    resourceBundle.getTextWithPlaceholder = (text, placeholder) =>{
      return resourceBundle.getText(text, [placeholder]);
    };
    resourceBundle.getTextWithPlaceholder2 = (text, placeHolder, placeHolder2) =>{
      return resourceBundle.getText(text, [placeHolder, placeHolder2]);
    };

    resourceBundle.getTextWithPlaceholders = (key, replacementList) => {
      const replacementArray = [];
      if(replacementList != null){
        for( let i = 0; i < replacementList.size(); i++ ){
          replacementArray.push(replacementList.get( i ));
        }
      }
      return resourceBundle.getText(key, replacementArray);
    };
    return resourceBundle;
  }
);
