import { FC } from "react"

interface TalkiarySVGProps {
  theme: "dark" | "light"
  scale?: number
}

export const TalkiarySVG: FC<TalkiarySVGProps> = ({ theme, scale = 1 }) => {
  return (
    <svg
      width={110 * scale}
      height={108 * scale}
      viewBox="0 0 110 108"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="16.9583"
        y="15.6921"
        width="78.8333"
        height="60"
        fill={`${theme === "dark" ? "#000" : "#fff"}`}
      />
      <path
        d="M9.16669 99V18C9.16669 15.525 10.0643 13.4063 11.8594 11.6438C13.6545 9.88125 15.8125 9 18.3334 9H91.6667C94.1875 9 96.3455 9.88125 98.1407 11.6438C99.9358 13.4063 100.833 15.525 100.833 18V72C100.833 74.475 99.9358 76.5938 98.1407 78.3563C96.3455 80.1188 94.1875 81 91.6667 81H27.5L9.16669 99ZM23.6042 72H91.6667V18H18.3334V77.0625L23.6042 72Z"
        fill={`${theme === "dark" ? "#fff" : "#000"}`}
      />
      <path
        d="M35 65L42 36L57 33L67 43L64 58L35 65ZM35 65L50.172 49.828M69 45L55 31L61 25L75 39L69 45ZM53 43C55.2091 43 57 44.7909 57 47C57 49.2091 55.2091 51 53 51C50.7909 51 49 49.2091 49 47C49 44.7909 50.7909 43 53 43Z"
        stroke={`${theme === "dark" ? "#fff" : "#000"}`}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
