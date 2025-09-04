import { Group } from "@mui/icons-material";
import { AppBar, Box, Toolbar, Typography, Container, MenuItem } from "@mui/material";
import { NavLink } from "react-router";
import MenuItemList from "../shared/components/MenuItemList";


export default function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static" sx={{
          backgroundImage: 'linear-gradient(135deg, #182a73 0%, #218aae 69%, #20a7ac 89%)'
        }}>

        <Container maxWidth="xl">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <MenuItem component={NavLink} to='/' sx={{ display: 'flex', gap: 2 }}>
                <Group fontSize="large" />
                <Typography variant="h4" fontWeight="bold"> Reactivities </Typography>
              </MenuItem>
            </Box>

            <Box sx={{ display: 'flex' }}>
              <MenuItemList to='/activities'>
                Activities
              </MenuItemList>
              <MenuItemList to='/createActivity'>
                Create Activity
              </MenuItemList>
            </Box>
            <MenuItem>
              UserMenu 
            </MenuItem>
          </Toolbar>
        </Container>

      </AppBar>
    </Box>
  )
}
