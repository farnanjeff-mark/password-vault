import { useState, useEffect } from 'react'

const empty = { owner: '', name: '', password: '', notes: '' }

export default function EntryForm({ initial, onCancel, onSave, saving }) {
  const [form, setForm] = useState(initial || empty)

  useEffect(() => {
    setForm(initial || empty)
  }, [initial])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSave(form)
  }

  return (
    <form className="entry-form" onSubmit={handleSubmit}>
      <label htmlFor="f-owner">Owner</label>
      <input
        id="f-owner"
        required
        placeholder="e.g. Jeff"
        value={form.owner}
        onChange={(e) => update('owner', e.target.value)}
      />

      <label htmlFor="f-name">Name</label>
      <input
        id="f-name"
        required
        placeholder="e.g. Bank of Northwest MO"
        value={form.name}
        onChange={(e) => update('name', e.target.value)}
      />

      <label htmlFor="f-password">Password</label>
      <input
        id="f-password"
        required
        placeholder="Password"
        value={form.password}
        onChange={(e) => update('password', e.target.value)}
      />

      <label htmlFor="f-notes">Notes</label>
      <textarea
        id="f-notes"
        rows={3}
        placeholder="Username, security questions, anything else"
        value={form.notes}
        onChange={(e) => update('notes', e.target.value)}
      />

      <div className="entry-form-actions">
        <button type="button" className="btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save entry'}
        </button>
      </div>
    </form>
  )
}
