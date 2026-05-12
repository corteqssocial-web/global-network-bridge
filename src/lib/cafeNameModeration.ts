// Lightweight content moderation for cafe names.
// Rejects political party names, religious terms, slurs, profanity and the
// names of well-known leaders/figures (TR + global) to keep the community safe.

const FORBIDDEN_PATTERNS: RegExp[] = [
  // Profanity / slurs (TR + intl., partial list — case-insensitive)
  /\b(amk|aq|amına|orospu|piç|göt|sik|yarra|pezevenk|kahpe|ibne|puşt|ş[ie]rfes[ıi]z)\b/i,
  /\b(fuck|shit|bitch|asshole|cunt|nigger|faggot)\b/i,

  // Religion / sect references
  /\b(islam|müslüman|musluman|hristiyan|christian|yahudi|jewish|musevi|alevi|sünni|sunni|şii|shia|ateist|atheist|deist|kâfir|kafir|gavur|tanrı|allah|jesus|isa|muhammed|buda|hindu)\b/i,
  /\b(cami|mosque|kilise|church|sinagog|synagogue|tarikat|cemaat|tarık|fethullah|gülen|gulen)\b/i,

  // Political parties (TR + intl.)
  /\b(akp|chp|mhp|hdp|iyi parti|iyip|tip|dem parti|saadet|deva|gelecek|zafer partisi|memleket partisi|vatan partisi|bbp|hüda par|huda par)\b/i,
  /\b(cumhuriyet halk|adalet ve kalkınma|milliyetçi hareket|halkların demokratik|büyük birlik)\b/i,
  /\b(republican|democrat|gop|labour|tory|conservative|afd|spd|cdu|csu|fdp|grünen|gruenen|fpö|fpoe|öVP|ovp)\b/i,

  // Leaders / political figures (TR + intl., common forms)
  /\b(erdoğan|erdogan|kılıçdaroğlu|kilicdaroglu|bahçeli|bahceli|imamoğlu|imamoglu|davutoğlu|davutoglu|babacan|akşener|aksener|özel\b|atatürk|ataturk|inönü|inonu|menderes|özal|ozal|demirel|ecevit)\b/i,
  /\b(trump|biden|obama|putin|xi jinping|netanyahu|merkel|macron|orban|orbán|le pen|meloni|sunak|starmer|modi|zelensky)\b/i,

  // Hate / extremism
  /\b(nazi|hitler|mussolini|stalin|isis|işid|isid|pkk|pyd|fetö|feto|deaş|deas|taliban|hamas|hizbullah|hezbollah)\b/i,
];

export type CafeNameModerationResult =
  | { ok: true }
  | { ok: false; reason: string };

export const moderateCafeName = (raw: string): CafeNameModerationResult => {
  const name = (raw || "").trim();
  if (!name) return { ok: false, reason: "Cafe adı boş olamaz." };
  if (name.length < 2) return { ok: false, reason: "Cafe adı çok kısa." };

  for (const re of FORBIDDEN_PATTERNS) {
    if (re.test(name)) {
      return {
        ok: false,
        reason:
          "Topluluk kurallarına aykırı: parti, siyasi/dini referanslar, lider isimleri, küfür ve hakaret içeren cafe adlarına izin verilmiyor.",
      };
    }
  }
  return { ok: true };
};
