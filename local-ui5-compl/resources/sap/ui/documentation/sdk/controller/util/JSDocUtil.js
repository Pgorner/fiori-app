/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/strings/escapeRegExp"],function(r){"use strict";function e(r,e){return"<code>"+(e||r)+"</code>"}function a(a,t){t=t||{};var n=t.beforeParagraph==null?"<p>":t.beforeParagraph;var f=t.afterParagraph==null?"</p>":t.afterParagraph;var i=t.beforeFirstParagraph==null?n:t.beforeFirstParagraph;var s=t.afterLastParagraph==null?f:t.afterLastParagraph;var l=typeof t.linkFormatter==="function"?t.linkFormatter:e;var p=/(<pre>)|(<\/pre>)|(<h[\d+]>)|(<\/h[\d+]>)|\{@link\s+([^}\s]+)(?:\s+([^\}]*))?\}|((?:\r\n|\r|\n)[ \t]*(?:\r\n|\r|\n))/gi;var u=false;a=a||"";l=l||e;a=i+a.replace(p,function(r,e,a,t,i,s,p,o){if(e){u=true}else if(a){u=false}else if(t){if(!u){return f+r}}else if(i){if(!u){return r+n}}else if(o){if(!u){return f+n}}else if(s){if(!u){return l(s,p)}}return r})+s;a=a.replace(new RegExp(r(n)+"s*"+r(f),"g"),"");return a}return{formatTextBlock:a}});
//# sourceMappingURL=JSDocUtil.js.map