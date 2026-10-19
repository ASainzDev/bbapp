import { Routes } from '@angular/router';
import { LandingPage } from './core/pages/landing/landing.page';
import { HomePage } from './core/pages/home/home.page';
import { RosterSelectorPage } from './core/pages/roster-selector/roster-selector.page';
import { RosterViewComponent } from './features/roster-view/roster-view.component';

export const routes: Routes = [
    {path: '', component: HomePage},
    {path: 'landing', component: LandingPage },
    {path: 'home', component: HomePage },
    {path: 'rosters', component: RosterSelectorPage },
    {path: '**', redirectTo: 'home' }
];
