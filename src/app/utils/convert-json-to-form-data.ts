export function convertJsonToFormData(jsonObject: any, parentKey: any, carryFormData: FormData | null): FormData {

    const formData = carryFormData || new FormData();
    let index = 0;

    for (var key in jsonObject) {
        if (jsonObject.hasOwnProperty(key)) {
            if (jsonObject[key]) {
                var propName = parentKey || key;

                if (parentKey && isObject(jsonObject))
                    propName = parentKey + '[' + key + ']';


                if (parentKey && isArray(jsonObject))
                    propName = parentKey + '[' + index + ']';

                if (jsonObject[key] instanceof File) {
                    formData.append(parentKey, jsonObject[key]);
                } else if (jsonObject[key] instanceof FileList) {
                    for (var j = 0; j < jsonObject[key].length; j++) {
                        formData.append(propName + '[' + j + ']', jsonObject[key].item(j));
                    }
                } else if (
                    (isArray(jsonObject[key]) || isObject(jsonObject[key]))
                    && Object.prototype.toString.call(jsonObject[key]) !== '[object Date]'
                ) {
                    convertJsonToFormData(jsonObject[key], propName, formData);
                } else if (typeof jsonObject[key] === 'boolean') {
                    formData.append(propName, +jsonObject[key] ? '1' : '0');
                } else {
                    if (Object.prototype.toString.call(jsonObject[key]) === '[object Date]' && jsonObject[key])
                        jsonObject[key] = jsonObject[key].toDateString();
                    formData.append(propName, jsonObject[key]);
                }
            }
        }
        index++;
    }

    return formData;
}

function isArray(val: any) {
    const toString = ({}).toString;
    return toString.call(val) === '[object Array]';
}

function isObject(val: any) {
    return !isArray(val) && typeof val === 'object' && !!val;
}