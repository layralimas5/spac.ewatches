import type { SVGProps } from 'react'

/**
 * Ícones inline em SVG, nenhuma biblioteca, nenhum request extra.
 * Decorativos por padrão: o rótulo acessível vem do texto ao lado.
 */
type IconProps = SVGProps<SVGSVGElement>

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export function DashboardIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 13h6V4H4zM14 20h6v-9h-6zM4 20h6v-4H4zM14 8h6V4h-6z" />
    </Icon>
  )
}

export function BoxIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M21 8.5 12 4 3 8.5v7L12 20l9-4.5z" />
      <path d="M3 8.5 12 13l9-4.5M12 13v7" />
    </Icon>
  )
}

export function CartIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 5h2l2.4 10.2a1.5 1.5 0 0 0 1.5 1.2h7.9a1.5 1.5 0 0 0 1.5-1.2L20 8H6" />
      <circle cx="9.5" cy="20" r="1.2" />
      <circle cx="17" cy="20" r="1.2" />
    </Icon>
  )
}

export function UsersIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.8 19.5a6.2 6.2 0 0 1 12.4 0M16.5 5.2a3.2 3.2 0 0 1 0 5.6M18 14.4a6.2 6.2 0 0 1 3.2 5.1" />
    </Icon>
  )
}

export function TruckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 6.5h10.5v9H3zM13.5 9.5H17l3 3v3h-6.5z" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </Icon>
  )
}

export function WalletIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18v2.5" />
      <path d="M3 7.5v9A2.5 2.5 0 0 0 5.5 19H19a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2H5.5" />
      <circle cx="16.5" cy="13.5" r="1.1" fill="currentColor" stroke="none" />
    </Icon>
  )
}

export function PlusIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 5v14M5 12h14" />
    </Icon>
  )
}

export function SearchIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </Icon>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Icon>
  )
}

export function MenuIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Icon>
  )
}

export function PencilIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17z" />
    </Icon>
  )
}

export function TrashIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13M10 11v6M14 11v6" />
    </Icon>
  )
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Icon>
  )
}

export function AlertIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 4 2.5 20h19z" />
      <path d="M12 10v4M12 17.2v.1" />
    </Icon>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </Icon>
  )
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.38a9.86 9.86 0 0 0 4.74 1.2h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2m0 1.67c2.2 0 4.27.86 5.82 2.42a8.17 8.17 0 0 1 2.42 5.82c0 4.54-3.7 8.23-8.24 8.23a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.05-.2-.31a8.17 8.17 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24m-3.6 4.1c-.17 0-.44.06-.68.31-.23.25-.9.87-.9 2.13s.92 2.47 1.05 2.64c.13.17 1.8 2.75 4.37 3.86.61.26 1.09.42 1.46.54.61.2 1.17.17 1.62.1.49-.07 1.5-.61 1.72-1.2.21-.6.21-1.1.15-1.21-.07-.1-.24-.17-.5-.3-.25-.12-1.5-.74-1.73-.82-.24-.09-.4-.13-.58.12-.17.26-.66.83-.81 1-.15.17-.3.2-.55.07-.26-.13-1.08-.4-2.06-1.27a7.7 7.7 0 0 1-1.42-1.77c-.15-.25-.02-.39.11-.51.11-.12.25-.3.38-.45.12-.15.16-.26.24-.43.09-.17.04-.32-.02-.45-.06-.12-.55-1.38-.78-1.88-.19-.42-.38-.42-.55-.43z" />
    </svg>
  )
}
