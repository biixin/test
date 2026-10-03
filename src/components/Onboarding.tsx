import { useState } from "react";
import {
  Mic, Bell, Bluetooth, Smartphone, PhoneCall, MapPin, Users, Siren, Navigation,
  Layers, Lock, Shield,
} from "lucide-react";

type Item = { icon: typeof Mic; title: string; desc: string };
type Step = { hero: typeof Mic; tone: "primary" | "success" | "gold"; title: string; sub: string; items: Item[] };

const STEPS: Step[] = [
  {
    hero: Mic, tone: "success", title: "Permissões do Aplicativo",
    sub: "O GCM DC Rádio precisa de acesso a algumas permissões do aparelho para funcionar corretamente.",
    items: [
      { icon: Mic, title: "Gravar áudio", desc: "Fale com a equipe pelo botão PTT." },
      { icon: Bell, title: "Enviar notificações", desc: "Seja avisado quando chegar uma transmissão." },
      { icon: Bluetooth, title: "Conectar via Bluetooth", desc: "Use fones, rádios e microfones sem fio." },
      { icon: Smartphone, title: "Executar em segundo plano", desc: "Receba transmissões com a tela desligada." },
      { icon: PhoneCall, title: "Gerenciar chamadas", desc: "Evita que o rádio interfira em ligações." },
    ],
  },
  {
    hero: MapPin, tone: "primary", title: "Compartilhamento de localização",
    sub: "O app usa sua localização em segundo plano para apoiar a operação:",
    items: [
      { icon: Users, title: "Localização em tempo real", desc: "A Central acompanha a posição das guarnições em serviço." },
      { icon: Siren, title: "Alerta de emergência", desc: "Ao acionar emergência, sua localização é enviada com o áudio." },
      { icon: Navigation, title: "Envio de localização", desc: "Compartilhe sua posição com agentes e salas." },
    ],
  },
  {
    hero: Layers, tone: "gold", title: "Exibir sobre outros apps",
    sub: "Permissão avançada para respostas rápidas em serviço:",
    items: [
      { icon: Layers, title: "Botão flutuante", desc: "Fale e escute a sala atual de qualquer tela do celular." },
      { icon: Lock, title: "Na tela de bloqueio", desc: "Ao receber áudio com o aparelho bloqueado, o app aparece para resposta imediata." },
    ],
  },
];

const toneCls = {
  primary: "bg-primary/15 text-primary ring-primary/40",
  success: "bg-success/15 text-success ring-success/40",
  gold: "bg-gold/15 text-gold ring-gold/40",
};

export function Onboarding({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const s = STEPS[i] ?? STEPS[0]!;
  const Hero = s.hero;
  const next = () => (i < STEPS.length - 1 ? setI(i + 1) : onDone());

  return (
    <div className="fixed inset-0 z-50 mx-auto flex max-w-md flex-col bg-background">
      <div className="flex items-center justify-between px-5 pt-5">
        <span className="flex items-center gap-2 font-display text-sm tracking-widest text-gold">
          <Shield className="h-4 w-4" /> GCM DC
        </span>
        <div className="flex gap-1.5">
          {STEPS.map((_, k) => (
            <span key={k} className={`h-1.5 rounded-full transition-all ${k === i ? "w-6 bg-gold" : "w-1.5 bg-muted"}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="grid place-items-center py-10">
          <div className={`grid h-36 w-36 place-items-center rounded-full ring-8 ${toneCls[s.tone]}`}>
            <Hero className="h-14 w-14" />
          </div>
        </div>
        <h1 className="font-display text-3xl uppercase leading-tight tracking-wide">{s.title}</h1>
        <p className="mt-2 text-muted-foreground">{s.sub}</p>
        <ul className="mt-6 space-y-3">
          {s.items.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="flex gap-3 rounded-xl bg-card p-3.5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent text-gold">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t bg-surface p-4">
        <button onClick={next} className="w-full rounded-lg bg-primary py-3.5 font-display text-lg uppercase tracking-widest text-primary-foreground shadow-ptt">
          {i < STEPS.length - 1 ? "Continuar" : "Começar"}
        </button>
      </div>
    </div>
  );
}
