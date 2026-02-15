"use client"

import { AnnotationHandler, InnerLine } from "codehike/code"
import React, { createContext, useContext, useState } from "react"

const HoverContext = createContext<{
  hover: string | null
  setHover: (v: string | null) => void
}>({ hover: null, setHover: () => {} })

export function HoverContainer(props: { children: React.ReactNode }) {
  const [hover, setHover] = useState<string | null>(null)
  return (
    <HoverContext.Provider value={{ hover, setHover }}>
      <div>{props.children}</div>
    </HoverContext.Provider>
  )
}

export function Link(props: { href?: string; children?: React.ReactNode }) {
  const { setHover } = useContext(HoverContext)
  if (props.href?.startsWith("hover:")) {
    const name = props.href.slice("hover:".length)
    return (
      <span
        className="underline decoration-dotted underline-offset-4 cursor-pointer"
        onMouseEnter={() => setHover(name)}
        onMouseLeave={() => setHover(null)}
      >
        {props.children}
      </span>
    )
  }
  return <a {...props} />
}

function HoverLine({ annotation, ...props }: any) {
  const { hover } = useContext(HoverContext)
  const lineId = annotation?.query || ""
  const dimmed = hover !== null && lineId !== hover
  return (
    <InnerLine
      merge={props}
      style={{ opacity: dimmed ? 0.3 : 1, transition: "opacity 0.2s" }}
    />
  )
}

export const hover: AnnotationHandler = {
  name: "hover",
  onlyIfAnnotated: true,
  Line: HoverLine,
}
