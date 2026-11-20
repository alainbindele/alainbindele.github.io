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

/* Project screenshots. Intrinsic width/height are emitted on the <img> to reserve
   space and avoid layout shift (CLS). Paths are relative to the site root. */
const SHOTS = {
  'fire-calculator':    { src:'assets/projects/fire-calculator.jpg',    w:1286, h:1141 },
  'portfolio-balancer': { src:'assets/projects/portfolio-balancer.jpg', w:1413, h:1272 },
  'devt00ls':           { src:'assets/projects/devt00ls.jpg',           w:1246, h:800  },
  'piante-grasse':      { src:'assets/projects/piante-grasse.png',      w:817,  h:800  },
  'notificamy':         { src:'assets/projects/notificamy.jpg',         w:1409, h:1261 },
  'atlas':              { src:'assets/projects/syncdaemon.png',         w:912,  h:540  },
  'the-art-of-jaxs':    { src:'assets/projects/the-art-of-jaxs.jpg',    w:1593, h:1087 },
  'luca-margarita':     { src:'assets/projects/luca-margarita.jpg',     w:1553, h:1187 },
  'hiphop-cinefest':    { src:'assets/projects/hiphop-cinefest.jpg',    w:1854, h:1068 },
  'baburka-production': { src:'assets/projects/baburka-production.jpg', w:1660, h:1286 },
  'greensound':         { src:'assets/projects/greensound-project.png', w:1482, h:1087 }
};

const SKILLS = [
  { name:'Java & Spring Boot', lvl:95, meta:'20+ anni', metaEn:'20+ years' },
  { name:'System Architecture',   lvl:92, meta:'Clean Arch · DDD' },
  { name:'Microservices',         lvl:90, meta:'Hexagonal · REST' },
  { name:'Data Engineering',      lvl:88, meta:'Postgres · Flyway · data mart' },
  { name:'AWS Cloud',             lvl:85, meta:'ECS · Lambda · EventBridge' },
  { name:'AI · LLM & RAG',     lvl:82, meta:'Azure OpenAI · pgvector · MCP' },
  { name:'Database Design',       lvl:88, meta:'SQL · NoSQL' },
  { name:'DevOps & CI/CD',     lvl:80, meta:'Linux · Docker' }
];

