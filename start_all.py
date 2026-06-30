#!/usr/bin/env python
"""
🐾 PetLembra - Start All
Script completo para iniciar o projeto do zero
"""

import os
import sys
import subprocess
import time
import webbrowser
import shutil

# ==================== CONFIGURAÇÃO ====================
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(PROJECT_ROOT, 'backend')
FRONTEND_DIR = os.path.join(PROJECT_ROOT, 'frontend')
STATIC_DIR = os.path.join(FRONTEND_DIR, 'static')
DB_PATH = os.path.join(BACKEND_DIR, 'petlembra.db')

# ==================== CORES ====================
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    END = '\033[0m'
    BOLD = '\033[1m'

def print_header(text):
    print(f"\n{Colors.HEADER}{'='*60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{text}{Colors.END}")
    print(f"{Colors.HEADER}{'='*60}{Colors.END}\n")

def print_success(text):
    print(f"{Colors.GREEN}✅ {text}{Colors.END}")

def print_error(text):
    print(f"{Colors.RED}❌ {text}{Colors.END}")

def print_info(text):
    print(f"{Colors.YELLOW}ℹ️ {text}{Colors.END}")

def print_step(text):
    print(f"\n{Colors.BLUE}🔹 {text}{Colors.END}")

# ==================== FUNÇÕES ====================

def verificar_estrutura():
    """Verifica se a estrutura de pastas existe"""
    print_step("Verificando estrutura do projeto...")
    
    pastas = [
        BACKEND_DIR,
        FRONTEND_DIR,
        STATIC_DIR
    ]
    
    for pasta in pastas:
        if not os.path.exists(pasta):
            os.makedirs(pasta)
            print_info(f"Pasta criada: {pasta}")
        else:
            print_success(f"Pasta encontrada: {pasta}")

def verificar_dependencias():
    """Verifica e instala as dependências necessárias"""
    print_step("Verificando dependências...")
    
    # Verifica se o Flask está instalado
    try:
        import flask
        print_success("Flask já instalado")
    except ImportError:
        print_info("Instalando Flask...")
        os.system(f'pip install flask flask-cors flask-swagger-ui')
        print_success("Dependências instaladas")
    
    # Verifica se o arquivo requirements.txt existe
    req_file = os.path.join(BACKEND_DIR, 'requirements.txt')
    if os.path.exists(req_file):
        print_info("Instalando dependências do requirements.txt...")
        os.system(f'pip install -r "{req_file}"')
        print_success("Dependências instaladas")

def parar_servidor():
    """Para o servidor se estiver rodando"""
    print_step("Verificando servidor...")
    
    try:
        if sys.platform == 'win32':
            # Windows
            result = subprocess.run(
                'netstat -ano | findstr :5000',
                shell=True,
                capture_output=True,
                text=True
            )
            if result.stdout:
                lines = result.stdout.strip().split('\n')
                for line in lines:
                    if 'LISTENING' in line:
                        pid = line.split()[-1]
                        os.system(f'taskkill /F /PID {pid}')
                        print_success(f"Processo {pid} finalizado")
            else:
                print_info("Nenhum servidor rodando na porta 5000")
        else:
            # Mac/Linux
            os.system('pkill -f "python.*run.py" 2>/dev/null')
            os.system('pkill -f "python.*app.py" 2>/dev/null')
            os.system('pkill -f "flask" 2>/dev/null')
            print_success("Processos finalizados")
    except Exception as e:
        print_info(f"Não foi possível parar o servidor: {e}")

def criar_banco():
    """Cria o banco de dados"""
    print_step("Criando banco de dados...")
    
    # Remove banco antigo
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
        print_info("Banco antigo removido")
    
    # Executa database.py
    os.chdir(BACKEND_DIR)
    result = os.system('python database.py')
    os.chdir(PROJECT_ROOT)
    
    if result == 0:
        print_success("Banco de dados criado com sucesso")
        return True
    else:
        print_error("Erro ao criar banco de dados")
        return False

def popular_banco():
    """Popula o banco com dados fictícios"""
    print_step("Populando banco de dados...")
    
    os.chdir(BACKEND_DIR)
    result = os.system('python populate_db.py')
    os.chdir(PROJECT_ROOT)
    
    if result == 0:
        print_success("Banco de dados populado com sucesso")
        return True
    else:
        print_error("Erro ao popular banco de dados")
        return False

def gerar_swagger():
    """Gera a documentação Swagger"""
    print_step("Gerando documentação Swagger...")
    
    # Verifica se o swagger.json existe
    swagger_file = os.path.join(STATIC_DIR, 'swagger.json')
    
    if os.path.exists(swagger_file):
        print_success("Swagger.json já existe")
        return True
    
    # Tenta gerar via app.py
    try:
        os.chdir(BACKEND_DIR)
        # Importa e executa a geração
        import app
        app.generate_swagger_json()
        os.chdir(PROJECT_ROOT)
        print_success("Swagger.json gerado com sucesso")
        return True
    except Exception as e:
        print_error(f"Erro ao gerar Swagger: {e}")
        return False

def iniciar_servidor():
    """Inicia o servidor Flask"""
    print_step("Iniciando servidor...")
    
    print(f"""
{Colors.GREEN}
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║              🐾 PetLembra - Servidor                     ║
║                                                          ║
║   Servidor iniciado em: http://localhost:5000           ║
║   Documentação API:  http://localhost:5000/api/docs     ║
║                                                          ║
║   Pressione CTRL+C para parar o servidor                ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
{Colors.END}
    """)
    
    # Abre o navegador
    time.sleep(2)
    webbrowser.open('http://localhost:5000')
    
    # Inicia o servidor
    os.chdir(PROJECT_ROOT)
    os.system('python run.py')

