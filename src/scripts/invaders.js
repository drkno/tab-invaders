browser.browserAction.onClicked.addListener(tab => {
	browser.tabs.create({'url': browser.extension.getURL('src/index.html')});
});
