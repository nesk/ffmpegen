import { useEffect, useRef, useState, FC } from "react"
import styled, { css } from "styled-components"
import { useMouseMoveEvent } from "../../MouseMoveEvents"

enum Side {
  Start,
  End,
}

const Container = styled.div`
  position: relative;
  padding: 3px 18px;
  background: #565656;
  overflow: hidden;
  grid-area: progress;
`

interface FrameProps {
  readonly startOffset: number
  readonly endOffset: number
}

const Frame = styled.div.attrs<FrameProps>(({ startOffset, endOffset }) => ({
  style: {
    left: `${Math.max(0, startOffset)}px`,
    right: `${Math.max(0, endOffset)}px`,
  },
}))<FrameProps>`
  position: absolute;
  top: 0;
  height: 100%;
  border: 3px solid #ffcc01;
  border-left-width: 18px;
  border-right-width: 18px;
  pointer-events: none;
`

interface StyledFrameHandleProps {
  readonly side: Side
}

const StyledFrameHandle = styled.div<StyledFrameHandleProps>`
  position: absolute;
  z-index: 1; // Draw the handles above the progress bar
  width: 18px;
  height: 100%;
  pointer-events: auto;
  user-select: none;

  ${({ side }) =>
    side === Side.Start
      ? css`
          left: 0;
          transform: translateX(-100%);
        `
      : css`
          right: 0;
          transform: translateX(100%);
        `}
`

interface FrameHandleProps {
  readonly side: Side
  onDragging(movementX: number): void
  onDropped(): void
}

const FrameHandle: FC<FrameHandleProps> = ({ side, onDragging, onDropped }) => {
  const onMouseDown = useMouseMoveEvent({
    onMove: ({ movementX }) => onDragging(movementX),
    onMoved: onDropped,
  })
  return <StyledFrameHandle side={side} onMouseDown={onMouseDown} />
}

export interface VideoCutterProps {
  readonly duration: number
  onMinTime(time: number): void
  onMaxTime(time: number): void
}
type Offset = { visual: number; raw: number }
type OffsetUpdater = (prevState: Offset) => Offset

export const VideoCutter: FC<VideoCutterProps> = ({ duration, children, onMinTime, onMaxTime }) => {
  const containerRef = useRef(null)
  const frameRef = useRef(null)

  // Use a combination of two values, one visual value used for display, and one raw value for input.
  // The raw value allows to properly handle the mouse movements when dragging the handles and resets
  // to the visual value once the handle is finished being moved.
  const [startOffset, setStartOffset] = useState<Offset>({ visual: 0, raw: 0 })
  const [endOffset, setEndOffset] = useState<Offset>({ visual: 0, raw: 0 })

  const setStartOffsetWithMovement = (movementX: number) => {
    setStartOffset(prevOffset => {
      const maxOffset = getMaxOffsetAvailable(containerRef.current, frameRef.current, endOffset.visual)
      let offset = { visual: prevOffset.raw + movementX, raw: prevOffset.raw + movementX }
      offset.visual = Math.max(0, offset.visual)
      offset.visual = Math.min(maxOffset, offset.visual)
      return offset
    })
  }

  const setEndOffsetWithMovement = (movementX: number) => {
    setEndOffset(prevOffset => {
      const maxOffset = getMaxOffsetAvailable(containerRef.current, frameRef.current, startOffset.visual)
      let offset = { visual: prevOffset.raw - movementX, raw: prevOffset.raw - movementX }
      offset.visual = Math.max(0, offset.visual)
      offset.visual = Math.min(maxOffset, offset.visual)
      return offset
    })
  }

  const generateRawOffsetResetter = (setState: (updater: OffsetUpdater) => void) => {
    return () => setState(({ visual }: Offset) => ({ visual, raw: visual }))
  }

  useEffect(() => {
    onMinTime(convertOffsetToTime(containerRef.current, frameRef.current, Side.Start, duration, startOffset))
  }, [startOffset, duration, onMinTime])

  useEffect(() => {
    onMaxTime(convertOffsetToTime(containerRef.current, frameRef.current, Side.End, duration, endOffset))
  }, [endOffset, duration, onMaxTime])

  return (
    <Container ref={containerRef}>
      <Frame ref={frameRef} startOffset={startOffset.visual} endOffset={endOffset.visual}>
        <FrameHandle
          side={Side.Start}
          onDragging={setStartOffsetWithMovement}
          onDropped={generateRawOffsetResetter(setStartOffset)}
        />
        <FrameHandle
          side={Side.End}
          onDragging={setEndOffsetWithMovement}
          onDropped={generateRawOffsetResetter(setEndOffset)}
        />
      </Frame>
      {children}
    </Container>
  )
}

/**
 * Computes the maximum value an offset can take to avoid overlapping over the other offset.
 */
const getMaxOffsetAvailable = (container: HTMLElement | null, frame: HTMLElement | null, otherOffset: number) => {
  if (container === null || frame === null) {
    return 0
  }

  const containerStyle = getComputedStyle(container)
  const frameStyle = getComputedStyle(frame)

  const outerWidth = parseInt(containerStyle.width)
  const width = outerWidth - parseInt(frameStyle.borderLeftWidth) - parseInt(frameStyle.borderRightWidth)

  return width - otherOffset - 5
}

const convertOffsetToTime = (
  container: HTMLElement | null,
  frame: HTMLElement | null,
  side: Side,
  duration: number,
  offset: Offset,
) => {
  if (container === null || frame === null) return 0
  const { borderLeftWidth, borderRightWidth } = getComputedStyle(frame)
  const innerFrameWidth = container.offsetWidth - parseInt(borderLeftWidth) - parseInt(borderRightWidth)

  // A simple cross multiplication to compute the current time based on the position of the handles
  const timeOffset = (duration * offset.visual) / innerFrameWidth

  return side === Side.Start ? timeOffset : duration - timeOffset
}
