import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';

// ---------------------------------------------------------------------------
// DATA — Clínica Dental Louzao, Carballo (A Coruña)
// ---------------------------------------------------------------------------

const CLINIC_PHONE_DISPLAY = '981 75 54 18';
const CLINIC_PHONE_TEL = 'tel:+34981755418';
const CLINIC_ADDRESS_LINE1 = 'Rúa Vázquez de Parga, 5, 3°C';
const CLINIC_ADDRESS_LINE2 = '15100 Carballo, A Coruña';
const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('Clínica Dental Louzao, Rúa Vázquez de Parga, 5, 15100 Carballo, A Coruña');

const CLINIC_HOURS: [string, string][] = [
  ['Lunes', '10:00–14:00, 16:00–20:00'],
  ['Martes', '10:00–14:00'],
  ['Miércoles', '10:00–14:00, 16:00–20:00'],
  ['Jueves', '10:00–14:00, 16:00–20:00'],
  ['Viernes', '10:00–14:00'],
  ['Sábado', 'Cerrado'],
  ['Domingo', 'Cerrado'],
];

const HERO_IMAGE =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_113640_ccf3cf97-d447-425b-a134-d7b09fc743fc.png&w=1280&q=85';

const SECTION2_IMAGE =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_114219_414dfe80-f15c-4e25-bf52-b13721f4bd88.png&w=1280&q=85';

const SECTION3_IMG1 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_115253_c19ab167-8dd5-48b4-967d-b9f0d9d6e8fb.png&w=1280&q=85';

const SECTION3_IMG2 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_115237_fc519057-6e87-4abf-999a-9610b8b085b4.png&w=1280&q=85';

const SECTION3_BG =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_114355_752ba9e6-0942-4abb-9047-5d9bb16632e9.png&w=1280&q=85';

const featureBars = ['Odontología de Confianza', 'Equipos de Alta Calidad', 'Trato Cercano'];

const services: { name: string; num: string | null; active: boolean }[] = [
  { name: 'Revisión y\nDiagnóstico', num: '01', active: true },
  { name: 'Limpieza\nDental', num: '02', active: false },
  { name: 'Empastes y\nCaries', num: '03', active: false },
  { name: 'Ortodoncia', num: null, active: false },
];

const navLinks: { label: string; href: string }[] = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Sobre Nosotros', href: '#sobre-nosotros' },
  { label: 'Opiniones', href: '#opiniones' },
  { label: 'Contacto', href: '#contacto' },
];

// Reseñas reales de Google (Clínica Dental Louzao, 5,0★ sobre 10 reseñas)
const reviews: { name: string; meta: string; text: string; avatarColor: string }[] = [
  {
    name: 'Paula Vila Vieito',
    meta: '1 reseña · hace un año',
    text: 'Muy buen trato, puntuales y muy profesionales, con los niños tienen un trato inmejorable, super cercanas.',
    avatarColor: '#e8734a',
  },
  {
    name: 'Ana Iglesias Fernández',
    meta: '3 reseñas · hace 3 años',
    text: 'Gran atención al paciente y estupendo equipo profesional.',
    avatarColor: '#1a9e6d',
  },
  {
    name: 'The Reignman',
    meta: '3 reseñas · hace 3 años',
    text: 'Estupenda profesional, muy cercana y amable.',
    avatarColor: '#3a3a3a',
  },
];

// ---------------------------------------------------------------------------
// HOOKS
// ---------------------------------------------------------------------------

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isMobile;
}

type MaskPosition = { x: number; y: number; sw: number; sh: number };

const EMPTY_POSITION: MaskPosition = { x: 0, y: 0, sw: 0, sh: 0 };

function useMaskPositions(
  sectionRef: RefObject<HTMLElement | null>,
  cardRefs: RefObject<(HTMLElement | null)[]>,
) {
  const [positions, setPositions] = useState<MaskPosition[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const measure = () => {
      const sectionRect = section.getBoundingClientRect();
      const next = cardRefs.current.map((card) => {
        if (!card) return { ...EMPTY_POSITION, sw: sectionRect.width, sh: sectionRect.height };
        const cardRect = card.getBoundingClientRect();
        return {
          x: cardRect.left - sectionRect.left,
          y: cardRect.top - sectionRect.top,
          sw: sectionRect.width,
          sh: sectionRect.height,
        };
      });
      setPositions(next);
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(section);
    cardRefs.current.forEach((card) => card && ro.observe(card));
    window.addEventListener('resize', measure);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return positions;
}

function useImageWidth(src: string, sectionHeight: number) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!src || !sectionHeight) return;
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (!cancelled) setWidth(img.naturalWidth * (sectionHeight / img.naturalHeight));
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src, sectionHeight]);

  return width;
}

