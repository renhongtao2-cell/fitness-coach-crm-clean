import os

files_to_fix = [
    "src/app/(auth)/login/page.tsx",
    "src/app/(auth)/register/page.tsx",
    "src/app/(coach)/messages/page.tsx",
    "src/app/about/page.tsx",
    "src/app/blog/ai-workout-plan-guide/page.tsx",
]

for filepath in files_to_fix:
    try:
        with open(filepath, "rb") as f:
            raw = f.read()
        # Try to decode as utf-8, if fails, try to recover
        try:
            content = raw.decode("utf-8")
        except UnicodeDecodeError:
            # Use replace errors to recover
            content = raw.decode("utf-8", errors="replace")
        # Write back as valid utf-8
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Fixed: {filepath}")
    except Exception as e:
        print(f"Error fixing {filepath}: {e}")
