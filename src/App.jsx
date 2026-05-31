import { useState, useEffect, useRef } from 'react';
import {
  Menu, X, ArrowDown, Sparkles, Cloud, Shield, Brain,
  Terminal, ExternalLink, Layers, GraduationCap,
  Award, Link, GitBranch, Mail, Zap,
  User, Briefcase, Code, Database, Send, CheckCircle2, Loader2, FileText,
  Eye, Globe, Monitor, Smartphone, Tablet
} from 'lucide-react';

const initialParticles = Array.from({ length: 30 }, () => ({
  size: Math.random() * 5 + 2,
  left: Math.random() * 100,
  animDuration: Math.random() * 10 + 10,
  animDelay: Math.random() * 10,
}));

// --- ESTILOS GLOBALES Y ANIMACIONES (CSS PURO INYECTADO) ---
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
    html { scroll-behavior: smooth; }
    body { background-color: #020617; /* slate-950 */ overflow-x: hidden; }
    
    /* Custom Scrollbar */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #020617; }
    ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #475569; }

    /* Keyframes */
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    .animate-float { animation: float 6s ease-in-out infinite; }
    
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin-slow { animation: spin-slow 20s linear infinite; }
    
    @keyframes spin-slow-reverse {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }
    .animate-spin-slow-reverse { animation: spin-slow-reverse 25s linear infinite; }

    @keyframes blink { 50% { opacity: 0; } }
    .typing-cursor { animation: blink 1s step-end infinite; }

    /* Partículas sutiles - Ahora más neutrales */
    .particles-bg {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: 0; pointer-events: none;
    }
    .particle {
      position: absolute; border-radius: 50%; background: rgba(255, 255, 255, 0.03);
      animation: floatUp 15s infinite linear;
    }
    @keyframes floatUp {
      0% { transform: translateY(100vh) scale(0); opacity: 0; }
      20% { opacity: 1; }
      80% { opacity: 1; }
      100% { transform: translateY(-100px) scale(1); opacity: 0; }
    }
  `}} />
);

// --- COMPONENTES AUXILIARES ---

// 0. Utilidad de Gemini API
const callGemini = async (prompt) => {
  const apiKey = "";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  const delays = [1000, 2000, 4000, 8000, 16000];
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "La IA no pudo generar una respuesta.";
    } catch {
      if (attempt === delays.length) return "Error de conexión con la IA. Intenta más tarde.";
      await new Promise(res => setTimeout(res, delays[attempt]));
    }
  }
};

// 1. Hook para animaciones al hacer scroll
const FadeInSection = ({ children, delay = 0 }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setVisible(true);
      });
    }, { threshold: 0.1 });

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// 2. Componente Typewriter
const Typewriter = ({ words }) => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const handleType = () => {
      const i = loopNum % words.length;
      const fullText = words[i];

      setText(isDeleting
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 100);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, words]);

  return (
    <span className="text-slate-200 font-medium">
      {text}<span className="typing-cursor text-indigo-400">|</span>
    </span>
  );
};

// 3. Fondo de Partículas Dinámicas
const Particles = () => {
  return (
    <div className="particles-bg">
      {initialParticles.map((particle, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width: `${particle.size}px`, height: `${particle.size}px`, left: `${particle.left}%`,
            animationDuration: `${particle.animDuration}s`, animationDelay: `${particle.animDelay}s`
          }}
        />
      ))}
    </div>
  );
};

// --- SECCIONES PRINCIPALES ---

const translations = {
  es: {
    nav: [
      { label: 'Inicio', href: '#hero' },
      { label: 'Perfil', href: '#profile' },
      { label: 'Skills', href: '#skills' },
      { label: 'Experiencia', href: '#experience' },
      { label: 'Proyectos', href: '#projects' },
      { label: 'Contacto', href: '#contact' }
    ],
    hero: {
      status: "Disponible para contratación",
      greeting: "Hola, soy",
      description: (
        <>
          Egresado de SENATI con <span className="text-slate-200 font-semibold">Título a Nombre de la Nación</span>. Orientado a la creación de arquitecturas <span className="text-indigo-400 font-semibold">seguras y escalables</span>, y a la integración avanzada de <span className="text-slate-200 font-semibold">hardware y software (IoT)</span>.
        </>
      ),
      btnProjects: "Ver Proyectos",
      btnCv: "Ver mi CV",
      btnContact: "Contactar",
      roles: [
        "Ingeniero de Software.",
        "Especialista en Inteligencia Artificial.",
        "Desarrollador Cloud & Backend.",
        "Experto en Seguridad & Keycloak."
      ]
    },
    profile: {
      badge: "Conóceme",
      title: "Perfil Profesional",
      p1: (
        <>
          Soy un <strong className="text-slate-200">Ingeniero de Software especializado en Inteligencia Artificial</strong>, recientemente titulado a Nombre de la Nación por SENATI.
        </>
      ),
      p2: (
        <>
          A lo largo de mis 3 años de formación dual, he desarrollado una fuerte pasión por la ciberseguridad, la gestión de identidades y la arquitectura en la nube. Mi proyecto de tesis destacó por implementar un <strong className="text-indigo-400">sistema de autenticación física NFC integrado con Keycloak</strong>, obteniendo una calificación de excelencia (15).
        </>
      ),
      p3: (
        <>
          Me destaco por mi capacidad para resolver problemas complejos, mi inglés técnico certificado (Nivel B2) y mi enfoque en crear código limpio y mantenible.
        </>
      ),
      degreeTitle: "Título Oficial",
      degreeSub: "A Nombre de la Nación",
      degreeClick: "Clic para previsualizar →",
      modalTitle: "Mi Título Profesional",
      modalAlt: "Título Oficial a Nombre de la Nación",
      specialtyTitle: "Especialidad",
      specialtySub: "Inteligencia Artificial",
      cloudTitle: "Cloud & IoT",
      cloudSub: "AWS, Azure & NFC",
      englishTitle: "Inglés B2",
      englishSub: "Certificación Técnica"
    },
    skills: {
      badge: "Habilidades",
      title: "Arsenal Técnico",
      tooltips: {
        python: "Machine Learning & Scripts",
        node: "Backend Runtime",
        react: "Interfaces de Usuario",
        tailwind: "Estilos Rápidos",
        keycloak: "Gestión de Identidades IAM",
        aws: "Infraestructura Cloud",
        docker: "Contenedores y DevOps",
        postgres: "Base de Datos Relacional",
        supabase: "Backend as a Service",
        git: "Control de Versiones"
      }
    },
    experience: {
      badge: "Trayectoria",
      title: "Experiencia Profesional",
      list: [
        {
          period: "2024 - 2026",
          role: "Desarrollador Backend & Especialista en Gestión de Identidades (IAM)",
          company: "Hospital Santa Teresa",
          desc: [
            "Arquitecturicé y desarrollé desde cero un sistema de control de accesos físico y lógico.",
            "Integré hardware de lectura NFC con un servidor backend escalable.",
            "Implementé Keycloak para la gestión de identidades, garantizando seguridad criptográfica y autenticación robusta para los usuarios."
          ]
        },
        {
          period: "2024 - 2025",
          role: "Analista de Infraestructura Cloud y Bases de Datos (Trainee)",
          company: "Hospital Santa Teresa",
          desc: [
            "Desplegué y administré infraestructura básica en la nube orientada a la alta disponibilidad.",
            "Configuré y optimicé entornos Linux para servidores de producción.",
            "Realicé tareas de análisis y mantenimiento de bases de datos relacionales, asegurando la integridad de la información."
          ]
        },
        {
          period: "2023 - 2024",
          role: "Soporte TI y Desarrollador de Herramientas Internas",
          company: "Hospital Santa Teresa",
          desc: [
            "Desarrollé scripts y herramientas de automatización para optimizar procesos internos.",
            "Mantuve y optimicé consultas en bases de datos SQL.",
            "Mejoré el rendimiento y la experiencia de usuario (UX) en diversas interfaces frontend utilizando tecnologías modernas."
          ]
        }
      ]
    },
    projects: {
      badge: "Portafolio",
      title: "Proyectos Destacados",
      filterAll: "Todos",
      filterWeb: "Web",
      filterMovil: "Movil",
      list: [
        {
          title: 'Control de Accesos NFC + Keycloak',
          description: 'Arquitectura IoT para validación de ingresos. Usa Keycloak como IAM para asegurar la trazabilidad y tokens criptográficos.'
        },
        {
          title: 'Infraestructura Cloud Escalar',
          description: 'Migración y estructuración de servicios locales hacia Amazon Web Services (AWS) priorizando alta disponibilidad.'
        },
        {
          title: 'Plataforma MarketPro API',
          description: 'API RESTFul construida para e-commerce, con integración a pasarelas de pago y gestión de BD no relacionales.'
        },
        {
          title: 'Modelo Predictivo Académico',
          description: 'Algoritmo de Machine Learning implementado en Python para analizar grandes volúmenes de datos estudiantiles.'
        }
      ]
    },
    contact: {
      badge: "Hablemos de código",
      title: (
        <>
          ¿Construimos el futuro <span className="text-transparent bg-clip-text bg-linear-to-r from-slate-300 to-slate-500 font-bold">juntos?</span>
        </>
      ),
      description: "Estoy buscando oportunidades para integrarme a equipos de tecnología. Si buscas un ingeniero comprometido con la seguridad y escalabilidad, mándame un mensaje.",
      labelName: "Nombre completo",
      placeholderName: "Ej. Carlos Torres",
      labelEmail: "Correo electrónico",
      placeholderEmail: "carlos@empresa.com",
      labelMessage: "Mensaje",
      placeholderMessage: "Hola Nelson, me interesa tu perfil para un proyecto...",
      btnSend: "Enviar Mensaje",
      btnSending: "Procesando...",
      btnSent: "¡Mensaje Listo!",
      errSubmit: "Hubo un problema al procesar el mensaje con Web3Forms. Por favor, intenta de nuevo.",
      errConn: "Error de conexión al enviar el mensaje. Por favor, revisa tu conexión a internet."
    },
    footer: {
      copyright: "Nelson Aguirre Ocsa. Diseño y Desarrollo."
    }
  },
  en: {
    nav: [
      { label: 'Home', href: '#hero' },
      { label: 'Profile', href: '#profile' },
      { label: 'Skills', href: '#skills' },
      { label: 'Experience', href: '#experience' },
      { label: 'Projects', href: '#projects' },
      { label: 'Contact', href: '#contact' }
    ],
    hero: {
      status: "Available for hire",
      greeting: "Hi, I am",
      description: (
        <>
          Graduate from SENATI with a <span className="text-slate-200 font-semibold">National Professional Degree</span>. Focused on building <span className="text-indigo-400 font-semibold">secure and scalable</span> architectures, and advanced integration of <span className="text-slate-200 font-semibold">hardware and software (IoT)</span>.
        </>
      ),
      btnProjects: "View Projects",
      btnCv: "View my CV",
      btnContact: "Contact",
      roles: [
        "Software Engineer.",
        "Artificial Intelligence Specialist.",
        "Cloud & Backend Developer.",
        "Security & Keycloak Expert."
      ]
    },
    profile: {
      badge: "About Me",
      title: "Professional Profile",
      p1: (
        <>
          I am a <strong className="text-slate-200">Software Engineer specializing in Artificial Intelligence</strong>, recently graduated with a National Professional Degree from SENATI (Abancay).
        </>
      ),
      p2: (
        <>
          Throughout my 3 years of dual training, I have developed a strong passion for cybersecurity, identity management, and cloud architecture. My thesis project stood out for implementing a <strong className="text-indigo-400">physical NFC authentication system integrated with Keycloak</strong>, achieving a score of excellence (15).
        </>
      ),
      p3: (
        <>
          I stand out for my ability to solve complex problems, my certified technical English (B2 Level), and my focus on creating clean and maintainable code.
        </>
      ),
      degreeTitle: "Official Degree",
      degreeSub: "National Professional Degree",
      degreeClick: "Click to preview →",
      modalTitle: "My Professional Degree",
      modalAlt: "Official National Professional Degree",
      specialtyTitle: "Specialty",
      specialtySub: "Artificial Intelligence",
      cloudTitle: "Cloud & IoT",
      cloudSub: "AWS, Azure & NFC",
      englishTitle: "English B2",
      englishSub: "Technical Certification"
    },
    skills: {
      badge: "Skills",
      title: "Technical Arsenal",
      tooltips: {
        python: "Machine Learning & Scripts",
        node: "Backend Runtime",
        react: "User Interfaces",
        tailwind: "Rapid Styling",
        keycloak: "IAM Identity Management",
        aws: "Cloud Infrastructure",
        docker: "Containers & DevOps",
        postgres: "Relational Database",
        supabase: "Backend as a Service",
        git: "Version Control"
      }
    },
    experience: {
      badge: "Timeline",
      title: "Professional Experience",
      list: [
        {
          period: "2024 - 2026",
          role: "Backend Developer & Identity Management Specialist (IAM)",
          company: "Hospital Santa Teresa",
          desc: [
            "Architected and developed a physical and logical access control system from scratch.",
            "Integrated NFC reader hardware with a scalable backend server.",
            "Implemented Keycloak for identity management, guaranteeing cryptographic security and robust user authentication."
          ]
        },
        {
          period: "2024 - 2025",
          role: "Cloud Infrastructure & Database Analyst (Trainee)",
          company: "Hospital Santa Teresa",
          desc: [
            "Deployed and managed basic cloud infrastructure oriented towards high availability.",
            "Configured and optimized Linux environments for production servers.",
            "Performed database analysis and maintenance tasks for relational databases, ensuring information integrity."
          ]
        },
        {
          period: "2023 - 2024",
          role: "IT Support & Internal Tools Developer",
          company: "Hospital Santa Teresa",
          desc: [
            "Developed scripts and automation tools to optimize internal processes.",
            "Maintained and optimized queries in SQL databases.",
            "Improved performance and user experience (UX) across various frontend interfaces using modern technologies."
          ]
        }
      ]
    },
    projects: {
      badge: "Portfolio",
      title: "Featured Projects",
      filterAll: "All",
      filterWeb: "Web",
      filterMovil: "Mobile",
      list: [
        {
          title: 'NFC Access Control + Keycloak',
          description: 'IoT architecture for entry validation. Uses Keycloak as IAM to ensure traceability and cryptographic tokens.'
        },
        {
          title: 'Scalable Cloud Infrastructure',
          description: 'Migration and structuring of local services to Amazon Web Services (AWS) prioritizing high availability.'
        },
        {
          title: 'MarketPro API Platform',
          description: 'RESTful API built for e-commerce, with payment gateway integrations and non-relational DB management.'
        },
        {
          title: 'Academic Predictive Model',
          description: 'Machine Learning algorithm implemented in Python to analyze large volumes of student data.'
        }
      ]
    },
    contact: {
      badge: "Let's talk code",
      title: (
        <>
          Shall we build the future <span className="text-transparent bg-clip-text bg-linear-to-r from-slate-300 to-slate-500 font-bold">together?</span>
        </>
      ),
      description: "I am seeking opportunities to join technology teams. If you are looking for an engineer committed to security and scalability, drop me a message.",
      labelName: "Full Name",
      placeholderName: "e.g., Carlos Torres",
      labelEmail: "Email Address",
      placeholderEmail: "carlos@company.com",
      labelMessage: "Message",
      placeholderMessage: "Hi Nelson, I am interested in your profile for a project...",
      btnSend: "Send Message",
      btnSending: "Sending...",
      btnSent: "Message Sent!",
      errSubmit: "There was a problem processing your message with Web3Forms. Please try again.",
      errConn: "Connection error while sending the message. Please check your internet connection."
    },
    footer: {
      copyright: "Nelson Aguirre Ocsa. Design & Development."
    }
  }
};

const Navbar = ({ language, setLanguage }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = translations[language].nav;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-slate-800/60 backdrop-blur-xl bg-slate-950/80 py-3' : 'bg-transparent py-5'}`}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between">
          <a href="#hero" className="transition-all duration-300 hover:scale-105 transform flex items-center">
            <img src="/dev_logo.webp" alt="Nelson Dev" className="h-10 w-auto object-contain" />
          </a>

          <div className="flex items-center gap-8">
            {/* Desktop NavLinks */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors duration-300 tracking-wide relative group">
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-100 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>

            {/* Selector de idioma - Escritorio */}
            <div className="hidden md:block">
              <button
                onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                aria-label={language === 'es' ? 'Cambiar idioma a inglés' : 'Switch language to Spanish'}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:text-white text-slate-300 text-xs font-bold transition-all duration-300 cursor-pointer"
              >
                <Globe size={16} />
                <span>{language === 'es' ? 'ES' : 'EN'}</span>
              </button>
            </div>

            {/* Selector de idioma - Móvil + Botón de Menú */}
            <div className="flex md:hidden items-center gap-3">
              <button
                onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                aria-label={language === 'es' ? 'Cambiar idioma a inglés' : 'Switch language to Spanish'}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/50 text-slate-300 text-xs font-bold cursor-pointer"
              >
                <Globe size={14} />
                <span>{language === 'es' ? 'ES' : 'EN'}</span>
              </button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? (language === 'es' ? 'Cerrar menú de navegación' : 'Close navigation menu') : (language === 'es' ? 'Abrir menú de navegación' : 'Open navigation menu')}
                className="text-slate-300 hover:text-slate-50 transition-colors"
              >
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Menú Móvil */}
        <div className={`md:hidden absolute w-full left-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-96 py-4' : 'max-h-0 py-0'}`}>
          <div className="flex flex-col gap-4 px-6">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="text-base font-medium text-slate-300 hover:text-slate-100 transition-colors duration-300">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Hero = ({ language }) => {
  const t = translations[language].hero;
  const roles = t.roles;

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <Particles />
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }} />

      {/* Layout principal de dos columnas */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 flex flex-col lg:flex-row items-center justify-between gap-12 w-full py-16">

        {/* ── COLUMNA IZQUIERDA: Texto ── */}
        <div className="lg:w-1/2 text-center lg:text-left flex flex-col items-center lg:items-start">
          <FadeInSection>
            {/* Badge disponible */}
            <div className="group inline-flex items-center gap-3 px-4 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 mb-8 backdrop-blur-sm hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-all duration-300 cursor-default shadow-[0_0_15px_rgba(99,102,241,0.05)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono text-slate-300 uppercase tracking-widest group-hover:text-slate-100 transition-colors">
                {t.status}
              </span>
            </div>

            <p className="text-slate-400 text-lg md:text-xl mb-4 tracking-wide font-medium">
              {t.greeting}
            </p>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-slate-50 mb-6 tracking-tight leading-tight">
              Nelson Aguirre Ocsa
            </h1>
            <h2 className="text-2xl md:text-4xl font-semibold text-slate-300 mb-8 h-12">
              <Typewriter words={roles} />
            </h2>

            <div className="text-slate-400 text-base md:text-lg max-w-xl mb-8 leading-relaxed">
              {t.description}
            </div>

            {/* Redes sociales */}
            <div className="flex flex-wrap items-center gap-3 mt-6 justify-center lg:justify-start mb-10">
              <a
                href="https://github.com/Nelson7298"
                target="_blank"
                rel="noreferrer"
                aria-label={language === 'es' ? 'Ver perfil de GitHub de Nelson' : 'View Nelson\'s GitHub profile'}
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/40 border border-slate-700/50 backdrop-blur-md text-sm font-medium text-slate-300 hover:bg-slate-700/60 hover:text-white hover:border-slate-600 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
              >
                <Github size={18} />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/nelson-aguirre-dev/"
                target="_blank"
                rel="noreferrer"
                aria-label={language === 'es' ? 'Ver perfil de LinkedIn de Nelson' : 'View Nelson\'s LinkedIn profile'}
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/40 border border-slate-700/50 backdrop-blur-md text-sm font-medium text-slate-300 hover:bg-slate-700/60 hover:text-white hover:border-slate-600 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
              >
                <LinkedinIcon size={18} />
                <span>LinkedIn</span>
              </a>
              <a
                href="mailto:mirianaguirreabancay@gmail.com"
                aria-label={language === 'es' ? 'Enviar correo electrónico a Nelson' : 'Send email to Nelson'}
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/40 border border-slate-700/50 backdrop-blur-md text-sm font-medium text-slate-300 hover:bg-slate-700/60 hover:text-white hover:border-slate-600 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
              >
                <GmailIcon size={18} />
                <span>mirianaguirreabancay@gmail.com</span>
              </a>
            </div>

            {/* Botones CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start flex-wrap">
              <a href="#projects" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-100 text-slate-900 text-sm font-bold tracking-wide hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(241,245,249,0.1)] hover:-translate-y-1">
                <Code size={18} /> {t.btnProjects}
              </a>
              <a
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-800/50 border border-slate-700 text-slate-300 rounded-xl overflow-hidden transition-all duration-300 hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]"
              >
                <div className="absolute inset-0 bg-orange-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out z-0" />
                <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                  <FileText size={18} /> {t.btnCv}
                </span>
              </a>
              <a href="#contact" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-slate-700 text-slate-300 text-sm font-semibold tracking-wide hover:bg-slate-800 hover:text-slate-100 transition-all duration-300 hover:-translate-y-1">
                <Mail size={18} /> {t.btnContact}
              </a>
            </div>
          </FadeInSection>
        </div>

        {/* ── COLUMNA DERECHA: Fotografía con Gradient Mask ── */}
        <div className="lg:w-1/2 w-full max-w-md mx-auto mt-6 lg:mt-0 flex justify-center relative">
          <img
            src="/Mi_foto.webp"
            alt="Nelson Aguirre"
            decoding="async"
            fetchPriority="high"
            className="w-full h-auto object-cover object-[center_20%] -translate-y-6 lg:translate-y-0 max-h-[500px] lg:max-h-[700px] drop-shadow-2xl animate-float"
            style={{
              maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
            }}
          />
        </div>

      </div>

      {/* Flecha scroll down */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <a href="#profile" className="text-slate-600 hover:text-slate-300 transition-colors duration-300 animate-bounce block p-2">
          <ArrowDown size={28} />
        </a>
      </div>

    </section>
  );
};

