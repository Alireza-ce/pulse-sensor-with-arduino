import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SampleData } from './../../services/data';
@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss'],
})
export class AnalysisComponent implements OnInit {
  chartType: string = 'line';
  chartLabels: Array<any> = [];
  PieChartDatasets: Array<any> = [];
  PieChartLabels: Array<any> = [];
  PieChartColors: Array<any> = [];
  chartDatasets: Array<any> = [];
  sampleData = SampleData;

  constructor(private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.setCharSet();
  }

  setCharSet() {
    let normalData = [];
    let normalNumber = 0;
    let highNumber = 0;
    let lowNumber = 0;
    this.sampleData.map((el) => {
      if (el.bpm > 60 && el.bpm < 100) {
        normalNumber += 1;
      } else if (el.bpm < 60) {
        lowNumber += 1;
      } else {
        highNumber += 1;
      }
      normalData.push(el.bpm);
      this.chartLabels.push(this.datePipe.transform(el.date, 'M/d-h:mm'));
    });

    this.PieChartDatasets = [
      { data: [lowNumber, normalNumber, highNumber], label: 'Analysis' },
    ];
    this.PieChartLabels = ['Low', 'Normal', 'High'];
    this.PieChartColors = [
      {
        backgroundColor: [
          '#F7464A',
          '#46BFBD',
          '#FDB45C',
        ],
        hoverBackgroundColor: [
          '#FF5A5E',
          '#5AD3D1',
          '#FFC870',
        ],
        borderWidth: 2,
      },
    ];
    this.chartDatasets = [{ data: normalData, label: 'BPM' }];
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
    if (e.active.length > 0)
      console.log(this.chartDatasets[0].data[e.active[0]._index]);
  }
  public chartHovered(e: any): void {}
}
