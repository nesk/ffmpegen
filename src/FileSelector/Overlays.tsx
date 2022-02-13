import { FC } from "react"
import styled, { css } from "styled-components"
import { ReactComponent as DragDropIcon } from "../assets/drag-drop.svg"
import { ReactComponent as MouseClickIcon } from "../assets/mouse-click.svg"
import { ReactComponent as ErrorIcon } from "../assets/error.svg"

/*
  Common styles
*/

const overlayStyles = css`
  position: fixed;
  top: 0px;
  left: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
`

const svgStyles = css`
  svg {
    width: 52px;
    margin-bottom: 15px;
  }
`

/*
  Tips
*/

const TipsOverlayLayout = styled.section`
  ${overlayStyles}
  ${svgStyles}
  z-index: 98;
  cursor: pointer;
`

const Separator = styled.div`
  margin: 50px 0;
  font-size: 0.9rem;
  opacity: 0.7;
`

export const TipsOverlay: FC = () => (
  <TipsOverlayLayout>
    <MouseClickIcon />
    Click to select a file on your drive
    <Separator>OR</Separator>
    <DragDropIcon />
    Drag a file and drop it here
  </TipsOverlayLayout>
)

/*
  DropZone
*/

interface DropZoneOverlayProps {
  isVisible: boolean
  isValid: boolean
}

const DropZoneOverlayLayout = styled.div<DropZoneOverlayProps>`
  ${overlayStyles}
  ${svgStyles}
  z-index: 99;
  background: rgba(0, 0, 0, 0.85);
  color: ${props => (props.isValid ? "#ffcc01" : "#eb2f1b")};
  visibility: ${props => (props.isVisible ? "visible" : "hidden")};
  pointer-events: none;

  &::before {
    position: absolute;
    top: 50px;
    right: 50px;
    bottom: 50px;
    left: 50px;
    border: 5px dashed ${props => (props.isValid ? "#ffcc01" : "#eb2f1b")};
    border-radius: 70px;
    content: "";
  }
`

export const DropZoneOverlay: FC<DropZoneOverlayProps> = ({ isVisible, isValid }) => (
  <DropZoneOverlayLayout isVisible={isVisible} isValid={isValid}>
    {isValid ? (
      <>
        <DragDropIcon />
        Drop the file to start editing
      </>
    ) : (
      <>
        <ErrorIcon />
        Only video files can be edited
      </>
    )}
  </DropZoneOverlayLayout>
)
