/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define([], function () {
  "use strict";

  var Type = /*#__PURE__*/function (Type) {
    Type["Primitive"] = "Primitive";
    Type["List"] = "List";
    Type["Object"] = "Object";
    return Type;
  }(Type || {});
  class CloneBuffer {
    cloneBuffer;
    constructor() {
      this.cloneBuffer = [];
    }
    put(object, clonedObject) {
      this.cloneBuffer.push({
        object: object,
        clonedObject: clonedObject
      });
    }
    get(object) {
      const cloneBufferEntry = this.cloneBuffer.find(bufferEntry => bufferEntry.object === object);
      if (!cloneBufferEntry) {
        return undefined;
      }
      return cloneBufferEntry.clonedObject;
    }
  }
  class CloneService {
    config;
    classConfigCache;
    buffer;
    constructor(config) {
      this.config = config ?? {
        classes: []
      };
    }
    getType(obj) {
      if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean" || typeof obj === "function" || typeof obj === "undefined") {
        return Type.Primitive;
      }
      if (typeof obj == "object") {
        if (Array.isArray(obj)) {
          return Type.List;
        } else {
          return Type.Object;
        }
      }
      throw `Program error: Clone utitliy does not support type ${typeof obj}`;
    }
    clone(obj) {
      this.buffer = new CloneBuffer();
      return this.internalClone(obj);
    }
    internalClone(obj) {
      switch (this.getType(obj)) {
        case Type.List:
          return this.cloneList(obj);
        case Type.Object:
          return this.cloneObject(obj);
        case Type.Primitive:
          return this.clonePrimitive(obj);
      }
    }
    cloneList(obj) {
      // check buffer for list
      let clonedList = this.buffer.get(obj);
      if (clonedList) {
        return clonedList;
      }
      // create new list
      clonedList = [];
      this.buffer.put(obj, clonedList);
      // clone list entries
      for (const element of obj) {
        if (!this.isCloneableObject(element)) {
          continue;
        }
        clonedList.push(this.internalClone(element));
      }
      return clonedList;
    }
    cloneObject(obj) {
      // check buffer for object
      let clonedObj = this.buffer.get(obj);
      if (clonedObj) {
        return clonedObj;
      }
      const classConfig = this.getClassConfig(obj);
      // use custome clone function
      if (classConfig?.cloneFunction) {
        return classConfig.cloneFunction(obj);
      }
      // use original object (do not clone, use object as it is)
      if (classConfig?.useOriginalObject) {
        return obj;
      }

      // create new object
      clonedObj = {};
      this.buffer.put(obj, clonedObj);
      // clone object properties
      for (const property in obj) {
        if (!this.isCloneableProperty(obj, property)) {
          continue;
        }
        clonedObj[property] = this.internalClone(obj[property]);
      }
      return clonedObj;
    }
    clonePrimitive(obj) {
      return obj;
    }
    getClassConfig(obj) {
      if (this.classConfigCache && obj instanceof this.classConfigCache.class) {
        return this.classConfigCache;
      }
      this.classConfigCache = this.config.classes.find(classConfig => obj instanceof classConfig.class);
      return this.classConfigCache;
    }
    isCloneableObject(obj) {
      if (obj?.constructor === Object) {
        return true; // plain objects
      }
      const classConfig = this.getClassConfig(obj);
      if (!classConfig) {
        return false;
      }
      return true;
    }
    isCloneableProperty(obj, property) {
      if (obj?.constructor === Object) {
        return true; // plain objects
      }
      const classConfig = this.getClassConfig(obj);
      if (!classConfig) {
        return false;
      }
      return classConfig.properties.indexOf(property) >= 0;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.CloneService = CloneService;
  return __exports;
});
})();