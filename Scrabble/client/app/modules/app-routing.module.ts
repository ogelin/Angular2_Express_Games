import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginFormComponent } from '../components/login-form.component';
import { ScrabbleInterfaceComponent } from '../components/scrabble-interface.component';
import { ChatRoomComponent } from '../components/chat-room.component';

const appRoutes: Routes = [
  { path: '', component: LoginFormComponent, },
  { path: 'chat-room/:username/:missing', component: ChatRoomComponent, },
  { path: 'scrabble-interface/:username', component: ScrabbleInterfaceComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
