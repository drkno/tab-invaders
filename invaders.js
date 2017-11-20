chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({'url': chrome.extension.getURL('SpaceInvaders/index.html')}, function(tab) {
    // Tab opened.
  });
});
