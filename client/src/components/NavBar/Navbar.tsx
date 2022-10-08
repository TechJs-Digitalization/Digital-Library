import React from "react";
import {Link} from "react-router-dom";
import './Navbar.css';
import { Button } from "@mui/material";

export const Navbar = () => {
    return (
        <div className="Navbar">
            <div className="left_nav">
                <div className="Logo">Digital Library</div>
            </div>

            <div className="right_nav">
                <div className="list">
                    <div id="link1" className="link">
                        <Link to='/'>
                            <button type='button' className="button">Home</button>
                        </Link>
                    </div>
                    <div id="link2" className="link">
                        <Link to='/About'>
                            <button type='button' className="button">About</button>
                        </Link>    
                    </div>
                    
                    <div id="link3" className="link">
                        <Link to='/Reg'>
                            <button type='button' className="button">Sign-in</button>        
                        </Link>
                    </div>
                    
                    <div id="link4" className="link">
                        <Link to='/Log'>
                            <button type='button' className="button">Login</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}