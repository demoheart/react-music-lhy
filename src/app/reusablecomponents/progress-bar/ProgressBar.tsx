import React, { Component } from 'react'
import {prefixStyle} from 'common/js/dom'
import './ProgressBar.scss'

const progressBtnWidth = 16
const transform = prefixStyle('transform')

interface ProgressBarPropType{
    percent:number,
    onProgressBarChange:Function
}

interface ProgressBarStateType{

}

class ProgressBar extends Component<ProgressBarPropType, ProgressBarStateType>{
    progressBar : React.RefObject<HTMLDivElement>;
    progress:React.RefObject<HTMLDivElement>;
    progressBtn:React.RefObject<HTMLDivElement>;
    touch:{
        initiated:boolean,
        startX:number,
        left:number
    };
    constructor(props:ProgressBarPropType){
        super(props)
        this.progressBar = React.createRef();
        this.progress = React.createRef();
        this.progressBtn = React.createRef();
        this.touch = {
            initiated:false,
            startX:0,
            left:0
        }
    }

    componentDidUpdate(){
        this.percent(this.props.percent)
    }

    progressClick = (e:any) => {
        if(!this.progressBar.current)return
        const rect = this.progressBar.current.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left
        this._offset(offsetWidth)
        // 这里当我们点击 progressBtn 的时候，e.offsetX 获取不对
        // this._offset(e.offsetX)
        this._triggerPercent()
    }

    progressTouchStart = (e:any)=> {
        if(!this.progress.current)return
        e.preventDefault();
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.progress.current.clientWidth
    }

    progressTouchMove= (e:any)=> {
        if(!this.progressBar.current)return
        e.preventDefault();
        if (!this.touch.initiated) {
            return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX
        const offsetWidth = Math.min(this.progressBar.current.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
        this._offset(offsetWidth)
    }

    progressTouchEnd= (e:any)=> {
        e.preventDefault();
        this.touch.initiated = false
        this._triggerPercent()
    }

    _triggerPercent= ()=> {
        if(!this.progressBar.current || !this.progress.current)return
        const barWidth = this.progressBar.current.clientWidth - progressBtnWidth
        const percent = this.progress.current.clientWidth / barWidth
        this.props.onProgressBarChange(percent)
    }

    _offset= (offsetWidth:number)=> {
        if(!this.progressBtn.current || !this.progress.current)return
        this.progress.current.style.width = `${offsetWidth}px`
        this.progressBtn.current.style[transform] = `translate3d(${offsetWidth}px,0,0)`
    }

    percent = (percent: number) => {
        if(!this.progressBar.current )return
        if (percent >= 0 && !this.touch.initiated) {
            const barWidth = this.progressBar.current.clientWidth - progressBtnWidth
            const offsetWidth = percent * barWidth
            this._offset(offsetWidth)
        }
    }

    render(){
        return (
            <div className="progress-bar" ref={this.progressBar} onClick={this.progressClick}>
                <div className="bar-inner">
                    <div className="progress" ref={this.progress}></div>
                    <div className="progress-btn-wrapper" ref={this.progressBtn}
                        onTouchStart={this.progressTouchStart}
                         onTouchMove={this.progressTouchMove}
                         onTouchEnd={this.progressTouchEnd}
                    >
                        <div className="progress-btn"></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProgressBar