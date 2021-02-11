import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  bpm;
  isHealth:boolean;
  titleMessage:string;
  constructor(private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.bpm = this.route.snapshot.params.id;
    this.analysisBPM();
  }

  analysisBPM(){
    if(this.bpm > 59 && this.bpm <101){
      this.titleMessage = 'تبریک. شما داری ضربان قلب نرمالی می باشید'
      this.isHealth = true;
    }else if(this.bpm > 100 && this.bpm < 201){
      this.titleMessage = 'اگر شما در حال ورزش بوده اید دارای ضربان نرمالی می باشید در غیر اینصورت ضربان قلب شما غیر نرمال است';
      this.isHealth = false;
    }else{
      this.titleMessage = 'متاسفانه ضربان قلب شما غیر نرمال می باشد';
      this.isHealth = false;
    }
  }

}
