import React from 'react';
import { Landing } from './components/Landing/Landing';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { Books} from './components/Books/Books';
import { Header } from './components/Header/Header';
import { Log } from './components/Log/Log';
import { Reg } from './components/Reg/Reg';
import { Book } from './type';

const books : Array<Book> = [
  { title: "Alice au pays des merveilles", author: "Rakoto", categorie : "Roman" },
  { title: "Typescript", author: "Tolotsa", categorie : "Friction" }
]

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
      <Header></Header>
        <Routes>
          <Route 
            path='/' element={<Landing/>}>

          </Route>

          <Route
            path='/Reg'
            element={<Reg></Reg>}
          >

          </Route>

          <Route
          path='/Log' element={<Log/>}
          >

          </Route>

          <Route
          path='/Books' element={
              <Books Book={books[0]}></Books>}
          >
          </Route>
          
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
