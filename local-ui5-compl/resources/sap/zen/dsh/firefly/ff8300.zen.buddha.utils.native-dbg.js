/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap ArrayBuffer Uint8Array */
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/base/Log",
    "sap/zen/commons/thirdparty/xlsx-protobi",
    "sap/base/i18n/ResourceBundle",
    "sap/ui/thirdparty/URI",
    "sap/zen/dsh/utils/dispatcher",
    "sap/sac/df/firefly/library",
    "sap/ui/thirdparty/jszip"
  ],
  function(
    jQuery, Log, XLSX, ResourceBundle, URI, Dispatcher, FF
  ){
    jQuery.sap.declare("sap.zen.dsh");
    sap.firefly = FF;

var $Firefly = {
  createByPrototype : function(thePrototype) {
    var F = function() {
    };
    F.prototype = thePrototype;
    return new F();
  },
  createClass : function(fullQualifiedClassName, superClass, classDefinition) {
    var namespaceArray;
    if (Object.prototype.toString.call(fullQualifiedClassName) === "[object Array]") {
      namespaceArray = fullQualifiedClassName;
    } else {
      namespaceArray = fullQualifiedClassName.split(".");
    }
    var parent = window;
    var currentElementName;
    var currentElement;
    var i;
    var errorMessage;
    var namespaceLen = namespaceArray.length - 1;
    for (i = 0; i < namespaceLen; i++) {
      currentElementName = namespaceArray[i];
      currentElement = parent[currentElementName];
      if (currentElement === undefined) {
        parent[currentElementName] = {};
        currentElement = parent[currentElementName];
      }
      parent = currentElement;
    }
    currentElementName = namespaceArray[namespaceLen];
    var ffClass = function() {
    };
    ffClass.prototype = {};
    if (superClass !== null) {
      if (superClass === undefined) {
        errorMessage = "$Firefly.createClass " + currentElementName
          + " failed due to missing superClass";
        Log.error( errorMessage );
        return;
      }
      ffClass = function() {
        superClass.call(this);
      };
      var SuperClass = superClass;
      ffClass.prototype = new SuperClass();
      ffClass.$superclass = superClass.prototype;
    }
    var myPrototype = ffClass.prototype;
    var property;
    var staticProperty;
    var myStatics;
    for (property in classDefinition) {
      if (classDefinition.hasOwnProperty(property)) {
        if (property === "$statics") {
          myStatics = classDefinition[property];
          for (staticProperty in myStatics) {
            if (myStatics.hasOwnProperty(staticProperty)) {
              ffClass[staticProperty] = myStatics[staticProperty];
            }
          }
        } else {
          myPrototype[property] = classDefinition[property];
        }
      }
    }
    ffClass.clazzName = currentElementName;
    parent[currentElementName] = ffClass;
  }
};

$Firefly.createClass(
  "sap.buddha.XWindow",
  sap.firefly.XObject,
  {
    $statics:
    {
      create : function () {
        var w= new sap.buddha.XWindow();
        w.initBase();
        return w;
      }
    },
    // *** statics end ***

    oPage : null,
    bSFinMode : false,

    globalVarMap : null,

    toString: function()
    {
      return "[???]";
    },

    m_booleanValue : false,

    initBase : function () {
      if(!sap.zen.dsh.wnd){
        sap.zen.dsh.wnd={};
      }
      this.context = {};
      this.globalVarMap = sap.firefly.XHashMapByString.create();
      var that = this;

      // Reset Window properties
      sap.zen.dsh.buddhaHasSendLock = 0;
      // keep the window Queue since we need it since requests might still be open
      sap.zen.dsh.buddhaDispatchQueue = sap.zen.dsh.buddhaDispatchQueue ? sap.zen.dsh.buddhaDispatchQueue : [];

      var bDebugMode = jQuery.sap.debug();
      if(bDebugMode){
        var myFunction = function(e) {
          //Ctrl-Alt-"Z" - download support zip
          if (e.ctrlKey && e.altKey && e.which === 90) {
            that.oPage.getSupportZip();
          }
        };
        jQuery(document).unbind("keydown.dssupportzip").bind("keydown.dssupportzip", myFunction);
      }
      this.context.exec = function(s){
        try {
          with(this){
            eval(s);
          }
        } catch (e) {
          Log.error(e);
          Log.error(e.stack);
          if(that.oPage){
            var s1 = "Error during script execution of (" + s +")";
            if(e.message){
              s1 += ": " + e.message;
              that.oPage.createErrorMessage(e.message);
            } else {
              that.oPage.createErrorMessage("Error during script execution");
            }
            var logging = that.oPage.getLogging();
            if ((logging != null) && logging.isLoggable(sap.buddha.XLogging.XDEBUG, null)) {
              Log.error("XWindow: exception during script execution", s1, null);
            } else {
              Log.error("XWindow: exception during script execution", s1);
            }
          }
          return false;
        }
        return true;
      };
      this.context.putScript = function(name, script){
        try {
          with(this){
            that.context[name] = eval(script);
          }
        } catch (e) {
          Log.error(e);
          Log.error(e.stack);
          if(that.oPage){
            var s = "Error during script execution of (" + s +")";
            if(e.message){
              s += ": " + e.message;
            }
            that.oPage.createErrorMessage(s);
          }
          return false;
        }
        return true;
      };
    },
    putInContext : function (name, obj) {
      this.context[name] = obj;
    },
    setEnumContext : function (name, obj) {
      var nativeElement = obj.getNativeElement();
      this.context[name] = nativeElement;
    },
    getContext : function( name )
    {
      return this.context[name];
    },
    execute : function (script) {
      if(script){
        try{
          this.context.exec(script);
        }catch(e){
          if(this.oPage){
            this.oPage.createErrorMessage(e.message);
          }
          return false;
        }
      }
      this.captureGlobalVariables();
      return true;
    },
    setPage : function(oPageGiven){
      this.oPage = oPageGiven;
    },
    setSFinMode : function(bSFinMode){
      this.bSFinMode = bSFinMode;
      sap.zen.dsh.getLoadingIndicator(this.bSFinMode);
    },
    dispatchJsonString : function (zenJson, initial) {
      zenJson = unescape(zenJson);
      var doc = jQuery.parseJSON(zenJson);
      if (initial == false) {
        doc = doc.delta;
        if(!(doc instanceof Array)){
          var arr= [];
          arr.push(doc);
          doc= arr;
        }
        if(doc.length>0){
          setTimeout(function(){
            Dispatcher.dispatchDelta(doc);
          },1);
        }
      } else {
        sap.zen.dsh.sapbi_phxObj = Dispatcher.dispatchCreateControl(doc.component, function(oRootGrid) {
          oRootGrid.placeAt("sapbi_snippet_ROOT", "only");
        });
      }
    },
    showLoadingIndicator: function() {
      //This is done in the queue, implemented in DSHqueue.js
      var loadingIndicator = sap.zen.dsh.getLoadingIndicator();
      if (loadingIndicator) {
        loadingIndicator.show();
      }
    },
    showImmediatelyLoadingIndicator: function() {
      var loadingIndicator = sap.zen.dsh.getLoadingIndicator();
      if (loadingIndicator) {
        loadingIndicator.showImmediately();
      }
    },
    hideLoadingIndicator: function() {
      //Show is done in the queue, implemented in DSHqueue.js
      var loadingIndicator = sap.zen.dsh.getLoadingIndicator();
      if (loadingIndicator) {
        loadingIndicator.hideAsync();
      }
    },
    setExecuteShowHideLoadingIndicator: function(bExecuteShowHide) {
      var loadingIndicator = sap.zen.dsh.getLoadingIndicator();
      if (loadingIndicator) {
        loadingIndicator.setExecuteShowHide(bExecuteShowHide);
      }
    },
    /**
     * When dispatching we need to queue the requests since the order of the calls is very important
     *
     * The Queue has to be global since the Dispatcher only has one instance (it will be overridden by new instances of Window)
     * This is that case during Navigation (JumpTo)
     *
     * Scenario:
     *      - Initial Call where all objects are created
     *              In this stage not all content is available for rendering
     *              e.g. Grid is displaying "No Data to display" since it has not yet received the ResultSet from InA
     *      - FollowUp Call after ResultSet has been retrieved from InA
     *              FilterBar and Grid Control now receive upToDate Content aligning to ResultSet of InA
     *
     * It is important that first the Objects are created before calls containing delta rendering are dispatched
     * Depending on latency, performance etc. these calls are sometimes being mixed up.
     * We need to ensure that they are processed in the exact order as they come in
     */
    dispatchJsonObject : function (json, initial, pageId) {
      /*
       * Ensure RootControl has been rendered by UI5 since content of all other controls rely on the existence of this control
       * In addition to this ensure that dispatch request is queued properly if other requests already exist
       */
      var that = this;
      var loInterval = setInterval(function() {
        // only process request if RootControl has been rendered and request is 1st item in Queue to be processed
        if (that.oPage.hasRootControlBeenRendered() && (sap.zen.dsh.buddhaDispatchQueue[0] && sap.zen.dsh.buddhaDispatchQueue[0].oInterval === loInterval)) {
          clearInterval(loInterval); // remove the Interval
          that._dispatchJsonObject(json, initial, pageId , sap.zen.dsh.buddhaDispatchQueue[0]);
        }
      }, 1);
      var loRequest = {
        initialRequest: initial,
        pageId: pageId,
        queueId: loInterval.toString(),
        inProcess: false,
        oInterval: loInterval,
      };
      sap.zen.dsh.buddhaDispatchQueue.push(loRequest); // add QueueId Request to end of Queue
    },
    _dispatchJsonObject : function (json, initial, pageId, oQueueRequest) {
      oQueueRequest.inProcess = true;
      // retrieve the Dispatcher for Rendering
      var loDispatcher = Dispatcher;
      if (json.content.bInterComponentDragDropEnabled) {
        loDispatcher.setInterComponentDragDropEnabled(true);
      } else {
        loDispatcher.setInterComponentDragDropEnabled(false);
      }
      loDispatcher.dshPrefix = this.oPage.getDshControlId();
      // Provide the Document containing the required JSON for the Objects to be rendered
      var ltDoc = json.content.pageContent;
      if (initial === false) {
        ltDoc = ltDoc.delta;
        if(!(ltDoc instanceof Array)){
          var ltArray = [];
          ltArray.push(ltDoc);
          ltDoc = ltArray;
        }
        ltDoc = {"delta": ltDoc};
      }
      if (json.content.requiredModules && json.content.requiredModules.length) {
        Log.info(
          "Load required Modules: \n" + json.content.requiredModules.join("\n")
        );
      }
      sap.zen.dsh.buddhaDispatchQueue.shift(); //  remove Processing QueueId from top of Queue
      sap.zen.dsh.sapbi_registerHandlers(arguments);
      sap.zen.dsh.sapbi_phx(pageId+"sapbi_snippet_ROOT", ltDoc); // dispatch for rendering
    },
    getPageObject : function(object){
      if(object && object.getPageObject){
        return object.getPageObject();
      }
      return null;
    },
    getLocale : function(){
      var l_lang = "en-GB";
      if (navigator.userLanguage){ // Explorer
        l_lang = navigator.browserLanguage;
      }
      else if (navigator.language){ // FF
        l_lang = navigator.language;
      }
      return l_lang;
    },
    setLocale : function(){
    },
    unwrapXObject: function (object) {
      if (object) {
        if(object.getString){
          return object.getString();
        }
        if(object.getBoolean){
          return object.getBoolean();
        }
        if(object.getDouble){
          return object.getDouble();
        }
        if(object.getInteger){
          return object.getInteger();
        }
        if (object.size) {
          var result = [];
          for (var i=0; i<object.size(); i++) {
            result.push(this.unwrapXObject(object.get(i)));
          }
          return result;
        }
      }
      return undefined;
    },
    setContextForGlobalVariable : function(sKey,oValue){
      this.putInContext(sKey, this.unwrapXObject(oValue));
    },
    addUrlParam : function(){
    },
    createJSArray : function(list) {
      var jsArray= [];
      var i = 0;
      for(i=0;i<list.size();i++){
        jsArray.push(list.get(i));
      }
      return jsArray;
    },
    createJSArrayOfStrings : function(list) {
      var jsArray= [];
      var i = 0;
      for(i=0;i<list.size();i++){
        jsArray.push(list.get(i));
      }
      return jsArray;
    },
    wrapAndPutInContext : function(id, obj) {
      var javaScriptWrapperName = obj.getJavaScriptWrapperName();
      this.putInContext(id, obj);
      this.execute("sap.zen.dsh.utils.Wrapper.origObjects[\"" + id + "\"] = " + id + ";");
      this.execute(id + "= sap.zen.dsh.utils.Wrapper.wrap(\"" + javaScriptWrapperName + "\"," + id + ");");
    },
    getGlobalVariables : function(updateValues) {
      if (updateValues) {
        this.captureGlobalVariables();
      }
      return this.globalVarMap;
    },
    captureGlobalVariables : function() {
      if (this.context.APPLICATION_PROPERTIES != null) {
        var names = this.context.APPLICATION_PROPERTIES.getGlobalVariableNames();
        this.globalVarMap.clear();
        for( var i = 0; i < names.size(); i++){
          var name = names.get(i);
          var value = this.getContext(name);
          this.globalVarMap.put(name, value);
        }
      }
    },
    putGlobalScriptInContext : function(name, script) {
      this.context.putScript(name, script);
    },
    resetLock : function(){
      sap.zen.dsh.buddhaHasSendLock = 0;
      Log.info("xwindow resetLock: " + sap.zen.dsh.buddhaHasSendLock);
    },
    increaseLock : function(){
      sap.zen.dsh.buddhaHasSendLock++;
      Log.info("xwindow increaseLock: " + sap.zen.dsh.buddhaHasSendLock);
    },
    decreaseLock : function(){
      sap.zen.dsh.buddhaHasSendLock--;
      if (sap.zen.dsh.buddhaHasSendLock < 0) {
        sap.zen.dsh.buddhaHasSendLock = 0;
      }
      Log.info("xwindow decreaseLock: " + sap.zen.dsh.buddhaHasSendLock);
    },
    log : function(message){
      Log.info(message);
    },
    setMainMode : function(bMainMode){
      Dispatcher.setMainMode(bMainMode);
    },
    setCompactMode : function(bCompactMode){
      if(Dispatcher.isMainMode()){
        Dispatcher.setCompactMode(bCompactMode);
      }
    },
    parseJSON : function(json) {
      return JSON.parse(json);
    },
    stringifyJSON : function(object) {
      return JSON.stringify(object);
    }
  }
);

$Firefly.createClass(
	"sap.buddha.XJSAndCSSLoader", 
	sap.firefly.XObject, 
	{
		$statics:
		{
			create : function () {
				var w= new sap.buddha.XJSAndCssLoader();
				return w;
			}
		},
		// *** statics end ***
		
		loadJS : function() {
	      return null;
		},
		
		loadBuildInJS : function(sVarName) {
			return window[sVarName];
		},
		
		loadCSS : function(libId, url, oPage) {
	      jQuery("head").append(
	        "<link rel=\"stylesheet\" href=\""+oPage+libId+"/"+url+"\" type=\"text/css\" />"
	      );
		}
	}
);
$Firefly.createClass(
	"sap.buddha.XXmlNode",
	sap.firefly.XObject,
	{
		$statics : {
			create : function(root) {
				var node = new sap.buddha.XXmlNode();
				node.setObject(root);
				return node;
			},
		
			toStringInternal: function(node) {
				var sXML = ( new window.XMLSerializer() ).serializeToString(node);
			    return sXML;
			}
		},
		// *** statics end ***
		
		toString : function() {
	      var sXML = ( new window.XMLSerializer() ).serializeToString(this.root);
	      return sXML;
		},
		
		root : null,
		
		setObject : function(node) {
			this.root = node;
		},
		
		getAttribute : function(name) {
			var attributes = this.root.attributes;
			var obj = attributes[name];
			if (obj == null) {
				return null;
			}
			var value = obj.value;
			return value;
		},
		
		getText : function() {
			return this.root.textContent;
		},
		
		getChildren : function(name) {
			var list = sap.firefly.XList.create();
			var cn = this.root.childNodes;
			var nameToFind = "bi:" + name;
			for (var i = 0, len = cn.length; i < len; i++) {
				var node = cn[i];
				if (node.nodeName.toLowerCase() === nameToFind) {
					var xmlNode = sap.buddha.XXmlNode.create(node);
					list.add(xmlNode);
				}
			}
			return list;
		},
		
		getChildrenWoBiNameSpace : function(name) {
			var list = sap.firefly.XList.create();
			var cn = this.root.childNodes;
			for (var i = 0, len = cn.length; i < len; i++) {
				var node = cn[i];
				if (node.nodeName === name) {
					var xmlNode = sap.buddha.XXmlNode.create(node);
					list.add(xmlNode);
				}
			}
			return list;
		},
		
		getFirstChild : function(name) {
			return this.getFirstChildWithAttributeValue("bi:" + name, null, null, false);
		},
		
		getFirstChildWoBiNameSpace : function(name) {
			return this.getFirstChildWithAttributeValue(name, null, null, false);
		},
		
		getFirstChildWithNameTag : function(name) {
			return this.getFirstChildWithAttributeValue(null, "name", name, false);
		},
		
		getFirstChildWithAttributeValue : function(tagName, attributName, attributeValue, recurse) {
			var cn = this.root.childNodes;
			var xmlNode = null;
			for (var i = 0, len = cn.length; i < len; i++) {
				var ele = cn[i];
				if (recurse) {
					xmlNode = sap.buddha.XXmlNode.create(ele).getFirstChildWithAttributeValue(tagName, attributName, attributeValue, recurse);
					if (xmlNode !== null) {
						return xmlNode;
					}
				}
				if (tagName == null || tagName === ele.nodeName) {
					var attributes = ele.attributes;
					if (attributes != null) {
						if (attributeValue == null) {
							xmlNode = sap.buddha.XXmlNode.create(ele);
							return xmlNode;
						}
						var namedItem = attributes[attributName];
						if (namedItem != null && namedItem.value === attributeValue) {
							xmlNode = sap.buddha.XXmlNode.create(ele);
							return xmlNode;
						}
					}
				}
			}
			return null;
		},
		
		setAttribute : function(name, value) {
			if (value != null) {
				this.root.setAttribute(name, value);
			} else {
				if (this.root.hasOwnProperty(name)) {
					this.root.removeAttribute(value);
				}
			}
		},
		
		setCData : function(value) {
			var child = this.root.firstChild;
			if (child != null) {
				this.root.removeChild(child);
			}
			var node = this.root.ownerDocument.createCDATASection(value);
			this.root.appendChild(node);
		},
		
		createChild : function(name) {
			var node = document.createElement("bi:" + name);
			this.root.appendChild(node);
			var xmlNode = sap.buddha.XXmlNode.create(node);
			return xmlNode;
		},
		
		createChildWithNameTag : function(name) {
			var node = document.createElement("bi:property");
			this.root.appendChild(node);
			node.setAttribute("name", name);
			var xmlNode = sap.buddha.XXmlNode.create(node);
			return xmlNode;
		},
		
		setProperty : function(name, value, asCData) {
			var firstChildWithNameTag = this.getFirstChildWithNameTag(name);
			if (firstChildWithNameTag == null) {
				firstChildWithNameTag = this.createChildWithNameTag(name);
			}
			if (asCData) {
				var firstChildWithNameTag2 = firstChildWithNameTag.getFirstChild("value");
				if (firstChildWithNameTag2 == null) {
					firstChildWithNameTag2 = firstChildWithNameTag.createChild("value");
				}
				firstChildWithNameTag2.setCData(value);
			} else {
				firstChildWithNameTag.setAttribute("value", value);
			}
		},
		
		asBookmarkString : function() {
			var cloneNode = this.root.cloneNode(false);
			var childNodes = this.root.childNodes;
			for (var i = 0, len = childNodes.length; i < len; i++) {
				var item = childNodes[i];
				var nodeName = item.nodeName;
				var doCopy = !(nodeName === "bi:component");
		
				// Whitelist - do not save scripting
				var itemAttributes = item.attributes;
		
				if (itemAttributes != null) {
					doCopy = false;
					var attributeItem = itemAttributes["name"];
		
					if (attributeItem != null) {
						var attributeItemName = attributeItem.value.toUpperCase();
						if (attributeItemName === "DATA_SOURCE_DEFINITION" || attributeItemName === "GLOBALVARIABLES") {
							doCopy = true;
						}
					}
				}
		
				if (doCopy) {
					var cloneNode2 = item.cloneNode(true);
					cloneNode.appendChild(cloneNode2);
				}
			}
			var s = sap.buddha.XXmlNode.toStringInternal(cloneNode);
			return s;
		},
		
		asDeltaBookmarkString : function(inputNode) {
			var cloneNode;
			var childNodes;
			if (inputNode == null) {
				cloneNode = this.root.cloneNode(false);
				childNodes = this.root.childNodes;
			} else {
				cloneNode = inputNode;
				cloneNode = cloneNode.cloneNode(false);
				childNodes = inputNode.childNodes;
			}
			var t = "";
			for (var i = 0, len = childNodes.length; i < len; i++) {
				var item = childNodes[i];
				var nodeName = item.nodeName;
				var doCopy = !(nodeName === "bi:component");
				if (doCopy) {
					var cloneNode2 = item.cloneNode(true);
					cloneNode.appendChild(cloneNode2);
				} else {
					var componentNode = item.cloneNode(true);
					var u = this.asDeltaBookmarkString(componentNode);
					t = sap.firefly.XString.concatenate2(t, u);
				}
			}
			var s = sap.buddha.XXmlNode.toStringInternal(cloneNode);
			s = sap.firefly.XString.concatenate2(s, t);
			return s;
		},
		
		getAllChildren : function() {
			var list = sap.firefly.XList.create();
			var cn = this.root.childNodes;
			for (var i = 0, len = cn.length; i < len; i++) {
				var xmlNode = sap.buddha.XXmlNode.create(cn[i]);
				list.add(xmlNode);
			}
			return list;
		},
		
		getNode : function() {
			return this.root;
		},
		
		removeChild : function(child) {
			this.root.removeChild(child.getNode());
		},
		
		getNodeName : function() {
			return this.root.nodeName;
		},
		
		appendChild : function(node) {
			this.root.appendChild(node.getNode());
		},
		
		cloneNode : function (deep) {
			return sap.buddha.XXmlNode.create(this.root.cloneNode(deep));
		}
	}
);
var JXG;
$Firefly.createClass(
	"sap.buddha.XXmlUtils", 
	null, 
	{	
		$statics:
		{
			decompress : function(base64) {
				var result = JXG.decompress(base64);
				return result;
			},
			decodeBase64ToByteArray : function(base64) {
				return atob(base64);
			},
			getRootNode : function(xml) {
				if(!xml){
					return null;
				}
				var xmlDoc = $.parseXML(xml);
				var xmlNode = sap.buddha.XXmlNode.create();
				var cn = xmlDoc.childNodes;
				for (var i = 0, len = cn.length; i < len; i++) {
					var n = cn[i];
					if(n.nodeType === 1){
						xmlNode.setObject(n);
						break;
					}
				}
				
				return xmlNode;
			}
		},
		// *** statics end ***
		
		toString : function() {
			return "[???]";
		}
	}
);

JXG = {
	exists : (function(undefined) {
		return function(v) {
			return !(v === undefined || v === null);
		}
	})()
};
JXG.decompress = function(str) {
	var a = new JXG.Util.Unzip(JXG.Util.Base64.decodeAsArray(str));
	var b = a.unzip();
	return unescape(b[0][0]);
};
/*
 * Copyright 2008-2012 Matthias Ehmann, Michael Gerhaeuser, Carsten Miller,
 * Bianca Valentin, Alfred Wassermann, Peter Wilfahrt
 * 
 * This file is part of JSXGraph.
 * 
 * Dual licensed under the Apache License Version 2.0, or LGPL Version 3
 * licenses.
 * 
 * You should have received a copy of the GNU Lesser General Public License
 * along with JSXCompressor. If not, see <http://www.gnu.org/licenses/>.
 * 
 * You should have received a copy of the Apache License along with
 * JSXCompressor. If not, see <http://www.apache.org/licenses/>.
 * 
 */

/**
 * @fileoverview Utilities for uncompressing and base64 decoding
 */

/**
 * @class Util class Class for gunzipping, unzipping and base64 decoding of
 *        files. It is used for reading GEONExT, Geogebra and Intergeo files.
 * 
 * Only Huffman codes are decoded in gunzip. The code is based on the source
 * code for gunzip.c by Pasi Ojala
 * @see <a
 *      href="http://www.cs.tut.fi/~albert/Dev/gunzip/gunzip.c">http://www.cs.tut.fi/~albert/Dev/gunzip/gunzip.c</a>
 * @see <a href="http://www.cs.tut.fi/~albert">http://www.cs.tut.fi/~albert</a>
 */
JXG.Util = {};

/**
 * Unzip zip files
 */
JXG.Util.Unzip = function(barray) {
  var outputArr = [], debug = false, gpflags, files = 0, unzipped = [];
  var buf32k = new Array(32768), bIdx = 0, modeZIP = false;
  var bitReverse = [
    0x00, 0x80, 0x40, 0xc0, 0x20, 0xa0, 0x60, 0xe0, 0x10, 0x90,
    0x50, 0xd0, 0x30, 0xb0, 0x70, 0xf0, 0x08, 0x88, 0x48, 0xc8, 0x28,
    0xa8, 0x68, 0xe8, 0x18, 0x98, 0x58, 0xd8, 0x38, 0xb8, 0x78, 0xf8,
    0x04, 0x84, 0x44, 0xc4, 0x24, 0xa4, 0x64, 0xe4, 0x14, 0x94, 0x54,
    0xd4, 0x34, 0xb4, 0x74, 0xf4, 0x0c, 0x8c, 0x4c, 0xcc, 0x2c, 0xac,
    0x6c, 0xec, 0x1c, 0x9c, 0x5c, 0xdc, 0x3c, 0xbc, 0x7c, 0xfc, 0x02,
    0x82, 0x42, 0xc2, 0x22, 0xa2, 0x62, 0xe2, 0x12, 0x92, 0x52, 0xd2,
    0x32, 0xb2, 0x72, 0xf2, 0x0a, 0x8a, 0x4a, 0xca, 0x2a, 0xaa, 0x6a,
    0xea, 0x1a, 0x9a, 0x5a, 0xda, 0x3a, 0xba, 0x7a, 0xfa, 0x06, 0x86,
    0x46, 0xc6, 0x26, 0xa6, 0x66, 0xe6, 0x16, 0x96, 0x56, 0xd6, 0x36,
    0xb6, 0x76, 0xf6, 0x0e, 0x8e, 0x4e, 0xce, 0x2e, 0xae, 0x6e, 0xee,
    0x1e, 0x9e, 0x5e, 0xde, 0x3e, 0xbe, 0x7e, 0xfe, 0x01, 0x81, 0x41,
    0xc1, 0x21, 0xa1, 0x61, 0xe1, 0x11, 0x91, 0x51, 0xd1, 0x31, 0xb1,
    0x71, 0xf1, 0x09, 0x89, 0x49, 0xc9, 0x29, 0xa9, 0x69, 0xe9, 0x19,
    0x99, 0x59, 0xd9, 0x39, 0xb9, 0x79, 0xf9, 0x05, 0x85, 0x45, 0xc5,
    0x25, 0xa5, 0x65, 0xe5, 0x15, 0x95, 0x55, 0xd5, 0x35, 0xb5, 0x75,
    0xf5, 0x0d, 0x8d, 0x4d, 0xcd, 0x2d, 0xad, 0x6d, 0xed, 0x1d, 0x9d,
    0x5d, 0xdd, 0x3d, 0xbd, 0x7d, 0xfd, 0x03, 0x83, 0x43, 0xc3, 0x23,
    0xa3, 0x63, 0xe3, 0x13, 0x93, 0x53, 0xd3, 0x33, 0xb3, 0x73, 0xf3,
    0x0b, 0x8b, 0x4b, 0xcb, 0x2b, 0xab, 0x6b, 0xeb, 0x1b, 0x9b, 0x5b,
    0xdb, 0x3b, 0xbb, 0x7b, 0xfb, 0x07, 0x87, 0x47, 0xc7, 0x27, 0xa7,
    0x67, 0xe7, 0x17, 0x97, 0x57, 0xd7, 0x37, 0xb7, 0x77, 0xf7, 0x0f,
    0x8f, 0x4f, 0xcf, 0x2f, 0xaf, 0x6f, 0xef, 0x1f, 0x9f, 0x5f, 0xdf,
    0x3f, 0xbf, 0x7f, 0xff
  ];

  var cplens = [
    3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43,
    51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0
  ];

  var cplext = [
    0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4,
    4, 4, 4, 5, 5, 5, 5, 0, 99, 99
  ]; /* 99==invalid */

  var  cpdist = [
    0x0001, 0x0002, 0x0003, 0x0004, 0x0005, 0x0007, 0x0009, 0x000d,
    0x0011, 0x0019, 0x0021, 0x0031, 0x0041, 0x0061, 0x0081, 0x00c1,
    0x0101, 0x0181, 0x0201, 0x0301, 0x0401, 0x0601, 0x0801, 0x0c01,
    0x1001, 0x1801, 0x2001, 0x3001, 0x4001, 0x6001
  ];

  var cpdext = [
    0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9,
    9, 10, 10, 11, 11, 12, 12, 13, 13
  ];

  var border = [ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ];

  var bA = barray;

  var bytepos = 0, bb = 1, bits = 0;

  var NAMEMAX = 256;

  var nameBuf = [];

  var fileout;

  function readByte() {
    bits += 8;
    if (bytepos < bA.length) {
      // if (debug)
      // document.write(bytepos+": "+bA[bytepos]+"<br>");
      return bA[bytepos++];
    } else
      return -1;
  }

  function byteAlign() {
    bb = 1;
  }

  function readBit() {
    var carry;
    bits++;
    carry = (bb & 1);
    bb >>= 1;
    if (bb == 0) {
      bb = readByte();
      carry = (bb & 1);
      bb = (bb >> 1) | 0x80;
    }
    return carry;
  }

  function readBits(a) {
    var res = 0, i = a;

    while (i--) {
      res = (res << 1) | readBit();
    }
    if (a) {
      res = bitReverse[res] >> (8 - a);
    }
    return res;
  }

  function flushBuffer() {
    // document.write("FLUSHBUFFER:"+buf32k);
    bIdx = 0;
  }
  function addBuffer(a) {
    // CRC=updcrc(a,crc);
    buf32k[bIdx++] = a;
    outputArr.push(String.fromCharCode(a));
    // output+=String.fromCharCode(a);
    if (bIdx == 0x8000) {
      // document.write("ADDBUFFER:"+buf32k);
      bIdx = 0;
    }
  }

  function HufNode() {
    this.b0 = 0;
    this.b1 = 0;
    this.jump = null;
    this.jumppos = -1;
  }

  var LITERALS = 288;

  var literalTree = new Array(LITERALS);
  var distanceTree = new Array(32);
  var treepos = 0;
  var Places = null;
  var len = 0;
  var fpos = new Array(17);
  fpos[0] = 0;
  var flens;
  var fmax;

  function IsPat() {
    for(;;) {
      if (fpos[len] >= fmax)
        return -1;
      if (flens[fpos[len]] == len)
        return fpos[len]++;
      fpos[len]++;
    }
  }

  function Rec() {
    var curplace = Places[treepos];
    var tmp;
    if (debug)
      document.write("<br>len:" + len + " treepos:" + treepos);
    if (len == 17) { // war 17
      return -1;
    }
    treepos++;
    len++;

    tmp = IsPat();
    if (debug)
      document.write("<br>IsPat " + tmp);
    if (tmp >= 0) {
      curplace.b0 = tmp; /* leaf cell for 0-bit */
      if (debug)
        document.write("<br>b0 " + curplace.b0);
    } else {
      /* Not a Leaf cell */
      curplace.b0 = 0x8000;
      if (debug)
        document.write("<br>b0 " + curplace.b0);
      if (Rec())
        return -1;
    }
    tmp = IsPat();
    if (tmp >= 0) {
      curplace.b1 = tmp; /* leaf cell for 1-bit */
      if (debug)
        document.write("<br>b1 " + curplace.b1);
      curplace.jump = null; /* Just for the display routine */
    } else {
      /* Not a Leaf cell */
      curplace.b1 = 0x8000;
      if (debug)
        document.write("<br>b1 " + curplace.b1);
      curplace.jump = Places[treepos];
      curplace.jumppos = treepos;
      if (Rec())
        return -1;
    }
    len--;
    return 0;
  }

  function CreateTree(currentTree, numval, lengths, show) {
    var i;
    /* Create the Huffman decode tree/table */
    // document.write("<br>createtree<br>");
    if (debug)
      document.write("currentTree " + currentTree + " numval " + numval
                     + " lengths " + lengths + " show " + show);
    Places = currentTree;
    treepos = 0;
    flens = lengths;
    fmax = numval;
    for (i = 0; i < 17; i++)
      fpos[i] = 0;
    len = 0;
    if (Rec()) {
      // fprintf(stderr, "invalid huffman tree\n");
      if (debug)
        alert("invalid huffman tree\n");
      return -1;
    }
    if (debug) {
      document.write("<br>Tree: " + Places.length);
      for ( var a = 0; a < 32; a++) {
        document.write("Places[" + a + "].b0=" + Places[a].b0 + "<br>");
        document.write("Places[" + a + "].b1=" + Places[a].b1 + "<br>");
      }
    }

    /*
     * if(show) { var tmp; for(tmp=currentTree;tmp<Places;tmp++) {
     * fprintf(stdout, "0x%03x 0x%03x (0x%04x)",tmp-currentTree,
     * tmp->jump?tmp->jump-currentTree:0,(tmp->jump?tmp->jump-currentTree:0)*6+0xcf0);
     * if(!(tmp.b0 & 0x8000)) { //fprintf(stdout, " 0x%03x (%c)",
     * tmp->b0,(tmp->b0<256 && isprint(tmp->b0))?tmp->b0:"?"); }
     * if(!(tmp.b1 & 0x8000)) { if((tmp.b0 & 0x8000)) fprintf(stdout, " ");
     * fprintf(stdout, " 0x%03x (%c)", tmp->b1,(tmp->b1<256 &&
     * isprint(tmp->b1))?tmp->b1:"?"); } fprintf(stdout, "\n"); } }
     */
    return 0;
  }

  function DecodeValue(currentTree) {
    var len, i, xtreepos = 0, X = currentTree[xtreepos], b;

    /* decode one symbol of the data */
    for(;;) {
      b = readBit();
      if (debug)
        document.write("b=" + b);
      if (b) {
        if (!(X.b1 & 0x8000)) {
          if (debug)
            document.write("ret1");
          return X.b1; /* If leaf node, return data */
        }
        X = X.jump;
        len = currentTree.length;
        for (i = 0; i < len; i++) {
          if (currentTree[i] === X) {
            xtreepos = i;
            break;
          }
        }
        // xtreepos++;
      } else {
        if (!(X.b0 & 0x8000)) {
          if (debug)
            document.write("ret2");
          return X.b0; /* If leaf node, return data */
        }
        // X++; //??????????????????
        xtreepos++;
        X = currentTree[xtreepos];
      }
    }
    if (debug)
      document.write("ret3");
    return -1;
  }

  function DeflateLoop() {
    var last, c, type, i, len;

    do {
      /*
       * if((last = readBit())){ fprintf(errfp, "Last Block: "); } else {
       * fprintf(errfp, "Not Last Block: "); }
       */
      last = readBit();
      type = readBits(2);
      switch (type) {
      case 0:
        if (debug)
          alert("Stored\n");
        break;
      case 1:
        if (debug)
          alert("Fixed Huffman codes\n");
        break;
      case 2:
        if (debug)
          alert("Dynamic Huffman codes\n");
        break;
      case 3:
        if (debug)
          alert("Reserved block type!!\n");
        break;
      default:
        if (debug)
          alert("Unexpected value %d!\n", type);
        break;
      }

      if (type == 0) {
        var blockLen, cSum;

        // Stored
        byteAlign();
        blockLen = readByte();
        blockLen |= (readByte() << 8);

        cSum = readByte();
        cSum |= (readByte() << 8);

        if (((blockLen ^ ~cSum) & 0xffff)) {
          document.write("BlockLen checksum mismatch\n");
        }
        while (blockLen--) {
          c = readByte();
          addBuffer(c);
        }
      } else if (type == 1) {
        var j;

        /* Fixed Huffman tables -- fixed decode routine */
        for(;;) {
          /*
           * 256 0000000 0 : : : 279 0010111 23 0 00110000 48 : : :
           * 143 10111111 191 280 11000000 192 : : : 287 11000111 199
           * 144 110010000 400 : : : 255 111111111 511
           *
           * Note the bit order!
           */

          j = (bitReverse[readBits(7)] >> 1);
          if (j > 23) {
            j = (j << 1) | readBit(); /* 48..255 */

            if (j > 199) { /* 200..255 */
              j -= 128; /* 72..127 */
              j = (j << 1) | readBit(); /* 144..255 << */
            } else { /* 48..199 */
              j -= 48; /* 0..151 */
              if (j > 143) {
                j = j + 136; /* 280..287 << */
                /* 0..143 << */
              }
            }
          } else { /* 0..23 */
            j += 256; /* 256..279 << */
          }
          if (j < 256) {
            addBuffer(j);
            // document.write("out:"+String.fromCharCode(j));
            /* fprintf(errfp, "@%d %02x\n", SIZE, j); */
          } else if (j == 256) {
            /* EOF */
            break;
          } else {
            var dist;

            j -= 256 + 1; /* bytes + EOF */
            len = readBits(cplext[j]) + cplens[j];

            j = bitReverse[readBits(5)] >> 3;
            if (cpdext[j] > 8) {
              dist = readBits(8);
              dist |= (readBits(cpdext[j] - 8) << 8);
            } else {
              dist = readBits(cpdext[j]);
            }
            dist += cpdist[j];

            /*
             * fprintf(errfp, "@%d (l%02x,d%04x)\n", SIZE, len,
             * dist);
             */
            for (j = 0; j < len; j++) {
              c = buf32k[(bIdx - dist) & 0x7fff];
              addBuffer(c);
            }
          }
        } // while
      } else if (type == 2) {
        var  n, literalCodes, distCodes, lenCodes;
        var ll = new Array(288 + 32); // "static" just to preserve
        // stack

        // Dynamic Huffman tables

        literalCodes = 257 + readBits(5);
        distCodes = 1 + readBits(5);
        lenCodes = 4 + readBits(4);
        // document.write("<br>param: "+literalCodes+" "+distCodes+"
        // "+lenCodes+"<br>");
        for (j = 0; j < 19; j++) {
          ll[j] = 0;
        }

        // Get the decode tree code lengths

        // document.write("<br>");
        for (j = 0; j < lenCodes; j++) {
          ll[border[j]] = readBits(3);
          // document.write(ll[border[j]]+" ");
        }
        // fprintf(errfp, "\n");
        // document.write("<br>ll:"+ll);
        len = distanceTree.length;
        for (i = 0; i < len; i++)
          distanceTree[i] = new HufNode();
        if (CreateTree(distanceTree, 19, ll, 0)) {
          flushBuffer();
          return 1;
        }
        if (debug) {
          document.write("<br>distanceTree");
          for ( var a = 0; a < distanceTree.length; a++) {
            document.write("<br>" + distanceTree[a].b0 + " "
                           + distanceTree[a].b1 + " "
                           + distanceTree[a].jump + " "
                           + distanceTree[a].jumppos);
            /*
             * if (distanceTree[a].jumppos!=-1) document.write("
             * "+distanceTree[a].jump.b0+"
             * "+distanceTree[a].jump.b1);
             */
          }
        }
        // document.write("<BR>tree created");

        // read in literal and distance code lengths
        n = literalCodes + distCodes;
        i = 0;
        var z = -1;
        if (debug)
          document.write("<br>n=" + n + " bits: " + bits + "<br>");
        while (i < n) {
          z++;
          j = DecodeValue(distanceTree);
          if (debug)
            document.write("<br>" + z + " i:" + i + " decode: " + j
                           + "    bits " + bits + "<br>");
          if (j < 16) { // length of code in bits (0..15)
            ll[i++] = j;
          } else if (j == 16) { // repeat last length 3 to 6 times
            var l;
            j = 3 + readBits(2);
            if (i + j > n) {
              flushBuffer();
              return 1;
            }
            l = i ? ll[i - 1] : 0;
            while (j--) {
              ll[i++] = l;
            }
          } else {
            if (j == 17) { // 3 to 10 zero length codes
              j = 3 + readBits(3);
            } else { // j == 18: 11 to 138 zero length codes
              j = 11 + readBits(7);
            }
            if (i + j > n) {
              flushBuffer();
              return 1;
            }
            while (j--) {
              ll[i++] = 0;
            }
          }
        }
        /*
         * for(j=0; j<literalCodes+distCodes; j++) { //fprintf(errfp,
         * "%d ", ll[j]); if ((j&7)==7) fprintf(errfp, "\n"); }
         * fprintf(errfp, "\n");
         */
        // Can overwrite tree decode tree as it is not used anymore
        len = literalTree.length;
        for (i = 0; i < len; i++)
          literalTree[i] = new HufNode();
        if (CreateTree(literalTree, literalCodes, ll, 0)) {
          flushBuffer();
          return 1;
        }
        len = literalTree.length;
        for (i = 0; i < len; i++)
          distanceTree[i] = new HufNode();
        var ll2 = new Array();
        for (i = literalCodes; i < ll.length; i++) {
          ll2[i - literalCodes] = ll[i];
        }
        if (CreateTree(distanceTree, distCodes, ll2, 0)) {
          flushBuffer();
          return 1;
        }
        if (debug)
          document.write("<br>literalTree");
        for(;;) {
          j = DecodeValue(literalTree);
          if (j >= 256) { // In C64: if carry set
            j -= 256;
            if (j == 0) {
              // EOF
              break;
            }
            j--;
            len = readBits(cplext[j]) + cplens[j];

            j = DecodeValue(distanceTree);
            if (cpdext[j] > 8) {
              dist = readBits(8);
              dist |= (readBits(cpdext[j] - 8) << 8);
            } else {
              dist = readBits(cpdext[j]);
            }
            dist += cpdist[j];
            while (len--) {
              c = buf32k[(bIdx - dist) & 0x7fff];
              addBuffer(c);
            }
          } else {
            addBuffer(j);
          }
        }
      }
    } while (!last);
    flushBuffer();

    byteAlign();
    return 0;
  }

  JXG.Util.Unzip.prototype.unzipFile = function(name) {
    var i;
    this.unzip();
    // alert(unzipped[0][1]);
    for (i = 0; i < unzipped.length; i++) {
      if (unzipped[i][1] == name) {
        return unzipped[i][0];
      }
    }
    return null;
  };

  JXG.Util.Unzip.prototype.unzip = function() {
    // convertToByteArray(input);
    if (debug)
      alert(bA);
    /*
     * for (i=0;i<bA.length*8;i++){ document.write(readBit()); if
     * ((i+1)%8==0) document.write(" "); }
     */
    /*
     * for (i=0;i<bA.length;i++){ document.write(readByte()+" "); if
     * ((i+1)%8==0) document.write(" "); } for (i=0;i<bA.length;i++){
     * document.write(bA[i]+" "); if ((i+1)%16==0) document.write("<br>"); }
     */
    // alert(bA);
    nextFile();
    return unzipped;
  };

  function nextFile() {
    if (debug)
      alert("NEXTFILE");
    outputArr = [];
    var tmp = [];
    modeZIP = false;
    tmp[0] = readByte();
    tmp[1] = readByte();
    if (debug)
      alert("type: " + tmp[0] + " " + tmp[1]);
    if (tmp[0] == parseInt("78", 16) && tmp[1] == parseInt("da", 16)) { // GZIP
      if (debug)
        alert("GEONExT-GZIP");
      DeflateLoop();
      if (debug)
        alert(outputArr.join(""));
      unzipped[files] = new Array(2);
      unzipped[files][0] = outputArr.join("");
      unzipped[files][1] = "geonext.gxt";
      files++;
    }
    if (tmp[0] == parseInt("1f", 16) && tmp[1] == parseInt("8b", 16)) { // GZIP
      if (debug)
        alert("GZIP");
      // DeflateLoop();
      skipdir();
      if (debug)
        alert(outputArr.join(""));
      unzipped[files] = new Array(2);
      unzipped[files][0] = outputArr.join("");
      unzipped[files][1] = "file";
      files++;
    }
    if (tmp[0] == parseInt("50", 16) && tmp[1] == parseInt("4b", 16)) { // ZIP
      modeZIP = true;
      tmp[2] = readByte();
      tmp[3] = readByte();
      if (tmp[2] == parseInt("3", 16) && tmp[3] == parseInt("4", 16)) {
        // MODE_ZIP
        tmp[0] = readByte();
        tmp[1] = readByte();
        if (debug)
          alert("ZIP-Version: " + tmp[1] + " " + tmp[0] / 10 + "."
                + tmp[0] % 10);

        gpflags = readByte();
        gpflags |= (readByte() << 8);
        if (debug)
          alert("gpflags: " + gpflags);

        var method = readByte();
        method |= (readByte() << 8);
        if (debug)
          alert("method: " + method);

        readByte();
        readByte();
        readByte();
        readByte();

        var crc = readByte();
        crc |= (readByte() << 8);
        crc |= (readByte() << 16);
        crc |= (readByte() << 24);

        var compSize = readByte();
        compSize |= (readByte() << 8);
        compSize |= (readByte() << 16);
        compSize |= (readByte() << 24);

        var size = readByte();
        size |= (readByte() << 8);
        size |= (readByte() << 16);
        size |= (readByte() << 24);

        if (debug)
          alert("local CRC: " + crc + "\nlocal Size: " + size
                + "\nlocal CompSize: " + compSize);

        var filelen = readByte();
        filelen |= (readByte() << 8);

        var extralen = readByte();
        extralen |= (readByte() << 8);

        if (debug)
          alert("filelen " + filelen);
        i = 0;
        nameBuf = [];
        while (filelen--) {
          var c = readByte();
          if (c == "/" | c == ":") {
            i = 0;
          } else if (i < NAMEMAX - 1)
            nameBuf[i++] = String.fromCharCode(c);
        }
        if (debug)
          alert("nameBuf: " + nameBuf);

        // nameBuf[i] = "\0";
        if (!fileout)
          fileout = nameBuf;

        var i = 0;
        while (i < extralen) {
          c = readByte();
          i++;
        }

        /*MU: it was size = 0, this looked wrong, i changed it to size == 0*/
        if (size == 0 && fileout.charAt(fileout.length - 1) == "/") {
          // skipdir
          if (debug)
            alert("skipdir");
        }
        if (method == 8) {
          DeflateLoop();
          if (debug)
            alert(outputArr.join(""));
          unzipped[files] = new Array(2);
          unzipped[files][0] = outputArr.join("");
          unzipped[files][1] = nameBuf.join("");
          files++;
          // return outputArr.join("");
        }
        skipdir();
      }
    }
  }

  function skipdir() {
    var tmp = [],  i, c;

    if ((gpflags & 8)) {
      tmp[0] = readByte();
      tmp[1] = readByte();
      tmp[2] = readByte();
      tmp[3] = readByte();

      if (tmp[0] == parseInt("50", 16) && tmp[1] == parseInt("4b", 16)
          && tmp[2] == parseInt("07", 16)
          && tmp[3] == parseInt("08", 16)) {
        readByte();
        readByte();
        readByte();
        readByte();
      }

      readByte();
      readByte();
      readByte();
      readByte();

      readByte();
      readByte();
      readByte();
      readByte();

      if (debug)
        alert("CRC:");
    }

    if (modeZIP)
      nextFile();

    tmp[0] = readByte();
    if (tmp[0] != 8) {
      if (debug)
        alert("Unknown compression method!");
      return 0;
    }

    gpflags = readByte();
    if (debug) {
      if ((gpflags & ~(parseInt("1f", 16))))
        alert("Unknown flags set!");
    }

    readByte();
    readByte();
    readByte();
    readByte();

    readByte();
    readByte();

    if ((gpflags & 4)) {
      tmp[0] = readByte();
      tmp[2] = readByte();
      len = tmp[0] + 256 * tmp[1];
      if (debug)
        alert("Extra field size: " + len);
      for (i = 0; i < len; i++)
        readByte();
    }

    if ((gpflags & 8)) {
      i = 0;
      nameBuf = [];
      while (c = readByte()) {
        if (c == "7" || c == ":")
          i = 0;
        if (i < NAMEMAX - 1)
          nameBuf[i++] = c;
      }
      // nameBuf[i] = "\0";
      if (debug)
        alert("original file name: " + nameBuf);
    }

    if ((gpflags & 16)) {
      while (c = readByte()) {
        // FILE COMMENT
      }
    }

    if ((gpflags & 2)) {
      readByte();
      readByte();
    }

    DeflateLoop();

    readByte();
    readByte();
    readByte();
    readByte();

    readByte();
    readByte();
    readByte();
    readByte();

    if (modeZIP)
      nextFile();
    return null;
  }

};

/**
 * Base64 encoding / decoding
 *
 * @see <a href="http://www.webtoolkit.info/">http://www.webtoolkit.info/</A>
 */
JXG.Util.Base64 = {

  // private property
  _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

  // public method for encoding
  encode : function(input) {
    var output = [], chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;

    input = JXG.Util.Base64._utf8_encode(input);

    while (i < input.length) {

      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output.push(
        [
          this._keyStr.charAt(enc1), this._keyStr.charAt(enc2),
          this._keyStr.charAt(enc3), this._keyStr.charAt(enc4)
        ].join("")
      );
    }

    return output.join("");
  },

  // public method for decoding
  decode : function(input, utf8) {
    var output = [], chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;

    input = input.replace(new RegExp("[^A-Za-z0-9+/=]", "g"), "");

    while (i < input.length) {

      enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output.push(String.fromCharCode(chr1));

      if (enc3 != 64) {
        output.push(String.fromCharCode(chr2));
      }
      if (enc4 != 64) {
        output.push(String.fromCharCode(chr3));
      }
    }

    output = output.join("");

    if (utf8) {
      output = JXG.Util.Base64._utf8_decode(output);
    }
    return output;

  },

  // private method for UTF-8 encoding
  _utf8_encode : function(string) {
    string = string.replace(new RegExp("\r\n", "g"), "\n");
    var utftext = "";

    for ( var n = 0; n < string.length; n++) {

      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }

    }

    return utftext;
  },

  // private method for UTF-8 decoding
  _utf8_decode : function(utftext) {
    var string = [], i = 0, c = 0, c2 = 0, c3 = 0;

    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string.push(String.fromCharCode(c));
        i++;
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string.push(String.fromCharCode(((c & 31) << 6) | (c2 & 63)));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string.push(String.fromCharCode(((c & 15) << 12)
                                        | ((c2 & 63) << 6) | (c3 & 63)));
        i += 3;
      }
    }
    return string.join("");
  },

  _destrip : function(stripped, wrap) {
    var lines = [], lineno, i;

    if (wrap == null)
      wrap = 76;

    stripped.replace(new RegExp(" ", "g"), "");
    lineno = stripped.length / wrap;
    for (i = 0; i < lineno; i++)
      lines[i] = stripped.substr(i * wrap, wrap);
    if (lineno != stripped.length / wrap)
      lines[lines.length] = stripped.substr(
        lineno * wrap,
        stripped.length - (lineno * wrap)
      );
    var destripped = [];
    for (i = 0; i < lines.length; i++)
      destripped.push(lines[i]);
    return destripped.join("\n");
  },

  decodeAsArray : function(input) {
    var dec = this.decode(input), ar = [], i;
    for (i = 0; i < dec.length; i++) {
      ar[i] = dec.charCodeAt(i);
    }
    return ar;
  },

  decodeGEONExT : function(input) {
    return JXG.Util.Base64.decodeAsArray(JXG.Util.Base64._destrip(input), false);
  }
};

