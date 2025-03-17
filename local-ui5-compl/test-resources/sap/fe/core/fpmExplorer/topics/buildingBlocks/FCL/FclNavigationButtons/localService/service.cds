service Service {
  @UI.LineItem: [
    {
      $Type: 'UI.DataField',
      Value: title
    },
    {
      $Type: 'UI.DataField',
      Value: incidentStatus
    },
    {
      $Type: 'UI.DataField',
      Value: category
    }
  ]
  entity Incidents {
    key ID             : String @title: 'ID';
        title          : String @title: 'Title';
        category       : String @title: 'Category';
        incidentStatus : String @title: 'Incident Status';
  }
}
