import React, { useState } from 'react';
import {Box, TextField, Button, Typography} from "@mui/material";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {  

  const history = useNavigate();

  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: ""
  });  

  const handleChange = (e) => {
    setInputs((prev) => ({
        ...prev,
        [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest().then(()=>history("/login"));
  };


  const sendRequest = async () => {
    const res = await axios.post('http://localhost:5000/api/signup', {
        name: inputs.name,
        email: inputs.email,
        password: inputs.password
    }).catch(err=>console.log(err));

    const data = await res.data;
    return data;
  };
  return (
    <div>
        
        <form action="" onSubmit={handleSubmit}>
            <Box marginLeft="auto" marginRight="auto" width={300} display="flex" flexDirection={'column'} justifyContent="center" textAlign="center">
                <Typography variant='h2'>Signup</Typography>
                <TextField 
                    name='name' 
                    onChange={handleChange} 
                    value={inputs.name} 
                    variant='outlined' 
                    placeholder='Name' 
                    margin="normal" 
                />
                <TextField 
                    name='email' 
                    onChange={handleChange} 
                    type={'email'} 
                    value={inputs.email} 
                    variant='outlined' 
                    placeholder='Email' 
                    margin="normal" 
                />
                <TextField 
                    name='password' 
                    onChange={handleChange} 
                    type={'password'} 
                    value={inputs.password} 
                    variant='outlined' 
                    placeholder='Password' 
                    margin="normal" 
                />
                <Button variant='contained' type="submit">Submit</Button>
                
            </Box>
        </form>
    </div>
  )
}

export default Signup