import { Component, AfterViewInit, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { Firestore, collection, query, orderBy } from '@angular/fire/firestore';
import { collectionData } from 'rxfire/firestore';
import { SpinnerService } from '../servicios/spinner.service';
import { SonidosService } from '../servicios/sonidos.service';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone:false,
})
export class Tab2Page implements OnInit {
  
  cosasLindas: any[] = [];
  cosasFeas: any[] = [];
  chartLindasRef: Chart | null = null;
  chartFeasRef: Chart | null = null;

  constructor(
    private spinner: SpinnerService,
    private sonido: SonidosService,
    private firestore: Firestore

  ) { }


  ngOnInit() {
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
  }

  ngAfterViewInit(): void 
  {
    this.obtenerItemsCosasDB('cosas_lindas');
    this.obtenerItemsCosasDB('cosas_feas');
  }

  obtenerItemsCosasDB(nombre_lista: string) 
  {
    const coleccion = collection(this.firestore, nombre_lista);
    const q = query(coleccion, orderBy('fecha', 'asc'));

    const observable = collectionData(q, { idField: 'id' });

    observable.subscribe((datos: any[]) => {
      if (nombre_lista === 'cosas_lindas') 
      {
        this.cosasLindas = datos;
        this.mostrarGraficoLindas();
      } 
      else
      {
        this.cosasFeas = datos;
        this.mostrarGraficoFeas();
      }
    });
  }

  mostrarGraficoLindas() 
  {
    const labels = this.cosasLindas.map(item => item.nombre);
    const data = this.cosasLindas.map(item => item.likes);

    const ctx = document.getElementById('chartLindas') as HTMLCanvasElement;

    if (this.chartLindasRef) 
    {
      this.chartLindasRef.destroy();
    }

    this.chartLindasRef = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: this.generarColores(data.length)
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false 
      }
    });
  }

  mostrarGraficoFeas() {
    const labels = this.cosasFeas.map(item => item.nombre);
    const data = this.cosasFeas.map(item => item.likes);

    const ctx = document.getElementById('chartFeas') as HTMLCanvasElement;

    if (this.chartFeasRef)
    {
      this.chartFeasRef.destroy();
    }

    this.chartFeasRef = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Me Gusta',
          data: data,
          backgroundColor: this.generarColores(data.length)
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  generarColores(cantidad: number): string[] 
  {
    const colores = ['#f44336', '#2196f3', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4', '#cddc39'];
    return Array.from({ length: cantidad }, (_, i) => colores[i % colores.length]);
  }


}
