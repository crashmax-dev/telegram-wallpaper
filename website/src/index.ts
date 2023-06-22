import merge from 'lodash.merge'
import { TWallpaper } from 'twallpaper'
import { Pane } from 'tweakpane'
import { arrayColorToObject, COLORS, generateRandomColors } from './colors.js'
import { paneOptions, wallpaperOptions } from './config.js'
import { PATTERN_SIZE, PATTERNS } from './patterns.js'
import type { InputBindingApi, ListApi } from 'tweakpane'
import 'twallpaper/css'

const wallpaper = new TWallpaper(paneOptions.container, wallpaperOptions)
wallpaper.init()

const tweakpane = new Pane({
  document,
  expanded: true,
  title: document.title
})

tweakpane.on('change', () => refreshPaneConsole())

function refreshPaneConsole() {
  paneOptions.stringOptions = JSON.stringify(wallpaperOptions, null, 2)
  consoleButtonCopy.title = 'Copy'
  consolePane.refresh()
}

tweakpane
  .addInput(wallpaperOptions, 'fps', {
    min: 1,
    max: 360,
    step: 1
  })
  .on('change', ({ value }) => {
    wallpaper.updateFrametime(value)
  })

tweakpane
  .addInput(wallpaperOptions, 'tails', {
    min: 5,
    max: 90,
    step: 1
  })
  .on('change', ({ value }) => {
    wallpaper.updateTails(value)
  })

const toggleAnimate = tweakpane
  .addInput(wallpaperOptions, 'animate')
  .on('change', ({ value }) => {
    wallpaper.animate(value)
  })

tweakpane
  .addInput(wallpaperOptions, 'scrollAnimate')
  .on('change', ({ value }) => {
    wallpaper.scrollAnimate(value)
  })

tweakpane.addButton({ title: 'Next position' }).on('click', () => {
  wallpaperOptions.animate = false
  toggleAnimate.disabled = true
  toggleAnimate.refresh()
  wallpaper.animate(false)
  wallpaper.toNextPosition(() => {
    toggleAnimate.disabled = false
  })
})

/** color */
const colorsInput: InputBindingApi<unknown, string>[] = []

const colorsFolder = tweakpane.addFolder({
  title: 'Color'
})

const colorsList = colorsFolder.addBlade({
  view: 'list',
  label: 'colors',
  value: 0,
  options: COLORS.map(({ text }, key) => {
    return {
      text,
      value: key
    }
  })
}) as ListApi<number>

colorsFolder.addButton({ title: 'Random colors' }).on('click', () => {
  const colors = generateRandomColors()
  updateColors(colors)
})

colorsList.on('change', ({ value }) => {
  const { colors } = COLORS[value]
  updateColors(colors)
})

function updateColors(colors: string[]): void {
  wallpaperOptions.colors = colors
  wallpaper.updateColors(colors)

  if (!wallpaperOptions.animate) {
    wallpaperOptions.animate = true
    toggleAnimate.refresh()
  }

  paneOptions.currentColors = arrayColorToObject(colors)
  generateColorsInput()
}

function generateColorsInput(): void {
  const inputs = paneOptions.currentColors.map((color, key) => {
    const input = colorsFolder.addInput(color, key, {
      label: `color ${key + 1}`
    })

    input.on('change', ({ value }) => {
      color[key] = value
      wallpaperOptions.colors = paneOptions.currentColors.map(
        (color, key) => color[key]
      )
      wallpaper.updateColors(wallpaperOptions.colors)
    })

    input.controller_.view.labelElement.remove()
    input.controller_.view.valueElement.style.width = '100%'

    return input
  })

  colorsInput.forEach((input) => input.dispose())
  colorsInput.splice(0, colorsInput.length)
  colorsInput.push(...inputs)
}

generateColorsInput()

/** pattern */
const patternsFolder = tweakpane.addFolder({ title: 'Pattern' })

patternsFolder.on('fold', () => {
  paneOptions.enablePattern = !paneOptions.enablePattern
  const newOptions = { ...wallpaperOptions }
  if (!paneOptions.enablePattern) {
    delete newOptions.pattern
  }
  paneOptions.stringOptions = JSON.stringify(newOptions, null, 2)
  wallpaper.updatePattern(
    paneOptions.enablePattern ? wallpaperOptions.pattern! : {}
  )

  // prettier-ignore
  const textarea = consolePane.controller_.view.valueElement
    .querySelector<HTMLTextAreaElement>('.tp-mllv_i')!

  const textareaLength = JSON.stringify(newOptions, null, 2).split('\n').length
  textarea.style.height = `calc(var(--bld-us) * ${textareaLength})`
  consolePane.refresh()
})

