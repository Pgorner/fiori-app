type sapmessage : {
  code            : String(10) not null;
  message         : String(100);
  numericSeverity : Integer;
  transition      : Boolean default true;
  target          : String(200) not null;
  longtextUrl     : String(200) not null;
};

service Service {
  @odata.draft.enabled
  @Capabilities.DeleteRestrictions.Deletable: false
  @Common.Messages                          : SAP_Message
  entity RootEntity {
    key ID            :      Integer @title: 'Identifier';
        TitleProperty :      String  @title: 'Title';
        SAP_Message   : many sapmessage;
        items         :      Composition of many ChildEntityWithSE
                               on items.Parent = $self;
        items2        :      Composition of many ChildEntityWithoutSE
                               on items2.Parent = $self;
  }

  @Common.Messages                     : SAP_Message
  @Common.SideEffects #globalValidation: {TargetProperties: ['SAP_Message']}
  entity ChildEntityWithSE {
    key ID          :      Integer @title: 'Item Identifier';
        item        :      String  @title: 'Press Enter in the Field';
        SAP_Message : many sapmessage;
        Parent      :      Association to RootEntity;
  } actions {
    action generateMessage();
  }

  entity ChildEntityWithoutSE {
    key ID     : Integer @title: 'Item Identifier';
        item   : String  @title: 'Press Enter in the Field';
        Parent : Association to RootEntity;
  };
}

annotate Service.ChildEntityWithSE with @UI.LineItem: [
  {
    $Type : 'UI.DataFieldForAction',
    Label : 'Generate Message',
    Action: 'Service.generateMessage'
  },
  {Value: ID},
  {Value: item}
];

annotate Service.ChildEntityWithoutSE with @UI.LineItem: [
  {Value: ID},
  {Value: item}
];
