// InstructionController.ts

import { PinchButton } from 'SpectaclesInteractionKit/Components/UI/PinchButton/PinchButton';

@component
export class InstructionController extends BaseScriptComponent {
  /** The root SceneObject of your instruction UI (e.g. Canvas/Frame) */
  @input instructionPanel!: SceneObject;
  /** The “Got it” close button – can be a PinchButton or Interactable */
  @input closeButton!: PinchButton;
  /** The root SceneObject of your actual menu UI */
  @input menuPanel!: SceneObject;

  onAwake(): void {
    // At start: show instructions, hide menu
    if (this.instructionPanel)  this.instructionPanel.enabled = true;
    if (this.menuPanel)         this.menuPanel.enabled = false;

    if (!this.closeButton) {
      print('❌ InstructionController: closeButton not assigned!');
      return;
    }
    // Bind the pinch event
    this.closeButton.onButtonPinched.add(() => this.onCloseInstructions());
  }

  private onCloseInstructions(): void {
    // Hide instructions, show menu
    if (this.instructionPanel)  this.instructionPanel.enabled = false;
    if (this.menuPanel)         this.menuPanel.enabled = true;
  }
}
