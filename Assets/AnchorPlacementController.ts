import {
  AnchorSession,
  AnchorSessionOptions,
} from './Spatial Anchors/AnchorSession';
import { Anchor } from './Spatial Anchors/Anchor';
import { AnchorComponent } from './Spatial Anchors/AnchorComponent';
import { AnchorModule } from './Spatial Anchors/AnchorModule';
import { PinchButton } from 'SpectaclesInteractionKit/Components/UI/PinchButton/PinchButton';

@component
export class AnchorPlacementController extends BaseScriptComponent {
  @input anchorModule!: AnchorModule;
  @input createAnchorButton!: PinchButton;
  @input camera!: SceneObject;
  @input prefab!: ObjectPrefab;      // glowing-anchor visual
  @input glowMaterial!: Material;

  @input pathPrefab!: ObjectPrefab;        // prefab for path segments
  @input pathSegmentCount: number = 5;     // pieces per segment
  @input segmentScale: number = 1.0;       // size of each piece
  @input pathStartYOffset: number = -0.5;  // drop under eye-level
  @input anchorHighlightScale: number = 1.5;

  @input currentGroup: number = 0;         // which path we’re recording
  @input maxAnchorsPerGroup: number = 5; 
  @input menuPanel!: SceneObject;          // limit per path

  private anchorSession?: AnchorSession;
  private readonly MAX_GROUPS = 5;

  // Each group is an array of {id,pos}
  private anchorGroups: { id: string; pos: vec3 }[][] =
    Array(this.MAX_GROUPS).fill(null).map(() => []);

  // Parallel visuals
  private anchorGroupVisuals: SceneObject[][] =
    Array(this.MAX_GROUPS).fill(null).map(() => []);

  // Holds the last‐drawn path so we can clear it
  private _currentPathSegments: SceneObject[] = [];

  onAwake() {
    this.createEvent('OnStartEvent').bind(() => this.onStart());
  }

  async onStart() {
    // drop anchors only when menu is closed
    this.createEvent('TapEvent').bind(() => {
      if (this.menuPanel?.enabled) return;
      this.createAnchor();
    });
    this.createAnchorButton.onButtonPinched.add(() => {
      if (this.menuPanel?.enabled) return;
      this.createAnchor();
    });

    // open AR session
    const opts = new AnchorSessionOptions();
    opts.scanForWorldAnchors = true;
    this.anchorSession = await this.anchorModule.openSession(opts);

    // whenever an anchor is found (or reloaded)…
    this.anchorSession.onAnchorNearby.add(this.onAnchorNearby.bind(this));
  }

  private onAnchorNearby(anchor: Anchor): void {
    const g = this.currentGroup;
    if (g < 0 || g >= this.MAX_GROUPS) return;
    if (this.anchorGroups[g].length >= this.maxAnchorsPerGroup) return;
    if (this.anchorGroups[g].some(a => a.id === anchor.id)) return;

    // record it
    const mat = anchor.toWorldFromAnchor!;
    const pos = new vec3(mat.column3.x, mat.column3.y, mat.column3.z);
    this.anchorGroups[g].push({ id: anchor.id, pos });

    // visualize
    const viz = this.prefab.instantiate(this.getSceneObject());
    viz.getTransform().setLocalScale(new vec3(5, 5, 5));
    const comp = viz.createComponent(AnchorComponent.getTypeName()) as AnchorComponent;
    comp.anchor = anchor;
    const mesh = viz.getFirstComponent('Component.RenderMeshVisual')
               || viz.getFirstComponent('Component.MeshVisual');
    if (mesh && this.glowMaterial) mesh.mainMaterial = this.glowMaterial;
    this.anchorGroupVisuals[g].push(viz);

    if (this.anchorGroups[g].length === this.maxAnchorsPerGroup) {
      print(`✅ Path ${g + 1} completed with ${this.maxAnchorsPerGroup} anchors. ` +
            `Press “Next Path” to begin Path ${g + 2}.`);
    }
  }

