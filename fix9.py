import os, glob
files = ["src/app/(coach)/coachees/[id]/page.tsx"]
for f in files:
    try:
        with open(f,"rb") as fh:
            txt = fh.read().decode("utf-8","replace")
        with open(f,"w",encoding="utf-8") as fh:
            fh.write(txt)
        print("Fixed:", f)
    except Exception as e:
        print("Error:", f, e)
