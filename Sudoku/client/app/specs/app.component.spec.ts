import { AppComponent } from '../components/app.component';
import { PlayersService } from '../services/players.service';
import { SudokuService } from '../services/sudoku.service';
import { LevelsService } from '../services/levels.service';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

// Un peu plus de recherche est nécessaire pour comprendre cette
// ligne suivante
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { expect } from 'chai';

describe('AppComponent', function () {
  let de: DebugElement;
  let comp: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [AppComponent],
      providers: [PlayersService, SudokuService, LevelsService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('h1'));
  });

  it('should create component', () => expect(comp).to.not.be.undefined);

});
