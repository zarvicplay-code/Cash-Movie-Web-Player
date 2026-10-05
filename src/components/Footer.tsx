import React from 'react';
import { CashMovieLogo } from './CashMovieLogo';

interface FooterProps {
  onOpenActivation?: () => void;
}

export const Footer: React.FC<FooterProps> = () => {
  const whatsappNumber = '5577981677591';
  const whatsappMessage = encodeURIComponent('Olá Zarvic Play, gostaria de informações e ativação do Cash Movie IPTV!');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <footer className="relative z-10 w-full border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-xl mt-auto py-5 sm:py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Brand & Made by Zarvic Play with WhatsApp Clickable Link */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <CashMovieLogo size="sm" />
          <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>
          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-300">
              <span>Feito com dedicação por</span>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-amber-300 hover:brightness-125 transition-all underline decoration-red-500/50 underline-offset-2"
                title="Falar com Zarvic Play no WhatsApp"
              >
                Zarvic Play
              </a>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Player IPTV Profissional · Ativação por MAC ID e Chave do Dispositivo
            </p>
          </div>
        </div>
      </div>

      {/* Micro Copyright line */}
      <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-slate-900/80 text-[11px] text-slate-500 font-mono text-center sm:text-left">
        © {new Date().getFullYear()} Cash Movie. Todos os direitos reservados a Cash Movie.
      </div>
    </footer>
  );
};
