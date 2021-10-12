import React from "react";
import Box from "@mui/material/Box";
import {SxProps} from "@mui/system";
import {Breadcrumbs, Link} from "@mui/material";

export type NavListItemProps = {
  label: string,
  href?: string,
  onClick?: (() => void)
}

const linkItemSx: SxProps = {
  color: 'primary.main',
  cursor: 'pointer'
}

const itemSx: SxProps = {
  color: 'gray'
}

const NavListItem: React.FC<NavListItemProps> = (props) => {
  const {label, href, onClick} = props
  return href
      ? <Link sx={linkItemSx} href={href} onClick={(e) => {
        if (onClick) {
          e.preventDefault()
          onClick()
        }
      }}>{label}</Link>
      : <Box sx={itemSx}>{label}</Box>
}

export type NavListProps = {
  items: NavListItemProps[]
}

const navListSx: SxProps = {
  marginBottom: 2
}

export const NavList: React.FC<NavListProps> = (props) => {
  const {items} = props
  return <Breadcrumbs sx={navListSx}>
    {items.map((item, idx) => <NavListItem key={`NavList-${idx}`} {...item}/>)}
  </Breadcrumbs>
}
