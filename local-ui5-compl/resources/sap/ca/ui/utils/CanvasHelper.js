/**
 *
 * This file includes large portions of code from canvasResize
 * https://github.com/gokercebeci/canvasResize/blob/master/canvasResize.js
 * which is licensed under MIT license:
 *
 * ----------------------------------------------------------------------------------------------
 *
 * The MIT License
 *
 * Copyright (c) 2012 goker.cebeci, http://gokercebeci.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * It requires **binaryajax.js** and **exif.js** (or **jQuery EXIF**) to work which is also under
 * the [**MPL License**](http://www.nihilogic.dk/licenses/mpl-license.txt)
 *
 * ------------------------------------ ---------------------------------------------------------
 *
 */
jQuery.sap.declare("sap.ca.ui.utils.CanvasHelper");jQuery.sap.require("sap.ca.ui.utils.exif");jQuery.sap.require("sap.ca.ui.utils.BinaryUtil");sap.ui.base.ManagedObject.extend("sap.ca.ui.utils.CanvasHelper",{metadata:{properties:{width:{type:"int",group:"Appearance"},height:{type:"int",group:"Appearance"},crop:{type:"boolean",group:"Appearance"},quality:{type:"int",group:"Appearance"},minWeight:{type:"int",group:"Appearance"}},events:{done:{}}},_newsize:function(e,a,t,r,i){var n=i?"h":"";if(t&&e>t||r&&a>r){var o=e/a;if((o>=1||r===0)&&t&&!i){e=t;a=t/o>>0}else if(i&&o<=t/r){e=t;a=t/o>>0;n="w"}else{e=r*o>>0;a=r}}return{width:e,height:a,cropped:n}},_dataURLtoBlob:function(e){var a=e.split(",")[0].split(":")[1].split(";")[0];var t=atob(e.split(",")[1]);var r=new ArrayBuffer(t.length);var i=new Uint8Array(r);for(var n=0;n<t.length;n++){i[n]=t.charCodeAt(n)}var o=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder;if(o){o=new(window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder);o.append(r);return o.getBlob(a)}else{o=new Blob([r],{type:a});return o}},_detectSubsampling:function(e){var a=e.width,t=e.height;if(a*t>1024*1024){var r=document.createElement("canvas");r.width=r.height=1;var i=r.getContext("2d");i.drawImage(e,-a+1,0);return i.getImageData(0,0,1,1).data[3]===0}else{return false}},_transformCoordinate:function(e,a,t,r){if(r>=5&&r<=8){e.width=t;e.height=a}else{e.width=a;e.height=t}var i=e.getContext("2d");switch(r){case 1:break;case 2:i.translate(a,0);i.scale(-1,1);break;case 3:i.translate(a,t);i.rotate(Math.PI);break;case 4:i.translate(0,t);i.scale(1,-1);break;case 5:i.rotate(.5*Math.PI);i.scale(1,-1);break;case 6:i.rotate(.5*Math.PI);i.translate(0,-t);break;case 7:i.rotate(.5*Math.PI);i.translate(a,-t);i.scale(-1,1);break;case 8:i.rotate(-.5*Math.PI);i.translate(-a,0);break;default:break}},_detectVerticalSquash:function(e,a,t){var r=document.createElement("canvas");r.width=1;r.height=t;var i=r.getContext("2d");i.drawImage(e,0,0);var n=i.getImageData(0,0,1,t).data;var o=0;var s=t;var h=t;while(h>o){var l=n[(h-1)*4+3];if(l===0){s=h}else{o=h}h=s+o>>1}var d=h/t;return d===0?1:d},_keepRatio:function(e,a){if(e>a){this.setHeight(Math.round(this.getHeight()*(a/e)))}else if(e<a){this.setWidth(Math.round(this.getWidth()*(e/a)))}},resize:function(e){var a=this;var t=new FileReader;t.onloadend=function(t){var r=t.target.result;if(e.size/1024<a.getMinWeight()){jQuery.sap.log.info("Image is light, no resize is needed");a.fireDone({data:r})}else{var i=atob(r.split(",")[1]);var n=new sap.ca.ui.utils.BinaryUtil(i,i.length);var o=EXIF.readFromBinaryFile(n);var s=new Image;s.onload=function(t){var r=s.width,i=s.height;a._keepRatio(r,i);var n=o["Orientation"]||1;var h=n>=5&&n<=8?a._newsize(s.height,s.width,a.getWidth(),a.getHeight(),a.getCrop()):a._newsize(s.width,s.height,a.getWidth(),a.getHeight(),a.getCrop());var l=h.width,d=h.height;var g=document.createElement("canvas");var c=g.getContext("2d");c.save();a._transformCoordinate(g,l,d,n);if(a._detectSubsampling(s)){r/=2;i/=2}var p=1024;var u=document.createElement("canvas");u.width=u.height=p;var v=u.getContext("2d");var w=a._detectVerticalSquash(s,r,i);var f=0;while(f<i){var m=f+p>i?i-f:p;var b=0;while(b<r){var y=b+p>r?r-b:p;v.clearRect(0,0,p,p);v.drawImage(s,-b,-f);var B=Math.floor(b*l/r);var I=Math.ceil(y*l/r);var M=Math.floor(f*d/i/w);var C=Math.ceil(m*d/i/w);c.drawImage(u,0,0,y,m,B,M,I,C);b+=p}f+=p}c.restore();u=v=null;var _=document.createElement("canvas");_.width=h.cropped==="h"?d:l;_.height=h.cropped==="w"?l:d;var k=h.cropped==="h"?(d-l)*.5:0;var A=h.cropped==="w"?(l-d)*.5:0;var x=_.getContext("2d");x.drawImage(g,k,A,l,d);jQuery.sap.log.info(e,e.type);if(e.type==="image/png"){var z=_.toDataURL(e.type)}else{var z=_.toDataURL("image/jpeg",a.getQuality()*.01)}a.fireDone({data:z,width:_.width,height:_.height})};s.src=r}};t.readAsDataURL(e)}});
//# sourceMappingURL=CanvasHelper.js.map