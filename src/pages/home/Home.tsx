import React, { useEffect, useState } from 'react'
import TableUsers from '../../components/table/TableUsers'
import '../../styles/home.css';
import { IoIosArrowUp } from "react-icons/io";


export default function Home() {

  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > window.innerHeight) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <div>
      <TableUsers />
      {isVisible && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <IoIosArrowUp />
        </button>
      )}
    </div>
  )
}
