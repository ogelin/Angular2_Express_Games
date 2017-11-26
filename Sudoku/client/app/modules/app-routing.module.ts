import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginFormComponent } from '../components/login-form.component';
import { GridInterfaceComponent } from '../components/grid-interface.component';
import { NewGameInterfaceComponent } from '../components/new-game-interface.component';

const appRoutes: Routes = [
  { path: '', component: LoginFormComponent, },
  { path: 'grid-interface/:username', component: GridInterfaceComponent },
  { path: 'game-interface/:username', component: NewGameInterfaceComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
