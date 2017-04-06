import { Injectable } from '@angular/core';
import { CourseItem, ExtendedCourseItem } from '../../models';
import { HelperService } from './helper.service';
import { Observable, Subject } from 'rxjs';
import * as _ from 'lodash';

@Injectable()
export class CoursesService {
  private courseList: ExtendedCourseItem[] = [{
    id: '2',
    name: '1',
    duration: 5000,
    topRated: true,
    date: new Date(),
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ' +
    'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer ' +
    'took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, ' +
    'but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s ' +
    'with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing ' +
    'software like Aldus PageMaker including versions of Lorem Ipsum.',
    authors: ['Andrii', 'Vit'],
    link: ''
  }, {
    id: '1',
    name: 'name 2',
    duration: 5000,
    topRated: false,
    date: new Date(2018, 0, 1),
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ' +
    'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer ' +
    'took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, ' +
    'but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s ' +
    'with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing ' +
    'software like Aldus PageMaker including versions of Lorem Ipsum.',
    authors: [],
    link: ''
  }, {
    id: '3',
    name: 'name 3',
    duration: 5000,
    topRated: false,
    date: new Date(),
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ' +
    'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer ' +
    'took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, ' +
    'but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s ' +
    'with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing ' +
    'software like Aldus PageMaker including versions of Lorem Ipsum.',
    authors: [],
    link: ''
  }, {
    id: '4',
    name: 'name 4',
    duration: 5000,
    topRated: false,
    date: new Date(2008, 8, 30),
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ' +
    'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer ' +
    'took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries',
    authors: [],
    link: ''
  }];

  private courseListSorce: Subject<CourseItem[]> = new Subject();

  constructor(private helperService: HelperService) {
  }

  getCourseItems(): Observable<CourseItem[]> {
    return this.courseListSorce.asObservable()
                .startWith(this.courseList)
                .map(this.filteredOutdateCourse.bind(this))
                .map(this.processingData.bind(this))
                .delay(500);
  }

  filteredOutdateCourse(data: ExtendedCourseItem[]): ExtendedCourseItem[]  {
    const outdated: Date = new Date();

    outdated.setDate(outdated.getDate() - 14);

    return _.filter(data, (item: CourseItem): boolean => {
      return item.date > outdated;
    });
  }

  processingData(data: ExtendedCourseItem[]): CourseItem[] {
    const usingFieldName: string[] = ['id', 'name', 'duration', 'topRated', 'date', 'description', 'authors'];

    return _.map(data, (item: ExtendedCourseItem): CourseItem => {
      return _.pick<CourseItem, ExtendedCourseItem>(item, usingFieldName);
    });
  }

  createCourse(data: CourseItem): Observable<CourseItem> {
    const newCourse: CourseItem = {
      id: this.helperService.generateId('id_'),
      name: data.name,
      duration: data.duration,
      date: new Date(),
      description: data.description
    };

    this.courseList.push(newCourse);

    this.courseListSorce.next([...this.courseList]);

    return Observable.of(newCourse);
  }

  getCourse(id: string): Observable<CourseItem> {
    let course: CourseItem;
    const courseId = { id };

    course = _.find( this.courseList, courseId);

    return Observable.of(course).delay(500);
  }

  updateCourse(id: string, data: CourseItem): Observable<CourseItem> {
    let courseItem: CourseItem;

    courseItem = _.find(this.courseList, (item) => {
      if (item.id === id) {
        return Object.assign(item, data);
      }
    });

    this.courseListSorce.next([...this.courseList]);

    return Observable.of(courseItem);
  }

  updateRaiting(id: string, raiting: boolean): Observable<CourseItem> {
    let courseItem: CourseItem;

    courseItem = _.find(this.courseList, (item: CourseItem): boolean => {
      return item.id === id;
    });

    courseItem.topRated = raiting;

    this.courseListSorce.next([...this.courseList]);

    return Observable.of(courseItem);
  }

  removeCourse(id: string): Observable<CourseItem[]> {
    _.find(this.courseList, (item, index) => {
      if (item.id === id) {
        return this.courseList.splice(index, 1);
      }
    });

    this.courseListSorce.next([...this.courseList]);

    return Observable.of(this.courseList);
  }
}
