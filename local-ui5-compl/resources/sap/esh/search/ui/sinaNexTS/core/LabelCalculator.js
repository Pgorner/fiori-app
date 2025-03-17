/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./errors"],function(t){"use strict";const e=t["SinaError"];class s extends e{node;constructor(t){t.message=t.message??"Duplicate node";super({message:t.message,name:"DuplicateException"});this.node=t.node}}class i{data;obj;parent;nodeId;labelCalculator;childMap;children;constructor(t,e,s){this.parent=t;this.nodeId=e;this.labelCalculator=s;this.childMap={};this.children=[]}insert(t,e){if(t.length===0){this.data=this.labelCalculator.options.data(e);this.obj=e;this.calculateLabel();return}const l=t[0];let a=this.childMap[l];if(t.length===1&&a){throw new s({node:a})}if(!a){a=new i(this,l,this.labelCalculator);this.childMap[l]=a;this.children.push(a);if(this.children.length===2){this.children[0].recalculateLabels()}}a.insert(t.slice(1),e)}recalculateLabels(){const t=[];this.collectLeafs(t);for(let e=0;e<t.length;++e){t[e].calculateLabel()}}collectLeafs(t){if(this.isLeaf()){t.push(this);return}for(let e=0;e<this.children.length;++e){this.children[e].collectLeafs(t)}}isLeaf(){return this.children.length===0}hasSibling(){return this.parent&&this.parent.children.length>=2}isChildOfRoot(){return this.parent&&this.parent.nodeId==="__ROOT"}collectPath(t,e){if(!this.parent){return}if(e||this.hasSibling()||this.isChildOfRoot()){t.push(this.nodeId);e=true}if(this.parent){this.parent.collectPath(t,e)}}calculateLabel(){const t=[];this.collectPath(t);t.reverse();this.labelCalculator.options.setLabel(this.obj,t,this.data)}}class l{options;rootNode;constructor(t){this.options=t;this.rootNode=new i(null,"__ROOT",this)}calculateLabel(t){const e=this.options.key(t);try{this.rootNode.insert(e,t)}catch(e){if(e.name==="DuplicateException"){this.options.setFallbackLabel(e.node.obj,e.node.data);this.options.setFallbackLabel(t,this.options.data(t));return}throw e}}}var a={__esModule:true};a.LabelCalculator=l;return a})})();
//# sourceMappingURL=LabelCalculator.js.map