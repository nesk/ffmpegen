import { FC } from "react"
import { Editor } from "./Editor"
import { FileSelector } from "./FileSelector/FileSelector"

export const App: FC = () => (
  <FileSelector>
    {files => {
      // Generate a unique string to identify a set of files
      const fileSetIdentifier = files.map(f => `${f.name}:${f.type}:${f.size}:${f.lastModified}`).join("|")
      // Use the unique string as a key, which re-mounts the component on each file change and cleans the state.
      return <Editor key={fileSetIdentifier} files={files} />
    }}
  </FileSelector>
)
