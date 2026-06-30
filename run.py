#!/usr/bin/env python
"""
🐾 PetLembra - Iniciador do Servidor
"""
import sys
import os

# Adiciona o diretório backend ao path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

print(f"📂 Backend path: {backend_path}")

try:
    # Importa o app do backend
    from backend.app import app
    print("✅ App importado com sucesso!")
except ImportError as e:
    print(f"❌ Erro ao importar app: {e}")
    print("\nVerifique se a estrutura de pastas está correta:")
    print("  petLembra/")
    print("  ├── run.py")
    print("  ├── backend/")
    print("  │   ├── app.py")
    print("  │   ├── database.py")
    print("  │   └── models.py")
    print("  └── frontend/")
    sys.exit(1)

if __name__ == '__main__':
    print("""
    🐾 PetLembra - Sistema de Gerenciamento para Pets
    ============================================
    Servidor iniciado em: http://localhost:5000
    Documentação da API: http://localhost:5000/api/docs

    Pressione CTRL+C para parar o servidor
    """)
    app.run(debug=True, host='localhost', port=5000)