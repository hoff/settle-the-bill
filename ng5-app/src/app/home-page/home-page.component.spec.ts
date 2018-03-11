import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { HomePageComponent } from './home-page.component'
import { FormsModule } from '@angular/forms'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientModule } from '@angular/common/http'

import { BackendService } from '../backend.service'


describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        FormsModule,
      ],
      providers: [
        BackendService,
      ],
      declarations: [ HomePageComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
