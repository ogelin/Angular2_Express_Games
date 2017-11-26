import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginFormComponent } from '../components/login-form.component';
import { GlComponent } from '../components/gl.component';
import { NewGameInterfaceComponent } from '../components/new-game-interface.component';

const routes: Routes = [
  { path: '', component: LoginFormComponent },
  { path: 'glcomp/:username', component: GlComponent },
  { path: 'game-interface/:username', component: NewGameInterfaceComponent },
  { path: 'glcomp/:username', component: GlComponent }
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
