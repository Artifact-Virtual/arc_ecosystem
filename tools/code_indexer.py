#!/usr/bin/env python3
"""
code_indexer.py

Walk the repository, produce a raw markdown report in reports/ and a cleaned
developer-friendly markdown at the repository root (default: CODEBASE_OVERVIEW.md).

Usage (PowerShell wrapper provided):
  python tools\code_indexer.py

This script is intentionally conservative: it excludes .git and typical
dependency/build folders and writes human-friendly markdown with relative links.
"""
from __future__ import annotations

import argparse
import fnmatch
from pathlib import Path
from datetime import datetime
from typing import List, Tuple


DEFAULT_EXCLUDE_DIRS = {".git", "node_modules", "artifacts", "cache", "build-info", "typechain-types", "reports"}


def load_gitignore(root: Path) -> List[str]:
    gitignore = root / ".gitignore"
    patterns: List[str] = []
    if not gitignore.exists():
        return patterns
    try:
        for line in gitignore.read_text(encoding="utf-8").splitlines():
            s = line.strip()
            if not s or s.startswith("#"):
                continue
            # normalize windows backslashes
            s = s.replace("\\", "/")
            patterns.append(s)
    except OSError:
        pass
    return patterns


def human_size(n: int) -> str:
    for unit in ["B", "KB", "MB", "GB"]:
        if n < 1024.0:
            return f"{n:.1f}{unit}"
        n /= 1024.0
    return f"{n:.1f}TB"


def _matches_gitignore(rel: Path, patterns: List[str]) -> bool:
    # rel is a Path relative to repo root, use posix style for matching
    s = rel.as_posix()
    parts = rel.parts
    for pat in patterns:
        # If pattern ends with a slash, treat as directory
        pat_dir = pat.endswith("/")
        pat_norm = pat.rstrip("/")
        # try direct fnmatch against the whole path
        try_patterns = [pat_norm]
        # support matching anywhere in path
        if not pat_norm.startswith("**") and not pat_norm.startswith("/"):
            try_patterns.append(f"**/{pat_norm}")

        for tp in try_patterns:
            if fnmatch.fnmatch(s, tp):
                return True

        # if it's a simple folder name, check path parts
        if not ("/" in pat_norm or "*" in pat_norm) and pat_dir:
            if pat_norm in parts:
                return True

    return False


def gather_files(root: Path, extra_gitignore: List[str] | None = None) -> List[Tuple[Path, int, float]]:
    files: List[Tuple[Path, int, float]] = []
    git_patterns = extra_gitignore or []
    for p in root.rglob("*"):
        try:
            rel = p.relative_to(root)
        except Exception:
            continue
        parts = rel.parts
        # built-in excludes (by exact name)
        if any(part in DEFAULT_EXCLUDE_DIRS for part in parts):
            continue
        # respect gitignore patterns
        if git_patterns and _matches_gitignore(rel, git_patterns):
            continue
        if p.is_file():
            try:
                stat = p.stat()
            except OSError:
                continue
            files.append((rel, stat.st_size, stat.st_mtime))
    return sorted(files, key=lambda x: str(x[0]).lower())


def write_raw_report(files, out_path: Path):
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8") as f:
        f.write(f"# Repository raw file index\nGenerated: {datetime.utcnow().isoformat()} UTC\n\n")
        f.write("| Path | Size | Modified UTC |\n")
        f.write("|---|---:|---:|\n")
        for rel, size, mtime in files:
            m = datetime.utcfromtimestamp(mtime).isoformat()
            f.write(f"| [{rel.as_posix()}]({rel.as_posix()}) | {human_size(size)} | {m} |\n")


def build_clean_overview(files, root_name: str) -> str:
    # Summary
    total_files = len(files)
    total_bytes = sum(size for _, size, _ in files)

    lines = []
    lines.append("# Codebase overview — Devs & Contributors")
    lines.append("")
    lines.append(f"*Generated: {datetime.utcnow().isoformat()} UTC*")
    lines.append("")
    lines.append("## Quick stats")
    lines.append("")
    lines.append(f"- Root: `{root_name}`")
    lines.append(f"- Files indexed: **{total_files}**")
    lines.append(f"- Total size: **{human_size(total_bytes)}**")
    lines.append("")

    # Top-level directories summary
    lines.append("## Top-level directories")
    lines.append("")
    top = {}
    for rel, size, _ in files:
        top_dir = rel.parts[0] if len(rel.parts) > 1 else rel.parts[0]
        top.setdefault(top_dir, {"count": 0, "size": 0})
        top[top_dir]["count"] += 1
        top[top_dir]["size"] += size

    for name, stats in sorted(top.items(), key=lambda x: x[0].lower()):
        lines.append(f"- **{name}** — {stats['count']} files, {human_size(stats['size'])}")
    lines.append("")

    # Table of contents (grouped)
    lines.append("## Table of contents")
    lines.append("")
    current_section = None
    for rel, size, mtime in files:
        parts = rel.parts
        section = parts[0] if len(parts) > 1 else parts[0]
        if section != current_section:
            lines.append(f"### {section}")
            lines.append("")
            current_section = section
        m = datetime.utcfromtimestamp(mtime).isoformat()
        display = rel.as_posix()
        lines.append(f"- [{display}]({display}) — {human_size(size)} / {m}")
    lines.append("")

    # Helpful notes
    lines.append("---")
    lines.append("")
    lines.append("### Notes for contributors")
    lines.append("")
    lines.append("- This file is generated automatically by `tools/code_indexer.py`.\n- It excludes some common build and dependency folders (see script EXCLUDE_DIRS).\n- If you need more detailed per-file descriptions, open issues or submit a PR to improve this document.")

    return "\n".join(lines)


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Index repository files and produce Markdown reports.")
    parser.add_argument("--reports-dir", default=None, help="Directory to write raw report (default: <repo>/reports)")
    parser.add_argument("--overview-out", default=None, help="Path to write cleaned overview markdown (default: <repo>/CODEBASE_OVERVIEW.md)")
    parser.add_argument("--root", default=None, help="Repository root (default: parent of tools/)")
    args = parser.parse_args(argv)

    here = Path(__file__).resolve()
    tools_dir = here.parent
    repo_root = Path(args.root).resolve() if args.root else tools_dir.parent

    reports_dir = Path(args.reports_dir) if args.reports_dir else repo_root / "reports"
    raw_out = reports_dir / "index_raw.md"
    overview_out = Path(args.overview_out) if args.overview_out else repo_root / "CODEBASE_OVERVIEW.md"

    print(f"Indexing repository root: {repo_root}")
    gitignore_patterns = load_gitignore(repo_root)
    if gitignore_patterns:
        print(f"Loaded {len(gitignore_patterns)} patterns from .gitignore")
    files = gather_files(repo_root, gitignore_patterns)
    print(f"Found {len(files)} files (excluding common build folders). Writing raw report to {raw_out}")
    write_raw_report(files, raw_out)

    print(f"Building cleaned overview -> {overview_out}")
    overview_md = build_clean_overview(files, repo_root.name)
    overview_out.write_text(overview_md, encoding="utf-8")

    print("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
