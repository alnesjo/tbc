import { Component } from '/tbc/core/components/component.js';
import { NumberPicker } from '/tbc/core/components/number_picker.js';
import { TypedEvent } from './typed_event.js';
// Shared UI for all individual sims and the raid sim.
export class SimUI extends Component {
    constructor(parentElem, sim, config) {
        super(parentElem, 'sim-ui');
        // Emits when anything from the sim, raid, or encounter changes.
        this.changeEmitter = new TypedEvent();
        this.sim = sim;
        this.rootElem.innerHTML = simHTML;
        [
            this.sim.changeEmitter,
        ].forEach(emitter => emitter.on(() => this.changeEmitter.emit()));
        Array.from(document.getElementsByClassName('known-issues')).forEach(element => {
            if (config.knownIssues?.length) {
                element.style.display = 'initial';
            }
            else {
                return;
            }
            tippy(element, {
                'content': `
				<ul class="known-issues-tooltip">
					${config.knownIssues.map(issue => '<li>' + issue + '</li>').join('')}
				</ul>
				`,
                'allowHTML': true,
            });
        });
        this.resultsPendingElem = this.rootElem.getElementsByClassName('results-pending')[0];
        this.resultsContentElem = this.rootElem.getElementsByClassName('results-content')[0];
        this.resultsContentElem.style.display = 'none';
        this.resultsPendingElem.style.display = 'none';
        const titleElem = this.rootElem.getElementsByClassName('sim-sidebar-title')[0];
        titleElem.textContent = config.title;
        const simActionsContainer = this.rootElem.getElementsByClassName('sim-sidebar-actions')[0];
        const iterationsPicker = new NumberPicker(simActionsContainer, this.sim, {
            label: 'Iterations',
            cssClass: 'iterations-picker',
            changedEvent: (sim) => sim.iterationsChangeEmitter,
            getValue: (sim) => sim.getIterations(),
            setValue: (sim, newValue) => {
                sim.setIterations(newValue);
            },
        });
    }
    addAction(name, cssClass, actFn) {
        const simActionsContainer = this.rootElem.getElementsByClassName('sim-sidebar-actions')[0];
        const iterationsPicker = this.rootElem.getElementsByClassName('iterations-picker')[0];
        const button = document.createElement('button');
        button.classList.add('sim-sidebar-actions-button', cssClass);
        button.textContent = name;
        button.addEventListener('click', actFn);
        simActionsContainer.insertBefore(button, iterationsPicker);
    }
    addTab(title, cssClass, innerHTML) {
        const simTabsContainer = this.rootElem.getElementsByClassName('sim-tabs')[0];
        const simTabContentsContainer = this.rootElem.getElementsByClassName('tab-content')[0];
        const topBar = simTabsContainer.getElementsByClassName('sim-top-bar')[0];
        const contentId = title.replace(/\s+/g, '-') + '-tab';
        const isFirstTab = simTabsContainer.children.length == 1;
        const newTab = document.createElement('li');
        newTab.innerHTML = `<a data-toggle="tab" href="#${contentId}">${title}</a>`;
        newTab.classList.add(cssClass + '-tab');
        const newContent = document.createElement('div');
        newContent.id = contentId;
        newContent.classList.add(cssClass, 'tab-pane', 'fade');
        newContent.innerHTML = innerHTML;
        if (isFirstTab) {
            newTab.classList.add('active');
            newContent.classList.add('active', 'in');
        }
        simTabsContainer.insertBefore(newTab, topBar);
        simTabContentsContainer.appendChild(newContent);
    }
    setResultsPending() {
        this.resultsContentElem.style.display = 'none';
        this.resultsPendingElem.style.display = 'initial';
    }
    setResultsContent(innerHTML) {
        this.resultsContentElem.innerHTML = innerHTML;
        this.resultsContentElem.style.display = 'initial';
        this.resultsPendingElem.style.display = 'none';
    }
    getSettingsStorageKey() {
        return this.getStorageKey('__currentSettings__');
    }
}
const simHTML = `
<div class="sim-root">
  <section class="sim-sidebar">
    <div class="sim-sidebar-title"></div>
    <div class="sim-sidebar-actions"></div>
    <div class="sim-sidebar-results">
      <div class="results-pending">
        <div class="loader"></div>
      </div>
      <div class="results-content">
      </div>
		</div>
    <div class="sim-sidebar-footer"></div>
  </section>
  <section class="sim-main">
    <ul class="sim-tabs nav nav-tabs">
      <li class="sim-top-bar">
				<div class="known-issues">Known Issues</div>
				<span class="share-link fa fa-link"></span>
			</li>
    </ul>
    <div class="tab-content">
    </div>
  </section>
</div>
`;
