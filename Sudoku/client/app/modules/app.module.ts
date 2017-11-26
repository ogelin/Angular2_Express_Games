import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from '../components/app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginFormComponent } from '../components/login-form.component';
import { GridInterfaceComponent } from '../components/grid-interface.component';
import { PlayersService } from '../services/players.service';
import { SudokuService } from '../services/sudoku.service';
import { SocketService } from '../services/socket.service';
import { LevelsService } from '../services/levels.service';
import { NewGameInterfaceComponent } from '../components/new-game-interface.component';

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
    GridInterfaceComponent,
    NewGameInterfaceComponent
  ],

  providers: [ PlayersService, SudokuService, LevelsService, SocketService ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
