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
  display: grid;
  grid-template-columns: [video-start] auto [controls-start] 700px [controls-end] auto [video-end cli-start] 450px [cli-end];
  grid-template-rows: [cli-start] 30px auto [video-start] auto [video-end] 50px [controls-start] auto [controls-end] auto 30px [cli-end];
  width: 100vw;
  height: 100vh;
`

interface EditorProps {
  files: File[]
}

export const Editor: FC<EditorProps> = ({ files }) => {
  const fileUrl = useMemo(() => URL.createObjectURL(files[0]), [files])

  const [isPaused, setIsPaused] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [minTime, setMinTime] = useState(0)
  const [maxTime, setMaxTime] = useState(Infinity)
  const [duration, setDuration] = useState(0)
  const [isCutting, setIsCutting] = useState(false)
  const [wasPausedBeforeSeek, setWasPausedBeforeSeek] = useState<boolean | null>(null)

  const onMinMaxTime = (setState: React.Dispatch<React.SetStateAction<number>>) => {
    return (timeLimit: number) => {
      setState(timeLimit)
      setCurrentTime(timeLimit)
      setIsCutting(true)
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
        onDurationChange={duration => {
          setDuration(duration)
          setMaxTime(duration)
        }}
        onTimeChange={setCurrentTime}
        onPauseChange={setIsPaused}
      />

      <VideoControls>
        <VideoPlayButton isPaused={isPaused} onPlay={() => setIsPaused(false)} onPause={() => setIsPaused(true)} />
        <VideoCutter
          duration={duration}
          onMinSeeking={onMinMaxTime(setMinTime)}
          onMaxSeeking={onMinMaxTime(setMaxTime)}
          onSeeked={() => setIsCutting(false)}
        >
          <VideoTimeline
            duration={duration}
            currentTime={currentTime}
            minTime={minTime}
            maxTime={maxTime}
            forceTooltipVisibility={isCutting}
            onSeeking={onSeeking}
            onSeeked={onSeeked}
          />
        </VideoCutter>
      </VideoControls>

      <CliCode file={files[0]} startTime={minTime} endTime={maxTime} />
    </Layout>
  )
}
