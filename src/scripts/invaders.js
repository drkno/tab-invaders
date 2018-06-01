import 'webextension-polyfill';
import IndexHtml from '../views/index.html';

browser.browserAction.onClicked.addListener(tab => {
	browser.tabs.create({
		url: browser.extension.getURL(IndexHtml)
	});
});
