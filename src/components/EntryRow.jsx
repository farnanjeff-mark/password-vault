import { useState } from 'react'

export default function EntryRow({ entry, onEdit, onDelete }) {
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  async function copyPassword() {
    try {
      await navigator.clipboard.writeText(entry.password)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard API unavailable — silently ignore, user can reveal and copy manually.
    }
  }

  return (
    <div className="entry-row">
      <div className="entry-main">
        <div className="entry-name">{entry.name}</div>
        <div className="entry-owner">{entry.owner}</div>
      </div>

      <div className="entry-password">
        <span className="pw-text">{revealed ? entry.password : '••••••••'}</span>
        <button className="icon-btn" onClick={() => setRevealed((r) => !r)} title={revealed ? 'Hide' : 'Show'}>
          {revealed ? 'Hide' : 'Show'}
        </button>
        <button className="icon-btn" onClick={copyPassword} title="Copy password">
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {entry.notes && <div className="entry-notes">{entry.notes}</div>}

      <div className="entry-actions">
        <button className="icon-btn" onClick={() => onEdit(entry)}>
          Edit
        </button>
        <button className="icon-btn danger" onClick={() => onDelete(entry)}>
          Delete
        </button>
      </div>
    </div>
  )
}
