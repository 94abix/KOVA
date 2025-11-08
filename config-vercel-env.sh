#!/bin/bash
# Script pour afficher les instructions de configuration des variables d'environnement Vercel

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║     🔧 Configuration des Variables d'Environnement Vercel       ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

echo "📋 Variables à configurer dans Vercel :"
echo ""
echo "   1. NEXT_PUBLIC_SUPABASE_URL"
echo "   2. NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   3. SUPABASE_SERVICE_ROLE_KEY"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 ÉTAPE 1 : Récupérer vos Variables Supabase"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Allez sur : https://supabase.com/dashboard"
echo "2. Sélectionnez votre projet"
echo "3. Allez dans Settings → API"
echo "4. Notez ces 3 valeurs :"
echo "   - Project URL → NEXT_PUBLIC_SUPABASE_URL"
echo "   - anon public key → NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - service_role secret key → SUPABASE_SERVICE_ROLE_KEY"
echo ""

read -p "Appuyez sur Entrée pour continuer..." 

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 ÉTAPE 2 : Configurer dans Vercel"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Ouvrir Vercel dans le navigateur
echo "Ouverture de Vercel dans votre navigateur..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    open "https://vercel.com/dashboard" 2>/dev/null
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "https://vercel.com/dashboard" 2>/dev/null
fi

echo ""
echo "Instructions :"
echo ""
echo "1. Allez sur Vercel : https://vercel.com"
echo "2. Sélectionnez votre projet"
echo "3. Allez dans Settings → Environment Variables"
echo "4. Ajoutez les 3 variables une par une :"
echo ""
echo "   Variable 1 : NEXT_PUBLIC_SUPABASE_URL"
echo "   - Key: NEXT_PUBLIC_SUPABASE_URL"
echo "   - Value: Votre URL Supabase (https://xxx.supabase.co)"
echo "   - Environments: ✅ Production, ✅ Preview, ✅ Development"
echo ""
echo "   Variable 2 : NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - Key: NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - Value: Votre clé anonyme Supabase"
echo "   - Environments: ✅ Production, ✅ Preview, ✅ Development"
echo ""
echo "   Variable 3 : SUPABASE_SERVICE_ROLE_KEY"
echo "   - Key: SUPABASE_SERVICE_ROLE_KEY"
echo "   - Value: Votre clé de service Supabase"
echo "   - Environments: ✅ Production, ✅ Preview, ✅ Development"
echo ""

read -p "Appuyez sur Entrée après avoir ajouté les variables..." 

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 ÉTAPE 3 : Redéployer l'Application"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Allez dans Deployments"
echo "2. Trouvez le dernier déploiement"
echo "3. Cliquez sur les 3 points (⋯) → Redeploy"
echo "4. Attendez 2-3 minutes"
echo ""

echo "✅ Une fois redéployé, vos variables d'environnement seront actives !"
echo ""
echo "📖 Pour plus de détails, consultez : CONFIGURER_VERCEL_ENV.md"
echo ""

