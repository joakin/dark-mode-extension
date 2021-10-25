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
  let bg = window.__extension__darkmode_html_bg || html.style.backgroundColor;
  let style = document.querySelector("#__darkmode_styles");

  if (!style) {
    style = document.createElement("style");
    style.id = "__darkmode_styles";
    style.innerHTML = `
html.dark-mode-enabled {
  filter: hue-rotate(180deg) contrast(0.95) saturate(0.95) invert(0.90);
}

html.dark-mode-enabled img,
html.dark-mode-enabled [style*="background-image:"] {
  filter: invert(1) hue-rotate(180deg);
}
    `;
    document.body.appendChild(style);
  }

  if (!!window.__extension__darkmode) {
    html.classList.remove("dark-mode-enabled");
    html.style.backgroundColor = bg;
    window.__extension__darkmode = false;
  } else {
    html.classList.add("dark-mode-enabled");
    html.style.backgroundColor = "#fff";
    window.__extension__darkmode = true;
  }

  return window.__extension__darkmode;
}
