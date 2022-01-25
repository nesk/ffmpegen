import { FC, useEffect, useState } from "react"
import styled from "styled-components"
import { ReactComponent as Pause } from "../../assets/pause.svg"
import { ReactComponent as Play } from "../../assets/play.svg"

const StyledPlayButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  grid-area: button;
  border: 0;
  min-width: 20px;
  height: 100%;
  padding: 6px;
  background: #565656;
  color: #fff;
  appearance: none;

  svg {
    height: 70%;
  }
`

interface VideoPlayButtonProps {
  isPaused: boolean
  onPlay(): void
  onPause(): void
}

export const VideoPlayButton: FC<VideoPlayButtonProps> = ({ onPlay, onPause, ...props }) => {
  const [isPaused, setIsPaused] = useState(true)

  // It might take some time to see the `isPaused` prop change, so keep
  // an internal state and update it when the prop is updated.
  useEffect(() => setIsPaused(props.isPaused), [props.isPaused])

  const handleClick = () => {
    isPaused ? onPlay() : onPause()
    setIsPaused(!isPaused)
  }

  return (
    <StyledPlayButton onClick={handleClick}>
      {isPaused ? <Play style={{ transform: "translateX(1px)" }} /> : <Pause />}
    </StyledPlayButton>
  )
}
