import React from 'react'

function Comment() {
  const data = props.data
  const userId = props.userId
  console.log(props)
  return (
    <div>
      <span>{props.data} form id: {props.userId}</span>
    </div>
  )
}

export default Comment
