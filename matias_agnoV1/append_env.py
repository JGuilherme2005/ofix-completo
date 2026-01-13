with open('matias_agno/.env', 'a', encoding='utf-8') as f:
    f.write('\nOLLAMA_ENABLED=true\n')
print("Appended OLLAMA_ENABLED=true safely.")
