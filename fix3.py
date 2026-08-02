import os; f="src/app/(coach)/coachees/[id]/page.tsx"; txt = open(f,"rb").read().decode("utf-8","replace"); open(f,"w",encoding="utf-8").write(txt); print("Fixed detail")
