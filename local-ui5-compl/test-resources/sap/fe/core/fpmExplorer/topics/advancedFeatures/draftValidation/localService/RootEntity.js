/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define([], function () {
  "use strict";

  const RootEntity = {
    async onAfterAction(actionDefinition, actionData, keys, responseData, odataRequest) {
      if (actionDefinition.name === "draftPrepare") {
        responseData["SAP_Message"] = [{
          code: "xxxx",
          longtextUrl: "",
          message: "PrepareAction on RootEntity has been triggered",
          numericSeverity: 2,
          target: "/RootEntity(ID=1,IsActiveEntity=false)/TitleProperty",
          transition: true
        }];
      }
      return responseData;
    }
  };
  return RootEntity;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSb290RW50aXR5Iiwib25BZnRlckFjdGlvbiIsImFjdGlvbkRlZmluaXRpb24iLCJhY3Rpb25EYXRhIiwia2V5cyIsInJlc3BvbnNlRGF0YSIsIm9kYXRhUmVxdWVzdCIsIm5hbWUiLCJjb2RlIiwibG9uZ3RleHRVcmwiLCJtZXNzYWdlIiwibnVtZXJpY1NldmVyaXR5IiwidGFyZ2V0IiwidHJhbnNpdGlvbiJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiUm9vdEVudGl0eS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1vY2tEYXRhQ29udHJpYnV0b3IgfSBmcm9tIFwiQHNhcC11eC91aTUtbWlkZGxld2FyZS1mZS1tb2Nrc2VydmVyXCI7XG5cbmNvbnN0IFJvb3RFbnRpdHk6IE1vY2tEYXRhQ29udHJpYnV0b3I8b2JqZWN0PiA9IHtcblx0YXN5bmMgb25BZnRlckFjdGlvbihhY3Rpb25EZWZpbml0aW9uLCBhY3Rpb25EYXRhLCBrZXlzLCByZXNwb25zZURhdGEsIG9kYXRhUmVxdWVzdCkge1xuXHRcdGlmIChhY3Rpb25EZWZpbml0aW9uLm5hbWUgPT09IFwiZHJhZnRQcmVwYXJlXCIpIHtcblx0XHRcdHJlc3BvbnNlRGF0YVtcIlNBUF9NZXNzYWdlXCJdID0gW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y29kZTogXCJ4eHh4XCIsXG5cdFx0XHRcdFx0bG9uZ3RleHRVcmw6IFwiXCIsXG5cdFx0XHRcdFx0bWVzc2FnZTogXCJQcmVwYXJlQWN0aW9uIG9uIFJvb3RFbnRpdHkgaGFzIGJlZW4gdHJpZ2dlcmVkXCIsXG5cdFx0XHRcdFx0bnVtZXJpY1NldmVyaXR5OiAyLFxuXHRcdFx0XHRcdHRhcmdldDogXCIvUm9vdEVudGl0eShJRD0xLElzQWN0aXZlRW50aXR5PWZhbHNlKS9UaXRsZVByb3BlcnR5XCIsXG5cdFx0XHRcdFx0dHJhbnNpdGlvbjogdHJ1ZVxuXHRcdFx0XHR9XG5cdFx0XHRdO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzcG9uc2VEYXRhO1xuXHR9XG59O1xuZXhwb3J0IGRlZmF1bHQgUm9vdEVudGl0eTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztFQUVBLE1BQU1BLFVBQXVDLEdBQUc7SUFDL0MsTUFBTUMsYUFBYUEsQ0FBQ0MsZ0JBQWdCLEVBQUVDLFVBQVUsRUFBRUMsSUFBSSxFQUFFQyxZQUFZLEVBQUVDLFlBQVksRUFBRTtNQUNuRixJQUFJSixnQkFBZ0IsQ0FBQ0ssSUFBSSxLQUFLLGNBQWMsRUFBRTtRQUM3Q0YsWUFBWSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQzdCO1VBQ0NHLElBQUksRUFBRSxNQUFNO1VBQ1pDLFdBQVcsRUFBRSxFQUFFO1VBQ2ZDLE9BQU8sRUFBRSxnREFBZ0Q7VUFDekRDLGVBQWUsRUFBRSxDQUFDO1VBQ2xCQyxNQUFNLEVBQUUsc0RBQXNEO1VBQzlEQyxVQUFVLEVBQUU7UUFDYixDQUFDLENBQ0Q7TUFDRjtNQUNBLE9BQU9SLFlBQVk7SUFDcEI7RUFDRCxDQUFDO0VBQUMsT0FDYUwsVUFBVTtBQUFBIiwiaWdub3JlTGlzdCI6W119