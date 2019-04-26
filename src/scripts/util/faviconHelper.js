/*
    Adapted from http://github.com/piroor/webextensions-lib-tab-favicon-helper
    MIT License, Copyright (c) 2017 YUKI "Piro" Hiroshi   
*/
'use strict';
import browser from 'webextension-polyfill';

class TabFavIconHelper {
    LAST_EFFECTIVE_FAVICON = 'last-effective-favIcon';
    effectiveFavIcons = new Map();

    constructor() {
        this.onTabCreated = this.onTabCreated.bind(this);
        this.onTabUpdated = this.onTabUpdated.bind(this);
        this.onTabRemoved = this.onTabRemoved.bind(this);
        this.onTabDetached = this.onTabDetached.bind(this);

        browser.tabs.onCreated.addListener(this.onTabCreated);
        browser.tabs.onUpdated.addListener(this.onTabUpdated);
        browser.tabs.onRemoved.addListener(this.onTabRemoved);
        browser.tabs.onDetached.addListener(this.onTabDetached);

        window.addEventListener('unload', () => {
            browser.tabs.onCreated.removeListener(this.onTabCreated);
            browser.tabs.onUpdated.removeListener(this.onTabUpdated);
            browser.tabs.onRemoved.removeListener(this.onTabRemoved);
            browser.tabs.onDetached.removeListener(this.onTabDetached);
        }, { once: true });
    }

    async loadToImage(aParams = {}) {
        try {
            aParams.image.src = await this.getEffectiveURL(aParams.tab, aParams.url);
            aParams.image.classList.remove('error');
        }
        catch (e) {
            aParams.image.src = '';
            aParams.image.classList.add('error');
        }
    }

    maybeImageTab(aTab) {
        return aTab && 'url' in aTab && /\.(jpe?g|png|gif|bmp|svg)/i.test(aTab.url);
    }

    async getEffectiveURL(aTab, aURL = null) {
        if (!aURL) {
            if (!aTab.favIconUrl && this.maybeImageTab(aTab)) {
                aURL = aTab.url;
            }
            else {
                aURL = aTab.favIconUrl;
            }
        }

        try {
            if (!aURL || !/^(about|app|chrome|data|file|ftp|https?|moz-extension|resource):/.test(aURL)) {
                throw new Error('No effective icon');
            }

            await new Promise((resolve, reject) => {
                const loader = new Image();
                loader.addEventListener('load', resolve, { once: true });
                loader.addEventListener('error', reject, { once: true });
                loader.src = aURL;
            });

            const oldData = this.effectiveFavIcons.get(aTab.id);
            if (!oldData || oldData.url != aTab.url || oldData.favIconUrl != aURL) {
                const lastEffectiveFavicon = {
                    url: aTab.url,
                    favIconUrl: aURL
                };
                this.effectiveFavIcons.set(aTab.id, lastEffectiveFavicon);
                if (browser.sessions && browser.sessions.setTabValue) {
                    browser.sessions.setTabValue(aTab.id, this.LAST_EFFECTIVE_FAVICON, lastEffectiveFavicon);
                }               
            }
            return aURL;
        }
        catch (e) {
            let effectiveFaviconData = this.effectiveFavIcons.get(aTab.id);
            if (!effectiveFaviconData && browser.sessions && browser.sessions.getTabValue) {
                effectiveFaviconData = await browser.sessions.getTabValue(aTab.id, this.LAST_EFFECTIVE_FAVICON);
            }
            if (effectiveFaviconData && effectiveFaviconData.url == aTab.url && aURL != effectiveFaviconData.favIconUrl) {
                return await this.getEffectiveURL(aTab, effectiveFaviconData.favIconUrl);
            }
            else {
                throw (e || new Error('No effective icon'));
            }
        }
    }
    
    async onTabCreated(aTab) {
        try {
            await this.getEffectiveURL(aTab);
        }
        catch (e) {
            // do nothing
        }
    }

    async onTabUpdated(aTabId, aChangeInfo, aTab) {
        if ('favIconUrl' in aChangeInfo || this.maybeImageTab(aChangeInfo)) {
            try {
                await this.getEffectiveURL(aTab, aChangeInfo.favIconUrl || aChangeInfo.url);
            }
            catch (e) {
                // do nothing, fallback to existing icon
            }
        }
    }
    
    onTabRemoved(aTabId, aRemoveInfo) {
        this.effectiveFavIcons.delete(aTabId);
    }

    onTabDetached(aTabId, aDetachInfo) {
        this.effectiveFavIcons.delete(aTabId);
    }
}

const instance = new TabFavIconHelper();
export default instance;
