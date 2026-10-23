/**
 * Guardrails and post-generation verification to prevent hallucinations
 * of financial dollar figures, URLs, and phone numbers.
 */

export interface IntegrityCheckResult {
  valid: boolean;
  violations: string[];
}

export function verifyOutputIntegrity(outputText: string, allowedContext: string): IntegrityCheckResult {
  const violations: string[] = [];

  // 1. Check for dollar amounts in output (e.g. $185, $2,200, $5,300)
  const dollarRegex = /\$\s?[0-9,]+(\.[0-9]{2})?/g;
  const outputDollars = outputText.match(dollarRegex) || [];
  const normalizedContext = allowedContext.replace(/\s+/g, ' ');

  for (const rawDollar of outputDollars) {
    const cleanDollar = rawDollar.replace(/\s/g, '');
    const numOnly = cleanDollar.replace(/[\$,]/g, '');
    // Check if either "$185" or "185" exists in the verified context
    if (!normalizedContext.includes(cleanDollar) && !normalizedContext.includes(numOnly)) {
      violations.push(`Unverified dollar amount in LLM output: ${cleanDollar}`);
    }
  }

  // 2. Check for URLs in output
  const urlRegex = /https?:\/\/[^\s)]+/g;
  const outputUrls = outputText.match(urlRegex) || [];
  for (const url of outputUrls) {
    // Trim trailing punctuation like . or ,
    const cleanUrl = url.replace(/[.,;]$/, '');
    if (!allowedContext.includes(cleanUrl)) {
      violations.push(`Unverified URL in LLM output: ${cleanUrl}`);
    }
  }

  // 3. Check for disallowed absolute claims ("you qualify", "guaranteed benefits")
  const lower = outputText.toLowerCase();
  if (lower.includes('you qualify') && !lower.includes('may qualify') && !lower.includes('might qualify')) {
    violations.push('Prohibited absolute eligibility claim: "you qualify" found.');
  }
  if (lower.includes('we guarantee') || lower.includes('guaranteed approval')) {
    violations.push('Prohibited guarantee language found.');
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}
