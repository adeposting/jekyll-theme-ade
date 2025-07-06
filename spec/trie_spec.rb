require 'spec_helper'

RSpec.describe Jekyll::Trie do
  let(:data) do
    [
      { 'keywords' => ['apple', 'apricot'], 'value' => 1 },
      { 'keywords' => ['banana'], 'value' => 2 },
      { 'keywords' => ['apex'], 'value' => 3 }
    ]
  end
  let(:trie) { Jekyll::Trie.new(data, 'keywords') }

  it 'inserts and finds words correctly' do
    hash = trie.to_h
    expect(hash['children'].keys).to include('a', 'b')
    expect(hash['children']['a']['children'].keys).to include('p')
    expect(hash['children']['b']['children'].keys).to include('a')
  end

  it 'stores results for each word' do
    hash = trie.to_h
    apple_results = hash['children']['a']['children']['p']['children']['p']['children']['l']['children']['e']['results']
    expect(apple_results).to include(data[0])
    banana_results = hash['children']['b']['children']['a']['children']['n']['children']['a']['children']['n']['children']['a']['results']
    expect(banana_results).to include(data[1])
  end

  it 'marks end of word correctly' do
    node = trie.instance_variable_get(:@root)
    'apple'.each_char do |char|
      node = node.children[char]
    end
    expect(node.is_end_of_word).to be true
  end
end 