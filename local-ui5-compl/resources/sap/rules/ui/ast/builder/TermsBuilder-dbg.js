sap.ui.define(["sap/rules/ui/ast/util/AstUtil", "sap/rules/ui/ast/provider/TermsProvider", "sap/rules/ui/ast/constants/Constants"],
	function (astUtil, termsProvider, constants) {
		"use strict";

		var instance;
		var TermsBuilder = function () {
			this._dataObjects = [];
			this._nestedDataObjects = [];
			this._visitorAssociations = new astUtil.prototype.HashSet();
			this.termsProviderInstance = termsProvider.getInstance();
		};

		TermsBuilder.prototype._getDataObjectType = function (dataObjectType) {
			if (dataObjectType) {
				if (dataObjectType === "Structure") {
					return "S";
				}
				if (dataObjectType === "Table") {
					return "T";
				}
				if (dataObjectType === "Element") {
					return "E";
				}
			}
			return dataObjectType;
		};

		TermsBuilder.prototype._getBusinessDataType = function (businessDataType) {
			if (businessDataType) {
				if (businessDataType.toLocaleLowerCase() === "Number".toLocaleLowerCase()) {
					return "N";
				}
				if (businessDataType.toLocaleLowerCase() === "String".toLocaleLowerCase()) {
					return "S";
				}
				if (businessDataType.toLocaleLowerCase() === "Boolean".toLocaleLowerCase()) {
					return "B";
				}
				if (businessDataType.toLocaleLowerCase() === "Date".toLocaleLowerCase()) {
					return "D";
				}
				if (businessDataType.toLocaleLowerCase() === "Timestamp".toLocaleLowerCase()) {
					return "U";
				}
				if (businessDataType.toLocaleLowerCase() === "Time".toLocaleLowerCase()) {
					return "T";
				}
				if (businessDataType.toLocaleLowerCase() === "Geometry".toLocaleLowerCase()) {
					return "G";
				}
				if (businessDataType.toLocaleLowerCase() === "Amount".toLocaleLowerCase()) {
					return "A";
				}
			}
			return businessDataType;
		};

		TermsBuilder.prototype._generateTermsFromAssociations = function (association, sourceDO, vocaId, prefix, prefixId, prefixLabel, doVisited) {
			var targetDO, attributes, attribute, associations, term, doLabel, associationLabel, attrLabel;
			if (association) {
				if(doVisited.indexOf(association.TargetDataObjectId) === -1){
					doVisited.push(association.TargetDataObjectId);
				}else{
					// it's a cyclic association hence returning
					doVisited.push(association.TargetDataObjectId);
					return;
				}
				
				//if label is undefined then name will be used for label map
				doLabel = sourceDO.Name;
				if(sourceDO.Label && sourceDO.Label != ""){
					doLabel = sourceDO.Label;
				}
				associationLabel = association.Name;
				if(association.Label && association.Label != ""){
					associationLabel = association.Label;
				}
				
				term = this.termsProviderInstance.createTerm(prefix + constants.DOT + association.Name,
						prefixId + constants.DOT + association.Id, null, vocaId, 'AO', associationLabel, false, association.Cardinality);
				targetDO = this._getDataObject(association.TargetDataObjectId);
				this.termsProviderInstance.addToTermsIdMap(prefixId + constants.DOT + association.Id, term);
				this.termsProviderInstance.addToTermsNameMap(prefix + constants.DOT + association.Name, term);
				this.termsProviderInstance.addToTermsLabelMap(prefixLabel + constants.DOT + associationLabel, term);

				if (targetDO) {
					attributes = targetDO.Attributes;
					for (var attrIterator = 0; attrIterator < attributes.length; attrIterator++) {
						attribute = attributes[attrIterator];
						//if label is undefined then name will be used for label map
						attrLabel = attribute.Name;
						if(attribute.Label && attribute.Label != ""){
							attrLabel = attribute.Label;
						}
						term = this.termsProviderInstance.createTerm(prefix + constants.DOT + association.Name + constants.DOT + attribute.Name,
							prefixId + constants.DOT + association.Id + constants.DOT + attribute.Id, this._getBusinessDataType(attribute.BusinessDataType), vocaId, 'E',
							attrLabel, attribute.HasValueSource);
						this.termsProviderInstance.addToTermsIdMap(prefixId + constants.DOT + association.Id + constants.DOT + attribute.Id, term);
						this.termsProviderInstance.addToTermsNameMap(prefix + constants.DOT + association.Name + constants.DOT + attribute.Name,
							term);
						this.termsProviderInstance.addToTermsLabelMap(prefixLabel + constants.DOT + associationLabel + constants.DOT + attrLabel,
							term);
					}
					
					var references = [];
					if (targetDO && targetDO.References) {
						references = targetDO.References;
					}
					var refer;
					for (var refIterator = 0; refIterator < references.length; refIterator++) {
						refer = references[refIterator];
						this._generateTermsFromReferences(refer, targetDO, vocaId, prefix + constants.DOT + association.Name, prefixId + constants.DOT +
								association.Id, prefixLabel + constants.DOT + associationLabel, doVisited);
						doVisited.pop();
					}

					associations = targetDO.Associations;
					var assoc;
					for (var assocIterator = 0; assocIterator < associations.length; assocIterator++) {
						assoc = associations[assocIterator];
						this._generateTermsFromAssociations(assoc, targetDO, vocaId, prefix + constants.DOT + association.Name, prefixId + constants.DOT +
							association.Id, prefixLabel + constants.DOT + associationLabel, doVisited);
						doVisited.pop();
					}
				}
			}
		};
		
		TermsBuilder.prototype._generateTermsFromReferences = function (reference, sourceDO, vocaId, prefix, prefixId, prefixLabel, doVisited) {
			var targetDO, attributes, attribute, references, term, doLabel, referenceLabel, attrLabel, associations;
			if (reference) {
				if(doVisited.indexOf(reference.TargetDataObjectId) === -1){
					doVisited.push(reference.TargetDataObjectId);
				}else{
					// it's a cyclic reference hence returning
					doVisited.push(reference.TargetDataObjectId);
					return;
				}
				//if label is undefined then name will be used for label map
				doLabel = sourceDO.Name;
				if(sourceDO.Label && sourceDO.Label != ""){
					doLabel = sourceDO.Label;
				}
				referenceLabel = reference.Name;
				if(reference.Label && reference.Label != ""){
					referenceLabel = reference.Label;
				}
				targetDO = this._getNestedDataObject(reference.TargetDataObjectId);
				var isDataObjectTable = false;
				if (targetDO && targetDO.Type && targetDO.Type === "Table") {
					isDataObjectTable = true
				}
				term = this.termsProviderInstance.createTerm(prefix + constants.DOT + reference.Name,
					prefixId + constants.DOT + reference.Id, null, vocaId, 'R', referenceLabel);
				term.setIsDataObjectTable(isDataObjectTable);
				this.termsProviderInstance.addToTermsIdMap(prefixId + constants.DOT + reference.Id, term);
				this.termsProviderInstance.addToTermsNameMap(prefix + constants.DOT + reference.Name, term);
				this.termsProviderInstance.addToTermsLabelMap(prefixLabel + constants.DOT + referenceLabel, term);
				if (targetDO) {
					attributes = targetDO.Attributes;
					for (var attrIterator = 0; attrIterator < attributes.length; attrIterator++) {
						attribute = attributes[attrIterator];
						//if label is undefined then name will be used for label map
						attrLabel = attribute.Name;
						if(attribute.Label && attribute.Label != ""){
							attrLabel = attribute.Label;
						}
						term = this.termsProviderInstance.createTerm(prefix + constants.DOT + reference.Name + constants.DOT + attribute.Name,
							prefixId + constants.DOT + reference.Id + constants.DOT + attribute.Id, this._getBusinessDataType(attribute.BusinessDataType), vocaId, 'E', attrLabel);
						
						this.termsProviderInstance.addToTermsIdMap(prefixId + constants.DOT + reference.Id + constants.DOT + attribute.Id, term);
						this.termsProviderInstance.addToTermsNameMap(prefix + constants.DOT + reference.Name + constants.DOT + attribute.Name,
							term);
						this.termsProviderInstance.addToTermsLabelMap(prefixLabel + constants.DOT + referenceLabel + constants.DOT + attrLabel, term);
					}
					
					associations = targetDO.Associations;
					for (var assocIterator = 0; assocIterator < associations.length; assocIterator++) {
						var association;
						association = associations[assocIterator];
						this._generateTermsFromAssociations(association, targetDO, vocaId, prefix + constants.DOT + reference.Name, prefixId + constants.DOT +
								reference.Id, prefixLabel + constants.DOT + referenceLabel , doVisited);
						doVisited.pop();
					}
					references = [];
					if(targetDO && targetDO.References) {
						references = targetDO.References;
					}
					var refer;
					for (var refIterator = 0; refIterator < references.length; refIterator++) {
						refer = references[refIterator];
						this._generateTermsFromReferences(refer, targetDO, vocaId, prefix + constants.DOT + reference.Name, prefixId + constants.DOT +
								reference.Id, prefixLabel + constants.DOT + referenceLabel, doVisited);
						doVisited.pop();
					}
                }					
			}
		};
		
		/* returns the nested DO */
		TermsBuilder.prototype._getNestedDataObject = function (id) {
			for (var doIterator = 0; doIterator < this._nestedDataObjects.length; doIterator++) {
				if (id === this._nestedDataObjects[doIterator].Id) {
					var nestedDO = this._nestedDataObjects[doIterator];
					if(nestedDO.DataObjectReference && nestedDO.DataObjectReference.TargetDataObjectId){
						return this._getNestedDataObject(nestedDO.DataObjectReference.TargetDataObjectId);
					}
					return nestedDO;
				}
			}
		};
	
		/* generates terms from rules */
		TermsBuilder.prototype._generateTermsFromRules = function (json) {
			var rule, _rules, ruleLabel, term, dataObject, attributes, attribute, association, associations, references, reference, attributeLabel, _dataObjects, vocaId;
			if (json.d && json.d.DataObjects){
				_dataObjects = json.d.DataObjects;
				vocaId = json.d.Id;
			} else if(json.DataObjects){
				_dataObjects = json.DataObjects;
				vocaId = json.Id;
			}
			if (json.d && json.d.Rules){
				_rules = json.d.Rules;
			} else if(json.Rules){
				_rules = json.Rules;
			}
			for (var ruleIterator = 0; ruleIterator < _rules.length; ruleIterator++) {
                rule = _rules[ruleIterator];
                //if label is undefined then name will be used for label map
                ruleLabel = rule.Name;
                if (rule.Label && rule.Label != "") {
                    ruleLabel = rule.Label;
                }
                term = this.termsProviderInstance.createTerm(rule.Name, rule.Id, null,
                    rule.VocabularyId, null, ruleLabel);
                term.ResultDataObjectId = rule.ResultDataObjectId;
                term.Status = rule.Status;
                term.Type = constants.RULE;
                var resultDoTerm = this.termsProviderInstance.getTermByTermId(term.ResultDataObjectId);
                if (resultDoTerm && resultDoTerm.getIsDataObjectElement()) {
                    term.isResultDataObjectElement = true;
                    var elementAttrTerm = this.termsProviderInstance._getAllAttrsRefsAssocsForDataObject(term.ResultDataObjectId);
                    term._bussinessDataType = elementAttrTerm[0]._bussinessDataType;
                    term._hasValueSource = elementAttrTerm[0]._hasValueSource;
                }
                this.termsProviderInstance.addToTermsIdMap(rule.Id, term);
                this.termsProviderInstance.addToTermsNameMap(rule.Name, term);
                this.termsProviderInstance.addToTermsLabelMap(ruleLabel, term);
                
                for (var doIterator = 0; doIterator < _dataObjects.length; doIterator++) {
					dataObject = _dataObjects[doIterator];
					if(dataObject.Id === term.ResultDataObjectId) {
						var doVisited = [];
						//check if DO reference
						var referencedDO = null;
						if(dataObject.DataObjectReference && dataObject.DataObjectReference.TargetDataObjectId){
							referencedDO = this._getNestedDataObject(dataObject.DataObjectReference.TargetDataObjectId);
						}
						
						attributes = dataObject.Attributes;
						if(referencedDO){
							attributes = referencedDO.Attributes;
						}
						for (var attrIterator = 0; attrIterator < attributes.length; attrIterator++) {
							attribute = attributes[attrIterator];
							//if label is undefined then name will be used for label map
							attributeLabel = attribute.Name;
							if(attribute.Label && attribute.Label != ""){
								attributeLabel = attribute.Label;
							}
							term = this.termsProviderInstance.createTerm(attribute.Name, rule.Id + constants.DOT +
								attribute.Id,
								this._getBusinessDataType(attribute.BusinessDataType), vocaId, 'E', attributeLabel);
							this.termsProviderInstance.addToTermsIdMap(rule.Id + constants.DOT + attribute.Id, term);
							this.termsProviderInstance.addToTermsNameMap(rule.Name + constants.DOT + attribute.Name, term);
							this.termsProviderInstance.addToTermsLabelMap(ruleLabel + constants.DOT + attributeLabel, term);
						}

						associations = dataObject.Associations;
						if(referencedDO){
							associations = referencedDO.Associations;
						}
						for (var assocIterator = 0; assocIterator < associations.length; assocIterator++) {
							association = associations[assocIterator];
							doVisited.push(dataObject.Id);
							this._generateTermsFromAssociations(association, dataObject, vocaId, rule.Name, rule.Id, ruleLabel, doVisited);
							doVisited.pop();
							doVisited.pop();
						}
						
						references = [];
						if(dataObject && dataObject.References) {
							references = dataObject.References;
						}
						if(referencedDO){
							references = referencedDO.References;
						}
						for (var refIterator = 0; refIterator < references.length; refIterator++) {
							reference = references[refIterator];
							doVisited.push(dataObject.Id);
							this._generateTermsFromReferences(reference, dataObject, vocaId, rule.Name, rule.Id, ruleLabel, doVisited);
							doVisited.pop();
							doVisited.pop();
						}
					}
			   }
            }
		};
		
		/* returns all the dataObjects */
		TermsBuilder.prototype._getDataObject = function (id) {
			for (var doIterator = 0; doIterator < this._dataObjects.length; doIterator++) {
				if (id === this._dataObjects[doIterator].Id) {
					return this._dataObjects[doIterator];
				}
			}
		};

		/*
			Generates all possible terms for all dataObjects.
			Example:
				Assume a dataObject DO has two attributes(do1attr1, do1attr2) and one association(asso1) which is linked to dataObject DO2.
				Assume DO2 has two attributes(do2attr1, do2attr2)
				So this function for do1 will create the following terms:
				do1
				do1.doattr1
				do1.do1attr2
				do1.asso1
				do1.asso1.do2attr1
				do1.asso1.do2attr1
		*/
		TermsBuilder.prototype.construct = function (json) {
			/* constructs terms from the passed json parameter & sets it in TermsProvider */
			this._dataObjects = json.DataObjects;
			this._nestedDataObjects = json.NestedDataObjects;
			this._rules = json.Rules;
			var vocaId = json.Id;
			this.termsProviderInstance.reset();
			this.termsProviderInstance.setVocabularyId(vocaId);
			var dataObject, attributes, attribute, association, associations, reference, references, term, doLabel, attributeLabel;
			for (var doIterator = 0; doIterator < this._dataObjects.length; doIterator++) {
				dataObject = this._dataObjects[doIterator];
				//if label is undefined then name will be used for label map
				doLabel = dataObject.Name;
				if(dataObject.Label && dataObject.Label != ""){
					doLabel = dataObject.Label;
				}		
			    var isDataObjectElement = false;
				if (dataObject.Type === "Element") {
					isDataObjectElement = true
				}
				term = this.termsProviderInstance.createTerm(dataObject.Name, dataObject.Id, null,
					vocaId, this._getDataObjectType(dataObject.Type), doLabel);
				term.setIsDataObjectElement(isDataObjectElement);
				this.termsProviderInstance.addToTermsIdMap(dataObject.Id, term);
				this.termsProviderInstance.addToTermsNameMap(dataObject.Name, term);
				this.termsProviderInstance.addToTermsLabelMap(doLabel, term);
				
				//check if DO reference
				var referencedDO = null;
				if(dataObject.DataObjectReference && dataObject.DataObjectReference.TargetDataObjectId){
					referencedDO = this._getNestedDataObject(dataObject.DataObjectReference.TargetDataObjectId);
				}

				attributes = dataObject.Attributes;
				if(referencedDO){
					attributes = referencedDO.Attributes;
				}
				for (var attrIterator = 0; attrIterator < attributes.length; attrIterator++) {
					attribute = attributes[attrIterator];
					
					//if label is undefined then name will be used for label map
					attributeLabel = attribute.Name;
					if(attribute.Label && attribute.Label != ""){
						attributeLabel = attribute.Label;
					}
					term = this.termsProviderInstance.createTerm(dataObject.Name + constants.DOT + attribute.Name, dataObject.Id + constants.DOT +
						attribute.Id,
					this._getBusinessDataType(attribute.BusinessDataType), vocaId, 'E', attributeLabel, attribute.HasValueSource);
					this.termsProviderInstance.addToTermsIdMap(dataObject.Id + constants.DOT + attribute.Id, term);
					this.termsProviderInstance.addToTermsNameMap(dataObject.Name + constants.DOT + attribute.Name, term);
					this.termsProviderInstance.addToTermsLabelMap(doLabel + constants.DOT + attributeLabel, term);
				}

				var doVisited = [];
				associations = dataObject.Associations;
				if(referencedDO){
					associations = referencedDO.Associations;
				}
				for (var assocIterator = 0; assocIterator < associations.length; assocIterator++) {
					association = associations[assocIterator];
					doVisited.push(dataObject.Id);
					this._generateTermsFromAssociations(association, dataObject, vocaId, dataObject.Name, dataObject.Id, doLabel, doVisited);
					doVisited.pop();
					doVisited.pop();
				}
				
				references = [];
				if(dataObject && dataObject.References) {
					references = dataObject.References;
				}
				if(referencedDO){
					references = referencedDO.References;
				}
				for (var refIterator = 0; refIterator < references.length; refIterator++) {
					reference = references[refIterator];
					doVisited.push(dataObject.Id);
					this._generateTermsFromReferences(reference, dataObject, vocaId, dataObject.Name, dataObject.Id, doLabel, doVisited);
					doVisited.pop();
					doVisited.pop();
				}
			}
			
			if(this._rules && this._rules.length > 0) {
				this._generateTermsFromRules(json);
			}
		};
		return {
			/*
				Returns the TermsBuilder instance. This is the only instance available as this class is singleton
			*/
			getInstance: function () {
				if (!instance) {
					instance = new TermsBuilder();
					instance.constructor = null;
				}
				return instance;
			}
		};
	}, true);