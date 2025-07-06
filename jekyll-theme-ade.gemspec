# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "jekyll-theme-ade"
  spec.version       = "0.1.0"
  spec.authors       = ["ade"]
  spec.email         = ["217110652+adeposting@users.noreply.github.com"]

  spec.summary       = "Jekyll theme for adeposting.github.io."
  spec.homepage      = "https://github.com/adeposting/jekyll-theme-ade"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r!^(assets|_data|_layouts|_includes|_sass|lib|LICENSE|README|_config\.yml)!i) }

  spec.add_runtime_dependency "jekyll", "~> 4.3"
  spec.add_runtime_dependency "nokogiri", "~> 1.12"

  spec.add_development_dependency 'rspec'

  spec.metadata["jekyll-theme"] = "true"
end
