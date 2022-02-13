import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import { App } from "./App"
import { FileSelector } from "./FileSelector/FileSelector"

ReactDOM.render(
  <React.StrictMode>
    <FileSelector>
      {files => {
        // Generate a unique string to identify a set of files
        const fileSetIdentifier = files.map(f => `${f.name}:${f.type}:${f.size}:${f.lastModified}`).join("|")
        // Use the unique string as a key, which re-mounts the component on each file change and cleans the state.
        return <App key={fileSetIdentifier} files={files} />
      }}
    </FileSelector>
  </React.StrictMode>,
  document.getElementById("root"),
)
