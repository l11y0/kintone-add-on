(function() {
    'use strict';

    const ERROR_MESSAGES = {
        ENCODING_REQUIRED: '請輸入編碼',
        ENCODING_LENGTH: '編碼長度必須為3',
        ENCODING_FORMAT: '編碼第一碼必須為大寫英文字母',
        SERIAL_REQUIRED: '請輸入序號',
        SERIAL_LENGTH: '序號長度必須為3',
        CODE_DUPLICATE: '代碼有重複，請使用其他序號'
    };

    let allCodesWithId = [];

    function checkCode(codeObj, currentCode) {
        return codeObj.code === currentCode;
    }

    function checkEncoding(encoding) {
        const firstLetter = encoding.charAt(0);
        return firstLetter.match(/^[A-Z]+$/);
    }

    function validateFields(record) {
        if (!record.編碼.value) {
            return { isValid: false, message: ERROR_MESSAGES.ENCODING_REQUIRED };
        }
        if (record.編碼.value.length !== 3) {
            return { isValid: false, message: ERROR_MESSAGES.ENCODING_LENGTH };
        }
        if (!checkEncoding(record.編碼.value)) {
            return { isValid: false, message: ERROR_MESSAGES.ENCODING_FORMAT };
        }


        if (!record.序號.value) {
            return { isValid: false, message: ERROR_MESSAGES.SERIAL_REQUIRED };
        }
        if (record.序號.value.length !== 3) {
            return { isValid: false, message: ERROR_MESSAGES.SERIAL_LENGTH };
        }


        const currentId = record.$id ? record.$id.value : null;
        const codes = currentId 
            ? allCodesWithId.filter(item => item.id !== currentId)
            : allCodesWithId;
        
        if (codes.find(code => checkCode(code, record.代碼.value))) {
            return { isValid: false, message: ERROR_MESSAGES.CODE_DUPLICATE };
        }

        return { isValid: true };
    }


    function updateSpaceMessage(elementId, message, isError = false) {
        const element = kintone.app.record.getSpaceElement(elementId);
        if (!element) {
            console.error(`找不到 ${elementId} 欄位`);
            return false;
        }


        element.innerHTML = '';
        

        const messageDiv = document.createElement('div');
        messageDiv.style.color = isError ? '#e74c3c' : '#27ae60';
        messageDiv.style.fontWeight = 'bold';
        messageDiv.style.padding = '4px 0';
        messageDiv.textContent = message;
        

        element.appendChild(messageDiv);

        return true;
    }


    kintone.events.on(['app.record.create.show', 'app.record.edit.show', 'app.record.index.show'], async (event) => {
        try {
            const resp = await kintone.api(kintone.api.url('/k/v1/records', true), 'GET', {
                app: kintone.app.getId(),
                query: '',
                fields: ['代碼', '$id']
            });

            allCodesWithId = resp.records.map(record => ({
                code: record.代碼.value,
                id: record.$id.value
            }));

            console.log('已載入所有代碼：', allCodesWithId);
            return event;
        } catch (error) {
            console.error('載入代碼時發生錯誤：', error);
            return event;
        }
    });


    kintone.events.on(['app.record.create.change.代碼', 'app.record.create.change.序號'], (event) => {

        if (!event.record.代碼.value || !event.record.序號.value) {
            updateSpaceMessage('checkMsg_2', '');
            return event;
        }

        const currentCode = event.record.代碼.value;
        const isDuplicate = allCodesWithId.find(code => checkCode(code, currentCode));
        const isLengthValid = event.record.序號.value.length === 3;


        if (!isDuplicate && isLengthValid) {
            updateSpaceMessage('checkMsg_2', '✔️序號可以使用', false);
        } else {
            if (isDuplicate) {
                updateSpaceMessage('checkMsg_2', '❌' + ERROR_MESSAGES.CODE_DUPLICATE, true);
            } else if (!isLengthValid) {
                updateSpaceMessage('checkMsg_2', '❌' + ERROR_MESSAGES.SERIAL_LENGTH, true);
            }
        }

        return event;
    });


    kintone.events.on(['app.record.edit.show','app.record.edit.change.代碼', 'app.record.edit.change.序號'], (event) => {

        if (!event.record.代碼.value || !event.record.序號.value) {
            updateSpaceMessage('checkMsg_2', '');
            return event;
        }

        const currentCode = event.record.代碼.value;
        const currentId = event.record.$id.value;
        const otherCodes = allCodesWithId.filter(item => item.id !== currentId);
        const isDuplicate = otherCodes.find(code => checkCode(code, currentCode));
        const isLengthValid = event.record.序號.value.length === 3;


        if (!isDuplicate && isLengthValid) {
            updateSpaceMessage('checkMsg_2', '✔️序號可以使用', false);
        } else {
            if (isDuplicate) {
                updateSpaceMessage('checkMsg_2', '❌' + ERROR_MESSAGES.CODE_DUPLICATE, true);
            } else if (!isLengthValid) {
                updateSpaceMessage('checkMsg_2', '❌' + ERROR_MESSAGES.SERIAL_LENGTH, true);
            }
        }

        return event;
    });


    kintone.events.on(['app.record.create.change.編碼', 'app.record.edit.change.編碼'], (event) => {

        if (!event.record.編碼.value) {
            updateSpaceMessage('checkMsg_1', '');
            return event;
        }

        const value = event.record.編碼.value;
        const isLengthValid = value.length === 3;
        const isFormatValid = checkEncoding(value);


        if (isLengthValid && isFormatValid) {
            updateSpaceMessage('checkMsg_1', '✔️編碼可以使用', false);
        } else {
            if (!isLengthValid) {
                updateSpaceMessage('checkMsg_1', '❌' + ERROR_MESSAGES.ENCODING_LENGTH, true);
            } else if (!isFormatValid) {
                updateSpaceMessage('checkMsg_1', '❌' + ERROR_MESSAGES.ENCODING_FORMAT, true);
            }
        }

        return event;
    });


    kintone.events.on(['app.record.create.submit', 'app.record.edit.submit'], (event) => {
        const validation = validateFields(event.record);
        if (!validation.isValid) {
            event.error = validation.message;
            return event;
        }
        return event;
    });

    initEvents();
})();
