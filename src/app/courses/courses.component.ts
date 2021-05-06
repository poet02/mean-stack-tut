import { Component, OnInit } from '@angular/core';//importing component decorator

@Component({//component decorator
  selector: 'app-courses',
  templateUrl: './courses.component.html',//use back tick for multiple lines
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  constructor() {// Add things here to decouple stuff 
    //initialize objects

   }
  courses = ['course1', 'course2', 'course3']
  title = 'List of classes'
  ngOnInit(): void {
  }

}
