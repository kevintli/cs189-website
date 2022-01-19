all:
	preview

.PHONY: staging update preview

preview:
	python compile.py preview && \
  mv published cs189-website && \
  mkdir published && \
  mv cs189-website published/ && \
	cd published && \
	python -m http.server

# usage: make staging m="commit message"
staging:
	git pull && \
	rm -rf published && \
	python3 compile.py staging && \
	git add . && \
	git commit -m "stage: $(m)" --allow-empty && \
	git push && \
	make update

# Pushes the published folder to gh-pages to update the staging webpage.
update:
	git push origin `git subtree split --prefix published master`:gh-pages --force
	git subtree split --rejoin --prefix=published master
