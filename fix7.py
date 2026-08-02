import os, glob
files = [
    "src/app/(auth)/login/page.tsx",
    "src/app/(auth)/register/page.tsx",
    "src/app/(coach)/messages/page.tsx",
    "src/app/blog/ai-workout-plan-guide/page.tsx",
    "src/app/faq/page.tsx",
    "src/app/layout.tsx",
    "src/app/page.tsx",
    "src/app/(coach)/coachees/[id]/page.tsx",
    "src/app/(coach)/coachees/page.tsx",
    "src/app/promo/page.tsx",
]
for f in files:
    try:
        with open(f,"rb") as fh:
            txt = fh.read().decode("utf-8","replace")
        with open(f,"w",encoding="utf-8") as fh:
            fh.write(txt)
        print("Fixed:", f)
    except Exception as e:
        print("Error:", f, e)
