(function() {
  'use strict';
  
  const ERROR_MESSAGES = {
    INVALID_DATE: "請填寫從下個月開始的1號日期（例如：今天是3月，請填寫4月1日、5月1日等，不能填寫3月1日或之前的日期）",
    SIMPLE_ERROR: "請依照規定填寫"
  };
  
  const DEBUG = false;
  let isFit = true;
  
  function debug(message) {
    if (DEBUG) {
      console.log(message);
    }
  }
  
  function isValidEffectDate(effectDateValue) {
    if (!effectDateValue) return false;
    
    try {
      const date = new Date(effectDateValue);
      const now = new Date();
      
      if (isNaN(date.getTime())) return false;
      
      const monthOfEffectDate = date.getMonth() + 1;
      const yearOfEffectDate = date.getFullYear();
      const dayOfEffectDate = date.getDate();
      
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      
      return (
        (yearOfEffectDate > year && dayOfEffectDate === 1) ||
        (yearOfEffectDate === year && monthOfEffectDate > month && dayOfEffectDate === 1)
      );
    } catch (error) {
      debug('日期驗證錯誤: ' + error);
      return false;
    }
  }
  
  kintone.events.on("app.record.index.show", (event) => {
    return event;
  });
  
  kintone.events.on(
    [
      "app.record.create.change.預計生效日",
      "mobile.app.record.create.change.預計生效日",
      "app.record.edit.change.預計生效日",
      "mobile.app.record.edit.change.預計生效日",
    ],
    (event) => {
      event.record.預計生效日.error = null;

      if (isValidEffectDate(event.record.預計生效日.value)) {
        isFit = true;
        return event;
      } else {
        debug(event);
        event.record.預計生效日.error = ERROR_MESSAGES.SIMPLE_ERROR;
        isFit = false;
        return event;
      }
    },
  );
  
  
  kintone.events.on(
    [
      "app.record.create.submit",
      "mobile.app.record.create.submit",
      "app.record.edit.submit",
      "mobile.app.record.edit.submit",
    ],
    (event) => {
      if (!isFit) {
        event.record.預計生效日.error = ERROR_MESSAGES.INVALID_DATE;
        event.preventDefault();
        return event;
      }
      return event;
    },
  );
})();
