"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import {
  NameType,
  Payload,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent"

import { cn } from "@/lib/utils"

interface ChartConfig {
  [key: string]: {
    label?: string
    theme?: {
      light?: string
      dark?: string
    }
    color?: string
    icon?: React.ComponentType
  }
}

const THEMES = {
  light: "",
  dark: ".dark",
} as const

interface ChartContext {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContext | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a ChartProvider")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    config: ChartConfig
  }
>(({ children, config, className, ...props }, ref) => {
  const chartId = React.useId()
  const validChild = React.Children.toArray(children).find(
    child => React.isValidElement(child)
  ) as React.ReactElement | undefined

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
          {validChild || <div>No valid chart element found</div>}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "ChartContainer"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: colorConfig
          .map(([key, config]) => {
            if (config.theme) {
              return Object.entries(config.theme)
                .map(([theme, color]) => {
                  return `${THEMES[theme as keyof typeof THEMES]} .${id}-${key} { color: ${color}; fill: ${color}; }`
                })
                .join("\n")
            }
            return `.${id}-${key} { color: ${config.color}; fill: ${config.color}; }`
          })
          .join("\n"),
      }}
    />
  )
}

export { ChartContainer, useChart }
