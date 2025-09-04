import { MenuItem } from "@mui/material";
import type { ReactNode } from "react";
import { NavLink } from "react-router";

export default function MenuItemList({children, to }: { children: ReactNode, to: string }) {
    return (
        <MenuItem
            component={NavLink}
            to={to}
            sx={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                color: 'inherit',
                '&.active': {
                    fontWeight: 'bolder',
                    color: 'yellow'
                }
            }}
        >
            {children}
        </MenuItem>
    )
}