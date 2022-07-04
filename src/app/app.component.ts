import { Component, ElementRef, HostListener } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AppService } from './app.service';
import { Meta, Title } from '@angular/platform-browser';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  animations: [
    trigger('scrollAnimation', [
      state(
        'show',
        style({
          opacity: 1,
          // transform: 'translateX(0)',
        })
      ),
      state(
        'hide',
        style({
          opacity: 0,
          // transform: 'translateX(-100%)',
        })
      ),
      transition('show => hide', animate('700ms ease-out')),
      transition('hide => show', animate('700ms ease-in')),
    ]),
    trigger('scrollAnimation2', [
      state(
        'show',
        style({
          opacity: 1,
          // transform: 'translateX(0)',
        })
      ),
      state(
        'hide',
        style({
          opacity: 0,
          // transform: 'translateX(-100%)',
        })
      ),
      transition('show => hide', animate('700ms ease-out')),
      transition('hide => show', animate('700ms ease-in')),
    ]),
    trigger('textAnimate', [
      state(
        'show',
        style({
          opacity: 1,
          transform: 'translateY(0) scale(1)',
         
         
        })
      ),
      state(
        'hide',
        style({
          opacity: 0,
          transform: 'translateY(-100%) scale(0.5)',
         
        })
      ),
      transition('show => hide', animate('800ms ease-out')),
      transition('hide => show', animate('800ms ease-in')),
    ]),
    trigger('textAnimate2', [
      state(
        'show',
        style({
          opacity: 1,
          transform: 'translateY(0) scale(1)',
        })
      ),
      state(
        'hide',
        style({
          opacity: 0,
          transform: 'translateY(100%) scale(0.5)',
        })
      ),
      transition('show => hide', animate('800ms ease-out')),
      transition('hide => show', animate('800ms ease-in')),
    ]),
  ],
})
export class AppComponent {
  state = 'show';
  state2 = 'hide';
  textState='hide';
  slide = 1;
  window_width: any;
  // owl caraosel options
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    // center: true,
    autoplay:true,
    navText: ['', ''],
    responsive: {
      0: {
        items: 2.5,
      },
      992: {
        items: 3,
      },
    },
    nav: false,
  };
  sliders: any;
  slide1: any;
  slide2: any;
  img_path: any;
  // change page using scroll
  @HostListener('wheel', ['$event'])
  public onScroll(event: WheelEvent) {
    var lastScrollTop = 0;
    var st = parseInt((this.element.nativeElement.scrollLeft += event.deltaY));

    console.log('wheel', st);
    if (st > 0) {
      this.next(2);
    } else {
      this.next(1);
    }
  }

  constructor(
    private ser: AppService,
    private meta: Meta,
    private title: Title,
    private element: ElementRef
  ) {
   
    this.window_width = this.onWindowResize();
    console.log('screen', this.window_width);
  }
 // get screen size
  onWindowResize() {
    if (window.innerWidth > 0 && window.innerWidth < 768) {
      this.customOptions.responsive = {
        0: {
          items: 1.5,
        },
      };
      return 1;
    } else if (window.innerWidth > 767 && window.innerWidth < 992) {
      return 2;
    } else if (window.innerWidth > 991 && window.innerWidth < 1200) {
      return 3;
    } else if (window.innerWidth > 1199) {
      return 4;
    }
    return 'null';
  }

  next(id: any) {
    if (id == 2) {
      this.state = 'hide';
    }
    setTimeout(() => {
      if (id == 2) {
        this.state2 = 'show';
        this.state = 'hide';
      }
      if (id == 1) {
        this.state = 'show';
        this.state2 = 'hide';
      }

      this.slide = id;
      this.updateMeta();
    }, 700);
  }
  // api call
  getSliders() {
    this.ser.getSliders(this.window_width).subscribe(
      (resp) => {
        if (resp.status == 200) {
          console.log(resp.body);
          this.sliders = resp.body;
          // this.sliders.forEach((el:any) => {
          this.slide1 = this.sliders.filter(
            (slide: any) => slide.type === 1
          )[0];
          this.slide2 = this.sliders.filter(
            (slide: any) => slide.type === 2
          )[0];
          // });
          this.img_path =
            'assets/img/' + this.window_width + '/' + this.slide2.img;
          this.updateMeta();
        }
      },
      (err) => console.error('Error Occured When Get All Employes ' + err)
    );
  }
  ngOnInit(): void {
    this.getSliders();
    setTimeout(() => {

      this.textState="show"
    }, 0);
  }
  // seo
  updateMeta() {
    let data = null;
    if (this.slide == 1) {
      data = this.slide1;
    } else {
      data = this.slide2;
    }
    console.log('data', data);

    this.meta.updateTag({
      name: 'description',
      content: data.mdescription,
    });
    this.meta.updateTag({
      name: 'keywords',
      content: data.keywords,
    });
    this.title.setTitle(data.mtitle);
  }
}
