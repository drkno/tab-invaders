import browser from 'webextension-polyfill';

export default () => {
    const updateSetting = async(name, value) => {
        const val = {};
        val[name] = val;
        await browser.storage.sync.set(val);
    };

    document.addEventListener('DOMContentLoaded', async() => {
        const autoClose = await browser.storage.sync.get('autoCloseOnComplete');
        const autoCloseCheckbox = document.getElementById('autoCloseOnComplete');

        autoCloseCheckbox.checked = typeof(autoClose) === 'boolean' ? autoClose : true;
        autoCloseCheckbox.addEventListener('onclick', () => {
            updateSetting('autoCloseOnComplete', autoCloseCheckbox.checked);
        });
        
        const highScore = await browser.storage.sync.get('highScore');
        document.getElementById('highScore').innerText = highScore || '0';
    });
};
