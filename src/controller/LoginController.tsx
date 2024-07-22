import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/login.css'
import { MdOutlineContactMail } from "react-icons/md";
import { RiEyeCloseFill } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import { AiFillQuestionCircle } from "react-icons/ai";


const LoginController = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const testEmail = 'test@example.com';
    const testPassword = 'password123';
    const testToken = 'dummy_token_123456';

    const imgLogo = 'https://soycayetano.pe/images/logo-upch.png';
    const imguppch = 'https://agendapais.com/wp-content/uploads/2021/02/UPCH-Parte-del-campus.jpg';

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleRememberMeChange = () => {
        setRememberMe(!rememberMe);
    };

    const showTestCredentials = () => {
        Swal.fire({
            title: 'Credenciales de Prueba',
            html: `
            <p>Correo: ${testEmail}</p>
            <p>Contraseña: ${testPassword}</p>
        `, icon: 'info',
            confirmButtonText: 'Entendido'
        });
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            Swal.fire({
                title: 'Advertencia',
                text: 'Por favor, completa todos los campos',
                icon: 'warning',
                timer: 1000,
                timerProgressBar: true,
            });
            return;
        }

        // Validar contra datos estáticos
        if (email === testEmail && password === testPassword) {
            Swal.fire({
                title: 'Inicio de Sesión Exitoso',
                text: `Bienvenido ${email}`,
                icon: 'success',
                timer: 2000,
                timerProgressBar: true,
            }).then(() => {
                localStorage.setItem('token', testToken);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userData', JSON.stringify({ correo: email }));
                localStorage.setItem('userRole', 'user');

                navigate('/home');
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Correo o contraseña incorrectos',
                icon: 'error',
                timer: 2000,
                timerProgressBar: true,
            });
        }
    };

    // Verificar si el usuario ya está autenticado al montar el componente
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            navigate('/home');
        }
    }, [navigate]);

    return (
        <div className='container-login'>
            <div className="form-box">
                <form className="formulario__login formulario-ingresar" onSubmit={onSubmit}>
                    <img className='Logo-img' src={imgLogo} alt="logo" />
                    <div className="data-notification">
                        <h2>Intranet</h2>
                        <AiFillQuestionCircle
                            onClick={showTestCredentials} />
                    </div>
                    <div className="inputbox">
                        <MdOutlineContactMail className='icon-login' />
                        <input
                            type="email"
                            id='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                        <label htmlFor="email">Correo</label>
                    </div>

                    <div className="inputbox">
                        {showPassword ? (
                            <FaEye className='icon-login' onClick={togglePasswordVisibility} />
                        ) : (
                            <RiEyeCloseFill className='icon-login' onClick={togglePasswordVisibility} />
                        )}
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            id='Contraseña'
                            onChange={(e) => setPassword(e.target.value)} />
                        <label htmlFor="Contraseña">Contraseña</label>
                    </div>
                    <div className="forget">
                        <div className="label">
                            <div className="div-chec" id='dedic'>
                                <input type="checkbox" checked={rememberMe} onChange={handleRememberMeChange} />
                                <span>Recordarme</span>
                            </div>
                            <a href="#" id='dedic'>¿Olvidaste tu Contraseña?</a>
                        </div>
                    </div>
                    <div className="div-spacing"></div>

                    <button className="button" type="submit">INGRESAR</button>
                </form>
                <div className="img-data-upch">
                    <img src={imguppch} alt="" />
                    <div className="text-optional">
                        <span>
                            Le recordamos que tambien puede utilizar el servicio de correo
                            electrónico institucional que ofrece la universidad a toda la comunidad universitaria.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default LoginController;