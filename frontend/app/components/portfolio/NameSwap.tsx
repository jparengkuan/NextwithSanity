export default function NameSwap({name, handle}: {name: string; handle?: string | null}) {
  if (!handle) return <span>{name}</span>
  return (
    <span className="name-swap" aria-hidden="true">
      <span className="name-swap__default">{name}</span>
      <span className="name-swap__alternate">{handle}</span>
    </span>
  )
}
