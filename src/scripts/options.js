import browser from 'webextension-polyfill';

const updateSetting = async(name, value) => {
    const val = {};
    val[name] = value;
    return await browser.storage.sync.set(val);
};

const getSetting = async(name) => {
    const value = await browser.storage.sync.get(name);
    return value[name];
};

export default () => {
    document.addEventListener('DOMContentLoaded', async() => {
        const autoClose = await getSetting('autoCloseOnComplete');
        const autoCloseCheckbox = document.getElementById('autoCloseOnComplete');

        autoCloseCheckbox.checked = typeof(autoClose) === 'boolean' ? autoClose : true;
        autoCloseCheckbox.addEventListener('click', () => {
            updateSetting('autoCloseOnComplete', autoCloseCheckbox.checked);
        });
        
        const highScore = await getSetting('highScore');
        document.getElementById('highScore').innerText = highScore || '0';
    });
};

export { updateSetting, getSetting };
