/** Extrait un code de tracking d'un texte de QR (code brut ou URL le contenant). */
export function extractCode(text: string): string {
  // Format réel (GenerateurCodeTracking) : TRA-{année}-{6 caractères A-Z0-9}, pas seulement des chiffres.
  const match = text.match(/TRA-\d{4}-[A-Z0-9]{6}/i)
  return (match ? match[0] : text).trim().toUpperCase()
}
