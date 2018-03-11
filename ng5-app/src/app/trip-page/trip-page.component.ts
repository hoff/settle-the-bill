// ng
import { Component, OnInit, AfterViewInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'

// rx
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/take'

// app
import { BackendService, DocumentResponse } from '../backend.service'
import { animations } from '../animations'

declare class ClipboardJS{
  constructor(
    el: string
  )
  on: any
}

@Component({
  selector: 'app-trip-page',
  templateUrl: './trip-page.component.html',
  styleUrls: ['./trip-page.component.css'],
  animations: [
    animations.expandCollapse
  ],
})
export class TripPageComponent implements OnInit, AfterViewInit {

  window = window
  displayState
  tripnameInput = ''

  constructor(
    // ng
    public router: Router,
    public route: ActivatedRoute,
    // app
    public backend: BackendService,
  ) { }

  createTrip() {
    this.backend.createTrip(this.tripnameInput)
  }

  indexString(index: number) {
    if (index === 1) { return '1st'}
    if (index === 2) { return '2nd'}
    if (index === 3) { return '3rd'}
    return index + 'th'
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params.id
      if (id === 'new') {
        this.displayState = 'expanded'
        this.backend.balance = undefined
        this.backend.document = this.backend.blankDocument()
      } else {
        this.backend.loadTrip(id)
        this.displayState = 'collapsed'
        this.backend.balance = undefined
      }
      })
   }

   ngAfterViewInit() {
   }
  }
