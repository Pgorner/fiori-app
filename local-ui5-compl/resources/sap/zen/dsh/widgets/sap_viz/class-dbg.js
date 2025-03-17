/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "sap/base/Log",
    "sap/zen/dsh/widgets/sap_viz/funcUtils"
  ],
  function(Log,FuncUtils) {
    Log.info("Load Class");
    // inspired by http://ejohn.org/blog/simple-javascript-inheritance/
    var fnTest = /xyz/.test(
      function() {
        window.xyz;
      }
    ) ? /\b_super\b/ : /.*/;
    var callChain = FuncUtils.createCallChain;
    function zeroClass() {}
    function extend(ext) {
      var _super = zeroClass.prototype = this.prototype;
      var subclass = this.chain ? this.chain(ext.constructor) : callChain(this, ext.constructor);
      var proto = subclass.prototype = new zeroClass();
      proto.constructor = subclass;
      delete ext.constructor;
      var fn;
      for (var f in ext) {
        fn = ext[f];
        proto[f] = typeof fn === "function" &&
          typeof _super[f] === "function" &&
          fnTest.test(fn) ? (
            function(name, func) {
              return function() {
                this._super = _super[name];
                var ret = func.apply(this, arguments);
                return ret;
              };
            }
          )(f, fn) : fn;
      }
      subclass.extend = extend;
      return subclass;
    }
    /**
     * Define a class, make it extensible. The parameter could be an existing
     * constructor or a Class config object.
     *
     * <pre>
     * {
     *    constructor : function(){...},
     *    method1   : function(){...},
     *    method2   : function(){...},
     *    ...
     *    methodn   : function(){...}
     * }
     * </pre>
     *
     * @param {Function|Object}
     *            clazz constructor or an Class config object
     * @returns {Function} the class
     */
    function define(clazz) {
      if (typeof clazz === "function") {
        clazz.extend = extend;
        return clazz;
      } else {
        var constructor = clazz.constructor || function() {};
        var     proto = constructor.prototype;
        for (var f in clazz) {
          if (Object.prototype.hasOwnProperty.call(clazz, f)) {
            proto[f] = clazz[f];
          }
        }
        constructor.extend = extend;
        return constructor;
      }
    }
    return {
      define: define,
      extend: extend
    };
  }
);
