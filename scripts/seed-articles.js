const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const articles = [
  {
    title: "Au-delà des “expressions toutes faites”",
    slug: "au-dela-des-expressions-toutes-faites",
    content: `Beaucoup pensent qu’apprendre quelques “expressions utiles” suffit pour parler une langue.
Mais dans la vraie vie, la conversation n’est jamais prévisible.
Votre interlocuteur ne choisira pas ses mots pour vous — et c’est là que la différence se fait.
Plus votre vocabulaire est riche, plus vous avez de liberté pour comprendre, réagir et vous exprimer naturellement.
Apprendre une langue, c’est donc un apprentissage sans fin : nouveaux mots, synonymes, expressions, tournures… tout compte.
Parce qu’en conversation réelle, ceux qui ont appris au-delà du minimum utile sont ceux qui savent vraiment parler.
Chaque mot que vous ajoutez à votre vocabulaire est une arme de plus dans votre spontanéité.
Chaque verbe maîtrisé, chaque expression comprise, réduit l’incertitude d’une conversation réelle.`
  },
  {
    title: "Personne n’est trop occupé pour apprendre l’anglais",
    slug: "personne-nest-trop-occupe-pour-apprendre-langlais",
    content: `On dit souvent : « Je n’ai pas le temps ». « je suis très occupé ces temps-ci ». « mon programme a changé dernièrement».
Mais en réalité, le temps ne manque pas — c’est la priorité qui change.
Et à une époque où l’anglais est devenu une compétence vitale, ne pas apprendre, c’est se priver d’opportunités, de liberté et d’ouverture. 
Vivre dans un pays francophone ne doit pas être une excuse.
Les langues ne s’apprennent pas seulement à l’étranger — elles s’acquièrent dans la régularité, quelques minutes par jour, dans la curiosité et surtout la discipline.
Un mot nouveau, une expression entendue, une conversation écoutée… chaque petit pas compte.
Aujourd’hui, savoir parler anglais, c’est savoir se connecter au monde.
C’est comprendre, négocier, voyager, collaborer, oser.
Et cela ne demande pas des heures perdues, mais une vraie décision : celle d’avancer, même un peu, chaque jour.
Chez Prime Language Academy (PLA), nous croyons qu’il n’existe pas de personnes trop occupées —
seulement des personnes qui n’ont pas encore réalisé à quel point l’anglais peut changer leur vie.`
  },
  {
    title: "NE QUITTEZ PAS LE CHEMIN EN PLEIN APPRENTISSAGE",
    slug: "ne-quittez-pas-le-chemin-en-plein-apprentissage",
    content: `Apprendre l’anglais, c’est un beau défi — mais comme tout apprentissage sérieux, il y a des moments où la motivation baisse, où le temps semble manquer, où les résultats paraissent lents.
C’est là que beaucoup commettent l’erreur fatale : abandonner.
Mais abandonner en plein parcours, c’est perdre le double : le temps investi et l’argent dépensé.
Et pire encore, c’est briser votre élan intérieur, celui qui vous avait poussé à commencer.
Quand on quitte une formation en cours de route, on se dit “reprendre plus tard” ou “changer de centre pour mieux avancer”.
Mais souvent, on entre dans un cercle sans fin : centre après centre, frustration après frustration, sans jamais atteindre la maîtrise espérée.
La vérité, c’est qu’il se ressaisir là où vous êtes.
Reprenez vos notes, révisez vos mots, assistez à vos séances, même fatigué.
Car chaque reprise de courage, chaque révision, chaque petit effort renforce votre discipline linguistique — la seule vraie clé du succès.
Apprendre une langue n’est pas une course, c’est une construction.
Et comme toute construction, si vous arrêtez en plein milieu, le chantier s’abîme, et tout est à refaire.
Chez Prime Language Academy (PLA), nous croyons qu’un apprenant qui tient bon, même dans le doute, est déjà en train de gagner.
Alors ne fuyez pas votre apprentissage : achevez-le.
Car la vraie perte, ce n’est jamais l’échec — c’est l’abandon.`
  },
  {
    title: "QUAND TU CHOISIS D’APPRENDRE L’ANGLAIS, RESTE ENGAGE JUSQU’AU BOUT",
    slug: "quand-tu-choisis-dapprendre-langlais-reste-engage-jusquau-bout",
    content: `Apprendre l’anglais n’est pas un passe-temps, c’est une mission avec un début et une fin.
Une période clairement définie pendant laquelle tu dois tout donner : ton attention, ton énergie, ta discipline.
Pendant ces semaines ou ces mois de formation, l’anglais doit passer en priorité.
C’est le moment de réduire les distractions, de garder le cap et de vivre ton apprentissage à fond.
Ceux qui progressent vraiment ne sont pas les plus doués — ce sont ceux qui restent constants, même quand c’est difficile, même quand la motivation baisse.
Car la clé, ce n’est pas la vitesse, c’est l’engagement sans faille jusqu’à la fin du parcours.
Tu n’apprends pas pour apprendre.
Tu apprends pour transformer ta vie, tes opportunités, ta confiance.
Alors, pour ces quelques semaines, fais de l’anglais ta priorité absolue.
Ce n’est qu’un temps — mais c’est ce temps-là qui fera toute la différence.
Une fois ta formation achevée avec succès, ta vie reprends mais en mieux car ta confiance, tes opportunités se transforme. Ta vie se transforme.`
  },
  {
    title: "Vous avez du mal à vous exprimer en anglais ? Commencez par vérifier vos bases",
    slug: "vous-avez-du-mal-a-vous-exprimer-en-anglais-commencez-par-verifier-vos-bases",
    content: `Beaucoup d’apprenants se sentent bloqués lorsqu’ils essaient de parler anglais.
Certains pensent même que :
« On ne peut pas devenir fluent en vivant dans un pays francophone. »
« Ici, on n’apprend que la grammaire, ça ne sert à rien. »
C’est faux. Et surtout, c’est exactement l’inverse de la réalité.

1. Si votre expression ne sort pas, vérifiez vos bases.
Lorsque vous n’arrivez pas à parler, ce n’est pas un problème de courage ou d’intelligence.
C’est presque toujours un problème de fondations linguistiques :
• structure de phrase instable,
• conjugaison non automatisée,
• vocabulaire trop limité,
• manque de mots charnières,
• confusion dans les verbes essentiels.
Sans ces briques fondamentales, votre cerveau hésite… et votre bouche se bloque. Normal. Avec des bases solides, la parole devient automatique, simple et naturelle.

2. On peut devenir fluent n’importe où — surtout dans un pays francophone.
La fluency ne dépend pas du pays où vous vivez, mais du niveau que vous avez atteint avant de pratiquer intensivement.
Vérité 1 : On ne devient pas fluent par magie en voyageant. Quelqu’un qui part dans un pays anglophone avec un niveau faible restera bloqué pendant longtemps.
Vérité 2 : C’est justement dans un pays francophone qu’on doit construire la base solide. Parce que vous n’êtes pas exposé à l’anglais 24h/24, votre seule véritable force est une grammaire claire, un vocabulaire riche, et des structures automatisées.

Conclusion
Si aujourd’hui vous avez du mal à parler anglais, ne vous découragez pas. Renforcez vos bases. C’est le seul chemin vers une expression naturelle, et c’est le meilleur investissement que vous puissiez faire.`
  },
  {
    title: "Pour bien apprendre, choisissez toujours les bons contenus",
    slug: "pour-bien-apprendre-choisissez-toujours-les-bons-contenus",
    content: `Aujourd’hui, nous avons accès à une quantité infinie de contenus : vidéos, applications, documents, cours gratuits, fiches, podcasts…
Mais apprendre efficacement ne dépend pas de la quantité consommée : cela dépend surtout de la qualité et de la pertinence des contenus que vous choisissez.

Votre progression dépend de trois questions essentielles :
1. Où voulez-vous aller ? Quel niveau, quel objectif, quelle finalité ?
2. Où en êtes-vous réellement aujourd’hui ? Votre niveau actuel doit guider vos choix.
3. Quels contenus correspondent exactement à votre étape ? Tous les contenus ne sont pas adaptés à tout le monde.

Un contenu mal choisi peut ralentir votre apprentissage, créer des confusions, vous décourager, ou vous faire stagner pendant des mois. À l’inverse, un contenu adapté vous fait progresser plus vite, plus clairement et avec moins d’efforts.

Choisir les bons contenus, c’est :
• éviter les pertes de temps,
• avancer avec plus de clarté,
• gagner en confiance,
• et atteindre votre objectif plus rapidement.
Parce qu’un apprentissage efficace n’est jamais une question d’abondance. C’est une question de choix.`
  },
  {
    title: "Hello! How are you? La petite récitation qui fait croire qu’on parle anglais",
    slug: "hello-how-are-you-la-petite-recitation-qui-fait-croire-quon-parle-anglais",
    content: `Beaucoup de personnes pensent qu’elles “parlent anglais” parce qu’elles peuvent enchaîner quelques phrases apprises depuis l’école :
“Hello! How are you? I’m fine, and you? Nice to meet you! Good bye.”
C’est propre, c’est rassurant… mais c’est aussi une illusion.

Ces expressions sont utiles, oui. Elles marquent un début. Mais elles ne représentent pas un niveau d’anglais — elles représentent juste une récitation.
Le problème, c’est que juste après ces phrases… tout s’arrête. Plus rien ne sort. Le cerveau se fige.

Dans la vie réelle, personne ne se limite à "Comment tu vas ? Je vais bien". Le vrai monde continue.
L’anglais n’est pas une récitation. C’est une capacité.
Parler anglais, c’est savoir répondre à l’imprévu, reformuler, décrire, parler d’un problème. Aucune récitation ne prépare à ça. Le réel exige du vocabulaire, des verbes, et des réflexes.
Se limiter à “Hello! How are you?” ne fait pas de vous un anglophone. Mais c’est un bon point de départ.`
  },
  {
    title: "FORMATION APERO OU FORMATION SERIEUSE ?",
    slug: "formation-apero-ou-formation-serieuse",
    content: `Aujourd’hui, on voit apparaître partout des petites formations “express”, des programmes “rapides”, des séances “apéro” censées vous apprendre l’anglais en un clin d’œil.
C’est séduisant, léger, amusant… mais ce n’est pas ça qui vous fera parler.

La vérité est simple :
👉 On ne devient pas anglophone avec une formule apéritive.
👉 On s’exprime en anglais avec une formation qui a du contenu, une durée, et une méthode.

La langue n’est pas un snack. C’est une construction.
Une formation trop courte peut donner l’impression de progrès… mais ne transforme pas votre expression. Elle amuse, elle motive un instant, mais elle ne construit rien de durable.
À l’inverse, une formation sérieuse vous donne la confiance, la vraie compréhension, la capacité à parler, l’automatisme, et la fluidité.
Le but n’est pas d’avoir “fait une formation hein !”. Le but, c’est de pouvoir parler, comprendre, réagir, et être autonome.`
  },
  {
    title: "L'Anglais : Le Nouveau Ciment de l'Émergence Africaine",
    slug: "langlais-le-nouveau-ciment-de-lemergence-africaine",
    content: `En Côte d’Ivoire, nous savons ce que signifie « faire corps ». Avec plus de 60 langues nationales, nous avons su ériger le Français comme un pont. Mais aujourd’hui, le monde frappe à la porte d’Abidjan, et les frontières de nos ambitions ont changé.

Abidjan n’est plus seulement la perle des lagunes ; elle est devenue le carrefour incontournable de l’Afrique de l’Ouest.
Si le Français nous a unis hier, l'Anglais est le ciment qui scellera l’unité de l’Afrique de demain. Imaginez une Zone de Libre-Échange Continentale Africaine (ZLECAF) où un entrepreneur de San-Pedro négocie avec fluidité avec un fournisseur de Nairobi ou un financier de Johannesburg.

Ce n’est pas une question de préférence culturelle, c’est une question de compétitivité.
90% des échanges technologiques et financiers mondiaux passent par l'anglais. Sans cette maîtrise, nous restons des spectateurs.
L’Afrique de demain se construit en anglais. N’attendez pas que l’opportunité se présente pour apprendre l’anglais. Apprenez l’anglais pour que l’opportunité ne puisse plus vous échapper.`
  },
  {
    title: "Votre ambition parle-t-elle Anglais ?",
    slug: "votre-ambition-parle-t-elle-anglais",
    content: `En Côte d’Ivoire, nous avons une force : nous savons nous adapter. Mais aujourd'hui, une vérité s'impose à quiconque veut passer au niveau supérieur : le français vous donne accès à une région, l’anglais vous donne accès au monde.

1. Ne soyez plus "l'intermédiaire", soyez le décideur.
Combien de contrats vous ont échappé parce qu’il fallait un interprète ? L’anglais, c’est votre indépendance.

2. Le marché ivoirien est trop petit pour votre talent.
Pour l'entrepreneur, c'est pitcher devant des investisseurs. Pour le cadre, c'est postuler aux postes de direction des multinationales. Pour l'étudiant, c'est l'accès à 80% des ressources éducatives mondiales.

3. L'Afrique s'unit : ferez-vous partie du voyage ?
L'Ivoirien de demain collaborera avec le Nigérian et le Sud-Africain. L’anglais est le seul terrain d'entente.
Chez Prime Language Academy, nous savons que vous n'avez pas de temps à perdre. Le monde n'attend pas. L'Afrique avance. Et vous ?`
  },
  {
    title: "Le Mythe du Séjour Linguistique : Et si on arrêtait de se mentir ?",
    slug: "le-mythe-du-sejour-linguistique-et-si-on-arretait-de-se-mentir",
    content: `C’est devenu le premier réflexe de tout francophone qui veut apprendre l’anglais : « Je vais partir un mois au Ghana », ou « Je cherche un visa pour Londres ». On pense qu’en traversant la frontière, l’anglais va s’infuser dans notre cerveau par l’air qu’on respire.

La réalité du terrain : Après trois mois et des millions dépensés, vous maîtrisez parfaitement le "Good morning, how are you?". Et après ?
Le temps : Trois mois ne suffisent pas pour devenir bilingue.
Le piège communautaire : On finit par passer ses journées avec d'autres francophones parce que c'est "plus simple".

L'immersion, ça ne se voyage pas, ça se crée.
Pourquoi dépenser des fortunes à l'étranger quand le secret c'est la méthode ? S'exprimer fluidement en restant en Côte d'Ivoire, c'est possible et plus intelligent : vous apprenez dans votre contexte professionnel, sans rupture, et à coût maîtrisé.
Le bilinguisme ne s'achète pas avec un billet d'avion. Il se bâtit avec de la rigueur, ici même, chez nous.`
  },
  {
    title: "ARRÊTE TES PHASES : L’ANGLAIS N’ATTEND PAS TES EXCUSES !",
    slug: "arrete-tes-phases-langlais-nattend-pas-tes-excuses",
    content: `Si cest avec Anglais tu as discours là ah, Adaman, Fo laisser.
Au début, tu étais "enjaillé" : « Cette année, je vais parler anglais ! ». Mais après deux efforts : « Le temps me manque », « C’est serré niveau djèh ».

Soyons clairs : l’anglais que tu voulais apprendre là, tu maîtrises déjà ? Si la réponse est NON, alors pourquoi tu veux mettre pause ? Mettre pause maintenant, c’est comme si tu n’avais rien fait du tout.
Si tu es fatigué de fournir l'effort, dis-le. Mais ne cherche pas d'excuse. Pendant que tu "mets pause", le monde avance. Tes collègues anglophones, tes concurrents ghanéens et nigérians sont sur le terrain.

C’est une réalité brutale : si tu ne te ressaisis pas, tu vas lire l’heure. Demain, quand on te demandera : "Do you speak English?", tes excuses ne te serviront à rien.
Anglais est Calé aujourd’hui, il est Calé demain. Viens tu vas le Dédagé ! Le bilinguisme ne s'achète pas en promo, il se gagne dans la durée.`
  },
  {
    title: "ADAMAN, SI C’EST AVEC ANGLAIS TU AS DISCOURS LÀ… AH, C’EST QUE TU AS CHAUD DEH!",
    slug: "adaman-si-cest-avec-anglais-tu-as-discours-la-ah-cest-que-tu-as-chaud-deh",
    content: `Soyons directs. Beaucoup disent : « On est en Côte d’Ivoire non ? On parle français, ça suffit ! ».
Mon frère, si c’est ton raisonnement là… tu es en train de parier contre l'avenir, et c'est un pari que tu vas perdre violemment.

Tu penses que l'Anglais c'est une mode ? Ce n’est pas un vent qui passe, c’est une vague qui emporte tout.
Les plus gros chantiers ? En Anglais. Les financements ? En Anglais. L'Afrique est en train de se connecter, et le "ciment", c'est la langue que tu négliges.

Si tu ne parles pas anglais, tu seras comme un analphabète du 21ème siècle. Tu vas voir des petits de 22 ans prendre des salaires de millions parce qu’ils sont bilingues.
Le scepticisme, c’est pour les perdants. Le bilinguisme n’est plus un bonus, c’est ton gilet de sauvetage. Sois tu montes dans le train, soit tu restes sur le quai à regarder les autres réussir.`
  },
  {
    title: "Pourquoi l’Apprentissage nu et l’Acquisition seule échouent en Côte d’Ivoire",
    slug: "pourquoi-lapprentissage-nu-et-lacquisition-seule-echouent-en-cote-divoire",
    content: `En Côte d’Ivoire, nous vivons une réalité unique : l’anglais est le moteur de nos ambitions, mais le français reste le maître de nos rues.
Certains vous promettent l’Acquisition pure (immersion naturelle). Mais sans structure, l'acquisition en zone francophone est un mirage.
D'autres vous vendent l’Apprentissage nu (grammaire pure). On se retrouve incapable de répondre à un appel téléphonique sans bégayer.

Chez PLA, nous avons compris que ces deux notions doivent être synchronisées.
L’Apprentissage comme Boussole : L'apprentissage rigoureux vous donne la posture et la précision.
L’Acquisition comme Moteur : Nous créons des mécanismes d'acquisition accélérée pour compenser l'absence d'immersion extérieure.

En synchronisant l'Apprentissage et l'Acquisition, nous créons un pont indestructible entre votre cerveau francophone et les opportunités anglophones.
Ne choisissez plus entre la forme et le fond. Exigez la synchronisation.`
  },
  {
    title: "ADAMAN, TU CHERCHES QUOI ENCORE ? LE TEMPS PASSE, LES AUTRES AVANCENT !",
    slug: "adaman-tu-cherches-quoi-encore-le-temps-passe-les-autres-avancent",
    content: `On vous voit. Ça fait des années que vous traînez sur les pages de formation. Vous demandez les tarifs, puis silence radio.
Pendant que vous êtes assis sur le banc de touche, d'autres qui ne savaient pas dire « Hello » hier négocient des contrats en anglais aujourd'hui.

Le syndrome du « Spectateur Éternel ». Tu attends quoi au juste ? Que l’anglais descende sur toi pendant que tu dors ?
Ton problème n’est pas le choix du cabinet, c’est ton indécision. Pendant que tu « analyses », les autres s’engagent, souffrent un peu, et transforment leur vie.

L’Afrique s’unit. Les opportunités pleuvent, mais elles ne parlent pas français. Chaque jour que tu passes à « réfléchir », c’est une promotion qui va chez ton collègue plus audacieux.
Soit tu restes un spectateur, soit tu deviens l'acteur de ta propre réussite.`
  },
  {
    title: "Pourquoi votre temps est notre priorité absolue chez Prime Language Academy",
    slug: "pourquoi-votre-temps-est-notre-priorite-absolue-chez-prime-language-academy",
    content: `Dans le milieu de la formation, on entend souvent : « Venez apprendre l'anglais ». Chez PLA, nous disons : « Venez atteindre votre objectif ».
Pour une élite, le temps est une ressource irremplaçable.

L’expertise du diagnostic, la signature PLA.
Nous ne croyons pas aux solutions "standard". Chaque individu bénéficie d'un Audit de Performance. Nous identifions précisément les verrous qui bloquent votre fluidité.

Le rôle de nos consultants n'est pas de vous donner des cours, mais de piloter votre progression. En croisant nos audits avec vos contraintes, ils définissent la durée optimale et les leviers prioritaires.
Zéro temps mort, 100% de résultats. Nous ne vous vendons pas des heures de cours, nous vous vendons le chemin le plus court vers votre bilinguisme.`
  },
  {
    title: "Le Silence des Sceptiques : Quand l'Anglais sépare les Leaders des Suiveurs",
    slug: "le-silence-des-sceptiques-quand-langlais-separe-les-leaders-des-suiveurs",
    content: `Vous êtes dans un cocktail d’affaires. Tout le monde parle français. Soudain, un partenaire étranger pose une question. Le silence s'installe.
Et là, votre voisin prend la parole et déroule un anglais limpide, fluide. À cet instant, vous prenez une gifle invisible.

L’illusion du confort francophone.
Vous pensiez que l'anglais était une option. Erreur fatale. La personne qui vient de marquer la différence vient de passer dans une autre dimension, celle de l'élite connectée au monde.

L’Anglais : Votre assurance tous risques.
C'est une compétence qui se révèle quand les enjeux deviennent sérieux : quand il faut sauver un contrat, saisir une opportunité, ou imposer son leadership.
Ne soyez plus celui qui baisse les yeux. L’anglais n’est pas un accessoire, c’est votre puissance de frappe.`
  },
  {
    title: "ANGLAIS LA, CE N’EST PAS TRAITEMENT A VIE : Faut faire ça va quitter dans ton programme !",
    slug: "anglais-la-ce-nest-pas-traitement-a-vie-faut-faire-ca-va-quitter-dans-ton-programme",
    content: `Djo, c’est Anglais tu apprends comme tantie est en train de boire café chaud là ? Tu prends une petite gorgée, tu laisses, tu reviens...
Arrête de « grignoter » ta formation. Si tu fais ça avec l'Anglais, on va bouffer ton argent deh ! Et à la fin, c'est toi seul qui seras frustré.

Si tu te fâches, l'Anglais s'en fout, il continue de dominer le monde. Si tu fuis aujourd'hui, ça va te rattraper.
Si tu veux apprendre, faut apprendre ça en même temps ! Mets y du Sérieux. On se fixe un délai, on atteint notre objectif et c’est tout.
À Prime Language Academy, on ne fait pas carrière là-bas, on atteint nos objectifs et on se libère.`
  },
  {
    title: "ANGLAIS LÀ, CE N’EST PAS SORCIER: FAUT T’APPLIQUER TU VAS VOIR!",
    slug: "anglais-la-ce-nest-pas-sorcier-faut-tappliquer-tu-vas-voir",
    content: `Si tu n’avances pas, le problème n’est pas la méthode, c’est TOI.
Tu accuses le temps, l’argent, les centres... mais sur le terrain, tu es incapable de sortir une phrase sérieuse.

Beaucoup débutent la formation avec légèreté. Vous venez chez le spécialiste, mais vous jouez aux experts. Tu te joues au connaisseur mais tu ne peux rien créer en Anglais.
Anglais là, ce n’est pas un traitement à vie ! Si tu ne te concentres pas à 100% sur ta période de formation, tu vas traîner cette lacune jusqu'à ta retraite.
Le temps n'attend personne. Soit tu décides d'être sérieux, soit tu restes spectateur. On ne soigne pas l'anglais à l'infini : on le maîtrise et on passe à autre chose.`
  },
  {
    title: "ABIDJAN EST DUR, MAIS TON ANGLAIS NE DOIT PAS L’ÊTRE : LA STRATÉGIE DES 2 SÉANCES",
    slug: "abidjan-est-dur-mais-ton-anglais-ne-doit-pas-letre-la-strategie-des-2-seances",
    content: `À Abidjan, on connaît la chanson : embouteillages, réunions, fatigue. Celui qui te demande de venir en cours 4 fois par semaine cherche à te décourager.
Chez PLA, nous avons conçu un format : 2 séances de 2h30 par semaine.

1. Le temps de "digérer". Nos séances espacées créent un manque volontaire : tu reviens avec un véritable appétit d’apprendre.
2. Nous ne confisquons pas tes soirées. Nous protégeons ton équilibre.
3. Un contenu Haute Efficacité. 5 heures chez nous valent 15 heures ailleurs.
4. L'Empowerment. Entre les séances, tu restes engagé avec des activités sur mesure.

Le véritable secret de l'anglais, ce n'est pas de souffrir tous les jours, c'est de s'appliquer intelligemment.`
  },
  {
    title: "QUAND TU DOIS RATER QUELQUE CHOSE, C’EST COMME ÇA : « MAIS… MAIS…EST-CE QUE… »",
    slug: "quand-tu-dois-rater-quelque-chose-cest-comme-ca-mais-mais-est-ce-que",
    content: `On propose des facilités uniques, mais pour certains, ça devient une épreuve de doute : « Mais, est-ce que ça vrai même ? », « Je vous reviens ».

L’Expert Analyste qui ne pique pas en Anglais. Tu calcules tout, pourtant tu es muet en Anglais.
À quoi ça sert d'être un génie de l'analyse si tu restes muet devant en Anglais ? Le doute ne te protège pas, il te paralyse.
Quand la promo sera finie, c'est là que tu vas réaliser que tu as laissé passer le train à cause de tes « Mais... ».

PLA n'attend pas les indécis. Nos promos sont faites pour ceux qui sautent sur l'occasion sans bégayer en français devant une porte qui s'ouvre. Arrête de trop analyser ta vie, commence à la transformer.`
  },
  {
    title: "SI TU CONNAIS DÉJÀ TOUT, POURQUOI TU NE PARLES PAS ?",
    slug: "si-tu-connais-deja-tout-pourquoi-tu-ne-parles-pas",
    content: `Il y a des comportements qui freinent votre succès : l’apprenant juge le cours. « Oh, ça je connais déjà ». Mais quand on lance une discussion, c'est le silence total.

Si tu ne peux pas exprimer une idée correctement, avec fluidité, c’est que tu ne connais RIEN. Apprendre une langue, ce n'est pas collectionner des règles de grammaire ; c'est être capable de les sortir au moment où l'opportunité se présente.
La répétition n'est pas une perte de temps, c'est la mère de l'acquisition.

Si tu penses que tu n'as plus rien à apprendre, reste chez toi. PLA est un centre pour ceux qui veulent être transformés, pas pour valider ce qu'ils croient savoir.`
  },
  {
    title: "SI TU NE PARLES PAS ANGLAIS, TU NE VAS PAS MOURIR. MAIS, TU VAS LIRE L’HEURE UN JOUR.",
    slug: "si-tu-ne-parles-pas-anglais-tu-ne-vas-pas-mourir-mais-tu-vas-lire-lheure-un-jour",
    content: `Si tu ne parles pas anglais à Abidjan, tu ne vas pas mourir de faim. Mais si tu te dis que tu es un Leader, alors ton silence en anglais est une honte.

Une arme pour ne pas être humilié. Un jour, tu vas te retrouver face à une opportunité qui peut changer ta vie, mais elle sera en anglais. Et ce jour-là, ton titre de Directeur ne te servira à rien.

L’Assurance de l’Élite. À PLA, on vous donne une Assurance Tous Risques pour rester honorable quand le ton change dans une réunion.
N’attends pas d'être humilié par une opportunité trop grande pour toi. Prends ton assurance maintenant.`
  },
  {
    title: "C’EST QUEL CABINET QUI A FERME A CAUSE DE TOI ? TU ES VENU TROUVER TU VAS PARTIR POUR LAISSER",
    slug: "cest-quel-cabinet-qui-a-ferme-a-cause-de-toi",
    content: `Tu as commencé la formation avec de grands mots. Et puis, au milieu du chemin, paf ! Tu disparais avec toutes sortes d'excuses.

Tes excuses là, ça ne donne pas la compétence. Tu fuis les séances, mais est-ce que tu peux fuir les opportunités qui demandent l'anglais ?
L’inconstance est le poison de ton standard. Si tu disparais à la moindre difficulté, ne sois pas surpris de rester au même niveau pendant 10 ans. Commencer et ne pas terminer, c’est pire que de n’avoir jamais commencé.

Sois sérieux, termine ce que tu as commencé, et deviens enfin l’homme ou la femme honorable que tu prétends être.`
  },
  {
    title: "DJO, DANS ANGLAIS LÀ, Y’A PAS « J’APPRENDS UN PEU UN PEU » !",
    slug: "djo-dans-anglais-la-ya-pas-japprends-un-peu-un-peu",
    content: `C’est dans « j’apprends un peu un peu » là que tu es depuis le collège. Le « un peu un peu » là, c’est le cimetière de tes opportunités.

Mets la honte et la fierté de côté ! On te voit, tu es un bosse. Mais quand l’anglais sort, tu deviens petit. Pourquoi tu veux porter un fardeau que tu ne maîtrises pas ? Faut venir, on va te débloquer ! On va nettoyer ton anglais pour qu’il soit à la hauteur de ton titre.

Tu sais, souvent tu as essayé les applis, les films... mais ça reste "lourd". Il n'y a pas de honte à avoir besoin d'un déblocage.
Arrête de perdre le temps dans le « un peu un peu ». Viens on va finir avec ça une bonne fois pour toutes.`
  }
];

async function main() {
  console.log('Finding or creating author...');
  let author = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!author) {
    author = await prisma.user.create({
      data: {
        email: 'admin_blog@prime.com',
        name: 'Prime Academy',
        passwordHash: 'dummy',
        role: 'ADMIN'
      }
    });
  }

  console.log('Clearing old articles...');
  await prisma.article.deleteMany({});

  console.log('Seeding articles...');
  let count = 0;
  for (const article of articles) {
    // Basic formatting: convert line breaks to HTML paragraphs.
    const formattedContent = article.content.split('\\n\\n').map(p => '<p class="mb-4">' + p.replace(/\\n/g, '<br />') + '</p>').join('');
    
    await prisma.article.create({
      data: {
        title: article.title,
        slug: article.slug,
        content: formattedContent,
        published: true,
        authorId: author.id,
        category: 'MOTIVATION',
        // Optional cover image could be added here if needed, but we'll leave it null to use a default or none.
      }
    });
    count++;
  }
  console.log("Successfully seeded " + count + " articles!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
