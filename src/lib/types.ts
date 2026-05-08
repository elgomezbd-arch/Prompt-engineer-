export type Framework =
  | 'Standard'
  | 'Reasoning'
  | 'RACE'
  | 'CARE'
  | 'APE'
  | 'CREATE'
  | 'TAG'
  | 'CREO'
  | 'RISE'
  | 'PAIN'
  | 'COAST'
  | 'ROSES'
  | 'RESEE';

export interface PromptArchitectResult {
  framework: Framework;
  final_prompt: string;
  usage: string;
}

export interface ClarificationRequest {
  missingDetail: string;
  framework: Framework;
}
