import { Routes } from '@angular/router';
import { LandingPage } from './core/pages/landing/landing.page';
import { HomePage } from './core/pages/home/home.page';
import { RosterViewPage } from './core/pages/roster-view/roster-view.page';

export const routes: Routes = [
    {path: 'landing', component: LandingPage },
    {path: 'home', component: HomePage },
    {path: 'rosters', component: RosterViewPage },
    {path: '**', redirectTo: 'home' }
];
