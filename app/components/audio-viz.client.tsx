"use client"

import React, { useRef, useState, useCallback } from "react"
import { useAudio, useRaf } from "rooks"

const FFT_SIZE = 32
const COLS = FFT_SIZE - 6 // 26 columns

interface AudioVizProps {
  url: string | undefined
  title: string
}

export default function AudioViz({ url, title }: AudioVizProps) {
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(
    new Uint8Array(COLS)
  )

  // 使用 useAudio hook
  const [audioRef, audioState, audioControls] = useAudio({
    playbackRate: 1,
  })

  const { isPlaying, currentTime, playbackRate } = audioState

  // 使用 useRaf 来更新频率数据
  useRaf(() => {
    if (isPlaying && analyser) {
      const dataArray = new Uint8Array(COLS)
      analyser.getByteFrequencyData(dataArray)
      setFrequencyData(dataArray)
    }
  }, isPlaying && analyser !== null)

  const currentTimeFormatted = new Date(currentTime * 1000)
    .toISOString()
    .slice(11, 19)

  const playButtonSound = useCallback(() => {
    const audioCtx = new AudioContext()
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()
    gainNode.gain.value = 0.05
    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    oscillator.type = "square"
    oscillator.start()
    setTimeout(() => {
      oscillator.stop()
    }, 50)
  }, [])

  const audioElementRef = useRef<HTMLAudioElement | null>(null)

  const initAnalyser = useCallback(() => {
    if (!audioElementRef.current) return

    const audioCtx = new AudioContext()
    const source = audioCtx.createMediaElementSource(audioElementRef.current)
    const anal = audioCtx.createAnalyser()
    anal.fftSize = FFT_SIZE * 2
    source.connect(anal)
    anal.connect(audioCtx.destination)

    setAnalyser(anal)
  }, [])

  // 合并 audioRef callback 和我们的 ref
  const combinedAudioRef = useCallback(
    (element: HTMLAudioElement | null) => {
      audioElementRef.current = element
      audioRef(element)
    },
    [audioRef]
  )

  const play = useCallback(() => {
    playButtonSound()
    audioControls.play()
    initAnalyser()
  }, [playButtonSound, audioControls, initAnalyser])

  const pause = useCallback(() => {
    playButtonSound()
    audioControls.pause()
  }, [playButtonSound, audioControls])

  const handleTimeBackward = useCallback(() => {
    audioControls.rewind(30)
  }, [audioControls])

  const handleTimeForward = useCallback(() => {
    audioControls.fastForward(30)
  }, [audioControls])

  function getUnit() {
    return (
      <>
        <div className="relative top-[15px]">'</div>
        <div className="relative top-[13px]">^</div>
        <div className="relative top-[8px]">∘</div>
        <div className="relative top-[8px]">*</div>
        <div className="relative top-[6px]">•</div>
        <div className="relative top-[3px]">:</div>
        <div className="">_</div>
      </>
    )
  }

  return (
    <div>
      <audio ref={combinedAudioRef} className="hidden" src={url} controls />

      <pre className="text leading-[0.2] grid grid-cols-[repeat(32,minmax(0,1fr))] w-[360px]">
        {Array.from(frequencyData).map((value, index) => (
          <div key={index} className="flex flex-col">
              <div className={`text-pink-500 ${value >= 200 ? "visible" : "invisible"}`}>
                {getUnit()}
              </div>
              <div className={`text-orange-400 ${value < 200 && value >= 140 ? "visible" : "invisible"}`}>
                {getUnit()}
              </div>
              <div className={`text-yellow-300 ${value < 140 && value >= 60 ? "visible" : "invisible"}`}>
                {getUnit()}
              </div>
              <div className={`text-green-400 ${value < 60 && value >= 0 ? "visible" : "invisible"}`}>
                {getUnit()}
              </div>
          </div>
        ))}
      </pre>

      <div>
        <div className="text-gray">{title}</div>

        <div className="flex items-center justify-between">
          <div className="text-gray">{currentTimeFormatted}</div>
          <button className="btn-purple" onClick={handleTimeBackward}>
            [-30s]
          </button>
          {!isPlaying ? (
            <button className="btn-green" onClick={play}>
              [play]
            </button>
          ) : (
            <button className="btn-green" onClick={pause}>
              [pause]
            </button>
          )}
          <button className="btn-purple" onClick={handleTimeForward}>
            [+30s]
          </button>
        </div>

        <div className="flex gap-1 items-center">
          <button
            className="btn-blue"
            onClick={() => audioControls.setPlaybackRate(1)}
          >
            [x1]
          </button>
          <button
            className="btn-blue"
            onClick={() => audioControls.setPlaybackRate(1.5)}
          >
            [x1.5]
          </button>
          <button
            className="btn-blue"
            onClick={() => audioControls.setPlaybackRate(2)}
          >
            [x2]
          </button>
        </div>
      </div>
    </div>
  )
}
