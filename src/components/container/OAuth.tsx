import React from 'react'
import Button from './Button'
import { app } from '@/firebase'
import { GoogleAuthProvider, signInWithPopup,getAuth } from 'firebase/auth';

const handleGoogleClick= async ()=>{
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({prompt: 'select_account'});
    try {
        const resultsFromGoogle = await signInWithPopup(auth,provider);
        console.log(resultsFromGoogle);
    } catch (error) {
        console.log(error);
    }
}

function OAuth() {
  return (
    <Button onClick={handleGoogleClick} className=' w-full p-2 rounded font-bold text-slate-200 text-2xl mt-10' type='button'>Google</Button>
  )
}

export default OAuth