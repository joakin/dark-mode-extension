chrome.action.onClicked.addListener(function (tab) {
  let tabId = tab.id;
  chrome.scripting.executeScript(
    {
      target: { tabId, allFrames: true },
      function: enableDarkMode,
      args: [tabId],
    },
    function (results) {
      if (chrome.runtime.lastError) {
        console.error(
          "executeScript failed:" + chrome.runtime.lastError.message
        );
        chrome.notifications.create("informative-message", {
          type: "basic",
          iconUrl: chrome.runtime.getURL("/images/icon.png"),
          title: "Dark mode failed",
          message: "Something went wrong!",
        });
        return;
      }
      if (!results || results.length === 0) {
        return;
      }
      let result = results[0].result;
      chrome.action.setBadgeText({
        tabId,
        text: result ? "on" : "",
      });
    }
  );
});

function enableDarkMode(tabId) {
  let html = document.documentElement;
  console.log(html);

  if (!!window.__extension__darkmode) {
    html.style.filter = "";
    window.__extension__darkmode = false;
  } else {
    html.style.filter =
      "hue-rotate(180deg) contrast(0.95) saturate(0.95) invert(0.90)";
    window.__extension__darkmode = true;
  }

  console.log(html.style.filter);
  console.log(window.__extension__darkmode);
  return window.__extension__darkmode;
}
