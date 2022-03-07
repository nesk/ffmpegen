import { useRef, useState, useEffect, FC } from "react"
import { createPortal } from "react-dom"
import styled from "styled-components"
import { encodeTimeToString } from "../../Command/Encoder/TimeEncoder"
import { useMouseMoveEvent } from "../../MouseMoveEvents"

const VideoProgress = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  user-select: none;
  box-shadow: 0 0 0 1px #000 inset;
`

interface VideoProgressCursorProps {
  readonly isSeeking: boolean
  readonly currentTime: number
  readonly duration: number
}

const StyledVideoProgressCursor = styled.div.attrs<VideoProgressCursorProps>(({ currentTime, duration }) => ({
  style: {
    left: `${(currentTime / duration) * 100}%`,
    transform: `translateX(-${(currentTime / duration) * 100}%)`,
  },
}))<VideoProgressCursorProps>`
  position: absolute;
  top: -1.5px;
  bottom: -1.5px;
  border-radius: 99px;
  width: 3px;
  background: #fff;
  z-index: 2;
`

const VideoProgressTooltip = styled.div<VideoProgressCursorProps>`
  position: fixed;
  transform: translate(-50%, calc(-100% - 10px));
  border-radius: 6px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.5);
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
  opacity: ${({ isSeeking }) => (isSeeking ? 1 : 0)};
  pointer-events: none;
`

const VideoProgressCursor: FC<VideoProgressCursorProps> = props => {
  const tooltipRoot = document.querySelector("#tooltip-root")
  const cursorRef = useRef<HTMLDivElement>(null)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  useEffect(() => {
    const handleMouseEvent = () => {
      const cursor = cursorRef.current
      if (cursor) {
        const { x, y } = cursor.getBoundingClientRect()
        setX(x)
        setY(y)
      }
    }
    document.addEventListener("mousedown", handleMouseEvent)
    document.addEventListener("mousemove", handleMouseEvent)
    return () => {
      document.removeEventListener("mousedown", handleMouseEvent)
      document.removeEventListener("mousemove", handleMouseEvent)
    }
  })
  return (
    <>
      <StyledVideoProgressCursor ref={cursorRef} {...props}>
        {null}
      </StyledVideoProgressCursor>
      {tooltipRoot && createPortal(<VideoProgressTooltip style={{ left: x, top: y }} {...props} />, tooltipRoot)}
    </>
  )
}

/**
 * Computes the current time based on the position of the cursor.
 *
 * @param element The element used as a boundary.
 * @param pageX The absolute horizontal position of the cursor on the document.
 * @param duration The duration of the video in seconds.
 */
const computeCurrentTime = (element: HTMLElement | null, pageX: number, duration: number) => {
  if (element === null) {
    console.debug("[VideoTimeline] Cannot compute current time, element is undefined.")
    return 0
  }

  // Determine the position of the cursor relative to the element.
  const { x: elementX } = element.getBoundingClientRect()
  const elementBorderWidth = parseInt(getComputedStyle(element).borderLeftWidth)
  const clientX = pageX - elementX - elementBorderWidth
  const boundedClientX = Math.min(element.clientWidth, Math.max(0, clientX))

  // A simple cross multiplication to compute the current time base on the position of the cursor.
  return (duration * boundedClientX) / element.clientWidth
}

export interface VideoTimelineProps {
  readonly currentTime: number
  readonly duration: number
  readonly minTime: number
  readonly maxTime: number
  readonly forceTooltipVisibility: boolean
  onSeeking(currentTime: number): void
  onSeeked(): void
}

export const VideoTimeline: FC<VideoTimelineProps> = ({
  currentTime,
  minTime,
  maxTime,
  duration,
  forceTooltipVisibility,
  onSeeking,
  onSeeked,
}) => {
  const elementRef = useRef<HTMLDivElement>(null)

  const [isSeeking, setIsSeeking] = useState(false)
  const [selectedTime, setSelectedTime] = useState<number | null>(null)
  const finalTime = selectedTime ?? currentTime

  // Reinitialize the selected time only when the current time is updated. This avoids the
  // progress bar to make a "jump" between the selected/current times until the video triggers
  // its `timeupdate` event and finally provides a current time (near-)equal to the selected time.
  useEffect(() => {
    if (!isSeeking) {
      setSelectedTime(null)
    }
  }, [currentTime]) // eslint-disable-line react-hooks/exhaustive-deps

  const onMouseDown = useMouseMoveEvent({
    onMove: ({ clientX }) => {
      let selectedTime = computeCurrentTime(elementRef.current, clientX, duration)
      selectedTime = Math.min(maxTime, Math.max(minTime, selectedTime))
      setSelectedTime(selectedTime)
      setIsSeeking(true)
      onSeeking(selectedTime)
    },
    onMoved: () => {
      setIsSeeking(false)
      onSeeked()
    },
  })

  return (
    <VideoProgress ref={elementRef} onMouseDown={onMouseDown}>
      <VideoProgressCursor isSeeking={isSeeking || forceTooltipVisibility} currentTime={finalTime} duration={duration}>
        {encodeTimeToString(finalTime)}
      </VideoProgressCursor>
    </VideoProgress>
  )
}
