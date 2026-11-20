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
    'nav.paper':'ricerca','nav.path':'percorso','nav.contact':'contatti',

    'hero.loc':'Roma, Italia',
    'hero.lead':'Vent’anni a costruire backend che reggono il peso del tempo. Java, Spring Boot, AWS, sistemi distribuiti e l’ossessione per il codice che si lascia leggere.',
    'hero.cta1':'Vedi i progetti','hero.cta2':'Parliamone',
    'hero.chip1':'anni di esperienza','hero.chip2':'Laurea Magistrale','hero.chip3':'progetti in produzione',
    'hero.scroll':'scroll',

    'about.title':'Chi sono','about.sub':'// profilo professionale',
    'about.bio':'Software Engineer con oltre 20 anni di sviluppo alle spalle, tra corporate e startup. Lavoro su backend Java e Spring Boot, API REST, AWS, database relazionali e NoSQL. Mi interessano clean architecture, design pattern e tutto ciò che rende un sistema manutenibile anche fra cinque anni. Ho fatto formazione tecnica e mentoring, e credo che la chiarezza progettuale valga quanto il codice che la implementa.',
    'about.k1':'anni di codice','about.k2':'ruoli dal 2005',
    'about.l1':'madrelingua','about.l2':'ottima tecnica','about.l3':'base',
    'about.edu':'Laurea Magistrale in Informatica',
    // TODO(alain): role you are looking for, work mode, availability
    'about.avail':'Disponibile per: [RUOLO CERCATO] · [remoto / ibrido su Roma] · [da quando]',

    'stack.title':'Stack','stack.sub':'// tecnologie di ogni giorno',

    'work.title':'Progetti','work.f0':'tutti','work.f1':'prodotti','work.f2':'siti','work.f3':'collab',
    'work.hint':'↔ scorri','work.go':'visita',
    'work.newTab':'(si apre in una nuova scheda)','work.shot':'Screenshot di',

    'paper.title':'Ricerca','paper.sub':'// contributi indipendenti',
    'paper.h':'La Gerarchia Minima dell’Auto-Certificazione',
    'paper.abs':'Dimostro che l’auto-certificazione in aritmetica richiede esattamente due livelli di riflessione — né più, né meno. Qualsiasi teoria ricorsivamente assiomatizzabile che definisce la verità per una teoria base T₀ e dimostra la propria correttezza si frammenta necessariamente in una gerarchia minima. La verità può essere definita al livello uno, o certificata al livello due, ma mai entrambe nella stessa teoria.',
    'paper.cta':'Leggi la pubblicazione',

    'path.title':'Percorso','path.sub':'// git log --reverse --author="alain"',

    'term.title':'Console','term.sub':'// sì, funziona davvero. prova `help`',

    'contact.title':'Parliamone','contact.sub':'// aperto a collaborazioni, consulenze e buone idee',
    'contact.cvTitle':'Scarica il CV','contact.cv':'PDF · italiano',
    'contact.cvAlt':'CV disponibile anche in','contact.cvAltLink':'inglese (PDF)',

    'foot.made':'fatto a Roma, con troppa caffeina',

    'boot.skip':'clicca o premi un tasto per saltare',

    // attribute-only strings (aria-label / alt)
    'aria.sections':'Sezioni','aria.menu':'Menu',
    'aria.scroll':'Scorri alla sezione Chi sono',
    'aria.formula':'T zero strettamente incluso in T uno strettamente incluso in T due',
    'alt.portrait':'Ritratto di Alain Bindele, software engineer a Roma'
  },

  en:{
    'nav.about':'about','nav.stack':'stack','nav.work':'work',
    'nav.paper':'research','nav.path':'path','nav.contact':'contact',

    'hero.loc':'Rome, Italy',
    'hero.lead':'Twenty years building backends that hold up over time. Java, Spring Boot, AWS, distributed systems, and a stubborn preference for code that reads well.',
    'hero.cta1':'See the work','hero.cta2':'Get in touch',
    'hero.chip1':'years of experience','hero.chip2':'MSc Computer Science','hero.chip3':'projects in production',
    'hero.scroll':'scroll',

    'about.title':'About','about.sub':'// professional profile',
    'about.bio':'Software Engineer with over 20 years of development behind me, across corporate and startup settings. I work on Java and Spring Boot backends, REST APIs, AWS, relational and NoSQL databases. I care about clean architecture, design patterns, and everything that keeps a system maintainable five years from now. I have done technical training and mentoring, and I believe design clarity counts as much as the code implementing it.',
    'about.k1':'years of code','about.k2':'roles since 2005',
    'about.l1':'native','about.l2':'strong technical','about.l3':'basic',
    'about.edu':'MSc in Computer Science',
    // TODO(alain): role you are looking for, work mode, availability
    'about.avail':'Available for: [TARGET ROLE] · [remote / hybrid in Rome] · [from when]',

    'stack.title':'Stack','stack.sub':'// everyday technologies',

    'work.title':'Work','work.f0':'all','work.f1':'products','work.f2':'sites','work.f3':'collab',
    'work.hint':'↔ scroll','work.go':'visit',
    'work.newTab':'(opens in a new tab)','work.shot':'Screenshot of',

    'paper.title':'Research','paper.sub':'// independent contributions',
    'paper.h':'The Minimal Hierarchy of Self-Certification',
    'paper.abs':'I show that self-certification in arithmetic requires exactly two levels of reflection — no more, no less. Any recursively axiomatisable theory that defines truth for a base theory T₀ and proves its own soundness necessarily splits into a minimal hierarchy. Truth can be defined at level one, or certified at level two, but never both within the same theory.',
    'paper.cta':'Read the paper',

    'path.title':'Path','path.sub':'// git log --reverse --author="alain"',

    'term.title':'Console','term.sub':'// yes, it actually works. try `help`',

    'contact.title':'Let’s talk','contact.sub':'// open to collaborations, consulting and good ideas',
    'contact.cvTitle':'Download my CV','contact.cv':'PDF · English',
    'contact.cvAlt':'CV also available in','contact.cvAltLink':'Italian (PDF)',

    'foot.made':'made in Rome, on too much caffeine',

    'boot.skip':'click or press any key to skip',

    'aria.sections':'Sections','aria.menu':'Menu',
    'aria.scroll':'Scroll to the About section',
    'aria.formula':'T zero strictly contained in T one strictly contained in T two',
    'alt.portrait':'Portrait of Alain Bindele, software engineer based in Rome'
  }
};
