import { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

interface AudioPlayerProps {
  audioFile: File;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioFile }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioFile) {
      // Set the duration once the audio is loaded
      audioRef.current?.load();
    }
  }, [audioFile]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current?.currentTime || 0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  return (
    <div className="bg-black p-4 rounded-lg shadow-md">
      <h3 className="text-white mb-2 text-lg font-semibold">Preview Audio:</h3>
      <div className="flex items-center justify-between">
        {/* Play/Pause button */}
        <button
          onClick={handlePlayPause}
          className="text-white text-3xl p-2"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        
        {/* Audio Time Display */}
        <div className="text-white flex-1 mx-4">
          <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Hidden Audio Player for playing */}
      <audio
        ref={audioRef}
        src={URL.createObjectURL(audioFile)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        style={{ display: "none" }} // Hide the default controls
      />
    </div>
  );
};

export default AudioPlayer;
