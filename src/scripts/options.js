import 'webextension-polyfill';

const updateSetting = async(name, value) => {
    const val = {};
    val[name] = val;
    await browser.storage.sync.set(val);
};

document.addEventListener('DOMContentLoaded', async() => {
    const autoClose = await browser.storage.sync.get('autoCloseOnComplete');
    document.getElementById('autoCloseOnComplete').checked =
        typeof(autoClose) === 'boolean' ? autoClose : true;
    
    const highScore = await browser.storage.sync.get('highScore');
    document.getElementById('highScore').innerText = highScore || '0';
});