patternsFolder
  .addInput(wallpaperOptions.pattern!, 'mask')
  .on('change', ({ value }) => {
    patternBlur.disabled = value!
    patternBackground.disabled = !value!
    wallpaper.updatePattern(wallpaperOptions.pattern!)
  })

patternsFolder
  .addInput(paneOptions, 'patternSize', {
    min: 100,
    max: 1000,
    step: 10,
    label: 'size'
  })
  .on('change', ({ value }) => {
    wallpaperOptions.pattern!.size = `${value}px`
    wallpaper.updatePattern(wallpaperOptions.pattern!)
  })

patternsFolder
  .addInput(wallpaperOptions.pattern!, 'opacity', {
    min: 0,
    max: 1,
    step: 0.1
  })
  .on('change', ({ value }) => {
    wallpaperOptions.pattern!.opacity = Number(value!.toFixed(1))
    wallpaper.updatePattern(wallpaperOptions.pattern!)
  })

const patternBlur = patternsFolder
  .addInput(wallpaperOptions.pattern!, 'blur', {
    min: 0,
    max: 5,
    step: 0.1
  })
  .on('change', ({ value }) => {
    wallpaperOptions.pattern!.blur = Number(value!.toFixed(2))
    wallpaper.updatePattern(wallpaperOptions.pattern!)
  })

const patternBackground = patternsFolder
  .addInput(wallpaperOptions.pattern!, 'background', {
    disabled: true
  })
  .on('change', () => {
    wallpaper.updatePattern(wallpaperOptions.pattern!)
  })

const patternsList = patternsFolder.addBlade({
  view: 'list',
  value: PATTERNS[0].path,
  options: PATTERNS.map(({ path, text }) => {
    return {
      text,
      value: path
    }
  })
}) as ListApi<string>

patternsList.on('change', ({ value }) => {
  wallpaperOptions.pattern!.image = value
  wallpaper.updatePattern(wallpaperOptions.pattern!)
})

/** export */
const exportFolder = tweakpane.addFolder({
  title: 'Export',
  expanded: false
})

const consolePane = exportFolder.addMonitor(paneOptions, 'stringOptions', {
  interval: 0,
  lineCount: paneOptions.stringOptions.split('\n').length,
  multiline: true
})

const consoleTextarea =
  consolePane.controller_.view.valueElement.querySelector('textarea')!

consolePane.controller_.view.labelElement.remove()

consolePane.controller_.view.valueElement.style.width = '100%'
consoleTextarea.style.overflow = 'hidden'

const consoleButtonCopy = exportFolder.addButton({ title: 'Copy' })

consoleButtonCopy.on('click', () => {
  consoleTextarea.select()
  navigator.clipboard.writeText(consoleTextarea.value)
  consoleButtonCopy.title = 'Copied'
})

exportFolder.addButton({ title: 'Download' }).on('click', () => {
  const blob = new Blob([JSON.stringify(wallpaperOptions, void 0, 2)], {
    type: 'text/plain'
  })

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'twallpaper-options.json'
  link.click()
  link.remove()
})

/** reset */
tweakpane.addButton({ title: 'Reset' }).on('click', () => {
  merge(wallpaperOptions, paneOptions.copyOptions)
  colorsList.value = 0
  colorsFolder.expanded = true

  paneOptions.patternSize = PATTERN_SIZE
  paneOptions.currentColors = arrayColorToObject(COLORS[0].colors)

  patternsList.value = PATTERNS[0].path
  patternsFolder.expanded = true

  generateColorsInput()
  refreshPaneConsole()
  tweakpane.refresh()
  wallpaper.init(wallpaperOptions)
})

tweakpane.addSeparator()

/** github link */
tweakpane.addButton({ title: 'GitHub' }).on('click', () => {
  window.open('https://github.com/crashmax-dev/twallpaper', '_blank')
})

/** fullscreen */
declare global {
  interface Element {
    webkitRequestFullscreen?(): void
    mozRequestFullScreen?(): void
    msRequestFullscreen?(): void
  }
}

document.addEventListener('keydown', (event) => {
  if (event.code === 'F11') {
    event.preventDefault()

    if (paneOptions.container.requestFullscreen) {
      paneOptions.container.requestFullscreen()
    } else if (paneOptions.container.webkitRequestFullscreen) {
      paneOptions.container.webkitRequestFullscreen()
    } else if (paneOptions.container.mozRequestFullScreen) {
      paneOptions.container.mozRequestFullScreen()
    } else if (paneOptions.container.msRequestFullscreen) {
      paneOptions.container.msRequestFullscreen()
    }
  }
})
