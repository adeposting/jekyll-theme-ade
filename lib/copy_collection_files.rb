require 'fileutils'
require 'jekyll'

module Jekyll
  class CopyCollectionFiles < Generator
    safe true
    priority :lowest

    def initialize(config = {})
      super(config)
    end

    def generate(site)
      site.collections.each do |name, collection|
        next unless collection.metadata['copy']

        source_dir = File.join(site.source, "_#{name}")
        dest_dir = File.join(site.dest, name)

        if Dir.exist?(source_dir)
          FileUtils.mkdir_p(dest_dir)
          raise "Failed to create directory: #{dest_dir}" unless Dir.exist?(dest_dir)

          files_to_copy = get_tracked_and_unignored_files(source_dir) + get_markdown_files(source_dir)
          files_to_copy.each do |file|
            dest_file = File.join(dest_dir, file.sub(source_dir + '/', ''))
            FileUtils.mkdir_p(File.dirname(dest_file))
            raise "Failed to create directory: #{File.dirname(dest_file)}" unless Dir.exist?(File.dirname(dest_file))

            FileUtils.cp(file, dest_file)
            raise "Failed to copy file: #{file} -> #{dest_file}" unless File.exist?(dest_file)
          end
        else
        end

        update_links(site, name)
      end
    end

    def get_tracked_and_unignored_files(directory)
      Dir.chdir(directory) do
        files = `git ls-files --others --exclude-standard --cached`.split("\n").map { |f| File.join(directory, f) }
        files
      end
    end

    def get_markdown_files(directory)
      files = Dir.glob(File.join(directory, "**", "*.md"))
      files
    end

    def update_links(site, collection_name)
      site.collections[collection_name].docs.each do |doc|
        next unless doc.extname == ".md"

        content = doc.content
        doc_path = File.dirname(doc.relative_path)
        updated_content = content.gsub(/\!\[([^\]]*)\]\((\.\/[^)]+)\)/) do |match|
          alt_text = $1
          relative_path = $2
          absolute_path = File.join('/', collection_name, doc_path, relative_path).gsub(/\\/, '/')
          "![#{alt_text}](#{absolute_path})"
        end

        doc.content = updated_content
      end
    end
  end
end

Jekyll::Hooks.register :site, :post_write do |site|
  Jekyll::CopyCollectionFiles.new.generate(site)
end