/**
 * @private
 */
JXG.Util.asciiCharCodeAt = function(str, i) {
  var c = str.charCodeAt(i);
  if (c > 255) {
    switch (c) {
    case 8364:
      c = 128;
      break;
    case 8218:
      c = 130;
      break;
    case 402:
      c = 131;
      break;
    case 8222:
      c = 132;
      break;
    case 8230:
      c = 133;
      break;
    case 8224:
      c = 134;
      break;
    case 8225:
      c = 135;
      break;
    case 710:
      c = 136;
      break;
    case 8240:
      c = 137;
      break;
    case 352:
      c = 138;
      break;
    case 8249:
      c = 139;
      break;
    case 338:
      c = 140;
      break;
    case 381:
      c = 142;
      break;
    case 8216:
      c = 145;
      break;
    case 8217:
      c = 146;
      break;
    case 8220:
      c = 147;
      break;
    case 8221:
      c = 148;
      break;
    case 8226:
      c = 149;
      break;
    case 8211:
      c = 150;
      break;
    case 8212:
      c = 151;
      break;
    case 732:
      c = 152;
      break;
    case 8482:
      c = 153;
      break;
    case 353:
      c = 154;
      break;
    case 8250:
      c = 155;
      break;
    case 339:
      c = 156;
      break;
    case 382:
      c = 158;
      break;
    case 376:
      c = 159;
      break;
    default:
      break;
    }
  }
  return c;
};

