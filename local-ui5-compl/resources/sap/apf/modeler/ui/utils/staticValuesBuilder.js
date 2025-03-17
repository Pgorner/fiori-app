/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(["sap/apf/modeler/ui/utils/nullObjectChecker","sap/apf/modeler/ui/utils/textManipulator","sap/apf/utils/exportToGlobal"],function(e,t,o){"use strict";function r(e,t){this.oTextReader=e;this.oOptionsValueModelBuilder=t}r.prototype.constructor=r;r.prototype.getNavTargetTypeData=function(){var e=[this.oTextReader("globalNavTargets"),this.oTextReader("stepSpecific")];return this.oOptionsValueModelBuilder.convert(e,e.length)};r.prototype.getSortDirections=function(){var e=[{key:"true",name:this.oTextReader("ascending")},{key:"false",name:this.oTextReader("descending")}];return this.oOptionsValueModelBuilder.prepareModel(e,e.length)};o("sap.apf.modeler.ui.utils.StaticValuesBuilder",r);return r},true);
//# sourceMappingURL=staticValuesBuilder.js.map