function useStaggeredReveal(threshold = 0.15) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const getAnimStyle = (index: number): CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms`,
  });

  return { containerRef, getAnimStyle };
}

// ---------------------------------------------------------------------------
// MASKED CARD
// ---------------------------------------------------------------------------

type MaskedCardProps = {
  bgImage: string;
  position: MaskPosition;
  imageWidth: number;
  focalX: number;
  className?: string;
  children?: ReactNode;
  cardRef?: (el: HTMLDivElement | null) => void;
  style?: CSSProperties;
};

function MaskedCard({ bgImage, position, imageWidth, focalX, className, children, cardRef, style }: MaskedCardProps) {
  const overflow = imageWidth > position.sw ? imageWidth - position.sw : 0;
  const focalOffset = overflow * focalX;

  return (
    <div
      ref={cardRef}
      className={className}
      style={{
        backgroundColor: '#fafaf9',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: `auto ${position.sh}px`,
        backgroundPosition: `-${position.x + focalOffset}px -${position.y}px`,
        backgroundRepeat: 'no-repeat',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SPLASH SCREEN
// ---------------------------------------------------------------------------

function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setCount(current);
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => setExiting(true), 200);
      }
    }, 20);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!exiting) return;
    const timeout = setTimeout(onComplete, 700);
    return () => clearTimeout(timeout);
  }, [exiting, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-white flex items-end justify-start transition-opacity duration-700 ${
        exiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <span className="text-7xl md:text-9xl font-bold tabular-nums p-6 md:p-10 leading-none text-black">{count}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// NAVBAR
// ---------------------------------------------------------------------------

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 py-2 md:py-3 bg-white/80 backdrop-blur-md">
        <div className="flex flex-col">
          <span className="text-xl md:text-2xl font-extrabold uppercase tracking-tight leading-none">Louzao</span>
          <span className="text-xl md:text-2xl font-extrabold uppercase tracking-tight leading-none -mt-1.5 md:-mt-2">
            Dental
          </span>
          <span className="text-[8px] md:text-[9px] font-medium leading-none mt-1.5 md:mt-2">
            clínica dental en carballo
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <span className="text-sm font-semibold text-black">Rúa Vázquez de Parga, 5 · Carballo</span>
          <a
            href={CLINIC_PHONE_TEL}
            className="px-6 py-3 bg-white rounded-full border border-black text-sm font-semibold hover:bg-black hover:text-white transition-colors duration-200"
          >
            {CLINIC_PHONE_DISPLAY}
          </a>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          className="md:hidden w-10 h-10 flex items-center justify-center relative"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span
            className={`absolute h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              menuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
            }`}
          />
          <span
            className={`absolute h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              menuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
            }`}
          />
          <span
            className={`absolute h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              menuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
            }`}
          />
        </button>
      </nav>

      <div className={`fixed inset-0 z-40 md:hidden ${menuOpen ? '' : 'pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col justify-center h-full px-8 gap-1">
            {navLinks.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-4xl font-bold text-black hover:text-neutral-500 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
                style={{
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? 'translateX(0)' : 'translateX(2rem)',
                  transitionDelay: menuOpen ? `${100 + i * 60}ms` : '0ms',
                }}
              >
                {link.label}
              </a>
            ))}

            <div
              className="mt-8 pt-8 border-t border-neutral-200 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
              style={{
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateX(0)' : 'translateX(2rem)',
                transitionDelay: menuOpen ? '450ms' : '0ms',
              }}
            >
              <p className="text-sm font-semibold text-black mb-4">Rúa Vázquez de Parga, 5 · Carballo</p>
              <a
                href={CLINIC_PHONE_TEL}
                className="block w-full text-center px-6 py-4 bg-black rounded-full text-white text-sm font-semibold hover:bg-neutral-800 transition-colors duration-200"
              >
                Llamar · {CLINIC_PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// SECTION 1 — HERO
// ---------------------------------------------------------------------------

function Section1() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const s1Reveal = useStaggeredReveal();
  const positions = useMaskPositions(sectionRef, cardRefs);
  const sectionHeight = positions[0]?.sh || 0;
  const imageWidth = useImageWidth(HERO_IMAGE, sectionHeight);
  const focalX = isMobile ? 0.7 : 0.8;

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[i] = el;
  };

  return (
    <section
      id="inicio"
      ref={(el) => {
        sectionRef.current = el;
        s1Reveal.containerRef.current = el;
      }}
      className="min-h-screen w-full overflow-hidden flex flex-col pt-24 md:pt-24 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
    >
      {featureBars.map((label, i) => (
        <MaskedCard
          key={label}
          cardRef={setCardRef(i)}
          bgImage={HERO_IMAGE}
          position={positions[i] || EMPTY_POSITION}
          imageWidth={imageWidth}
          focalX={focalX}
          className="w-full h-14 md:h-20 shrink-0 rounded-xl md:rounded-2xl overflow-hidden relative"
          style={s1Reveal.getAnimStyle(i)}
        >
          <span className="flex items-center justify-center h-full text-black text-lg md:text-3xl font-bold text-center relative z-10">
            {label}
          </span>
        </MaskedCard>
      ))}

      <MaskedCard
        cardRef={setCardRef(3)}
        bgImage={HERO_IMAGE}
        position={positions[3] || EMPTY_POSITION}
        imageWidth={imageWidth}
        focalX={focalX}
        className="w-full flex-1 min-h-0 rounded-xl md:rounded-2xl overflow-hidden relative"
        style={s1Reveal.getAnimStyle(3)}
      >
        <p className="absolute top-4 left-4 md:top-7 md:left-7 text-black text-xs md:text-sm font-semibold leading-4 md:leading-5 max-w-[200px] md:max-w-[300px] z-10">
          Cuidamos tu sonrisa con un trato cercano
          <br />
          y la tecnología dental más actual
        </p>

        <div className="absolute bottom-5 left-3 md:bottom-8 md:left-4 z-10">
          <span className="block text-black text-xs md:text-sm font-semibold mb-1 md:mb-2">
            Clínica dental de confianza en Carballo
          </span>
          <h1 className="text-black text-[clamp(3rem,11vw,11rem)] font-bold leading-[0.79] tracking-tight">
            Dental
            <br />
            Louzao
          </h1>
        </div>

        <a
          href={CLINIC_PHONE_TEL}
          className="absolute bottom-6 right-4 md:bottom-10 md:right-8 text-white text-xs md:text-sm font-semibold z-10"
        >
          Pide tu Cita
        </a>
      </MaskedCard>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION 2 — SMILE GALLERY
// ---------------------------------------------------------------------------

function Section2() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const s2Reveal = useStaggeredReveal();
  const positions = useMaskPositions(sectionRef, cardRefs);
  const sectionHeight = positions[0]?.sh || 0;
  const imageWidth = useImageWidth(SECTION2_IMAGE, sectionHeight);
  const focalX = isMobile ? 0.65 : 0.8;

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[i] = el;
  };

  return (
    <section
      id="servicios"
      ref={(el) => {
        sectionRef.current = el;
        s2Reveal.containerRef.current = el;
      }}
      className="min-h-screen w-full overflow-hidden flex flex-col pt-1.5 md:pt-2 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2 scroll-mt-20 md:scroll-mt-24"
    >
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 grid-rows-[auto_auto_auto_auto] md:grid-rows-[1fr_1fr_0.8fr] gap-1.5 md:gap-2">
        <MaskedCard
          cardRef={setCardRef(0)}
          bgImage={SECTION2_IMAGE}
          position={positions[0] || EMPTY_POSITION}
          imageWidth={imageWidth}
          focalX={focalX}
          className="rounded-xl md:rounded-2xl overflow-hidden relative min-h-[160px] md:min-h-0"
          style={s2Reveal.getAnimStyle(0)}
        >
          <h2 className="absolute top-4 left-5 md:top-6 md:left-7 text-white md:text-black text-2xl md:text-3xl font-bold z-10">
            Nuestra Clínica
          </h2>
          <p className="absolute bottom-4 left-5 md:bottom-6 md:left-7 text-white md:text-black text-xs md:text-sm font-semibold z-10">
            Atención dental de calidad en el centro de Carballo
          </p>
        </MaskedCard>

        <MaskedCard
          cardRef={setCardRef(1)}
          bgImage={SECTION2_IMAGE}
          position={positions[1] || EMPTY_POSITION}
          imageWidth={imageWidth}
          focalX={focalX}
          className="md:row-span-2 rounded-xl md:rounded-2xl overflow-hidden relative min-h-[200px] md:min-h-0"
          style={s2Reveal.getAnimStyle(1)}
        >
          <p className="absolute bottom-16 left-5 md:bottom-20 md:left-7 text-white text-xs md:text-sm font-semibold leading-4 md:leading-5 z-10">
            Si buscas un trato cercano y profesional,
            <br />
            llámanos y resolvemos todas tus dudas.
          </p>
          <a
            href={CLINIC_PHONE_TEL}
            className="absolute bottom-4 right-4 md:bottom-6 md:right-6 px-5 py-3 md:px-8 md:py-5 bg-white rounded-full text-black text-base md:text-xl font-bold z-10 hover:scale-105 transition-transform"
          >
            Llamar
          </a>
        </MaskedCard>

        <MaskedCard
          cardRef={setCardRef(2)}
          bgImage={SECTION2_IMAGE}
          position={positions[2] || EMPTY_POSITION}
          imageWidth={imageWidth}
          focalX={focalX}
          className="rounded-xl md:rounded-2xl overflow-hidden relative min-h-[160px] md:min-h-0"
          style={s2Reveal.getAnimStyle(2)}
        >
          <h3 className="absolute top-4 left-5 md:top-6 md:left-7 text-white md:text-black text-[clamp(3rem,7vw,6rem)] font-bold leading-[0.9] z-10">
            Cuidado
            <br />
            Dental
          </h3>
        </MaskedCard>

        <MaskedCard
          cardRef={setCardRef(3)}
          bgImage={SECTION2_IMAGE}
          position={positions[3] || EMPTY_POSITION}
          imageWidth={imageWidth}
          focalX={focalX}
          className="col-span-1 md:col-span-2 rounded-xl md:rounded-2xl overflow-hidden relative min-h-[200px] md:min-h-0"
          style={s2Reveal.getAnimStyle(3)}
        >
          <div className="absolute inset-0 z-10 flex flex-wrap md:flex-nowrap gap-1.5 md:gap-2 p-2 md:p-3">
            {services.map((svc) => (
              <div
                key={svc.name}
                className={`flex-1 min-w-[calc(50%-4px)] md:min-w-0 rounded-xl md:rounded-2xl p-3 md:p-5 flex flex-col justify-between ${
                  svc.active ? 'bg-white/90 backdrop-blur-md' : 'bg-black/60 backdrop-blur-xl'
                }`}
              >
                <h3
                  className={`text-xl md:text-4xl font-bold leading-[1.05] whitespace-pre-line ${
                    svc.active ? 'text-black' : 'text-white'
                  }`}
                  style={svc.active ? undefined : { textShadow: '0 1px 6px rgba(0,0,0,0.45)' }}
                >
                  {svc.name}
                </h3>
                {svc.num && (
                  <span
                    className={`self-end w-8 h-8 md:w-12 md:h-12 rounded-full border flex items-center justify-center text-xs md:text-sm font-semibold ${
                      svc.active ? 'border-black text-black' : 'border-white text-white'
                    }`}
                  >
                    {svc.num}
                  </span>
                )}
              </div>
            ))}
          </div>
        </MaskedCard>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// ARROW ICON (shared by Section 3 overlay cards)
// ---------------------------------------------------------------------------

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={`rotate-[-45deg] ${className || ''}`}>
      <path
        d="M1 7h12m0 0L8 2m5 5L8 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// SECTION 3 — CUIDADO INTEGRAL
// ---------------------------------------------------------------------------

function Section3() {
  const s3Reveal = useStaggeredReveal();

  return (
    <section
      id="sobre-nosotros"
      ref={s3Reveal.containerRef}
      className="min-h-screen w-full overflow-hidden flex flex-col pt-1.5 md:pt-2 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2 scroll-mt-20 md:scroll-mt-24"
    >
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2">
        <div className="flex flex-col gap-1.5 md:gap-2">
          <div
            className="rounded-xl md:rounded-2xl bg-stone-50 p-5 md:p-7 flex flex-col justify-between flex-[1.2] min-h-[180px] md:min-h-0"
            style={s3Reveal.getAnimStyle(0)}
          >
            <h2 className="text-[clamp(3rem,7vw,6.5rem)] font-bold leading-[0.95] text-black">
              Cuidado
              <br />
              Integral
            </h2>
            <p className="text-xs md:text-sm font-semibold text-black">Salud dental para toda la familia</p>
          </div>

          <div className="flex gap-1.5 md:gap-2 flex-1 min-h-[140px] md:min-h-0" style={s3Reveal.getAnimStyle(1)}>
            <div className="flex-1 rounded-xl md:rounded-2xl overflow-hidden">
              <img src={SECTION3_IMG1} alt="Tratamiento dental" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 rounded-xl md:rounded-2xl overflow-hidden">
              <img src={SECTION3_IMG2} alt="Cuidado dental" className="w-full h-full object-cover" />
            </div>
          </div>

          <div
            className="rounded-xl md:rounded-2xl bg-zinc-200 p-5 md:p-7 flex items-end justify-between flex-[0.8] min-h-[160px] md:min-h-0"
            style={s3Reveal.getAnimStyle(2)}
          >
            <div>
              <p className="text-xs md:text-sm font-semibold text-black mb-2 md:mb-3">Pide Cita</p>
              <h3 className="text-xl md:text-3xl font-bold text-black leading-6 md:leading-8">
                Reserva tu
                <br />
                Cita en
                <br />
                Clínica
              </h3>
            </div>
            <a
              href={CLINIC_PHONE_TEL}
              className="px-5 py-3 md:px-8 md:py-5 bg-white rounded-full text-black text-base md:text-xl font-bold hover:scale-105 transition-transform"
            >
              Llamar Ahora
            </a>
          </div>
        </div>

        <div
          className="rounded-xl md:rounded-2xl overflow-hidden relative min-h-[350px] md:min-h-0"
          style={s3Reveal.getAnimStyle(3)}
        >
          <img src={SECTION3_BG} alt="Paciente sonriendo" className="w-full h-full object-cover" />

          <div className="absolute bottom-3 left-3 right-3 md:bottom-5 md:left-5 md:right-5 flex gap-1.5 md:gap-2">
            <a
              href={CLINIC_PHONE_TEL}
              aria-label="Llamar para pedir tu primera cita"
              className="group flex-1 bg-white rounded-xl md:rounded-2xl p-3 md:p-5 flex flex-col justify-between h-36 md:h-52 hover:bg-black transition-colors"
            >
              <h4 className="text-lg md:text-2xl font-bold text-black leading-5 md:leading-7 group-hover:text-white transition-colors">
                Tu Primera
                <br />
                Visita con
                <br />
                Nosotros
              </h4>
              <span className="self-end w-9 h-9 md:w-12 md:h-12 rounded-full border border-black text-black flex items-center justify-center group-hover:border-white group-hover:text-white transition-colors">
                <ArrowIcon />
              </span>
            </a>

            <a
              href="#opiniones"
              aria-label="Ver opiniones de pacientes"
              className="flex-1 bg-black/60 backdrop-blur-xl rounded-xl md:rounded-2xl p-3 md:p-5 flex flex-col justify-between h-36 md:h-52 hover:bg-black/70 transition-colors"
            >
              <h4
                className="text-lg md:text-2xl font-bold text-white leading-5 md:leading-7"
                style={{ textShadow: '0 1px 6px rgba(0,0,0,0.45)' }}
              >
                Cuidados
                <br />
                para tu
                <br />
                Sonrisa
              </h4>
              <span className="self-end w-9 h-9 md:w-12 md:h-12 rounded-full border border-white text-white flex items-center justify-center">
                <ArrowIcon />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// OPINIONES — reseñas reales de Google
// ---------------------------------------------------------------------------

function ReviewsSection() {
  const reveal = useStaggeredReveal();

  return (
    <section
      id="opiniones"
      ref={reveal.containerRef}
      className="w-full px-3 md:px-5 pt-1.5 md:pt-2 pb-1.5 md:pb-2 scroll-mt-20 md:scroll-mt-24"
    >
      <div className="rounded-xl md:rounded-2xl bg-stone-50 p-5 md:p-10" style={reveal.getAnimStyle(0)}>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6 md:mb-10">
          <div>
            <p className="text-xs md:text-sm font-semibold text-black mb-1 md:mb-2">Opiniones</p>
            <h2 className="text-3xl md:text-5xl font-bold leading-[0.95] text-black">
              Lo que dicen
              <br />
              nuestros pacientes
            </h2>
          </div>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-black rounded-full text-white text-sm font-semibold hover:scale-105 transition-transform"
          >
            ★ 5,0 en Google
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="bg-white rounded-xl md:rounded-2xl p-5 md:p-6 flex flex-col justify-between min-h-[180px]"
            >
              <div>
                <span className="text-amber-500 text-sm tracking-wider">★★★★★</span>
                <p className="mt-3 text-sm md:text-base text-black leading-relaxed">&ldquo;{r.text}&rdquo;</p>
              </div>
              <div className="flex items-center gap-3 mt-5">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                  style={{ backgroundColor: r.avatarColor }}
                >
                  {r.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-black leading-tight">{r.name}</p>
                  <p className="text-xs text-black/50 leading-tight">{r.meta}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// CONTACT / FOOTER — real business data
// ---------------------------------------------------------------------------

function ContactFooter() {
  const reveal = useStaggeredReveal();

  return (
    <section
      id="contacto"
      ref={reveal.containerRef}
      className="w-full px-3 md:px-5 pt-1.5 md:pt-2 pb-4 md:pb-6 scroll-mt-20 md:scroll-mt-24"
    >
      <div
        className="rounded-xl md:rounded-2xl bg-black text-white p-6 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
        style={reveal.getAnimStyle(0)}
      >
        <div>
          <p className="text-xs md:text-sm font-semibold text-white/60 mb-2 md:mb-3">Visítanos</p>
          <h2 className="text-2xl md:text-4xl font-bold leading-tight mb-4 md:mb-6">
            Clínica Dental
            <br />
            Louzao
          </h2>
          <p className="text-sm md:text-base font-medium text-white/80 mb-1">{CLINIC_ADDRESS_LINE1}</p>
          <p className="text-sm md:text-base font-medium text-white/80 mb-4 md:mb-6">{CLINIC_ADDRESS_LINE2}</p>

          <div className="flex flex-wrap gap-3">
            <a
              href={CLINIC_PHONE_TEL}
              className="px-6 py-3 bg-white rounded-full text-black text-sm font-semibold hover:scale-105 transition-transform"
            >
              {CLINIC_PHONE_DISPLAY}
            </a>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white/10 border border-white/30 rounded-full text-white text-sm font-semibold hover:bg-white/20 transition-colors"
            >
              Cómo llegar
            </a>
          </div>

          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 md:mt-6 text-sm font-semibold text-white/80 hover:text-white"
          >
            ★ 5,0 en Google
          </a>
        </div>

        <div>
          <p className="text-xs md:text-sm font-semibold text-white/60 mb-2 md:mb-3">Horario</p>
          <ul className="space-y-1.5 md:space-y-2">
            {CLINIC_HOURS.map(([day, time]) => (
              <li
                key={day}
                className="flex justify-between text-sm md:text-base font-medium border-b border-white/10 pb-1.5 md:pb-2"
              >
                <span className="text-white/80">{day}</span>
                <span className={time === 'Cerrado' ? 'text-white/40' : 'text-white'}>{time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// APP
// ---------------------------------------------------------------------------

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="bg-white">
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <Navbar />
      <Section1 />
      <Section2 />
      <Section3 />
      <ReviewsSection />
      <ContactFooter />
    </div>
  );
}

export default App;
