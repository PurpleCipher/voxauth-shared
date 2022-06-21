type Statement = {
  Sid: string;
  Effect: string;
  Action: string | string[];
  Resource: string | string[];
  Condition: Record<string, Record<string, string>>;
};
export type Policy = {
  Version: string;
  Statement: Statement[];
};

export type PolicyEvaluationContext = {
  action: string;
  resource: string;
  context: any;
};
