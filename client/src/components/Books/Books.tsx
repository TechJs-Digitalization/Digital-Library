import React from "react";
import './Books.css';
import { Book } from '../../type';

interface BooksProps{
    Book : {
        title : string
        author : string
        categorie : string
    }
}

export const Books:React.FC<BooksProps> = ({ Book }) => {
    return (
        <div className="books-container">
            <div className="search">
                <input id="search" type="text" placeholder="Search for books"/>
                <button type="submit">Search</button>
            </div>

            <div className="container">
                <div className="cards">
                    <div className="card">
                        <div className="image"></div>
                        <div className="description">
                            <h3>Title : {Book.title}</h3>
                            <h3>Author : {Book.author}</h3>
                            <h3>Categories : {Book.categorie}</h3>
                        </div>
                    </div>

                    <div className="card">
                        <div className="image"></div>
                        <div className="description">
                            <h3>Title : {Book.title}</h3>
                            <h3>Author : {Book.author}</h3>
                            <h3>Categories : {Book.categorie}</h3>
                        </div>
                    </div>

                    <div className="card">
                        <div className="image"></div>
                        <div className="description">
                            <h3>Title :</h3>
                            <h3>Author :</h3>
                            <h3>Categories :</h3>
                        </div>
                    </div>

                    <div className="card">
                        <div className="image"></div>
                        <div className="description">
                            <h3>Title :</h3>
                            <h3>Author :</h3>
                            <h3>Categories :</h3>
                        </div>
                    </div>

                    <div className="card">
                        <div className="image"></div>
                        <div className="description">
                            <h3>Title :</h3>
                            <h3>Author :</h3>
                            <h3>Categories :</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}