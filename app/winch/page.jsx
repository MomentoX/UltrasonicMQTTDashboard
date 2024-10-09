"use client"
import {useState } from "react";
// import { Loader, Message, Modal, Progress } from "rsuite";
// import { useToaster } from 'rsuite';
import mqtt from 'mqtt';

const winchPage = () => {
  const [formData , setFormData]=useState({});
  const [loading ,setLoading]=useState(false);
  
  const url = 'ws://192.168.1.5:8080/mqtt'
  const options = {
    // Clean session
    clean: true,
    connectTimeout: 4000,
    // Authentication
    clientId: 'esp32',
    username: 'esp32Client1',
    password: 'droame',
  };

  const topic = "test";

  const handleOnChange=(e)=>{
   const name = e.target.name;
   const value = e.target.value;

   setFormData((prev)=>({...prev , [name]:value}));
  }
  const handleSubmit= async(e)=>{
    e.preventDefault();
    
    const client  = mqtt.connect(url, options);
       
    client.on('connect', () => {
        console.log('Connected to MQTT broker');
        client.subscribe(topic, (err) => {
            if (err) {
                console.error(`Subscription error: ${err}`);
            }else if (!err) {
              client.publish("Subtest", formData);
            }
        });
    });

    // try {
    //   const response = await fetch(`https://7f1vhbw7f5.execute-api.ap-south-1.amazonaws.com/winchBookings` , 
    //     {
    //       method: 'POST',       
    //       headers: {
    //         'Content-Type': 'application/json', 
    //       },
    //       body: JSON.stringify(formData) 
    //     }
    //   );
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    //   }
    //   const result = await response.json();
    //   console.log("response :" , response);
    
      
    // } catch (error) {
    //   // setError(error.message);
    // } finally {
    //   setLoading(false);
    // }
  };
    console.log("formData :" , formData);
  return (
     <div>
          <div className="container mx-auto my-40 w-[50%] mmd:w-[80%] sm:w-[95%] overflow-hidden rounded-2xl bg-white shadow-lg ">
            <div className="bg-blue-800 px-10 py-10 text-center text-white">
              <p className="font-serif text-2xl font-semibold tracking-wider">Winch Booking Form</p>
              <p className="text-center text-blue-100">Please keep it short and succinct</p>
            </div>

          <form onSubmit={handleSubmit} className="space-y-4 px-8 py-10 text-black">
            <label className="block" htmlFor="name">
              <p className="text-gray-600">Name</p>
              <input className="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1" onChange={handleOnChange} name="name" type="text" placeholder="Enter your name" required/>
            </label>
            <label className="block" htmlFor="name">
              <p className="text-gray-600">Phone</p>
              <input className="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1" onChange={handleOnChange} name="phone" type="number" placeholder="Enter your Phone Number" required/>
            </label>
            <label className="block" htmlFor="name">
              <p className="text-gray-600">Pickup Point</p>
              <input className="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1" onChange={handleOnChange} name="pickup" type="text" placeholder="Enter your picup" required/>
            </label>
            <label className="block" htmlFor="name">
              <p className="text-gray-600">Drop Point</p>
              <input className="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1" onChange={handleOnChange} name="drop" type="text" placeholder="Enter your drop" required/>
            </label>
            <label className="block" htmlFor="name">
              <p className="text-gray-600">Item Name</p>
              <input className="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1" onChange={handleOnChange} name="itemName" type="text" placeholder="Enter your item name" required/>
            </label>
            <label className="block" htmlFor="name">
              <p className="text-gray-600">Item Description</p>
              <textarea className="h-32 w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1" onChange={handleOnChange} name="description" type="text" placeholder="Enter Your Item Description"></textarea>
            </label>
            <button className="mt-4 rounded-full bg-blue-800 px-10 py-2 font-semibold text-white" type="submit">Submit</button>
          </form>
      </div>

     </div>
  )
};


export default winchPage;