import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SampleData } from './../../services/data';
import { AnimationOptions } from 'ngx-lottie';
import { Router } from '@angular/router';
@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss'],
})
export class AnalysisComponent implements OnInit {
  chartType: string = 'line';
  optionsHeart: AnimationOptions = {
    path: '/assets/heartbeat.json',
  };
  chartLabels: Array<any> = [];
  PieChartDatasets: Array<any> = [];
  PieChartLabels: Array<any> = [];
  PieChartColors: Array<any> = [];
  chartDatasets: Array<any> = [];
  normalPercent;
  badPercent;
  sampleData = JSON.parse(localStorage.getItem('bpmList'));
  isChecked = false;
  isFirst = true;
  dayList = [];
  monthList = [];
  yearList = [];

  constructor(private datePipe: DatePipe, private router: Router) {}

  ngOnInit(): void {
    this.setCharSet();
    this.calcDayEqual();
    this.calcMonthEqual();
    this.calcYearEqual();
  }

  setCharSet() {
    let normalData = [];
    let normalNumber = 0;
    let highNumber = 0;
    let lowNumber = 0;
    this.sampleData.map((el) => {
      if (
        (el.bpm > 59 && el.bpm < 101) ||
        (el.bpm > 39 && el.bpm < 101 && this.isChecked)
      ) {
        normalNumber += 1;
      } else if (el.bpm < 60) {
        lowNumber += 1;
      } else {
        highNumber += 1;
      }
      if (this.isFirst) {
        normalData.push(el.bpm);
        this.chartLabels.push(this.datePipe.transform(el.date, 'M/d-h:mm:ss'));
      }
    });

    let lowP = (lowNumber / (lowNumber + highNumber + normalNumber)) * 100;
    lowP = parseInt(`${lowP}`);
    let normalP =
      (normalNumber / (lowNumber + highNumber + normalNumber)) * 100;
    normalP = parseInt(`${normalP}`);
    this.normalPercent = normalP;
    this.badPercent = 100 - normalP;
    let highP = (highNumber / (lowNumber + highNumber + normalNumber)) * 100;
    highP = parseInt(`${highP}`);
    this.PieChartDatasets = [
      { data: [lowP, normalP, highP], label: 'Analysis' },
    ];
    this.PieChartLabels = ['کمتر از حد نرمال', 'نرمال', 'بالاتر از حد نرمال'];
    this.PieChartColors = [
      {
        backgroundColor: ['#42a5f5', '#4caf50', '#f44336'],
        hoverBackgroundColor: ['#1565c0', '#388e3c', '#d32f2f'],
        borderWidth: 2,
      },
    ];
    if (this.isFirst) {
      this.chartDatasets = [{ data: normalData, label: 'BPM' }];
    }

    this.isFirst = false;
  }

  public chartColors: Array<any> = [
    {
      backgroundColor: 'rgba(105, 0, 132, .2)',
      borderColor: 'rgba(200, 99, 132, .7)',
      borderWidth: 2,
    },
  ];

  public chartOptions: any = {
    responsive: true,
  };
  public chartClicked(e: any): void {
    if (e.active.length > 0) {
      console.log(this.chartDatasets[0].data[e.active[0]._index]);
      let id = this.chartDatasets[0].data[e.active[0]._index];
      this.router.navigate(['/detail', id, this.isChecked]);
    }
  }
  public chartHovered(e: any): void {}

  onChange($event) {
    this.isChecked = $event.checked;
    this.dayList = []
    this.monthList = []
    this.yearList = []
    this.setCharSet();
    this.calcDayEqual();
    this.calcMonthEqual();
    this.calcYearEqual();
  }

  calcDayEqual() {
    for (let i = 0; i < this.sampleData.length; i++) {
      let findIt = false;
      let today = this.datePipe.transform(this.sampleData[i].date, 'yyyy/M/d');
      if (this.dayList.length < 1) {
        this.dayList = [{ date: today }];

        if (
          (this.sampleData[i].bpm > 59 && this.sampleData[i].bpm < 101) ||
          (this.sampleData[i].bpm > 39 &&
            this.sampleData[i].bpm < 101 &&
            this.isChecked)
        ) {
          this.dayList[0].low = 0;
          this.dayList[0].normal = 1;
          this.dayList[0].high = 0;
        } else if (this.sampleData[i].bpm < 60) {
          this.dayList[0].low = 1;
          this.dayList[0].normal = 0;
          this.dayList[0].high = 0;
        } else {
          this.dayList[0].low = 0;
          this.dayList[0].normal = 0;
          this.dayList[0].high = 1;
        }
      } else {
        for (let j = 0; j < this.dayList.length; j++) {
          if (today == this.dayList[j]?.date) {
            findIt = true;
            if (
              (this.sampleData[i].bpm > 59 && this.sampleData[i].bpm < 101) ||
              (this.sampleData[i].bpm > 39 &&
                this.sampleData[i].bpm < 101 &&
                this.isChecked)
            ) {
              this.dayList[j].normal += 1;
            } else if (this.sampleData[i].bpm < 60) {
              this.dayList[j].low += 1;
            } else {
              this.dayList[j].high += 1;
            }
          }
        }
        if (!findIt) {
          let lastrecord = this.dayList.length;
          this.dayList[lastrecord] = { date: today };
          if (
            (this.sampleData[i].bpm > 59 && this.sampleData[i].bpm < 101) ||
            (this.sampleData[i].bpm > 39 &&
              this.sampleData[i].bpm < 101 &&
              this.isChecked)
          ) {
            this.dayList[lastrecord].normal = 1;
            this.dayList[lastrecord].low = 0;
            this.dayList[lastrecord].high = 0;
          } else if (this.sampleData[i].bpm < 60) {
            this.dayList[lastrecord].normal = 0;
            this.dayList[lastrecord].low = 1;
            this.dayList[lastrecord].high = 0;
          } else {
            this.dayList[lastrecord].normal = 0;
            this.dayList[lastrecord].low = 0;
            this.dayList[lastrecord].high = 1;
          }
        }
      }


    }
    this.dayList.map((el) => {
      let normalP = (el.normal / (el.low + el.high + el.normal)) * 100;
      normalP = parseInt(`${normalP}`);
      el.normalP=normalP;
      el.badP = 100 - normalP;
    });

    console.log(this.dayList)
    console.log(this.dayList);
  }

  calcMonthEqual() {
    for (let i = 0; i < this.sampleData.length; i++) {
      let findIt = false;
      let today = this.datePipe.transform(this.sampleData[i].date, 'yyyy/M');
      if (this.monthList.length < 1) {
        this.monthList = [{ date: today }];

        if (
          (this.sampleData[i].bpm > 59 && this.sampleData[i].bpm < 101) ||
          (this.sampleData[i].bpm > 39 &&
            this.sampleData[i].bpm < 101 &&
            this.isChecked)
        ) {
          this.monthList[0].low = 0;
          this.monthList[0].normal = 1;
          this.monthList[0].high = 0;
        } else if (this.sampleData[i].bpm < 60) {
          this.monthList[0].low = 1;
          this.monthList[0].normal = 0;
          this.monthList[0].high = 0;
        } else {
          this.monthList[0].low = 0;
          this.monthList[0].normal = 0;
          this.monthList[0].high = 1;
        }
      } else {
        for (let j = 0; j < this.monthList.length; j++) {
          if (today == this.monthList[j]?.date) {
            findIt = true;
            if (
              (this.sampleData[i].bpm > 59 && this.sampleData[i].bpm < 101) ||
              (this.sampleData[i].bpm > 39 &&
                this.sampleData[i].bpm < 101 &&
                this.isChecked)
            ) {
              this.monthList[j].normal += 1;
            } else if (this.sampleData[i].bpm < 60) {
              this.monthList[j].low += 1;
            } else {
              this.monthList[j].high += 1;
            }
          }
        }
        if (!findIt) {
          let lastrecord = this.monthList.length;
          this.monthList[lastrecord] = { date: today };
          if (
            (this.sampleData[i].bpm > 59 && this.sampleData[i].bpm < 101) ||
            (this.sampleData[i].bpm > 39 &&
              this.sampleData[i].bpm < 101 &&
              this.isChecked)
          ) {
            this.monthList[lastrecord].normal = 1;
            this.monthList[lastrecord].low = 0;
            this.monthList[lastrecord].high = 0;
          } else if (this.sampleData[i].bpm < 60) {
            this.monthList[lastrecord].normal = 0;
            this.monthList[lastrecord].low = 1;
            this.monthList[lastrecord].high = 0;
          } else {
            this.monthList[lastrecord].normal = 0;
            this.monthList[lastrecord].low = 0;
            this.monthList[lastrecord].high = 1;
          }
        }
      }
    }
    this.monthList.map((el) => {
      let normalP = (el.normal / (el.low + el.high + el.normal)) * 100;
      normalP = parseInt(`${normalP}`);
      el.normalP=normalP;
      el.badP = 100 - normalP;
    });
    console.log(this.monthList);
  }