const JOBS = [
  { when:'2022 — oggi', whenEn:'2022 — now', role:'Software Engineer', co:'Besafe', loc:'Roma, IT',
    it:['Ownership tecnica di un motore di pre-valutazione dei sinistri basato su LLM (Azure OpenAI) e RAG: dai documenti allegati individua quelli mancanti e verifica quali requisiti di polizza sono soddisfatti o violati. Dal design doc all’alpha in testing',
        'Progettazione della supervisione dei giudizi del modello: misurare e correggere l’accuratezza di un LLM, non solo costruirne il retrieval',
        'Server MCP (Model Context Protocol) in Spring Boot che apre il data mart aziendale agli assistenti AI in sola lettura, con trasporto Streamable HTTP e autorizzazione OAuth 2 a scope dedicati',
        'Data mart su PostgreSQL con pipeline a tre livelli (eventi → ultimo stato noto → viste aggregate), alimentato da sorgenti eterogenee: MySQL, Postgres, Freshdesk, Pipedrive e API di booking',
        'Viste materializzate versionate con migrazioni Flyway ripetibili, refresh concorrente in ordine di dipendenza e job coordinati con advisory lock',
        'Architettura per la ricerca semantica su PostgreSQL: pgvector e full-text nello stesso database per query ibride, con l’indice vettoriale come dato derivato e sempre ricostruibile',
        'Orchestrazione su AWS: EventBridge → ECS RunTask, trigger HTTP da API Gateway, Lambda, SQS e alerting su CloudWatch; compressione di ~19 milioni di righe storiche',
        'Backend Java (Spring Boot, Quarkus, Spring Batch) su architettura modulare REST e DDD; refactoring dei batch legacy verso Clean Architecture ed esagonale (Ports &amp; Adapters)',
        'Servizi full stack per affiliazioni ed e-commerce, integrazioni di pagamento, gestione crediti e riconciliazione automatica',
        'Design doc con review iterative, sviluppo accelerato dall’AI (Claude Code), unit test sui flussi critici e supporto al team Operations'],
    en:['Technical ownership of an LLM (Azure OpenAI) and RAG engine that pre-assesses insurance claims: from the attached documents it flags what is missing and checks which policy requirements are met or violated. From design doc to alpha in testing',
        'Designed the supervision of the model’s judgements: measuring and correcting how well an LLM decides, not just building its retrieval',
        'MCP (Model Context Protocol) server in Spring Boot giving AI assistants read-only access to the company data mart, over Streamable HTTP with OAuth 2 and dedicated scopes',
        'PostgreSQL data mart with a three-layer pipeline (events → latest known state → aggregated views), fed by heterogeneous sources: MySQL, Postgres, Freshdesk, Pipedrive and booking APIs',
        'Versioned materialized views via Flyway repeatable migrations, concurrent refresh in dependency order and jobs coordinated with advisory locks',
        'Semantic search architecture on PostgreSQL: pgvector and full-text in the same database for hybrid queries, with the vector index as derived, always rebuildable data',
        'AWS orchestration: EventBridge → ECS RunTask, HTTP triggers from API Gateway, Lambda, SQS and CloudWatch alerting; compression of ~19 million historical rows',
        'Java backend (Spring Boot, Quarkus, Spring Batch) on a modular REST and DDD architecture; legacy batch jobs refactored towards Clean Architecture and hexagonal design (Ports &amp; Adapters)',
        'Full-stack services for affiliate programs and e-commerce, payment integrations, credit handling and automatic reconciliation',
        'Design docs with iterative reviews, AI-accelerated development (Claude Code), unit tests on critical flows and support to the Operations team'] },

  { when:'2021', whenEn:'2021', role:'Java Developer', co:'Atex', loc:'Da remoto', locEn:'Remote',
    it:['Gestionali per il settore editoriale su JBOSS, in Java e Angular'],
    en:['Publishing-industry management software on JBOSS, in Java and Angular'] },

  { when:'2020', whenEn:'2020', role:'Backend Developer', co:'M&amp;G Holding', loc:'Roma, IT',
    it:['Strumenti gestionali aziendali e siti web su stack XAMPP'],
    en:['Internal business tools and websites on the XAMPP stack'] },

  { when:'2017 — 2020', whenEn:'2017 — 2020', role:'Fondatore e Consulente', roleEn:'Founder & Consultant',
    co:'PC-Go Project', loc:'Roma, IT',
    it:['Fondatore di un gruppo di professionisti per consulenze e corsi di informatica',
        'Macomoco: sistema di controllo remoto per macchine a controllo numerico KUKA Robotics, in Java',
        'Baburka Production: programmatore di sistemi, consulente e web designer su WordPress',
        'EffectUs Event: webmaster e consulente SEO'],
    en:['Founded a group of professionals for IT consulting and training courses',
        'Macomoco: remote-control system for KUKA Robotics CNC machines, in Java',
        'Baburka Production: systems programmer, consultant and WordPress web designer',
        'EffectUs Event: webmaster and SEO consultant'] },

  { when:'2016 — 2017', whenEn:'2016 — 2017', role:'Consulente Software', roleEn:'Software Consultant',
    co:'Varie aziende', coEn:'Various companies', loc:'Roma, IT',
    it:['Consulman Spa: ingegnere informatico e sysadmin Linux (Fedora, Debian, RedHat) e Windows Server, responsabile sicurezza e sviluppatore PHP',
        'Matchin Srl: consulente, sviluppatore web e sistemista per il backend',
        'B-Wave Srl: sviluppatore web Ruby on Rails',
        'D2P Solutions: docente di linguaggi di programmazione in corsi aziendali (Node.js, Linux)',
        'Gameotic: startup, seed round — responsabile sicurezza informatica, sysadmin Linux CentOS e sviluppatore (PHP, jQuery, Node.js, Bash)',
        'Docenze in campo informatico per associazioni e privati'],
    en:['Consulman Spa: software engineer and sysadmin on Linux (Fedora, Debian, RedHat) and Windows Server, security lead and PHP developer',
        'Matchin Srl: consultant, web developer and backend sysadmin',
        'B-Wave Srl: Ruby on Rails web developer',
        'D2P Solutions: programming languages instructor for corporate training (Node.js, Linux)',
        'Gameotic: startup, seed round — information security lead, Linux CentOS sysadmin and developer (PHP, jQuery, Node.js, Bash)',
        'IT teaching for associations and private clients'] },

  { when:'2015', whenEn:'2015', role:'Consulente e CTO', roleEn:'Consultant & CTO',
    co:'Progetti vari', coEn:'Various projects', loc:'Roma, IT',
    it:['CTO del progetto Wallfarm',
        'Gameotic: avvio della collaborazione — sicurezza informatica, sysadmin Linux e sviluppo'],
    en:['CTO of the Wallfarm project',
        'Gameotic: start of the collaboration — information security, Linux sysadmin and development'] },

  { when:'2008 — 2010', whenEn:'2008 — 2010', role:'Sviluppatore e System Administrator',
    roleEn:'Developer & System Administrator', co:'AMI — Agenzia Multimediale Italiana', loc:'Roma, IT',
    it:['Sviluppatore e amministratore di sistema junior',
        'Installazione, configurazione e manutenzione di rete',
        'Docenze private in campo informatico'],
    en:['Junior developer and system administrator',
        'Network installation, configuration and maintenance',
        'Private IT teaching'] },

  { when:'Mar — Ago 2005', whenEn:'Mar — Aug 2005', role:'System Administrator', co:'Etabeta S.p.A.', loc:'Roma, IT',
    it:['Amministratore di sistema junior',
        'Installazione, configurazione e manutenzione della piattaforma di produzione televisiva',
        'Assistenza tecnica a camere di regia e montaggio per RAI/RTI'],
    en:['Junior system administrator',
        'Installation, configuration and maintenance of the TV production platform',
        'Technical support for control and editing rooms at RAI/RTI'] }
];

const MARQUEE = [
  'Java','Spring Boot','AWS','LLM','RAG','MCP','PostgreSQL','pgvector','Azure OpenAI',
  'Clean Architecture','DDD','Hexagonal','Data Mart','Flyway','EventBridge','ECS','Lambda','SQS',
  'Spring Batch','Quarkus','REST','Event-Driven','Docker','Kubernetes','Linux','CI/CD','Claude Code'
];