/**
 * Decoding string into utf-8
 *
 * @param {String}
 *            string to decode
 * @return {String} utf8 decoded string
 */
JXG.Util.utf8Decode = function(utftext) {
  var string = [];
  var i = 0;
  var c = 0,  c2 = 0, c3;
  if (!JXG.exists(utftext))
    return "";

  while (i < utftext.length) {
    c = utftext.charCodeAt(i);

    if (c < 128) {
      string.push(String.fromCharCode(c));
      i++;
    } else if ((c > 191) && (c < 224)) {
      c2 = utftext.charCodeAt(i + 1);
      string.push(String.fromCharCode(((c & 31) << 6) | (c2 & 63)));
      i += 2;
    } else {
      c2 = utftext.charCodeAt(i + 1);
      c3 = utftext.charCodeAt(i + 2);
      string.push(String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6)
                                      | (c3 & 63)));
      i += 3;
    }
  }
  return string.join("");
};

/**
 * Generate a random uuid. http://www.broofa.com mailto:robert@broofa.com
 *
 * Copyright (c) 2010 Robert Kieffer Dual licensed under the MIT and GPL
 * licenses.
 *
 * EXAMPLES: >>> Math.uuid() "92329D39-6F5C-4520-ABFC-AAB64544E172"
 */
JXG.Util.genUUID = function() {
  // Private array of chars to use
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
      .split(""), uuid = new Array(36), rnd = 0, r;

  for ( var i = 0; i < 36; i++) {
    if (i == 8 || i == 13 || i == 18 || i == 23) {
      uuid[i] = "-";
    } else if (i == 14) {
      uuid[i] = "4";
    } else {
      if (rnd <= 0x02)
        rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
      r = rnd & 0xf;
      rnd = rnd >> 4;
      uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
    }
  }
  return uuid.join("");
};
$Firefly.createClass(
	"sap.buddha.XJsonObject", 
	sap.firefly.XObject, 
	{
		$statics:
		{
			xWindow : null,
			
			create : function(obj) {
				var jsonObj= new sap.buddha.XJsonObject();
				jsonObj.setObject(obj);
				return jsonObj;
			},
			createFromString : function(obj) {
				var jsonObj= new sap.buddha.XJsonObject();
				jsonObj.setObject(obj);
				return jsonObj;
			},
			createFromJSonString : function(obj) {
				var jsonObj= new sap.buddha.XJsonObject();
				jsonObj.setObject(JSON.parse(obj));
				return jsonObj;
			},
			
			setXWindow : function(xWindow) {
				sap.buddha.XJsonObject.xWindow = xWindow;
			}
			
		},
		// *** statics end ***
		
		toString : function() {
			return "[???]";
		},
		
		obj : null,
		
		setObject : function(obj) {
			this.obj = obj;
		},
		
		isString : function(){
			return (typeof this.obj === "string");
		},
		
		getString : function(){
			if(this.isString()){
				return this.obj;
			} else if(this.isScriptableMember()){
				return this.obj.getKey();
			}
			return this.getAsJsonString();
		},
		
		getAsJsonString : function() {
			return JSON.stringify(this.obj);
		},			
		
		isArray : function(){
			return ((typeof(this.obj) === "object")&&(this.obj instanceof Array));
		},
		
		isDefined : function(){
			if(typeof(this.obj) === "undefined"){
				return false;
			}
			return true;
		},
		
		getArray : function(){
			return sap.buddha.XJsonArray.create(this.obj); 
		},
		
		isJSON : function(){
			return ((typeof(this.obj) === "object") && !this.isArray() && !this.isPageObject() && !this.isScriptableMember());
		},
		
		getJSON : function(){
			var  createMapByString = sap.firefly.XHashMapByString.create();
			if (!this.isJSON()) {
				return createMapByString;
			}
			
			for (var key in this.obj) {
				if (this.obj.hasOwnProperty(key)) {
					var value = this.obj[key];
					if (typeof(value) === "object") {
						value = JSON.stringify(value);
					}
					createMapByString.put(key, value);
				}
			}
		
			return createMapByString;
		},
		replace: function(sear,repl){
			return this.getString().replace(new RegExp(sear,"g"), repl);
		},
		
		isScriptableMember : function() {
			return (typeof(this.obj.clazzName) !== "undefined") && (this.obj.clazzName === "ScriptableMember");
		},
		
		isPageObject : function() {
			var t = this.obj.getPageObject;
			return (t != null);
		},
		
		getPageObject : function() {
			if(!this.isPageObject()){
				return null;
			}
			var t = this.obj.getPageObject();
			return t;
		}			
	}
);
$Firefly.createClass(
	"sap.buddha.XJsonArray", 
	sap.firefly.XObject, 
	{
		$statics:
		{
			create : function(obj) {
				var jsonArray= new sap.buddha.XJsonArray();
				jsonArray.setObject(obj);
				return jsonArray;
			}
		},
		// *** statics end ***
		
		toString : function() {
			return "[???]";
		},
	
		obj : null,
	
		setObject : function(obj) {
			this.obj = obj;
		},
		
		size : function(){
			return this.obj.length;
		},
		
		get : function(i){
			return sap.buddha.XJsonObject.create(this.obj[i]);
		}
	}
);
$Firefly.createClass(
	"sap.buddha.XJSonRenderSerializer",
	sap.firefly.XObject, 
	{
		$statics:
		{
			create : function() {
				var jsonSerializer= new sap.buddha.XJSonRenderSerializer();
				jsonSerializer.level = 0;
				jsonSerializer.obj = {};
				
				jsonSerializer.currentObjStack = [];
				jsonSerializer.currentObjStack.push(jsonSerializer.obj);
				
				jsonSerializer.inArrayStack = [];
				jsonSerializer.inArrayStack.push(false);
				
				return jsonSerializer;
			}
		},
		// *** statics end ***
		
		writeOpenObject : function() {
			var obj= {};
			this.currentObjStack.push(obj);
			this.inArrayStack.push(false);
			this.level++;
		},
	
		setWriter : function(writer) {
			this.writer = writer;
		},
	
		openTag : function(tagName){
			var obj= {};
			if(this.inArrayStack[this.inArrayStack.length-1] === true){
				var obj2= {};
				this.currentObjStack[this.currentObjStack.length-1].push(obj2);
				obj2[tagName]= obj;
			} else {
				this.currentObjStack[this.currentObjStack.length-1][tagName] = obj;
			}
			
			this.currentObjStack.push(obj);
			this.inArrayStack.push(false);
			this.level++;
		},
	
		addText : function(text){
			this.addAttribute("_v", text);
		},
	
		closeTag : function(){
			this.currentObjStack.pop();
			this.inArrayStack.pop();
			this.level--;
			this.checkAndWrite();
		},
		
		addNullAttribute : function(name){
			this.currentObjStack[this.currentObjStack.length-1][name] = null; 
		},
	
		addAttribute : function(name, value){
			if(value === null){
				value = "";
			}
			this.currentObjStack[this.currentObjStack.length-1][name] = value; 
		},
	
		addAttributeAsNotString : function(name, value){
			if(value === null){
				value = "";
			}
			
			Object.defineProperty(this.currentObjStack[this.currentObjStack.length-1], name, {
			    get: function() { return eval( value); }
			});				
		},
		
		addAttribute2 : function(name, value){
			if(value === null){
				value = "";
			}
			this.currentObjStack[this.currentObjStack.length-1][name] = value; 				
		},
	
		addIntegerAttribute : function(name, value){
			this.currentObjStack[this.currentObjStack.length-1][name] = value; 				
		},
	
		addDoubleAttribute : function(name, value){
			this.currentObjStack[this.currentObjStack.length-1][name] = value; 				
		},
	
		addBooleanAttribute : function(name, value){
			this.currentObjStack[this.currentObjStack.length-1][name] = value; 				
		},
	
		openArray : function(arrayName){
			var obj= [];
			if(this.inArrayStack[this.inArrayStack.length-1] === true){
				var obj2= {};
				this.currentObjStack[this.currentObjStack.length-1].push(obj2);
				obj2[arrayName]= obj;
			} else {
				this.currentObjStack[this.currentObjStack.length-1][arrayName] = obj;
			}
			this.currentObjStack.push(obj);
			this.inArrayStack.push(true);
			this.level++;
		},
	
		closeArray : function(){
			this.currentObjStack.pop();
			this.inArrayStack.pop();
			this.level--;
			this.checkAndWrite();
		},
	
		isCurrentWriter : function(writer){
			return true;
		},
	
		openJsonArray : function(){
			var obj= [];
			if(this.inArrayStack[this.inArrayStack.length-1] === true){
				this.currentObjStack[this.currentObjStack.length-1].push(obj);
			} else {
				throw "invalid state";
			}
			this.currentObjStack.push(obj);
			this.inArrayStack.push(true);
			this.level++;
		},
	
		closeJsonArray : function(){
			this.currentObjStack.pop();
			this.inArrayStack.pop();
			this.level--;
			this.checkAndWrite();
		},
	
		openJsonTag : function(){
			var obj= {};
			if(this.inArrayStack[this.inArrayStack.length-1] === true){
				this.currentObjStack[this.currentObjStack.length-1].push(obj);
			} else {
				throw "invalid state";
			}
			this.currentObjStack.push(obj);
			this.inArrayStack.push(false);
			this.level++;
		},
	
		closeJsonTag : function(){
			this.currentObjStack.pop();
			this.inArrayStack.pop();
			this.level--;
			this.checkAndWrite();
		},
	
		addDoubleToArray : function(value){
			this.currentObjStack[this.currentObjStack.length-1].push(value.getDouble());
		},
	
		addIntegerToArray : function(value){
			this.currentObjStack[this.currentObjStack.length-1].push(value.getInteger());
		},
		
		addSimpleValueToArray: function(value) {
			this.currentObjStack[this.currentObjStack.length-1].push(value);
		},
		
		addNullToArray : function(){
			this.currentObjStack[this.currentObjStack.length-1].push(null);
		},
		
		checkAndWrite : function(){
			if(this.writer!=null){
				if(this.level === 0){
					var s= JSON.stringify(this.obj);
					this.writer.append(s);
				}
			}
		},
		
		getRenderedObject : function(){
			return this.obj;
		}
	}
);
$Firefly.createClass(
	"sap.buddha.XObjectConverter", 
	sap.firefly.XObject, 
	{
		$statics:
		{
			getStringArrayFromIXListForSelection : function (listGiven) {
				var result = [];
				var allSelectedItemsAsIterator = listGiven.getIterator();
				while (allSelectedItemsAsIterator.hasNext()) {
					var oneItemOfAllSelectedItems = allSelectedItemsAsIterator.next();
					result.push(oneItemOfAllSelectedItems);
				}
	
				return result;
			}, 
			
			getIXListOfStringForSelectionFromStringArray : function (aStrings) {
				var result = sap.firefly.XList.create();
				
				for (var j = 0; j < aStrings.length; j++) {
					result.add(aStrings[j]);
				}
				
				return result;
			},
			
			isString : function (sString) {
				if(sString == null){
					return true;
				}
				return typeof sString === "string";
			},
			
			isObjectString : function(oObject){
				return sap.buddha.XObjectConverter.isString(oObject);
			},
			
			convertObjectToString : function(oObject){
				return oObject;
			},
			
			convertObjectToInt : function(oObject){
				return oObject;
			},
			
			isBoolean : function (bBoolean) {
				if(bBoolean == null){
					return true;
				}
				return typeof bBoolean === "boolean";
			},
			
			isInteger : function (iInteger) {
				if(iInteger == null){
					return true;
				}
				return typeof iInteger === "number";
			},
			
			isDouble : function (dDouble) {
				if(dDouble == null){
					return true;
				}
				return typeof dDouble === "number";
			}
		}
		// *** statics end ***
	}
);
$Firefly.createClass(
	"sap.buddha.XSSEncoder",
	sap.firefly.XObject, 
	{
		$statics:
		{
			encodeJavaScript : function(s) {
				var regEx= new RegExp("'", "g");
				s= s.replace(regEx, "\\x27");
				return s;
			},
			
			encodeHtml : function(s){
				return s;
			},
			
			encodeXml : function(s){
				var regEx= new RegExp("[<>&'\"]", "g");
				return s.replace(regEx, function (c) {
			        if(c == "<") {
			        	return "&lt;";
			        } else if(c == ">"){
			        	return "&gt;";
			        } else if(c == "&"){
			        	return "&amp;";
			        } else if(c == "'"){
			        	return "&apos;";
			        } else if(c == "\""){
			        	return "&quot;";
			        };
			    });
			}
	
		}
		// *** statics end ***
	}
);
$Firefly.createClass(
	"sap.buddha.XMathZen",
	sap.firefly.XObject, 
	{
		$statics:
		{
			create : function(obj) {
				var jsonArray= new sap.buddha.XMathZen();
				jsonArray.setObject(obj);
				return jsonArray;
			},
			
			roundDouble : function(dValueGiven) {
				return dValueGiven.toLocaleString(undefined,{"maximumFractionDigits":2,"minimumFractionDigits":2});
			},
			
			getDigitsOfNumber : function(number) {
				return Math.max(Math.floor(Math.log10(Math.abs(number))), 0) + 1;
			},
			
			getDigitsOfNumberAsString : function(numberAsString) {
				return sap.buddha.XMathZen.getDigitsOfNumber(parseFloat(numberAsString));
			}
		},
		// *** statics end ***
		
		obj : null,
		
		toString : function() {
			return "[???]";
		},
	
		setObject : function(obj) {
			this.obj = obj;
		},
		
		size : function(){
			return this.obj.length;
		},
		
		get : function(i){
			return sap.buddha.XJsonObject.create(this.obj[i]);
		}
	}
);
$Firefly.createClass(
	"sap.buddha.XJsonMap",
	sap.firefly.XObject, 
	{
		getJsonFromMapObject : function(object) {
			return JSON.stringify(object);
		}
	}
);
$Firefly.createClass(
	"sap.buddha.XJsUI5Utils", 
	null, 
	{	
		$statics:
		{		
			/**
			 * Get DateTime-Value based on current locale settings
			 */
			formatDateTimeValue : function(value, dataType, isUTC, formatStyle){
				var lFormattedValue = value;
				
				// retrieve the DataType Object
				var loDataType = sap.buddha.XJsUI5Utils.getDateTimeValueObject(value, dataType, isUTC);
							
				// create DataType Formatter
				var loFormatOptions = {
						style: formatStyle
						//UTC: oControlProperties.text.UTC // will translate local DateTime to UTC (example: -2 hours for GMT+2)
					};
				
				dataType = sap.buddha.XJsUI5Utils.translateDataType(dataType);
				var loDateTypeFormatter = null;
				if (dataType === "DATE") {
					loDataTypeFormatter = sap.ui.core.format.DateFormat.getDateInstance(loFormatOptions, sap.ui.getCore().getConfiguration().getLocale());
				} else if (dataType === "TIME") {
					loDataTypeFormatter = sap.ui.core.format.DateFormat.getTimeInstance(loFormatOptions, sap.ui.getCore().getConfiguration().getLocale());
				} else if (dataType === "DATETIME") {
					loDataTypeFormatter = sap.ui.core.format.DateFormat.getDateTimeInstance(loFormatOptions, sap.ui.getCore().getConfiguration().getLocale());
				}
				
				// format the DataType Object
				if (loDataType && loDataTypeFormatter) {
					lFormattedValue = loDataTypeFormatter.format(loDataType);
				}
				
				return lFormattedValue;
			},
			
			/**
			 * Get DateTime-Value based on current locale settings
			 */
			getDateTimeValue : function(value, dataType, isUTC) {
				var lValue = value;
				
				var loDataType = sap.buddha.XJsUI5Utils.getDateTimeValueObject(value, dataType, isUTC);
				var loDataTypeFormatter = sap.buddha.XJsUI5Utils.getDateTimeValueFormatter(value, dataType);
				if (loDataType && loDataTypeFormatter) {
					lValue = loDataTypeFormatter.format(loDataType);
				}
				
				return lValue;
			},
			
			/**
			 * Get DateTime-Value Object
			 */
			getDateTimeValueObject : function(value, dataType, isUTC) {
				var loDataType = null;
				
				var loDataTypeFormatter = sap.buddha.XJsUI5Utils.getDateTimeValueFormatter(value, dataType);
				if (loDataTypeFormatter) {
					loDataType = loDataTypeFormatter.parse(value);
				}
				
				// value is UTC
				if (isUTC && loDataType) {
					loDataType.setUTCDate(loDataType.getDate());
					loDataType.setUTCFullYear(loDataType.getFullYear());
					loDataType.setUTCMonth(loDataType.getMonth());
					loDataType.setUTCHours(loDataType.getHours());
					loDataType.setUTCMinutes(loDataType.getMinutes());
					loDataType.setUTCSeconds(loDataType.getSeconds());
					loDataType.setUTCMilliseconds(loDataType.getMilliseconds());
				}
				
				return loDataType;
			},
			
			/**
			 * Get DateTime-Value Formatter based on value provided
			 */
			getDateTimeValueFormatter : function(value, dataType) {
				var loDataTypeFormatter = null;
				
				dataType = sap.buddha.XJsUI5Utils.translateDataType(dataType);
				if (dataType === "DATE") {
					loDataTypeFormatter = sap.buddha.XJsUI5Utils.getDateFormatter(value);
				} else if (dataType === "TIME") {
					loDataTypeFormatter = sap.buddha.XJsUI5Utils.getTimeFormatter(value);
				} else if (dataType === "DATETIME") {
					loDataTypeFormatter = sap.buddha.XJsUI5Utils.getDateTimeFormatter(value);
				}
				
				return loDataTypeFormatter;
			},
			
			/**
			 * Get Date Formatter based on value provided
			 */
			getDateFormatter : function(date) {			
				var loFormatter = null;
				
				var lPattern;			
				var lOffset = -1;
				lOffset = date.search("([0-9]{8})"); // SAP-Format
				if (lOffset === 0) {
					lPattern = "yyyyMMdd";
				}
				if (!lPattern) {
					lOffset = date.search("([0-9]{4}-[0-9]{2}-[0-9]{2})"); // ISO Format
					if (lOffset === 0) {
						lPattern = "yyyy-MM-dd";
					}
				}
				
				var loDate;
				if (lPattern) { // correct format
					// retrieve the DataType Object
					loFormatter = sap.ui.core.format.DateFormat.getInstance({pattern: lPattern});
				}
				
				return loFormatter;
			},
			
			/**
			 * Get Time Formatter based on value provided
			 */
			getTimeFormatter : function(time) {
				var loFormatter = null;
				
				var lPattern;			
				var lOffset = -1;
				lOffset = time.search("([0-9]{6})");
				if (lOffset === 0) {
					lPattern = "HHmmss";
				}
				if (!lPattern) {
					lOffset = time.search("([0-9]{2}:[0-9]{2}:[0-9]{2})");
					if (lOffset === 0) {
						lPattern = "HH:mm:ss";
					}
				}
				
				var loTime;
				if (lPattern) { // correct format
					// retrieve the DataType Object
					loFormatter = sap.ui.core.format.DateFormat.getInstance({pattern: lPattern});
				}
				
				return loFormatter;
			},
			
			/**
			 * Get DateTime Formatter based on value provided
			 */
			getDateTimeFormatter : function(dateTime) {
				var loFormatter = null;
				
				var lPattern;			
				var lOffset = -1;
				lOffset = dateTime.search("^([0-9]{8})"); // SAP-Format Date
				if (lOffset === 0) {
					lPattern = "yyyyMMdd";
					lOffset = dateTime.substr(8).search("^([0-9]{6})"); // SAP-Format Time
					if (lOffset === 0) {
						lPattern = "yyyyMMddHHmmss";
					}
				}
				if (!lPattern) {
					lOffset = dateTime.search("^([0-9]{4}-[0-9]{2}-[0-9]{2})"); // ISO Format Date
					if (lOffset === 0) {
						lPattern = "yyyy-MM-dd";
						lOffset = dateTime.substr(10).search("^T([0-9]{2}:[0-9]{2}:[0-9]{2})");
						if (lOffset === 0) {
							lPattern = "yyyy-MM-ddTHH:mm:ss";
						}
					}
				}
				
				if (lPattern) { // correct format
					// retrieve the DataType Object
					loFormatter = sap.ui.core.format.DateFormat.getInstance({pattern: lPattern});
				}
				
				return loFormatter;
			},
			
			/**
			 * Translate DataType
			 */
			translateDataType : function(dataType) {
				var lDataType = dataType.toUpperCase();
				
				if (lDataType === "DATE") {
					lDataType = "DATE";
				} else if (lDataType === "TIME") {
					lDataType = "TIME";
				} else if (lDataType === "DATETIME" || lDataType === "DATE_TIME") {
					lDataType = "DATETIME";
				}
				
				return lDataType;
			}
		},
		// *** statics end ***
		
		toString : function() {
			return "[???]";
		}
	}
);
$Firefly.createClass(
	"sap.buddha.XJsUtils", 
	null, 
	{
		$statics:
		{
			createProperty : function(instance, name, createGetter, createSetter){
				var funcName = name.substring(0, 1).toUpperCase()+name.substring(1);
				
				if(createGetter === true){
					Object.defineProperty(instance, name, {
						    get: function() { return eval( "instance.get"+funcName+"()"); }
						});				
				}
				if(createSetter === true){
					Object.defineProperty(
						instance, 
						name, 
						{
							set: function(value) { return eval( "instance.set"+funcName+"("+value+")"); }
						}
					);				
				}
			},
	
			createJsIdentifier : function(id){
				return id.replace(/\W/g, "_").replace(/^(\d)/g, "_$1");
			}
		},
		// *** statics end ***
		
		toString : function() {
			return "[???]";
		}
	}
);
$Firefly.createClass(
  "sap.buddha.XlsWorkbook",
  sap.firefly.XObject,
  {
    $statics : {
      create : function(openOfficeType, allowStyles) {
        /*
         * load modules required
         *      - load jszip synchron
         *      - load xlsx synchron
         */
        function Workbook() {
          if (!(this instanceof Workbook)) {
            return new Workbook();
          }
          this.SheetNames = [];
          this.Sheets = {};
          return this;
        }
        var loInstance = new sap.buddha.XlsWorkbook();
        loInstance.allowStyles = allowStyles;
        loInstance.wb = new Workbook();
        return loInstance;
      }
    },
    // *** statics end ***

    allowStyles : true,
    formatIndexMap : {},
    formatIndex : 164,

    /**
     * Add WorkSheet
     */
    addWorksheet : function(sheetName) {
      var loWorkSheet = {};
      this.wb.SheetNames.push(sheetName);
      this.wb.Sheets[sheetName] = loWorkSheet;

      loWorkSheet.curRow = -1;
      loWorkSheet.maxRow = -1;
      loWorkSheet.maxCol = -1;
      loWorkSheet["!merges"] = [];

      return loWorkSheet;
    },

    /**
     * Close WorkSheet
     */
    closeWorkSheet : function(oXlsWorksheet) {
      var loRange = this.getRange(0, 0, oXlsWorksheet.maxRow + 1, oXlsWorksheet.maxCol + 1);

      oXlsWorksheet["!ref"] = XLSX.utils.encode_range(loRange);
    },

    /**
     * Get WorkSheet Row
     */
    getRow : function(oXlsWorksheet, rowIndex) {
      var loRow = {};

      loRow.ws = oXlsWorksheet;
      loRow.row = rowIndex;
      loRow.curCol = -1;

      return loRow;
    },

    /**
     * Create WorkSheet Row
     */
    createRow : function(oXlsWorksheet) {
      oXlsWorksheet.curRow++;
      var loRow = this.getRow(oXlsWorksheet, oXlsWorksheet.curRow);

      if (oXlsWorksheet.curRow > oXlsWorksheet.maxRow) {
        oXlsWorksheet.maxRow = oXlsWorksheet.curRow;
      }

      return loRow;
    },

    /**
     * Get WorkSheet Row Cell
     */
    getCell : function(oXlsWorksheetRow, columnIndex) {
      var loCell = {};
      loCell.ws = oXlsWorksheetRow.ws;
      loCell.row = oXlsWorksheetRow.row;
      loCell.column = columnIndex;

      var lCellRef = this.getCellRef(loCell.row, loCell.column);
      oXlsWorksheetRow.ws[lCellRef] = loCell;

      return loCell;
    },

    /**
     * Get Cell Reference
     */
    getCellRef : function(rowIndex, columnIndex) {
      var loCellRef = XLSX.utils.encode_cell({
        r : rowIndex,
        c : columnIndex
      });

      return loCellRef.toString();
    },

    /**
     * Add WorkSheet Row Cell
     */
    addCell : function(oXlsWorksheetRow) {
      oXlsWorksheetRow.curCol++;
      var loCell = this.getCell(oXlsWorksheetRow, oXlsWorksheetRow.curCol);

      if (oXlsWorksheetRow.curCol > oXlsWorksheetRow.ws.maxCol) {
        oXlsWorksheetRow.ws.maxCol = oXlsWorksheetRow.curCol;
      }

      return loCell;
    },

    /**
     * Copy WorkSheet Cell
     */
    copyCell : function(oXlsWorkSheetCellSource, oXlsWorkSheetCellTarget) {
      if (oXlsWorkSheetCellSource.s) {
        oXlsWorkSheetCellTarget.s = oXlsWorkSheetCellSource.s;
      }
      if (oXlsWorkSheetCellSource.v) {
        oXlsWorkSheetCellTarget.v = oXlsWorkSheetCellSource.v;
      }
      if (oXlsWorkSheetCellSource.t) {
        oXlsWorkSheetCellTarget.t = oXlsWorkSheetCellSource.t;
      }
      if (oXlsWorkSheetCellSource.f) {
        oXlsWorkSheetCellTarget.f = oXlsWorkSheetCellSource.f;
      }
      if (oXlsWorkSheetCellSource.z) {
        oXlsWorkSheetCellTarget.z = oXlsWorkSheetCellSource.z;
      }
      if (oXlsWorkSheetCellSource.w) {
        oXlsWorkSheetCellTarget.w = oXlsWorkSheetCellSource.w;
      }
    },

    /**
     * Merge WorkSheet Cell
     */
    mergeCell : function(oXlsWorksheetCell, rowspan, colspan) {
      var lRowspan = rowspan, lColspan = colspan;
      if (lRowspan < 1) {
        lRowspan = 1;
      }
      if (lColspan < 1) {
        lColspan = 1;
      }

      // get the Range
      var loRange = this.getRange(oXlsWorksheetCell.row, oXlsWorksheetCell.column, oXlsWorksheetCell.row + lRowspan - 1, oXlsWorksheetCell.column + lColspan -1)

      // set the Cell merge information (Cell Content Range)
      if (lRowspan > 1 || lColspan > 1) {
        oXlsWorksheetCell.ws["!merges"].push(loRange);
      }

      // handle content to be merged
      var loRow = null, loCell = null, i = 0;
      for (i = 1; i < lRowspan; i++) {
        loRow = this.getRow(oXlsWorksheetCell.ws, oXlsWorksheetCell.row + i);
        loCell = this.getCell(loRow, oXlsWorksheetCell.column);
        this.copyCell(oXlsWorksheetCell, loCell);
      }
      for (i = 1; i < lColspan; i++) {
        loRow = this.getRow(oXlsWorksheetCell.ws, oXlsWorksheetCell.row);
        loCell = this.getCell(loRow, oXlsWorksheetCell.column + i);
        this.copyCell(oXlsWorksheetCell, loCell);
      }
    },

    /**
     * Get Range Object
     */
    getRange : function(fromRowIndex, fromColumnIndex, toRowIndex, toColumnIndex) {
      var loRange = {
        s : {
          r : fromRowIndex,
          c : fromColumnIndex
        },
        e : {
          r : toRowIndex,
          c : toColumnIndex
        }
      };

      return loRange;
    },

    /**
     * Set WorkSheet Cell Content
     */
    setCell : function(
      oXlsWorksheetCell,
      oCellInfo) {
      /* https://github.com/protobi/js-xlsx#cell-object
       *
       * Cell Object
       * Key    Description
       * v      raw value (see Data Types section for more info)
       * w      formatted text (if applicable)
       * t      cell type: b Boolean, n Number, e error, s String, d Date
       * f      cell formula (if applicable)
       * r      rich text encoding (if applicable)
       * h      HTML rendering of the rich text (if applicable)
       * c      comments associated with the cell **
       * z      number format string associated with the cell (if requested)
       * l      cell hyperlink object (.Target holds link, .tooltip is tooltip)
       * s      the style/theme of the cell (if applicable)
       */
      if (oXlsWorksheetCell.row > oXlsWorksheetCell.ws.maxRow) {
        oXlsWorksheetCell.ws.maxRow = oXlsWorksheetCell.row;
      }
      if (oXlsWorksheetCell.column > oXlsWorksheetCell.ws.maxCol) {
        oXlsWorksheetCell.ws.maxCol = oXlsWorksheetCell.column;
      }

      // handle Cell Style information
      var lsRGBFillColorGroup = "FFDCE6F0"; // #DCE6F0 > RGB(220,230,240)
      var lsRGBFillColorBorder = "FFCCCCCC"; // #CCCCCC > RGB(204,204,204)
      var lsRGBFillColorHeader = "FFE5E5E5"; // #E5E5E5 > RGB(229,229,229)
      var lsRGBFillColorTotal = "FFFFFF00"; // #FFFF00 > RGB(255,255,0)

      var lsDefaultFontName = "Calibri";
      var lsDefaultFontSize = 11;
      var lsDefaultAlignmentVertical = "top";
      var lsDefaultAlignmentHorizontal = "left";

      var loDefaultBorderValue = {style: "medium", color: {rgb: lsRGBFillColorBorder}};
      var loDefaultBorder = {top: loDefaultBorderValue, bottom: loDefaultBorderValue, left: loDefaultBorderValue, right: loDefaultBorderValue}

      var loStyleNone = {
        font: {name: lsDefaultFontName, sz:lsDefaultFontSize, bold: false},
        //fill: {fgColor: {}},
        alignment: {vertical: lsDefaultAlignmentVertical, horizontal: lsDefaultAlignmentHorizontal, wrapText: false, indent: 0}};

      var loStyleDefault = {
        font: {name: lsDefaultFontName, sz:lsDefaultFontSize, bold: false},
        //fill: {fgColor: {}},
        alignment: {vertical: lsDefaultAlignmentVertical, horizontal: lsDefaultAlignmentHorizontal, wrapText: false, indent: 0},
        border: loDefaultBorder};

      var loStyleGroup = {
        font: {name: lsDefaultFontName, sz:lsDefaultFontSize, bold: false},
        fill: {fgColor: {rgb: lsRGBFillColorGroup}},
        alignment: {vertical: lsDefaultAlignmentVertical, horizontal: lsDefaultAlignmentHorizontal, wrapText: false, indent: 0},
        border: loDefaultBorder};

      var loStyleHeader = {
        font: {name: lsDefaultFontName, sz:lsDefaultFontSize, bold: false},
        fill: {fgColor: {rgb: lsRGBFillColorHeader}},
        alignment: {vertical: lsDefaultAlignmentVertical, horizontal: lsDefaultAlignmentHorizontal, wrapText: false, indent: 0},
        border: loDefaultBorder};

      var loStyleTotal = {
        font: {name: lsDefaultFontName, sz:lsDefaultFontSize, bold: false},
        fill: {fgColor: {rgb: lsRGBFillColorTotal}},
        alignment: {vertical: lsDefaultAlignmentVertical, horizontal: lsDefaultAlignmentHorizontal, wrapText: false, indent: 0},
        border: loDefaultBorder};

      // Cell Style
      if (oCellInfo.getStyle().toString() !== "NONE" && this.allowStyles === true) {
        if (oCellInfo.getStyle().toString() === "GROUP") {
          oXlsWorksheetCell.s = loStyleGroup;
        } else if (oCellInfo.getStyle().toString() === "HEADER") {
          oXlsWorksheetCell.s = loStyleHeader;
        } else if (oCellInfo.getStyle().toString() === "TOTAL") {
          oXlsWorksheetCell.s = loStyleTotal;
        } else {
          oXlsWorksheetCell.s = loStyleDefault;
        }
      } else {
        oXlsWorksheetCell.s = loStyleNone;
      }

      // Cell Value + Cell Value Type + Cell Horizontal Alignment
      oXlsWorksheetCell.v = oCellInfo.getFormattedValue();
      oXlsWorksheetCell.t = "s";
      oXlsWorksheetCell.s.alignment.horizontal = "left";
      if (oCellInfo.getValueType().toString() === "NUMBER" || oCellInfo.getValueType().toString() === "NUMBER_AS_STRING") {
        oXlsWorksheetCell.s.alignment.horizontal = "right";
        if (oCellInfo.getValueType().toString() === "NUMBER") {
          oXlsWorksheetCell.v = oCellInfo.getValue();
          oXlsWorksheetCell.t = "n";
        }
      } else if (oCellInfo.getValueType().toString() === "DATE") {
        oXlsWorksheetCell.v = oCellInfo.getValue();
        oXlsWorksheetCell.t = "d";
      }

      // Cell Formula
      if (oCellInfo.getFormula()) {
        oXlsWorksheetCell.f = oCellInfo.getFormula();
      }

      // Cell Format String
      if (oCellInfo.getValueType().toString() === "NUMBER_AS_STRING") {
        oCellInfo.setFormatString(null);
      }
      if (oCellInfo.getValueType().toString() === "NUMBER") {
        oXlsWorksheetCell.s.numFmt = oCellInfo.getFormatString();
      }
      if (oCellInfo.getFormatString() != null && oCellInfo.getFormatString().length > 0) {
        // set format to cell
        oXlsWorksheetCell.z = oCellInfo.getFormatString();
        var lFormatIndex = this.formatIndexMap[oCellInfo.getFormatString()];
        if (!lFormatIndex) {
          // find unused format index
          while (XLSX.SSF.get_table()[this.formatIndex]) {
            this.formatIndex++;
          }

          // save format index for format
          lFormatIndex = this.formatIndex;
          this.formatIndexMap[oCellInfo.getFormatString()] = lFormatIndex;

          // increase global format index
          this.formatIndex++;

          // register new format
          XLSX.SSF.load(oCellInfo.getFormatString(), lFormatIndex);
        }
        oXlsWorksheetCell.z = XLSX.SSF.get_table()[lFormatIndex];

        // format cell (should write correct external value to cell.w based on cell.z)
        XLSX.utils.format_cell(oXlsWorksheetCell);
      } else {
        oXlsWorksheetCell.w = oCellInfo.getFormattedValue();
      }

      // handle merge of Cell
      this.mergeCell(oXlsWorksheetCell, oCellInfo.getRowSpan(), oCellInfo.getColSpan());
    },

    /**
     * Save Workbook
     */
    save : function(filename) {
      var lBuffer = this.getAsBinary();

      var lBlob = new Blob(
        [ lBuffer ],
        {type : "application/octet-stream"});

      var lUrl = URL.createObjectURL(lBlob);
      
      var saveData = (function() {
        var loElement = document.createElement("a");
        document.body.appendChild(loElement);
        loElement.style = "display: none";

        return function(lUrl, filename) {
        	loElement.href = lUrl;
        	loElement.download = filename;
        	loElement.click();
        };
      }());

      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(lBlob, filename);
      } else {
        saveData(lUrl, filename);
      }
      
      var f = function() {
        window.URL.revokeObjectURL(lUrl);
      };
      setTimeout(f, 1);
    },
    
    /**
     * Get Workbook Content as Binary
     */
    getAsBinary : function() {
      var lWorkbookContent = XLSX.write(
        this.wb,
        {
          bookType : "xlsx", // Type of Workbook
          bookSST : true, // Generate Shared String Table **
          compression: "DEFLATE", // compress the file
          type : "binary", // Output data encoding
          cellDates : true // Store dates as type d (default is n)
        });
      
      function s2ab(stringValue) {
        var lBuffer = new ArrayBuffer(stringValue.length);
        
        var lView = new Uint8Array(lBuffer);
        for (var i = 0; i != stringValue.length; ++i) {
          lView[i] = stringValue.charCodeAt(i) & 0xFF;
        }
        
        return lBuffer;
      }
      var lBuffer = s2ab(lWorkbookContent);
      
      return lBuffer;
    }
  }
);

