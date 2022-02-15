import EventBus from "../utils/event-bus.js";
import MediaPipePose from "./mediapipe-pose.js";
import CONFIG from "../config.js";

class MediaPipeClient extends EventBus {
  constructor(params = {}) {
    super();

    const defaults = {
      video: document.createElement("video"),
      width: 0,
      height: 0,
      pose: null,
      stream: null,
      ...params,
    };

    Object.assign(this, defaults, params);

    if (window.parent === window) {
      // not in iframe
      this.setupLocally();
    } else {
      // install on window object
      window.mediaPipe = this;
    }
  }

  async setupLocally() {
    console.log("running locally");

    const pose = await MediaPipePose.create({
      cameraConstraints: CONFIG.cameraConstraints,
      mediaPipeOptions: CONFIG.mediaPipeOptions,
      smoothen: CONFIG.smoothenDetection,
    });

    const player = pose.getVideoPlayer();

    pose.startDetection();

    this.setup({
      stream: player.stream,
      width: player.width,
      height: player.height,
      pose,
      mirrored: CONFIG.selfieMode,
    });
  }

  setup({ stream, width, height, pose, mirrored }) {
    const { video } = this;

    this.stream = stream;
    this.height = height;
    this.width = width;
    this.pose = pose;
    this.mirrored = mirrored;

    video.srcObject = stream;
    video.width = width;
    video.height = height;

    video.muted = true; //! video must be muted for autoplay
    video.play();

    this.triggerPoseBinded = this.triggerPose.bind(this); //! must bind the function before to have exact copy
    pose.addEventListener("pose", this.triggerPoseBinded);

    super.triggerEventListener("setup", this);

    window.addEventListener("beforeunload", this.destroy.bind(this));
  }

  triggerPose(event) {
    // this.smoothSkeleton
    super.triggerEventListener("pose", event.data);
  }

  destroy() {
    this.pose.removeEventListener("pose", this.triggerPoseBinded);
  }
}

window.MediaPipeClient = MediaPipeClient;
export default MediaPipeClient;
