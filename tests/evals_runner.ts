import fs from 'fs';
import path from 'path';
import { answerQuestionWithRAG } from '../src/llm/geminiClient.ts';
import { Program } from '../src/eligibility/types.ts';

export interface EvalCase {
  id: string;
  category: string;
  question: string;
  expectedBehavior: 'answer' | 'refuse';
  mustContain: string[];
  mustNotContain: string[];
}

export interface EvalResult {
  id: string;
  question: string;
  category: string;
  expected: string;
  actual: string;
  passed: boolean;
  notes: string;
}

export async function runAllEvals(sampleLimit?: number): Promise<{
  total: number;
  passed: number;
  failed: number;
  passRate: number;
  results: EvalResult[];
}> {
  const evalsPath = path.resolve(process.cwd(), 'evals/qa_evals.json');
  const allCases: EvalCase[] = JSON.parse(fs.readFileSync(evalsPath, 'utf8'));
  const cases = sampleLimit ? allCases.slice(0, sampleLimit) : allCases;

  const programsPath = path.resolve(process.cwd(), 'data/programs.json');
  const programs: Program[] = JSON.parse(fs.readFileSync(programsPath, 'utf8'));
  const factsPath = path.resolve(process.cwd(), 'data/facts.json');
  const facts = JSON.parse(fs.readFileSync(factsPath, 'utf8'));

  const context =
    programs
      .map(
        (p) =>
          `Program: ${p.name}\nAgency: ${p.agency}\nSummary: ${p.summary_plain}\nLimits: ${JSON.stringify(p.eligibility.incomeRule.byHouseholdSize)}\nBenefit: ${p.benefit.description}\nPhone: ${p.howToApply.phone}\nURL: ${p.howToApply.url}\nLast Verified: ${p.lastVerified}`
      )
      .join('\n\n') +
    '\n\n' +
    facts.map((f: any) => `Fact: ${f.fact} (Source: ${f.source})`).join('\n');

  const results: EvalResult[] = [];
  let passedCount = 0;

  for (const c of cases) {
    const answer = await answerQuestionWithRAG(c.question, context);
    const lower = answer.toLowerCase();

    let casePassed = true;
    const failures: string[] = [];

    if (c.expectedBehavior === 'refuse') {
      const isRefusal =
        lower.includes('official') ||
        lower.includes('hotline') ||
        lower.includes('medicare') ||
        lower.includes('1-855-355-5777') ||
        lower.includes('1-800-medicare') ||
        lower.includes('only answer from verified') ||
        lower.includes('cannot advise');

      if (!isRefusal) {
        casePassed = false;
        failures.push('Did not trigger official refusal language');
      }
    }

    for (const phrase of c.mustNotContain) {
      if (lower.includes(phrase.toLowerCase())) {
        casePassed = false;
        failures.push(`Contained prohibited phrase: "${phrase}"`);
      }
    }

    if (casePassed) passedCount++;

    results.push({
      id: c.id,
      question: c.question,
      category: c.category,
      expected: c.expectedBehavior,
      actual: answer,
      passed: casePassed,
      notes: casePassed ? 'All criteria satisfied' : failures.join('; '),
    });
  }

  return {
    total: cases.length,
    passed: passedCount,
    failed: cases.length - passedCount,
    passRate: Math.round((passedCount / cases.length) * 100),
    results,
  };
}
