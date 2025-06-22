/*

Example:

'''python
'''
{: data-src='script.py' data-ln-start-from='3' data-ln-end-at='10' }

*/

document.addEventListener('DOMContentLoaded', async () => {
    // Ensure Highlight.js is loaded
    if (typeof hljs === 'undefined') {
        console.error('Error: Highlight.js not found.');
        return;
    }

    // Step 1: Fetch and populate code blocks
    const fetchPromises = Array.from(document.querySelectorAll('pre[data-src]')).map(async (preElement) => {
        const src = preElement.getAttribute('data-src');

        // If data-src is a relative path, we need to resolve it 
        // relative to the actual page path itself

        if (src.startsWith('./') || src.startsWith('../')) {
            const pagePath = jekyll['page']['path'].replace(/^_/g, '\/');
            src = new URL("file://" + pagePath + "/" + src).pathname
        }

        const ln_start_from = preElement.hasAttribute('data-ln-start-from') ? parseInt(preElement.getAttribute('data-ln-start-from'), 10) : 1;
        const ln_end_at = preElement.hasAttribute('data-ln-end-at') ? parseInt(preElement.getAttribute('data-ln-end-at'), 10) : null;

        try {
            const response = await fetch(src);
            const rawTextContent = await response.text();
            const lines = rawTextContent.split('\n');
            const index_start_from = ln_start_from - 1;
            const index_end_at = ln_end_at ? ln_end_at : lines.length;
            const textContent = lines.slice(index_start_from, index_end_at).join('\n');

            // Ensure the <pre> element contains only a <code> element
            let codeElement = preElement.querySelector('code');

            // Set the text content of the <code> block
            codeElement.textContent = textContent;

            // If the <code> has a class of the form language-*, add it to the <pre> element
            const languageClass = Array.from(codeElement.classList).find(cls => cls.startsWith('language-'));
            if (languageClass) {
                preElement.classList.add(languageClass);
            }

        } catch (err) {
            console.error(`Error: Failed to fetch data from ${src}, ${err.message}`);
        }
    });

    // Wait for all fetches to complete
    await Promise.all(fetchPromises);

    // Dispatch custom event to trigger Highlight.js logic
    document.dispatchEvent(new Event('HighlightJSReady'));
});