$Firefly.createClass(
	"sap.buddha.LogEntry", 
	sap.firefly.XObject, 
	{
		$statics:
		{
			//use create
			create: function(le)
			{
				var logEntry = new sap.buddha.LogEntry();
				logEntry.le = le;
				return logEntry;
			}
		},
		// *** statics end ***
	
		getTime : function(){
			return this.le.time;
		},
		
		getDate : function(){
			return this.le.date;
		},
	
		getTimeStamp : function(){
			return this.le.timestamp;
		},
		
		getLevel : function(){
			return this.le.level;
		},
	
		getMessage : function(){
			return this.le.message;
		},
	
		getDetails : function(){
			return this.le.details;
		},
	
		getComponent : function(){
			return this.le.component;
		}	
	}
);
$Firefly.createClass(
	"sap.buddha.LogEntryIterator", 
	sap.firefly.XObject, 
	{
		$statics:
		{
			//use create
			create: function(logEntries)
			{
				var iterator = new sap.buddha.LogEntryIterator();
				iterator.logEntries = logEntries;
				iterator.ix = 0;
				return iterator;
			}
		},
		// *** statics end ***
		
		logEntries: null,
		
		hasNext: function()
		{
			if(this.logEntries == null){
				return false;
			}
			return (this.ix < this.logEntries.length);
		},
		
		next: function()
		{
			if (!this.hasNext())
			{
				return null;
			}
			var le = sap.buddha.LogEntry.create(this.logEntries[this.ix]);
			
			this.ix++;
	
			return le;
		}
	}
);
$Firefly.createClass(
	"sap.buddha.XLogging",
	null, 
	{
		$statics:
		{
			create : function () {
				var logger = new sap.buddha.XLogging();
	
				var bDebugMode = jQuery.sap.debug();
				logger.jQueryLogger= new jQuery.sap.log.getLogger("DSH", bDebugMode ? 4 : -1);			
				
				logger.entries = [];
				
				jQuery.sap.log.addLogListener(logger);
				logger.components = {},
				logger.components["DSH"] = true;
				return logger;
			},
			XALL : 6,
			XDEBUG : 4,
			XERROR : 1,
			XFATAL : 0,
			XINFO : 3,
			XNONE : -1,
			XTRACE : 5,
			XWARNING : 2		
		},
		// *** statics end ***
	
		onLogEntry : function(le){
			if(this.components[le.component]){
				this.entries.push(le);
			}
		},
	
		setLogLevelInternal : function(sComponent){
			if(sComponent){
				this.components[sComponent] = true;
				this.jQueryLogger.setLevel(4, sComponent);
			}
		},
		
		debug : function (sMessage, sDetails, sComponent) {
			this.setLogLevelInternal(sComponent);
			this.jQueryLogger.debug(sMessage, sDetails, sComponent);
		},
	
		error : function (sMessage, sDetails, sComponent) {
			this.setLogLevelInternal(sComponent);
			this.jQueryLogger.error(sMessage, sDetails, sComponent);
		},
	
		fatal : function (sMessage, sDetails, sComponent) {
			this.setLogLevelInternal(sComponent);
			this.jQueryLogger.fatal(sMessage, sDetails, sComponent);
		},
	
		info : function (sMessage, sDetails, sComponent) {
			this.setLogLevelInternal(sComponent);
			this.jQueryLogger.info(sMessage, sDetails, sComponent);
		},
		
		isLoggable : function(iLevel){
			return this.jQueryLogger.isLoggable(iLevel, "DSH");
		}, 
	
		trace : function (sMessage, sDetails, sComponent) {
			this.setLogLevelInternal(sComponent);
			this.jQueryLogger.trace(sMessage, sDetails, sComponent);
		},
		
		warning : function (sMessage, sDetails, sComponent) {
			this.setLogLevelInternal(sComponent);
			this.jQueryLogger.warning(sMessage, sDetails, sComponent);
		},
		
		toString : function() {
			return "[???]";
		},
		
		getLogs : function () {
			return sap.buddha.LogEntryIterator.create(this.entries);
		}
	}
);
$Firefly.createClass(
	"sap.buddha.XZip", 
	sap.firefly.XObject, 
	{
		$statics:
		{
			//use create
			create: function()
			{
				var xZip = new sap.buddha.XZip();
				xZip.zip = new window.jszip();
				return xZip;
			}
		},
		
		saveToFile : function(filePath, content){
			this.zip.file(filePath, content, {binary : true});
		},	
	
		saveStringToFile : function(filePath, contentAsString){
			this.zip.file(filePath, contentAsString);
		},
	
		//	saveXByteArrayToFile : function(filePath, byteArray){
		//		this.zip.file(filePath, byteArray.getNative(), {binary : true});
		//	},
		
		getZipAsBinary : function(){
	  		var buf = this.zip.generate({type : "uint8array"});
	  		return buf;
		},
		
		saveZip : function(fileName){
	  		var buf = this.zip.generate({type : "uint8array"});
	  
			var blob = new Blob([buf], {
				type : "application/zip"
			  });
			
			var url = window.URL.createObjectURL(blob);		
			
			var saveData = (function () {
				var a = document.createElement("a");
				document.body.appendChild(a);
				a.style = "display: none";
				return function (url, fileName) {
					a.href = url;
					a.download = fileName;
					a.click();
				};
			}());
	
			
			if (window.navigator && window.navigator.msSaveOrOpenBlob) {
				window.navigator.msSaveOrOpenBlob(blob, fileName);
			} else {
				saveData(url, fileName);
			}
			
			var f = function(){
				window.URL.revokeObjectURL(url); 
			};
			
			setTimeout(f, 1);
		}
	}
);
$Firefly.createClass(
	"sap.buddha.XLocalization", 
	null, 
	{
		$statics:
		{
			createForUrl : function (sUrl) {
		        var localization = new sap.buddha.XLocalization();
		        localization.resourceBundle = ResourceBundle.create(
		          {
		            // specify url of the base .properties file
		            url : sUrl,
		            async : false
		          }
		        );
		        return localization;
			},
			
			create : function () {
		        if (sap.ui.getCore().getLoadedLibraries().hasOwnProperty("sap.zen.dsh")) {
		          return sap.buddha.XLocalization.createForUrl(
		            URI(sap.ui.resource("sap.zen.dsh","i18n/localization/localization.properties")).absoluteTo(window.location.pathname).toString()
		          );
		        } else {
		        	//For native mode texts, development environment only
		        	return sap.buddha.XLocalization.createForUrl("/aad/buddha/localization/localization.properties");
		        }
			}
		},
		// *** statics end ***
		
		propertyMap : null,
		
		hasText : function(sKey) {
			return this.resourceBundle.hasText(sKey);
		},
		
		getText : function(sKey) {
			return this.resourceBundle.getText(sKey);
		},
		
		getText1 : function(sKey, sArg1) {
			return this.resourceBundle.getText(sKey, [sArg1]);
		},
	
		getText2 : function(sKey, sArg1, sArg2) {
			return this.resourceBundle.getText(sKey, [sArg1, sArg2]);
		},
	
		getText3 : function(sKey, sArg1, sArg2, sArg3) {
			return this.resourceBundle.getText(sKey, [sArg1, sArg2, sArg3]);
		},
	
		getText4 : function(sKey, sArg1, sArg2, sArg3, sArg4) {
			return this.resourceBundle.getText(sKey, [sArg1, sArg2, sArg3, sArg4]);
		},
	
		getText5 : function(sKey, sArg1, sArg2, sArg3, sArg4, sArg5) {
			return this.resourceBundle.getText(sKey, [sArg1, sArg2, sArg3, sArg4, sArg5]);
		},
	
		getText6 : function(sKey, sArg1, sArg2, sArg3, sArg4, sArg5, sArg6) {
			return this.resourceBundle.getText(sKey, [sArg1, sArg2, sArg3, sArg4, sArg5, sArg6]);
		},
		
		getTranslationMap : function() {
			if (this.propertyMap === null) {
				var jsMap = this.resourceBundle.aPropertyFiles && this.resourceBundle.aPropertyFiles.length > 0 && this.resourceBundle.aPropertyFiles[0] && this.resourceBundle.aPropertyFiles[0].mProperties;
				this.propertyMap = sap.firefly.XHashMapByString.create();
				
				if (typeof jsMap === "object" ) {
					for (var key in jsMap) {
						if (jsMap.hasOwnProperty(key)) {
							this.propertyMap.put(key, jsMap[key]);
						}
					}
				}
			}
	
			return this.propertyMap;
		},
	
		toString : function() {
			return "[???]";
		}
	}
);
}
);

