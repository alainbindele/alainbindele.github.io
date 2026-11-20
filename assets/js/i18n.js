/* ═══════════════════════════════════════════════════════════
   i18n — IT / EN
   Single source of truth for the copy of both pages.
   index.html carries the Italian text; /en/index.html is generated from it by
   `node scripts/build-en.mjs`, which swaps every [data-i18n] text node and every
   [data-i18n-aria] / [data-i18n-alt] attribute with the English entry below.
   After editing this file (or index.html) re-run the build.
   ═══════════════════════════════════════════════════════════ */

const I18N = {
  it:{
    'nav.about':'chi sono','nav.stack':'stack','nav.work':'progetti',
    'nav.path':'percorso','nav.contact':'contatti',

    'hero.loc':'Roma, Italia',
    'hero.lead':'Vent’anni a costruire backend che reggono il peso del tempo. Java, Spring Boot, AWS, data pipeline e sistemi AI con LLM e RAG, con l’ossessione per il codice che si lascia leggere.',
    'hero.cta1':'Vedi i progetti','hero.cta2':'Parliamone',
    'hero.chip1':'anni di esperienza','hero.chip2':'Laurea Magistrale','hero.chip3':'progetti in produzione',
    'hero.scroll':'scroll',

    'about.title':'Chi sono','about.sub':'// profilo professionale',
    'about.bio':'Software Engineer con oltre 20 anni di sviluppo alle spalle, tra corporate e startup. Lavoro su backend Java e Spring Boot, API REST, AWS, database relazionali e NoSQL. Oggi porto gli LLM dentro sistemi reali: RAG per valutare documenti, server MCP che aprono i dati aziendali agli assistenti AI, data mart su PostgreSQL. Mi interessano clean architecture, design pattern e tutto ciò che rende un sistema manutenibile anche fra cinque anni. Ho fatto formazione tecnica e mentoring, e credo che la chiarezza progettuale valga quanto il codice che la implementa.',
    'about.k1':'anni di codice','about.k2':'ruoli dal 2005',
    'about.l1':'madrelingua','about.l2':'ottima tecnica','about.l3':'base',
    'about.edu':'Laurea Magistrale in Informatica',

    'stack.title':'Stack','stack.sub':'// tecnologie di ogni giorno',

    'work.title':'Progetti','work.f0':'tutti','work.f1':'prodotti','work.f2':'siti','work.f3':'collab',
    'work.hint':'↔ scorri','work.go':'visita',
    'work.newTab':'(si apre in una nuova scheda)','work.shot':'Screenshot di',


    'path.title':'Percorso','path.sub':'// git log --reverse --author="alain"',

    'term.title':'Console','term.sub':'// sì, funziona davvero. prova `help`',

    'contact.title':'Parliamone','contact.sub':'// aperto a collaborazioni, consulenze e buone idee',
    'contact.cvTitle':'Scarica il CV','contact.cv':'PDF · italiano',
    'contact.cvAlt':'CV disponibile anche in','contact.cvAltLink':'inglese (PDF)',

    'foot.made':'fatto a Roma, con troppa caffeina',

    'boot.skip':'clicca o premi un tasto per saltare',
    'theme.toLight':'Passa al tema chiaro','theme.toDark':'Passa al tema scuro',

    // attribute-only strings (aria-label / alt)
    'aria.sections':'Sezioni','aria.menu':'Menu',
    'aria.scroll':'Scorri alla sezione Chi sono',
    'alt.portrait':'Ritratto di Alain Bindele, software engineer a Roma'
  },

  en:{
    'nav.about':'about','nav.stack':'stack','nav.work':'work',
    'nav.path':'path','nav.contact':'contact',

    'hero.loc':'Rome, Italy',
    'hero.lead':'Twenty years building backends that hold up over time. Java, Spring Boot, AWS, data pipelines and AI systems with LLMs and RAG, and a stubborn preference for code that reads well.',
    'hero.cta1':'See the work','hero.cta2':'Get in touch',
    'hero.chip1':'years of experience','hero.chip2':'MSc Computer Science','hero.chip3':'projects in production',
    'hero.scroll':'scroll',

    'about.title':'About','about.sub':'// professional profile',
    'about.bio':'Software Engineer with over 20 years of development behind me, across corporate and startup settings. I work on Java and Spring Boot backends, REST APIs, AWS, relational and NoSQL databases. These days I bring LLMs into real systems: RAG to assess documents, MCP servers that open company data to AI assistants, PostgreSQL data marts. I care about clean architecture, design patterns, and everything that keeps a system maintainable five years from now. I have done technical training and mentoring, and I believe design clarity counts as much as the code implementing it.',
    'about.k1':'years of code','about.k2':'roles since 2005',
    'about.l1':'native','about.l2':'strong technical','about.l3':'basic',
    'about.edu':'MSc in Computer Science',

    'stack.title':'Stack','stack.sub':'// everyday technologies',

    'work.title':'Work','work.f0':'all','work.f1':'products','work.f2':'sites','work.f3':'collab',
    'work.hint':'↔ scroll','work.go':'visit',
    'work.newTab':'(opens in a new tab)','work.shot':'Screenshot of',


    'path.title':'Path','path.sub':'// git log --reverse --author="alain"',

    'term.title':'Console','term.sub':'// yes, it actually works. try `help`',

    'contact.title':'Let’s talk','contact.sub':'// open to collaborations, consulting and good ideas',
    'contact.cvTitle':'Download my CV','contact.cv':'PDF · English',
    'contact.cvAlt':'CV also available in','contact.cvAltLink':'Italian (PDF)',

    'foot.made':'made in Rome, on too much caffeine',

    'boot.skip':'click or press any key to skip',
    'theme.toLight':'Switch to light theme','theme.toDark':'Switch to dark theme',

    'aria.sections':'Sections','aria.menu':'Menu',
    'aria.scroll':'Scroll to the About section',
    'alt.portrait':'Portrait of Alain Bindele, software engineer based in Rome'
  }
};
