import styled from "styled-components"

export const VideoControls = styled.section`
  grid-area: controls;
  display: grid;
  grid-template-columns: [button-start] 36px [button-end] 1px [progress-start] 1fr [progress-end];
  grid-template-rows: [button-start progress-start] 32px [button-end progress-end];
  border-radius: 6px;
  height: 32px;
  overflow: hidden;
`
