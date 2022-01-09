import { Component, createRef } from "react"
import styled from "styled-components"
import { onPartialCurrentRef } from "../Ref"

const StyledVideo = styled.video`
  display: block;
  width: 100%;
  background: grey;
`

interface VideoProps {
  readonly src?: string
  readonly minTime: number
  readonly maxTime: number
  onLoaded(): void
  onDuration(duration: number): void
  onTime(time: number): void
}

/**
 * A wrapper around the native <video> element to ease the API and accept min and max times.
 */
export class Video extends Component<VideoProps> {
  private ref = createRef<HTMLVideoElement>()
  private onRef = onPartialCurrentRef(this.ref)

  get isPaused() {
    return this.onRef(({ paused }) => paused) ?? true
  }

  play() {
    // If the video has been played entirely then go back to start
    const { minTime, maxTime } = this.props
    this.onRef(video => {
      if (video.paused && video.currentTime >= maxTime) {
        video.currentTime = minTime
      }
      this.updateCurrentTimeWithinLimits()
      video.play()
    })
  }

  pause = () => this.onRef(video => video.pause())

  seek(time: number) {
    // Do not allow to seek beyond the time limits
    const { minTime, maxTime } = this.props
    time = Math.max(minTime, time)
    time = Math.min(maxTime, time)
    this.onRef(video => (video.currentTime = time))
  }

  private onTimeUdate() {
    this.updateCurrentTimeWithinLimits()
    this.onRef(({ currentTime }) => this.props.onTime(currentTime))
  }

  private updateCurrentTimeWithinLimits() {
    const { minTime, maxTime } = this.props
    this.onRef(video => {
      if (video.currentTime < minTime) {
        video.currentTime = minTime
      } else if (video.currentTime > maxTime) {
        video.pause() // If we are beyond the max time then we have reached the end of the video and should pause
        video.currentTime = maxTime
      }
    })
  }

  componentDidUpdate() {
    this.updateCurrentTimeWithinLimits()
  }

  render() {
    const { src, onLoaded, onDuration } = this.props
    return (
      <StyledVideo
        ref={this.ref}
        src={src}
        onCanPlayThrough={() => onLoaded()}
        onLoadedMetadata={() => this.onRef(({ duration }) => onDuration(duration))}
        onTimeUpdate={() => this.onTimeUdate()}
      />
    )
  }
}
