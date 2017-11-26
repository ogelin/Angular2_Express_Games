import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from '../components/app.component';
import { GlComponent } from '../components/gl.component';
import { LoginFormComponent } from '../components/login-form.component';
import { NewGameInterfaceComponent } from '../components/new-game-interface.component';

import { CameraService } from '../services/camera.service';
import { ObjectCreaterService } from '../services/object-creater.service';
import { PlayerService } from '../services/player.service';
import { SocketService } from '../services/socket.service';
import { LightService } from '../services/light.service';
import { GamePhysicsService } from '../services/game-physics.service';
import { RenderService } from '../services/render.service';
import { LevelsService } from '../services/levels.service';
import { Object3DManagerService } from '../services/object3D-manager.service';
import { ScoreService } from '../services/score.service';
import { EmitMessageService } from '../services/emit-message.service';
import { EndGameService } from '../services/end-game.service';
import { HudSceneService } from '../services/hud-scene.service';

import { ModifierDirective } from '../directives/modifier.directive';

import { MaterialModule } from '@angular/material';

@NgModule({
  imports: [BrowserModule, FormsModule, AppRoutingModule, MaterialModule.forRoot(), HttpModule],
  declarations: [
    AppComponent,
    GlComponent,
    LoginFormComponent,
    ModifierDirective,
    NewGameInterfaceComponent,
  ],
  providers: [
    CameraService,
    LevelsService,
    ObjectCreaterService,
    PlayerService,
    RenderService,
    SocketService,
    LightService,
    GamePhysicsService,
    Object3DManagerService,
    ScoreService,
    EmitMessageService,
    EndGameService,
    HudSceneService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
