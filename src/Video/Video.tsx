import { FC, useEffect, useRef, useState } from "react"
import styled from "styled-components"

const StyledVideo = styled.video`
  grid-area: video;
  justify-self: center;
  align-self: center;
  max-width: 100%;
  max-height: 100%;
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
  onLoaded,
  onDurationChange,
  onTimeChange,
  onPauseChange,
  ...props
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  const minTime = roundToMillisecondsPrecision(props.minTime)
  const maxTime = roundToMillisecondsPrecision(props.maxTime)
  const limitToMinMaxTime = (time: number) => Math.min(maxTime, Math.max(minTime, time))
  const currentTime = roundToMillisecondsPrecision(limitToMinMaxTime(props.currentTime))
  const [lastCurrentTime, setLastCurrentTime] = useState(0)

  // Play/pause the video when the `isPaused` prop changes
  useEffect(() => {
    const { current: video } = videoRef
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
  }, [isPaused, minTime, maxTime, videoRef])

  // Change the current time of the video when the `currentTime` prop changes
  useEffect(() => {
    const { current: video } = videoRef
    // We compare the currentTime to the previous one we emitted through `onTimeChange`, otherwise
    // it would create a stuttering animation when playing the video.
    if (video && currentTime !== lastCurrentTime) {
      video.currentTime = currentTime
    }
  }, [currentTime, lastCurrentTime, videoRef])

  // Handle everything when the current time changes
  const timeUpdateHandler = () => {
    const { current: video } = videoRef
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

      setLastCurrentTime(roundToMillisecondsPrecision(currentTime))
      onTimeChange(currentTime)
    }
  }

  return (
    <StyledVideo
      ref={videoRef}
      src={src}
      disablePictureInPicture={true}
      onCanPlayThrough={() => onLoaded()}
      onLoadedMetadata={() => videoRef.current && onDurationChange(videoRef.current.duration)}
      onTimeUpdate={timeUpdateHandler}
      onPlay={() => onPauseChange(false)}
      onPause={() => onPauseChange(true)}
    />
  )
}

/**
 * Rounds the provided value to the milliseconds precision.
 *
 * This avoids weird quirks where our original value has a
 * precision higher than the one used by the <video> tag.
 */
export const roundToMillisecondsPrecision = (seconds: number) => Math.round(seconds * 1000) / 1000
