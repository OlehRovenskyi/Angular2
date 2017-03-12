import { Component, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'cr-course-item-header',
  templateUrl: 'course-item-header.html',
  styleUrls: [ './course-item-header.scss' ],
  providers: [],
  encapsulation: ViewEncapsulation.None
})

export class CourseItemHeaderComponent {
  @Input() public courseName: string;
  @Input() public courseDuration: number;
  @Input() public courseDate: Date;

  constructor() {
  }

  formatDate(dateObject) {
    if (!dateObject) {
      return 'no date';
    }

    let formattedDate = '';

    formattedDate += ('0' + (dateObject.getMonth() + 1)).slice(-2) + '/';
    formattedDate += ('0' + dateObject.getDate()).slice(-2) + '/';
    formattedDate += dateObject.getFullYear();

    return formattedDate;
  }

  formatTime(duration) {
    const durationTime = parseInt(duration, 10);
    const hours = Math.floor(durationTime / 3600);
    const minutes = Math.floor((durationTime - (hours * 3600)) / 60);
    const seconds = durationTime - (hours * 3600) - (minutes * 60);
    let hh;
    let mm;
    let ss;

    if (hours < 10) {
      hh = `0${ hours }h`;
    } else {
      hh = `${ hours }h`;
    }

    if (minutes < 10) {
      mm = `0${ minutes }min`;
    } else {
      mm = `${ minutes }min`;
    }

    if (seconds < 10) {
      ss = `0${ seconds }sec`;
    } else {
      ss = `${ seconds }sec`;
    }

    return `${ hh } : ${ mm } : ${ ss }`;
  }
}
