# frozen_string_literal: true

module Jekyll
  module QueryTag
    # A helper class to encapsulate the query logic
    class Query
      attr_accessor :pages,
                    :years,
                    :months,
                    :days,
                    :categories,
                    :tags,
                    :order_by,
                    :order,
                    :limit,
                    :offset,
                    :group_by,
                    :group_by_order  # NEW: added group_by_order

      def initialize
        @pages           = []
        @years           = []
        @months          = []
        @days            = []
        @categories      = []
        @tags            = []
        @order_by        = "title"
        @order           = "asc"
        @limit           = nil
        @offset          = 0
        @group_by        = nil
        @group_by_order  = "asc"  # NEW: default to asc
      end

      def execute
        filter_pages!
        sort_pages!
        slice_pages!
        return group_by_pages if @group_by && !@group_by.empty?

        @pages
      end

      private

      # Filter by year, month, day, categories, tags
      def filter_pages!

        # Filter by years
        if @years.any?
          @pages = @pages.select do |p|
            p.data["date"] && @years.include?(p.data["date"].year)
          end
        end

        # Filter by months
        if @months.any?
          @pages = @pages.select do |p|
            p.data["date"] && @months.include?(p.data["date"].month)
          end
        end

        # Filter by days
        if @days.any?
          @pages = @pages.select do |p|
            p.data["date"] && @days.include?(p.data["date"].day)
          end
        end

        # Filter by categories
        if @categories.any?
          @pages = @pages.select do |p|
            page_cats = p.data["categories"] || []
            page_cats = [page_cats] if page_cats.is_a?(String)
            (page_cats & @categories).any?
          end
        end

        # Filter by tags
        if @tags.any?
          @pages = @pages.select do |p|
            page_tags = p.data["tags"] || []
            page_tags = [page_tags] if page_tags.is_a?(String)
            (page_tags & @tags).any?
          end
        end

        # Reassign unique values if user specified them explicitly
        @years      = @pages.map { |p| p.data["date"]&.year }.compact.uniq.sort    if @years.any?
        @months     = @pages.map { |p| p.data["date"]&.month }.compact.uniq.sort   if @months.any?
        @days       = @pages.map { |p| p.data["date"]&.day }.compact.uniq.sort     if @days.any?
        @categories = @pages.map { |p| p.data["categories"] }.flatten.compact.uniq.sort if @categories.any?
        @tags       = @pages.map { |p| p.data["tags"] }.flatten.compact.uniq.sort       if @tags.any?
      end

      def sort_pages!
        @pages.sort_by! do |page|
          case @order_by
          when "title"
            page.data["title"].to_s || ""
          when "date"
            page.data["date"]  || Time.at(0)
          when "categories"
            Array(page.data["categories"]).join(",")
          when "tags"
            Array(page.data["tags"]).join(",")
          else
            # fallback to any data field or empty string
            page.data[@order_by] || ""
          end
        end
        @pages.reverse! if @order == "desc"
      end

      def slice_pages!
        max_limit = @limit.nil? ? @pages.size : @limit.to_i
        @offset   = @offset.to_i
        @pages    = @pages.drop(@offset).first(max_limit)
      end

      # Grouping logic
      def group_by_pages
        group_recursively(@pages, @group_by)
      end

      def group_recursively(pages, group_keys)
        return pages if group_keys.empty?

        current_key = group_keys.first
        remainder   = group_keys.drop(1)

        # Build hash of group_val => pages
        groups_hash = {}

        pages.each do |page|
          fetch_keys_for_page(current_key, page).each do |g_val|
            groups_hash[g_val] ||= []
            groups_hash[g_val] << page
          end
        end

        # Turn groups_hash into array of structures
        grouped = groups_hash.map do |group_val, group_pages|
          children = group_recursively(group_pages, remainder)
          if %w[year month day].include?(current_key)
            {
              current_key => build_date_group_object(current_key, group_val),
              "children"  => children
            }
          elsif %w[category tag].include?(current_key)
            {
              current_key => { "name" => group_val },
              "children"  => children
            }
          else
            {
              current_key => group_val.to_s,
              "children"  => children
            }
          end
        end

        # Sort the grouped array in ascending order by default
        grouped.sort_by! do |entry|
          if %w[year month day].include?(current_key)
            entry[current_key]["long_number"].to_i
          elsif %w[category tag].include?(current_key)
            entry[current_key]["name"]
          else
            entry[current_key].to_s
          end
        end

        # NEW: handle group_by_order
        grouped.reverse! if @group_by_order == "desc"

        grouped
      end

      def fetch_keys_for_page(key, page)
        case key
        when "year"
          return [] unless page.data["date"]
          [page.data["date"].year]
        when "month"
          return [] unless page.data["date"]
          [page.data["date"].month]
        when "day"
          return [] unless page.data["date"]
          [page.data["date"].day]
        when "category"
          cats = page.data["categories"] || []
          cats = [cats] if cats.is_a?(String)
          cats
        when "tag"
          tags = page.data["tags"] || []
          tags = [tags] if tags.is_a?(String)
          tags
        else
          # Fallback: group by that data field (if it exists).
          [page.data[key]] if page.data.key?(key)
        end || []
      end

      def build_date_group_object(type, value)
        case type
        when "year"
          long_number  = value.to_s.rjust(4, "0")
          short_number = long_number[-2..] # last two digits
          {
            "long_number"  => long_number,
            "short_number" => short_number
          }
        when "month"
          # e.g. 1 => "01", "Jan", "January"
          long_number  = value.to_s.rjust(2, "0")
          short_number = value.to_s
          short_name   = Date::ABBR_MONTHNAMES[value] || ""
          long_name    = Date::MONTHNAMES[value]      || ""
          {
            "long_number"  => long_number,
            "short_number" => short_number,
            "short_name"   => short_name,
            "long_name"    => long_name
          }
        when "day"
          # e.g. 1 => "01"
          long_number  = value.to_s.rjust(2, "0")
          short_number = value.to_s
          {
            "long_number"  => long_number,
            "short_number" => short_number,
            # day-of-week info could be handled if you had full date
            "short_name"   => "",
            "long_name"    => ""
          }
        else
          { "long_number" => value.to_s, "short_number" => value.to_s }
        end
      end
    end

    class DoQueryTag < Liquid::Tag
      # Revised regex to parse attributes with `=` instead of `:`
      # e.g.  order_by="date"  or  limit="10"
      TagAttributes = /(\w+)\s*=\s*("(?:[^"\\]|\\.)+"|[^"\s]+)/

      def initialize(tag_name, markup, tokens)
        super
        @params = parse_params(markup)
      end

      def render(context)
        site = context.registers[:site]

        query = Query.new

        # If user sets pages="site.pages" or "site.posts", etc.
        if @params.key?("pages")
          # Evaluate the pages param in Liquid context
          pages_obj = context[@params["pages"]] || site.collections["pages"].docs
          query.pages = pages_obj
        else
          query.pages = site.collections["pages"].docs
        end

        # Only include pages with title, date, categories, and tags
        query.pages = query.pages.select do |p|
          p.data.key?("title") &&
          p.data.key?("date") &&
          p.data.key?("categories") &&
          p.data.key?("tags") &&
          p.data["title"] &&
          p.data["date"] &&
          p.data["categories"] &&
          p.data["tags"] &&
          p.data["categories"].is_a?(Array) &&
          p.data["tags"].is_a?(Array) &&
          (not p.data["categories"].empty?) &&
          (not p.data["tags"].empty?)
        end

        # If the user gave "years", "months", etc., parse them; otherwise nil => no filtering
        query.years      = csv_to_i_array(@params["years"],    query.pages, "date.year")    if @params["years"]
        query.months     = csv_to_i_array(@params["months"],   query.pages, "date.month")   if @params["months"]
        query.days       = csv_to_i_array(@params["days"],     query.pages, "date.day")     if @params["days"]
        query.categories = csv_to_s_array(@params["categories"], query.pages, "categories") if @params["categories"]
        query.tags       = csv_to_s_array(@params["tags"],     query.pages, "tags")         if @params["tags"]

        # Sorting
        query.order_by = @params["order_by"] || "title"
        query.order    = @params["order"]    || "asc"

        # Limit/offset
        if @params.key?("limit")
          query.limit = @params["limit"].to_i
        else
          query.limit = query.pages.size
        end
        query.offset = @params["offset"] ? @params["offset"].to_i : 0

        # Group by
        query.group_by = @params["group_by"]&.split(",")&.map(&:strip)

        # NEW: parse group_by_order 
        query.group_by_order = @params["group_by_order"] || "asc"

        # Execute the query
        results = query.execute

        # We do NOT print or return JSON. Instead, store in a variable for iteration.
        var_name = @params["var"] || "results"
        context.scopes.last[var_name] = results

        ""
      end

      private

      def parse_params(markup)
        params = {}
        markup.scan(TagAttributes) do |key, value|
          # Strip quotes if the value is in quotes
          if value.start_with?('"') && value.end_with?('"')
            value = value[1..-2] # remove leading and trailing quotes
          end
          params[key] = value
        end
        params
      end

      # Split a CSV string to an array of integers
      def csv_to_i_array(str, pages, field)
        return [] if str.nil? || str.strip.empty?
        str.split(",").map(&:strip).map(&:to_i)
      end

      # Split a CSV string to an array of strings
      def csv_to_s_array(str, pages, field)
        return [] if str.nil? || str.strip.empty?
        str.split(",").map(&:strip)
      end
    end
  end
end

Liquid::Template.register_tag("query", Jekyll::QueryTag::DoQueryTag)
