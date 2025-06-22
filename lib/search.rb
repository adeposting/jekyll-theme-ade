require 'json'
require_relative 'trie'
require_relative 'keywords'

module Jekyll
  class Search 
    def self.index(site)
      docs = site.posts.docs + site.collections.map { |name, collection| collection.docs }.flatten
      docs.map do |doc|
        {
          "textContent" => doc.data["title"],
          "href" => doc.url,
          "words" => Keywords.tokenize(doc)
        }
      end
    end
  end

  Jekyll::Hooks.register :site, :post_write do |site|
    index = Search.index(site)
    trie = Trie.new(index, "words").to_h
    json_data = JSON.generate(trie, max_nesting: 1000)
    file_path = File.join(site.dest, "search.json")
    File.write(file_path, json_data)
  end
end
