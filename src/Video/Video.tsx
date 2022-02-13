import { FC, useEffect, useRef, useState } from "react"
import styled from "styled-components"

const StyledVideo = styled.video`
  display: block;
  margin: 30px 0;
  width: 100%;
  background: #565656;
`

interface VideoProps {
  readonly src?: string
  readonly isPaused: boolean
  readonly currentTime: number
  readonly minTime: number
  readonly maxTime: number
  onLoaded(): void
  onDurationChange(duration: number): void
  onTimeChange(time: number): void
  onPauseChange(isPaused: boolean): void
}

/**
 * A wrapper around the native <video> element to ease the API and accept min and max times.
 */
export const Video: FC<VideoProps> = ({
  src,
  isPaused,
  minTime,
  maxTime,
  onLoaded,
  onDurationChange,
  onTimeChange,
  onPauseChange,
  ...props
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { current: video } = videoRef

  const limitToMinMaxTime = (time: number) => Math.min(maxTime, Math.max(minTime, time))
  const currentTime = limitToMinMaxTime(props.currentTime)
  const [lastCurrentTime, setLastCurrentTime] = useState(0)

  // Play/pause the video when the `isPaused` prop changes
  useEffect(() => {
    if (video) {
      if (isPaused) {
        video.pause()
      } else {
        if (video.paused && video.currentTime + 0.1 >= maxTime) {
          video.currentTime = minTime
        }
        video.play()
      }
    }
  }, [isPaused, minTime, maxTime, video])

  // Change the current time of the video when the `currentTime` prop changes
  useEffect(() => {
    // We compare the currentTime to the previous one we emitted through `onTimeChange`, otherwise
    // it would create a stuttering animation when playing the video.
    if (video && currentTime !== lastCurrentTime) {
      video.currentTime = currentTime
    }
  }, [currentTime, lastCurrentTime, video])

  // Handle everything when the current time changes
  const timeUpdateHandler = () => {
    if (video) {
      const currentTime = limitToMinMaxTime(video.currentTime)

      // If we are beyond the max time then we have reached the end of the video and should pause
      if (video.currentTime > maxTime) {
        video.pause()
      }

      // If the limited current time is different than the original, update the video element.
      if (currentTime !== video.currentTime) {
        video.currentTime = currentTime
      }

      setLastCurrentTime(currentTime)
      onTimeChange(currentTime)
    }
  }

  return (
    <StyledVideo
      ref={videoRef}
      src={src}
      disablePictureInPicture={true}
      onCanPlayThrough={() => onLoaded()}
      onLoadedMetadata={() => video && onDurationChange(video.duration)}
      onTimeUpdate={timeUpdateHandler}
      onPlay={() => onPauseChange(false)}
      onPause={() => onPauseChange(true)}
    />
  )
}
