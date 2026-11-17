import { createFileRoute } from "@tanstack/react-router";
import { createElement, useEffect } from "react";
import bg from "@/assets/gta6-hero-background.jpg.asset.json";

const PLAYER_SRC =
  "https://scripts.converteai.net/ad025f94-97fb-487a-9d36-7c139a6e8963/players/6afca30723042be373eb7af4/v4/player.js";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cortes de GTA 6 — Faça de R$ 3.000 a R$ 20.000 por mês" },
      { name: "description", content: "Transforme lives de GTA em dezenas de cortes com poucos cliques e faça sua conta viralizar." },
      { property: "og:title", content: "Cortes de GTA 6 — Faça de R$ 3.000 a R$ 20.000 por mês" },
      { property: "og:description", content: "Transforme lives de GTA em dezenas de cortes com poucos cliques e faça sua conta viralizar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;600&display=swap" },
      { rel: "preload", href: PLAYER_SRC, as: "script" },
      { rel: "dns-prefetch", href: "https://cdn.converteai.net" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    if (document.querySelector(`script[src="${PLAYER_SRC}"]`)) return;
    const s = document.createElement("script");
    s.src = PLAYER_SRC;
    s.async = true;
    document.head.appendChild(s);
  }, []);

  return (
    <main
      className="relative min-h-screen bg-background bg-cover bg-center bg-fixed px-4 py-12"
      style={{ backgroundImage: `url(${bg.url})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/90" />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <h1 className="font-display text-3xl uppercase leading-tight text-foreground drop-shadow-lg sm:text-5xl">
          Aprenda a transformar lives de GTA em <span className="text-primary">dezenas de cortes</span> com apenas alguns cliques e faça sua conta viralizar como eu fiz.
        </h1>
        <p className="mt-5 font-body text-lg text-foreground/90 sm:text-xl">
          Veja como fazer de <strong className="text-primary">R$ 3.000 a R$ 20.000 por mês</strong> com cortes de GTA 6.
        </p>
        <div className="mt-8 w-full max-w-[400px] overflow-hidden rounded-xl shadow-[0_20px_60px_-15px_var(--primary)] ring-2 ring-primary/60">
          {createElement(
            "vturb-smartplayer",
            { id: "vid-6afca30723042be373eb7af4", style: { display: "block", margin: "0 auto", width: "100%", maxWidth: 400 } },
            <div style={{ position: "relative", width: "100%", padding: "177.77777777777777% 0 0", zIndex: 0, backgroundColor: "black" }} className="vturb-player-placeholder" />,
          )}
        </div>
      </div>
    </main>
  );
}
