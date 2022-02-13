import { useEffect } from "react"
import { FC, ReactNode, useRef, useState } from "react"
import { DropZoneOverlay, TipsOverlay } from "./Overlays"

/*
  File helpers
*/

const isValidItem = (item: DataTransferItem | File) => item.type.startsWith("video/")
const containsValidFiles = (items: Iterable<DataTransferItem | File>) => [...items].some(isValidItem)
const getValidFiles = (items: Iterable<DataTransferItem | File>) =>
  [...items]
    .filter(isValidItem)
    .map(item => (item instanceof DataTransferItem ? item.getAsFile() : item))
    .filter((item): item is File => item !== null)

/*
  FileSelector component
*/

interface FileSelectorProps {
  children: (files: File[]) => ReactNode
}

export const FileSelector: FC<FileSelectorProps> = ({ children }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDropZoneVisible, setIsDropZoneVisible] = useState(false)
  const [dataHasValidTypes, setDataHasValidTypes] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  /*
    Event handlers
  */

  const handleClick = () => selectedFiles.length === 0 && inputRef.current && inputRef.current.click()
  const handleInputChange = () => {
    if (!inputRef.current) return
    const files = inputRef.current.files ?? []
    setSelectedFiles(getValidFiles(files))
  }

  const handleDragEnter = (e: DragEvent) => {
    setDataHasValidTypes(containsValidFiles(e.dataTransfer?.items ?? []))
    setIsDropZoneVisible(true)
  }
  const handleDragOver = (e: DragEvent) => e.preventDefault()
  const handleDragLeave = (e: DragEvent) => {
    if ((e.currentTarget as HTMLElement).contains(e.relatedTarget as HTMLElement)) return
    setIsDropZoneVisible(false)
  }
  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDropZoneVisible(false)
    setSelectedFiles(getValidFiles(e.dataTransfer?.items ?? []))
  }

  /*
    Register events
  */

  useEffect(() => {
    document.addEventListener("click", handleClick)
    document.addEventListener("dragenter", handleDragEnter)
    document.addEventListener("dragover", handleDragOver)
    document.addEventListener("dragleave", handleDragLeave)
    document.addEventListener("drop", handleDrop)

    return () => {
      document.removeEventListener("click", handleClick)
      document.removeEventListener("dragenter", handleDragEnter)
      document.removeEventListener("dragover", handleDragOver)
      document.removeEventListener("dragleave", handleDragLeave)
      document.removeEventListener("drop", handleDrop)
    }
  })

  /*
    Render
  */

  return (
    <>
      <DropZoneOverlay isVisible={isDropZoneVisible} isValid={dataHasValidTypes} />
      <input ref={inputRef} type="file" accept="video/*" style={{ display: "none" }} onChange={handleInputChange} />
      {selectedFiles.length > 0 ? children(selectedFiles) : <TipsOverlay />}
    </>
  )
}
