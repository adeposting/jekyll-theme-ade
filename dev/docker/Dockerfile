FROM ruby:3.2

RUN useradd -ms /bin/bash docker
WORKDIR /home/docker/jekyll-theme-ade
COPY . .
RUN chown -R docker:docker /home/docker/jekyll-theme-ade
USER docker
RUN git init
RUN gem install bundler && bundle install 