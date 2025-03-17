/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log","sap/zen/dsh/widgets/sap_viz/class"],function(i,n){"use strict";i.info("Load DataContainer");var s=n.define({constructor:function(i){this._uId=i;this._isFake=false;this._infos=null},getId:function(){return this._uId},fake:function(i){if(!arguments.length){return this._isFake}this._isFake=i},infos:function(i){if(!arguments.length){return this._infos}this._infos=i;return null}});return s});
//# sourceMappingURL=DataContainer.js.map