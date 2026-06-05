export type StudentProfileData = {
  type?: string;
  centerId?: string;
  phone?: string;
  whatsapp?: string;
  commune?: string;
  profession?: string;
  company?: string;
  objective?: string;
  learningGoal?: string;
  emergencyContact?: string;
  bio?: string;
  preferredName?: string;
  profilePhotoUrl?: string;
  birthDate?: string;
  availability?: string;
  estimatedLevel?: string;
  learningPreference?: string;
  days?: string[];
  timeSlot?: string;
  courseMode?: string;
  paymentOption?: string;
  paymentMethod?: string;
};

export type StudentPath = "FORMATION" | "HYBRID" | "CLUB";

export function parseStudentProfileData(value?: string | null): StudentProfileData {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function hasRequiredProfilePhoto(value?: string | null) {
  return Boolean(parseStudentProfileData(value).profilePhotoUrl);
}

export function getStudentPath(registrationType?: string | null, onboardingData?: string | null): StudentPath {
  if (registrationType === "CLUB") return "CLUB";
  const profile = parseStudentProfileData(onboardingData);
  return profile.type === "HYBRID" ? "HYBRID" : "FORMATION";
}

export function getStudentPathLabel(path: StudentPath) {
  if (path === "CLUB") return "English Club";
  if (path === "HYBRID") return "Formation Hybride";
  return "Formation Hybride";
}
