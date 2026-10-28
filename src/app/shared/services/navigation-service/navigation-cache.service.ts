import { Service } from '@angular/core';
import { UserTeamTemplate } from '../../models/user-team-template.model';

@Service()
export class NavigationCacheService {
    private readonly provisionalTeamKey = 'bbapp-provisional-team';

    cacheProvisionalTeam(teamData: UserTeamTemplate): void {
        sessionStorage.setItem(this.provisionalTeamKey, JSON.stringify(teamData));
    }

    getProvisionalTeam(): UserTeamTemplate | undefined {
        const storedTeam = sessionStorage.getItem(this.provisionalTeamKey);
        if (!storedTeam) return undefined;

        try {
            return JSON.parse(storedTeam) as UserTeamTemplate;
        } catch {
            sessionStorage.removeItem(this.provisionalTeamKey);
            return undefined;
        }
    }

    clearProvisionalTeam(): void {
        sessionStorage.removeItem(this.provisionalTeamKey);
    }
}
