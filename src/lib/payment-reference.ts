import { randomBytes } from "crypto";

type PaymentReferenceKind = "REG" | "RPY" | "PAY" | "ADM";

function dateStamp() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yy}${mm}${dd}`;
}

export function createPaymentReference(kind: PaymentReferenceKind = "PAY") {
  const suffix = randomBytes(4).toString("hex").toUpperCase();
  return `PLA-${kind}-${dateStamp()}-${suffix}`;
}
