"""Bump the ?v= query on local module imports.

The browser had cached module copies from before serve.py sent no-store, and a
cached entry keeps being used until it expires — a new tab does not help,
because the HTTP cache is shared. Changing the URL is the only reliable evict.

    python model/bump.py
"""

import re
import time
from pathlib import Path

ROOT = Path(__file__).parent
VERSION = str(int(time.time()))
LOCAL = re.compile(r"""(['"`])(\.{1,2}/[\w./-]+?\.js)(?:\?v=\d+)?\1""")


def bump(path: Path) -> int:
    text = path.read_text(encoding="utf-8")
    new = LOCAL.sub(lambda m: f"{m.group(1)}{m.group(2)}?v={VERSION}{m.group(1)}", text)
    if new != text:
        path.write_text(new, encoding="utf-8")
        return len(LOCAL.findall(text))
    return 0


if __name__ == "__main__":
    total = 0
    for f in [ROOT / "index.html", *sorted((ROOT / "src").glob("*.js"))]:
        n = bump(f)
        total += n
        if n:
            print(f"  {f.relative_to(ROOT)}: {n}")
    print(f"bumped {total} import(s) to v={VERSION}")
