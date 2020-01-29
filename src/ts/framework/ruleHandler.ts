import RuleArgs from './ruleArgs';

export type RuleHandler = (target: any, args: RuleArgs) => boolean;