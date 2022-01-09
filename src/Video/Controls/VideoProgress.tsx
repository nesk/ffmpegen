import styled from "styled-components"

export interface VideoProgressProps {
  readonly currentTime: number
  readonly duration: number
}

export const VideoProgress = styled.div`
  width: 100%;
  height: 25px;
  overflow: hidden;
  user-select: none;
`

export const InnerVideoProgress = styled.div.attrs<VideoProgressProps>(({ currentTime, duration }) => ({
  style: { width: `${(currentTime / duration) * 100}%` },
}))<VideoProgressProps>`
  position: relative;
  width: 0;
  height: 100%;

  &::after {
    position: absolute;
    top: 0;
    right: -2px;
    width: 4px;
    height: 100%;
    background: #fff;
    content: "";
  }
`
