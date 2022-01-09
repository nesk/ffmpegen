import { useRef, useState, useEffect, FC } from "react"
import { useDragDropTracking } from "../../MouseMoveEvents"
import { InnerVideoProgress, VideoProgress, VideoProgressProps } from "./VideoProgress"

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

export interface VideoTimelineProps extends VideoProgressProps {
  readonly onSeeking: (currentTime: number) => void
  readonly onSeeked: () => void
}

export const VideoTimeline: FC<VideoTimelineProps> = ({ currentTime, duration, onSeeking, onSeeked }) => {
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

  const onMouseDown = useDragDropTracking({
    onMove: ({ clientX }) => {
      const selectedTime = computeCurrentTime(elementRef.current, clientX, duration)
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
      <InnerVideoProgress currentTime={finalTime} duration={duration} />
    </VideoProgress>
  )
}