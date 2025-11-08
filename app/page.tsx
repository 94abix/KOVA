import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">KOVA</h1>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-8 px-4 max-w-2xl">
          <h2 className="text-5xl font-bold text-foreground">
            Transforme chaque mouvement en progrès.
          </h2>
          <p className="text-xl text-muted-foreground">
            Analyse biomécanique intelligente pour améliorer ta technique et
            préserver ta santé.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/analyze">
              <Button size="lg" className="bg-accent hover:bg-accent-light text-white">
                Analyser une vidéo
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline">
                🎬 Voir la démonstration
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 KOVA - Sports de combat</p>
        </div>
      </footer>
    </div>
  );
}

