import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Onboarding } from "@/components/Onboarding";
import { playPttStart, playPttEnd } from "@/lib/radio-sound";
import {
  Clock, Radio, Users, Shield, MoreVertical, Mic, Volume2, LogOut,
  ChevronDown, Search, Signal,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Salas de Rádio — GCM Duque de Caxias" },
      { name: "description", content: "Rádio comunicador da Guarda Municipal de Duque de Caxias, com salas por distrito e bairro." },
      { property: "og:title", content: "Salas de Rádio — GCM Duque de Caxias" },
      { property: "og:description", content: "Comunicação push-to-talk por distrito e bairro para a GCM DC." },
    ],
  }),
  component: Index,
});

type Room = { id: string; name: string; online: number };
type Bairro = { name: string; rooms: Room[] };
type Distrito = { n: number; name: string; bairros: Bairro[] };

const DISTRITOS: Distrito[] = [
  { n: 1, name: "Duque de Caxias", bairros: [
    { name: "Sarapuí", rooms: [{ id: "1-sar-1", name: "Sala 01", online: 3 }, { id: "1-sar-2", name: "Sala 02", online: 0 }] },
    { name: "Centro", rooms: [{ id: "1-cen-1", name: "Sala 01", online: 5 }] },
    { name: "Jardim 25 de Agosto", rooms: [{ id: "1-j25-1", name: "Sala 01", online: 1 }] },
  ]},
  { n: 2, name: "Campos Elíseos", bairros: [
    { name: "Saracuruna", rooms: [{ id: "2-sac-1", name: "Sala 01", online: 2 }] },
    { name: "Jardim Primavera", rooms: [{ id: "2-jpr-1", name: "Sala 01", online: 0 }] },
  ]},
  { n: 3, name: "Imbariê", bairros: [
    { name: "Imbariê", rooms: [{ id: "3-imb-1", name: "Sala 01", online: 4 }] },
    { name: "Parada Angélica", rooms: [{ id: "3-par-1", name: "Sala 01", online: 1 }] },
  ]},
  { n: 4, name: "Xerém", bairros: [
    { name: "Xerém", rooms: [{ id: "4-xer-1", name: "Sala 01", online: 2 }] },
    { name: "Mantiquira", rooms: [{ id: "4-man-1", name: "Sala 01", online: 0 }] },
  ]},
];

const findRoom = (id: string) => {
  for (const d of DISTRITOS) for (const b of d.bairros) for (const r of b.rooms)
    if (r.id === id) return { d, b, r };
  return null;
};

type Tab = "recentes" | "salas" | "equipe" | "central";

