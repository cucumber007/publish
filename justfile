alias m := merge-md
alias o := open
alias s := serve
alias u := unmerge-md
alias b := build
alias rs := run-sim

merge-md:
    #!/usr/bin/env sh
    set -euo pipefail

    # Step 1: Generate the list of files, exclude onefile.md, and print it
    file_list=$(find . -type f -name "*.md" ! -path "./docs/*" ! -name "onefile.md" | while IFS= read -r file; do realpath "$file"; done | sort -u)
    echo "Files to merge:"
    echo "$file_list"

    # Step 2: Merge the files into onefile.md
    rm -f onefile.md
    echo "$file_list" | while IFS= read -r file; do \
        echo "Writing: $file"; \
        echo "@@@ $file" >> onefile.md; \
        cat "$file" >> onefile.md; \
    done

open:
    open docs/index.html

serve:
    mkdocs serve

unmerge-md:
    #!/usr/bin/env sh
    set -euo pipefail

    # Split onefile.md into individual files
    awk '/^@@@ / {out=substr($0, 5); gsub("^\\./", "", out); print "Splitting: " out; close(out)} !/^@@@ / {if (out) print > out}' onefile.md

build:
    mkdocs build

run-sim:
    cd mdtc-sim && npm run dev



