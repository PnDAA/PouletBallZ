import { Box, AppBar, Toolbar, Typography, Avatar, Tooltip, Menu, MenuItem } from '@mui/material';
import React from 'react';
import AuthenticationService from "./authenticationService";

export default class Topbar extends React.Component {
    public anchorElement:Element | undefined;

    public handleCloseUserMenu() {
        this.anchorElement = undefined;
        this.setState({menuOpen:false})
    }

    public handleOpenUserMenu(element: Element | undefined) {
        this.anchorElement = element;
        this.setState({menuOpen:true})
    }

    public logout() {
        AuthenticationService.disconnect();
    }

    render() {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            {AuthenticationService.getPseudo()}
                        </Typography>
                        <Tooltip title="Open settings">
                            <Avatar
                                alt="profile avatar"
                                src={AuthenticationService.getProfilePicture()}
                                sx={{ width: 56, height: 56 }}
                                style={{cursor: "pointer"}}
                                onClick={(event) => this.handleOpenUserMenu(event.currentTarget)}
                            />
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={this.anchorElement}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(this.anchorElement)}
                            onClose={() => this.handleCloseUserMenu()}
                        >
                            <MenuItem onClick={() => this.logout()}>
                                <Typography textAlign="center">Déconnexion</Typography>
                            </MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
            </Box>
        );
    }
}
