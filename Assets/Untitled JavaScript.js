//// MenuButtonHandler.js
//
//// 1) Pull in SpectaclesInteractionKit so we can hook the interactor event
////const SIK = require('SpectaclesInteractionKit.lspkg/SIK').SIK;
//
//// 2) Inspector inputs:
////    - anchorController: your TS controller instance
////    - createButton: the Interactable/PinchButton ScriptComponent on this 3D object
////    - anchorIndex: which slot (0–4) this button corresponds to
////
////@input Component.ScriptComponent anchorController {"hint":"Drag your AnchorPlacementController here"}
////@input Component.ScriptComponent createButton      {"hint":"Drag this object’s Interactable/PinchButton script here"}
////@input int                   anchorIndex          {"hint":"0 for first anchor, 1 for second, etc."}
//
//function onAwake() {
//  // wait until OnStart so all inputs are wired
//  script.createEvent('OnStartEvent').bind(onStart);
//}
//
//function onStart() {
//  if (!script.createButton || !script.createButton.api) {
//    print('❌ MenuButtonHandler: createButton not assigned or missing API');
//    return;
//  }
//
//  // 3) Override the interactor trigger start callback
//  //    This matches your original pattern: onInteractorTriggerStart takes one param
//  script.createButton.api.onInteractorTriggerStart = function(evtData) {
//    handlePress();
//  };
//}
//
//// 4) Shared logic for when the button is pressed
//function handlePress() {
//  const ctrl = script.anchorController;
//  const idx  = script.anchorIndex;
//
//  if (!ctrl || !ctrl.api || typeof ctrl.api.getAnchorCount !== 'function') {
//    print('❌ MenuButtonHandler: Invalid or missing anchorController');
//    return;
//  }
//
//  // How many anchors are stored?
//  const count = ctrl.api.getAnchorCount();
//  if (idx < 0 || idx >= count) {
//    print(`⚠️ Button ${idx+1}: only ${count} anchors stored`);
//    return;
//  }
//
//  // Fetch and print the vec3
//  const pos = ctrl.api.getAnchorPosition(idx);
//  print(`🔹 Anchor ${idx+1}: (${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)})`);
//
//  // If you also have a TS-side navigation method, you could do:
//  // ctrl.api.navigateToAnchorByIndex(idx);
//}
//
//onAwake();
//