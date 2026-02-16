/// <reference types="vite/client" />

type URLString = `http://${string}` | `https://${string}`

interface ImportMetaEnv {
  VITE_API_ROOT: URLString
}
