import { SpinnerCircular } from 'spinners-react';

/**Loader .. pass in white/orange prop if you want a different circle
 * 
 * Default (neither white/orange) - black circle
 * 
*/
export default function Loader({size = 30}) {  
  return (
    <SpinnerCircular 
      size={size} 
      thickness={180} 
      speed={99} 
      color={"rgba(0, 0, 0, 1)"} 
      secondaryColor={"rgba(255,255,255,0)"} 
    />
  )
}