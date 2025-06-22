// The HighlightJSReady event must be fired when all code blocks are
// loaded and ready to be highlighted. This event is used to ensure
// that if other plugins populate code blocks after the page has
// loaded, they can trigger the Highlight.js initialization process.
document.addEventListener('HighlightJSReady', () => {
    // Ensure Highlight.js is loaded
    if (typeof hljs === 'undefined') {
        console.error('Error: Highlight.js not found.');
        return;
    }

    // Copy language class from inner <code> element to outer <pre> element
    Array.from(document.querySelectorAll('pre')).forEach(preElement => {
        // Ensure the <pre> element contains only a <code> element
        let codeElement = preElement.querySelector('code');
        // If the <code> has a class of the form language-*, add it to the <pre> element
        const languageClass = Array.from(codeElement.classList).find(cls => cls.startsWith('language-'));
        if (languageClass) {
            preElement.classList.add(languageClass);
        }
    });

    // Apply highlighting to all blocks
    hljs.highlightAll();
    // Dispatch custom event to trigger Highlight.js plugin logic
    document.dispatchEvent(new Event('HighlightJSLoaded'));
});
