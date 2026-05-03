import { Agency, Case } from "../types";

const fetchAI = async (prompt: string): Promise<string> => {
  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    
    if (!res.ok) {
       throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    return data.result || "Analysis unavailable.";
  } catch (error) {
    console.error("AI Fetch Error:", error);
    return "AI Service unavailable.";
  }
};

export const analyzeAgencyRisk = async (agency: Agency): Promise<string> => {
  const prompt = `
    Analyze this Debt Collection Agency (DCA) for FedEx.
    Agency: ${agency.name}, Status: ${agency.status}, Compliance: ${agency.complianceScore}/100, Recovery: ${agency.recoveryRate}%.
    Provide a 1-sentence risk assessment focusing on brand reputation and financial recovery.
  `;
  return fetchAI(prompt);
};

export const recommendDCA = async (caseDetails: string, agencies: Agency[]): Promise<string> => {
  const agencyList = agencies.map(a => `${a.name} (Score: ${a.complianceScore}, Rate: ${a.recoveryRate}%)`).join(', ');
  const prompt = `
    Case: ${caseDetails}.
    Available Agencies: ${agencyList}.
    Recommend the BEST single agency for this case to maximize recovery while ensuring compliance. Return ONLY the agency name and a 5-word reason.
  `;
  return fetchAI(prompt);
};

export const prioritizeCase = async (c: Case): Promise<'High' | 'Medium' | 'Low'> => {
  const prompt = `
    Determine priority (High, Medium, Low) for debt collection case.
    Amount: ${c.amount}, Due: ${c.dueDate}, Status: ${c.status}.
    High priority if amount > 5000 or near SLA breach.
    Return ONLY the word High, Medium, or Low.
  `;
  const text = await fetchAI(prompt);
  const trimmed = text.trim();
  if (trimmed.includes('High')) return 'High';
  if (trimmed.includes('Low')) return 'Low';
  return 'Medium';
};

export const chatWithAI = async (query: string, context: string): Promise<string> => {
  const prompt = `
    You are an AI assistant for FedEx Debt Collection governance.
    Context: ${context}
    User Query: ${query}
    Provide a professional, data-driven answer (max 2 sentences).
  `;
  return fetchAI(prompt);
};

export const generateBatchStrategy = async (batchDetails: string): Promise<string> => {
  const prompt = `
    Analyze this debt batch and suggest a placement strategy.
    Batch Details: ${batchDetails}
    Provide a 1-sentence strategy recommendation for assigning this batch to agencies based on risk and amount.
  `;
  return fetchAI(prompt);
};