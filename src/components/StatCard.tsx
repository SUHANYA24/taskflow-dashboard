import type { LucideIcon } from 'lucide-react'

interface Props {
  label: string
  value: string | number
  caption: string
  icon: LucideIcon
}

export default function StatCard({ label, value, caption, icon: Icon }: Props) {
  return (
    <article className="card stat-card">
      <div className="stat-icon">
        <Icon size={20} />
      </div>
      <div>
        <p className="muted">{label}</p>
        <h3>{value}</h3>
        <span className="tiny">{caption}</span>
      </div>
    </article>
  )
}
