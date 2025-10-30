import React from 'react'

function MyButton() {

    function handClick(){
        alert("you click me");
    }
  return (
    <button onClick={handClick}>MyButton</button>
  )
}

export default MyButton