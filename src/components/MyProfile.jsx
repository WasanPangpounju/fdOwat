// import React from 'react'
import React,{Component} from "react"
// import Com from "./com"

function myProfile({ data }) {
  return (
    <div>
        <h1>In form prfile</h1>
        <p>Name is {data.fname} {data.lname}</p>
        {/* <Com/> */}
    </div>
  )
}

export default myProfile