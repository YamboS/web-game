import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
const routes: Routes = [
  { path: '', component: LandingPageComponent },
  {
    path: 'jeopardy',
    loadChildren: () =>
      import('./components/jeopardy/jeopardy.module').then((m) => m.JeopardyModule),
  },
  // Unknown routes redirect to the landing page
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
