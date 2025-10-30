import React from 'react'

const Post = (props) => {
    const myId = props.myId
    const content = props.children
    console.log(props)
    return(
        <div>
            <h1>ผู้ {props.myId}</h1>
            <p>comment:</p>
            <p>{props.content}</p>
        </div>
    )
}

export default Post