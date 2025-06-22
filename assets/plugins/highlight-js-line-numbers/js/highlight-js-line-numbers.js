// The HighlightJSLoaded event is triggered once all initialization
// has been completed by Highlight.js. This can be used by Highlight.js
// plugins to ensure they are initialized in the right order.
document.addEventListener('HighlightJSLoaded', () => {
    // Ensure Highlight.js is loaded
    if (typeof hljs === 'undefined') {
        console.error('Error: Highlight.js not found.');
        return;
    }
    // Apply line numbers after highlighting
    hljs.initLineNumbersOnLoad();
});