def mostrar_menu():
    """Mostra o menu de opções"""
    print(f"""
{Colors.HEADER}
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║              🐾 PetLembra - Start All                    ║
║                                                          ║
║   Opções disponíveis:                                    ║
║                                                          ║
║   1️⃣  Iniciar Tudo do Zero (Recomendado)                ║
║   2️⃣  Apenas Popular Banco de Dados                     ║
║   3️⃣  Apenas Iniciar Servidor                           ║
║   4️⃣  Verificar Estrutura                               ║
║   5️⃣  Sair                                              ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
{Colors.END}
    """)
    
    choice = input("👉 Escolha uma opção (1-5): ")
    return choice

def start_all():
    """Executa tudo do zero"""
    print_header("🐾 PetLembra - Iniciando Tudo do Zero")
    
    # 1. Verifica estrutura
    verificar_estrutura()
    
    # 2. Para servidor existente
    parar_servidor()
    
    # 3. Verifica dependências
    verificar_dependencias()
    
    # 4. Cria banco
    if not criar_banco():
        print_error("Falha na criação do banco")
        return
    
    # 5. Popula banco
    if not popular_banco():
        print_error("Falha na população do banco")
        return
    
    # 6. Gera Swagger
    gerar_swagger()
    
    # 7. Inicia servidor
    print_header("🎉 Tudo pronto! Iniciando servidor...")
    iniciar_servidor()

def only_populate():
    """Apenas popula o banco"""
    print_header("📝 Populando Banco de Dados")
    
    # Verifica se o banco existe
    if not os.path.exists(DB_PATH):
        print_info("Banco de dados não encontrado. Criando...")
        criar_banco()
    
    popular_banco()
    
    print_success("Banco populado com sucesso!")

def only_start():
    """Apenas inicia o servidor"""
    print_header("🚀 Iniciando Servidor")
    
    # Verifica se o banco existe
    if not os.path.exists(DB_PATH):
        print_info("Banco de dados não encontrado. Criando...")
        criar_banco()
        popular_banco()
    
    # Para servidor existente
    parar_servidor()
    
    # Inicia
    iniciar_servidor()

def check_structure():
    """Verifica a estrutura do projeto"""
    print_header("📁 Verificando Estrutura")
    
    # Pastas
    pastas = [
        ('Backend', BACKEND_DIR),
        ('Frontend', FRONTEND_DIR),
        ('Static', STATIC_DIR)
    ]
    
    for nome, caminho in pastas:
        if os.path.exists(caminho):
            print_success(f"{nome}: {caminho}")
        else:
            print_error(f"{nome}: {caminho} - NÃO ENCONTRADO")
    
    # Arquivos importantes
    arquivos = [
        ('app.py', os.path.join(BACKEND_DIR, 'app.py')),
        ('database.py', os.path.join(BACKEND_DIR, 'database.py')),
        ('models.py', os.path.join(BACKEND_DIR, 'models.py')),
        ('populate_db.py', os.path.join(BACKEND_DIR, 'populate_db.py')),
        ('index.html', os.path.join(FRONTEND_DIR, 'index.html')),
        ('style.css', os.path.join(STATIC_DIR, 'style.css')),
        ('app.js', os.path.join(STATIC_DIR, 'app.js')),
        ('run.py', os.path.join(PROJECT_ROOT, 'run.py'))
    ]
    
    print("\n📄 Arquivos:")
    for nome, caminho in arquivos:
        if os.path.exists(caminho):
            print_success(f"  {nome}: OK")
        else:
            print_error(f"  {nome}: NÃO ENCONTRADO")

def exibir_banner():
    """Exibe o banner do PetLembra"""
    print(f"""
{Colors.HEADER}
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   ██████╗ ███████╗████████╗██╗     ███████╗███╗   ███╗ ║
║   ██╔══██╗██╔════╝╚══██╔══╝██║     ██╔════╝████╗ ████║ ║
║   ██████╔╝█████╗     ██║   ██║     █████╗  ██╔████╔██║ ║
║   ██╔═══╝ ██╔══╝     ██║   ██║     ██╔══╝  ██║╚██╔╝██║ ║
║   ██║     ███████╗   ██║   ███████╗███████╗██║ ╚═╝ ██║ ║
║   ╚═╝     ╚══════╝   ╚═╝   ╚══════╝╚══════╝╚═╝     ╚═╝ ║
║                                                          ║
║              🐾 Sistema para Pets                        ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
{Colors.END}
    """)

# ==================== MAIN ====================
def main():
    try:
        exibir_banner()
        
        while True:
            choice = mostrar_menu()
            
            if choice == '1':
                start_all()
                break
            elif choice == '2':
                only_populate()
                input("\nPressione ENTER para continuar...")
            elif choice == '3':
                only_start()
                break
            elif choice == '4':
                check_structure()
                input("\nPressione ENTER para continuar...")
            elif choice == '5':
                print(f"\n{Colors.YELLOW}👋 Saindo...{Colors.END}")
                sys.exit(0)
            else:
                print(f"\n{Colors.RED}❌ Opção inválida!{Colors.END}")
                
    except KeyboardInterrupt:
        print(f"\n\n{Colors.YELLOW}👋 Servidor encerrado!{Colors.END}")
    except Exception as e:
        print_error(f"Erro inesperado: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()