const updateSetting = (name, value) => {
    const val = {};
    val[name] = val;
    chrome.storage.sync.set(val, () => {});
};

const getSetting = (name, callback) => {
    chrome.storage.sync.get(name, callback);
};

document.addEventListener('DOMContentLoaded', () => {
    getSetting('autoClose', autoClose => {
        document.getElementById('autoCloseOnComplete').checked =
            typeof(autoClose) === 'boolean' ? autoClose : true;
    });
    getSetting('highScore', highScore => {
        document.getElementById('highScore').innerText = highScore || '0';
    });
});


