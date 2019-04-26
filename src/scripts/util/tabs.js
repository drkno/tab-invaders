import browser from 'webextension-polyfill';
import settings from './settings';

const queryTabs = async() => {
    const tabs = await browser.tabs.query({ pinned: (await settings.ignorePinnedTabs() ? false : void(0)) });
    const tab = await browser.tabs.getCurrent();
    const id = tabs.findIndex(t => t.id === tab.id);
    tabs.splice(id, 1);
    return tabs;
};

export default queryTabs;
