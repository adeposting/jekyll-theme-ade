require 'json'

module Jekyll
  module ToJsonFilter
    def to_json(input)
      JSON.pretty_generate(input)
    end
  end
end

Liquid::Template.register_filter(Jekyll::ToJsonFilter)