  calcYearEqual() {
    for (let i = 0; i < this.sampleData.length; i++) {
      let findIt = false;
      let today = this.datePipe.transform(this.sampleData[i].date, 'yyyy');
      if (this.yearList.length < 1) {
        this.yearList = [{ date: today }];

        if (
          (this.sampleData[i].bpm > 59 && this.sampleData[i].bpm < 101) ||
          (this.sampleData[i].bpm > 39 &&
            this.sampleData[i].bpm < 101 &&
            this.isChecked)
        ) {
          this.yearList[0].low = 0;
          this.yearList[0].normal = 1;
          this.yearList[0].high = 0;
        } else if (this.sampleData[i].bpm < 60) {
          this.yearList[0].low = 1;
          this.yearList[0].normal = 0;
          this.yearList[0].high = 0;
        } else {
          this.yearList[0].low = 0;
          this.yearList[0].normal = 0;
          this.yearList[0].high = 1;
        }
      } else {
        for (let j = 0; j < this.yearList.length; j++) {
          if (today == this.yearList[j]?.date) {
            findIt = true;
            if (
              (this.sampleData[i].bpm > 59 && this.sampleData[i].bpm < 101) ||
              (this.sampleData[i].bpm > 39 &&
                this.sampleData[i].bpm < 101 &&
                this.isChecked)
            ) {
              this.yearList[j].normal += 1;
            } else if (this.sampleData[i].bpm < 60) {
              this.yearList[j].low += 1;
            } else {
              this.yearList[j].high += 1;
            }
          }
        }
        if (!findIt) {
          let lastrecord = this.yearList.length;
          this.yearList[lastrecord] = { date: today };
          if (
            (this.sampleData[i].bpm > 59 && this.sampleData[i].bpm < 101) ||
            (this.sampleData[i].bpm > 39 &&
              this.sampleData[i].bpm < 101 &&
              this.isChecked)
          ) {
            this.yearList[lastrecord].normal = 1;
            this.yearList[lastrecord].low = 0;
            this.yearList[lastrecord].high = 0;
          } else if (this.sampleData[i].bpm < 60) {
            this.yearList[lastrecord].normal = 0;
            this.yearList[lastrecord].low = 1;
            this.yearList[lastrecord].high = 0;
          } else {
            this.yearList[lastrecord].normal = 0;
            this.yearList[lastrecord].low = 0;
            this.yearList[lastrecord].high = 1;
          }
        }
      }
    }
    this.yearList.map((el) => {
      let normalP = (el.normal / (el.low + el.high + el.normal)) * 100;
      normalP = parseInt(`${normalP}`);
      el.normalP=normalP;
      el.badP = 100 - normalP;
    });
    console.log(this.yearList);
  }
}
