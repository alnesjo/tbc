import { Sim } from '/tbc/core/sim.js';
import { RaidPicker } from './raid_picker.js';
export class RaidSimUI {
    constructor(parentElem, config) {
        this.sim = new Sim();
        this.config = config;
        this.parentElem = parentElem;
        this.parentElem.innerHTML = layoutHTML;
        const titleElem = this.parentElem.getElementsByClassName('default-title')[0];
        titleElem.textContent = 'TBC Raid Sim';
        const raidPicker = new RaidPicker(this.parentElem.getElementsByClassName('raid-picker')[0], this.sim.raid, this.config.presets);
    }
}
const layoutHTML = `
<div class="default-root">
  <section class="default-sidebar">
    <div class="default-title"></div>
    <div class="default-actions"></div>
    <div class="default-results"></div>
    <div class="default-buffs"></div>
  </section>
  <section class="default-main">
    <ul class="nav nav-tabs">
      <li class="active"><a data-toggle="tab" href="#raid-tab">Raid</a></li>
      <li><a data-toggle="tab" href="#detailed-results-tab">Detailed Results</a></li>
      <li><a data-toggle="tab" href="#log-tab">Log</a></li>
      <li class="default-top-bar">
				<div class="known-issues">Known Issues</div>
				<span class="share-link fa fa-link"></span>
			</li>
    </ul>
    <div class="tab-content">
      <div id="raid-tab" class="raid-tab tab-pane fade in active">
				<div class="raid-picker">
				</div>
				<div class="saved-raids-div">
					<div class="saved-raids-manager">
					</div>
				</div>
      </div>
      <div id="detailed-results-tab" class="tab-pane fade">
				<div class="detailed-results">
				</div>
      </div>
      <div id="log-tab" class="tab-pane fade">
				<div class="log-runner">
				</div>
      </div>
    </div>
  </section>
</div>
`;
