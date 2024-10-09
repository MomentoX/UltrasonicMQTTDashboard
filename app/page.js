'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import mqtt from 'mqtt';
import Chart from "react-apexcharts";

export default function Home() {
  const [mqttData , setMqttData]=useState();
  const [topic , setTopic]=useState('test');
  const [chartData , setChartData]=useState([{name: "series-1",data: [0]}]);
  const [chartTime  , setChartTime]=useState([]);
  const chartOptions = {chart: { id: "basic-bar"},colors: ['#FF4560'],xaxis: {categories: [...chartTime]}};
  
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

  const getCurrentTime =()=> {
    const now = new Date();
    
    // Get hours, minutes, and seconds
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // Return formatted time
    return `${hours}:${minutes}:${seconds}`;
  }
  
  useEffect(()=>{
    
     // Connect with credentials
     const client  = mqtt.connect(url, options);
       
    client.on('connect', () => {
        console.log('Connected to MQTT broker');
        client.subscribe(topic, (err) => {
            if (err) {
                console.error(`Subscription error: ${err}`);
            }else if (!err) {
              client.publish("Subtest", "Hello mqtt");
            }
        });
    });

    client.on('message', (topic, message) => {
        // Handle the message
        console.log(`Received message on ${topic}: ${message.toString()}`);
        let m = message.toString();
        setChartData((prev)=>[{name: "series-1" , data:[...prev[0]?.data , parseFloat(m)]}]);
        setChartTime((prev)=>([...prev , getCurrentTime()]));
        if(chartTime?.length > 20){
          setChartTime([]);
          setChartData([{name:"series-1" , data:[]}]);
        }
        // setMessage(message.toString());
    });

    return () => {
        client.end();
    };

  },[]);
  
  if(chartTime?.length > 20){
    setChartData((prev)=>[{name: "series-1" , data:[]}]);
    setChartTime((prev)=>([]));
  };

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <p className="text-6xl font-bold">UltraSonic Sensor Dashboard</p>
       <h1>Distance : <span className="font-extrabold font-mono text-xl">{chartData[0]?.data[chartData[0]?.data.length -1]}</span> cm</h1> 

       <div className="w-[90vw] grid grid-cols-2 gap-4">
       <Chart
              options={chartOptions}
              series={chartData}
              type="line"
              width="100%"
            />
          <Chart
              options={chartOptions}
              series={chartData}
              type="bar"
              width="100%"
            />
              <Chart
              options={chartOptions}
              series={chartData}
              type="radar"
              width="100%"
            />
              <Chart
              options={chartOptions}
              series={chartData}
              type="scatter"
              width="100%"
            />
       </div>
    </div>
  );
}
