#!/usr/bin/env python3
"""Generate deterministic SQL that backfills English copies of public blog content."""

from __future__ import annotations

import argparse
import json
import sys
import time
import urllib.parse
import urllib.request


TRANSLATE_URL = "https://translate.googleapis.com/translate_a/single"


def fetch_json(url: str, api_key: str):
    request = urllib.request.Request(url, headers={"apikey": api_key})
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def translate_chunk(value: str) -> str:
    query = urllib.parse.urlencode(
        {
            "client": "gtx",
            "sl": "zh-CN",
            "tl": "en",
            "dt": "t",
            "q": value,
        }
    )
    request = urllib.request.Request(f"{TRANSLATE_URL}?{query}")
    for attempt in range(4):
        try:
            with urllib.request.urlopen(request, timeout=45) as response:
                payload = json.load(response)
            return "".join(segment[0] or "" for segment in payload[0])
        except Exception:
            if attempt == 3:
                raise
            time.sleep(1.5 * (attempt + 1))
    raise RuntimeError("translation retry loop exited unexpectedly")


def split_long_text(value: str, limit: int = 3000) -> list[str]:
    if len(value) <= limit:
        return [value]

    chunks: list[str] = []
    current = ""
    for paragraph in value.splitlines(keepends=True):
        if len(current) + len(paragraph) <= limit:
            current += paragraph
            continue
        if current:
            chunks.append(current)
            current = ""
        while len(paragraph) > limit:
            chunks.append(paragraph[:limit])
            paragraph = paragraph[limit:]
        current = paragraph
    if current:
        chunks.append(current)
    return chunks


def translate(value: str | None) -> str | None:
    if value is None or not value.strip():
        return value
    translated = "".join(translate_chunk(chunk) for chunk in split_long_text(value))
    time.sleep(0.15)
    return translated


def sql_string(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def json_sql(value) -> str:
    return sql_string(json.dumps(value, ensure_ascii=False)) + "::jsonb"


def article_statements(rows: list[dict]) -> list[str]:
    statements = []
    for row in rows:
        print(f"Translating article {row['id']}: {row['title']}", file=sys.stderr)
        english = {
            "title": translate(row.get("title")),
            "summary": translate(row.get("summary")),
            "content": translate(row.get("content")),
        }
        if row.get("category"):
            english["category"] = translate(row["category"])
        statements.append(
            f"UPDATE articles SET translations = jsonb_build_object('en', {json_sql(english)}) "
            f"WHERE id = {int(row['id'])};"
        )
    return statements


def gallery_statements(rows: list[dict]) -> list[str]:
    statements = []
    for row in rows:
        description = row.get("description") or ""
        english = {"description": translate(description)}
        statements.append(
            f"UPDATE gallery SET translations = jsonb_build_object('en', {json_sql(english)}) "
            f"WHERE id = {int(row['id'])};"
        )
    return statements


def profile_statements(rows: list[dict]) -> list[str]:
    statements = []
    for row in rows:
        raw_profile = row.get("profile_json")
        if not raw_profile:
            continue
        document = json.loads(raw_profile) if isinstance(raw_profile, str) else raw_profile
        profile = document.get("profile", {})
        bio = profile.get("bio", {})
        english_tags = []
        for tag in profile.get("tags", []):
            english_tags.append({**tag, "text": translate(tag.get("text", ""))})
        english_profile = {
            "nickname": translate(profile.get("nickname", "")),
            "slogan": translate(profile.get("slogan", "")),
            "subSlogan": translate(profile.get("subSlogan", "")),
            "bio": {
                "who": translate(bio.get("who", "")),
                "what": translate(bio.get("what", "")),
                "attitude": translate(bio.get("attitude", "")),
            },
            "tags": english_tags,
            "techStack": profile.get("techStack", []),
        }
        profile["locales"] = {**profile.get("locales", {}), "en": english_profile}
        document["profile"] = profile
        statements.append(
            f"UPDATE users SET profile_json = {sql_string(json.dumps(document, ensure_ascii=False))} "
            f"WHERE id = {int(row['id'])};"
        )
    return statements


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", required=True, help="Supabase project URL")
    parser.add_argument("--key", required=True, help="Supabase publishable key")
    args = parser.parse_args()

    base = args.url.rstrip("/") + "/rest/v1"
    articles = fetch_json(f"{base}/articles?select=*&order=id.asc", args.key)
    gallery = fetch_json(f"{base}/gallery?select=*&order=id.asc", args.key)
    users = fetch_json(
        f"{base}/users?select=id,username,nickname,profile_json,profile_stats&order=id.asc",
        args.key,
    )

    statements = [
        "-- Generated from the public production content snapshot.",
        "-- Chinese source fields remain unchanged; English copies are cached separately.",
        "BEGIN;",
        *article_statements(articles),
        *gallery_statements(gallery),
        *profile_statements(users),
        "COMMIT;",
    ]
    print("\n\n".join(statements))


if __name__ == "__main__":
    main()
