import { FC, useRef, useState } from "react"
import styled from "styled-components"
import { CliCode } from "./CliCode"
import { onPartialCurrentRef } from "./Ref"
import { Video } from "./Video/Video"
import { VideoCutter } from "./Video/Controls/VideoCutter"
import { VideoTimeline } from "./Video/Controls/VideoTimeline"
import { VideoPlayButton } from "./Video/Controls/VideoPlayButton"
import { VideoControls } from "./Video/Controls/VideoControls"

const Input = styled.input`
  display: block;
  margin: 30px auto;
`

export const App: FC = () => {
  const videoRef = useRef<Video>(null)
  const onVideoRef = onPartialCurrentRef(videoRef)

  const [file, setFile] = useState<File | undefined>()
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
        type="file"
        accept="video/*"
        onChange={event => {
          const { files } = event.target
          if (files !== null && files.length > 0) {
            setFile(files[0])
            setFileUrl(URL.createObjectURL(files[0]))
          }
        }}
      />

      <Video
        ref={videoRef}
        src={fileUrl}
        minTime={minTime}
        maxTime={maxTime}
        onLoaded={() => {}}
        onDuration={setDuration}
        onTime={setCurrentTime}
      />

      <p style={{ margin: "30px 0", columnCount: 2 }}>
        Current time: <strong>{currentTime}</strong> <br />
        Duration: <strong>{duration}</strong> <br />
      </p>

      <VideoControls>
        <VideoPlayButton
          isPaused={onVideoRef(({ isPaused }) => isPaused) ?? true}
          onPlay={() => onVideoRef(video => video.play())}
          onPause={() => onVideoRef(video => video.pause())}
        />
        <VideoCutter duration={duration} onMinTime={setMinTime} onMaxTime={setMaxTime}>
          <VideoTimeline duration={duration} currentTime={currentTime} onSeeking={onSeeking} onSeeked={onSeeked} />
        </VideoCutter>
      </VideoControls>

      <CliCode file={file} startTime={minTime} endTime={maxTime} />
    </>
  )
}
