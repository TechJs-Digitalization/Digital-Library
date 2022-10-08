import React from "react";
import './Landing.css'
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

export const Landing = () => {
    return (
        <div className="Landing">
            <div className="left">
                <div className="title">
                    <h1>Welcome to Digital Library</h1>
                </div>
            
                <div className="liens">
                    <Link to='/About'>
                        <button className='button'>Learn About</button>
                    </Link>


                    <Link to='./Log'>
                        <button className='button'>Login</button>
                    </Link>
                </div>
            </div>

            <div className="right">
                <img src={'book.jpg'} alt=""/>
            </div>
        </div>
    )
}