  private async createAnchor(): Promise<void> {
    const g = this.currentGroup;
    if (!this.anchorSession || g < 0 || g >= this.MAX_GROUPS) return;
    if (this.anchorGroups[g].length >= this.maxAnchorsPerGroup) return;

    const world = this.camera.getTransform().getWorldTransform();
    const pose  = world.mult(mat4.fromTranslation(new vec3(0, 0, -5)));
    const anchor = await this.anchorSession.createWorldAnchor(pose);
    this.onAnchorNearby(anchor);
  }

  // ─── PUBLIC API ─────────────────────────────────────────────

  public getAnchorCount(g: number): number {
    if (g < 0 || g >= this.MAX_GROUPS) return 0;
    return this.anchorGroups[g].length;
  }

  public nextGroup(): void {
    if (this.currentGroup + 1 < this.MAX_GROUPS) {
      this.currentGroup++;
      print(`▶️ Now recording anchors for Path ${this.currentGroup + 1}.`);
    } else {
      print('❌ You have no more paths to record.');
    }
  }

  /**
   * Draw navigation‐path for group g:
   * 1) start from the anchor nearest the camera,
   * 2) follow the recorded order around,
   * 3) all at **flatY** = cameraY + pathStartYOffset.
   */
  /**
 * Navigate in reverse (camera → last anchor → … → first anchor),
 * using full 3D height rather than a flat Y‐plane.
 */
public navigateToAnchorByIndex(g: number): void {
  if (g < 0 || g >= this.MAX_GROUPS) return;
  const grp = this.anchorGroups[g];
  if (grp.length === 0) {
    print(`⚠️ No anchors recorded for Path ${g + 1}`);
    return;
  }

  // 1) Clear any existing path
  this._currentPathSegments.forEach(s => s.destroy());
  this._currentPathSegments = [];

  // 2) Reverse the anchors so we go camera→last→…→first
  const ordered = grp.slice().reverse();

  // 3) Start at the camera’s true world‐position
  let start = this.camera.getTransform().getWorldPosition();

  // 4) Walk through each anchor in turn
  ordered.forEach(entry => {
    this._drawSegment(start, entry.pos);
    start = entry.pos;
  });

  // 5) Highlight all anchors in this group
  this.anchorGroupVisuals[g].forEach(viz => {
    const tf   = viz.getTransform();
    const orig = tf.getLocalScale();
    tf.setLocalScale(orig.uniformScale(this.anchorHighlightScale));
  });
}

/**
 * Draw a straight line of arrows from A to B, interpolating X,Y,Z.
 */
private _drawSegment(A: vec3, B: vec3): void {
  if (!this.pathPrefab) {
    print('❌ pathPrefab not assigned!');
    return;
  }

  // direction + distance
  const dv   = B.sub(A);
  const dist = Math.sqrt(dv.x*dv.x + dv.y*dv.y + dv.z*dv.z);
  if (dist < 0.01) return;
  const dir  = dv.uniformScale(1 / dist);

  // one arrow every (dist / pathSegmentCount)
  for (let i = 0; i <= this.pathSegmentCount; i++) {
    const t = i / this.pathSegmentCount;

    // interpolate full 3D position
    const pos = new vec3(
      A.x + dir.x * dist * t,
      A.y + dir.y * dist * t,
      A.z + dir.z * dist * t
    );

    // orient +Z toward dir
    const yawRad   = Math.atan2(dir.x,   dir.z);
    const pitchRad = Math.asin(dir.y);
    const rollDeg  = 0;  // adjust if your arrow mesh needs a roll
    const rot      = quat.fromEulerAngles(
      pitchRad * 180/Math.PI,
      yawRad   * 180/Math.PI,
      rollDeg
    );

    // instantiate
    const seg = this.pathPrefab.instantiate(this.getSceneObject());
    const tf  = seg.getTransform();
    tf.setWorldPosition(pos);
    tf.setLocalRotation(rot);
    tf.setLocalScale(new vec3(
      this.segmentScale,
      this.segmentScale,
      this.segmentScale
    ));

    this._currentPathSegments.push(seg);
  }
}

}
