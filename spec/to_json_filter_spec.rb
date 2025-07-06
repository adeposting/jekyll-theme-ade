require 'spec_helper'

RSpec.describe Jekyll::ToJsonFilter do
  include Jekyll::ToJsonFilter

  it 'converts a hash to pretty JSON' do
    input = { 'foo' => 'bar', 'baz' => [1, 2, 3] }
    json = to_json(input)
    expect(json).to include('foo')
    expect(json).to include('bar')
    expect(json).to include('baz')
    expect(json).to include('    1,')
  end
end 