function Index() {
  const [tab, setTab] = useState<Tab>("salas");
  const [current, setCurrent] = useState<string | null>("1-sar-1");
  const [talking, setTalking] = useState(false);
  const [speaker, setSpeaker] = useState(true);
  const [open, setOpen] = useState<number | null>(1);
  const [recent, setRecent] = useState<string[]>(["1-sar-1", "2-sac-1", "1-cen-1"]);
  const [onboard, setOnboard] = useState(false);
  useEffect(() => { if (!localStorage.getItem("gcm-onboarded")) setOnboard(true); }, []);
  if (onboard) return <Onboarding onDone={() => { localStorage.setItem("gcm-onboarded", "1"); setOnboard(false); }} />;

  const cur = current ? findRoom(current) : null;
  const join = (id: string) => {
    setCurrent(id);
    setRecent((r) => [id, ...r.filter((x) => x !== id)].slice(0, 6));
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-surface px-4 py-3">
        <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent">
          <Shield className="h-5 w-5 text-gold" />
          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-surface bg-success" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold leading-tight">GCM Almeida</p>
          <p className="truncate text-xs text-muted-foreground">Mat. 88198728 · Disponível</p>
        </div>
        <span className="font-display text-sm tracking-widest text-gold">GCM DC</span>
        <button aria-label="Menu" className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-muted">
          <MoreVertical className="h-5 w-5" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-56">
        {tab === "salas" && (
          <section className="px-4 pt-4">
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-muted px-3 py-2.5 text-muted-foreground">
              <Search className="h-4 w-4" />
              <input placeholder="Buscar bairro ou sala" className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
            </div>
            <div className="space-y-3">
              {DISTRITOS.map((d) => {
                const isOpen = open === d.n;
                const total = d.bairros.reduce((s, b) => s + b.rooms.reduce((x, r) => x + r.online, 0), 0);
                return (
                  <div key={d.n} className="overflow-hidden rounded-xl bg-card">
                    <button onClick={() => setOpen(isOpen ? null : d.n)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary font-display text-xl text-primary-foreground">{d.n}º</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-lg uppercase leading-none tracking-wide">{d.n}º Distrito</p>
                        <p className="mt-1 truncate text-xs text-muted-foreground">{d.name} · {d.bairros.length} bairros</p>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-success"><Users className="h-3.5 w-3.5" />{total}</span>
                      <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="border-t">
                        {d.bairros.map((b) => (
                          <div key={b.name}>
                            <p className="bg-surface px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{b.name}</p>
                            {b.rooms.map((r) => {
                              const active = current === r.id;
                              return (
                                <button key={r.id} onClick={() => join(r.id)} className={`flex w-full items-center gap-3 border-b px-4 py-3 text-left last:border-b-0 ${active ? "bg-accent" : "hover:bg-muted"}`}>
                                  <Radio className={`h-5 w-5 shrink-0 ${active ? "text-gold" : "text-muted-foreground"}`} />
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium">{r.name}</p>
                                    <p className="text-xs text-muted-foreground">{active ? "Sua sala atual" : r.online ? `${r.online} agente(s) online` : "Sem agentes"}</p>
                                  </div>
                                  <span className={`h-2.5 w-2.5 rounded-full ${r.online ? "bg-success" : "bg-muted-foreground/40"}`} />
                                </button>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {tab === "recentes" && (
          <ul>
            {recent.map((id, i) => {
              const f = findRoom(id)!;
              return (
                <li key={id}>
                  <button onClick={() => join(id)} className="flex w-full items-center gap-3 border-b px-4 py-3.5 text-left hover:bg-muted">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent font-display text-lg text-gold">{f.d.n}º</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{f.b.name} <span className="font-normal text-muted-foreground">· {f.r.name}</span></p>
                      <p className="truncate text-sm text-muted-foreground">{f.d.n}º Distrito — {f.d.name}</p>
                      <p className="text-xs text-muted-foreground">{["agora", "4 min atrás", "1 h atrás", "ontem"][i] ?? "ontem"}</p>
                    </div>
                    {f.r.online > 0 && <span className="rounded-full bg-success/20 px-2 py-0.5 text-xs text-success">{f.r.online} on</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {(tab === "equipe" || tab === "central") && (
          <div className="grid place-items-center px-8 py-24 text-center text-muted-foreground">
            {tab === "equipe" ? <Users className="mb-3 h-10 w-10" /> : <Shield className="mb-3 h-10 w-10" />}
            <p className="font-medium text-foreground">{tab === "equipe" ? "Equipe" : "Central"}</p>
            <p className="text-sm">Em breve.</p>
          </div>
        )}
      </main>

      {/* Painel PTT fixo */}
      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md">
        {cur && (
          <div className="flex items-center gap-3 border-t bg-surface px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-gold"><Signal className="h-3 w-3" />{cur.d.n}º Distrito · {cur.b.name}</p>
              <p className="truncate font-display text-xl uppercase tracking-wide">{cur.r.name}</p>
              <p className={`text-xs ${talking ? "text-destructive" : "text-muted-foreground"}`}>{talking ? "Transmitindo…" : "Canal livre — segure para falar"}</p>
            </div>
            <button onClick={() => setSpeaker(!speaker)} aria-label="Alto-falante" className={`grid h-10 w-10 place-items-center rounded-full ${speaker ? "bg-accent text-foreground" : "bg-muted text-muted-foreground"}`}>
              <Volume2 className="h-5 w-5" />
            </button>
            <button onClick={() => setCurrent(null)} aria-label="Sair da sala" className="grid h-10 w-10 place-items-center rounded-full bg-muted text-muted-foreground">
              <LogOut className="h-5 w-5" />
            </button>
            <button
              onPointerDown={() => { if (!talking) playPttStart(); setTalking(true); }}
              onPointerUp={() => { if (talking) playPttEnd(); setTalking(false); }}
              onPointerLeave={() => { if (talking) playPttEnd(); setTalking(false); }}
              aria-label="Segure para falar"
              className={`grid h-16 w-16 shrink-0 select-none place-items-center rounded-full transition-all ${talking ? "scale-110 bg-destructive text-destructive-foreground shadow-ptt-live" : "bg-primary text-primary-foreground shadow-ptt"}`}
            >
              <Mic className="h-7 w-7" />
            </button>
          </div>
        )}
        <nav className="grid grid-cols-4 border-t bg-surface">
          {([
            ["recentes", "Recentes", Clock],
            ["salas", "Salas", Radio],
            ["equipe", "Equipe", Users],
            ["central", "Central", Shield],
          ] as const).map(([k, label, Icon]) => (
            <button key={k} onClick={() => setTab(k)} className={`flex flex-col items-center gap-1 py-2.5 text-xs ${tab === k ? "text-primary" : "text-muted-foreground"}`}>
              <Icon className="h-5 w-5" />{label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
