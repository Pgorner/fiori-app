/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  (C) 2016 SAP SE or an SAP affiliate company. All rights reserved.
 */

var sap = sap || {};
sap.ve = sap.ve || {};
sap.ve.dvl = sap.ve.dvl || {};
sap.ve.dvl.createRuntime = function(options) {
	return new Promise(function(resolve, reject) {
		function createModule(options) {
			// Emscripten module definition begins here. It ends in module_end.js.

			var mergeOption = function(optionName, defaultOptionValue) {
				if (!options) {
					return defaultOptionValue;
				}
				return typeof options[optionName] === "undefined" ? defaultOptionValue : options[optionName];
			};

			// Merge any input options with defaults.
			var mergedOptions = {
				totalMemory:          mergeOption("totalMemory",          128 * 1024 * 1024), // 128 MB
				logElementId:         mergeOption("logElementId",         null),
				statusElementId:      mergeOption("statusElementId",      null),
				prefixURL:            mergeOption("filePackagePrefixURL", "")
			};

			//Create initial Module object with defaults
			var Module = {
				prefixURL: mergedOptions.prefixURL,
				print: function() {
					var args = Array.prototype.slice.call(arguments);
					var text = args.join(" ");
					if (mergedOptions.logElementId) {
						var element = document.getElementById(mergedOptions.logElementId);
						element.value += text + "\n";
						element.scrollTop = 99999;
					} else if (window.console) {
						console.log("print: " + text);
					}
				},
				printf: function() {
					var args = Array.prototype.slice.call(arguments);
					args.push("(printf)");
					Module.print(args);
				},
				printErr: function() {
					var args = Array.prototype.slice.call(arguments);
					args.push("(printErr)");
					Module.print(args);
				},
				// setStatus is called from Emscripten libraries.
				setStatus: function(text) {
					if (mergedOptions.statusElementId) {
						if (Module.setStatus.interval) {
							clearInterval(Module.setStatus.interval);
						}
						var statusElement = document.getElementById(mergedOptions.statusElementId);
						statusElement.innerHTML = text;
					} else if (Module.logElementId) {
						var args = Array.prototype.slice.call(arguments);
						args.push("(setStatus)");
						Module.print(args);
					}
				},
				locateFile: function(path, scriptDirectory) {
					return this.prefixURL + path;
				}
			};

			// NB: Emscripten generated code will be inserted after this line.

var Module=typeof Module!="undefined"?Module:{};var ENVIRONMENT_IS_WEB=typeof window=="object";var ENVIRONMENT_IS_WORKER=typeof importScripts=="function";var ENVIRONMENT_IS_NODE=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string";if(ENVIRONMENT_IS_NODE){}var moduleOverrides=Object.assign({},Module);var arguments_=[];var thisProgram="./this.program";var quit_=(status,toThrow)=>{throw toThrow};var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var read_,readAsync,readBinary;if(ENVIRONMENT_IS_NODE){var fs=require("fs");var nodePath=require("path");scriptDirectory=__dirname+"/";read_=(filename,binary)=>{filename=isFileURI(filename)?new URL(filename):nodePath.normalize(filename);return fs.readFileSync(filename,binary?undefined:"utf8")};readBinary=filename=>{var ret=read_(filename,true);if(!ret.buffer){ret=new Uint8Array(ret)}return ret};readAsync=(filename,onload,onerror,binary=true)=>{filename=isFileURI(filename)?new URL(filename):nodePath.normalize(filename);fs.readFile(filename,binary?undefined:"utf8",(err,data)=>{if(err)onerror(err);else onload(binary?data.buffer:data)})};if(!Module["thisProgram"]&&process.argv.length>1){thisProgram=process.argv[1].replace(/\\/g,"/")}arguments_=process.argv.slice(2);if(typeof module!="undefined"){module["exports"]=Module}process.on("uncaughtException",ex=>{if(ex!=="unwind"&&!(ex instanceof ExitStatus)&&!(ex.context instanceof ExitStatus)){throw ex}});quit_=(status,toThrow)=>{process.exitCode=status;throw toThrow}}else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WORKER){scriptDirectory=self.location.href}else if(typeof document!="undefined"&&document.currentScript){scriptDirectory=document.currentScript.src}if(scriptDirectory.startsWith("blob:")){scriptDirectory=""}else{scriptDirectory=scriptDirectory.substr(0,scriptDirectory.replace(/[?#].*/,"").lastIndexOf("/")+1)}{read_=url=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText};if(ENVIRONMENT_IS_WORKER){readBinary=url=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}}readAsync=(url,onload,onerror)=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=()=>{if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}onerror()};xhr.onerror=onerror;xhr.send(null)}}}else{}var out=Module["print"]||console.log.bind(console);var err=Module["printErr"]||console.error.bind(console);Object.assign(Module,moduleOverrides);moduleOverrides=null;if(Module["arguments"])arguments_=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"];if(Module["quit"])quit_=Module["quit"];var wasmBinary;if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];var wasmMemory;var ABORT=false;var EXITSTATUS;var HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateMemoryViews(){var b=wasmMemory.buffer;Module["HEAP8"]=HEAP8=new Int8Array(b);Module["HEAP16"]=HEAP16=new Int16Array(b);Module["HEAPU8"]=HEAPU8=new Uint8Array(b);Module["HEAPU16"]=HEAPU16=new Uint16Array(b);Module["HEAP32"]=HEAP32=new Int32Array(b);Module["HEAPU32"]=HEAPU32=new Uint32Array(b);Module["HEAPF32"]=HEAPF32=new Float32Array(b);Module["HEAPF64"]=HEAPF64=new Float64Array(b)}var __ATPRERUN__=[];var __ATINIT__=[];var __ATPOSTRUN__=[];var runtimeInitialized=false;function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function initRuntime(){runtimeInitialized=true;if(!Module["noFSInit"]&&!FS.init.initialized)FS.init();FS.ignorePermissions=false;TTY.init();callRuntimeCallbacks(__ATINIT__)}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}function addOnInit(cb){__ATINIT__.unshift(cb)}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;function getUniqueRunDependency(id){return id}function addRunDependency(id){runDependencies++;Module["monitorRunDependencies"]?.(runDependencies)}function removeRunDependency(id){runDependencies--;Module["monitorRunDependencies"]?.(runDependencies);if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}function abort(what){Module["onAbort"]?.(what);what="Aborted("+what+")";err(what);ABORT=true;EXITSTATUS=1;what+=". Build with -sASSERTIONS for more info.";var e=new WebAssembly.RuntimeError(what);throw e}var dataURIPrefix="data:application/octet-stream;base64,";var isDataURI=filename=>filename.startsWith(dataURIPrefix);var isFileURI=filename=>filename.startsWith("file://");function findWasmBinary(){var f="dvl.wasm";if(!isDataURI(f)){return locateFile(f)}return f}var wasmBinaryFile;function getBinarySync(file){if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}if(readBinary){return readBinary(file)}throw"both async and sync fetching of the wasm failed"}function getBinaryPromise(binaryFile){if(!wasmBinary&&(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)){if(typeof fetch=="function"&&!isFileURI(binaryFile)){return fetch(binaryFile,{credentials:"same-origin"}).then(response=>{if(!response["ok"]){throw`failed to load wasm binary file at '${binaryFile}'`}return response["arrayBuffer"]()}).catch(()=>getBinarySync(binaryFile))}else if(readAsync){return new Promise((resolve,reject)=>{readAsync(binaryFile,response=>resolve(new Uint8Array(response)),reject)})}}return Promise.resolve().then(()=>getBinarySync(binaryFile))}function instantiateArrayBuffer(binaryFile,imports,receiver){return getBinaryPromise(binaryFile).then(binary=>WebAssembly.instantiate(binary,imports)).then(receiver,reason=>{err(`failed to asynchronously prepare wasm: ${reason}`);abort(reason)})}function instantiateAsync(binary,binaryFile,imports,callback){if(!binary&&typeof WebAssembly.instantiateStreaming=="function"&&!isDataURI(binaryFile)&&!isFileURI(binaryFile)&&!ENVIRONMENT_IS_NODE&&typeof fetch=="function"){return fetch(binaryFile,{credentials:"same-origin"}).then(response=>{var result=WebAssembly.instantiateStreaming(response,imports);return result.then(callback,function(reason){err(`wasm streaming compile failed: ${reason}`);err("falling back to ArrayBuffer instantiation");return instantiateArrayBuffer(binaryFile,imports,callback)})})}return instantiateArrayBuffer(binaryFile,imports,callback)}function getWasmImports(){return{a:wasmImports}}function createWasm(){var info=getWasmImports();function receiveInstance(instance,module){wasmExports=instance.exports;wasmMemory=wasmExports["ob"];updateMemoryViews();addOnInit(wasmExports["pb"]);removeRunDependency("wasm-instantiate");return wasmExports}addRunDependency("wasm-instantiate");function receiveInstantiationResult(result){receiveInstance(result["instance"])}if(Module["instantiateWasm"]){try{return Module["instantiateWasm"](info,receiveInstance)}catch(e){err(`Module.instantiateWasm callback failed with error: ${e}`);return false}}if(!wasmBinaryFile)wasmBinaryFile=findWasmBinary();instantiateAsync(wasmBinary,wasmBinaryFile,info,receiveInstantiationResult);return{}}var tempDouble;var tempI64;var ASM_CONSTS={204552:$0=>{jDVLClient_Constructor(UTF8ToString($0));return 0},204608:$0=>{jDVLClient_Destructor(UTF8ToString($0));return 0},204663:($0,$1,$2,$3,$4)=>{jDVLClient_OnNodeSelectionChanged(UTF8ToString($0),UTF8ToString($1),$2,UTF8ToString($3),UTF8ToString($4));return 0},204788:($0,$1,$2,$3,$4)=>{jDVLClient_OnNodeVisibilityChanged(UTF8ToString($0),UTF8ToString($1),UTF8ToString($2),$3,UTF8ToString($4));return 0},204914:($0,$1,$2)=>{jDVLClient_OnStepEvent(UTF8ToString($0),$1,UTF8ToString($2));return 0},204992:($0,$1,$2)=>{jDVLClient_OnUrlClick(UTF8ToString($0),UTF8ToString($1),UTF8ToString($2));return 0},205083:($0,$1,$2,$3)=>{jDVLClient_LogMessage(UTF8ToString($0),$1,UTF8ToString($2),UTF8ToString($3));return 0},205178:($0,$1)=>jDVLClient_NotifyFileLoadProgress(UTF8ToString($0),$1),205246:($0,$1)=>{jDVLClient_NotifyFrameStarted(UTF8ToString($0),UTF8ToString($1));return 0},205327:($0,$1)=>{jDVLClient_NotifyFrameFinished(UTF8ToString($0),UTF8ToString($1));return 0},205409:$0=>jDVLClient_RequestCallback($0),205452:($0,$1)=>{jDVLClient_NotifySceneGeometryLoaded(UTF8ToString($0),UTF8ToString($1));return 0},205540:($0,$1,$2)=>{jDVLClient_NotifySceneGeometryFailed(UTF8ToString($0),UTF8ToString($1),$2);return 0},205632:$0=>{console.log("DVLRESULT",$0)},205664:$0=>{console.log("DVLRESULT",$0)},205698:$0=>{console.log("DVLRESULT",$0)},205730:$0=>{console.log("SetDynamicLabel",$0)},205768:($0,$1)=>{var canvas=window.jDVLDynamicLabelPOIIconCanvas;var id=canvas.getContext("2d").getImageData(0,0,canvas.width,canvas.height);var p=$0;var n=$1;for(var i=0;i<n;++i)setValue(p++,id.data[i],"i8");return DvlEnums.DVLRESULT.OK},206020:($0,$1,$2,$3)=>{var text=UTF8ToString($0);var sceneId=UTF8ToString($1);var mode3D=$2;var dpr=window.devicePixelRatio;var dpi=96*dpr;var poiIconImage=UTF8ToString($3);var poiIconSize="64,64";if(window.DOMParser){var parser=new DOMParser;xmlDoc=parser.parseFromString(text,"text/xml")}else{xmlDoc=new ActiveXObject("Microsoft.XMLDOM");xmlDoc.async=false;xmlDoc.loadXML(text)}if(!xmlDoc)return DvlEnums.DVLRESULT.NOINTERFACE;var errors=xmlDoc.getElementsByTagName("parsererror");if(errors.length>0){for(var ei=0;ei<errors.length;++ei)console.log(errors[ei].innerText);return DvlEnums.DVLRESULT.BADFORMAT}if(xmlDoc.childNodes.length==0||xmlDoc.childNodes[0].nodeName!="dynamic-labels")return DvlEnums.DVLRESULT.BADARG;if(!window.hasOwnProperty("DynamicLabels"))window.DynamicLabels=[];var DynamicLabels=window.DynamicLabels;var root=xmlDoc.childNodes[0];var poiColors=[];var labelCrop=root.getAttribute("label-crop");labelCrop=labelCrop?!(labelCrop.toLowerCase()=="false"||parseInt(labelCrop)==0):true;console.log("label-crop",labelCrop);for(var ni=0;ni<root.childNodes.length;++ni){var node=root.childNodes[ni];if(node.nodeName=="dynamic-label"){var o={};o.id=node.getAttribute("id");o.name=node.getAttribute("name");o.image=node.getAttribute("image");o.text=node.getAttribute("text");o.font=node.getAttribute("font");o.fontSize=node.getAttribute("font-size");o.textColor=node.getAttribute("text-color");o.bgColor=node.getAttribute("bg-color");o.frameColor=node.getAttribute("frame-color");o.opacity=node.getAttribute("opacity");o.size=node.getAttribute("size");o.pos=node.getAttribute("position");o.pivotPoint=node.getAttribute("pivot-point");o.margin=node.getAttribute("margin");o.alignment=node.getAttribute("alignment");o.poiColorIndex=node.getAttribute("poi-color");o.size=(o.size?o.size:"_").split(",").map(Number);if(isNaN(o.size[0])||isNaN(o.size[1])){if(mode3D){o.size[0]=4;o.size[1]=3}else{o.size[0]=1;o.size[1]=1}}if(o.size[0]<=0||o.size[1]<=0)continue;o.pos=(o.pos?o.pos:"0,0").split(",").map(Number);if(isNaN(o.pos[0])||isNaN(o.pos[1])){o.pos[0]=0;o.pos[1]=0}o.pivotPoint=(o.pivotPoint?o.pivotPoint:"0.5,0.5").split(",").map(Number);if(isNaN(o.pivotPoint[0])||isNaN(o.pivotPoint[1])){o.pivotPoint[0]=.5;o.pivotPoint[1]=.5}o.margin=(o.margin?o.margin:"0,0").split(",").map(Number);if(isNaN(o.margin[0])||isNaN(o.margin[1])){o.margin[0]=0;o.margin[1]=0}o.alignment=(o.alignment?o.alignment:"0,0").split(",").map(function(value){return parseInt(value,10)});if(isNaN(o.alignment[0])||isNaN(o.alignment[1])){o.alignment[0]=0;o.alignment[1]=0}o.fontSize=o.fontSize?parseFloat(o.fontSize):12;if(isNaN(o.fontSize)||o.fontSize<4)o.fontSize=4;if(o.textColor)o.textColor="#"+o.textColor;if(o.bgColor)o.bgColor="#"+o.bgColor;if(o.frameColor)o.frameColor="#"+o.frameColor;if(o.opacity)o.opacity=parseFloat(o.opacity);o.poiColorIndex=o.poiColorIndex?parseInt(o.poiColorIndex):0;o.poiColor=o.poiColorIndex<poiColors.length?poiColors[o.poiColorIndex]:4294967295;o.fontSize*=dpr;o.margin[0]=Math.ceil(o.margin[0]*dpr);o.margin[1]=Math.ceil(o.margin[1]*dpr);if(mode3D){o.size[0]=Math.ceil(o.size[0]*dpi/2.54);o.size[1]=Math.ceil(o.size[1]*dpi/2.54);if(labelCrop&&!o.image&&o.text&&o.fontSize>0){var borderThickness=Math.ceil(2*dpr);var maxWidth=o.size[0]-(o.margin[0]+borderThickness)*2;var maxHeight=o.size[1]-(o.margin[1]+borderThickness)*2;if(maxWidth>0||maxHeight>0){var rowHeight=Math.ceil(o.fontSize*96/72);var rows=o.text.split("\n");var numRows=Math.min(rows.length,maxHeight/rowHeight|0);if(numRows>0){var canvas=document.createElement("canvas");canvas.id="jDVLDynamicLabelCanvas";canvas.style.visibility="hidden";canvas.style.display="none";canvas.width=maxWidth;canvas.height=maxHeight;var ctx=canvas.getContext("2d");ctx.font=o.fontSize+"pt "+(o.font?o.font:"Arial");o.size[0]=0;o.size[1]=Math.ceil(numRows*rowHeight+(o.margin[1]+borderThickness)*2);for(var i=0;i<numRows;i++){var rowText=rows[i];while(ctx.measureText(rowText).width>maxWidth&&rowText.length>0)rowText=rowText.substr(0,rowText.length-1);if(rowText.length<rows[i].length)rowText=rowText.substr(0,rowText.length-3)+"...";o.size[0]=Math.max(o.size[0],ctx.measureText(rowText).width)}o.size[0]=Math.ceil(o.size[0]+(o.margin[0]+borderThickness)*2);null}}}}var index=-1;if(o.text!==null&&o.text!==undefined||o.opacity>0){index=DynamicLabels.length;for(var ti=0;ti<DynamicLabels.length;++ti){if(typeof DynamicLabels[ti]=="undefined"){index=ti;break}}}index=Module.ccall("jDVLScene_SetDynamicLabel","number",["string","string","string","number","number","number","number","number","number","number","number","number"],[sceneId,o.id,o.name,index,o.size[0],o.size[1],o.pos[0],o.pos[1],o.pivotPoint[0],o.pivotPoint[1],o.poiColorIndex,o.poiColor]);if(index>=0)DynamicLabels[index]=o;if(o.image&&index>=0){var image=document.createElement("img");image.sceneId=sceneId;image.index=index;image.dynamicLabel=o;image.id="img_"+Math.random().toString(36).substr(2,9);image.style.visibility="hidden";image.style.display="none";image.onerror=function(){console.log("jDVL: Error loading image for texture.");DynamicLabels[this.index].image=null;Module.ccall("jDVLScene_UpdateDynamicLabel","number",["string","number"],[this.sceneId,this.index])};image.onload=function(){console.log("UpdateDynamicLabel",this.index,this.width+"x"+this.height);Module.ccall("jDVLScene_UpdateDynamicLabel","number",["string","number"],[this.sceneId,this.index])};image.src="data:image/png;base64,"+o.image;o.image=image}}else if(node.nodeName=="poi-color"){if(node.textContent){var c=parseInt(node.textContent,16);if(!isNaN(c))poiColors.push(c|4278190080)}}else if(node.nodeName=="poi-icon"){poiIconImage=node.getAttribute("image");poiIconSize=node.getAttribute("size")}}if(poiIconImage){var image=document.createElement("img");image.sceneId=sceneId;image.iconSize=poiIconSize;image.id="img_"+Math.random().toString(36).substr(2,9);image.style.visibility="hidden";image.style.display="none";image.onerror=function(){console.log("jDVL: Error loading image for POI icon.");Module.ccall("jDVLScene_SetPOIIcon","number",["string","number","number","number","number"],[this.sceneId,0,0,0,0])};image.onload=function(){console.log("POI icon image size",this.width+"x"+this.height);var size=(this.iconSize?this.iconSize:"_").split(",").map(Number);if(isNaN(size[0])||isNaN(size[1])){size[0]=this.width;size[1]=this.height}console.log("POI icon size",size[0]+"x"+size[1]);size[0]*=dpr;size[1]*=dpr;var canvas=window.jDVLDynamicLabelPOIIconCanvas=document.createElement("canvas");canvas.id="jDVLDynamicLabelPOIIconCanvas";canvas.style.visibility="hidden";canvas.style.display="none";canvas.width=Math.pow(2,Math.round(Math.log(size[0])/Math.LN2));canvas.height=Math.pow(2,Math.round(Math.log(size[1])/Math.LN2));console.log("POI icon texture size",canvas.width+"x"+canvas.height);document.body.appendChild(canvas);canvas.getContext("2d").drawImage(this,0,0,this.width,this.height,0,0,canvas.width,canvas.height);Module.ccall("jDVLScene_SetPOIIcon","number",["string","number","number","number","number"],[this.sceneId,size[0],size[1],canvas.width,canvas.height]);document.body.removeChild(canvas);delete window.jDVLDynamicLabelPOIIconCanvas};image.src="data:image/png;base64,"+poiIconImage;window.POIIconImage=image}console.log(DynamicLabels);return DvlEnums.DVLRESULT.OK},214231:($0,$1,$2)=>{var js1=encodeURIComponent(escape(UTF8ToString($0)));var js2=encodeURIComponent(escape(UTF8ToString($1)));if($2){js1=js1.toLocaleUpperCase();js2=js2.toLocaleUpperCase()}return js1.localeCompare(js2)},214451:($0,$1,$2)=>{var js1=encodeURIComponent(escape(UTF8ToString($0)));var js2=encodeURIComponent(escape(UTF8ToString($1)));if($2){js1=js1.toLocaleUpperCase();js2=js2.toLocaleUpperCase()}return js1.indexOf(js2)>=0},214670:($0,$1,$2)=>{var js1=encodeURIComponent(escape(UTF8ToString($0)));var js2=encodeURIComponent(escape(UTF8ToString($1)));if($2){js1=js1.toLocaleUpperCase();js2=js2.toLocaleUpperCase()}return js1.indexOf(js2)==0},214889:($0,$1,$2)=>{var jspattern=new RegExp(encodeURIComponent(escape(UTF8ToString($0))));var jstext=encodeURIComponent(escape(UTF8ToString($1)));return $2?jspattern.exec(jstext)==jstext:jspattern.test(jstext)},215098:($0,$1,$2,$3)=>{var p=$0;var w=$1;var h=$2;var n=w*h*4;var canvasId=UTF8ToString($3);var canvas=document.getElementById(canvasId);var id=canvas.getContext("2d").getImageData(0,0,w,h);for(var i=0;i<n;++i)setValue(p++,id.data[i],"i8");return DvlEnums.DVLRESULT.OK},215388:($0,$1,$2,$3)=>{var image=document.createElement("img");image.bitmap=UTF8ToString($0);image.maxSize=$3;image.id="img_"+Math.random().toString(36).substr(2,9);image.style.visibility="hidden";image.style.display="none";image.onerror=function(){console.log("jDVL: Error loading image for texture."+" ("+(new Date).getTime()+")")};image.onload=function(){var width=Math.pow(2,Math.round(Math.log(this.width)/Math.LN2));var height=Math.pow(2,Math.round(Math.log(this.height)/Math.LN2));width=Math.min(width,this.maxSize);height=Math.min(height,this.maxSize);console.log("image.onload: bitmap='"+image.bitmap+"' "+this.width+"x"+this.height+" -> "+width+"x"+height);var canvas=document.createElement("canvas");canvas.id="jDVLBitmapCanvas-"+Math.random().toString(36).substr(2,9);canvas.style.visibility="hidden";canvas.style.display="none";canvas.width=width;canvas.height=height;document.body.appendChild(canvas);var ctx=canvas.getContext("2d");ctx.imageSmoothingQuality="high";ctx.drawImage(this,0,0,this.width,this.height,0,0,canvas.width,canvas.height);Module.ccall("jDVLBitmap_CreateTexture","null",["string","string","number","number"],[this.bitmap,canvas.id,canvas.width,canvas.height]);document.body.removeChild(canvas);null};image.src="data:image/"+UTF8ToString($2)+";base64,"+UTF8ToString($1);return DvlEnums.DVLRESULT.OK},216848:$0=>{delete window.DynamicLabels[$0]},216885:($0,$1,$2,$3,$4,$5,$6)=>{console.log("DynamicLabel::Draw:",$0,$3+"x"+$4);var canvas=window.jDVLDynamicLabelCanvas;var ctx=canvas.getContext("2d");var dl=window.DynamicLabels[$0];var image=dl.image;var dpr=window.devicePixelRatio;var cr=$5*dpr;var ft=Math.ceil($6*dpr);if(image){ctx.globalAlpha=dl.opacity?dl.opacity:1;if(image.width>0&&image.height>0&&ctx.globalAlpha>0){cr=0;var iw=$3;var ih=$4;if(iw*image.height>ih*image.width)iw=ih*image.width/image.height;else ih=iw*image.height/image.width;ctx.drawImage(image,0,0,image.width,image.height,$1+($3-iw)*.5,$2+($4-ih)*.5,iw,ih)}}else if(dl.bgColor||dl.opacity){ctx.globalAlpha=dl.opacity?dl.opacity:.5;if(ctx.globalAlpha>0){ctx.fillStyle=dl.bgColor?dl.bgColor:"#000000";if(cr>0){var x=$1;var y=$2;var w=$3;var h=$4;ctx.beginPath();ctx.moveTo(x+cr,y);ctx.lineTo(x+w-cr,y);ctx.quadraticCurveTo(x+w,y,x+w,y+cr);ctx.lineTo(x+w,y+h-cr);ctx.quadraticCurveTo(x+w,y+h,x+w-cr,y+h);ctx.lineTo(x+cr,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-cr);ctx.lineTo(x,y+cr);ctx.quadraticCurveTo(x,y,x+cr,y);ctx.closePath();ctx.fill()}else ctx.fillRect($1,$2,$3,$4)}}ctx.globalAlpha=1;if(dl.frameColor){ctx.strokeStyle=dl.frameColor;for(var i=0;i<ft;i++){var x=$1+.5+i;var y=$2+.5+i;var w=$3-1-i*2;var h=$4-1-i*2;if(cr>0){var r=cr-i;ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();ctx.stroke()}else ctx.strokeRect(x,y,w,h)}}if(dl.text&&dl.fontSize>0){var maxWidth=$3-(dl.margin[0]+ft)*2;var maxHeight=$4-(dl.margin[1]+ft)*2;if(maxWidth<=0||maxHeight<=0)return DvlEnums.DVLRESULT.OK;var rowHeight=Math.ceil(dl.fontSize*96/72);var rows=dl.text.split("\n");var numRows=Math.min(rows.length,maxHeight/rowHeight|0);if(numRows<=0)return DvlEnums.DVLRESULT.OK;ctx.font=dl.fontSize+"pt "+(dl.font?dl.font:"Arial");ctx.fillStyle=dl.textColor?dl.textColor:"#FFFFFF";var posX=$1+dl.margin[0]+ft;var posY=$2+dl.margin[1]+ft;switch(dl.alignment[0]){default:case 0:ctx.textAlign="left";break;case 1:ctx.textAlign="center";posX+=maxWidth/2;break;case 2:ctx.textAlign="right";posX+=maxWidth;break}switch(dl.alignment[1]){default:case 0:ctx.textBaseline="top";break;case 1:ctx.textBaseline="middle";posY+=(maxHeight-(numRows-1)*rowHeight)*.5;break;case 2:ctx.textBaseline="bottom";posY+=maxHeight-(numRows-1)*rowHeight;break}for(var i=0;i<numRows;i++){var rowText=rows[i];while(ctx.measureText(rowText).width>maxWidth&&rowText.length>0)rowText=rowText.substr(0,rowText.length-1);if(rowText.length<rows[i].length)rowText=rowText.substr(0,rowText.length-3)+"...";ctx.fillText(rowText,posX,posY);posY+=rowHeight}}return DvlEnums.DVLRESULT.OK},220237:($0,$1)=>{var canvas=window.jDVLDynamicLabelCanvas=document.createElement("canvas");canvas.id="jDVLDynamicLabelCanvas";canvas.style.visibility="hidden";canvas.style.display="none";canvas.width=$0;canvas.height=$1;document.body.appendChild(canvas);return DvlEnums.DVLRESULT.OK},220529:($0,$1)=>{var canvas=window.jDVLDynamicLabelCanvas;var id=canvas.getContext("2d").getImageData(0,0,canvas.width,canvas.height);var p=$0;var n=$1;for(var i=0;i<n;++i)setValue(p++,id.data[i],"i8");document.body.removeChild(canvas);delete window.jDVLDynamicLabelCanvas;return DvlEnums.DVLRESULT.OK}};var _emscripten_set_main_loop_timing=(mode,value)=>{Browser.mainLoop.timingMode=mode;Browser.mainLoop.timingValue=value;if(!Browser.mainLoop.func){return 1}if(!Browser.mainLoop.running){Browser.mainLoop.running=true}if(mode==0){Browser.mainLoop.scheduler=function Browser_mainLoop_scheduler_setTimeout(){var timeUntilNextTick=Math.max(0,Browser.mainLoop.tickStartTime+value-_emscripten_get_now())|0;setTimeout(Browser.mainLoop.runner,timeUntilNextTick)};Browser.mainLoop.method="timeout"}else if(mode==1){Browser.mainLoop.scheduler=function Browser_mainLoop_scheduler_rAF(){Browser.requestAnimationFrame(Browser.mainLoop.runner)};Browser.mainLoop.method="rAF"}else if(mode==2){if(typeof Browser.setImmediate=="undefined"){if(typeof setImmediate=="undefined"){var setImmediates=[];var emscriptenMainLoopMessageId="setimmediate";var Browser_setImmediate_messageHandler=event=>{if(event.data===emscriptenMainLoopMessageId||event.data.target===emscriptenMainLoopMessageId){event.stopPropagation();setImmediates.shift()()}};addEventListener("message",Browser_setImmediate_messageHandler,true);Browser.setImmediate=function Browser_emulated_setImmediate(func){setImmediates.push(func);if(ENVIRONMENT_IS_WORKER){if(Module["setImmediates"]===undefined)Module["setImmediates"]=[];Module["setImmediates"].push(func);postMessage({target:emscriptenMainLoopMessageId})}else postMessage(emscriptenMainLoopMessageId,"*")}}else{Browser.setImmediate=setImmediate}}Browser.mainLoop.scheduler=function Browser_mainLoop_scheduler_setImmediate(){Browser.setImmediate(Browser.mainLoop.runner)};Browser.mainLoop.method="immediate"}return 0};var _emscripten_get_now;_emscripten_get_now=()=>performance.now();var setMainLoop=(browserIterationFunc,fps,simulateInfiniteLoop,arg,noSetTiming)=>{Browser.mainLoop.func=browserIterationFunc;Browser.mainLoop.arg=arg;var thisMainLoopId=Browser.mainLoop.currentlyRunningMainloop;function checkIsRunning(){if(thisMainLoopId<Browser.mainLoop.currentlyRunningMainloop){return false}return true}Browser.mainLoop.running=false;Browser.mainLoop.runner=function Browser_mainLoop_runner(){if(ABORT)return;if(Browser.mainLoop.queue.length>0){var start=Date.now();var blocker=Browser.mainLoop.queue.shift();blocker.func(blocker.arg);if(Browser.mainLoop.remainingBlockers){var remaining=Browser.mainLoop.remainingBlockers;var next=remaining%1==0?remaining-1:Math.floor(remaining);if(blocker.counted){Browser.mainLoop.remainingBlockers=next}else{next=next+.5;Browser.mainLoop.remainingBlockers=(8*remaining+next)/9}}Browser.mainLoop.updateStatus();if(!checkIsRunning())return;setTimeout(Browser.mainLoop.runner,0);return}if(!checkIsRunning())return;Browser.mainLoop.currentFrameNumber=Browser.mainLoop.currentFrameNumber+1|0;if(Browser.mainLoop.timingMode==1&&Browser.mainLoop.timingValue>1&&Browser.mainLoop.currentFrameNumber%Browser.mainLoop.timingValue!=0){Browser.mainLoop.scheduler();return}else if(Browser.mainLoop.timingMode==0){Browser.mainLoop.tickStartTime=_emscripten_get_now()}Browser.mainLoop.runIter(browserIterationFunc);if(!checkIsRunning())return;if(typeof SDL=="object")SDL.audio?.queueNewAudioData?.();Browser.mainLoop.scheduler()};if(!noSetTiming){if(fps&&fps>0){_emscripten_set_main_loop_timing(0,1e3/fps)}else{_emscripten_set_main_loop_timing(1,1)}Browser.mainLoop.scheduler()}if(simulateInfiniteLoop){throw"unwind"}};var handleException=e=>{if(e instanceof ExitStatus||e=="unwind"){return EXITSTATUS}quit_(1,e)};function ExitStatus(status){this.name="ExitStatus";this.message=`Program terminated with exit(${status})`;this.status=status}var runtimeKeepaliveCounter=0;var keepRuntimeAlive=()=>noExitRuntime||runtimeKeepaliveCounter>0;var _proc_exit=code=>{EXITSTATUS=code;if(!keepRuntimeAlive()){Module["onExit"]?.(code);ABORT=true}quit_(code,new ExitStatus(code))};var exitJS=(status,implicit)=>{EXITSTATUS=status;_proc_exit(status)};var _exit=exitJS;var maybeExit=()=>{if(!keepRuntimeAlive()){try{_exit(EXITSTATUS)}catch(e){handleException(e)}}};var callUserCallback=func=>{if(ABORT){return}try{func();maybeExit()}catch(e){handleException(e)}};var safeSetTimeout=(func,timeout)=>setTimeout(()=>{callUserCallback(func)},timeout);var warnOnce=text=>{warnOnce.shown||={};if(!warnOnce.shown[text]){warnOnce.shown[text]=1;if(ENVIRONMENT_IS_NODE)text="warning: "+text;err(text)}};var preloadPlugins=Module["preloadPlugins"]||[];var Browser={mainLoop:{running:false,scheduler:null,method:"",currentlyRunningMainloop:0,func:null,arg:0,timingMode:0,timingValue:0,currentFrameNumber:0,queue:[],pause(){Browser.mainLoop.scheduler=null;Browser.mainLoop.currentlyRunningMainloop++},resume(){Browser.mainLoop.currentlyRunningMainloop++;var timingMode=Browser.mainLoop.timingMode;var timingValue=Browser.mainLoop.timingValue;var func=Browser.mainLoop.func;Browser.mainLoop.func=null;setMainLoop(func,0,false,Browser.mainLoop.arg,true);_emscripten_set_main_loop_timing(timingMode,timingValue);Browser.mainLoop.scheduler()},updateStatus(){if(Module["setStatus"]){var message=Module["statusMessage"]||"Please wait...";var remaining=Browser.mainLoop.remainingBlockers;var expected=Browser.mainLoop.expectedBlockers;if(remaining){if(remaining<expected){Module["setStatus"](`{message} ({expected - remaining}/{expected})`)}else{Module["setStatus"](message)}}else{Module["setStatus"]("")}}},runIter(func){if(ABORT)return;if(Module["preMainLoop"]){var preRet=Module["preMainLoop"]();if(preRet===false){return}}callUserCallback(func);Module["postMainLoop"]?.()}},isFullscreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init(){if(Browser.initted)return;Browser.initted=true;var imagePlugin={};imagePlugin["canHandle"]=function imagePlugin_canHandle(name){return!Module.noImageDecoding&&/\.(jpg|jpeg|png|bmp)$/i.test(name)};imagePlugin["handle"]=function imagePlugin_handle(byteArray,name,onload,onerror){var b=new Blob([byteArray],{type:Browser.getMimetype(name)});if(b.size!==byteArray.length){b=new Blob([new Uint8Array(byteArray).buffer],{type:Browser.getMimetype(name)})}var url=URL.createObjectURL(b);var img=new Image;img.onload=()=>{var canvas=document.createElement("canvas");canvas.width=img.width;canvas.height=img.height;var ctx=canvas.getContext("2d");ctx.drawImage(img,0,0);preloadedImages[name]=canvas;URL.revokeObjectURL(url);onload?.(byteArray)};img.onerror=event=>{err(`Image ${url} could not be decoded`);onerror?.()};img.src=url};preloadPlugins.push(imagePlugin);var audioPlugin={};audioPlugin["canHandle"]=function audioPlugin_canHandle(name){return!Module.noAudioDecoding&&name.substr(-4)in{".ogg":1,".wav":1,".mp3":1}};audioPlugin["handle"]=function audioPlugin_handle(byteArray,name,onload,onerror){var done=false;function finish(audio){if(done)return;done=true;preloadedAudios[name]=audio;onload?.(byteArray)}var b=new Blob([byteArray],{type:Browser.getMimetype(name)});var url=URL.createObjectURL(b);var audio=new Audio;audio.addEventListener("canplaythrough",()=>finish(audio),false);audio.onerror=function audio_onerror(event){if(done)return;err(`warning: browser could not fully decode audio ${name}, trying slower base64 approach`);function encode64(data){var BASE="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var PAD="=";var ret="";var leftchar=0;var leftbits=0;for(var i=0;i<data.length;i++){leftchar=leftchar<<8|data[i];leftbits+=8;while(leftbits>=6){var curr=leftchar>>leftbits-6&63;leftbits-=6;ret+=BASE[curr]}}if(leftbits==2){ret+=BASE[(leftchar&3)<<4];ret+=PAD+PAD}else if(leftbits==4){ret+=BASE[(leftchar&15)<<2];ret+=PAD}return ret}audio.src="data:audio/x-"+name.substr(-3)+";base64,"+encode64(byteArray);finish(audio)};audio.src=url;safeSetTimeout(()=>{finish(audio)},1e4)};preloadPlugins.push(audioPlugin);function pointerLockChange(){Browser.pointerLock=document["pointerLockElement"]===Module["canvas"]||document["mozPointerLockElement"]===Module["canvas"]||document["webkitPointerLockElement"]===Module["canvas"]||document["msPointerLockElement"]===Module["canvas"]}var canvas=Module["canvas"];if(canvas){canvas.requestPointerLock=canvas["requestPointerLock"]||canvas["mozRequestPointerLock"]||canvas["webkitRequestPointerLock"]||canvas["msRequestPointerLock"]||(()=>{});canvas.exitPointerLock=document["exitPointerLock"]||document["mozExitPointerLock"]||document["webkitExitPointerLock"]||document["msExitPointerLock"]||(()=>{});canvas.exitPointerLock=canvas.exitPointerLock.bind(document);document.addEventListener("pointerlockchange",pointerLockChange,false);document.addEventListener("mozpointerlockchange",pointerLockChange,false);document.addEventListener("webkitpointerlockchange",pointerLockChange,false);document.addEventListener("mspointerlockchange",pointerLockChange,false);if(Module["elementPointerLock"]){canvas.addEventListener("click",ev=>{if(!Browser.pointerLock&&Module["canvas"].requestPointerLock){Module["canvas"].requestPointerLock();ev.preventDefault()}},false)}}},createContext(canvas,useWebGL,setInModule,webGLContextAttributes){if(useWebGL&&Module.ctx&&canvas==Module.canvas)return Module.ctx;var ctx;var contextHandle;if(useWebGL){var contextAttributes={antialias:false,alpha:false,majorVersion:2};if(webGLContextAttributes){for(var attribute in webGLContextAttributes){contextAttributes[attribute]=webGLContextAttributes[attribute]}}if(typeof GL!="undefined"){contextHandle=GL.createContext(canvas,contextAttributes);if(contextHandle){ctx=GL.getContext(contextHandle).GLctx}}}else{ctx=canvas.getContext("2d")}if(!ctx)return null;if(setInModule){Module.ctx=ctx;if(useWebGL)GL.makeContextCurrent(contextHandle);Module.useWebGL=useWebGL;Browser.moduleContextCreatedCallbacks.forEach(callback=>callback());Browser.init()}return ctx},destroyContext(canvas,useWebGL,setInModule){},fullscreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullscreen(lockPointer,resizeCanvas){Browser.lockPointer=lockPointer;Browser.resizeCanvas=resizeCanvas;if(typeof Browser.lockPointer=="undefined")Browser.lockPointer=true;if(typeof Browser.resizeCanvas=="undefined")Browser.resizeCanvas=false;var canvas=Module["canvas"];function fullscreenChange(){Browser.isFullscreen=false;var canvasContainer=canvas.parentNode;if((document["fullscreenElement"]||document["mozFullScreenElement"]||document["msFullscreenElement"]||document["webkitFullscreenElement"]||document["webkitCurrentFullScreenElement"])===canvasContainer){canvas.exitFullscreen=Browser.exitFullscreen;if(Browser.lockPointer)canvas.requestPointerLock();Browser.isFullscreen=true;if(Browser.resizeCanvas){Browser.setFullscreenCanvasSize()}else{Browser.updateCanvasDimensions(canvas)}}else{canvasContainer.parentNode.insertBefore(canvas,canvasContainer);canvasContainer.parentNode.removeChild(canvasContainer);if(Browser.resizeCanvas){Browser.setWindowedCanvasSize()}else{Browser.updateCanvasDimensions(canvas)}}Module["onFullScreen"]?.(Browser.isFullscreen);Module["onFullscreen"]?.(Browser.isFullscreen)}if(!Browser.fullscreenHandlersInstalled){Browser.fullscreenHandlersInstalled=true;document.addEventListener("fullscreenchange",fullscreenChange,false);document.addEventListener("mozfullscreenchange",fullscreenChange,false);document.addEventListener("webkitfullscreenchange",fullscreenChange,false);document.addEventListener("MSFullscreenChange",fullscreenChange,false)}var canvasContainer=document.createElement("div");canvas.parentNode.insertBefore(canvasContainer,canvas);canvasContainer.appendChild(canvas);canvasContainer.requestFullscreen=canvasContainer["requestFullscreen"]||canvasContainer["mozRequestFullScreen"]||canvasContainer["msRequestFullscreen"]||(canvasContainer["webkitRequestFullscreen"]?()=>canvasContainer["webkitRequestFullscreen"](Element["ALLOW_KEYBOARD_INPUT"]):null)||(canvasContainer["webkitRequestFullScreen"]?()=>canvasContainer["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"]):null);canvasContainer.requestFullscreen()},exitFullscreen(){if(!Browser.isFullscreen){return false}var CFS=document["exitFullscreen"]||document["cancelFullScreen"]||document["mozCancelFullScreen"]||document["msExitFullscreen"]||document["webkitCancelFullScreen"]||(()=>{});CFS.apply(document,[]);return true},nextRAF:0,fakeRequestAnimationFrame(func){var now=Date.now();if(Browser.nextRAF===0){Browser.nextRAF=now+1e3/60}else{while(now+2>=Browser.nextRAF){Browser.nextRAF+=1e3/60}}var delay=Math.max(Browser.nextRAF-now,0);setTimeout(func,delay)},requestAnimationFrame(func){if(typeof requestAnimationFrame=="function"){requestAnimationFrame(func);return}var RAF=Browser.fakeRequestAnimationFrame;RAF(func)},safeSetTimeout(func,timeout){return safeSetTimeout(func,timeout)},safeRequestAnimationFrame(func){return Browser.requestAnimationFrame(()=>{callUserCallback(func)})},getMimetype(name){return{jpg:"image/jpeg",jpeg:"image/jpeg",png:"image/png",bmp:"image/bmp",ogg:"audio/ogg",wav:"audio/wav",mp3:"audio/mpeg"}[name.substr(name.lastIndexOf(".")+1)]},getUserMedia(func){window.getUserMedia||=navigator["getUserMedia"]||navigator["mozGetUserMedia"];window.getUserMedia(func)},getMovementX(event){return event["movementX"]||event["mozMovementX"]||event["webkitMovementX"]||0},getMovementY(event){return event["movementY"]||event["mozMovementY"]||event["webkitMovementY"]||0},getMouseWheelDelta(event){var delta=0;switch(event.type){case"DOMMouseScroll":delta=event.detail/3;break;case"mousewheel":delta=event.wheelDelta/120;break;case"wheel":delta=event.deltaY;switch(event.deltaMode){case 0:delta/=100;break;case 1:delta/=3;break;case 2:delta*=80;break;default:throw"unrecognized mouse wheel delta mode: "+event.deltaMode}break;default:throw"unrecognized mouse wheel event: "+event.type}return delta},mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,touches:{},lastTouches:{},calculateMouseCoords(pageX,pageY){var rect=Module["canvas"].getBoundingClientRect();var cw=Module["canvas"].width;var ch=Module["canvas"].height;var scrollX=typeof window.scrollX!="undefined"?window.scrollX:window.pageXOffset;var scrollY=typeof window.scrollY!="undefined"?window.scrollY:window.pageYOffset;var adjustedX=pageX-(scrollX+rect.left);var adjustedY=pageY-(scrollY+rect.top);adjustedX=adjustedX*(cw/rect.width);adjustedY=adjustedY*(ch/rect.height);return{x:adjustedX,y:adjustedY}},setMouseCoords(pageX,pageY){const{x:x,y:y}=Browser.calculateMouseCoords(pageX,pageY);Browser.mouseMovementX=x-Browser.mouseX;Browser.mouseMovementY=y-Browser.mouseY;Browser.mouseX=x;Browser.mouseY=y},calculateMouseEvent(event){if(Browser.pointerLock){if(event.type!="mousemove"&&"mozMovementX"in event){Browser.mouseMovementX=Browser.mouseMovementY=0}else{Browser.mouseMovementX=Browser.getMovementX(event);Browser.mouseMovementY=Browser.getMovementY(event)}Browser.mouseX+=Browser.mouseMovementX;Browser.mouseY+=Browser.mouseMovementY}else{if(event.type==="touchstart"||event.type==="touchend"||event.type==="touchmove"){var touch=event.touch;if(touch===undefined){return}var coords=Browser.calculateMouseCoords(touch.pageX,touch.pageY);if(event.type==="touchstart"){Browser.lastTouches[touch.identifier]=coords;Browser.touches[touch.identifier]=coords}else if(event.type==="touchend"||event.type==="touchmove"){var last=Browser.touches[touch.identifier];last||=coords;Browser.lastTouches[touch.identifier]=last;Browser.touches[touch.identifier]=coords}return}Browser.setMouseCoords(event.pageX,event.pageY)}},resizeListeners:[],updateResizeListeners(){var canvas=Module["canvas"];Browser.resizeListeners.forEach(listener=>listener(canvas.width,canvas.height))},setCanvasSize(width,height,noUpdates){var canvas=Module["canvas"];Browser.updateCanvasDimensions(canvas,width,height);if(!noUpdates)Browser.updateResizeListeners()},windowedWidth:0,windowedHeight:0,setFullscreenCanvasSize(){if(typeof SDL!="undefined"){var flags=HEAPU32[SDL.screen>>2];flags=flags|8388608;HEAP32[SDL.screen>>2]=flags}Browser.updateCanvasDimensions(Module["canvas"]);Browser.updateResizeListeners()},setWindowedCanvasSize(){if(typeof SDL!="undefined"){var flags=HEAPU32[SDL.screen>>2];flags=flags&~8388608;HEAP32[SDL.screen>>2]=flags}Browser.updateCanvasDimensions(Module["canvas"]);Browser.updateResizeListeners()},updateCanvasDimensions(canvas,wNative,hNative){if(wNative&&hNative){canvas.widthNative=wNative;canvas.heightNative=hNative}else{wNative=canvas.widthNative;hNative=canvas.heightNative}var w=wNative;var h=hNative;if(Module["forcedAspectRatio"]&&Module["forcedAspectRatio"]>0){if(w/h<Module["forcedAspectRatio"]){w=Math.round(h*Module["forcedAspectRatio"])}else{h=Math.round(w/Module["forcedAspectRatio"])}}if((document["fullscreenElement"]||document["mozFullScreenElement"]||document["msFullscreenElement"]||document["webkitFullscreenElement"]||document["webkitCurrentFullScreenElement"])===canvas.parentNode&&typeof screen!="undefined"){var factor=Math.min(screen.width/w,screen.height/h);w=Math.round(w*factor);h=Math.round(h*factor)}if(Browser.resizeCanvas){if(canvas.width!=w)canvas.width=w;if(canvas.height!=h)canvas.height=h;if(typeof canvas.style!="undefined"){canvas.style.removeProperty("width");canvas.style.removeProperty("height")}}else{if(canvas.width!=wNative)canvas.width=wNative;if(canvas.height!=hNative)canvas.height=hNative;if(typeof canvas.style!="undefined"){if(w!=wNative||h!=hNative){canvas.style.setProperty("width",w+"px","important");canvas.style.setProperty("height",h+"px","important")}else{canvas.style.removeProperty("width");canvas.style.removeProperty("height")}}}}};var callRuntimeCallbacks=callbacks=>{while(callbacks.length>0){callbacks.shift()(Module)}};function getValue(ptr,type="i8"){if(type.endsWith("*"))type="*";switch(type){case"i1":return HEAP8[ptr];case"i8":return HEAP8[ptr];case"i16":return HEAP16[ptr>>1];case"i32":return HEAP32[ptr>>2];case"i64":abort("to do getValue(i64) use WASM_BIGINT");case"float":return HEAPF32[ptr>>2];case"double":return HEAPF64[ptr>>3];case"*":return HEAPU32[ptr>>2];default:abort(`invalid type for getValue: ${type}`)}}var noExitRuntime=Module["noExitRuntime"]||true;function setValue(ptr,value,type="i8"){if(type.endsWith("*"))type="*";switch(type){case"i1":HEAP8[ptr]=value;break;case"i8":HEAP8[ptr]=value;break;case"i16":HEAP16[ptr>>1]=value;break;case"i32":HEAP32[ptr>>2]=value;break;case"i64":abort("to do setValue(i64) use WASM_BIGINT");case"float":HEAPF32[ptr>>2]=value;break;case"double":HEAPF64[ptr>>3]=value;break;case"*":HEAPU32[ptr>>2]=value;break;default:abort(`invalid type for setValue: ${type}`)}}var stackRestore=val=>__emscripten_stack_restore(val);var stackSave=()=>_emscripten_stack_get_current();class ExceptionInfo{constructor(excPtr){this.excPtr=excPtr;this.ptr=excPtr-24}set_type(type){HEAPU32[this.ptr+4>>2]=type}get_type(){return HEAPU32[this.ptr+4>>2]}set_destructor(destructor){HEAPU32[this.ptr+8>>2]=destructor}get_destructor(){return HEAPU32[this.ptr+8>>2]}set_caught(caught){caught=caught?1:0;HEAP8[this.ptr+12]=caught}get_caught(){return HEAP8[this.ptr+12]!=0}set_rethrown(rethrown){rethrown=rethrown?1:0;HEAP8[this.ptr+13]=rethrown}get_rethrown(){return HEAP8[this.ptr+13]!=0}init(type,destructor){this.set_adjusted_ptr(0);this.set_type(type);this.set_destructor(destructor)}set_adjusted_ptr(adjustedPtr){HEAPU32[this.ptr+16>>2]=adjustedPtr}get_adjusted_ptr(){return HEAPU32[this.ptr+16>>2]}get_exception_ptr(){var isPointer=___cxa_is_pointer_type(this.get_type());if(isPointer){return HEAPU32[this.excPtr>>2]}var adjusted=this.get_adjusted_ptr();if(adjusted!==0)return adjusted;return this.excPtr}}var exceptionLast=0;var uncaughtExceptionCount=0;var ___cxa_throw=(ptr,type,destructor)=>{var info=new ExceptionInfo(ptr);info.init(type,destructor);exceptionLast=ptr;uncaughtExceptionCount++;throw exceptionLast};var PATH={isAbs:path=>path.charAt(0)==="/",splitPath:filename=>{var splitPathRe=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;return splitPathRe.exec(filename).slice(1)},normalizeArray:(parts,allowAboveRoot)=>{var up=0;for(var i=parts.length-1;i>=0;i--){var last=parts[i];if(last==="."){parts.splice(i,1)}else if(last===".."){parts.splice(i,1);up++}else if(up){parts.splice(i,1);up--}}if(allowAboveRoot){for(;up;up--){parts.unshift("..")}}return parts},normalize:path=>{var isAbsolute=PATH.isAbs(path),trailingSlash=path.substr(-1)==="/";path=PATH.normalizeArray(path.split("/").filter(p=>!!p),!isAbsolute).join("/");if(!path&&!isAbsolute){path="."}if(path&&trailingSlash){path+="/"}return(isAbsolute?"/":"")+path},dirname:path=>{var result=PATH.splitPath(path),root=result[0],dir=result[1];if(!root&&!dir){return"."}if(dir){dir=dir.substr(0,dir.length-1)}return root+dir},basename:path=>{if(path==="/")return"/";path=PATH.normalize(path);path=path.replace(/\/$/,"");var lastSlash=path.lastIndexOf("/");if(lastSlash===-1)return path;return path.substr(lastSlash+1)},join:(...paths)=>PATH.normalize(paths.join("/")),join2:(l,r)=>PATH.normalize(l+"/"+r)};var initRandomFill=()=>{if(typeof crypto=="object"&&typeof crypto["getRandomValues"]=="function"){return view=>crypto.getRandomValues(view)}else if(ENVIRONMENT_IS_NODE){try{var crypto_module=require("crypto");var randomFillSync=crypto_module["randomFillSync"];if(randomFillSync){return view=>crypto_module["randomFillSync"](view)}var randomBytes=crypto_module["randomBytes"];return view=>(view.set(randomBytes(view.byteLength)),view)}catch(e){}}abort("initRandomDevice")};var randomFill=view=>(randomFill=initRandomFill())(view);var PATH_FS={resolve:(...args)=>{var resolvedPath="",resolvedAbsolute=false;for(var i=args.length-1;i>=-1&&!resolvedAbsolute;i--){var path=i>=0?args[i]:FS.cwd();if(typeof path!="string"){throw new TypeError("Arguments to path.resolve must be strings")}else if(!path){return""}resolvedPath=path+"/"+resolvedPath;resolvedAbsolute=PATH.isAbs(path)}resolvedPath=PATH.normalizeArray(resolvedPath.split("/").filter(p=>!!p),!resolvedAbsolute).join("/");return(resolvedAbsolute?"/":"")+resolvedPath||"."},relative:(from,to)=>{from=PATH_FS.resolve(from).substr(1);to=PATH_FS.resolve(to).substr(1);function trim(arr){var start=0;for(;start<arr.length;start++){if(arr[start]!=="")break}var end=arr.length-1;for(;end>=0;end--){if(arr[end]!=="")break}if(start>end)return[];return arr.slice(start,end-start+1)}var fromParts=trim(from.split("/"));var toParts=trim(to.split("/"));var length=Math.min(fromParts.length,toParts.length);var samePartsLength=length;for(var i=0;i<length;i++){if(fromParts[i]!==toParts[i]){samePartsLength=i;break}}var outputParts=[];for(var i=samePartsLength;i<fromParts.length;i++){outputParts.push("..")}outputParts=outputParts.concat(toParts.slice(samePartsLength));return outputParts.join("/")}};var UTF8Decoder=typeof TextDecoder!="undefined"?new TextDecoder("utf8"):undefined;var UTF8ArrayToString=(heapOrArray,idx,maxBytesToRead)=>{var endIdx=idx+maxBytesToRead;var endPtr=idx;while(heapOrArray[endPtr]&&!(endPtr>=endIdx))++endPtr;if(endPtr-idx>16&&heapOrArray.buffer&&UTF8Decoder){return UTF8Decoder.decode(heapOrArray.subarray(idx,endPtr))}var str="";while(idx<endPtr){var u0=heapOrArray[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heapOrArray[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=heapOrArray[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{u0=(u0&7)<<18|u1<<12|u2<<6|heapOrArray[idx++]&63}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}return str};var FS_stdin_getChar_buffer=[];var lengthBytesUTF8=str=>{var len=0;for(var i=0;i<str.length;++i){var c=str.charCodeAt(i);if(c<=127){len++}else if(c<=2047){len+=2}else if(c>=55296&&c<=57343){len+=4;++i}else{len+=3}}return len};var stringToUTF8Array=(str,heap,outIdx,maxBytesToWrite)=>{if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343){var u1=str.charCodeAt(++i);u=65536+((u&1023)<<10)|u1&1023}if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++]=192|u>>6;heap[outIdx++]=128|u&63}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++]=224|u>>12;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}else{if(outIdx+3>=endIdx)break;heap[outIdx++]=240|u>>18;heap[outIdx++]=128|u>>12&63;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}}heap[outIdx]=0;return outIdx-startIdx};function intArrayFromString(stringy,dontAddNull,length){var len=length>0?length:lengthBytesUTF8(stringy)+1;var u8array=new Array(len);var numBytesWritten=stringToUTF8Array(stringy,u8array,0,u8array.length);if(dontAddNull)u8array.length=numBytesWritten;return u8array}var FS_stdin_getChar=()=>{if(!FS_stdin_getChar_buffer.length){var result=null;if(ENVIRONMENT_IS_NODE){var BUFSIZE=256;var buf=Buffer.alloc(BUFSIZE);var bytesRead=0;var fd=process.stdin.fd;try{bytesRead=fs.readSync(fd,buf,0,BUFSIZE)}catch(e){if(e.toString().includes("EOF"))bytesRead=0;else throw e}if(bytesRead>0){result=buf.slice(0,bytesRead).toString("utf-8")}}else if(typeof window!="undefined"&&typeof window.prompt=="function"){result=window.prompt("Input: ");if(result!==null){result+="\n"}}else{}if(!result){return null}FS_stdin_getChar_buffer=intArrayFromString(result,true)}return FS_stdin_getChar_buffer.shift()};var TTY={ttys:[],init(){},shutdown(){},register(dev,ops){TTY.ttys[dev]={input:[],output:[],ops:ops};FS.registerDevice(dev,TTY.stream_ops)},stream_ops:{open(stream){var tty=TTY.ttys[stream.node.rdev];if(!tty){throw new FS.ErrnoError(43)}stream.tty=tty;stream.seekable=false},close(stream){stream.tty.ops.fsync(stream.tty)},fsync(stream){stream.tty.ops.fsync(stream.tty)},read(stream,buffer,offset,length,pos){if(!stream.tty||!stream.tty.ops.get_char){throw new FS.ErrnoError(60)}var bytesRead=0;for(var i=0;i<length;i++){var result;try{result=stream.tty.ops.get_char(stream.tty)}catch(e){throw new FS.ErrnoError(29)}if(result===undefined&&bytesRead===0){throw new FS.ErrnoError(6)}if(result===null||result===undefined)break;bytesRead++;buffer[offset+i]=result}if(bytesRead){stream.node.timestamp=Date.now()}return bytesRead},write(stream,buffer,offset,length,pos){if(!stream.tty||!stream.tty.ops.put_char){throw new FS.ErrnoError(60)}try{for(var i=0;i<length;i++){stream.tty.ops.put_char(stream.tty,buffer[offset+i])}}catch(e){throw new FS.ErrnoError(29)}if(length){stream.node.timestamp=Date.now()}return i}},default_tty_ops:{get_char(tty){return FS_stdin_getChar()},put_char(tty,val){if(val===null||val===10){out(UTF8ArrayToString(tty.output,0));tty.output=[]}else{if(val!=0)tty.output.push(val)}},fsync(tty){if(tty.output&&tty.output.length>0){out(UTF8ArrayToString(tty.output,0));tty.output=[]}},ioctl_tcgets(tty){return{c_iflag:25856,c_oflag:5,c_cflag:191,c_lflag:35387,c_cc:[3,28,127,21,4,0,1,0,17,19,26,0,18,15,23,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},ioctl_tcsets(tty,optional_actions,data){return 0},ioctl_tiocgwinsz(tty){return[24,80]}},default_tty1_ops:{put_char(tty,val){if(val===null||val===10){err(UTF8ArrayToString(tty.output,0));tty.output=[]}else{if(val!=0)tty.output.push(val)}},fsync(tty){if(tty.output&&tty.output.length>0){err(UTF8ArrayToString(tty.output,0));tty.output=[]}}}};var zeroMemory=(address,size)=>{HEAPU8.fill(0,address,address+size);return address};var alignMemory=(size,alignment)=>Math.ceil(size/alignment)*alignment;var mmapAlloc=size=>{size=alignMemory(size,65536);var ptr=_emscripten_builtin_memalign(65536,size);if(!ptr)return 0;return zeroMemory(ptr,size)};var MEMFS={ops_table:null,mount(mount){return MEMFS.createNode(null,"/",16384|511,0)},createNode(parent,name,mode,dev){if(FS.isBlkdev(mode)||FS.isFIFO(mode)){throw new FS.ErrnoError(63)}MEMFS.ops_table||={dir:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr,lookup:MEMFS.node_ops.lookup,mknod:MEMFS.node_ops.mknod,rename:MEMFS.node_ops.rename,unlink:MEMFS.node_ops.unlink,rmdir:MEMFS.node_ops.rmdir,readdir:MEMFS.node_ops.readdir,symlink:MEMFS.node_ops.symlink},stream:{llseek:MEMFS.stream_ops.llseek}},file:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr},stream:{llseek:MEMFS.stream_ops.llseek,read:MEMFS.stream_ops.read,write:MEMFS.stream_ops.write,allocate:MEMFS.stream_ops.allocate,mmap:MEMFS.stream_ops.mmap,msync:MEMFS.stream_ops.msync}},link:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr,readlink:MEMFS.node_ops.readlink},stream:{}},chrdev:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr},stream:FS.chrdev_stream_ops}};var node=FS.createNode(parent,name,mode,dev);if(FS.isDir(node.mode)){node.node_ops=MEMFS.ops_table.dir.node;node.stream_ops=MEMFS.ops_table.dir.stream;node.contents={}}else if(FS.isFile(node.mode)){node.node_ops=MEMFS.ops_table.file.node;node.stream_ops=MEMFS.ops_table.file.stream;node.usedBytes=0;node.contents=null}else if(FS.isLink(node.mode)){node.node_ops=MEMFS.ops_table.link.node;node.stream_ops=MEMFS.ops_table.link.stream}else if(FS.isChrdev(node.mode)){node.node_ops=MEMFS.ops_table.chrdev.node;node.stream_ops=MEMFS.ops_table.chrdev.stream}node.timestamp=Date.now();if(parent){parent.contents[name]=node;parent.timestamp=node.timestamp}return node},getFileDataAsTypedArray(node){if(!node.contents)return new Uint8Array(0);if(node.contents.subarray)return node.contents.subarray(0,node.usedBytes);return new Uint8Array(node.contents)},expandFileStorage(node,newCapacity){var prevCapacity=node.contents?node.contents.length:0;if(prevCapacity>=newCapacity)return;var CAPACITY_DOUBLING_MAX=1024*1024;newCapacity=Math.max(newCapacity,prevCapacity*(prevCapacity<CAPACITY_DOUBLING_MAX?2:1.125)>>>0);if(prevCapacity!=0)newCapacity=Math.max(newCapacity,256);var oldContents=node.contents;node.contents=new Uint8Array(newCapacity);if(node.usedBytes>0)node.contents.set(oldContents.subarray(0,node.usedBytes),0)},resizeFileStorage(node,newSize){if(node.usedBytes==newSize)return;if(newSize==0){node.contents=null;node.usedBytes=0}else{var oldContents=node.contents;node.contents=new Uint8Array(newSize);if(oldContents){node.contents.set(oldContents.subarray(0,Math.min(newSize,node.usedBytes)))}node.usedBytes=newSize}},node_ops:{getattr(node){var attr={};attr.dev=FS.isChrdev(node.mode)?node.id:1;attr.ino=node.id;attr.mode=node.mode;attr.nlink=1;attr.uid=0;attr.gid=0;attr.rdev=node.rdev;if(FS.isDir(node.mode)){attr.size=4096}else if(FS.isFile(node.mode)){attr.size=node.usedBytes}else if(FS.isLink(node.mode)){attr.size=node.link.length}else{attr.size=0}attr.atime=new Date(node.timestamp);attr.mtime=new Date(node.timestamp);attr.ctime=new Date(node.timestamp);attr.blksize=4096;attr.blocks=Math.ceil(attr.size/attr.blksize);return attr},setattr(node,attr){if(attr.mode!==undefined){node.mode=attr.mode}if(attr.timestamp!==undefined){node.timestamp=attr.timestamp}if(attr.size!==undefined){MEMFS.resizeFileStorage(node,attr.size)}},lookup(parent,name){throw FS.genericErrors[44]},mknod(parent,name,mode,dev){return MEMFS.createNode(parent,name,mode,dev)},rename(old_node,new_dir,new_name){if(FS.isDir(old_node.mode)){var new_node;try{new_node=FS.lookupNode(new_dir,new_name)}catch(e){}if(new_node){for(var i in new_node.contents){throw new FS.ErrnoError(55)}}}delete old_node.parent.contents[old_node.name];old_node.parent.timestamp=Date.now();old_node.name=new_name;new_dir.contents[new_name]=old_node;new_dir.timestamp=old_node.parent.timestamp;old_node.parent=new_dir},unlink(parent,name){delete parent.contents[name];parent.timestamp=Date.now()},rmdir(parent,name){var node=FS.lookupNode(parent,name);for(var i in node.contents){throw new FS.ErrnoError(55)}delete parent.contents[name];parent.timestamp=Date.now()},readdir(node){var entries=[".",".."];for(var key of Object.keys(node.contents)){entries.push(key)}return entries},symlink(parent,newname,oldpath){var node=MEMFS.createNode(parent,newname,511|40960,0);node.link=oldpath;return node},readlink(node){if(!FS.isLink(node.mode)){throw new FS.ErrnoError(28)}return node.link}},stream_ops:{read(stream,buffer,offset,length,position){var contents=stream.node.contents;if(position>=stream.node.usedBytes)return 0;var size=Math.min(stream.node.usedBytes-position,length);if(size>8&&contents.subarray){buffer.set(contents.subarray(position,position+size),offset)}else{for(var i=0;i<size;i++)buffer[offset+i]=contents[position+i]}return size},write(stream,buffer,offset,length,position,canOwn){if(buffer.buffer===HEAP8.buffer){canOwn=false}if(!length)return 0;var node=stream.node;node.timestamp=Date.now();if(buffer.subarray&&(!node.contents||node.contents.subarray)){if(canOwn){node.contents=buffer.subarray(offset,offset+length);node.usedBytes=length;return length}else if(node.usedBytes===0&&position===0){node.contents=buffer.slice(offset,offset+length);node.usedBytes=length;return length}else if(position+length<=node.usedBytes){node.contents.set(buffer.subarray(offset,offset+length),position);return length}}MEMFS.expandFileStorage(node,position+length);if(node.contents.subarray&&buffer.subarray){node.contents.set(buffer.subarray(offset,offset+length),position)}else{for(var i=0;i<length;i++){node.contents[position+i]=buffer[offset+i]}}node.usedBytes=Math.max(node.usedBytes,position+length);return length},llseek(stream,offset,whence){var position=offset;if(whence===1){position+=stream.position}else if(whence===2){if(FS.isFile(stream.node.mode)){position+=stream.node.usedBytes}}if(position<0){throw new FS.ErrnoError(28)}return position},allocate(stream,offset,length){MEMFS.expandFileStorage(stream.node,offset+length);stream.node.usedBytes=Math.max(stream.node.usedBytes,offset+length)},mmap(stream,length,position,prot,flags){if(!FS.isFile(stream.node.mode)){throw new FS.ErrnoError(43)}var ptr;var allocated;var contents=stream.node.contents;if(!(flags&2)&&contents.buffer===HEAP8.buffer){allocated=false;ptr=contents.byteOffset}else{if(position>0||position+length<contents.length){if(contents.subarray){contents=contents.subarray(position,position+length)}else{contents=Array.prototype.slice.call(contents,position,position+length)}}allocated=true;ptr=mmapAlloc(length);if(!ptr){throw new FS.ErrnoError(48)}HEAP8.set(contents,ptr)}return{ptr:ptr,allocated:allocated}},msync(stream,buffer,offset,length,mmapFlags){MEMFS.stream_ops.write(stream,buffer,0,length,offset,false);return 0}}};var asyncLoad=(url,onload,onerror,noRunDep)=>{var dep=!noRunDep?getUniqueRunDependency(`al ${url}`):"";readAsync(url,arrayBuffer=>{onload(new Uint8Array(arrayBuffer));if(dep)removeRunDependency(dep)},event=>{if(onerror){onerror()}else{throw`Loading data file "${url}" failed.`}});if(dep)addRunDependency(dep)};var FS_createDataFile=(parent,name,fileData,canRead,canWrite,canOwn)=>{FS.createDataFile(parent,name,fileData,canRead,canWrite,canOwn)};var FS_handledByPreloadPlugin=(byteArray,fullname,finish,onerror)=>{if(typeof Browser!="undefined")Browser.init();var handled=false;preloadPlugins.forEach(plugin=>{if(handled)return;if(plugin["canHandle"](fullname)){plugin["handle"](byteArray,fullname,finish,onerror);handled=true}});return handled};var FS_createPreloadedFile=(parent,name,url,canRead,canWrite,onload,onerror,dontCreateFile,canOwn,preFinish)=>{var fullname=name?PATH_FS.resolve(PATH.join2(parent,name)):parent;var dep=getUniqueRunDependency(`cp ${fullname}`);function processData(byteArray){function finish(byteArray){preFinish?.();if(!dontCreateFile){FS_createDataFile(parent,name,byteArray,canRead,canWrite,canOwn)}onload?.();removeRunDependency(dep)}if(FS_handledByPreloadPlugin(byteArray,fullname,finish,()=>{onerror?.();removeRunDependency(dep)})){return}finish(byteArray)}addRunDependency(dep);if(typeof url=="string"){asyncLoad(url,processData,onerror)}else{processData(url)}};var FS_modeStringToFlags=str=>{var flagModes={r:0,"r+":2,w:512|64|1,"w+":512|64|2,a:1024|64|1,"a+":1024|64|2};var flags=flagModes[str];if(typeof flags=="undefined"){throw new Error(`Unknown file open mode: ${str}`)}return flags};var FS_getMode=(canRead,canWrite)=>{var mode=0;if(canRead)mode|=292|73;if(canWrite)mode|=146;return mode};var FS={root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,ErrnoError:class{constructor(errno){this.name="ErrnoError";this.errno=errno}},genericErrors:{},filesystems:null,syncFSRequests:0,FSStream:class{constructor(){this.shared={}}get object(){return this.node}set object(val){this.node=val}get isRead(){return(this.flags&2097155)!==1}get isWrite(){return(this.flags&2097155)!==0}get isAppend(){return this.flags&1024}get flags(){return this.shared.flags}set flags(val){this.shared.flags=val}get position(){return this.shared.position}set position(val){this.shared.position=val}},FSNode:class{constructor(parent,name,mode,rdev){if(!parent){parent=this}this.parent=parent;this.mount=parent.mount;this.mounted=null;this.id=FS.nextInode++;this.name=name;this.mode=mode;this.node_ops={};this.stream_ops={};this.rdev=rdev;this.readMode=292|73;this.writeMode=146}get read(){return(this.mode&this.readMode)===this.readMode}set read(val){val?this.mode|=this.readMode:this.mode&=~this.readMode}get write(){return(this.mode&this.writeMode)===this.writeMode}set write(val){val?this.mode|=this.writeMode:this.mode&=~this.writeMode}get isFolder(){return FS.isDir(this.mode)}get isDevice(){return FS.isChrdev(this.mode)}},lookupPath(path,opts={}){path=PATH_FS.resolve(path);if(!path)return{path:"",node:null};var defaults={follow_mount:true,recurse_count:0};opts=Object.assign(defaults,opts);if(opts.recurse_count>8){throw new FS.ErrnoError(32)}var parts=path.split("/").filter(p=>!!p);var current=FS.root;var current_path="/";for(var i=0;i<parts.length;i++){var islast=i===parts.length-1;if(islast&&opts.parent){break}current=FS.lookupNode(current,parts[i]);current_path=PATH.join2(current_path,parts[i]);if(FS.isMountpoint(current)){if(!islast||islast&&opts.follow_mount){current=current.mounted.root}}if(!islast||opts.follow){var count=0;while(FS.isLink(current.mode)){var link=FS.readlink(current_path);current_path=PATH_FS.resolve(PATH.dirname(current_path),link);var lookup=FS.lookupPath(current_path,{recurse_count:opts.recurse_count+1});current=lookup.node;if(count++>40){throw new FS.ErrnoError(32)}}}}return{path:current_path,node:current}},getPath(node){var path;while(true){if(FS.isRoot(node)){var mount=node.mount.mountpoint;if(!path)return mount;return mount[mount.length-1]!=="/"?`${mount}/${path}`:mount+path}path=path?`${node.name}/${path}`:node.name;node=node.parent}},hashName(parentid,name){var hash=0;for(var i=0;i<name.length;i++){hash=(hash<<5)-hash+name.charCodeAt(i)|0}return(parentid+hash>>>0)%FS.nameTable.length},hashAddNode(node){var hash=FS.hashName(node.parent.id,node.name);node.name_next=FS.nameTable[hash];FS.nameTable[hash]=node},hashRemoveNode(node){var hash=FS.hashName(node.parent.id,node.name);if(FS.nameTable[hash]===node){FS.nameTable[hash]=node.name_next}else{var current=FS.nameTable[hash];while(current){if(current.name_next===node){current.name_next=node.name_next;break}current=current.name_next}}},lookupNode(parent,name){var errCode=FS.mayLookup(parent);if(errCode){throw new FS.ErrnoError(errCode)}var hash=FS.hashName(parent.id,name);for(var node=FS.nameTable[hash];node;node=node.name_next){var nodeName=node.name;if(node.parent.id===parent.id&&nodeName===name){return node}}return FS.lookup(parent,name)},createNode(parent,name,mode,rdev){var node=new FS.FSNode(parent,name,mode,rdev);FS.hashAddNode(node);return node},destroyNode(node){FS.hashRemoveNode(node)},isRoot(node){return node===node.parent},isMountpoint(node){return!!node.mounted},isFile(mode){return(mode&61440)===32768},isDir(mode){return(mode&61440)===16384},isLink(mode){return(mode&61440)===40960},isChrdev(mode){return(mode&61440)===8192},isBlkdev(mode){return(mode&61440)===24576},isFIFO(mode){return(mode&61440)===4096},isSocket(mode){return(mode&49152)===49152},flagsToPermissionString(flag){var perms=["r","w","rw"][flag&3];if(flag&512){perms+="w"}return perms},nodePermissions(node,perms){if(FS.ignorePermissions){return 0}if(perms.includes("r")&&!(node.mode&292)){return 2}else if(perms.includes("w")&&!(node.mode&146)){return 2}else if(perms.includes("x")&&!(node.mode&73)){return 2}return 0},mayLookup(dir){if(!FS.isDir(dir.mode))return 54;var errCode=FS.nodePermissions(dir,"x");if(errCode)return errCode;if(!dir.node_ops.lookup)return 2;return 0},mayCreate(dir,name){try{var node=FS.lookupNode(dir,name);return 20}catch(e){}return FS.nodePermissions(dir,"wx")},mayDelete(dir,name,isdir){var node;try{node=FS.lookupNode(dir,name)}catch(e){return e.errno}var errCode=FS.nodePermissions(dir,"wx");if(errCode){return errCode}if(isdir){if(!FS.isDir(node.mode)){return 54}if(FS.isRoot(node)||FS.getPath(node)===FS.cwd()){return 10}}else{if(FS.isDir(node.mode)){return 31}}return 0},mayOpen(node,flags){if(!node){return 44}if(FS.isLink(node.mode)){return 32}else if(FS.isDir(node.mode)){if(FS.flagsToPermissionString(flags)!=="r"||flags&512){return 31}}return FS.nodePermissions(node,FS.flagsToPermissionString(flags))},MAX_OPEN_FDS:4096,nextfd(){for(var fd=0;fd<=FS.MAX_OPEN_FDS;fd++){if(!FS.streams[fd]){return fd}}throw new FS.ErrnoError(33)},getStreamChecked(fd){var stream=FS.getStream(fd);if(!stream){throw new FS.ErrnoError(8)}return stream},getStream:fd=>FS.streams[fd],createStream(stream,fd=-1){stream=Object.assign(new FS.FSStream,stream);if(fd==-1){fd=FS.nextfd()}stream.fd=fd;FS.streams[fd]=stream;return stream},closeStream(fd){FS.streams[fd]=null},dupStream(origStream,fd=-1){var stream=FS.createStream(origStream,fd);stream.stream_ops?.dup?.(stream);return stream},chrdev_stream_ops:{open(stream){var device=FS.getDevice(stream.node.rdev);stream.stream_ops=device.stream_ops;stream.stream_ops.open?.(stream)},llseek(){throw new FS.ErrnoError(70)}},major:dev=>dev>>8,minor:dev=>dev&255,makedev:(ma,mi)=>ma<<8|mi,registerDevice(dev,ops){FS.devices[dev]={stream_ops:ops}},getDevice:dev=>FS.devices[dev],getMounts(mount){var mounts=[];var check=[mount];while(check.length){var m=check.pop();mounts.push(m);check.push(...m.mounts)}return mounts},syncfs(populate,callback){if(typeof populate=="function"){callback=populate;populate=false}FS.syncFSRequests++;if(FS.syncFSRequests>1){err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`)}var mounts=FS.getMounts(FS.root.mount);var completed=0;function doCallback(errCode){FS.syncFSRequests--;return callback(errCode)}function done(errCode){if(errCode){if(!done.errored){done.errored=true;return doCallback(errCode)}return}if(++completed>=mounts.length){doCallback(null)}}mounts.forEach(mount=>{if(!mount.type.syncfs){return done(null)}mount.type.syncfs(mount,populate,done)})},mount(type,opts,mountpoint){var root=mountpoint==="/";var pseudo=!mountpoint;var node;if(root&&FS.root){throw new FS.ErrnoError(10)}else if(!root&&!pseudo){var lookup=FS.lookupPath(mountpoint,{follow_mount:false});mountpoint=lookup.path;node=lookup.node;if(FS.isMountpoint(node)){throw new FS.ErrnoError(10)}if(!FS.isDir(node.mode)){throw new FS.ErrnoError(54)}}var mount={type:type,opts:opts,mountpoint:mountpoint,mounts:[]};var mountRoot=type.mount(mount);mountRoot.mount=mount;mount.root=mountRoot;if(root){FS.root=mountRoot}else if(node){node.mounted=mount;if(node.mount){node.mount.mounts.push(mount)}}return mountRoot},unmount(mountpoint){var lookup=FS.lookupPath(mountpoint,{follow_mount:false});if(!FS.isMountpoint(lookup.node)){throw new FS.ErrnoError(28)}var node=lookup.node;var mount=node.mounted;var mounts=FS.getMounts(mount);Object.keys(FS.nameTable).forEach(hash=>{var current=FS.nameTable[hash];while(current){var next=current.name_next;if(mounts.includes(current.mount)){FS.destroyNode(current)}current=next}});node.mounted=null;var idx=node.mount.mounts.indexOf(mount);node.mount.mounts.splice(idx,1)},lookup(parent,name){return parent.node_ops.lookup(parent,name)},mknod(path,mode,dev){var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;var name=PATH.basename(path);if(!name||name==="."||name===".."){throw new FS.ErrnoError(28)}var errCode=FS.mayCreate(parent,name);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.mknod){throw new FS.ErrnoError(63)}return parent.node_ops.mknod(parent,name,mode,dev)},create(path,mode){mode=mode!==undefined?mode:438;mode&=4095;mode|=32768;return FS.mknod(path,mode,0)},mkdir(path,mode){mode=mode!==undefined?mode:511;mode&=511|512;mode|=16384;return FS.mknod(path,mode,0)},mkdirTree(path,mode){var dirs=path.split("/");var d="";for(var i=0;i<dirs.length;++i){if(!dirs[i])continue;d+="/"+dirs[i];try{FS.mkdir(d,mode)}catch(e){if(e.errno!=20)throw e}}},mkdev(path,mode,dev){if(typeof dev=="undefined"){dev=mode;mode=438}mode|=8192;return FS.mknod(path,mode,dev)},symlink(oldpath,newpath){if(!PATH_FS.resolve(oldpath)){throw new FS.ErrnoError(44)}var lookup=FS.lookupPath(newpath,{parent:true});var parent=lookup.node;if(!parent){throw new FS.ErrnoError(44)}var newname=PATH.basename(newpath);var errCode=FS.mayCreate(parent,newname);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.symlink){throw new FS.ErrnoError(63)}return parent.node_ops.symlink(parent,newname,oldpath)},rename(old_path,new_path){var old_dirname=PATH.dirname(old_path);var new_dirname=PATH.dirname(new_path);var old_name=PATH.basename(old_path);var new_name=PATH.basename(new_path);var lookup,old_dir,new_dir;lookup=FS.lookupPath(old_path,{parent:true});old_dir=lookup.node;lookup=FS.lookupPath(new_path,{parent:true});new_dir=lookup.node;if(!old_dir||!new_dir)throw new FS.ErrnoError(44);if(old_dir.mount!==new_dir.mount){throw new FS.ErrnoError(75)}var old_node=FS.lookupNode(old_dir,old_name);var relative=PATH_FS.relative(old_path,new_dirname);if(relative.charAt(0)!=="."){throw new FS.ErrnoError(28)}relative=PATH_FS.relative(new_path,old_dirname);if(relative.charAt(0)!=="."){throw new FS.ErrnoError(55)}var new_node;try{new_node=FS.lookupNode(new_dir,new_name)}catch(e){}if(old_node===new_node){return}var isdir=FS.isDir(old_node.mode);var errCode=FS.mayDelete(old_dir,old_name,isdir);if(errCode){throw new FS.ErrnoError(errCode)}errCode=new_node?FS.mayDelete(new_dir,new_name,isdir):FS.mayCreate(new_dir,new_name);if(errCode){throw new FS.ErrnoError(errCode)}if(!old_dir.node_ops.rename){throw new FS.ErrnoError(63)}if(FS.isMountpoint(old_node)||new_node&&FS.isMountpoint(new_node)){throw new FS.ErrnoError(10)}if(new_dir!==old_dir){errCode=FS.nodePermissions(old_dir,"w");if(errCode){throw new FS.ErrnoError(errCode)}}FS.hashRemoveNode(old_node);try{old_dir.node_ops.rename(old_node,new_dir,new_name)}catch(e){throw e}finally{FS.hashAddNode(old_node)}},rmdir(path){var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;var name=PATH.basename(path);var node=FS.lookupNode(parent,name);var errCode=FS.mayDelete(parent,name,true);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.rmdir){throw new FS.ErrnoError(63)}if(FS.isMountpoint(node)){throw new FS.ErrnoError(10)}parent.node_ops.rmdir(parent,name);FS.destroyNode(node)},readdir(path){var lookup=FS.lookupPath(path,{follow:true});var node=lookup.node;if(!node.node_ops.readdir){throw new FS.ErrnoError(54)}return node.node_ops.readdir(node)},unlink(path){var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;if(!parent){throw new FS.ErrnoError(44)}var name=PATH.basename(path);var node=FS.lookupNode(parent,name);var errCode=FS.mayDelete(parent,name,false);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.unlink){throw new FS.ErrnoError(63)}if(FS.isMountpoint(node)){throw new FS.ErrnoError(10)}parent.node_ops.unlink(parent,name);FS.destroyNode(node)},readlink(path){var lookup=FS.lookupPath(path);var link=lookup.node;if(!link){throw new FS.ErrnoError(44)}if(!link.node_ops.readlink){throw new FS.ErrnoError(28)}return PATH_FS.resolve(FS.getPath(link.parent),link.node_ops.readlink(link))},stat(path,dontFollow){var lookup=FS.lookupPath(path,{follow:!dontFollow});var node=lookup.node;if(!node){throw new FS.ErrnoError(44)}if(!node.node_ops.getattr){throw new FS.ErrnoError(63)}return node.node_ops.getattr(node)},lstat(path){return FS.stat(path,true)},chmod(path,mode,dontFollow){var node;if(typeof path=="string"){var lookup=FS.lookupPath(path,{follow:!dontFollow});node=lookup.node}else{node=path}if(!node.node_ops.setattr){throw new FS.ErrnoError(63)}node.node_ops.setattr(node,{mode:mode&4095|node.mode&~4095,timestamp:Date.now()})},lchmod(path,mode){FS.chmod(path,mode,true)},fchmod(fd,mode){var stream=FS.getStreamChecked(fd);FS.chmod(stream.node,mode)},chown(path,uid,gid,dontFollow){var node;if(typeof path=="string"){var lookup=FS.lookupPath(path,{follow:!dontFollow});node=lookup.node}else{node=path}if(!node.node_ops.setattr){throw new FS.ErrnoError(63)}node.node_ops.setattr(node,{timestamp:Date.now()})},lchown(path,uid,gid){FS.chown(path,uid,gid,true)},fchown(fd,uid,gid){var stream=FS.getStreamChecked(fd);FS.chown(stream.node,uid,gid)},truncate(path,len){if(len<0){throw new FS.ErrnoError(28)}var node;if(typeof path=="string"){var lookup=FS.lookupPath(path,{follow:true});node=lookup.node}else{node=path}if(!node.node_ops.setattr){throw new FS.ErrnoError(63)}if(FS.isDir(node.mode)){throw new FS.ErrnoError(31)}if(!FS.isFile(node.mode)){throw new FS.ErrnoError(28)}var errCode=FS.nodePermissions(node,"w");if(errCode){throw new FS.ErrnoError(errCode)}node.node_ops.setattr(node,{size:len,timestamp:Date.now()})},ftruncate(fd,len){var stream=FS.getStreamChecked(fd);if((stream.flags&2097155)===0){throw new FS.ErrnoError(28)}FS.truncate(stream.node,len)},utime(path,atime,mtime){var lookup=FS.lookupPath(path,{follow:true});var node=lookup.node;node.node_ops.setattr(node,{timestamp:Math.max(atime,mtime)})},open(path,flags,mode){if(path===""){throw new FS.ErrnoError(44)}flags=typeof flags=="string"?FS_modeStringToFlags(flags):flags;if(flags&64){mode=typeof mode=="undefined"?438:mode;mode=mode&4095|32768}else{mode=0}var node;if(typeof path=="object"){node=path}else{path=PATH.normalize(path);try{var lookup=FS.lookupPath(path,{follow:!(flags&131072)});node=lookup.node}catch(e){}}var created=false;if(flags&64){if(node){if(flags&128){throw new FS.ErrnoError(20)}}else{node=FS.mknod(path,mode,0);created=true}}if(!node){throw new FS.ErrnoError(44)}if(FS.isChrdev(node.mode)){flags&=~512}if(flags&65536&&!FS.isDir(node.mode)){throw new FS.ErrnoError(54)}if(!created){var errCode=FS.mayOpen(node,flags);if(errCode){throw new FS.ErrnoError(errCode)}}if(flags&512&&!created){FS.truncate(node,0)}flags&=~(128|512|131072);var stream=FS.createStream({node:node,path:FS.getPath(node),flags:flags,seekable:true,position:0,stream_ops:node.stream_ops,ungotten:[],error:false});if(stream.stream_ops.open){stream.stream_ops.open(stream)}if(Module["logReadFiles"]&&!(flags&1)){if(!FS.readFiles)FS.readFiles={};if(!(path in FS.readFiles)){FS.readFiles[path]=1}}return stream},close(stream){if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if(stream.getdents)stream.getdents=null;try{if(stream.stream_ops.close){stream.stream_ops.close(stream)}}catch(e){throw e}finally{FS.closeStream(stream.fd)}stream.fd=null},isClosed(stream){return stream.fd===null},llseek(stream,offset,whence){if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if(!stream.seekable||!stream.stream_ops.llseek){throw new FS.ErrnoError(70)}if(whence!=0&&whence!=1&&whence!=2){throw new FS.ErrnoError(28)}stream.position=stream.stream_ops.llseek(stream,offset,whence);stream.ungotten=[];return stream.position},read(stream,buffer,offset,length,position){if(length<0||position<0){throw new FS.ErrnoError(28)}if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if((stream.flags&2097155)===1){throw new FS.ErrnoError(8)}if(FS.isDir(stream.node.mode)){throw new FS.ErrnoError(31)}if(!stream.stream_ops.read){throw new FS.ErrnoError(28)}var seeking=typeof position!="undefined";if(!seeking){position=stream.position}else if(!stream.seekable){throw new FS.ErrnoError(70)}var bytesRead=stream.stream_ops.read(stream,buffer,offset,length,position);if(!seeking)stream.position+=bytesRead;return bytesRead},write(stream,buffer,offset,length,position,canOwn){if(length<0||position<0){throw new FS.ErrnoError(28)}if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if((stream.flags&2097155)===0){throw new FS.ErrnoError(8)}if(FS.isDir(stream.node.mode)){throw new FS.ErrnoError(31)}if(!stream.stream_ops.write){throw new FS.ErrnoError(28)}if(stream.seekable&&stream.flags&1024){FS.llseek(stream,0,2)}var seeking=typeof position!="undefined";if(!seeking){position=stream.position}else if(!stream.seekable){throw new FS.ErrnoError(70)}var bytesWritten=stream.stream_ops.write(stream,buffer,offset,length,position,canOwn);if(!seeking)stream.position+=bytesWritten;return bytesWritten},allocate(stream,offset,length){if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if(offset<0||length<=0){throw new FS.ErrnoError(28)}if((stream.flags&2097155)===0){throw new FS.ErrnoError(8)}if(!FS.isFile(stream.node.mode)&&!FS.isDir(stream.node.mode)){throw new FS.ErrnoError(43)}if(!stream.stream_ops.allocate){throw new FS.ErrnoError(138)}stream.stream_ops.allocate(stream,offset,length)},mmap(stream,length,position,prot,flags){if((prot&2)!==0&&(flags&2)===0&&(stream.flags&2097155)!==2){throw new FS.ErrnoError(2)}if((stream.flags&2097155)===1){throw new FS.ErrnoError(2)}if(!stream.stream_ops.mmap){throw new FS.ErrnoError(43)}return stream.stream_ops.mmap(stream,length,position,prot,flags)},msync(stream,buffer,offset,length,mmapFlags){if(!stream.stream_ops.msync){return 0}return stream.stream_ops.msync(stream,buffer,offset,length,mmapFlags)},ioctl(stream,cmd,arg){if(!stream.stream_ops.ioctl){throw new FS.ErrnoError(59)}return stream.stream_ops.ioctl(stream,cmd,arg)},readFile(path,opts={}){opts.flags=opts.flags||0;opts.encoding=opts.encoding||"binary";if(opts.encoding!=="utf8"&&opts.encoding!=="binary"){throw new Error(`Invalid encoding type "${opts.encoding}"`)}var ret;var stream=FS.open(path,opts.flags);var stat=FS.stat(path);var length=stat.size;var buf=new Uint8Array(length);FS.read(stream,buf,0,length,0);if(opts.encoding==="utf8"){ret=UTF8ArrayToString(buf,0)}else if(opts.encoding==="binary"){ret=buf}FS.close(stream);return ret},writeFile(path,data,opts={}){opts.flags=opts.flags||577;var stream=FS.open(path,opts.flags,opts.mode);if(typeof data=="string"){var buf=new Uint8Array(lengthBytesUTF8(data)+1);var actualNumBytes=stringToUTF8Array(data,buf,0,buf.length);FS.write(stream,buf,0,actualNumBytes,undefined,opts.canOwn)}else if(ArrayBuffer.isView(data)){FS.write(stream,data,0,data.byteLength,undefined,opts.canOwn)}else{throw new Error("Unsupported data type")}FS.close(stream)},cwd:()=>FS.currentPath,chdir(path){var lookup=FS.lookupPath(path,{follow:true});if(lookup.node===null){throw new FS.ErrnoError(44)}if(!FS.isDir(lookup.node.mode)){throw new FS.ErrnoError(54)}var errCode=FS.nodePermissions(lookup.node,"x");if(errCode){throw new FS.ErrnoError(errCode)}FS.currentPath=lookup.path},createDefaultDirectories(){FS.mkdir("/tmp");FS.mkdir("/home");FS.mkdir("/home/web_user")},createDefaultDevices(){FS.mkdir("/dev");FS.registerDevice(FS.makedev(1,3),{read:()=>0,write:(stream,buffer,offset,length,pos)=>length});FS.mkdev("/dev/null",FS.makedev(1,3));TTY.register(FS.makedev(5,0),TTY.default_tty_ops);TTY.register(FS.makedev(6,0),TTY.default_tty1_ops);FS.mkdev("/dev/tty",FS.makedev(5,0));FS.mkdev("/dev/tty1",FS.makedev(6,0));var randomBuffer=new Uint8Array(1024),randomLeft=0;var randomByte=()=>{if(randomLeft===0){randomLeft=randomFill(randomBuffer).byteLength}return randomBuffer[--randomLeft]};FS.createDevice("/dev","random",randomByte);FS.createDevice("/dev","urandom",randomByte);FS.mkdir("/dev/shm");FS.mkdir("/dev/shm/tmp")},createSpecialDirectories(){FS.mkdir("/proc");var proc_self=FS.mkdir("/proc/self");FS.mkdir("/proc/self/fd");FS.mount({mount(){var node=FS.createNode(proc_self,"fd",16384|511,73);node.node_ops={lookup(parent,name){var fd=+name;var stream=FS.getStreamChecked(fd);var ret={parent:null,mount:{mountpoint:"fake"},node_ops:{readlink:()=>stream.path}};ret.parent=ret;return ret}};return node}},{},"/proc/self/fd")},createStandardStreams(){if(Module["stdin"]){FS.createDevice("/dev","stdin",Module["stdin"])}else{FS.symlink("/dev/tty","/dev/stdin")}if(Module["stdout"]){FS.createDevice("/dev","stdout",null,Module["stdout"])}else{FS.symlink("/dev/tty","/dev/stdout")}if(Module["stderr"]){FS.createDevice("/dev","stderr",null,Module["stderr"])}else{FS.symlink("/dev/tty1","/dev/stderr")}var stdin=FS.open("/dev/stdin",0);var stdout=FS.open("/dev/stdout",1);var stderr=FS.open("/dev/stderr",1)},staticInit(){[44].forEach(code=>{FS.genericErrors[code]=new FS.ErrnoError(code);FS.genericErrors[code].stack="<generic error, no stack>"});FS.nameTable=new Array(4096);FS.mount(MEMFS,{},"/");FS.createDefaultDirectories();FS.createDefaultDevices();FS.createSpecialDirectories();FS.filesystems={MEMFS:MEMFS}},init(input,output,error){FS.init.initialized=true;Module["stdin"]=input||Module["stdin"];Module["stdout"]=output||Module["stdout"];Module["stderr"]=error||Module["stderr"];FS.createStandardStreams()},quit(){FS.init.initialized=false;for(var i=0;i<FS.streams.length;i++){var stream=FS.streams[i];if(!stream){continue}FS.close(stream)}},findObject(path,dontResolveLastLink){var ret=FS.analyzePath(path,dontResolveLastLink);if(!ret.exists){return null}return ret.object},analyzePath(path,dontResolveLastLink){try{var lookup=FS.lookupPath(path,{follow:!dontResolveLastLink});path=lookup.path}catch(e){}var ret={isRoot:false,exists:false,error:0,name:null,path:null,object:null,parentExists:false,parentPath:null,parentObject:null};try{var lookup=FS.lookupPath(path,{parent:true});ret.parentExists=true;ret.parentPath=lookup.path;ret.parentObject=lookup.node;ret.name=PATH.basename(path);lookup=FS.lookupPath(path,{follow:!dontResolveLastLink});ret.exists=true;ret.path=lookup.path;ret.object=lookup.node;ret.name=lookup.node.name;ret.isRoot=lookup.path==="/"}catch(e){ret.error=e.errno}return ret},createPath(parent,path,canRead,canWrite){parent=typeof parent=="string"?parent:FS.getPath(parent);var parts=path.split("/").reverse();while(parts.length){var part=parts.pop();if(!part)continue;var current=PATH.join2(parent,part);try{FS.mkdir(current)}catch(e){}parent=current}return current},createFile(parent,name,properties,canRead,canWrite){var path=PATH.join2(typeof parent=="string"?parent:FS.getPath(parent),name);var mode=FS_getMode(canRead,canWrite);return FS.create(path,mode)},createDataFile(parent,name,data,canRead,canWrite,canOwn){var path=name;if(parent){parent=typeof parent=="string"?parent:FS.getPath(parent);path=name?PATH.join2(parent,name):parent}var mode=FS_getMode(canRead,canWrite);var node=FS.create(path,mode);if(data){if(typeof data=="string"){var arr=new Array(data.length);for(var i=0,len=data.length;i<len;++i)arr[i]=data.charCodeAt(i);data=arr}FS.chmod(node,mode|146);var stream=FS.open(node,577);FS.write(stream,data,0,data.length,0,canOwn);FS.close(stream);FS.chmod(node,mode)}},createDevice(parent,name,input,output){var path=PATH.join2(typeof parent=="string"?parent:FS.getPath(parent),name);var mode=FS_getMode(!!input,!!output);if(!FS.createDevice.major)FS.createDevice.major=64;var dev=FS.makedev(FS.createDevice.major++,0);FS.registerDevice(dev,{open(stream){stream.seekable=false},close(stream){if(output?.buffer?.length){output(10)}},read(stream,buffer,offset,length,pos){var bytesRead=0;for(var i=0;i<length;i++){var result;try{result=input()}catch(e){throw new FS.ErrnoError(29)}if(result===undefined&&bytesRead===0){throw new FS.ErrnoError(6)}if(result===null||result===undefined)break;bytesRead++;buffer[offset+i]=result}if(bytesRead){stream.node.timestamp=Date.now()}return bytesRead},write(stream,buffer,offset,length,pos){for(var i=0;i<length;i++){try{output(buffer[offset+i])}catch(e){throw new FS.ErrnoError(29)}}if(length){stream.node.timestamp=Date.now()}return i}});return FS.mkdev(path,mode,dev)},forceLoadFile(obj){if(obj.isDevice||obj.isFolder||obj.link||obj.contents)return true;if(typeof XMLHttpRequest!="undefined"){throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.")}else if(read_){try{obj.contents=intArrayFromString(read_(obj.url),true);obj.usedBytes=obj.contents.length}catch(e){throw new FS.ErrnoError(29)}}else{throw new Error("Cannot load without read() or XMLHttpRequest.")}},createLazyFile(parent,name,url,canRead,canWrite){class LazyUint8Array{constructor(){this.lengthKnown=false;this.chunks=[]}get(idx){if(idx>this.length-1||idx<0){return undefined}var chunkOffset=idx%this.chunkSize;var chunkNum=idx/this.chunkSize|0;return this.getter(chunkNum)[chunkOffset]}setDataGetter(getter){this.getter=getter}cacheLength(){var xhr=new XMLHttpRequest;xhr.open("HEAD",url,false);xhr.send(null);if(!(xhr.status>=200&&xhr.status<300||xhr.status===304))throw new Error("Couldn't load "+url+". Status: "+xhr.status);var datalength=Number(xhr.getResponseHeader("Content-length"));var header;var hasByteServing=(header=xhr.getResponseHeader("Accept-Ranges"))&&header==="bytes";var usesGzip=(header=xhr.getResponseHeader("Content-Encoding"))&&header==="gzip";var chunkSize=1024*1024;if(!hasByteServing)chunkSize=datalength;var doXHR=(from,to)=>{if(from>to)throw new Error("invalid range ("+from+", "+to+") or no bytes requested!");if(to>datalength-1)throw new Error("only "+datalength+" bytes available! programmer error!");var xhr=new XMLHttpRequest;xhr.open("GET",url,false);if(datalength!==chunkSize)xhr.setRequestHeader("Range","bytes="+from+"-"+to);xhr.responseType="arraybuffer";if(xhr.overrideMimeType){xhr.overrideMimeType("text/plain; charset=x-user-defined")}xhr.send(null);if(!(xhr.status>=200&&xhr.status<300||xhr.status===304))throw new Error("Couldn't load "+url+". Status: "+xhr.status);if(xhr.response!==undefined){return new Uint8Array(xhr.response||[])}return intArrayFromString(xhr.responseText||"",true)};var lazyArray=this;lazyArray.setDataGetter(chunkNum=>{var start=chunkNum*chunkSize;var end=(chunkNum+1)*chunkSize-1;end=Math.min(end,datalength-1);if(typeof lazyArray.chunks[chunkNum]=="undefined"){lazyArray.chunks[chunkNum]=doXHR(start,end)}if(typeof lazyArray.chunks[chunkNum]=="undefined")throw new Error("doXHR failed!");return lazyArray.chunks[chunkNum]});if(usesGzip||!datalength){chunkSize=datalength=1;datalength=this.getter(0).length;chunkSize=datalength;out("LazyFiles on gzip forces download of the whole file when length is accessed")}this._length=datalength;this._chunkSize=chunkSize;this.lengthKnown=true}get length(){if(!this.lengthKnown){this.cacheLength()}return this._length}get chunkSize(){if(!this.lengthKnown){this.cacheLength()}return this._chunkSize}}if(typeof XMLHttpRequest!="undefined"){if(!ENVIRONMENT_IS_WORKER)throw"Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";var lazyArray=new LazyUint8Array;var properties={isDevice:false,contents:lazyArray}}else{var properties={isDevice:false,url:url}}var node=FS.createFile(parent,name,properties,canRead,canWrite);if(properties.contents){node.contents=properties.contents}else if(properties.url){node.contents=null;node.url=properties.url}Object.defineProperties(node,{usedBytes:{get:function(){return this.contents.length}}});var stream_ops={};var keys=Object.keys(node.stream_ops);keys.forEach(key=>{var fn=node.stream_ops[key];stream_ops[key]=(...args)=>{FS.forceLoadFile(node);return fn(...args)}});function writeChunks(stream,buffer,offset,length,position){var contents=stream.node.contents;if(position>=contents.length)return 0;var size=Math.min(contents.length-position,length);if(contents.slice){for(var i=0;i<size;i++){buffer[offset+i]=contents[position+i]}}else{for(var i=0;i<size;i++){buffer[offset+i]=contents.get(position+i)}}return size}stream_ops.read=(stream,buffer,offset,length,position)=>{FS.forceLoadFile(node);return writeChunks(stream,buffer,offset,length,position)};stream_ops.mmap=(stream,length,position,prot,flags)=>{FS.forceLoadFile(node);var ptr=mmapAlloc(length);if(!ptr){throw new FS.ErrnoError(48)}writeChunks(stream,HEAP8,ptr,length,position);return{ptr:ptr,allocated:true}};node.stream_ops=stream_ops;return node}};var UTF8ToString=(ptr,maxBytesToRead)=>ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):"";var SYSCALLS={DEFAULT_POLLMASK:5,calculateAt(dirfd,path,allowEmpty){if(PATH.isAbs(path)){return path}var dir;if(dirfd===-100){dir=FS.cwd()}else{var dirstream=SYSCALLS.getStreamFromFD(dirfd);dir=dirstream.path}if(path.length==0){if(!allowEmpty){throw new FS.ErrnoError(44)}return dir}return PATH.join2(dir,path)},doStat(func,path,buf){var stat=func(path);HEAP32[buf>>2]=stat.dev;HEAP32[buf+4>>2]=stat.mode;HEAPU32[buf+8>>2]=stat.nlink;HEAP32[buf+12>>2]=stat.uid;HEAP32[buf+16>>2]=stat.gid;HEAP32[buf+20>>2]=stat.rdev;tempI64=[stat.size>>>0,(tempDouble=stat.size,+Math.abs(tempDouble)>=1?tempDouble>0?+Math.floor(tempDouble/4294967296)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[buf+24>>2]=tempI64[0],HEAP32[buf+28>>2]=tempI64[1];HEAP32[buf+32>>2]=4096;HEAP32[buf+36>>2]=stat.blocks;var atime=stat.atime.getTime();var mtime=stat.mtime.getTime();var ctime=stat.ctime.getTime();tempI64=[Math.floor(atime/1e3)>>>0,(tempDouble=Math.floor(atime/1e3),+Math.abs(tempDouble)>=1?tempDouble>0?+Math.floor(tempDouble/4294967296)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[buf+40>>2]=tempI64[0],HEAP32[buf+44>>2]=tempI64[1];HEAPU32[buf+48>>2]=atime%1e3*1e3;tempI64=[Math.floor(mtime/1e3)>>>0,(tempDouble=Math.floor(mtime/1e3),+Math.abs(tempDouble)>=1?tempDouble>0?+Math.floor(tempDouble/4294967296)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[buf+56>>2]=tempI64[0],HEAP32[buf+60>>2]=tempI64[1];HEAPU32[buf+64>>2]=mtime%1e3*1e3;tempI64=[Math.floor(ctime/1e3)>>>0,(tempDouble=Math.floor(ctime/1e3),+Math.abs(tempDouble)>=1?tempDouble>0?+Math.floor(tempDouble/4294967296)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[buf+72>>2]=tempI64[0],HEAP32[buf+76>>2]=tempI64[1];HEAPU32[buf+80>>2]=ctime%1e3*1e3;tempI64=[stat.ino>>>0,(tempDouble=stat.ino,+Math.abs(tempDouble)>=1?tempDouble>0?+Math.floor(tempDouble/4294967296)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[buf+88>>2]=tempI64[0],HEAP32[buf+92>>2]=tempI64[1];return 0},doMsync(addr,stream,len,flags,offset){if(!FS.isFile(stream.node.mode)){throw new FS.ErrnoError(43)}if(flags&2){return 0}var buffer=HEAPU8.slice(addr,addr+len);FS.msync(stream,buffer,offset,len,flags)},getStreamFromFD(fd){var stream=FS.getStreamChecked(fd);return stream},varargs:undefined,getStr(ptr){var ret=UTF8ToString(ptr);return ret}};function ___syscall_chmod(path,mode){try{path=SYSCALLS.getStr(path);FS.chmod(path,mode);return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}function ___syscall_faccessat(dirfd,path,amode,flags){try{path=SYSCALLS.getStr(path);path=SYSCALLS.calculateAt(dirfd,path);if(amode&~7){return-28}var lookup=FS.lookupPath(path,{follow:true});var node=lookup.node;if(!node){return-44}var perms="";if(amode&4)perms+="r";if(amode&2)perms+="w";if(amode&1)perms+="x";if(perms&&FS.nodePermissions(node,perms)){return-2}return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}function ___syscall_fchmod(fd,mode){try{FS.fchmod(fd,mode);return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}function ___syscall_fchown32(fd,owner,group){try{FS.fchown(fd,owner,group);return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}function syscallGetVarargI(){var ret=HEAP32[+SYSCALLS.varargs>>2];SYSCALLS.varargs+=4;return ret}var syscallGetVarargP=syscallGetVarargI;function ___syscall_fcntl64(fd,cmd,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(fd);switch(cmd){case 0:{var arg=syscallGetVarargI();if(arg<0){return-28}while(FS.streams[arg]){arg++}var newStream;newStream=FS.dupStream(stream,arg);return newStream.fd}case 1:case 2:return 0;case 3:return stream.flags;case 4:{var arg=syscallGetVarargI();stream.flags|=arg;return 0}case 12:{var arg=syscallGetVarargP();var offset=0;HEAP16[arg+offset>>1]=2;return 0}case 13:case 14:return 0}return-28}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}function ___syscall_fstat64(fd,buf){try{var stream=SYSCALLS.getStreamFromFD(fd);return SYSCALLS.doStat(FS.stat,stream.path,buf)}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}var convertI32PairToI53Checked=(lo,hi)=>hi+2097152>>>0<4194305-!!lo?(lo>>>0)+hi*4294967296:NaN;function ___syscall_ftruncate64(fd,length_low,length_high){var length=convertI32PairToI53Checked(length_low,length_high);try{if(isNaN(length))return 61;FS.ftruncate(fd,length);return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}var stringToUTF8=(str,outPtr,maxBytesToWrite)=>stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite);function ___syscall_getcwd(buf,size){try{if(size===0)return-28;var cwd=FS.cwd();var cwdLengthInBytes=lengthBytesUTF8(cwd)+1;if(size<cwdLengthInBytes)return-68;stringToUTF8(cwd,buf,size);return cwdLengthInBytes}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}function ___syscall_getdents64(fd,dirp,count){try{var stream=SYSCALLS.getStreamFromFD(fd);stream.getdents||=FS.readdir(stream.path);var struct_size=280;var pos=0;var off=FS.llseek(stream,0,1);var idx=Math.floor(off/struct_size);while(idx<stream.getdents.length&&pos+struct_size<=count){var id;var type;var name=stream.getdents[idx];if(name==="."){id=stream.node.id;type=4}else if(name===".."){var lookup=FS.lookupPath(stream.path,{parent:true});id=lookup.node.id;type=4}else{var child=FS.lookupNode(stream.node,name);id=child.id;type=FS.isChrdev(child.mode)?2:FS.isDir(child.mode)?4:FS.isLink(child.mode)?10:8}tempI64=[id>>>0,(tempDouble=id,+Math.abs(tempDouble)>=1?tempDouble>0?+Math.floor(tempDouble/4294967296)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[dirp+pos>>2]=tempI64[0],HEAP32[dirp+pos+4>>2]=tempI64[1];tempI64=[(idx+1)*struct_size>>>0,(tempDouble=(idx+1)*struct_size,+Math.abs(tempDouble)>=1?tempDouble>0?+Math.floor(tempDouble/4294967296)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[dirp+pos+8>>2]=tempI64[0],HEAP32[dirp+pos+12>>2]=tempI64[1];HEAP16[dirp+pos+16>>1]=280;HEAP8[dirp+pos+18]=type;stringToUTF8(name,dirp+pos+19,256);pos+=struct_size;idx+=1}FS.llseek(stream,idx*struct_size,0);return pos}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}function ___syscall_ioctl(fd,op,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(fd);switch(op){case 21509:{if(!stream.tty)return-59;return 0}case 21505:{if(!stream.tty)return-59;if(stream.tty.ops.ioctl_tcgets){var termios=stream.tty.ops.ioctl_tcgets(stream);var argp=syscallGetVarargP();HEAP32[argp>>2]=termios.c_iflag||0;HEAP32[argp+4>>2]=termios.c_oflag||0;HEAP32[argp+8>>2]=termios.c_cflag||0;HEAP32[argp+12>>2]=termios.c_lflag||0;for(var i=0;i<32;i++){HEAP8[argp+i+17]=termios.c_cc[i]||0}return 0}return 0}case 21510:case 21511:case 21512:{if(!stream.tty)return-59;return 0}case 21506:case 21507:case 21508:{if(!stream.tty)return-59;if(stream.tty.ops.ioctl_tcsets){var argp=syscallGetVarargP();var c_iflag=HEAP32[argp>>2];var c_oflag=HEAP32[argp+4>>2];var c_cflag=HEAP32[argp+8>>2];var c_lflag=HEAP32[argp+12>>2];var c_cc=[];for(var i=0;i<32;i++){c_cc.push(HEAP8[argp+i+17])}return stream.tty.ops.ioctl_tcsets(stream.tty,op,{c_iflag:c_iflag,c_oflag:c_oflag,c_cflag:c_cflag,c_lflag:c_lflag,c_cc:c_cc})}return 0}case 21519:{if(!stream.tty)return-59;var argp=syscallGetVarargP();HEAP32[argp>>2]=0;return 0}case 21520:{if(!stream.tty)return-59;return-28}case 21531:{var argp=syscallGetVarargP();return FS.ioctl(stream,op,argp)}case 21523:{if(!stream.tty)return-59;if(stream.tty.ops.ioctl_tiocgwinsz){var winsize=stream.tty.ops.ioctl_tiocgwinsz(stream.tty);var argp=syscallGetVarargP();HEAP16[argp>>1]=winsize[0];HEAP16[argp+2>>1]=winsize[1]}return 0}case 21524:{if(!stream.tty)return-59;return 0}case 21515:{if(!stream.tty)return-59;return 0}default:return-28}}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}function ___syscall_lstat64(path,buf){try{path=SYSCALLS.getStr(path);return SYSCALLS.doStat(FS.lstat,path,buf)}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}function ___syscall_mkdirat(dirfd,path,mode){try{path=SYSCALLS.getStr(path);path=SYSCALLS.calculateAt(dirfd,path);path=PATH.normalize(path);if(path[path.length-1]==="/")path=path.substr(0,path.length-1);FS.mkdir(path,mode,0);return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}function ___syscall_newfstatat(dirfd,path,buf,flags){try{path=SYSCALLS.getStr(path);var nofollow=flags&256;var allowEmpty=flags&4096;flags=flags&~6400;path=SYSCALLS.calculateAt(dirfd,path,allowEmpty);return SYSCALLS.doStat(nofollow?FS.lstat:FS.stat,path,buf)}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}function ___syscall_openat(dirfd,path,flags,varargs){SYSCALLS.varargs=varargs;try{path=SYSCALLS.getStr(path);path=SYSCALLS.calculateAt(dirfd,path);var mode=varargs?syscallGetVarargI():0;return FS.open(path,flags,mode).fd}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}function ___syscall_readlinkat(dirfd,path,buf,bufsize){try{path=SYSCALLS.getStr(path);path=SYSCALLS.calculateAt(dirfd,path);if(bufsize<=0)return-28;var ret=FS.readlink(path);var len=Math.min(bufsize,lengthBytesUTF8(ret));var endChar=HEAP8[buf+len];stringToUTF8(ret,buf,bufsize+1);HEAP8[buf+len]=endChar;return len}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}function ___syscall_rmdir(path){try{path=SYSCALLS.getStr(path);FS.rmdir(path);return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}function ___syscall_stat64(path,buf){try{path=SYSCALLS.getStr(path);return SYSCALLS.doStat(FS.stat,path,buf)}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}function ___syscall_unlinkat(dirfd,path,flags){try{path=SYSCALLS.getStr(path);path=SYSCALLS.calculateAt(dirfd,path);if(flags===0){FS.unlink(path)}else if(flags===512){FS.rmdir(path)}else{abort("Invalid flags passed to unlinkat")}return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}var readI53FromI64=ptr=>HEAPU32[ptr>>2]+HEAP32[ptr+4>>2]*4294967296;function ___syscall_utimensat(dirfd,path,times,flags){try{path=SYSCALLS.getStr(path);path=SYSCALLS.calculateAt(dirfd,path,true);if(!times){var atime=Date.now();var mtime=atime}else{var seconds=readI53FromI64(times);var nanoseconds=HEAP32[times+8>>2];atime=seconds*1e3+nanoseconds/(1e3*1e3);times+=16;seconds=readI53FromI64(times);nanoseconds=HEAP32[times+8>>2];mtime=seconds*1e3+nanoseconds/(1e3*1e3)}FS.utime(path,atime,mtime);return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}var __abort_js=()=>{abort("")};var nowIsMonotonic=1;var __emscripten_get_now_is_monotonic=()=>nowIsMonotonic;var __emscripten_memcpy_js=(dest,src,num)=>HEAPU8.copyWithin(dest,src,src+num);function __gmtime_js(time_low,time_high,tmPtr){var time=convertI32PairToI53Checked(time_low,time_high);var date=new Date(time*1e3);HEAP32[tmPtr>>2]=date.getUTCSeconds();HEAP32[tmPtr+4>>2]=date.getUTCMinutes();HEAP32[tmPtr+8>>2]=date.getUTCHours();HEAP32[tmPtr+12>>2]=date.getUTCDate();HEAP32[tmPtr+16>>2]=date.getUTCMonth();HEAP32[tmPtr+20>>2]=date.getUTCFullYear()-1900;HEAP32[tmPtr+24>>2]=date.getUTCDay();var start=Date.UTC(date.getUTCFullYear(),0,1,0,0,0,0);var yday=(date.getTime()-start)/(1e3*60*60*24)|0;HEAP32[tmPtr+28>>2]=yday}var isLeapYear=year=>year%4===0&&(year%100!==0||year%400===0);var MONTH_DAYS_LEAP_CUMULATIVE=[0,31,60,91,121,152,182,213,244,274,305,335];var MONTH_DAYS_REGULAR_CUMULATIVE=[0,31,59,90,120,151,181,212,243,273,304,334];var ydayFromDate=date=>{var leap=isLeapYear(date.getFullYear());var monthDaysCumulative=leap?MONTH_DAYS_LEAP_CUMULATIVE:MONTH_DAYS_REGULAR_CUMULATIVE;var yday=monthDaysCumulative[date.getMonth()]+date.getDate()-1;return yday};function __localtime_js(time_low,time_high,tmPtr){var time=convertI32PairToI53Checked(time_low,time_high);var date=new Date(time*1e3);HEAP32[tmPtr>>2]=date.getSeconds();HEAP32[tmPtr+4>>2]=date.getMinutes();HEAP32[tmPtr+8>>2]=date.getHours();HEAP32[tmPtr+12>>2]=date.getDate();HEAP32[tmPtr+16>>2]=date.getMonth();HEAP32[tmPtr+20>>2]=date.getFullYear()-1900;HEAP32[tmPtr+24>>2]=date.getDay();var yday=ydayFromDate(date)|0;HEAP32[tmPtr+28>>2]=yday;HEAP32[tmPtr+36>>2]=-(date.getTimezoneOffset()*60);var start=new Date(date.getFullYear(),0,1);var summerOffset=new Date(date.getFullYear(),6,1).getTimezoneOffset();var winterOffset=start.getTimezoneOffset();var dst=(summerOffset!=winterOffset&&date.getTimezoneOffset()==Math.min(winterOffset,summerOffset))|0;HEAP32[tmPtr+32>>2]=dst}function __mmap_js(len,prot,flags,fd,offset_low,offset_high,allocated,addr){var offset=convertI32PairToI53Checked(offset_low,offset_high);try{if(isNaN(offset))return 61;var stream=SYSCALLS.getStreamFromFD(fd);var res=FS.mmap(stream,len,offset,prot,flags);var ptr=res.ptr;HEAP32[allocated>>2]=res.allocated;HEAPU32[addr>>2]=ptr;return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}function __munmap_js(addr,len,prot,flags,fd,offset_low,offset_high){var offset=convertI32PairToI53Checked(offset_low,offset_high);try{var stream=SYSCALLS.getStreamFromFD(fd);if(prot&2){SYSCALLS.doMsync(addr,stream,len,flags,offset)}}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}var setTempRet0=val=>__emscripten_tempret_set(val);var __timegm_js=function(tmPtr){var ret=(()=>{var time=Date.UTC(HEAP32[tmPtr+20>>2]+1900,HEAP32[tmPtr+16>>2],HEAP32[tmPtr+12>>2],HEAP32[tmPtr+8>>2],HEAP32[tmPtr+4>>2],HEAP32[tmPtr>>2],0);var date=new Date(time);HEAP32[tmPtr+24>>2]=date.getUTCDay();var start=Date.UTC(date.getUTCFullYear(),0,1,0,0,0,0);var yday=(date.getTime()-start)/(1e3*60*60*24)|0;HEAP32[tmPtr+28>>2]=yday;return date.getTime()/1e3})();return setTempRet0((tempDouble=ret,+Math.abs(tempDouble)>=1?tempDouble>0?+Math.floor(tempDouble/4294967296)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)),ret>>>0};var __tzset_js=(timezone,daylight,std_name,dst_name)=>{var currentYear=(new Date).getFullYear();var winter=new Date(currentYear,0,1);var summer=new Date(currentYear,6,1);var winterOffset=winter.getTimezoneOffset();var summerOffset=summer.getTimezoneOffset();var stdTimezoneOffset=Math.max(winterOffset,summerOffset);HEAPU32[timezone>>2]=stdTimezoneOffset*60;HEAP32[daylight>>2]=Number(winterOffset!=summerOffset);var extractZone=date=>date.toLocaleTimeString(undefined,{hour12:false,timeZoneName:"short"}).split(" ")[1];var winterName=extractZone(winter);var summerName=extractZone(summer);if(summerOffset<winterOffset){stringToUTF8(winterName,std_name,17);stringToUTF8(summerName,dst_name,17)}else{stringToUTF8(winterName,dst_name,17);stringToUTF8(summerName,std_name,17)}};function _decrypt(bufIn,sizeIn,bufOut,sizeOut){var handler=Module.Client.getDecryptionHandler();if(handler&&Module._dvlDerivedKey){var iv=Module.HEAPU8.subarray(bufIn,bufIn+16);var input=Module.HEAPU8.subarray(bufIn+16,bufIn+sizeIn);var decrypted=handler.decrypt(Module._dvlDerivedKey,iv,input);if(decrypted&&decrypted.length!==0&&decrypted.length<=sizeOut){Module.HEAPU8.set(decrypted,bufOut);return decrypted.length}}return 0}function _derive_key(salt,password){function strlen(ptr){var i=0;while(Module.HEAPU8[ptr+i>>0]!==0){i++}return i}var handler=Module.Client.getDecryptionHandler();if(handler){var saltArray=Module.HEAPU8.subarray(salt,salt+16);var passwordArray=Module.HEAPU8.subarray(password,password+strlen(password));Module._dvlDerivedKey=handler.deriveKey(saltArray,passwordArray);return!!Module._dvlDerivedKey}return false}var readEmAsmArgsArray=[];var readEmAsmArgs=(sigPtr,buf)=>{readEmAsmArgsArray.length=0;var ch;while(ch=HEAPU8[sigPtr++]){var wide=ch!=105;wide&=ch!=112;buf+=wide&&buf%8?4:0;readEmAsmArgsArray.push(ch==112?HEAPU32[buf>>2]:ch==105?HEAP32[buf>>2]:HEAPF64[buf>>3]);buf+=wide?8:4}return readEmAsmArgsArray};var runEmAsmFunction=(code,sigPtr,argbuf)=>{var args=readEmAsmArgs(sigPtr,argbuf);return ASM_CONSTS[code](...args)};var _emscripten_asm_const_int=(code,sigPtr,argbuf)=>runEmAsmFunction(code,sigPtr,argbuf);var _emscripten_date_now=()=>Date.now();var getHeapMax=()=>2147483648;var _emscripten_get_heap_max=()=>getHeapMax();var growMemory=size=>{var b=wasmMemory.buffer;var pages=(size-b.byteLength+65535)/65536;try{wasmMemory.grow(pages);updateMemoryViews();return 1}catch(e){}};var _emscripten_resize_heap=requestedSize=>{var oldSize=HEAPU8.length;requestedSize>>>=0;var maxHeapSize=getHeapMax();if(requestedSize>maxHeapSize){return false}var alignUp=(x,multiple)=>x+(multiple-x%multiple)%multiple;for(var cutDown=1;cutDown<=4;cutDown*=2){var overGrownHeapSize=oldSize*(1+.2/cutDown);overGrownHeapSize=Math.min(overGrownHeapSize,requestedSize+100663296);var newSize=Math.min(maxHeapSize,alignUp(Math.max(requestedSize,overGrownHeapSize),65536));var replacement=growMemory(newSize);if(replacement){return true}}return false};var ENV={};var getExecutableName=()=>thisProgram||"./this.program";var getEnvStrings=()=>{if(!getEnvStrings.strings){var lang=(typeof navigator=="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8";var env={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:lang,_:getExecutableName()};for(var x in ENV){if(ENV[x]===undefined)delete env[x];else env[x]=ENV[x]}var strings=[];for(var x in env){strings.push(`${x}=${env[x]}`)}getEnvStrings.strings=strings}return getEnvStrings.strings};var stringToAscii=(str,buffer)=>{for(var i=0;i<str.length;++i){HEAP8[buffer++]=str.charCodeAt(i)}HEAP8[buffer]=0};var _environ_get=(__environ,environ_buf)=>{var bufSize=0;getEnvStrings().forEach((string,i)=>{var ptr=environ_buf+bufSize;HEAPU32[__environ+i*4>>2]=ptr;stringToAscii(string,ptr);bufSize+=string.length+1});return 0};var _environ_sizes_get=(penviron_count,penviron_buf_size)=>{var strings=getEnvStrings();HEAPU32[penviron_count>>2]=strings.length;var bufSize=0;strings.forEach(string=>bufSize+=string.length+1);HEAPU32[penviron_buf_size>>2]=bufSize;return 0};function _fd_close(fd){try{var stream=SYSCALLS.getStreamFromFD(fd);FS.close(stream);return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return e.errno}}function _fd_fdstat_get(fd,pbuf){try{var rightsBase=0;var rightsInheriting=0;var flags=0;{var stream=SYSCALLS.getStreamFromFD(fd);var type=stream.tty?2:FS.isDir(stream.mode)?3:FS.isLink(stream.mode)?7:4}HEAP8[pbuf]=type;HEAP16[pbuf+2>>1]=flags;tempI64=[rightsBase>>>0,(tempDouble=rightsBase,+Math.abs(tempDouble)>=1?tempDouble>0?+Math.floor(tempDouble/4294967296)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[pbuf+8>>2]=tempI64[0],HEAP32[pbuf+12>>2]=tempI64[1];tempI64=[rightsInheriting>>>0,(tempDouble=rightsInheriting,+Math.abs(tempDouble)>=1?tempDouble>0?+Math.floor(tempDouble/4294967296)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[pbuf+16>>2]=tempI64[0],HEAP32[pbuf+20>>2]=tempI64[1];return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return e.errno}}var doReadv=(stream,iov,iovcnt,offset)=>{var ret=0;for(var i=0;i<iovcnt;i++){var ptr=HEAPU32[iov>>2];var len=HEAPU32[iov+4>>2];iov+=8;var curr=FS.read(stream,HEAP8,ptr,len,offset);if(curr<0)return-1;ret+=curr;if(curr<len)break;if(typeof offset!="undefined"){offset+=curr}}return ret};function _fd_read(fd,iov,iovcnt,pnum){try{var stream=SYSCALLS.getStreamFromFD(fd);var num=doReadv(stream,iov,iovcnt);HEAPU32[pnum>>2]=num;return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return e.errno}}function _fd_seek(fd,offset_low,offset_high,whence,newOffset){var offset=convertI32PairToI53Checked(offset_low,offset_high);try{if(isNaN(offset))return 61;var stream=SYSCALLS.getStreamFromFD(fd);FS.llseek(stream,offset,whence);tempI64=[stream.position>>>0,(tempDouble=stream.position,+Math.abs(tempDouble)>=1?tempDouble>0?+Math.floor(tempDouble/4294967296)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[newOffset>>2]=tempI64[0],HEAP32[newOffset+4>>2]=tempI64[1];if(stream.getdents&&offset===0&&whence===0)stream.getdents=null;return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return e.errno}}function _fd_sync(fd){try{var stream=SYSCALLS.getStreamFromFD(fd);if(stream.stream_ops?.fsync){return stream.stream_ops.fsync(stream)}return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return e.errno}}var doWritev=(stream,iov,iovcnt,offset)=>{var ret=0;for(var i=0;i<iovcnt;i++){var ptr=HEAPU32[iov>>2];var len=HEAPU32[iov+4>>2];iov+=8;var curr=FS.write(stream,HEAP8,ptr,len,offset);if(curr<0)return-1;ret+=curr;if(typeof offset!="undefined"){offset+=curr}}return ret};function _fd_write(fd,iov,iovcnt,pnum){try{var stream=SYSCALLS.getStreamFromFD(fd);var num=doWritev(stream,iov,iovcnt);HEAPU32[pnum>>2]=num;return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return e.errno}}var VSM={Property:{StateMask:{Offset:0,Type:"i32"},NodeFlags:{Mask:1,Offset:4,Type:"i32"},NodeFlagsMask:{Offset:8,Type:"i32"},Opacity:{Mask:2,Offset:12,Type:"float"},HighlightColor:{Mask:4,Offset:16,Type:"i32"}},data:[],getByDvlVsm:function(dvlVsm){for(var data=VSM.data,i=0,count=data.length;i<count;++i){if(data[i].dvlVsm===dvlVsm){return data[i]}}return null},getByNativeVsm:function(nativeVsm){for(var data=VSM.data,i=0,count=data.length;i<count;++i){if(data[i].nativeVsm===nativeVsm){return data[i]}}return null},getByRenderer:function(renderer){for(var data=VSM.data,i=0,count=data.length;i<count;++i){if(data[i].dvlRenderers.indexOf(renderer)>=0){return data[i]}}return null},add:function(nativeVsm,dvlVsm,renderer){var item=VSM.getByNativeVsm(nativeVsm);if(item){if(item.dvlRenderers.indexOf(renderer)<0){item.dvlRenderers.push(renderer)}}else{VSM.data.push({nativeVsm:nativeVsm,dvlVsm:dvlVsm,dvlRenderers:[renderer]})}},deleteRenderer:function(renderer){for(var data=VSM.data,i=0,count=data.length;i<count;++i){var rendererIndex=data[i].dvlRenderers.indexOf(renderer);if(rendererIndex>=0){if(data[i].dvlRenderers.length===1){if(data[i].nativeVsm){data[i].nativeVsm.detachVisibilityChanged(VSM.handleVisibilityChanged,VSM);data[i].nativeVsm.detachSelectionChanged(VSM.handleSelectionChanged,VSM);data[i].nativeVsm.detachOpacityChanged(VSM.handleOpacityChanged,VSM);data[i].nativeVsm.detachTintColorChanged(VSM.handleTintColorChanged,VSM)}Module.ccall("jDVL_DeleteViewStateManager",null,["number"],[data[i].dvlVsm]);data.splice(i,1)}else{data[i].dvlRenderers.splice(rendererIndex,1)}return}}},getProperty:function(buffer,property){return getValue(buffer+property.Offset,property.Type)},setProperty:function(buffer,property,value){setValue(buffer+property.Offset,value,property.Type)},handleVisibilityChanged:function(event){var nativeVsm=event.getSource(),item=VSM.getByNativeVsm(nativeVsm);if(item){var dvlVsm=item.dvlVsm;visible=event.getParameter("visible"),hidden=event.getParameter("hidden");visible.forEach(function(nodeId){var id=stringIdToPtr(nodeId);Module.ccall("jDVL_FireNodeVisibilityChanged",null,["number","number","boolean"],[dvlVsm,id,true])});hidden.forEach(function(nodeId){var id=stringIdToPtr(nodeId);Module.ccall("jDVL_FireNodeVisibilityChanged",null,["number","number","boolean"],[dvlVsm,id,false])})}},handleSelectionChanged:function(event){var nativeVsm=event.getSource(),item=VSM.getByNativeVsm(nativeVsm);if(item){var dvlVsm=item.dvlVsm;selected=event.getParameter("selected"),unselected=event.getParameter("unselected");selected.forEach(function(nodeId){var id=stringIdToPtr(nodeId);Module.ccall("jDVL_FireNodeSelectionChanged",null,["number","number","boolean"],[dvlVsm,id,true])});unselected.forEach(function(nodeId){var id=stringIdToPtr(nodeId);Module.ccall("jDVL_FireNodeSelectionChanged",null,["number","number","boolean"],[dvlVsm,id,false])})}},handleOpacityChanged:function(event){var nativeVsm=event.getSource(),item=VSM.getByNativeVsm(nativeVsm);if(item){var dvlVsm=item.dvlVsm;changed=event.getParameter("changed"),opacity=event.getParameter("opacity");changed.forEach(function(nodeId){var id=stringIdToPtr(nodeId);Module.ccall("jDVL_FireNodeOpacityChanged",null,["number","number","number"],[dvlVsm,id,opacity])})}},handleTintColorChanged:function(event){var nativeVsm=event.getSource(),item=VSM.getByNativeVsm(nativeVsm);if(item){var dvlVsm=item.dvlVsm;changed=event.getParameter("changed"),highlightColor=event.getParameter("tintColorABGR");changed.forEach(function(nodeId){var id=stringIdToPtr(nodeId);Module.ccall("jDVL_FireNodeHighlightColorChanged",null,["number","number","number"],[dvlVsm,id,highlightColor])})}}};function repeatString(string,count){if(string.length===0){return""}var result="";while(true){if(count&1){result+=string}count>>>=1;if(count===0){break}string+=string}return result}function padStart(string,targetLength,padString){return repeatString(padString||" ",Math.max(0,targetLength-string.length))+string}function ptrToStringId(ptrOrDvlId,prefix){return prefix+"ffffffff"+padStart(ptrOrDvlId.toString(16),8,"0")}function nodeIdToStringId(nodeId){return ptrToStringId(nodeId,"i")}function stringIdToPtr(str){return parseInt(str.substr(9),16)}function setViewStateManager(rendererId,nativeVsm){var renderer=stringIdToPtr(rendererId),result;if(nativeVsm){var item=VSM.getByNativeVsm(nativeVsm),dvlVsm=item&&item.dvlVsm;if(!item){dvlVsm=Module.ccall("jDVL_CreateViewStateManager","number",[],[]);nativeVsm.attachVisibilityChanged(VSM.handleVisibilityChanged,VSM);nativeVsm.attachSelectionChanged(VSM.handleSelectionChanged,VSM);nativeVsm.attachOpacityChanged(VSM.handleOpacityChanged,VSM);nativeVsm.attachTintColorChanged(VSM.handleTintColorChanged,VSM)}VSM.add(nativeVsm,dvlVsm,renderer);result=Module.ccall("jDVLRenderer_SetViewStateManager","number",["number","number"],[renderer,dvlVsm])}else{result=Module.ccall("jDVLRenderer_SetViewStateManager","number",["number","number"],[renderer,0]);VSM.deleteRenderer(renderer)}return result}function _getNodeState(dvlViewStateManager,nodeId,state){var item=VSM.getByDvlVsm(dvlViewStateManager),nativeVsm=item?item.nativeVsm:null,newStateMask=0;if(nativeVsm){var stateMask=VSM.getProperty(state,VSM.Property.StateMask),id=nodeIdToStringId(nodeId);if(stateMask&VSM.Property.NodeFlags.Mask){var nodeFlagsMask=VSM.getProperty(state,VSM.Property.NodeFlagsMask),nodeFlags=(nativeVsm.getImplementation&&nativeVsm.getImplementation()||nativeVsm)._getFlags(id,nodeFlagsMask);if(nodeFlags===null){VSM.setProperty(state,VSM.Property.NodeFlagsMask,0)}else{newStateMask|=VSM.Property.NodeFlags.Mask;VSM.setProperty(state,VSM.Property.NodeFlags,nodeFlags)}}if(stateMask&VSM.Property.Opacity.Mask){var opacity=nativeVsm.getOpacity(id);if(opacity!==null){newStateMask|=VSM.Property.Opacity.Mask;VSM.setProperty(state,VSM.Property.Opacity,opacity)}}if(stateMask&VSM.Property.HighlightColor.Mask){var highlightColor=(nativeVsm.getImplementation&&nativeVsm.getImplementation()||nativeVsm)._getTintColorABGR(id);if(highlightColor!==null){newStateMask|=VSM.Property.HighlightColor.Mask;VSM.setProperty(state,VSM.Property.HighlightColor,highlightColor)}}}VSM.setProperty(state,VSM.Property.StateMask,newStateMask)}var _getentropy=(buffer,size)=>{randomFill(HEAPU8.subarray(buffer,buffer+size));return 0};var webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance=ctx=>!!(ctx.dibvbi=ctx.getExtension("WEBGL_draw_instanced_base_vertex_base_instance"));var webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance=ctx=>!!(ctx.mdibvbi=ctx.getExtension("WEBGL_multi_draw_instanced_base_vertex_base_instance"));var webgl_enable_WEBGL_multi_draw=ctx=>!!(ctx.multiDrawWebgl=ctx.getExtension("WEBGL_multi_draw"));var getEmscriptenSupportedExtensions=ctx=>{var supportedExtensions=["EXT_color_buffer_float","EXT_conservative_depth","EXT_disjoint_timer_query_webgl2","EXT_texture_norm16","NV_shader_noperspective_interpolation","WEBGL_clip_cull_distance","EXT_color_buffer_half_float","EXT_depth_clamp","EXT_float_blend","EXT_texture_compression_bptc","EXT_texture_compression_rgtc","EXT_texture_filter_anisotropic","KHR_parallel_shader_compile","OES_texture_float_linear","WEBGL_blend_func_extended","WEBGL_compressed_texture_astc","WEBGL_compressed_texture_etc","WEBGL_compressed_texture_etc1","WEBGL_compressed_texture_s3tc","WEBGL_compressed_texture_s3tc_srgb","WEBGL_debug_renderer_info","WEBGL_debug_shaders","WEBGL_lose_context","WEBGL_multi_draw"];return(ctx.getSupportedExtensions()||[]).filter(ext=>supportedExtensions.includes(ext))};var GL={counter:1,buffers:[],programs:[],framebuffers:[],renderbuffers:[],textures:[],shaders:[],vaos:[],contexts:[],offscreenCanvases:{},queries:[],samplers:[],transformFeedbacks:[],syncs:[],stringCache:{},stringiCache:{},unpackAlignment:4,recordError:errorCode=>{if(!GL.lastError){GL.lastError=errorCode}},getNewId:table=>{var ret=GL.counter++;for(var i=table.length;i<ret;i++){table[i]=null}return ret},genObject:(n,buffers,createFunction,objectTable)=>{for(var i=0;i<n;i++){var buffer=GLctx[createFunction]();var id=buffer&&GL.getNewId(objectTable);if(buffer){buffer.name=id;objectTable[id]=buffer}else{GL.recordError(1282)}HEAP32[buffers+i*4>>2]=id}},getSource:(shader,count,string,length)=>{var source="";for(var i=0;i<count;++i){var len=length?HEAPU32[length+i*4>>2]:undefined;source+=UTF8ToString(HEAPU32[string+i*4>>2],len)}return source},createContext:(canvas,webGLContextAttributes)=>{if(!canvas.getContextSafariWebGL2Fixed){canvas.getContextSafariWebGL2Fixed=canvas.getContext;function fixedGetContext(ver,attrs){var gl=canvas.getContextSafariWebGL2Fixed(ver,attrs);return ver=="webgl"==gl instanceof WebGLRenderingContext?gl:null}canvas.getContext=fixedGetContext}var ctx=canvas.getContext("webgl2",webGLContextAttributes);if(!ctx)return 0;var handle=GL.registerContext(ctx,webGLContextAttributes);return handle},registerContext:(ctx,webGLContextAttributes)=>{var handle=GL.getNewId(GL.contexts);var context={handle:handle,attributes:webGLContextAttributes,version:webGLContextAttributes.majorVersion,GLctx:ctx};if(ctx.canvas)ctx.canvas.GLctxObject=context;GL.contexts[handle]=context;if(typeof webGLContextAttributes.enableExtensionsByDefault=="undefined"||webGLContextAttributes.enableExtensionsByDefault){GL.initExtensions(context)}return handle},makeContextCurrent:contextHandle=>{GL.currentContext=GL.contexts[contextHandle];Module.ctx=GLctx=GL.currentContext?.GLctx;return!(contextHandle&&!GLctx)},getContext:contextHandle=>GL.contexts[contextHandle],deleteContext:contextHandle=>{if(GL.currentContext===GL.contexts[contextHandle]){GL.currentContext=null}if(typeof JSEvents=="object"){JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas)}if(GL.contexts[contextHandle]&&GL.contexts[contextHandle].GLctx.canvas){GL.contexts[contextHandle].GLctx.canvas.GLctxObject=undefined}GL.contexts[contextHandle]=null},initExtensions:context=>{context||=GL.currentContext;if(context.initExtensionsDone)return;context.initExtensionsDone=true;var GLctx=context.GLctx;webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(GLctx);webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(GLctx);if(context.version>=2){GLctx.disjointTimerQueryExt=GLctx.getExtension("EXT_disjoint_timer_query_webgl2")}if(context.version<2||!GLctx.disjointTimerQueryExt){GLctx.disjointTimerQueryExt=GLctx.getExtension("EXT_disjoint_timer_query")}webgl_enable_WEBGL_multi_draw(GLctx);getEmscriptenSupportedExtensions(GLctx).forEach(ext=>{if(!ext.includes("lose_context")&&!ext.includes("debug")){GLctx.getExtension(ext)}})}};var _glActiveTexture=x0=>GLctx.activeTexture(x0);var _glAttachShader=(program,shader)=>{GLctx.attachShader(GL.programs[program],GL.shaders[shader])};var _glBindBuffer=(target,buffer)=>{if(target==35051){GLctx.currentPixelPackBufferBinding=buffer}else if(target==35052){GLctx.currentPixelUnpackBufferBinding=buffer}GLctx.bindBuffer(target,GL.buffers[buffer])};var _glBindFramebuffer=(target,framebuffer)=>{GLctx.bindFramebuffer(target,GL.framebuffers[framebuffer])};var _glBindRenderbuffer=(target,renderbuffer)=>{GLctx.bindRenderbuffer(target,GL.renderbuffers[renderbuffer])};var _glBindTexture=(target,texture)=>{GLctx.bindTexture(target,GL.textures[texture])};var _glBlendFuncSeparate=(x0,x1,x2,x3)=>GLctx.blendFuncSeparate(x0,x1,x2,x3);var _glBufferData=(target,size,data,usage)=>{if(true){if(data&&size){GLctx.bufferData(target,HEAPU8,usage,data,size)}else{GLctx.bufferData(target,size,usage)}return}GLctx.bufferData(target,data?HEAPU8.subarray(data,data+size):size,usage)};var _glBufferSubData=(target,offset,size,data)=>{if(true){size&&GLctx.bufferSubData(target,offset,HEAPU8,data,size);return}GLctx.bufferSubData(target,offset,HEAPU8.subarray(data,data+size))};var _glCheckFramebufferStatus=x0=>GLctx.checkFramebufferStatus(x0);var _glClear=x0=>GLctx.clear(x0);var _glClearColor=(x0,x1,x2,x3)=>GLctx.clearColor(x0,x1,x2,x3);var _glClearDepthf=x0=>GLctx.clearDepth(x0);var _glColorMask=(red,green,blue,alpha)=>{GLctx.colorMask(!!red,!!green,!!blue,!!alpha)};var _glCompileShader=shader=>{GLctx.compileShader(GL.shaders[shader])};var _glCreateProgram=()=>{var id=GL.getNewId(GL.programs);var program=GLctx.createProgram();program.name=id;program.maxUniformLength=program.maxAttributeLength=program.maxUniformBlockNameLength=0;program.uniformIdCounter=1;GL.programs[id]=program;return id};var _glCreateShader=shaderType=>{var id=GL.getNewId(GL.shaders);GL.shaders[id]=GLctx.createShader(shaderType);return id};var _glDeleteBuffers=(n,buffers)=>{for(var i=0;i<n;i++){var id=HEAP32[buffers+i*4>>2];var buffer=GL.buffers[id];if(!buffer)continue;GLctx.deleteBuffer(buffer);buffer.name=0;GL.buffers[id]=null;if(id==GLctx.currentPixelPackBufferBinding)GLctx.currentPixelPackBufferBinding=0;if(id==GLctx.currentPixelUnpackBufferBinding)GLctx.currentPixelUnpackBufferBinding=0}};var _glDeleteFramebuffers=(n,framebuffers)=>{for(var i=0;i<n;++i){var id=HEAP32[framebuffers+i*4>>2];var framebuffer=GL.framebuffers[id];if(!framebuffer)continue;GLctx.deleteFramebuffer(framebuffer);framebuffer.name=0;GL.framebuffers[id]=null}};var _glDeleteProgram=id=>{if(!id)return;var program=GL.programs[id];if(!program){GL.recordError(1281);return}GLctx.deleteProgram(program);program.name=0;GL.programs[id]=null};var _glDeleteRenderbuffers=(n,renderbuffers)=>{for(var i=0;i<n;i++){var id=HEAP32[renderbuffers+i*4>>2];var renderbuffer=GL.renderbuffers[id];if(!renderbuffer)continue;GLctx.deleteRenderbuffer(renderbuffer);renderbuffer.name=0;GL.renderbuffers[id]=null}};var _glDeleteShader=id=>{if(!id)return;var shader=GL.shaders[id];if(!shader){GL.recordError(1281);return}GLctx.deleteShader(shader);GL.shaders[id]=null};var _glDeleteTextures=(n,textures)=>{for(var i=0;i<n;i++){var id=HEAP32[textures+i*4>>2];var texture=GL.textures[id];if(!texture)continue;GLctx.deleteTexture(texture);texture.name=0;GL.textures[id]=null}};var _glDepthFunc=x0=>GLctx.depthFunc(x0);var _glDepthMask=flag=>{GLctx.depthMask(!!flag)};var _glDisable=x0=>GLctx.disable(x0);var _glDisableVertexAttribArray=index=>{GLctx.disableVertexAttribArray(index)};var _glDrawArrays=(mode,first,count)=>{GLctx.drawArrays(mode,first,count)};var _glDrawElements=(mode,count,type,indices)=>{GLctx.drawElements(mode,count,type,indices)};var _glEnable=x0=>GLctx.enable(x0);var _glEnableVertexAttribArray=index=>{GLctx.enableVertexAttribArray(index)};var _glFramebufferRenderbuffer=(target,attachment,renderbuffertarget,renderbuffer)=>{GLctx.framebufferRenderbuffer(target,attachment,renderbuffertarget,GL.renderbuffers[renderbuffer])};var _glFramebufferTexture2D=(target,attachment,textarget,texture,level)=>{GLctx.framebufferTexture2D(target,attachment,textarget,GL.textures[texture],level)};var _glFrontFace=x0=>GLctx.frontFace(x0);var _glGenBuffers=(n,buffers)=>{GL.genObject(n,buffers,"createBuffer",GL.buffers)};var _glGenFramebuffers=(n,ids)=>{GL.genObject(n,ids,"createFramebuffer",GL.framebuffers)};var _glGenRenderbuffers=(n,renderbuffers)=>{GL.genObject(n,renderbuffers,"createRenderbuffer",GL.renderbuffers)};var _glGenTextures=(n,textures)=>{GL.genObject(n,textures,"createTexture",GL.textures)};var _glGenerateMipmap=x0=>GLctx.generateMipmap(x0);var _glGetAttribLocation=(program,name)=>GLctx.getAttribLocation(GL.programs[program],UTF8ToString(name));var _glGetError=()=>{var error=GLctx.getError()||GL.lastError;GL.lastError=0;return error};var writeI53ToI64=(ptr,num)=>{HEAPU32[ptr>>2]=num;var lower=HEAPU32[ptr>>2];HEAPU32[ptr+4>>2]=(num-lower)/4294967296};var webglGetExtensions=function $webglGetExtensions(){var exts=getEmscriptenSupportedExtensions(GLctx);exts=exts.concat(exts.map(e=>"GL_"+e));return exts};var emscriptenWebGLGet=(name_,p,type)=>{if(!p){GL.recordError(1281);return}var ret=undefined;switch(name_){case 36346:ret=1;break;case 36344:if(type!=0&&type!=1){GL.recordError(1280)}return;case 34814:case 36345:ret=0;break;case 34466:var formats=GLctx.getParameter(34467);ret=formats?formats.length:0;break;case 33309:if(GL.currentContext.version<2){GL.recordError(1282);return}ret=webglGetExtensions().length;break;case 33307:case 33308:if(GL.currentContext.version<2){GL.recordError(1280);return}ret=name_==33307?3:0;break}if(ret===undefined){var result=GLctx.getParameter(name_);switch(typeof result){case"number":ret=result;break;case"boolean":ret=result?1:0;break;case"string":GL.recordError(1280);return;case"object":if(result===null){switch(name_){case 34964:case 35725:case 34965:case 36006:case 36007:case 32873:case 34229:case 36662:case 36663:case 35053:case 35055:case 36010:case 35097:case 35869:case 32874:case 36389:case 35983:case 35368:case 34068:{ret=0;break}default:{GL.recordError(1280);return}}}else if(result instanceof Float32Array||result instanceof Uint32Array||result instanceof Int32Array||result instanceof Array){for(var i=0;i<result.length;++i){switch(type){case 0:HEAP32[p+i*4>>2]=result[i];break;case 2:HEAPF32[p+i*4>>2]=result[i];break;case 4:HEAP8[p+i]=result[i]?1:0;break}}return}else{try{ret=result.name|0}catch(e){GL.recordError(1280);err(`GL_INVALID_ENUM in glGet${type}v: Unknown object returned from WebGL getParameter(${name_})! (error: ${e})`);return}}break;default:GL.recordError(1280);err(`GL_INVALID_ENUM in glGet${type}v: Native code calling glGet${type}v(${name_}) and it returns ${result} of type ${typeof result}!`);return}}switch(type){case 1:writeI53ToI64(p,ret);break;case 0:HEAP32[p>>2]=ret;break;case 2:HEAPF32[p>>2]=ret;break;case 4:HEAP8[p]=ret?1:0;break}};var _glGetFloatv=(name_,p)=>emscriptenWebGLGet(name_,p,2);var _glGetIntegerv=(name_,p)=>emscriptenWebGLGet(name_,p,0);var _glGetProgramInfoLog=(program,maxLength,length,infoLog)=>{var log=GLctx.getProgramInfoLog(GL.programs[program]);if(log===null)log="(unknown error)";var numBytesWrittenExclNull=maxLength>0&&infoLog?stringToUTF8(log,infoLog,maxLength):0;if(length)HEAP32[length>>2]=numBytesWrittenExclNull};var _glGetProgramiv=(program,pname,p)=>{if(!p){GL.recordError(1281);return}if(program>=GL.counter){GL.recordError(1281);return}program=GL.programs[program];if(pname==35716){var log=GLctx.getProgramInfoLog(program);if(log===null)log="(unknown error)";HEAP32[p>>2]=log.length+1}else if(pname==35719){if(!program.maxUniformLength){for(var i=0;i<GLctx.getProgramParameter(program,35718);++i){program.maxUniformLength=Math.max(program.maxUniformLength,GLctx.getActiveUniform(program,i).name.length+1)}}HEAP32[p>>2]=program.maxUniformLength}else if(pname==35722){if(!program.maxAttributeLength){for(var i=0;i<GLctx.getProgramParameter(program,35721);++i){program.maxAttributeLength=Math.max(program.maxAttributeLength,GLctx.getActiveAttrib(program,i).name.length+1)}}HEAP32[p>>2]=program.maxAttributeLength}else if(pname==35381){if(!program.maxUniformBlockNameLength){for(var i=0;i<GLctx.getProgramParameter(program,35382);++i){program.maxUniformBlockNameLength=Math.max(program.maxUniformBlockNameLength,GLctx.getActiveUniformBlockName(program,i).length+1)}}HEAP32[p>>2]=program.maxUniformBlockNameLength}else{HEAP32[p>>2]=GLctx.getProgramParameter(program,pname)}};var _glGetShaderInfoLog=(shader,maxLength,length,infoLog)=>{var log=GLctx.getShaderInfoLog(GL.shaders[shader]);if(log===null)log="(unknown error)";var numBytesWrittenExclNull=maxLength>0&&infoLog?stringToUTF8(log,infoLog,maxLength):0;if(length)HEAP32[length>>2]=numBytesWrittenExclNull};var _glGetShaderiv=(shader,pname,p)=>{if(!p){GL.recordError(1281);return}if(pname==35716){var log=GLctx.getShaderInfoLog(GL.shaders[shader]);if(log===null)log="(unknown error)";var logLength=log?log.length+1:0;HEAP32[p>>2]=logLength}else if(pname==35720){var source=GLctx.getShaderSource(GL.shaders[shader]);var sourceLength=source?source.length+1:0;HEAP32[p>>2]=sourceLength}else{HEAP32[p>>2]=GLctx.getShaderParameter(GL.shaders[shader],pname)}};var stringToNewUTF8=str=>{var size=lengthBytesUTF8(str)+1;var ret=_malloc(size);if(ret)stringToUTF8(str,ret,size);return ret};var _glGetString=name_=>{var ret=GL.stringCache[name_];if(!ret){switch(name_){case 7939:ret=stringToNewUTF8(webglGetExtensions().join(" "));break;case 7936:case 7937:case 37445:case 37446:var s=GLctx.getParameter(name_);if(!s){GL.recordError(1280)}ret=s?stringToNewUTF8(s):0;break;case 7938:var glVersion=GLctx.getParameter(7938);if(true)glVersion=`OpenGL ES 3.0 (${glVersion})`;else{glVersion=`OpenGL ES 2.0 (${glVersion})`}ret=stringToNewUTF8(glVersion);break;case 35724:var glslVersion=GLctx.getParameter(35724);var ver_re=/^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;var ver_num=glslVersion.match(ver_re);if(ver_num!==null){if(ver_num[1].length==3)ver_num[1]=ver_num[1]+"0";glslVersion=`OpenGL ES GLSL ES ${ver_num[1]} (${glslVersion})`}ret=stringToNewUTF8(glslVersion);break;default:GL.recordError(1280)}GL.stringCache[name_]=ret}return ret};var jstoi_q=str=>parseInt(str);var webglGetLeftBracePos=name=>name.slice(-1)=="]"&&name.lastIndexOf("[");var webglPrepareUniformLocationsBeforeFirstUse=program=>{var uniformLocsById=program.uniformLocsById,uniformSizeAndIdsByName=program.uniformSizeAndIdsByName,i,j;if(!uniformLocsById){program.uniformLocsById=uniformLocsById={};program.uniformArrayNamesById={};for(i=0;i<GLctx.getProgramParameter(program,35718);++i){var u=GLctx.getActiveUniform(program,i);var nm=u.name;var sz=u.size;var lb=webglGetLeftBracePos(nm);var arrayName=lb>0?nm.slice(0,lb):nm;var id=program.uniformIdCounter;program.uniformIdCounter+=sz;uniformSizeAndIdsByName[arrayName]=[sz,id];for(j=0;j<sz;++j){uniformLocsById[id]=j;program.uniformArrayNamesById[id++]=arrayName}}}};var _glGetUniformLocation=(program,name)=>{name=UTF8ToString(name);if(program=GL.programs[program]){webglPrepareUniformLocationsBeforeFirstUse(program);var uniformLocsById=program.uniformLocsById;var arrayIndex=0;var uniformBaseName=name;var leftBrace=webglGetLeftBracePos(name);if(leftBrace>0){arrayIndex=jstoi_q(name.slice(leftBrace+1))>>>0;uniformBaseName=name.slice(0,leftBrace)}var sizeAndId=program.uniformSizeAndIdsByName[uniformBaseName];if(sizeAndId&&arrayIndex<sizeAndId[0]){arrayIndex+=sizeAndId[1];if(uniformLocsById[arrayIndex]=uniformLocsById[arrayIndex]||GLctx.getUniformLocation(program,name)){return arrayIndex}}}else{GL.recordError(1281)}return-1};var _glLineWidth=x0=>GLctx.lineWidth(x0);var _glLinkProgram=program=>{program=GL.programs[program];GLctx.linkProgram(program);program.uniformLocsById=0;program.uniformSizeAndIdsByName={}};var _glPolygonOffset=(x0,x1)=>GLctx.polygonOffset(x0,x1);var computeUnpackAlignedImageSize=(width,height,sizePerPixel,alignment)=>{function roundedToNextMultipleOf(x,y){return x+y-1&-y}var plainRowSize=width*sizePerPixel;var alignedRowSize=roundedToNextMultipleOf(plainRowSize,alignment);return height*alignedRowSize};var colorChannelsInGlTextureFormat=format=>{var colorChannels={5:3,6:4,8:2,29502:3,29504:4,26917:2,26918:2,29846:3,29847:4};return colorChannels[format-6402]||1};var heapObjectForWebGLType=type=>{type-=5120;if(type==0)return HEAP8;if(type==1)return HEAPU8;if(type==2)return HEAP16;if(type==4)return HEAP32;if(type==6)return HEAPF32;if(type==5||type==28922||type==28520||type==30779||type==30782)return HEAPU32;return HEAPU16};var toTypedArrayIndex=(pointer,heap)=>pointer>>>31-Math.clz32(heap.BYTES_PER_ELEMENT);var emscriptenWebGLGetTexPixelData=(type,format,width,height,pixels,internalFormat)=>{var heap=heapObjectForWebGLType(type);var sizePerPixel=colorChannelsInGlTextureFormat(format)*heap.BYTES_PER_ELEMENT;var bytes=computeUnpackAlignedImageSize(width,height,sizePerPixel,GL.unpackAlignment);return heap.subarray(toTypedArrayIndex(pixels,heap),toTypedArrayIndex(pixels+bytes,heap))};var _glReadPixels=(x,y,width,height,format,type,pixels)=>{if(true){if(GLctx.currentPixelPackBufferBinding){GLctx.readPixels(x,y,width,height,format,type,pixels);return}var heap=heapObjectForWebGLType(type);var target=toTypedArrayIndex(pixels,heap);GLctx.readPixels(x,y,width,height,format,type,heap,target);return}var pixelData=emscriptenWebGLGetTexPixelData(type,format,width,height,pixels,format);if(!pixelData){GL.recordError(1280);return}GLctx.readPixels(x,y,width,height,format,type,pixelData)};var _glRenderbufferStorage=(x0,x1,x2,x3)=>GLctx.renderbufferStorage(x0,x1,x2,x3);var _glScissor=(x0,x1,x2,x3)=>GLctx.scissor(x0,x1,x2,x3);var _glShaderSource=(shader,count,string,length)=>{var source=GL.getSource(shader,count,string,length);GLctx.shaderSource(GL.shaders[shader],source)};var _glStencilMask=x0=>GLctx.stencilMask(x0);var _glTexImage2D=(target,level,internalFormat,width,height,border,format,type,pixels)=>{if(true){if(GLctx.currentPixelUnpackBufferBinding){GLctx.texImage2D(target,level,internalFormat,width,height,border,format,type,pixels);return}if(pixels){var heap=heapObjectForWebGLType(type);var index=toTypedArrayIndex(pixels,heap);GLctx.texImage2D(target,level,internalFormat,width,height,border,format,type,heap,index);return}}var pixelData=pixels?emscriptenWebGLGetTexPixelData(type,format,width,height,pixels,internalFormat):null;GLctx.texImage2D(target,level,internalFormat,width,height,border,format,type,pixelData)};var _glTexParameterf=(x0,x1,x2)=>GLctx.texParameterf(x0,x1,x2);var _glTexParameteri=(x0,x1,x2)=>GLctx.texParameteri(x0,x1,x2);var webglGetUniformLocation=location=>{var p=GLctx.currentProgram;if(p){var webglLoc=p.uniformLocsById[location];if(typeof webglLoc=="number"){p.uniformLocsById[location]=webglLoc=GLctx.getUniformLocation(p,p.uniformArrayNamesById[location]+(webglLoc>0?`[${webglLoc}]`:""))}return webglLoc}else{GL.recordError(1282)}};var _glUniform1f=(location,v0)=>{GLctx.uniform1f(webglGetUniformLocation(location),v0)};var _glUniform1i=(location,v0)=>{GLctx.uniform1i(webglGetUniformLocation(location),v0)};var _glUniform2fv=(location,count,value)=>{count&&GLctx.uniform2fv(webglGetUniformLocation(location),HEAPF32,value>>2,count*2)};var _glUniform3fv=(location,count,value)=>{count&&GLctx.uniform3fv(webglGetUniformLocation(location),HEAPF32,value>>2,count*3)};var _glUniform4fv=(location,count,value)=>{count&&GLctx.uniform4fv(webglGetUniformLocation(location),HEAPF32,value>>2,count*4)};var _glUniformMatrix4fv=(location,count,transpose,value)=>{count&&GLctx.uniformMatrix4fv(webglGetUniformLocation(location),!!transpose,HEAPF32,value>>2,count*16)};var _glUseProgram=program=>{program=GL.programs[program];GLctx.useProgram(program);GLctx.currentProgram=program};var _glVertexAttribPointer=(index,size,type,normalized,stride,ptr)=>{GLctx.vertexAttribPointer(index,size,type,!!normalized,stride,ptr)};var _glViewport=(x0,x1,x2,x3)=>GLctx.viewport(x0,x1,x2,x3);function _is_decryption_handler_installed(){return!!Module.Client.getDecryptionHandler()}function _jDVLRenderer_RenderAnnotationDimensionImage(bitmap,size,rcTexCoords,w,h,pixelRatio,style,bgOpacity,bgColor,borderOpacity,borderColor,borderLineStyle,bw,text,textColor,font,fontSize,fontWeight,fontItalic,encoding,horizontalAlignment,verticalAlignment,link){bitmap=UTF8ToString(bitmap);text=UTF8ToString(text);font=UTF8ToString(font);fontSize=fontSize*1.328;link=UTF8ToString(link);var canvas=document.createElement("canvas");canvas.id="jDVLAnnotationCanvas-"+Math.random().toString(36).substr(2,9);canvas.style.visibility="hidden";canvas.style.display="none";canvas.width=1024;canvas.height=1024;document.body.appendChild(canvas);var ctx=canvas.getContext("2d");fontWeight=Math.min(Math.max(Math.round(fontWeight/100),1),9)*100;ctx.font=fontWeight+(fontItalic?" italic ":" ")+fontSize+"px "+font;var hp=fontSize*.2;var vp=fontSize*.2;var lineSpacing=Math.ceil(fontSize);var maxLines=((encoding==0?1024:h)-(vp+bw)*2)/lineSpacing|0;var textWidth=0;var textLines=encoding==0?text.split("\n"):[];textLines.length=Math.min(textLines.length,link.length>0?maxLines-1:maxLines);var dimensionWidth=0;var toleralanceWidth=0;var space=0;if(encoding==0){dimensionWidth=ctx.measureText(textLines[0]).width;var toleralanceWidth1=ctx.measureText(textLines[1]).width;var toleralanceWidth2=ctx.measureText(textLines[1]).width;toleralanceWidth=toleralanceWidth1>toleralanceWidth2?toleralanceWidth1:toleralanceWidth2;textWidth=dimensionWidth+toleralanceWidth;space=toleralanceWidth*.2;w=textWidth+space+4*hp;h=2*lineSpacing+vp*2}w=Math.ceil(w+2*bw);h=Math.ceil(h+2*bw);if(style==1){w=h=Math.max(w,h)}setValue(size,w,"float");setValue(size+4,h,"float");w*=pixelRatio;h*=pixelRatio;var tw=Math.pow(2,Math.ceil(Math.log(w)/Math.LN2));var th=Math.pow(2,Math.ceil(Math.log(h)/Math.LN2));tw=Math.min(tw,canvas.width);th=Math.min(th,canvas.height);if(w>tw||h>th){var scale=Math.min(tw/w,th/h);w*=scale;h*=scale;pixelRatio*=scale}hp*=pixelRatio;vp*=pixelRatio;bw*=pixelRatio;fontSize*=pixelRatio;lineSpacing*=pixelRatio;textWidth*=pixelRatio;dimensionWidth*=pixelRatio;toleralanceWidth*=pixelRatio;space*=pixelRatio;setValue(rcTexCoords,0,"float");setValue(rcTexCoords+4,1-h/th,"float");setValue(rcTexCoords+8,w/tw,"float");setValue(rcTexCoords+12,1,"float");bgColor=bgColor.toString(16);bgColor="#"+"000000".substring(bgColor.length)+bgColor;ctx.fillStyle=bgColor;borderColor=borderColor.toString(16);borderColor="#"+"000000".substring(borderColor.length)+borderColor;ctx.strokeStyle=borderColor;ctx.lineWidth=bw;var bw2=bw/2;switch(borderLineStyle){case 2:ctx.setLineDash([bw*5,bw]);break;case 3:ctx.setLineDash([bw*2,bw]);break;case 4:ctx.setLineDash([bw*5,bw,bw*2,bw]);break;case 5:ctx.setLineDash([bw*5,bw,bw*2,bw,bw*2,bw]);break}if(style==0){if(bgOpacity>0){ctx.globalAlpha=bgOpacity;ctx.fillRect(0,0,w,h)}if(borderOpacity>0){ctx.globalAlpha=borderOpacity;ctx.strokeRect(bw2,bw2,w-bw,h-bw)}}else if(style==1){var xc=w/2;var yc=h/2;var radius=Math.min(xc,yc);ctx.beginPath();ctx.arc(xc,yc,radius-bw2,0,2*Math.PI);ctx.closePath();if(bgOpacity>0){ctx.globalAlpha=bgOpacity;ctx.fill()}if(borderOpacity>0){ctx.globalAlpha=borderOpacity;ctx.stroke()}}ctx.globalAlpha=1;ctx.setLineDash([]);ctx.font=fontWeight+(fontItalic?" italic ":" ")+fontSize+"px "+font;ctx.textAlign="left";ctx.textBaseline="middle";if(encoding==0){textColor=textColor.toString(16);ctx.fillStyle="#"+"000000".substring(textColor.length)+textColor;ctx.strokeStyle=bgColor;ctx.lineWidth=3;x=dimensionWidth+space;y=lineSpacing*.5;ctx.fillText(textLines[1],x,y);x=hp;y=lineSpacing;ctx.fillText(textLines[0],x,y);x=dimensionWidth+space;y=lineSpacing*1.5;ctx.fillText(textLines[2],x,y);Module.ccall("jDVLBitmap_CreateTexture","null",["string","string","number","number"],[bitmap,canvas.id,tw,th]);document.body.removeChild(canvas)}return DvlEnums.DVLRESULT.OK}function _jDVLRenderer_RenderAnnotationImage(bitmap,size,rcTexCoords,w,h,pixelRatio,style,bgOpacity,bgColor,borderOpacity,borderColor,borderLineStyle,borderWidth,text,textColor,fontFace,fontSize,fontWeight,fontItalic,encoding,horizontalAlignment,verticalAlignment,link,fitSize){bitmap=UTF8ToString(bitmap);text=UTF8ToString(text);fontFace=UTF8ToString(fontFace);link=UTF8ToString(link);fontFace=fontFace||"Arial";fontSize*=1.333;var padding=4;var plainTextLineHeight=1.2;var htmlLineHeight=1.25;var htmlFrame;var htmlDocument;var canvas=document.createElement("canvas");canvas.id="jDVLAnnotationCanvas-"+Math.random().toString(36).substr(2,9);canvas.style.visibility="hidden";canvas.style.display="none";var maxCanvasWidth=2048;var maxCanvasHeight=1024;var canvasScale=Math.pow(2,Math.ceil(Math.log(pixelRatio)/Math.LN2));canvas.width=maxCanvasWidth*canvasScale;canvas.height=maxCanvasHeight*canvasScale;document.body.appendChild(canvas);var ctx=canvas.getContext("2d");fontWeight=Math.min(Math.max(Math.round(fontWeight/100),1),9)*100;ctx.font=fontWeight+(fontItalic?" italic ":" ")+fontSize+"px "+fontFace;var lineSpacing=Math.ceil(fontSize*plainTextLineHeight);var maxLineWidth=(encoding==0?1024:w)-(padding+borderWidth)*2;var maxLines=((encoding==0?1024:h)-(padding+borderWidth)*2)/lineSpacing|0;var textWidth=0;var linkWidth=0;var textLines=encoding==0?text.split("\n"):[];textLines.length=Math.min(textLines.length,link.length>0?maxLines-1:maxLines);function truncate(str){return str.substr(0,str.length-2)+"…"}var linkLines=[];if(link.length>0){var maxLinkLines=maxLines-textLines.length;while(link.length>0&&textLines.length<maxLinkLines){var rowText=link;while(ctx.measureText(rowText).width>maxLineWidth&&rowText.length>1){rowText=rowText.substring(0,rowText.length-1)}linkLines.push(rowText);link=link.substring(rowText.length,link.length)}if(link.length>0){linkLines[linkLines.length-1]=truncate(linkLines[linkLines.length-1])}for(var i=0;i<linkLines.length;i++){linkWidth=Math.max(ctx.measureText(linkLines[i]).width,linkWidth)}}if(encoding==0){console.assert(fitSize,"The size of plain text annotations should always be fitted.");for(var i=0;i<textLines.length;i++){textWidth=Math.max(ctx.measureText(textLines[i]).width,textWidth)}var wspw=ctx.measureText(" ").width;w=Math.max(textWidth,linkWidth)+wspw+padding*2;h=(textLines.length+linkLines.length)*lineSpacing+padding*2}else if(encoding==1&&typeof html2canvas!="undefined"){htmlFrame=document.createElement("iframe");htmlFrame.style.visibility="hidden";htmlFrame.sandbox="allow-same-origin";document.body.appendChild(htmlFrame);htmlDocument=htmlFrame.contentDocument||htmlFrame.contentWindow.document;htmlDocument.open();htmlDocument.close();htmlDocument.documentElement.innerHTML=text;(function sanitizeHtmlContent(){var style;if(htmlDocument.styleSheets.length===0){style=htmlDocument.createElement("style");style.type="text/css";style.appendChild(document.createTextNode(""));htmlDocument.head.appendChild(style)}style=htmlDocument.querySelector("style");style.sheet.insertRule("* { margin: 0; padding: 0; line-height: 1; }",0);style.sheet.insertRule("span { line-height: "+htmlLineHeight+"; overflow-wrap: break-word;  }",1);var rules=style.sheet.cssRules;var ruleText=[];for(var ri=0;ri<rules.length;ri++){ruleText.push(rules[ri].cssText)}style.textContent=ruleText.join("\n");htmlDocument.body.removeAttribute("style");var paras=htmlDocument.body.querySelectorAll("p");if(paras.length>0){paras[0].style.marginTop=0;if(!fitSize){paras[0].style.paddingTop="1px"}paras.forEach(function(p,i){p.style.whiteSpace="normal"})}htmlDocument.body.querySelectorAll("span").forEach(function(span){var fonts=span.style.fontFamily.split(",");fonts.forEach(function(f,i){fonts[i]='"'+f.trim().replaceAll(/[\u0022\u0027]/g,"")+'"'});span.style.fontFamily=fonts.join(", ");span.innerText=span.innerText.replaceAll(/[-\u2010]/g,"‑")})})();function calcHtmlContentExtents(contentExtentHints){function addRect(target,source){if(source.left<target.left){target.left=source.left}if(source.right>target.right){target.right=source.right}if(source.top<target.top){target.top=source.top}if(source.bottom>target.bottom){target.bottom=source.bottom}}htmlDocument.body.style.margin=0;htmlDocument.body.style.padding=0;htmlDocument.body.style.border=0;var div=htmlDocument.createElement("div");while(htmlDocument.body.childNodes.length){var node=htmlDocument.body.childNodes[0];div.appendChild(node)}htmlDocument.body.appendChild(div);div.style.margin=0;div.style.padding=0;div.style.border=0;div.style.position="absolute";if(contentExtentHints===undefined){div.style.width="min-content";div.style.height="min-content";div.style.overflowWrap="normal";var contentBoundingRect={left:Infinity,top:Infinity,right:-Infinity,bottom:-Infinity};htmlDocument.querySelectorAll("span").forEach(function(span){addRect(contentBoundingRect,span.getBoundingClientRect())});var contentWidth=Math.ceil(contentBoundingRect.right-contentBoundingRect.left);var contentHeight=Math.ceil(contentBoundingRect.bottom-contentBoundingRect.top);var intrinsicAspectRatio=contentBoundingRect.width/contentBoundingRect.height;var desiredAspectRatio=16/9;if(intrinsicAspectRatio>desiredAspectRatio){contentExtentHints={width:contentWidth,height:contentHeight}}else{var contentArea=contentWidth*contentHeight;var y=Math.sqrt(contentArea/desiredAspectRatio);var x=y*desiredAspectRatio;contentExtentHints={width:Math.ceil(x),height:Math.ceil(y)}}}div.style.width=contentExtentHints.width+"px";div.style.height=contentExtentHints.height+"px";div.style.overflowWrap="normal";var contentBoundingRect={left:Infinity,top:Infinity,right:-Infinity,bottom:-Infinity};htmlDocument.querySelectorAll("span").forEach(function(span){addRect(contentBoundingRect,span.getBoundingClientRect())});var contentWidth=Math.ceil(contentBoundingRect.right-contentBoundingRect.left);if(Math.abs(contentWidth-contentExtentHints.width)>padding){contentWidth=Math.min(contentWidth,contentExtentHints.width-2*padding)}htmlFrame.width=contentWidth;div.style.width=contentWidth+"px";contentBoundingRect={left:Infinity,top:Infinity,right:-Infinity,bottom:-Infinity};htmlDocument.querySelectorAll("p").forEach(function(p){addRect(contentBoundingRect,p.getBoundingClientRect())});var contentHeight=Math.ceil(contentBoundingRect.bottom-contentBoundingRect.top);console.log("CALCULATED CONTENT extent=",contentWidth,contentHeight);var contentExtents={width:contentWidth,height:contentHeight};while(div.childNodes.length){var node=div.childNodes[0];htmlDocument.body.appendChild(node)}htmlDocument.body.removeChild(div);return contentExtents}var contentExtents={width:Math.ceil(w),height:Math.ceil(h)};if(fitSize){contentExtents=calcHtmlContentExtents(w>0&&h>0?contentExtents:undefined);contentExtents.width+=padding*2;contentExtents.height+=padding*2}w=contentExtents.width;h=contentExtents.height}w=Math.ceil(w+2*borderWidth);h=Math.ceil(h+2*borderWidth);if(style==1){w=h=Math.max(w,h)}setValue(size,w,"float");setValue(size+4,h,"float");w*=pixelRatio;h*=pixelRatio;var tw=Math.pow(2,Math.ceil(Math.log(w)/Math.LN2));var th=Math.pow(2,Math.ceil(Math.log(h)/Math.LN2));tw=Math.min(tw,canvas.width);th=Math.min(th,canvas.height);var tscale=1;if(w>tw||h>th){tscale=Math.min(tw/w,th/h);w*=tscale;h*=tscale;pixelRatio*=tscale}padding*=pixelRatio;borderWidth*=pixelRatio;fontSize*=pixelRatio;lineSpacing*=pixelRatio;textWidth*=pixelRatio;setValue(rcTexCoords,0,"float");setValue(rcTexCoords+4,1-h/th,"float");setValue(rcTexCoords+8,w/tw,"float");setValue(rcTexCoords+12,1,"float");bgColor=bgColor.toString(16);bgColor="#"+"000000".substring(bgColor.length)+bgColor;ctx.fillStyle=bgColor;borderColor=borderColor.toString(16);borderColor="#"+"000000".substring(borderColor.length)+borderColor;ctx.strokeStyle=borderColor;ctx.lineWidth=borderWidth;var borderWidth2=borderWidth/2;switch(borderLineStyle){case 2:ctx.setLineDash([borderWidth*5,borderWidth]);break;case 3:ctx.setLineDash([borderWidth*2,borderWidth]);break;case 4:ctx.setLineDash([borderWidth*5,borderWidth,borderWidth*2,borderWidth]);break;case 5:ctx.setLineDash([borderWidth*5,borderWidth,borderWidth*2,borderWidth,borderWidth*2,borderWidth]);break}if(style==0){if(bgOpacity>0){ctx.globalAlpha=bgOpacity;ctx.fillRect(0,0,w,h)}if(borderOpacity>0){ctx.globalAlpha=borderOpacity;ctx.strokeRect(borderWidth2,borderWidth2,w-borderWidth,h-borderWidth)}}else if(style==1){var xc=w/2;var yc=h/2;var radius=Math.min(xc,yc);ctx.beginPath();ctx.arc(xc,yc,radius-borderWidth2,0,2*Math.PI);ctx.closePath();if(bgOpacity>0){ctx.globalAlpha=bgOpacity;ctx.fill()}if(borderOpacity>0){ctx.globalAlpha=borderOpacity;ctx.stroke()}}ctx.globalAlpha=1;ctx.setLineDash([]);ctx.font=fontWeight+(fontItalic?" italic ":" ")+fontSize+"px "+fontFace;ctx.textAlign="left";ctx.textBaseline="middle";function renderLink(){if(linkLines.length>0){ctx.fillStyle="#0000FF";h-=linkLines.length*lineSpacing;var x=(w-linkWidth)*.5;var y=h-borderWidth-padding+lineSpacing*.5;for(var i=0;i<linkLines.length;i++){ctx.fillText(linkLines[i],x,y);y+=lineSpacing}}}if(encoding==0){renderLink();textColor=textColor.toString(16);ctx.fillStyle="#"+"000000".substring(textColor.length)+textColor;ctx.strokeStyle=bgColor;ctx.lineWidth=3;var x=(w-textWidth)*.5;var y=(h-(textLines.length-1)*lineSpacing)*.5;if(textLines.length==1){var tm=ctx.measureText(text);var txth=tm.actualBoundingBoxDescent+tm.actualBoundingBoxAscent;ctx.textAlign="center";ctx.textBaseline="bottom";x=w*.5;y=(h-2*borderWidth-txth)*.5+txth+padding}for(var i=0;i<textLines.length;i++){if(style==3){ctx.strokeText(textLines[i],x,y)}ctx.fillText(textLines[i],x,y);y+=lineSpacing}ccall("jDVLBitmap_CreateTexture","null",["string","string","number","number"],[bitmap,canvas.id,tw,th]);document.body.removeChild(canvas)}else if(encoding==1&&typeof html2canvas!="undefined"){renderLink();var cw=w-borderWidth*2;var ch=h-borderWidth*2;cw/=pixelRatio;ch/=pixelRatio;htmlFrame.width=cw;htmlFrame.height=ch;htmlFrame.scale=tscale;padding/=pixelRatio;htmlDocument.body.style.width=cw-2*padding+"px";htmlDocument.body.style.height=ch-2*padding+"px";htmlDocument.body.style.margin=0;htmlDocument.body.style.padding=padding+"px";var htmlCanvas=document.createElement("canvas");htmlCanvas.style.width=cw+"px";htmlCanvas.style.height=ch+"px";htmlCanvas.width=cw*pixelRatio;htmlCanvas.height=ch*pixelRatio;var context=htmlCanvas.getContext("2d");context.scale(pixelRatio,pixelRatio);html2canvas(htmlDocument.documentElement,{canvas:htmlCanvas,backgroundColor:null,width:cw,height:ch}).then(function(htmlCanvas){if(htmlCanvas.width>0&&htmlCanvas.height>0){var ctx=canvas.getContext("2d");ctx.scale(tscale,tscale);ctx.drawImage(htmlCanvas,borderWidth,borderWidth)}ccall("jDVLBitmap_CreateTexture","null",["string","string","number","number"],[bitmap,canvas.id,tw,th]);document.body.removeChild(htmlFrame);document.body.removeChild(canvas)})}else{ccall("jDVLBitmap_CreateTexture","null",["string","string","number","number"],[bitmap,canvas.id,tw,th]);document.body.removeChild(canvas)}return DvlEnums.DVLRESULT.OK}function _jsFileExists(path){return FS.analyzePath(UTF8ToString(path),true).exists}function _setNodeState(dvlViewStateManager,nodeId,state){var item=VSM.getByDvlVsm(dvlViewStateManager),nativeVsm=item?item.nativeVsm:null;if(nativeVsm){var stateMask=VSM.getProperty(state,VSM.Property.StateMask),id=nodeIdToStringId(nodeId);if(stateMask&VSM.Property.NodeFlags.Mask){var nodeFlagsMask=VSM.getProperty(state,VSM.Property.NodeFlagsMask),nodeFlags=VSM.getProperty(state,VSM.Property.NodeFlags);(nativeVsm.getImplementation&&nativeVsm.getImplementation()||nativeVsm)._setFlags(id,nodeFlags,nodeFlagsMask)}if(stateMask&VSM.Property.Opacity.Mask){var opacity=VSM.getProperty(state,VSM.Property.Opacity);nativeVsm.setOpacity(id,opacity)}if(stateMask&VSM.Property.HighlightColor.Mask){var highlightColor=VSM.getProperty(state,VSM.Property.HighlightColor);nativeVsm.setTintColor(id,highlightColor)}}}var arraySum=(array,index)=>{var sum=0;for(var i=0;i<=index;sum+=array[i++]){}return sum};var MONTH_DAYS_LEAP=[31,29,31,30,31,30,31,31,30,31,30,31];var MONTH_DAYS_REGULAR=[31,28,31,30,31,30,31,31,30,31,30,31];var addDays=(date,days)=>{var newDate=new Date(date.getTime());while(days>0){var leap=isLeapYear(newDate.getFullYear());var currentMonth=newDate.getMonth();var daysInCurrentMonth=(leap?MONTH_DAYS_LEAP:MONTH_DAYS_REGULAR)[currentMonth];if(days>daysInCurrentMonth-newDate.getDate()){days-=daysInCurrentMonth-newDate.getDate()+1;newDate.setDate(1);if(currentMonth<11){newDate.setMonth(currentMonth+1)}else{newDate.setMonth(0);newDate.setFullYear(newDate.getFullYear()+1)}}else{newDate.setDate(newDate.getDate()+days);return newDate}}return newDate};var writeArrayToMemory=(array,buffer)=>{HEAP8.set(array,buffer)};var _strftime=(s,maxsize,format,tm)=>{var tm_zone=HEAPU32[tm+40>>2];var date={tm_sec:HEAP32[tm>>2],tm_min:HEAP32[tm+4>>2],tm_hour:HEAP32[tm+8>>2],tm_mday:HEAP32[tm+12>>2],tm_mon:HEAP32[tm+16>>2],tm_year:HEAP32[tm+20>>2],tm_wday:HEAP32[tm+24>>2],tm_yday:HEAP32[tm+28>>2],tm_isdst:HEAP32[tm+32>>2],tm_gmtoff:HEAP32[tm+36>>2],tm_zone:tm_zone?UTF8ToString(tm_zone):""};var pattern=UTF8ToString(format);var EXPANSION_RULES_1={"%c":"%a %b %d %H:%M:%S %Y","%D":"%m/%d/%y","%F":"%Y-%m-%d","%h":"%b","%r":"%I:%M:%S %p","%R":"%H:%M","%T":"%H:%M:%S","%x":"%m/%d/%y","%X":"%H:%M:%S","%Ec":"%c","%EC":"%C","%Ex":"%m/%d/%y","%EX":"%H:%M:%S","%Ey":"%y","%EY":"%Y","%Od":"%d","%Oe":"%e","%OH":"%H","%OI":"%I","%Om":"%m","%OM":"%M","%OS":"%S","%Ou":"%u","%OU":"%U","%OV":"%V","%Ow":"%w","%OW":"%W","%Oy":"%y"};for(var rule in EXPANSION_RULES_1){pattern=pattern.replace(new RegExp(rule,"g"),EXPANSION_RULES_1[rule])}var WEEKDAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];var MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];function leadingSomething(value,digits,character){var str=typeof value=="number"?value.toString():value||"";while(str.length<digits){str=character[0]+str}return str}function leadingNulls(value,digits){return leadingSomething(value,digits,"0")}function compareByDay(date1,date2){function sgn(value){return value<0?-1:value>0?1:0}var compare;if((compare=sgn(date1.getFullYear()-date2.getFullYear()))===0){if((compare=sgn(date1.getMonth()-date2.getMonth()))===0){compare=sgn(date1.getDate()-date2.getDate())}}return compare}function getFirstWeekStartDate(janFourth){switch(janFourth.getDay()){case 0:return new Date(janFourth.getFullYear()-1,11,29);case 1:return janFourth;case 2:return new Date(janFourth.getFullYear(),0,3);case 3:return new Date(janFourth.getFullYear(),0,2);case 4:return new Date(janFourth.getFullYear(),0,1);case 5:return new Date(janFourth.getFullYear()-1,11,31);case 6:return new Date(janFourth.getFullYear()-1,11,30)}}function getWeekBasedYear(date){var thisDate=addDays(new Date(date.tm_year+1900,0,1),date.tm_yday);var janFourthThisYear=new Date(thisDate.getFullYear(),0,4);var janFourthNextYear=new Date(thisDate.getFullYear()+1,0,4);var firstWeekStartThisYear=getFirstWeekStartDate(janFourthThisYear);var firstWeekStartNextYear=getFirstWeekStartDate(janFourthNextYear);if(compareByDay(firstWeekStartThisYear,thisDate)<=0){if(compareByDay(firstWeekStartNextYear,thisDate)<=0){return thisDate.getFullYear()+1}return thisDate.getFullYear()}return thisDate.getFullYear()-1}var EXPANSION_RULES_2={"%a":date=>WEEKDAYS[date.tm_wday].substring(0,3),"%A":date=>WEEKDAYS[date.tm_wday],"%b":date=>MONTHS[date.tm_mon].substring(0,3),"%B":date=>MONTHS[date.tm_mon],"%C":date=>{var year=date.tm_year+1900;return leadingNulls(year/100|0,2)},"%d":date=>leadingNulls(date.tm_mday,2),"%e":date=>leadingSomething(date.tm_mday,2," "),"%g":date=>getWeekBasedYear(date).toString().substring(2),"%G":getWeekBasedYear,"%H":date=>leadingNulls(date.tm_hour,2),"%I":date=>{var twelveHour=date.tm_hour;if(twelveHour==0)twelveHour=12;else if(twelveHour>12)twelveHour-=12;return leadingNulls(twelveHour,2)},"%j":date=>leadingNulls(date.tm_mday+arraySum(isLeapYear(date.tm_year+1900)?MONTH_DAYS_LEAP:MONTH_DAYS_REGULAR,date.tm_mon-1),3),"%m":date=>leadingNulls(date.tm_mon+1,2),"%M":date=>leadingNulls(date.tm_min,2),"%n":()=>"\n","%p":date=>{if(date.tm_hour>=0&&date.tm_hour<12){return"AM"}return"PM"},"%S":date=>leadingNulls(date.tm_sec,2),"%t":()=>"\t","%u":date=>date.tm_wday||7,"%U":date=>{var days=date.tm_yday+7-date.tm_wday;return leadingNulls(Math.floor(days/7),2)},"%V":date=>{var val=Math.floor((date.tm_yday+7-(date.tm_wday+6)%7)/7);if((date.tm_wday+371-date.tm_yday-2)%7<=2){val++}if(!val){val=52;var dec31=(date.tm_wday+7-date.tm_yday-1)%7;if(dec31==4||dec31==5&&isLeapYear(date.tm_year%400-1)){val++}}else if(val==53){var jan1=(date.tm_wday+371-date.tm_yday)%7;if(jan1!=4&&(jan1!=3||!isLeapYear(date.tm_year)))val=1}return leadingNulls(val,2)},"%w":date=>date.tm_wday,"%W":date=>{var days=date.tm_yday+7-(date.tm_wday+6)%7;return leadingNulls(Math.floor(days/7),2)},"%y":date=>(date.tm_year+1900).toString().substring(2),"%Y":date=>date.tm_year+1900,"%z":date=>{var off=date.tm_gmtoff;var ahead=off>=0;off=Math.abs(off)/60;off=off/60*100+off%60;return(ahead?"+":"-")+String("0000"+off).slice(-4)},"%Z":date=>date.tm_zone,"%%":()=>"%"};pattern=pattern.replace(/%%/g,"\0\0");for(var rule in EXPANSION_RULES_2){if(pattern.includes(rule)){pattern=pattern.replace(new RegExp(rule,"g"),EXPANSION_RULES_2[rule](date))}}pattern=pattern.replace(/\0\0/g,"%");var bytes=intArrayFromString(pattern,false);if(bytes.length>maxsize){return 0}writeArrayToMemory(bytes,s);return bytes.length-1};var _strftime_l=(s,maxsize,format,tm,loc)=>_strftime(s,maxsize,format,tm);var getCFunc=ident=>{var func=Module["_"+ident];return func};var stackAlloc=sz=>__emscripten_stack_alloc(sz);var stringToUTF8OnStack=str=>{var size=lengthBytesUTF8(str)+1;var ret=stackAlloc(size);stringToUTF8(str,ret,size);return ret};var ccall=(ident,returnType,argTypes,args,opts)=>{var toC={string:str=>{var ret=0;if(str!==null&&str!==undefined&&str!==0){ret=stringToUTF8OnStack(str)}return ret},array:arr=>{var ret=stackAlloc(arr.length);writeArrayToMemory(arr,ret);return ret}};function convertReturnValue(ret){if(returnType==="string"){return UTF8ToString(ret)}if(returnType==="boolean")return Boolean(ret);return ret}var func=getCFunc(ident);var cArgs=[];var stack=0;if(args){for(var i=0;i<args.length;i++){var converter=toC[argTypes[i]];if(converter){if(stack===0)stack=stackSave();cArgs[i]=converter(args[i])}else{cArgs[i]=args[i]}}}var ret=func(...cArgs);function onDone(ret){if(stack!==0)stackRestore(stack);return convertReturnValue(ret)}ret=onDone(ret);return ret};var cwrap=(ident,returnType,argTypes,opts)=>{var numericArgs=!argTypes||argTypes.every(type=>type==="number"||type==="boolean");var numericRet=returnType!=="string";if(numericRet&&numericArgs&&!opts){return getCFunc(ident)}return(...args)=>ccall(ident,returnType,argTypes,args,opts)};var ERRNO_CODES={EPERM:63,ENOENT:44,ESRCH:71,EINTR:27,EIO:29,ENXIO:60,E2BIG:1,ENOEXEC:45,EBADF:8,ECHILD:12,EAGAIN:6,EWOULDBLOCK:6,ENOMEM:48,EACCES:2,EFAULT:21,ENOTBLK:105,EBUSY:10,EEXIST:20,EXDEV:75,ENODEV:43,ENOTDIR:54,EISDIR:31,EINVAL:28,ENFILE:41,EMFILE:33,ENOTTY:59,ETXTBSY:74,EFBIG:22,ENOSPC:51,ESPIPE:70,EROFS:69,EMLINK:34,EPIPE:64,EDOM:18,ERANGE:68,ENOMSG:49,EIDRM:24,ECHRNG:106,EL2NSYNC:156,EL3HLT:107,EL3RST:108,ELNRNG:109,EUNATCH:110,ENOCSI:111,EL2HLT:112,EDEADLK:16,ENOLCK:46,EBADE:113,EBADR:114,EXFULL:115,ENOANO:104,EBADRQC:103,EBADSLT:102,EDEADLOCK:16,EBFONT:101,ENOSTR:100,ENODATA:116,ETIME:117,ENOSR:118,ENONET:119,ENOPKG:120,EREMOTE:121,ENOLINK:47,EADV:122,ESRMNT:123,ECOMM:124,EPROTO:65,EMULTIHOP:36,EDOTDOT:125,EBADMSG:9,ENOTUNIQ:126,EBADFD:127,EREMCHG:128,ELIBACC:129,ELIBBAD:130,ELIBSCN:131,ELIBMAX:132,ELIBEXEC:133,ENOSYS:52,ENOTEMPTY:55,ENAMETOOLONG:37,ELOOP:32,EOPNOTSUPP:138,EPFNOSUPPORT:139,ECONNRESET:15,ENOBUFS:42,EAFNOSUPPORT:5,EPROTOTYPE:67,ENOTSOCK:57,ENOPROTOOPT:50,ESHUTDOWN:140,ECONNREFUSED:14,EADDRINUSE:3,ECONNABORTED:13,ENETUNREACH:40,ENETDOWN:38,ETIMEDOUT:73,EHOSTDOWN:142,EHOSTUNREACH:23,EINPROGRESS:26,EALREADY:7,EDESTADDRREQ:17,EMSGSIZE:35,EPROTONOSUPPORT:66,ESOCKTNOSUPPORT:137,EADDRNOTAVAIL:4,ENETRESET:39,EISCONN:30,ENOTCONN:53,ETOOMANYREFS:141,EUSERS:136,EDQUOT:19,ESTALE:72,ENOTSUP:138,ENOMEDIUM:148,EILSEQ:25,EOVERFLOW:61,ECANCELED:11,ENOTRECOVERABLE:56,EOWNERDEAD:62,ESTRPIPE:135};Module["requestFullscreen"]=Browser.requestFullscreen;Module["requestAnimationFrame"]=Browser.requestAnimationFrame;Module["setCanvasSize"]=Browser.setCanvasSize;Module["pauseMainLoop"]=Browser.mainLoop.pause;Module["resumeMainLoop"]=Browser.mainLoop.resume;Module["getUserMedia"]=Browser.getUserMedia;Module["createContext"]=Browser.createContext;var preloadedImages={};var preloadedAudios={};FS.createPreloadedFile=FS_createPreloadedFile;FS.staticInit();var GLctx;var wasmImports={a:___cxa_throw,da:___syscall_chmod,ha:___syscall_faccessat,ea:___syscall_fchmod,ca:___syscall_fchown32,l:___syscall_fcntl64,$:___syscall_fstat64,$a:___syscall_ftruncate64,W:___syscall_getcwd,jb:___syscall_getdents64,aa:___syscall_ioctl,Y:___syscall_lstat64,kb:___syscall_mkdirat,Z:___syscall_newfstatat,G:___syscall_openat,ib:___syscall_readlinkat,U:___syscall_rmdir,_:___syscall_stat64,V:___syscall_unlinkat,fb:___syscall_utimensat,cb:__abort_js,fa:__emscripten_get_now_is_monotonic,ga:__emscripten_memcpy_js,Xa:__gmtime_js,Ya:__localtime_js,Va:__mmap_js,Wa:__munmap_js,Za:__timegm_js,gb:__tzset_js,Sa:_decrypt,nb:_derive_key,c:_emscripten_asm_const_int,r:_emscripten_date_now,hb:_emscripten_get_heap_max,B:_emscripten_get_now,db:_emscripten_resize_heap,lb:_environ_get,mb:_environ_sizes_get,s:_fd_close,eb:_fd_fdstat_get,F:_fd_read,_a:_fd_seek,X:_fd_sync,A:_fd_write,Aa:_getNodeState,ab:_getentropy,Ma:_glActiveTexture,J:_glAttachShader,w:_glBindBuffer,y:_glBindFramebuffer,P:_glBindRenderbuffer,Q:_glBindTexture,E:_glBlendFuncSeparate,S:_glBufferData,Ta:_glBufferSubData,Ea:_glCheckFramebufferStatus,za:_glClear,j:_glClearColor,ua:_glClearDepthf,x:_glColorMask,oa:_glCompileShader,ma:_glCreateProgram,qa:_glCreateShader,R:_glDeleteBuffers,Da:_glDeleteFramebuffers,K:_glDeleteProgram,Ia:_glDeleteRenderbuffers,v:_glDeleteShader,Na:_glDeleteTextures,ta:_glDepthFunc,N:_glDepthMask,e:_glDisable,t:_glDisableVertexAttribArray,Ca:_glDrawArrays,Ba:_glDrawElements,f:_glEnable,u:_glEnableVertexAttribArray,Fa:_glFramebufferRenderbuffer,Ga:_glFramebufferTexture2D,sa:_glFrontFace,T:_glGenBuffers,Ha:_glGenFramebuffers,La:_glGenRenderbuffers,Ra:_glGenTextures,Pa:_glGenerateMipmap,n:_glGetAttribLocation,i:_glGetError,Ua:_glGetFloatv,o:_glGetIntegerv,ka:_glGetProgramInfoLog,I:_glGetProgramiv,na:_glGetShaderInfoLog,L:_glGetShaderiv,z:_glGetString,b:_glGetUniformLocation,ra:_glLineWidth,la:_glLinkProgram,M:_glPolygonOffset,O:_glReadPixels,Ja:_glRenderbufferStorage,xa:_glScissor,pa:_glShaderSource,wa:_glStencilMask,Qa:_glTexImage2D,Oa:_glTexParameterf,k:_glTexParameteri,q:_glUniform1f,h:_glUniform1i,ba:_glUniform2fv,m:_glUniform3fv,d:_glUniform4fv,g:_glUniformMatrix4fv,D:_glUseProgram,p:_glVertexAttribPointer,ya:_glViewport,Ka:_is_decryption_handler_installed,ia:_jDVLRenderer_RenderAnnotationDimensionImage,ja:_jDVLRenderer_RenderAnnotationImage,H:_jsFileExists,va:_setNodeState,C:_strftime,bb:_strftime_l};var wasmExports=createWasm();var ___wasm_call_ctors=()=>(___wasm_call_ctors=wasmExports["pb"])();var _jDVL_ReleaseString=Module["_jDVL_ReleaseString"]=a0=>(_jDVL_ReleaseString=Module["_jDVL_ReleaseString"]=wasmExports["qb"])(a0);var _jDVL_IsErrorString=Module["_jDVL_IsErrorString"]=a0=>(_jDVL_IsErrorString=Module["_jDVL_IsErrorString"]=wasmExports["rb"])(a0);var __Z22jDVLClient_ConstructorPKc=Module["__Z22jDVLClient_ConstructorPKc"]=a0=>(__Z22jDVLClient_ConstructorPKc=Module["__Z22jDVLClient_ConstructorPKc"]=wasmExports["sb"])(a0);var _jDVLCore_Init=Module["_jDVLCore_Init"]=(a0,a1,a2)=>(_jDVLCore_Init=Module["_jDVLCore_Init"]=wasmExports["tb"])(a0,a1,a2);var _jDVLCore_InitRenderer=Module["_jDVLCore_InitRenderer"]=a0=>(_jDVLCore_InitRenderer=Module["_jDVLCore_InitRenderer"]=wasmExports["ub"])(a0);var _jDVLCore_DoneRenderer=Module["_jDVLCore_DoneRenderer"]=a0=>(_jDVLCore_DoneRenderer=Module["_jDVLCore_DoneRenderer"]=wasmExports["vb"])(a0);var _jDVLCore_CreateRenderer=Module["_jDVLCore_CreateRenderer"]=a0=>(_jDVLCore_CreateRenderer=Module["_jDVLCore_CreateRenderer"]=wasmExports["wb"])(a0);var _jDVLCore_DeleteRenderer=Module["_jDVLCore_DeleteRenderer"]=(a0,a1)=>(_jDVLCore_DeleteRenderer=Module["_jDVLCore_DeleteRenderer"]=wasmExports["xb"])(a0,a1);var _jDVLCore_Release=Module["_jDVLCore_Release"]=a0=>(_jDVLCore_Release=Module["_jDVLCore_Release"]=wasmExports["yb"])(a0);var _jDVLCore_GetMajorVersion=Module["_jDVLCore_GetMajorVersion"]=a0=>(_jDVLCore_GetMajorVersion=Module["_jDVLCore_GetMajorVersion"]=wasmExports["zb"])(a0);var _jDVLCore_GetMinorVersion=Module["_jDVLCore_GetMinorVersion"]=a0=>(_jDVLCore_GetMinorVersion=Module["_jDVLCore_GetMinorVersion"]=wasmExports["Ab"])(a0);var _jDVLCore_GetMicroVersion=Module["_jDVLCore_GetMicroVersion"]=a0=>(_jDVLCore_GetMicroVersion=Module["_jDVLCore_GetMicroVersion"]=wasmExports["Bb"])(a0);var _jDVLCore_GetBuildNumber=Module["_jDVLCore_GetBuildNumber"]=a0=>(_jDVLCore_GetBuildNumber=Module["_jDVLCore_GetBuildNumber"]=wasmExports["Cb"])(a0);var _jDVLCore_LoadScene=Module["_jDVLCore_LoadScene"]=(a0,a1,a2)=>(_jDVLCore_LoadScene=Module["_jDVLCore_LoadScene"]=wasmExports["Db"])(a0,a1,a2);var _jDVLCore_LoadSceneFromVDSL=Module["_jDVLCore_LoadSceneFromVDSL"]=(a0,a1,a2)=>(_jDVLCore_LoadSceneFromVDSL=Module["_jDVLCore_LoadSceneFromVDSL"]=wasmExports["Eb"])(a0,a1,a2);var _jDVLCore_CreateEmptyScene=Module["_jDVLCore_CreateEmptyScene"]=a0=>(_jDVLCore_CreateEmptyScene=Module["_jDVLCore_CreateEmptyScene"]=wasmExports["Fb"])(a0);var _jDVLCore_GetRendererPtr=Module["_jDVLCore_GetRendererPtr"]=a0=>(_jDVLCore_GetRendererPtr=Module["_jDVLCore_GetRendererPtr"]=wasmExports["Gb"])(a0);var _jDVLCore_GetLibraryPtr=Module["_jDVLCore_GetLibraryPtr"]=a0=>(_jDVLCore_GetLibraryPtr=Module["_jDVLCore_GetLibraryPtr"]=wasmExports["Hb"])(a0);var _jDVLCore_OnLowMemory=Module["_jDVLCore_OnLowMemory"]=a0=>(_jDVLCore_OnLowMemory=Module["_jDVLCore_OnLowMemory"]=wasmExports["Ib"])(a0);var _jDVLCore_SetClientID=Module["_jDVLCore_SetClientID"]=(a0,a1)=>(_jDVLCore_SetClientID=Module["_jDVLCore_SetClientID"]=wasmExports["Jb"])(a0,a1);var _jDVLCore_SetLocale=Module["_jDVLCore_SetLocale"]=(a0,a1)=>(_jDVLCore_SetLocale=Module["_jDVLCore_SetLocale"]=wasmExports["Kb"])(a0,a1);var _jDVLCore_ExecuteCallback=Module["_jDVLCore_ExecuteCallback"]=(a0,a1)=>(_jDVLCore_ExecuteCallback=Module["_jDVLCore_ExecuteCallback"]=wasmExports["Lb"])(a0,a1);var _jDVL_CreateCoreInstance=Module["_jDVL_CreateCoreInstance"]=a0=>(_jDVL_CreateCoreInstance=Module["_jDVL_CreateCoreInstance"]=wasmExports["Mb"])(a0);var _jDVLLibrary_RetrieveThumbnail=Module["_jDVLLibrary_RetrieveThumbnail"]=(a0,a1)=>(_jDVLLibrary_RetrieveThumbnail=Module["_jDVLLibrary_RetrieveThumbnail"]=wasmExports["Nb"])(a0,a1);var _jDVLLibrary_RetrieveInfo=Module["_jDVLLibrary_RetrieveInfo"]=(a0,a1)=>(_jDVLLibrary_RetrieveInfo=Module["_jDVLLibrary_RetrieveInfo"]=wasmExports["Ob"])(a0,a1);var _jDVLRenderer_SetDimensions=Module["_jDVLRenderer_SetDimensions"]=(a0,a1,a2)=>(_jDVLRenderer_SetDimensions=Module["_jDVLRenderer_SetDimensions"]=wasmExports["Pb"])(a0,a1,a2);var _jDVLRenderer_SetBackgroundColor=Module["_jDVLRenderer_SetBackgroundColor"]=(a0,a1,a2,a3,a4,a5,a6,a7,a8)=>(_jDVLRenderer_SetBackgroundColor=Module["_jDVLRenderer_SetBackgroundColor"]=wasmExports["Qb"])(a0,a1,a2,a3,a4,a5,a6,a7,a8);var _jDVLRenderer_AttachScene=Module["_jDVLRenderer_AttachScene"]=(a0,a1)=>(_jDVLRenderer_AttachScene=Module["_jDVLRenderer_AttachScene"]=wasmExports["Rb"])(a0,a1);var _jDVLRenderer_GetAttachedScenePtr=Module["_jDVLRenderer_GetAttachedScenePtr"]=a0=>(_jDVLRenderer_GetAttachedScenePtr=Module["_jDVLRenderer_GetAttachedScenePtr"]=wasmExports["Sb"])(a0);var _jDVLRenderer_GetAuxiliaryScenesCount=Module["_jDVLRenderer_GetAuxiliaryScenesCount"]=a0=>(_jDVLRenderer_GetAuxiliaryScenesCount=Module["_jDVLRenderer_GetAuxiliaryScenesCount"]=wasmExports["Tb"])(a0);var _jDVLRenderer_AttachAuxiliaryScene=Module["_jDVLRenderer_AttachAuxiliaryScene"]=(a0,a1)=>(_jDVLRenderer_AttachAuxiliaryScene=Module["_jDVLRenderer_AttachAuxiliaryScene"]=wasmExports["Ub"])(a0,a1);var _jDVLRenderer_DetachAuxiliaryScene=Module["_jDVLRenderer_DetachAuxiliaryScene"]=(a0,a1)=>(_jDVLRenderer_DetachAuxiliaryScene=Module["_jDVLRenderer_DetachAuxiliaryScene"]=wasmExports["Vb"])(a0,a1);var _jDVLRenderer_GetAuxiliarySceneInfo=Module["_jDVLRenderer_GetAuxiliarySceneInfo"]=(a0,a1)=>(_jDVLRenderer_GetAuxiliarySceneInfo=Module["_jDVLRenderer_GetAuxiliarySceneInfo"]=wasmExports["Wb"])(a0,a1);var _jDVLRenderer_SetAuxiliarySceneAnchor=Module["_jDVLRenderer_SetAuxiliarySceneAnchor"]=(a0,a1,a2)=>(_jDVLRenderer_SetAuxiliarySceneAnchor=Module["_jDVLRenderer_SetAuxiliarySceneAnchor"]=wasmExports["Xb"])(a0,a1,a2);var _jDVLRenderer_SetAuxiliarySceneAnchorMatrix=Module["_jDVLRenderer_SetAuxiliarySceneAnchorMatrix"]=(a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17)=>(_jDVLRenderer_SetAuxiliarySceneAnchorMatrix=Module["_jDVLRenderer_SetAuxiliarySceneAnchorMatrix"]=wasmExports["Yb"])(a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17);var _jDVLRenderer_SetAuxiliarySceneMatrix=Module["_jDVLRenderer_SetAuxiliarySceneMatrix"]=(a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17)=>(_jDVLRenderer_SetAuxiliarySceneMatrix=Module["_jDVLRenderer_SetAuxiliarySceneMatrix"]=wasmExports["Zb"])(a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17);var _jDVLRenderer_ForceRenderFrame=Module["_jDVLRenderer_ForceRenderFrame"]=a0=>(_jDVLRenderer_ForceRenderFrame=Module["_jDVLRenderer_ForceRenderFrame"]=wasmExports["_b"])(a0);var _jDVLRenderer_ShouldRenderFrame=Module["_jDVLRenderer_ShouldRenderFrame"]=a0=>(_jDVLRenderer_ShouldRenderFrame=Module["_jDVLRenderer_ShouldRenderFrame"]=wasmExports["$b"])(a0);var _jDVLRenderer_RenderFrame=Module["_jDVLRenderer_RenderFrame"]=a0=>(_jDVLRenderer_RenderFrame=Module["_jDVLRenderer_RenderFrame"]=wasmExports["ac"])(a0);var _jDVLRenderer_RenderFrameEx=Module["_jDVLRenderer_RenderFrameEx"]=(a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28,a29,a30,a31,a32)=>(_jDVLRenderer_RenderFrameEx=Module["_jDVLRenderer_RenderFrameEx"]=wasmExports["bc"])(a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28,a29,a30,a31,a32);var _jDVLRenderer_GetCameraMatrices=Module["_jDVLRenderer_GetCameraMatrices"]=a0=>(_jDVLRenderer_GetCameraMatrices=Module["_jDVLRenderer_GetCameraMatrices"]=wasmExports["cc"])(a0);var _jDVLRenderer_SetCameraMatrices=Module["_jDVLRenderer_SetCameraMatrices"]=(a0,a1,a2,a3)=>(_jDVLRenderer_SetCameraMatrices=Module["_jDVLRenderer_SetCameraMatrices"]=wasmExports["dc"])(a0,a1,a2,a3);var _jDVLRenderer_SetOption=Module["_jDVLRenderer_SetOption"]=(a0,a1,a2)=>(_jDVLRenderer_SetOption=Module["_jDVLRenderer_SetOption"]=wasmExports["ec"])(a0,a1,a2);var _jDVLRenderer_GetOption=Module["_jDVLRenderer_GetOption"]=(a0,a1)=>(_jDVLRenderer_GetOption=Module["_jDVLRenderer_GetOption"]=wasmExports["fc"])(a0,a1);var _jDVLRenderer_SetOptionF=Module["_jDVLRenderer_SetOptionF"]=(a0,a1,a2)=>(_jDVLRenderer_SetOptionF=Module["_jDVLRenderer_SetOptionF"]=wasmExports["gc"])(a0,a1,a2);var _jDVLRenderer_GetOptionF=Module["_jDVLRenderer_GetOptionF"]=(a0,a1)=>(_jDVLRenderer_GetOptionF=Module["_jDVLRenderer_GetOptionF"]=wasmExports["hc"])(a0,a1);var _jDVLRenderer_ResetView=Module["_jDVLRenderer_ResetView"]=(a0,a1)=>(_jDVLRenderer_ResetView=Module["_jDVLRenderer_ResetView"]=wasmExports["ic"])(a0,a1);var _jDVLRenderer_BeginGesture=Module["_jDVLRenderer_BeginGesture"]=(a0,a1,a2)=>(_jDVLRenderer_BeginGesture=Module["_jDVLRenderer_BeginGesture"]=wasmExports["jc"])(a0,a1,a2);var _jDVLRenderer_EndGesture=Module["_jDVLRenderer_EndGesture"]=a0=>(_jDVLRenderer_EndGesture=Module["_jDVLRenderer_EndGesture"]=wasmExports["kc"])(a0);var _jDVLRenderer_Pan=Module["_jDVLRenderer_Pan"]=(a0,a1,a2)=>(_jDVLRenderer_Pan=Module["_jDVLRenderer_Pan"]=wasmExports["lc"])(a0,a1,a2);var _jDVLRenderer_Rotate=Module["_jDVLRenderer_Rotate"]=(a0,a1,a2)=>(_jDVLRenderer_Rotate=Module["_jDVLRenderer_Rotate"]=wasmExports["mc"])(a0,a1,a2);var _jDVLRenderer_Zoom=Module["_jDVLRenderer_Zoom"]=(a0,a1)=>(_jDVLRenderer_Zoom=Module["_jDVLRenderer_Zoom"]=wasmExports["nc"])(a0,a1);var _jDVLRenderer_CanIsolateNode=Module["_jDVLRenderer_CanIsolateNode"]=(a0,a1)=>(_jDVLRenderer_CanIsolateNode=Module["_jDVLRenderer_CanIsolateNode"]=wasmExports["oc"])(a0,a1);var _jDVLRenderer_SetIsolatedNode=Module["_jDVLRenderer_SetIsolatedNode"]=(a0,a1)=>(_jDVLRenderer_SetIsolatedNode=Module["_jDVLRenderer_SetIsolatedNode"]=wasmExports["pc"])(a0,a1);var _jDVLRenderer_GetIsolatedNode=Module["_jDVLRenderer_GetIsolatedNode"]=a0=>(_jDVLRenderer_GetIsolatedNode=Module["_jDVLRenderer_GetIsolatedNode"]=wasmExports["qc"])(a0);var _jDVLRenderer_ZoomTo=Module["_jDVLRenderer_ZoomTo"]=(a0,a1,a2,a3,a4,a5)=>(_jDVLRenderer_ZoomTo=Module["_jDVLRenderer_ZoomTo"]=wasmExports["rc"])(a0,a1,a2,a3,a4,a5);var _jDVLRenderer_Tap=Module["_jDVLRenderer_Tap"]=(a0,a1,a2,a3,a4)=>(_jDVLRenderer_Tap=Module["_jDVLRenderer_Tap"]=wasmExports["sc"])(a0,a1,a2,a3,a4);var _jDVLRenderer_DrawSelectionRect=Module["_jDVLRenderer_DrawSelectionRect"]=(a0,a1,a2,a3,a4)=>(_jDVLRenderer_DrawSelectionRect=Module["_jDVLRenderer_DrawSelectionRect"]=wasmExports["tc"])(a0,a1,a2,a3,a4);var _jDVLRenderer_RectSelect=Module["_jDVLRenderer_RectSelect"]=(a0,a1,a2,a3,a4)=>(_jDVLRenderer_RectSelect=Module["_jDVLRenderer_RectSelect"]=wasmExports["uc"])(a0,a1,a2,a3,a4);var _jDVLRenderer_HitTest=Module["_jDVLRenderer_HitTest"]=(a0,a1,a2)=>(_jDVLRenderer_HitTest=Module["_jDVLRenderer_HitTest"]=wasmExports["vc"])(a0,a1,a2);var _jDVLRenderer_MultipleHitTest=Module["_jDVLRenderer_MultipleHitTest"]=(a0,a1,a2)=>(_jDVLRenderer_MultipleHitTest=Module["_jDVLRenderer_MultipleHitTest"]=wasmExports["wc"])(a0,a1,a2);var _jDVLRenderer_CreateTexture=Module["_jDVLRenderer_CreateTexture"]=(a0,a1,a2,a3,a4)=>(_jDVLRenderer_CreateTexture=Module["_jDVLRenderer_CreateTexture"]=wasmExports["xc"])(a0,a1,a2,a3,a4);var _jDVLRenderer_ReleaseTexture=Module["_jDVLRenderer_ReleaseTexture"]=(a0,a1)=>(_jDVLRenderer_ReleaseTexture=Module["_jDVLRenderer_ReleaseTexture"]=wasmExports["yc"])(a0,a1);var _jDVLRenderer_SetViewStateManager=Module["_jDVLRenderer_SetViewStateManager"]=(a0,a1)=>(_jDVLRenderer_SetViewStateManager=Module["_jDVLRenderer_SetViewStateManager"]=wasmExports["zc"])(a0,a1);var _jDVLRenderer_GetCurrentCamera=Module["_jDVLRenderer_GetCurrentCamera"]=a0=>(_jDVLRenderer_GetCurrentCamera=Module["_jDVLRenderer_GetCurrentCamera"]=wasmExports["Ac"])(a0);var _jDVLRenderer_GetTransitionCamera=Module["_jDVLRenderer_GetTransitionCamera"]=a0=>(_jDVLRenderer_GetTransitionCamera=Module["_jDVLRenderer_GetTransitionCamera"]=wasmExports["Bc"])(a0);var _jDVLRenderer_ActivateStep=Module["_jDVLRenderer_ActivateStep"]=(a0,a1,a2,a3,a4)=>(_jDVLRenderer_ActivateStep=Module["_jDVLRenderer_ActivateStep"]=wasmExports["Cc"])(a0,a1,a2,a3,a4);var _jDVLRenderer_PauseCurrentStep=Module["_jDVLRenderer_PauseCurrentStep"]=a0=>(_jDVLRenderer_PauseCurrentStep=Module["_jDVLRenderer_PauseCurrentStep"]=wasmExports["Dc"])(a0);var _jDVLRenderer_ActivateCamera=Module["_jDVLRenderer_ActivateCamera"]=(a0,a1,a2)=>(_jDVLRenderer_ActivateCamera=Module["_jDVLRenderer_ActivateCamera"]=wasmExports["Ec"])(a0,a1,a2);var _jDVLScene_RetrieveSceneInfo=Module["_jDVLScene_RetrieveSceneInfo"]=(a0,a1)=>(_jDVLScene_RetrieveSceneInfo=Module["_jDVLScene_RetrieveSceneInfo"]=wasmExports["Fc"])(a0,a1);var _jDVLScene_GetNodeSelectionInfo=Module["_jDVLScene_GetNodeSelectionInfo"]=a0=>(_jDVLScene_GetNodeSelectionInfo=Module["_jDVLScene_GetNodeSelectionInfo"]=wasmExports["Gc"])(a0);var _jDVLScene_PerformAction=Module["_jDVLScene_PerformAction"]=(a0,a1)=>(_jDVLScene_PerformAction=Module["_jDVLScene_PerformAction"]=wasmExports["Hc"])(a0,a1);var _jDVLScene_RetrieveNodeInfo=Module["_jDVLScene_RetrieveNodeInfo"]=(a0,a1,a2)=>(_jDVLScene_RetrieveNodeInfo=Module["_jDVLScene_RetrieveNodeInfo"]=wasmExports["Ic"])(a0,a1,a2);var _jDVLScene_RetrieveMetadata=Module["_jDVLScene_RetrieveMetadata"]=(a0,a1)=>(_jDVLScene_RetrieveMetadata=Module["_jDVLScene_RetrieveMetadata"]=wasmExports["Jc"])(a0,a1);var _jDVLScene_RetrieveVEIDs=Module["_jDVLScene_RetrieveVEIDs"]=(a0,a1)=>(_jDVLScene_RetrieveVEIDs=Module["_jDVLScene_RetrieveVEIDs"]=wasmExports["Kc"])(a0,a1);var _jDVLScene_RetrieveThumbnail=Module["_jDVLScene_RetrieveThumbnail"]=(a0,a1)=>(_jDVLScene_RetrieveThumbnail=Module["_jDVLScene_RetrieveThumbnail"]=wasmExports["Lc"])(a0,a1);var _jDVLScene_BuildPartsList=Module["_jDVLScene_BuildPartsList"]=(a0,a1,a2,a3,a4,a5,a6,a7)=>(_jDVLScene_BuildPartsList=Module["_jDVLScene_BuildPartsList"]=wasmExports["Mc"])(a0,a1,a2,a3,a4,a5,a6,a7);var _jDVLScene_FindNodes=Module["_jDVLScene_FindNodes"]=(a0,a1,a2,a3)=>(_jDVLScene_FindNodes=Module["_jDVLScene_FindNodes"]=wasmExports["Nc"])(a0,a1,a2,a3);var _jDVLScene_RetrieveProcedures=Module["_jDVLScene_RetrieveProcedures"]=a0=>(_jDVLScene_RetrieveProcedures=Module["_jDVLScene_RetrieveProcedures"]=wasmExports["Oc"])(a0);var _jDVLScene_RetrieveLayerInfo=Module["_jDVLScene_RetrieveLayerInfo"]=(a0,a1)=>(_jDVLScene_RetrieveLayerInfo=Module["_jDVLScene_RetrieveLayerInfo"]=wasmExports["Pc"])(a0,a1);var _jDVLScene_ActivateStep=Module["_jDVLScene_ActivateStep"]=(a0,a1,a2,a3,a4)=>(_jDVLScene_ActivateStep=Module["_jDVLScene_ActivateStep"]=wasmExports["Qc"])(a0,a1,a2,a3,a4);var _jDVLScene_RetrieveOutputSettings=Module["_jDVLScene_RetrieveOutputSettings"]=(a0,a1)=>(_jDVLScene_RetrieveOutputSettings=Module["_jDVLScene_RetrieveOutputSettings"]=wasmExports["Rc"])(a0,a1);var _jDVLScene_PauseCurrentStep=Module["_jDVLScene_PauseCurrentStep"]=a0=>(_jDVLScene_PauseCurrentStep=Module["_jDVLScene_PauseCurrentStep"]=wasmExports["Sc"])(a0);var _jDVLScene_CreateNode=Module["_jDVLScene_CreateNode"]=(a0,a1,a2,a3)=>(_jDVLScene_CreateNode=Module["_jDVLScene_CreateNode"]=wasmExports["Tc"])(a0,a1,a2,a3);var _jDVLScene_CreateNodeCopy=Module["_jDVLScene_CreateNodeCopy"]=(a0,a1,a2,a3,a4,a5)=>(_jDVLScene_CreateNodeCopy=Module["_jDVLScene_CreateNodeCopy"]=wasmExports["Uc"])(a0,a1,a2,a3,a4,a5);var _jDVLScene_DeinstanceContent=Module["_jDVLScene_DeinstanceContent"]=(a0,a1)=>(_jDVLScene_DeinstanceContent=Module["_jDVLScene_DeinstanceContent"]=wasmExports["Vc"])(a0,a1);var _jDVLScene_DeleteNode=Module["_jDVLScene_DeleteNode"]=(a0,a1)=>(_jDVLScene_DeleteNode=Module["_jDVLScene_DeleteNode"]=wasmExports["Wc"])(a0,a1);var _jDVLScene_ChangeNodeFlags=Module["_jDVLScene_ChangeNodeFlags"]=(a0,a1,a2,a3)=>(_jDVLScene_ChangeNodeFlags=Module["_jDVLScene_ChangeNodeFlags"]=wasmExports["Xc"])(a0,a1,a2,a3);var _jDVLScene_SetNodeOpacity=Module["_jDVLScene_SetNodeOpacity"]=(a0,a1,a2)=>(_jDVLScene_SetNodeOpacity=Module["_jDVLScene_SetNodeOpacity"]=wasmExports["Yc"])(a0,a1,a2);var _jDVLScene_SetNodeHighlightColor=Module["_jDVLScene_SetNodeHighlightColor"]=(a0,a1,a2)=>(_jDVLScene_SetNodeHighlightColor=Module["_jDVLScene_SetNodeHighlightColor"]=wasmExports["Zc"])(a0,a1,a2);var _jDVLScene_GetNodeWorldMatrix=Module["_jDVLScene_GetNodeWorldMatrix"]=(a0,a1)=>(_jDVLScene_GetNodeWorldMatrix=Module["_jDVLScene_GetNodeWorldMatrix"]=wasmExports["_c"])(a0,a1);var _jDVLScene_SetNodeWorldMatrix=Module["_jDVLScene_SetNodeWorldMatrix"]=(a0,a1,a2)=>(_jDVLScene_SetNodeWorldMatrix=Module["_jDVLScene_SetNodeWorldMatrix"]=wasmExports["$c"])(a0,a1,a2);var _jDVLScene_GetNodeLocalMatrix=Module["_jDVLScene_GetNodeLocalMatrix"]=(a0,a1)=>(_jDVLScene_GetNodeLocalMatrix=Module["_jDVLScene_GetNodeLocalMatrix"]=wasmExports["ad"])(a0,a1);var _jDVLScene_SetNodeLocalMatrix=Module["_jDVLScene_SetNodeLocalMatrix"]=(a0,a1,a2)=>(_jDVLScene_SetNodeLocalMatrix=Module["_jDVLScene_SetNodeLocalMatrix"]=wasmExports["bd"])(a0,a1,a2);var _jDVLScene_Merge=Module["_jDVLScene_Merge"]=(a0,a1,a2)=>(_jDVLScene_Merge=Module["_jDVLScene_Merge"]=wasmExports["cd"])(a0,a1,a2);var _jDVLScene_GetMaterialByName=Module["_jDVLScene_GetMaterialByName"]=(a0,a1)=>(_jDVLScene_GetMaterialByName=Module["_jDVLScene_GetMaterialByName"]=wasmExports["dd"])(a0,a1);var _jDVLScene_GetNodeSubmeshesCount=Module["_jDVLScene_GetNodeSubmeshesCount"]=(a0,a1)=>(_jDVLScene_GetNodeSubmeshesCount=Module["_jDVLScene_GetNodeSubmeshesCount"]=wasmExports["ed"])(a0,a1);var _jDVLScene_GetNodeSubmeshMaterial=Module["_jDVLScene_GetNodeSubmeshMaterial"]=(a0,a1,a2)=>(_jDVLScene_GetNodeSubmeshMaterial=Module["_jDVLScene_GetNodeSubmeshMaterial"]=wasmExports["fd"])(a0,a1,a2);var _jDVLScene_SetNodeSubmeshMaterial=Module["_jDVLScene_SetNodeSubmeshMaterial"]=(a0,a1,a2,a3)=>(_jDVLScene_SetNodeSubmeshMaterial=Module["_jDVLScene_SetNodeSubmeshMaterial"]=wasmExports["gd"])(a0,a1,a2,a3);var _jDVLScene_Execute=Module["_jDVLScene_Execute"]=(a0,a1,a2)=>(_jDVLScene_Execute=Module["_jDVLScene_Execute"]=wasmExports["hd"])(a0,a1,a2);var _jDVLScene_SetDynamicLabel=Module["_jDVLScene_SetDynamicLabel"]=(a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)=>(_jDVLScene_SetDynamicLabel=Module["_jDVLScene_SetDynamicLabel"]=wasmExports["id"])(a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11);var _jDVLScene_UpdateDynamicLabel=Module["_jDVLScene_UpdateDynamicLabel"]=(a0,a1)=>(_jDVLScene_UpdateDynamicLabel=Module["_jDVLScene_UpdateDynamicLabel"]=wasmExports["jd"])(a0,a1);var _jDVLScene_SetPOIIcon=Module["_jDVLScene_SetPOIIcon"]=(a0,a1,a2,a3,a4)=>(_jDVLScene_SetPOIIcon=Module["_jDVLScene_SetPOIIcon"]=wasmExports["kd"])(a0,a1,a2,a3,a4);var _jDVLScene_GetCurrentCamera=Module["_jDVLScene_GetCurrentCamera"]=a0=>(_jDVLScene_GetCurrentCamera=Module["_jDVLScene_GetCurrentCamera"]=wasmExports["ld"])(a0);var _jDVLScene_CreateCamera=Module["_jDVLScene_CreateCamera"]=(a0,a1,a2)=>(_jDVLScene_CreateCamera=Module["_jDVLScene_CreateCamera"]=wasmExports["md"])(a0,a1,a2);var _jDVLScene_ActivateCamera=Module["_jDVLScene_ActivateCamera"]=(a0,a1,a2)=>(_jDVLScene_ActivateCamera=Module["_jDVLScene_ActivateCamera"]=wasmExports["nd"])(a0,a1,a2);var _jDVLScene_Retain=Module["_jDVLScene_Retain"]=a0=>(_jDVLScene_Retain=Module["_jDVLScene_Retain"]=wasmExports["od"])(a0);var _jDVLScene_Release=Module["_jDVLScene_Release"]=a0=>(_jDVLScene_Release=Module["_jDVLScene_Release"]=wasmExports["pd"])(a0);var _jDVLCamera_GetName=Module["_jDVLCamera_GetName"]=a0=>(_jDVLCamera_GetName=Module["_jDVLCamera_GetName"]=wasmExports["qd"])(a0);var _jDVLCamera_SetName=Module["_jDVLCamera_SetName"]=(a0,a1)=>(_jDVLCamera_SetName=Module["_jDVLCamera_SetName"]=wasmExports["rd"])(a0,a1);var _jDVLCamera_GetOrigin=Module["_jDVLCamera_GetOrigin"]=a0=>(_jDVLCamera_GetOrigin=Module["_jDVLCamera_GetOrigin"]=wasmExports["sd"])(a0);var _jDVLCamera_SetOrigin=Module["_jDVLCamera_SetOrigin"]=(a0,a1,a2,a3)=>(_jDVLCamera_SetOrigin=Module["_jDVLCamera_SetOrigin"]=wasmExports["td"])(a0,a1,a2,a3);var _jDVLCamera_GetTargetDirection=Module["_jDVLCamera_GetTargetDirection"]=a0=>(_jDVLCamera_GetTargetDirection=Module["_jDVLCamera_GetTargetDirection"]=wasmExports["ud"])(a0);var _jDVLCamera_SetTargetDirection=Module["_jDVLCamera_SetTargetDirection"]=(a0,a1,a2,a3)=>(_jDVLCamera_SetTargetDirection=Module["_jDVLCamera_SetTargetDirection"]=wasmExports["vd"])(a0,a1,a2,a3);var _jDVLCamera_GetUpDirection=Module["_jDVLCamera_GetUpDirection"]=a0=>(_jDVLCamera_GetUpDirection=Module["_jDVLCamera_GetUpDirection"]=wasmExports["wd"])(a0);var _jDVLCamera_SetUpDirection=Module["_jDVLCamera_SetUpDirection"]=(a0,a1,a2,a3)=>(_jDVLCamera_SetUpDirection=Module["_jDVLCamera_SetUpDirection"]=wasmExports["xd"])(a0,a1,a2,a3);var _jDVLCamera_GetRotation=Module["_jDVLCamera_GetRotation"]=a0=>(_jDVLCamera_GetRotation=Module["_jDVLCamera_GetRotation"]=wasmExports["yd"])(a0);var _jDVLCamera_SetRotation=Module["_jDVLCamera_SetRotation"]=(a0,a1,a2,a3)=>(_jDVLCamera_SetRotation=Module["_jDVLCamera_SetRotation"]=wasmExports["zd"])(a0,a1,a2,a3);var _jDVLCamera_GetMatrix=Module["_jDVLCamera_GetMatrix"]=a0=>(_jDVLCamera_GetMatrix=Module["_jDVLCamera_GetMatrix"]=wasmExports["Ad"])(a0);var _jDVLCamera_SetMatrix=Module["_jDVLCamera_SetMatrix"]=(a0,a1)=>(_jDVLCamera_SetMatrix=Module["_jDVLCamera_SetMatrix"]=wasmExports["Bd"])(a0,a1);var _jDVLCamera_GetTargetNode=Module["_jDVLCamera_GetTargetNode"]=a0=>(_jDVLCamera_GetTargetNode=Module["_jDVLCamera_GetTargetNode"]=wasmExports["Cd"])(a0);var _jDVLCamera_SetTargetNode=Module["_jDVLCamera_SetTargetNode"]=(a0,a1)=>(_jDVLCamera_SetTargetNode=Module["_jDVLCamera_SetTargetNode"]=wasmExports["Dd"])(a0,a1);var _jDVLCamera_GetFOV=Module["_jDVLCamera_GetFOV"]=a0=>(_jDVLCamera_GetFOV=Module["_jDVLCamera_GetFOV"]=wasmExports["Ed"])(a0);var _jDVLCamera_SetFOV=Module["_jDVLCamera_SetFOV"]=(a0,a1)=>(_jDVLCamera_SetFOV=Module["_jDVLCamera_SetFOV"]=wasmExports["Fd"])(a0,a1);var _jDVLCamera_GetOrthoZoomFactor=Module["_jDVLCamera_GetOrthoZoomFactor"]=a0=>(_jDVLCamera_GetOrthoZoomFactor=Module["_jDVLCamera_GetOrthoZoomFactor"]=wasmExports["Gd"])(a0);var _jDVLCamera_SetOrthoZoomFactor=Module["_jDVLCamera_SetOrthoZoomFactor"]=(a0,a1)=>(_jDVLCamera_SetOrthoZoomFactor=Module["_jDVLCamera_SetOrthoZoomFactor"]=wasmExports["Hd"])(a0,a1);var _jDVLCamera_GetProjection=Module["_jDVLCamera_GetProjection"]=a0=>(_jDVLCamera_GetProjection=Module["_jDVLCamera_GetProjection"]=wasmExports["Id"])(a0);var _jDVLCamera_GetFOVBinding=Module["_jDVLCamera_GetFOVBinding"]=a0=>(_jDVLCamera_GetFOVBinding=Module["_jDVLCamera_GetFOVBinding"]=wasmExports["Jd"])(a0);var _jDVLCamera_SetFOVBinding=Module["_jDVLCamera_SetFOVBinding"]=(a0,a1)=>(_jDVLCamera_SetFOVBinding=Module["_jDVLCamera_SetFOVBinding"]=wasmExports["Kd"])(a0,a1);var _jDVLMaterial_GetName=Module["_jDVLMaterial_GetName"]=a0=>(_jDVLMaterial_GetName=Module["_jDVLMaterial_GetName"]=wasmExports["Ld"])(a0);var _jDVLMaterial_GetColorParam=Module["_jDVLMaterial_GetColorParam"]=(a0,a1)=>(_jDVLMaterial_GetColorParam=Module["_jDVLMaterial_GetColorParam"]=wasmExports["Md"])(a0,a1);var _jDVLMaterial_SetColorParam=Module["_jDVLMaterial_SetColorParam"]=(a0,a1,a2)=>(_jDVLMaterial_SetColorParam=Module["_jDVLMaterial_SetColorParam"]=wasmExports["Nd"])(a0,a1,a2);var _jDVLMaterial_GetScalarParam=Module["_jDVLMaterial_GetScalarParam"]=(a0,a1)=>(_jDVLMaterial_GetScalarParam=Module["_jDVLMaterial_GetScalarParam"]=wasmExports["Od"])(a0,a1);var _jDVLMaterial_SetScalarParam=Module["_jDVLMaterial_SetScalarParam"]=(a0,a1,a2)=>(_jDVLMaterial_SetScalarParam=Module["_jDVLMaterial_SetScalarParam"]=wasmExports["Pd"])(a0,a1,a2);var _jDVLMaterial_GetTexture=Module["_jDVLMaterial_GetTexture"]=(a0,a1)=>(_jDVLMaterial_GetTexture=Module["_jDVLMaterial_GetTexture"]=wasmExports["Qd"])(a0,a1);var _jDVLMaterial_SetTexture=Module["_jDVLMaterial_SetTexture"]=(a0,a1,a2)=>(_jDVLMaterial_SetTexture=Module["_jDVLMaterial_SetTexture"]=wasmExports["Rd"])(a0,a1,a2);var _jDVLMaterial_GetTextureParam=Module["_jDVLMaterial_GetTextureParam"]=(a0,a1,a2)=>(_jDVLMaterial_GetTextureParam=Module["_jDVLMaterial_GetTextureParam"]=wasmExports["Sd"])(a0,a1,a2);var _jDVLMaterial_SetTextureParam=Module["_jDVLMaterial_SetTextureParam"]=(a0,a1,a2,a3)=>(_jDVLMaterial_SetTextureParam=Module["_jDVLMaterial_SetTextureParam"]=wasmExports["Td"])(a0,a1,a2,a3);var _jDVLMaterial_GetTextureFlag=Module["_jDVLMaterial_GetTextureFlag"]=(a0,a1,a2)=>(_jDVLMaterial_GetTextureFlag=Module["_jDVLMaterial_GetTextureFlag"]=wasmExports["Ud"])(a0,a1,a2);var _jDVLMaterial_SetTextureFlag=Module["_jDVLMaterial_SetTextureFlag"]=(a0,a1,a2,a3)=>(_jDVLMaterial_SetTextureFlag=Module["_jDVLMaterial_SetTextureFlag"]=wasmExports["Vd"])(a0,a1,a2,a3);var _jDVLMaterial_Clone=Module["_jDVLMaterial_Clone"]=a0=>(_jDVLMaterial_Clone=Module["_jDVLMaterial_Clone"]=wasmExports["Wd"])(a0);var _jDVLMaterial_Release=Module["_jDVLMaterial_Release"]=a0=>(_jDVLMaterial_Release=Module["_jDVLMaterial_Release"]=wasmExports["Xd"])(a0);var _jDVL_CreateViewStateManager=Module["_jDVL_CreateViewStateManager"]=()=>(_jDVL_CreateViewStateManager=Module["_jDVL_CreateViewStateManager"]=wasmExports["Yd"])();var _jDVL_DeleteViewStateManager=Module["_jDVL_DeleteViewStateManager"]=a0=>(_jDVL_DeleteViewStateManager=Module["_jDVL_DeleteViewStateManager"]=wasmExports["Zd"])(a0);var _jDVL_FireNodeVisibilityChanged=Module["_jDVL_FireNodeVisibilityChanged"]=(a0,a1,a2)=>(_jDVL_FireNodeVisibilityChanged=Module["_jDVL_FireNodeVisibilityChanged"]=wasmExports["_d"])(a0,a1,a2);var _jDVL_FireNodeSelectionChanged=Module["_jDVL_FireNodeSelectionChanged"]=(a0,a1,a2)=>(_jDVL_FireNodeSelectionChanged=Module["_jDVL_FireNodeSelectionChanged"]=wasmExports["$d"])(a0,a1,a2);var _jDVL_FireNodeOpacityChanged=Module["_jDVL_FireNodeOpacityChanged"]=(a0,a1,a2)=>(_jDVL_FireNodeOpacityChanged=Module["_jDVL_FireNodeOpacityChanged"]=wasmExports["ae"])(a0,a1,a2);var _jDVL_FireNodeHighlightColorChanged=Module["_jDVL_FireNodeHighlightColorChanged"]=(a0,a1,a2)=>(_jDVL_FireNodeHighlightColorChanged=Module["_jDVL_FireNodeHighlightColorChanged"]=wasmExports["be"])(a0,a1,a2);var _free=Module["_free"]=a0=>(_free=Module["_free"]=wasmExports["de"])(a0);var _malloc=Module["_malloc"]=a0=>(_malloc=Module["_malloc"]=wasmExports["ee"])(a0);var _jDVLBitmap_CreateTexture=Module["_jDVLBitmap_CreateTexture"]=(a0,a1,a2,a3)=>(_jDVLBitmap_CreateTexture=Module["_jDVLBitmap_CreateTexture"]=wasmExports["fe"])(a0,a1,a2,a3);var _emscripten_builtin_memalign=(a0,a1)=>(_emscripten_builtin_memalign=wasmExports["ge"])(a0,a1);var __emscripten_tempret_set=a0=>(__emscripten_tempret_set=wasmExports["he"])(a0);var __emscripten_stack_restore=a0=>(__emscripten_stack_restore=wasmExports["ie"])(a0);var __emscripten_stack_alloc=a0=>(__emscripten_stack_alloc=wasmExports["je"])(a0);var _emscripten_stack_get_current=()=>(_emscripten_stack_get_current=wasmExports["ke"])();var ___cxa_is_pointer_type=a0=>(___cxa_is_pointer_type=wasmExports["le"])(a0);Module["ERRNO_CODES"]=ERRNO_CODES;Module["ccall"]=ccall;Module["cwrap"]=cwrap;Module["setViewStateManager"]=setViewStateManager;var calledRun;dependenciesFulfilled=function runCaller(){if(!calledRun)run();if(!calledRun)dependenciesFulfilled=runCaller};function run(){if(runDependencies>0){return}preRun();if(runDependencies>0){return}function doRun(){if(calledRun)return;calledRun=true;Module["calledRun"]=true;if(ABORT)return;initRuntime();if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(function(){setTimeout(function(){Module["setStatus"]("")},1);doRun()},1)}else{doRun()}}if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}run();

			// Emscripten generated code will be inserted before this line.

			/* global Browser, Module, FS, ERRNO_CODES, UTF8ToString, _jDVL_ReleaseString, console, sap */
			/* eslint-disable new-cap, camelcase */

			FS.mkdirTree("/viewer");

			function pointerToString(pointer) {
				var string = UTF8ToString(pointer);
				_jDVL_ReleaseString(pointer);
				return string;
			}

			function parseResult(pointer) {
				var string = pointerToString(pointer);
				return string.indexOf("errorcode") === 0 ? (parseInt(string.substr(15), 16) - 0x100) : JSON.parse(string);
			}

			function stringResult(pointer) {
				var string = pointerToString(pointer);
				return string.indexOf("errorcode") === 0 ? (parseInt(string.substr(15), 16) - 0x100) : string;
			}

			function makeFilename(url) {
				return escape(url.replace(/-/g, "--").replace(/\//g, "-"));
			}

			// The Settings object is used for legacy DVL API.
			/**
			 * The properties exposed in DVL Settings are used internally to track various instance properties.
			 * In general they should be considered readonly unless explicitly stated, and consumed for diagnostic purposes only.
			 *
			 * @typedef {Object} sap.ve.dvl~Settings
			 * @property {boolean} Initialised       A flag that indicates if the runtime is initialized.
			 * @property {number}  MajorVersion      Major version of the DVL library.
			 * @property {number}  MinorVersion      Minor version of the DVL library.
			 * @property {string}  CoreToken         Token of the DVL core instance.
			 * @property {string}  RendererToken     Token of the DVL renderer instance.
			 * @property {string}  LastLoadedSceneId Identifier of the last loaded model.
			 */
			Module.Settings = {
				Initialised: true,
				MajorVersion: null,
				MinorVersion: null,
				CoreToken: null,
				RendererToken: null,
				LastLoadedSceneId: null
			};

			// Client is declared first because the C++ outbound calls will call the client functions.
			// Client functions are *default* implementations and intended to be overwritten by a third party if necessary.
			var dvlClient = {
				constructor: function(clientId) {
					this._forwardToLegacyApi("Constructor", arguments);
				},

				destructor: function(clientId) {
					this._forwardToLegacyApi("Destructor", arguments);
				},

				logMessage: function(clientId, type, source, text) {
					this._forwardToLegacyApi("LogMessage", arguments);
				},

				onNodeSelectionChanged: function(clientId, sceneId, numberOfSelectedNodes, idFirstSelectedNode, rendererId) {
					this._fireNodeSelectionChanged({ clientId: clientId, sceneId: sceneId, numberOfSelectedNodes: numberOfSelectedNodes, idFirstSelectedNode: idFirstSelectedNode, rendererId: rendererId });
					this._forwardToLegacyApi("OnNodeSelectionChanged", arguments);
				},

				onNodeVisibilityChanged: function(clientId, sceneId, nodeId, newVisibility, rendererId) {
					this._fireNodeVisibilityChanged({ clientId: clientId, sceneId: sceneId, nodeId: nodeId, visible: newVisibility, rendererId: rendererId });
				},

				onStepEvent: function(clientId, type, stepId) {
					this._fireStepEvent({ clientId: clientId, type: type, stepId: stepId });
					this._forwardToLegacyApi("OnStepEvent", arguments);
				},

				onUrlClick: function (clientId, url, nodeId) {
					this._fireUrlClicked({ clientId: clientId, url: url, nodeId: nodeId });
					this._forwardToLegacyApi("OnUrlClick", arguments);
				},

				notifyFileLoadProgress: function(clientId, fProgress) {
					return this._forwardToLegacyApi("NotifyFileLoadProgress", arguments) || 1;
				},

				getDebugInfoString: function(clientId) {
					return this._forwardToLegacyApi("GetDebugInfoString", arguments) || clientId + ": from JavaScript Wrapper";
				},

				notifyFrameStarted: function(clientId, rendererId) {
					this._fireFrameStarted({ clientId: clientId, rendererId: rendererId });
					this._forwardToLegacyApi("NotifyFrameStarted", arguments);
				},

				notifyFrameFinished: function(clientId, rendererId) {
					this._fireFrameFinished({ clientId: clientId, rendererId: rendererId });
					this._forwardToLegacyApi("NotifyFrameFinished", arguments);
				},

				notifySceneLoaded: function(clientId, sceneId) {
					this._fireSceneLoaded({ clientId: clientId, sceneId: sceneId });
				},

				notifySceneFailed: function(clientId, sceneId, errorCode) {
					this._fireSceneFailed({ clientId: clientId, sceneId: sceneId, errorCode: errorCode });
				},

				////////////////////////////////////////////////////////////////////
				// BEGIN: Notification handlers.
				attachNodeSelectionChanged: function(callback, listener) {
					return this._attach("_nodeSelectionChangedListeners", callback, listener);
				},

				detachNodeSelectionChanged: function(callback, listener) {
					return this._detach("_nodeSelectionChangedListeners", callback, listener);
				},

				_fireNodeSelectionChanged: function(parameters) {
					return this._fire("_nodeSelectionChangedListeners", parameters);
				},

				attachNodeVisibilityChanged: function(callback, listener) {
					return this._attach("_nodeVisibilityChangedListeners", callback, listener);
				},

				detachNodeVisibilityChanged: function(callback, listener) {
					return this._detach("_nodeVisibilityChangedListeners", callback, listener);
				},

				_fireNodeVisibilityChanged: function(parameters) {
					return this._fire("_nodeVisibilityChangedListeners", parameters);
				},

				attachUrlClicked: function(callback, listener) {
					return this._attach("_urlClickedListeners", callback, listener);
				},

				detachUrlClicked: function(callback, listener) {
					return this._detach("_urlClickedListeners", callback, listener);
				},

				_fireUrlClicked: function(parameters) {
					return this._fire("_urlClickedListeners", parameters);
				},

				attachStepEvent: function(callback, listener) {
					return this._attach("_stepEventListeners", callback, listener);
				},

				detachStepEvent: function(callback, listener) {
					return this._detach("_stepEventListeners", callback, listener);
				},

				_fireStepEvent: function(parameters) {
					return this._fire("_stepEventListeners", parameters);
				},

				attachFrameStarted: function(callback, listener) {
					return this._attach("_frameStarted", callback, listener);
				},

				detachFrameStarted: function(callback, listener) {
					return this._detach("_frameStarted", callback, listener);
				},

				_fireFrameStarted: function(parameters) {
					return this._fire("_frameStarted", parameters);
				},

				attachFrameFinished: function(callback, listener) {
					return this._attach("_frameFinished", callback, listener);
				},

				detachFrameFinished: function(callback, listener) {
					return this._detach("_frameFinished", callback, listener);
				},

				_fireFrameFinished: function(parameters) {
					return this._fire("_frameFinished", parameters);
				},

				attachSceneLoaded: function(callback, listener) {
					return this._attach("_sceneLoaded", callback, listener);
				},

				detachSceneLoaded: function(callback, listener) {
					return this._detach("_sceneLoaded", callback, listener);
				},

				_fireSceneLoaded: function(parameters) {
					return this._fire("_sceneLoaded", parameters);
				},

				attachSceneFailed: function(callback, listener) {
					return this._attach("_sceneFailed", callback, listener);
				},

				detachSceneFailed: function(callback, listener) {
					return this._detach("_sceneFailed", callback, listener);
				},

				_fireSceneFailed: function(parameters) {
					return this._fire("_sceneFailed", parameters);
				},

				// END: Notification handlers.
				////////////////////////////////////////////////////////////////////

				////////////////////////////////////////////////////////////////////
				// BEGIN: Generic notification handlers.

				_attach: function(listenersPropName, callback, listener) {
					var listeners = this[listenersPropName] = this[listenersPropName] || [];
					if (!listeners.some(function(item) { return item.callback === callback && item.listener === listener; })) {
						listeners.push({ callback: callback, listener: listener });
					}
					return this;
				},

				_detach: function(listenersPropName, callback, listener) {
					var listeners = this[listenersPropName] || [];
					for (var i = 0; i < listeners.length; ++i) {
						var item = listeners[i];
						if (item.callback === callback && item.listener === listener) {
							listeners.splice(i, 1);
							break;
						}
					}
					return this;
				},

				_fire: function(listenersPropName, parameters) {
					(this[listenersPropName] || []).slice().forEach(function(item) {
						item.callback.call(item.listener, parameters);
					});
					return this;
				},

				_forwardToLegacyApi: function(method, args) {
					if (Module.Client && Module.Client[method]) {
						return Module.Client[method].apply(Module.Client, args);
					}
				},

				// END: Generic notification handlers.
				////////////////////////////////////////////////////////////////////

				////////////////////////////////////////////////////////////////////
				// BEGIN: Decryption related methods.

				_decryptionHandler: null,

				setDecryptionHandler: function(handler) {
					this._decryptionHandler = handler;
					return this;
				},

				getDecryptionHandler: function() {
					return this._decryptionHandler;
				}

				// END: Decryption related methods.
				////////////////////////////////////////////////////////////////////
			}; // dvlClient

			// The following functions are called from C++.
			// They need to be visible to Emscripten Module.

			function jDVLClient_Constructor(szClientID) {
				dvlClient.constructor(szClientID);
			}

			function jDVLClient_Destructor(szClientID) {
				dvlClient.destructor(szClientID);
			}

			function jDVLClient_OnNodeSelectionChanged(szClientID, szSceneID, uNumberOfSelectedNodes, idFirstSelectedNode, szRendererID) {
				dvlClient.onNodeSelectionChanged(szClientID, szSceneID, uNumberOfSelectedNodes, idFirstSelectedNode, szRendererID);
			}

			function jDVLClient_OnNodeVisibilityChanged(szClientID, szSceneID, szNodeId, bNewVisibility, szRendererID) {
				dvlClient.onNodeVisibilityChanged(szClientID, szSceneID, szNodeId, bNewVisibility, szRendererID);
			}

			function jDVLClient_OnStepEvent(szClientID, type, stepId) {
				dvlClient.onStepEvent(szClientID, type, stepId);
			}

			function jDVLClient_OnUrlClick(szClientID, type, stepId) {
				dvlClient.onUrlClick(szClientID, type, stepId);
			}

			function jDVLClient_LogMessage(szClientID, type, szSource, szText) {
				dvlClient.logMessage(szClientID, type, szSource, szText);
			}

			function jDVLClient_NotifyFileLoadProgress(szClientID, fProgress) {
				return dvlClient.notifyFileLoadProgress(szClientID, fProgress);
			}

			function jDVLClient_NotifyFrameStarted(szClientID, szRendererID) {
				dvlClient.notifyFrameStarted(szClientID, szRendererID);
			}

			function jDVLClient_NotifyFrameFinished(szClientID, szRendererID) {
				dvlClient.notifyFrameFinished(szClientID, szRendererID);
			}

			function jDVLClient_RequestCallback(callbackParam) {
				if (Module.Settings.CoreToken && Module.Settings.LoadAsync) {
					window.setTimeout(function() {
						Module.Core.ExecuteCallback(callbackParam);
					}, 0);
					return true;
				} else {
					return false;
				}
			}

			function jDVLClient_NotifySceneGeometryLoaded(szClientID, szSceneID) {
				dvlClient.notifySceneLoaded(szClientID, szSceneID);
			}

			function jDVLClient_NotifySceneGeometryFailed(szClientID, szSceneID, errorCode) {
				dvlClient.notifySceneFailed(szClientID, szSceneID, errorCode);
			}

			/**
			 * @namespace
			 * @alias sap.ve.dvl~Client
			 */
			Module.Client = {
				Constructor: function(clientId) {
					Module.print("Client.Constructor:" + clientId);
				},

				Destructor: function(clientId) {
					Module.print("Client.Destructor:" + clientId);
				},

				/**
				 * Reports a warning, error, etc.
				 * @param {string} clientId Token representing the target client instance. This is usually the canvas ID.
				 * @param {number} type     <code>[DVLCLIENTLOGTYPE]{@link sap.ve.dvl.DVLCLIENTLOGTYPE}<code> enum.
				 *                          The type of message to report (DEBUG, INFO, WARNING, ERROR).
				 * @param {string} source   Text representation of the message source. Can be <code>null</code>.
				 *                          <table class="params">
				 *                              <thead><tr><th>Source</th><th class="last">Description</th></tr></thead>
				 *                              <tr><td>OpenGL</td><td class="last">OpenGL rendering layer.</td></tr>
				 *                              <tr><td>Memory</td><td class="last">Memory management routines.</td></tr>
				 *                              <tr><td>LocalFileSystem</td><td class="last">Emscripten virtual local file system manager.</td></tr>
				 *                              <tr><td>VDS</td><td class="last">VDS file reading routines.</td></tr>
				 *                              <tr><td>Scene</td><td class="last">Scene manipulation routines.</td></tr>
				 *                          </table>
				 * @param {string} text     The text message to display. Can be <code>null</code>.
				 */
				LogMessage: function(clientId, type, source, text) {
					Module.print("Client.LogMessage:(" + text + ")");
				},

				/**
				 * Indicates that the selection list has changed.
				 * @param {string} clientId              Token representing the target client instance. This is usually the canvas ID.
				 * @param {string} sceneId               Scene token.
				 * @param {number} numberOfSelectedNodes The number of nodes selected in the list.
				 * @param {string} idFirstSelectedNode   DVLID of the first selected node, or <code>[DVLID_INVALID]{@link sap.ve.dvl.DVLID_INVALID}</code> if none selected.
				 * @deprecated since version 6.2.0. Use [attachNodeSelectionChanged]{@link sap.ve.dvl~Client.attachNodeSelectionChanged}.
				 */
				OnNodeSelectionChanged: function(clientId, sceneId, numberOfSelectedNodes, idFirstSelectedNode, rendererId) {
				},

				/**
				 * Notifies about the step phase that's just been completed.
				 * @param {string} clientId Token representing the target client instance. This is usually the canvas ID.
				 * @param {number} type     The [DVLSTEPEVENT]{@link sap.ve.dvl.DVLSTEPEVENT} type of the event that happened to the step.
				 * @param {string} stepId   The identifier of the step.
				 * @deprecated since version 6.2.0. Use [attachStepEvent]{@link sap.ve.dvl~Client.attachStepEvent}.
				 */
				OnStepEvent: function(clientId, type, stepId) {
				},

				/**
				 * Called when URL link is clicked.
				 * @param {string} clientId Token representing the target client instance. This is usually the canvas ID.
				 * @param {string} url      URL link which is clicked.
				 * @param {string} nodeId   The identifier of the node.
				 * @deprecated since version 6.2.0. Use [attachUrlClicked]{@link sap.ve.dvl~Client.attachUrlClicked}.
				 */
				OnUrlClick: function (clientId, url, nodeId) {
				},

				/**
				 * Notifies about the file loading progress (which may be quite time consuming), and to check if the user wants to abort file loading.
				 * @param {string} clientId Token representing the target client instance. This is usually the canvas ID.
				 * @param {number} progress A value from <code>0.0</code> to <code>1.0</code> indicating the file loading progress (where <code>1.0</code> means loading is complete).
				 * @returns {boolean}       Return <code>true</code> to proceed with file loading, return <code>false</code> if the loading needs to be canceled.
				 */
				NotifyFileLoadProgress: function(clientId, progress) {
					return true;
				},

				/**
				 * Displays custom information on top of rendered image together with debug information from the renderer.
				 * Only displays the information if <code>[DVLRENDEROPTION.DVLRENDEROPTION_SHOWDEBUG_INFO]{@link sap.ve.dvl.DVLRENDEROPTION}</code> is <code>ON</code>.
				 * @param {string} clientId Token representing the target client instance. This is usually the canvas ID.
				 * @returns {string}        Return <code>null</code> if you don't need to display any custom text,
				 *                          otherwise return a string with custom text if you need to display something.
				 */
				GetDebugInfoString: function(clientId) {
					return clientId + ": from JavaScript Wrapper";
				},

				/**
				 * Notifies when frame rendering has started.
				 * @param {string} clientId Token representing the target client instance. This is usually the canvas ID.
				 * @param {string} rendererId Token representing the renderer instance.
				 * @deprecated since version 6.3.0. Use [attachFrameStarted]{@link sap.ve.dvl~Client.attachFrameStarted}.
				 */
				NotifyFrameStarted: function(clientId, rendererId) {
				},

				/**
				 * Notifies when frame rendering has finished.
				 * @param {string} clientId Token representing the target client instance. This is usually the canvas ID.
				 * @param {string} rendererId Token representing the renderer instance.
				 * @deprecated since version 6.3.0. Use [attachFrameFinished]{@link sap.ve.dvl~Client.attachFrameFinished}.
				 */
				NotifyFrameFinished: function(clientId, rendererId) {
				},

				/**
				 * This callback is called when the Node Selection Changed event is fired.
				 * @callback sap.ve.dvl~Client~nodeSelectionChangedCallback
				 * @param {object} parameters                       A map of parameters. See below.
				 * @param {string} parameters.clientId              Token representing the target client instance. This is usually the canvas ID.
				 * @param {string} parameters.sceneId               Scene token.
				 * @param {number} parameters.numberOfSelectedNodes The number of selected nodes.
				 * @param {string} parameters.idFirstSelectedNode   DVLID of the first selected node, or <code>[DVLID_INVALID]{@link sap.ve.dvl.DVLID_INVALID}</code> if none selected.
				 * @param {string} parameters.rendererId            Renderer token.
				 */

				/**
				 * Attach the Node Selection Changed event listener.
				 * @param  {sap.ve.dvl~Client~nodeSelectionChangedCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                                         listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                                       <code>this</code> to allow method chaining.
				 */
				attachNodeSelectionChanged: function(callback, listener) {
					dvlClient.attachNodeSelectionChanged(callback, listener);
					return this;
				},

				/**
				 * Detach the Node Selection Changed event listener.
				 * @param  {sap.ve.dvl~Client~nodeSelectionChangedCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                                         listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                                       <code>this</code> to allow method chaining.
				 */
				detachNodeSelectionChanged: function(callback, listener) {
					dvlClient.detachNodeSelectionChanged(callback, listener);
					return this;
				},

				/**
				 * This callback is called when the Node Visibility Changed event is fired.
				 * @callback sap.ve.dvl~Client~nodeVisibilityChangedCallback
				 * @param {object}  parameters            A map of parameters. See below.
				 * @param {string}  parameters.clientId   Token representing the target client instance. This is usually the canvas ID.
				 * @param {string}  parameters.sceneId    Scene token.
				 * @param {string}  parameters.nodeId     The ID of the node.
				 * @param {boolean} parameters.visible    The new visibility state of the node.
				 * @param {string}  parameters.rendererId Renderer token.
				 */

				/**
				 * Attach the Node Visibility Changed event listener.
				 * @param  {sap.ve.dvl~Client~nodeVisibilityChangedCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                                          listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                                        <code>this</code> to allow method chaining.
				 */
				attachNodeVisibilityChanged: function(callback, listener) {
					dvlClient.attachNodeVisibilityChanged(callback, listener);
					return this;
				},

				/**
				 * Detach the Node Visibility Changed event listener.
				 * @param  {sap.ve.dvl~Client~nodeVisibilityChangedCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                                          listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                                        <code>this</code> to allow method chaining.
				 */
				detachNodeVisibilityChanged: function(callback, listener) {
					dvlClient.detachNodeVisibilityChanged(callback, listener);
					return this;
				},

				/**
				 * This callback is called when the URL Clicked event is fired.
				 * @callback sap.ve.dvl~Client~urlClickedCallback
				 * @param {object} parameters          A map of parameters. See below.
				 * @param {string} parameters.clientId Token representing the target client instance. This is usually the canvas ID.
				 * @param {string} parameters.url      A URL that was clicked on.
				 * @param {string} parameters.nodeId   A node ID that was clicked on.
				 */

				/**
				 * Attach the URL Clicked event listener.
				 * @param  {sap.ve.dvl~Client~urlClickedCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                               listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                             <code>this</code> to allow method chaining.
				 */
				attachUrlClicked: function(callback, listener) {
					dvlClient.attachUrlClicked(callback, listener);
					return this;
				},

				/**
				 * Detach the URL Clicked event listener.
				 *
				 * The passed function and listener object must match the ones used for event registration.
				 * @param  {sap.ve.dvl~Client~urlClickedCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                               listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                             <code>this</code> to allow method chaining.
				 */
				detachUrlClicked: function(callback, listener) {
					dvlClient.detachUrlClicked(callback, listener);
					return this;
				},

				/**
				 * This callback is called when the Step Event is fired.
				 * @callback sap.ve.dvl~Client~stepEventCallback
				 * @param {object} parameters          A map of parameters. See below.
				 * @param {string} parameters.clientId Token representing the target client instance. This is usually the canvas ID.
				 * @param {number} parameters.type     The [DVLSTEPEVENT]{@link sap.ve.dvl.DVLSTEPEVENT} type of the event that happened to the step.
				 * @param {string} parameters.stepId   The identifier of the step.
				 */

				/**
				 * Attach the Step Event listener.
				 * @param  {sap.ve.dvl~Client~stepEventCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                              listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                            <code>this</code> to allow method chaining.
				 */
				attachStepEvent: function(callback, listener) {
					dvlClient.attachStepEvent(callback, listener);
					return this;
				},

				/**
				 * Detach the Step Event listener.
				 * @param  {sap.ve.dvl~Client~stepEventCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                              listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                            <code>this</code> to allow method chaining.
				 */
				detachStepEvent: function(callback, listener) {
					dvlClient.detachStepEvent(callback, listener);
					return this;
				},

				/**
				 * This callback is called when the Frame Started event is fired.
				 * @callback sap.ve.dvl~Client~frameStartedCallback
				 * @param {object} parameters            A map of parameters. See below.
				 * @param {string} parameters.clientId   Token representing the target client instance. This is usually the canvas ID.
				 * @param {string} parameters.rendererId Token representing the renderer instance.
				 */

				/**
				 * Attach the Frame Started event listener.
				 * @param {sap.ve.dvl~Client~frameStartedCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                                listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                              <code>this</code> to allow method chaining.
				 */
				attachFrameStarted: function(callback, listener) {
					dvlClient.attachFrameStarted(callback, listener);
					return this;
				},

				/**
				 * Detach the Frame Started event listener.
				 * @param  {sap.ve.dvl~Client~frameStartedCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                                 listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                               <code>this</code> to allow method chaining.
				 */
				detachFrameStarted: function(callback, listener) {
					dvlClient.detachFrameStarted(callback, listener);
					return this;
				},

				/**
				 * This callback is called when the Frame Finished event is fired.
				 * @callback sap.ve.dvl~Client~frameFinishedCallback
				 * @param {object} parameters            A map of parameters. See below.
				 * @param {string} parameters.clientId   Token representing the target client instance. This is usually the canvas ID.
				 * @param {string} parameters.rendererId Token representing the renderer instance.
				 */

				/**
				 * Attach the Frame Finished event listener.
				 * @param {sap.ve.dvl~Client~frameFinishedCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                                 listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                               <code>this</code> to allow method chaining.
				 */
				attachFrameFinished: function(callback, listener) {
					dvlClient.attachFrameFinished(callback, listener);
					return this;
				},

				/**
				 * Detach the Frame Finished event listener.
				 * @param  {sap.ve.dvl~Client~frameFinishedCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                                  listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                                <code>this</code> to allow method chaining.
				 */
				detachFrameFinished: function(callback, listener) {
					dvlClient.detachFrameFinished(callback, listener);
					return this;
				},


				/**
				 * Attach the Scene Loaded event listener.
				 * @param  {sap.ve.dvl~Client~sceneLoadedCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                                listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                     <code>this</code> to allow method chaining.
				 */
				attachSceneLoaded: function(callback, listener) {
					dvlClient.attachSceneLoaded(callback, listener);
					return this;
				},

				/**
				 * Detach the Scene Loaded event listener.
				 * @param  {sap.ve.dvl~Client~sceneLoadedCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                                listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                     <code>this</code> to allow method chaining.
				 */
				detachSceneLoaded: function(callback, listener) {
					dvlClient.detachSceneLoaded(callback, listener);
					return this;
				},

				/**
				 * Attach the Scene Failed event listener.
				 * @param  {sap.ve.dvl~Client~sceneFailedCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                                listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                     <code>this</code> to allow method chaining.
				 */
				attachSceneFailed: function(callback, listener) {
					dvlClient.attachSceneFailed(callback, listener);
					return this;
				},

				/**
				 * Detach the Scene Failed event listener.
				 * @param  {sap.ve.dvl~Client~sceneFailedCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                                listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                     <code>this</code> to allow method chaining.
				 */
				detachSceneFailed: function(callback, listener) {
					dvlClient.detachSceneFailed(callback, listener);
					return this;
				},

				/**
				 * @interface Contract for objects that implement decryption.
				 *
				 * An interface for an object provided by an application to decrypt content of encrypted models.
				 *
				 * Content is encrypted with the [AES128]{@link https://en.wikipedia.org/wiki/Advanced_Encryption_Standard} algorithm
				 * in the [CBC]{@link https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Cipher_Block_Chaining_.28CBC.29} mode.
				 *
				 * A key is derived with the [PBKDF2]{@link https://en.wikipedia.org/wiki/PBKDF2} algorithm by applying the
				 * [HMAC]{@link https://en.wikipedia.org/wiki/Hash-based_message_authentication_code}-[SHA256]{@link https://en.wikipedia.org/wiki/SHA-2}
				 * function 10,000 times.
				 *
				 * @example <caption>A sample implementation and usage of the sap.ve.dvl.DecryptionHandler interface with the [asmCrypto]{@link https://github.com/vibornoff/asmcrypto.js} library.</caption>
				 *
				 *   ...
				 *   <script src="http://vibornoff.com/asmcrypto.js"></script>
				 *   ...
				 *   var decryptionHandler = {
				 *       deriveKey: function(salt, password) {
				 *           try {
				 *               return asmCrypto.PBKDF2_HMAC_SHA256.bytes(password, salt, 10000, 16);
				 *           } catch (ex) {
				 *               return null;
				 *           }
				 *       },
				 *       decrypt: function(key, iv, input) {
				 *           try {
				 *               return asmCrypto.AES_CBC.decrypt(input, key, true, iv);
				 *           } catch (ex) {
				 *               return null;
				 *           }
				 *       }
				 *   };
				 *   ...
				 *   var dvl = ...
				 *   dvl.Client.setDecryptionHandler(decryptionHandler);
				 *   ...
				 *
				 * @name sap.ve.dvl.DecryptionHandler
				 * @public
				 */

				/**
				 * Generates a cryptographic session key derived from a base data value.
				 *
				 * The key must be derived with the [PBKDF2]{@link https://en.wikipedia.org/wiki/PBKDF2} algorithm by applying the
				 * [HMAC]{@link https://en.wikipedia.org/wiki/Hash-based_message_authentication_code}-[SHA256]{@link https://en.wikipedia.org/wiki/SHA-2}
				 * function 10,000 times.
				 *
				 * The resulting 128-bit key should be passed to subseqeunt calls to [sap.ve.dvl.DecryptionHandler.decrypt]{@link sap.ve.dvl.DecryptionHandler#decrypt}.
				 *
				 * @name sap.ve.dvl.DecryptionHandler.prototype.deriveKey
				 * @function
				 * @param {Uint8Array} salt Random data that is used as an additional input to a one-way function that "hashes" a password or passphrase.
				 * @param {Uint8Array} password A password used for encryption/decryption.
				 * @return {object} A derived 128-bit key that should be passed to subsequent calls to [sap.ve.dvl.DecryptionHandler.decrypt]{@link sap.ve.dvl.DecryptionHandler#decrypt}.
				 * @public
				 */

				/**
				 * Decrypts the input buffer with the [AES128]{@link https://en.wikipedia.org/wiki/Advanced_Encryption_Standard} algorithm
				 * in the [CBC]{@link https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Cipher_Block_Chaining_.28CBC.29} mode.
				 *
				 * @name sap.ve.dvl.DecryptionHandler.prototype.decrypt
				 * @function
				 * @param {object} key The derived key generated by the previous call to [sap.ve.dvl.DecryptionHandler.deriveKey]{@link sap.ve.dvl.DecryptionHandler#deriveKey}.
				 * @param {Uint8Array} iv The 128-bit [initialization vector]{@link https://en.wikipedia.org/wiki/Initialization_vector}.
				 * @param {Uint8Array} encryptedData The encrypted buffer.
				 * @return {Uint8Array} The decrypted buffer.
				 * @public
				 */

				/**
				 * Sets an object that decrypts content of encrypted models.
				 * @param {sap.ve.dvl.DecryptionHandler} handler An object that decrypts content of encrypted models.
				 * @return {sap.ve.dvl~Client}                   <code>this</code> to allow method chaining.
				 */
				setDecryptionHandler: function(handler) {
					dvlClient.setDecryptionHandler(handler);
					return this;
				},

				/**
				 * Gets an object that decrypts content of encrypted models.
				 * @return {sap.ve.dvl.DecryptionHandler} An object that decrypts content of encrypted models.
				 */
				getDecryptionHandler: function() {
					return dvlClient.getDecryptionHandler();
				}
			}; // Module.Client

			function checkMetadata(path, metadata, mode, str) {
				for (var key in metadata) {
					var value = metadata[key];
					if (typeof value === "string") {
						var name = path + key + "==" + value;
						switch (mode) {
						case 0: //DVLFINDNODEMODE_EQUAL
							if (name == str) {
								console.log(name);
								return true;
							}
							break;
						case 1: //DVLFINDNODEMODE_EQUAL_CASE_INSENSITIVE
							if (name.toLowerCase() == str) {
								console.log(name);
								return true;
							}
							break;
						case 2: //DVLFINDNODEMODE_SUBSTRING
							if (name.indexOf(str) != -1) {
								console.log(name);
								return true;
							}
							break;
						case 3: //DVLFINDNODEMODE_SUBSTRING_CASE_INSENSITIVE
							if (name.toLowerCase().indexOf(str) != -1) {
								console.log(name);
								return true;
							}
							break;
						case 4: //DVLFINDNODEMODE_STARTS_WITH
							if (name.startsWith(str)) {
								console.log(name);
								return true;
							}
							break;
						case 5: //DVLFINDNODEMODE_STARTS_WITH_CASE_INSENSITIVE
							if (name.toLowerCase().startsWith(str)) {
								console.log(name);
								return true;
							}
							break;
						}
					} else {
						if (checkMetadata(path + key + "/", value, mode, str)) {
							//console.log(key);
							return true;
						}
					}
				}

				return false;
			}

			/**
			 * @namespace
			 * @alias sap.ve.dvl~Scene
			 */
			Module.Scene = {
				/**
				 * Retrieves information about the current scene.
				 * @param {string}                  sceneId Scene token.
				 * @param {sap.ve.dvl.DVLSCENEINFO} flags   Bitfield combination of one or more [DVLSCENEINFO]{@link sap.ve.dvl.DVLSCENEINFO} flags.
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an object with the following structure depending on flags:<br>
				 * <pre>
				 * {
				 *      "ChildNodes":         [string, ...],
				 *      "SelectedNodes":      [string, ...],
				 *      "LocalizationPrefix": string,
				 *      "SceneDimensions":    [number, number, number, number, number, number],
				 *      "StepId":             string,
				 *      "StepTime":           number,
				 *      "Layers":             [string, ...]
				 * }
				 * </pre>
				 */
				RetrieveSceneInfo: function(sceneId, flags) {
					return parseResult(Module.ccall("jDVLScene_RetrieveSceneInfo", "number", ["string", "number"], [sceneId, flags]));
				},

				/**
				 * Used for checking the node selection state. For example, "Show selected nodes" is only available if there is at least 1 invisible node selected.
				 * @param {string} sceneId Scene token.
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an object with the following structure:<br>
				 * <pre>
				 * {
				 *      "HiddenSelectedNodesCount":  number,
				 *      "TotalSelectedNodesCount":   number,
				 *      "VisibleSelectedNodesCount": number
				 * }
				 * </pre>
				 */
				GetNodeSelectionInfo: function(sceneId) {
					return parseResult(Module.ccall("jDVLScene_GetNodeSelectionInfo", "number", ["string"], [sceneId]));
				},

				/**
				 * Executes a particular action on the current scene.
				 * @param {string}                    sceneId Scene token.
				 * @param {sap.ve.dvl.DVLSCENEACTION} action  The action to execute.
				 */
				PerformAction: function(sceneId, action) {
					Module.ccall("jDVLScene_PerformAction", null, ["string", "number"], [sceneId, action]);
				},

				/**
				 * Retrieves information about a particular node.
				 * @param {string}                 sceneId Scene token.
				 * @param {string}                 dvlId   The node ID.
				 * @param {sap.ve.dvl.DVLNODEINFO} flags   Bitfield combination of one or more [DVLNODEINFO]{@link sap.ve.dvl.DVLNODEINFO} flags.
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an object with the following structure depending on flags:<br>
				 * <pre>
				 * {
				 *      "NodeName":       string,
				 *      "AssetID":        string,
				 *      "UniqueID":       string,
				 *      "ParentNodes":    [string, ...],
				 *      "ChildNodes":     [string, ...],
				 *      "Flags":          number,
				 *      "Opacity":        number,
				 *      "HighlightColor": number,
				 *      "URIs":           [string, ...]
				 * }
				 * </pre>
				 */
				RetrieveNodeInfo: function(sceneId, dvlid, flags) {
					return parseResult(Module.ccall("jDVLScene_RetrieveNodeInfo", "number", ["string", "string", "number"], [sceneId, dvlid, flags]));
				},

				/**
				 * Retrieves metadata for the specified node.
				 * @param {string} sceneId Scene token.
				 * @param {string} dvlId   The node ID.
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an object with the following structure:<br>
				 * <pre>
				 * {
				 *      "metadata": {
				 *          [JSON]
				 *      }
				 * }
				 * </pre>
				 */
				RetrieveMetadata: function(sceneId, dvlid) {
					return parseResult(Module.ccall("jDVLScene_RetrieveMetadata", "number", ["string", "string"], [sceneId, dvlid]));
				},

				/**
				 * Retrieves VEID (Visual Enterprise ID) for the specified node.
				 * @param {string} sceneId Scene token.
				 * @param {string} dvlId   The node ID.
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an array of objects with the following structure:<br>
				 * <pre>
				 * {
				 *     "type":   string,
				 *     "source": string,
				 *     "fields": [
				 *         {
				 *             "name":  string,
				 *             "value": string
				 *         },
				 *         ...
				 *     ]
				 * }
				 * </pre>
				 */
				RetrieveVEIDs: function(sceneId, dvlid) {
					return parseResult(Module.ccall("jDVLScene_RetrieveVEIDs", "number", ["string", "string"], [sceneId, dvlid]));
				},

				/**
				 * Retrieves information about a particular Layer.
				 * @param {string} sceneId - Token returned from {@link Module.Core.LoadScene LoadScene}.
				 * @param {string} dvlId - The ID of the Layer.
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an object with the following structure:<br>
				 * <pre>
				 * {
				 *     "name":           string,
				 *     "description":    string,
				 *     "isHotspotLayer": boolean,
				 *     "nodes":          [string, ...]
				 * }
				 * </pre>
				 */
				RetrieveLayerInfo: function(sceneId, dvlid) {
					return parseResult(Module.ccall("jDVLScene_RetrieveLayerInfo", "number", ["string", "string"], [sceneId, dvlid]));
				},

				/**
				 * Retrieves a thumbnail of the specified step as a Base64 encoded string.
				 * @param {string} sceneId Scene token.
				 * @param {string} dvlId   The step ID.
				 * @returns {string|sap.ve.dvl.DVLRESULT} An image encoded as a Base64 string or an error code if fails.
				 */
				RetrieveThumbnail: function(sceneId, dvlid) {
					return stringResult(Module.ccall("jDVLScene_RetrieveThumbnail", "number", ["string", "string"], [sceneId, dvlid]));
				},

				/**
				 * Builds a parts list based on input parameter constraints.
				 * @param {string}                      sceneId              Scene token.
				 * @param {number}                      maxParts             Maximum number of parts required.
				 * @param {number}                      maxNodesInSinglePart Maximum number of nodes in a single part to be saved. If more nodes belong to a part, they will be ignored.
				 * @param {number}                      MaxPartNameLength    Maximum length of part name.
				 * @param {sap.ve.dvl.DVLPARTSLISTTYPE} type                 The type of parts to search for.
				 * @param {sap.ve.dvl.DVLPARTSLISTSORT} sort                 Specifies how to sort the parts list.
				 * @param {string}                      dvlidConsumedStep    The DVLID of the step for which to build the parts list. Only used when type is <code>DVLPARTSLISTTYPE_CONSUMED_BY_STEP</code>, set to <code>[DVLID_INVALID]{@link sap.ve.dvl.DVLID_INVALID}</code> or any other value if not.
				 * @param {string}                      substring            Only parts that include substring are returned.
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an object with the following structure.<br>
				 * <pre>
				 * {
				 *      "parts": [
				 *          {
				 *              "name":  string,
				 *              "nodes": [string, ...]
				 *          },
				 *          ...
				 *      ]
				 * }
				 * </pre>
				 */
				BuildPartsList: function(sceneId, maxParts, maxNodesInSinglePart, maxPartNameLength, type, sort, dvlidConsumedStep, substring) {
					return parseResult(Module.ccall("jDVLScene_BuildPartsList", "number",
						["string", "number", "number", "number", "number", "number", "string", "string"],
						[sceneId, maxParts, maxNodesInSinglePart, maxPartNameLength, type, sort, dvlidConsumedStep, substring]));
				},

				/**
				 * Finds a list of scene nodes by matching them using a string parameter (different search types are possible: by node name, asset ID or unique ID).
				 * @param {string}                     sceneId Scene token.
				 * @param {sap.ve.dvl.DVLFINDNODETYPE} type    Specifies what node information to use in the search.
				 * @param {sap.ve.dvl.DVLFINDNODEMODE} mode    Specifies the method to use for finding nodes.
				 * @param {string}                     str     String identifier to search on (depends on the value specified for the "<code>type</code>" parameter).
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an object with the following structure:<br>
				 * <pre>
				 * {
				 *      "nodes": [string, ...]
				 * }
				 * </pre>
				 */
				FindNodes: function(sceneId, type, mode, str) {
					if (type == DvlEnums.DVLFINDNODETYPE.DVLFINDNODETYPE_METADATA) {
						if (typeof mode !== "number" || typeof str !== "string") {
							return DvlEnums.DVLRESULT.BADARG;
						}

						var res = parseResult(Module.ccall("jDVLScene_FindNodes", "number", ["string", "number", "number", "string"],
								[sceneId, DvlEnums.DVLFINDNODETYPE.DVLFINDNODETYPE_NODE_NAME, DvlEnums.DVLFINDNODEMODE.DVLFINDNODEMODE_SUBSTRING, ""]));
						if (typeof res === "number" || !res.hasOwnProperty("nodes")) {
							return res;
						}

						if (mode % 2) {
							str = str.toLowerCase();
						}

						var out = {nodes:[]};
						for (var i = 0; i < res.nodes.length; i++) {
							var metadata = parseResult(Module.ccall("jDVLScene_RetrieveMetadata", "number", ["string", "string"], [sceneId, res.nodes[i]]));
							if (typeof metadata === "number" || !metadata.hasOwnProperty("metadata")) {
								continue;
							}

							if (checkMetadata("", metadata.metadata, mode, str)) {
								console.log(res.nodes[i]);
								out.nodes.push(res.nodes[i]);
							}
						}

						return out;
					} else {
						return parseResult(Module.ccall("jDVLScene_FindNodes", "number",
							["string", "number", "number", "string"],
							[sceneId, type, mode, str]));
					}
				},

				/**
				 * Retrieves a list of procedures and portfolios in the scene.
				 * @param {string} sceneId Scene token.
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an object with the following structure:<br>
				 * <pre>
				 * {
				 *      "procedures": [
				 *          {
				 *              "name": string,
				 *              "id":   string,
				 *              "steps": [
				 *                  {
				 *                      "name":        string,
				 *                      "id":          string,
				 *                      "description": string
				 *                  },
				 *                  ...
				 *              ]
				 *          },
				 *          ...
				 *      ],
				 *      "portfolios": [
				 *          {
				 *              "name": string,
				 *              "id":   string,
				 *              "steps": [
				 *                  {
				 *                      "name":        string,
				 *                      "id":          string,
				 *                      "description": string
				 *                  },
				 *                  ...
				 *              ]
				 *          },
				 *          ...
				 *      ]
				 * }
				 * </pre>
				 */
				RetrieveProcedures: function(sceneId) {
					return parseResult(Module.ccall("jDVLScene_RetrieveProcedures", "number", ["string"], [sceneId]));
				},

				/**
				 * Activates a step by playing its animation. Optionally plays steps that come after this step.
				 * @param {string}  sceneId           Scene token.
				 * @param {string}  dvlId             The identifier of the step or model view to activate.
				 * @param {boolean} fromTheBeginning  Play the step from beginning, or from the currently paused position.
				 * @param {boolean} continueToTheNext What to do after the current step has finished playing: play the next steps, or stop.
				 * @param {number}  stepTime          The time at which the step animation starts (in seconds). By default, <code>stepTime</code> is set to <code>-1</code>.<br>
				 *                                    Providing a negative value results in a cross-fade transition to the step to activate,
				 *                                    and starts playing that step from time = 0.
				 *                                    Providing a value of 0 or more will instantaneously switch to the camera orientation of the step to activate,
				 *                                    and starts playing that step from time = 0.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				ActivateStep: function(sceneId, dvlid, fromTheBeginning, continueToTheNext, stepTime) {
					return Module.ccall("jDVLScene_ActivateStep", "number", ["string", "string", "boolean", "boolean", "number"], [sceneId, dvlid, fromTheBeginning, continueToTheNext, typeof stepTime !== "undefined" ? stepTime : -1]);
				},

				RetrieveOutputSettings: function(sceneId, dvlid) {
					return parseResult(Module.ccall("jDVLScene_RetrieveOutputSettings", "number", ["string", "string"], [sceneId, dvlid]));
				},

				/**
				 * Pauses the current step, if any.
				 * @param {string} sceneId Scene token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				PauseCurrentStep: function(sceneId) {
					return Module.ccall("jDVLScene_PauseCurrentStep", "number", ["string"], [sceneId]);
				},

				/**
				 * Changes some node flags.
				 * @param {string}                      sceneId Scene token.
				 * @param {string}                      dvlId   The node ID.
				 * @param {sap.ve.dvl.DVLNODEFLAG}      flags   Bitfield combination of one or more [DVLNODEFLAG]{@link sap.ve.dvl.DVLNODEFLAG} flags.
				 * @param {sap.ve.dvl.DVLFLAGOPERATION} flagop  The flag operarion to apply.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				ChangeNodeFlags: function(sceneId, dvlid, flags, flagop) { //DVLFLAGOPERATION flagop
					return Module.ccall("jDVLScene_ChangeNodeFlags", "number", ["string", "string", "number", "number"], [sceneId, dvlid, flags, flagop]);
				},

				/**
				 * Sets the opacity for a specified node.
				 * @param {string} sceneId Scene token.
				 * @param {string} dvlId   The node ID.
				 * @param {number} opacity Opacity amount. The value can be anywhere from <code>0.0</code> (fully transparent) to <code>1.0</code> (fully opaque).
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				SetNodeOpacity: function(sceneId, dvlid, opacity) {
					return Module.ccall("jDVLScene_SetNodeOpacity", "number", ["string", "string", "number"], [sceneId, dvlid, opacity]);
				},

				/**
				 * Sets the highlight color for a node.
				 * @param {string} sceneId Scene token.
				 * @param {string} dvlId   The node ID.
				 * @param {number} color   Highlight color value (32-bit ABGR, where A is amount of blending between material color and highlight color).
				 *                         Make sure you set the 'A' component to a non-zero value, otherwise the highlight will not be visible (as the amount would be '0').
				 *                         For example, <code>0xFF0000FF</code> gives 100% red highlight, and <code>0x7F00FF00</code> gives 50% green highlight. Set "color" to <code>0</code> to clear highlighting.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				SetNodeHighlightColor: function(sceneId, dvlid, color) {
					return Module.ccall("jDVLScene_SetNodeHighlightColor", "number", ["string", "string", "number"], [sceneId, dvlid, color]);
				},

				/**
				 * Retrieves a node's world matrix. This matrix is re-evaluated every frame during animation.
				 * If you specify the matrix via [SetNodeWorldMatrix]{@link sap.ve.dvl~Scene.SetNodeWorldMatrix}, it will override node matrix until [SetNodeWorldMatrix]{@link sap.ve.dvl~Scene.SetNodeWorldMatrix}(id, null) is performed.
				 * @param {string} sceneId Scene token.
				 * @param {string} dvlId   The node ID.
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an object with the following structure:<br>
				 * <pre>
				 * {
				 *      "matrix": [number, ...] // A 4x4 matrix, 16 numbers
				 * }
				 * </pre>
				 */
				GetNodeWorldMatrix: function(sceneId, dvlid) {
					return parseResult(Module.ccall("jDVLScene_GetNodeWorldMatrix", "number", ["string", "string"], [sceneId, dvlid]));
				},

				/**
				 * Sets a node's world matrix. If you set the matrix with this call, it will override node matrix evaluation. Animation for this node will not play.
				 * @param {string}   sceneId  Scene token.
				 * @param {string}   dvlId    The node ID.
				 * @param {number[]} [matrix] A 4x4 matrix, 16 numbers.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				SetNodeWorldMatrix: function(sceneId, dvlid, matrix) {
					var result;
					if (matrix) {
						var buf = Module._malloc(16 * Float32Array.BYTES_PER_ELEMENT);
						Module.HEAPF32.set(matrix, buf / Float32Array.BYTES_PER_ELEMENT);
						result = Module.ccall("jDVLScene_SetNodeWorldMatrix", "number", ["string", "string", "number"], [sceneId, dvlid, buf]);
						Module._free(buf);
					} else {
						result = Module.ccall("jDVLScene_SetNodeWorldMatrix", "number", ["string", "string", "number"], [sceneId, dvlid, null]);
					}
					return result;
				},

				/**
				 * Retrieves the local matrix for the specified node.
				 * @param {string} sceneId Scene token.
				 * @param {string} dvlId   The node ID.
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an object with the following structure.<br>
				 * <pre>
				 * {
				 *      "matrix": [number, ...] // A 4x4 matrix, 16 numbers
				 * }
				 * </pre>
				 */
				GetNodeLocalMatrix: function(sceneId, dvlid) {
					return parseResult(Module.ccall("jDVLScene_GetNodeLocalMatrix", "number", ["string", "string"], [sceneId, dvlid]));
				},

				/**
				 * Sets the local matrix for the specified node.
				 * @param {string}   sceneId  Scene token.
				 * @param {string}   dvlId    The node ID.
				 * @param {number[]} [matrix] A 4x4 matrix, 16 numbers.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				SetNodeLocalMatrix: function(sceneId, dvlid, matrix) {
					var result;
					if (matrix) {
						var buf = Module._malloc(16 * Float32Array.BYTES_PER_ELEMENT);
						Module.HEAPF32.set(matrix, buf / Float32Array.BYTES_PER_ELEMENT);
						result = Module.ccall("jDVLScene_SetNodeLocalMatrix", "number", ["string", "string", "number"], [sceneId, dvlid, buf]);
						Module._free(buf);
					} else {
						result = Module.ccall("jDVLScene_SetNodeLocalMatrix", "number", ["string", "string", "number"], [sceneId, dvlid, null]);
					}
					return result;
				},

				/**
				 * Retrieves a material with given name.
				 * @param {string} sceneId Scene token.
				 * @param {string} name    The name of material.
				 * @returns {string} Material token.
				 * @private
				 */
				GetMaterialByName: function(sceneId, name) {
					return pointerToString(Module.ccall("jDVLScene_GetMaterialByName", "number", ["string", "string"], [sceneId, name]));
				},

				/**
				 * Retrieves sub mesh count.
				 * @param {string} sceneId Scene token.
				 * @param {string} nodeId  The node ID.
				 * @returns {number} Sub mesh count.
				 * @private
				 */
				GetNodeSubmeshesCount : function(sceneId, nodeId) {
					return Module.ccall("jDVLScene_GetNodeSubmeshesCount", "number", ["string", "string"], [sceneId, nodeId]);
				},

				/**
				 * Retrieves the material for the specified submesh.
				 * @param {string} sceneId      Scene token.
				 * @param {string} nodeId       The node ID.
				 * @param {number} subMeshIndex Index of the submesh.
				 * @returns {string} Material token.
				 * @private
				 */
				GetNodeSubmeshMaterial : function(sceneId, nodeId, subMeshIndex) {
					return pointerToString(Module.ccall("jDVLScene_GetNodeSubmeshMaterial", "number", ["string", "string", "number"], [sceneId, nodeId, subMeshIndex]));
				},

				/**
				 * Sets the material for the specified submesh.
				 * @param {string} sceneId      Scene token.
				 * @param {string} nodeId       The node ID.
				 * @param {number} subMeshIndex Index of the submesh.
				 * @param {string} materialId   Material token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 * @private
				 */
				SetNodeSubmeshMaterial : function(sceneId, nodeId, subMeshIndex, materialId) {
					return Module.ccall("jDVLScene_SetNodeSubmeshMaterial", "number", ["string", "string", "number", "string"], [sceneId, nodeId, subMeshIndex, materialId]);
				},

				/**
				 * Retrieves the current scene camera.
				 * @param {string} sceneId Scene token.
				 * @returns {string|sap.ve.dvl.DVLRESULT} Camera token or an error code if fails.
				 * @private
				 */
				GetCurrentCamera: function(sceneId) {
					return stringResult(Module.ccall("jDVLScene_GetCurrentCamera", "number", ["string"], [sceneId]));
				},

				/**
				 * Creates a new camera in the scene.
				 * @param {string}                         sceneId    Scene token.
				 * @param {sap.ve.dvl.DVLCAMERAPROJECTION} projection The camera projection type.
				 * @param {string}                         parentId   The node ID of the parent node where the camera node will be added.
				 * @returns {string|sap.ve.dvl.DVLRESULT} Camera token or an error code if fails.
				 * @private
				 */
				CreateCamera: function(sceneId, projection, parentId) {
					return stringResult(Module.ccall("jDVLScene_CreateCamera", "number", ["string", "number", "string"], [sceneId, projection, parentId]));
				},

				/**
				 * Activates a camera in the scene.
				 * @param {string} sceneId  Scene token.
				 * @param {string} cameraId The node ID of the camera node.
				 * @param {number} crossFadeSeconds Time to perform the "fly to" animation. Set to 0 to do this immediately.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 * @private
				 */
				ActivateCamera: function(sceneId, cameraId, crossFadeSeconds) {
					return Module.ccall("jDVLScene_ActivateCamera", "number", ["string", "string", "number"], [sceneId, cameraId, crossFadeSeconds]);
				},

				/**
				 * Executes a query.
				 * @param {string}                sceneId Scene token.
				 * @param {sap.ve.dvl.DVLEXECUTE} type    Query type.
				 * @param {string}                str     Query string, see [DVLEXECUTE]{@link sap.ve.dvl.DVLEXECUTE} for string format.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				Execute: function(sceneId, type, str) { //DVLEXECUTE type
					return Module.ccall("jDVLScene_Execute", "number", ["string", "number", "string"], [sceneId, type, str]);
				},

				/**
				 * Releases the scene, and deletes it if the reference count is zero.
				 * @param {string} sceneId Scene token.
				 */
				Release: function(sceneId) {
					Module.ccall("jDVLScene_Release", null, ["string"], [sceneId]);
				},

				/**
				 * Copies a node.
				 * @param {string} sceneId      Scene token.
				 * @param {string} nodeId       The ID of the node to copy.
				 * @param {string} parentNodeId The ID of the parent node where the copied node will be added to.
				 * @param {number} flags        A combination of [DVLCREATENODECOPYFLAG]{@link sap.ve.dvl.DVLCREATENODECOPYFLAG} flags.
				 * @param {string} nodeName     The name of the created node.
				 * @param {string} insertBeforeNodeId The created node is added before this specified node.
				 * @returns {string} The ID of the created node.
				 */
				CreateNodeCopy: function(sceneId, nodeId, parentNodeId, flags, nodeName, insertBeforeNodeId) {
					return pointerToString(Module.ccall("jDVLScene_CreateNodeCopy", "number", ["string", "string", "string", "number", "string", "string"], [sceneId, nodeId, parentNodeId, flags, nodeName, typeof insertBeforeNodeId !== "undefined" ? insertBeforeNodeId : sap.ve.dvl.DVLID_INVALID]));
				},

				/**
				 * Creates a new node.
				 * @param {string} sceneId            Scene token.
				 * @param {string} parentNodeId       The ID of the parent node where the created node is added to.
				 * @param {string} nodeName           The name of the created node.
				 * @param {string} insertBeforeNodeId The created node is added before this specified node.
				 * @returns {string} The ID of the created node.
				 */
				CreateNode: function(sceneId, parentNodeId, nodeName, insertBeforeNodeId) {
					return pointerToString(Module.ccall("jDVLScene_CreateNode", "number", ["string", "string", "string", "string"], [sceneId, parentNodeId, nodeName, typeof insertBeforeNodeId !== "undefined" ? insertBeforeNodeId : sap.ve.dvl.DVLID_INVALID]));
				},

				/**
				 * Deinstances the specified node content.
				 * @param {string} sceneId Scene token.
				 * @param {string} nodeId  The ID of the node to be deinstanced.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				DeinstanceContent: function(sceneId, nodeId) {
					return Module.ccall("jDVLScene_DeinstanceContent", "number", ["string", "string"], [sceneId, nodeId]);
				},

				/**
				 * Deletes the specified node.
				 * @param {string} sceneId Scene token.
				 * @param {string} nodeId  The ID of the node to be deleted.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				DeleteNode: function(sceneId, nodeId) {
					return Module.ccall("jDVLScene_DeleteNode", "number", ["string", "string"], [sceneId, nodeId]);
				},

				/**
				 * Merge second scene to main scene.
				 * @param {string} mainSceneId main scene token.
				 * @param {string} secondSceneId  second scene token.
				 * @param {string} nodeId  The ID of the node in main scene under which the nodes of second scene to be placed
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				Merge: function(mainSceneId, secondSceneId, nodeId) {
					return Module.ccall("jDVLScene_Merge", "number", ["string", "string", "string"], [mainSceneId, secondSceneId, nodeId]);
				}

			}; // Module.Scene

			/**
			 * @namespace
			 * @alias sap.ve.dvl~Material
			 * @private
			 */
			Module.Material = {
				GetName: Module.cwrap("jDVLMaterial_GetName", "string", ["string"]),                              // function(materialId)
				GetColorParam: Module.cwrap("jDVLMaterial_GetColorParam", "number", ["string", "number"]),        // function(materialId, param)
				SetColorParam: Module.cwrap("jDVLMaterial_SetColorParam", null, ["string", "number", "number"]),  // function(materialId, param, color)
				GetScalarParam: Module.cwrap("jDVLMaterial_GetScalarParam", "number", ["string", "number"]),      // function(materialId, param)
				SetScalarParam: Module.cwrap("jDVLMaterial_SetScalarParam", null, ["string", "number", "number"]), // function(materialId, param, f)
				GetTexture: function (materialId, textureType) {
					return pointerToString(Module.ccall("jDVLMaterial_GetTexture", "number", ["string", "number"], [materialId, textureType]));
				},
				SetTexture: Module.cwrap("jDVLMaterial_SetTexture", null, ["string", "number", "string"]),                      // function(materialId, textureType, texture)
				GetTextureParam: Module.cwrap("jDVLMaterial_GetTextureParam", "number", ["string", "number", "number"]),        // function(materialId, textureType, param)
				SetTextureParam: Module.cwrap("jDVLMaterial_SetTextureParam", null, ["string", "number", "number", "number"]),  // function(materialId, textureType, param, f)
				GetTextureFlag: function(materialId, textureType, flag) {
					return !!Module.ccall("jDVLMaterial_GetTextureFlag", "number", ["string", "number", "number"], [materialId, textureType, flag]);
				},
				SetTextureFlag: Module.cwrap("jDVLMaterial_SetTextureFlag", null, ["string", "number", "number", "number"]),    // function(materialId, textureType, flag, b)
				Clone: function (materialId) {
					return pointerToString(Module.ccall("jDVLMaterial_Clone", "number", ["string"], [materialId]));
				},
				Release: function(materialId) {
					return Module.ccall("jDVLMaterial_Release", "number", ["string"], [materialId]);
				}
			}; // Module.Material

			/**
			 * @namespace
			 * @alias sap.ve.dvl~Camera
			 * @private
			 */
			Module.Camera = {
				GetName: Module.cwrap("jDVLCamera_GetName", "string", ["string"]),                                      // function(cameraId)
				SetName: Module.cwrap("jDVLCamera_SetName", null, ["string", "string"]),                                // function(cameraId, name)
				GetTargetNode: function(cameraId) {
					return stringResult(Module.ccall("jDVLCamera_GetTargetNode", "number", ["string"], [cameraId]));
				},
				SetTargetNode: Module.cwrap("jDVLCamera_SetTargetNode", null, ["string", "string"]),                    // function(cameraId, nodeId)
				GetOrigin: function(cameraId) { // returns [x, y, z]
					return parseResult(Module.ccall("jDVLCamera_GetOrigin", "number", ["string"], [cameraId]));
				},
				SetOrigin: Module.cwrap("jDVLCamera_SetOrigin", null, ["string", "number", "number", "number"]),        // function(cameraId, x, y, z)
				GetTargetDirection: function(cameraId) { // returns [x, y, z]
					return parseResult(Module.ccall("jDVLCamera_GetTargetDirection", "number", ["string"], [cameraId]));
				},
				SetTargetDirection: Module.cwrap("jDVLCamera_SetTargetDirection", null, ["string", "number", "number", "number"]),   // function(cameraId, x, y, z)
				GetUpDirection: function(cameraId) { // returns [x, y, z]
					return parseResult(Module.ccall("jDVLCamera_GetUpDirection", "number", ["string"], [cameraId]));
				},
				SetUpDirection: Module.cwrap("jDVLCamera_SetUpDirection", null, ["string", "number", "number", "number"]),           // function(cameraId, x, y, z)
				GetRotation: function(cameraId) { // returns [yaw, pitch, roll]
					return parseResult(Module.ccall("jDVLCamera_GetRotation", "number", ["string"], [cameraId]));
				},
				SetRotation: Module.cwrap("jDVLCamera_SetRotation", null, ["string", "number", "number", "number"]),    // function(cameraId, yaw, pitch, roll)
				GetMatrix: function(cameraId) {
					return parseResult(Module.ccall("jDVLCamera_GetMatrix", "number", ["string"], [cameraId]));
				},
				SetMatrix: function(cameraId, mat) {
					var m = mat.hasOwnProperty("matrix") ? mat.matrix : mat;
					var buf = Module._malloc(64);
					Module.HEAPF32.set(m, buf / 4);
					Module.ccall("jDVLCamera_SetMatrix", null, ["string", "number"], [cameraId, buf]);
					Module._free(buf);
				},
				GetProjection: Module.cwrap("jDVLCamera_GetProjection", "number", ["string"]),                  // function(cameraId)
				GetFOV: Module.cwrap("jDVLCamera_GetFOV", "number", ["string"]),                                // function(cameraId)
				SetFOV: Module.cwrap("jDVLCamera_SetFOV", null, ["string", "number"]),                          // function(cameraId, f)
				GetOrthoZoomFactor: Module.cwrap("jDVLCamera_GetOrthoZoomFactor", "number", ["string"]),        // function(cameraId)
				SetOrthoZoomFactor: Module.cwrap("jDVLCamera_SetOrthoZoomFactor", null, ["string", "number"]),  // function(cameraId, f)
				GetFOVBinding: Module.cwrap("jDVLCamera_GetFOVBinding", "number", ["string"]),                  // function(cameraId)
				SetFOVBinding: Module.cwrap("jDVLCamera_SetFOVBinding", null, ["string", "number"])             // function(cameraId, i)
			}; // Module.Camera

			// This is a map rendererId <-> [function], where [function] is an array of command to execute before rendering the next frame.
			var rendererCommands = {};

			/**
			 * @namespace
			 * @alias sap.ve.dvl~Renderer
			 */
			Module.Renderer = {
				/**
				 * Sets the dimensions of the canvas. You usually call this in the <code>OnResize()</code> handler of your application.
				 * You also need to call it once the renderer is created to let it know the target resolution.
				 * @param {number} width        Target width of the canvas in device pixels.
				 * @param {number} height       Target height of the canvas in device pixels.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				SetDimensions: function(width, height, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_SetDimensions", "number", ["string", "number", "number"], [rendererId, width, height]);
				},

				/**
				 * Sets the color which is used to clear the screen. Can be a gradient from top to bottom.
				 * @param {number} topRed       Red component of the top of a vertical color gradient background.
				 * @param {number} topGreen     Green component of the top of a vertical color gradient background.
				 * @param {number} topBlue      Blue component of the top of a vertical color gradient background.
				 * @param {number} topAlpha     Alpha component of the top of a vertical color gradient background.
				 * @param {number} bottomRed    Red component of the bottom of a vertical color gradient background.
				 * @param {number} bottomGreen  Green component of the bottom of a vertical color gradient background.
				 * @param {number} bottomBlue   Blue component of the bottom of a vertical color gradient background.
				 * @param {number} bottomAlpha  Alpha component of the bottom of a vertical color gradient background.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				SetBackgroundColor: function(topRed, topGreen, topBlue, topAlpha, bottomRed, bottomGreen, bottomBlue, bottomAlpha, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					Module.ccall("jDVLRenderer_SetBackgroundColor", null, ["string", "number", "number", "number", "number", "number", "number", "number", "number"], [rendererId, topRed, topGreen, topBlue, topAlpha, bottomRed, bottomGreen, bottomBlue, bottomAlpha]);
				},

				/**
				 * Attaches a scene that will be displayed through this interface.
				 * @param {string} sceneId      Scene token.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				AttachScene: function(sceneId, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_AttachScene", "number", ["string", "string"], [rendererId, sceneId]);
				},

				/**
				 * Retrieves the scene token for the currently attached scene.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {string|sap.ve.dvl.DVLRESULT} Scene token or an error code if fails.
				 */
				GetAttachedScenePtr: function(rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return stringResult(Module.ccall("jDVLRenderer_GetAttachedScenePtr", "number", ["string"], [rendererId]));
				},

				/**
				 * Checks if the scene has been somehow modified and requires re-rendering.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {boolean} <code>true</code> if the scene should be re-rendered, <code>false</code> otherwise.
				 */
				ShouldRenderFrame: function(rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_ShouldRenderFrame", "bool", ["string"], [rendererId]);
				},

				/**
				 * Renders a single frame using the currently activated camera. Call this method to draw the attached scene.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				RenderFrame: function(rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_RenderFrame", "number", ["string"], [rendererId]);
				},

				/**
				 * Sets the flags to force render frame. This call does not actually renders frame.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				ForceRenderFrame: function(rendererId) {
					return Module.ccall("jDVLRenderer_ForceRenderFrame", "number", ["string"], [rendererId]);
				},

				/**
				 * Renders a single frame using explicitly defined View and Projection matrices. Call this method to draw the attached scene.<br>
				 * The function takes two unrolled 4x4 matrices.
				 * <table class="params">
				 *     <thead><tr><th>Parameter</th><th class="last">Description</th></tr></thead>
				 *     <tr><td>v[row][column]</td><td class="last">A View matrix in local coordinates.</td></tr>
				 *     <tr><td>p[row][column]</td><td class="last">A Projection matrix.</td></tr>
				 * </table>
				 * @param {number} v00 A View matrix element at index [0,0].
				 * @param {number} v01 A View matrix element at index [0,1].
				 * @param {number} v02 A View matrix element at index [0,2].
				 * @param {number} v03 A View matrix element at index [0,3].
				 * @param {number} v10 A View matrix element at index [1,0].
				 * @param {number} v11 A View matrix element at index [1,1].
				 * @param {number} v12 A View matrix element at index [1,2].
				 * @param {number} v13 A View matrix element at index [1,3].
				 * @param {number} v20 A View matrix element at index [2,0].
				 * @param {number} v21 A View matrix element at index [2,1].
				 * @param {number} v22 A View matrix element at index [2,2].
				 * @param {number} v23 A View matrix element at index [2,3].
				 * @param {number} v30 A View matrix element at index [3,0].
				 * @param {number} v31 A View matrix element at index [3,1].
				 * @param {number} v32 A View matrix element at index [3,2].
				 * @param {number} v33 A View matrix element at index [3,3].
				 * @param {number} p00 A Projection matrix element at index [0,0].
				 * @param {number} p01 A Projection matrix element at index [0,1].
				 * @param {number} p02 A Projection matrix element at index [0,2].
				 * @param {number} p03 A Projection matrix element at index [0,3].
				 * @param {number} p10 A Projection matrix element at index [1,0].
				 * @param {number} p11 A Projection matrix element at index [1,1].
				 * @param {number} p12 A Projection matrix element at index [1,2].
				 * @param {number} p13 A Projection matrix element at index [1,3].
				 * @param {number} p20 A Projection matrix element at index [2,0].
				 * @param {number} p21 A Projection matrix element at index [2,1].
				 * @param {number} p22 A Projection matrix element at index [2,2].
				 * @param {number} p23 A Projection matrix element at index [2,3].
				 * @param {number} p30 A Projection matrix element at index [3,0].
				 * @param {number} p31 A Projection matrix element at index [3,1].
				 * @param {number} p32 A Projection matrix element at index [3,2].
				 * @param {number} p33 A Projection matrix element at index [3,3].
				 * @param {string} [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				RenderFrameEx: function(v00, v01, v02, v03, v10, v11, v12, v13, v20, v21, v22, v23, v30, v31, v32, v33, p00, p01, p02, p03, p10, p11, p12, p13, p20, p21, p22, p23, p30, p31, p32, p33, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_RenderFrameEx", "number",
										["string", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number"],
										[rendererId, v00, v01, v02, v03, v10, v11, v12, v13, v20, v21, v22, v23, v30, v31, v32, v33, p00, p01, p02, p03, p10, p11, p12, p13, p20, p21, p22, p23, p30, p31, p32, p33]);
				},

				/**
				 * Gets camera matrices - View and Projection matrices.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an object with the following structure:<br>
				 * <pre>
				 * {
				 *      "view":       [number, ...],
				 *      "projection": [number, ...]
				 * }
				 * </pre>
				 */
				GetCameraMatrices: function(rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return parseResult(Module.ccall("jDVLRenderer_GetCameraMatrices", "number", ["string"], [rendererId]));
				},

				/**
				 * Sets or clears the specified rendering option.
				 * @param {sap.ve.dvl.DVLRENDEROPTION} option       The option to change.
				 * @param {boolean}                    enable       <code>true</code> to set the option, <code>false</code> to clear the option.
				 * @param {string}                     [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 *     <table class="props">
				 *         <thead><tr><th>Code</th><th class="last">Description</th></tr></thead>
				 *         <tr><td><code>DVLRESULT_NOTINITIALIZED</code></td><td class="last">If renderer initialization was not performed.</td></tr>
				 *         <tr><td><code>DVLRESULT_HARDWAREERROR</code> </td><td class="last">If the new option state is not supported by hardware.</td></tr>
				 *         <tr><td><code>DVLRESULT_BADARG</code>        </td><td class="last">If the option does not exist.</td></tr>
				 *         <tr><td><code>DVLRESULT_OK</code>            </td><td class="last">If the option was changed successfully.</td></tr>
				 *     </table>
				 */
				SetOption: function(option, enable, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_SetOption", "number", ["string", "number", "boolean"], [rendererId, option, enable]);
				},

				/**
				 * Returns the current state of rendering options.
				 * @param {sap.ve.dvl.DVLRENDEROPTION} option       The rendering option to get the status of.
				 * @param {string}                     [rendererId] Renderer token.
				 * @returns {boolean} Current status of the specified rendering option. <code>true</code> if the option is set, <code>false</code> if the option is cleared.
				 */
				GetOption: function(option, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_GetOption", "boolean", ["string", "number"], [rendererId, option]);
				},

				/**
				 * Sets the specified rendering option value.
				 * @param {sap.ve.dvl.DVLRENDEROPTIONF} option       The option to change.
				 * @param {number}                      value        A numeric value of a non boolean option to set.
				 * @param {string}                      [rendererId] Renderer token
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 *     <table class="props">
				 *         <thead><tr><th>Code</th><th class="last">Description</th></tr></thead>
				 *         <tr><td><code>DVLRESULT_NOTINITIALIZED</code></td><td class="last">If renderer initialization was not performed.</td></tr>
				 *         <tr><td><code>DVLRESULT_HARDWAREERROR</code> </td><td class="last">If the new option value is not supported by hardware.</td></tr>
				 *         <tr><td><code>DVLRESULT_BADARG</code>        </td><td class="last">If the option does not exist.</td></tr>
				 *         <tr><td><code>DVLRESULT_OK</code>            </td><td class="last">If the option was changed successfully.</td></tr>
				 *     </table>
				 */
				SetOptionF: function(option, value, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_SetOptionF", "number", ["string", "number", "number"], [rendererId, option, value]);
				},

				/**
				 * Returns the current value of rendering options.
				 * @param {sap.ve.dvl.DVLRENDEROPTIONF} option       The option to get the value of.
				 * @param {string}                      [rendererId] Renderer token.
				 * @returns {number} Value of the specified option.
				 */
				GetOptionF: function(option, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_GetOptionF", "number", ["string", "number"], [rendererId, option]);
				},

				/**
				 * Changes view to default viewport (the "Home" mode).
				 * @param {number} flags        A combination of [DVLRESETVIEWFLAG]{@link sap.ve.dvl.DVLRESETVIEWFLAG} flags.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				ResetView: function(flags, rendererId) {
					if (arguments.length === 1 && typeof flags === "number") {
						rendererId = Module.Settings.RendererToken;
					} else if (arguments.length === 1 && typeof flags === "string") {
						rendererId = flags;
						flags = sap.ve.dvl.DVLRESETVIEWFLAG.CAMERA | sap.ve.dvl.DVLRESETVIEWFLAG.SMOOTHTRANSITION;
					} else if (typeof flags !== "number" || typeof rendererId !== "string") {
						flags = sap.ve.dvl.DVLRESETVIEWFLAG.CAMERA | sap.ve.dvl.DVLRESETVIEWFLAG.SMOOTHTRANSITION;
						rendererId = Module.Settings.RendererToken;
					}
					return Module.ccall("jDVLRenderer_ResetView", "number", ["number", "string"], [flags, rendererId]);
				},

				/**
				 * Begins a gesture by computing target hit point, touch direction etc. Should be called at the beginning of each gesture.
				 * @param {number} x            Horizontal coordinate in device pixels.
				 * @param {number} y            Vertical coordinate in device pixels.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				BeginGesture: function(x, y, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_BeginGesture", "number", ["string", "number", "number"], [rendererId, x, y]);
				},

				/**
				 * Ends a gesture. Should be called at the end of each gesture to decrease the internal counter.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				EndGesture: function(rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_EndGesture", "number", ["string"], [rendererId]);
				},

				/**
				 * Pans the scene.
				 * @param {number} x            Horizontal delta in device pixels.
				 * @param {number} y            Vertical delta in device pixels.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				Pan: function(dx, dy, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_Pan", "number", ["string", "number", "number"], [rendererId, dx, dy]);
				},

				/**
				 * Rotates the scene around 3D orbit rotation center (which is calculated by the [BeginGesture]{@link sap.ve.dvl~Renderer.BeginGesture} method).
				 * @param {number} dx           Horizontal delta in device pixels.
				 * @param {number} dy           Vertical delta in device pixels.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				Rotate: function(dx, dy, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_Rotate", "number", ["string", "number", "number"], [rendererId, dx, dy]);
				},

				/**
				 * Zooms the scene.
				 * @param {number} y Zoom velocity in pixels per second.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				Zoom: function(dy, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_Zoom", "number", ["string", "number"], [rendererId, dy]);
				},

				/**
				 * Checks if the provided node can be isolated (by seeing if there are any visible geometry underneath it).
				 * @param {string} dvlId        The ID of the node.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {boolean} <code>true</code> if the node can be isolated, <code>false</code> otherwise.
				 */
				CanIsolateNode: function(dvlid, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_CanIsolateNode", "boolean", ["string", "string"], [rendererId, dvlid]);
				},

				/**
				 * Sets or clears an isolated node.
				 * @param {string} dvlId        The ID of the node. To clear an isolated node, you need to pass <code>[DVLID_INVALID]{@link sap.ve.dvl.DVLID_INVALID}</code>.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				SetIsolatedNode: function(dvlid, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_SetIsolatedNode", "number", ["string", "string"], [rendererId, dvlid]);
				},

				/**
				 * Returns the ID of the currently isolated node or <code>[DVLID_INVALID]{@link sap.ve.dvl.DVLID_INVALID}</code> if nothing is isolated.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {string|sap.ve.dvl.DVLRESULT} The ID of the isolated node or an error code if fails.
				 */
				GetIsolatedNode: function(rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return stringResult(Module.ccall("jDVLRenderer_GetIsolatedNode", "number", ["string"], [rendererId]));
				},

				/**
				 * Zooms the scene to a bounding box created from a particular set of nodes.
				 * @param {sap.ve.dvl.DVLZOOMTO} what             What set of nodes to zoom to, and optionally from which view.
				 * @param {string|string[]}      nodes            The target nodes IDs. Only used if what equals <code>DVLZOOMTONODE</code> or <code>DVLZOOMTONODE_SETISOLATION</code>.
				 * @param {number}               crossFadeSeconds Time to perform the "fly to" animation. Set to <code>0.0f</code> to do this immediately.
				 * @param {number}               [margin]         Margin.
				 * @param {string}               [rendererId]     Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				ZoomTo: function(what, nodes, crossFadeSeconds, margin, rendererId) { //DVLZOOMTO
					rendererId = rendererId !== undefined ? rendererId : Module.Settings.RendererToken;
					margin = margin || 0;
					if (typeof nodes === 'string') {
						nodes = [nodes];
					}
					if (Array.isArray(nodes) && nodes.length > 0) {
						var nodesArray = new Uint32Array(nodes.length);
						for (var i in nodes) {
							nodesArray[i] = parseInt(nodes[i].substr(9), 16); // stringIdToPtr
						}
						var buf = Module._malloc(nodesArray.length * Uint32Array.BYTES_PER_ELEMENT);
						Module.HEAPU32.set(nodesArray, buf / Uint32Array.BYTES_PER_ELEMENT);
						var result = Module.ccall("jDVLRenderer_ZoomTo", "number", ["string", "number", "number", "number", "number", "number"], [rendererId, what, nodesArray.length, buf, crossFadeSeconds, margin]);
						Module._free(buf);
						return result;
					} else {
						return Module.ccall("jDVLRenderer_ZoomTo", "number", ["string", "number", "number", "number", "number", "number"], [rendererId, what, 0, null, crossFadeSeconds, margin]);
					}
				},

				/**
				 * Sends the "tap" event to the core (for selection).
				 * @param {number}  x            Horizontal coordinate in device pixels.
				 * @param {number}  y            Vertical coordinate in device pixels.
				 * @param {boolean} isDouble     Should the call be handled as a double or single tap.
				 * @param {boolean} changeSelection Allow or prevent changes in node selection states
				 * @param {string}  [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				Tap: function(x, y, isDouble, changeSelection, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_Tap", "number", ["string", "number", "number", "boolean", "boolean"], [rendererId, x, y, isDouble, changeSelection]);
				},

				/**
				 * Performs hit testing and finds a 3D object(s) under the X, Y coordinates.
				 * @param {number|number[]} x            Horizontal coordinate in device pixels or an array of numbers. The length of the array must be even.
				 *                                       The array contains (x,y) pairs [x1, y1, x2, y2, ...].
				 * @param {number}          y            Vertical coordinate in device pixels.
				 * @param {string}          [rendererId] Renderer token.
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an object with the following structure.<br>
				 * <pre>
				 * [
				 *     {
				 *         "id":                string,
				 *         "ScreenCoordinateX": number,
				 *         "ScreenCoordinateY": number,
				 *         "WorldCoordinateX":  number,
				 *         "WorldCoordinateY":  number,
				 *         "WorldCoordinateZ":  number,
				 *         "LocalCoordinateX":  number,
				 *         "LocalCoordinateY":  number,
				 *         "LocalCoordinateZ":  number
				 *     },
				 *     ...
				 * ]
				 */
				HitTest: function(x, y, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					var p;
					if (x instanceof Array) {
						var buf = Module._malloc(x.length * 4);
						Module.HEAP32.set(x, buf / 4);
						p = Module.ccall("jDVLRenderer_MultipleHitTest", "number", ["string", "number", "number"], [rendererId, x.length / 2, buf]);
						Module._free(buf);
					} else {
						p = Module.ccall("jDVLRenderer_HitTest", "number", ["string", "number", "number"], [rendererId, x, y]);
					}
					return parseResult(p);
				},

				/**
				 * Create texture with given data
				 * @param {number} width        Width of texture.
				 * @param {number} height       Height of texture.
				 * @param {Uint8Array} Data     Raw texture data. 4 bytes per pixel. The data length must be at least 4 * width * height.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {string|sap.ve.dvl.DVLRESULT} Texture token or an error code if fails.
				 * @private
				 */
				CreateTexture: function(width, height, data, rendererId) {
					var bytesPerPixel = 4;
					if (data.length < width * height * bytesPerPixel)
						return DvlEnums.DVLRESULT.BADARG;

					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					var buf = Module._malloc(data.length);
					console.log(data.length);
					Module.HEAPU8.set(data, buf);
					var texture = stringResult(Module.ccall("jDVLRenderer_CreateTexture", "number", ["string", "number", "number", "number", "number"], [rendererId, width, height, bytesPerPixel, buf]));
					Module._free(buf);
					return texture;
				},

				/**
				 * Releases the texture and frees the memory allocated for it.
				 * @param {string} textureId    Texture token.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 * @private
				 */
				ReleaseTexture: function(textureId, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_ReleaseTexture", "number", ["string", "string"], [rendererId, textureId]);
				},

				/**
				 * Set an instance of IDVLViewStateManager to be used by the Renderer to get per-viewport node properties.
				 * @param {object} viewStateManager A object that implements ViewStateManager interface in JavaScript.
				 * @param {string} rendererId       Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 * @private
				 */
				SetViewStateManager: function(viewStateManager, rendererId) {
					return setViewStateManager(rendererId, viewStateManager);
				},

				/**
				 * Returns the current camera.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {string|sap.ve.dvl.DVLRESULT} Camera token or an error code if fails.
				 */
				GetCurrentCamera: function(rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return stringResult(Module.ccall("jDVLRenderer_GetCurrentCamera", "number", ["string"], [rendererId]));
				},

				/**
				 * Returns the transition camera.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {string|sap.ve.dvl.DVLRESULT} Camera token or an error code if fails.
				 */
				GetTransitionCamera: function(rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return stringResult(Module.ccall("jDVLRenderer_GetTransitionCamera", "number", ["string"], [rendererId]));
				},

				/**
				 * Activates a step by playing its animation. Optionally plays steps that come after this step.
				 * @param {string}  rendererId        Renderer token.
				 * @param {string}  dvlId             The identifier of the step or model view to activate.
				 * @param {boolean} fromTheBeginning  Play the step from beginning, or from the currently paused position.
				 * @param {boolean} continueToTheNext What to do after the current step has finished playing: play the next steps, or stop.
				 * @param {number}  stepTime          The time at which the step animation starts (in seconds). By default, <code>stepTime</code> is set to <code>-1</code>.<br>
				 *                                    Providing a negative value results in a cross-fade transition to the step to activate,
				 *                                    and starts playing that step from time = 0.
				 *                                    Providing a value of 0 or more will instantaneously switch to the camera orientation of the step to activate,
				 *                                    and starts playing that step from time = 0.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				ActivateStep: function(rendererId, dvlid, fromTheBeginning, continueToTheNext, stepTime) {
					return Module.ccall("jDVLRenderer_ActivateStep", "number", ["string", "string", "boolean", "boolean", "number"], [rendererId, dvlid, fromTheBeginning, continueToTheNext, typeof stepTime !== "undefined" ? stepTime : -1]);
				},

				/**
				 * Pauses the current step, if any.
				 * @param {string} rendererId Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				PauseCurrentStep: function(rendererId) {
					return Module.ccall("jDVLRenderer_PauseCurrentStep", "number", ["string"], [rendererId]);
				},

				/**
				 * Activates a camera in the renderer.
				 * @param {string} rendererId       Renderer token.
				 * @param {string} cameraId         The node ID of the camera node.
				 * @param {number} crossFadeSeconds Time to perform the "fly to" animation. Set to 0 to do this immediately.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 * @private
				 */
				ActivateCamera: function(rendererId, cameraId, crossFadeSeconds) {
					return Module.ccall("jDVLRenderer_ActivateCamera", "number", ["string", "string", "number"], [rendererId, cameraId, crossFadeSeconds]);
				},


				/**
				 * Set selection rectangle for rendering.
				 * @param {number}  x1            Horizontal coordinate in device pixels of top-left vertex of selecion rectangle.
				 * @param {number}  y1            Vertical coordinate in device pixels of top-left vertex of selecion rectangle.
				 * @param {number}  x2            Horizontal coordinate in device pixels of bottom-right vertex of selecion rectangle.
				 * @param {number}  y2            Vertical coordinate in device pixelsof bottom-right vertex of selecion rectangle.
				 * @param {string}  [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */

				DrawSelectionRect: function(x1, y1, x2, y2, rendererId) {
					return Module.ccall("jDVLRenderer_DrawSelectionRect", "number", ["string", "number", "number", "number", "number"], [rendererId, x1, y1, x2, y2]);
				},

				/**
				 * Sends the "rectangular selection" event to the core (for selection).
				 * @param {number}  x1            Horizontal coordinate in device pixels of top-left vertex of selecion rectangle.
				 * @param {number}  y1            Vertical coordinate in device pixels of top-left vertex of selecion rectangle.
				 * @param {number}  x2            Horizontal coordinate in device pixels of bottom-right vertex of selecion rectangle.
				 * @param {number}  y2            Vertical coordinate in device pixelsof bottom-right vertex of selecion rectangle.
				 * @param {string}  [rendererId] Renderer token.
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an object with the following structure.<br>
				 * <pre>
				 * {	selectedNodes: [string, string, ...]	}
				 */
				RectSelect: function(x1, y1, x2, y2, rendererId) {
					p = Module.ccall("jDVLRenderer_RectSelect", "number", ["string", "number", "number", "number", "number"], [rendererId, x1, y1, x2, y2]);
					return parseResult(p);
				},


				_queueCommand: function(command, rendererId) {
					rendererCommands[rendererId].push(command);
					return this;
				},

				_processCommandQueue: function(rendererId) {
					var commands = rendererCommands[rendererId].splice(0, rendererCommands[rendererId].length);
					commands.forEach(function(command) {
						command();
					});
				}
			}; // Module.Renderer

			/**
			 * @namespace
			 * @alias sap.ve.dvl~Library
			 */
			Module.Library = {
				/**
				 * Retrieves a base64 encoded thumbnail for a file stored in the Emscripten virtual file system.
				 * @param {string}                    url            The file URL.
				 * @param {sap.ve.dvl.SOURCELOCATION} sourceLocation The source location of the file: "local" or "remote".
				 * @returns {string} A thumbnail encoded as a Base64 string.
				 */
				RetrieveThumbnail: function(url, sourceLocation) {
					var libraryId = pointerToString(Module.ccall("jDVLCore_GetLibraryPtr", "number", ["string"], [Module.Settings.CoreToken]));
					var filename = makeFilename(sourceLocation + "/" + url);
					return pointerToString(Module.ccall("jDVLLibrary_RetrieveThumbnail", "number", ["string", "string"], [libraryId, "file:///viewer/" + filename]));
				},

				/**
				 * Retrieves file information.
				 * @param {string}                    url            The file URL.
				 * @param {sap.ve.dvl.SOURCELOCATION} sourceLocation The source location of the file: "local" or "remote".
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an object with the following structure.<br>
				 * <pre>
				 * {
				 *     flags: number,
				 *     major: number,
				 *     minor: number
				 * }
				 * </pre>
				 */
				RetrieveInfo: function(url, sourceLocation) {
					var libraryId = pointerToString(Module.ccall("jDVLCore_GetLibraryPtr", "number", ["string"], [Module.Settings.CoreToken]));
					var filename = makeFilename(sourceLocation + "/" + url);
					return parseResult(Module.ccall("jDVLLibrary_RetrieveInfo", "number", ["string", "string"], [libraryId, "file:///viewer/" + filename]));
				}
			}; // Module.Library

			/**
			 * @namespace
			 * @alias sap.ve.dvl~Core
			 */
			Module.Core = {
				/**
				 * Performs all class initialization, and verifies that the library is compatible (by checking major/minor version).
				 * @param {number} versionMajor Major version to check against build.
				 * @param {number} versionMinor Minor version to check against build.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */

				Init: function(versionMajor, versionMinor) {
					return Module.ccall("jDVLCore_Init", "number", ["string", "number", "number"], [Module.Settings.CoreToken, versionMajor, versionMinor]);
				},

				/**
				 * Performs all renderer initialization.
				 * @returns {string} Renderer token.
				 */
				InitRenderer: function() {
					Module.ccall("jDVLCore_InitRenderer", "number", ["string"], [Module.Settings.CoreToken]);
					var rendererId = stringResult(Module.ccall("jDVLCore_GetRendererPtr", "number", ["string"], [Module.Settings.CoreToken]));
					if (typeof rendererId === "string") {
						rendererCommands[rendererId] = [];
						Module.Settings.RendererToken = rendererId;
					}
					return rendererId;
				},

				/**
				 * Deletes the current renderer, and releases all allocated resources (or JavaScript equivalent).
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				DoneRenderer: function() {
					delete rendererCommands[Module.Settings.RendererToken];
					var result = Module.ccall("jDVLCore_DoneRenderer", "number", ["string"], [Module.Settings.CoreToken]);
					Module.Settings.RendererToken = null;
					return result;
				},

				/**
				 * Create a new renderer and performs renderer initialization.
				 * This method must be used for multi-viewport applications.
				 * Can be used for single-viewport (internally it would execute InitRenderer() for single-viewport).
				 *
				 * @returns {string|sap.ve.dvl.DVLRESULT} The ID of the newly created renderer or an error code if fails.
				 */
				CreateRenderer: function() {
					var rendererId = stringResult(Module.ccall("jDVLCore_CreateRenderer", "number", ["string"], [Module.Settings.CoreToken]));
					if (typeof rendererId === "string") {
						rendererCommands[rendererId] = [];
						if (!Module.Settings.RendererToken) {
							Module.Settings.RendererToken = rendererId;
						}
					}
					return rendererId;
				},

				/**
				 * Deletes the renderer and releases all resources allocated by it.
				 *
				 * @param {string} rendererId The renderer ID.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				DeleteRenderer: function(rendererId) {
					delete rendererCommands[rendererId];
					var result = Module.ccall("jDVLCore_DeleteRenderer", "number", ["string", "string"], [Module.Settings.CoreToken, rendererId]);
					if (rendererId === Module.Settings.RendererToken) {
						Module.Settings.RendererToken = null;
					}
					return result;
				},

				/**
				 * Deletes the DVL instance.
				 */
				Release: function() {
					Module.ccall("jDVLCore_Release", null, ["string"], [Module.Settings.CoreToken]);
					Module.Settings.CoreToken = null;
				},

				/**
				 * Returns the major version of DVL.
				 * @returns {number} Core major version.
				 */
				GetMajorVersion: function() {
					return Module.ccall("jDVLCore_GetMajorVersion", "number", ["string"], [Module.Settings.CoreToken]);
				},

				/**
				 * Returns the minor version of DVL.
				 * @returns {number} Core minor version.
				 */
				GetMinorVersion: function() {
					return Module.ccall("jDVLCore_GetMinorVersion", "number", ["string"], [Module.Settings.CoreToken]);
				},

				/**
				 * Returns the micro version of DVL.
				 * @returns {number} Core micro version.
				 */
				GetMicroVersion: function() {
					return Module.ccall("jDVLCore_GetMicroVersion", "number", ["string"], [Module.Settings.CoreToken]);
				},
				/**
				 * Returns the build number of DVL.
				 * @returns {number} Core build number.
				 */
				GetBuildNumber: function() {
					return Module.ccall("jDVLCore_GetBuildNumber", "number", ["string"], [Module.Settings.CoreToken]);
				},
				/**
				 * Returns the overall version of DVL.
				 * @returns {string} The string representation of the DVL version with the following structure: <i>Major.Minor.Micro.BuildNumber</i>.
				 */
				GetVersion: function() {
					return Module.Core.GetMajorVersion().toString() + "." + Module.Core.GetMinorVersion().toString() + "." + Module.Core.GetMicroVersion().toString() + "-" + Module.Core.GetBuildNumber().toString();
				},
				/**
				 * Sets the locale which is used for getting the text in viewports, layers, callouts, etc. during file load. Default is "neutral locale".
				 * Some examples of locale format include <code>"en-US"</code> and <code>"de-DE"</code>.
				 * Use <code>null</code> or <code>""</code> value to set a "neutral locale".
				 * Locale setting is only used during scene loading. If you change the locale setting on the fly, you will need to reload the file.
				 * @param {string} locale The locale to set.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				SetLocale: function(locale) {
					return Module.ccall("jDVLCore_SetLocale", "number", ["string", "string"], [Module.Settings.CoreToken, locale]);
				},

				/**
				 * Creates a new scene.<br>
				 * Call the [Release]{@link sap.ve.dvl~Scene.Release} method once finished with it.
				 * @returns {string|sap.ve.dvl.DVLRESULT} The ID of the newly created scene or an error code if fails.
				 */
				CreateEmptyScene: function() {
					return stringResult(Module.ccall("jDVLCore_CreateEmptyScene", "number", ["string"], [Module.Settings.CoreToken]));
				},

				/**
				 * Creates a new scene by loading it from a file in the Emscripten virtual file system.<br>
				 * Call the [Release]{@link sap.ve.dvl~Scene.Release} method once finished with it.
				 * @param {string} filename           The name of the file in the Emscripten virtual file system.
				 * @param {string} [optionalPassword] Password to access the file. Required only if the file is encrypted.
				 * @returns {string|sap.ve.dvl.DVLRESULT} The ID of the newly loaded scene or an error code if fails.
				 */
				LoadScene: function(filename, optionalPassword) {
					var p = null;
					var lookupFile = null;
					try {
						lookupFile = FS.lookupPath("/viewer/" + filename, { parent: false });
					} catch (e) {
						if (!(e instanceof FS.ErrnoError && e.errno === ERRNO_CODES.ENOENT)) {
							throw e;
						}
					}

					if (!lookupFile) {
						throw Error("File " + filename + " not found.");
					} else {
						p = Module.ccall("jDVLCore_LoadScene", "number", ["string", "string", "string"], [Module.Settings.CoreToken, "file:///viewer/" + filename, optionalPassword]);
					}
					var s = stringResult(p);
					Module.Settings.LastLoadedSceneId = s;
					return s;
				},

				/**
				 * Creates a new scene by loading it from the specified URL.<br>
				 * Call the [Release]{@link sap.ve.dvl~Scene.Release} method once finished with it.
				 * @param {string}                    url              The URL of the file to load.
				 * @param {string}                    optionalPassword The password to access the file. Required only if the file is encrypted.
				 * @param {sap.ve.dvl.SOURCELOCATION} sourceLocation   The source location of the file: "local" or "remote".
				 * @returns {string|sap.ve.dvl.DVLRESULT} The ID of the newly loaded scene or an error code if fails.
				 */
				LoadSceneByUrl: function(url, optionalPassword, sourceLocation /* can be "local" or "remote" */) {
					var filename = makeFilename(sourceLocation + "/" + url);
					Module.Settings.LoadAsync = false;
					return this.LoadScene(filename, optionalPassword);
				},

				/**
				 * Creates a new scene by loading it from ArrayBuffer.<br>
				 * Call the [Release]{@link sap.ve.dvl~Scene.Release} method once finished with it.
				 * @param {ArrayBuffer}               buffer             ArrayBuffer which has the file data.
				 * @param {string}                    emscriptenFilename The buffer is stored under this filename in the Emscription virtual system.
				 * @param {string}                    password           Password to access the file. Required only if the file is encrypted.
				 * @param {sap.ve.dvl.SOURCELOCATION} sourceLocation     The source location of the file: "local" or "remote".
				 * @returns {string|sap.ve.dvl.DVLRESULT} The ID of the newly loaded scene or an error code if fails.
				 */
				LoadFileFromArrayBuffer: function(buffer, emscriptenFilename, password, sourceLocation /* can be "local" or "remote" */) {
					this.CreateFileFromArrayBuffer(buffer, emscriptenFilename, sourceLocation);
					var filename = makeFilename(sourceLocation + "/" + emscriptenFilename);
					Module.Settings.LoadAsync = false;
					return this.LoadScene(filename, password);
				},

				/**
				 * Creates a new scene by loading a VDSL file from a specified URL.<br>
				 * Call the [Release]{@link sap.ve.dvl~Scene.Release} method once finished with it.
				 * @param {string} content            The content of the VDSL file.
				 * @param {string} [optionalPassword] Password to access the file. Required only if the file is encrypted.
				 * @returns {string|sap.ve.dvl.DVLRESULT} The ID of the newly loaded scene or an error code if fails.
				 */
				LoadSceneFromVDSL: function (content, optionalPassword) {
					Module.Settings.LoadAsync = false;
					var p = Module.ccall("jDVLCore_LoadSceneFromVDSL", "number", ["string", "string", "string"], [Module.Settings.CoreToken, content, optionalPassword]);
					var s = stringResult(p);
					Module.Settings.LastLoadedSceneId = s;
					return s;
				},

				/**
				 * Creates a new scene by loading it from the specified URL.<br>
				 * @param {string}                    url              The URL of the file to load.
				 * @param {string}                    optionalPassword The password to access the file. Required only if the file is encrypted.
				 * @param {sap.ve.dvl.SOURCELOCATION} sourceLocation   The source location of the file: "local" or "remote".
				 * @returns {string|sap.ve.dvl.DVLRESULT} The sap.ve.dvl.DVLRESULT.OK or an error code if fails.
				 */
				LoadSceneByUrlAsync: function(url, optionalPassword, sourceLocation /* can be "local" or "remote" */) {
					var filename = makeFilename(sourceLocation + "/" + url);
					Module.Settings.LoadAsync = true;
					var res = this.LoadScene(filename, optionalPassword);
					return typeof res === "number" ? res : DvlEnums.DVLRESULT.OK;
				},

				/**
				 * Creates a new scene by loading a VDSL file from a specified URL.<br>
				 * @param {string} content            The content of the VDSL file.
				 * @param {string} [optionalPassword] Password to access the file. Required only if the file is encrypted.
				 * @returns {sap.ve.dvl.DVLRESULT} The sap.ve.dvl.DVLRESULT.OK or an error code if fails.
				 */
				LoadSceneFromVDSLAsync: function (content, optionalPassword) {
					Module.Settings.LoadAsync = true;
					var p = Module.ccall("jDVLCore_LoadSceneFromVDSL", "number", ["string", "string", "string"], [Module.Settings.CoreToken, content, optionalPassword]);
					var s = stringResult(p);
					Module.Settings.LastLoadedSceneId = s;
					return typeof s === "number" ? s : DvlEnums.DVLRESULT.OK;
				},

				/**
				 * Returns the token that uniquely identifies the current [Renderer]{@link sap.ve.dvl~Renderer} instance.
				 * @returns {string|sap.ve.dvl.DVLRESULT} Renderer token or an error code if fails.
				 */
				GetRendererPtr: function() {
					return stringResult(Module.ccall("jDVLCore_GetRendererPtr", "number", ["string"], [Module.Settings.CoreToken]));
				},

				/**
				 * Returns the token that uniquely identifies the current [Library]{@link sap.ve.dvl~Library} instance.
				 * @returns {string|sap.ve.dvl.DVLRESULT} Library token or an error code if fails.
				 */
				GetLibraryPtr: function() {
					return stringResult(Module.ccall("jDVLCore_GetLibraryPtr", "number", ["string"], [Module.Settings.CoreToken]));
				},

				/**
				 * Releases internal caches and any other information that can be recreated by DVL core when necessary (mainly targets iOS with limited relevance to dvl.js).
				 */
				OnLowMemory: function() {
					Module.ccall("jDVLCore_OnLowMemory", null, ["string"], [Module.Settings.CoreToken]);
				},

				// TODO: Move this function to Helpers.
				/**
				 * Creates a WebGL context with the given canvas.
				 * @param {HTMLCanvasElement} canvas                 The canvas element in DOM.
				 * @param {object}            webGLContextAttributes See {@link https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.2 webGLContextAttributes}.
				 * @returns {WebGLRenderingContext} The [WebGL context]{@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext} associated with the canvas element.
				 */
				CreateWebGLContext: function(canvas, webGLContextAttributes) {
					var context;
					// NB: Browser.createContext() checks if the context has already been created for this canvas, so we do not check ourselves.
					// NB: Browser.createContext() resets canvas' backgroundColor to "black".
					var backgroundColor = canvas.style.backgroundColor;
					try {
						context = Browser.createContext(canvas, /* useWebGL= */ true, /* setInModule= */ true, webGLContextAttributes);
					} finally {
						canvas.style.backgroundColor = backgroundColor;
					}
					Module.canvas = canvas;
					// Module.ctx = oContext; // this is done in Browser.createContext().
					return context;
				},

				// TODO: Move this function to Helpers.
				/**
				 * Deletes the file from the Emscripten virtual file system.
				 * @param {string}                    url            The URL of the file to delete.
				 * @param {sap.ve.dvl.SOURCELOCATION} sourceLocation The source location of the file: "local" or "remote".
				 * @returns {sap.ve.dvl~Core} <code>this</code> for chaining.
				 */
				DeleteFileByUrl: function(url, sourceLocation /* can be "local" or "remote" */) {
					var filename = makeFilename(sourceLocation + "/" + url);
					try {
						//Check to see if the file exists. If it does, destroy the file (so that we can load changed files from disk)
						var lookupFileInFS = FS.lookupPath("/viewer/" + filename, { parent: false });
						if (lookupFileInFS) {
							FS.destroyNode(lookupFileInFS.node);
						}
					} catch (e) {
						if (!(e instanceof FS.ErrnoError && e.errno === ERRNO_CODES.ENOENT)) {
							throw e;
						}
					}
					return this;
				},

				// TODO: Move this function to Helpers.
				/**
				 * Creates files in the virtual file system with the given ArrayBuffer.
				 * @param {ArrayBuffer}               buffer         The ArrayBuffer containing data.
				 * @param {string}                    url            The URL of the file.
				 * @param {sap.ve.dvl.SOURCELOCATION} sourceLocation The source location of the file: "local" or "remote".
				 * @returns {string} The full file name in the Emscripten virtual file system.
				 */
				CreateFileFromArrayBuffer: function(buffer, url, sourceLocation /* can be "local" or "remote" */) {
					var filename = makeFilename(sourceLocation + "/" + url);
					try {
						//Check to see if the file exists. If it does, destroy the file (so that we can load changed files from disk)
						var lookupFileInFS = FS.lookupPath("/viewer/" + filename, { parent: false });
						if (lookupFileInFS) {
							FS.destroyNode(lookupFileInFS.node);
						}
					} catch (e) {
						if (!(e instanceof FS.ErrnoError && e.errno === ERRNO_CODES.ENOENT)) {
							throw e;
						}
					}

					FS.createDataFile("/viewer/", filename, new Uint8Array(buffer), true, true);

					return "/viewer/" + filename;
				},

				/**
				 * Gets the full file name of the file stored in the Emscripten virtual file system.
				 * @param {string}                    url            URL to the file.
				 * @param {sap.ve.dvl.SOURCELOCATION} sourceLocation The source location of the file: "local" or "remote".
				 * @returns {string} The full name of the file in the Emscripten virtual file system.
				 */
				GetFilename: function(url, sourceLocation) {
					return "file:///viewer/" + makeFilename(sourceLocation + "/" + url);
				},

				/**
				 * Starts the render loop.
				 * Frames are rendered only if render loop is enabled.
				 */
				StartRenderLoop: function() {
					if (!this._iRenderLoopAnimationRequestId) {
						this._iRenderLoopAnimationRequestId = window.requestAnimationFrame(this._renderLoop.bind(this));
					}
				},

				/**
				 * Stops the render loop.
				 * Frames are rendered only if render loop is enabled.
				 */
				StopRenderLoop: function() {
					if (this._iRenderLoopAnimationRequestId) {
						window.cancelAnimationFrame(this._iRenderLoopAnimationRequestId);
						this._iRenderLoopAnimationRequestId = null;
					}
				},

				_renderLoop: function() {
					// Update all renderers.
					// For now there is only one renderer.
					if (Module.Settings.RendererToken) {
						Module.Renderer._processCommandQueue(Module.Settings.RendererToken);
						if (Module.Renderer.ShouldRenderFrame(Module.Settings.RendererToken)) {
							Module.Renderer.RenderFrame(Module.Settings.RendererToken);
						}
					}
					this._iRenderLoopAnimationRequestId = window.requestAnimationFrame(this._renderLoop.bind(this));
				},

				ExecuteCallback: function(callbackParam) {
					return Module.ccall("jDVLCore_ExecuteCallback", null, ["string", "number"], [Module.Settings.CoreToken, callbackParam]);
				}
			}; // Module.Core

			Module.CreateCoreInstance = function(clientId) {
				var ct = stringResult(Module.ccall("jDVL_CreateCoreInstance", "number", ["string"], [clientId || "default"]));
				Module.Settings.CoreToken = ct;
				Module.Settings.MajorVersion = Module.Core.GetMajorVersion();
				Module.Settings.MinorVersion = Module.Core.GetMinorVersion();
				return ct;
			};

			return Module;
		}

		var module = null;
		var defaultMemorySize  = 128 * 1024 * 1024; // 128 MB
		var stepDownMemorySize = 128 * 1024 * 1024; // 128 MB
		var stepDownAmount = 16 * 1024 * 1024; //16 MB

		options.totalMemory = options.totalMemory || defaultMemorySize;
		while (module === null && options.totalMemory > 0) {
			console.log("Trying to allocate memory: " + options.totalMemory + " bytes.");
			try {
				module = createModule(options);
			} catch (e) {
				if (e.name === "RangeError" /*Chrome, Edge, and Firefox */ || e.name === "TypeError" /*Internet Explorer */) {
					console.log(e.message + ": " + options.totalMemory);
					stepDownMemorySize = stepDownMemorySize - stepDownAmount;
					options.totalMemory = stepDownMemorySize;
				} else {
					console.log("ERROR CREATING DVL");
					console.log(e);
					throw e;
				}
			}
		}

		module.onRuntimeInitialized = function() {
			resolve(
				{
					CreateCoreInstance: module.CreateCoreInstance,
					Settings: module.Settings,
					Client: module.Client,
					Core: module.Core,
					Scene: module.Scene,
					Renderer: module.Renderer,
					Material: module.Material,
					Camera: module.Camera,
					Library: module.Library
				}
			)
		};
})};

// DvlEnums is defined at global level for backward compatiblity.
/**
 * SAP Visual Enterprise DVL namespace.
 * @namespace
 * @alias sap.ve.dvl
 */
var DvlEnums = {
	/**
	 * Enum of DVL results.
	 * @readonly
	 * @enum {number}
	 */
	DVLRESULT: {
		/** Indicates that no password was provided for the encrypted file, or the password provided was incorrect.*/
		ENCRYPTED: -19,
		/** Indicates that no file was found.*/
		FILENOTFOUND: -18,
		/** Indicates that the library has not been initialized properly.*/
		NOTINITIALIZED: -17,
		/** Indicates the version is wrong (file version, library version, etc).*/
		WRONGVERSION: -16,
		/** Indicates the file name does not have an extension.*/
		MISSINGEXTENSION: -15,
		/** Indicates access to the file has been denied.*/
		ACCESSDENIED: -14,
		/** Indicates there is no such interface.*/
		NOINTERFACE: -13,
		/** Indicates out of memory exception occurred.*/
		OUTOFMEMORY: -12,
		/** Indicates an invalid call was made.*/
		INVALIDCALL: -11,
		/** Indicates the item or file is not found.*/
		NOTFOUND: -10,
		/** Indicates the argument is invalid.*/
		BADARG: -9,
		/** Failure, something went completely wrong.*/
		FAIL: -8,
		/** Indicates that the thread is invalid.*/
		BADTHREAD: -7,
		/** Indicates incorrect format.*/
		BADFORMAT: -6,
		/** Indicates that an error occurred while reading the file.*/
		FILEERROR: -5,
		/** Indicates the requested feature is not yet implemented.*/
		NOTIMPLEMENTED: -4,
		/** Indicates that a hardware error occurred.*/
		HARDWAREERROR: -3,
		/** Indicates the process has been interrupted.*/
		INTERRUPTED: -1,
		/** Indicates a negative result.*/
		FALSE: 0,
		/** Indicates that everything is OK.*/
		OK: 1,
		/** Indicates that nothing was changed as a result of processing/action (similar to <code>OK</code>).
		 * For example, if you want to "hide a node that is already hidden".*/
		PROCESSED: 2,
		/** Indicates the initialization has been performed.
		 * Initialization can be done multiple times. However, this is not optimal.*/
		ALREADYINITIALIZED: 3,
		/** Returns the description of the DVLRESULT code.
		 * @type {sap.ve.dvl~getDvlResultDescription} */
		getDescription: function(code) {
			switch (code) {
				case DvlEnums.DVLRESULT.ENCRYPTED:          return "The file is encrypted and password is either not provided or incorrect";
				case DvlEnums.DVLRESULT.FILENOTFOUND:       return "The file is not found";
				case DvlEnums.DVLRESULT.NOTINITIALIZED:     return "The library has not been initialized properly";
				case DvlEnums.DVLRESULT.WRONGVERSION:       return "The version is wrong (file version, library version, etc)";
				case DvlEnums.DVLRESULT.MISSINGEXTENSION:   return "The name does not have an extension";
				case DvlEnums.DVLRESULT.ACCESSDENIED:       return "Access is denied";
				case DvlEnums.DVLRESULT.NOINTERFACE:        return "There is no such interface";
				case DvlEnums.DVLRESULT.OUTOFMEMORY:        return "Out of memory";
				case DvlEnums.DVLRESULT.INVALIDCALL:        return "Invalid call";
				case DvlEnums.DVLRESULT.NOTFOUND:           return "The item or file is not found";
				case DvlEnums.DVLRESULT.BADARG:             return "The argument is invalid";
				case DvlEnums.DVLRESULT.FAIL:               return "Failure, something went completely wrong";
				case DvlEnums.DVLRESULT.BADTHREAD:          return "Invalid thread";
				case DvlEnums.DVLRESULT.BADFORMAT:          return "Incorrect format";
				case DvlEnums.DVLRESULT.FILEERROR:          return "File reading error";
				case DvlEnums.DVLRESULT.NOTIMPLEMENTED:     return "The requested feature is not yet implemented";
				case DvlEnums.DVLRESULT.HARDWAREERROR:      return "Hardware error";
				case DvlEnums.DVLRESULT.INTERRUPTED:        return "The process has been interrupted";
				case DvlEnums.DVLRESULT.FALSE:              return "Negative result";
				case DvlEnums.DVLRESULT.OK:                 return "Everything is OK";
				case DvlEnums.DVLRESULT.PROCESSED:          return "Nothing was changed as a result of processing/action (similar to OK), for example if you want to hide a node that is already hidden";
				case DvlEnums.DVLRESULT.ALREADYINITIALIZED: return "The initialization has already been made (it is OK to initialize multiple times, just not optimal)";
				default:                                    return "Unknown";
			}
		}
	},
	/**
	 * Enum of step events.
	 * @readonly
	 * @enum {number}
	 */
	DVLSTEPEVENT: {
		/** Indicates the step has started (<code>stepId</code> is a new step).*/
		DVLSTEPEVENT_STARTED:  0,
		/** Indicates the previous step has finished, and the new one has started (<code>stepId</code> is a new step).*/
		DVLSTEPEVENT_SWITCHED: 1,
		/** Indicates the step has finished playing, and no more steps are to be played (<code>stepId</code> is the old step).*/
		DVLSTEPEVENT_FINISHED: 2,
		/** Indicate the step is in the middle of playing. */
		DVLSTEPEVENT_PLAYING: 3
	},
	/**
	 * Enum of flag operations.
	 * @readonly
	 * @enum {number}
	 */
	DVLFLAGOPERATION: {
		/** Set the flag.*/
		DVLFLAGOP_SET:                0,
		/** Clear the flag.*/
		DVLFLAGOP_CLEAR:              1,
		/**
		 * If <code>DVLFLAGOP_MODIFIER_RECURSIVE</code>, then child node flags are set to parent flag values.
		 * For example, if parent is visible and child is hidden, after this operation both parent and child will be hidden.
		 */
		DVLFLAGOP_INVERT:             2,
		/**
		 * If <code>DVLFLAGOP_MODIFIER_RECURSIVE</code>, then child nodes are inverted.
		 * For example, if parent is visible and child is hidden, after this operation the parent will be hidden and the child visible.
		 */
		DVLFLAGOP_INVERT_INDIVIDUAL:  3,
		/** Bit mask.*/
		DVLFLAGOP_VALUES_BITMASK:     0x7F,
		/** Perform the operation recursively for all the subitems.*/
		DVLFLAGOP_MODIFIER_RECURSIVE: 0x80
	},
	/**
	 * Enum of zoom actions.
	 * @readonly
	 * @enum {number}
	 */
	DVLZOOMTO: {
		/** Zoom to the bounding box of the whole scene. */
		DVLZOOMTO_ALL:                        0,
		/** Zoom to the bounding box of visible nodes. */
		DVLZOOMTO_VISIBLE:                    1,
		/** Zoom to the bounding box of selected nodes. */
		DVLZOOMTO_SELECTED:                   2,
		/** Zoom to the bounding box of a specific node and its children. */
		DVLZOOMTO_NODE:                       3,
		/**  Same as <code>DVLZOOMTO_NODE</code>, but also does <code>[Renderer.SetIsolatedNode()]{@link Module.Renderer.SetIsolatedNode}</code> for the node. */
		DVLZOOMTO_NODE_SETISOLATION:          4,
		/** Zoom to the previously saved view. The view is saved every time <code>[Renderer.ZoomTo()]{@link Module.Renderer.ZoomTo}</code> is executed. */
		DVLZOOMTO_RESTORE:                    5,
		/**  Same as <code>DVLZOOMTO_RESTORE</code>, but also does <code>[Renderer.SetIsolatedNode()]{@link Module.Renderer.SetIsolatedNode}</code> with the <code>DVLID_INVALID</code> parameter. */
		DVLZOOMTO_RESTORE_REMOVEISOLATION:    6,
		/** Zoom to the left view. */
		VIEW_LEFT:   1 << 8,
		/** Zoom to the right view. */
		VIEW_RIGHT:  2 << 8,
		/** Zoom to the top view. */
		VIEW_TOP:    3 << 8,
		/** Zoom to the bottom view. */
		VIEW_BOTTOM: 4 << 8,
		/** Zoom to the back view. */
		VIEW_BACK:   5 << 8,
		/** Zoom to the front view. */
		VIEW_FRONT:  6 << 8
	},
	/**
	 * Enum of DVL execute actions.
	 * @readonly
	 * @enum {number}
	 */
	DVLEXECUTE: {
		/**
		 * VE query language. For example:
		 * <pre>
		 *   everything() select()
		 * <pre>
		 * Only for 3D files.
		 */
		DVLEXECUTE_QUERY:             0,
		/**
		 * SAP Paint XML. For example:
		 * <pre>
		 *   &lt;PAINT_LIST ASSEMBLY_PAINTING_ENABLED="true" ASSEMBLY_LEVEL="5">
		 *     &lt;PAINT COLOR="#008000" OPACITY="1.0" VISIBLE="true" ALLOW_OVERRIDE="false">
		 *       &lt;NODE ID="0__moto_x_asm">&lt;/NODE>
		 *     &lt;/PAINT>
		 *   &lt;/PAINT_LIST>
		 * </pre>
		 * Only for 3D files.
		 */
		DVLEXECUTE_PAINTXML:          1,
		/**
		 * CGM navigate action. For example:
		 * <pre>
		 *   pictid(engine_top).id(oil-pump-t,full+newHighlight)
		 * </pre>
		 * Only for 2D files.
		 * <br>See [WebCGM Intelligent Content]{@link http://www.w3.org/TR/webcgm20/WebCGM20-IC.html} for further information.
		 */
		DVLEXECUTE_CGMNAVIGATEACTION: 2,
		/**
		 * Dynamic Labels XML.
		 */
		DVLEXECUTE_DYNAMICLABELS:     3
	},
	/**
	 * Enum of rendering options.
	 * @readonly
	 * @enum {number}
	 */
	DVLRENDEROPTION: {
		/** Enable debug information to be displayed (for example, Frames Per Second (FPS)). By default, this is turned 'Off'. */
		DVLRENDEROPTION_SHOW_DEBUG_INFO:            0,
		/** Display backfacing triangles or not. By default, this option is 'Off'. */
		DVLRENDEROPTION_SHOW_BACKFACING:            1,
		/** Enable shadows to be displayed. By default, this option is 'On'. */
		DVLRENDEROPTION_SHOW_SHADOW:                2,
		/** Set camera rotation to Orbit or Turntable mode. By default, this option is 'Off' (Turntable mode). */
		DVLRENDEROPTION_CAMERA_ROTATION_MODE_ORBIT: 3,
		/**
		 * Clear the color buffer during each <code>[Renderer.RenderFrame()]{@link Module.Renderer.RenderFrame}</code> or not. Default: ON.
		 * By setting this option OFF, you can draw a textured background or paint video camera
		 * frame. The caller application would need to clear color buffer itself before calling
		 * <code>[Renderer.RenderFrame()]{@link Module.Renderer.RenderFrame}</code> if option is OFF.
		 */
		DVLRENDEROPTION_CLEAR_COLOR_BUFFER:         4,
		/** Enable Ambient Occlusion render mode. If this option is turned 'On', other render modes will be disabled. */
		DVLRENDEROPTION_AMBIENT_OCCLUSION:          5,
		/** Enable Anaglyph Stereo render mode. If this option is turned 'On', other render modes will be disabled. */
		DVLRENDEROPTION_ANAGLYPH_STEREO:            6,
		/** Enable hotspots to be displayed or not. By default, this option is 'Off'. This only works for 2D .cgm scenes. */
		DVLRENDEROPTION_SHOW_ALL_HOTSPOTS:          9,
		/** Enable Left+Right Stereo render mode. If this option is turned 'On', other render modes will be disabled. */
		DVLRENDEROPTION_LEFT_RIGHT_STEREO:          10,
		/** Enable Solid render mode. If this option is turned 'On', other render modes will be disabled. */
		DVLRENDEROPTION_SOLID:                      11,
		/** Enable Transparent render mode. If this option is turned 'On', other render modes will be disabled. */
		DVLRENDEROPTION_TRANSPARENT:                12,
		/** Enable Line Illustration render mode. If this option is turned 'On', other render modes will be disabled. */
		DVLRENDEROPTION_LINE_ILLUSTRATION:          13,
		/** Enable Solid Outline render mode. If this option is turned 'On', other render modes will be disabled. */
		DVLRENDEROPTION_SOLID_OUTLINE:              14,
		/** Enable Shaded Illustration render mode. If this option is turned 'On', other render modes will be disabled. */
		DVLRENDEROPTION_SHADED_ILLUSTRATION:        15
	},
	/**
	 * Enum of additional rendering options.
	 * @readonly
	 * @enum {number}
	 */
	DVLRENDEROPTIONF: {
		/**
		 * Indicates the DPI (Dots Per Inch) setting. Defaults to 132.0 on iPad, and 96.0 on other platforms.
		 * Used in calculating the size of sprites and polyline thickness. It is highly recommended that you set the DPI properly.
		 */
		DVLRENDEROPTIONF_DPI: 0,

		///**
		// * Amount of millions of triangles in scene used to determine whether "dynamic loading" should be performed or not.
		// * If the scene has less than the given number of triangles, normal rendering is performed.
		// * Otherwise, "dynamic loading" is done: meshes are loaded on demand and rendering via occlusion culling is performed.
		// * Default: 3.0 (3,000,000 triangles in scene is needed to use "dynamic loading").
		// * Set to 0.0f to always have dynamic loading.
		// * Set to -1.0f to disable dynamic loading.
		// *
		// * Not available in JavaScript applications.
		// */
		//DVLRENDEROPTIONF_DYNAMIC_LOADING_THRESHOLD: 1,

		///**
		// * Indicates the maximum amount of video memory (in megabytes) that DVL Core may use for loading meshes.
		// * Default: 256 MB on iPad, and 512 MB on other platforms.
		// *
		// * Not available in JavaScript applications.
		// */
		//DVLRENDEROPTIONF_VIDEO_MEMORY_SIZE: 2,

		/**
		 * Indicates the minimum visible CGM font size.
		 * The default font size is 20.
		 */
		DVLRENDEROPTIONF_MIN_VISIBLE_FONT_SIZE: 3,

		/**
		 * Indicates the minimum visible object size in pixels.
		 * The default object size is 4.
		 */
		DVLRENDEROPTIONF_MIN_VISIBLE_OBJECT_SIZE: 4
	},
	/**
	 * Enum of scene actions.
	 * @readonly
	 * @enum {number}
	 */
	DVLSCENEACTION: {
		/** Make all nodes in the scene "visible". */
		DVLSCENEACTION_SHOW_ALL:      0,
		/** Make all nodes in the scene "hidden". */
		DVLSCENEACTION_HIDE_ALL:      1,
		/** Make selected nodes and all their children "visible". */
		DVLSCENEACTION_SHOW_SELECTED: 2,
		/** Make selected nodes and all their children "hidden". */
		DVLSCENEACTION_HIDE_SELECTED: 3
	},
	/**
	 * Enum of scene information.
	 * @readonly
	 * @enum {number}
	 */
	DVLSCENEINFO: {
		/** Retrieve the list of child nodes.*/
		DVLSCENEINFO_CHILDREN:            0x01,
		/** Retrieve the list of selected nodes.*/
		DVLSCENEINFO_SELECTED:            0x02,
		/** Retrieve the prefix for scene localization.*/
		DVLSCENEINFO_LOCALIZATION_PREFIX: 0x04,
		/** Retrieve the dimensions of the scene.*/
		DVLSCENEINFO_DIMENSIONS:          0x08,
		/** Retrieve the current step ID and step time.*/
		DVLSCENEINFO_STEP_INFO:           0x10,
		/** Retrieve a list of layers in the scene.*/
		DVLSCENEINFO_LAYERS:              0x20,
		/** Retrieve the display units used in the scene.*/
		DVLSCENEINFO_DISPLAY_UNITS:       0x40,
		/** Retrieve a list of all materials. Reserved for future. */
		DVLSCENEINFO_MATERIALS:           0x80,
		/** Retrieve a list of all hotspots.*/
		DVLSCENEINFO_HOTSPOTS:            0x100,
		/** Retrieve a list of hotspot layers.*/
		DVLSCENEINFO_HOTSPOT_LAYERS:      0x200
	},
	/**
	 * Enum of node information retrieval methods.
	 * @readonly
	 * @enum {number}
	 */
	DVLNODEINFO: {
		/** Retrieve the name of the node. */
		DVLNODEINFO_NAME:            0x0001,
		/** Retrieve the node asset ID. */
		DVLNODEINFO_ASSETID:         0x0002,
		/** Retrieve the node unique ID. */
		DVLNODEINFO_UNIQUEID:        0x0004,
		/** Retrieve parents of the node. */
		DVLNODEINFO_PARENTS:         0x0008,
		/** Retrieve children of the node. */
		DVLNODEINFO_CHILDREN:        0x0010,
		/** Retrieve node flags. */
		DVLNODEINFO_FLAGS:           0x0020,
		/** Retrieve node opacity. */
		DVLNODEINFO_OPACITY:         0x0040,
		/** Retrieve node highlight color. */
		DVLNODEINFO_HIGHLIGHT_COLOR: 0x0080,
		/** Retrieve node URIs. */
		DVLNODEINFO_URI:             0x0100,
		/** Retrieve node object-oriented bounding box */
		DVLNODEINFO_BBOX:            0x0400
	},
	/**
	 * Enum of node flags.
	 * @readonly
	 * @enum {number}
	 */
	DVLNODEFLAG: {
		/** Indicates the node is visible. */
		DVLNODEFLAG_VISIBLE: 0x01,
		/** Indicates the node is selected.*/
		DVLNODEFLAG_SELECTED: 0x02,
		/** Indicates the node is a hotspot.*/
		DVLNODEFLAG_HOTSPOT: 0x04,
		/** Indicates the node is closed (the node itself and all children are treated as a single node).*/
		DVLNODEFLAG_CLOSED: 0x08,
		/** Indicates the node is single-sided.*/
		DVLNODEFLAG_SINGLE_SIDED: 0x10,
		/** Indicates the node is double-sided.*/
		DVLNODEFLAG_DOUBLE_SIDED: 0x20,
		/** Indicates the node cannot be 'hit'; that is, the node remains transparent when clicked or tapped.*/
		DVLNODEFLAG_UNHITABLE: 0x40,
		/** Indicates the node is a common billboard - it scales with the camera, but is always orthogonal.*/
		DVLNODEFLAG_BILLBOARD_VIEW: 0x80,
		/** Indicates the node is positioned on a 2D layer on top of the screen.*/
		DVLNODEFLAG_BILLBOARD_LOCK_TO_VIEWPORT: 0x100,
		// mapped node flags (flags that don't really exist and are emulated for DVL purposes)
		// (m_pChildren !: NULL)
		/** Indicates the node has children.*/
		DVLNODEFLAG_MAPPED_HASCHILDREN: 0x0200,
		// m_Name.NotEmpty()
		/** Indicates the node has a name.*/
		DVLNODEFLAG_MAPPED_HASNAME: 0x0400,
		// m_AssetID.NotEmpty()
		/** Indicates the node has an asset identifier.*/
		DVLNODEFLAG_MAPPED_HASASSETID: 0x0800,
		// m_UniqueID.NotEmpty() //
		/** Indicates the node has a unique identifier.*/
		DVLNODEFLAG_MAPPED_HASUNIQUEID: 0x1000,
		///** Reserved for internal use. */
		//DVLNODEFLAG_INTERNAL_QUERY_BIT0: 0x00010000,
		///** Reserved for internal use. */
		//DVLNODEFLAG_INTERNAL_QUERY_BIT1: 0x00020000,
		///** Reserved for internal use. */
		//DVLNODEFLAG_INTERNAL_QUERY_BIT2: 0x00040000,
		///** Reserved for internal use. */
		//DVLNODEFLAG_INTERNAL_QUERY_BIT3: 0x00080000,
		///** Reserved for internal use. */
		//DVLNODEFLAG_INTERNAL_QUERY_BIT4: 0x00100000,
		///** Reserved for internal use. */
		//DVLNODEFLAG_INTERNAL_QUERY_BIT5: 0x00200000,
		///** Reserved for internal use. */
		//DVLNODEFLAG_INTERNAL_QUERY_BIT6: 0x00400000,
		///** Reserved for internal use. */
		//DVLNODEFLAG_INTERNAL_QUERY_BIT7: 0x00800000,
		// temporary node flags (used for some purposes, but not saved/loaded from file
		/** Temporary flag: Indicates the visibility of the node in the previous frame.*/
		DVLNODEFLAG_TEMPORARY_PREVIOUS_VISIBILITY: 0x10000000,
		/** Temporary flag: Indicates the visibility of the node when the file was just loaded.*/
		DVLNODEFLAG_TEMPORARY_ORIGINAL_VISIBILITY: 0x20000000,
		/** Temporary flag: Indicates whether the node was consumed in this step or not.*/
		DVLNODEFLAG_TEMPORARY_CONSUMED: 0x40000000
	},
	/**
	 * Enum of options for building parts list.
	 * @readonly
	 * @enum {number}
	 */
	DVLPARTSLISTTYPE: {
		/**
		 * Build a parts list using all the nodes.
		 */
		DVLPARTSLISTTYPE_ALL:              0,
		/**
		 * Build a parts list using only the visible nodes.
		 */
		DVLPARTSLISTTYPE_VISIBLE:          1,
		/**
		 * Build a parts list using only the nodes consumed by a particular step.
		 * Step DVLID is passed as a parameter to the BuildPartsList() call.
		 */
		DVLPARTSLISTTYPE_CONSUMED_BY_STEP: 2
	},
	/**
	 * Enum of options for sorting parts list.
	 * @readonly
	 * @enum {number}
	 */
	DVLPARTSLISTSORT: {
		/** Sort parts alphabetically in ascending order (from A to Z).*/
		DVLPARTSLISTSORT_NAME_ASCENDING:    0,
		/** Sort parts alphabetically in descending order (from Z to A).*/
		DVLPARTSLISTSORT_NAME_DESCENDING:   1,
		/** Sort parts by the number of nodes in the part; parts with smaller number of nodes go first.*/
		DVLPARTSLISTSORT_COUNT_ASCENDING:   2,
		/** Sort parts by the number of nodes in the part; parts with larger number of nodes go first.*/
		DVLPARTSLISTSORT_COUNT_DESCENDING:  3
	},
	/**
	 * Enum of the options for finding nodes.
	 * @readonly
	 * @enum {number}
	 */
	DVLFINDNODETYPE: {
		/** Find node or nodes by node name.*/
		DVLFINDNODETYPE_NODE_NAME:      0,
		/** Find node or nodes by asset ID (asset ID is stored inside some VDS files, and is optional).*/
		DVLFINDNODETYPE_ASSET_ID:       1,
		/** Find node or nodes by unique ID (unique ID is stored inside some VDS files, and is optional).*/
		DVLFINDNODETYPE_UNIQUE_ID:      2,
		/** Find node or nodes by DS selector ID (DS selector ID is stored inside some VDS files, and is optional).*/
		DVLFINDNODETYPE_DSSELECTOR_ID:  3,
		/** Find node or nodes by metadata (metadata is optional).*/
		DVLFINDNODETYPE_METADATA:       4
	},
	/**
	 * Enum of the different modes for finding nodes.
	 * @readonly
	 * @enum {number}
	 */
	DVLFINDNODEMODE: {
		/** Match nodes by comparing node name/assetid/uniqueid with "str". Case sensitive search.
		 * This is the fastest search option (does buffer compare without UTF8 parsing).*/
		DVLFINDNODEMODE_EQUAL:                          0,
		/** Match nodes by comparing node name/assetid/uniqueid with "str". Case insensitive search. UTF8-aware.*/
		DVLFINDNODEMODE_EQUAL_CASE_INSENSITIVE:         1,
		/** Match nodes by finding "str" substring in node name/assetid/uniqueid. Case sensitive search. UTF8-aware.*/
		DVLFINDNODEMODE_SUBSTRING:                      2,
		/** Match nodes by finding "str" substring in node name/assetid/uniqueid. Case insensitive search. UTF8-aware.*/
		DVLFINDNODEMODE_SUBSTRING_CASE_INSENSITIVE:     3,
		/** Match nodes by comparing first "strlen(str)" symbols of node name/assetid/uniqueid with "str". Case sensitive search. UTF8-aware.*/
		DVLFINDNODEMODE_STARTS_WITH:                    4,
		/** Match nodes by comparing first "strlen(str)" symbols of node name/assetid/uniqueid with "str". Case insensitive search. UTF8-aware.*/
		DVLFINDNODEMODE_STARTS_WITH_CASE_INSENSITIVE:   5
	},
	/**
	 * Enum of client log types.
	 * @readonly
	 * @enum {number}
	 */
	DVLCLIENTLOGTYPE: {
		/** Indicates 'debug' type message has been logged (can usually be ignored).*/
		DVLLOGTYPE_DEBUG:   0,
		/** Indicates an 'information' type message has been logged (for example, the name of the file loaded, or the ID of the activated step).*/
		DVLLOGTYPE_INFO:    1,
		/** Indicates a 'warning' type message has been logged (something went wrong, but you can proceed).*/
		DVLLOGTYPE_WARNING: 2,
		/** Indicates an 'error' type message has been logged (something has failed).*/
		DVLLOGTYPE_ERROR:   3
	},
	/**
	 * Enum of material color parameters.
	 * @readonly
	 * @enum {number}
	 */
	DVLMATERIALCOLORPARAM: {
		/** Ambient color. */
		AMBIENT:  0,
		/** Diffuse color. */
		DIFFUSE:  1,
		/** Specular color. */
		SPECULAR: 2,
		/** Emissive color. */
		EMISSIVE: 3
	},
	/**
	 * Enum of material scalar parameters.
	 * @readonly
	 * @enum {number}
	 */
	DVLMATERIALSCALARPARAM: {
		/** Opacity. */
		OPACITY: 0,
		/** Glossiness. */
		GLOSSINESS: 1,
		/** Specular Level. */
		SPECULAR_LEVEL: 2
	},
	/**
	 * Enum of material color parameters.
	 * @readonly
	 * @enum {number}
	 */
	DVLMATERIALTEXTURE: {
		/** First diffuse color. */
		DIFFUSE:           0,
		/** Second diffuse color. */
		DIFFUSE2:          1,
		/** Third diffuse color. */
		DIFFUSE3:          2,
		/** Fourth diffuse color. */
		DIFFUSE4:          3,
		/** Self illumination color. */
		SELF_ILLUMINATION: 4,
		/** Reflection. */
		REFLECTION:        5,
		/** Bump map. */
		BUMP:              6
	},
	/**
	 * Enum of material texture parameters.
	 * @readonly
	 * @enum {number}
	 */
	DVLMATERIALTEXTUREPARAM: {
		/** Texture amount. */
		AMOUNT: 0,
		/** Texture offset in the U-axis. */
		OFFSET_U: 1,
		/** Texture offset in the V-axis. */
		OFFSET_V: 2,
		/** Texture scale in the U-axis. */
		SCALE_U: 3,
		/** Texture scale in the V-axis. */
		SCALE_V: 4,
		/** Texture angle. */
		ANGLE: 5
	},
	/**
	 * Enum of material texture flags.
	 * @readonly
	 * @enum {number}
	 */
	DVLMATERIALTEXTUREFLAG: {
		/** Clamp u flag. */
		CLAMP_U: 0,
		/** Clamp v flag. */
		CLAMP_V: 1,
		/** Modulate flag. */
		MODULATE: 2,
		/** Invert flag. */
		INVERT: 4,
		/** Color map flag. */
		COLOR_MAP: 5,
		/** Decal flag. */
		DECAL: 6
	},
	/**
	 * Enum of camera projection types.
	 * @readonly
	 * @enum {number}
	 */
	DVLCAMERAPROJECTION: {
		/** Perspective projection. */
		PERSPECTIVE:   0,
		/** Orthographic projection. */
		ORTHOGRAPHIC:  1
	},
	/**
	 * Enum of camera field of view (FOV) binding.
	 * @readonly
	 * @enum {number}
	 */
	DVLCAMERAFOVBINDING: {
		/** Bind the camera field of view to the shortest edge of the viewport. */
		MIN:  0,
		/** Bind the camera field of view to the longest edge of the viewport. */
		MAX:  1,
		/** Bind the camera field of view horizontally. */
		HORZ: 2,
		/** Bind the camera field of view vertically. */
		VERT: 3
	},
	/**
	 * Enum of flag states related to creating node copies.
	 * @readonly
	 * @enum {number}
	 */
	DVLCREATENODECOPYFLAG: {
		/** Copy children of the node. */
		COPY_CHILDREN:  0x1,
		/** Copy animations attached to the node. */
		COPY_ANIMATION: 0x2,
		/** Copy children of the node and animations attached to the node. */
		FULL_COPY:   0xFFFF
	},
	/**
	 * Enum of flag states describing the features of a VDS file. Flags can be combined.
	 * @readonly
	 * @enum {number}
	 */
	DVLFILEFLAG: {
		/** Indicates the individual pages inside the file are compressed.*/
		PAGESCOMPRESSED: 1,
		/** Indicates the whole file is compressed.*/
		WHOLEFILECOMPRESSED: 2,
		/** Indicates the file is encrypted.*/
		ENCRYPTED: 4
	},
	/**
	 * Enum of reset view options.
	 * @readonly
	 * @enum {number}
	 */
	DVLRESETVIEWFLAG: {
		/** Reset the camera position. */
		CAMERA: 1,
		/** Reset the node visibility. */
		VISIBILITY: 1 << 1,
		/** Perform smooth animated transition between current viewport and home viewport. */
		SMOOTHTRANSITION: 1 << 2
	},
	/** Enum of actions that define the way a layer is applied to the scene in <code>ApplyLayerVisibility()</code>.
	 * @readOnly
	 * @enum {number}
	 */
	DVLLAYERVISIBILITYACTION: {
		/** Hide all nodes in the scene, and then show only the nodes in the layer.*/
		HIDEALL_SHOWLAYER: 0,
		/** Show all nodes in the scene, and then hide only the nodes in the layer.*/
		SHOWALL_HIDELAYER: 1,
		/** Make nodes in the layer visible. Does not change the visibility of nodes that are not in the layer.*/
		SHOWLAYER: 2,
		/** Make nodes in the layer hidden. Does not change the visibility of nodes that are not in the layer.*/
		HIDELAYER: 3
	},
	/** of model source locations.
	 * @readonly
	 * @enum {string}
	 */
	SOURCELOCATION: {
		/** File is loaded from a computer's local file system via the [File API]{@link https://developer.mozilla.org/en-US/docs/Web/API/File}. */
		LOCAL: "local",
		/** File is loaded from a remote location via the HTTP(S) protocol. */
		REMOTE: "remote"
	},
	/**
	 * Indicates an 'invalid' value of the DVLID type.
	 * @readonly
	 * @type {string}
	 */
	DVLID_INVALID: "iffffffffffffffff"
}; // DvlEnums

Object.getOwnPropertyNames(DvlEnums).forEach(function(propName) {
	sap.ve.dvl[propName] = DvlEnums[propName];
});

/**
 * Top level SAP namespace.
 * @namespace sap
 */

/**
 * SAP Visual Enterprise namespace.
 * @namespace sap.ve
 */

// This namespace defined as alias for DvlEnums.
///**
// * SAP Visual Enterprise DVL namespace.
// * @namespace sap.ve.dvl
// */

/**
 * Creates a DVL module runtime instance.
 * @function sap.ve.dvl.createRuntime
 * @param {object} [options] Emscripten runtime module settings. A JSON object with the following properties:
 * @param {number} [options.totalMemory=128*1024*1024] Size of Emscripten module memory in bytes.
 * @param {string} [options.logElementId]              ID of a textarea DOM element to write the log to.
 * @param {string} [options.statusElementId]           ID of a DOM element to write the status messages to.</li>
 * @returns {sap.ve.dvl~DVL}                           A DVL module runtime instance.
 */

/**
 * DVL module runtime. Instances of this type are not created with operator <code>new</code>.
 * They can only be created with a call to [sap.ve.dvl.createRuntime()]{@link sap.ve.dvl.createRuntime}.
 * @typedef {Object} sap.ve.dvl~DVL
 * @property {sap.ve.dvl~CreateCoreInstance} CreateCoreInstance A function to create a new instance of DVL core.
 * @property {sap.ve.dvl~Settings}           Settings           The DVL settings used internally to track various instance properties.
 * @property {sap.ve.dvl~Client}             Client             A set of callback functions used for notifications from the DVL library.
 * @property {sap.ve.dvl~Core}               Core               A set of functions that defines the main interface for interaction with the DVL library.
 * @property {sap.ve.dvl~Scene}              Scene              A set of functions that allow to access the scene tree, enumerate nodes and perform some operations,
 *                                                              like selection or metadata retrieval.
 * @property {sap.ve.dvl~Renderer}           Renderer           A set of functions for interaction with the rendering system of the DVL library.
 * @property {sap.ve.dvl~Library}            Library            A set of functions for interaction with file library.
 */

/**
 * Returns the description of the <code>DVLRESULT</code> code.
 * @function sap.ve.dvl~getDvlResultDescription
 * @param {sap.ve.dvl.DVLRESULT} code The <code>DVLRESULT</code> enum code.
 * @returns {string} The description of the <code>DVLRESULT</code> code.
 */

/**
 * Creates a new instance of DVL core.
 * @function sap.ve.dvl~CreateCoreInstance
 * @param {string} clientId Token representing the target client instance. This is usually the canvas ID.
 * @returns {string|sap.ve.dvl.DVLRESULT} The DVL core token or an error code if fails.
 */