const Profile = ({ language }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = translations[language].profile;

  return (
    <section id="profile" className="py-24 relative bg-slate-900/30">
      <div className="mx-auto max-w-7xl px-6">
        <FadeInSection>
          <div className="flex items-center gap-3 mb-4">
            <User size={18} className="text-indigo-400" />
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">{t.badge}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-12 tracking-tight">{t.title}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg">
              <p>{t.p1}</p>
              <p>{t.p2}</p>
              <p>{t.p3}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Tarjeta 1: Título Oficial (Azul) */}
              <div
                onClick={() => setIsModalOpen(true)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsModalOpen(true); } }}
                role="button"
                tabIndex={0}
                aria-label={language === 'es' ? 'Ver título profesional oficial a nombre de la nación' : 'View official national professional degree'}
                className="group relative p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:bg-slate-800/50 hover:border-slate-700 transition-all duration-300 overflow-hidden cursor-pointer shadow-lg hover:shadow-blue-900/10 text-blue-400"
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink size={18} className="text-blue-400" />
                </div>
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-300 mb-4">
                  <GraduationCap size={24} className="group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="text-slate-50 font-semibold mb-1">{t.degreeTitle}</h4>
                <p className="text-sm text-slate-400">{t.degreeSub}</p>
                <p className="text-xs text-blue-400 mt-3 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {t.degreeClick}
                </p>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-current opacity-5 blur-2xl group-hover:opacity-10 transition-opacity duration-300 rounded-full pointer-events-none"></div>
              </div>

              {/* Tarjeta 2: Especialidad IA (Morado) */}
              <div className="group relative p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:bg-slate-800/50 hover:border-slate-700 transition-all duration-300 overflow-hidden text-purple-400 shadow-lg hover:shadow-purple-900/10">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all duration-300 mb-4">
                  <Brain size={24} className="group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="text-slate-50 font-semibold mb-1">{t.specialtyTitle}</h4>
                <p className="text-sm text-slate-400">{t.specialtySub}</p>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-current opacity-5 blur-2xl group-hover:opacity-10 transition-opacity duration-300 rounded-full pointer-events-none"></div>
              </div>

              {/* Tarjeta 3: Cloud & IoT (Cian) */}
              <div className="group relative p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:bg-slate-800/50 hover:border-slate-700 transition-all duration-300 overflow-hidden text-cyan-400 shadow-lg hover:shadow-cyan-900/10">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all duration-300 mb-4">
                  <Cloud size={24} className="group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="text-slate-50 font-semibold mb-1">{t.cloudTitle}</h4>
                <p className="text-sm text-slate-400">{t.cloudSub}</p>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-current opacity-5 blur-2xl group-hover:opacity-10 transition-opacity duration-300 rounded-full pointer-events-none"></div>
              </div>

              {/* Tarjeta 4: Inglés B2 (Esmeralda) */}
              <div className="group relative p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:bg-slate-800/50 hover:border-slate-700 transition-all duration-300 overflow-hidden text-emerald-400 shadow-lg hover:shadow-emerald-900/10">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all duration-300 mb-4">
                  <Award size={24} className="group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="text-slate-50 font-semibold mb-1">{t.englishTitle}</h4>
                <p className="text-sm text-slate-400">{t.englishSub}</p>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-current opacity-5 blur-2xl group-hover:opacity-10 transition-opacity duration-300 rounded-full pointer-events-none"></div>
              </div>
            </div>
          </div>
        </FadeInSection>

        {isModalOpen && (
          <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative animate-fade-in-up"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label={language === 'es' ? 'Cerrar modal de previsualización' : 'Close preview modal'}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="p-6 border-b border-slate-800 bg-slate-900/50">
                <h3 className="text-xl font-bold text-slate-50 flex items-center gap-2">
                  <Award className="text-indigo-400" size={24} />
                  {t.modalTitle}
                </h3>
              </div>

              <div className="p-6 bg-slate-950 flex items-center justify-center min-h-100">
                <img
                  src="/titulo.webp"
                  alt={t.modalAlt}
                  decoding="async"
                  loading="lazy"
                  className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-xl border border-slate-800"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const TechStack = ({ language }) => {
  const t = translations[language].skills;

  const techStackList = [
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg', color: '#61DAFB' },
    { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg', color: '#339933' },
    { name: 'Supabase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg', color: '#3FCF8E' },
    { name: 'Keycloak', icon: 'https://www.keycloak.org/resources/images/icon.svg', color: '#0066CC' },
    { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg', color: '#336791' },
    { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg', color: '#38BDF8' },
    { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg', color: '#2496ED' },
    { name: 'AWS', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/960px-Amazon_Web_Services_Logo.svg.png?_=20170912170050', color: '#FF9900' },
    { name: 'Express', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg', color: '#FFFFFF' },
    { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg', color: '#47A248' },
    { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg', color: '#F05032' }
  ];

  return (
    <section id="skills" className="py-24 relative bg-slate-950 overflow-hidden">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 30s linear infinite;
        }
        .marquee-container:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}} />

      {/* Orbs traseros decorativos */}
      <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <FadeInSection>
          <div className="flex items-center gap-3 mb-4">
            <Terminal size={18} className="text-indigo-400" />
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">{t.badge}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-16 tracking-tight">{t.title}</h2>

          {/* Contenedor del Carrusel Infinito con h-48 para evitar cortes de tooltips y clase marquee-container para pausar sincronizado */}
          <div className="marquee-container overflow-hidden whitespace-nowrap flex items-center relative w-full h-48 bg-slate-900/20 border-y border-slate-800/50 backdrop-blur-xs rounded-3xl">
            {/* Máscara de desvanecimiento lateral premium */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-950 to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-950 to-transparent z-20 pointer-events-none" />

            {/* Primer bloque de items */}
            <div className="flex shrink-0 animate-marquee">
              {techStackList.map((tech, idx) => (
                <div
                  key={`marquee-1-${idx}`}
                  className="group relative inline-flex flex-col items-center justify-center mx-6 cursor-pointer"
                  style={{ '--hover-color': tech.color }}
                >
                  <span className="absolute -top-14 px-4 py-1.5 bg-slate-900 text-slate-200 text-sm font-medium rounded-xl border border-transparent opacity-0 transition-all duration-300 pointer-events-none whitespace-nowrap z-20 group-hover:opacity-100 group-hover:border-[var(--hover-color)] group-hover:shadow-[0_0_15px_var(--hover-color)] group-hover:text-white group-hover:-translate-y-1">
                    {tech.name}
                  </span>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-slate-800/40 border border-transparent transition-all duration-300 group-hover:bg-slate-800/80 group-hover:border-[var(--hover-color)] group-hover:shadow-[0_0_20px_var(--hover-color)]">
                    <img
                      src={tech.icon}
                      alt={tech.name}
                      className="w-9 h-9 transition-all duration-300 group-hover:scale-110"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Segundo bloque de items idéntico */}
            <div className="flex shrink-0 animate-marquee">
              {techStackList.map((tech, idx) => (
                <div
                  key={`marquee-2-${idx}`}
                  className="group relative inline-flex flex-col items-center justify-center mx-6 cursor-pointer"
                  style={{ '--hover-color': tech.color }}
                >
                  <span className="absolute -top-14 px-4 py-1.5 bg-slate-900 text-slate-200 text-sm font-medium rounded-xl border border-transparent opacity-0 transition-all duration-300 pointer-events-none whitespace-nowrap z-20 group-hover:opacity-100 group-hover:border-[var(--hover-color)] group-hover:shadow-[0_0_15px_var(--hover-color)] group-hover:text-white group-hover:-translate-y-1">
                    {tech.name}
                  </span>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-slate-800/40 border border-transparent transition-all duration-300 group-hover:bg-slate-800/80 group-hover:border-[var(--hover-color)] group-hover:shadow-[0_0_20px_var(--hover-color)]">
                    <img
                      src={tech.icon}
                      alt={tech.name}
                      className="w-9 h-9 transition-all duration-300 group-hover:scale-110"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
};

const Experience = ({ language }) => {
  const t = translations[language].experience;
  const experiences = t.list;
  const mainCompany = experiences[0]?.company || "Hospital Santa Teresa";

  return (
    <section id="experience" className="py-24 relative bg-slate-900/30">
      <div className="mx-auto max-w-4xl px-6">
        <FadeInSection>
          <div className="flex items-center gap-3 mb-4">
            <Briefcase size={18} className="text-indigo-400" />
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">{t.badge}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-16 tracking-tight">{t.title}</h2>

          <div className="relative border-l-2 border-slate-800 ml-4 md:ml-6 pl-8 md:pl-12">
            <div className="relative group">
              {/* Nodo principal de la empresa con glow dinámico en hover */}
              <div className="absolute -left-[44px] md:-left-[60px] top-1.5 w-6 h-6 rounded-full bg-slate-950 border-4 border-indigo-500 group-hover:border-indigo-400 transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.4)]" />

              <h3 className="text-3xl font-extrabold text-slate-50 mb-8 tracking-tight group-hover:text-indigo-400 transition-colors duration-300">
                {mainCompany}
              </h3>

              {/* Sub-línea de tiempo vertical para representar la progresión de carrera (ascensos) */}
              <div className="relative border-l border-slate-800 ml-2 pl-6 md:pl-8 space-y-10">
                {experiences.map((exp, i) => (
                  <div key={i} className="relative group/role">
                    {/* Nodo secundario para el rol */}
                    <div className="absolute -left-[31px] md:-left-[39px] top-2 w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-slate-600 group-hover/role:border-indigo-400 group-hover/role:scale-110 transition-all duration-300" />

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                      <h4 className="text-xl font-bold text-slate-100 group-hover/role:text-slate-300 transition-colors">
                        {exp.role}
                      </h4>
                      <span className="inline-block self-start sm:self-auto px-2.5 py-0.5 bg-slate-800/80 text-slate-300 text-xs font-mono rounded border border-slate-700">
                        {exp.period}
                      </span>
                    </div>

                    <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800/50 hover:border-slate-700/50 hover:bg-slate-900/60 transition-all duration-300">
                      {Array.isArray(exp.desc) ? (
                        <ul className="list-disc list-inside space-y-2 text-slate-400">
                          {exp.desc.map((bullet, idx) => (
                            <li key={idx} className="leading-relaxed text-sm">
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-slate-400 leading-relaxed text-sm">
                          {exp.desc}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
};

const Projects = ({ language }) => {
  const [filter, setFilter] = useState('Todos');
  const t = translations[language].projects;

  const [activeViews, setActiveViews] = useState({});

  const projectsList = [
    {
      title: t.list[0].title,
      category: 'Movil',
      description: t.list[0].description,
      tags: ['Keycloak', 'NFC', 'Java', 'IoT', 'Security'],
      link: 'https://github.com/Nelson7298/tu-repo-nfc', // Reemplaza con tu link real
      demoLink: '#',
      images: {
        desktop: '',
        mobile: '',
        tablet: ''
      }
    },
    {
      title: t.list[1].title,
      category: 'Web',
      description: t.list[1].description,
      tags: ['AWS', 'Linux', 'Docker', 'DevOps'],
      link: 'https://github.com/Nelson7298/tu-repo-cloud', // Reemplaza con tu link real
      demoLink: '#',
      images: {
        desktop: '',
        mobile: '',
        tablet: ''
      }
    },
    {
      title: t.list[2].title,
      category: 'Web',
      description: t.list[2].description,
      tags: ['Node.js', 'Express', 'Supabase', 'API'],
      link: 'https://github.com/Nelson7298/MarketPro_Prod', // Reemplaza con tu link real
      demoLink: 'https://nelsondigital.co/',
      images: {
        desktop: '/Plataforma MarketPro API-desktop.webp',
        mobile: '/Plataforma MarketPro API-movil.webp',
        tablet: '/Plataforma MarketPro API-tablet.webp'
      }
    },
    {
      title: t.list[3].title,
      category: 'Web',
      description: t.list[3].description,
      tags: ['Python', 'Machine Learning', 'Pandas', 'IA'],
      link: 'https://github.com/Nelson7298', // Reemplaza con tu link real
      demoLink: '#',
      images: {
        desktop: '',
        mobile: '',
        tablet: ''
      }
    }
  ];

  const filteredProjects = filter === 'Todos'
    ? projectsList
    : projectsList.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-24 relative bg-slate-950">
      <div className="mx-auto max-w-7xl px-6">
        <FadeInSection>
          <div className="flex items-center gap-3 mb-4">
            <Layers size={18} className="text-indigo-400" />
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">{t.badge}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-50 tracking-tight">{t.title}</h2>

            <div className="flex flex-wrap gap-3 p-1">
              {['Todos', 'Web', 'Movil'].map(cat => {
                const isActive = filter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 relative ${isActive
                      ? 'text-white bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-900/40 border border-slate-800/60 hover:border-slate-700/80 hover:bg-slate-900/60'
                      }`}
                  >
                    {isActive && (
                      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-10 blur-xs -z-10" />
                    )}
                    {cat === 'Todos' ? t.filterAll : cat === 'Web' ? t.filterWeb : cat === 'Movil' ? t.filterMovil : cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project, i) => {
              return (
                <div key={i} className="group flex flex-col bg-[#111520] border border-slate-800/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10">
                  {/* Sección de Imagen o Visualizador Interactivo */}
                  {(() => {
                    const activeView = activeViews[i] || 'desktop';
                    const mainImageSrc = project.images?.[activeView];
                    const hasImage = mainImageSrc && mainImageSrc !== '';

                    return (
                      <div className="relative h-72 md:h-80 w-full overflow-hidden flex flex-row p-4 gap-4 bg-[#0b0f19]/90 border-b border-slate-800/80 backdrop-blur-md items-center shadow-inner">
                        {/* Columna de Miniaturas Laterales (Izquierda) */}
                        <div className="flex flex-col justify-center items-center gap-3 w-16 shrink-0 z-20">
                          {['desktop', 'mobile', 'tablet'].map((view) => {
                            const isSelected = activeView === view;
                            const thumbnailSrc = project.images?.[view];
                            const hasThumbnail = thumbnailSrc && thumbnailSrc !== '';
                            const IconComponent = view === 'desktop' ? Monitor : view === 'mobile' ? Smartphone : Tablet;

                            return (
                              <button
                                key={view}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setActiveViews((prev) => ({ ...prev, [i]: view }));
                                }}
                                className={`group relative flex items-center justify-center p-0.5 rounded-lg border transition-all duration-300 cursor-pointer ${isSelected
                                  ? 'border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)] bg-slate-900/60 scale-105'
                                  : 'border-slate-800 bg-slate-950/40 opacity-60 hover:opacity-100 hover:border-slate-700 hover:scale-102'
                                  }`}
                                title={
                                  language === 'es'
                                    ? `Ver versión ${view === 'desktop' ? 'Desktop' : view === 'mobile' ? 'Móvil' : 'Tablet'}`
                                    : `View ${view} version`
                                }
                              >
                                {hasThumbnail ? (
                                  <img
                                    src={thumbnailSrc}
                                    alt={`${view} View Thumbnail`}
                                    className="w-12 h-9 rounded object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                ) : (
                                  <div className="w-12 h-9 rounded bg-slate-950/60 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-colors">
                                    <IconComponent size={14} />
                                  </div>
                                )}
                                <div className="absolute inset-0 rounded bg-slate-950/10 group-hover:bg-transparent transition-colors pointer-events-none" />
                              </button>
                            );
                          })}
                        </div>

                        {/* Visor Central (Derecha) */}
                        <div className="flex-grow h-full flex items-center justify-center bg-slate-950/40 rounded-xl border border-slate-800/80 overflow-hidden relative shadow-inner">
                          {hasImage ? (
                            <img
                              src={mainImageSrc}
                              alt={
                                language === 'es'
                                  ? `Vista ${activeView === 'desktop' ? 'PC' : activeView === 'mobile' ? 'Móvil' : 'Tablet'} del proyecto`
                                  : `Project ${activeView} view`
                              }
                              className="object-cover w-full h-full transition-all duration-500 animate-fade-in"
                              key={activeView}
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-[#0a0d16] to-slate-950/90 p-6 text-center select-none animate-fade-in" key={activeView}>
                              {(() => {
                                const IconComponent = activeView === 'desktop' ? Monitor : activeView === 'mobile' ? Smartphone : Tablet;
                                const deviceText = activeView === 'desktop' ? (language === 'es' ? 'Escritorio' : 'Desktop') : activeView === 'mobile' ? (language === 'es' ? 'Móvil' : 'Mobile') : 'Tablet';
                                return (
                                  <>
                                    <div className="w-12 h-12 rounded-full bg-slate-900/60 border border-slate-800/80 flex items-center justify-center text-indigo-400 mb-3 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                                      <IconComponent size={20} className="animate-pulse" />
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
                                      {language === 'es' ? 'Previsualización Pendiente' : 'Preview Pending'}
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium">
                                      {language === 'es' ? `Vista de ${deviceText}` : `${deviceText} View`}
                                    </span>
                                  </>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Cuerpo de la Tarjeta (p-6 o p-8) */}
                  <div className="relative z-10 p-6 md:p-8 flex flex-col flex-grow">
                    {/* Título con barra vertical de acento */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-1.5 h-6 bg-cyan-400 rounded-full"></div>
                      <h3 className="text-xl font-bold text-white tracking-tight">
                        {project.title}
                      </h3>
                    </div>

                    {/* Descripción */}
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="mt-auto">
                      <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold tracking-widest mb-3">
                        <Code size={14} /> TECH STACK
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                          <span key={tag} className="px-3 py-1.5 bg-slate-800/50 text-slate-300 text-xs rounded-md font-medium border border-slate-700/50">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Botones Inferiores (Footer de la tarjeta) */}
                    <div className={project.demoLink && project.demoLink !== '#' ? "grid grid-cols-2 gap-4 mt-6" : "grid grid-cols-1 gap-4 mt-6"}>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={language === 'es' ? `Ver código de ${project.title} en GitHub` : `View ${project.title} source code on GitHub`}
                        className="bg-transparent border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl py-2.5 flex items-center justify-center gap-2 text-sm transition-all duration-300"
                      >
                        <Github size={16} /> {language === 'es' ? 'Código' : 'Code'}
                      </a>
                      {project.demoLink && project.demoLink !== '#' && (
                        <a
                          href={project.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={language === 'es' ? `Ver demostración en vivo de ${project.title}` : `View ${project.title} live demo`}
                          className="bg-[#149103] border border-green-500/20 text-white hover:bg-[#1aab07] rounded-xl py-2.5 flex items-center justify-center gap-2 text-sm transition-all duration-300"
                        >
                          <Eye size={16} /> Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeInSection>
      </div>
    </section>
  );
};

function WhatsappIcon({ size = 24, className = "" }) {
  return (
    <img
      src="/WhatsApp.webp"
      alt="WhatsApp"
      width={size}
      height={size}
      className={`${className} scale-[2.7] object-contain`}
    />
  );
}

function Github({ size = 24, className = "" }) {
  return (
    <img
      src="https://cdn.iconscout.com/icon/free/png-256/free-github-icon-svg-download-png-10919025.png?f=webp&w=128"
      alt="GitHub"
      width={size}
      height={size}
      className={`${className} scale-[1.3] object-contain`}
    />
  );
}

function LinkedinIcon({ size = 24, className = "" }) {
  return (
    <img
      src="/linkedin.webp"
      alt="LinkedIn"
      width={size}
      height={size}
      className={`${className} scale-[2.7] object-contain`}
    />
  );
}

function GmailIcon({ size = 24, className = "" }) {
  return (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Gmail_icon_%282026%29.svg/250px-Gmail_icon_%282026%29.svg.png"
      alt="Gmail"
      width={size}
      height={size}
      className={className}
    />
  );
}

const Contact = ({ language }) => {
  const [message, setMessage] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const t = translations[language].contact;

  const handleEnhanceMessage = async () => {
    if (message.length < 10) return;
    setIsEnhancing(true);
    const prompt = `Reescribe el siguiente mensaje para que suene mucho más profesional, persuasivo, educado y formal. Es un mensaje de contacto dirigido a Nelson Aguirre (Ingeniero de Software) desde un reclutador o un posible cliente. Corrige cualquier error de ortografía y mejora la redacción general. 
    Mensaje original: "${message}". 
    Responde ÚNICAMENTE con el mensaje mejorado, sin introducciones, sin explicaciones ni comillas.`;

    const response = await callGemini(prompt);
    if (response && !response.includes("Error de conexión")) {
      setMessage(response);
    }
    setIsEnhancing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSending(true);

    // Tu clave real de Web3Forms activada
    const accessKey = "01d7bf5e-7445-41bd-844b-0a804f76bbcb";

    if (accessKey === "YOUR_ACCESS_KEY_HERE") {
      // Fallback en caso de que aún no configure la clave: usa el método mailto tradicional para no romper el flujo
      const subject = encodeURIComponent(`Nuevo contacto de portafolio: ${name}`);
      const body = encodeURIComponent(`Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`);

      const fireConfetti = () => {
        try {
          const loadScript = () => {
            return new Promise((resolve) => {
              if (window.confetti) {
                resolve(window.confetti);
                return;
              }
              const script = document.createElement('script');
              script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js';
              script.onload = () => resolve(window.confetti);
              document.body.appendChild(script);
            });
          };
          loadScript().then((confetti) => {
            if (confetti) {
              confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#6366f1', '#a855f7', '#10b981', '#3b82f6', '#f43f5e']
              });
            }
          });
        } catch (err) {
          console.error("Confetti loading error:", err);
        }
      };

      setTimeout(() => {
        window.location.href = `mailto:mirianaguirreabancay@gmail.com?subject=${subject}&body=${body}`;
        setIsSending(false);
        setIsSent(true);
        fireConfetti();

        setTimeout(() => {
          setIsSent(false);
          setName('');
          setEmail('');
          setMessage('');
        }, 3000);
      }, 800);
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: name,
          email: email,
          message: message,
          subject: `Nuevo contacto desde tu Portafolio de ${name}`
        })
      });

      const data = await response.json();
      if (data.success) {
        setIsSent(true);
        setName('');
        setEmail('');
        setMessage('');
        try {
          const loadScript = () => {
            return new Promise((resolve) => {
              if (window.confetti) {
                resolve(window.confetti);
                return;
              }
              const script = document.createElement('script');
              script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js';
              script.onload = () => resolve(window.confetti);
              document.body.appendChild(script);
            });
          };
          loadScript().then((confetti) => {
            if (confetti) {
              confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#6366f1', '#a855f7', '#10b981', '#3b82f6', '#f43f5e']
              });
            }
          });
        } catch (err) {
          console.error("Confetti success error:", err);
        }
        setTimeout(() => {
          setIsSent(false);
        }, 3000);
      } else {
        alert(t.errSubmit);
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      alert(t.errConn);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-slate-900/30">
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-slate-700 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <FadeInSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            <div>

              <h2 className="text-4xl md:text-5xl font-bold text-slate-50 mb-6 tracking-tight">
                {t.title}
              </h2>
              <p className="text-slate-400 text-lg mb-12 leading-relaxed">
                {t.description}
              </p>

              <div className="space-y-6">
                <a
                  href="mailto:mirianaguirreabancay@gmail.com"
                  aria-label={language === 'es' ? 'Contactar a Nelson por correo de Gmail' : 'Contact Nelson via Gmail'}
                  className="flex items-center gap-4 text-slate-300 hover:text-slate-100 transition-colors group"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-950 border border-slate-800 group-hover:border-slate-500 group-hover:bg-slate-800 transition-all">
                    <GmailIcon size={28} />
                  </div>
                  <span className="text-lg">Gmail</span>
                </a>
                <a
                  href="https://wa.me/51955538003"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={language === 'es' ? 'Contactar a Nelson por WhatsApp' : 'Contact Nelson via WhatsApp'}
                  className="flex items-center gap-4 text-slate-300 hover:text-emerald-400 transition-colors group"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-950 border border-slate-800 group-hover:border-emerald-500/50 group-hover:bg-emerald-900/20 transition-all">
                    <WhatsappIcon size={28} />
                  </div>
                  <span className="text-lg">WhatsApp</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/nelson-aguirre-dev/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={language === 'es' ? 'Ver perfil de LinkedIn de Nelson' : 'View Nelson\'s LinkedIn profile'}
                  className="flex items-center gap-4 text-slate-300 hover:text-indigo-400 transition-colors group"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-950 border border-slate-800 group-hover:border-indigo-500/50 group-hover:bg-indigo-900/20 transition-all">
                    <LinkedinIcon size={28} />
                  </div>
                  <span className="text-lg">LinkedIn</span>
                </a>
                <a
                  href="https://github.com/Nelson7298"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={language === 'es' ? 'Ver perfil de GitHub de Nelson' : 'View Nelson\'s GitHub profile'}
                  className="flex items-center gap-4 text-slate-300 hover:text-slate-100 transition-colors group"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-950 border border-slate-800 group-hover:border-slate-500 group-hover:bg-slate-800 transition-all">
                    <Github size={28} />
                  </div>
                  <span className="text-lg">GitHub</span>
                </a>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-slate-800/30 rounded-full blur-[80px]"></div>

              <form className="relative z-10 space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">{t.labelName}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-50 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all"
                    placeholder={t.placeholderName}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">{t.labelEmail}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-50 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all"
                    placeholder={t.placeholderEmail}
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-400 mb-2">{t.labelMessage}</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows="4"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-50 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all resize-none"
                    placeholder={t.placeholderMessage}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSending || isSent}
                  className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_20px_rgba(241,245,249,0.05)] ${isSent
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-white'
                    : 'bg-slate-100 hover:bg-[oklch(0.92_0.23_106.58)] text-slate-900'
                    }`}
                >
                  {isSending ? (
                    <><Loader2 size={18} className="animate-spin" /> {t.btnSending}</>
                  ) : isSent ? (
                    <><CheckCircle2 size={18} /> {t.btnSent}</>
                  ) : (
                    <>{t.btnSend} <Send size={18} /></>
                  )}
                </button>
              </form>
            </div>

          </div>
        </FadeInSection>
      </div>
    </section>
  );
};


export default function App() {
  const [language, setLanguage] = useState('es');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-slate-700 selection:text-slate-100">
      <GlobalStyles />
      <Navbar language={language} setLanguage={setLanguage} />
      <Hero language={language} />
      <Profile language={language} />
      <TechStack language={language} />
      <Experience language={language} />
      <Projects language={language} />
      <Contact language={language} />
    </div>
  );
}