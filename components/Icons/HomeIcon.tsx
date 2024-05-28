import { IconProps } from '@/utils/icons'

export function HomeIcon({ fill = '#4D4D4D', ...rest }: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.2"
        d="M16.25 9.02618V16.2496M16.25 9.02618L16.25 9.02617L16.25 16.2496M16.25 9.02618L9.99957 3.34375L3.75 9.02616V16.2496M16.25 9.02618L3.75 16.2496M16.25 16.2496L12.4995 16.2491V11.874V11.249H11.8745H8.12454H7.49954V11.874V16.2491L3.75 16.2496M16.25 16.2496H3.75"
        fill={fill}
        stroke={fill}
        strokeWidth="1.25"
      />
      <path
        d="M16.875 16.8747V9.02618C16.875 8.9391 16.8568 8.85298 16.8216 8.77334C16.7863 8.6937 16.7349 8.6223 16.6704 8.56373L10.42 2.8813C10.3049 2.7767 10.155 2.71874 9.99955 2.71875C9.84406 2.71876 9.69416 2.77672 9.57911 2.88132L3.32954 8.56373C3.26511 8.62231 3.21364 8.6937 3.17842 8.77333C3.14319 8.85297 3.125 8.93908 3.125 9.02616V16.8747"
        stroke={fill}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.25 16.875H18.75"
        stroke={fill}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.875 16.875V12.5C11.875 12.3342 11.8092 12.1753 11.6919 12.0581C11.5747 11.9408 11.4158 11.875 11.25 11.875H8.75C8.58424 11.875 8.42527 11.9408 8.30806 12.0581C8.19085 12.1753 8.125 12.3342 8.125 12.5V16.875"
        stroke={fill}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
