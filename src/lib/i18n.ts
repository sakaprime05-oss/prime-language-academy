import { cookies } from "next/headers";

export const dictionaries = {
  fr: {
    nav: {
      dashboard: "Accueil",
      courses: "Mes Cours",
      forum: "Forum",
      club: "English Club",
      appointments: "Rendez-vous",
      messages: "Messagerie",
      profile: "Mon Profil",
      logout: "Déconnexion",
      navigation: "Navigation"
    },
    dashboard: {
      welcome: "Salut",
      ready_course: "Prêt pour votre séance d'anglais ?",
      ready_club: "Prêt pour votre prochaine session de networking ?",
      plan_pending: "Plan en attente d'activation",
      plan_pending_desc: "L'administration valide votre inscription. Merci de votre patience !",
      your_plan: "Votre Formule Actualisée",
      your_club: "Votre Membership English Club",
      member_since: "Membre depuis",
      start_date: "Début",
      progress: "Progression Globale",
      lessons_left: "Leçons à venir",
      club_status: "Status Membre",
      active: "ACTIF",
      get_ready: "Préparez-vous !",
      continue: "Continuer l'apprentissage",
      resume: "Reprendre",
      next_session: "Next Session",
      book_talk: "Réservez votre place pour le prochain Talk",
      book: "Réserver",
      my_courses: "Mes Cours",
      community: "Community",
      private_meet: "Private Meet",
      account: "Compte"
    }
  },
  en: {
    nav: {
      dashboard: "Home",
      courses: "My Courses",
      forum: "Forum",
      club: "English Club",
      appointments: "Appointments",
      messages: "Messages",
      profile: "My Profile",
      logout: "Logout",
      navigation: "Navigation"
    },
    dashboard: {
      welcome: "Hello",
      ready_course: "Ready for your English session?",
      ready_club: "Ready for your next networking session?",
      plan_pending: "Plan pending activation",
      plan_pending_desc: "The administration is validating your registration. Thank you for your patience!",
      your_plan: "Your Current Plan",
      your_club: "Your English Club Membership",
      member_since: "Member since",
      start_date: "Start date",
      progress: "Overall Progress",
      lessons_left: "Upcoming lessons",
      club_status: "Member Status",
      active: "ACTIVE",
      get_ready: "Get ready!",
      continue: "Continue learning",
      resume: "Resume",
      next_session: "Next Session",
      book_talk: "Book your seat for the next Talk",
      book: "Book",
      my_courses: "My Courses",
      community: "Community",
      private_meet: "Private Meet",
      account: "Account"
    }
  }
};

export async function getDictionary() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("NEXT_LOCALE")?.value || "fr";
  return dictionaries[lang as "fr" | "en"] || dictionaries.fr;
}

export async function getLocale() {
  const cookieStore = await cookies();
  return cookieStore.get("NEXT_LOCALE")?.value || "fr";
}
