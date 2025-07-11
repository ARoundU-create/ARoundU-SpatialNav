// AnchorScrollViewItem.ts

@component
export class AnchorScrollViewItem extends BaseScriptComponent {
  /** Drag in the AnchorPlacementController instance here */
  @input('Component.ScriptComponent')
  public anchorController!: any;

  /** Drag *this* button’s Interactable component here */
  @input('Component.ScriptComponent')
  public interactable!: any;

  /** Set by the grid‐creator (0..4) */
  @input
  public anchorIndex: number = 0;

  onAwake(): void {
    if (!this.interactable) {
      print('❌ AnchorScrollViewItem: no Interactable assigned!');
      return;
    }
    // When the user finishes the tap/pinch…
    this.interactable.onTriggerEnd.add(() => this.onPressed());
  }

  private onPressed(): void {
    const ctrl = this.anchorController;
    const idx  = this.anchorIndex;

    if (!ctrl) {
      print('❌ AnchorScrollViewItem: no controller linked!');
      return;
    }

    const count = ctrl.getAnchorCount();
    if (idx < 0 || idx >= count) {
      print(`⚠️ Button #${idx+1}: only ${count} anchors stored`);
      return;
    }

    // Kick off your navigation path:
    ctrl.navigateToAnchorByIndex(idx);
  }
}
