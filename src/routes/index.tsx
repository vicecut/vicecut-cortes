import { createFileRoute } from "@tanstack/react-router";
import { createElement, useEffect, useState } from "react";
import bg from "@/assets/gta6-hero-background.jpg.asset.json";

const PLAYER_SRC =
  "https://scripts.converteai.net/ad025f94-97fb-487a-9d36-7c139a6e8963/players/6afca30723042be373eb7af4/v4/player.js";

const CHECKOUT_URL = "https://pay.cakto.com.br/gkhx4xk_1336725";
// The sales video is 4:51 long; the link must show at the 4:00 mark.
const CHECKOUT_AT_SECONDS = 4 * 60;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Crie e Poste cortes todo dia com apenas um clique — Cortes de GTA 6" },
      { name: "description", content: "Crie e poste cortes todo dia com apenas um clique e transforme views em dinheiro. Veja como fazer de R$ 3.000 a R$ 20.000 por mês com cortes de GTA 6." },
      { property: "og:title", content: "Crie e Poste cortes todo dia com apenas um clique — transforme views em dinheiro" },
      { property: "og:description", content: "Crie e poste cortes todo dia com apenas um clique e transforme views em dinheiro. De R$ 3.000 a R$ 20.000 por mês com cortes de GTA 6." },
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

/**
 * Shows the checkout link once the visitor reaches the 4:00 mark of the sales video.
 * The VTurb player swaps in its real <video> after the visitor interacts, so we
 * watch the DOM for a video with a real duration instead of trusting the first one.
 */
function useCheckoutMomentReached() {
  const [reached, setReached] = useState(false);

  useEffect(() => {
    const watched = new WeakSet<HTMLVideoElement>();
    let timer = 0;

    const check = (v: HTMLVideoElement) => {
      const dur = v.duration;
      if (!isFinite(dur) || dur <= 0) return;
      // Ignore the player's tiny pre-roll stub: only a video long enough to reach
      // the 4:00 mark can trigger the link.
      if (dur <= CHECKOUT_AT_SECONDS) return;
      if (v.currentTime >= CHECKOUT_AT_SECONDS) setReached(true);
    };

    const attach = (v: HTMLVideoElement) => {
      if (watched.has(v)) return;
      watched.add(v);
      const onUpdate = () => check(v);
      v.addEventListener("timeupdate", onUpdate);
      v.addEventListener("durationchange", onUpdate);
      v.addEventListener("loadedmetadata", onUpdate);
      v.addEventListener("ended", () => setReached(true));
      check(v);
    };

    const scan = () => {
      document.querySelectorAll("video").forEach((v) => attach(v as HTMLVideoElement));
    };

    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true });
    scan();
    timer = window.setInterval(scan, 1500);

    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, []);

  return reached;
}

function CheckoutBar() {
  const show = useCheckoutMomentReached();

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-primary/60 bg-background/95 px-4 py-4 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-2 text-center">
        <p className="font-body text-sm text-foreground/80 sm:text-base">
          Garanta sua vaga agora e comece a postar seus cortes hoje.
        </p>
        <a
          href={CHECKOUT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-md rounded-full bg-primary px-8 py-4 font-display text-xl uppercase tracking-wide text-primary-foreground shadow-[0_12px_40px_-8px_var(--primary)] transition-transform hover:scale-[1.03] sm:text-2xl"
        >
          Quero começar agora
        </a>
      </div>
    </div>
  );
}

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
      className="relative min-h-screen bg-background bg-cover bg-center bg-fixed px-4 py-10"
      style={{ backgroundImage: `url(${bg.url})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/90" />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
        <h1
          className="font-display uppercase leading-[0.92] text-foreground drop-shadow-[0_6px_24px_rgba(0,0,0,0.75)]"
          style={{ fontSize: "clamp(2.6rem, 8.5vw, 7rem)" }}
        >
          Crie e Poste <span className="text-primary">cortes todo dia</span> com apenas um clique e transforme <span className="text-primary">views em dinheiro</span>
        </h1>
        <p className="mt-6 font-body text-xl font-semibold text-foreground/95 sm:text-2xl">
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
      <CheckoutBar />
    </main>
  );
}
