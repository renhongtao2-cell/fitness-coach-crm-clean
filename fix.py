import os
import glob

files = []
for pat in ["**/*.tsx", "**/*.ts"]:
    files.extend(glob.glob(pat, recursive=True))

for f in files:
    try:
        with open(f, "rb") as fh:
            raw = fh.read()
        try:
            txt = raw.decode("utf-8")
        except UnicodeDecodeError:
            txt = raw.decode("utf-8", errors="replace")
        with open(f, "w", encoding="utf-8") as fh:
            fh.write(txt)
    except:
        pass

print("Done")
