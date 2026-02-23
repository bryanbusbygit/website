#!/usr/bin/env python3
from __future__ import annotations

import datetime as dt
import pathlib
import re
import sys


def main() -> int:
    repo_root = pathlib.Path(__file__).resolve().parents[1]
    index_path = repo_root / "index.html"
    if not index_path.exists():
        print(f"error: {index_path} not found", file=sys.stderr)
        return 1

    today = dt.date.today().isoformat()
    html = index_path.read_text()

    if 'data-last-updated="' in html:
        updated = re.sub(
            r'data-last-updated="[^"]*"',
            f'data-last-updated="{today}"',
            html,
            count=1,
        )
    else:
        updated = re.sub(
            r"<body(\\s|>)",
            f'<body data-last-updated="{today}"\\1',
            html,
            count=1,
        )

    if updated == html:
        print("warning: no changes applied", file=sys.stderr)
        return 0

    index_path.write_text(updated)
    print(f"updated data-last-updated to {today}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
