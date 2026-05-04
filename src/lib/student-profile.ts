export type StudentProfileData = {
  type?: string;
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
