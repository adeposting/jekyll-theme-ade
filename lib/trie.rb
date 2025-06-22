module Jekyll

class TrieNode
    attr_accessor :children, :results, :is_end_of_word

    def initialize
        @children = {}
        @results = []
        @is_end_of_word = false
    end
end

class Trie
    def initialize(data, key)
        @root = TrieNode.new
        data.each do |entry|
            entry[key].each do |word|
                insert(word, entry)
            end
        end
    end

    def insert(word, entry)
        node = @root
        word.downcase.each_char do |char|
            node.children[char] ||= TrieNode.new
            node = node.children[char]
            node.results << entry
        end
        node.is_end_of_word = true
    end

    def to_h(node = @root)
        {
            "children" => node.children.transform_values { |child| to_h(child) },
            "results" => node.results.uniq
        }
    end
end

end
