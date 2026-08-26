interface Props { children: React.ReactNode }
export function SectionLabel({ children }: Props) {
  return <span className="section-label">{children}</span>
}