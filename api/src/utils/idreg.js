const h = n => `[a-f0-9]{${n}}`

export default name => `:${name}(${h(8)}${`\\-${h(4)}`.repeat(3)}\\-${h(12)})`
