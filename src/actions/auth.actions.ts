"use server"

import {prisma} from "@/db/prisma";
import bcrypt from "bcryptjs";
import { logEvent } from "@/utils/sentry";
import {signAuthToken, setAuthCookie, removeAuthCookie} from "@/lib/auth"

// Register a new user


type ResponseResult = {
  success: boolean;
  message: string;
}


export async function registerUser(prevState: ResponseResult, formData: FormData): Promise<ResponseResult>{

  try {
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
  
    if(!name || !email || !password){
      logEvent('validation error: missing register fields', 'auth', {name, email}, 'warning');
      return {success:false, message:"all fields are required"}
    }
    // check if user exist

    const existingUser = await prisma.user.findUnique({
      where:{email}
    });

    if(existingUser){
      logEvent(`Registration failed: user already exist - ${email}`, "auth", {email}, "warning");
      return {success:false, message:"User already exists"}
    }

    // hash the password
    const hashedPassword =  await bcrypt.hash(password, 10);

    // create user
    const user = await prisma.user.create({
      data:{
        name,
        email,
        password: hashedPassword,
      }
    })

    // sign in setauth token

    const token = await signAuthToken({userId: user.id})
    await setAuthCookie(token);

    logEvent(`user registered successfully-${email}`, 'auth', {userId: user.id, email}, "info");
    return {success:true, message:"Registration successful"}

  } catch (error) {
    logEvent('unexpected error during registration', 'auth', {}, "error", error)
    return {success:false, message:"something went wrong"}
  }
}


// log user out and remove the authcookie

export async function logoutUser(): Promise<{
  success:boolean,
  message:string
}>{

  try {
    await removeAuthCookie();

    logEvent("user logged out successfully", "auth", {}, 'info');

    return {
      success:true,
      message:"Logout successful"
    }
    
  } catch (error) {
    logEvent("error dring logout", 'auth', {}, 'error', error);

    return {
      success: false,
      message:"Logout failed. please try again"
    }
    
  }

}

// log the user in

export async function loginUser(prevState:ResponseResult, formData:FormData): Promise<ResponseResult>{

  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if(!email || !password){
      logEvent("Validation error: missing fields", 'auth', {email}, 'warning');
      return { success: false, message:"Email and password are mandatory!!"}
    }

    const user = await prisma.user.findUnique({
      where:{email}
    })

    if(!user || !user.password){
      logEvent(`login failed : user not found - ${email}`, 'auth', {email}, "warning");

      return {success: false, message:"Invalid email or password"}
    }

    const isMatch  = await bcrypt.compare(password, user.password);
    if(!isMatch){
      logEvent(`login failed :Incorrect password`, 'auth', {email}, "warning");
      return {success: false, message:"Invalid email or password"};

    }

    const token = await signAuthToken({userId: user.id});
    await setAuthCookie(token);

    return {success:true, message:"login successful"};
    
  } catch (error) {
    logEvent("Unexpected error during login",'auth',{},'error', error);
    return {success:false, message:"Login Error"}
    
  }
}
