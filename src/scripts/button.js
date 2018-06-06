import browser from 'webextension-polyfill';
import IndexHtml from '../views/index.html';

export default () => {
	browser.browserAction.onClicked.addListener(tab => {
		browser.tabs.create({
			url: browser.extension.getURL(IndexHtml)
		});
	});
};