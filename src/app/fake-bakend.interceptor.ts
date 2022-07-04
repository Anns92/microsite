import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class FakeBakendInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    // wrap in delayed observable to simulate server api call
    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .pipe(delay(500))
      .pipe(dematerialize());

    function handleRoute() {
      switch (true) {
        case url.endsWith('/seo') && method === 'GET':
          return getSeo();
        case url.match(/\/sliders\/\d+$/) && method === 'GET':
          return getSliders();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    // function getSliders() {
    //   return ok(slider);
    // }
    function getSliders() {
      slider[1].img = 'assets/img/' + screenSize() + '/' + slider[1].img_origin;

      return ok(slider);
    }
    function screenSize() {
      const urlParts = url.split('/');
      switch (parseInt(urlParts[urlParts.length - 1])) {
        case 1: {
          return 'sm';
        }
        case 2: {
          return 'md';
        }
        case 3: {
          return 'lg';
        }
        case 4: {
          return 'lg';
        }
        default:
          break;
      }
      return null;
    }
    function getSeo() {
      return ok(seo);
    }
    function ok(body?: any) {
      return of(new HttpResponse({ status: 200, body }));
    }
  }
}
const seo = {
  mtitle: 'microsite',
  mdescription: 'Best Customer Choic,DONEC NEC JUSTO',
  keywords: 'Best Customer Choic,DONEC NEC JUSTO',
};
const slider = [
  {
    id: 1,
    type: 1,
    video: 'assets/mov_bbb.mp4',
    title: 'LOREM IPSUM DOLORe',
    subtitle: `lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio.
    Quisque volutpat mattis eros.`,
  },
  {
    id: 2,
    type: 2,
    img_origin: 'img_world.jpg',
    img: 'img_world.jpg',
    title: 'DONEC NEC JUSTO',
    data: [
      {
        title: 'Lorem ipsum #1',
        content: `Donec nec justo eget
      felis facilisis
      fermentum. Aliquam
      porttitor mauris sit
      amet orci.
      `,
      },
      {
        title: 'Lorem ipsum #2',
        content: `Aenean dignissim
      pellentesque felis
      sed egestas, ante et
      vulputate volutpat.`,
      },
      {
        title: 'Lorem ipsum #2',
        content: `Donec nec justo eget
      felis facilisis
      fermentum. Aliquam
      porttitor mauris sit
      amet orci.
      `,
      },
      {
        title: 'Lorem ipsum #2',
        content: `Aenean dignissim
      pellentesque felis
      sed egestas, ante et
      vulputate volutpat.`,
      },
      {
        title: 'Lorem ipsum #2',
        content: `Donec nec justo eget
      felis facilisis
      fermentum. Aliquam
      porttitor mauris sit
      amet orci.
      `,
      },
    ],
  },
];

export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBakendInterceptor,
  multi: true,
};


