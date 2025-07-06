# Makefile for jekyll-theme-ade

.PHONY: help test clean shell

help:
	@echo "Available targets:"
	@echo "  help   Show this help message."
	@echo "  test   Run unit tests in Docker."
	@echo "  clean  Remove docker orphans and clean repo with git."
	@echo "  shell  Drop into an interactive shell in the Docker container."

test:
	rm -rf .docker
	mkdir -p .docker
	docker-compose -f dev/docker/docker-compose.yml down --remove-orphans
	docker-compose -f dev/docker/docker-compose.yml up --build

clean:
	docker-compose -f dev/docker/docker-compose.yml down --remove-orphans || true
	docker rm jekyll-theme-ade-test || true
	docker rmi jekyll-theme-ade-test || true
	git clean -Xdf

shell:
	docker-compose -f dev/docker/docker-compose.yml run --rm -it jekyll-theme-ade-test /bin/bash 