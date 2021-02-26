const isProd = process.env.NODE_ENV === 'production'

module.exports= {
  assetPrefix: isProd ? 'https://muse-amuse.in/~punchagan/uke-tutorials.in' : ''
}
