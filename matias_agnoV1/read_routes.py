try:
    with open('routes.txt', 'r', encoding='utf-16') as f:
        print(f.read())
except:
    with open('routes.txt', 'r', encoding='utf-8') as f:
        print(f.read())
