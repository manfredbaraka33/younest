import React,{useState} from 'react'
import { Link } from 'react-router-dom';

const Feedback = () => {

    const [email,setEmail]=useState("");
    const [text,setText]=useState("");
    const [note,setNote]=useState("");
    
    const handleSubmit=async (e)=>{
        e.preventDefault(); 
        try{
            const response = await fetch('http://localhost:8000/api/feedback/',
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                      },
                    body:JSON.stringify({"email":email,"text":text})
                });
    
            if(response.ok){
                setNote("Thanks for your feedback!")
            }
            else{
                setNote("Sorry, feedback sending failed!")
            }
        }catch(error){
            console.log(error);
            setNote("Sorry, something went wrong")
        }

    }


  return (
    <div className='container mt-5'>
        {/* <div className="card animated-card mt-3 p-3"> */}
        <div className="card  mt-3 p-3">
        <h5 className='text-secondary'>Add your feedback here</h5>
        <form onSubmit={handleSubmit} className="">
            <input type="email" placeholder='Enter your email address' className='form-control my-3'
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
            />
            <textarea name="text" placeholder='Speak your mind.......' className='form-control'
            value={text}
            onChange={(e)=>setText(e.target.value)}
            ></textarea>
            <button className="btn btn-dark my-3">Send feedback</button>
            {note && (
            <div className='rounded bg-info p-2 my-3'>{note} <br />
             <Link  to="/">Back to Home</Link></div>
        )}
        </form>
        </div>
    </div>
  )
}

export default Feedback