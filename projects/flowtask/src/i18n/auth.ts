export type AuthLang = 'en' | 'sk'

const messages = {
  en: {
    checkTitle: 'Check your email',
    checkBody: 'We sent a verification link to {email}. Please verify your email before signing in.',
    unverifiedTitle: 'Email not verified',
    unverifiedBody: 'Please verify your email address before continuing.',
    resend: 'Resend verification email',
    resent: 'Verification email sent again.',
    resendWait: 'Resend in {seconds}s',
    back: 'Back to login',
    sentTo: 'Sent to {email}',
    errorRate: 'Please wait a moment before requesting another email.',
    errorExists: 'An account with this email already exists. Try signing in.',
    errorUnverified: 'Please verify your email before signing in.',
    errorNetwork: 'Network error. Check your connection and try again.',
    errorAlreadyVerified: 'This email is already verified. Try signing in.',
    errorUnknown: 'Could not send the verification email. Try again later.',
    created: 'Account created. Check your email to verify it.',
  },
  sk: {
    checkTitle: 'Skontrolujte svoj e-mail',
    checkBody: 'Na adresu {email} sme odoslali overovací odkaz. Pred prihlásením si e-mail overte.',
    unverifiedTitle: 'E-mail nie je overený',
    unverifiedBody: 'Pred pokračovaním si overte svoju e-mailovú adresu.',
    resend: 'Znova odoslať overovací e-mail',
    resent: 'Overovací e-mail sme odoslali znova.',
    resendWait: 'Ďalšie odoslanie o {seconds} s',
    back: 'Späť na prihlásenie',
    sentTo: 'Odoslané na {email}',
    errorRate: 'Počkajte chvíľu pred ďalšou žiadosťou o e-mail.',
    errorExists: 'Účet s týmto e-mailom už existuje. Skúste sa prihlásiť.',
    errorUnverified: 'Pred prihlásením si overte e-mail.',
    errorNetwork: 'Chyba siete. Skontrolujte pripojenie a skúste to znova.',
    errorAlreadyVerified: 'Tento e-mail je už overený. Skúste sa prihlásiť.',
    errorUnknown: 'Overovací e-mail sa nepodarilo odoslať. Skúste to neskôr.',
    created: 'Účet bol vytvorený. Overte ho cez e-mail.',
  },
} as const

export type AuthMessageKey = keyof typeof messages.en

export function authT(lang: AuthLang, key: AuthMessageKey, vars?: Record<string, string | number>): string {
  let value: string = messages[lang][key] ?? messages.en[key]
  if (vars) {
    for (const [name, raw] of Object.entries(vars)) {
      value = value.split(`{${name}}`).join(String(raw))
    }
  }
  return value
}

const LANG_KEY = 'preferredLanguage'

export function readAuthLang(): AuthLang {
  try {
    const saved = localStorage.getItem(LANG_KEY)
    if (saved === 'sk' || saved === 'en') return saved
  } catch {
    // ignore
  }
  return navigator.language.startsWith('sk') ? 'sk' : 'en'
}

export function writeAuthLang(lang: AuthLang): void {
  try {
    localStorage.setItem(LANG_KEY, lang)
  } catch {
    // ignore
  }
}
