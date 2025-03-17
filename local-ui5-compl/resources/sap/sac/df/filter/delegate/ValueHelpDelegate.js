/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
sap.ui.define(["sap/ui/mdc/ValueHelpDelegate"],function(e){"use strict";const t=Object.assign({},e);t.retrieveContent=function(e,t,n){return Promise.resolve()};t._searchValue=function(e,t){return e.searchMember(t,true,true,true,10).then(function(e){if(!e.length){return Promise.resolve()}return e})};t.isSearchSupported=function(e,t,n){return true};t.showTypeahead=function(e,t){if(!t||t.isA("sap.ui.mdc.valuehelp.base.FilterableListContent")&&!t.getFilterValue()){return false}else if(t.isA("sap.ui.mdc.valuehelp.base.ListContent")){const e=t.getListBinding();const n=e&&e.getAllCurrentContexts().length;return n>0}return true};t.getFirstMatch=function(e,t,n){return t.getRelevantContexts(n)[0]};return t});
//# sourceMappingURL=ValueHelpDelegate.js.map