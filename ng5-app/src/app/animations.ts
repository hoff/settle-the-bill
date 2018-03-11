import { trigger, state, style, animate, transition, stagger } from '@angular/animations'

export const animations = {
  fadeInOut: trigger('fadeInOut', [
    transition(':enter', [
      style({ opacity: 0.5 }),
      animate(150, style({ opacity: 1, transform: 'scale(1)' }))
    ]),
    transition(':leave', [
      animate(50, style({ opacity: 0.3, transform: 'scale(1)' }))
    ])
  ]),
  expandCollapse: trigger('expandCollapse', [
	state('expanded', style({ 
		'height': '100vh',
		'font-size': '40px',
	})),
	state('collapsed', style({ 
		'height': '100px',
		'font-size': '24px',
    'border-bottom': '0',
    'font-weight': 600,
	})),
	transition('collapsed <=> expanded', animate('300ms ease-in-out'))
  ])
}
