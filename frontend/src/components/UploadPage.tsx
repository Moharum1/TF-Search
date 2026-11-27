import { useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from 'react'
import { insertDocument } from '../api/searchApi'

interface UploadPageProps {
  onSuccessBurst: (x: number, y: number) => void
  onGoToSearch: () => void
}

export function UploadPage({ onSuccessBurst, onGoToSearch }: UploadPageProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const submitBtnRef = useRef<HTMLButtonElement | null>(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const loadTxtFile = async (file: File) => {
    setError(null)
    setSuccessMessage(null)

    if (!file.name.toLowerCase().endsWith('.txt')) {
      setError('Only .txt files are accepted for indexing.')
      return
    }

    try {
      const text = await file.text()
      if (!text.trim()) {
        setError('The selected .txt file is empty.')
        return
      }

      const defaultTitle = file.name.replace(/\.txt$/i, '')
      setFileName(file.name)
      setTitle(defaultTitle)
      setContent(text)
    } catch {
      setError('Could not read the selected file.')
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      void loadTxtFile(file)
    }
    e.target.value = ''
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      void loadTxtFile(file)
    }
  }

  const handleClearFile = () => {
    setFileName(null)
    setTitle('')
    setContent('')
    setError(null)
    setSuccessMessage(null)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setError('Please provide a document title.')
      return
    }
    if (!content.trim()) {
      setError('Please select a non-empty .txt file to index.')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await insertDocument(trimmedTitle, content)
      setSuccessMessage(result.message ?? `Indexed "${trimmedTitle}" successfully.`)

      const rect = submitBtnRef.current?.getBoundingClientRect()
      if (rect) {
        onSuccessBurst(rect.left + rect.width / 2, rect.top + rect.height / 2)
      }

      setFileName(null)
      setTitle('')
      setContent('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to index document.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

  return (
    <main className="stage upload-stage">
      <div className="upload-header">
        <h1 className="brand-title">INSCRIBE</h1>
        <p className="brand-subtitle">Add a new .txt manuscript to the TF-IDF index</p>
      </div>

      <section className="upload-card">
        <form className="upload-form" onSubmit={handleSubmit}>
          <div
            className={`dropzone${isDragging ? ' dragging' : ''}${fileName ? ' has-file' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                fileInputRef.current?.click()
              }
            }}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,text/plain"
              className="sr-only"
              onChange={handleFileChange}
            />
            <span className="dropzone-rune">✦</span>
            {fileName ? (
              <>
                <p className="dropzone-title">{fileName}</p>
                <p className="dropzone-hint">
                  {wordCount.toLocaleString()} words · {content.length.toLocaleString()} characters ·
                  Click or drop another .txt file to replace
                </p>
              </>
            ) : (
              <>
                <p className="dropzone-title">Drop a .txt file here, or click to browse</p>
                <p className="dropzone-hint">Accepted format: Plain Text (.txt) only</p>
              </>
            )}
          </div>

          <div className="field-group">
            <label htmlFor="doc-title" className="field-label">
              Document Title
            </label>
            <input
              id="doc-title"
              type="text"
              className="text-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title stored in the search index…"
              disabled={isSubmitting}
            />
          </div>

          {content && (
            <div className="field-group">
              <div className="preview-header">
                <span className="field-label">Content Preview</span>
                <button
                  type="button"
                  className="link-btn"
                  onClick={handleClearFile}
                  disabled={isSubmitting}
                >
                  Clear file
                </button>
              </div>
              <pre className="content-preview">
                {content.length > 800 ? `${content.slice(0, 800)}…` : content}
              </pre>
            </div>
          )}

          {error && (
            <div className="results-state results-error" role="alert">
              <p>{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="results-state results-success" role="status">
              <p>{successMessage}</p>
              <button type="button" className="link-btn" onClick={onGoToSearch}>
                Search indexed documents →
              </button>
            </div>
          )}

          <div className="upload-actions">
            <button
              ref={submitBtnRef}
              type="submit"
              className="cast-btn upload-submit"
              disabled={isSubmitting || !content}
            >
              {isSubmitting ? 'Indexing…' : 'Index Document'}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}
