require 'rspec'
require_relative '../lib/jekyll-theme-ade'

RSpec.configure do |config|
  # Enable flags like --only-failures and --next-failure
  config.example_status_persistence_file_path = ".rspec_status"
  # Disable RSpec exposing methods globally on `Module` and `main`
  config.disable_monkey_patching!
  # Use the documentation formatter for detailed output,
  # unless a formatter has already been configured
  config.default_formatter = "doc" if config.files_to_run.one?
end 