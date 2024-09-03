export default function CameraFeed() {
    const videoUrl = 'http://54.174.122.173:8080/'
    return (
        <div>
        <h1>Video Feed</h1>
        <img
          src={videoUrl}
          alt="Video Feed"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
    )
}