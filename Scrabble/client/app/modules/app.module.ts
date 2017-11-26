import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from '../components/app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginFormComponent } from '../components/login-form.component';
import { ChatRoomComponent } from '../components/chat-room.component';
import { ScrabbleInterfaceComponent } from '../components/scrabble-interface.component';
import { PlayerService } from '../services/player.service';
import { SocketService } from '../services/socket.service';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
  ],

  declarations: [
    AppComponent,
    LoginFormComponent,
    ChatRoomComponent,
    ScrabbleInterfaceComponent
  ],

  providers: [PlayerService, SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
