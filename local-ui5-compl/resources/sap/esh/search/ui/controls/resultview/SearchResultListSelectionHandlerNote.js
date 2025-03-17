/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["./SearchResultListSelectionHandler","sap/m/MessageBox"],function(e,t){"use strict";function n(e){return e&&e.__esModule&&typeof e.default!=="undefined"?e.default:e}const o=n(e);const i=o.extend("sap.esh.search.ui.controls.SearchResultListSelectionHandlerNote",{isMultiSelectionAvailable:function e(){return true},actionsForDataSource:function e(){const n=[{text:"Show Selected Items",action:function(e){let n="No Items were selected!";if(e.length>0){n="Following Items were selected:";for(let t=0;t<e.length;t++){n+="\n"+e[t].title}}t.show(n,{icon:t.Icon.INFORMATION,title:"I'm a Custom Action for testing Multi-Selection",actions:[t.Action.OK]})}}];return n}});return i})})();
//# sourceMappingURL=SearchResultListSelectionHandlerNote.js.map