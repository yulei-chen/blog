import { Pre, RawCode, highlight } from "codehike/code"
import { callout } from "./annotations/callout"
import { className } from "./classname"
import { diff } from "./diff"
export async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-dark")
  return (
    <Pre
      code={highlighted}
      handlers={[callout, className, diff]}
      className="border border-zinc-800"
    />
  )
}
