import { motion } from "framer-motion";
import React from "react";

export function Explanation({
  src,
  visible,
  onEnded,
}: {
  src: string;
  visible: boolean;
  onEnded: () => void;
}): React.JSX.Element {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  return (
    <motion.video
      className="w-[200px] rounded h-1/2 bottom-8 left-8 absolute object-cover z-10"
      ref={videoRef}
      src={src}
      animate={{ scaleY: visible ? 1 : 0 }}
      onEnded={onEnded}
      onAnimationComplete={() => {
        if (!videoRef.current) return;
        if (visible) {
          videoRef.current.play();
          return;
        }
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }}
      onClick={() => {
        if (videoRef.current?.paused) {
          videoRef.current?.play();
          return;
        }
        videoRef.current?.pause();
      }}
    ></motion.video>
  );
}
