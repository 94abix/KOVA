#!/usr/bin/env python3
"""
Script pour créer automatiquement un dépôt GitHub et pousser le code.

Prérequis:
1. Installer PyGithub: pip install PyGithub
2. Créer un token GitHub: https://github.com/settings/tokens
   - Scope nécessaire: 'repo' (accès complet aux dépôts)

Usage:
    python3 create-github-repo.py VOTRE_TOKEN_GITHUB NOM_DU_REPO [DESCRIPTION]
"""

import sys
import subprocess
from github import Github

def create_repo_and_push(token, repo_name, description="KOVA MVP - Application d'analyse biomécanique pour sports de combat", is_private=False):
    """Crée un dépôt GitHub et pousse le code."""
    
    try:
        # Connexion à GitHub
        print("🔗 Connexion à GitHub...")
        g = Github(token)
        user = g.get_user()
        print(f"✅ Connecté en tant que: {user.login}")
        
        # Créer le dépôt
        print(f"📦 Création du dépôt '{repo_name}'...")
        repo = user.create_repo(
            repo_name,
            description=description,
            private=is_private,
            auto_init=False  # On ne veut pas initialiser avec un README
        )
        print(f"✅ Dépôt créé: {repo.html_url}")
        
        # Ajouter le remote et pousser
        print("🚀 Configuration du remote Git...")
        remote_url = f"https://{token}@github.com/{user.login}/{repo_name}.git"
        
        # Supprimer le remote s'il existe déjà
        subprocess.run(["git", "remote", "remove", "origin"], 
                      cwd="/Users/bousri/Documents/KOVA/kova", 
                      stderr=subprocess.DEVNULL)
        
        # Ajouter le nouveau remote
        subprocess.run(["git", "remote", "add", "origin", remote_url],
                      cwd="/Users/bousri/Documents/KOVA/kova",
                      check=True)
        
        # Pousser le code
        print("📤 Poussage du code sur GitHub...")
        subprocess.run(["git", "branch", "-M", "main"],
                      cwd="/Users/bousri/Documents/KOVA/kova",
                      check=True)
        subprocess.run(["git", "push", "-u", "origin", "main"],
                      cwd="/Users/bousri/Documents/KOVA/kova",
                      check=True)
        
        print(f"✅ Code poussé avec succès!")
        print(f"🌐 Dépôt: {repo.html_url}")
        print(f"\n📝 Prochaines étapes:")
        print(f"   1. Allez sur https://vercel.com")
        print(f"   2. Connectez votre dépôt GitHub")
        print(f"   3. Configurez les variables d'environnement Supabase")
        print(f"   4. Déployez!")
        
        return repo.html_url
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        print(f"\n💡 Solution:")
        print(f"   1. Vérifiez que votre token GitHub est valide")
        print(f"   2. Vérifiez que le token a le scope 'repo'")
        print(f"   3. Vérifiez que le nom du dépôt n'existe pas déjà")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 create-github-repo.py TOKEN_GITHUB NOM_REPO [DESCRIPTION] [--private]")
        print("\nExemple:")
        print("  python3 create-github-repo.py ghp_xxxxx kova")
        print("  python3 create-github-repo.py ghp_xxxxx kova 'Mon app KOVA' --private")
        sys.exit(1)
    
    token = sys.argv[1]
    repo_name = sys.argv[2]
    description = sys.argv[3] if len(sys.argv) > 3 else "KOVA MVP - Application d'analyse biomécanique pour sports de combat"
    is_private = "--private" in sys.argv
    
    create_repo_and_push(token, repo_name, description, is_private)

