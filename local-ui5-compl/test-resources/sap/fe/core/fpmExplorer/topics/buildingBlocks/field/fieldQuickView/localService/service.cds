using {
  cuid,
  managed
} from '@sap/cds/common';

namespace sap.fe.core;

entity RootEntity {
  key ID                : Integer;
      PropWithSO0       : String  @(Common: {SemanticObject: 'SO0'});
      PropWithSO1       : String  @(Common: {SemanticObject: 'SO1'});
      PropWithSO2       : String  @(Common: {SemanticObject: 'SO2'});
      PropWithSO0SO1SO2 : String  @(title: 'Prop Title');
      ChildID           : Integer @(
        Common: {Text: _NavProp1.Name},
        Common: {SemanticObject: 'SO0'}
      );
      _NavProp1         : Association to NavEntity
                            on _NavProp1.ID = ChildID;
      AnotherChildID    : Integer @(Common: {Text: _NavProp1.Name});
      AnotherChildID2   : Integer @(Common: {
        Text          : _NavProp1.Name,
        SemanticObject: {$edmJson: {$If: [
          {$Eq: [
            {$Path: 'AnotherChildID2'},
            2
          ]},
          'SO0',
          'NoTarget'
        ]}}
      });
      _NavProp2         : Association to NavEntity
                            on _NavProp2.ID = AnotherChildID;
      _NavProp3         : Association to NavEntity
                            on _NavProp3.ID = AnotherChildID2;
}

entity NavEntity {
  key ID             : Integer;
      Name           : String  @(
        title : 'Name',
        Common: {SemanticObject: 'SO0'}
      );
      Description    : String;
      Phone          : String  @(title: 'Phone');
      Address        : String  @(title: 'Address');
      EmailAddress   : String;
      LastBoughtItem : String  @(title: 'Last bought item');
      FidelityCard   : String  @(title: 'Fidelity card number');
      Points         : Integer @(title: 'Fidelity points');
}

annotate NavEntity with @(
  Common               : {SemanticKey: [Name]},
  UI                   : {
    QuickViewFacets            : [
      {
        $Type : 'UI.ReferenceFacet',
        Label : 'Customer',
        Target: '@UI.FieldGroup#CustomerContact'
      },
      {
        $Type : 'UI.ReferenceFacet',
        Label : 'Fidelity Program',
        Target: '@UI.FieldGroup#Fidelity'
      },
    ],
    HeaderInfo                 : {
      TypeName      : 'Customer',
      TypeNamePlural: 'Customers',
      Title         : {
        $Type: 'UI.DataField',
        Value: Name
      },
      Description   : {Value: Description},
      ImageUrl      : 'sap-icon://customer-and-supplier',
    },
    FieldGroup #CustomerContact: {Data: [
      {Value: Name},
      {Value: Phone}
    ]},
    FieldGroup #Fidelity       : {Data: [
      {Value: LastBoughtItem},
      {Value: FidelityCard},
      {Value: Points}
    ]},
    FieldGroup #Contact        : {Data: [{
      $Type : 'UI.DataFieldForAnnotation',
      Target: '@Communication.Contact',
    }]},
  },
  Communication.Contact: {
    fn   : Name,
    email: [{
      type   : #work,
      address: EmailAddress
    }],
    tel  : [
      {
        type: #work,
        uri : Phone
      },
      {
        type: #cell,
        uri : Phone
      }
    ],
    adr  : [{
      type : #work,
      label: Address
    }]
  },
);


service fieldQuickView {
  entity RootEntity as projection on core.RootEntity;
  entity NavEntity  as projection on core.NavEntity;
}
