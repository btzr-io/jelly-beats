import React from 'react'
import Button from '@/components/button'
import { DOWNLOAD as iconDownload, DELETE as iconDelete } from '@/constants/icons'

const DownloadButton = ({ isDownloaded, onClick }) => (
  <Button
    size="large"
    type="table-action"
    icon={isDownloaded ? iconDelete : iconDownload}
    toggle={isDownloaded}
    onClick={onClick}
  />
)

export default DownloadButton
