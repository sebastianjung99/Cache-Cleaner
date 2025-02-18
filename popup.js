document.addEventListener("DOMContentLoaded", () => {
    const toggleSwitch = document.getElementById("toggleSwitch");

    // Load saved state
    chrome.storage.local.get(["cacheCleanerEnabled"], (result) => {
        toggleSwitch.checked = result.cacheCleanerEnabled ?? true; // Default: enabled
    });

    // Toggle state on change
    toggleSwitch.addEventListener("change", () => {
        chrome.storage.local.set({ cacheCleanerEnabled: toggleSwitch.checked });
    });
});
