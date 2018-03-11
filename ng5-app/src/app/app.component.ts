// ng
import { Component } from '@angular/core'

// app
import { BackendService } from './backend.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  tripNameInput: string

  constructor(public backend: BackendService) {

  }
}
