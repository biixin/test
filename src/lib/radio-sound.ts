import radioAsset from "@/assets/radio-ptt.mp3.asset.json";

let audio: HTMLAudioElement | null = null;

/** Apertou o PTT: toca o som de rádio */
export function playPttStart() {
  if (typeof window === "undefined") return;
  audio ??= new Audio(radioAsset.url);
  audio.currentTime = 0;
  void audio.play().catch(() => {});
}

/** Soltou o PTT: interrompe o som */
export function playPttEnd() {
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
}
