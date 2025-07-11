// NextPathButton.ts
import { AnchorPlacementController } from './AnchorPlacementController';
import { PinchButton } from 'SpectaclesInteractionKit/Components/UI/PinchButton/PinchButton';

@component
export class NextPathButton extends BaseScriptComponent {
  @input public controller!: AnchorPlacementController;
  @input public button!: PinchButton;

  onAwake() {
    this.button.onButtonPinched.add(() => {
      this.controller.nextGroup();
    });
  }
}
