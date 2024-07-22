import React from 'react'
import "./errorpage.css"
import img from "../../assets/images/error/img1.png"
import { Link } from 'react-router-dom'
export default function ErrorPage() {

    return (
        <div>
            <div className="container-error">
                <img src={img} alt="" className='img-error' />
                <h1>La página que ha solicitado no se encuentra disponible</h1>
                <div className="boton">
                    <Link to='/' className='back-btn'>Volver al inicio</Link>
                </div>
            </div>
        </div>
    )
}
