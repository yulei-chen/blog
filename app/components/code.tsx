import { Pre, RawCode, highlight } from "codehike/code"
import { callout } from "./annotations/callout"
import { tokenTransitions } from "./annotations/token-transitions"
export async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-dark")
  return (
    <Pre
      code={highlighted}
      handlers={[callout, tokenTransitions]}
      className="border border-zinc-800"
    />
  )
}
