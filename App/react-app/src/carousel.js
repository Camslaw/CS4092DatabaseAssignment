import React from 'react'
import './carousel.css' // added later
import './'
import {useState} from 'react'
import {useEffect} from 'react'


const Carousel = (props) => {
    const {children} = props
    const [currentIndex, setCurrentIndex] = useState(0)
    const [length, setLength] = useState(children.length)

    // Set the length to match current children from props
    useEffect(() => {
         setLength(children.length)
    }, [children])

    const next = () => {
        if (currentIndex < (length - 1)) {
            setCurrentIndex(prevState => prevState + 1)
        }
    }
    
    const prev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prevState => prevState - 1)
        }
    }
    
    return(
        <div className="csl-container">
            <div className="csl-wrapper">
               { currentIndex > 0 &&
                    <button onClick={prev} className="left-arrow">
                        &lt;
                    </button> 
                }
                <div className="csl-content_wrapper">
                    <div className="csl-content"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {children}
                    </div>
                </div>
                { currentIndex < (length-1) &&
                    <button onClick={next} className="right-arrow">
                        &gt;
                    </button>
                }
            </div>
        </div>
    )
}

export default Carousel