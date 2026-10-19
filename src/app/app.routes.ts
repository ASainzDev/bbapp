import { Routes } from '@angular/router';
import { LandingPage } from './core/pages/landing/landing.page';
import { HomePage } from './core/pages/home/home.page';
import { RosterViewPage } from './core/pages/roster-view/roster-view.page';
import { RosterSelectorComponent } from './features/roster-selector/roster-selector/roster-selector.component';

export const routes: Routes = [
    {path: '', component: HomePage},
    {path: 'landing', component: LandingPage },
    {path: 'home', component: HomePage },
    {path: 'rosters', component: RosterSelectorComponent, children:[
        {path: ':rosterId', component: RosterViewPage}
    ] },
    {path: '**', redirectTo: 'home' }
];
