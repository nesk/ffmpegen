import { FC, useRef, useState } from "react"
import styled from "styled-components"
import { CliCode } from "./CliCode"
import { onPartialCurrentRef } from "./Ref"
import { Video } from "./Video/Video"
import { VideoCutter } from "./Video/Controls/VideoCutter"
import { VideoTimeline } from "./Video/Controls/VideoTimeline"

const Input = styled.input`
  display: block;
  margin: 30px auto;
`

export const App: FC = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const onInputRef = onPartialCurrentRef(inputRef)
  const videoRef = useRef<Video>(null)
  const onVideoRef = onPartialCurrentRef(videoRef)

  const [fileUrl, setFileUrl] = useState<string>()
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [minTime, setMinTime] = useState(0)
  const [maxTime, setMaxTime] = useState(Infinity)
  const [wasPausedBeforeSeek, setWasPausedBeforeSeek] = useState<boolean | null>(null)

  const onSeeking = (currentTime: number) => {
    onVideoRef(video => {
      if (wasPausedBeforeSeek === null) {
        setWasPausedBeforeSeek(video.isPaused)
      }
      video.pause()
      video.seek(currentTime)
    })
  }

  const onSeeked = () => {
    onVideoRef(video => {
      if (!wasPausedBeforeSeek) {
        video.play()
      }
      setWasPausedBeforeSeek(null)
    })
  }

  return (
    <>
      <Input
        ref={inputRef}
        type="file"
        accept="video/*"
        onChange={() => {
          onInputRef(({ files }) => {
            if (files !== null && files.length > 0) {
              setFileUrl(URL.createObjectURL(files[0]))
            }
          })
        }}
      />

      <div
        onClick={() => {
          onVideoRef(video => (video.isPaused ? video.play() : video.pause()))
        }}
      >
        <Video
          ref={videoRef}
          src={fileUrl}
          minTime={minTime}
          maxTime={maxTime}
          onLoaded={() => {}}
          onDuration={setDuration}
          onTime={setCurrentTime}
        />
      </div>

      <p style={{ margin: "30px 0", columnCount: 2 }}>
        Current time: <strong>{currentTime}</strong> <br />
        Duration: <strong>{duration}</strong> <br />
      </p>

      <VideoCutter duration={duration} onMinTime={setMinTime} onMaxTime={setMaxTime}>
        <VideoTimeline duration={duration} currentTime={currentTime} onSeeking={onSeeking} onSeeked={onSeeked} />
      </VideoCutter>

      <CliCode file={onInputRef(input => input.files?.item(0) ?? undefined)} startTime={minTime} endTime={maxTime} />
    </>
  )
}
