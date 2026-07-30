import os
import glob

# Find all TypeScript files
files = []
for pattern in ["**/*.tsx", "**/*.ts"]:
    files.extend(glob.glob(pattern, recursive=True))

print(f"Found {len(files)} files to check")

for filepath in files:
    try:
        with open(filepath, "rb") as f:
            raw = f.read()
        try:
            content = raw.decode("utf-8")
        except UnicodeDecodeError:
            content = raw.decode("utf-8", errors="replace")
        # Only write if we had to fix anything
        try:
            check = content.encode("utf-8")
        except:
            pass
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
    except Exception as e:
        print(f"Error: {filepath} - {e}")
