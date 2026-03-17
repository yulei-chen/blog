import { Block, CodeBlock, ImageBlock, parseRoot } from "codehike/blocks"
import { z } from "zod"
import {
  Selection,
  Selectable,
  SelectionProvider,
} from "codehike/utils/selection"
import Content from "./content.mdx"
import Link from "next/link"
import { Code } from "../components/code"
import Image from "next/image"

const Schema = Block.extend({
  intro: Block,
  steps: z.array(
    Block.extend({ code: CodeBlock, graph: ImageBlock.optional() }),
  ),
  outro: Block,
})

export default function Page() {
  const { intro, steps, outro } = parseRoot(Content, Schema)
  return (
    <main className="prose-grid prose prose-invert max-w-none">
      <Link href="/">Back</Link>
      <h1 className="mt-8">{intro.title}</h1>
      {intro.children}
      <SelectionProvider className="full-bleed grid grid-cols-5 gap-3 mx-auto w-[100ch] mt-6">
        <div className="col-span-3">
          <div className="top-[30vh] sticky overflow-auto">
            <Selection
              from={steps.map((step) => (
                <>
                  <Code codeblock={step.code} />
                   {step.graph && (
                    <Image
                      src={step.graph.url}
                      alt={step.graph.alt}
                      width={600}
                      height={200}
                    />
                  )}
                </>
              ))}
            />
          </div>
        </div>

        <div className="flex-1 ml-2 prose prose-invert col-span-2">
          {steps.map((step, i) => (
            <Selectable
              key={i}
              index={i}
              selectOn={["click", "scroll"]}
              className="data-[selected=true]:bg-purple-500/10 px-5 py-1 mb-24 rounded-xl"
            >
              <h2 className="mt-4 text-xl">{step.title}</h2>
              <div>{step.children}</div>
            </Selectable>
          ))}
        </div>
      </SelectionProvider>
      <h2>{outro.title}</h2>
      {outro.children}
    </main>
  )
}
