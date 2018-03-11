// ng
import { BrowserModule } from '@angular/platform-browser'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { RouterModule, Routes } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'



// app
import { AppComponent } from './app.component'
import { BackendService } from './backend.service'
import { TripPageComponent } from './trip-page/trip-page.component'
import { HomePageComponent } from './home-page/home-page.component'
import { environment } from '../environments/environment'

// routes
const appRoutes: Routes = [
  
  { path: '', component: HomePageComponent },
  { path: 'trip/:id', component: TripPageComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    TripPageComponent,
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
  ],
  providers: [
    BackendService,
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ]
})
export class AppModule { 
}
