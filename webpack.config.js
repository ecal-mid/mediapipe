import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    mode: "development",
    entry: "./src/index.js",
    output: {
        library: '@ecal-mid/mediapipe',
        libraryTarget: 'umd',
        filename: 'ecalmid-mediapipe.js',
        auxiliaryComment: 'Test Comment',
        path: path.resolve(__dirname, './umd'),
    },
    experiments: {
        outputModule: true,
    },
    resolve: {
        modules: ['node_modules'],
        alias: {
            '~': path.resolve(__dirname, './src')
        }
    },
};