import React from 'react';
import { Routes, Route } from 'react-router-dom';

import SmartCarForm from './SmartCarForm' 
import App from './App'

const Main = () => {
    return (
      <Routes> 
        <Route path='/' element={<App/>}></Route>
        <Route path='/smartCar' element={<SmartCarForm/>}></Route>
      </Routes>
    );
  }
  
  export default Main;