/*
 license: The MIT License, Copyright (c) 2017 YUKI "Piro" Hiroshi
 original:
   http://github.com/piroor/webextensions-lib-tab-favicon-helper
*/
'use strict';

var TabFavIconHelper = {
  LAST_EFFECTIVE_FAVICON: 'last-effective-favIcon',
  VALID_FAVICON_PATTERN: /^(about|app|chrome|data|file|ftp|https?|moz-extension|resource):/,
  MAYBE_IMAGE_PATTERN: /\.(jpe?g|png|gif|bmp|svg)/i,

  effectiveFavIcons: new Map(),

  init() {
    this.onTabCreated = this.onTabCreated.bind(this);
    browser.tabs.onCreated.addListener(this.onTabCreated);

    this.onTabUpdated = this.onTabUpdated.bind(this);
    browser.tabs.onUpdated.addListener(this.onTabUpdated);

    this.onTabRemoved = this.onTabRemoved.bind(this);
    browser.tabs.onRemoved.addListener(this.onTabRemoved);

    this.onTabDetached = this.onTabDetached.bind(this);
    browser.tabs.onDetached.addListener(this.onTabDetached);

    window.addEventListener('unload', () => {
      browser.tabs.onCreated.removeListener(this.onTabCreated);
      browser.tabs.onUpdated.removeListener(this.onTabUpdated);
      browser.tabs.onRemoved.removeListener(this.onTabRemoved);
      browser.tabs.onDetached.removeListener(this.onTabDetached);
    }, { once: true });
  },

  loadToImage(aParams = {}) {
    this.getEffectiveURL(aParams.tab, aParams.url)
      .then(aURL => {
        aParams.image.src = aURL;
        aParams.image.classList.remove('error');
      },
      aError => {
        aParams.image.src = '';
        aParams.image.classList.add('error');
      });
  },

  maybeImageTab(aTab) {
    return aTab && 'url' in aTab && this.MAYBE_IMAGE_PATTERN.test(aTab.url);
  },

  getEffectiveURL(aTab, aURL = null) {
    return new Promise((aResolve, aReject) => {
      aURL = aURL || aTab.favIconUrl;
      if (!URL && this.maybeImageTab(aTab))
        aURL = aTab.url;

      var loader;
      var onLoad = (() => {
        var oldData = this.effectiveFavIcons.get(aTab.id);
        if (!oldData ||
            oldData.url != aTab.url ||
            oldData.favIconUrl != aURL) {
          let lastEffectiveFavicon = {
            url:        aTab.url,
            favIconUrl: aURL
          };
          this.effectiveFavIcons.set(aTab.id, lastEffectiveFavicon);
          browser.sessions &&
            browser.sessions.setTabValue &&
            browser.sessions.setTabValue(aTab.id, this.LAST_EFFECTIVE_FAVICON, lastEffectiveFavicon);
        }
        aResolve(aURL);
        clear();
      });
      var onError = (async (aError) => {
        clear();
        let effectiveFaviconData = this.effectiveFavIcons.get(aTab.id) ||
                                   (browser.sessions &&
                                    browser.sessions.setTabValue &&
                                    await browser.sessions.getTabValue(aTab.id, this.LAST_EFFECTIVE_FAVICON));
        if (effectiveFaviconData &&
            effectiveFaviconData.url == aTab.url &&
            aURL != effectiveFaviconData.favIconUrl) {
          this.getEffectiveURL(aTab, effectiveFaviconData.favIconUrl).then(aResolve, aReject);
        }
        else {
          aReject(aError || new Error('No effective icon'));
        }
      });
      var clear = (() => {
        if (loader) {
          loader.removeEventListener('load', onLoad, { once: true });
          loader.removeEventListener('error', onError, { once: true });
        }
        loader = onLoad = onError = undefined;
      });
      if (!aURL ||
          !this.VALID_FAVICON_PATTERN.test(aURL)) {
        onError();
        return;
      }
      loader = new Image();
      loader.addEventListener('load', onLoad, { once: true });
      loader.addEventListener('error', onError, { once: true });
      try {
        loader.src = aURL;
      }
      catch(e) {
        onError(e);
      }
    });
  },

  onTabCreated(aTab) {
    this.getEffectiveURL(aTab).catch(e => {});
  },

  onTabUpdated(aTabId, aChangeInfo, aTab) {
    if ('favIconUrl' in aChangeInfo ||
         TabFavIconHelper.maybeImageTab(aChangeInfo)) {
      this.getEffectiveURL(
        aTab,
        aChangeInfo.favIconUrl || aChangeInfo.url
      ).catch(e => {});
    }
  },

  onTabRemoved(aTabId, aRemoveInfo) {
    this.effectiveFavIcons.delete(aTabId);
  },

  onTabDetached(aTabId, aDetachInfo) {
    this.effectiveFavIcons.delete(aTabId);
  }
};
TabFavIconHelper.init();

export default TabFavIconHelper;
