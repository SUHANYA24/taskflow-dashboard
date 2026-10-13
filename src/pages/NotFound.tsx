import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="empty-state card">
      <h1>404</h1>
      <p className="muted">The page you are looking for does not exist.</p>
      <Link className="primary-btn link-btn" to="/">Back to dashboard</Link>
    </div>
  )
}
