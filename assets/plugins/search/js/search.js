document.addEventListener("DOMContentLoaded", function () {
  let trie = {};

  // Load the prebuilt Trie JSON
  fetch("/search.json")
    .then(response => response.json())
    .then(data => {
      trie = data;
    })
    .catch(error => console.error("Error:", error));


  // Function to search the Trie
  function searchTrie(prefix) {
    let node = trie;
    for (const char of prefix) {
      if (!node.children[char]) {
        return []; // No matches
      }
      node = node.children[char];
    }
    return node.results || [];
  }

  const searchButton = document.getElementById('search-button');

  const searchInput = document.getElementById('search-input');
  const searchInputContent = document.getElementById('search-input-content');

  const searchOutputContainer = document.getElementById("search-output-container");
  const searchOutputList = document.createElement("ul");
  searchOutputContainer.appendChild(searchOutputList);

  const clearSearchOutput = function () {
    searchOutputList.innerHTML = "";
  }

  const isSearchOutputHidden = function () {
    return searchOutputContainer.classList.contains('hidden');
  }

  const showSearchOutput = function () {
    if (isSearchOutputHidden()) {
      searchOutputContainer.classList.remove('hidden');
    }
  }

  const hideSearchOutput = function () {
    if (!isSearchOutputHidden()) {
      clearSearchOutput();
      searchOutputContainer.classList.add('hidden');
    }
  }

  const isSearchInputHidden = function () {
    return searchInput.classList.contains('hidden');
  }

  const showSearchInput = function () {
    if (isSearchInputHidden()) {
      searchInput.classList.remove('hidden');
      searchInputContent.classList.add('hidden');
      searchInput.focus();
    } 
  }
  
  const hideSearchInput = function() {
    if (!isSearchInputHidden()) {
      searchInput.classList.add('hidden');
      searchInputContent.classList.remove('hidden');
      hideSearchOutput();
    }
  }

  const toggleSearchInput = function () {
    if (isSearchInputHidden()) {
      showSearchInput();
    } else {
      hideSearchInput();
    }
  }

  // Event listener for search input
  searchInput.addEventListener("input", function () {
    const query = this.value.toLowerCase().trim();

    if (query.length === 0) {
      hideSearchOutput();
      return;
    } 

    clearSearchOutput();
    
    showSearchOutput();
    
    // Get matching results from Trie
    const results = searchTrie(query);

    if (results.length === 0) {
      hideSearchOutput();
      return;
    }

    // Display results
    results.forEach(result => {
      const searchOutputItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = result.href;
      link.textContent = result.textContent;
      searchOutputItem.appendChild(link);
      searchOutputList.appendChild(searchOutputItem);
    });
  });

  document.addEventListener('click', function (event) {
    if (searchInput.contains(event.target)) {
      return;
    } else if (searchButton.contains(event.target)) {
      toggleSearchInput();
    } else {
      hideSearchInput();
    }

  });
});