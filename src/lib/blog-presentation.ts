type BlogArticle = {
  title: string;
  slug: string;
  content: string;
  coverImage?: string | null;
  category?: string | null;
};

const editorialImages = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571260899304-4250701120f6?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=82&auto=format&fit=crop",
];

const titleOverrides: Record<string, string> = {
  "au-dela-des-expressions-toutes-faites": "Ne pas se limiter aux expressions toutes faites",
  "personne-nest-trop-occupe-pour-apprendre-langlais": "Trouver du temps pour apprendre l'anglais",
  "ne-quittez-pas-le-chemin-en-plein-apprentissage": "Pourquoi il faut terminer son parcours d'apprentissage",
  "quand-tu-choisis-dapprendre-langlais-reste-engage-jusquau-bout": "Rester engage jusqu'au bout de sa formation",
  "hello-how-are-you-la-petite-recitation-qui-fait-croire-quon-parle-anglais": "Au-dela des salutations: construire une vraie parole",
  "formation-apero-ou-formation-serieuse": "Formation courte ou parcours serieux: ce qui fait progresser",
  "langlais-le-nouveau-ciment-de-lemergence-africaine": "L'anglais, nouveau levier de l'emergence africaine",
  "votre-ambition-parle-t-elle-anglais": "Votre ambition parle-t-elle anglais ?",
  "le-mythe-du-sejour-linguistique-et-si-on-arretait-de-se-mentir": "Le mythe du sejour linguistique",
  "arrete-tes-phases-langlais-nattend-pas-tes-excuses": "L'anglais n'attend pas les excuses",
  "adaman-si-cest-avec-anglais-tu-as-discours-la-ah-cest-que-tu-as-chaud-deh": "Quand l'anglais devient une urgence professionnelle",
  "pourquoi-lapprentissage-nu-et-lacquisition-seule-echouent-en-cote-divoire": "Apprentissage et acquisition: pourquoi il faut les synchroniser",
  "adaman-tu-cherches-quoi-encore-le-temps-passe-les-autres-avancent": "Pendant que vous hesitez, les autres avancent",
  "pourquoi-votre-temps-est-notre-priorite-absolue-chez-prime-language-academy": "Pourquoi votre temps est notre priorite absolue",
  "le-silence-des-sceptiques-quand-langlais-separe-les-leaders-des-suiveurs": "Quand l'anglais separe les leaders des suiveurs",
  "anglais-la-ce-nest-pas-traitement-a-vie-faut-faire-ca-va-quitter-dans-ton-programme": "L'anglais n'est pas un traitement a vie",
  "anglais-la-ce-nest-pas-sorcier-faut-tappliquer-tu-vas-voir": "L'anglais n'est pas sorcier: il demande de l'application",
  "abidjan-est-dur-mais-ton-anglais-ne-doit-pas-letre-la-strategie-des-2-seances": "La strategie des deux seances pour progresser a Abidjan",
  "quand-tu-dois-rater-quelque-chose-cest-comme-ca-mais-mais-est-ce-que": "Trop d'hesitation peut faire manquer une opportunite",
  "si-tu-connais-deja-tout-pourquoi-tu-ne-parles-pas": "Connaitre les regles ne suffit pas pour parler",
  "si-tu-ne-parles-pas-anglais-tu-ne-vas-pas-mourir-mais-tu-vas-lire-lheure-un-jour": "Ne pas parler anglais peut limiter vos opportunites",
  "cest-quel-cabinet-qui-a-ferme-a-cause-de-toi": "Pourquoi terminer sa formation compte autant que commencer",
  "djo-dans-anglais-la-ya-pas-japprends-un-peu-un-peu": "Progresser en anglais demande une vraie discipline",
};

const summaryOverrides: Record<string, string> = {
  "djo-dans-anglais-la-ya-pas-japprends-un-peu-un-peu":
    "La progression en anglais demande une decision claire, un rythme regulier et une vraie discipline. Les petites tentatives dispersees donnent rarement une maitrise durable.",
  "cest-quel-cabinet-qui-a-ferme-a-cause-de-toi":
    "Commencer une formation est important, mais la terminer est ce qui transforme vraiment le niveau, la confiance et les opportunites.",
  "si-tu-ne-parles-pas-anglais-tu-ne-vas-pas-mourir-mais-tu-vas-lire-lheure-un-jour":
    "L'anglais n'est pas seulement une competence scolaire: c'est un levier professionnel qui peut ouvrir ou fermer des portes importantes.",
  "si-tu-connais-deja-tout-pourquoi-tu-ne-parles-pas":
    "Savoir reconnaitre une regle ne signifie pas savoir l'utiliser en conversation. La vraie competence se mesure dans l'expression.",
  "abidjan-est-dur-mais-ton-anglais-ne-doit-pas-letre-la-strategie-des-2-seances":
    "Un rythme bien pense permet de progresser sans epuiser son agenda. La regularite et la qualite priment sur la surcharge.",
  "le-mythe-du-sejour-linguistique-et-si-on-arretait-de-se-mentir":
    "L'immersion ne remplace pas les bases. Sans methode, partir ailleurs ne garantit ni la fluidite ni la confiance.",
  "votre-ambition-parle-t-elle-anglais":
    "Pour les entrepreneurs, cadres et etudiants ambitieux, l'anglais devient un outil d'independance et d'acces au marche mondial.",
  "pourquoi-votre-temps-est-notre-priorite-absolue-chez-prime-language-academy":
    "Une bonne formation doit respecter le temps de l'apprenant: diagnostic, priorites claires et progression mesurable.",
};

function hashSlug(slug: string) {
  return slug.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
}

function isAllowedImage(src: string) {
  return (
    src.startsWith("/") ||
    src.startsWith("https://images.unsplash.com/") ||
    /^https:\/\/[^/]+\.public\.blob\.vercel-storage\.com\//.test(src)
  );
}

export function articleImage(article: BlogArticle) {
  const cover = article.coverImage?.trim();
  if (cover && isAllowedImage(cover)) return cover;
  return editorialImages[hashSlug(article.slug) % editorialImages.length];
}

export function plainArticleText(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function articleExcerpt(article: Pick<BlogArticle, "content">, maxLength = 170) {
  const text = plainArticleText(article.content);
  if (text.length <= maxLength) return text;
  const sliced = text.slice(0, maxLength).replace(/\s+\S*$/, "");
  return `${sliced}...`;
}

export function readingTime(article: Pick<BlogArticle, "content">) {
  const words = plainArticleText(article.content).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}

export function displayTitle(title: string) {
  const trimmed = title.trim().replace(/\s+/g, " ");
  const letters = trimmed.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, "");
  const upper = letters.replace(/[^A-ZÀ-Ö]/g, "");
  const isShouting = letters.length > 12 && upper.length / letters.length > 0.72;
  if (!isShouting) return trimmed;

  const lowered = trimmed.toLocaleLowerCase("fr-FR").replace(/\bpla\b/gi, "PLA");
  return lowered.charAt(0).toLocaleUpperCase("fr-FR") + lowered.slice(1);
}

export function articleTitle(article: Pick<BlogArticle, "title" | "slug">) {
  return titleOverrides[article.slug] || displayTitle(article.title);
}

export function editorialSummary(article: BlogArticle, maxLength = 170) {
  return summaryOverrides[article.slug] || articleExcerpt(article, maxLength);
}

export function categoryLabel(category?: string | null) {
  const value = (category || "Conseils").trim();
  if (!value) return "Conseils";
  return value.charAt(0).toLocaleUpperCase("fr-FR") + value.slice(1).toLocaleLowerCase("fr-FR");
}
