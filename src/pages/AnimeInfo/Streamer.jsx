import { Play } from "lucide-react";
import React, { useRef, useState } from "react";

const Streamer = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const videoRef = useRef(null);

  const handlePickFolder = async () => {
    try {
      // 1. Open the directory picker
      const dirHandle = await window.showDirectoryPicker();
      const files = [];

      // 2. Iterate through files and filter for MP4s
      for await (const entry of dirHandle.values()) {
        if (entry.kind === "file" && entry.name.endsWith(".mp4")) {
          files.push(entry);
        }
      }
      setPlaylist(files);
    } catch (err) {
      console.error("Folder selection failed:", err);
    }
  };

  const playVideo = async (fileHandle) => {
    // 1. Get the actual file from the handle
    const file = await fileHandle.getFile();

    // 2. Create a temporary URL
    const videoUrl = URL.createObjectURL(file);

    // 3. Clean up the old URL to prevent memory leaks
    if (currentVideo) URL.revokeObjectURL(currentVideo);

    setCurrentVideo(videoUrl);
  };

  console.log(playlist);

  return (
    <div>
      <button
        onClick={() => {
          handlePickFolder();
        }}
        className="flex flex-grow-1 sm:flex-grow-0 justify-center items-center gap-2 text-white whitespace-nowrap text-sm px-5 py-2 bg-themeDark rounded-lg font-medium cursor-pointer hover:bg-themeDarker"
      >
        <Play width={16} />
        Play
      </button>
      <div style={{ width: "300px", borderRight: "1px solid #333" }}>
        <button onClick={handlePickFolder}>Open Folder</button>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {playlist.map((file, index) => (
            <li
              key={index}
              onClick={() => playVideo(file)}
              style={{
                cursor: "pointer",
                padding: "10px",
                borderBottom: "1px solid #222",
              }}
            >
              {file.name}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ flex: 1 }}>
        <video
          ref={videoRef}
          src={currentVideo}
          controls
          // onTimeUpdate={handleTimeUpdate}
          style={{
            width: "100%",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        />
      </div>
    </div>
  );
};

export default Streamer;
