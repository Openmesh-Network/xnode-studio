import { ClipLoader} from "react-spinners"

const Loading = () => {
  return (
    <div className="spinner w-full h-full flex justify-center items-center">
      <ClipLoader
          color="#0354EC"
          size={80}
          speedMultiplier = {1}
      />
    </div>
  )
}

export default Loading;



// const Loading = () => {
//   return (
//     <>
//       <div className="w-full h-full flex justify-center item-center">
//         <div className="size-24 animate-spin rounded-full border-b-2 border-[]"></div>
//       </div>
//     </>
//   )
// }

// export default Loading;
