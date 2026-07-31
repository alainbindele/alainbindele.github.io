/* ═══════════════════════════════════════════════════════════
   DATA — progetti, skill, timeline, marquee
   Inline (non fetch) così la pagina gira anche da file://
   ═══════════════════════════════════════════════════════════ */

const PROJECTS = [
  { id:'fire-calculator',    title:'FIRE Calculator',    cat:'projects',
    it:'Calcola quando raggiungi la libertà finanziaria inserendo risparmi, investimenti e spese.',
    en:'Work out when you hit financial independence from savings, investments and expenses.',
    url:'https://www.firecalculator.info', tech:['TypeScript','D3.js'] },

  { id:'portfolio-balancer', title:'PortfolioBalancer',  cat:'projects',
    it:'Strumento gratuito e privato per tenere il portafoglio di investimenti in equilibrio.',
    en:'Free, private tool that keeps an investment portfolio balanced.',
    url:'https://www.portfoliobalancer.info', tech:['TypeScript'] },

  { id:'devt00ls',           title:'Devt00ls',           cat:'projects',
    it:'Raccolta di strumenti per sviluppatori: converter, generatori, tester.',
    en:'A collection of developer tools: converters, generators, testers.',
    url:'https://devt00ls.com/', tech:['AI'] },

  { id:'piante-grasse',      title:'Piante Grasse',      cat:'projects',
    it:'Archivio intelligente di succulente, con IA per coltivazione e diagnosi.',
    en:'Smart succulent archive with AI for cultivation and diagnosis.',
    url:'https://www.piante-grasse.com', tech:['AI'] },

  { id:'notificamy',         title:'Notificamy',         cat:'projects',
    it:'Assistente che trasforma promemoria in azioni su email, Slack e WhatsApp.',
    en:'Assistant that turns reminders into actions on email, Slack and WhatsApp.',
    url:'https://www.notificamy.com', tech:['Spring Boot','Lambda','TypeScript'] },

  { id:'atlas',              title:'Atlas',              cat:'projects',
    it:'Sync daemon self-hosted per Windows, sincronizzazione cifrata verso VPS.',
    en:'Self-hosted Windows sync daemon with encrypted VPS synchronisation.',
    url:'atlas.html', tech:['Windows','Self-hosted','Encryption'] },

  { id:'the-art-of-jaxs',    title:'The Art Of Jaxs',    cat:'websites',
    it:'Sito per un artista romano che esplora la pittura come indagine del reale.',
    en:'Site for a Roman artist exploring painting as an inquiry into reality.',
    url:'https://www.theartofjaxs.com/', tech:['WordPress'] },

  { id:'luca-margarita',     title:'Luca Margarita',     cat:'websites',
    it:'Portfolio di un DJ e producer di house e minimal techno.',
    en:'Portfolio for a house and minimal techno DJ and producer.',
    url:'https://www.lucamargarita.it', tech:['WordPress'] },

  { id:'hiphop-cinefest',    title:'HipHop Cinefest',    cat:'websites',
    it:'Festival italiano dedicato al rapporto fra Hip Hop e cinema.',
    en:'Italian festival on the relationship between Hip Hop and cinema.',
    url:'https://hiphopcinefest.org/', tech:['WordPress'] },

  { id:'baburka-production', title:'Baburka Production', cat:'websites',
    it:'Laboratorio creativo per produzione audiovisiva e cinema di qualità.',
    en:'Creative studio for audiovisual production and quality cinema.',
    url:'https://baburkaproduction.com/', tech:['WordPress'] },

  { id:'greensound',         title:'Greensound Project', cat:'collaborations',
    it:'Progetto che converte l’energia bioelettrica delle piante in musica.',
    en:'Project converting the bioelectric energy of plants into music.',
    url:'https://greensoundproject.com/', tech:['Arduino'] }
];

/* screenshot già presenti nel repo del sito */
const SHOTS = {
  'fire-calculator':    'assets/projects/fire-calculator.jpg',
  'portfolio-balancer': 'assets/projects/portfolio-balancer.jpg',
  'devt00ls':           'assets/projects/devt00ls.jpg',
  'piante-grasse':      'assets/projects/piante-grasse.png',
  'notificamy':         'assets/projects/notificamy.jpg',
  'atlas':              'assets/projects/syncdaemon.png',
  'the-art-of-jaxs':    'assets/projects/the-art-of-jaxs.jpg',
  'luca-margarita':     'assets/projects/luca-margarita.jpg',
  'hiphop-cinefest':    'assets/projects/hiphop-cinefest.jpg',
  'baburka-production': 'assets/projects/baburka-production.jpg',
  'greensound':         'assets/projects/greensound-project.png'
};

const SKILLS = [
  { name:'Java & Spring Boot', lvl:95, meta:'20+ anni'   },
  { name:'AWS Cloud',          lvl:85, meta:'EC2 · Lambda · SQS' },
  { name:'Microservices',      lvl:90, meta:'DDD · Hexagonal' },
  { name:'Database Design',    lvl:88, meta:'SQL · NoSQL'  },
  { name:'System Architecture',lvl:92, meta:'Clean Arch'   },
  { name:'DevOps & CI/CD',     lvl:80, meta:'Linux · Docker' }
];

