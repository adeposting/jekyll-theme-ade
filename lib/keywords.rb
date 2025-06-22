module Jekyll
    class Keywords

        def self.tokenize(doc)
            title = doc.data["title"]
            date = doc.data["date"]
            categories = doc.data["categories"]
            tags = doc.data["tags"]
            url = doc.url
            keywords = []
            keywords << tokenize_title(title)
            keywords << tokenize_url(url)
            keywords << tokenize_date(date)
            keywords << tokenize_categories(categories)
            keywords << tokenize_tags(tags)
            normalize_tokens(keywords.flatten)
        end

        private

        def self.tokenize_title(title)
            title = title.to_s
            tokens = []
            tokens << title.split(/\s+/)
            tokens << title.split(/\W+/)
            tokens.flatten
        end

        def self.tokenize_url(url)
            url = url.to_s
            tokens = []
            tokens << url
            tokens << url.split(/\W+/)
            tokens.flatten
        end

        def self.tokenize_date(date)
            date = date.to_s
            tokens = []
            parsed_date = Date.parse(date) rescue nil
            return tokens unless parsed_date

            year_full  = parsed_date.year.to_s
            year_short = parsed_date.strftime('%y') # Last two digits of the year
            month      = parsed_date.month.to_s
            day        = parsed_date.day.to_s

            # Zero-padded values
            month_padded = format('%02d', parsed_date.month)
            day_padded   = format('%02d', parsed_date.day)

            # Month and day names
            month_short = parsed_date.strftime('%b') # Jan, Feb, etc.
            month_long  = parsed_date.strftime('%B') # January, February, etc.
            day_short   = parsed_date.strftime('%a') # Mon, Tue, etc.
            day_long    = parsed_date.strftime('%A') # Monday, Tuesday, etc.

            # Generate date formats (for both full year and short year)
            year_variants = [year_full, year_short]

            year_variants.each do |year|
                formats = [
                    year,
                    "#{year}-#{month}", "#{year}/#{month}",
                    "#{year}-#{month_padded}", "#{year}/#{month_padded}",
                    "#{year}-#{month}-#{day}", "#{year}/#{month}/#{day}",
                    "#{year}-#{month_padded}-#{day_padded}", "#{year}/#{month_padded}/#{day_padded}",
                    "#{month}-#{day}-#{year}", "#{month}/#{day}/#{year}",
                    "#{month_padded}-#{day_padded}-#{year}", "#{month_padded}/#{day_padded}/#{year}"
                ]
                tokens.concat(formats)
            end

            # Add month and day names
            tokens.concat([month_short, month_long, day_short, day_long])

            tokens.uniq # Remove duplicates if any
        end

        def self.tokenize_categories(categories)
            categories = categories.map(&:to_s)
            tokens = []
            tokens << categories
            tokens << categories.map { |category| category.split(/\//) }
            tokens << categories.map { |category| category.split(/\W+/) }
            tokens.flatten
        end

        def self.tokenize_tags(tags)
            tags = tags.map(&:to_s)
            tokens = []
            tokens << tags
            tokens << tags.map { |tag| tag.split(/\W+/) }
            tokens.flatten
        end

        def self.normalize_tokens(tokens)
            stop_words = %w[
                a an and are as at be but by for if in into is it no not of on or such that
                the their then there these they this to was will with about after again all
                also am among an any around because been before being between both can
                cannot could did do does down during each few from further had has have he
                her here him himself how i if into itself just like me more most my myself
                now off once only our ours ourselves out over own same she should so some
                such than those through under until up very we were what when where which
                while who whom why would you your yours yourself yourselves
            ]
            tokens
                .flatten
                .map(&:downcase)
                .reject(&:empty?)
                .reject { |word| word.length < 3 }
                .reject { |word| stop_words.include?(word) }
                .uniq
                .sort
        end

    end
end