/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(["sap/apf/core/utils/checkForTimeout","sap/apf/utils/exportToGlobal","sap/ui/model/odata/ODataUtils","sap/ui/thirdparty/jquery"],function(e,t,a,jQuery){"use strict";var s=function(t){var s={};var i=t&&t.functions&&t.functions.ajax;var n=t&&t.functions&&t.functions.getSapSystem&&t.functions.getSapSystem();this.check=function(t,r){if(n&&!r){t=a.setOrigin(t,{force:true,alias:n})}if(s[t]!==undefined){return s[t]}var u=false;var f={url:t,type:"HEAD",success:function(t,a,s){var i=e(s);if(i===undefined){u=true}else{u=false}},error:function(){u=false},async:false};if(i){i(f)}else{jQuery.ajax(f)}s[t]=u;return u}};t("sap.apf.core.utils.FileExists",s);return s},true);
//# sourceMappingURL=fileExists.js.map