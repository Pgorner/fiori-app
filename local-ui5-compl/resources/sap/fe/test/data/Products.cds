namespace sap.fe.test;

service JestService {
  @odata.draft.enabled
  entity Products {
    key ID : Integer;
  }
}
