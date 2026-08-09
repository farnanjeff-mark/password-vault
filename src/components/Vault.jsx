import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'
import EntryForm from './EntryForm'
import EntryRow from './EntryRow'

export default function Vault({ session }) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null) // null = closed, {} = new, {...} = editing existing
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchEntries()
  }, [])

  async function fetchEntries() {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('passwords')
      .select('*')
      .order('name', { ascending: true })

    if (error) setError(error.message)
    else setEntries(data)
    setLoading(false)
  }

  async function handleSave(form) {
    setSaving(true)
    setError(null)

    if (editing && editing.id) {
      const { error } = await supabase
        .from('passwords')
        .update({
          owner: form.owner,
          name: form.name,
          password: form.password,
          notes: form.notes,
        })
        .eq('id', editing.id)
      if (error) setError(error.message)
    } else {
      const { error } = await supabase.from('passwords').insert({
        owner: form.owner,
        name: form.name,
        password: form.password,
        notes: form.notes,
        user_id: session.user.id,
      })
      if (error) setError(error.message)
    }

    setSaving(false)
    setEditing(null)
    fetchEntries()
  }

  async function handleDelete(entry) {
    if (!window.confirm(`Delete the entry for "${entry.name}"? This can't be undone.`)) return
    const { error } = await supabase.from('passwords').delete().eq('id', entry.id)
    if (error) setError(error.message)
    else setEntries((es) => es.filter((e) => e.id !== entry.id))
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return entries
    return entries.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.owner.toLowerCase().includes(q) ||
        (e.notes || '').toLowerCase().includes(q)
    )
  }, [entries, query])

  return (
    <div className="vault-screen">
      <header className="vault-header">
        <div>
          <div className="vault-mark">VAULT</div>
          <div className="vault-user">{session.user.email}</div>
        </div>
        <button className="btn-ghost" onClick={() => supabase.auth.signOut()}>
          Sign out
        </button>
      </header>

      {editing ? (
        <EntryForm
          initial={editing.id ? editing : null}
          saving={saving}
          onCancel={() => setEditing(null)}
          onSave={handleSave}
        />
      ) : (
        <>
          <div className="vault-toolbar">
            <input
              className="search"
              placeholder="Search by name, owner, or notes"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={() => setEditing({})}>Add entry</button>
          </div>

          {error && <div className="auth-message error">{error}</div>}

          {loading ? (
            <div className="empty-state">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              {entries.length === 0
                ? 'No entries yet. Add your first one.'
                : 'Nothing matches that search.'}
            </div>
          ) : (
            <div className="entry-list">
              {filtered.map((entry) => (
                <EntryRow key={entry.id} entry={entry} onEdit={setEditing} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
