import os

def fix_file(path, desc):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content
    changed = False
    
    if 'coachees/page.tsx' in path:
        broken = 'router.push(/messages?clientId=\\\\)'
        if broken in content:
            lines = content.split('\n')
            new_lines = []
            i = 0
            while i < len(lines):
                if broken in lines[i]:
                    print('  Skipping broken button at line', i+1)
                    i += 3
                    continue
                new_lines.append(lines[i])
                i += 1
            content = '\n'.join(new_lines)
            changed = True
            print('  Removed broken button from coachees/list')
    
    if 'coachees/[id]/page.tsx' in path:
        single = \"className='p-2 hover:bg-blue-50 rounded-lg transition' title='Chat with client'\"
        if single in content:
            content = content.replace(single, '')
            changed = True
            print('  Removed duplicate button from detail page')
        if \"t('coachees.profile')\" in content:
            content = content.replace(\"t('coachees.profile')\", \"{t('coachees.profile')}\")
            changed = True
            print('  Fixed translation brace in detail page')
    
    if 'promo/page.tsx' in path:
        if '(\\\"use client\\\";' in content:
            content = content.replace('(\\\"use client\\\";', '\\\"use client\\\";')
            changed = True
            print('  Fixed leading parenthesis in promo page')
    
    if 'faq/page.tsx' in path:
        if '};;export const metadata:' in content:
            content = content.replace('};;export const metadata:', '};\\nexport const metadata:')
            changed = True
            print('  Fixed duplicate metadata in faq page')
        if 'lucide-react\"export' in content:
            content = content.replace('lucide-react\"export', 'lucide-react\"; export')
            changed = True
            print('  Fixed import spacing in faq page')
    
    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'  {desc}: FIXED')
    else:
        print(f'  {desc}: no change needed')

fix_file('src/app/(coach)/coachees/page.tsx', 'coachees list page')
fix_file('src/app/(coach)/coachees/[id]/page.tsx', 'coachees detail page')
fix_file('src/app/promo/page.tsx', 'promo page')
fix_file('src/app/faq/page.tsx', 'faq page')
print('\\n=== ALL FIXES COMPLETE ===')
