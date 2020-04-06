export const storeData = (key, json) => {
    try {
        sessionStorage.setItem(key, JSON.stringify(json));
    } catch(e) {
        // do nothing
    }
};

export const getStoredData = (key) => {
    let data;
    try {
        data = JSON.parse(sessionStorage.getItem(key));
    } catch(e) {
        // do nothing
    }
    return data;
};

export const removeData = (key) => {
    try {
        sessionStorage.removeItem(key);
    } catch(e) {
        // do nothing
    }
};