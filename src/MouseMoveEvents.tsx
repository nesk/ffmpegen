import { useState, useEffect } from "react"

interface MouseMoveEventHandlers {
  onMove(event: MouseMoveEvent): void
  onMoved(): void
}

interface MouseMoveEvent {
  clientX: number
  clientY: number
  movementX: number
  movementY: number
  pageX: number
  pageY: number
}

type MouseDownEventHandler = React.MouseEventHandler

/**
 * Eases tracking of active mouse movements on a HTML element.
 *
 * @returns A event handler to bind to the `mousedown` event of the component you want to track.
 */
export const useMouseMoveEvent = ({ onMove, onMoved }: MouseMoveEventHandlers): MouseDownEventHandler => {
  const [isMoving, setIsMoving] = useState(false)

  /*
    Declare event handlers
  */

  // Local event handler, applied on the element.
  const onMouseDown = (event: React.MouseEvent) => {
    if (isMoving) {
      console.debug("[useMouseMoveEvent] Mouse down event ignored, already moving.")
      return
    }

    setIsMoving(true)
    onMove(convertMouseEvent(event))
  }

  // Global event handler, applied on the document.
  const onMouseMove = (event: MouseEvent) => {
    if (!isMoving) {
      return
    }

    onMove(convertMouseEvent(event))
  }

  // Global event handler, applied on the document.
  const onMouseUp = (event: MouseEvent) => {
    if (!isMoving) {
      return
    }

    setIsMoving(false)
    onMove(convertMouseEvent(event))
    onMoved()
  }

  /*
    Register event handlers
  */

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)

    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
    }
  })

  return onMouseDown
}

const convertMouseEvent = ({
  clientX,
  clientY,
  movementX,
  movementY,
  pageX,
  pageY,
}: React.MouseEvent | MouseEvent) => ({
  clientX,
  clientY,
  movementX,
  movementY,
  pageX,
  pageY,
})
