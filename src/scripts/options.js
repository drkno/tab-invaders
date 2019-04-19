import browser from 'webextension-polyfill';

export const updateSetting = async(name, value) => {
    const val = {};
    val[name] = value;
    await browser.storage.sync.set(val);
    return value;
};

export const getSetting = async(name, def) => {
    const storage = await browser.storage.sync.get(name);
    const value = storage[name];
    if (value === void(0) && def !== void(0)) {
        return await updateSetting(name, def);
    }
    return value;
};

export default () => {
    document.addEventListener('DOMContentLoaded', async() => {
        const autoCloseCheckbox = document.getElementById('autoCloseOnComplete');

        autoCloseCheckbox.checked = await getSetting('autoCloseOnComplete', true);
        autoCloseCheckbox.addEventListener('click', () => {
            updateSetting('autoCloseOnComplete', autoCloseCheckbox.checked);
        });
        
        document.getElementById('highScore').innerText = await getSetting('highScore', 0);
    });
};
