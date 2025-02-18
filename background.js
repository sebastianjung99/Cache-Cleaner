let lastCacheClearTime = 0; // Speichert den letzten Löschzeitpunkt

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "loading" && tab.url) {
        chrome.storage.local.get(["cacheCleanerEnabled"], (result) => {
            if (!result.cacheCleanerEnabled) {
                console.log("[Cache Cleaner] - Skipped cache clear (disabled)");
                return;
            }

            const allowedDomains = [
                "duplicates.crm4.dynamics.com",
                "propad.crm4.dynamics.com"
            ];

            try {
                const url = new URL(tab.url);
                if (allowedDomains.includes(url.hostname)) {
                    const now = Date.now();
                    if (now - lastCacheClearTime < 5000) {
                        console.log("[Cache Cleaner] - Skipping cache clear (timeout active)");
                        return;
                    }

                    lastCacheClearTime = now;

                    chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        func: clearCacheOnce
                    }).then(() => {
                        console.log("[Cache Cleaner] - Cleared Cache storage 'WebResource' on tab", tabId);
                    }).catch((error) => {
                        console.error("[Cache Cleaner] - Error executing script:", error);
                    });
                }
            } catch (e) {
                console.error("Invalid URL:", tab.url, e);
            }
        });
    }
});

function clearCacheOnce() {
    caches.delete("WebResources").then(() => {
        console.log("[Cache Cleaner] - Cache cleared");
        location.reload();
    });
}
