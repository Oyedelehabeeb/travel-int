import type { AccessCategory } from '#/domain/travel'

export function AccessStatus({ category, label }: { category: AccessCategory; label: string }) {
  return (
    <span className={`access-status status-${category}`}>
      <span aria-hidden="true" />
      {label}
    </span>
  )
}
