// Assets/UIButtonBehavior.ts

@component
export class UIButtonBehavior extends BaseScriptComponent {
  /** we’ll fill this in from the parent controller */
  @input anchorId: string = "";
  
  /** this exact name is what the UI system will call */
  public onPressDown() {
    print(`🟢 [UIButtonBehavior] pressed for anchor ${this.anchorId}`);
    // …later we’ll kick off your “navigate to anchor” logic here…
  }
}
