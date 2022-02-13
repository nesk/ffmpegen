import { FC, useState } from "react"
import styled from "styled-components"
import { CliCode } from "./CliCode"
import { Video } from "./Video/Video"
import { VideoCutter } from "./Video/Controls/VideoCutter"
import { VideoTimeline } from "./Video/Controls/VideoTimeline"
import { VideoPlayButton } from "./Video/Controls/VideoPlayButton"
import { VideoControls } from "./Video/Controls/VideoControls"
import { useMemo } from "react"

const Layout = styled.div`
  margin: auto;
  width: 800px;
`

interface AppProps {
  files: File[]
}

export const App: FC<AppProps> = ({ files }) => {
  const fileUrl = useMemo(() => URL.createObjectURL(files[0]), [files])

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
    <Layout>
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

      <VideoControls>
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

      <CliCode file={files[0]} startTime={minTime} endTime={maxTime} />
    </Layout>
  )
}
