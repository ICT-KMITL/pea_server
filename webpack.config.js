var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : "cheap-module-source-map",
  entry: {
	  vendor: ['babel-polyfill', "axios", "react"],
	  app: ["./frontend/static/jsx/main.jsx"],
	  //html: "./index.html"
  },
  module: {
    loaders: [
	  { test: require.resolve("jquery"), loader: "expose?$!expose?jQuery" },
	  {
		  test: /\.html$/,
		  loader: "file?name=[name].[ext]"
	  },
      {
        test: /\.jsx$/,
        //loader: 'babel-loader'
		exclude: /(node_modules|bower_components)/,
		loader: 'babel'
      },
      { test: /\.scss$/, loaders: ['style', 'css', 'postcss', 'sass'] },
      //{ test: /\.(woff2?|ttf|eot|otf|svg|jpg|png|gif)$/, loader: 'url?limit=10000&name=assets/[hash].[ext]' },
	  { test: /\.(woff2?|ttf|eot|otf|svg|jpg|png|gif|cur)$/,loader: 'url?limit=10000&name=assets/[path][name].[ext]?[hash]' },
	  //{ test: /\.(woff2?|ttf|eot|svg|jpg|png|gif)$/, loader: 'file?name=[path][name].[hash].[ext]' },
      { test: /\.css$/,loader: "style-loader!css-loader" }
    ]
  },
  output: {
	path: path.join(__dirname, "static/js"),
    filename: "main.js",
	publicPath: "/static/js/"
  },
  plugins: debug ? [
	new webpack.optimize.CommonsChunkPlugin(
       /* chunkName= */"vendor", 
       /* filename= */"vendor.bundle.js"
    ),
    new webpack.ProvidePlugin({
        jQuery: 'jquery',
        $: 'jquery',
        jquery: 'jquery',
        Cookies: 'js-cookie',
        CryptoJS: 'crypto-js'
    }),
  ] : [
	new webpack.optimize.CommonsChunkPlugin(
       /* chunkName= */"vendor", 
       /* filename= */"vendor.bundle.js"
    ),
	new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('production')
      }
    }),
	new webpack.ProvidePlugin({
        jQuery: 'jquery',
        $: 'jquery',
        jquery: 'jquery',
        Cookies: 'js-cookie',
        CryptoJS: 'crypto-js'
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
  devServer: {
    historyApiFallback: true
  }
};
