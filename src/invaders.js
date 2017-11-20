chrome.browserAction.onClicked.addListener(tab => {
	chrome.tabs.create({'url': chrome.extension.getURL('src/index.html')}, tab => {});
});
