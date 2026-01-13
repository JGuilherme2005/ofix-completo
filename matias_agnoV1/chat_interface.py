import os
from dotenv import load_dotenv
from matias_agno.agents.team import get_matias_team
from rich.console import Console
from rich.markdown import Markdown

# Carregar variáveis de ambiente
load_dotenv()

console = Console()

def start_chat():
    console.print("[bold green]🚗 MATIAS AGNO - SISTEMA DE OFICINA INTELIGENTE[/bold green]")
    console.print("Carregando equipe de agentes... aguarde.")
    
    try:
        team = get_matias_team()
        console.print("[bold blue]✅ Equipe carregada! Pode começar a falar.[/bold blue]")
        console.print("Digite 'sair' para encerrar.\n")
        
        while True:
            user_input = console.input("[bold yellow]Você:[/bold yellow] ")
            
            if user_input.lower() in ['sair', 'exit', 'quit']:
                console.print("[bold red]Encerrando chat...[/bold red]")
                break
            
            if not user_input.strip():
                continue
                
            console.print("\n[bold cyan]Matias Team pensando...[/bold cyan]")
            
            # Executa o team e imprime a resposta
            # stream=True permite ver a resposta sendo gerada em tempo real
            team.print_response(user_input, stream=True)
            print("\n") # Pula linha após a resposta

    except Exception as e:
        console.print(f"[bold red]❌ Erro crítico:[/bold red] {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    start_chat()
