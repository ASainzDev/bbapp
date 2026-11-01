export interface TeamCreationRules {
    minPlayers: number;
    maxPlayers: number;
    maxRerolls: number;
    minFanFactor: number;
    initialFanFactor: number;
    maxFanFactor: number;
    fanFactorCost: number;
    minCheerleaders: number;
    maxCheerleaders: number;
    cheerleadersCost: number;
    maxApothecary: number;
    apothecaryCost: number;
    minCoachAssistant: number;
    maxCoachAssistant: number;
    coachAssistantCost: number;
    initialTeamBudget: number;
}

export const TEAM_CREATION_RULES: TeamCreationRules = {
    minPlayers: 11,
    maxPlayers: 16,
    maxRerolls: 8,
    minFanFactor: 1,
    initialFanFactor: 1,
    maxFanFactor: 3,
    fanFactorCost: 5_000,
    minCheerleaders: 0,
    maxCheerleaders: 6,
    cheerleadersCost: 10_000,
    maxApothecary: 1,
    apothecaryCost: 50_000,
    minCoachAssistant: 0,
    maxCoachAssistant: 6,
    coachAssistantCost: 10_000,
    initialTeamBudget: 1_000_000,
} as const satisfies TeamCreationRules;
