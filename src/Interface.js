import { useKeyboardControls } from "@react-three/drei"
import { addEffect } from "@react-three/fiber"
import React, { useEffect, useRef } from "react"
import useGame from "./stores/useGame.js"

import {ReactComponent as Handbreak} from './svgs/shifter.svg'

export default function Interface() 
{

    const restart = useGame((state) => state.restart)
    const phase = useGame((state) => state.phase)

    // need to update this time value continually
    // should create a reference 
    const time = useRef()

    // boost value
    const boost = useRef()

    // lap value
    const lap = useRef()

    // handbreak style and fill
    const handBreak = useRef()

    const forward = useKeyboardControls((state)=> state.forward)
    const backward = useKeyboardControls((state)=> state.backward)
    const leftward = useKeyboardControls((state)=> state.leftward)
    const rightward = useKeyboardControls((state)=> state.rightward)
    const drift = useKeyboardControls((state)=> state.drift)
    const jump = useKeyboardControls((state)=> state.jump)

    useEffect(()=>{
        // lets us tap into framerate of r3f even outside of canvas
        // get the unsubscriber
        const unsubscribeEffect = addEffect(()=> {
            // need to get current state, not state at beginning of render
            const state = useGame.getState()
            
            let elapsedTime = 0
            if(state.phase === 'playing') {
                elapsedTime = Date.now() - state.startTime
            } else if(state.phase === 'ended') {
                elapsedTime = state.endTime - state.startTime
            }
            elapsedTime /= 1000
            elapsedTime = elapsedTime.toFixed(2)

            // update text with reference
            if(time.current) time.current.textContent = elapsedTime

            // get and use boost value
            boost.current.style.width = `${state.boost * 2}px`
            // console.log(state.boost)

        })

        return () => {
            unsubscribeEffect()
        }
    }, [])

    useEffect(()=> {
        if(drift) {
            console.log(drift)
            handBreak.current.style.fill = '#e43e2899'
        } else {
            handBreak.current.style.fill = '#ffffff44'
        }
    }, [drift])

    return <div className="interface">
        {/* time */}
        <div className="time checkered" ref={time}></div>
        <div className="lap checkered" ref={lap}>
            Lap <span className='lapNum'>1</span> <span className='slash'> /</span>3
        </div>
        {/* restart */}
        { phase === 'ended' && <div className="restart" onClick={restart}>RESTART</div> }

        {/* controls */}
        <div className="shift">
                <Handbreak ref={handBreak} />
        </div>
        <div className="controls">
            <div className="raw">
                <div className={ `key ${ forward ? 'active' : ''}` }></div>
            </div>
            <div className="raw">
                <div className={ `key ${ leftward ? 'active' : ''}` }></div>
                <div className={ `key ${ backward ? 'active' : ''}` }></div>
                <div className={ `key ${ rightward ? 'active' : ''}` }></div>
            </div>        
            <div className="raw">
                <div className={`key large ${ jump ? 'active' : ''}`}></div>
            </div>
        </div>
        <div className="boostMeter">
            <div className="boostValue" ref={boost}></div>
        </div>
    </div>
}