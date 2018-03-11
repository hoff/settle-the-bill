import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientModule } from '@angular/common/http'

import { FormsModule } from '@angular/forms'


import { BackendService } from '../backend.service'


import { TripPageComponent } from './trip-page.component';

describe('TripPageComponent', () => {
  let component: TripPageComponent;
  let fixture: ComponentFixture<TripPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripPageComponent ],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        FormsModule,
      ],
      providers: [
        BackendService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
