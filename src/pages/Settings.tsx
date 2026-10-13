import { useEffect, useState } from 'react'
import { saveProfile } from '../services/profileService'

interface Props {
  profileName: string
  profileEmail: string
  onProfileUpdated: (name: string) => void
}

export default function Settings({
  profileName,
  profileEmail,
  onProfileUpdated,
}: Props) {
  const [fullName, setFullName] =
    useState(profileName)

  const [saving, setSaving] =
    useState(false)

  const [message, setMessage] =
    useState('')

  useEffect(() => {
    setFullName(profileName)
  }, [profileName])

  const handleSave = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault()

    if (!fullName.trim()) {
      setMessage(
        'Please enter your name.',
      )
      return
    }

    try {
      setSaving(true)
      setMessage('')

      const savedProfile =
        await saveProfile(
          fullName.trim(),
        )

      const newName =
        savedProfile.full_name ?? ''

      setFullName(newName)

      onProfileUpdated(newName)

      setMessage(
        'Profile updated successfully.',
      )
    } catch (error) {
      console.error(
        'Failed to save profile:',
        error,
      )

      setMessage(
        'Could not update profile.',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <section className="page-heading">
        <div>
          <p className="eyebrow">
            ACCOUNT SETTINGS
          </p>

          <h1>Profile</h1>

          <p className="muted">
            Update your personal information.
          </p>
        </div>
      </section>

      <section className="card settings-card">
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>
              Full name
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(e) =>
                setFullName(
                  e.target.value,
                )
              }
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>
              Email
            </label>

            <input
              type="email"
              value={profileEmail}
              disabled
            />

            <span className="tiny">
              Email is managed by your login account.
            </span>
          </div>

          {message && (
            <div className="auth-message">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="primary-btn"
            disabled={saving}
          >
            {saving
              ? 'Saving...'
              : 'Save changes'}
          </button>
        </form>
      </section>
    </div>
  )
}