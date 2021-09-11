import { IndividualSimResult } from '../api/newapi';
import { Stat } from '../api/newapi';
import { StatWeightsResult } from '../api/newapi';
import { StatNames } from '../api/utils';
import { Component } from './component.js';

export class Results extends Component {
  readonly rootElem: HTMLDivElement;
  readonly pendingElem: HTMLDivElement;
  readonly simElem: HTMLDivElement;
  readonly epElem: HTMLDivElement;

  constructor() {
    super();

    this.rootElem = document.createElement('div');
    this.rootElem.classList.add('results-root');
    this.rootElem.innerHTML = `
      <div class="results-pending">
        <div class="loader"></div>
      </div>
      <div class="results-sim">
      </div>
      <div class="results-ep">
      </div>
    `;

    this.pendingElem = this.rootElem.getElementsByClassName('results-pending')[0] as HTMLDivElement;
    this.simElem = this.rootElem.getElementsByClassName('results-sim')[0] as HTMLDivElement;
    this.epElem = this.rootElem.getElementsByClassName('results-ep')[0] as HTMLDivElement;
    this.hideAll();
  }

  getRootElement() {
    return this.rootElem;
  }

  hideAll() {
    this.pendingElem.style.display = 'none';
    this.simElem.style.display = 'none';
    this.epElem.style.display = 'none';
  }

  setPending() {
    this.hideAll();
    this.pendingElem.style.display = 'initial';
  }

  setSimResult(result: IndividualSimResult) {
    this.hideAll();
    this.simElem.style.display = 'initial';
    this.simElem.innerHTML = `
      <span class="results-sim-dps-avg">${result.dpsAvg.toFixed(2)}</span>
      <span class="results-sim-dps-stdev">${result.dpsStdev.toFixed(2)}</span>
    `;
  }

  setStatWeights(result: StatWeightsResult, epStats: Array<Stat>) {
    this.hideAll();
    this.epElem.style.display = 'initial';
    this.epElem.innerHTML = '<table class="results-ep-table">'
        + epStats.map(stat => `<tr>
            <td>${StatNames[stat]}:</td>
            <td>${result.weights[stat].toFixed(2)}</td>
            <td>${result.weightsStdev[stat].toFixed(2)}</td>
            <td>${result.epValues[stat].toFixed(2)}</td>
            <td>${result.epValuesStdev[stat].toFixed(2)}</td>
            </tr>`)
        .join('')
        + '</table';
  }
}
