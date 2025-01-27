

export default function TestVideo() {
  return (
    <div>
      <h1>Hey</h1>
      <video
        className="responsive-img"
        controls
        width="500"
        src={"/SampleRecordings/motion_20250123_090012.mp4"}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
