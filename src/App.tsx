import { FC, useState } from "react"
import styled from "styled-components"
import { CliCode } from "./CliCode"
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
  const [file, setFile] = useState<File | undefined>()
  const [fileUrl, setFileUrl] = useState<string>()
  const [isPaused, setIsPaused] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [minTime, setMinTime] = useState(0)
  const [maxTime, setMaxTime] = useState(Infinity)
  const [duration, setDuration] = useState(0)
  const [wasPausedBeforeSeek, setWasPausedBeforeSeek] = useState<boolean | null>(null)

  const onMinMaxTime = (setState: React.Dispatch<React.SetStateAction<number>>) => {
    return (timeLimit: number) => {
      setState(timeLimit)
      setCurrentTime(timeLimit)
      setIsPaused(true)
    }
  }

  const onSeeking = (currentTime: number) => {
    if (wasPausedBeforeSeek === null) {
      setWasPausedBeforeSeek(isPaused)
    }
    setIsPaused(true)
    setCurrentTime(currentTime)
  }

  const onSeeked = () => {
    if (!wasPausedBeforeSeek) {
      setIsPaused(false)
    }
    setWasPausedBeforeSeek(null)
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
        src={fileUrl}
        isPaused={isPaused}
        currentTime={currentTime}
        minTime={minTime}
        maxTime={maxTime}
        onLoaded={() => {}}
        onDurationChange={setDuration}
        onTimeChange={setCurrentTime}
        onPauseChange={setIsPaused}
      />

      <VideoControls style={{ marginTop: "30px" }}>
        <VideoPlayButton isPaused={isPaused} onPlay={() => setIsPaused(false)} onPause={() => setIsPaused(true)} />
        <VideoCutter duration={duration} onMinTime={onMinMaxTime(setMinTime)} onMaxTime={onMinMaxTime(setMaxTime)}>
          <VideoTimeline
            duration={duration}
            currentTime={currentTime}
            minTime={minTime}
            maxTime={maxTime}
            onSeeking={onSeeking}
            onSeeked={onSeeked}
          />
        </VideoCutter>
      </VideoControls>

      <CliCode file={file} startTime={minTime} endTime={maxTime} />
    </>
  )
}