const JOBS = [
  { when:'2022 — oggi', whenEn:'2022 — now', role:'Software Engineer', co:'Besafe', loc:'Roma, IT',
    it:['Backend Java/Spring Boot con architetture modulari e DDD',
        'Refactoring in Clean Architecture, approccio Hexagonal (Ports &amp; Adapters)',
        'Integrazione e orchestrazione di sistemi di pagamento su AWS (EC2, Lambda, SQS)',
        'Ottimizzazione di Spring Batch per performance e osservabilità',
        'Collaborazione diretta con Operations per onboarding partner'],
    en:['Java/Spring Boot backend with modular, DDD-driven architecture',
        'Clean Architecture refactoring, Hexagonal (Ports &amp; Adapters) approach',
        'Payment system integration and orchestration on AWS (EC2, Lambda, SQS)',
        'Spring Batch tuning for performance and observability',
        'Direct work with Operations on partner onboarding'] },

  { when:'2021', whenEn:'2021', role:'Java Developer', co:'Atex', loc:'Da remoto', locEn:'Remote',
    it:['Gestionali per il settore editoriale su JBOSS, in Java e Angular'],
    en:['Publishing-industry management software on JBOSS, in Java and Angular'] },

  { when:'2020', whenEn:'2020', role:'Backend Developer', co:'M&amp;G Holding', loc:'Roma, IT',
    it:['Strumenti gestionali aziendali e siti web su stack XAMPP'],
    en:['Internal business tools and websites on the XAMPP stack'] },

  { when:'2017 — 2020', whenEn:'2017 — 2020', role:'Fondatore e Consulente', roleEn:'Founder & Consultant',
    co:'PC-Go Project', loc:'Roma, IT',
    it:['Coordinamento e consulenza nello sviluppo software e formazione tecnica',
        'Macomoco: sistema di controllo remoto per robot KUKA, in Java',
        'Baburka Production: programmatore di sistema, consulente e web designer WordPress',
        'EffectUs Event: webmaster e consulente SEO',
        'Gameotic: responsabile sicurezza, sysadmin Linux, sviluppatore PHP/JS'],
    en:['Coordination and consulting on software development and technical training',
        'Macomoco: remote-control system for KUKA robots, in Java',
        'Baburka Production: systems programmer, consultant and WordPress web designer',
        'EffectUs Event: webmaster and SEO consultant',
        'Gameotic: security lead, Linux sysadmin, PHP/JS developer'] },

  { when:'2016 — 2017', whenEn:'2016 — 2017', role:'Consulente Software', roleEn:'Software Consultant',
    co:'Varie aziende', coEn:'Various companies', loc:'Roma, IT',
    it:['Consulman Spa: ingegnere informatico e sysadmin Linux/Windows Server',
        'Matchin Srl: consulente, web developer e sistemista backend',
        'B-Wave Srl: sviluppatore web Ruby on Rails',
        'D2P Solutions: docente di linguaggi di programmazione (Node.js, Linux)',
        'Gameotic: startup, seed round'],
    en:['Consulman Spa: software engineer and Linux/Windows Server sysadmin',
        'Matchin Srl: consultant, web developer and backend sysadmin',
        'B-Wave Srl: Ruby on Rails web developer',
        'D2P Solutions: programming languages instructor (Node.js, Linux)',
        'Gameotic: startup, seed round'] },

  { when:'2015', whenEn:'2015', role:'Consulente e CTO', roleEn:'Consultant & CTO',
    co:'Progetti vari', coEn:'Various projects', loc:'Roma, IT',
    it:['CTO del progetto Wallfarm', 'Prosecuzione della collaborazione con Gameotic',
        'Consulenze e docenze private in ambito informatico'],
    en:['CTO of the Wallfarm project', 'Continued collaboration with Gameotic',
        'Private IT consulting and teaching'] },

  { when:'2008 — 2010', whenEn:'2008 — 2010', role:'Sviluppatore e System Administrator',
    roleEn:'Developer & System Administrator', co:'AMI — Agenzia Multimediale Italiana', loc:'Roma, IT',
    it:['Sviluppatore e amministratore di sistema junior',
        'Installazione, configurazione e manutenzione di rete',
        'Docenze private in campo informatico'],
    en:['Junior developer and system administrator',
        'Network installation, configuration and maintenance',
        'Private IT teaching'] },

  { when:'2005', whenEn:'2005', role:'System Administrator', co:'Etabeta S.p.A.', loc:'Roma, IT',
    it:['Amministratore di sistema junior',
        'Installazione e configurazione della piattaforma di produzione televisiva',
        'Assistenza tecnica a camere di regia e montaggio per RAI/RTI'],
    en:['Junior system administrator',
        'Installation and configuration of the TV production platform',
        'Technical support for control and editing rooms at RAI/RTI'] }
];

const MARQUEE = [
  'Java','Spring Boot','AWS','Lambda','SQS','PostgreSQL','MongoDB','Docker','Kubernetes',
  'Clean Architecture','DDD','Hexagonal','Spring Batch','REST',
  'Linux','CI/CD','Microservices','Event-Driven'
];
