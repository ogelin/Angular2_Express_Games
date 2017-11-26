import { AppComponent } from '../components/app.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// Un peu plus de recherche est nécessaire pour comprendre cette
// ligne suivante
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { expect } from 'chai';
import * as SinonChai from 'sinon-chai';
chai.use(SinonChai);

describe('AppComponent', function () {
    let comp: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            declarations: [AppComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        comp = fixture.componentInstance;
    });

    it('should create component', () => expect(comp).to.not.be.undefined);

});
