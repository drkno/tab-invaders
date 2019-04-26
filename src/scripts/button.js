import browser from 'webextension-polyfill';
import GameHtml from '../views/game.html';

browser.browserAction.onClicked.addListener(tab => {
	browser.tabs.create({
		url: browser.extension.getURL(GameHtml)
	});
});
