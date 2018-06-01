import 'webextension-polyfill';
import TabFavIconHelper from '../util';
import TabIcon from '../../img/tab.png';

class TabImageLoader {
    constructor() {
        this._base = this._loadImage(TabIcon);
        this._tabs = this._queryTabs({ pinned: false });
        this._squareSize = 35;
    }

    _loadImage (url) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => reject(image);
            image.src = url;
        });
    }

    async _combineImages (baseImage, b) {
        const c = document.createElement('canvas');
        c.width = c.height = this._squareSize;
        const ctx = c.getContext('2d');
        ctx.drawImage(baseImage, 0, 0, this._squareSize, this._squareSize);
        if (b) {
            const quarter = this._squareSize / 4;
            const faviconImage = await this._loadImage(b);
            ctx.drawImage(faviconImage, quarter, 1.35 * quarter, 2 * quarter, 2 * quarter);
        }
        return c.toDataURL('image/png');
    }

    async _queryTabs (options) {
        return await browser.tabs.query(options);
    }

    async getImages() {
        const tabs = await this._tabs;
        const promises = [];
        for (let tab of tabs) {
            promises.push(new Promise(async(resolve) => {
                const base = await this._base;
                try {
                    const url = await TabFavIconHelper.getEffectiveURL(tab);
                    const img = await this._combineImages(base, url);
                    resolve(img);
                }
                catch (e) {
                    const img = await this._combineImages(base);
                    resolve(img);
                }
            }));
        }
        return await Promise.all(promises);
    }
}

export default TabImageLoader;
    