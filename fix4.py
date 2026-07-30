import os, glob; [open(f,"w",encoding="utf-8").write(open(f,"rb").read().decode("utf-8","replace")) for f in glob.glob("**/*.tsx",recursive=True)+glob.glob("**/*.ts",recursive=True)]
