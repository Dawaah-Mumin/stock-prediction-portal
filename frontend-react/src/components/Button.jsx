import React from 'react'
import { Link } from 'react-router-dom'

const Button = (props) => {
  const handleClick = (e) => {
    if (props.onClick) {
      e.preventDefault();
      props.onClick();
    }
  }

  return (
    <>
        <Link className={`btn ${props.class}`} to={props.url} onClick={handleClick}>
          {props.text}
        </Link> 
    </>
  )
}

export default Button