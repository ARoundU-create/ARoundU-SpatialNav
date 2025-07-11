// AnchorButtonHandler.ts

import { PinchButton } from 'SpectaclesInteractionKit/Components/UI/PinchButton/PinchButton';
import { AnchorPlacementController } from './AnchorPlacementController';

@component
export class AnchorButtonHandler extends BaseScriptComponent {
  /** Drag in your AnchorPlacementController here */
  @input
  public anchorController!: AnchorPlacementController;

  /** Drag in the PinchButton on *this* prefab */
  @input
  public button!: PinchButton;

  /** Which group-index (0…4) this button represents */
  @input
  public anchorIndex: number = 0;

  onAwake(): void {
    if (!this.button || typeof this.button.onButtonPinched?.add !== 'function') {
      print('❌ AnchorButtonHandler: PinchButton is missing or invalid');
      return;
    }
    // Wire up the pinch event
    this.button.onButtonPinched.add(() => this.onPressed());
  }

  private onPressed(): void {
    const ctrl = this.anchorController;
    const idx  = this.anchorIndex;

    if (!ctrl) {
      print('❌ AnchorButtonHandler: no controller linked');
      return;
    }

    // Ask “how many anchors are stored in group `idx`?” by passing idx in
    const count = ctrl.getAnchorCount(idx);
    if (idx < 0 || idx >= count) {
      print(`⚠️ Button ${idx+1}: only ${count} anchors stored`);
      return;
    }

    // Trigger navigation for this group
    ctrl.navigateToAnchorByIndex(idx);
    print(`🔹 Navigating to anchor group #${idx+1}`);
  }
}
