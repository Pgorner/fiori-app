/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2019 SAP SE. All rights reserved.
 */
sap.ui.define([],function(){"use strict";var o={apfLogStyle:"color: blue; font-style: italic; background-color: wheat;padding: 1px",apfWarningStyle:"color: DarkMagenta; font-style: bold; background-color: wheat;padding: 1px",apfErrorStyle:"color: white; font-style: bold; background-color: red;padding: 1px",logCounter:0,_logBase:function(e,n,l,a,t,r,d,g,i){if(jQuery.sap.log.apfTrace===undefined){return}a=a===undefined?"":a||a;t=t===undefined?"":t||t;r=r===undefined?"":r||r;d=d===undefined?"":d||d;g=g===undefined?"":g||g;i=i===undefined?"":i||i;var u="%c%s %s %s ";window.console.log(u,e,n,o.logCounter,l,a,t,r,d,g,i)},log:function(e,n,l,a,t,r,d){o._logBase(o.apfLogStyle,"-APF-",e,n,l,a,t,r,d)},logCall:function(e,n,l,a,t,r,d){++o.logCounter;o._logBase(o.apfLogStyle,">APF>",e,n,l,a,t,r,d)},logReturn:function(e,n,l,a,t,r,d){o._logBase(o.apfLogStyle,"<APF<",e,n,l,a,t,r,d);--o.logCounter},emphasize:function(e,n,l,a,t,r,d){o._logBase(o.apfWarningStyle,"-APF-",e,n,l,a,t,r,d)}};return o});
//# sourceMappingURL=trace.js.map