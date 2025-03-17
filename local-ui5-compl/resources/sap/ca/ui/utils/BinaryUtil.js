/*
 * Binary Ajax 0.2
 * Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/
 * Licensed under the MPL License [http://www.nihilogic.dk/licenses/mpl-license.txt]
 */
jQuery.sap.declare("sap.ca.ui.utils.BinaryUtil");sap.ui.base.Object.extend("sap.ca.ui.utils.BinaryUtil",{constructor:function(t,r){var e=t;var i=r;this.getByteAt=function(t){return e.charCodeAt(t)&255};this.getBytesAt=function(t,r,i){var n=[];if(i===undefined){i=true}for(var a=0;a<r;a++){if(i){n[a]=e.charCodeAt(t+a)&255}else{n[a]=e.charCodeAt(t+r-a-1)&255}}return n};this.getLength=function(){return i};this.getSShortAt=function(t,r){var e=this.getBytesAt(t,2,r);var i=(e[0]<<8)+e[1];return i};this.getShortAt=function(t,r){var e=this.getSShortAt(t,r);if(e<0)e+=65536;return e};this.getLongAt=function(t,r){var e=this.getSLongAt(t,r);if(e<0)e+=4294967296;return e};this.getSLongAt=function(t,r){var e=this.getBytesAt(t,4,r);var i=(((e[0]<<8)+e[1]<<8)+e[2]<<8)+e[3];return i};this.getStringAt=function(t,r){var e=[];var i=this.getBytesAt(t,r);for(var n=0;n<r;n++){e[n]=String.fromCharCode(i[n])}return e.join("")}}});
//# sourceMappingURL=BinaryUtil.js.map